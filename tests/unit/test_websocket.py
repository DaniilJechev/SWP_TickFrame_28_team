"""Unit tests for SocketHub WebSocket manager."""

import pytest
from unittest.mock import AsyncMock
from tickframe.backend.api.websocket import SocketHub


@pytest.fixture
def hub():
    return SocketHub()


@pytest.mark.asyncio
async def test_connect_adds_client(hub):
    ws = AsyncMock()
    await hub.connect(ws)
    assert ws in hub._clients


@pytest.mark.asyncio
async def test_connect_accepts_websocket(hub):
    ws = AsyncMock()
    await hub.connect(ws)
    ws.accept.assert_awaited_once()


@pytest.mark.asyncio
async def test_disconnect_removes_client(hub):
    ws = AsyncMock()
    await hub.connect(ws)
    await hub.disconnect(ws)
    assert ws not in hub._clients


@pytest.mark.asyncio
async def test_disconnect_discard_unknown(hub):
    ws = AsyncMock()
    await hub.disconnect(ws)
    assert ws not in hub._clients


@pytest.mark.asyncio
async def test_broadcast_json_sends_to_all_clients(hub):
    ws1 = AsyncMock()
    ws2 = AsyncMock()
    await hub.connect(ws1)
    await hub.connect(ws2)
    payload = {"type": "test", "data": 42}
    await hub.broadcast_json(payload)
    ws1.send_json.assert_awaited_once_with(payload)
    ws2.send_json.assert_awaited_once_with(payload)


@pytest.mark.asyncio
async def test_broadcast_json_skips_disconnected_client(hub):
    ws1 = AsyncMock()
    ws2 = AsyncMock()
    ws2.send_json.side_effect = Exception("connection lost")
    await hub.connect(ws1)
    await hub.connect(ws2)
    payload = {"type": "test"}
    await hub.broadcast_json(payload)
    ws1.send_json.assert_awaited_once_with(payload)
    assert ws2 not in hub._clients


@pytest.mark.asyncio
async def test_connect_multiple_clients(hub):
    clients = [AsyncMock() for _ in range(5)]
    for ws in clients:
        await hub.connect(ws)
    assert len(hub._clients) == 5


@pytest.mark.asyncio
async def test_disconnect_one_keeps_others(hub):
    ws1 = AsyncMock()
    ws2 = AsyncMock()
    ws3 = AsyncMock()
    await hub.connect(ws1)
    await hub.connect(ws2)
    await hub.connect(ws3)
    await hub.disconnect(ws2)
    assert ws1 in hub._clients
    assert ws2 not in hub._clients
    assert ws3 in hub._clients
