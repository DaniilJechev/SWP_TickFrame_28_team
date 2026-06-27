# Reflection — Assignment 4

> **Template — Assignment 4, Part 13**
>
> Instructions:
> - Reflect on the entire Sprint experience
> - Be honest and specific — generic filler will be flagged
> - Link to affected PBIs, QRs, UATs, CI checks, milestones, releases, and docs where relevant

---

## Learning Points

_What the team learned from:_

### Customer Feedback Response

The customer's insistence on WebSocket-based data delivery (rather than REST polling) reinforced that architectural decisions around data freshness cannot be deferred. The team initially implemented REST-based candle fetching from Bybit — functional but suboptimal for live updates. The customer explicitly questioned why WebSockets were not used ("you receive data instantly, it is pushed to your channel"). This will drive PBI-108 (WebSocket heartbeat already in place) toward a full WebSocket subscription model in Sprint 4, tracked as a new backlog item.

### Quality Requirements Definition

QR-003 (Pattern Detection Accuracy) was stress-tested in this review. Daniel's ML model achieves **6–7× higher recall** than the rule-based baseline (480 real patterns found vs. ~800 rule-based candidates of which only 30% were real), but precision is lower (~19% vs. 30%) due to a tiny training set (400 patterns per class, 7 hours of manual labelling). Defining an F2 ≥ 0.80 target was realistic — the current recall uplift already validates the ML approach. The trade-off between precision and recall is now a documented, measured design decision.

### QRT Automation

Automated QRT suites (performance, security, accuracy) were built and integrated into CI ([#82](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/82), [#83](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/83), [#84](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/84)). The performance QRT was particularly valuable — it confirmed that the two-phase candle load (instant 2000 + background 50000) keeps p95 response within the 500 ms target. The accuracy QRT highlighted that deterministic output (same input → same result) is achievable despite the probabilistic nature of ML inference, because weights and architecture are frozen per release.

### CI Configuration

The CI pipeline (ruff → mypy → pytest → bandit) was demonstrated as functional and caught several issues pre-merge (dead fixtures, empty catch blocks, stale references). This directly supported the DoD criterion that all CI checks must pass before merge. The customer did not request changes to the CI pipeline itself, confirming it meets project expectations.

### UAT Execution

The customer interacted with the live dashboard during the review: clicking the drawing toolbar, toggling themes, and inspecting pattern markers. This uncovered a usability gap — the candle range for pattern analysis (150k candles) was excessive and caused confusion ("12,500 hours — that's about a year and a half"). The team agreed to reduce to 50k candles (PBI-107 scope). The customer also confirmed that confidence threshold sliders and drawing persistence are useful, validating those UI decisions.

### Sprint Review and Release

The release of v1.1.0 ([CHANGELOG](../../CHANGELOG.md), [milestone](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/3)) made the increment concrete for the customer. The demo showed 13 drawing tools, SQLite persistence, theme toggle, pattern analysis UI, and WebSocket heartbeat. Having a tagged release with a changelog allowed the customer to evaluate "what changed" directly rather than relying on a walkthrough alone.

---

## Validated Assumptions

_Assumptions or decisions confirmed or rejected during this Sprint:_

| Assumption | Status | Evidence |
|---|---|---|
| Open-source charting library (lightweight-charts v4) is sufficient for MVP without TradingView's proprietary library | ✅ Confirmed | Customer accepted the demo; TradingView library has a license incompatible with project constraints (Fedor: "it comes with a license — I decided to use this open-source project") |
| REST polling is adequate for live candle updates | ❌ Rejected | Customer explicitly questioned why WebSockets aren't used ("you receive data instantly — it is pushed to your channel"). PBI-108 heartbeat exists but full WS subscription is needed |
| 150k candle range for pattern analysis is reasonable | ❌ Rejected | Customer calculated it covers ~1.5 years and called it excessive. Team agreed to reduce to 50k candles |
| ML model with small dataset (800 patterns) can outperform rule-based approaches in recall | ✅ Confirmed | 6–7× higher recall than rule-based, validating the ML investment despite lower precision |
| SQLite persistence for drawings and settings is valuable | ✅ Confirmed | Customer agreed saving drawings across sessions is "more convenient — you won't lose your work" |
| Rule-based pattern detection is too rigid for real-world chart variations | ✅ Confirmed | ML model handles micro/macro variations (e.g., 0.5% shoulder shift) that the rule-based algorithm would miss (Daniel: "rule-based has strict conditions and would fail") |
| Anomaly detection is out of scope for this project | ✅ Confirmed | Daniel confirmed it is unlikely to be implemented; customer accepted this |
| Metrics (RSI, Volume, High/Low) are needed but not for this sprint | ✅ Confirmed | Customer asked about metrics → deferred to Sprint 4 with a backlog item |

---

## Friction and Gaps

- **Unresolved requirements:** Metrics (RSI, Volume, High/Low) not yet implemented — deferred to Sprint 4. Candle color customization (US-14) still unscheduled. Timeframe selector currently only supports 5m.
- **Technical risks:** No database caching implemented — every page load sends a request to Bybit (customer flagged: "That definitely needs to be changed"). ML model precision (19%) is lower than rule-based baseline (30%) due to small training set. Bybit rate limits may become a bottleneck under higher load.
- **Quality gaps:** No test coverage for frontend JavaScript. ML model accuracy QRT (F2 ≥ 0.80) may not be achievable with current training dataset size.
- **Missing test coverage:** WebSocket integration tests not yet written. No load testing for 10+ concurrent users.
- **Blocked work:** US-10 (volume chart), US-11 (RSI), US-12 (Fear & Greed) blocked pending chart infrastructure decisions.
- **Process friction:** Some PBIs (e.g., 50k candle support) had to be rescoped mid-sprint when the customer raised the issue during review rather than during planning.
- **Follow-up questions:** Should the pattern analysis range be configurable by the user or fixed to 50k? Should the WebSocket migration be a single PBI or split across backend (data ingestion) and frontend (event handling)?

---

## Planned Response

_How the team will respond in the next Sprint or assignment:_

| Issue | Planned action | Links |
|---|---|---|
| REST-based data retrieval has high latency | Migrate to WebSocket subscription model for real-time candle and ticker updates | New PBI (Sprint 4) |
| No database caching — all data re-fetched from Bybit on page load | Implement SQLite-based candle caching with background refresh (Fedor: "I will implement a database") | PBI-106 (extension) |
| Metrics (RSI, Volume, High/Low) missing | Add RSI sub-chart, volume sub-chart, and price metrics to dashboard | US-10, US-11, [#70](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/70) PBI-109 extension |
| ML model precision is low (19%) due to small training set | Expand labelled dataset with additional manual labelling sessions; investigate data augmentation | QR-003, [#5 US-01](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/5) |
| Pattern analysis range was 150k (excessive) | Reduce to 50k candles as default; make range configurable via settings | PBI-107 (adjusted) |
| Only 5-minute timeframe supported | Add multi-interval support (15m, 1h, 4h, 1d) to Bybit client and frontend selector | US-07 |
| No frontend JavaScript tests | Add JS test framework (Jest/Vitest) and write unit tests for drawing toolbar, chart rendering, and WebSocket client | New PBI (Sprint 4) |
