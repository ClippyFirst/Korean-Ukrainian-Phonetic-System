import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

// NIKL Standard Pronunciation Rule §10: 밟- before ㄴ is [밤ː는].
test('NIKL 밟는 has an explicit long-vowel Korean surface form', () => {
  const result = engine.convert('밟는');
  assert.equal(result.surfaceHangul, '밤는');
  assert.equal(result.ipa, 'pamː nɯn');
  assert.ok(!result.ukrainian.includes('⟦'));
});
