# SWP TickFrame — Customer Handover

**Team 28** · [GitHub Repository](https://github.com/Fedos113/SWP_TickFrame_28_team) · [Hosted Documentation](https://Fedos113.github.io/SWP_TickFrame_28_team/)

---

## Project Overview

TickFrame is a cryptocurrency chart workstation built with FastAPI. It provides real-time market data from Bybit (with Binance fallback), interactive candlestick charts via Lightweight Charts v5, a canvas-based drawing toolbar (13 tools), SQLite-persisted settings and drawings, and ML-based pattern analysis.

---

## Quick Start

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) + Docker Compose
- 2 CPU cores, 2 GB RAM recommended

### Run
```bash
git clone https://github.com/Fedos113/SWP_TickFrame_28_team.git
cd SWP_TickFrame_28_team
docker compose up --build
```

Open **http://localhost:8080** in your browser.

### Local Development (no Docker)
```bash
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
pip install -r requirements.txt
uvicorn tickframe.backend.main:app --host 0.0.0.0 --port 8000
```

Open **http://localhost:8000**.

---

## Product Access

The application is deployed and accessible at:

> **http://10.93.26.164:8080/**

This is a university VM deployment. Availability depends on the VM being powered on. If the VM is unreachable, use the Docker quick start above to run locally.

---

## Key Features

| Feature | Description |
|---|---|
| **Real-time charts** | WebSocket-powered live candlestick charts via Lightweight Charts v5 |
| **Drawing tools** | 13 tools: Trend Line, H-Line, V-Line, Ray, Cross Line, Fibonacci, Price Range %, Rectangle, Circle, Arrow, Text, Brush, Redact |
| **ML pattern analysis** | Sliding-window pattern detection with configurable candle limit |
| **Multi-interval** | 5m, 15m, 1h, 4h, 1d timeframes |
| **Volume sub-chart** | Volume pane with SMA overlay below main chart |
| **WebSocket live data** | Real-time market snapshots and candle updates from Bybit/Binance |
| **Persistence** | Drawings, settings, and candle data survive restarts via SQLite |
| **Dark/light theme** | Toggle persisted to database |
| **Coin sidebar** | Live prices, ticker badges, 24h change, Fear & Greed Index |
| **Coin icons** | Auto-fetched from CoinGecko API |

---

## Architecture at a Glance

```
Exchange (Bybit/Binance)
    ↓
MemoryMarketCache (in-memory, 5s refresh)
    ↓
SQLite (data persistence — candles, drawings, settings)
    ↓
FastAPI Backend (REST + WebSocket)
    ↓
Frontend (Lightweight Charts v5, Canvas drawing, JS)
```

The ML pattern detection runs as a separate microservice (`ml_service/`) for isolation and independent scaling.

Full architecture documentation: [docs/architecture/README.md](architecture/README.md)

---

## Documentation

| Resource | Link |
|---|---|
| Hosted Documentation Site | https://Fedos113.github.io/SWP_TickFrame_28_team/ |
| README | ../README.md |
| Architecture Docs | docs/architecture/README.md |
| API Endpoints | ../README.md#api-endpoints |
| User Stories | docs/user-stories.md |
| Roadmap | docs/roadmap.md |
| Definition of Done | docs/definition-of-done.md |
| Testing Strategy | docs/testing.md |
| Changelog | ../CHANGELOG.md |

---

## Maintenance Notes

### Restarting the application
```bash
docker compose down
docker compose up --build -d
```

### Rebuilding from scratch
```bash
docker compose down
docker compose rm
docker compose build --no-cache
docker compose up -d
```

### Checking health
```bash
curl http://localhost:8080/api/health     # Backend
curl http://localhost:8001/health          # ML service
```

### Updating
Pull the latest changes from the `main` branch and rebuild:
```bash
git pull origin main
docker compose up --build
```

---

## Known Limitations

| Area | Limitation |
|---|---|
| **Exchange dependency** | Only Bybit v5 (main) and Binance (fallback) are supported. Adding a new exchange requires a new client adapter. |
| **Single-user** | No authentication or multi-user support — all users share the same drawings and settings via SQLite. |
| **No order execution** | TickFrame is a charting/analysis workstation only. Trade placement is not supported. |
| **Historical depth** | Maximum 50 000 candles per request. Very long histories (years of 1m data) are not available. |
| **ML scope** | Only one pattern (head-and-shoulders) is detected. The XGBoost model was trained on synthetic data and accuracy varies by market conditions. |
| **WebSocket resilience** | Reconnect is automatic but a brief gap (1–3 s) may occur on network interruption. |
| **Browser support** | Developed and tested on Chromium-based browsers (Chrome, Edge). Other browsers may have minor rendering differences. |
| **Mobile** | No responsive layout. The UI is designed for desktop screens ≥ 1280 px wide. |

---

## Handover Status

**Handover level reached:** Ready for independent use

**Customer-confirmation status:** Pending confirmation

### What has been handed over
- Full source code under MIT license in the public repository
- Docker Compose deployment configuration
- Hosted documentation site at GitHub Pages
- Customer handover documentation (this file)
- Contributing guide (`CONTRIBUTING.md`)
- AI agent guidance (`AGENTS.md`)
- Run and access instructions in `README.md`

### What the customer needs to know
- No API keys are required for basic operation — Bybit public endpoints work without authentication
- For higher rate limits, create a `.env` file with Bybit API credentials (see `.env.example`)
- The ML microservice uses XGBoost and starts alongside the main app via Docker Compose
- All data is stored locally in `data/tickframe.db` (SQLite)

### What still requires team support
- This handover document and the documentation set should be reviewed for completeness
- Any post-course issues or feature requests would need to be filed as GitHub issues
- The university VM deployment may not persist after grading

---

## License

This project is licensed under the MIT License — see [LICENSE](../LICENSE) for details.
