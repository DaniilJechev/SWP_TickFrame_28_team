# Customer Review Summary — Sprint 3 (Assignment 4)

---

**Date:** 2026-06-26
**Participants / Roles:** Customer / Product Owner, Frontend Developer, ML Engineer, Stakeholder, Team Member
**Meeting type:** Sprint Review / UAT (Combined)

---

## Sprint Goal Reviewed

Drawing toolbar with 13 tools, 50k candle support, SQLite persistence, WebSocket heartbeat, pattern analysis UI, coin sidebar enhancements, redact/undo system, and quality-gated CI pipeline. ([Sprint 3 Milestone](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/3))

## Delivered Increment Discussed

- **Drawing toolbar:** 13 tools (Trend Line, H-Line, V-Line, Ray, Cross Line, Fibonacci, Price Range %, Rectangle, Circle, Arrow, Text, Brush, Redact) with per-drawing settings (color, width, line style, font size)
- **SQLite persistence:** Drawings and settings survive container restart
- **Theme persistence:** Light/dark theme saved to SQLite, restored on reload, drawing colors adapt
- **Pattern Analysis UI:** Sliding window with red dashed vertical lines + labels showing pattern type and confidence score; confidence threshold slider in settings
- **Real-time data:** Live Bybit data on 10 assets (5m timeframe)
- **ML detection microservice:** Head and Shoulders / Inverse Head and Shoulders detection, 15k candles/sec throughput
- **CI pipeline:** lint (ruff), type-check (mypy), test (pytest + coverage), QA (bandit)
- **Quality requirements:** QR-001 (Performance), QR-002 (Security), QR-003 (Accuracy) with automated QRT suites

## Addressed Customer Feedback

