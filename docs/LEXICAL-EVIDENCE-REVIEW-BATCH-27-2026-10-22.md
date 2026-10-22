# NIKL evidence review — batch 27: dictionary attestation embedded in Q&A 318279 (2026-10-22)

## Source reviewed

- Official source: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=27&pageIndex=1&qna_seq=318279
- Title: “‘찾아가다’라는 동사의 쓰임”.
- Question date: 2025-07-14; answer date: 2025-07-15.
- The Q&A itself asks about syntax and argument structure. Its answer embeds the Standard Korean Dictionary headword entry, which directly gives 찾아가다[차자가다] and conjugation 찾아가[차자가].

## Claim-scope decision

The evidence class is **OFFICIAL_DICTIONARY_ATTESTATION**. The embedded dictionary entry directly attests the lexical pronunciation; the Q&A's syntactic answer is not itself a phonological analysis. The project maps the stem-plus-ending form using §13, but that is the project's rule mapping, not an explanation provided by this answer.

The stored Korean surface, project IPA, and Ukrainian target are unchanged. Korean bracket notation is not IPA. Item-level reuse rights remain unverified.

## Repository changes

- `research/SOURCE-REGISTER.csv`: record the official title/date, dictionary-attestation class, and distinction between the Q&A's syntactic topic and the embedded dictionary pronunciation.
- `data/korean/lexical_pronunciations.csv`: clarify the embedded dictionary evidence and preserve the source-versus-rule-adapter boundary.
- `tests/lexical-evidence-review-batch-27.test.mjs`: test source identity, dictionary evidence class, source URL parity, unchanged output fields, and current backlog.
- Intake guide and queue tests: remove qna_seq=318279 from the pending HTML import template and refresh counts.
- Batch-26 test: preserve its count as historical evidence rather than freezing the live backlog.

## Updated inventory

- Content-checked citations: **42/60**.
- Scope breakdown: **27 direct target-form / official-rule-example attestations, 1 official dictionary attestation, 9 partial, 5 contextual-example-only**.
- Citation-only/unreviewed: **18** — 14 Q&A/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs.
- Saved-HTML intake queue: **15** eligible pages (14 Q&A/FAQ + one dictionary entry).
- Item-level KOGL/reuse marking remains unverified. No broad-IPA gold or independent Ukrainian-target review was added.

## Task ledger

- DONE_VERIFIED after exact-head CI: dictionary pronunciation and claim scope reviewed; source register and lexical note updated; queue counts and tests reconciled.
- OFFICIAL_DICTIONARY_ATTESTATION: the exact lexical pronunciation is in the embedded official dictionary entry.
- BLOCKED / rights: item-level KOGL mark remains unverified.
- TODO: review the remaining 18 citation-only sources; three PDFs require the separate saved-PDF workflow.
- BLOCKED_SPECIALIST_ADJUDICATION: independent broad-IPA gold and Ukrainian practical-target review remain outstanding.

No runtime pronunciation, IPA, Ukrainian output, or production code changed.
