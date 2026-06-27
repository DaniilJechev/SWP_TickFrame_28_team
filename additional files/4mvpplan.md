# TickFrame v1.2.0 — Development Plan for AI

> Links: [4reqsmvp.md](4reqsmvp.md) | [Assignment_04.md](Assignment_04.md)
>
> Based on requirements from Assignment 4 (parts 4, 5, 7, 9) and the 4reqsmvp.md scope selection.

---

## 1. Current State of the Project (Branch: `1.2.0`)

The branch contains TickFrame MVP v1.0.0 with:
- **FastAPI backend** (REST + WebSocket, async Bybit client with Binance fallback, in-memory cache)
- **Frontend** using TradingView Lightweight Charts (free library, limited to ~1000 candles)
- **Mock ML detection** (`tickframe/detection/mock.py`) — random pattern output
- **CLI** (scan, report, analyze, serve)
- **Docker** (single service on port 8000)
- **Assignment 4 templates** (docs, CI, tests, reports/week4 — all unfilled placeholders)
- **Only BTCUSDT supported** (DEFAULT_COIN_METADATA has 1 coin, INTERVAL_MAP only has `"5m"`)
- **One timeframe button** in UI (5m)

The **real ML API microservice** already exists on `origin/main` (PR #55 — `ml_service/` with XGBoost FastAPI, Dockerfile, docker-compose extension). It was merged into `origin/main` but is not in the current `1.2.0` branch.

---

## 2. Key Changes — PBIs to Develop

### PBI-101: Merge ML API Service from origin/main
- **Type**: Infrastructure
- **SP**: 3
- **Action**: Cherry-pick or merge commits from `origin/54-feat/ml-rest-api` into `1.2.0`:
  - `c388a47` — full ml_service implementation
  - `5c9fb84`, `022559a` — .gitignore fixes
  - Update `docker-compose.yml` to include `ml-service` container (port 8001)
- **Files affected**: `docker-compose.yml`, new `ml_service/` directory
- **AC**: `docker compose up --build` starts both `tickframe` and `ml-service` containers; `curl localhost:8001/health` returns 200

### PBI-102: Real ML Client Service (tickframe → ml-service)
- **Type**: Feature
- **SP**: 8
- **Action**: Create `tickframe/backend/services/ml_client.py`
  - Async HTTP client calling `http://ml-service:8001/predict` (configurable via env var `ML_API_URL`)
  - Method `analyze_candles(symbol, timeframe, candles)` → sends OHLCV array
  - Implements the **50-candle warmup rule**: to analyze N candles, sends N+50
  - Handles connection errors, timeouts, retries
  - Returns parsed `PredictResponse` (patterns_found with timestamp, pattern_type, confidence)
  - Configurable confidence threshold (default 0.80). Environment variable: `ML_CONFIDENCE_THRESHOLD=0.80`
- **Files affected**: `tickframe/backend/services/ml_client.py` (new), `requirements.txt` (add httpx — already present)
- **AC**: Integration test with mock ml-service returns parsed patterns

### PBI-103: Pattern Analysis API Endpoint
- **Type**: Feature
- **SP**: 5
- **Action**: Add endpoint `POST /api/analyze/{symbol}` in `tickframe/backend/api/endpoints.py`
  - Accepts query params: `interval` (default `5m`), `limit` (default 200, max 14000)
  - Fetches candles from cache, pads with +50 warmup candles from cache
  - Calls `ml_client.analyze_candles()`
  - Returns `{ "symbol", "interval", "limit", "patterns": [...] }`
  - Filters patterns by `confidence >= ML_CONFIDENCE_THRESHOLD`
- **Files affected**: `tickframe/backend/api/endpoints.py`, `tickframe/backend/models/schemas.py`
- **AC**: `POST /api/analyze/BTCUSDT?limit=1000` returns patterns with correct timestamps

### PBI-104: Replace Lightweight Charts with TradingView Advanced Charts
- **Type**: Feature
- **SP**: 13
- **Action**: Complete rewrite of `tickframe/frontend/js/charts.js`
  - Swap CDN from `lightweight-charts` to `charting_library` (TradingView Charting Library)
  - Support **up to 14000 candles** (set `trading_instrument_max_resolution_candles`)
  - Keep existing dark/light theme toggle
  - Keep sidebar coin switching
- **Files affected**: `tickframe/frontend/index.html`, `tickframe/frontend/js/charts.js`, `tickframe/frontend/css/styles.css`
- **AC**: Chart renders with up to 14000 candles; theme toggle works; timeframe buttons work

### PBI-105: Pattern Visualization on Chart
- **Type**: Feature
- **SP**: 8
- **Action**: After ML analysis, render detected patterns on the chart:
  - **Two vertical red lines** (1px solid `#ff0000`, z-index above candles) at segment edges
  - **Pattern name + confidence score** as text annotation below the 25th candle of the segment (centered, red `#ff0000` color)
  - Only for patterns with `confidence >= threshold` (configurable)
  - Multiple patterns per view — each pattern has its own segment rectangle and label
- **Implementation approach**: Use TradingView Charting Library's `createShape` or `createMultipointShape` API for vertical lines, and `createTextBox` or custom HTML overlay for labels
- **Files affected**: `tickframe/frontend/js/charts.js`
- **AC**: After clicking "Analyze Patterns", red vertical lines and labels appear

### PBI-106: Real Analysis Button (connect to ML API)
- **Type**: Feature
- **SP**: 5
- **Action**: Wire the "ANALYZE PATTERNS" button in the frontend:
  - On click → `POST /api/analyze/{symbol}?interval={interval}&limit={visibleCandleCount}`
  - Show loading state
  - Call PBI-105's render function with returned patterns
  - Handle errors gracefully (show message if ML service unavailable)
- **Files affected**: `tickframe/frontend/js/app.js`, `tickframe/frontend/index.html`, `tickframe/frontend/js/charts.js`
- **AC**: Clicking "ANALYZE PATTERNS" shows patterns or "ML service unavailable" message

### PBI-107: Multi-Coin Support (US-06)
- **Type**: Feature
- **SP**: 5
- **Action**: Expand `DEFAULT_COIN_METADATA` to 10+ trading pairs
  - Add pairs: ETHUSDT, SOLUSDT, XRPUSDT, DOGEUSDT, ADAUSDT, AVAXUSDT, DOTUSDT, LINKUSDT, MATICUSDT, BNBUSDT
  - Update `COINS` in `sidebar.js` to match
  - Expand `INTERVAL_MAP` to support `15m`, `1h`, `4h`, `1d` (add interval mappings)
  - Add timeframe buttons in `index.html` for each
- **Files affected**: `tickframe/backend/services/bybit_client.py`, `tickframe/frontend/js/sidebar.js`, `tickframe/frontend/index.html`, `tickframe/frontend/js/app.js`
- **AC**: Sidebar shows 10+ coins; each coin loads chart data; 15m, 1h, 4h, 1d intervals work

### PBI-108: Fill All Documentation Templates
- **Type**: Documentation
- **SP**: 3
- **Action**: Fill in the Assignment 4 template docs with real content:
  - `docs/quality-requirements.md` — replace template with real QR-001/002/003
  - `docs/quality-requirement-tests.md` — implement QRT-001/002/003 in `tests/requirements/`
  - `docs/testing.md` — add real test status, coverage numbers, CI links
  - `docs/definition-of-done.md` — update with A4 requirements
  - `docs/roadmap.md` — add Sprint 3/4 sections
  - `docs/user-acceptance-tests.md` — set up 3+ UAT scenarios
- **Files affected**: all `docs/*.md`, `tests/requirements/test_*.py`
- **AC**: Every doc has real (non-template) content; tests exist in `tests/requirements/`

---

## 3. Current Bugs, Errors, and Mismatches

### Bug-001: WebSocket module loaded as script, not as module
- **File**: `tickframe/frontend/index.html:50-53`
- **Problem**: `websocket.js` uses `export class` (ES module syntax) but is loaded via `<script src="...">` without `type="module"`, causing a syntax error on load
- **Fix**: Either remove exports from `websocket.js` (make it a regular script like others) or add `type="module"` and update all other script imports
- **Impact**: WebSocket class is broken; `websocket.js` JS errors in console

### Bug-002: websocket.js exports not used anywhere
- **File**: `tickframe/frontend/js/websocket.js:91-102`
- **Problem**: `MarketSocket` and `CandleSocket` are exported classes but never imported anywhere in the frontend. The actual WebSocket logic is in `charts.js` using raw `WebSocket` directly.
- **Fix**: Either integrate the ManagedSocket/classes into charts.js, or remove the file
- **Impact**: Dead code, confusion about which WebSocket implementation is active

### Bug-004: Only BTCUSDT in coin metadata
- **File**: `tickframe/backend/services/bybit_client.py:20-21`
- **Problem**: `DEFAULT_COIN_METADATA` only has BTC. Sidebar only shows Bitcoin.
- **Fix**: Add 9+ more coins with their metadata
- **Impact**: Multi-coin feature (US-06) is not operational

### Bug-005: Chart candle limit is 1000, not 14000
- **File**: `tickframe/backend/api/endpoints.py:40`
- **Problem**: `limit: int = Query(default=200, ge=10, le=1000)` — max 1000
- **Fix**: Change to `le=14000` (and ensure backend can handle it)
- **Impact**: Can't load 14000 candles for TradingView Advanced Charts

### Bug-006: Mock detection returns random results
- **File**: `tickframe/detection/mock.py`
- **Problem**: Not a bug per se, but the mock will be replaced by real ML. However, the mock should still exist as fallback when ML API is unreachable.
- **Fix**: Keep mock.py but create a `detection/__init__.py` that dispatches to real ML or mock based on config/env
- **Impact**: Without real ML connection, patterns are random

### Bug-007: analysis-line markers are CSS-based and imprecise
- **File**: `tickframe/frontend/js/charts.js:38-47`, `tickframe/frontend/css/styles.css:84-86`
- **Problem**: Analysis window markers use absolute-positioned divs that may misalign during resize, scroll, or zoom. Will be replaced by TradingView Charting Library shapes.
- **Fix**: Part of PBI-105 — replace with Charting Library API shapes

### Bug-008: Pattern analysis panel has hardcoded text
- **File**: `tickframe/frontend/index.html:38-44`
- **Problem**: "RESULT: Pattern detection coming soon..." and "ML model is in development." are hardcoded placeholders
- **Fix**: Update with real analysis result rendering (PBI-106)

### Bug-009: QRT test files are empty
- **File**: `tests/requirements/__init__.py` (only file in directory)
- **Problem**: QRT-001/002/003 tests from docs/quality-requirement-tests.md don't exist as real files
- **Fix**: Create `tests/requirements/test_performance.py`, `test_security.py`, `test_accuracy.py`

---

## 4. Plan for Each New Feature and Bug Fix

### Phase 1: Infrastructure & Merge
```
Step 1.1: Fetch origin/main and cherry-pick ML service commits
  1. git fetch origin
  2. git merge origin/main (resolve conflicts in docker-compose.yml)
  3. Verify ml_service/ directory exists
  4. Update docker-compose.yml to merge both services (tickframe + ml-service)
  5. Commit: "feat: merge ML API microservice from origin/main"

Step 1.2: Verify ML service builds and runs
  1. docker compose up --build -d
  2. curl http://localhost:8001/health → {"status": "success", "model_loaded": true}
  3. Run ml_service/test.py against running service
```

### Phase 2: Backend ML Client & API (PBI-102, PBI-103)
```
Step 2.1: Create ml_client.py
  1. Async HTTP client class with configurable base URL
  2. Method: analyze_candles(symbol, timeframe, candles, confidence_threshold)
  3. Implements 50-candle warmup padding
  4. Error handling: connection refused → return empty patterns, log warning
  5. Unit tests with mocked HTTP responses

Step 2.2: Add POST /api/analyze/{symbol} endpoint
  1. New route in endpoints.py
  2. Accepts interval + limit query params
  3. Fetches candles from cache (limit+50 for warmup)
  4. Calls ml_client, filters by threshold
  5. Returns JSON with patterns

Step 2.3: Add necessary Pydantic models
  1. AnalyzeRequest, AnalyzeResponse schemas
```

### Phase 3: TradingView Advanced Charts (PBI-104, PBI-105)
```
Step 3.1: Set up Charting Library
  1. Obtain charting_library package (from TradingView website)
  2. Add to tickframe/frontend/lib/ or serve via CDN
  3. Create charting_library.standalone.js or use widget constructor

Step 3.2: Rewrite charts.js
  1. Initialize TradingView widget instead of lightweight-charts
  2. Configure widget with:
     - symbol, interval, container
     - theme: dark/light
     - studies: disabled (for now)
     - time_frames: for predefined ranges
     - datafeed: custom datafeed implementation
  3. Datafeed pulls from /api/coins/{symbol}/candles
  4. Set max candle limit to 14000

Step 3.3: Implement pattern overlay
  1. Use widget.chart().createShape() for vertical red lines
  2. Use widget.chart().createTextBox() for pattern labels
  3. Position labels below 25th candle of each detected segment
  4. Color: #ff0000, font-size: 12px, bold
```

### Phase 4: Frontend Integration (PBI-106, Bug-001, Bug-002, Bug-008)
```
Step 4.1: Wire Analyze button
  1. On click → fetch POST /api/analyze/{symbol}?interval=...&limit=...
  2. Show loading spinner or "Analyzing..."
  3. Parse returned patterns, pass to chart pattern renderer
  4. Show "No patterns found" or "ML service unavailable"

Step 4.2: Fix websocket.js module issue
  1. Option A: Convert websocket.js to regular script (remove exports)
  2. Option B: Add type="module" to script tag
  3. Chosen approach: Remove ES module exports, make it a regular IIFE-based script
  4. Connect MarketSocket / CandleSocket to charts.js

Step 4.3: Update pattern analysis panel
  1. Replace hardcoded text with dynamic rendering
  2. Show last analysis time
```

### Phase 5: Multi-Coin & Intervals (PBI-107, Bug-003, Bug-004, Bug-005)
```
Step 5.1: Expand coin metadata
  1. Add 10 coins to DEFAULT_COIN_METADATA with icons, colors
  2. Add matching entries to COINS in sidebar.js
  3. Add color and icon for each coin

Step 5.2: Expand interval support
  1. Update INTERVAL_MAP with all needed intervals
  2. Update Bybit API interval parameter mapping
  3. Add Binance interval mapping for each
  4. Add timeframe buttons in index.html
  5. Add interval validation in endpoints.py

Step 5.3: Increase max candle limit
  1. Change endpoints.py limit from 1000 to 14000
  2. Ensure cache can handle 14000 candles (memory usage)
  3. Ensure WebSocket stream works with larger datasets
```

### Phase 6: Documentation & Testing (PBI-108, Bug-009)
```
Step 6.1: Implement QRT tests
  1. tests/requirements/test_performance.py — chart response time < 2s
  2. tests/requirements/test_security.py — no API key leakage
  3. tests/requirements/test_accuracy.py — candle data within 0.1%

Step 6.2: Fill documentation templates
  1. docs/quality-requirements.md — QR-001 performance, QR-002 security, QR-003 accuracy
  2. docs/quality-requirement-tests.md — link to real test files
  3. docs/testing.md — real coverage data, CI status
  4. docs/definition-of-done.md — A4 requirements
  5. docs/roadmap.md — Sprint 3 (current), Sprint 4 (next)
```

---

## 5. Prompts for AI: Human Approval Before GitHub Actions

Before creating any GitHub objects (issues, milestones, branches, PRs, releases), the AI must ask the user for approval.

### Prompt 1: Create Sprint Milestone
```
I need to create the Sprint 3 milestone on GitHub.

Details:
- Title: "Sprint 3 — Assignment 4 — v1.2.0"
- Start: YYYY-MM-DD
- End: YYYY-MM-DD
- Goal: "Deliver v1.2.0 with TradingView Advanced Charts, real ML pattern detection, multi-coin support, and automated quality gates"

Please confirm the sprint dates and goal, or tell me if I should just output the details for you to create manually.
```

### Prompt 2: Create GitHub Issues for PBIs
```
I need to create the following GitHub issues for the v1.2.0 Sprint:

[list of PBIs with titles, descriptions, acceptance criteria, SP, assignee, reviewer]

I can use `gh issue create` if `gh` CLI is available. Otherwise I'll output the issue details for manual creation.

Do you want me to proceed with `gh` or output text?
```

### Prompt 3: Create PRs
```
The implementation for PBI-XXX is complete on branch `feature/pbi-xxx-short-name`.

I need to:
1. Push the branch to origin
2. Create a PR using `gh pr create`
3. Link it to the issue (#XXX)

Do you approve creating this PR? (Approve / Output details)
```

### Prompt 4: Create SemVer Release
```
All PBIs for Sprint 3 are merged to main. CI is passing. CHANGELOG is updated.

I need to create a SemVer release:
- Tag: v1.2.0
- Title: "v1.2.0 — TradingView Advanced Charts + Real ML Detection"
- Milestone: Sprint 3

Do you approve? (Approve / I'll do it manually)
```

### Prompt 5: Merge origin/main ML API
```
The ML API service (PR #55 from 54-feat/ml-rest-api) exists on origin/main but not on the current branch. I need to merge it in to get the `ml_service/` directory.

This will add:
- ml_service/ directory with XGBoost FastAPI service
- Updated docker-compose.yml (two services)

Do you approve merging the latest origin/main into 1.2.0?
```

---

## 6. Plan for Revamping Charts: Lightweight Charts → TradingView Advanced Charts

### Current Architecture (Lightweight Charts)
```
index.html → CDN lightweight-charts.standalone.development.js
charts.js → LightweightCharts.createChart(), addCandlestickSeries()
          → CSS-based analysis window markers (div overlay)
          → Manual WebSocket for real-time updates
          → Max ~1000 candles, limited API
```

### Target Architecture (TradingView Charting Library)
```
index.html → charting_library widget constructor
           → Custom datafeed that talks to /api/coins/{symbol}/candles
charts.js → new TradingView.widget({...})
          → Pattern shapes via widget.chart().createShape()
          → Text labels via createTextBox()
          → Up to 14000 candles via widget config
          → Built-in drawing tools, timeframes, indicators
```

### Step-by-Step Migration Plan

**Step 1**: Obtain charting_library package
- The Charting Library requires a free license from TradingView
- Download from: https://www.tradingview.com/HTML5-stock-forex-bitcoin-charting-library/
- Place in `tickframe/frontend/lib/charting_library/`

**Step 2**: Create custom datafeed
- File: `tickframe/frontend/js/datafeed.js`
- Implements `IDatafeedChartApi` interface
- `getBars()` → fetches from `/api/coins/{symbol}/candles?interval=...&limit=14000`
- `subscribeBars()` → uses WebSocket for real-time updates
- `getServerTime()` → returns server time from `/api/health`

**Step 3**: Create widget configuration
- `symbol`: current coin
- `interval`: "5m" (or selected)
- `container`: `#chart`
- `datafeed`: custom datafeed instance
- `theme`: "dark" or "light"
- `time_frames`: predefined ranges
- `trading_instrument_max_resolution_candles`: 14000
- `studies`: empty (disabled for now)
- `custom_css_url`: `/css/tradingview-custom.css`

**Step 4**: Remove CSS-based markers
- Delete analysis-line CSS classes
- Delete analysisWindow DOM elements
- Replace with `widget.chart().createShape()` for vertical lines
- Replace with `widget.chart().createTextBox()` for labels

**Step 5**: Theme toggle
- `widget.changeTheme(dark ? 'dark' : 'light')` for instant theme switch

**Step 6**: Update resize handler
- `widget.resize(width, height)` instead of chart.resize()

### Candle Limit Configuration
```javascript
// In widget constructor options
time_frames: [
  { text: "1y", resolution: "1d", description: "1 Year" },
  { text: "6m", resolution: "4h", description: "6 Months" },
  { text: "3m", resolution: "1h", description: "3 Months" },
  { text: "1m", resolution: "15m", description: "1 Month" },
  { text: "7d", resolution: "5m", description: "7 Days" },
  { text: "3d", resolution: "5m", description: "3 Days" },
  { text: "1d", resolution: "5m", description: "1 Day" },
],
trading_instrument_max_resolution_candles: 14000,  // ← this controls max candle count
```

---

## 7. Plan for ML API Integration

### ML API Architecture
```
┌─────────────┐    HTTP POST /predict     ┌──────────────────┐
│  TickFrame   │  ───────────────────────  │  ML Service      │
│  (port 8000) │  ◀───────────────────────  │  (port 8001)     │
│              │     JSON response          │                  │
│  ml_client   │                            │  XGBoost model   │
│  .py         │                            │  (H&S detection) │
└─────────────┘                            └──────────────────┘
```

### Communication Contract
```
REQUEST → POST http://ml-service:8001/predict
{
  "timeframe": "5m",
  "symbol": "BTCUSDT",
  "candles": [
    {"timestamp": 1689000000, "open": 30000, "high": 30100, "low": 29900, "close": 30050, "volume": 100.5},
    ...
  ]
}

RESPONSE ← 200 OK
{
  "symbol": "BTCUSDT",
  "timeframe": "5m",
  "patterns_found": [
    {"timestamp": 1689005000, "pattern_type": "Classic H&S", "confidence": 0.87},
    ...
  ],
  "processed_candles": 950
}
```

### 50-Candle Rule Implementation (in ml_client.py)
```python
async def analyze_candles(self, symbol: str, timeframe: str, candles: list, threshold: float = 0.80):
    """
    Sends candles to ML API.
    The ML model needs 50 warmup candles for context.
    First 50 candles in the request are used for warmup and cut from results.
    
    If user wants to analyze N target candles, we need to send N+50 candles.
    The ML API will return patterns for N candles (after cutting 50 warmup).
    """
    if len(candles) < 50:
        return []  # Not enough data
    
    # We need to send ALL candles. The ML API handles the 50-candle warmup internally.
    payload = {
        "timeframe": timeframe,
        "symbol": symbol,
        "candles": candles  # includes 50 warmup + target candles
    }
    
    response = await self._client.post(self.predict_url, json=payload)
    data = response.json()
    
    # Filter by confidence threshold
    patterns = [
        p for p in data.get("patterns_found", [])
        if p["confidence"] >= threshold
    ]
    return patterns
```

### Visual Rendering on Chart
For each pattern in `patterns_found[]`, render:

1. **Two vertical red lines** (1px solid #ff0000):
   - Line 1: at segment start (pattern timestamp - ~24 candles worth of time, marking 50-candle window start)
   - Line 2: at segment end (pattern timestamp + ~25 candles worth of time)

2. **Pattern label** below the 25th candle of the segment:
   - Text: `"{pattern_type} {confidence:.0%}"`
   - Color: `#ff0000`
   - Position: anchored below the chart at the 25th candle's time coordinate
   - Font: 12px bold monospace

3. **Multiple patterns**: Each pattern in a 50-candle window. Overlapping windows are fine — each gets its own lines + label.

### Confidence Threshold Configuration
```python
# In settings/environment
ML_CONFIDENCE_THRESHOLD = 0.80  # default, configurable

# In frontend
The threshold should also be adjustable via a settings input (future PBI).
Hardcoded to 0.80 for v1.2.0, but using env var on backend.
```

### Error Handling Strategy
| Scenario | Behavior |
|----------|----------|
| ML service unreachable | Fall back to mock detection, show "ML unavailable" warning |
| ML returns 400 (bad request) | Log error, return empty patterns, show "Analysis failed" |
| ML returns 500 (server error) | Retry once after 1s, then fail gracefully |
| Timeout (>10s) | Cancel, return empty, show "Analysis timed out" |
| Empty response | Show "No patterns detected" |
| Patterns with low confidence | Filter by threshold, show remaining or "No patterns above threshold" |

---

## 8. Dependency Tree

```
PBI-101 (Merge ML Service)
  └── Prerequisite for: PBI-102 (needs running ml-service)
  
PBI-102 (ML Client Service)
  └── Prerequisite for: PBI-103 (needs ml_client.py)
  └── Prerequisite for: PBI-106 (needs analyze API endpoint)

PBI-103 (Analyze API Endpoint)
  └── Prerequisite for: PBI-106 (needs POST /api/analyze)
  
PBI-104 (TradingView Advanced Charts)
  └── Prerequisite for: PBI-105 (needs chart widget for shapes)
  
PBI-105 (Pattern Visualization)
  └── Prerequisite for: PBI-106 (needs visual rendering)

PBI-106 (Real Analysis Button)
  └── Depends on: PBI-103, PBI-105
  
PBI-107 (Multi-Coin)
  └── Independent (can be done in parallel)

PBI-108 (Documentation)
  └── Independent (can be done in parallel)
```

**Recommended execution order**:
1. PBI-101 (infrastructure)
2. PBI-107 + PBI-108 (parallel, independent)
3. PBI-102 + PBI-104 (parallel — backend & frontend)
4. PBI-103 (depends on PBI-102)
5. PBI-105 (depends on PBI-104)
6. PBI-106 (depends on PBI-103 + PBI-105)

---

## 9. Files to Create

| File | Purpose | PBI |
|------|---------|-----|
| `tickframe/backend/services/ml_client.py` | Async ML API client | PBI-102 |
| `tickframe/frontend/lib/charting_library/` | TradingView Charting Library package | PBI-104 |
| `tickframe/frontend/js/datafeed.js` | Custom datafeed for TV widget | PBI-104 |
| `tests/requirements/test_performance.py` | QRT-001: chart response time | PBI-108 |
| `tests/requirements/test_security.py` | QRT-002: API key leakage | PBI-108 |
| `tests/requirements/test_accuracy.py` | QRT-003: candle accuracy | PBI-108 |

## 10. Files to Modify

| File | Change | PBI |
|------|--------|-----|
| `docker-compose.yml` | Add ml-service container | PBI-101 |
| `.env.example` | Add ML_API_URL, ML_CONFIDENCE_THRESHOLD | PBI-102 |
| `tickframe/backend/api/endpoints.py` | Add POST /api/analyze | PBI-103 |
| `tickframe/backend/models/schemas.py` | Add AnalyzeRequest/Response | PBI-103 |
| `tickframe/backend/services/bybit_client.py` | Expand INTERVAL_MAP, DEFAULT_COIN_METADATA | PBI-107 |
| `tickframe/frontend/index.html` | Replace lightweight-charts CDN, add timeframe buttons | PBI-104, PBI-107 |
| `tickframe/frontend/js/charts.js` | Full rewrite for TV Charting Library | PBI-104, PBI-105 |
| `tickframe/frontend/js/app.js` | Wire analysis button, timeframe switching | PBI-106, PBI-107 |
| `tickframe/frontend/js/sidebar.js` | Add 10+ coins | PBI-107 |
| `tickframe/frontend/js/websocket.js` | Fix ES module exports, integrate with charts | Bug-001, Bug-002 |
| `tickframe/frontend/css/styles.css` | Remove analysis-line CSS, add TV custom styles | PBI-104 |
| `docs/quality-requirements.md` | Fill in real QR content | PBI-108 |
| `docs/quality-requirement-tests.md` | Link to real tests | PBI-108 |
| `docs/testing.md` | Real test status | PBI-108 |
| `docs/definition-of-done.md` | A4 requirements | PBI-108 |
| `docs/roadmap.md` | Sprint 3 + Sprint 4 | PBI-108 |
| `CHANGELOG.md` | Add v1.2.0 unreleased entries | All |

---

## 11. Verification Checklist

After implementation, verify:

- [ ] `docker compose up --build` starts both services (port 8000 + 8001)
- [ ] `curl http://localhost:8001/health` returns 200
- [ ] Dashboard loads at http://localhost:8000 with TradingView Advanced Charts
- [ ] Chart shows up to 14000 candles without crashing
- [ ] Sidebar shows 10+ coins, each clickable
- [ ] Timeframe buttons (5m, 15m, 1h, 4h, 1d) switch chart data
- [ ] "ANALYZE PATTERNS" button calls real ML API
- [ ] Pattern vertical red lines + labels render correctly
- [ ] Confidence threshold filtering works (only ≥80% shown)
- [ ] Theme toggle (dark/light) works with new charting library
- [ ] WebSocket real-time updates work
- [ ] `pytest` passes with ≥30% coverage on critical modules
- [ ] `bandit -r tickframe/ -ll` passes
- [ ] All docs filled in with real content
- [ ] CHANGELOG.md has v1.2.0 unreleased entries
