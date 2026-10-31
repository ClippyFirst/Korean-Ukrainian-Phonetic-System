# Korean → Ukrainian web service

## Two-page product

The public interface intentionally has two pages:

- Service (index.html) — Korean input with two simultaneous Ukrainian transliteration results: one via surface IPA and the existing IPA→Ukrainian adapter, one via Revised Romanization and the existing RR→Ukrainian adapter; both traces remain available.
- System (system.html) — the author's research and design decisions.

The second page explains the linguistic reasoning behind the Ukrainian output.

## Relationship to the research repository

The browser service is a presentation/runtime layer over the existing research model. The IPA route uses the existing canonical correspondence and IPA target adapter; the separate RR route uses `data/korean/rr_ukrainian_correspondence.csv` and `data/korean/rr_ukrainian_context_rules.csv`. Neither route replaces the author's existing Ukrainian target decisions.

The service does not replace the research corpus, comparative evidence or Python research implementation.

## Runtime boundary

The browser exposes the pinned JS g2pK ordinary pronunciation path and the project-owned deterministic Kozak Kim research path. Their IPA-mediated Ukrainian output uses the existing IPA-first adapter. A separate RR adapter maps the resolved Hangul surface form through Revised Romanization into the existing Ukrainian correspondence/context tables. Both Ukrainian routes are displayed together with separate traces. The browser also exposes surface phonetic IPA, an orthography-derived phonemic baseline, Hangul→Hanja annotation and a separate Hanja→Hangul reading workbench.

It does not claim to be a complete lexical, morphological or acoustic Korean pronunciation engine. Morphology-sensitive rules R010–R015 remain research-layer rules unless the required lexical context is supplied.

## Design

The Chinese-for-Ukrainians project is the structural reference: typography-led hierarchy, restrained density, immediate utility, parallel information and no marketing decoration.

The Korean identity uses South Korean national colours: Taegeuk red #CD2E3A and Taegeuk blue #0047A0. Red and blue are functional accents rather than decorative flag imagery.

## Local processing

Normal conversion is performed in the browser. There is no application server, account, runtime database or analytics layer.

## Reproducibility

    npm install
    npm test
    npm run build

## Scientific status

The web service is a research-backed Ukrainian transliteration interface, not an official Ukrainian standard or a translation service. “Ukrainian transliteration” is the project-chosen name for its practical Ukrainian-letter rendering guided by Korean pronunciation and research rules; it is not literal Hangul character substitution. Source facts, model decisions, conditional rules and unresolved cases remain distinct.
