from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, Query, Request

from ..models.schemas import CandleResponse, CoinSummary, PriceResponse
from ..services.cache import MemoryMarketCache

router = APIRouter(prefix="/api", tags=["market"])
LOGGER = logging.getLogger("tickframe.api")


def get_cache(request: Request) -> MemoryMarketCache:
    cache = getattr(request.app.state, "cache", None)
    if cache is None:
        raise HTTPException(status_code=503, detail="Market cache is not ready")
    return cache


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/coins", response_model=list[CoinSummary])
async def list_coins(cache: MemoryMarketCache = Depends(get_cache)) -> list[dict]:
    return await cache.list_coins()


@router.get("/coins/{symbol}/price", response_model=PriceResponse)
async def get_price(symbol: str, cache: MemoryMarketCache = Depends(get_cache)) -> dict:
    return await cache.get_price(symbol)


@router.get("/coins/{symbol}/candles", response_model=CandleResponse)
async def get_candles(
    symbol: str,
    interval: str = Query(default="5m", pattern="^(5m)$"),
    limit: int = Query(default=200, ge=10, le=1000),
    cache: MemoryMarketCache = Depends(get_cache),
) -> dict:
    payload = await cache.get_candles(symbol, interval, limit)
    LOGGER.info(
        "Candles requested symbol=%s interval=%s limit=%s -> returned=%s source=%s",
        symbol,
        interval,
        limit,
        len(payload.get("candles", [])),
        payload.get("source", "unknown"),
    )
    return payload
