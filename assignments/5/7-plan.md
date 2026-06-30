# Moodle PDF Submission Plan — Assignment 5

## Overview

The Moodle PDF is the **canonical private artifact** (Artifact Requirements §347). It wraps public and private evidence for the assignment — it must **link** rather than **duplicate** public content. It is submitted **only through Moodle**, never committed to the repository.

### 12 required items (Assignment 05 §493–508)

| # | Content | Visibility |
|---|---|---|
| 1 | Project name and team number | Public |
| 2 | Team table (name, email, GitHub, Scrum role, technical domain) | Public |
| 3 | Who did what during the Sprint | Public |
| 4 | Who did not participate | Public |
| 5 | Commit-hash permalink to `reports/week5/README.md` | Public |
| 6 | Commit-hash permalink to repo tree at submission commit | Public |
| 7 | Link to Sprint Review recording (instructor access only) | **Private** |
| 8 | Link to private UAT recording (or timecode in Sprint Review recording) | **Private** |
| 9 | Private transcript/notes (if public publication refused) | **Private** |
| 10 | Link to public sanitized Sprint Review summary | Public |
| 11 | Exact private access instructions (+ test credentials if needed) | **Private** |
| 12 | Any other instructor-only evidence | **Private** |

### Template file

Copy from Assignment 4: `assignments/4/assignment4.tex` → `assignments/5/submission.tex`

The A4 template already has all the LaTeX structure: header, sections, tables, hyperlinks. Adapt the content for A5.

---

## Section-by-section instructions

### Preamble — update for A5

Copy the preamble from `assignments/4/assignment4.tex` (lines 1–22). Change:

| Field | A4 value | A5 value |
|---|---|---|
| `pdftitle` | Assignment 4 Moodle Submission Report - Team 28 | Assignment 5 Moodle Submission Report - Team 28 |
| Header title | Assignment 4: Quality-Gated Sprint Increment Report | Assignment 5: MVP v2 Sprint 4 Increment Report |

### Section 1 — Team Structure (item 2)

Copy from A4 template (§44–63). Update if roles or domains changed:

| Full Name | Email | GitHub | Scrum Role | Technical Domain |
|---|---|---|---|---|
| F. Kozhevnikov | f.kozhevnikov@innopolis.university | Fedos113 | Product Owner | Backend / Frontend / Architecture / CI |
| A. Gafarov | a.gafarov@innopolis.university | omarichev | Developer | Backend / Documentation / Reports |
| A. Mindubaev | a.mindubaev@innopolis.university | pug228 | Developer | Quality / CI / Testing |
| D. Zhechev | d.zhechev@innopolis.university | DaniilJechev | Scrum Master | ML / Quant Engineering |
| M. Bezborodov | m.bezborodov@innopolis.university | MikhailBezborodov024 | Developer | Frontend / UI |

### Section 2 — Contributions (items 3, 4)

Base on `assignments/5/contributions.md`. Use actual PRs/issues from Sprint 4.

Structure (from A4 §68–116):

```latex
\section{Summary of Contributions --- Sprint 4}

\subsection{F. Kozhevnikov (Fedos113) --- Product Owner / Full-Stack}
\begin{itemize}
    \item Repository reorganization and A5 scaffolding (\textbf{PR \#119}, closes \#116, \#117, \#118).
    \item Frontend optimisations: charts.js (+156 lines), CSS refinement, index.html restructuring (\textbf{PR \#119}).
    \item Updated lychee.yml, roadmap.md, Process/Repository Requirements (\textbf{PR \#119}).
    \item [Add Sprint 4 implementation PRs as they are merged — WebSocket, DB cache, sub-charts, etc.]
\end{itemize}

\subsection{A. Gafarov (omarichev) --- Developer / Documentation}
\begin{itemize}
    \item [Fill with actual contributions — docs, reports, etc.]
\end{itemize}

\subsection{A. Mindubaev (pug228) --- Developer / Quality \& CI}
\begin{itemize}
    \item Reviewed PR \#119 (A5 scaffolding) — APPROVED.
    \item [Add other contributions — QRT updates, test extensions, etc.]
\end{itemize}

\subsection{D. Zhechev (DaniilJechev) --- Scrum Master / ML Engineer}
\begin{itemize}
    \item Reviewed PR \#119 (A5 scaffolding) — APPROVED.
    \item [Add ML model updates, architecture contributions, etc.]
\end{itemize}

\subsection{M. Bezborodov (MikhailBezborodov024) --- Developer / Frontend}
\begin{itemize}
    \item [Fill if any contributions in Sprint 4, otherwise state "Limited participation in Sprint 4."]
\end{itemize}
```

### Section 3 — Commit-Hash Permalinks (items 5, 6)

After submission commit is made on `main`:

