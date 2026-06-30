# Part 6 Delivery Plan — Assignment 5: Extend Testing, QA, and DoD for MVP v2

## Overview

Part 6 requires keeping all A4 gates **active** while extending tests, quality checks, and documentation for Sprint 4 changes (WebSocket, DB cache, RSI/Volume sub-charts, multi-interval, analysis range). The assignment explicitly avoids fixed numeric targets — extend coverage enough that **new/changed product areas are credibly covered**.

### Project context (from `5/context.md`)

| Current state | Gap for Part 6 |
|---|---|
| Tests: unit (4 files), integration (1 file), QRTs (3 files) | Frontend JS: **zero coverage** — needed for WebSocket, sub-charts, multi-interval |
| QRT-001: tests health endpoint < 2s | QR-001 target is p95 ≤ 500ms — QRT doesn't match QR |
| QR-003: F2 ≥ 0.80 | Was lowered to ≥ 0.55 — QR doc + QRT need updating |
| DoD: references "Sprint 3 milestone" | Outdated — must reflect Sprint 4, WebSocket, new modules |
| Testing.md: lists planned but missing tests (WebSocket, CLI) | These should be implemented for MVP v2 |
| CI: ruff → mypy → pytest+cov → bandit | No frontend JS checks, no e2e tests |

---

## Documents to update

| File | Path | Current status | What to change |
|---|---|---|---|
| Testing strategy | `docs/testing.md` | 94 lines, complete | Add MVP v2 coverage: WebSocket tests, DB cache tests, sub-chart tests, JS testing approach |
| Quality Requirements | `docs/quality-requirements.md` | 109 lines, 3 QRs | Fix QR-003 F2 threshold (0.80 → 0.55), add ADR links to each QR |
| QRT docs | `docs/quality-requirement-tests.md` | 64 lines, 3 QRTs | Align QRT-001 with QR-001 (2s → 500ms p95), add new QRTs for MVP v2 |
| Definition of Done | `docs/definition-of-done.md` | 40 lines | Update "Sprint 3" → "current Sprint", add WebSocket/reconnection criteria, add frontend JS checks if added |
| CI config | `.github/workflows/ci.yml` | Existing A4 CI | Optionally add frontend lint if JS tests are introduced |

---

## Section-by-section plan

### 1. Update `docs/testing.md`

#### New/modified sections to add

**1a. WebSocket tests (backend)**

Add row to unit tests table:
| Module | Test file | Topics covered |
|---|---|---|
| `tickframe/backend/api/websocket.py` | `tests/unit/test_websocket.py` | Connection, heartbeat, subscription, reconnection, fan-out to clients |

Key test scenarios:
- Client connects → receives `{"type": "connected"}`
- Client subscribes to `BTCUSDT` → receives candle snapshots
- Client disconnects → no more messages
- Multiple clients connected → each receives the same broadcast
- Heartbeat interval maintained

**1b. SQLite cache tests**

Add row to unit tests table (cache.py already tested; add DB integration):
| Module | Test file | Topics covered |
|---|---|---|
| `tickframe/backend/services/database.py` | `tests/unit/test_database.py` | Save/load settings, save/load drawings, save/load candles, cache hit/miss |

Key test scenarios:
- Save candle batch → retrieve by coin/interval → matches
- Cache miss → returns None
- Settings round-trip
- Schema migration handling

**1c. RSI & Volume sub-chart tests**

These are frontend-only changes (Lightweight Charts panes). Add frontend testing note:
```
### Frontend JS Tests
- **Status:** ❌ None exist — targeted for MVP v2
- **Recommended approach:** Vanilla JS module tests using a lightweight runner
- **Priority scenarios:**
  - WebSocket message → pane updates correctly
  - RSI calculation on received candle data
  - Volume bar rendering on timeframe switch
  - Sub-chart resize on sidebar drag
- **Future work:** Evaluate Vitest or plain Jest for CI integration
```

**1d. Multi-interval support tests**

Update existing candle tests to cover multiple intervals:
- `test_bybit_client.py`: Add `test_fetch_candles_15m`, `test_fetch_candles_1h`, etc.
- `test_api_endpoints.py`: Add `test_candles_endpoint_interval_param` for each interval

**1e. Analysis range tests**

Update `test_detection.py`:
- `test_analyze_within_range(limit=50000)` — verify only N candles analyzed
- `test_analyze_exceeds_range` — truncation works

**1f. Update critical modules table**

| Module | Path | Target | Notes |
|---|---|---|---|
| (add) WebSocket | `tickframe/backend/api/websocket.py` | ≥30% | New critical module |
| (add) Database | `tickframe/backend/services/database.py` | ≥30% | New critical module |

