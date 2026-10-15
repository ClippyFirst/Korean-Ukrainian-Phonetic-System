# IPA voiced-velar normalization (2026-10-15)

Six rows in `data/korean/lexical_pronunciations.csv` used ASCII `g` where the
canonical IPA symbol is `ɡ` (U+0261). The same keys already exist in
`lexical_additions_2026-10-15.csv` with `ɡ`. Runtime merge prefers additions,
so behaviour was already correct, but the shadowed main rows were inconsistent.

Replacements applied:

| input | old IPA | new IPA |
|-------|---------|---------|
| 예쁘고 | je\|p͈ɯ\|go | je\|p͈ɯ\|ɡo |
| 연구원은 | jʌn\|gu\|wʌ\|nɯn | jʌn\|ɡu\|wʌ\|nɯn |
| 발음과 | pa\|rɯm\|gwa | pa\|rɯm\|ɡwa |
| 강줄기 | kaŋ\|tɕ͈ul\|gi | kaŋ\|tɕ͈ul\|ɡi |
| 베갯잇 | pe\|gɛn\|nit̚ | pe\|ɡɛn\|nit̚ |
| 도리깻열 | to\|ɾi\|gɛn\|ɲʌl | to\|ɾi\|ɡɛn\|ɲʌl |

After this change the six overlap pairs are content-identical.
`scripts/audit_lexical_dictionary.py` flags remaining ASCII-g anomalies.
