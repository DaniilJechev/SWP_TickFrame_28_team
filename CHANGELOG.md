# Changelog

All notable user-visible changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [Unreleased]

### Added
- **Drawing toolbar engine**: 13-tool canvas overlay (Trend Line, H-Line, V-Line, Ray, Cross Line, Rectangle, Circle, Arrow, Brush) with SVG icons, coordinate helpers, all renderers, and live preview.
- **Advanced drawing tools**: Fibonacci (decimal labels 0.0–1.0, draggable endpoints), Price Range % (top/bottom edges, arrow, % change label), Text tool (custom modal dialog, Enter/Escape handlers).
- **Redact mode**: Chart freeze (no scroll/zoom), crosshair hide, select/drag/reshape drawings.
- **Undo system**: Full undo stack for add, modify (drag), and delete operations with pre-capture drag points.
- **Per-drawing settings panel**: Color picker (12 colors), width (1–4pt), line style (solid/dashed/dotted), font size (10–32) — all SVG icons, no text labels.
- **SQLite persistence**: Auto-created database (`tickframe/data/tickframe.db`, gitignored) with `settings`, `drawings`, `candles` tables; per-coin drawing isolation.
- **50k candle support**: Maximum per request from 1000 to 50000; two-phase frontend load (2000 instant + 50000 background); default zoom to last 10000.
- **Pagination**: Bybit max 200/request, Binance max 1000/request with deduplication by timestamp.
- **WebSocket heartbeat**: Backend sends `{"type":"heartbeat"}` every 5 seconds; frontend shows `LIVE·timestamp` indicator.
- **Pattern analysis UI**: Sliding window (50 candles, step 10), progress indicator, red dashed vertical lines + text labels, confidence threshold slider (50–99%).
- **Pattern drawing overlay**: `addPatternDrawing()`/`clearPatternDrawings()` API; pattern drawings excluded from auto-save (`_isPattern` flag).
- **Coin sidebar enhancements**: Full ticker badges (BTC, ETH, etc.), 5m trend-colored prices (green/red), `formatPrice()` max 6 digits with trailing zero stripping.
- **Theme persistence**: Theme saved to SQLite, restored on reload; light theme fix (`applyChartTheme(false)` on load).
- **Theme-aware drawing colors**: `selClr()` helper adapts selection highlight to dark/light mode across all 9 renderers.
- **Quality requirement tests**: Automated QRT-001 (performance), QRT-002 (security), QRT-003 (accuracy) in `tests/requirements/`.

### Changed
- **Candle limit increased**: Maximum per request from 1000 to 50000 (all endpoints, datafeed, frontend).
- **Warmup configurable**: Changed from hardcoded 50 to `max(50, min(limit // 4, 500))`.
- **DB transaction**: `_save_candles()` uses explicit `BEGIN`/`COMMIT` for 50k-row performance.
- **Definition of Done**: Updated with CI checks, coverage, QRT requirements.
- **Roadmap**: Updated with Sprint 3 and Sprint 4.

### Fixed
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
