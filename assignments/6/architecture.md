# TickFrame Architecture

> **File:** `assignments/6/architecture.md` — comprehensive architecture of `/tickframe`.

---

## 1. Overview

TickFrame is a **cryptocurrency chart workstation** with a client-server architecture. A **FastAPI backend** serves a static **vanilla JS frontend** (Lightweight Charts v5), interfaces with cryptocurrency exchanges (Bybit primary, Binance fallback), and delegates ML pattern detection (Head & Shoulders via XGBoost) to a separate **microservice**.

- **Frontend:** Static HTML/CSS/JS served by the backend; single-page application.
- **Backend:** FastAPI (Python 3.11+) with async REST + WebSocket endpoints, SQLite persistence, 3-tier cache.
- **ML Service:** Separate FastAPI microservice running XGBoost inference for H&S pattern detection.
- **Deployment:** Docker Compose (2 containers: `tickframe` + `ml-service`).

### Technology Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.11, FastAPI, Uvicorn, httpx, websockets, Pydantic v2 |
| **Frontend** | Lightweight Charts v5.2.0, Canvas API, vanilla JS, `lightweight-charts-drawing` (esbuild bundle), `lightweight-charts-indicators` (esbuild bundle), Lucide icons |
| **Database** | SQLite (via sync `sqlite3`, `run_in_executor`) |
| **ML** | XGBoost (XGBClassifier), pandas, numpy, FastAPI microservice |
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
│   │   └── schemas.py           # Pydantic models: CoinSummary, Candle, CandleResponse, PriceResponse, AnalyzeResponse, Pattern, IndicatorConfig, IndicatorsResponse, IndicatorsPayload
│   └── services/
│       ├── __init__.py
│       ├── bybit_client.py      # Async Bybit v5 client + Binance fallback + pagination + RateLimiter
│       ├── cache.py             # MemoryMarketCache — 3-tier cache (memory -> DB -> exchange)
│       ├── database.py          # SQLite persistence (settings, drawings, candles, coin_icons, toolbar_position)
│       ├── ml_client.py         # HTTP client for ML microservice (POST /predict, multi-URL fallback)
│       ├── coin_icons.py        # CoinGecko icon fetcher (1h TTL cache)
│       └── fng_client.py        # Fear & Greed Index fetcher (6h TTL cache)
├── frontend/                    # Frontend static files
│   ├── index.html               # Main SPA page
│   ├── package.json             # npm: eslint, vitest, esbuild, lightweight-charts-drawing, lightweight-charts-indicators, oakscriptjs
│   ├── package.json             # npm: eslint, vitest (devDeps)
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
│   │   ├── drawing-overlay-src.js # Re-export barrel for lightweight-charts-drawing (ES module source)
│   │   ├── drawing-bundle.js    # esbuild bundle of lightweight-charts-drawing (10343 lines, IIFE)
│   │   ├── drawing-events.js    # EventBus: custom events via EventTarget
│   │   ├── drawing-state.js     # Reactive state: selectedId, drawingCount, symbol
│   │   ├── drawing-settings.js  # Persisted default styles for each tool type (localStorage)
│   │   ├── drawing-controller.js# Drawing lifecycle manager: init, events, redact mode, save/load via API
│   │   ├── drawing-toolbar.js   # Floating toolbar: 11 groups, 34 tools, drag, settings panel
│   │   ├── drawing-properties.js# Properties panel for selected drawing (color, width, opacity, line style, lock, extend)
│   │   ├── drawing-overlay.js   # Top-level TFDraw facade: wires controller + toolbar + properties + keyboard
│   │   ├── indicators-src.js    # ES module source entry for esbuild bundling
│   │   ├── indicators-bundle.js # esbuild bundle of lightweight-charts-indicators + oakscriptjs (IIFE)
│   │   ├── indicators-registry.js # TFIndicators IIFE: 446-indicator registry adapter
│   │   ├── indicators-state.js  # TFIndicatorState IIFE: reactive state with subscribe pattern
│   │   ├── indicators-panes.js  # TFIndicatorPanes IIFE: stacked createChart instances per pane
│   │   ├── indicators-controller.js # TFIndicatorController IIFE: apply/remove/recompute/persist lifecycle
│   │   ├── indicators-panel.js  # TFIndicatorPanel IIFE: right sidebar panel (search + groups)
│   │   └── indicators-chips.js  # TFIndicatorChips IIFE: applied indicator chip pills above chart
│   ├── lib/
│   │   └── charting_library/    # TradingView Charting Library (vendored)
│   └── tests/                   # Vitest JS tests
├── data/                        # SQLite DB (gitignored)
├── detection/                   # Legacy pattern detection
│   ├── __init__.py
│   └── mock.py                  # Random pattern generator (deprecated)
├── exchange/                    # Legacy exchange client
│   ├── __init__.py
│   └── bybit.py                 # Sync Bybit v5 klines fetcher (requests, deprecated)
└── web/                         # Legacy web server
    ├── __init__.py
    ├── server.py                # Simple HTTP server (http.server, deprecated)
    └── static/
        └── index.html           # Legacy dashboard (deprecated)
