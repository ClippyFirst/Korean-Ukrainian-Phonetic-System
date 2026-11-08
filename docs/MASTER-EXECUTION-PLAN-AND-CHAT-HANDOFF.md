# Master execution plan and handoff — 2026-11-08

## Execution checkpoint

This continuation executed the existing benchmark and corpus-access work rather than replacing the repository plan. The user explicitly authorized repository improvements, imports and internet research. Work remained on `main`, consistent with the existing owner preference; no branch or PR was created.

- Starting main commit: `893619785c8fc7c8417cc8da0690d84fcb8d8dbb`.
- Benchmark code snapshot: `668dbad14568e8472594937558500500102b3f95`.
- Main before final audit closure: `06eec3c62670dae76aad3b2fecd6aecd1d3173e2` (the final audit commit follows this revision).
- Full 10-engine benchmark: [run 42487350896](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487350896), artifact `13621335293`.
- Seoul corpus ingestion and two additional three-mode benchmarks: [run 42492152654](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42492152654), artifact `13621892753`.

## Completed work

### Benchmark execution

Five executable evaluation tracks now exist across three datasets:

1. UGTPHON — 10-engine Strict IPA and Broad sensitivity.
2. SIGMORPHON 2021 Korean — 10-engine Strict IPA and Broad sensitivity.
3. UGTPHON — Kozak Kim Browser Strict, Soft and Super-soft.
4. Seoul Corpus SLR113 — Kozak Kim three-mode Hangul surface pronunciation.
5. Seoul Corpus SLR113 — Kozak Kim three-mode phonemic IPA via a versioned 36-symbol adapter.

The five-track count is not five independent corpora. KsponSpeech and NIKL 2022 remain access/terms-gated candidates and are not scored.

### Seoul Corpus label import

- Retrieved only the 57 MB OpenSLR SLR113 label archive in CI; audio was not downloaded.
- Archive SHA-256: `63c3f8ffa6976307a732689d6c5be7b2db4ec20f14bf276faf98c886add0d24b`.
- 240/240 TextGrid files parsed; 1,680 tiers; 2,671,221 interval annotations.
- 231,626 aligned Hangul word pairs; 231,625 aligned phonemic IPA pairs.
- 36 observed phone symbols mapped using Table 3 of Yun et al. (2015), DOI `10.13064/KSSS.2015.7.2.103`.
- 1,134,781 phone intervals mapped; 70,660 non-phone/unmapped intervals excluded. Seven word intervals were excluded from phone-to-word IPA scoring (six boundary conflicts, one non-phone/unmapped label).
- Raw TextGrid files, audio and word/IPA pair JSON files remain temporary CI data and are not committed or uploaded. Disclosure: an intermediate diagnostic artifact 13621412269 contains a distinct phoneme-tier label inventory, including some short laughter-tag text; it does not contain TextGrid/audio/word-pair data and expires 2026-12-08. The final clean artifact 13621892753 from rerun 42492152654 has 7-day retention and was verified to contain aggregate symbol/category counts only, with no raw label-value map. Earlier intermediate artifact 13621412269 contains a distinct phoneme-tier label inventory with some short laughter-tag text, not TextGrid/audio/word-pair data; it expires 2026-12-08.

### Mode results and interpretation

- On Seoul Hangul surface: Strict 97.0375% coverage, 57.1537% scored-only Exact, 55.4605% coverage-adjusted Exact, 24.5421% CER. Soft 87.0006% coverage / 48.8991% adjusted Exact / 26.3641% CER; Super-soft 83.4924% / 47.4662% / 26.3118%.
- On Seoul phonemic IPA: Strict 97.0375% coverage, 14.1166% scored-only Exact, 13.6984% coverage-adjusted Exact, 39.9210% CER. Soft 87.0005% / 12.8734% adjusted Exact / 40.8696% CER; Super-soft 83.4923% / 12.8402% / 40.4053%. Soft/Super-soft scored-only Exact is higher only because they score fewer source-resolved cases; strict wins every exact comparison on common scored subsets.
- The phonemic reference is not narrow phonetic gold. The mapping adapter explicitly serializes `ʨ` as `tɕ` and asterisk fortis markers as `͈`; independent Korean phonetics review remains required.
- Native/Browser Strict parity on UGTPHON: 2,703/2,703 surface outputs and 2,702/2,702 resolved raw IPA/Broad IPA outputs.
- No production pronunciation rules or lexical exceptions were promoted from Seoul Corpus.

## Existing implementation preserved

