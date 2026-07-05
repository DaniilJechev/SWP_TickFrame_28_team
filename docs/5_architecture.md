# TickFrame — Technical Architecture

## 1. System Overview

Cryptocurrency chart workstation with real-time Bybit data, WebSocket streaming, ML pattern detection (XGBoost Head & Shoulders), and persistent drawing tools. Python FastAPI backend + vanilla JS frontend, deployed via Docker Compose.

---

## 2. Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | Python FastAPI + Uvicorn | ≥0.111 / ≥0.30 |
| Frontend | Vanilla JavaScript (no framework) | ES5/ES6 |
| Charting | lightweight-charts (CDN) or TradingView (proprietary) | 5.2.0 / any |
| Drawings | `lightweight-charts-drawing` (npm, bundled via esbuild) | 0.1.1 |
| Icons | Lucide (CDN via unpkg) | latest |
| Database | SQLite (via `sqlite3`, async via `run_in_executor`) | stdlib |
| ML Service | FastAPI + XGBoost (separate container) | — |
| Containerization | Docker + Docker Compose | — |
| CI | GitHub Actions: ruff, mypy, pytest, bandit | — |

---

## 3. Project Structure

```
SWP_TickFrame_28_team/
├── main.py                    # Uvicorn entry point
├── package.json               # npm: esbuild + drawing lib
├── Dockerfile                 # Multi-stage: Node build → Python runtime
├── docker-compose.yml         # tickframe + ml-service
│
├── tickframe/
│   ├── __main__.py / cli.py   # CLI: scan, report, analyze, serve
│   │
│   ├── backend/
│   │   ├── main.py            # FastAPI app factory, lifespan, CORS, static mounts, market refresh loop
│   │   ├── api/
│   │   │   ├── endpoints.py   # 10 REST endpoints (health, coins, candles, analyze, drawings, settings)
│   │   │   └── websocket.py   # SocketHub, /ws/market, /ws/candles/{symbol}
│   │   ├── models/schemas.py  # Pydantic: CoinSummary, Candle, PriceResponse, Pattern, etc.
│   │   └── services/
│   │       ├── bybit_client.py    # Bybit v5 (primary) + Binance (fallback), token-bucket rate limiter
│   │       ├── cache.py           # MemoryMarketCache — 3-tier: memory → DB → exchange
│   │       ├── database.py        # DatabaseService — SQLite (settings, drawings, candles, coin_icons)
│   │       ├── ml_client.py       # HTTP client → ML microservice
│   │       ├── coin_icons.py      # CoinGecko icon fetcher (1h TTL, DB cache)
│   │       └── fng_client.py      # alternative.me Fear & Greed (6h TTL)
│   │
│   ├── frontend/
│   │   ├── index.html             # SPA entry — loads all JS/CSS in order
│   │   ├── css/
│   │   │   ├── styles.css              # App layout, dark/light CSS vars
│   │   │   ├── drawing-toolbar.css     # Glassmorphism toolbar (always visible)
│   │   │   ├── drawing-properties.css  # Floating properties panel
│   │   │   └── tradingview-custom.css  # TradingView widget theme overrides
│   │   └── js/
│   │       ├── app.js                  # Glue: settings load, theme toggle, timeframe buttons, analyze
│   │       ├── charts.js               # Chart engine: dual-mode (lightweight/advanced), candles, WS, patterns
│   │       ├── sidebar.js              # Watchlist (10 coins), price polling (5s), Fear & Greed SVG gauge
│   │       ├── datafeed.js             # TradingView JS API datafeed adapter
│   │       ├── websocket.js            # ManagedSocket, MarketSocket, CandleSocket classes
│   │       ├── drawing-events.js       # EventTarget event bus
│   │       ├── drawing-state.js        # Centralized reactive state
│   │       ├── drawing-controller.js   # Sole interface to DrawingManager
│   │       ├── drawing-toolbar.js      # Config-driven toolbar builder (Lucide icons)
│   │       ├── drawing-properties.js   # Floating properties inspector
│   │       ├── drawing-overlay.js      # Lifecycle orchestrator, public API (TFDraw)
│   │       ├── drawing-overlay-src.js  # esbuild entry point (ESM imports)
│   │       └── drawing-bundle.js       # esbuild output: 28 drawing tools (~332KB)
│   │
│   ├── exchange/bybit.py          # Legacy sync Bybit client (used by CLI)
│   ├── data/cache.py              # Legacy CandleCache (used by CLI + old server)
│   └── detection/mock.py          # Mock pattern detector
│
├── ml_service/                    # ML microservice (port 8001)
│   ├── Dockerfile, requirements.txt
│   └── app/
│       ├── main.py                # FastAPI: /health, /predict
│       ├── config.py              # WINDOW_SIZE=50, thresholds, FEATURE_ORDER
│       ├── schemas.py             # PredictRequest, PredictResponse
│       └── services/
│           ├── features.py        # 17 engineered features (NATR, geometry, symmetry, slopes)
│           └── inference.py       # Thresholding + NMS clustering (window=10)
│
└── tests/
    ├── conftest.py                # async_client fixture (ASGITransport)
    ├── unit/                      # Cache, BybitClient, schemas, detection (2-5 tests each)
    ├── integration/               # API endpoint tests (health, coins, candles)
    └── requirements/              # QRT: performance (<2s), accuracy, security (no key leakage)
```

---

## 4. Frontend Architecture

### 4.1 Module Communication

All modules communicate exclusively through `window` globals:

| Global | Defined In | Exports |
|--------|-----------|---------|
| `window.TFChart` | charts.js | `createChart`, `loadCandles`, `startCandleWs`, `applyChartTheme`, `analyzePatterns`, `renderPatterns` |
| `window.TFDraw` | drawing-overlay.js | `init`, `teardown`, `setSymbol`, `redraw` |
| `window.Sidebar` | sidebar.js | `renderWatchlist`, `updatePrices`, `onCoinClick` |
| `window.DrawingLib` | drawing-bundle.js | All 28+ drawing tool classes + `DrawingManager`, `ToolRegistry` |
| `window.DrawingEvents` | drawing-events.js | Event bus — `on`, `off`, `emit` methods |
| `window.DrawingState` | drawing-state.js | Reactive state — `activeTool`, `selectedDrawing`, `set()`, `subscribe()` |
| `window.DrawingController` | drawing-controller.js | DrawingManager adapter — `activateTool`, `deleteSelection`, `save`, `load` |
| `window.DrawingToolbar` | drawing-toolbar.js | Config-driven toolbar — `init`, `setActiveTool`, `destroy` |
| `window.DrawingProperties` | drawing-properties.js | Properties panel — `show`, `hide`, `update` |
| `window.TickFrameDatafeed` | datafeed.js | TradingView datafeed constructor |
| `window.MarketSocket`, `CandleSocket`, `ManagedSocket` | websocket.js | WebSocket classes |
| `window.currentSymbol`, `window._candleCache` | charts.js | Shared mutable state |

### 4.2 Script Load Order (index.html)

1. `charting_library.min.js` (optional — may 404) — sets `window.TradingView`
2. lightweight-charts CDN v5.2.0 — sets `window.LightweightCharts`
3. Lucide CDN (unpkg `umd/lucide.js`) — sets `window.lucide`
4. `datafeed.js` → `window.TickFrameDatafeed`
5. `sidebar.js` → `window.Sidebar`
6. `charts.js` → `window.TFChart` (registers `DOMContentLoaded` → `createChart()`)
7. `drawing-bundle.js` → `window.DrawingLib`
8. `drawing-events.js` → `window.DrawingEvents`
9. `drawing-state.js` → `window.DrawingState`
10. `drawing-controller.js` → `window.DrawingController`
11. `drawing-toolbar.js` → `window.DrawingToolbar`
12. `drawing-properties.js` → `window.DrawingProperties`
13. `drawing-overlay.js` → `window.TFDraw` (registers `DOMContentLoaded` → `buildDrawingToolbar()`)
14. `app.js` → event handlers for theme, timeframes, analyze

