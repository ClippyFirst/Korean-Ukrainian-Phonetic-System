# Native Korean engine: explicit IPA status and fail-closed regression contract

Date: 2026-10-23

## Scope

This change concerns the project's own Python research engine in `src/korean_ukrainian/pipeline.py` and its direct regression suite. It does not change the browser implementation, invent pronunciation data, or declare any candidate IPA to be expert gold.

## Problem

The native pipeline already distinguished `pronunciation_status=unresolved` from `provisional` and blocked Ukrainian target selection when known morphophonological ambiguity was found. However, the IPA string remained present in the result, while the top-level `transliterate_korean()` response did not carry an equally explicit status beside its top-level IPA value. Consumers that inspected only `result["ipa"]` could overlook that the string was diagnostic-only.

## Implementation

Both `phoneticize_korean()` and `transliterate_korean()` now expose:

- `ipa_status`: `diagnostic_only_unresolved_pronunciation` when the engine has a known unresolved morphophonological context; otherwise `provisional`.
- `ipa_is_diagnostic_only`: boolean guard for callers that need a machine-readable gate.
- `ipa_status_reason`: `unresolved_morphophonological_context` for unresolved contexts; otherwise `null`.

The IPA remains inspectable for research and debugging. This is intentional: the engine must not erase evidence needed to audit why a rule was withheld. But the Ukrainian target layer remains fail-closed: unresolved Korean phonology produces no selected target and no Ukrainian orthographic rendering.

`provisional` is not a claim of expert adjudication or universal correctness. It means only that the currently implemented uncertainty detector did not identify one of its recognized unresolved contexts.

## Regression coverage

The new parametrized test covers native-engine contexts that must remain explicitly unresolved and block target rendering:

- `앉아라` — R002 complex-coda liaison;
- `싫어` — R003 ㅎ-coda deletion;
- `넋하고` — R004 complex-coda + ㅎ;
- `갇이` — R007 morphology-conditioned palatalization;
- `늙고` — R008 ㄺ-before-ㄱ fortition;
- `깎아` — R002 simple-coda liaison where §15 changes the representative.

Negative controls ensure that unrelated or already-resolved forms (`먹이`, `일본`, `실수`, `밭에`, `국밥`) are not incorrectly labelled unresolved. A source-backed `값어치` lexical override remains provisional rather than diagnostic-only.

## Verification ledger

- `DONE_VERIFIED`: API status fields implemented in both native entry points; README contract documented; regression cases added.
- `TODO / CI`: run exact-head Node/browser build, Python regression/data-integrity across supported Python versions, and repository-defined generated-artifact checks. Do not call this batch verified until exact-head workflows finish green.
- `BLOCKED_SPECIALIST_ADJUDICATION`: broad IPA still requires independent qualified review; Korean standard-pronunciation Hangul notation is evidence for surface forms, not by itself an IPA gold transcription.
- `BLOCKED_SPECIALIST_ADJUDICATION`: Ukrainian target-layer review remains a separate acceptance gate.

## Acceptance criterion

For every recognized unresolved context, both native API entry points must expose diagnostic-only IPA status, preserve the structured reason, and refuse to emit a Ukrainian orthographic target. For supported/resolved regression controls, the result must not be spuriously labelled diagnostic-only. The presence of an IPA string alone must never imply that the result is adjudicated.
