# Phrase-boundary and lexical-context implementation roadmap

**Audit date:** 2026-10-10  
**Status:** implementation contract; not a claim that the current runtime already satisfies every item  
**Normative source:** National Institute of Korean Language (국립국어원), *표준 발음법*  
https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002

## Purpose

The next phase should close the gap between isolated-eojeol processing and context-sensitive standard pronunciation without turning the browser into an undocumented guesser. The runtime already applies several connected-speech rules across plain whitespace and blocks cross-boundary rules at punctuation; that behaviour needs an explicit, testable contract and more discriminating examples.

This project has three distinct output claims:

1. Korean surface pronunciation: supported by *표준 발음법*, an NIKL dictionary entry/Q&A, or an explicitly labelled unresolved analysis.
2. Broad IPA: an analytical representation of that surface pronunciation, not narrow acoustic transcription.
3. Ukrainian practical spelling: the project's selected approximation, not an official Ukrainian standard.

## Required input-boundary modes

### Mode A — isolated text / conservative default

- Preserve all non-Hangul text and the input's word spacing.
- Apply only rules whose conditions can be established from the text and the documented engine model.
- Apply exact lexical overrides only to exact matching eojeol; do not generalize a verb-stem exception to other words with the same spelling.
- If a rule requires unknown lexical identity, word class, morpheme boundary, or compound structure, return an explicit unresolved status rather than inventing a parse.

### Mode B — connected phrase

- Permit only those cross-eojeol phonological processes whose rule conditions are established by the official rules and the engine's documented boundary policy.
- Plain whitespace may represent a connected-speech boundary; punctuation is a hard boundary unless a separately documented mode says otherwise.
- Do not treat all adjacent words as one morphological word. Cross-word phonology and morphological rule licensing are separate questions.
- Show in the trace whether a rule applied within an eojeol or across a space.

### Mode C — lexical / morphology-assisted

- Accept explicit full-form and word-pair licenses from curated, provenance-carrying data.
- Keep source evidence, surface form, IPA, Ukrainian target, target confidence, and alternate standard readings as separate fields.
- Do not add a generic Boolean switch that licenses every instance of a rule such as §29 ㄴ insertion.
- A missing lexical license must not be silently interpreted as proof that a pronunciation is impossible; it means the engine cannot resolve it automatically.

## High-risk audit matrix

| Area | Required probe | Expected engineering invariant |
|---|---|---|
| Boundary policy | Same phrase with a space, comma, and full stop | Space and punctuation must not produce identical rule behaviour by accident; punctuation blocks cross-boundary rules under the current policy. |
| Nasal assimilation | Plain-space connected-speech examples where the preceding coda and following onset license assimilation | The trace identifies a cross-word rule; no change is attributed to a lexical override unless the exact entry matched. |
| Liquid assimilation | Cross-boundary ㄴ/ㄹ sequences, tested both with and without punctuation | Apply only the licensed environment; preserve uncertainty if the sequence is outside the engine's implemented conditions. |
| ㄴ insertion (§29) | Licensed compound/phrase pairs versus the same spelling without a license | Exact pair/form evidence is required; a global flag alone is insufficient. |
| Simple-coda liaison (§13) | A clear formal-morpheme case versus a spelling-only ambiguous boundary | Automatic liaison only for the established case; ambiguous case is marked unresolved. |
| Complex-coda liaison (§14) | 넋이, 값이, 앉아, 닭을, 젊어, 잃어 | Resolve the moving coda component correctly only when the relevant lexical/morphemic analysis is licensed; add a regression for each case and do not apply one generic split to every cluster. |
| §15 representative coda before a substantive morpheme | Forms where a substantive morpheme starts with ㅏ/ㅓ/ㅗ/ㅜ/ㅟ | Neutralization must precede resyllabification where §15 applies; a merely vowel-initial ending must not be treated as equivalent. |
| ㅎ and ㄶ/ㅀ | Known lexical cases and deliberately unlisted ambiguous forms | Keep the special ㅎ deletion/aspiration paths distinct; unknown morphology-dependent cases remain unresolved. |
| ㅢ (§5) | Initial 의, non-initial 의, consonant-onset ㅢ, possessive particle 의, and lexicalized alternatives | Distinguish normative/default readings from permitted variants; do not collapse lexical variation into one global vowel mapping. |
| Ukrainian target | Aspirated consonants and surface-voiced lenis stops | Preserve Korean contrasts in IPA; the primary practical Ukrainian mode neutralizes aspiration as specified by the project and must not import кх/тх/пх/чх as default. |

## Acceptance criteria for implementation

1. Each probe has an expected surface Hangul form, broad IPA, Ukrainian output or explicit unresolved status, and expected trace/rule IDs.
2. Every lexical row has a source URL, unique input key, valid status, and consistent syllable alignment between surface form, IPA, and target.
3. A test checks that punctuation blocks cross-boundary rules; a companion test checks the same lexical material with plain whitespace.
4. Exact lexical entries take precedence only where documented, and tests prove that similar but unlisted forms are not overgeneralized.
5. Rule IDs, provenance, engine behaviour, user-facing trace, and tests stay synchronized.
6. Browser and Python research layers agree on shared lexical facts, or the documented boundary between them explains the difference.
7. Build and regression tests run before a pull request is marked release-ready. A passing finite corpus is evidence of tested coverage, not proof of complete Korean pronunciation coverage.

## Work order

1. Add a focused boundary test matrix before changing runtime behaviour.
2. Audit the engine's current segmentation and rule ordering against that matrix.
3. Add or correct rule implementations only where the official rule and the available evidence determine the outcome.
4. Extend the shared lexical data for exact, sourced exceptions; avoid duplicating the same exception in browser-only code.
5. Add targeted variants for §5 ㅢ and other normative alternatives with the distinction between source confidence and Ukrainian-target confidence visible in the UI.
6. Run the browser suite, Python suite, data-integrity checks, and static build; document any remaining unresolved cases explicitly.

## Non-goals

- No claim to implement all Korean morphology or all lexical pronunciations.
- No automatic conversion from Revised Romanization as a substitute for Korean phonology.
- No use of Russian or another Slavic transcription tradition as the authority for Ukrainian output.
- No default aspiration digraphs in the practical Ukrainian mode.
- No claim that the project's Ukrainian output is an official national standard.
