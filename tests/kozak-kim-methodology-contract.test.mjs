import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const system = readFileSync(new URL('../system.html', import.meta.url), 'utf8');
const evidenceRegister = readFileSync(new URL('../docs/METHODOLOGY-CLAIMS-AND-EVIDENCE-REGISTER-2026-10-30.md', import.meta.url), 'utf8');
const debateReview = readFileSync(new URL('../docs/METHODOLOGY-DEBATE-REVIEW-2026-10-30.md', import.meta.url), 'utf8');
const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const engine = readFileSync(new URL('../src/app/engine.js', import.meta.url), 'utf8');
const soft = readFileSync(new URL('../src/app/soft_morphology.js', import.meta.url), 'utf8');
const g2pk = readFileSync(new URL('../src/app/g2pk_web.js', import.meta.url), 'utf8');

test('ordinary and detailed modes disclose the two actual browser engines', () => {
  assert.match(index, /Звичайний режим/u);
  assert.match(index, /Режим докладного аналізу/u);
  assert.match(index, /На відміну від звичайного режиму на g2pK/u, 'the visible service copy must explicitly distinguish the two engines');
  assert.match(index, /детермінованим рушієм Козака Кіма/u);
  assert.match(index, /href="\.\/system\.html#methodology-02c-kozak-kim"/u);
  assert.match(main, /const useG2p=!\(modeResearch&&modeResearch\.checked\)/u);
  assert.match(main, /useG2p\?webEngine\.convert\(value\):engine\.convert\(value,\{morphologyMode\}\)/u);
  assert.match(main, /useG2p\?'g2pK · ':'Козак Кім · '/u);
  assert.match(g2pk, /vendored JavaScript port of g2pK/u);
});

test('methodology documents all three native modes and their real constraints', () => {
  for (const term of ['Строгий режим','М’який режим','Суперм’який режим','R002','R003','R007','orthographic-phonemic','11 172','квадратних дужках','Apache-2.0','G2pBrowser','descriptive: false','engine_rules_ctx.js','engine_rules_phrase.js']) {
    assert.ok(system.includes(term), 'methodology must document ' + term);
  }
  assert.match(engine, /morphologyMode==='super-soft'/u);
  assert.match(soft, /soft never resolves substantive/u);
  assert.match(soft, /Quality is intentionally lower than strict\/soft/u);
});

test('methodology reports corrected benchmark metrics, coverage, and evidence limits', () => {
  for (const term of [
    '1 340 / 1 340','41143243310','41143243218','41143243251','41143243225','live Playwright practical-mode smoke',
    '41138727409','2 698 scored / 5 abstentions','998 scored / 1 abstention',
    '53,0022%','53,0892%','35,7715%','35,3353%',
    '9,1697%','9,2285%','14,6978%','14,8222%',
    '9,6139%','9,6472%','16,2343%','16,3126%',
    '4,8765%','4,8952%','7,5491%','7,5990%',
    'не встановлюють універсального переможця',
    'не доводить лінгвістичну правильність','METHODOLOGY-CLAIMS-AND-EVIDENCE-REGISTER-2026-10-30.md','METHODOLOGY-DEBATE-REVIEW-2026-10-30.md'
  ]) {
    assert.ok(system.includes(term), 'methodology must include ' + term);
  }
});

test('methodology evidence register and debate review preserve current evidence boundaries', () => {
  for (const term of [
    'M-05','53.0022%','53.0892%','35.7715%','35.3353%',
    'McNemar exact two-sided p=0.125','13019822857',
    'M-13','M-14','M-15','DONE_VERIFIED','BLOCKED / EVIDENCE-LIMITED',
    'CharsiuG2P','weights','NIKL metadata-only inventory'
  ]) {
    assert.ok(evidenceRegister.includes(term), 'evidence register must include ' + term);
  }
  for (const term of [
    'не незалежне людське рецензування',
    'mattpocock/skills','DietrichGebert/ponytail',
    'McNemar exact two-sided p=0.125','58.79×',
    'Charsiu inference було SKIPPED','issue #337'
  ]) {
    assert.ok(debateReview.includes(term), 'debate review must include ' + term);
  }
});

test('RR and Hanja are described as parallel outputs, not pronunciation inputs', () => {
  assert.match(system, /Ханча \(漢字\) — словникова анотація/u);
  assert.match(system, /184 079 словникових читань у 19 групах/u);
  assert.match(system, /RR не є входом IPA чи українського адаптера/u);
});
