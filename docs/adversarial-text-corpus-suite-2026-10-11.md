# Expanded adversarial Korean text corpus suite

The suite contains 165 TXT inputs: the original 15 broad corpora plus 150 additional corpora (30 families × 5 files). The 150 rule-family files were revised after the first engine audit: example forms are now quoted and isolated rather than being accidentally attached to arbitrary particles/endings by the corpus generator. This prevents artificial forms such as `같이와` from contaminating the test input.

The family IDs are organizational groups, not a one-to-one mapping to numbered provisions of the official Standard Pronunciation Rules. The files are discovery inputs, not gold-standard output files. Exact expected pronunciations must be mapped to a provision and verified against the National Institute of Korean Language before being promoted to gold regressions.

Run:

```sh
node --test tests/adversarial-text-corpus-suite.test.mjs
```

The suite checks inventory, uniqueness, substantial Korean text, and crash-free engine processing. The audit diagnostic reports per-eojeol unresolved cases; an unresolved result is not automatically a bug because the engine intentionally withholds guesses when morphology or lexical evidence is missing.
