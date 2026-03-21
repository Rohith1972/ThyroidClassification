from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os
import uvicorn
from typing import Dict, Any

app = FastAPI(title="Thyroid AI Microservice 1", version="1.0.0")

# Load the trained model and scaler
try:
    model = joblib.load('thyroid_randomforest_model.pkl')
    scaler = joblib.load('thyroid_scaler.pkl')
    print("Model and scaler loaded successfully!")
except Exception as e:
    print(f"Error loading model/scaler: {e}")
    model = None
    scaler = None

@app.get("/")
def read_root():
    return {
        "status": "online", 
        "model": "RandomForest-Thyroid", 
        "version": "1.0.0", 
        "description": "Lab-based AI Service using TSH, T3, T4, TPO markers"
    }

class ThyroidLabInput(BaseModel):
    age: float
    sex: int  # 0: Female, 1: Male
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

class ThyroidSimpleInput(BaseModel):
    TSH: float
    T3: float
    T4: float
    TPO: float
    age: float
    sex: int  # 0: Female, 1: Male

def prepare_input_data(data: ThyroidLabInput) -> np.ndarray:
    """Prepare input data for prediction"""
    # Convert to DataFrame with expected feature order (matching dataset column names)
    feature_columns = [
        'age', 'sex', 'on thyroxine', 'query on thyroxine', 'on antithyroid medication',
        'sick', 'pregnant', 'thyroid surgery', 'I131 treatment', 'query hypothyroid',
        'query hyperthyroid', 'lithium', 'goitre', 'tumor', 'hypopituitary', 'psych',
        'TSH measured', 'TSH', 'T3 measured', 'TT4 measured', 'TT4',
        'T4U measured', 'T4U', 'FTI measured', 'FTI'
    ]
    
    # Handle missing values with estimates
    
    input_dict = {
        'age': data.age,
        'sex': data.sex,
        'on thyroxine': data.on_thyroxine,
        'query on thyroxine': data.query_on_thyroxine,
        'on antithyroid medication': data.on_antithyroid_medication,
        'sick': data.sick,
        'pregnant': data.pregnant,
        'thyroid surgery': data.thyroid_surgery,
        'I131 treatment': data.I131_treatment,
        'query hypothyroid': data.query_hypothyroid,
        'query hyperthyroid': data.query_hyperthyroid,
        'lithium': data.lithium,
        'goitre': data.goitre,
        'tumor': data.tumor,
        'hypopituitary': data.hypopituitary,
        'psych': data.psych,
        'TSH measured': data.TSH_measured,
        'TSH': data.TSH,
        'T3 measured': data.T3_measured,
        'TT4 measured': data.TT4_measured,
        'TT4': data.TT4,
        'T4U measured': data.T4U_measured,
        'T4U': data.T4U,
        'FTI measured': data.FTI_measured,
        'FTI': data.FTI
    }
    
    # Create DataFrame in correct order
    df = pd.DataFrame([input_dict], columns=feature_columns)
    
    # Scale the features
    if scaler is not None:
        scaled_features = scaler.transform(df)
        return scaled_features
    else:
        return df.values

@app.post("/predict")
def predict(data: ThyroidLabInput):
    """Predict thyroid condition using lab values"""
    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Prepare input data
        input_features = prepare_input_data(data)
        
        # Make prediction
        prediction = model.predict(input_features)[0]
        prediction_proba = model.predict_proba(input_features)[0]
        
        # Interpret results
        result = "Positive" if prediction == 1 else "Negative"
        confidence = float(prediction_proba[prediction])
        
        # Calculate risk factors
        risk_factors = []
        if data.TSH > 4.5:
            risk_factors.append("Elevated TSH (Hypothyroidism)")
        elif data.TSH < 0.4:
            risk_factors.append("Low TSH (Hyperthyroidism)")
        
        if data.TT4 and (data.TT4 > 12.0 or data.TT4 < 4.5):
            risk_factors.append("Abnormal T4 levels")
        
        return {
            "result": result,
            "confidence": round(confidence, 4),
            "probabilities": {
                "Negative": round(float(prediction_proba[0]), 4),
                "Positive": round(float(prediction_proba[1]), 4)
            },
            "risk_factors": risk_factors,
            "lab_values": {
                "TSH": data.TSH,
                "T4": data.TT4
            },
            "modelVersion": "RandomForest-1.0",
            "service": "ai-service-1"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/predict-simple")
def predict_simple(data: ThyroidSimpleInput):
    """Simple prediction using only key lab values"""
    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Create full input from simple data
        full_input = ThyroidLabInput(
            age=data.age,
            sex=data.sex,
            on_thyroxine=0,
            query_on_thyroxine=0,
            on_antithyroid_medication=0,
            sick=0,
            pregnant=0,
            thyroid_surgery=0,
            I131_treatment=0,
            query_hypothyroid=0,
            query_hyperthyroid=0,
            lithium=0,
            goitre=0,
            tumor=0,
            hypopituitary=0,
            psych=0,
            TSH_measured=1,
            TSH=data.TSH,
            T3_measured=1,
            TT4_measured=1,
            TT4=data.T4,
            T4U_measured=1,
            T4U=1.0,  # Default value
            FTI_measured=1,
            FTI=data.T4  # Approximate FTI as T4
        )
        
        return predict(full_input)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simple prediction error: {str(e)}")

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None,
        "service": "ai-service-1"
    }

@app.get("/model-info")
def model_info():
    """Get model information"""
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    return {
        "model_type": "RandomForestClassifier",
        "n_features": len(model.feature_importances_) if hasattr(model, 'feature_importances_') else None,
        "n_estimators": model.n_estimators if hasattr(model, 'n_estimators') else None,
        "feature_importance": {
            f"feature_{i}": float(importance) 
            for i, importance in enumerate(model.feature_importances_[:10])
        } if hasattr(model, 'feature_importances_') else None,
        "service": "ai-service-1"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
