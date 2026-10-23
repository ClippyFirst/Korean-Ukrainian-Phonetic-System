# NIKL Q&A claim-scope review — batch 28 (2026-10-22)

## Source reviewed

- Official source: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=326601
- Title: “몇으로 발음”.
- Question date: 2026-01-18; answer date: 2026-01-20.
- The official answer directly states that 몇으로 is pronounced [며츠로] and explains Standard Pronunciation Rules §13: the final ㅊ is moved to the onset of the vowel-initial particle 으로.

## Claim-scope decision

This is direct official answer attestation for the exact lexical target 몇으로. The source gives the Korean standard surface and identifies the relevant rule. Korean bracket notation is not IPA; the project's IPA and Ukrainian adaptation remain separate claims and are not independently adjudicated by this review. Item-level reuse rights remain unverified.

The stored Korean surface, project IPA, and Ukrainian target are unchanged.

## Repository changes

- `research/SOURCE-REGISTER.csv`: record official title/date, exact-form attestation, §13 explanation, and the distinction between Korean standard reading and downstream adapters.
- `data/korean/lexical_pronunciations.csv`: clarify direct answer support and the IPA boundary; no output fields changed.
- `tests/lexical-evidence-review-batch-28.test.mjs`: verify source identity, exact reading, source URL parity, unchanged output fields, and live backlog.
- Intake guide and queue tests: remove qna_seq=326601 from the pending HTML import template and refresh counts.
- Batch-27 test: preserve its count as historical rather than freezing the current backlog.

## Updated inventory

- Content-checked citations: **43/60**.
- Scope breakdown: **28 direct target-form / official-rule-example attestations, 1 official dictionary attestation, 9 partial, 5 contextual-example-only**.
- Citation-only/unreviewed: **17** — 13 Q&A/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs.
- Saved-HTML intake queue: **14** eligible pages (13 Q&A/FAQ + one dictionary entry).
- Item-level KOGL/reuse marking remains unverified. No broad-IPA gold or independent Ukrainian-target review was added.

## Task ledger

- PARTIAL / CI repair in progress: initial exact-head CI found one batch-28 regression-test failure because the source-register `integration_status` field did not contain the phrase the test contract required. The source row has now been corrected to state the exact official reading and §13 claim. Re-run exact-head CI before marking this batch DONE_VERIFIED.
- DIRECT_ATTESTATION: exact standard reading [며츠로] and §13 are stated in the official answer.
- BLOCKED / rights: item-level KOGL mark remains unverified.
- TODO: review the remaining 17 citation-only sources; three PDFs require the separate saved-PDF workflow.
- BLOCKED_SPECIALIST_ADJUDICATION: independent broad-IPA gold and Ukrainian practical-target review remain outstanding.

No runtime pronunciation, IPA, Ukrainian output, or production code changed.
