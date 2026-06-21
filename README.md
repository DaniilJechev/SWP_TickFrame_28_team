# SWP TickFrame — Team 28

## Project Description
TickFrame is a FastAPI-based crypto chart workstation for Bybit market data, real-time price streaming, and multi-panel candle charts.

This MVP keeps the pattern-detector placeholder but replaces the old HTTP server with a FastAPI backend, websocket streams, in-memory caching, and a TradingView Lightweight Charts frontend.

## Navigation & Reports
- [Week 2 Report Index](reports/week2/README.md)
- [MVP v0 Report](reports/week2/mvp-v0-report.md)
- [Smoke-Check Evaluation Guide](reports/week2/smoke-check-evaluation-guide.md)
- [Product interface documentation](docs/interface.md)
- [MIT License](LICENSE)

## Local Setup
1. Install Python 3.11 or later.
2. Install dependencies: `pip install -r requirements.txt`
3. Start the app from the repository root: `python -m uvicorn tickframe.backend.main:app --reload --host 127.0.0.1 --port 8000`
4. Open `http://127.0.0.1:8000`

## Usage
```bash
# Option A - from the repository root
cd E:\InnoStudy\SummerSem1year\SoftwareProject\SWP_TickFrame_28_team
python -m uvicorn tickframe.backend.main:app --reload --host 127.0.0.1 --port 8000

# Option B - from inside tickframe/
cd tickframe
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000

# Option C - with PYTHONPATH on Windows PowerShell
$env:PYTHONPATH="E:\InnoStudy\SummerSem1year\SoftwareProject\SWP_TickFrame_28_team"
python -m uvicorn tickframe.backend.main:app --reload --host 127.0.0.1 --port 8000
```

## API
- `GET /api/coins`
- `GET /api/coins/{symbol}/candles`
- `GET /api/coins/{symbol}/price`
- `WebSocket /ws/market`
- `WebSocket /ws/candles/{symbol}`

## Frontend
The frontend lives in `tickframe/frontend/` and uses plain HTML/CSS/JavaScript with TradingView Lightweight Charts loaded from a CDN.

## Project Structure
```
tickframe/
├── backend/
│   ├── main.py
│   ├── api/
│   │   ├── endpoints.py
│   │   └── websocket.py
│   ├── services/
│   │   ├── bybit_client.py
│   │   └── cache.py
│   └── models/
│       └── schemas.py
└── frontend/
    ├── index.html
    ├── css/styles.css
    └── js/
        ├── app.js
        ├── sidebar.js
        ├── charts.js
        └── websocket.js
```
