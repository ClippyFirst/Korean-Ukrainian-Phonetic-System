# Lexical evidence traceability audit — 2026-10-10

## Purpose and scope

This is a **metadata audit**, not a claim that these records lack normative support. It identifies lexical rows whose `rule_notes` do not explicitly name a numbered article (for example, `§18`) or cite the Standard Pronunciation Rules by title. Many notes already describe a sound process and point to an official National Institute of Korean Language (NIKL) source; the gap is that the mapping from that evidence to a numbered rule is not normalized.

Snapshot: `data/korean/lexical_pronunciations.csv` contains **520** rows; **69** rows meet the audit filter.

## Source-type counts

| Existing source URL type | Rows |
|---|---:|
| NIKL online Q&A | 30 |
| NIKL FAQ | 3 |
| NIKL standard-rules page | 36 |
| **Total requiring article-mapping review** | **69** |

## Resolved during follow-up

- `실제` was removed from the unresolved metadata queue after its rule note was corrected to *표준 발음법* §26 (Sino-Korean ㄹ + ㅈ fortition). The general rules page supports that rule family; an item-specific lexical citation for `실제[실쩨]` remains desirable, but it is no longer missing an article mapping.

## Resolved during follow-up

The following nine records received explicit article mappings after source review and are no longer in the unresolved queue: `밝는` (§§11, 18), `실없다` (§§10, 15, 23; with §13 explicitly ruled out for the substantive-morpheme boundary), `몇으로` (§13), `넋받이` (§§10, 17, 23), `밭이랑` (§§9, 18, 29), `집안일` (§§18, 29), `공업용` (§§18, 29), `얇실하다` (§§10, 23), and `짧다` (§§10, 23). The exact-word sources remain attached to their lexical rows.

## Required handling

- Do not assign a rule number from a guessed sound-process label. Verify the cited source and the exact Standard Pronunciation Rules clause first.
- Distinguish a rule-governed example, an official dictionary/Q&A lexical reading, a phrase or compound whose structure matters, and a project-level regression example.
- Preserve exact source URL, surface Hangul, IPA, and any variant information while editing metadata.
- Where a Q&A confirms a surface form but does not map it cleanly to one article, record it as **official lexical evidence / article mapping pending** rather than presenting it as direct article coverage.
- This list should be regenerated or updated whenever the lexical corpus changes. It is a review queue, not an instruction to append an arbitrary article number to every row.

## Review queue

