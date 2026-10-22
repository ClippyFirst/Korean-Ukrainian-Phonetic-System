# Lexical evidence review batch 16 — 2026-10-22

## Scope

This batch reviews two additional official NIKL Online Q&A pages already cited by the lexical dataset. Both directly answer the target pronunciation; one is especially valuable as a negative control against overapplying ㄴ-insertion.

## 1. Q&A qna_seq=316101 — 값있다 / 곧이어

[Official Q&A: 'ㄴ' 첨가 질문합니다.](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=316101)

- Question: 2025-06-10; answer: 2025-06-11.
- The answer directly gives `값있다[가빋따]`, `값있는[가빈는]`, and `곧이어[고디어]`.
- It explicitly says that ㄴ-insertion is not automatic and references the explanation to Standard Pronunciation Rules §29. `값있다` and `곧이어` are useful negative controls against a system that predicts insertion from an apparent sound environment alone.
- The source directly attests the Korean surface forms, but it does not validate every intermediate derivational stage, broad IPA, or Ukrainian output. The IPA layer must preserve the long vowel in `값있다` where the established project convention represents it.

## 2. Q&A qna_seq=312381 — 좋아

[Official Q&A: 좋아 발음](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=312381)

- Question: 2025-04-03; answer: 2025-04-05.
- The answer directly gives `좋아[조ː아]` and cites Standard Pronunciation Rules §12(4), explaining deletion of ㅎ before the vowel-initial ending `-아`.
- The page also reproduces other §12(4) examples, but the direct target-form attestation for this lexical row is `좋아[조ː아]`.

## Changes

- Updated two source-register records with the exact page titles, dates, attested forms, scope, and remaining item-level reuse caveat.
- Updated three lexical notes to distinguish direct Hangul surface evidence from IPA and Ukrainian-target decisions.
- Added regression tests for exact forms, source identity, rule-29 negative-control scope, and the §12(4) attribution.
- Refreshed the source-inventory floor after two more pages were reviewed.

## Evidence inventory

- 16 of the 60 newly inventoried citation pages are content-checked.
- Page-level categories: 9 direct for target forms, 2 partial, 5 contextual-example-only for target forms; 44 remain citation-only/unreviewed.
- Item-level KOGL markings remain unverified. The source pages are not copied into the repository.

## Task ledger

- `DONE_VERIFIED`: two official pages reviewed; three lexical notes and two source-register records updated; direct-attestation and negative-control regression added.
- `PARTIAL`: Korean surface readings remain separate from broad IPA and Ukrainian target validation.
- `BLOCKED / rights`: item-level reuse marks not checked.
- `BLOCKED_SPECIALIST_ADJUDICATION`: independent IPA and Ukrainian-target review remain outstanding.
