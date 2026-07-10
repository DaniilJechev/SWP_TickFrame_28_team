# Memory6 — SWP TickFrame Team 28 · Assignment 6 Context File

> **Purpose:** Comprehensive AI-assistant memory file for Assignment 6. Contains all project context, current status, gaps against Assignment 06 requirements, and links to every relevant artifact. Update this file as work progresses.

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
| **MVP v2 Release** | [v2.0.0](https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/v2.0.0) (Sprint 4, Assignment 5) |
| **MVP v3** | Target for Assignment 6 — final course version |
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
├── AGENTS.md                    # AI agent guidance (A6 maintained)
├── CONTRIBUTING.md              # Contributor guidance (A6 maintained)
├── assignments/
│   ├── 4/                       # Assignment 4 artifacts
│   ├── 5/                       # Assignment 5 artifacts
│   ├── 6/                       # Assignment 6 artifacts (current)
│   │   ├── Assignment_06.md     # Main assignment spec (634 lines)
│   │   ├── Artifact_Requirements.md  # Shared artifact rules (inherited)
│   │   ├── breakdown.md         # Task breakdown
│   │   ├── context.md           ← This file
│   │   ├── issue_template.md    # Sprint 5 / Sprint 6 issue template (Weeks 6–7)
│   │   └── contributions.md     # Contribution tracking table
│   ├── old/                     # Earlier assignment specs
│   ├── Process_Requirements.md  # Scrum/workflow semantics
│   └── Repository_Requirements.md # Platform/repo mechanics
├── docs/
│   ├── backlog.md               # PBI index (split by Sprint + unscheduled)
│   ├── customer-handover.md     # Maintained customer-handover artifact (A6)
│   ├── definition-of-done.md    # DoD checklist (CI, quality, code criteria)
│   ├── interface.md             # CLI interface specification
│   ├── quality-requirements.md  # QR-001, QR-002, QR-003
│   ├── quality-requirement-tests.md # QRT-001 through QRT-005
│   ├── roadmap.md               # Sprint-by-Sprint plan (update for A6)
│   ├── testing.md               # Testing strategy, coverage, CI gates
│   ├── user-acceptance-tests.md # UAT scenarios
│   ├── user-stories.md          # User story index (US-01 to US-15)
│   ├── architecture/            # Architecture docs (3 views + ADRs)
│   └── development-process.md   # Git workflow, Mermaid gitGraph, CI
├── reports/
│   ├── week2/                   # Sprint 1 reports
│   ├── week3/                   # Sprint 2 reports
│   ├── week4/                   # Sprint 3 reports
│   ├── week5/                   # Sprint 4 / A5 reports
│   ├── week6/                   # Sprint 5 / A6 Week 6 reports (fill incrementally)
│   └── week7/                   # Sprint 6 / A6 Week 7 reports (fill incrementally)
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
│   │   │   ├── drawing-properties.css # Drawing properties panel styles
│   │   │   └── indicators-panel.css   # Indicators panel styles
│   │   ├── js/
│   │   │   ├── app.js           # Init, theme toggle, settings load/save
│   │   │   ├── charts.js        # Lightweight Charts v5, candle loading, pattern analysis, volume sub-chart
│   │   │   ├── sidebar.js       # Coin list, icons, FNG, trend-colored prices
│   │   │   ├── datafeed.js      # TradingView Charting Library adapter
│   │   │   ├── websocket.js     # WebSocket connection manager
│   │   │   ├── drawing-*.js     # Modular drawing system (7 modules)
│   │   │   ├── indicators-*.js  # Indicators subsystem (registry, controller, state, panes, panel, chips) + bundled library
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
│   ├── integration/
│   ├── requirements/            # QRT-001 through QRT-005
│   └── frontend/                # Vitest JS tests
├── main.py                      # uvicorn entry point
├── package.json                 # npm deps: lightweight-charts-drawing, esbuild, build scripts
├── CHANGELOG.md                 # Keep a Changelog format
├── README.md                    # Project docs, setup, API, architecture (update for A6)
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
| **Frontend** | Lightweight Charts v5, Canvas API, vanilla JS, lightweight-charts-drawing, lightweight-charts-indicators, oakscriptjs, Lucide icons, esbuild |
| **Database** | SQLite (via aiosqlite) |
| **ML** | XGBoost (Head & Shoulders detection), FastAPI microservice |
| **Exchange** | Bybit v5 API (primary), Binance API (fallback) |
| **Deployment** | Docker + Docker Compose (2 containers) |
| **CI** | GitHub Actions (ruff, mypy, pytest+cov, bandit, ESLint, Vitest) |
| **Link Check** | Lychee (GitHub Actions) |
| **Package** | pip, requirements.txt |
| **AI Tools** | OpenCode (deepseek-v4-flash-free) for code, tests, docs, CI, reports |

