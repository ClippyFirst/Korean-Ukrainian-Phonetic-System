# 2026-11-02 methodology/evidence addendum — Kozak Kim

## 2026-11-02 — Kozak Kim cross-runtime evidence and parity continuation

**Scope:** Kozak Kim only. Original g2pK code and vendor files remain unchanged. No new general phonological rule was added.

**Repository state:** branch `fix/kozak-kim-broad-version-metadata-2026-11-02`; Draft PR #421 stacked on Draft PR #420; code/test head `b4ace0eba2d1573cd78b1e6a971de5556a0bcb3c`. Starting point was PR #420 head `2db86dd97eab99fc18d5fa30c82febb76d5a4068`. No merge, release, deployment, or branch deletion.

| Work item | Status | Evidence / acceptance |
|---|---|---|
| Browser Broad IPA v2 metadata contract | DONE_VERIFIED | Browser report now keeps numeric `broad_candidate_benchmark_version: 2`; regression test covers actual `evaluateRows()` output. |
| IPA adjudication overlay in Browser runtime | DONE_VERIFIED | App and benchmark merge the existing IPA-adjudication CSV with appended metadata column preserved. `삶의` retains source-backed Hangul `살믜` / `살메`, but IPA and Ukrainian output are withheld. |
| Native R013 false abstention | DONE_VERIFIED | Exact attached `-ㄹ게` / attested `-ㄹ게요` completion gate is shared by rule and abstention logic. Internal substrings `올게이` / `할게이` remain non-R013 controls and return provisional, non-diagnostic-only project IPA. |
| Broad-profile Browser surface coda rendering | DONE_VERIFIED | Shared research profile renders representative final coda (`있다` → `읻따`); default Browser legacy profile remains `있따`. |
| Python regression/data integrity | DONE_VERIFIED | System verification run 41447654924 PASS (`python -m pytest -q`). |
| Browser regression/build | DONE_VERIFIED | System verification run 41447654924 PASS; 1,382 / 1,382 tests; `npm run build`; generated-page checks. |
| Browser/Native occurrence-level IPA parity | PARTIAL | Multi-engine run 41447654927 completed its Browser comparison and parity-audit steps successfully; exact artifact is still being assembled during the SIGMORPHON phase. Do not claim a numerical parity rate until the artifact is read. |
| Full Browser surface parity | PARTIAL | Direct Browser report 13143156104: 2,698 scored / 2,703 eligible. Preliminary comparison to the Native ledger showed 2,693 equal surfaces, four differences on morphology-abstained cases, and six missing Browser surface reconstructions. Final occurrence audit artifact is authoritative. |
| Broad v2 target thresholds | PARTIAL / NOT MET | Browser direct UGTPHON: Broad exact 86.2861%, Broad CER 2.2083%, five unresolved, zero engine errors; target 90%+ exact / CER ≤2% not met. |
| Original g2pK baseline | DONE_VERIFIED | Paired Native/g2pK diagnostic run 41447654997 PASS; no g2pK source/vendor files changed. |
| Independent IPA gold | BLOCKED | Frozen 24-item holdout and reviewer A/B packets exist; two qualified independent reviewers and adjudication are still required. |
| NIKL item-level reuse rights | BLOCKED | Official metadata inventory was SKIPPED; item-level KOGL clearance remains unverified. |
| Ukrainian target adaptation review | BLOCKED | Requires independent Ukrainian phonetic/orthographic expert review. |
| CharsiuG2P / ByT5 inference | DEFERRED | Both optional inference jobs were SKIPPED by workflow policy; no inference result is claimed. |

### Comparative results — do not mix profiles

**Native strict IPA vs original g2pK**, 2,698 paired UGTPHON occurrences:
- Kozak Native: 53.0393% strict exact; 9.0657% CER.
- g2pK: 53.1134% strict exact; 9.2304% CER.
- Kozak has lower CER; g2pK has a 0.0741 percentage-point strict-exact point edge.

**Browser legacy-default vs original g2pK**, 2,698 paired occurrences:
- Exact match tied at 53.4469%.
- Browser CER 8.0728% vs g2pK 8.2072%; paired sentence-cluster 95% CI for Browser-minus-g2pK CER delta: [−0.2246, −0.0531] percentage points.
- This is a separate legacy-default diagnostic, not the shared Broad profile.

**Browser shared Broad v2 direct UGTPHON**:
- 2,698 / 2,703 scored; 86.2861% Broad exact; 2.2083% Broad CER; five unresolved; zero engine errors.
- These corpus-relative metrics are not normative IPA accuracy. The original g2pK adapter uses the project's shared segment renderer, so it is not an independent IPA encoder.

### Exact CI commands and outcomes

- `npm install --no-audit --no-fund` — PASS.
- `npm test` → `node --experimental-strip-types --test tests/*.test.mjs` — PASS, 1,382 tests.
- `npm run build` → dictionary preparation + Vite production build — PASS.
- `test -f dist/index.html && test -f dist/system.html` — PASS.
- `python -m pip install -e ".[dev,all]"` — PASS.
- `python -m pytest -q` — PASS.
- Browser G2P integration run 41447654972 — PASS.
- Paired Native/g2pK run 41447654997 — PASS.
- External UGTPHON diagnostic run 41447654983 — PASS.
- Kiwi + MeCab-Ko morphology consensus run 41447654952 — PASS.
- Exhaustive test-case register extraction run 41447654941 — PASS; extracted classification queue still requires manual review.
- Research morphology adapter smoke run 41447655002 — PASS.
- Optional g2pK integration run 41447654921 — PASS; baseline code/vendor unchanged.
- Multi-engine run 41447654927: multi-engine comparison, Browser same-occurrence comparison, and Native/Browser parity-audit steps PASS; SIGMORPHON benchmark and artifact upload still running at this snapshot.
- NIKL metadata-only inventory — SKIPPED.
- CharsiuG2P and ByT5 inference — SKIPPED.
- Local pytest/npm were not run in this session; verification was performed by GitHub Actions.

**Readiness:** partial research prototype, not release-ready and not research-certified. The next evidence gates are the final multi-engine/SIGMORPHON artifact, independent IPA adjudication, item-level source-rights review, and independent Ukrainian target review.

## Evidence classification
- Native/g2pK and Browser/g2pK comparisons are **DIFFERENTIAL_ONLY**: useful for locating disagreements and relative behavior, not normative IPA gold.
- Browser Broad v2 scores are corpus-relative sensitivity diagnostics, not independent IPA accuracy.
- `삶의` Hangul forms are source-attested; its IPA remains `HYPOTHESIS_UNRESOLVED` until independent reviewers adjudicate it.
- R013 `올게이` / `할게이` changes are a correction to rule-environment gating, not new source claims.
- Broad-profile surface rendering is a serialization alignment using an existing representative-coda function; it does not add a phonological rule.
- No new source-register row or license permission is claimed.

