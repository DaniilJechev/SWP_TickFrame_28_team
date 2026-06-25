# Quality Requirements

> **Template — Assignment 4, Part 3**
>
> Instructions:
> - Define at least **3** quality requirements
> - Each must use a **different ISO/IEC 25010 sub-characteristic**
> - Each must follow the measurable scenario format: stimulus → source → environment → artifact → response → response measure
> - Include stable ID, rationale, traceability to QRTs and PBIs
> - Reference: https://github.com/Alexey-Popov/awesome-ai-architect/blob/main/solution-architecture/quality-attributes.md

---

## QR-001: [Short Name — e.g., Chart Response Time]

| Field | Value |
|---|---|
| **ID** | QR-001 |
| **ISO/IEC 25010 sub-characteristic** | Performance Efficiency — Time behaviour |
| **Stimulus** | _[What triggers the scenario, e.g., User switches chart timeframe]_ |
| **Source** | _[Who or what produces the stimulus]_ |
| **Environment** | _[System state during scenario, e.g., under 10 concurrent users]_ |
| **Artifact** | _[System component affected, e.g., Web dashboard chart view]_ |
| **Response** | _[System behavior, e.g., Chart is redrawn with new candles]_ |
| **Response measure** | _[Quantifiable measure, e.g., Within 2 seconds]_ |
| **Rationale** | _[Why this matters for TickFrame]_ |
| **Linked QRT** | QRT-001 |
| **Affected PBIs** | _[Issue links, e.g., #18 — US-07 Choose timeframe]_ |

---

## QR-002: [Short Name — e.g., API Key Confidentiality]

| Field | Value |
|---|---|
| **ID** | QR-002 |
| **ISO/IEC 25010 sub-characteristic** | Security — Confidentiality |
| **Stimulus** | _[e.g., User configures API keys in .env and runs the application]_ |
| **Source** | _[e.g., Trading application process]_ |
| **Environment** | _[e.g., Normal operation, all log levels]_ |
| **Artifact** | _[e.g., Application logs, UI, error responses]_ |
| **Response** | _[e.g., No API keys appear in any output]_ |
| **Response measure** | _[e.g., Zero occurrences in CI-scanned logs and coverage of secret-leakage test]_ |
| **Rationale** | _[Why this matters for TickFrame]_ |
| **Linked QRT** | QRT-002 |
| **Affected PBIs** | _[Issue links]_ |

---

## QR-003: [Short Name — e.g., Data Accuracy]

| Field | Value |
|---|---|
| **ID** | QR-003 |
| **ISO/IEC 25010 sub-characteristic** | Functional Suitability — Accuracy |
| **Stimulus** | _[e.g., Application fetches OHLCV candle data from Bybit]_ |
| **Source** | _[e.g., bybit_client module]_ |
| **Environment** | _[e.g., Live Bybit API, normal market conditions]_ |
| **Artifact** | _[e.g., Parsed candle data in the cache]_ |
| **Response** | _[e.g., Price values match Bybit source within tolerance]_ |
| **Response measure** | _[e.g., ≤0.1% deviation for open/high/low/close prices]_ |
| **Rationale** | _[Why this matters for TickFrame]_ |
| **Linked QRT** | QRT-003 |
| **Affected PBIs** | _[Issue links, e.g., #5 — US-01 ML pattern detection]_ |

---

> Additional QRs can be added (e.g., Reliability — Availability, Usability — Operability).
> Make sure each uses a **different sub-characteristic** from the ISO/IEC 25010 model.
