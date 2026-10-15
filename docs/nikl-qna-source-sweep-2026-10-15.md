# Supplemental NIKL Q&A source pass — 2026-10-15

## Scope

This pass adds four additional official National Institute of Korean Language (NIKL) Q&A references (S036–S039) and consolidates the new S029–S039 leads into a machine-readable control inventory. The new references are supplementary interpretation, not replacements for the Standard Pronunciation Rules or dictionary entries.

## New source-derived constraints

- **§29 insertion is not automatic.** Keep positive controls such as 솜이불 and 꽃잎 separate from negative controls such as 값있다, 곧이어, 먹이, 얼룩이, 소심이, 식목일, 송별연, and 등용문.
- **Permitted variants must remain variants.** 검열 has [검ː녈]/[거ː멸]; 금융 has [금늉]/[그뮹]. Do not force one spelling-to-pronunciation mapping.
- **Phrase boundaries require prosodic context.** NIKL confirms examples such as 무슨 일, 끝난 일, 않은 일, 할 일, 잘 입다, and 옷 입다 when pronounced as one unit. A pause or separate prosodic phrasing must not be silently erased.
- **Do not overgeneralize complex-coda derivations.** The 값 이야기 / 닭 이야기 question highlights interaction of representative-coda handling, insertion, and nasalization. The NIKL answer does not justify a universal implementation of a single theoretical ordering for all items.
- **Keep §§19 and 20 distinct.** NIKL differentiates the environment after ㅁ/ㅇ from ㄴ+ㄹ, where liquidization and ㄹ nasalization may compete.
- **Separate output layers.** The Korean surface spelling in brackets is not IPA. Any project IPA and Ukrainian approximation require their own declared conventions and regression checks.

## New files

- `tests/fixtures/nikl-qna-supplemental-controls-2026-10-15.json`: 37 compact controls with source IDs, URLs, rule links, and a deliberate distinction between directly stated surface forms and policy/context-only controls.
- `tests/nikl-qna-supplemental-controls-2026-10-15.test.mjs`: validates source-register completeness, provenance, rule links, and the fact that controls without direct surface evidence do not fabricate a gold form.
- `tests/fixtures/adversarial-corpora/`: expanded from 5 to 7 stress TXT inputs for each of the 30 existing rule families. The full suite now contains 225 TXT inputs (15 broad + 210 rule-family files).

## Limits

This is not a claim that every possible Korean word or morphology is covered. The TXT files are stress inputs, not gold transcriptions. Direct source forms should be promoted into engine-level IPA tests only after their project IPA has been checked independently; rule-derived and context-sensitive cases remain explicitly non-gold until then.


### Second expansion: coda and interaction exceptions

The supplemental inventory now contains 37 controls. Six additional NIKL Q&A sources (S040–S045) cover the formal-morpheme analysis of 굳이, the distinction between nominal and verbal-stem ㄺ before ㄱ, the unprescribed status of 몇 리, ㅎ deletion before vowel-initial endings, and the interaction in 팥입니다. Eight source-attested lexical records were added: four exact lexical controls for morphology-sensitive noun forms (암탉과, 수탉과, 장닭과, 칡과) and four surface-only controls (팥입니다, 먹이, 얼룩이, 소심이). The surface-only forms pass through the general rule engine: 팥입니다 exercises §17 palatalization plus §18 nasal assimilation, while the three suffixal -이 forms exercise liaison without overapplying §29 ㄴ insertion. Their Ukrainian targets remain provisional; the Korean surface forms are source-attested.
