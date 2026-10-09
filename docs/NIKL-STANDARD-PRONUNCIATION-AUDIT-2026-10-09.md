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
| §4 | Monophthongs; standard variants for ㅚ and ㅟ. | Added explicit UI variants for 회/훼 and 위 with IPA distinctions [ø]/[we] and [y]/[wi]. This demonstrates the rule; it is not an exhaustive implementation of every ㅚ/ㅟ word. Ukrainian targets remain provisional. |
| §5 | Diphthongs and permitted pronunciations: 용언 forms 져/쪄/쳐; ㅖ variants; ㅢ with consonant onset; non-initial 의 and particle 의. | Added exact variants for all eight official ㅖ examples, retained §5 ㅢ variants including 협의 [혀븨/혀비], and added sourced contracted forms 가져/쪄/다쳐 plus 묻혀/붙여/잊혀. Coverage is lexical, not a general morphology parser; Ukrainian targets remain provisional. |
| §§6–7 | Vowel length and its distribution/compound exceptions. | Expanded exact lexical IPA coverage with official long-vowel examples, shortening before endings/suffixes, length-retaining exceptions, and the compound variant 반신반의 [반ː신바ː늬/반ː신바ː니]. This is still not a complete lexical length dictionary; Ukrainian targets remain provisional. |
| §8 | Only seven consonants are realized as coda sounds: ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅇ. | Core coda inventory represented. |
| §9 | Final neutralization of ㄲ/ㅋ, obstruent codas, and ㅍ. | Regular examples (닦다, 키읔, 키읔과, 옷, 있다, 젖, 빚다, 꽃, 쫓다, 솥, 앞, 덮다) are tested through the general engine so lexical entries cannot hide context-sensitive behavior. 웃다/뱉다 remain exact lexical entries only to preserve their source-documented long vowels. Direct Python tests cover each representative-coda class. Ukrainian targets remain provisional. |
| §10 | Simplification of ㄳ ㄵ ㄼ ㄽ ㄾ ㅄ in coda position; exceptions for 밟- and selected 넓- compounds. | Expanded exact NIKL examples to 넋과 [넉꽈], 앉다 [안따], 여덟 [여덜], 넓다 [널따], 외곬 [외골], 값 [갑], and the additional listed 밟- forms 밟소/밟지/밟게/밟고. The existing browser and Python rule tests exercise 넓죽하다/넓둥글다 algorithmically (rather than hiding the rule behind lexical overrides). Added direct rule tests proving the ㄼ exception is narrow rather than a blanket prefix rewrite. Ukrainian targets remain provisional. |
| §11 | Simplification of ㄺ ㄻ ㄿ in coda position. | Canonical coda mapping is represented; ㄺ requires lexical/morphological handling in environments such as 읽고 vs 읽다. |
| §12 | ㅎ: aspiration, deletion, nasal realization, and interactions with ㄶ/ㅀ. | Core aspiration/deletion implemented; lexical and morphological exceptions remain. Added the sequence ㄷ+히 → ㅌ+ㅣ → ㅊ+ㅣ for 굳히다/닫히다/묻히다. |
| §13 | Single coda liaison before a vowel-initial formal morpheme. | Generic liaison exists, but it cannot infer every morpheme boundary. Exact lexical overrides take precedence. |
| §14 | Complex-coda liaison before a vowel-initial formal morpheme; second member moves, and ㅅ surfaces as fortis ㅆ. | Core component logic implemented; exact stem/morpheme exceptions remain lexical. |
| §15 | Coda before a vowel-initial substantive morpheme beginning with ㅏ/ㅓ/ㅗ/ㅜ/ㅟ: neutralize to the representative coda before resyllabification; only one consonant of a complex coda moves. 맛있다/멋있다 also have listed variants. | Added sourced exact-form entries for 맛없다 [마덥따], 겉옷 [거돋], 헛웃음 [허두슴], 값어치 [가버치], and 젖어미 [저더미]. Added explicit alternate-reading fields and a UI variant panel for 맛있다 [마딛따]/[마싣따] and 멋있다 [머딛따]/[머싣따]. These are lexical evidence, not a general morphology detector; Ukrainian targets remain provisional. |
| §16 | Special pronunciation of Korean consonant-letter names when particles/endings attach. | Added exact sourced entries for the 21 official NIKL examples involving 디귿/지읒/치읓/키읔/티읕/피읖/히읗 + 이/을/에. These are lexical exceptions, not a general letter-name morphology parser; Ukrainian targets remain provisional. |
| §17 | Palatalization of ㄷ/ㅌ(ㄾ) before ㅣ-initial formal morphemes; ㄷ+히 also yields 치. | Fixed over-broad trigger: palatalization is not a general rule before every j-glide vowel. The Python research rule requires an explicit §17 formal-morpheme or -히 license; the browser uses sourced exact-form entries and withholds unknown spelling-only candidates. The official [붙임] sequence ㄷ+ㅎ → ㅌ followed by ㅣ → ㅊ is documented and tested separately. |
| §18 | Nasal assimilation: coda obstruents surface as ㅇ/ㄴ/ㅁ before ㄴ/ㅁ. | Implemented after coda neutralization/simplification. The trace now marks the change on both affected syllables. |
| §19 | ㄹ → ㄴ after coda ㄱ/ㅂ/ㅁ/ㅇ; after ㄱ/ㅂ, nasal assimilation also changes the coda. | The browser and Python research engines now both implement §19 before §18. Regression tests assert the ordered chain: 국립 [궁닙], 협력 [혐녁], 독립문 [동님문]. The Python rule order was corrected so the liquid-to-nasal change happens before nasal assimilation of the preceding ㄱ/ㅂ coda. |
| §20 | Liquid assimilation: ㄴ and ㄹ become ㄹㄹ in licensed environments; listed lexical exceptions can instead have ㄹ → ㄴ. | General adjacent ㄴ/ㄹ logic exists; lexical exceptions such as 의견란 remain exact dictionary entries. |
| §21 | Other place-assimilation patterns are not accepted as standard merely because they are common in casual speech. | Added seven exact NIKL negative-control entries (감기, 옷감, 있고, 꽃길, 젖먹이, 문법, 꽃밭) to prevent nonstandard place assimilation from being treated as standard. Ukrainian targets remain provisional. |
| §22 | Optional glide [j] in specified verb-ending environments (e.g. 되어/피어 variants). | Added exact sourced entries and visible alternate readings for 되어/되여, 피어/피여, 이오/이요, and 아니오/아니요. This remains lexical coverage rather than a general morphology engine; Ukrainian targets remain provisional. |
| §23 | Fortition after obstruent codas (representative [ㄱ, ㄷ, ㅂ]). | Core contextual fortition implemented; Ukrainian output intentionally neutralizes fortisness while IPA retains it. Corrected eight legacy lexical target strings that had accidentally doubled Ukrainian consonants for fortisness (e.g. 깎아, 있어, 쫓아, 맛있다). |
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
- §15 variants: 맛있다 [마딛따] with [마싣따] as an allowed reading, and 멋있다 [머딛따] with [머싣따] as an allowed reading. The browser exposes the alternative Korean surface form, IPA, and provisional Ukrainian target rather than silently collapsing the variant.
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
- §15 / substantive-morpheme liaison and complex-coda exception examples (맛없다 [마덥따], 겉옷 [거돋], 헛웃음 [허두슴], 값어치 [가버치], 젖어미 [저더미]) and permitted readings of 맛있다/멋있다, NIKL standard text above.
- §19 / ㄹ → ㄴ exceptions and examples, NIKL standard text above; example 의견란 [의ː견난] is also retained in the lexical pronunciation data.
- §29 / official rule and commentary on the variability of ㄴ insertion, NIKL: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
- §29 / compound examples and 서울역 [서울력], NIKL: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=307219
- NIKL lists 서울역 [서울력] directly in §29, 붙임 1 of the official standard text.

