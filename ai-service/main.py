from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib
import os

app = FastAPI(title="AI Anomaly Detection Service")

# Data Model for Request
class DetectionRequest(BaseModel):
    requestCount: int
    errorRate: float
    ipDiversity: int

# Initialize and Train Model with Synthetic Data
MODEL_PATH = "anomaly_model.joblib"

def train_model():
    print("Training AI model with synthetic data...")
    # Generate Synthetic Data
    # Normal patterns: 10-200 requests, 0-5% error rate, 1-2 IPs
    normal_data = np.random.rand(1000, 3)
    normal_data[:, 0] = normal_data[:, 0] * 200 + 10 # requestCount
    normal_data[:, 1] = normal_data[:, 1] * 0.05     # errorRate
    normal_data[:, 2] = normal_data[:, 2] * 2 + 1    # ipDiversity

    # Abnormal patterns (Anomalies):
    # 1. High volume (Brute force)
    anomaly_vol = np.random.rand(50, 3)
    anomaly_vol[:, 0] = anomaly_vol[:, 0] * 5000 + 2000
    anomaly_vol[:, 1] = anomaly_vol[:, 1] * 0.1
    anomaly_vol[:, 2] = 1

    # 2. High error rate (Credential stuffing)
    anomaly_err = np.random.rand(50, 3)
    anomaly_err[:, 0] = anomaly_err[:, 0] * 500 + 100
    anomaly_err[:, 1] = anomaly_err[:, 1] * 0.8 + 0.2
    anomaly_err[:, 2] = anomaly_err[:, 2] * 5 + 1

    # 3. High IP diversity (Proxy botnet)
    anomaly_ip = np.random.rand(50, 3)
    anomaly_ip[:, 0] = anomaly_ip[:, 0] * 1000 + 500
    anomaly_ip[:, 1] = 0.01
    anomaly_ip[:, 2] = anomaly_ip[:, 2] * 50 + 20

    X_train = np.vstack([normal_data, anomaly_vol, anomaly_err, anomaly_ip])
    
    # Isolation Forest
    # contamination is the expected proportion of anomalies in the dataset
    clf = IsolationForest(contamination=0.1, random_state=42)
    clf.fit(X_train)
    
    joblib.dump(clf, MODEL_PATH)
    return clf

# Load or train
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    model = train_model()

@app.post("/detect")
async def detect(req: DetectionRequest):
    try:
        data = np.array([[req.requestCount, req.errorRate, req.ipDiversity]])
        
        # Isolation Forest prediction: 1 for normal, -1 for anomaly
        prediction = model.predict(data)
        
        # decision_function returns the anomaly score (lower is more abnormal)
        score = model.decision_function(data)
        
        # Convert -1/1 to true/false
        is_suspicious = bool(prediction[0] == -1)
        
        # Confidence logic: map decision_function score to 0-1 range
        # decision_function score is usually in [-0.5, 0.5]
        confidence = float(np.clip(1.0 - (score[0] + 0.5), 0, 1))

        return {
            "isSuspicious": is_suspicious,
            "confidence": round(confidence, 4)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