Dependency chain for drawing modules:

```
DrawingLib → DrawingEvents → DrawingState → DrawingController → DrawingToolbar → DrawingProperties → DrawingOverlay (TFDraw)
    ↑              ↑              ↑                 ↑                  ↑                  ↑
 charting lib   (none)        DrawingEvents       DrawingState     DrawingState       DrawingController
                                                                    DrawingController  DrawingToolbar
                                                                                       DrawingState
```

Each module depends only on modules listed before it. `DrawingToolbar` uses `lucide` for icon rendering. `DrawingOverlay` wires everything together — it is the only module that touches all peers.

### 4.3 Chart Mode Selection (`charts.js`)

```
createChart()
  ├── isChartingLibAvailable()? (window.TradingView !== undefined)
  │     ├── YES → createAdvancedChart()
  │     │         └── TradingView.widget() with custom datafeed
  │     │             enabled_features: ['show_drawing_toolbar']
  │     └── NO  → createLightweightChart()
  │                 ├── LightweightCharts.createChart()
  │                 ├── candleSeries (Candlestick) + volumeSeries (Histogram) + volumeSmaSeries (Line)
  │                 ├── subscribeVisibleTimeRangeChange() → lazy load more candles
  │                 ├── TFDraw.init(chart, candleSeries, container)
  │                 ├── TFDraw.setSymbol(currentSymbol)
  │                 ├── loadCandles(currentSymbol, currentInterval)
  │                 └── startCandleWs(currentSymbol, currentInterval)
```

### 4.4 Data Flow

```
Initial Load:   loadCandles(symbol, interval)
                  → GET /api/coins/{symbol}/candles?interval=&limit=10000
                  → candleSeries.setData(data)
                  → chart.timeScale().setVisibleRange(last 10k)

Real-time:      startCandleWs(symbol, interval)
                  → WebSocket /ws/candles/{symbol}?interval=
                  → msg.type === 'snapshot'  → series.setData(candles)
                  → msg.type === 'update'    → series.update(candle)
                  → msg.type === 'heartbeat' → no-op

Historical:     onVisibleRangeChanged(range)
                  → if range.from < lastCandles[0].time
                    → loadMoreBefore(symbol, interval, before=lastCandles[0].time)
                      → GET /api/coins/{symbol}/candles?before=&limit=5000
                      → merge + deduplicate + series.setData()
```

---

## 5. Coin Switching — Full Execution Trace

This section describes the complete end-to-end flow when a user clicks a coin in the sidebar watchlist. Every layer from the browser click to the exchange API and back to the rendered chart is covered.

### 5.1 Trigger: Sidebar Click

```
User clicks "ETHUSDT" in watchlist
  → sidebar.js: onCoinClick('ETHUSDT')
    ├── 1. TFChart.setActiveSymbol?.('ETHUSDT')
    │        (app.js override: updates window.currentSymbol, title bar, _initialLoadDone flag,
    │         then calls original charts.js setActiveSymbol → sets local currentSymbol = 'ETHUSDT')
    │
    ├── 2. TFChart.loadCandles('ETHUSDT', currentInterval)
    │        (reads active timeframe from .timeframes button.active, e.g. '5m')
    │
    └── 3. TFChart.startCandleWs('ETHUSDT', currentInterval)
```

### 5.2 Frontend — loadCandles() Detailed Trace

```
loadCandles('ETHUSDT', '5m')
  │
  ├── Guard clause: if _currentLoadSymbol === 'ETHUSDT' && currentInterval === '5m' → return
  │   (prevents duplicate loads for same symbol/interval)
  │
  ├── Guard: chartInitMode === 'advanced'?
  │   YES → call widget.setSymbol('ETHUSDT', '5m'), update datafeed, clear patterns → return
  │   NO  → continue with lightweight path
  │
  ├── Generation counter: gen = ++_loadGen  (used to discard stale responses)
  │
  ├── Cache check: _candleCache['ETHUSDT|5m']?
  │   YES → lastCandles = cached
  │          series.setData(lastCandles)                   ← IMMEDIATE RENDER
  │          _updatePriceFormat(lastCandle.close)
  │          updateIndicators(lastCandles)
  │          chart.timeScale().setVisibleRange(last 10k)   ← ZOOM TO RECENT
  │          subscribeVisibleTimeRangeChange()
  │
  ├── Abort previous in-flight request: _currentAbort.abort()
  │   (cancels any pending fetch from a previous coin switch)
  │
  ├── Create new AbortController: _currentAbort = new AbortController()
  │
  ├── FETCH: GET /api/coins/ETHUSDT/candles?interval=5m&limit=10000
  │   [with AbortSignal for cancellation]
  │   │
  │   └── [ASYNC — control returns to browser event loop here]
  │
  ├── (server processes request — see §5.3 Backend)
  │
  ├── Response received:
  │   ├── Parse: data = Array.isArray(payload) ? payload : payload.candles
  │   ├── Normalize: { time, open, high, low, close, volume }
  │   ├── lastCandles = normalized
  │   ├── _candleCache['ETHUSDT|5m'] = normalized
  │   ├── series.setData(normalized)                       ← FULL RE-RENDER
  │   ├── _updatePriceFormat(lastCandle.close)
  │   ├── updateIndicators(normalized)                     ← volume + SMA
  │   ├── chart.timeScale().setVisibleRange(last 10k)      ← ZOOM TO RECENT
  │   └── subscribeVisibleTimeRangeChange()                 ← for infinite scroll
  │
  └── Cleanup: showLoading(false), clear _currentAbort
```

### 5.3 Backend — Candle Request Processing

