# NIKL Q&A claim-scope review — batch 20 (2026-10-22)

## Source reviewed

- Official source: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=317202
- Title: “홑이불”.
- Question date: 2025-06-28; answer date: 2025-06-30.
- The official answer states that 홑이불 is pronounced [혼니불] through ㄴ-insertion and nasal assimilation.

## Claim-scope decision

This source directly attests the **lemma** 홑이불[혼니불], but the lexical dataset input is **홑이불을**. The exact inflected input is not separately present in the answer. Therefore, the evidence status is **partial lemma/application support**, not a direct attestation of the full lexical input.

The existing surface form 혼니부를, project IPA, and Ukrainian target are unchanged. The attached 을 form is derived separately from the attested lemma and the applicable liaison behavior. The source supports the broad processes ㄴ-insertion and nasal assimilation, but it does not settle a unique intermediate ordering; the project must not overstate that point. Korean bracket notation is a pronunciation notation, not IPA.

## Repository changes

- `research/SOURCE-REGISTER.csv`: record the official title and dates, mark the source content-reviewed, classify the exact form as partial lemma/application support, and preserve the item-level reuse-rights uncertainty.
- `data/korean/lexical_pronunciations.csv`: narrow the evidence note so it no longer says that the source directly confirms 홑이불을. No Korean surface, IPA, or Ukrainian target field changed.
- `tests/lexical-evidence-review-batch-20.test.mjs`: add regressions for source identity, lemma-vs-inflected-form scope, preserved outputs, and the current source backlog.
- Intake guide and queue tests: remove this reviewed Q&A from the pending HTML import template and refresh current counts.
- Historical batch-19 tests: preserve the count as a statement about that batch rather than freezing the current backlog.

## Updated inventory

- Content-checked citations: **35/60**.
- Scope breakdown: **21 direct target-form attestations, 9 partial, 5 contextual-example-only**.
- Citation-only/unreviewed: **25** — 21 Q&A/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs.
- Saved-HTML intake queue: **22** eligible pages (21 Q&A/FAQ + one dictionary entry).
- Item-level KOGL/reuse marking remains unverified. No broad-IPA gold or independent Ukrainian-target review was added.

## Task ledger

- DONE_VERIFIED: official indexed answer inspected; exact claim scope narrowed; source register and lexical evidence note updated; queue counts and regression tests updated.
- PARTIAL: lemma 홑이불[혼니불] is directly attested; attached form 홑이불을 remains rule-derived.
- BLOCKED / rights: item-level KOGL marking remains unverified.
- TODO: review the remaining 25 citations one by one without treating question premises or lemma forms as direct attestation of different inflected targets.
- BLOCKED_SPECIALIST_ADJUDICATION: independent broad-IPA gold and Ukrainian practical-target review remain outstanding.

This batch changes evidence provenance only; it does not change runtime pronunciation, IPA, or Ukrainian output.
