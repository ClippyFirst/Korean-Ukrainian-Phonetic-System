# Repository audit and structure — 2026-11-06

## Latest integration checkpoint — 2026-11-10

**Default branch:** `main` at `920b6365539058b658348855c5daddc066558b15`.  
**Integration under review:** [PR #465](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/465), branch `benchmark/five-dataset-matrix-reconciled-2026-11-09`, exact head `840cb3f177e147dfe1ae53e7bdd26d524b699b64`.  
**Branch relationship:** 66 commits ahead of main, 0 behind. The branch is based on current main; this is not a merge-base conflict.

### Verified execution evidence

- **DONE_VERIFIED:** six ten-engine reference tracks and fifteen Browser Strict/Soft/Super-soft reports across five datasets — [run 42785083152](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42785083152). These are benchmark outputs, not independent IPA-gold certification.
- **DONE_VERIFIED:** six full-corpus Seoul Browser surface/phonemic reports — [run 42496539257](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496539257).
- **DONE_VERIFIED:** source preparation, full 63,836-row K-SPAN/NIKL WordNum join and master/research artifact generation — [run 42799423026](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42799423026) (PASS).
- **DONE_VERIFIED:** exhaustive test-case register extraction — [run 42799422733](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42799422733) (PASS).
- **DONE_VERIFIED:** external UGTPHON diagnostic — [run 42799422696](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42799422696) (PASS).

### Exact-head CI — currently failing, not accepted

On PR #465 head `840cb3f177e147dfe1ae53e7bdd26d524b699b64`:

| Workflow | Run | Result | Observed cause |
|---|---:|---|---|
| Verify | [42799422710](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42799422710) | FAIL | Source-register CSV shape; Browser link/checkpoint assertions |
| Tests | [42799422543](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42799422543) | FAIL | Same malformed CSV; Python 3.11/3.13 cancelled by fail-fast |
| Multi-engine | [42799422846](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42799422846) | FAIL | Aggregate summary builder cannot import sibling summarizer when run as a script; optional neural jobs skipped |
| Master/research artifacts | [42799423026](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42799423026) | PASS | Generation completed |
| Exhaustive register extraction | [42799422733](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42799422733) | PASS | Extraction completed |
| UGTPHON diagnostic | [42799422696](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42799422696) | PASS | Diagnostic completed |

The CSV defect affects three newly ported rows (IPA-Dict, Seoul SLR113 and NIKL MKUFS2): embedded thousands separators were not quoted, producing 13/13/15 parsed fields instead of the declared 12. Browser failures are a relative link incorrectly prefixed with `docs/` inside `docs/README.md` and a missing latest-checkpoint heading in the structure guide. These are being corrected at source; validation is not being weakened.

### Research and data-quality boundaries

- K-SPAN 2.1: 63,836 rows joined; 41,174 Hangul and 22,662 non-Hangul; zero unmatched NIKL WordNums.
- K-SPAN key/WorldBet consistency remains **WARN: 22,843** (Modern 13,078; Conservative 9,765). Source WorldBet fields drive IPA scoring; parallel key fields are audited separately and never silently rewritten.
- Super-soft 100% candidate availability is not 100% source-resolved IPA coverage or accuracy.
- SIGMORPHON and IPA-Dict share Wiktionary lineage; IPA-Dict is supplementary coverage, not an independent holdout.
- Optional CharsiuG2P/ByT5 inference and NIKL metadata-only inventory are **SKIPPED**, not passed.
- Legacy workflow artifacts with row-level material remain subject to their expiry/manual-cleanup boundary; see [benchmark artifact policy](BENCHMARK-ARTIFACT-POLICY.md).

### Task ledger and readiness

- **DONE_VERIFIED:** scoring matrix, Seoul full-corpus Browser runs, source joins and aggregate source preparation on their cited runs.
- **PARTIAL:** aggregate-only workflow integration; summary builder import fix and final artifact ZIP inspection remain.
- **TODO:** repair CSV quoting and documentation contract issues; rerun Python 3.11/3.12/3.13, Browser, Verify and full matrix on the final exact head; inspect uploaded artifact contents.
- **WARN:** K-SPAN parallel key/WorldBet source disagreement; preserve counts and source fields.
- **BLOCKED:** independent Korean IPA gold and independent Ukrainian target review; raw audio/speaker crosswalk and restricted corpus terms remain unavailable.
- **DEFERRED:** optional neural inference; not required for deterministic matrix acceptance.

**Readiness:** software-verified, evidence-scoped research prototype. Not independently research-certified or release-ready. Do not merge PR #465 until exact-head required CI is green and the aggregate artifact is inspected.

## Latest continuation — 2026-11-10 (exact PR #465 checkpoint)

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


## Historical continuation — 2026-11-10 (c42/d71 snapshots, superseded)

**Default branch:** `main` at `920b6365539058b658348855c5daddc066558b15`.  
**Active integration:** PR [#465](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/465), branch `benchmark/five-dataset-matrix-reconciled-2026-11-09`, current documentation head `f8aacff3087eb5a06d6195bd99171545f647cfe9`; runtime/test head `c42b7f9fee820d83fcbf8fdd75481cab6bc1dfcb`. The branch is based directly on current main; no merge to main has been made.

### Verification on the previous exact head

- Tests [42775398078](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775398078): PASS — Python 3.11/3.12/3.13, Browser, wheel install and teacher-corpus audit.
- System Verify [42775398457](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775398457): Python and Browser PASS; NIKL metadata-only SKIPPED.
- Master/research artifacts [42775398092](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775398092): PASS.
- The b96 multi-engine run [42775398355](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775398355) was cancelled after a newer c42 exact-head run was started; it is not counted as a pass.

### Exact-head CI on c42b7f9 (runtime/test commit)

- Tests [42775643077](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775643077): **PASS** — Python 3.11/3.12/3.13, Browser tests/build, wheel installation and teacher-corpus audit.
- System Verify [42775643096](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775643096): Python and Browser **PASS**; NIKL metadata-only inventory **SKIPPED** by policy.
- Master/research artifacts [42775643066](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775643066): **PASS**.
- Documentation-anchor follow-up Verify [42775637799](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775637799): **PASS**.
- External UGTPHON diagnostic [42775643307](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775643307) and exhaustive test-case extraction [42775643206](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775643206): **IN_PROGRESS** at last inspection.
- Full multi-engine/open-dataset matrix [42775642949](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775642949): **IN_PROGRESS** in the pinned multi-engine comparison. No final matrix score or summary-schema PASS is claimed.
- The prior run [42697496037](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42697496037) reached aggregate JSON Schema validation after producing K-SPAN Modern/Conservative and IPA-Dict Browser reports, then failed because numeric `ipa_profile_version: 1` did not satisfy the schema's string/null type. The summarizer now normalizes non-null versions to strings and a regression test exercises the numeric case.
- Current documentation-only head: `f8aacff3087eb5a06d6195bd99171545f647cfe9`. Its Verify run [42775760233](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775760233) is queued; the c42 runtime/test head has passed the exact checks above.


### K-SPAN data-quality status

The official K-SPAN 2.1 Table 1 remains the source for keystroke/WorldBet/IPA/jamo mapping. Scoring uses source `ModernPhon` / `ConservativePhon` WorldBet references. Parallel key fields are audited independently: 22,843 discrepancies (Modern 13,078; Conservative 9,765) remain a visible `WARN`, not a pass. Rows are not silently discarded or rewritten.

### User-approved fallback policy

For genuinely unresolved morphology, the Browser Super-soft research mode may use the repository's per-grapheme `data/korean/canonical_correspondence.csv` table to construct approximate IPA and then pass that IPA through the ordinary IPA→Ukrainian renderer. The result is typed `orthographic-phonemic-fallback`, marked low confidence, and exposed only as a candidate. It is excluded from source-resolved IPA accuracy scoring. Strict/Soft remain unchanged. The table is project-defined (`model-selected`), not represented as an official Ukrainian national standard. The Python API does not yet expose this fallback; cross-runtime parity is a separate TODO.

### Current ledger and readiness

| Workstream | State | Acceptance / blocker |
|---|---|---|
| Mainline software and documentation baseline | DONE_VERIFIED | Mainline checks passed on the recorded main snapshot. |
| Benchmark preparation, K-SPAN source adapter and integrity diagnostics | PARTIAL | Source mapping grounded; exact full-matrix/schema result still required; 22,843 cross-field discrepancies remain WARN. |
| Summary schema normalization and regression | DONE_VERIFIED on b96 | Exact-head tests passed; rerun on c42 pending. |
| Grapheme-table Browser Super-soft fallback | DONE_VERIFIED in Browser test suite | 11,172 modern Hangul syllable candidate-availability test exists; new trace-to-table assertion is awaiting c42 CI. |
| Python fallback parity | TODO | Implement only with matching provenance/status and Python/browser trace parity tests. |
| Independent Korean IPA and Ukrainian target review | BLOCKED | Qualified independent review and frozen evidence sets are still required. |
| PR #463 / #462 reconciliation | TODO | Leave #463/#462 untouched until #465 passes; then inspect unique scope before closing superseded PRs. |

**Readiness:** software-verified, evidence-scoped research prototype; not release-ready or independently research-certified. No local shell/npm/pytest run is claimed in this connector-only session.


---

## Current continuation — 2026-11-09 five-dataset benchmark port (PR #465)

This entry supersedes the earlier #463 divergence and failing-test checkpoint below. It records the controlled port based on the current default branch; earlier audit entries remain historical evidence.

### Repository and branch state

- Default branch: `main`, base SHA `920b6365539058b658348855c5daddc066558b15`.
- Active branch: `benchmark/five-dataset-matrix-reconciled-2026-11-09`.
- Active PR: [#465](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/465), head `253b0757f2043d9acf2ccaf191ce676e1161ee2d), 9 commits ahead / 0 behind main; GitHub reports mergeable.
- Older PR #463 remains open and unmerged; PR #462 remains open and untouched. Neither is merged into #465 by assumption; the #465 branch was created from current main and carries the selected benchmark files.

### Exact-head verification

- Tests [42692169587](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169587): PASS — Python 3.11/3.12/3.13, wheel install, web and teacher-corpus audit.
- System Verify [42692169687](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169687): Python and Browser PASS; official NIKL metadata-only inventory SKIPPED by policy.
- Master/research artifacts [42692169326](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169326): PASS.
- Exhaustive test-case register extraction [42692169308](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169308): PASS.
- External UGTPHON diagnostic [42692169248](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169248): PASS.
- Multi-engine/full matrix [42692169459](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169459): IN_PROGRESS on the exact head. UGTPHON engine comparisons, Native/Browser parity, SIGMORPHON engine comparisons, SIGMORPHON Browser three-mode reports and Browser regression suite completed successfully. The Seoul + K-SPAN + IPA-Dict open matrix is still running; artifact upload and final summary/schema validation have not completed.

### K-SPAN evidence and data-quality disposition

The official K-SPAN 2.1 PDF Table 1 was extracted from the pinned source bundle in the earlier diagnostic run [42655211788](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42655211788). The adapter now treats `ModernPhon` and `ConservativePhon` as the source WorldBet reference fields and converts them directly to IPA. `ModernKey` and `ConservativeKey` are separately audited; they do not override or silently rewrite the reference fields.

The 63,836-row join reports 22,843 key/WorldBet discrepancies: Modern 13,078 and Conservative 9,765. The workflow retains this as explicit WARN metadata and includes per-track counts. The aggregate-only summary must preserve status and counts but omit row-level examples. Unknown symbols, missing NIKL WordNum joins, row-count drift and invalid WorldBet values remain hard failures. The 22,843 discrepancies are not declared resolved; their source semantics require independent interpretation.

The current mapping identifier is `kspan-worldbet-to-ipa-v2`; it includes the attested WorldBet `wi` sequence with its primary-source basis recorded in the adapter metadata and regression tests. No unsupported IPA form or score is inferred from the discrepancy count.

### Current task ledger

| Task | Status | Evidence / acceptance |
|---|---|---|
| Port benchmark integration onto current main | DONE_VERIFIED as branch reconciliation | PR #465 is 9 ahead / 0 behind; exact file diff is limited to benchmark workflow, adapter, source register, schema, scripts and tests. |
| Repair CSV delimiter and K-SPAN fixture expectations | DONE_VERIFIED | Exact-head Tests and System Verify passed. |
| UGTPHON 10-engine comparison and Browser modes | DONE_VERIFIED for this run | Full matrix run 42692169459 reports these stages passed; preserve dataset-specific denominators and diagnostic-only interpretation. |
| Native/Browser parity | DONE_VERIFIED for this run | Parity stage passed in run 42692169459. |
| SIGMORPHON 10-engine comparison and Browser modes | DONE_VERIFIED for this run | Engine and three-mode Browser stages passed in run 42692169459. |
| Seoul + K-SPAN + IPA-Dict open matrix | PARTIAL | Still running in run 42692169459; acceptance requires every configured track, valid joins and source integrity. |
| Aggregate-only JSON summary and schema validation | TODO / PENDING | Workflow has not reached final artifact upload/summary/schema stage. Require schema validation on final generated JSON and inspect artifact. |
| K-SPAN parallel key/WorldBet semantic consistency | WARN / BLOCKED | 22,843 mismatches remain; source-field scoring is explicit, but equivalence of parallel representations is not established. |
| Independent Korean IPA gold review | BLOCKED | Qualified independent reviewers and blind adjudication required. |
| Independent Ukrainian target validation | BLOCKED | Frozen IPA inputs and separate Ukrainian-reader acceptance required. |
| Historical 236/239 selector proof; raw `ㅠ` offset validation | BLOCKED / PARTIAL | Original contemporaneous selector and raw-span evidence are still absent. |
| KsponSpeech / NIKL speech-corpus acquisition | BLOCKED | Access and corpus-specific licensing terms remain unresolved; NIKL metadata-only inventory is skipped, not passed. |
| Optional ByT5 / Charsiu inference | DEFERRED | Optional jobs skipped by policy; not required for the current diagnostic matrix. |

### PR and branch decisions

PR #465 is the only active integration candidate. Do not merge until run 42692169459 completes successfully, its aggregate-only artifact and schema are inspected, and all required exact-head checks remain green. PR #463 is older and divergent; leave open until #465 is accepted, then close as superseded if no unique scope remains. PR #462 remains untouched pending that same reconciliation. No historical branch is deleted or force-updated.

### Readiness

**Current status: PARTIAL research prototype.** Software verification is green; the complete five-dataset matrix is not yet verified. Even after matrix completion, independent Korean IPA review, Ukrainian target acceptance and unresolved provenance/access gates prevent a claim of research certification or release readiness.




**PR #463 divergence refresh:** compared against main HEAD `80c0361c0b91b6747fd262c5b729bcb8ed0bbf17`, the benchmark branch is 91 commits ahead / 27 behind from merge base `6ef4960fca292b8e5bfa296bebb75f32fe6b1a7f`. The main-only side touches 13 paths. This comparison snapshot predates the final status-only commit that records it.



### Post-merge closure — PR #464

PR [#464](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/464) was squash-merged into `main` as `d2699911dbc70ef9978e5af06643b1281725a71a`. The documentation branch head was `db61448373dd179ced0c61332a9bdf0ca53f96a3`; the PR was five commits ahead of its base and zero behind.

Exact PR-head checks all passed:
- Tests [42678483929](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42678483929): Python 3.11/3.12/3.13, web, wheel-install and teacher-corpus audit PASS.
- System Verify [42678483721](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42678483721): Python and Browser PASS; NIKL metadata-only SKIPPED.
- Exhaustive test-case register extraction [42678483928](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42678483928): PASS.
- Master/research artifact generation [42678483855](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42678483855): PASS.
- Exact-head push Verify [42678302945](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42678302945): PASS.

The post-merge main workflows are separate runs and must be checked independently: Tests [42678644963](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42678644963), Verify [42678644939](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42678644939), master/research artifacts [42678645435](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42678645435), and Pages [42678645363](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42678645363). **Post-merge main verification passed on `5c12f92c36ecae455dc4281dd7a8c0217f5dc4dc`:** Tests [42679091769](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42679091769), System Verify [42679091895](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42679091895), master/research artifacts [42679091976](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42679091976), and Pages deployment/live smoke [42679091977](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42679091977) all **PASS**. NIKL metadata-only remained **SKIPPED** by policy.

**Documentation/navigation reconciliation: DONE_VERIFIED on PR #464 head and merged into main.** The benchmark and independent linguistic acceptance blockers remain unchanged.

## Current continuation — 2026-11-09 documentation and PR reconciliation

**Audited main:** `45a02a62ce955c3db10eb0faaaa1ce8d9f2c9cdb`.  
**Default branch:** `main`.  
**Documentation work branch:** `docs/repository-navigation-reconciliation-2026-11-09`, created from the audited main HEAD.  
**Scope:** reconcile current documentation, navigation and evidence status; no benchmark/runtime code or dataset was changed in this documentation pass.

### Verified mainline workflows

| Workflow | Result | Run |
|---|---|---|
| Tests | PASS | [42591577770](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591577770) |
| System Verify | PASS | [42591577711](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591577711) |
| Master table / research artifacts | PASS | [42591577812](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591577812) |
| Pages deployment / live smoke | PASS | [42591577865](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591577865) |

NIKL metadata-only inventory: SKIPPED by policy. No local shell, npm or pytest command was run in this connector-only continuation.

### Current PR state and benchmark failures

- PR [#463](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/463) is OPEN / UNMERGED; head `167c12a7e9945dc757a57ea734e9745aa69032f3`; GitHub mergeability state `dirty`.
- PR #463 branch is 91 commits ahead and 27 behind main, with merge base `6ef4960fca292b8e5bfa296bebb75f32fe6b1a7f`. The 27 main-only commits touch 13 files: `.github/PULL_REQUEST_TEMPLATE.md`, `CONTRIBUTING.md`, `README.md`, `docs/AGENT-WORKFLOWS.md`, `docs/BENCHMARK-RESULTS-2026-11-08.md`, `docs/ENGINEERING-WORKFLOW-REFERENCE-AUDIT-2026-11-06.md`, `docs/KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md`, `docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md`, `docs/README.md`, `docs/REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-06.md`, `docs/REPOSITORY-STRUCTURE.md`, `tests/agent-workflow-structure-contract.test.mjs`, and `tests/kozak-kim-methodology-contract.test.mjs`. Do not infer that all 91 ahead commits are unique code changes; the merge-base comparison is the relevant branch relation.
- [Verify 42665749636](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42665749636): Python regression/data integrity FAILED; Browser regression/build PASSED; NIKL metadata-only SKIPPED.
- [Full matrix 42665749678](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42665749678): benchmark-adapter tests FAILED, so later comparison, Browser, Seoul, K-SPAN, IPA-Dict and aggregate-summary steps were SKIPPED. Its artifact upload does not make those skipped stages complete.
- Exact test failures:
  - `test_kspan_key_worldbet_mismatch_is_rejected`: CSV reader receives a two-character delimiter string (`"\\t"`) and raises `TypeError: "delimiter" must be a 1-character string`.
  - `test_nikl_word_index_and_kspan_worldbet_integrity`: expected `kijʌk`, actual adapter output `kijɐk`; fixture expectation is inconsistent with the corrected /ɐ/ mapping.
  - Summary: 2 failed, 88 passed, 3 subtests passed.
- PR #463's acceptance gate remains open: repair both tests, rerun the adapter suite, then run the full five-dataset matrix on the exact final head and validate all expected reports, source integrity, joins and aggregate schema.

PR [#462](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/462) remains OPEN / UNMERGED. It is the narrower earlier SIGMORPHON Browser verification change. Leave it untouched until #463 is accepted; if #463 is later merged, close #462 as superseded instead of merging duplicate workflow code.

### Branch inventory

GitHub's paginated branch search returned 31 refs total: `main` plus 30 non-main refs, including the documentation reconciliation branch created for this pass. Historical research/fix/documentation refs and the two benchmark PR refs were preserved. No branch was deleted or force-updated.

### Reference repositories revalidated

The current default-branch HEADs of all four supplied references still match the commits recorded in [the workflow reference audit](ENGINEERING-WORKFLOW-REFERENCE-AUDIT-2026-11-06.md). The review therefore remains revision-current as of this date. Selected practices remain process-only; no third-party code, skills, hooks, plugins, artwork or benchmark data were copied.

### Task ledger

| Task | State | Evidence / acceptance |
|---|---|---|
| Mainline software workflows | DONE_VERIFIED | Four exact-main workflows above pass; NIKL metadata-only is explicitly skipped. |
| Documentation navigation and status reconciliation | DONE_VERIFIED | README, documentation map, structure guide, this audit, handoff and reference-audit snapshot updated on the documentation branch; exact-head CI still required. |
| Four upstream workflow references | DONE_VERIFIED | Current HEADs rechecked; all match pinned audit snapshots; no material imported. |
| PR #463 five-dataset matrix | PARTIAL | Two adapter tests fail; downstream benchmark stages skipped. |
| PR #463 mainline reconciliation | TODO | Reconcile 27 main-only commits / 13 affected paths after benchmark tests pass; inspect conflicts and rerun exact-head gates. |
| PR #462 disposition | DEFERRED_PENDING_463 | Leave open for now; close as superseded only after #463 is accepted. |
| Independent Korean IPA review | BLOCKED | Requires qualified independent reviewer and source-resolved review packet. |
| Independent Ukrainian target validation | BLOCKED | Requires frozen IPA inputs and separate qualified Ukrainian receiving-language review. |
| Historical 236/239 cohort identity | PARTIAL | Reconstructed inventory does not prove original contemporaneous selector membership. |
| Raw `ㅠ` source-span matching | BLOCKED | Validate raw offsets before matching normalized runtime strings. |
| KsponSpeech / NIKL 2022 | BLOCKED | Access and exact dataset terms are not cleared. |
| ByT5 / CharsiuG2P inference | DEFERRED | Existing default-off research policy; not counted as passed. |

### Readiness

**Software-verified, evidence-scoped research prototype; not release-ready and not independently research-certified.** The ordinary mainline software workflows pass, but the five-dataset matrix, independent linguistic review and separate Ukrainian target validation remain incomplete.

## Current mainline continuation — documentation and external MFA benchmark (2026-11-08)

**Starting commit:** `05137e2ce3c03c72a9e4de6754e9a6f29855cb47`  
**Working branch:** `main` (no new branch or PR created)  
**Repository default branch:** `main`  
**Open PRs at inspection:** none  
**Branch refs:** 29 total, including `main` (28 non-main historical/supporting refs remain present). No branch was force-updated or deleted. Prior branch reconciliation is retained below; old branch names are not active integration targets.

### Verified repository state

The latest main-head push workflows on `05137e2ce3c03c72a9e4de6754e9a6f29855cb47` completed successfully:

| Workflow | Result | Run |
|---|---|---|
| Tests (browser, Python matrix, package/wheel and corpus audits) | **PASS** | [42514516177](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42514516177) |
| System Verify (Python regression/data integrity, browser regression/build and release guards) | **PASS** | [42514516144](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42514516144) |
| Master table and research corpus artifacts | **PASS** | [42514516025](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42514516025) |
| GitHub Pages deployment and live smoke | **PASS** | [42514516081](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42514516081) |

These are exact-head GitHub Actions results. No local shell, npm, pytest, or clean-install command was executed in this connector-only session.

### External MFA Korean G2P diagnostic — DONE_VERIFIED

The separately isolated MFA v2.0.0 benchmark completed on code head `23d62390242e2f6a8bfffe07de0f4c7b0672c88a`: [workflow run 42513951588](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42513951588), [aggregate artifact 13630946780](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42513951588/artifacts/13630946780), SHA-256 `469ffb31f9721afa2272454e9854fb6453de9e213e19def78549db2a7ba16b32`.

| Dataset | Model profile | Eligible | Candidate availability | Exact (scored-only) | CER | PER |
|---|---|---:|---:|---:|---:|---:|
| UGTPHON test | MFA Hangul | 2,703 | 99.0381% | 15.1289% | 27.3038% | 28.5421% |
| UGTPHON test | MFA Jamo | 2,703 | 100% | 16.0562% | 24.5200% | 25.5353% |
| SIGMORPHON 2021 Korean | MFA Hangul | 999 | 99.8999% | 24.6493% | 17.3079% | 20.6270% |
| SIGMORPHON 2021 Korean | MFA Jamo | 999 | 100% | 24.8248% | 17.1632% | 20.4528% |

**Interpretation and limits:** Hangul and Jamo are two input/model variants from one MFA family, not two independent engines. The SIGMORPHON source has 1,000 raw rows; 999 satisfy the shared scorer's eligibility filter. MFA is an isolated comparison-only baseline; it does not feed the production IPA→Ukrainian pipeline. The 56-symbol phone inventory is enforced, but the identity-to-IPA assumption still needs independent Korean phonetics review. Model/dictionary training lineage and overlap with benchmark sources remain open. Model-card WER/PER figures are not these project-run scores.

### Current task ledger

| Area | State | Evidence / acceptance boundary |
|---|---|---|
| Main-head software verification | **DONE_VERIFIED** | Four exact-head workflows above pass. |
| MFA Hangul/Jamo diagnostic execution | **DONE_VERIFIED** | Four dataset/model reports, checksums, strict grapheme handling, top-1 policy and artifact verified. |
| MFA phone-inventory linguistic interpretation | **PARTIAL** | 56 symbols are allow-listed; independent confirmation that every identity-mapped phone is IPA remains required. |
| MFA training-data lineage and overlap | **TODO** | Inspect upstream dictionary/model training sources and overlap with UGTPHON, SIGMORPHON/WikiPron and other registered datasets. |
| Independent Korean IPA review | **BLOCKED** | Requires qualified independent reviewer and a reviewable symbol/profile packet. |
| Independent Ukrainian target validation | **BLOCKED** | Requires independently sourced/adjudicated Korean IPA and Ukrainian receiving-language review; current renderer regression is not accuracy certification. |
| Historical 236/239 candidate membership proof | **PARTIAL** | Reconstructed candidate cohort remains useful, but the original selector/list has not been independently recovered. |
| Raw `ㅠ` source-span matching | **BLOCKED** | Revalidate raw source offsets before matching the two non-speech rows to normalized runtime strings. |
| KsponSpeech / NIKL 2022 | **BLOCKED** | Account/portal access and exact dataset terms are not cleared. |
| ByT5 / CharsiuG2P inference | **DEFERRED** | Existing default-off research policy; not counted as a pass. |

**Readiness:** software-verified, evidence-scoped research prototype. **Not release-ready and not independently research-certified.** The successful software workflows and executed benchmarks do not close specialist linguistic review, source-lineage, or Ukrainian target-accuracy gates.

### Repository workflow decision

The four external references are already reviewed in [ENGINEERING-WORKFLOW-REFERENCE-AUDIT-2026-11-06.md](ENGINEERING-WORKFLOW-REFERENCE-AUDIT-2026-11-06.md). Their useful practices—explicit acceptance gates, exact-head evidence, composable skills, root-cause debugging, focused regression tests and reproducible benchmark reporting—are adopted selectively. Their code, skills, hooks, state stores, artwork and benchmark data are not vendored. The existing canonical registers and workflows remain authoritative; no duplicate planning or gate framework is introduced.

### Branch policy for this continuation

All new work in this continuation is committed directly to `main`, as requested. No open PRs existed at inspection. The 28 non-main refs are historical/supporting refs; they are not merged blindly or deleted as a cosmetic cleanup. The repository's earlier audit records the previous full branch comparison and branch trees inspected at that time. Physically reducing the GitHub branch list to only `main` is a separate destructive ref-deletion operation; it is not necessary to consolidate code already present on `main`, and is intentionally not performed here.

---

## Final continuation audit — 2026-11-08

### Repository and commit state

- Starting main commit for this continuation: `893619785c8fc7c8417cc8da0690d84fcb8d8dbb`.
- Work remained directly on `main`, following the existing owner preference; no branch was created.
- Runtime/benchmark code snapshot: `668dbad14568e8472594937558500500102b3f95`.
- Main immediately before this final audit update: `ef39cb5f0a7429b86d9770c85e6e3b0d1760494d`.
- The final commit is the commit containing this audit update; its exact SHA is provided in the final execution report.
- Open-PR API listing returned no open PRs at inspection. No user branches were deleted, no force-push occurred, no PR was merged blindly and no release was published.

### Completed outcomes

**Five executable benchmark tracks across three datasets** (not five independent corpora):

1. UGTPHON — 10-engine Strict IPA and Broad sensitivity.
2. SIGMORPHON 2021 Korean — 10-engine Strict IPA and Broad sensitivity.
3. UGTPHON — Kozak Kim Browser Strict / Soft / Super-soft.
4. Seoul SLR113 — Kozak Kim three-mode Hangul surface pronunciation.
5. Seoul SLR113 — Kozak Kim three-mode phonemic IPA via the versioned 36-symbol adapter.

Full 10-engine artifact: [run 42487350896](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487350896), artifact `13621335293`. Native/Browser Strict parity matched 2,703/2,703 surface outputs and 2,702/2,702 resolved raw IPA and Broad IPA outputs.

### Seoul Corpus import and benchmark

- OpenSLR SLR113 label archive downloaded in GitHub Actions only; audio archive not downloaded.
- Label archive SHA-256: `63c3f8ffa6976307a732689d6c5be7b2db4ec20f14bf276faf98c886add0d24b`.
- 240/240 TextGrid files parsed; 1,680 interval tiers; 2,671,221 interval annotations.
- 231,626 aligned Hangul surface word pairs (54,868 unique source/reference pairs).
- 36 observed phoneme symbols mapped through `data/korean/ipa/seoul-corpus-phonemic-ipa-v1.json`, derived from Yun et al. (2015), Table 3, DOI `10.13064/KSSS.2015.7.2.103`.
- 1,134,781 mapped phone tokens; 70,660 non-phone/unmapped intervals excluded. 231,625 word-level phonemic IPA pairs generated; six phone-boundary conflicts and one non-phone/unmapped word excluded.
- No TextGrid files, audio, or word/IPA pair JSON are committed or uploaded. Disclosure: intermediate artifact 13621412269 contains a distinct phoneme-tier label inventory, including some short laughter-tag text, but not full TextGrid/audio/word-pair data; it expires 2026-12-08. Final artifact 13623457737 (rerun 42496539257) was inspected and contains aggregate metadata/metrics only, with no raw label-value map; future artifacts are retained 7 days. The corpus is CC BY-NC 2.0.
- Seoul workflow: [run 42496539257](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496539257), artifact `13623457737`.

### Seoul mode results

| Reference | Mode | Coverage | Exact scored-only | Exact coverage-adjusted | CER scored-only | Heuristic / typed fallback |
|---|---|---:|---:|---:|---:|---:|
| Hangul surface | Strict | 97.0375% | 57.1537% | 55.4605% | 24.5421% | 0 / 0 |
| Hangul surface | Soft | 87.0006% | 56.2055% | 48.8991% | 26.3641% | 26,057 / 0 |
| Hangul surface | Super-soft | 83.4924% | 56.8509% | 47.4662% | 26.3118% | 38,207 / 29 |
| Phonemic IPA | Strict | 97.0375% | 14.1166% | 13.6984% | 39.9210% | 0 / 0 |
| Phonemic IPA | Soft | 87.0005% | 14.7969% | 12.8734% | 40.8696% | 26,057 / 0 |
| Phonemic IPA | Super-soft | 83.4923% | 15.3788% | 12.8402% | 40.4053% | 38,207 / 29 |

Strict has the best coverage-adjusted Exact and lowest CER in both Seoul reference layers. On common scored subsets Strict wins every Exact comparison; Soft and Super-soft have higher scored-only Exact only because they score fewer source-resolved cases. Soft and Super-soft outputs are identical on their common scored set. The IPA reference is phonemic, not narrow phonetic gold; the adapter and cross-runtime profile remain unadjudicated by an independent specialist. These scores do not validate Ukrainian target rendering.

### Documentation, data and tests updated

- README, methodology, benchmark suite register, acceptance gates, source register, coverage matrix, repository audit and master handoff updated in place.
- Source register: 230 records; 12-column CSV integrity checked after repairing quoting.
- Added metadata-only Seoul TextGrid inventory script and tests; added temporary word-pair extraction and separate Hangul surface / phonemic IPA benchmark runners.
- Added the versioned 36-symbol phonemic IPA adapter JSON with explicit affricate and fortis serialization notes.
- Existing IPA-first pipeline, production engine, 236-case review queue, source-backed lexical controls and original g2pK 0.9.4 vendor baseline preserved.
- No production phonology or lexical exception was promoted from Seoul results.

### Verification actually completed

| Workflow | Result | Evidence |
|---|---|---|
| 10-engine UGTPHON + SIGMORPHON, three Browser modes and Native/Browser parity | **PASS** | [42487350896](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487350896) |
| Seoul TextGrid inventory + surface + phonemic IPA, all three modes | **PASS** | [42496539257](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496539257) |
| Python 3.11/3.12/3.13, web/npm tests and build, wheel install, teacher-corpus audit | **PASS** | [42491874801](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42491874801) on `de1d9b10f31e4ea730fc7c5940753c42f54ab3a1` |
| Python regression/data integrity and Browser regression/build | **PASS** | [42491874749](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42491874749) on `de1d9b10f31e4ea730fc7c5940753c42f54ab3a1` |
| Master table and research corpus artifacts | **PASS** | [42491874837](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42491874837) on `de1d9b10f31e4ea730fc7c5940753c42f54ab3a1` |

Intermediate CI failures during this continuation were not hidden: early Seoul inventory attempts exposed nested ZIP layout, AppleDouble sidecars, UTF-16 encoding and a counter bug; intermediate docs/source-register runs exposed stale test wording and CSV quoting. Each issue was corrected, and the later complete test and system-verification workflows above passed. No local full-repository pytest/npm run is claimed; GitHub Actions is the verification evidence. GitHub Pages deployment was cancelled by subsequent commits and is not claimed as deployed. Neural ByT5 and CharsiuG2P remained skipped under the existing default-off policy.

### Remaining task ledger

| Task | State | Blocker / acceptance criterion |
|---|---|---|
| Independent review of Seoul phoneme-to-IPA adapter | **TODO** | Korean phonetics reviewer to approve Table 3 serialization (ʨ→tɕ; asterisk fortis→͈) and phonemic-vs-phonetic comparison boundary. |
| Ukrainian target renderer validation on Seoul | **DEFERRED** | Seoul contains Hangul and phonemic IPA gold, not independently adjudicated Ukrainian target forms. |
| KsponSpeech | **BLOCKED** | AIHub access/account and original dataset terms; Hugging Face mirror's empty license field is not permission. |
| NIKL 2022 Daily Conversation | **BLOCKED** | NIKL portal application and exact corpus license/terms; no access token/data obtained. |
| SIGMORPHON sealed-holdout status | **PARTIAL** | Verify source split and training overlap before calling it a sealed holdout. |
| 236-case independent adjudication | **PARTIAL** | 213 cases not individually adjudicated, 22 ABSTAIN, 1 provisional RETAIN; no promotion to gold or production. |
| Neural ByT5 / CharsiuG2P | **DEFERRED** | Existing default-off policy; requires model/runtime and data provenance review. |
| Release readiness | **NOT READY** | Independent linguistic review, Ukrainian target validation, corpus-rights review and full holdout adjudication remain incomplete. |

**Final disposition:** software-verified research prototype; not independently research-certified and not release-ready. The five benchmark tracks are reproducible, but the three datasets have different reference conventions and the Seoul phonemic IPA adapter still requires specialist review.


---

## Exact-main benchmark checkpoint — 2026-11-08

The path-filtered multi-engine workflow completed successfully on main benchmark code commit `b548436d0fce9af4672fc5902d6670cbc134bd70`: [run 42487350896](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487350896), artifact `13621335293` (SHA-256 `c286d7e4f1ee02d40e1a9977e792eeb73bce12b32b658a8b3c4166c612ccc1a8`). The run contains the 10-engine UGTPHON and SIGMORPHON reports, per-occurrence mismatch ledger, unresolved review queue, three Browser Kozak Kim mode reports, Native/Browser parity report, and readiness audit. This is the current-main benchmark code snapshot; later documentation-only main commit(s) do not change the measured runtime.

### Ten-engine Strict IPA results

| Engine | UGTPHON exact | UGTPHON CER | SIGMORPHON exact | SIGMORPHON CER |
|---|---:|---:|---:|---:|
| ClippyFirst Native | 52.7387% (1,425/2,702) | 9.0130% | 35.9719% (359/998) | 14.5347% |
| g2pK 0.9.4 | 53.0892% (1,435/2,703) | 9.2328% | 35.3353% (353/999) | 14.8222% |
| g2p-ko 1.0.0 | 52.4602% (1,418/2,703) | 9.3928% | 35.6356% (356/999) | 14.6970% |
| KoG2Padvanced 2022 | 47.3178% (1,279/2,703) | 10.6815% | 32.6326% (326/999) | 15.8237% |
| phonemize 2.0.1 | 42.5453% (1,150/2,703) | 14.3531% | 28.9289% (289/999) | 17.4387% |
| KoG2P 2019 | 27.3030% (738/2,703) | 19.5122% | 18.7187% (187/999) | 21.8327% |
| kokorog2p 0.9.15 | 18.3130% (495/2,703) | 26.5352% | 9.6096% (96/999) | 30.7336% |
| HAMA 1.7.0 | 16.9071% (457/2,703) | 25.1081% | 12.7127% (127/999) | 27.6164% |
| hangul_to_ipa 2026 | 16.2412% (439/2,703) | 24.8054% | 8.9089% (89/999) | 29.8448% |
| eSpeak NG Korean | 8.1391% (220/2,703) | 33.6101% | 4.3043% (43/999) | 40.7236% |

The Native path abstained on one eligible occurrence in each dataset (2,702/2,703 UGTPHON; 998/999 SIGMORPHON); all other engines scored all eligible occurrences. On UGTPHON, g2pK has a marginally higher scored-only Exact rate, while Native has lower CER. On SIGMORPHON, Native leads both Exact and CER. This is not a universal winner claim. Broad-profile sensitivity results are separately recorded in the README and full artifact; the profile is research-only and deliberately lossy.

### Three Browser Kozak Kim modes — same 2,703 UGTPHON occurrences

| Mode | IPA profile | Source-resolved scored | Coverage | Exact (scored-only) | Coverage-adjusted Exact | CER | Heuristic rows | Typed fallback rows |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Strict | clippyfirst-korean-broad-v1 | 2,702 | 99.963% | 52.7387% | 52.7192% | 9.0130% | 0 | 0 |
| Soft | browser-legacy-contextual-v1 | 2,423 | 89.641% | 54.7668% | 49.0936% | 7.8785% | 280 | 0 |
| Super-soft | browser-super-soft-maximum-coverage-v1 | 2,239 | 82.834% | 56.1858% | 46.5409% | 7.8191% | 464 | 0 |

Important interpretation: these are three separate runtime policies and three different IPA profile IDs. The Soft/Super-soft scored-only Exact and CER are calculated only on their source-resolved rows; their coverage-adjusted Exact makes the abstention/heuristic trade-off visible. Soft and Super-soft's higher scored-only Exact must not be read as accuracy improvement: they score fewer source-resolved rows and have 280/464 heuristic rows, respectively. No typed fallback was emitted in this particular UGTPHON run. The earlier morphology-consensus Soft result (100% coverage on its separate harness) is a different benchmark protocol and must not be substituted for this Browser mode-specific report.

### Native/Browser parity

The exact-head parity report matched all 2,703 occurrence identities and all 2,703 surface-Hangul outputs. On the 2,702 resolved occurrences, raw IPA and broad IPA matched 2,702/2,702 (100%); coverage/abstention states also matched. Both sides declared `clippyfirst-korean-broad-v1`, version 1, with the same profile contract. This establishes measured parity for the strict configuration on this dataset, not universal parity across every rule/input or the Soft/Super-soft modes.

### Seoul Corpus: third executable dataset and word-surface benchmark

The OpenSLR SLR113 label archive was downloaded in CI and parsed without downloading audio. Archive SHA-256: `63c3f8ffa6976307a732689d6c5be7b2db4ec20f14bf276faf98c886add0d24b`. The archive is licensed CC BY-NC 2.0; no corpus labels or audio are committed or included in the benchmark artifact.

- 240/240 TextGrid files parsed; 1,680 interval tiers and 2,671,221 interval annotations.
- Tier inventory: 480 `pWord.ortho.`, 480 `pWord.prono.`, 240 `phoneme`, 240 `utt.ortho.`, and 240 `utt.prono.` tiers. Duplicate tier names are preserved and paired by occurrence order.
- 604,576 paired word-tier interval slots; 604,564 have matching start/end boundaries within 0.1 ms. The 12 boundary mismatches are excluded.
- **231,626 aligned Hangul-only orthography→pronunciation word occurrences**, 54,868 unique source/reference pairs and 37,749 unique source forms.
- Audio was not used. This is a Hangul surface-pronunciation benchmark, not IPA Exact/CER and not Ukrainian target validation.

| Kozak Kim mode | Source-resolved scored | Coverage | Exact scored-only | Exact coverage-adjusted | CER scored-only | Heuristic | Typed fallback | Unresolved |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Strict | 224,764 / 231,626 | 97.0375% | 57.1537% | 55.4605% | 24.5421% | 0 | 0 | 6,862 |
| Soft | 201,516 / 231,626 | 87.0006% | 56.2055% | 48.8991% | 26.3641% | 26,057 | 0 | 4,053 |
| Super-soft | 193,390 / 231,626 | 83.4924% | 56.8509% | 47.4662% | 26.3118% | 38,207 | 29 | 0 |

Paired mode deltas on common source-resolved occurrences:
- Strict vs Soft: 201,516 common; 8,031 outputs changed; Strict had 778 exact wins, Soft had 0.
- Strict vs Super-soft: 193,390 common; 7,553 outputs changed; Strict had 771 exact wins, Super-soft had 0.
- Soft vs Super-soft: 193,390 common; **zero output changes**. Super-soft changes status/fallback classification, not the source-resolved surface predictions in this common set.

Interpretation: Strict has the best coverage-adjusted Exact and the lowest CER on this corpus. Soft and Super-soft do not improve Exact on the common scored subsets; they introduce heuristic/fallback strata and lower source-resolved coverage. The corpus is spontaneous speech and its transcription conventions differ from the project’s rule-based canonical profile, so these are diagnostic results—not an independently adjudicated universal accuracy claim. Do not tune rules on this corpus and then call it a sealed holdout.

#### Phonemic IPA benchmark from the `phoneme` tier

The primary annotation paper documents the phoneme inventory and IPA correspondence in Table 3 (Yun et al., 2015, DOI `10.13064/KSSS.2015.7.2.103`). A versioned adapter, `data/korean/ipa/seoul-corpus-phonemic-ipa-v1.json`, maps all 36 observed phone symbols. It explicitly expands the paper's `ʨ` affricate notation to `tɕ` and its asterisk fortis notation to the IPA combining mark `͈`; non-speech/unmapped labels are excluded rather than guessed.

- 1,134,781 phone intervals map through the 36-symbol adapter.
- 70,660 non-phone or unmapped intervals are excluded; their raw labels are not exported.
- **231,625 word-level IPA pairs** are aligned to the Hangul `pWord.ortho.` tier. Six words with cross-boundary phone intervals and one word containing a non-phone/unmapped label are excluded.
- This is phonemic IPA, not narrow phonetic gold. It does not encode context-conditioned voicing, release detail, speaker-specific variation or every allophonic place change.

| Kozak Kim mode | Source-resolved scored | Coverage | Exact scored-only | Exact coverage-adjusted | CER scored-only | Broad candidate Exact | Broad candidate CER | Heuristic | Typed fallback |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Strict | 224,763 / 231,625 | 97.0375% | 14.1166% | 13.6984% | 39.9210% | 14.1224% | 40.1832% | 0 | 0 |
| Soft | 201,515 / 231,625 | 87.0005% | 14.7969% | 12.8734% | 40.8696% | 14.8034% | 41.1359% | 26,057 | 0 |
| Super-soft | 193,389 / 231,625 | 83.4923% | 15.3788% | 12.8402% | 40.4053% | 15.3856% | 40.6759% | 38,207 | 29 |

Paired comparisons: Strict vs Soft has 201,515 common scored occurrences, 6,481 output changes, 793 Strict exact wins and zero Soft exact wins. Strict vs Super-soft has 193,389 common, 5,837 changes, 788 Strict exact wins and zero Super-soft exact wins. Soft and Super-soft produce identical source-resolved IPA outputs on all 193,389 common occurrences; Super-soft changes only the status/fallback classification there.

Interpretation: Strict has the best coverage-adjusted Exact and lowest CER in this phonemic reference. The higher scored-only Exact of Soft/Super-soft is a selection effect: they score fewer source-resolved occurrences and classify more cases as heuristic. Because this gold is phonemic while the engine profiles retain phonetic/allophonic detail, raw Exact/CER are diagnostic and must not be presented as narrow-IPA acceptance. This benchmark is not Ukrainian target validation.

Evidence: [Seoul preflight, surface and phonemic-IPA benchmark run 42496539257](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496539257), artifact `13623457737`. The artifact contains metadata and aggregate metrics only; raw word/IPA pairs remain temporary CI data.

### Remaining evidence limits

- The Broad sensitivity profile remains `research-only-unadjudicated`; its feature collapses are documented and are not normative IPA gold.
- UGTPHON has been inspected during project research; SIGMORPHON is a public paired lexical file with transcription-convention and possible training-overlap limitations.
- The two benchmark datasets do not validate Ukrainian target rendering.
- Neural ByT5 and CharsiuG2P jobs were skipped under the existing default-off research policy.
- Seoul Corpus now has two executed three-mode tracks (Hangul surface and phonemic IPA) on the label-only archive; KsponSpeech and NIKL 2022 remain access/terms-gated and unscored.

Reproduce from [run 42487350896](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487350896), artifact `13621335293`.

---


## Superseding current-main status — 2026-11-07

**Current branch:** main. **Audited starting commit for this continuation:** `e72856c1f03bfb775805748f96ec23889ca2e60f`. PR #456 is the latest merged implementation (squash merge `18f5529b9100ea6e4f7c176c9627bacf1fc52585`). The latest current-main CI state is recorded in the 2026-11-07 continuation below; it supersedes all older verification statements. The documentation status was first reconciled on main in commit 249c2e7ce7556a0acf07f7fe9cb6fe77ebd1e96c and then refined in commits 365bfd702faf75697b0a13dda897f6d007d2ae2a, 77956a8cc1f770907749f822cb0874c820f14e25, 45131bf0aec048f39c9c103c2aa10e695e21c12d and 89369e3337661f76588c469d2cd173534dcd5273; this section supersedes older snapshot statements below; the dated audit trail is retained.

### 236-case task ledger

| Work item | Status | Evidence / acceptance boundary |
|---|---|---|
| Reconstructed 236-row occurrence inventory | DONE_VERIFIED as an inventory | Candidate replay and registers exist; original historical 236/239 selector membership is not proven |
| 15 exact standard-form runtime dispositions | DONE_VERIFIED | Ten exact integrations plus five pre-existing exact licenses; occurrence-scoped and source-backed |
| 181 profile-convention decisions (181 profile-convention cases) | DONE_VERIFIED as bounded decisions | Not 181 categorical sound-change rules and not speaker-specific IPA gold |
| 12 original abstentions + 28 residual cases | DONE_VERIFIED for engine-policy disposition | All 40 have explicit no-audio engine-policy decisions; the 12 abstentions + 28 unadjudicated cases remain UNRESOLVED_NO_AUDIO for speaker-specific IPA |
| Three exact typo-preserving UGTPHON recoveries | DONE_VERIFIED | PR #454 merged; Python/Browser positive and near-form negative tests passed |
| Independent Korean IPA gold for 40 | DEFERRED / EVIDENCE-LIMITED | No source audio or speaker crosswalk; no guessed narrow IPA |
| Independent Ukrainian target review / validation | DEFERRED | Korean G2P benchmarks do not measure target-layer quality |
| External reviewer outreach | DEFERRED | Not part of this execution pass; no correspondence initiated |

### Latest benchmark evidence

- **UGTPHON Korean test** (275 source rows; 2,703 eligible token occurrences): Native scored 2,701, exact 1,435 (53.1285%), CER 8.9418%, two unresolved; g2pK scored 2,703, exact 1,435 (53.0892%), CER 9.2328%. On the 2,701 paired occurrences, exact counts are equal and Native CER is lower by 0.2856 percentage points.
- **SIGMORPHON 2021 Korean test** (1,000 rows; 999 eligible words): Native scored 998, exact 358 (35.8717%), CER 14.5598%, one abstention; g2pK scored 999, exact 353 (35.3353%), CER 14.8222%. On the 998 paired words, Native exact-match rate is higher by about 0.50 percentage points and CER lower by about 0.25 points.
- **Multi-engine run** [42292493822](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42292493822) passed and uploaded artifact 13540904691 (SHA-256 54adafb0f8233b8cbd9fc88dfb2308abd8831044bab6a4be7eca6ecd5850a3cf). Optional CharsiuG2P and ByT5 inference jobs were SKIPPED by policy. These are diagnostic comparisons, not normative IPA gold or Ukrainian transcription scores.
- **Exact-head verification:** tests [42292493631](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42292493631), system verification [42292493613](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42292493613), master/research artifacts [42292493643](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42292493643), exhaustive extraction [42292493559](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42292493559), paired Native/g2pK [42292493640](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42292493640), and UGTPHON/multi-engine diagnostics [42292493815](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42292493815), [42292493822](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42292493822) all completed successfully. No local npm/pytest command is claimed in this connector-only session.

### Repository structure snapshot

At the pre-documentation main commit, the recursive tree had 838 entries (796 files, 42 directories), 179 Markdown files, 397 test files, 64 scripts, 18 workflows and 13 schemas; docs/ had 148 files and research/ 57 files. The tree count is an inventory, not a quality or completion metric. The current navigation remains README.md → docs/README.md → docs/REPOSITORY-STRUCTURE.md / docs/AGENT-WORKFLOWS.md; AGENTS.md is the repository task router; research truth remains in research/SOURCE-REGISTER.csv, research/RULE-COVERAGE.csv, research/ACCEPTANCE-GATES.md, research/DECISION-LOG.md and research/ROADMAP.md. The >1 MB append-only master handoff is preserved.

**Readiness:** software-verified bounded research prototype; not independently research-certified or release-ready. Latest Pages deployment/live smoke must be checked on the post-merge main head.

### Branch and PR reconciliation

- PR #454 was squash-merged into main as d2f942d0615df3da2a973a2709f8738f65da18d9. Its final-release branch supplied the accepted exact-form implementation and benchmark evidence.
- PR #447 and its 40-case no-audio engine-policy decisions are already integrated in main. The 40 policy dispositions do not change the 40 unresolved speaker-specific IPA-gold statuses.
- PR #448 was closed as superseded: its documentation-only reconciliation was replaced by the updated mainline README, docs index, repository map, research index, acceptance gates, roadmap and audit.
- PR #455 was closed without merge because its remaining unique scope couples rights/notice work with blinded external-review packet tooling. The user requested no letters or external review; no packets were generated or distributed and no reviewer was contacted. The branch is preserved for possible later use; its changes were not represented as merged.
- The branch inventory contains 22 refs (main plus 21 supporting/historical branches). Main is the only active execution branch for this continuation. Remaining refs were compared against main; older/superseded attempts were not merged blindly because their histories diverge after squash merges and several represent earlier snapshots of work already accepted through PR #447/#454. No branch was deleted and no force-push was used.

---

## Historical audit baseline and scope


Repository: [ClippyFirst/Korean-Ukrainian-Phonetic-System](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System).

- Default branch at start: `main`, commit `043754498f3ad8a17aa6c13b5f643b197536da8a`.
- Working branch: `research/236-candidate-review-2026-11-05`.
- Working-branch snapshot for this audit: `9fa7b589ae881c497ea0800b3ae0886ce1990bfd` (before this final audit/handoff commit).
- PR #436 is the single active integration PR. PR #437 was closed as superseded after all 13 of its changed paths were confirmed present and reconciled on #436; its source branch is preserved.
- Recursive tree at the working-branch snapshot: 831 entries (789 files, 42 directories), 177 Markdown files, 394 files under `tests/`, 64 scripts, 18 GitHub Actions workflows and 13 schemas; `docs/` contains 146 files and `research/` 55. Seven repository-local skills are present.

This is a repository-state, 236-case implementation and documentation-structure audit. It is not an independent Korean IPA adjudication, Ukrainian reader study, source-rights opinion, or local clean-room test run.

## 236-case evidence and runtime decision

The reconstructed cohort contains 236 occurrence rows, not 236 independent phonological rules or independent speakers.

| Disposition | Rows | Runtime decision |
|---|---:|---|
| `RULE_CONFIRMED_STANDARD_VARIANT` | 15 | 15 occurrences covered by exact runtime licenses (ten new exact occurrence licenses plus five pre-existing licenses); no input spelling rewrite |
| `PROFILE_CONVENTION_MISMATCH_CONFIRMED` | 181 | Keep broad/narrow profile distinctions; do not create categorical Korean sound-change rules |
| `ABSTAIN` | 12 | No runtime change; insufficient token-specific evidence |
| `UNADJUDICATED` | 28 | No runtime change; individual evidence incomplete |
| **Total** | **236** | All rows retained |

196 rows have a disposition; 40 remain unresolved. None has independent speaker-level acoustic IPA gold. The 181 profile rows are not a license to rewrite the candidate speaker's phone or to change canonical phonemic output.

Exact integrations are documented in [the 236-case engine integration record](KOZAK-KIM-236-ENGINE-INTEGRATION-2026-11-06.md) and machine-readable [occurrence-to-runtime register](../research/kozak-kim-236-engine-integration-2026-11-06.csv):
- NIKL Rule 5: exact genitive-particle eojeols `그놈의` and `자신의`.
- R008: exact eojeol/pair licenses for `정권`, `유사성`, `혐오증`; no productive `-권/-성/-증` rules.
- NIKL Rule 29: exact compound `연전연패`; three rows are repetitions of one source/token family.
- NIKL Rule 26: exact `출시미정에`.
- Five pre-existing exact licenses (`출산`, `팔자걸음`, `보일거라`, `물가로`, `안할듯`) are preserved.

`머리속에` now has an exact pronunciation-only R008 alias for `리>속`; the original spelling is preserved and no orthographic normalization or productive `머리+속` rule is introduced. No guessed IPA or Ukrainian target is added for abstained or unadjudicated cases.

## Architecture and ownership boundaries

Preserve the established transformation pipeline:

`Korean orthography → structural and supported morphological analysis → Korean phonology → IPA or typed uncertainty → Ukrainian target adaptation → Ukrainian practical orthography`.

The Python native engine, browser runtime, independent g2pK baseline, Kozak Kim/NIKL research rules, source data, generated browser projection and IPA-to-Ukrainian renderer remain distinct. No new 236-case path writes Ukrainian output directly from Hangul.

## Documentation and agent workflow

The repository remains intentionally organized by responsibility rather than by bulk-moving its large historical documentation tree. Current navigation is:
- `README.md`: product entry point and links.
- `AGENTS.md`: repository-wide agent router and non-negotiable contracts.
- `docs/AGENT-WORKFLOWS.md`: task lifecycle, skill routing and evidence discipline.
- `.agents/skills/`: four domain-specific linguistic/NIKL skills plus three general engineering, audit and review skills.
- `docs/README.md`: documentation map and authority rules.
- `docs/REPOSITORY-STRUCTURE.md`: ownership, runtime entry points and development commands.
- `research/SOURCE-REGISTER.csv`, `research/RULE-COVERAGE.csv`, `research/ACCEPTANCE-GATES.md`, `research/DECISION-LOG.md`, and `research/ROADMAP.md`: canonical research evidence and status.
- `docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md`: append-only session history; newest dated section wins.

No second source register, rule matrix, acceptance ledger or master plan has been created. Historical file paths remain stable.

## Upstream workflow reference decisions

Four supplied repositories were reviewed and are process references only:
- Unlazy: adopt explicit acceptance gates, evidence freshness, re-verification and honest handoff; do not import its checker, approval store, Stop hook, leases or Depth Tree orchestration.
- Superpowers: adopt test-first behavior changes, root-cause debugging and verification; do not force a synthetic RED test for editorial-only changes.
- Matt Pocock skills: adopt small composable procedures, clear routing and codebase-aware review; do not duplicate the skill catalogue or external tracker assumptions.
- Ponytail: adopt risk-first audits and measured benchmarks; do not import author-reported savings/quality claims as evidence about this project.

Pinned source revisions and detailed boundaries are recorded in [the 2026-11-06 workflow reference audit](ENGINEERING-WORKFLOW-REFERENCE-AUDIT-2026-11-06.md). No upstream code, skill text, hooks, plugins, artwork or benchmark data is copied.

## Task ledger

| Workstream | Status | Acceptance / blocker |
|---|---|---|
| Reconstructed 236-row ledger | DONE_VERIFIED as a preserved/reproducible cohort | All 236 rows retained; generator, provenance and row-integrity tests are included in PR #436. This is not independent IPA gold. |
| 15 exact occurrence runtime integrations | PARTIAL pending exact final-head CI | Ten new exact licenses plus five baseline licenses; new alias and profile variants have Python/browser regressions; verify exact final head. |
| 181 profile-convention reconciliations | DONE_VERIFIED as non-integration decisions | No categorical phonology changes; token-acoustic IPA remains unresolved. |
| 12 abstentions + 28 unadjudicated | BLOCKED | Need exact token audio or independent Korean IPA evidence with source/profile/prosodic context. |
| `머리속에` pronunciation alias | PARTIAL pending exact final-head CI | Exact full-eojeol alias is implemented without rewriting spelling; a general orthographic-normalization layer remains out of scope. |
| Agent routing and workflow documentation | PARTIAL pending final exact-head CI | Root guide, three general skills, workflow guide, navigation and structural test are ported into PR #436 branch. |
| Upstream reference audit (four repositories) | DONE_VERIFIED as a documented comparison | Pinned revisions and adoption/rejection boundaries documented; no upstream code copied. |
| Independent Korean IPA gold | BLOCKED | Requires qualified independent reviewers and adjudication; corpus labels/model agreement are insufficient. |
| NIKL item-level reuse rights | BLOCKED | Item-level rights classification/permission evidence remains incomplete. |
| Independent Ukrainian target validation | BLOCKED | Requires Ukrainian phonetic/orthographic reader review and acceptance tests. |
| Full local clean-install run in this session | BLOCKED | GitHub connector environment does not provide a local checkout/shell; use exact-head GitHub Actions and report no local run. |
| Release readiness | DEFERRED | Research prototype only; external linguistic and rights gates remain open. |

## Branch and PR reconciliation

- PR #436 remains the working integration branch, based on the inspected main commit `043754498f3ad8a17aa6c13b5f643b197536da8a`.
- PR #437's root `AGENTS.md`, three general skills, agent workflow guide, structural contract test and navigation changes were ported to the #436 branch and reconciled with the 236-case documentation.
- All 13 changed paths from PR #437 are present on #436; PR #437 is closed as superseded, with its branch preserved. No PR was blindly merged.
- No user branch was deleted, no force-push was used, and `main` was not modified.

## Verification snapshot

At final pre-handoff head `9fa7b589ae881c497ea0800b3ae0886ce1990bfd`, GitHub Actions had 1 successful sub-job, 5 skipped, 2 in progress and 18 queued. Multi-engine diagnostic run [42193072679](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193072679) was in progress; research morphology smoke [42193072667](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193072667) had one Kiwi smoke sub-job pass and MeCab still in progress. Tests matrix [42193072530](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193072530), Verify [42193072622](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193072622), browser G2P [42193072634](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193072634), morphology consensus [42193072645](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193072645), exhaustive extraction [42193072676](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193072676), master artifacts [42193072796](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193072796), paired native/g2pk [42193072643](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193072643), and external UGTPHON [42193072568](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193072568) were queued. Charsiu train/dev, official NIKL metadata inventory, CharsiuG2P and ByT5 were skipped by workflow policy, not passed. Earlier code/data head `37ccbd17ac764ee83e592c8434372a00195ddd68` had successful Python regression/data integrity, browser regression/build (1,398/1,398), Python 3.11/3.12/3.13, wheel install, teacher-corpus audit, browser G2P, artifact generation, exhaustive extraction, UGTPHON, paired native/g2pk and morphology diagnostics; its multi-engine diagnostic was cancelled and is not counted as passed.

No local `npm`, `pytest`, build or clean-install command was run: a container-side `git ls-remote` attempt failed because `github.com` could not be resolved. A connector-side Markdown link audit checked nine primary navigation/research documents and found zero broken relative links. CSV consistency checks confirmed 236 unique candidate rows, all 15 integration-register IDs present in that cohort, integration dispositions of 9 new / 5 baseline / 1 blocked, and 212 source-register rows. The exact-head CI queue remains the outstanding software-verification gate.

## Readiness

The repository remains a **partial research prototype**, not research-certified and not release-ready. Software integration can be verified independently; it cannot substitute for independent IPA gold, Ukrainian target review or item-level rights clearance.


## Superseding verification update — 2026-11-06 (after PR #436 merge)

The prior verification snapshot above is historical. PR [#436](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/436) is now merged. Merge commit on `main`: `da931f1fa4d95b000bfaa9a0fd54f36cebb1703c`; merged PR head: `e525a15f15eebbd472c7d81033ff2991025e5525`.

### Updated task ledger

| Workstream | Status | Current evidence / remaining acceptance |
|---|---|---|
| 236-row reconstructed cohort and provenance | DONE_VERIFIED as a reproducible cohort | 236 unique rows and reproducible register/generator checks; not independent IPA gold. |
| 14 exact occurrence runtime integrations | DONE_VERIFIED as bounded software implementation | Merged in #436; exact-head Python/browser parity and negative controls; does not imply independent pronunciation adjudication. |
| 181 profile-convention differences | DONE_VERIFIED as explicit non-integration decisions | No categorical phonology rules added. |
| 12 abstentions + 28 unadjudicated | BLOCKED | Need token audio or independent Korean IPA evidence with source/profile/prosodic context. |
| `머리속에` spelling normalization | DEFERRED / BLOCKED | Requires separately specified orthographic/semantic layer and disambiguation policy. |
| Agent routing, workflow docs and structural tests | DONE_VERIFIED as merged documentation/tooling | Included in #436; PR #437 closed as superseded, its branch preserved. |
| Four upstream workflow reference audit | DONE_VERIFIED as documented process comparison | Pinned revisions and adoption/rejection boundaries; no upstream code copied. |
| Exact-head CI for merged change | DONE_VERIFIED | All applicable completed jobs on PR head `e525a15f15eebbd472c7d81033ff2991025e5525` passed; optional NIKL/Charsiu/ByT5 jobs skipped. See run IDs below. |
| Independent Korean IPA gold | BLOCKED | Requires qualified independent reviewers and adjudication; corpus labels/model agreement are insufficient. |
| NIKL/source item-level reuse rights | BLOCKED | 208 open source-register items remain in review/manual-classification categories; permissions not inferred. |
| Independent Ukrainian target validation | BLOCKED | Requires Ukrainian reader/phonetic review and acceptance tests. |
| Full local clean-install in this session | BLOCKED | Connector-only environment has no local checkout/shell; GitHub Actions performed the available clean wheel install and build checks. |
| Release readiness | DEFERRED | Research prototype only; external linguistic and rights gates remain open. |

### Exact-head verification (PR head immediately before merge)

- Tests matrix [42193471625](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471625): PASS — Python 3.11/3.12/3.13, web tests/build, teacher-corpus audit, clean wheel-install IPA data verification.
- System verification [42193471270](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471270): PASS — Python regression/data integrity and browser regression/build/generated pages.
- Multi-engine IPA [42193471280](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471280): PASS — engine comparisons, overlap audit, reviewer packets, Browser same-occurrence run, runtime parity, SIGMORPHON, mismatch export.
- Browser G2P [42193471380](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471380), UGTPHON [42193471364](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471364), exhaustive extraction [42193471134](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471134), morphology consensus [42193471411](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471411), morphology smoke [42193471149](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471149), corpus artifacts [42193471212](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471212), and paired native/g2pk [42193471116](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471116): PASS.
- Charsiu train/dev [42193471275](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42193471275), official NIKL metadata inventory and optional ByT5/Charsiu inference: SKIPPED, not passes.

The merged commit `da931f1fa4d95b000bfaa9a0fd54f36cebb1703c` was confirmed as the merge commit for PR #436. The commit-runs endpoint returned no PR-triggered runs for the merge commit itself; all listed checks are explicitly tied to the exact PR head before merge. No local npm/pytest command was executed in this session.

**Verdict:** software integration is merged and CI-verified. The repository remains a **partial research prototype**, not research-certified and not release-ready.


## 2026-11-06 — second-pass review of the 40 unresolved 236-cohort occurrences

The canonical candidate review now contains a focused evidence pass over all 12 abstentions and 28 previously unadjudicated occurrences. It corrects several scope errors (notably 아끼셔 is lenis /s/ before /jʌ/, 체험 contains /e.hʌ/, and Rule 29 phrase-level applicability requires connected-speech evidence) and records why the remaining comparator mismatches cannot yet be promoted to IPA gold.

The unresolved count remains 40 (12 abstentions + 28 unadjudicated). No runtime rule, benchmark gold, IPA target, or Ukrainian target changed. This is an evidence-gated decision, not an assertion that the cases are unimportant: source audio/speaker mapping and two independent Korean IPA annotations remain the acceptance blockers. See [the canonical candidate review](../research/kozak-kim-236-candidate-review-2026-11-05.md#2026-11-06--focused-second-pass-review-of-the-remaining-40-occurrences).


## 2026-11-06 — PR #441 follow-up: 236-case runtime coverage and parity correction

- PR #441 remains the active implementation branch, based on main `07c0233fa7aaee18cbfde82f764ac9061a0fb24d`. The 236-row ledger remains 15 `RULE_CONFIRMED_STANDARD_VARIANT`, 181 `PROFILE_CONVENTION_MISMATCH_CONFIRMED`, 12 `ABSTAIN_PENDING_INDEPENDENT_IPA_REVIEW`, and 28 `NOT_INDIVIDUALLY_ADJUDICATED`.
- All 15 standard-form/rule occurrences have explicit runtime dispositions (10 newly integrated on this branch, five preserved from baseline). The 181 profile rows are not promoted to productive phonological rules. The 24 fortis `ɕ͈→s͈` operations occur in 24 occurrence IDs across 19 source rows; 23 are before /i/ and one is before /jo/. Kong & Kang (2021) show context- and gender-specific fronting of /s͈i/ closer to [s] than [ɕ], so no generic [ɕ͈] variant is accepted.
- Code correction commit `dcf1726212e16719b0fdc03311e5903448151e8b` aligns Browser optional lenis [ɕ] variants with Python's evidence-scoped /i, ye, ya/ set, removes unsupported `/jʌ, jo, ju/` candidates, and handles post-rule coda-ㅅ resyllabification for IDs 143 (`멋있노`), 538 (`멋있어`), and Rule 13 context cases 475, 2392 and 2667. Regression tests cover six resyllabified forms, supported contexts, out-of-scope negative controls, and fortis negative controls.
- The current profile disposition for IDs 143 and 538 is confirmed in `research/kozak-kim-context-adjudication-2026-11-05.csv`; older prose saying they remain open is superseded. ID 538 has direct NIKL Q&A 306166 support for the [머시써] surface variant. This is a broad-vs-narrow profile reconciliation, not speaker-specific acoustic IPA gold.
- No canonical IPA, phonemic output, Ukrainian target, or benchmark gold changed. The 12 abstentions and 28 unadjudicated occurrences remain blocked on source audio, speaker crosswalk, and independent Korean IPA annotation. No local pytest/npm run is claimed in this connector-only environment. The master handoff section was updated in PR #441, but it still contains stale snapshot metadata (implementation head 0d158a..., fortis count 22, and CI pending). A later full-file correction was rejected by the available content action; the final merge SHA, exact verified code/test head, and current CI statuses are recorded here and in the PR description. Do not treat those stale master-handoff fields as current.
- Exact-head CI for the final PR #441 head is the remaining software acceptance gate. Optional NIKL metadata, Charsiu and ByT5 jobs are skipped by policy, not passed. PR #439 remains separate and open with its previously recorded rights-audit test failures.


## 2026-11-06 — post-merge verification of the 236-case completion

- PR #441 was merged into main with merge commit `f89c475c56796119e87130367fc15926b2428220`; the verified implementation/test head was `847cdb240aadc2c9343127fbb7de6dafad0441d4`.
- Exact-head core checks on `847cdb2`: Python 3.11/3.12/3.13, wheel install, teacher-corpus audit, web checks, Python regression/data integrity, browser regression/build, Browser G2P, UGTPHON Korean split, paired native/G2PK comparison, Kiwi+MeCab-Ko consensus, research morphology adapter smoke, exhaustive test-case extraction, and master corpus artifact generation all **PASS**.
- Official NIKL metadata inventory, Charsiu and ByT5 optional jobs were **SKIPPED**, not passed. Pinned multi-engine workflow `42215019081` remained **IN_PROGRESS** at the multi-engine comparison step; its later browser parity and SIGMORPHON steps had not yet run. Do not claim this benchmark passed.
- The candidate ledger remains 236 rows: 15 standard-rule cases implemented/preserved, 181 profile-convention rows handled without new categorical phonology, 12 abstentions and 28 unadjudicated rows remain evidence-limited. The 24 fortis `[ɕ͈]→/s͈/` operations occur in 24 occurrence IDs across 19 source rows; 23 are before /i/ and one is before /jo/. Direct 2021 acoustic evidence is speaker- and context-specific and does not support [ɕ͈] as a generic IPA value; exact cohort speaker/audio evidence remains required.
- No local pytest/npm command is claimed; all verification above is from GitHub Actions. No release was published.


## Superseding continuation snapshot — 2026-11-06 after PR #441/#442 merge

**Current default-branch baseline:** `main` at `2e9647540e1be47571579f71b7466393172a2a6d`. **Continuation branch:** `research/236-residual-review-2026-11-06`. PR #441 (runtime) and #442 (post-merge documentation) are merged. The 236-case status is unchanged: 15 exact standard-form occurrences with runtime dispositions; 181 bounded profile-convention decisions; 12 abstentions; 28 unadjudicated occurrences. All 236 source rows remain retained and 40 remain evidence-limited.

### Corrected current task ledger

| Workstream | Status | Current acceptance / evidence |
|---|---|---|
| 236-row candidate ledger and provenance | DONE_VERIFIED | Reconstructed cohort retained; repeated tokens are not independent speakers; no independent IPA gold implied. |
| 15 standard-form runtime dispositions | DONE_VERIFIED | Ten new exact licenses plus five baseline licenses; PR #441 merged. Current-main tests and system verification pass. |
| 181 profile-convention reconciliations | DONE_VERIFIED as bounded non-integration decisions | Optional variants are narrowly scoped; no categorical rule promotion or speaker-specific claim. |
| 24 fortis [ɕ͈]→/s͈/ edit operations in 24 occurrence IDs across 19 source rows | BLOCKED | 23 are before /i/, one before /jo/ (ID 96); 22 forms contain ㅆ and two are coda-triggered fortition. No generic [ɕ͈] variant is accepted; token-level IPA requires exact speaker/audio evidence. |
| 12 abstentions + 28 unadjudicated occurrences | BLOCKED | Original token audio, speaker crosswalk, two independent Korean IPA annotations, blind reconciliation; then separate Ukrainian target review. |
| Multi-engine unmapped-Broad generated artifact | PARTIAL | Exact PR #441 head run 42215019081 failed at `cmp`: generator emitted 25 rows, tracked CSV has 26 including now-integrated ID 2490. Downstream Browser parity and SIGMORPHON jobs were skipped. Regenerate artifact from pinned inputs, inspect full row-level diff, rerun workflow. Do not weaken byte comparison. |
| Current-main tests/build/data/deploy workflows | DONE_VERIFIED for main `2e9647540e1be47571579f71b7466393172a2a6d` | Tests 42216016963, Verify 42216016988, master artifacts 42216016940, Pages 42216016937 all success. These do not supersede the separate multi-engine failure. |
| Four upstream workflow references | DONE_VERIFIED | Existing pinned audit; adopt process practices only; no code/skills/hooks copied. |
| Independent Korean IPA gold | BLOCKED | Qualified reviewers and blind adjudication absent. |
| Independent Ukrainian target validation | BLOCKED | Independent reader/phonetic review and acceptance tests absent. |
| Source-rights PR #439 | PARTIAL / leave untouched | Open PR is 56 commits behind current main; exact-head tests and verify failed (runs 42200300941, 42200300947). Reconcile selectively on a current branch; do not merge stale branch blindly. Citation-only evidence is not the same as copied/redistributed material. |
| Release readiness | DEFERRED | Partial research prototype; not research-certified or release-ready. |

### Runtime and evidence boundary

No further 236-case runtime rule is justified by the reviewed residual evidence. In particular, the 24 fortis sibilant operations are not closed by the lenis /i, ye, ya/ coarticulation result; the two /ɘː/ vs /ʌː/ cases are profile-symbol questions; and phrase-level Rule 29 candidates require token-level prosodic evidence. The 12 + 28 evidence-limited rows must not receive guessed IPA or Ukrainian outputs. The next linguistic acceptance step is independent annotation, not another heuristic.

### Current verification facts

- Main `2e9647540e1be47571579f71b7466393172a2a6d`: tests, system verification, generated master/research artifacts and Pages deployment all succeeded (run IDs above).
- Multi-engine exact-head run [42215019081](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42215019081): engine comparison and reviewer packet steps succeeded; mismatch-queue export `cmp` failed at byte 86966 / line 26. Later Browser parity, native/browser parity and SIGMORPHON jobs were skipped. ByT5/Charsiu optional inference jobs were skipped by policy.
- No local pytest/npm/build was run: container-side GitHub clone failed because github.com DNS could not resolve. Connector-reported Actions results are not represented as local tests.

The master handoff remains preserved as the historical append-only record. The current superseding continuation is recorded in this audit and the 236-case integration record; direct full-file append to the oversized handoff is blocked by the available content-write limit.

## Superseding continuation snapshot — 2026-11-06

Current main is `2e9647540e1be47571579f71b7466393172a2a6d`; PR #441 (runtime) and #442 (post-merge docs) are merged. The 236-row cohort remains 15 exact standard-form occurrences with runtime dispositions, 181 bounded profile-convention decisions, 12 abstentions and 28 unadjudicated rows. All rows remain retained; 40 remain evidence-limited.

The 24 fortis [ɕ͈]→/s͈/ edit operations occur in 24 occurrence IDs across 19 source rows; 23 are before /i/ and one is before /jo/ (ID 96). Kong & Kang (2021) show age- and gender-conditioned fronting of word-initial /s͈i/ in young women, but explicitly describe it as closer to alveolar [s] than post-alveolar [ɕ]. This does not support an optional [ɕ͈] IPA variant for unknown speakers; the /jo/ case also remains unresolved. The two /ɘː/ vs /ʌː/ differences remain profile-symbol questions. The 12+28 residual rows require original audio, speaker crosswalk and two independent Korean IPA annotations; phrase-level Rule 29 candidates also require prosodic-boundary evidence. No further production rule is justified by current evidence.

Multi-engine run [42215019081](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42215019081) on exact PR #441 head `847cdb240aadc2c9343127fbb7de6dafad0441d4` **FAILED** at generated-artifact `cmp`: generator output had 25 unmapped-Broad rows, tracked CSV had 26, including occurrence 2490 (`머리속에`) now covered by the exact alias. Failure: byte 86966 / line 26. Downstream Browser same-occurrence parity, Native/Browser parity and SIGMORPHON jobs were skipped; optional ByT5/Charsiu jobs were skipped by policy. Regenerate the tracked CSV from the pinned generator/corpus, inspect the full row-level diff, and rerun the entire workflow. Do not weaken the byte comparison.

Current-main checks for `2e9647540e1be47571579f71b7466393172a2a6d`: tests 42216016963, system verification 42216016988, master/research artifacts 42216016940 and Pages deployment 42216016937 all succeeded. These do not supersede the separate multi-engine failure. No local pytest/npm/build ran; GitHub DNS resolution failed in the container.

PR #439 remains open and was left untouched: its branch is 56 commits behind current main; its exact-head tests and verification failed (42200300941, 42200300947). Do not merge blindly. The four upstream workflow references are already documented as process-only adoption; no upstream code or duplicate orchestration is needed.

**Current status:** cohort and 15 runtime dispositions DONE_VERIFIED; 181 profile reconciliations DONE_VERIFIED as non-integration decisions; 24 fortis operations BLOCKED for token-level IPA adjudication (2021 acoustic evidence does not support generic [ɕ͈]; exact speaker/audio needed); 40 abstained/unadjudicated rows BLOCKED; multi-engine artifact PARTIAL pending regeneration/reverification; current-main ordinary CI DONE_VERIFIED; independent Korean IPA and Ukrainian target review BLOCKED; release readiness DEFERRED (partial research prototype).

### Generated diagnostic queue reconciliation — 2026-11-06

The tracked unmapped-Broad CSV has now been regenerated from artifact 13501009061 of exact-head run 42215019081, using the workflow's pinned generator output. A row-by-row comparison found exactly one stale row: occurrence 2490 (`머리속에`), already covered by the exact pronunciation alias merged in PR #441. No other occurrence rows changed. The refreshed CSV now contains 25 rows and preserves the generator artifact's exact 89,638-byte content (Git blob SHA `15655fa35b74251c8c0fdd6e2b6dc973d3bba631`). This repairs the known stale snapshot; acceptance remains PARTIAL until the full multi-engine workflow reruns and the downstream Browser parity/SIGMORPHON jobs complete.

### Master handoff preservation note

The original master handoff blob `b49170395fa7f67ee50f29e32def5349fe92fef3` has been restored unchanged on this branch. A content-write attempt returned a truncated replacement because the handoff exceeds the available safe write path; the branch was corrected by restoring the exact original blob through the Git data tree API. No master-history content is changed in the final branch tree. This audit and the 236-case integration record are the current superseding continuation. Appending directly to the oversized master handoff remains BLOCKED by the connector write limit.

## 2026-11-06 — superseding fortis sibilant evidence review: no runtime change

The previous audit treated the 24 `ɕ͈→s͈` operations as unresolved and misstated their row count. Reconstructed from the 236-row ledger, these are **24 occurrence IDs in 19 source rows**; 23 reference forms contain [ɕ͈i], and only ID 96 (`똥꼬쑈`) is [ɕ͈jo]. Twenty-two forms contain orthographic ㅆ; two coda-triggered fortition cases are IDs 481 (`했을시`) and 551 (`실시간`).

Evidence reviewed:
- Holliday 2014 JASA describes both lenis-aspirated /sh/ and fortis /s*/ as typically palatalized before /i/ or /j/, but this is background in a perception study (SRC-HOLLIDAY-2014-JASA).
- Holliday 2016 Phonetica notes that fortis /s*/ may palatalize less consistently; its experiment is perceptual (SRC-HOLLIDAY-2016-PHONETICA).
- Holliday & Reidy 2016 places the /s*/ palatalization statement in poster background; it does not report speaker-level or token-level fortis-palatalization results from its six-speaker production sample (SRC-HOLLIDAY-REIDY-2016-PRODUCTION).
- Kong & Kang 2020 report palatalized variants before /i/ in an abstract covering /s/ and /s'/ but do not disaggregate the category (SRC-KONG-KANG-2020-SEOUL-SIBILANTS).
- **Kong & Kang 2021 provide direct acoustic constraints.** They analyze 39 adult Seoul Korean speakers and 1,832 sibilant tokens. Young female word-initial /s͈i/ shows age-related spectral fronting, but the authors explicitly describe the variant as closer to alveolar [s] than post-alveolar [ɕ], and the effect is context- and gender-specific (SRC-KONG-KANG-2021-SEOUL-SIBILANT-AGE-GENDER).

**Implementation decision: no [ɕ͈] runtime variant is accepted.** Keep canonical broad [s͈] unchanged in Python and Browser; do not add [ɕ͈] to broad or narrow output and do not map an unobserved speaker-conditioned fronting variant into Ukrainian. The 23 /i/ cases are not resolved by the 2021 finding because it does not support [ɕ͈]; ID 96 /jo/ remains separately unsupported. The 24 mismatches remain part of the 181 profile-convention cases, not the 40 abstained/unadjudicated rows. Exact speaker identity and token audio are required for any individual alternate IPA decision.

The data-inventory test `test_fortis_sibilant_candidate_inventory_has_exact_context_distribution` now records the 24 operations, 24 occurrence IDs, 19 source rows, 23 /i/ contexts and the single /jo/ case. Existing negative controls keep `씨` as a no-variant case in the broad research profile. No runtime code change is accepted from this evidence review.


## 2026-11-06 — source redistribution rights gate

The source-rights PR #439 was reviewed and its useful scope distinction is being ported with corrected tests and a negation-aware usage classifier. The current source register contains **213 rows, 12 columns and zero structural errors**. The read-only audit classifies citation-only references separately from actual retained material; the strict gate only blocks a positive copied/included/redistributed artifact whose item-level license remains unresolved. Phrases such as `no IPA-Dict corpus file copied` are not positive redistribution claims.

### Current item-level disposition

- `SRC-UGTPHON-EMNLP-2026`: the official UGTPHON Korean subset `ko/LICENSE` explicitly declares Apache-2.0. The repository retains 39 selected context excerpts under that subset-level grant, with attribution and the license notice preserved; it does not include the full dataset or separate IPA-Dict targets. This is an actual reuse, but an item-level license is recorded. The UGTPHON provenance note about MultiLexNorm++ remains documented separately; it is not a reason to misclassify the explicit Korean-subset license as unknown.
- `SRC-IPA-DICT-KO`: the source is used indirectly as provenance for UGTPHON gold; no IPA-Dict corpus file or target annotation is copied into this repository. The audit's negation-aware matcher must not flag the words `no ... copied` as redistribution.
- Citation-only academic papers and official references remain citation-only; research use does not itself waive copyright, but citation without copied source material is not a redistribution blocker.

The strict source-rights audit currently yields **zero unresolved positive-redistribution blockers**. The informational triage counts are 4 item-level licenses recorded, 1 not-applicable, 37 citation-only/no-reuse, 162 review-required and 9 manual-classification-required; the last two categories include references that are not redistributed and therefore do not block the strict gate. The exact counts are generated by `npm run audit:source-register`; `npm run audit:source-rights` is the release gate and must exit 0.

Acceptance requires the CSV parser/rights tests, a passing `npm run audit:source-rights`, and the same command in the GitHub Actions verification workflow. The audit is a triage tool, not legal advice; it never grants permission or infers rights from academic purpose alone.


### Artifact reconciliation follow-up — 2026-11-06

Recovered the original multi-engine ZIP from run 42215019081 and compared its generated queue to the tracked CSV. The 25 generated rows are unchanged; the sole extra tracked row is occurrence 2490 (`머리속에`), now licensed by the exact pronunciation alias. The tracked CSV has been replaced on continuation branch `research/236-residual-review-2026-11-06` with the exact generator-produced file, commit `8b87cd63bb145ccd8611144331dad20f1ad6663a`. No expected counts were changed and no rows were manually rewritten. Status improves from stale artifact identified to **artifact reconciled / CI rerun pending**; multi-engine acceptance remains PARTIAL until downstream parity and SIGMORPHON jobs pass on the corrected branch.


### Ledger correction and current CI state — 2026-11-06

The exact fortis inventory is **24 occurrence IDs across 19 source rows**, not 23 occurrence rows: 23 are /i/ contexts and one is /jo/ (ID 96). The table above has been corrected to this exact inventory. The unmapped-Broad CSV is no longer awaiting regeneration: it has been replaced with the exact 25-row output from the recovered CI artifact. Its remaining status is **CI rerun pending**, not artifact-generation pending. On the final branch head `2e4a76cc33fd55400f9de08ae9467ef1c2f45002`, multi-engine workflow run 42225608310 is pending with no jobs reported yet; ordinary tests 42225608150, system verification 42225608125, Browser integration 42225608073 and exhaustive extraction 42225608074 are queued/in progress. Master/research artifact workflow 42225608146 succeeded. Do not claim these in-progress workflows passed.

## Superseding continuation — 2026-11-06 after PR #443 merge

**Current `main`:** `bb972871a207b1f703503ade980a36cf3b976085` (merge commit for PR [#443](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/443)).  
**PR #443 exact verified head:** `625d6e3171e30ae7a6aae525dfdd4ded2c5249f8`.  
**Documentation continuation branch:** `docs/repository-structure-and-navigation-2026-11-06`.

### Reconciled PRs and branches

- PR #443 was reviewed before merge: 16 changed paths, no submitted reviews or inline review threads, and GitHub reported it mergeable. Its latest exact-head CI completed successfully for all mandatory jobs.
- PR #443 merged with merge commit `bb972871a207b1f703503ade980a36cf3b976085`; it reconciles the 236-case disposition, exact generated mismatch queue, source redistribution scope, source-register tests, release script and workflow gate.
- PR #439 was closed as superseded after its intended redistribution-scope distinction and corrected negation-aware classifier were incorporated into #443. Its source branch was preserved.
- No force-push, branch deletion, release publication, branch-protection change or unrelated branch cleanup was performed.

### Current verification evidence

| Workflow | Run | Result |
|---|---:|---|
| Multi-engine Korean IPA diagnostic | [42226435101](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42226435101) | PASS — pinned engines/licences, UGTPHON and SIGMORPHON split validation, adapter tests, holdout audit, reviewer packet generation, multi-engine comparison, mismatch export, Browser same-occurrence run, Native/Browser parity and SIGMORPHON comparison |
| System verification | [42226435403](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42226435403) | PASS — browser regression, `npm run audit:source-rights`, public-page build, generated-page checks, Python regression/data integrity |
| Optional CharsiuG2P inference | same multi-engine run | SKIPPED by policy; not a pass |
| Optional ByT5 inference | same multi-engine run | SKIPPED by policy; not a pass |
| Conditional live NIKL crawl | system verification | SKIPPED because the branch did not match its research-only condition; not a pass |

The multi-engine run's required steps all completed successfully, including the export comparison and downstream parity jobs that were previously skipped by the stale generated CSV. This closes the previously recorded multi-engine artifact/parity blocker for this exact PR head. The benchmark remains diagnostic: it does not create independent Korean IPA gold or validate Ukrainian targets.

### Current 236-occurrence task ledger

| Workstream | Status | Evidence / remaining acceptance |
|---|---|---|
| Reconstructed 236-row candidate inventory | DONE_VERIFIED as a reproducible inventory | 236 unique occurrence IDs retained; original historical 236/239 selector membership remains unproven |
| 15 exact standard-form runtime dispositions | DONE_VERIFIED as bounded software implementation | Ten new exact integrations plus five pre-existing exact licenses; no spelling rewrite or unsupported productive rule |
| 181 profile-convention cases | DONE_VERIFIED as bounded non-integration decisions | Do not interpret as categorical phonology or speaker-level narrow IPA |
| 12 abstentions + 28 unadjudicated | BLOCKED | Need source/token/audio/speaker/prosody crosswalk and qualified independent Korean IPA annotation |
| Independent Korean IPA review | BLOCKED | Reviewer packets are prepared; no independent first-pass annotations or blind reconciliation are evidenced |
| Independent Ukrainian target review | BLOCKED | Requires a separate review on frozen IPA inputs |
| Strict source-redistribution gate | DONE_VERIFIED, scoped | Zero unresolved positively recorded redistribution items; informational citation-only/non-redistributed review records remain |
| Broader source reuse clearance | PARTIAL / item-specific | Any new retained third-party material requires item-level licence/permission, attribution and scope evidence; academic purpose alone is not a grant |
| Multi-engine benchmark | DONE_VERIFIED, mandatory steps | Run 42226435101 passed mandatory comparison, export, Browser same-occurrence, Native/Browser parity and SIGMORPHON steps; optional neural jobs skipped |
| Release readiness | DEFERRED | Research prototype only; independent Korean IPA and Ukrainian target validation remain open |

### Source-rights interpretation

The source register contains 213 rows and 12 columns with zero structural errors. The strict gate passed with zero unresolved positively recorded copied/included/redistributed artifacts. The generated triage also contains 162 review-required and 9 manual-classification-required references; those are not automatically redistribution blockers when the source is citation-only or not retained in the repository. This software gate is not legal advice and does not authorize future reuse. `npm run audit:source-register` is the read-only triage; `npm run audit:source-rights` is the strict release gate.

### Documentation and structure decisions

- The repository has 831 tree entries (789 files, 42 directories), 177 Markdown files, 394 test files, 64 scripts, 18 workflows and 13 schemas; `docs/` has 146 files and `research/` 55 at the current snapshot.
- Keep the flat historical `docs/` namespace. Improve discoverability through `README.md`, `docs/README.md`, `docs/REPOSITORY-STRUCTURE.md` and `research/README.md`; do not bulk-move files whose paths are referenced by tests, scripts, evidence packets and historical reports.
- Keep one canonical source register, rule coverage matrix, acceptance-gate register and execution handoff. The oversized append-only handoff remains unchanged; this audit is the current superseding continuation where the connector cannot safely append to the 1 MB handoff.
- The four upstream workflow references (Unlazy, Superpowers, Matt Pocock skills, Ponytail) remain process-only references. No upstream code, skill text, hooks, plugins, artwork or benchmark data was copied.

**Local verification boundary:** no local `npm`, `pytest`, build or clean-install command was run in this connector-only session. Exact-head GitHub Actions results above are the verification evidence; they must not be described as local execution.

**Readiness:** mandatory software verification and the pinned multi-engine diagnostic are complete for the merged PR head. The repository remains a **bounded research prototype**, not independently research-certified or release-ready.

## Post-merge handoff — PR #444 documentation integration (2026-11-06)

**Starting main for the documentation pass:** `bb972871a207b1f703503ade980a36cf3b976085` (PR #443 merge).  
**Documentation PR:** [#444](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/444), merged at `e3ca4de087dc87c215d5284e59c89bdb0bff2808`.  
**Current main at this handoff snapshot:** `e3ca4de087dc87c215d5284e59c89bdb0bff2808`.

### PR #444 scope and verification

- Updated the root README positioning/status, documentation index, repository structure guide, architecture pointer, research index, roadmap and acceptance gates.
- Appended the superseding evidence state to this repository audit; preserved the oversized append-only master handoff unchanged.
- Extended the documentation structure contract test to validate local links in the repository-structure and research indexes and to guard current benchmark/readiness evidence.
- Exact branch-head push verification [42231553988](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42231553988): PASS — Python regression/data integrity; browser tests **1,407/1,407**; strict source-rights gate; Vite build; generated-page checks. Conditional NIKL crawl SKIPPED.
- PR event system verification [42231693973](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42231693973): PASS — Python regression/data integrity, browser regression, source-rights gate, build and generated-page checks.
- PR event exhaustive register extraction [42231693721](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42231693721): PASS.
- PR event master/research artifact generation [42231693765](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42231693765): PASS.

### Post-merge main verification

| Workflow | Run | Snapshot result |
|---|---:|---|
| Tests matrix | [42231901835](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42231901835) | PASS — Python 3.11/3.12/3.13, browser tests/build, wheel-install IPA data check and teacher-corpus audit |
| System verification | [42231901990](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42231901990) | PASS — browser regression, strict source-rights gate, build/generated pages, Python regression/data integrity |
| Master/research artifacts | [42231901902](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42231901902) | PASS |
| Pages deployment | [42231902193](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42231902193) | IN_PROGRESS at deploy step at this handoff snapshot; Python 3.11/3.12/3.13, strict corpus validation, browser tests, static build and artifact upload had passed; deployment and live smoke were not yet confirmed |

The preceding Pages deployment on main commit `bb972871a207b1f703503ade980a36cf3b976085` passed in run [42230551652](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42230551652). Do not count the later in-progress deployment run 42231902193 as a pass until it completes.

### Branch and PR disposition

- PR #443 and PR #444 are merged; PR #439 is closed as superseded by #443.
- The repository branch inventory at this snapshot contains **11 branches** (main plus 10 supporting/historical branches). The task-specific documentation branch was merged; supporting and historical branches were preserved rather than deleted or force-pushed.
- No open PRs were returned at this snapshot. No unrelated branch was blindly merged or cleaned up.

**Local execution boundary:** no local shell, `npm`, `pytest`, clean-install or browser command was run in this connector-only session. All test/build/deployment statuses above are GitHub Actions evidence. The post-merge Pages run is explicitly still in progress at this snapshot.

**Final readiness:** documentation/navigation is merged and CI-verified; mandatory multi-engine comparison and scoped software rights gate are verified. The product remains a bounded research prototype, not independently research-certified or release-ready because independent Korean IPA review, independent Ukrainian target validation, and proof of original historical cohort membership remain open.


## 2026-11-06 — residual 40-case evidence register follow-through

**Working branch:** `research/236-residual-evidence-register-2026-11-06`, based on `main` at `da9f98bdba553f80ecba0614294066c2d0561966`. Existing 236-case branches were compared with main; the residual-review and other 236 support branches are ancestors/behind main, with no unmerged changes to port. No open PRs were returned at the start of this batch.

- `DONE_VERIFIED` — primary-source and literature recheck of all 12 abstentions and 28 unadjudicated occurrences; exact occurrence IDs and family crosswalks retained.
- `DONE_VERIFIED` — new machine-readable 28-row residual evidence register, with source IDs, reviewed basis, explicit no-change runtime action and reopening evidence.
- `DONE_VERIFIED` — source register adds Lee (2023), DOI 10.17959/sppm.2023.29.2.193; KCI abstract reports an incomplete, age/gender- and position-sensitive /ɛ/–/e/ merger.
- `PARTIAL` — 236-case generator and generated ledger now project residual review fields; exact-head CI and generated-artifact checks are pending for this branch.
- `BLOCKED` — no original audio or speaker crosswalk for the 40 unresolved rows; no two independent Korean IPA annotations. Therefore no new runtime rule or IPA/target gold is justified.

The 28 rows are 27 lenis-sibilant mismatch occurrences across six token strings plus one mid-front-vowel quality case. Twenty-two `아끼셔` repetitions are one source-row/token family. The 12 abstentions remain 12; the 28 remain unadjudicated. All 40 remain excluded from production adjudication. No IPA-first adapter, canonical runtime output, Ukrainian target, or benchmark gold was changed.

**Next acceptance criterion:** recover the original source audio and speaker mapping for all 40; obtain two independent, blinded Korean broad/narrow IPA annotations with syllable and prosodic boundaries; reconcile disagreements; only then review Ukrainian adaptation and add occurrence-specific runtime tests. For stylized IDs 1219/1288 also recover source normalization policy; for ID 1885 explicitly annotate /ɛː/ versus /eː/ rather than infer it from a population merger.


The runtime metadata update cites the 2023 Seoul mid-front-vowel study in both native and browser shared-Broad optional-variant notes. Added regression guards assert that the six residual sibilant token strings do not acquire canonical or optional [ɕ] under the shared Broad profile and that ID 1885's existing length is preserved. Source-register size is now 214 rows (one new citation-only research record); no license permission is inferred from citation.


## Superseding post-merge verification — PR #446 (2026-11-06)

**Starting `main`:** `da9f98bdba553f80ecba0614294066c2d0561966`.  
**PR:** [#446](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/446), merged.  
**Merged `main` commit:** `321e4a126167eab0ad31fc44ae22b587ee8c809c`.  
**PR head:** `29dc5d4634be5e6196f33ba9ab35949c22d602aa`.

### Change outcome

- Added `research/kozak-kim-236-residual-review-2026-11-06.csv`, an exact 28-row evidence register with occurrence/source-row/token crosswalks, reviewed basis, source IDs, explicit no-production-change action and reopening criteria.
- Extended the reproducible 236-case generator and generated candidate ledger with five `residual_review_*` fields; exact residual IDs and the 12 abstention IDs are pinned by regression tests.
- Added Lee (2023), DOI `10.17959/sppm.2023.29.2.193`, to the source register as citation-only research evidence. Native Python and browser shared-Broad optional-vowel metadata now cite it; canonical IPA and vowel length remain unchanged.
- Added regression guards for all six residual sibilant token strings: canonical shared-Broad /s/ remains and unsupported [ɕ] variants are not introduced. The `대한민국` optional [ɛ]~[e] candidate remains non-selective and preserves length.
- Updated the candidate review, engine integration record, roadmap, acceptance gates, audit and handoff. No production phonology rule, canonical IPA, Ukrainian target or benchmark gold changed.

### Exact-head PR verification

| Workflow | Run | Result |
|---|---:|---|
| System verification | [42236756802](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42236756802) | PASS — browser regression/build; Python regression/data integrity; conditional NIKL inventory SKIPPED |
| Tests matrix | [42236756533](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42236756533) | PASS — Python 3.11/3.12/3.13, browser, wheel install, teacher-corpus audit |
| Paired native/g2pk diagnostic | [42236756657](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42236756657) | PASS |
| Master/research artifacts | [42236756864](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42236756864) | PASS |
| External UGTPHON diagnostic | [42236756433](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42236756433) | PASS |
| Exhaustive test-case extraction | [42236756422](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42236756422) | PASS |
| Morphology consensus | [42236756578](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42236756578) | PASS |
| Multi-engine IPA diagnostic | [42236756898](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42236756898) | PASS — pinned comparison; optional CharsiuG2P, ByT5 and dependent neural pairing SKIPPED |
| Charsiu train/dev queue | [42236756752](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42236756752) | SKIPPED by policy |

### Post-merge `main` verification

| Workflow | Run | Result |
|---|---:|---|
| Tests matrix | [42254523067](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42254523067) | PASS — web, Python 3.11/3.12/3.13, wheel install, teacher-corpus audit |
| System verification | [42254523015](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42254523015) | PASS — browser regression/build and Python regression/data integrity; NIKL inventory SKIPPED |
| Master/research artifacts | [42254523078](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42254523078) | PASS |
| Pages deployment | [42254523031](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42254523031) | CANCELLED by the subsequent documentation-only push; replacement [42254864628](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42254864628) queued on the current documentation commit |

### Updated disposition and remaining blockers

| Workstream | Status | Acceptance / blocker |
|---|---|---|
| 236-row reconstructed cohort and generated ledger | DONE_VERIFIED as a reproducible candidate inventory | 236 rows; historical original 236/239 selector membership remains unproven |
| 15 exact standard-form runtime dispositions | DONE_VERIFIED as bounded software integration | Ten new exact licenses plus five pre-existing licenses |
| 181 profile-convention decisions | DONE_VERIFIED as bounded non-integration decisions | Not categorical phonology rules or speaker-level narrow IPA |
| 28 residual occurrence evidence reviews | DONE_VERIFIED as evidence traceability | 28/28 rows crosswalked and reviewed; this is not IPA adjudication |
| 12 abstentions + 28 unadjudicated | BLOCKED for linguistic acceptance | Need original audio and speaker crosswalk; two independent Korean broad/narrow IPA annotations with syllable/prosodic boundaries; blind reconciliation |
| Ukrainian target review for the 40 | BLOCKED | Separate independent Ukrainian review after IPA is frozen |
| Original historical cohort membership | PARTIAL | Reconstructed selection; original 236/239 selector/member list still required |
| Release readiness | DEFERRED | Remains a bounded research prototype, not independently research-certified or release-ready |

**Execution boundary:** no local `npm`, `pytest`, build or clean-install command was run in this connector-only session. Exact-head and post-merge GitHub Actions evidence is recorded above. The oversized append-only master handoff was preserved; this dated audit is its superseding continuation. No branch was deleted, no force-push was used, and no release was published.


### Documentation navigation refresh — current `main` continuation

The root README, documentation index, repository-structure guide and this audit were reconciled after the PR #446 merge. Current `main` is `e0feeb6ac3697d026d151f3fbb78796728a1e8da`; the recursive tree remains 832 entries (790 files, 42 directories), including 177 Markdown files, 394 test files, 64 scripts, 18 workflows and 13 schemas; `docs/` has 146 files and `research/` 56 files. The documentation index now links the residual 28-row evidence register directly.

The earlier post-merge Pages run 42254523031 was cancelled when this documentation-only push superseded it. Replacement Pages run [42254864628](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42254864628) was queued on the current head. The new documentation commit's tests, system verification and master/research artifact workflows were still running at this snapshot; update this status only from their final results.


### Documentation contract-test correction — 2026-11-06

The first documentation-navigation refresh exposed a structural contract: `tests/agent-workflow-structure-contract.test.mjs` requires the root README to retain links to the PR #443 baseline benchmark run `42226435101` and system verification run `42226435403`. The status rewrite had dropped those historical references. Restored both as explicitly labelled historical baseline evidence, separate from the PR #446 exact-head checks. The failure was limited to this documentation assertion: 1 of 1,407 browser tests failed and the other 1,406 passed; Python 3.11/3.12/3.13, wheel install and teacher-corpus audit passed. The corrective change is documentation-only; exact-head verification is triggered again on the current `main`.




### 2026-11-06 — no-audio adjudication of all 40 residual occurrences

**Branch:** `research/no-audio-40-case-adjudication-2026-11-06` (based on main `3570b3e5a35533739226d6bf9f0eefb1eb81fbac`).  
**Detailed decision record:** [40-case no-audio adjudication](KOZAK-KIM-40-NO-AUDIO-ADJUDICATION-2026-11-06.md).  
**Occurrence ledger:** [40-row engine-policy register](../research/kozak-kim-40-no-audio-engine-policy-2026-11-06.csv).

- **DONE implementation (pending CI):** Python and browser NIKL §29 phrase-mode handling for the explicitly spaced phrases `홍콩 영화들`, `한국 여자로`, and `첫 연애`; these are not token-specific lexical attestations; no hidden word boundaries are inferred in compact tokens.
- **DONE policy adjudication:** all 40 occurrences have `ENGINE_POLICY_RESOLVED_NO_AUDIO` decisions (12 original ABSTAIN rows + 28 focused residual rows; 17 distinct token spellings; 12 policy families).
- **BLOCKED evidence claim:** all 40 remain `UNRESOLVED_NO_AUDIO` for speaker-specific IPA gold. No audio is available by user constraint; no narrow IPA, speaker-specific [ɛ]/[e], or optional prosodic variant is fabricated.
- **Data-quality finding:** source contexts for occurrences 1219 and 1288 contain raw `ㅠ` emoticons but canonicalized text replaces them with `유`; these spans are non-speech notation and must not be treated as spoken /ju/. The runtime's standalone-jamo guard is now tested with `ㅠㅠ`.
- **Preserved:** original 12 ABSTAIN and 28 residual review statuses, source registry, IPA-first adapter boundary, and historical 236-case completion counts. No benchmark gold was rewritten.
- **New tests:** Python coverage for 40-row crosswalk, source-register integrity and emoticon normalization evidence; Python and browser exact Rule 29 phrase tests; browser no-glide/hiatus/sibilant regressions; standalone-jamo regression.

**Commands/results:** no local shell, pytest or npm command was run; this connector-only session cannot execute repository tests locally. CI on the PR head is the acceptance gate. The >1 MB append-only `MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md` was preserved; this dated audit is the concise continuation record. Do not call the implementation `DONE_VERIFIED` until exact-head CI, generated-artifact checks and any downstream jobs complete.




### 2026-11-06 — PR #447 merged; 40 no-audio engine policies integrated

**Merge:** PR [#447](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/447) squash-merged into `main`. Merge commit: `3c93a92e9b48c2a1c68d1139137a55c2dd2e7c7e`. PR head before merge: `6813018d4987822a42225dfa05590916e3030f52`.

**Implemented outcome:** all 40 residual occurrences have `ENGINE_POLICY_RESOLVED_NO_AUDIO` dispositions in `research/kozak-kim-40-no-audio-engine-policy-2026-11-06.csv` (12 original ABSTAIN + 28 focused residual; 17 token spellings; 12 policy families). All 40 retain `UNRESOLVED_NO_AUDIO` for speaker-specific IPA gold. No narrow IPA or speaker-specific optional variant was fabricated. The three explicit Rule 29 phrase-mode paths are conditional and do not infer boundaries in compact corpus tokens.

**Exact PR-head verification (head `6813018...`):**
- Tests [42261250418](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42261250418) — PASS: Python 3.11/3.12/3.13, wheel installation, teacher-corpus audit, browser `npm test` (**1,413 passed, 0 failed**) and `npm run build`.
- System verification [42261250274](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42261250274) — PASS: Python and browser tests/build; source redistribution rights gate PASS; official NIKL metadata-only inventory SKIPPED by workflow policy.
- Master table/research artifacts [42261250275](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42261250275) — PASS.
- Exhaustive test-case register extraction [42261250316](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42261250316) — PASS.
- External UGTPHON diagnostic [42261250212](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42261250212) — PASS.
- Paired native/g2pk diagnostic [42261250288](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42261250288) — PASS.
- Morphology consensus [42261250269](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42261250269) — PASS.
- Research morphology adapter smoke [42261250254](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42261250254) — PASS.
- Multi-engine comparison [42261250219](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42261250219) — still IN_PROGRESS at this audit snapshot. Optional CharsiuG2P and ByT5 inference jobs were SKIPPED by policy; no result is claimed for them.

**Post-merge main verification (merge commit `3c93a92...`):**
- Tests [42262026684](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42262026684) — PASS.
- System verification [42262026710](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42262026710) — PASS: Python/browser tests, source-rights gate, public build.
- Master table/research artifacts [42262026709](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42262026709) — PASS.
- Pages deployment [42262026851](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42262026851) — IN_PROGRESS at this snapshot; Python 3.11/3.12/3.13 strict corpus/tests and browser tests/build/artifact checks had passed; deployment and live smoke were pending.

An initial Python assertion run [42260665657](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42260665657) failed because the test expected rendered surface Hangul without preserving explicit word spaces. The implementation had inserted the expected nasal; the regression expected strings were corrected to retain spaces, and the complete PR-head Python/browser suites passed afterward.

**Execution limits:** no local shell, `pytest`, or `npm` command was run in this connector-only session; all verification above is GitHub Actions evidence. The >1 MB append-only `MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md` remains preserved; this audit is its dated continuation. No branches were deleted, no force-push was used, and no release was published.

**Readiness:** the 40 engine-policy decisions are integrated and tested. The 40 speaker-specific IPA gold claims remain no-audio-limited. Original historical 239-member cohort proof and independent Ukrainian target review remain open; the repository remains a bounded research prototype, not a release-certified pronunciation authority.


## Addendum — UGTPHON five native abstentions (2026-11-06)

The five residual Native G2P abstentions have been reviewed against the pinned UGTPHON rows and primary/source-specific evidence. Three exact-token cases now have Python/Browser R002/R003 licenses (`쫒아내면`, `많앗구나유유유`, `무서웟어`), with raw spelling retained and no generalization. Two remain blocked: `칡칡이` is a directly attested folk-song heading in the Busan oral-culture collection, but no audio/field notes establish its spoken realization; `삶의` has NIKL Hangul variants but no independent IPA adjudication. The prior folk-source register claim that the PDF text layer read `칭칭이` was corrected; opened PDF lines 20611–20622 read `칡칡이`. Implementation and tests are in PR #454; exact-head CI is pending on the final branch head. See [the focused case report](UGTPHON-FIVE-ABSTENTIONS-RESOLUTION-2026-11-06.md) and [the current triage register](../research/final-residual-abstention-triage-2026-10-25.json).


## Addendum — source-only adjudication of the 40 residual occurrences (2026-11-07)

The no-audio constraint has been addressed with public normative and scholarly sources. A separate source-only pass records a disposition for **all 17 distinct token spellings across 40 occurrence rows**. It distinguishes canonical broad structure, explicit morphology, conditional prosodic variants, non-speech emoticons, and research-only vowel variants. See [the source-only adjudication report](KOZAK-KIM-40-SOURCE-ONLY-ADJUDICATION-2026-11-07.md) and [the 17-token machine-readable register](../research/kozak-kim-40-source-adjudication-2026-11-07.csv).

This does not claim speaker-level acoustic IPA. The original occurrence register retains `UNRESOLVED_NO_AUDIO` specifically for the 40 token/speaker IPA-gold claims. Published aggregate studies cannot determine the original speaker's narrow sibilant realization, vowel quality, speech rate or prosodic grouping. Compact `홍콩영화들`, `한국여자로` and `첫연애실패후` therefore remain unchanged unless a caller explicitly supplies segmentation/phrase mode; the engine does not infer hidden spaces.

**Implementation decision:** no new runtime rule was added because the already-integrated Python and Browser policies match the source-backed boundaries. Jun (2021) was added to the source register to document the variable/gradient n-insertion evidence. All source IDs in the new 17-token register were checked against the source register. The new report/data artifacts require exact-head CI before they are marked fully verified.

**Status correction:** source-based engine-policy adjudication is complete for the 40 occurrences; speaker-specific IPA gold is still unresolved for 40/40. These are separate acceptance axes and must not be conflated.


## Addendum — exact source adjudication for 삶의 (2026-11-07)

The earlier IPA hold for UGTPHON occurrence `dc_inside_2212` is superseded at the standard-variant level. NIKL MCFAQ 5716 directly names `삶의` and lists `[살믜]` and `[살메]`. The official Rule 5 commentary clarifies that the consonant-initial `ㅢ → [i]` exception does not apply when the preceding coda is resyllabified into the onset. The earlier project candidate `sal.mi` therefore applied the wrong exception.

The Python research lexicon and Browser lexical overlay now preserve the distinct broad-IPA candidates `sal.mɰi` and `sal.me`. The general Python and Browser pipelines now also track coda-resyllabification provenance so Rule 5's [i] exception is not applied to a resyllabified onset; `협의` is tested both with and without its lexical override (`hjʌ.bɰi` versus `hjʌ.bi`). The `ɰi → ий` Ukrainian correspondence remains provisional, so final target output is withheld and only a research candidate is exposed.

**Revised five-abstention status:** three exact runtime recoveries; one source-adjudicated standard variant set (`삶의`); one remaining source-limited case (`칡칡이`). No speaker-specific variant or narrow IPA is claimed. No audio or external reviewer outreach is requested.


## Addendum — correction of the 칡칡이 source citation (2026-11-07)

A corrected direct-page inspection of the cited Busan PDF distinguishes two entries: printed p. 586, lines 20611–20622, is `[철마면 민요 26] 칡칡이`, singer 이문춘 (male, born 1923), fieldwork 1991-10-19 at 철마면 이곡리; printed p. 548, lines 19372–19381, is the separate `[장안읍 민요 13] 칭칭이`, with different performers and locality. The p. 587/칭칭이 cross-reference used in the earlier addendum was erroneous. The National Gugak Center separately documents `칭칭이소리`.

Earlier repository wording that the PDF directly attested `칡칡이` was incorrect and has been corrected in the source register, triage JSON, and five-abstention report. The evidence establishes a source mismatch, not a safe normalization: preserve benchmark `칡칡이`, do not rewrite it to `칭칭이`, and do not add a lexical IPA rule. The exact token remains fail-closed until a source explicitly attests it or documents its correction. No audio or reviewer outreach is requested.


## 2026-11-07 continuation — source-only evidence and 239 replay

### 239 candidate replay

- **DONE_VERIFIED — reconstructed candidate set:** the pinned pre-C11/C12 report (artifact 13148075070; ZIP SHA-256 `075ceff080decbb142492448c9344816bfb53f1e87fe563826668d037c053b89`; report SHA-256 `8c25e630ca828719b269aeb84c8037d9c40f881a0f15c2e4ddf9d427edffa0f9`) and historical classifier commit `8c335dd7031bdae59b3ef7db715b54f0fdc9bcd5` / blob `e0bb7f32d5b320d468e0bdcab0ed134c7a3278ec` were replayed.
- Exact selection: Broad edit distance > 0; historical NFC/combining-mark grapheme alignment; Broad fragments only; pre-C11/C12 historical aggregate labels C01–C07/C09/C10 (C08 not encoded); select only `UNMAPPED_REQUIRES_REVIEW`.
- Result: 370 Broad mismatches → 239 unique candidate IDs; 111 source rows; 154 unique tokens. Exact set comparison with the tracked candidate-ID file: **239/239**, no missing or extra IDs.
- Added `scripts/replay_kozak_239_candidate_selection.py` and unit tests. The script pins the report hash and fails closed if the candidate ID set differs.
- **PARTIAL — original historical identity:** no contemporaneous original selector/member snapshot survives. The replay proves the reconstructed candidate set and its reproducibility, not that the original manual selection used precisely this algorithm. Do not describe 239/236 as confirmed engine defects.
- After the three verified FIX overlaps (37, 704, 2031), 236 candidate rows remain: 213 without an individual disposition in the narrow registers, 22 overlapping ABSTAIN records, and one provisional RETAIN (1140, 출산). The later 15/181/12/28 disposition breakdown remains the current candidate-ledger classification.

### Public Seoul Corpus source route

OpenSLR SLR113 was checked directly. It lists the Seoul Corpus under CC BY-NC 2.0 and offers readme.tgz (27 MB), label.tgz (57 MB Praat TextGrid files), and sound.tgz (2.5 GB FLAC). The source register now records this explicit public route. Download attempts for label.tgz from both EU mirrors failed in this execution environment; the archive was not searched, so no exact 삶의 hit, speaker, timestamp or audio segment is claimed. The corpus cannot identify the unknown UGTPHON source speaker. CC BY-NC restrictions apply; no dataset files were redistributed or used for training.

### Literature additions

The source register now contains 225 records (12 columns), including Seoul Corpus metadata, Kim (2025) on context-conditioned 의 realization, Kim (2012) cine-MRI palatalization, Sung (2014) ultrasound lexical/post-lexical palatalization, Kim (2021) vowel-vowel transitions, and Shin (2013) optional /j/ formation/insertion. These abstract/metadata-level sources constrain overgeneralization; they do not provide token-specific IPA gold or authorize new runtime rules.

### Source correction

Direct reinspection confirms printed p. 586 (PDF p. 595) reads [철마면 민요 26] 칡칡이; printed p. 548 is the distinct [장안읍 민요 13] 칭칭이. The exact title is source-attested; its morphology and pronunciation remain unassigned. Do not alias or normalize 칡칡이 to 칭칭이.

### Verification boundary

The source crosswalk for all 40 no-audio occurrences remains complete at the engine-policy level, while speaker-specific IPA remains `UNRESOLVED_NO_AUDIO` for 40/40. PR #456 exact-head CI for the replay script, source changes, and Rule 5 liaison fix is still queued/pending; no pass is claimed for that continuation. Repository readiness remains a bounded, source-backed research prototype, not an independently research-certified or authoritative transcription standard.


**Durable replay input:** `research/kozak-kim-370-broad-only-replay-input-2026-11-07.csv` (370 rows, six fields; Git blob SHA `4335d6488a647f0e240dcc9f8aa24edc5f076a40`). The historical classifier was replayed against the original 370-row context ledger and independently against this compact input; both produced 239 IDs with exact 239/239 equality to the candidate snapshot. The regression now runs the complete 370-row replay in CI.


## 2026-11-07 continuation — PR #456 integration and UGTPHON rights reconciliation

### Integration and branch state

- Starting main commit: `1f220fcd7e3b44dab7302b37e2fe225812ee18a6`.
- PR #456 was reviewed and squash-merged to `main`: `18f5529b9100ea6e4f7c176c9627bacf1fc52585`.
- The owner-selected integration branch is `main`; root agent guidance and the workflow guide now encode this repository-specific instruction. Historical branches are preserved and were not deleted.
- The historical rights branch `audit/kozak-236-source-rights-2026-11-06` was used as a scoped source for files/code; it was not merged wholesale.

### Exact-head verification on PR #456 head `53ba9168e1dedeab3a4308736a0997dea6151ffd`

- DONE_VERIFIED: Python tests on 3.11, 3.12 and 3.13; browser tests and build; clean wheel install; source-rights gate; system verification; master/research artifact generation; exhaustive test-case register extraction; optional g2pK integration; external UGTPHON diagnostic; paired Native/g2pK diagnostic; morphology-consensus and morphology-adapter smoke.
- Paired Native/g2pK UGTPHON run `42414467883`: Native 1,425/2,702 exact (52.7387%), CER 9.0130%, one unresolved; g2pK 1,435/2,703 (53.0892%), CER 9.2328%, zero unresolved. Diagnostic only, not normative gold or Ukrainian accuracy.
- PARTIAL at the time of this snapshot: multi-engine diagnostic run `42414467825` remained in progress; no success or failure is claimed until its exporter/queue parity, Browser runtime parity and SIGMORPHON stages complete.
- Charsiu/ByT5 inference and the Charsiu train-dev review queue were skipped by workflow policy; skipped is not passed.

### UGTPHON Korean-subset rights

- DONE_VERIFIED: pinned upstream `UGTPHON/ko/test.json` commit `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`, blob `59380491d5a797308c475f7d0007dcf6c4be00af`, and Korean-subset `ko/LICENSE` declaration of Apache-2.0 are recorded.
- Ported the scoped rights audit, full Apache-2.0 text, source notice, independent-review protocol and packet builder from the audited historical rights branch; no blind branch merge was performed.
- The internal 236-case ledger contains richer source/context and phoneme/IPA comparison fields than the external reviewer packet. The packet builder omits those fields and validates exact source path, commit, blob and declared licence for every row.
- No 236-case reviewer packet has been generated or externally distributed. The subset-level licence declaration is a documented basis for the narrow packet workflow, not a legal opinion or independent guarantee of title for every original post.

### Remaining blockers and acceptance criteria

- BLOCKED — independent Korean IPA review of the 236 cases: two qualified independent reviewers must annotate all cases or explicitly mark unresolved items; blind reconciliation and reviewer method/convention records are required.
- BLOCKED — Ukrainian target validation: a separate Ukrainian-reader review must follow Korean IPA reconciliation; current /ɰi/ → Ukrainian target choices remain provisional.
- BLOCKED — original historical 236/239 selector membership: no contemporaneous original selector/member list has been recovered; the 239 replay verifies the reconstructed selection only.
- BLOCKED — per-post copyright chain-of-title: the upstream subset-level Apache-2.0 declaration is documented, but it is not independent evidence that every original post author had authority to license their post.
- PARTIAL — multi-engine diagnostic: run `42414467825` must finish the exporter/cmp, browser runtime parity and SIGMORPHON stages before its result is recorded.


## 2026-11-07 — documentation structure and current-main CI reconciliation

### Starting state and task ledger

- Starting default branch: `main`, commit `e72856c1f03bfb775805748f96ec23889ca2e60f`.
- Latest merged implementation preserved: PR #456, squash commit `18f5529b9100ea6e4f7c176c9627bacf1fc52585`.
- The four supplied engineering references are already reviewed in [ENGINEERING-WORKFLOW-REFERENCE-AUDIT-2026-11-06.md](ENGINEERING-WORKFLOW-REFERENCE-AUDIT-2026-11-06.md) and routed through [AGENT-WORKFLOWS.md](AGENT-WORKFLOWS.md). No upstream code, skill text, assets or benchmark data are copied.
- The current documentation architecture is retained: `README.md` for product overview; `docs/README.md` for navigation; `AGENTS.md` for task routing; `docs/AGENT-WORKFLOWS.md` and `.agents/skills/` for procedures; `docs/REPOSITORY-STRUCTURE.md` for ownership/data flow; existing research registers for evidence and acceptance; dated audit for continuation. No bulk rename or second master ledger is introduced.

| Work item | Status at start of continuation | Evidence / next acceptance |
|---|---|---|
| PR #456 source-only adjudication and runtime integration | DONE_VERIFIED on its merged commit | Exact-head PR evidence is linked in README/audit; 40/40 speaker-specific IPA gold remains unresolved |
| Four upstream workflow references | DONE_VERIFIED as process review | Existing pinned reference audit documents adoption and non-adoption boundaries |
| Mainline documentation status | PARTIAL | README and docs index had conflicting/stale commit and benchmark snapshots; reconcile all navigation/status surfaces |
| Source-register CSV integrity | TODO | CI reports malformed UGTPHON row; fix quoting and rerun browser/Python CSV consumers |
| Reviewer-packet pinned source validation | TODO | CI expects `UGTPHON/ko/test.json`, while ledger records `naver-ai/UGTPHON/ko/test.json`; align exact path with pinned source manifest and regression expectations |
| Multi-engine generated mismatch queue | BLOCKED pending reproduction | Run 42414467825 failed byte comparison at byte 554, line 1; regenerate from canonical inputs and compare exact artifact before claiming pass |
| Independent speaker IPA gold / Ukrainian target review | BLOCKED / EVIDENCE-LIMITED | Requires source audio/speaker crosswalk and qualified independent reviewers; do not infer from corpus aggregate scores |
| Release certification | DEFERRED | Research prototype is not independently certified; current-main CI/deployment must pass first |

### Exact current-main verification evidence

- System verification [42415278464](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42415278464), head `e72856c1f03bfb775805748f96ec23889ca2e60f`: FAILED. Browser suite reported malformed CSV in the source-register importer and downstream missing `rightsReviewStatus`; Python suite reported four reviewer-packet validation failures and a missing `SRC-UGTPHON-EMNLP-2026` lookup caused by the malformed source-register row.
- Pages workflow [42415278451](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42415278451), same head: FAILED in Python regression jobs. Corpus strict validation passed; browser/build/deploy jobs were skipped after the Python failures.
- Multi-engine workflow [42414467825](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42414467825), PR #456 head `53ba9168e1dedeab3a4308736a0997dea6151ffd`: FAILED only at the exported unresolved-review-queue byte comparison (byte 554, line 1). Mandatory comparison and tests ran, but this artifact gate did not pass; optional neural jobs were skipped by policy.
- No local shell, `pytest`, or `npm` command is claimed: repository access in this session is through GitHub connector operations. CI results are the only execution evidence.

### Reconciliation performed in this continuation

- Correct the opening quote on the `SRC-UGTPHON-EMNLP-2026` source-register CSV row; this restores a valid 13-column record for Python and browser parsers.
- Correct the pinned corpus path constant in `scripts/build_kozak_236_ipa_review_packets.py` to the exact path recorded by all 236 source-ledger rows: `naver-ai/UGTPHON/ko/test.json`. Commit/blob/license pins remain unchanged.
- Align README, documentation index and repository-structure snapshot to the actual audited main head, current benchmark status and failed (not passed) current-main checks.
- Preserve PR #455 as closed/unmerged. Its full independent-review packet workflow is not silently merged or enabled; no packet is generated, distributed or sent to any reviewer in this continuation.

### Outstanding acceptance

1. Re-run exact-head Python/browser CI after the CSV and corpus-path corrections; acceptance is all relevant tests green, no skips misreported as passes, and a successful static build.
2. Re-run or independently reproduce the multi-engine export and exact-compare the generated mismatch queue; acceptance is byte-identical output from the canonical generator, not a hand-edited CSV.
3. Confirm Pages deployment and live smoke on the resulting main commit.
4. Keep the 40 speaker-specific IPA cases unresolved until audio/speaker-linked evidence and independent annotations exist; keep Ukrainian target review separate.
5. Do not claim release readiness until the above software gates and the project's independent linguistic/target acceptance gates are met.


### Final verified outcome — PR #457 head `ab6c7c69ba65b7fd5da4383d2105ef81a5bcb51d`

| Work item | Final status | Evidence / acceptance |
|---|---|---|
| Repository documentation index and status reconciliation | DONE_VERIFIED | README, `docs/README.md`, `docs/REPOSITORY-STRUCTURE.md` and this audit now distinguish historical main-head failures from the verified PR state |
| Source-register CSV integrity | DONE_VERIFIED | Opening quote repaired on `SRC-UGTPHON-EMNLP-2026`; Python and browser regression suites passed |
| Pinned UGTPHON corpus path | DONE_VERIFIED | Reviewer-packet validator now expects exact `naver-ai/UGTPHON/ko/test.json`; pinned commit/blob/license values were not changed |
| Canonical mismatch-queue serialization | DONE_VERIFIED | Exporter writes CRLF separators with no trailing separator; regression test added; generated output byte-compares successfully with committed queue |
| Multi-engine benchmark and runtime parity | DONE_VERIFIED | Run [42416681855](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681855) passed all steps, including queue export/compare, Browser Kozak Kim, Native/Browser parity and SIGMORPHON |
| Python/browser/packaging/research-artifact CI | DONE_VERIFIED | Runs [42416681845](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681845), [42416681848](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681848), [42416681843](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681843), [42416681889](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681889) all passed |
| Independent speaker-specific IPA gold for 40 residual cases | BLOCKED / EVIDENCE-LIMITED | No source audio/speaker-linked evidence was supplied; no IPA forms were invented |
| Ukrainian-target validation and independent linguistic acceptance | BLOCKED / EVIDENCE-LIMITED | Korean G2P benchmark results do not measure Ukrainian transcription; qualified target review remains necessary |
| External reviewer distribution | DEFERRED | Holdout packets are generated as CI artifacts only; no reviewer was contacted and no packet was distributed |
| Release certification | DEFERRED | Software CI is green on PR #457, but linguistic and Ukrainian-target acceptance gates remain open |

#### Verified diagnostic results (not normative accuracy)

- UGTPHON Korean test: 275 source rows, 2,703 eligible token occurrences. Native: 1,425/2,702 exact, CER 9.0130%; g2pK 0.9.4: 1,435/2,703 exact, CER 9.2328%.
- SIGMORPHON 2021 Korean lexical test: 1,000 source rows, 999 eligible occurrences. Native: 359/998 exact, CER 14.5347%; g2pK 0.9.4: 353/999 exact, CER 14.8222%.
- These are comparisons against the supplied corpus annotations and are convention-specific. They are not normative IPA adjudication, Ukrainian transcription scores, or proof of target orthographic correctness.
- The multi-engine artifact is retained by Actions run [42416681855](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681855), artifact name `multi-engine-korean-ipa-diagnostic`, artifact ID `13592058477`.

#### Repository and integration state

- PR #456 remains merged at `18f5529b9100ea6e4f7c176c9627bacf1fc52585`.
- PR #455 remains closed and unmerged; it was not revived or blindly ported.
- PR #457 contains the documentation, source-register, pinned-path and canonical-export fixes. The branch is `docs/repository-structure-and-ci-reconciliation-2026-11-07`; its verified code/test head is `ab6c7c69ba65b7fd5da4383d2105ef81a5bcb51d`.
- The repository had 24 branches at this audit point, including `main` and this working branch. Historical branches were preserved; no branch deletion or force-push was performed.
- All execution evidence in this session came from GitHub Actions and GitHub repository APIs. No local `pytest`, `npm`, shell, or clean-install command is claimed as executed in this environment.
- The metadata-only Official NIKL inventory workflow job was skipped by policy; it is not counted as a pass.

#### Final readiness decision

**Software verification: green on PR #457. Repository release readiness: PARTIAL RESEARCH PROTOTYPE.** The documentation and CI defects in scope are fixed and verified. The remaining blockers are linguistic evidence and Ukrainian-target acceptance, not the repository structure or the CSV/CI failures addressed here. Do not label the system release-ready until those independent acceptance criteria are met.


### Mainline merge record — 2026-11-07

- PR #457 was squash-merged into `main` as `62ca357d1ff64bc0a113e30fc92e4ce2f1b5ffcc`, parent `e72856c1f03bfb775805748f96ec23889ca2e60f`.
- Post-merge [system verification 42418241279](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42418241279), [test matrix 42418241284](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42418241284), [research artifacts 42418241294](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42418241294), and [GitHub Pages deployment plus live browser smoke 42418241365](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42418241365) all completed successfully on the merge commit.
- The large existing [master execution plan and chat handoff](MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md) was updated in place with the merge SHA, test evidence, benchmark scope and remaining blockers. It was not replaced by a duplicate handoff.
- A final handoff-only documentation branch `docs/final-main-handoff-2026-11-07` carries this in-place update and the synchronized README/index/structure/audit references. It does not change runtime code, source data, or benchmark outputs.
- Final readiness remains **PARTIAL RESEARCH PROTOTYPE**: repository and software verification are green; independent speaker IPA gold for the 40 residual cases and Ukrainian-target acceptance remain evidence-limited. No release certification is claimed.


### Runtime integration of the 40 source adjudications — 2026-11-08 (PR #461)

#### Task ledger

| Task | Status | Evidence / boundary |
|---|---|---|
| Reconcile the 40 occurrence rows to the 17 source adjudication families | DONE_VERIFIED | Shared JSON registry contains 17 records and exactly 40 occurrence IDs; source adjudication CSV remains canonical evidence record. |
| Expose source adjudication metadata in the Kozak Kim browser engine | DONE_VERIFIED | `createEngine().convert()` attaches exact-boundary matches, evidence IDs, claim IDs, occurrence IDs and runtime action. The separate g2pK `convertSurface()` baseline is deliberately not annotated. |
| Expose the same metadata in the Python native pipeline | DONE_VERIFIED | `phoneticize_korean()` and `transliterate_korean()` return the same registry version/counts and matched source adjudications. |
| Package the shared registry for Python distributions | DONE_VERIFIED | `pyproject.toml` includes `source_adjudications.json` as package data; wheel build passed. |
| Add regression tests | DONE_VERIFIED | New browser test file and Python pipeline regression; Python and browser suites passed. |
| Runtime-match all source forms whose raw spelling is stable | DONE_VERIFIED | 15 distinct forms have exact Korean-script-boundary matching. This is a metadata/policy overlay, not a phonological rewrite. |
| Apply the two raw `ㅠ` non-speech spans automatically | BLOCKED | Source adjudication is accepted, but normalized corpus tokens contain `유`; exact raw-span offsets must be revalidated before slicing. No normalized `유` lookalike is matched. Audio is not required. |
| Promote speaker-specific narrow IPA for the 40 occurrences | DEFERRED | Optional acoustic annotation is outside the accepted source-policy scope; 0/40 is not a blocker. |
| Independently certify Ukrainian target choices | TODO | Separate target-layer review/acceptance remains outside this integration. |

#### Implementation and evidence

- Starting `main`: `1e97152e505c75fe294d56befd978789b719d59e`.
- Work branch: `research/integrate-40-source-adjudications-2026-11-08`.
- PR: [#461 — Integrate 40 source adjudications into runtime policy](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/461).
- Exact code/test head verified by CI: `87e7bb32611e7042c7f0ecf5df1d1fd5ac49aa5b`. Subsequent commits on the PR branch are documentation-only.
- New shared registry: `src/korean_ukrainian/source_adjudications.json` (17 adjudication families, 40 occurrence IDs).
- Runtime adapters: `src/app/engine_adjudications.js` and `src/korean_ukrainian/source_adjudications.py`.
- The registry is metadata-only by design: it does not alter Hangul, IPA, or Ukrainian output. It records the accepted broad/source policy and its evidence. Existing Rule 29 phrase behavior remains conditional on explicit spacing and phrase mode. No hidden boundaries, speaker-specific narrow segments, or unsupported lexical normalizations are inferred.
- The two normalized `ㅠ` corpus records are included in the registry but have empty runtime match forms; normalized `유` is not treated as an emoticon. This prevents false positives until raw-span offsets are checked.

#### Exact-head checks

On code/test head `87e7bb3`:

- [Test matrix 42463790417](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42463790417): `python -m pytest -q` passed on Python 3.11, 3.12 and 3.13; `npm test` and `npm run build` passed; wheel build passed; teacher-corpus audit passed.
- [System verification 42463790481](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42463790481): Python regression/data integrity, browser regression, source redistribution rights gate, public-page build and generated-page verification passed. Metadata-only NIKL inventory was skipped by policy.
- [Browser G2P integration 42463790446](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42463790446): browser tests and production build passed.
- [Master/research artifacts 42463790433](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42463790433): master table generation and strict corpus generation passed.
- [Pinned UGTPHON split 42463790439](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42463790439) and [paired Native/g2pK diagnostic 42463790451](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42463790451) passed.
- [Optional g2pK integration 42463790480](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42463790480), [research morphology adapter smoke 42463790646](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42463790646), and [exhaustive test-case extraction 42463790393](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42463790393) passed.
- Korean morphology-consensus IPA diagnostic [42463790392](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42463790392) completed successfully. The multi-engine diagnostic [42463790426](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42463790426) was cancelled; optional Charsiu inference and metadata-only NIKL inventory were skipped. These are not counted as passes and are not required for this source-metadata integration.
- No local shell/npm/pytest command is claimed; repository write and CI operations were performed through GitHub APIs.

#### Final readiness

The 40 source-based adjudications are accepted without audio and are now represented in both Kozak Kim runtime result surfaces. The two non-speech rows remain registered but are not automatically sliced until raw boundaries are revalidated. This completes the requested source-policy integration without changing phonological output or manufacturing narrow IPA.

Repository status remains **PARTIAL RESEARCH PROTOTYPE**, not release-ready or independently research-certified. The outstanding blockers are raw `ㅠ` span-boundary validation, independent Ukrainian target review, broader research acceptance and any future optional speaker-specific acoustic annotation. PR #461 was squash-merged into `main` as `b014d0107a47c3117c7dcbdd8d403f7fca3c7d41`; no external release or deployment action was taken.


The existing master execution handoff was not rewritten: the GitHub file-read operation returned an empty content body for its existing blob, so a safe in-place append could not be made through this interface. This dated audit addendum is the superseding continuation for this task; the historical handoff blob was preserved unchanged.


#### Mainline merge confirmation — 2026-11-08

- PR [#461](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/461) was squash-merged; merge commit: `b014d0107a47c3117c7dcbdd8d403f7fca3c7d41`.
- The merged `main` branch was re-read after merge. The shared registry, Python adapter, browser adapter, engine wiring, tests and audit record are present on `main`; the registry contains 17 adjudication rows and all 40 unique occurrence IDs.
- Exact code/test head `87e7bb32611e7042c7f0ecf5df1d1fd5ac49aa5b` passed the listed PR-head Python, browser, build, source-rights, corpus, and research smoke checks. The commits between that code/test head and the final PR head `111fc7042a99b047fb809eed85b36e86d2b03d43` were documentation-only. The squash merge contains the same code and test state.
- The GitHub workflow-run lookup for the merge commit returned no push-triggered run records (the available commit workflow lookup is PR-triggered only); therefore no post-merge CI result is claimed. The exact-head PR checks above are the verification evidence.


---

## Current-main continuation — 2026-11-08 (documentation and benchmark reconciliation)

**Starting main for this continuation:** e24cf7caff745fb612080aef6a33c8058f4144cc.  
**Latest runtime integration already on this starting commit:** PR [#461](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/461), squash merge b014d0107a47c3117c7dcbdd8d403f7fca3c7d41.  
**Integration policy:** the owner designated main; this continuation writes documentation directly to main. No new task branch is created.

### Current benchmark state — distinguish G2P from target rendering

The latest measured Korean G2P comparison remains the paired PR #456 diagnostic and the full pinned multi-engine PR #457 diagnostic. PR #461 is metadata-only: its shared 40-case adjudication registry attaches provenance/policy metadata and explicitly does not change Hangul, IPA, or Ukrainian output. Therefore the PR #456/#457 pronunciation measurements remain the latest applicable measurements for the current output behavior; the cancelled multi-engine run on PR #461 is not a result and does not supersede them.

| Dataset / engine | Scored | Exact match | CER | Coverage |
|---|---:|---:|---:|---:|
| UGTPHON — ClippyFirst Native | 2,702 | 52.7387% (1,425) | 9.0130% | 99.9630% |
| UGTPHON — g2pK 0.9.4 | 2,703 | 53.0892% (1,435) | 9.2328% | 100% |
| SIGMORPHON 2021 — ClippyFirst Native | 998 | 35.9719% (359) | 14.5347% | 99.90% of 999 eligible |
| SIGMORPHON 2021 — g2pK 0.9.4 | 999 | 35.3353% (353) | 14.8222% | 100% |

- Paired UGTPHON evidence: [run 42414467883](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42414467883). On 2,702 shared occurrences, g2pK's exact-match rate is +0.3701 percentage points relative to Native, while its CER is 0.2207 points higher (worse). Native abstains on one occurrence; g2pK abstains on none.
- Paired SIGMORPHON evidence: [run 42416681855](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681855). On 998 shared words, Native is 359/998 (35.9719%) versus g2pK 353/998 (35.3707%); paired CER is 14.5347% versus 14.8106%. Native leads exact match by 0.6012 percentage points and CER by 0.2759 points.
- The full multi-engine run [42416681855](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42416681855) passed its mandatory deterministic/phonemizer comparison, queue/artifact comparison, Browser same-occurrence execution and Native/Browser parity. Optional CharsiuG2P and ByT5 inference were skipped by policy; they are not passes and have no score.
- These are dataset/reference-convention diagnostics for Korean G2P. They do not measure Ukrainian target quality and are not normative pronunciation gold.

### Full pinned multi-engine comparison — latest successful run 42416681855

Strict IPA scoring on the pinned UGTPHON Korean test split (275 source rows; 2,703 eligible occurrences), same normalization and reference convention:

| Engine | Exact | CER | Coverage |
|---|---:|---:|---:|
| ClippyFirst Native | 1,425/2,702 (52.7387%) | 9.0130% | 99.9630% |
| g2pK 0.9.4 | 1,435/2,703 (53.0892%) | 9.2328% | 100% |
| g2p-ko 1.0.0 | 1,418/2,703 (52.4602%) | 9.3928% | 100% |
| KoG2Padvanced 2022 | 1,279/2,703 (47.3178%) | 10.6815% | 100% |
| phonemize 2.0.1 | 1,150/2,703 (42.5453%) | 14.3531% | 100% |
| KoG2P 2019 | 738/2,703 (27.3030%) | 19.5122% | 100% |
| kokorog2p 0.9.15 | 495/2,703 (18.3130%) | 26.5352% | 100% |
| HAMA 1.7.0 | 457/2,703 (16.9071%) | 25.1081% | 100% |
| hangul_to_ipa 2026 | 439/2,703 (16.2412%) | 24.8054% | 100% |
| eSpeak NG Korean | 220/2,703 (8.1391%) | 33.6101% | 100% |

Strict IPA scoring on the pinned SIGMORPHON 2021 Korean test split (1,000 source rows; 999 eligible occurrences):

| Engine | Exact | CER | Coverage |
|---|---:|---:|---:|
| ClippyFirst Native | 359/998 (35.9719%) | 14.5347% | 99.90% |
| g2pK 0.9.4 | 353/999 (35.3353%) | 14.8222% | 100% |
| g2p-ko 1.0.0 | 356/999 (35.6356%) | 14.6970% | 100% |
| KoG2Padvanced 2022 | 326/999 (32.6326%) | 15.8237% | 100% |
| phonemize 2.0.1 | 289/999 (28.9289%) | 17.4387% | 100% |
| KoG2P 2019 | 187/999 (18.7187%) | 21.8327% | 100% |
| HAMA 1.7.0 | 127/999 (12.7127%) | 27.6164% | 100% |
| kokorog2p 0.9.15 | 96/999 (9.6096%) | 30.7336% | 100% |
| hangul_to_ipa 2026 | 89/999 (8.9089%) | 29.8448% | 100% |
| eSpeak NG Korean | 43/999 (4.3043%) | 40.7236% | 100% |

Run 42416681855 is the latest successful full multi-engine artifact. Optional CharsiuG2P and ByT5 neural inference were skipped by policy and have no score. The report's separate broad-candidate sensitivity profile is research-only and must not replace strict scoring.

### Did ClippyFirst Native deteriorate?

**No general deterioration is established.** A superficial comparison with the 2026-10-24 UGTPHON snapshot shows Native exact match lower by about 0.4440 percentage points (53.1827% → 52.7387%), but CER improves by about 0.1753 points (9.1883% → 9.0130%). On SIGMORPHON, the current Native exact match is higher by about 0.1645 points (35.8074% → 35.9719%) and CER improves by about 0.1690 points (14.7037% → 14.5347%). The eligible/scored counts and profile/reference conventions are not identical across all historical snapshots, so these deltas are descriptive, not a controlled regression experiment. The defensible conclusion is metric- and corpus-dependent movement, not a demonstrated global regression. To prove a code-induced regression, rerun the same pinned corpora, exact normalizer/profile, same occurrence IDs, and old/new engine revisions in one paired workflow.

### Two IPA stages — do not conflate their names

The benchmark phrase “g2pK + project IPA renderer” refers to the Korean surface-to-IPA realization module, not the Ukrainian target renderer:

- Korean surface Hangul → broad IPA: src/korean_ukrainian/ipa.py, function realize_syllables(). The g2pK adapter obtains g2pK's Hangul pronunciation spelling and calls this module; Native uses the same IPA realization layer after its own Korean analysis. The comparison therefore shares an IPA representation layer and is not a comparison of independent IPA encoders.
- IPA → Ukrainian practical orthography: src/korean_ukrainian/ipa_target_renderer.py and browser src/app/engine_ipa.js. This downstream adapter is not part of the Korean IPA exact-match/CER benchmark.

The multi-engine workflow also routes g2p-ko and KoG2Padvanced Hangul surface outputs through the shared project broad-IPA adapter. kokorog2p is g2pK-derived, not a fully independent phonological lineage. KoG2P uses a custom phone alphabet with a lossy explicit adapter. Consequently, the ten-engine table compares pronunciation-surface systems under documented adapter constraints; it must not be described as ten independent IPA encoders. The benchmark script records these limitations explicitly.

### IPA renderer — separate component and separate acceptance question

The ClippyFirst IPA target renderer is the downstream adapter, not a Korean G2P engine:

**Korean source → Korean phonological analysis → IPA → ClippyFirst IPA-to-Ukrainian renderer → Ukrainian practical orthography.**

- Python implementation: src/korean_ukrainian/ipa_target_renderer.py; browser implementation: src/app/engine_ipa.js. The renderer accepts IPA as its input contract and returns mapping traces/status; it must not independently infer Korean pronunciation from Hangul.
- Existing regression coverage reproduces 644 canonical lexical pronunciation rows and 46 alternate IPA rows through the IPA renderer; the override register contains 28 explicit, traceable mappings. These are implementation/reproducibility checks, not independent target-accuracy scores.
- The recovered 24-form target-renderer holdout is present at data/korean/benchmarks/target-renderer-holdout-24.csv, but all 24 rows still have ipa_gold_status=not_available and ukrainian_gold_status=not_available. It is therefore not a scored gold benchmark.
- The renderer fails closed for unknown or ambiguous IPA and keeps provisional mappings explicitly gated. Length is retained in IPA/provenance but is not automatically represented by an extra Ukrainian grapheme.
- **Acceptance status:** renderer implementation and Python/browser parity are software-tested; independent Ukrainian phonetic/orthographic target accuracy remains unverified. Do not infer renderer quality from UGTPHON or SIGMORPHON G2P scores.

### 236-case status after PR #461

| Disposition | Rows | Current interpretation |
|---|---:|---|
| Exact standard-form runtime dispositions | 15 | Ten exact integrations plus five pre-existing exact licenses |
| Profile-convention decisions | 181 | Bounded transcription-profile decisions, not 181 new categorical rules |
| Original abstentions | 12 | Engine policy now explicit; speaker-specific IPA remains unresolved |
| Previously unadjudicated residuals | 28 | Engine policy now explicit; speaker-specific IPA remains unresolved |
| **Total** | **236** | Reconstructed occurrence cohort; original historical selector membership is not proven |

PR #461 integrates 17 adjudication families covering all 40 residual occurrence IDs into shared browser/Python runtime metadata. This is a source-policy/provenance overlay, not a phonological rewrite or speaker-specific IPA annotation. Two raw ㅠ non-speech rows remain registered but intentionally unmatched until raw-span offsets are revalidated. The 40 source-policy dispositions are accepted without audio; speaker-specific narrow IPA is optional/out of scope, not a blocker for that accepted policy.

### Exact current-main verification and repository state

Starting main e24cf7c has four latest push-triggered workflows completed successfully:

- [Tests matrix 42464216274](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42464216274) — success.
- [System verification 42464216259](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42464216259) — success.
- [Master/research artifacts 42464216261](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42464216261) — success.
- [GitHub Pages deployment 42464216267](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42464216267) — success.

PR #461's exact code/test head 87e7bb32611e7042c7f0ecf5df1d1fd5ac49aa5b separately passed Python 3.11/3.12/3.13, browser tests/build, wheel packaging, source-rights, corpus and research checks. Its full multi-engine diagnostic was cancelled; no new multi-engine score is claimed for PR #461. The current-main push workflows above passed after merge. No local shell, pytest or npm commands were run in this connector-only session.

GitHub reports no open PRs. PR #461 is merged. The branch inventory still contains historical/supporting branches; they are preserved as audit history, not active integration targets. No branches were deleted or force-updated. Main is the only integration branch for this continuation.

### Task ledger and remaining acceptance

| Task | Status | Evidence / acceptance boundary |
|---|---|---|
| Consolidated documentation map and ownership guide | DONE_VERIFIED | Existing docs index, structure guide and agent workflow guide are retained and refreshed below; no duplicate master plan created |
| Four upstream workflow references | DONE_VERIFIED | Existing pinned audit covers Unlazy, Superpowers, Matt Pocock skills and Ponytail with adoption boundaries; no upstream code/skills vendored |
| Current Native/g2pK and multi-engine results | DONE_VERIFIED as diagnostic evidence | Latest successful paired and multi-engine artifacts linked above; optional neural jobs explicitly skipped |
| IPA renderer implementation/reproducibility | DONE_VERIFIED as software behavior | 644 canonical + 46 alternate lexical mappings, 28 override rows and browser/Python parity tests |
| Independent Ukrainian target accuracy | BLOCKED / evidence-limited | 24-form target holdout has no IPA or Ukrainian gold; acceptance requires frozen IPA inputs and independent qualified Ukrainian phonetic/orthographic review |
| Original 236/239 historical cohort identity | BLOCKED | Original selector/member list or equivalent provenance is missing; reconstructed cohort must not be described as historically proven |
| Raw ㅠ non-speech span matching | BLOCKED | Revalidate original raw offsets before automated slicing; do not match normalized 유 |
| Broader independent Korean IPA certification | DEFERRED / evidence-limited | Source-policy closure is accepted without audio; speaker-specific narrow IPA is optional and requires appropriate source context/reviewer scope if pursued |
| Release certification | DEFERRED | Research/target validation and release gates remain incomplete; no release is authorized by this documentation pass |

**Readiness:** software-verified bounded research prototype. Not independently research-certified and not release-ready as an authoritative Korean-to-Ukrainian transcription standard.


## 2026-11-08 continuation — three Kozak Kim modes and separate benchmark status

The current documentation previously described Strict, Soft and Super-soft as three policies, but did not give each mode an equally explicit benchmark status. This continuation corrects that gap without changing runtime behavior.

| Mode | Benchmark status at this audit | Evidence and limitation |
|---|---|---|
| Strict | DONE_VERIFIED as a diagnostic | Current ten-engine UGTPHON/SIGMORPHON benchmark results in README and the current-main acceptance section evaluate the strict Native path. They remain corpus-convention diagnostics, not independent IPA gold. |
| Soft | PARTIAL | `scripts/benchmark_morphology_ipa_delta.py` implements paired Strict/Soft UGTPHON scoring and the morphology-consensus workflow archives the report. No current-main exact-head Soft score was established in this documentation pass; no Strict score is copied into this row. |
| Super-soft | TODO for accuracy evaluation | Browser implementation, fallback labeling and modern Hangul coverage tests exist. The 11,172-syllable coverage contract is not an IPA accuracy benchmark; no accepted independent gold score is available. |

**236-case consequence:** the reconstructed cohort must now be benchmarked in all three modes on identical occurrence IDs, but it is not a gold set. Preserve the 15 exact standard-form, 181 profile-convention, and 40 source-policy strata. The 181 convention cases require evidence-based broad-profile references or an explicit unscorable/convention-sensitive status; the 40 source-policy decisions do not establish speaker-specific IPA gold. Strict, Soft and Super-soft must each report coverage, unresolved/partial/heuristic/fallback counts, Exact, CER, paired per-occurrence changes and a separately labelled broad-profile sensitivity view. Super-soft typed fallback coverage must not be counted as source-resolved IPA accuracy.

**Canonical records updated:** `docs/methodology.md` now defines the three-mode benchmark contract; `README.md` summarizes each mode and its actual evidence status; `research/ACCEPTANCE-GATES.md` records Strict = DONE_VERIFIED diagnostic, Soft = PARTIAL, Super-soft = TODO, and the common 236-case evaluation = TODO. A methodology-contract regression protects these distinctions.

**No benchmark score is newly claimed by this documentation update.** No runtime code or IPA output was changed. The next executable benchmark work is to produce an exact-head Soft report, implement the Super-soft stratified scorer, and run all three modes on the pinned 236 occurrence ledger plus compatible pinned external splits. A broad-profile score is a sensitivity analysis, not permission to erase phonological contrasts or manufacture gold.


### Documentation-contract verification on `1ac56bfc705826cff0d9040397dff71db1188ab2`

- Browser regression tests and build: **PASS** — run [42486756706](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42486756706).
- Python regression/data integrity: **PASS** — run [42486756706](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42486756706).
- Python 3.11/3.12/3.13, wheel installation, web tests, teacher-corpus audit: **PASS** — run [42486756688](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42486756688).
- Corpus generation: **PASS** — run [42486756926](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42486756926).
- Official NIKL metadata-only inventory: **SKIPPED**, not a pass.
- These runs verify the documentation-contract regression and repository software gates. They do not generate or validate the missing current Soft/Super-soft accuracy benchmarks.


## 2026-11-08 continuation — five-dataset benchmark portfolio and exact-main reruns

### Portfolio expansion

The benchmark suite register retains five selected datasets: UGTPHON, SIGMORPHON 2021, Seoul Corpus, KsponSpeech and NIKL 2022. Three datasets are now scored; Seoul adds two separate surface-Hangul and phonemic-IPA tracks. KsponSpeech and NIKL 2022 remain access/terms-gated.

- UGTPHON and SIGMORPHON are the two runnable IPA datasets already wired into the multi-engine workflow.
- Seoul Corpus is selected as a non-commercial, phonetically labelled TextGrid suite (CC BY-NC 2.0); tier schema, phone inventory and audited phone-to-IPA mapping remain ingestion gates. Audio is not mandatory if the labels themselves suffice.
- KsponSpeech has orthographic/pronunciation dual transcription according to the corpus paper, but requires AIHub manual download and original access-term review; score Hangul surface pronunciation separately from IPA.
- NIKL 2022 has 630+ hours, 2,000+ speakers and dual spelling/pronunciation transcription according to the official construction report; the corpus requires portal access and corpus-specific terms review. A published 54,536-utterance coda-cluster subset is a focused benchmark candidate.
- LDC2003L02 remains an alternate sixth candidate: 25,251 lexical entries under paid LDC access; not counted among the five selected datasets.
- The 130-row Mun, Kim & Ko gold corpus remains an unlicensed research candidate and is not one of the five selected datasets. Commercial CJKI/Nexdata products remain excluded pending licensing.

### Current-main benchmark automation

- Added a path-filtered `push` trigger to `.github/workflows/multi-engine-ipa-benchmark.yml`, so a relevant main-branch benchmark/code change runs the pinned 10-engine suite and all three browser modes without enabling neural inference by default. Initial exact-main run [42487094098](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487094098) was cancelled when the browser-mode benchmark was expanded. The replacement exact-main run [42487350896](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487350896), code head `b548436d0fce9af4672fc5902d6670cbc134bd70`, runs the 10-engine comparison, browser Strict/Soft/Super-soft on the same UGTPHON occurrence set, Native/Browser strict parity, and the SIGMORPHON lexical comparison. At the last inspection the multi-engine comparison step was still in progress; do not publish its scores until the artifact is available.
- Added a path-filtered `push` trigger to `.github/workflows/morphology-consensus-diagnostic.yml` so relevant main changes produce a separate Strict/Soft paired UGTPHON report. Analyzer-consensus output remains diagnostic and must not be relabelled as a third production mode score.
- The new triggers do not enable CharsiuG2P or ByT5; both remain default-off/skipped unless a separate explicit research opt-in is used.

### Status

**DONE_VERIFIED:** five datasets researched and registered with distinct annotation/representation and licence/access gates; main-branch automation added for exact-head multi-engine and Strict/Soft diagnostics.

**PARTIAL:** two datasets are wired and can be scored; exact-main full multi-engine and Strict/Soft reports are pending artifact inspection.

**TODO/BLOCKED:** Seoul TextGrid parser and symbol adapter; KsponSpeech AIHub acquisition and terms; LDC2003L02 licensed acquisition; Super-soft stratified accuracy scorer; unified three-mode evaluation on all compatible datasets. Do not claim five completed runs.

**No raw restricted datasets were committed.** The three new datasets are source-registered only; no unlicensed or access-controlled data was downloaded or redistributed.


### Strict/Soft UGTPHON result inspected — run `42487169477`

Exact-main morphology diagnostic succeeded and artifact `13620331011` was downloaded and parsed.

| Mode | Attempted | Scored | Coverage | Exact | CER |
|---|---:|---:|---:|---:|---:|
| Strict | 2,703 | 2,702 | 99.9630% | 1,425/2,702 = 52.7387% | 9.0130% |
| Soft | 2,703 | 2,703 | 100.0000% | 1,425/2,703 = 52.7192% | 9.0123% |

On the common 2,702-occurrence subset, Strict and Soft are identical: 1,425 exact matches (52.7387%) and CER 9.0130% for both; exact and CER paired deltas are zero. Soft resolves one additional occurrence and changes three unique-word outputs/statuses, but it does not improve paired accuracy. Runtime errors: zero. This is a UGTPHON-only diagnostic, not evidence for SIGMORPHON, the 236-case cohort, or Super-soft. The analyzer-consensus variant is separately labelled diagnostic-only and is not the Soft mode.

**Disposition:** Soft = MEASURED_DIAGNOSTIC on UGTPHON / PARTIAL overall. Remaining: SIGMORPHON and 236-case compatible-row scoring; exact IPA-profile alignment must be reported for each mode.


## 2026-11-08 final continuation — Seoul benchmark accounting correction

The first successful Seoul artifact (run 42492152654 / artifact 13621892753) exposed a reporting-accounting issue: 29 Super-soft typed orthographic-fallback rows were included in both the heuristic and typed-fallback counters. Code inspection confirmed that those rows were already excluded from source-resolved Exact/CER because the runtime marked them heuristic; accuracy metrics were therefore unchanged. The counters were not mutually exclusive, however, which made the status breakdown misleading.

**Correction implemented:** both scripts/benchmark_kozak_kim_seoul_browser.mjs and scripts/benchmark_kozak_kim_seoul_ipa.mjs now classify typed fallback as a separate outcome before the heuristic branch. It is excluded from Exact/CER and paired resolved-output comparisons. tests/kozak-kim-seoul-benchmark.test.mjs verifies this independently for Hangul surface and phonemic IPA.

- Corrected exact-code benchmark run [42496539257](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496539257), artifact 13623457737: PASS for inventory, surface benchmark and phonemic IPA benchmark.
- Corrected Super-soft status counts: **38,207 heuristic + 29 typed fallback**; previously reported combined/overlapping heuristic count 38,236 is superseded. Scored occurrence counts, coverage, Exact and CER remain unchanged because fallback was already excluded from scoring.
- Full tests [42495903258](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42495903258): PASS across Python 3.11/3.12/3.13, wheel install, web tests/build, teacher corpus audit. System Verify [42495903331](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42495903331): PASS for browser regression/build and Python regression/data integrity; optional official NIKL metadata inventory was skipped.
- Fallback code commit: 536cd44460bbd225fcd76f592bfe6e3077a245a4; regression-test commit: e1e393b3518b6c69685ad00a179ab8996d18ef71.
- GitHub Pages deployment for e1e393b3518b6c69685ad00a179ab8996d18ef71: **PASS**, run [42495903310](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42495903310).

This does not change the research interpretation: Strict has the best coverage-adjusted Exact and lowest CER in both Seoul reference layers; Soft and Super-soft do not beat Strict on the paired common-scored subset. Seoul remains a non-commercial diagnostic corpus, not independently adjudicated narrow IPA gold or Ukrainian-target validation.


## 2026-11-08 — candidate-output availability separated from scored coverage

The Seoul scorer now reports candidate output availability separately from source-resolved scoring coverage. This avoids presenting heuristic/fallback output as accuracy and also avoids treating an unresolved Hangul passthrough as a pronunciation candidate.
- Hangul surface candidate output availability: Strict 224,764/231,626 (97.0375%); Soft 227,573/231,626 (98.2502%); Super-soft 231,626/231,626 (100%).
- Phonemic IPA candidate output availability: Strict 224,763/231,625 (97.0375%); Soft 227,572/231,625 (98.2502%); Super-soft 231,625/231,625 (100%).
- Source-resolved coverage is unchanged: surface 97.0375% / 87.0006% / 83.4924%; IPA 97.0375% / 87.0005% / 83.4923% for Strict / Soft / Super-soft. The candidate-availability metric is not an accuracy score.
- Corrected output-availability artifact: run [42496539257](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496539257), artifact `13623457737`.
- Unit tests for typed fallback and unresolved passthrough exclusion are included in test run [42496551366](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496551366) (**PASS**). System Verify [42496551350](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496551350) (**PASS**; NIKL metadata-only inventory skipped).


## 2026-11-08 continuation — all-mode benchmark completeness

### Task ledger

| Task | Status | Evidence / acceptance criterion |
|---|---|---|
| Preserve the 10-engine UGTPHON and SIGMORPHON Strict-compatible comparisons | DONE_VERIFIED (historical exact-head evidence) | Existing reports and pinned external engines are preserved; they are not Soft/Super-soft-capable engines. |
| Add explicit candidate-output availability to the Kozak Kim Browser benchmark | PARTIAL | Script and regression changes committed; exact-main CI must verify the new fields and tests. |
| Run UGTPHON Browser Strict/Soft/Super-soft with monotonic/100% availability gates | PARTIAL | Workflow validation added; exact-main CI pending. |
| Run SIGMORPHON Browser Strict/Soft/Super-soft on the same 1,000 eligible occurrences | PARTIAL | Three invocations and artifact upload added; exact-main CI pending. |
| Enforce monotonic and 100% Super-soft candidate availability on Seoul Hangul surface | PARTIAL | Runtime benchmark gate added; exact-main CI pending. |
| Enforce monotonic and 100% Super-soft candidate availability on Seoul phonemic IPA | PARTIAL | Runtime benchmark gate added; exact-main CI pending. |
| Score the reconstructed 236-case cohort as accuracy gold | DEFERRED / NOT ACCEPTED | It is not an independently adjudicated reference set; do not manufacture Exact/CER. |
| Apply Kozak Kim mode labels to the ten external engines | DEFERRED / NOT APPLICABLE | Those independent engines do not implement Kozak Kim's mode policies. |

### Metric contract

The former ambiguous coverage label is now accompanied by explicit fields:
- candidate_output_availability_rate counts an actual non-empty candidate, including typed heuristic/fallback, but excludes unresolved passthrough and errors.
- source_resolved_coverage_rate counts only source-resolved outputs eligible for IPA Exact/CER.
- Super-soft must be monotonic and exactly 100% candidate-available on every compatible benchmark; this is not a 100% accuracy claim.

### Implementation commits on main

- da564643fc495bc554d77a88b7a0ff486618ae51 — generic dataset label/source support and candidate availability fields in the Browser benchmark.
- 11f020097ec37988ca7c6355518c0e311dd093e3 — initial mode-availability regression.
- bc5f57153cfe3a0d23781425ce1a46cf6e02a482 — three SIGMORPHON mode invocations and artifact collection.
- 40b84c08a96eb8538835e2349247d1eefbd8701c — Seoul surface monotonic/100% availability gate.
- e560866c95481c707c43f57f7cd382ac03c05b88 — Seoul phonemic-IPA monotonic/100% availability gate.
- 97d7a7b97f951d8f8052da4e39028f3748a4afcb — UGTPHON workflow validation.
- c757cd02fee87e7313e52352602ec4ef879a7def — explicit Browser metric aliases.
- 7032d3a4abf0e7c97caec1d7ae91de08c0a18c6a — regression for explicit metric aliases.

### Verification and blockers

All changes above were pushed directly to main. Current code head at the start of this addendum: 7032d3a4abf0e7c97caec1d7ae91de08c0a18c6a. The GitHub connector exposed neither Actions check-run listing nor workflow dispatch in this session, and no local repository checkout is available; therefore exact-head CI is **PENDING_VERIFICATION**, not PASS. Acceptance requires the multi-engine workflow, Python/browser test matrix, system verification and generated-artifact checks to pass on the final documentation head. If Super-soft candidate availability is below 100% on any compatible corpus, inspect the unresolved occurrence ledger and implement a typed candidate or preserve a specific, documented unsupported-input blocker; never count raw input passthrough as success.

### Readiness

The repository remains a software-verified research prototype, not release-ready. Adding complete mode execution and availability gates improves benchmark coverage but does not provide independent Korean phonetics certification or Ukrainian-target acceptance.


## 2026-11-08 continuation — exact-main CI and branch reconciliation

**Main at this checkpoint:** `5814de6a77745feca7cc7683e6594d67289c2b23`. The stale statement that PR #461 remained open has been corrected in `docs/REPOSITORY-STRUCTURE.md`. GitHub's current open-PR query returned **0 open PRs**; PR #461 is already merged.

### Exact-head verification evidence

On `1912ea24e78ca03fe8483292efb31960d11c1c1e` (the parent of the documentation-only correction above), the following push workflows completed successfully:

- [tests 42506324942](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42506324942): PASS — npm tests/build, Python 3.11/3.12/3.13, wheel installation, teacher-corpus audit.
- [System Verify 42506324960](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42506324960): PASS — Python regression/data integrity, browser regression/build, source redistribution rights gate. Official NIKL metadata-only inventory: SKIPPED.
- [Master/research artifact generation 42506325185](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42506325185): PASS — master table and strict research corpus artifacts generated.
- [GitHub Pages 42506324909](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42506324909): PASS — Python checks, browser tests/build, deployment and live browser smoke test.

The documentation-only correction at `5814de6a77745feca7cc7683e6594d67289c2b23` has its own tests, verify, master-artifact and Pages workflows queued as runs 42506815536, 42506815808, 42506815555 and 42506815519 respectively; these are **PENDING** at this checkpoint.

The new multi-engine benchmark run [42506225213](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42506225213) is **IN_PROGRESS** on code head `c757cd02fee87e7313e52352602ec4ef879a7def`. Dataset downloads, pinned external engine/license validation, benchmark adapter tests, training-readiness audit and independent holdout packet generation have passed. The main benchmark step is still running; Browser UGTPHON/SIGMORPHON three-mode stages and artifacts have not yet completed. No new SIGMORPHON score or final three-mode pass is claimed. Optional ByT5 and Charsiu inference jobs were SKIPPED by policy.

### Branch and PR reconciliation

The repository has 27 non-main branches and no open PRs. All 27 branch heads were compared against main using commit-range/file-stat comparisons. High-risk research and fix branches were additionally tree-compared against current main: `research/source-only-40-case-adjudication`, `research/integrate-40-source-adjudications`, both 40-case evidence branches, `research/no-audio-40-case-adjudication`, `audit/kozak-236-source-rights`, `fix/five-ugtphon-native-abstentions-final-release`, `fix/source-rights-redistribution-scope` and `docs/agent-workflow-structure`. These inspected branch trees contained no branch-only files; main contains the current/superseding versions. Several branches have long ahead/behind histories because earlier PRs were squash-merged; commit counts alone are not evidence of unmerged content. No branch was deleted, force-updated or blindly merged. Keep historical branches untouched unless a later exact-file audit finds unique, still-valid work.

### Source-adjudication integration status

The 40 source-based decisions are already integrated into main as a provenance/policy annotation layer: 40 occurrence rows, 17 adjudication families, Python and browser adapters, and regression tests. This metadata layer deliberately does not rewrite Korean IPA or Ukrainian output. Speaker-specific narrow IPA remains unresolved/non-blocking and is not claimed as gold.

### Current task ledger

| Task | Status | Evidence / remaining acceptance |
|---|---|---|
| 40 source-based policy adjudications and metadata integration | DONE_VERIFIED | Main registry declares 40 occurrences / 17 families; browser regression and full Python/browser CI pass. |
| Main Python, npm, browser build, wheel and rights gates | DONE_VERIFIED on 1912ea2 | Runs 42506324942 and 42506324960 passed. |
| Master/research artifact generation | DONE_VERIFIED on 1912ea2 | Run 42506325185 passed. |
| Pages deployment and live browser smoke | DONE_VERIFIED on 1912ea2 | Run 42506324909 passed. |
| Three-mode UGTPHON and SIGMORPHON benchmark gates | PARTIAL | Run 42506225213 still in progress; inspect all reports/artifacts and enforce equal denominators, zero errors, monotonic availability and Super-soft 100%. |
| Full verification on latest docs-only head 5814de6 | PARTIAL | Runs 42506815536 / 42506815808 / 42506815555 / 42506815519 queued. |
| Optional ByT5 / Charsiu inference | DEFERRED | Explicitly skipped by policy; not a pass. |
| Official NIKL metadata-only inventory | DEFERRED | Skipped by policy; not a pass. |
| Speaker-specific IPA gold and Ukrainian-target certification | BLOCKED / OUT OF SCOPE | No speaker-linked audio/gold and no independent Ukrainian target acceptance; broad source-policy decisions do not imply these. |

**Readiness:** software-verified research prototype. Not release-ready or independently research-certified until the new multi-engine run and latest-head workflows complete, and independent Korean/Ukrainian linguistic acceptance is obtained.


## 2026-11-08 — Multi-engine benchmark failure diagnosis and correction

- The first completed multi-engine run (Actions run 42506225213) failed at the Native/Browser runtime parity audit, not during engine inference. The browser runner emitted its default benchmark identity, while the audit requires the explicit `UGTPHON Korean canonical-token diagnostic` identity. This caused the guard to reject the report before the parity comparison and before the later SIGMORPHON stage.
- The UGTPHON browser Strict/Soft/Super-soft runs themselves completed with zero engine errors and 2,703 eligible occurrences each. Strict: 2,702/2,703 source-resolved scored (99.963%), 2,702/2,703 candidate availability, 52.739% exact among scored, CER 9.013%. Soft: 2,423/2,703 source-resolved scored (89.641%), 2,703/2,703 candidate availability, 54.767% exact among scored, CER 7.879%. Super-soft: 2,239/2,703 source-resolved scored (82.834%), 2,703/2,703 candidate availability, 56.186% exact among scored, CER 7.819%.
- Interpretation: Super-soft achieved complete candidate availability, not complete source-resolved coverage or accuracy. The lower source-resolved denominator reflects heuristic outputs that are deliberately excluded from source-resolved scoring. These metrics must remain separate.
- Corrective commit `b7b4afca93a8d218c0f99eb5a11a52e6a5a05712` adds the explicit benchmark name and pinned dataset-source label to all three Browser UGTPHON invocations. This is a harness identity fix; it does not change engine behavior or scoring rules.
- Acceptance remains pending until the new main-branch Actions run completes the parity audit, SIGMORPHON Strict/Soft/Super-soft comparisons, and artifact review. Do not mark the multi-engine benchmark DONE_VERIFIED based on run 42506225213. Its failure is recorded as a harness failure with the specific cause above; the corrected rerun is pending.
- GitHub Pages run 42506852765 completed successfully, including browser build and deployment. Latest ordinary Tests, System Verify, and research artifact generation runs at commit 2d55eeec5fb2e6f72ada8b316bd5c4df1caab2b8 passed; these do not substitute for the pending multi-engine gate.



## 2026-11-10 — final matrix evidence and artifact-policy audit

The current PR #465 branch was rechecked against main. The full scoring matrix is complete on run 42785083152: six 10-engine reference tracks across five datasets and fifteen Browser mode reports across five datasets. Seoul's full-corpus surface/phonemic Browser modes are separate evidence (run 42496539257). Standard exact-head checks on the later branch snapshot passed: Python 3.11/3.12/3.13, Browser regression/build, wheel installation, teacher-corpus audit, System Verify, master/research artifact generation, exhaustive register extraction and UGTPHON diagnostic.

K-SPAN's full 63,836-row source join has zero unmatched NIKL WordNums (41,174 Hangul and 22,662 non-Hangul). The 22,843 Modern/Conservative key-to-WorldBet differences remain explicit WARN (13,078 Modern; 9,765 Conservative). The WorldBet source fields drive IPA scoring; the parallel keys remain independently audited. This is not a clean integrity PASS.

The artifact audit found that legacy consolidated-workflow artifacts 13621335293, 13749341395 and 13750158865 contained row-level UGTPHON/SIGMORPHON outputs, predictions, mismatch exports, reviewer packets and the SIGMORPHON test TSV. Artifact 13749341395 additionally contained the raw K-SPAN preparation manifest with ten examples. These bundles remain until their 2026-12-08/10 expiries unless deleted manually; the current GitHub integration exposes no artifact deletion action. The workflow has been changed to produce a combined schema-validated aggregate summary and upload only that summary plus source checksums. Exact-head integration run 42796414336 and artifact inspection are still required before marking the corrected policy DONE_VERIFIED.

The source registry was extended with the pinned SIGMORPHON 2021 Korean source, explicit licence parsing for CC BY-SA/CC BY-NC, CC0 1.0 and KOGL Type 1, and updated source-join evidence. The rights test now expects 239 source rows and eleven item-level licence records; the exact-head CI run is the acceptance evidence.

Open research gates remain independent Korean IPA gold, independent Ukrainian target review, original audio/speaker crosswalk, raw ㅠ offset validation, restricted corpus access/terms and historical 236/239 selector provenance. Optional ByT5/CharsiuG2P inference and NIKL metadata-only inventory were skipped, not passed. Repository remains a research prototype, not release-ready.


## 2026-11-10 closure — five-dataset benchmark merged and evidence reconciled

PR #465 was merged into `main` as `e8ebed5b9ccb67255209ccb20efa45ae0236bcbe` from tested head `18bafbe9d998f7fe818c9b65ec84d3b5098d6dfa`. It is a controlled port from the current main baseline `920b6365539058b658348855c5daddc066558b15`, with no main-only divergence at merge time. PR #463's older divergent branch was not merged; PR #462's narrower SIGMORPHON three-mode work is included in #465. Both are superseded and should be closed without deleting their historical branches.

Exact PR-head CI passed: Tests 42810042726; Verify 42810042823; master/research artifacts 42810042775; exhaustive test-case register 42810043038; UGTPHON diagnostic 42810042906; full matrix 42810042908. The full-matrix job completed every required stage, including six ten-engine tracks, fifteen Browser reports, Native/Browser parity, aggregate generation and upload. Optional ByT5, CharsiuG2P and neural pairing were skipped by policy.

Artifact 13766007256 was downloaded and inspected. It contains only the aggregate summary JSON and source SHA-256 manifest. The summary reports six reference tracks across five datasets, fifteen Browser reports, all source checksums and the K-SPAN warning, but no token-level text, IPA labels, mismatch examples or occurrence ledgers. Schema validation passed in the builder. Older artifacts 13621335293, 13749341395 and 13750158865 remain until expiry/manual cleanup; the current connector cannot delete them.

K-SPAN retains 63,836 joined rows, with zero unmatched NIKL WordNums (41,174 Hangul; 22,662 non-Hangul). Its 22,843 parallel key/WorldBet differences remain WARN (Modern 13,078; Conservative 9,765). WorldBet drives IPA scoring; the alternate keys are audited separately. One external g2p-ko error remains visible on IPA-Dict (999/1,000 scored); no Browser engine errors were recorded. Super-soft candidate availability is 100% on the five Browser-tested dataset tracks, not 100% source-resolved coverage or accuracy.

The four upstream workflow-reference repositories were rechecked on 2026-11-10; all current default-branch HEADs still match the reviewed pins in the engineering workflow reference audit. Existing skills and navigation remain canonical; no upstream code or skill text was copied.

### Current ledger

| Area | State | Evidence / acceptance |
|---|---|---|
| Four-upstream engineering workflow review and repository documentation | DONE_VERIFIED | Existing comparison, root routing, skills, navigation and structural tests; upstream HEADs rechecked 2026-11-10. |
| Five-dataset benchmark implementation | DONE_VERIFIED | PR #465 merged; full exact-head run 42810042908. |
| Aggregate-only current artifact | DONE_VERIFIED | Artifact 13766007256 inspected; exact two-file contents verified. |
| Post-merge/final-documentation main CI | TODO / PENDING | Must pass on final main commit; PR-head results do not substitute. |
| K-SPAN source representation consistency | WARN | 22,843 mismatches preserved and explained; no forced correction. |
| Independent Korean IPA gold | BLOCKED | Qualified independent annotation/adjudication required. |
| Independent Ukrainian target review | BLOCKED | Separate target-language gold and review required. |
| Historical 236/239 cohort membership and raw ㅠ offsets | BLOCKED / PARTIAL | Original selector/run and raw offset evidence absent. |
| KsponSpeech / NIKL Daily Conversation | BLOCKED | Authorized acquisition and corpus-specific terms required. |
| Optional neural inference | DEFERRED | ByT5/CharsiuG2P default-off; separate opt-in and licence/overlap review required. |
| Legacy artifact removal | BLOCKED | Manual owner cleanup or expiry; no connector deletion action. |

**Readiness:** software-verified, evidence-scoped research prototype and benchmark infrastructure; not release-ready or independently research-certified. No claim is made that a test passing establishes independent linguistic gold or Ukrainian target quality.

## Final mainline verification update — 2026-11-10

The final documentation/contract-test main commit at this checkpoint is `b75d36387b089e3e72a54bdc92f28b12f0fbac4c`. Post-merge GitHub Actions on this exact main SHA:

- Tests [42829722954](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42829722954): **PASS** — Python 3.11/3.12/3.13, Browser/web, wheel installation and teacher-corpus audit.
- System Verify [42829722907](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42829722907): **PASS** — Python regression/data integrity and Browser regression/build. Official NIKL metadata-only inventory: **SKIPPED**.
- Master/research artifacts [42829723048](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42829723048): **PASS**.
- GitHub Pages deployment [42829722877](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42829722877): **PENDING**, not PASS. An earlier Pages run [42829130839](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42829130839) remains in progress on an older documentation commit and the latest deployment has not started. No deployment failure is recorded; do not claim live deployment on the final docs SHA until this run completes.

These are GitHub Actions results; no local npm/pytest execution is claimed. The next documentation commit will itself receive a new exact-head CI run. The final repository state is software-verified for tests, system verification and research artifact generation; Pages deployment remains the only observed post-merge workflow still pending.


## Three-tier research-mode refactor — 2026-11-10 (PR #466)

The browser research engine now distinguishes three levels by confidence/coverage:

- **Strict:** unchanged evidence-gated path; unresolved morphology still fails closed.
- **Soft:** inherits the former Super-soft maximum-coverage heuristic path (formal morphology, broader practical heuristics and typed IPA fallback). Candidate spans remain explicitly low-confidence.
- **Super-soft:** new grapheme-only IPA fallback. It decomposes modern Hangul syllable blocks into onset/vowel/coda Jamo, constructs an underlying IPA candidate without inferring contextual assimilation, liaison, fortition, palatalization or morphology, then uses the existing IPA → Ukrainian adapter. Exact source-backed lexical readings remain available.

**Exact-head verification:** PR #466 head 7ee23c8ab1984e7ae156c4a25360a0d167ea6ef7; Verify workflow [42843823095](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42843823095) **PASS** — Python regression/data integrity, full browser regression suite, source redistribution rights gate, Vite build and generated-page checks. The new Super-soft regression exercises all 11,172 modern Hangul syllable blocks through IPA → Ukrainian mapping; existing Soft coverage/adversarial tests preserve the former broad heuristic behavior. NIKL metadata-only inventory remains **SKIPPED**.

**Evidence boundary:** 100% Super-soft coverage is availability of a typed grapheme-derived candidate, not 100% correct Korean pronunciation. Earlier benchmark reports predate this mode reassignment and must not be relabelled as measurements of the new Soft/Super-soft definitions. Rerun the full benchmark matrix against the merged exact main commit before publishing updated comparative scores. GitHub Pages deployment is also pending until the PR is merged and the main-branch Pages workflow completes.


## PR #466 merged and Pages publication — 2026-11-10

- **Default branch:** `main`; merge commit `fa2998acaa0fdd154c9b4d3c1927778f77bac199`.
- **Modes deployed:** Strict unchanged; Soft inherits the former broad heuristic/maximum-coverage path; Super-soft is the new grapheme-only Jamo → underlying IPA → Ukrainian fallback.
- **Coverage contract:** exhaustive technical test across all 11,172 modern precomposed Hangul syllable blocks. This is candidate availability, not pronunciation accuracy.
- **PR #466 exact-head checks:** Verify, tests, Browser G2P, UGTPHON diagnostic, exhaustive test register and master/research artifacts all **PASS**. Optional neural inference and NIKL metadata-only inventory were **SKIPPED** by policy.
- **Mainline Pages run [42858765455](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42858765455):** Python 3.11/3.12/3.13, browser regression/build, deployment and public-page smoke test **PASS**. The final live adversarial practical-mode browser smoke passed on deployed code commit `fa2998acaa0fdd154c9b4d3c1927778f77bac199` (job `129980268421`). The redesigned pages still require a post-merge deployment and smoke.
- **Fresh three-mode benchmark [42858765799](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42858765799):** completed **PASS**; aggregate-only artifact `13785753702` contains the summary JSON and source-hash manifest. All 15 browser reports have zero engine errors; Super-soft candidate availability is 100% across five datasets, while source-resolved scoring coverage is only 0.30–2.03%. Strict has the highest coverage-adjusted exact match on all five datasets. Optional neural inference jobs were SKIPPED.
- **Source/documentation note:** the benchmark artifact is verified; no raw corpus text or IPA examples are redistributed. No local npm/pytest execution is claimed; results above are GitHub Actions evidence.


## PR #467 — Korean editorial workbench redesign — 2026-11-10

- **Branch:** `design/korean-editorial-workbench-2026-11-10`; **base:** `37c922935b30ca5f46a4f5d37bd5e435f3c28cb6`; **tested head:** `95879b0de79092c25c43d8382fed8bdb072121de`; **PR:** [#467](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/467).
- **Scope:** redesigned `index.html` and `system.html` with one shared visual system, dedicated `src/styles/editorial.css`, `DESIGN.md`, research/design brief, browser screenshot workflow and design contract tests. No JavaScript, conversion engine, mode semantics, or runtime dependency changed.
- **Visual grammar:** asymmetric jogakbo/bojagi panel composition, real Hangul specimens, a Hangul → IPA → Ukrainian three-panel example, cool paper/ink/cobalt with signal pink/yellow reserved for the specimen, and a quieter long-form methodology reading surface. No Taegeuk badge, fake paper grain, random glyphs, gradient wash, stock imagery, or external font dependency.
- **Research references:** contemporary Seoul identity and poster practice, Hanyul Hangul Collection, Korean bojagi computational-design research and colour study, contemporary hanji work, LetterSeed typography, Studio Hooyounghoo, fabric, YMG Type Foundry and studio fnt. Sources and the distinction between inspiration and cultural generalisation are recorded in the design brief and `DESIGN.md`.
- **TDD:** visual contract initially failed on missing identity; the hover-motion contract was observed failing on exact head `fdf3b74470d8c294247a89457dd9805611554e17` in [run 42889610807](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42889610807), then passed after restricting hover lift to fine pointers.
- **Exact-head verification:** Tests [42892418808](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42892418808) **PASS** (1,439/1,439); Verify [42892418528](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42892418528) **PASS**; Browser G2P [42892418716](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42892418716) **PASS**; Master/research artifacts [42892418801](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42892418801) **PASS**; exhaustive register [42892418475](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42892418475) **PASS**.
- **Rendered review:** [Editorial visual review 42892418633](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42892418633) **PASS**, artifact `13798249164`: both pages captured at 1440, 1024, 768, 390 and 320 px; no horizontal overflow; keyboard focus, reduced motion and touch-target checks passed. Desktop and mobile captures were inspected.
- **Still pending:** PR merge, Pages deployment of the redesign, and public live smoke on the resulting main commit. The old site remains live until that succeeds.
- **Environment limit:** local clone and local skill CLI checks were unavailable because this runtime could not resolve github.com. No local command pass is claimed; exact-head GitHub Actions are the verification evidence.