- Existing IPA-first pipeline and the Native/Browser Kozak Kim implementations.
- Original g2pK 0.9.4 vendor baseline; external engines remain comparison-only.
- Existing 236-case review queue and source-backed lexical controls; no reinterpretation of the 213 unadjudicated, 22 ABSTAIN and 1 provisional RETAIN dispositions.
- Existing five-dataset portfolio and benchmark suite register; extended in place rather than duplicated.

## Verification actually executed

On benchmark code snapshot `668dbad14568e8472594937558500500102b3f95`:

| Check | Result | Evidence |
|---|---|---|
| Seoul label inventory + surface + phonemic IPA benchmark | **PASS** | [42492152654](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42492152654) |
| Python 3.11/3.12/3.13, Browser, Web, wheel-install, teacher corpus audit | **PASS** | [42491208107](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42491208107) |
| System Verify: Python regression/data integrity, Browser regression/build | **PASS** | [42491208109](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42491208109) |
| Master table and research corpus artifacts | **PASS** | [42491208162](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42491208162); latest source-register generation [42492418499](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42492418499) |
| 10-engine UGTPHON + SIGMORPHON + three browser modes + Native/Browser parity | **PASS** | [42487350896](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42487350896) |
| Seoul metadata-only corpus preflight tests | **PASS** | Included in run 42492152654 |

Latest source-register/docs snapshot before this handoff refresh on `06eec3c62670dae76aad3b2fecd6aecd1d3173e2`: tests [42492418635](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42492418635) **PASS** (Python 3.11/3.12/3.13, Web/npm tests/build, wheel install, teacher-corpus audit); System Verify [42492418484](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42492418484) **PASS**; master artifacts [42492418499](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42492418499) **PASS**. Source register has 230 rows and all rows parse as 12 CSV fields.\n\nNo claim is made that GitHub Pages deployment completed; it was queued at the time of the benchmark snapshot. Neural ByT5 and CharsiuG2P remained skipped under existing default-off policy. The container's direct network download attempt was unavailable; GitHub Actions successfully retrieved the public archive. No local full repository test run is claimed; CI is the verification source.

## PRs, branches and merge decisions

- Work continued directly on `main`, not on a new branch, following the established owner preference.
- No open PR was present in the repository's GitHub REST open-PR listing at inspection time.
- PR #457 had already been merged and its historical artifact was retained only as historical comparison; the exact-main run 42487350896 supersedes it for current benchmark code.
- No user branches were deleted, no PR was merged blindly, no force-push occurred, and no release was published.

## Remaining task ledger

| Task | State | Exact blocker / acceptance criterion |
|---|---|---|
| Independent review of Seoul phoneme-to-IPA adapter | **TODO** | Korean phonetics reviewer to approve Table 3 serialization choices and the phonemic-vs-phonetic comparison boundary. |
| Ukrainian target rendering validation on Seoul | **DEFERRED** | Seoul supplies Hangul and phonemic IPA references, not Ukrainian target gold. Requires separately adjudicated Ukrainian target references. |
| KsponSpeech benchmark | **BLOCKED** | AIHub account/access and original corpus terms; the Hugging Face mirror's empty license field is not permission. |
| NIKL 2022 Daily Conversation benchmark | **BLOCKED** | NIKL portal application and exact license/terms; no access token/data obtained. |
| SIGMORPHON sealed-holdout status | **PARTIAL** | Verify source split and training overlap before describing it as a sealed holdout. |
| 236-case independent linguistic adjudication | **PARTIAL** | 213 cases not individually adjudicated, 22 ABSTAIN, 1 provisional RETAIN; no promotion to gold/production. |
| Neural ByT5 / CharsiuG2P | **DEFERRED** | Existing default-off policy; requires model/runtime and data provenance review. |
| Release readiness | **NOT READY** | Independent phonetics review, Ukrainian target validation, corpus-rights review and complete holdout adjudication remain incomplete. |

## Repository status

**Software-verified research prototype; not independently research-certified and not release-ready.** The five evaluation tracks are reproducible, but the corpus references have distinct conventions, the Seoul IPA adapter is phonemic, and production acceptance still requires independent review. The final repository HEAD is the commit containing this handoff plus the subsequent audit update; see the final execution report for the exact SHA.


## 2026-11-08 continuation — corrected Seoul fallback accounting and release-check refresh

**Current verified benchmark code head:** `536cd44460bbd225fcd76f592bfe6e3077a245a4`. The Seoul workflow [42496539257](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496539257), artifact `13623457737`, passed archive download, 240/240 TextGrid parsing, Hangul surface benchmark and phonemic-IPA benchmark. It supersedes the initial Seoul artifact's overlapping fallback counters.

