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
| Repo template generation | AI created template for the week 5 repo, created empty files and folders |
| CI configuration | AI added frontend-lint (ESLint) and frontend-test (Vitest) jobs to `.github/workflows/ci.yml`; generated ESLint flat config |
| ADR drafting | AI drafted ADR-001 (WebSocket), ADR-002 (SQLite), ADR-003 (Microservice) — reviewed and edited by team |
| Context management | AI maintained and updated `assignments/5/context.md` with running gap analysis and contribution tracking |

---

## Limitations Encountered

- AI cannot record videos, conduct meetings, or interact with the customer — all UAT, Sprint Review, and retrospective meetings were run by the team
- AI cannot take screenshots, create GitHub releases, or configure repository settings — those steps were done manually
- Test generation sometimes produced trivial tests — human review ensured meaningful coverage
- AI templates and drafts sometimes do not capture the whole week5 structure of contributions