---

# Методологія: реєстр тверджень і доказів — оновлено 2026-11-02

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
| M-19 | C01–C07 blind pilot packets are prepared | PARTIAL / BLOCKED FOR SCORING | Seven system-blind/reference-withheld JSON packets, reviewer instructions, and regression test; source-row IDs and public sentences remain identifiable. Current packet mode explicitly records this limitation; reviewers are instructed not to retrieve corpus IPA/reference annotations. | Seven six-item pilot manifests exist and omit system identities and candidate/reference IPA; source identity is not hidden, so this is not source-identity-blind review. | That full context, rights clearance, independent reviewer submissions, or cluster-wide adjudication are complete. |
| M-20 | C08 occurrence-level mapping is complete | BLOCKED | Cluster summary claims 8 cases; the current 27-row occurrence ledger contains no C08 rows. Three source-row IDs were recovered from artifact `13097847614`; five remain unidentified. | Three exact rows are traceable; the other five require recovery from the original cluster extraction. | That all eight C08 cases have been individually source-reviewed. |


| M-21 | Kozak Kim has a small paired diagnostic advantage over original g2pK 0.9.4 on SIGMORPHON 2021 lexical gold | DONE_VERIFIED as an artifact-backed diagnostic; generalization EVIDENCE-LIMITED | Run [41344981358](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41344981358), artifact `13099523369`; 998 paired items. Kozak: 358/998 exact (35.8717%), CER 14.6225%; g2pK: 353/998 exact (35.3707%), CER 14.8106%. Paired row-cluster bootstrap delta (g2pK − Kozak): exact `[-1.0020,-0.1002]` pp; CER `[+0.0250,+0.3859]` pp. | On this pinned lexical diagnostic, Kozak is modestly better by exact match and CER; five native-only exact cases, zero g2pK-only exact, one native abstention. | Universal superiority, normative NIKL accuracy, sentence-context accuracy, Ukrainian target quality, or a fully independent IPA encoding comparison. g2pK shares the project's segment renderer; SIGMORPHON IPA conventions differ; neural jobs skipped. |


| M-22 | C01–C07 blind pilot packets include complete source context | DONE_VERIFIED for packet preparation; EXTERNAL DISTRIBUTION BLOCKED pending rights review; independent review TODO | 39/39 unique source-row IDs resolved against official UGTPHON Korean `ko/test.json`; all target tokens present; `ko/LICENSE` states Apache-2.0; raw source text only, no canonical/IPA annotations. Regression test asserts source context, license status, and absence of system/reference leakage. The packet README explicitly requires rights clearance before sharing. | Seven six-item system-blind/reference-withheld, source-identifiable pilot packets are prepared for independent first-pass IPA review; external distribution must wait for item-level rights clearance, with attribution preserved and a no-corpus-gold-lookup instruction. | That the clusters are fully adjudicated, all 464/261/etc. occurrences are reviewed, reviewers have submitted results, or upstream MultiLexNorm++ provenance/terms have undergone independent legal review. |


## 2026-11-01 — C01–C07 blind packets, C08 source contexts and sentence-level R013 parity

| ID | Claim / status | Evidence | Supported interpretation | Not established |
|---|---|---|---|---|
| M-27 | C01–C07 independent IPA packet preparation — DONE_VERIFIED as packet generation | Seven system-blind/reference-withheld packets blind-ipa-C01.json–blind-ipa-C07.json; 42 entries; 39 unique UGTPHON source-row IDs; source identity remains visible; packet test rejects system/baseline identity and IPA leakage | The packages are ready for two independent first-pass reviews; source sentence context and attribution are present | That any independent review has occurred, that the 39 rows are a complete cluster census, or that packet generation is linguistic adjudication |
| M-28 | C08 source-context/morphology recovery — PARTIAL | Fixture tests/fixtures/kozak-kim-c08-source-contexts.json; UGTPHON rows multilexnorm2026_1953, multilexnorm2026_1979, dc_inside_2024; NIKL Q&A 327466, 313481, 333044, 312649; Standard Pronunciation Rule §27 | Two existing exact-form licenses have source-context and morphology support for conditional rule derivations; 유사성 remains unresolved; five of eight C08 occurrence IDs remain missing | Direct IPA gold for either C08 positive; a general -성 or ㄹ+ㅅ rule; complete resolution of C08 |
| M-29 | Python/browser exact R013 word-license parity inside sentences — DONE_VERIFIED for covered cases | Python rule-license path now matches exact word forms to the containing eojeol; full-sentence tests in tests/test_end_to_end.py and tests/nikl-morphology-guard-matrix-24-30.test.mjs; system run 41352607970 | The two exact same-eojeol C08 licenses fire inside full sentences in both runtimes, with a negative unresolved 유사성 control | Complete cross-runtime parity for every rule, IPA profile or Ukrainian output |
| M-30 | Latest paired browser Kozak Kim vs original g2pK diagnostic — DONE_VERIFIED as a diagnostic | Run 41358508374, artifact 13103483761; 2,699 shared occurrences; 1,442/2,699 exact for each; paired CER 8.1097% vs 8.2138%; delta −0.1040 pp; 95% sentence-cluster CI −0.1951 to −0.0261 pp | Lower CER point estimate with a non-zero cluster-bootstrap interval on this noisy diagnostic; exact-match rate is tied and its interval crosses zero. Exactly two Kozak Kim C08 outputs improved by one edit relative to the prior PR #416 artifact; g2pK outputs did not change | Normative Korean accuracy, universal superiority, exact-match superiority, independent IPA adjudication or Ukrainian-target quality |
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
- Exact-head push run [41358504664](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41358504664) and PR run [41358508399](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41358508399) passed on code/test head `8b22f778112442024f876061bd0e576af762e761`; final docs-only head `5a9be85723924c89f4602c743553e67c3c89005d`, including Python/data integrity and browser regression/build.
- C01–C07 packets are prepared for system-blind/reference-withheld pilot review (7 packets, 42 entries, 39 unique source rows); source identity remains inferable, reviewers are instructed not to retrieve corpus gold, and independent review submissions remain blocked. C08 context recovery is partial (3/8 occurrences); five occurrence IDs remain unidentified; `유사성` remains unresolved. No additional production rule was justified.
- Source register: 155 rows; 146 review-required, 7 manual-classification-required, 1 item-level license recorded, 1 not applicable. NIKL item-level reuse rights remain open.
- Multi-engine run `41354753780` was cancelled and optional neural inference was skipped; no multi-engine score is available.


