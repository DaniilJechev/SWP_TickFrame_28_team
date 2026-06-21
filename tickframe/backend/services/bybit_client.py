from __future__ import annotations

import hashlib
import logging
import random
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

import httpx

BASE_URL = "https://api.bybit.com"
LOGGER = logging.getLogger("tickframe.bybit")

INTERVAL_MAP = {
    "5m": "5",
}

DEFAULT_COIN_METADATA = [
    {"symbol": "BTC", "pair": "BTCUSDT", "name": "Bitcoin", "icon": "B", "color": "#f7931a"},
]

DEFAULT_PRICE_HINTS = {
    "BTCUSDT": 68000.0,
}

BINANCE_BASE_URL = "https://api.binance.com"


@dataclass(slots=True)
class Snapshot:
    symbol: str
    pair: str
    price: float
    change_24h: float
    volume_24h: float
    source: str
    updated_at: str


@dataclass(slots=True)
class CandlePayload:
    symbol: str
    interval: str
    candles: list[dict[str, float | int]]
    source: str
    updated_at: str


def normalize_symbol(symbol: str) -> str:
    normalized = symbol.replace("/", "").replace("-", "").upper().strip()
    if normalized.endswith("USDT"):
        return normalized
    return f"{normalized}USDT"


def normalize_interval(interval: str) -> str:
    if interval not in INTERVAL_MAP:
        supported = ", ".join(INTERVAL_MAP)
        raise ValueError(f"Unsupported interval: {interval}. Use one of: {supported}")
    return interval


def stable_seed(value: str) -> int:
    digest = hashlib.sha256(value.encode("utf-8")).hexdigest()
    return int(digest[:16], 16)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


