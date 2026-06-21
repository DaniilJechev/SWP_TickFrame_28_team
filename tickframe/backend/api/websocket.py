from __future__ import annotations

import asyncio
from typing import Any

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from ..services.bybit_client import normalize_interval, normalize_symbol, utc_now
from ..services.cache import MemoryMarketCache

router = APIRouter(tags=["stream"])


class SocketHub:
    def __init__(self) -> None:
        self._clients: set[WebSocket] = set()
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            self._clients.add(websocket)

    async def disconnect(self, websocket: WebSocket) -> None:
        async with self._lock:
            self._clients.discard(websocket)

    async def broadcast_json(self, payload: Any) -> None:
        async with self._lock:
            clients = list(self._clients)
        for websocket in clients:
            try:
                await websocket.send_json(payload)
            except Exception:
                await self.disconnect(websocket)


market_hub = SocketHub()


def get_cache(websocket: WebSocket) -> MemoryMarketCache:
    cache = getattr(websocket.app.state, "cache", None)
    if cache is None:
        raise RuntimeError("Market cache is not ready")
    return cache


@router.websocket("/ws/market")
async def market_stream(websocket: WebSocket) -> None:
    cache = get_cache(websocket)
    await market_hub.connect(websocket)
    try:
        await websocket.send_json({"type": "snapshot", "updated_at": utc_now(), "coins": await cache.list_coins()})
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        await market_hub.disconnect(websocket)


@router.websocket("/ws/candles/{symbol}")
async def candle_stream(websocket: WebSocket, symbol: str) -> None:
    cache = get_cache(websocket)
    interval = normalize_interval(websocket.query_params.get("interval", "5m"))
    limit = int(websocket.query_params.get("limit", "200"))
    pair = normalize_symbol(symbol)
    await websocket.accept()
    try:
        previous_signature = None
        while True:
            payload = await cache.get_candles(pair, interval, limit)
            candles = payload["candles"]
            last_candle = candles[-1] if candles else None
            current_signature = None
            if last_candle is not None:
                current_signature = (
                    last_candle["time"],
                    last_candle["open"],
                    last_candle["high"],
                    last_candle["low"],
                    last_candle["close"],
                    last_candle["volume"],
                )
            if previous_signature is None:
                await websocket.send_json({"type": "snapshot", **payload})
            elif current_signature != previous_signature and last_candle is not None:
                await websocket.send_json({"type": "update", "symbol": pair, "interval": interval, "candle": last_candle, "updated_at": payload["updated_at"]})
            previous_signature = current_signature
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        pass
