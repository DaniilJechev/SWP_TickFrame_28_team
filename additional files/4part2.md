# Assignment 4 — LLM Plan for Parts 10–16 (Delivery, Review & Reporting)

> Based on [Assignment_04.md](Assignment_04.md)
>
> **Repository:** https://github.com/Fedos113/SWP_TickFrame_28_team — **Default branch:** `main`
>
> **Prerequisite:** Parts 1–8 done — Sprint 3 implemented, CI green, all docs created, tests passing, coverage ≥30% on critical modules.
>
> **Week 4 report root:** [`reports/week4/README.md`](../reports/week4/README.md) (the canonical public report)
> **Week 4 images:** `reports/week4/images/` (screenshots — currently empty)

---

## Human-Like Writing Instructions (read this first)

When generating content, avoid anything that reads like an AI wrote it:

- **Avoid over-explaining** — don't define things everyone already knows. If you're describing a test framework, just name it and move on.
- **Skip the fluff** — no "in today's digital landscape" or "it is worth noting that". Just say what needs saying.
- **No generic filler** — every sentence should carry meaning. If it doesn't add value, cut it.
- **Write for the project context** — this is TickFrame, a crypto chart tool. The tone can be slightly more direct and technical. Adjust accordingly.

---

## User Checklist (do these BEFORE sending to AI)

### Meetings you need to arrange
- [x] **Book a UAT session** with the customer (can be combined with Sprint Review)
- [x] **Book a Sprint Review** with the customer
- [x] **Book a Sprint Retrospective** with your team (after the review)
- [x] **Record everything** — ask permission before recording, and it's a separate question for each meeting
- [x] **Ask the customer** before the Review:
  - Can we publish a sanitized transcript publicly?
  - If not, can we share one privately with instructors?
  - If neither, we'll take detailed notes instead

### What you'll need to tell the AI after meetings
- [ ] **UAT results** — which of the 3+ scenarios passed, what the customer said
- [ ] **Sprint Review notes** — what was discussed, decisions made, next steps
- [ ] **Retrospective input** — went well, didn't go well, what to change
- [ ] **Reflection input** — what you learned, what assumptions held up, what went wrong

### Things you have to do yourself (AI can't help here)
- [ ] **Record a public demo video** (< 2 min) — host it somewhere public, send the AI the link
- [ ] **Take screenshots** and put them in `reports/week4/images/`:
  - Sprint 3 milestone view
  - Latest passing CI run on `main`
  - Coverage report from `pytest --cov=tickframe tests/`
  - Additional QA check result
  - SemVer release page (after the AI creates it)
  - Example reviewed PR
  - Product Backlog / Sprint Backlog views (optional but nice)
- [ ] **Create presentation slides** (PowerPoint, Google Slides, Canva) — submit via Moodle
- [ ] **Record a rehearsed presentation video** (< 5 min) — private link, Moodle only
- [ ] **Deploy** the sprint increment so the customer and TA can actually use it

---

## Part 10: User Acceptance Testing with the Customer

### What the AI does

1. **Create [`docs/user-acceptance-tests.md`](../docs/user-acceptance-tests.md)** — doesn't exist yet. Defines at least 3 UAT scenarios for TickFrame:

   | ID | What the user does |
   |---|---|
   | UAT-001 | Run a scan, open the dashboard, look at pattern markers on the chart |
   | UAT-002 | Switch between timeframes (5m, 15m, 1h) and watch the chart update |
   | UAT-003 | Generate a scan report in Markdown format |
   | UAT-004 | Open the dashboard, see 10 trading pairs with live prices |
   | UAT-005 | Toggle between day and night theme |

   Each scenario includes: stable ID, preconditions, numbered steps, expected results, status field, and an execution history table.

2. **After you share the results**, the AI:
   - Fills in execution records in the UAT doc
   - Writes a summary for [`reports/week4/README.md`](../reports/week4/README.md) covering:
     - What passed and what didn't
     - Key customer feedback
     - Resulting PBI links

### What you do

- [x] Run the UAT session — **the customer should drive**, not the team
- [x] Ask permission before recording
- [ ] Afterward, give the AI: pass/fail per scenario, customer quotes, any ideas for new issues
- [ ] Submit the private recording link via **Moodle** only — don't commit it to the repo
- [ ] If UAT and Sprint Review were the same meeting, note the timecodes
- [ ] Review the AI's UAT doc and summary, then push

---

## Part 11: Sprint Review

### What the AI does

