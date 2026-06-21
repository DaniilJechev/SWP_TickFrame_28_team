# SWP TickFrame — Team 28

FastAPI-based cryptocurrency chart workstation for real-time Bybit market data, live price streaming via WebSockets, and multi-panel candlestick charts with TradingView Lightweight Charts.

**Current implementation:** MVP v1 with FastAPI backend, async Bybit client with Binance fallback, WebSocket market/candle streams, in-memory cache with auto-refresh, and a feature-separated frontend.

---

## Prerequisites

- **Git**
- **Python 3.11+** (for local installation)
- **Docker** (optional — for containerized installation)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Fedos113/SWP_TickFrame_28_team.git
cd SWP_TickFrame_28_team
```

### 2. Configure environment (optional)

```bash
cp .env.example .env
```

Bybit API keys are optional — public endpoints work without authentication.

---

## Local Setup

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

---

## Running the Web Dashboard

Start the FastAPI server with uvicorn:

```bash
# Linux / macOS
uvicorn tickframe.backend.main:app --reload --host 127.0.0.1 --port 8000

# Windows (PowerShell) — same command
uvicorn tickframe.backend.main:app --reload --host 127.0.0.1 --port 8000
```

Open **http://127.0.0.1:8000** in your browser.

---

## CLI Usage

The CLI allows scanning, analyzing, and reporting without the web interface:

```bash
# Fetch real candle data from Bybit
python -m tickframe scan --symbol BTCUSDT --interval 1h --limit 10

# Run pattern analysis on cached candles
python -m tickframe analyze --symbol BTCUSDT --interval 5m

# Generate a Markdown report
python -m tickframe report --symbol BTCUSDT --interval 1h --limit 10

# Use mock data (no API call)
python -m tickframe scan --symbol BTCUSDT --interval 1h --limit 10 --mock

# Smoke-check verification
python main.py --symbol BTCUSDT --smoke-check
```

---

## Docker Setup

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (included with Docker Desktop)

### Build and run

```bash
docker compose up --build
```

The dashboard will be available at **http://localhost:8000**.

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
