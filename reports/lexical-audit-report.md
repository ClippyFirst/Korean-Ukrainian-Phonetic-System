# Lexical dictionary structural audit

Generated: `2026-10-15T09:12:07.440568+00:00`

## Summary counts

| Metric | Value |
|---|---|
| Main rows | 642 |
| Additions rows | 34 |
| Unique effective inputs (additions win) | 670 |
| Overlaps (shadowed by additions) | 6 |
| Schema issues | 0 |
| Segment mismatches | 0 |
| IPA anomalies | 0 |
| Priority forms found / missing | 67 / 0 |
| Structural pass | **True** |

Merge rule: Runtime merge (src/main.js): additions appended after main; later rows with the same input key override earlier ones.

## Status / confidence distribution

- target_status: `{'model-selected': 21, 'provisional': 648, 'surface-only': 7}`
- confidence: `{'high': 676}`
- input_kind: `{'(empty)': 647, 'mixed-script': 29}`

## Normative review (heuristic, not full verification)

Presence of source_url is NOT proof of correct pronunciation. Generic 표준 발음법 page citations need independent confirmation of the specific form. Counts above are heuristics only.

- Any source_url: 676
- Generic rule page only: 568
- More specific citation (heuristic): 108

## Overlaps

- `강줄기` identical=True main_ipa=`kaŋ|tɕ͈ul|ɡi` add_ipa=`kaŋ|tɕ͈ul|ɡi` → runtime uses **additions**
- `도리깻열` identical=True main_ipa=`to|ɾi|ɡɛn|ɲʌl` add_ipa=`to|ɾi|ɡɛn|ɲʌl` → runtime uses **additions**
- `발음과` identical=True main_ipa=`pa|rɯm|ɡwa` add_ipa=`pa|rɯm|ɡwa` → runtime uses **additions**
- `베갯잇` identical=True main_ipa=`pe|ɡɛn|nit̚` add_ipa=`pe|ɡɛn|nit̚` → runtime uses **additions**
- `연구원은` identical=True main_ipa=`jʌn|ɡu|wʌ|nɯn` add_ipa=`jʌn|ɡu|wʌ|nɯn` → runtime uses **additions**
- `예쁘고` identical=True main_ipa=`je|p͈ɯ|ɡo` add_ipa=`je|p͈ɯ|ɡo` → runtime uses **additions**

## IPA anomalies

None.

## Priority missing

None — all listed priority forms are present.

## Notes

- (none)
