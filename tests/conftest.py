"""Shared test fixtures and configuration."""

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from tickframe.backend.main import app


@pytest.fixture
def app_client():
    """FastAPI TestClient fixture for integration tests."""
    transport = ASGITransport(app=app)
    return AsyncClient(transport=transport, base_url="http://test")


@pytest_asyncio.fixture
async def async_client():
    """Async client fixture with app lifespan."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest.fixture
def sample_candle_data():
    """Sample OHLCV candle data for tests."""
    return {
        "symbol": "BTCUSDT",
        "interval": "5m",
        "candles": [
            {
                "timestamp": 1622505600000,
                "open": 50000.0,
                "high": 51000.0,
                "low": 49000.0,
                "close": 50500.0,
                "volume": 100.0,
            }
        ],
    }
