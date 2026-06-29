Here is a quick, structured breakdown of each part of Assignment 5 to help you use it as a checklist:

### **Core Focus**
Deliver **MVP v2** with a strong emphasis on **architecture reasoning**, **maintainable development processes**, **configuration management**, and responding to customer feedback. 

---

### **Part-by-Part Breakdown**

**Part 1: Refine Product Backlog & Plan Sprint 3**
*   Review feedback, risks, and unfinished work.
*   Create/update Product Backlog Items (PBIs) and assign them to a **Sprint 3 milestone** (with dates, goal, story points, assignees).
*   Update `docs/roadmap.md` to reflect the current direction and MVP v2 scope.

**Part 2: Respond to Customer Feedback**
*   Address feedback from MVP v1.
*   Create PBIs for the feedback you are tackling.
*   Include a **Customer Feedback Response Table** in your Week 5 public report (explaining addressed, deferred, or ignored feedback).

**Part 3: Document Dev Process & Config Management**
*   Create/update `docs/development-process.md`.
*   Include a **Mermaid `gitGraph` diagram** illustrating your Git workflow and explain how the team uses it.
*   Link this document from the root README, hosted docs, and Week 5 report.

**Part 4: Document the Architecture**
*   Create/update `docs/architecture/README.md` using **diagrams-as-code** (e.g., PlantUML).
*   Include and explain three specific views (stored in their respective subfolders):
    1.  **Static View:** Component diagram (internal components, external systems, relations).
    2.  **Dynamic View:** Sequence diagram (a non-trivial workflow/request flow).
    3.  **Deployment View:** Deployment diagram (runtime structure, datastores, network boundaries).

**Part 5: Create & Link ADRs (Architecture Decision Records)**
*   Create at least **3 ADRs** in `docs/architecture/adr/`.
*   Ensure each ADR links to specific quality requirements.
*   Update `docs/quality-requirements.md` to link back to these ADRs.

**Part 6: Extend Testing, QA, & Definition of Done (DoD)**
*   Keep CI/testing gates active and extend them for MVP v2.
*   Update `docs/testing.md`, `docs/quality-requirements.md`, `docs/quality-requirement-tests.md`, and `docs/definition-of-done.md` to reflect any architectural or workflow changes.

**Part 7: Implement, Release, & Deploy MVP v2**
*   Implement the Sprint scope (features, bug fixes, architecture improvements).
*   Ensure PRs are issue-linked and reviewed. Update `CHANGELOG.md` and root `README.md`.
*   Deploy the increment and create a **SemVer release** (e.g., `v2.0.0`) mapped to MVP v2, linking to the Sprint milestone, demo video, and Week 5 report.

**Part 8: Update & Execute User Acceptance Tests (UAT)**
*   Update `docs/user-acceptance-tests.md` and add **at least 2 new UAT scenarios** for MVP v2.
*   Execute UAT with the customer in a **recorded session** (keep recording private).
*   Summarize UAT results (passed/failed/feedback) in the Week 5 public report.

**Part 9: Conduct the Sprint Review**
*   Hold a meeting with the customer/stakeholder to review the Sprint Goal, MVP v2, UAT results, and architecture.
*   Write the transcript/notes (`reports/week5/sprint-review-transcript.md` or `...-notes.md`) and a summary (`reports/week5/sprint-review-summary.md`).

**Part 10: Conduct the Sprint Retrospective**
*   Write `reports/week5/retrospective.md` focusing on team learnings and concrete process changes for the next Sprint.

**Part 11: Host Maintained Documentation**
*   Publish your `docs/` folder to a **browsable hosted documentation site** (e.g., GitHub Pages).
*   Link it from the root README, Week 5 report, and SemVer release.

**Part 12: Reflect on the Week**
*   Write `reports/week5/reflection.md` focusing on what the team learned regarding architecture, ADRs, workflow, and delivering MVP v2.

**Part 13: Record Public Sanitized Demo Video**
*   Record a **< 2-minute public video** demonstrating MVP v2 (no private customer data).
*   Link it in the Week 5 report and the SemVer release.

**Part 14: Report on LLM Usage**
*   Write `reports/week5/llm-report.md` detailing how AI/LLM tools were used during the assignment.

---

### **Final Reporting & Submission**

**Repository Report (Public)**
*   Create `reports/week5/README.md` as the central index.
*   Include links to all boards, milestones, docs, CI pipelines, releases, and videos.
*   Include a **Contribution Traceability Table** and **embedded screenshots** (Sprint milestone, CI run, SemVer release, hosted docs, etc.).

**Moodle Submission (Private PDF Wrapper)**
*   Create a single PDF containing:
    *   Team info, roles, and a breakdown of who did what (and who didn't participate).
    *   Commit-hash permalinks to the `reports/week5/README.md` and the repo tree.
    *   **Private links:** UAT recording, Sprint Review recording, and exact private access instructions/credentials for the product.
    *   Private transcripts/notes (if public sharing was refused).