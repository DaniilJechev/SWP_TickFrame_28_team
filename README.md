# SWP TickFrame — Team 28

## Project Description
An analytical platform designed for automated historical cryptocurrency chart scanning and chart pattern verification using trained XGBoost machine learning models.

Current implementation: MVP v0 with Bybit API integration, real-time candle cache, interactive web dashboard, and mock ML pattern detection.

## Navigation & Reports
- [Week 2 Report Index](reports/week2/README.md)
- [MVP v0 Report](reports/week2/mvp-v0-report.md)
- [Smoke-Check Evaluation Guide](reports/week2/smoke-check-evaluation-guide.md)
- [Product interface documentation](docs/interface.md)
- [MIT License](LICENSE)

## Local Setup Instructions
1. Clone the repository.
2. Copy `.env.example` to `.env` and fill in your details.
3. Install Python 3.10 or later.
4. Install dependencies: `pip install -r requirements.txt`
5. Verify the CLI: `python -m tickframe --help`

## Usage
```bash
# Fetch real candle data from Bybit
python -m tickframe scan --symbol BTCUSDT --interval 1h --limit 10

# Run pattern analysis on cached candles
python -m tickframe analyze --symbol BTCUSDT --interval 5m

# Start the interactive web dashboard
python -m tickframe serve --port 5000
```

## Project structure
```
tickframe/
├── cli.py              # CLI entry point
├── exchange/
│   └── bybit.py        # Bybit API client
├── data/
│   └── cache.py        # Candle cache with auto-refresh
├── detection/
│   └── mock.py         # Mock ML pattern detector
└── web/
    ├── server.py       # HTTP server
    └── static/
        └── index.html  # Chart frontend
```
