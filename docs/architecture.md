# Architecture

Hangul Unicode → KOR_ORTH → canonical L/V/T decomposition → KOR_PHON → ordered contextual rules → KOR_IPA → feature extraction/distance → Ukrainian target candidates → Ukrainian phonotactics/orthography.

Every stage is separately representable. The Python API is a reference implementation, not a substitute for the scientific datasets, provenance and methodology.
