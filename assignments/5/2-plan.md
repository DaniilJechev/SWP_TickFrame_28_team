# Part 3–5 Delivery Plan — Assignment 5

## Overview

This plan covers three interconnected parts:

| Part | Artifact | Goal |
|---|---|---|
| **Part 3** | `docs/development-process.md` | Document actual git workflow, config management, CI process |
| **Part 4** | `docs/architecture/README.md` + 3 diagram views | Document static/dynamic/deployment architecture |
| **Part 5** | `docs/architecture/adr/ADR-*.md` | 3 ADRs linked to quality requirements |

All three parts reference each other — ADRs explain *why* the architecture and process are the way they are; the architecture doc indexes ADRs; the development-process doc explains *how* the team works within that architecture.

---

## Part 3 — Development Process & Configuration Management

### File: `docs/development-process.md`

**Must describe the actual process used in this repo**, not an aspirational one.

### Section-by-section content plan

#### 1. Product Backlog & Sprint Backlog Management
- Describe the GitHub Projects board (link: `https://github.com/users/Fedos113/projects/1/views/1`)
- Describe the Sprint 4 milestone container
- Explain how PBIs flow: Product Backlog (unscheduled) → Sprint milestone (selected) → board workflow

#### 2. Workflow States
Document each state from Process Requirements:

| State | Entry Criteria |
|---|---|
| **To Do** | PBI exists, in Product Backlog, not Sprint-selected |
| **Ready** | Sprint-selected, assigned implementer + reviewer, has AC, estimated |
| **In Progress** | Implementer started work, branch created |
| **Review** | PR open, implementer requests review |
| **Done** | AC satisfied, DoD satisfied, PR merged to `main`, CI passes |

#### 3. Git & Review Workflow (Mermaid gitGraph required)

```mermaid
gitGraph
   commit id: "initial"
   branch main
   checkout main
   branch feature/PBI-XXX
   commit id: "implement feature"
   commit id: "fix review comments"
   branch main
   merge feature/PBI-XXX
```

Then explain:
- Branch naming: `<issue-number>-short-description` (e.g. `110-websocket-migration`)
- Issue creation → branch → commits → PR → review → merge → close issue
- PRs must link to issue, milestone, include changelog checkbox
- Reviews require at least one approval from a different person
- Merge strategy: merge commit (no squash/rebase)

#### 4. Configuration & Secrets Management
- `.env` in `.gitignore`, `.env.example` committed
- Secrets stored as GitHub Actions secrets, never in code
- Runtime config via environment variables (loaded in `cli.py`, `backend/main.py`)
- Docker Compose for local dev (2 containers: `tickframe` + `ml-service`)

#### 5. Reproducible Development Environment
- Python 3.11 + `requirements.txt` + `pip install -r requirements.txt`
- `docker-compose up --build` for full stack
- No Nix/devenv — containerized setup is the reproducible path

#### 6. CI Process
- Workflow: `.github/workflows/ci.yml`
- Jobs: `ruff check .` → `mypy tickframe/` → `pytest --cov=tickframe --cov-report=xml` → `bandit -r tickframe/ -ll`
- Link checker: `.github/workflows/lychee.yml` on push/PR to `main`
- Branch protection: `main` protected, direct pushes disabled, ≥1 approval required

#### 7. Links
- Link from `README.md` (add a paragraph in the "Contributing" section)
- Link from hosted docs site
- Link from `reports/week5/README.md` (item 18 in the report structure)

### Checklist — Part 3

- [ ] Write section 1: Backlog & Sprint management (tools, boards, flow)
- [ ] Write section 2: Workflow states table
- [ ] Write section 3: Git workflow with Mermaid `gitGraph` code block
- [ ] Explain the diagram — how branches, PRs, reviews, merges actually happen
- [ ] Write section 4: Configuration & secrets management
- [ ] Write section 5: Reproducible dev environment
- [ ] Write section 6: CI process description
- [ ] Add link to `docs/development-process.md` from root `README.md`
- [ ] Add link from `reports/week5/README.md` (item 18)
- [ ] Verify the file is directly readable (not just a link list)

---

## Part 4 — Architecture Documentation

### File: `docs/architecture/README.md`

**Must include** three view sections, each with diagram + commentary.