The 29 Super-soft typed orthographic-fallback rows were already excluded from source-resolved Exact/CER by the earlier heuristic status branch, so scores did not change. The correction makes the strata mutually exclusive: 38,207 heuristic + 29 typed fallback. Both benchmark scripts now explicitly skip typed fallback before Exact/CER and paired comparisons. Two Node regression tests cover both scorer paths.

- Full tests [42495903258](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42495903258): **PASS** — Python 3.11/3.12/3.13, Web/npm tests and build, wheel installation, teacher-corpus audit.
- System Verify [42495903331](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42495903331): **PASS** — Browser regression/build and Python regression/data integrity. Official NIKL metadata inventory: **SKIPPED**, not passed.
- GitHub Pages deployment [42495903310](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42495903310): **PASS**.
- Final documentation/source-accounting commits now bring `main` to `09efa609368df914b38020b8a74ec7c4a1fb4cd6`; exact-head tests/system/artifact workflows were queued after this docs-only update (runs 42496173562, 42496173554, 42496173617). Do not mark those newest-head checks complete until they finish.

**Remaining gates are unchanged:** independent Korean phonetics review of the Seoul adapter; no Ukrainian target gold for Seoul; KsponSpeech and NIKL 2022 access/terms; independent review of the 236-case cohort; and broader external IPA/target validation. The repository remains a software-verified research prototype, not release-ready.


## Final exact-main checkpoint after documentation reconciliation — 2026-11-08

**Main SHA at checkpoint:** `84f2fbd9a90cf6e6d8a8f5e634f7c8989bab7ecc` (branch `main`). The exact-head CI after the final audit/handoff/coverage updates completed:

- Tests [42496221194](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496221194): **PASS** — Python 3.11/3.12/3.13, Web/npm tests and build, wheel installation, teacher-corpus audit.
- System Verify [42496221320](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496221320): **PASS** — Browser regression/build and Python regression/data integrity; official NIKL metadata-only inventory **SKIPPED**.
- Master/research artifact generation [42496221352](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496221352): **PASS**.
- The last code-bearing Pages deployment [42495903310](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42495903310) passed on `e1e393b3518b6c69685ad00a179ab8996d18ef71`. Commits after that point are documentation-only; their redundant Pages runs were cancelled by newer commits, and no runtime assets changed.

No open PRs were present at the latest inspection. No user branches were deleted, no force-push occurred, and no release was published. The five executable evaluation tracks remain diagnostics across three datasets; KsponSpeech and NIKL 2022 remain access/terms-gated. Readiness remains **software-verified research prototype; not independently research-certified or release-ready**.


## 2026-11-08 — separate candidate availability from source-resolved accuracy

The Seoul benchmark scripts now emit both `output_available_occurrences` / `output_availability_rate` and source-resolved `scored_occurrences` / `coverage`. The former includes heuristic and typed-fallback candidates, but excludes unresolved identity passthrough; it is explicitly not an accuracy metric.

- Hangul surface availability: Strict 97.0375%, Soft 98.2502%, Super-soft 100%.
- Phonemic IPA availability: Strict 97.0375%, Soft 98.2502%, Super-soft 100%.
- Source-resolved coverage remains surface 97.0375% / 87.0006% / 83.4924%, IPA 97.0375% / 87.0005% / 83.4923% (Strict / Soft / Super-soft).
- Benchmark artifact [13623457737](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496539257) is aggregate-only; raw label and pair files remain temporary CI data.
- The new tests [42496551366](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496551366) passed; System Verify [42496551350](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496551350) passed with the optional NIKL inventory skipped.


## 2026-11-08 continuation — three-mode coverage across all compatible benchmark inputs

Owner instruction is to work directly on main; this continuation preserves that path and does not create, delete or rewrite user branches.

**Starting main before this batch:** f79b6cadf3da93701cdf95985a9f71de80cc8bca.  
**Current code/test head before this documentation append:** 7032d3a4abf0e7c97caec1d7ae91de08c0a18c6a.

### Completed implementation (CI pending)

- Generalized the Kozak Kim Browser benchmark runner so it can identify SIGMORPHON separately from UGTPHON and attach the pinned dataset source to the report.
- Added candidate-output availability as a separate metric from source-resolved IPA scoring coverage.
- Added the SIGMORPHON Browser Strict/Soft/Super-soft benchmark calls to the existing multi-engine workflow; all three reports are uploaded as artifacts.
- Added exact-denominator, zero-engine-error, monotonic availability and 100% Super-soft availability checks for UGTPHON and SIGMORPHON.
- Added monotonic and 100% Super-soft candidate-availability gates to both Seoul Hangul surface and Seoul phonemic-IPA benchmark scripts.
- Added Node regression coverage for candidate availability vs source-resolved scoring and explicit metric aliases.

