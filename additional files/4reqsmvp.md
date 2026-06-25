# Assignment 4 — Development, Testing, and Release Plan

> Based on [Assignment_04.md](Assignment_04.md)
>
> **Prerequisite:** `4part1-plan.md` completed — Sprint 3 milestone created, PBIs defined, CI workflows in place.
>
> **Parts covered:** 4 (QRTs), 5 (Implementation), 7 (Testing), 9 (Deploy & Release)
>
> **Repository:** https://github.com/Fedos113/SWP_TickFrame_28_team — **Default branch:** `main`

---

## User Checklist (do this BEFORE sending to AI)

### PBI Selection — Choose What to Develop

Select which PBIs to implement this Sprint. The AI needs to know what you want built.

| PBI | Type | SP | Notes |
|-----|------|----|-------|
| **US-06** — Multi-coin sidebar with 10 pairs | Feature | — | Live price list sidebar |
| **US-07** — Timeframe selector (5m, 15m, 1h) | Feature | — | Chart interval switching |
| **US-08** — Drawing tools toolbar | Feature | — | Line, trend, annotation tools |
| **US-09** — Coin search/filter | Feature | — | Search bar for coin list |
| **US-10** — Volume sub-chart | Feature | — | Volume bars below candles |
| **US-11** — RSI indicator sub-chart | Feature | — | RSI line below candles |
| **US-12** — Fear & Greed Index | Feature | — | Market sentiment widget |
| **US-14** — Real-time dashboard | Feature | — | Auto-refreshing dashboard |
| **US-15** — UI polish pass | Feature | — | Layout, spacing, responsive fixes |
| **QR-001** — Performance (chart redraw \<2s) | Quality | — | Requires QRT-001 test automation |
| **QR-002** — Security (no secret leaks) | Quality | — | Requires QRT-002 test automation |
| **QR-003** — Accuracy (candle data ~0.1%) | Quality | — | Requires QRT-003 test automation |
| **QRT-001/002/003** — Automated QRTs | Automation | — | Wire each QR to a `pytest` test |
| **Testing** — Unit tests for critical modules | QA | — | bybit_client, cache, schemas, detection |
| **Testing** — Integration tests (API, WS) | QA | — | FastAPI TestClient, WebSocket |
| **Coverage** — ≥30% line coverage on critical modules | QA | — | Configure `pytest-cov`, `.coveragerc` |
| **Additional QA check** — e.g., `bandit` / `safety` | QA | — | Pick one, add to CI |

> Fill in SP (Story Points) for each selected PBI. Tell the AI: which PBIs to implement, who implements each, who reviews.

### Development info to share

- [ ] **Selected PBIs** — which of the above you want implemented (list issue numbers)
- [ ] **Story Points per PBI** — estimate each one
- [ ] **Implementer + reviewer** per PBI (must be different people)
- [ ] **Deployment target** — Docker compose (existing) or cloud VM or local-only
- [ ] **Demo video link** (if already recorded) — or tell the AI you'll provide it later

---

## Part 4: Define and Automate Quality Requirement Tests

> Prerequisite: `docs/quality-requirements.md` exists (created in `4part1-plan.md` Part 3).

### What the AI does

1. **Create [`docs/quality-requirement-tests.md`](../docs/quality-requirement-tests.md)**
2. **Define at least 1 automated QRT per quality requirement** (minimum 3). Each includes:
   - Stable ID (QRT-001 etc.)
   - Which QR it tests
   - Automation approach (`pytest`)
   - Test file path
   - Which CI job runs it
   - What evidence it produces
3. **Create `tests/requirements/` directory** with real test files:

```
tests/
├── requirements/
│   ├── test_performance.py      # QRT-001
│   ├── test_security.py         # QRT-003
│   └── test_accuracy.py         # QRT-004
├── conftest.py
└── requirements.txt  # pytest, pytest-asyncio, httpx
```

4. **Wire pytest QRTs into CI** (the CI workflow from Part 8 already includes a `test` job)
5. **Link each QRT** from the docs to its actual test file

### What you do

- [ ] Run `pip install -r tests/requirements.txt && pytest tests/` — all pass
- [ ] Verify each QRT actually tests what it claims
- [ ] Push [`docs/quality-requirement-tests.md`](../docs/quality-requirement-tests.md) and all `tests/` files

