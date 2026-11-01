# Implementation ledger

Ruling: Keep the Ukrainian inventory external so it remains a single source of truth.
Ruling: Keep each Korean process as a separate traceable rule so competing ordering analyses can be represented later.
Ruling: Represent contemporary Seoul stop cue change in evidence/analysis metadata rather than a universal acoustic transcription.
Ruling: Make the UPI dependency optional; absence returns explicit unavailable status.
Ruling: Expose broad IPA first and do not invent unsupported narrow detail.
Ruling: Treat ㄴ-insertion as explicitly licensed because the same phonological environment does not deterministically trigger it.
Ruling: Order explicitly licensed ㄴ-insertion before generic vowel liaison so 한여름 and phrase-level examples are not incorrectly resyllabified.
Ruling: Apply representative-coda normalization inside nasal/liquid assimilation rather than waiting until final neutralization.
Ruling: Require exact generated-artifact equality with the deterministic 11,172-syllable generator.


## Kozak Kim continuation — 2026-11-01

- Reconcile main and PR #415/#416: DONE_VERIFIED (inspection); dedicated branch created from main and fast-forwarded to PR #416 descendant.
- C01–C07 blind packets: PARTIAL; seven separate pilot packet manifests created. Blocked for external scoring by missing utterance context and reviewer-sharing rights; no IPA predictions or references disclosed.
- C08 source triage: PARTIAL / EVIDENCE-LIMITED; Q&A 312649 confirms 의외성 only; §27 requires exact -(으)ㄹ morphology; no exact parse/source for 했을시 or 무고일수도있다는. No production changes.
- g2pK baseline: DONE_VERIFIED as scope check; original/vendor implementation untouched.
- CI evidence: PR #416 runs 41344976774, 41344981229, 41344981425, 41344981248, 41344981271, 41344981311, 41344981284, 41344981338 inspected; 41344981358 was still running. Current main run 41334227038 fails Python collection because benchmark helper is absent on main; see master handoff.

- C08 follow-up (2026-11-01): official NIKL Q&A 327466 supports the morphology of `일 수도`; NIKL 2021 guideline p.106 confirms dependent-noun `시` after `-을`. Both are rule-environment evidence, not direct lexical pronunciation records for the corpus strings. `유사성` remains unconfirmed; no `-성` generalization and no production patch. Added two source-register entries; item-level rights/context remain pending.

- C08 occurrence mapping gap: mass-cluster register claims 8 occurrences, but the 27-row paired occurrence ledger contains no C08 entries. Three source rows recovered from artifact 13097847614 (multilexnorm2026_1953, multilexnorm2026_1979, dc_inside_2024); five more remain unidentified. Corrected stale "remaining cases in paired ledger" text; acceptance requires recovery of all eight source-row IDs and contexts.
