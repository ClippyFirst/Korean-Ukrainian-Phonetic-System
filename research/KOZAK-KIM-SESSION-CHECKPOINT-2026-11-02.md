# Session checkpoint — 2026-11-03 (Kozak Kim only)

**Repository:** ClippyFirst/Korean-Ukrainian-Phonetic-System  
**Branch:** research/kozak-kim-mismatch-fragment-triage-2026-11-02  
**Branch HEAD at checkpoint refresh:** `c8d26da8851c7b02d060f17802d79b44a46c7cb9` (PR #423 live head).  
**Algorithm code tree:** `5c775dfa6b6a969c320f47c1420c75ffa645e369`; subsequent commits add research tests/records/docs.  
**PR:** [#423](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/423), Draft / open / unmerged; stacked on #422.  
**Scope:** Kozak Kim only. Original g2pK 0.9.4 source and vendor files remain unchanged.

## Exact-head verification — 2026-11-03

- Full system Verify [41611695345](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41611695345) on `c8d26da8851c7b02d060f17802d79b44a46c7cb9`: **PASS** — 624 Python tests; 1,389 Browser tests; Vite build and generated-page checks pass. NIKL metadata-only inventory **SKIPPED**. Five reconstructed/uncertain C08 contexts are negative controls for R013 and remain unchanged without an exact license.
- Browser G2P [41610752163](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41610752163), UGTPHON [41610752125](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41610752125), paired Native/g2pK [41610752064](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41610752064), morphology [41610752140](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41610752140), and test extraction [41610752041](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41610752041): **PASS**.
- Multi-engine comparison: last fully inspected success [41535300358](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41535300358), artifact [13184368365](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41535300358/artifacts/13184368365). Newer attempts were cancelled by concurrent head updates; no newer result claimed.
- Charsiu train/dev queue, CharsiuG2P inference and ByT5 inference: **SKIPPED**.
- Previous stale source-register test failures were corrected. Final full-system exact-head run passed; the C08 fixture integrity test is included in the 624 passing Python tests.

## Current ledger

| Item | Status | Remaining acceptance |
|---|---|---|
| C11 [ɕ], C05 [y]/[wi]/[ɥi], C01/C07 [ɭ], C02 [ɸ] | PARTIAL | Source-scoped variants and regression/parity checks pass; two independent IPA reviewers and item-level adjudication still needed. |
| C06 unreleased coda, C09 lexical length | DONE_VERIFIED (preservation decisions) | Preserve source-supported detail; do not fit corpus omissions. |
| C12 kx/kç → kʰ | BLOCKED | Exact-environment primary evidence and independent IPA adjudication absent. |
| Native/Browser parity | DONE_VERIFIED | 2,703 surface and 2,698 scored IPA occurrences identical. |
| Main CI + diagnostics | DONE_VERIFIED | All non-skipped exact-head workflows passed. |
| 239 unmapped occurrences | TODO | Sentence/morphology/source adjudication. |
| Independent Korean IPA gold | BLOCKED | Two qualified independent reviewers and adjudication. |
| NIKL item-level reuse rights | BLOCKED | Written rights determination; metadata inventory skipped. |
| Ukrainian target adaptation | BLOCKED | Independent target review and acceptance tests. |
| CharsiuG2P / ByT5 | DEFERRED | Inference skipped; no results. |
| Release readiness | DEFERRED | Research prototype; not release-ready. |

Training-readiness audit says supervised IPA training is not ready: no explicitly independently adjudicated IPA labels in the inspected additions and no IPA gold for the frozen holdout. Do not train on UGTPHON, SIGMORPHON test, or the frozen holdout.

Local clone remains unavailable in this environment because DNS resolution for github.com failed; test claims above are from GitHub Actions, not local commands. No merge, release, deployment, force-push or g2pK/vendor change was made.

## Next genuine blockers

1. Two independent Korean IPA reviewers to annotate the frozen 24-item holdout and adjudicate disagreements.
2. Item-level NIKL reuse-rights determination.
3. Independent Ukrainian phonetic/orthographic target review.
4. Context/source adjudication for C12 and the 239 unmapped occurrences.
5. Only after gold/rights/target gates: consider supervised training or optional neural engine inference.

---

# Latest continuation checkpoint — 2026-11-02 (Kozak Kim only)

## Current branch state

- Repository: `ClippyFirst/Korean-Ukrainian-Phonetic-System`
- Branch: `research/kozak-kim-mismatch-fragment-triage-2026-11-02`
- Draft PR: [#423](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/423)
- Latest branch head before this checkpoint update: `d941e3fa6d2c284e4de6ed19bb60a2950566d7f4`.
- Original g2pK source and vendor files remain unchanged.
- PR #423 remains Draft / open / unmerged. No release, deployment, merge, or branch deletion.

## New implementation since the previous checkpoint

1. Expanded optional lenis /s/ → [ɕ] variants to all /j/-initial diphthongs described by S018 (Lee 1999); canonical Broad /s/ remains unchanged and fortis ㅆ remains excluded.
2. Added S018-backed [ɸ] for same-word intervocalic ㅎ in Narrow v5 and as an optional Broad variant.
3. Added S018-backed [ɭ] for intervocalic /l/ and before /i,j/ in Narrow v5 and as an optional Broad variant.
4. Kept ㅟ [y] canonical with [wi] and [ɥi] alternative candidates.
5. Bumped the narrow profile to `clippyfirst-korean-narrow-contextual-allophones-v5`, version 5; it remains partial research-only and not target-compatible.
6. Added Python and Browser regression tests for the new contexts and updated profile metadata assertions.
7. Updated `research/KOZAK-KIM-MISMATCH-FRAGMENT-TRIAGE-2026-11-02.md` and `docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md` with cluster dispositions, evidence and exact-head verification boundaries.

## Current task ledger

| Work item | Status | Acceptance / blocker |
|---|---|---|
| C11 sibilant place | PARTIAL | Optional [ɕ] covers S018 /j/-initial contexts; canonical /s/ unchanged; independent review and fresh benchmark required. |
| C05 ㅟ [y]/[ɥi]/[wi] | PARTIAL | Alternatives exposed; speaker/context distribution not independently adjudicated. |
| C12 `kx/kç → kʰ` | BLOCKED | 45 operations / 37 occurrences; no exact-environment primary source plus independent IPA adjudication. No rewrite. |
| C06 unreleased coda | DONE_VERIFIED (preservation decision) | [p̚,t̚,k̚] preserved; broad normalization does not strip release marking. |
| C01/C07 liquids | PARTIAL | Source-scoped [ɭ] in Narrow v5 and optional Broad variants; no blanket ɾ/l replacement. |
| C09 lexical length | DONE_VERIFIED (preservation decision) | Source-attested length overrides retained. |
| C02 /h/ realization | PARTIAL | Intervocalic [ɸ] source-scoped in Narrow v5 and optional Broad; no general /h/ rewrite. |
| New Python/Browser regressions | PARTIAL | Added but no exact-head test results available. |
| New exact-head CI | BLOCKED | No workflow runs or status checks returned for the new branch head. |
| Independent IPA gold | BLOCKED | Two qualified independent reviewers and adjudication needed. |
| NIKL item-level reuse rights | BLOCKED | Rights/permission review incomplete. |
| Ukrainian target adaptation | BLOCKED | Independent Ukrainian phonetic/orthographic review outstanding. |
| Release readiness | DEFERRED | Research prototype only. |

## Verification boundary

The previous code head `4f3f307c5bb056bce3b0aedc8ab07e0010eaa695` has completed:
- System verification 41471244329 PASS (Browser 1,384/1,384, Python/data integrity, build; NIKL inventory SKIPPED).
- Browser G2P 41471244336 PASS.
- Multi-engine diagnostic 41471244424 PASS.
- External UGTPHON 41471244483 PASS.
- Paired Native/g2pK 41471244408 PASS.
- Morphology consensus 41471244332 PASS.
- Test-case register extraction 41471244303 PASS.

Those results predate the new v5 code and tests and must not be represented as verification of the current head. Current branch head has no returned workflow runs or commit status checks. Local clone was blocked because `github.com` could not be resolved in this environment.

## Prior-head paired baseline (UGTPHON diagnostic, not gold)

On 2,698 shared scored occurrences:
- Strict exact: Native 53.0393%; g2pK 53.1134%.
- Strict CER: Native 9.0613%; g2pK 9.2304%.
- Broad exact: Native 86.2861%; g2pK 85.6931%.
- Broad CER: Native 2.2038%; g2pK 2.3751%.

Native has lower CER; original g2pK has a two-occurrence strict exact edge. No v5 gain is claimed.

## Resume checklist

1. Obtain fresh exact-head Python regression/data integrity, Browser tests/build, and generated-page checks.
2. Run fresh paired Native/g2pK and ten-engine diagnostics on the exact same test occurrences.
3. Compare strict and Broad metrics separately; inspect optional variant coverage without promoting variants or corpus annotations to gold.
4. Keep C12 and all unmapped mismatch fragments evidence-limited.
5. Obtain independent IPA adjudication, NIKL rights review, and Ukrainian target adaptation review before release claims.

---

# Kozak Kim session checkpoint — 2026-11-02

## Saved state

- Repository: `ClippyFirst/Korean-Ukrainian-Phonetic-System`
- Draft PR: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/423
- Branch: `research/kozak-kim-mismatch-fragment-triage-2026-11-02`
- Exact saved HEAD at checkpoint creation: `a93a371c92542085086ee292a58f01b370f23384`
- Base branch: `fix/kozak-kim-surface-parity-and-lexical-length-2026-11-02`
- Base SHA: `e7933ae4a67c94f0f69b4747d8e388aa082fc347`
- PR remains **Draft / open / unmerged**.
- Scope remains **Kozak Kim only**. Original upstream g2pK and vendor source are untouched.

## Work already stored in the branch

1. Occurrence-level mismatch-fragment exporter:
   - `scripts/export_kozak_kim_mismatch_fragments.py`
   - diagnostic-only; labels are `UNADJUDICATED_DIAGNOSTIC`
   - grapheme-cluster Levenshtein alignment, explicitly not phoneme alignment
   - missing occurrence ledgers fail closed
   - C12 classifier detects full-IPA `kx/kç` vs `kʰ`, suppressing the misleading fragment-only C04/C02 labels.
2. Algorithm/profile work:
   - `src/korean_ukrainian/ipa.py`: narrow profile v4; contextual [ç]/[x]; ㅒ added to scoped lenis sibilant context; optional [ɕ] and [ɥi] variants in broad IPA.
   - `src/app/engine_lexical.js` and `src/app/engine_convert.js`: matching optional variants for shared Browser Broad profile; legacy default output remains unchanged.
   - Canonical Broad outputs remain unchanged; optional variants are inspectable candidates. Fortis ㅆ is not force-palatalized.
3. Tests:
   - `tests/test_ipa.py`
   - `tests/test_narrow_ipa.py`
   - `tests/kozak-kim-ipa-first-benchmark.test.mjs`
   - `tests/test_export_kozak_kim_mismatch_fragments.py`
   - Latest fix updated combined [ɥi] variant enumeration and stale narrow profile v3 assertions to v4.
4. Evidence registry:
   - `data/korean/sources.csv`: S018 Lee (1999, JIPA); S019 Kang (2010); S020 Kim (2011, UCL thesis).
5. Reports/handoff:
   - `research/KOZAK-KIM-MISMATCH-FRAGMENT-TRIAGE-2026-11-02.md`
   - `docs/MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md`
   - PR #423 body has the current scope, findings, verification state, and blockers.

## Diagnostic findings preserved

From the pinned UGTPHON test artifact (2,698 scored Native occurrences):
- 1,267 strict non-exact cases; 370 Broad non-exact cases. These are not adjudicated engine errors.
- Largest Broad fragment cluster: `ɕ → s`, 229 edit operations / 227 occurrences. Treat as profile/allophony disagreement unless independently adjudicated.
- Other clusters include `kx/kç` vs `kʰ`, ㅟ [y] vs [ɥi], unreleased-coda marking, liquid realizations, and lexical length.
- No corpus-specific production rewrite was applied to C06, C01/C07, C09, or C12 because evidence is insufficient.
- Existing previous result: UGTPHON Native strict exact 53.0393%, CER 9.0613%; Broad exact 86.2861%, CER 2.2038%. Do not claim the new optional variants improve accuracy; fresh exact-head benchmark is pending.
- Training readiness remains false. Do not train on UGTPHON, SIGMORPHON test, or frozen holdout.

## CI state at the saved HEAD

For prior head `4fd78d59a46ccc4da8e6e57cff27899dff149987`:
- Browser G2P integration PASS: run 41468344488.
- External UGTPHON diagnostic PASS: run 41468344619.
- Exhaustive test-case register extraction PASS: run 41468344570.
- Paired Native-vs-g2pk PASS: run 41468344781.
- Morphology-consensus diagnostic PASS: run 41468344848 (verify exact run ID if needed; prior fetch listed 41468344847).
- General Verify: Browser/build job PASS; Python tests failed on two stale assertions. Failure details:
  - combined `괴물귀` variants expected only [wi], but [ɥi] was newly added;
  - `tests/test_narrow_ipa.py` expected v3 profile metadata after profile bump to v4.
- Both stale assertions were corrected in commits ending at saved HEAD `a93a371...`.

Fresh exact-HEAD runs triggered for saved HEAD:
- Verify Korean–Ukrainian system: 41469463074 (in progress at checkpoint).
- Browser G2P integration: 41469463354 (in progress).
- Multi-engine Korean IPA diagnostic benchmark: 41469462964 (in progress).
- External UGTPHON diagnostic: 41469462940 (in progress).
- Paired Native vs g2pk: 41469463295 (in progress).
- Morphology-consensus diagnostic: 41469463084 (in progress).
- Exhaustive test-case register extraction: 41469462951 (in progress).

## Resume checklist

1. Query PR #423 and branch HEAD first; it may have advanced after this checkpoint.
2. Fetch the exact-head workflow runs and wait for completion. Inspect Python failure logs if any; Browser/build and multi-engine must be checked separately.
3. Fix only verified failures; update this checkpoint and master handoff in place.
4. Download the successful multi-engine artifact and run the mismatch exporter to generate and inspect the actual CSV table. Do not invent or hand-edit occurrence annotations.
5. Compare final benchmark metrics with the saved baseline; do not call a gain unless measured.
6. Reconcile all open PRs/branches in the PR chain; do not merge automatically.
7. Keep remaining tasks blocked until independent IPA adjudication, NIKL rights review, and Ukrainian target adaptation validation are completed.

## Current task ledger

| Work item | Status | Evidence / acceptance |
|---|---|---|
| Mismatch fragment exporter and tests | PARTIAL | Code and unit tests committed; generate/inspect CSV from exact-head benchmark artifact |
| C12 cluster classification correction | DONE_VERIFIED (unit-level) | Full IPA classifier test; exact-head CI pending |
| Optional allophone candidates [ɕ], [ɥi], [ç], [x] | PARTIAL | Native/Browser code and regression tests; exact-head CI and linguistic adjudication pending |
| Narrow profile v4 | PARTIAL | Source-scoped code and tests; exact-head CI pending |
| Master triage and source registry | DONE_VERIFIED (documented) | Files committed; linguistic generalizations remain bounded by listed sources |
| Exact-head CI | TODO | Runs above still in progress |
| Final multi-engine comparison | TODO | Run 41469462964 still in progress |
| Independent IPA gold | BLOCKED | Two qualified independent reviewers/adjudication not yet available |
| NIKL rights review | BLOCKED | Licensing/permission evidence required |
| Ukrainian target adaptation validation | TODO | Target-inventory and adaptation review required |
| Release readiness | DEFERRED | Research prototype only; not release-ready |

## Important boundaries

No merge, release, publication, or external settings changes were made. This checkpoint records the repository state and the next exact actions.

## Continuation correction — 2026-11-03

- C08 fixture maps all eight rows: 3 independently recovered, 5 reconstructed. Seven have conditional morphology/Rule §27 leads; `유사성` remains unresolved. No exact-token IPA gold or new production rule. The new Python test verifies this boundary.
- C04 is IPA aspiration-symbol/segmentation convention (0 residual occurrences); C02 is /h/ realization. Previous C04-/h/ descriptions are historical label errors.
- C12 Ito (2007) is abstract-only context, not evidence for a production `kx/kç → kʰ` rewrite.
- NIKL Q&A 319525 supports `맛없다[마덥따]` as Hangul surface only, not IPA. It gives a bounded SIGMORPHON comparison case where Kozak Kim matches and untouched g2pK differs.
- Original g2pK and its vendor source remain unchanged.


## Final continuation correction — 2026-11-03

- C08 fixture maps all eight rows: 3 independently recovered, 5 reconstructed. Seven have conditional morphology/Rule §27 leads; `유사성` remains unresolved. No exact-token IPA gold or new production rule. Integrity test passes.
- C04 is IPA aspiration-symbol/segmentation convention (0 residual occurrences); C02 is /h/ realization. Previous C04-/h/ descriptions are historical label errors.
- C12 Ito (2007) is abstract-only context, not evidence for a production `kx/kç → kʰ` rewrite.
- NIKL Q&A 319525 supports `맛없다[마덥따]` as Hangul surface only, not IPA. It gives a bounded SIGMORPHON comparison case where Kozak Kim matches and untouched g2pK differs.
- Original g2pK and its vendor source remain unchanged.


## C08 regression boundary — 2026-11-03

`tests/test_end_to_end.py` now guards the five reconstructed/uncertain contexts (`해줄것`, `많을거같이`, `보일거라`, `내릴수있는`, `안할듯`) against inferred R013 fortition. This is a conservative no-generalization test, not gold pronunciation for those forms. Exact-head Verify [41611695345](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41611695345) passed.


## Session continuation checkpoint — 2026-11-03 (PR #424)

- Active branch: `fix/kozak-kim-kkeulda-lexical-correction-2026-11-03`; code head `2e6e739c2ede3f08b6289022037a06406221c5a4`; PR #424 Draft/open, stacked on #423. The chain #420→#421→#422→#423→#424 remains unmerged.
- `끌다`: exact NIKL §7 length-retention example `[끌ː다]` with `끌어[끄ː러]`; dictionary entry 62281 corroborates. Project IPA is derived; Ukrainian target withheld.
- `굶다`: exact Rule §24 derivation from ㄻ + ending-initial ㄷ; `굶기다` is the explicit -기- negative control.
- Fixed a g2pK adapter leak: `variant-aware-research` (`못잃어`) could previously change the adapter output to provisional `몬니러`. TDD red commit `5131e807` reproduced it; implementation `2e6e739` excludes both research-only input kinds from surface and IPA overrides. Original g2pK and vendored source remain unchanged; raw benchmark script uses direct `G2p()`.
- System Verify 41637788167 and 41637795909 PASS; Browser 1,391/1,391, Python/data integrity, build and generated pages pass. g2pK 3.11/3.12 integration, extraction, UGTPHON, paired Native/g2pK, morphology consensus and adapter smoke all PASS.
- Multi-engine rerun 41637795800 was IN PROGRESS; do not claim new results. Existing artifact 13226589858 remains valid for the unchanged raw benchmark path.
- Remaining blockers: two independent Korean IPA reviewers/adjudication; item-level NIKL rights; independent Ukrainian target review; C12 acoustic/articulatory evidence; 239 mismatch occurrences; adjudicated IPA gold for supervised training. Not release-ready.
