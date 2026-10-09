# Korean phonology edge-case audit — 2026-10-09

## Scope and confidence

This audit extends the runtime review with a literature-informed review of high-risk pronunciation processes. The service is a practical Korean-to-Ukrainian reading aid, not a complete Korean grapheme-to-phoneme (G2P) system. The implementation is deliberately conservative where word identity, morphology, prosodic grouping, or variant selection cannot be inferred from Hangul characters alone.

The Undermind literature review found broad agreement that Korean G2P benefits from a staged pipeline, lexical pronunciation data, and morphological/prosodic boundary information rather than a single context-free rewrite table. Relevant work includes Yoon & Brew (2006), “A linguistically motivated approach to grapheme-to-phoneme conversion for Korean” [Yoo06]; Jun (2015), “Korean n-insertion: a mismatch between data and learning” [Jun15]; Jun (2021), “Morphophonological gradience in Korean n-insertion” [Jun21]; Jeon (2022), “Exploring Variability in Compound Tensification in Seoul Korean” [Jeo22]; Choi, Kwon & Kim (2025), “Combining Autoregressive Models and Phonological Knowledge Bases for Improved Accuracy in Korean Grapheme-to-Phoneme Conversion” [Cho25]; and Holliday, Turnbull & Eychenne (2017), “K-SPAN: A lexical database of Korean surface phonetic forms and phonological neighborhood density statistics” [Hol17].

## Fixes made in this audit

1. **Complex coda + ㅎ aspiration:** the browser and Python engines now retain the first consonant of a complex coda while aspirating the second where licensed: 읽히다 [일키다], 앉히다 [안치다], 넓히다 [널피다].
2. **Simple coda + ㅎ aspiration:** Python R004 now considers the written coda and its final representative. It preserves a distinct morphophonemic outcome for ㅈ+ㅎ → ㅊ (맞히다), while representative-based cases such as 옷하고 produce ㅌ.
3. **Overbroad n-insertion:** the Python rule now refuses to insert ㄴ/ㄹ after an open syllable merely because a global license flag is enabled.
4. **Contextual ㅢ:** in broad surface IPA and the browser practical output, ㅢ in a syllable with a consonant onset is realized as [i], e.g. 희망 [히망]. Phonemic IPA retains the underlying representation. Syllables with onset ㅇ and nucleus ㅢ remain unresolved when lexical/grammatical context is missing.
5. **Python IPA word boundaries:** the IPA renderer now uses syllable dots within a word and preserves spaces between eojeol rather than flattening the entire input into one syllable chain.
6. **Regression corpus:** new tests cover complex-coda aspiration, open-syllable false-positive n-insertion, consonant-onset ㅢ, and word-boundary IPA spacing.

## Research-backed cautions

### N-insertion is variable

N-insertion should not be presented as a universally categorical rewrite. Jun's dictionary, survey, and novel-word experiments find systematic tendencies, but also lexical blockers, variable speaker judgments, and differences between existing words and novel forms [Jun15, Jun21]. The current Python API therefore requires explicit licensing and now also requires a preceding coda. That is a conservative guard, not a complete predictive model. A future implementation should support multiple candidate outputs or a probability/confidence estimate conditioned on morpheme boundaries and lexical entries. The browser engine does not currently infer n-insertion.

### Compound tensification is not fully predictable

Compound tensification is affected by lexical, phonological, frequency, and boundary-strength factors, and it has lexicalized exceptions [Jeo22]. The project keeps compound/morpheme-conditioned rule paths explicitly licensed instead of claiming that a broad consonant-only condition predicts every compound. The default browser rule for regular within-word tensification is not a model of all compound tensification.

### Lexical and morphological exceptions remain a first-class gap

The current implementation does not have a comprehensive Korean lexicon or morphological analyzer. Cases that deserve dictionary/morphology-backed tests include 값없다 [가법따], 의견란 [의견난], the ㄺ + ㄱ verbal-stem pattern (e.g. 읽고 [일꼬], 맑게 [말께]) versus ordinary ㄺ coda neutralization, and lexical variation in complex-coda simplification. These should not be generalized from one word to every string with the same final cluster. Add them as lexical entries or explicitly licensed morphological rules with provenance, not as broad string substitutions.

### Multiple standard pronunciations and dictionary disagreement

Choi, Kwon & Kim (2025) report that dictionary references can contain multiple standard pronunciations, training labels can disagree with official dictionary entries, and hard phonological constraints can override valid lexical exceptions [Cho25]. Their study found a rule-based baseline substantially less accurate than their best autoregressive model on their evaluation corpus; it does not establish that all rule-based systems perform equally poorly, but it reinforces the need to evaluate against a documented corpus and retain legitimate variants. A future release should allow an output to be a set of licensed variants rather than silently forcing a single reading.

