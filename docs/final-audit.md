# Final audit — 2026-10-01

## Release status

**Hardened research prototype — post-audit repair release.**

The previous v0.3.0 audit overstated completion. This repair release fixes demonstrated internal inconsistencies and adds adversarial regression coverage, but it is not an exhaustive publication-final Korean→Ukrainian standard.

## Critical repairs completed

1. **Canonical rule registry.** R001–R009 now have identical semantics in `rules.py`, `rules.csv`, `rule_ordering.csv`, tests and documentation.
2. **Complex coda liaison.** The 11 complex codas are decomposed into component consonants for liaison. The second component moves to the following onset where the standard rule licenses it; ㄳ/ㄽ/ㅄ use the documented [ㅆ] realization in liaison. ㅎ-bearing codas are handled separately rather than by blindly moving the whole cluster.
3. **Boundary conditioning.** Contextual rules no longer fire when `boundary_mode="unknown"`. Whitespace is represented as a word boundary. Phrase-level n-insertion is explicitly opt-in through `boundary_mode="phrase"`.
4. **Target selection.** The pipeline now exposes the top-ranked segmentwise candidate and a final Ukrainian graphemic rendering when the external Ukrainian inventory is available. The score remains a heuristic cost, never a probability.
5. **Adversarial validation.** Cross-file rule IDs, schema instances, evidence foreign keys, complex-coda examples, phrase boundaries and unsupported IPA are tested.

## Linguistic evidence

NIKL §14 explicitly gives `넋이[넉씨]`, `앉아[안자]`, `닭을[달글]`, `젊어[절머]`, `값을[갑쓸]`, and `없어[업써]` as complex-coda liaison examples. citeturn0search3turn1search2

NIKL also distinguishes ㅎ deletion before vowel-initial formal morphology from complex-coda simplification before consonants, e.g. `뚫네[뚤네→뚤레]`. citeturn1search1turn1search5

NIKL's 2026 guidance states that ㄴ-insertion can occur in a connected phrase such as `무슨 일 → [무슨 닐]`, while a phrase boundary can block the connected-speech environment. citeturn0search0turn0search5

## Remaining non-blocking research extensions

- exhaustive lexical pronunciation-dictionary coverage;
- corpus-scale attestation/frequency statistics;
- complete morphophonological conditioning for all lexical classes;
- complete acoustic/narrow-IPA modeling;
- independent expert adjudication of competing analyses;
- full Ukrainian orthographic grammar for Korean proper names/loanwords;
- empirical optimization and gold-corpus evaluation of correspondence weights.

## Verification status

A fresh GitHub Actions run is required after this repair commit. The previous CI success cannot be used as evidence for these new changes.

## Scientific status

**Ready for research demonstration and further specialist review; not yet publication-final.**
