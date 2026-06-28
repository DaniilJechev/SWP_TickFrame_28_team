# User Acceptance Tests

> **Template — Assignment 4, Part 10**
>
> Instructions:
> - Maintain at least **3 active end-user-facing UAT scenarios**
> - Each scenario: stable ID, description, preconditions, test steps, expected results, status, execution history
> - Week 4: record execution results for at least 3 scenarios
> - Customer must execute scenarios during a recorded session
> - UAT scenarios are **maintained product assets** — keep them updated

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

| Field | Value |
|---|---|
| **ID** | UAT-002 |
| **Title** | Toggle between chart timeframes |
| **Preconditions** | Web dashboard is open (`http://localhost:8000`) with chart displayed |
| **Test steps** | 1. Locate timeframe selector (5m, 15m, 1h, 4h, 1d) 2. Click each timeframe 3. Observe chart redraw for each selection |
| **Expected result** | Chart loads new candle data for each timeframe within 2 seconds. All timeframes display correctly. |
| **Status** | ❌ Not tested |
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
| **Expected result** | Sidebar displays 10 pairs with live prices that update at least once per minute. |
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

## UAT Execution Log

| Date | UAT ID | Result | Tester | Notes |
|---|---|---|---|---|---|
| 2026-06-26 | UAT-001 | ⏳ Partial | Customer | Markers/labels shown; ML model as separate microservice. Customer confirmed the visualization approach is acceptable. |
| 2026-06-26 | UAT-002 | ❌ Not tested | Customer | Only 5m timeframe available. Deferred to Sprint 4. |
| 2026-06-26 | UAT-003 | ⏳ Not demonstrated | Customer | Report export not covered in session. |
| 2026-06-26 | UAT-004 | ✅ Pass | Customer | 10 pairs with live updates — confirmed working. |
| 2026-06-26 | UAT-005 | ✅ Pass | Customer | Theme toggle works, persists across reload. Customer satisfied. |

> After the UAT session, update this table with actual results.
> The customer must execute the scenarios — not the team.