## Release gate

Do not claim this audit is complete or the public site is fixed until the following are verified on the branch: npm test, npm run build, Python tests (pytest), corpus/data integrity, and the deployed GitHub Pages result. A successful static build alone does not prove pronunciation correctness.


### Complex-coda liaison guardrail (§§13–15)

The Python research rule R002 and browser runtime now refuse to resyllabify a non-ㅎ complex coda solely because the next written syllable begins with ㅇ. Both layers also withhold simple-coda transfer when the written coda differs from its §15 representative and the next vowel is one of ㅏ/ㅓ/ㅗ/ㅜ/ㅟ. The correct operation depends on morphology:

- **Formal morpheme (§§13–14):** retain the first cluster component and move the second, e.g. 넋이 [넉씨], 값이 [갑씨].
- **Substantive morpheme (§15):** neutralize the complex coda to its representative and resyllabify that representative, e.g. 값어치 [가버치].
- **Unknown morphology:** keep the written cluster unchanged in the research representation and mark the rule `conditional-disabled`; do not guess a surface form.

Exact Python licenses are tied to the full input and syllable pair, e.g. `R002:formal:넋이:넋>이`, `R002:substantive:값어치:값>어`, `R002:formal:깎아:깎>아`, or `R002:substantive:겉옷:겉>옷`. A license for one word cannot be reused for another. In the browser, known forms such as 넋이 [넉씨], 값이 [갑씨], 앉아 [안자], 닭을 [달글], 젊어 [절머], 깎아 [까까], 있어 [이써], 쫓아 [쪼차], 맞아 [마자], 낮아 [나자], and 붙어 [부터] use exact sourced lexical entries; unknown forms are marked unresolved. This remains a conservative guardrail, not a general morphological analyzer.


### Rule-order regression: §17 must precede generic liaison semantically