### Checklist — testing.md

- [ ] Add WebSocket unit test rows and scenario descriptions
- [ ] Add database unit test rows and scenario descriptions
- [ ] Add "Frontend JS Tests" section with status and priority scenarios
- [ ] Update detection tests for configurable analysis range
- [ ] Cover new intervals in bybit_client tests (15m, 1h, 4h, 1d)
- [ ] Update critical modules table with WebSocket and Database

---

### 2. Update `docs/quality-requirements.md`

#### 2a. Fix QR-003 threshold (critical gap)

| Field | Current | Corrected |
|---|---|---|
| **Response Measure** | F2 score ≥ **0.80** on held-out test set | F2 score ≥ **0.55** on held-out test set |
| **Rationale** | ... | Append: *Threshold lowered from 0.80 after Sprint 3 review — current ML model precision makes 0.55 a realistic target while maintaining useful recall for initial screening.* |

#### 2b. Add "Related ADRs" row to each QR

Append to each QR's Links table:

**QR-001:**
| Related ADRs | |
|---|---|
| [ADR-001](architecture/adr/ADR-001-websocket-migration.md) | WebSocket migration reduces polling latency |
| [ADR-002](architecture/adr/ADR-002-sqlite-persistence.md) | SQLite cache reduces response time for repeat loads |
| [ADR-003](architecture/adr/ADR-003-microservice-architecture.md) | Microservice network hop adds some latency |

**QR-002:**
| Related ADRs | |
|---|---|
| [ADR-001](architecture/adr/ADR-001-websocket-migration.md) | WebSocket input validation |
| [ADR-003](architecture/adr/ADR-003-microservice-architecture.md) | Service boundary enforces input sanitisation |

**QR-003:**
| Related ADRs | |
|---|---|
| [ADR-003](architecture/adr/ADR-003-microservice-architecture.md) | ML service isolation enables dedicated accuracy testing |

### Checklist — quality-requirements.md

- [ ] Fix QR-003 F2 threshold: 0.80 → 0.55
- [ ] Add QR-003 rationale update explaining the change
- [ ] Add "Related ADRs" row to QR-001 with ADR-001, ADR-002, ADR-003
- [ ] Add "Related ADRs" row to QR-002 with ADR-001, ADR-003
- [ ] Add "Related ADRs" row to QR-003 with ADR-003
- [ ] Update summary table if needed

---

### 3. Update `docs/quality-requirement-tests.md`

#### 3a. Align QRT-001 with QR-001

| Field | Current | Corrected |
|---|---|---|
| **Pass/fail criteria** | `GET /api/health` responds < **2.0 seconds** | 95th percentile response time ≤ **500ms** across 10 requests to `/api/health` and `/api/coins/BTCUSDT/candles?interval=5m&limit=100` |

Update test file `tests/requirements/test_performance.py`:
- Run 10 requests, measure p95
- Test both health and candles endpoints
- Assert p95 < 0.5s

#### 3b. Add QRT-004: WebSocket connection test

Add new QRT entry:

```markdown
## QRT-004: WebSocket Connection Reliability

| Field | Value |
|---|---|
| **ID** | QRT-004 |
| **Linked QR** | [QR-001](quality-requirements.md#qr-001-api-response-time) — Time Behaviour |
| **Test description** | Verify that WebSocket handshake completes within 1 second and connection stays alive |
| **Automation method** | `pytest` + `websockets` library |
| **Test file** | `tests/requirements/test_websocket_connect.py` |
| **CI job** | `CI / test` in `.github/workflows/ci.yml` |
| **Evidence type** | CI job pass/fail |
| **Pass/fail criteria** | WebSocket connects within < 1000ms; receives `{"type": "connected"}` within 500ms of connect |
```

Test scenarios:
- WS connects → receives connected event within 500ms
- WS subscribes → receives candle payload within 2s

#### 3c. Add QRT-005: DB cache round-trip

Add new QRT entry:

```markdown
## QRT-005: Database Cache Read/Write

| Field | Value |
|---|---|
| **ID** | QRT-005 |
| **Linked QR** | [QR-001](quality-requirements.md#qr-001-api-response-time) — Time Behaviour |
| **Test description** | Verify that cached candles are returned instead of re-fetching from exchange |
| **Automation method** | `pytest` + mocked Bybit client |
| **Test file** | `tests/requirements/test_db_cache.py` |
| **CI job** | `CI / test` in `.github/workflows/ci.yml` |
| **Evidence type** | CI job pass/fail |
| **Pass/fail criteria** | After first fetch, second fetch for same coin/interval returns cached data without calling external API |
```

#### 3d. Update CI integration section

