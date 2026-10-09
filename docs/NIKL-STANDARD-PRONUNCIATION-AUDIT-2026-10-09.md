# NIKL Standard Pronunciation Rules audit

**Audit date:** 2026-10-09  
**Primary authority:** National Institute of Korean Language (국립국어원), *표준 발음법* (“Standard Pronunciation Rules”), part 2 of the Korean Language Standard.  
**Official full text:** https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002

## Scope and integrity

The official rules specify Korean standard pronunciation. They do **not** specify an official Ukrainian transcription. This repository therefore separates three claims:

1. **Korean source analysis** — a surface pronunciation supported by the official rule, an NIKL dictionary/Q&A entry, or a documented lexical exception.
2. **Broad IPA** — a readable phonological representation, not narrow acoustic transcription.
3. **Ukrainian target** — the project's practical approximation, not a Ukrainian state standard.

The browser engine is intentionally not a full Korean morphological parser. Rules requiring lexical identity, compound structure, word class, a verb stem, or a specific ending cannot safely be generalized from adjacent Hangul blocks alone. In such cases, use an evidenced exact lexical entry or preserve a clearly marked uncertainty. A finite regression corpus is not proof of complete lexical coverage.

## Article-by-article coverage map

| Official article | Normative topic | Runtime status and audit decision |
|---|---|---|
| §1 | Standard pronunciation follows actual standard-language pronunciation while considering tradition and rationality. | Governing principle: never equate written Jamo directly with surface sounds. |
| §2 | Korean consonant inventory. | Inventory represented; Ukrainian mapping remains a project decision. |
| §3 | Korean vowel inventory. | Inventory represented. |
| §4 | Monophthongs; standard variants for ㅚ and ㅟ. | Canonical table is a broad model; it does not encode every speaker/variant realization. |
| §5 | Diphthongs and permitted pronunciations: 용언 forms 져/쪄/쳐; ㅖ variants; ㅢ with consonant onset; non-initial 의 and particle 의. | Fixed a bug: onset ㅇ + ㅢ now uses normative default [ɰi] instead of always producing an unresolved placeholder. A consonant-onset ㅢ is [i]. Optional [i]/[e] readings are not guessed without morphological context. |
| §§6–7 | Vowel length and its distribution/compound exceptions. | Partial: length is recorded in selected lexical IPA entries only; the general browser engine is not a complete lexical length dictionary. |
| §8 | Only seven consonants are realized as coda sounds: ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅇ. | Core coda inventory represented. |
| §9 | Final neutralization of ㄲ/ㅋ, obstruent codas, and ㅍ. | Implemented through representative-coda mapping; ordering before assimilation is essential. |
| §10 | Simplification of ㄳ ㄵ ㄼ ㄽ ㄾ ㅄ in coda position; exceptions for 밟- and selected 넓- compounds. | Partial with explicit lexical exceptions. Do not generalize 밟-/넓- behavior to every ㄼ word. |
| §11 | Simplification of ㄺ ㄻ ㄿ in coda position. | Canonical coda mapping is represented; ㄺ requires lexical/morphological handling in environments such as 읽고 vs 읽다. |
| §12 | ㅎ: aspiration, deletion, nasal realization, and interactions with ㄶ/ㅀ. | Core aspiration/deletion implemented; lexical and morphological exceptions remain. Added the sequence ㄷ+히 → ㅌ+ㅣ → ㅊ+ㅣ for 굳히다/닫히다/묻히다. |
| §13 | Single coda liaison before a vowel-initial formal morpheme. | Generic liaison exists, but it cannot infer every morpheme boundary. Exact lexical overrides take precedence. |
| §14 | Complex-coda liaison before a vowel-initial formal morpheme; second member moves, and ㅅ surfaces as fortis ㅆ. | Core component logic implemented; exact stem/morpheme exceptions remain lexical. |
| §15 | Coda before a vowel-initial substantive morpheme: representative coda transfers; special variants for 맛있다/멋있다. | Not safe to infer universally from adjacent blocks; use lexical evidence for exceptional forms. |
| §16 | Special pronunciation of Korean consonant-letter names when particles/endings attach. | Not generalized in the browser engine; letter names are lexical forms, not ordinary Jamo sequences. |
| §17 | Palatalization of ㄷ/ㅌ(ㄾ) before ㅣ-initial formal morphemes; ㄷ+히 also yields 치. | Fixed over-broad trigger: palatalization now requires ㅣ, not any j-like vowel. The ㄷ+히 sequence is handled explicitly. Morphological licensing still limits universal generalization. |
| §18 | Nasal assimilation: coda obstruents surface as ㅇ/ㄴ/ㅁ before ㄴ/ㅁ. | Implemented after coda neutralization/simplification. The trace now marks the change on both affected syllables. |
| §19 | ㄹ → ㄴ after coda ㄱ/ㅂ/ㅁ/ㅇ; after ㄱ/ㅂ, nasal assimilation also changes the coda. | Fixed and regression-tested. The rule is limited to the standard environments; it must run before nasal assimilation. Examples: 국립 [궁닙], 협력 [혐녁], 독립문 [동님문]. |
| §20 | Liquid assimilation: ㄴ and ㄹ become ㄹㄹ in licensed environments; listed lexical exceptions can instead have ㄹ → ㄴ. | General adjacent ㄴ/ㄹ logic exists; lexical exceptions such as 의견란 remain exact dictionary entries. |
| §21 | Other place-assimilation patterns are not accepted as standard merely because they are common in casual speech. | Do not add speculative velar/labial place assimilation as a generic rule. |
| §22 | Optional glide [j] in specified verb-ending environments (e.g. 되어/피어 variants). | Not generally implemented; requires morphology and variant representation. |
| §23 | Fortition after obstruent codas (representative [ㄱ, ㄷ, ㅂ]). | Core contextual fortition implemented; Ukrainian output intentionally neutralizes fortisness, while IPA retains it. |
| §24 | Fortition after verb-stem codas ㄴ(ㄵ), ㅁ(ㄻ) before specified endings; exceptions for causative/passive -기-. | Requires morphological licensing; not a universal coda rule. Use exact lexical entries where covered. |
| §25 | Fortition after verb-stem ㄼ/ㄾ before specified endings. | Requires a verb-stem/ending boundary; partial lexical coverage only. |
| §26 | Sino-Korean fortition after ㄹ before ㄷ/ㅅ/ㅈ, with exceptions. | Not inferred from Hangul adjacency alone; requires lexical/morphemic evidence. |
| §27 | Fortition after adnominal -(으)ㄹ before specified consonants; phrasing/pauses matter. | Requires syntactic and prosodic context; not implemented as a universal rule. |
| §28 | Compound fortition associated with a genitive saisiot relation, including forms without written ㅅ. | Semantics/lexical structure matter; use dictionary evidence, not blanket fortition. |
| §29 | ㄴ insertion in compounds/derivatives before 이/야/여/요/유; ㄹ + inserted ㄴ becomes ㄹ. | Only documented lexical cases are currently covered. Added 서울역 → 서울력 so the engine does not incorrectly apply ordinary liaison and erase the coda ㄹ. |
| §30 | Pronunciation effects of written/underlying saisiot in compounds, including ㄴ/ㄴㄴ insertion patterns. | Requires compound lexical structure; no blind insertion rule. Expand the sourced lexicon and negative controls. |

