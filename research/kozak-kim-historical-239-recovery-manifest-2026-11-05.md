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


## Pre-C11/C12 baseline recovery — 2026-11-05 continuation

A further historical source snapshot has now been recovered. This narrows the blocker: the old aggregate cluster baseline and its benchmark artifact exist, but the per-fragment membership assignment needed to materialize the 239 IDs does not.

### Recovered pre-C11/C12 snapshot

| Field | Verified value |
|---|---|
| Baseline code head | `e7933ae4a67c94f0f69b4747d8e388aa082fc347` |
| Benchmark workflow run | [41453407662](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41453407662) |
| Benchmark artifact | [13148075070](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41453407662/artifacts/13148075070) |
| Downloaded ZIP SHA-256 | `075ceff080decbb142492448c9344816bfb53f1e87fe563826668d037c053b89` |
| Report | `multi-engine-ipa-report.json` |
| Report SHA-256 | `8c25e630ca828719b269aeb84c8037d9c40f881a0f15c2e4ddf9d427edffa0f9` |
| Eligible occurrences | 2,703 |
| Broad sensitivity mismatches | 370 |
| Cluster snapshot | `research/KOZAK-KIM-MASS-MISMATCH-CLUSTERS-2026-11-01.csv` |
| Cluster snapshot Git blob | `275e5d162f3357e94fccd5024ec693fcf223cecd` |

The recovered cluster CSV contains exactly the pre-C11/C12 C01–C10 aggregate rows. It records counts, operations, representative forms, classifications, decisions and next actions. It does **not** contain per-occurrence IDs or per-fragment assignments. In that snapshot C04 is still the 37-occurrence / 45-operation aspiration cluster; later work split that question into a separate C12 profile analysis and corrected C04 to a zero-residual IPA-convention item.

### Reproducibility test and conclusion

The historical triage text defines the 239 as Broad-mismatch occurrences containing at least one fragment not mapped to C01–C10. The recovered C01–C10 CSV is only an aggregate summary. The later 1,267-row fragment export stores the strict and Broad edit-fragment arrays but stores only one occurrence-level union in `candidate_clusters`; it does not store a cluster assignment on each individual Broad edit operation. The exporter also combines strict and Broad fragments when constructing that union. Consequently, neither the old cluster CSV nor the later row-level union provides enough information to decide, for each Broad mismatch occurrence, whether at least one of its individual Broad fragments was outside C01–C10.

The old artifact itself contains 2,703 engine occurrences and confirms the 370 Broad-mismatch superset, but it does not contain the historical C01–C10 fragment-assignment snapshot or a saved 239-ID member list. The 239 aggregate is therefore corroborated as a historical claim in the triage narrative, but its exact member set remains **not independently reproducible**. No candidate set has been promoted to the 239 ledger, and no 239 rows have been synthesized from the count.

### Exact remaining acceptance input

Recover one of:

1. the original pre-C11/C12 per-fragment assignment table keyed by stable occurrence ID and Broad edit-operation index; or
2. the exact versioned executable predicate and all source data used to produce the historical 239 count, such that a clean replay returns exactly 239 unique IDs.

Then verify the selected IDs against the 2,703-occurrence report, join their UGTPHON contexts, and adjudicate each independently. Until then, the 370-row context ledger remains an evidence superset, not the historical 239 cohort.



## Reconstructed 239-case candidate replay — 2026-11-05

A replay of the pinned pre-C11/C12 benchmark now yields a **239-ID candidate set**. This is a material narrowing of the earlier recovery blocker, but it is deliberately not labelled the original historical membership snapshot: the original selector/list was not preserved, and the recovered replay is a candidate interpretation of the triage note.

### Exact replay inputs

- Baseline code head: `e7933ae4a67c94f0f69b4747d8e388aa082fc347`.
- Workflow run / artifact: [41453407662](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41453407662) / [13148075070](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41453407662/artifacts/13148075070).
- Artifact ZIP SHA-256: `075ceff080decbb142492448c9344816bfb53f1e87fe563826668d037c053b89`.
- Report SHA-256: `8c25e630ca828719b269aeb84c8037d9c40f881a0f15c2e4ddf9d427edffa0f9`.
- Historical classifier source: `scripts/export_kozak_kim_mismatch_fragments.py` at commit `8c335dd7031bdae59b3ef7db715b54f0fdc9bcd5`, blob `e0bb7f32d5b320d468e0bdcab0ed134c7a3278ec`.
- Candidate ID snapshot: [`kozak-kim-historical-239-candidate-ids-2026-11-05.txt`](kozak-kim-historical-239-candidate-ids-2026-11-05.txt).

### Replayed rule and result

For each Native scored occurrence with Broad edit distance greater than zero, the Broad reference/prediction pair was aligned using the historical NFC-plus-combining-mark grapheme aligner. The **Broad fragments only** were concatenated and passed to the pre-C11/C12 aggregate C01-C10 classifier. An occurrence was selected only when that aggregate classifier returned `UNMAPPED_REQUIRES_REVIEW` and no C01-C10 label.