```

### External: `ml_service/`

```
ml_service/
├── Dockerfile
├── requirements.txt            # xgboost, pandas, numpy, fastapi, uvicorn
└── app/
    ├── __init__.py
    ├── main.py                 # FastAPI ML API: /health, /predict
    ├── config.py               # MODEL_PATH, WINDOW_SIZE=101, FEATURE_ORDER
    ├── schemas.py              # CandleData, PredictRequest, PredictResponse, DetectedPattern
    └── services/
        ├── __init__.py
        ├── features.py         # Feature engineering: ATR, NATR, Trend, extremum search, geometry (symmetry, dominance, slopes)
        └── inference.py        # Pattern thresholds, NMS clustering, business logic
```

---

## 3. Used Libraries

### Python (Backend)

| Library | Version | Usage |
|---|---|---|
| `fastapi` | — | Async web framework |
| `uvicorn` | — | ASGI server |
| `httpx` | — | Async HTTP client (Bybit, Binance, CoinGecko, alternative.me, ML service) |
| `pydantic` | v2 | Request/response validation |
| `aiosqlite` | — | Async SQLite (via `run_in_executor`) |
| `websockets` | — | WebSocket protocol support |

### Python (ML Service)

| Library | Version | Usage |
|---|---|---|
| `xgboost` | — | XGBClassifier for H&S detection |
| `pandas` | — | DataFrame-based feature engineering |
| `numpy` | — | Sliding window extremum search, vectorized ops |
| `fastapi` | — | ML inference API |
| `uvicorn` | — | ASGI server |

### Python (Legacy)

| Library | Usage |
|---|---|
| `requests` | `exchange/bybit.py` (sync, deprecated) |

### JavaScript (Frontend)

| Library | Version | Source | Usage |
|---|---|---|---|
| `lightweight-charts` | 5.2.0 | unpkg CDN | Candlestick chart, volume histogram, SMA line |
| `lightweight-charts-drawing` | — | npm → esbuild bundle | 40+ drawing tools (lines, channels, Fibonacci, Gann, shapes, annotations, measures, positions) |
| `lightweight-charts-indicators` | 0.4.2 | npm → esbuild bundle | 446 TA indicators (82 standard + 317 community + 44 candlestick patterns); depends on `oakscriptjs` 0.2.8 runtime |
| `charting_library` | — | vendored in `lib/` | TradingView Advanced Charting (optional fallback) |
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
- Starts background `market_refresh_loop` (5s interval, broadcasts market snapshot over WebSocket)
- Mounts `/css`, `/js`, `/lib`, `/static` as static file directories
- Serves `index.html` at `/`
- Adds CORS middleware (all origins allowed)
- Includes REST router (`/api`) and WebSocket router

#### `api/endpoints.py` — REST API

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Health check |
| `/api/coins` | GET | List 10 coins with price, 24h change, trend |
| `/api/coins/icons` | GET | Coin icon URLs (CoinGecko) |
| `/api/coins/{symbol}/price` | GET | Single coin price |
| `/api/coins/{symbol}/candles` | GET | OHLCV candles (supports `before` pagination) |
| `/api/analyze/{symbol}` | POST | Run ML pattern analysis on cached or provided candles |
| `/api/sentiment` | GET | Fear & Greed Index |
| `/api/drawings` | GET/POST | Load/save drawings (legacy + blob format) |
| `/api/toolbar-position` | GET/POST | Load/save toolbar position |
| `/api/settings` | GET/POST | Load/save user settings |

#### `api/websocket.py` — WebSocket

- `SocketHub` class: manages connected clients with `asyncio.Lock`
- `/ws/market`: sends market snapshot on connect, keeps connection alive for broadcasts
- `/ws/candles/{symbol}`: sends candle snapshot, then 1s polling loop with signature change detection (snapshot/update/heartbeat)

#### `services/bybit_client.py` — Exchange Client

- `BybitClient`: async HTTP client for Bybit v5 API (`/v5/market/kline`, `/v5/market/tickers`)
- Token-bucket `RateLimiter` (10 req/s, burst 5)
- Automatic fallback to Binance API (`/api/v3/klines`, `/api/v3/ticker/24hr`)
- Pagination support (200 per page for Bybit, 1000 for Binance)
- `DEFAULT_COIN_METADATA`: 10 coins with symbols, names, colors
- Data classes: `Snapshot`, `CandlePayload`
- Helper functions: `normalize_symbol`, `normalize_interval`, `stable_seed`, `utc_now`

#### `services/cache.py` — Memory Cache

- `MemoryMarketCache`: 3-tier cache (memory → SQLite → exchange)
- `MAX_CANDLES = 55000` per (symbol, interval) pair
- Warmup: Phase 1 loads DB candles, Phase 2 fills gaps from exchange sequentially
- `get_candles`: checks memory (TTL 1s), falls back to DB, then exchange; supports `before` parameter for backward pagination
- `refresh_market_snapshot`: calls exchange every 5s, broadcasts via WebSocket
- Thread-safe via `threading.Lock`

#### `services/database.py` — SQLite Service

- `DatabaseService`: sync SQLite via `run_in_executor`
- Tables: `settings` (key/value), `drawings` (legacy), `drawings_blob` (new library format), `indicators_blob` (indicator configs per symbol), `toolbar_position` (singleton), `coin_icons`, `candles` (symbol, interval, time PK)
- Candle operations: save, load, load_last_n, load_before, count, get_range
- All write operations use transactions (`BEGIN...COMMIT`)

#### `services/ml_client.py` — ML Service Client

- `MlClient`: HTTP client for ML microservice
- Multi-URL fallback: primary (`ml-service:8001`) → localhost fallback (`127.0.0.1:8001`)
- Minimum 50 candles required
- Filters results by confidence threshold (default 0.80)

#### `services/coin_icons.py` — Coin Icons

- `CoinIconsClient`: CoinGecko API fetcher with 1h TTL cache
- Maps 10 USDT pairs to CoinGecko IDs
- DB persistence for icon URLs

#### `services/fng_client.py` — Fear & Greed

- `FearAndGreedClient`: alternative.me API fetcher with 6h TTL cache
- Returns value, classification, timestamp
- Fallback to Neutral/50 on failure

### 4.2 Frontend (`frontend/`)

#### `index.html` — SPA Shell

- Layout: sidebar (logo + watchlist + FNG) | main (topbar + chart-container + analysis-stack)
- Scripts loaded in dependency order: TV library → Lightweight Charts → datafeed → sidebar → charts → drawing bundle → Lucide → drawing modules → indicators bundle → indicators modules → app

#### `js/app.js` — App Initialization

- `loadSettings()`: loads theme from API on DOMContentLoaded
- `initIndicatorSubsystem()`: calls `TFIndicatorController.init({getCurrentBarsFn})`, `TFIndicatorPanel.init()`, `TFIndicatorChips.init()`
- Wires `TFChart.setActiveSymbol` to update title + calls `TFIndicatorController.loadForSymbol(symbol)`
- Timeframe button click → calls `TFChart.loadCandles` + `TFChart.startCandleWs` + `setTimeout(TFIndicatorController.recomputeAll, 500)`
- Indicators toggle/close button → toggles `.visible` class on indicators panel
- Theme toggle → applies class, saves setting, redraws FNG, drawings, and `TFIndicatorPanes.applyThemeToAll(dark)`
- Analyze button → calls `TFChart.analyzePatterns`
- Auto-selects first coin in watchlist after 300ms

#### `js/charts.js` — Chart Engine

- Dual-mode: Lightweight Charts v5 (primary) or TradingView Charting Library (advanced, if `TradingView` global exists)
- **Lightweight mode:** creates Candlestick series + Volume histogram + Volume SMA (20-period) line; subscribes to visible range changes for infinite scroll (`loadMoreBefore`); renders ML pattern markers and date-range drawings
- **Advanced mode:** creates `TradingView.widget` with custom `TickFrameDatafeed`; chart theme sync
- Functions: `createChart`, `loadCandles` (fetch 10k candles with abort + cache), `loadMoreBefore` (paginate older candles), `startCandleWs` / `stopCandleWs` (real-time), `analyzePatterns` (POST to `/api/analyze`), `renderPatterns` / `renderDetectedPatterns` (markers + shapes + date-range drawings), `updateIndicators` (volume + SMA), `applyChartTheme`
- In-memory candle cache (`_candleCache`) for fast symbol switching
- Pattern rendering: segments → merge overlapping → markers + `pattern-date-range` drawings via DrawingController

#### `js/sidebar.js` — Watchlist & FNG

- 10 coins with names, icons, prices (5s polling via `/api/coins`)
- Coin click → `TFChart.setActiveSymbol` + `loadCandles` + `startCandleWs`
- Fear & Greed SVG speedometer: Canvas-free SVG arc with needle, zones (Extreme Fear → Extreme Greed), next-update timer
- `loadCoinIcons()`: fetches icons from `/api/coins/icons` and re-renders

#### `js/websocket.js` — WebSocket Manager

- `ManagedSocket` class: auto-reconnect, event-based handlers (`onStatus`, `onMessage`)
- `MarketSocket` (extends ManagedSocket): connects to `/ws/market`
- `CandleSocket` (extends ManagedSocket): connects to `/ws/candles/{symbol}?interval=&limit=`
- URL resolution: protocol-aware (`ws` or `wss`)

#### `js/datafeed.js` — TV Charting Library Adapter

- `TickFrameDatafeed` class: implements TV datafeed interface
- `getBars`: fetches candles from `/api/coins/{symbol}/candles`
- `subscribeBars`: opens WebSocket for real-time updates
- Resolution mapping: `5` → `5m`, `60` → `1h`, `1D` → `1d`, etc.
- Dynamic price scale per symbol (BTC/ETH high precision, DOGE lower)

#### Indicator System (7 modules + bundle)

| Module | File | Responsibility |
|---|---|---|
| **Registry** | `indicators-registry.js` | `TFIndicators` IIFE: wraps `LCIndicators.indicatorRegistry` (446 entries), provides `all()`, `search(query)`, `byGroup()`, `get(id)`, `GROUP_LABELS`. Groups: Standard (82), Candlestick Patterns (44), Community (317). |
| **State** | `indicators-state.js` | `TFIndicatorState` IIFE: reactive state with `subscribe(fn)` → `unsub()` pattern. Methods: `addIndicator`, `removeIndicator`, `updateIndicator`, `setSearchQuery`, `toggleGroup`, `togglePanel`. Exposes `getState()` and `getApplied()`. |
| **Panes** | `indicators-panes.js` | `TFIndicatorPanes` IIFE: manages stacked `LightweightCharts.createChart` instances. `createPane(id, height)` → appends container to `#indicatorPanes`, syncs timeScale with `TFChart.mainChart()`. `destroyPane`, `destroyAll`, `resizeAll`, `applyThemeToAll`. |
| **Controller** | `indicators-controller.js` | `TFIndicatorController` IIFE: lifecycle manager. `applyIndicator(id, inputs?)` branches based on `def.overlay` / `def.group === 'candlestickPatterns'`. Uses `TFIndicatorPanes` for non-overlay. `removeIndicator(uid)` cleans up series + pane. `recomputeAll()` re-calculates with existing inputs, `.setData()` updates. `persist()` POSTs to API. `loadForSymbol(symbol)` GETs and re-applies. |
| **Panel** | `indicators-panel.js` | `TFIndicatorPanel` IIFE: right sidebar UI. Search input filters via `TFIndicators.search()`. Three collapsible groups (Standard / Candlestick Patterns / Community) with chevrons and counts. Click-to-apply calls `TFIndicatorController.applyIndicator()`. |
| **Chips** | `indicators-chips.js` | `TFIndicatorChips` IIFE: horizontal pill row above chart. Each chip shows indicator title + ✕ remove button. Subscribes to state → auto-hides when empty. |
| **Bundle** | `indicators-bundle.js` | esbuild-compiled `lightweight-charts-indicators` + `oakscriptjs`: 446 indicator implementations, each with `{id, group, name, category, overlay, metadata, inputConfig, plotConfig, defaultInputs, calculate}`. Exposed as `window.LCIndicators.indicatorRegistry`. |

