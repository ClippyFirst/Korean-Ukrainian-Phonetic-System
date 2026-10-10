# Lexical evidence review — batch 02 (2026-10-10)

## Scope

This batch reviews the next ten records in the original traceability queue. It focuses on whether the current URL actually supports the row, whether it states the exact Korean surface reading, and whether the article mapping is from *표준 발음법* rather than an unrelated rule set. No pronunciation output is changed by this documentation-only review.

## Reviewed records

| Input | Source review | Article mapping / action |
|---|---|---|
| `밝기` → `[발끼]` | **Source URL mismatch.** The linked NIKL Q&A (qna_seq=313399) is a discussion of 구개음화 and 굳이, not 밝기. It does not attest 밝기[발끼]. | The likely rule family is **§11** (verb-stem ㄺ before ㄱ, including the documented derivative exception) plus **§23** fortition, but replace/supplement the current URL with evidence that actually supports 밝기. Until then this is not directly sourced by the current row URL. |
| `닭고기` → `[닥꼬기]` | **Exact form confirmed in the linked answer.** The Q&A about 닭을 contrasts liaison before vowel-initial formal morphemes with coda simplification before consonants and explicitly gives 닭고기[닥꼬기]. | Map to **§11** (ㄺ cluster simplification in a noun before a consonant) and **§23** (fortition of following ㄱ). The source directly supports the exact reading. Source: https://m.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=327808 |
| `꽃잎` → `[꼰닙]` | **Source URL mismatch.** The linked Q&A (qna_seq=307219) is titled 넋 잃은 and discusses phrase-level pronunciation/rules; it does not directly attest 꽃잎[꼰닙]. | Candidate mapping **§29** (n-insertion in compounds) followed by **§18** (nasal assimilation), but the current URL is not evidence for this exact compound. Find a source that explicitly discusses 꽃잎 or cite the official rule text separately and mark the lexical form as rule-derived. |
| `밭이` → `[바치]` | **Exact form confirmed by official NIKL FAQ.** The FAQ directly states 밭이[바치]. It describes palatalization of ㅌ before the particle 이. | The phonological mapping is **§17** (palatalization), with the liaison interaction discussed under **§13**. Caution: the FAQ's prose labels its cited provisions as 한글맞춤법 articles; do not copy that label as if it were the article numbering of *표준 발음법*. Cross-map independently to the official pronunciation rule. Source: https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5748 |
| `밭을` → `[바틀]` | **Exact form confirmed by official NIKL FAQ.** The FAQ directly states 밭을[바틀], a straightforward coda liaison case before a vowel-initial particle. | Map to **§13** of *표준 발음법*. As above, distinguish the FAQ's own wording about 한글맞춤법 from the numbering of the Standard Pronunciation Rules. Source: https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5748 |
| `넓네` → `[널레]` | **Exact form and article mapping confirmed.** The NIKL answer explicitly gives 넓네[널레] and points to **§10** (ㄼ coda realization) and **§20 붙임** (liquid assimilation after ㅀ/ㄾ contexts, with the provided analogy). | Map to **§10 + §20**. The source is exact-word evidence. Source: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=307237 |
| `없다` → `[업ː따]` | **Exact form appears in the official rule excerpt on the linked page.** Although the Q&A title is 넓네, its reproduced §10 list explicitly includes 없다[업ː따]. | Map to **§10** for ㅄ simplification. The tense ㄸ in the surface form is consistent with **§23**; keep that as a separate rule mapping rather than implying the Q&A's main answer analyzes all steps. Preserve vowel length in IPA. Source: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=307237 |
| `없는` → `[엄ː는]` | **Exact form confirmed in the official §18 excerpt.** The linked NIKL answer reproduces §18 and explicitly lists 없는[엄ː는]. | Map to **§10 + §18**: simplify ㅄ to the representative [ㅂ], then nasalize before ㄴ. Preserve the source's long-vowel mark in IPA. Source: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=311009 |
| `국물` → `[궁물]` | **Exact form confirmed in the official §18 excerpt.** The linked answer explicitly lists 국물[궁물] among the examples of nasal assimilation. | Map to **§18**. The current URL is a relevant source even though the page title is about the pronunciation of 빛. Source: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=311009 |
| `떡볶이` → `[떡뽀끼]` | **Source URL mismatch.** The linked Q&A (qna_seq=313397) discusses 굳이 and §17 palatalization, not 떡볶이. It does not support the row's explanation about -이 or the surface [떡뽀끼]. | Do not treat the current URL as lexical evidence. Add a source that explicitly attests 떡볶이[떡뽀끼], or retain the form as a rule/corpus regression with evidence status clearly labelled. Likely relevant mechanisms include the lexicalized pronunciation and fortition, but do not assign article numbers from the note alone. |

## Findings from this batch

- **Four clear URL mismatches:** `밝기`, `꽃잎`, `떡볶이`, and `옷이` is the next queue item and shares the same unrelated `qna_seq=313397` URL as `떡볶이`; it must be reviewed in the next batch.
- **Several source URLs are relevant but not necessarily item-specific.** The `없다`, `없는`, and `국물` rows are supported because the linked pages reproduce the official rules and explicitly list those forms, even when the page title differs.
- **Rule-set names matter.** A source can state the correct surface form while naming a provision from a different regulation; article numbering must be normalized to *표준 발음법* rather than copied mechanically.

## Sources inspected

- NIKL Q&A, 닭을 (also explicitly gives 닭고기[닥꼬기]): https://m.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=327808
- NIKL Q&A, 넋 잃은: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=307219
- NIKL FAQ, 밭을 / 밭이: https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5748
- NIKL Q&A, 넓네 and §10 / §20 examples: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=307237
- NIKL Q&A, 빛 and the reproduced §13 / §18 lists: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=311009
- NIKL Q&A, 굳이: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=313397
- NIKL official Standard Pronunciation Rules: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
