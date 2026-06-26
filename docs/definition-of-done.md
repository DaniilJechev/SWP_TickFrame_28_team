# Definition of Done

A PBI may be marked `Done` only when **all** of the following criteria are satisfied:

## Quality Criteria

- [ ] **Acceptance criteria are verified** — every AC in the PBI description passes manual or automated verification
- [ ] **Reviewed and approved** by someone who did not write the code (reviewer must be a different person from the implementer)
- [ ] **PR links to the Sprint 3 milestone** or current active milestone

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
| Coverage | `pytest --cov=tickframe` | ≥30% line coverage for critical modules |

- [ ] **Testing evidence** is visible in the PR, CI logs, or linked documentation

## Code Quality

- [ ] **CHANGELOG.md updated** for any user-visible changes (new features, bug fixes, breaking changes)
- [ ] **No secrets, credentials, or PII committed** (verified by bandit and manual review)
- [ ] **README or docs updated** if the change affects setup, configuration, or usage
- [ ] **Code follows project conventions** (no commented-out code, no dead imports, meaningful names)

## Quality Requirements

For changes affecting performance, security, or functional correctness:

- [ ] **QR-001 (Performance):** No measurable regression in API response times (verified by QRT-001)
- [ ] **QR-002 (Security):** No new Bandit findings introduced (verified by QRT-002)
- [ ] **QR-003 (Accuracy):** Pattern detection accuracy maintained (verified by QRT-003)
