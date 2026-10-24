# Human review of NIKL Standard Pronunciation Rules §§1–30

**Review date:** 2026-10-24  
**Primary source:** National Institute of Korean Language (국립국어원), *한국어 어문 규범*, 제2부 표준 발음법.  
**Official route:** https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002  
**Reproducible source snapshot:** [`한국어 어문 규범.htm`](../한국어%20어문%20규범.htm), blob SHA `c6b5aedf7774a0238ff58cfe51457f6975ca1b36`.

## Result

The saved official HTML was reviewed at the article-structure level for all 30 rules. The normative article lead-in and the first paragraph under the separately labelled `해설` section are now recorded independently in [the machine-readable review fixture](../tests/fixtures/nikl-article-review-1-30.json). The new regression test checks all 30 article numbers, ordering, source anchors, exact captured normative text, and separation of the explanatory paragraph. This is an offline snapshot-integrity check; it does **not** claim that the source was fetched live during this run.

## Mandatory evidence boundary

1. **Normative Korean:** the rule text, subordinate clauses, tables, and examples actually contained in the Standard Pronunciation Rules.
2. **Explanatory material (`해설`):** commentary that explains the rule, provides analysis, or discusses usage. It can guide review, but is not itself an additional rule.
3. **Korean surface pronunciation:** a rule result or lexical form must be supported by the normative examples or another precisely identified official NIKL source. Do not turn an explanatory hypothetical into a gold label without checking its source status.
4. **Broad IPA:** the repository's inspectable phonological representation of the Korean surface. NIKL's Korean Hangul pronunciation notation is evidence for the Korean reading, but does not by itself adjudicate every IPA detail, narrow phonetics, timing, or acoustic realization.
5. **Ukrainian adaptation:** the project's target-language approximation derived from IPA. It is not supplied or standardized by NIKL; keep it provisional until independently reviewed.

## Article-by-article review ledger

The detailed normative lead-ins and separately stored explanatory paragraphs are in the JSON fixture. A new cross-rule engine regression, [`tests/nikl-human-review-surface-regression.test.mjs`](../tests/nikl-human-review-surface-regression.test.mjs), pins 19 NIKL-backed surface/IPA pairs plus optional-reading metadata; it intentionally leaves Ukrainian target gold separate. The established implementation/positive-negative test inventory remains in [the existing 30-article audit](NIKL-STANDARD-PRONUNCIATION-AUDIT-2026-10-09.md), especially its **Article-by-article coverage map** and **Machine-checked article coverage ledger**. This pass preserves those tests rather than duplicating a second engine corpus.

| Articles | Human-review finding | Existing regression evidence to preserve |
|---|---|---|
| §§1–3 | §§1 is the governing principle; §§2–3 define the consonant/vowel inventories, not word-level pronunciation examples. | `tests/nikl-articles-2-3-inventory.test.mjs`; IPA/target mapping remains a project decision. |
| §§4–7 | Vowel realizations, variants, and length require their stated conditions and exceptions; explanatory descriptions must not erase optionality or lexical length. | Existing §4–5 variant tests and `tests/nikl-articles-6-7-exhaustive-listed-examples.test.mjs`. |
| §§8–12 | Coda inventory, neutralization, complex-coda simplification, and ㅎ behavior are context-sensitive; preserve morphology-dependent and negative controls. | Existing exhaustive coda matrix, §9–12 tests, and `tests/nikl-article-10-11-morphological-contrasts-2026-10-11.test.mjs`. |
| §§13–17 | Distinguish liaison to formal morphemes from substantive morphemes; do not infer morphology from Hangul spelling alone. §17 palatalization needs a licensed formal-morpheme context. | Existing §13/14 official-example matrices, `tests/nikl-substantive-liaison-matrix.test.mjs`, and `tests/nikl-palatalization-boundary-matrix.test.mjs`. |
| §§18–21 | Preserve rule order for nasal/liquid assimilation and retain §21 as a negative normative control, not a productive casual-speech rewrite. | `tests/nikl-articles-17-18-complete-examples.test.mjs`, `tests/adversarial-rule29-liquid-assimilation-2026-10-10.test.mjs`, and the §21 negative-control fixture. |
| §§22–27 | Optional readings and fortition are condition-specific; phrase boundaries, morphology, and exceptions are not inferred globally. | Existing §22 variants, §23–26 fortition matrices, and `tests/nikl-articles-27-29-phrase-boundary-controls-2026-10-11.test.mjs`. |
| §§28–30 | Compound fortition, n-insertion, and saisiot effects require the relevant compound/lexical conditions; listed exceptions and variants stay explicit. | Existing exact-license audits and regressions for §§28–30, including `docs/NATIVE-ENGINE-NIKL-RULE-28-30-EXACT-LICENSES-2026-10-23.md`. |

