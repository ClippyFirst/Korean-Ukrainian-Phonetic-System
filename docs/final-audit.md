# Final audit — 2026-10-01

## Release status

**Version 0.3.0 — completed research-prototype release.**

The repository is considered complete for its declared research-prototype scope. It is not labelled as an exhaustive publication-final Korean pronunciation dictionary or as a fully adjudicated Korean→Ukrainian transliteration standard.

## Repository

- Repository: ClippyFirst/Korean-Ukrainian-Phonetic-System
- Visibility: private
- Default branch: main
- CI workflow: tests
- Latest verified CI run: GitHub Actions run #57 — **success**
- Latest release commit is covered by the successful main-branch CI sequence.

## Implemented system

### Korean representation
- Modern precomposed Hangul decomposition/composition.
- 19 leading, 21 medial and 27 actual trailing Jamo.
- 28 trailing positions in the Unicode combinatorial formula because T=0 is the empty-coda slot.
- Deterministic generation of all 11,172 modern Hangul syllable blocks.
- Explicit distinction between Jamo, syllable block, phonological segment and lexical attestation.
- Complex coda structures are retained rather than silently flattened.

### Korean phonology
The ordered rule engine now has 9 registered rule classes:
- R001 final neutralization;
- R002 liaison/resyllabification;
- R003 ㅎ deletion before vowel-initial material;
- R004 ㅎ aspiration;
- R005 nasal assimilation;
- R006 liquid assimilation;
- R007 palatalization;
- R008 post-coda tensification;
- R009 n-insertion.

Every rule returns a trace with rule ID, name, before/after state, status, confidence and source locator.

### IPA
- Separate phonemic and broad/contextual realization paths.
- Explicit analysis-dependent vowel realizations.
- Complex codas have supported broad surface representations.
- No unsupported acoustic narrow transcription is fabricated.
- Contemporary Seoul cue reweighting is retained as an evidence/variation issue rather than hard-coded as a universal timeless property.

### Ukrainian target
- Verified against the current UPI 0.8.0 package API.
- UPI remains the Ukrainian inventory source of truth.
- Korean IPA is converted to UPI-compatible feature vectors segment-by-segment.
- Candidates are ranked with explicit heuristic costs.
- Scores are explicitly not probabilities.
- Missing/incompatible UPI dependency produces an explicit unavailable state.
- A thin adapter-level Ukrainian graphemic renderer is included; it is not claimed to be a complete Ukrainian orthographic grammar.

### Evidence
The evidence layer contains normative NIKL material, Unicode technical specification and peer-reviewed Seoul Korean phonetic research. Competing analyses and uncertainty statuses are machine-readable.

NIKL confirms that Standard Pronunciation Rules follow actual Standard Korean pronunciation and covers consonants/vowels, final consonants, assimilation, fortition and insertion. citeturn0search3

NIKL examples explicitly document adjacent-consonant assimilation, palatalization, and interactions with ㅎ. citeturn0search0

NIKL guidance also documents complex-final-consonant behavior and n-insertion, including cases where a preceding ㄹ yields [ㄹ]. citeturn0search8

Contemporary Seoul research documents ongoing cue reweighting in stops, including F0 increasingly replacing VOT as a cue in the relevant contrast; the system therefore avoids treating one acoustic cue profile as timeless. citeturn0search2

## Validation

- 29 pytest test functions are currently present.
- Latest GitHub Actions main-branch run: **success**.
- Exhaustive Hangul round-trip test covers all 11,172 generated blocks.
- Complex-coda regression tests cover structural preservation, neutralization and IPA.
- Rule tests cover all 9 registered rule classes.
- IPA tests cover phonemic/broad/narrow API behavior.
- Target adapter tests cover explicit dependency failure semantics.
- Schema tests cover the expanded machine-readable evidence/correspondence/analysis/validation contracts.

## Generated data

- 11,172 generated modern Hangul blocks.
- 67 actual modern Jamo records = 19 L + 21 V + 27 T.
- Generated range verified as 가 → 힣.

## What “ready” means here

### Ready now
- research-methodology demonstration;
- reproducible computational architecture;
- machine-readable Korean representation;
- traceable contextual phonology prototype;
- explicit IPA layer;
- external Ukrainian target contract;
- segmentwise correspondence/ranking;
- evidence and uncertainty representation;
- automated CI verification;
- architecture documentation and Lucid diagram;
- Notion research-status documentation.

### Explicitly outside the completion claim
These remain valid research extensions rather than hidden defects:
1. exhaustive lexical pronunciation dictionary coverage;
2. corpus-scale frequency/attestation statistics;
3. exhaustive morphophonological conditioning across the entire lexicon;
4. full acoustic narrow-IPA model;
5. independent expert adjudication of every competing phonological analysis;
6. a complete Ukrainian orthographic grammar specialized for Korean proper names/loanwords;
7. empirical optimization/validation of candidate-ranking weights against a gold-standard Korean→Ukrainian corpus.

These are not represented as “solved” merely to inflate completeness.

## Reproducibility

The source repository, generated Hangul artifact, rule registry, evidence registry, schemas, tests and CI workflow form the reproducible research package.

## Final scientific status

**Completed research-prototype / methodology-demo release (v0.3.0).**

A linguist can inspect the representation, rules, evidence and uncertainty; a computational linguist can reproduce the pipeline and tests; a Ukrainian-language specialist can inspect the external target contract. Publication-level claims about exhaustive coverage still require an empirical gold corpus and independent specialist review.
