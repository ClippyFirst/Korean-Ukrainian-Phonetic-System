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


## Final-readiness invariants

- `RULE_META` IDs, `rules.csv`, `rule_ordering.csv` and `rule_scope.csv` must agree exactly for R001–R015.
- `rule_scope.csv` must contain every Standard Pronunciation section 9–30 exactly once.
- Conditional morphology-sensitive rules must be disabled unless their explicit license token is supplied.
- The committed 11,172-row syllable artifact must equal the deterministic generator byte-for-byte at the parsed-row level.
- UPI target compatibility is pinned to 0.8.0; incompatible target data must fail explicitly.
- A fresh CI result for the exact final commit is required before a release/completion claim.
