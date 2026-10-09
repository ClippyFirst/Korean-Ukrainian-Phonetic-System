import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

test('obstruent coda before ㄹ triggers ㄹ-to-ㄴ and nasal assimilation', () => {
  const result = engine.convert('독립문');
  assert.equal(result.ukrainian, 'тонніммун');
  assert.match(result.ipa, /toŋ nim mun/);
  assert.ok(result.trace.some((item) => item.rules.includes('liquid-to-nasal-before-obstruent')));
  assert.ok(result.trace.some((item) => item.rules.includes('nasal-assimilation')));
});

test('ㄹ resyllabified before a vowel retains lateral [l], not tap [ɾ]', () => {
  const result = engine.convert('서울역');
  assert.equal(result.ukrainian, 'соулйок');
  assert.match(result.ipa, /sʌ u ljʌk̚/);
  assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')));
});

test('nasalisation changes both the coda and following liquid in 국립', () => {
  const result = engine.convert('국립');
  assert.equal(result.ukrainian, 'кунніп');
  assert.match(result.ipa, /kuŋ nip̚/);
});

test('ㅇ+ㅢ uses the normative [ɰi] default instead of an unresolved placeholder', () => {
  const result = engine.convert('한국어의 표준 발음');
  assert.equal(result.issues.length, 0);
  assert.ok(!result.ukrainian.includes('⟦'));
  assert.ok(result.ukrainian.includes('ий'));
  assert.match(result.ipa, /ɰi/);
  assert.ok(result.trace.some((item) => item.rules.includes('vowel-ui-default-ɰi')));
});

test('ㅢ with a consonant onset follows §5 and is realized as [i]', () => {
  const result = engine.convert('희망');
  assert.equal(result.ukrainian, 'хіман');
  assert.match(result.ipa, /hi maŋ/);
  assert.ok(result.trace.some((item) => item.rules.includes('vowel-ui-to-i')));
});

test('palatalization applies to ㄷ/ㅌ before ㅣ, not every j-like vowel', () => {
  const result = engine.convert('같이');
  assert.equal(result.ukrainian, 'качі');
  assert.match(result.ipa, /ka tɕʰi/);
  assert.ok(result.trace.some((item) => item.rules.includes('palatalization')));
});

test('ㄷ+히 follows aspiration and then palatalization (§12 + §17)', () => {
  const result = engine.convert('굳히다');
  assert.equal(result.ukrainian, 'кучіта');
  assert.match(result.ipa, /ku tɕʰi ta/);
  assert.ok(result.trace.some((item) => item.rules.includes('h-aspiration-plus-palatalization')));
});
