# Customer Review Notes — Sprint 3 (Assignment 4)

> **Note:** The customer consented to recording and publication. A sanitized transcript is available in
> [`customer-review-transcript.md`](./customer-review-transcript.md). These notes are a condensed
> reference; the transcript contains the full chronological record.

---

**Date:** 2026-06-26
**Meeting type:** Sprint Review / UAT (Combined)
**Participants:** Customer / Product Owner, Frontend Developer, ML Engineer, Stakeholder, Team Member (4 team members, 2 customer-side participants)

---

## Notes

### Sprint Goal Reviewed

Drawing toolbar with 13 tools, 50k candle support, SQLite persistence, WebSocket heartbeat, pattern analysis UI, coin sidebar enhancements, redact/undo system, and quality-gated CI pipeline. ([Sprint 3 Milestone](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/3))

### Delivered Increment

- **Drawing toolbar:** 13 canvas overlay tools (Trend Line, H-Line, V-Line, Ray, Cross Line, Fibonacci, Price Range %, Rectangle, Circle, Arrow, Text, Brush, Redact) with per-drawing settings (color, width, line style, font size) and undo/redo stack
- **SQLite persistence:** Drawings, settings, and candle data survive container restart
- **Theme persistence:** Light/dark theme saved and restored; drawing colors adapt to active theme
- **Pattern analysis UI:** Sliding window (50 candles, step 10), red dashed vertical lines + labels (pattern type, confidence %), confidence threshold slider in settings
- **Real-time data:** Live Bybit data on 10 assets (5m timeframe), backend push to frontend
- **ML microservice:** Head and Shoulders / Inverse Head and Shoulders detection, 15k candles/sec throughput
- **CI pipeline:** lint (ruff), type-check (mypy), test (pytest + coverage), QA (bandit)
- **Quality requirements:** QR-001 (Performance), QR-002 (Security), QR-003 (Accuracy) with automated QRT suites

### Customer Feedback Addressed

| Previous Feedback (Week 3) | How Addressed |
|---|---|
| Drawing tools on chart | Delivered — 13 tools on canvas overlay ([#62](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/62), [#64](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/64)) |
| Light/dark themes | Delivered with SQLite persistence ([#71](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/71)) |
| Pattern visualization approach | Sliding window + boundary lines + labels ([#70](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/70)) |
| TradingView research | Completed — lightweight-charts v4 chosen; TradingView license incompatible |
| GitHub Projects tracking | Active Sprint 3 board |

### UAT Results

| Scenario | Result |
|---|---|
| UAT-001: Scan and view chart patterns | ⏳ Partial — markers/labels shown; ML model as separate microservice |
| UAT-002: Toggle chart timeframes | ❌ Not tested — only 5m available |
| UAT-003: Export scan results | ⏳ Not demonstrated |
| UAT-004: Real-time sidebar | ✅ Pass — 10 pairs, live updates |
| UAT-005: Theme toggle | ✅ Pass — persisted across reload |

### Quality Evidence

- Performance: two-phase candle load (2000 instant + background), p95 < 500 ms, rate limiting active
- Security: bandit passes with zero high-severity; no secrets in repo; `.env.example` provided
- Accuracy: ML model 6–7× recall vs rule-based; precision 19–25% (limited by 800-pattern training set); 99.75% noise filtered

### Customer Feedback

**Positive:**
- Drawing toolbar quality and customization well received
- Theme and drawing persistence appreciated
- Confidence threshold slider confirmed useful
- Overall sprint direction satisfactory

**Critical:**
- REST polling for candles should be WebSocket subscription ("you receive data instantly — pushed to your channel")
- No database caching — candles re-fetched from Bybit on every visit ("That definitely needs to be changed")
- 150k candle analysis range excessive (~1.5 years) — reduce to 50k
- Metrics (RSI, Volume, High/Low) missing — prioritize next sprint
- Candle colour customization not yet available

### Questions and Decisions

1. **Why not WebSockets?** Developer used REST for simplicity. Customer explained WebSocket advantages (instant push, no polling). Decision: migrate to WebSocket subscription model.
2. **Why no database?** Developer planned it for next sprint. Customer flagged as high priority. Decision: implement SQLite candle caching.
3. **150k candles excessive?** Customer calculated ~1.5 year range. Decision: reduce to 50k.
4. **What metrics are needed?** RSI, Volume, High/Low. Decision: add to backlog for Sprint 4.
5. **Anomaly detection?** ML engineer: unclear definition, main model takes priority. Decision: excluded from scope.
6. **Analyze visible range vs full range?** Visible range too few candles for reliable detection. Decision: analyze last 50k, user scrolls to view found patterns.

### Requested Changes

1. Migrate data pipeline from REST to WebSocket subscription
2. Implement SQLite database caching for candles
3. Add RSI, Volume, and High/Low metrics
4. Reduce pattern analysis range to 50k candles
5. Prioritise these items in backlog

### Remaining Risks

- No database caching — every page load hits Bybit API; risk of rate limits under concurrent users
- ML precision (19–25%) below QR-003 target (F2 ≥ 0.80); training data insufficient and labour-intensive to expand
- Only 5m timeframe supported — 15m, 1h, 4h, 1d unavailable
- No frontend JavaScript tests
- Anomaly detection explicitly excluded from scope

### Product Backlog Updates

- **New:** WebSocket subscription for real-time candle/ticker data (high priority)
- **New:** SQLite-based candle caching with background refresh (high priority)
- **New:** RSI indicator sub-chart (US-11) — promoted to planned
- **New:** Volume sub-chart (US-10) — promoted to planned
- **New:** Price metrics (High/Low) display
- **Removed:** Anomaly detection — excluded from product scope
