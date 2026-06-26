"""Unit tests for Pydantic schemas."""

import pytest
from pydantic import ValidationError

from tickframe.backend.models.schemas import Candle, CandleResponse, Pattern, AnalyzeResponse


def test_candle_valid():
    c = Candle(time=1622505600, open=50000.0, high=51000.0, low=49000.0, close=50500.0, volume=100.0)
    assert c.time == 1622505600
    assert c.close == 50500.0


def test_candle_invalid_price():
    with pytest.raises(ValidationError):
        Candle(time=1622505600, open="invalid", high=51000.0, low=49000.0, close=50500.0)


def test_candle_response():
    resp = CandleResponse(
        symbol="BTCUSDT", interval="5m", updated_at="2026-01-01T00:00:00Z",
        candles=[Candle(time=1, open=10, high=11, low=9, close=10.5)]
    )
    assert len(resp.candles) == 1
    assert resp.symbol == "BTCUSDT"


def test_pattern():
    p = Pattern(timestamp=1622505600, pattern_type="Classic H&S", confidence=0.87)
    assert p.confidence == 0.87
    assert p.pattern_type == "Classic H&S"


def test_analyze_response():
    resp = AnalyzeResponse(
        symbol="BTCUSDT", interval="5m", limit=200,
        patterns=[Pattern(timestamp=1, pattern_type="H&S", confidence=0.9)]
    )
    assert len(resp.patterns) == 1
