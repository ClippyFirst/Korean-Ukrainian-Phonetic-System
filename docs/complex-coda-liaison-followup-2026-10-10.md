# Complex-coda liaison follow-up — 2026-10-10

## What the next source sweep found

The National Institute of Korean Language's Standard Pronunciation Rule §14 lists several official complex-coda + vowel-initial grammatical-morpheme examples. A targeted scan showed that the project had records for some familiar cases (for example, `닭을`, `값을`, `없어`, `여덟이`) but lacked other explicit controls. Since the engine intentionally does not infer morphology from Hangul adjacency, those examples need narrow, sourced lexical records rather than a broader heuristic.

## Twelve source-backed regression controls

| Input | NIKL surface | Rule pressure | Source |
|---|---|---|---|
| 앉아 | 안자 | ㄵ: retain ㄴ as coda and move ㅈ to onset | [NIKL Q&A 325622](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=325622) |
| 곬이 | 골씨 | ㄽ: the moved ㅅ is pronounced fortis [ㅆ] | [NIKL Q&A 325622](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=325622) |
| 핥아 | 할타 | ㄾ: retain ㄹ and move ㅌ | [NIKL Q&A 325622](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=325622) |
| 읊어 | 을퍼 | ㄿ: retain ㄹ and move ㅍ | [NIKL Q&A 325622](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=325622) |
| 몫이 | 목씨 | ㄳ: the moved ㅅ is pronounced fortis [ㅆ] | [NIKL Q&A 335008](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=335008) |
| 넓어 | 널버 | ㄼ before the vowel-initial ending -어 | [NIKL Q&A 323289](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=323289) |
| 넓으니 | 널브니 | ㄼ liaison in the conjugated form | [NIKL Q&A 323289](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=323289) |
| 넓은 | 널븐 | ㄼ liaison before -은 | [NIKL Q&A 323289](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=323289) |
| 넓습니다 | 널씀니다 | ㄼ simplification, fortition and nasalization in formal conjugation | [NIKL Q&A 323289](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=323289) |
| 넓지 | 널찌 | ㄼ simplification and fortition before ㅈ | [NIKL Q&A 323289](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=323289) |
| 짧아 | 짤바 | ㄼ liaison before -아 | [NIKL Standard Pronunciation Rules §14](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002) |
| 짧으니 | 짤브니 | ㄼ liaison before -으니 | [NIKL Standard Pronunciation Rules §14](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002) |

Nine of the twelve tested forms were new lexical entries, growing the corpus from 418 to 427 entries; three liaison controls were already present and are tested rather than duplicated. Korean surface forms are source-backed. Broad IPA is a project transcription layer; Ukrainian readings remain provisional and have not been independently validated with Ukrainian readers.

## Regression control

`tests/adversarial-complex-coda-liaison-2026-10-10.test.mjs` asserts the five Korean surface forms and their broad IPA outputs, and rejects unresolved placeholders. It does not treat a passing model-output test as evidence that the Ukrainian target is empirically optimal.

## Sources and rule interpretation

NIKL's official §14 explanation states that when a complex-coda word combines with a grammatical morpheme beginning with a vowel, the first consonant remains in the coda and the second moves to the next onset; for ㄳ, ㄽ, and ㅄ, moved ㅅ is fortis [ㅆ]. The cited official Q&A reproduces the rule examples, while the separate 2026 Q&A confirms `몫이[목씨]`.

- [NIKL Q&A 325622 (2025-12-29)](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=325622)
- [NIKL Q&A 335008 (2026-08-24)](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=335008)
- [NIKL Q&A 323289 — 넓다 and its conjugated forms](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=323289)
- [NIKL Korean Basic Dictionary — 넓다](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=64511&captchaNumber=&comment_user_name=&nation=eng&nationCode=6&viewTypes=on&wordComment=)
- [NIKL Standard Pronunciation Rules](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002)
