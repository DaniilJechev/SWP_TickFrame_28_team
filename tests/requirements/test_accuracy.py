"""QRT-003: Verify candle data accuracy from Bybit source."""

import pytest
from unittest.mock import patch

from tickframe.backend.services.bybit_client import BybitClient


@pytest.mark.asyncio
async def test_candle_price_accuracy():
    mock_response = {
        "result": {
            "list": [
                ["1622505600000", "50000.0", "51000.0", "49000.0", "50500.0", "100.0"],
            ]
        }
    }
    with patch.object(BybitClient, "_request_json", return_value=mock_response):
        client = BybitClient()
        payload = await client.fetch_candles("BTCUSDT", "5m")
        assert len(payload.candles) == 1
        candle = payload.candles[0]
        assert candle["open"] == 50000.0
        assert candle["high"] == 51000.0
        assert candle["low"] == 49000.0
        assert candle["close"] == 50500.0
        assert candle["volume"] == 100.0
        await client.aclose()
