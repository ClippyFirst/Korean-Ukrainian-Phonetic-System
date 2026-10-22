# Lexical evidence review batch 15 — 2026-10-22

## Scope

Three additional official NIKL pages were opened and compared with the cited lexical CSV forms. This batch focuses on exact Hangul pronunciation notation and careful attribution of the rule instrument named by each source. The bracketed Hangul readings are Korean surface evidence, not broad IPA.

## Source reviews

### 1. NIKL Online Q&A qna_seq=315279 — direct complex-coda examples

[Official Q&A: 초등 교과서 겹받침 발음 너무 헷갈립니다.](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=315279)

- Question: 2025-05-22; answer: 2025-05-23.
- The answer explicitly gives `읽다[익따]`, `읽고[일꼬]`, `붉다[북따]`, `붉지[북찌]`, `붉고[불꼬]`, `맑다[막따]`, `맑지만[막찌만]`, `맑고[말꼬]`, `밟다[밥ː따]`, `밟고[밥ː꼬]`, `밟으니[발브니]`, `넓다[널따]`, and `짧다[짤따]`.
- This is direct official Korean-surface attestation for the listed forms. The answer refers readers to Standard Pronunciation Rules §§10–11. The source does not supply IPA, so no IPA or Ukrainian output is derived from the Hangul notation.

### 2. NIKL Online Q&A qna_seq=307237 — direct answer plus quoted rule example

[Official Q&A: '넓네'의 표준 발음이 궁금합니다.](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=307237)

- Question: 2024-12-05; answer: 2024-12-06.
- The answer directly states `넓네[널레]` and cites Standard Pronunciation Rules §§10 and 20.
- The page also reproduces `없다[업ː따]` within its quotation of §10 examples. That is an official-rule-example citation, not the question's target. The source register and lexical note preserve this difference.
- Both are Korean surface readings; `없다`'s long-vowel marker must be preserved at the IPA boundary.

### 3. NIKL curated FAQ mcfaq_seq=5748 — 밭을 / 밭이

[Official curated FAQ: '밭을'과 '밭이'의 표준 발음](https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5748)

- Registered: 2019-12-06.
- The FAQ directly answers `밭을[바틀]` and `밭이[바치]`.
- **Rule-instrument distinction:** the FAQ explicitly cites `한글맞춤법` (Hangeul Orthography) §§13 and 17. Those citations must not be silently relabeled as `표준 발음법` (Standard Pronunciation Rules). The project maps the same surface outcomes to its separate Standard Pronunciation Rules §13 resyllabification and §17 palatalization rules; that crosswalk is a project rule mapping, not the instrument named by this FAQ.

## Implementation and tests

- Promoted the three existing source-register rows from citation-only to reviewed records with dates, exact examples, claim scope, and rights caveats.
- Updated nine lexical notes (`맑고`, `붉다`, `붉지`, `붉고`, `밟으니`, `넓네`, `없다`, `밭이`, `밭을`) to make direct source scope explicit and to prevent confusion between Standard Pronunciation Rules and Hangeul Orthography.
- Added regression tests for exact source identity, exact form coverage, the difference between a case-specific answer and a quoted rule example, and rule-instrument attribution.
- Refreshed the explicit unreviewed-citation floor to match the evidence inventory after this batch.

## Evidence inventory

- 14 of the 60 newly inventoried citation pages are now content-checked.
- Page-level categories: 7 direct for target forms, 2 partial, 5 contextual-example-only for target forms; 46 remain citation-only/unreviewed.
- Item-level KOGL markings remain unverified. No source text is redistributed in the repository.

## Task ledger

- `DONE_VERIFIED`: three official pages reviewed; nine lexical notes narrowed; source-register rows updated; direct-versus-quoted-rule and rule-instrument regressions added.
- `PARTIAL`: dictionary/Q&A Hangul readings still need independent broad-IPA adjudication; Ukrainian targets remain provisional.
- `BLOCKED / rights`: page-level reuse marks not checked.
- `BLOCKED_SPECIALIST_ADJUDICATION`: independent IPA and Ukrainian-target review remain outstanding.
