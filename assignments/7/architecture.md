# TickFrame Architecture

> **File:** `assignments/7/architecture.md` — comprehensive architecture of `/tickframe`.

---

## 1. Overview

TickFrame is a **cryptocurrency chart workstation** with a client-server architecture. A **FastAPI backend** serves a static **vanilla JS frontend** (Lightweight Charts v5), interfaces with cryptocurrency exchanges (Bybit primary, Binance fallback), and delegates ML pattern detection to a separate **dual-model microservice**.

- **Frontend:** Static HTML/CSS/JS served by the backend; single-page application.
- **Backend:** FastAPI (Python 3.11+) with async REST + WebSocket endpoints, SQLite persistence, 3-tier cache.
- **ML Service:** Separate FastAPI microservice running H&S and DT/DB XGBoost detectors.
- **Deployment:** Docker Compose (2 containers: `tickframe` + `ml-service`).

### Technology Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.11, FastAPI, Uvicorn, httpx, websockets, Pydantic v2 |
| **Frontend** | Lightweight Charts v5.2.0, Canvas API, vanilla JS, `lightweight-charts-drawing` (esbuild bundle), `lightweight-charts-indicators` (esbuild bundle), Lucide icons |
| **Database** | SQLite (via sync `sqlite3`, `run_in_executor`) |
| **ML** | XGBoost, Numba, pandas, numpy, FastAPI microservice |
| **Exchange** | Bybit v5 API (HTTPS REST, primary), Binance API (HTTPS REST, fallback) |
| **External APIs** | CoinGecko (coin icons), alternative.me (Fear & Greed Index) |
| **CI** | GitHub Actions (ruff, mypy, pytest+cov, bandit, ESLint, Vitest, Lychee) |
| **Deployment** | Docker + Docker Compose (2 containers, default bridge network) |
| **Build** | esbuild (for drawing bundle) |

---

## 2. Directory Structure (`tickframe/`)

```
tickframe/
├── __init__.py                  # Package marker
├── __main__.py                  # CLI entry point: python -m tickframe
├── cli.py                       # CLI commands: scan, report, analyze, serve
├── backend/                     # FastAPI backend (primary)
│   ├── __init__.py
│   ├── main.py                  # FastAPI app, lifespan, CORS, static mounts
│   ├── api/
│   │   ├── __init__.py
│   │   ├── endpoints.py         # REST routes: health, coins, candles, analyze, drawings, indicators, settings
│   │   └── websocket.py         # WebSocket hub: /ws/market, /ws/candles/{symbol}
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py           # Pydantic models
│   └── services/
│       ├── __init__.py
│       ├── bybit_client.py      # Async Bybit v5 client + Binance fallback + pagination + RateLimiter
│       ├── cache.py             # MemoryMarketCache — 3-tier cache (memory -> DB -> exchange)
│       ├── database.py          # SQLite persistence (settings, drawings, candles, coin_icons, toolbar_position, indicators_blob)
│       ├── ml_client.py         # HTTP client for ML microservice (POST /predict, multi-URL fallback)
│       ├── coin_icons.py        # CoinGecko icon fetcher (1h TTL cache)
│       └── fng_client.py        # Fear & Greed Index fetcher (6h TTL cache)
├── frontend/                    # Frontend static files
│   ├── index.html               # Main SPA page
│   ├── package.json             # npm: eslint, vitest, esbuild, lightweight-charts-drawing, lightweight-charts-indicators, oakscriptjs
│   ├── eslint.config.js         # ESLint flat config
│   ├── css/
│   │   ├── styles.css           # Dark/light theme, layout, sidebar, FNG, analysis stack
│   │   ├── drawing-toolbar.css  # Floating toolbar styles
│   │   ├── drawing-properties.css # Properties panel styles
│   │   ├── indicators-panel.css # Indicators sidebar panel, panes, chips, toggle button
│   │   └── tradingview-custom.css # TV Charting Library overrides
│   ├── js/
│   │   ├── app.js               # DOM init: theme toggle, settings load/save, timeframe buttons, coin click
│   │   ├── charts.js            # Chart engine: Lightweight Charts v5 + TV Charting Library wrapper, candle loading, WS, patterns, volume sub-chart
│   │   ├── sidebar.js           # Coin list, price updates (5s polling), FNG speedometer SVG, coin icons
│   │   ├── datafeed.js          # TradingView Charting Library datafeed adapter (REST + WS)
│   │   ├── websocket.js         # ManagedSocket class, MarketSocket, CandleSocket, auto-reconnect
│   │   ├── drawing-overlay-src.js, drawing-bundle.js, drawing-events.js, drawing-state.js, drawing-settings.js, drawing-controller.js, drawing-toolbar.js, drawing-properties.js, drawing-overlay.js
│   │   ├── indicators-src.js, indicators-bundle.js, indicators-registry.js, indicators-state.js, indicators-panes.js, indicators-controller.js, indicators-panel.js, indicators-chips.js
│   ├── lib/
│   │   └── charting_library/    # TradingView Charting Library (vendored)
│   └── tests/                   # Vitest JS tests
├── data/                        # SQLite DB (gitignored)
├── detection/                   # Legacy pattern detection (deprecated)
├── exchange/                    # Legacy exchange client (deprecated)
└── web/                         # Legacy web server (deprecated)
```

