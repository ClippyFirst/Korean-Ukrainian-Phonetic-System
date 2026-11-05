# Repository audit and structure — 2026-11-06

## Scope and method

Repository: [ClippyFirst/Korean-Ukrainian-Phonetic-System](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System).  
Default branch inspected: `main`, starting HEAD `043754498f3ad8a17aa6c13b5f643b197536da8a`.  
Recursive tree: 806 entries (767 files, 39 directories).

This is a documentation, repository-structure and agent-workflow audit. It inspected repository metadata, recursive tree, root README, package scripts, architecture/structure documentation, research directive and acceptance gates, agent skills and their contract tests, relevant workflow definitions, open PRs and current branch inventory. It did not independently re-adjudicate Korean pronunciations, review every source file, run a local checkout or issue a legal opinion.

## Repository snapshot

| Area | Observed inventory |
|---|---:|
| Markdown files | 164 |
| Test files under `tests/` | 390 |
| Scripts under `scripts/` | 62 |
| GitHub Actions workflows | 18 |
| Schemas | 13 |
| Documentation files under `docs/` | 140 |
| Research files under `research/` | 49 |
| Existing repository-local skills before this change | 4 |

Counts are point-in-time recursive-tree counts; they include files, not semantic completion. The project has a Python research package, browser application, GitHub Pages service, source/evidence datasets, generated artifacts, research tooling and a substantial regression suite.

## Existing architecture to preserve

The repository already has meaningful responsibility boundaries:

- `src/korean_ukrainian/`: Python domain model, native Korean analysis, IPA, target renderer, CLI/API and research adapters.
- `src/app/` and `src/main.js`: browser application and browser-side engine.
- `src/vendor/g2pk/`: pinned third-party G2P code; preserve its provenance and license.
- `data/korean/`: Korean phonology, lexical evidence, IPA and source-side data.
- `data/correspondence/`: Ukrainian target correspondence and feature weights.
- `schemas/`: machine-readable contracts.
- `scripts/`: generation, import, audit and benchmark tools.
- `tests/`: Python/browser tests, fixtures and corpora.
- `research/`: source register, rule coverage, acceptance gates, decisions and item-level queues.
- `docs/`: human guidance, research notes, dated audits and handoff.
- `.agents/skills/`: domain-specific research and engineering workflows.
- `.github/workflows/`: verification, benchmark, artifact and Pages automation.

Core transformation contract remains:

`Korean orthography → structural/morphological analysis → Korean phonology → IPA or typed uncertainty → Ukrainian target adaptation → Ukrainian practical orthography`.

The browser g2pK path remains a separate baseline from Kozak Kim/NIKL research rules. RR and Hanja remain side layers.

## Branch and PR state at audit time

- Default branch: `main`, HEAD `043754498f3ad8a17aa6c13b5f643b197536da8a`.
- Open PRs: one, [#436](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/436), draft, from `research/236-candidate-review-2026-11-05` into `main`; head `29bcdc4c062fb07f51c58430d5b4b694ab270587`.
- Other listed branch: `research/recover-239-candidate-cohort-2026-11-05`, head `f4064bb998343f587ee769259059db7202dc121f`.
- This documentation task uses a separate branch from the default branch; it does not modify, merge or retarget PR #436.
- Mainline exact-head verification run `42118194229` completed successfully on `0437544` (the workflow was triggered by creation of the documentation branch at the same starting commit). This is baseline evidence, not verification of the documentation changes that follow.

## Findings and dispositions

| Finding | Status | Evidence / disposition |
|---|---|---|
| No root agent entry point | TODO → addressed in this documentation branch | Root `AGENTS.md` now routes agents to the maintained skills and canonical records. |
| Generic change lifecycle is scattered across specialized skills and historical notes | TODO → addressed in this documentation branch | Added `engineering-change` as the general workflow; phonetic/NIKL skills remain specialized. |
| Whole-repository audit and diff-review practices lacked a dedicated local owner | TODO → addressed in this documentation branch | Added `repository-audit` and `change-review`, scoped to the repository's evidence and architecture constraints. |
| Human-facing skill navigation was incomplete | TODO → addressed in this documentation branch | Added `docs/AGENT-WORKFLOWS.md` and linked it from root/docs navigation. |
| Existing `docs/` namespace is large and mostly flat | DEFERRED | Keep paths stable; the new guide provides responsibility-based navigation. A later mechanical migration would require a complete link/caller audit and no-content-change plan. |
| Historical master handoff is long and append-only | PRESERVE | Keep as the canonical history; newest dated section remains authoritative. No second handoff created. |
| Research acceptance gates remain externally constrained | BLOCKED / PARTIAL | Independent Korean IPA review, Ukrainian target review, item-level source rights and unresolved audio/morphology evidence are not closed by documentation work. |
| Upstream skill content reuse | DEFERRED / NOT NEEDED | Selected ideas are documented with pinned revisions; no upstream code or prose was copied. |

## Task ledger

- `DONE_VERIFIED` — current default branch and PR/branch state inspected; architecture and ownership boundaries documented.
- `DONE_VERIFIED` — root agent routing, three general workflow skills and human-facing workflow guide added on the documentation branch.
- `PARTIAL` — documentation discoverability improved without changing legacy paths; the flat historical namespace remains.
- `BLOCKED` — independent linguistic review, target adaptation review and source-rights decisions remain outside this documentation task.
- `DEFERRED` — bulk documentation moves, upstream plugin/hook adoption, external subagent orchestration and benchmark-scoreboard adoption.

## Final verification — 2026-11-06

Final documentation branch content head: `76ceed27728fb1da1302548211bfdc66a1fd92c8`. Exact-head GitHub Actions Verify run [42120139297](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42120139297) completed successfully:

- Browser regression: **1,399/1,399 PASS**.
- Browser production build: **PASS**.
- Generated public-page existence checks for `dist/index.html` and `dist/system.html`: **PASS**.
- Python regression and data-integrity job: **PASS** (pytest progress reached 100%; no failure reported).
- Official NIKL metadata-only source inventory: **SKIPPED**, not passed.

The final diff is documentation, repository-local agent guidance and structural tests only. The branch was five commits ahead of main and changed 13 files at this content head. No local shell/npm/pytest run is claimed; verification came from the exact-head GitHub Actions run.

## Conclusion

The repository did not need a wholesale directory redesign. It needed a clear root-level agent entry point, a task router, explicit general workflows for changes/audits/reviews, and human-readable navigation that preserves the existing research and runtime architecture. This branch addresses those gaps without moving source data, tests, historical reports, generated artifacts or production code.


## Final branch and PR state

- Branch: `docs/agent-workflow-structure-2026-11-06`.
- Verified content head at this audit: `76ceed27728fb1da1302548211bfdc66a1fd92c8`.
- PR: [#437](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/437), open, not merged.
- Diff: 13 files across five commits (see the PR's current diff statistics).
- Research PR #436 and its branch were not modified.
- The two earlier verification attempts failed on newly added structural assertions/regex syntax; those defects were corrected, and the exact content head passed run 42120139297. They are retained here as implementation history, not hidden.
- Merge and any future physical documentation-directory migration remain unperformed. The current PR is ready for human review, subject to normal repository review/merge policy.
