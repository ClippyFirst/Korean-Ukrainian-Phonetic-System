# Documentation map

## Mainline status at start of documentation pass — 2026-11-09

**Starting main:** `6ef4960fca292b8e5bfa296bebb75f32fe6b1a7f` · **active integration branch:** `main` · **open PRs:** [#463](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/463) and [#462](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/462).

The four push-triggered workflows completed successfully on this exact main commit:
- [Tests #42519315077](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42519315077) — PASS.
- [System Verify #42519315152](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42519315152) — PASS.
- [Master/research artifacts #42519315001](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42519315001) — PASS.
- [Pages deployment/live smoke #42519315003](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42519315003) — PASS.

**Open benchmark work is not merged.** PR [#463](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/463) runs the expanded benchmark portfolio. Its run [42526972593](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42526972593) completed the ten-engine comparisons and generated the three SIGMORPHON Browser reports, but failed at the post-report token-count assertion: the workflow's Hangul regex produced an expected count of zero. The Browser regression and open Korean matrix steps were consequently skipped. The run [42526976103](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42526976103) for the pinned UGTPHON external diagnostic passed. PR [#462](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/462) is a narrower earlier verification change superseded in scope by #463; both remain open pending reconciliation. Neither PR is represented as merged or release evidence.

The isolated [MFA Korean G2P v2.0.0 benchmark](KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md#2026-11-08--mfa-korean-g2p-v200-diagnostic-execution) remains **DONE_VERIFIED** for its comparison-only execution (run [42513951588](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42513951588), artifact [13630946780](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42513951588/artifacts/13630946780)). Independent review of the 56-phone identity-to-IPA assumption and training-data overlap remains open.

**Readiness:** software-verified, evidence-scoped research prototype; not independently research-certified or release-ready. The current operating branch is `main`; historical/supporting refs are retained as evidence and are not active development targets. See the [current audit](REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md), [master handoff](MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md) and [repository structure guide](REPOSITORY-STRUCTURE.md).

---



This page is the entry point for project documentation. It distinguishes current operating contracts from dated research records and append-only execution history.

## Benchmark results — consolidated dashboard

[**Open all engine and mode results**](BENCHMARK-RESULTS-2026-11-08.md) — 10-engine Strict/Broad tables, Browser Strict/Soft/Super-soft, Seoul surface and phonemic IPA modes, MFA Hangul/Jamo, and an explicit executed/pending matrix. Detailed provenance and historical evidence remain in the [benchmark suite register](KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md).

## Start here

1. [Project README](../README.md) — product overview, installation entry points, public service, runtime modes and limitations.
2. [Contributing guide](../CONTRIBUTING.md) — setup, change discipline, evidence and rights requirements.
3. [Root agent instructions](../AGENTS.md) — repository-wide task routing and non-negotiable contracts.
4. [Agent workflow guide](AGENT-WORKFLOWS.md) — maintained skills, task lifecycle, evidence rules and review/verification process.
5. [Repository structure guide](REPOSITORY-STRUCTURE.md) — current component map, data ownership, runtime entry points, development commands and safe navigation.
6. [UGTPHON five abstentions — source-only follow-up](UGTPHON-FIVE-ABSTENTIONS-RESOLUTION-2026-11-06.md) — exact NIKL-backed `삶의` variant set and the distinct, source-attested `칡칡이` and `칭칭이` folk-song entries.
7. [40-case source-only adjudication — 2026-11-07](KOZAK-KIM-40-SOURCE-ONLY-ADJUDICATION-2026-11-07.md) — source-backed structural and broad-profile decisions for all 17 token spellings / 40 residual occurrences, with speaker-specific IPA limits kept separate; [claim-level evidence ledger](../research/kozak-kim-40-adjudication-evidence-claims-2026-11-08.csv) maps each atomic claim to one source; PR #461 adds the shared [runtime adjudication registry](../src/korean_ukrainian/source_adjudications.json) for browser and Python results.
8. [Repository audit and structure — 2026-11-06](REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md) — current continuation for repository, CI, 236-case, no-audio policy, source-rights and readiness status.
9. [Engineering workflow reference audit — 2026-11-06](ENGINEERING-WORKFLOW-REFERENCE-AUDIT-2026-11-06.md) — pinned review of Unlazy, Superpowers, Matt Pocock skills and Ponytail with explicit adoption boundaries.
10. [Previous repository audit — 2026-11-04](REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-04.md) — historical snapshots; latest addendum 2026-11-05, including engine isolation and historical mismatch blockers.
11. [Versioning policy](VERSIONING-POLICY.md) — independent browser and Python release streams.
12. [Architecture](architecture.md) — concise system architecture.
13. [Methodology](methodology.md) — linguistic and engineering methodology.
14. [Ukrainian target layer](ukrainian-target-layer.md) — IPA-to-Ukrainian mapping contract.
15. [Research index](../research/README.md) — active research programme and evidence workflow.
16. [Research master directive](../research/MASTER-DIRECTIVE.md) — non-negotiable research and implementation constraints.
17. [Acceptance gates](../research/ACCEPTANCE-GATES.md) — research and release acceptance criteria.
18. [Decision log](../research/DECISION-LOG.md) — append-only consequential decisions.
19. [Master execution plan and handoff](MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md) — append-only historical execution record; use the newest dated section. If the current audit records that the oversized handoff could not be safely appended, the audit's latest superseding continuation is authoritative for that session.

- [Licensing and permissions](LICENSING-AND-PERMISSIONS.md) — author identity, scientific-use permissions, technical permission boundary and third-party licence scope.

## Current project status — 2026-11-08

**Integration branch:** `main`. Latest runtime integration: PR [#461](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/461), merged as `b014d0107a47c3117c7dcbdd8d403f7fca3c7d41`; it exposes the 40 source adjudications in the browser and Python Kozak Kim runtime metadata. PR [#460](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/460), merged as `1e97152e505c75fe294d56befd978789b719d59e`, establishes that audio is not an acceptance gate for source-based decisions. Earlier audited starting commit and PR verification snapshots are retained below as historical evidence.

The following PR #457 CI details are a historical verification snapshot, not the latest main-head result. The starting main-head runs `42415278464` and `42415278451` failed because of a malformed UGTPHON source-register CSV row and an incorrect pinned corpus-path expectation. PR #457 corrects both. Its exact-head verification is green:
- [System verification 42416681845](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681845): Python regression/data integrity, browser tests, source redistribution rights gate, and public-page build all passed. The metadata-only NIKL inventory was skipped by workflow policy.
- [Test matrix 42416681848](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681848): browser suite, Python 3.11/3.12/3.13, wheel installation, and teacher-corpus audit passed.
- [Research artifacts 42416681843](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681843) and [exhaustive test-case extraction 42416681889](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681889) passed.
- [Complete multi-engine run 42416681855](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681855) passed, including pinned corpus validation, benchmark adapters, multi-engine comparison, canonical mismatch-queue byte comparison, Browser Kozak Kim run, Native/Browser parity, SIGMORPHON comparison, and artifact upload.

Post-merge main verification [42418241279](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42418241279), [42418241284](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42418241284), [42418241294](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42418241294), and Pages deployment/live smoke [42418241365](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42418241365) also passed on `62ca357d`. The earlier mismatch-queue failure was a serialization-only difference: generated LF plus a final newline versus committed CRLF without a final newline. Normalizing the generated artifact to the committed format reproduced the exact committed Git blob SHA `59c0f4f9bb4bc2b0040eeba196646e6ece2efc25`. The exporter now writes that canonical format and has a regression test. This does not change the review-queue data or linguistic classifications.

**Readiness:** software verification is green on PR #457, but the project remains a bounded research prototype, not release-ready or independently research-certified. The 40 speaker-specific IPA gold cases remain unresolved; Ukrainian-target validation and independent linguistic review remain separate acceptance gates.

## 236-candidate engine work

- [236-candidate review](../research/kozak-kim-236-candidate-review-2026-11-05.md)
- [236-case engine integration](KOZAK-KIM-236-ENGINE-INTEGRATION-2026-11-06.md)
- [28-row residual evidence register](../research/kozak-kim-236-residual-review-2026-11-06.csv)
- [40-case no-audio engine-policy adjudication](KOZAK-KIM-40-NO-AUDIO-ADJUDICATION-2026-11-06.md)
- [40-row no-audio policy register](../research/kozak-kim-40-no-audio-engine-policy-2026-11-06.csv)
- [Independent IPA review protocol](KOZAK-236-INDEPENDENT-REVIEW.md)

## Documentation by responsibility

| Area | Canonical entry points | Contents |
|---|---|---|
| Product and usage | `README.md`, `WEB-SERVICE-USER-GUIDE.md`, `cli-and-api.md` | Browser service, CLI, API and user-facing behavior |
| Architecture and contracts | `architecture.md`, `methodology.md`, `KOREAN-IPA-RUNTIME-PROFILE-CONTRACT-2026-10-27.md`, `TYPED-IPA-ANNOTATION-BOUNDARY-2026-10-26.md` | Runtime boundaries, typed IPA and transformation stages |
| Ukrainian adaptation | `ukrainian-target-layer.md`, `IPA-FIRST-TARGET-CONSISTENCY-AUDIT-2026-10-11.md`, `IPA-TARGET-ADJUDICATION-BLOCKERS-2026-10-24.md` | Target correspondence, feature loss, review and abstention |
| Korean phonology | `korean-phonology.md`, `KOREAN-IPA-CONVENTION-REVIEW-2026-10-26.md`, `NATIVE-ENGINE-UNRESOLVED-CASES-2026-10-24.md` | Source phonology, IPA conventions and unresolved contexts |
| Evidence and rights | `evidence.md`, `METHODOLOGY-CLAIMS-AND-EVIDENCE-REGISTER-2026-10-30.md`, `NIKL-LOCAL-CAPTURE-AND-INVENTORY-2026-10-24.md` | Provenance, claim scope, licensing and source limitations |
| Benchmarks | `KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md`, `BENCHMARK-REVIEW-2026-10-24.md`, `MULTI-ENGINE-KOREAN-IPA-BENCHMARK-2026-10-24.md` | Benchmark definitions, results and interpretation |
| Kozak Kim / 236-case cohort | `KOZAK-KIM-236-ENGINE-INTEGRATION-2026-11-06.md`, `KOZAK-236-INDEPENDENT-REVIEW.md`, `../research/kozak-kim-236-candidate-review-2026-11-05.md`, `../research/kozak-kim-236-engine-integration-2026-11-06.csv`, `../research/kozak-kim-unmapped-mismatch-review-queue-2026-11-05.csv`, and `../research/RULE-COVERAGE.csv` | Exact runtime dispositions, reconstructed candidate cohort, profile-convention decisions, unresolved IPA strata and the independent-review protocol |
| Agent workflows | `../AGENTS.md`, `AGENT-WORKFLOWS.md`, `AGENT-SKILL-INTEGRATION-2026-11-01.md`, `AGENT-SKILLS-NIKL.md`, `../.agents/skills/` | Root task router, general engineering/audit/review skills, domain-specific evidence skills and upstream integration record |
| Historical audits | `audits/` and dated top-level audit documents | Point-in-time audit evidence; not automatically current |
| Design plans | `superpowers/specs/`, `superpowers/plans/`, `superpowers/ledger.md` | Design history and implementation ledger |

## Repository map

- `src/korean_ukrainian/` — Python domain model, native Korean analysis, IPA, target renderer, pipeline, CLI/API and research adapters.
- `src/vendor/g2pk/` — pinned browser-side third-party G2P implementation; preserve upstream attribution and license notices.
- `src/app/`, `src/main.js`, `src/styles/` — browser application and presentation.
- `data/korean/` — Korean inventories, phonology, lexical pronunciations, IPA adjudication/overrides and research corpora.
- `data/correspondence/` — target correspondence and feature-weight contracts.
- `data/validation/` — validation cases and fixtures.
- `schemas/` — machine-readable JSON schemas.
- `scripts/` — generators, importers, audits, benchmarks and research tooling.
- `tests/` — Python and browser tests, fixtures and corpora.
- `research/` — active research records, source register, rule coverage, 236-occurrence cohort, evidence queues, decisions and acceptance gates. The 236-row cohort is reconstructed candidate membership, not proof of the original historical selector; see the [candidate review](../research/kozak-kim-236-candidate-review-2026-11-05.md), [engine integration ledger](../research/kozak-kim-236-engine-integration-2026-11-06.csv) and [independent review protocol](KOZAK-236-INDEPENDENT-REVIEW.md).
- `AGENTS.md` — root agent entry contract and skill router.
- `docs/` — architecture, methodology, user/developer guidance, audit reports and execution history; use [the structure guide](REPOSITORY-STRUCTURE.md), [agent workflow guide](AGENT-WORKFLOWS.md) and this index rather than guessing from filenames.
- `.github/workflows/` — CI, benchmark, corpus, Pages and research workflows.
- `public/` — static assets and third-party notices/licenses.

## How to decide which document is authoritative

- Runtime behavior is defined by current source code, schemas, data contracts and tests—not by a dated narrative report.
- Current research status is defined by the newest exact-head evidence and the current acceptance-gate/decision records.
- Dated audits are immutable historical evidence. Add a superseding entry instead of rewriting historical conclusions.
- The master handoff is append-only. Its newest dated entry supersedes older statements where they conflict; if a safe append is blocked by file-size limits, the latest dated repository-audit continuation supersedes the stale handoff snapshot and records that blocker.
- Benchmark figures must retain their dataset, split, normalization profile, denominator and limitations. Do not compare different IPA profiles as if they were the same target.
- A test passing verifies the asserted software contract; it does not establish independent linguistic gold or licensing permission.

## Documentation maintenance rules

1. Update this index when adding a new canonical document or changing ownership of a documentation area.
2. Keep one current entry point per subject; link detailed dated evidence rather than duplicating it.
3. Put current project-wide status in the repository audit/continuation entry and research acceptance gates. Do not create another competing master plan.
4. Keep research claims linked to source IDs, exact scope and rights status.
5. Label hypotheses, reconstructed forms, candidate pronunciations and provisional Ukrainian renderings explicitly.
6. Do not delete dated audit records, benchmark artifacts or source packets merely because a newer summary exists.
7. When a repository-local skill changes, update root `AGENTS.md` routing, the skill catalogue and its structural contract test where one protects a real invariant.


### Source-register rights checks

- `npm run audit:source-register` — read-only CSV structure and rights-triage report.
- `npm run audit:source-rights` — strict release gate. It fails only when a positively recorded copied/included/redistributed artifact lacks an item-level rights decision; citation-only sources and explicitly negated no-copy statements are not redistribution blockers.

Research use does not itself waive copyright. A citation-only source is different from copied text, data, or other retained material; actual retained material must have a recorded license scope and preserve its required attribution/notices.


## Third-party rights and independent review

- [UGTPHON Korean-subset source-rights audit](KOZAK-236-SOURCE-RIGHTS-AUDIT-2026-11-06.md) — pinned source, Apache-2.0 declaration, residual chain-of-title caveat and distribution limits.
- [236-case independent review protocol](KOZAK-236-INDEPENDENT-REVIEW.md) — blind reviewer packet contract, private coordinator map and separate Ukrainian target acceptance.
- [Third-party licences and notices](../licenses/README.md) — licence texts and notices for retained third-party research material, separate from the root project-code licence.


## Current benchmark execution contract

The canonical mode-coverage matrix, denominator definitions, Super-soft 100% candidate-availability requirement and exact-main verification status live in [methodology — mode coverage and output availability](methodology.md#mode-coverage-and-output-availability-contract-2026-11-08). Keep benchmark navigation here; do not duplicate the scoring rules in a second register.