### External: `ml_service/`

```
ml_service/
├── Dockerfile
├── requirements.txt            # xgboost, pandas, numpy, numba, fastapi, uvicorn
└── app/
    ├── __init__.py
    ├── main.py                 # FastAPI ML API: /health, /predict
    ├── config.py               # H&S/DTDB model paths, WINDOW_SIZE=50, feature contracts
    ├── schemas.py              # CandleData, PredictRequest, PredictResponse, DetectedPattern
    └── services/
        ├── __init__.py
        ├── features.py         # Feature engineering: ATR, NATR, Trend, extremum search, geometry
        └── inference.py        # Pattern thresholds, NMS clustering, business logic
```

---

## 3. Used Libraries

### Python (Backend)

| Library | Version | Usage |
|---|---|---|
| `fastapi` | — | Async web framework |
| `uvicorn` | — | ASGI server |
| `httpx` | — | Async HTTP client (exchanges, CoinGecko, alternative.me, ML service) |
| `pydantic` | v2 | Request/response validation |
| `aiosqlite` | — | Async SQLite (via `run_in_executor`) |
| `websockets` | — | WebSocket protocol support |

### Python (ML Service)

| Library | Version | Usage |
|---|---|---|
| `xgboost` | — | XGBClassifier for H&S and DT/DB detection |
| `pandas` | — | DataFrame-based feature engineering |
| `numpy` | — | Vectorized feature calculations and model input arrays |
| `numba` | >=0.60.0 | Native-code acceleration for rolling extrema search |
| `fastapi` | — | ML inference API |
| `uvicorn` | — | ASGI server |

### JavaScript (Frontend)

| Library | Version | Source | Usage |
|---|---|---|---|
| `lightweight-charts` | 5.2.0 | unpkg CDN | Candlestick chart, volume histogram |
| `lightweight-charts-drawing` | — | npm → esbuild bundle | 40+ drawing tools |
| `lightweight-charts-indicators` | 0.4.2 | npm → esbuild bundle | 446 TA indicators |
| `charting_library` | — | vendored | TradingView Advanced Charting (optional) |
| `lucide` | latest | unpkg CDN | SVG icons for drawing toolbar |
| `vitest` | ^3.0.0 | npm devDeps | JS testing |
| `eslint` | ^9.0.0 | npm devDeps | JS linting |
| `esbuild` | — | npm | Build drawing bundle + indicators bundle |

---

## 4. Code Structure & Module Responsibilities

### 4.1 Backend (`backend/`)

#### `main.py` — Application entry point

- Creates `FastAPI` with `lifespan` handler
- Lifespan: initializes `BybitClient`, `DatabaseService`, `MemoryMarketCache`, `MlClient`
- Starts background `market_refresh_loop` (5s interval, broadcasts over WebSocket)
- Mounts `/css`, `/js`, `/lib`, `/static` as static directories
- Serves `index.html` at `/`
- CORS middleware (all origins allowed)
- Includes REST router (`/api`) and WebSocket router

