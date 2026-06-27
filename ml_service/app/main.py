import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
import pandas as pd
import xgboost as xgb

from app.config import MODEL_PATH, WINDOW_SIZE, FEATURE_ORDER
from app.schemas import PredictRequest, PredictResponse, DetectedPattern
from app.services.features import add_smart_features
from app.services.inference import apply_pattern_thresholds, apply_nms_clustering

# ==========================================
# Logger Configuration
# ==========================================
# setting up a basic logger to log messages to both console and a file

os.makedirs("logs", exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] ML_API: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[
        logging.FileHandler("logs/app.log", encoding="utf-8"), # Указана кодировка UTF-8
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manages the lifecycle of the FastAPI application.
    Loads the XGBoost model into memory on startup and clears it on shutdown.
    """
    logger.info(f"🚀 [STARTUP] Loading XGBoost model from {MODEL_PATH}...")
    if not os.path.exists(MODEL_PATH):
        logger.error(f"❌ Model file not found at: {MODEL_PATH}")
        raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")
    
    model = xgb.XGBClassifier()
    model.load_model(MODEL_PATH)
    ml_models["hs_detector"] = model
    logger.info("✅ [STARTUP] Model loaded successfully into memory!")
    yield
    logger.info("🛑 [SHUTDOWN] Clearing ML models...")
    ml_models.clear()

app = FastAPI(
    title="TickFrame ML API",
    description="Production REST API for real-time Head and Shoulders pattern detection.",
    version="1.1.0",
    lifespan=lifespan
)

@app.get("/health", tags=["Health"])
def health_check():
    """
    Basic health check endpoint to verify that the API is running 
    and the ML model is successfully loaded into memory.
    """
    return {"status": "success", "model_loaded": "hs_detector" in ml_models}

@app.post(
    "/predict", 
    response_model=PredictResponse, 
    tags=["Inference"],
    summary="Analyze Candlestick Chart",
    response_description="""
    Returns a JSON object containing the requested symbol, timeframe, and a list of verified patterns.
    If patterns are found, `patterns_found` contains their timestamps and confidence scores.
    If no patterns are detected, `patterns_found` will be an empty array [].
    """,
    description="""
**Analyzes an array of OHLCV candles to detect Head & Shoulders patterns (Classic & Inverse).**

⚠️ **DATA REQUIREMENT WARNING:**
The model requires historical context to calculate market indicators (e.g., NATR, Trend_50). 
You **MUST include an additional 50 historical candles** prior to the first candle you actually want to analyze. 

*Example: To analyze the chart from 10:00 to 12:00, you must send an array of candles starting from 05:50 (50 previous 5-minute candles).*

**Pipeline Algorithm:**
1. Receives raw OHLCV data.
2. Calculates internal smart features (geometry, slopes, dominance).
3. Runs inference through the XGBoost ensemble.
4. Applies Non-Maximum Suppression (NMS) and business thresholds.
5. Returns only the verified pattern peaks.
"""
)
def predict_pattern(request: PredictRequest):
    """
    Main inference endpoint. Converts JSON request to DataFrame, 
    extracts features, filters columns by strict order to drop metadata (like timestamp), 
    predicts probabilities, and formats the output.
    """
    logger.info(f"📥 Received predict request for {request.symbol} | Timeframe: {request.timeframe} | Candles: {len(request.candles)}")

    # Validation constraint for timeframe
    if request.timeframe != "5m":
        logger.warning(f"⚠️ Invalid timeframe requested: {request.timeframe}")
        raise HTTPException(status_code=400, detail="Only '5m' timeframe candles are currently supported.")

    # Check if we have enough context candles to calculate geometry
    if len(request.candles) < WINDOW_SIZE:
        logger.warning(f"⚠️ Insufficient candles: {len(request.candles)}. Required: {WINDOW_SIZE}")
        raise HTTPException(status_code=400, detail=f"Insufficient candles. Minimum required is {WINDOW_SIZE}.")

    try:
        model = ml_models.get("hs_detector")
        if not model:
            logger.error("❌ ML Model is not ready in memory.")
            raise RuntimeError("ML Model is not ready in memory.")

        # 1. Convert Pydantic request to Pandas DataFrame
        raw_data = [c.model_dump() for c in request.candles]
        df = pd.DataFrame(raw_data)
        
        # Keep timestamps mapping before we drop original rows
        original_timestamps = df['timestamp'].values

        # 2. Extract Geometry Features
        featured_df = add_smart_features(df)
        if featured_df.empty:
            logger.info("ℹ️ DataFrame became empty after feature extraction.")
            return PredictResponse(
                symbol=request.symbol, 
                timeframe=request.timeframe, # <-- ДОБАВЛЕНО
                patterns_found=[], 
                processed_candles=0
            )

        # 3. Align indices because add_smart_features crops the first (WINDOW_SIZE - 1) rows
        shifted_index_offset = WINDOW_SIZE - 1
        
        # 4. Model Inference with STRICT feature ordering
        # using of FEATURE_ORDER garantees correct order and cut timestamp
        X_inference = featured_df[FEATURE_ORDER].values
        probas = model.predict_proba(X_inference)
        
        # 5. Apply Business Thresholds & NMS
        y_pred_raw = apply_pattern_thresholds(probas)
        y_pred_clean = apply_nms_clustering(y_pred_raw, probas)

        # 6. Collect matching patterns
        detected_patterns = []
        pattern_names = {1: "Classic H&S", 2: "Inverse H&S"}
        
        for i, cls in enumerate(y_pred_clean):
            if cls > 0:
                # Map the cropped dataframe index back to the true original timestamp
                actual_global_idx = i + shifted_index_offset
                ts = int(original_timestamps[actual_global_idx])
                conf = float(probas[i, cls])
                
                detected_patterns.append(
                    DetectedPattern(timestamp=ts, pattern_type=pattern_names[cls], confidence=conf)
                )

        logger.info(f"✅ Prediction complete for {request.symbol}. Found {len(detected_patterns)} patterns.")

        return PredictResponse(
            symbol=request.symbol,
            timeframe=request.timeframe, # <-- ДОБАВЛЕНО
            patterns_found=detected_patterns,
            processed_candles=len(featured_df)
        )

    except Exception as e:
        logger.error(f"💥 Execution error during prediction: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Execution error: {str(e)}")