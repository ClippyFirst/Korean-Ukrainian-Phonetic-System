# Research morphology adapters (2026-10-24)

**Status:** integrated research adapters; same-corpus full benchmark completed in CI for Kiwi and MeCab-Ko. A paired boundary-agreement report is added as a separate diagnostic, not a gold-accuracy measure.  
**Scope:** research engine only. This work must not change the public browser service or its practical-mode output.

## Why this layer exists

The current native morphology helper is a closed, low-confidence ending heuristic, not a general Korean morphological analyzer. Kiwi and MeCab-Ko can provide segmentation and POS-like tags that help researchers inspect morpheme boundaries. They are evidence candidates, not pronunciation authorities.

## Data flow and safety boundary

```
Korean orthography
  -> optional analyzer (Kiwi OR MeCab-Ko)
  -> inspectable morphemes, tags, source offsets
  -> human / source-backed review
  -> explicit rule-license decision (separate step)
  -> native source phonology -> IPA -> Ukrainian adaptation
```

Neither adapter generates surface pronunciation, IPA, Ukrainian spelling, or NIKL rule licenses. Analyzer output is not automatically fed into the phonology engine. It does not mutate the exact lexical registry. A missing engine, invalid span, or alignment failure raises an explicit error; no fallback is silently selected.

## Engines

- **Kiwi** uses the optional `kiwipiepy` Python package. Install with `python -m pip install -e '.[research-kiwi]'`.
- **MeCab-Ko** supports the Rust `mecab-ko-python` binding (`mecab_ko.Mecab().pos`), `python-mecab-ko` (`mecab.MeCab().pos`), and a compatible legacy `MeCab.Tagger().parseToNode()` API. The optional `research-mecab-ko` extra installs the first two bindings; runtime initialization tries those binding APIs in order and records the selected binding in the diagnostic output. This is binding-level compatibility within the MeCab-Ko family, not substitution with a different analyzer. If no binding initializes, the benchmark records a blocker.

Both return form, tag, source offsets and (only when exposed reliably by the API) a lemma. Confidence remains `unscored`; a POS tag is not a confidence estimate.

## Diagnostic benchmark

The repository includes an unlabelled diagnostic input list at `data/korean/morphology-review-corpus.txt`. It contains ambiguous and control forms for inspection only; it is **not** gold annotation and must not be used to claim accuracy. The real-engine smoke proves both adapters execute, not that either is more accurate. For a same-corpus comparison against the pinned UGTPHON Korean test split, run the new paired benchmark (one analyzer per environment):

```powershell
uv run python scripts/benchmark_morphology_ipa_delta.py --corpus PATH_TO_PINNED_UGTPHON_KO_TEST_JSON --analyzer kiwi --output artifacts/paired-ipa-morphology-kiwi.json
# Run separately with --analyzer mecab-ko in an environment with that extra installed
```

The paired report evaluates native `morphology_mode=strict` and `morphology_mode=soft` against the same UGTPHON IPA references, reports paired exact-match/CER deltas and coverage, and runs the selected morphology analyzer on the exact same unique Hangul word inventory. It also identifies words whose native IPA/status changes and whether the analyzer segmented those words into multiple morphemes. This is correlation/diagnostics only: Kiwi/MeCab output is deliberately not injected into phonological rules, so no causal improvement is claimed. Morphology token counts and tags remain unscored until independently adjudicated gold segmentation/POS labels exist.


## Same-corpus benchmark results — 2026-10-24

The paired workflow uses the pinned UGTPHON Korean test split (275 rows; Apache-2.0 source dataset), with 2,703 eligible Hangul-token occurrences and 1,907 unique Hangul words. Run: [paired benchmark workflow 40080110887](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40080110887). Full JSON reports are attached as CI artifacts named paired-ipa-morphology-kiwi and paired-ipa-morphology-mecab-ko.

### Existing native IPA engine: strict vs soft mode

| Measure | Strict | Soft | Difference |
|---|---:|---:|---:|
| Scored occurrences | 2,655 / 2,703 | 2,677 / 2,703 | +22 scored |
| Coverage | 98.2242% | 99.0381% | +0.8139 percentage points |
| Exact IPA matches | 648 | 650 | +2 |
| Exact-match rate among scored | 24.4068% | 24.2809% | −0.1259 percentage points |
| Character error rate (CER) | 17.0648% | 17.0906% | +0.0258 percentage points (worse) |
| Unique words marked unresolved | 47 | 25 | −22 (−46.8%) |

