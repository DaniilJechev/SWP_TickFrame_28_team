from pydantic import BaseModel, Field
from typing import List

class CandleData(BaseModel):
    timestamp: int = Field(..., description="Unix timestamp of the candle")
    open: float = Field(..., description="Open price")
    high: float = Field(..., description="High price")
    low: float = Field(..., description="Low price")
    close: float = Field(..., description="Close price")
    volume: float = Field(..., description="Trading volume")

class PredictRequest(BaseModel):
    symbol: str = Field(..., example="BTCUSDT", description="Trading pair name")
    timeframe: str = Field(..., example="5m", description="Candle timeframe. Currently only '5m' is supported.")
    candles: List[CandleData] = Field(..., description="Array of OHLCV candles (including N history context candles)")

class DetectedPattern(BaseModel):
    timestamp: int = Field(..., description="Timestamp where the pattern peak was detected")
    pattern_type: str = Field(..., example="Classic H&S", description="Detected pattern type (Classic H&S or Inverse H&S)")
    confidence: float = Field(..., description="Model probability for this pattern in range [0, 1]")

class PredictResponse(BaseModel):
    symbol: str = Field(..., example="BTCUSDT")
    timeframe: str = Field(..., example="5m", description="The timeframe of the analyzed candles") # <-- ДОБАВЛЕНО
    patterns_found: List[DetectedPattern] = Field(..., description="List of filtering-passed patterns")
    processed_candles: int = Field(..., description="Total candles analyzed after geometry crop")