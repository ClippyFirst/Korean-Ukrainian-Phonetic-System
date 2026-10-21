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
| 숲이 | 수피 | 수피 | Rule-derived candidate | §13 formal-morpheme liaison; the current enumerated examples do not list this word |
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

- **17/18** rows have a directly attested NIKL example or official Q&A comparator in this inventory.

- **3/18** known port/normative divergences are intentionally preserved in practical mode: 값어치 (갑써치 vs 가버치), 넓죽하다 (널쭈카다 vs 넙쭈카다), and 읽고 (익꼬 vs 일꼬).
- **IPA gold remains 0/18 independently adjudicated.** Official Korean surface spellings do not by themselves establish the repository's broad IPA transcription or its Ukrainian rendering.
- The fixture is a compact regression set, not a representative corpus or a statistically valid accuracy benchmark. It contains no held-out evaluation set.

## Reproducible artifacts

- Machine-readable cases: `tests/fixtures/g2pk-surface-regression.json`
- Port-parity gate: `tests/g2pk-browser-parity-gate.test.mjs`
- Evidence metadata gate: `tests/normative-surface-evidence-fixture.test.mjs`

## Acceptance disposition

**PARTIAL / evidence-limited.** The normative comparator layer is explicit and source-linked for all 18 cases; 17 have direct NIKL examples or official Q&A attestations, while `숲이` remains rule-derived because the official enumerated examples do not directly attest this lexical form. IPA gold remains 0/18 independently adjudicated. These Korean-surface source upgrades do not validate the project's IPA or Ukrainian target layer.


## Evidence correction — 2026-10-21

A prior fixture edit marked `숲이[수피]` as a direct §13 example. Re-reading the primary NIKL page showed that the enumerated §13 examples do **not** include this word. The claim was too strong and has been reverted: `숲이` is again `derived-from-NIKL-rule`, and the direct-evidence count is **17/18**. The general liaison rule supports the candidate, but it is not a direct lexical attestation. Do not restore a direct status unless an exact official source is found.


## Formal-morpheme boundary controls added — 2026-10-21

A targeted official-source search found two NIKL Online Q&A answers that strengthen the lexical boundary evidence around the still rule-derived case `숲이`:

- `숲을` → `[수플]`, explicitly explained under §13: [official NIKL Q&A qna_seq=332248](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=261&pageIndex=1&qna_seq=332248).
- `숲에` → `[수페]`; the answer explicitly rejects `[숩페]` as a standard pronunciation: [official NIKL Q&A qna_seq=331304](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=27&pageIndex=1&qna_seq=331304).

Both forms are now added to the machine-readable surface fixture as direct lexical comparators, with separate source-register entries and regression checks. The fixed fixture expands from 18 to 20 cases. Current evidence count: **19/20 direct NIKL surface attestations**; `숲이[수피]` remains **rule-derived**, because neither the official §13 enumerated examples nor these two Q&A answers directly attest that exact form. The negative `숩페` control guards against treating a perceived closure interval as a separate coda.

The exact implementation head `0e0b96080335fec8fe04e7bd9d302d7b1e8a2183` passed **1,074/1,074 Node tests**, Vite build, Python regression/data-integrity checks, and master-table/corpus artifact checks: [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39674707274), [test matrix](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39674707281), [corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39674707413). The browser port and Python g2pK both emitted `수플` and `수페`; the two new cases passed. They do not add IPA gold: independently adjudicated IPA remains **0/20**. Korean surface attestation does not establish IPA transcription or Ukrainian target correctness.


## Independent IPA gold queue — 2026-10-21

The remaining source-to-IPA gap is now represented as a machine-readable queue at `research/ipa-adjudication-queue.json`, with a regression gate in `tests/ipa-adjudication-queue.test.mjs`. It mirrors all 20 surface-regression cases, retains each exact source URL and evidence class, and intentionally leaves candidate IPA, syllabification, vowel-length decisions, reviewer fields, and final IPA null. Every case is explicitly `BLOCKED_SPECIALIST_ADJUDICATION`; Ukrainian target review is a separate task.

This is a workflow improvement, **not a reduction in the scientific blocker**: independently adjudicated IPA gold remains 0/20. Exact implementation head `9b8eb59caad60afc7637a8feb95b60112f78d170` passed 1,077/1,077 Node tests, Vite build, Python 3.11/3.12/3.13 checks, and corpus artifact validation. The queue's acceptance criteria require independent broad-IPA transcription, documented syllable boundaries and relevant length/segmental contrasts, a second independent review, explicit reconciliation of disagreements, and source/method citations. NIKL's Hangul pronunciation notation is not treated as IPA. In particular, `밟는` must not lose the length distinction in the NIKL notation `[밤ː는]`, while `숲이` retains its rule-derived evidence status.


## IPA queue resolution gate — 2026-10-22

- Branch: `research/ipa-queue-adjudication-gate-2026-10-22`, based on main `aedfa30707fa00038a20b60c16d523cc01be6166`.
- Updated `research/ipa-adjudication-queue.json` to schema version 2. Reviewer records now reserve explicit qualification, review timestamp, and method/reference fields rather than only an ID/IPA/notes tuple.
- Updated `tests/ipa-adjudication-queue.test.mjs` so the gate remains fail-closed for all 20 current unresolved cases, but also defines the acceptance contract for future real resolutions: two distinct traceable reviewers, parseable timestamps, method references, explicit syllable boundaries, a non-unresolved vowel-length decision, final IPA, and reconciliation notes. The test also rejects duplicate IDs, partial reviewer records on blocked cases, and attempts to attach a candidate IPA while status remains blocked.
- A synthetic sentinel record exercises the future-resolved branch of the validator; it is explicitly test-only and is not Korean IPA data. The actual 20 queue entries remain unchanged scientifically: candidate IPA is null, both reviewer records are empty, final IPA is null, and every case remains `BLOCKED_SPECIALIST_ADJUDICATION`.
- Acceptance status: `DONE_VERIFIED` when the PR-head Node/Python/build and artifact CI completes. Scientific status remains `BLOCKED_SPECIALIST_ADJUDICATION`: 0/20 independent IPA-gold judgments; Ukrainian target-layer review is separate. This change makes a future expert batch easier to record without weakening evidence requirements or pretending that the missing expert work has been done.