#### Drawing System (7 modules)

| Module | File | Responsibility |
|---|---|---|
| **Overlay** | `drawing-overlay.js` | `TFDraw` facade: `init(chart, series, container)`, keyboard shortcuts (Esc, Del, V/L/H/R/C/T/A/B), wires Controller + Toolbar + Properties |
| **Controller** | `drawing-controller.js` | `DrawingController` IIFE: manages `DrawingManager` lifecycle, redact mode (disable scroll/scale during drawing), crosshair preview, click-to-place anchors, auto-save via API (debounced 500ms), load/import drawings per symbol |
| **Toolbar** | `drawing-toolbar.js` | `DrawingToolbar` IIFE: 11 groups × 34 tools (pointer, lines, channels, Fibonacci, Gann, shapes, annotations, draw, measure, trades, actions), drag reposition (saved to API), settings panel (color swatches, width slider, dash style, opacity), Lucide icons |
| **Events** | `drawing-events.js` | `DrawingEvents` IIFE: simple EventTarget-based pub/sub bus (`on`, `off`, `emit`) |
| **State** | `drawing-state.js` | `DrawingState` IIFE: reactive state container with change events (`selectedId`, `selectedDrawing`, `drawingCount`, `symbol`) |
| **Settings** | `drawing-settings.js` | `DrawingSettings` IIFE: per-tool defaults (lineColor, lineWidth, lineDash, fillColor, fillOpacity), persisted in localStorage |
| **Properties** | `drawing-properties.js` | `DrawingProperties` IIFE: properties panel for selected drawing (color, width, opacity, line style, lock, extend left/right) |
| **Bundle** | `drawing-bundle.js` | esbuild-compiled `lightweight-charts-drawing` library: `DrawingManager`, 40+ tool classes, `getToolRegistry`, `DEFAULT_DRAWING_STYLE` |

