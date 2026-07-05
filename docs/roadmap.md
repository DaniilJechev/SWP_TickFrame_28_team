# Project Roadmap

## Sprint 1 — Repository & Process Foundation

| Field | Value |
|---|---|
| **Milestone** | [Sprint 1](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/1) |
| **Dates** | Week 2 |
| **Goal** | Establish repository structure, licensing, and team workflow conventions. |
| **Focus** | Repo hygiene, environment scaffold, PR/issue process |

**Planned items:**

- [#007](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/7) US-03 — Public repo with MIT license
- [#010](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/10) US-04 — Reusable `.env` template
- [#012](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/12) US-05 — PR template for review consistency

---

## Sprint 2 — MVP v1 Core Features

| Field | Value |
|---|---|
| **Milestone** | [Sprint 2](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/2) |
| **Dates** | Week 3 |
| **Goal** | Deliver a working MVP v1 increment with real ML pattern detection and basic UI features. |
| **Focus** | XGBoost model integration, chart pattern detection, theme toggle |

**Planned items:**

- [#005](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/5) US-01 — Detect chart patterns with ML support
- [#016](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/16) US-13 — Toggle between day and night theme

---

## Sprint 3 — v1.1.0 Drawing Tools + Quality Gates

| Field | Value |
|---|---|
| **Milestone** | [Sprint 3 — Assignment 4 — v1.2.0](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/3) |
| **Dates** | Week 4 (2026-06-22 – 2026-06-29) |
| **Goal** | Replace mock pattern analyzer with real ML, deliver drawing toolbar, and establish quality foundations. |
| **Focus** | Drawing tools, SQLite persistence, pattern analysis UI, quality gates, CI, test coverage |

**Planned items:**

- [#62](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/62) PBI-101 — Drawing Toolbar Engine (13 tools)
- [#64](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/64) PBI-102 — Advanced Drawing Tools (Fibonacci, Price Range %, Text)
- [#63](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/63) PBI-103 — Redact Mode + Selection + Drag
- [#66](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/66) PBI-104 — Undo System
- [#65](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/65) PBI-105 — Per-Drawing Settings Panel
- [#67](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/67) PBI-106 — SQLite Persistence
- [#68](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/68) PBI-107 — 50k Candle Support
- [#69](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/69) PBI-108 — WebSocket Heartbeat
- [#70](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/70) PBI-109 — Pattern Analysis UI
- [#61](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/61) PBI-110 — Coin Sidebar Enhancements
- [#71](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/71) PBI-111 — Theme Persistence
- [#79](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/79) QR-001 — Performance Requirement
- [#80](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/80) QR-002 — Security Requirement
- [#81](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/81) QR-003 — Accuracy Requirement
- [#82](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/82) QRT-001 — Performance Test Automation
- [#83](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/83) QRT-002 — Security Test Automation
- [#84](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/84) QRT-003 — Accuracy Test Automation
- [#85](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/85) — Test Coverage ≥30%
- [#86](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/86) — CI Pipeline Setup
- [#72](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/72) — Bug Fixes Batch

---

## Sprint 4 — MVP v2 (Assignment 5)

| Field | Value |
|---|---|
| **Milestone** | [Sprint 4](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/5) |
| **Dates** | Week 5 (2026-06-30 – 2026-07-06) |
| **Goal** | Deliver MVP v2 by addressing all critical customer feedback from Sprint 3: DB caching, Volume sub-chart, UI redesign, drawing toolbar modernization, multi-interval support, analysis range fix, and WebSocket live data pipeline. RSI deferred to Sprint 5. |
| **Focus** | Customer-driven improvements, architecture hardening, real-time data pipeline, UI/UX overhaul |

**Completed PBIs:**

- [#122 PBI-121](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/122) — Multi-interval database caching & instant chart loading (Critical) ✅
- [#123 PBI-122](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/123) — Configurable candle analysis limit (Medium) ✅
- [#124 PBI-123](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/124) — ML pattern visualization with merged segments (High) ✅
- [#125 PBI-124](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/125) — ML inference performance optimization XGBoost (Critical) ✅
- [#126 PBI-125](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/126) — UI cleanup & sidebar resize (Medium) ✅
- [#158 PBI-126](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/158) — UI redesign: coin icons, Fear & Greed Index, sidebar overhaul (Medium) ✅
- [#159 PBI-127](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/159) — Drawing toolbar re-architecture with lightweight-charts-drawing library (High) ✅
- [#113 PBI-118](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113) — Volume sub-chart implementation (High) ✅
- [#110 PBI-115](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/110) — WebSocket subscription migration (Critical) ✅

**Deferred to Sprint 5:**
- [#112 PBI-117](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112) — RSI indicator sub-chart (High) — rendering complexity with current library

---

## Sprint 5 — Planned (Next)

| Field | Value |
|---|---|
| **Goal** | RSI indicator implementation, frontend polish, remaining A5 deliverables |
| **Focus** | Real-time data pipeline completion, indicator expansion, testing coverage |

**Planned items:**
- [#112 PBI-117](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112) — RSI indicator sub-chart (High)
- Volume sub-chart persistence & polish (High)
- US-12 — Crypto Fear and Greed Index (partial done — API connected, UI widget needed)
- US-14 — Customize chart colors in settings
- Frontend JS test coverage
- QRT re-design for updated QR-003 threshold (F2 ≥ 55%)

---

## Backlog — Unscheduled

| Issue | Story | Priority |
|---|---|---|
| [#006](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/6) | US-02 — Scan results in report-friendly format | Must Have |
| [#009](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/9) | US-09 — View chart for different time periods | Should Have |
| [#022](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/22) | US-08-1 — Customizable figure colors | Could Have |
