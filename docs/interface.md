# Product Interface Documentation

## Interface type
Command-line interface (CLI).

## Intended users
- Team members implementing the product
- TA evaluating MVP v0
- Reviewers checking the repository setup and interface contract

## Commands

### `python -m tickframe --help`
Displays the CLI help and available commands.

### `python -m tickframe scan [options]`
Runs a sample chart scan and prints a summary.

Options:
- `--symbol`: cryptocurrency symbol (default `BTCUSDT`)
- `--interval`: candle interval (default `1h`)
- `--limit`: number of sample records (default `3`)
- `--output`: optional JSON output file path

### `python -m tickframe report [options]`
Generates a sample Markdown report.

Options:
- `--symbol`: cryptocurrency symbol (default `BTCUSDT`)
- `--interval`: candle interval (default `1h`)
- `--output`: output Markdown file path (default `reports/week2/mvp0-report.md`)

## Inputs
- Symbol name, interval, and optional output path.
- No real credentials are required for MVP v0.

## Outputs
- Human-readable scan summary printed to the terminal.
- Optional JSON scan file.
- Markdown report file for `report`.

## Success example
`python -m tickframe scan --symbol BTCUSDT --interval 1h --limit 2`

Expected result:
- Two sample scan rows printed to the terminal.
- No errors.

## Error example
If no command is given, the CLI prints the help text and exits with status 1.

## MVP v0 implementation status
- The current MVP v0 CLI is a runnable placeholder.
- It demonstrates the product interface and provides mock scan output.
