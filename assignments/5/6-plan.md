# Parts 9–13 Delivery Plan — Assignment 5

## Overview

These five parts cover the end-of-Sprint activities: reviewing with the customer, reflecting internally, publishing docs, and recording a demo. They share a single recorded session (UAT + Sprint Review), a single public report (`reports/week5/README.md`), and a single release (`v2.0.0`).

| Part | Artifact(s) | Goal |
|---|---|---|
| **Part 9** | `reports/week5/sprint-review-summary.md` + transcript or notes | Sprint Review with customer |
| **Part 10** | `reports/week5/retrospective.md` | Team retrospective |
| **Part 11** | Hosted documentation site | Publish `docs/` as browsable site |
| **Part 12** | `reports/week5/reflection.md` | Individual/team reflection |
| **Part 13** | Public sanitized demo video (< 2 min) | Demonstrate MVP v2 |

### Project context (from `5/context.md`)

| Asset | Current state |
|---|---|
| `reports/week5/README.md` | 0 bytes — empty template |
| `reports/week5/sprint-review-summary.md` | 0 bytes — empty template |
| `reports/week5/sprint-review-transcript.md` | 0 bytes — empty template |
| `reports/week5/reflection.md` | 0 bytes — empty template |
| `reports/week5/retrospective.md` | 0 bytes — empty template |
| `reports/week5/llm-report.md` | 0 bytes — empty template |
| `reports/week5/images/` | Empty directory |
| Hosted docs site | Does not exist |
| Public demo video | Does not exist |
| `v2.0.0` release | Does not exist |

---

## Part 9 — Sprint Review

### Ordering with Part 8 (UAT)

Record UAT and Sprint Review in **one** session. This is explicitly allowed by the spec ($367). If combined:
- One recording covers both
- One transcript/notes file covers both
- Include Moodle-only timecodes showing where UAT ends and Sprint Review begins

### 9a. Before the session

#### Agenda preparation

Prepare a slide or shared document covering:

1. **Sprint Goal** — Deliver MVP v2: WebSocket migration, DB caching, RSI/Volume sub-charts, multi-interval, analysis range
2. **Delivered MVP v2 increment** — walk through each PBI
3. **Customer feedback addressed** — show the feedback table from Sprint 3 and what was done
4. **UAT results** — run through scenarios, customer executes
5. **Architecture & ADR updates** — show `docs/architecture/README.md`, the 3 diagrams (static/dynamic/deployment), 3 ADRs
6. **Quality & CI evidence** — latest CI run, QRT results, coverage
7. **Remaining gaps & follow-up PBIs** — backlog items for Sprint 5

#### Permission checklist

From Artifact Requirements §208–219, ask **before recording**:

- [ ] Recording permission
- [ ] Public transcript publication permission
- [ ] Private instructor-sharing permission (if public refused)

#### Pre-session checklist

- [ ] All Sprint 4 PBIs merged to `main`
- [ ] `v2.0.0` deployed/accessible for demo
- [ ] UAT scenarios ready in `docs/user-acceptance-tests.md`
- [ ] Recording tool ready (Zoom, OBS, Google Meet)
- [ ] Consent obtained
- [ ] Agenda shared with customer
- [ ] Note-taker assigned
- [ ] Architecture diagrams rendered and presentable
- [ ] CI pipeline link ready for the latest run

### 9b. During the session

**Session flow:**

1. Welcome and recording consent confirmation
2. Sprint Goal recap (2 min)
3. Customer executes UAT scenarios (see 5-plan.md) (10–15 min)
4. Demo of delivered MVP v2 features (5 min)
   - WebSocket live candles
   - RSI/Volume sub-charts
   - Multi-interval switching
   - Analysis range slider
5. Architecture & ADR walkthrough (5 min)
   - Show component diagram (static view)
   - Show sequence diagram (dynamic view — e.g. candle load flow)
   - Show deployment diagram
   - Mention 3 ADRs and how they link to quality requirements
