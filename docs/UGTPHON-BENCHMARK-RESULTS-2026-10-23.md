# UGTPHON Korean IPA diagnostic results — 2026-10-23

## Reproducibility

- Project branch: `research/ugtphon-independent-validation-2026-10-23`.
- Code head for this result: `3f59af5f8d5302cfacac4e6fb84a395a973b1c41`.
- External benchmark workflow: [run #6](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40018727120).
- Machine-readable artifact: [ugtphon-korean-ipa-diagnostic](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40018727120/artifacts/12528888952).
- Upstream corpus commit: `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`; file `ko/test.json`; per-language license `ko/LICENSE` declares Apache-2.0.
- The workflow downloads the pinned external file temporarily, verifies the license and the 275-row Korean test split, and does not commit corpus text into this repository.

## Results

| Measure | Result |
|---|---:|
| Sentence rows in pinned split | 275 |
| Token IPA comparisons scored | 2,653 |
| Exact matches after declared normalization | 648 |
| Exact-match rate among scored tokens | 24.4252% |
| Character error rate (reference-length denominator) | 17.0766% |
| Tokens explicitly marked unresolved by the native engine | 50 |
| Tokens skipped as non-Hangul/multi-token or otherwise not token-comparable | 437 |
| Missing-gold / empty-variant skips | 0 |
| Engine exceptions | 0 |

The 50 unresolved tokens are excluded from the accuracy denominator, not counted as successful matches. The 437 skipped tokens are not in the denominator either. These numbers are diagnostic only, not a claim that the engine is “24% accurate”: UGTPHON's IPA conventions differ from this project's broad IPA, the source includes user-generated text, and token-level evaluation loses phrase prosody and cross-token morphology.

## What the benchmark revealed

### 1. A real fail-closed contract gap

For `앉아라`, the native rule trace withheld complex-coda liaison under R002 because the exact morphological license was absent, yet the downstream pipeline still exposed an apparently definitive IPA string (`an.a.ɾa`) and allowed target mapping to proceed. The issue was not that the engine should blindly imitate a benchmark string; it was that an explicitly withheld pronunciation was still being presented as if it were resolved.

The research pipeline now exposes `pronunciation_status: unresolved` plus structured `unresolved_contexts` for the identified unlicensed ambiguity gates, and `transliterate_korean()` stops before IPA-to-Ukrainian mapping when the Korean pronunciation is unresolved. A regression test verifies this for `앉아라`; a source-backed `값어치` lexical override remains resolved by its own evidence. The diagnostic IPA remains inspectable for audit, but is not used as a Ukrainian target input.

The same fail-closed gate surfaced other unresolved examples, including `삶의`, `많이본`, `없어도`, and `좋아보인다고`. These require source-backed lexical/morphological adjudication or an explicit soft/heuristic mode; do not silently infer their morphology from Hangul adjacency.

### 2. Not every IPA mismatch is an engine defect

Examples from the worst-mismatch list require different treatment:

- `위`: external `ɥi`, project `y`. The project's source-backed inventory already documents the permitted `ㅟ` readings `[y]` and `[wi]`; this requires IPA-convention/variant adjudication, not an automatic rule change.
- `사람`: external `ˈsʰa̠ːɾa̠m`, project `sa.ɾam`. Stress, vowel length, narrow vowel diacritics, and the source's initial-fricative convention all affect exact matching.
- `사건`: external `ˈsʰa̠ːk͈ʌ̹n`, project `sa.ɡʌn`. This is a high-priority manual source-adjudication candidate; do not change the project to match it until checked against NIKL dictionary/rules and the upstream lexical entry.
- `앉아라`: the external comparison helped expose the unresolved-state contract gap; it is now withheld from target rendering rather than accepted as a guessed answer.

The mismatch artifact includes up to 50 scored mismatches and the separate unresolved-token inventory. The dataset is not treated as normative gold simply because it is public or human-annotated.

## Verification

At code head `3f59af5f8d5302cfacac4e6fb84a395a973b1c41`:
- [External UGTPHON diagnostic](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40018727120): passed; pinned source/license and corpus structure validated; benchmark completed with zero engine exceptions.
- [Python tests / browser tests and build](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40018727056): completed successfully for Python 3.11/3.12/3.13 and browser regression/build.
- [System verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40018727169): browser regression/build and Python regression/data-integrity completed successfully.
- [Master corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40018727152): strict corpus and master-table generation passed.
- [Optional g2pK integration](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40018727040): Python 3.11/3.12 integration tests and wheel data check passed. This validates integration mechanics only; it does not establish gold pronunciation.

## Remaining acceptance gates

- **TODO / evidence adjudication:** investigate scored mismatches by phonological class and compare with direct NIKL evidence. Do not set an arbitrary pass threshold until annotation conventions and error categories are adjudicated.
- **TODO / broader coverage:** the UGTPHON test split is not a complete rule-coverage set. Continue the separate official 30-article NIKL coverage matrix and source-attested lexical controls.
- **BLOCKED_SPECIALIST_ADJUDICATION:** independent broad-IPA gold review remains outstanding.
- **BLOCKED_SPECIALIST_ADJUDICATION:** independent Ukrainian target-layer review remains outstanding. No Ukrainian correctness score is produced by this benchmark.
- **Release disposition:** deployed research preview / partial prototype, not scientifically validated release.
