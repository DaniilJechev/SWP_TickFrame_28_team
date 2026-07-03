# ADR-003: Isolate ML Pattern Detection as a Separate Microservice

**Status:** Accepted

**Context:**

The initial MVP v1 bundled ML pattern detection as a module inside the main backend package. This caused several problems:
- TensorFlow / XGBoost dependencies bloated the backend Docker image
- ML model training and inference have different resource requirements (RAM, CPU) than the web backend
- ML model updates required redeploying the entire backend
- Testing ML accuracy required running the full backend test suite

Customer feedback from Sprint 3 Review confirmed ML pattern detection as a key feature that needed to be reliable and independently evolvable.

**Decision:**

Run ML pattern detection as a separate FastAPI microservice in its own Docker container. The backend communicates with the ML service via HTTP POST over Docker's internal DNS (`ml-service:8001`).

Key architecture:
- **ML Service container** (`ml_service/`): FastAPI app loading an XGBoost model at startup. Exposes `POST /predict` and `GET /health`.
- **Backend client** (`MlClient` in `tickframe/backend/services/ml_client.py`): HTTP client with configurable URL (`ML_API_URL`), timeout (`ML_REQUEST_TIMEOUT`), and confidence threshold (`ML_CONFIDENCE_THRESHOLD`).
- **Communication:** Backend sends `{symbol, timeframe, candles}` → ML service returns `{patterns_found: [{time, confidence, type}]}`.
- **Fallback:** If the ML service is unreachable, the backend returns an empty pattern list (graceful degradation).

Each service has its own:
- `Dockerfile` — independent base images
- `requirements.txt` — separate dependency sets
- Development lifecycle — can be updated and redeployed independently

**Consequences:**

- **Positive:** Clean dependency isolation — ML dependencies (xgboost, pandas) don't affect the backend image. Independent scaling — ML service can be allocated more resources without affecting the backend. Independent release cycles — ML model updates don't require backend redeployment. Focused testing — ML accuracy tests (QRT-003) run only on the ML service.
- **Negative:** Added network latency — each analysis request adds an HTTP round-trip (mitigated by co-location on the same Docker network, typical latency <1ms). Extra operational complexity — two containers to build, deploy, and monitor instead of one.
- **Trade-off acknowledged:** For low-scale deployments (single VM, single-user), the microservice overhead is minimal. If scale increases, the separation provides a natural migration path to independent horizontal scaling.

**Links:**
- Relates to **QR-001 (Time Behaviour)**: Network hop adds latency — mitigated by Docker co-location. ML service can be resource-scaled independently.
- Relates to **QR-002 (Confidentiality)**: Service boundary enforces input sanitisation at both layers.
- Relates to **QR-003 (Functional Correctness)**: ML isolation enables focused accuracy testing (QRT-003) without backend interference.
- Relates to PBI: [#54](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/54) (ML API), [#5 US-01](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/5) (ML detection)