class BybitClient:
    def __init__(self, base_url: str = BASE_URL, timeout: float = 10.0):
        self.base_url = base_url.rstrip("/")
        self._client = httpx.AsyncClient(
            timeout=timeout,
            headers={"User-Agent": "TickFrame/1.0"},
        )

    async def aclose(self) -> None:
        await self._client.aclose()

    async def _request_json(self, path: str, params: dict[str, Any]) -> dict[str, Any]:
        response = await self._client.get(f"{self.base_url}{path}", params=params)
        response.raise_for_status()
        data = response.json()
        if data.get("retCode") not in (0, "0", None):
            raise RuntimeError(
                f"Bybit API error ({data.get('retCode')}): {data.get('retMsg', 'unknown error')}"
            )
        return data

    async def _fetch_binance_candles(self, pair: str, interval: str, limit: int) -> list[dict[str, float | int]]:
        binance_interval = "5m"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(
                    f"{BINANCE_BASE_URL}/api/v3/klines",
                    params={"symbol": pair, "interval": binance_interval, "limit": limit},
                )
                resp.raise_for_status()
                raw = resp.json()
                candles = []
                for row in raw:
                    candles.append({
                        "time": row[0] // 1000,
                        "open": float(row[1]),
                        "high": float(row[2]),
                        "low": float(row[3]),
                        "close": float(row[4]),
                        "volume": float(row[5]),
                    })
                LOGGER.info("Fetched %s candles from Binance for %s", len(candles), pair)
                return candles
        except Exception as exc:
            LOGGER.warning("Binance API failed for %s: %s", pair, exc)
            raise

    def _fallback_base_price(self, pair: str) -> float:
        if pair in DEFAULT_PRICE_HINTS:
            return DEFAULT_PRICE_HINTS[pair]
        seed = stable_seed(pair)
        rng = random.Random(seed)
        return round(rng.uniform(0.1, 1000.0), 6)

    def _build_snapshot_from_candles(self, pair: str, candles: list[dict[str, float | int]]) -> Snapshot:
        if not candles:
            base = self._fallback_base_price(pair)
            return Snapshot(
                symbol=pair.removesuffix("USDT"),
                pair=pair,
                price=base,
                change_24h=0.0,
                volume_24h=0.0,
                source="mock",
                updated_at=utc_now(),
            )
        first = candles[0]
        last = candles[-1]
        start_price = float(first["open"])
        end_price = float(last["close"])
        change_24h = ((end_price - start_price) / start_price * 100.0) if start_price else 0.0
        volume_24h = sum(float(candle["volume"]) for candle in candles)
        return Snapshot(
            symbol=pair.removesuffix("USDT"),
            pair=pair,
            price=end_price,
            change_24h=change_24h,
            volume_24h=volume_24h,
            source="mock",
            updated_at=utc_now(),
        )

    async def fetch_candles(self, symbol: str, interval: str = "5m", limit: int = 200) -> CandlePayload:
        pair = normalize_symbol(symbol)
        interval = normalize_interval(interval)
        bybit_interval = INTERVAL_MAP[interval]
        try:
            data = await self._request_json(
                "/v5/market/kline",
                {
                    "category": "spot",
                    "symbol": pair,
                    "interval": bybit_interval,
                    "limit": limit,
                },
            )
            raw_items = data.get("result", {}).get("list", [])
            if not raw_items:
                raise RuntimeError(f"Bybit returned empty candle list for {pair} ({interval})")
            candles = []
            for row in raw_items:
                ts = int(row[0]) // 1000
                candles.append(
                    {
                        "time": ts,
                        "open": float(row[1]),
                        "high": float(row[2]),
                        "low": float(row[3]),
                        "close": float(row[4]),
                        "volume": float(row[5]),
                    }
                )
            candles.reverse()
            LOGGER.info("Fetched %s candles from Bybit for %s (%s)", len(candles), pair, interval)
            return CandlePayload(symbol=pair, interval=interval, candles=candles, source="bybit", updated_at=utc_now())
        except Exception as exc:
            LOGGER.warning("Bybit failed for %s (%s), trying Binance: %s", pair, interval, exc)
            binance_candles = await self._fetch_binance_candles(pair, interval, limit)
            return CandlePayload(symbol=pair, interval=interval, candles=binance_candles, source="binance", updated_at=utc_now())

    async def _fetch_binance_ticker(self, pair: str) -> Snapshot:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(
                    f"{BINANCE_BASE_URL}/api/v3/ticker/24hr",
                    params={"symbol": pair},
                )
                resp.raise_for_status()
                data = resp.json()
                price = float(data.get("lastPrice", 0))
                change_24h = float(data.get("priceChangePercent", 0))
                volume_24h = float(data.get("volume", 0))
                return Snapshot(
                    symbol=pair.removesuffix("USDT"),
                    pair=pair,
                    price=price,
                    change_24h=change_24h,
                    volume_24h=volume_24h,
                    source="binance",
                    updated_at=utc_now(),
                )
        except Exception as exc:
            LOGGER.warning("Binance ticker failed for %s: %s", pair, exc)
            raise

    async def fetch_market_snapshot(self, pairs: list[str] | None = None) -> list[Snapshot]:
        requested = [normalize_symbol(pair) for pair in (pairs or [item["pair"] for item in DEFAULT_COIN_METADATA])]
        try:
            data = await self._request_json("/v5/market/tickers", {"category": "spot"})
            items = data.get("result", {}).get("list", [])
            by_pair = {str(item.get("symbol", "")).upper(): item for item in items}
            snapshots: list[Snapshot] = []
            for pair in requested:
                item = by_pair.get(pair)
                if item is None:
                    snapshots.append(await self._fetch_binance_ticker(pair))
                    continue
                price = float(item.get("lastPrice") or item.get("last") or 0.0)
                change_24h = float(item.get("price24hPcnt") or 0.0) * 100.0
                volume_24h = float(item.get("volume24h") or item.get("turnover24h") or 0.0)
                snapshots.append(
                    Snapshot(
                        symbol=pair.removesuffix("USDT"),
                        pair=pair,
                        price=price,
                        change_24h=change_24h,
                        volume_24h=volume_24h,
                        source="bybit",
                        updated_at=utc_now(),
                    )
                )
            LOGGER.info("Fetched market snapshot from Bybit for %s pairs", len(snapshots))
            return snapshots
        except Exception as exc:
            LOGGER.warning("Bybit snapshot failed, trying Binance for each pair: %s", exc)
            snapshots: list[Snapshot] = []
            for pair in requested:
                try:
                    snapshots.append(await self._fetch_binance_ticker(pair))
                except Exception:
                    base = self._fallback_base_price(pair)
                    snapshots.append(
                        Snapshot(
                            symbol=pair.removesuffix("USDT"),
                            pair=pair,
                            price=base,
                            change_24h=0.0,
                            volume_24h=0.0,
                            source="fallback",
                            updated_at=utc_now(),
                        )
                    )
            return snapshots

    async def fetch_price(self, symbol: str) -> Snapshot:
        pair = normalize_symbol(symbol)
        snapshot = await self.fetch_market_snapshot([pair])
        return snapshot[0]
