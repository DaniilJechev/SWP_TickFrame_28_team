# Sprint Review Summary — Sprint 5 (Assignment 6, Week 6)

---

**Date:** 2026-07-10
**Participants / Roles:** Nikolay Kuzmin (Customer), Andrew Alexeev (Customer), Fedor Kozhevnikov (Product Owner / Full-Stack), Daniel Zhechev (Scrum Master / ML Engineer)
**Meeting type:** Sprint Review / Architecture Review (Combined)

---

## Sprint Goal Reviewed

Produce stable trial/handover-candidate release — RSI implementation, documentation polish, handover prep, customer trial. ([Sprint 5 Milestone](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/6))

## Delivered Increment Discussed

| PBI | Issue | Status |
|---|---|---|
| RSI indicator sub-chart (re-scoped to library integration) | [#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112) | Done — integrated open-source library with ~445 technical indicators; RSI + all indicators searchable |
| Volume sub-chart | [#113](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/113) | Done — carried forward, working |
| Fear & Greed Index | — | Done — added as alternative sentiment indicator |
| ML pattern detection (4 of 6 patterns) | — | Done — Head & Shoulders, Double Top, Double Bottom, Flags; 2 patterns remaining |
| Drawing toolbar integration | — | Done — modular toolbar on chart |
| 10 cryptocurrencies with configured timeframes | — | Done — all pairs available with multi-interval support |
| Customer-facing documentation review and update | [#177](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/177) | In progress — deployment docs exist, need expansion for handover |
| Create/update CONTRIBUTING.md and AGENTS.md | [#178](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/178) | Done |
| Create/update docs/customer-handover.md | [#179](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/179) | In progress |
| Week 6 trial release and deployment | [#180](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/180) | Partial — VM deployed with previous version; not updated with latest increment |

## Addressed Customer Feedback (Sprint 4)

| Previous Feedback (Week 5) | How Addressed |
|---|---|
| Implement RSI using specialised library | Done — integrated open-source technical indicator library (~445 indicators); RSI enabled by default, users can search/enable any indicator |
| Add pattern-type filtering + confidence threshold controls | Not yet implemented — deferred to Sprint 6 |
| Fix UI glitches in chart switching / element movement | Partially addressed — not explicitly demonstrated in this session |
| Add additional coin metrics (24h change, 5m change) | Not demonstrated — low priority |
| ML accuracy improvement (F2 ≥ 0.55 threshold) | Ongoing — 4 of 6 patterns delivered; accuracy discussed with customer |

## UAT Results

| Scenario | Result |
|---|---|
| UAT-001: Scan and view chart patterns | ⏳ Partial — 4/6 patterns working; 2 ML patterns + filtering remaining |
| UAT-002: Toggle between chart timeframes | ⏳ Partial — switching works but ML detection limited to 5m timeframe |
| UAT-003: Export scan results | ⏳ Not demonstrated |
| UAT-004: Real-time price sidebar | ✅ Pass — WebSocket live prices continue working |
| UAT-005: Theme toggle | ✅ Pass — unchanged, still passing |
| UAT-006: WebSocket real-time candles | ✅ Pass — live updates from Bybit/Binance, DB cache fallback |
| UAT-007: Volume indicator sub-chart | ✅ Pass — working with colored bars |
| UAT-008: Configure pattern analysis range | ✅ Pass — slider with configurable range (100–500000) |
| UAT-009: Sidebar resize and UI cleanliness | ⏳ Not demonstrated |

## Quality Evidence Discussed

- **Technical Indicator Library:** Open-source library with ~445 indicators integrated. Library computes locally from candle data (~55,000 candles processed near-instantly). No external API calls — pure local computation. Customer confirmed approach acceptable ("that's an improvement").
- **ML Pattern Detection:** 4 of 6 trading patterns operational (Head & Shoulders, Double Top, Double Bottom, Flags). All models trained on 5-minute timeframe only — multi-timeframe support deferred due to data annotation bottleneck. Customer accepted the reasoning ("better one properly trained model than several unreliable").
- **ML Architecture:** Separate microservice container; `AnalyzeCandles` API includes `timeFrame` parameter for future expansion; request validation rejects unsupported timeframes.
- **CI Pipeline:** Assumed passing (not explicitly demonstrated in this session).
- **Deployment:** Docker Compose starts backend + ML service. VM deployed with previous version; updated deployment pending remaining work.

## Customer Feedback

**Positive:**
- Significant progress since previous review — most functionality complete
- Indicator library integration considered an improvement over manual RSI implementation
- ML pattern detection approach and single-timeframe limitation accepted with clear rationale
- Overall direction satisfactory; remaining work focused on delivery readiness rather than new features

**Critical:**
- PostgreSQL required, not SQLite — architecture doesn't match earlier agreement
- Database must run as a dedicated Docker container, not outside the deployment
- Database credentials must be configurable via environment variables
- Schema must be initialized via migrations, not application-created tables
- Docker Compose must include ALL services (backend, ML, database, etc.)
- Deployment must be fully reproducible with a single `docker compose up` command
- Clear handover documentation needed with prerequisites and setup requirements

**Requested:**
- Updated deployment link once remaining ML patterns are completed
- Architecture review before final handover (env vars, DB, deployment config)

## Approvals and Requested Changes

- Sprint increment approach approved
- Customer requested:
  1. Complete remaining 2 ML patterns (6 total)
  2. Implement pattern-type filtering + confidence threshold controls
  3. Migrate from SQLite to PostgreSQL 17
  4. Add PostgreSQL container to Docker Compose
  5. Introduce database migrations (no application-created tables)
  6. Ensure fully reproducible deployment from documentation

## Remaining Gaps and Risks

- **SQLite → PostgreSQL migration:** Customer considers this critical. Current architecture uses SQLite during development despite earlier agreement on PostgreSQL. Infrastructure change required: new container, env-var credentials, migrations framework.
- **ML patterns incomplete:** 4 of 6 delivered; 2 remaining. Pattern filtering not implemented. Both scheduled for Sprint 6.
- **Missing DB container in Docker Compose:** Only backend and ML service are containerized. Customer expects all services including database to be part of the deployment.
- **Deployment out of date:** VM has previous version; not updated with latest increment.
- **Handover documentation incomplete:** Deployment prerequisites and setup instructions need expansion.
- **Single-timeframe ML:** Only 5m model available. Multi-timeframe support deferred, but customer accepted the trade-off.

## Action Points

| Action | Owner | Due |
|---|---|---|
| Complete remaining 2 ML patterns (6 total) | Daniel Zhechev | Sprint 6 |
| Implement pattern-type filtering + confidence threshold | Fedor Kozhevnikov | Sprint 6 |
| Migrate SQLite → PostgreSQL 17 | Fedor Kozhevnikov | Sprint 6 |
| Add PostgreSQL container to Docker Compose | Fedor Kozhevnikov | Sprint 6 |
| Introduce database migrations (remove application-created tables) | Fedor Kozhevnikov | Sprint 6 |
| Update VM deployment with latest increment | Fedor Kozhevnikov | Sprint 6 |
| Expand handover documentation with prerequisites and setup steps | Fedor Kozhevnikov | Sprint 6 |
| Review and finalize env-var configuration (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD) | Fedor Kozhevnikov | Sprint 6 |
| Architecture review walk-through for customer before final handover | Fedor Kozhevnikov | Sprint 6 |

## Product Backlog Updates

- **[#201 PBI-130](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/201):** PostgreSQL infrastructure migration — SQLite → PostgreSQL 17 container, env-var credentials, database migrations (5 SP, Sprint 6)
- **[#202 PBI-131](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/202):** Pattern filtering and confidence threshold controls (3 SP, Sprint 6)
- **PBI-129 (Customer-facing documentation review):** Expanded scope — now includes deployment prerequisites and full reproducibility
- **Priority updated:** ML pattern completion + pattern filtering remain critical; DB infrastructure migration elevated to critical
