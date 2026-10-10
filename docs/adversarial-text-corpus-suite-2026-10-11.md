# Expanded adversarial Korean text corpus suite

Expanded the original 15 broad TXT corpora with **150 additional rule-family TXT corpora**: 30 topic/rule families × 5 separate files each. Total corpus inputs: **165 files** (excluding the index).

The new files are under `tests/fixtures/adversarial-corpora/` and use names like `rule-01-01-general-principles.txt`. Families include coda neutralization, complex codas, ㄺ/ㄼ exceptions, liaison, palatalization, nasalization, liquid assimilation, ㅎ aspiration, fortition, ㄴ insertion, connected speech, inflection, names/loanwords, rule chains, and negative controls.

**Scope caveat:** numeric family IDs are corpus grouping IDs, not a claim that each file maps one-to-one to one numbered paragraph of the official Standard Pronunciation Rules. Rule interactions are intentional. A separate standards crosswalk should identify the exact provision and verify each candidate example against the National Institute of Korean Language before any item becomes a gold-standard expected output.

The files are raw inputs, not pronunciation gold standards. They do not encode a single expected Ukrainian output, so guessed engine output cannot become its own oracle.

## Validation

```sh
node --test tests/adversarial-text-corpus-suite.test.mjs
```

The test checks all 165 files for uniqueness, substantial Korean text, five-per-family counts, and crash-free processing through the current engine. This is a fixture-integrity/runtime smoke test, not proof that every pronunciation or Ukrainian approximation is correct.
