# Multi-engine Korean-to-IPA diagnostic benchmark (2026-10-24)

## Status

**Implementation committed; execution status is determined only by the exact-head GitHub Actions run and its JSON artifact.** Do not treat a workflow that is queued/in progress, a dependency installation, or a successful test of the harness as a completed benchmark. The measured table below is to be updated from the artifact for the latest head commit; no result is inferred from upstream marketing scores.

- Repository: ClippyFirst/Korean-Ukrainian-Phonetic-System
- Benchmark branch: research/independent-engine-benchmark-2026-10-23
- Existing benchmark PR: [#280](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/280)
- Pinned dataset: [UGTPHON](https://github.com/naver-ai/UGTPHON), commit ef0d5a09c2ea1874c7206020f875cbd9cfea2f54, Korean ko/test.json, 275 rows, Apache-2.0 verified by CI.
- Harness: scripts/benchmark_multi_engine_ko.py
- JavaScript adapter: scripts/benchmark_phonemize_adapter.cjs
- Adapter tests: tests/test_multi_engine_benchmark.py
- Workflow: [Multi-engine Korean IPA diagnostic benchmark](../.github/workflows/multi-engine-ipa-benchmark.yml)

## Why this corpus, and what it cannot prove

UGTPHON is a pinned, reproducible, noisy user-generated Korean text set with IPA annotations. It is useful for a first common-set comparison; it is **not** a normative gold set for all 30 NIKL Standard Pronunciation Rules. The dataset's annotation conventions can differ from the broad IPA conventions of any engine. Therefore exact match and character error rate (CER) are diagnostic measurements, not adjudicated phonetic truth.

This benchmark scores Korean IPA only. It does **not** measure IPA-to-Ukrainian adaptation, readability for Ukrainian users, the correctness of Ukrainian graphemes, or whether the native engine's abstentions are preferable in a safety/research workflow.

## Candidate register

| Candidate | Pinned source / version | Native output | Evaluation adapter | Independence and caveats |
|---|---|---|---|---|
| ClippyFirst native | PR branch's native Python pipeline | IPA plus explicit unresolved status | Public phoneticize_korean() API | System under test. Abstentions remain separate from runtime failures and are not silently scored as guesses. |
| g2pk | g2pk==0.9.4 | Korean surface Hangul | Repository segment IPA renderer only; native phonological rules are not rerun | Already present in PR #280. Shared rendering layer can bias comparison. |
| KoG2P | scarletcho/KoG2P commit cbc69bbe1439862364d4ffd1552f59b930f655c7 | Custom romanized phone labels | Explicit project-side label-to-broad-IPA map derived from upstream's documented symbol table | GPL-3.0; checked out only for the CI run, not copied or vendored. The label mapping is lossy and separately disclosed. Upstream last commit is from 2020. |
| hangul_to_ipa | stannam/hangul_to_ipa commit 942abf132ea969a7e3476a1487c06710fb8db74b | IPA | Direct upstream IPA output, default rule preset pastcnhovr | MIT. Its documented scope excludes several morphology-/extra-phonology-sensitive processes, including N-insertion and liquid tensification. |
| eSpeak NG | Ubuntu 24.04 system package, via phonemizer==3.3.0 | IPA-like output from Korean voice | Direct phonemizer output, stress disabled | TTS-oriented phonemizer baseline, not a claim of narrow-IPA or NIKL authority. CI records the installed eSpeak version and checks for Korean voice availability. |
| phonemize | hans00/phonemize npm 2.0.1 | IPA | Direct phonemize/all output with stripStress=true | MIT. Its published Korean score is based on a small LLM-judged sample, not independent human-gold IPA. |
| Korean Phonetic Database (KPD) | Commercial database; access/license not verified | Large lexical IPA inventory | Not executed | **BLOCKED_ACCESS_AND_TERMS**. No paid data or credentials available in this run; do not scrape, redistribute, or infer its accuracy from the catalogue description. |
| ntdgo/korean-pronunciation | Public Node.js port of g2pK; no license declared in repository metadata | Korean surface Hangul | Not executed as a separate score | Not counted as an independent baseline because it is a g2pK-derived port, overlapping an existing family, and the repository metadata did not declare a license at inspection. |
| korean-eval-jck | Evaluation repository using a modified hangul_to_ipa path | IPA and audio-to-IPA diagnostic | Not executed as a separate score | Not counted as an independent engine because its text converter is based on the already included hangul_to_ipa family; avoid double-counting related implementations. |
| 2022 KoG2P/g2pk research modifications | Published research; executable pinned implementation not verified | Rule-based G2P | Not executed as a distinct binary | **BLOCKED_REPRODUCIBLE_IMPLEMENTATION** until the exact code, version, dependencies, and license can be tied to the paper. Literature claims are not substituted for a run. |

## Scoring contract

- Corpus validation requires 275 unique row IDs, Korean language, test split, and required fields.
- Only single-token Hangul entries with at least one gold IPA variant are scored; eligible token occurrences and unique words are both reported.
- IPA normalization reuses the existing benchmark_ugtphon_ko.normalize_ipa function: Unicode canonicalization, g → ɡ, removal of tie bars and the declared narrow diacritics, spaces and periods removed. Stress, length, aspiration, and fortis diacritics remain.
- Exact match accepts the closest comma-separated gold IPA variant.
- CER is total Levenshtein distance divided by total length of the selected reference variants.
- Coverage is scored token occurrences divided by eligible token occurrences. Native unresolved cases are abstentions, not engine exceptions.
- Paired comparison uses the same occurrence IDs so repeated words in a row do not collapse into a single observation.
- Deterministic 1,000-replicate row-cluster percentile bootstrap intervals are emitted for exact-match rate and CER; paired row-cluster intervals estimate candidate-minus-native deltas. They describe sampling variability on this dataset; they do not correct reference-label errors or annotation-convention mismatch.
- The report includes per-engine status, error samples, paired deltas, confidence intervals, and a capped mismatch sample. The raw external corpus is not committed.

## Results

The corrected multi-engine scoring run [40069738385](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40069738385) completed successfully at scoring-code commit 5b97b80a80c6c49333cc351dc8e4da33b62b05d1. It uploaded artifact [12550429481](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40069738385/artifacts/12550429481). The later changes add tests and print the paired confidence intervals in the workflow log; they do not change the scoring implementation. An exact-head workflow rerun is also tracked separately.

The invalid first-run phonemize result (0 exact, CER 100%) is **excluded**: its adapter returned unchanged Hangul because anyAscii was disabled. The corrected adapter enables anyAscii=true; the subsequent report confirms non-Hangul IPA outputs such as 대 → tɛ, 범 → pʌm, 학교 → hak̚ɡjo, and 삶의 → salmɰi. These examples only smoke-test the adapter, not the linguistic correctness of those particular references.

### Full eligible set

UGTPHON Korean test split: 275 rows, 2,703 eligible token occurrences, 1,907 unique Hangul words. Exact-match and CER confidence intervals are deterministic 1,000-replicate row-cluster percentile bootstrap intervals. CER is lower-is-better.

| Engine | Status / scored tokens | Coverage | Exact match (95% CI) | CER (95% CI) |
|---|---:|---:|---:|---:|
| ClippyFirst native | PARTIAL; 2,653/2,703 | 98.15% | 24.43% (22.14–27.00%) | 17.06% (16.34–17.76%) |
| g2pk 0.9.4 | AVAILABLE; 2,703/2,703 | 100% | **24.97% (22.80–27.38%)** | **16.69% (15.94–17.44%)** |
| KoG2P 2019 | AVAILABLE; 2,703/2,703 | 100% | 14.87% (12.77–17.10%) | 26.08% (25.05–27.13%) |
| hangul_to_ipa 2026 | AVAILABLE; 2,703/2,703 | 100% | 14.95% (12.59–17.18%) | 30.99% (29.70–32.24%) |
| eSpeak NG / phonemizer | AVAILABLE; 2,703/2,703 | 100% | 8.14% (6.37–10.19%) | 39.05% (37.82–40.28%) |
| phonemize 2.0.1 (corrected adapter) | AVAILABLE; 2,703/2,703 | 100% | 20.05% (17.68–22.58%) | 21.36% (20.43–22.23%) |

### Paired comparison against native

The paired analysis uses the same 2,653 occurrences for which the native engine returned a scored IPA result. Deltas are candidate minus native. Positive exact-match delta favours the candidate; negative CER delta favours the candidate. The intervals below are paired 1,000-replicate row-cluster bootstrap intervals; they do not correct for multiple comparisons or gold-label noise.

| Candidate | Paired exact rate | Exact-rate delta (95% CI) | CER delta (95% CI) | Interpretation on this corpus |
|---|---:|---:|---:|---|
| g2pk 0.9.4 | 25.22% vs native 24.43% | **+0.79 pp (+0.45 to +1.19 pp)** | **−0.38 pp (−0.61 to −0.21 pp)** | Small but positive paired difference on UGTPHON; not proof of universal superiority |
| KoG2P 2019 | 15.04% | −9.39 pp (−11.53 to −7.38 pp) | +9.06 pp (+8.16 to +10.02 pp) | Clearly worse under this custom-phone IPA adapter and this gold convention |
| hangul_to_ipa 2026 | 15.19% | −9.23 pp (−10.75 to −7.82 pp) | +13.86 pp (+12.94 to +14.81 pp) | Clearly worse on this corpus; its documented process omissions are relevant |
| eSpeak NG / phonemizer | 8.22% | −16.21 pp (−18.50 to −14.05 pp) | +21.94 pp (+20.92 to +22.97 pp) | TTS-oriented output is a weak match to these IPA annotations |
| phonemize 2.0.1 | 20.35% | −4.11 pp (−5.20 to −3.09 pp) | +4.14 pp (+3.38 to +4.88 pp) | Better than the other new candidates here, but behind native/g2pk |

“pp” means percentage points. The paired candidate exact rates are computed on the 2,653-token common subset; the full-set table above uses each engine's own scored coverage.

### What can and cannot be concluded

- On this particular UGTPHON diagnostic, g2pk 0.9.4 ranks first on exact match and CER, with full coverage. Its paired advantage over native is small but the row-cluster interval excludes zero for both metrics.
- ClippyFirst abstains on 50 items rather than silently guessing. Coverage and abstention behaviour are part of the result, not a defect to erase.
- phonemize 2.0.1 is the strongest of the four newly added external candidates on this set after fixing its adapter, but its 20.05% exact score and 21.36% CER do not establish quality on NIKL's normative rules.
- KoG2P's score depends on a documented but lossy custom-phone-to-IPA mapping. A different mapping or reference convention could change its score; this adapter is not claimed to be a canonical conversion.
- The native engine and g2pk comparison share the repository's segment renderer. This is a limitation and could advantage g2pk relative to a fully independent IPA renderer.
- These results do **not** show that ClippyFirst is the best Korean-to-IPA engine, nor that any competitor is the best overall. They show that the native engine is competitive with the tested alternatives on this corpus, while g2pk is modestly ahead under this evaluation contract.
- No result here evaluates IPA-to-Ukrainian adaptation. A separate NIKL-grounded, independently adjudicated IPA test set and a separate Ukrainian target-layer review remain necessary.

## Interpretation gates

A higher score on UGTPHON does not establish that an engine is best for NIKL standard pronunciation. Before making that claim, the project still needs:

1. A source-grounded NIKL example set with verified article/example provenance.
2. Independent broad-IPA adjudication for the scored items and explicit accepted variants.
3. Per-rule error strata, especially liaison, coda neutralization, aspiration, fortition, nasal/liquid assimilation, palatalization, 의 variants, N-insertion, morphology-sensitive cases, and lexical exceptions.
4. A second evaluation on held-out examples not used to develop rules or choose exceptions.
5. Separate expert review of IPA-to-Ukrainian adaptation and user-facing readability.
6. Review of the current PR against the independent native-engine case PR #281 before merging; both currently touch the canonical handoff, so do not blindly merge either branch.

## Reproduction

The workflow checks out the exact upstream revisions into the ephemeral runner, checks their declared licenses, installs the pinned packages, downloads the pinned UGTPHON test split, runs adapter tests, emits a JSON report, and uploads the report artifact. External engine code and the raw corpus are not added to the project tree.
