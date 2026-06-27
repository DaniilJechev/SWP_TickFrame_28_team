# MVP v0 Report

## Purpose and description
This MVP v0 provides the initial product foundation for SWP TickFrame, a cryptocurrency chart scanning and pattern detection platform.

### Implemented features
- **Bybit data integration** — fetches real OHLCV candle data from Bybit's public REST API (v5 market kline)
- **Candle cache** — in-memory cache storing up to 201 candles (5-minute interval by default) with automatic refresh every 60 seconds
- **Interactive web dashboard** — candlestick chart powered by lightweight-charts (TradingView), served via a built-in Python HTTP server
  - Gap at top and bottom (1/3 chart height each)
  - Grid: vertical lines every 1 hour, horizontal lines every $100
  - Real-time updates as new candles arrive
- **Mock ML pattern detection** — analyzes the last 50 candles and returns a pattern name with confidence score (randomized placeholder)
- **CLI interface** with four commands:
  - `scan` — fetch and display candle data from Bybit
  - `report` — generate a Markdown report from scan data
  - `analyze` — run pattern analysis on cached candles
  - `serve` — start the web dashboard

### Repository structure
- `tickframe/exchange/bybit.py` — Bybit API client
- `tickframe/data/cache.py` — CandleCache with threaded auto-refresh
- `tickframe/detection/mock.py` — mock ML pattern detector
- `tickframe/web/server.py` — HTTP server for the dashboard
- `tickframe/web/static/index.html` — frontend chart interface
- `tickframe/cli.py` — CLI entry point

## Runnable artifact
From the repository root:

```bash
pip install -r requirements.txt
python -m tickframe --help
python -m tickframe scan --symbol BTCUSDT --interval 1h --limit 5
python -m tickframe analyze --symbol BTCUSDT --interval 5m
python -m tickframe serve --port 5000
```

## Smoke-check scenario
1. Open a terminal in the repository root.
2. Run `python -m tickframe --help` — confirms available commands.
3. Run `python -m tickframe scan --symbol BTCUSDT --interval 1h --limit 5` — fetches real candlestick data from Bybit.
4. Run `python -m tickframe analyze --symbol BTCUSDT --interval 5m` — caches 200 candles and returns a mock pattern detection result.
5. Run `python -m tickframe serve --port 5000` — starts the web dashboard; open `http://localhost:5000` in a browser to view the interactive chart with "Analyze for patterns" button.

Expected result:
- CLI commands execute without errors and display real data.
- The web dashboard renders a candlestick chart with live data and responds to analysis requests.

## Current limitations and placeholders
- Pattern detection uses randomized mock output — no ML model is trained yet.
- The candle cache stores data in memory only (no persistent database).
- The web dashboard is a local-only development server.

## Relationship to proposed MVP v1 stories
- US-01 (scan historical candles): implemented via Bybit kline API + CandleCache
- US-02 (ML pattern detection): mock detector in place, ready for real model
- US-03 (report-friendly output): Markdown report generation implemented

## Links
- Root README: `../README.md`
- Interface documentation: `../../docs/interface.md`
- Week 2 report index: `README.md`
