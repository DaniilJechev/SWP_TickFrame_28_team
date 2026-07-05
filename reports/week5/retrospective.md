# Sprint 4 Retrospective — Assignment 5

**Date:** 2026-07-03

---

## What Went Well

1. **WebSocket migration delivered end-to-end.** The largest technical change in Sprint 4 — replacing REST polling with live WebSocket streams from Bybit and Binance — was completed successfully. Historical data serves from DB cache, live updates push via WebSocket without manual refresh ([#110](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110)).

2. **SQLite 3-tier caching** eliminated redundant exchange API calls. Revisit loads are near-instant. The memory → SQLite → exchange architecture was implemented cleanly ([#111](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/111)).

3. **Volume sub-chart** was implemented and confirmed working in UAT. Customer found the Volume bars responsive to trading activity ([#113](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113)).

4. **Multi-interval support** (5m, 15m, 1h, 4h, 1d) was implemented, unblocking UAT-002 which had been deferred since Sprint 3 ([#115](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/115)).

5. **Architecture documentation completed** in parallel with feature work — 3 views (static/dynamic/deployment) with PlantUML source and rendered SVGs, plus 3 ADRs linked to quality requirements.

6. **CI pipeline extended** with frontend JS testing (Vitest + ESLint) and 2 new QRTs (QRT-004 WebSocket, QRT-005 DB cache).

7. **UAT session was efficient** — all 7 scenarios reviewed, customer feedback captured clearly.

## What Did Not Go Well

1. **RSI sub-chart was not delivered.** Manual implementation using the TradingView library failed due to rendering constraints. The customer rightly noted this was in the initial requirements and is critical. The implementation approach should have been validated earlier ([#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112)).

2. **UI polish lagged.** Chart switching and element movement have visible glitches. These were deprioritised in favour of feature completion but were noticed by the customer during the review.

3. **Pattern filtering was missing.** The customer explicitly requested pattern-type toggle visibility and confidence threshold controls during the review. This should have been anticipated as a natural complement to the ML report display.

4. **Analysis results not persisted to database.** Saving scan results to SQLite was planned for this sprint but slipped.

5. **ML accuracy at ~57%.** QR-003 threshold (F2 ≥ 0.55) is barely exceeded. Double Top/Double Bottom model may improve this, but current accuracy is limited by training data size.

## Changes from Previous Sprint

_Based on the previous Sprint retrospective (see [reports/week4/retrospective.md](../week4/retrospective.md)):_

- **Action point 1 (was: "Validate data architecture decisions with customer during planning"):** ⚠️ Partially addressed. The Sprint 4 planning session included the WebSocket migration and DB caching decisions. However, pattern filtering (requested during the review) could have been anticipated.

- **Action point 2 (was: "Add sanity-check step to Definition of Ready"):** ✅ Addressed. The analysis range slider (≤50k) was validated internally before demo. No re-run of the 150k-range issue from Sprint 3.

- **Action point 3 (was: "Dedicate capacity to ML training data expansion"):** ⚠️ Partially addressed. ML team is labelling data for Double Top/Double Bottom. However, no team-wide labelling sessions were held.

- **Action point 4 (was: "Split data pipeline rewrite into multiple PBIs"):** ✅ Addressed. The data pipeline work was split across WebSocket migration ([#110](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110)) and DB caching ([#111](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/111)).

## Process Improvements for Next Sprint

1. **Library capability validation before implementation.** The RSI issue stemmed from assuming the TradingView library would support custom indicators easily. Future indicator work should include a spike/prototype step ("can this library render this indicator?") before committing to an implementation approach.

2. **Anticipate complement features.** When shipping ML reports with descriptions and confidence scores, customer will naturally expect filtering controls. Add to backlog proactively rather than during the review.

3. **Reserve capacity for UI polish.** User-facing glitches erode confidence even when features work. Dedicate a fixed percentage of sprint capacity (e.g., 10–15%) to UI refinement.

4. **Split documentation work into smaller PRs.** The `121-dev-process-docs` branch covering Parts 3–5 was too broad. Future documentation work should be split into focused, reviewable increments.
