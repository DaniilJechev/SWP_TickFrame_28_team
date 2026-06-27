# Sprint 3 Retrospective — Assignment 4

> **Template — Assignment 4, Part 12**
>
> Instructions:
> - Conduct after the Sprint Review
> - Keep public and sanitized — no sensitive personal info or private conflicts
> - Include concrete, actionable improvements for next Sprint
> - Reference the previous Sprint's retrospective to show continuity

---

**Date:** 2026-06-26

---

## What Went Well

1. **Drawing toolbar delivered end-to-end.** The team implemented 13 drawing tools on a canvas overlay with per-drawing settings (color, width, line style, font size), undo/redo stack, redact mode, and SQLite persistence. This was the largest single feature in Sprint 3 and was fully completed ([#62](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/62), [#64](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/64), [#66](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/66), [#67](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/67)).

2. **CI pipeline operational with all quality gates.** Ruff linting, mypy type checking, pytest coverage, and bandit security scanning run on every push. All 4 checks pass. The pipeline caught several real issues pre-merge (dead fixtures, stale references, empty catch blocks). This directly implements the DoD requirement that all CI checks pass before merge.

3. **Quality requirements defined and automated.** QR-001 (Performance), QR-002 (Security), and QR-003 (Accuracy) were documented with measurable scenarios and automated QRT suites. The performance QRT confirmed p95 response < 500 ms for candle endpoints under two-phase load. The security QRT confirmed zero bandit findings. The accuracy QRT established deterministic output for the ML model.

4. **ML model deployed as a microservice.** Daniel trained a neural network for Head and Shoulders / Inverse Head and Shoulders detection that achieves 6–7× recall over the rule-based baseline. Processing throughput (15k candles/sec) is sufficient for the planned 50k-candle analysis range. The model runs as a separate Docker microservice, decoupling ML development from frontend iterations.

5. **Customer review was productive and focused.** The customer engaged actively, tested features (drawing tools, theme toggle, pattern UI), and provided clear, prioritised feedback for Sprint 4. No redesigns or major scope changes were requested — only incremental improvements (WebSocket migration, database caching, metrics).

## What Did Not Go Well

1. **Data pipeline architecture requires a rewrite.** The current REST-based candle fetching from Bybit was flagged by the customer as suboptimal. Every page load re-fetches all candles from Bybit — no database caching exists. The customer explicitly requested WebSocket subscription migration. This is a significant rework that should have been identified earlier in sprint planning rather than during the review.

2. **ML model precision is below target.** At 19–25% precision, the model generates ~4 false positives for every true positive. QR-003 targets F2 ≥ 0.80, which requires both higher precision and higher recall. The root cause — a training set of only 800 labelled patterns — was a known constraint from Sprint 2 that was not actively mitigated during Sprint 3. Manual labelling is slow (~7 hours for 3–5 patterns per algorithm run), and no data augmentation strategy was explored.

3. **Pattern analysis range was not validated before the review.** The team shipped 150k candles as the analysis range without sanity-checking the time span. The customer calculated it covered ~1.5 years and called it excessive. This is a basic product-sense check that should have been caught internally before the demo.

4. **Only 5m timeframe is supported.** Despite US-07 (timeframe selection) being a Must-Have item, the chart only supports 5-minute intervals. The interval buttons exist in the UI but switching is not wired to the data layer. This was a known gap from Sprint 2 that was carried forward without progress.

5. **Metrics (RSI, Volume, High/Low) were not started.** These features were deferred from Sprint 2 and remained untouched in Sprint 3. The customer explicitly asked about them during the review, and they will now need to be delivered in Sprint 4 alongside the data pipeline rewrite — creating a capacity risk.

## Changes from Previous Sprint

_Based on the previous Sprint retrospective (see [reports/week3/retrospective.md](../../reports/week3/retrospective.md)):_

- **Action point 1 (was: "Complete TradingView API research"):** ✅ Done. The team evaluated TradingView's charting library and determined its license is incompatible with project requirements. Lightweight-charts v4 was chosen as the default. This decision was presented and accepted by the customer during the review.

- **Action point 2 (was: "Integrate a real XGBoost pattern detection model"):** ⚠️ Partially done. A real ML model was trained and deployed as a microservice, but it was not integrated as the primary detector in the frontend "Analyze Patterns" flow. The demo showed the model's metrics and capabilities, but the frontend still uses a separate analysis pipeline. The developer offered to complete integration by end of day.

## Process Improvements for Next Sprint

1. **Validate data architecture decisions with the customer during sprint planning, not during the review.** The WebSocket vs. REST decision and the database caching gap were known unknowns that should have been raised as questions in the planning session rather than discovered by the customer. Create a "technical decisions to validate" agenda item for the Sprint 4 planning meeting.

2. **Add a basic sanity-check step to the Definition of Ready.** PBIs involving user-facing numerical parameters (e.g., candle range = 150k) should include a "plausibility check" — does this number make sense in real-world units? A 30-second calculation (150k × 5 min = 750k min ≈ 1.5 years) would have caught this before the demo.

3. **Dedicate capacity to ML training data expansion.** The 19–25% precision gap will not close without more labelled data. Schedule two team-wide labelling sessions in Sprint 4 (2 hours each) and explore automated data augmentation techniques. Without action, QR-003 (F2 ≥ 0.80) will remain unreachable.

4. **Split the data pipeline rewrite into at least 2 PBIs.** WebSocket subscription + database caching is a large change that touches both backend data ingestion and frontend rendering. Split into: (a) backend WebSocket listener + database writer, (b) frontend event-driven candle consumer. This prevents a single PBI from blocking the sprint if one half is delayed.
