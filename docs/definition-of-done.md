# Definition of Done

A PBI may be marked `Done` only when **all** of the following criteria are satisfied:

## Quality Criteria

- [ ] **Acceptance criteria are verified** — every AC in the PBI description passes manual or automated verification
- [ ] **Reviewed and approved** by someone who did not write the code (reviewer must be a different person from the implementer)
- [ ] **PR links to the current active Sprint milestone**
- [ ] **WebSocket reconnection verified** — frontend recovers from connection drop within 5 seconds (if change touches WebSocket)

## CI & Automation

- [ ] **All CI checks pass on the branch and after merge:**

| Check | Tool | Target |
|---|---|---|
| Linting | `ruff check .` | Zero errors |
| Type checking | `mypy tickframe/` | Zero errors |
| Unit tests | `pytest tests/unit/` | All pass |
| Integration tests | `pytest tests/integration/` | All pass |
| Quality requirement tests | `pytest tests/requirements/` | All pass |
| Additional QA check | `bandit -r tickframe/ -ll` | Zero high-severity findings |
| Link checking | `lychee ./**/*.md` | Zero broken links |
| Frontend JS tests | `vitest run` (in `tickframe/frontend/`) | All pass |
| Frontend lint | `eslint js/` (in `tickframe/frontend/`) | Zero errors |
| Coverage | `pytest --cov=tickframe` | ≥30% line coverage for critical modules |

- [ ] **Testing evidence** is visible in the PR, CI logs, or linked documentation

## Code Quality

- [ ] **CHANGELOG.md updated** for any user-visible changes (new features, bug fixes, breaking changes)
- [ ] **No secrets, credentials, or PII committed** (verified by bandit and manual review)
- [ ] **README or docs updated** if the change affects setup, configuration, or usage
- [ ] **Code follows project conventions** (no commented-out code, no dead imports, meaningful names)
- [ ] **For user stories: linked supporting PBIs provide the required implementation, review, and verification evidence**

## Architecture Documentation & ADRs

For changes affecting the system architecture, components, deployment, or quality requirements:

- [ ] **Architecture documentation satisfied** — `docs/architecture/README.md` and relevant view diagrams reflect the change (or N/A explicitly documented)
- [ ] **ADRs satisfied or updated** — relevant Architecture Decision Records in `docs/architecture/adr/` reflect the change (or N/A explicitly documented)

## Quality Requirements

For changes affecting performance, security, or functional correctness:

- [ ] **QR-001 (Performance):** No measurable regression in API response times (verified by QRT-001)
- [ ] **QR-002 (Security):** No new Bandit findings introduced (verified by QRT-002)
- [ ] **QR-003 (Accuracy):** Pattern detection accuracy maintained (verified by QRT-003)