| Previous Feedback (Week 3) | How Addressed |
|---|---|
| Include drawing tools on chart | Fully delivered — 13 drawing tools on canvas overlay ([#62](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/62), [#64](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/64)) |
| Support light/dark themes | Delivered with SQLite persistence ([#71](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/71)) |
| Define pattern visualization approach | Sliding window + vertical boundary lines + labels implemented ([#70](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/70)) |
| Research TradingView capabilities | Completed — lightweight-charts v4 chosen due to TradingView license restrictions |
| Use GitHub Projects for task tracking | Active Sprint 3 board with To Do / In Progress / Review / Done columns |

## UAT Results

| Scenario | Result |
|---|---|
| UAT-001: Scan and view chart patterns | ⏳ Partial — UI displays markers and labels, but ML model integrated as separate microservice; end-to-end demo showed candidate visualization |
| UAT-002: Toggle between chart timeframes | ❌ Not tested — only 5m timeframe available in this sprint |
| UAT-003: Export scan results | ⏳ Not demonstrated |
| UAT-004: Real-time sidebar | ✅ Pass — 10 trading pairs with live prices updating via backend push |
| UAT-005: Theme toggle | ✅ Pass — dark/light themes toggle correctly; settings persisted across reload |

## Quality Evidence Discussed

- **QR-001 (Performance):** Two-phase candle load (2000 instant + background) keeps p95 under 500 ms. Token-bucket rate limiting prevents 429 errors.
- **QR-002 (Security):** Bandit scan passes with zero high-severity findings. `.env.example` template prevents secret commits. No credentials in repository.
- **QR-003 (Accuracy):** ML model achieves 6–7× recall improvement over rule-based baseline. Precision at 19–25% due to small training set (800 labelled patterns). Noise filtered: 99.75%.

Customer did not request formal QRT demonstration but reviewed the ML accuracy trade-offs in detail.

## Customer Feedback

**Positive:**
- Drawing toolbar quality and customization options were well received
- Theme persistence and drawing persistence across reloads was appreciated
- Confidence threshold slider was considered useful
- Overall sprint direction confirmed as satisfactory

**Critical:**
- REST polling for candle data should be replaced with WebSocket subscriptions ("you receive data instantly — it is pushed to your channel")
- No database caching — candles re-fetched from Bybit on every page visit ("that definitely needs to be changed")
- Pattern analysis range of 150k candles is excessive (~1.5 years); should be 50k
- Metrics (RSI, Volume, High/Low) are missing and should be prioritized in the next sprint
- Candle colour customization not yet available (deferred from sprint scope)

## Approvals and Requested Changes

- Sprint increment direction was approved ("Overall, it satisfies me")
- Customer requested the following changes be prioritized:
  1. Migrate from REST polling to WebSocket subscription for real-time data
  2. Implement database caching for candle persistence
  3. Add RSI, Volume, and High/Low metrics
  4. Reduce pattern analysis range from 150k to 50k candles
  5. Prioritise these items in the backlog

## Quality Gates and CI Continuity

The following CI checks and quality gates were discussed as ongoing requirements for future sprints:

| Check | Tool | Target | Maintain? |
|---|---|---|---|
| Linting | `ruff check .` | Zero errors | Yes — required per DoD |
| Type checking | `mypy tickframe/` | Zero errors | Yes — catches interface mismatches |
| Unit/integration tests | `pytest tests/unit/ tests/integration/` | All pass | Yes |
| Quality requirement tests | `pytest tests/requirements/` | All pass | Yes — expanded with new QRs |
| Security scan | `bandit -r tickframe/ -ll` | Zero high-severity | Yes |
| Coverage | `pytest --cov=tickframe` | ≥30% critical modules | Yes — increase target in future sprints |
| CHANGELOG update | Manual | User-visible changes documented | Yes |
| SemVer release | Manual | Tagged release per sprint | Yes |

## Remaining Gaps and Risks

- **No database caching:** Every page load hits Bybit's REST API — adds latency and risks rate limits under concurrent use.
- **ML precision gap:** 19–25% precision is well below QR-003 target (F2 ≥ 0.80). Training data is insufficient (800 patterns). Labelling more data is labour-intensive and may not be feasible within project scope.
- **Single timeframe:** Only 5m supported — customers needing 15m, 1h, 4h, 1d cannot use the current product.
- **Missing metrics:** RSI, Volume, High/Low are defined but unimplemented — core dashboard features remain incomplete.
- **Anomaly detection:** Explicitly excluded from scope — no dedicated replacement planned.
- **Frontend test coverage:** No JavaScript tests exist; drawing toolbar, chart rendering, and WebSocket client are untested on the frontend.

## Action Points

| Action | Owner | Due |
|---|---|---|
| Migrate candle data pipeline from REST polling to WebSocket subscription | Frontend Developer | Sprint 4 |
| Implement SQLite database caching for persistent candle storage | Frontend Developer | Sprint 4 |
| Add RSI, Volume, and High/Low metrics to dashboard | Frontend Developer | Sprint 4 |
| Reduce pattern analysis range to 50k candles | Frontend Developer | Immediate |
| Expand ML training dataset with additional labelled patterns | ML Engineer | Sprint 4 |
| Integrate pattern analysis UI with ML model (end-to-end) | Frontend Developer + ML Engineer | Sprint 4 |
| Add multi-interval support to chart (15m, 1h, 4h, 1d) | Frontend Developer | Sprint 4 |
| Create backlog items for WebSocket migration, DB caching, and metrics | Team | Immediate |

## Product Backlog Updates

- **New PBI:** WebSocket subscription migration for real-time candle/ticker data
- **New PBI:** SQLite-based candle caching with background refresh
- **New PBI:** RSI indicator sub-chart (US-11) — promoted from deferred to planned
- **New PBI:** Volume sub-chart (US-10) — promoted from deferred to planned
- **New PBI:** Price metrics (High/Low) display
- **Priority change:** Database caching and WebSocket migration marked as high priority
- **Removed:** Anomaly detection — explicitly excluded from product scope
