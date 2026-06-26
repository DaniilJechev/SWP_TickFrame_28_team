# Changelog

All notable user-visible changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [Unreleased]

### Added
- **API rate limiting**: Token-bucket `RateLimiter` (10 req/s, burst 5) on all Bybit/Binance candle requests — prevents 429 errors during warmup and zoom-out pagination.
- **DB query optimisation**: `load_last_n_candles()` with exact `ORDER BY time DESC LIMIT N` (sub-millisecond, no cooldown), `load_candles_before()`, `get_candle_range()`; indexed PK queries avoid loading 55k rows.
- **Frontend candle cache**: `_candleCache` map (keyed by `symbol|interval`) returns cached data instantly on coin re-switch, then refreshes in background.
- **Zoom-out lazy loading**: `before` query parameter on `/api/coins/{symbol}/candles`; `loadMoreBefore()` fetches older candles via pagination and appends to chart.
- **Coin switch loading overlay**: Animated spinner overlay (`<div id="chartLoading">`) for both lightweight and advanced (TradingView) modes; auto-hides via `window._hideChartLoading` callback when candles arrive; 5s fallback timeout.
- **`end_ms` pagination parameter**: `fetch_candles(end_ms)` and `_fetch_binance_candles(endTime)` support fetching candles before a timestamp — enables sequential per-coin fill up to 55000.
- **Quality requirement tests**: Automated QRT-001 (performance), QRT-002 (security), QRT-003 (accuracy) in `tests/requirements/`.

### Changed
- **Candle limit increased**: Maximum per request from 1000 to 50000 (all endpoints, datafeed, frontend).
- **Two-phase warmup**: Phase 1 loads DB candles for all 50 (coin×interval) combos in parallel; Phase 2 fills each coin sequentially to 55000 with rate-limited pagination via `end_ms`.
- **Removed exchange freshness check on DB hit**: `load_last_n_candles` now uses the exact `limit` (e.g. 10000) instead of hardcoded `MAX_CANDLES`; WS live updates keep data fresh without burning API calls on coin switch.
- **Warmup configurable**: Changed from hardcoded 50 to `max(50, min(limit // 4, 500))`.
- **DB transaction**: `_save_candles()` uses explicit `BEGIN`/`COMMIT` for 50k-row performance.
- **Definition of Done**: Updated with CI checks, coverage, QRT requirements.
- **Roadmap**: Updated with Sprint 3 and Sprint 4.

### Fixed
- **Coin switch race condition (chart stuck on BTC)**: `window.candleSeries` now used everywhere instead of local `candleSeries` variable — toolbar.js `switchChartType()` reassigns the global when user changes chart type, leaving local references stale.
- **AbortController race prevention**: Each `loadCandles()` call creates a new `AbortController`; stale in-flight fetches are aborted on rapid coin switch; `_currentLoadSymbol` guard discards stale responses after JSON parse.
- **Double-load on startup**: Removed redundant BTC load in app.js; `_initialLoadDone` flag prevents 300ms timeout override if user already clicked a coin.
- **Candle cache stale on zoom-out/WS**: `loadMoreBefore()` and WebSocket handlers update `_candleCache` so re-switch shows fresh data.
- **Drag undo**: Pre-capture `prevPoints` at drag start (not after mutation).
- **Delete undo**: Deleted drawings wrapped in `{action:'add'}` envelope for re-insert on undo.
- **Race condition**: `_loadDrawings()` sequence counter discards stale responses on rapid coin switch.
- **Canvas state leak**: Brush renderer wrapped in `ctx.save()`/`ctx.restore()`.
- **Document listener cleanup**: Global click listeners stored in `_listeners` array, removed on `destroy()`.
- **Per-drawing opts forwarding**: `opacity`, `fill`, `lineStyle`, `fontSize` now set on commit.
- **Empty catch blocks**: Replaced with `console.warn()`.
- **Dead code removed**: Unused `preview` variable, `textModalReject`, stray comment separators.
- **Dead conftest fixtures**: Removed stale fixtures that caused test warnings.
- Blank QRT test templates replaced with real tests.

---

## [1.0.0] (MVP v1) — 2026-06-21

### Added
- **FastAPI REST API**: New endpoints at `/api/health`, `/api/coins`, `/api/coins/{symbol}/price`, and `/api/coins/{symbol}/candles` with configurable candle limits up to 1000. ([#28])
- **WebSocket real-time streams**: Live market snapshot (`/ws/market`) and candle updates (`/ws/candles/{symbol}`) with 5-second polling interval. ([#28])
- **Interactive candlestick chart**: TradingView Lightweight Charts integration with dark/light theme toggle, time scale navigation, and responsive resize. ([#28], [#16])
- **Coin sidebar**: Live price list for all tracked trading pairs with real-time updates via WebSocket. ([#28])
- **Analysis window markers**: Vertical boundary lines on the chart highlighting the last 50 candles for pattern detection context. ([#28])
- **Docker deployment**: One-command startup via `docker compose up --build` with containerized FastAPI + Uvicorn stack. ([#8], [#37], [#39], [#40])
- **Candle data limit increased**: Maximum candles per request raised from 200 to 1000, enabling longer historical chart views. ([commit 165abde](https://github.com/Fedos113/SWP_TickFrame_28_team/commit/165abde29d9a906cee9b1b2f05df85cb84b7fee0))
- **Mock ML pattern detection**: Analyzes last 50 candles and returns pattern type (Bull Flag, Head & Shoulders, etc.) with randomized confidence score. ([#28])
- **Async Bybit v5 client**: Automatic fallback to Binance API when Bybit requests fail, with in-memory cache auto-refreshing every 5 seconds. ([#28])
- **CLI commands**: `scan` (fetch OHLCV data), `report` (generate Markdown reports), `analyze` (cache + pattern detection), and `serve` (legacy dashboard) with async backend support. ([#28])

### Changed
- **Architecture migration**: Backend rewritten from synchronous Python `http.server` (port 5000) to **FastAPI + Uvicorn** async stack (port 8000). Improved performance, scalability, and real-time capabilities. ([#28])
- **README restructured**: Docker-first setup instructions with VM-agnostic IP guidance, separated local development from deployment workflows. ([#40])
- **Data pipeline upgraded**: Legacy threaded Bybit client replaced with async `httpx`-based client; cache refresh interval reduced from 60s to 5s for fresher data. ([#28])
- **Project documentation**: User stories registry (`docs/user-stories.md`), roadmap (`docs/roadmap.md`), and Definition of Done (`docs/definition-of-done.md`) established and linked from README. ([#34], [#38])
- **CLI fallback preserved**: Legacy `--mock` flag retained for demo/offline usage — all CLI commands work with or without real API connectivity. ([#28])

### Fixed
- No fixes in this release (initial MVP v1 cut).

---

[Unreleased]: https://github.com/Fedos113/SWP_TickFrame_28_team/compare/SemVer...HEAD
[1.0.0]: https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/SemVer

[#8]: https://github.com/Fedos113/SWP_TickFrame_28_team/issues/8
[#16]: https://github.com/Fedos113/SWP_TickFrame_28_team/issues/16
[#28]: https://github.com/Fedos113/SWP_TickFrame_28_team/pull/28
[#34]: https://github.com/Fedos113/SWP_TickFrame_28_team/pull/34
[#37]: https://github.com/Fedos113/SWP_TickFrame_28_team/pull/37
[#38]: https://github.com/Fedos113/SWP_TickFrame_28_team/pull/38
[#39]: https://github.com/Fedos113/SWP_TickFrame_28_team/pull/39
[#40]: https://github.com/Fedos113/SWP_TickFrame_28_team/pull/40
