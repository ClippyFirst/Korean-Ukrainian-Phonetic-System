# Agent instructions

This repository is a Korean-to-Ukrainian phonetic system and research programme. Treat this file as the repository-wide entry contract. The detailed, maintained instructions live in the linked documents and skills; do not duplicate their full contents here.

## Start here

Before a substantial task, inspect:

1. [Project overview](README.md).
2. [Documentation map and authority rules](docs/README.md).
3. [Repository structure and ownership](docs/REPOSITORY-STRUCTURE.md).
4. [Agent workflow guide](docs/AGENT-WORKFLOWS.md).
5. [Research master directive](research/MASTER-DIRECTIVE.md), [acceptance gates](research/ACCEPTANCE-GATES.md), and [roadmap](research/ROADMAP.md) when the task touches research, phonology, data, benchmarks, or release claims.
6. The newest dated section of [the master execution handoff](docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md).

Read the files relevant to the actual task, not every historical report. Historical audits are evidence snapshots, not current instructions.

## Skill routing

Use the repository-local skill that owns the task:

| Task | Required skill |
|---|---|
| Korean pronunciation, IPA, Ukrainian adaptation, RR/Hanja, G2P, phonological rules, linguistic tests or benchmarks | `.agents/skills/phonetic-engineering/SKILL.md` |
| NIKL claims, official answers, dictionary evidence, lexical overrides or source adjudication | `.agents/skills/nikl-evidence-audit/SKILL.md` |
| NIKL rule inventory, implementation coverage or rule regression | `.agents/skills/nikl-rule-coverage/SKILL.md` |
| NIKL source capture or metadata inventory | `.agents/skills/nikl-norm-crawler/SKILL.md` |
| Any other feature, bug fix, refactor, documentation or CI change | `.agents/skills/engineering-change/SKILL.md` |
| Whole-repository health, structure, data-flow or risk audit | `.agents/skills/repository-audit/SKILL.md` |
| Review of a branch, commit range or PR | `.agents/skills/change-review/SKILL.md` |

A task may require more than one skill. Prefer the domain-specific skill for linguistic evidence and the general engineering skill for the software change lifecycle.

## Non-negotiable project contracts

- Preserve the pipeline: Korean source orthography → structural and supported morphological analysis → Korean phonology → IPA or an explicitly typed unresolved/partial result → Ukrainian target adaptation → Ukrainian practical orthography.
- Never generate Ukrainian output through a parallel direct-Hangul substitution path.
- Keep orthographic romanization, pronunciation, broad/narrow IPA, Ukrainian adaptation, RR and Hanja annotation distinct.
- Keep Kozak Kim/NIKL research rules separate from the independent g2pK comparison adapters and vendored upstream code.
- Treat official attestations, rule derivations, dictionary entries, secondary research, corpus labels, model predictions and hypotheses as different evidence classes.
- Do not invent IPA, lexical forms, benchmark results, source permissions or expected outputs. Preserve uncertainty and abstain when evidence is insufficient.
- A test passing proves only its asserted software contract; it does not establish linguistic gold, independent review or licensing permission.

## Change discipline

1. Inspect the current default branch, working tree if available, recent commits, open/recent PRs and relevant CI before editing. Reuse existing modules, datasets, tests and registers.
2. Establish a small task ledger with `DONE_VERIFIED`, `PARTIAL`, `TODO`, `BLOCKED` and `DEFERRED`; keep evidence, implementation, tests and independent review as separate dimensions.
3. For behavior changes, reproduce the issue and use test-first development: observe the regression test fail for the intended reason, implement the smallest correction, then observe it pass.
4. For unexpected failures, investigate and reproduce the root cause before changing code. Trace data across component boundaries.
5. Reuse existing abstractions and platform features. Do not add dependencies, configuration, wrappers, skills or abstractions without a concrete demonstrated need. Do not weaken validation, error handling, security or accessibility to reduce code.
6. Keep historical documents and stable paths. Do not bulk-move or rename documentation, data, fixtures or generated artifacts during a documentation pass.
7. Work on a dedicated branch based on the current default branch. Preserve unrelated work. Do not force-push, delete user branches, merge blindly, publish releases or change external settings.
8. Run the relevant repository-defined checks on the actual final commit. Record exact commands, run IDs, exit status, counts and skips. A skipped job is not a pass; connector-only inspection is not a local test run.
9. Update the existing canonical index, registers and append-only handoff. Do not create competing master plans, source registries, rule matrices or acceptance-gate ledgers.
10. Report what changed, what was verified, what was not checked, and the remaining blockers without overstating readiness.

## Sources of truth

- Runtime behavior: current source code, schemas, canonical data and tests.
- Research evidence: `research/SOURCE-REGISTER.csv`, `research/RULE-COVERAGE.csv`, claim/evidence records and item-level review packets.
- Research decisions and readiness: `research/DECISION-LOG.md`, `research/ACCEPTANCE-GATES.md` and `research/ROADMAP.md`.
- Human navigation: `README.md`, `docs/README.md`, `docs/REPOSITORY-STRUCTURE.md` and `docs/AGENT-WORKFLOWS.md`.
- Historical evidence: dated reports in `docs/` and `docs/audits/`; supersede with a new dated record rather than silently rewriting history.
- Session continuation: the newest dated section of `docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md`.
