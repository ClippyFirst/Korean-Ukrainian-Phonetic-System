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
| §15 | Coda before a vowel-initial substantive morpheme beginning with ㅏ/ㅓ/ㅗ/ㅜ/ㅟ: neutralize to the representative coda before resyllabification; only one consonant of a complex coda moves. 맛있다/멋있다 also have listed variants. | Added sourced exact-form entries for 맛없다 [마덥따], 겉옷 [거돋], 헛웃음 [허두슴], 값어치 [가버치], and 젖어미 [저더미]. These are lexical evidence, not a general morphology detector. The alternate readings of 맛있다/멋있다 still need an explicit variant-capable output model. |
| §16 | Special pronunciation of Korean consonant-letter names when particles/endings attach. | Not generalized in the browser engine; letter names are lexical forms, not ordinary Jamo sequences. |
| §17 | Palatalization of ㄷ/ㅌ(ㄾ) before ㅣ-initial formal morphemes; ㄷ+히 also yields 치. | Fixed over-broad trigger: palatalization is not a general rule before every j-glide vowel. The Python research rule requires an explicit §17 formal-morpheme or -히 license; the browser uses sourced exact-form entries and withholds unknown spelling-only candidates. The official [붙임] sequence ㄷ+ㅎ → ㅌ followed by ㅣ → ㅊ is documented and tested separately. |
| §18 | Nasal assimilation: coda obstruents surface as ㅇ/ㄴ/ㅁ before ㄴ/ㅁ. | Implemented after coda neutralization/simplification. The trace now marks the change on both affected syllables. |
| §19 | ㄹ → ㄴ after coda ㄱ/ㅂ/ㅁ/ㅇ; after ㄱ/ㅂ, nasal assimilation also changes the coda. | The browser and Python research engines now both implement §19 before §18. Regression tests assert the ordered chain: 국립 [궁닙], 협력 [혐녁], 독립문 [동님문]. The Python rule order was corrected so the liquid-to-nasal change happens before nasal assimilation of the preceding ㄱ/ㅂ coda. |
| §20 | Liquid assimilation: ㄴ and ㄹ become ㄹㄹ in licensed environments; listed lexical exceptions can instead have ㄹ → ㄴ. | General adjacent ㄴ/ㄹ logic exists; lexical exceptions such as 의견란 remain exact dictionary entries. |
| §21 | Other place-assimilation patterns are not accepted as standard merely because they are common in casual speech. | Do not add speculative velar/labial place assimilation as a generic rule. |
| §22 | Optional glide [j] in specified verb-ending environments (e.g. 되어/피어 variants). | Not generally implemented; requires morphology and variant representation. |
| §23 | Fortition after obstruent codas (representative [ㄱ, ㄷ, ㅂ]). | Core contextual fortition implemented; Ukrainian output intentionally neutralizes fortisness, while IPA retains it. |
| §24 | Fortition after verb-stem codas ㄴ(ㄵ), ㅁ(ㄻ) before specified endings; exceptions for causative/passive -기-. | Requires morphological licensing; not a universal coda rule. Use exact lexical entries where covered. |
| §25 | Fortition after verb-stem ㄼ/ㄾ before specified endings. | Requires a verb-stem/ending boundary; partial lexical coverage only. |
| §26 | Sino-Korean fortition after ㄹ before ㄷ/ㅅ/ㅈ, with exceptions. | Not inferred from Hangul adjacency alone; requires lexical/morphemic evidence. |
| §27 | Fortition after adnominal -(으)ㄹ before specified consonants; phrasing/pauses matter. | Requires syntactic and prosodic context; not implemented as a universal rule. |
| §28 | Compound fortition associated with a genitive saisiot relation, including forms without written ㅅ. | Semantics/lexical structure matter; use dictionary evidence, not blanket fortition. |
| §29 | N-insertion in compounds/derivatives before 이/야/여/요/유; ㄹ + inserted ㄴ becomes ㄹ. NIKL commentary also discusses j-initial diphthongs such as 얘/예 and notes lexical/optional variation. | Python now requires an exact per-pair license tied to a full word or phrase; a global boolean cannot license every matching sequence. 서울역 [서울력] remains a sourced exact-form override. |
| §30 | Pronunciation effects of written/underlying saisiot in compounds, including ㄴ/ㄴㄴ insertion patterns. | Requires compound lexical structure; no blind insertion rule. Expand the sourced lexicon and negative controls. |

## Regressions added in this pass

The regression suite **tests/nikl-pronunciation-regression.test.mjs** covers:

- 독립문 → normative surface sequence [동님문], with §19 before §18 in both runtime and research pipeline.
- 국립 → [궁닙], including Python/browser cross-layer parity.
- 국립국어원 → [궁님꾸거원], combining §19, §18, and §23 in the correct order.
- 서울역 → [서울력], via a sourced lexical override implementing §29's ㄹ + inserted ㄴ → ㄹ.
- §15 exact lexical forms: 맛없다 [마덥따], 겉옷 [거돋], 헛웃음 [허두슴], 값어치 [가버치], 젖어미 [저더미]; each output is marked `lexical-review` because the Ukrainian target is provisional.
- 한국어의 → default [ɰi] instead of an unresolved placeholder.
- 희망 → ㅢ with consonant onset [i].
- 같이 → palatalization in the ㅣ environment only.
- 굳히다 → sequential §12 + §17 result [구치다].

The browser adapter now requires exact sourced entries for §17 cases when morphology cannot be inferred. For unlisted ㄷ/ㅌ/ㄾ + 이-looking candidates it emits an explicit unresolved marker instead of guessing a formal-morpheme boundary. The Python research rule accepts only explicit licenses (`R007:formal_morpheme_i` or `R007:dh_suffix_hi`) and no longer fires for unlicensed vowel sequences. §29 likewise requires a full-form/pair-specific license (`R009:word:한여름:한>여`, or `R009:phrase:무슨 일:슨>일`) instead of a global boolean.

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
- §17 / official examples and the ㄷ + suffix -히 provision, NIKL Online Q&A: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=313851
- §17 / 굳이 [구지], NIKL Online Q&A: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=2&qna_seq=313201
- §17 / 밭이 vs 밭에, NIKL Online Q&A: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=281511
- §18 / nasal assimilation, NIKL: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=311009
- §15 / substantive-morpheme liaison and complex-coda exception examples (맛없다 [마덥따], 겉옷 [거돋], 헛웃음 [허두슴], 값어치 [가버치], 젖어미 [저더미]), NIKL standard text above.
- §19 / ㄹ → ㄴ exceptions and examples, NIKL standard text above; example 의견란 [의ː견난] is also retained in the lexical pronunciation data.
- §29 / official rule and commentary on the variability of ㄴ insertion, NIKL: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
- §29 / compound examples and 서울역 [서울력], NIKL: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=307219
- NIKL lists 서울역 [서울력] directly in §29, 붙임 1 of the official standard text.

## Release gate

Do not claim this audit is complete or the public site is fixed until the following are verified on the branch: npm test, npm run build, Python tests (pytest), corpus/data integrity, and the deployed GitHub Pages result. A successful static build alone does not prove pronunciation correctness.
