# Adversarial morphology regression — 2026-10-10

## Scope

This change addresses the unresolved output exposed by the fourth adversarial Korean text corpus. It adds exact, sourced-pattern lexical records for morphology-sensitive forms instead of weakening the engine's safety guard or guessing a morpheme boundary from Hangul adjacency.

The corpus fixture corrects the accidental mixed-script typo `안내员은` to `안내원은`. The Chinese character is not part of the Korean test.

## Added lexical records

| Input | Standard surface form | Main issue addressed | Evidence |
|---|---|---|---|
| `있었다` | `이썯따` [이썯따] | `있-` + vowel-initial `-었-`, then coda neutralization before `-다` | NIKL Online Q&A 326978: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=326978 |
| `있었고` | `이썯꼬` [이썯꼬] | Same past-tense morphology, followed by fortition before `ㄱ` | NIKL explanation of `있었다` above plus Standard Pronunciation Rules §§9, 13 and 23 |
| `웃었고` | `우섣꼬` [우섣꼬] | `ㅅ` liaison in `웃- + -었-`, followed by coda neutralization and fortition | NIKL Standard Pronunciation Rules: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002 |
| `넓어졌다는` | `널버젇따는` [널버젇따는] | `ㄼ` before the vowel-initial ending, then `ㅆ` neutralization and fortition in `졌다` | NIKL Standard Pronunciation Rules §§9–10, 13 and 23 |
| `삯일을` | `상니를` [상니를] | Official `삯일` [상닐] with `ㄴ)-insertion/nasal assimilation, plus liaison before the particle `을` | NIKL Standard Pronunciation Rules §29: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002 |

The five Ukrainian target strings are **provisional project renderings**, not forms certified by the Korean source. The IPA is recorded separately so future target-layer testing can change Ukrainian choices without rewriting the Korean analysis.

## Why exact entries are used

The browser engine intentionally does not infer a complete morphological parse from adjacent Hangul syllables. The earlier guard correctly refused to guess where formal endings and substantive morphemes differ, but it also withheld readings for familiar, attested forms in this test. Exact lexical entries resolve only the listed forms and retain that evidence boundary; they do not license a productive rule for every unknown sequence.

## Regression coverage

- Exact input, Korean surface form, IPA, Ukrainian target and provisional status are asserted for all five records.
- The corrected full adversarial paragraph corpus is checked for unresolved placeholders and non-empty issue reports.
- The corpus explicitly guards against reintroducing the accidental Chinese character in `안내원은`.

A passing regression suite establishes implementation consistency for these fixtures. It does not replace independent native-Korean pronunciation review or Ukrainian-reader evaluation of the target layer.
