from __future__ import annotations

import threading
import time
from dataclasses import asdict
from typing import TYPE_CHECKING

from .bybit_client import BybitClient, CandlePayload, DEFAULT_COIN_METADATA, Snapshot, normalize_interval, normalize_symbol, utc_now

if TYPE_CHECKING:
    from .database import DatabaseService


class MemoryMarketCache:
    def __init__(self, client: BybitClient, db: DatabaseService | None = None, refresh_interval: int = 5):
        self.client = client
        self.db = db
        self.refresh_interval = refresh_interval
        self._lock = threading.Lock()
        self._coin_meta = {item["pair"]: dict(item) for item in DEFAULT_COIN_METADATA}
        self._prices: dict[str, Snapshot] = {}
        self._candles: dict[tuple[str, str], tuple[float, CandlePayload]] = {}
        self._last_market_refresh = 0.0

    async def warm_up(self, symbol: str = "BTCUSDT") -> None:
        await self.refresh_market_snapshot()
        # Pre-load candles from DB into memory for all coins
        if self.db:
            for pair in [item["pair"] for item in DEFAULT_COIN_METADATA]:
                for iv in ("5m", "15m", "1h", "4h", "1d"):
                    try:
                        count = await self.db.count_candles(pair, iv)
                        if count > 0:
                            db_candles = await self.db.load_candles(pair, iv)
                            if db_candles:
                                payload = CandlePayload(symbol=pair, interval=iv, candles=db_candles, source="db", updated_at=utc_now())
                                key = (pair, iv)
                                with self._lock:
                                    self._candles[key] = (time.monotonic(), payload)
                    except Exception:
                        pass
        await self.get_candles(symbol, "5m", 2000)

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
                pair = row["pair"]
                key = (pair, "5m")
                cached = self._candles.get(key)
                if cached and cached[1].candles:
                    last = cached[1].candles[-1]
                    row["trend"] = "up" if last["close"] > last["open"] else ("down" if last["close"] < last["open"] else "neutral")
                else:
                    row["trend"] = "neutral"
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

        # Try in-memory cache first
        with self._lock:
            cached = self._candles.get(key)
            is_fresh = cached is not None and (now - cached[0]) < self.refresh_interval
            cached_count = len(cached[1].candles) if cached else 0

        if cached is not None and is_fresh and cached_count >= limit:
            candle_payload = cached[1]
            candles = candle_payload.candles[-limit:]
            return {
                "symbol": pair, "interval": interval,
                "source": candle_payload.source, "updated_at": candle_payload.updated_at,
                "candles": candles,
            }

        # Try database next (if available)
        db_candles: list[dict] = []
        if self.db:
            try:
                db_candles = await self.db.load_candles(pair, interval)
            except Exception:
                pass

        if len(db_candles) >= limit:
            # DB has enough — use it, but still check exchange for freshness
            db_candles = db_candles[-limit:]
            latest_db = db_candles[-1]
            # Quick check: fetch latest 2 candles from exchange to see if new data exists
            try:
                fresh = await self.client.fetch_candles(pair, interval, 2)
                if fresh.candles and fresh.candles[-1]["time"] > latest_db["time"]:
                    # New data available — merge
                    exchange_times = {c["time"] for c in fresh.candles}
                    merged = list(fresh.candles)
                    for c in db_candles:
                        if c["time"] not in exchange_times:
                            merged.append(c)
                    merged.sort(key=lambda c: c["time"])
                    merged = merged[-limit:]
                    candle_payload = CandlePayload(symbol=pair, interval=interval, candles=merged, source=fresh.source, updated_at=utc_now())
                    with self._lock:
                        self._candles[key] = (time.monotonic(), candle_payload)
                    if self.db:
                        await self.db.save_candles(pair, interval, merged)
                    return {
                        "symbol": pair, "interval": interval,
                        "source": candle_payload.source, "updated_at": candle_payload.updated_at,
                        "candles": merged,
                    }
            except Exception:
                pass
            # No new data — return from DB
            payload = CandlePayload(symbol=pair, interval=interval, candles=db_candles, source="db", updated_at=utc_now())
            with self._lock:
                self._candles[key] = (time.monotonic(), payload)
            return {
                "symbol": pair, "interval": interval,
                "source": "db", "updated_at": utc_now(),
                "candles": db_candles,
            }

        # Not enough in DB — fetch from exchange (full pagination if needed)
        fetch = max(limit, 200)
        candle_payload = await self.client.fetch_candles(pair, interval, fetch)

        # Merge with any DB candles we have
        if db_candles:
            exchange_times = {c["time"] for c in candle_payload.candles}
            for c in db_candles:
                if c["time"] not in exchange_times:
                    candle_payload.candles.append(c)
            candle_payload.candles.sort(key=lambda c: c["time"])
            candle_payload.candles = candle_payload.candles[-fetch:]

        # Save to DB
        if self.db:
            try:
                await self.db.save_candles(pair, interval, candle_payload.candles)
            except Exception:
                pass

        with self._lock:
            self._candles[key] = (time.monotonic(), candle_payload)
        candles = candle_payload.candles[-limit:]
        return {
            "symbol": pair, "interval": interval,
            "source": candle_payload.source, "updated_at": candle_payload.updated_at,
            "candles": candles,
        }

    async def get_latest_candle(self, symbol: str, interval: str = "5m") -> dict:
        payload = await self.get_candles(symbol, interval, 2)
        return payload["candles"][-1]