- Broad mismatch superset: **370** occurrences.
- Reconstructed candidate set: **239** unique occurrence IDs, **111** source rows, **154** unique tokens.
- The replay exactly reproduces the historical aggregate count of 239.
- This is an occurrence-level aggregate selector, not a per-fragment selector. The later per-fragment classifier returns **269** occurrences with at least one individually unmapped Broad edit. These populations must not be conflated.
- Therefore the earlier prose saying that the historical 239 necessarily meant “at least one individual fragment was unmapped” was too strong. The replay supports the narrower aggregate interpretation above; the original selection implementation remains unproven.

### Crosswalk to decisions already recorded

| Current disposition | Candidate IDs | Interpretation |
|---|---:|---|
| `FIX` | **3** | IDs `37`, `704`, `2031` overlap the four exact R013 fixes in the 36-row queue. Their exact source-context licenses are implemented in Kozak Kim and covered by the merged PR #426 verification. |
| `RETAIN` | **1** | ID `1140` (`출산`) is a provisional R012 retain, still awaiting independent Korean IPA review; it is not counted as solved. |
| `ABSTAIN` | **22** | These IDs overlap the individually reasoned 31-row abstention ledger; they remain unresolved pending evidence/review. |
| No individual disposition | **213** | Candidate rows without a row-specific fix/retain/abstain decision in the current narrow queue. |

The fourth exact R013 fix, occurrence `2018` (`존중시킬수도있지만`), is outside this reconstructed candidate set because its historical Broad fragments already receive C02/C04 aggregate labels. Thus **3 of the 239 candidates have verified exact-form fixes**, leaving **236 candidate cases not yet resolved** (213 undecided + 22 abstentions + 1 provisional retain). This is a crosswalk against the old benchmark, not a claim that a post-fix full benchmark now has exactly 236 mismatches.

### Status and acceptance boundary

- Historical 239 membership: **PARTIAL** — a hash-pinned replay yields exactly 239 stable candidate IDs, but the original saved ID list/predicate is absent, so historical identity is not yet independently proven.
- Candidate remaining count: **236**, after subtracting only the three verified FIX overlaps. RETAIN and ABSTAIN do not decrement the unresolved count.
- Next acceptance: confirm that the original 239 triage used this aggregate Broad-only pre-C11/C12 selector, or recover the original selector/member list; then preserve the 239-row candidate crosswalk and adjudicate the remaining 236 individually.
- No runtime phonological rule was changed in this recovery pass. The full post-fix benchmark has not been rerun. No independent IPA decision is inferred from the benchmark label.



## Exact-head CI and merge record — 2026-11-05

The reconstructed candidate snapshot and its regression crosswalk were merged to `main` through PR [#435](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/435), merge commit `98e450f1fb90e920d2b372ab3098b000d34de2e2`. PR head before merge: `f4064bb998343f587ee769259059db7202dc121f`.

Exact-head checks on the PR head:
- System Verify [42009815364](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42009815364): **PASS** — Python regression/data integrity and Browser regression/build. Official NIKL metadata inventory: **SKIPPED**.
- Tests [42009822625](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42009822625): **PASS** — Python 3.11, 3.12, 3.13; web tests; teacher-corpus audit; clean wheel installation.
- Master/research corpus artifacts [42009822802](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42009822802): **PASS**.
- Exhaustive test-case register extraction [42009822726](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42009822726): **PASS**.
- The first test run on pre-correction PR head `6037ed553b199b5091542064eba4121aff99ceff` exposed a test-parser defect (the test read the header line instead of the following comma-separated ID line). The parser was corrected in `f4064bb998343f587ee769259059db7202dc121f`; the exact-head rerun above passed.
- Local pytest/npm were not run in this connector-only session. GitHub Actions supplied the verification evidence.
- No post-fix multi-engine benchmark was run; the recovery PR changes only research metadata/tests and does not claim updated phonetic benchmark scores.

Current research disposition remains: **239 reconstructed candidate IDs; 3 verified FIX overlaps; 236 candidate cases still unresolved**. RETAIN and ABSTAIN do not decrement the remaining count. Historical membership is still PARTIAL pending confirmation of the original aggregate selector; no independent IPA or Ukrainian-target gold is claimed.


## Candidate-ID list validation — 2026-11-07

The tracked file `research/kozak-kim-historical-239-candidate-ids-2026-11-05.txt` was counted directly: it contains **239 numeric IDs, all unique, with no duplicates**. This validates the file's cardinality and internal uniqueness only.

It does **not** authenticate those IDs as the original historical 239-member cohort. The file is explicitly named a candidate-ID list; the original selection predicate / per-fragment C01–C10 assignment snapshot is still missing, and the list's membership cannot be independently replayed from the pinned mismatch export. Therefore:

- retain the 239 IDs as a reconstructed candidate set;
- do not relabel them as proven historical members;
- do not promote the 236 review cohort to proven original membership;
- keep the manifest status **PARTIAL / MEMBERSHIP RECONSTRUCTION BLOCKED** until the original predicate or assignment snapshot is recovered.

This is a data-provenance limitation, not an audio limitation. It cannot be repaired by inventing IPA or by choosing a 239-row subset from the aggregate count.
