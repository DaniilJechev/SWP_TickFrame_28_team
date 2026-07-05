# LLM Usage Report — Assignment 5

---

## Tools Used

| Tool | Version / Model | Purpose |
|---|---|---|
| OpenCode | deepseek-v4-flash-free | Code generation, test writing, CI configuration, documentation, report drafting, delivery plans |

---

## Usage Areas

| Area | How AI was used |
|---|---|
| Sprint planning & backlog refinement | AI generated delivery plans (2-plan.md through 7-plan.md) with structured checklists for Parts 3–13 and Moodle PDF submission |
| Test generation | AI wrote WebSocket unit tests (8 tests), Database unit tests (14 tests), QRT-004 (WebSocket reliability), QRT-005 (DB cache round-trip), and extended existing tests for multi-interval and analysis range |
| CI configuration | AI added frontend-lint (ESLint) and frontend-test (Vitest) jobs to `.github/workflows/ci.yml`; generated ESLint flat config |
| Architecture diagrams | AI generated initial PlantUML source for static-view (component), dynamic-view (sequence), and deployment-view diagrams — team members refined and rendered to SVG |
| ADR drafting | AI drafted ADR-001 (WebSocket), ADR-002 (SQLite), ADR-003 (Microservice) — reviewed and edited by team |
| Documentation | AI generated initial drafts of `docs/development-process.md`, `docs/testing.md`, `docs/quality-requirements.md`, `docs/quality-requirement-tests.md`, `docs/definition-of-done.md` with Sprint 4 changes |
| Report generation | AI drafted Sprint Review transcript, summary, retrospective, reflection, LLM report, and the 42-item README from raw transcript input |
| Context management | AI maintained and updated `assignments/5/context.md` with running gap analysis and contribution tracking |

---

## Limitations Encountered

- AI-generated PlantUML diagrams had syntax errors and required manual refinement — especially for alt/opt fragments in sequence diagrams
- AI occasionally generated plausible but incorrect code (non-existent method names, wrong imports) — all generated code was reviewed by humans before merging
- AI cannot record videos, conduct meetings, or interact with the customer — all UAT, Sprint Review, and retrospective meetings were run by the team
- AI cannot take screenshots, create GitHub releases, or configure repository settings — those steps were done manually
- Test generation sometimes produced trivial tests — human review ensured meaningful coverage
