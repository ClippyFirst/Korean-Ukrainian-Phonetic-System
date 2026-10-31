# Web service user guide

Browser service for Korean → Ukrainian transliteration. The service displays two independent Ukrainian results for the same input: one derived through surface phonetic IPA and the existing IPA→Ukrainian adapter, and one derived through Revised Romanization (RR) and the existing RR→Ukrainian adapter. Both results are provisional project outputs unless their individual status says otherwise; neither route is a translation.

The analytical fields are separate: surface phonetic IPA comes from the selected pronunciation engine, while the phonemic IPA field is an orthography-derived baseline and does not resolve morphology or prosody. The ordinary browser route uses the pinned JS g2pK port; detailed research mode uses the deterministic Kozak Kim engine.

Hanja is available in both directions. Hangul→Hanja is dictionary-backed lexical annotation; Hanja→Hangul is a separate reading workbench. Unknown spans are retained, multiple readings are surfaced, and ambiguous readings must be reviewed rather than guessed.

### М’яка морфологія

Прапорець **«М’яка морфологія (heuristic, низька впевненість)»** за замовчуванням
вимкнений. Увімкнення дозволяє рушію запропонувати читання для частих формальних
закінчень (частинки 이/을/에, сполучники 어/고, минулий час 았/었 тощо), коли
немає точного словникового запису.

Такі читання позначаються як `heuristic-low-confidence` і **не є** офіційною
сертифікацією NIKL. Для нормативної роботи залишайте прапорець вимкненим.
Деталі: `docs/SOFT-HEURISTIC-MORPHOLOGY-LAYER-2026-10-11.md`.
