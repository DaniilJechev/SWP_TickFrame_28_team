# Testing Strategy

> **Template — Assignment 4, Part 7**
>
> Instructions:
> - Document the testing strategy for TickFrame
> - Identify critical modules and set coverage targets
> - Link to actual test files in `tests/`
> - Update as the product evolves

---

## Testing Levels

### 1. Unit Tests
- **Scope:** Individual functions and classes in backend services
- **Framework:** pytest + pytest-asyncio
- **Location:** `tests/unit/`
- **Coverage target:** ≥30% line coverage per critical module

| Module | Test file | Topics covered |
|---|---|---|
| `tickframe/backend/services/bybit_client.py` | `tests/unit/test_bybit_client.py` | Data fetching, parsing, error handling |
| `tickframe/backend/services/cache.py` | `tests/unit/test_cache.py` | Set/get/clear, expiry, concurrency |
| `tickframe/backend/models/schemas.py` | `tests/unit/test_schemas.py` | Validation, serialization, defaults |
| `tickframe/detection/mock.py` | `tests/unit/test_detection.py` | Pattern detection logic, edge cases |

### 2. Integration Tests
- **Scope:** API endpoints, WebSocket, and cross-component workflows
- **Framework:** pytest + httpx (FastAPI TestClient)
- **Location:** `tests/integration/`

| Test file | What it tests |
|---|---|
| `tests/integration/test_api_endpoints.py` | REST API endpoints (chart, scan, config) |
| `tests/integration/test_websocket.py` | WebSocket connection and message flow |
| `tests/integration/test_scan_workflow.py` | End-to-end: CLI scan → report generation |

### 3. Quality Requirement Tests
- **Scope:** Automated verification of quality requirements (QR-001 through QR-003+)
- **Framework:** pytest
- **Location:** `tests/requirements/`
- **Linked from:** `docs/quality-requirement-tests.md`

---

## Critical Modules

| Module | Path | Coverage target |
|---|---|---|
| Bybit client | `tickframe/backend/services/bybit_client.py` | ≥30% |
| Cache | `tickframe/backend/services/cache.py` | ≥30% |
| API endpoints | `tickframe/backend/api/endpoints.py` | ≥30% |
| WebSocket | `tickframe/backend/api/websocket.py` | ≥30% |
| Pattern detection | `tickframe/detection/mock.py` | ≥30% |
| Schemas | `tickframe/backend/models/schemas.py` | ≥30% |

> **Note:** Global repository coverage may be lower if the team documents why.
> Critical module targets are minimums; higher coverage is better.

---

## Coverage Configuration

```ini
# .coveragerc — TEMPLATE
[run]
source = tickframe
omit = */__main__.py,*/cli.py

[report]
exclude_lines =
    pragma: no cover
    def __repr__
    raise NotImplementedError
    if __name__ == .__main__.:
```

## Running Tests Locally

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx pytest-cov

# Run all tests with coverage
pytest --cov=tickframe --cov-report=term --cov-report=html tests/

# View HTML report
open htmlcov/index.html
```

---

## Additional QA Check

| Field | Value |
|---|---|
| **Check** | _[e.g., bandit — Python security linter]_ |
| **Objective** | _[e.g., Detect hardcoded passwords, SQL injections, insecure imports]_ |
| **Risk addressed** | _[e.g., Accidental secret leakage or security vulnerability in dependency]_ |
| **CI location** | `.github/workflows/ci.yml` — job `qa-check` |
| **Command** | `bandit -r tickframe/ -ll` |
| **Limitations** | _[e.g., Limited to Python code; does not audit frontend JS or Docker config]_ |

> The additional QA check must be **distinct** from: linting, formatting, type checking, build,
> unit/integration tests, coverage, and link checking.
> Lychee already covers link checking — do not duplicate.
