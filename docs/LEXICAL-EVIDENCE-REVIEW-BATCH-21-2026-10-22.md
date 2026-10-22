# NIKL Q&A claim-scope review — batch 21 (2026-10-22)

## Source reviewed

- Official source: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=311009
- Title: “‘빛’ 발음이 궁금합니다.”
- Question date: 2025-03-04; answer date: 2025-03-05.
- The question concerns the pronunciation of 빛 in personal names. The answer discusses 빛누리 and names such as 한빛아/빛아, then reproduces the official text of Standard Pronunciation Rules §§13 and 18, including 옷이[오시], 국물[궁물], and 없는[엄ː는].

## Claim-scope decision

The three lexical forms in this repository are **not the primary target of the Q&A question**. However, they appear as examples in the official rule text reproduced by the official NIKL answer. The source is therefore classified as **direct official-rule-example attestation with a rule-instrument scope note**, not as evidence that the Q&A itself asks about those three words.

This is consistent with the existing treatment of other NIKL answers that reproduce official rule examples. Korean bracket notation is not IPA; the project's IPA and Ukrainian adaptation remain separate and provisional.

The review also found a factual error in the lexical note for 국물: the nasal assimilation is triggered by following ㅁ, not ㄹ. The note is corrected from “before ㄹ” to “before ㅁ”. The stored Korean surface, IPA, and Ukrainian target values are unchanged.

## Repository changes

- `research/SOURCE-REGISTER.csv`: record the official title/date, normalize the source URL to the observed official locator, mark content reviewed, and state the question-target versus quoted-rule-example distinction.
- `data/korean/lexical_pronunciations.csv`: normalize the source URL for 없는, 국물, and 옷이; clarify their quoted-example scope; correct the 국물 note's mistaken trigger consonant.
- `tests/lexical-evidence-review-batch-21.test.mjs`: add source-scope, URL-parity, preserved-output, and rule-note regressions.
- Intake guide and queue tests: remove this reviewed source from the pending HTML import template and refresh current counts.
- Batch-20 test: preserve its inventory count as historical rather than freezing the current live backlog.
- Master handoff and completion audit: record batch-20 exact-head CI and batch-21 evidence scope.

## Updated inventory

- Content-checked citations: **36/60**.
- Scope breakdown: **22 direct target-form / official-rule-example attestations, 9 partial, 5 contextual-example-only**.
- Citation-only/unreviewed: **24** — 20 Q&A/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs.
- Saved-HTML intake queue: **21** eligible pages (20 Q&A/FAQ + one dictionary entry).
- Item-level KOGL/reuse marking remains unverified. No broad-IPA gold or independent Ukrainian-target review was added.

## Task ledger

- DONE_VERIFIED: official indexed page and quoted examples inspected; source scope and URL recorded; erroneous 국물 note corrected; regression tests and queue counts updated.
- DIRECT_RULE_EXAMPLE_WITH_SCOPE_NOTE: the three exact forms are present in the quoted official rule examples, but they are not the Q&A's question target.
- BLOCKED / rights: item-level KOGL mark not visually verified.
- TODO: review the remaining 24 citation-only sources claim-by-claim; three PDFs require the separate saved-PDF workflow.
- BLOCKED_SPECIALIST_ADJUDICATION: independent broad-IPA gold and Ukrainian practical-target review remain outstanding.

No runtime pronunciation, IPA, Ukrainian output, or production code changed.
