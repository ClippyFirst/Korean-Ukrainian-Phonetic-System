# Kozak Kim Extended IPA — design decision

**Date:** 2026-11-26  
**Owner approval:** Issue #508 and follow-up scope clarification approved by the repository owner.  
**Status:** implementation in progress; not release-ready.

## Intent

Add an Extended IPA research mode to Kozak Kim so users can inspect Korean phonological and phonetic structure beyond the default broad transcription. The mode must be useful for phonetic research, linguistic comparison and error diagnosis, not merely to improve benchmark scores.

## Goals

- Separate phonemic, broad surface and narrow contextual representations.
- Preserve variants, boundaries, source spans, rule IDs, environments, provenance, uncertainty and abstention.
- Keep text-derived phonological analysis distinct from measured acoustic annotation.
- Expose browser functionality while reusing the existing Python narrow-profile work.
- Keep Ukrainian target adaptation independent and fail closed for profiles that have not been approved.
- Treat benchmarks as diagnostic evidence, never as the source of phonetic rules or gold labels.

## Non-goals

- Replacing Strict / Soft / Super-soft morphology coverage modes.
- Changing the g2pK practical engine.
- Optimizing rules against a public benchmark split.
- Claiming that a narrow IPA string is automatically more accurate.
- Inferring speaker, dialect, age, gender, speech rate, focus or prosodic phrasing from orthographic text.
- Redistributing audio or restricted corpus labels without rights authorization.

## Approaches considered

1. **Create a second browser-only narrow engine.** Rejected because it duplicates the Python narrow profile and risks silent cross-runtime drift.
2. **Use the existing Python profile as the evidence source, formalize a typed contract, and add a browser research adapter.** Selected. It preserves existing work, provides a stable integration boundary, and allows parity gaps to be visible and tested.
3. **Add only more benchmark cases or optimize the score.** Rejected because benchmark performance cannot define Korean phonetic reality and can reward split-specific behavior.

## Architecture

- Python derives phonemic IPA from the untouched underlying syllable parse and broad/narrow IPA from the shared post-rule syllable analysis.
- Both runtimes use the same JSON result shape defined by schemas/ipa-profile-result.schema.json and the Python/JavaScript validators.
- The browser research view currently exposes its existing broad output and a partial narrow profile. Its phonemic layer is explicitly marked unavailable until an equivalent underlying representation is implemented.
- The narrow profile is versioned separately. Version 6 removes a categorical post-sonorant [ɦ] rule because the reviewed evidence supports speaker-/dialect-conditioned weakening or deletion, not a universal [ɦ] realization.
- The Ukrainian result continues to use the pre-existing runtime path. The narrow profile is not target-compatible and does not alter Ukrainian output.

## Evidence policy

Every narrow rule must identify its environment, evidence class, source scope, counterexamples and review state. Acoustic measurements (F0, VOT, closure voicing, voice-quality measures, formants and spectral moments) remain separate annotations; they must not be converted automatically into segmental IPA. Multiple readings remain alternatives when evidence does not identify one universal output.

## Acceptance

The mode is complete only after:
- typed schema and Python/browser validation agree;
- all three layers are implemented in both runtimes or explicitly marked unavailable with a documented reason;
- browser/Python parity is measured on pinned inputs;
- positive, negative, interaction, phrase-boundary, morphology, variant and abstention tests pass;
- independent Korean phonetic review adjudicates the IPA conventions;
- a separate Ukrainian target review approves any mappings;
- corpus/source rights are verified;
- exact-head CI and rendered UI checks pass.

A passing benchmark is necessary diagnostic evidence but is not sufficient for completion.


## Additional research annotation contract

The result contract also carries nullable speaker/prosody context (pseudonymous speaker ID, dialect, age group, style, speech rate, focus, prosodic position and recording conditions) and a separate acoustic_annotations array. Text-only conversion must leave these context fields null and acoustic_annotations empty. A measured acoustic annotation is valid only with a source span, measurement method and evidence reference. Acoustic values are not guessed from orthography and do not automatically rewrite segmental IPA.


## Segment-level contract extension — schema 1.2

Each phonemic, broad and narrow layer includes a `segments` array alongside its unchanged IPA rendering. Segment tokens retain Unicode code-point IPA spans, base segment, modifiers, feature bundle, syllable-level source alignment where available, and rule/evidence provenance. Boundary tokens preserve word/syllable separators; unknown tokens preserve unrecognized code points. The source alignment is explicitly syllable-level until phone-level alignment can be supported by acoustic or independently adjudicated alignment evidence. This changes the result contract and therefore requires schema version 1.2. It does not change the Ukrainian adapter or make any IPA profile target-compatible.
