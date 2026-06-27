# LLM Usage Report

## AI/LLM tools used

### Phase 1 — Repository setup
- GitHub Copilot assistant was used to help structure the repository, generate report templates, and prepare the initial Week 2 deliverables.
- The assistant created or updated files including `LICENSE`, `.gitignore`, `.env.example`, `.github/pull_request_template.md`, `.github/workflows/lychee.yml`, and several `reports/week2/*.md` files.

### Phase 2 — MVP implementation
- The same assistant was used to implement the Bybit API integration, CandleCache with threaded auto-refresh, mock ML pattern detector, HTTP web server, and lightweight-charts frontend.
- Specific files generated or updated by the LLM:
  - `tickframe/exchange/bybit.py` — Bybit v5 kline API client with interval mapping and error handling
  - `tickframe/data/cache.py` — thread-safe CandleCache with initial fetch and 60-second refresh loop
  - `tickframe/detection/mock.py` — randomized pattern detector with 8 pattern types
  - `tickframe/web/server.py` — HTTP API server serving `/api/candles` and `/api/analyze` endpoints
  - `tickframe/web/static/index.html` — interactive candlestick chart using lightweight-charts library with all frontend requirements (1/3 gaps, grid lines, 50-candle markers, auto-refresh)
  - `reports/week2/mvp-v0-report.md` — updated to reflect new implementation
  - `reports/week2/smoke-check-evaluation-guide.md` — created per assignment template
  - `reports/week2/analysis.md` — updated with development decisions
  - `reports/week2/user-stories.md` — updated with implementation status

## Notes
- No production code or confidential data was generated from external sources.
- All API requests go to Bybit's public endpoints; no credentials are required or exposed.
- The LLM output was reviewed and tested before integration (e.g., the SOCKS proxy issue was caught and fixed).
