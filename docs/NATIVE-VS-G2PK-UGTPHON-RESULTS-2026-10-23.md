# Native Korean engine vs g2pk — paired UGTPHON diagnostic (2026-10-23)

## Disposition

**Result on this one diagnostic corpus: g2pk is slightly ahead.** This is a preliminary benchmark finding, not evidence that g2pk is universally better or that either engine is ready for a scientific/public standard-pronunciation claim.

- Repository: `ClippyFirst/Korean-Ukrainian-Phonetic-System`
- Benchmark branch: `research/independent-engine-benchmark-2026-10-23`
- Benchmark commit: `c0e405670f0616e252a5e0d4eb683725f37c8a66`
- PR: [#280](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/280)
- Successful paired workflow: [run 40023490867](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40023490867)
- JSON report artifact: [native-vs-g2pk-ugtphon-diagnostic](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40023490867/artifacts/12531162645)
- External corpus: UGTPHON Korean test split, pinned to upstream commit `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`, 275 rows; CI verified the corpus shape and Apache-2.0 license.
- Runtime: Python 3.12; `g2pk==0.9.4` successfully installed in GitHub Actions. The local chat Python environment cannot reach PyPI, so installation and execution were delegated to the repository's CI runner.

## Results

All rates below are measured on the same pinned dataset and use the same IPA normalization/edit-distance implementation.

| Metric | Native engine (all resolved tokens) | g2pk (all valid outputs) | Paired subset: native | Paired subset: g2pk |
|---|---:|---:|---:|---:|
| Scored tokens | 2,653 | 2,703 | 2,653 | 2,653 |
| Exact matches | 648 | 675 | 648 | 669 |
| Exact-match rate | 24.4252% | 24.9723% | 24.4252% | 25.2167% |
| Character error rate (CER) | 17.0604% | 16.6931% | 17.0604% | 16.6782% |
| Unresolved | 50 | 0 | excluded from both | 0 |
| Engine exceptions | 0 | 0 | 0 | 0 |

### Head-to-head interpretation

On the **2,653-token paired subset**, g2pk produced:
- **21 more exact matches** (669 vs 648);
- an exact-match rate **0.7915 percentage points higher** (25.2167% vs 24.4252%);
- CER **0.3822 percentage points lower** (16.6782% vs 17.0604%).

On the full per-engine score, g2pk also scored 50 additional tokens for which the native engine deliberately returned `pronunciation_status=unresolved`. That is a meaningful coverage difference, but not automatically a correctness win: fail-closed uncertainty is an intentional behavior, and a coverage/error trade-off must be reported separately from accuracy.

## Important methodological limitations

1. **UGTPHON is not normative gold.** It targets noisy user-generated text, not a balanced official Standard Korean Pronunciation evaluation suite. These scores must not be described as general Korean pronunciation accuracy.
2. **g2pk emits Hangul surface forms, not IPA.** Its outputs were converted to IPA by the repository's segment IPA renderer, without re-running the native engine's phonological rules over the g2pk result. This keeps the compared pipeline explicit, but shares a rendering layer and may bias segment-level comparison. The score is not an independent evaluation of two fully separate IPA renderers.
3. **Token-level evaluation loses context.** It does not score sentence prosody, word-boundary phenomena, or full utterance behavior. Tokens outside the benchmark's single-Hangul-word scope are skipped.
4. **IPA conventions differ.** Exact match and CER can penalize defensible differences in broad/narrow transcription, vowel detail, stress, length, and annotation policy. Error classes need manual/source-backed adjudication before any engine rule is changed.
5. **This does not evaluate Ukrainian adaptation.** Neither score validates the Ukrainian practical orthography or the quality of the IPA-to-Ukrainian target adapter.
6. **No claims about licensing or project ownership are implied.** The workflow installs the published optional package for comparison; it does not copy g2pk code into the engine or alter its upstream project.

## Next research steps before presenting a scientific conclusion

- Add an independently specified Hangul-surface-to-IPA adapter for g2pk and cross-check it against manually adjudicated examples, so the comparison does not rely solely on our renderer.
- Build a source-grounded normative evaluation set from official NIKL examples/rules, with exact source references and independently reviewed IPA; keep it separate from noisy UGTPHON.
- Stratify mismatches by phonological process (nasalization, liquidization, liaison, fortition, aspiration, tensification, vowel variants, lexical exceptions) and distinguish rule errors from annotation convention differences.
- Report coverage/abstention alongside accuracy; do not reward the native engine for silently guessing and do not treat all abstentions as ordinary incorrect predictions.
- Run paired bootstrap confidence intervals or another documented uncertainty analysis on the test items, and check for duplicate/near-duplicate leakage before making broad claims.
- Obtain independent Korean phonology/IPA review and separate Ukrainian target-layer review.

## CI evidence

On commit `c0e405670f0616e252a5e0d4eb683725f37c8a66`:
- Paired native-vs-g2pk diagnostic: **success**; dependency installation, corpus/license validation, benchmark, and artifact upload completed.
- Existing UGTPHON diagnostic: **success**.
- Python tests: **success**.
- System verification: **success**.
- Master table / research corpus artifacts: **success**.

This PR adds benchmarking infrastructure and a reproducible result report; it does not change the native engine's pronunciation rules. Keep it unmerged until the review of the comparison method and generated report is complete.
