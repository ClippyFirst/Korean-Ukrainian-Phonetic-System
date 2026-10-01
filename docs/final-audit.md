# Final audit — 2026-10-01

## Release status

**Version 0.4.1 — adversarially hardened research prototype.**

This audit found additional issues that were not covered by the previous 41-test v0.4.0 suite. They were repaired on branch `audit/adversarial-v0.4.1` and are now covered by new regression tests. The project remains a research prototype, not a publication-final Korean→Ukrainian standard.

## New adversarial findings and repairs

1. **False narrow-IPA precision.** v0.4.0 exposed `ipa_level="narrow"` while returning broad/rule-supported output under a misleading status. v0.4.1 now rejects narrow IPA explicitly until an acoustic/allophonic model exists.
2. **Complex-coda assimilation ordering.** Complex codas such as `ㄺ`, `ㅀ`, `ㄾ` were not normalized to their representative coda before nasal/liquid assimilation. The rule engine now evaluates the representative coda in R005/R006. This covers adversarial chains such as `긁는`, `뚫네`, `핥네`.
3. **Over-permissive ㄴ-insertion.** v0.4.0 could apply R009 merely because an adjacent syllable began with a zero onset and /i/-initial nucleus. v0.4.1 requires explicit `n_insertion_licensed=True`, reflecting the fact that NIKL treats ㄴ-insertion as non-automatic and lexically/morphologically conditioned.
4. **Hangul decomposition metadata.** `decompose_hangul` now exposes canonical NFD Jamo and Unicode codepoints, and the compatibility-Jamo inventory stores explicit compatibility codepoints.
5. **Ukrainian target orthography contract.** The Korean repository no longer contains a hard-coded Ukrainian IPA→grapheme inventory. The adapter retrieves graphemes from the external UPI 0.8.0 data export and rejects an incompatible UPI version explicitly.
6. **Generated-artifact reproducibility.** Tests now compare the committed 11,172-row CSV exactly with the deterministic generator, rather than checking only row count and endpoints.
7. **Adversarial validation corpus.** Added explicit negative/conditional cases for `먹이`, `무슨 일`, `긁는`, `뚫네`, `핥네` and cross-word `몇 년`.

## Evidence boundary

NIKL documents complex-coda liaison such as `넋이[넉씨]`, `앉아[안자]`, `닭을[달글]`, `젊어[절머]`, and `값을[갑쓸]`. citeturn8search4turn10search6

NIKL also documents `뚫네[뚤네→뚤레]` as coda simplification plus liquid assimilation, which directly motivated the R005/R006 adversarial repair. citeturn2search0turn2search7

NIKL states that ㄴ-insertion is not obligatory in every phonologically similar environment and gives both lexical/morphological and connected-phrase conditioning; this is why v0.4.1 does not silently enable R009. citeturn7search0turn7search1

NIKL §23 covers tensification after representative coda classes, including complex codas such as ㄳ and ㄺ. citeturn1search3

## Verification

Previous fresh GitHub Actions verification: **run #92 — success, 41 tests passed** on the final v0.4.0 verification tree immediately before PR #2 was merged.

v0.4.1 contains new code and therefore **must not inherit run #92 as proof of correctness**. A fresh CI run on the v0.4.1 branch is required before this branch can be considered verified.

## Remaining important research gaps

- exhaustive lexical pronunciation-dictionary coverage;
- corpus-scale attestation/frequency statistics;
- full morphophonological conditioning and exception datasets;
- remaining Standard Pronunciation Rules not represented as computational rules (including several §24–§30 environments);
- complete acoustic/narrow-IPA modelling;
- independent expert adjudication of competing analyses;
- empirical optimisation and gold-corpus evaluation of correspondence weights;
- full Ukrainian orthographic realization including context-sensitive palatalization/iotation/ь/я/ю/є/ї and sequence-level orthography;
- end-to-end validation against a real Korean pronunciation corpus and a gold Ukrainian-output corpus.

## Scientific status

**Research-demo capable after fresh v0.4.1 CI verification; not publication-final.**