#### `api/endpoints.py` — REST API

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Health check |
| `/api/coins` | GET | List 10 coins with price, 24h change, trend |
| `/api/coins/icons` | GET | Coin icon URLs |
| `/api/coins/{symbol}/price` | GET | Single coin price |
| `/api/coins/{symbol}/candles` | GET | OHLCV candles |
| `/api/analyze/{symbol}` | POST | ML pattern analysis |
| `/api/sentiment` | GET | Fear & Greed Index |
| `/api/drawings` | GET/POST | Load/save drawings |
| `/api/indicators` | GET/POST | Load/save indicator configs |
| `/api/toolbar-position` | GET/POST | Load/save toolbar position |
| `/api/settings` | GET/POST | Load/save user settings |

#### `api/websocket.py` — WebSocket

- `SocketHub` class: manages connected clients with `asyncio.Lock`
- `/ws/market`: market snapshot broadcasts
- `/ws/candles/{symbol}`: candle snapshot + 1s polling with signature change detection

#### `services/bybit_client.py` — Exchange Client

- `BybitClient`: async HTTP client for Bybit v5 API
- Token-bucket `RateLimiter` (10 req/s, burst 5)
- Automatic fallback to Binance API
- Pagination support (200 per page for Bybit, 1000 for Binance)

#### `services/cache.py` — Memory Cache

- `MemoryMarketCache`: 3-tier cache (memory → SQLite → exchange)
- `MAX_CANDLES = 55000` per (symbol, interval) pair
- Warmup: Phase 1 loads DB, Phase 2 fills gaps from exchange

#### `services/database.py` — SQLite Service

- `DatabaseService`: sync SQLite via `run_in_executor`
- Tables: `settings`, `drawings`, `drawings_blob`, `indicators_blob`, `toolbar_position`, `coin_icons`, `candles`

#### `services/ml_client.py` — ML Service Client

- `MlClient`: HTTP client for ML microservice
- Multi-URL fallback: primary (`ml-service:8001`) → localhost (`127.0.0.1:8001`)
- Filters results by confidence threshold (default 0.80)

#### `services/coin_icons.py` — Coin Icons

- `CoinIconsClient`: CoinGecko API fetcher with 1h TTL cache

#### `services/fng_client.py` — Fear & Greed

- `FearAndGreedClient`: alternative.me API fetcher with 6h TTL cache

### 4.2 Frontend (`frontend/`)

#### `index.html` — SPA Shell

Layout: sidebar (logo + watchlist + FNG) | main (topbar + chart-container + analysis-stack)

#### `js/app.js` — App Initialization

- Loads settings, init indicator subsystem, wires symbol switch
- Timeframe button, indicators toggle, theme toggle, analyze button
- Auto-selects first coin after 300ms

#### `js/charts.js` — Chart Engine

- Dual-mode: Lightweight Charts v5 (primary) / TradingView Charting Library (advanced)
- Candlestick series + Volume histogram + Volume SMA (20-period) line
- Infinite scroll, ML pattern markers, date-range drawings
- In-memory candle cache for fast symbol switching

#### `js/sidebar.js` — Watchlist & FNG

- 10 coins with names, icons, prices (5s polling)
- Fear & Greed SVG speedometer with zones and timer

#### `js/websocket.js` — WebSocket Manager

- `ManagedSocket` with auto-reconnect, event-based handlers
- `MarketSocket` and `CandleSocket`

#### Indicator System (7 modules + bundle)

- **Registry:** `TFIndicators` — 446-indicator registry (Standard 82, Candlestick Patterns 44, Community 317)
- **State:** `TFIndicatorState` — reactive store with subscribe pattern
- **Panes:** `TFIndicatorPanes` — stacked `createChart` instances, timeScale sync
- **Controller:** `TFIndicatorController` — apply/remove/recompute/persist lifecycle
- **Panel:** `TFIndicatorPanel` — right sidebar UI with search and groups
- **Chips:** `TFIndicatorChips` — applied indicator pill row
- **Bundle:** esbuild-compiled `lightweight-charts-indicators` + `oakscriptjs`

#### Drawing System (7 modules)

