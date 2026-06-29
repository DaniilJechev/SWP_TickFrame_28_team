# Week 5 — Issue Template

> Use this template for every Sprint 4 (Week 5) issue. Fill out all applicable sections.
> **For non-PBI issues** (documentation reports, repo management, course tasks): skip sections marked _PBI-only_.

---

## Issue Metadata

| Field | Instructions |
|---|---|
| **Title** | `{PBI-XXX} Short description` or `US-XX Short description` or `DOC: short description` |
| **Type** | Enhancement / Bug / Documentation / Testing / Architecture / Course Task |
| **Milestone** | [Sprint 4](https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/5) |
| **Backlog Location** | Product Backlog → Sprint 4 section in [`docs/backlog.md`](../../docs/backlog.md) |
| **MVP Version** | `MVP v2` |

---

## Description

_What is this issue about? Why does it matter for MVP v2 or Assignment 5?_

---

## Expected Outcome

_What should be true after this issue is completed?_

---

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

---

## Story Points _(PBI-only — skip for course tasks / docs / repo management)_

Modified Fibonacci: 1, 2, 3, 5 — no more than 5, opt for 1 or 2.

**SP: _ _**

---

## Roles _(PBI-only — skip for course tasks / docs / repo management)_

| Role | Person |
|---|---|
| **Implementer** | @username |
| **Reviewer** | @username (must be a different person) |

---

## Work Status

- [ ] **To Do** — not yet started
- [ ] **Ready** — refined, estimated, ready to start
- [ ] **In Progress** — actively being worked on
- [ ] **Review** — PR/MR is open, awaiting review
- [ ] **Done** — merged to `main`, AC satisfied, DoD met

---

## Links to Assignment 5 Artifacts

| Artifact | Link |
|---|---|
| PR/MR | `#_` (link after creation) |
| PR added to contributions table | [contributions.md](contributions.md) |
| Related ADR (if applicable) | [`docs/architecture/adr/ADR-NNN-*.md`](../../docs/architecture/adr/) |
| Related architecture view (if applicable) | `docs/architecture/{static,dynamic,deployment}-view/` |
| Related quality requirement | QR-00X |
| Related UAT scenario | UAT-00X |

> **PR requirement:** The PR/MR must link to this issue and verify the relevant acceptance criteria before merging ([Repository_Requirements.md §Issue-Linked Workflow](../Repository_Requirements.md#issue-linked-workflow-requirements)).

---

## Definition of Done Checklist

- [ ] All acceptance criteria are satisfied
- [ ] Reviewed and approved by a different team member
- [ ] All CI checks pass (ruff, mypy, pytest+cov, bandit, lychee)
- [ ] No secrets, credentials, or PII committed
- [ ] CHANGELOG.md updated for user-visible changes _(PBI-only)_
- [ ] Relevant documentation updated (architecture, ADR, testing, DoD, quality)
- [ ] PR/MR links to this issue and verifies acceptance criteria before merge
- [ ] PR is recorded in the [contributions.md](contributions.md) table
- [ ] Branch deleted after merge
