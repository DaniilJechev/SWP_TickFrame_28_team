# Quality Requirement Tests

This document defines the automated Quality Requirement Tests (QRTs) for TickFrame. Each QRT is linked to a Quality Requirement (QR) defined in [`docs/quality-requirements.md`](quality-requirements.md) and runs as part of the CI pipeline.

---

## QRT-001: API Performance Test

| Field | Value |
|---|---|
| **ID** | QRT-001 |
| **Linked QR** | [QR-001](quality-requirements.md#qr-001-api-response-time) — Time Behaviour |
| **Test description** | Verify that health and candles endpoints respond within 500ms (95th percentile) |
| **Automation method** | `pytest` + `httpx` (FastAPI TestClient via ASGITransport) |
| **Test file** | `tests/requirements/test_performance.py` |
| **CI job** | `CI / test` in `.github/workflows/ci.yml` |
| **Evidence type** | CI job pass/fail + response time assertion |
| **Pass/fail criteria** | 95th percentile response time ≤ 500ms across 10 requests to `/api/health` and `/api/coins/BTCUSDT/candles?interval=5m&limit=100` |

---

## QRT-002: API Key Confidentiality Test

| Field | Value |
|---|---|
| **ID** | QRT-002 |
| **Linked QR** | [QR-002](quality-requirements.md#qr-002-no-secrets-or-vulnerabilities-in-codebase) — Confidentiality |
| **Test description** | Verify that no API keys or secrets appear in HTTP responses |
| **Automation method** | `pytest` + `httpx` (FastAPI TestClient) + string inspection |
| **Test file** | `tests/requirements/test_security.py` |
| **CI job** | `CI / test` in `.github/workflows/ci.yml` |
| **Evidence type** | CI job pass/fail |
| **Pass/fail criteria** | Response body contains neither `BYBIT_API_KEY` nor `BYBIT_API_SECRET` at any endpoint |

---

## QRT-003: Candle Data Accuracy Test

| Field | Value |
|---|---|
| **ID** | QRT-003 |
| **Linked QR** | [QR-003](quality-requirements.md#qr-003-pattern-detection-accuracy) — Functional Correctness |
| **Test description** | Verify that Bybit candle data is parsed with correct OHLCV price values from mock API response |
| **Automation method** | `pytest` + mocked `BybitClient._request_json` responses |
| **Test file** | `tests/requirements/test_accuracy.py` |
| **CI job** | `CI / test` in `.github/workflows/ci.yml` |
| **Evidence type** | CI job pass/fail |
| **Pass/fail criteria** | All OHLCV fields (open, high, low, close, volume) match the mock input exactly |

---

## QRT-004: WebSocket Connection Reliability

| Field | Value |
|---|---|
| **ID** | QRT-004 |
| **Linked QR** | [QR-001](quality-requirements.md#qr-001-api-response-time) — Time Behaviour |
| **Test description** | Verify that WebSocket handshake completes and connection stays alive |
| **Automation method** | `pytest` + `AsyncMock` WebSocket — `SocketHub` instance, no real network calls |
| **Test file** | `tests/requirements/test_websocket_connect.py` |
| **CI job** | `CI / test` in `.github/workflows/ci.yml` |
| **Evidence type** | CI job pass/fail |
| **Test data, setup, or environment** | In-process test using mocked `AsyncMock` WebSocket objects. `SocketHub` is instantiated directly; no real WebSocket server or client required. |
| **Pass/fail criteria** | WebSocket connects (hub.accept called) and receives broadcast payload via send_json |

---

## QRT-005: Database Cache Read/Write

| Field | Value |
|---|---|
| **ID** | QRT-005 |
| **Linked QR** | [QR-001](quality-requirements.md#qr-001-api-response-time) — Time Behaviour |
| **Test description** | Verify that cached data is returned without re-fetching from exchange |
| **Automation method** | `pytest` + `AsyncMock`-based `BybitClient` — `MemoryMarketCache` with long refresh interval to prevent automatic refresh |
| **Test file** | `tests/requirements/test_db_cache.py` |
| **CI job** | `CI / test` in `.github/workflows/ci.yml` |
| **Evidence type** | CI job pass/fail |
| **Test data, setup, or environment** | In-process test using `MemoryMarketCache` with a mocked `BybitClient`. Refresh interval set to 999s to ensure in-memory cache serves repeated reads without calling the mock. |
| **Pass/fail criteria** | After first fetch, subsequent reads for same coin return cached data without calling external API (verified by `client.fetch_price.await_count == 1` after two reads) |

---

## CI Integration

All QRTs are executed by the `CI / test` job in `.github/workflows/ci.yml`:

```yaml
# Inside the `test` job:
- run: pip install -r requirements.txt
- run: pip install -r tests/requirements.txt
- run: pip install pytest pytest-asyncio httpx pytest-cov
- run: pytest --cov=tickframe --cov-report=term --cov-report=xml tests/
```

The `tests/` directory includes `tests/requirements/` which contains the five QRT test files.
