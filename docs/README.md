# Documentation map

## Current verified checkpoint — 2026-11-10 10:20 UTC+2

**Default branch:** `main` at `920b6365539058b658348855c5daddc066558b15`.  
**Active integration PR:** [#465](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/465), branch `benchmark/five-dataset-matrix-reconciled-2026-11-09`.  
**Exact current PR head:** `1cf42b8d75ce3de2df6ad36dcca7208a255af342` (37 commits; 20 changed files; GitHub reports mergeable=true, merge state unstable while checks run).

### Exact-head verification

- Tests [42778967231](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42778967231): **PASS** — Python 3.11, 3.12, 3.13; Browser; wheel install; teacher-corpus audit.
- System Verify [42778967019](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42778967019): **PASS** — Python regression/data integrity and Browser regression/build.
- Master table and research corpus artifacts [42778967136](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42778967136): **PASS**.
- External UGTPHON diagnostic [42778967047](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42778967047): **PASS**.
- Exhaustive test-case register extraction [42778967366](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42778967366): **PASS**.
- Official NIKL inventory: **SKIPPED** (metadata-only/policy gate; not a pass).
- Full multi-engine matrix [42778967197](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42778967197): **IN PROGRESS** at `Run multi-engine comparison`. ByT5 and CharsiuG2P jobs were skipped by workflow conditions; they are not benchmark passes.

### K-SPAN data-quality status

The pinned K-SPAN 2.1 source join contains 63,836 rows. The official Table 1 mapping is used. Source WorldBet fields `ModernPhon` and `ConservativePhon` feed IPA scoring; parallel key fields are independently audited. The 22,843 key/WorldBet discrepancies (Modern 13,078; Conservative 9,765) remain an explicit **WARN**. No rows are silently dropped or rewritten. This is not a K-SPAN integrity PASS.

### Task ledger

| Workstream | Status | Evidence / acceptance |
|---|---|---|
| Repository navigation and ownership documentation | DONE_VERIFIED | PR #464 merged; root README, docs map, structure guide and agent/contributor contracts exist |
| Mainline reconciliation for benchmark implementation | DONE_VERIFIED | PR #465 is based on current main; exact head is mergeable; no blind merge |
| Python/browser regression and package checks | DONE_VERIFIED | Run 42778967231 |
| System verification and research artifact generation | DONE_VERIFIED | Runs 42778967019 and 42778967136 |
| UGTPHON external diagnostic | DONE_VERIFIED | Run 42778967047 |
| Exhaustive test-case register extraction | DONE_VERIFIED | Run 42778967366 |
| Five-dataset multi-engine matrix and aggregate schema | PARTIAL | Run 42778967197 still in progress; require completion plus aggregate artifact/schema inspection |
| K-SPAN key/WorldBet semantic consistency | BLOCKED / WARN | 22,843 source-field discrepancies need independent source interpretation; scoring remains on source WorldBet labels |
| Independent Korean IPA gold review | BLOCKED | Reviewer adjudication evidence not complete |
| Independent Ukrainian target-layer review | BLOCKED | Separate target-language acceptance remains outstanding |
| Restricted-source historical membership/raw-offset and rights gates | BLOCKED | Must be satisfied per source before any expanded claim or redistribution |
| Neural comparison engines (ByT5, CharsiuG2P) | DEFERRED for this run | Workflow conditions skipped them; no performance claim is made |

### PR and branch disposition

PR #465 is the current integration candidate. PR #463 (older divergent five-dataset implementation) and PR #462 (SIGMORPHON Browser verification) remain open and untouched pending final changed-file reconciliation; do not merge them independently into the same paths. PR #464 is already merged and supplies the documentation/navigation baseline. Historical branches are preserved.

### Readiness

**Current classification: software-verified research prototype; not release-ready and not independently research-certified.** The exact-head software checks above pass, but the full multi-engine matrix/schema, independent Korean IPA review, Ukrainian target review, and source-specific research/rights gates remain outstanding. A successful workflow run alone is not sufficient: inspect the aggregate artifact and confirm its schema and warning metadata before changing this status.


## Latest integration checkpoint — 2026-11-10

**Main base:** `920b6365539058b658348855c5daddc066558b15`.  
**Active PR:** [#465](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/465), `benchmark/five-dataset-matrix-reconciled-2026-11-09`.  
**Verification snapshot PR head:** `de841219a3ecc50db874ebde90d250edce7cdf9f` (33 commits ahead, 0 behind; 20 changed files; GitHub mergeability: clean).  
**Matrix runtime snapshot:** `dfbaf4d122dd48377c56f79227c65617aa9eed6d`; the newer PR-head commits after this snapshot are documentation/test-workflow coordination only, not benchmark-runtime changes.

### Exact latest-head checks

- Tests [42777829552](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42777829552): **PASS**.
- System Verify [42777829403](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42777829403): **PASS**.
- Master/research artifacts [42777829668](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42777829668): **PASS**.
- External UGTPHON diagnostic [42777829606](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42777829606): **PASS**.
- Exhaustive test-case register extraction [42777829427](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42777829427): **PASS**.
- NIKL metadata-only inventory remains **SKIPPED** by policy.

### Full matrix status — not yet complete

- The pinned multi-engine/open-dataset run [42776987807](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42776987807) is running on runtime snapshot `dfbaf4d1`.
- Completed successfully in that run: source/input validation; benchmark adapter tests; training-readiness/holdout-overlap audit; independent IPA review-packet generation; 10-engine UGTPHON comparison; mismatch-ledger export; UGTPHON Browser modes; mode-availability check; Native/Browser parity.
- The SIGMORPHON 10-engine comparison is currently running. Seoul, K-SPAN Modern/Conservative, IPA-Dict, Browser follow-ups and final aggregate/schema gates must still complete.
- A fresh full-matrix run [42777829497](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42777829497) is queued for exact latest PR head `de841219`. Do not claim full-matrix PASS or schema PASS until this exact-head run completes and its aggregate artifact is inspected.

### K-SPAN evidence boundary

The official K-SPAN 2.1 Table 1 mapping is used (`o → e → e`, `p → E → ɛ`, `x → th → tʰ`, `m → ix → ɯ`, `j → ˆ → ʌ`, `u → jˆ → jʌ`, `7 → ixi → ɯi`). The 63,836-row join retains all rows. Scoring converts source `ModernPhon` / `ConservativePhon` WorldBet fields directly to IPA; parallel key fields are independently audited. Their 22,843 discrepancies (Modern 13,078; Conservative 9,765) remain explicit **WARN**, not PASS. Aggregate-only summaries retain warning status/counts and omit row-level examples.

### CI cancellation policy

The benchmark workflow now uses `cancel-in-progress: false`: an already-running pinned matrix is allowed to finish; newer PR revisions queue behind it, with only the latest pending revision retained. This addresses repeated cancellation by documentation-only PR commits.

### Readiness and disposition

PR #465 remains OPEN and unmerged pending the exact-head matrix and schema. PRs [#463](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/463) and [#462](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/462) remain open and untouched; their changed-file scopes overlap with #465, but close them only after #465 passes and unique scope is reconciled. No historical branch was deleted or force-updated.

The repository remains a software-verified, evidence-scoped research prototype, not release-ready or independently research-certified. Independent Korean IPA review, separate Ukrainian target review, historical membership/raw-offset evidence and restricted-dataset access remain separate acceptance gates.


## Historical repository status snapshot — 2026-11-10 (PR head d71, superseded)



**Default branch:** `main` — `920b6365539058b658348855c5daddc066558b15`.  
**Active integration:** [PR #465](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/465), branch `benchmark/five-dataset-matrix-reconciled-2026-11-09`, based on `main`; no changes have been merged to `main`. The exact-head results below refer to verification snapshot `d71ef50f`; subsequent commits in this branch are documentation-only.

**Exact-head verification on PR head `d71ef50f`:**
- [Tests #42775887452](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887452) — **PASS** (Python 3.11/3.12/3.13, Browser, wheel install, teacher-corpus audit).
- [System Verify #42775887811](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887811) — Python and Browser **PASS**; NIKL metadata-only inventory **SKIPPED** by policy.
- [Master/research artifacts #42775887930](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887930) — **PASS**.
- [Exhaustive test-case register #42775887402](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887402) — **PASS**.
- [External UGTPHON diagnostic #42775887380](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887380) — **PASS**.
- [Multi-engine/open-dataset matrix #42775887397](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887397) — **CANCELLED**, not a pass. The preceding runtime/test head `c42b7f9` has a separate [matrix run #42775642949](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775642949), which was **IN_PROGRESS** at the last inspection. Its final artifact and schema must be inspected; green supporting workflows do not imply matrix completion.

**K-SPAN:** the official K-SPAN 2.1 mapping is versioned `kspan-worldbet-to-ipa-v2`. The previous full-matrix failure exposed WorldBet `wi`; the adapter now maps `wi → wi`, with regression coverage for `wi` and `kanixnkwi`. The 63,836-row source join still contains 22,843 parallel key/WorldBet discrepancies (Modern 13,078; Conservative 9,765). These remain `WARN`, not a clean integrity pass. Scoring uses source `ModernPhon` / `ConservativePhon`; key fields are audited independently.

**Fallback policy:** Browser Super-soft may emit a low-confidence, typed `orthographic-phonemic-fallback` candidate from the project correspondence table. It is not source-resolved IPA gold and is excluded from accuracy scoring. Python parity remains TODO.

**Task ledger:** mainline software/docs baseline — `DONE_VERIFIED`; benchmark adapters/preparation and source diagnostics — `PARTIAL`; full five-dataset matrix and aggregate schema acceptance — `PARTIAL`; Python fallback parity — `TODO`; independent Korean IPA and Ukrainian target review — `BLOCKED` pending qualified reviewers and frozen review sets. PRs [#463](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/463) and [#462](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/462) remain open and untouched pending #465 acceptance and unique-scope reconciliation.

**Readiness:** software-verified, evidence-scoped research prototype; not release-ready or independently research-certified.

## Start here

1. [Project overview and quick start](../README.md)
2. [Repository structure and ownership](REPOSITORY-STRUCTURE.md)
3. [Architecture](architecture.md) · [methodology](methodology.md) · [Ukrainian target layer](ukrainian-target-layer.md)
4. [Contributing](../CONTRIBUTING.md) · [agent workflows](AGENT-WORKFLOWS.md) · [root agent instructions](../AGENTS.md)
5. [Research programme](../research/README.md) · [master directive](../research/MASTER-DIRECTIVE.md)
6. [Acceptance gates](../research/ACCEPTANCE-GATES.md) · [source register](../research/SOURCE-REGISTER.csv) · [rule coverage](../research/RULE-COVERAGE.csv) · [decision log](../research/DECISION-LOG.md)
7. [Benchmark suite register](KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md) · [current benchmark PR #465](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/465)
8. [Engineering workflow reference audit](ENGINEERING-WORKFLOW-REFERENCE-AUDIT-2026-11-06.md) — Unlazy, Superpowers, Matt Pocock skills and Ponytail
9. [Licensing and permissions](LICENSING-AND-PERMISSIONS.md)
10. [Master execution plan and handoff](MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md) — append-only; use its newest dated section

## Documentation ownership

| Information | Canonical location | Maintenance rule |
|---|---|---|
| Product purpose, installation and public entry points | Root `README.md` | Concise overview; link to detail |
| Directory map, module ownership and workflows | `docs/REPOSITORY-STRUCTURE.md` | Update when paths or ownership change |
| Architecture and processing stages | `docs/architecture.md`, `docs/methodology.md` | Do not duplicate task ledgers |
| Korean evidence and provenance | `research/SOURCE-REGISTER.csv`, `research/RULE-COVERAGE.csv` | Preserve source scope and rights |
| Research plan and acceptance | `research/MASTER-DIRECTIVE.md`, `research/ACCEPTANCE-GATES.md` | One canonical gate register |
| Consequential decisions | `research/DECISION-LOG.md` | Append; do not rewrite history |
| Execution history | `docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md` | Append exact dated checkpoints |
| Agent procedures | `AGENTS.md`, `docs/AGENT-WORKFLOWS.md`, `.agents/skills/` | Small composable skills point to canonical registers |

Avoid creating another master plan, parallel source register, or duplicate skills catalogue.

## Superseded checkpoint — 2026-11-09

**Current default branch:** `main` at `920b6365539058b658348855c5daddc066558b15`.  
**Documentation/navigation foundation:** PR [#464](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/464) is merged; the documentation map, repository structure guide, contributor instructions and agent workflow guide remain the canonical navigation layer.  
**Current benchmark integration:** PR [#465](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/465), branch `benchmark/five-dataset-matrix-reconciled-2026-11-09`, head `253b0757f2043d9acf2ccaf191ce676e1161ee2d`. The branch is **9 commits ahead / 0 behind** main; GitHub reports it mergeable, but it is not accepted or merged while the full matrix is running.  
**Exact-head verification:** Tests [42692169587](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169587), System Verify [42692169687](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169687), master/research artifacts [42692169326](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169326), exhaustive test-case register [42692169308](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169308), and external UGTPHON diagnostic [42692169248](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169248) all completed successfully. System Verify's NIKL metadata-only inventory was **SKIPPED** by policy.  
**Full matrix:** [run 42692169459](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169459) is **IN_PROGRESS** on this exact head. UGTPHON multi-engine, Native/Browser parity, SIGMORPHON multi-engine, Browser Strict/Soft/Super-soft and Browser regression stages passed; the open Seoul + K-SPAN + IPA-Dict matrix is still running. No final five-dataset score, aggregate artifact or schema acceptance is claimed yet.

### K-SPAN source-data integrity — explicit warning, not a pass

The pinned K-SPAN 2.1 source contains 63,836 joined rows. Its official Table 1 provides the keystroke / WorldBet / IPA / jamo mapping; the implementation now scores the source `ModernPhon` and `ConservativePhon` WorldBet fields directly, while `ModernKey` and `ConservativeKey` are audited as parallel representations. The current audit finds **22,843 key/WorldBet discrepancies** (Modern 13,078; Conservative 9,765). They are retained as `WARN` metadata with per-track counts; no row is silently discarded or rewritten. Unknown symbols, missing NIKL WordNum joins, row-count drift and invalid source representations remain hard failures. This does not establish that the parallel source fields are semantically equivalent.

The current IPA mapping is versioned as `kspan-worldbet-to-ipa-v2`; the `wi` sequence is supported by the cited WorldBet source table. Keep the primary-source citation and mapping tests with the adapter.

### Open PRs and branch disposition

- PR #465 is the active controlled port from current main. Merge only after the exact-head full matrix, aggregate-only summary, JSON Schema validation and required checks pass.
- PR [#463](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/463) remains open and unmerged as the older divergent implementation. Do not merge it separately; reconcile or close it as superseded only after #465 is accepted.
- PR [#462](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/462) remains open and untouched; it is a narrower Browser/SIGMORPHON verification change that overlaps the consolidated work.
- Do not delete historical branches or force-update refs.

**Readiness:** software verification is green on the current PR head, but the five-dataset benchmark remains **PARTIAL** until run 42692169459 completes and its artifacts are inspected. Independent Korean IPA review, independent Ukrainian target review, historical cohort membership proof, raw `ㅠ` span validation and access/terms-gated speech corpora remain separate research gates. The repository is not release-ready or independently research-certified.



### Superseded historical documentation checkpoint

The following records describe the earlier PR #463 state before the controlled #465 port. They are retained because the append-only audit and documentation contract tests use them as historical evidence; they are not the current branch state.

- Audited baseline before PR #464: `45a02a62ce955c3db10eb0faaaa1ce8d9f2c9cdb`.
- Documentation merge: PR #464, `d2699911dbc70ef9978e5af06643b1281725a71a`.
- Post-merge main verification: `5c12f92c36ecae455dc4281dd7a8c0217f5dc4dc`; Tests [42679091769](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42679091769) and Pages live smoke [42679091977](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42679091977) passed.
- Superseded PR #463 head: `167c12a7e9945dc757a57ea734e9745aa69032f3`; its earlier full-matrix run [42665749678](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42665749678) failed in adapter tests before Seoul/K-SPAN/IPA-Dict execution. The current PR #465 uses corrected fixtures and current-main base; do not attribute that earlier failure to #465.

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
8. [Repository audit and structure — 2026-11-06](REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md#current-continuation--2026-11-09-documentation-and-pr-reconciliation) — current continuation for repository, CI, 236-case, no-audio policy, source-rights and readiness status.
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

## Historical project status snapshot — 2026-11-08 (superseded)

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
