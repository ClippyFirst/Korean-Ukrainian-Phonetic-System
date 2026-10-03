

## Exhaustive 11,172-row master table

The project now includes a deterministic generator for the complete modern Hangul syllable-block space:

**19 × 21 × 28 = 11,172 rows**

The human-facing projection is exactly three columns:

`Korean | IPA | Ukrainian`

IPA is a primary verification column: every Ukrainian rendering is inspectable through the project's canonical broad-IPA intermediate representation. The table is a canonical **isolated-syllable** rendering derived from the IPA-centered model. It is exhaustive for the modern Unicode Hangul syllable inventory, but it is not a lexical dictionary and does not erase Korean context-sensitive pronunciation.

See [docs/master-table.md](docs/master-table.md) for the semantics, limits and reproducibility contract.

Generate locally:

```powershell
python scripts/generate_master_table.py
```

This produces:

- `data/derived/korean_ipa_ukrainian_master.csv`
- `data/derived/korean_ukrainian_master_audit.csv`

GitHub Actions also publishes the generated files as a build artifact.

# Korean–Ukrainian Phonetic System

Research-grade, machine-readable framework for Korean → Ukrainian phonetic-graphemic correspondence.

Pipeline:

KOR_ORTH → KOR_PHON → KOR_PHON_RULES → KOR_IPA → UA_PHONETIC_TARGET → UA_ORTHOGRAPHY

## Implemented scope

- Unicode Hangul decomposition/composition, canonical NFD decomposition metadata and deterministic generation of all 11,172 modern precomposed Hangul syllable blocks.
- Machine-readable modern Jamo inventory with canonical and compatibility codepoints.
- Structured onset/nucleus/coda representation, including 11 complex codas as component sequences.
- Canonical rule registry shared by code, CSV, ordering and scope data: R001–R015.
- Context-sensitive rules with explicit boundary/morphological gating; ㄴ-insertion is disabled unless explicitly licensed.
- Broad IPA realization with analysis-dependent vowel alternatives. Narrow IPA is explicitly unavailable until an acoustic/allophonic model exists.
- External Ukrainian target adapter with segmentwise feature-based candidate ranking and target grapheme retrieval from UPI 0.8.0.
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

The Korean model is grounded in the National Institute of Korean Language standard-pronunciation framework and peer-reviewed Seoul Korean phonetics. Complex-coda liaison, assimilation chains and phrase-level n-insertion are explicitly conditioned rather than applied to arbitrary adjacent syllables.

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
- complex-coda assimilation chains: 긁는, 뚫네, 핥네;
- nasal/liquid assimilation;
- palatalization;
- tensification;
- aspiration;
- explicitly licensed n-insertion and phrase boundaries;
- adversarial non-insertion: 먹이;
- unsupported IPA and unknown-boundary negative cases;
- exact generated-artifact reproducibility;
- cross-file rule-ID and evidence foreign-key validation.

## Status

v0.5.0 closes the computational readiness layers identified by the initial specification audit: strict API validation, UPI mapping-penalty integration, explicit Standard Pronunciation coverage for §§9–30, licensed morphology-sensitive rules, expanded adversarial tests, a specification coverage matrix, and a formal Ukrainian target-layer contract. It still does not claim empirical corpus coverage, acoustic narrow-IPA validation, independent expert adjudication, or gold-corpus optimisation where the required empirical datasets are not present.


## Full-readiness boundary

The repository is computationally research-ready within its documented evidence boundary. It deliberately does not manufacture lexical attestations, pronunciation-corpus statistics, acoustic narrow IPA, or a universal Ukrainian spelling. Conditional Korean rules require explicit linguistic licensing; the Ukrainian target inventory remains external and version-pinned.


## Verification

The v0.5.0 implementation candidate was verified by the repository test workflow with 61 passing tests and by the multi-version CI workflow on Python 3.11, 3.12 and 3.13.
