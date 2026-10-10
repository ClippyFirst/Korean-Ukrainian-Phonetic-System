import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const corpus = readFileSync(new URL('./fixtures/adversarial-morphology-corpus-2026-10-10.txt', import.meta.url), 'utf8').trim();
const engine = createEngine(canonical, lexical);

test('morphology-sensitive past-tense and complex-coda forms have sourced surface readings', () => {
  const cases = [
    ['있었다', '이썯따', 'ісотта', 'i s͈ʌt̚ t͈a'],
    ['있었고', '이썯꼬', 'ісотко', 'i s͈ʌt̚ k͈o'],
    ['웃었고', '우섣꼬', 'усотко', 'u sʌt̚ k͈o'],
    ['넓어졌다는', '널버젇따는', 'нолбочоттанин', 'nʌl bʌ dʑʌt̚ t͈a nɯn'],
    ['삯일을', '상니를', 'саннірил', 'saŋ ni ɾɯl']
  ];
  for (const [input, surface, ukrainian, ipa] of cases) {
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, surface, input + ': surface Hangul');
    assert.equal(result.ukrainian, ukrainian, input + ': Ukrainian target');
    assert.equal(result.ipa, ipa, input + ': IPA');
    assert.equal(result.status, 'lexical-review', input + ': provisional target must remain labelled');
    assert.ok(!result.ukrainian.includes('⟦'), input + ': no unresolved placeholders');
  }
});

test('the fourth adversarial Korean paragraph corpus has no unresolved placeholder output', () => {
  assert.ok(corpus.includes('안내원은'));
  assert.ok(!corpus.includes('员'), 'fixture must contain Korean 안내원, not the accidental Chinese character');
  const result = engine.convert(corpus);
  assert.ok(!result.ukrainian.includes('⟦'), 'unexpected unresolved target: ' + result.ukrainian);
  assert.ok(!result.ukrainian.includes('⟧'), 'unexpected unresolved target: ' + result.ukrainian);
  assert.equal(result.issues.length, 0, result.issues.join('\n'));
});
