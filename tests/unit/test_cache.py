"""Unit tests for MemoryMarketCache."""

import pytest
from unittest.mock import AsyncMock

from tickframe.backend.services.cache import MemoryMarketCache
from tickframe.backend.services.bybit_client import BybitClient


@pytest.mark.asyncio
async def test_list_coins_empty():
    client = AsyncMock(spec=BybitClient)
    client.fetch_market_snapshot.return_value = []
    cache = MemoryMarketCache(client)
    coins = await cache.list_coins()
    assert isinstance(coins, list)


@pytest.mark.asyncio
async def test_get_price_refreshes_if_stale():
    client = AsyncMock(spec=BybitClient)
    client.fetch_price.return_value.symbol = "BTC"
    client.fetch_price.return_value.pair = "BTCUSDT"
    client.fetch_price.return_value.price = 50000.0
    client.fetch_price.return_value.change_24h = 1.0
    client.fetch_price.return_value.volume_24h = 1000.0
    client.fetch_price.return_value.source = "bybit"
    client.fetch_price.return_value.updated_at = "2026-01-01T00:00:00Z"

    cache = MemoryMarketCache(client, refresh_interval=0)
    result = await cache.get_price("BTCUSDT")
    assert result["price"] == 50000.0