6. Quality & CI evidence (3 min)
   - Show latest green CI run
   - Mention QRT pass status
   - Show coverage
7. Customer feedback collection (5 min)
   - What works well?
   - What needs improvement?
   - What is missing?
8. Adapt Product Backlog based on feedback
9. Thank customer, end recording

### 9c. After the session

#### Sprint Review transcript

File: `reports/week5/sprint-review-transcript.md`

If **publication permitted** (both public and private share allowed):

Write a sanitized English transcript:
- Each timestamp on a separate line
- Clean for readability without changing meaning
- Remove PII / confidential info — use `[redacted]`
- Include the full discussion chronologically

If **publication refused but private sharing permitted**:
- Do NOT commit to public repo
- Submit only through Moodle PDF

If **recording/transcript refused entirely**:
- Write detailed English notes in `reports/week5/sprint-review-notes.md`
- Include: scope reviewed, feedback, questions, decisions, approvals, action points, risks, resulting backlog updates

Structure for both transcript and notes:

```markdown
# Sprint Review — Week 5

**Date:** 2026-07-06
**Participants:** [Customer name/role], [Team members]
**Recording permission:** [Granted / Refused]
**Transcript publication:** [Public / Private-only / N/A]
**Private instructor sharing:** [Permitted / Refused]

## Discussion

[00:00] **Sprint Goal review** — ...
[05:00] **UAT execution** — ...
[20:00] **Delivered increment demo** — ...
[30:00] **Architecture & ADR walkthrough** — ...
[35:00] **Quality & CI evidence** — ...
[40:00] **Customer feedback** — ...
[50:00] **Backlog adaptation** — ...

## Action Points

| Action | Owner |
|---|---|
| ... | ... |

## Resulting Backlog Updates

| PBI | Change |
|---|---|
| ... | ... |
```

- [ ] Write `reports/week5/sprint-review-transcript.md` OR `sprint-review-notes.md`
- [ ] If private-only, do NOT commit — include only in Moodle PDF

#### Sprint Review summary

File: `reports/week5/sprint-review-summary.md`

Always public. Must include:
- Date, participants/roles
- Artifacts demonstrated
- Scope/goal reviewed
- Feedback summary
- Approvals or requested changes
- Risks identified
- Action points
- Resulting backlog changes
- Recording/transcript permission status

```markdown
# Sprint Review Summary — Sprint 4 / Week 5

| Field | Value |
|---|---|
| **Date** | 2026-07-06 |
| **Participants** | [Customer], [Team] |
| **Sprint Goal** | Deliver MVP v2 — WebSocket, DB cache, RSI/Volume, multi-interval, analysis range |
| **Recording** | [Permitted / Refused] |
| **Transcript published** | [Public / Private-only / N/A] |

## Delivered Increment (MVP v2)

| PBI | Issue | Status |
|---|---|---|
| WebSocket migration | [#110](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110) | Done |
| SQLite candle caching | [#111](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/111) | Done |
| RSI sub-chart | [#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112) | Done |
| Volume sub-chart | [#113](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113) | Done |
| Analysis range | [#114](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/114) | Done |
| Multi-interval | [#115](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/115) | Done |

## UAT Results

| UAT | Result |
|---|---|
| UAT-001 (Pattern scan) | ... |
| UAT-002 (Timeframes) | ... |
| UAT-003 (Export) | ... |
| UAT-004 (Sidebar) | ... |
| UAT-005 (Theme) | ... |
| UAT-006 (WebSocket) | ... |
| UAT-007 (RSI/Volume) | ... |

## Customer Feedback

| Feedback | Response |
|---|---|
| ... | ... |

## Architecture Evidence Discussed

- Component, sequence, and deployment diagrams in `docs/architecture/`
- ADR-001 (WebSocket), ADR-002 (SQLite), ADR-003 (Microservice)
- Quality requirement → ADR traceability

## Action Points

| # | Action | Owner |
|---|---|---|

## Backlog Updates

| PBI | Change |
|---|---|
```

