# SWP TickFrame — Team 28

FastAPI-based cryptocurrency chart workstation for real-time Bybit market data, live price streaming via WebSockets, and multi-panel candlestick charts with TradingView Lightweight Charts.

**Current implementation:** MVP v1 with FastAPI backend, async Bybit client with Binance fallback, WebSocket market/candle streams, in-memory cache with auto-refresh, and a feature-separated frontend.

---

## Quick Start (Docker)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Git](https://git-scm.com/downloads)

### 1. Clone

```bash
git clone https://github.com/Fedos113/SWP_TickFrame_28_team.git
cd SWP_TickFrame_28_team
```

### 2. Configure environment (optional)

```bash
cp .env.example .env
```

Bybit API keys are optional — public endpoints work without authentication.

### 3. Build and run

```bash
docker compose up --build
```

### 4. Open in browser

```bash
http://<YOUR_VM_IP>:8000
```

Replace `<YOUR_VM_IP>` with your machine's actual IP address, or use:
- **`localhost`** if running locally
- **`<VM_IP>`** if running on a VM or remote server

---

## Local Development (without Docker)

Use this if you want to edit the code. Dependencies only — no server command needed.

### Linux / macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Windows (PowerShell)

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Then run via Docker (see above) or start the server manually:

```bash
uvicorn tickframe.backend.main:app --host 0.0.0.0 --port 8000
```

---

## CLI Usage

The CLI works with or without Docker:

```bash
# Using Docker
docker compose run --rm tickframe scan --symbol BTCUSDT --interval 1h --limit 10

# Or locally (after pip install)
python -m tickframe scan --symbol BTCUSDT --interval 1h --limit 10
python -m tickframe analyze --symbol BTCUSDT --interval 5m
python -m tickframe report --symbol BTCUSDT --interval 1h --limit 10
python main.py --symbol BTCUSDT --smoke-check
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/coins` | List available coins with prices |
| GET | `/api/coins/{symbol}/price` | Current price for a symbol |
| GET | `/api/coins/{symbol}/candles?interval=5m&limit=200` | Candlestick data |
| WS | `/ws/market` | Market snapshot stream (5s interval) |
| WS | `/ws/candles/{symbol}?interval=5m&limit=200` | Real-time candle updates |

---

## Architecture

```
tickframe/
├── backend/
│   ├── main.py              # FastAPI app creation, lifespan, static mounts
│   ├── api/
│   │   ├── endpoints.py     # REST endpoints (health, coins, candles, price)
│   │   └── websocket.py     # WebSocket streams (market, candles)
│   ├── services/
│   │   ├── bybit_client.py  # Async Bybit v5 client with Binance fallback
│   │   └── cache.py         # MemoryMarketCache with 5s auto-refresh
│   └── models/
│       └── schemas.py       # Pydantic models (CoinSummary, Candle, etc.)
├── frontend/
│   ├── index.html           # Main page
│   ├── css/styles.css       # Dark/light theme styles
│   └── js/
│       ├── app.js           # App initialization, theme toggle
│       ├── charts.js        # TradingView Lightweight Charts integration
│       ├── sidebar.js       # Coin list sidebar
│       └── websocket.js     # WebSocket connection management
├── data/                    # Legacy candle cache (CLI)
├── detection/               # Mock pattern detector (placeholder)
├── exchange/                # Legacy Bybit client (CLI)
├── web/                     # Legacy HTTP server (CLI)
├── cli.py                   # CLI entry point (scan, report, analyze, serve)
├── main.py                  # Top-level smoke-check entry point
├── requirements.txt         # Python dependencies
├── Dockerfile               # Container image
├── docker-compose.yml       # Container orchestration
└── .env.example             # Environment variable template
```

---

## Documentation & Reports

| Resource | Link |
|---|---|
| Product Interface | [docs/interface.md](docs/interface.md) |
| Definition of Done | [docs/definition-of-done.md](docs/definition-of-done.md) |
| Roadmap | [docs/roadmap.md](docs/roadmap.md) |
| User Stories | [docs/user-stories.md](docs/user-stories.md) |
| Changelog | [CHANGELOG.md](CHANGELOG.md) |
| Week 2 Reports | [reports/week2/](reports/week2/README.md) |
| Week 3 Reports | [reports/week3/](reports/week3/README.md) |
| License | [MIT](LICENSE) |
