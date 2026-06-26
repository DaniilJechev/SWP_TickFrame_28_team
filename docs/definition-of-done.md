# Definition of Done

A PBI may be marked `Done` only when all of the following are satisfied:

- [ ] Acceptance criteria are verified
- [ ] Reviewed and approved by someone who didn't write the code
- [ ] All CI checks pass on the branch and after merge:
  - Linting (ruff)
  - Type checking (mypy)
  - Unit tests (pytest)
  - Integration tests (pytest)
  - Quality requirement tests (pytest)
  - Additional QA check (bandit)
- [ ] Line coverage ≥30% for critical modules
- [ ] Testing evidence in the PR, CI logs, or linked docs
- [ ] CHANGELOG.md updated for user-visible changes
- [ ] No secrets, credentials, or PII committed
- [ ] README or docs updated if the change affects setup/usage
- [ ] PBI linked to the current Sprint milestone
