# Quality Requirement Tests

This document defines the automated Quality Requirement Tests (QRTs) for TickFrame. Each QRT is linked to a Quality Requirement (QR) defined in [`docs/quality-requirements.md`](quality-requirements.md) and runs as part of the CI pipeline.

---

## QRT-001: API Performance Test

| Field | Value |
|---|---|
| **ID** | QRT-001 |
| **Linked QR** | [QR-001](quality-requirements.md#qr-001-api-response-time) — Time Behaviour |
| **Test description** | Verify that the health endpoint responds within 2 seconds |
| **Automation method** | `pytest` + `httpx` (FastAPI TestClient via ASGITransport) |
| **Test file** | `tests/requirements/test_performance.py` |
| **CI job** | `CI / test` in `.github/workflows/ci.yml` |
| **Evidence type** | CI job pass/fail + response time assertion |
| **Pass/fail criteria** | `GET /api/health` responds with status 200 in < 2.0 seconds (elapsed time) |

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

## CI Integration

All QRTs are executed by the `CI / test` job in `.github/workflows/ci.yml`:

```yaml
# Inside the `test` job:
- run: pip install -r requirements.txt
- run: pip install -r tests/requirements.txt
- run: pip install pytest pytest-asyncio httpx pytest-cov
- run: pytest --cov=tickframe --cov-report=term --cov-report=xml tests/
```

The `tests/` directory includes `tests/requirements/` which contains the three QRT test files.
