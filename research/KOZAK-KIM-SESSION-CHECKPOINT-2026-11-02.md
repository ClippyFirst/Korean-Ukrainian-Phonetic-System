# Session checkpoint — 2026-11-02

**Repository:** `ClippyFirst/Korean-Ukrainian-Phonetic-System`  
**Branch:** `research/kozak-kim-mismatch-fragment-triage-2026-11-02`  
**Latest code/test head (subsequent commits are documentation-only):** `5c775dfa6b6a969c320f47c1420c75ffa645e369`  
**PR:** [#423](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/423), Draft / unmerged.  
**Scope:** Kozak Kim only; g2pK 0.9.4 remains unchanged as baseline.

## What is done

- Python and Browser Broad [ɕ] candidates aligned for ㅕ/ㅛ/ㅠ.
- [ɭ] candidate restricted to same-word context; no word-initial `례` false positive.
- [ɸ] restricted to same-word intervocalic ㅎ; narrow profile v5 assertions fixed.
- C11/C05/C01-C07/C02 remain source-scoped optional research variants; C12 remains blocked; C06/C09 preservation decisions are verified.
- Source review confirms some apparent g2pK wins are UGTPHON length omissions: NIKL §18 `없는[엄ː는]`, §7 `알다[알ː다]`, §14 `없어[업ː써]`.
- Browser paired exact is tied; Browser CER is lower; Native CER is lower with a two-occurrence exact-match edge. See master handoff for full metrics and examples.

## Verified on current HEAD

- Python regression/data integrity PASS — run 41532567453.
- Browser 1,389/1,389 + build/generated pages PASS — run 41532567453.
- Browser G2P PASS — run 41532567366.
- UGTPHON and paired Browser/g2pK PASS — run 41532567276.
- Paired Native/g2pK PASS — run 41532567384.
- Morphology consensus PASS — run 41532567281.
- Test-case extraction PASS — run 41532567279.
- Ten-engine + SIGMORPHON + Native/Browser parity still running — run 41532567426.
- NIKL metadata inventory, Charsiu queue and neural inference jobs skipped; no results claimed.

## Resume from here

1. Check run 41532567426. If successful, download and inspect its multi-engine, SIGMORPHON, holdout packet and runtime parity artifacts; if it fails, capture the exact failed step and blocker.
2. Update the master handoff and this checkpoint with the final artifact IDs, metrics and SHA. Do not edit engine code unless the benchmark exposes a reproducible, source-supported defect.
3. Keep C12, the 239 unmapped cases, two-reviewer IPA adjudication, NIKL reuse rights and Ukrainian target review as explicit blockers.
4. Perform one final diff/code review. This harness has no reviewer subagent tool; record it as a self-review, not an independent review.
5. Leave PR #423 Draft and unmerged. Do not touch g2pK/vendor files, retarget the stacked PR, publish or release.

Local clone failed on DNS resolution for github.com. CI evidence comes from GitHub Actions; no local pytest/npm/build command is claimed.

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