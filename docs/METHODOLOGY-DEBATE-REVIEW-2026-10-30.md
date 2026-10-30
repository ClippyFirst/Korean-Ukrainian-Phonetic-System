# Методологічна рецензія: окремі аналітичні перспективи й adjudication — оновлено 2026-10-31

## Статус і межі процедури

Цей документ фіксує застосування skill-підходів як структурованих аналітичних процедур. **Це не незалежне людське рецензування і не участь авторів відповідних GitHub-репозиторіїв.** Академічна й доказова перспективи нижче — два окремі контрольні проходи одного процесу, а не два зовнішні експерти чи автономні агенти.

## Використані підходи

1. **obra/superpowers — перший етап.** Спочатку встановлюються фактичний стан репозиторію, межі продукту, наявні плани/матриці/тести й acceptance criteria. Для реалізації застосовуються vertical TDD slices, systematic debugging і перевірка точного фінального стану перед злиттям.
2. **Imbad0202/academic-research-skills та K-Dense-AI/scientific-agent-skills — академічна й доказова перспективи.** Перевіряються дослідницьке питання, логіка висновків, provenance, denominators, статистика, версії даних/моделей, contamination, licensing і межі узагальнення. Це структуровані аналітичні проходи, не зовнішні рецензенти.
3. **mattpocock/skills — інженерна якість.** Застосовано двовісну перевірку Standards/Spec, інтерфейсну дисципліну deep modules/seams і TDD. Зміни не повинні збільшувати архітектурний обсяг без конкретної потреби.
4. **DietrichGebert/ponytail — технічний борг і мінімальний diff.** Застосовується YAGNI, перевірка причинного джерела проблеми, видалення зайвого та уникнення speculative generality.
5. **Adjudication.** Суперечності вирішуються за першоджерелами, кодом, workflow logs та benchmark artifacts; голосування або компромісне формулювання не замінюють доказ.

## Питання 1. Чи можна представити сервіс як «повністю точний корейсько-український стандарт»?

- **Академічна перспектива:** ні. Діагностичні корпуси й регресії не дорівнюють незалежно adjudicated нормативному holdout.
- **Доказова перспектива:** exact match Korean IPA не є оцінкою української цільової якості; для обох потрібні окремі gold sets.
- **Рішення:** описувати проєкт як авторську дослідницьку практичну систему з простежуваним IPA-first pipeline. Абсолютну мовну точність або нормативну сертифікацію не заявляти.

## Питання 2. Як інтерпретувати native проти g2pK?

- **Академічна перспектива:** показувати корпуси окремо, не оголошувати універсального переможця.
- **Доказова перспектива:** публікувати scored denominators, coverage, abstentions, paired occurrence identities, metric definitions і shared-renderer caveat.
- **Рішення:** UGTPHON exact match: native 1,430/2,698 scored = 53.0022% (5 abstentions), g2pK 1,435/2,703 = 53.0892%. SIGMORPHON: native 357/998 scored = 35.7715% (1 abstention), g2pK 353/999 = 35.3353%. Paired exact-classification McNemar exact two-sided p=0.125 on each corpus; ці дані не встановлюють статистично переконливої переваги. Показники є діагностикою Korean IPA, а не нормативною accuracy.

## Питання 3. Чи потрібно публікувати сильні CharsiuG2P scores?

- **Академічна перспектива:** сильний зовнішній baseline не слід приховувати лише через те, що він незручний.
- **Доказова перспектива:** historical observed score треба відокремлювати від незалежної generalization evidence; враховувати train/test overlap, checkpoint manifest, convention compatibility та weights license.
- **Рішення:** 88.531% UGTPHON і 70.971% SIGMORPHON залишаються історичними результатами run 40843579685. У фінальному corrected rerun 41141286672 Charsiu inference було SKIPPED; отже ці числа не подаються як актуальна частина corrected portfolio. Вони не є gold oracle, доказом незалежного узагальнення або production dependency.

## Питання 4. Чи можна використати runtime як конкурентну перевагу?

- **Академічна перспектива:** runtime — окрема властивість, не доказ фонетичної точності.
- **Доказова перспектива:** потрібні однакові timing scope, runner, warm-up і repetitions.
- **Рішення:** у поточному UGTPHON Python harness (1,907 unique words; один warm-up; п'ять repetitions) median total time становив 712.053 ms native і 41,863.406 ms g2pK, приблизно 58.79×. Це вимірювання конкретного harness з Python adapter overhead, без corpus loading/scoring; не переносити на браузер, інші пристрої або production workload.

## Питання 5. Що доводить зелений CI?

- **Академічна перспектива:** стабільність реалізації й відтворення зафіксованих software expectations.
- **Доказова перспектива:** не незалежну фонетичну правильність, репрезентативність корпусів чи оптимальність українських форм.
- **Рішення:** на main `2cd049762fc2a1bd5ea85428762b9ceb2c4d3130` підтверджено 1,340/1,340 browser tests, Python 3.11/3.12/3.13, web tests/build, clean wheel install, teacher-corpus audit, strict corpus generation, Pages deployment, HTTP smoke і live Playwright practical-mode smoke. NIKL metadata-only inventory було SKIPPED. Лінгвістична валідація залишається окремим gate.

## Питання 6. Чи є тепер occurrence ledger достатнім для neural pairing?

- **Інженерна перспектива:** schema-v1 producer і перевірка повних ledgers тепер інтегровані в main через PR #401; усі 10 рушіїв мають впорядковані occurrence IDs на обох корпусах.
- **Доказова перспектива:** наявність ledger не означає, що neural predictions існують або що їх можна порівняти.
- **Рішення:** occurrence-ledger contract DONE_VERIFIED; Charsiu inference, ByT5 inference і joined neural pairing у run 41141286672 були SKIPPED через default-off opt-in. Fresh neural-vs-baseline result не заявляється.

## Поточна інтеграція та нерозв'язані gates

- PR #401 інтегрував corrected extended benchmark; PR #402 оновив публічні/технічні metric disclosures; PR #403 оновив current CI evidence; PR #404 виправив округлення SIGMORPHON native exact rate до 35.7715%.
- PR #371 залишається відкритим і не зливається wholesale: корисні benchmark зміни були selectively ported у #401, а решта гілки diverged/stale.
- PR #398 залишається відкритим і не зливається wholesale; claim/evidence register та цей review record переносяться вибірково після актуалізації, а застарілі public metrics не копіюються.
- Issue #337 не має кваліфікованих reviewer submissions. Потрібні дві незалежні packet-based Korean IPA annotations.
- Незалежний Korean IPA gold, Ukrainian target gold, Charsiu checkpoint license/training manifest і KoG2Padvanced upstream license залишаються BLOCKED / EVIDENCE-LIMITED.

## Узгоджена редакційна політика

- Не применшувати виміряні досягнення native engine, але не перетворювати їх на непідтверджені claims.
- Не приховувати сильні зовнішні результати; відділяти historical observation від актуального corrected benchmark.
- Не підміняти мовну валідацію тестами коду.
- Не перетворювати risk of contamination на доведений leakage.
- Не приписувати ліцензію, якщо вона не підтверджена саме для відповідних ваг/даних.
- Кожна публічна цифра повинна мати run, corpus, denominator, metric, version і interpretation note.

## Посилання на застосовані skill-підходи

- [obra/superpowers](https://github.com/obra/superpowers)
- [mattpocock/skills](https://github.com/mattpocock/skills)
- [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)
- [Imbad0202/academic-research-skills](https://github.com/Imbad0202/academic-research-skills)
- [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills)