### 4.3 CLI (`cli.py`)

| Command | Function | Description |
|---|---|---|
| `scan` | `run_scan` | Fetch klines from Bybit or mock data, print table, optional JSON output |
| `report` | `run_report` | Generate Markdown report with OHLCV table or mock patterns |
| `analyze` | `run_analyze` | Cache candles, run mock detection, print/save result |
| `serve` | `run_serve` | Start uvicorn on `tickframe.backend.main:app` |

Invoked via `python -m tickframe <command>`.

### 4.4 ML Microservice (`ml_service/`)

- **`main.py`**: FastAPI with lifespan loading XGBoost model; two endpoints:
  - `GET /health` — returns `{"status": "success", "model_loaded": bool}`
  - `POST /predict` — receives OHLCV candles, runs feature extraction → XGBoost inference → NMS → returns detected patterns
- **`services/features.py`**: `add_smart_features(df)`:
  1. Base metrics: NATR (period=28% of WINDOW_SIZE), Trend, Range_Position
  2. Sliding window extremum search (3 peaks: left shoulder, head, right shoulder)
  3. Geometry features: symmetry ratios, slope angles, dominance metrics, normalized distances
- **`services/inference.py`**: `apply_pattern_thresholds` (confidence ≥ 0.55 for Classic H&S, ≥ 0.50 for Inverse H&S), `apply_nms_clustering` (Non-Maximum Suppression: merge overlapping windows, keep highest confidence)
- Model: XGBoost classifier trained for Head & Shoulders (Classic + Inverse), `WINDOW_SIZE = 101` candles

