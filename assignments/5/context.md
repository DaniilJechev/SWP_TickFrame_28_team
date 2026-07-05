# Memory5 — SWP TickFrame Team 28 · Assignment 5 Context File

> **Purpose:** Comprehensive AI-assistant memory file for Assignment 5. Contains all project context, current status, gaps against Assignment 05 requirements, and links to every relevant artifact. Update this file as work progresses.

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Project Name** | SWP TickFrame |
| **Team** | 28 |
| **Repository** | https://github.com/Fedos113/SWP_TickFrame_28_team |
| **License** | MIT |
| **Description** | FastAPI-based cryptocurrency chart workstation with real-time Bybit market data, live WebSocket streaming, Lightweight Charts v5 candlestick charts, modular drawing toolbar (lightweight-charts-drawing library + canvas engine), Fear & Greed Index, coin icons, SQLite 3-tier cache, WebSocket real-time updates, and ML pattern analysis. |
| **Default Branch** | `main` (protected) |
| **MVP v1 Release** | [v1.0.0](https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/SemVer) (Sprint 2) |
| **Sprint 3 Release** | [v1.1.0](https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/v1.1.0) |
| **MVP v2 Release** | [v2.0.0](https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/v2.0.0) — target for Assignment 5 |
| **All Backlog Data** | Stored in [`docs/backlog.md`](../../docs/backlog.md) — authoritative PBI index |

---

## 2. Team Members & GitHub Usernames

