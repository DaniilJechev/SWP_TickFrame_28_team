# Week 2 Analysis

## Learning points
- Bybit's public REST API (v5/market/kline) provides free OHLCV data without authentication — ideal for MVP data ingestion.
- TradingView's lightweight-charts library offers a professional-grade candlestick chart with minimal setup (single JS file via CDN).
- Python's built-in `http.server` is sufficient for a local development dashboard without requiring a web framework like Flask.
- Threaded in-memory caching avoids database complexity for MVP while still providing real-time data updates.
- The CandleCache pattern (fetch on init, refresh latest candle every 60s in background thread) works reliably for live charting.

## Validated assumptions
- Bybit API returns correctly ordered kline data with timestamps in milliseconds; response includes all required OHLCV fields plus volume and turnover.
- 5-minute candles with 201-candle cache size provides roughly 16.75 hours of chart history — sufficient for pattern analysis on the last 50 candles (4.17 hours).
- The `scaleMargins` option in lightweight-charts can enforce the 1/3 top and bottom gaps as specified in the UI requirements.
- Marker API on candlestick series can visually denote the 50-candle analysis window boundaries.

## Decisions made
- **Exchange**: Chose Bybit over Binance — no API key required for public endpoints, simpler setup.
- **Intervals**: Standardized on 5-minute candles for the default dashboard (per plan), with support for 11 intervals total (1m to 1M).
- **Cache storage**: In-memory Python list with threading.Lock rather than SQLite — simpler, no dependencies, sufficient for 201 records.
- **Chart library**: lightweight-charts (TradingView) over mplfinance — interactive, web-based, matches the plan's UI spec.
- **Web server**: Built-in http.server over Flask/FastAPI — zero additional dependencies.
- **ML detector**: Randomized mock rather than a real model — XGBoost training planned for MVP v1.

## Needs clarification
- Exact XGBoost model architecture and feature set for real pattern detection (MVP v1).
- Whether persistent database storage is required for v1 or in-memory caching remains sufficient.

## Planned response
- Implement real XGBoost pattern detection model as the next development priority.
- Replace mock detector with real model inference in both CLI (`analyze`) and web dashboard.
- Consider adding SQLite persistence if historical analysis across sessions is needed.