```
GET /api/coins/ETHUSDT/candles?interval=5m&limit=10000

endpoints.py: get_candles()
  │
  ├── Validate: interval regex ^(1m|3m|5m|...)$, limit 10..55000
  │
  └── cache.get_candles('ETHUSDT', '5m', 10000)

MemoryMarketCache.get_candles('ETHUSDT', '5m', 10000)
  │
  ├── Normalize: normalize_symbol('ETHUSDT') → 'ETHUSDT'
  │              normalize_interval('5m') → '5m'
  │
  ├── Key: ('ETHUSDT', '5m')
  │
  ├── TIER 1 — Memory Cache:
  │     _candles[('ETHUSDT', '5m')] exists and is fresh (<1s old)?
  │     YES → return last 10000 candles immediately         ← FASTEST PATH
  │     NO  → continue
  │
  ├── TIER 2 — SQLite Database:
  │     db.load_last_n_candles('ETHUSDT', '5m', 10000)
  │     Has ≥10000 candles?
  │     YES → update memory cache, return DB candles         ← ~2ms via thread pool
  │     NO  → continue
  │
  ├── TIER 3 — Exchange API:
  │     fetch = max(10000, 200) → 10000
  │     bybit_client.fetch_candles('ETHUSDT', '5m', 10000)
  │       │
  │       ├── Normalize pair/interval
  │       ├── Bybit v5 endpoint: GET /v5/market/kline
  │       │     params: category=spot, symbol=ETHUSDT, interval=5, limit=200
  │       │
  │       ├── PAGINATION LOOP (200 per request):
  │       │     while len(candles) < 10000:
  │       │       │
  │       │       ├── Rate limit: acquire token from token-bucket (10/s, burst 5)
  │       │       ├── Fetch 200 candles from Bybit
  │       │       ├── Parse: row[0]//1000 → time (unix seconds)
  │       │       │          row[1..5] → open/high/low/close/volume (float)
  │       │       │          candles.reverse() → chronological order
  │       │       ├── Deduplicate: skip candle.times already collected
  │       │       ├── oldest_ts = min(new_candles[].time)
  │       │       ├── end_ms = oldest_ts * 1000             ← paginate backward
  │       │       └── Repeat
  │       │
  │       ├── On Bybit failure → fallback to Binance:
  │       │     GET /api/v3/klines?symbol=ETHUSDT&interval=5m&limit=1000
  │       │     Same pagination loop (1000 per request)
  │       │     Timestamps: row[0]//1000 → unix seconds
  │       │
  │       ├── Sort all candles by time, trim to last 10000
  │       └── Return CandlePayload(source='bybit'|'binance')
  │
  ├── Merge with any existing DB candles not in exchange response
  ├── Persist to DB: db.save_candles('ETHUSDT', '5m', candles)
  ├── Update memory cache: _candles[key] = (now, payload)
  └── Return last 10000 candles

Response JSON:
  {
    "symbol": "ETHUSDT",
    "interval": "5m",
    "source": "bybit",
    "updated_at": "2026-07-02T12:34:56Z",
    "candles": [
      {"time": 1656720000, "open": 1890.5, "high": 1920.0, "low": 1885.0, "close": 1910.2, "volume": 12345.6},
      ...
    ]
  }
```

### 5.4 WebSocket — Real-time Candle Updates

After loadCandles completes, the frontend starts a WebSocket for live updates:

```
startCandleWs('ETHUSDT', '5m')
  │
  ├── stopCandleWs() → close any existing WS connection
  │
  └── WebSocket connect to /ws/candles/ETHUSDT?interval=5m
       │
       └── [ASYNC — backend pushes updates every 1 second]

Backend: websocket.py — candle_stream()
  │
  ├── Accept WebSocket
  ├── normalize_symbol('ETHUSDT') → 'ETHUSDT'
  ├── normalize_interval('5m') → '5m'
  │
  └── LOOP (every 1 second):
        │
        ├── First iteration → fetch 1000 candles from cache
        │     → send JSON snapshot:
        │       { type: 'snapshot', candles: [...], symbol: 'ETHUSDT', interval: '5m' }
        │     → store previous_signature = (time, open, high, low, close, volume)
        │
        ├── Subsequent iterations → fetch last 2 candles from exchange
        │     → compare (time, O, H, L, C, V) with previous signature
        │
        ├── Changed?
        │     YES → send JSON update:
        │       { type: 'update', candle: {time, open, high, low, close, volume} }
        │     NO  → send heartbeat:
        │       { type: 'heartbeat', timestamp: '...' }
        │
        └── Sleep 1 second

Frontend onmessage handler (charts.js):
  │
  ├── msg.type === 'snapshot':
  │     if msg.candles.length > lastCandles.length
  │       → lastCandles = msg.candles
  │       → series.setData(newCandles)     ← FULL REPLACE
  │       → updateIndicators()
  │
  ├── msg.type === 'update':
  │     → series.update(candle)             ← INCREMENTAL UPDATE (no full re-render)
  │     → update local lastCandles array:
  │         if lastCandle.time === update.time → replace last entry
  │         else → push new candle
  │     → updateRealtime(time, close, volume, open)
  │       ├── volumeSeries.update(...)      ← single volume bar
  │       └── volumeSmaSeries.setData(calculateSMA(allVolumes, 20)) ← FULL SMA RECALC
  │
  └── msg.type === 'heartbeat':
        → update status text to "LIVE·timestamp"
```

### 5.5 Drawing Persistence on Symbol Switch

When switching coins, drawings for the current symbol are saved before loading the new symbol's drawings:

```
TFDraw.setSymbol('ETHUSDT')
  → DrawingController.setSymbol('ETHUSDT')
    │
    ├── _symbol !== '' && _symbol !== 'ETHUSDT'?
    │   YES: (switching from BTCUSDT to ETHUSDT)
    │     ├── _pendingSymbol = 'ETHUSDT'
    │     ├── _save() → POST /api/drawings
    │     │     body: { symbol: 'BTCUSDT', drawings_data: manager.exportDrawings() }
    │     │
    │     └── on save complete:
    │           ├── _symbol = 'ETHUSDT'
    │           ├── _manager.clearAll()        ← clear BTC drawings from chart
    │           └── _load('ETHUSDT')
    │                 → GET /api/drawings?symbol=ETHUSDT
    │                 → manager.importDrawings(data, factory)  ← render ETH drawings
    │
    └── NO: (first load or same symbol)
          ├── _symbol = 'ETHUSDT'
          └── _load('ETHUSDT')                 ← load drawings for the symbol
                → GET /api/drawings?symbol=ETHUSDT
                → manager.importDrawings(data, factory)
```

---

## 6. Chart Axes: Time Scale and Price Scale

### 6.1 Time Scale (X-Axis)

**Configuration** (lightweight-charts):
```javascript
timeScale: {
  visible: true,
  timeVisible: true,       // show HH:MM in intraday
  secondsVisible: false,   // hide :SS
  borderColor: '#2a2e39',
}
```

**Data Model**: All candle timestamps are Unix seconds (integer). The time scale automatically formats labels based on the visible range:
- Days/months when zoomed far out
- Hours/minutes when zoomed in (due to `timeVisible: true`)
- The `secondsVisible: false` prevents cluttered labels in intraday view

**Visible Range Management**:

The frontend explicitly controls the visible range after data loads:

```javascript
// After loading candles, set viewport to show last ~10,000 candles + 20 interval padding:
chart.timeScale().setVisibleRange({
  from: lastCandles[Math.max(0, lastCandles.length - 10000)].time,
  to:   lastCandles[lastCandles.length - 1].time + intervalSec * 20,
})
```

This ensures the user sees the most recent data with a small buffer of future space on the right.

**Future Range Clamping**:

To prevent users from scrolling into empty future space (beyond the last known candle), the `onVisibleRangeChanged` handler clamps the range:

```javascript
function onVisibleRangeChanged(range) {
  // Allow scrolling left for historical data (triggers loadMoreBefore)
  if (range.from < lastCandles[0].time) { ... load more ... }

  // Clamp right side to maxFutureTime
  var maxTo = _maxFutureTime();   // lastCandle.time + 500 intervals
  if (range.to > maxTo) {
    chart.timeScale().setVisibleRange({ from: range.from, to: maxTo });
  }
}
```

`_maxFutureTime()` computes `lastCandle.time + 500 × intervalSeconds`, providing a limited buffer zone.

**Interval-to-Seconds Mapping**:

```javascript
_intervalToSeconds('5m') → 300
_intervalToSeconds('1h') → 3600
_intervalToSeconds('1d') → 86400
// Supported: s, m, h, d
// w (week) and M (month) fall back to 300s (5m)
```

This mapping is used for visible range padding and future range calculations.

### 6.2 Price Scale (Y-Axis)

**Dual Price Scales**:

The chart has two independent price scales:

1. **Right Price Scale** (Main Candlestick Series):
   ```
   scaleMargins: { top: 0, bottom: 0.22 }
   → Occupies top 78% of the chart height
   ```

