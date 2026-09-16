from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "models" / "kisan_kyu_wait_model.pkl"


# ============================================================
# LOAD MODEL
# ============================================================

model = joblib.load(MODEL_PATH)


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="Kisan Kyu ML API",
    description="Waiting time prediction service for Kisan Kyu",
    version="1.0.0",
)


# ============================================================
# REQUEST SCHEMA
# ============================================================

class WaitPredictionRequest(BaseModel):
    market_name: str
    lot_size_tonnes: float

    queue_length: int
    farmers_ahead: int

    active_counters: int
    total_counters: int
    busy_counters: int

    historical_arrivals_tonnes: float
    arrival_lag_1d: float | None = None
    arrival_avg_7d: float | None = None
    arrival_avg_14d: float | None = None
    arrival_avg_30d: float | None = None
    arrival_max_7d: float | None = None

    avg_modal_price: float | None = None

    month: int
    day_of_week: int
    day_of_year: int


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def root():
    return {
        "service": "Kisan Kyu ML API",
        "status": "running",
        "model": "LightGBM",
    }


# ============================================================
# WAIT TIME PREDICTION
# ============================================================

@app.post("/predict-wait")
def predict_wait(request: WaitPredictionRequest):

    # Create feature dictionary
    data = {
        "market_name": request.market_name,
        "lot_size_tonnes": request.lot_size_tonnes,
        "queue_length": request.queue_length,
        "farmers_ahead": request.farmers_ahead,
        "active_counters": request.active_counters,
        "total_counters": request.total_counters,
        "busy_counters": request.busy_counters,
        "historical_arrivals_tonnes": request.historical_arrivals_tonnes,
        "arrival_lag_1d": request.arrival_lag_1d,
        "arrival_avg_7d": request.arrival_avg_7d,
        "arrival_avg_14d": request.arrival_avg_14d,
        "arrival_avg_30d": request.arrival_avg_30d,
        "arrival_max_7d": request.arrival_max_7d,
        "avg_modal_price": request.avg_modal_price,
        "month": request.month,
        "day_of_week": request.day_of_week,
        "day_of_year": request.day_of_year,
    }

    df = pd.DataFrame([data])

    # Cyclical date features
    df["month_sin"] = np.sin(2 * np.pi * df["month"] / 12)
    df["month_cos"] = np.cos(2 * np.pi * df["month"] / 12)

    df["dow_sin"] = np.sin(2 * np.pi * df["day_of_week"] / 7)
    df["dow_cos"] = np.cos(2 * np.pi * df["day_of_week"] / 7)

    # Ensure market_name is categorical
    df["market_name"] = df["market_name"].astype("category")

    # Feature order used during training
    feature_columns = [
        "market_name",
        "lot_size_tonnes",
        "queue_length",
        "farmers_ahead",
        "active_counters",
        "total_counters",
        "busy_counters",
        "historical_arrivals_tonnes",
        "arrival_lag_1d",
        "arrival_avg_7d",
        "arrival_avg_14d",
        "arrival_avg_30d",
        "arrival_max_7d",
        "avg_modal_price",
        "month",
        "day_of_week",
        "day_of_year",
        "month_sin",
        "month_cos",
        "dow_sin",
        "dow_cos",
    ]

    df = df[feature_columns]

    # Predict
    prediction = model.predict(df)[0]

    # Never return a negative waiting time
    prediction = max(0.0, float(prediction))

    return {
        "predicted_wait_minutes": round(prediction, 2),
        "predicted_wait_display": f"{round(prediction)} minutes",
        "queue_length": request.queue_length,
        "farmers_ahead": request.farmers_ahead,
    }
