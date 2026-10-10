# Adversarial corpus audit — 2026-10-11

## Scope

The engine was exercised against all **165 TXT corpora**: 15 broad passages and 150 rule-family inputs. The rule-family files were revised so that the test forms are quoted and isolated; three original passages were also corrected where example forms had been accidentally fused with Korean particles or endings.

## Findings from the per-eojeol diagnostic

On the audited corpus/lexicon revision, the diagnostic processed **22,175 Hangul eojeol occurrences** representing **1,978 unique Hangul runs**. **36 unique forms (64 occurrences)** remained unresolved. This is an unresolved-output count, not an error count: the engine deliberately fails closed when it cannot establish a morphological boundary or distinguish competing pronunciation rules from the spelling alone. The diagnostic also tokenizes with a Hangul-run expression, so these numbers describe the audit procedure rather than a general accuracy percentage.

The initial diagnostic exposed a corpus-generation defect: some sample words had arbitrary Korean particles appended by the template (for example, a quoted target like 같이 could be turned into a non-target form such as 같이와). All 150 rule-family corpora were regenerated with quoted target examples, and the original prose examples were quoted where the forms themselves were being discussed.

## Repairs applied

- Added **27 source-backed or explicitly rule-derived lexical entries**, bringing `data/korean/lexical_pronunciations.csv` to **565 rows**.
- Added regression assertions for the exact Korean surface form, IPA, Ukrainian approximation, official source URL, and lexical trace for every new entry.
- Kept every new Ukrainian approximation marked **provisional**; a Korean pronunciation source does not, by itself, validate the Ukrainian phonetic rendering.
- Added guards that preserve the 165-file inventory and prevent known accidental target-plus-particle artifacts from returning.
- Corrected example mentions in the original corpora so forms such as 「같았다」, 「같아지는」, 「읽습니다」, and 「밝히는」 are visibly quoted as examples rather than accidentally fused with particles.

Direct NIKL references used for the sourced cases include [읽기[일끼]](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=313399), [좋아[조ː아]](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=312381), [밝게[발께]](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=261&pageIndex=1&qna_seq=330743), [붙이다[부치다]](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=313717), and [낱낱이[난ː나치]](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=261&pageIndex=1&qna_seq=314041). Additional forms are explicitly labeled rule-derived in the lexical notes rather than represented as directly attested exact-word quotations. The governing reference remains the [NIKL Standard Pronunciation Rules](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002).

## Remaining high-priority unresolved cases

These are not silently guessed. They need further exact-source review or a morphology-aware license:

- **ㄺ morphology:** `늙게`, `늙고`, `맑으면`, `맑았지만`. The engine must distinguish the verb/adjective stem exception from general coda simplification. `늙고` remains an explicit fail-closed case.
- **Complex-coda liaison and rule ordering:** `밟았다`, `몫을`, and other forms whose pronunciation depends on the exact formal-morpheme boundary and ordering of liaison, coda neutralization, and fortition.
- **Compound and suffix boundaries:** `홑이불을`, `맏이의`, and `밝혀서의`, where N-insertion, palatalization, or ㅎ/complex-coda interactions need a licensed morphological analysis.
- **Other context-sensitive inflections:** `늦어져서` and related forms should be resolved only after their rule sequence and surface Hangul have been checked against an authoritative source.

The remaining unresolved items should be converted into gold regressions only after the Korean surface form is supported by the NIKL standard, an official NIKL answer, or an authoritative dictionary. Passing the smoke test alone is not evidence that a pronunciation is correct.

## Verification

- Browser regression suite and build: passed.
- Python regression/data-integrity checks: passed on Python 3.11, 3.12, and 3.13.
- Test run: **911 passed, 0 failed** on the audited revision; the subsequent correction to the target mapping of `같았던` also passed CI.
- Reproduce locally with:

```sh
node --test tests/adversarial-text-corpus-suite.test.mjs tests/corpus-discovered-morphology-regressions.test.mjs
```
