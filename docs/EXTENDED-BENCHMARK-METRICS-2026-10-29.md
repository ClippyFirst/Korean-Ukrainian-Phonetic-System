# Extended Korean G2P benchmark metrics and runtime — 2026-10-29

## Scope

This change extends the existing `scripts/benchmark_multi_engine_ko.py` harness; it does not create a competing benchmark pipeline. It applies to the harness's existing pinned corpus runs and all configured engines: ClippyFirst native, g2pk 0.9.4, KoG2P (pinned commit), hangul_to_ipa (pinned commit), eSpeak NG through phonemizer, and phonemize 2.0.1. A run records each engine's availability/errors separately so missing optional dependencies do not become fabricated scores.

## Newly recorded metrics

- **Execution time:** total wall time and words/second for per-word engines; per-call p50/p95 and mean latency; batch engines record total wall time and throughput with an explicit scope note. Batch startup-inclusive timings are not directly comparable with per-word call timings.
- **PER-style phoneme error rate:** edit distance over broad-IPA segment-like units, divided by reference segment count. Common Korean affricates and attached diacritics are kept together rather than counted as separate Unicode characters.
- **Feature-weighted phonological error rate proxy:** weighted edit distance based on declared place, manner, voicing, vowel height/backness/rounding, aspiration, length, and fortis features. This is a project-defined diagnostic proxy, not a claim to implement one universally standardized PFER definition.
- **Coverage-adjusted exact-match rate:** exact matches divided by all eligible token occurrences. Abstentions and failed predictions therefore count as non-matches in this measure.
- Existing metrics remain: exact-match rate, CER, coverage, abstentions/errors, paired comparisons, row-cluster bootstrap intervals, and mismatch/audit ledgers.

The report counts unsupported feature-inventory segments. A low feature-weighted error score should not be interpreted without checking this count. IPA normalization is still a benchmark-specific broad transcription policy, not a universal equivalence relation.

## Metrics deliberately not claimed

The current external benchmark is an IPA comparison, not an independently adjudicated Korean-to-Ukrainian gold corpus. It therefore cannot validly measure the following yet:

| Metric | Status | Evidence needed to make it measurable |
|---|---|---|
| Per-rule accuracy | BLOCKED_GOLD_REQUIRED | Expert/source-adjudicated labels for each applicable rule environment, including negative controls |
| Ukrainian target CER / exact match | BLOCKED_GOLD_REQUIRED | Independent approved Ukrainian target forms aligned to resolved IPA |
| IPA → Ukrainian pipeline consistency | BLOCKED_GOLD_REQUIRED | Per-case trace proving the target came from the exact IPA result, plus adapter-level gold/contract checks |
| Determinism / repeatability | NOT_RUN | Multiple controlled repetitions per engine and identical-input output comparisons |
| Comparable memory usage | NOT_RUN | Process-level peak memory samples collected under the same runner/runtime policy |
| Independent normative accuracy | BLOCKED_GOLD_REQUIRED | A separate, source-grounded, adjudicated NIKL-style holdout with declared variant policy |

These fields are explicitly reported as not measured rather than imputed. Existing NIKL-backed regression tests are useful evidence for particular rule cases, but their pass count is not a substitute for per-rule accuracy on a representative adjudicated holdout.

## Interpretation requirements

1. Report results per engine and dataset; do not declare a universal winner from a noisy external corpus.
2. Consider PER, feature-weighted error, CER, exact match, coverage-adjusted exact match, coverage, abstentions, and errors together.
3. Use p50/p95 latency only within matching timing scopes and the same runner; run multiple repetitions before making stable speed claims.
4. Keep Ukrainian target quality separate from Korean IPA quality.
5. Do not promote external engine outputs into production rules without independent source adjudication and positive/negative controls.

## Verification

- Unit coverage: `tests/test_benchmark_extended_metrics.py`.
- Full multi-engine runs still require the pinned UGTPHON/SIGMORPHON corpus and optional external engine checkouts/dependencies as specified by the existing benchmark workflows.
- This authoring session could not clone the repository or run its local test suite because the execution container could not resolve `github.com`. The branch must pass GitHub Actions before these changes are considered verified. No fresh benchmark scores are claimed in this document.

## Preliminary measured results (2026-10-29)

