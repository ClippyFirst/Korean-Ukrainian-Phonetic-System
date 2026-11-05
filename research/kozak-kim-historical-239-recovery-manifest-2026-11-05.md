# Historical 239-occurrence recovery manifest — 2026-11-05

## Status

**PARTIAL / MEMBERSHIP RECONSTRUCTION BLOCKED.** The original full benchmark occurrence artifact has now been recovered and hash-pinned. The exact 239-member subset is still not reconstructable from the tracked triage export because no artifact records a stable `historical_239_member` flag or the executable selection/cluster-assignment snapshot that produced the narrative count. This file records what is recovered and what is still missing; it is not the 239-row ledger.

## Recovered primary benchmark artifact

| Field | Pinned value |
|---|---|
| Repository | `ClippyFirst/Korean-Ukrainian-Phonetic-System` |
| GitHub Actions workflow run | [41471244424](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41471244424) |
| Workflow name | Multi-engine Korean IPA diagnostic benchmark |
| Run head commit | `4f3f307c5bb056bce3b0aedc8ab07e0010eaa695` |
| Artifact ID | `13156351613` |
| Artifact name | `multi-engine-korean-ipa-diagnostic` |
| Artifact SHA-256 | `749ac9a2b9db96c1e27828919afe05ef4320e35ca6a91ab2038c1ff3e9d04c69` |
| Report file | `multi-engine-ipa-report.json` (20,736,459 bytes in ZIP) |
| Benchmark schema/version | `multi-engine-ipa-diagnostic-v6` |
| Eligible token occurrences | 2,703 |
| Dataset rows / unique Hangul words | 275 / 1,907 |
| Native IPA profile | `clippyfirst-korean-broad-v1@1`, broad, `unadjudicated-cross-runtime` |
| Broad sensitivity profile | `korean-broad-candidate-sensitivity-v1@1`, research-only, unadjudicated |
| Normalizer | `benchmark_ugtphon_ko.normalize_ipa`; NFD canonicalization, g→ɡ, selected diacritics/tie bars and separators normalized; stress, length, aspiration, fortis and unreleased stops retained |
| g2pK comparator | `g2pk==0.9.4` |
| Source dataset | `naver-ai/UGTPHON/ko/test.json` at `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54` |
| Dataset Git blob | `59380491d5a797308c475f7d0007dcf6c4be00af` |
| Dataset licence | Apache-2.0 per pinned Korean subset metadata |

The report contains 2,703 occurrence records for each of ten engines, including stable occurrence IDs, source row IDs, token, reference IPA, prediction, strict distance and broad-candidate comparison. Its scope is diagnostic comparison; it explicitly does not establish normative IPA gold or Ukrainian-target accuracy.

## Recovered mismatch export

The historical export at the same code snapshot is:

- Path: `research/kozak-kim-mismatch-fragments-2026-11-02.csv`
- Commit: `4f3f307c5bb056bce3b0aedc8ab07e0010eaa695`
- Git blob SHA: `552139f72e3b0cbd32bf3dd83ad4bf5bc59238a7`
- Rows: 1,267 unique occurrence IDs.
- Fields include strict and Broad reference/prediction IPA, distances, grapheme-cluster mismatch fragments, candidate cluster labels, source row IDs and tokens.

This export is a different grain/population from the historical 239 count. Its cluster labels are occurrence-level unions, not a complete per-fragment record of which edit was assigned to which C01–C10 family. It therefore cannot be filtered mechanically into the exact historical 239 set without the original selection predicate/cluster snapshot.

## What remains missing for a valid 239-row ledger

1. A stable list of the 239 occurrence IDs, or an executable and versioned predicate that deterministically reproduces exactly those 239 IDs from the recovered 2,703-row report.
2. The historical fragment-to-C01–C10 assignment snapshot used when the 239 count was reported. Current C11/C12 work reclassified many earlier residuals; later 36-row Broad queue, 1,267-row mismatch export, 13 cluster rows and 38 paired rows are not interchangeable populations.
3. A verified per-occurrence source-row/context join for the selected 239, with source-context hashes/locators. The pinned dataset is available, but membership must be settled first.
4. One explicit `fix / retain / abstain` decision per selected occurrence, linked to primary phonological evidence and reviewer provenance. A diagnostic mismatch alone is not a decision.

Do not fabricate 239 placeholder rows, infer membership from the count alone, or treat all 2,703 benchmark rows as the 239 historical residuals.

## Reproduction / acceptance plan

