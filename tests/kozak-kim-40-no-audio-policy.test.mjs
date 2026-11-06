import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);
const broad = (text) => engine.convert(text, { ipaProfile: 'clippyfirst-korean-broad-v1' });

test('the three Rule 29 residual phrases are resolved only when word boundaries are explicit', () => {
  const cases = [
    '홍콩 영화들',
    '한국 여자로',
    '첫 연애',
  ];
  for (const phrase of cases) {
    const result = broad(phrase);
    assert.ok(result.trace.some(item => item.rules.includes('phrase-n-insertion-§29')), phrase);
    assert.ok(result.ipa.includes('n'), phrase);
    assert.equal(result.issues.length, 0, phrase);
  }
  for (const compact of ['홍콩영화들', '한국여자로', '첫연애']) {
    const result = broad(compact);
    assert.ok(!result.trace.some(item => item.rules.includes('phrase-n-insertion-§29')), compact);
  }
});

test('the ㅓ in 오조오억배 is not converted into a categorical /j/ glide', () => {
  const result = broad('오조오억배');
  assert.ok(result.ipa);
  assert.ok(!result.ipa.includes('ojʌ'), result.ipa);
});

test('체험 keeps ㅎ as the onset before ㅓ; no hiatus /j/ is inserted', () => {
  for (const token of ['문화체험공간', '사전체험', '만듬사전체험때']) {
    const result = broad(token);
    assert.ok(result.ipa, token);
    assert.ok(!result.ipa.includes('ejʌ'), token + ': ' + result.ipa);
  }
});

test('자기이입하네 retains the broad written vowel sequence rather than deleting an /i/', () => {
  const result = broad('자기이입하네');
  assert.ok(result.ipa);
  assert.equal([...result.ipa].filter(ch => ch === 'i').length, 3, result.ipa);
});

test('broad /s/ is retained in the unresolved /jʌ/ and /jo/ sibilant contexts', () => {
  const cases = [
    ['쇼', 'sjo'],
    ['모션어디서', 'sjʌ'],
    ['포지션을', 'sjʌ'],
    ['아끼셔', 'sjʌ'],
    ['뿌셔우우', 'sjʌ'],
    ['뿌셔우우우', 'sjʌ'],
  ];
  for (const [token, expected] of cases) {
    const result = broad(token);
    assert.ok(result.ipa.includes(expected), token + ': ' + result.ipa);
    assert.ok(!result.ipa.includes('ɕj'), token + ': ' + result.ipa);
  }
});
