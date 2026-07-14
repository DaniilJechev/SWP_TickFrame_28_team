# Memory7 — SWP TickFrame Team 28 · Week 7 Context File

> **Purpose:** Comprehensive AI-assistant memory file for Week 7 (Sprint 6 / Assignment 7). Contains all project context, current status, remaining gaps, and links to every relevant artifact. Update this file as Sprint 6 work progresses.

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Project Name** | SWP TickFrame |
| **Team** | 28 |
| **Repository** | https://github.com/Fedos113/SWP_TickFrame_28_team |
| **License** | MIT |
| **Description** | FastAPI-based cryptocurrency chart workstation with real-time Bybit market data, live WebSocket streaming, Lightweight Charts v5 candlestick charts, modular drawing toolbar, Fear & Greed Index, coin icons, SQLite 3-tier cache, and ML pattern analysis. |
| **Default Branch** | `main` (protected) |
| **MVP v1** | [v1.0.0](https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/SemVer) (Sprint 2) |
| **Sprint 3** | [v1.1.0](https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/v1.1.0) |
| **MVP v2** | [v2.0.0](https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/v2.0.0) (Sprint 4) |
| **Week 6 Trial** | [v2.2.0-trial] (Sprint 5) |
| **MVP v3** | TBD — final course version (Sprint 6) |

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

## 3. Current Sprint Status

### Sprint 5 (Week 6) — Completed
- **Milestone:** [Sprint 5](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/6)
- **Dates:** 2026-07-07 – 2026-07-13
- **Goal:** Week 6 trial / handover-candidate release
- **Outcome:** Trial release with indicators subsystem (445+ indicators), drawing refinements, WebSocket fixes, customer-facing documentation polish

### Sprint 6 (Week 7) — Active
- **Milestone:** [Sprint 6 — MVP v3](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/7)
- **Dates:** 2026-07-14 – 2026-07-20
- **Goal:** Deliver MVP v3 — follow-up maintenance, fixes from Week 6 trial, final transition, Demo Day preparation

---

## 4. Release Status

| Release | Tag | Date | Maps To |
|---|---|---|---|
| MVP v1 | `v1.0.0` | 2026-06-21 | Sprint 2 |
| Sprint 3 Increment | `v1.1.0` | 2026-06-26 | Sprint 3 |
| MVP v2 | `v2.0.0` | 2026-07-06 | Sprint 4 (A5) |
| Week 6 Trial | `v2.2.0-trial` | Week 6 | Sprint 5 (A6) |
| **MVP v3** | **TBD** | **Week 7** | **Sprint 6 (A7)** |

---

## 5. Key Links

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
| Sprint 5 | https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/6 |
| Sprint 6 — MVP v3 | https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/7 |

### Maintained Docs
| Document | Path |
|---|---|
| Customer Handover | [`docs/customer-handover.md`](../../docs/customer-handover.md) |
| Contributing Guide | [`CONTRIBUTING.md`](../../CONTRIBUTING.md) |
| Agent Guidance | [`AGENTS.md`](../../AGENTS.md) |
| Roadmap | [`docs/roadmap.md`](../../docs/roadmap.md) |
| Product Backlog | [`docs/backlog.md`](../../docs/backlog.md) |
| Definition of Done | [`docs/definition-of-done.md`](../../docs/definition-of-done.md) |
| Quality Requirements | [`docs/quality-requirements.md`](../../docs/quality-requirements.md) |
| Quality Requirement Tests | [`docs/quality-requirement-tests.md`](../../docs/quality-requirement-tests.md) |
| Testing Strategy | [`docs/testing.md`](../../docs/testing.md) |
| User Acceptance Tests | [`docs/user-acceptance-tests.md`](../../docs/user-acceptance-tests.md) |
| User Stories | [`docs/user-stories.md`](../../docs/user-stories.md) |
| Architecture Docs | [`docs/architecture/README.md`](../../docs/architecture/README.md) |
| Development Process | [`docs/development-process.md`](../../docs/development-process.md) |
| Changelog | [`CHANGELOG.md`](../../CHANGELOG.md) |
| README | [`README.md`](../../README.md) |

### Reports
| Week | Path |
|---|---|
| Week 6 | [`reports/week6/README.md`](../../reports/week6/README.md) |
| Week 7 | [`reports/week7/README.md`](../../reports/week7/README.md) |

---

## 6. CI Pipeline

| Job | Tool | Runs On |
|---|---|---|
| lint | `ruff check .` | push/PR to main |
| type-check | `mypy tickframe/` | push/PR to main |
| test | `pytest --cov=tickframe --cov-report=xml tests/` | push/PR to main |
| qa-check | `bandit -r tickframe/ -ll` | push/PR to main |
| frontend-lint | `eslint tickframe/frontend/js/` | push/PR to main |
| frontend-test | `vitest run` (in `tickframe/frontend/`) | push/PR to main |
| link-check | `lychee` (all `.md` files) | push/PR to main |

---

## 7. Quality Requirements & Tests

