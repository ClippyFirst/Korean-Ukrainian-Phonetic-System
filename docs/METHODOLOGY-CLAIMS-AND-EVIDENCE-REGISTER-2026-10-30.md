# Методологія: реєстр тверджень і доказів — 2026-10-30

## Призначення

Цей документ — третій, доказовий рівень методології корейсько-українського сервісу. Він пов'язує публічні твердження з реалізацією, тестами, першоджерелами або вимірюваннями. Він не замінює `research/SOURCE-REGISTER.csv`, `research/RULE-COVERAGE.csv`, benchmark-реєстр або машинні звіти; він індексує ключові твердження, які можна безпечно використовувати в публічному описі.

## Статуси

- **DONE_VERIFIED** — твердження підтверджене наявними джерелами/кодом і відповідним CI або відтворюваним артефактом.
- **PARTIAL** — реалізація чи вимірювання є, але частина acceptance criteria не виконана.
- **BLOCKED / EVIDENCE-LIMITED** — бракує незалежного gold, спеціалістичного adjudication, дозволу або іншого конкретного доказу.
- **DEFERRED** — явно поза поточним обсягом.

## Реєстр основних тверджень

| ID | Твердження | Статус | Підтримка | Дозволене формулювання | Не стверджувати |
|---|---|---|---|---|---|
| M-01 | Вебсервіс має два різні pronunciation paths | DONE_VERIFIED | `src/app/g2pk_web.js`, `src/app/engine.js`, `docs/methodology.md`, browser contracts | Звичайний режим — локальний JS-порт g2pK; докладний аналіз — власний детермінований Kozak Kim | Що це два режими одного й того самого рушія |
| M-02 | Обидва browser paths converged on IPA-first target adapter | DONE_VERIFIED | `src/app/engine_ipa.js`, IPA-first runtime/trace tests, `tests/ipa-first-runtime-invariant.test.mjs` | Український кандидат утворюється через IPA-адаптер | Що український вихід незалежно генерується прямою заміною Hangul-графем |
| M-03 | Kozak Kim має Strict, Soft, Super-soft | DONE_VERIFIED | `src/app/engine_convert.js`, `src/app/soft_morphology.js`, methodology contract and coverage tests | Це три політики одного native engine з різними межами припущень | Що це три незалежні рушії або що Super-soft гарантує правильну вимову |
| M-04 | Super-soft охоплює всі 11 172 сучасні складові блоки Hangul у визначеному software contract | DONE_VERIFIED for inventory contract | `tests/super-soft-coverage.test.mjs`, `tests/super-soft-coverage` related fixtures | 100% технічного покриття визначеного набору сучасних складових блоків | 100% лексичної/морфологічної/фонетичної точності |
| M-05 | Native і g2pK мають близькі exact-match результати на двох діагностичних корпусах | DONE_VERIFIED for research-branch run | Run [40843579685](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40843579685), job 123345574105; PR #371 report | На UGTPHON exact 53.002% native / 53.089% g2pK; на SIGMORPHON 35.772% / 35.335%; різниця залежить від корпусу | Що один рушій універсально кращий або що це нормативна accuracy |
| M-06 | Native має виміряну перевагу в runtime над g2pK у конкретному harness | DONE_VERIFIED for measured configuration | Run 40843579685, repeated timing logs; five UGTPHON repetitions | UGTPHON: median 366.002 ms native vs 17,412.489 ms g2pK у цьому harness | Універсальне прискорення для будь-якого браузера/пристрою/середовища |
| M-07 | CharsiuG2P дає значно вищий raw reference match на обох корпусах у comparative-only run | DONE_VERIFIED as observed run; generalization BLOCKED | Job 123345574019, run 40843579685; report lines 411–466; overlap audit | 88.531% UGTPHON і 70.971% SIGMORPHON; сильний дослідницький baseline | Що це безумовно правильніша вимова або незалежна оцінка узагальнення |
| M-08 | Charsiu benchmark leakage is ruled out | BLOCKED / EVIDENCE-LIMITED | Доступний public training file перетинається з 508 UGTPHON і 729/999 SIGMORPHON тестових форм; повний checkpoint manifest відсутній | Фактичне використання всіх форм у навчанні не доведене, але contamination не виключене | Що checkpoint точно тренувався на кожній формі або що test sets leakage-free |
| M-09 | Charsiu model weights have redistribution license | BLOCKED | Resolved checkpoint page не має підтвердженої явної ліцензії ваг у звіті | Не розповсюджувати ваги; зберігати лише дозволені результати/провенанс | MIT/Apache license claim for weights |
| M-10 | Ukrainian IPA-to-target layer is independently validated | BLOCKED / EVIDENCE-LIMITED | Немає незалежно adjudicated Ukrainian target gold і user study | Це власна практична модель із простежуваним IPA-derived шляхом | Що українські відповідники оптимальні/нормативні або експертно сертифіковані |
| M-11 | Native normative Korean pronunciation accuracy is independently established | BLOCKED / EVIDENCE-LIMITED | Немає representative independent NIKL-style holdout з expert adjudication | Є нормативно-джерельні приклади, регресії й діагностичні benchmark results | Абсолютну точність, per-rule accuracy або загальну перевагу |
| M-12 | Current main CI verifies implementation and build | DONE_VERIFIED at main commit `f93ae007592f216ccd2493f6652d228b876c8338` | Runs 41110109093, 41110109184, 41110109342, 41110109231 | 1,340/1,340 browser tests; Python 3.11/3.12/3.13; system/data; build; Pages deployment | Що CI доводить незалежну лінгвістичну правильність |
| M-13 | Extended benchmark implementation is already integrated into main | PARTIAL / NOT IN MAIN | PR #371 open; branch `bench/extended-metrics-runtime-2026-10-29`, head `a10e2bb7...`; compare status diverged, 117 ahead/26 behind | Нові вимірювання існують на окремій дослідницькій гілці й доступні для аудиту | Що новий harness/report уже є частиною production main |
| M-14 | Baseline benchmark now emits the occurrence ledger required by the neural comparator | DONE_VERIFIED on PR #399 head; neural pairing rerun still PARTIAL | PR [#399](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/399), head `ad7ce7caf1dc56f22449a88b2c565e049d95873d`; exact-head run [41123471367](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41123471367); artifact `13008699681` | Ledger schema v1 contains all 2,703 UGTPHON and 999 SIGMORPHON occurrences for six engines; CI validates order, identity fields and scored records | Що свіжий Charsiu-vs-baseline joined run пройшов: research-only neural inference and pairing jobs were skipped on this PR |

