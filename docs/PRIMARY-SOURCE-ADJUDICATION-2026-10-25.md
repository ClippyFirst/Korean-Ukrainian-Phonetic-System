# Primary-source adjudication: Korean surface corrections — 2026-10-25

## Scope

This record supports only two exact Korean surface-Hangul corrections in the browser g2pK adapter. It does not claim that the bracketed Hangul forms are IPA, independently reviewed IPA, or Ukrainian practical-transcription gold.

## Decisions

| Input | Corrected Korean surface | Primary evidence | Scope |
|---|---|---|---|
| 넓죽하다 | 넙쭈카다 | NIKL Online Q&A, qna_seq=307219, answer dated 2024-12-07; quotes Standard Pronunciation Rule 10 and explicitly gives 넓-죽하다[넙쭈카다]. | Exact lexical example; not a productive rule for every 넓- form. |
| 읽고 | 일꼬 | NIKL Online Q&A, qna_seq=329463, answer dated 2026-04-16; explains the ㄺ-before-ㄱ condition and explicitly gives 읽고[일꼬]. | Exact rule environment; do not generalize to all ㄺ sequences without morphology. |

### Canonical sources

- https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=307219
- https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=329463
- General Standard Pronunciation Rules: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002

## Implementation and verification

The browser adapter applies these as exact-form surface corrections before its IPA adapter. The vendored g2pK raw output remains separately regression-tested. Ukrainian output continues to derive from the corrected surface through the IPA adapter; no direct Hangul-to-Ukrainian exception was added.

Regression assertions require each correction to retain the corresponding NIKL Q&A identifier in its evidence field.

## Acceptance boundary

- **DONE_VERIFIED_SOURCE:** exact Korean surface-form claims above.
- **DONE_VERIFIED when final-head CI passes:** browser adapter source-provenance regression.
- **BLOCKED_SPECIALIST_ADJUDICATION:** independent IPA transcription for either word.
- **BLOCKED_INDEPENDENT_TARGET_GOLD:** independent Ukrainian practical transcription and scoring.
- **PARTIAL / RIGHTS_REVIEW:** official source citation is not itself a blanket reuse license. Check the specific NIKL site's terms and item-level rights before redistributing scraped corpora.
