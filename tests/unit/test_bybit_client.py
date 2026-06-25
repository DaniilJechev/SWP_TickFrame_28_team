"""Unit tests for Bybit client.

Template — implement tests for:
- Successful candle data fetching
- Error handling (network failure, invalid symbol)
- Data parsing accuracy
- Cache integration
"""

import pytest
from unittest.mock import patch, AsyncMock
from tickframe.backend.services.bybit_client import BybitClient


@pytest.mark.asyncio
async def test_fetch_candles_success():
    """Mock a successful Bybit API response and verify parsed output."""
    mock_response = {
        "result": {
            "list": [
                ["1622505600000", "50000.0", "51000.0", "49000.0", "50500.0", "100.0"],
            ]
        },
        "retCode": 0,
    }
    with patch("tickframe.backend.services.bybit_client.httpx.AsyncClient") as mock:
        mock.return_value.__aenter__.return_value.get.return_value.json = AsyncMock(
            return_value=mock_response
        )
        mock.return_value.__aenter__.return_value.get.return_value.raise_for_status = AsyncMock()
        client = BybitClient()
        candles = await client.fetch_candles("BTCUSDT", "5m")
        assert len(candles) == 1
        assert candles[0]["symbol"] == "BTCUSDT"
        assert float(candles[0]["open"]) == 50000.0


@pytest.mark.asyncio
async def test_fetch_candles_network_error():
    """Verify error handling when Bybit API is unreachable."""
    with patch("tickframe.backend.services.bybit_client.httpx.AsyncClient") as mock:
        mock.return_value.__aenter__.return_value.get.side_effect = Exception("Network error")
        client = BybitClient()
        with pytest.raises(Exception, match="Network error"):
            await client.fetch_candles("BTCUSDT", "5m")