- [ ] Write `reports/week5/sprint-review-summary.md`

---

## Part 10 — Sprint Retrospective

### File: `reports/week5/retrospective.md`

Conduct **after** the Sprint Review. Keep it public and sanitized.

Required structure (from Artifact Requirements §266–271):

```markdown
# Sprint Retrospective — Sprint 4 / Week 5

**Date:** 2026-07-06
**Participants:** [Full team]

## What went well

- ...
- ...

## What did not go well

- ...
- ...

## Previous Retrospective Follow-Up

*This is the first Sprint Retrospective that covers Sprint 4 process changes. No previous retrospective action points to follow up.*
(OR summarise what was changed based on Sprint 3 retro and what results were observed.)

## Action Points

| # | Action | Owner | Due |
|---|---|---|---|
| 1 | ... | ... | Next Sprint |
| 2 | ... | ... | Next Sprint |
```

Focus on concrete process improvements:
- How did the architecture documentation process work?
- How did the ADR creation process go?
- Was the Sprint 4 scope realistic?
- What should change for Sprint 5?

- [ ] Conduct retrospective with full team
- [ ] Write `reports/week5/retrospective.md`

---

## Part 11 — Hosted Documentation Site

### Requirement

Publish `docs/` as a browsable hosted documentation site. Must expose maintained docs as readable, navigable pages — not just raw repo paths.

### Options (choose one)

| Option | Tool | Effort | Pros | Cons |
|---|---|---|---|---|
| **A** | GitHub Pages + Jekyll (default) | Low | Built-in, free, auto-builds from `docs/` | Requires `_config.yml`, may need theme |
| **B** | GitHub Pages + MkDocs | Medium | Better navigation, search | Needs separate `gh-pages` branch or action |
| **C** | GitHub Pages with just `docs/` folder | Minimal | Zero config — just enable in repo settings | No navigation, just raw Markdown rendering |
| **D** | Read the Docs | Medium | Professional hosting | Needs account setup, webhook |

**Recommended:** Option C (quickest) → then upgrade to A or B if time permits.

### Setup — GitHub Pages (minimum viable)

1. Go to repo Settings → Pages
2. Source: "Deploy from branch"
3. Branch: `main`, folder: `/docs`
4. Save
5. Wait 1–2 minutes for first deploy
6. Site available at: `https://Fedos113.github.io/SWP_TickFrame_28_team/`

For better navigation:
- Add `docs/_config.yml` with a Jekyll theme (e.g. `theme: jekyll-theme-cayman`)
- Or use `docs/index.md` as a landing page

### Content that must be readable via hosted site

- `docs/roadmap.md`
- `docs/definition-of-done.md`
- `docs/testing.md`
- `docs/quality-requirements.md`
- `docs/quality-requirement-tests.md`
- `docs/user-acceptance-tests.md`
- `docs/development-process.md`
- `docs/architecture/README.md`
- Architecture diagrams (rendered SVG/PNG alongside .puml sources)
- ADR files

### Linking

- [ ] Link from root `README.md`
- [ ] Link from `reports/week5/README.md` (item 31 in report structure)
- [ ] Link from `v2.0.0` SemVer release

### Checklist

- [ ] Enable GitHub Pages in repo settings (branch `main`, folder `/docs`)
- [ ] Verify site is accessible
- [ ] Verify all maintained docs are readable in the hosted site
- [ ] Architecture diagram images render correctly (if .puml → SVG is linked)
- [ ] Add link from `README.md`: `## Documentation` section
- [ ] Add link from `reports/week5/README.md` item 31
- [ ] Keep accessible until grading complete

---

## Part 12 — Reflection

### File: `reports/week5/reflection.md`

Required structure (from Artifact Requirements §249–255):

