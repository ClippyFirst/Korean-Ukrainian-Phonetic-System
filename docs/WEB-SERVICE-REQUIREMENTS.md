# Korean → Ukrainian Web Service — Requirements

## Product
A static browser service for Korean → Ukrainian transliteration, built on this repository's existing research model and author-developed Ukrainian target system. The interface serves both general users and researchers: concise output first, complete provenance and trace details on demand. It has exactly two public pages:
1. **Service** — conversion tool.
2. **System** — explanation of the author's Ukrainian system.

The Chinese-for-Ukrainians project is the structural reference: functional linguistic instrument, typography-led hierarchy, immediate browser conversion, copyable results, responsive layout and explicit non-translation boundary. It is not a visual copy.

## Scientific boundary
The public Ukrainian result is called **Ukrainian transliteration** by project decision: a practical Ukrainian-letter rendering guided by Korean pronunciation analysis and the project's own research rules. It is not literal character-by-character Hangul substitution, translation, or IPA itself, and it is not claimed to be an official Ukrainian national standard. Do not label the public Ukrainian output as transcription.

Primary route:
`Korean orthography → Korean structure/morphology/phonology → resolved surface Hangul → surface phonetic IPA → existing author-developed IPA→Ukrainian transliteration adapter → Ukrainian output`

Parallel comparison route:
`resolved surface Hangul → Revised Romanization (RR) → existing author-developed RR→Ukrainian transliteration adapter → Ukrainian output`

Both Ukrainian route outputs are displayed simultaneously. The user may choose which route is visually primary, but choosing a primary route must not hide the other result or its trace. Phonetic IPA and the orthography-derived phonemic baseline are separate analytical fields; the latter is not a G2P engine.

A simple Jamo replacement must never be presented as a complete Korean pronunciation engine.

## Service page
- Multiline Korean Unicode input.
- Preserve spaces, punctuation, Latin text, numbers and emoji.
- Character counter, Example and Clear actions.
- Local-processing indicator.
- Two simultaneous Ukrainian transliteration results: **через IPA** and **через RR**, each with explicit provenance/status.
- Surface phonetic IPA from the selected G2P engine and a separately labelled orthography-derived phonemic baseline.
- Revised Romanization of the resolved surface form.
- Hangul→Hanja lexical annotation and a separate Hanja→Hangul reading workbench; unknown spans are preserved and ambiguous readings require user resolution.
- Korean structure, analysis and route-specific trace information where defensible.
- Copy buttons for results.
- Trace/status indicating canonical, contextual or unresolved handling.
- Representative examples: `현대`, `국밥`, `넋이`, `닭을`, `한여름`, `시`.
- Conditional/hypothesis examples must not be presented as universal rules.

## System page
Explain:
1. what the system is;
2. why a Ukrainian-specific system is needed;
3. the project's practical Ukrainian transliteration convention and its distinction from literal grapheme transliteration and IPA transcription;
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

The existing IPA correspondence source and generated IPA target adapter remain the canonical source for the IPA-mediated route. The existing RR correspondence and context-rule CSVs remain the canonical sources for the RR-mediated route. Improve these existing systems in place; do not replace them with a third-party Ukrainian scheme or introduce a parallel duplicate target inventory.

Runtime stages:
1. Unicode-safe scan.
2. Hangul decomposition.
3. canonical Jamo mapping.
4. explicit contextual target rules.
5. IPA-mediated Ukrainian transliteration assembly.
6. parallel RR-mediated Ukrainian transliteration assembly.
7. trace/status for both routes and both IPA levels.

Unknown/non-Hangul text is preserved.

## QA / release gate
Tests cover decomposition, CV/CVC mapping, coda, ㅅ/ㅆ before i/j, ㄹ, ㅇ, complex codas, preservation and determinism. Browser QA covers empty state, example, conversion, copy, mobile overflow, keyboard use and second-page navigation.

Release requires successful build/tests, working two-page navigation, no known runtime errors in the supported flow, traceability to the research model, and explicit documentation of runtime limitations.
