# Assignment 4 — Part 9: Deploy & Release the Sprint Increment

> **Prerequisite reading:** [Assignment_04.md](Assignment_04.md) (Part 9), [Repository_Requirements.md](Repository_Requirements.md)
>
> **Part 9 in the overall flow:** After implementation and CI (Parts 5–8), before UAT and Sprint Review (Parts 10–11).

---

## What Part 9 Requires

| # | Requirement | Source |
|---|-------------|--------|
| 1 | Deploy the Sprint increment so customer + TA can access it | Assignment_04.md §9.2 |
| 2 | Make it available **before** UAT | §9.3 |
| 3 | Keep it accessible until grading is done | §9.4 |
| 4 | Create a SemVer release tagged `v`*[version]* on the protected default branch | §9.5 |
| 5 | Release must link to: Sprint milestone, deployment/run instructions, demo video, built artifacts | §9.6 |
| 6 | Update `CHANGELOG.md` — move `[Unreleased]` into a dated `[x.y.z]` section | §9.7 |
| 7 | Preserve release, tag, deployment, and quality evidence for later Sprints | §9.8 |

---

## Prerequisites Checklist

- [ ] **Part 5 (Implementation) done** — all Sprint PBIs merged to `main`
- [ ] **Part 8 (CI) green** — latest `main` CI run passes (lint, type-check, tests, coverage, QRTs, additional QA check, Lychee)
- [ ] **`docs/` up to date** — `roadmap.md`, `definition-of-done.md`, `README.md` reflect the current Sprint
- [ ] **`CHANGELOG.md` populated** — `[Unreleased]` section has all user-visible changes from this Sprint
- [ ] **Public demo video recorded** (< 2 min, sanitized data only, hosted publicly — YouTube unlisted or Google Drive)

---

## Step-by-Step Actions

### Step 1: Verify CI and Default Branch

```bash
# Confirm you're on main with all Sprint work merged
git checkout main
git pull origin main

# Check the latest CI run — must be green
# Visit: https://github.com/Fedos113/SWP_TickFrame_28_team/actions
```

**What to check:**
- [ ] Latest `main` CI run is passing
- [ ] All Sprint PRs are merged
- [ ] `CHANGELOG.md` has `[Unreleased]` entries for this Sprint
- [ ] `README.md` has correct run/deploy instructions

### Step 2: Update CHANGELOG.md

Replace `[Unreleased]` with the new version and date. Add a new empty `[Unreleased]` section above it.

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
- [ ] Add `[0.2.0]:` reference link pointing to `.../releases/tag/v0.2.0`
- [ ] Update `[Unreleased]:` compare link to `compare/v0.2.0...HEAD`
- [ ] Commit and push to `main`

### Step 3: Deploy the Increment

**Option A — Docker deployment (existing setup):**
```bash
docker compose up --build -d
```
Verify: `http://<host-ip>:8000/` responds with the dashboard.

**Option B — Local access for TA:**
- Update `README.md` with exact run instructions
- Ensure Docker Compose or `pip install -r requirements.txt && python -m tickframe serve` works

- [ ] Product reachable at the documented URL
- [ ] `README.md` has accurate run/deploy instructions
- [ ] Link to deployed product added to `reports/week4/README.md`

### Step 4: Create the SemVer Release on GitHub

**Using `gh` CLI:**
```bash
gh release create v0.2.0 \
  --title "v0.2.0 — Assignment 4 Sprint Increment" \
  --notes "Assignment 4 Sprint increment.

**Milestone:** https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/3
**Deployment:** [URL or run instructions in README.md]
**Demo video:** [public video link]
**Changelog:** [CHANGELOG.md](./CHANGELOG.md)" \
  --target main
```

**Using GitHub UI:**
1. Go to https://github.com/Fedos113/SWP_TickFrame_28_team/releases/new
2. Tag: `v0.2.0` — Target: `main`
3. Title: `v0.2.0 — Assignment 4 Sprint Increment`
4. Description includes:
   - Link to Sprint 3 milestone: `https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/3`
   - Link to deployment or run instructions: `[README.md](./README.md)`
   - Link to public demo video
   - Link to `CHANGELOG.md`
5. Publish release

**Release must include:**
- [x] SemVer tag prefixed with `v` (`v0.2.0`)
- [x] Points to a commit on `main`
- [x] Identifies as Assignment 4 Sprint increment
- [x] Links to Assignment 4 Sprint milestone
- [x] Links to deployment or run instructions
- [x] Links to public sanitized demo video
- [ ] Links to relevant built artifacts (optional — add if Docker image or package is published)

### Step 5: Update Week 4 Report

In `reports/week4/README.md`, update:

| Section | Field |
|---------|-------|
| §3. Deployed Product | Actual deployment URL |
| §11. Release | Replace `v0.2.0` placeholder with real release link, add demo video link |

Take a screenshot of the release page → save as `reports/week4/images/semver-release.png`.

### Step 6: Final Verification

- [ ] `https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/v0.2.0` returns 200
- [ ] Release description links work
- [ ] `CHANGELOG.md` shows `[0.2.0]` section with dated entries
- [ ] `CHANGELOG.md` `[Unreleased]` compare link is `compare/v0.2.0...HEAD`
- [ ] Deployed product is reachable by customer and TA
- [ ] Screenshot taken → `reports/week4/images/semver-release.png`

---

## Links Between Part 9 and Other Parts

| Part | Relationship to Part 9 |
|------|-----------------------|
| **Part 5** (Implementation) | All Sprint PRs must be merged to `main` before release |
| **Part 7** (Testing) | Tests must pass on `main` before tagging |
| **Part 8** (CI) | CI must be green on `main`; CI config is a maintained asset |
| **Part 10** (UAT) | Deployment must be ready **before** UAT session |
| **Part 11** (Sprint Review) | Release is shown/discussed during Sprint Review |
| **Part 15** (Demo video) | Video must be hosted and linked from the release |
| **Report** (§11 Release) | Release link appears in `reports/week4/README.md` |

---

## Required Evidence in the Repository

| Evidence | Location |
|----------|----------|
| SemVer release | `https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/v0.2.0` |
| Updated CHANGELOG | `CHANGELOG.md` §[0.2.0] |
| Deployed product | Documented URL in `reports/week4/README.md` §3 |
| Run/deploy instructions | `README.md` |
| Release screenshot | `reports/week4/images/semver-release.png` |
