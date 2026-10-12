import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
// An empty lexical dictionary is intentional: these cases verify the productive
// rule pass, not memorized word-by-word pronunciations.
const engine = createEngine(canonical, '');
const rulesFor = (result) => result.trace.flatMap((entry) => entry.rules ?? []);

test('§9 and §18: representative coda neutralization feeds nasal assimilation in 앞마당', () => {
  const result = engine.convert('앞마당');
  assert.equal(result.ipa, 'am ma daŋ');
  assert.ok(rulesFor(result).includes('nasal-assimilation'));
  assert.deepEqual(result.issues, []);
});

test('§9 and §23: a neutralized obstruent coda licenses fortition, unlike a sonorant coda', () => {
  const result = engine.convert('국밥');
  assert.equal(result.ipa, 'kuk̚ p͈ap̚');
  assert.ok(rulesFor(result).includes('tensification'));
  assert.deepEqual(result.issues, []);

  for (const input of ['간가', '갈가', '감가', '강가']) {
    assert.ok(!rulesFor(engine.convert(input)).includes('tensification'),
      input + ': a sonorant coda must not be treated as an obstruent for §23');
  }
});

test('§18 and §19: ordered assimilation remains stable when nasalization precedes a following coda', () => {
  const result = engine.convert('밥 먹는다');
  assert.equal(result.ipa, 'pam mʌŋ nɯn da');
  assert.ok(rulesFor(result).includes('nasal-assimilation'));
  assert.deepEqual(result.issues, []);
});

test('§9, §18, and §29: exact phrase insertion feeds the surface nasal sequence in 옷 입다', () => {
  const result = engine.convert('옷 입다');
  assert.ok(rulesFor(result).includes('phrase-n-insertion-§29'));
  assert.equal(result.ipa, 'on nip̚ t͈a');
  assert.deepEqual(result.issues, []);
});

test('§29 insertion is phrase-specific and does not cross punctuation', () => {
  const connected = engine.convert('옷 입다');
  const paused = engine.convert('옷, 입다');
  assert.ok(rulesFor(connected).includes('phrase-n-insertion-§29'));
  assert.ok(!rulesFor(paused).includes('phrase-n-insertion-§29'));
});
