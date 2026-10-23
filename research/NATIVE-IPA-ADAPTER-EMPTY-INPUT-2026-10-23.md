# Native IPA adapter empty-input guard — 2026-10-23

## Defect and scope

The public native `map_ipa_to_ukrainian` adapter can be called independently of Korean orthographic entry points. Empty IPA, whitespace-only IPA, and separator-only IPA tokenized to zero segments and could return a superficially successful `segmentwise-candidate-analysis` result. Korean-input validation does not close this downstream public boundary.

## Change

- Validate IPA type before loading the optional target inventory; non-string input raises a stable `TypeError`.
- Run the strict tokenizer, then reject an empty token list with `ValueError`. This covers empty strings, actual tab/newline whitespace, and boundary-only strings such as `...` and ` . # `.
- Add regressions for invalid and valid input.
- Preserve all existing feature vectors, IPA metadata, candidate generation, and boundary handling.

## Reconciliation with open work

Open PR #263 had already implemented this independent adapter guard on a branch one commit behind main and was no longer mergeable after the fortis-feature PR changed overlapping documentation. Its code/test change was inspected and ported to the current mainline in PR #264; the port also validates the type before loading the target adapter. PR #263 is to remain untouched until this port is merged, then can be closed as superseded with a link to the merged replacement. No branch was deleted.

## Verification

Implementation/test head: `4c7bda56c6feda4b82b1ffa9c9028c7fb02d8ce3`.
- Python 3.11–3.13 and web tests/build: PASS [run 40007944889](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007944889).
- System verification, browser build and Python regression/data integrity: PASS [run 40007944954](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007944954).
- Generated corpus artifacts: PASS [run 40007945023](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007945023).
- Optional g2pK integration on Python 3.11/3.12: PASS [run 40007945019](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007945019).
- Live NIKL inventory was skipped, not passed. Local tests were not run in this GitHub API-only session.

## Acceptance status

- `DONE_VERIFIED` at the implementation/test head: direct IPA adapter input must be a string and must contain at least one supported segment.
- PR #264 merged as `5bb9178243604d169c2209671a953f8683b48408` after final-head CI passed: tests/Python 3.11–3.13/web [40008141619](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40008141619), system verification [40008141681](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40008141681), corpus artifacts [40008141709](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40008141709), and optional g2pK [40008141856](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40008141856).
- This is an API-contract correction only. It does not establish independent IPA gold, Ukrainian target correctness, exhaustive Korean pronunciation-rule coverage, item-level licensing, or release readiness.
