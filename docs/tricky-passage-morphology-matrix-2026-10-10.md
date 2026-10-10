# Tricky passage: morphology-sensitive rule matrix (2026-10-10)

## Why this pass exists

Repeated unresolved spans such as `같아지는`, `닭고기와`, `같이`, and `밝히는` are not four copies of one bug. They sit at different rule boundaries. This audit explicitly separates the rule paths instead of treating all adjacent Hangul blocks as the same phonological environment.

## Cases and evidence status

| Form in running text | Expected Korean surface form | Rule path | Evidence status |
|---|---|---|---|
| 같아지는 | 가타지는 | §13: ㅌ links into vowel-initial formal ending -아; not §15 | Rule-derived from the official Standard Pronunciation Rules. The cited page is the governing rule source, not an exact-word attestation. |
| 같았다 | 가탇따 | §13 liaison, §9 coda neutralization of ㅆ, §23 fortition of ㄷ | Rule-derived from the official Standard Pronunciation Rules. The exact conjugated form is not claimed to be quoted verbatim from NIKL. |
| 밝히는 | 발키는 | §12 붙임 1: licensed 용언 어간 + suffix pattern preserves the ㄹ of ㄺ and combines ㄱ+ㅎ to [ㅋ]; then -는 | NIKL Q&A directly explains 밝히다 [발키다] and the morphologically licensed pattern: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=326660. The inflected form is derived from that attested citation form. |
| 닭고기와 | 닥꼬기와 | §11 noun ㄺ simplification + §23 fortition; particle 와 attaches after vowel-final 기 | NIKL directly attests 닭고기 [닥꼬기]: https://m.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=327808. The phrase with 와 is compositional, not independently quoted. |
| 같이 | 가치 | §17 palatalization at a licensed formal-morpheme boundary | NIKL directly confirms [가치]: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=313399. |

The distinction in evidence wording is intentional: a rule-derived inflection is not described as an exact lexical citation. Ukrainian targets and broad IPA remain project-level representations, not official Ukrainian standards or narrow acoustic measurements.

## Regression gates

- Every exact form has a regression row and a non-placeholder expected output.
- A short running paragraph checks that these forms remain resolved in context.
- The test checks context invariance by comparing the paragraph-level result to each isolated form.
- Generic mode is expected to fail closed when the morphology/evidence layer is absent; the test does not allow a lexical rule to leak into generic inference.
- The formal-morpheme path in §13 is contrasted with a known §15 substantive-morpheme example (`헛웃음`), so the two are not treated as interchangeable.
- All new Ukrainian targets are marked `provisional`.

## Limits

This is a focused matrix for the forms exposed by the new passage, not proof that every inflection of 같다 or every ㄺ+ㅎ sequence is covered. The next structural improvement is productive morphological licensing (with an explicit boundary/evidence model), not indiscriminately adding every imaginable surface form to the lexicon.
