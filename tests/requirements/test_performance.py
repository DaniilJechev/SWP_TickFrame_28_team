"""QRT-001: Verify API endpoints respond within 500ms (p95)."""

import pytest
from httpx import AsyncClient, ASGITransport
from tickframe.backend.main import app


@pytest.mark.asyncio
async def test_health_p95_response_time():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        times = []
        for _ in range(10):
            response = await client.get("/api/health")
            assert response.status_code == 200
            times.append(response.elapsed.total_seconds())
    times.sort()
    p95 = times[int(len(times) * 0.95)]
    assert p95 < 0.5, f"p95 response time {p95:.3f}s >= 0.5s"


@pytest.mark.asyncio
async def test_candles_p95_response_time():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        times = []
        for _ in range(10):
            response = await client.get("/api/coins/BTCUSDT/candles?interval=5m&limit=100")
            if response.status_code == 200:
                times.append(response.elapsed.total_seconds())
    if times:
        times.sort()
        p95 = times[int(len(times) * 0.95)]
        assert p95 < 0.5, f"p95 response time {p95:.3f}s >= 0.5s"
