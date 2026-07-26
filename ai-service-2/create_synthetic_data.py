import numpy as np
import os
import pandas as pd
from PIL import Image

# Create directories
os.makedirs("./data/images-cv", exist_ok=True)
os.makedirs("./data/images-test", exist_ok=True)

# Generate synthetic data
np.random.seed(42)

# Create synthetic CSV data
num_train = 100
num_test = 20

train_data = []
test_data = []

for i in range(num_train):
    train_data.append({
        'ID': f"{i:04d}",
        'Cancer': np.random.choice([0, 1], p=[0.7, 0.3]),
        'Composition': np.random.choice(['cystic', 'spongiform', 'mixed', 'solid', 'complex']),  # 5 classes
        'Echogenicity': np.random.choice(['anechoic', 'hyperechoic', 'isoechoic', 'hypoechoic', 'very hypoechoic']),
        'Shape': np.random.choice(['y', 'n']),
        'Calcs1': np.random.choice(['None', 'punctate', 'macro', 'rim', 'coarse']),  # 5 classes
        'MargA': np.random.choice(['smooth', 'ill-defined', 'lobulated', 'extrathyroidal'])
    })

for i in range(num_test):
    test_data.append({
        'ID': f"{num_train + i:04d}",
        'Cancer': np.random.choice([0, 1], p=[0.7, 0.3]),
        'Composition': np.random.choice(['cystic', 'spongiform', 'mixed', 'solid', 'complex']),  # 5 classes
        'Echogenicity': np.random.choice(['anechoic', 'hyperechoic', 'isoechoic', 'hypoechoic', 'very hypoechoic']),
        'Shape': np.random.choice(['y', 'n']),
        'Calcs1': np.random.choice(['None', 'punctate', 'macro', 'rim', 'coarse']),  # 5 classes
        'MargA': np.random.choice(['smooth', 'ill-defined', 'lobulated', 'extrathyroidal'])
    })

# Save CSV
df_train = pd.DataFrame(train_data)
df_test = pd.DataFrame(test_data)
df_all = pd.concat([df_train, df_test], ignore_index=True)
df_all.to_csv('./data.csv', index=False)

# Generate synthetic images
def generate_synthetic_image(size=(160, 160)):
    # Generate a grayscale image with some texture
    img = np.random.rand(*size).astype(np.float32) * 255
    # Add some structure
    center_x, center_y = size[0] // 2, size[1] // 2
    y, x = np.ogrid[:size[0], :size[1]]
    mask = (x - center_x)**2 + (y - center_y)**2 <= (size[0] // 3)**2
    img[mask] = img[mask] * 0.7 + 50  # Darker center region
    return img

# Generate training images
for i in range(num_train):
    img = generate_synthetic_image()
    img_pil = Image.fromarray(img.astype(np.uint8), mode='L')
    img_pil.save(f"./data/images-cv/{i:04d}_trans.PNG")
    img_pil.save(f"./data/images-cv/{i:04d}_long.PNG")

# Generate test images
for i in range(num_test):
    img = generate_synthetic_image()
    img_pil = Image.fromarray(img.astype(np.uint8), mode='L')
    img_pil.save(f"./data/images-test/{num_train + i:04d}_trans.PNG")
    img_pil.save(f"./data/images-test/{num_train + i:04d}_long.PNG")

print(f"Created synthetic dataset:")
print(f"- {num_train} training images (2 views each)")
print(f"- {num_test} test images (2 views each)")
print(f"- CSV file with labels")
print(f"- Images saved to ./data/images-cv/ and ./data/images-test/")
