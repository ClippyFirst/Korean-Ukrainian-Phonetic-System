import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);
const entries = new Map(parseCsv(lexical).map((row) => [row.input, row]));

test('§29 numeric phrase examples preserve source spacing and normative inserted-liquid readings', () => {
  const cases = [
    ['3 연대', '삼년대', 'сам ньонде', 'sam ɲʌn dɛ'],
    ['1 연대', '일련대', 'іл льонде', 'il ljʌn dɛ'],
  ];
  for (const [input, surface, ukrainian, ipa] of cases) {
    const row = entries.get(input);
    assert.ok(row, input + ': official example must be sourced');
    assert.equal(row.surface_hangul, surface, input);
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, surface, input);
    assert.equal(result.ukrainian, ukrainian, input);
    assert.equal(result.ipa, ipa, input);
    assert.equal(result.status, 'lexical-review', input);
  }
});

test('§29 no-insertion numeric exceptions stay distinct from positive numeric examples', () => {
  assert.equal(engine.convert('6·25').surfaceHangul, '유기오');
  assert.equal(engine.convert('3·1절').surfaceHangul, '사밀쩔');
  assert.equal(engine.convert('3 연대').surfaceHangul, '삼년대');
  assert.equal(engine.convert('1 연대').surfaceHangul, '일련대');
});
