# ADR-001: Migrate REST Polling to WebSocket for Real-Time Market Data

**Status:** Accepted

**Context:**

MVP v1 used REST polling every 5 seconds to fetch candle data from the backend, which in turn polled the Bybit API. This caused unnecessary load on the exchange API and introduced latency between market movements and chart updates. Customer feedback from the Sprint 3 Review (2026-06-26) listed real-time updates as the top-priority request ([PBI-115, #110](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110)).

**Decision:**

Replace REST polling with bidirectional WebSocket connections using FastAPI's built-in `WebSocket` class. The backend maintains a single `SocketHub` that manages connected clients, a market hub that broadcasts ticker snapshots every 5 seconds, and per-symbol candle streams that push incremental updates when the last candle changes. Heartbeat messages (every 5 seconds) keep idle connections alive.

Key implementation details:
- `GET /ws/market` — subscribes to market-wide coin list updates
- `GET /ws/candles/{symbol}?interval=5m` — subscribes to candle updates for a specific coin
- `SocketHub` class with `asyncio.Lock` for thread-safe client management
- Heartbeat mechanism: server sends `{"type": "heartbeat"}` every 5s; client reconnects on timeout

**Consequences:**

- **Positive:** Real-time chart updates eliminate the polling delay. Reduced load on the Bybit API (one WebSocket connection instead of per-client polling). Lower bandwidth usage compared to periodic full-response polling.
- **Negative:** Increased connection complexity — the backend must manage persistent WebSocket connections, handle reconnection logic, and broadcast to multiple clients. WebSocket connections require more server resources than stateless REST calls.
- **Risk:** If the backend restarts, all WebSocket connections drop. The frontend must implement automatic reconnection with exponential backoff.

**Links:**
- Relates to **QR-001 (Time Behaviour)**: WebSocket reduces latency from polling interval to near-real-time push
- Relates to **QR-002 (Confidentiality)**: All WebSocket input is validated before processing
- Relates to PBI: [#110 PBI-115](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110)