### Metric interpretation

Super-soft 100% means that every eligible occurrence has a non-empty, typed candidate output. It does not mean every output is correct. Exact/CER only score source-resolved IPA outputs; heuristic and typed fallback candidates remain outside that accuracy denominator. Strict/Soft/Super-soft availability must be monotonic. The ten external engines remain Strict-compatible comparators, not modes of Kozak Kim; the morphology-consensus diagnostic remains a separate research harness. The reconstructed 236-case cohort is not an accuracy gold set.

### Task ledger

| Task | Status | Acceptance |
|---|---|---|
| Browser runner dataset labels/source metadata and metric aliases | PARTIAL | Exact-head browser tests and benchmark workflow pass. |
| UGTPHON three-mode candidate-availability gate | PARTIAL | All eligible occurrences retained; monotonic availability; Super-soft 100%; no engine errors. |
| SIGMORPHON three-mode run | PARTIAL | 1,000 eligible rows in each mode, same occurrence IDs, all artifact reports present, Super-soft 100%. |
| Seoul surface three-mode gate | PARTIAL | Monotonic availability and Super-soft 100% across 231,626 occurrences. |
| Seoul phonemic-IPA three-mode gate | PARTIAL | Monotonic availability and Super-soft 100% across 231,625 occurrences. |
| Full exact-head verification | TODO | GitHub Actions test matrix, system verification, master/research artifact checks and multi-engine benchmark pass on the final docs commit. |

### Commands and evidence

- The intended CI runner executes node --test tests/kozak-kim-ipa-first-benchmark.test.mjs, npm test, npm run build, Python 3.11/3.12/3.13 tests, wheel install, teacher-corpus audit, system verification, and the multi-engine benchmark. These are configured checks, not commands run locally in this connector-only session.
- Prior Seoul artifact [42496539257](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42496539257) had measured 100% Super-soft candidate availability on both Hangul surface and phonemic IPA. New runtime gates still require an exact-head rerun.
- No local test result is claimed. No new SIGMORPHON three-mode score is claimed until its exact-head artifact is inspected.

### Stop condition

Do not mark the new mode matrix DONE_VERIFIED until all four compatible benchmark inputs have passed all three modes on the same eligible occurrence sets, Super-soft is 100% candidate-available, and all relevant CI/artifact checks pass. External-engine Strict comparisons remain separate and preserved.


## 2026-11-08 execution continuation — exact-main verification and branch audit

**Current main:** `5814de6a77745feca7cc7683e6594d67289c2b23`.

PR state is reconciled: PR #461 is merged; the current GitHub open-PR query returned zero. The stale "PR remains open pending merge" sentence in the repository-structure guide has been corrected. The 40 source-policy adjudications are already integrated into main as metadata/provenance annotations (40 occurrences, 17 families); they do not independently rewrite IPA or Ukrainian output.

### Verification

On parent code/docs head `1912ea24e78ca03fe8483292efb31960d11c1c1e`:

- Tests [42506324942](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42506324942): PASS — npm tests/build, Python 3.11/3.12/3.13, wheel install, teacher-corpus audit.
- System Verify [42506324960](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42506324960): PASS — Python/browser regressions, source redistribution rights gate; NIKL metadata-only inventory SKIPPED.
- Master/research artifacts [42506325185](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42506325185): PASS.
- Pages deployment/live browser smoke [42506324909](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42506324909): PASS.

Latest documentation correction commit `5814de6a77745feca7cc7683e6594d67289c2b23` has exact-head runs queued: tests 42506815536, verify 42506815808, master artifacts 42506815555, Pages 42506815519.

Multi-engine benchmark [42506225213](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42506225213) is running against code head `c757cd02fee87e7313e52352602ec4ef879a7def`. Pinned dataset fetches, external license checks, adapter tests, training-readiness audit and holdout packet generation passed; the main comparison step and all downstream Browser three-mode/artifact steps remain in progress/pending. Do not claim new SIGMORPHON results or final mode-gate completion until the workflow succeeds and artifacts are inspected. ByT5 and Charsiu optional inference were skipped by policy.

### Branch disposition

All 27 non-main branches were compared against main. The high-risk 40-case adjudication, 236-case, source-rights, abstention-fix and agent-workflow branches were additionally tree-inspected; sampled trees had no branch-only files and main contains newer/superseding content. No branches were deleted, force-updated or blindly merged. Historical branches remain untouched. No open PRs remain.

### Next acceptance gates

