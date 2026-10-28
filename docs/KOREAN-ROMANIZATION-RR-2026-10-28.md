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
- Test files added: yes. An isolated Node.js smoke run of the adapter logic passed 5/5 cases; this was not the repository's actual test suite. Full `npm test`, `npm run build`, and browser checks remain pending.
- Full NIKL RR conformance: not yet established.
- Reverse romanization: not implemented.
- Release status: this change should remain a reviewable PR until automated checks and the conformance matrix are completed.
