from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import os
import uvicorn
import numpy as np

app = FastAPI(title="HistGB Thyroid Service", version="1.0")

model = None
le = None
exact_cols = None

@app.on_event("startup")
def startup_event():
    global model, le, exact_cols
    model = joblib.load('thyroid_best_model.joblib')
    le = joblib.load('label_encoder.joblib')
    
    # Pre-compute exact columns from the dataset to match feature names
    dummy_df = pd.read_csv('thyroid0387_processed.csv', nrows=1)
    X_dummy = dummy_df.drop(columns=['Subtype', 'patient_id', 'TBG', 'TBG_measured'], errors='ignore')
    for col in X_dummy.columns:
        if X_dummy[col].dtype == 'object':
            X_dummy[col] = X_dummy[col].map({'f': 0, 't': 1, 'M': 1, 'F': 0}).fillna(-1)
            
    if 'referral_source' in X_dummy.columns:
        X_dummy = pd.get_dummies(X_dummy, columns=['referral_source'], drop_first=True)
    exact_cols = X_dummy.columns
    print("HistGB AI Model loaded successfully.")

class ThyroidInput(BaseModel):
    age: float
    sex: int 
    on_thyroxine: int
    query_on_thyroxine: int
    on_antithyroid_medication: int
    sick: int
    pregnant: int
    thyroid_surgery: int
    I131_treatment: int
    query_hypothyroid: int
    query_hyperthyroid: int
    lithium: int
    goitre: int
    tumor: int
    hypopituitary: int
    psych: int
    TSH_measured: int
    TSH: float
    T3_measured: int
    TT4_measured: int
    TT4: float
    T4U_measured: int
    T4U: float
    FTI_measured: int
    FTI: float

@app.get("/")
def root():
    return {"status": "online", "model": "HistGB", "version": "1.0"}

@app.post("/predict")
def predict(data: ThyroidInput):
    if model is None or le is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    input_dict = {
        'age': data.age,
        'sex': data.sex,  # Already numeric (0/1) from Java payload
        'on_thyroxine': data.on_thyroxine,
        'query_on_thyroxine': data.query_on_thyroxine,
        'on_antithyroid_medication': data.on_antithyroid_medication,
        'sick': data.sick,
        'pregnant': data.pregnant,
        'thyroid_surgery': data.thyroid_surgery,
        'I131_treatment': data.I131_treatment,
        'query_hypothyroid': data.query_hypothyroid,
        'query_hyperthyroid': data.query_hyperthyroid,
        'lithium': data.lithium,
        'goitre': data.goitre,
        'tumor': data.tumor,
        'hypopituitary': data.hypopituitary,
        'psych': data.psych,
        'TSH_measured': data.TSH_measured,
        'TSH': data.TSH,
        'T3_measured': data.T3_measured,
        'T3': np.nan,
        'TT4_measured': data.TT4_measured,
        'TT4': data.TT4,
        'T4U_measured': data.T4U_measured,
        'T4U': data.T4U,
        'FTI_measured': data.FTI_measured,
        'FTI': data.FTI,
        'referral_source': 'other' # Base referral source
    }
    
    row_df = pd.DataFrame([input_dict])
    
    # The java backend sends numeric binary for most categorical features.
    # The training dataset mapped 'f'=0, 't'=1, 'F'=0, 'M'=1. Our Java backend sends exactly 0 and 1.
    # We only need to deal with 'referral_source' which gets dummy encoded.
    if 'referral_source' in row_df.columns:
        row_df = pd.get_dummies(row_df, columns=['referral_source'], drop_first=True)
        
    # Standardize columns to match training set exactly
    row_df = row_df.reindex(columns=exact_cols, fill_value=0)
    
    try:
        pred_encoded = model.predict(row_df)[0]
        prob_encoded = model.predict_proba(row_df)[0]
        
        label = le.inverse_transform([pred_encoded])[0]
        
        classes = le.classes_
        probs_dict = {str(classes[i]): round(float(prob_encoded[i]), 4) for i in range(len(classes))}
        
        return {
            "result": str(label),
            "confidence": float(max(prob_encoded)),
            "probabilities": probs_dict,
            "version": "1.0",
            "model": "HistGradientBoosting"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
