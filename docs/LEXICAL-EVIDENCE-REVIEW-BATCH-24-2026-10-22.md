# NIKL Q&A claim-scope review — batch 24 (2026-10-22)

## Source reviewed

- Official source: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=313717
- Title: “붙이는 구개음화”.
- Question date: 2025-04-23; answer date: 2025-04-24.
- The official answer directly states that 붙이다 is pronounced [부치다] and explains §17: ㅌ combines with suffixal 이, is realized as ㅊ, and resyllabifies into the following syllable.

## Claim-scope decision

This is a **direct answer attestation for the exact lexical target 붙이다**, not merely a rule example copied into an answer about another word. The source register now records the page title/date and the answer's exact target. Korean bracket notation is not IPA; the project IPA and Ukrainian adaptation remain separate, and the Ukrainian target remains provisional.

## Repository changes

- `research/SOURCE-REGISTER.csv`: mark qna_seq=313717 content-reviewed with a direct-attestation status, exact title/date, and explicit source/adaptation boundary.
- `data/korean/lexical_pronunciations.csv`: clarify that the answer directly attests 붙이다[부치다]; no Korean surface, IPA, or Ukrainian target field changed.
- `tests/lexical-evidence-review-batch-24.test.mjs`: verify source identity, exact-form attestation, source URL parity, preserved output fields, and live backlog.
- Intake guide and queue tests: remove qna_seq=313717 from the pending HTML import template and refresh current counts.
- Batch-23 test: preserve its count as historical evidence rather than freezing the current live backlog.

## Updated inventory

- Content-checked citations: **39/60**.
- Scope breakdown: **25 direct target-form / official-rule-example attestations, 9 partial, 5 contextual-example-only**.
- Citation-only/unreviewed: **21** — 17 Q&A/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs.
- Saved-HTML intake queue: **18** eligible pages (17 Q&A/FAQ + one dictionary entry).
- Item-level KOGL/reuse marking remains unverified. No broad-IPA gold or independent Ukrainian-target review was added.

## Task ledger

- DONE_VERIFIED after exact-head CI: official indexed answer reviewed; source register and lexical note updated; queue counts and tests reconciled.
- DIRECT_ATTESTATION: exact target and §17 explanation are stated in the official answer.
- BLOCKED / rights: item-level KOGL mark remains unverified.
- TODO: review the remaining 21 citation-only sources; three PDFs require the separate saved-PDF workflow.
- BLOCKED_SPECIALIST_ADJUDICATION: independent broad-IPA gold and Ukrainian practical-target review remain outstanding.

No runtime pronunciation, IPA, Ukrainian output, or production code changed.