| Input | Existing official source | Current note (preserved verbatim) | Next action |
|---|---|---|---|
| 값없다 | NIKL online Q&A | 실질 형태소 없- 앞에서 ㅄ 단순화 후 대표음 ㅂ이 이동; [가법따] | Verify source; map article or label lexical/corpus evidence |
| 의견란 | NIKL FAQ | 어휘적 ㄹ→ㄴ 예외; 의의 어휘적 읽기 및 장음은 이 항목에서만 명시 | Verify source; map article or label lexical/corpus evidence |
| 읽고 | NIKL online Q&A | 용언 어간 ㄺ 앞 ㄱ 계열 어미: ㄱ 탈락, ㄹ 유지; 된소리되기 | Verify source; map article or label lexical/corpus evidence |
| 읽다 | NIKL online Q&A | ㄺ의 일반 자음 앞 실현과 된소리되기 | Verify source; map article or label lexical/corpus evidence |
| 읽어 | NIKL online Q&A | 형식 형태소 어미 앞 ㄺ 연음: ㄹ은 종성, ㄱ은 다음 음절 초성 | Verify source; map article or label lexical/corpus evidence |
| 읽는 | NIKL online Q&A | ㄺ 단순화 후 비음화; [잉는] | Verify source; map article or label lexical/corpus evidence |
| 읽지 | NIKL online Q&A | ㄺ 단순화 후 된소리되기 | Verify source; map article or label lexical/corpus evidence |
| 맑게 | NIKL online Q&A | 용언 어간 ㄺ 앞 ㄱ 계열 어미: ㄹ 유지, ㄱ 탈락 | Verify source; map article or label lexical/corpus evidence |
| 맑고 | NIKL online Q&A | 용언 어간 ㄺ 앞 ㄱ 계열 어미: ㄹ 유지, ㄱ 탈락 | Verify source; map article or label lexical/corpus evidence |
| 맑다 | NIKL online Q&A | ㄺ의 일반 자음 앞 실현과 된소리되기 | Verify source; map article or label lexical/corpus evidence |
| 밝기 | NIKL online Q&A | 파생어에서도 용언 어간 ㄺ의 ㄱ 앞 예외 적용 | Verify source; map article or label lexical/corpus evidence |
| 닭고기 | NIKL online Q&A | 체언 닭-은 ㄱ 앞에서도 일반적으로 [ㄱ]; 된소리되기 | Verify source; map article or label lexical/corpus evidence |
| 꽃잎 | NIKL online Q&A | 합성어의 ㄴ 첨가와 비음화; 표준 발음 [꼰닙] | Verify source; map article or label lexical/corpus evidence |
| 밭이 | NIKL FAQ | 받침 ㅌ과 조사 이의 구개음화; 표준 발음 [바치] | Verify source; map article or label lexical/corpus evidence |
| 밭을 | NIKL FAQ | 받침 ㅌ의 모음 앞 연음; 표준 발음 [바틀] | Verify source; map article or label lexical/corpus evidence |
| 넓네 | NIKL online Q&A | ㄼ의 ㄹ 실현 후 ㄴ+ㄹ 유음화; 표준 발음 [널레] | Verify source; map article or label lexical/corpus evidence |
| 없다 | NIKL online Q&A | ㅄ 단순화와 된소리되기; 표준 발음 [업ː따], 길이는 IPA에 별도 표시 | Verify source; map article or label lexical/corpus evidence |
| 없는 | NIKL online Q&A | ㅄ 단순화 후 비음화; 표준 발음 [엄ː는] | Verify source; map article or label lexical/corpus evidence |
| 국물 | NIKL online Q&A | ㄱ 종성의 비음화; 표준 발음 [궁물] | Verify source; map article or label lexical/corpus evidence |
| 떡볶이 | NIKL online Q&A | 접미사 -이 앞에서 ㄲ 연음, ㄱ 계열 뒤 된소리되기; 표준 발음 [떡뽀끼] | Verify source; map article or label lexical/corpus evidence |
| 옷이 | NIKL online Q&A | 홑받침 ㅅ의 연음; ㅅ의 i 환경 표면 실현 | Verify source; map article or label lexical/corpus evidence |
| 대한민국 | NIKL standard-rules page | Core name; Ukrainian target remains provisional. | Verify source; map article or label lexical/corpus evidence |
| 국립국어원 | NIKL standard-rules page | 합성 기관명: 국립 [궁닙] + 국어원 [꾸거원]; 비음화와 경음화의 표면형을 고정. 우크라이나어 표기는 잠정적. | Verify source; map article or label lexical/corpus evidence |
| 먹었어요 | NIKL online Q&A | NIKL 답변: 먹었어요 [머거써요]; ㅆ 연음. 우크라이나어 표기는 잠정적. | Verify source; map article or label lexical/corpus evidence |
| 찍었어요 | NIKL online Q&A | NIKL의 과거형 연음 예시(먹었어요 [머거써요])와 표준국어대사전의 찍어 [찌거]를 결합한 형태; 표면형은 회귀 테스트로 고정. 우크라이나어 표기는 잠정적. | Verify source; map article or label lexical/corpus evidence |
| 국립국어원에서 | NIKL standard-rules page | 국립국어원 [궁님꾸거원] + 조사 에서; ㄴ 받침이 모음 초성으로 이어져 [궁님꾸거워네서]. 우크라이나어 표기는 잠정적. | Verify source; map article or label lexical/corpus evidence |
| 빗었어요 | NIKL standard-rules page | 빗- + -었어요: ㅅ 연음 및 ㅆ의 연음, [비서써요]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 읽었습니다 | NIKL standard-rules page | 읽- + -었습니다: ㄺ의 ㄱ 연음, ㅆ, 비음화; [일거씀니다]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 나중엔 | NIKL standard-rules page | 문장 corpus: 나중엔의 표면형을 보존. Ukrainian target is a project-level practical approximation. | Verify source; map article or label lexical/corpus evidence |
| 덥고 | NIKL standard-rules page | 덥- + -고: 받침 ㅂ 뒤 ㄱ 된소리되기; [덥꼬]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 밤에는 | NIKL standard-rules page | 밤 + 에는: 받침 ㅁ의 연음; [바메는]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 춥습니다 | NIKL standard-rules page | 춥- + -습니다: ㅂ 받침 뒤 ㅅ 된소리되기와 습니다의 비음 환경; [춥씀니다]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 머리를 | NIKL standard-rules page | 문장 corpus의 대조용 일반형; 표면형 [머리를]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 빗고 | NIKL standard-rules page | 빗- + -고: 받침 ㅅ의 대표음 [ㄷ] 및 ㄱ 된소리되기; [빋꼬]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 넓지만 | NIKL standard-rules page | 넓- + -지만: ㄼ의 ㄹ 실현과 뒤 ㅈ의 된소리되기; [널찌만]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 예쁘고 | NIKL standard-rules page | 표면형 [예쁘고]; Ukrainian target is a project-level practical approximation. | Verify source; map article or label lexical/corpus evidence |
| 짧아도 | NIKL standard-rules page | 짧- + -아도: ㄼ의 ㄹ은 받침으로 남고 ㅂ은 다음 음절 초성으로 연음; [짤바도]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 보러 | NIKL standard-rules page | 표면형 [보러]; Ukrainian target is a project-level practical approximation. | Verify source; map article or label lexical/corpus evidence |
| 일찍 | NIKL standard-rules page | 표면형 [일찍]; Ukrainian target is a project-level practical approximation. | Verify source; map article or label lexical/corpus evidence |
| 나갔습니다 | NIKL standard-rules page | 나가- + -았습니다: past-tense ending, 받침 중화 및 ㅅ 된소리되기; [나갇씀니다]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 꽃밭에 | NIKL standard-rules page | 꽃밭 + 에: 받침 중화·된소리되기·연음; 표면형 [꼳빠테]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 있던 | NIKL standard-rules page | 있- + -던: 받침 ㅆ의 대표음 [ㄷ]과 뒤 ㄷ의 된소리되기; [읻떤]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 학생의 | NIKL standard-rules page | 학생 + 의(관형격 조사): 학생의 [학쌩의]; 의의 조사 발음은 [에]도 허용됨. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 책을 | NIKL standard-rules page | 책 + 을: 받침 ㄱ의 연음, [채글]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 연구원은 | NIKL standard-rules page | 연구원 + 은: 원의 받침 ㄴ과 은의 연속; 표면형 [연구워는]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 발음과 | NIKL standard-rules page | 발음 + 과: 발음의 표면형 [바름] 및 과의 연결; Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |

