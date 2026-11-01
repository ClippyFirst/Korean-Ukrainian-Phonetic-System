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