## C08 occurrence mapping revalidation — 2026-11-02

| Claim | Status | Evidence | Allowed statement | Do not claim |
|---|---|---|---|---|
| All eight C08 working occurrences have source-row/context mappings | PARTIAL / TRACEABILITY-LIMITED | Pinned UGTPHON Korean test split revision `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`; paired pre/post artifacts `13097847614` and `13102456604`; fixture `tests/fixtures/kozak-kim-c08-source-contexts.json`. Two existing rows were independently recovered earlier; five more were reconstructed by exact target-token and fortis-mismatch signature; one (`유사성`) remains lexically unresolved. | All eight working C08 rows now have exact pinned source sentence contexts; the five reconstructed memberships are explicitly labelled inferred because the original extraction table is missing. | That the missing original extraction artifact has been recovered; that UGTPHON IPA is normative gold; that all seven conditional morphologies have been independently adjudicated. |
| Five newly mapped forms have conditional §27 morphology leads | PARTIAL / RULE-ENVIRONMENT-ONLY | NIKL Q&A 317798 (`할 것을[할꺼슬]`, §27 cohesion); 310899 (colloquial dependent noun `거`); 331601 (`알 수 없는[알쑤엄는]`); 336313 (`할 듯[할뜯]`); plus existing Q&A 307960, 327466, 313481 and 333044. | Source material supports conditional morphological/rule environments for `해줄것`, `많을거같이`, `보일거라`, `내릴수있는`, and `안할듯`; each exact UGC token remains unadjudicated. | Direct token-specific IPA attestation; guaranteed fortition without prosodic review; permission to add production exceptions; any suffix-wide rule. |
| Two exact C08 output changes are attributable to the bounded context licenses | DONE_VERIFIED as artifact comparison | Pre-context pair artifact `13097847614` vs current pair artifact `13102456604`; only `무고일수도있다는` and `했을시` changed on the shared token set, each changing the targeted plain onset to fortis; g2pK outputs unchanged. | The two exact-form changes are isolated and attributable to the current Kozak Kim branch; the paired result remains a noisy-corpus diagnostic. | A statistically independent IPA win, universal superiority, or validation of Ukrainian target orthography. |

Three newly registered NIKL records (Q&A 317798, 310899, 331601) remain `REVIEW_REQUIRED` for item-level rights. Source register now has 155 rows: 146 review-required, 7 manual-classification-required, 1 item-level license recorded, 1 not applicable. No production phonology code changed in this C08 context-recovery follow-up.


**Evidence-source correction (2026-11-02):** the earlier provisional references to NIKL Q&A 335204 and 336313 were removed from the active source register because their direct pages could not be independently retrieved in this verification pass. The current active basis is NIKL Q&A 317798 (Rule §27 examples and pause caveat), 310899 (colloquial dependent noun 거), 331601 (알 수 없는[알쑤엄는]), plus the already registered 307960/327466/313481/333044 and the official Rule §27 page. Older historical mentions of 335204/336313 are superseded and are not current evidence claims.


## Native paired diagnostic — 2026-11-02

- Run `41358508325`, artifact `13104257589`: 2,698 shared; native Kozak Kim CER 9.1047% vs g2pK 9.2304%; exact match 53.0393% vs 53.1134% (slight exact-match advantage for g2pK); five native abstentions and zero engine errors. The g2pK surface output is passed through the repository's shared IPA renderer, without changing the original g2pK implementation. This is a separate profile from the browser pair.

## 2026-11-02 — exact-head multi-engine revalidation for Kozak Kim

| Claim | Status | Evidence | Supported interpretation | Not established |
|---|---|---|---|---|
| Current browser paired UGTPHON comparison | DONE_VERIFIED as a diagnostic | Run [41409348959](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41409348959), artifact `13124269774`; 2,699 shared occurrences | Exact match is tied at 53.4272%; Kozak Kim CER 8.1097% vs original g2pK 8.2138%; paired CER delta −0.1040 pp, 95% sentence-cluster CI [−0.1951, −0.0261] pp | Normative IPA accuracy, Ukrainian target quality, or universal engine superiority |
| Current native paired UGTPHON comparison | DONE_VERIFIED as a diagnostic | Run [41409348973](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41409348973), artifact `13124712631`; 2,698 shared | Kozak Kim CER 9.1047% vs g2pK 9.2304%; exact 53.0393% vs 53.1134%; five native abstentions, zero engine errors | Exact-match advantage; direct comparison with browser-profile absolute scores |
| Ten-engine comparison on UGTPHON and SIGMORPHON | DONE_VERIFIED as an artifact-backed diagnostic | Run [41358812573](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41358812573), artifact `13105045922`; all 10 engine adapters and both datasets completed | UGTPHON: 2,698 paired, native exact 53.0393% vs g2pK 53.1134%; CER 9.1047% vs 9.2304%; paired bootstrap g2pK-minus-native CER CI [+0.0428,+0.2194] pp, exact CI crosses zero. SIGMORPHON: 998 paired, native exact 35.8717% vs 35.3707%, CER 14.6225% vs 14.8106%; paired bootstrap g2pK-minus-native exact CI [−1.0020,−0.1002] pp and CER CI [+0.0250,+0.3859] pp. | Universal superiority, normative NIKL accuracy, sentence-context accuracy from SIGMORPHON, or Ukrainian target accuracy. g2pK surface is converted through the shared project segment-to-IPA renderer. |
| C08 active source-register consistency | DONE_VERIFIED after correction | C08 mass-cluster row now cites active `SRC-NIKL-QNA-*` identities; regression test checks every cited identity against `SOURCE-REGISTER.csv` and rejects retired Q&A 335204/336313 | The active C08 evidence row no longer treats unavailable provisional Q&A pages as current evidence | Item-level NIKL reuse permission; direct IPA gold for the UGC tokens |

The multi-engine artifact's purpose remains diagnostic. UGTPHON is noisy user-generated text; SIGMORPHON is a lexical word-level set with IPA-convention differences. The g2pK implementation remains unchanged; its surface is converted by the shared project segment-to-IPA renderer. The rerun on verified code/test head `bf08b7f` (workflow 41407778528) remained in progress at last inspection; no result is claimed from it. Optional CharsiuG2P and ByT5 inference jobs were skipped; no neural score is claimed. The run does not evaluate Ukrainian output.

**Evidence-source correction:** active additional NIKL Q&A sources are 317798, 310899 and 331601. Provisional Q&A 335204 and 336313 were removed from the active source register because their direct pages could not be independently retrieved. Historical mentions are superseded; neither is used in the current C08 evidence row.