2. **Volume Price Scale** (Histogram + SMA):
   ```
   scaleMargins: { top: 0.78, bottom: 0 }
   → Occupies bottom 22% of the chart height
   ```

These two scales share the same time axis but have independent Y ranges. The volume scale uses `priceFormat: { type: 'volume' }` which auto-formats large numbers (e.g., `1.2M`, `45K`).

**Auto-Adaptive Price Precision**:

The `_updatePriceFormat` function dynamically adjusts decimal precision based on the latest close price:

| Price Range | Decimal Places | minMove |
|-------------|---------------|---------|
| ≥ $1,000 | 2 | 0.01 |
| ≥ $100 | 3 | 0.001 |
| ≥ $10 | 4 | 0.0001 |
| ≥ $1 | 5 | 0.00001 |
| ≥ $0.01 | 6 | 0.000001 |
| < $0.01 | 8 | 0.00000001 |

This is called after every candle load and every WebSocket update. High-value assets (BTC at $68K) show 2 decimals; low-value assets (DOGE at $0.12) show 6 decimals.

**Price Formatting for Labels** (used in crosshair and axis labels):

```javascript
_formatChartPrice(price):
  if abs ≥ 1000 → 2 decimals
  if abs ≥ 100  → 3 decimals
  if abs ≥ 10   → 4 decimals
  if abs ≥ 1    → 5 decimals
  if abs ≥ 0.01 → 6 decimals
  else          → 8 decimals
  trailing zeros stripped
  // Examples: 68000 → "68000", 0.12345 → "0.12345", 0.00123456 → "0.00123456"
```

### 6.3 TradingView Advanced Chart Axes

In TradingView mode, axes are managed internally by the widget. The custom datafeed (`datafeed.js`) provides symbol resolution with a `pricescale` hint:

```javascript
resolveSymbol(symbolName, onResolve, onError) {
  var ps = 100;  // default pricescale (2 decimal places)
  if (sym.includes('BTC') || sym.includes('ETH')) ps = 1;     // 0 decimals
  else if (sym.includes('BNB') || sym.includes('SOL')) ps = 10;  // 1 decimal
  else if (sym.includes('XRP') || sym.includes('ADA')) ps = 1000; // 3 decimals
  else if (sym.includes('DOGE')) ps = 10000;  // 4 decimals
}
```

The `pricescale` tells TradingView how many decimal places to display. `minmov: 1` (minimum price movement = 1 pricescale unit). TradingView also supports resolution switching via the `supported_resolutions` array and the `time_frames` config.

---

## 7. Chart Interaction: Scroll, Scale, Crosshair

### 7.1 Scroll and Scale Modes

The chart has two interaction modes controlled by `redactMode` in the drawing controller:

**Normal Mode (Redact = true)** — when no drawing tool is active:
```javascript
handleScroll: { pressedMouseMove: true, mouseWheel: true, horzTouchDrag: true, vertTouchDrag: true }
handleScale: true
```
- Mouse drag pans the chart
- Mouse wheel zooms in/out
- Touch drag scrolls (horizontal + vertical)
- Pinch-to-zoom on touch devices
- This is the default state after chart creation and after completing a drawing

**Drawing Mode (Redact = false)** — when a drawing tool is active:
```javascript
handleScroll: { pressedMouseMove: false, mouseWheel: false, horzTouchDrag: false, vertTouchDrag: false }
handleScale: false
```
- Chart panning and zooming are disabled
- All mouse/touch interactions are captured by the DrawingManager for anchor placement
- Users cannot scroll or scale while placing a drawing

**Mode Transitions**:
```
Drawing tool selected (e.g., click "Trend Line" button)
  → DrawingController.activateTool('trend-line')
    → _exitRedactMode()   → handleScroll=false, handleScale=false
    → manager.setActiveTool('trend-line')

Drawing completed (required anchors placed)
  → _pendingDrawing = null
  → _enterRedactMode()    → handleScroll=true, handleScale=true
  → manager.setActiveTool(null)

Escape key pressed
  → DrawingController.activateTool(null)
    → _enterRedactMode()
    → manager.setActiveTool(null)
```

### 7.2 Zoom Subscription — Infinite Historical Scroll

The chart subscribes to visible range changes to implement infinite scroll backward in time:

```javascript
_zoomSub = chart.timeScale().subscribeVisibleTimeRangeChange(onVisibleRangeChanged);

function onVisibleRangeChanged(range) {
  // Scrolled/panned left enough to need older data?
  if (range.from < lastCandles[0].time) {
    debounce(400ms) → loadMoreBefore(symbol, interval, before=lastCandles[0].time)
  }

  // Prevent scrolling past future buffer
  var maxTo = _maxFutureTime();
  if (range.to > maxTo) {
    chart.timeScale().setVisibleRange({ from: range.from, to: maxTo });
  }
}
```

The `loadMoreBefore` function:
1. Fetches 5,000 candles older than the current oldest candle
2. Merges new + existing candles in chronological order
3. Deduplicates by timestamp
4. Trims to max 55,000 candles (oldest ones dropped if over limit)
5. Calls `series.setData(merged)` — full data replacement
6. Updates indicators

This creates a seamless infinite-scroll experience as the user drags left.

### 7.3 Crosshair

**Configuration**:
```javascript
crosshair: { mode: CrosshairMode.Normal }
// Normal mode: crosshair follows mouse/touch position
// Other available modes: Magnet (snaps to nearest data point)
```

The crosshair displays:
- **Vertical line** across the full chart height
- **Horizontal line** at the cursor's price level
- **Tooltip** showing O/H/L/C/V for the nearest candle

In lightweight-charts, the crosshair is rendered by the library onto the canvas. No custom crosshair logic is needed.

### 7.4 Drawing Crosshair Interaction

When a drawing tool is active, the chart's `subscribeCrosshairMove` handler draws a preview of the drawing anchor position:

```javascript
var crosshairHandler = function (param) {
  if (!_pendingDrawing || !param.point || !_manager) return;
  if (_pendingAnchors.length === 0) return;
  var time = _chart.timeScale().coordinateToTime(param.point.x);
  var price = _series.coordinateToPrice(param.point.y);
  if (time === null || price === null) return;
  _pendingDrawing.setAnchors(_pendingAnchors.concat([{ time: time, price: price }]));
};
```

This provides real-time preview of where the next anchor will be placed as the user moves the mouse.

### 7.5 Click Handling for Drawing Creation

```javascript
_chart.subscribeClick(function (param) {
  // 1. Get active tool — if none, switch to redact mode
  var toolType = _manager.getActiveTool();
  if (!toolType) { _enterRedactMode(); return; }

  // 2. Convert pixel coordinates → (time, price)
  var time = _chart.timeScale().coordinateToTime(param.point.x);
  var price = _series.coordinateToPrice(param.point.y);

  // 3. Look up tool definition (required anchors count)
  var toolDef = registry.get(toolType);

  if (_pendingDrawing) {
    // Multi-anchor tool in progress — add another anchor
    _pendingAnchors.push(anchor);
    _pendingDrawing.setAnchors(newAnchors);

    // If all required anchors placed → drawing complete
    if (newAnchors.length >= toolDef.requiredAnchors) {
      _pendingDrawing = null;
      _enterRedactMode();
      _manager.setActiveTool(null);  // return to cursor mode
    }
  } else {
    // Single-click tool (or first click of multi-click tool)
    var drawing = registry.createDrawing(toolType, id, [anchor], style, {});
    if (toolDef.requiredAnchors > 1) {
      _pendingDrawing = drawing;     // wait for more clicks
      _pendingAnchors = [anchor];
    } else {
      _enterRedactMode();            // immediate completion
      _manager.setActiveTool(null);
    }
    _manager.addDrawing(drawing);
  }
});
```