On the **2,655 occurrences scored by both modes**, the output metrics are identical: 648 exact matches, 24.4068% exact rate, CER 17.0648%. The soft mode expands coverage to 22 additional occurrences, but only 2 of those are exact matches. Its overall exact rate and CER therefore do not improve. This is a coverage/abstention trade-off, not evidence of better IPA accuracy.

### Morphological engines on the exact same 1,907 words

| Engine | Words analyzed | Multi-morpheme segmentations | Share | Elapsed time in CI |
|---|---:|---:|---:|---:|
| Kiwi (kiwipiepy) | 1,907 / 1,907 | 1,321 | 69.27% | 1.795 s |
| MeCab-Ko (python-mecab-ko) | 1,907 / 1,907 | 1,282 | 67.23% | 0.051 s |

Both achieved 100% execution coverage on this inventory. Kiwi emitted 39 more multi-morpheme analyses; MeCab-Ko ran about 35× faster in this run. These are runtime and segmentation-shape observations only. Neither count is a segmentation accuracy score, and the raw POS tagsets are not assumed equivalent. The reports flag unusually long segmentations (10+ morphemes) for manual review; long/noisy UGTPHON tokens may be concatenations, so these are review candidates, not automatically errors.

The native soft-mode changes affected 22 unique words/statuses, and **both analyzers split all 22 into multiple morphemes** in this run. This is an interesting alignment for follow-up review, but it is not causal evidence: the analyzer outputs were never passed to the phonology engine. The strict/soft native experiment is independent of Kiwi/MeCab.

### Existing independent IPA-engine baseline (same pinned corpus)

The earlier multi-engine report [run 40078877803](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40078877803) measured the following diagnostic exact-match rates / CER:

| IPA path | Exact-match rate | CER | Coverage |
|---|---:|---:|---:|
| ClippyFirst native strict | 24.4068% | 17.0648% | 98.2242% |
| g2pk 0.9.4 + project IPA renderer | 24.9723% | 16.6931% | 100% |
| phonemize 2.0.1 | 20.0518% | — | — |
| hangul_to_ipa | 14.9464% | — | — |
| KoG2P + explicit label-to-IPA adapter | 14.8724% | — | — |
| eSpeak NG Korean | 8.1391% | — | — |

The comparison is diagnostic rather than normative: UGTPHON is noisy user-generated text, its IPA conventions differ from the project's broad IPA conventions, some candidates use representation adapters, and unresolved native tokens affect coverage. These scores evaluate Korean IPA only, not Ukrainian adaptation. The native strict score exactly matches the new paired run, confirming that the benchmark is comparing the same baseline behavior.

### Pairwise Kiwi/MeCab boundary agreement

A follow-on CI job compares the two analyzers' boundary sets over the same words, reporting exact boundary-set agreement and micro boundary overlap. This is **pairwise agreement, not accuracy**; neither analyzer is gold, and raw POS tags are not compared. Its output is available as the morphology-analyzer-boundary-agreement artifact when the job completes.


## Acceptance gates before morphology may license phonological rules

1. Build a gold subset with source text, morpheme spans, lemma/POS, annotator, source and adjudication status.
2. Report boundary precision/recall/F1 and POS accuracy against that gold set; stratify by rule-relevant boundaries (formal endings, lexical/substantive morphemes, compounds).
3. Measure false rule permissions as a separate safety metric. In particular, analyzer segmentation alone must not automatically choose NIKL §13/14 versus §15.
4. Keep exact NIKL-backed pair licenses higher priority than analyzer hypotheses. Uncertain and conflicting outputs remain unresolved.
5. Add a separately reviewed rule-licensing adapter and tests before any morphology result can affect IPA.
6. Maintain Python/browser parity and keep the public practical service on its existing JS engine. No adapter is imported by the browser bundle.

## Known limitations

- Real-engine smoke has passed for both optional analyzers on the 16-input review corpus; full-corpus same-inventory benchmark evidence is pending the new CI workflow.
- MeCab-Ko's Python bindings are OS-sensitive; initialization failures are surfaced with the underlying API errors.
- Kiwi/MeCab segmentation conventions differ; raw tag strings are retained instead of being collapsed into a possibly incorrect universal POS inventory.
- Lemma is nullable and is not guessed from surface form.
- The benchmark currently requires a local corpus path; no corpus or labels are fabricated by this change.