| QR ID | Metric | QRT | Status |
|---|---|---|---|
| QR-001 | p95 ≤ 500ms | QRT-001 | Active |
| QR-002 | Zero secrets in commits | QRT-002 | Active |
| QR-003 | F2 ≥ 0.55, FPR ≤ 20% | QRT-003 | Active |
| — | WebSocket Reliability | QRT-004 | Active |
| — | DB Cache Round-Trip | QRT-005 | Active |

---

## 8. Testing Status

| Type | Scope | Location | Status |
|---|---|---|---|
| Unit | Backend services | `tests/unit/` | ✅ |
| Integration | API endpoints | `tests/integration/` | ✅ |
| QRTs | 5 requirement tests | `tests/requirements/` | ✅ |
| Frontend | JS unit tests | `tickframe/frontend/js/tests/` | ✅ |

---

## 9. Completed Week 7 Contributions (Branch `7-repo`)

### A7 Scaffolding & Sprint 6 Planning

| Item | Detail | Status |
|---|---|---|
| `assignments/7/Assignment_07.md` | Week 7 spec — Sprint 6 completion, MVP v3, transition, Demo Day, 10 parts | ✅ Done |
| `assignments/7/architecture.md` | Architecture doc with updated paths for A7 | ✅ Done |
| `assignments/7/breakdown.md` | Task breakdown for Sprint 6 (30+ tasks) | ✅ Done |
| `assignments/7/context.md` | Memory7 AI context file (this file) | ✅ Done |
| `assignments/7/contributions.md` | Clean contribution tracking table for Week 7 | ✅ Done |
| `assignments/7/issue_template.md` | Issue template for A7 / Sprint 6 work | ✅ Done |

### Sprint 6 Milestone & Issue Tracking

| Item | Detail | Status |
|---|---|---|
| Sprint 6 milestone | 14 OPEN issues across 4 PBIs + 10 course tasks | ✅ Done |
| PBI-130 (#201) | PostgreSQL infrastructure migration — SQLite to PostgreSQL 17 | To Do |
| PBI-131 (#202) | Pattern filtering and confidence threshold controls | To Do |
| PBI-132 (#216) | Fix UI glitches on timeframe switch | To Do |
| PBI-133 (#217) | Implement scan results export | To Do |
| Course tasks (#218–#222) | Sprint 6 Review, Retrospective, Reflection, Transition, Docs | To Do |
| Sprint 5 milestone | Fully closed — 19 issues all marked Done | ✅ Done |
| `docs/backlog.md` | Updated Sprint 5 → Previous, Sprint 6 → Current with new PBIs | ✅ Done |
| `docs/roadmap.md` | Updated Sprint 6 planned items with new PBIs + course tasks | ✅ Done |

### Issue Creation from Customer Feedback

All issues follow `assignments/7/issue_template.md` format with AC, SP, roles, DoD checklist.

| Source | Issues Created |
|---|---|
| Sprint 4 customer feedback (Nikolay Kuzmin, 2026-07-03) | #216 PBI-132 (UI glitches), #217 PBI-133 (export) |
| Sprint 4 customer feedback (pattern filtering) | #202 PBI-131 (already existed) |
| Assignment 7 spec requirements | #218 (Sprint Review), #219 (Retro), #220 (Reflection/LLM), #221 (Transition), #222 (Docs) |

---

## 10. Key Week 7 Deliverables — Updated Status

| # | Deliverable | Status |
|---|---|---|
| 1 | Complete Sprint 6 PBIs (PBI-130–133) | Issues created, work not started |
| 2 | Release MVP v3 (SemVer) | Pending |
| 3 | Finalize product transition | Issue #221 created |
| 4 | Customer handover confirmation | Issue #221 created |
| 5 | Sprint 6 Review + Retrospective | Issues #218, #219 created |
| 6 | Week 7 reports (README, review, reflection, retrospective, LLM) | Issues #184, #220 created |
| 7 | Updated slide deck + rehearsed presentation video | Issue #185 created |
| 8 | Public sanitized demo video | Issue #183 created |
| 9 | Demo Day preparation (7-min presentation, <2-min demo) | Issue #185 created |
| 10 | Week 7 Moodle PDF submission | Pending |
| 11 | Final maintained documentation review | Issue #222 created |
| 12 | A7 scaffolding and Sprint 6 planning | ✅ Done |

---

## 11. Technology Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.11, FastAPI, Uvicorn, httpx, websockets |
| **Frontend** | Lightweight Charts v5, Canvas API, vanilla JS, lightweight-charts-drawing, lightweight-charts-indicators, oakscriptjs, Lucide icons, esbuild |
| **Database** | SQLite (via aiosqlite) |
| **ML** | XGBoost (Head & Shoulders detection), FastAPI microservice |
| **Exchange** | Bybit v5 API (primary), Binance API (fallback) |
| **Deployment** | Docker + Docker Compose (2 containers) |
| **CI** | GitHub Actions (ruff, mypy, pytest+cov, bandit, ESLint, Vitest, Lychee) |
| **AI Tools** | OpenCode (deepseek-v4-flash-free) |

---

*Last updated: 2026-07-14 (Sprint 6 / Week 7 kickoff)*
*Generated by: OpenCode (deepseek-v4-flash-free)*
