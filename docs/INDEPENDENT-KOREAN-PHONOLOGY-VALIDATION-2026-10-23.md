# Independent Korean phonology validation: UGTPHON intake

**Status (2026-10-23):** benchmark adapter added on branch `research/ugtphon-independent-validation-2026-10-23`; execution against the full external corpus has not been run in this environment. This is an opt-in diagnostic and does not alter production outputs or the vendored third-party G2P implementation.

## Why this benchmark

The project must validate its own research engine against independent evidence. The third-party `g2pK` implementation is a comparator only, not the gold authority and not a target to modify.

UGTPHON publishes a Korean test split with **275 sentence rows** in the inspected upstream revision: 107 from `multilexnorm2026` and 168 from `dc_inside`. Its Korean subset is licensed under Apache-2.0 according to its per-language `ko/LICENSE`; see the upstream repository for the full license and provenance. The corpus provides raw text, canonical normalization, sentence-level IPA, and token-aligned IPA. The token alignment makes a first external diagnostic possible without pretending this noisy-text benchmark is a normative dictionary.

- Dataset: https://github.com/naver-ai/UGTPHON
- Korean split: https://github.com/naver-ai/UGTPHON/tree/main/ko
- Per-language license: https://github.com/naver-ai/UGTPHON/blob/main/ko/LICENSE
- Paper: https://arxiv.org/abs/2609.27205
- Upstream sources include KoMultiText and MultiLexNorm++; cite them when using the dataset.

The inspected `ko/test.json` had 275 rows, including 107 `multilexnorm2026` and 168 `dc_inside` samples. It contains informal user-generated text and must be treated as a stress-test corpus, not as a clean standard-pronunciation authority. The dataset's IPA convention also differs in detail from the project's broad IPA, so scores are diagnostic.

## Run

Obtain the dataset under its upstream terms; do not use a guessed download URL or commit raw user-generated text into this repository. From the repository root:

```sh
python -m pip install -e .
python scripts/benchmark_ugtphon_ko.py --corpus /path/to/UGTPHON/ko/test.json --output artifacts/ugtphon-ko-test-report.json
```

The script deliberately performs no network access. It scores Hangul-only canonical tokens, compares the engine's broad IPA to each comma-separated gold alternative, and reports exact-match rate, character error rate, skipped tokens, engine errors, and up to 50 worst mismatches. The normalization removes syllable boundaries, affricate tie bars, and selected narrow vowel-quality diacritics, but preserves fortis, aspiration, length, and unreleased-stop markers.

## Interpretation limits

- This is a **diagnostic external comparison**, not a release gate. Do not set a pass threshold until the IPA conventions and the distribution of error classes have been adjudicated.
- Token-wise analysis cannot validate cross-word phonology, prosody, or sentence boundary behavior.
- UGTPHON's user-generated text includes slang and normalization cases; canonicalization errors and pronunciation errors must be distinguished.
- A low score must not trigger blind changes to the engine. Classify each mismatch as source annotation/convention, text normalization, morphology/context, project IPA inventory, or a genuine engine defect.
- A high score does not prove normative accuracy.
- This validates Korean IPA only. Ukrainian target selection and Ukrainian practical orthography require a separate, blinded target-layer review packet and acceptance report.
- Never treat a g2pK disagreement alone as a defect. Adjudicate with NIKL's Standard Pronunciation Rules, dictionary/Q&A attestations, and documented context.

## Validation ladder

1. **Structural benchmark validation:** corpus schema, IDs, split identity, Unicode, and parser invariants.
2. **External token IPA diagnostic:** exact match, normalized CER, per-token mismatch export; report denominators and skipped cases.
3. **Normative rule matrix:** NIKL-attested examples grouped by rule and environment, with direct-attestation vs rule-derived labels.
4. **Context/morphology suite:** word boundary, phrase boundary, homographs, `의`, loanwords, proper names, contractions, and sentence-level examples.
5. **Ukrainian target review:** independent reviewers see Korean context + adjudicated IPA, but not the current Ukrainian output; they assess whether the selected Ukrainian approximation follows the declared inventory and rendering rules.
6. **Release decision:** only after independent source evidence and target review are recorded; CI alone is insufficient.

## Current acceptance status

- External data discovered and source/license inspected: **DONE_VERIFIED**.
- Benchmark adapter and unit tests authored: **implemented; CI verification pending**.
- Run against actual 275-row corpus: **BLOCKED** until the dataset is obtained in a permitted environment; no live download or corpus execution was available here.
- Independent normative IPA gold corpus: **TODO / specialist adjudication**.
- Independent Ukrainian target review: **TODO / specialist adjudication**.