## 2026-11-02 — latest paired revalidation on head 84e4200

| Claim | Status | Evidence | Supported interpretation | Not established |
|---|---|---|---|---|
| Browser paired UGTPHON comparison | DONE_VERIFIED as a diagnostic | Run [41419733723](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41419733723), artifact `13129795347`; 2,699 paired, 264 sentence/utterance clusters | Exact match tied at 53.4272%; Kozak Kim CER 8.0794% vs original g2pK 8.2138%; paired CER delta −0.1344 pp, 95% row-cluster CI [−0.2246, −0.0531] pp | Normative IPA accuracy, Ukrainian target quality, or universal superiority |
| Native paired UGTPHON comparison | DONE_VERIFIED as a diagnostic | Same run, artifact `13129641115`; native Kozak 2,698 scored, g2pK 2,703 | Kozak exact 53.0393%, CER 9.0744%, five abstentions/zero errors; g2pK exact 53.0892%, CER 9.2285%. Paired g2pK-minus-native exact +0.0741 pp and CER +0.1560 pp | Exact-match advantage for Kozak; comparison of two independently native IPA encoders |
| Exact-head regression/build | DONE_VERIFIED | Push run `41419725829`, PR run `41419733699`, head `84e4200365851e7d070c76e0ebed7c113111475a` | Python/data integrity pass; browser 1,374/1,374; build and generated pages pass | NIKL metadata inventory (skipped), optional neural inference, or independent linguistic gold |

Both g2pK comparisons use the shared project segment-to-IPA renderer after original g2pK surface generation. These diagnostics do not establish normative Korean IPA gold or Ukrainian adaptation quality. The original g2pK implementation remains unchanged.

## Addendum — 2026-11-02 Kozak Kim runtime and Broad IPA claims

| ID | Claim | Status | Evidence | Permitted wording | Do not claim |
|---|---|---|---|---|---|
| M-06 | Broad IPA exact match is a sensitivity metric, not normative pronunciation accuracy | DONE_VERIFIED as a profile contract | data/korean/ipa/broad-candidate-normalization-v1.json; Python/JS normalizer tests; benchmark v2 emits feature-loss and serialization-loss counters | Scores are comparisons after the explicitly documented collapses; report the profile and losses with every score | That Broad exact is expert-adjudicated IPA accuracy |
| M-07 | Native and Browser can be compared under the same IPA profile | PARTIAL | Browser supports explicit clippyfirst-korean-broad-v1; default legacy profile unchanged; scripts/audit_kozak_kim_runtime_parity.py checks full profile metadata, occurrence identity, full surface and IPA | “Same-profile runtime parity is being measured” | 99.9% parity until exact-head artifact passes |
| M-08 | Kozak Kim has a small Broad exact lead over original g2pK and g2p-ko on historical diagnostic sets | PARTIAL / EVIDENCE-LIMITED | Raw artifact 13129993707, recomputed under shared broad-candidate profile; UGTPHON and SIGMORPHON counts recorded in benchmark-suite register | “Historical diagnostic Broad exact was slightly higher for Native Kozak Kim” | Universal superiority, normative accuracy, or untouched holdout performance |
| M-09 | Some Native losses to both baselines are corpus/profile disagreements rather than demonstrated engine errors | PARTIAL | Occurrence-level three-way analysis; NIKL §26/R012 for 출산[출싼]; C09 lexical-length evidence for 없는, 없어, 알다; R013 boundary regression for 올게이 | State each item with its source and uncertainty | Remove length/fortis distinctions merely to match UGTPHON |
| M-10 | NIKL records long first-syllable quantity for 대한민국 | DONE_VERIFIED as Hangul dictionary evidence; IPA mapping EVIDENCE-LIMITED | NIKL Basic Dictionary entry 70041; data/korean/sources.csv S017 and research/SOURCE-REGISTER.csv SRC-NIKL-KRDICT-70041 | “The dictionary notation is [대ː한민국]” | An adjudicated IPA vowel quality or speaker-specific realization |
| M-11 | Independent IPA gold is ready | BLOCKED | Frozen 24-item holdout; separate blank reviewer A/B sheets; packet generator | “Reviewer packets are prepared” | That IPA gold exists before two independent reviews and adjudication |

The exact-head GitHub Actions runs for code/test head a921f268c9f19ae3f19ad3c7b134fdc0aff78c2e remain QUEUED (41440127701, 41440127807, 41440127686). Local clone/testing is blocked by DNS resolution failure for github.com. Do not mark the exact-head checks DONE_VERIFIED while the runs remain queued.



## 2026-11-03 — Kozak Kim lexical and baseline-isolation claims

| Claim | Status | Evidence | Supported interpretation | Not established |
|---|---|---|---|---|
| `끌다` preserves long first syllable and plain ㄷ | DONE_VERIFIED as official Hangul pronunciation evidence | NIKL Standard Pronunciation Rule §7 explicitly lists `끌다[끌ː다]` and `끌어[끄ː러]`; Korean Basic Dictionary ParaWordNo=62281 corroborates | Exact lexical surface/length exception; project broad IPA is a derived representation | Independent IPA adjudication or accepted Ukrainian target |
| `굶다` receives §24 fortition | DONE_VERIFIED as rule derivation | NIKL §24: stem-final ㄴ(ㄵ), ㅁ(ㄻ) + ending-initial ㄱ/ㄷ/ㅅ/ㅈ; explicit -기- exception includes `굶기다`; exact-form test expects `kum.t͈a` | Rule-derived application to `굶-` + dictionary ending `-다`; `굶기다` must remain non-fortis | Direct lexical listing of `굶다` in §24; productive generalization beyond exact licensed forms |
| g2pK app adapter is isolated from Kozak research-only candidates | DONE_VERIFIED | Red test `5131e807` reproduced `못잃어 → 몬니러`; fix `2e6e739` filters both `kozak-research-only` and `variant-aware-research` in surface and IPA override paths | Research candidates do not alter g2pK adapter output | Any change to original g2pK package (none made) |
| Original g2pK benchmark is untouched | DONE_VERIFIED | No vendored/upstream files changed; `scripts/benchmark_multi_engine_ko.py` calls raw `G2p()` directly; vendored browser file SHA unchanged | The benchmark remains raw g2pK surface → shared renderer | Two independent native IPA encoders |
| UGTPHON paired comparison | DONE_VERIFIED diagnostic | Run 41628584865 / multi-engine artifact 13226589858; paired n=2,698; exact delta +0.0741 pp (95% CI −0.0824 to +0.2840), CER delta +0.1691 pp (95% CI +0.0860 to +0.2617) | Kozak lower paired CER; g2pK +2 exact cases on paired subset; Kozak abstains on five, g2pK does not | Normative IPA accuracy or conclusive exact-match superiority |
| SIGMORPHON 2021 paired comparison | DONE_VERIFIED diagnostic | Multi-engine artifact 13226589858; paired n=998; exact delta −0.5010 pp (95% CI −1.0020 to −0.1002), CER delta +0.2508 pp (95% CI +0.0986 to +0.4444) | Kozak ahead on exact and CER in this lexical split | Universal superiority or sentence-context performance |

