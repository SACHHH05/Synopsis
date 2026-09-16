import pandas as pd
import numpy as np
import lightgbm as lgb
import joblib

from pathlib import Path
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "dataset" / "kisan_kyu_queue_dataset.csv"
MODEL_DIR = BASE_DIR / "models"
RESULTS_DIR = BASE_DIR / "results"
PREDICTIONS_DIR = BASE_DIR / "predictions"

MODEL_DIR.mkdir(exist_ok=True)
RESULTS_DIR.mkdir(exist_ok=True)
PREDICTIONS_DIR.mkdir(exist_ok=True)


print("=" * 70)
print("KISAN KYU - WAITING TIME PREDICTION")
print("=" * 70)

print("\n[1] LOADING DATASET")
print("-" * 70)

df = pd.read_csv(DATA_PATH)

print(f"Rows loaded: {len(df):,}")
print(f"Columns    : {len(df.columns)}")


print("\n[2] PREPARING DATES")
print("-" * 70)

df["date"] = pd.to_datetime(df["date"])
df["arrival_timestamp"] = pd.to_datetime(df["arrival_timestamp"])

df = df.sort_values("date").reset_index(drop=True)

print(f"Date range: {df['date'].min().date()} → {df['date'].max().date()}")


TARGET = "waiting_time_minutes"


print("\n[3] SELECTING FEATURES")
print("-" * 70)

LEAKAGE_COLUMNS = [
    "processing_start_timestamp",
    "processing_end_timestamp",
    "processing_time_minutes",
]

EXCLUDED_COLUMNS = [
    TARGET,
    "farmer_number",
    "date",
    "arrival_timestamp",
    *LEAKAGE_COLUMNS,
]

FEATURE_COLUMNS = [
    column
    for column in df.columns
    if column not in EXCLUDED_COLUMNS
]

print("Features used:")

for i, column in enumerate(FEATURE_COLUMNS, 1):
    print(f"{i:2}. {column}")

         
print("\n[4] PREPARING CATEGORICAL FEATURES")
print("-" * 70)

df["market_name"] = df["market_name"].astype("category")

categorical_features = ["market_name"]

print("Categorical features:")
for column in categorical_features:
    print(f" - {column}")

print("\n[5] HANDLING MISSING VALUES")
print("-" * 70)

numeric_features = [
    column
    for column in FEATURE_COLUMNS
    if column not in categorical_features
]

print("Missing values retained as NaN.")
print("LightGBM handles them natively.")

print("\n[6] TIME-BASED SPLIT")
print("-" * 70)

train_mask = df["date"].dt.year <= 2022
validation_mask = df["date"].dt.year.isin([2023, 2024])
test_mask = df["date"].dt.year == 2025

train_df = df[train_mask].copy()
validation_df = df[validation_mask].copy()
test_df = df[test_mask].copy()

print(f"Training   : {len(train_df):,} rows")
print(f"Validation : {len(validation_df):,} rows")
print(f"Test       : {len(test_df):,} rows")

print(
    f"Training years   : "
    f"{train_df['date'].dt.year.min()} → "
    f"{train_df['date'].dt.year.max()}"
)

print(
    f"Validation years : "
    f"{validation_df['date'].dt.year.min()} → "
    f"{validation_df['date'].dt.year.max()}"
)

print(
    f"Test year        : "
    f"{test_df['date'].dt.year.min()}"
)



X_train = train_df[FEATURE_COLUMNS]
y_train = train_df[TARGET]

X_validation = validation_df[FEATURE_COLUMNS]
y_validation = validation_df[TARGET]

X_test = test_df[FEATURE_COLUMNS]
y_test = test_df[TARGET]

print("\n[7] QUEUEING BASELINE")
print("-" * 70)

estimated_processing_time = (
    train_df["processing_time_minutes"].mean()
)

print(
    f"Estimated historical processing time: "
    f"{estimated_processing_time:.2f} minutes"
)

def queueing_prediction(data):
    prediction = (
        data["farmers_ahead"]
        * estimated_processing_time
        / data["active_counters"].clip(lower=1)
    )

    return prediction.clip(lower=0)


baseline_predictions = queueing_prediction(test_df)


baseline_mae = mean_absolute_error(
    y_test,
    baseline_predictions
)

baseline_rmse = np.sqrt(
    mean_squared_error(
        y_test,
        baseline_predictions
    )
)

baseline_r2 = r2_score(
    y_test,
    baseline_predictions
)

print(f"Baseline MAE  : {baseline_mae:.3f} minutes")
print(f"Baseline RMSE : {baseline_rmse:.3f} minutes")
print(f"Baseline R²   : {baseline_r2:.4f}")

