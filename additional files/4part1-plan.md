# Assignment 4 — LLM Plan for Parts 1–3, 6, 8 (GitHub Repo Management)

> Based on [Assignment_04.md](Assignment_04.md)
>
> **This file covers only GitHub repository management:** Sprint Planning, customer feedback PBIs, quality requirements docs, Definition of Done, and CI configuration.
>
> **Development, QRTs, and testing are handled in `4reqsmvp.md`.** Run that file after this one.

---

## User Checklist (do these BEFORE sending to AI)

### GitHub setup
- [ ] Install `gh` CLI locally (`winget install --id GitHub.cli` or from https://cli.github.com/)
- [ ] Authenticate `gh` with `gh auth login` (HTTPS, grant repo+project permissions)
- [ ] If `gh` is not available, tell the AI to output text and you'll create things manually
- [ ] Make sure you have **write** access to the repo

### Information you need to gather
- [ ] **Sprint dates** — pick start/end dates (e.g., `2026-06-25` to `2026-07-02`)
- [ ] **Sprint Goal** — value-focused outcome (e.g., "Deliver a quality-gated increment with automated tests, CI, and UAT-ready product")
- [ ] **Sprint scope priorities** — what matters most?
  - Finish backlog features (US-07 timeframe, US-06 sidebar, US-11 RSI)
  - Focus on quality foundations (tests, CI, coverage, DoD)
  - A mix of both
- [ ] **Total Story Points** — roughly how much can the team deliver? (e.g., 20–30 SP)
- [ ] **Team member info:**
  - GitHub usernames
  - Scrum roles (SM, PO, Developers)
  - Who implements vs. reviews (must be different people)
- [ ] **Customer feedback** — share whatever you have from:
  - [`reports/week3/customer-review-transcript.md`](../reports/week3/customer-review-transcript.md)
  - [`reports/week3/customer-review-summary.md`](../reports/week3/customer-review-summary.md)
  - Any emails, messages, or notes since then
- [ ] **Tell the AI how you want to work:**
  - Option A: AI uses `gh` to create milestones, issues, PRs directly
  - Option B: AI generates markdown and you paste/create manually

### Existing things the AI reads

| What | Where |
|---|---|
| Current DoD | [`docs/definition-of-done.md`](../docs/definition-of-done.md) |
| Current roadmap | [`docs/roadmap.md`](../docs/roadmap.md) |
| User stories | [`docs/user-stories.md`](../docs/user-stories.md) |
| Interface docs | [`docs/interface.md`](../docs/interface.md) |
| CHANGELOG | [`CHANGELOG.md`](../CHANGELOG.md) |
| README | [`README.md`](../README.md) |
| CI so far | [`.github/workflows/lychee.yml`](../.github/workflows/lychee.yml) |
| Issue templates | [`.github/ISSUE_TEMPLATE/`](../.github/ISSUE_TEMPLATE/) |
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

1. **Pull existing issues** — `gh issue list` (or parse from docs). Open ones include: US-01 (#5), US-02 (#6), US-06 (#15), US-07 (#18), US-08 (#8), US-09 (#9), US-10 (#11), US-11 (#13), US-12 (#14), US-14 (#17), US-08-1 (#22), US-15 (#41)
2. **Look at customer feedback** from week 3 reports — identify gaps, risks, quality problems
3. **Create new PBIs** as GitHub Issues for:
   - Quality requirements (at least 3 separate PBIs)
   - QRT-related automation (at least 3)
   - Testing and coverage work
   - CI setup
   - Additional QA check
   - Feature/bugfix work selected for this Sprint
   - Every PBI gets: acceptance criteria, story points, assignee, reviewer
4. **Create Sprint 3 milestone:**
   - URL: `https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/3`
   - Title: `Sprint 3 — Assignment 4`
   - Dates + Sprint Goal from user input
5. **Assign selected PBIs** to that milestone
6. **Update the project board** at https://github.com/users/Fedos113/projects/1/views/1:
   - Add Sprint 3 view (or repurpose existing)
   - Columns: To Do, In Progress, Review, Done
   - Visible fields: priority, SP, assignee, status, milestone
7. **Update [`docs/roadmap.md`](../docs/roadmap.md)** — add Sprint 3 section

### What you do

- [ ] Check new/updated PBIs on GitHub
- [ ] Verify Sprint 3 milestone
- [ ] Review project board columns
- [ ] Review and push [`docs/roadmap.md`](../docs/roadmap.md)

**Before moving to `4reqsmvp.md`:** ensure PBIs are finalized with clear acceptance criteria, story points, assignees, and reviewers.

---

## Part 2: Respond to Customer Feedback on the MVP

### What the AI does

1. **Dig through customer feedback** from:
   - [`reports/week3/customer-review-transcript.md`](../reports/week3/customer-review-transcript.md)
   - [`reports/week3/customer-review-summary.md`](../reports/week3/customer-review-summary.md)
   - Any extra feedback the user provides
2. **Create or update PBIs** for feedback the team decides to address
3. **Build the customer feedback response table** for [`reports/week4/README.md`](../reports/week4/README.md):

```markdown
| Feedback point | Resulting PBI or issue | Status | Response |
|---|---|---|---|
| Customer wanted Fear & Greed Index | [#14](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/14) | Planned for Sprint 3 | Moved into scope |
| Customer asked for volume chart | [#11](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/11) | Not planned | Deferred — quality/CI took priority |
```

### What you do

- [ ] Verify the response table matches team decisions
- [ ] For "Not planned" items, ensure the justification holds up
- [ ] Commit and push report changes

---

## Part 3: Define Quality Requirements

> This is a **documentation task** (no code). The AI writes `docs/quality-requirements.md`.
> Actual QRT implementation (automated tests) is in **`4reqsmvp.md` Part 4**.

### What the AI does

1. **Read the reference** at https://github.com/Alexey-Popov/awesome-ai-architect/blob/main/solution-architecture/quality-attributes.md
2. **Create [`docs/quality-requirements.md`](../docs/quality-requirements.md)**
3. **Define at least 3 quality requirements**, each using a **different ISO/IEC 25010 sub-characteristic**. Each includes:
   - Stable ID (QR-001 etc.)
   - ISO/IEC 25010 sub-characteristic
   - Full scenario format (stimulus → source → environment → artifact → response → response measure)
   - Rationale for TickFrame
   - Links to QRTs and affected PBIs

### What you do

- [ ] Verify each QR is measurable and makes sense for the product
- [ ] Ensure each uses a *different* sub-characteristic
- [ ] Push [`docs/quality-requirements.md`](../docs/quality-requirements.md)

---

## Part 6: Update the Definition of Done

### What the AI does

1. **Rewrite [`docs/definition-of-done.md`](../docs/definition-of-done.md)** — currently a bare-bones Assignment 3 version
2. The new DoD includes:

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

### What you do

- [ ] Check the DoD works for your team's actual tooling
- [ ] Push and enforce it for every PBI going forward

---

## Part 8: Configure CI

### What the AI does

1. **Create or rewrite CI workflows** in `.github/workflows/`:
   - Currently only [`.github/workflows/lychee.yml`](../.github/workflows/lychee.yml) exists
   - **Create `ci.yml`** with jobs for linting, type checking, tests + coverage, and additional QA check:

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
3. **Ensure latest CI run on `main` passes** before moving to release

> **Branch protection:** Requires admin rights. If unavailable, note in the report that it couldn't be configured. CI still runs as a safety gate on every PR.

### What you do

- [ ] If admin access exists: enable branch protection for `main` (require PRs, status checks, 1 review)
- [ ] Verify CI runs and passes on `main`
- [ ] Take screenshots of CI run and QA check result
- [ ] Push all workflow changes

---

## Final Summary

After this file, before moving to **`4reqsmvp.md`**, you should have:

| What | Where |
|---|---|
| Sprint 3 milestone + PBIs | GitHub milestone + issues |
| Sprint Backlog board | GitHub Projects |
| Product Backlog updated | GitHub Issues |
| Customer feedback table | [`reports/week4/README.md`](../reports/week4/README.md) |
| Quality requirements doc | [`docs/quality-requirements.md`](../docs/quality-requirements.md) |
| Updated DoD | [`docs/definition-of-done.md`](../docs/definition-of-done.md) |
| Updated roadmap | [`docs/roadmap.md`](../docs/roadmap.md) |
| CI workflows | `.github/workflows/ci.yml` + `.github/workflows/lychee.yml` |

**Now proceed to `4reqsmvp.md`** for QRT implementation, product development, testing, and release.