```latex
\section{Commit-Hash Permalinks}

\subsection{reports/week5/README.md}
\url{https://github.com/Fedos113/SWP_TickFrame_28_team/blob/{COMMIT_HASH}/reports/week5/README.md}

\subsection{Submission commit --- repository tree}
\url{https://github.com/Fedos113/SWP_TickFrame_28_team/tree/{COMMIT_HASH}}
```

Where `{COMMIT_HASH}` is the SHA of the latest commit on `main` at submission time.

### Section 4 — Live Board and Backlog Links

Adapt from A4 (§132–152). Update for A5:

```latex
\section{Live Board and Backlog Links}

\begin{itemize}
    \item \textbf{Product Backlog board/view:} \\
          \url{https://github.com/users/Fedos113/projects/1/views/1}

    \item \textbf{Sprint Backlog board/view:} \\
          \url{https://github.com/users/Fedos113/projects/1/views/1}

    \item \textbf{Sprint 4 milestone:} \\
          \url{https://github.com/Fedos113/SWP_TickFrame_28_team/milestone/5}

    \item \textbf{SemVer release mapped to MVP v2 (v2.0.0):} \\
          \url{https://github.com/Fedos113/SWP_TickFrame_28_team/releases/tag/v2.0.0}

    \item \textbf{Deployed product:} \\
          \url{http://localhost:8000} (Docker Compose on local VM)

    \item \textbf{Public sanitized demo video (<2 min):} \\
          \url{https://TODO_PUBLIC_DEMO_VIDEO_URL}
\end{itemize}
```

### Section 5 — Live Documentation Links

Adapt from A4 (§157–168). Add A5-only assets:

```latex
\section{Live Documentation Links (Assignment 5 Maintained Assets)}

\begin{itemize}
    \item \textbf{docs/roadmap.md:} \url{https://github.com/Fedos113/SWP_TickFrame_28_team/blob/main/docs/roadmap.md}
    \item \textbf{docs/definition-of-done.md:} \url{https://github.com/Fedos113/SWP_TickFrame_28_team/blob/main/docs/definition-of-done.md}
    \item \textbf{docs/testing.md:} \url{https://github.com/Fedos113/SWP_TickFrame_28_team/blob/main/docs/testing.md}
    \item \textbf{docs/quality-requirements.md:} \url{https://github.com/Fedos113/SWP_TickFrame_28_team/blob/main/docs/quality-requirements.md}
    \item \textbf{docs/quality-requirement-tests.md:} \url{https://github.com/Fedos113/SWP_TickFrame_28_team/blob/main/docs/quality-requirement-tests.md}
    \item \textbf{docs/user-acceptance-tests.md:} \url{https://github.com/Fedos113/SWP_TickFrame_28_team/blob/main/docs/user-acceptance-tests.md}
    \item \textbf{docs/development-process.md:} \url{https://github.com/Fedos113/SWP_TickFrame_28_team/blob/main/docs/development-process.md}
    \item \textbf{docs/architecture/README.md:} \url{https://github.com/Fedos113/SWP_TickFrame_28_team/blob/main/docs/architecture/README.md}
    \item \textbf{docs/architecture/adr/:} \url{https://github.com/Fedos113/SWP_TickFrame_28_team/tree/main/docs/architecture/adr}
    \item \textbf{CHANGELOG.md:} \url{https://github.com/Fedos113/SWP_TickFrame_28_team/blob/main/CHANGELOG.md}
    \item \textbf{README.md:} \url{https://github.com/Fedos113/SWP_TickFrame_28_team/blob/main/README.md}
\end{itemize}
```

### Section 6 — Reviewed Issue-Linked PRs

Adapt from A4 (§173–213). List all Sprint 4 PRs:

```latex
\section{Reviewed Issue-Linked PRs / MRs (Sprint 4 Evidence)}

\begin{itemize}
    \item \textbf{PR \#119:} Repository reorganization and A5 scaffolding. \\
          \textbf{Closes issues:} \#116, \#117, \#118. \\
          \textbf{Author:} Fedor Kozhevnikov (Fedos113). \\
          \textbf{Reviewers:} A. Mindubaev (pug228) — APPROVED, D. Zhechev (DaniilJechev) — APPROVED. \\
          \url{https://github.com/Fedos113/SWP_TickFrame_28_team/pull/119}

    \item \textbf{PR \#1XX:} [Add each Sprint 4 implementation PR as merged]
    \item ...
\end{itemize}
```

### Section 7 — MVP v2 Access Instructions

Adapt from A4 (§218–277):

