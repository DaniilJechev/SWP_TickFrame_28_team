# MVP v0 Report

## Purpose and description
This MVP v0 describes the initial product foundation and repository infrastructure for the SWP TickFrame project.

The current foundation includes:
- MIT-licensed public repository structure
- `.env.example` for sanitized configuration
- `.github/pull_request_template.md` for review consistency
- `.github/workflows/lychee.yml` for automatic Markdown link checking
- Week 2 report structure under `reports/week2/`

## Deployment or runnable artifact
This MVP v0 is a repository infrastructure foundation available at:
- `https://github.com/DaniilJechev/SWP_TickFrame_28_team`
- Branch: `infra/initial-setup`

## Smoke-check scenario
Repeatable smoke-check scenario:
1. Open the repository on GitHub.
2. Confirm that the branch `infra/initial-setup` exists.
3. Confirm that `.github/pull_request_template.md` is present.
4. Confirm that `.github/workflows/lychee.yml` is present.
5. Confirm that `reports/week2/README.md` and `reports/week2/user-stories.md` exist.
6. Verify that `LICENSE`, `.gitignore`, and `.env.example` are present in the repository root.

Expected result:
- All required files exist.
- The PR template and workflow definitions are configured.

## Current limitations and placeholders
- No product business logic is implemented yet.
- The Week 2 report files are initialized and contain structured content, but meeting evidence is still pending.
- The MVP v0 foundation is repository infrastructure rather than a finished analytical application.

## Relationship to the prototype and proposed MVP v1 stories
- This foundation supports the planned MVP v1 scope by providing the required repository, review, and CI workflow structure.
- The repository skeleton is necessary before implementing the user-facing analytical features described in `reports/week2/user-stories.md`.

## Link to local setup instructions
- Root README: `../README.md`
- Week 2 report index: `README.md`