- **Overlay:** `TFDraw` facade, keyboard shortcuts
- **Controller:** Drawing lifecycle, redact mode, auto-save
- **Toolbar:** 11 groups × 34 tools, drag reposition
- **Events/State/Settings/Properties:** modular support modules
- **Bundle:** esbuild-compiled `lightweight-charts-drawing`

### 4.3 CLI (`cli.py`)

Commands: `scan`, `report`, `analyze`, `serve`. Invoked via `python -m tickframe <command>`.

### 4.4 ML Microservice (`ml_service/`)

- `GET /health` — H&S and DT/DB model loaded status
- `POST /predict` — OHLCV → shared features → parallel XGBoost detectors → NMS → detected patterns
- H&S and DT/DB classifiers, 99-candle minimum, detector-specific thresholds
- Numba warmup runs during startup; a NumPy/Python fallback remains available

---

## 5. Data Flow & Algorithmic Structure

See `assignments/6/architecture.md` sections 5.1–5.11 for detailed algorithm descriptions:
- 5.1 Chart Loading Request Flow
- 5.2 Pattern Analysis Flow
- 5.3 Market Broadcast Loop
- 5.4 3-Tier Cache Algorithm
- 5.5 Warmup Algorithm
- 5.6 ML Feature Extraction
- 5.7 ML Inference & NMS
- 5.8 WebSocket Candle Update
- 5.9 Indicator Application
- 5.10 Indicator Recompute & Persistence
- 5.11 Drawing Creation

---

## 6. Database Schema

```sql
CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE drawings (id INTEGER PRIMARY KEY, symbol TEXT, type TEXT, points TEXT, opts TEXT, selected INTEGER, created TEXT);
CREATE TABLE drawings_blob (symbol TEXT PRIMARY KEY, data TEXT NOT NULL, updated TEXT);
CREATE TABLE indicators_blob (symbol TEXT PRIMARY KEY, data TEXT NOT NULL, updated TEXT);
CREATE TABLE toolbar_position (id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), pos_left INTEGER DEFAULT 16, pos_top INTEGER DEFAULT 12);
CREATE TABLE coin_icons (symbol TEXT PRIMARY KEY, url TEXT NOT NULL);
CREATE TABLE candles (symbol TEXT, interval TEXT, time INTEGER, open REAL, high REAL, low REAL, close REAL, volume REAL, updated TEXT, PRIMARY KEY (symbol, interval, time));
```

---

## 7. API Surface

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/coins` | Coin list with prices |
| GET | `/api/coins/{symbol}/price` | Single coin price |
| GET | `/api/coins/{symbol}/candles` | OHLCV candles |
| POST | `/api/analyze/{symbol}` | ML pattern analysis |
| GET | `/api/sentiment` | Fear & Greed Index |
| GET/POST | `/api/indicators` | Indicator configs |
| GET/POST | `/api/drawings` | Drawing data |
| GET/POST | `/api/toolbar-position` | Toolbar position |
| GET/POST | `/api/settings` | User settings |

WebSocket: `/ws/market` (snapshots), `/ws/candles/{symbol}` (live candles)

ML Microservice: `GET /health`, `POST /predict`

---

## 8. Configuration & Environment

| Variable | Default | Used By |
|---|---|---|
| `ML_API_URL` | `http://ml-service:8001/predict` | `ml_client.py` |
| `ML_CONFIDENCE_THRESHOLD` | `0.80` | `ml_client.py` |
| `ML_REQUEST_TIMEOUT` | `30.0` | `ml_client.py` |

---

## 9. Quality Requirements & Architecture Mapping

| QR | Metric | Architecture Support |
|---|---|---|
| QR-001 (Time Behaviour) | p95 ≤ 500ms | 3-tier cache, async, background warmup, WebSocket push |
| QR-002 (Confidentiality) | Zero secrets in commits | Env vars, `.env` in `.gitignore`, `.env.example` |
| QR-003 (Functional Correctness) | F2 ≥ 0.55, FPR ≤ 20% | ML microservice, XGBoost, NMS clustering |
| QRT-004 (WebSocket Reliability) | — | Auto-reconnect, heartbeat, signature detection |
| QRT-005 (DB Cache Round-Trip) | — | SQLite, `run_in_executor`, transaction batching |
