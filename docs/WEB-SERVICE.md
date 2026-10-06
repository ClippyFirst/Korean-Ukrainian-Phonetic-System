# Korean → Ukrainian web service

## Two-page product

The public interface intentionally has two pages:

- Service (index.html) — practical conversion.
- System (system.html) — the author's research and design decisions.

The second page explains the linguistic reasoning behind the Ukrainian output.

## Relationship to the research repository

The browser service is a presentation/runtime layer over the research model. The canonical linguistic source remains data/korean/canonical_correspondence.csv.

The service does not replace the research corpus, comparative evidence or Python research implementation.

## Runtime boundary

The browser implements Unicode-safe modern Hangul decomposition; canonical onset/nucleus/coda mapping; ㅅ/ㅆ → ш before relevant i/j-like vowels; simple liaison; complex-coda liaison with explicit decomposition; selected contextual voicing; practical tensification neutralization; explicit unresolved handling for context-dependent ㅢ; and preservation of non-Hangul text.

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

The web service is a practical research interface, not an official Ukrainian standard. Source facts, model decisions, conditional rules and unresolved cases remain distinct.
