# Web service architecture

    Main Korean input (Hangul)
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

    Optional Hanja workbench (separate from the main input):
      Hanja / mixed-script text
        ↓ local reverse dictionary lookup
      unique Hangul readings + explicit ambiguous/unmapped spans
        ↓ user review and manual correction
      confirmed Hangul can be transferred into the main input

    Parallel analysis fields:
      ├─ surface phonetic IPA from selected G2P engine
      └─ orthography-derived phonemic IPA baseline (not a G2P engine)

## Source of truth

The IPA route uses the existing canonical correspondence and IPA target adapter. The separate RR route uses `data/korean/rr_ukrainian_correspondence.csv` plus `data/korean/rr_ukrainian_context_rules.csv`. Both remain independent, inspectable and project-owned target paths; do not merge them or create a duplicate third Ukrainian inventory.

## Security

User-controlled strings are rendered with textContent. The runtime does not evaluate input as HTML or JavaScript and does not call third-party services. Pinned Hanja dictionary chunks are static same-origin assets loaded on demand.

## Known boundary

The browser engine is intentionally smaller than the full research implementation. It must not be described as a full Korean pronunciation engine until lexical, morphological and empirical pronunciation layers are added and validated.
