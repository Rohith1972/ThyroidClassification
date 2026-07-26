# Thyroid AI Service 2 - Production Deployment Guide

## Overview

This is a production-ready FastAPI microservice for thyroid nodule classification using a multi-task CNN model trained on ultrasound images. The service provides both tabular data prediction and image-based prediction endpoints.

## Model Information

- **Model Type**: Multi-task CNN for TI-RADS feature classification
- **Input**: 160x160 grayscale ultrasound images
- **Outputs**: 
  - Cancer probability (malignancy)
  - Composition (5 classes)
  - Echogenicity (5 classes)
  - Shape (taller-than-wide vs wider-than-tall)
  - Calcification (5 classes)
  - Margin (4 classes)
- **Model File**: `model/weights.h5`
- **Training**: Trained on synthetic dataset (100 training samples, 20 test samples)

## Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Verify model file exists:
```bash
ls model/weights.h5
```

## Running the Service

### Development Mode

```bash
python main.py
```

The service will start on `http://0.0.0.0:8001`

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8001 --workers 4
```

### Docker Deployment

Build the image:
```bash
docker build -t thyroid-ai-service-2 .
```

Run the container:
```bash
docker run -p 8001:8001 thyroid-ai-service-2
```

## API Endpoints

### Health Check

```bash
GET /health
```

Response:
```json
{
  "status": "healthy",
  "service": "ai-service-2",
  "model_status": "loaded"
}
```

### Tabular Data Prediction

```bash
POST /predict
Content-Type: application/json
```

Request body with thyroid lab values and TI-RADS features:
```json
{
  "age": 45.0,
  "sex": 1,
  "TSH": 3.5,
  "composition": "solid",
  "echogenicity": "hypoechoic",
  "shape": "taller-than-wide",
  "calcification": "punctate",
  "margin": "lobulated"
}
```

### Image Prediction

```bash
POST /predict-image
Content-Type: multipart/form-data
```

Upload a grayscale ultrasound image (PNG format, recommended 160x160).

Response:
```json
{
  "result": "Negative",
  "confidence": 0.8199,
  "probabilities": {
    "Negative": 0.8199,
    "Positive": 0.1801
  },
  "features": {
    "composition": "spongiform",
    "echogenicity": "hypoechoic",
    "shape": "taller-than-wide",
    "calcification": "coarse",
    "margin": "smooth"
  },
  "modelVersion": "CNN-TIRADS-1.0",
  "service": "ai-service-2"
}
```

## Monitoring

The service includes structured logging at INFO level. Logs include:
- Model loading status
- Prediction requests
- Errors and warnings
- Fallback mode activation

## Error Handling

- If the model file is missing, the service falls back to heuristic predictions
- Invalid image uploads return HTTP 500 with error details
- All endpoints include try-catch blocks with proper error logging

## Performance Considerations

- Model loading happens at startup to avoid cold-start delays
- Image preprocessing is optimized for 160x160 grayscale images
- Consider using GPU for TensorFlow if available
- Use uvicorn with multiple workers for production load

## Security

- In production, add authentication middleware
- Use HTTPS/TLS for encrypted communication
- Implement rate limiting to prevent abuse
- Validate all input data

## Troubleshooting

### Model not loading
- Check that `model/weights.h5` exists
- Verify TensorFlow/Keras versions match requirements.txt
- Check logs for specific error messages

### Service won't start
- Ensure port 8001 is available
- Check that all dependencies are installed
- Verify Python version compatibility

### Prediction errors
- Ensure uploaded images are grayscale PNG format
- Check image dimensions (recommended 160x160)
- Verify tabular data includes all required fields

## Support

For issues or questions, refer to the original research paper:
```
@article{buda2019evaluation,
  title={Evaluation of Thyroid Nodules Seen on Ultrasound: Comparison of Deep Learning to Radiologists Using ACR TI-RADS},
  author={Buda, Mateusz and Wildman-Tobriner, Benjamin and Hoang, Jenny K and others},
  journal={Radiology},
  year={2019}
}
```
