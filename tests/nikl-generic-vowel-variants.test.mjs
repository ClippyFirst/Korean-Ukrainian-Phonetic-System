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


test('§5 non-initial ㅢ exposes the permitted [i] reading and adjusts the Ukrainian target', () => {
  const genericEngine = createEngine(canonical, '');
  const result = genericEngine.convert('민주주의');
  assert.equal(result.ipa, 'min dʑu dʑu ɰi');
  assert.equal(result.ukrainian, 'мінджуджуий');
  assert.equal(result.variants.length, 1);
  assert.equal(result.variants[0].ipa, 'min dʑu dʑu i');
  assert.equal(result.variants[0].ukrainian, 'мінджуджуі');
  assert.match(result.variants[0].note, /§5/u);
});

test('§5 does not infer the optional [i] reading for word-initial ㅢ without particle evidence', () => {
  const genericEngine = createEngine(canonical, '');
  const result = genericEngine.convert('의견');
  assert.equal(result.ipa, 'ɰi ɡjʌn');
  assert.equal(result.variants.length, 0);
});

test('§5 word boundaries prevent non-initial ㅢ alternatives from leaking across spaces', () => {
  const genericEngine = createEngine(canonical, '');
  const result = genericEngine.convert('민주주의 의의');
  assert.equal(result.variants.length, 3);
  assert.ok(result.variants.some((variant) => variant.ipa === 'min dʑu dʑu i ɰi ɰi'));
  assert.ok(result.variants.some((variant) => variant.ipa === 'min dʑu dʑu ɰi ɰi i'));
  assert.ok(result.variants.some((variant) => variant.ipa === 'min dʑu dʑu i ɰi i'));
});


test('§5 generic ㅖ may be [e] except in the syllables 예 and 례', () => {
  const genericEngine = createEngine(canonical, '');
  const result = genericEngine.convert('폐기');
  assert.equal(result.ipa, 'pʰje ɡi');
  assert.equal(result.ukrainian, 'пєґі');
  assert.equal(result.variants.length, 1);
  assert.equal(result.variants[0].surface, '폐기');
  assert.equal(result.variants[0].ipa, 'pʰe ɡi');
  assert.equal(result.variants[0].ukrainian, 'пеґі');
  assert.match(result.variants[0].note, /§5/u);

  assert.equal(genericEngine.convert('예').variants.length, 0);
  assert.equal(genericEngine.convert('례').variants.length, 0);
});

test('§5 combines optional ㅖ-to-[e] readings without changing Korean spelling', () => {
  const genericEngine = createEngine(canonical, '');
  const result = genericEngine.convert('폐기계');
  assert.equal(result.ipa, 'pʰje ɡi ɡje');
  assert.equal(result.variants.length, 3);
  assert.deepEqual(result.variants.map((variant) => variant.ipa), [
    'pʰe ɡi ɡje',
    'pʰje ɡi ɡe',
    'pʰe ɡi ɡe',
  ]);
  assert.deepEqual(result.variants.map((variant) => variant.ukrainian), [
    'пеґіґє',
    'пєґіґе',
    'пеґіґе',
  ]);
});
