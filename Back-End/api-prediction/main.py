import os
import pickle
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="HealthSync AI Router",
    description="Microservice endpoint for parsing user symptoms to clinical specializations",
    version="1.0.0"
)

# 1. Configure Cross-Origin Resource Sharing (CORS)
# Allows your port 3000 Next.js dashboard to communicate safely over network sockets
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Define global placeholder variable for the ML Pipeline
ml_model = None

# 3. Life-cycle Startup Hook: Load model into RAM on server boot
@app.on_event("startup")
def load_model_pipeline():
    global ml_model
    model_path = "doctor_predictor_model.pkl"
    
    if not os.path.exists(model_path):
        raise RuntimeError(f"❌ Critical error: '{model_path}' missing. Run train.py first.")
        
    with open(model_path, "rb") as file:
        ml_model = pickle.load(file)
    print("🚀 Trained Random Forest model loaded safely into memory.")

# 4. Define Pydantic request body schema validation contract
class SymptomRequest(BaseModel):
    symptoms: str

# 5. Prediction API Endpoint Router
@app.post("/api/ai/predict-specialty")
async def predict_specialty(payload: SymptomRequest):
    if not ml_model:
        raise HTTPException(status_code=500, detail="Inference pipeline uninitialized.")
        
    clean_input = payload.symptoms.strip().lower()
    if not clean_input:
        raise HTTPException(status_code=400, detail="Symptom text query string cannot be empty.")
        
    try:
        # Run text string inference directly through the Scikit-Learn Pipeline
        predicted_specialty = ml_model.predict([clean_input])[0]
        
        # Calculate matching confidence distributions matrix scores
        probabilities = ml_model.predict_proba([clean_input])[0]
        confidence_score = max(probabilities)
        
        return {
            "status": "success",
            "analyzed_text": payload.symptoms,
            "recommended_specialty": predicted_specialty,
            "confidence": round(float(confidence_score), 2)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline inference failure: {str(e)}")

# 6. Basic Health Check Endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "healthsync-ai-router"}