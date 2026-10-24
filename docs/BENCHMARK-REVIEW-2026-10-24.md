# Benchmark review after ClippyFirst renderer integration — 2026-10-24

> **Updated investigation note (2026-10-24):** The score table in this document is a historical snapshot under an earlier IPA-normalization profile. Use [the current multi-engine report](MULTI-ENGINE-KOREAN-IPA-BENCHMARK-2026-10-24.md) for the revised diagnostic scores. Review of its occurrence-level artifact identified a concrete native R002 defect: coda ㅇ (/ŋ/) can be moved into a silent onset and disappear. A targeted fix and regression tests are proposed in [PR #298](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/298); see [the error analysis](KOREAN-ERROR-ANALYSIS-2026-10-24.md). The old scores are pre-fix, and the defect's full-corpus impact remains unmeasured until CI and an exact-head benchmark rerun succeed.

**Code under review:** merged commit `b87e78c702e9278c8a84592b8d054113f74f18b9`. The benchmark jobs ran against PR head `9f9509b6617de7d0e4cfaef40f31b6bd74c28885`, whose executable source and tests are identical to the merged commit; the intervening commit before merge changed only the roadmap documentation. This is therefore an exact-code benchmark snapshot, although the benchmark workflows were not rerun on the merge commit itself.

## Executive conclusion

The renderer refactor is a software architecture correction, not a phonological model change. Available IPA benchmark results show no claimed improvement from the refactor itself. The core/native engine remains substantially more conservative than external G2P engines: it abstains on some cases, while external engines emit a result for all scored tokens. On the pinned noisy UGTPHON corpus, g2pK has slightly better measured exact match and CER than native strict mode, but this is not normative NIKL accuracy and does not evaluate Ukrainian target rendering.

No independently adjudicated gold corpus for Korean-to-Ukrainian practical output was available in these benchmark runs. Therefore the accuracy of the Ukrainian rendering layer remains unmeasured as a full-system metric.

## 1. Multi-engine IPA comparison

Source: [Multi-engine Korean IPA diagnostic benchmark, run 40087193952](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087193952). The job completed successfully and uploaded [artifact 12557537347](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087193952/artifacts/12557537347).

Pinned dataset: UGTPHON Korean `ko/test.json`, commit `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`; 275 rows, 2,703 eligible Hangul-token occurrences and 1,907 unique Hangul words. This is noisy user-generated text, not normative NIKL gold. Reported metrics:

| Engine | Scored / 2,703 | Coverage | Exact matches | Exact-match rate | CER | Runtime errors |
|---|---:|---:|---:|---:|---:|---:|
| ClippyFirst native strict | 2,655 | 98.2242% | 648 | 24.4068% | 17.0648% | 0 |
| g2pK 0.9.4 | 2,703 | 100% | 675 | 24.9723% | 16.6931% | 0 |
| KoG2P (pinned 2019) | 2,703 | 100% | 402 | 14.8724% | 26.0795% | 0 |
| hangul_to_ipa (pinned 2026) | 2,703 | 100% | 404 | 14.9464% | 30.9851% | 0 |
| eSpeak NG Korean | 2,703 | 100% | 220 | 8.1391% | 39.0498% | 0 |
| phonemize 2.0.1 | 2,703 | 100% | 542 | 20.0518% | 21.3645% | 0 |

The paired comparison on the 2,655 occurrences scored by both native strict and g2pK reports g2pK-minus-native exact-rate delta +0.7909 percentage points and CER delta −0.3819 percentage points; the recorded 95% intervals exclude zero for those paired deltas. g2pK also returns 48 more occurrences than native strict. This is evidence only about this corpus/reference convention, not proof that g2pK is the normative authority or that its output is always linguistically superior.

The benchmark measures Korean IPA only. It does not score Ukrainian orthography, and it does not establish that the new target renderer changed any IPA score.

## 2. Native strict vs soft and morphology counterfactuals

Source: [Research morphology adapter smoke and paired IPA benchmark, run 40087193870](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087193870). Kiwi, MeCab-Ko, and the pairwise comparison completed successfully; JSON artifacts are available from that run.

The existing paired report for the same 2,703 eligible occurrences records:

| Strategy | Scored / 2,703 | Coverage | Exact matches | Exact-match rate | CER |
|---|---:|---:|---:|---:|---:|
| Native strict | 2,655 | 98.2242% | 648 | 24.4068% | 17.0648% |
| Native soft | 2,677 | 99.0381% | 650 | 24.2809% | 17.0906% |
| Kiwi boundary-gated counterfactual | 2,670 | 98.7791% | 650 | 24.3446% | 17.0810% |
| MeCab-Ko boundary-gated counterfactual | 2,672 | 98.8531% | 650 | 24.3263% | 17.0779% |

Strict and soft are identical on the 2,655 common scored occurrences. Soft raises coverage by 0.8139 percentage points, but its full-set exact-match rate falls by 0.1259 percentage points and CER worsens by 0.0258 points. This is a coverage/abstention trade-off, not an accuracy improvement.

The analyzer-gated strategies are explicitly naive research ablations: a character-offset boundary does not prove that a morpheme has the status or rule environment required by NIKL. On the common 2,655-occurrence subset, both gates and native soft/strict have zero paired exact-rate and CER delta against one another. No causal accuracy benefit from morphology is demonstrated.

Kiwi and MeCab-Ko each analyzed all 1,907 unique words. Their pairwise exact boundary-set agreement was 1,537/1,907 (80.5978%); boundary micro F1 was 85.7926%. This is agreement, not gold segmentation accuracy. One-run elapsed times were 2.114 s for Kiwi and 0.104 s for MeCab-Ko; these are not stable speed claims.

## 3. Python/browser surface differential and renderer verification

Source: [system verification run 40087346894](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087346894), [tests run 40087346890](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087346890).

- Python regression/data-integrity job: passed.
- Browser test suite: 1,213 passed, 0 failed.
- Browser production build: passed.
- Python test suite: passed on Python 3.11, 3.12, and 3.13.
- The Python/browser g2pK surface differential diagnostic compared 20 rows: 18 equal, 2 different. The recorded mismatches are `넓죽하다` (browser expected `널쭈카다`, Python surface `넙쭈카다`) and `읽고` (browser expected `익꼬`, Python surface `일꼬`). The test marks these as a known JS-port divergence from the recorded NIKL normative output; IPA gold for these rows is not independently adjudicated.
- The new shared target-renderer regression tests are included in the passing Python suite. They verify routing through the ClippyFirst core, punctuation/spacing preservation, and fail-closed behavior for missing word-level IPA analyses.

The NIKL live metadata crawl was skipped in the system verification workflow; do not count it as a pass.

## 4. What these benchmarks do and do not establish

**Established:**
- The shared renderer refactor is present in main and the relevant CI suites passed on the exact executable source that was merged.
- The external G2P adapters and native engine can be compared on the pinned UGTPHON set without runtime errors in the reported runs.
- Native soft mode expands output coverage but does not improve the measured common-subset IPA accuracy.
- Morphology analyzer segmentation is available for research, but the present boundary gate does not improve paired IPA scores.
- The browser/Python surface differential still has two known discrepancies.

**Not established:**
- A post-merge rerun of the benchmark workflows: these workflows ran on the PR head immediately before merge, whose executable files are identical to the merged code. CI on the merge commit ran the main test, system-verification and research-artifact workflows successfully, but not the manual-dispatch multi-engine/morphology benchmark workflows.
- Accuracy of the Ukrainian practical rendering against independent expert-approved Ukrainian gold output.
- Accuracy against a fully adjudicated NIKL phonology holdout set.
- That either morphology analyzer improves the pronunciation model.
- That a third-party engine's higher score on UGTPHON makes it the correct production authority.

## 5. Next benchmark tasks

1. **DONE_VERIFIED — software regression gate:** keep the new core renderer and fail-closed tests.
2. **TODO — rerun multi-engine IPA and morphology benchmarks on main:** use the existing `workflow_dispatch` workflows and archive the reports against merge commit `b87e78c7`; compare against this exact-code PR-head snapshot.
3. **TODO — add a target-rendering benchmark:** create an independently adjudicated Korean IPA → Ukrainian target corpus, separate from the UGTPHON IPA benchmark. Include vowel/consonant contrasts, aspiration/fortition, coda release, length/tone if in scope, syllable boundaries, punctuation, compounds, and unsupported IPA.
4. **TODO — adjudicate the two Python/browser surface mismatches** against the exact official NIKL source environments before changing either runtime.
5. **BLOCKED — production morphology licensing:** require expert-reviewed morpheme labels and a rule-specific licensing adapter; raw analyzer boundaries alone do not satisfy acceptance.
6. **BLOCKED — external accuracy claim:** UGTPHON is noisy and its IPA convention differs in places from this project's broad-IPA representation; report it as diagnostic until an independently adjudicated, source-grounded holdout is available.

## Reproduction links

- [Multi-engine IPA benchmark](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087193952)
- [Native vs g2pK paired benchmark](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087193915)
- [External UGTPHON IPA diagnostic](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087193975)
- [Kiwi / MeCab-Ko morphology benchmark](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087193870)
- [Main-commit system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087346894)
- [Main-commit Python/browser tests and build](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40087346890)