### Use a lexical corpus as a benchmark, not an infallible oracle

K-SPAN contains 63,836 forms (77.4% of its source lemmas) and provides modern and conservative surface-pronunciation forms [Hol17]. It is useful for building a held-out lexical test set, but it is not exhaustive, not a complete inflected-form lexicon, and not a narrow phonetic record of every speaker. Benchmark comparisons must state which convention and pronunciation variant are being scored.

## Test protocol to continue

For each new rule, record:

- rule ID and domain (within morpheme, morpheme boundary, eojeol boundary, or phrase);
- whether it is categorical, variable, lexically licensed, or unresolved;
- source/standard clause and date checked;
- written input, expected surface Hangul/phonological sequence, broad IPA, practical Ukrainian output, and accepted variants;
- negative controls that must *not* trigger the rule;
- JS/Python parity where both engines claim support.

Do not promote a rule to “fully supported” because a single positive example passes. Keep separate statuses for normative rule, runtime support, corpus coverage, and confidence.

## Bibliographic links

- [Yoo06] Yoon, K. & Brew, C. (2006). *A linguistically motivated approach to grapheme-to-phoneme conversion for Korean*. Computational Speech & Language. https://doi.org/10.1016/j.csl.2005.03.002
- [Jun15] Jun, J. (2015). *Korean n-insertion: a mismatch between data and learning*. Phonology. https://doi.org/10.1017/S0952675715000275
- [Jun21] Jun, J. (2021). *Morphophonological gradience in Korean n-insertion*. Glossa. https://doi.org/10.5334/GJGL.1401
- [Jeo22] Jeon, H.-S. (2022). *Exploring Variability in Compound Tensification in Seoul Korean*. Language and Speech. https://doi.org/10.1177/00238309221095479
- [Cho25] Choi, S.-K., Kwon, H.-C. & Kim, M. (2025). *Combining Autoregressive Models and Phonological Knowledge Bases for Improved Accuracy in Korean Grapheme-to-Phoneme Conversion*. IEEE Access. https://doi.org/10.1109/ACCESS.2025.3581981
- [Hol17] Holliday, J., Turnbull, R. & Eychenne, J. (2017). *K-SPAN: A lexical database of Korean surface phonetic forms and phonological neighborhood density statistics*. Behavior Research Methods. https://doi.org/10.3758/s13428-016-0836-8


## Follow-up implementation: lexical pronunciation layer

The repository now includes `data/korean/lexical_pronunciations.csv`, a sourced, exact-form lexicon used by both the browser and Python pipeline. It contains selected entries for 값없다, 의견란, and adversarial ㄺ forms (읽고/읽다/읽어/읽는/읽지, 맑게/맑고/맑다, 밝기, 닭고기). The entry is matched by the complete eojeol; its pronunciation is not generalized to every word with the same written coda.

The browser shows the lexical rule in the trace and keeps the original Hangul decomposition visible. The Python pipeline applies the same surface Hangul pronunciation to its phonological layer and records a `LEXICON` trace with the exact source URL and rationale. Regression cases V033–V044 were added to the validation corpus, and sources S007–S011 record official NIKL references.

**Important target-side qualification:** the Korean pronunciation of 의견란 is documented as [의ː견난], but `ийґйоннан` is an author-designed Ukrainian approximation, not an official or independently validated Ukrainian standard. The entry is therefore marked `target_status=provisional`; the browser explicitly labels it as requiring target-side review. The phonological fact and the Ukrainian rendering must not share one confidence label.

The current lexicon is a deliberately small, auditable seed—not a comprehensive dictionary or morphological analyzer. Exact-form matching means unseen inflections and compounds remain uncovered until added with a source, positive case, negative control, and accepted variants. Future work should support multiple licensed pronunciations where official sources permit them.


### Explicit morphological rule for ㄺ + ㄱ

The Python rule engine now also exposes `R016:verb_stem_rieul_giyeok_suffix`. It retains ㄹ and fortifies the following ㄱ only when a caller explicitly licenses the verbal-stem/ending analysis and selects a morpheme-aware boundary mode. Without that license, the rule is disabled; the engine does not guess that a given ㄺ form is a verb stem. This is intentionally separate from the exact-form lexical entries, and it must not spread to noun forms such as 닭고기 [닥꼬기]. A regression test checks both the licensed and unlicensed paths.
