# Frozen 24-form IPA holdout — independent reviewer packets

This directory contains two separate, blank annotation sheets generated from the frozen NIKL-backed input manifest.

## Files

- `reviewer-a.csv` — independent reviewer A's blank sheet.
- `reviewer-b.csv` — independent reviewer B's blank sheet.
- `packet-manifest.json` — source-manifest SHA-256 and generated packet hashes.

## Review protocol

1. Assign the two files to two qualified Korean phonetics/phonology reviewers independently. Do not share a completed sheet or candidate IPA between reviewers before both submissions are frozen.
2. The Korean input, NIKL rule locator, and official Hangul surface-pronunciation notation are supplied as source context. The Hangul notation is **not IPA gold**.
3. No Kozak Kim, g2pK, g2p-ko, or other engine outputs are included. Do not consult model predictions when annotating.
4. Before annotation, reviewers must state the broad-IPA convention/profile and the Korean variety they assume. Record alternatives, speaker/variety variation, and uncertainty explicitly; do not guess a single narrow acoustic realization where no audio is supplied.
5. Keep each original reviewer file immutable after submission. The adjudicator receives both only after the independent sheets are complete, records disagreements and the rationale for each resolution, and never silently overwrites either review.
6. These 24 items are a frozen holdout. `tuningUseProhibited=true`: do not use them to tune phonological rules, IPA normalization, or benchmark thresholds.
7. IPA gold remains pending until both independent reviews and adjudication are complete. No Ukrainian target gold is included in this packet.

## Important limitation

The source manifest contains official Hangul pronunciation readings, not recordings. This packet can support independent broad-IPA transcription of the source-attested standard readings under an explicitly declared convention. It cannot establish narrow, speaker-specific acoustic detail without audio evidence.

Regenerate only from the canonical manifest:

```bash
python scripts/build_ipa_holdout_review_packets.py \
  --manifest data/korean/benchmarks/ipa-holdout-24-manifest.json \
  --output-dir research/ipa-holdout-review-packets
```
