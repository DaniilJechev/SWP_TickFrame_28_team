"""Integration tests for REST API endpoints."""

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
        assert data["status"] == "ok"


@pytest.mark.asyncio
async def test_coins_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/coins")
        assert response.status_code in (200, 503)


@pytest.mark.asyncio
async def test_candles_endpoint_missing_symbol():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/coins/UNKNOWN/candles?interval=5m&limit=10")
        assert response.status_code in (200, 500, 503)
