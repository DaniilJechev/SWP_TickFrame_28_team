# Quality Requirement Tests

## QRT-001: Chart Response Time Test

| Field | Value |
|---|---|
| **ID** | QRT-001 |
| **Linked QR** | QR-001 |
| **Test description** | Verify health endpoint responds within 2 seconds |
| **Automation method** | pytest + httpx (FastAPI TestClient) |
| **Test file** | `tests/requirements/test_performance.py` |
| **CI job** | `CI / test` in `.github/workflows/ci.yml` |
| **Evidence type** | CI job pass/fail + response time assertion |
| **Pass/fail criteria** | Response time < 2 seconds for `/api/health` |

---

## QRT-002: API Key Leakage Test

| Field | Value |
|---|---|
| **ID** | QRT-002 |
| **Linked QR** | QR-002 |
| **Test description** | Verify no API keys appear in HTTP responses |
| **Automation method** | pytest + httpx (FastAPI TestClient) + string inspection |
| **Test file** | `tests/requirements/test_security.py` |
| **CI job** | `CI / test` in `.github/workflows/ci.yml` |
| **Evidence type** | CI job pass/fail |
| **Pass/fail criteria** | No `BYBIT_API_KEY` or `BYBIT_API_SECRET` in any response body |

---

## QRT-003: Candle Data Accuracy Test

| Field | Value |
|---|---|
| **ID** | QRT-003 |
| **Linked QR** | QR-003 |
| **Test description** | Verify Bybit candle data is parsed with correct price values |
| **Automation method** | pytest + mocked Bybit API responses |
| **Test file** | `tests/requirements/test_accuracy.py` |
| **CI job** | `CI / test` in `.github/workflows/ci.yml` |
| **Evidence type** | CI job pass/fail |
| **Pass/fail criteria** | All OHLCV fields match the mock input exactly |
