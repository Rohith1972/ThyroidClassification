import numpy as np
from PIL import Image
import io
from model import multitask_cnn
import os

# Test model loading and inference
MODEL_PATH = "./model/weights.h5"

print("Testing model loading and inference...")

if os.path.exists(MODEL_PATH):
    print(f"Model file found at {MODEL_PATH}")
    
    # Load model
    model = multitask_cnn()
    model.load_weights(MODEL_PATH)
    print("Model loaded successfully")
    
    # Create a test image
    test_img = np.random.rand(160, 160).astype(np.float32) * 255
    test_img = Image.fromarray(test_img.astype(np.uint8), mode='L')
    
    # Preprocess
    img_array = np.array(test_img).astype(np.float32)
    img_array /= 255.0
    img_array -= 0.5
    img_array *= 2.0
    img_array = np.expand_dims(img_array, axis=-1)
    img_array = np.expand_dims(img_array, axis=0)
    
    print(f"Input shape: {img_array.shape}")
    
    # Predict
    predictions = model.predict(img_array, verbose=0)
    
    print(f"Number of outputs: {len(predictions)}")
    print(f"Cancer prediction shape: {predictions[0].shape}, value: {predictions[0][0][0]}")
    print(f"Composition prediction shape: {predictions[1].shape}, values: {predictions[1][0]}")
    print(f"Echogenicity prediction shape: {predictions[2].shape}, values: {predictions[2][0]}")
    print(f"Shape prediction shape: {predictions[3].shape}, value: {predictions[3][0][0]}")
    print(f"Calcification prediction shape: {predictions[4].shape}, values: {predictions[4][0]}")
    print(f"Margin prediction shape: {predictions[5].shape}, values: {predictions[5][0]}")
    
    print("\nInference test completed successfully!")
else:
    print(f"ERROR: Model file not found at {MODEL_PATH}")
