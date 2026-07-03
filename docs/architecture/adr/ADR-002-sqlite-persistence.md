# ADR-002: Use SQLite for Candle and Settings Persistence

**Status:** Accepted

**Context:**

Every page load or coin switch triggered a full Bybit API call to fetch historical candles. With 10 tracked coins and up to 55,000 candles per interval, this resulted in slow reloads, unnecessary exchange API usage, and no offline-cached data. The backend had an in-memory cache that was lost on restart, forcing a complete re-fetch after every deployment.

Customer feedback from Sprint 3 Review identified slow chart loading as a pain point ([PBI-116, #111](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/111)).

**Decision:**

Add SQLite as a persistent cache tier using `aiosqlite` with `run_in_executor` to avoid blocking the async event loop. The caching architecture follows a **3-tier read-through pattern**:

1. **Memory Cache** (`MemoryMarketCache`) — in-process dict with 5-second TTL for hot data
2. **SQLite DB** (`data/tickframe.db`) — persistent storage surviving restarts
3. **Exchange** (Bybit → Binance fallback) — source of truth on cache miss

Key tables:
- `candles(symbol, interval, time)` — OHLCV data with `INSERT OR REPLACE`
- `settings(key, value)` — key-value config store
- `drawings(symbol, data)` — chart annotations per coin

Warmup sequence on startup:
1. Phase 1: Load all cached candles from DB into memory
2. Phase 2: Fill gaps from exchange up to 55,000 candles per (symbol, interval)

**Consequences:**

- **Positive:** Repeat loads are near-instant (memory hit or DB hit). Reduced exchange API calls (rate limit and cost savings). Data survives container restarts. Deterministic analysis on cached data (same candles = same results).
- **Negative:** DB file management — `data/tickframe.db` grows with usage (mitigated by fixed 55k-candle limit per pair/interval). Schema migrations needed if storage format changes. SQLite concurrency model serialises writes.

**Links:**
- Relates to **QR-001 (Time Behaviour)**: p95 response time improves dramatically on cache hit. Warmup ensures data is pre-loaded before first user request.
- Relates to **QR-003 (Functional Correctness)**: Deterministic analysis on cached data ensures reproducible ML results.
- Relates to PBI: [#111 PBI-116](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/111)
