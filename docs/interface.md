# Product Interface Documentation

## Interface type
Command-line interface (CLI) with a web dashboard.

## Intended users
- Team members implementing the product
- TA evaluating MVP v0
- Reviewers checking the repository setup and interface contract

## Commands

### `python -m tickframe --help`
Displays the CLI help and available commands.

### `python -m tickframe scan [options]`
Fetches real OHLCV candle data from Bybit and prints a formatted table.

Options:
- `--symbol`: cryptocurrency symbol (default `BTCUSDT`)
- `--interval`: candle interval (default `1h`)
- `--limit`: number of candles to fetch (default `10`, max `1000`)
- `--category`: market category — `spot` or `linear` (default `spot`)
- `--output`: optional JSON output file path
- `--mock`: use demo data instead of Bybit

### `python -m tickframe report [options]`
Generates a Markdown report from scan data.

Options:
- `--symbol`: cryptocurrency symbol (default `BTCUSDT`)
- `--interval`: candle interval (default `1h`)
- `--limit`: number of candles (default `10`)
- `--category`: market category (default `spot`)
- `--output`: output Markdown file path (default `reports/scan-report.md`)
- `--mock`: use demo data instead of Bybit

### `python -m tickframe analyze [options]`
Caches candles (default 200 at 5-min interval) and runs mock ML pattern detection on the last 50 candles.

Options:
- `--symbol`: cryptocurrency symbol (default `BTCUSDT`)
- `--interval`: candle interval (default `5m`)
- `--limit`: number of candles to cache (default `200`)
- `--output`: optional JSON output file

### `python -m tickframe serve [options]`
Starts the interactive web dashboard with a candlestick chart.

Options:
- `--host`: host to bind (default `0.0.0.0`)
- `--port`: port to listen on (default `5000`)
- `--symbol`: cryptocurrency symbol (default `BTCUSDT`)

## Inputs
- Symbol name, interval, limit, category, and optional output path.
- No credentials are required — Bybit public API endpoints are used.

## Outputs
- Formatted OHLCV table printed to terminal (`scan`).
- JSON scan file (`scan --output`).
- Markdown report file (`report`).
- JSON analysis result (`analyze --output`).
- Interactive web dashboard at `http://localhost:5000` (`serve`).

## Success example
```bash
python -m tickframe scan --symbol BTCUSDT --interval 1h --limit 5
python -m tickframe analyze --symbol BTCUSDT --interval 5m
python -m tickframe serve --port 5000
```

## Error example
If no command is given, the CLI prints the help text and exits with status 1.

## MVP v0 implementation status
- Bybit API integration: real OHLCV data fetching from Bybit v5 market kline endpoint.
- Candle cache: threaded in-memory cache with automatic refresh every 60 seconds.
- Web dashboard: interactive candlestick chart using lightweight-charts (TradingView).
- Mock ML detection: randomized pattern detection on the last 50 candles.
- All existing mock/demo functionality preserved via `--mock` flag.
