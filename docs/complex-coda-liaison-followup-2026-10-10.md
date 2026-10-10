# Complex-coda liaison follow-up — 2026-10-10

## What the next source sweep found

The National Institute of Korean Language's Standard Pronunciation Rule §14 lists several official complex-coda + vowel-initial grammatical-morpheme examples. A targeted scan showed that the project had records for some familiar cases (for example, `닭을`, `값을`, `없어`, `여덟이`) but lacked other explicit controls. Since the engine intentionally does not infer morphology from Hangul adjacency, those examples need narrow, sourced lexical records rather than a broader heuristic.

## Five additional source-backed records

| Input | NIKL surface | Rule pressure | Source |
|---|---|---|---|
| 앉아 | 안자 | ㄵ: retain ㄴ as coda and move ㅈ to onset | [NIKL Q&A 325622](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=325622) |
| 곬이 | 골씨 | ㄽ: the moved ㅅ is pronounced fortis [ㅆ] | [NIKL Q&A 325622](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=325622) |
| 핥아 | 할타 | ㄾ: retain ㄹ and move ㅌ | [NIKL Q&A 325622](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=325622) |
| 읊어 | 을퍼 | ㄿ: retain ㄹ and move ㅍ | [NIKL Q&A 325622](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=325622) |
| 몫이 | 목씨 | ㄳ: the moved ㅅ is pronounced fortis [ㅆ] | [NIKL Q&A 335008](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=335008) |

The lexical corpus grows from 418 to 423 entries. Korean surface forms are source-backed. Broad IPA is a project transcription layer; Ukrainian readings remain provisional and have not been independently validated with Ukrainian readers.

## Regression control

`tests/adversarial-complex-coda-liaison-2026-10-10.test.mjs` asserts the five Korean surface forms and their broad IPA outputs, and rejects unresolved placeholders. It does not treat a passing model-output test as evidence that the Ukrainian target is empirically optimal.

## Sources and rule interpretation

NIKL's official §14 explanation states that when a complex-coda word combines with a grammatical morpheme beginning with a vowel, the first consonant remains in the coda and the second moves to the next onset; for ㄳ, ㄽ, and ㅄ, moved ㅅ is fortis [ㅆ]. The cited official Q&A reproduces the rule examples, while the separate 2026 Q&A confirms `몫이[목씨]`.

- [NIKL Q&A 325622 (2025-12-29)](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=325622)
- [NIKL Q&A 335008 (2026-08-24)](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=335008)
- [NIKL Standard Pronunciation Rules](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002)