Both corpus comparisons are diagnostic labels, not independent normative IPA gold. g2pK Hangul surface is rendered through the shared project IPA renderer. The newer rerun 41637795800 was in progress at this handoff and is not used as evidence.


## 2026-11-03 — methodology claim update (PR #425)

| Claim | Status | Evidence | Supported interpretation | Not established |
|---|---|---|---|---|
| Research-only lexical overlays can be ablated without changing the default Kozak Kim policy | DONE_VERIFIED | New regression tests in `tests/test_pipeline.py`; exact-head System Verify 41654558006 PASS | Explicitly excludes `kozak-research-only` and `variant-aware-research` surface/IPA overrides when requested; exclusion is visible in trace output | That the ablated mode is a production pronunciation policy or that either candidate is independently adjudicated |
| Occurrence-level ablation audit measures the effect of research lexical overlays | PARTIAL | `_build_research_lexical_ablation_audit`; adapter tests passed in 41654557693; full multi-engine run 41654557693 still in progress | Reports repeated corpus occurrences, unique forms, input-kind counts, and full/ablated exact outcomes | Final benchmark counts or a claim that corpus exactness proves normative pronunciation |
| Native/g2pK pairwise comparison is independently testable without changing its comparison contract | DONE_VERIFIED | `_build_pairwise_engine_audit`; regression tests in `tests/test_multi_engine_benchmark.py`; paired run 41654557675 PASS | Complete occurrence-level categorization retained for original g2pK 0.9.4 | Independent IPA encoding by g2pK or universal superiority of Kozak Kim |
| Standard Kozak Kim default behavior is unchanged by the new ablation option | DONE_VERIFIED for tested contract | Default remains `include_research_lexical=True`; System Verify and paired Native/g2pK run 41654557675 pass | Existing default lexical overlays remain active; no benchmark score change is claimed beyond the separately recorded paired run | That any research overlay is linguistically gold or suitable for training |

The vendored g2pK Browser implementation is byte-identical to main at SHA `1e3705b9439c637f3442864cb3105e771dff2ed7`. The project-owned Python g2pK adapter excludes Kozak research-only rows; the raw multi-engine baseline continues to instantiate `G2p()` directly. Full multi-engine artifact review remains pending (run 41654557693).


## 2026-11-04 — Kozak Kim / original g2pK paired diagnostic refresh

| ID | Claim / status | Evidence | Supported interpretation | Not established |
|---|---|---|---|---|
| M-20 | Native Kozak Kim has lower paired CER than original g2pK 0.9.4 on pinned UGTPHON — DONE_VERIFIED as diagnostic | Exact-head run [41726881384](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41726881384), artifact `13276390247`; 2,698 paired scored occurrences | Native: 2,698/2,703 coverage, 1,431/2,698 exact (53.0393%), CER 8.9920%; g2pK raw: 2,703/2,703 coverage, 1,435/2,703 exact (53.0892%), CER 9.2285%. On the shared paired subset n=2,698, g2pK has 1,433 exact (53.1134%) and CER 9.2304%. Paired g2pK-minus-Native exact delta +0.0741 pp (95% CI −0.0824 to +0.2840); paired CER delta +0.2384 pp (95% CI +0.1392 to +0.3464). | Normative IPA accuracy, independent IPA-engine parity, Ukrainian target quality or universal superiority. UGTPHON is noisy; g2pK Hangul surface uses the shared project IPA renderer. |
| M-21 | Checked-in mismatch-review golden file is stale relative to exact-head export — PARTIAL | Same run: exporter found 36 unmapped-broad occurrences / 55 fragments, zero missing context lookups; `cmp` differs at byte 31,117 / line 14 against `research/kozak-kim-unmapped-mismatch-review-queue-2026-11-03.csv`. | Engine comparison completed and artifact uploaded, but workflow failed at golden-file reconciliation; downstream same-occurrence Browser/parity and SIGMORPHON jobs were skipped. | Do not treat this as an engine crash, accept the stale queue, or claim skipped downstream stages. Refresh requires row-level review and exact-head rerun. |

Original g2pK remains the baseline; no upstream or vendored g2pK code was changed. All figures are diagnostic corpus-label comparisons only.


| M-22 | Native Kozak Kim outperforms original g2pK under the separate research-only Broad sensitivity profile — DONE_VERIFIED as sensitivity evidence | Artifact `13276390247`, 2,698 paired UGTPHON scored occurrences; profile `korean-broad-candidate-sensitivity-v1` | Native 2,333/2,698 exact (86.4715%), CER 2.1317%; g2pK 2,312/2,698 exact (85.6931%), CER 2.3751%; paired deltas g2pK−Native: exact −0.7784 pp, CER +0.2434 pp. | No paired CI for Broad deltas; no independent IPA gold, normative standard, narrow phonetic correctness, or Ukrainian target quality. Profile is research-only/unadjudicated and removes separators and selected phonetic distinctions (including 205 prediction-side fricative-aspiration losses and 5,828 separator removals). Strict metrics remain primary. |


## 2026-11-04 — M-21 mismatch queue reconciliation

| Claim | Status | Evidence | Supported interpretation | Not established |
|---|---|---|---|---|
| The checked-in unmapped-broad review queue matches the latest exact-head export | DONE_VERIFIED as artifact reconciliation | Run [41794874090](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41794874090), artifact [13305816579](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41794874090/artifacts/13305816579); refresh commit `c0cbe3740e734c87d3202cca496b83d9603ea218`. Generated 36 rows / 55 fragments / 0 missing context lookups. All 36 retained rows match their generated rows byte-for-byte by per-row hash; seven obsolete rows were removed with occurrence-specific dispositions recorded in the master handoff. | The checked-in 36-row queue now represents the exact generated unmapped-broad set for this pinned UGTPHON artifact. | That any corpus label is normative IPA gold; that mapped C06/C11 differences are adjudicated; that all 36 remaining cases are engine errors or all should be fixed. |

The seven removed occurrences are not a general waiver: five are now broad-exact on the current Kozak Kim head (1406, 1527, 2001, 2010, 2533); 868 retains a mapped C06 coda difference; 2562 retains a mapped C11 sibilant-place difference. The queue refresh changed no runtime/phonology code and did not alter original g2pK. Current-head downstream Browser/parity and SIGMORPHON evidence is pending run 41797143756.

