# Part 8 Delivery Plan — Assignment 5: Update and Execute UAT for MVP v2

## Overview

Part 8 requires maintaining all active UAT scenarios, adding **≥2 new scenarios** for MVP v2 functionality, executing them with the customer in a recorded session, and summarizing results in the Week 5 report.

### Project context (from `5/context.md`)

| Current UAT | Status | MVP v2 relevance |
|---|---|---|
| UAT-001: Scan & view patterns | ⏳ Partial | Unchanged — ML still separate service |
| UAT-002: Toggle timeframes | ❌ Not tested | **Now testable** — PBI-120 adds 15m/1h/4h/1d |
| UAT-003: Export scan results | ⏳ Not demonstrated | Unchanged — not in Sprint 4 scope |
| UAT-004: Real-time sidebar | ✅ Pass | Improved by PBI-115 WebSocket (live pushes) |
| UAT-005: Theme toggle | ✅ Pass | Unchanged |

### MVP v2 functionality requiring new UAT scenarios

| PBI | Issue | User-facing change | UAT candidate |
|---|---|---|---|
| PBI-115 | #110 | WebSocket live candles — chart updates without refresh | **UAT-006** |
| PBI-117 | #112 | RSI sub-chart below main chart | **UAT-007** |
| PBI-118 | #113 | Volume sub-chart below main chart | **UAT-007** (combined) |
| PBI-120 | #115 | Multi-interval support (15m, 1h, 4h, 1d) | Update **UAT-002** (now testable) |
| PBI-119 | #114 | Configurable analysis range (100–500000) | Optional UAT |
| PBI-116 | #111 | DB caching (behind-the-scenes) | Not directly user-facing |

---

## Section-by-section plan

### 1. Update existing UAT scenarios

#### 1a. UAT-001: Scan and View Chart Patterns

Only update execution history — the ML service is still separate, no functional change in Sprint 4.

- [ ] Add Sprint 4 execution log row when re-tested
- [ ] No structural changes needed

#### 1b. UAT-002: Toggle Between Chart Timeframes

Update status from `❌ Not tested` to active status — PBI-120 makes this testable.

| Field | Current | Updated |
|---|---|---|
| **Preconditions** | ... with chart displayed | ... with chart displayed (WebSocket connected) |
| **Test steps** | 1–3 as-is | 1. Locate timeframe selector (5m, 15m, 1h, 4h, 1d). 2. Click each. 3. Observe chart redraw within 2s. 4. Verify candle data differs per interval. |
| **Expected result** | ... All timeframes display correctly. | ... All timeframes display correct interval data within 2s. WebSocket continues pushing updates after switch. |
| **Status** | ❌ Not tested | ⏳ To be tested (Sprint 4) |

- [ ] Update UAT-002 preconditions and steps for multi-interval
- [ ] Update UAT-002 status to reflect planned Sprint 4 execution
- [ ] Add PBI-120 link to UAT-002

#### 1c. UAT-003: Export Scan Results

No Sprint 4 changes — functionally unchanged. Update only if re-tested.

- [ ] No changes unless re-executed

#### 1d. UAT-004: Real-Time Price Sidebar

WebSocket migration (PBI-115) improves the underlying mechanism but the user experience is the same (prices update live). Optionally update:
- **Expected result:** ... prices update in real time via WebSocket
- No structural change needed

- [ ] Minor wording update to mention WebSocket
- [ ] Re-test with customer to confirm improvement

#### 1e. UAT-005: Theme Toggle

- [ ] No changes — still passing, no Sprint 4 changes

---

### 2. Add new UAT scenarios for MVP v2 (≥2 required)

#### 2a. UAT-006: Real-Time WebSocket Candle Updates

**Linked PBI:** [PBI-115](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110) — WebSocket migration

```markdown
## UAT-006: Real-Time WebSocket Candle Updates

| Field | Value |
|---|---|
| **ID** | UAT-006 |
| **Title** | Chart candles update in real time via WebSocket |
| **Linked PBI** | [PBI-115](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110) |
| **Preconditions** | Web dashboard is open (`http://localhost:8000`). Bybit API is reachable. |
| **Test steps** | 1. Open the dashboard and select BTCUSDT with 5m interval. 2. Observe that the latest candle updates without manual refresh after 30 seconds. 3. Switch to a different coin (e.g. ETHUSDT). 4. New coin's candles load and continue live-updating. 5. Disconnect network (airplane mode / disable WiFi). 6. Reconnect network. 7. Observe that chart resumes live updates automatically. |
| **Expected result** | Candle chart updates in real time without page refreshes. After reconnect, data flow resumes automatically within 5 seconds. |
| **Status** | ⏳ To be tested |
| **Execution history** | TBD — Sprint 4 UAT session |
```

Features covered:
- Live candle updates without polling ✓
- Coin switch maintains WebSocket ✓
- Reconnection logic ✓ (AC #4 from PBI-115)

#### 2b. UAT-007: RSI and Volume Indicator Sub-Charts

**Linked PBIs:** [PBI-117](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112) — RSI sub-chart, [PBI-118](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113) — Volume sub-chart

```markdown
## UAT-007: RSI and Volume Indicator Sub-Charts

