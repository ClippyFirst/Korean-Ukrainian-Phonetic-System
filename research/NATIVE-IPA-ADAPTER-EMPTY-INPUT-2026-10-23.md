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
- Code/test head before this evidence update: `04c767ca56f5add8b5d7829eb6051a863cc9d63f`. CI passed: Python/web tests [run 40007019581](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007019581), system verification [run 40007019470](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007019470), generated corpus artifacts [run 40007019405](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007019405), and optional g2pK integration [run 40007019497](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007019497). The Python/web workflow passed Python 3.12 and 3.13; Python 3.11 also passed in the final workflow run. The current documentation-only evidence update still needs its own exact-head CI confirmation.
- Local Python execution is unavailable in this GitHub API-only session; no local pass is claimed.
- The separate open PR #261 addresses empty/non-Hangul Korean input at public native Korean stages. This patch addresses the downstream IPA adapter's independent public boundary and does not replace or duplicate that Korean-input validator.

## Acceptance criteria

1. Empty, whitespace-only, and separator-only IPA inputs raise `ValueError`.
2. Non-string IPA inputs raise `TypeError`.
3. A valid supported IPA segment still produces exactly one segment analysis.
4. Full relevant CI passes on the final PR head.
5. This guard is not treated as evidence of independent IPA correctness, target-language validity, or scientific release readiness.
