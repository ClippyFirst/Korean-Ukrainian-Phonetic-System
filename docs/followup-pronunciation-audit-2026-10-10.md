# Follow-up pronunciation audit — 2026-10-10

## Why this follow-up exists

The first regression-only pass found that `밭이랑` returned an empty `surfaceHangul` value rather than the NIKL-standard [반니랑]. This is a real coverage gap: the current rule engine deliberately avoids inferring compound structure for arbitrary strings, so the safest repair is a narrow, source-backed lexical record rather than a global ㄴ-insertion guess.

## Nine added exact records

| Input | NIKL surface | Main phenomenon | Evidence |
|---|---|---|---|
| 밭이랑 | 반니랑 | Compound ㄴ-insertion and nasal assimilation | [NIKL Q&A 335881](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=335881) |
| 집안일 | 지반닐 | Compound boundary, ㄴ-insertion, nasal assimilation | [NIKL Q&A 335881](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=335881) |
| 공업용 | 공엄뇽 | ㄴ-insertion followed by nasalization of ㅂ | [NIKL Q&A 311728](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=261&pageIndex=1&qna_seq=311728) |
| 얇실하다 | 얄씰하다 | ㄼ simplification and fortition of ㅅ | [NIKL Q&A 312379](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=312379) |
| 밭갈이 | 받까리 | Coda neutralization and fortition | [NIKL Q&A 312379](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=312379) |
| 값지다 | 갑찌다 | ㅄ simplification and fortition | [NIKL Q&A 312379](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=312379) |
| 짧다 | 짤따 | ㄼ simplification before consonant | [NIKL Q&A 325287](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=325287) |
| 삶다 | 삼ː따 | ㄻ simplification and lexical vowel length | [NIKL Q&A 325287](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=325287) |
| 읽거든 | 일꺼든 | Verbal-stem ㄺ exception before ㄱ-initial ending | [Standard Pronunciation Rules §11](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002) |

The nine records bring the lexical corpus from 409 to 418 entries. Their Ukrainian targets remain marked `provisional`; this patch asserts the sourced Korean surface form and broad IPA independently of those targets.

## Regression validation

`tests/adversarial-standard-pronunciation-followup-2026-10-10.test.mjs` checks all nine surface forms and IPA outputs. This is intentionally stronger than checking that the input produces some output: the expected Hangul reading and syllable-aligned IPA must match the NIKL evidence.

## Scope and limitations

- Compound-specific ㄴ insertion is not generalized to every string ending in a consonant followed by 이/야/여/요/유. The morpheme/compound boundary matters.
- The IPA is broad project transcription, not acoustic measurement.
- Ukrainian practical targets remain research hypotheses pending independent native-reader and Korean-phonetics review.
