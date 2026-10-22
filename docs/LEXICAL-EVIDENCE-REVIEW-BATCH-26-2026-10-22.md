# NIKL Q&A claim-scope review — batch 26 (2026-10-22)

## Source reviewed

- Official source: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=261&pageIndex=1&qna_seq=311728
- Title: “앞일과 공업용의 발음 관련”.
- Question date: 2025-03-21; answer date: 2025-03-26.
- The question proposes 공업용[공업뇽]. The official answer corrects this premise: the standard pronunciation is 공업용[공엄뇽]. It also reproduces official §29 examples, including 영업-용[영엄뇽].

## Claim-scope decision

This is **direct answer attestation for the exact lexical target 공업용**, because the answer explicitly corrects the question's proposed reading and gives [공엄뇽]. The reproduced 영업-용 example is supporting rule text, not a replacement target. §§18 and 29 explain the result: ㄴ-insertion in the compound and nasalization of ㅂ before the inserted ㄴ.

The Korean surface, project IPA, and Ukrainian target remain unchanged. Korean bracket notation is not IPA; the source supports the Korean standard reading but does not independently adjudicate IPA allophony or the Ukrainian adaptation. Item-level reuse rights remain unverified.

## Repository changes

- `research/SOURCE-REGISTER.csv`: record the official title/date, exact correction, direct-attestation status, and the scope of the quoted rule example.
- `data/korean/lexical_pronunciations.csv`: clarify that NIKL corrects the question's proposed [공업뇽] to [공엄뇽]; output fields remain unchanged.
- `tests/lexical-evidence-review-batch-26.test.mjs`: verify source identity, correction, source URL parity, unchanged outputs, and current backlog.
- Intake guide and queue tests: remove qna_seq=311728 from the pending HTML import template and refresh counts.
- Batch-25 test: preserve its count as historical evidence rather than freezing the live backlog.

## Updated inventory

- Content-checked citations: **41/60**.
- Scope breakdown: **27 direct target-form / official-rule-example attestations, 9 partial, 5 contextual-example-only**.
- Citation-only/unreviewed: **19** — 15 Q&A/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs.
- Saved-HTML intake queue: **16** eligible pages (15 Q&A/FAQ + one dictionary entry).
- Item-level KOGL/reuse marking remains unverified. No broad-IPA gold or independent Ukrainian-target review was added.

## Task ledger

- DONE_VERIFIED after exact-head CI: official correction reviewed; source register and lexical note updated; queue counts and tests reconciled.
- DIRECT_ATTESTATION: the exact standard reading is given in the official answer.
- BLOCKED / rights: item-level KOGL mark remains unverified.
- TODO: review the remaining 19 citation-only sources; three PDFs require the separate saved-PDF workflow.
- BLOCKED_SPECIALIST_ADJUDICATION: independent broad-IPA gold and Ukrainian practical-target review remain outstanding.

No runtime pronunciation, IPA, Ukrainian output, or production code changed.