These are **observed results from the first successful GitHub Actions run**, not yet the final exact-head verification. Workflow run: [40781561729](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40781561729). That run used an earlier branch commit (`aa5718034bc37dbacb65979c85df1eec77fc8ee5)); the exact-head rerun for `365280e93a3b4a5ada0ff807c880cacf9236b6e7` was still in progress when this note was written. The later affricate feature-map refinement may alter the feature-weighted proxy slightly. Treat all runtime figures as a single-run diagnostic, not a stable performance ranking.

### UGTPHON Korean test split

Eligible token occurrences: 2,703; unique words: 1,907.

| Engine | Coverage | Exact match | CER | PER | Feature-weighted proxy | Coverage-adjusted exact | Total runtime (ms) | Words/s | p50 ms/call | p95 ms/call | Unsupported feature segments |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| ClippyFirst native | 99.815% | 53.002% | 9.170% | 9.614% | 4.917% | 52.904% | 375.245 | 5,082.014 | 0.1775 | 0.3381 | 1,004 |
| g2pk 0.9.4 | 100% | 53.089% | 9.229% | 9.647% | 4.936% | 53.089% | 18,540.395 | 102.856 | 9.6831 | 10.0770 | 1,008 |
| KoG2P 2019 | 100% | 27.303% | 19.512% | 19.644% | 7.059% | 27.303% | 371.656 | 5,131.086 | 0.1886 | 0.2337 | 1,098 |
| hangul_to_ipa 2026 | 100% | 16.241% | 24.805% | 30.809% | 11.818% | 16.241% | 953.344 | 2,000.328 | 0.4770 | 0.6685 | 1,741 |
| eSpeak NG ko | 100% | 8.139% | 33.610% | 38.316% | 13.279% | 8.139% | 424.954 | 4,487.544 | N/A (batch) | N/A (batch) | 1,555 |
| phonemize 2.0.1 | 100% | 42.545% | 14.353% | 14.258% | 7.742% | 42.545% | 224.135 | 8,508.260 | N/A (batch) | N/A (batch) | 1,098 |

### SIGMORPHON 2021 Korean paired lexical test

Eligible/unique words: 999.

| Engine | Coverage | Exact match | CER | PER | Feature-weighted proxy | Coverage-adjusted exact | Total runtime (ms) | Words/s | p50 ms/call | p95 ms/call | Unsupported feature segments |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| ClippyFirst native | 99.900% | 35.772% | 14.698% | 16.234% | 7.606% | 35.736% | 160.963 | 6,206.382 | 0.1353 | 0.2345 | 476 |
| g2pk 0.9.4 | 100% | 35.335% | 14.822% | 16.313% | 7.656% | 35.335% | 9,874.482 | 101.170 | 9.7424 | 10.1706 | 477 |
| KoG2P 2019 | 100% | 18.719% | 21.833% | 23.663% | 8.665% | 18.719% | 192.411 | 5,192.019 | 0.1843 | 0.2130 | 523 |
| hangul_to_ipa 2026 | 100% | 8.909% | 29.845% | 36.347% | 12.871% | 8.909% | 486.818 | 2,052.102 | 0.4647 | 0.6437 | 667 |
| eSpeak NG ko | 100% | 4.304% | 40.724% | 48.705% | 17.524% | 4.304% | 249.353 | 4,006.362 | N/A (batch) | N/A (batch) | 689 |
| phonemize 2.0.1 | 100% | 28.929% | 17.439% | 18.266% | 8.516% | 28.929% | 202.371 | 4,936.472 | N/A (batch) | N/A (batch) | 523 |

### Reading the preliminary results

- Native and g2pk are close in exact match on both corpora. Native has slightly lower CER on both in this run; native coverage is just below 100%, so coverage-adjusted exact match is also reported.
- The first-run native total time is much lower than g2pk's (roughly 49× on UGTPHON and 61× on SIGMORPHON), but this is one run only. Timing is diagnostic and needs repeated controlled runs before making a robust speed claim.
- Per-call p50/p95 are intentionally N/A for batch-mode engines; comparing those with per-word call latency would be misleading.
- The feature-weighted score is a project-defined proxy. High unsupported-feature counts mean it must be interpreted cautiously and not as a standalone ranking.
- These are Korean-to-IPA benchmark results, **not** Ukrainian target transcription accuracy. They do not validate normative Ukrainian spellings or IPA-to-Ukrainian pipeline consistency.

