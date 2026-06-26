# Quality Requirements

## QR-001: Chart Response Time

| Field | Value |
|---|---|
| **ID** | QR-001 |
| **ISO/IEC 25010 sub-characteristic** | Performance Efficiency — Time behaviour |
| **Stimulus** | User opens the dashboard or switches chart timeframe |
| **Source** | Web browser client |
| **Environment** | Local Docker deployment, normal network conditions |
| **Artifact** | Web dashboard chart view |
| **Response** | Chart is rendered with candle data from the API |
| **Response measure** | Within 2 seconds for up to 1000 candles |
| **Rationale** | TickFrame is a real-time charting tool. Slow chart loading makes pattern analysis impractical. |
| **Linked QRT** | QRT-001 |
| **Affected PBIs** | PBI-104 (TradingView Advanced Charts), PBI-107 (Multi-coin) |

---

## QR-002: API Key Confidentiality

| Field | Value |
|---|---|
| **ID** | QR-002 |
| **ISO/IEC 25010 sub-characteristic** | Security — Confidentiality |
| **Stimulus** | User configures API keys in .env and runs the application |
| **Source** | Trading application process |
| **Environment** | Normal operation, all log levels |
| **Artifact** | Application logs, HTTP responses, UI |
| **Response** | No API keys appear in any output |
| **Response measure** | Zero occurrences of BYBIT_API_KEY or BYBIT_API_SECRET in any scanned output |
| **Rationale** | Exposed credentials would allow unauthorized exchange access and potential financial loss. |
| **Linked QRT** | QRT-002 |
| **Affected PBIs** | Security audit |

---

## QR-003: Candle Data Accuracy

| Field | Value |
|---|---|
| **ID** | QR-003 |
| **ISO/IEC 25010 sub-characteristic** | Functional Suitability — Accuracy |
| **Stimulus** | Application fetches OHLCV candle data from Bybit |
| **Source** | bybit_client module |
| **Environment** | Live Bybit API, normal market conditions |
| **Artifact** | Parsed candle data in the cache |
| **Response** | Price values match Bybit source within tolerance |
| **Response measure** | ≤0.1% deviation for open/high/low/close prices |
| **Rationale** | ML pattern detection depends on accurate price data; inaccurate candles produce false patterns. |
| **Linked QRT** | QRT-003 |
| **Affected PBIs** | PBI-102 (ML Client), PBI-103 (Analyze API) |
