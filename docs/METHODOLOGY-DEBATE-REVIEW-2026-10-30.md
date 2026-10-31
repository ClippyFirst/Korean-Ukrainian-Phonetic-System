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
- **Рішення:** на main `ca6133890139f76c88253b2b1d0bbc3a6191601a` підтверджено 1,341/1,341 browser tests, Python 3.11/3.12/3.13, web tests/build, clean wheel install, teacher-corpus audit, strict corpus generation, Pages deployment, HTTP smoke і live Playwright practical-mode smoke (runs 41144925083, 41144925101, 41144925095, 41144925073). NIKL metadata-only inventory було SKIPPED. Лінгвістична валідація залишається окремим gate.

## Питання 6. Чи є тепер occurrence ledger достатнім для neural pairing?

- **Інженерна перспектива:** schema-v1 producer і перевірка повних ledgers тепер інтегровані в main через PR #401; усі 10 рушіїв мають впорядковані occurrence IDs на обох корпусах.
- **Доказова перспектива:** наявність ledger не означає, що neural predictions існують або що їх можна порівняти.
- **Рішення:** occurrence-ledger contract DONE_VERIFIED; Charsiu inference, ByT5 inference і joined neural pairing у run 41141286672 були SKIPPED через default-off opt-in. Fresh neural-vs-baseline result не заявляється.

## Питання 7. Чи є RR → українська окремою методикою, а не ще одним відображенням IPA?
- **Академічна перспектива:** так, якщо проміжною основою є саме Revised Romanization, а не паралельний IPA trace. RR — офіційна корейська система латинського запису, заснована на стандартній вимові; її диграфи й триграфи є одиницями таблиці, а не англійською орфографією.
- **Доказова перспектива:** NIKL підтверджує RR values, але не українські графемні відповідники. Рудь (2024) описує брак єдиного корейсько-українського стандарту та розрізняє транскрипцію й транслітерацію.
- **Рішення:** у PR #407 створено окремий ланцюг Hangul surface → RR components → Ukrainian table. У RR-режимі UI показує власний trace та не показує IPA→Ukrainian trace як джерело цільового результату. Українські відповідники залишаються проєктними й попередніми до незалежного читачевого/фахового тесту.

## Питання 8. Чи можна просто перенести російську таблицю на українську?
- **Академічна перспектива:** ні. Рудь (2024), розділ 3.1, описує Холодовича—Концевича як окрему кириличну систему, зорієнтовану на російську фонологію; у ній окремі контрасти зливаються (зокрема ㄴ/ㅇ coda та 어/오). RR — інша система, латинська й офіційна для Республіки Корея.
- **Доказова перспектива:** російська система корисна як порівняльний прецедент для послідовної кирилізації, але не є джерелом нормативних українських відповідників і не повинна стирати українські фонологічні відмінності.
- **Рішення:** таблиця в system.html#methodology-02b-ukrainian-rr показує RR, H-K та проєктний український відповідник окремо. Вона не заявляє, що H-K є прямою транслітерацією RR.

## Поточна інтеграція та нерозв'язані gates

- PR #401 інтегрував corrected extended benchmark; PR #402 оновив публічні/технічні metric disclosures; PR #403 оновив current CI evidence; PR #404 виправив округлення SIGMORPHON native exact rate до 35.7715%.
- PR #371 залишається відкритим і не зливається wholesale: корисні benchmark зміни були selectively ported у #401, а решта гілки diverged/stale.
- PR #398 закрито як superseded після вибіркового перенесення оновлених claim/evidence register і review record через PR #405; вихідну гілку збережено, застарілі public metrics не зливалися.
- Issue #337 не має кваліфікованих reviewer submissions. Попередньо визначено три potential leads (Yoonjung Kang, Taehong Cho, Seongyeon Ko), але нікого не контактували; availability та conflicts of interest не перевірені. Потрібні дві незалежні packet-based Korean IPA annotations.
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

## RR → Ukrainian contextual phonetic layer — 2026-10-31

