# Multi-level research corpus architecture

## Purpose

generate_korean_corpus.py converts the Korean phonetic-graphemic model into versionable, machine-readable derived data.

CSV is the canonical derived representation. XLSX is optional and is intended for inspection, filtering and presentation rather than as a source of truth.

## Layers

### 1. Grapheme/Jamo

korean_graphemes.csv represents the modern compatibility-Jamo inventory and complex coda units. It keeps contextual realization fields separate from the canonical isolated correspondence.

### 2. Hangul syllable blocks

korean_syllables_11172.csv contains the complete modern precomposed Hangul space:

19 × 21 × 28 = 11,172

Each row is generated algorithmically from the Unicode composition formula and validated by decomposition/recomposition.

This is a graphic/combinatorial inventory. It is not a lexical dictionary.

### 3. Sequences and words

sequences.csv is an input layer for attested words, phrases and cross-syllable contexts. The generator does not synthesize lexical attestations.

This is where liaison, assimilation, tensification, aspiration, liquid assimilation, n-insertion and other context-sensitive phenomena should be represented when explicitly licensed by the model.

### 4. Rules

rules.csv is the explicit rule registry. Rule identifiers can be referenced from grapheme, syllable and sequence rows.

### 5. Sources

sources.csv is the provenance registry. Source identifiers can be referenced from all evidence-bearing layers.

## Representation contract

The project keeps the following conceptual path distinct:

KOR_ORTH → KOR_PHON → KOR_PHON_RULES → KOR_IPA → UA_PHONETIC_TARGET → UA_ORTHOGRAPHY

The generator may populate a canonical isolated-syllable projection from canonical_correspondence.csv, but it does not interpret that projection as a universal connected-speech pronunciation or a normative Ukrainian transcription standard.

## Empty fields are deliberate

An empty contextual field means that the corresponding evidence/model layer has not supplied a value. It is not permission for the generator to infer one.

The generator does not invent:

- narrow acoustic IPA;
- lexical attestations;
- context-free pronunciations for connected speech;
- morphology-sensitive rule applications;
- Ukrainian normative spellings;
- probabilities where only qualitative evidence exists.

## Reproducibility

Run:

    python scripts/generate_korean_corpus.py --strict

For an Excel inspection copy:

    python scripts/generate_korean_corpus.py --strict --xlsx

The generated validation report must be inspected before treating the derived corpus as a release artifact.
