"""Shared test fixtures and configuration."""

import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from tickframe.backend.main import app


@pytest_asyncio.fixture
async def async_client():
    """Async client fixture with app lifespan."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