### Decision recorded

The previous flat component mapping is retained as a fallback register, but it is no longer treated as the complete target algorithm. A separate context-rule register now selects onset mappings using Hangul Jamo identity, RR unit, word position and preceding coda class. The trace additionally records sentence position, word/sentence indices and syllable index so that results can be inspected in running text.

### Phonetic rationale

- NIKL Revised Romanization is based on standard Korean pronunciation and explicitly distinguishes context-dependent ㄱ/ㄷ/ㅂ values, ㄹ versus ㄹㄹ, and special cases such as assimilation, epenthesis, palatalization and ㅎ-conditioned aspiration.
- Korean phonetics research describes the lenis/fortis/aspirated contrast. The project therefore reserves the apostrophe marker for the phonemic aspirated onset series ㅋ/ㅌ/ㅍ/ㅊ, while keeping lenis and fortis as separate categories.
- Lenis ㄱ/ㄷ/ㅂ/ㅈ are adapted as voiceless at word onset or after an obstruent, and as voiced after a vowel/sonorant. This is an explicit project approximation; it is not a claim that RR itself encodes these Ukrainian choices.
- RR ㄹㄹ can produce an onset unit `l`; the Ukrainian base register now includes that unit, fixing the previously unmapped liquid-assimilation case.

### Adjudication and limits

1. **Accepted as an engineering improvement:** explicit syllable/word/sentence context and an inspectable rule ID are preferable to unconditional one-grapheme replacement.
2. **Accepted as a project convention:** ASCII apostrophe marks the phonemic aspirated series in this mode. This must remain distinct from weak aspiration of word-initial lenis consonants and from fortis tension.
3. **Not accepted as established Ukrainian phonetic fact:** the exact Ukrainian outputs к/ґ, т/д, п/б, ч/дж and к'/т'/п'/ч' still require independent Ukrainian phonetic review and reader testing.
4. **Not established:** superiority over Kholodovich–Konzevich. The method preserves more explicit contextual distinctions in its trace, but comparative quality requires a held-out word/sentence corpus and blinded readers.
5. Sentence position is currently recorded and resets at sentence punctuation; no sentence-position-specific target rules are asserted yet. The active selection rules are word-position and local-coda based.
6. The RR adapter consumes an already-resolved Hangul surface form. It does not independently implement Korean phonological processes, recover morphology, or infer proper-name boundary conventions.

### Sources

- [NIKL — Romanization of Korean](https://www.korean.go.kr/front_eng/roman/roman_01.do)
- [NIKL — 2026 guidance on the pronunciation of ㅢ](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=201&pageIndex=1&qna_seq=334585)
- [Song, Kim & Cho (2023), Korean three-way stop contrast](https://biz.hanyang.ac.kr/documents/10980062/13049795/HISPhonCog2023_P76_Song_etal.pdf/f52b4285-3aee-1657-3383-d266ffff55d0)
- [Kim et al. (2024), laryngeal contrast and prosodic strengthening](https://doi.org/10.13064/ksss.2024.16.1.017)
- [Rud (2024), Ukrainian transcription of Korean proper names](https://ir.library.knu.ua/entities/publication/bdb2f408-ca5b-4fdc-879a-95240572e08a)
### Additional vowel-context decision — ㅢ

NIKL's Standard Pronunciation Rule 5 distinguishes ㅢ by syllable context: ㅢ with a consonantal onset is [i]; outside the first syllable [i] is permitted; the possessive particle 의 may also be [e]. The RR spelling remains `ui`. The contextual adapter therefore keeps `ui` in the RR trace but maps to Ukrainian `і` in the consonantal-onset case and in the selected noninitial [i] variant; initial silent-onset 의 retains the [ɰi]-approximation `уї`. It does not guess the particle [e] variant because the current RR route has no morphological analysis. This is grounded on NIKL's [2026 clarification of Rule 5](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=201&pageIndex=1&qna_seq=334585). The Ukrainian spelling choices remain project adaptations.
