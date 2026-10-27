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
