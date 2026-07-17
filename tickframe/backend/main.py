from __future__ import annotations

import asyncio
import logging
import os
from contextlib import asynccontextmanager, suppress
from pathlib import Path


from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .api.endpoints import router as api_router
from .api.websocket import market_hub, router as ws_router
from .services.bybit_client import BybitClient, DEFAULT_COIN_METADATA
from .services.cache import MemoryMarketCache
from .services.database import DatabaseService
from .services.ml_client import MlClient

LOGGER = logging.getLogger("tickframe.backend")
BACKEND_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BACKEND_DIR.parent / "frontend"


async def market_refresh_loop(app: FastAPI) -> None:
    while True:
        try:
            cache: MemoryMarketCache = app.state.cache
            snapshot = await cache.refresh_market_snapshot()
            await app.state.market_hub.broadcast_json(
                {
                    "type": "market_snapshot",
                    "updated_at": snapshot[0].get("updated_at", "") if snapshot else "",
                    "coins": snapshot,
                }
            )
        except asyncio.CancelledError:
            raise
        except Exception as exc:  # pragma: no cover - defensive network guard
            LOGGER.warning("Market refresh failed: %s", exc)
        await asyncio.sleep(1)


async def background_ml_scan(app: FastAPI) -> None:
    cache: MemoryMarketCache = app.state.cache
    db: DatabaseService = app.state.database
    ml: MlClient = app.state.ml_client

    while not cache._warmup_done:
        await asyncio.sleep(1)

    LOGGER.info("Background ML scan: starting silent scan for all coins")
    for meta in DEFAULT_COIN_METADATA:
        pair = meta["pair"]
        interval = "5m"
        try:
            existing = await db.load_ml_scan(pair)
            if existing and existing["patterns"]:
                latest_db = await db.get_candle_range(pair, interval)
                if latest_db and existing["last_scanned_time"] >= latest_db[1]:
                    continue

            db_count = await db.count_candles(pair, interval)
            if db_count >= 50000:
                candles = await db.load_last_n_candles(pair, interval, 50000)
            else:
                cache_result = await cache.get_candles(pair, interval, 50000)
                candles = cache_result.get("candles", [])

            if not candles:
                LOGGER.info("Background ML scan: no candles for %s, skipping", pair)
                continue

            ml_candles = [
                {"timestamp": c["time"], "open": c["open"], "high": c["high"],
                 "low": c["low"], "close": c["close"], "volume": c["volume"]}
                for c in candles
            ]
            patterns = await ml.analyze_candles(pair, interval, ml_candles)
            last_time = candles[-1]["time"]
            await db.save_ml_scan(pair, interval, last_time, patterns)
            LOGGER.info("Background ML scan: %s scanned, %d patterns found", pair, len(patterns))
        except Exception as exc:
            LOGGER.warning("Background ML scan failed for %s: %s", pair, exc)
    LOGGER.info("Background ML scan: complete")


@asynccontextmanager
async def lifespan(app: FastAPI):
    client = BybitClient()
    db = DatabaseService(database_url=os.environ.get("DATABASE_URL"))
    await db.init()

    cache = MemoryMarketCache(client, db=db)
    ml_client = MlClient()
    app.state.client = client
    app.state.cache = cache
    app.state.ml_client = ml_client
    app.state.market_hub = market_hub
    app.state.database = db

    # Clear all persisted drawing data on restart
    try:
        await db.clear_drawings()
        LOGGER.info("Cleared all persisted drawing data")
    except Exception:
        pass

    # Start warmup in background so the server becomes responsive immediately.
    # Phase 1 (loading DB candles) completes quickly; phase 2 (sequential
    # exchange fetches) runs as capacity allows via the rate limiter.
    warmup_task = asyncio.create_task(cache.warm_up())

    refresh_task = asyncio.create_task(market_refresh_loop(app))
    ml_scan_task = asyncio.create_task(background_ml_scan(app))
    try:
        yield
    finally:
        warmup_task.cancel()
        with suppress(asyncio.CancelledError):
            await warmup_task
        refresh_task.cancel()
        with suppress(asyncio.CancelledError):
            await refresh_task
        ml_scan_task.cancel()
        with suppress(asyncio.CancelledError):
            await ml_scan_task
        await client.aclose()
        await ml_client.aclose()
        await db.close()



def create_app() -> FastAPI:
    app = FastAPI(title="TickFrame", version="1.0.0", lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(api_router)
    app.include_router(ws_router)

    # Serve static assets at the URLs referenced by index.html.
    app.mount("/css", StaticFiles(directory=str(FRONTEND_DIR / "css"), html=False), name="css")
    app.mount("/js", StaticFiles(directory=str(FRONTEND_DIR / "js"), html=False), name="js")
    app.mount("/lib", StaticFiles(directory=str(FRONTEND_DIR / "lib"), html=False), name="lib")
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR), html=False), name="static")

    @app.get("/", include_in_schema=False)
    async def root() -> FileResponse:
        return FileResponse(FRONTEND_DIR / "index.html")

    return app


app = create_app()
