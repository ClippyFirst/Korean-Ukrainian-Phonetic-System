import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const system = readFileSync(new URL('../system.html', import.meta.url), 'utf8');
const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const engine = readFileSync(new URL('../src/app/engine.js', import.meta.url), 'utf8');
const soft = readFileSync(new URL('../src/app/soft_morphology.js', import.meta.url), 'utf8');
const g2pk = readFileSync(new URL('../src/app/g2pk_web.js', import.meta.url), 'utf8');

test('ordinary and detailed modes disclose the two actual browser engines', () => {
  assert.match(index, /Звичайний режим/u);
  assert.match(index, /Режим докладного аналізу/u);
  assert.match(index, /детермінованим рушієм Козака Кіма/u);
  assert.match(index, /href="\.\/system\.html#methodology-02c-kozak-kim"/u);
  assert.match(main, /const useG2p=!(modeResearch&&modeResearch.checked)/u);
  assert.match(main, /useG2p\?webEngine\.convert\(value\):engine\.convert\(value,\{morphologyMode\}\)/u);
  assert.match(main, /useG2p\?'g2pK · ':'Козак Кім · '/u);
  assert.match(g2pk, /vendored JavaScript port of g2pK/u);
});

test('methodology documents all three native modes and their real constraints', () => {
  for (const term of ['Строгий режим','М’який режим','Суперм’який режим','R002','R003','R007','orthographic-phonemic','11 172','квадратних дужках']) {
    assert.ok(system.includes(term), 'methodology must document ' + term);
  }
  assert.match(engine, /morphologyMode==='super-soft'/u);
  assert.match(soft, /Soft NEVER \u00a715 substantive neutralization via soft/u);
  assert.match(soft, /Quality is intentionally lower than strict\/soft/u);
});

test('methodology reports the real benchmark balance and current CI evidence', () => {
  for (const term of ['1 335 / 1 335','41062714768','41062714731','41062714460','53,1827%','53,3333%','35,8074%','35,4062%','не дають підстав проголосити один рушій універсальним переможцем']) {
    assert.ok(system.includes(term), 'methodology must include ' + term);
  }
});

test('RR and Hanja are described as parallel outputs, not pronunciation inputs', () => {
  assert.match(system, /Ханча \(漢字\) — словникова анотація/u);
  assert.match(system, /184 079 словникових читань у 19 групах/u);
  assert.match(system, /RR не є входом IPA чи українського адаптера/u);
});
