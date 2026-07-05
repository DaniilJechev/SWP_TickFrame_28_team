# Reflection — Assignment 5

## Learning Points

_What the team learned from:_

### Documenting Architecture

Creating PlantUML diagrams-as-code taught the team how to decompose a system into coherent views (static, dynamic, deployment). The component diagram forced explicit documentation of inter-component protocols (HTTP REST, WebSocket, SQL, Docker DNS). The sequence diagram illustrated the 3-tier cache flow (memory → DB → exchange) in a way that code alone cannot. The deployment diagram clarified the single-host Docker Compose model and its constraints (single point of failure, SQLite write serialisation). Maintaining diagrams in lockstep with code is challenging but essential — the architecture README now serves as a single-entry index linking views, ADRs, and quality requirements.

### Recording ADRs

The ADR template (Context → Decision → Consequences) made the team articulate trade-offs explicitly:
- **ADR-001 (WebSocket):** REST polling was simpler but wasteful; WebSocket adds complexity but delivers real-time data with lower latency.
- **ADR-002 (SQLite):** PostgreSQL would scale better but SQLite's zero-config deployment aligns with the single-user/small-team target.
- **ADR-003 (Microservice):** A monolith would simplify deployment, but isolating ML dependencies in a separate container enables independent development cycles.

Linking each ADR to quality requirements created traceability between "why we chose X" and "how it helps meet QR-Y." This traceability was directly referenced during the Sprint Review.

### Refining the Workflow

The development-process document revealed undocumented conventions: branch naming (issue-number-short-description), PR size expectations, and the definition of "done" for documentation vs. code changes. Writing it down with a Mermaid gitGraph visualised the workflow for all team members. Adding frontend JS testing (Vitest + ESLint) to CI ensures frontend changes are validated automatically.

### Managing Configuration

The transition from hardcoded thresholds to `.env`-based configuration and the 3-tier cache (memory → SQLite → exchange) demonstrated how configuration management directly affects performance. The configurable analysis range slider (≤50k candles) was well-received by the customer — a direct response to the Sprint 3 feedback that 150k was excessive.

### Delivering MVP v2

MVP v2 delivered 5 of 6 planned PBIs. The WebSocket migration was the most impactful change — it directly addressed the customer's top complaint. SQLite caching made revisit loads near-instant. Multi-interval support unblocked a UAT scenario deferred since Sprint 3. The RSI sub-chart failure was a learning point: assuming library capabilities without validation led to last-minute re-scoping.

### Reviewing the Increment with the Customer

The Sprint Review confirmed that regular customer feedback is invaluable. The RSI issue — considered "optional" by the team — was immediately flagged as critical by the customer. The pattern filtering request was another feature the team hadn't anticipated. These gaps would have been caught earlier with more frequent check-ins.

---

## Validated Assumptions

| Assumption | Status | Evidence |
|---|---|---|
| WebSocket migration reduces perceived latency | ✅ Confirmed | Customer confirmed real-time updates without refresh is the right approach |
| SQLite caching measurably improves load times | ✅ Confirmed | Revisit loads are near-instant; daily data served entirely from DB |
| Multi-interval support is achievable in one sprint | ✅ Confirmed | 5m/15m/1h/4h/1d all working; chart data differs per interval |
| Sprint 4 scope (18 SP) was achievable in one week | ⚠️ Partial | 5 of 6 PBIs delivered; RSI underestimated at 3 SP |
| TradingView library can render custom indicators easily | ❌ Rejected | Manual RSI overlay failed; specialised library required |
| ML model with 800 patterns can achieve F2 ≥ 0.55 | ✅ Confirmed | Current accuracy ~57% meets the threshold |

---

## Friction and Gaps

- **RSI implementation failed with manual approach.** The team assumed the charting library would support custom overlays. When it didn't, attempting a custom implementation instead of switching library cost time. Solution: validate library capabilities before committing to an implementation strategy.

- **Frontend JS still has zero test coverage for DOM/chart interactions.** Vitest with jsdom can cover basic logic, but canvas-based chart rendering (Lightweight Charts, drawing overlay) is inherently hard to test. This remains a gap.

- **Architecture diagrams-as-code learning curve.** PlantUML syntax for advanced features (alt/opt fragments, component stereotypes) required iterative refinement. SVG rendering from `.puml` is not yet automated in CI.

- **QR-003 threshold (F2 ≥ 0.55) is barely met.** Current ML accuracy at ~57% leaves little margin. The Double Top/Double Bottom model may improve this, but training data labelling is slow.

- **No test coverage for WebSocket reconnection logic.** The UAT noted reconnection was not explicitly tested. This should be added as a QRT.

---

## Planned Response

| Issue | Planned Action | Links |
|---|---|---|
| RSI sub-chart not working | Re-implement using specialised library (e.g., lightweight-charts custom indicator API) | [#112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/112) |
| Pattern filtering missing | Add pattern-type toggle + confidence threshold to side panel | New PBI |
| UI glitches | Dedicate Sprint 5 capacity to polish and bug fixes | New technical debt PBI |
| Analysis results not persisted | Save scan results to SQLite database | Sprint 5 |
| ML accuracy at 57% | Continue Double Top / Double Bottom model; expand training dataset | Sprint 5 |
| ML detection only on 5m | Port pattern detection to additional timeframes | Sprint 5 |
| Additional coin metrics | Implement 24h change, 5m change in sidebar (if time) | Sprint 5 (low priority) |
