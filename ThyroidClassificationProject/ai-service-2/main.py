from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
import pandas as pd
import numpy as np
import os
import uvicorn
import io
from PIL import Image

app = FastAPI(title="Thyroid AI Microservice 2", version="1.0.0")

# Placeholder for CNN model
# In a real scenario, we would load the weights here
# from model import multitask_cnn
# model = multitask_cnn()
# model.load_weights("weights.h5")

@app.get("/")
def read_root():
    return {"status": "online", "model": "TIRADS-CNN", "version": "1.0.0", "description": "Image-based AI Service"}

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
    # TI-RADS Ultrasound Features
    composition: str = None
    echogenicity: str = None
    shape: str = None
    calcification: str = None
    margin: str = None

@app.post("/predict")
def predict(data: ThyroidInput):
    # Determine result based on a combination of TSH and TI-RADS features
    score = 0
    
    # 1. Laboratory contribution (TSH)
    if data.TSH > 4.5 or data.TSH < 0.4:
        score += 2
    
    # 2. Ultrasound contribution (TI-RADS based heuristic)
    ti_rads_points = 0
    if data.composition == "solid": ti_rads_points += 2
    if data.echogenicity == "hypoechoic": ti_rads_points += 2
    if data.echogenicity == "very hypoechoic": ti_rads_points += 3
    if data.shape == "taller-than-wide": ti_rads_points += 3
    if data.calcification == "punctate": ti_rads_points += 3
    if data.margin == "lobulated" or data.margin == "extrathyroidal": ti_rads_points += 3
    
    score += ti_rads_points
    
    if score >= 5:
        result = "Positive - TI-RADS Concern"
        confidence = 0.7 + (min(score, 15) / 50.0)
    else:
        result = "Negative - Benign Presentation"
        confidence = 0.85 + (max(0, 5 - score) / 50.0)

    return {
        "result": result,
        "confidence": round(confidence, 4),
        "probabilities": {
            "Negative": round(1.0 - confidence if result == "Positive" else confidence, 4),
            "Positive": round(confidence if result == "Positive" else 1.0 - confidence, 4)
        },
        "tiRadsScore": ti_rads_points,
        "modelVersion": "CNN-TIRADS-1.0",
        "service": "ai-service-2"
    }

@app.post("/predict-image")
async def predict_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('L')
        image = image.resize((160, 160))
        img_array = np.array(image).astype(np.float32)
        img_array /= 255.0
        
        # Simulate CNN prediction
        # In reality: preds = model.predict(img_array.reshape(1, 160, 160, 1))
        
        return {
            "result": "Negative", # Mock
            "confidence": 0.89,
            "features": {
                "composition": "cystic",
                "echogenicity": "hyperechoic",
                "shape": "wider-than-tall",
                "margins": "smooth"
            },
            "service": "ai-service-2"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