## Regressions added in this pass

The branch **fix/nikl-standard-pronunciation-audit** adds **tests/nikl-pronunciation-regression.test.mjs** for:

- 독립문 → normative surface sequence [동님문], with §19 before §18.
- 국립 → [궁닙].
- 서울역 → [서울력], via a sourced lexical override implementing §29's ㄹ + inserted ㄴ → ㄹ.
- 한국어의 → default [ɰi] instead of an unresolved placeholder.
- 희망 → ㅢ with consonant onset [i].
- 같이 → palatalization in the ㅣ environment only.
- 굳히다 → sequential §12 + §17 result [구치다].

The expected Korean surface forms are normative evidence. The Ukrainian spellings asserted by tests are model outputs and must not be described as officially standardized Ukrainian forms.

## Rule-ordering requirements

1. Apply lexical coda exceptions before generic coda simplification.
2. Apply the appropriate coda representative/simplification before nasal assimilation.
3. In §19 environments, change the following ㄹ to ㄴ **before** applying nasal assimilation to a preceding ㄱ/ㅂ coda.
4. Handle ㅎ interactions and complex codas without dropping the retained component of ㄶ/ㅀ or other complex codas.
5. Apply §17 palatalization only in its licensed environment; do not treat all j-like vowels as equivalent to ㅣ.
6. Keep original Hangul decomposition immutable for the structural panel. Surface changes belong to a separate working representation.
7. Derive Ukrainian output and broad IPA from the same surface representation. A trace must identify which segment changed and which rule caused it.

## Official sources

- NIKL, *표준 발음법*, official full text: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
- §5 / ㅢ variants, NIKL Q&A: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=278827
- §17 / 밭이 and palatalization, NIKL: https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5748
- §18 / nasal assimilation, NIKL: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=311009
- §19 / ㄹ → ㄴ exceptions and examples, NIKL standard text above; example 의견란 [의ː견난] is also retained in the lexical pronunciation data.
- §29 / compound ㄴ insertion, NIKL: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=307219
- NIKL lists 서울역 [서울력] directly in §29, 붙임 1 of the official standard text.

## Release gate

Do not claim this audit is complete or the public site is fixed until the following are verified on the branch: npm test, npm run build, Python tests (pytest), corpus/data integrity, and the deployed GitHub Pages result. A successful static build alone does not prove pronunciation correctness.
