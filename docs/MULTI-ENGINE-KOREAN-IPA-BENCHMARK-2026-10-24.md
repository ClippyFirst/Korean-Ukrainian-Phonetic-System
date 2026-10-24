# Multi-engine Korean-to-IPA diagnostic benchmark (2026-10-24)

## Status

**DONE_VERIFIED for two diagnostic datasets and six engines** on code-equivalent benchmark head. Exact-head run: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40089295231 ; artifact: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40089295231/artifacts/12558044694. The full reports and all 48 UGTPHON abstention occurrences and 2 SIGMORPHON abstentions were inspected. The current result section supersedes the earlier score table because the broad-IPA normalization profile was corrected to ignore retraction U+0320.

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
| [KoG2P](https://github.com/scarletcho/KoG2P) | scarletcho/KoG2P commit cbc69bbe1439862364d4ffd1552f59b930f655c7 | Custom romanized phone labels | Explicit project-side label-to-broad-IPA map derived from upstream's documented symbol table | GPL-3.0; checked out only for the CI run, not copied or vendored. The label mapping is lossy and separately disclosed. Upstream last commit is from 2020. |
| [hangul_to_ipa](https://github.com/stannam/hangul_to_ipa) | stannam/hangul_to_ipa commit 942abf132ea969a7e3476a1487c06710fb8db74b | IPA | Direct upstream IPA output, default rule preset pastcnhovr | MIT. Its documented scope excludes several morphology-/extra-phonology-sensitive processes, including N-insertion and liquid tensification. |
| [eSpeak NG](https://github.com/espeak-ng/espeak-ng) | Ubuntu 24.04 system package, via phonemizer==3.3.0 | IPA-like output from Korean voice | Direct phonemizer output, stress disabled | TTS-oriented phonemizer baseline, not a claim of narrow-IPA or NIKL authority. CI records the installed eSpeak version and checks for Korean voice availability. |
| [phonemize](https://github.com/hans00/phonemize) | hans00/phonemize npm 2.0.1 | IPA | Direct phonemize/all output with stripStress=true | MIT. Its published Korean score is based on a small LLM-judged sample, not independent human-gold IPA. |
| [Korean Phonetic Database (KPD)](https://www.cjk.org/data/korean/nlp/korean-phonetic-database/) | Commercial database; access/license not verified | Large lexical IPA inventory | Not executed | **BLOCKED_ACCESS_AND_TERMS**. No paid data or credentials available in this run; do not scrape, redistribute, or infer its accuracy from the catalogue description. |
| [ntdgo/korean-pronunciation](https://github.com/ntdgo/korean-pronunciation) | Public Node.js port of g2pK; no license declared in repository metadata | Korean surface Hangul | Not executed as a separate score | Not counted as an independent baseline because it is a g2pK-derived port, overlapping an existing family, and the repository metadata did not declare a license at inspection. |
| [korean-eval-jck](https://github.com/icig-korean-eval/korean-eval-jck) | Evaluation repository using a modified hangul_to_ipa path | IPA and audio-to-IPA diagnostic | Not executed as a separate score | Not counted as an independent engine because its text converter is based on the already included hangul_to_ipa family; avoid double-counting related implementations. |
| [2022 KoG2P/g2pk research modifications](https://doi.org/10.29403/LI.26.2.2) | Published research; executable pinned implementation not verified | Rule-based G2P | Not executed as a distinct binary | **BLOCKED_REPRODUCIBLE_IMPLEMENTATION** until the exact code, version, dependencies, and license can be tied to the paper. Literature claims are not substituted for a run. |

## Scoring contract

- Corpus validation requires 275 unique row IDs, Korean language, test split, and required fields.
- Only single-token Hangul entries with at least one gold IPA variant are scored; eligible token occurrences and unique words are both reported.
- IPA normalization reuses benchmark_ugtphon_ko.normalize_ipa: Unicode canonicalization, g → ɡ, tie bars and selected narrow diacritics (including retraction U+0320) removed, spaces and periods removed. Stress, length, aspiration, fortis and unreleased-stop markers remain. This profile revision materially changes exact-match/CER values.
- Exact match accepts the closest comma-separated gold IPA variant.
- CER is total Levenshtein distance divided by total length of the selected reference variants.
- Coverage is scored token occurrences divided by eligible token occurrences. Native unresolved cases are abstentions, not engine exceptions.
- Paired comparison uses the same occurrence IDs so repeated words in a row do not collapse into a single observation.
- Deterministic 1,000-replicate row-cluster percentile bootstrap intervals are emitted for exact-match rate and CER; paired row-cluster intervals estimate candidate-minus-native deltas. They describe sampling variability on this dataset; they do not correct reference-label errors or annotation-convention mismatch.
- The report includes per-engine status, error samples, paired deltas, confidence intervals, and a capped mismatch sample. The raw external corpus is not committed.


## Current verified results — revised broad-IPA profile (2026-10-24)

Machine-readable reports and occurrence-level audits: [successful run 40089295231](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40089295231), [artifact 12558044694](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40089295231/artifacts/12558044694). Values are percentages; exact-match 95% CIs are deterministic 1,000-replicate row-cluster percentile bootstrap intervals. CER is lower-is-better.

### UGTPHON noisy user-generated text

275 rows, 2,703 eligible token occurrences, 1,907 unique Hangul words.

| Engine | Scored / eligible | Coverage | Exact match (95% CI) | CER |
|---|---:|---:|---:|---:|
| ClippyFirst native | 2,655 / 2,703 | 98.2242% | 50.8851% (46.8726–54.9358%) | 9.6619% |
| g2pk 0.9.4 + ClippyFirst IPA renderer | 2,703 / 2,703 | 100% | 53.0892% (48.5190–58.0085%) | 9.2285% |
| phonemize 2.0.1 | 2,703 / 2,703 | 100% | 42.5453% (37.2093–48.6478%) | 14.3531% |
| KoG2P 2019 | 2,703 / 2,703 | 100% | 27.3030% (25.1766–29.4688%) | 19.5122% |
| hangul_to_ipa | 2,703 / 2,703 | 100% | 16.2412% (14.0375–18.5143%) | 24.8054% |
| eSpeak NG | 2,703 / 2,703 | 100% | 8.1391% (6.3679–10.1852%) | 33.6101% |

Paired candidate-minus-native deltas on the 2,655 shared scored occurrences:

| Candidate | Exact-rate delta (95% CI) | CER delta (95% CI) |
|---|---:|---:|
| g2pk + project renderer | +2.4482 pp (+1.2378 to +4.2219 pp) | −0.4205 pp (−0.6625 to −0.2298 pp) |
| phonemize 2.0.1 | −7.8343 pp (−10.1440 to −5.1367 pp) | +4.5410 pp (+3.7271 to +5.3596 pp) |
| KoG2P 2019 | −23.3521 pp (−27.4139 to −19.8230 pp) | +9.9318 pp (+8.9473 to +10.9994 pp) |
| hangul_to_ipa | −34.4256 pp (−37.5207 to −31.1349 pp) | +15.1057 pp (+14.0576 to +16.2182 pp) |
| eSpeak NG | −42.6742 pp (−47.0011 to −38.3526 pp) | +23.9090 pp (+22.7362 to +25.1519 pp) |

### SIGMORPHON 2021 public paired lexical file

1,000 source rows; 999 eligible syllable-token occurrences and 999 unique eligible words. One source row, ᆸ니다, uses a standalone archaic Hangul jamo outside the current engine's syllable-token contract and is excluded rather than guessed. The pinned public file contains word/IPA pairs, despite the upstream README describing the shared-task test input as word-only. This is therefore a public paired-file diagnostic, not a leaderboard reproduction.

| Engine | Scored / eligible | Coverage | Exact match (95% CI) | CER |
|---|---:|---:|---:|---:|
| ClippyFirst native | 997 / 999 | 99.7998% | 35.1053% (32.0963–38.0140%) | 14.8920% |
| g2pk 0.9.4 + ClippyFirst IPA renderer | 999 / 999 | 100% | 35.3353% (32.5325–38.2382%) | 14.8222% |
| phonemize 2.0.1 | 999 / 999 | 100% | 28.9289% (26.2262–31.6316%) | 17.4387% |
| KoG2P 2019 | 999 / 999 | 100% | 18.7187% (16.3163–21.2212%) | 21.8327% |
| hangul_to_ipa | 999 / 999 | 100% | 8.9089% (7.2072–10.6106%) | 29.8448% |
| eSpeak NG | 999 / 999 | 100% | 4.3043% (3.1031–5.7057%) | 40.7236% |

Paired deltas on the 997 shared scored occurrences:

| Candidate | Exact-rate delta (95% CI) | CER delta (95% CI) |
|---|---:|---:|
| g2pk + project renderer | +0.3009 pp (−0.3009 to +1.0030 pp) | −0.0753 pp (−0.2584 to +0.0889 pp) |
| phonemize 2.0.1 | −6.1183 pp (−8.0241 to −4.2126 pp) | +2.4988 pp (+1.8514 to +3.1605 pp) |
| KoG2P 2019 | −16.3490 pp (−18.7563 to −13.6409 pp) | +6.9061 pp (+6.1807 to +7.7190 pp) |
| hangul_to_ipa | −26.1785 pp (−29.0873 to −23.2698 pp) | +14.9297 pp (+14.0973 to +15.7538 pp) |
| eSpeak NG | −30.7924 pp (−33.8014 to −27.7834 pp) | +25.8287 pp (+24.6903 to +26.8993 pp) |

The paired g2pk intervals on SIGMORPHON cross zero for both metrics; this dataset does not establish a statistically clear native-versus-g2pk difference. The contrast with UGTPHON argues against declaring one engine universally best.

### Native abstention audit

- UGTPHON: 48 occurrences across 47 unique words. There are 49 unresolved context labels because one occurrence has two contexts: R002 liaison/neutralization (25), R003 ㅎ-coda deletion (20), R007 palatalization (2), R004 complex-coda plus ㅎ aspiration (1), and one IPA-adjudication gap.
- SIGMORPHON: 2 abstentions: 닭갈비 (R008, ㄺ-before-ㄱ fortition depends on lexical/morphological class) and 중심닮음 (R002, liaison/neutralization requires exact morpheme evidence).
- External predictions are diagnostic evidence only. They were not copied into production rules without source adjudication.

### Current conclusions

- g2pk plus the project renderer leads native on the noisy UGTPHON paired set; exact delta +2.4482 pp with a 95% interval above zero. The renderer is shared, so this is not a fully independent end-to-end IPA comparison.
- On the SIGMORPHON public paired file, the paired exact delta is only +0.3009 pp and its interval crosses zero.
- phonemize is the strongest of the other independent candidates on both datasets under this adapter and normalization contract. These scores are diagnostic, not normative NIKL accuracy and not IPA-to-Ukrainian quality.
- The prior table below is historical under the earlier normalization profile and should not be used as the current score snapshot.

## Historical results — earlier normalization profile (superseded)

The latest exact-head scoring run is [40085814704](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40085814704), with report artifact [12557450401](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40085814704/artifacts/12557450401). The invalid first-run phonemize result (0 exact, CER 100%) is excluded: its adapter returned unchanged Hangul because `anyAscii` was disabled. The corrected adapter enables `anyAscii=true`; this current report confirms non-Hangul IPA outputs. These are adapter smoke examples, not proof that individual predictions are phonetically correct.

### Full eligible set

UGTPHON Korean test split: 275 rows, 2,703 eligible token occurrences, 1,907 unique Hangul words. Exact-match and CER confidence intervals are deterministic 1,000-replicate row-cluster percentile bootstrap intervals. CER is lower-is-better.

| Engine | Status / scored tokens | Coverage | Exact match (95% CI) | CER (95% CI) |
|---|---:|---:|---:|---:|
| ClippyFirst native strict | PARTIAL; 2,655/2,703 | 98.2242% | 24.4068% (22.12–26.97%) | 17.0648% (16.34–17.77%) |
| g2pk 0.9.4 | AVAILABLE; 2,703/2,703 | 100% | **24.9723% (22.80–27.38%)** | **16.6931% (15.94–17.44%)** |
| KoG2P 2019 | AVAILABLE; 2,703/2,703 | 100% | 14.8724% (12.77–17.10%) | 26.0795% (25.05–27.13%) |
| hangul_to_ipa 2026 | AVAILABLE; 2,703/2,703 | 100% | 14.9464% (12.59–17.18%) | 30.9851% (29.70–32.24%) |
| eSpeak NG / phonemizer | AVAILABLE; 2,703/2,703 | 100% | 8.1391% (6.37–10.19%) | 39.0498% (37.82–40.28%) |
| phonemize 2.0.1 (corrected adapter) | AVAILABLE; 2,703/2,703 | 100% | 20.0518% (17.68–22.58%) | 21.3645% (20.43–22.23%) |

The native score in this exact-head report is 2,655 scored occurrences and 48 abstentions (47 unique unresolved words; 48 occurrence-level abstentions because one unresolved word appears twice). Earlier report snapshots with 2,653 native-scored occurrences are superseded by this exact-head artifact.

### Paired comparison against native

The paired analysis uses the same **2,655 occurrences** for which the native engine returned a scored IPA result. Deltas are candidate minus native. Positive exact-match delta favours the candidate; negative CER delta favours the candidate. Intervals are paired 1,000-replicate row-cluster bootstrap intervals; they do not correct for multiple comparisons or gold-label noise.

| Candidate | Paired exact rate | Exact-rate delta (95% CI) | CER delta (95% CI) | Interpretation on this corpus |
|---|---:|---:|---:|---|
| g2pk 0.9.4 | 25.1977% vs native 24.4068% | **+0.7909 pp (+0.45 to +1.19 pp)** | **−0.3819 pp (−0.61 to −0.21 pp)** | Small positive paired difference; not proof of universal superiority |
| KoG2P 2019 | 15.0282% | −9.3786 pp (−11.53 to −7.37 pp) | +9.0688 pp (+8.16 to +10.04 pp) | Worse under this lossy custom-phone IPA adapter and this reference convention |
| hangul_to_ipa 2026 | 15.1789% | −9.2279 pp (−10.75 to −7.81 pp) | +13.8673 pp (+12.93 to +14.82 pp) | Worse on this corpus; documented process omissions are relevant |
| eSpeak NG / phonemizer | 8.2109% | −16.1959 pp (−18.50 to −14.05 pp) | +21.9324 pp (+20.92 to +22.98 pp) | TTS-oriented output is a weak match to these IPA annotations |
| phonemize 2.0.1 | 20.3013% | −4.1055 pp (−5.20 to −3.09 pp) | +4.1484 pp (+3.40 to +4.89 pp) | Strongest of the other new candidates here, but behind native/g2pk |

“pp” means percentage points. Full-set exact rates use each engine's own coverage. Paired scores compare the same 2,655 occurrences, and paired CER deltas use the same selected reference characters.

### What can and cannot be concluded

- On this particular UGTPHON diagnostic, g2pk 0.9.4 ranks first on exact match and CER, with full coverage. Its paired advantage over native is small; the paired row-cluster interval excludes zero for both metrics.
- ClippyFirst abstains on 48 occurrences rather than silently guessing. Coverage and abstention behaviour are part of the result, not a defect to erase.
- phonemize 2.0.1 is the strongest of the other new external candidates on this set after fixing its adapter, but its 20.0518% exact score and 21.3645% CER do not establish quality on NIKL's normative rules.
- KoG2P's score depends on a documented but lossy custom-phone-to-IPA mapping. A different mapping or reference convention could change its score; this adapter is not claimed to be a canonical conversion.
- The native engine and g2pk comparison share the repository's segment renderer. This is a limitation and could advantage g2pk relative to a fully independent IPA renderer.
- These results do **not** show that ClippyFirst is the best Korean-to-IPA engine, nor that any competitor is best overall. They show that g2pk is modestly ahead under this evaluation contract on this corpus.
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
