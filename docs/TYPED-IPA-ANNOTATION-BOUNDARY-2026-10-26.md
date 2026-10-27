# Typed IPA annotation boundary — 2026-10-26

## Purpose

The ClippyFirst runtime contract remains:

`Korean orthography → structural/morphophonological analysis → Korean surface IPA → ClippyFirst IPA correspondence → Ukrainian practical orthography`.

The new `scripts/packetize_korean_ipa_annotations.py` creates lossless, inspectable packets for the two research corpora. It is deliberately **not** a symbol converter and does not change the production engine.

## What is typed today

- `tokenized_ipa_from_sigmorphon_tsv`: source whitespace tokens are retained as opaque source tokens. An isolated `.` token is recorded as an explicit boundary marker. Whitespace is not interpreted as IPA phonology.
- `ugtphon_token_phoneme_ipa`: Unicode clusters are retained for inspection, but are explicitly **not asserted to be phoneme segments**. The annotation may use compact conventions that have not yet been independently reconciled.
- Both formats preserve the complete `target_raw` string. The packet records positions of explicit dot-like boundaries, stress markers (`ˈ`, `ˌ`) and length markers (`ː`, `ˑ`) without removing, normalizing, or inferring any of them.
- Unknown target types and non-train/dev partitions fail closed. Test and holdout rows cannot be packetized by this utility.
- Every packet sets `adapter_status=SOURCE_TYPED_NOT_MAPPED`, `clippyfirst_broad_ipa=null`, and `ukrainian_orthography=null`. This prevents a typed source annotation from being mistaken for reviewed ClippyFirst IPA gold.

## Why this is not yet a conversion adapter

The 366 shared train-form disagreements include both length-only and other segment/feature differences. Neither corpus is authoritative for the other's representation, and a character-level split is not a phonemic segmentation. There is not yet a reviewed mapping table from either source convention into the ClippyFirst broad-IPA contract. This packetizer makes the boundary executable while intentionally withholding conversion.

## Acceptance criteria for the next adapter phase

1. Specify source-level token inventory and exact convention for each corpus using pinned primary documentation and examples.
2. Create explicit symbol/feature correspondences with provenance, directionality, loss accounting, and an `unmapped` state.
3. Preserve length, stress, syllable boundaries, tie bars, diacritics, and the distinction between explicit and absent boundaries.
4. Adjudicate shared-form conflicts independently; do not erase length marks to improve agreement.
5. Validate on train/dev only and leave test/24-form holdouts sealed.
6. Demonstrate that no adapter output is called ClippyFirst broad IPA until independent review approves the relevant mapping coverage.

**Status:** typed boundary implemented; conversion to ClippyFirst broad IPA remains BLOCKED on source-convention adjudication. No production rules or runtime behavior changed.
