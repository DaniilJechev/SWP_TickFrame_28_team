"""Unit tests for cache service.

Template — implement tests for:
- Set and get values
- Cache miss returns None
- Clear removes all entries
- TTL expiry
"""

import pytest
from tickframe.backend.services.cache import Cache


@pytest.fixture
def cache():
    return Cache()


def test_set_and_get(cache):
    cache.set("key1", {"price": 50000})
    assert cache.get("key1") == {"price": 50000}


def test_cache_miss(cache):
    assert cache.get("nonexistent") is None


def test_clear(cache):
    cache.set("a", 1)
    cache.set("b", 2)
    cache.clear()
    assert cache.get("a") is None
    assert cache.get("b") is None
