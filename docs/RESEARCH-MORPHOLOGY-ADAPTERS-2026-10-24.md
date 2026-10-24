# Research morphology adapters (2026-10-24)

**Status:** integrated research adapters; real-engine smoke passed, and a same-corpus paired IPA/morphology benchmark is now being added. The full-corpus benchmark remains pending CI evidence.  
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
