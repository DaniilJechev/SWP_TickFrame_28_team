# Quality Requirement Tests

> **Template — Assignment 4, Part 4**
>
> Instructions:
> - Define at least **1 automated QRT per quality requirement**
> - Store tests in `tests/requirements/` and link them here
> - Each QRT must reference its quality requirement, automation method, file path, CI job, and evidence type
> - Integration: QRTs must run in CI on every push/PR to `main`

---

## QRT-001: [Test Name — e.g., Chart Response Time Test]

| Field | Value |
|---|---|
| **ID** | QRT-001 |
| **Linked QR** | QR-001 |
| **Test description** | _[One-line summary]_ |
| **Automation method** | pytest + httpx (FastAPI TestClient) |
| **Test file** | `tests/requirements/test_performance.py` |
| **CI job** | `CI / test` in `.github/workflows/ci.yml` |
| **Evidence type** | CI job pass/fail + duration output |
| **Pass/fail criteria** | _[e.g., Response time < 2s for chart endpoint under load]_ |

```python
# tests/requirements/test_performance.py — TEMPLATE
"""QRT-001: Verify chart endpoint responds within 2 seconds."""
import pytest
from httpx import AsyncClient, ASGITransport
from tickframe.backend.main import app


@pytest.mark.asyncio
async def test_chart_response_time():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/chart?symbol=BTCUSDT&interval=5m")
        assert response.status_code == 200
        # Add response time assertion:
        # assert response.elapsed.total_seconds() < 2.0
```

---

## QRT-002: [Test Name — e.g., API Key Leakage Test]

| Field | Value |
|---|---|
| **ID** | QRT-002 |
| **Linked QR** | QR-002 |
| **Test description** | _[Verify no API keys exposed in logs, errors, or responses]_ |
| **Automation method** | pytest + log capture / bandit / manual string scrub |
| **Test file** | `tests/requirements/test_security.py` |
| **CI job** | `CI / test` and `CI / qa-check` |
| **Evidence type** | CI job pass/fail |

```python
# tests/requirements/test_security.py — TEMPLATE
"""QRT-002: Verify API keys are not leaked in application output."""
import pytest


@pytest.mark.asyncio
async def test_no_api_key_in_response():
    """Check that /api/config or error responses never contain raw keys."""
    # TODO: start app, hit endpoints, assert no key patterns in response body
    # pattern = r"(BYBIT_API_KEY|BYBIT_API_SECRET)"
    pass


@pytest.mark.asyncio
async def test_no_api_key_in_logs(caplog):
    """Check that log output does not contain API key values."""
    # TODO: trigger operations that might log keys, check caplog.text
    pass
```

---

## QRT-003: [Test Name — e.g., Candle Data Accuracy Test]

| Field | Value |
|---|---|
| **ID** | QRT-003 |
| **Linked QR** | QR-003 |
| **Test description** | _[Verify Bybit candle data is parsed within 0.1% price accuracy]_ |
| **Automation method** | pytest + mocked Bybit API responses |
| **Test file** | `tests/requirements/test_accuracy.py` |
| **CI job** | `CI / test` |
| **Evidence type** | CI job pass/fail |

```python
# tests/requirements/test_accuracy.py — TEMPLATE
"""QRT-003: Verify candle data accuracy from Bybit source."""
import pytest
from unittest.mock import patch, AsyncMock
from tickframe.backend.services.bybit_client import BybitClient


@pytest.mark.asyncio
async def test_candle_price_accuracy():
    """Mock Bybit response and verify parsed prices within 0.1%."""
    mock_response = {
        "result": {
            "list": [
                ["1622505600000", "50000.0", "51000.0", "49000.0", "50500.0", "100.0"],
            ]
        }
    }
    with patch("tickframe.backend.services.bybit_client.httpx.AsyncClient") as mock:
        mock.return_value.__aenter__.return_value.get.return_value.json.return_value = mock_response
        client = BybitClient()
        candles = await client.fetch_candles("BTCUSDT", "5m")
        assert len(candles) > 0
        # TODO: assert price accuracy within 0.1%
```

---

> QRTs are **maintained product assets**. They must continue to run in CI for all future sprints.
> Do not disable or bypass them after Assignment 4 submission.
