# Adversarial standard-pronunciation expansion — 2026-10-10

## What changed

This audit adds 8 exact lexical entries to the browser pronunciation corpus (400 → 408 rows). These are deliberately narrow, source-backed entries: they pin standard Korean surface forms and their broad IPA while leaving Ukrainian outputs explicitly provisional. They do not create a general-purpose Korean morphological parser.

| Input | NIKL surface form | Why it is adversarial | Primary evidence |
|---|---|---|---|
| 밝는 | 방는 | ㄺ simplification before ㄴ followed by nasal assimilation | [NIKL Q&A 334294](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=334294) |
| 묽게 | 물께 | Verb/adjective-stem ㄺ exception before ㄱ-initial ending | [Standard Pronunciation Rules](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002), §11 |
| 실없다 | 시럽따 | Lexicalized liaison into substantive morpheme 없-; not a formal-morpheme §13 case | [NIKL Q&A 335263](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=335263) |
| 몇으로 | 며츠로 | Final ㅊ resyllabifies before 으로 | [NIKL Q&A 326601](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=326601) |
| 값있는 | 가빈는 | §15 substantive-morpheme boundary; only one member of ㅄ transfers | [Standard Pronunciation Rules](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002), §15 |
| 앞일 | 암닐 | Compound-specific ㄴ-insertion and nasal assimilation | [Standard Pronunciation Rules](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002), §29 |
| 무늬 | 무니 | ㅢ with a consonant onset is [ㅣ] | [Standard Pronunciation Rules](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002), §5 |
| 지식의 | 지시긔 / 지시게 | Genitive particle 의 has two standard readings; preceding coda migration does not force [ㅣ] | [NIKL Q&A 333083](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=27&pageIndex=1&qna_seq=333083) |

## Important corrections to the audit logic

- A missing exact dictionary row is not itself a runtime bug. Some cases, including 희망, are already handled by a documented general rule; the existing regression test remains in place.
- Conversely, compositional output is not enough where the standard depends on lexical identity or a morphologically licensed boundary. The added entries pin only forms with adequate evidence.
- The pronunciation [시럽따] for 실없다 is explicitly confirmed by [NIKL Q&A 335263](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=335263). It is not the generic §13 formal-morpheme liaison pattern.
- 지식의 preserves both [지시긔] and [지시게], as confirmed by [NIKL Q&A 333083](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=27&pageIndex=1&qna_seq=333083). The two forms are kept as variants rather than silently selecting one.
- The IPA is broad, syllable-aligned project transcription, not narrow acoustic measurement. Ukrainian targets are provisional research hypotheses and are not an official Ukrainian standard.

## Regression coverage

`tests/adversarial-standard-pronunciation-2026-10-10.test.mjs` checks the source-backed records, exact surface forms, IPA, Ukrainian target status, and the two readings of 지식의. It also contrasts ㄺ, ㄼ, ㄿ and ㅄ contexts to prevent a single blanket coda rule from flattening distinct environments.

Passing automated tests confirms the implementation matches these fixtures; it does not substitute for a Korean linguist's review or empirical evaluation with Ukrainian readers.

## Cases deliberately not duplicated in the lexical layer

The audit also rechecked `넓죽하다`, `넓둥글다`, `넓적하다`, `많고`, and `밟는`. These already have general-rule or surface-only coverage in the repository. Adding a full lexical override would hide the rule trace and break tests that specifically ensure the narrow ㄼ exception remains algorithmic. They therefore remain covered by existing regression tests rather than being duplicated as new full lexical records. The existing surface-only `밟는` row now preserves the long-vowel IPA `paːm|nɯn` in its evidence metadata while keeping the rule-engine path active.