---

## 5. Sprint History

### Sprint 1 — Repository & Process Foundation
- **Milestone:** [Sprint 1](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/1)
- **Dates:** Week 2
- **Outcome:** Public repo, MIT license, .env.example, PR template

### Sprint 2 — MVP v1 Core Features
- **Milestone:** [Sprint 2 - MVP-v1](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/2)
- **Release:** [v1.0.0](https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/SemVer)

### Sprint 3 — Drawing Tools + Quality Gates (Assignment 4)
- **Milestone:** [Sprint 3 — Assignment 4 — v1.1.0](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/3)
- **Release:** [v1.1.0](https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/v1.1.0)
- **Story Points:** 19 (all 15 PBIs delivered)

### Sprint 4 — MVP v2 (Assignment 5)
- **Milestone:** [Sprint 4](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/5)
- **Dates:** 2026-06-30 – 2026-07-06
- **Goal:** Deliver MVP v2
- **Total Story Points:** 24 (24 completed)
- **Release:** [v2.0.0](https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/v2.0.0)

### Sprint 5 — Week 6 Trial Release (Assignment 6 Week 6)
- **Milestone:** [Sprint 5](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/6) _(create)_
- **Dates:** 2026-07-07 – 2026-07-13
- **Goal:** Week 6 trial / handover-candidate release — PBIs, customer-facing docs, transition readiness

### Sprint 6 — MVP v3 (Assignment 6 Week 7)
- **Milestone:** [Sprint 6 — MVP v3](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/7) _(create)_
- **Dates:** 2026-07-14 – 2026-07-20
- **Goal:** Deliver MVP v3 — follow-up maintenance, fixes from Week 6 trial, final transition, Demo Day preparation

---

## 6. Current Release Status

| Release | Tag | Date | Maps To |
|---|---|---|---|
| MVP v1 | `v1.0.0` | 2026-06-21 | Sprint 2 |
| Sprint 3 Increment | `v1.1.0` | 2026-06-26 | Sprint 3 |
| MVP v2 | `v2.0.0` | 2026-07-06 | Sprint 4 (A5) |
| **Week 6 Trial** | `v2.2.0-trial` | **Week 6 (branch `2.2.0-trial`)** | **Sprint 5 (A6)** |
| **MVP v3** | **TBD** | **Week 7** | **Sprint 6 (A6)** |

---

## 7. Milestones Status

| Milestone | Number | State | Open Issues | Closed Issues |
|---|---|---|---|---|
| Sprint 1 | 1 | Open | 0 | 1 |
| Sprint 2 - MVP-v1 | 2 | Open | 0 | 2 |
| Sprint 3 — Assignment 4 | 3 | Open | 0 | 25 |
| Sprint 4 | 5 | Open | — | — |
| **Sprint 5** | **6** | **Active** | **_TBD_** | **_TBD_** |
| **Sprint 6 — MVP v3** | **7** | **Active** | **_TBD_** | **_TBD_** |

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

**Branch protection:** Default branch (`main`) is protected: direct pushes disabled, at least one approval required before merge, PR template enforced.

---

## 9. Quality Requirements & Tests

| QR ID | Sub-characteristic | Metric | QRT | Status |
|---|---|---|---|---|
| QR-001 | Time Behaviour | p95 ≤ 500ms | QRT-001 | Active |
| QR-002 | Confidentiality | Zero secrets in commits | QRT-002 | Active |
| QR-003 | Functional Correctness | F2 ≥ 0.55, FPR ≤ 20% | QRT-003 | Active |
| — | WebSocket Reliability | — | QRT-004 | Active |
| — | DB Cache Round-Trip | — | QRT-005 | Active |

All documented in:
- [`docs/quality-requirements.md`](../../docs/quality-requirements.md)
- [`docs/quality-requirement-tests.md`](../../docs/quality-requirement-tests.md)

---

## 10. Testing Status

| Test Type | Scope | Location | Status |
|---|---|---|---|
| Unit tests | bybit_client, cache, detection, schemas, websocket, database | `tests/unit/` | ✅ Passing |
| Integration tests | API endpoints | `tests/integration/test_api_endpoints.py` | ✅ Passing |
| QRTs | Performance, Security, Accuracy, WebSocket, DB Cache | `tests/requirements/` | ✅ 5 QRTs |
| Frontend JS tests | WebSocket message parsing, URL construction | `tickframe/frontend/js/tests/` | ✅ Passing |

