from __future__ import annotations

import threading
import time
from dataclasses import asdict

from .bybit_client import BybitClient, CandlePayload, DEFAULT_COIN_METADATA, Snapshot, normalize_interval, normalize_symbol, utc_now


class MemoryMarketCache:
    def __init__(self, client: BybitClient, refresh_interval: int = 5):
        self.client = client
        self.refresh_interval = refresh_interval
        self._lock = threading.Lock()
        self._coin_meta = {item["pair"]: dict(item) for item in DEFAULT_COIN_METADATA}
        self._prices: dict[str, Snapshot] = {}
        self._candles: dict[tuple[str, str], tuple[float, CandlePayload]] = {}
        self._last_market_refresh = 0.0

    async def warm_up(self, symbol: str = "BTCUSDT") -> None:
        await self.refresh_market_snapshot()
        await self.get_candles(symbol, "5m", 200)

    def _merge_coin(self, pair: str, snapshot: Snapshot | None) -> dict:
        meta = self._coin_meta.get(pair, {"symbol": pair.removesuffix("USDT"), "pair": pair, "name": pair.removesuffix("USDT")})
        result = dict(meta)
        if snapshot is None:
            result.update({"price": 0.0, "change_24h": 0.0, "volume_24h": 0.0, "source": "cache"})
        else:
            result.update(
                {
                    "price": snapshot.price,
                    "change_24h": snapshot.change_24h,
                    "volume_24h": snapshot.volume_24h,
                    "source": snapshot.source,
                }
            )
        return result

    async def refresh_market_snapshot(self) -> list[dict]:
        snapshots = await self.client.fetch_market_snapshot([item["pair"] for item in DEFAULT_COIN_METADATA])
        updated_at = utc_now()
        with self._lock:
            self._last_market_refresh = time.monotonic()
            self._prices = {snapshot.pair: snapshot for snapshot in snapshots}
            merged = []
            for item in DEFAULT_COIN_METADATA:
                row = self._merge_coin(item["pair"], self._prices.get(item["pair"]))
                row["updated_at"] = updated_at
                merged.append(row)
        return merged

    async def list_coins(self) -> list[dict]:
        with self._lock:
            updated_at = utc_now()
            rows = [self._merge_coin(item["pair"], self._prices.get(item["pair"])) for item in DEFAULT_COIN_METADATA]
            for row in rows:
                row["updated_at"] = updated_at
            return rows

    async def get_price(self, symbol: str) -> dict:
        pair = normalize_symbol(symbol)
        with self._lock:
            snapshot = self._prices.get(pair)
            still_fresh = snapshot is not None and (time.monotonic() - self._last_market_refresh) < self.refresh_interval
        if snapshot is None or not still_fresh:
            snapshot = await self.client.fetch_price(pair)
            with self._lock:
                self._prices[pair] = snapshot
                self._last_market_refresh = time.monotonic()
        return {
            "symbol": snapshot.symbol,
            "pair": snapshot.pair,
            "price": snapshot.price,
            "change_24h": snapshot.change_24h,
            "volume_24h": snapshot.volume_24h,
            "source": snapshot.source,
            "updated_at": snapshot.updated_at,
        }

    async def get_candles(self, symbol: str, interval: str = "5m", limit: int = 200) -> dict:
        pair = normalize_symbol(symbol)
        interval = normalize_interval(interval)
        key = (pair, interval)
        now = time.monotonic()
        with self._lock:
            cached = self._candles.get(key)
            is_fresh = cached is not None and (now - cached[0]) < self.refresh_interval
        if cached is None or not is_fresh:
            candle_payload = await self.client.fetch_candles(pair, interval, limit)
            with self._lock:
                self._candles[key] = (time.monotonic(), candle_payload)
        else:
            candle_payload = cached[1]
        candles = candle_payload.candles[-limit:]
        return {
            "symbol": pair,
            "interval": interval,
            "source": candle_payload.source,
            "updated_at": candle_payload.updated_at,
            "candles": candles,
        }

    async def get_latest_candle(self, symbol: str, interval: str = "5m") -> dict:
        payload = await self.get_candles(symbol, interval, 2)
        return payload["candles"][-1]
