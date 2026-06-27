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
| **Status** | ✅ Pass / ❌ Fail / ⏳ Blocked |
| **Execution history** | _[Date — Result — Notes]_ |

---

## UAT-002: Toggle Between Chart Timeframes

| Field | Value |
|---|---|
| **ID** | UAT-002 |
| **Title** | Toggle between chart timeframes |
| **Preconditions** | Web dashboard is open (`http://localhost:8000`) with chart displayed |
| **Test steps** | 1. Locate timeframe selector (5m, 15m, 1h, 4h, 1d) 2. Click each timeframe 3. Observe chart redraw for each selection |
| **Expected result** | Chart loads new candle data for each timeframe within 2 seconds. All timeframes display correctly. |
| **Status** | ✅ Pass / ❌ Fail / ⏳ Blocked |
| **Execution history** | _[Date — Result — Notes]_ |

---

## UAT-003: Export Scan Results

| Field | Value |
|---|---|
| **ID** | UAT-003 |
| **Title** | Export scan results |
| **Preconditions** | Scan data is available in cache |
| **Test steps** | 1. Run `python -m tickframe scan --symbol BTCUSDT` 2. Run `python -m tickframe report --output report.md` 3. Open `report.md` in a text editor |
| **Expected result** | `report.md` contains formatted scan results with candle data and detected patterns. The file is valid Markdown. |
| **Status** | ✅ Pass / ❌ Fail / ⏳ Blocked |
| **Execution history** | _[Date — Result — Notes]_ |

---

## UAT-004: Real-Time Price Sidebar

| Field | Value |
|---|---|
| **ID** | UAT-004 |
| **Title** | Real-time price sidebar |
| **Preconditions** | Web dashboard is open |
| **Test steps** | 1. Observe sidebar on the left 2. Check that 10 trading pairs are listed 3. Check that prices are updating in real time |
| **Expected result** | Sidebar displays 10 pairs with live prices that update at least once per minute. |
| **Status** | ✅ Pass / ❌ Fail / ⏳ Blocked |
| **Execution history** | _[Date — Result — Notes]_ |

---

## UAT-005: Theme Toggle

| Field | Value |
|---|---|
| **ID** | UAT-005 |
| **Title** | Theme toggle (day/night) |
| **Preconditions** | Web dashboard is open |
| **Test steps** | 1. Locate theme toggle button 2. Click to switch to night theme 3. Click to switch back to day theme 4. Repeat on different pages |
| **Expected result** | All UI elements switch between day and night themes consistently. Text remains readable in both themes. |
| **Status** | ✅ Pass / ❌ Fail / ⏳ Blocked |
| **Execution history** | _[Date — Result — Notes]_ |

---

## UAT Execution Log

| Date | UAT ID | Result | Tester | Notes |
|---|---|---|---|---|
| _[YYYY-MM-DD]_ | UAT-001 | ✅ Pass | _[Customer name]_ | _[Notes]_ |
| _[YYYY-MM-DD]_ | UAT-002 | ❌ Fail | _[Customer name]_ | _[e.g., Timeframe selector missing 1h option]_ |
| _[YYYY-MM-DD]_ | UAT-003 | ✅ Pass | _[Customer name]_ | _[Notes]_ |
| _[YYYY-MM-DD]_ | UAT-004 | ⏳ Blocked | _[Customer name]_ | _[e.g., Feature not implemented yet]_ |
| _[YYYY-MM-DD]_ | UAT-005 | ✅ Pass | _[Customer name]_ | _[Notes]_ |

> After the UAT session, update this table with actual results.
> The customer must execute the scenarios — not the team.