| 발음의 | NIKL standard-rules page | 발음 + 의: 이 형태에서는 의를 [이]로 읽는 모델 경로를 기본값으로 기록. 조사 의의 [에] 계열은 별도 variant로 검토. | Verify source; map article or label lexical/corpus evidence |
| 차이를 | NIKL standard-rules page | 표면형 [차이를]; Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 자세히 | NIKL standard-rules page | 표면형 [자세히]; onset ㅎ은 프로젝트 모델에 따라 г로 근사. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 설명했어요 | NIKL standard-rules page | 설명 + 했어요: ㅆ이 있는 과거형의 표면 발음 [설명해써요]; 형태소별 문자 치환을 하지 않음. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 딸이 | NIKL standard-rules page | 딸 + 이: 받침 ㄹ의 연음 및 모음 사이 ㄹ의 탄설음 실현; [따리]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 흙을 | NIKL standard-rules page | ㄺ 겹받침이 모음으로 시작하는 조사 을 앞에서 ㄹ은 종성, ㄱ은 다음 음절 초성으로 실현; 표준 표면형 [흘글]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 밟으며 | NIKL standard-rules page | 용언 밟-의 ㄼ 특례; 모음으로 시작하는 어미 -으며 앞의 표준 표면형 [발브며]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 낡은 | NIKL standard-rules page | ㄺ 겹받침이 모음으로 시작하는 어미 -은 앞에서 ㄹ은 종성, ㄱ은 다음 음절 초성으로 실현; 표준 표면형 [날근]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 놓인 | NIKL standard-rules page | ㅎ 받침 뒤에 모음으로 시작하는 형식 형태소가 올 때 ㅎ 탈락; 표준 표면형 [노인]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 밟았습니다 | NIKL standard-rules page | 밟-의 ㄼ 특례에 따른 연음과 과거형 -았- 및 -습니다의 된소리되기·비음화를 반영; 표준 표면형 [발바씀니다]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 맑은 | NIKL standard-rules page | ㄺ 겹받침이 모음으로 시작하는 어미 -은 앞에서 ㄹ은 종성, ㄱ은 다음 음절 초성으로 실현; 표준 표면형 [말근]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 있었고 | NIKL online Q&A | Morphological sequence 있- + -었- + -고; exact sourced-pattern entry preserves the ㅆ liaison, coda neutralization and fortition before ㄱ; surface [이썯꼬]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 웃었고 | NIKL standard-rules page | Morphological sequence 웃- + -었- + -고; ㅅ liaison before -었-, then ㅆ coda neutralization and fortition before ㄱ; surface [우섣꼬]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 넓어졌다는 | NIKL standard-rules page | Compositional standard reading with intervocalic voicing of ㅈ: ㄼ in 넓- before vowel-initial -어 gives [널버]; ㅆ in 졌 is [ㄷ] before 다, with fortition [ㄸ]; surface [널버젇따는]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 삶다 | NIKL online Q&A | NIKL Q&A confirms [삼ː따]; ㄻ simplifies to ㅁ and lexical vowel length is retained in IPA. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 넓어 | NIKL online Q&A | NIKL 사전 활용형 및 표준 발음 확인: ㄼ의 ㄹ은 종성에 남고 ㅂ은 어미 -어 앞에서 연음; [널버]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 넓으니 | NIKL online Q&A | NIKL 사전 활용형: ㄼ의 ㄹ은 종성에 남고 ㅂ은 으니의 초성으로 연음; [널브니]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 넓은 | NIKL online Q&A | NIKL 사전 활용형: ㄼ의 ㄹ은 종성에 남고 ㅂ은 관형형 어미 -은 앞에서 연음; [널븐]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 넓습니다 | NIKL online Q&A | NIKL 사전 활용형: ㄼ 단순화와 ㅅ 된소리되기, ㅂ+ㄴ 비음화가 반영된 [널씀니다]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 넓지 | NIKL online Q&A | NIKL 사전 활용형: ㄼ 단순화 후 ㅈ 된소리; [널찌]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 값있다 | NIKL online Q&A | NIKL Q&A 316101 explicitly gives 값있다[가빋따]. Do not apply ㄴ insertion by environment alone; lexicalized 표준 발음. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 곧이어 | NIKL online Q&A | NIKL Q&A 316101 explicitly gives 곧이어[고디어]; no ㄴ insertion in this lexical item. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 음용 | NIKL online Q&A | NIKL Q&A 279931 explicitly explains 음용[으묭]; ㄴ insertion is not automatic even where the environment might suggest it. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
