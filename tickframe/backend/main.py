from __future__ import annotations

import asyncio
import logging
from contextlib import asynccontextmanager, suppress
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .api.endpoints import router as api_router
from .api.websocket import market_hub, router as ws_router
from .services.bybit_client import BybitClient
from .services.cache import MemoryMarketCache

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
        await asyncio.sleep(5)


@asynccontextmanager
async def lifespan(app: FastAPI):
    client = BybitClient()
    cache = MemoryMarketCache(client)
    app.state.client = client
    app.state.cache = cache
    app.state.market_hub = market_hub

    # Do not block application startup on upstream market data.
    with suppress(Exception):
        await asyncio.wait_for(cache.warm_up("BTCUSDT"), timeout=4)
    refresh_task = asyncio.create_task(market_refresh_loop(app))
    try:
        yield
    finally:
        refresh_task.cancel()
        with suppress(asyncio.CancelledError):
            await refresh_task
        await client.aclose()


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
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR), html=False), name="static")

    @app.get("/", include_in_schema=False)
    async def root() -> FileResponse:
        return FileResponse(FRONTEND_DIR / "index.html")

    return app


app = create_app()
