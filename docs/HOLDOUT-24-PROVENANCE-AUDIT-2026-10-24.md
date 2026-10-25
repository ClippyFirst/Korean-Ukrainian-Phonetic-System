# 24-form Korean holdout provenance audit — 2026-10-24

## Result

**Status: BLOCKED — original frozen membership is not verified.**

The 24-row CSV introduced on PR #307 is retained as a diagnostic candidate fixture, but it must not be represented as an exact restoration of the original holdout. The fixture's own initial note said that the original manifest was not found; the earlier status `restored_from_prior_handoff` overstated the evidence. It has been corrected to `reconstructed_unverified`.

## Evidence checked

1. Merged PR [#306](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/306) explicitly says the exact frozen 24-form list must be preserved as a tracked fixture before per-form reconciliation can be independently reproduced.
2. The tracked Git tree at the relevant pre-fixture commits `2f12ec34daa7a595d7bd411ab3d268294fbb71fb` (PR #306 code head), `d12b41b1440de27f54a7ff63340e164d7759b024` (merge commit), and `94c21ea957c28225caea27b9df69aa8772fea6f7` (benchmark branch head) has no path matching `24-form`, `holdout`, `target-renderer`, or `abstention.*diagnostic`.
3. PR #307 adds `data/korean/benchmarks/target-renderer-holdout-24.csv` with 24 unique Hangul strings, but its rows have no independent source locator, source hash, or IPA/Ukrainian gold. The file says the original manifest was not found.
4. The current mainline handoff still lists reproducible 24-form reconciliation as TODO, requiring the original inputs to be located or recovered from a verifiable artifact/run input.
5. PR #309's CI covers diagnostic reason-matrix tests. It does not establish the provenance or linguistic correctness of the 24 input strings.

These checks establish that the original list was **not found in the reviewed tracked trees**. They do not prove that no external Actions artifact, earlier conversation attachment, or unreviewed branch ever contained it.

## Corrected fixture contract

- Exactly 24 unique input strings and stable IDs are asserted by the regression test.
- `source_manifest_status=reconstructed_unverified` explicitly states that membership and ordering have not been independently verified.
- `ipa_gold_status` and `ukrainian_gold_status` remain `not_available`; no engine output is promoted to gold.
- The audit runner may report native/G2P outputs and abstention reasons, but those results are diagnostic only.

## Acceptance criteria to unblock

1. Locate the original source artifact/run input, an original manifest, or a historical tracked revision that establishes the exact list.
2. Record its immutable locator (commit/run/artifact ID), retrieval time, and SHA-256 where bytes are available.
3. Compare the original 24 forms and their order/IDs against the candidate CSV; report additions, omissions, substitutions, and order changes explicitly.
4. Restore the original membership without adding or dropping items based on model expectations. If the original cannot be recovered, keep the candidate list labelled unverified and create a newly named benchmark rather than claiming restoration.
5. Generate and inspect the deterministic per-form report only after fixture provenance is explicit. Keep source-pronunciation adjudication and Ukrainian target review as separate gates.

## Commands and verification

- GitHub repository tree API inspected at commits listed above; the trees were complete (`truncated=false`) and did not contain matching paths.
- PR #306 metadata/body inspected; it explicitly records the original fixture as outstanding.
- PR #307 fixture and test inspected; the fixture has 24 unique inputs and no gold labels.
- PR #307 provenance correction is being checked by fresh CI on the corrected head. Until those runs finish, no final-head pass is claimed.

## Release classification

Research preview / partial prototype. Passing CI validates implementation behavior, not original holdout provenance, normative Korean IPA accuracy, or Ukrainian target accuracy.


## Diagnostic artifact review — 2026-10-24

Corrected provenance/test head `9f8730c4e5714b80bb66398eadb0e7870ad554c9` passed the optional g2pK integration workflow on Python 3.11 and 3.12, including the focused test command, the 24-form report generator, wheel build, and wheel-data inclusion check. Artifacts:
- [Python 3.11 report](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40129831527/artifacts/12573827559)
- [Python 3.12 report](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40129831527/artifacts/12574198636)

The inspected Python 3.12 JSON report records fixture SHA-256 `bd2dd4e28f40345a8aed50ec3ec24021efeaa9101bef7f943bed917a50ddaeeb`, 24 input rows, and explicitly marks both IPA and Ukrainian gold labels unavailable. On that candidate fixture:
- native engine: 5/24 `diagnostic_only_unresolved_pronunciation`, 19/24 `provisional`;
- native target rendering: 5 unresolved, 18 `model-selected`, 1 `provisional`;
- g2pK path: 23 `model-selected`, 1 `provisional`.

This is diagnostic output, not accuracy. The difference between the earlier reported split of 7 strict phonology blockers / 17 target-layer blockers and the current candidate fixture's 5 native abstentions / 19 provisional IPA results is a **reconciliation warning**. It may reflect the unverified input membership, changed engine state, or differing blocker definitions; the available evidence does not determine which. Do not patch two more cases or change mappings merely to force the historical 7/17 counts. First recover the original input fixture and its original per-form report, then compare the exact rows and blocker taxonomy.

The fresh exact-head rerun after a comment-only test change is queued as of this audit; the successful run above is tied to commit `9f8730c4e5714b80bb66398eadb0e7870ad554c9`, not the latest branch head. Mainline post-merge verification for PR #309 separately passed Python regression/data integrity, browser tests/build, and strict corpus generation on merge commit `cf77fcba215172d64a3f46d9401f662529fc947e`; the test matrix and deployment workflow were still in progress at the latest check. The official NIKL live-inventory job was skipped, not passed.
