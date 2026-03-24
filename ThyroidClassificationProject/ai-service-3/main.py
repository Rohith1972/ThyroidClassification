import io
import base64
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict
import uvicorn
import os

app = FastAPI(title="Thyroid AI Microservice 3 (CNN)", version="1.0.0")

# Loading the PyTorch model
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'best_model_72_percent.pth')
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def create_model():
    model = models.resnet50(weights=None)
    model.fc = nn.Sequential(
        nn.Dropout(p=0.5),
        nn.Linear(2048, 2)
    )
    return model

model = None
try:
    if os.path.exists(MODEL_PATH):
        model = create_model()
        model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
        model.to(device)
        model.eval()
        print(f"Model loaded successfully from {MODEL_PATH}")
    else:
        print(f"Warning: Model file not found at {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}")

# Image Transform
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

class PredictionInput(BaseModel):
    # Base attributes
    age: float = 0
    sex: int = 0
    ultrasoundImageBase64: Optional[str] = None
    
    # Lab Flags just to allow parsing
    on_thyroxine: int = 0
    query_on_thyroxine: int = 0
    on_antithyroid_medication: int = 0
    sick: int = 0
    pregnant: int = 0
    thyroid_surgery: int = 0
    I131_treatment: int = 0
    query_hypothyroid: int = 0
    query_hyperthyroid: int = 0
    lithium: int = 0
    goitre: int = 0
    tumor: int = 0
    hypopituitary: int = 0
    psych: int = 0

    TSH_measured: int = 0
    TSH: float = 0.0
    T3_measured: int = 0
    TT4_measured: int = 0
    TT4: float = 0.0
    T4U_measured: int = 0
    T4U: float = 0.0
    FTI_measured: int = 0
    FTI: float = 0.0

@app.get("/")
def read_root():
    return {
        "status": "online",
        "model": "ResNet-50-Ultrasound",
        "version": "1.0.0",
        "description": "Deep Learning CNN for Thyroid Ultrasound Images"
    }

@app.post("/predict")
def predict(data: PredictionInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded.")
    if not data.ultrasoundImageBase64:
        raise HTTPException(status_code=400, detail="ultrasoundImageBase64 payload is missing or empty.")

    try:
        # Determine prefix and clean
        b64_string = data.ultrasoundImageBase64
        if "base64," in b64_string:
            b64_string = b64_string.split("base64,")[1]

        image_data = base64.b64decode(b64_string)
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        
        # Transform and predict
        input_tensor = transform(image).unsqueeze(0).to(device)
        
        with torch.no_grad():
            outputs = model(input_tensor)
            probs = torch.nn.functional.softmax(outputs, dim=1)[0]
            
        prediction_val = torch.argmax(probs).item()
        
        # 0 = Benign/Negative, 1 = Malignant/Positive
        result = "Positive" if prediction_val == 1 else "Negative"
        confidence = float(probs[prediction_val])

        return {
            "result": result,
            "confidence": round(confidence, 4),
            "probabilities": {
                "Negative": round(float(probs[0]), 4),
                "Positive": round(float(probs[1]), 4)
            },
            "risk_factors": ["High suspicion based on image morphology"] if result == "Positive" else ["No significant morphological anomalies detected"],
            "lab_values": {},
            "modelVersion": "ResNet50-72pct",
            "service": "ai-service-3"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
