import os
import shutil
import glob
import pandas as pd
import tensorflow as tf
from tensorflow.keras import layers, models

base_dir = r"d:\Mini Project\DataSets\Thyroid Ultrasound Images"
output_dir = r"d:\Mini Project\DataSets\Thyroid Ultrasound Images\Thyroid_Classification_Dataset"

def prepare_dataset():
    # 1. Prepare dataset structure
    for label in ['0', '1', 'unlabeled']:
        os.makedirs(os.path.join(output_dir, label), exist_ok=True)

    image_to_label = {}

    # Process batch 1
    batch1_img_csv = os.path.join(base_dir, "batch1_image.csv")
    batch1_lbl_csv = os.path.join(base_dir, "batch1_image_label.csv")
    if os.path.exists(batch1_img_csv) and os.path.exists(batch1_lbl_csv):
        try:
            df_b1_img = pd.read_csv(batch1_img_csv)
            df_b1_lbl = pd.read_csv(batch1_lbl_csv)
            name_to_label_b1 = dict(zip(df_b1_lbl['patient_name'], df_b1_lbl['histo_label']))
            for _, row in df_b1_img.iterrows():
                # Handling possible header naming issue
                name_col = 'patient_name' if 'patient_name' in row else df_b1_img.columns[0]
                name = row[name_col]
                if name in name_to_label_b1:
                    image_to_label[row['path']] = name_to_label_b1[name]
        except Exception as e:
            print(f"Error parsing batch 1: {e}")

    # Process batch 2
    batch2_img_csv = os.path.join(base_dir, "batch2_image", "batch2_image.csv")
    batch2_lbl_csv = os.path.join(base_dir, "batch2_image", "batch2_image_label.csv")
    if os.path.exists(batch2_img_csv) and os.path.exists(batch2_lbl_csv):
        try:
            df_b2_img = pd.read_csv(batch2_img_csv)
            df_b2_lbl = pd.read_csv(batch2_lbl_csv)
            name_to_label_b2 = dict(zip(df_b2_lbl['patient_name'], df_b2_lbl['histo_label']))
            for _, row in df_b2_img.iterrows():
                name_col = 'patient_name' if 'patient_name' in row else df_b2_img.columns[0]
                name = row[name_col]
                if name in name_to_label_b2:
                    image_to_label[row['path']] = name_to_label_b2[name]
        except Exception as e:
            print(f"Error parsing batch 2: {e}")

    # Copy images
    print("Collecting images and copying to dataset directories...")
    
    # We recursively find all jpg images
    all_images = glob.glob(os.path.join(base_dir, "**", "*.jpg"), recursive=True) + glob.glob(os.path.join(base_dir, "**", "*.Jpg"), recursive=True)
    
    labeled_count = 0
    unlabeled_count = 0
    
    for img_path in all_images:
        # Avoid copying from output_dir itself if it was inside base_dir
        if output_dir in img_path:
            continue
            
        filename = os.path.basename(img_path)
        
        if filename in image_to_label:
            label = str(image_to_label[filename])
            dst_path = os.path.join(output_dir, label, f"{labeled_count}_{filename}")
            if not os.path.exists(dst_path):
                shutil.copy(img_path, dst_path)
            labeled_count += 1
        else:
            dst_path = os.path.join(output_dir, 'unlabeled', f"{unlabeled_count}_{filename}")
            if not os.path.exists(dst_path):
                shutil.copy(img_path, dst_path)
            unlabeled_count += 1

    print(f"Dataset prepared! Copied {labeled_count} labeled images to '0' and '1' classes.")
    print(f"Copied {unlabeled_count} unlabeled images to 'unlabeled' folder.")
    return labeled_count

def build_and_train_model():
    print("Constructing CNN Model for labeled images...")
    img_height, img_width = 128, 128
    batch_size = 32

    # Load dataset natively using keras utility, only mapping to '0' and '1'
    train_ds = tf.keras.utils.image_dataset_from_directory(
        output_dir,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=(img_height, img_width),
        batch_size=batch_size,
        class_names=['0', '1'] # This ensures only labeled data is loaded
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        output_dir,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=(img_height, img_width),
        batch_size=batch_size,
        class_names=['0', '1']
    )

    # Data Augmentation for better generalization
    data_augmentation = tf.keras.Sequential([
        layers.RandomFlip("horizontal_and_vertical"),
        layers.RandomRotation(0.2),
        layers.RandomZoom(0.2),
        layers.RandomContrast(0.2)
    ])

    # Transfer Learning with MobileNetV2 (Much faster for CPU)
    base_model = tf.keras.applications.MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(img_height, img_width, 3)
    )
    # Freeze the base model initially
    base_model.trainable = False

    # Create the model
    inputs = tf.keras.Input(shape=(img_height, img_width, 3))
    x = data_augmentation(inputs)
    x = tf.keras.applications.mobilenet_v2.preprocess_input(x)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(1, activation='sigmoid')(x)
    model = tf.keras.Model(inputs, outputs)

    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
                  loss=tf.keras.losses.BinaryCrossentropy(),
                  metrics=['accuracy'])

    model.summary()

    print("Starting training session for better accuracy (MobileNetV2)...")
    # Train for 3 epochs to be fast on CPU
    history = model.fit(train_ds, validation_data=val_ds, epochs=3)

    print("Training complete. Model constructed successfully.")
    model.save("thyroid_cnn_model.keras")
    print("Model saved to thyroid_cnn_model.keras")

if __name__ == "__main__":
    count = prepare_dataset()
    if count > 0:
        build_and_train_model()
    else:
        print("No labeled images found to train the model on.")