The default Python pipeline lists R002 before R007. That ordering is safe only if R002 does not consume the coda in a potential §17 environment. R002 now leaves ㄷ/ㅌ + ㅣ unchanged and records a conditional result, allowing the later licensed R007 pass to handle forms such as 같이 [가치] and 굳이 [구지]. R007 licenses are now exact to full form and adjacent syllable pair (e.g. `R007:formal_morpheme_i:굳이:굳>이`), so a category-only flag or a license for one word cannot authorize another. The same exact-pair requirement applies to the §12 + §17 sequence in 굳히다/닫히다/묻히다. Without exact morphology evidence, the pair remains unresolved in the research representation. The §12 + §17 sequence for 굳히다/닫히다/묻히다 remains sequential: R004 first creates the intermediate ㅌ + ㅣ environment, then R007 palatalizes it to ㅊ.

Regression tests cover both licensed positive examples and an unlicensed negative control (갇이), as well as the aspirated suffix sequence.


### Complex-coda aspiration before ㅎ (§12)

The official commentary to §12 explicitly distinguishes a verbal stem plus suffix (e.g. 넓히다 [널피다]) from other combinations. In suffix forms, the specified cluster component combines directly with ㅎ; outside that licensed morphophonemic pattern, coda simplification is applied first. The research layer now requires an exact `R004:complex_h_suffix:읽히다:읽>히`-style license before preserving the first component and aspirating the second. The browser uses exact sourced lexical entries for the official examples 읽히다 [일키다], 앉히다 [안치다], 넓히다 [널피다] and marks unknown complex-coda + ㅎ sequences unresolved instead of assuming the suffix pattern.

Official source: NIKL, *표준 발음법*, §12, especially the commentary explaining the difference between forms with a suffix and other combinations: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002


### ㄺ before ㄱ: §11 exception must be protected from §23 (§§11, 23)

The generic §23 fortition pass previously saw the representative ㄱ of written ㄺ and could tense the next ㄱ before the morphologically conditioned §11 exception had been established. R016 now requires an exact full-form/pair license such as `R016:verb_stem_rieul_giyeok_suffix:읽고:읽>고`. R008 withholds the ambiguous written ㄺ + ㄱ sequence when R016 has not resolved it, rather than silently choosing the noun-like simplification. This protects the contrast between stem forms such as 읽고 [일꼬]/맑게 [말께] and lexical nouns such as 닭고기 [닥꼬기]; exact lexical overrides remain the source of user-facing readings for listed forms.

Official source: NIKL, *표준 발음법*, §§11 and 23: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002


### Exact licensing for §§24–28 fortition

The morphology-conditioned fortition rules R010–R014 no longer accept category-only switches (such as `R014:compound`) as sufficient evidence. Each rule now requires a license tied to the exact full form and adjacent syllable pair, for example `R014:compound:문고리:문>고`. This prevents a compound, Sino-Korean item, stem ending, or adnominal construction's license from being reused for unrelated words. §27 also explicitly permits the licensed adnominal ㄹ construction across a written word boundary only in phrase mode, e.g. 할 것 [할껃].

Official source: NIKL, *표준 발음법*, §§24–28: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002


### Exact evidence for saisiot pronunciation (§30)

R015 now requires a full-form and adjacent-pair license such as `R015:saisiot:냇가:냇>가`, rather than a category-only `R015:saisiot` token. This prevents a lexical saisiot analysis from being reused for an unrelated ㅅ-final sequence. The rule continues to implement the documented §30 outcomes only for the licensed pair.

Official source: NIKL, *표준 발음법*, §30: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002


### Exact licensing and order for §12(4) ㅎ deletion

R003 now requires an exact full-form/pair license such as `R003:ending_or_suffix_h_deletion:많아:많>아`. The default Python pipeline applies licensed ㅎ deletion before liaison, so the surviving ㄴ/ㄹ in ㄶ/ㅀ moves to the next syllable onset: 많아 [마나], 싫어 [시러]. The browser has no morphological parser, so it uses sourced lexical entries for known official examples and marks unknown ㅎ/ㄶ/ㅀ + vowel candidates unresolved. This prevents a generic coda-deletion rule from being mistaken for evidence of an ending/suffix boundary.

Official source: NIKL, *표준 발음법*, §12(4): https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002


### Phrase-boundary assimilation (§§18–20)

NIKL §18 explicitly says nasal assimilation can apply when two words are connected in one spoken phrase. Python R005 and R006 now allow word-boundary eligibility only when `boundary_mode="phrase"`; same-word mode remains unchanged. The browser treats plain whitespace as a connected phrase for the explicit §18–20 assimilation pass, but punctuation blocks it. The pass applies §19 ㄹ→ㄴ before §18 nasalization, preserving the normative order illustrated by 협력 [혐녁] and phrase examples such as 밥 먹는다 [밤 멍는다].

Official source: NIKL, *표준 발음법*, §§18–20 and commentary: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002


### Browser parity for ㄺ before ㄱ (§11)

The browser now mirrors the Python research layer's guard: if an unlisted form has written ㄺ immediately before ㄱ, it is not allowed to choose between the §11 verbal-stem exception and ordinary coda simplification through generic §23 fortition. Exact sourced lexical entries resolve official examples such as 묽고 [물꼬] and 얽거나 [얼꺼나]; other ambiguous forms are marked unresolved.

Official source: NIKL, *표준 발음법*, §11 and its listed examples: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