---

## 5. Data Flow & Algorithmic Structure

### 5.1 Request Flow: Chart Loading

```
Browser                     FastAPI Backend                     SQLite / Exchange
   │                             │                                    │
   │── GET /api/coins/{s}/candles─│                                    │
   │    ?interval=5m&limit=10000  │                                    │
   │                             │── MemoryMarketCache.get_candles()───│
   │                             │    ├─ Check in-memory dict (TTL 1s) │
   │                             │    ├─ Cache hit? → return           │
   │                             │    ├─ Cache miss → DB.load_last_n───│── SQLite query
   │                             │    ├─ DB has data? → return + cache │
   │                             │    └─ DB miss → BybitClient─────────│── Bybit API
   │                             │                    ↕ fallback       │── Binance API
   │                             │    return payload                   │
   │◄─── JSON {candles: [...]}───│                                    │
   │                             │
   │── WS /ws/candles/{s}?interval=5m&limit=1000 ──→ WebSocket hub    │
   │                             │   1s polling loop                  │
   │                             │   signature change detection       │
   │◄── snapshot / update / heartbeat ────────────────────────────────│
```

### 5.2 Request Flow: Pattern Analysis

```
Browser                     FastAPI Backend                  ML Microservice
   │                             │                                │
   │── POST /api/analyze/BTCUSDT─│                                │
   │    ?interval=5m&limit=10000 │                                │
   │    &confidence_threshold=0.8 │                                │
   │                             │── MemoryMarketCache.get_candles│
   │                             │   (or use request body candles)│
   │                             │                                │
   │                             │── MlClient.analyze_candles()───│── POST /predict
   │                             │                                │    ├─ add_smart_features()
   │                             │                                │    │  (ATR, Trend, Extremum,
   │                             │                                │    │   Symmetry, Slopes, Dominance)
   │                             │                                │    ├─ XGBoost predict_proba()
   │                             │                                │    └─ apply_pattern_thresholds()
   │                             │                                │    └─ apply_nms_clustering()
   │                             │◄── {patterns_found: [...]}─────│
   │◄── {patterns: [{timestamp,──│                                │
   │      pattern_type,confidence│                                │
   │     }]}                     │                                │
   │                             │                                │
   │── charts.renderDetectedPatterns(patterns)                    │
   │    ├─ Merge overlapping segments                             │
   │    ├─ Create markers (arrowDown)                             │
   │    └─ Create pattern-date-range drawings                     │
```

### 5.3 Data Flow: Market Broadcast Loop

```
Background task (5s interval)
   │
   ├── MemoryMarketCache.refresh_market_snapshot()
   │    └── BybitClient.fetch_market_snapshot()
   │         └── Bybit v5 /v5/market/tickers (fetch all 10 pairs)
   │              ↕ fallback → Binance /api/v3/ticker/24hr (per pair)
   │    └── Update in-memory prices
   │
   └── SocketHub.broadcast_json({type: "market_snapshot", coins: [...]})
        └── Iterate connected /ws/market clients → send JSON
```

### 5.4 3-Tier Cache Algorithm

```
get_candles(symbol, interval, limit, before?)
   │
   ├─ before is set?
   │   ├─ YES → DB.load_candles_before()
   │   │         └─ enough? → return
   │   │         └─ not enough → exchange.fetch_candles(end_ms=before*1000)
   │   └─ NO  → memory cache (in-memory dict, key=(pair, interval))
   │               └─ hit & fresh (TTL 1s)? → return
   │               └─ miss/stale → DB.load_last_n()
   │                    └─ enough (>=limit)? → return + cache
   │                    └─ not enough → exchange.fetch_candles(limit)
   │                         └─ merge with DB → save to DB → cache → return
   │
   └─ Return {symbol, interval, source, updated_at, candles}
```

