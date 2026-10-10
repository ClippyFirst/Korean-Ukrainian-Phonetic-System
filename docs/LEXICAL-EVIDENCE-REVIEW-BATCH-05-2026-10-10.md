# Lexical evidence review — batch 05 (2026-10-10)

## Scope

This batch reviews the next ten records from the audit queue. All ten currently link to the general *표준 발음법* page, not to an item-specific lexical source. Several surface forms are plausible rule-derived examples, but the generic URL must not be described as an exact attestation of the complete word. Article mappings below are intentionally conservative: where the note itself does not cite a numbered article, the report does not invent one.

## Reviewed records

| Input | Evidence classification | Review outcome |
|---|---|---|
| `꽃밭에` → `[꼳빠테]` | Compositional form: 꽃밭 + 에. The generic rules page is relevant background but does not, by itself, attest this full inflected form. | Preserve as a rule-derived regression pending an exact official lexical attestation. The trace must keep coda neutralization/fortition within 꽃밭 distinct from liaison of final ㅌ before 에. Do not compress the entire derivation into one rule label. |
| `있던` → `[읻떤]` | Compositional form: 있- + -던. The linked page is general rule text, not an exact citation for this conjugated form. | Preserve as a morphology-sensitive regression. The note's explanation combines ㅆ coda neutralization and fortition of ㄷ; add an article-level trace only after confirming the relevant standard-rule clauses and the morphology boundary. |
| `학생의` → `[학쌩의]` | The source URL does not attest this complete phrase. The record note itself mentions the genitive particle's permitted [에] variant, so a single output is not a complete representation of the normative variant space. | Treat as a **variant-sensitive** test: distinguish the lexical pronunciation of 학생 and the particle 의. Verify the project's variant policy against the official §5 provisions before claiming this row exhausts accepted readings. |
| `책을` → `[채글]` | Compositional form: 책 + 을; the generic rule page does not directly quote the complete phrase. | Keep as a rule-derived liaison regression. The output should be tested at the Korean surface layer separately from its Ukrainian approximation. |
| `연구원은` → `[연구워는]` | Compositional form: 연구원 + 은; the source URL does not directly attest the full form. | Keep as a rule-derived regression. Ensure the analysis treats 원 as a syllable ending in ㄴ followed by the particle 은, rather than incorrectly applying a cross-boundary rewrite to the whole syllable. |
| `발음과` → `[바름과]` | The note explicitly gives a derived surface form for 발음 and combines it with 과; the generic rules page is not an exact citation for the full sequence. | Keep as a rule-derived regression. The expected [바름] base should be independently checked against the Korean surface model; do not make this row an IPA authority for the whole phrase. |
| `실제` → `[실쩨]` | The current source URL does not directly attest the exact word 실제[실쩨], but the general official rule page does support the relevant rule family. The old note (“ㅅ의 i 환경”) gave the wrong/underspecified conditioning. | **Corrected in the CSV:** actual is a Sino-Korean word (實際), and §26 of *표준 발음법* specifies fortition of ㄷ, ㅅ, ㅈ after ㄹ in Sino-Korean words; the ㄹ+ㅈ sequence accounts for [쩨]. The exact word still needs an item-specific dictionary or NIKL citation, so the generic rule URL is not represented as direct lexical attestation. |
| `발음의` → `[바르미]` | The note explicitly selects the [이] realization of 의 for this model path, while the source URL is generic and does not attest the whole form. The particle's pronunciation is variant-sensitive under the standard. | Keep the chosen [이] path explicitly labelled as one accepted/modelled variant, not the only possible standard reading. Add tests for the particle variant policy separately from liaison of ㅁ. |
| `차이를` → `[차이를]` | Unchanged surface spelling; no special Korean pronunciation change is claimed. The general rules URL is not a lexical attestation for 차이를. | Classify as a **baseline control / unchanged surface form**. Do not assign a numbered article just to populate metadata. Review Ukrainian mapping separately. |
| `자세히` → `[자세히]` | Unchanged Korean spelling in the stored surface form; the current URL is general normative background, not an exact lexical citation. The note's Ukrainian approximation of ㅎ is a separate design choice. | Classify as a **baseline control / unchanged surface form**. Keep the Korean pronunciation representation distinct from the Ukrainian approximation for ㅎ; do not treat the latter as a Korean rule. |

## Findings

1. The ten records all use the generic official rules URL. This is acceptable as background, but not as proof that the source explicitly contains each complete form.
2. `학생의` and `발음의` need explicit variant handling because the pronunciation of the particle 의 is not represented by a single universally mandatory output in all contexts.
3. `실제` exposed a substantive note error. The correct rule family is §26: in Sino-Korean words, ㄷ, ㅅ, ㅈ after ㄹ are fortis. The surface [실쩨] is consistent with the ㄹ+ㅈ environment in 實際. The CSV note is corrected to §26; an exact lexical source for 실제 itself remains a separate provenance task.
4. `차이를` and `자세히` should function as baseline controls. Their role is to protect against unnecessary rewriting, not to claim a special lexical rule.
5. This batch does not validate the Ukrainian targets or the broad IPA. Those require a separate layer-by-layer review.

## Primary source

NIKL, *표준 발음법*: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
