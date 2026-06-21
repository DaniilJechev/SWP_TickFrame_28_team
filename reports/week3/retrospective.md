# Week 3 Retrospective

## What went well

1. **Successful customer review with actionable outcomes.** The 19 June meeting produced clear, prioritized feedback: Fear & Greed Index, volume chart, RSI, drawing tools, and theme switching were all approved for MVP; authentication was explicitly deferred. The transcript and summary are available in `reports/week3/`. The customer engaged actively, and the team left with a concrete research task (TradingView evaluation) rather than vague direction.

2. **FastAPI + WebSocket backend migration completed within Sprint 2.** The team migrated from a synchronous `http.server` prototype to an async FastAPI application with REST endpoints (`/api/coins`, `/api/coins/{symbol}/candles`) and real-time WebSocket streams (`/ws/market`, `/ws/candles/{symbol}`). The `MemoryMarketCache` with dual-exchange fallback (Bybit → Binance) provides live data with automatic reconnection. This architecture is production-ready enough to carry into Sprint 3 without rewriting.

3. **Theme toggle (US-13) implemented and demonstrated.** Despite being a Could-Have priority, the light/dark theme switch was delivered in Sprint 2. CSS custom properties control the entire UI palette, and the `applyChartTheme` function in `charts.js` synchronizes the lightweight-charts instance. The theme button was shown during the customer review and received positive feedback.

## What did not go well

1. **ML pattern detection (US-01) was not started.** The same mock detector from week 2 remains in place. Every other Sprint 2 task involved infrastructure or UI, leaving the product's core differentiator — machine learning pattern detection — untouched. The "ANALYZE PATTERNS" button and `analyze` CLI command still return randomized placeholder output. This must be the first item in Sprint 3.

2. **Customer review exposed incomplete Figma designs.** The team presented Figma screens expecting approval but received requests for substantial additions: pattern visualization examples, metric placement mockups, multi-pattern states, and a dedicated pattern list. This means Sprint 3 planning cannot start until the designs catch up to the customer's expectations.

3. **Only one trading pair and one timeframe are supported.** Despite US-06 (10 pairs with live prices) and US-07 (timeframe selection) being Must-Have items, BTCUSDT and `5m` remain the only options in production code. The `INTERVAL_MAP`, `DEFAULT_COIN_METADATA`, and frontend `COINS` array are all hard-coded to single entries. Expanding these is purely additive work but was deprioritized behind the backend rewrite.

## Action points

1. **Complete TradingView API research and document the findings by 23 June.** The customer review made this the single highest-priority item. A team member should evaluate TradingView's charting library against our requirements (drawing tools, indicators, customization, pattern overlay) and write a brief recommendation. This decision gates US-08, US-10, US-11, and US-12, and must be settled before Sprint 3 begins.

2. **Integrate a real XGBoost pattern detection model before Sprint 3 demo.** Replace `tickframe/detection/mock.py` with trained model inference. The data pipeline (Bybit → CandleCache → frontend) is complete; only the `analyze` function needs to call a real model. Without this, the product cannot demonstrate its core value — detecting chart patterns — and the Sprint 3 customer review will face the same gap as week 3.
