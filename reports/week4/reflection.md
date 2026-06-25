# Reflection — Assignment 4

> **Template — Assignment 4, Part 13**
>
> Instructions:
> - Reflect on the entire Sprint experience
> - Be honest and specific — generic filler will be flagged
> - Link to affected PBIs, QRs, UATs, CI checks, milestones, releases, and docs where relevant

---

## Learning Points

_What the team learned from:_

### Customer Feedback Response
_[e.g., "We learned that prioritizing feedback into a clear table with PBI links helps us track
which customer requests are addressed and which are deferred."]_

### Quality Requirements Definition
_[e.g., "Defining measurable scenarios forced us to think concretely about what 'good' means
— not just 'the app should be fast' but 'chart redraws within 2 seconds under 10 users.'"]_

### QRT Automation
_[e.g., "Writing automated tests for quality requirements showed us that some QRs
(e.g., security) are harder to automate than others (e.g., performance)."]_

### CI Configuration
_[e.g., "Setting up CI caught several lint and type errors before review, saving reviewer time."]_

### UAT Execution
_[e.g., "Watching the customer use the product revealed usability gaps we had not considered."]_

### Sprint Review and Release
_[e.g., "Releasing a SemVer version with a changelog and demo video made the increment feel
tangible and gave the customer something concrete to evaluate."]_

---

## Validated Assumptions

_Assumptions or decisions confirmed or rejected during this Sprint:_

| Assumption | Status | Evidence |
|---|---|---|
| _[e.g., "Pytest is sufficient for all test levels in this project"]_ | ✅ Confirmed | Unit, integration, and QRTs all run with pytest |
| _[e.g., "The WebSocket connection will handle 10 concurrent users"]_ | ❌ Rejected | Load test showed connection drops at 5+ users |
| _[e.g., "FastAPI TestClient can mock Bybit API calls"]_ | ✅ Confirmed | bybit_client tests pass with mocked HTTPX responses |

---

## Friction and Gaps

- **Unresolved requirements:** _[e.g., "Timeframe selector only supports 5m — need 15m, 1h"]_
- **Technical risks:** _[e.g., "Bybit rate limits may affect scan reliability under load"]_
- **Quality gaps:** _[e.g., "No test coverage for frontend JavaScript"]_
- **Missing test coverage:** _[e.g., "WebSocket integration test is skipped due to missing mock"]_
- **Blocked work:** _[e.g., "US-08 drawing toolbar blocked — needs frontend library decision"]_
- **Process friction:** _[e.g., "Review turnaround was slow for large PRs"]_
- **Follow-up questions:** _[e.g., "Should bandit warnings be treated as CI failures or warnings?"]_

---

## Planned Response

_How the team will respond in the next Sprint or assignment:_

| Issue | Planned action | Links |
|---|---|---|
|[e.g., Low WebSocket coverage]| Write WebSocket integration test with mocked connection | _#XX (replace with real link)_ |
|[e.g., Only 5m interval]| Add multi-interval support to Bybit client | US-07 |
|[e.g., Slow PR reviews]| Set 24h max review SLA | — |