## 2026-11-04 — exact-head benchmark and R013 phrase-boundary evidence

Run [41797276965](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41797276965), artifact [13306613436](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41797276965/artifacts/13306613436), completed successfully at head `682c3a5`. UGTPHON paired Native/g2pK n=2,698: 1,431 vs 1,433 exact; CER 8.9920% vs 9.2304%. SIGMORPHON paired n=998: 358 vs 353 exact; paired CER 14.5598% vs 14.8106%; five Native-only exact wins and zero g2pK-only exact, exact two-sided McNemar p=0.0625. These are corpus-relative diagnostic results, not universal superiority or normative IPA proof. Same-run Native/Browser surface parity is 2,703/2,703 and IPA parity 2,698/2,698. The 24-case holdout packet is pending two independent reviewers and contains no predictions/gold.

| Claim | Status | Evidence | Limits |
|---|---|---|---|
| Native/Browser parity on pinned UGTPHON occurrences | DONE_VERIFIED | Run 41797276965, artifact 13306613436; 2,703 surface equal, 2,698 raw IPA equal, 0 differences. | Runtime parity is not phonetic correctness or Ukrainian target validation. |
| Current SIGMORPHON lexical comparison | DONE_VERIFIED as diagnostic | Same artifact; paired n=998, Native 358 exact vs g2pK 353; paired CER 14.5598% vs 14.8106%; exact McNemar p=0.0625. | Lexical word-level set; IPA convention differences; shared renderer; not sentence-context gold. |
| R013 phrase licensing for `줄 것` and `많을 거` | PARTIAL / CI PENDING | NIKL §27 plus NIKL Q&A 317798 and Q&A 310899; exact adjacent eojeol pair licenses, explicit phrase mode, negative controls for compact/no-space forms. | No acoustic attestation of pause/cohesion; rule-derived standard reading only. New code awaits exact-head CI. |

The phrase implementation deliberately does not promote unspaced corpus tokens `해줄것` or `많을거같이` to automatic licenses. Their hidden morpheme/eojeol boundaries cannot be reconstructed safely from the compact token alone.

## 2026-11-04 — R013 phrase license evidence and verification

- Source basis: NIKL Standard Pronunciation Rule 27 (connected adnominal -(으)ㄹ + ㄱ/ㄷ/ㅂ/ㅅ/ㅈ fortition; pausing blocks it); official Q&A 310899 confirms colloquial `거` is a dependent noun equivalent to `것`.
- Implementation: exact adjacent eojeol pair licenses `줄 것` and `많을 거`; Python phrase mode records exact pair index and trace context; Browser uses the same pair map. No hidden-space reconstruction. Browser punctuation and compact no-space forms are negative controls.
- Phrase mode is a connected-speech assumption, not pause detection. No acoustic IPA claim is made.
- Exact-head e29f756f System Verify [41806844422] PASS (Python regression/data integrity, Browser 1,395/1,395, Vite build); Browser G2P [41806844476], paired Native/g2pK [41806844324], UGTPHON [41806844305], morphology consensus [41806844379], extraction [41806844316], and morphology smoke [41806844503] PASS.
- Multi-engine run [41806844311] was still in comparison at the checkpoint; do not mark it pass. Last completed full comparison is [41797276965] / artifact [13306613436].
- Method: red-green tests, exact eojeol boundary modeling, explicit negative controls, and verification-before-completion. No wholesale copying from Superpowers, Matt Pocock Skills, or Ponytail; existing integrated phonetic-engineering skill remains canonical.


## 2026-11-04 — C12 primary acoustic evidence refinement

A relevant peer-reviewed primary source has now been identified and reviewed: Schweizer, Ahn & Kwon (2026), *Acoustic properties of Seoul Korean stops in phrase-initial and word-medial positions*, Journal of the International Phonetic Association 56, Article e6, DOI 10.1017/S002510032510087X. Cambridge Core identifies the article as Open Access under CC BY 4.0. The source is registered as `SRC-JIPA-SCHWEIZER-AHN-KWON-2026-SEOUL-STOPS`.

The paper reports two datasets: a controlled production experiment with nine native Seoul-Gyeonggi speakers and a reading-corpus analysis of 15 female speakers from the NIKL 2005 Speech Corpus. It measures burst duration from stop release to voicing onset (or F2 onset for pre-voiced tokens), closure duration, voicing during closure, post-stop f0, F1 and H1*-H2*. It finds that the acoustic realization of the three-way stop contrast depends on prosodic position and other speaker/context factors; in word-medial contexts aspirated stops have longer release+aspiration burst durations than lax stops in the reported conditions.

**Evidence boundary:** this is direct primary acoustic evidence for the general release/aspiration behavior of Seoul Korean stops. It is *not* direct evidence for the specific narrow strings `[kx]` or `[kç]`, does not report those as target transcriptions, and does not adjudicate the 37 C12 occurrences. It therefore improves the general acoustic evidence base but does not close the C12 acceptance gate.

**Status:** PARTIAL — general acoustic evidence identified and source-registered; BLOCKED — exact [kx]/[kç] interpretation, source-audio crosswalk, dialect/prosodic conditioning and two independent Korean IPA reviews. No Kozak Kim production rule, IPA adapter, lexical entry or default profile was changed. The broad /kʰ/ category remains intact; any future [kx]/[kç] treatment must be a separately typed, evidence-backed narrow variant rather than a phonological replacement.

The secondary Wiktionary note suggesting [kx] before /ɯ/ and [cç] before /i,j/ is not accepted as primary evidence: its footnote does not resolve to a traceable source in the retrieved page. It may be retained only as a search lead, not as a rule license.


## 2026-11-04 final continuation status — Kozak Kim only

**Production-code head:** a6ac71c1f3b2c543544e8bf4331f7a6555374422. No Kozak Kim production source or benchmark implementation changed after the earlier verified code head 9803eef502ea655319954520b984fe33049ffe8e; subsequent changes are source-register, evidence, documentation and regression-test updates.

### Exact-head checks before the final C12 data-distribution assertion
- System Verify 41813316574 and 41813324446: PASS — Browser regression suite 1,395/1,395, Vite production build/generated-page checks, Python regression and data-integrity suite.
- Browser G2P 41813324361, paired Native/g2pK 41813324279, external UGTPHON 41813324358, morphology consensus 41813324282, morphology smoke 41813324356, and exhaustive test-case extraction 41813324414: PASS.
- Latest completed multi-engine comparison 41809183760: PASS, artifact 13312557366, SHA-256 c33601cf32fbe70aa4f199936eeacb749f4f305dabd574f44dc9d3da02b89315.
- The C12 occurrence-distribution assertion is added in this final documentation/test commit and must be included in the final System Verify rerun.
- NIKL metadata-only inventory, CharsiuG2P and ByT5 inference remain SKIPPED, not passed.

