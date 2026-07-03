"""Unit tests for pattern detection."""

from tickframe.detection.mock import analyze


def test_analyze_empty():
    result = analyze([])
    assert result["pattern"] == "None"
    assert result["confidence"] == 0.0


def test_analyze_less_than_50():
    candles = [{"timestamp": i, "open": 100, "high": 101, "low": 99, "close": 100, "volume": 10} for i in range(20)]
    result = analyze(candles)
    assert result["analyzed_candles"] == 20
    assert result["pattern"] != "None"


def test_analyze_50_or_more():
    candles = [{"timestamp": i, "open": 100, "high": 101, "low": 99, "close": 100, "volume": 10} for i in range(100)]
    result = analyze(candles)
    assert result["analyzed_candles"] == 50


def test_analyze_within_range():
    candles = [{"timestamp": i, "open": 100, "high": 101, "low": 99, "close": 100, "volume": 10} for i in range(100)]
    result = analyze(candles, limit=50)
    assert result["analyzed_candles"] == 50


def test_analyze_exceeds_range():
    candles = [{"timestamp": i, "open": 100, "high": 101, "low": 99, "close": 100, "volume": 10} for i in range(200)]
    result = analyze(candles, limit=50)
    assert result["analyzed_candles"] == 50
