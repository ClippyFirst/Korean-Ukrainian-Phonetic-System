# Rule-mapping follow-up — batch 11 (2026-10-10)

## Purpose

This follow-up converts seven previously reviewed, high-confidence rule-derived records from unnumbered process notes into explicit *표준 발음법* article mappings. It does not claim that a generic rules URL directly attests the full lexical form. Where the exact form is not present in the source, that limitation is retained in `rule_notes`.

## Data changes

| Input | Added mapping | Evidence status |
|---|---|---|
| `밟으며` | §14 | Rule-derived form; ㄼ liaison before `-으며` (the special consonant-environment exception in §10 is not applied to this vowel-initial ending). |
| `낡은` | §14 | Rule-derived form; ㄺ before vowel-initial ending. |
| `놓인` | §12 | Rule-derived ㅎ deletion before a vowel-initial formal morpheme; exact-word attestation still not located. |
| `밟았습니다` | §§14, 18, 23 | Compositional form combining ㄼ liaison before `-았-` and the `-습니다` sequence; not a single-source lexical citation. |
| `맑은` | §14 | Rule-derived form; ㄺ before vowel-initial ending. |
| `있었고` | §§9, 13, 23 | Rule-family evidence only. The linked NIKL Q&A directly discusses `있었다` and `있습니다`, not exact `있었고`. |
| `웃었고` | §§9, 13, 23 | Compositional form: ㅅ liaison, ㅆ coda neutralization, and fortition before ㄱ. |
| `넓어졌다는` | **Not mapped in this batch** | Deliberately left unresolved: the complete inflectional derivation and article scope need independent verification; do not guess a blanket list. |

## Guardrails

- Article mappings now live in the lexical row itself for seven rows, so the traceability filter no longer treats those rows as having no rule mapping.
- `넓어졌다는` remains outside the resolved set because its complete derivation has not been independently verified.
- The update does **not** upgrade indirect evidence into exact-word attestation.
- It does not modify the engine's pronunciation outputs, IPA syllabification, or Ukrainian target strings.
- The eight reviewed Korean surface forms remain candidates for a later independent phonetic/IPA review; this change is about explicit rule traceability, not proof that every transcription layer is perfect.

## Primary sources

- NIKL, *표준 발음법*: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
- NIKL online Q&A on the pronunciation of `있었다` and `있습니다` (supports related rule patterns, not exact `있었고`): https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=326978
