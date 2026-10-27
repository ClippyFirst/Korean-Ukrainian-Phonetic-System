# IPA production-path audit — 2026-10-27

## Scope and evidence

Audited the current branch at `4c21616b1b96d954e1ed3384e6490e7a30443e9c` (the latest known head at audit time), focusing on the browser entry points and the Python pipeline:

- `src/app/engine.js` exposes `createEngine().convert()` and `convertSurface()`.
- `src/app/engine_convert.js` derives a per-unit IPA string, calls `traceIpaMappingDetailed(unitIpa)`, and uses that result to fill the public `ukrainian` output. The normal return labels the IPA profile `browser-legacy-contextual-v1` (or `browser-surface-mode-legacy-v1`) and `ipa_profile_status: unadjudicated-cross-runtime`, but does not route the public output through `ipaTargetForProfile()`.
- The lexical/mixed-input early-return path in `engine_convert.js` has the same profile metadata and also returns public Ukrainian text without the profile-aware gate.
- `src/app/engine_ipa.js` does provide `ipaTargetForProfile()`, but `ADAPTER_COMPATIBLE_IPA_PROFILES` is empty. Its fail-closed behavior is tested in isolation.
- `src/korean_ukrainian/pipeline.py` is stricter: `transliterate_korean()` withholds output when phonology is unresolved, IPA is diagnostic-only, or the selected narrow profile is marked target-incompatible; otherwise it calls the raw-string `render_ipa_sequence_to_ukrainian()`. This remains a legacy/raw-IPA route and is not equivalent to a profile-allowlisted route.
- `src/korean_ukrainian/ipa_target_renderer.py` has the typed-result guard `render_profiled_ipa_to_ukrainian()`, also with an empty profile allowlist.

## Finding

**PARTIAL / acceptance-blocking:** the profile-aware guard exists and its negative tests are useful, but it is not the exclusive production target path in the browser. The unadjudicated profile label and a non-empty public `ukrainian` field can coexist. This is an architectural contract inconsistency, not a test failure and not evidence that current linguistic output is approved.

The raw-string Python renderer is also a compatibility API. It must not be mistaken for approval of the upstream IPA profile.

## Implementation result and next acceptance gate

- Added an explicit opt-in `requireAdjudicatedIpaProfile: true` mode at the public browser engine wrapper (`src/app/engine.js`). Both `convert()` and `convertSurface()` route their final result through `ipaTargetForProfile()` in this mode; default legacy behavior remains unchanged for compatibility. Invalid non-boolean values throw a `TypeError`.
- Added browser regression tests for both entry points. They assert that an unadjudicated profile yields no accepted Ukrainian text, clears candidate output, and returns `ipa_profile_not_adjudicated_compatible`; tests also cover option-type validation. These tests are committed but exact-head CI is pending.
- The opt-in gate is a migration seam, not completion of exclusive production wiring: the default public browser mode still uses the legacy raw IPA mapping path, and the lexical/mixed-input path is only protected when callers opt in. Do not call the default route production-approved.

Next acceptance gate:
1. Add Python pipeline parity for the explicit strict/profile-gated mode and consume the same shared fixture.
2. Verify the browser strict wrapper for lexical/mixed-input inputs as well as simple inputs, including source punctuation and IPA/source alignment.
3. Wait for exact-head CI and fix any failures; do not count queued jobs as pass.
4. Only enable strict mode by default after a profile is independently adjudicated, allowlisted, and migration tests prove there is no bypass.

## Verification state

- Source audit: **DONE_VERIFIED** against the named branch head and file contents.
- Shared negative fixture and Python/JS consumers: committed, but this audit does not claim their exact-head CI passed.
- Current-head workflows for commit `4c21616b1b96d954e1ed3384e6490e7a30443e9c`: the test matrix, browser integration, and Python/browser system regression jobs were still **QUEUED** at the time checked. Official NIKL live source inventory was **SKIPPED**.
- Local tests: **BLOCKED** by the previously observed DNS failure resolving `github.com`; no local test pass is claimed.
- Independent broad/narrow and ㅅ/ㅆ adjudication, target-inventory review, and rights clearance remain blocked/evidence-limited.
- PR #339 remains open and Draft. No merge or release performed.


