# SWP TickFrame — Week 4 Report (Assignment 4)

**Short Description:** Quality-gated increment: drawing toolbar (13 tools), SQLite persistence, pattern analysis UI, CI pipeline, test coverage, and quality requirements.

**License:** [MIT](../../LICENSE)

---

## Customer Feedback Response — Week 3 Review

Based on the [Week 3 Customer Review](../week3/customer-review-transcript.md), the following feedback points were addressed:

| Feedback Point | Resulting PBI or Issue | Status | Response |
|---|---|---|---|
| Add Fear & Greed Index to dashboard | [#14](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/14) US-12 | Not Planned (Sprint 3) | Deferred — quality foundations and CI took priority for this sprint. Revisit in Sprint 4. |
| Add volume chart below main chart | [#11](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/11) US-10 | Not Planned (Sprint 3) | Deferred — volume sub-chart requires chart infrastructure work. Planned for Sprint 4. |
| Add RSI indicator sub-chart | [#13](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/13) US-11 | Not Planned (Sprint 3) | Deferred — RSI sub-chart depends on TradingView Advanced Charts integration. Planned for Sprint 4. |
| Include drawing tools on chart | [#62](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/62) PBI-101, [#64](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/64) PBI-102 | In Progress (Sprint 3) | Fully addressed — 13 drawing tools implemented (Trend Line, Horizontal/Vertical Line, Ray, Cross Line, Fibonacci, Price Range %, Rectangle, Circle, Arrow, Text, Brush, Redact). See PBI-101/102/103/104/105. |
| Support light and dark themes | [#71](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/71) PBI-111 | In Progress (Sprint 3) | Addressed — theme persistence added (saved to SQLite, restored on reload). Light theme chart colors fixed. Drawing colors adapt to current theme. |
| Support candle color customization | [#17](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/17) US-14 | Not Planned (Sprint 3) | Deferred — requires settings UI redesign. Planned for Sprint 4. |
| Registration/authentication not needed for MVP | N/A | Accepted | Confirmed — authentication excluded from MVP scope. |
| Provide additional Figma screens for pattern visualization | N/A | Out of scope | Design work tracked outside GitHub — team to produce updated Figma screens asynchronously. |
| Define how metrics will be displayed | [#70](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/70) PBI-109 | In Progress (Sprint 3) | Partially addressed — pattern analysis now shows red dashed vertical lines + labels with pattern type and confidence %. Further refinement planned. |
| Define behavior for multiple simultaneous patterns | [#70](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/70) PBI-109 | In Progress (Sprint 3) | Multiple patterns rendered as individual vertical lines on chart. Sliding window (step 10) scans entire visible range. |
| Add dedicated pattern list like coin list | N/A | Not Planned (Sprint 3) | Deferred — pattern list UI requires frontend redesign. Planned for future sprint. |
| Research TradingView capabilities | N/A | Done | TradingView Charting Library integration available as advanced chart mode (see `datafeed.js` and `charts.js`). Lightweight Charts v4 remains default (free). |
| Use GitHub Projects for task tracking | N/A | Done | GitHub Projects board active with Sprint 3 view (To Do / In Progress / Review / Done columns). |
| Continue reviewing Figma updates asynchronously | N/A | Open | Figma updates pending — no additional review meetings scheduled. |

---

## Sprint 3 Progress

### Scope for Sprint 3
Sprint 3 delivers a quality-gated increment with focus on:

**Drawing & Annotation Tools:**
- 13 drawing tools on a canvas overlay (Trend Line, H-Line, V-Line, Ray, Cross Line, Fibonacci, Price Range %, Rectangle, Circle, Arrow, Text, Brush, Redact)
- Per-drawing settings (color, width, line style, font size)
- Undo/redo stack for add, modify, delete operations
- SQLite persistence for drawings and settings

**Chart & Performance:**
- 50k candle support with two-phase load (instant 2000 + background 50000)
- Frontend candle cache for instant coin re-switch
- Zoom-out lazy loading via pagination
- Rate limiting (token-bucket) on exchange API calls
- WebSocket heartbeat + LIVE status indicator

**Pattern Analysis:**
- Sliding window analysis (50 candles, step 10)
- Red dashed vertical lines + labels with pattern type and confidence
- Confidence threshold slider in settings

**Quality Foundations:**
- 3 Quality Requirements defined (Performance, Security, Accuracy)
- 3 QRT automation suites (performance, security, accuracy tests)
- CI pipeline with lint (ruff), type-check (mypy), test (pytest + coverage), QA (bandit)
- Updated Definition of Done with CI/coverage/QR criteria
- Test coverage target: ≥30% for critical modules

### Verified CI Jobs
- **lint:** `ruff check .` — no errors
- **type-check:** `mypy tickframe/` — no errors
- **test:** `pytest --cov=tickframe --cov-report=term --cov-report=xml tests/` — all tests pass, coverage reported
- **qa-check:** `bandit -r tickframe/ -ll` — no high-severity issues

### Definition of Done (Updated)
See [`docs/definition-of-done.md`](../../docs/definition-of-done.md) for the full criteria. Key additions:
- All CI checks must pass on branch and after merge
- Line coverage ≥30% for critical modules
- Quality requirement tests must pass
- Additional QA check (bandit) must pass

---

## Artifacts and Workflow Links

- **Sprint 3 Milestone:** https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/3
- **Product Backlog Board:** https://github.com/users/Fedos113/projects/1/views/1
- **Quality Requirements:** [`docs/quality-requirements.md`](../../docs/quality-requirements.md)
- **Definition of Done:** [`docs/definition-of-done.md`](../../docs/definition-of-done.md)
- **Roadmap:** [`docs/roadmap.md`](../../docs/roadmap.md)
- **CI Workflow:** [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)
- **CHANGELOG:** [`CHANGELOG.md`](../../CHANGELOG.md)
