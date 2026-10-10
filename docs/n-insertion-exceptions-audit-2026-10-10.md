# NIKL audit: exceptions to automatic ㄴ insertion — 2026-10-10

## Finding

A source-driven adversarial test found a real coverage gap: the engine returned an empty `surfaceHangul` for `값있다`, although NIKL explicitly records the standard pronunciation `값있다[가빋따]`. Three source-backed regression cases are now represented in the lexical corpus.

The key methodological point is that Korean ㄴ insertion is **not a purely mechanical rule**. NIKL explains that it does not apply uniformly in every phonologically similar environment; lexical and morphological information matters.

## Corrected controls

| Input | NIKL surface | Why it matters | Official source |
|---|---|---|---|
| 값있다 | 가빋따 | NIKL confirms the surface form; do not infer ㄴ insertion from the letters alone | [NIKL Q&A 316101](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=316101) |
| 곧이어 | 고디어 | NIKL confirms no inserted ㄴ in this lexicalized form | [NIKL Q&A 316101](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=316101) |
| 음용 | 으묭 | A phonologically tempting environment does not automatically trigger ㄴ insertion | [NIKL Q&A 279931](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=279931) |

The existing `값있는[가빈는]` entry remains distinct and unchanged. Do not conflate `값있다` and `값있는`: the official readings differ.

## Test-first evidence

The new test was initially added before any lexical records. CI failed on the first case because `engine.convert('값있다').surfaceHangul` returned an empty string rather than `가빋따`. This establishes an actual coverage gap, rather than merely assuming that a missing exact record is a bug. After adding narrow lexical entries for all three official examples, rerun CI to validate the repaired outputs.

## Scope and caveats

- The corpus now has 429 unique lexical entries.
- Korean surface forms are based on the cited NIKL answers.
- IPA is the project's broad transcription layer, not acoustic measurement.
- Ukrainian target spellings remain provisional and require independent reader/phonetics validation.
- These records do not justify a blanket rule for arbitrary unknown compounds or phrases.

## Official references

- [NIKL Q&A 316101 — 값있는 and 곧이어; discussion of non-automatic ㄴ insertion](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=316101)
- [NIKL Q&A 279931 — 음용[으묭]](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=279931)
- [NIKL Standard Pronunciation Rules, Rule 29 and commentary](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002)