### 7.6 Window Resize Handling

```javascript
window.addEventListener('resize', () => {
  const r = container.getBoundingClientRect();
  lwChart.resize(Math.max(300, r.width), Math.max(200, r.height));
});
```

On every window resize event, the chart dimensions are recalculated from the container's current bounding rectangle. Minimum dimensions of 300×200 pixels prevent degenerate rendering. The TradingView advanced chart handles resize automatically via `autosize: true`.

---

## 8. Backend Architecture

### 8.1 Application Factory (`tickframe/backend/main.py`)

```
create_app()
  ├── FastAPI(title="TickFrame", version="1.0.0")
  ├── CORSMiddleware(allow_origins=["*"])
  ├── StaticFiles mounts: /css, /js, /lib, /static
  ├── GET / → FileResponse('frontend/index.html')
  ├── include_router(api_router)  → endpoints.py
  ├── include_router(ws_router)   → websocket.py
  └── Lifespan:
        ├── Init: BybitClient, DatabaseService, MemoryMarketCache, MlClient
        ├── Start: cache.warm_up() → Phase 1 (DB load) + Phase 2 (exchange fill, up to 55k candles per pair/interval)
        ├── Start: market_refresh_loop() → every 5s → refresh snapshot → hub.broadcast_json()
        └── Shutdown: cancel tasks, close HTTP clients
```

### 8.2 REST Endpoints

| Method | Path | Params | Deps | Description |
|--------|------|--------|------|-------------|
| GET | `/api/health` | — | — | `{"status": "ok"}` |
| GET | `/api/sentiment` | — | fng_client | Fear & Greed Index |
| GET | `/api/coins/icons` | — | coin_icons + DB | Coin image URLs |
| GET | `/api/coins` | — | cache | All 10 coins with price/change_24h |
| GET | `/api/coins/{symbol}/price` | — | cache | Single coin price |
| GET | `/api/coins/{symbol}/candles` | interval, limit, before | cache | OHLCV (max 55k) |
| POST | `/api/analyze/{symbol}` | interval, limit, confidence_threshold | cache + ml_client | ML pattern detection |
| GET | `/api/drawings` | symbol | DB | Load drawings (blob, fallback legacy) |
| POST | `/api/drawings` | symbol, drawings/drawings_data | DB | Save drawings |
| GET | `/api/settings` | — | DB | All key-value settings |
| POST | `/api/settings` | settings dict | DB | Upsert settings |

Dependency injection via `request.app.state`: `get_cache`, `get_ml_client`, `get_database`.

### 8.3 WebSocket

**SocketHub** (singleton, asyncio.Lock-guarded set of WebSocket clients):

| Path | Behavior |
|------|----------|
| `/ws/market` | Sends snapshot immediately, receives broadcast every 5s (`type: "market_snapshot"`) |
| `/ws/candles/{symbol}` | Params: `interval`, `limit`. Sends snapshot on connect, polls exchange every 1s for changes, emits `update` or `heartbeat` |

---

## 9. Caching — 3-Tier MemoryMarketCache

```
get_candles(symbol, interval, limit)
  ├── Tier 1 (Memory): _candles[(symbol, interval)] — if fresh (<1s) and has ≥limit, return
  ├── Tier 2 (DB):     db.load_last_n_candles() — if has ≥limit, update memory, return
  └── Tier 3 (Exchange): Bybit (primary) → Binance (fallback), save to DB + memory, return
```

- **MAX_CANDLES**: 55,000 per `(symbol, interval)` pair
- **Thread safety**: `threading.Lock` (hybrid async/sync model)
- **Warm-up**: Phase 1 loads DB → Phase 2 fetches missing history sequentially from exchange
- **Refresh**: `refresh_market_snapshot()` every 5s → fetches tickers for all 10 pairs → updates `_prices` → broadcasts via WebSocket

### 9.1 Performance Characteristics

| Tier | Latency | Hit Rate (steady state) |
|------|---------|------------------------|
| Memory | < 1μs | High (after warmup + first fetch) |
| DB (thread pool) | ~2ms | Medium (after at least one exchange fetch) |
| Exchange (pagination) | 200ms–5s | Always eventually succeeds |

On first-ever load for a symbol, the cache will miss in memory and DB, then trigger an exchange fetch with pagination (50 requests × 200 candles for 10,000 candles). Subsequent loads hit memory instantly.

---

## 10. Database (SQLite)

**File**: `tickframe/data/tickframe.db`

| Table | Key | Purpose |
|-------|-----|---------|
| `settings` | `key TEXT PK` | Key-value settings store |
| `drawings` | `id INTEGER PK` | Legacy drawings (type, points JSON, opts JSON, symbol) |
| `drawings_blob` | `symbol TEXT PK` | Full JSON blob per symbol (current format) |
| `coin_icons` | `symbol TEXT PK` | Cached CoinGecko icon URLs |
| `candles` | `(symbol, interval, time) PK` | OHLCV candle persistence |

All DB operations run in a thread pool via `loop.run_in_executor()` — no async SQLite adapter.

---

## 11. Drawing System

### 11.1 Architecture Overview

The drawing system is split into 6 focused modules + 1 esbuild bundle, following a layered architecture:

```
┌──────────────────────────────────────────────────────────────────────┐
│                       drawing-overlay.js                             │
│             Lifecycle Orchestrator / Public API (TFDraw)              │
│   init → DrawingController.init() → toolbar/properties → ready      │
└──────────────────────────────────────────────────────────────────────┘

                          Data flow at runtime:

 Toolbar / Keyboard
      │
      ▼ (calls directly, no intermediate state)
 DrawingManager.setActiveTool(toolType)
      │
      ├── handles mouse events (own lifecycle)
      ├── emits 'tool:changed' ──────────► Toolbar highlight
      ├── emits 'drawing:selected' ──────► State.selectedDrawing
      │                                     └──► Properties panel
      ├── emits 'drawing:added/removed' ──► State.drawingCount
      │                                     └──► Autosave
      └── emits 'drawing:updated' ────────► Autosave

 ┌─────────────────┐   ┌──────────────────┐   ┌──────────────────┐
 │  toolbar (.js)   │   │  controller (.js) │   │  state (.js)     │
 │  INPUT ONLY      │   │  THIN ADAPTER     │   │  MINIMAL         │
 │  Click → Manager │   │  activateTool()   │   │  selectedDrawing │
 │  Listens events  │   │    → setActiveTool│   │  drawingCount    │
 │  for UI update   │   │  updateStyle()    │   │  symbol          │
 └──────────────────┘   │    → getDrawing   │   └──────────────────┘
                        │       .updateStyle│
                        │  exportDrawings() │   ┌──────────────────┐
                        │  importDrawings() │   │  properties (.js)│
                        └────────────────────┘   │  UI only         │
                                                  │  Controller wraps│
                                                  └──────────────────┘

 Key rule: DrawingManager is the source of truth for tool state
 and selection, but it does NOT create drawings on click.
 It only stores the active tool type string + emits `tool:changed`.
 Drawing creation must be handled separately (see §11.6).
```

#### Module Responsibilities

