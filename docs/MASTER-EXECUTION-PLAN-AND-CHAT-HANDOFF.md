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

**Current verified benchmark code head:** `536cd44460bbd225fcd76f592bfe6e3077a245a4`. The Seoul workflow [42495867492](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42495867492), artifact `13623272235`, passed archive download, 240/240 TextGrid parsing, Hangul surface benchmark and phonemic-IPA benchmark. It supersedes the initial Seoul artifact's overlapping fallback counters.

The 29 Super-soft typed orthographic-fallback rows were already excluded from source-resolved Exact/CER by the earlier heuristic status branch, so scores did not change. The correction makes the strata mutually exclusive: 38,207 heuristic + 29 typed fallback. Both benchmark scripts now explicitly skip typed fallback before Exact/CER and paired comparisons. Two Node regression tests cover both scorer paths.

- Full tests [42495903258](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42495903258): **PASS** — Python 3.11/3.12/3.13, Web/npm tests and build, wheel installation, teacher-corpus audit.
- System Verify [42495903331](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42495903331): **PASS** — Browser regression/build and Python regression/data integrity. Official NIKL metadata inventory: **SKIPPED**, not passed.
- GitHub Pages deployment [42495903310](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42495903310): **PASS**.
- Final documentation/source-accounting commits now bring `main` to `09efa609368df914b38020b8a74ec7c4a1fb4cd6`; exact-head tests/system/artifact workflows were queued after this docs-only update (runs 42496173562, 42496173554, 42496173617). Do not mark those newest-head checks complete until they finish.

**Remaining gates are unchanged:** independent Korean phonetics review of the Seoul adapter; no Ukrainian target gold for Seoul; KsponSpeech and NIKL 2022 access/terms; independent review of the 236-case cohort; and broader external IPA/target validation. The repository remains a software-verified research prototype, not release-ready.