## Ключові методологічні правила

1. Завжди публікувати знаменник, coverage і abstentions поряд з exact match.
2. Exact match, CER, PER і feature-weighted proxy — різні метрики; feature proxy — проєктне діагностичне визначення, а не універсальний стандарт.
3. Порівнювати лише парні входження з однаковими IDs і пояснювати відмінність між full-set і shared-subset rates.
4. Не змішувати українську цільову якість з корейським IPA benchmark.
5. Час порівнювати лише за сумісних timing scopes; cold model-load/batch не зіставляти напряму з in-process per-word.
6. Зовнішні neural outputs можуть бути teacher/candidate evidence, але не стають gold і не породжують production rules автоматично.
7. Тренувальне перетинання позначати як contamination risk, а не як доведений leakage, якщо checkpoint manifest не доступний.
8. Ліцензія коду, ліцензія моделі, ліцензія токенізатора та права на датасет — окремі питання.
9. Усі непідтверджені висновки позначати як гіпотези або блокери, не маскувати їх впевненим стилем.

## Джерела і контрольні артефакти

- Main: [f93ae007592f216ccd2493f6652d228b876c8338](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/commit/f93ae007592f216ccd2493f6652d228b876c8338).
- Latest main tests/build: [41110109093](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41110109093).
- System verification: [41110109184](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41110109184).
- Master/research artifacts: [41110109342](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41110109342).
- Pages deployment: [41110109231](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41110109231).
- Expanded benchmark PR: [#371](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/371).
- Baseline occurrence-ledger fix: [PR #399](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/399), exact-head baseline benchmark [run 41123471367](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41123471367); neural pairing job skipped by opt-in policy.
- Expanded benchmark report: [branch report](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/blob/bench/extended-metrics-runtime-2026-10-29/docs/EXTENDED-BENCHMARK-METRICS-2026-10-29.md).
- Native/g2pK/Charsiu/ByT5 detailed logs: [run 40843579685](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40843579685).

## Maintenance rule

Update this register whenever a public statement, metric, model status, source license, or acceptance status changes. Do not copy a score into the public page unless the source row/run and denominator are recorded here.
