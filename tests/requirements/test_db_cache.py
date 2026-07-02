"""QRT-005: Verify DB cache returns cached data without re-fetching."""

import pytest
from unittest.mock import AsyncMock

from tickframe.backend.services.cache import MemoryMarketCache
from tickframe.backend.services.bybit_client import BybitClient


@pytest.mark.asyncio
async def test_cache_returns_cached_data():
    client = AsyncMock(spec=BybitClient)
    cache = MemoryMarketCache(client, db=None, refresh_interval=999)
    mock_snapshot = AsyncMock()
    mock_snapshot.symbol = "BTC"
    mock_snapshot.pair = "BTCUSDT"
    mock_snapshot.price = 50000.0
    mock_snapshot.change_24h = 1.0
    mock_snapshot.volume_24h = 1000.0
    mock_snapshot.source = "bybit"
    mock_snapshot.updated_at = "2026-01-01T00:00:00Z"
    client.fetch_price.return_value = mock_snapshot
    result1 = await cache.get_price("BTCUSDT")
    assert result1["price"] == 50000.0


@pytest.mark.asyncio
async def test_cache_data_not_stale():
    client = AsyncMock(spec=BybitClient)
    cache = MemoryMarketCache(client, db=None, refresh_interval=999)
    mock_snapshot = AsyncMock()
    mock_snapshot.symbol = "BTC"
    mock_snapshot.pair = "BTCUSDT"
    mock_snapshot.price = 50000.0
    mock_snapshot.change_24h = 1.0
    mock_snapshot.volume_24h = 1000.0
    mock_snapshot.source = "bybit"
    mock_snapshot.updated_at = "2026-01-01T00:00:00Z"
    client.fetch_price.return_value = mock_snapshot
    result1 = await cache.get_price("BTCUSDT")
    result2 = await cache.get_price("BTCUSDT")
    assert result1["price"] == result2["price"]
    assert client.fetch_price.await_count == 1
