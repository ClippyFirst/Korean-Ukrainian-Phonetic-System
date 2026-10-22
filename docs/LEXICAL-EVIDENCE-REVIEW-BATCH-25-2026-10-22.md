# NIKL Q&A claim-scope review — batch 25 (2026-10-22)

## Source reviewed

- Official source: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=313201
- Title: “‘굳이’ 구개음화”.
- Question date: 2025-04-16; answer date: 2025-04-18.
- The question asks about the pronunciation and rule sequence for 굳이. The answer refers the reader to Standard Pronunciation Rules §17 and reproduces the official example 굳이[구지].

## Claim-scope decision

This is direct official-rule-example evidence for the exact lexical target 굳이: the word is both the question target and the exact example reproduced from §17. The source supports the Korean standard reading [구지]. It does **not** independently adjudicate the project's IPA allophony choice or the Ukrainian practical target.

The existing Korean surface, project IPA, and Ukrainian target are preserved. Korean bracket notation is not IPA, and the Ukrainian target remains provisional. The source URL is normalized to the canonical official route without optional search parameters. Item-level reuse rights remain unverified.

## Repository changes

- `research/SOURCE-REGISTER.csv`: record the official title/date, direct rule-example status, and separate the source's Korean evidence from IPA/Ukrainian adjudication.
- `data/korean/lexical_pronunciations.csv`: clarify direct source scope and normalize the official URL; output fields remain unchanged.
- `tests/lexical-evidence-review-batch-25.test.mjs`: verify source identity, exact reading, source URL parity, unchanged output fields, and the live backlog.
- Intake guide and queue tests: remove qna_seq=313201 from the pending HTML import template and refresh counts.
- Batch-24 test: preserve its count as historical rather than freezing the current backlog.

## Updated inventory

- Content-checked citations: **40/60**.
- Scope breakdown: **26 direct target-form / official-rule-example attestations, 9 partial, 5 contextual-example-only**.
- Citation-only/unreviewed: **20** — 16 Q&A/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs.
- Saved-HTML intake queue: **17** eligible pages (16 Q&A/FAQ + one dictionary entry).
- Item-level KOGL/reuse marking remains unverified. No broad-IPA gold or independent Ukrainian-target review was added.

## Task ledger

- DONE_VERIFIED after exact-head CI: official page and exact example reviewed; source register and URL parity updated; queue counts and tests reconciled.
- DIRECT_RULE_EXAMPLE_WITH_SCOPE_NOTE: exact target is reproduced as an official §17 example; project IPA and Ukrainian target are not independently adjudicated.
- BLOCKED / rights: item-level KOGL mark remains unverified.
- TODO: review the remaining 20 citation-only sources; three PDFs require the separate saved-PDF workflow.
- BLOCKED_SPECIALIST_ADJUDICATION: independent broad-IPA gold and Ukrainian practical-target review remain outstanding.

No runtime pronunciation, IPA, Ukrainian output, or production code changed.