```markdown
# Reflection — Week 5 / Assignment 5

## Learning Points

- Documenting architecture taught us ...
- Creating ADRs forced us to think about ...
- The development-process document revealed ...
- Delivering MVP v2 with WebSocket/caching required ...

## Validated Assumptions

- Microservice architecture for ML was the right call because ...
- SQLite caching measurably improved load times ...
- The Sprint 4 scope was achievable within one week ...

## Friction and Gaps

- Architecture diagrams-as-code had a learning curve ...
- Frontend JS still has zero test coverage — deferred again
- QR-003 threshold had to be lowered — ML accuracy not yet at 80%

## Planned Response

- Sprint 5: Add JS test coverage
- Sprint 5: Improve ML model accuracy toward 0.80
- Maintained docs must be updated whenever architecture changes
```

Emphasis areas (from Assignment 05 §397):
- What the team learned from documenting architecture
- Recording ADRs
- Refining the workflow
- Managing configuration
- Delivering MVP v2
- Reviewing the increment with the customer

- [ ] Write `reports/week5/reflection.md`

---

## Part 13 — Public Sanitized Demo Video

### Requirements

| Requirement | Detail |
|---|---|
| **Length** | < 2 minutes |
| **Audience** | Public (everyone) |
| **Content** | Current state of MVP v2 — what was improved, fixed, or added |
| **Sanitized** | No PII, no private data, no customer-identifying info |
| **Format** | Any video format (MP4 recommended) |
| **Hosting** | YouTube/Google Drive (unlisted is OK) |

### Script outline (60–90 seconds)

```
[0:00] Title: "TickFrame MVP v2 — Sprint 4 Demo"
[0:05] What is TickFrame? — FastAPI crypto chart workstation
[0:15] What's new in MVP v2?
  - WebSocket live candles (chart updates without refresh)
  - RSI and Volume sub-charts below main chart
  - Multi-interval support (5m, 15m, 1h, 4h, 1d)
  - Configurable analysis range
[1:20] Architecture improvements
  - SQLite caching for faster loads
  - Microservice ML isolation
[1:40] Where to find docs: link in description
[1:50] End
```

### Checklist

- [ ] Record screen with microphone narration
- [ ] Keep under 2 minutes
- [ ] No sensitive data visible (API keys, private URLs, customer info)
- [ ] Use sanitized demo data only
- [ ] Upload to Google Drive, YouTube, or similar (unlisted)
- [ ] Link from `reports/week5/README.md` (item 29)
- [ ] Link from `v2.0.0` SemVer release

---

## Cross-cutting: `reports/week5/README.md`

This is the **canonical Week 5 public report**. It must contain direct links to every applicable repository file and external artifact. The 42-item structure is defined in Assignment 05 §440–489.

### Checklist — report items

- [ ] §1 — Project name and short description
- [ ] §2 — Link to Product Backlog board/view
- [ ] §3 — Link to Sprint Backlog platform board/view
- [ ] §4 — Link to Sprint 4 milestone
- [ ] §5 — Sprint Goal, dates, scope summary
- [ ] §6 — Total Sprint size in Story Points
- [ ] §7 — Summary of delivered MVP v2 changes
- [ ] §8 — Link to product access artifact
- [ ] §9 — Link to current access/run instructions
- [ ] §10 — Customer feedback response table
- [ ] §11 — Explanation of feedback not addressed
- [ ] §12 — Link to `docs/roadmap.md`
- [ ] §13 — Link to `docs/definition-of-done.md`
- [ ] §14 — Link to `docs/testing.md`
- [ ] §15 — Link to `docs/quality-requirements.md`
- [ ] §16 — Link to `docs/quality-requirement-tests.md`
- [ ] §17 — Link to `docs/user-acceptance-tests.md`
- [ ] §18 — Link to `docs/development-process.md`
- [ ] §19 — Link to `docs/architecture/README.md`
- [ ] §20 — Links to static/dynamic/deployment view artifacts
- [ ] §21 — Link to ADR directory/index
- [ ] §22 — Architecture summary and how it supports the product
- [ ] §23 — How quality requirements link to architecture decisions
- [ ] §24 — Testing and CI status summary
- [ ] §25 — Link to CI pipeline
- [ ] §26 — Link to latest protected-default-branch CI run
- [ ] §27 — Link to SemVer release v2.0.0
- [ ] §28 — Link to `CHANGELOG.md`
- [ ] §29 — Public sanitized demo video
- [ ] §30 — Public sanitized UAT results summary
- [ ] §31 — Link to hosted documentation site
- [ ] §32 — Sprint Review transcript/notes status
- [ ] §33 — Deviation justification (if any)
- [ ] §34 — Link to `sprint-review-summary.md`
- [ ] §35 — Link to `reflection.md`
- [ ] §36 — Link to `retrospective.md`
- [ ] §37 — Link to `llm-report.md`
- [ ] §38 — Current product status summary
- [ ] §39 — Next steps summary
- [ ] §40 — Contribution traceability table
- [ ] §41 — Embedded screenshots (milestone, board, CI, release, PR, hosted docs)
- [ ] §42 — Product access screenshots (if relevant)

