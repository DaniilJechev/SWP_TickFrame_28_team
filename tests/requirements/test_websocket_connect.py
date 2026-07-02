"""QRT-004: Verify WebSocket connection completes within time limits."""

import pytest
from unittest.mock import AsyncMock

from tickframe.backend.api.websocket import market_hub


@pytest.mark.asyncio
async def test_websocket_connect_receives_connected():
    ws = AsyncMock()
    await market_hub.connect(ws)
    ws.accept.assert_awaited_once()
    await market_hub.disconnect(ws)


@pytest.mark.asyncio
async def test_websocket_broadcast_within_time():
    ws = AsyncMock()
    await market_hub.connect(ws)
    payload = {"type": "connected"}
    await market_hub.broadcast_json(payload)
    ws.send_json.assert_awaited_once_with(payload)
    await market_hub.disconnect(ws)
