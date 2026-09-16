import pandas as pd
from pathlib import Path

# ============================================================
# KISAN KYU - ML DATASET INSPECTION
# ============================================================

DATA_PATH = Path("dataset/kisan_kyu_queue_dataset.csv")

print("=" * 70)
print("KISAN KYU ML DATASET INSPECTION")
print("=" * 70)

# ------------------------------------------------------------
# Load dataset
# ------------------------------------------------------------

print("\nLoading dataset...")

df = pd.read_csv(DATA_PATH)

print(f"Loaded successfully.")
print(f"Rows    : {len(df):,}")
print(f"Columns : {len(df.columns)}")

# ------------------------------------------------------------
# Date information
# ------------------------------------------------------------

df["date"] = pd.to_datetime(df["date"])
df["arrival_timestamp"] = pd.to_datetime(df["arrival_timestamp"])

print("\n" + "=" * 70)
print("DATE RANGE")
print("=" * 70)

print(f"Minimum date : {df['date'].min().date()}")
print(f"Maximum date : {df['date'].max().date()}")

# ------------------------------------------------------------
# Target
# ------------------------------------------------------------

print("\n" + "=" * 70)
print("TARGET")
print("=" * 70)

target = "waiting_time_minutes"

print(f"Target column : {target}")
print(f"Mean          : {df[target].mean():.2f} minutes")
print(f"Median        : {df[target].median():.2f} minutes")
print(f"Minimum       : {df[target].min():.2f} minutes")
print(f"Maximum       : {df[target].max():.2f} minutes")

# ------------------------------------------------------------
# Year distribution
# ------------------------------------------------------------

print("\n" + "=" * 70)
print("RECORDS BY YEAR")
print("=" * 70)

year_counts = df["date"].dt.year.value_counts().sort_index()

print(year_counts.to_string())

# ------------------------------------------------------------
# Missing values
# ------------------------------------------------------------

print("\n" + "=" * 70)
print("MISSING VALUES")
print("=" * 70)

missing = df.isna().sum()
missing = missing[missing > 0].sort_values(ascending=False)

if len(missing) == 0:
    print("No missing values.")
else:
    print(missing.to_string())

# ------------------------------------------------------------
# Potential leakage columns
# ------------------------------------------------------------

print("\n" + "=" * 70)
print("LEAKAGE COLUMNS")
print("=" * 70)

leakage_columns = [
    "processing_start_timestamp",
    "processing_end_timestamp",
    "processing_time_minutes",
]

for column in leakage_columns:
    print(f"BLOCKED → {column}")

# ------------------------------------------------------------
# Feature candidates
# ------------------------------------------------------------

print("\n" + "=" * 70)
print("PREDICTION FEATURES")
print("=" * 70)

blocked = set(leakage_columns)

blocked.add(target)
blocked.add("farmer_number")

features = [
    column
    for column in df.columns
    if column not in blocked
]

for i, column in enumerate(features, 1):
    print(f"{i:2}. {column}")

print("\n" + "=" * 70)
print("INSPECTION COMPLETE")
print("=" * 70)