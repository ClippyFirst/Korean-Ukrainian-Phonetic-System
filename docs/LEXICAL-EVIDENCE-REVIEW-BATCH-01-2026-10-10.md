# Lexical evidence review — batch 01 (2026-10-10)

## Scope and method

This is the first source-level review batch from the lexical evidence traceability queue. It reviews ten records in the order they appear in the queue. The classification distinguishes (a) a source that explicitly gives the exact lexical form, (b) a source that establishes a rule or closely related morphophonological pattern but does not itself attest the exact form, and (c) a source URL whose page does not substantiate the row as written.

**Important:** official Korean surface readings are the normative target. The Ukrainian syllabification and broad IPA in the project are separate model representations and are not made official by this review.

## Reviewed records

| Input | Source review | Article mapping / action |
|---|---|---|
| `값없다` → `[가법따]` | **Exact form and derivation confirmed.** NIKL answer explicitly says §14 does not apply because 없- is a substantive morpheme; §15 applies, with §10 cluster simplification first, yielding [가법따]. | Map to **§§10, 15**. The final fortis ㄸ is present in the surface form; retain §23 as a separate rule explanation only if the official text/analysis explicitly attributes this step. Do not imply the cited Q&A itself explained every step. Source: https://m.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=330620 |
| `의견란` → `[의ː견난]` | **Exact form confirmed as an exception.** NIKL FAQ explicitly gives 의견란[의ː견난] while discussing lexical exceptions to general liquid assimilation; it also gives the long vowel. | Map to **§20 exception** and preserve the lexical length evidence in the IPA. Do not generalize ㄹ→ㄴ to all ㄹ contexts. Source: https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=8505 |
| `읽고` → `[일꼬]` | **Exact form explicitly cited in the answer.** NIKL states 용언 어간-final ㄺ before ㄱ: ㄱ is deleted and ㄹ remains, citing 읽고[일꼬]. | Map to **§11 exception** (verb stem ㄺ before ㄱ); the following fortition is separately governed by **§23**. Source: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=334294 |
| `읽다` → `[익따]` | **Rule-family evidence, not an exact attestation on the cited page.** The page explains the general-vs-verb-stem exception for ㄺ and gives related examples, but the visible answer does not explicitly attest 읽다[익따]. | Candidate mapping **§11 + §23**, but mark the exact lexical surface as needing a source that explicitly attests 읽다 or document it as a transparent rule-derived regression rather than an exact Q&A citation. |
| `읽어` → `[일거]` | **Source mismatch detected.** The linked Q&A (qna_seq=327808) is about 닭을 and explains ㄺ liaison before a vowel-initial formal morpheme; it does not attest 읽어 on the inspected page. The rule analogy is plausible but the current URL is not item-specific evidence. | Likely rule family **§14**, but **replace or supplement the source URL** with an official entry that actually supports 읽어; until then, label the evidence as indirect. Do not present this row as directly verified. |
| `읽는` → `[잉는]` | **Related pattern confirmed, exact word not directly attested on the inspected page.** The linked answer explicitly analyzes 밝는: ㄺ first simplifies to [ㄱ] before ㄴ, then §18 nasal assimilation produces [방는]. This establishes the mechanism but not the exact word 읽는. | Candidate mapping **§11 + §18**. Keep exact-word evidence status distinct from rule-family support. Source: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=334294 |
| `읽지` → `[익찌]` | **Exact form not found in the cited Q&A's visible answer.** The row's explanation is compatible with coda simplification and fortition, but the URL does not directly establish this specific reading. | Candidate mapping **§11 + §23**; seek an exact official attestation or mark as rule-derived regression rather than source-quoted lexical evidence. |
| `맑게` → `[말께]` | **Exact form explicitly cited.** NIKL names 맑게[말께] as an example of the verb-stem ㄺ-before-ㄱ exception. | Map to **§11 exception + §23**; keep the exception narrowly scoped to licensed verb-stem forms. Source: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=334294 |
| `맑고` → `[말꼬]` | **Rule-family evidence, exact form not explicitly cited in the visible answer.** The source names the related 맑게/묽게/밝게 pattern and cites 읽고; it does not explicitly give 맑고 in the inspected answer. | Candidate mapping **§11 exception + §23**. Keep the reading as a project regression unless an exact official source is added. |
| `맑다` → `[막따]` | **Rule-family evidence, exact form not explicitly attested in the inspected answer.** The source explains that outside the verb-stem ㄺ-before-ㄱ exception, the ㄹ component is deleted; it does not itself show 맑다[막따] in the inspected passage. | Candidate mapping **§11 + §23**; seek exact lexical evidence or label it as a rule-derived test. |

## Source-level finding

The current queue is not merely missing article numbers. At least one inspected record, `읽어`, has a **source URL mismatch**: the URL points to an official answer about `닭을`, not `읽어`. Several other rows point to a relevant official explanation but use it as if it were exact lexical evidence. This is a provenance problem, not by itself proof that their Korean surface readings are wrong.

## Recommended data policy

1. Keep the current `source_url` if it genuinely supports the rule family, but do not describe the exact form as directly attested unless it appears in the source.
2. When a source does not attest the exact word, either add a second explicit rule citation in `rule_notes` or classify the row as a rule-derived regression / indirect official evidence.
3. Correct wrong URLs only after finding a source that supports the exact word; never replace them with a merely similar example.
4. Keep Korean surface-form confidence independent from Ukrainian-target confidence.
5. Continue in small, auditable batches. Do not auto-assign articles from Korean process keywords.

## Sources inspected

- NIKL Q&A, 값없다: https://m.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=330620
- NIKL FAQ, 의견란 / 상견례 and liquid-assimilation exception: https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=8505
- NIKL Q&A, ㄺ + ㄱ and 밝는: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=334294
- NIKL Q&A, 닭을 and vowel-initial formal morphemes: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=327808
- NIKL official pronunciation rules: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
