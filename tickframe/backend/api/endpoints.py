from __future__ import annotations

import logging

from fastapi import APIRouter, Body, Depends, HTTPException, Query, Request
from pydantic import BaseModel

from ..models.schemas import AnalyzeResponse, CandleResponse, CoinSummary, IndicatorsPayload, PriceResponse
from ..services.cache import MemoryMarketCache
from ..services.database import DatabaseService
from ..services.coin_icons import coin_icons_client
from ..services.fng_client import fng_client
from ..services.ml_client import MlClient

router = APIRouter(prefix="/api", tags=["market"])
LOGGER = logging.getLogger("tickframe.api")


def get_cache(request: Request) -> MemoryMarketCache:
    cache = getattr(request.app.state, "cache", None)
    if cache is None:
        raise HTTPException(status_code=503, detail="Market cache is not ready")
    return cache


def get_ml_client(request: Request) -> MlClient:
    client = getattr(request.app.state, "ml_client", None)
    if client is None:
        raise HTTPException(status_code=503, detail="ML client is not ready")
    return client


def get_database(request: Request) -> DatabaseService:
    db = getattr(request.app.state, "database", None)
    if db is None:
        raise HTTPException(status_code=503, detail="Database is not ready")
    return db


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/sentiment")
async def get_market_sentiment() -> dict:
    return await fng_client.get_index()


@router.get("/coins/icons")
async def get_coin_icons(db: DatabaseService = Depends(get_database)) -> dict[str, str]:
    return await coin_icons_client.get_icons(db=db)


@router.get("/coins", response_model=list[CoinSummary])
async def list_coins(cache: MemoryMarketCache = Depends(get_cache)) -> list[dict]:
    return await cache.list_coins()


@router.get("/coins/{symbol}/price", response_model=PriceResponse)
async def get_price(symbol: str, cache: MemoryMarketCache = Depends(get_cache)) -> dict:
    return await cache.get_price(symbol)


MAX_CANDLES_LIMIT: int = 55000


@router.get("/coins/{symbol}/candles", response_model=CandleResponse)
async def get_candles(
    symbol: str,
    interval: str = Query(default="5m", pattern="^(1m|3m|5m|15m|30m|1h|2h|4h|1d|1w|1M)$"),
    limit: int = Query(default=200, ge=10, le=MAX_CANDLES_LIMIT),
    before: int | None = Query(default=None, description="Return candles older than this unix timestamp (seconds)"),
    cache: MemoryMarketCache = Depends(get_cache),
) -> dict:
    payload = await cache.get_candles(symbol, interval, limit, before=before)
    LOGGER.info(
        "Candles requested symbol=%s interval=%s limit=%s before=%s -> returned=%s source=%s",
        symbol,
        interval,
        limit,
        before,
        len(payload.get("candles", [])),
        payload.get("source", "unknown"),
    )
    return payload


class AnalyzeRequest(BaseModel):
    candles: list[dict] | None = None


@router.post("/analyze/{symbol}", response_model=AnalyzeResponse)
async def analyze_patterns(
    symbol: str,
    body: AnalyzeRequest | None = Body(None),
    interval: str = Query(default="5m", pattern="^(5m|15m|1h|4h|1d)$"),
    limit: int = Query(default=200, ge=99, le=MAX_CANDLES_LIMIT),
    confidence_threshold: float = Query(default=0.80, ge=0.0, le=1.0),
    cache: MemoryMarketCache = Depends(get_cache),
    ml: MlClient = Depends(get_ml_client),
) -> dict:
    warmup = max(50, min(limit // 4, 500))
    if body and body.candles:
        ml_candles = body.candles
        LOGGER.info(
            "Analyzing symbol=%s interval=%s with %d provided candles, threshold=%.2f",
            symbol, interval, len(ml_candles), confidence_threshold,
        )
    else:
        fetch_limit = limit + warmup
        payload = await cache.get_candles(symbol, interval, fetch_limit)
        candles = payload.get("candles", [])
        if len(candles) < warmup:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough candle data: got {len(candles)}, need at least {warmup}",
            )
        ml_candles = [
            {"timestamp": c["time"], "open": c["open"], "high": c["high"],
             "low": c["low"], "close": c["close"], "volume": c["volume"]}
            for c in candles
        ]
        LOGGER.info(
            "Analyzing symbol=%s interval=%s target_candles=%s total_sent=%s",
            symbol, interval, limit, len(ml_candles),
        )

    patterns = await ml.analyze_candles(symbol, interval, ml_candles, confidence_threshold)

    return {
        "symbol": symbol,
        "interval": interval,
        "limit": len(ml_candles),
        "patterns": patterns,
    }


class DrawingsPayload(BaseModel):
    symbol: str = ""
    drawings: list = []
    drawings_data: list | dict | str | None = None


class ToolbarPositionPayload(BaseModel):
    left: int = 16
    top: int = 12


class SettingsPayload(BaseModel):
    settings: dict[str, str] = {}


@router.get("/toolbar-position")
async def get_toolbar_position(db: DatabaseService = Depends(get_database)) -> dict:
    pos = await db.load_toolbar_position()
    if pos:
        return pos
    return {"left": 16, "top": 12}


@router.post("/toolbar-position")
async def save_toolbar_position(
    payload: ToolbarPositionPayload, db: DatabaseService = Depends(get_database)
) -> dict:
    await db.save_toolbar_position(payload.left, payload.top)
    return {"status": "ok"}


@router.get("/drawings")
async def get_drawings(symbol: str = "", db: DatabaseService = Depends(get_database)) -> dict:
    blob = await db.load_drawings_blob(symbol)
    if blob:
        return {"drawings_data": blob}
    drawings = await db.load_drawings(symbol)
    return {"drawings": drawings}


@router.post("/drawings")
async def save_drawings(payload: DrawingsPayload, db: DatabaseService = Depends(get_database)) -> dict:
    if payload.drawings_data is not None:
        await db.save_drawings_blob(payload.symbol, payload.drawings_data)
    else:
        await db.save_drawings(payload.symbol, payload.drawings)
    return {"status": "ok"}
@router.get("/indicators")
async def get_indicators(symbol: str = "", db: DatabaseService = Depends(get_database)) -> dict:
    blob = await db.load_indicators(symbol)
    if blob:
        return {"indicators": blob}
    return {"indicators": []}


@router.post("/indicators")
async def save_indicators(payload: IndicatorsPayload, db: DatabaseService = Depends(get_database)) -> dict:
    await db.save_indicators(payload.symbol, payload.indicators)
    return {"status": "ok"}


@router.get("/settings")
async def get_settings(db: DatabaseService = Depends(get_database)) -> dict:
    settings = await db.get_all_settings()
    return {"settings": settings}


@router.post("/settings")
async def save_settings(payload: SettingsPayload, db: DatabaseService = Depends(get_database)) -> dict:
    for key, value in payload.settings.items():
        await db.set_setting(key, value)
    return {"status": "ok"}
