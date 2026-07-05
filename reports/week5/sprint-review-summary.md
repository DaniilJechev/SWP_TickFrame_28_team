# Sprint Review Summary — Sprint 4 (Assignment 5)

---

**Date:** 2026-07-03
**Participants / Roles:** Nikolay Kuzmin (Customer), Fedor Kozhevnikov (Product Owner / Full-Stack), Daniel Zhechev (Scrum Master / ML Engineer)
**Meeting type:** Sprint Review / UAT (Combined)

---

## Sprint Goal Reviewed

Deliver MVP v2 — WebSocket migration, DB caching, RSI/Volume sub-charts, multi-interval support, configurable analysis range. ([Sprint 4 Milestone](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/5))

## Delivered Increment Discussed

| PBI | Issue | Status |
|---|---|---|
| WebSocket subscription migration | [#110](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110) | Done — live candles from Bybit/Binance |
| SQLite candle caching (3-tier) | [#111](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/111) | Done — memory → DB → exchange |
| RSI sub-chart | [#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112) | Partial — manual implementation failed; re-scoped to library |
| Volume sub-chart | [#113](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113) | Done — bars change with trading activity |
| Configurable analysis range | [#114](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/114) | Done — slider, ≤50k candles |
| Multi-interval support | [#115](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/115) | Done — 5m/15m/1h/4h/1d |

Also demonstrated: Fear & Greed Index, revamped drawing toolbar, ML reports with descriptions + confidence scores (~57% accuracy), 24h price change icon, WebSocket live sidebar updates (1s intervals).

## Addressed Customer Feedback (Sprint 3)

| Previous Feedback (Week 3/4) | How Addressed |
|---|---|
| Migrate REST polling → WebSocket subscription | Implemented — Bybit + Binance WebSocket channels ([#110](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110)) |
| Implement database caching for candles | 3-tier cache (memory → SQLite → exchange) ([#111](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/111)) |
| Add RSI indicator sub-chart | Partial — not rendering; re-implementation using specialised library planned |
| Add Volume sub-chart | Done ([#113](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113)) |
| Reduce analysis range to 50k | Configurable slider, ≤50k limit ([#114](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/114)) |
| Multi-interval support (15m, 1h, 4h, 1d) | Implemented ([#115](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/115)) |
| ML reports displayed properly | Done — descriptions and confidence scores shown |

## UAT Results

| Scenario | Result |
|---|---|
| UAT-001: Scan and view chart patterns | ⏳ Partial — ML reports displayed; pattern filtering requested |
| UAT-002: Toggle between chart timeframes | ⏳ Partial — switching works; UI glitches |
| UAT-003: Export scan results | ⏳ Not demonstrated |
| UAT-004: Real-time sidebar | ✅ Pass — WebSocket live prices, 24h change icon |
| UAT-005: Theme toggle | ✅ Pass — unchanged, still passing |
| UAT-006: WebSocket real-time candles | ✅ Pass — DB cache + WebSocket updates |
| UAT-007: RSI/Volume sub-charts | ⏳ Partial — Volume works; RSI not working |

## Quality Evidence Discussed

- **WebSocket migration:** Live candles from Bybit and Binance with DB cache fallback. Historical data served from database, live updates pushed via WebSocket.
- **3-tier cache:** Memory → SQLite → exchange. Revisit loads are near-instant. Drawings preserved on refresh.
- **CI pipeline:** All checks passing (ruff, mypy, pytest+cov, bandit, Lychee, frontend JS tests).
- **Architecture documentation:** Component, sequence, and deployment diagrams with 3 ADRs (WebSocket, SQLite, Microservice).
- **ML microservice:** Separate container with XGBoost inference for Head & Shoulders patterns. Double Top/Double Bottom in development.

## Customer Feedback

**Positive:**
- WebSocket live updates appreciated — real-time without refreshes
- Volume sub-chart confirmed working
- Multi-interval switching functional (though needs polish)
- Analysis range slider well-received
- Revamped drawing toolbar visually better
- Overall sprint direction satisfactory

**Critical:**
- RSI is not optional — it was in the initial requirements and must be implemented
- Pattern-type filtering and confidence threshold controls needed — add to side panel
- UI glitches during timeframe switching and element movement need fixing

**Optional:**
- Additional coin metrics (24h change, 5m change) would be useful if time permits

## Approvals and Requested Changes

- Sprint increment approach approved
- Customer requested:
  1. Implement RSI using specialised library
  2. Add pattern-type filtering + confidence threshold controls
  3. Fix UI glitches
  4. Add more coin metrics (if time permits)

## Remaining Gaps and Risks

- **RSI sub-chart not delivered:** Customer considers this critical. Manual rendering approach failed; re-implementation using specialised library required.
- **ML accuracy ~57%:** QR-003 threshold (F2 ≥ 0.55) met but barely exceeded. Double Top/Double Bottom model in development may improve overall accuracy.
- **UI polish:** Glitches visible when switching timeframes or moving elements. Needs refinement.
- **Analysis results not persisted:** Database storage for scan results not yet implemented.
- **ML detection limited to 5m timeframe:** Multi-interval chart switching works, but pattern detection only runs on 5m data.

## Action Points

| Action | Owner | Due |
|---|---|---|
| Implement RSI using specialised library | Fedor Kozhevnikov | Sprint 5 |
| Add pattern-type filtering + confidence threshold to side panel | Fedor Kozhevnikov | Sprint 5 |
| Fix UI glitches in chart switching / element movement | Fedor Kozhevnikov | Sprint 5 |
| Save analysis results to database | Fedor Kozhevnikov | Sprint 5 |
| Add additional coin metrics (24h change, 5m change) | Fedor Kozhevnikov | Sprint 5 (low priority) |
| Continue Double Top / Double Bottom ML model | Daniel Zhechev | Next 2 weeks |
| Port pattern detection to additional timeframes | Daniel Zhechev | Next 2 weeks |

## Product Backlog Updates

- **PBI-117 (RSI sub-chart):** Re-scoped — switch from manual implementation to specialised library
- **New PBI:** Pattern-type filtering + confidence threshold controls (customer request)
- **New PBI:** Additional coin metrics in sidebar (customer suggestion)
- **New PBI:** UI polish and glitch fixes (technical debt)
- **Priority updated:** RSI re-scoped to critical — customer insists on delivery
