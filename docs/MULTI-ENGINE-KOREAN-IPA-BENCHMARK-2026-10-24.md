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
- Deterministic 1,000-replicate row-cluster percentile bootstrap intervals are emitted for exact-match rate and CER. They describe sampling variability on this dataset; they do not correct reference-label errors or annotation-convention mismatch.
- The report includes per-engine status, error samples, paired deltas, confidence intervals, and a capped mismatch sample. The raw external corpus is not committed.

## Results

**Awaiting the completed exact-head workflow artifact.** Populate this section only from the multi-engine-ipa-diagnostic artifact for the final benchmark commit. If a candidate fails to install, lacks the Korean voice, returns no output, or cannot be mapped, report it as blocked/partial; do not turn it into a zero-error score or omit it without explanation.

| Engine | Status | Scored / eligible | Coverage | Exact match | CER | Paired exact-rate delta vs native | Notes |
|---|---|---:|---:|---:|---:|---:|---|
| ClippyFirst native | Pending CI artifact | — | — | — | — | reference | Abstentions reported separately |
| g2pk 0.9.4 | Pending CI artifact | — | — | — | — | — | Shared segment renderer |
| KoG2P 2019 | Pending CI artifact | — | — | — | — | — | Custom-phone IPA adapter |
| hangul_to_ipa 2026 | Pending CI artifact | — | — | — | — | — | Direct IPA; documented process omissions |
| eSpeak NG / phonemizer | Pending CI artifact | — | — | — | — | — | TTS-oriented baseline |
| phonemize 2.0.1 | Pending CI artifact | — | — | — | — | — | Direct IPA |

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
