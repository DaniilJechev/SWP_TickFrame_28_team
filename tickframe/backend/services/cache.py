from __future__ import annotations

import asyncio
import logging
import threading
import time
from typing import TYPE_CHECKING

from .bybit_client import BybitClient, CandlePayload, DEFAULT_COIN_METADATA, Snapshot, normalize_interval, normalize_symbol, utc_now

if TYPE_CHECKING:
    from .database import DatabaseService

LOGGER = logging.getLogger("tickframe.cache")

MAX_CANDLES = 55000
"""Maximum number of candles stored per (coin, interval) pair."""


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
        self._warmup_done = False

    # ------------------------------------------------------------------
    # Warm-up
    # ------------------------------------------------------------------

    async def warm_up(self) -> None:
        """Phase 1: load all existing DB candles into memory.
        Phase 2: for each coin in DEFAULT order, fill missing data up to MAX_CANDLES."""
        LOGGER.info("Starting warmup — phase 1: loading DB candles for all coins/intervals")
        await self._load_db_candles_for_all()

        LOGGER.info("Starting warmup — phase 2: sequential fill to %d candles per coin/interval", MAX_CANDLES)
        for meta in DEFAULT_COIN_METADATA:
            pair = meta["pair"]
            for iv in ("5m", "15m", "1h", "4h", "1d"):
                await self._fill_to_max(pair, iv)

        self._warmup_done = True
        LOGGER.info("Warmup complete")

    async def _load_db_candles_for_all(self) -> None:
        if not self.db:
            return
        tasks: list[asyncio.Task] = []
        for meta in DEFAULT_COIN_METADATA:
            pair = meta["pair"]
            for iv in ("5m", "15m", "1h", "4h", "1d"):
                tasks.append(asyncio.create_task(self._load_one_db_pair(pair, iv)))
        if tasks:
            await asyncio.gather(*tasks)

    async def _load_one_db_pair(self, pair: str, iv: str) -> None:
        if not self.db:
            return
        try:
            count = await self.db.count_candles(pair, iv)
            if count > 0:
                db_candles = await self.db.load_last_n_candles(pair, iv, MAX_CANDLES)
                if db_candles:
                    payload = CandlePayload(symbol=pair, interval=iv, candles=db_candles, source="db", updated_at=utc_now())
                    key = (pair, iv)
                    with self._lock:
                        self._candles[key] = (time.monotonic(), payload)
        except Exception:
            pass

    async def _fill_to_max(self, pair: str, interval: str) -> None:
        """Ensure at least MAX_CANDLES candles exist for pair+interval.
        Only fetches missing older candles from the exchange."""
        key = (pair, interval)

        with self._lock:
            cached = self._candles.get(key)
            current = len(cached[1].candles) if cached else 0

        if current >= MAX_CANDLES:
            return

        if current > 0:
            # We have some candles — fetch only the older ones we're missing.
            with self._lock:
                cached = self._candles.get(key)
                earliest_ts = cached[1].candles[0]["time"] if cached else None

            if earliest_ts is not None:
                need = min(MAX_CANDLES - current, MAX_CANDLES)
                LOGGER.info("Filling %s/%s: have %d, fetching %d older candles before ts=%d", pair, interval, current, need, earliest_ts)
                try:
                    # Fetch candles older than earliest_ts (in ms)
                    candle_payload = await self.client.fetch_candles(pair, interval, need, end_ms=int(earliest_ts * 1000))
                    if candle_payload.candles:
                        with self._lock:
                            cached = self._candles.get(key)
                            existing = cached[1].candles if cached else []
                        merged = list(candle_payload.candles) + existing
                        merged.sort(key=lambda c: c["time"])
                        deduped = self._deduplicate(merged)
                        deduped = deduped[-MAX_CANDLES:]
                        merged_payload = CandlePayload(symbol=pair, interval=interval, candles=deduped, source="exchange", updated_at=utc_now())
                        with self._lock:
                            self._candles[key] = (time.monotonic(), merged_payload)
                        if self.db:
                            await self.db.save_candles(pair, interval, deduped)
                        LOGGER.info("Filled %s/%s to %d candles", pair, interval, len(deduped))
                        return
                except Exception:
                    LOGGER.warning("Failed to fill older candles for %s/%s, falling back to full fetch", pair, interval)

        # No existing candles or fallback — fetch full MAX_CANDLES from exchange
        LOGGER.info("Fetching full %d candles for %s/%s", MAX_CANDLES, pair, interval)
        try:
            candle_payload = await self.client.fetch_candles(pair, interval, MAX_CANDLES)
            if candle_payload.candles:
                with self._lock:
                    self._candles[key] = (time.monotonic(), candle_payload)
                if self.db:
                    await self.db.save_candles(pair, interval, candle_payload.candles)
                LOGGER.info("Fetched %d candles for %s/%s", len(candle_payload.candles), pair, interval)
        except Exception:
            LOGGER.warning("Failed to fetch candles for %s/%s", pair, interval)

    # ------------------------------------------------------------------
    # Coin / Price helpers
    # ------------------------------------------------------------------

    def _merge_coin(self, pair: str, snapshot: Snapshot | None) -> dict[str, object]:
        meta = self._coin_meta.get(pair, {"symbol": pair.removesuffix("USDT"), "pair": pair, "name": pair.removesuffix("USDT")})
        result: dict[str, object] = dict(meta)
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
                pair = str(row["pair"])
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

    # ------------------------------------------------------------------
    # Candles
    # ------------------------------------------------------------------

    async def get_candles(self, symbol: str, interval: str = "5m", limit: int = 200, before: int | None = None) -> dict:
        """Return candles for *symbol*/*interval*.

        Parameters
        ----------
        before : int | None
            Unix timestamp (seconds).  When set, return up to *limit* candles
            whose time is strictly **before** this value (i.e. older candles).
            When *None* (default), return the most recent *limit* candles.
        """
        pair = normalize_symbol(symbol)
        interval = normalize_interval(interval)
        key = (pair, interval)
        now = time.monotonic()

        if before is not None:
            return await self._get_candles_before(pair, interval, limit, before)

        # -- normal flow: most recent candles ---------------------------------
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

        # DB lookup
        db_candles: list[dict] = []
        if self.db:
            try:
                db_candles = await self.db.load_last_n_candles(pair, interval, limit)
            except Exception:
                pass

        if len(db_candles) >= limit:
            db_candles = db_candles[-limit:]
            payload = CandlePayload(symbol=pair, interval=interval, candles=db_candles, source="db", updated_at=utc_now())
            with self._lock:
                self._candles[key] = (time.monotonic(), payload)
            return {
                "symbol": pair, "interval": interval,
                "source": "db", "updated_at": utc_now(),
                "candles": db_candles,
            }

        fetch = max(limit, 200)
        candle_payload = await self.client.fetch_candles(pair, interval, fetch)

        if db_candles:
            exchange_times = {c["time"] for c in candle_payload.candles}
            for c in db_candles:
                if c["time"] not in exchange_times:
                    candle_payload.candles.append(c)
            candle_payload.candles.sort(key=lambda c: c["time"])
            candle_payload.candles = candle_payload.candles[-fetch:]

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

    async def _get_candles_before(self, pair: str, interval: str, limit: int, before: int) -> dict:
        """Return candles older than *before* (seconds) — from DB first, exchange fallback."""
        if self.db:
            try:
                db_candles = await self.db.load_candles_before(pair, interval, limit, before)
                if len(db_candles) >= limit:
                    return {
                        "symbol": pair, "interval": interval,
                        "source": "db", "updated_at": utc_now(),
                        "candles": db_candles[-limit:],
                    }
            except Exception:
                pass

        exchange_limit = max(limit, 200)
        try:
            candle_payload = await self.client.fetch_candles(pair, interval, exchange_limit, end_ms=before * 1000)
            if candle_payload.candles:
                if self.db:
                    await self.db.save_candles(pair, interval, candle_payload.candles)
                return {
                    "symbol": pair, "interval": interval,
                    "source": candle_payload.source, "updated_at": candle_payload.updated_at,
                    "candles": candle_payload.candles[-limit:],
                }
        except Exception:
            pass

        return {
            "symbol": pair, "interval": interval,
            "source": "exchange", "updated_at": utc_now(),
            "candles": [],
        }

    async def get_latest_candle(self, symbol: str, interval: str = "5m") -> dict:
        payload = await self.get_candles(symbol, interval, 2)
        return payload["candles"][-1]

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _deduplicate(candles: list[dict]) -> list[dict]:
        seen: set[int] = set()
        out = []
        for c in candles:
            t = c["time"]
            if t not in seen:
                seen.add(t)
                out.append(c)
        return out
