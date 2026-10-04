# Korean → Ukrainian Phonetic Target Optimization Design

> Status: design specification for review
> Date: 2026-10-04

## Goal

Define and implement the Ukrainian target layer of the Korean → Ukrainian phonetic system so that Korean phonological distinctions are preserved analytically, while the practical Ukrainian output is derived from Ukrainian phonetics and orthographic constraints rather than copied from Russian or another Slavic convention.

## Core principle

The source-language distinction must remain visible in the scientific representation, but it is not automatically encoded by a distinct Ukrainian grapheme. A distinction is encoded in Ukrainian output only when Ukrainian phonetics/phonology and the practical purpose of the system provide a defensible reason to do so.

Canonical pipeline:

Korean orthography → Korean phonology → contextual Korean surface realization → IPA → Ukrainian phonetic target → Ukrainian orthographic realization.

The Ukrainian Phonetic Inventory is the canonical target-space reference. Russian, Czech, Polish, Slovak, Bulgarian, Serbian and Slovenian systems are comparative evidence, not target authorities.

## Scope

This design covers:
- the canonical isolated correspondence layer;
- Ukrainian phonetic-target selection;
- separation of scientific IPA from practical Ukrainian orthography;
- optional preservation of source distinctions when explicitly requested;
- adversarial validation against representative Korean syllables, sequences and names.

This design does not create a normative Ukrainian proper-name standard, a lexical dictionary, or acoustic/narrow-IPA claims beyond available evidence.

## Aspiration policy

Korean aspirated consonants remain explicitly represented at the Korean phonology/surface/IPA layers:

- ㅋ /kʰ/
- ㅌ /tʰ/
- ㅍ /pʰ/
- ㅊ /tɕʰ/

In the primary Ukrainian practical mode, aspiration is neutralized where Ukrainian has no corresponding phonological opposition:

- [kʰ] → к
- [tʰ] → т
- [pʰ] → п
- [tɕʰ] → ч

Therefore 평양 is not mechanically rendered with пх merely because its Korean pronunciation contains [pʰ]. The practical target should be evaluated as Пйон'ян under the approved model, subject to the finalized treatment of glide/jot and apostrophe.

A secondary research/contrastive mode may expose aspiration as кх/тх/пх/чх. This mode is not the default Ukrainian output and must never overwrite the primary mapping.

## Consonant target policy

### Lenis stops

Surface voicing is considered before target selection.

- ㄱ: [k] → к; genuinely voiced [ɡ] → ґ where the surface realization and Ukrainian target inventory justify it.
- ㄷ: [t] → т; [d] → д.
- ㅂ: [p] → п; [b] → б.

The system must not use a blanket position-only rule when the Korean surface realization is context-conditioned.

### Fortis consonants

Fortisness is preserved analytically but is not assigned a dedicated Ukrainian phoneme.

Primary practical output:
- ㄲ → к
- ㄸ → т
- ㅃ → п
- ㅆ → с
- ㅉ → ч

A separate contrastive representation may use doubled graphemes where that is useful for research, but doubled initial consonants are not imposed merely to mirror Korean fortisness.

### Sibilant and affricate targets

- ㅅ has a context-sensitive surface representation; before /i/ and /j/-type vowels the [ɕ]-like realization should be evaluated against Ukrainian ш rather than mechanically preserving с.
- ㅈ is evaluated as ч for the voiceless/affricate target and дж for a genuinely voiced [dʑ]-type surface realization where justified.
- ㅊ is ч in the primary mode; its aspiration remains visible in IPA.
- ㅈ/ㅉ/ㅊ must not be collapsed solely from Hangul identity without considering surface context.

### Liquid

- Korean onset ㄹ, where realized as a tap/flap [ɾ]-type sound, targets Ukrainian р.
- Korean coda ㄹ [l]-type realization targets українське л.
- Contextual lateral sequences are resolved at the surface layer before Ukrainian targeting.
- The Ukrainian sequence льх proposed in earlier Ukrainian precedent is treated as a testable context-specific hypothesis, not a universal mechanical rule.

