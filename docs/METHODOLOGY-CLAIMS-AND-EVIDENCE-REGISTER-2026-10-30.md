# Методологія: реєстр тверджень і доказів — оновлено 2026-10-31

## Призначення

Це доказовий індекс публічних і дослідницьких тверджень корейсько-українського сервісу. Він пов'язує кожне важливе формулювання з кодом, тестом, першоджерелом або відтворюваним вимірюванням. Документ **не замінює** `research/SOURCE-REGISTER.csv`, `research/RULE-COVERAGE.csv`, benchmark-suite register або машинні звіти: він відповідає на інше запитання — що саме можна безпечно стверджувати на підставі наявних доказів.

## Статуси

- **DONE_VERIFIED** — реалізація або вимірювання відтворюється, а визначені acceptance criteria мають конкретні докази.
- **PARTIAL** — частина реалізації/вимірювання є, але повні acceptance criteria не виконані.
- **BLOCKED / EVIDENCE-LIMITED** — потрібен незалежний gold, фахове adjudication, дозвіл або інший конкретний зовнішній доказ.
- **DEFERRED** — явно поза поточним обсягом.

## Реєстр тверджень

| ID | Твердження | Статус | Докази | Дозволене формулювання | Не стверджувати |
|---|---|---|---|---|---|
| M-01 | Вебсервіс має два різні browser pronunciation paths | DONE_VERIFIED | `src/app/g2pk_web.js`, `src/app/engine.js`, browser contracts, `docs/methodology.md` | Звичайний режим використовує локальний JS-порт g2pK; докладний режим — власний Kozak Kim | Що це два режими одного й того самого рушія |
| M-02 | Обидва browser paths формують український кандидат через IPA-first adapter | DONE_VERIFIED | `src/app/engine_ipa.js`, `tests/ipa-first-runtime-invariant.test.mjs`, trace/runtime tests | Український кандидат проходить через спільний IPA→український адаптер | Що український вихід незалежно обчислюється прямою заміною Hangul-графем |
| M-03 | Native engine має Strict, Soft і Super-soft | DONE_VERIFIED | `src/app/engine_convert.js`, `src/app/soft_morphology.js`, methodology/coverage contracts | Це три політики одного native engine з різними межами припущень | Що це три незалежні рушії або що Super-soft гарантує правильну вимову |
| M-04 | Super-soft покриває всі 11 172 сучасні складові блоки Hangul у визначеному software contract | DONE_VERIFIED — inventory contract | `tests/super-soft-coverage.test.mjs` та fixtures | 100% технічного покриття визначеного набору сучасних складових блоків | 100% лексичної, морфологічної або фонетичної точності |
| M-05 | Native і g2pK мають близькі exact-match результати на двох діагностичних корпусах | DONE_VERIFIED як відтворюване вимірювання; generalization EVIDENCE-LIMITED | Run [41141286672](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41141286672), artifact `13019822857`; 10 ordered ledgers per corpus | UGTPHON: native 1,430/2,698 scored = 53.0022% (5 abstentions), g2pK 0.9.4 1,435/2,703 = 53.0892%. SIGMORPHON: native 357/998 scored = 35.7715% (1 abstention), g2pK 0.9.4 353/999 = 35.3353%. Paired exact-classification McNemar exact two-sided p=0.125 on each corpus. | Що один рушій статистично або універсально кращий; що це нормативна точність; що exact-match вимірює український target quality |
| M-06 | У конкретному Python benchmark harness native мав менший час виконання, ніж g2pK | DONE_VERIFIED лише для цього runner/harness | Artifact `13019822857`, UGTPHON unique-word runtime, 1,907 words, one warm-up plus five repetitions | Median total time: native 712.053 ms, g2pK 41,863.406 ms (≈58.79× у цьому harness); native p95 0.611322 ms/word, g2pK p95 22.270451 ms/word | Універсальне прискорення для браузера, пристрою, production workload або іншого timing scope |
| M-07 | CharsiuG2P показував значно вищий raw reference match в історичному comparative-only run | PARTIAL / HISTORICAL; generalization BLOCKED | Історичний run [40843579685](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40843579685); поточний run [41141286672](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41141286672) пропустив Charsiu inference | Історично спостерігалися 88.531% UGTPHON і 70.971% SIGMORPHON; ці значення не є результатом поточного corrected benchmark | Публікувати їх як актуальне порівняння, gold oracle або доказ незалежного узагальнення |
| M-08 | CharsiuG2P training contamination виключено | BLOCKED / EVIDENCE-LIMITED | Доступний public training file має потенційні перетини з 508 UGTPHON і 729/999 SIGMORPHON тестових форм; повний checkpoint manifest відсутній | Ризик перетину відомий, фактичне використання кожної форми у навчанні не доведене | Стверджувати як доведений leakage або як гарантовано чистий holdout |
| M-09 | CharsiuG2P checkpoint weights мають підтверджену redistribution license | BLOCKED | У доступних checkpoint metadata немає підтвердженої явної ліцензії саме ваг | Не розповсюджувати ваги; окремо перевіряти код, модель, tokenizer і dataset licenses | Приписувати вагам MIT/Apache без підтвердження |
| M-10 | Український IPA-to-target layer незалежно валідований | BLOCKED / EVIDENCE-LIMITED | Немає незалежно adjudicated Ukrainian target gold і user study | Це практична модель із простежуваним IPA-derived шляхом | Що українські форми оптимальні, нормативні або експертно сертифіковані |
| M-11 | Нормативна корейська вимова native engine незалежно встановлена | BLOCKED / EVIDENCE-LIMITED | Немає репрезентативного незалежного NIKL-style holdout з фаховим adjudication | Є джерельно підтверджені приклади, регресії та діагностичні benchmark results | Абсолютну точність, per-rule accuracy або загальну перевагу |
| M-12 | Поточний main CI підтверджує реалізацію, збірку й розгортання | DONE_VERIFIED для software gates | Main `ca6133890139f76c88253b2b1d0bbc3a6191601a`; system [41144925083](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41144925083), tests [41144925101](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41144925101), artifacts [41144925095](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41144925095), Pages [41144925073](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41144925073) | 1,341/1,341 browser tests; Python 3.11/3.12/3.13; web tests/build; clean wheel installation; teacher-corpus audit; strict corpus/artifact generation; Pages deploy, HTTP smoke and live Playwright smoke | Що CI доводить незалежну лінгвістичну правильність. NIKL metadata-only inventory у цих runs — SKIPPED |
| M-13 | Corrected extended multi-engine benchmark implementation інтегрований у main | DONE_VERIFIED | PR [#401](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/401), merged as `eb8e1f100e8aca377aef05a2aa896756c909ec5c`; benchmark run [41141286672](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41141286672) | Corrected per-metric gold selection, nearest-rank p95, 10-engine comparison, ordered ledgers and coverage disclosure are in main | Що це доводить незалежну нормативну якість корпусів або українського target |
| M-14 | Baseline emits a complete occurrence ledger for every engine on both datasets | DONE_VERIFIED як artifact contract | Artifact `13019822857`; schema v1; 10 engines × 2,703 UGTPHON and 10 × 999 SIGMORPHON occurrences; source identity/order/aggregate recomputation checks | Усі ledgers мають впорядковані occurrence IDs, однакові source identity triples і totals, що перераховуються в aggregate reports | Що ledger validation дорівнює мовній adjudication |
| M-15 | Two independent specialist reviews for the Korean IPA gate are complete | BLOCKED | Issue [#337](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/issues/337) remains open with no qualified submissions. Potential leads, not contacted and not yet accepted: [Yoonjung Kang](https://www.linguistics.utoronto.ca/people/directories/all-faculty/yoonjung-kang) (Korean phonology/phonetics interface), [Taehong Cho](https://site.hanyang.ac.kr/web/hipcs/faculty) (phonetics, laboratory phonology, Korean speech), [Seongyeon Ko](https://www.qc.cuny.edu/academics/cmalc/seongyeon-ko/) (Korean linguistics, phonetics/phonology). Availability and conflicts of interest remain unchecked. | Потрібні дві незалежні packet-based annotations під визначеною IPA convention | Що CI або benchmark замінює людське фахове adjudication |
| M-16 | Neural inference and joined neural-vs-baseline aggregation are complete | PARTIAL / SKIPPED | Run [41141286672](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41141286672); Charsiu, ByT5 and paired neural jobs skipped under default-off opt-in | Поточний non-neural portfolio and ledgers are verified; neural comparison requires explicit research-only dispatch | Що skipped jobs passed or that a fresh neural result exists |
| M-17 | KoG2Padvanced upstream license is established | BLOCKED | Benchmark source/license audit reports no declared upstream license | Не поширювати upstream code/weights unless permission is established | Будь-яку конкретну permissive license без джерела |

## Ключові методологічні правила

1. Публікувати scored denominator, coverage і abstentions поряд з exact match.
2. Exact match, CER, PER і feature-weighted proxy — різні метрики; feature proxy — проєктне діагностичне визначення, не універсальний стандарт.
3. Розрізняти full-set і shared-subset comparisons; occurrence IDs мають бути вирівняні для paired analysis.
4. Не переносити Korean IPA scores на українську цільову якість.
5. Порівнювати runtime лише за сумісних timing scopes, runner і repetition policy.
6. Neural outputs можуть бути candidate/teacher evidence, але не стають gold і не породжують production rules автоматично.
7. Позначати training overlap як contamination risk, якщо checkpoint manifest не доводить фактичне використання форм.
8. Ліцензії коду, моделі, ваг, tokenizer і dataset — окремі питання.
9. Не перетворювати пропущені jobs, неперевірені джерела або припущення на позитивні результати.

## Основні джерела

- [Main commit `2cd049762fc2a1bd5ea85428762b9ceb2c4d3130`](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/commit/2cd049762fc2a1bd5ea85428762b9ceb2c4d3130).
- [Corrected benchmark rerun 41141286672](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41141286672), artifact `13019822857`.
- [Benchmark suite register](KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md).
- [Canonical execution plan and handoff](MASTER-EXECUTION-PLAN-AND-CHAT-HANDOFF.md).
- [Reviewer gate issue #337](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/issues/337).

## Maintenance rule

Оновлювати цей реєстр, коли змінюється публічне твердження, метрика, статус моделі, джерельна ліцензія або acceptance status. Не переносити score на публічну сторінку без run, corpus, denominator, metric, version і interpretation note.


## 2026-11-01 — raw-surface retrieval and contextual G2P evidence

| ID | Claim / status | Evidence | Supported interpretation | Not established |
|---|---|---|---|---|
| M-18 | Train-only raw-surface retrieval gives a small paired improvement — DONE_VERIFIED as diagnostic | UGTPHON run [41325015010](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41325015010), artifact `13090704109` | On 2,624 shared tokens: exact 51.3720% → 51.6006 (+0.2287 pp), CER 10.0783% → 9.9730 (−0.1054 pp); 6 exact wins, 0 losses; 22/722 noncanonical hits | A general UGT solution, a production-ready normalizer, or canonical G2P improvement |
| M-19 | Exact-context retrieval has low observed test coverage — DONE_VERIFIED | Same artifact: 297 context keys, 0 test context hits; 15 surface and 7 B1-signature hits | Current exact local-context lookup does not generalize to unseen test contexts; retrieval hit rate is 3.0471% of noncanonical tokens | That a trained sentence-context model would fail |
| M-20 | Kiwi/MeCab analyzer consensus is not an aggregate improvement — DONE_VERIFIED as negative diagnostic | Run [41325014982](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41325014982), artifact `13090938199` | Four unique forms changed; exact rate unchanged; paired CER worsened by 0.000087; 1 lower-distance and 2 higher-distance occurrences | That analyzer consensus is pronunciation gold or should enter strict runtime |
| M-21 | Sentence context is the strongest published Korean UGT lever — DONE_VERIFIED literature finding | Jeon et al., Findings EMNLP 2026, [ACL Anthology](https://aclanthology.org/2026.findings-emnlp.1020/), Table 4 / §4.3 [PDF](https://aclanthology.org/2026.findings-emnlp.1020.pdf) | Korean PERnc: Word→Word 47.5; Sent→Word 28.1; Sent→Word+retrieval 27.7; staged decoding without retrieval 33.1; all three 32.0. Context helps; retrieval adds little; staged decoding harms this Korean setup. | That the paper's model can be reproduced by exact-context lookup or that its score transfers to this deterministic engine |
| M-22 | Canonical browser benchmark remains diagnostic, not normative gold — DONE_VERIFIED as reporting boundary | Browser report artifact `13090704104` | 2,699/2,703 scored; 52.9085% exact; CER 8.2441%; 99.852% coverage | Independent Korean phonetic adjudication or Ukrainian target accuracy |

### New methodological rule

Keep canonical G2P, raw-surface normalization, and IPA annotation-convention sensitivity as separate tracks. Use the paired shared subset for normalizer deltas; always report rescued/lost tokens, unsupported inputs, canonical false rewrites and category coverage. Do not tune canonical phonology to UGT annotation symbols or promote analyzer/model candidates without independent evidence.


## 2026-11-01 — Kozak Kim browser parity and original g2pK paired baseline

| ID | Claim / status | Evidence | Supported interpretation | Not established |
|---|---|---|---|---|
| M-23 | Browser IPA now matches the existing Python broad-profile handling of NIKL §5 exception 1 — DONE_VERIFIED | Code head c7e2ce4; tests in tests/nikl-articles-4-5-vowel-variants.test.mjs; system run [41331679290](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41331679290) and test run [41331679310](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41331679310) | Browser IPA renders the ㅕ glide as [ʌ] after ㅈ/ㅉ/ㅊ in the covered surface forms and records a trace rule. This removes a cross-runtime inconsistency. | That every residual /j/ mismatch is the same phenomenon, or that all Korean dialect/phonetic variation is resolved |
| M-24 | Paired browser Kozak Kim vs untouched original g2pK diagnostic — DONE_VERIFIED as a diagnostic | External run [41331679243](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41331679243), artifact 13093672281 | 2,699 shared occurrences; exact 53.4272% each; CER 8.1358% vs 8.2138%; 4 exact wins each; sentence-cluster bootstrap (264 row clusters, 2,000 resamples) exact delta CI [−0.207,+0.201] pp and CER delta CI [−0.166,0.000] pp | A statistically robust overall exact-match advantage; broad-candidate scores are not normative |
| M-25 | UGTPHON exact-match discordances require source adjudication — DONE_VERIFIED as an adjudication finding | Same paired artifact; NIKL Q&A 311009, NIKL Q&A 331569, NIKL §24 teacher-training material, NIKL 2022 usage survey; source-backed tests in tests/kozak-kim-vs-original-g2pk-browser.test.mjs | Four apparent g2pK-only exacts are 없는, where the source-backed long vowel is omitted from the UGTPHON gold. 못잃어 and 인기 are variant-sensitive; 닮다 and 넘게 are supported Kozak-Kim wins. | That a small hand-adjudicated subset establishes population-level superiority |
| M-26 | Rule 5 browser correction improves the browser benchmark — DONE_VERIFIED as a measured regression result | Pre-fix browser artifact 13090704104; post-fix artifact 13093477739 | Strict exact 1,428→1,442 (+14); broad-candidate exact 2,496→2,521 (+25); strict CER 8.2441%→8.1358%; broad-candidate CER 1.3427%→1.2301%. | That broad-candidate exact is normative Korean accuracy |

### Comparison protocol

The raw g2pK JavaScript source is instantiated directly and is not modified. Its raw surface Hangul is passed only through Kozak Kim's shared convertSurface segment-to-IPA adapter; Kozak Kim's contextual phonological rules are not run over that surface. Exact match accepts any corpus-listed IPA alternative. CER is paired on a shared best reference. The bootstrap resamples UGTPHON row IDs to preserve within-sentence dependence.

### Current research boundary

Do not promote general R010/R012/R013/R028 fortition or compound rules based on a final coda alone. Their conditioning depends on stem, morpheme, compound and lexical boundaries. The current explicit source-backed licenses remain conservative until a verified morphology-boundary layer and an independent dev/holdout evaluation exist. The original g2pK baseline remains unchanged.


## 2026-11-01 — Kozak Kim §26 exact 출산-family repair

| ID | Claim / status | Evidence | Supported interpretation | Not established |
|---|---|---|---|---|
| M-27 | Bounded §26 출산-family fortition repair — DONE_VERIFIED for original four forms; PARTIAL for `저출산` follow-up | Official NIKL Basic Dictionary search; source register `SRC-NIKL-DIC-CHULSAN`; exact-head Actions [41336800458](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41336800458) and paired browser run [41336800424](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41336800424), artifact `13095038704` | Kozak Kim now emits `출싼` for exact licensed 출산-family forms, including the test occurrence `비출산`; g2pK is unchanged. `비출산` is one IPA edit closer to the UGTPHON target; exact rate remains tied, CER improves slightly. `저출산` is an official dictionary-backed positive control, not a benchmark win. | Productive Sino-Korean morphology, universal R012 coverage, independent normative IPA accuracy, or overall superiority |

The §26 rule remains exact-form and boundary-conditioned. The NIKL dictionary directly records `출산[출싼]`, `출산율[출싼뉼]`, `출산하다[출싼하다]`, and `저출산[저ː출싼]`. The original four-form runtime set is CI/benchmark verified; the additional `저출산` control was authored afterward and awaits exact-head CI. The implementation does not infer Sino-Korean status from a raw `ㄹ+ㅅ` sequence. NIKL's §26 explanations also note lexical constituent boundaries and exceptions. Item-level KOGL rights remain review-required.

 
## 2026-11-01 — additional discrepancy claims and evidence boundaries

| Claim | Evidence | Status / limitation |
|---|---|---|
| 실시간 requires fortis ㅆ at the Sino-Korean 실>시간 boundary | NIKL lexical source lists 實時間; NIKL Standard Pronunciation Rule §26; exact Kozak Kim license and positive/negative tests | Supported for this exact source-attested form; no general ㄹ+ㅅ inference. |
| 이중성 has long vowel and fortis onset | NIKL Korean Basic Dictionary directly lists 이중성(二重性) [이ː중썽]; project derives IPA iː.dʑuŋ.s͈ʌŋ | Korean surface/IPA entry supported; IPA symbols are project-derived; Ukrainian target provisional. UGTPHON gold omits length, so edit-distance tie is not an authoritative contradiction. |
| Derivational suffix -성 is a potential fortition family | NIKL Basic Dictionary defines suffix -성; NIKL Q&A 312649 directly confirms 의외성[의ː외썽] | Research candidate only. Q&A question text mentions 유사성 but answer does not directly confirm it; no productive rule or output for 유사성. |
| Unspaced 했을시 / 일수도있다는 should receive §27 fortition | UGTPHON occurrence-level examples and NIKL §27 general rule | Not licensed: corpus whitespace is missing and morphological boundaries are not independently established. |

The corresponding primary sources are registered as SRC-NIKL-INFO-SILSIGAN, SRC-NIKL-DIC-IJUNGSEONG, SRC-NIKL-DIC-SEONG-SUFFIX, and SRC-NIKL-QNA-312649. Item-level reuse rights remain unreviewed.


## 2026-11-01 — exact-head Kozak Kim paired-browser reproducibility

| ID | Claim | Status | Evidence | Supported interpretation | Not established |
|---|---|---|---|---|---|
| M-18 | Current native Kozak Kim vs untouched original g2pK paired browser result | DONE_VERIFIED as a reproducible diagnostic measurement; generalization EVIDENCE-LIMITED | Exact-head PR #416 commit `0c7688bb91687fec81965f426c24dd248df918bb`; UGTPHON workflow [41342607471](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342607471), browser pair artifact `13097847614`; exact-head system [41342607492](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342607492) | On 2,699 shared occurrences, exact match is tied at 1,442/2,699 (53.4272%); Kozak Kim CER is 8.1184% vs g2pK 8.2138%, paired delta -0.09536 pp, sentence-cluster 95% CI [-0.18443, -0.02046] pp. Current normalized-IPA discordance set: 26 occurrences. | Universal or normative superiority; exact-match advantage; independent Korean IPA gold; Ukrainian target quality; item-level NIKL/KOGL reuse clearance |

The 26 current IPA-discordant occurrences must not be conflated with the 23 cases in the original pre-§27/§26 snapshot. The historical occurrence ledger contains 27 rows across snapshots; row `paired-17` preserves the resolved `올게이` false-positive as historical evidence. The latest artifact reproduces the immediately preceding paired artifact `13098181051` with no output changes on the shared subset. The UGTPHON metadata-only source inventory was skipped; optional ByT5/Charsiu inference and joined neural pairing were also skipped. No score or rights status is inferred from skipped jobs.


## Kozak Kim discrepancy-review evidence — 2026-11-01

| ID | Claim | Status | Evidence | Allowed statement | Do not claim |
|---|---|---|---|---|---|
| M-18 | NIKL morphology sources support conditional §27 analyses for two named C08 forms | PARTIAL / CONTEXT-LIMITED | NIKL Q&A [327466](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=327466) parses `둘 다일 수도` as noun + `이-` + `-(으)ㄹ` + dependent noun `수` + `도`; NIKL 2021 guideline p.106 gives `규칙을 어겼을 시에는`; Standard Pronunciation Rule §27 gives `할 수는[할쑤는]`. | If the missing utterance confirms `무고일 수도` or `했을 시`, the general §27 environment is a strong basis for fortition. | That either exact corpus utterance or its pronunciation has been directly attested; that a new rule is already implemented; that `-성` generalizes. |
| M-19 | C01–C07 blind pilot packets are prepared | PARTIAL / BLOCKED FOR SCORING | Seven source-blind JSON packets, separate neutral reviewer instructions, and regression test; run `41346666445` passes 1,369 browser tests. | Seven six-item pilot manifests exist and omit system identities and candidate/reference IPA. | That full context, rights clearance, independent reviewer submissions, or cluster-wide adjudication are complete. |
| M-20 | C08 occurrence-level mapping is complete | BLOCKED | Cluster summary claims 8 cases; the current 27-row occurrence ledger contains no C08 rows. Three source-row IDs were recovered from artifact `13097847614`; five remain unidentified. | Three exact rows are traceable; the other five require recovery from the original cluster extraction. | That all eight C08 cases have been individually source-reviewed. |


| M-21 | Kozak Kim has a small paired diagnostic advantage over original g2pK 0.9.4 on SIGMORPHON 2021 lexical gold | DONE_VERIFIED as an artifact-backed diagnostic; generalization EVIDENCE-LIMITED | Run [41344981358](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41344981358), artifact `13099523369`; 998 paired items. Kozak: 358/998 exact (35.8717%), CER 14.6225%; g2pK: 353/998 exact (35.3707%), CER 14.8106%. Paired row-cluster bootstrap delta (g2pK − Kozak): exact `[-1.0020,-0.1002]` pp; CER `[+0.0250,+0.3859]` pp. | On this pinned lexical diagnostic, Kozak is modestly better by exact match and CER; five native-only exact cases, zero g2pK-only exact, one native abstention. | Universal superiority, normative NIKL accuracy, sentence-context accuracy, Ukrainian target quality, or a fully independent IPA encoding comparison. g2pK shares the project's segment renderer; SIGMORPHON IPA conventions differ; neural jobs skipped. |


| M-22 | C01–C07 blind pilot packets include complete source context and can be sent for independent pilot review | DONE_VERIFIED for packet preparation; independent review TODO | 39/39 unique source-row IDs resolved against official UGTPHON Korean `ko/test.json`; all target tokens present; `ko/LICENSE` states Apache-2.0; raw source text only, no canonical/IPA annotations. Regression test asserts source context, license status, and absence of system/reference leakage. | Seven six-item system-blind pilot packets are ready for independent first-pass IPA review under the declared Korean subset license, with attribution preserved. | That the clusters are fully adjudicated, all 464/261/etc. occurrences are reviewed, reviewers have submitted results, or upstream MultiLexNorm++ provenance/terms have undergone independent legal review. |


## 2026-11-01 — C01–C07 blind packets, C08 source contexts and sentence-level R013 parity

| ID | Claim / status | Evidence | Supported interpretation | Not established |
|---|---|---|---|---|
| M-27 | C01–C07 independent IPA packet preparation — DONE_VERIFIED as packet generation | Seven neutral packets blind-ipa-C01.json–blind-ipa-C07.json; 42 entries; 39 unique UGTPHON source-row IDs; packet test rejects system/baseline identity and IPA leakage | The packages are ready for two independent first-pass reviews; source sentence context and attribution are present | That any independent review has occurred, that the 39 rows are a complete cluster census, or that packet generation is linguistic adjudication |
| M-28 | C08 source-context/morphology recovery — PARTIAL | Fixture tests/fixtures/kozak-kim-c08-source-contexts.json; UGTPHON rows multilexnorm2026_1953, multilexnorm2026_1979, dc_inside_2024; NIKL Q&A 327466, 313481, 333044, 312649; Standard Pronunciation Rule §27 | Two existing exact-form licenses have source-context and morphology support for conditional rule derivations; 유사성 remains unresolved; five of eight C08 occurrence IDs remain missing | Direct IPA gold for either C08 positive; a general -성 or ㄹ+ㅅ rule; complete resolution of C08 |
| M-29 | Python/browser exact R013 word-license parity inside sentences — DONE_VERIFIED for covered cases | Python rule-license path now matches exact word forms to the containing eojeol; full-sentence tests in tests/test_end_to_end.py and tests/nikl-morphology-guard-matrix-24-30.test.mjs; system run 41352607970 | The two exact same-eojeol C08 licenses fire inside full sentences in both runtimes, with a negative unresolved 유사성 control | Complete cross-runtime parity for every rule, IPA profile or Ukrainian output |
| M-30 | Latest paired browser Kozak Kim vs original g2pK diagnostic — DONE_VERIFIED as a diagnostic | Run 41352607907, artifact 13102275101; 2,699 shared occurrences; 1,442/2,699 exact for each; paired CER 8.1097% vs 8.2138%; delta −0.1040 pp; 95% sentence-cluster CI −0.1951 to −0.0261 pp | Lower CER point estimate with a non-zero cluster-bootstrap interval on this noisy diagnostic; exact-match rate is tied and its interval crosses zero. Exactly two Kozak Kim C08 outputs improved by one edit relative to the prior PR #416 artifact; g2pK outputs did not change | Normative Korean accuracy, universal superiority, exact-match superiority, independent IPA adjudication or Ukrainian-target quality |
| M-31 | Source-rights register updated for C08 morphology sources — PARTIAL | research/SOURCE-REGISTER.csv now has 151 rows; rights audit: 142 REVIEW_REQUIRED, 7 MANUAL_CLASSIFICATION_REQUIRED, 1 item-level license recorded, 1 not applicable | Q&A 313481/333044 are registered as morphology sources; the 2021 NIKL PDF is supplementary only and not used as production evidence | Item-level NIKL reuse permission or release clearance |

The browser paired report remains diagnostic: four Kozak Kim abstentions, zero engine errors, and no statistically supported exact-match winner. CharsiuG2P/ByT5 inference and NIKL metadata-only inventory were skipped; no fresh neural or metadata-inventory result is claimed.



## 2026-11-01 — analyzer cross-check and supervised-training readiness

| ID | Claim / status | Evidence | Supported interpretation | Not established |
|---|---|---|---|---|
| M-32 | Independent morphology analyzer cross-check for C08 — DONE_VERIFIED as a diagnostic | Kiwi/MeCab-Ko run 41353171166; artifacts 13102576042 (Kiwi), 13101838045 (MeCab-Ko), 13102406365 (consensus) | Both identify the target boundary before 수 in 무고일수도있다는; they disagree on 했을시 (ETM+NNB vs EC) and 유사성 (suffix vs lexical noun). Disagreement is preserved, not majority-voted. | Gold morphology, pronunciation, IPA or permission to generalize a suffix rule |
| M-33 | Supervised IPA training-readiness audit — DONE_VERIFIED as an audit; training NOT READY | Partial artifact 13101748305 from cancelled multi-engine run 41353171180 attempt 2; 644 unique lexical rows; zero additions explicitly marked independently adjudicated IPA gold; 24 frozen holdout cases without IPA gold; no holdout overlap | Training-data readiness is demonstrably insufficient for supervised IPA training; no leakage was detected in the checked overlap tests | That provisional/model-selected IPA candidates are gold, or that a supervised model should be trained |

The full multi-engine comparison did not complete: runs 41353171180 and 41353450707 were cancelled during the comparison step. No comparative score is claimed from partial artifact 13101748305; its training-readiness JSON is a separate completed audit. The training-readiness JSON is a separate completed audit within that artifact.


## Revalidation snapshot — 2026-11-02

- Latest completed browser pair: Actions run [41353450686](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41353450686), artifact `13102456604`; 2,699 shared scored occurrences; exact match 53.4272% for both Kozak Kim and untouched original g2pK; CER 8.1097% vs 8.2138%; paired CER delta −0.1040 pp, 95% sentence-cluster CI [−0.1951, −0.0261] pp. This is a corpus/profile-specific diagnostic, not normative IPA gold.
- System/Python and browser regression/build run [41353450715](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41353450715) passed on code/test head `bc7b1474eecfe8df8006572abf0f07957f829647`. The subsequent branch head `ccc423a79fe854fba365f3966d78ceadda978036` changes a source-register assertion only; it was not covered by that run. The next branch update must receive fresh CI before exact-head verification is claimed.
- C01–C07 packets are prepared for pilot review (7 packets, 42 entries, 39 unique source rows), but independent review submissions remain blocked. C08 context recovery is partial (3/8 occurrences); five occurrence IDs remain unidentified; `유사성` remains unresolved. No additional production rule was justified.
- Source register: 152 rows; 143 review-required, 7 manual-classification-required, 1 item-level license recorded, 1 not applicable. NIKL item-level reuse rights remain open.
- Multi-engine run `41354753780` was cancelled and optional neural inference was skipped; no multi-engine score is available.


## C08 occurrence mapping revalidation — 2026-11-02

| Claim | Status | Evidence | Allowed statement | Do not claim |
|---|---|---|---|---|
| All eight C08 working occurrences have source-row/context mappings | PARTIAL / TRACEABILITY-LIMITED | Pinned UGTPHON Korean test split revision `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`; paired pre/post artifacts `13097847614` and `13102456604`; fixture `tests/fixtures/kozak-kim-c08-source-contexts.json`. Two existing rows were independently recovered earlier; five more were reconstructed by exact target-token and fortis-mismatch signature; one (`유사성`) remains lexically unresolved. | All eight working C08 rows now have exact pinned source sentence contexts; the five reconstructed memberships are explicitly labelled inferred because the original extraction table is missing. | That the missing original extraction artifact has been recovered; that UGTPHON IPA is normative gold; that all seven conditional morphologies have been independently adjudicated. |
| Five newly mapped forms have conditional §27 morphology leads | PARTIAL / RULE-ENVIRONMENT-ONLY | NIKL Q&A 317798 (`할 것을[할꺼슬]`, §27 cohesion); 310899 (colloquial dependent noun `거`); 331601 (`알 수 없는[알쑤엄는]`); 336313 (`할 듯[할뜯]`); plus existing Q&A 307960, 327466, 313481 and 333044. | Source material supports conditional morphological/rule environments for `해줄것`, `많을거같이`, `보일거라`, `내릴수있는`, and `안할듯`; each exact UGC token remains unadjudicated. | Direct token-specific IPA attestation; guaranteed fortition without prosodic review; permission to add production exceptions; any suffix-wide rule. |
| Two exact C08 output changes are attributable to the bounded context licenses | DONE_VERIFIED as artifact comparison | Pre-context pair artifact `13097847614` vs current pair artifact `13102456604`; only `무고일수도있다는` and `했을시` changed on the shared token set, each changing the targeted plain onset to fortis; g2pK outputs unchanged. | The two exact-form changes are isolated and attributable to the current Kozak Kim branch; the paired result remains a noisy-corpus diagnostic. | A statistically independent IPA win, universal superiority, or validation of Ukrainian target orthography. |

Four newly registered NIKL records (Q&A 317798, 310899, 331601, 336313) remain `REVIEW_REQUIRED` for item-level rights. Source register now has 155 rows: 146 review-required, 7 manual-classification-required, 1 item-level license recorded, 1 not applicable. No production phonology code changed in this C08 context-recovery follow-up.