**Documentation:** [`docs/testing.md`](../../docs/testing.md)

---

## 11. UAT Status (from Assignment 5)

| UAT | Title | Result | Notes |
|---|---|---|---|
| UAT-001 | Scan and view chart patterns | ⏳ Partial | ML reports display descriptions + confidence scores (~57%). Pattern filtering requested. |
| UAT-002 | Toggle chart timeframes | ⏳ Partial | 5 timeframes available. UI glitches when switching — needs polish. |
| UAT-003 | Export scan results | ⏳ Not demonstrated | — |
| UAT-004 | Real-time sidebar | ✅ Pass | 10 pairs with live prices, coin icons, F&G index. |
| UAT-005 | Theme toggle | ✅ Pass | Works across reloads. |
| UAT-006 | WebSocket real-time candle updates | ✅ Pass | WebSocket live candles from Bybit/Binance. DB cache. |
| UAT-007 | RSI and Volume sub-charts | ✅ Pass | Volume sub-chart works via indicator panes subsystem. **RSI implemented** via `lightweight-charts-indicators` library (445+ indicators). Auto-applied on symbol switch. |

**Documentation:** [`docs/user-acceptance-tests.md`](../../docs/user-acceptance-tests.md)

---

## 12. Completed Week 6 Contributions (Branch `6-repo-template`)

All contributions on the `6-repo-template` branch, organized by theme:

### Part 1 — Product Backlog & Sprint Planning

