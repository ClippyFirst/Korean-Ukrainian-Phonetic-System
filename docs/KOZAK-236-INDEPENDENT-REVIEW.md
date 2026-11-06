# Independent review protocol for the reconstructed 236-case Kozak Kim cohort

## Purpose and status

The 236-case CSV is a reconstructed candidate inventory, not proof of the original historical 239-member population and not a list of 236 confirmed pronunciation defects. Before any candidate is confirmed, two qualified Korean phonetics reviewers should independently transcribe the relevant source forms.

The repository already contains the reusable source- and candidate-blind packet framework for official NIKL cases and C01–C07 pilot packets. This 236-case queue is different: it comes from UGTPHON user-generated sentence contexts, and the source text can be identifiable. The dedicated builder below creates two **system-blind, reference-withheld, source-identifiable** packets without exposing engine outputs or candidate diagnoses.

## Generate reviewer materials locally

From the repository root:

```bash
python scripts/build_kozak_236_ipa_review_packets.py \
  --output-dir /tmp/kozak-236-independent-review \
  --licensed-external-review
```

The command writes:

- `reviewer-a.json` — 236 blind case IDs and reviewer A's empty annotation form;
- `reviewer-b.json` — the same cases/order and reviewer B's empty annotation form;
- `coordinator-map.json` — private mapping from blind IDs to occurrence/source-row IDs.

**Never send the coordinator map to reviewers.** Do not commit generated packets or upload them to a public issue, PR, gist, or shared workspace. For external review, distribute only the reviewer-specific packet plus `licenses/Apache-2.0.txt` and `licenses/UGTPHON-KO-SOURCE-NOTICE.md`. The declared UGTPHON Korean-subset Apache-2.0 licence is the distribution basis; the notice discloses the residual upstream provenance/title caveat.

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
- External distribution is permitted only under the declared UGTPHON Korean-subset Apache-2.0 licence, with the full licence and source notice accompanying each packet; do not include the full dataset or IPA-Dict data.

The packet generator regression verifies exact case count, unique occurrence IDs, raw token indexing, reviewer separation, private coordinator mapping, and absence of engine/reference/candidate leakage.


## 2026-11-06 status reconciliation

The current candidate CSV contains **236 unique occurrence IDs across 110 source rows and 54 columns**. Its membership confidence is explicitly `RECONSTRUCTED_CANDIDATE_NOT_ORIGINAL_MEMBERSHIP_PROOF`: it is a reconstructed candidate inventory, not proof that these were the exact original historical 236/239 selected cases. Preserve all 236 rows; do not describe them as 236 independently confirmed pronunciation errors or 236 speakers.

Current dispositions are 15 `RULE_CONFIRMED_STANDARD_VARIANT`, 181 `PROFILE_CONVENTION_MISMATCH_CONFIRMED`, 12 `ABSTAIN_PENDING_INDEPENDENT_IPA_REVIEW`, and 28 `NOT_INDIVIDUALLY_ADJUDICATED`. The 15 standard-form occurrences now have exact runtime dispositions (ten new exact integrations plus five pre-existing licenses). The 181 profile rows are not promoted to categorical phonological rules.

The fortis sibilant sub-stratum is now counted precisely: **24 `ɕ͈→s͈` edit operations in 24 occurrence IDs across 19 source rows**; 23 contexts are before /i/ and one is before /jo/ (ID 96). Twenty-two forms contain orthographic ㅆ; two are coda-triggered fortition contexts. No generic [ɕ͈] IPA/runtime variant is accepted. Kong & Kang (2021) report a speaker- and context-conditioned fronted word-initial /s͈i/ realization in young female speakers closer to [s] than [ɕ], not a universal fortis-palatalization rule. The 2021 EPG study is based on five adults and reports a range of contact patterns; it does not provide token-level [ɕ͈] labels for this cohort. Keep these cases separate from the 40 abstained/unadjudicated occurrences and do not reveal this candidate taxonomy to first-pass reviewers.

**Review status remains NOT STARTED:** no independent reviewer annotations have been supplied or reconciled. The source-rights audit now records a scoped Apache-2.0 basis for external distribution of excerpts from the pinned UGTPHON Korean subset. The packet generator supports a licensed external mode that attaches the complete licence and source notice. After two independent Korean IPA passes and blind reconciliation, perform Ukrainian target review as a separate acceptance stage. No production IPA, Ukrainian target, benchmark gold or training data is changed by this status update.


## 2026-11-06 — source-rights audit outcome

The source-rights audit is recorded in [KOZAK-236-SOURCE-RIGHTS-AUDIT-2026-11-06](KOZAK-236-SOURCE-RIGHTS-AUDIT-2026-11-06.md).

**External distribution remains BLOCKED.** UGTPHON declares its Korean subset Apache-2.0 and identifies two upstream streams (MultiLexNorm++ and KoMultiText/DC Inside). KoMultiText also publishes Apache-2.0 metadata and its paper says the authors reviewed DC Inside terms, but the paper does not identify a specific platform permission or establish the original posters' authority to license their comments. MultiLexNorm++'s paper does not specify raw-text redistribution terms, and its public Hugging Face dataset page has a contact-sharing access gate whose terms were not accepted or inspected in this audit. Apache-2.0's grant is from a rights holder or authorised licensor and its warranty disclaimer does not establish title/non-infringement.

Therefore keep all 236 `source_license` cells blank; do not send the existing source-identifiable sentence-context packets to external reviewers. The internal-only packet mode remains the maximum permitted workflow pending written source/rights-holder clarification or qualified legal determination. No packets were generated or distributed in this audit. See the rights report for the exact evidence, limits and clearance checklist.


## 2026-11-06 — final source-rights and distribution protocol

The pinned UGTPHON Korean subset declares Apache-2.0 in its `ko/LICENSE`; the canonical source register records that subset-level grant. This supersedes the earlier internal-only rights hold. The residual uncertainty about the original third-party post rights remains disclosed in the attached source notice and is not represented as a legal opinion.

Generate reviewer packets with:

```bash
python scripts/build_kozak_236_ipa_review_packets.py \
  --output-dir /tmp/kozak-236-independent-review \
  --licensed-external-review
```

The licensed mode validates the pinned source corpus and source-register licence record, then writes the complete Apache-2.0 text and UGTPHON Korean-subset notice alongside the two reviewer packets. Send reviewer A only `reviewer-a.json`; send reviewer B only `reviewer-b.json`. Give both the same licence and notice. Keep `coordinator-map.json` private.

The 236 items are reconstructed occurrences from 110 source rows, not 236 speakers. Because no audio is supplied, reviewers must distinguish a broad transcription under their declared Korean convention from a claim about the actual speaker's narrow acoustic realization. They should mark uncertainty rather than infer speaker-specific allophones, dialect, or prosody from spelling alone.
