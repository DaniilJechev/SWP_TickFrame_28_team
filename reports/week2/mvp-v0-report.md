# MVP v0 Report

## Purpose and description
This MVP v0 describes the initial product foundation for SWP TickFrame.

The current foundation includes:
- MIT-licensed public repository structure
- `.env.example` for sanitized configuration
- `.github/pull_request_template.md` for review consistency
- `.github/workflows/lychee.yml` for automatic Markdown link checking
- Week 2 report structure under `reports/week2/`
- Runnable CLI interface documented in `docs/interface.md`
- Minimal CLI implementation in `tickframe/`

## Deployment or runnable artifact
This MVP v0 is available in the repository at:
- `https://github.com/DaniilJechev/SWP_TickFrame_28_team`
- Branch: `infra/initial-setup`

## Runnable artifact
Use the local CLI from the repository root:
- `python -m tickframe --help`
- `python -m tickframe scan --symbol BTCUSDT --interval 1h --limit 3`
- `python -m tickframe report --symbol BTCUSDT --interval 1h --output reports/week2/mvp0-report.md`

## Smoke-check scenario
Repeatable smoke-check scenario:
1. Open a terminal in the repository root.
2. Run `python -m tickframe --help`.
3. Run `python -m tickframe scan --symbol BTCUSDT --interval 1h --limit 3`.
4. Run `python -m tickframe report --symbol BTCUSDT --interval 1h --output reports/week2/mvp0-report.md`.
5. Confirm that `reports/week2/mvp0-report.md` is created or updated.

Expected result:
- The CLI displays help text.
- The scan command prints sample pattern results.
- The report command writes a Markdown report file.

## Current limitations and placeholders
- The current CLI uses mocked sample scan output.
- Real market data ingestion and machine learning prediction are not implemented.
- The MVP v0 foundation is intentionally minimal to satisfy the runnable interface requirement.

## Relationship to the prototype and proposed MVP v1 stories
- The CLI interface supports the proposed MVP v1 scope by defining how users will run scans and generate reports.
- It maps to user stories such as US-01, US-02, and US-03 by providing a runnable product foundation.

## Link to local setup instructions
- Root README: `../README.md`
- Interface documentation: `../../docs/interface.md`
- Week 2 report index: `README.md`