1. **Generate `reports/week4/customer-review-transcript.md`** (only if the customer said public publication is OK):
   - Take your notes/recording and turn them into a clean transcript
   - Each timestamp on its own line
   - Scrub PII → `[redacted]`, `[inaudible]`
   - Keep enough context for a TA to evaluate
   - Follow the same style as [`reports/week3/customer-review-transcript.md`](../reports/week3/customer-review-transcript.md)

2. **Generate `reports/week4/customer-review-summary.md`**:
   - Date, who was there (roles, not names)
   - Sprint Goal (from the Sprint 3 milestone)
   - What was shown
   - UAT results
   - Quality evidence discussed
   - Which CI checks and tests should stick around for future sprints
   - Customer feedback, approvals, change requests
   - Risks and follow-up items
   - Backlog updates

3. **If publication was refused but private sharing is OK**:
   - Don't commit the transcript
   - Note in [`reports/week4/README.md`](../reports/week4/README.md): "Transcript on Moodle only"
   - Include it in the Moodle PDF

4. **If recording or sharing was refused entirely**:
   - Write `reports/week4/customer-review-notes.md` instead
   - Chronological notes covering: goal, increment, feedback, UAT, quality evidence, decisions, risks, backlog

5. **If UAT and Review were the same meeting**: one file handles both, with timecodes

### What you do

- [x] **Ask permission before recording** — it's a separate question from UAT permission
- [x] Ask about public transcript vs private sharing
- [ ] After the meeting, give the AI notes, quotes, decisions, timecodes
- [ ] If publishing: commit `customer-review-transcript.md`
- [ ] If not publishing: Moodle-only, note it in the report
- [ ] If no recording allowed: commit `customer-review-notes.md`
- [ ] Always commit `customer-review-summary.md`
- [ ] Private recording link goes to Moodle only

---

## Part 12: Sprint Retrospective

### What the AI does

1. After you give it team input, it writes `reports/week4/retrospective.md`:

```markdown
# Sprint 3 Retrospective — Assignment 4

**Date:** [date]

## What went well
- ...

## What didn't go well
- ...

## What we changed since last sprint
Based on the previous retro (in `reports/week3/retrospective.md`):
- ...

## What we'll do differently next sprint
1. ...
2. ...
```

2. The AI checks the existing [`reports/week3/retrospective.md`](../reports/week3/retrospective.md) to reference whatever was planned last time

### What you do

- [ ] Run the retro with your team (Start/Stop/Continue, Mad/Sad/Glad, whatever works)
- [ ] Collect honest input from everyone
- [ ] Give the AI bullet points
- [ ] Review and push

---

## Part 13: Reflect on the Week

### What the AI does

1. After you give it team input, it writes `reports/week4/reflection.md` with these sections:

   **Learning points:**
   - What came out of customer feedback, QRs, QRTs, CI, UAT, Sprint Review, and the release

   **Validated assumptions:**
   - Things you assumed that turned out right or wrong — backed by implementation, testing, CI, UAT, feedback

   **Friction and gaps:**
   - Unresolved requirements, technical risks, quality gaps, missing coverage, blocked work, process problems, questions you still have

   **Planned response:**
   - Concrete things to do next sprint, linked to PBIs, QRs, UATs, CI checks, milestones, releases, or docs

### What you do

- [ ] Discuss these topics with your team
- [ ] Pass the AI your raw thoughts
- [ ] Review and push

---

## Part 14: Prepare and Rehearse the Project Presentation

### What the AI does

1. **Suggest a structure** — the AI won't build slides for you, but it'll give you a framework:

   ```markdown
   ## Presentation structure (5 min)

   1. Project context (~30s) — the problem, the solution, who it's for
   2. Demo (< 2 min) — show the thing. Practice this part most.
   3. Team (~30s) — who did what
   4. Requirements (~30s) — top backlog items, quality requirements
   5. Roadmap (~30s) — Sprint 1 ✅ → Sprint 2 ✅ → Sprint 3 (now) → Sprint 4 (next)
   6. Client collaboration (~30s) — what they use, what they said, challenges
   7. Links + QR codes (~10s) — GitHub repo, deployed product
   ```

2. **Reminders:** 5 min hard cap, 2 min Q&A, whole team on stage (2-3 speakers), answer questions by area

### What you do (mostly manual, AI can't do this for you)

- [ ] Build the slide deck (PowerPoint, Google Slides, whatever)
- [ ] Slap QR codes on for the GitHub repo and deployment URL
- [ ] Practice the demo until it's comfortably under 2 minutes
- [ ] Practice the whole thing until it fits 5 minutes
- [ ] Submit slides via Moodle
- [ ] Record a rehearsed video (< 5 min), host privately, submit link via Moodle
- [ ] Prep for Q&A — make sure the person who built each part can answer questions about it