### Section-by-section content plan

#### 1. Introduction
- Brief description of TickFrame architecture
- Technology stack summary (FastAPI, Lightweight Charts, SQLite, ML microservice, Docker)
- Link to the three view directories

#### 2. Static View — Component Diagram
**Diagram source:** `docs/architecture/static-view/diagram.puml`

Required PlantUML component diagram showing:
- **Internal components:** FastAPI backend (`tickframe/backend/`), Frontend (HTML/CSS/JS in `tickframe/frontend/`), ML Service (`ml_service/`), SQLite DB
- **External systems:** Bybit API (primary), Binance API (fallback), Web Browser
- **Relations:** HTTP REST, WebSocket, async DB access, HTTP to ML service
- **Protocols:** REST over HTTP, WS, SQL, Docker networking

Required commentary:
- What the diagram shows
- **Coupling & cohesion:** Frontend/backend are loosely coupled via REST API; ML is a separate microservice (high cohesion within each service)
- **Maintainability implications:** Microservice architecture lets ML and backend evolve independently; single codebase for backend simplifies deployment
- **Quality requirements supported:** QR-001 (time behaviour — FastAPI async + cache), QR-002 (confidentiality — input validation), QR-003 (functional correctness — ML service isolation)

#### 3. Dynamic View — Sequence Diagram
**Diagram source:** `docs/architecture/dynamic-view/diagram.puml`

Pick a non-trivial flow involving multiple components. Best options:
- **Option A:** User loads chart → Frontend requests candles → Backend checks SQLite cache → misses → fetches from Bybit → caches → returns → Frontend renders
- **Option B:** User clicks "Analyze Patterns" → Frontend → Backend → ML Service → returns patterns → Backend → Frontend displays markers

Required commentary:
- What scenario the diagram represents
- Why it's important (core user workflow)
- Which architecture decisions it illustrates (caching strategy, microservice boundary)
- Which quality requirements it relates to (QR-001 latency, QR-003 correctness)

#### 4. Deployment View — Deployment Diagram
**Diagram source:** `docs/architecture/deployment-view/diagram.puml`

Required PlantUML deployment diagram showing:
- **Nodes:** Single VM / Docker host, Browser
- **Containers:** `tickframe` container (FastAPI + frontend static files), `ml-service` container, SQLite file (volume mount)
- **External:** Bybit API, Binance API
- **Boundaries:** Docker network, internet
- **Access path:** Browser → `tickframe:8000` → (internal) → `ml-service:8001`

Required commentary:
- Why Docker Compose on a single VM was chosen (simple, reproducible, matches CI)
- How deployment supports/constrains the product (single node limits horizontal scaling but simplifies operations)
- Operations considerations: Docker health checks, volume persistence for SQLite, .env for secrets, port mapping

#### 5. ADR Index
- Link to `docs/architecture/adr/`
- List each ADR with a one-line summary and status
- Explain how ADRs and architecture fit together

### Checklist — Part 4

- [ ] Write `docs/architecture/README.md` introduction
- [ ] **Static view:**
  - [ ] Create/fill `docs/architecture/static-view/diagram.puml` (PlantUML component diagram)
  - [ ] Render SVG/PNG for readability
  - [ ] Write commentary: coupling, cohesion, maintainability, QR links
- [ ] **Dynamic view:**
  - [ ] Create/fill `docs/architecture/dynamic-view/diagram.puml` (PlantUML sequence diagram)
  - [ ] Render SVG/PNG for readability
  - [ ] Write commentary: scenario, importance, decisions, QR links
- [ ] **Deployment view:**
  - [ ] Create/fill `docs/architecture/deployment-view/diagram.puml` (PlantUML deployment diagram)
  - [ ] Render SVG/PNG for readability
  - [ ] Write commentary: why chosen, constraints, operations
- [ ] Write ADR index section linking to all 3 ADRs
- [ ] Ensure all views are directly readable (or have rendered + source forms)

---

## Part 5 — Architecture Decision Records (ADRs)

### Files: `docs/architecture/adr/ADR-001-websocket-migration.md`, `ADR-002-sqlite-persistence.md`, `ADR-003-microservice-architecture.md`

Each ADR must follow this structure:

