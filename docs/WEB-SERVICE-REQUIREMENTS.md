# Korean → Ukrainian Web Service — Requirements

## Product
A static browser service for practical Korean → Ukrainian transmission, built on this repository's research model. It has exactly two public pages:
1. **Service** — conversion tool.
2. **System** — explanation of the author's Ukrainian system.

The Chinese-for-Ukrainians project is the structural reference: functional linguistic instrument, typography-led hierarchy, immediate browser conversion, copyable results, responsive layout and explicit non-translation boundary. It is not a visual copy.

## Scientific boundary
The service is a practical transcription / phonetic-graphemic transmission tool, not translation and not an official Ukrainian national standard.

Runtime concept:
`Korean orthography → Korean structure/phonology → contextual processing where implemented → surface representation → Ukrainian practical target → Ukrainian output`

A simple Jamo replacement must never be presented as a complete Korean pronunciation engine.

## Service page
- Multiline Korean Unicode input.
- Preserve spaces, punctuation, Latin text, numbers and emoji.
- Character counter, Example and Clear actions.
- Local-processing indicator.
- Primary **Український запис** result.
- Analytical **IPA / Korean structure** information where defensible.
- Copy buttons for results.
- Trace/status indicating canonical, contextual or unresolved handling.
- Representative examples: `현대`, `국밥`, `넋이`, `닭을`, `한여름`, `시`.
- Conditional/hypothesis examples must not be presented as universal rules.

## System page
Explain:
1. what the system is;
2. why a Ukrainian-specific system is needed;
3. transcription vs transliteration;
4. six-layer model;
5. Ukrainian target principle;
6. consonant decisions;
7. vowel decisions;
8. contextual rules;
9. aspiration and fortisness;
10. Russian and other Slavic comparators;
11. evidence/provenance classes;
12. limitations;
13. reproducibility;
14. references.

Source facts, project decisions, hypotheses and unresolved questions must remain distinct.

## Visual language
- Functional reference-tool aesthetic.
- No AI clichés, gradients, glassmorphism or decorative illustration.
- White/black base with South Korean national colours: Taegeuk red `#CD2E3A` and blue `#0047A0`.
- Red = primary action/practical target; blue = analytical/navigation state.
- Small Taegeuk-inspired red/blue mark.
- Strong Korean/Cyrillic typography fallbacks.
- Desktop/tablet/mobile.
- Visible keyboard focus, semantic landmarks, reduced motion, sufficient contrast.

## Architecture
Static Vite + plain HTML/CSS/JavaScript. No server, account, database, analytics or runtime network request.

Canonical source of truth remains `data/korean/canonical_correspondence.csv`. Runtime reads it through Vite raw import and applies only explicitly implemented rules.

Runtime stages:
1. Unicode-safe scan.
2. Hangul decomposition.
3. canonical Jamo mapping.
4. explicit contextual target rules.
5. Ukrainian output assembly.
6. broad analytical representation where defensible.
7. trace/status.

Unknown/non-Hangul text is preserved.

## QA / release gate
Tests cover decomposition, CV/CVC mapping, coda, ㅅ/ㅆ before i/j, ㄹ, ㅇ, complex codas, preservation and determinism. Browser QA covers empty state, example, conversion, copy, mobile overflow, keyboard use and second-page navigation.

Release requires successful build/tests, working two-page navigation, no known runtime errors in the supported flow, traceability to the research model, and explicit documentation of runtime limitations.
