from __future__ import annotations

import time
from typing import TYPE_CHECKING

import httpx

if TYPE_CHECKING:
    from .database import DatabaseService

COINGECKO_API = "https://api.coingecko.com/api/v3/coins/markets"
CACHE_TTL = 3600  # 1 hour — icons rarely change

SYMBOL_TO_ID: dict[str, str] = {
    "BTCUSDT": "bitcoin",
    "ETHUSDT": "ethereum",
    "SOLUSDT": "solana",
    "XRPUSDT": "ripple",
    "DOGEUSDT": "dogecoin",
    "ADAUSDT": "cardano",
    "AVAXUSDT": "avalanche-2",
    "DOTUSDT": "polkadot",
    "LINKUSDT": "chainlink",
    "BNBUSDT": "binancecoin",
}


class CoinIconsClient:
    def __init__(self) -> None:
        self._cache: dict[str, str] | None = None
        self._cache_expiry: float = 0

    async def get_icons(self, db: DatabaseService | None = None) -> dict[str, str]:
        if self._cache is not None and time.time() < self._cache_expiry:
            return self._cache

        # Try DB first
        if db is not None:
            db_icons = await db.load_coin_icons()
            if db_icons:
                self._cache = db_icons
                self._cache_expiry = time.time() + CACHE_TTL
                return db_icons

        coin_ids = list(SYMBOL_TO_ID.values())
        result: dict[str, str] = {}

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(
                    COINGECKO_API,
                    params={"vs_currency": "usd", "ids": ",".join(coin_ids), "order": "market_cap_desc", "per_page": "250", "sparkline": "false"},
                )
                resp.raise_for_status()
                for coin in resp.json():
                    sym = coin.get("symbol", "").upper() + "USDT"
                    img = coin.get("image", "")
                    if img:
                        result[sym] = img
        except Exception:
            if self._cache is not None:
                return self._cache
            return {}

        if result:
            self._cache = result
            self._cache_expiry = time.time() + CACHE_TTL
            if db is not None:
                await db.save_coin_icons(result)

        return result


coin_icons_client = CoinIconsClient()
