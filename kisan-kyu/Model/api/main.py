from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "models" / "kisan_kyu_wait_model.pkl"
DATASET_PATH = BASE_DIR / "dataset" / "kisan_kyu_queue_dataset.csv"


model = joblib.load(MODEL_PATH)

dataset = pd.read_csv(DATASET_PATH)

dataset["date"] = pd.to_datetime(
    dataset["date"],
    errors="coerce"
)

dataset = dataset.sort_values("date").reset_index(drop=True)


app = FastAPI(
    title="Kisan Kyu ML API",
    description="Waiting time prediction service for Kisan Kyu",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class WaitPredictionRequest(BaseModel):
    market_name: str
    lot_size_tonnes: float

    queue_length: int
    farmers_ahead: int

    active_counters: int
    total_counters: int
    busy_counters: int

    prediction_date: str | None = None

@app.get("/")
def root():
    return {
        "service": "Kisan Kyu ML API",
        "status": "running",
        "model": "LightGBM",
    }


def get_historical_features(
    market_name: str,
    prediction_date: pd.Timestamp
):

    market_data = dataset[
        dataset["market_name"].str.lower()
        == market_name.lower()
    ].copy()

    if market_data.empty:
        market_data = dataset.copy()

    market_data = market_data[
        market_data["date"] < prediction_date
    ].sort_values("date")

    if market_data.empty:

        market_data = dataset[
            dataset["market_name"].str.lower()
            == market_name.lower()
        ].copy()

    arrivals = pd.to_numeric(
        market_data["historical_arrivals_tonnes"],
        errors="coerce"
    ).dropna()

    if len(arrivals) == 0:

        historical_arrivals = 0.0
        arrival_lag_1d = 0.0
        arrival_avg_7d = 0.0
        arrival_avg_14d = 0.0
        arrival_avg_30d = 0.0
        arrival_max_7d = 0.0

    else:

        historical_arrivals = float(
            arrivals.iloc[-1]
        )

        arrival_lag_1d = float(
            arrivals.iloc[-2]
        ) if len(arrivals) >= 2 else historical_arrivals

        arrival_avg_7d = float(
            arrivals.tail(7).mean()
        )

        arrival_avg_14d = float(
            arrivals.tail(14).mean()
        )

        arrival_avg_30d = float(
            arrivals.tail(30).mean()
        )

        arrival_max_7d = float(
            arrivals.tail(7).max()
        )

    prices = pd.to_numeric(
        market_data["avg_modal_price"],
        errors="coerce"
    ).dropna()

    if len(prices) > 0:
        avg_modal_price = float(
            prices.tail(30).mean()
        )
    else:
        avg_modal_price = 0.0

    return {
        "historical_arrivals_tonnes":
            historical_arrivals,

        "arrival_lag_1d":
            arrival_lag_1d,

        "arrival_avg_7d":
            arrival_avg_7d,

        "arrival_avg_14d":
            arrival_avg_14d,

        "arrival_avg_30d":
            arrival_avg_30d,

        "arrival_max_7d":
            arrival_max_7d,

        "avg_modal_price":
            avg_modal_price,
    }


@app.post("/predict-wait")
def predict_wait(
    request: WaitPredictionRequest
):

    try:


        if request.prediction_date:

            prediction_date = pd.to_datetime(
                request.prediction_date
            )

        else:

            prediction_date = (
                pd.Timestamp.now().normalize()
            )

        historical = get_historical_features(
            request.market_name,
            prediction_date
        )


        month = prediction_date.month
        day_of_week = prediction_date.dayofweek
        day_of_year = prediction_date.dayofyear

        month_sin = np.sin(
            2 * np.pi * month / 12
        )

        month_cos = np.cos(
            2 * np.pi * month / 12
        )

        dow_sin = np.sin(
            2 * np.pi * day_of_week / 7
        )

        dow_cos = np.cos(
            2 * np.pi * day_of_week / 7
        )


        data = {

            "market_name":
                request.market_name,

            "lot_size_tonnes":
                request.lot_size_tonnes,

            "queue_length":
                request.queue_length,

            "farmers_ahead":
                request.farmers_ahead,

            "active_counters":
                request.active_counters,

            "total_counters":
                request.total_counters,

            "busy_counters":
                request.busy_counters,

            "historical_arrivals_tonnes":
                historical[
                    "historical_arrivals_tonnes"
                ],

            "arrival_lag_1d":
                historical[
                    "arrival_lag_1d"
                ],

            "arrival_avg_7d":
                historical[
                    "arrival_avg_7d"
                ],

            "arrival_avg_14d":
                historical[
                    "arrival_avg_14d"
                ],

            "arrival_avg_30d":
                historical[
                    "arrival_avg_30d"
                ],

            "arrival_max_7d":
                historical[
                    "arrival_max_7d"
                ],

            "avg_modal_price":
                historical[
                    "avg_modal_price"
                ],

            "month":
                month,

            "day_of_week":
                day_of_week,

            "day_of_year":
                day_of_year,

            "month_sin":
                month_sin,

            "month_cos":
                month_cos,

            "dow_sin":
                dow_sin,

            "dow_cos":
                dow_cos,
        }

        df = pd.DataFrame([data])

        # ----------------------------------------------------
        # Categorical feature
        # ----------------------------------------------------

        df["market_name"] = (
            df["market_name"].astype("category")
        )


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

        prediction = model.predict(df)[0]

        prediction = max(
            0.0,
            float(prediction)
        )

        return {

            "predicted_wait_minutes":
                round(prediction, 2),

            "predicted_wait_display":
                f"{round(prediction)} minutes",

            "queue_length":
                request.queue_length,

            "farmers_ahead":
                request.farmers_ahead,

            "market_name":
                request.market_name,

            "prediction_date":
                prediction_date.strftime(
                    "%Y-%m-%d"
                ),
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
