# NIKL Q&A claim-scope review — batch 19 (2026-10-22)

## Source reviewed

- Official URL: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=279931
- Page title: “'ㄴ' 첨가”.
- Question date: 2023-09-11; answer date: 2023-09-13.
- The question asks why 음용 is pronounced [으묭] rather than [음뇽], comparing it with 담요[담:뇨] and 영업용[영업뇽].
- The answer states that ㄴ-insertion is not a uniform process even where the apparent phonological conditions are similar, and points to the explanation of Standard Pronunciation Rules §29.

## Claim-scope decision

This is **partial rule-context evidence**, not a standalone direct normative attestation of 음용[으묭]. The exact bracketed form appears in the question premise; the answer discusses the rule's non-obligatory nature but does not independently repeat [으묭] as an answer example. The lexical corpus therefore no longer says the Q&A “directly confirms” the form.

The lexical row, Korean surface, IPA string, and Ukrainian target were not changed. Only the evidence note was narrowed. The Q&A supports the negative-control lesson that §29 must not be generalized to every apparently similar consonant + 이/야/여/요/유 environment. The Korean bracket notation is not IPA, and this source does not validate the project's IPA segmentation or Ukrainian target.

## Repository changes

- research/SOURCE-REGISTER.csv: mark the page content-reviewed with partial_claim_scope_reviewed_2026-10-22, record the title/dates, and make the question-premise limitation explicit.
- data/korean/lexical_pronunciations.csv: replace the overstated “directly confirms” wording with a scoped rule-context/negative-control note.
- tests/lexical-evidence-review-batch-19.test.mjs: assert exact source identity, partial status, claim limitation, unchanged lexical target fields, and the updated inventory counts.
- tests/nikl-evidence-import.test.mjs and docs/NIKL-EVIDENCE-BATCH-IMPORT.md: remove the reviewed Q&A from the saved-page intake queue and refresh the counts.

## Updated inventory

- Content-checked citations: **34/60**.
- Scope breakdown: **21 direct target-form attestations, 8 partial, 5 contextual-example-only**.
- Citation-only/unreviewed: **26** — 22 Q&A/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs. The saved-HTML importer queue has 23 eligible HTML pages (22 Q&A/FAQ + one dictionary entry); PDFs use the separate metadata intake.
- Item-level KOGL/reuse marking remains unverified. No broad-IPA gold or independent Ukrainian-target review was added.

## Task ledger

- DONE_VERIFIED: exact official page content inspected; source-register and lexical evidence claims narrowed; intake queue and regression tests updated.
- BLOCKED / rights: item-level reuse terms for this Q&A remain unverified.
- TODO: continue claim-by-claim review of the remaining 26 citations; do not promote question-premise forms to direct answer attestations without evidence.
- BLOCKED_SPECIALIST_ADJUDICATION: independent broad IPA and Ukrainian practical-target review remain open.

This batch changes evidence provenance only; it does not change runtime pronunciation or Ukrainian output.

## Verification

- Tested branch head: 98556521fe404ccf550091915b5cee9de4689a69.
- CI run: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39826883919 — passed.
- Browser regression suite: 1,139/1,139 Node tests passed; Vite build passed.
- Python regression and data-integrity job passed.
- The live NIKL diagnostic again returned HTTP 403 and was recorded as BLOCKED; it did not create a live manifest. No access-control bypass was attempted.
