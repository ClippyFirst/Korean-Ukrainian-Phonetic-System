# Research morphology adapters (2026-10-24)

**Status:** integrated adapter boundary; optional engines and corpus benchmark remain environment-dependent.  
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
- **MeCab-Ko** supports `mecab-ko-python` (`mecab_ko.Mecab().pos`) and a compatible legacy `MeCab.Tagger().parseToNode()` API. Installation and dictionary setup differ by platform; this repository does not bundle a native binary or dictionary. Install the optional `research-mecab-ko` extra and configure a Korean dictionary for your OS before use. If the binding is unavailable, the benchmark records a blocker instead of switching engines.

Both return form, tag, source offsets and (only when exposed reliably by the API) a lemma. Confidence remains `unscored`; a POS tag is not a confidence estimate.

## Diagnostic benchmark

The repository includes an unlabelled diagnostic input list at `data/korean/morphology-review-corpus.txt`. It contains ambiguous and control forms for inspection only; it is **not** gold annotation and must not be used to claim accuracy. Run:

```powershell
uv run python scripts/benchmark_research_morphology.py data/korean/morphology-review-corpus.txt --output artifacts/morphology-diagnostic.jsonl
```

The output records per-engine availability, elapsed time, tokenization, offsets, and errors. It is deliberately **not** an accuracy score: accuracy requires a versioned gold set with independently reviewed morpheme boundaries/POS labels. Do not use token count or successful execution as a proxy for accuracy.

## Acceptance gates before morphology may license phonological rules

1. Build a gold subset with source text, morpheme spans, lemma/POS, annotator, source and adjudication status.
2. Report boundary precision/recall/F1 and POS accuracy against that gold set; stratify by rule-relevant boundaries (formal endings, lexical/substantive morphemes, compounds).
3. Measure false rule permissions as a separate safety metric. In particular, analyzer segmentation alone must not automatically choose NIKL §13/14 versus §15.
4. Keep exact NIKL-backed pair licenses higher priority than analyzer hypotheses. Uncertain and conflicting outputs remain unresolved.
5. Add a separately reviewed rule-licensing adapter and tests before any morphology result can affect IPA.
6. Maintain Python/browser parity and keep the public practical service on its existing JS engine. No adapter is imported by the browser bundle.

## Known limitations

- This integration creates an adapter boundary, not a claim that both engines have been installed or run in CI.
- MeCab-Ko's Python bindings/dictionary are OS-sensitive and may require platform-specific setup.
- Kiwi/MeCab segmentation conventions differ; raw tag strings are retained instead of being collapsed into a possibly incorrect universal POS inventory.
- Lemma is nullable and is not guessed from surface form.
- The benchmark currently requires a local corpus path; no corpus or labels are fabricated by this change.
