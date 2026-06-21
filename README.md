# SWP TickFrame — Team 28

Analytical platform for automated historical cryptocurrency chart scanning and pattern verification using XGBoost machine learning models.

**Current implementation:** MVP v0 with Bybit API integration, real-time candle cache, interactive web dashboard, and mock ML pattern detection.

---

## Prerequisites

- **Git**
- **Python 3.10+** (for local installation)
- **Docker** (optional — for containerized installation)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-org/SWP_TickFrame_28_team.git
cd SWP_TickFrame_28_team
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` to set your Bybit API keys (optional — public endpoints work without keys).

---

## Local Setup

### Linux / macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Windows (PowerShell)

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Verify installation

```bash
python -m tickframe --help
```

---

## Docker Setup

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (included with Docker Desktop)

### Build and run

```bash
docker compose up --build
```

The web dashboard will be available at **http://localhost:5000**.

To run a specific command instead of the dashboard:

```bash
docker compose run --rm tickframe scan --symbol BTCUSDT --interval 1h --limit 10
```

---

## Usage

```bash
# Fetch real candle data from Bybit
python -m tickframe scan --symbol BTCUSDT --interval 1h --limit 10

# Run pattern analysis on cached candles
python -m tickframe analyze --symbol BTCUSDT --interval 5m

# Generate a Markdown report
python -m tickframe report --symbol BTCUSDT --interval 1h --limit 10

# Start the interactive web dashboard
python -m tickframe serve --port 5000

# Use mock data (no API call)
python -m tickframe scan --symbol BTCUSDT --interval 1h --limit 10 --mock

# Smoke-check verification
python main.py --symbol BTCUSDT --smoke-check
```

---

## Documentation & Reports

| Resource | Link |
|---|---|
| Week 2 Reports | [reports/week2/](reports/week2/README.md) |
| MVP v0 Report | [reports/week2/mvp-v0-report.md](reports/week2/mvp-v0-report.md) |
| Smoke-Check Guide | [reports/week2/smoke-check-evaluation-guide.md](reports/week2/smoke-check-evaluation-guide.md) |
| Product Interface | [docs/interface.md](docs/interface.md) |
| License | [MIT](LICENSE) |

---

## Project Structure

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