### Nasal

- ㅇ onset is structural null.
- ㅇ coda is [ŋ]. The scientific target layer records the mismatch with Ukrainian phonology explicitly; the primary practical graphemic output may use н where the feature-distance model selects it.
- A contrastive mode may expose the velar-nasal distinction, but the primary practical mode should remain readable Ukrainian.

## Vowel target policy

Vowels are selected by phonetic proximity plus Ukrainian phonotactics and orthography, not by Latin romanization.

Initial candidate set:

- ㅏ → а
- ㅑ → я
- ㅓ → о
- ㅕ → йо
- ㅗ → о
- ㅛ → йо
- ㅜ → у
- ㅠ → ю
- ㅡ → и
- ㅣ → і
- ㅐ / ㅔ → е
- ㅘ → ва
- ㅝ → во
- ㅙ / ㅞ → ве
- ㅚ → ве
- ㅟ → ві
- ㅢ → context-dependent; never force a universal иі representation.

The ㅐ/ㅔ distinction remains distinct in Korean input and evidence, even if both converge on Ukrainian е in the primary practical target.

The ㅢ target must be conditioned by phonological environment, including initial versus non-initial realization and the documented standard-pronunciation alternatives.

## Context and sequencing

The sequence/word layer is the only layer allowed to apply cross-syllable processes such as:
- liaison/resyllabification;
- final neutralization;
- nasal assimilation;
- liquid assimilation;
- fortition/tensification;
- aspiration interactions;
- ㅎ deletion/aspiration interactions;
- n-insertion;
- palatalization-related processes;
- complex-coda simplification and liaison.

The system must first derive the Korean surface form, then select Ukrainian targets. It must not apply Ukrainian spelling decisions as if they were Korean phonological rules.

## Representation contract

Every derived row must make it possible to distinguish:
1. Korean grapheme;
2. Korean phoneme;
3. contextual Korean realization;
4. surface IPA;
5. Ukrainian phonetic target;
6. Ukrainian orthographic realization.

An empty field means the evidence/model does not supply a value; it must not trigger an implicit inference.

## Validation strategy

The implementation will add a comparative gold/control corpus containing:
- isolated onset/nucleus/coda contrasts;
- lenis/fortis/aspirated triplets;
- voicing-sensitive contexts;
- ㅅ before back vowels versus /i,j/ environments;
- ㄹ onset/coda contrasts;
- ㅇ onset/coda;
- complex codas and liaison;
- nasal/liquid assimilation;
- ㅎ interactions;
- ㅢ context variation;
- representative multi-syllable sequences including 평양 and 현대.

For every control item, validation records:
- Korean source form;
- evidence-based surface IPA;
- candidate Ukrainian targets;
- feature-distance considerations;
- Ukrainian phonotactic/orthographic penalties;
- comparative Slavic precedents;
- selected target;
- rationale;
- evidence status.

The test suite must verify that the primary mode does not introduce aspiration digraphs merely because the Korean source is aspirated.

## Acceptance criteria

The target layer is accepted only if:
1. primary practical output follows Ukrainian phonetic logic;
2. Korean aspiration remains recoverable from the scientific layers;
3. Russian conventions are not imported as defaults;
4. context-sensitive Korean voicing is handled at the surface layer;
5. ㅢ is not forced into a universal output;
6. the 11,172-syllable generator remains deterministic and reproducible;
7. no lexical or normative claim is fabricated;
8. adversarial controls pass;
9. existing schema adapters and provenance remain valid;
10. CI verifies the generated corpus and tests.

## Versioning

This design is the basis for the next Korean-system revision after v0.8.0. Existing derived CSV/XLSX artifacts remain reproducible outputs; canonical source data must be changed only after the comparative gold corpus validates the revised target layer.
