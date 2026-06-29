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
| **Current Branch** | `as5` (working branch for Assignment 5) |
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
│   ├── 4/                       # Assignment 4 artifacts
│   │   └── assignment_04.md
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
│   [ Missing for A5: architecture/, development-process.md ]
├── reports/
│   ├── week2/                   # Sprint 1 reports
│   ├── week3/                   # Sprint 2 reports
│   └── week4/                   # Sprint 3 reports (current completed sprint)
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
- **Goal:** Deliver MVP v2 — architecture hardening, customer feedback response, process documentation, deployment docs
- **Release:** [v2.0.0](https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/v2.0.0)
- **Scope:** All Sprint 4 PBIs define MVP v2 scope. Must address customer feedback from Sprint 3.

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
| **[Sprint 4](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/5)** | **5** | **Active** | — | — |
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

| Feedback | Priority | Status |
|---|---|---|
| Migrate REST polling → WebSocket subscription | Critical | Not started |
| Implement DB caching for candles | Critical | Not started |
| Add RSI sub-chart | High | Not started |
| Add Volume sub-chart | High | Not started |
| Reduce analysis range 150k → 50k candles | Medium | Not started |
| Multi-interval support (15m, 1h, 4h, 1d) | Medium | Not started |
| Candle colour customization | Low | US-14 in backlog |

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

### Part 1: Product Backlog & Sprint 4 Planning
- [ ] **Refine Product Backlog** — review customer feedback, risks, unfinished work
- [ ] **Create Sprint 4 PBIs** — with acceptance criteria, story points, implementer, reviewer
- [x] **Create Sprint 4 milestone** — [Sprint 4](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/5) created with Sprint Goal, dates, selected PBIs
- [ ] **Update [`docs/roadmap.md`](../../docs/roadmap.md)** — current direction, Sprint 4, MVP v2, next increment

### Part 2: Customer Feedback Response
- [ ] **Create/update PBIs for feedback items** — map to Sprint 4 scope
- [ ] **Customer feedback response table** in week 5 report

### Part 3: Development Process & Configuration Management
- [ ] **Create [`docs/development-process.md`](../../docs/development-process.md)** — git workflow, Mermaid gitGraph, config management, CI, branches, PRs, secrets
- [ ] **Link from README, hosted docs, week 5 report**

### Part 4: Architecture Documentation
- [ ] **Create [`docs/architecture/README.md`](../../docs/architecture/README.md)** — with static, dynamic, deployment view sections
- [ ] **Create [`docs/architecture/static-view/`](../../docs/architecture/static-view/)** — component diagram (PlantUML recommended), source + rendered
- [ ] **Create [`docs/architecture/dynamic-view/`](../../docs/architecture/dynamic-view/)** — sequence diagram(s), source + rendered
- [ ] **Create [`docs/architecture/deployment-view/`](../../docs/architecture/deployment-view/)** — deployment diagram, source + rendered
- [ ] **Comment on coupling, cohesion, maintainability, quality requirements** in static view
- [ ] **Explain scenario importance, architecture decisions, quality requirements** in dynamic view
- [ ] **Explain deployment model choice, constraints, operations** in deployment view

### Part 5: ADRs (Architecture Decision Records)
- [ ] **Create [`docs/architecture/adr/`](../../docs/architecture/adr/)** directory
- [ ] **Create ≥3 ADRs** — each linking to A4/A5 quality requirements
- [ ] **Format:** `ADR-NNN-short-description.md`
- [ ] **Update [`docs/quality-requirements.md`](../../docs/quality-requirements.md)** — link each QR to relevant ADR
- [ ] **Link ADRs from [`docs/architecture/README.md`](../../docs/architecture/README.md)**

### Part 6: Testing, QA, DoD for MVP v2
- [ ] **Keep all A4 checks active**
- [ ] **Extend tests** for MVP v2 scope
- [ ] **Update [`docs/testing.md`](../../docs/testing.md)**, [`docs/quality-requirements.md`](../../docs/quality-requirements.md), [`docs/quality-requirement-tests.md`](../../docs/quality-requirement-tests.md), [`docs/definition-of-done.md`](../../docs/definition-of-done.md)
- [ ] **Update DoD** if architecture/deployment/workflow changes

### Part 7: Implement, Release, Deploy MVP v2
- [ ] **Implement Sprint 4 scope** — issue-linked PRs, reviewed
- [ ] **Update [`CHANGELOG.md`](../../CHANGELOG.md)**
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
- [ ] **Create [`reports/week5/README.md`](../../reports/week5/README.md)** — 42-item structure (see Assignment_05.md lines 438–489)
- [ ] **Create [`reports/week5/images/`](../../reports/week5/images/)** — screenshots (milestone, board, CI, release, PR, hosted docs)

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
- **Lychee exclusions:** localhost, Google Drive, gitlab.pg.innopolis.university, file://

---

## 17. Known Gaps & Risks for Assignment 5

### Critical Gaps (Must Address for A5)
1. **No architecture documentation** — `docs/architecture/` does not exist. Needs README.md, static/dynamic/deployment views, diagrams-as-code (PlantUML recommended).
2. **No ADRs** — `docs/architecture/adr/` does not exist. Need ≥3 ADRs linking to quality requirements.
3. **No development-process documentation** — `docs/development-process.md` does not exist. Needs git workflow description, Mermaid gitGraph, config management.
4. **Sprint 4 milestone** — [created](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/5), PBIs need assignment.
5. **No Sprint 4 PBIs** — backlog not yet refined for Assignment 5.
6. **No week 5 report directory** — `reports/week5/` does not exist.
7. **No hosted documentation site** — required starting in Assignment 5.
8. **No MVP v2 release** — needs a new SemVer release mapping to Sprint 4 + MVP v2.

### Technical Risks
1. **WebSocket migration** (customer's top request) is a large rework touching backend + frontend.
2. **QR-003 needs re-design** — F2 threshold changed from 80% to 55% (realistic target given current ML precision). All QRTs must be re-aligned.
3. **Frontend JS has zero test coverage** — no unit/integration tests for chart, drawing, sidebar, WebSocket.
4. **Single timeframe (5m only)** — multi-interval support deferred multiple sprints.
5. **No database caching** — every page load hits Bybit REST API.

### Process Risks
1. **Previous milestones left "Open"** — Sprint 1, 2, 3 milestones still in `open` state (should they be closed?).
2. **Branch named `as5` exists but has no changes vs main** — `git diff main..as5` is empty. Work hasn't started.

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

*Last updated: 2026-06-30*
*Generated by: OpenCode (deepseek-v4-flash-free)*
*Working branch: `as5`*
