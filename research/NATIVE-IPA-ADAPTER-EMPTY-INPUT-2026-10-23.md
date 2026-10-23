# Native IPA adapter empty-input guard — 2026-10-23

## Defect and scope

The public native `map_ipa_to_ukrainian` adapter previously accepted an empty IPA string or a string containing only separators/whitespace. Tokenization produced an empty segment list, and the adapter returned a superficially valid `segmentwise-candidate-analysis` result. This is distinct from Korean orthographic-input validation: callers may invoke the IPA adapter directly.

## Change

- Reject non-string IPA inputs with a stable `TypeError` message.
- Tokenize using the existing strict IPA tokenizer, then reject an empty token list with `ValueError`. This also rejects boundary-only inputs such as `...` or ` . # `.
- Leave valid IPA tokenization, feature mapping, candidate generation, length/diacritic provenance, and word/syllable metadata unchanged.
- Add regressions for empty input, genuine tab/newline whitespace, boundary-only strings, non-string values, and a valid segment.

## Verification state

- Branch: `fix/native-ipa-adapter-empty-input-2026-10-23`.
- Code and tests are committed; exact-head CI has not yet been observed. Status is **PENDING_CI**, not DONE_VERIFIED.
- Local Python execution is unavailable in this GitHub API-only session; no local pass is claimed.
- The separate open PR #261 addresses empty/non-Hangul Korean input at public native Korean stages. This patch addresses the downstream IPA adapter's independent public boundary and does not replace or duplicate that Korean-input validator.

## Acceptance criteria

1. Empty, whitespace-only, and separator-only IPA inputs raise `ValueError`.
2. Non-string IPA inputs raise `TypeError`.
3. A valid supported IPA segment still produces exactly one segment analysis.
4. Full relevant CI passes on the final PR head.
5. This guard is not treated as evidence of independent IPA correctness, target-language validity, or scientific release readiness.
