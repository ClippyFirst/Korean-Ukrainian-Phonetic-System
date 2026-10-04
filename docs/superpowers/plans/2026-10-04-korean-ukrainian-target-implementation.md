# Korean → Ukrainian Target Implementation Plan

**Date:** 2026-10-04  
**Branch:** `feat/multilevel-corpus-generator`  
**PR:** #9

## Goal

Implement the approved Ukrainian-phonetics-first target layer without replacing Korean analytical distinctions. The implementation must keep Korean aspiration, fortisness, voicing, coda behavior and contextual processes in the analytical/IPA layers while deriving primary practical Ukrainian output from the Ukrainian target inventory and Ukrainian orthographic constraints.

## Order of work

1. **Freeze the target contract**
   - Keep the six representation layers explicit.
   - Treat `data/korean/canonical_correspondence.csv` as canonical input.
   - Do not use Russian or another Slavic system as a hidden fallback.

2. **Add target-layer metadata and projection tests first**
   - Test aspiration neutralization: ㅋ→к, ㅌ→т, ㅍ→п, ㅊ→ч in primary practical mode.
   - Test lenis surface split: [k]/[ɡ], [t]/[d], [p]/[b] remain distinguishable at IPA/phonetic-target stages.
   - Test fortis neutralization in primary practical mode while preserving fortis IPA.
   - Test ㅅ before ㅣ/j-like environments as a context-sensitive candidate, not a blanket mapping.
   - Test ㄹ onset/coda and ㅇ onset/coda separately.
   - Test ㅢ as context-dependent rather than a single universal Ukrainian output.
   - Test that a syllable-block inventory never becomes a fabricated lexical pronunciation.

3. **Implement deterministic target projection**
   - Add a small, dependency-free target projection module.
   - Input: Korean analytical/surface representation.
   - Output: candidate Ukrainian phonetic target plus Ukrainian graphemic realization and decision metadata.
   - Preserve provenance and status.
   - Make neutralization explicit rather than silently deleting distinctions.

4. **Add adversarial gold cases**
   - 평양, 현대, lenis/fortis/aspirated stop triplets, ㅅ+ㅣ, ㄹ onset/coda, ㅇ onset/coda, complex codas, liaison and nasal/liquid assimilation examples.
   - Separate lexical/contextual cases from combinatorial syllable inventory.
   - Every gold case must identify evidence status and may leave narrow IPA blank where the source evidence is insufficient.

5. **Integrate with corpus generation**
   - Keep the 11,172 Unicode inventory deterministic.
   - Apply only isolated canonical mappings to isolated syllable rows.
   - Apply contextual target projection only to explicit sequence/word data.
   - Never infer connected-speech pronunciation from a bare Hangul block.

6. **Validation and CI**
   - Run the generator in strict mode in CI.
   - Add regression tests for schema, controlled statuses, foreign keys and target-layer invariants.
   - Ensure warnings remain warnings in normal mode and strict mode fails only where the project contract says it should.
   - Verify the resulting PR and CI before claiming completion.

## Non-goals

- No automatic Ukrainian normative spelling claims.
- No obligatory aspiration digraphs in primary Ukrainian output.
- No blanket Russian-style initial consonant doubling.
- No fabricated lexical attestations or narrow IPA.
- No attempt to make Ukrainian orthography encode every Korean phonological contrast.
- No replacement of the Korean phonological/IPA layers by Ukrainian approximations.

## Acceptance criteria

- Primary practical aspiration is neutralized in Ukrainian output while aspiration remains visible in Korean/IPA data.
- Fortisness is preserved analytically and neutralized in primary practical output unless an explicit contrastive mode is requested.
- Korean surface voicing can select Ukrainian д/б/ґ only when the surface and target rules justify it.
- Context-sensitive candidates are represented as rules/metadata, not hard-coded as universal grapheme substitutions.
- The generated 11,172-syllable inventory remains exact and reproducible.
- Tests cover the approved adversarial cases.
