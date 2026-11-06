# Independent review protocol for the reconstructed 236-case Kozak Kim cohort

## Purpose and status

The 236-case CSV is a reconstructed candidate inventory, not proof of the original historical 239-member population and not a list of 236 confirmed pronunciation defects. Before any candidate is confirmed, two qualified Korean phonetics reviewers should independently transcribe the relevant source forms.

The repository already contains the reusable source- and candidate-blind packet framework for official NIKL cases and C01–C07 pilot packets. This 236-case queue is different: it comes from UGTPHON user-generated sentence contexts, and the source text can be identifiable. The dedicated builder below creates two **system-blind, reference-withheld, source-identifiable** packets without exposing engine outputs or candidate diagnoses.

## Generate reviewer materials locally

From the repository root:

```bash
python scripts/build_kozak_236_ipa_review_packets.py \
  --output-dir /tmp/kozak-236-independent-review \
  --internal-review-only
```

The command writes:

- `reviewer-a.json` — 236 blind case IDs and reviewer A's empty annotation form;
- `reviewer-b.json` — the same cases/order and reviewer B's empty annotation form;
- `coordinator-map.json` — private mapping from blind IDs to occurrence/source-row IDs.

**Never send the coordinator map to reviewers.** Do not commit generated packets or upload them to a public issue, PR, gist, or shared workspace. Item-level upstream rights for all source material have not been cleared; the packets are internal-review-only pending that separate rights review.

## What reviewers see

Each case contains:
- canonical input token from the candidate ledger;
- raw source token extracted at the pinned zero-based source-token index;
- raw sentence context;
- whether the raw token and canonical input are identical or differ.

The raw token may be stylized or normalized (for example, repeated vowel symbols or informal abbreviations). Reviewers must not silently equate the raw and canonical forms. They should transcribe the raw surface and canonical input separately when they differ, or mark the item unresolved/needs context.

The packets deliberately omit:
- source row IDs and occurrence IDs;
- canonicalized full-sentence context and source phoneme annotations;
- Broad-v2/IPA-Dict strings, Kozak Kim output, g2pk output, and every other engine output;
- mismatch fragments, cluster labels, candidate dispositions, and previous rationale.

Source identity is not guaranteed to be blind because public raw sentences may be searchable. Reviewers must not look up UGTPHON IPA/reference annotations or prior engine outputs during first-pass annotation.

## Required annotation

For each case, record broad IPA separately for the raw source token and canonical input. Optionally add narrow IPA with explicit allophonic details, syllable boundaries, vowel length, analysis category, confidence, method/reference, and unresolved questions. Keep phonemic representation, phonetic realization, source normalization, and Ukrainian target adaptation separate.

Both reviewers must submit independently. Freeze both first-pass packets before reconciliation. Afterward, the coordinator may reveal the private map and compare submissions against the evidence registers. Disagreements remain unresolved until documented adjudication. The 27 lenis out-of-scope cases and 24 fortis cases must remain separate review strata; no reviewer should be primed with those candidate families during first pass.

## Acceptance gate

- Two qualified reviewers submit complete, independent annotations for all 236 cases or explicitly mark unresolved/context-compromised cases.
- Reviewer method, convention, qualification, timestamp and confidence are recorded.
- Every eventual decision maps to the occurrence ID and source context through the coordinator map.
- No production IPA, Ukrainian target, benchmark gold or training data is changed merely because a reviewer supplied a first-pass transcription.
- Separate Ukrainian target review follows only after Korean IPA reconciliation.
- External distribution remains blocked until item-level source rights are cleared.

The packet generator regression verifies exact case count, unique occurrence IDs, raw token indexing, reviewer separation, private coordinator mapping, and absence of engine/reference/candidate leakage.
