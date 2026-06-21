# Week 3 Reflection

## Learning points

- **FastAPI migration unlocked real-time architecture.** Replacing Python's `http.server` with FastAPI (in `tickframe/backend/main.py`) enabled async request handling, WebSocket support, and structured REST endpoints. The `MemoryMarketCache` with a 5-second refresh loop and `SocketHub` broadcast pattern (`tickframe/backend/api/websocket.py:14`) proved effective for pushing live market snapshots and candle updates to all connected clients simultaneously.

- **Dual-exchange fallback improves reliability.** The `BybitClient` (`tickframe/backend/services/bybit_client.py`) now falls back to Binance's REST API when Bybit's v5 endpoints fail. This was important because Bybit occasionally returns empty `list` fields for certain pairs. Without this fallback, the `/api/coins/{symbol}/candles` endpoint would return 503 errors during upstream outages.

- **Customer reviews surface unstated assumptions.** The 19 June customer review (captured in `customer-review-transcript.md`) revealed that authentication was explicitly unwanted for MVP — contradicting our earlier assumption that login screens would be needed. The customer also prioritized TradingView API evaluation over a custom chart implementation, which changed our technical direction for Sprint 3.

- **CSS custom properties simplify theme switching.** Implementing US-13 (theme toggle, assigned to Sprint 2 milestone) via a `body.light` class and `:root`/`.light` CSS variable overrides (`tickframe/frontend/css/styles.css:1-54`) was simpler and more maintainable than a JS-driven approach. The `applyChartTheme` function in `charts.js` synchronizes the lightweight-charts instance with the same toggle.

- **Figma-first design process requires iteration.** The customer requested additional Figma screens for pattern visualization, metric placement, and multi-pattern states. A single design pass was insufficient — treating Figma as a living spec that evolves with each customer touchpoint would have reduced rework.

## Validated assumptions

- **FastAPI + WebSocket is suitable for MVP live dashboards.** The `/ws/market` and `/ws/candles/{symbol}` WebSocket endpoints maintain persistent connections with auto-reconnect (`tickframe/frontend/js/websocket.js:71-79`), and the 5-second polling interval keeps the frontend updated without overwhelming the Bybit API rate limit. Confirmed — this architecture works for our current single-pair, single-timeframe scope.

- **lightweight-charts can be themed dynamically.** The library's `applyOptions` API accepts runtime layout changes, which allowed us to toggle between dark (`#000000` background) and light (`#f5f7fb` background) themes without re-creating the chart instance. US-13 is technically feasible with this library.

- **Bybit API free tier is sufficient for development.** All endpoints used (`/v5/market/kline`, `/v5/market/tickers`) are public and require no authentication. Rate limits were not hit during development or the customer demo. This validates the week 2 decision to choose Bybit over Binance as the primary exchange.

- **Customer prefers TradingView ecosystem over custom charting.** During the review (transcript lines 40-50), the customer explicitly favored adopting TradingView's API for built-in indicators and drawing tools. The assumption that a custom lightweight-charts implementation would satisfy all requirements was rejected — we must now evaluate TradingView's capabilities.

- **Sprint 1 deliverables are stable.** US-03 (MIT license, public repo), US-04 (`.env.example` template), and US-05 (PR template) completed in Sprint 1 (week 2) required no changes during week 3 — the repository and process foundation is solid.

## Friction and gaps

- **ML pattern detection remains unimplemented.** US-01 (detect chart patterns with ML) and US-02 (scan results in report-friendly format) are still in the unscheduled backlog. The `tickframe/detection/mock.py` placeholder from week 2 was never replaced with a real XGBoost model. This is the highest-priority technical gap — the product cannot deliver its core value proposition without real pattern detection.

- **Figma designs are incomplete for patterns and metrics.** The customer requested additional mockups for: pattern appearance on the chart, metric placement, multi-pattern simultaneous display, and a dedicated pattern list (transcript lines 108-134). Until these designs are completed and approved, development of US-06 through US-12 cannot begin with confidence.

- **Single-pair, single-timeframe limitation.** The current codebase hard-codes only BTCUSDT as the available coin and `5m` as the only interval (`INTERVAL_MAP` in `bybit_client.py:15-17`, `COINS` array in `sidebar.js:1-3`). US-06 (sidebar with 10 trading pairs) and US-07 (timeframe selection) are blocked until the data layer and UI support dynamic pair/interval switching.

- **TradingView API research is unresolved.** The customer review made TradingView evaluation the top priority (transcript line 82), but no research has been completed yet. The decision to adopt, supplement, or replace lightweight-charts depends on this analysis — it blocks US-08 (drawing toolbar), US-10 (volume chart), US-11 (RSI), and US-12 (Fear & Greed Index).

- **Definition of Done checklist items remain unchecked.** The DoD (`docs/definition-of-done.md`) requires testing, review, and CHANGELOG documentation for every PBI. Sprint 2 items (US-15, US-13) have been implemented but not yet formally verified against the DoD checklist.

## Planned response

1. **Research and decide on TradingView API** by 23 June. Assign one team member to evaluate whether TradingView's charting library satisfies our drawing-tool, indicator, and customization requirements (relevant to US-08, US-10, US-11, US-12). Document findings in `docs/tradingview-evaluation.md` and present to the team before Sprint 3 planning.

2. **Complete Figma pattern/metric mockups** by 25 June. Extend the Figma project with screens demonstrating: pattern highlighting on charts, metric placement, multiple simultaneous patterns, and the pattern list panel (as requested in the customer review). Share with the customer for async approval.

3. **Integrate real ML pattern detection for Sprint 3** (US-01, US-02). Replace `tickframe/detection/mock.py` with an XGBoost-based detector. The `analyze` CLI command and "ANALYZE PATTERNS" button in the dashboard already expect a real model — only the inference engine is missing.

4. **Expand data layer to support multiple pairs and intervals** (US-06, US-07). Extend `INTERVAL_MAP` and `DEFAULT_COIN_METADATA` in `bybit_client.py`, and update the frontend `COINS` array and timeframe button set to match the Sprint 3 scope. This unblocks the sidebar and timeframe selector.

5. **Formally verify Sprint 2 items against the DoD.** Add CHANGELOG entries for the FastAPI migration, WebSocket infrastructure, and theme toggle. Ensure each merged PR has a reviewer sign-off and all acceptance criteria are met. Tag a SemVer release for the MVP v1 increment.
