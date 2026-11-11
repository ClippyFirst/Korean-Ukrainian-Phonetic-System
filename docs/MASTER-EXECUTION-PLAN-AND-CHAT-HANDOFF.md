# Master execution plan and handoff — 2026-11-08

## Execution continuation — 2026-11-10

The current PR #465 head (`840cb3f177e147dfe1ae53e7bdd26d524b699b64`) is 66 commits ahead of `main` and 0 behind. It is based on the latest main baseline; no merge-base conflict is indicated. The full six-track ten-engine / fifteen-report Browser matrix was previously completed in run 42785083152, with Seoul full-corpus Browser runs in 42496539257. The K-SPAN 63,836-row NIKL WordNum join is complete, but key/WorldBet consistency remains WARN at 22,843 discrepancies (Modern 13,078; Conservative 9,765).

Latest exact-head CI on 840cb3f is not green:
- Verify 42799422710: FAIL — source-register CSV shape plus Browser link/checkpoint assertions.
- Tests 42799422543: FAIL — same malformed CSV; Python 3.11/3.13 cancelled by fail-fast.
- Multi-engine 42799422846: FAIL — aggregate builder cannot import the sibling summarizer when run as a script.
- Master/research artifacts 42799423026: PASS.
- Exhaustive register extraction 42799422733: PASS.
- UGTPHON diagnostic 42799422696: PASS.

The repair batch quotes comma-bearing fields in three source-register rows, corrects the docs-index relative link and structure-guide checkpoint heading, and makes the summary builder import its sibling module in package and direct-script execution contexts. After those repairs, rerun Python 3.11/3.12/3.13, Browser, Verify and the full matrix on the final exact head. Inspect the aggregate-only ZIP and verify it contains only the schema-validated aggregate JSON and source checksums before marking artifact policy DONE_VERIFIED.

K-SPAN's 22,843 key/WorldBet differences are not waived: score from the source WorldBet fields, report the parallel key-field differences independently, and preserve all rows. Optional neural inference and metadata-only NIKL inventory remain skipped. Independent Korean IPA gold, independent Ukrainian target review, historical audio/speaker provenance and restricted corpus terms remain separate research blockers.

The repository remains a software-verified, evidence-scoped research prototype, not independently research-certified or release-ready. PR #465 must not be merged until required exact-head CI is green and the artifact is inspected. PR #463 and #462 are superseded in intended scope but should be closed only after #465 is accepted; preserve their historical branches.



## Previous execution handoff — 2026-11-10 (superseded) (exact PR #465 checkpoint)

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


Additional resources reconciled in this pass:
- **Korean Word-IPA Dictionary / IPA-Dict Korean:** Wiktionary-derived CC BY-SA lexical IPA resource; IPA_G2P-Testing reports 62,676 entries. It is a candidate supplementary lexicon, but not independent from SIGMORPHON/WikiPron; exact snapshot and overlap audit are mandatory.
- **Zeroth-Korean / OpenSLR SLR40:** CC BY 4.0 speech corpus; OpenSLR reports 51.6h training (22,263 utterances, 105 speakers) and 1.2h test (457 utterances, 10 speakers), with a lexicon. It is registered as an adjacent speech/lexicon resource, not G2P gold until the pronunciation symbols and lexicon schema are audited. Audio is not mandatory for this registration.


## 2026-11-08 — MFA v2 G2P execution checkpoint

The two MFA Korean v2.0.0 models have now been integrated as isolated, comparison-only CI baselines. Workflow [42512114864](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42512114864) ran both official model archives against the pinned UGTPHON test split and the pinned SIGMORPHON 2021 Korean test file. The Hangul model archive SHA-256 is `b7b19314b141e20b9714bed8d6eb80d3c291ae3f4d282ffdb643468fedce18d8`; Jamo archive SHA-256 is `8068b669bf39fa11b9e606e8961d434c7811e9437e71eb1840f841ed4cb63398`. Model weights are fetched in CI and not committed. The environment pins MFA 2.0.0 and `jamo==0.4.1`.

Results were produced for all four combinations: UGTPHON Hangul/Jamo (2,703 eligible each) and SIGMORPHON Hangul/Jamo (999 eligible each). See the benchmark suite register for the complete Exact/CER/PER/feature-weighted table. The first run's final gate failed because it expected 1,000 eligible SIGMORPHON rows although the shared scorer admits 999 from the 1,000-row raw file. This was corrected; rerun [42513951588](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42513951588) completed successfully, including the denominator/schema gate and artifact upload. Aggregate artifact [13630946780](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42513951588/artifacts/13630946780), SHA-256 `469ffb31f9721afa2272454e9854fb6453de9e213e19def78549db2a7ba16b32`. The MFA v2 diagnostic benchmark is **DONE_VERIFIED**.

Remaining MFA acceptance gates:
- **DONE_VERIFIED:** four report schemas, eligible denominators, model checksums and aggregate artifact upload passed in run 42513951588.
- **TODO:** inspect and audit model dictionary/training lineage overlap with SIGMORPHON/WikiPron/UGTPHON; do not treat the two MFA variants as independent.
- **BLOCKED / expert review:** independently validate the complete 56-symbol MFA phone inventory and identity-to-IPA mapping; unknown symbols currently fail closed, but that alone does not prove the published phone symbols are phonetic IPA.
- **DEFERRED:** do not add MFA to production, runtime dependencies or Ukrainian target rendering. The current integration is a research comparison only.


## 2026-11-09 — documentation, repository structure and mainline reconciliation

### Scope and starting state

- Repository: `ClippyFirst/Korean-Ukrainian-Phonetic-System`.
- Starting `main`: `6ef4960fca292b8e5bfa296bebb75f32fe6b1a7f`.
- Owner instruction: keep one active integration branch and work on `main`; do not create a task branch.
- Push/admin access was available.
- Main already contained a substantial documentation system, seven repository-local skills, canonical research registers, schemas, tests and dedicated CI workflows. This pass preserves those systems rather than creating a replacement architecture.

### Repository map and structural decision

The existing top-level boundaries are coherent and are retained:

- `.agents/skills/` — seven focused engineering, audit, review and phonetic-evidence skills.
- `.github/workflows/` — CI, release verification, Pages deployment, benchmark and research workflows.
- `src/` — browser and Python runtime implementation.
- `data/` — canonical structured phonological and Ukrainian target data.
- `research/` — source register, rule coverage, acceptance gates, decision log, corpora and review packets.
- `schemas/` — machine-readable contracts.
- `scripts/` — generators, imports, audits and benchmark runners.
- `tests/` — browser, Python, parity, data, rights and benchmark contract tests.
- `docs/` — human documentation, methodology, historical audits and append-only handoff.
- `reports/` — generated summaries; `licenses/` — third-party licence texts and notices.

No bulk move or rename is justified. The large, dated `docs/` collection is intentional evidence history; discoverability is handled through the documentation index and ownership guide. Do not delete or rewrite historical reports to make the tree appear smaller.

### Upstream practice reconciliation

The maintained [agent workflow guide](AGENT-WORKFLOWS.md) lists all four requested upstreams in one comparison table and records their reviewed revisions:

