from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Papercloudtech Space Mining API")

# Crucial for local development with Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the expected input payload for your ML model
class SpectralData(BaseModel):
    asteroid_id: str
    albedo: float
    eccentricity: float
    semi_major_axis: float
    # We will expand this as we get the dataset

@app.get("/")
def read_root():
    return {"status": "Operational", "service": "Space Mining Engine"}

@app.post("/api/predict")
def predict_class(data: SpectralData):
    # Placeholder for Phase 2 where we load the .pkl model
    return {
        "asteroid_id": data.asteroid_id,
        "predicted_class": "M-Type", 
        "confidence": 0.92
    }

@app.post("/api/valuation")
def calculate_roi(data: SpectralData):
    # Placeholder for Phase 3 Physics/Economic engine
    return {
        "asteroid_id": data.asteroid_id,
        "estimated_value_usd": 5000000000,
        "delta_v_penalty": 0.85,
        "mining_viability": "PRIME TARGET"
    }