## Cross-runtime opt-in gate continuation

- Python parity added in `src/korean_ukrainian/pipeline.py` as `transliterate_korean(..., require_adjudicated_ipa_profile=True)`. It routes the typed `surface["ipa"]` result through `render_profiled_ipa_to_ukrainian()`; default legacy behavior is unchanged. Non-bool values are rejected. Regression tests cover broad unadjudicated, narrow partial research-only, and invalid-option cases in `tests/test_ipa_target_renderer.py`.
- Browser public wrappers now support the same opt-in concept as `requireAdjudicatedIpaProfile: true` for both `convert()` and `convertSurface()`. The browser test additionally exercises the `6·25` mixed-script lexical early-return path, which previously was an important possible bypass. Test consumers for the common negative fixture remain in place.
- Latest code/test head: `dce303cabdeedebe5508e94ddf5389af36c300a2`. Exact-head test workflow `40517249803`, system verification `40517249986`, and browser integration `40517249868` were **QUEUED** when checked. No CI or local test pass is claimed for these new changes.
- Remaining: strict mode is opt-in, not the default; default legacy browser and Python raw-IPA routes still exist. Do not enable strict mode by default until independent profile adjudication, target-inventory acceptance, and clean exact-head verification are complete.


## Strict-mode hardening after code review

- Strict browser mode now also clears target text from per-unit trace outputs, candidate fields, target mapping details, and variant spellings, while retaining source/IPA provenance. Regression assertions enforce the no-target-leak invariant.
- Both browser and Python strict modes now preserve the upstream unresolved-phonology gate before any profile approval can result in a target. Python checks unresolved pronunciation and diagnostic-only IPA before invoking the profiled renderer.
- Latest code head after these fixes: `4456d47393313090cb17115494a6ce85347fa121`. Exact-head test matrix `40517742289`, system verification `40517742426`, and browser integration `40517742266` were **QUEUED** when checked. No test pass is claimed.



## Additional regression guard — unresolved phonology

Added a Python pipeline assertion in commit e12746255f576dd416587ff17cb20f59fc07ecc1: even with require_adjudicated_ipa_profile=True, the known unresolved input 앉어라 must remain abstained with target_status=unresolved, reason unresolved_korean_phonology, no Ukrainian orthography, and diagnostic-only IPA. This protects the ordering invariant: profile gating must not override unresolved source-language phonology.

The workflow-run lookup for this exact test-only commit returned no associated runs. Earlier runs for code head 4456d47393313090cb17115494a6ce85347fa121 remain queued; neither observation establishes a passing test result. Treat this new regression as committed but unverified until a workflow actually runs on the exact head.


## Live continuation check — 2026-10-27 (branch head `650465730888a1c852f242c41d1c60b1baac3371`)

This section supersedes earlier queued-run snapshots above for workflow state only; it does not change the linguistic acceptance criteria.

- **Branch:** `research/strict-teacher-guided-rule-mining-2026-10-26`; latest known head at this check: `650465730888a1c852f242c41d1c60b1baac3371`.
- **Current-head CI was discovered and is queued, not green.** The latest commit workflow lookup returned these relevant runs: tests `40520590812` (web, Python 3.11/3.12/3.13, wheel install, teacher corpus audit all queued); system verification `40520590789` (browser regression/build and Python regression/data integrity queued; official NIKL source inventory skipped by workflow policy); browser G2P integration `40520590788` (queued); broad/narrow Charsiu rule-review queue `40520590865` (queued). Other research workflows were also queued. Combined commit status returned no status records; that is not a pass.
- **Latest regression included in this head:** Python asserts that `앉어라` stays unresolved even when `require_adjudicated_ipa_profile=True`; this is committed but not yet verified by a completed run.
- **No local test result:** a local clean checkout and test run remain blocked by the previously observed DNS failure resolving GitHub. No local or exact-head pass is claimed until CI finishes.
- **Implementation state remains PARTIAL:** opt-in profile gate exists in both public wrappers; legacy target generation remains the default for compatibility. The allowlist `_ADAPTER_COMPATIBLE_IPA_PROFILES` / `ADAPTER_COMPATIBLE_IPA_PROFILES` remains empty. Enabling strict mode globally now would withhold all targets, so no default flip is justified.
- **Acceptance blockers remain:** independent broad/narrow IPA adjudication (including the `ㅆ` cross-runtime discrepancy), a non-empty evidence-backed compatible-profile allowlist, target-inventory review, official NIKL inventory evidence, and rights/license clearance. The neural teacher and its datasets remain research-only and must not silently create production rules.
- **PR #339:** still open and Draft at the last metadata check; no merge, force-push, release, or external setting change performed.

