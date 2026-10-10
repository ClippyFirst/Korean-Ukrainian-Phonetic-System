import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

test('§4 generic ㅚ words expose [we] without changing Korean spelling or Ukrainian output', () => {
  const result = engine.convert('괴물');
  assert.equal(result.ipa, 'kø mul');
  assert.equal(result.ukrainian, 'квемул');
  assert.equal(result.variants.length, 1);
  assert.equal(result.variants[0].surface, '괴물');
  assert.equal(result.variants[0].ukrainian, result.ukrainian);
  assert.equal(result.variants[0].ipa, 'kwe mul');
  assert.match(result.variants[0].note, /§4/u);
  assert.match(result.variants[0].note, /철자|нап(u|и)с/u);
});

test('§4 generic ㅟ words expose [wi] without changing Korean spelling or Ukrainian output', () => {
  const result = engine.convert('귀');
  assert.equal(result.ipa, 'ky');
  assert.equal(result.ukrainian, 'кві');
  assert.equal(result.variants.length, 1);
  assert.equal(result.variants[0].surface, '귀');
  assert.equal(result.variants[0].ukrainian, result.ukrainian);
  assert.equal(result.variants[0].ipa, 'kwi');
  assert.match(result.variants[0].note, /§4/u);
});

test('§4 enumerates every combination for up to three optional vowels', () => {
  const result = engine.convert('괴물귀');
  assert.equal(result.ipa, 'kø mul ɡy');
  assert.equal(result.variants.length, 3);
  assert.deepEqual(result.variants.map((variant) => variant.ipa), [
    'kwe mul ɡy',
    'kø mul ɡwi',
    'kwe mul ɡwi',
  ]);
  for (const variant of result.variants) {
    assert.equal(variant.surface, '괴물귀');
    assert.equal(variant.ukrainian, result.ukrainian);
  }
});

test('§4 avoids exponential variant growth for text with more than three optional vowels', () => {
  const result = engine.convert('괴물귀회외');
  assert.equal(result.variants.length, 4);
  assert.ok(result.variants.every((variant) => variant.note.includes('інші необрані голосні')));
  assert.ok(result.variants.every((variant) => variant.surface === '괴물귀회외'));
});

test('the listed lexical example 회 keeps its spelling in both permitted IPA readings', () => {
  const result = engine.convert('회');
  assert.equal(result.surfaceHangul, '회');
  assert.equal(result.ipa, 'hø');
  assert.equal(result.variants.length, 1);
  assert.equal(result.variants[0].surface, '회');
  assert.equal(result.variants[0].ipa, 'hwe');
});
