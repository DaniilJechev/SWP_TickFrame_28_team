# Week 2 User Stories

## Initial proposed MVP v1 scope

- US-01
- US-02
- US-03

## User stories

## US-01: Scan historical cryptocurrency candles
**Requirement status:** Active
**MoSCoW priority:** Must Have

As a quantitative analyst,
I want to scan historical cryptocurrency candle charts automatically,
so that I can find trading patterns faster than manual review.

### Notes and constraints
- The system should support at least one cryptocurrency symbol and daily or hourly candles.
- Initial MVP can use saved sample data.

## US-02: Detect chart patterns with ML support
**Requirement status:** Active
**MoSCoW priority:** Must Have

As a trader,
I want the system to detect predefined chart patterns using machine learning,
so that I can prioritize the most promising market opportunities.

### Notes and constraints
- The pattern detector may use XGBoost or another supervised model.
- The initial version can return pattern confidence scores only.

## US-03: View scan results in a report-friendly format
**Requirement status:** Active
**MoSCoW priority:** Must Have

As a team member,
I want to export scan results to a readable report,
so that the TA and customer can evaluate the output easily.

### Notes and constraints
- The initial output may be a Markdown report or JSON summary.
- The report should include timestamps, symbols, and detected patterns.

## US-04: Maintain a public repository with MIT license
**Requirement status:** Active
**MoSCoW priority:** Must Have

As a course participant,
I want the product repository to be public and MIT licensed,
so that the project complies with the assignment requirements.

### Notes and constraints
- The repository must include `LICENSE`, `.gitignore`, and `.env.example`.

## US-05: Use a pull request workflow for changes
**Requirement status:** Active
**MoSCoW priority:** Must Have

As a team member,
I want to work on a separate branch and submit changes by pull request,
so that protected main branch rules are respected.

### Notes and constraints
- `main` must remain protected by branch rules.
- Each change should use a focused feature branch.

## US-06: Automatically check Markdown links on PRs
**Requirement status:** Active
**MoSCoW priority:** Should Have

As a reviewer,
I want GitHub Actions to verify Markdown links automatically,
so that broken links are found before the report is graded.

### Notes and constraints
- Use Lychee in `.github/workflows/lychee.yml`.
- Check all `.md` files under `reports/` and repository root.

## US-07: Provide a reusable environment variable template
**Requirement status:** Active
**MoSCoW priority:** Should Have

As a developer,
I want a sanitized `.env.example` file,
so that I can set up the local environment without exposing secrets.

### Notes and constraints
- Real credentials must never be committed.
- Add `.env` to `.gitignore`.

## US-08: Document the current Week 2 deliverables
**Requirement status:** Active
**MoSCoW priority:** Should Have

As a TA,
I want clear Week 2 documentation in the repository,
so that I can find required files and understand progress.

### Notes and constraints
- Include summaries and links inside `reports/week2/README.md`.

## US-09: Keep a PR template for review consistency
**Requirement status:** Active
**MoSCoW priority:** Could Have

As a reviewer,
I want a standardized PR description template,
so that every team PR includes summary, tests, and review checklist.

### Notes and constraints
- Use `.github/pull_request_template.md`.

## US-10: Use a report folder structure for Week 2
**Requirement status:** Active
**MoSCoW priority:** Could Have

As a project manager,
I want Week 2 files organized under `reports/week2/`,
so that assignment evidence is easy to locate.

### Notes and constraints
- Include a separate folder for images.
