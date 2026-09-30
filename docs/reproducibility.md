# Reproducibility

The generated Hangul artifact is produced by scripts/generate_syllables.py from the deterministic Unicode composition algorithm in src/korean_ukrainian/hangul.py.

The invariant is 19 × 21 × 28 = 11,172 unique precomposed syllable blocks, spanning U+AC00 (가) through U+D7A3 (힣).

CI installs the package and runs pytest on pushes and pull requests. A separate validator checks row count, endpoints and uniqueness.

The current execution environment could not clone the private repository over the public network, so this session did not independently execute pytest against a checkout. The GitHub workflow was committed, but no workflow run was exposed by the connector at audit time.
