# Assignment 4 — LLM Plan for Parts 1–8 (Product & Quality Sprint)

> Based on [Assignment_04.md](Assignment_04.md)
>
> **Repository:** https://github.com/Fedos113/SWP_TickFrame_28_team — **Default branch:** `main`
>
> **Current state:** Python 3.11 / FastAPI / Lightweight Charts — Sprint 2 milestone done (MVP v1) — only CI is Lychee link checking — **zero tests exist** — no `docs/testing.md`, `quality-requirements.md`, `quality-requirement-tests.md`, or `user-acceptance-tests.md`

---

## Human-Like Writing Instructions (read this first)

When generating content, avoid anything that reads like an AI wrote it:

- **Avoid over-explaining** — don't define things everyone already knows. If you're describing a test framework, just name it and move on.
- **Skip the fluff** — no "in today's digital landscape" or "it is worth noting that". Just say what needs saying.
- **No generic filler** — every sentence should carry meaning. If it doesn't add value, cut it.
- **Write for the project context** — this is TickFrame, a crypto chart tool. The tone can be slightly more direct and technical. Adjust accordingly.

---

## User Checklist (do these BEFORE sending to AI)

### GitHub setup — you can do this with write access
- [ ] Install `gh` CLI locally (`winget install --id GitHub.cli` or from https://cli.github.com/) — the AI needs it to create milestones, issues, and project board items
- [ ] Authenticate `gh` with `gh auth login` (select HTTPS, login with a browser, grant repo+project permissions)
- [ ] If `gh` is not an option, just tell the AI to output everything as text and you'll create issues/milestones/PRs manually
- [ ] Make sure you have at least **write** access to the repo (needed to push branches, merge PRs, create milestones)

### Information you need to gather and share with the AI
- [ ] **Sprint dates** — pick start/end dates and tell the AI (e.g., `2026-06-25` to `2026-07-02`)
- [ ] **Sprint Goal** — should be value-focused, not a feature list (e.g., "Deliver a quality-gated increment with automated tests, CI, and UAT-ready product")
- [ ] **Sprint scope priorities** — what matters most this sprint? Options:
  - Finish backlog features like US-07 (timeframe selector), US-06 (sidebar live prices), US-11 (RSI chart)
  - Focus on quality foundations: tests, CI, coverage, DoD — and ship fewer features
  - A mix of both — tell the AI your preference
- [ ] **Total Story Points** — roughly how much can the team deliver? (e.g., 20–30 SP)
- [ ] **Team member info:**
  - GitHub usernames
  - Scrum roles (Scrum Master, Product Owner, Developers)
  - Who implements vs. who reviews (can't be the same person)
- [ ] **Customer feedback** — share whatever you have:
  - [`reports/week3/customer-review-transcript.md`](../reports/week3/customer-review-transcript.md) — the Sprint Review transcript
  - [`reports/week3/customer-review-summary.md`](../reports/week3/customer-review-summary.md) — the summary
  - Any emails, messages, or notes from the customer since then
- [ ] **Tell the AI how you want to work:**
  - Option A: AI uses `gh` to directly create milestones, issues, PRs on GitHub
  - Option B: AI generates all the markdown and you paste/create it manually

### Existing things the AI will read
| What | Where to find it |
|---|---|
| Current DoD | [`docs/definition-of-done.md`](../docs/definition-of-done.md) — basic 18 lines, needs work |
| Current roadmap | [`docs/roadmap.md`](../docs/roadmap.md) — Sprint 1, Sprint 2, and a backlog |
| User stories | [`docs/user-stories.md`](../docs/user-stories.md) — US-01 through US-15 |
| Interface docs | [`docs/interface.md`](../docs/interface.md) — CLI commands and options |
| CHANGELOG | [`CHANGELOG.md`](../CHANGELOG.md) — v1.0.0 released 2026-06-21 |
| README | [`README.md`](../README.md) — Docker setup, FastAPI, CLI, architecture |
| CI so far | [`.github/workflows/lychee.yml`](../.github/workflows/lychee.yml) — just link checking |
| Issue templates | [`.github/ISSUE_TEMPLATE/`](../.github/ISSUE_TEMPLATE/) — 4 templates ready |
| PR template | [`.github/pull_request_template.md`](../.github/pull_request_template.md) |
| Sprint 1 milestone | https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/1 |
| Sprint 2 milestone | https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/2 |
| Project board | https://github.com/users/Fedos113/projects/1/views/1 |
| Week 3 report | [`reports/week3/README.md`](../reports/week3/README.md) |
| Customer transcript | [`reports/week3/customer-review-transcript.md`](../reports/week3/customer-review-transcript.md) |
| Customer summary | [`reports/week3/customer-review-summary.md`](../reports/week3/customer-review-summary.md) |

---

## Part 1: Refine the Product Backlog and Plan the Sprint

### What the AI does

1. **Pull existing issues** — run `gh issue list` (or parse from docs). Open ones include: US-01 (#5), US-02 (#6), US-06 (#15), US-07 (#18), US-08 (#8), US-09 (#9), US-10 (#11), US-11 (#13), US-12 (#14), US-14 (#17), US-08-1 (#22), US-15 (#41)
2. **Look at customer feedback** from the week 3 reports — figure out what gaps, risks, or quality problems to tackle
3. **Create new PBIs** as GitHub Issues using the existing templates. These should cover:
   - Quality requirements (at least 3 separate PBIs)
   - QRT-related automation (at least 3)
   - Testing and coverage work
   - CI setup
   - Additional QA check
   - Any feature/bugfix work selected for this sprint
   - Every PBI gets: acceptance criteria, story points, assignee, reviewer
4. **Create the Sprint 3 milestone** (Assignment 4 sprint = Sprint 3):
   - URL: `https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/3`
   - Title: `Sprint 3 — Assignment 4`
   - Dates + Sprint Goal from what you told the AI
5. **Assign the selected PBIs** to that milestone
6. **Update the project board** at https://github.com/users/Fedos113/projects/1/views/1:
   - Add a Sprint 3 view (or repurpose the existing one)
   - Columns: To Do, In Progress, Review, Done
   - Visible fields: priority, SP, assignee, status, milestone
7. **Update [`docs/roadmap.md`](../docs/roadmap.md)** — add a Sprint 3 section with milestone link, dates, goal, and notes about ongoing quality/automation work

### What you do after the AI finishes

- [ ] Check the new/updated PBIs on GitHub — make sure they look right
- [ ] Verify the Sprint 3 milestone at `https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/3`
- [ ] Peek at the project board to see if columns make sense
- [ ] Review [`docs/roadmap.md`](../docs/roadmap.md) and push if it looks good

---

## Part 2: Respond to Customer Feedback on the MVP

### What the AI does

1. **Dig through all customer feedback** from:
   - [`reports/week3/customer-review-transcript.md`](../reports/week3/customer-review-transcript.md) — the meeting transcript with timestamps
   - [`reports/week3/customer-review-summary.md`](../reports/week3/customer-review-summary.md) — dated 19.06.2026, covers Fear&Greed Index feedback, volume chart requests, RSI, drawing tools, theme toggle, chart colors
   - Anything extra you've shared
2. **Create or update PBIs** for the feedback you want to address
3. **Build the customer feedback response table** for [`reports/week4/README.md`](../reports/week4/README.md):

```markdown
| Feedback point | Resulting PBI or issue | Status | Response |
|---|---|---|---|
| Customer wanted Fear & Greed Index | [#14](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/14) | Planned for Sprint 3 | Moved into scope |
| Customer asked for volume chart | [#11](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/11) | Not planned | Deferred — quality/CI took priority |
```

4. For feedback you're **not addressing**: give a clear reason and link the backlog item

### What you do after the AI finishes

- [ ] Make sure the table actually matches what your team decided
- [ ] For anything marked "Not planned", the justification should hold up
- [ ] Commit and push the report changes when ready

---

## Part 3: Define Quality Requirements

### What the AI does

1. **Read the reference** at https://github.com/Alexey-Popov/awesome-ai-architect/blob/main/solution-architecture/quality-attributes.md
2. **Create [`docs/quality-requirements.md`](../docs/quality-requirements.md)** — doesn't exist yet
3. **Define at least 3 quality requirements**, each using a **different ISO/IEC 25010 sub-characteristic**

   The AI will probably propose something like:

   | ID | Sub-characteristic | Gist of the scenario |
   |---|---|---|
   | QR-001 | Performance Efficiency — Time behaviour | Chart redraws within 2s under 10 concurrent users |
   | QR-002 | Reliability — Availability | Dashboard hits 99.5% uptime during trading hours |
   | QR-003 | Security — Confidentiality | API keys in `.env` never leak into logs, UI, or errors |
   | QR-004 | Functional Suitability — Accuracy | Bybit candle data matches source within 0.1% |
   | QR-005 | Usability — Operability | New user finishes scan + chart workflow in under 3 min |

4. Each one includes:
   - Stable ID (QR-001 etc.)
   - The ISO/IEC 25010 sub-characteristic
   - Full scenario format: stimulus → source → environment → artifact → response → response measure
   - Why it matters for TickFrame
   - Links to QRTs and affected PBIs

### What you do after the AI finishes

- [ ] Read through — are these actually measurable? Do they make sense for the product?
- [ ] Double-check each uses a *different* sub-characteristic
- [ ] Push [`docs/quality-requirements.md`](../docs/quality-requirements.md)

---

## Part 4: Define and Automate Quality Requirement Tests

### What the AI does

1. **Create [`docs/quality-requirement-tests.md`](../docs/quality-requirement-tests.md)** — doesn't exist yet
2. **Define at least 1 automated QRT per quality requirement** (minimum 3)
3. Each QRT spells out:
   - Stable ID (QRT-001 etc.)
   - Which QR it tests
   - How it's automated (probably `pytest`)
   - File path for the test
   - Which CI job runs it
   - What evidence it produces
4. **Create a `tests/` directory** at the project root with real tests:

   ```
   tests/
   ├── requirements/
   │   ├── test_performance.py      # QRT-001
   │   ├── test_security.py         # QRT-003
   │   └── test_accuracy.py         # QRT-004
   ├── conftest.py
   └── requirements.txt  # pytest, pytest-asyncio, httpx
   ```

5. **Wire pytest into CI** so QRTs run on every push and PR to `main`
6. **Link each QRT** from the docs to its actual test file

### What you do after the AI finishes

- [ ] Run `pip install -r tests/requirements.txt` then `pytest tests/` — everything should pass
- [ ] Check each QRT actually tests what it claims to
- [ ] Push [`docs/quality-requirement-tests.md`](../docs/quality-requirement-tests.md) and all the `tests/` files

---

## Part 5: Implement Product and Quality Improvements

### What the AI does

1. **Implement sprint PBIs** through issue-linked PRs:
   - Branch naming: `feature/<issue-number>-<short-description>` or `fix/<issue-number>-<short-description>`
   - Every PR references the issue (`Closes #XX`)
   - Every PR has a reviewer who isn't the implementer
2. **Tackle quality improvements** along the way:
   - Better error handling, input validation, log sanitization
   - Possibly add `pyproject.toml` for Python packaging
3. **Update [`CHANGELOG.md`](../CHANGELOG.md)** — add user-visible changes under `[Unreleased]`
4. **Update [`README.md`](../README.md)** if run/deploy instructions changed
5. **Follow the existing PR template** at `.github/pull_request_template.md`

### What you do after the AI finishes

- [ ] Review each PR — code quality, acceptance criteria, tests
- [ ] Assign a different reviewer than whoever implemented it
- [ ] Merge approved PRs into `main`
- [ ] Make sure CI passes after merging

---

## Part 6: Update the Definition of Done

### What the AI does

1. **Rewrite [`docs/definition-of-done.md`](../docs/definition-of-done.md)** — the current one is a bare-bones Assignment 3 version
2. The new DoD needs everything below:

   ```markdown
   - [ ] Acceptance criteria are verified
   - [ ] Reviewed and approved by someone who didn't write the code
   - [ ] All CI checks pass on the branch and after merge:
     - Linting (ruff/flake8)
     - Type checking (mypy/pyright)
     - Unit tests (pytest)
     - Integration tests (pytest)
     - Quality requirement tests (pytest)
     - Additional QA check (bandit/safety/etc.)
   - [ ] Line coverage ≥30% for critical modules
   - [ ] Testing evidence in the PR, CI logs, or linked docs
   - [ ] CHANGELOG.md updated for user-visible stuff
   - [ ] No secrets, credentials, or PII committed
   - [ ] README or docs updated if the change affects setup/usage
   - [ ] PBI linked to the Assignment 4 milestone
   ```

### What you do after the AI finishes

- [ ] Check the DoD works for your team's actual tooling
- [ ] Push it and enforce it for every PBI going forward

---

## Part 7: Add Automated Testing and QA Checks

### What the AI does

1. **Create [`docs/testing.md`](../docs/testing.md)** — doesn't exist yet. It covers:
   - **Testing approach**: unit tests for services, integration tests for API + WebSocket
   - **Critical modules** (pulled from the actual codebase):
     - `tickframe/backend/services/bybit_client.py` — talks to Bybit
     - `tickframe/backend/services/cache.py` — in-memory cache
     - `tickframe/backend/api/endpoints.py` — REST endpoints
     - `tickframe/backend/api/websocket.py` — WebSocket streams
     - `tickframe/detection/mock.py` — ML pattern detection
     - `tickframe/backend/models/schemas.py` — data models
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

4. **Set up coverage**:
   - Add `pytest-cov`
   - Add `.coveragerc` or `pyproject.toml` with `[tool.coverage.run]`
   - Wire `--cov=tickframe` into CI

5. **Pick an additional QA check** (can't be linting, formatting, type checking, build, tests, coverage, or link checking — Lychee already covers links):
   - Good options for this Python project:
     - `pip-audit` / `safety` — dependency vulnerabilities
     - `bandit` — Python security linter
     - `vulture` — dead code
     - `pylint` — deeper static analysis
     - `mypy --strict` — strict type checking
   - Document the choice in `docs/testing.md` and add it to CI
   - For the report: what was considered, what was picked, the risk it addresses, CI location, limitations

### What you do after the AI finishes

- [ ] Run `pytest --cov=tickframe tests/` — verify it passes and coverage hits ≥30% on critical modules
- [ ] Fix any tests that fail
- [ ] Review `docs/testing.md`
- [ ] Take screenshots of:
  - Coverage report
  - Additional QA check results
- [ ] Push all test files, `docs/testing.md`, and `.coveragerc` or `pyproject.toml`

---

## Part 8: Configure CI

### What the AI does

1. **Create or rewrite CI workflows** in `.github/workflows/`:
   - Currently only [`.github/workflows/lychee.yml`](../.github/workflows/lychee.yml) exists
   - **Create `ci.yml`** with jobs for linting, type checking, tests + coverage, and the additional QA check:

   ```yaml
   name: CI

   on:
     push: { branches: [main] }
     pull_request: { branches: [main] }

   jobs:
     lint:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-python@v5
           with: { python-version: "3.11" }
         - run: pip install ruff
         - run: ruff check .

     type-check:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-python@v5
           with: { python-version: "3.11" }
         - run: pip install mypy
         - run: mypy tickframe/

     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-python@v5
           with: { python-version: "3.11" }
         - run: pip install -r requirements.txt
         - run: pip install pytest pytest-asyncio httpx pytest-cov
         - run: pytest --cov=tickframe --cov-report=term --cov-report=xml tests/

     qa-check:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-python@v5
           with: { python-version: "3.11" }
         - run: pip install bandit
         - run: bandit -r tickframe/ -ll
   ```

2. **Keep the Lychee workflow** as-is
3. **Make sure the latest CI run on `main` passes** before submission

> **Note on branch protection:** Setting up required status checks on the default branch needs admin rights in GitHub Settings. If nobody on the team has admin, that's fine — the CI workflows will still run on every PR. Just note in the report that branch protection couldn't be configured. The tests and checks still work as safety gates for anyone reviewing PRs.

### What you do after the AI completes

- [ ] If someone on the team **does** have admin access, ask them to enable branch protection for `main`:
  - Require pull requests
  - Require status checks to pass (select the CI checks)
  - Require at least 1 review
- [ ] Verify CI runs and passes on `main`
- [ ] Take screenshots of the latest CI run and the additional QA check result
- [ ] Push all workflow changes

---

## Final Summary: After AI finishes Parts 1–8

Before moving to **Part 10–16**, you should have:

| What | Where |
|---|---|
| Sprint 3 milestone + PBIs | https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/3 |
| Sprint Backlog board | https://github.com/users/Fedos113/projects/1/views/1 |
| Product Backlog updated | https://github.com/Fedos113/SWP_TickFrame_28_team/issues |
| Customer feedback table | [`reports/week4/README.md`](../reports/week4/README.md) |
| Quality requirements | [`docs/quality-requirements.md`](../docs/quality-requirements.md) |
| Quality requirement tests | [`docs/quality-requirement-tests.md`](../docs/quality-requirement-tests.md) |
| QRT tests | `tests/requirements/test_*.py` |
| Product changes | Merged PRs into `main` |
| Updated DoD | [`docs/definition-of-done.md`](../docs/definition-of-done.md) |
| Updated roadmap | [`docs/roadmap.md`](../docs/roadmap.md) |
| Testing strategy + tests | [`docs/testing.md`](../docs/testing.md) + `tests/` |
| Additional QA check | `.github/workflows/ci.yml` |
| CI workflows | `.github/workflows/ci.yml` + `.github/workflows/lychee.yml` |
| Updated CHANGELOG | [`CHANGELOG.md`](../CHANGELOG.md) |
| Updated README | [`README.md`](../README.md) |
| Screenshots (coverage, QA check, CI run) | `reports/week4/images/` |

Then go to **4part2.md** in this folder for Parts 10–16.
