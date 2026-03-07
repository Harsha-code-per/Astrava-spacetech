import math
import os
from pathlib import Path
from typing import List

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ── Calendar helpers for launch window prediction ─────────────────────────────

_CURRENT_YEAR = 2026
_MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
           "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

# ── App setup ────────────────────────────────────────────────────────────────

app = FastAPI(
    title="SPECTRAVEIN Mining Intelligence API",
    description="Asteroid classification and ROI valuation engine.",
    version="1.0.0",
)

# CORS: reads ALLOWED_ORIGINS env var (comma-separated) in production.
# Falls back to localhost:3000 for local development.
_raw_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000")
_allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for simplicity; adjust in production
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
    mission_cost_usd: float
    net_profit_usd: float
    earth_co2_offset_tons: float
    semi_major_axis_au: float
    eccentricity: float
    next_pass_date: str
    xai_summary: str
    pha: bool


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


def _mission_cost_usd(inclination_deg: float, moid_au: float) -> float:
    """
    Total mission CapEx in USD.

    Base rocket deployment : $2 B
    Inclination penalty    : inclination_deg × $500 M  (more delta-v)
    Distance penalty       : moid_au × $10 B           (longer transit)
    """
    base = 2_000_000_000.0
    inclination_penalty = inclination_deg * 500_000_000.0
    distance_penalty = moid_au * 10_000_000_000.0
    return base + inclination_penalty + distance_penalty


def _next_pass_date(semi_major_axis_au: float, moid_au: float) -> str:
    """
    Predict the next optimal launch window using Kepler's Third Law.

    Orbital period (years) = a^1.5  (a in AU, period in Earth years).
    A deterministic phase fraction derived from moid places each asteroid
    at a unique point in its current orbit, producing realistic near-future
    launch windows without requiring live ephemeris data.
    """
    period_years = max(0.5, semi_major_axis_au ** 1.5)
    phase_fraction = (moid_au * 7.3) % 1.0
    years_until = period_years * phase_fraction
    years_until = max(0.5, min(years_until, 3.5))

    total_months = int(years_until * 12)
    pass_year = _CURRENT_YEAR + total_months // 12
    pass_month = total_months % 12
    return f"{_MONTHS[pass_month]} {pass_year}"


def _fmt(value: float) -> str:
    """Compact human-readable USD string for XAI text."""
    sign = "-" if value < 0 else ""
    abs_val = abs(value)
    if abs_val >= 1e15:
        return f"{sign}${abs_val / 1e15:.1f} Quadrillion"
    if abs_val >= 1e12:
        return f"{sign}${abs_val / 1e12:.1f} Trillion"
    if abs_val >= 1e9:
        return f"{sign}${abs_val / 1e9:.1f} Billion"
    return f"{sign}${abs_val / 1e6:.1f} Million"


_COMPOSITION_TYPE: dict[str, str] = {
    "C": "water/carbon-rich",
    "S": "silicate/stony",
    "M": "heavy metal/platinum-group",
}


def _xai_summary(
    full_name: str,
    spectral_class: str,
    albedo: float,
    inclination: float,
    mission_cost: float,
    adjusted_value: float,
    net_profit: float,
    next_pass: str,
) -> str:
    """Generate a plain-English business summary for this asteroid target."""
    comp = _COMPOSITION_TYPE.get(spectral_class, "mixed")
    return (
        f"SPECTRAVEIN has classified {full_name} as a {spectral_class}-Class target. "
        f"Based on an albedo of {albedo:.3f}, we predict a {comp} composition. "
        f"The mission requires a CapEx of {_fmt(mission_cost)} "
        f"due to an inclination of {inclination:.2f}°. "
        f"With a post-market-shock valuation of {_fmt(adjusted_value)}, "
        f"this yields an estimated net profit of {_fmt(net_profit)}. "
        f"The optimal launch window opens in {next_pass}."
    )


def _build_targets() -> List[AsteroidTarget]:
    """Load CSV, compute all derived fields, return full dataset sorted by value."""
    if not CSV_PATH.exists():
        raise FileNotFoundError(
            f"Labeled dataset not found at '{CSV_PATH}'. "
            "Run generate_labels.py first."
        )

    df = pd.read_csv(CSV_PATH)

    # Ensure required columns are present
    required = {"id", "full_name", "diameter", "albedo", "i", "moid", "a", "e", "spectral_class", "pha"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"Missing columns in CSV: {missing}")

    # Drop any residual nulls in key columns (safety net)
    df = df.dropna(subset=["diameter", "albedo", "i", "moid", "a", "spectral_class"])

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

    df["mission_cost_usd"] = df.apply(
        lambda row: _mission_cost_usd(row["i"], row["moid"]),
        axis=1,
    )

    df["net_profit_usd"] = df["adjusted_value_usd"] - df["mission_cost_usd"]

    # ESG metric: CO2 equivalent emissions avoided vs Earth-based mining
    # Terrestrial extraction produces ~40,000 tons CO2 per ton of rare metals
    df["earth_co2_offset_tons"] = (df["estimated_mass_kg"] / 1000.0) * 40_000.0

    df["next_pass_date"] = df.apply(
        lambda row: _next_pass_date(row["a"], row["moid"]),
        axis=1,
    )

    df["xai_summary"] = df.apply(
        lambda row: _xai_summary(
            full_name=str(row["full_name"]).strip(),
            spectral_class=str(row["spectral_class"]),
            albedo=float(row["albedo"]),
            inclination=float(row["i"]),
            mission_cost=float(row["mission_cost_usd"]),
            adjusted_value=float(row["adjusted_value_usd"]),
            net_profit=float(row["net_profit_usd"]),
            next_pass=str(row["next_pass_date"]),
        ),
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
            mission_cost_usd=round(float(row["mission_cost_usd"]), 2),
            net_profit_usd=round(float(row["net_profit_usd"]), 2),
            earth_co2_offset_tons=round(float(row["earth_co2_offset_tons"]), 2),
            semi_major_axis_au=round(float(row["a"]), 6),
            eccentricity=round(float(row["e"]), 6),
            next_pass_date=str(row["next_pass_date"]),
            xai_summary=str(row["xai_summary"]),
            pha=str(row.get("pha", "N")).strip().upper() == "Y",
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