| Item | Detail | Status |
|---|---|---|
| Sprint 5 milestone | Created milestone #6 ([Sprint 5](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/6)), Week 6 (2026-07-07 – 2026-07-13) | ✅ Done |
| Sprint 6 milestone | Created milestone #7 ([Sprint 6 — MVP v3](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/7)), Week 7 (2026-07-14 – 2026-07-20) | ✅ Done |
| PBIs created | [#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112) (RSI), [#177](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/177)–[#185](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/185) (documentation, release, reports, presentation) | ✅ Done |
| PBI-milestone assignment | All PBIs assigned to Sprint 5 or Sprint 6 milestones | ✅ Done |
| [`docs/backlog.md`](../../docs/backlog.md) | Added Sprint 5 (5 PBIs) and Sprint 6 (5 PBIs) sections; Sprint 4 → "Previous"; cleaned up completed items | ✅ Done |
| [`docs/roadmap.md`](../../docs/roadmap.md) | Sprint 5 with milestone link, dates, goal, planned items; Sprint 6 with full A6 Week 7 details | ✅ Done |

### A6 Scaffolding Files

| File | Purpose | Status |
|---|---|---|
| [`assignments/6/context.md`](context.md) | Comprehensive AI-context file for A6 work | ✅ Done |
| [`assignments/6/breakdown.md`](breakdown.md) | Task breakdown for Sprint 5 and Sprint 6 | ✅ Done |
| [`assignments/6/issue_template.md`](issue_template.md) | Issue template for Sprint 5/6 following Artifact Requirements | ✅ Done |
| [`assignments/6/contributions.md`](contributions.md) | Contribution tracking table for team members | ✅ Done |
| [`assignments/Artifact_Requirements.md`](../Artifact_Requirements.md) | Moved from `assignments/5/` to shared location; old copy deleted | ✅ Done |

### Repo Template Files (A6 Part 3 & 4)

| File | A6 Part | Purpose |
|---|---|---|
| [`AGENTS.md`](../../AGENTS.md) | Part 3 | AI agent safety rules, repo context, assignments reference |
| [`CONTRIBUTING.md`](../../CONTRIBUTING.md) | Part 3 | Contributor workflow, coding standards, verification checklist |
| [`docs/customer-handover.md`](../../docs/customer-handover.md) | Part 4 | Handover level, access, config, setup, docs index, limitations |
| [`reports/week6/README.md`](../../reports/week6/README.md) | Part 10 | Empty stub for Week 6 reports |
| [`reports/week7/README.md`](../../reports/week7/README.md) | Part 10 | Empty stub for Week 7 reports |

### Docs Fixes

| File | Change | Status |
|---|---|---|
| [`README.md`](../../README.md) | `http://localhost:8000` → `http://localhost:8080` | ✅ Done |
| [`docs/development-process.md`](../../docs/development-process.md) | `localhost:8000` → `localhost:8080` in local-dev URL | ✅ Done |
| [`docs/user-acceptance-tests.md`](../../docs/user-acceptance-tests.md) | 6× `http://localhost:8000` → `http://localhost:8080` | ✅ Done |

### GitHub Issues Link

| Issue | Title | Branch Contribution |
|---|---|---|
| [#186](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/186) | DOC: Update localhost port references from 8000 to 8080 | Docs fixes |
| [#187](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/187) | DOC: Add Sprint 5 and Sprint 6 sections to backlog and roadmap | Part 1 backlog/roadmap updates |
| [#188](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/188) | DOC: Create A6 scaffolding and team planning files | A6 scaffolding |
| [#189](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/189) | DOC: Create repo template files for A6 Part 3 and Part 4 | Template files |
| [#190](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/190) | Course Task: Complete A6 Part 1 — Sprint 5 and Sprint 6 planning | Part 1 milestones & PBIs |

---

## 12a. Completed Week 6 Contributions (Branch `2.2.0-trial`) — Indicators &amp; Trial Release

All contributions on the `2.2.0-trial` branch (commit `5884717`), organized by theme:

### Indicators Subsystem (445+ Technical Indicators)

| Item | Detail | Status |
|---|---|---|
| `lightweight-charts-indicators` v0.4.2 | Integrated 445+ built-in technical indicators via npm + esbuild bundle | ✅ Done |
| `oakscriptjs` v0.2.8 | Peer dependency for indicator calculation engine | ✅ Done |
| `TFIndicators` registry | Indicator lookup, search (by name/id), group by category (Standard / Candlestick Patterns / Community) | ✅ Done |
| `TFIndicatorController` | Apply, remove, recompute indicators on candle data; overlay (line series on main chart) and pane (separate sub-chart) modes; candlestick pattern markers | ✅ Done |
| `TFIndicatorState` | Reactive state store for applied indicators, search query, group expansion, volume toggle | ✅ Done |
| `TFIndicatorPanes` | Dynamic pane creation/destruction for non-overlay indicators; volume pane integration | ✅ Done |
| `TFIndicatorPanel` | Side panel UI with search input, collapsible groups, pinned RSI row, volume toggle, indicator rows | ✅ Done |
| `TFIndicatorChips` | Chips display for applied indicators; click to remove | ✅ Done |
| RSI auto-apply | RSI (14) automatically applied when switching to a new symbol (if not already present) | ✅ Done |
| **Closes [#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112)** | PBI-117: Add RSI indicator sub-chart — **closed** | ✅ Done |
| Theme sync for panes | `TFIndicatorPanes.applyThemeToAll()` called on theme toggle | ✅ Done |

### Backend Indicator Persistence

| Item | Detail | Status |
|---|---|---|
| `GET /api/indicators?symbol=` | REST endpoint to load indicator state for a symbol | ✅ Done |
| `POST /api/indicators` | REST endpoint to save indicator state for a symbol | ✅ Done |
| `indicators_blob` SQLite table | Schema with `symbol` (PK), `data` (JSON text), `updated` (timestamp) | ✅ Done |
| `IndicatorsPayload` / `IndicatorsResponse` / `IndicatorConfig` | Pydantic models for indicator API | ✅ Done |

### Drawing Toolbar Refinements

| Item | Detail | Status |
|---|---|---|
| 3-column grid layout | Drawing toolbar grid from `1fr 1fr` → `1fr 1fr 1fr` | ✅ Done |
| Smaller icons & buttons | Button 40→30px, icons 18→14px, border-radius 10→7px | ✅ Done |
| Repositioned toolbar | Default top from 12px→40px, z-index 50→60 | ✅ Done |
| Removed tools | Removed text-annotation, callout, brush, highlighter from toolbar | ✅ Done |
| Keyboard shortcuts | Removed keyboard shortcuts that interfered with input fields; Escape/Delete still work | ✅ Done |
| Drawing z-order fixes | All primitives set z-order to `"top"` (horizontal-line, vertical-line, cross-line, price-range, trend-line etc.) | ✅ Done |
| Bitmap-aware full-width rendering | Use `bitmapSize` instead of `viewport.width` for proper rendering on HiDPI/retina | ✅ Done |
| Adaptive price label precision | Price labels use dynamic decimal places based on magnitude (e.g., 0.000001 precision for small prices) | ✅ Done |
| Human-readable timestamps | Unix timestamps formatted as `YYYY-MM-DD HH:mm` in cross-line/time labels | ✅ Done |
| Price range label improvements | Formatting adapts to price magnitude; proper reordering of range/percentage display | ✅ Done |

### Chart & WebSocket Fixes

| Item | Detail | Status |
|---|---|---|
| WS race condition fix | `_wsSymbol`/`_wsInterval` guards prevent stale messages after symbol switch | ✅ Done |
| Chart scale reset | `resetChartScale()` called on cached data load and same-symbol re-request | ✅ Done |
| Cached data re-render | Series `setData([])` + `setData(data)` to force re-render on cache hit | ✅ Done |
| Volume pane refactoring | Volume sub-chart moved into indicator panes subsystem (`initVolumePane`) | ✅ Done |
| Sidebar async fix | `onCoinClick` now `async` and `await`s `loadCandles` before starting WS | ✅ Done |
| Toolbar position DB default | `toolbar_position` default top changed from 12→40 in SQLite init | ✅ Done |
| Drawing settings save fix | `DrawingSettings.save()` properly merges per-tool settings | ✅ Done |
| Drawing properties singleton | Guard against duplicate `init()` calls | ✅ Done |

### GitHub Issues Created

| Issue | Title |
|---|---|
| [#198](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/198) | PBI-118: Add indicators subsystem with 445+ technical indicators and panel UI |
| [#199](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/199) | IMPROVE: Drawing toolbar refinements, chart fixes, and WebSocket race condition fix |

---

## 13. What Assignment 6 Requires (Gap Analysis)

### Part 1: Refine Product Backlog & Plan Sprint 5 and Sprint 6
- [x] Review customer feedback on MVP v2, current gaps, unfinished work, documentation gaps, deployment/access blockers, Demo Day needs
- [x] Create/update PBIs for Assignment 6 scope — [#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112) (RSI), [#177](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/177)–[#185](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/185)
- [x] Create Sprint 5 milestone (Week 6) — [Sprint 5](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/6) with Goal, dates (2026-07-07–2026-07-13), 5 PBIs
- [x] Create Sprint 6 milestone (Week 7) — [Sprint 6 — MVP v3](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/7) with Goal, dates (2026-07-14–2026-07-20), 5 PBIs
- [x] Assign every selected PBI to the relevant Sprint milestone
- [x] Ensure every PBI has outcome, AC, SP, implementer, reviewer, Work Status
- [x] Keep Product Backlog and Sprint Backlog boards inspectable (GitHub Projects)
- [x] Update [`docs/roadmap.md`](../../docs/roadmap.md) with remaining Week 6/7 work, MVP v3
- [x] Update [`docs/backlog.md`](../../docs/backlog.md) with Sprint 5 and Sprint 6 sections

### Part 2: Deliver the Week 6 Trial Release
- [x] Implement selected Sprint 5 scope — _RSI + 445 indicators subsystem implemented on branch `2.2.0-trial` (PBI-117 closed, PBI-118 created #198)_
- [ ] Produce stable trial/handover-candidate release — _branch `2.2.0-trial` ready, awaiting merge to `main` and SemVer tag_
- [ ] Deploy/provide Week 6 trial increment for customer/TA access
- [ ] Create SemVer release for Sprint 5 trial increment
- [ ] Week 6 release must: SemVer tag, point to main, identify as Week 6 trial, link to Sprint 5 milestone, link to access instructions, link to `docs/customer-handover.md`, link to `reports/week6/README.md`
- [ ] Update CHANGELOG.md for user-visible changes
- [x] Update root README.md with current setup/run/deploy instructions _(partial — localhost port fixed to 8080)_

### Part 3: Polish Public Repository Entry Point & Customer-Facing Documentation
- [x] Update README.md as main public entry point (product, access, docs, handover links) — _SVG diagram, Troubleshooting, UI screenshot, relative links added_
- [x] README.md must include: project name/description, product access link, hosted docs link, link to `docs/customer-handover.md`, links to `CONTRIBUTING.md` and `AGENTS.md`, setup/run guidance, relevant maintained doc links — _all present with Quick Links banner_
- [x] Customer-facing documentation review covering: README.md, docs/customer-handover.md, access/usage instructions — _full: localhost ports corrected, SVG diagram, Troubleshooting, Known Limitations, UI screenshot, relative links_
- [x] Create/update CONTRIBUTING.md — _created with workflow, setup, standards, testing, CI, PR process, DoD_
- [x] Create/update AGENTS.md — _created with safety rules, project context, tech stack, ADRs, testing strategy, assignments reference_
- [ ] Keep all three current during Week 6 and Week 7

### Part 4: Maintain Customer Handover Documentation
- [x] Create/update `docs/customer-handover.md` according to Artifact Requirements — _enhanced with Transition Scope table, full env var documentation, structured setup/deployment sections, documentation sufficiency assessment, and Week 6 honest handover state_
- [x] Must state: transferred/delegated/retained arrangements, env vars/config/secrets steps, setup/deployment/recovery/verification steps, main doc entry points, whether docs are sufficient for handover level — _all present; handover level: "Ready for independent use" (pending confirmation)_
- [x] Keep current during Week 6 — _updated for Sprint 5; pending Week 7 final transition update_

### Part 5: Conduct Week 6 Transition-Readiness Meeting & Customer Trial
- [ ] Meet customer in Week 6 to discuss transition readiness and trial
- [ ] Discuss: completeness for transition, ready parts vs needed changes, customer usage status, deployment blockers, Week 7 actions
- [ ] Ask customer to review customer-facing documentation set
- [ ] Let customer try the Week 6 trial release independently
- [ ] Record whether customer confirmed readiness, independently used trial, deployed/operated on their side
- [ ] Convert problems into traceable PBIs/issues

### Part 6: Run Sprint 6 & Perform Follow-Up Maintenance
- [ ] Use Sprint 6 (Week 7) for maintenance, fixes, documentation updates, deployment, remaining actions
- [ ] Keep PRs issue-linked and reviewed
- [ ] Verify acceptance criteria before merge
- [ ] Keep all A4/A5 tests, quality gates, CI, architecture, dev-process docs current

### Part 7: Transition Product & Release MVP v3
- [ ] Complete actual transition in Week 7
- [ ] MVP v3 must include: final product changes, fixes from Week 6 trial, updated docs/handover, final access arrangement
- [ ] Deploy/provide MVP v3 for customer/TA access
- [ ] Create SemVer release for MVP v3 (higher precedence than Week 6 trial)
- [ ] Final release must: SemVer tag, point to main, identify as MVP v3, link to Sprint 6 milestone, link to access instructions, link to `docs/customer-handover.md`, link to `reports/week7/README.md`, link to public sanitized demo video
- [ ] Update CHANGELOG.md by moving Unreleased entries to dated SemVer section

### Part 8: Confirm Final Transition Outcome & Product Usefulness
- [ ] Confirm final transition outcome with customer
- [ ] Ask customer whether they accept current `docs/customer-handover.md`
- [ ] State handover level reached: `Ready for independent use` / `Independently used by customer` / `Deployed or operated on customer side`
- [ ] State customer-confirmation status: `Accepted` / `Accepted with follow-up items` / `Not yet accepted`
- [ ] Preserve inspectable evidence where practical
- [ ] If stronger levels not reached, explain why not

### Part 9: Update & Execute User Acceptance Tests
- [ ] Maintain active UAT scenarios in `docs/user-acceptance-tests.md`
- [ ] Execute relevant UAT scenarios during Week 6 and/or Week 7
- [ ] Summarize results in Week 6 and Week 7 reports

### Part 10: Conduct Sprint Reviews for Week 6 & Week 7
- [ ] Conduct Sprint Review for Sprint 5 (Week 6) and Sprint 6 (Week 7)
- [ ] Write reports in `reports/week6/` and `reports/week7/`

### Part 11: Conduct Sprint Retrospectives
- [ ] Retrospective after each Sprint Review
- [ ] Write to `reports/week6/retrospective.md` and `reports/week7/retrospective.md`

### Part 12: Reflect & Report LLM Usage
- [ ] Write `reports/week6/reflection.md` and `reports/week7/reflection.md`
- [ ] Write `reports/week6/llm-report.md` and `reports/week7/llm-report.md`

### Part 13: Prepare, Submit, & Rehearse Presentation
- [ ] Prepare slide deck (PDF) — submit with Week 6 Moodle PDF
- [ ] Record rehearsed presentation video — private link in Week 6 Moodle PDF
- [ ] Update slide deck for Week 7 Moodle PDF submission
- [ ] Each team member presents at least one slide

### Part 14: Record Public Sanitized Demo Video for MVP v3
- [ ] Record public demo video explaining final MVP v3 state
- [ ] Link from `reports/week7/README.md` and final MVP v3 release

---

## 17. Completed Week 6 Contributions (Branch `192-entry-point-docs`)

All contributions on the `192-entry-point-docs` branch, organized by theme:

### A6 Part 3 — Polish Public Repository Entry Point & Customer-Facing Documentation

| Item | Detail | Status |
|---|---|---|
| Architecture SVG diagram | Rendered `docs/architecture/static-view/diagram.svg` inline in README; file tree trimmed to top-level dirs; linked to full architecture docs | ✅ Done |
| Troubleshooting section | Added 6-row table covering common issues (ports, candles, WebSocket, ML, drawings, no-data) to README | ✅ Done |
| Known Limitations section | Added 8-row table to `docs/customer-handover.md` covering exchange dependency, single-user, no trading, historical depth, ML scope, WebSocket resilience, browser support, mobile | ✅ Done |
| UI screenshot | Added `docs/images/ui-screenshot.png` rendered below README tagline | ✅ Done |
| Documentation table cleanup | Converted absolute `blob/main/` URLs to relative paths; trimmed from 16 rows to 9 key entry points | ✅ Done |

### Audit Gap Closure

| Gap | Severity | Status |
|---|---|---|
| Missing images in README (no screenshot or diagram) | CRITICAL | ✅ Closed — SVG diagram + UI screenshot added |
| No "Known Limitations" section in customer-handover | HIGH | ✅ Closed — added |
| No "Troubleshooting" section in README | HIGH | ✅ Closed — added |
| Absolute `blob/main/` URLs instead of relative links | MEDIUM | ✅ Closed — converted |
| Documentation table too long (16 rows) | MEDIUM | ✅ Closed — trimmed to 9 |

### Commits

| Commit | Description |
|---|---|
| `15c091d` | Fix A6 Part 3 audit gaps: SVG diagram, Troubleshooting, Known Limitations, relative links, UI screenshot |

### GitHub Issues Link

| Issue | Title | Branch Contribution |
|---|---|---|
| [#192](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/192) | DOC: Polish Public Repository Entry Point & Customer-Facing Docs (A6 Part 3) | A6 Part 3 entry-point docs |
| [#194](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/194) | DOC: Fix A6 Part 3 audit gaps — SVG, troubleshooting, limitations, relative links, screenshot | A6 Part 3 audit gap fixes |

---

## 18. Completed Week 6 Contributions (Branch `18-customer-handover-update`)

All contributions on the `18-customer-handover-update` branch, organized by theme:

### A6 Part 4 — Maintain Customer Handover Documentation

| Item | Detail | Status |
|---|---|---|
| Transition Scope table | Added explicit transferred/delegated/retained breakdown with ownership notes and fork guidance | ✅ Done |
| Configuration and Secrets section | Full env var table (7 variables) from `.env.example` with Required/Default/Purpose columns + secrets handling rules (`.gitignore`, `chmod 600`, `cp .env.example .env`) | ✅ Done |
| Setup and Deployment restructure | Consolidated from scattered sections into 7 sub-sections: Prerequisites, Docker Quick Start, Local Dev, Verification Steps (health endpoints with expected responses), Recovery/Clean Rebuild, Updating, Port Conflicts | ✅ Done |
| Documentation Entry Points | 14-row table with Purpose column; explicit sufficiency assessment naming 3 Week 7 gaps (customer trial pending, final access TBD, confirmation pending) | ✅ Done |
| Handover Status enhancement | Honest Week 6 state (Ready for independent use / Pending confirmation) with explanation, expanded handover checklist, and support needs table with Week 7 action plan | ✅ Done |

### Commits

| Commit | Description |
|---|---|
| `7d3363b` | DOC: Update docs/customer-handover.md for Week 6 handover state (A6 Part 4) — Transition Scope, Configuration/Secrets, Setup/Deployment, Doc Entry Points, sufficiency assessment |

### GitHub Issues Link

| Issue | Title | Branch Contribution |
|---|---|---|
| [#18](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/18) | DOC: Update docs/customer-handover.md for Week 6 handover state (A6 Part 4) | A6 Part 4 customer handover update |

---

## 14. Key Links Index

### Repository
| Resource | Link |
|---|---|
| Repository | https://github.com/Fedos113/SWP_TickFrame_28_team |
| Issues | https://github.com/Fedos113/SWP_TickFrame_28_team/issues |
| Projects Board | https://github.com/users/Fedos113/projects/1/views/1 |
| Pull Requests | https://github.com/Fedos113/SWP_TickFrame_28_team/pulls |
| Releases | https://github.com/Fedos113/SWP_TickFrame_28_team/releases |
| Actions (CI) | https://github.com/Fedos113/SWP_TickFrame_28_team/actions |

### Milestones
| Milestone | Link |
|---|---|
| Sprint 1 | https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/1 |
| Sprint 2 (MVP v1) | https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/2 |
| Sprint 3 (A4) | https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/3 |
| Sprint 4 | https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/5 |
| Sprint 5 | https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/6 |
| Sprint 6 — MVP v3 | https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/7 |

### Maintained Docs (Assignment 6)
| Document | Path |
|---|---|
| Customer Handover | [`docs/customer-handover.md`](../../docs/customer-handover.md) |
| Contributing Guide | [`CONTRIBUTING.md`](../../CONTRIBUTING.md) |
| Agent Guidance | [`AGENTS.md`](../../AGENTS.md) |
| Roadmap | [`docs/roadmap.md`](../../docs/roadmap.md) |
| Definition of Done | [`docs/definition-of-done.md`](../../docs/definition-of-done.md) |
| Quality Requirements | [`docs/quality-requirements.md`](../../docs/quality-requirements.md) |
| Quality Requirement Tests | [`docs/quality-requirement-tests.md`](../../docs/quality-requirement-tests.md) |
| Testing Strategy | [`docs/testing.md`](../../docs/testing.md) |
| User Acceptance Tests | [`docs/user-acceptance-tests.md`](../../docs/user-acceptance-tests.md) |
| User Stories | [`docs/user-stories.md`](../../docs/user-stories.md) |
| Product Backlog | [`docs/backlog.md`](../../docs/backlog.md) |
| Interface Spec | [`docs/interface.md`](../../docs/interface.md) |
| Architecture Docs | [`docs/architecture/README.md`](../../docs/architecture/README.md) |
| Development Process | [`docs/development-process.md`](../../docs/development-process.md) |
| Changelog | [`CHANGELOG.md`](../../CHANGELOG.md) |
| README | [`README.md`](../../README.md) |

### Reports
| Week | Link |
|---|---|
| Week 6 | [`reports/week6/README.md`](../../reports/week6/README.md) |
| Week 7 | [`reports/week7/README.md`](../../reports/week7/README.md) |

### Assignment Specs
| Document | Path |
|---|---|
| Assignment 06 | [`assignments/6/Assignment_06.md`](Assignment_06.md) |
| Artifact Requirements | [`assignments/6/Artifact_Requirements.md`](Artifact_Requirements.md) |
| Process Requirements | [`assignments/Process_Requirements.md`](../Process_Requirements.md) |
| Repository Requirements | [`assignments/Repository_Requirements.md`](../Repository_Requirements.md) |
| Week 6/7 Issue Template | [`assignments/6/issue_template.md`](issue_template.md) |
| Week 6/7 Contributions | [`assignments/6/contributions.md`](contributions.md) |

---

## 15. Repository Configuration Notes

- **Default branch:** `main` (protected, direct pushes disabled)
- **Branch naming:** `<issue-number>-short-description`
- **PR workflow:** Branch → PR → review → merge commit (no squash/rebase)
- **PR template:** In [`.github/pull_request_template.md`](../../.github/pull_request_template.md)
- **Issue templates:** In [`.github/ISSUE_TEMPLATE/`](../../.github/ISSUE_TEMPLATE/) — User Story, Other PBI, Bug Report, Course Task
- **SemVer:** Tags prefixed with `v` (e.g., `v2.0.0`)
- **Secrets:** `.env` in .gitignore, `.env.example` committed
- **Lychee exclusions:** `http://` (all non-HTTPS), Google Drive, gitlab.pg.innopolis.university, file://, assignments/ directory

---

## 16. Assignment 06 TL;DR Summary

**Goal:** Deliver **MVP v3** as the final course version via Sprint 5 (Week 6) and Sprint 6 (Week 7), with customer handover, trial feedback response, maintained handover documentation, final transition, and Demo Day preparation.

**Key deliverables:**
1. Two formal Sprints: Sprint 5 (Week 6) and Sprint 6 (Week 7)
2. Week 6 trial release (SemVer) with customer trial
3. Maintained `CONTRIBUTING.md` and `AGENTS.md`
4. Maintained `docs/customer-handover.md`
5. Customer-facing documentation review
6. Transition-readiness meeting + final transition
7. `docs/roadmap.md` updated
8. Week 6 and Week 7 Sprint Reviews, Retrospectives, Reflections, LLM reports
9. Final MVP v3 release (SemVer, higher precedence)
10. Public sanitized demo video
11. Slide deck + rehearsed presentation video
12. Week 6 and Week 7 Moodle PDF submissions

---

*Last updated: 2026-07-10 (updated with `2.2.0-trial` branch contributions — indicators subsystem, drawing fixes, WS fixes)*
*Generated by: OpenCode (deepseek-v4-flash-free)*