### 5.5 Warmup Algorithm (startup)

```
lifespan startup:
   ├── Init BybitClient, DatabaseService, MemoryMarketCache, MlClient
   │
   ├── Phase 1: _load_db_candles_for_all()
   │    └── For each (10 coins × 5 intervals = 50 pairs):
   │         └── count_candles() > 0 → load_last_n(MAX_CANDLES=55000)
   │         └── Load into memory cache in parallel (asyncio.gather)
   │
   └── Phase 2: _fill_to_max() (sequential, one coin at a time)
        └── For each coin in DEFAULT order:
             └── For each interval (5m, 15m, 1h, 4h, 1d):
                  ├── already have MAX_CANDLES? → skip
                  ├── have some? → fetch only older candles (end_ms)
                  └── have none? → full fetch MAX_CANDLES from exchange
                        └── save to DB + cache
```

### 5.6 ML Feature Extraction Algorithm

```
add_smart_features(df):
   │
   ├── 1. BASE METRICS
   │    ├── NATR_{w} = ATR(w) / Close  (w = 28% of WINDOW_SIZE)
   │    ├── Trend_{WS} = Close / Close.shift(WINDOW_SIZE) - 1
   │    └── Range_Position = (Close - Low_min) / (High_max - Low_min + 1e-8)
   │
   ├── 2. SLIDING WINDOW EXTREMUM SEARCH
   │    └── For each sliding window of WINDOW_SIZE=101:
   │         ├── Find 3 highest peaks (L1, H, L2) with min distance constraint
   │         └── Find 2 lowest valleys between peaks
   │
   ├── 3. GEOMETRY FEATURES
   │    ├── Symmetry: |L1_price - L2_price| / L1_price (height balance)
   │    │             |L1_dist - L2_dist| / WINDOW_SIZE (width balance)
   │    ├── Dominance: Head height / max(shoulder heights)
   │    │             Head center offset from window center
   │    ├── Slopes: Left shoulder slope, right shoulder slope
   │    │           Neckline slope (valley-to-valley)
   │    └── Normalized distances: all heights scaled by NATR
   │
   └── 4. RETURN FEATURED DF (aligned, cropped first WINDOW_SIZE-1 rows)
```

### 5.7 ML Inference & NMS Algorithm

```
XGBoost inference:
   ├── X_inference = featured_df[FEATURE_ORDER] (excludes timestamp)
   ├── probas = model.predict_proba(X_inference)
   │    └── Output: [prob_class0, prob_class1, prob_class2]
   │         where 1 = Classic H&S, 2 = Inverse H&S
   │
   ├── apply_pattern_thresholds(probas):
   │    └── For each row:
   │         ├── prob_class1 >= 0.55 → label 1
   │         ├── prob_class2 >= 0.50 → label 2
   │         └── else → label 0
   │
   └── apply_nms_clustering(y_pred, probas):
        └── Group consecutive positive predictions
        └── For each cluster:
             ├── Find argmax confidence for each class
             └── Keep only the peak prediction per cluster
```

### 5.8 WebSocket Candle Update Algorithm

```
candle_stream(websocket, symbol):
   previous_signature = None
   loop (every 1s):
       if first iteration:
           payload = cache.get_candles(symbol, interval, limit)
           send {type: "snapshot", candles: [...]}
       else:
           payload = cache.client.fetch_candles(symbol, interval, 2)
           # only latest 2 candles for efficiency

       last_candle = candles[-1]
       current_signature = (time, open, high, low, close, volume)

       if previous_signature is None:
           send snapshot
       elif current_signature != previous_signature:
           send {type: "update", candle: last_candle}
       else:
           send {type: "heartbeat", timestamp}

       previous_signature = current_signature
       await asyncio.sleep(1)
```

#### 5.9 Indicator Application Algorithm

```
User clicks indicator row in sidebar or search result:
   │
   ├── TFIndicatorPanel.indicatorRow(ind) → TFIndicatorController.applyIndicator(ind.id)
   │
   ├── TFIndicatorController.applyIndicator(indicatorId, inputs?):
   │    ├── Look up definition from TFIndicators.get(indicatorId)
   │    ├── Call def.calculate(bars, mergedInputs)
   │    │    └── Result includes {plots: {plot0: [...]}, metadata: {...}}
   │    │
   │    ├── Branch: def.group === 'candlestickPatterns'?
   │    │    └── renderCandlestickPatterns():
   │    │         ├── Map plot0 data → markers (aboveBar, arrowDown)
   │    │         └── candleSeries.setMarkers(existing + new)
   │    │
   │    ├── Branch: def.overlay === true?
   │    │    └── renderOverlay():
   │    │         ├── chart.addSeries(LineSeries, {color}) per plot
   │    │         └── lineSeries.setData(plotData)
   │    │
   │    ├── Else (pane/non-overlay):
   │    │    └── renderInPane():
   │    │         ├── TFIndicatorPanes.createPane(uid, 120px)
   │    │         ├── pane.chart.addSeries(LineSeries, {color}) per plot
   │    │         └── lineSeries.setData(plotData)
   │    │
   │    ├── TFIndicatorState.addIndicator(entry)
   │    └── TFIndicatorController.persist() → POST /api/indicators
   │
   ├── TFIndicatorState.subscribe → re-renders panel + chips
   │
   └── On render:
        ├── TFIndicatorPanel.render(): rebuilds search/group list
        └── TFIndicatorChips.render(): shows/hides chip pills with ✕
```