1. Inspect run 42506225213 through completion; verify UGTPHON and SIGMORPHON Strict/Soft/Super-soft reports use identical occurrence denominators, zero engine errors, monotonic candidate availability and 100% Super-soft candidate availability. Inspect uploaded artifacts; do not confuse availability with source-resolved scoring coverage or accuracy.
2. Confirm runs 42506815536, 42506815808, 42506815555 and 42506815519 on current main.
3. Keep optional NIKL/Charsiu/ByT5 jobs classified as skipped, not passed.
4. Retain the research-prototype status until independent Korean phonetics and Ukrainian target-layer acceptance is complete; no speaker-specific narrow IPA gold is claimed.

**Readiness at this checkpoint:** software-verified research prototype, not release-ready. No local shell test result is claimed; verification evidence is GitHub Actions.


## 2026-11-08 — Multi-engine benchmark failure diagnosis and correction

- The first completed multi-engine run (Actions run 42506225213) failed at the Native/Browser runtime parity audit, not during engine inference. The browser runner emitted its default benchmark identity, while the audit requires the explicit `UGTPHON Korean canonical-token diagnostic` identity. This caused the guard to reject the report before the parity comparison and before the later SIGMORPHON stage.
- The UGTPHON browser Strict/Soft/Super-soft runs themselves completed with zero engine errors and 2,703 eligible occurrences each. Strict: 2,702/2,703 source-resolved scored (99.963%), 2,702/2,703 candidate availability, 52.739% exact among scored, CER 9.013%. Soft: 2,423/2,703 source-resolved scored (89.641%), 2,703/2,703 candidate availability, 54.767% exact among scored, CER 7.879%. Super-soft: 2,239/2,703 source-resolved scored (82.834%), 2,703/2,703 candidate availability, 56.186% exact among scored, CER 7.819%.
- Interpretation: Super-soft achieved complete candidate availability, not complete source-resolved coverage or accuracy. The lower source-resolved denominator reflects heuristic outputs that are deliberately excluded from source-resolved scoring. These metrics must remain separate.
- Corrective commit `b7b4afca93a8d218c0f99eb5a11a52e6a5a05712` adds the explicit benchmark name and pinned dataset-source label to all three Browser UGTPHON invocations. This is a harness identity fix; it does not change engine behavior or scoring rules.
- Acceptance remains pending until the new main-branch Actions run completes the parity audit, SIGMORPHON Strict/Soft/Super-soft comparisons, and artifact review. Do not mark the multi-engine benchmark DONE_VERIFIED based on run 42506225213. Its failure is recorded as a harness failure with the specific cause above; the corrected rerun is pending.
- GitHub Pages run 42506852765 completed successfully, including browser build and deployment. Latest ordinary Tests, System Verify, and research artifact generation runs at commit 2d55eeec5fb2e6f72ada8b316bd5c4df1caab2b8 passed; these do not substitute for the pending multi-engine gate.


## 2026-11-08 — external benchmark inventory reconciliation

The benchmark portfolio must not be limited to the eight internal suites or the five selected datasets. The canonical external-resource inventory is now extended in docs/KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md and research/SOURCE-REGISTER.csv.

Newly reconciled resources:
- **MFA Korean G2P v2.0.0 (Hangul):** model card reports 48,665 training words, 5,407 held-out words, WER 10.25%, PER 2.26%; CC BY 4.0. Candidate external baseline; still requires pinned model/dictionary, MFA-phone→IPA adapter and leakage checks.
- **MFA Korean (Jamo) G2P v2.0.0:** model card reports 48,682 training words, 5,409 held-out words, WER 3.90%, PER 0.64%; CC BY 4.0. Secondary variant from the same MFA family, not an independent dataset. Requires Hangul→Jamo and phone→IPA adapters.
- **kr-MATAGI/IPA_G2P-Testing:** indexed as a secondary benchmark catalogue. Its README reports g2pk WER 4.7 / PER 0.74 on SIGMORPHON 2021, but exact test split, normalization, scoring code and licence are not established. These values are not comparable to our current reports without protocol reconciliation.
- **SIGMORPHON 2024 G2P Shared Task:** its published task definition uses Latin, Cyrillic and abjad orthography groupings; no Hangul Korean test set was established. It is not added as a Korean dataset.
- **Mun, Kim & Ko (2022) 130-row hand-transcribed golden corpus:** remains the strongest rule-phenomenon candidate, but formal use is blocked by missing explicit data reuse permission/licence.

No external model or dataset was silently imported, vendored, or scored in this documentation pass. The next executable external-baseline task is MFA v2.0.0, subject to exact model/dictionary pinning and a lossless phone-to-IPA adapter. The IPA_G2P-Testing discrepancy is an investigation task, not an accuracy result.
