# Testing Strategy

## Testing Levels

### 1. Unit Tests
- **Framework:** pytest + pytest-asyncio
- **Location:** `tests/unit/`

| Module | Test file | Topics covered |
|---|---|---|
| `tickframe/backend/services/bybit_client.py` | `tests/unit/test_bybit_client.py` | Data fetching, Binance fallback, error handling |
| `tickframe/backend/services/cache.py` | `tests/unit/test_cache.py` | Market snapshot, price refresh, staleness |
| `tickframe/backend/models/schemas.py` | `tests/unit/test_schemas.py` | Pydantic validation, serialization, edge cases |
| `tickframe/detection/mock.py` | `tests/unit/test_detection.py` | Empty data, insufficient data, analysis threshold |

### 2. Integration Tests
- **Framework:** pytest + httpx (FastAPI TestClient via ASGITransport)
- **Location:** `tests/integration/`

| Test file | What it tests |
|---|---|
| `tests/integration/test_api_endpoints.py` | REST API health, coins listing, candles endpoint (including error cases) |

**Planned but not yet implemented:**
- WebSocket integration tests (`test_websocket.py`) — connect, receive snapshot, verify heartbeat
- CLI workflow tests (`test_scan_workflow.py`) — end-to-end scan → report flow

### 3. Quality Requirement Tests
- **Framework:** pytest + httpx
- **Location:** `tests/requirements/`

| Test file | QRT | What it tests |
|---|---|---|
| `tests/requirements/test_performance.py` | QRT-001 | API response time < 2s |
| `tests/requirements/test_security.py` | QRT-002 | No API key leakage in responses |
| `tests/requirements/test_accuracy.py` | QRT-003 | Candle OHLCV parsing accuracy |

---

## Critical Modules

Target line coverage ≥ 30% for each critical module:

| Module | Path | Target | Current |
|---|---|---|---|
| Bybit client | `tickframe/backend/services/bybit_client.py` | ≥30% | — |
| Cache | `tickframe/backend/services/cache.py` | ≥30% | — |
| API endpoints | `tickframe/backend/api/endpoints.py` | ≥30% | — |
| WebSocket | `tickframe/backend/api/websocket.py` | ≥30% | — |
| Pattern detection | `tickframe/detection/mock.py` | ≥30% | — |
| Schemas | `tickframe/backend/models/schemas.py` | ≥30% | — |

---

## Running Tests

```bash
pip install -r requirements.txt
pip install -r tests/requirements.txt
pytest --cov=tickframe --cov-report=term tests/
```

## CI Pipeline

| Job | Tool | Command |
|---|---|---|
| lint | ruff | `ruff check .` |
| type-check | mypy | `mypy tickframe/` |
| test | pytest + coverage | `pytest --cov=tickframe --cov-report=term --cov-report=xml tests/` |
| qa-check | bandit | `bandit -r tickframe/ -ll` |

**File:** `.github/workflows/ci.yml`
**Triggers:** push and pull_request to `main`

## Additional QA Check

| Field | Value |
|---|---|
| **Check** | **bandit** — Python security linter |
| **Objective** | Detect hardcoded passwords, injections, insecure imports, and potential secret leaks |
| **Why bandit?** | Lightweight, zero-config, catches real security issues (hardcoded passwords, SQL injection, shell injection, insecure crypto) without false-positive noise |
| **Risk addressed** | Accidental secret leakage, injection vulnerabilities, insecure deserialization |
| **CI location** | `.github/workflows/ci.yml` — job `qa-check` |
| **Command** | `bandit -r tickframe/ -ll` (only HIGH and MEDIUM severity) |
| **Limitations** | Python source only; does not audit frontend JavaScript, Docker config, or YAML workflows |

### Alternative QA tools considered

| Tool | Why not chosen |
|---|---|
| **safety / pip-audit** | Requires network access to vulnerability DB; CI may fail due to rate limiting or transient network issues |
| **vulture** | Dead code detection; useful but not critical for this sprint's quality gate |
| **pylint** | Heavier than ruff; mostly duplicates what ruff + mypy already check |
| **mypy --strict** | Too many existing violations would require extensive refactoring; incrementally adoptable in future sprints |
