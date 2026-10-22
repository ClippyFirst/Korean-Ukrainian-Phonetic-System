# NIKL Q&A claim-scope review — batch 23 (2026-10-22)

## Source reviewed

- Official source: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=261&pageIndex=1&qna_seq=314041
- Title: “낱낱이 음운변동”.
- Question date: 2025-04-28; answer date: 2025-04-29.
- The official answer directly gives 낱낱이[난ː나치] and states the sequence: 음절의 끝소리 규칙, 비음화, 구개음화.

## Claim-scope decision

This source directly attests the exact lexical target 낱낱이 and explicitly states the ordered explanation used in the answer. The prior lexical note said that exact rule ordering can vary by analysis, which underrepresented this source's actual content. The note is now aligned to the answer: final neutralization → nasalization → palatalization (§§9, 18, 17).

The stored Korean surface remains 난나치; the IPA already preserves the source's long vowel as nanː|na|tɕʰi. The Ukrainian target remains provisional and unchanged. Korean bracket notation is not IPA, and this source does not independently validate the Ukrainian adaptation. Item-level reuse rights remain unverified.

## Repository changes

- `research/SOURCE-REGISTER.csv`: record the official title/dates, direct target attestation, and explicit sequence statement; retain the rights uncertainty.
- `data/korean/lexical_pronunciations.csv`: replace the over-cautious “exact rule ordering can vary by analysis” note with the sequence directly stated in the official answer. Korean surface, IPA, and Ukrainian target fields are unchanged.
- `tests/lexical-evidence-review-batch-22.test.mjs`: verify source identity/status, exact rule sequence, IPA length preservation, unchanged target fields, and backlog counts.
- Intake guide and queue tests: remove qna_seq=314041 from the pending HTML import template and refresh counts.
- Batch-21 test: preserve its count as historical evidence instead of freezing the live queue.

## Updated inventory

- Content-checked citations: **38/60**.
- Scope breakdown: **24 direct target-form / official-rule-example attestations, 9 partial, 5 contextual-example-only**.
- Citation-only/unreviewed: **22** — 18 Q&A/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs.
- Saved-HTML intake queue: **19** eligible pages (18 Q&A/FAQ + one dictionary entry).
- Item-level KOGL/reuse marking remains unverified. No broad-IPA gold or independent Ukrainian-target review was added.

## Task ledger

- DONE_VERIFIED after exact-head CI: official indexed answer reviewed; source-register claim scope and lexical note aligned; tests and current queue counts updated.
- DIRECT_ATTESTATION: exact target and the stated rule sequence are present in the answer.
- BLOCKED / rights: item-level KOGL marking remains unverified.
- TODO: review the remaining 23 citation-only sources; three PDFs require the separate saved-PDF workflow.
- BLOCKED_SPECIALIST_ADJUDICATION: independent broad-IPA gold and Ukrainian practical-target review remain outstanding.

No runtime pronunciation, IPA, Ukrainian output, or production code changed.


## Verification

- Tested implementation head: a78d9806ffecbe07af7edf4a38ee1a0cbeee0b61.
- CI run: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39832112640 — passed.
- Browser regression suite: 1,150/1,150 Node tests passed; Vite build passed.
- Python regression/data-integrity passed.
- Live NIKL fetch returned HTTP 403 and was classified BLOCKED; no live manifest was produced and no access-control bypass was attempted.
