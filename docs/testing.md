# Testing Strategy

## Testing Levels

### 1. Unit Tests
- **Framework:** pytest + pytest-asyncio
- **Location:** `tests/unit/`

| Module | Test file | Topics covered |
|---|---|---|
| `tickframe/backend/services/bybit_client.py` | `tests/unit/test_bybit_client.py` | Data fetching, parsing, error handling |
| `tickframe/backend/services/cache.py` | `tests/unit/test_cache.py` | Set/get/clear, expiry |
| `tickframe/backend/models/schemas.py` | `tests/unit/test_schemas.py` | Validation, serialization |
| `tickframe/detection/mock.py` | `tests/unit/test_detection.py` | Pattern detection logic |

### 2. Integration Tests
- **Framework:** pytest + httpx (FastAPI TestClient)
- **Location:** `tests/integration/`

| Test file | What it tests |
|---|---|
| `tests/integration/test_api_endpoints.py` | REST API health + candles endpoints |

### 3. Quality Requirement Tests
- **Framework:** pytest
- **Location:** `tests/requirements/`

| Test file | QRT | What it tests |
|---|---|---|
| `tests/requirements/test_performance.py` | QRT-001 | API response time < 2s |
| `tests/requirements/test_security.py` | QRT-002 | No API key leakage |
| `tests/requirements/test_accuracy.py` | QRT-003 | Candle price accuracy |

---

## Critical Modules

| Module | Path | Target coverage | Current |
|---|---|---|---|
| Bybit client | `tickframe/backend/services/bybit_client.py` | ≥30% | - |
| Cache | `tickframe/backend/services/cache.py` | ≥30% | - |
| API endpoints | `tickframe/backend/api/endpoints.py` | ≥30% | - |
| WebSocket | `tickframe/backend/api/websocket.py` | ≥30% | - |
| Pattern detection | `tickframe/detection/mock.py` | ≥30% | - |
| Schemas | `tickframe/backend/models/schemas.py` | ≥30% | - |

---

## Running Tests

```bash
pip install -r tests/requirements.txt
pytest --cov=tickframe --cov-report=term tests/
```

## CI Pipeline

- **File:** `.github/workflows/ci.yml`
- **Jobs:** lint (ruff), type-check (mypy), test (pytest + coverage), qa-check (bandit)
- **Runs on:** push/PR to `main`

## Additional QA Check

| Field | Value |
|---|---|
| **Check** | bandit — Python security linter |
| **Objective** | Detect hardcoded passwords, injections, insecure imports |
| **Risk addressed** | Accidental secret leakage or security vulnerabilities |
| **CI location** | `.github/workflows/ci.yml` — job `qa-check` |
| **Command** | `bandit -r tickframe/ -ll` |
| **Limitations** | Python code only; does not audit frontend JS or Docker config |