### 5.10 Indicator Recompute & Persistence Algorithm

```
On timeframe switch or candle data reload:
   │
   ├── TFIndicatorController.recomputeAll():
   │    ├── bars = getCurrentBars()
   │    ├── For each entry in TFIndicatorState.getApplied():
   │    │    ├── def = TFIndicators.get(entry.indicatorId)
   │    │    ├── result = def.calculate(bars, entry.inputs)
   │    │    ├── Update existing series via .setData() (no destroy/recreate)
   │    │    └── (candlestick patterns → re-create markers)
   │
   ├── TFIndicatorController.persist():
   │    ├── Build payload[] from applied state (uid, indicatorId, inputs, overlay)
   │    └── POST /api/indicators {symbol, indicators: payload}
   │
   └── On symbol switch:
        ├── TFIndicatorController.destroyAll():
        │    ├── Cleanup all series, destroy panes, clear markers
        │    └── TFIndicatorState.setApplied([])
        └── TFIndicatorController.loadForSymbol(newSymbol):
             ├── GET /api/indicators?symbol=X
             ├── For each saved indicator: applyIndicator(id, inputs)
             └── Backend returns raw configs, controller re-renders
```

## 5.11 Drawing Creation Algorithm

```
User clicks drawing tool (e.g., Trend Line):
   │
   ├── DrawingController.activateTool("trend-line")
   │    └── _exitRedactMode() (disable scroll/scale)
   │    └── _manager.setActiveTool("trend-line")
   │
   ├── User clicks on chart (subscribeClick):
   │    ├── Convert pixel → (time, price) via chart API
   │    ├── Create first anchor point
   │    ├── Single-anchor tool? → add drawing immediately
   │    ├── Multi-anchor tool (2+ required)?
   │    │    └── Set _pendingDrawing, wait for more clicks
   │    │    └── Subscribe crosshairMove → preview trail
   │    │    └── On final click → add drawing, _enterRedactMode()
   │
   ├── On drawing:added event:
   │    ├── Auto-save (debounced 500ms):
   │    │    └── _manager.exportDrawings()
   │    │    └── POST /api/drawings {symbol, drawings_data}
   │
   └── On symbol change:
        └── Save current → clear → load new symbol's drawings
             └── GET /api/drawings?symbol=XXX
             └── _manager.importDrawings(data, factory)
```

---

## 6. Database Schema

```sql
-- Settings (key-value store for user preferences)
CREATE TABLE settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Legacy drawings (individual records)
CREATE TABLE drawings (
    id        INTEGER PRIMARY KEY,
    symbol    TEXT NOT NULL DEFAULT '',
    type      TEXT NOT NULL,
    points    TEXT NOT NULL,         -- JSON array
    opts      TEXT NOT NULL DEFAULT '{}', -- JSON object
    selected  INTEGER NOT NULL DEFAULT 0,
    created   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- New library format drawings (blob per symbol)
CREATE TABLE drawings_blob (
    symbol TEXT PRIMARY KEY,
    data   TEXT NOT NULL,            -- JSON exported array
    updated TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indicators config per symbol (blob)
CREATE TABLE indicators_blob (
    symbol  TEXT PRIMARY KEY,
    data    TEXT NOT NULL,            -- JSON array of IndicatorConfig
    updated TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Toolbar position (singleton, id=1)
CREATE TABLE toolbar_position (
    id        INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    pos_left  INTEGER NOT NULL DEFAULT 16,
    pos_top   INTEGER NOT NULL DEFAULT 12
);

-- Coin icons (cached from CoinGecko)
CREATE TABLE coin_icons (
    symbol  TEXT PRIMARY KEY,
    url     TEXT NOT NULL
);

-- Candle data (composite PK)
CREATE TABLE candles (
    symbol    TEXT NOT NULL,
    interval  TEXT NOT NULL,         -- "5m", "15m", etc.
    time      INTEGER NOT NULL,      -- Unix timestamp
    open      REAL NOT NULL,
    high      REAL NOT NULL,
    low       REAL NOT NULL,
    close     REAL NOT NULL,
    volume    REAL NOT NULL DEFAULT 0,
    updated   TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (symbol, interval, time)
);
```

---

## 7. API Surface

