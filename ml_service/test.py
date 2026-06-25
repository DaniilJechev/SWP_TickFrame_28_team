import ccxt
import requests
import time

API_URL = "http://127.0.0.1:8001/predict"
SYMBOL = "BTC/USDT"
TIMEFRAME = "5m"
LIMIT_PER_REQUEST = 1000
TARGET_CANDLES = 15000

def fetch_candles():
    """Fetches base candles and multiplies them to reach the target size for stress testing"""
    print(f"📥 Fetching {LIMIT_PER_REQUEST} base candles for {SYMBOL} from Binance...")
    exchange = ccxt.binance()
    ohlcv = exchange.fetch_ohlcv(SYMBOL, TIMEFRAME, limit=LIMIT_PER_REQUEST)
    
    base_candles = []
    for row in ohlcv:
        base_candles.append({
            "timestamp": int(row[0]),
            "open": float(row[1]),
            "high": float(row[2]),
            "low": float(row[3]),
            "close": float(row[4]),
            "volume": float(row[5])
        })
    print(f"✅ Successfully fetched {len(base_candles)} base candles.")
    
    print(f"🧬 Duplicating data to simulate a payload of {TARGET_CANDLES} candles...")
    multiplier = TARGET_CANDLES // len(base_candles)
    remainder = TARGET_CANDLES % len(base_candles)
    
    test_candles = (base_candles * multiplier) + base_candles[:remainder]
    
    print(f"📦 Final payload size ready: {len(test_candles)} candles.\n")
    return test_candles

def test_ml_api(candles):
    """Tests the ML API and explicitly isolates the network/inference processing time."""
    payload = {
        "timeframe": "5m",
        "symbol": "BTCUSDT",
        "candles": candles
    }
    
    print(f"🚀 Sending POST request with {len(candles)} candles to {API_URL}...")
    
    # ========================================================
    # TIMER START: Strictly measuring Request + ML Inference time
    # ========================================================
    start_time = time.time()
    response = requests.post(API_URL, json=payload)
    end_time = time.time()
    # ========================================================
    # TIMER END
    # ========================================================
    
    execution_time_ms = (end_time - start_time) * 1000
    print(f"⏱️ Pure API Processing Time (Network + Inference): {execution_time_ms:.2f} ms\n")
    
    if response.status_code == 200:
        data = response.json()
        patterns = data.get("patterns_found", [])
        print(f"🎯 API returned STATUS 200. Processed candles: {data.get('processed_candles')}")
        print(f"🔍 Found {len(patterns)} patterns!")
        
        # output only the first 5 patterns for brevity
        for p in patterns[:5]:
            print(f"  -> {p['pattern_type']} detected at TS: {p['timestamp']} with confidence: {p['confidence'] * 100:.2f}%")
        
        if len(patterns) > 5:
            print(f"  -> ... and {len(patterns) - 5} more.")
            
    else:
        print(f"❌ ERROR {response.status_code}: {response.text}")

if __name__ == "__main__":
    stress_candles = fetch_candles()
    test_ml_api(stress_candles)