Add new test files to the pytest command — already covered by `pytest ... tests/` since they're inside `tests/requirements/`.

### Checklist — quality-requirement-tests.md

- [ ] Update QRT-001: change pass/fail to 500ms p95, add candle endpoint
- [ ] Update `tests/requirements/test_performance.py` — p95 measurement
- [ ] Add QRT-004: WebSocket connection reliability
- [ ] Create `tests/requirements/test_websocket_connect.py`
- [ ] Add QRT-005: DB cache round-trip
- [ ] Create `tests/requirements/test_db_cache.py`

---

### 4. Update `docs/definition-of-done.md`

#### 4a. Fix milestone reference

Line 9: `PR links to the Sprint 3 milestone` → `PR links to the current Sprint milestone (Sprint 4 during Week 5)`

#### 4b. Add WebSocket-specific criteria

Under "Quality Criteria" add:

- [ ] **WebSocket reconnection verified** — frontend recovers from connection drop within 5 seconds (if change touches WebSocket)

#### 4c. Add frontend testing note (if JS tests are added)

Under CI table, add row:

| Frontend JS tests | `{test tool}` `tickframe/frontend/js/tests/` | All pass |

#### 4d. Update QR references

QR-003 criteria: `F2 ≥ 0.55` (was 0.80)

### Checklist — definition-of-done.md

- [ ] "Sprint 3 milestone" → "current Sprint milestone"
- [ ] Add WebSocket reconnection criterion
- [ ] Add frontend JS test criterion (conditional)
- [ ] Update QR-003 threshold reference (0.80 → 0.55)
- [ ] Verify DoD accurately reflects current architecture/deployment workflow

---

### 5. Update CI configuration (` .github/workflows/ci.yml`) — conditional

Only if frontend JS tests are added:
- [ ] Add a `frontend-lint` job (e.g., `eslint tickframe/frontend/js/`)
- [ ] Add a `frontend-test` job (e.g., `npx vitest run`)

Otherwise:
- [ ] No CI changes needed — existing 4-job pipeline covers all new Python tests

---

## Sprint 4 PBI → Test mapping

| PBI | Issue | What changes | Required test coverage |
|---|---|---|---|
| **PBI-115** WebSocket | #110 | Backend WS endpoints, frontend WS client | `test_websocket.py` (unit), `test_websocket_connect.py` (QRT), frontend JS test |
| **PBI-116** DB cache | #111 | `database.py` (new/cache layer) | `test_database.py` (unit), `test_db_cache.py` (QRT) |
| **PBI-117** RSI sub-chart | #112 | Frontend chart pane  | Frontend JS test (render) |
| **PBI-118** Volume sub-chart | #113 | Frontend chart pane | Frontend JS test (render) |
| **PBI-119** Analysis range | #114 | `detection/mock.py` limit param | `test_detection.py` — add range tests |
| **PBI-120** Multi-interval | #115 | Backend + frontend interval handling | `test_bybit_client.py` — add interval tests |

---

## Cross-cutting checklist

### Before starting
- [ ] `git pull origin main`
- [ ] Create feature branch: `git checkout -b part-6-testing-qa`
- [ ] Assign PBI-121/122/123/124/125 (testing PBIs) to Sprint 4 milestone if not already

### Implementation order (recommended)
1. Fix QR-003 threshold in `docs/quality-requirements.md` (quick fix)
2. Align QRT-001 test with corrected QR-001 target
3. Write WebSocket unit tests + QRT-004
4. Write DB cache unit tests + QRT-005
5. Add interval tests to existing test files
6. Update `docs/testing.md` with all new sections
7. Update `docs/definition-of-done.md`
8. Verify all CI checks pass

### Per-change verification
- [ ] Each change is in a separate commit
- [ ] `ruff check .` passes
- [ ] `mypy tickframe/` passes
- [ ] `pytest --cov=tickframe --cov-report=term tests/` passes (all tests, old + new)
- [ ] `bandit -r tickframe/ -ll` passes
- [ ] PR created, linked to Sprint 4 milestone
- [ ] Reviewed by different person
- [ ] Merged to `main`
- [ ] CHANGELOG.md updated for user-visible testing improvements

### Final verification
- [ ] All 4 files updated (testing.md, quality-requirements.md, quality-requirement-tests.md, definition-of-done.md)
- [ ] QR thresholds match real project state (QR-003: F2 ≥ 0.55)
- [ ] QRT-001 target matches QR-001 (500ms p95)
- [ ] New QRTs (QRT-004, QRT-005) pass in CI
- [ ] DoD references Sprint 4, not Sprint 3
- [ ] Each QR links to relevant ADRs