```latex
\section{MVP v2 Access Instructions}

The MVP v2 increment is delivered as a Docker Compose stack with two services.

\subsection{Docker Deployment}

\begin{enumerate}
    \item Clone the repository at the submission commit:
\begin{verbatim}
git clone https://github.com/Fedos113/SWP_TickFrame_28_team.git
cd SWP_TickFrame_28_team
git checkout {COMMIT_HASH}
\end{verbatim}
    \item Copy environment template:
\begin{verbatim}
cp .env.example .env
\end{verbatim}
    \item Build and run:
\begin{verbatim}
docker compose up --build
\end{verbatim}
    \item Open \texttt{http://localhost:8080} in a browser.
\end{enumerate}
```

### Section 8 — Customer Meeting Recordings (items 7, 8)

**Private — do not commit. Include only in the Moodle PDF.**

```latex
\section{Customer Meeting Recordings}

\subsection{UAT and Sprint Review Recording (Combined)}

\textbf{Recording link (instructor access only):} \\
\url{https://TODO_RECORDING_LINK} \\
\textit{Permissions restricted to Innopolis instructors and graders.}

\textbf{Timecodes:}
\begin{itemize}
    \item \textbf{UAT session:} \texttt{00:XX--XX:XX} — [describe what was tested]
    \item \textbf{Sprint Review discussion:} \texttt{XX:XX--XX:XX} — [describe topics covered]
\end{itemize}
```

If UAT and Sprint Review are separate recordings, list both.

### Section 9 — Sprint Review Transcript / Notes (item 9)

**Private-only when public publication is refused.**

```latex
\section{Customer Review Transcript and Notes}

\subsection{Permission status}
Recording: [Granted / Refused] \\
Public transcript publication: [Permitted / Refused] \\
Private instructor sharing: [Permitted / Refused]

\subsection{Sprint goal reviewed}
[Copy from Sprint Review summary]

\subsection{Delivered MVP v2 increment}
[Summary of what was shown]

\subsection{Customer feedback summary}
[Key feedback points]

\subsection{Resulting Product Backlog updates}
[New/changed PBIs]
```

If public publication was **permitted**, link the public transcript instead:
```latex
\section{Customer Review Transcript}

The full sanitized transcript is published in the repository: \\
\texttt{reports/week5/sprint-review-transcript.md} \\
\url{https://github.com/Fedos113/SWP_TickFrame_28_team/blob/main/reports/week5/sprint-review-transcript.md}
```

### Section 10 — Sanitized Sprint Review Summary (item 10)

```latex
\section{Public Sanitized Sprint Review Summary}

\texttt{reports/week5/sprint-review-summary.md} \\
\url{https://github.com/Fedos113/SWP_TickFrame_28_team/blob/main/reports/week5/sprint-review-summary.md}
```

### Section 11 — Private Access Instructions (item 11)

```latex
\section{Private Access Instructions}

\textbf{Deployment URL:} \texttt{http://localhost:8080} (or VM IP on local network) \\
\textbf{Authentication:} None required — Bybit public API works without keys. \\
\textbf{Optional:} Add \texttt{BYBIT\_API\_KEY} and \texttt{BYBIT\_API\_SECRET} to \texttt{.env} for higher rate limits.
```

### Section 12 — Instructor-Only Evidence (item 12)

```latex
\section{Instructor-Only Evidence}

The following is provided only through this Moodle submission:
\begin{itemize}
    \item Customer UAT + Sprint Review recording (private link) — Section 8 above.
    \item Customer consent for recording obtained [verbally at start / written].
    \item No real credentials, PII, or customer-identifying evidence beyond what is sanitized in public artifacts.
\end{itemize}
```

---

## Build and submission checklist

### Before compilation
- [ ] All Sprint 4 work merged to `main`
- [ ] `reports/week5/README.md` complete with all 42 items
- [ ] `v2.0.0` release created on GitHub
- [ ] Public demo video uploaded, link available
- [ ] Hosted documentation site live
- [ ] Sprint Review session recorded
- [ ] UAT recording available (or timecodes in combined recording)
- [ ] Commit hash recorded: `git rev-parse HEAD`
- [ ] All private links collected (recording, access instructions)

### Build PDF

```bash
cd assignments/5
pdflatex submission.tex
```

Or use Overleaf — upload `submission.tex` and compile.

### Final verification
- [ ] PDF renders without errors
- [ ] All hyperlinks work (test each one)
- [ ] No private information in public sections
- [ ] Recording links accessible to instructors
- [ ] Commit-hash permalinks point to correct commits on `main`
- [ ] Team table has all 5 members
- [ ] Contributions section has each member's work
- [ ] Non-participating members explicitly noted (item 4)
- [ ] Public demo video URL is correct
- [ ] Timecodes are accurate (if combined recording)

### Submission
- [ ] Upload PDF to Moodle
- [ ] Keep repository and hosted docs accessible until grading complete
