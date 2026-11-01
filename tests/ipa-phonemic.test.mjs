import test from 'node:test';
import assert from 'node:assert/strict';
import { renderPhonemicIpa } from '../src/app/ipa_phonemic.js';

test('phonemic IPA uses underlying onset, nucleus and coda values', () => {
  const result = renderPhonemicIpa('가치');
  assert.equal(result.ipa, 'ka.tɕʰi');
  assert.equal(result.profile, 'clippyfirst-korean-phonemic-v1');
  assert.equal(result.level, 'phonemic');
  assert.equal(result.status, 'orthographic-baseline-not-morphology-resolved');
});

test('phonemic IPA preserves fortis, aspiration and ㅢ distinctions', () => {
  assert.equal(renderPhonemicIpa('까카의').ipa, 'k͈a.kʰa.ɰi');
});

test('phonemic IPA splits complex codas into their underlying components', () => {
  assert.equal(renderPhonemicIpa('넋').ipa, 'nʌks');
  assert.equal(renderPhonemicIpa('값').ipa, 'kaps');
});

test('phonemic IPA preserves spaces and punctuation and flags non-Hangul input', () => {
  const result = renderPhonemicIpa('가치, ABC 123!');
  assert.equal(result.ipa, 'ka.tɕʰi, ABC 123!');
  assert.equal(result.status, 'partial-orthographic-baseline');
  assert.ok(result.issues.some((issue) => issue.source === 'A'));
});
