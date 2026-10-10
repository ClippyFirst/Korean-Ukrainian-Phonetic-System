import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

test('§27 adnominal -(으)ㄹ fortition is licensed for every official phrase example', () => {
  const cases = [
    ['할 것을', 'k͈ʌ'],
    ['갈 데가', 't͈e'],
    ['할 바를', 'p͈a'],
    ['할 수는', 's͈u'],
    ['할 적에', 'tɕ͈ʌ'],
    ['갈 곳', 'k͈ot̚'],
    ['할 도리', 't͈o'],
    ['만날 사람', 's͈a'],
  ];
  for (const [phrase, expectedIpa] of cases) {
    const result = engine.convert(phrase);
    assert.ok(result.trace.some((item) => item.rules.includes('adnominal-r-fortition-§27')), phrase);
    assert.ok(result.ipa.includes(expectedIpa), phrase + ': expected fortis IPA ' + expectedIpa);
    assert.equal(result.issues.length, 0, phrase);
  }
});

test('§27 does not generalize fortition to arbitrary word-final ㄹ', () => {
  const result = engine.convert('서울 사람');
  assert.ok(!result.trace.some((item) => item.rules.includes('adnominal-r-fortition-§27')));
  assert.ok(!result.ipa.includes('s͈a'));
});

test('§29 official cross-word n-insertion examples are licensed pair-by-pair', () => {
  const cases = [
    ['한 일', 'phrase-n-insertion-§29'],
    ['옷 입다', 'phrase-n-insertion-§29'],
    ['먹은 엿', 'phrase-n-insertion-§29'],
    ['할 일', 'phrase-n-insertion-§29'],
    ['잘 입다', 'phrase-n-insertion-§29'],
    ['먹을 엿', 'phrase-n-insertion-§29'],
  ];
  for (const [phrase, rule] of cases) {
    const result = engine.convert(phrase);
    assert.ok(result.trace.some((item) => item.rules.includes(rule)), phrase);
    assert.equal(result.issues.length, 0, phrase);
  }
});

test('§29 insertion rules do not cross punctuation or fire on an unlicensed pair', () => {
  for (const phrase of ['한, 일', '할! 일', '서울 일']) {
    const result = engine.convert(phrase);
    assert.ok(!result.trace.some((item) => item.rules.includes('phrase-n-insertion-§29')), phrase);
  }
});

test('§29 internal compound example 서른여섯 uses the sourced standard surface form', () => {
  const result = engine.convert('서른여섯');
  assert.equal(result.surfaceHangul, '서른녀섣');
  assert.equal(result.status, 'lexical-review');
  assert.equal(result.ipa, 'sʌ ɾɯn ɲʌ sʌt̚');
});