### Paired diagnostic against unchanged original g2pK 0.9.4
- UGTPHON paired set (n=2,698): Kozak Kim 1,431 exact (53.0393%), CER 8.9920%; g2pK 1,433 exact (53.1134%), paired CER 9.2304%. Exact-match delta is only 0.0741 pp in g2pK's favour and its paired 95% CI crosses zero (−0.0824 to +0.2840 pp). Kozak Kim CER is lower by 0.2384 pp (paired CI for g2pK-minus-Kozak CER: +0.1392 to +0.3464 pp).
- SIGMORPHON paired set (n=998): Kozak Kim 358 exact (35.8717%), CER 14.5598%; g2pK 353 exact (35.3707%), paired CER 14.8106%. Five net Kozak-only exact wins yield exact two-sided McNemar p=0.0625: promising, not decisive at 0.05. Kozak Kim CER is lower by 0.2508 pp (paired bootstrap CI +0.0986 to +0.4444 pp). The full g2pK scored-set CER is 14.8222% on 999 cases; do not confuse it with the 998-case paired CER.
- These corpora are diagnostic annotations, not independently adjudicated Korean IPA gold. g2pK's IPA is rendered through the shared project adapter; it is not an independent IPA encoder. No universal superiority claim follows.

### C12 — evidence refinement, no production rewrite
The 37 mismatch rows represent 29 unique token strings: 16 kxɯ-only, 12 kçi-only, 8 kçj-only, and one overlapping kxɯ+kçi row (키큰남). Source-row namespaces: 12 multilexnorm2026, 25 dc_inside. The fragment CSV contains text/IPA fields but no audio or speaker metadata.

Schweizer, Ahn & Kwon (2026), JIPA 56, e6, DOI 10.1017/S002510032510087X, CC-BY-4.0, is registered as contextual primary acoustic evidence. It measures burst duration (release to voicing onset; release+aspiration if any), closure duration, voicing and spectral measures. Study 1 uses following /a/; Study 2 uses /i,u,a,ʌ/. It has no /ɯ/ or /j/ target context and reports no [kx]/[kç] transcription. It cannot adjudicate the C12 tokens. Status remains PARTIAL for general acoustic evidence and BLOCKED for exact [kx]/[kç] interpretation, source-audio/annotation crosswalk and two independent Korean IPA reviews. No C12 production rule, lexical entry or narrow IPA profile was added.

### Scope and readiness
- Kozak Kim is the only engine being improved. Original g2pK 0.9.4 remains an unmodified comparison baseline; all nine vendored g2pK files are byte-identical to current main and the dependency remains pinned.
- The 36-row unmapped-Broad queue (55 fragments; 36/36 context lookups found) is not a resolution of the historical 239-case mismatch population.
- Independent Korean IPA review, Ukrainian target-layer review, item-level NIKL reuse verification, C12 audio adjudication, and names/loans/Hanja/regional-style coverage remain open.
- Readiness: research prototype; not research-certified and not release-ready.


## 2026-11-04 — final verification refresh and methodology review

