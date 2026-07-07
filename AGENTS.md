# AI Agent Guidance for SWP TickFrame

This document provides context and safety rules for AI coding assistants (e.g., OpenCode, GitHub Copilot) working in this repository.

## Project Overview

SWP TickFrame is a FastAPI-based cryptocurrency chart workstation with real-time Bybit market data, WebSocket streaming, Lightweight Charts v5 candlestick charts, a modular drawing toolbar, and ML pattern analysis.

- **Backend:** Python 3.11, FastAPI, httpx, websockets, SQLite
- **Frontend:** Lightweight Charts v5, vanilla JS, Canvas API, esbuild
- **CI:** GitHub Actions (ruff, mypy, pytest+cov, bandit, ESLint, Vitest, Lychee)
- **ML:** XGBoost head-and-shoulders detection microservice

## Safety Rules

These rules must be followed by any AI tool modifying this repository:

1. **Do not commit secrets.** Never write real API keys, tokens, passwords, or credentials into any file. Use `.env` for local secrets and `.env.example` for sanitized templates.
2. **Do not modify CI workflows without explicit human approval.** CI configuration in `.github/workflows/` is critical for quality gates.
3. **Do not rewrite Git history.** No force-push, rebase, or squash. Always use merge commits.
4. **Do not delete or disable existing tests, quality requirement tests, or CI checks.** If a change makes a check obsolete, document the replacement in the PR.
5. **Run all local checks before suggesting a PR.** See the verification checklist in `CONTRIBUTING.md`.
6. **Update `CHANGELOG.md`** for user-visible changes under `[Unreleased]`.
7. **Update relevant documentation** when changing interfaces, architecture, quality requirements, or user-facing behavior.
8. **Follow the existing code style.** Match the conventions found in neighboring files.
9. **Do not create files outside the repository structure without asking.** New files must follow the existing conventions.

## Known Context for AI Agents

### Repository Structure

```
.github/             — CI workflows, issue templates, PR template
tickframe/           — Main Python package
  backend/           — FastAPI app, API endpoints, services, models
  frontend/          — HTML, CSS, JS (Lightweight Charts, drawing toolbar)
ml_service/          — ML pattern detection microservice
tests/               — Unit, integration, requirements (QRTs), frontend tests
docs/                — All maintained project documentation
assignments/         — Assignment specs and context files
reports/             — Weekly Sprint reports
```

### Key Files

| File | Purpose |
|---|---|
| `tickframe/backend/main.py` | FastAPI app entry point |
| `tickframe/backend/api/endpoints.py` | REST API routes |
| `tickframe/backend/api/websocket.py` | WebSocket market data streams |
| `tickframe/frontend/js/charts.js` | Lightweight Charts v5 integration |
| `tickframe/frontend/js/app.js` | Main frontend init |
| `docs/architecture/adr/` | Architecture Decision Records |
| `docs/backlog.md` | Product Backlog index |
| `docs/roadmap.md` | Sprint-by-Sprint delivery plan |
| `docs/customer-handover.md` | Customer transition documentation |
| `CONTRIBUTING.md` | Contributor guidance |
| `CHANGELOG.md` | Keep a Changelog format |
| `docs/development-process.md` | Detailed workflow description |

### Active Sprints

- **Sprint 5** (Week 6, 2026-07-07 – 2026-07-13): Week 6 trial / handover-candidate release.
- **Sprint 6** (Week 7, 2026-07-14 – 2026-07-20): MVP v3 — final course version.

See `docs/roadmap.md` for details.

### Current Technology Versions

- Python 3.11+
- Lightweight Charts v5
- Node.js (for frontend build tooling)

### Branch Naming

`<issue-number>-short-description` (e.g., `42-add-login-form`)

### PR Workflow

Branch → PR → review (one approval required) → merge commit → CI must pass before merge.

## Assignments Reference

The current assignment is **Assignment 6**. Key specs:

- `assignments/6/Assignment_06.md` — main spec with all 14 parts
- `assignments/6/context.md` — comprehensive context file
- `assignments/Artifact_Requirements.md` — shared artifact rules
- `assignments/Process_Requirements.md` — Scrum/workflow semantics
- `assignments/Repository_Requirements.md` — platform/repo mechanics

## Questions for the Human

When uncertain about:
- Which Sprint a change belongs to
- Whether a change is user-visible (for CHANGELOG.md)
- Whether documentation needs updating
- Implementation approach for a feature

Ask the human before proceeding.