---

## Part 15: Public Sanitized Demo Video

### What the AI does

1. **Write a shot list** for your demo video:

   ```markdown
   ## Demo script (< 2 min)

   - Terminal: `python -m tickframe scan --symbol BTCUSDT --interval 5m --limit 100`
   - Browser: open dashboard, show candlestick chart with pattern markers
   - Click a marker → analysis details
   - Toggle day/night theme
   - Show sidebar with live prices
   - Terminal: `python -m tickframe report --output report.md`
   - Share generated report
   - Closing: QR code, GitHub link, "TickFrame — open-source crypto chart pattern detection"
   ```

2. **Link the video** from:
   - [`reports/week4/README.md`](../reports/week4/README.md)
   - The SemVer release

### What you do

- [ ] Record the video (< 2 min) — screen recording, voiceover, whatever works
- [ ] Only use sanitized data — no real API keys or private info on screen
- [ ] Upload somewhere public (YouTube unlisted, Google Drive)
- [ ] Give the AI the link
- [ ] Test it in incognito to make sure it's actually accessible

---

## After Part 15 — Deploy & Release (Part 9)

> This should really happen after implementation (Part 5) but before the reports.
> If the AI hasn't done it yet, now's the time.

### What the AI does

1. **Deploy** — update `README.md` with the latest deployment/run instructions
2. **Create a SemVer release** on GitHub:
   - Tag: `v0.2.0` (next version after v1.0.0)
   - Point to a commit on `main`
   - Description: "Assignment 4 Sprint increment"
   - Links to: Sprint 3 milestone, deployment instructions, public demo video
3. **Update [`CHANGELOG.md`](../CHANGELOG.md)** — move `[Unreleased]` into a dated `[0.2.0]` section
4. Keep the release, tag, and deployment artifact around for future sprints

### What you do

- [ ] Make sure the deployed product is actually reachable
- [ ] Screenshot the release page → `reports/week4/images/semver-release.png`
- [ ] Check the release links all point to the right places

---

## Part 16: Report on LLM Usage

### What the AI does

1. **Write [`reports/week4/llm-report.md`](../reports/week4/llm-report.md)** covering:
   - **Tools used:** OpenCode (deepseek-v4-flash-free) plus anything else (Copilot, ChatGPT, etc.)
   - **What for:** sprint planning, issue creation, QR definitions, QRT tests, CI config, code, docs, UAT scenarios, report drafts
   - **Gotchas:** e.g., "gh wasn't available, so issues were created manually" or "AI obviously can't record videos or run meetings"
2. If the AI wasn't used for something, say so

### What you do

- [ ] Add any tools the AI doesn't know about
- [ ] Make sure it's honest
- [ ] Push [`reports/week4/llm-report.md`](../reports/week4/llm-report.md)

---

## Repository Report — `reports/week4/README.md`

### What the AI does

1. **Build the complete [`reports/week4/README.md`](../reports/week4/README.md)** with all 42 required items. The skeleton:

```markdown
# Week 4 — Assignment 4 Report

**TickFrame** — open-source crypto chart pattern detection.  
**Team:** SWP_TickFrame_28 — **Repo:** https://github.com/Fedos113/SWP_TickFrame_28_team

---

## Sprint Planning
- Product Backlog: https://github.com/Fedos113/SWP_TickFrame_28_team/issues
- Sprint Backlog: https://github.com/users/Fedos113/projects/1/views/1
- Sprint 3 milestone: https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/3
- Goal: [from milestone] — Dates: [from milestone] — SP: [total]

## What Was Delivered
- [PR links to implemented features, tests, CI config, docs]

## Deployed
- URL: [deployment URL]
- How to run: [README.md](../README.md)

## Customer Feedback
| Feedback | PBI | Status | Response |
|---|---|---|---|
| ... | ... | ... | ... |
*Unaddressed:* [explanation]

## Docs
- [Roadmap](../docs/roadmap.md), [DoD](../docs/definition-of-done.md), [QRs](../docs/quality-requirements.md), [QRTs](../docs/quality-requirement-tests.md), [Testing](../docs/testing.md), [UATs](../docs/user-acceptance-tests.md)

## Quality Model
QR-001: Performance Efficiency — Time behaviour  
QR-002: Security — Confidentiality  
QR-003: Functional Suitability — Accuracy  

## Test Coverage
| Module | % |
|---|---|
| bybit_client.py | XX |
| cache.py | XX |
| endpoints.py | XX |
| websocket.py | XX |
| detection/mock.py | XX |
| schemas.py | XX |

Unit tests: [tests/unit/](../../tests/unit/)  
Integration: [tests/integration/](../../tests/integration/)  
QRTs: [tests/requirements/](../../tests/requirements/)

## CI
- [.github/workflows/ci.yml](../../.github/workflows/ci.yml) — [.github/workflows/lychee.yml](../../.github/workflows/lychee.yml)
- Latest run: [link]

## Screenshots
![milestone](images/sprint-milestone.png)
![ci](images/ci-pass.png)
![coverage](images/coverage-report.png)
![qa-check](images/qa-check.png)
![release](images/semver-release.png)
![reviewed-pr](images/reviewed-pr.png)

## Quality Gates Going Forward
[How tests, CI, QRTs, and DoD stay enforced after this sprint]

## Release
v0.2.0: https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/v0.2.0  
CHANGELOG: [CHANGELOG.md](../CHANGELOG.md)  
Demo: [link]

## UAT
UAT-001: ✅ — UAT-002: ❌ ...  
Key feedback: ...  
Resulting PBIs: ...

## Customer Review
Transcript: [file] or *Moodle only*  
Summary: [customer-review-summary.md](customer-review-summary.md)

## Retrospective
[retrospective.md](retrospective.md)

## Reflection
[reflection.md](reflection.md)

## LLM Report
[llm-report.md](llm-report.md)

## Status & Next Steps
[summary of where things are and what's coming]

## Contributions
| Person | Issues | PRs | Reviews | Testing | QA | Docs |
|---|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ... | ... |

## Presentation
Slides (public): [presentation.pdf](presentation.pdf) — or *Moodle only*
```

