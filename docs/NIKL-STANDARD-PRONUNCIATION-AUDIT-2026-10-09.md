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
| §4 | Monophthongs; standard variants for ㅚ and ㅟ. | Regression tests cover explicit ㅚ and ㅟ readings with IPA distinctions [ø]/[we] and [y]/[wi], including 외/위. This covers the listed rule and sample vowels, not every word containing ㅚ/ㅟ. Ukrainian targets remain provisional because Ukrainian lacks direct phonemic equivalents for [ø]/[y]. |
| §5 | Diphthongs and permitted pronunciations: 용언 forms 져/쪄/쳐; ㅖ variants; ㅢ with consonant onset; non-initial 의 and particle 의. | Regression tests cover all official consonant-initial ㅢ examples (늴리리, 닁큼, 무늬, 띄어쓰기, 씌어, 틔어, 희어, 희떱다, 희망, 유희), all eight ㅖ variation examples, the four 의 alternation examples, and contracted 져/쪄/쳐. Variants are retained explicitly in the lexicon. Coverage is lexical, not a general morphology parser; Ukrainian targets remain provisional. |
| §§6–7 | Vowel length and its distribution/compound exceptions. | Regression entries now cover every explicit example in §§6–7: ordinary first-syllable length, short-vowel controls, compound length, contracted long forms and exceptions, shortening before vowel-initial endings and suffixes, length-retaining exceptions, and the compounds 밀물/썰물/쏜살같이/작은아버지. 반신반의 keeps both [반ː신바ː늬/반ː신바ː니] variants. This covers the standard's listed examples, not every Korean word's lexical length; Ukrainian targets remain provisional. |
| §8 | Only seven consonants are realized as coda sounds: ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅇ. | Core coda inventory represented. |
| §9 | Final neutralization of ㄲ/ㅋ, obstruent codas, and ㅍ. | Regular examples (닦다, 키읔, 키읔과, 옷, 있다, 젖, 빚다, 꽃, 쫓다, 솥, 앞, 덮다) are tested through the general engine so lexical entries cannot hide context-sensitive behavior. 웃다/뱉다 remain exact lexical entries only to preserve their source-documented long vowels. Direct Python tests cover each representative-coda class. Ukrainian targets remain provisional. |
| §10 | Simplification of ㄳ ㄵ ㄼ ㄽ ㄾ ㅄ in coda position; exceptions for 밟- and selected 넓- compounds. | Added exact NIKL lexical entries for 넋과 [넉꽈], 앉다 [안따], 여덟 [여덜], 넓다 [널따], 외곬 [외골], and the additional listed 밟- forms 밟소/밟지/밟게/밟고. The simple form 값 [갑] is tested through general coda rules. Browser and Python tests exercise 넓죽하다/넓둥글다 algorithmically; 넓둥글다 is deliberately not hidden by a lexical override. Ukrainian targets remain provisional. |
| §11 | Simplification of ㄺ ㄻ ㄿ in coda position; verb-stem ㄺ before ㄱ is exceptional. | Direct general-rule tests cover 닭 [닥], 늙지 [늑찌], 읊고 [읍꼬], 읊다 [읍따]. Exact entries cover 흙과 [흑꽈], 삶 [삼ː], 젊다 [점ː따], and the listed verb-stem ㄺ-before-ㄱ exceptions 맑게 [말께], 묽고 [물꼬], 얽거나 [얼꺼나]. The suite preserves a narrow lexical/morphological exception rather than applying ㄺ→ㄹ before every ㄱ. Ukrainian targets remain provisional. |
| §12 | ㅎ: aspiration, deletion, nasal realization, and interactions with ㄶ/ㅀ. | Regression coverage includes all explicit examples for aspiration, ㅎ+ㅅ fortition, ㅎ+ㄴ, ㅎ deletion before vowels, and phrase-level aspiration (옷 한 벌, 낮 한때, 꽃 한 송이). Generic-engine tests retain algorithmic coverage for forms such as 각하/먹히다/맏형; morphology-sensitive complex-coda cases use sourced entries only where the generic engine must fail closed. The §20 form 뚫는 is tested without a lexical override. Ukrainian targets remain provisional. |
| §13 | Single coda liaison before a vowel-initial formal morpheme. | Added official exact-form entries for 낮이 [나지], 꽂아 [꼬자], 꽃을 [꼬츨], 밭에 [바테], 앞으로 [아프로], 덮이다 [더피다], complementing existing examples 깎아/옷이/있어/쫓아. The browser still avoids guessing formal vs substantive morpheme boundaries. Ukrainian targets remain provisional. |
| §14 | Complex-coda liaison before a vowel-initial formal morpheme; second member moves, and ㅅ surfaces as fortis ㅆ. | Added exact official examples 핥아 [할타], 읊어 [을퍼], 값을 [갑쓸], 없어 [업ː써], 여덟이 [여덜비], 여덟을 [여덜블], complementing 넋이/값이/앉아/닭을/젊어/곬이. Exact entries avoid treating a spelling-only cluster as proof of morphology. Ukrainian targets remain provisional. |
| §15 | Coda before a vowel-initial substantive morpheme beginning with ㅏ/ㅓ/ㅗ/ㅜ/ㅟ: neutralize to the representative coda before resyllabification; only one consonant of a complex coda moves. 맛있다/멋있다 also have listed variants. | Sourced exact entries cover all listed word and phrase examples, including 밭 아래 [바다래], 늪 앞 [느밥], 꽃 위 [꼬뒤], 넋 없다 [너겁따], 닭 앞에 [다가페], 젖어미, 맛없다, 겉옷, 헛웃음, 값어치, and 값있는. Explicit variants remain available for 맛있다/멋있다. Phrase spacing is preserved; this remains a finite evidence-backed lexicon rather than a general morphology detector. Ukrainian targets remain provisional. |
| §16 | Special pronunciation of Korean consonant-letter names when particles/endings attach. | Added exact sourced entries for the 21 official NIKL examples involving 디귿/지읒/치읓/키읔/티읕/피읖/히읗 + 이/을/에. These are lexical exceptions, not a general letter-name morphology parser; Ukrainian targets remain provisional. |
| §17 | Palatalization of ㄷ/ㅌ(ㄾ) before ㅣ-initial formal morphemes; ㄷ+히 also yields 치. | Fixed over-broad trigger: palatalization is not a general rule before every j-glide vowel. The Python research rule requires an explicit §17 formal-morpheme or -히 license; the browser uses sourced exact-form entries and withholds unknown spelling-only candidates. The official [붙임] sequence ㄷ+ㅎ → ㅌ followed by ㅣ → ㅊ is documented and tested separately. |
| §18 | Nasal assimilation: coda obstruents surface as ㅇ/ㄴ/ㅁ before ㄴ/ㅁ. | Added source-backed official examples including 몫몫이, 키읔만, 읊는, 값매다 [감매다]; 밟는 remains algorithmic so its narrow ㄼ exception is still exercised. Regression checks cover all five cross-word examples in the NIKL [붙임]. Browser tests assert phrase IPA; Python tests assert nasalization in phrase mode. Ukrainian targets remain provisional. |
| §19 | ㄹ → ㄴ after coda ㄱ/ㅂ/ㅁ/ㅇ; after ㄱ/ㅂ, nasal assimilation also changes the coda. | Browser and Python engines apply §19 before §18. Added direct general-engine tests for official examples 침략 [침냑], 강릉 [강능], 막론 [망논], 석류 [성뉴], 협력 [혐녁], 법리 [범니], alongside 국립 and 독립문. Tests assert the ordered chain and avoid lexical overrides for these rule-governed forms. |
| §20 | Liquid assimilation: ㄴ and ㄹ become ㄹㄹ in licensed environments; listed lexical exceptions can instead have ㄹ → ㄴ. | General-rule tests cover 난로, 신라, 천리, 광한루, 대관령, 칼날, 물난리, 할는지, 닳는, 뚫는, 핥네. Source-backed exceptions include 의견란, 임진란, 생산량, 결단력, 공권력, 동원령, 상견례, 횡단로, 이원론, 입원료, 구근류. The generic tests explicitly retain algorithmic coverage for liquid assimilation and do not rely solely on dictionary overrides. Ukrainian targets remain provisional. |
| §21 | Other place-assimilation patterns are not accepted as standard merely because they are common in casual speech. | Added seven exact NIKL negative-control entries (감기, 옷감, 있고, 꽃길, 젖먹이, 문법, 꽃밭) to prevent nonstandard place assimilation from being treated as standard. Ukrainian targets remain provisional. |
| §22 | Optional glide [j] in specified verb-ending environments (e.g. 되어/피어 variants). | Added exact sourced entries and visible alternate readings for 되어/되여, 피어/피여, 이오/이요, and 아니오/아니요. This remains lexical coverage rather than a general morphology engine; Ukrainian targets remain provisional. |
| §23 | Fortition after obstruent codas (representative [ㄱ, ㄷ, ㅂ]). | Core contextual fortition implemented; Ukrainian output intentionally neutralizes fortisness while IPA retains it. A direct regression matrix now checks the fortis IPA marker for every official §23 example (국밥 through 값지다), including complex codas. Corrected eight legacy lexical target strings that had accidentally doubled Ukrainian consonants for fortisness (e.g. 깎아, 있어, 쫓아, 맛있다). |
| §24 | Fortition after verb-stem codas ㄴ(ㄵ), ㅁ(ㄻ) before specified endings; exceptions for causative/passive -기-. | Exact corpus covers all unambiguous official examples and the -기- exceptions, including 껴안다, 얹다, 더듬지, 닮고, 젊지, 앉고, plus 안기다/감기다/굶기다/옮기다. The official 신고 [신ː꼬] example is homographic with the noun 신고; it is deliberately not installed as a global override that would corrupt the noun reading. Productive morphology remains unimplemented for unseen forms. |
| §25 | Fortition after verb-stem ㄼ/ㄾ before specified endings. | Exact official examples 넓게/핥다/훑소/떫지 are regression-tested. This is lexical coverage, not a productive stem/ending parser. |
| §26 | Sino-Korean fortition after ㄹ before ㄷ/ㅅ/ㅈ, with exceptions. | Expanded official corpus includes 불소, 발전, 몰상식, 불세출 and negative controls 허허실실/절절하다, alongside 갈등/발동/절도/말살/일시/갈증/물질. Exceptions remain lexical; no blind ㄹ+consonant rewrite. |
| §27 | Fortition after adnominal -(으)ㄹ before specified consonants; phrasing/pauses matter. | Exact attached forms -(으)ㄹ걸/밖에/세라/수록/진대/지라도/지언정 and all eight official phrase examples (할 것을, 갈 데가, 할 바를, 할 수는, 할 적에, 갈 곳, 할 도리, 만날 사람) are regression-tested. Runtime licensing is pair-specific; arbitrary word-final ㄹ does not trigger fortition. The explicit pause exception still needs prosody modeling. |
| §28 | Compound fortition associated with a genitive saisiot relation, including forms without written ㅅ. | Exact NIKL corpus now covers the listed compounds 문고리, 눈동자, 신바람, 산새, 손재주, 길가, 물동이, 발바닥, 굴속, 술잔, 바람결, 그믐달, 아침밥, 잠자리, 강가, 초승달, 등불, 창살, 강줄기. This is a finite sourced lexicon; compound semantics are not generalized. |
| §29 | N-insertion in compounds/derivatives before 이/야/여/요/유; ㄹ + inserted ㄴ becomes ㄹ. NIKL commentary also discusses j-initial diphthongs such as 얘/예 and notes lexical/optional variation. | Every explicit word example in §29 is now represented: 솜이불, 홑이불, 막일, 삯일, 맨입, 꽃잎, 내복약, 한여름, 남존여비, 신여성, 색연필, 직행열차, 늑막염, 콩엿, 담요, 눈요기, 영업용, 식용유, 국민윤리, 밤윷; listed ㄹ+inserted-ㄴ forms; and 붙임 2 examples including 서른여섯, 스물여섯, 3 연대, 1 연대. Pair-specific phrase licenses cover 한 일, 옷 입다, 먹은 엿, 할 일, 잘 입다, 먹을 엿. No-insertion controls 6·25, 3·1절, 송별연, 등용문 remain. All five explicitly listed optional pairs (이죽이죽, 야금야금, 검열, 욜랑욜랑, 금융) are retained as alternatives; unseen compounds and additional prosodic variants remain open. |
| §30 | Pronunciation effects of written/underlying saisiot in compounds, including ㄴ/ㄴㄴ insertion patterns. | Corpus covers all examples listed in the standard's three subparts: principal/alternate forms for the ㄱ/ㄷ/ㅂ/ㅅ/ㅈ group, ㄴ realization before ㄴ/ㅁ, and ㄴㄴ insertion before 이 (including 도리깻열 and 뒷윷). Exact lexical data is not a general compound analyzer. |

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
