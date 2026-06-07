import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline

def train_routing_model():
    print("🔄 Loading symptom dataset...")
    # 1. Load data
    df = pd.read_csv("symptoms_datasets.csv")
    
    # Clean input casing strings
    df['symptoms'] = df['symptoms'].str.lower()
    
    X = df['symptoms']
    y = df['specialization']

    # 2. Split data for validation
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)

    # 3. Assemble Scikit-Learn Pipeline
    # TfidfVectorizer converts text words into a numerical feature matrix
    # RandomForestClassifier handles multi-class routing predictions
    model_pipeline = Pipeline([
        ('vectorizer', TfidfVectorizer(ngram_range=(1, 2), stop_words='english')),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ])

    # 4. Train the engine
    print("🌲 Training Random Forest Classifier...")
    model_pipeline.fit(X_train, y_train)

    # 5. Export model binary files to disk
    with open("doctor_predictor_model.pkl", "wb") as file:
        pickle.dump(model_pipeline, file)
        
    print("✅ Model binaries successfully saved as 'doctor_predictor_model.pkl'")

if __name__ == "__main__":
    train_routing_model()