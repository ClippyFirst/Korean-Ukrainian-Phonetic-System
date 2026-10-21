# Surface regression source adjudication — 2026-10-21

## Purpose and limits

The practical-mode contract and the normative Korean standard answer different questions. The fixture's `expectedSurface` remains the pinned JavaScript g2pK port output. `normativeSurface` is an independent comparator from the National Institute of Korean Language (NIKL) standard or a rule-derived candidate; it must never rewrite practical-mode output.

Primary authority: [NIKL Standard Pronunciation Rules](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002). All rule-based case links in the machine-readable surface fixture use this canonical desktop full-text route; the retired mobile-route URL is rejected by a regression test. This follow-up added direct official Q&A evidence for 넋이, 몫이, 값이, 국립, 협력, and 독립문; those source URLs are recorded per case in the fixture and in `research/SOURCE-REGISTER.csv`. 

## Case inventory

| Input | Pinned JS-port output | Normative comparator | Evidence status | Source locator / note |
|---|---|---|---|---|
| 넋이 | 넉씨 | 넉씨 | Direct NIKL Q&A | [Official Q&A qna_seq=323740](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=73&pageIndex=1&qna_seq=323740) explicitly confirms 넋이[넉씨] and explains the §14/§23 sequence |
| 몫이 | 목씨 | 목씨 | Direct NIKL Q&A | [Official Q&A qna_seq=335008](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=90&pageIndex=1&qna_seq=335008) directly lists 몫이[목씨] |
| 값이 | 갑씨 | 갑씨 | Direct NIKL Q&A | [Official Q&A qna_seq=330274](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=73&pageIndex=1&qna_seq=330274) explicitly confirms 값이[갑씨] and cites §14 |
| 값어치 | 갑써치 | 가버치 | Direct NIKL example | §15 붙임 explicitly gives 값어치[가버치]; [official NIKL FAQ](https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5949&mn_id=217) |
| 숲이 | 수피 | 수피 | Direct NIKL example | §13 explicitly lists 숲이[수피] |
| 같이 | 가치 | 가치 | Direct NIKL example | §17 palatalization |
| 굳이 | 구지 | 구지 | Direct NIKL example | §17 palatalization |
| 닭이 | 달기 | 달기 | Direct NIKL example | §13 formal-morpheme liaison |
| 밟는 | 밤는 | 밤는 | Direct NIKL example | §§10, 18; NIKL preserves vowel length [밤ː는], which this Hangul-only surface field cannot encode |
| 넓죽하다 | 널쭈카다 | 넙쭈카다 | Direct NIKL example | §10 exception explicitly gives 넓-죽하다[넙쭈카다] |
| 읽고 | 익꼬 | 일꼬 | Direct NIKL Q&A | [NIKL Online Q&A](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=315279) |
| 읽는 | 잉는 | 잉는 | Direct NIKL Q&A | §§11, 18; [NIKL Online Q&A](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=306000) |
| 국립 | 궁닙 | 궁닙 | Direct NIKL Q&A | [Official Q&A qna_seq=328893](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=328893) explicitly derives 국립[궁닙] as [국닙→궁닙] under §§19→18 |
| 협력 | 혐녁 | 혐녁 | Direct NIKL Q&A | [Official Q&A qna_seq=330091](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=330091) explicitly confirms 협력[협녁→혐녁] under §§19→18 |
| 독립문 | 동님문 | 동님문 | Direct NIKL Q&A | [Official Q&A qna_seq=314644](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=314644) explicitly confirms 독립문[동님문] under §§19 and 18 |
| 칼날 | 칼랄 | 칼랄 | Direct NIKL example | §20 |
| 물난리 | 물랄리 | 물랄리 | Direct NIKL example | §20 |
| 서울역 | 서울력 | 서울력 | Direct NIKL example | §29 붙임 1 |

## Findings

- **18/18** rows have a directly attested NIKL example or official Q&A comparator in this inventory.

- **3/18** known port/normative divergences are intentionally preserved in practical mode: 값어치 (갑써치 vs 가버치), 넓죽하다 (널쭈카다 vs 넙쭈카다), and 읽고 (익꼬 vs 일꼬).
- **IPA gold remains 0/18 independently adjudicated.** Official Korean surface spellings do not by themselves establish the repository's broad IPA transcription or its Ukrainian rendering.
- The fixture is a compact regression set, not a representative corpus or a statistically valid accuracy benchmark. It contains no held-out evaluation set.

## Reproducible artifacts

- Machine-readable cases: `tests/fixtures/g2pk-surface-regression.json`
- Port-parity gate: `tests/g2pk-browser-parity-gate.test.mjs`
- Evidence metadata gate: `tests/normative-surface-evidence-fixture.test.mjs`

## Acceptance disposition

**PARTIAL / evidence-limited.** The normative comparator layer is explicit and directly source-attested for all 18 cases, including the explicit §13 example `숲이[수피]`. IPA gold remains 0/18 independently adjudicated. These Korean-surface source upgrades do not validate the project's IPA or Ukrainian target layer.
