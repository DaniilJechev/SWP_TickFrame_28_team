"""Unit tests for Pydantic schemas.

Template — implement tests for:
- Valid data passes validation
- Invalid data raises validation error
- Field defaults and optional fields
"""

import pytest
from tickframe.backend.models.schemas import CandleData, ScanRequest


def test_candle_data_valid():
    data = CandleData(
        symbol="BTCUSDT",
        interval="5m",
        timestamp=1622505600000,
        open=50000.0,
        high=51000.0,
        low=49000.0,
        close=50500.0,
        volume=100.0,
    )
    assert data.symbol == "BTCUSDT"


def test_candle_data_invalid_price():
    with pytest.raises(ValueError):
        CandleData(
            symbol="BTCUSDT",
            interval="5m",
            timestamp=1622505600000,
            open="invalid",  # wrong type
            high=51000.0,
            low=49000.0,
            close=50500.0,
            volume=100.0,
        )


def test_scan_request_defaults():
    req = ScanRequest(symbol="BTCUSDT")
    assert req.interval == "5m"  # default value
    assert req.limit == 100  # default value