## Status and limits

- **DONE_VERIFIED:** all 30 normative article lead-ins and their separate first explanatory paragraphs are captured from the committed HTML snapshot; the new test compares the normalized text exactly.
- **DONE_VERIFIED (existing work preserved):** the earlier article-level audit and the rule-specific engine regression suites already cover the listed examples and many negative controls. They were not replaced with a parallel corpus.
- **PARTIAL:** this pass does not claim a fresh expert adjudication of every subparagraph/table example, independently gold IPA for every case, or independent Ukrainian-target validation. The detailed rule tests remain the pronunciation acceptance layer; the new test validates source structure and the normative/explanatory boundary.
- **BLOCKED for live-source verification:** an earlier official-site crawl was blocked by HTTP 403 in automation. The checked-in official-source HTML is the reproducible input for this review; no access-control workaround was attempted.
- **Next acceptance criterion:** if a rule-specific case is added or changed, record its exact source URL/article/subparagraph, whether it is a normative example or explanatory illustration, Korean surface form, IPA status, Ukrainian-target status, and at least one relevant negative control. Re-run `npm test`, `npm run build`, and the relevant Python suite in a local environment; remote repository access here does not execute those commands.

## Verification command

```sh
node --test tests/nikl-article-review-1-30.test.mjs tests/nikl-human-review-surface-regression.test.mjs
```

The repository's full release gate remains `npm run check:release`; it has not been run by this remote GitHub-only edit.


## Follow-up: complex-coda regression expansion (2026-10-24)

The cross-rule native-engine regression now covers **24 source-backed Korean surface / project-broad-IPA pairs** (up from the initial 19), adding five exact forms from existing source-backed lexical records: `늙고` [늘꼬], `않았다` [아낟따], `얇은` [얄븐], `읽어` [일거], and `헛웃음` [허두슴]. A sixth case, `긁고` [글꼬], is deliberately kept in a separate surface-only evidence fixture. NIKL Online Q&A qna_seq=328946 (question dated 2026-04-05; answer dated 2026-04-06) explicitly confirms [글꼬] and explains the connection to the §11 ㄺ-before-ㄱ example. The answer notes that the fortis realization is inferred from the examples rather than spelled out as a separate clause; this nuance is preserved in the fixture and source register.

**Evidence boundary:** these official pages attest Korean surface spellings, not IPA or Ukrainian target strings. Broad IPA in the regression is the project's inspectable analysis layer; Ukrainian strings remain provisional and are not asserted as normative gold. The `얇은` record comes from the official Korean-English Learners' Dictionary domain, so the regression's source allowlist explicitly permits that official NIKL dictionary host for this case.

This adds finite, exact-form coverage only. It does not generalize `ㄼ` behaviour from `얇은` to every adjective, nor infer morphology for unlisted compounds. See the [surface-only evidence fixture](../tests/fixtures/nikl-surface-only-complex-coda.json) and [guard test](../tests/nikl-surface-only-complex-coda.test.mjs). The source-boundary test, 30-article fixture, blinded 21-case independent IPA review queue, and separate IPA→Ukrainian target-review gate remain unchanged.
