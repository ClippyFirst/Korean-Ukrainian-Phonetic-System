# Korean–Ukrainian Phonetic System

Research-grade, machine-readable framework for Korean → Ukrainian phonetic-graphemic correspondence.

Pipeline: KOR_ORTH → KOR_PHON → KOR_PHON_RULES → KOR_IPA → UA_PHONETIC_TARGET → UA_ORTHOGRAPHY.

Scope: contemporary Standard Korean, normatively grounded in the National Institute of Korean Language and informed by peer-reviewed Seoul Korean phonetic research. Variation and ongoing sound change are represented explicitly. The Ukrainian target layer remains external in ClippyFirst/Ukrainian-Phonetic-Inventory.

Modern precomposed Hangul has 19 × 21 × 28 = 11,172 Unicode syllable blocks. This is a graphic combinatorial set, not a phoneme or lexical inventory.

Scientific distinctions: transliteration/transcription; orthography/phonology/phonetics; phoneme/allophone; possibility/phonotactic validity/attestation; heuristic score/probability; fact/model assumption.

Current implementation contains the reproducible Hangul core, initial Korean rule/evidence datasets, generated inventory, target contract, schemas, feature-ranking layer, tests and CI. Remaining research is recorded in docs/final-audit.md.
