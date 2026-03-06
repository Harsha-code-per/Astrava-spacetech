import math
from pathlib import Path
from typing import List

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ── App setup ────────────────────────────────────────────────────────────────

app = FastAPI(
    title="SPECTRAVEIN Mining Intelligence API",
    description="Asteroid classification and ROI valuation engine.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Constants ─────────────────────────────────────────────────────────────────

CSV_PATH = Path(__file__).parent / "asteroid_labeled.csv"

# Bulk density in kg/km³ (matches the spectral class physical models)
DENSITY: dict[str, float] = {
    "C": 1.38e12,   # Carbonaceous — porous, volatile-rich
    "S": 2.71e12,   # Silicaceous  — stony-iron
    "M": 5.32e12,   # Metallic     — iron-nickel core
}

# Commodity multiplier in USD per kg (simplified economic model)
VALUE_PER_KG: dict[str, float] = {
    "C": 2.0,    # Water / organics — lower commodity price
    "S": 10.0,   # Mixed metals + silicates
    "M": 50.0,   # Platinum-group metals dominant
}

# ── Pydantic response model ───────────────────────────────────────────────────

class AsteroidTarget(BaseModel):
    id: str
    full_name: str
    diameter_km: float
    albedo: float
    inclination: float
    moid: float
    spectral_class: str
    accessibility_score: float
    estimated_mass_kg: float
    estimated_value_usd: float
    adjusted_value_usd: float


# ── Helper functions ──────────────────────────────────────────────────────────

def _sphere_volume_km3(diameter_km: float) -> float:
    """Volume of a sphere given diameter in km."""
    radius = diameter_km / 2.0
    return (4.0 / 3.0) * math.pi * (radius ** 3)


def _mass_kg(diameter_km: float, spectral_class: str) -> float:
    """Estimated mass in kg using class-specific bulk density."""
    volume = _sphere_volume_km3(diameter_km)
    density = DENSITY.get(spectral_class, DENSITY["S"])
    return volume * density


def _value_usd(mass_kg: float, spectral_class: str) -> float:
    """Gross valuation in USD based on class commodity multiplier."""
    multiplier = VALUE_PER_KG.get(spectral_class, VALUE_PER_KG["S"])
    return mass_kg * multiplier


def _accessibility_score(inclination_deg: float) -> float:
    """
    Accessibility score 0–100.
    Lower orbital inclination → less delta-v needed → higher score.
    """
    return max(0.0, 100.0 - inclination_deg * 2.0)


def _market_shock_deflator(mass_kg: float, base_value_usd: float) -> float:
    """
    Market Shock Deflator — logarithmic penalty for asteroid mass.

    Flooding the market with an entire asteroid's worth of platinum would
    collapse commodity prices. This factor compresses valuations non-linearly:
    small asteroids receive near full value; planet-scale deposits are
    heavily discounted.

    Penalty factor = 0.1 + 0.9 / (1 + log10(max(1, mass_kg / 1e9)))
    """
    penalty = 0.1 + (0.9 / (1.0 + math.log10(max(1.0, mass_kg / 1e9))))
    return base_value_usd * penalty


def _build_targets() -> List[AsteroidTarget]:
    """Load CSV, compute all derived fields, return full dataset sorted by value."""
    if not CSV_PATH.exists():
        raise FileNotFoundError(
            f"Labeled dataset not found at '{CSV_PATH}'. "
            "Run generate_labels.py first."
        )

    df = pd.read_csv(CSV_PATH)

    # Ensure required columns are present
    required = {"id", "full_name", "diameter", "albedo", "i", "moid", "spectral_class"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"Missing columns in CSV: {missing}")

    # Drop any residual nulls in key columns (safety net)
    df = df.dropna(subset=["diameter", "albedo", "i", "moid", "spectral_class"])

    # ── Derived columns ──────────────────────────────────────────────────────
    df["accessibility_score"] = df["i"].apply(_accessibility_score)

    df["estimated_mass_kg"] = df.apply(
        lambda row: _mass_kg(row["diameter"], row["spectral_class"]),
        axis=1,
    )

    df["estimated_value_usd"] = df.apply(
        lambda row: _value_usd(row["estimated_mass_kg"], row["spectral_class"]),
        axis=1,
    )

    df["adjusted_value_usd"] = df.apply(
        lambda row: _market_shock_deflator(row["estimated_mass_kg"], row["estimated_value_usd"]),
        axis=1,
    )

    # ── Return full dataset, sorted by value descending ─────────────────────
    df_sorted = df.sort_values("estimated_value_usd", ascending=False).reset_index(drop=True)

    targets = [
        AsteroidTarget(
            id=str(row["id"]).strip(),
            full_name=str(row["full_name"]).strip(),
            diameter_km=round(float(row["diameter"]), 4),
            albedo=round(float(row["albedo"]), 4),
            inclination=round(float(row["i"]), 4),
            moid=round(float(row["moid"]), 6),
            spectral_class=str(row["spectral_class"]),
            accessibility_score=round(float(row["accessibility_score"]), 2),
            estimated_mass_kg=round(float(row["estimated_mass_kg"]), 2),
            estimated_value_usd=round(float(row["estimated_value_usd"]), 2),
            adjusted_value_usd=round(float(row["adjusted_value_usd"]), 2),
        )
        for _, row in df_sorted.iterrows()
    ]

    return targets


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
def health_check():
    return {"status": "Operational", "service": "SPECTRAVEIN Mining Intelligence API"}


@app.get("/api/targets", response_model=List[AsteroidTarget])
def get_targets():
    """
    Returns all labeled Near-Earth Asteroid mining targets (full dataset),
    sorted by estimated_value_usd descending. Pagination/filtering is
    handled client-side.
    """
    try:
        return _build_targets()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Processing error: {exc}")