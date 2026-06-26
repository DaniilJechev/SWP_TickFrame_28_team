"""QRT-002: Verify no API keys are leaked in application output."""

import pytest
from httpx import AsyncClient, ASGITransport
from tickframe.backend.main import app


@pytest.mark.asyncio
async def test_no_api_key_in_response():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/health")
        body = response.text
        assert "BYBIT_API_KEY" not in body
        assert "BYBIT_API_SECRET" not in body


@pytest.mark.asyncio
async def test_no_api_key_in_candle_response():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/coins/BTCUSDT/candles?interval=5m&limit=10")
        if response.status_code == 200:
            body = response.text
            assert "BYBIT_API_KEY" not in body
            assert "BYBIT_API_SECRET" not in body