| Person | GitHub | Role | Technical Responsibilities |
|---|---|---|---|
| F. Kozhevnikov | [Fedos113](https://github.com/Fedos113) | Product Owner / Full-Stack | Backend, frontend, architecture, CI/CD |
| A. Gafarov | [omarichev](https://github.com/omarichev) | Developer / Documentation | Backend, documentation, reports |
| A. Mindubaev | [pug228](https://github.com/pug228) | Developer / Quality & CI | QRTs, testing strategy, CI pipeline |
| D. Zhechev | [DaniilJechev](https://github.com/DaniilJechev) | Scrum Master / ML Engineer | ML model training, ML microservice |
| M. Bezborodov | [MikhailBezborodov024](https://github.com/MikhailBezborodov024) | Developer / Frontend | Frontend UI, chart components |

---

## 3. Repository Structure

```
SWP_TickFrame_28_team/
├── .github/
│   ├── ISSUE_TEMPLATE/          # Issue forms (user story, bug, PBI, course task)
│   ├── pull_request_template.md # PR template with changelog checklist
│   └── workflows/
│       ├── ci.yml               # CI: ruff → mypy → pytest+cov → bandit
│       └── lychee.yml           # Link checker on push/PR to main
├── assignments/
│   ├── 4/                       # Assignment 4 artifacts (consolidated from root)
│   │   ├── Assignment_04.md
│   │   ├── 4checklist.md
│   │   ├── 4mvpplan.md
│   │   ├── 4part1-plan.md
│   │   ├── 4part2.md
│   │   ├── assignment4.tex
│   │   └── presentation.tex
│   ├── 5/                       # Assignment 5 artifacts (current)
│   │   ├── Assignment_05.md     # Main assignment spec (508 lines)
│   │   ├── Artifact_Requirements.md  # Shared artifact rules (754 lines)
│   │   ├── breakdown.md         # Empty — for task breakdown
│   │   ├── memory5.md           ← This file
│   │   ├── issue_template.md    # Week 5 issue template (PBIs, docs, course tasks)
│   │   ├── contributions.md     # Contribution tracking table (fill per member)
│   │   ├── 2-plan.md            # Delivery plan: Parts 3–5 (dev process, architecture, ADRs)
│   │   ├── 3-plan.md            # Delivery plan: Part 6 (testing, QA, DoD)
│   │   ├── 5-plan.md            # Delivery plan: Part 8 (UAT)
│   │   ├── 6-plan.md            # Delivery plan: Parts 9–13 (Sprint Review, retro, hosted docs, reflection, demo)
│   │   └── 7-plan.md            # Delivery plan: Moodle PDF submission
│   ├── old/                     # Earlier assignment specs
│   ├── Process_Requirements.md  # Scrum/workflow semantics (218 lines)
│   └── Repository_Requirements.md # Platform/repo mechanics (335 lines)
├── docs/
│   ├── backlog.md               # PBI index (split by Sprint + unscheduled)
│   ├── definition-of-done.md    # DoD checklist (CI, quality, code criteria)
│   ├── interface.md             # CLI interface specification
│   ├── quality-requirements.md  # QR-001, QR-002, QR-003
│   ├── quality-requirement-tests.md # QRT-001, QRT-002, QRT-003
│   ├── roadmap.md               # Sprint-by-Sprint plan (up to Sprint 4)
│   ├── testing.md               # Testing strategy, coverage, CI gates
│   ├── user-acceptance-tests.md # UAT-001 through UAT-005
│   └── user-stories.md          # User story index (US-01 to US-15)
│   [ A5 templates created: architecture/, development-process.md — all empty, fill incrementally ]
├── reports/
│   ├── week2/                   # Sprint 1 reports
│   ├── week3/                   # Sprint 2 reports
│   ├── week4/                   # Sprint 3 reports (completed)
│   └── week5/                   # Sprint 4 report templates (empty — fill incrementally)
├── tickframe/                   # Main Python package
│   ├── __main__.py              # CLI entry point
│   ├── cli.py                   # CLI commands (scan, report, analyze, serve)
│   ├── backend/
│   │   ├── main.py              # FastAPI app, lifespan, static mounts
│   │   ├── api/
│   │   │   ├── endpoints.py     # REST: health, coins, candles, analyze, drawings, settings
│   │   │   └── websocket.py     # WS: market hub, candle streams + heartbeat
│   │   ├── services/
│   │   │   ├── bybit_client.py  # Async Bybit v5 client with Binance fallback
│   │   │   ├── cache.py         # MemoryMarketCache (3-tier: mem → DB → exchange)
│   │   │   ├── database.py      # SQLite service (settings, drawings, candles)
│   │   │   ├── ml_client.py     # HTTP client for ML analysis service
│   │   │   ├── coin_icons.py    # CoinGecko icon fetcher with 1h TTL
│   │   │   └── fng_client.py    # Fear & Greed Index fetcher (alternative.me)
│   │   └── models/
│   │       └── schemas.py       # Pydantic models
│   ├── frontend/
│   │   ├── index.html           # Main page with right-side drawing toolbar
│   │   ├── css/
│   │   │   ├── styles.css       # Theming, layout, sidebar, FNG
│   │   │   ├── drawing-toolbar.css  # Modular drawing toolbar styles
│   │   │   └── drawing-properties.css # Drawing properties panel styles
│   │   ├── js/
│   │   │   ├── app.js           # Init, theme toggle, settings load/save
│   │   │   ├── charts.js        # Lightweight Charts v5, candle loading, pattern analysis, volume sub-chart
│   │   │   ├── sidebar.js       # Coin list, icons, FNG, trend-colored prices
│   │   │   ├── datafeed.js      # TradingView Charting Library adapter
│   │   │   ├── websocket.js     # WebSocket connection manager
│   │   │   ├── drawing-bundle.js  # Bundled drawing library (esbuild)
│   │   │   ├── drawing-controller.js  # Drawing operations controller
│   │   │   ├── drawing-events.js      # Drawing event handlers
│   │   │   ├── drawing-state.js       # Drawing state management
│   │   │   ├── drawing-settings.js    # Drawing settings panel
│   │   │   ├── drawing-toolbar.js     # Drawing toolbar interface
│   │   │   ├── drawing-properties.js  # Per-drawing properties UI
│   │   │   ├── drawing-overlay-src.js # Source for esbuild bundle
│   │   │   └── drawing-overlay.js     # Legacy canvas engine (retained)
│   │   └── eslint.config.js    # ESLint flat config
│   ├── data/                    # SQLite DB (gitignored)
│   ├── detection/               # Pattern detection logic
│   └── web/                     # Legacy web module
├── ml_service/                  # ML pattern detection microservice
│   ├── app/
│   │   ├── main.py              # FastAPI ML prediction endpoint
│   │   ├── config.py            # ML configuration
│   │   ├── schemas.py           # Request/response schemas
│   │   └── services/            # ML model logic
│   ├── Dockerfile
│   └── requirements.txt
├── tests/
│   ├── conftest.py
│   ├── unit/
│   │   ├── test_bybit_client.py
│   │   ├── test_cache.py
│   │   ├── test_detection.py
│   │   └── test_schemas.py
│   ├── integration/
│   │   └── test_api_endpoints.py
│   └── requirements/
│       ├── test_performance.py  # QRT-001
│       ├── test_security.py     # QRT-002
│       └── test_accuracy.py     # QRT-003
├── main.py                      # uvicorn entry point
├── package.json                 # npm deps: lightweight-charts-drawing, esbuild, build scripts
├── CHANGELOG.md                 # Keep a Changelog format
├── README.md                    # Project docs, setup, API, architecture
├── docker-compose.yml           # tickframe + ml-service
├── Dockerfile
├── requirements.txt
├── .env.example
└── .gitignore
```

---

## 4. Technology Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.11, FastAPI, Uvicorn, httpx, websockets |
| **Frontend** | Lightweight Charts v5, Canvas API, vanilla JS, lightweight-charts-drawing, Lucide icons, esbuild |
| **Database** | SQLite (via aiosqlite) |
| **ML** | TensorFlow/Keras (Head & Shoulders detection), FastAPI microservice |
| **Exchange** | Bybit v5 API (primary), Binance API (fallback) |
| **Deployment** | Docker + Docker Compose (2 containers) |
| **CI** | GitHub Actions (ruff, mypy, pytest+cov, bandit) |
| **Link Check** | Lychee (GitHub Actions) |
| **Package** | pip, requirements.txt |
| **AI Tools** | OpenCode (deepseek-v4-flash-free) for code, tests, docs, CI, reports |

---

## 5. Sprint History

### Sprint 1 — Repository & Process Foundation
- **Milestone:** [Sprint 1](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/1)
- **Dates:** Week 2
- **Goal:** Establish repository structure, licensing, and team workflow
- **Outcome:** Public repo, MIT license, .env.example, PR template

### Sprint 2 — MVP v1 Core Features
- **Milestone:** [Sprint 2 - MVP-v1](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/2)
- **Dates:** Week 3
- **Goal:** Working MVP v1 with ML pattern detection and basic UI
- **Release:** [v1.0.0](https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/SemVer)

### Sprint 3 — Drawing Tools + Quality Gates (Assignment 4)
- **Milestone:** [Sprint 3 — Assignment 4 — v1.1.0](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/3)
- **Dates:** 2026-06-22 – 2026-06-29
- **Goal:** Drawing toolbar (13 tools), SQLite persistence, pattern analysis UI, CI pipeline, QRTs
- **Release:** [v1.1.0](https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/v1.1.0)
- **Story Points:** 19 (all 15 PBIs delivered)
- **Week 4 Reports:** [`reports/week4/README.md`](../../reports/week4/README.md)

### Sprint 4 — Week 5 (Assignment 5 · MVP v2 developed here)
- **Milestone:** [Sprint 4](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/5)
- **Dates:** 2026-06-30 – 2026-07-06
- **Goal:** Deliver MVP v2 — DB caching, Volume sub-chart, multi-interval support, analysis range fix, UI redesign, drawing toolbar modernization. RSI deferred to Sprint 5.
- **Total Story Points:** 24 (24 completed; 3 superseded PBIs folded into new scope)
- **PBIs:** 9 total — 9 completed ([#122](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/122)–[#126](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/126), [#158](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/158), [#159](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/159), [#113](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113), [#110](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110)), 1 moved to Sprint 5 ([#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112))
- **Release:** [v2.0.0](https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/v2.0.0)
- **Scope:** All Sprint 4 PBIs define MVP v2 scope. Addressing all critical customer feedback from Sprint 3. RSI moved to Sprint 5 due to complexity of proper implementation.

---

## 6. Current Release Status

| Release | Tag | Date | Maps To |
|---|---|---|---|
| MVP v1 | `v1.0.0` (tagged `SemVer`) | 2026-06-21 | Sprint 2 |
| Sprint 3 Increment | `v1.1.0` | 2026-06-26 | Sprint 3 |
| **MVP v2** | **v2.0.0** | **Not yet created** | **Sprint 4 (Assignment 5)** |

Note: Tags `v1.1.0` and `v1.2.0` are the same version — duplicate tag created by human error. `v1.1.0` is the canonical latest published release.

---

## 7. Milestones Status

| Milestone | Number | State | Open Issues | Closed Issues |
|---|---|---|---|---|
| [Sprint 1](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/1) | 1 | Open | 0 | 1 |
| [Sprint 2 - MVP-v1](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/2) | 2 | Open | 0 | 2 |
| [Sprint 3 — Assignment 4](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/3) | 3 | Open | 0 | 25 |
| **[Sprint 4](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/5)** | **5** | **Active** | **12** (5 open + 7 new/closed) | **21** |
| **MVP v2** | **—** | **—** | **—** | **Release v2.0.0** |

---

## 8. CI Pipeline Status

**Workflow:** [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)

| Job | Tool | Runs On |
|---|---|---|
| lint | `ruff check .` | push/PR to main |
| type-check | `mypy tickframe/` | push/PR to main |
| test | `pytest --cov=tickframe --cov-report=xml tests/` | push/PR to main |
| qa-check | `bandit -r tickframe/ -ll` | push/PR to main |
| frontend-lint | `eslint tickframe/frontend/js/` | push/PR to main |
| frontend-test | `vitest run` (in `tickframe/frontend/`) | push/PR to main |

**Link Checker:** [`.github/workflows/lychee.yml`](../../.github/workflows/lychee.yml) — checks all `.md` files on push/PR to main.

**Latest run:** [CI run #28297395875](https://github.com/Fedos113/SWP_TickFrame_28_team/actions/runs/28297395875) — all checks passing.

**Branch protection:** Default branch (`main`) is protected:
- Direct pushes disabled
- At least one approval required before merge
- PR template enforced

**Adopted from A4:** Lychee link checking + bandit as additional QA check.

---

## 9. Quality Requirements & Tests (from Assignment 4)

| QR ID | Sub-characteristic | Metric | QRT | Status |
|---|---|---|---|---|
| QR-001 | Time Behaviour | p95 ≤ 500ms | QRT-001 | Active |
| QR-002 | Confidentiality | Zero secrets in commits | QRT-002 | Active |
| QR-003 | Functional Correctness | F2 ≥ 0.55, FPR ≤ 20% | QRT-003 | Active — threshold corrected from 0.80 to 0.55 |

All documented in:
- [`docs/quality-requirements.md`](../../docs/quality-requirements.md)
- [`docs/quality-requirement-tests.md`](../../docs/quality-requirement-tests.md)

---

## 10. Testing Status

| Test Type | Scope | Location | Status |
|---|---|---|---|---|
| Unit tests | bybit_client, cache, detection, schemas, websocket, database | `tests/unit/` | ✅ Passing |
| Integration tests | API endpoints | `tests/integration/test_api_endpoints.py` | ✅ Passing |
| QRTs | Performance, Security, Accuracy, WebSocket, DB Cache | `tests/requirements/` | ✅ 5 QRTs |
| Frontend JS tests | Basic WebSocket message parsing, URL construction | `tickframe/frontend/js/tests/` | ✅ Added for MVP v2 |

**Coverage:** ≥30% for critical modules (bybit_client, cache, database, ml_client, endpoints, websocket, schemas, detection).

**Documentation:** [`docs/testing.md`](../../docs/testing.md)

---

## 11. UAT Status (from Assignment 4)

| UAT | Title | Result | Notes |
|---|---|---|---|
| UAT-001 | Scan and view chart patterns | ⏳ Partial | ML reports display descriptions + confidence scores (~57%). Pattern filtering requested as new feature. |
| UAT-002 | Toggle chart timeframes | ⏳ Partial | 5 timeframes available (5m/15m/1h/4h/1d). UI glitches when switching — needs polish. |
| UAT-003 | Export scan results | ⏳ Not demonstrated | — |
| UAT-004 | Real-time sidebar | ✅ Pass | 10 pairs with live prices. WebSocket live prices confirmed. 24h change icon added. Coin icons + F&G index. |
| UAT-005 | Theme toggle | ✅ Pass | Works across reloads. No Sprint 4 changes. |
| UAT-006 | WebSocket real-time candle updates | ✅ Pass | WebSocket live candles from Bybit/Binance. DB cache for historical data. |
| UAT-007 | RSI and Volume sub-charts | ⏳ Partial | Volume sub-chart works. **RSI not working** — moved to Sprint 5. |

**Documentation:** [`docs/user-acceptance-tests.md`](../../docs/user-acceptance-tests.md)

**Assignment 5 requires:** At least 2 new UAT scenarios for MVP v2 functionality — ✅ 2 added (UAT-006, UAT-007).

---

## 12. Customer Feedback from Sprint 3 Review

Key feedback points from 2026-06-26 Sprint Review (see [`reports/week4/customer-review-summary.md`](../../reports/week4/customer-review-summary.md)):

| Feedback | Priority | PBI | Status |
|---|---|---|---|
| Migrate REST polling → WebSocket subscription | Critical | [#110 PBI-115](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110) | ✅ Done — live candles from Bybit/Binance via WebSocket |
| Implement DB caching for candles | Critical | [~~#111 PBI-116~~](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/111) → [#122 PBI-121](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/122) | ✅ Done (multi-interval caching) |
| Add RSI sub-chart | High | [#112 PBI-117](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112) | Moved to Sprint 5 (rendering complexity) |
| Add Volume sub-chart | High | [#113 PBI-118](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113) | ✅ Done |
| Reduce analysis range 150k → 50k candles | Medium | [~~#114 PBI-119~~](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/114) → [#123 PBI-122](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/123) | ✅ Done (configurable limit) |
| Multi-interval support (15m, 1h, 4h, 1d) | Medium | [~~#115 PBI-120~~](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/115) → [#122 PBI-121](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/122) | ✅ Done (5 intervals cached & switchable) |
| Candle colour customization | Low | US-14 in backlog | Deferred |

**Assignment 5 requires:** Customer feedback response table in week 5 report. Feedback must be addressed unless justified.

---

## 13. Definition of Done (Current)

[`docs/definition-of-done.md`](../../docs/definition-of-done.md)

Current DoD requires:
- All AC verified
- Reviewed & approved by different person
- PR links to current active Sprint milestone
- All CI checks pass (ruff, mypy, pytest+cov, bandit, lychee, frontend JS tests + lint)
- CHANGELOG updated for user-visible changes
- No secrets/PII committed
- README/docs updated if needed
- QR-001/002/003 not regressed
- Architecture docs & ADRs satisfied or N/A
- WebSocket reconnection verified (if change touches WebSocket)
- User stories: linked supporting PBIs provide review/verification evidence

**Assignment 5 requires:** DoD must be updated if Sprint 4 changes architecture, critical modules, deployment model, workflow, or CI configuration. ✅ Updated on `part-6-testing-qa`.

---

## 14. What Assignment 5 Requires (Gap Analysis)

> **Contributions on `MVPv2` (F. Kozhevnikov):** Repository reorganized (A4 files → `assignments/4/`, old specs → `assignments/old/`), A5 scaffolding created (spec, artifact requirements, templates, issue template, context, contributions table), `lychee.yml` and `roadmap.md` updated, `Process_Requirements.md` and `Repository_Requirements.md` aligned, plus frontend optimisations (sidebar resize, cache-busting, analysis range input, Docker live-reload). See §19 for full details.

### Part 1: Product Backlog & Sprint 4 Planning
- [x] **Refine Product Backlog** — 6 PBIs created from Sprint 3 customer feedback ([#110](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110)–[#115](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/115))
- [x] **Create Sprint 4 PBIs** — 6 PBIs created ([#110](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110)–[#115](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/115)) with AC, SP, implementer, reviewer
- [x] **Create Sprint 4 milestone** — [Sprint 4](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/5) created with Sprint Goal, dates, selected PBIs
- [x] **Update [`docs/roadmap.md`](../../docs/roadmap.md)** — Sprint 4/MVP v2 section with 6 PBIs, Sprint 5 planned, backlog updated

### Part 2: Customer Feedback Response
- [x] **Create/update PBIs for feedback items** — 6 PBIs mapped to Sprint 4 scope ([#110](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110)–[#115](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/115))
- [ ] **Customer feedback response table** in week 5 report

### Part 3: Development Process & Configuration Management
- [x] **Fill [`docs/development-process.md`](../../docs/development-process.md)** — git workflow, Mermaid gitGraph, config management, CI, branches, PRs, secrets (filled on `121-dev-process-docs`)
- [x] **Link from README, hosted docs, week 5 report** — linked from README.md and week 5 report

> **Note on template files:** Architecture, ADR, and report files below were filled incrementally on `121-dev-process-docs` by A. Mindubaev.

### Part 4: Architecture Documentation
- [x] **Fill [`docs/architecture/README.md`](../../docs/architecture/README.md)** — with static, dynamic, deployment view sections (filled on `121-dev-process-docs`)
- [x] **Fill [`docs/architecture/static-view/diagram.puml`](../../docs/architecture/static-view/diagram.puml)** — component diagram (PlantUML), source + rendered SVG
- [x] **Fill [`docs/architecture/dynamic-view/diagram.puml`](../../docs/architecture/dynamic-view/diagram.puml)** — sequence diagram(s), source + rendered SVG
- [x] **Fill [`docs/architecture/deployment-view/diagram.puml`](../../docs/architecture/deployment-view/diagram.puml)** — deployment diagram, source + rendered SVG
- [x] **Comment on coupling, cohesion, maintainability, quality requirements** in static view
- [x] **Explain scenario importance, architecture decisions, quality requirements** in dynamic view
- [x] **Explain deployment model choice, constraints, operations** in deployment view

### Part 5: ADRs (Architecture Decision Records)
- [x] **Fill [`docs/architecture/adr/ADR-001-websocket-migration.md`](../../docs/architecture/adr/ADR-001-websocket-migration.md)** (filled on `121-dev-process-docs`)
- [x] **Fill [`docs/architecture/adr/ADR-002-sqlite-persistence.md`](../../docs/architecture/adr/ADR-002-sqlite-persistence.md)** (filled on `121-dev-process-docs`)
- [x] **Fill [`docs/architecture/adr/ADR-003-microservice-architecture.md`](../../docs/architecture/adr/ADR-003-microservice-architecture.md)** (filled on `121-dev-process-docs`)
- [x] **Each ADR must link to A4/A5 quality requirements**
- [x] **Update [`docs/quality-requirements.md`](../../docs/quality-requirements.md)** — link each QR to relevant ADR
- [x] **Link ADRs from [`docs/architecture/README.md`](../../docs/architecture/README.md)**

### Part 6: Testing, QA, DoD for MVP v2
- [x] **Keep all A4 checks active** — ruff, mypy, pytest+cov, bandit, Lychee all unchanged
- [x] **Extend tests** for MVP v2 scope — WebSocket unit tests (`test_websocket.py`), Database unit tests (`test_database.py`), QRT-004 (`test_websocket_connect.py`), QRT-005 (`test_db_cache.py`), multi-interval tests (15m/1h/4h/1d), analysis range tests (limit param)
- [x] **Update [`docs/testing.md`](../../docs/testing.md)** — added WebSocket/DB test rows, Frontend JS Tests section, multi-interval + analysis range coverage, Database in critical modules, 5 QRTs, Lychee in CI, manual test evidence, CI links, A4-gates-active statement
- [x] **Update [`docs/quality-requirements.md`](../../docs/quality-requirements.md)** — fixed QR-003 threshold (0.80→0.55), added ADR links to all 3 QRs
- [x] **Update [`docs/quality-requirement-tests.md`](../../docs/quality-requirement-tests.md)** — fixed QRT-001 (2s→500ms p95), added QRT-004 (WebSocket) + QRT-005 (DB cache), expanded test-data descriptions
- [x] **Update [`docs/definition-of-done.md`](../../docs/definition-of-done.md)** — Sprint 3→current milestone, Lychee row, Architecture/ADRs section, WebSocket reconnection criterion, frontend JS CI rows, user-story/PBI linking criterion
- [x] **Update DoD** for CI configuration changes — frontend JS jobs added to CI table
- [x] **Frontend JS testing setup** — Vitest + ESLint, sample WebSocket test, CI jobs (`frontend-lint` + `frontend-test`)

### Part 7: Implement, Release, Deploy MVP v2
- [x] **Implement Sprint 4 scope** — 9/9 PBIs completed ([#122](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/122)–[#126](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/126), [#158](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/158), [#159](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/159), [#113](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113), [#110](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110)), 1 moved to Sprint 5 ([#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112))
- [x] **Update [`CHANGELOG.md`](../../CHANGELOG.md)** — Unreleased section populated with all implemented features
- [ ] **Update [`README.md`](../../README.md)** — setup/run/deploy if changed
- [ ] **Deploy MVP v2** — accessible to customer/TA
- [ ] **Create SemVer release** — tag `v2.0.0`, maps to MVP v2, links to Sprint 4 milestone, run instructions, demo video, week 5 report

### Part 8: User Acceptance Tests
- [x] **Add ≥2 new UAT scenarios** for MVP v2 in [`docs/user-acceptance-tests.md`](../../docs/user-acceptance-tests.md) — UAT-006 (WebSocket) and UAT-007 (RSI/Volume) added on `uat-scenarios-prep`
- [x] **Execute with customer** in recorded session — conducted 2026-07-03; results recorded in [`docs/user-acceptance-tests.md`](../../docs/user-acceptance-tests.md)
- [x] **Summarize results** in week 5 report — UAT summary table in [`reports/week5/README.md`](../../reports/week5/README.md) §UAT

### Part 9: Sprint Review
- [x] **Conduct Sprint Review** with customer — conducted 2026-07-03
- [x] **Create reports:**
  - [`reports/week5/sprint-review-summary.md`](../../reports/week5/sprint-review-summary.md) — filled (113 lines)
  - [`reports/week5/sprint-review-transcript.md`](../../reports/week5/sprint-review-transcript.md) — filled (135 lines)

### Part 10: Sprint Retrospective
- [x] **Conduct retrospective** — conducted 2026-07-03
- [x] **Create [`reports/week5/retrospective.md`](../../reports/week5/retrospective.md)** — filled (55 lines)

### Part 11: Hosted Documentation Site — [#154](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/154)
- [ ] **Publish maintained docs** as browsable hosted site — requires GitHub Pages enable
- [ ] **Link from README, week 5 report, SemVer release**

### Part 12: Reflection
- [x] **Create [`reports/week5/reflection.md`](../../reports/week5/reflection.md)** — filled (75 lines)

### Part 13: Public Sanitized Demo Video — [#155](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/155)
- [ ] **Record <2 min demo** of MVP v2
- [ ] **Link from week 5 report and release**

### Part 14: LLM Report
- [x] **Create [`reports/week5/llm-report.md`](../../reports/week5/llm-report.md)** — filled (34 lines)

### Week 5 Report Structure
- [x] **Fill [`reports/week5/README.md`](../../reports/week5/README.md)** — filled (298 lines) by F. Kozhevnikov
- [x] **Fill [`reports/week5/sprint-review-summary.md`](../../reports/week5/sprint-review-summary.md)** — filled by F. Kozhevnikov
- [x] **Fill [`reports/week5/sprint-review-transcript.md`](../../reports/week5/sprint-review-transcript.md)** — filled by F. Kozhevnikov
- [x] **Fill [`reports/week5/retrospective.md`](../../reports/week5/retrospective.md)** — filled by F. Kozhevnikov
- [x] **Fill [`reports/week5/reflection.md`](../../reports/week5/reflection.md)** — filled by F. Kozhevnikov
- [x] **Fill [`reports/week5/llm-report.md`](../../reports/week5/llm-report.md)** — filled by F. Kozhevnikov
- [x] **Create [`reports/week5/images/`](../../reports/week5/images/)** — 5 screenshots present; hosted docs screenshot pending ([#154](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/154))

### Week 5 Planning Artifacts (Course Tasks)
- [x] **Create [`assignments/5/2-plan.md`](2-plan.md)** — structured guide + checklist for Parts 3–5
- [x] **Create [`assignments/5/3-plan.md`](3-plan.md)** — structured guide + checklist for Part 6
- [x] **Create [`assignments/5/5-plan.md`](5-plan.md)** — structured guide + checklist for Part 8
- [x] **Create [`assignments/5/6-plan.md`](6-plan.md)** — structured guide + checklist for Parts 9–13
- [x] **Create [`assignments/5/7-plan.md`](7-plan.md)** — structured guide + checklist for Moodle PDF submission

### Moodle PDF (Private) — [#156](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/156)
- [ ] **Create PDF** with team table, commit permalinks, recording links, private access instructions

---

## 15. Key Links Index

### Repository
| Resource | Link |
|---|---|
| Repository | https://github.com/Fedos113/SWP_TickFrame_28_team |
| Issues | https://github.com/Fedos113/SWP_TickFrame_28_team/issues |
| Projects Board | https://github.com/users/Fedos113/projects/1/views/1 |
| Pull Requests | https://github.com/Fedos113/SWP_TickFrame_28_team/pulls |
| Releases | https://github.com/Fedos113/SWP_TickFrame_28_team/releases |
| Actions (CI) | https://github.com/Fedos113/SWP_TickFrame_28_team/actions |
| Latest CI Run | https://github.com/Fedos113/SWP_TickFrame_28_team/actions/runs/28297395875 |

### Milestones
| Milestone | Link |
|---|---|
| Sprint 1 | https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/1 |
| Sprint 2 (MVP v1) | https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/2 |
| Sprint 3 (A4) | https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/3 |
| Sprint 4 | https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/5 |
| v2.0.0 (MVP v2) | Not yet created |

### Sprint 4 PBIs
#### Completed
| PBI | Issue | Title | SP | Priority |
|---|---|---|---|---|
| PBI-121 | [#122](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/122) | Multi-interval database caching & instant chart loading | 3 | Critical |
| PBI-122 | [#123](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/123) | Configurable candle analysis limit | 1 | Medium |
| PBI-123 | [#124](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/124) | ML pattern visualization with merged segments | 2 | High |
| PBI-124 | [#125](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/125) | ML inference performance optimization (XGBoost) | 5 | Critical |
| PBI-125 | [#126](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/126) | UI cleanup & sidebar resize | 2 | Medium |
| PBI-126 | [#158](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/158) | UI redesign — coin icons, Fear & Greed Index, sidebar overhaul | 3 | Medium |
| PBI-127 | [#159](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/159) | Drawing toolbar re-architecture with lightweight-charts-drawing library | 5 | High |
| PBI-118 | [#113](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113) | Volume sub-chart implementation | 3 | High |
| PBI-115 | [#110](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110) | WebSocket subscription migration | 5 | Critical |

#### Moved to Sprint 5
| PBI | Issue | Title | SP | Priority |
|---|---|---|---|---|
| PBI-117 | [#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112) | RSI indicator sub-chart | 3 | High |

#### Superseded (folded into PBI-121/PBI-122)
| PBI | Issue | Title | Superseded By |
|---|---|---|---|
| ~~PBI-116~~ | ~~[#111](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/111)~~ | ~~SQLite candle caching~~ | PBI-121 |
| ~~PBI-119~~ | ~~[#114](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/114)~~ | ~~Reduce analysis range to 50k~~ | PBI-122 |
| ~~PBI-120~~ | ~~[#115](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/115)~~ | ~~Multi-interval support~~ | PBI-121 |

### Maintained Docs
| Document | Path |
|---|---|
| Roadmap | [`docs/roadmap.md`](../../docs/roadmap.md) |
| Definition of Done | [`docs/definition-of-done.md`](../../docs/definition-of-done.md) |
| Quality Requirements | [`docs/quality-requirements.md`](../../docs/quality-requirements.md) |
| Quality Requirement Tests | [`docs/quality-requirement-tests.md`](../../docs/quality-requirement-tests.md) |
| Testing Strategy | [`docs/testing.md`](../../docs/testing.md) |
| User Acceptance Tests | [`docs/user-acceptance-tests.md`](../../docs/user-acceptance-tests.md) |
| User Stories | [`docs/user-stories.md`](../../docs/user-stories.md) |
| Product Backlog | [`docs/backlog.md`](../../docs/backlog.md) |
| Interface Spec | [`docs/interface.md`](../../docs/interface.md) |
| Changelog | [`CHANGELOG.md`](../../CHANGELOG.md) |
| README | [`README.md`](../../README.md) |

### Reports
| Week | Link |
|---|---|
| Week 2 | [`reports/week2/README.md`](../../reports/week2/README.md) |
| Week 3 | [`reports/week3/README.md`](../../reports/week3/README.md) |
| Week 4 | [`reports/week4/README.md`](../../reports/week4/README.md) |

### Assignment Specs
| Document | Path |
|---|---|
| Assignment 05 | [`assignments/5/Assignment_05.md`](Assignment_05.md) |
| Artifact Requirements | [`assignments/5/Artifact_Requirements.md`](Artifact_Requirements.md) |
| Process Requirements | [`assignments/Process_Requirements.md`](../Process_Requirements.md) |
| Repository Requirements | [`assignments/Repository_Requirements.md`](../Repository_Requirements.md) |
| Week 5 Issue Template | [`assignments/5/issue_template.md`](issue_template.md) |
| Week 5 Contributions Table | [`assignments/5/contributions.md`](contributions.md) |

### CI Configuration
| File | Path |
|---|---|
| CI Workflow | [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) |
| Lychee Workflow | [`.github/workflows/lychee.yml`](../../.github/workflows/lychee.yml) |

### Deployment
| Resource | Path |
|---|---|
| Docker Compose | [`docker-compose.yml`](../../docker-compose.yml) |
| Dockerfile | [`Dockerfile`](../../Dockerfile) |
| ML Dockerfile | [`ml_service/Dockerfile`](../../ml_service/Dockerfile) |
| .env Example | [`.env.example`](../../.env.example) |

### Releases
| Release | Link |
|---|---|
| v1.1.0 (Sprint 3) | https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/v1.1.0 |
| v2.0.0 (MVP v2) | Not yet created |

### Previous Week 4 Demo
| Asset | Link |
|---|---|
| Public Demo Video | https://drive.google.com/file/d/1rOMHjHUejfUPj9k4ELTZhTgCUSINawqf/view |

---

## 16. Repository Configuration Notes

- **Default branch:** `main` (protected, direct pushes disabled)
- **Branch naming:** `<issue-number>-short-description`
- **PR workflow:** Branch → PR → review → merge commit (no squash/rebase)
- **PR template:** In [`.github/pull_request_template.md`](../../.github/pull_request_template.md) — prompts for summary, testing, changelog checkbox
- **Issue templates:** In [`.github/ISSUE_TEMPLATE/`](../../.github/ISSUE_TEMPLATE/) — User Story, Other PBI, Bug Report, Course Task
- **SemVer:** Tags prefixed with `v` (e.g., `v1.1.0`)
- **Secrets:** `.env` in .gitignore, `.env.example` committed
- **Git LFS:** Not used
- **Lychee exclusions:** `http://` (all non-HTTPS), Google Drive, gitlab.pg.innopolis.university, file://, assignments/ directory

---

## 17. Known Gaps & Risks for Assignment 5

### Critical Gaps (Must Address for A5)

1. **Architecture documentation files** — **filled** on `121-dev-process-docs`: `docs/architecture/README.md` + 3 views with `.puml` and `.svg` ([#140](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/140)).
2. **ADR files** — **filled** on `121-dev-process-docs`: 3 ADRs in `docs/architecture/adr/` linking to quality requirements ([#141](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/141)).
3. **Development-process template** — **filled** on `121-dev-process-docs`: `docs/development-process.md` with Mermaid gitGraph, board config, CI ([#139](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/139)).
4. **Sprint 4 milestone** — [created](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/5) with 10 PBIs assigned (9 completed, 1 moved to Sprint 5).
5. **Sprint 4 PBIs** — 9 completed (all Sprint 4 scope), PBI-117 [#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112) moved to Sprint 5.
6. **Week 5 report files exist as empty templates** — `reports/week5/README.md` and 6 sub-reports need content.
7. **No hosted documentation site** — required starting in Assignment 5.
8. **No MVP v2 release** — needs a new SemVer release mapping to Sprint 4 + MVP v2.
9. **No LLM chat logs** — required for Part 14.
10. **No public demo video** — required for Part 13.

### Technical Risks
1. **QR-003** — threshold corrected to 0.55; QRTs aligned on `part-6-testing-qa`.
3. **Frontend JS coverage** — basic Vitest coverage added; chart rendering and DOM interaction still untested.
4. **RSI indicator** — moved to Sprint 5 due to rendering complexity with current charting library.
5. **Timeframe switch UI glitches** — switching intervals shows visual glitches, needs polish.

### Process Risks
1. **Previous milestones left "Open"** — Sprint 1, 2, 3 milestones still in `open` state (should they be closed?).
2. **Work branches must be created from main** — each team member uses their own feature branch.

---

## 18. Assignment 05 TL;DR Summary

**Goal:** Deliver **MVP v2** via Sprint 4, with strong architecture reasoning, maintainable development process documentation, configuration management, ADRs, hosted docs, and customer feedback response.

**Key deliverables:**
1. Sprint 4 planned & executed (PBIs, milestone, implementation)
2. Architecture docs (`docs/architecture/`) with 3 views (static/dynamic/deployment) as diagrams-as-code
3. ≥3 ADRs linking to quality requirements
4. `docs/development-process.md` with Mermaid gitGraph
5. Hosted documentation site
6. UAT with ≥2 new scenarios for MVP v2
7. Sprint Review, Retrospective, Reflection, LLM report
8. SemVer release `v2.0.0` for MVP v2
9. Week 5 public report with all required links & screenshots
10. Public sanitized demo video (<2 min)

---

*Last updated: 2026-07-05*
*Generated by: OpenCode (deepseek-v4-flash-free)*
*Branch analysis updated: 2026-07-05*

---

## 19. Current Branch Contributions (`MVPv2`)

The current branch is **`MVPv2`** (merged `part-1-2` via PR #121 + additional feature commit). All contributions by **F. Kozhevnikov ([Fedos113](https://github.com/Fedos113))**.

### Part 1-2 Contributions (merged from `part-1-2` branch)

#### Repository Reorganization
| Change | Details |
|---|---|
| Moved `additional files/*` → `assignments/4/` | Consolidated A4 artifacts into the proper directory |
| Moved `assignments/assignment2.tex`, `assignment3.tex`, `mvp_v0-plan.md` → `assignments/old/` | Archived old assignment specs to keep root clean |
| Updated `assignments/Process_Requirements.md` | Reflected reorganized repo layout |
| Updated `assignments/Repository_Requirements.md` | Reflected reorganized repo layout |

#### Assignment 5 Scaffolding
| File | Lines | Purpose |
|---|---|---|
| `assignments/5/Assignment_05.md` | 508 | Main assignment specification |
| `assignments/5/Artifact_Requirements.md` | 754 | Shared artifact semantics |
| `assignments/5/breakdown.md` | 86 | Part-by-part checklist |
| `assignments/5/context.md` | 607 | This file — comprehensive context |
| `assignments/5/issue_template.md` | 92 | Week 5 issue template |
| `assignments/5/contributions.md` | 11 | Contribution tracking table |

#### CI & Roadmap Updates
| File | Change | Reason |
|---|---|---|
| `.github/workflows/lychee.yml` | Added `--exclude 'http://'`, removed redundant per-host excludes | Catch all non-HTTPS links uniformly |
| `docs/roadmap.md` | Updated Sprint 4/MVP v2 section | Reflects current assignment scope |

### Feature Commit (`e96de58` — "feat: optimizations and ML persistance")

Additional commit on `MVPv2` beyond the `part-1-2` merge (not present on `main`):

| File | Lines Changed | Description |
|---|---|---|
| `tickframe/frontend/js/charts.js` | +183/-57 | Sidebar resize system (event delegation, localStorage persistence), configurable candle-limit input for analysis, smarter pattern rendering (merged segments, 50-candle windows, `_visibleBottomPrice()`, `_drawPatternVline()`), whitespace fixes |
| `tickframe/frontend/index.html` | +37/-26 | Removed search input from sidebar, added sidebar resize handle, candle-limit input in analysis panel, cache-busting query params (`?v=1`) on CSS/JS, removed toolbar status bar |
| `tickframe/frontend/css/styles.css` | +19/-8 | Sidebar resize handle styles, `.sidebar` flex constraints (min/max-width), `.content`/`.chart-container` flex layout, candle-limit-input styling, responsive media query fix |
| `tickframe/frontend/js/drawing-overlay.js` | +16/-14 | Font settings conditional on text type, fixed text tool 1-point commit logic |
| `docker-compose.yml` | +6 | Live-reload volume mounts for frontend/backend, `--reload` flag for dev |

**Summary:** UX improvements (sidebar resize, cache-busting, analysis range customisation) and Docker dev ergonomics. These changes implement PBI-122 (configurable analysis limit), PBI-123 (pattern visualization), PBI-125 (UI cleanup & sidebar resize), and contribute to PBI-121 (multi-interval caching via timeframe switching UI).

### PBI Implementation Status on `MVPv2`

| PBI | Issue | Title | SP | Priority | Status |
|-----|-------|-------|----|----------|--------|
| PBI-121 | [#122](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/122) | Multi-interval database caching & instant chart loading | 3 | Critical | ✅ Done — warmup covers 5 intervals, 3-tier cache, near-instant switch |
| PBI-122 | [#123](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/123) | Configurable candle analysis limit | 1 | Medium | ✅ Done — input field (100–500000) next to ANALYZE button |
| PBI-123 | [#124](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/124) | ML pattern visualization with merged segments | 2 | High | ✅ Done — merged segments, dotted vlines, no labels yet |
| PBI-124 | [#125](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/125) | ML inference performance optimization (XGBoost) | 5 | Critical | ✅ Done — <0.5s per 1k candles (was >10s) |
| PBI-125 | [#126](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/126) | UI cleanup & sidebar resize | 2 | Medium | ✅ Done — search/status removed, draggable sidebar, cache-busting |
| PBI-126 | [#158](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/158) | UI redesign — coin icons, Fear & Greed Index, sidebar overhaul | 3 | Medium | ✅ Done — CoinGecko icons, F&G widget, redesign |
| PBI-127 | [#159](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/159) | Drawing toolbar re-architecture with lightweight-charts-drawing library | 5 | High | ✅ Done — modular drawing system, 7 new JS modules |
| PBI-118 | [#113](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113) | Volume sub-chart implementation | 3 | High | ✅ Done — volume pane with SMA overlay |
| PBI-115 | [#110](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110) | WebSocket subscription migration | 5 | Critical | ✅ Done — live candles from Bybit/Binance via WebSocket |
| PBI-117 | [#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112) | RSI indicator sub-chart | 3 | High | ➡️ Moved to Sprint 5 |

### MVPv2 Readiness Assessment

| Criterion | Status | Notes |
|---|---|---|
| Sprint 4 PBIs implemented | ✅ 9/9 (29 SP) completed, 1 moved to Sprint 5 | Full feature set: DB caching, configurable analysis, ML viz, ML perf, UI redesign, drawing overhaul, volume chart, WebSocket live candles |
| Architecture docs filled | ✅ Filled | 3 PlantUML views + SVGs, dev-process.md with gitGraph |
| ADRs filled | ✅ Filled | 3 ADRs (WebSocket, SQLite, microservice) linking to QRs |
| dev-process.md filled | ✅ Filled | Mermaid gitGraph, board config, CI, quality gates |
| CHANGELOG updated | ✅ Updated | Unreleased section with all new features |
| Week 5 reports filled | ✅ Partially filled | Reports filled by F. Kozhevnikov, A. Gafarov, A. Mindubaev |
| UAT scenarios added | ✅ Done | 7 UAT scenarios executed with customer (2026-07-03) |
| SemVer release v2.0.0 | ❌ Not created | No tag exists |
| Hosted documentation | ❌ Not published | Required in A5 |
| Demo video | ❌ Not recorded | Required for Part 13 |
| LLM report | ✅ Created | Filled (34 lines) |
| CI pipeline | ✅ Passing | All checks pass on main |

### Impact on A5 Gap Analysis
- Part 1 (Backlog & Sprint 4): **fully addressed** — all checkboxes marked [x]
- Part 2 (Customer Feedback): PBIs created on GitHub, 6/6 feedback items implemented (WebSocket → PBI-115, DB caching → PBI-121, analysis range → PBI-122, multi-interval → PBI-121, Volume → PBI-118, UI → PBI-126), RSI moved to Sprint 5
- Parts 3–5 (Dev Process, Architecture, ADRs): **fully addressed** — all docs filled on `121-dev-process-docs`
- Part 7 (Implementation): **9/9 PBIs completed (29 SP)**, 1 moved to Sprint 5
- Parts 6, 8–14 (Testing, UAT, Reports, Release, Demo): **mostly addressed** — testing/QA docs filled, UAT executed, reports partially filled

### Branch History (unique commits not in `main`)
```
b48adf4 Merge pull request #121 from Fedos113/part-1-2
e96de58 feat: optimizations and ML persistance
fe04c5e DOC: assignment parts 1 and 2 completed ; created repo template
71302b3 DOC: week 5 preparation files added
89f6eb1 DOC: week 5 preparation files added
7c30c4f DOC: week 5 preparation files added
c744990 DOC: week 5 preparation files added
```

### Notes for Team
- The `MVPv2` branch contains **all 9 completed Sprint 4 PBIs** (PBI-121 through PBI-127 + PBI-118 + PBI-115). RSI (PBI-117) moved to Sprint 5.
- The drawing toolbar has been completely re-architected using `lightweight-charts-drawing` library. Run `npm install && npm run build` after checkout.
- UI now includes coin icons (CoinGecko), Fear & Greed Index, redesigned sidebar, and modernized CSS.
- Three new Python services: `coin_icons.py` (CoinGecko API), `fng_client.py` (alternative.me API), and enhanced `database.py`.
- Architecture docs, ADRs, and reports have been filled incrementally by multiple team members.

---

## 20. Current Branch Contributions (`week5-planning`)

Branch `week5-planning` contains the following planning artifacts created to guide the team in executing remaining Week 5 deliverables:

| File | Target Parts | What it provides |
|---|---|---|
| [`assignments/5/2-plan.md`](2-plan.md) | Parts 3–5 | Full guide + checklist for dev-process doc, architecture diagrams, and 3 ADRs |
| [`assignments/5/3-plan.md`](3-plan.md) | Part 6 | Full guide + checklist for extending testing, QA docs, QRTs, and DoD |
| [`assignments/5/5-plan.md`](5-plan.md) | Part 8 | Full guide + checklist for UAT scenarios (UAT-006, UAT-007), execution, and reporting |
| [`assignments/5/6-plan.md`](6-plan.md) | Parts 9–13 | Full guide + checklist for Sprint Review, retrospective, hosted docs, reflection, demo video |
| [`assignments/5/7-plan.md`](7-plan.md) | Moodle PDF | Full guide + checklist for the private Moodle submission wrapper (copy from A4 `.tex` template) |

### Impact on A5 Gap Analysis
- Parts 3–5: **plan exists** at `2-plan.md` — team should execute it
- Part 6: **plan exists** at `3-plan.md` — team should execute it
- Part 8: **plan exists** at `5-plan.md` — team should execute it
- Parts 9–13: **plan exists** at `6-plan.md` — team should execute it
- Moodle PDF: **plan exists** at `7-plan.md` — team should execute it

---

## 21. Current Branch Contributions (`uat-scenarios-prep`)

Branch `uat-scenarios-prep` contains UAT documentation updates for Sprint 4 / MVP v2 by **A. Gafarov ([omarichev](https://github.com/omarichev))**, advancing Part 8 (User Acceptance Tests) of Assignment 5:

### UAT Document Updates

| Change | Details |
|---|---|
| Added **UAT-006** | WebSocket real-time candle updates scenario, linked to PBI-115 and US-01 |
| Added **UAT-007** | RSI and Volume sub-charts scenario, linked to PBI-117, PBI-118, US-10, US-11 |
| Updated **UAT-002** | Revised preconditions, test steps, and expected results for Sprint 4 multi-interval support (PBI-120) |
| Updated **UAT-004** | Refined expected result to mention WebSocket-based real-time updates |
| Fixed **UAT Execution Log** | Corrected table column count, added planned retest entries for UAT-002/006/007 |
| Updated **document header** | Changed from "Template" to "Maintained product asset" with Sprint 4 note |

### Impact on A5 Gap Analysis

- Part 8 (UAT): **scenarios prepared** — UAT-006 and UAT-007 exist as required; UAT-002 updated for Sprint 4. Execution and result summary in week 5 report remain as follow-up.

### Files Changed

| File | Change |
|---|---|
| `docs/user-acceptance-tests.md` | +47 / -12 lines across 2 commits |

### Notes for Team

- UAT scenarios are ready for **customer execution** during the Sprint 4 recorded session.
- After execution, update the `Execution result`, `Execution history`, and `UAT Execution Log` sections with actual results and customer comments.
- Summarize UAT outcomes in `reports/week5/README.md` (item 30 in the 42-item structure).
## 22. Current Branch Contributions (`121-dev-process-docs`)

Branch `121-dev-process-docs` contains the following contributions by **A. Mindubaev ([pug228](https://github.com/pug228))** advancing Week 5 deliverables:

### Part 3: Development Process & Configuration Management
| File | Change | Details |
|---|---|---|
| `docs/development-process.md` | Created (312 lines) | git workflow with Mermaid gitGraph, board config with 6 workflow states, git/review workflow, config/secrets, dev environment, CI pipeline, quality gates |

### Part 4: Architecture Documentation
| File | Change | Details |
|---|---|---|
| `docs/architecture/README.md` | Created (165 lines) | Architecture index with static/dynamic/deployment view sections, ADR index, QR mapping |
| `docs/architecture/static-view/diagram.puml` | Created | PlantUML component diagram — 4 internal + 3 external components |
| `docs/architecture/static-view/diagram.svg` | Created | Rendered SVG of component diagram |
| `docs/architecture/dynamic-view/diagram.puml` | Created | PlantUML sequence diagram — chart loading + pattern analysis flow |
| `docs/architecture/dynamic-view/diagram.svg` | Created | Rendered SVG of sequence diagram |
| `docs/architecture/deployment-view/diagram.puml` | Created | PlantUML deployment diagram — Docker host, containers, client |
| `docs/architecture/deployment-view/diagram.svg` | Created | Rendered SVG of deployment diagram |

### Part 5: ADRs
| File | Change | Details |
|---|---|---|
| `docs/architecture/adr/ADR-001-websocket-migration.md` | Created (28 lines) | WebSocket migration decision, links to QR-001, QR-002 |
| `docs/architecture/adr/ADR-002-sqlite-persistence.md` | Created (36 lines) | SQLite 3-tier cache decision, links to QR-001, QR-003 |
| `docs/architecture/adr/ADR-003-microservice-architecture.md` | Created (40 lines) | ML microservice isolation decision, links to QR-001, QR-002, QR-003 |

### Maintained Docs Updates
| File | Change |
|---|---|
| `docs/quality-requirements.md` | Added "Related ADRs" row to QR-001, QR-002, QR-003 |
| `docs/definition-of-done.md` | Fixed stale Sprint 3 reference, added architecture/ADR criteria, added Lychee to CI table |
| `README.md` | Added dev-process link to Documentation & Reports table |
| `reports/week5/README.md` | Filled items 18–21 with links to dev-process, architecture, ADRs |

### Audit Fixes
| Fix | Description |
|---|---|
| Lychee exclusions | Added missing exclude patterns to dev-process.md |
| To Do/Done wording | Aligned with Process_Requirements.md |
| Week 5 report numbering | Fixed item numbering (grouped 3 views under single item 20) |
| Trailing newline | Added to README.md |
| Hosted docs gap | Acknowledged in week 5 report |

### Impact on A5 Gap Analysis
- Part 3 (Dev Process): **fully addressed** — `docs/development-process.md` filled and linked
- Part 4 (Architecture): **fully addressed** — all 3 views created with source + rendered forms
- Part 5 (ADRs): **fully addressed** — 3 ADRs created, linked from QRs and architecture README
- Part 6 (Testing/QA/DoD): **partially addressed** — DoD updated for A5 architecture requirements
- Week 5 Report: **partially addressed** — items 18–21 filled

## 23. Current Branch Contributions (`part-6-testing-qa`)

Branch `part-6-testing-qa` contains the following contributions advancing **Part 6 (Testing, QA, DoD for MVP v2)**:

### Test Files
| File | Type | What it adds |
|---|---|---|
| `tests/requirements/test_performance.py` | QRT-001 fix | Changed threshold 2s → 500ms p95, added candles endpoint, 10-request p95 measurement |
| `tests/requirements/test_websocket_connect.py` | QRT-004 (new) | WebSocket connection reliability test |
| `tests/requirements/test_db_cache.py` | QRT-005 (new) | Database cache round-trip test |
| `tests/unit/test_websocket.py` | Unit tests (new) | SocketHub: connect, disconnect, broadcast, fan-out, error handling (8 tests) |
| `tests/unit/test_database.py` | Unit tests (new) | DatabaseService: settings, drawings, candles, cache miss, count, range (14 tests) |
| `tests/unit/test_detection.py` | Extended | Added `test_analyze_within_range`, `test_analyze_exceeds_range` |
| `tests/unit/test_bybit_client.py` | Extended | Added `test_fetch_candles_15m`, `_1h`, `_4h`, `_1d` |

### Source Changes
| File | Change |
|---|---|
| `tickframe/detection/mock.py` | Added `limit` parameter to `analyze()` function |
| `tickframe/frontend/package.json` | New — Vitest + ESLint dev dependencies |
| `tickframe/frontend/eslint.config.js` | New — ESLint flat config |
| `tickframe/frontend/js/tests/websocket.test.js` | New — parseJson + getWsBase tests |

### CI Changes
| File | Change |
|---|---|
| `.github/workflows/ci.yml` | Added `frontend-lint` (ESLint) and `frontend-test` (Vitest) jobs |

### Documentation Updates
| File | Key changes |
|---|---|
| `docs/testing.md` | WebSocket/DB test rows, Frontend JS Tests section, multi-interval + analysis range, Database in critical modules, 5 QRTs, Lychee in CI, manual test evidence, CI links, A4-gates-active statement |
| `docs/quality-requirements.md` | QR-003 threshold fix (0.80→0.55), ADR links added to all 3 QRs |
| `docs/quality-requirement-tests.md` | QRT-001 fixed (2s→500ms p95), QRT-004 + QRT-005 added, test-data expanded |
| `docs/definition-of-done.md` | Sprint 3→current milestone, Lychee row, Architecture/ADRs section, WebSocket reconnection criterion, frontend JS CI rows, user-story/PBI linking |
| `assignments/5/context.md` | Updated Part 6 gap analysis (all [x]), testing status, QR-003 status, DoD summary, technical risks |

### Impact on A5 Gap Analysis
- Part 6 (Testing, QA, DoD): **fully addressed** on this branch
- Frontend JS testing: **basic coverage added** — CI integration + Vitest sample tests

### Related Issues
| Issue | Title |
|---|---|
| [#139](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/139) | DOC: Fill development-process.md with git workflow, board config, and CI (Part 3) |
| [#140](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/140) | DOC: Create architecture documentation with 3 views and rendered diagrams (Part 4) |
| [#141](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/141) | DOC: Create 3 ADRs for WebSocket, SQLite, and microservice decisions (Part 5) |
| [#144](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/144) | DOC: Update testing, QA, and DoD documentation for MVP v2 (Part 6) |
| [#145](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/145) | TST: Add WebSocket and Database unit tests and QRT-004/QRT-005 for Sprint 4 modules |
| [#146](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/146) | TST: Extend existing tests for multi-interval, analysis range, and fix performance QRT threshold |
| [#147](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/147) | CI: Add frontend JavaScript testing pipeline with Vitest and ESLint |

### Notes for Team
- This branch fills Parts 3–5 but implements **no** Sprint 4 PBI features (WebSocket migration, DB caching, sub-charts, multi-interval) — those go in separate feature branches branched from `main`.
- The week 5 report is partially filled (items 18–21). Other team members must fill remaining items (1–17, 22–42).

## 24. Current Branch Contributions (`uat-after-session-update` — UAT execution updates)

Branch `uat-after-session-update` contains UAT documentation updates advancing **Part 8 (User Acceptance Tests)** of Assignment 5 by **A. Gafarov ([omarichev](https://github.com/omarichev))**, based on the Sprint 4 UAT session conducted 2026-07-03 with customer.

### UAT Document Updates

| Change | Details |
|---|---|
| `docs/user-acceptance-tests.md` | Updated all 7 UAT scenarios with Sprint 4 execution results, customer comments, and new feature requests discovered during the session |

### UAT Results Summary

| UAT | Result | Key Findings |
|---|---|---|
| UAT-001 | ⏳ Partial | ML reports display descriptions + confidence scores (~57%). Pattern filtering requested as new feature. |
| UAT-002 | ⏳ Partial | Timeframe switching (5m/15m/1h/4h/1d) works. UI glitches when switching — needs polish. |
| UAT-004 | ✅ Pass | WebSocket live prices confirmed. 24h change icon added. Customer suggested more coin metrics. |
| UAT-005 | ✅ Pass | Still passing; no Sprint 4 changes. |
| UAT-006 | ✅ Pass | WebSocket live candles from Bybit/Binance. DB cache for historical data. |
| UAT-007 | ⏳ Partial | Volume sub-chart works. **RSI not working** — customer insists it's critical. |

### New Feature Requests Captured from Session

| Request | Source | Priority |
|---|---|---|
| Pattern-type filtering + confidence threshold controls | Customer | High |
| Additional coin metrics in sidebar (24h change, 5m change) | Customer | Low (if time permits) |
| RSI implementation via specialized library | Technical decision (rendering issue) | Critical |

### Impact on A5 Gap Analysis

- Part 8 (UAT): **fully addressed** — all 7 UAT scenarios executed with customer, results recorded, new feature requests captured
- Part 8 execution log: **updated** with Sprint 4 rows and customer comments

### Related Issues

| Issue | Title |
|---|---|
| [#152](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/152) | DOC: Update UAT scenarios with Sprint 4 execution results (Part 8) |

---

## 25. Current Branch Contributions (`MVPv2` — New UI & Drawing Overhaul)

The current branch **`MVPv2`** has been updated with additional contributions beyond the earlier `part-1-2` merge and feature commits. These represent the next wave of Sprint 4 implementation work. All contributions by **F. Kozhevnikov ([Fedos113](https://github.com/Fedos113))**.

### Contribution Summary

| # | Contribution | Type | Status |
|---|-------------|------|--------|
| 1 | **UI design updated** — Major frontend redesign with coin icons (CoinGecko), Fear & Greed Index widget, sidebar overhaul (badge icons, ticker, name, stats columns), Lucide icons integration, CSS refactoring (removed legacy left-toolbar styles, modernized theme system) | Enhancement | ✅ Done |
| 2 | **Drawing toolbar UI updated** — Complete re-architecture from monolithic inline HTML toolbar to modular JavaScript drawing system (7 new JS modules: `drawing-controller.js`, `drawing-events.js`, `drawing-state.js`, `drawing-settings.js`, `drawing-toolbar.js`, `drawing-properties.js`, `drawing-bundle.js`). New CSS files (`drawing-toolbar.css`, `drawing-properties.css`). Old `toolbar.js` removed. Toolbar moved to right side of chart. | Enhancement | ✅ Done |
| 3 | **Drawing toolbar expanded — external open-source library** — Integrated `lightweight-charts-drawing` (^0.1.1) npm package for advanced drawing capabilities. Upgraded `lightweight-charts` from v4 to v5.2.0. Added `esbuild` bundler, `package.json` with build scripts. | Enhancement | ✅ Done |
| 4 | **Volume chart** — Volume sub-chart below main chart using dedicated Lightweight Charts pane. `volumeSeries` and `volumeSmaSeries` variables. SMA calculation for volume overlay. Pane height ratios configurable. | Enhancement | ✅ Done |
| 5 | **Timeframes switching** — Working interval selector buttons (5m, 15m, 1h, 4h, 1d) with chart reload and WebSocket restart per interval. | Enhancement | ✅ Done |
| 6 | **ML output rendered properly** — Pattern drawings and markers rendered on chart using `patternDrawings` array. Merged segment visualization with dotted boundary lines. | Enhancement | ✅ Done |
| 7 | **DB, caching and WebSocket implemented** — 3-tier cache (memory → SQLite → exchange), multi-interval warmup, WebSocket streaming with heartbeats, SQLite persistence for drawings/settings/candles. | Enhancement | ✅ Done |
| 8 | **RSI moved to Sprint 5** — RSI indicator sub-chart deferred to next Sprint due to rendering complexity with current library. Issue [#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112) moved to backlog. | Decision | ✅ Done |

### Key Files Changed

| File | Change Description |
|---|---|
| `tickframe/frontend/index.html` | New CSS/JS includes (drawing-toolbar.css, drawing-properties.css, drawing-bundle.js, drawing modules), removed left-toolbar HTML, added FNG container, moved drawing toolbar position |
| `tickframe/frontend/css/styles.css` | Major refactor: removed all left-toolbar styles, added watchlist redesign (badge, ticker, stats), FNG container, coin hover states, streamlined layout |
| `tickframe/frontend/css/drawing-toolbar.css` | New — modular drawing toolbar CSS |
| `tickframe/frontend/css/drawing-properties.css` | New — drawing properties panel CSS |
| `tickframe/frontend/js/drawing-bundle.js` | New — bundled drawing library (esbuild) |
| `tickframe/frontend/js/drawing-controller.js` | New — drawing operations controller |
| `tickframe/frontend/js/drawing-events.js` | New — drawing event handlers |
| `tickframe/frontend/js/drawing-state.js` | New — drawing state management |
| `tickframe/frontend/js/drawing-settings.js` | New — drawing settings panel |
| `tickframe/frontend/js/drawing-toolbar.js` | New — drawing toolbar interface |
| `tickframe/frontend/js/drawing-properties.js` | New — per-drawing properties UI |
| `tickframe/frontend/js/drawing-overlay-src.js` | New — source for esbuild bundle, wraps lightweight-charts-drawing |
| `tickframe/frontend/js/charts.js` | Volume series (volumeSeries, volumeSmaSeries), indicator pane ratios, SMA calculator, price format auto-adjustment, pattern drawings array, future candles constant |
| `tickframe/frontend/js/sidebar.js` | Coin icons, FNG display, redesigned coin rows (badge→img, ticker, name, change%) |
| `tickframe/backend/services/coin_icons.py` | New — CoinGecko icon fetcher with 1h TTL cache, 10 coin mappings |
| `tickframe/backend/services/fng_client.py` | New — Fear & Greed Index fetcher from alternative.me API, 6h TTL cache |
| `tickframe/backend/api/endpoints.py` | FNG endpoint, coin icons endpoint, dynamic price precision |
| `tickframe/backend/api/websocket.py` | Connection management refinements |
| `tickframe/backend/services/database.py` | Enhanced caching and data access |
| `package.json` | New — npm deps: lightweight-charts-drawing, esbuild, build scripts |
| `package-lock.json` | New — lockfile |
| `docker-compose.yml` | Dependency updates |
| `Dockerfile` | npm install steps for frontend build |

### New Dependencies

| Package | Version | Purpose |
|---|---|---|
| `lightweight-charts-drawing` | ^0.1.1 | External drawing library for advanced chart annotations |
| `lightweight-charts` | ^5.2.0 | Upgraded from v4 — charting library |
| `esbuild` | ^0.24.0 | JavaScript bundler for drawing module |
| `lucide` | latest | SVG icon library for UI elements |

### Updated Issues

| Issue | Action | Details |
|---|---|---|
| [#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112) PBI-117 | Moved to Sprint 5 (Backlog) | RSI sub-chart deferred — rendering complexity with current charting library |
| [#158](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/158) PBI-126 | New | UI redesign — coin icons, Fear & Greed Index, sidebar overhaul |
| [#159](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/159) PBI-127 | New | Drawing toolbar re-architecture with lightweight-charts-drawing library |
| [#113](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113) PBI-118 | Updated | Volume sub-chart implemented (was pending) |

### Branch History (unique commits not in `main` — cumulative)
```
2db74bc MVPv2 ready
2b95227 DOC: documented current MVPv2 completion
fe9d744 DOC: documented current MVPv2 completion
b48adf4 Merge pull request #121 from Fedos113/part-1-2
e96de58 feat: optimizations and ML persistance
fe04c5e DOC: assignment parts 1 and 2 completed ; created repo template
...
```

### Notes for Team
- This branch now contains the full MVP v2 feature set: DB caching, multi-interval, configurable analysis, ML optimization, **UI redesign** (coin icons, F&G, sidebar overhaul), **drawing toolbar re-architecture** (modular with lightweight-charts-drawing library), **volume sub-chart**, **timeframe switching**, and WebSocket streaming.
- The only item deferred is **RSI indicator** ([#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112)) — moved to Sprint 5 due to rendering complexity.
- The `package.json` introduces a new `npm run build:drawings` script that bundles `drawing-overlay-src.js` → `drawing-bundle.js` via esbuild. Run `npm install && npm run build` after checkout.
