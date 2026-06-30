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
| **Description** | FastAPI-based cryptocurrency chart workstation with real-time Bybit market data, live WebSocket streaming, Lightweight Charts v4 candlestick charts, canvas-based drawing toolbar (13 tools), SQLite persistence, and ML pattern analysis. |
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
│   │   └── contributions.md     # Contribution tracking table (fill per member)
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
│   │   │   └── ml_client.py     # HTTP client for ML analysis service
│   │   └── models/
│   │       └── schemas.py       # Pydantic models
│   ├── frontend/
│   │   ├── index.html           # Main page with left drawing toolbar
│   │   ├── css/styles.css       # Theming, toolbar, settings panel
│   │   └── js/
│   │       ├── app.js           # Init, theme toggle, settings load/save
│   │       ├── charts.js        # Lightweight Charts v4, candle loading, pattern analysis
│   │       ├── sidebar.js       # Coin list, ticker badges, trend-colored prices
│   │       ├── datafeed.js      # TradingView Charting Library adapter
│   │       ├── drawing-overlay.js # Canvas drawing engine (13 tools)
│   │       ├── toolbar.js       # Chart type switching (candle/line/area)
│   │       └── websocket.js     # WebSocket connection manager
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
| **Frontend** | Lightweight Charts v4, Canvas API, vanilla JS |
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
- **Goal:** Deliver MVP v2 — WebSocket migration, DB caching, RSI/Volume sub-charts, multi-interval support, analysis range fix
- **Total Story Points:** 13 (5 completed + 8 remaining; 3 superseded PBIs folded into new scope)
- **PBIs:** 8 total — 5 completed ([#122](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/122)–[#126](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/126)), 3 remaining ([#110](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110), [#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112), [#113](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113))
- **Release:** [v2.0.0](https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/v2.0.0)
- **Scope:** All Sprint 4 PBIs define MVP v2 scope. Addressing all critical customer feedback from Sprint 3.

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
| **[Sprint 4](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/5)** | **5** | **Active** | **6** (3 open + 3 superseded closed) | **5** |
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
| QR-003 | Functional Correctness | F2 ≥ 0.55, FPR ≤ 20% | QRT-003 | Needs re-design |

All documented in:
- [`docs/quality-requirements.md`](../../docs/quality-requirements.md)
- [`docs/quality-requirement-tests.md`](../../docs/quality-requirement-tests.md)

---

## 10. Testing Status

| Test Type | Scope | Location | Status |
|---|---|---|---|
| Unit tests | bybit_client, cache, detection, schemas | `tests/unit/` | ✅ Passing |
| Integration tests | API endpoints | `tests/integration/test_api_endpoints.py` | ✅ Passing |
| QRTs | Performance, Security, Accuracy | `tests/requirements/` | ✅ Passing |
| Frontend JS tests | ❌ None exist | — | ❌ Missing |

**Coverage:** ≥30% for critical modules (bybit_client, cache, database, ml_client, endpoints, websocket, schemas, detection).

**Documentation:** [`docs/testing.md`](../../docs/testing.md)

---

## 11. UAT Status (from Assignment 4)

| UAT | Title | Result | Notes |
|---|---|---|---|
| UAT-001 | Scan and view chart patterns | ⏳ Partial | UI shows markers, ML as separate service |
| UAT-002 | Toggle chart timeframes | ❌ Not tested | Only 5m available |
| UAT-003 | Export scan results | ⏳ Not demonstrated | — |
| UAT-004 | Real-time sidebar | ✅ Pass | 10 pairs with live prices |
| UAT-005 | Theme toggle | ✅ Pass | Works across reloads |

**Documentation:** [`docs/user-acceptance-tests.md`](../../docs/user-acceptance-tests.md)

**Assignment 5 requires:** At least 2 new UAT scenarios for MVP v2 functionality.

---

## 12. Customer Feedback from Sprint 3 Review

Key feedback points from 2026-06-26 Sprint Review (see [`reports/week4/customer-review-summary.md`](../../reports/week4/customer-review-summary.md)):

| Feedback | Priority | PBI | Status |
|---|---|---|---|---|
| Migrate REST polling → WebSocket subscription | Critical | [#110 PBI-115](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110) | To Do |
| Implement DB caching for candles | Critical | [~~#111 PBI-116~~](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/111) → [#122 PBI-121](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/122) | ✅ Done (multi-interval caching) |
| Add RSI sub-chart | High | [#112 PBI-117](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112) | To Do |
| Add Volume sub-chart | High | [#113 PBI-118](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113) | To Do |
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
- PR links to current milestone
- All CI checks pass (ruff, mypy, pytest+cov, bandit)
- CHANGELOG updated for user-visible changes
- No secrets/PII committed
- README/docs updated if needed
- QR-001/002/003 not regressed

**Assignment 5 requires:** DoD must be updated if Sprint 4 changes architecture, critical modules, deployment model, workflow, or CI configuration.

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
- [ ] **Fill [`docs/development-process.md`](../../docs/development-process.md)** — git workflow, Mermaid gitGraph, config management, CI, branches, PRs, secrets (empty template exists)
- [ ] **Link from README, hosted docs, week 5 report**

> **Note on template files:** All architecture, ADR, and report files listed below exist as **empty placeholders** (0 bytes). This is intentional — they serve as a starter checklist. Each file must be filled incrementally by team members in **separate commits**. A single commit must not cover all items; distribute work across multiple contributors and commits.

### Part 4: Architecture Documentation
- [ ] **Fill [`docs/architecture/README.md`](../../docs/architecture/README.md)** — with static, dynamic, deployment view sections (empty template exists)
- [ ] **Fill [`docs/architecture/static-view/diagram.puml`](../../docs/architecture/static-view/diagram.puml)** — component diagram (PlantUML), source
- [ ] **Fill [`docs/architecture/dynamic-view/diagram.puml`](../../docs/architecture/dynamic-view/diagram.puml)** — sequence diagram(s), source
- [ ] **Fill [`docs/architecture/deployment-view/diagram.puml`](../../docs/architecture/deployment-view/diagram.puml)** — deployment diagram, source
- [ ] **Comment on coupling, cohesion, maintainability, quality requirements** in static view
- [ ] **Explain scenario importance, architecture decisions, quality requirements** in dynamic view
- [ ] **Explain deployment model choice, constraints, operations** in deployment view

### Part 5: ADRs (Architecture Decision Records)
- [ ] **Fill [`docs/architecture/adr/ADR-001-websocket-migration.md`](../../docs/architecture/adr/ADR-001-websocket-migration.md)** (empty template exists)
- [ ] **Fill [`docs/architecture/adr/ADR-002-sqlite-persistence.md`](../../docs/architecture/adr/ADR-002-sqlite-persistence.md)** (empty template exists)
- [ ] **Fill [`docs/architecture/adr/ADR-003-microservice-architecture.md`](../../docs/architecture/adr/ADR-003-microservice-architecture.md)** (empty template exists)
- [ ] **Each ADR must link to A4/A5 quality requirements**
- [ ] **Update [`docs/quality-requirements.md`](../../docs/quality-requirements.md)** — link each QR to relevant ADR
- [ ] **Link ADRs from [`docs/architecture/README.md`](../../docs/architecture/README.md)**

### Part 6: Testing, QA, DoD for MVP v2
- [ ] **Keep all A4 checks active**
- [ ] **Extend tests** for MVP v2 scope
- [ ] **Update [`docs/testing.md`](../../docs/testing.md)**, [`docs/quality-requirements.md`](../../docs/quality-requirements.md), [`docs/quality-requirement-tests.md`](../../docs/quality-requirement-tests.md), [`docs/definition-of-done.md`](../../docs/definition-of-done.md)
- [ ] **Update DoD** if architecture/deployment/workflow changes

### Part 7: Implement, Release, Deploy MVP v2
- [x] **Implement Sprint 4 scope** — 5/8 PBIs completed ([#122](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/122)–[#126](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/126)), 3 remaining ([#110](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110), [#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112), [#113](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113))
- [x] **Update [`CHANGELOG.md`](../../CHANGELOG.md)** — Unreleased section populated with all implemented features
- [ ] **Update [`README.md`](../../README.md)** — setup/run/deploy if changed
- [ ] **Deploy MVP v2** — accessible to customer/TA
- [ ] **Create SemVer release** — tag `v2.0.0`, maps to MVP v2, links to Sprint 4 milestone, run instructions, demo video, week 5 report

### Part 8: User Acceptance Tests
- [ ] **Add ≥2 new UAT scenarios** for MVP v2 in [`docs/user-acceptance-tests.md`](../../docs/user-acceptance-tests.md)
- [ ] **Execute with customer** in recorded session
- [ ] **Summarize results** in week 5 report

### Part 9: Sprint Review
- [ ] **Conduct Sprint Review** with customer
- [ ] **Create reports:**
  - [`reports/week5/sprint-review-summary.md`](../../reports/week5/sprint-review-summary.md)
  - [`reports/week5/sprint-review-transcript.md`](../../reports/week5/sprint-review-transcript.md) or `sprint-review-notes.md`

### Part 10: Sprint Retrospective
- [ ] **Conduct retrospective**
- [ ] **Create [`reports/week5/retrospective.md`](../../reports/week5/retrospective.md)**

### Part 11: Hosted Documentation Site
- [ ] **Publish maintained docs** as browsable hosted site
- [ ] **Link from README, week 5 report, SemVer release**

### Part 12: Reflection
- [ ] **Create [`reports/week5/reflection.md`](../../reports/week5/reflection.md)**

### Part 13: Public Sanitized Demo Video
- [ ] **Record <2 min demo** of MVP v2
- [ ] **Link from week 5 report and release**

### Part 14: LLM Report
- [ ] **Create [`reports/week5/llm-report.md`](../../reports/week5/llm-report.md)**

### Week 5 Report Structure
> **Note:** All report files below exist as empty placeholders (0 bytes). They must be filled incrementally by team members in separate commits. One commit must not cover all 42 items or all 7 report files; distribute work.
- [ ] **Fill [`reports/week5/README.md`](../../reports/week5/README.md)** — 42-item structure (see Assignment_05.md lines 438–489) (empty template exists)
- [ ] **Fill [`reports/week5/sprint-review-summary.md`](../../reports/week5/sprint-review-summary.md)** (empty template exists)
- [ ] **Fill [`reports/week5/sprint-review-transcript.md`](../../reports/week5/sprint-review-transcript.md)** (empty template exists)
- [ ] **Fill [`reports/week5/retrospective.md`](../../reports/week5/retrospective.md)** (empty template exists)
- [ ] **Fill [`reports/week5/reflection.md`](../../reports/week5/reflection.md)** (empty template exists)
- [ ] **Fill [`reports/week5/llm-report.md`](../../reports/week5/llm-report.md)** (empty template exists)
- [ ] **Create [`reports/week5/images/`](../../reports/week5/images/)** — screenshots (milestone, board, CI, release, PR, hosted docs) (empty directory exists)

### Moodle PDF (Private)
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

#### Remaining
| PBI | Issue | Title | SP | Priority |
|---|---|---|---|---|
| PBI-115 | [#110](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110) | WebSocket subscription migration | 5 | Critical |
| PBI-117 | [#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112) | RSI sub-chart | 3 | High |
| PBI-118 | [#113](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113) | Volume sub-chart | 3 | High |

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
1. **Architecture documentation files exist as empty templates** — `docs/architecture/README.md`, static/dynamic/deployment `.puml` files need content (PlantUML recommended).
2. **ADR files exist as empty templates** — 3 ADR `.md` files need content, each linking to quality requirements.
3. **Development-process template exists** — `docs/development-process.md` is empty; needs git workflow, Mermaid gitGraph, config management.
4. **Sprint 4 milestone** — [created](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/5) with 5 completed PBIs + 3 remaining.
5. **Sprint 4 PBIs** — 5 completed ([#122](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/122)–[#126](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/126)), 3 remaining ([#110](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110), [#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112), [#113](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113)).
6. **Week 5 report files exist as empty templates** — `reports/week5/README.md` and 6 sub-reports need content.
7. **No hosted documentation site** — required starting in Assignment 5.
8. **No MVP v2 release** — needs a new SemVer release mapping to Sprint 4 + MVP v2.
9. **No LLM chat logs** — required for Part 14.
10. **No public demo video** — required for Part 13.

### Technical Risks
1. **WebSocket migration** (customer's top request) is a large rework touching backend + frontend.
2. **QR-003 needs re-design** — F2 threshold changed from 80% to 55% (realistic target given current ML precision). All QRTs must be re-aligned.
3. **Frontend JS has zero test coverage** — no unit/integration tests for chart, drawing, sidebar, WebSocket.
4. **RSI and Volume sub-charts** still pending — remaining high-priority items from Sprint 4.
5. **Timeframe switch lacks loading overlay** — switching intervals doesn't show loading spinner when fetching new data.

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

*Last updated: 2026-06-30 (18:00 UTC)*
*Generated by: OpenCode (deepseek-v4-flash-free)*
*Branch analysis updated: 2026-06-30*

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
| PBI-115 | [#110](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110) | WebSocket subscription migration | 5 | Critical | ❌ Not started |
| PBI-117 | [#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112) | RSI indicator sub-chart | 3 | High | ❌ Not started |
| PBI-118 | [#113](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113) | Volume sub-chart below main chart | 3 | High | ❌ Not started |

### MVPv2 Readiness Assessment

| Criterion | Status | Notes |
|---|---|---|
| Sprint 4 PBIs implemented | ✅ 5/8 (13 SP) completed, 3 remaining (11 SP) | DB caching, configurable analysis, ML viz, ML perf, UI cleanup done |
| Architecture docs filled | ❌ All empty templates | `docs/architecture/` files are 0 bytes |
| ADRs filled | ❌ All empty templates | 3 ADR templates exist, all empty |
| dev-process.md filled | ❌ Empty template | 0 bytes |
| CHANGELOG updated | ✅ Updated with all implemented features | Unreleased section populated |
| Week 5 reports filled | ❌ All empty templates | 7 report files, all 0 bytes |
| UAT scenarios added | ❌ Not done | Requires ≥2 new MVP v2 scenarios |
| SemVer release v2.0.0 | ❌ Not created | No tag exists |
| Hosted documentation | ❌ Not published | Required in A5 |
| Demo video | ❌ Not recorded | Required for Part 13 |
| LLM report | ❌ Not created | Required for Part 14 |
| CI pipeline | ✅ Passing | All checks pass on main |

### Impact on A5 Gap Analysis
- Part 1 (Backlog & Sprint 4): **fully addressed** — all checkboxes marked [x]
- Part 2 (Customer Feedback): PBIs created on GitHub, 3/6 feedback items implemented (DB caching → PBI-121, analysis range → PBI-122, multi-interval → PBI-121), response table TBD in week 5 report
- Parts 3–5 (Dev Process, Architecture, ADRs): template files exist, need content filled incrementally
- Part 7 (Implementation): **5/8 PBIs completed (13 SP)**, 3 PBIs remaining (11 SP)
- Parts 6, 8–14 (Testing, UAT, Reports, Release, Demo): **0% complete** — scaffolding exists, all work remains

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
- The `MVPv2` branch contains **A5 scaffolding + 5 completed Sprint 4 PBIs** (PBI-121 through PBI-125). Remaining: WebSocket migration, RSI sub-chart, Volume sub-chart require separate feature branches.
- PBI-122 (configurable analysis limit) replaces the original PBI-119 scope — the input defaults to 10000 but allows up to 500000, making it more flexible than a hardcoded 50k.
- All architecture docs, ADRs, reports, and release artifacts remain **empty templates** — must be filled by team members in separate, incremental commits.
- No team member other than F. Kozhevnikov has contributed code to `MVPv2` yet.
