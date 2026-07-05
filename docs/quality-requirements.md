# Quality Requirements

This document defines measurable quality requirements for the TickFrame project, following the ISO/IEC 25010 quality model.

---

## QR-001: API Response Time

| Attribute | Value |
|---|---|
| **ID** | QR-001 |
| **ISO/IEC 25010 Sub-characteristic** | **Time Behaviour** (Performance Efficiency) |
| **Priority** | High |
| **Status** | Active |

### Full Scenario (Stimulus → Source → Environment → Artifact → Response → Response Measure)

| Element | Description |
|---|---|
| **Stimulus** | User sends an API request (candles, analysis, drawings, health) |
| **Source** | Frontend web client or CLI |
| **Environment** | Production deployment (Docker, single VM, local network) |
| **Artifact** | FastAPI backend (`tickframe/backend/`) |
| **Response** | Backend processes the request and returns data |
| **Response Measure** | 95th percentile response time ≤ 500 ms under normal load; throughput ≥ 50 requests/second |

### Rationale for TickFrame

TickFrame is a real-time charting tool. Slow API responses make the UI feel unresponsive during zoom, scroll, coin switching, and pattern analysis. Users expect sub-second feedback when interacting with charts. Candle endpoints are the most frequently called (every coin switch, zoom, timeframe change), so they must remain fast even under high concurrency.

### Links

- **QRT:** [QRT-001](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/82) — Performance Test Automation
- **Affected PBIs:** [#68 PBI-107](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/68) (50k candles), [#74 PBI-112](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/74) (rate limiting)
- **Related ADRs:** [ADR-001](docs/architecture/adr/ADR-001-websocket-migration.md) (WebSocket — reduces latency), [ADR-002](docs/architecture/adr/ADR-002-sqlite-persistence.md) (SQLite cache — reduces response time), [ADR-003](docs/architecture/adr/ADR-003-microservice-architecture.md) (microservice network hop — mitigated by co-location)
- **DoD Criterion:** All CI checks pass (performance tests included)

---

## QR-002: No Secrets or Vulnerabilities in Codebase

| Attribute | Value |
|---|---|
| **ID** | QR-002 |
| **ISO/IEC 25010 Sub-characteristic** | **Confidentiality** (Security) |
| **Priority** | High |
| **Status** | Active |

### Full Scenario (Stimulus → Source → Environment → Artifact → Response → Response Measure)

| Element | Description |
|---|---|
| **Stimulus** | A developer commits code or an external attacker sends malicious input |
| **Source** | Development workflow (commit/push) or external attacker (HTTP request) |
| **Environment** | CI pipeline and production deployment |
| **Artifact** | Git repository, API endpoints |
| **Response** | CI pipeline scans for secrets and runs security checks; API validates and sanitizes input |
| **Response Measure** | No secrets, credentials, or PII present in any commit; API rejects malformed or oversized inputs with HTTP 400/422; Bandit scan passes with zero high-severity findings |

### Rationale for TickFrame

TickFrame is a public GitHub repository with a deployed web service. Accidental credential exposure (e.g., API keys in `.env` committed to the repo) would compromise the exchange data pipeline. Additionally, the API is exposed on the local network and must reject injection attacks and oversized payloads to prevent denial of service.

### Links

- **QRT:** [QRT-002](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/83) — Security Test Automation
- **Affected PBIs:** [#86](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/86) (CI pipeline), DoD enforcement
- **Related ADRs:** [ADR-001](docs/architecture/adr/ADR-001-websocket-migration.md) (WebSocket input validation), [ADR-003](docs/architecture/adr/ADR-003-microservice-architecture.md) (service boundary enforces input sanitisation)
- **DoD Criterion:** No secrets, credentials, or PII committed; QA check (bandit) passes

---

## QR-003: Pattern Detection Accuracy

| Attribute | Value |
|---|---|
| **ID** | QR-003 |
| **ISO/IEC 25010 Sub-characteristic** | **Functional Correctness** (Product Quality) |
| **Priority** | High |
| **Status** | Active |

### Full Scenario (Stimulus → Source → Environment → Artifact → Response → Response Measure)

| Element | Description |
|---|---|
| **Stimulus** | User clicks "Analyze Patterns" on historical chart data containing known patterns |
| **Source** | Frontend web UI |
| **Environment** | Production (ML microservice, Docker container on same VM) |
| **Artifact** | ML detection endpoint (`ml_service`) |
| **Response** | ML service processes candle windows and returns detected patterns with confidence scores |
| **Response Measure** | F2 score ≥ 0.55 on held-out test set; false positive rate ≤ 20%; detection results are deterministic for identical input |

### Rationale for TickFrame

Users rely on pattern detection to identify trading opportunities. Incorrect detections erode trust and can lead to financial losses. The F2 metric weights recall higher than precision, reflecting that catching real patterns is more important for an initial screening tool than avoiding false positives. Deterministic output is critical for reproducibility — users must get the same results from the same data.

### Links

- **QRT:** [QRT-003](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/84) — Accuracy Test Automation
- **Affected PBIs:** [#5 US-01](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/5) (ML detection), [#54](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/54) (ML API)
- **Related ADRs:** [ADR-003](docs/architecture/adr/ADR-003-microservice-architecture.md) (ML isolation enables dedicated accuracy testing), [ADR-002](docs/architecture/adr/ADR-002-sqlite-persistence.md) (deterministic analysis on cached data)
- **DoD Criterion:** QRT tests pass in CI

---

## Summary

| ID | Sub-characteristic | Key Metric | QRT Link |
|---|---|---|---|
| QR-001 | Time Behaviour | p95 response ≤ 500 ms | [#82](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/82) |
| QR-002 | Confidentiality | Zero secrets in commits, Bandit passes | [#83](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/83) |
| QR-003 | Functional Correctness | F2 ≥ 0.55, FPR ≤ 20% | [#84](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/84) |
