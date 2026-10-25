# Primary-source adjudication: 넓죽하다 and 읽고 — 2026-10-25

## Purpose and scope

This record adjudicates the two Korean surface-pronunciation disagreements previously listed as `넓죽하다` and `읽고`. It records what the National Institute of Korean Language (NIKL, 국립국어원) primary sources establish, what they do not establish, and the engineering action justified by that evidence.

**Boundary:** NIKL's bracketed Korean pronunciation notation is source evidence for the Korean standard surface form. It is not IPA gold, and it is not Ukrainian-transcription gold. Do not convert these source strings into IPA by silently treating Hangul phonetic notation as IPA.

## Case A — 넓죽하다

**Status:** `SOURCE_FOUND_RULE_AND_EXACT_EXAMPLE`; broad IPA adjudication and Ukrainian target adjudication remain pending.

Primary source: NIKL, Online 가나다, “넋 잃은” (answer dated 2024-12-07):  
https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=307219

The answer reproduces Standard Pronunciation Rule 10 and explicitly gives `넓-죽하다[넙쭈카다]` and `넓-둥글다[넙뚱글다]`. Its explanation states that the ㄼ cluster in listed lexical compounds is realized with [ㅂ], unlike the default [ㄹ] outcome in forms such as `넓다[널따]`. A second NIKL answer, dated 2025-07-03, independently states `넓죽한[넙쭈칸]` and refers to Rule 10:  
https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=261&pageIndex=1&qna_seq=317348

**Adjudication:** use the NIKL-documented surface spelling `넙쭈카다` for the infinitive citation form `넓죽하다` in source-grounded Korean surface-form regression checks. Do not generalize the exception to every word containing 넓; the rule is lexically scoped to the cited forms. Do not infer an IPA string or Ukrainian spelling from the Hangul notation alone.

## Case B — 읽고

**Status:** `SOURCE_FOUND_EXACT_FORM_AND_RULE_EXPLANATION`; broad IPA adjudication and Ukrainian target adjudication remain pending.

Primary source: NIKL, Online 가나다, “읽고 발음” (answer dated 2026-04-16):  
https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=329463

The answer explicitly cites `읽고[일꼬]` and explains the relevant interpretation: the fortition is not best described as being triggered by a surviving coda ㄹ. Rather, fortition occurs before the ㄱ in the ㄺ cluster is deleted, applying to the following ㄱ-initial grammatical ending; the answer relates this to Rule 23's fortition after ㄱ, ㄷ, ㅂ. The explanation cautions against deriving the process simply from a preceding [ㄹ].

**Adjudication:** use `일꼬` as the official Korean surface-form expectation for this exact form in regression checks. Preserve the ordering/analysis explanation as source-specific evidence; do not promote a broad IPA transcription or Ukrainian target to gold without the corresponding independent adjudication.

## Case C — 많아서 (R003 exact-form source)

**Status:** `SOURCE_FOUND_EXACT_FORM_AND_RULE_ENVIRONMENT`; broad IPA and Ukrainian target adjudication remain pending.

Primary source: NIKL Online 가나다, answer dated 2026-08-06, qna_seq=334550:  
https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=57&pageIndex=1&qna_seq=334550

The answer explicitly lists `많아서[마ː나서]` as an inflected form of `많다`, explaining that the long vowel is retained in this exceptional paradigm. This is direct surface-form evidence for the exact input and the R003 environment `많>아` (ㅎ deletion with ㄴ retained and resyllabification).

**Engineering action:** the strict Python and browser engines now license only the exact form `많아서` and pair `많>아`. This does not authorize generic R003 application to other `많+` sequences, and the source's Hangul notation is not broad-IPA gold or Ukrainian target gold.

## Engineering and benchmark consequences

1. The two official sources resolve the *normative Hangul surface-form question* for these exact forms. They do not, by themselves, prove that any particular G2P implementation is globally superior.
2. Add/retain exact-form tests at the Korean surface-form layer. Tests must cite the source URL and distinguish source pronunciation from engine output.
3. Keep raw upstream G2P outputs available for differential diagnostics. A correction layer must be narrow, explicit, provenance-carrying and tested against the raw engine fixture; it must not rewrite the upstream fixture.
4. Do not use these two examples as evidence of general rule accuracy or as independent IPA/target gold.
5. Any benchmark report must state which layer is scored: Hangul surface form, IPA, or Ukrainian practical orthography. A pass at one layer is not a pass at the others.

## Remaining acceptance gates

| Gate | Status | Acceptance criterion |
|---|---|---|
| Exact Korean surface forms | `DONE_VERIFIED_SOURCE` | Regression expectations are `넓죽하다 → 넙쭈카다` and `읽고 → 일꼬`, each linked to NIKL primary evidence |
| Native IPA for these forms | `BLOCKED_SPECIALIST_ADJUDICATION` | Broad IPA and any valid variants reviewed independently with a stated transcription convention |
| Ukrainian practical output | `BLOCKED_INDEPENDENT_TARGET_GOLD` | Independent Ukrainian target annotation and scoring protocol, separate from model-selected mappings |
| Original 24-form holdout provenance | `BLOCKED_MISSING_ORIGINAL` | Original input manifest/membership/order established by a verifiable artifact or historical tracked source |
| Live official NIKL inventory | `BLOCKED_EXTERNAL_ACCESS` | Workflow actually retrieves the official live inventory, validates it, records retrieval metadata, and passes; a skipped step is not a pass |
| Target accuracy | `BLOCKED_NO_INDEPENDENT_GOLD` | Independent target gold, documented annotation protocol, and reproducible exact-match/CER results |

## Evidence references

- NIKL Online 가나다, “넋 잃은”, answer 2024-12-07: Rule 10 examples and explanation for 넓죽하다/넓둥글다.
- NIKL Online 가나다, “넓다와 넓죽하다 발음”, answer 2025-12-10: contextual explanation of the ㄼ exception.
- NIKL Online 가나다, “읽고 발음”, answer 2026-04-16: exact `읽고[일꼬]` and Rule 25/Rule 23 explanation.

This is a source adjudication note, not a claim that all implementation, IPA, Ukrainian output, holdout provenance, or release gates are complete.
