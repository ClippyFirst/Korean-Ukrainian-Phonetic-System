import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

test('three exact UGTPHON morphology cases resolve without rewriting source spelling', () => {
  const cases = {
    '쫒아내면': '쪼자내면',
    '많앗구나유유유': '마낫꾸나유유유',
    '무서웟어': '무서워서',
  };
  for (const [input, expectedSurface] of Object.entries(cases)) {
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, expectedSurface, input + ': Korean surface');
    assert.ok(result.ipa, input + ': broad IPA must be emitted');
    assert.ok(['model-selected', 'provisional', 'unavailable'].includes(result.target_status), input + ': target status must remain explicit');
    assert.ok(!result.issues.some(issue => /requires morphology|unresolved/u.test(issue)), input + ': no unresolved morphology issue');
    assert.ok(!result.ukrainian.includes('⟦'), input + ': no unresolved target placeholder');
  }
});

test('exact noisy-form licenses do not generalize to neighboring spellings', () => {
  for (const input of ['칡칡이', '칡칡에', '쫒아내서', '많앗으면', '무서웟어요']) {
    const result = engine.convert(input);
    assert.equal(result.pronunciation_status, 'unresolved', input + ': a different full form must remain fail-closed');
    assert.ok(result.issues.length > 0, input + ': explain the missing exact morphology evidence');
  }
});
