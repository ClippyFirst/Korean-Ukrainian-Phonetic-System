# 236-candidate review ledger — 2026-11-05

## Scope and result

This is an evidence-preserving review inventory, not a phonological confirmation. It materializes the 236 candidate occurrences left after crosswalking three already-implemented exact-form fixes against the reconstructed 239-ID cohort.

| Measure | Result |
|---|---:|
| Reconstructed candidate IDs | 239 |
| IDs unique and joined to the pinned 370-row Broad-mismatch context superset | 239 / 239 |
| Existing exact-form FIX overlaps excluded | 3 (37, 704, 2031) |
| Candidate occurrences in this review ledger | **236** |
| Existing individual ABSTAIN overlaps | 22 |
| Provisional RETAIN | 1 (1140, 출산) |
| No individual disposition in current review registers | 213 |
| Distinct token strings | 151 |
| Distinct source rows / sentence contexts | 110 |
| Distinct source-row + token pairs | 168 |

The 236 are candidate occurrences, not 236 established pronunciation errors, not 236 distinct words, and not a post-fix benchmark mismatch count.

## Cohort reconstruction

The 239 IDs are from a hash-pinned replay of the pre-C11/C12 Broad-only aggregate C01–C10 classifier. The replay selects 239 unique occurrences from a 370-occurrence Broad-mismatch superset. The original historical per-fragment assignment snapshot or original selector was not preserved. Membership is therefore RECONSTRUCTED_CANDIDATE, not proof that these are exactly the original historical 239 members.

The 370-row superset joins to the pinned UGTPHON Korean test split at commit ef0d5a09c2ea1874c7206020f875cbd9cfea2f54 (Git blob 59380491d5a797308c475f7d0007dcf6c4be00af). It retains source-row IDs, token indices, sentence context, canonical context, phoneme annotation, engine/profile/normalizer provenance and benchmark artifact/report hashes.

## Existing decisions: do not overcount

- **3 FIX overlaps:** IDs 37 (해줄것), 704 (많을거같이) and 2031 (내릴수있는) have exact-form R013 licenses already implemented in Kozak Kim. The separate fourth R013 fix, occurrence 2018 (존중시킬수도있지만), is outside this reconstructed cohort. The three are excluded from the 236.
- **22 ABSTAIN overlaps:** these have individual rationale rows in the 31-row abstention register. They remain unresolved; ABSTAIN is not resolution and does not decrement the count.
- **1 RETAIN:** occurrence 1140 (출산) provisionally retains the existing source-backed R012 form. Independent Korean IPA review is pending; RETAIN is not completed adjudication.
- **213 not individually adjudicated:** no occurrence-specific disposition was found in the current narrow review registers. The 370-row context ledger's default ABSTAIN / EVIDENCE_LIMITED_DIAGNOSTIC_ONLY is a safe no-change baseline, not an individual review result.

## Mismatch profile

The 236 rows contain 207 occurrences carrying the current descriptive C11 sibilant-place/profile-boundary label and 206 carrying the current descriptive C04 aspiration-symbol/segmentation label. These are overlapping labels from a later classification layer, not the historical selector and not per-edit phonological diagnoses.

The largest individual Broad edit signatures are 184 ɕ→s operations and 24 ɕ͈→s͈ operations. Other differences include ɕ→ʑ, ɕ͈→ʑ, vowel quality/length, fortis-vs-lenis stops, nasal insertion/deletion, glide loss and liquid/nasal realization.

The strongest aggregate signal is a transcription-profile / sibilant-place question, not evidence for hundreds of independent productive sound-change rules. Repeated forms are material: 아끼셔 occurs 22 times, 스시녀들은 15, 시중도 14 and 신안 10. Occurrence-level repetitions must be grouped by source row, token, speaker/audio and annotation convention before counting independent evidence.

Edit operations are grapheme-cluster alignments over normalized IPA strings, not guaranteed phoneme alignments. Broad-v2 / IPA-Dict-derived comparator strings and the project's broad profile remain unadjudicated; a distance or symbol mismatch cannot decide which representation is correct.

## Review gates

No new phonological rule, IPA override, Ukrainian target, or production behavior is confirmed by this pass. The Ukrainian target layer must remain downstream of independently adjudicated IPA.

For each occurrence or defensibly grouped token/context family, record:
1. exact token/context identity, including morpheme, eojeol and prosodic boundaries;
2. primary source and exact rule environment, or audio/speaker evidence where the question is phonetic;
3. broad-vs-narrow IPA convention and all supported variants;
4. two independent Korean IPA annotations and adjudicated disagreements;
5. whether the difference is a profile/notation mismatch, valid variant, existing rule, implementation defect, or unresolved;
6. only after IPA adjudication, a separately reviewed Ukrainian target and regression expectation.

**Acceptance:** every occurrence needs a traceable individual or explicitly grouped decision with source/reviewer provenance; repeated occurrences must not be counted as independent confirmations; unresolved cases remain explicit abstentions. This inventory alone does not meet that linguistic acceptance gate.

## Reproducibility

- Generator: scripts/build_kozak_236_candidate_review.py
- Output: research/kozak-kim-236-candidate-review-2026-11-05.csv
- Regression: tests/test_kozak_236_candidate_review.py
- Inputs: the 239-ID candidate snapshot, 370-row context superset, 31-row abstention register and context-adjudication register.
