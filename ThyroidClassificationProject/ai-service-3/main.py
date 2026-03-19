from fastapi import FastAPI, File, UploadFile, HTTPException
import uvicorn
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

app = FastAPI(title="Thyroid AI Image Microservice", version="1.0.0")

MODEL_PATH = "thyroid_cnn_model.keras"
model = None

@app.on_event("startup")
def startup_event():
    global model
    if os.path.exists(MODEL_PATH):
        try:
            model = tf.keras.models.load_model(MODEL_PATH)
            print(f"Loaded model from {MODEL_PATH}")
        except Exception as e:
            print(f"Error loading model: {e}")
    else:
        print(f"Model not found at {MODEL_PATH}")

@app.get("/")
def read_root():
    return {"status": "online", "service": "ai-service-3", "version": "1.0.0"}

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model is not loaded")
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image")
        
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert to RGB if not
        if image.mode != "RGB":
            image = image.convert("RGB")
            
        # Resize to 128x128 as per training logic
        image = image.resize((128, 128))
        
        # Convert to numpy array
        img_array = np.array(image, dtype=np.float32)
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0) # shape: (1, 128, 128, 3)
        
        # Predict
        prediction = model.predict(img_array)
        prob = float(prediction[0][0])
        
        # Map output logic: threshold 0.5
        # As per train script classes are ['0', '1']. 
        # Usually '1' can represent Positive/Malignant, '0' Negative/Benign.
        label = "Positive - Possible Tumor" if prob >= 0.5 else "Negative - Benign"
        
        # Confidence calculation
        confidence = prob if prob >= 0.5 else (1.0 - prob)
        
        return {
            "result": label,
            "confidence": confidence,
            "probabilities": {
                "Negative": 1.0 - prob,
                "Positive": prob
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
