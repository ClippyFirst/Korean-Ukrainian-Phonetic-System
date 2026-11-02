# Independent pronunciation review — reviewer instructions

You are receiving one pilot packet containing Korean input forms, source-row identifiers, and the original source sentences. Work independently. The packet is **system-blind and reference-withheld**, but it is **not source-identity-blind**: source IDs and public raw sentences may allow a reviewer to identify the UGTPHON row.

## Task

1. Read the included `source_sentence` for each source-row identifier before scoring. If the context is truncated or ambiguous, mark the item `NEEDS_CONTEXT`; do not guess from the isolated token.
2. Provide a broad phonemic IPA transcription for each item.
3. Optionally provide a separate narrow phonetic transcription, identifying exactly which predictable allophonic details you represent.
4. Record syllable boundaries and vowel length only under a stated convention and supported evidence.
5. Classify each disputed detail as phonemic, predictable allophony, transcription convention, lexical variation, or unresolved.
6. Cite primary pronunciation sources or describe the phonetic evidence, method, and confidence.
7. Do not infer a general rule from this small pilot sample.

## Independence and reference withholding

- Do **not** retrieve or consult the UGTPHON IPA/reference annotations, benchmark outputs, or prior system transcriptions during first-pass transcription.
- Source IDs and public sentences may make a row identifiable. If you already know or locate the corpus reference, disclose this and mark the affected item `COMPROMISED_FOR_BLIND_REVIEW`; do not score it as an independent transcription.
- You may consult official pronunciation standards and cite them, provided you do not use the corpus's own reference annotation or a prior software output as the answer.
- Do not seek or infer the identity of any software system, comparison baseline, or previous transcription.
- Submit first-pass decisions independently. Do not discuss or reconcile differences with another reviewer until both first-pass submissions have been frozen.

## Submission

For every item, provide broad IPA, optional narrow IPA, syllable boundaries, vowel-length assessment, analysis category, source/evidence, confidence, and notes or unresolved questions.

## Readiness and licensing

These are source-context-complete pilot packets, not a complete cluster census. The UGTPHON Korean subset `ko/LICENSE` states Apache-2.0; preserve the included attribution and license notice. The packets contain raw source sentences only, not canonical text or IPA/reference annotations. The corpus contains informal user-generated text and may include profanity; treat it as source material, not endorsement.

**Blinding scope:** system identity and reference IPA are withheld; source identity is not. This protocol reduces direct answer leakage but cannot guarantee that a public source sentence is unsearchable.