```markdown
# ADR-{NNN}: {Title}

**Status:** {Accepted | Proposed | Deprecated | Superseded}

**Context:** What is the problem or forcing situation?

**Decision:** What was decided and why?

**Consequences:** What trade-offs, risks, or follow-up work result?

**Links:**
- Relates to QR-{XXX}: ...
- Relates to PBI: ...
```

### ADR-001: WebSocket Migration

| Field | Content |
|---|---|
| **Title** | Migrate REST polling to WebSocket for real-time market data |
| **Status** | Accepted |
| **Context** | MVP v1 used polling every N seconds to fetch candle data, causing latency and unnecessary load. Customer feedback #1 requested real-time updates. |
| **Decision** | Replace REST polling with bidirectional WebSocket connection using FastAPI's `WebSocket` class. Frontend subscribes to symbol streams; backend maintains a single Bybit WebSocket connection and fans out to connected clients. |
| **Consequences** | + Real-time updates, - Increased connection complexity, - Need reconnection logic |
| **QR links** | QR-001 (latency improves), QR-002 (still validate inputs) |

### ADR-002: SQLite Persistence

| Field | Content |
|---|---|
| **Title** | Use SQLite for candle and settings persistence |
| **Status** | Accepted |
| **Context** | Every page load or coin switch triggered a full Bybit API call. No caching meant slow reloads and unnecessary exchange API usage. |
| **Decision** | Add SQLite via `aiosqlite` as a 3-tier cache (memory → DB → exchange). Candles cached by coin/interval; settings saved as key-value. |
| **Consequences** | + Faster repeat loads, + Offline-cached data, - DB file management, - Migration needed on schema changes |
| **QR links** | QR-001 (p95 response time), QR-003 (deterministic analysis on cached data) |

### ADR-003: Microservice Architecture

| Field | Content |
|---|---|
| **Title** | Isolate ML pattern detection as a separate microservice |
| **Status** | Accepted |
| **Context** | ML model training and inference have different resource requirements (RAM, CPU) and release cycles than the main web backend. TensorFlow/Keras dependency bloat would affect the backend image. |
| **Decision** | Run ML as a separate FastAPI microservice in its own Docker container. Backend communicates via HTTP. Each service has its own Dockerfile, requirements.txt, and can be scaled independently. |
| **Consequences** | + Independent scaling, + Clean dependency isolation, + ML can be updated without redeploying backend, - Added network latency, - Extra Docker Compose service |
| **QR links** | QR-003 (ML isolation enables focused accuracy testing), QR-001 (network hop adds latency — mitigated by co-location on same Docker network) |

### Updating `docs/quality-requirements.md`

Add a "Related ADRs" row to each QR's table:

- QR-001: ADR-001 (WebSocket — reduces latency), ADR-002 (SQLite cache — reduces response time), ADR-003 (microservice network hop)
- QR-002: ADR-001 (WebSocket input validation), ADR-003 (service boundary enforces input sanitisation)
- QR-003: ADR-003 (ML service isolation enables dedicated accuracy testing)

### Checklist — Part 5

- [ ] Fill `ADR-001-websocket-migration.md` with full content
- [ ] Fill `ADR-002-sqlite-persistence.md` with full content
- [ ] Fill `ADR-003-microservice-architecture.md` with full content
- [ ] Update `docs/quality-requirements.md` — add "Related ADRs" row to each QR table linking to relevant ADRs
- [ ] Verify `docs/architecture/README.md` links all ADRs in its ADR index section

---

## Cross-Cutting Checklist

### Before starting
- [ ] `git pull origin main` — ensure local `main` is up to date
- [ ] Create a feature branch: `git checkout -b part-3-4-5`
- [ ] Distribute work across team members in separate commits

### Per-part verification
- [ ] PRs created and linked to Sprint 4 milestone
- [ ] Each change reviewed by a different person
- [ ] CI passes (ruff, mypy, pytest, bandit)
- [ ] Lychee link checker passes
- [ ] Changes merged to `main` via PR

### Final verification
- [ ] `docs/development-process.md` is readable and accurate
- [ ] `docs/architecture/README.md` has all 3 views with diagrams + commentary
- [ ] All 3 ADRs are filled, linked from architecture README, and linked from quality-requirements
- [ ] All 3 files linked from `README.md` and `reports/week5/README.md`
