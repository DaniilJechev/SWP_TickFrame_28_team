"""Unit tests for Bybit client."""

import pytest
from unittest.mock import patch

from tickframe.backend.services.bybit_client import BybitClient


@pytest.mark.asyncio
async def test_fetch_candles_success():
    mock_response = {
        "result": {"list": [["1622505600000", "50000.0", "51000.0", "49000.0", "50500.0", "100.0"]]},
        "retCode": 0,
    }
    with patch.object(BybitClient, "_request_json", return_value=mock_response):
        client = BybitClient()
        payload = await client.fetch_candles("BTCUSDT", "5m")
        assert payload.symbol == "BTCUSDT"
        assert len(payload.candles) == 1
        assert payload.candles[0]["open"] == 50000.0
        assert payload.source == "bybit"


@pytest.mark.asyncio
async def test_fetch_candles_fallback_to_binance():
    with patch.object(BybitClient, "_request_json", side_effect=RuntimeError("Bybit error")):
        with patch.object(BybitClient, "_fetch_binance_candles", return_value=[{"time": 1, "open": 1.0, "high": 2.0, "low": 0.5, "close": 1.5, "volume": 100}]):
            client = BybitClient()
            payload = await client.fetch_candles("BTCUSDT", "5m")
            assert payload.source == "binance"
            assert len(payload.candles) == 1
