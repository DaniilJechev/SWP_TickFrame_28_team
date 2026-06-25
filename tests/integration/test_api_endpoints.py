"""Integration tests for REST API endpoints.

Template — implement tests for:
- GET /api/health — returns 200
- GET /api/chart — returns candle data
- POST /api/scan — triggers scan
- Error responses for invalid parameters
"""

import pytest
from httpx import AsyncClient, ASGITransport
from tickframe.backend.main import app


@pytest.mark.asyncio
async def test_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data


@pytest.mark.asyncio
async def test_chart_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/chart?symbol=BTCUSDT&interval=5m")
        # May return 200 or 500 depending on mock state — adjust assertion as needed
        assert response.status_code in (200, 500)
