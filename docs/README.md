# Documentation map

This page is the entry point for project documentation. It distinguishes current operating contracts from dated research records and append-only execution history.

## Start here

1. [Project README](../README.md) — product overview, installation entry points, public service, runtime modes and limitations.
2. [Root agent instructions](../AGENTS.md) — repository-wide task routing and non-negotiable contracts.
3. [Agent workflow guide](AGENT-WORKFLOWS.md) — maintained skills, task lifecycle, evidence rules and review/verification process.
4. [Repository structure guide](REPOSITORY-STRUCTURE.md) — current component map, data ownership, runtime entry points, development commands and safe navigation.
5. [UGTPHON five abstentions — source-only follow-up](UGTPHON-FIVE-ABSTENTIONS-RESOLUTION-2026-11-06.md) — exact NIKL-backed `삶의` variant set and the remaining `칡칡이` source limitation.
6. [40-case source-only adjudication — 2026-11-07](KOZAK-KIM-40-SOURCE-ONLY-ADJUDICATION-2026-11-07.md) — source-backed structural and broad-profile decisions for all 17 token spellings / 40 residual occurrences, with speaker-specific IPA limits kept separate.
7. [Repository audit and structure — 2026-11-06](REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md) — current continuation for repository, CI, 236-case, no-audio policy, source-rights and readiness status.
8. [Engineering workflow reference audit — 2026-11-06](ENGINEERING-WORKFLOW-REFERENCE-AUDIT-2026-11-06.md) — pinned review of Unlazy, Superpowers, Matt Pocock skills and Ponytail with explicit adoption boundaries.
9. [Previous repository audit — 2026-11-04](REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-04.md) — historical snapshots; latest addendum 2026-11-05, including engine isolation and historical mismatch blockers.
10. [Versioning policy](VERSIONING-POLICY.md) — independent browser and Python release streams.
11. [Architecture](architecture.md) — concise system architecture.
12. [Methodology](methodology.md) — linguistic and engineering methodology.
13. [Ukrainian target layer](ukrainian-target-layer.md) — IPA-to-Ukrainian mapping contract.
14. [Research index](../research/README.md) — active research programme and evidence workflow.
15. [Research master directive](../research/MASTER-DIRECTIVE.md) — non-negotiable research and implementation constraints.
16. [Acceptance gates](../research/ACCEPTANCE-GATES.md) — research and release acceptance criteria.
17. [Decision log](../research/DECISION-LOG.md) — append-only consequential decisions.
18. [Master execution plan and handoff](MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md) — append-only historical execution record; use the newest dated section. If the current audit records that the oversized handoff could not be safely appended, the audit's latest superseding continuation is authoritative for that session.

- [Licensing and permissions](LICENSING-AND-PERMISSIONS.md) — author identity, scientific-use permissions, technical permission boundary and third-party licence scope.

## Current project status — 2026-11-07

**Current branch:** main. **Starting commit for this documentation pass:** d2f942d0615df3da2a973a2709f8738f65da18d9. **Latest merged implementation:** PR [#454](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/454), merge commit d2f942d0615df3da2a973a2709f8738f65da18d9.

### What the 236 cases mean

The reconstructed 236-row cohort is **not 236 independently confirmed phonological rules**:

| Cohort disposition | Rows | What is actually established |
|---|---:|---|
| Exact standard-form runtime dispositions | 15 | Ten exact integrations plus five pre-existing exact licenses; no spelling rewrite |
| Profile-convention decisions | 181 | Bounded broad/narrow or transcription-profile distinctions; not 181 new categorical rules or speaker-level IPA gold |
| Original abstentions | 12 | Engine policy explicitly decided under the no-audio constraint; speaker-specific IPA remains unresolved |
| Previously unadjudicated residuals | 28 | Engine policy explicitly decided under the no-audio constraint; speaker-specific IPA remains unresolved |
| **Total** | **236** | Reconstructed candidate cohort; original historical selector membership is not independently proven |

Thus, **15/236 have exact standard-form runtime dispositions**. The 181 are handled as bounded profile decisions/non-promotions, not as a set of new production rules. The remaining 40 have explicit no-audio engine-policy dispositions (including conditional phrase-mode behavior where word boundaries are explicit), but **40/40 remain unresolved as speaker-specific IPA gold**. The original 236/239 cohort membership is reconstructed, not proven from the original selector/member list. See the [236-case integration record](KOZAK-KIM-236-ENGINE-INTEGRATION-2026-11-06.md), [40-case policy record](KOZAK-KIM-40-NO-AUDIO-ADJUDICATION-2026-11-06.md), and machine-readable registers.

### Latest measured pronunciation benchmarks

The latest exact-head diagnostics are from PR #454 before its squash merge. They are Korean G2P comparisons, **not Ukrainian transcription accuracy**:

| Dataset / engine | Scored | Exact match | CER | Coverage |
|---|---:|---:|---:|---:|
| UGTPHON Korean test — Native | 2,701 | 53.1285% (1,435) | 8.9418% | 99.9260% |
| UGTPHON Korean test — g2pK 0.9.4 | 2,703 | 53.0892% (1,435) | 9.2328% | 100% |
| SIGMORPHON 2021 Korean test — Native | 998 | 35.8717% (358) | 14.5598% | 99.90% of 999 eligible |
| SIGMORPHON 2021 Korean test — g2pK 0.9.4 | 999 | 35.3353% (353) | 14.8222% | 100% |

- UGTPHON paired comparison: 2,701 shared occurrences; same exact-match count, Native CER lower by 0.2856 percentage points. Native abstained on two occurrences rather than guessing.
- SIGMORPHON paired comparison: 998 shared words; Native exact-match rate higher by about 0.50 percentage points and CER lower by about 0.25 points. The Native engine abstained on one word.
- Multi-engine SIGMORPHON diagnostic: Native was 358/998 exact (35.8717%), ahead of g2pK (353/999; 35.3353%) and the other installed deterministic/phonemizer baselines in that run. This is a dataset- and convention-specific diagnostic, not proof of normative accuracy.
- CharsiuG2P and ByT5 inference were skipped by policy; no neural score is claimed.

Evidence: [UGTPHON diagnostic](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42292493640), [multi-engine comparison](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42292493822), and [exact-head system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42292493613).

For the authoritative task ledger and exact evidence, use the [current repository audit](REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md), [research acceptance gates](../research/ACCEPTANCE-GATES.md), [research roadmap](../research/ROADMAP.md), and the linked 236/40-row registers.

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
