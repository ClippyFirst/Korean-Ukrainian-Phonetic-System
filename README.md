# Korean–Ukrainian Phonetic System

Research-grade, machine-readable framework for Korean → Ukrainian phonetic-graphemic correspondence.

Pipeline:

KOR_ORTH → KOR_PHON → KOR_PHON_RULES → KOR_IPA → UA_PHONETIC_TARGET → UA_ORTHOGRAPHY

## Implemented scope

- Unicode Hangul decomposition/composition and deterministic generation of all 11,172 modern precomposed Hangul syllable blocks.
- Structured onset/nucleus/coda representation, including 11 complex codas as component sequences.
- Canonical rule registry shared by code, CSV and ordering data: R001–R009.
- Context-sensitive rules with explicit boundary/morphological gating.
- Broad IPA realization with analysis-dependent vowel alternatives; the API does not pretend to provide a complete acoustic narrow-IPA model.
- External Ukrainian target adapter with segmentwise feature-based candidate ranking.
- Explicit top-ranked candidate and Ukrainian graphemic rendering when the external target inventory is available.
- Evidence, competing-analysis metadata, JSON Schemas, validation fixtures, adversarial regression tests and GitHub Actions.

## Important interpretation

11,172 is a Unicode combinatorial graphic inventory, not a phoneme inventory, lexical vocabulary or set of unique pronunciations.

The system distinguishes:
- transliteration vs transcription;
- orthography vs phonology vs phonetics;
- phoneme vs allophone;
- theoretical possibility vs phonotactic validity vs attestation;
- heuristic cost vs probability;
- documented fact vs model assumption vs unresolved analysis.

The Korean model is grounded in the National Institute of Korean Language standard-pronunciation framework and peer-reviewed Seoul Korean phonetics. Complex-coda liaison and phrase-level n-insertion are explicitly conditioned rather than applied to arbitrary adjacent syllables.

## API

- decompose_hangul
- compose_hangul
- generate_syllables
- analyze_korean
- phonologize_korean
- phoneticize_korean
- map_ipa_to_ukrainian
- rank_ukrainian_candidates
- transliterate_korean

## Validation highlights

The regression corpus includes:
- simple coda neutralization;
- liaison;
- complex-coda liaison: 넋이, 값이, 앉아, 닭을, 젊어;
- ㅎ-complex-coda behavior;
- nasal/liquid assimilation;
- palatalization;
- tensification;
- aspiration;
- n-insertion and explicit phrase boundaries;
- unsupported IPA and unknown-boundary negative cases;
- cross-file rule-ID and evidence foreign-key validation.

## Evidence

Normative Korean pronunciation: https://www.korean.go.kr/front/page/pageView.do?page_id=P000097

Unicode Hangul model: https://unicode.org/versions/Unicode18.0.0/core-spec/chapter-18/

Cho, Jun & Ladefoged (2002): https://doi.org/10.1006/jpho.2001.0153

Kang & Han (2013): https://doi.org/10.1016/j.lingua.2013.06.002

Bang et al. (2018): https://doi.org/10.1016/j.wocn.2017.10.004

## Status

This repair release hardens v0.3.0 against the demonstrated internal inconsistencies. It does not claim exhaustive lexical coverage, publication-final phonological adjudication, corpus-optimized correspondence weights, or a complete Ukrainian orthographic grammar for all Korean proper names/loanwords. Those remain explicit research extensions.