- Check out the report's run-head commit above.
- Use the artifact ZIP SHA-256 above and validate its contents before extraction.
- Re-run the exact benchmark runner/profile/normalizer at that commit against the pinned UGTPHON split; verify occurrence IDs and outputs match the artifact.
- Recover or reconstruct the exact historical C01–C10 fragment assignment rule and compare its selected IDs with the documented count of 239. If the predicate does not produce exactly 239, stop and resolve the discrepancy rather than force a 239-row output.
- Once membership is reproducible, join each selected `source_row_id` to the pinned dataset and add context hash/locator, engine/profile/normalizer provenance, mismatch fragments, decision, rationale, evidence, reviewer and decision timestamp.

**Current conclusion:** benchmark source evidence is recovered and hash-pinned; the historical 239 membership and per-occurrence decisions remain evidence-limited. The 31-row current queue abstention register is a separate deliverable and must not be substituted for this ledger.

## Reconstruction attempt — exporter semantics and negative result (2026-11-05)

The recovered ZIP was downloaded from artifact `13156351613` and its SHA-256 was independently recomputed as `749ac9a2b9db96c1e27828919afe05ef4320e35ca6a91ab2038c1ff3e9d04c69`. The `multi-engine-ipa-report.json` contains 2,703 occurrence records in each of ten engine ledgers.

The historical exporter source was fetched at the pinned run-head commit `4f3f307c5bb056bce3b0aedc8ab07e0010eaa695` (blob `7a983e4b2ac3585d5b16516acfad4aa8a6895520`). Its `candidate_clusters()` function labels the concatenation of all supplied edit fragments, while `build_rows()` passes **strict plus Broad** fragments together and stores only the occurrence-level union in `candidate_clusters`. It does not store a label for each individual Broad edit operation.

A direct count over the pinned 1,267-row export (blob `552139f72e3b0cbd32bf3dd83ad4bf5bc59238a7`) gives:

- 1,267 exported occurrence rows;
- 370 rows with non-zero Broad-profile distance;
- 3 rows whose occurrence-level union is exactly `UNMAPPED_REQUIRES_REVIEW`;
- 12 Broad-mismatch rows whose union contains no C01–C10 label (some carry later C11/C12 labels).

Neither 3 nor 12 reproduces 239. More importantly, the row-level union cannot tell whether a row containing a mapped family also contains one or more separately unmapped Broad edit operations. Therefore the 239 criterion (“at least one fragment not mapped to C01–C10”) cannot be reconstructed from this CSV column. This is a reproducibility finding, not a redefinition of the historical 239 population.

**Disposition unchanged:** do not select 239 IDs from the 1,267 rows by approximation. The missing input is the original per-fragment C01–C10 assignment snapshot or the exact executable selection predicate that produced the 239-member set. Once recovered, it must select exactly 239 unique occurrence IDs before context joins and individual decisions are populated.

## Full Broad-mismatch evidence superset — 2026-11-05

The pinned 2,703-occurrence report and pinned UGTPHON test split have now been joined occurrence-by-occurrence. The result is [the 370-row Broad-mismatch context ledger](kozak-kim-broad-mismatch-context-ledger-2026-11-05.csv).

- Source mismatch export: `research/kozak-kim-mismatch-fragments-2026-11-02.csv` at historical HEAD `4f3f307c5bb056bce3b0aedc8ab07e0010eaa695`, blob `552139f72e3b0cbd32bf3dd83ad4bf5bc59238a7`.
- Exactly 370 rows have `broad_edit_distance > 0` and unique occurrence IDs.
- All 370 occurrence IDs were replay-joined against the pinned UGTPHON token traversal; source row ID, canonical token and exact token index matched. Every row has full sentence text, canonical sentence and phoneme annotation.
- The ledger pins benchmark artifact/report hashes, engine source commit/blob, Broad IPA profile/version, sensitivity profile/version/blob, both normalizer source blobs, UGTPHON commit/blob and Apache-2.0 metadata.
- Each row is explicitly `ABSTAIN` / `EVIDENCE_LIMITED_DIAGNOSTIC_ONLY`: a mismatch score is not independent pronunciation adjudication and does not authorize a production fix.
- `historical_239_membership` is deliberately `UNRESOLVED_NO_HISTORICAL_ASSIGNMENT_SNAPSHOT`. The 370-row superset is not falsely presented as the 239-member historical cohort.

Regression coverage: `tests/test_kozak_broad_mismatch_context_ledger.py` asserts row count, unique IDs, context availability, token-index bounds, decision state and every pinned provenance field.

This closes the context/provenance recovery for the full Broad-mismatch superset, but it does **not** close the 239-member historical selection or independent linguistic review. The missing acceptance input remains the historical C01–C10 per-fragment assignment snapshot or an executable selection predicate that reproduces exactly 239 stable occurrence IDs.