---

## Part 5: Implement Product and Quality Improvements

> Prerequisite: Sprint PBIs are created and assigned to the Sprint 3 milestone (done in `4part1-plan.md` Part 1).

### What the AI does

1. **Implement sprint PBIs** through issue-linked PRs:
   - Branch naming: `feature/<issue-number>-<short-description>` or `fix/<issue-number>-<short-description>`
   - Every PR references the issue (`Closes #XX`)
   - Every PR has a reviewer who isn't the implementer
2. **Tackle quality improvements** along the way (error handling, input validation, log sanitization)
3. **Update [`CHANGELOG.md`](../CHANGELOG.md)** — add user-visible changes under `[Unreleased]`
4. **Update [`README.md`](../README.md)** if run/deploy instructions changed
5. **Follow the existing PR template** at `.github/pull_request_template.md`

### What you do

- [ ] Review each PR — code quality, acceptance criteria, tests
- [ ] Assign a different reviewer than whoever implemented
- [ ] Merge approved PRs into `main`
- [ ] Ensure CI passes after merge

---

## Part 7: Add Automated Testing and QA Checks

### What the AI does

1. **Create [`docs/testing.md`](../docs/testing.md)** covering:
   - **Testing approach**: unit tests for services, integration tests for API + WebSocket
   - **Critical modules** (from the actual codebase):
     - `tickframe/backend/services/bybit_client.py`
     - `tickframe/backend/services/cache.py`
     - `tickframe/backend/api/endpoints.py`
     - `tickframe/backend/api/websocket.py`
     - `tickframe/detection/mock.py`
     - `tickframe/backend/models/schemas.py`
   - **Per-module target**: ≥30% line coverage
   - Test layout: `tests/unit/`, `tests/integration/`

2. **Write unit tests** in `tests/unit/`:
   - `test_bybit_client.py` — mock HTTP responses, test parsing
   - `test_cache.py` — set/get/clear
   - `test_schemas.py` — validation edge cases
   - `test_detection.py` — pattern detection logic
   - Using `pytest` + `pytest-asyncio` + `unittest.mock`

3. **Write integration tests** in `tests/integration/`:
   - `test_api_endpoints.py` — FastAPI TestClient
   - `test_websocket.py` — WebSocket connect/message
   - `test_scan_workflow.py` — end-to-end CLI scan → report

4. **Set up coverage:**
   - Add `pytest-cov`
   - Add `.coveragerc` or `pyproject.toml` with `[tool.coverage.run]`
   - Wire `--cov=tickframe --cov-report=term --cov-report=xml` into CI

