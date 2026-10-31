# Web service architecture

    Korean input (Hangul / Hanja / mixed)
      ↓
    Unicode-safe scan + Hanja review
      ↓
    Hangul structural and morphological analysis
      ↓
    selected Korean surface-form engine
      ├─ pinned JS g2pK ordinary path
      └─ deterministic Kozak Kim research path
      ↓
    resolved surface Hangul
      ├─ surface phonetic IPA ─→ existing IPA→Ukrainian transliteration adapter
      └─ Revised Romanization ─→ existing RR→Ukrainian transliteration adapter
      ↓
    two Ukrainian transliteration outputs + separate traces

    Parallel analysis fields:
      ├─ surface phonetic IPA from selected G2P engine
      └─ orthography-derived phonemic IPA baseline (not a G2P engine)

## Source of truth

The IPA route uses the existing canonical correspondence and IPA target adapter. The separate RR route uses `data/korean/rr_ukrainian_correspondence.csv` plus `data/korean/rr_ukrainian_context_rules.csv`. Both remain independent, inspectable and project-owned target paths; do not merge them or create a duplicate third Ukrainian inventory.

## Security

User-controlled strings are rendered with textContent. The runtime does not evaluate input as HTML or JavaScript and does not perform runtime network requests.

## Known boundary

The browser engine is intentionally smaller than the full research implementation. It must not be described as a full Korean pronunciation engine until lexical, morphological and empirical pronunciation layers are added and validated.
