# User Acceptance Tests

> **Maintained product asset — Assignment 4 (Part 10) / Assignment 5 (Part 8)**
>
> Instructions:
> - Maintain at least **3 active end-user-facing UAT scenarios** (current: 7)
> - Each scenario: stable ID, description, preconditions, test steps, expected results, status, execution history
> - Customer must execute scenarios during a recorded session
> - UAT scenarios are **maintained product assets** — keep them updated
> - Sprint 4 adds UAT-006 (WebSocket live candles) and UAT-007 (RSI/Volume sub-charts)

---

## UAT-001: Scan and View Chart Patterns

| Field | Value |
|---|---|
| **ID** | UAT-001 |
| **Title** | Scan and view chart patterns |
| **Preconditions** | Application is running (Docker or local) on a machine with internet access |
| **Test steps** | 1. Open terminal 2. Run `python -m tickframe scan --symbol BTCUSDT --interval 5m --limit 100` 3. Wait for scan completion 4. Run `python -m tickframe serve` 5. Open browser to `http://localhost:8000` 6. Observe chart with pattern markers |
| **Expected result** | Chart displays candlestick data with detected pattern markers. Clicking a marker shows analysis details. |
| **Status** | ⏳ Partial |
| **Execution history** | 2026-06-26 — ⏳ Partial — UI displays markers and labels for detected patterns. ML model runs as separate microservice; end-to-end integration not yet complete. Customer reviewed the candidate visualization and confirmed the approach is acceptable. |

---

## UAT-002: Toggle Between Chart Timeframes

**Linked PBI:** [PBI-120](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/115) — Multi-interval support

| Field | Value |
|---|---|
| **ID** | UAT-002 |
| **Title** | Toggle between chart timeframes |
| **Preconditions** | Web dashboard is open (`http://localhost:8000`) with chart displayed (WebSocket connected) |
| **Test steps** | 1. Locate timeframe selector (5m, 15m, 1h, 4h, 1d) 2. Click each timeframe 3. Observe chart redraw within 2s 4. Verify candle data differs per interval |
| **Expected result** | Chart loads new candle data for each timeframe within 2 seconds. All timeframes display correct interval data. WebSocket continues pushing live updates after switch. |
| **Status** | ⏳ To be tested (Sprint 4) |
| **Execution history** | 2026-06-26 — ❌ Not tested — Only 5m timeframe available in Sprint 3. Customer was informed this is scheduled for Sprint 4. |

---

## UAT-003: Export Scan Results

| Field | Value |
|---|---|
| **ID** | UAT-003 |
| **Title** | Export scan results |
| **Preconditions** | Scan data is available in cache |
| **Test steps** | 1. Run `python -m tickframe scan --symbol BTCUSDT` 2. Run `python -m tickframe report --output report.md` 3. Open `report.md` in a text editor |
| **Expected result** | `report.md` contains formatted scan results with candle data and detected patterns. The file is valid Markdown. |
| **Status** | ⏳ Not demonstrated |
| **Execution history** | 2026-06-26 — ⏳ Not demonstrated — Scan report generation was not covered during the review session. Customer did not request a demonstration. |

---

## UAT-004: Real-Time Price Sidebar

| Field | Value |
|---|---|
| **ID** | UAT-004 |
| **Title** | Real-time price sidebar |
| **Preconditions** | Web dashboard is open |
| **Test steps** | 1. Observe sidebar on the left 2. Check that 10 trading pairs are listed 3. Check that prices are updating in real time |
| **Expected result** | Sidebar displays 10 pairs with live prices that update in real time via WebSocket. |
| **Status** | ✅ Pass |
| **Execution history** | 2026-06-26 — ✅ Pass — Sidebar displays 10 trading pairs with live prices updating via backend push. Customer confirmed real-time updates work correctly. |

---

## UAT-005: Theme Toggle

| Field | Value |
|---|---|
| **ID** | UAT-005 |
| **Title** | Theme toggle (day/night) |
| **Preconditions** | Web dashboard is open |
| **Test steps** | 1. Locate theme toggle button 2. Click to switch to night theme 3. Click to switch back to day theme 4. Repeat on different pages |
| **Expected result** | All UI elements switch between day and night themes consistently. Text remains readable in both themes. |
| **Status** | ✅ Pass |
| **Execution history** | 2026-06-26 — ✅ Pass — Theme toggle works correctly. Light/dark themes persist across page reload (SQLite). Drawing colors adapt to active theme. Customer confirmed satisfaction. |

---

## UAT-006: Real-Time WebSocket Candle Updates

**Linked PBI:** [PBI-115](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110) — WebSocket subscription migration

| Field | Value |
|---|---|
| **ID** | UAT-006 |
| **Title** | Chart candles update in real time via WebSocket |
| **Preconditions** | Web dashboard is open (`http://localhost:8000`). Bybit API is reachable. |
| **Test steps** | 1. Open the dashboard and select BTCUSDT with 5m interval 2. Observe that the latest candle updates without manual refresh after 30 seconds 3. Switch to a different coin (e.g. ETHUSDT) 4. New coin's candles load and continue live-updating 5. Disconnect network (airplane mode / disable WiFi) 6. Reconnect network 7. Observe that chart resumes live updates automatically |
| **Expected result** | Candle chart updates in real time without page refreshes. After reconnect, data flow resumes automatically within 5 seconds. |
| **Status** | ⏳ To be tested (Sprint 4) |
| **Execution history** | TBD — Sprint 4 UAT session |

---

## UAT-007: RSI and Volume Indicator Sub-Charts

**Linked PBIs:** [PBI-117](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112) — RSI sub-chart, [PBI-118](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113) — Volume sub-chart

| Field | Value |
|---|---|
| **ID** | UAT-007 |
| **Title** | View RSI and Volume indicator sub-charts |
| **Preconditions** | Web dashboard is open with a chart displayed |
| **Test steps** | 1. Observe the main candlestick chart area 2. Locate the RSI sub-chart pane below the main chart 3. Verify RSI line moves between 0–100 as candles change 4. Locate the Volume sub-chart pane 5. Verify volume bars change height with trading activity 6. Switch timeframe (e.g. 5m → 1h) 7. Verify both sub-charts recalculate for new interval data |
| **Expected result** | RSI and Volume sub-charts display below the main chart. Both recalculate correctly when timeframe changes. |
| **Status** | ⏳ To be tested (Sprint 4) |
| **Execution history** | TBD — Sprint 4 UAT session |

---

## UAT Execution Log

| Date | UAT ID | Result | Tester | Notes |
|---|---|---|---|---|
| 2026-06-26 | UAT-001 | ⏳ Partial | Customer | Markers/labels shown; ML model as separate microservice. Customer confirmed the visualization approach is acceptable. |
| 2026-06-26 | UAT-002 | ❌ Not tested | Customer | Only 5m timeframe available. Deferred to Sprint 4. |
| 2026-06-26 | UAT-003 | ⏳ Not demonstrated | Customer | Report export not covered in session. |
| 2026-06-26 | UAT-004 | ✅ Pass | Customer | 10 pairs with live updates — confirmed working. |
| 2026-06-26 | UAT-005 | ✅ Pass | Customer | Theme toggle works, persists across reload. Customer satisfied. |
| TBD | UAT-002 | ⏳ To be tested | Customer | Multi-interval now available (PBI-120). Sprint 4 session. |
| TBD | UAT-006 | ⏳ To be tested | Customer | WebSocket live candles (PBI-115). Sprint 4 session. |
| TBD | UAT-007 | ⏳ To be tested | Customer | RSI/Volume sub-charts (PBI-117, PBI-118). Sprint 4 session. |

