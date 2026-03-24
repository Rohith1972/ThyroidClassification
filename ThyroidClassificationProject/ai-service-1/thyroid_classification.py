import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, roc_auc_score
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

def load_and_explore_data():
    """Load the cleaned thyroid dataset and explore its structure"""
    print("Loading thyroid dataset...")
    df = pd.read_csv('cleaned_dataset_Thyroid1.csv')
    
    print(f"Dataset shape: {df.shape}")
    print(f"Columns: {list(df.columns)}")
    print("\nTarget variable distribution:")
    print(df['binaryClass'].value_counts())
    print(f"\nClass distribution: {df['binaryClass'].value_counts(normalize=True)*100}")
    
    return df

def preprocess_data(df):
    """Preprocess the data for modeling"""
    print("\nPreprocessing data...")
    
    # Check for missing values
    print("Missing values per column:")
    print(df.isnull().sum())
    
    # Handle missing values in numeric columns
    numeric_columns = df.select_dtypes(include=[np.number]).columns
    for col in numeric_columns:
        if df[col].isnull().sum() > 0:
            df[col].fillna(df[col].median(), inplace=True)
    
    # Separate features and target
    X = df.drop('binaryClass', axis=1)
    y = df['binaryClass']
    
    print(f"Features shape: {X.shape}")
    print(f"Target shape: {y.shape}")
    
    return X, y

def split_and_scale_data(X, y):
    """Split data into train/test sets and scale features"""
    print("\nSplitting data into train and test sets...")
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"Training set shape: {X_train.shape}")
    print(f"Test set shape: {X_test.shape}")
    print(f"Training set class distribution: {y_train.value_counts(normalize=True)*100}")
    print(f"Test set class distribution: {y_test.value_counts(normalize=True)*100}")
    
    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    return X_train_scaled, X_test_scaled, y_train, y_test, scaler

def train_random_forest(X_train, y_train):
    """Train RandomForest classifier"""
    print("\nTraining RandomForest classifier...")
    
    # Create and train the model
    rf_model = RandomForestClassifier(
        n_estimators=200,
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42,
        class_weight='balanced'  # Handle class imbalance
    )
    
    rf_model.fit(X_train, y_train)
    
    print("RandomForest model trained successfully!")
    return rf_model

def evaluate_model(model, X_test, y_test):
    """Evaluate the model performance"""
    print("\nEvaluating model performance...")
    
    # Make predictions
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    # Calculate metrics
    accuracy = accuracy_score(y_test, y_pred)
    auc_score = roc_auc_score(y_test, y_pred_proba)
    
    print(f"Accuracy: {accuracy:.4f}")
    print(f"AUC-ROC Score: {auc_score:.4f}")
    
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    print("\nConfusion Matrix:")
    cm = confusion_matrix(y_test, y_pred)
    print(cm)
    
    # Plot confusion matrix
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=['Negative (0)', 'Positive (1)'],
                yticklabels=['Negative (0)', 'Positive (1)'])
    plt.title('Confusion Matrix')
    plt.ylabel('Actual')
    plt.xlabel('Predicted')
    plt.tight_layout()
    plt.savefig('confusion_matrix.png', dpi=300, bbox_inches='tight')
    # plt.show()
    
    return accuracy, auc_score, y_pred, y_pred_proba

def feature_importance(model, feature_names):
    """Display and plot feature importance"""
    print("\nFeature Importance:")
    
    # Get feature importance
    importance = model.feature_importances_
    feature_importance_df = pd.DataFrame({
        'feature': feature_names,
        'importance': importance
    }).sort_values('importance', ascending=False)
    
    print(feature_importance_df.head(10))
    
    # Plot feature importance
    plt.figure(figsize=(12, 8))
    top_features = feature_importance_df.head(15)
    sns.barplot(data=top_features, x='importance', y='feature')
    plt.title('Top 15 Feature Importance')
    plt.xlabel('Importance')
    plt.tight_layout()
    plt.savefig('feature_importance.png', dpi=300, bbox_inches='tight')
    # plt.show()
    
    return feature_importance_df

def save_model_and_scaler(model, scaler):
    """Save the trained model and scaler"""
    import joblib
    
    print("\nSaving model and scaler...")
    joblib.dump(model, 'thyroid_randomforest_model.pkl')
    joblib.dump(scaler, 'thyroid_scaler.pkl')
    print("Model and scaler saved successfully!")

def main():
    """Main function to run the complete pipeline"""
    print("=" * 60)
    print("THYROID CLASSIFICATION USING RANDOM FOREST")
    print("=" * 60)
    
    # Load and explore data
    df = load_and_explore_data()
    
    # Preprocess data
    X, y = preprocess_data(df)
    
    # Split and scale data
    X_train_scaled, X_test_scaled, y_train, y_test, scaler = split_and_scale_data(X, y)
    
    # Train model
    rf_model = train_random_forest(X_train_scaled, y_train)
    
    # Evaluate model
    accuracy, auc_score, y_pred, y_pred_proba = evaluate_model(rf_model, X_test_scaled, y_test)
    
    # Feature importance
    feature_importance_df = feature_importance(rf_model, X.columns)
    
    # Save model
    save_model_and_scaler(rf_model, scaler)
    
    print("\n" + "=" * 60)
    print("MODEL TRAINING COMPLETED SUCCESSFULLY!")
    print(f"Final Accuracy: {accuracy:.4f}")
    print(f"Final AUC-ROC: {auc_score:.4f}")
    print("=" * 60)
    
    return rf_model, scaler, feature_importance_df

if __name__ == "__main__":
    model, scaler, importance = main()
