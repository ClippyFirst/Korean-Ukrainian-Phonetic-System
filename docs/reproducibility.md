# Reproducibility

GitHub is the source of truth for code and machine-readable Korean data.

## Deterministic artifacts

- Modern Hangul generator: exactly 11,172 rows.
- Jamo inventory: 19 L + 21 V + 27 T = 67 actual Jamo records.
- Generated syllable artifact begins at 가 and ends at 힣.
- Rule IDs and rule order are explicit.
- Feature weights are versioned heuristic parameters.

## Verification

The project has pytest coverage for Hangul, generated artifacts, schemas, evidence, phonotactics, rule behavior, IPA, the external Ukrainian adapter and end-to-end layer separation.

GitHub Actions is configured to execute the suite on pushes and pull requests.

If the connected GitHub Actions API does not expose a run, the audit must state that rather than claiming CI passed.
