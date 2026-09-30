# Korean → Ukrainian Phonetic-Graphemic System — Research-Grade Design

## Purpose
Build a reproducible scientific model for contemporary Standard Korean → Ukrainian phonetic-graphemic correspondence. The system is not a letter-for-letter transliterator. It separates orthography, phonology, ordered morphophonology, surface phonetics/IPA, feature correspondence, Ukrainian target phonology, and Ukrainian orthography.

## Canonical pipeline
KOR_ORTH → KOR_PHON → KOR_PHON_RULES → KOR_IPA → UA_PHONETIC_TARGET → UA_ORTHOGRAPHY
The Korean layer is authoritative for Korean decomposition and pronunciation. The Ukrainian layer is an external dependency/adapter to ClippyFirst/Ukrainian-Phonetic-Inventory; it is not duplicated.

## Linguistic model
1. Unicode modern Hangul: 19 choseong × 21 jungseong × 28 trailing slots = 11,172 precomposed syllable blocks. The 28 trailing slots include the empty coda; therefore 27 are actual T Jamo. This is a graphic combinatorial inventory, not a phoneme inventory.
2. Distinguish Jamo, syllable block, phoneme, allophone, syllable, morpheme, word and orthographic sequence.
3. Represent standard Korean's 19 consonants and 21 vowel symbols while allowing phonological analyses with different surface/underlying representations. Vowel mergers and /ø, y/ ~ [we, wi] variation remain analysis-dependent.
4. Korean stops and affricates use a three-way laryngeal contrast (lenis/fortis/aspirated) while present-day Seoul cue weighting is represented as changing rather than timeless.
5. Contextual rules are ordered, data-driven and provenance-bearing: final neutralization, liaison/resyllabification, nasalization, liquid alternations, palatalization, tensification, aspiration, ㅎ interactions, vowel/glide alternations and morphophonological boundaries where supported.
6. Surface IPA is separated into phonemic, broad and narrow layers. Narrow IPA is never invented merely to make the output look precise.
7. Each rule stores rule_id, input, output, environment, domain, ordering, examples, source, evidence status, confidence and analysis dependence.
8. Competing analyses are retained rather than flattened.

## Computational architecture
- hangul.py: NFC validation, decomposition/composition and 11,172 generator.
- phonology.py: data loading and structured Korean syllable representation.
- rules.py: explicit rule objects and ordered application.
- ipa.py: broad/contextual IPA realization with explicit variation.
- correspondence.py: feature-space distance and candidate ranking.
- ukrainian_adapter.py: optional runtime adapter for the external Ukrainian inventory package.
- pipeline.py: public staged API; no stage silently consumes a later stage.
- CSV data remain the inspectable source of truth; generated tables are derived artifacts.

## Candidate model
Candidate ranking is an explainable heuristic cost, never a probability. The total cost is composed of feature distance, Korean-context/positional compatibility, Ukrainian phonotactic legality, Ukrainian orthographic legality, sequence/context consistency and uncertainty penalties. Weights are versioned and labeled heuristic.

## Evidence model
Every non-trivial claim has source_id, claim, domain, source_type, locator where available, status, confidence and notes. Evidence hierarchy: normative → peer-reviewed → academic reference → computational/corpus → database → secondary.
Normative Korean pronunciation is grounded in NIKL Standard Pronunciation Rules. Peer-reviewed phonetics documents variation and sound change, especially contemporary Seoul stop cue reweighting. Unicode is the authority for Hangul combinatorics.

## Validation
- Unicode NFC and Hangul decomposition/composition;
- 11,172 generated blocks;
- Jamo/inventory integrity;
- rule preconditions and ordering;
- coda neutralization, liaison, nasalization, liquidization, palatalization, tensification and aspiration;
- explicit uncertainty and IPA layer separation;
- target-adapter failure modes;
- candidate ranking determinism;
- provenance/reference integrity;
- invalid Unicode/Jamo/phonotactic inputs;
- regression fixtures.

## Scientific status
The implementation is a research prototype, not a claim that every lexical item, dialectal realization or disputed analysis has been exhausted. Corpus attestation and expert review remain explicit future-validation layers when primary data are unavailable.