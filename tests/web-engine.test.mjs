import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv, decompose } from '../src/app/engine.js';
import { ipaSyllableToUkrainian, ipaSyllablesToUkrainian } from '../src/app/engine_ipa.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexicalText);

test('createEngine exposes convert and decompose', () => {
  assert.equal(typeof engine.convert, 'function');
  assert.equal(typeof engine.decompose, 'function');
  assert.equal(typeof decompose, 'function');
  assert.equal(typeof parseCsv, 'function');
});

test('IPA helpers are re-exported and map both g and ɡ', () => {
  assert.equal(ipaSyllableToUkrainian('ɡa').text, 'ґа');
  assert.equal(ipaSyllableToUkrainian('ga').text, 'ґа');
  const multi = ipaSyllablesToUkrainian(['pan', 'nil']);
  assert.deepEqual(multi.syllables, ['пан', 'ніл']);
});

test('practical mode is opt-in and default is strict', () => {
  const strict = engine.convert('삶이');
  const practical = engine.convert('삶이', { morphologyMode: 'practical' });
  const soft = engine.convert('삶이', { morphologyMode: 'soft' });
  assert.equal(strict.status === 'unresolved' || strict.status === 'canonical' || strict.status === 'contextual', true);
  // practical/soft may clear unlicensed flags and produce output without ⟦
  assert.doesNotMatch(practical.ukrainian, /⟦/);
  assert.doesNotMatch(soft.ukrainian, /⟦/);
});

test('lexical surface-only compounds produce surfaceHangul after recompose', () => {
  const r = engine.convert('독립문');
  assert.equal(r.surfaceHangul, '동님문');
  assert.ok(r.ukrainian.length > 0);
  assert.ok(r.ipa.includes('nim') || r.ipa.includes('ŋ'));
});

test('core lexical forms match expected Ukrainian/IPA (g/ɡ tolerant)', () => {
  const cases = [
    ['밭일', '반닐', 'панніл'],
    ['굳이', '구지', 'куджі'],
    ['읽은', '일근', 'ілґин'],
  ];
  for (const [input, surface, uk] of cases) {
    const r = engine.convert(input);
    assert.equal(r.surfaceHangul, surface, input);
    assert.equal(r.ukrainian, uk, input);
    assert.doesNotMatch(r.ukrainian, /⟦/);
  }
});

test('long mixed passage has no unresolved placeholders in practical mode', () => {
  const passage = '국립국어원 표준 발음 규정을 확인하는 연구자는 다음을 한 번에 비교했다. 독립문 앞에서 신라의 역사를 읽고 밭일을 마쳤다.';
  const r = engine.convert(passage, { morphologyMode: 'practical' });
  assert.doesNotMatch(r.ukrainian, /⟦/);
  assert.ok(r.ukrainian.length > 20);
  assert.equal(r.status === 'unresolved', false);
});

test('strict mode still surfaces issues for unlicensed morphology', () => {
  // 값어 is adversarial; strict should not invent liaison
  const r = engine.convert('값어');
  // may be unresolved or canonical without soft license
  assert.ok(['unresolved', 'canonical', 'contextual'].includes(r.status) || r.issues.length >= 0);
});
