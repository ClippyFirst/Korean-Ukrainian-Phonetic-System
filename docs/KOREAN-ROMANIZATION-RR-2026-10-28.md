# Korean Revised Romanization audit view — 2026-10-28

## Decision and architecture

The service exposes Revised Romanization (RR) as a parallel inspection aid. Korean phonology is resolved by the selected Korean pronunciation path first. RR is then rendered from the resulting Hangul surface string, while IPA and the Ukrainian target continue through the existing production path.

- Production path: Hangul input → Korean surface pronunciation → IPA → Ukrainian target.
- Diagnostic branch: resolved Hangul surface → basic RR rendering.
- Forbidden dependency: RR output must never be used to generate IPA or Ukrainian output.
- No reverse romanization is implemented; Latin-to-Hangul conversion is ambiguous and requires a separate contract.

Official reference: National Institute of Korean Language, [Romanization of Korean](https://www.korean.go.kr/front_eng/roman/roman_01.do). The official system is based on standard Korean pronunciation. It is a Latin-script standard, not English phonetic spelling.

## Current implementation

- `src/app/romanization.js` maps precomposed Hangul syllable blocks to basic RR onset, vowel and coda values.
- Adjacent liquid syllables receive the basic ㄹ/ㄹ → ll treatment.
- Spaces, punctuation, digits and non-Hangul runs are preserved.
- `index.html` exposes the result as a distinct RR card and explicitly states that IPA remains the basis for Ukrainian output.
- `src/main.js` feeds the adapter the pronunciation path's resolved `surfaceHangul` when available, not the RR string into any phonetic component.
- `tests/romanization.test.mjs` covers representative vowel values, resolved surface forms, liquid handling and literal preservation.

## Evidence and limitations

The current adapter is intentionally labelled a **basic RR rendering**, not a complete standards-certified romanizer. The tests establish behavior of the implementation, not full conformance to every NIKL rule. The following acceptance work remains:

1. Build a source-backed RR conformance matrix from the current NIKL rules, including consonant values in initial/intervocalic/final environments, assimilation, palatalization, liaison, and word-boundary cases.
2. Compare every matrix case with official NIKL examples and independently review failures before claiming complete RR conformance.
3. Add adversarial tests where the G2P surface form is uncertain; the RR card must not imply that an uncertain surface is confirmed.
4. Test the rendered card in a browser and run `npm run check:release`.
5. Only then consider reverse romanization, and only as a separate ambiguous-input feature with explicit candidate/status handling.

A match between RR and an IPA string is not itself proof of correctness. RR is orthographic Latin representation based on standard pronunciation, while IPA records phonetic/phonological detail. In particular, Romanization must not be described as “how to pronounce it in English”.

## Acceptance status

- Implemented: basic RR display from the resolved Hangul surface, isolated from the IPA-to-Ukrainian pipeline.
- Test files added: yes. An isolated Node.js run of the adapter logic passed 6/6 tests, including the 11,172 modern Hangul syllable sweep; the code was run from a temporary isolated harness, not the full repository checkout. Full `npm test`, `npm run build`, and browser checks remain pending.
- Full NIKL RR conformance: not yet established.
- Reverse romanization: not implemented.
- Release status: this change should remain a reviewable PR until automated checks and the conformance matrix are completed.

## Official-example regression matrix (NIKL)

The browser unit tests now include the official examples from the NIKL Romanization rules, after the pronunciation engine has supplied the standard surface Hangul:

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

Source: [NIKL — Romanization of Korean, pronunciation changes](https://www.korean.go.kr/front/page/pageView.do?mn_id=97&page_id=P000150). This matrix validates the RR rendering *given the supplied surface form*; it does not validate the G2P engine's choice of surface form.

A further test iterates over all 11,172 modern precomposed Hangul syllable code points to detect empty or undefined mappings. This is structural coverage, not evidence that every output is linguistically correct.

The UI also fails closed when the pronunciation path does not provide a surface form: it displays an em dash instead of silently romanizing the original input spelling and implying a pronunciation result.
