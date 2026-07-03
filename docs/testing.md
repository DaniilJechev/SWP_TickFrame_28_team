# Testing Strategy

## Testing Levels

### 1. Unit Tests
- **Framework:** pytest + pytest-asyncio
- **Location:** `tests/unit/`

| Module | Test file | Topics covered |
|---|---|---|
| `tickframe/backend/services/bybit_client.py` | `tests/unit/test_bybit_client.py` | Data fetching, Binance fallback, error handling, multi-interval support (15m, 1h, 4h, 1d) |
| `tickframe/backend/services/cache.py` | `tests/unit/test_cache.py` | Market snapshot, price refresh, staleness |
| `tickframe/backend/models/schemas.py` | `tests/unit/test_schemas.py` | Pydantic validation, serialization, edge cases |
| `tickframe/detection/mock.py` | `tests/unit/test_detection.py` | Empty data, insufficient data, analysis threshold, configurable analysis range (limit param) |
| `tickframe/backend/api/websocket.py` | `tests/unit/test_websocket.py` | Connection, heartbeat, subscription, reconnection, fan-out to clients |
| `tickframe/backend/services/database.py` | `tests/unit/test_database.py` | Save/load settings, save/load drawings, save/load candles, cache hit/miss, schema migration |

### 2. Integration Tests
- **Framework:** pytest + httpx (FastAPI TestClient via ASGITransport)
- **Location:** `tests/integration/`

| Test file | What it tests |
|---|---|
| `tests/integration/test_api_endpoints.py` | REST API health, coins listing, candles endpoint (including error cases) |

**Planned but not yet implemented:**
- WebSocket integration tests (`test_websocket_e2e.py`) — connect, receive snapshot, verify heartbeat
- CLI workflow tests (`test_scan_workflow.py`) — end-to-end scan → report flow

### 3. Quality Requirement Tests
- **Framework:** pytest + httpx
- **Location:** `tests/requirements/`

| Test file | QRT | What it tests |
|---|---|---|
| `tests/requirements/test_performance.py` | QRT-001 | API p95 response time ≤ 500ms (health + candles endpoints) |
| `tests/requirements/test_security.py` | QRT-002 | No API key leakage in responses |
| `tests/requirements/test_accuracy.py` | QRT-003 | Candle OHLCV parsing accuracy |
| `tests/requirements/test_websocket_connect.py` | QRT-004 | WebSocket connection reliability |
| `tests/requirements/test_db_cache.py` | QRT-005 | Database cache read/write round-trip |

### 4. Frontend JS Tests
- **Status:** ✅ Basic coverage added for MVP v2
- **Framework:** Vitest (lightweight runner)
- **Location:** `tickframe/frontend/js/tests/`
- **CI jobs:** `frontend-lint` (ESLint) and `frontend-test` (Vitest) in `.github/workflows/ci.yml`
- **Priority scenarios:**
  - WebSocket message parsing (parseJson)
  - WebSocket URL construction (getWsBase, getApiBase)
  - ManagedSocket reconnection logic
- **Future work:** Expand coverage for RSI/Volume sub-chart rendering, sub-chart resize, pane updates

---

## Critical Modules

Target line coverage ≥ 30% for each critical module:

| Module | Path | Target | Current |
|---|---|---|---|---|
| Bybit client | `tickframe/backend/services/bybit_client.py` | ≥30% | — |
| Cache | `tickframe/backend/services/cache.py` | ≥30% | — |
| API endpoints | `tickframe/backend/api/endpoints.py` | ≥30% | — |
| WebSocket | `tickframe/backend/api/websocket.py` | ≥30% | — |
| Database | `tickframe/backend/services/database.py` | ≥30% | — |
| Pattern detection | `tickframe/detection/mock.py` | ≥30% | — |
| Schemas | `tickframe/backend/models/schemas.py` | ≥30% | — |

---

## Running Tests

```bash
pip install -r requirements.txt
pip install -r tests/requirements.txt
pytest --cov=tickframe --cov-report=term tests/

# Frontend JS tests
cd tickframe/frontend && npm ci && npm test && npm run lint
```

## CI Pipeline

| Job | Tool | Command |
|---|---|---|---|
| lint | ruff | `ruff check .` |
| type-check | mypy | `mypy tickframe/` |
| test | pytest + coverage | `pytest --cov=tickframe --cov-report=term --cov-report=xml tests/` |
| qa-check | bandit | `bandit -r tickframe/ -ll` |
| link-check | lychee | `lychee ./**/*.md` |
| frontend-lint | eslint | `eslint js/` (in `tickframe/frontend/`) |
| frontend-test | vitest | `vitest run` (in `tickframe/frontend/`) |

**File:** `.github/workflows/ci.yml`
**Triggers:** push and pull_request to `main`
**Latest run:** [CI run](https://github.com/Fedos113/SWP_TickFrame_28_team/actions/workflows/ci.yml)
**Branch protection:** Default branch (`main`) is protected — direct pushes disabled, at least one approval required before merge

All Assignment 4 quality gates (ruff, mypy, pytest+cov, bandit, Lychee) remain active. The pipeline is extended for MVP v2 with frontend JS lint and test jobs.

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

## Manual Test Evidence

Most verification is automated. The following areas currently rely on manual checks:

- **Sub-chart rendering** (RSI, Volume) — frontend canvas rendering not covered by Vitest; verified by visual inspection during PR review
- **Sub-chart resize on sidebar drag** — verified manually during UI testing
- **Reconnection UI feedback** — WebSocket reconnection badge visibility verified manually

These manual checks are candidates for future automation (Vitest + jsdom for DOM interaction, Playwright for visual regression).

---

### Alternative QA tools considered

| Tool | Why not chosen |
|---|---|
| **safety / pip-audit** | Requires network access to vulnerability DB; CI may fail due to rate limiting or transient network issues |
| **vulture** | Dead code detection; useful but not critical for this sprint's quality gate |
| **pylint** | Heavier than ruff; mostly duplicates what ruff + mypy already check |
| **mypy --strict** | Too many existing violations would require extensive refactoring; incrementally adoptable in future sprints |