5. **Pick an additional QA check** (can't be linting, formatting, type checking, build, tests, coverage, or link checking):
   - `pip-audit` / `safety` — dependency vulnerabilities
   - `bandit` — Python security linter
   - `vulture` — dead code
   - `pylint` — deeper static analysis
   - `mypy --strict` — strict type checking
   - Document the choice in `docs/testing.md`, add to CI, list limitations

### What you do

- [ ] Run `pytest --cov=tickframe tests/` — verify passes and ≥30% on critical modules
- [ ] Fix any failing tests
- [ ] Review `docs/testing.md`
- [ ] Take screenshots of coverage report and QA check result
- [ ] Push all test files, `docs/testing.md`, and `.coveragerc` or `pyproject.toml`

---

## Part 9: Deploy and Release the Sprint Increment

> Prerequisite: All Sprint PBIs merged to `main`, CI green, `CHANGELOG.md` populated.

### Requirements

| # | Requirement | Source |
|---|-------------|--------|
| 1 | Deploy the Sprint increment so customer + TA can access it | §9.2 |
| 2 | Make it available **before** UAT | §9.3 |
| 3 | Keep it accessible until grading is done | §9.4 |
| 4 | Create a SemVer release tagged `v`*[version]* on the protected default branch | §9.5 |
| 5 | Release must link to: Sprint milestone, deployment/run instructions, demo video, built artifacts | §9.6 |
| 6 | Update `CHANGELOG.md` — move `[Unreleased]` into a dated `[x.y.z]` section | §9.7 |
| 7 | Preserve release, tag, deployment, and quality evidence for later Sprints | §9.8 |

### Step 1 — Verify readiness

```bash
git checkout main && git pull origin main
```

- [ ] Latest `main` CI run is passing (https://github.com/Fedos113/SWP_TickFrame_28_team/actions)
- [ ] All Sprint PRs are merged
- [ ] `CHANGELOG.md` has `[Unreleased]` entries for this Sprint
- [ ] `README.md` has correct run/deploy instructions
- [ ] Public demo video recorded (< 2 min, sanitized data)

### Step 2 — Update CHANGELOG.md

Replace `[Unreleased]` with the new version and date. Add empty `[Unreleased]` above:

```markdown
## [Unreleased]

### Added
- Nothing yet.

### Changed
- Nothing yet.

### Fixed
- Nothing yet.

---

## [0.2.0] — 2026-07-XX

### Added
- [List user-visible additions from this Sprint]

### Changed
- [List changes]

### Fixed
- [List fixes]

---

[Unreleased]: https://github.com/Fedos113/SWP_TickFrame_28_team/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/v0.2.0
```

- [ ] Move `[Unreleased]` entries into `[0.2.0]`
- [ ] Add empty `[Unreleased]` section at top
- [ ] Add `[0.2.0]:` reference link
- [ ] Update `[Unreleased]:` compare link to `compare/v0.2.0...HEAD`
- [ ] Commit and push to `main`

### Step 3 — Deploy

**Option A — Docker:**
```bash
docker compose up --build -d
```

**Option B — Local access:**
- Update `README.md` with exact run instructions
- Ensure `pip install -r requirements.txt && python -m tickframe serve` works

- [ ] Product reachable at documented URL
- [ ] `README.md` has accurate run/deploy instructions
- [ ] Link to deployed product in `reports/week4/README.md`

### Step 4 — Create the SemVer Release

**Using `gh`:**
```bash
gh release create v0.2.0 \
  --title "v0.2.0 — Assignment 4 Sprint Increment" \
  --notes "**Milestone:** https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/3
**Deployment:** [URL]
**Demo video:** [link]
**Changelog:** ./CHANGELOG.md" \
  --target main
```

**Using GitHub UI:**
1. Go to https://github.com/Fedos113/SWP_TickFrame_28_team/releases/new
2. Tag: `v0.2.0` — Target: `main`
3. Title: `v0.2.0 — Assignment 4 Sprint Increment`
4. Description includes Sprint milestone link, deploy instructions link, demo video link
5. Publish

**Release must include:**
- [x] SemVer tag `v0.2.0`
- [x] Points to commit on `main`
- [x] Identifies as Assignment 4 Sprint increment
- [x] Links to Sprint 3 milestone
- [x] Links to deployment/run instructions
- [x] Links to public sanitized demo video
- [ ] Links to relevant built artifacts (optional)

### Step 5 — Update Week 4 Report

Update `reports/week4/README.md`:

| Section | Update |
|---------|--------|
| §3. Deployed Product | Actual deployment URL |
| §11. Release | Replace placeholder with real release link, add demo video link |

Screenshot the release page → `reports/week4/images/semver-release.png`.

### Step 6 — Final Verify

- [ ] `https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/v0.2.0` returns 200
- [ ] Release description links work
- [ ] `CHANGELOG.md` has `[0.2.0]` with dated entries
- [ ] Deployed product reachable by customer and TA
- [ ] Screenshot saved → `reports/week4/images/semver-release.png`

---

## Required Evidence

| Evidence | Location |
|----------|----------|
| QRT documentation | [`docs/quality-requirement-tests.md`](../docs/quality-requirement-tests.md) |
| QRT test files | `tests/requirements/test_*.py` |
| Product changes | Merged PRs into `main` |
| Updated CHANGELOG | [`CHANGELOG.md`](../CHANGELOG.md) |
| Updated README | [`README.md`](../README.md) |
| Testing strategy | [`docs/testing.md`](../docs/testing.md) |
| Unit + integration tests | `tests/unit/`, `tests/integration/` |
| Coverage config | `.coveragerc` or `pyproject.toml` |
| Additional QA check in CI | `.github/workflows/ci.yml` |
| SemVer release | `https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/v0.2.0` |
| Deployed product | URL in `reports/week4/README.md` |
| Release screenshot | `reports/week4/images/semver-release.png` |
| Coverage + QA screenshots | `reports/week4/images/` |
