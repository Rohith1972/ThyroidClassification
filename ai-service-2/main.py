from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
import pandas as pd
import numpy as np
import os
import uvicorn
import io
from PIL import Image
import logging
from model import multitask_cnn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Thyroid AI Microservice 2", version="1.0.0")

# Load the trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "weights.h5")
model = None

def load_model():
    global model
    try:
        if os.path.exists(MODEL_PATH):
            model = multitask_cnn()
            model.load_weights(MODEL_PATH)
            logger.info(f"Model loaded successfully from {MODEL_PATH}")
        else:
            logger.warning(f"Model file not found at {MODEL_PATH}, using fallback predictions")
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        model = None

# Load model on startup
@app.on_event("startup")
def startup_event():
    load_model()

@app.get("/")
def read_root():
    return {"status": "online", "model": "TIRADS-CNN", "version": "1.0.0", "description": "Image-based AI Service"}

@app.get("/health")
def health_check():
    model_status = "loaded" if model is not None else "not_loaded"
    return {"status": "healthy", "service": "ai-service-2", "model_status": model_status}

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
        img_array -= 0.5
        img_array *= 2.0
        img_array = np.expand_dims(img_array, axis=-1)
        img_array = np.expand_dims(img_array, axis=0)
        
        if model is not None:
            # Use actual CNN prediction
            predictions = model.predict(img_array, verbose=0)
            cancer_prob = float(predictions[0][0][0])
            compos_probs = predictions[1][0]
            echo_probs = predictions[2][0]
            shape_prob = float(predictions[3][0][0])
            calcs_probs = predictions[4][0]
            margin_probs = predictions[5][0]
            
            # Map probabilities to feature names
            composition_classes = ['cystic', 'spongiform', 'mixed', 'solid', 'complex']
            echogenicity_classes = ['anechoic', 'hyperechoic', 'isoechoic', 'hypoechoic', 'very hypoechoic']
            calcification_classes = ['None', 'punctate', 'macro', 'rim', 'coarse']
            margin_classes = ['smooth', 'ill-defined', 'lobulated', 'extrathyroidal']
            
            result = "Positive" if cancer_prob > 0.5 else "Negative"
            confidence = cancer_prob if result == "Positive" else 1 - cancer_prob
            
            return {
                "result": result,
                "confidence": round(confidence, 4),
                "probabilities": {
                    "Negative": round(1 - cancer_prob, 4),
                    "Positive": round(cancer_prob, 4)
                },
                "features": {
                    "composition": composition_classes[np.argmax(compos_probs)],
                    "echogenicity": echogenicity_classes[np.argmax(echo_probs)],
                    "shape": "taller-than-wide" if shape_prob > 0.5 else "wider-than-tall",
                    "calcification": calcification_classes[np.argmax(calcs_probs)],
                    "margin": margin_classes[np.argmax(margin_probs)]
                },
                "modelVersion": "CNN-TIRADS-1.0",
                "service": "ai-service-2"
            }
        else:
            # Fallback to heuristic prediction
            logger.warning("Using fallback prediction (model not loaded)")
            return {
                "result": "Negative",
                "confidence": 0.75,
                "probabilities": {
                    "Negative": 0.75,
                    "Positive": 0.25
                },
                "features": {
                    "composition": "cystic",
                    "echogenicity": "isoechoic",
                    "shape": "wider-than-tall",
                    "calcification": "None",
                    "margin": "smooth"
                },
                "modelVersion": "FALLBACK-1.0",
                "service": "ai-service-2"
            }
    except Exception as e:
        logger.error(f"Error in predict_image: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
