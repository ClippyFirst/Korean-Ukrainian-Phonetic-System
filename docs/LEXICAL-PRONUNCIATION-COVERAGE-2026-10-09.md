# Lexical pronunciation coverage and audit — 2026-10-09

## Purpose

This note documents the second pass over high-risk Korean surface-pronunciation cases. The goal is not to pretend that a finite list is a complete Korean grapheme-to-phoneme system. It is to prevent well-known lexical and morphophonological exceptions from being silently treated as regular character substitutions.

The curated file is `data/korean/lexical_pronunciations.csv`. At this revision it contains 21 exact lexical entries. Every row carries the input form, standard surface Hangul, project Ukrainian target syllables, broad IPA syllables, a source URL, a short rule rationale, confidence, and target status.

## Added in this pass

| Input | Standard surface form | Main issue | Evidence |
|---|---|---|---|
| 꽃잎 | 꼰닙 | compound n-insertion plus nasal assimilation | National Institute of Korean Language (NIKL), Standard Pronunciation Q&A |
| 밭이 | 바치 | palatalization before the particle 이 | NIKL |
| 밭을 | 바틀 | liaison before a vowel-initial particle | NIKL |
| 넓네 | 널레 | ㄼ simplification and liquid assimilation | NIKL |
| 없다 | 업따 | ㅄ simplification and fortition; lexical vowel length | NIKL |
| 없는 | 엄는 | coda simplification and nasal assimilation; lexical vowel length | NIKL |
| 국물 | 궁물 | velar coda nasalization | NIKL |
| 떡볶이 | 떡뽀끼 | lexicalized suffixal liaison and fortition | NIKL |
| 옷이 | 오시 | liaison and sibilant realization in the i environment | NIKL |

The source links are stored on each row so that the browser service and Python implementation share the same provenance instead of maintaining independent undocumented exception lists.

## Previously covered cases retained

The original set remains in the same lexicon: `값없다`, `의견란`, `읽고`, `읽다`, `읽어`, `읽는`, `읽지`, `맑게`, `맑고`, `맑다`, `밝기`, and `닭고기`.

These cases deliberately contrast:
- verbal-stem ㄺ behaviour before ㄱ-initial endings (e.g. 읽고, 맑게);
- ordinary ㄺ simplification in other environments (e.g. 읽다, 맑다);
- noun 닭- behaviour, which must not inherit a verbal-stem exception;
- the lexical ㄹ-to-ㄴ exception in 의견란;
- ㅄ behaviour that depends on the following morpheme or word.

## Output policy: source confidence is not target confidence

The pronunciation source and Ukrainian rendering are separate claims.

- `confidence=high` means the Korean surface-pronunciation analysis is supported by the cited source.
- `target_status=model-selected` means the Ukrainian spelling is the project's chosen practical approximation. It is not a claim of national standardization or proof that every segment has a unique optimal Ukrainian equivalent.
- `target_status=provisional` marks an output needing additional Ukrainian phonetic/editorial review. In particular, `의견란 → ийґйоннан` remains provisional even though the Korean form [의ː견난] is sourced.

The website now makes this distinction visible and links selected edge cases directly to the NIKL sources.

## Runtime behaviour and limitations

1. **Exact-word overrides only.** The lexical layer matches an exact Hangul eojeol inside text separated by non-Hangul characters, including whitespace and punctuation. It does not infer unseen inflected forms or derive a full morphological parse.
2. **No unsafe generalization.** An exception for a particular verb stem must not be generalized to every word containing the same coda spelling.
3. **Shared data.** The browser engine and Python pipeline consume the same CSV, reducing the chance that a correction appears on one interface but not the other.
4. **Broad IPA, not narrow phonetics.** The IPA column records a practical broad surface representation and selected lexical length information; it is not acoustic measurement or a claim about every speaker and dialect.
5. **Modelled Ukrainian target.** Ukrainian output is author-designed practical transcription. It is not a translation and is not an officially promulgated Ukrainian standard.
6. **Unknown contexts remain unknown.** The system should flag unresolved context rather than silently invent lexical identity, morphology, or a unique reading.

## Regression and quality gates

- Browser tests assert Ukrainian output, IPA output, lexical status, and a lexical trace for the new edge cases.
- The validation corpus contains V045–V053 for the second-pass examples.
- The existing integrity test checks provenance fields, valid target status, and alignment between target and IPA syllable counts.
- CI must pass the browser test suite, Python test suite, and artifact/build checks before the change is considered release-ready.

## Primary sources

- [NIKL: 의견란 [의ː견난]](https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=8505)
- [NIKL: 넓네 [널레] and 겹받침](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=307237)
- [NIKL: compound n-insertion](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=307219)
- [NIKL: nasalization before ㄴ/ㅁ](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=311009)
- [NIKL: 밭이 / 밭을](https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5748)
- [NIKL: 떡볶이 [떡뽀끼]](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=313397)
