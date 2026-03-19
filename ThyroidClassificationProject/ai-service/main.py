from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import os
import uvicorn

app = FastAPI(title="Thyroid AI Microservice", version="2.0.0")

MODEL_PATH = "model.joblib"
DATA_PATH = "cleaned_dataset_Thyroid1.csv"

# Model loading logic
def get_model():
    if not os.path.exists(MODEL_PATH):
        print("Model not found. Training model...")
        import thyroidmodel
        # The import will trigger the training if it's not guarded by __main__
        # Ensure it saves model.joblib
    return joblib.load(MODEL_PATH)

model = None

@app.on_event("startup")
def startup_event():
    global model
    model = get_model()
    print("AI Model loaded and ready.")

class ThyroidInput(BaseModel):
    age: float
    sex: int  # 0 for Female, 1 for Male (as per model sample)
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
def read_root():
    return {"status": "online", "model": "RandomForest", "version": "2.0.0"}

@app.post("/predict")
def predict(data: ThyroidInput):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Map input to DataFrame columns
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
    
    df = pd.DataFrame([input_dict])
    
    try:
        prediction = model.predict(df)[0]
        probabilities = model.predict_proba(df)[0].tolist()
        
        # Mapping binary prediction to labels
        # Assuming 0 = Negative, 1 = Positive (based on common thyroid datasets)
        # Check thyroidmodel.py if mapping is different
        label = "Positive" if prediction == 1 else "Negative"
        
        return {
            "result": label,
            "confidence": max(probabilities),
            "probabilities": {
                "Negative": probabilities[0],
                "Positive": probabilities[1]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
