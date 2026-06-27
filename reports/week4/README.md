# SWP TickFrame — Week 4 Report (Assignment 4)

**Team:** SWP_TickFrame_28
**Short Description:** Quality-gated increment: drawing toolbar (13 tools), SQLite persistence, pattern analysis UI, CI pipeline, test coverage, and quality requirements.
**License:** [MIT](../../LICENSE)
**Repository:** https://github.com/Fedos113/SWP_TickFrame_28_team

---

## Sprint Planning

- **Product Backlog:** https://github.com/Fedos113/SWP_TickFrame_28_team/issues
- **Sprint Backlog:** https://github.com/users/Fedos113/projects/1/views/1
- **Sprint 3 Milestone:** https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/3
- **Goal:** Drawing toolbar with 13 tools, 50k candle support, SQLite persistence, WebSocket heartbeat, pattern analysis UI, coin sidebar enhancements, redact/undo system
- **Dates:** 2026-06-22 – 2026-06-29
- **Total Story Points:** 92

---

## What Was Delivered

| PBI | Title | Status | PR |
|-----|-------|--------|----|
| [#62](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/62) PBI-101 | Drawing Toolbar Engine — 13-tool canvas overlay | Done | _PR link_ |
| [#64](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/64) PBI-102 | Advanced Drawing Tools — Fibonacci, Price Range %, Text | Done | _PR link_ |
| [#63](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/63) PBI-103 | Redact Mode + Selection + Drag-to-Move/Reshape | Done | _PR link_ |
| [#66](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/66) PBI-104 | Undo System — Add/Modify/Delete | Done | _PR link_ |
| [#65](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/65) PBI-105 | Per-Drawing Settings Panel | Done | _PR link_ |
| [#67](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/67) PBI-106 | SQLite Persistence — Drawings, Settings, Candles | Done | _PR link_ |
| [#68](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/68) PBI-107 | 50k Candle Support + Two-Phase Load + Pagination | Done | _PR link_ |
| [#69](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/69) PBI-108 | WebSocket Heartbeat + LIVE Status Indicator | Done | _PR link_ |
| [#70](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/70) PBI-109 | Pattern Analysis UI — Sliding Window + Visualization | Done | _PR link_ |
| [#61](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/61) PBI-110 | Coin Sidebar — Ticker, Trend Colors, Price Format | Done | _PR link_ |
| [#71](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/71) PBI-111 | Theme Persistence + Theme-Aware Drawing Colors | Done | _PR link_ |
| [#74](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/74) PBI-112 | API Rate Limiting, DB Optimisation, Candle Performance | Done | _PR link_ |
| [#75](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/75) PBI-113 | Coin Switch Stability & Loading Overlay | Done | _PR link_ |
| [#76](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/76) PBI-114 | Frontend Candle Cache & Zoom-Out Lazy Loading | Done | _PR link_ |
| [#72](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/72) | Bug Fixes Batch (race conditions, dead code, etc.) | Done | _PR link_ |
| [#79](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/79) QR-001 | Performance Quality Requirement | Done | — |
| [#80](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/80) QR-002 | Security Quality Requirement | Done | — |
| [#81](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/81) QR-003 | Accuracy Quality Requirement | Done | — |
| [#82](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/82) QRT-001 | Performance Test Automation | Done | — |
| [#83](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/83) QRT-002 | Security Test Automation | Done | — |
| [#84](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/84) QRT-003 | Accuracy Test Automation | Done | — |
| [#86](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/86) | CI Pipeline Setup | Done | — |

---

## Deployed

- **URL:** http://localhost:8000 (Docker Compose)
- **How to run:** [`README.md`](../../README.md) — `docker compose up --build`

---

## Customer Feedback Response — Week 3 Review

Based on the [Week 3 Customer Review](../week3/customer-review-transcript.md), the following feedback points were addressed:

| Feedback Point | Resulting PBI or Issue | Status | Response |
|---|---|---|---|
| Add Fear & Greed Index to dashboard | [#14](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/14) US-12 | Not Planned (Sprint 3) | Deferred — quality foundations and CI took priority. Revisit in Sprint 4. |
| Add volume chart below main chart | [#11](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/11) US-10 | Not Planned (Sprint 3) | Deferred — volume sub-chart requires chart infrastructure work. Planned for Sprint 4. |
| Add RSI indicator sub-chart | [#13](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/13) US-11 | Not Planned (Sprint 3) | Deferred — depends on TradingView integration. Planned for Sprint 4. |
| Include drawing tools on chart | [#62](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/62) PBI-101, [#64](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/64) PBI-102 | Done | 13 drawing tools implemented. See PBI-101/102/103/104/105. |
| Support light and dark themes | [#71](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/71) PBI-111 | Done | Theme persistence added (SQLite), light theme chart colors fixed, drawing colors adapt. |
| Support candle color customization | [#17](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/17) US-14 | Not Planned (Sprint 3) | Deferred — requires settings UI redesign. Planned for Sprint 4. |
| Registration/authentication not needed for MVP | N/A | Accepted | Confirmed — authentication excluded from MVP scope. |
| Provide additional Figma screens for pattern visualization | N/A | Out of scope | Design work tracked outside GitHub. |
| Define how metrics will be displayed | [#70](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/70) PBI-109 | Done | Pattern analysis shows red dashed vertical lines + labels with pattern type and confidence. |
| Define behavior for multiple simultaneous patterns | [#70](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/70) PBI-109 | Done | Multiple patterns rendered as individual vertical lines on chart. Sliding window (step 10) scans range. |
| Add dedicated pattern list like coin list | N/A | Not Planned (Sprint 3) | Deferred — requires frontend redesign. |
| Research TradingView capabilities | N/A | Done | TradingView license incompatible with project constraints. Lightweight Charts v4 remains default. |
| Use GitHub Projects for task tracking | N/A | Done | GitHub Projects board active with Sprint 3 view. |
| Continue reviewing Figma updates asynchronously | N/A | Open | Figma updates pending. |

---

## Docs

- [Roadmap](../../docs/roadmap.md)
- [Definition of Done](../../docs/definition-of-done.md)
- [Quality Requirements](../../docs/quality-requirements.md)
- [Quality Requirement Tests](../../docs/quality-requirement-tests.md)
- [Testing Strategy](../../docs/testing.md)
- [User Acceptance Tests](../../docs/user-acceptance-tests.md)
- [User Stories](../../docs/user-stories.md)
- [Product Backlog](../../docs/backlog.md)
- [CHANGELOG](../../CHANGELOG.md)

---

## Quality Model

| ID | ISO/IEC 25010 Sub-characteristic | Key Metric | QRT Link |
|---|---|---|---|
| QR-001 | Performance Efficiency — Time Behaviour | p95 response ≤ 500 ms | [#82](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/82) |
| QR-002 | Security — Confidentiality | Zero secrets in commits, Bandit passes | [#83](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/83) |
| QR-003 | Functional Suitability — Accuracy | F2 ≥ 0.80, FPR ≤ 20% | [#84](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/84) |

---

## Test Coverage

| Module | Coverage |
|---|---|
| `tickframe/backend/services/bybit_client.py` | ≥30% |
| `tickframe/backend/services/database.py` | ≥30% |
| `tickframe/backend/services/ml_client.py` | ≥30% |
| `tickframe/backend/api/` (endpoints + websocket) | ≥30% |
| `tickframe/backend/models/schemas.py` | ≥30% |
| `tickframe/detection/mock.py` | ≥30% |
| `tickframe/frontend/` (JS) | Not tested |

**Unit tests:** [`tests/unit/`](../../tests/unit/) — `test_bybit_client.py`, `test_cache.py`, `test_detection.py`, `test_schemas.py`

**Integration tests:** [`tests/integration/`](../../tests/integration/) — `test_api_endpoints.py`

**QRTs:** [`tests/requirements/`](../../tests/requirements/) — `test_performance.py`, `test_security.py`, `test_accuracy.py`

---

## CI

- **Workflow:** [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)
- **Latest run:** _[link to latest passing CI run]_

| Check | Tool | Target | Status |
|---|---|---|---|
| Linting | `ruff check .` | Zero errors | ✅ Pass |
| Type checking | `mypy tickframe/` | Zero errors | ✅ Pass |
| Tests | `pytest --cov=tickframe tests/` | All pass, coverage reported | ✅ Pass |
| QA | `bandit -r tickframe/ -ll` | Zero high-severity | ✅ Pass |

---

## Screenshots

> Place screenshots in [`reports/week4/images/`](images/) — directory currently empty.
> 
> - Sprint 3 milestone view → `images/sprint-milestone.png`
> - Latest passing CI run on `main` → `images/ci-pass.png`
> - Coverage report → `images/coverage-report.png`
> - QA check result → `images/qa-check.png`
> - SemVer release page → `images/semver-release.png`
> - Example reviewed PR → `images/reviewed-pr.png`
> - Product Backlog / Sprint Backlog → optional

---

## Quality Gates Going Forward

The following checks remain enforced for all future sprints:

1. **All CI checks must pass** on branch and after merge (ruff, mypy, pytest, bandit)
2. **Line coverage ≥30%** for critical backend modules — target to increase in Sprint 4
3. **Quality requirement tests must pass** — every QR has an automated QRT suite
4. **CHANGELOG updated** for every user-visible change
5. **SemVer release** tagged at the end of each sprint
6. **Definition of Done** checklist verified before marking any PBI complete
7. **PR review by someone who did not write the code**

---

## UAT

| Scenario | Result |
|---|---|
| UAT-001: Scan and view chart patterns | ⏳ Partial — markers/labels shown; ML model as separate microservice |
| UAT-002: Toggle chart timeframes | ❌ Not tested — only 5m available |
| UAT-003: Export scan results | ⏳ Not demonstrated |
| UAT-004: Real-time sidebar (10 pairs) | ✅ Pass |
| UAT-005: Theme toggle | ✅ Pass |

**Key feedback:** Customer approved drawing toolbar, theme persistence, and confidence threshold slider. Critical requests: migrate to WebSocket data subscription, implement database caching, add RSI/Volume/High-Low metrics, reduce analysis range to 50k candles.

**Resulting PBIs:** WebSocket migration (new), DB caching (new), RSI sub-chart US-11 (promoted), Volume sub-chart US-10 (promoted).

---

## Customer Review

- **Transcript:** [`customer-review-transcript.md`](customer-review-transcript.md) — published with customer consent
- **Notes:** [`customer-review-notes.md`](customer-review-notes.md)
- **Summary:** [`customer-review-summary.md`](customer-review-summary.md)

**Date:** 2026-06-26
**Participants:** Customer / Product Owner, Frontend Developer, ML Engineer, Stakeholder, Team Member

---

## Retrospective

[`retrospective.md`](retrospective.md) — Date: 2026-06-26

**Key takeaways:**
- Drawing toolbar delivered end-to-end; CI pipeline operational; QRTs automated; ML microservice deployed
- Data pipeline needs REST→WebSocket rewrite; ML precision (19–25%) below target; 150k candle range not sanity-checked; only 5m timeframe

---

## Reflection

[`reflection.md`](reflection.md)

**Learning points:** Customer feedback response (WebSocket over REST), QR-003 precision/recall trade-off, QRT automation value, CI pipeline confirmation, UAT gap (150k candle range).

**Validated assumptions:** 6 confirmed (open-source charting, ML recall, SQLite persistence), 2 rejected (REST polling adequacy, 150k range).

**Planned response:** WebSocket migration, DB caching, RSI/volume metrics, expanded ML dataset, 50k range, multi-timeframe support.

---

## LLM Report

[`llm-report.md`](llm-report.md) — OpenCode (deepseek-v4-flash-free) used for code generation, test writing, CI config, documentation, report drafting, and UAT scenario design.

---

## Status & Next Steps

**Sprint 3 is complete** — all planned PBIs delivered. The product now has a functional drawing toolbar, pattern analysis UI, persistent settings, and automated quality gates.

**Coming in Sprint 4:**
1. WebSocket subscription migration for real-time data
2. SQLite database caching for persistent candle storage
3. RSI indicator sub-chart (US-11)
4. Volume sub-chart (US-10)
5. High/Low price metrics
6. Multi-interval support (15m, 1h, 4h, 1d)
7. Expanded ML training dataset + frontend integration
8. Frontend JavaScript test coverage

---

## Contributions

| Person | Role | Issues | PRs | Reviews | Testing | QA | Docs |
|---|---|---|---|---|---|---|---|
| _[Name]_ | _[Role]_ | _[#]_ | _[#]_ | _[#]_ | _[# tests]_ | _[Y/N]_ | _[Y/N]_ |
| _[Name]_ | _[Role]_ | _[#]_ | _[#]_ | _[#]_ | _[# tests]_ | _[Y/N]_ | _[Y/N]_ |

> _To fill: team member usernames, assigned issues, PRs authored/reviewed, tests written, QA checks run, docs updated._

---

## Presentation

- **Slides:** _[presentation.pdf](presentation.pdf) — or "Moodle only"_
- **Public demo video:** _[link] — or "Moodle only"_
- **Rehearsed presentation:** _[private link — Moodle only]_

---

## Artifacts and Workflow Links

- **Sprint 3 Milestone:** https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/3
- **Product Backlog Board:** https://github.com/users/Fedos113/projects/1/views/1
- **Quality Requirements:** [`docs/quality-requirements.md`](../../docs/quality-requirements.md)
- **Definition of Done:** [`docs/definition-of-done.md`](../../docs/definition-of-done.md)
- **Roadmap:** [`docs/roadmap.md`](../../docs/roadmap.md)
- **CI Workflow:** [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)
- **CHANGELOG:** [`CHANGELOG.md`](../../CHANGELOG.md)
- **Release v1.1.0:** https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/v1.1.0
- **Deployed product:** http://localhost:8000 (Docker Compose)
