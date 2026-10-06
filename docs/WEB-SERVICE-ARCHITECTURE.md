# Web service architecture

    Korean input
      ↓
    Unicode-safe scan
      ↓
    Hangul syllable decomposition
      ↓
    canonical Jamo source data
      ↓
    implemented contextual rules
      ↓
    Ukrainian practical target
      ↓
    Ukrainian output + analytical trace

## Source of truth

data/korean/canonical_correspondence.csv is the canonical editable correspondence source for the web adapter. The web engine reads it through Vite's raw import mechanism and does not maintain a second hand-edited mapping table.

## Security

User-controlled strings are rendered with textContent. The runtime does not evaluate input as HTML or JavaScript and does not perform runtime network requests.

## Known boundary

The browser engine is intentionally smaller than the full research implementation. It must not be described as a full Korean pronunciation engine until lexical, morphological and empirical pronunciation layers are added and validated.
