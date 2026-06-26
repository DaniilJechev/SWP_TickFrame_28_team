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
    "1m": "1",
    "3m": "3",
    "5m": "5",
    "15m": "15",
    "30m": "30",
    "1h": "60",
    "2h": "120",
    "4h": "240",
    "1d": "D",
    "1w": "W",
    "1M": "M",
}

DEFAULT_COIN_METADATA = [
    {"symbol": "BTC", "pair": "BTCUSDT", "name": "Bitcoin", "icon": "B", "color": "#f7931a"},
    {"symbol": "ETH", "pair": "ETHUSDT", "name": "Ethereum", "icon": "E", "color": "#627eea"},
    {"symbol": "SOL", "pair": "SOLUSDT", "name": "Solana", "icon": "S", "color": "#9945ff"},
    {"symbol": "XRP", "pair": "XRPUSDT", "name": "Ripple", "icon": "X", "color": "#00aae4"},
    {"symbol": "DOGE", "pair": "DOGEUSDT", "name": "Dogecoin", "icon": "D", "color": "#c2a633"},
    {"symbol": "ADA", "pair": "ADAUSDT", "name": "Cardano", "icon": "A", "color": "#0033ad"},
    {"symbol": "AVAX", "pair": "AVAXUSDT", "name": "Avalanche", "icon": "V", "color": "#e84142"},
    {"symbol": "DOT", "pair": "DOTUSDT", "name": "Polkadot", "icon": "P", "color": "#e6007a"},
    {"symbol": "LINK", "pair": "LINKUSDT", "name": "Chainlink", "icon": "L", "color": "#375bd2"},
    {"symbol": "BNB", "pair": "BNBUSDT", "name": "BNB", "icon": "N", "color": "#f0b90b"},
]

DEFAULT_PRICE_HINTS = {
    "BTCUSDT": 68000.0,
    "ETHUSDT": 3400.0,
    "SOLUSDT": 140.0,
    "XRPUSDT": 0.50,
    "DOGEUSDT": 0.12,
    "ADAUSDT": 0.40,
    "AVAXUSDT": 30.0,
    "DOTUSDT": 6.0,
    "LINKUSDT": 14.0,
    "BNBUSDT": 580.0,
}

BINANCE_BASE_URL = "https://api.binance.com"

BINANCE_INTERVAL_MAP = {
    "1m": "1m", "3m": "3m", "5m": "5m", "15m": "15m", "30m": "30m",
    "1h": "1h", "2h": "2h", "4h": "4h",
    "1d": "1d", "1w": "1w", "1M": "1M",
}


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
        binance_interval = BINANCE_INTERVAL_MAP.get(interval, "5m")
        max_per_request = 1000
        all_candles: list[dict] = []
        end_time: int | None = None
        try:
            while len(all_candles) < limit:
                remaining = limit - len(all_candles)
                batch_limit = min(max_per_request, remaining)
                async with httpx.AsyncClient(timeout=10.0) as client:
                    params = {"symbol": pair, "interval": binance_interval, "limit": batch_limit}
                    if end_time is not None:
                        params["endTime"] = str(end_time)
                    resp = await client.get(f"{BINANCE_BASE_URL}/api/v3/klines", params=params)
                    resp.raise_for_status()
                    raw = resp.json()
                    if not raw:
                        break
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
                    # Deduplicate
                    seen = {c["time"] for c in all_candles}
                    new_candles = [c for c in candles if c["time"] not in seen]
                    if not new_candles:
                        break
                    all_candles.extend(new_candles)
                    oldest_ts = min(c["time"] for c in new_candles)
                    end_time = oldest_ts * 1000
                    LOGGER.info(
                        "Pagination: fetched %d candles from Binance for %s — total=%d limit=%d",
                        len(new_candles), pair, len(all_candles), limit,
                    )
            all_candles.sort(key=lambda c: c["time"])
            all_candles = all_candles[-limit:]
            LOGGER.info("Fetched total %d candles from Binance for %s", len(all_candles), pair)
            return all_candles
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

    async def _fetch_bybit_kline_batch(self, pair: str, interval: str, limit: int, end_ms: int | None = None) -> list[dict]:
        params = {
            "category": "spot",
            "symbol": pair,
            "interval": interval,
            "limit": limit,
        }
        if end_ms is not None:
            params["end"] = str(end_ms)
        data = await self._request_json("/v5/market/kline", params)
        raw_items = data.get("result", {}).get("list", [])
        candles = []
        for row in raw_items:
            ts = int(row[0]) // 1000
            candles.append({
                "time": ts,
                "open": float(row[1]),
                "high": float(row[2]),
                "low": float(row[3]),
                "close": float(row[4]),
                "volume": float(row[5]),
            })
        candles.reverse()
        return candles

    async def fetch_candles(self, symbol: str, interval: str = "5m", limit: int = 200) -> CandlePayload:
        pair = normalize_symbol(symbol)
        interval = normalize_interval(interval)
        bybit_interval = INTERVAL_MAP[interval]
        max_per_request = 200
        all_candles: list[dict] = []
        end_ms: int | None = None

        try:
            while len(all_candles) < limit:
                remaining = limit - len(all_candles)
                batch_limit = min(max_per_request, remaining)
                batch = await self._fetch_bybit_kline_batch(pair, bybit_interval, batch_limit, end_ms)
                if not batch:
                    break
                # Deduplicate: skip candles already collected (overlap from time boundary)
                seen_times = {c["time"] for c in all_candles}
                new_candles = [c for c in batch if c["time"] not in seen_times]
                if not new_candles:
                    break
                all_candles.extend(new_candles)
                # Set end to oldest candle timestamp (exclusive) in ms
                oldest_ts = min(c["time"] for c in new_candles)
                end_ms = oldest_ts * 1000
                LOGGER.info(
                    "Pagination: fetched %d candles from Bybit for %s (%s) — total=%d limit=%d",
                    len(new_candles), pair, interval, len(all_candles), limit,
                )
            all_candles.sort(key=lambda c: c["time"])
            all_candles = all_candles[-limit:]
            LOGGER.info("Fetched total %d candles from Bybit for %s (%s)", len(all_candles), pair, interval)
            return CandlePayload(symbol=pair, interval=interval, candles=all_candles, source="bybit", updated_at=utc_now())
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
