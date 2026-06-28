# LLM Usage Report — Assignment 4

---

## Tools Used

| Tool | Version / Model | Purpose |
|---|---|---|
| OpenCode | deepseek-v4-flash-free | Sprint planning, issue creation, QR definitions, QRT tests, CI config, code implementation, test writing, documentation, report drafting, UAT scenarios |

---

## Usage Areas

| Area | How AI was used |
|---|---|
| Sprint planning & backlog refinement | AI generated a plan for Sprint 3 PBIs based on customer feedback from Week 3, splitting the drawing toolbar and persistence work into manageable issues with acceptance criteria |
| PBI / issue creation | AI wrote issue descriptions across all Sprint 3 PBIs — drawing tools, SQLite persistence, undo/redo, WebSocket heartbeat, pattern analysis UI, theme persistence, CI, quality requirements |
| Quality requirements definition | AI proposed QR-001 (Performance), QR-002 (Security), QR-003 (Accuracy) with measurable targets mapped to ISO/IEC 25010 sub-characteristics |
| QRT implementation | AI wrote automated pytest test suites for each quality requirement — performance (p95 latency), security (Bandit scan, secret leak checks), accuracy (deterministic ML output) |
| CI workflow configuration | AI generated `.github/workflows/ci.yml` with ruff lint, mypy type-check, pytest coverage, and bandit security jobs running on every push and PR |
| Code implementation | AI implemented code changes for lint fixes (f-string cleanup, unused imports), mypy error resolution (Pydantic v1/v2 ConfigDict migration), and report template filling |
| Test writing | AI wrote unit tests for bybit_client, cache, detection, and schemas modules; integration tests for API endpoints; QRT suites for each quality requirement |
| Documentation | AI generated `docs/quality-requirements.md`, `docs/quality-requirement-tests.md`, `docs/testing.md`, `docs/user-acceptance-tests.md` with scenario definitions |
| Report generation | AI drafted retrospective, reflection, LLM report, customer review summary, and this report's templates — all in `reports/week4/` |
| UAT scenario design | AI proposed UAT-001 through UAT-005 with preconditions, step-by-step instructions, expected results, and execution history tables |

---

## Limitations Encountered

- `gh` CLI was not available on the local machine — issues, milestones, and releases had to be created or configured manually on GitHub
- AI cannot record videos, conduct meetings, or interact with the customer — all UAT, sprint review, and retrospective meetings were run by the team
- AI cannot take screenshots or create presentation slides — screenshots were captured manually and placed in `reports/week4/images/`
- AI cannot deploy the product or configure GitHub branch protection rules — those steps were done manually
- AI-generated test code occasionally needed minor adjustments for project-specific edge cases (e.g., fixture cleanup, assertion tolerance)
