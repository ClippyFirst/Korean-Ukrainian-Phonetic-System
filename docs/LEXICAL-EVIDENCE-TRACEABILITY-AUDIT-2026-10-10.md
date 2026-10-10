# Lexical evidence traceability audit — 2026-10-10

## Purpose and scope

This is a **metadata audit**, not a claim that these records lack normative support. It identifies lexical rows whose `rule_notes` do not explicitly name a numbered article (for example, `§18`) or cite the Standard Pronunciation Rules by title. Many notes already describe a sound process and point to an official National Institute of Korean Language (NIKL) source; the gap is that the mapping from that evidence to a numbered rule is not normalized.

Snapshot: `data/korean/lexical_pronunciations.csv` contains **520** rows; **8** rows meet the audit filter.

## Source-type counts

| Existing source URL type | Rows |
|---|---:|
| NIKL online Q&A | 0 |
| NIKL FAQ | 0 |
| NIKL standard-rules page | 8 |
| **Total requiring article-mapping review** | **8** |

## Resolved during follow-up

- `실제` was removed from the unresolved metadata queue after its rule note was corrected to *표준 발음법* §26 (Sino-Korean ㄹ + ㅈ fortition). The general rules page supports that rule family; an item-specific lexical citation for `실제[실쩨]` remains desirable, but it is no longer missing an article mapping.

## Resolved during follow-up

The following nine records received explicit article mappings after source review and are no longer in the unresolved queue: `밝는` (§§11, 18), `실없다` (§§10, 15, 23; with §13 explicitly ruled out for the substantive-morpheme boundary), `몇으로` (§13), `넋받이` (§§10, 17, 23), `밭이랑` (§§9, 18, 29), `집안일` (§§18, 29), `공업용` (§§18, 29), `얇실하다` (§§10, 23), and `짧다` (§§10, 23). The exact-word sources remain attached to their lexical rows.

## Resolved during follow-up

Nine more rows were assigned explicit rule references or documented as rule-specific negative controls: `삶다` (§§11, 23), `넓어` (§14), `넓으니` (§14), `넓은` (§14; exact bracketed reading remains indirectly supported), `넓습니다` (§§10, 18, 23; rule-derived), `넓지` (§§10, 23), `값있다` (§29 non-application of ㄴ-insertion), `곧이어` (§29 non-application of ㄴ-insertion), and `음용` (§29 non-application of ㄴ-insertion). For `넓습니다`, the source URL now points to the official rule text rather than implying the related dictionary-form Q&A directly lists the full conjugated form.

## Resolved during follow-up

Twelve further rows now have explicit article mappings or a directly supported rule trace: `값없다` (§§10, 15, 23), `의견란` (§20), `읽고` (§§11, 23), `읽다` (§§11, 23), `읽어` (§14; its source URL was corrected to the exact NIKL answer), `읽는` (§§11, 18), `읽지` (§§11, 23), `맑게` (§§11, 23), `맑고` (§§11, 23; exact-word attestation remains indirect), `맑다` (§§11, 23; source now points to the official rules page), `밝기` (§§11, 23), and `닭고기` (§§11, 23).

## Resolved during follow-up

Nine more records received explicit rule mappings based on their linked official evidence: `꽃잎` (§§9, 18, 29), `밭이` (§17), `밭을` (§13), `넓네` (§§10, 20), `없다` (§§10, 23), `없는` (§§10, 18), `국물` (§18), `떡볶이` (§23, with the remaining morphological liaison step explicitly left unclaimed by the source), and `옷이` (§13). `대한민국` remains a baseline/no-rewrite control; it has not been forced into an article mapping merely to clear the queue.

## Resolved or reclassified during follow-up

Nine additional forms now carry explicit rule traces: `국립국어원` (§§18, 19, 23), `먹었어요` (§13), `찍었어요` (§13; component sources documented), `국립국어원에서` (§§13, 18, 19, 23), `빗었어요` (§13), `읽었습니다` (§§9, 14, 18, 23), `덥고` (§23), `밤에는` (§13), and `춥습니다` (§§18, 23). Three unchanged controls were explicitly reclassified so the audit does not force meaningless article numbers: `대한민국` is a baseline control; `나중엔` and `머리를` are corpus controls whose corpus provenance remains pending.

## Resolved or reclassified during follow-up

Nine further rows now have explicit rule traces: `빗고` (§§9, 23), `넓지만` (§§10, 23), `짧아도` (§14), `나갔습니다` (§§9, 18, 23), `꽃밭에` (§§9, 13, 23), `있던` (§§9, 23), `학생의` (§§5, 23; variant-sensitive), `책을` (§13), and `연구원은` (§13). Three unchanged surface forms were reclassified as baseline controls rather than given fabricated rule numbers: `예쁘고`, `보러`, and `일찍`.



## Resolved during follow-up

Seven additional rows now have explicit *표준 발음법* mappings while preserving evidence limits: `밟으며` (§14), `낡은` (§14), `놓인` (§12), `밟았습니다` (§§14, 18, 23), `맑은` (§14), `있었고` (§§9, 13, 23; related NIKL evidence only, not exact-word attestation), and `웃었고` (§§9, 13, 23). `넓어졌다는` deliberately remains in the unresolved queue because its full compositional derivation and article scope need independent verification; do not assign a blanket article list.

## Required handling

- Do not assign a rule number from a guessed sound-process label. Verify the cited source and the exact Standard Pronunciation Rules clause first.
- Distinguish a rule-governed example, an official dictionary/Q&A lexical reading, a phrase or compound whose structure matters, and a project-level regression example.
- Preserve exact source URL, surface Hangul, IPA, and any variant information while editing metadata.
- Where a Q&A confirms a surface form but does not map it cleanly to one article, record it as **official lexical evidence / article mapping pending** rather than presenting it as direct article coverage.
- This list should be regenerated or updated whenever the lexical corpus changes. It is a review queue, not an instruction to append an arbitrary article number to every row.

## Review queue

| Input | Existing official source | Current note (preserved verbatim) | Next action |
|---|---|---|---|
| 발음과 | NIKL standard-rules page | 발음 + 과: 발음의 표면형 [바름] 및 과의 연결; Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |

| 발음의 | NIKL standard-rules page | 발음 + 의: 이 형태에서는 의를 [이]로 읽는 모델 경로를 기본값으로 기록. 조사 의의 [에] 계열은 별도 variant로 검토. | Verify source; map article or label lexical/corpus evidence |
| 차이를 | NIKL standard-rules page | 표면형 [차이를]; Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 자세히 | NIKL standard-rules page | 표면형 [자세히]; onset ㅎ은 프로젝트 모델에 따라 г로 근사. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 설명했어요 | NIKL standard-rules page | 설명 + 했어요: ㅆ이 있는 과거형의 표면 발음 [설명해써요]; 형태소별 문자 치환을 하지 않음. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 딸이 | NIKL standard-rules page | 딸 + 이: 받침 ㄹ의 연음 및 모음 사이 ㄹ의 탄설음 실현; [따리]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 흙을 | NIKL standard-rules page | ㄺ 겹받침이 모음으로 시작하는 조사 을 앞에서 ㄹ은 종성, ㄱ은 다음 음절 초성으로 실현; 표준 표면형 [흘글]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
| 넓어졌다는 | NIKL standard-rules page | Compositional standard reading with intervocalic voicing of ㅈ: ㄼ in 넓- before vowel-initial -어 gives [널버]; ㅆ in 졌 is [ㄷ] before 다, with fortition [ㄸ]; surface [널버젇따는]. Ukrainian target provisional. | Verify source; map article or label lexical/corpus evidence |
