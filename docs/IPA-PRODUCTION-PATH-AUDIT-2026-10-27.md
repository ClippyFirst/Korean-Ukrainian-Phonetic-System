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

## Safe next implementation gate

Do not simply wire the empty allowlist into the existing default browser route: that would silently suppress all existing target output before the approved profile and migration behavior have been decided. Instead:

1. Add an explicit strict/profile-gated browser mode and make it use `ipaTargetForProfile()` for both normal and lexical/mixed-input returns.
2. Test that strict mode withholds Ukrainian output and returns the exact rejection reason for unadjudicated, partial, and unregistered profiles; test both return paths.
3. Keep legacy compatibility mode explicitly labeled as legacy/research-only until the project chooses a migration cutover.
4. Add parity coverage for Python and browser strict mode using the shared fixture, including profile metadata and the no-public-target invariant.
5. Only enable strict mode by default after a profile is independently adjudicated, allowlisted, and the migration tests prove there is no bypass.

## Verification state

- Source audit: **DONE_VERIFIED** against the named branch head and file contents.
- Shared negative fixture and Python/JS consumers: committed, but this audit does not claim their exact-head CI passed.
- Current-head workflows for commit `4c21616b1b96d954e1ed3384e6490e7a30443e9c`: the test matrix, browser integration, and Python/browser system regression jobs were still **QUEUED** at the time checked. Official NIKL live source inventory was **SKIPPED**.
- Local tests: **BLOCKED** by the previously observed DNS failure resolving `github.com`; no local test pass is claimed.
- Independent broad/narrow and ㅅ/ㅆ adjudication, target-inventory review, and rights clearance remain blocked/evidence-limited.
- PR #339 remains open and Draft. No merge or release performed.
