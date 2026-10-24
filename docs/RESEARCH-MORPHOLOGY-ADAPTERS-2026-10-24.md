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

The benchmark was run on pinned [UGTPHON](https://github.com/naver-ai/UGTPHON) Korean `ko/test.json` at commit `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`: 275 rows, 2,703 eligible Hangul-token occurrences, 1,907 unique Hangul words. It is noisy user-generated text, **not** normative NIKL gold.

Exact-head paired workflow [40085814755](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40085814755) passed for both real analyzers and pairwise comparison. Reports: [Kiwi artifact 12556189316](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40085814755/artifacts/12556189316), [MeCab-Ko artifact 12556159351](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40085814755/artifacts/12556159351), and [boundary-agreement artifact 12557345848](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40085814755/artifacts/12557345848). The reports are retained as CI artifacts; they are not committed as fabricated gold data.

### Existing native IPA engine: strict vs soft

| Measure | Strict | Soft | Full-set difference |
|---|---:|---:|---:|
| Scored occurrences | 2,655 / 2,703 | 2,677 / 2,703 | +22 for soft |
| Coverage | 98.2242% | 99.0381% | +0.8139 percentage points |
| Exact matches | 648 | 650 | +2 for soft |
| Exact-match rate among scored | 24.4068% | 24.2809% | −0.1259 percentage points |
| CER | 17.0648% | 17.0906% | +0.0258 percentage points (worse) |
| Unique words unresolved | 47 | 25 | −22 for soft |

On the 2,655 occurrences scored by both modes, strict and soft are identical: 648 exact matches, exact rate 24.4068%, CER 17.0648%. Soft mode therefore expands coverage, but does not improve the scored common subset. On the full set it adds two exact matches among 22 extra scored occurrences; overall exact rate decreases and CER slightly worsens. This is a coverage/abstention trade-off, not an accuracy improvement.

### Counterfactual morphology-boundary gate: does it change the IPA scores?

We added a deliberately naive **research-only counterfactual**: take the native soft-mode rule contexts, retain a context only when the selected morphology analyzer exposes a boundary at that exact orthographic offset, then score the native phonology engine with those retained licenses. This is an ablation, **not** a valid production rule-licensing method: a token boundary does not establish whether a morpheme is formal, lexical/substantive, or eligible for a particular NIKL rule.

| Full-set measure | Native strict | Native soft | Kiwi boundary gate | MeCab-Ko boundary gate |
|---|---:|---:|---:|---:|
| Scored / 2,703 | 2,655 | 2,677 | 2,670 | 2,672 |
| Coverage | 98.2242% | 99.0381% | 98.7791% | 98.8531% |
| Exact matches | 648 | 650 | 650 | 650 |
| Exact-match rate among scored | 24.4068% | 24.2809% | 24.3446% | 24.3263% |
| CER | 17.0648% | 17.0906% | 17.0810% | 17.0779% |
| Native soft-rule licenses retained / suppressed | — | — | 208 / 30 | 207 / 31 |
| Unique words whose output/status differs from strict | — | 22 | 15 | 17 |
| Runtime errors in gated IPA calls | 0 | 0 | 0 | 0 |

**Fair paired result:** all three strategies (strict, soft, and boundary-gated) return scored IPA on the same 2,655-occurrence common subset. On that subset, both analyzer gates are identical to strict and soft: exact-rate delta = **0.0000**, CER delta = **0.0000**, with 0 exact wins, 0 exact losses, 0 lower-edit-distance wins, 0 higher-edit-distance losses, and 2,655 equal edit distances. Paired CER uses the same first-listed reference variant per occurrence, so its denominator is identical across strategies; exact match accepts any explicitly listed reference variant.

The full-set boundary-gated outputs resolve 15 (Kiwi) / 17 (MeCab-Ko) more occurrences than strict, but both add only two exact matches overall. That is additional output coverage, **not evidence of better IPA accuracy**. Full-set CER values have strategy-specific scored sets/reference selection and should not be read as paired effect estimates. The paired common-subset result is the fair comparison.

### Analyzer segmentation and representation

| Measure on the same 1,907 words | Kiwi | MeCab-Ko |
|---|---:|---:|
| Words analyzed | 1,907 / 1,907 | 1,907 / 1,907 |
| Words split into multiple morphemes | 1,321 (69.27%) | 1,282 (67.23%) |
| Total morpheme tokens | 4,552 | 4,100 |
| Words with 10+ morphemes | 9 | 5 |
| Maximum morphemes in one word | 48 | 26 |
| Elapsed time in this CI run | 2.114 s | 0.104 s |

Timing is a single-run observation, not a stable speed benchmark. The highest-count outliers are long/repetitive user-generated strings and are review/filter candidates, not automatically analyzer errors.

Character-offset boundary comparison:

- Exact boundary-set agreement: **1,537 / 1,907 words = 80.5978%**.
- Boundary micro-overlap: 1,878 shared, 307 Kiwi-only, 315 MeCab-only; pairwise F1 = **85.7926%**.
- The metric only observes boundaries between Hangul characters; it cannot represent a split inside one Hangul syllable. It is pairwise agreement, not accuracy.

The adapter output-shape audit explains why raw boundary scores need care:

| Representation diagnostic | Kiwi | MeCab-Ko |
|---|---:|---:|
| Words with repeated source spans | 187 | 0 |
| Repeated span groups | 205 | 0 |
| Overlapping source-span pairs | 416 | 0 |
| Morpheme forms differing from literal source substring | 839 | 0 |
| Zero-width morphemes | 55 across 53 words | 0 |
| Invalid source spans | 0 | 0 |

These counts are **not errors by themselves**: Kiwi can expose normalized/decomposed forms over source spans, including multiple morphemes associated with the same syllable and zero-width forms. They do show that the two adapters have different alignment representations, so offset-level boundary matching cannot replace a gold morphology annotation.

### Rule-event alignment across analyzers

The same native soft-mode traces produced **238 rule-boundary events** for cross-analyzer comparison:

| Observation | Events |
|---|---:|
| Both analyzers observed a boundary | 200 |
| Neither analyzer observed a boundary | 23 |
| Kiwi only observed a boundary | 8 |
| MeCab-Ko only observed a boundary | 7 |
| Agreement (both-observed + neither-observed) | 223 / 238 = 93.6975% |

Boundary-observation rate was 208/238 = **87.3950%** for Kiwi and 207/238 = **86.9748%** for MeCab-Ko. The high event agreement includes 23 shared non-boundary observations; it does not mean 93.7% rule correctness. Fifteen rule events disagree, and each analyzer suppresses a slightly different subset of the 238 heuristic candidate licenses. No morphology output was added to the production/default phonology path.

### Existing independent IPA-engine baseline

The same pinned-corpus multi-engine diagnostic [run 40085814704](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40085814704) retains the earlier comparative context:

| IPA path | Exact-match rate | CER | Coverage |
|---|---:|---:|---:|
| ClippyFirst native strict | 24.4068% | 17.0648% | 98.2242% |
| g2pk 0.9.4 + project IPA renderer | 24.9723% | 16.6931% | 100% |
| phonemize 2.0.1 | 20.0518% | 21.36% | 100% |
| hangul_to_ipa | 14.9464% | 30.99% | 100% |
| KoG2P + explicit label-to-IPA adapter | 14.8724% | 26.08% | 100% |
| eSpeak NG Korean | 8.1391% | 39.05% | 100% |

This is diagnostic, not normative ranking: UGTPHON is noisy user-generated text, reference conventions differ, and some engines require representation adapters. It measures Korean IPA only, not Ukrainian adaptation. On this dataset, g2pk is modestly ahead of native strict; neither that comparison nor the morphology counterfactual establishes universal superiority or NIKL correctness.

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
