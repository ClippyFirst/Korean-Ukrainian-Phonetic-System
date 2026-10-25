# Primary-source adjudication: Korean surface-form cases — 2026-10-25

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

## Case D — 없음

**Status:** `DIRECT_OFFICIAL_ATTESTATION` for the Korean surface reading; IPA and Ukrainian target remain separate.

Primary sources:
- NIKL 상담 사례 모음, “'없음', '없슴'의 표기” (FAQ 8391): https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=8391
- NIKL Online Q&A 335008 (2026-08-24) also explicitly lists `없음[업씀]`: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=335008

The FAQ identifies `없음` as the nominalized form of `없다` plus `-음` and gives the reading `[업씀]`. The exact-form R002 license is restricted to `없>음` in `없음`; it is not a general rule for every `ㅄ + vowel` sequence.

## Case E — 있었 (stem + past ending)

**Status:** `SOURCE_FOUND_RULE_ENVIRONMENT`; broad IPA and Ukrainian target adjudication remain separate.

Primary source: NIKL Online Q&A, “받침 'ㅆ'의 발음” (answer dated 2026-02-02), qna_seq=326978: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=326978

The answer explains that `있-` combines with the vowel-initial past ending `-었-`, and derives `있었다[이썯따]`. It therefore supports the internal boundary `있>었`; the source discusses the inflected word `있었다`, not a standalone token consisting only of `있었`. The engine license is exact-form scoped and must not be described as a direct quote for a standalone `있었`.

## Case F — 멋있어 (surface variants)

**Status:** `DIRECT_OFFICIAL_ATTESTATION_WITH_VARIANTS`; unique IPA target remains unadjudicated.

Primary source: NIKL Online Q&A, “멋있어, 멋있다 발음” (answer dated 2024-11-18), qna_seq=306166: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=306166

The answer accepts both `멋있어[머디써]` and `멋있어[머시써]`. The engine's exact R002 license addresses only the internal `있>어` ending boundary. It does not adjudicate the alternate `멋>있` lexicalized boundary or establish a single broad IPA or Ukrainian spelling. Keep both official surface variants visible in research records.

## Form-scoped rule derivations — additional abstention batch

The new exact-form licenses for `같아서`, `되었어`, `찢었으면`, `했었음`, `붙어야`, `벗어날`, `찾아`, `싶어서`, `없으니까`, `없으니깐`, `군대보냈어야`, `이런삶은`, `끝내고싶어유유유유`, `이빨닦아야지`, `안늙었는데`, `쌓아서`, `쳐넣어야`, `애새끼낳으면`, `잃었노`, `않았지만`, `개많음`, `좋은데`, `죽었잖아`, and `개좆망했잖아` are **form-scoped rule derivations**, not a claim that every complete input is directly listed by NIKL. They apply §§12(4), 13–14 only at the named pair. The R002 license for 웃어넘기겟지만 applies only to the internal 웃>어 boundary in the compound verb; it does not normalize the later spelling 겟. The source-backed implementation remains strict for unlisted forms and preserves independent IPA/Ukrainian acceptance gates.

## Case G — 긁히다 / 긁혔 (complex ㄺ + ㅎ-suffix environment)

**Status:** `DIRECT_DICTIONARY_SURFACE_AND_MORPHOLOGY_EVIDENCE` for the rule environment; exact full phrase is rule-derived.

Primary source: Korean Basic Dictionary, entry `긁히다`, ParaWordNo=33493: https://krdict.korean.go.kr/mon/dicSearch/SearchView?ParaWordNo=33493&nation=mon

The official dictionary gives `긁히다[글키다]`, `긁히어[글키어/글키여]`, and contracted `긁혀[글켜]`. This directly supports the ㄺ + `-히-` environment and the retained ㄹ + aspirated ㅋ surface pattern. The unresolved benchmark token `긁혔다는거지` is not itself quoted by the dictionary; the engine licenses only its internal `긁>혔` pair, leaving the rest of the compact phrase outside the source claim. This is a scoped rule derivation, not broad IPA or Ukrainian target gold.

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


## Case H — 같이 [가치] and exact-form recovery batch (2026-10-25)

**Status:** DIRECT_OFFICIAL_SURFACE_ATTESTATION for 같이 [가치]; exact compact inputs remain form-scoped derivations, not directly quoted source entries.

Primary source: NIKL Online Q&A, qna_seq=327454, answered 2026-02-19: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=327454

The answer explicitly identifies the standard pronunciation of 같이 as [가치] under Standard Pronunciation Rule 17. The Python and browser engines now license only the exact 같>이 pair in 많을거같이 and 개같이못하고; they do not enable productive palatalization for other ㄷ/ㅌ + ㅣ strings.

The same batch adds narrowly scoped derivations for 좃같아서 (같>아), 없을듯 (없>을), 칡칡이 (칡>이), 괜찮아보이는디 (찮>아), 많을거같이 (많>을), 많이본 (많>이), 알잖아아침에 (잖>아), 좋아보인다고 and 좋아해주는 (좋>아). These are exact full-form + adjacent-pair applications of existing NIKL rules, not claims that NIKL lists every noisy full token. No spelling normalization, inferred whitespace insertion, IPA gold, or Ukrainian target gold is introduced. 쫒아내면, 많앗구나유유유, 무서웟어 and 삶의 remain unresolved.


## Case I — 못잃어: phrase-level ㄴ-insertion evidence, not a production license

The National Institute of Korean Language's 2022 language-use survey discusses ㄴ-insertion responses for both “못 잇는다” and “못 잃어”. The indexed excerpt's detailed table is explicitly titled for “못 잇는다”; its reported percentages must not be transferred to “못 잃어”. Source: https://korean.go.kr/common/download.do%3Bfront%3DCCA5B0393BE746038C8D8FD7E20DAACF?c_file_name=f3b36689-d64e-457f-8a64-e79302bcb55c.pdf&file_path=reportData&o_file_name=2022%EB%85%84+%EA%B5%AD%EC%96%B4+%EC%82%AC%EC%9A%A9+%EC%8B%A4%ED%83%9C+%EC%A1%B0%EC%82%AC+%EA%B2%B0%EA%B3%BC%EB%B3%B4%EA%B3%A0%EC%84%9C.pdf

This supports treating the compact phrase as potentially variable, not selecting one deterministic surface IPA. The source does not supply a verified IPA variant set for the exact input, so `못잃어` remains withheld until the engine can represent the phrase boundary and its alternatives explicitly. No single survey variant is promoted to normative pronunciation or Ukrainian target gold.