| Module | Global | Lines | Role |
|--------|--------|-------|------|
| `drawing-bundle.js` | `window.DrawingLib` | 332KB (built) | IIFE bundle of `lightweight-charts-drawing` — exports `DrawingManager`, `ToolRegistry`, 28+ tool classes |
| `drawing-events.js` | `window.DrawingEvents` | ~40 | `EventTarget`-based pub/sub bus with `on()`, `off()`, `emit()` — all inter-module communication flows through this |
| `drawing-state.js` | `window.DrawingState` | ~40 | Minimal reactive state — only `selectedDrawing`, `selectedId`, `drawingCount`. Does **not** track active tool — that belongs to DrawingManager. |
| `drawing-controller.js` | `window.DrawingController` | ~140 | Thin adapter. **Only** module that touches `DrawingLib`. Every method is a 1:1 wrapper around `DrawingManager` API. `activateTool()` → `_manager.setActiveTool()`, no state writes. Wires all 7 `DrawingManager` events → event bus + state updates. |
| `drawing-toolbar.js` | `window.DrawingToolbar` | ~190 | Passive input device. Click → calls `DrawingController.activateTool(toolType)` **directly** (no event bus detour). Highlight driven by `tool:changed` event from DrawingManager. Never reads or writes tool state. |
| `drawing-properties.js` | `window.DrawingProperties` | ~180 | Floating properties panel. Color picker (8 presets), line width/opacity sliders, line style toggles (solid/dashed/dotted), extend left/right, lock toggle |
| `drawing-overlay.js` | `window.TFDraw` | ~120 | Top-level orchestrator. Wires all modules together, handles `DOMContentLoaded`, provides public API: `init()`, `setSymbol()`, `redraw()`, `teardown()` |

### 11.2 Tool Groups (28 tools)

| Group | Tools | Shortcuts |
|-------|-------|-----------|
| Cursor | Select/Pointer | V |
| Lines | Trend Line, Horizontal, Vertical, Ray, Cross Line | L, H, none, none, none |
| Channels | Parallel Channel, Regression Trend | none |
| Fibonacci | Retracement, Extension, Channel, Time Zone, Speed Fan | none |
| Gann | Box, Fan | none |
| Shapes | Rectangle, Circle, Triangle | R, C, T |
| Annotations | Arrow, Text, Callout, Price Label, Flag Mark | A, none, none, none, none |
| Draw | Brush, Highlighter | B |
| Measure | Price Range, Date Range, Date & Price Range | none |
| Trades | Long Position, Short Position | none |
| Actions | Delete, Clear All | Del, none |

Tools rendered from a single `TOOL_GROUPS` configuration array (in `drawing-toolbar.js`). No DOM is hardcoded — the toolbar is regenerated entirely from config.

### 11.3 Module Communication

```
Toolbar click
  → DrawingController.activateTool('trend-line')           [no state write]
    → DrawingManager.setActiveTool('trend-line')           [manager owns tool state]
      → DrawingManager emits 'tool:changed'
        → DrawingEvents.emit('tool:changed', {toolId: 'trend-line'})
          → DrawingToolbar highlights 'trend-line' button

User draws on chart
  → DrawingManager handles mouse (own lifecycle)
  → DrawingManager emits 'drawing:added'
    → DrawingController._wireManagerEvents callback
      → DrawingState.setDrawingCount(n)
      → autoSave() [500ms debounce]
        → _manager.exportDrawings()
        → POST /api/drawings { symbol, drawings_data }

User selects a drawing
  → DrawingManager handles click, emits 'drawing:selected'
    → DrawingController callback
      → DrawingState.setSelected(drawing)
        → DrawingProperties.show(drawing)

User changes color in properties panel
  → DrawingProperties.onColorClick('#FF0000')
    → DrawingController.updateDrawingStyle(id, {lineColor: '#FF0000'})
      → _manager.getDrawing(id).updateStyle({lineColor: '#FF0000'})
      → DrawingManager emits 'drawing:updated'
        → autoSave()

User presses V key
  → drawing-overlay.js _onKeyDown
    → DrawingController.activateTool(null)                  [null = cursor mode]
      → DrawingManager.setActiveTool(null)
        → emits 'tool:changed'
          → Toolbar highlights cursor button
```

### 11.4 Event Bus (`drawing-events.js`)

```javascript
window.DrawingEvents = new EventTarget()
// Methods:
//   .on(event, handler)     → addEventListener wrapper
//   .off(event, handler)    → removeEventListener wrapper
//   .emit(event, detail)    → dispatchEvent with CustomEvent detail

// All events flow through here:
//   'controller:init'        → toolbar/properties init (fired after DrawingManager attach)
//   'controller:teardown'    → cleanup
//   'tool:changed'           → toolbar highlight (from DrawingManager 'tool:changed')
//   'state:*'                → state change notifications
//   'drawing:selected'       → properties panel show (from DrawingManager 'drawing:selected')
//   'drawing:deselected'     → properties panel hide

// Toolbar click does NOT emit an event — it calls DrawingController.activateTool() directly.
```

### 11.5 State Management (`drawing-state.js`)

```javascript
window.DrawingState = {
  selectedId: null,        // currently selected drawing ID
  selectedDrawing: null,   // drawing object or null
  drawingCount: 0,         // number of drawings on current symbol

  set(key, value) { ... emits 'state:<key>' }
  setSelected(drawing) { ... sets selectedId + selectedDrawing }
}
```

**`activeTool` is deliberately absent.** Tool state belongs exclusively to `DrawingManager`. The state object holds only what the manager does not expose: selected drawing reference (for the properties panel) and drawing count (for potential status display).

Toolbar highlight is driven by `DrawingManager`'s `'tool:changed'` event, not by DrawingState.

### 11.6 Controller (`drawing-controller.js`)

The controller is the **only** module that imports from `DrawingLib`. It is a thin adapter, plus it implements **drawing creation on click** (which `DrawingManager` does NOT do):

```
DrawingController
  .init(chart, series, container)
    → new DrawingLib.DrawingManager()
    → manager.attach(chart, series, container)
    → _wireManagerEvents() — subscribe to all 7 DrawingManager events
    → _initDrawingCreation() — subscribe to chart clicks for drawing creation
    → DrawingEvents.emit('controller:init')
    → (toolbar + properties init on this event)

  .activateTool(toolType)
    → _cancelPending() — discard any in-progress drawing
    → manager.setActiveTool(toolType)           // no state write, no deselectAll

  .deleteSelection()
    → if _pendingDrawing: cancelPending (remove from manager)
    → else: manager.getSelectedDrawing() → manager.removeDrawing(id)

  .clearAll()
    → _pendingDrawing = null
    → manager.clearAll()

  .updateDrawingStyle(id, style)
    → manager.getDrawing(id).updateStyle(style)

  .updateDrawingOptions(id, options)
    → manager.getDrawing(id).updateOptions(options)

  .setSymbol(symbol)
    → if switching: save → clear → load(symbol)
    → if first load: load(symbol) immediately

  .load(symbol)
    → GET /api/drawings?symbol= → manager.importDrawings(data, factory)

  .save()
    → manager.exportDrawings() → POST /api/drawings

  .redraw()
    → chart.requestUpdate()

Drawing creation (_initDrawingCreation) — chart.subscribeClick handler:
  → if no active tool, return (DrawingManager handles selection)
  → get time/price from click pixel coordinates
  → look up toolDef from ToolRegistry.get(toolType)
  → if no _pendingDrawing:
      create drawing with 1 anchor via registry.createDrawing()
      if toolDef.requiredAnchors > 1, store as _pendingDrawing
      manager.addDrawing(drawing)
  → if _pendingDrawing:
      add anchor to _pendingDrawing.anchors
      if anchors.length >= toolDef.requiredAnchors:
        _pendingDrawing = null  (drawing is complete)
        manager.setActiveTool(null)  (return to cursor mode)

Event wiring (_wireManagerEvents):
  manager.on('drawing:added')     → update count + autosave
  manager.on('drawing:removed')   → update count + autosave
  manager.on('drawing:updated')   → autosave
  manager.on('drawing:cleared')   → reset count + autosave
  manager.on('drawing:selected')  → DrawingState.setSelected(drawing)
  manager.on('drawing:deselected')→ DrawingState.setSelected(null)
  manager.on('tool:changed')      → DrawingEvents.emit('tool:changed', ...)
    (also cancels _pendingDrawing if tool switched to null externally)

Auto-save: 500ms debounce, POSTs manager.exportDrawings()
```