print("\n[8] TRAINING LIGHTGBM")
print("-" * 70)

model = lgb.LGBMRegressor(
    objective="regression",

    n_estimators=1000,

    learning_rate=0.03,

    num_leaves=31,

    max_depth=-1,

    min_child_samples=30,

    subsample=0.8,

    colsample_bytree=0.8,

    reg_alpha=0.1,

    reg_lambda=0.1,

    random_state=42,

    n_jobs=-1,

    verbosity=-1,
)


model.fit(
    X_train,
    y_train,

    eval_set=[
        (X_train, y_train),
        (X_validation, y_validation),
    ],

    eval_names=[
        "train",
        "validation",
    
    ],

    categorical_feature=categorical_features,

    callbacks=[
        lgb.early_stopping(
            stopping_rounds=50,
            verbose=True
        )
    ],
)


print("\n[9] EVALUATING ON 2025 TEST DATA")
print("-" * 70)

predictions = model.predict(X_test)

predictions = np.maximum(predictions, 0)

mae = mean_absolute_error(
    y_test,
    predictions
)

rmse = np.sqrt(
    mean_squared_error(
        y_test,
        predictions
    )
)

r2 = r2_score(
    y_test,
    predictions
)


print("\nLightGBM Results:")
print(f"MAE  : {mae:.3f} minutes")
print(f"RMSE : {rmse:.3f} minutes")
print(f"R²   : {r2:.4f}")

print("\n[10] MODEL COMPARISON")
print("-" * 70)

print(
    f"{'Metric':<10}"
    f"{'Baseline':>15}"
    f"{'LightGBM':>15}"
)

print("-" * 40)

print(
    f"{'MAE':<10}"
    f"{baseline_mae:>15.3f}"
    f"{mae:>15.3f}"
)

print(
    f"{'RMSE':<10}"
    f"{baseline_rmse:>15.3f}"
    f"{rmse:>15.3f}"
)

print(
    f"{'R²':<10}"
    f"{baseline_r2:>15.4f}"
    f"{r2:>15.4f}"
)

print("\n[11] FEATURE IMPORTANCE")
print("-" * 70)

importance = pd.DataFrame({
    "feature": FEATURE_COLUMNS,
    "importance": model.feature_importances_,
})

importance = importance.sort_values(
    "importance",
    ascending=False
)

print(
    importance.to_string(index=False)
)

importance_path = (
    RESULTS_DIR / "feature_importance.csv"
)

importance.to_csv(
    importance_path,
    index=False
)

print("\n[12] SAVING PREDICTIONS")
print("-" * 70)

prediction_output = test_df[
    [
        "market_name",
        "date",
        "arrival_timestamp",
        "lot_size_tonnes",
        "queue_length",
        "farmers_ahead",
        "active_counters",
        "busy_counters",
        TARGET,
    ]
].copy()

prediction_output["predicted_waiting_time_minutes"] = predictions

prediction_output["absolute_error_minutes"] = np.abs(
    prediction_output[TARGET]
    - prediction_output["predicted_waiting_time_minutes"]
)

prediction_path = (
    PREDICTIONS_DIR / "test_predictions_2025.csv"
)

prediction_output.to_csv(
    prediction_path,
    index=False
)

print(f"Saved: {prediction_path}")

print("\n[13] SAVING MODEL")
print("-" * 70)

model_path = MODEL_DIR / "kisan_kyu_wait_model.pkl"

joblib.dump(
    model,
    model_path
)

print(f"Saved: {model_path}")


metrics = pd.DataFrame([
    {
        "model": "Queueing Baseline",
        "MAE_minutes": baseline_mae,
        "RMSE_minutes": baseline_rmse,
        "R2": baseline_r2,
    },
    {
        "model": "LightGBM",
        "MAE_minutes": mae,
        "RMSE_minutes": rmse,
        "R2": r2,
    },
])

metrics_path = RESULTS_DIR / "model_metrics.csv"

metrics.to_csv(
    metrics_path,
    index=False
)

print("\n[14] SAMPLE PREDICTIONS")
print("-" * 70)

sample = prediction_output[
    [
        "market_name",
        "arrival_timestamp",
        "queue_length",
        "farmers_ahead",
        TARGET,
        "predicted_waiting_time_minutes",
    ]
].head(10)

print(sample.to_string(index=False))

print("\n" + "=" * 70)
print("MODEL TRAINING COMPLETE")
print("=" * 70)

print(f"""
Model:
    {model_path}

Predictions:
    {prediction_path}

Metrics:
    {metrics_path}

Feature importance:
    {importance_path}
""")