### What you do

- [ ] Drop your screenshots into `reports/week4/images/` before the AI builds this
- [ ] Give the AI:
  - Team member usernames and what each person did
  - Deployed product URL
  - CI run URL
- [ ] Click every link to make sure it works
- [ ] Push

---

## Moodle PDF

### What the AI does

1. **Generate the outline** — you create the actual PDF. It needs:

   - Project name + team number
   - Table: Name, uni email, GitHub username, Scrum role, technical role
   - Who did what this sprint
   - Who didn't participate (if anyone)
   - Permalink to `reports/week4/README.md`: `https://github.com/Fedos113/SWP_TickFrame_28_team/blob/<hash>/reports/week4/README.md`
   - Permalink to repo tree at submission: `https://github.com/Fedos113/SWP_TickFrame_28_team/tree/<hash>`
   - Sprint Review recording link (private)
   - UAT recording link (private, or timecode if same recording)
   - Sanitized transcript (if not published) or notes
   - Public customer review summary link
   - Rehearsed presentation video link (private)
   - Private access instructions (deployment URL, test credentials)
   - Instructor-only evidence (consent, credentials, customer-identifying info)

### What you do

- [ ] **Create the PDF** — Word → PDF, Google Docs, LaTeX, whichever you like
- [ ] Test every private link in incognito (instructors need access)
- [ ] Test every public link too
- [ ] Submit to Moodle
- [ ] Submit slides through the dedicated Moodle slide submission
- [ ] Keep everything accessible until grades are posted

---

## Final Submission Checklist

### In the repo (`main`)
- [ ] `reports/week4/README.md` — complete, all 42 items
- [ ] `reports/week4/customer-review-summary.md`
- [ ] `reports/week4/customer-review-transcript.md` — or Moodle-only note
- [ ] `reports/week4/customer-review-notes.md` — if needed
- [ ] `reports/week4/retrospective.md`
- [ ] `reports/week4/reflection.md`
- [ ] `reports/week4/llm-report.md`
- [ ] `reports/week4/images/` — all screenshots
- [ ] `docs/roadmap.md`, `docs/definition-of-done.md`, `docs/quality-requirements.md`, `docs/quality-requirement-tests.md`, `docs/testing.md`, `docs/user-acceptance-tests.md`
- [ ] `CHANGELOG.md` — v0.2.0 released
- [ ] `README.md` — updated run/deploy instructions
- [ ] `tests/` — all unit, integration, and QRT tests
- [ ] `.github/workflows/ci.yml` — full pipeline
- [ ] SemVer release on GitHub (v0.2.0)

### On Moodle
- [ ] PDF with all private links
- [ ] Presentation slides via dedicated submission
- [ ] Rehearsed presentation video link

### Final checks
- [ ] All public links work in incognito
- [ ] All private links accessible to instructors
- [ ] CI passes on `main`
- [ ] Coverage ≥30% on critical modules
- [ ] Additional QA check runs and passes
- [ ] Deployed product is accessible
- [ ] Everything stays accessible until grading