### 11.7 Selected Drawing Highlighting

When a drawing is selected, the controller temporarily overrides its style to provide visual feedback:

```
manager.on('drawing:selected', function (event) {
  // Store original style
  _highlightOrigins[d.id] = {
    lineColor: d.style.lineColor,
    lineWidth: d.style.lineWidth,
    lineDash: d.style.lineDash,
  };
  // Apply highlight: cyan color, dashed
  d.updateStyle({ lineColor: '#64B5F6', lineWidth: d.style.lineWidth || 2, lineDash: [5, 5] });
});

manager.on('drawing:deselected', function (event) {
  // Restore original style
  d.updateStyle(_highlightOrigins[id]);
  delete _highlightOrigins[id];
});
```

This is the only case where the controller mutates a drawing's style — it is always restored on deselect.

### 11.8 Hit Area Boosting

The controller boosts hit detection thresholds on all drawing classes for better UX:

```javascript
function _boostHitAreas() {
  // Set HIT_THRESHOLD to 12px on all drawing classes
  Object.values(DrawingLib).forEach(function (c) {
    if (typeof c === 'function' && c.HIT_THRESHOLD !== void 0) c.HIT_THRESHOLD = 12;
  });
  // Override anchor hit test for 14px click radius
  DrawingLib.Drawing.prototype.hitTestAnchor = function (pt, vp) {
    var pts = this.getControlPoints(vp);
    for (var i = 0; i < pts.length; i++) {
      var dx = pt.x - pts[i].x, dy = pt.y - pts[i].y;
      if (Math.sqrt(dx * dx + dy * dy) <= 14) return pts[i].index;
    }
    return null;
  };
}
```

### 11.9 Toolbar (`drawing-toolbar.js`) — Passive Input Device

The toolbar is deliberately **not** a controller. It is a passive input device that:

1. **Generates DOM** from a `TOOL_GROUPS` configuration array (no hardcoded buttons)
2. **Forwards clicks directly** to `DrawingController.activateTool(toolType)` — no event bus, no intermediate state
3. **Listens for `tool:changed`** events from `DrawingManager` (via `DrawingEvents`) to update its highlight state
4. **Renders tooltips** on hover with shortcut hints

```javascript
// Tool click handler — the critical path:
function _click(tool) {
  if (tool.type === 'delete') { DrawingController.deleteSelection(); return; }
  if (tool.type === 'clear')  { DrawingController.clearAll(); return; }
  DrawingController.activateTool(tool.type);  // ← direct call, no state
}

// Highlight driven by DrawingManager, NOT by state:
DrawingEvents.on('tool:changed', function (d) { _highlight(d.toolId); });
```

Each tool entry specifies a `type` field that maps **directly to library tool type strings** (`'trend-line'`, `'horizontal-line'`, `'rectangle'`, etc.). The `type` value is passed verbatim to `DrawingManager.setActiveTool()`.

```
TOOL_GROUPS entry shape:
{
  id: 'trend-line',         // DOM identifier
  type: 'trend-line',       // DrawingManager tool type string — passed directly
  icon: 'MoveUpRight',      // Lucide icon name
  title: 'Trend Line',      // display name
  shortcut: 'L'             // keyboard shortcut
}
```

The toolbar does NOT:
- Track active tool state
- Emit custom tool-click events
- Attach mouse listeners to the chart
- Deselect or clear anything before activating a tool

```
Toolbar DOM:
┌────────────────────┐
│  toolbar            │  56px wide, left:16px, top:70px
│  ┌──────────────┐   │  flex-direction: column, gap: 2px
│  │  [V] pointer  │   │  40×40px buttons, 10px radius
│  │  ──────────   │   │  active: #26a69a accent
│  │  [L] trend    │   │  hover: rgba(255,255,255,.08)
│  │  [H] horiz    │   └── + scale(1.05)
│  └──────────────┘
│  ┌──────────────┐      tooltip: rgba(0,0,0,.9)
│  │  [R] rect     │      label + shortcut hint
│  │  [C] circle   │
│  │  [T] triangle │
│  └──────────────┘
│  ...
└────────────────────┘
```

**Keyboard shortcuts** are registered in `drawing-overlay.js` (not in the toolbar module). All shortcuts call `DrawingController.activateTool(type)` directly:

| Key | Tool | Key | Tool |
|-----|------|-----|------|
| `v` | Select (cursor) | `r` | Rectangle |
| `l` | Trend Line | `c` | Circle |
| `h` | Horizontal Line | `t` | Triangle |
| Escape | Select (cursor) | `a` | Arrow |
| Delete/Backspace | Delete selected | `b` | Brush |

### 11.10 Properties Panel (`drawing-properties.js`)

Floating panel that appears when a drawing is selected. It does **not** mutate drawings directly — all mutations go through `DrawingController`:

```javascript
// Before (wrong): direct drawing mutation
_currentDrawing.updateStyle({lineColor: '#FF0000'});

// After (correct): controller wrapper
DrawingController.updateDrawingStyle(_currentId, {lineColor: '#FF0000'});
// → _manager.getDrawing(id).updateStyle(style)
// → DrawingManager emits 'drawing:updated'
// → autoSave()
```

Triggered by `DrawingEvents.on('drawing:selected')` and `DrawingEvents.on('drawing:deselected')` (both originating from `DrawingManager` events via the controller).

```
┌─────────────────────────────────┐
│  Properties                     │  floating panel
│  ─────────────────────────────  │  left of toolbar
│  ● ● ● ● ● ● ● ●              │  280px wide
│  ─────────────────────────────  │  glassmorphism
│  Width  ──────○─────────  4    │
│  Opacity ──○───────────── 0.8  │
│  ─────────────────────────────  │
│  Style  ━━━ ━ ━ ━ ━             │
│  ─────────────────────────────  │
│  Extend  [◄] [►]               │
│  Lock    [  ]                   │
└─────────────────────────────────┘
```

### 11.11 Lifecycle

