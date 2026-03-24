import pandas as pd
import numpy as np
import warnings
from sklearn.model_selection import train_test_split
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder

# Settings
warnings.filterwarnings('ignore')
np.random.seed(42)

def main():
    print("--- Thyroid Disease ML Pipeline ---")

    # 1. DATA LOADING
    print("\n[1/5] Loading dataset...")
    df = pd.read_csv('thyroid0387_processed.csv')
    print(f"Dataset loaded successfully with {len(df)} rows and {len(df.columns)} columns.")

    # 2. ENCODING & PREPROCESSING
    print("\n[2/5] Preprocessing and Encoding features...")
    
    # Drop columns that are not useful for prediction or have too many missing values
    # patient_id is unique per patient, TBG is >90% missing
    X = df.drop(columns=['Subtype', 'patient_id', 'TBG', 'TBG_measured'], errors='ignore')
    y = df['Subtype']

    # Manual encoding for clinical binary features (t/f) and sex (M/F)
    # HistGradientBoosting handles NaNs, so we fill with -1 to differentiate from 0/1
    for col in X.columns:
        if X[col].dtype == 'object':
            X[col] = X[col].map({'f': 0, 't': 1, 'M': 1, 'F': 0}).fillna(-1)
    
    # One-hot encode the 'referral_source' if it exists
    if 'referral_source' in X.columns:
        X = pd.get_dummies(X, columns=['referral_source'], drop_first=True)

    # Encode target labels (Normal, Hypothyroid, Hyperthyroid) to numbers
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    class_names = le.classes_

    # 3. TRAIN-TEST SPLIT
    print("\n[3/5] Splitting data into Training (80%) and Testing (20%) sets...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    print(f"Training set size: {len(X_train)}")
    print(f"Testing set size: {len(X_test)}")

    # 4. TRAINING
    print("\n[4/5] Training HistGradientBoosting model...")
    # Using HistGradientBoosting because it handles NaNs natively and is very accurate
    model = HistGradientBoostingClassifier(max_iter=200, max_depth=10, random_state=42)
    model.fit(X_train, y_train)

    # 5. PREDICTION & EVALUATION
    print("\n[5/5] Evaluating model performance...")
    y_pred = model.predict(X_test)

    # Metrics
    accuracy = accuracy_score(y_test, y_pred) * 100
    report = classification_report(y_test, y_pred, target_names=class_names)

    print("-" * 30)
    print(accuracy)
    print("-" * 30)
    print("CLASSIFICATION REPORT:")
    print(report)

if __name__ == "__main__":
    main()
