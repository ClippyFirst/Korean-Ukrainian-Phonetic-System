# Web service architecture

    Korean input
      ↓
    Unicode-safe scan
      ↓
    Hangul syllable decomposition
      ↓
    canonical Jamo source data
      ↓
    selected pronunciation profile
      ↓
    IPA (source-backed, heuristic, or typed grapheme fallback)
      ↓
    IPA → Ukrainian target adapter
      ↓
    Ukrainian output + analytical trace

## Source of truth

data/korean/canonical_correspondence.csv is the canonical editable correspondence source for the web adapter. The web engine reads it through Vite's raw import mechanism and does not maintain a second hand-edited mapping table.

## Security

User-controlled strings are rendered with textContent. The runtime does not evaluate input as HTML or JavaScript and does not perform runtime network requests.

## Known boundary

The browser engine exposes three research profiles: Strict (evidence-gated contextual phonology), Soft (the former broad heuristic/maximum-coverage path), and Super-soft (underlying grapheme decomposition to a low-confidence IPA candidate, without contextual phonological inference). The Super-soft profile guarantees a traceable candidate for modern Hangul syllable blocks through the IPA target adapter; this is a coverage contract, not a pronunciation-accuracy claim. The practical g2pK mode remains a separate public path. Independent phonetic adjudication is still required.