```
Page Load
  │
  ├── Scripts load in order (see §4.2)
  │     └── All globals registered
  │
  ├── charts.js DOMContentLoaded
  │     └── createChart()
  │           ├── LightweightCharts.createChart()
  │           ├── TFDraw.init(chart, candleSeries, container)
  │           ├── TFDraw.setSymbol(currentSymbol)
  │           ├── loadCandles(currentSymbol, currentInterval)
  │           └── startCandleWs(currentSymbol, currentInterval)
  │
  └── drawing-overlay.js DOMContentLoaded
        └── (skipped — _initialized flag already set by TFDraw.init())

TFDraw.init(chart, series, container):
  1. Register listener for 'controller:init' →
     DrawingToolbar.init() + DrawingProperties.init()
  2. DrawingController.init(chart, series, container)
     → new DrawingLib.DrawingManager()
     → manager.attach(chart, series, container)
     → _wireManagerEvents() — subscribes to 7 manager events
       • drawing:added     → update count + autosave
       • drawing:removed   → update count + autosave
       • drawing:updated   → autosave
       • drawing:cleared   → reset count + autosave
       • drawing:selected  → DrawingState.setSelected()
       • drawing:deselected→ DrawingState.setSelected(null)
       • tool:changed      → DrawingEvents.emit('tool:changed')
     → DrawingEvents.emit('controller:init')
  3. 'controller:init' fires → DrawingToolbar.init() runs
     → builds DOM, subscribes to DrawingEvents.on('tool:changed')
  4. DrawingProperties.init() runs
     → subscribes to DrawingEvents.on('drawing:selected')
  5. Load persisted drawings for current symbol

TFDraw.setSymbol(symbol):
  1. Is this a new symbol?
     YES → DrawingController._save()     → persist current (manager.exportDrawings)
           manager.clearAll()             → clear chart
           DrawingController._load(symbol) → GET → manager.importDrawings
     NO  → DrawingController._load(symbol) → GET → manager.importDrawings

TFDraw.redraw():
  → DrawingController.redraw()     → manager.requestUpdate()

TFDraw.teardown():
  1. DrawingController.teardown()
     → unsubscribe all manager events
     → manager.detach()
     → clear save timer
     → DrawingState.reset()
  2. Remove keydown listener
  3. _initialized = false
```

### 11.12 Persistence Format

```json
// GET /api/drawings?symbol=BTCUSDT → {"drawings_data": [
  {"id": "tl-1", "type": "trend-line",
   "anchors": [{"time": 1622505600, "price": 50000}, {"time": 1622592000, "price": 51000}],
   "style": {"lineColor": "#2962FF", "lineWidth": 2},
   "options": {"extendRight": true}}
]}

// Legacy fallback: {"drawings": [...]} — same structure, different key
```

Auto-save: 500ms debounce via `setTimeout`/`clearTimeout`. Save is skipped during active drag (`isDragging` flag set by `drawing:dragstart`/`drawing:dragend`).

### 11.13 Design System (Glassmorphism)

| Element | Value |
|---------|-------|
| Toolbar width | 56px |
| Button size | 40×40px |
| Border radius | 10px (buttons), 14px (toolbar/panel) |
| Background | `rgba(28, 28, 32, 0.78)` |
| Backdrop filter | `blur(18px)` |
| Border | `1px solid rgba(255, 255, 255, 0.06)` |
| Active accent | `#26a69a` (teal) |
| Hover state | `rgba(255, 255, 255, 0.08)` + `scale(1.05)` |
| Tooltip bg | `rgba(0, 0, 0, 0.9)` |
| Lucide icon size | 18px |
| Lucide stroke width | 1.75 |
| Divider | `1px solid rgba(255, 255, 255, 0.06)` |

Light theme overrides (via `body.light` CSS selector):
- Background: `rgba(240, 240, 245, 0.85)`
- Border: `1px solid rgba(0, 0, 0, 0.08)`
- Hover: `rgba(0, 0, 0, 0.06)`
- Tooltip bg: `rgba(240, 240, 245, 0.95)`

### 11.14 TradingView Mode

In TradingView mode (`window.TradingView` available), the custom drawing toolbar is suppressed — the TradingView widget has its own built-in drawing toolbar enabled via `enabled_features: ['show_drawing_toolbar']`. The lightweight drawing modules are never initialized.

---

## 12. ML Microservice

### 12.1 Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | `{"status": "success", "model_loaded": true}` |
| POST | `/predict` | Head & Shoulders detection |

### 12.2 Inference Pipeline

```
PredictRequest (candles[])
  → validate timeframe (only "5m"), min 50 candles
  → Pandas DataFrame
  → add_smart_features(df) — 17 features:
      NATR_14, Trend_50, Range_Position,
      H_Prc_2, L_Prc_2 (head/neck ATR-scaled)
      Width features (L/R shoulder widths)
      Time_Sym_Classic, Time_Sym_Inv
      Head_Dom_Classic, Shoulder_Sym_Classic, Neck_Slope_Classic
      Head_Dom_Inv, Shoulder_Sym_Inv, Neck_Slope_Inv
  → model.predict_proba(X_inference) — XGBoost classifier
  → apply_pattern_thresholds(): Classic H&S ≥ 0.60, Inverse ≥ 0.65
  → apply_nms_clustering(): tolerance=10 candles, keep max confidence
  → PredictResponse (patterns_found[])
```

### 12.3 Configuration

| Parameter | Value |
|-----------|-------|
| WINDOW_SIZE | 50 |
| TOLERANCE_WINDOW | 10 |
| THRESHOLD_CLASSIC_HS | 0.60 |
| THRESHOLD_INVERSE_HS | 0.65 |
| FEATURE_ORDER | 17 features (strict order) |

---

## 13. Docker

### 13.1 Dockerfile (Multi-stage)

```
Stage 1 (builder):  node:20-alpine → npm ci → esbuild → drawing-bundle.js
Stage 2 (runtime):  python:3.11-slim → pip install → COPY app + COPY --from=builder bundle
Expose: 8000
CMD:    uvicorn tickframe.backend.main:app --host 0.0.0.0 --port 8000
```

### 13.2 Docker Compose

```yaml
tickframe:   8080:8000, --reload, volume mounts for frontend/backend
ml-service:  8001:8001, always restart, persistent logs volume
```

---

## 14. Testing

| Suite | File | Tests | What |
|-------|------|-------|------|
| Unit | `test_cache.py` | 2 | Empty list, stale refresh |
| Unit | `test_bybit_client.py` | 2 | Success + Binance fallback |
| Unit | `test_schemas.py` | 5 | Valid/invalid candles, responses |
| Unit | `test_detection.py` | 3 | Empty, <50, ≥50 candles |
| Integration | `test_api_endpoints.py` | 3 | Health, coins, unknown candles |
| QRT | `test_performance.py` | 1 | Health < 2s |
| QRT | `test_accuracy.py` | 1 | OHLCV match |
| QRT | `test_security.py` | 1 | No key leakage |

**CI Pipeline** (GitHub Actions): `ruff check` → `mypy tickframe/` → `pytest --cov` → `bandit -r tickframe/ -ll`

---

## 15. Configuration

| Env Variable | Default | Used In |
|-------------|---------|---------|
| `ML_API_URL` | `http://ml-service:8001/predict` | ml_client.py |
| `ML_CONFIDENCE_THRESHOLD` | `0.80` | ml_client.py |
| `ML_REQUEST_TIMEOUT` | `30.0` | ml_client.py |

---

## 16. Theme System

CSS custom properties on `:root` (dark) / `body.light` (light): `--bg`, `--panel`, `--muted`, `--accent`, `--danger`. Drawing toolbar adds its own CSS vars in `drawing-toolbar.css`:

| Variable | Dark | Light |
|----------|------|-------|
| `--toolbar-bg` | `rgba(28,28,32,0.78)` | `rgba(240,240,245,0.85)` |
| `--toolbar-border` | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.08)` |
| `--toolbar-hover` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.06)` |
| `--toolbar-accent` | `#26a69a` | `#26a69a` |
| `--toolbar-icon` | `currentColor` | `currentColor` |

- Frontend: `TFChart.applyChartTheme(dark)` changes chart colors
- TradingView: `chart.changeTheme('Dark'|'Light')`
- Fear & Greed gauge: reads `body.classList.contains('light')` for SVG colors
- Toolbar: CSS var overrides via `body.light` selector (no JS re-render needed)
- Persistence: `POST /api/settings {theme: 'dark'|'light'}` → SQLite `settings` table