- [unlazy](https://github.com/Leonxlnx/unlazy) — explicit acceptance gates, command oracles, evidence freshness and re-verification; adopted through existing registers and exact-head verification, not by importing its second state machine or shell-execution tooling.
- [superpowers](https://github.com/obra/superpowers) — red/green TDD and root-cause debugging; applied through the existing engineering and phonetic skills.
- [mattpocock/skills](https://github.com/mattpocock/skills) — composable skills, separate specification/engineering review and source-grounded research; adapted to the repository's current skill router and evidence registers.
- [ponytail](https://github.com/DietrichGebert/ponytail) — risk-first audits, real data-flow tracing and smallest complete fixes; adopted without importing unrelated benchmark claims or a line-count objective.

No upstream skill text, hooks, scripts, plugins or code was copied. The repository already had the right local skill boundaries; this pass clarifies provenance and adoption.

### GitHub PR and CI reconciliation

- PR [#463](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/463): OPEN, not merged. Head `2adf6fb46b7773278d8abc29b863228b8d655e67`, base `6ef4960fca292b8e5bfa296bebb75f32fe6b1a7f`.
- PR [#462](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/462): OPEN, not merged; narrower SIGMORPHON Browser verification change whose scope is superseded by #463. Leave untouched until #463 is resolved; do not merge both redundantly.
- Multi-engine run [42526972593](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42526972593): **FAIL** at step 19. The 10-engine UGTPHON/SIGMORPHON comparisons and all three SIGMORPHON Browser report generations completed. The inline Python gate computed `expected_tokens = 0` because the Hangul regex was double-escaped (`r"[\\uac00-\\ud7a3]+"` in the workflow source); the assertion then failed on Strict with `('strict', 999, 0)`. The SIGMORPHON reports showed eligible=999; Strict scored/output=998 with one unresolved; Soft scored=987, output=998, heuristic=11; Super-soft scored=942, output=999, heuristic=57. Candidate availability is monotonic 998 ≤ 998 ≤ 999, with Super-soft at 100%; source-resolved scoring coverage remains a separate metric.
- Because step 19 failed, step 20 Browser regression and step 21 Seoul/K-SPAN/IPA-Dict open benchmark matrix were **SKIPPED**. CharsiuG2P and ByT5 research inference jobs were also **SKIPPED** under their default-off configuration. The artifact was uploaded, but its existence does not turn the workflow into PASS.
- External UGTPHON diagnostic [42526976103](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42526976103): **PASS**.
- Exact-main push workflows on starting commit `6ef4960fca292b8e5bfa296bebb75f32fe6b1a7f`: Tests [42519315077](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42519315077), System Verify [42519315152](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42519315152), Master/research artifacts [42519315001](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42519315001), Pages deployment [42519315003](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42519315003): all **PASS**.

### Documentation changes made in this continuation

- Refreshed `docs/README.md` with the actual main SHA, exact-main CI run IDs, the two open PRs and the failed benchmark gate; removed the stale claim that there were zero open PRs.
- Refreshed the current checkpoint in `docs/REPOSITORY-STRUCTURE.md` and documented the PR/benchmark boundary without claiming the open matrix passed.
- Added the four requested upstream repositories to one maintained comparison table in `docs/AGENT-WORKFLOWS.md`.
- Added `CONTRIBUTING.md` and `.github/PULL_REQUEST_TEMPLATE.md` to make setup, evidence, data-rights, benchmark and verification expectations explicit for human contributors.
- Linked the contribution guide from the root README and documentation index.
- This handoff records the actual starting state, decisions and blockers; it does not replace the canonical research acceptance gates, source register or benchmark suite register.

### Task ledger

| Task | State | Evidence / acceptance |
|---|---|---|
| Mainline and PR reconnaissance | DONE_VERIFIED | Current main, open PR metadata, branch refs, current tree and workflow runs inspected. |
| Existing structure preservation | DONE_VERIFIED | Existing directories and seven local skills retained; no bulk moves or branch deletion. |
| Upstream workflow comparison | DONE_VERIFIED | Four requested repositories/revisions documented in `docs/AGENT-WORKFLOWS.md`. |
| Human contribution and PR guidance | DONE_VERIFIED | `CONTRIBUTING.md` and PR template added; links added to navigation. |
| Documentation freshness | DONE_VERIFIED | Main SHA, workflow IDs and PR states reconciled in canonical navigation/structure docs. |
| PR #463 five-dataset matrix | PARTIAL | Gate fails on double-escaped Hangul regex; acceptance requires fix, rerun of steps 19–21, uploaded aggregate-only artifact and all required jobs PASS. |
| PR #462 | DEFERRED pending #463 | Superseded scope; do not merge redundantly. Reconcile/close after #463 is resolved. |
| Neural CharsiuG2P / ByT5 inference | DEFERRED | Default-off jobs were skipped; separate model/license/data-provenance approval and actual inference remain required. |
| Research/release certification | BLOCKED / PARTIAL | Independent phonetics review, phone-inventory validation, holdout/training overlap, Ukrainian target gold and restricted-corpus rights remain open in canonical registers. |

### Commands and verification

No local shell, npm, pytest, build or repository checkout was available through the connected GitHub interface; no local test execution is claimed. Repository reads, PR diffs, exact-head Actions metadata, job-step summaries and failed job logs were inspected through GitHub. The documentation commit created by this continuation must be checked by the four push-triggered main workflows; update this handoff with their exact run IDs and result after they finish.

### Final state and next blocker

The repository remains on the single active integration branch `main`; historical/supporting refs and open PRs are not deleted or blindly merged. No release was published. Readiness remains **software-verified, evidence-scoped research prototype; not independently research-certified or release-ready**.

The next genuine implementation blocker is the PR #463 workflow's Hangul token-count regex. Correct the regex using a literal Hangul range or explicit code-point comparisons, rerun the exact benchmark job, and require the Browser regression plus Seoul/K-SPAN/IPA-Dict matrix to execute before considering any merge. Preserve the distinction between candidate availability and source-resolved accuracy throughout.


## 2026-11-09 continuation — GitHub documentation and five-dataset matrix reconciliation

### Updated mainline state

- Main before this handoff update: `00304f9ee8f2cb219d83c04e5179aa16eae71e99`.
- The sole active integration branch remains `main`; no new task branch was created.
- The four push-triggered workflows on that main commit all passed:
  - tests [42577427196](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42577427196) — PASS; 1,428/1,428 browser tests, Python 3.11/3.12/3.13, teacher-corpus audit and wheel install.
  - system verify [42577426985](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42577426985) — PASS; Python tests, browser tests/build and source redistribution rights gate.
  - master/research artifacts [42577427050](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42577427050) — PASS.
  - Pages deployment [42577426908](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42577426908) — PASS.

### Documentation and GitHub structure

This continuation adds or reconciles:

- `CONTRIBUTING.md` — reproducible setup, canonical ownership, phonetic/IPA evidence discipline, source rights, benchmark reporting, tests and generated artifacts.
- `.github/PULL_REQUEST_TEMPLATE.md` — evidence, licence, denominator, IPA profile, regression and exact-head CI checklist.
- `docs/REPOSITORY-STRUCTURE.md` — a 20-workflow GitHub Actions responsibility map, alongside the existing component/data ownership map.
- `docs/AGENT-WORKFLOWS.md` — all four requested upstream systems are compared in one table; no upstream code or skill text is copied.
- `docs/README.md` and root `README.md` — contributor navigation and a corrected distinction between the long-term corpus acquisition list and the current executable matrix.
- `docs/KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md` and `docs/BENCHMARK-RESULTS-2026-11-08.md` — the current five-dataset target is explicitly UGTPHON, SIGMORPHON, Seoul, K-SPAN 2.1 and IPA-Dict. The earlier KsponSpeech/NIKL list is retained as a long-term access/terms-gated acquisition portfolio, not the executable matrix.
- `tests/kozak-kim-methodology-contract.test.mjs` — its assertions now verify the distinction and the new matrix instead of depending on the old heading.

The current matrix has five datasets and seven reference tracks: UGTPHON (1), SIGMORPHON (1), Seoul surface/phonemic-IPA (2), K-SPAN Modern/Conservative (2), and IPA-Dict (1). K-SPAN's two tracks are one dataset. IPA-Dict is Wiktionary-derived and is not an independent gold lineage from SIGMORPHON even after exact-overlap exclusion. The NIKL MKUFS2 word index used for K-SPAN joins is not a scored NIKL speech dataset.

### Benchmark PR reconciliation

- PR [#463](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/463) remains OPEN, head `b348b0f92daab610448312aea26cb99fcc27b036`, base `6ef4960fca292b8e5bfa296bebb75f32fe6b1a7f`.
- Initial run [42526972593](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42526972593) failed at the Hangul expected-token assertion. A first intermediate fix corrected only one of two identical regex sites; the subsequent push cancelled that intermediate run. The current PR head corrects both regex sites and adds a zero-row diagnostic guard.
- On current head, tests [42576636915](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42576636915), system verify [42576636817](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42576636817), master artifacts [42576636900](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42576636900), exhaustive test-case register [42576636656](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42576636656), and external UGTPHON [42576636664](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42576636664) all passed.
- Corrected multi-engine workflow [42576636761](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42576636761) remains **IN_PROGRESS** in its ten-engine comparison step. The Browser-mode and open Korean matrix (Seoul/K-SPAN/IPA-Dict) steps have not yet run. CharsiuG2P and ByT5 inference jobs are SKIPPED by default.
- PR [#462](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/462) remains OPEN but is superseded in scope by #463. Do not merge it redundantly. After #463 is accepted, close #462 as superseded.

### Verification correction on main

Main commit `92ed43866aad08aaa1d5a81134d9935456e98bd5` exposed one stale documentation-contract test: it expected the old phrase `Five-dataset execution policy` after the benchmark register had correctly distinguished the long-term corpus portfolio from the executable matrix. The test was updated to assert the new headings and dataset scope. On `00304f9ee8f2cb219d83c04e5179aa16eae71e99`, the full test matrix passed with 1,428/1,428 browser tests and all four push workflows passed. This is a test-contract update, not a runtime behavior change.

### Remaining acceptance and stop condition

| Task | State | Required acceptance |
|---|---|---|
| Documentation navigation, contribution guidance and workflow map | DONE_VERIFIED on pre-handoff main | Exact-main test, system verify, master artifacts and Pages all PASS. |
| Five-dataset benchmark PR #463 | PARTIAL / IN_PROGRESS | Corrected multi-engine job must finish; steps 19–21 must run; all five dataset reports and mode-availability assertions must pass; aggregate-only artifact and schema checks must be present. |
| PR #462 | DEFERRED pending #463 | Close as superseded only after #463 is merged. |
| KsponSpeech and NIKL Daily Conversation speech data | BLOCKED / ACCESS-TERMS GATED | Authorized acquisition and exact redistribution/reuse terms. NIKL MKUFS2 index use for K-SPAN joins does not clear speech-corpus access. |
| Neural CharsiuG2P / ByT5 inference | DEFERRED | Explicit research run, model/data licence review, overlap audit and actual inference. |
| Research/release certification | BLOCKED / PARTIAL | Independent Korean phonetics review, phone-inventory adjudication, holdout/training overlap review, Ukrainian target gold and outstanding source-rights decisions. |

No merge, release publication or branch deletion has been performed in this continuation. The next action is to wait for the corrected run [42576636761](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42576636761), inspect its exact artifacts and gate results, then merge #463 only if every required step passes. The repository remains an evidence-scoped research prototype, not independently research-certified or release-ready.

## 2026-11-09 continuation — K-SPAN checksum correction and benchmark rerun

### Exact source correction

- The previous K-SPAN CI attempt successfully downloaded the version 2.1 Dataverse bundle and verified `kspan_base.csv`, but rejected `kspan_doc.pdf`.
- The rejection was caused by an incorrect expected checksum in the benchmark script, not by a corrupt archive or a reason to weaken integrity validation. The script expected `2bf63cc0704a2fe3b4c40445192af77a`; the official DataverseNO file page for `kspan_doc.pdf` (file ID 1009, dataset version 2.1) publishes `2bf63cc0704a2fe3b4c40445192af77f`. The downloaded PDF's actual MD5 is the latter, with a PDF signature and 738,354 bytes.
- Corrected `scripts/run_open_korean_benchmark_ci.py` to the repository-published MD5 `2bf63cc0704a2fe3b4c40445192af77f`. CSV and PDF are still extracted from the same pinned Dataverse v2.1 bundle and both checksums remain enforced.
- Added earlier in the same PR branch: a bundle-extraction helper and tests for exact file selection and ambiguous duplicate filenames.

### Exact-head verification

- Benchmark PR #463 head: `72bcb727d7c8ddf2ddd359f0d3abc4f3056d4ef6`.
- Tests [42584666555](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42584666555) — PASS.
- System verification [42584666728](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42584666728) — PASS.
- Exhaustive test-case register [42584666813](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42584666813) — PASS.
- External UGTPHON diagnostic [42584666591](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42584666591) — PASS.
- Master/research artifacts [42584666655](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42584666655) — PASS.
- Multi-engine diagnostic [42584666543](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42584666543) is still IN_PROGRESS in step 13, “Run multi-engine comparison”; no failure is recorded. The remaining UGTPHON/SIGMORPHON Browser steps and the open Seoul/K-SPAN/IPA-Dict matrix are downstream and have not yet run on this exact head.
- The prior run [42582634269](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42582634269) completed the ten-engine UGTPHON and SIGMORPHON runs, Browser three-mode audits and parity checks, but its open-matrix step failed solely on the erroneous PDF checksum above. Do not treat its open-matrix dataset reports as completed.

### Current disposition

- Main remains at `4778ac435a4be54c4e7e7b73605369ff5f85677a`; this continuation record does not change runtime code.
- PR #463 remains OPEN and mergeable, but is not ready to merge until the exact-head multi-engine job, all downstream open-matrix steps, artifact upload and schema validation pass.
- PR #462 remains OPEN and superseded in scope; leave it untouched until #463 passes and is merged.
- No benchmark metric, dataset accuracy result or release certification is inferred from the checksum correction.


## 2026-11-09 continuation — NIKL word-index encoding failure and correction

### Failure evidence

- Exact-head full-matrix run [42584666543](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42584666543) completed the UGTPHON and SIGMORPHON ten-engine comparisons, UGTPHON Browser modes and Native/Browser parity, and SIGMORPHON Browser modes and regression suite.
- Its open Korean matrix step failed in `scripts/prepare_korean_open_benchmarks.py::_read_nikl_word_index`: the official `MKUFS2/일반어휘통계.txt` payload could not be decoded as CP949/EUC-KR/UTF-8. K-SPAN's CSV/PDF download and checksums had already passed; the failure occurred before NIKL WordNum joins and the supplemental track benchmarks.
- This was a decoder coverage defect. The script had no UTF-16/UTF-32 support and did not distinguish a successful byte decode from a valid numbered NIKL word index.

### Implemented correction on PR #463

- Added a dedicated decoder that detects UTF-32, UTF-8 BOM, UTF-16 BOM and BOM-less UTF-16 byte patterns, then tries CP949/EUC-KR/UTF-8 fallback encodings.
- A candidate encoding is accepted only if it yields numbered word records; lossy replacement decoding is not used. If all candidates fail, the exception reports the attempted encodings and why each candidate was rejected.
- Added regression coverage for UTF-16LE, UTF-16BE, BOM-marked UTF-16 and invalid binary input. Existing CP949 fixture and full K-SPAN WordNum/Worldbet mapping tests remain.
- PR #463 head after correction: `cded13adb593b510ffa63c05c0a0822d56c0e7ba`. The PR description records the incident and exact fix.

### Exact-head verification

- Tests [42591114502](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591114502) — PASS, including Python 3.11/3.12/3.13, browser suite, wheel install and teacher-corpus audit.
- System verification [42591114507](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591114507) — PASS, Python regression/data integrity and browser regression/build.
- Test-case register [42591114602](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591114602) — PASS.
- External UGTPHON [42591114484](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591114484) — PASS.
- Master/research artifacts [42591114301](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591114301) — PASS.
- Full multi-engine workflow [42591114417](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591114417) is currently IN_PROGRESS at step 13, “Run multi-engine comparison”. The NIKL decoder and supplemental Seoul/K-SPAN/IPA-Dict matrix have not yet been exercised on this corrected head. Do not claim the open matrix passed until steps 21 and 22 complete and the uploaded summary passes schema validation.

### Current disposition

- Main at the time of this update: `fc153c295689f57027320263c1a84b12bcb9e7a4`; this handoff update is documentation-only.
- PR #463 remains OPEN and mergeable; do not merge before the exact-head full matrix and artifact checks pass.
- PR #462 remains OPEN and superseded in scope; close it only after #463 is successfully merged.
- The decoder now covers the observed class of encoding failure, but no implementation can guarantee zero failures for every future upstream change or network/runtime condition. CI remains the acceptance gate; a decode that cannot be validated must fail with a diagnostic rather than silently corrupt source words.


---

## 2026-11-09 — documentation/navigation reconciliation and benchmark handoff

**Audited base:** `45a02a62ce955c3db10eb0faaaa1ce8d9f2c9cdb` on `main`.  
**Working branch:** `docs/repository-navigation-reconciliation-2026-11-09`, created from that exact base for this documentation continuation.  
**Scope:** update existing documentation and navigation in place; do not change runtime rules, benchmark data, source labels or dataset contents.

### Work completed in this continuation

- Reconciled the root README, documentation map, repository structure guide, repository audit and this handoff with the live GitHub state.
- Rechecked all four supplied workflow-reference repositories. Their current default-branch HEADs still match the pinned revisions in the existing comparison audit; no upstream material was copied.
- Retrieved exact PR #463 and #462 metadata, compared the benchmark branch against main, and inspected failing workflow logs rather than relying on stale status prose.
- Recorded the actual current-main workflow results and distinguished them from PR benchmark checks and skipped jobs.

### Current verified evidence

- Main Tests [42591577770](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591577770): PASS.
- Main System Verify [42591577711](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591577711): PASS.
- Main master/research artifacts [42591577812](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591577812): PASS.
- Main Pages deployment/live smoke [42591577865](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42591577865): PASS.
- PR #463 head is `167c12a7e9945dc757a57ea734e9745aa69032f3`; the branch comparison is 91 ahead / 24 behind main from merge base `6ef4960fca292b8e5bfa296bebb75f32fe6b1a7f`. GitHub branch search returned 31 refs total (main plus 30 non-main); historical refs were not deleted or force-updated.
- Documentation-branch Verify [42677866941](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42677866941) initially failed one browser contract because the structure guide had not yet been updated; the structure-guide correction is in commit `f9da74a5e29c517324170f4616f1c097873ad701`.
- Follow-up Verify [42677948776](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42677948776) passed Python but failed the same documentation contract because the handoff did not yet include the exact #463 head. This update adds that missing reference; the next exact-head run is pending.
- PR #463 Verify [42665749636](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42665749636): Python FAILED; Browser PASS; NIKL metadata-only SKIPPED.
- PR #463 full matrix [42665749678](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42665749678): adapter tests FAILED; later engine/browser/open-matrix stages SKIPPED.
- Local npm/pytest/build commands were not run because this continuation used GitHub connector operations and did not have a local checkout. Do not report local verification.

### Exact blockers

1. Correct the literal two-character CSV delimiter in `tests/test_korean_open_benchmarks.py::test_kspan_key_worldbet_mismatch_is_rejected` to a one-character tab delimiter; acceptance: focused test passes and the intended key/WorldBet mismatch is rejected.
2. Align the `test_nikl_word_index_and_kspan_worldbet_integrity` fixture with the corrected IPA mapping (`kijɐk`); acceptance: fixture agrees with the documented adapter mapping and the full 63,836-row source integrity check remains strict.
3. Rerun the complete adapter tests and exact-head Verify.
4. Rerun the full five-dataset benchmark; require all intended UGTPHON, SIGMORPHON, Seoul, K-SPAN Modern/Conservative and IPA-Dict stages, complete joins, source integrity, Browser modes where applicable, aggregate-only artifact and JSON Schema validation.
5. Reconcile the 24 main-only commits / 13 changed paths with the benchmark branch after its tests pass. The current PR branch is 91 ahead / 24 behind and GitHub reports it dirty; no blind merge is acceptable.
6. Leave PR #462 open until #463 is accepted; then close it as superseded if its only remaining scope is duplicated.

### Task ledger

| Area | State | Next acceptance |
|---|---|---|
| Mainline software CI | DONE_VERIFIED | Already green on audited main SHA. |
| Documentation/navigation update | DONE_VERIFIED | Exact-head CI on this documentation branch must pass. |
| Four workflow-reference snapshots | DONE_VERIFIED | Current upstream HEADs match pinned commits; process-only adoption. |
| Five-dataset benchmark | PARTIAL | Repair two tests and pass the complete exact-head matrix. |
| Main/PR branch reconciliation | TODO | Resolve all 10 main-only paths after benchmark code is green; rerun checks. |
| Independent Korean IPA review | BLOCKED | Qualified independent review required. |
| Independent Ukrainian target review | BLOCKED | Frozen IPA and separate receiving-language review required. |
| Historical 236/239 membership proof | PARTIAL | Original contemporaneous selector evidence is still absent. |
| Raw `ㅠ` span validation | BLOCKED | Raw offsets must be verified. |
| KsponSpeech / NIKL 2022 | BLOCKED | Access and licensing terms unresolved. |
| Optional neural inference | DEFERRED | Default-off policy remains in force. |

### Stop condition and readiness

This documentation pass is not a benchmark completion and does not authorize merging PR #463. The repository remains a software-verified, evidence-scoped research prototype, not release-ready or independently research-certified. Documentation branch head `db61448373dd179ced0c61332a9bdf0ca53f96a3` passed its PR-head checks and was merged into `main` as `d2699911dbc70ef9978e5af06643b1281725a71a` (PR #464). Post-merge main workflows are tracked separately in the closure record above.



## 2026-11-09 continuation — PR #465 controlled five-dataset benchmark port

### Execution checkpoint

- Current default branch: `main` at `920b6365539058b658348855c5daddc066558b15`.
- Working branch: `benchmark/five-dataset-matrix-reconciled-2026-11-09`.
- Current exact head: `253b0757f2043d9acf2ccaf191ce676e1161ee2d`.
- PR [#465](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/465): OPEN, mergeable, 9 commits ahead / 0 behind main.
- The branch ports the selected five-dataset benchmark work onto current main; it does not rewrite main directly. PR #463 remains open as the older divergent implementation; #462 remains open and untouched.

### Completed and verified

- K-SPAN 2.1 mapping aligned against the official PDF Table 1; `o → e`, `p → E`, `x → th`, `m → ix`, `j → ˆ`, `u → jˆ`, and the additional `wi` WorldBet sequence is versioned in `kspan-worldbet-to-ipa-v2`.
- CSV delimiter and adapter fixture defects repaired; tests now pass on the exact PR head.
- Exact-head Tests [42692169587](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169587): PASS.
- Exact-head System Verify [42692169687](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169687): Python and Browser PASS; NIKL metadata-only SKIPPED.
- Master/research artifacts [42692169326](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169326): PASS.
- Exhaustive test-case register extraction [42692169308](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169308): PASS.
- External UGTPHON diagnostic [42692169248](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169248): PASS.
- Full matrix [42692169459](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42692169459): UGTPHON multi-engine, Native/Browser parity, SIGMORPHON multi-engine, Browser Strict/Soft/Super-soft and Browser regression stages PASS. Seoul + K-SPAN + IPA-Dict stage remains IN_PROGRESS; final artifact/schema validation is not yet evidenced.

### K-SPAN data quality warning

The 63,836-row K-SPAN source join reports 22,843 key/WorldBet discrepancies (Modern 13,078; Conservative 9,765). The adapter scores the source `ModernPhon` / `ConservativePhon` WorldBet references directly and audits `ModernKey` / `ConservativeKey` separately. These rows are retained and the discrepancy is surfaced as WARN; do not claim key/WorldBet integrity PASS or semantic equivalence. Unknown symbols, invalid WorldBet sequences, missing joins and row-count drift remain hard failures. Aggregate-only artifacts retain warning status and counts while omitting row-level examples.

### Remaining acceptance

1. Complete run 42692169459. Require successful Seoul surface and phonemic tracks, K-SPAN Modern and Conservative, IPA-Dict, full joins and expected row counts.
2. Inspect aggregate-only JSON artifact; verify no token-level labels/examples leak and the summary JSON Schema validates.
3. Confirm warning counts/status in manifest and summary (22,843 total; Modern 13,078; Conservative 9,765).
4. Run/review all exact-head checks after any final fix.
5. Only then merge PR #465. After successful merge, close #463 as superseded if it contains no unique required scope; decide #462 on its remaining unique scope rather than merging duplicate changes.
6. Keep independent Korean IPA review, Ukrainian target review, 236/239 historical membership proof, raw `ㅠ` span validation and access/terms-gated speech corpora as separate research blockers.

### Readiness

The repository remains a software-verified, evidence-scoped research prototype, not independently research-certified or release-ready. No local shell/npm/pytest execution is claimed in this connector-only session; the named GitHub Actions runs are the verification evidence.



---

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

# Execution continuation — 2026-11-10 (PR #465 current state)

## Starting point and branch

- Main base: `920b6365539058b658348855c5daddc066558b15`.
- Working branch: `benchmark/five-dataset-matrix-reconciled-2026-11-09`.
- Starting branch HEAD for this continuation: `d71ef50fdef34c86ad864adc10a50ba45d722ecf`.
- PR #465 remains OPEN and mergeable; no changes have been merged into `main`.
- PR #463 and #462 remain open and untouched pending acceptance and unique-scope review.

## Verified implementation and evidence

- K-SPAN 2.1 mapping is implemented as `kspan-worldbet-to-ipa-v2`. The formerly failing WorldBet sequence `wi` is mapped to `wi`; tests cover `wi` and `kanixnkwi`.
- The pinned K-SPAN join has 63,836 rows and 22,843 parallel key/WorldBet discrepancies (Modern 13,078; Conservative 9,765). Source WorldBet fields drive scoring; key fields remain a separate audit. Status is WARN, not PASS.
- The prior matrix failure on `baa77f9` was WordNum 98 / ModernPhon `kanixnkwi`, failing at offset 7 on `wi`. The correction is present on runtime/test head `c42b7f9`.
- On PR head `d71ef50f`: Tests [42775887452](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887452) PASS; System Verify [42775887811](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887811) PASS (NIKL metadata-only SKIPPED); master/research artifacts [42775887930](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887930) PASS; exhaustive register extraction [42775887402](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887402) PASS; external UGTPHON [42775887380](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887380) PASS.
- The d71 multi-engine run [42775887397](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775887397) was CANCELLED, not passed. The c42 multi-engine run [42775642949](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42775642949) was IN_PROGRESS at the last inspection. Its final result, artifact and schema must be checked before merge.

## Task ledger

| Workstream | State | Next acceptance |
|---|---|---|
| Documentation/navigation foundation from PR #464 | DONE_VERIFIED | Preserved; no duplicate navigation framework added |
| Five-dataset benchmark adapters and preparation | PARTIAL | Complete full open-dataset matrix |
| K-SPAN source consistency | PARTIAL / WARN | Preserve all source rows; independently interpret key/WorldBet discrepancies |
| Aggregate summary/schema | TODO / PENDING | Inspect final artifact and validate schema |
| Python Super-soft fallback parity | TODO | Implement and test provenance-preserving parity |
| Independent Korean IPA and Ukrainian target review | BLOCKED | Qualified independent reviewers and frozen review packets |
| Historical membership and raw offset questions | PARTIAL / BLOCKED | Recover contemporaneous source evidence and verify offsets |
| Restricted speech datasets | BLOCKED | Obtain explicit access/licence terms |
| Neural inference | DEFERRED | Remains opt-in and outside default gate |

## Branch/PR disposition

PR #465 is the controlled port based on current main and remains the only active integration path for this benchmark. PR #463 is an older divergent implementation; do not merge it blindly. PR #462 is a narrower overlapping Browser change; preserve it until its unique scope is reviewed. Do not close or delete branches as cleanup without confirming all unique changes are represented.

## Commands and verification actually executed

No local shell, npm or pytest command was run in this connector-only session. Verification evidence consists of the named GitHub Actions workflows. Cancelled/skipped jobs are not counted as passes; NIKL metadata-only is intentionally skipped by workflow policy.

## Readiness and next blocker

The repository remains a software-verified, evidence-scoped research prototype, not release-ready or independently research-certified. The immediate engineering blocker is a successful completed full matrix and aggregate JSON Schema validation on the final runtime/test head. Independent linguistic review and separate source/access blockers remain after that gate.



## Execution continuation — 2026-11-10 (five-dataset matrix and artifact policy)

### Verified baseline and exact checks

- Starting default branch: `main` at `920b6365539058b658348855c5daddc066558b15`.
- Working branch: `benchmark/five-dataset-matrix-reconciled-2026-11-09`; active PR [#465](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/465).
- Full scoring matrix completed in [run 42785083152](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42785083152): UGTPHON, SIGMORPHON, Seoul phonemic IPA, K-SPAN Modern, K-SPAN Conservative and IPA-Dict were compared by ten engines; fifteen Browser reports cover five datasets. Seoul's six full-corpus Browser reports are separately evidenced by run 42496539257.
- Exact-head standard checks: Python 3.11/3.12/3.13 + Browser + wheel + teacher audit PASS (42796414347); System Verify PASS (42796413910); master/research artifacts PASS (42796414305); exhaustive register extraction PASS (42796414508); UGTPHON diagnostic PASS (42796413990).
- Exact-head aggregate-only workflow integration is still running in 42796414336 at the time of this handoff. It must complete, and its artifact must be inspected, before marking the artifact policy DONE_VERIFIED.

### Source and score interpretation

- K-SPAN source join: 63,836/63,836 WordNum rows; 41,174 Hangul, 22,662 non-Hangul, zero unmatched.
- K-SPAN cross-representation integrity remains WARN: 22,843 mismatches (Modern 13,078; Conservative 9,765). Score from source WorldBet fields; audit parallel key fields; never rewrite or drop rows.
- Highest open-track Exact: Seoul IPA 21.2% KoG2P; K-SPAN Modern 25.0% KoG2P; K-SPAN Conservative 18.8% KoG2P; IPA-Dict 41.265% Native (411/996). These are separate diagnostic references, not a shared leaderboard.
- Super-soft candidate availability is 100% across the five Browser-tested datasets; heuristic/fallback outputs do not count as source-resolved IPA accuracy.
- SIGMORPHON and IPA-Dict share Wiktionary lineage; IPA-Dict is not an independent holdout.
- Optional ByT5/CharsiuG2P inference and NIKL metadata-only inventory were skipped, not passed.

### Artifact policy correction

Inspection found three legacy consolidated-workflow artifacts with row-level reports and/or source TSV/reviewer material: 13621335293 (expires 2026-12-08), 13749341395 (expires 2026-12-10; also contains the raw K-SPAN preparation manifest with ten examples), and 13750158865 (expires 2026-12-10). The current GitHub integration can list/download but cannot delete artifacts. The workflow now builds a combined aggregate-only summary and restricts the new artifact to that JSON plus source checksums. Manual deletion or automatic expiry is required for legacy artifacts; see `docs/BENCHMARK-ARTIFACT-POLICY.md`.

### Task ledger

| Task | Status | Evidence / blocker |
|---|---|---|
| Six-track ten-engine scoring | DONE_VERIFIED | Run 42785083152 |
| Fifteen Browser reports across five datasets | DONE_VERIFIED | Run 42785083152 |
| Seoul full-corpus Browser surface/phonemic modes | DONE_VERIFIED | Run 42496539257 |
| K-SPAN complete source join | DONE_VERIFIED | Run 42785083152; zero unmatched WordNums |
| K-SPAN key/WorldBet consistency | WARN | 22,843 source cross-representation differences remain |
| Aggregate-only workflow integration | PARTIAL | Run 42796414336 must finish and artifact ZIP must contain exactly two allowed files |
| SIGMORPHON source registry + license parser extension | PARTIAL | New 239-row register and rights tests await exact-head CI |
| Independent Korean IPA gold | BLOCKED | No independent adjudicated source gold |
| Independent Ukrainian target gold | BLOCKED | No separately reviewed target layer |
| Historical 236/239 selector and raw ㅠ offsets | BLOCKED | Original audio/speaker crosswalk and raw offset evidence absent |
| KsponSpeech / NIKL Daily Conversation | BLOCKED | Access/terms evidence unavailable |
| Optional neural inference | DEFERRED | Explicitly skipped; not needed for deterministic matrix |

### Branch reconciliation

- PR #465 is the controlled port onto current main; it includes the implementation and tests from the older matrix work.
- PR #463's twelve changed paths are represented in PR #465; its older branch is not merged blindly.
- PR #462's SIGMORPHON three-mode workflow behavior is represented in PR #465 with the corrected 999 eligible-occurrence denominator; its stale denominator/trigger differences are not reused.
- Preserve both old branches until PR #465 is merged; then close the superseded PRs without deleting their branches.

**Readiness:** the deterministic benchmark suite is software-verified research infrastructure, not a release-ready phonetic product. Independent linguistic validation and the artifact-policy integration gate remain separate acceptance conditions.


## Execution handoff — 2026-11-10 final integration on main

### Starting state and integration

- Starting default branch: `main` at `920b6365539058b658348855c5daddc066558b15`.
- User-selected integration policy: one active branch, `main`; no new task branch was created by this continuation.
- PR #465 was reviewed and merged into main from exact tested head `18bafbe9d998f7fe818c9b65ec84d3b5098d6dfa`.
- Merge commit: `e8ebed5b9ccb67255209ccb20efa45ae0236bcbe`.
- The older PR #463 branch was divergent and stale; its intended implementation was ported onto current main in #465. PR #462's narrower Browser three-mode verification is included in #465. Close #463 and #462 as superseded; preserve their branches.

### Exact commands and results

The full matrix workflow [42810042908](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42810042908) completed successfully. Its job steps report PASS for source/engine pin and licence checks, adapter tests, training-readiness audit, reviewer packet generation, ten-engine comparisons, UGTPHON and SIGMORPHON Browser modes, Native/Browser parity, Seoul/K-SPAN/IPA-Dict matrix, aggregate summary and upload.

Other exact PR-head runs:
- Tests / Python 3.11, 3.12, 3.13 / Browser / wheel install / teacher corpus: [42810042726](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42810042726) — PASS.
- System Verify: [42810042823](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42810042823) — PASS.
- Master/research artifacts: [42810042775](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42810042775) — PASS.
- Exhaustive test-case register: [42810043038](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42810043038) — PASS.
- External UGTPHON diagnostic: [42810042906](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42810042906) — PASS.

These are GitHub Actions checks on PR head, not local shell/npm/pytest runs and not post-merge-main evidence. The connector-only environment did not provide a local repository checkout; no local test command is claimed. Post-merge/final-documentation exact-main CI remains the next software verification gate.

### Benchmark evidence

- Six ten-engine tracks: UGTPHON, SIGMORPHON 2021, Seoul phonemic IPA, K-SPAN Modern, K-SPAN Conservative, IPA-Dict Korean.
- Fifteen Browser reports: Strict/Soft/Super-soft on UGTPHON, SIGMORPHON, K-SPAN Modern, K-SPAN Conservative and IPA-Dict.
- Seoul full-corpus Browser Hangul surface and phonemic-IPA reports remain separately evidenced by run 42496539257.
- K-SPAN 63,836 rows; 41,174 Hangul and 22,662 non-Hangul; zero unmatched WordNums.
- K-SPAN key/WorldBet differences remain WARN: 22,843 total (Modern 13,078; Conservative 9,765).
- One external g2p-ko error on IPA-Dict (999/1,000 scored); Browser errors zero.
- Super-soft candidate availability 100% on five Browser-tested dataset tracks; not an accuracy or source-resolved coverage claim.
- IPA-Dict shares Wiktionary lineage with SIGMORPHON; Seoul labels are phonemic, not narrow phonetic IPA.

### Artifact verification

Artifact 13766007256 was downloaded and inspected. It contains exactly two files: aggregate JSON (293,134 bytes) and source checksum list (410 bytes). It contains no token-level source text, IPA labels, mismatch examples or occurrence ledgers. Schema validation passed during summary generation. ZIP SHA-256: `fa3281b337b60fccbf3ebc03796498325619138e2393ba54ddc9513c8d9598a3`.

Legacy artifacts 13621335293, 13749341395 and 13750158865 still contain older row-level materials and remain until expiry/manual cleanup. The connector has no delete-artifact action; do not claim they were deleted. See `docs/BENCHMARK-ARTIFACT-POLICY.md`.

### Final task ledger

| Task | Status | Acceptance / blocker |
|---|---|---|
| Four upstream methodology review | DONE_VERIFIED | Current upstream HEADs rechecked; unchanged from reviewed pins. |
| Existing documentation/skills/navigation reconciliation | DONE_VERIFIED | Root README, docs index, structure guide, audit, handoff, benchmark dashboard and acceptance/roadmap updated in place. |
| Five-dataset scoring matrix | DONE_VERIFIED | PR #465 merged; full exact-head run 42810042908. |
| Aggregate-only artifact policy | DONE_VERIFIED | Artifact 13766007256 inspected; exactly two allowed files. |
| Final post-merge main CI | TODO / PENDING | Exact-main checks must pass after final documentation commit. |
| K-SPAN representation mismatch | WARN | 22,843 differences remain; independent linguistic interpretation needed. |
| Independent Korean IPA review | BLOCKED | Independent qualified annotations/adjudication absent. |
| Ukrainian target gold/review | BLOCKED | Separate target-language review absent. |
| 236/239 historical membership and raw ㅠ offsets | BLOCKED / PARTIAL | Original historical selector/run and raw offsets absent. |
| KsponSpeech/NIKL speech corpus | BLOCKED | Authorized access and corpus-specific reuse terms absent. |
| Neural inference | DEFERRED | Optional, skipped by policy; not needed for deterministic benchmark completion. |
| Legacy artifact cleanup | BLOCKED | Manual GitHub owner action or expiry; integration cannot delete. |

**Next action:** close PR #463 and #462 as superseded while retaining branches, then verify post-merge and final documentation commits on main. If those checks pass, the software benchmark integration is complete; the product remains a research prototype pending independent linguistic and rights acceptance.

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


## PR #467 — Korean editorial workbench merged and published — 2026-11-11

- **PR:** [#467](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/467), merged.
- **Pre-merge branch head:** `03d01929c69d7a1f33b61bd73cce8399827f42d7`.
- **Merge commit on main:** `a8049db0a26dbe5db5dd599e2b7cff7e8b0ab3fc`; base before merge `37c922935b30ca5f46a4f5d37bd5e435f3c28cb6`.
- **Public site:** https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/
- **Deployment and live verification:** mainline Pages run [42973501632](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973501632) **PASS**. Python 3.11/3.12/3.13 checks, browser regression/build, Pages deployment, public page smoke and adversarial live browser smoke all passed.
- **Live browser smoke evidence:** 1,443 Korean input characters; inline candidate 2,982 characters; IPA output 3,731 characters. The smoke also verified deterministic Hanja dictionary loading/output, live result announcement, mode disclosure, clipboard-denial fallback, mobile trace labels at 390 px and methodology navigation. Final status was explicitly a preliminary candidate, not a confirmed result.
- **Exact pre-merge verification:** [Tests 42973176920](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973176920) **PASS** (1,440/1,440); [Verify 42973176929](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973176929) **PASS**; [Browser G2P 42973176957](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973176957) **PASS**; [master/research artifacts 42973177011](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973177011) **PASS**; [exhaustive register 42973176965](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973176965) **PASS**; [visual review 42973177099](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42973177099) **PASS**, artifact `13834655772`.
- **Visual QA:** both pages captured at 1440, 1024, 768, 390 and 320 px; no horizontal overflow; keyboard focus, reduced motion and touch-target checks passed. Desktop and mobile captures were inspected.
- **Design and copy:** dedicated editorial stylesheet, jogakbo/bojagi modular composition, real Hangul → IPA → Ukrainian specimen, paper/ink/cobalt palette, restrained signal colors, long-form methodology reading surface and Ukrainian technical labels. No runtime dependency, JS engine or mode change.
- **Skills applied:** taste-skill, Anthropic frontend-design, Impeccable, Emil Kowalski skills, unlazy, Superpowers, Matt Pocock skills and Ponytail. Skill guidance, source references and execution limitations are documented in the design brief.
- **Skipped, not passed:** NIKL metadata-only inventory remains skipped by configured policy; optional neural inference was not required for this visual task.
- **Environment note:** no local npm/Playwright run is claimed. GitHub Actions and inspected browser artifacts are the verification evidence.

**Design task status: DONE_VERIFIED.** There is no remaining design-specific blocker. Independent Korean pronunciation and Ukrainian transcription validation remain separate research requirements; this visual redesign does not claim linguistic certification.


## PR #468 — Korean editorial rationale and final usability pass — 2026-11-11

- **PR:** [#468](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/468), merged.
- **Pre-merge exact head:** ef7333ecd6ae7bd1e6289b018f75647f9c74f04b; **merge commit:** 2d56d5a5d4ccdabc53b503bea5891c4f14c3ac47; previous main 70ce6a57e87d87b3a75cc417df296dd19054a8e7.
- **Public site:** https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/
- **User-facing refinements:** methodology page explains the jogakbo-inspired composition in Ukrainian as plain editorial copy; the Korean textarea has no placeholder; all fixed-size editorial type is at least 13px. The explanation has no callout-card background or coloured side rail.
- **Design contract:** tests cover the no-placeholder input, 13px minimum and non-card rationale treatment. No conversion engine, modes, linguistic data, CSP or runtime dependencies changed.
- **Exact pre-merge checks:** Tests [42976476837](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976476837) **PASS** (1,444/1,444; Python 3.11/3.12/3.13, teacher-corpus audit, clean wheel); Verify [42976476750](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976476750) **PASS**; Browser G2P [42976476744](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976476744) **PASS**; master/research artifacts [42976476728](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976476728) **PASS**; exhaustive register [42976476794](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976476794) **PASS**; rendered visual review [42976476724](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976476724) **PASS**, artifact 13835153662.
- **Mainline exact-merge verification:** Tests [42976784058](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976784058) **PASS** (1,444/1,444; Python 3.11/3.12/3.13, teacher-corpus audit, wheel install); Verify [42976783959](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976783959) **PASS**; master/research artifacts [42976784010](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976784010) **PASS**.
- **Pages deployment:** [42976783914](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42976783914) **PASS** — Python 3.11/3.12/3.13, browser regression/build, public Pages deployment and public-page smoke all passed. Live practical-mode adversarial browser smoke also **PASS**: 1,443 Korean input characters; candidate 2,982 characters; IPA 3,731 characters; final status explicitly identifies a preliminary candidate, not a confirmed result.
- **Visual QA:** service and methodology captures at 1440, 1024, 768, 390 and 320 px; no horizontal overflow. Desktop, mobile and methodology hero were inspected. Focus, reduced-motion and touch-target checks are covered by the visual workflow.
- **Evidence limits:** NIKL metadata-only inventory remains **SKIPPED** by configured policy, not passed. No local npm/pytest execution is claimed; GitHub Actions and captured browser artifacts are the verification evidence.
- **Skills applied:** taste-skill, Anthropic frontend-design, Impeccable (Operate/Read modes and craft floor), Emil Kowalski's animation guidance, Superpowers TDD/systematic debugging, plus the previously applied unlazy, Matt Pocock and Ponytail workflows. No decorative animation was added because it would not improve this frequently used tool. Impeccable's local launcher was unavailable in the connector-only runtime; its references were read directly and the rendered captures were inspected.

**Design task status: DONE_VERIFIED and published.** No design-specific blocker remains. Independent Korean pronunciation and Ukrainian target gold-data review remain separate research acceptance requirements.


## 2026-11-11 — approved vertical-flow correction (PR #470)

**Task ledger**

| Requirement | State | Evidence |
|---|---|---|
| One-column hero and Hangul → IPA → Ukrainian specimen | DONE_VERIFIED | Rendered review [42985071214](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42985071214) on desktop, laptop, tablet, mobile and 320 px narrow mobile; post-merge Pages live smoke [42985384175](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42985384175) also passed. |
| Service order: input → mode → action → Ukrainian → IPA → RR → Hanja → analysis → alternatives → trace | DONE_VERIFIED | DOM-order regression and exact-head browser test; the primary action calls the existing renderer while live conversion remains active. |
| Remove object-level header/footer strips throughout both pages | DONE_VERIFIED | Specimen strips, result metadata bars, trace-column band, table header bands, numbered side rails, status chips and disclosure badges removed; zero matching chrome elements in rendered review. |
| Methodology contents and all sections in one vertical reading flow | DONE_VERIFIED | Heading anchors retained inline with headings; contents, sections, evidence lists, vowel inventory and decision rows render top-to-bottom. |
| Responsive layout and focus/reduced-motion behavior | DONE_VERIFIED | Editorial visual review run 42985071214; 10 page/viewport combinations at 1440, 1024, 768, 390 and 320 px. Post-merge live Pages UX smoke also passed at 390 px. No horizontal overflow; focus and reduced-motion checks passed. |
| Full web test suite and production build | DONE_VERIFIED | Post-merge exact-main System Verify run 42985384183: 1,442/1,442 Node tests, Python regression/data integrity, source-rights audit, Vite build and generated-page checks passed. |
| Python, corpus, benchmark-register and browser G2P regressions | DONE_VERIFIED | Post-merge Tests run 42985384248: Python 3.11/3.12/3.13, 1,442/1,442 web tests, wheel install and teacher-corpus audit passed; Browser G2P 42985384335 passed; test-register extraction 42985071471 passed; master/research artifacts 42985384171 passed. |
| Public GitHub Pages deployment and live UX smoke | DONE_VERIFIED | Post-merge deployment run 42985384175 passed HTTP checks for both pages and JS asset, plus live browser smoke for result announcement, mode disclosure, clipboard fallback, mobile trace labels and methodology navigation. |
| Official NIKL live source inventory | DEFERRED / SKIPPED BY POLICY | The workflow's metadata-only inventory job was skipped by its configured branch policy; it is not counted as a pass and is unrelated to this UI correction. |
| Manual screen-reader speech, mode-comprehension study and conversion-latency study | PARTIAL / OUT OF THIS UI CHANGE | Automated semantic labels, focus and responsive checks pass; real assistive-technology speech, participant comprehension and latency measurements remain separate evidence tasks. |

**Repository state:** implementation branch `design/vertical-flow-no-object-chrome-2026-11-11`, based on `main` at `b5f9de943e1d578da33d6fcb7ba7ef7301472d6a`; implementation snapshot `1689da6b0e03130e0f8a38a36498d5755ed8f981`; final PR head `5e6d6dfe77ecde48309b27f3fa50f730815d3b6d`. PR [#470](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/470) was merged as `5cf22096dee9caae74cb9be7643184ec8c8b32d8`. The post-merge Pages deployment and live UX smoke passed. No pronunciation rules, IPA adapter, lexical data or runtime dependencies were changed. No local npm/pytest run is claimed; verification evidence is from GitHub Actions.

**Readiness:** the vertical-flow UI correction is DONE_VERIFIED and published on GitHub Pages. This does not change the repository's broader status as a partial research prototype; independent phonetic/target review and source-rights gates remain separate.


## 2026-11-11 — restore visual character after vertical-flow correction (PR #473)

The first vertical-flow correction met the reading-order and object-chrome requirements but over-flattened the visual system. It removed much of the colour and typographic hierarchy that made the Korean editorial workbench recognisable. PR #473 restores those design cues without reverting the approved layout.

| Requirement | State | Evidence |
|---|---|---|
| Keep all service and methodology content in one vertical reading flow | DONE_VERIFIED | Exact-head rendered review [42988127319](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42988127319) passed desktop, tablet, mobile and narrow-mobile viewports. |
| Keep specimen free of visible object-level labels and top/bottom strips | DONE_VERIFIED | The specimen communicates through Hangul, IPA and Ukrainian typographic hierarchy; visible label strips remain absent. |
| Restore Korean editorial identity and visual hierarchy | DONE_VERIFIED | Cobalt and restrained pink typography, hanji-like surfaces, clear control grouping, methodology accents and stronger section typography restored. |
| Preserve high-contrast actions and accessible touch targets | DONE_VERIFIED | Primary action uses white-on-cobalt; copy controls are at least 44 px high. Rendered review passed. |
| Regression suite and production build | DONE_VERIFIED | Tests [42988127248](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42988127248): 1,443/1,443 web tests, Python 3.11/3.12/3.13, wheel install and teacher-corpus audit passed. System Verify [42988127245](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42988127245) passed browser regression/build and Python regression/data integrity. |
| Master/research artifacts and test-register extraction | DONE_VERIFIED | Runs [42988127246](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42988127246) and [42988127239](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42988127239) passed. |
| Linguistic pipeline, rules and data | UNCHANGED | This is a CSS and UI-contract test correction only; no pronunciation, IPA adapter, lexical data or runtime logic changed. |

**Repository state:** PR [#473](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/473) merged into `main` as `4dd7b600583fbb6f271664087e513d9fb1ce2fd6`. Final tested branch head: `f20f4d25a9a550dc278284f603a8df42fc571835`. No local test execution is claimed; verification is from the exact-head GitHub Actions runs above.

**Readiness:** this specific visual correction is DONE_VERIFIED. The repository remains a partial research prototype overall; this UI fix does not close independent linguistic evidence, source-rights or human-evaluation gates.