**Exact verified pre-documentation head:** `8615aa8eb4195c23bc7ff0a3eac64ae122af9b46` (PR #426, still draft/open; base PR #425). The following workflows completed on this exact head:

- System Verify [41815472574](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472574): PASS. Python regression/data-integrity job PASS; Browser regression/build PASS, **1,395/1,395 tests, 0 failures**. Vite production build and generated-page checks passed. The Python pytest output reached 100% with no failures; pytest did emit its intentional diagnostic-only Python-vs-pinned-JS comparison warning (18/20 equal, two known port divergences where Python matches the project practical adapter). This warning is not a suite failure.
- Browser G2P [41815472566](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472566): PASS (25/25 tests).
- Paired Native/g2pK [41815473135](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815473135): PASS. UGTPHON shared scored set n=2,698: Kozak Kim 1,431 exact (53.0393%), CER 8.9920%; original g2pK 1,433 exact (53.1134%), CER 9.2304%. Exact-match difference remains inconclusive; Kozak CER is lower by 0.2384 pp. g2pK's full 2,703-case denominator is not the paired denominator.
- External UGTPHON [41815472667](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472667), morphology consensus [41815472569](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472569), morphology smoke [41815472553](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472553), and exhaustive test-case extraction [41815472973](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472973): PASS. The morphology-consensus diagnostic did not improve exact matches and had slightly higher CER than strict (0.090093 vs 0.089920); it remains diagnostic-only, not a production replacement.
- Multi-engine benchmark [41815472970](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472970): PASS; all 17 workflow steps succeeded. Artifact [13314914671](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472970/artifacts/13314914671), SHA-256 `b33d8838877ef2bf89f959e920d1d4c82c831a108248fa002dbd773316e27a14`. Its multi-engine runner reports 71 Python checks and 25 Node tests passing. This is diagnostic comparison, not normative IPA adjudication.
- Official NIKL metadata-only inventory: SKIPPED. CharsiuG2P inference, ByT5 inference and neural pairing: SKIPPED. None is reported as passed.
- Non-fatal environment/build notices: Node 20 deprecation notices from upstream Actions, Node `punycode`/`url.parse` deprecations, and Vite's large-chunk warning. No failed check is attributed to these notices.

### C12 exact-data verification

The final regression assertion now validates all 37 C12 occurrence rows, 29 unique token strings, the exact pattern partition (16 `kxɯ` only, 12 `kçi` only, 8 `kçj` only, one overlapping `kxɯ+kçi` row), source namespaces (12 `multilexnorm2026`, 25 `dc_inside`), and the absence of audio/speaker columns in the fragment CSV. CI passed on this assertion. This verifies the mismatch dataset's structure, not the acoustic interpretation of the source IPA.

### Methodology review and decisions

- **Superpowers:** retain plan-first execution, one vertical slice at a time, TDD red→green, systematic diagnosis for failed checks, and a final verification gate.
- **Matt Pocock Skills:** retain public-behaviour test seams, independent expected values, one change per slice, and separate standards/spec review axes.
- **Ponytail:** retain the smallest justified change, reuse of existing Python/Browser rule maps and repository contracts, and review of surrounding callers rather than diff-only inspection.
- **Unlazy:** apply explicit acceptance gates, task decomposition, evidence fingerprints/artifact references, and re-verification of already completed checks. The repository already has canonical master plan, acceptance-gates, coverage matrix and task ledger; therefore no duplicate `GATES.md`, external skill dependency, hook, or imported script was added. Unlazy's executable checker requires local shell approval and is not available through this GitHub-only execution path.
- **Ruling:** keep the project's existing phonetic-engineering skill and canonical execution records as the source of truth; borrow compatible methods, do not wholesale vendor four agent frameworks or duplicate their overlapping ledgers. This avoids maintenance burden and preserves the user's existing architecture.

### Current task ledger

| Work item | Status | Evidence / acceptance still required |
|---|---|---|
| Current Python regression/data integrity, Browser suite/build, Browser G2P and diagnostic workflows | DONE_VERIFIED at exact head above | Re-run after this documentation-only refresh; do not transfer this exact-head claim to later code changes. |
| C12 row-count, unique-token, pattern and source-namespace integrity | DONE_VERIFIED | Regression assertion passed in System Verify. |
| C12 exact [kx]/[kç] acoustic interpretation | BLOCKED | Obtain source recordings, speaker/dialect/prosodic metadata and original annotation protocol; then two independent Korean IPA reviews. No production rewrite. |
| Independent Korean IPA blind packet (24 cases) | BLOCKED | Two qualified reviewers annotate independently, reconcile disagreements, and provide provenance. |
| Ukrainian target layer | BLOCKED | Independent Ukrainian phonetic/orthographic review and reader validation; corpus IPA metrics cannot substitute. |
| NIKL item-level reuse/KOGL permissions | BLOCKED | Item-specific source and redistribution/reviewer-sharing rights evidence; official metadata crawl currently returns 403. |
| Historical 239-case mismatch population | PARTIAL / EVIDENCE-LIMITED | Reconstruct exact source/context memberships and adjudicate every retained occurrence; the 36-row unmapped-Broad queue is not a substitute. |
| C01–C11 optional variants and profile conventions | PARTIAL / REVIEW-PENDING | Review token contexts, dialect/prosody and source transcription conventions; two independent IPA reviewers before promoting any narrow profile. |
| Names, loans, Hanja, regional/style coverage | TODO / PARTIAL | Evidence-backed scoped datasets and explicit uncertainty/abstention acceptance; Hanja and RR remain separate research modes. |
| Neural teacher evaluation | DEFERRED / SKIPPED | Only revisit with reproducible licensed model weights, independent held-out IPA gold and a demonstrated advantage; no production integration now. |
| Original g2pK 0.9.4 baseline | DONE_VERIFIED as preserved dependency | Keep pinned and unmodified; comparison output remains diagnostic and is not used as a source of production rules. |

**Readiness remains:** research prototype; software checks for the exact head are green, but research certification and release acceptance are not met.


## 2026-11-04 — R013 occurrence-scope defect found and corrected

**Code/test head:** `648949a40638a7b0d18b8c026b15de7e24a1235f`.

### Root cause and TDD evidence

A focused re-review of the R013 attached ending `-ㄹ게` found that Python accumulated the licensed syllable pair in a sentence-global `attested_l_ge_pairs` set. If one complete `-ㄹ게` ending licensed `할>게`, another identical pair inside a longer, unrelated eojeol could inherit that permission.

The minimal counterexample is `할게 할게다`:
- RED commit `34fffa593bd10a16a2d963b252cef92caa8ed7d3`, System Verify [41841891363](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41841891363): the new Python regression failed exactly as predicted: actual `할께 할께다`, expected `할께 할게다`. Browser regression/build passed on the same red commit.
- GREEN commit `3358b81492022da11154b375121bbd16e1912c13`: replaced the global pair set with an occurrence-indexed `attested_l_ge_contexts` map. R013 now authorizes the exact eligible position; unrelated same-pair positions cannot inherit the license.
- Browser parity regression commit `648949a40638a7b0d18b8c026b15de7e24a1235f`: added the same counterexample to the Browser morphology guard suite. Browser already checked the exact eojeol and correctly returns `할께 할게다`.

### Exact-head verification

- System Verify [41842288415](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288415): PASS on the code/test head; Python regression/data integrity PASS; Browser **1,396/1,396**, 0 failures; production build/generated-page checks PASS. The new Browser counterexample is test 1,148 and passed.
- Browser G2P [41842288550](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288550): PASS.
- Paired Native/g2pK [41842288377](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288377), external UGTPHON [41842288200](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288200), morphology consensus [41842288389](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288389), research morphology smoke [41842288230](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288230), and test-case extraction [41842288344](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288344): PASS.
- Multi-engine benchmark [41842288431](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288431): IN PROGRESS at this ledger update. Its 12 setup/validation/adapter/holdout steps have passed; the multi-engine comparison is running, and queue export, same-occurrence Browser, runtime parity, SIGMORPHON and artifact upload have not yet been verified on this head. Do not infer a final result.
- Official NIKL metadata-only inventory: SKIPPED, not passed. Neural inference: SKIPPED.
- All nine vendored `src/vendor/g2pk/` blobs are SHA-identical to current `main`; no vendored g2pK file changed.

### Review correction

The earlier self-review entry stating that no Important defect was identified is superseded for this area: the earlier review did not include this sentence-level repeated-pair counterexample. The focused re-review found one Important correctness defect, reproduced it with a red test, fixed it, and verified both runtimes. This remains an author self-review, not independent human review; PR #426 has no submitted reviews or inline review threads.

### Updated task disposition

| Task | Status | Evidence / remaining acceptance |
|---|---|---|
| R013 `-ㄹ게` license must remain inside the exact eligible occurrence | DONE_VERIFIED | Red failure 41841891363; fix 3358b814; System Verify 41842288415; Browser regression 1,148 passed on exact head 648949a. |
| R013 explicit phrase pair licenses `줄 것` / `많을 거` | DONE_VERIFIED for software behavior | Exact pair and negative controls pass Python/Browser CI; linguistic pause/cohesion remains conditional because the text API has no pause annotation. |
| Multi-engine benchmark on the R013 occurrence-scope fix | PARTIAL / IN_PROGRESS | Run 41842288431 must complete all 17 steps; inspect refreshed queue, same-occurrence Browser parity, SIGMORPHON and artifact before updating comparative evidence. |
| Independent Korean IPA / Ukrainian target review | BLOCKED | Human reviewers and adjudication still absent. |
| C12 acoustic interpretation and NIKL item-level rights | BLOCKED | Source audio/metadata and item-specific rights evidence remain unavailable. |

No g2pK source, dependency pin, or vendor blob was modified. PR #426 remains Draft/open, stacked on PR #425. No merge, release, deployment, force-push or branch deletion. Readiness remains research prototype, not research-certified or release-ready.