| Field | Value |
|---|---|
| **ID** | UAT-007 |
| **Title** | View RSI and Volume indicator sub-charts |
| **Linked PBI** | [PBI-117](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112), [PBI-118](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113) |
| **Preconditions** | Web dashboard is open with a chart displayed. |
| **Test steps** | 1. Observe the main candlestick chart area. 2. Locate the RSI sub-chart pane below the main chart. 3. Verify RSI line moves between 0–100 as candles change. 4. Locate the Volume sub-chart pane. 5. Verify volume bars change height with trading activity. 6. Switch timeframe (e.g. 5m → 1h). 7. Verify both sub-charts recalculate for new interval data. |
| **Expected result** | RSI and Volume sub-charts display below the main chart. Both recalculate correctly when timeframe changes. |
| **Status** | ⏳ To be tested |
| **Execution history** | TBD — Sprint 4 UAT session |
```

#### 2c. UAT-008: Configure Analysis Range (optional — only if needed for ≥2)

**Linked PBI:** [PBI-119](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/114) — Configurable analysis range

```markdown
## UAT-008: Configure Pattern Analysis Range

| Field | Value |
|---|---|
| **ID** | UAT-008 |
| **Title** | Configure pattern analysis range slider |
| **Linked PBI** | [PBI-119](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/114) |
| **Preconditions** | Web dashboard is open with chart displayed. |
| **Test steps** | 1. Locate the analysis range input in settings. 2. Set range to 500 candles. 3. Click "Analyze Patterns". 4. Verify only 500 candles are highlighted. 5. Set range to 50000. 6. Re-run analysis. 7. Verify all displayed candles are included. |
| **Expected result** | Analysis respects the configured range. UI shows how many candles were analyzed. |
| **Status** | ⏳ To be tested |
```

---

### 3. Prepare for UAT execution session

#### 3a. Pre-session checklist

- [ ] All Sprint 4 PBIs implemented and merged to `main`
- [ ] `v2.0.0` release created/deployed (or running locally)
- [ ] Application is accessible — provide customer with URL or local run instructions
- [ ] Recording tool ready (e.g. Zoom, OBS, Google Meet) — obtain consent
- [ ] UAT scenarios printed/screen-shared for customer to follow
- [ ] Each scenario has clear step-by-step instructions the customer can execute independently
- [ ] Note-taker assigned to capture feedback, bugs, and resulting PBIs

#### 3b. Execution flow (recommended)

1. **UAT-004** (Real-time sidebar) — quick re-test, already passing
2. **UAT-005** (Theme toggle) — quick re-test, already passing
3. **UAT-006** (WebSocket live candles) — new, demonstrate live updates + reconnect
4. **UAT-007** (RSI + Volume sub-charts) — new, customer interacts with sub-charts
5. **UAT-002** (Timeframes) — previously not testable, now available
6. **UAT-001** (Pattern scan) — partial re-test, check if anything changed
7. **UAT-008** (Analysis range) — if applicable and time allows
8. **UAT-003** (Export) — if time allows

#### 3c. During session

- Record the entire session
- Customer must execute steps (not team members reading/navigating)
- Capture:
  - Which steps pass/fail
  - Customer's verbal feedback verbatim
  - Any bugs or unexpected behaviour observed
  - Suggestions for improvement
  - Follow-up PBIs requested by customer

### 4. After UAT session

#### 4a. Update `docs/user-acceptance-tests.md`

- [ ] Update each executed UAT's `Status` field (✅ Pass / ⏳ Partial / ❌ Fail)
- [ ] Add execution log rows for Sprint 4 session
- [ ] Add customer comments and resulting PBIs/issues to each scenario
- [ ] Update UAT-002 status from ❌ Not tested to actual result

#### 4b. Summarize in Week 5 report

In `reports/week5/README.md`, include a UAT summary:

```markdown
### UAT Results (Sprint 4)

| UAT | Title | Result | Notes |
|---|---|---|---|
| UAT-001 | Scan and view chart patterns | ... | ... |
| UAT-002 | Toggle chart timeframes | ... | ... |
| UAT-003 | Export scan results | ... | ... |
| UAT-004 | Real-time price sidebar | ... | ... |
| UAT-005 | Theme toggle | ... | ... |
| UAT-006 | Real-time WebSocket candle updates | ... | NEW — ... |
| UAT-007 | RSI and Volume sub-charts | ... | NEW — ... |

**Key feedback from customer:** ...
**Resulting PBIs/issues:** ...
**What still needs fixing:** ...
```

- [ ] Add UAT summary table to `reports/week5/README.md`

#### 4c. Private recording handling

Per assignment requirements:

- [ ] Do NOT commit recording file or link to the public repository
- [ ] Submit recording link privately through Moodle
- [ ] Ensure link is accessible to instructors
- [ ] If UAT shares a recording with Sprint Review, note Moodle-only timecodes

#### 4d. Create PBIs for discovered issues

- [ ] Create GitHub issues for any bugs or feature requests discovered during UAT
- [ ] Assign to appropriate milestone (Sprint 4 if still open, or Product Backlog)

---

## Checklist — all actions

### Before UAT session
- [ ] All Sprint 4 PBIs implemented and merged
- [ ] MVP v2 deployed/accessible
- [ ] Recording tool ready, consent obtained
- [ ] UAT scenarios finalised in `docs/user-acceptance-tests.md`
- [ ] Customer invited, session scheduled

### UAT session
- [ ] Record the full session
- [ ] Customer executes each scenario independently
- [ ] Note-taker captures feedback verbatim
- [ ] All 5 existing + ≥2 new scenarios executed

### After UAT session
- [ ] `docs/user-acceptance-tests.md` — update all executed scenario statuses
- [ ] `docs/user-acceptance-tests.md` — add Sprint 4 execution log rows
- [ ] `docs/user-acceptance-tests.md` — add customer comments and follow-up PBIs
- [ ] `docs/user-acceptance-tests.md` — update UAT-002 (now testable with multi-interval)
- [ ] UAT summary included in `reports/week5/README.md`
- [ ] New issues created for bugs/feedback discovered
- [ ] Recording NOT committed publicly — submitted via Moodle
- [ ] Timecodes noted if UAT+SprintReview share one recording