### REST Endpoints

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/api/health` | — | `{"status": "ok"}` |
| GET | `/api/coins` | — | `CoinSummary[]` |
| GET | `/api/coins/{symbol}/price` | — | `PriceResponse` |
| GET | `/api/coins/{symbol}/candles` | `interval`, `limit`, `before` | `CandleResponse` |
| POST | `/api/analyze/{symbol}` | `?interval`, `?limit`, `?confidence_threshold` | `AnalyzeResponse` |
| GET | `/api/sentiment` | — | `{value, classification, timestamp}` |
| GET | `/api/coins/icons` | — | `{symbol: url}` |
| GET/POST | `/api/indicators` | `?symbol` / `{symbol, indicators[]}` | `{indicators: IndicatorConfig[]}` / `{status: "ok"}` |
| GET/POST | `/api/drawings` | `?symbol` | `{drawings}` / `{drawings_data}` |
| GET/POST | `/api/toolbar-position` | `{left, top}` | `{status}` |
| GET/POST | `/api/settings` | `{settings: {}}` | `{settings: {}}` |

### WebSocket Endpoints

| Path | Direction | Messages Out | Messages In |
|---|---|---|---|
| `/ws/market` | Server→Client | `snapshot`, `market_snapshot` | any text (keeps alive) |
| `/ws/candles/{symbol}` | Server→Client | `snapshot`, `update`, `heartbeat` | any text (keeps alive) |

### ML Microservice

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/health` | — | `{"status", "model_loaded"}` |
| POST | `/predict` | `{symbol, timeframe, candles: CandleData[]}` | `{symbol, timeframe, patterns_found: DetectedPattern[], processed_candles}` |

---

## 8. Configuration & Environment

| Variable | Default | Used By |
|---|---|---|
| `ML_API_URL` | `http://ml-service:8001/predict` | `ml_client.py` |
| `ML_CONFIDENCE_THRESHOLD` | `0.80` | `ml_client.py` |
| `ML_REQUEST_TIMEOUT` | `30.0` | `ml_client.py` |

---

## 9. Quality Requirements & Architecture Mapping

| QR | Metric | How Architecture Supports |
|---|---|---|
| **QR-001** (Time Behaviour) | p95 ≤ 500ms | 3-tier cache (memory → DB → exchange), async handlers, background warmup, WebSocket push |
| **QR-002** (Confidentiality) | Zero secrets in commits | All config via env vars, `.env` in `.gitignore`, `.env.example` sanitized |
| **QR-003** (Functional Correctness) | F2 ≥ 0.55, FPR ≤ 20% | ML microservice isolation, XGBoost ensemble, NMS clustering, cached deterministic candle data |
| **QRT-004** (WebSocket Reliability) | — | Auto-reconnect in `ManagedSocket`, heartbeat keepalive, signature-based update detection |
| **QRT-005** (DB Cache Round-Trip) | — | SQLite persistent cache, `run_in_executor` for async, transaction batching |

---

## 10. Key Design Decisions

1. **Vanilla JS over framework**: No React/Vue. Simplifies build pipeline (esbuild only for drawing bundle), keeps bundle small, avoids framework churn.
2. **Dual chart engine**: Lightweight Charts v5 as primary (small, fast, no license key), TradingView Charting Library as optional upgrade (rich features, requires license).
3. **3-tier cache**: Memory (fast) → SQLite (persistent across restarts) → Exchange (source of truth). Reduces API calls by ~90% for repeat requests.
4. **WebSocket for real-time**: 1-second polling loop with signature comparison. Avoids exchange WebSocket complexity while providing sub-2-second updates.
5. **ML microservice**: Isolates heavy dependencies (xgboost, pandas, numpy), enables independent scaling/testing, keeps main backend image small.
6. **Sync SQLite via run_in_executor**: Avoids aiosqlite dependency while keeping async request handling. Sufficient for single-user/small-team load.
7. **Module drawing system**: 7 small modules (events, state, settings, controller, toolbar, properties, overlay) instead of one monolithic file. Each has single responsibility.
8. **Module indicator system**: 7 small modules (registry, state, panes, controller, panel, chips, bundle) matching the drawing system pattern. IIFE globals with `TFIndicators`/`TFIndicatorState`/`TFIndicatorPanes`/`TFIndicatorController`/`TFIndicatorPanel`/`TFIndicatorChips` namespaces; reactive state via subscribe/render pattern.
9. **Three indicator rendering branches**: overlay (on main chart), pane (separate sub-chart below), and candlestick pattern (markers on candles). Each uses the correct Lightweight Charts primitive (LineSeries, HistogramSeries, setMarkers).
10. **Panes as stacked createChart instances**: Each non-overlay indicator gets its own `LightweightCharts.createChart` container with timeScale sync to the main chart (Option A from plan). Not using the native pane API because it doesn't exist in Lightweight Charts v5.
11. **Fallback-first exchange design**: Bybit primary, Binance fallback, mock/base-price fallback. Ensures graceful degradation.
