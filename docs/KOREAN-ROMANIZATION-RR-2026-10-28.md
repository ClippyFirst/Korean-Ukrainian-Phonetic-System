# Korean Revised Romanization audit view — initiated 2026-10-28, updated 2026-10-31

## Decision and architecture

The service exposes a separate NIKL-based Revised Romanization (RR) layer. The adapter receives both the original Hangul spelling and the resolved surface string: surface changes are used for pronunciation-sensitive RR rules, while source spelling is retained for explicit NIKL orthographic exceptions. The RR→Ukrainian route is independent from the IPA→Ukrainian route; RR never feeds IPA.

- IPA-first path: Hangul input → Korean surface pronunciation → IPA → Ukrainian target.
- Separate RR path: source Hangul + resolved surface → NIKL-based RR → RR→Ukrainian target adapter.
- The RR route is a parallel user-visible target path; it must never feed the IPA engine or be described as IPA-derived.
- No reverse romanization is implemented; Latin-to-Hangul conversion is ambiguous and requires a separate contract.

Official reference: National Institute of Korean Language, [Romanization of Korean](https://www.korean.go.kr/front_eng/roman/roman_01.do). The official system is based on standard Korean pronunciation. It is a Latin-script standard, not English phonetic spelling.

## Current implementation

- `src/app/romanization.js` maps modern precomposed Hangul syllables to RR onset/vowel/coda units and records word/sentence context.
- Adjacent liquid syllables receive the ㄹ/ㄹ → ll treatment; spaces, punctuation, digits and non-Hangul runs are preserved.
- Source spelling is retained for the explicit NIKL §3(1) examples 압구정, 낙동강, 죽변, 낙성대, 합정, 팔당, 샛별, 울산, 묵호 and 집현전. These are exact/prefix-scoped exceptions, not a general morphology parser.
- `src/app/romanization_target.js` carries the RR rule ID and source orthography into the Ukrainian trace.
- `src/main.js` passes both `r.surfaceHangul` and the original input to the RR adapter and to the visible RR field.
- `tests/romanization.test.mjs` covers official letter values, resolved-surface examples, all ten source-orthography examples, liquid handling, all 11,172 modern syllables and literal preservation.

## Evidence and limitations

The adapter is intentionally labelled **NIKL-based RR**, not a complete standards-certified romanizer. It now handles the explicit §3(1) source-orthography examples, but this is a conservative allowlist, not full NIKL conformance. The tests establish behavior of the implementation, not full conformance to every NIKL rule. The following acceptance work remains:

1. Extend the source-backed RR conformance matrix beyond the ten explicit §3(1) exceptions, including proper-name capitalization, administrative-unit hyphenation, consonant values in initial/intervocalic/final environments, assimilation, palatalization, liaison, and word-boundary cases.
2. Compare every matrix case with official NIKL examples and independently review failures before claiming complete RR conformance.
3. Add adversarial tests where the G2P surface form is uncertain; the RR card must not imply that an uncertain surface is confirmed.
4. Test the rendered card in a browser and run `npm run check:release`.
5. Only then consider reverse romanization, and only as a separate ambiguous-input feature with explicit candidate/status handling.

A match between RR and an IPA string is not itself proof of correctness. RR is orthographic Latin representation based on standard pronunciation, while IPA records phonetic/phonological detail. In particular, Romanization must not be described as “how to pronounce it in English”.

## Acceptance status

- Implemented: NIKL-based RR display using source spelling plus resolved surface, isolated from the IPA-first route; ten explicit §3(1) source-spelling examples are covered by tests.
- Historical isolated harness: 6/6 tests passed, including the 11,172 modern Hangul syllable sweep. Earlier GitHub Actions passed the baseline browser/Python/build checks, but they predate the source-orthography exception implementation. Latest code-bearing head `9c8ad0c7a51ba08edaa18ccf16542384e4d9e4d0` includes the source-aware RR code, exception trace, tests and live-smoke fixture. Subsequent branch commits only reconcile documentation. No exact-head CI run is available for the code-bearing head, so the new behavior remains PARTIAL pending verification. Do not count earlier runs as verification of this follow-up.
- Full NIKL RR conformance: not yet established.
- Reverse romanization: not implemented.
- Release status: this change should remain a reviewable PR until automated checks and the conformance matrix are completed.

## Source-orthography exceptions — NIKL §3(1)

The official NIKL RR page explicitly says that compound tense sounds are not transcribed in the listed examples and that aspiration is not transcribed in the listed nouns. The adapter now uses the original Hangul spelling for these ten exact/prefix-scoped examples while continuing to use the resolved surface form for the ordinary pronunciation-sensitive cases. The test surface forms below are synthetic stimuli, not IPA or pronunciation gold.

| NIKL source spelling | RR output (lowercase internal form) | Rule ID |
|---|---|---|
| 압구정 | apgujeong | NIKL-RR-3-1-COMPOUND-TENSE-NOT-TRANSCRIBED |
| 낙동강 | nakdonggang | NIKL-RR-3-1-COMPOUND-TENSE-NOT-TRANSCRIBED |
| 죽변 | jukbyeon | NIKL-RR-3-1-COMPOUND-TENSE-NOT-TRANSCRIBED |
| 낙성대 | nakseongdae | NIKL-RR-3-1-COMPOUND-TENSE-NOT-TRANSCRIBED |
| 합정 | hapjeong | NIKL-RR-3-1-COMPOUND-TENSE-NOT-TRANSCRIBED |
| 팔당 | paldang | NIKL-RR-3-1-COMPOUND-TENSE-NOT-TRANSCRIBED |
| 샛별 | saetbyeol | NIKL-RR-3-1-COMPOUND-TENSE-NOT-TRANSCRIBED |
| 울산 | ulsan | NIKL-RR-3-1-COMPOUND-TENSE-NOT-TRANSCRIBED |
| 묵호 | mukho | NIKL-RR-3-1-NOUN-H-NOT-ASPIRATED |
| 집현전 | jiphyeonjeon | NIKL-RR-3-1-NOUN-H-NOT-ASPIRATED |

This is a conservative allowlist of the official examples, not a productive morpheme parser. Proper-name capitalization, administrative-unit hyphenation, and unlisted exceptions remain outside the implemented subset.

## Official-example regression matrix (NIKL)

The browser unit tests include NIKL examples where RR follows resolved surface changes, plus separate source-orthography exceptions where the official Latin output intentionally does not mirror a surface fortis/aspirated onset:

| Original example | NIKL surface pronunciation | Expected RR | Test status |
|---|---|---|---|
| 백마 | 뱅마 | baengma | Added |
| 신문로 | 신문노 | sinmunno | Added |
| 종로 | 종노 | jongno | Added |
| 왕십리 | 왕심니 | wangsimni | Added |
| 별내 | 별래 | byeollae | Added |
| 신라 | 실라 | silla | Added |
| 같이 | 가치 | gachi | Added |
| 굳히다 | 구치다 | guchida | Added |

Source: [NIKL — Romanization of Korean](https://www.korean.go.kr/front_eng/roman/roman_01.do), especially §3(1). Surface-form cases validate the RR rendering given the supplied surface; source-exception cases validate the orthographic exception only. Neither validates the G2P engine's choice of surface form or full RR conformance.

A further test iterates over all 11,172 modern precomposed Hangul syllable code points to detect empty or undefined mappings. This is structural coverage, not evidence that every output is linguistically correct.

The UI also fails closed when the pronunciation path does not provide a surface form: it displays an em dash instead of silently romanizing the original input spelling and implying a pronunciation result.