- [ ] Write and fill `reports/week5/README.md`

### Screenshots to capture

Save in `reports/week5/images/` as PNG:

| # | Content | How to capture |
|---|---|---|
| 1 | Sprint 4 milestone page | GitHub → Milestones → Sprint 4 → screenshot |
| 2 | Project board/workflow view | GitHub Projects board → screenshot |
| 3 | Latest CI run (green) | GitHub Actions → latest run on main → screenshot |
| 4 | SemVer release v2.0.0 | GitHub Releases → v2.0.0 → screenshot |
| 5 | Example reviewed PR | Any merged Sprint 4 PR → screenshot |
| 6 | Hosted docs site | Browser showing hosted site → screenshot |

---

## Cross-cutting: v2.0.0 SemVer Release

Create after all Sprint 4 PBIs are merged to `main`.

### Release requirements (from Assignment 05 §285–293)

| Requirement | Value |
|---|---|
| **Tag** | `v2.0.0` |
| **Branch** | `main` |
| **Maps to** | MVP v2, Assignment 5 Sprint increment |
| **Links to** | Sprint 4 milestone |
| **Links to** | Run/access instructions |
| **Links to** | Public sanitized demo video |
| **Links to** | Week 5 public report |

### Checklist

- [ ] `git tag v2.0.0` on the latest `main` commit
- [ ] `git push origin v2.0.0`
- [ ] Create GitHub Release:
  - Title: `v2.0.0 — MVP v2`
  - Body: summary of all Sprint 4 changes, links to milestone, demo video, `reports/week5/README.md`
- [ ] Verify release is publicly accessible
- [ ] Link release from `reports/week5/README.md` (item 27)

---

## Execution order (recommended)

| Step | Part | Depends on |
|---|---|---|
| 1. All Sprint 4 PBIs implemented + merged | Part 7 | — |
| 2. Architecture docs + ADRs filled | Parts 4, 5 | — |
| 3. Dev-process doc filled | Part 3 | — |
| 4. Testing/QA/DoD updated | Part 6 | Steps 1–3 (knows what changed) |
| 5. UAT scenarios written | Part 8 | Step 1 (knows what to test) |
| 6. **UAT + Sprint Review session** | Parts 8, 9 | Steps 4, 5 |
| 7. Sprint Review summary + transcript | Part 9 | Step 6 |
| 8. Sprint Retrospective | Part 10 | Step 6 (after review) |
| 9. Hosted docs site | Part 11 | Steps 2, 3, 4 |
| 10. Reflection | Part 12 | Steps 6, 7, 8 (after review) |
| 11. Demo video | Part 13 | Step 1 (app is working) |
| 12. `v2.0.0` release | Part 7 | Steps 1, 9, 11 (links to docs + demo) |
| 13. `reports/week5/README.md` | Report | Everything above (links to all artifacts) |
| 14. Moodle PDF | Moodle | Step 13 (permalink to report) |
