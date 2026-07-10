# Contributing to SWP TickFrame

Thank you for your interest in contributing! This document outlines the workflow, standards, and expectations for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [CI Pipeline](#ci-pipeline)
- [Pull Request Process](#pull-request-process)
- [Definition of Done](#definition-of-done)

---

## Code of Conduct

This project adheres to common open-source etiquette. Be respectful, constructive, and inclusive. Harassment, trolling, and personal attacks are not tolerated.

---

## How to Contribute

1. **Find or create an issue** — Check the [issues page](https://github.com/Fedos113/SWP_TickFrame_28_team/issues) for existing work. If you're adding something new, create an issue first.
2. **Create a branch** — Branch from `main` using the naming convention `<issue-number>-short-description` (e.g., `42-add-rsi-indicator`).
3. **Make your changes** — Follow the coding standards below.
4. **Run tests locally** — Ensure all CI checks pass (see [Testing](#testing)).
5. **Open a pull request** — Target `main`, fill in the PR template, and request a review.
6. **Address review feedback** — Make requested changes and re-request review.
7. **Merge** — Once approved and CI is green, the PR is merged by a maintainer.

---

## Development Setup

### Prerequisites
- Python 3.11+
- Node.js 20+
- Docker + Docker Compose (optional, for containerized development)

### Backend
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -r tests/requirements.txt
```

### Frontend
```bash
cd tickframe/frontend
npm install
npm run build       # Build drawing bundle via esbuild
```

### Docker (full environment)
```bash
docker compose up --build
```

---

## Coding Standards

### Python
- **Style:** [ruff](https://docs.astral.sh/ruff/) — all rules enabled by default config
- **Type checking:** [mypy](https://mypy-lang.org/) — strict mode for `tickframe/`
- **Security:** [bandit](https://bandit.readthedocs.io/) — level `-ll` for `tickframe/`
- Run: `ruff check . && mypy tickframe/ && bandit -r tickframe/ -ll`

### JavaScript
- **Linting:** [ESLint](https://eslint.org/) — flat config at `tickframe/frontend/eslint.config.js`
- Run: `npm run lint` (inside `tickframe/frontend/`)

### General
- Follow existing patterns in the codebase
- No secrets, credentials, or PII in commits
- Keep functions focused and well-named
- No commented-out code

---

## Testing

### Backend tests (pytest)
```bash
pytest --cov=tickframe tests/
```

### Frontend tests (Vitest)
```bash
cd tickframe/frontend && npm test
```

### Quality Requirement Tests
```bash
pytest tests/requirements/
```

### Test expectations
- All existing tests must pass before opening a PR
- New features should include unit tests for critical logic
- Coverage should not regress for critical modules
- QRTs must remain passing

---

## CI Pipeline

The following checks run automatically on every push and PR to `main`:

| Job | Tool | Command |
|---|---|---|
| lint | ruff | `ruff check .` |
| type-check | mypy | `mypy tickframe/` |
| test | pytest | `pytest --cov=tickframe tests/` |
| qa-check | bandit | `bandit -r tickframe/ -ll` |
| frontend-lint | ESLint | `npm run lint` |
| frontend-test | Vitest | `npm test` |
| link-check | lychee | Lychee link checker on all `.md` files |

All checks must pass before a PR can be merged.

---

## Pull Request Process

1. Use the [PR template](../.github/pull_request_template.md) — it includes sections for summary, testing evidence, and changelog checkbox.
2. Assign the PR to the current Sprint milestone.
3. Request review from at least one other team member.
4. Ensure all CI checks pass.
5. Update `CHANGELOG.md` under the `[Unreleased]` section if your change is user-visible.
6. Link related issues in the PR description (e.g., `Closes #42`).

---

## Definition of Done

A contribution is considered "done" when:
- All acceptance criteria verified
- Reviewed and approved by a different person
- All CI checks pass
- `CHANGELOG.md` updated for user-visible changes
- No secrets or PII committed
- Documentation updated if applicable
- Quality requirements not regressed
- PR linked to the current milestone

See [docs/definition-of-done.md](docs/definition-of-done.md) for the full checklist.
