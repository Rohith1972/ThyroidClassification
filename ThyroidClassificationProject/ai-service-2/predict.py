import joblib
import pandas as pd
import numpy as np
import warnings
from sklearn.metrics import classification_report, accuracy_score

warnings.filterwarnings('ignore')

def run_prediction():
    print("--- Thyroid Disease Prediction Program ---")
    
    try:
        # 1. Load the Model and Label Encoder
        print("Loading model and encoder...")
        model = joblib.load('thyroid_best_model.joblib')
        le = joblib.load('label_encoder.joblib')
        
        # 2. Load the Dataset for testing
        print("Loading dataset...")
        df = pd.read_csv('thyroid0387_processed.csv')
        
        # 3. Preprocessing (matching the training steps)
        # Drop columns not used in the final model
        X = df.drop(columns=['Subtype', 'patient_id', 'TBG', 'TBG_measured'], errors='ignore')
        y = df['Subtype']
        
        # Standardize categorical encoding (t/f/M/F)
        for col in X.columns:
            if X[col].dtype == 'object':
                X[col] = X[col].map({'f': 0, 't': 1, 'M': 1, 'F': 0}).fillna(-1)
        
        # Handle referral_source one-hot encoding if present
        if 'referral_source' in X.columns:
            X = pd.get_dummies(X, columns=['referral_source'], drop_first=True)
            
        # Ensure column order matches training (important for models like HistGB)
        # We assume the current X matches the training features
        
        # 4. Make Predictions
        print("Running predictions on the dataset...")
        y_pred_encoded = model.predict(X)
        y_pred_labels = le.inverse_transform(y_pred_encoded)
        
        # 5. Show Results
        acc = accuracy_score(y, y_pred_labels) * 100
        print(f"\n✅ Prediction Complete!")
        print(f"Model Accuracy on this data: {acc:.2f}%")
        
        print("\nDetailed Report:")
        print(classification_report(y, y_pred_labels))
        
        # Show a few examples
        results_df = pd.DataFrame({
            'Actual': y,
            'Predicted': y_pred_labels
        })
        print("\nFirst 10 Sample Predictions:")
        print(results_df.head(10))

    except FileNotFoundError as e:
        print(f"Error: Missing file! {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == '__main__':
    run_prediction()