### Task ledger at this check

| Task | Status | Evidence / acceptance criterion |
|---|---|---|
| Cross-runtime opt-in profile gate | PARTIAL | Browser and Python wrappers exist; shared negative fixture is consumed by tests. Exact-head CI still queued. |
| Preserve unresolved Korean phonology before target adaptation | PARTIAL | Regression exists for `앉어라`; must pass on exact head. |
| Remove all legacy/raw-IPA bypasses from default public path | TODO | Migrate only after independent profile adjudication and a safe, tested migration strategy; current compatibility defaults remain. |
| Approve IPA profile for target adaptation | BLOCKED | Requires independent broad/narrow adjudication, source-backed profile version, cross-runtime agreement, and explicit allowlist review. |
| Ukrainian target inventory acceptance | BLOCKED | Requires review after source IPA profile is accepted; no approval inferred from current mapping tests. |
| Official NIKL source inventory | BLOCKED | Workflow skips live inventory; verified local official source file/evidence is still needed. |
| Dataset/model rights clearance | BLOCKED | Exact teacher checkpoint/data provenance and rights are not established; no model use or redistribution authorized. |
| Exact-head automated verification | PARTIAL | Current relevant runs are queued; no pass can be recorded until conclusions are successful. |
| Release readiness | DEFERRED | Current evidence supports a research-ready partial prototype, not a production release. |


## Exact-head CI verification — 2026-10-27, head `17faadd59c3457ab7bf53ce26a86bba940403235`

All 16 workflow runs discovered for this exact branch head completed with conclusion `success`: [tests matrix](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287118), [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287327), [browser G2P integration](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287009), [optional g2pK integration](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287258), [Charsiu train/dev rule-review queue](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287017), [multi-engine IPA benchmark](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287184), [research morphology adapter smoke](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287228), [teacher corpus split audit](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287330), [master table and corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521286886), [scratch teacher training](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287178), [exhaustive case-register extraction](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287304), [morphology consensus diagnostic](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287734), [paired native-vs-g2pk diagnostic](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287673), [external UGTPHON diagnostic](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287490), [neural teacher seed portfolio](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287245), and [additional system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521279934).

The test matrix passed wheel installation, Python 3.11/3.12/3.13, web tests/build, and teacher-corpus audit. System verification passed browser regression/build and Python regression/data integrity. The official NIKL source inventory job in run 40521287327 was **SKIPPED by workflow condition**; it is not a pass and the official-source evidence gate remains unresolved. These CI results verify code/workflow execution, not the linguistic correctness of IPA gold, Ukrainian adaptation, or source rights.

- **Exact-head strict-gate regression:** the Python `앉어라` abstention guard and shared Python/JS negative-profile fixture are included in this tested head.
- **Strict gate status:** `DONE_VERIFIED` for the opt-in implementation and its automated regression checks; exclusive/default production wiring remains `TODO`.
- **Scientific/data gates:** independent broad/narrow IPA adjudication and the `ㅆ` cross-runtime discrepancy remain `BLOCKED / EVIDENCE-LIMITED`; the compatible-profile allowlist intentionally remains empty; Ukrainian target-inventory acceptance is `BLOCKED` pending IPA adjudication; NIKL source inventory is `BLOCKED`; teacher/checkpoint rights remain `BLOCKED`.
- **Local verification:** no local test run is claimed; outbound DNS to GitHub was unavailable in the working container. CI evidence above is from GitHub Actions.
- **PR/readiness:** PR #339 remains open and Draft, unmerged. No release performed. Overall status remains **research-ready partial prototype, not release-ready**.
