# Korean–Ukrainian Phonetic System

Research-grade, machine-readable framework for Korean → Ukrainian phonetic-graphemic correspondence.

Pipeline:

KOR_ORTH → KOR_PHON → KOR_PHON_RULES → KOR_IPA → UA_PHONETIC_TARGET → UA_ORTHOGRAPHY

## Current scope

The Korean model targets contemporary Standard Korean with normative grounding in the National Institute of Korean Language and peer-reviewed Seoul Korean phonetic research. Standard pronunciation is explicitly context-sensitive; the project does not equate Hangul spelling with a one-to-one IPA string.

Modern precomposed Hangul contains 19 leading positions × 21 medial positions × 28 trailing slots = 11,172 graphic syllable blocks. Only 27 trailing positions are actual coda Jamo; the 28th is the empty-coda slot. This is a combinatorial Unicode inventory, not a phoneme or lexical inventory.

## Implemented layers

- Unicode Hangul decomposition/composition and deterministic 11,172-block generation.
- Structured Korean syllable representation.
- Ordered, traceable rule engine for:
  - final neutralization;
  - liaison/resyllabification;
  - ㅎ deletion before vowel-initial morphological material;
  - ㅎ + obstruent aspiration;
  - nasal assimilation;
  - liquid assimilation;
  - palatalization;
  - regular post-coda tensification.
- Broad/contextual IPA realization with explicit analysis-dependent vowel alternatives.
- External Ukrainian target adapter for ClippyFirst/Ukrainian-Phonetic-Inventory.
- Explainable feature-ranking layer with heuristic costs, never probabilities.
- Evidence/provenance and competing-analysis datasets.
- JSON Schemas, validation fixtures and GitHub Actions configuration.

## Scientific safeguards

The system keeps separate:
- transliteration vs transcription;
- orthography vs phonology vs phonetics;
- phoneme vs allophone;
- theoretical possibility vs phonotactic validity vs attestation;
- heuristic cost vs probability;
- source fact vs computational model assumption vs unresolved analysis.

The Ukrainian inventory remains an external source of truth rather than being copied into this repository.

## Evidence

Normative Korean pronunciation: https://www.korean.go.kr/front/page/pageView.do?page_id=P000097

Unicode Hangul model: https://unicode.org/versions/Unicode18.0.0/core-spec/chapter-18/

Cho, Jun & Ladefoged (2002): https://doi.org/10.1006/jpho.2001.0153

Kang & Han (2013): https://doi.org/10.1016/j.lingua.2013.06.002

Bang et al. (2018): https://doi.org/10.1016/j.wocn.2017.10.004

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

## Status

Version 0.3.0 is the completed research-prototype release: the computational rule/IPA path is substantially implemented, but corpus-scale lexical attestation, exhaustive morphophonological coverage, full Ukrainian orthographic realization and independent specialist review remain open research/validation layers. See docs/final-audit.md.
