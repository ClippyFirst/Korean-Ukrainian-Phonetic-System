import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const genericEngine = createEngine(canonical, '');
const fortisIpa = { 'ㄱ':'k͈', 'ㄷ':'t͈', 'ㅂ':'p͈', 'ㅅ':'s͈', 'ㅈ':'tɕ͈' };
const onsetSyllable = { 'ㄱ':'가', 'ㄷ':'다', 'ㅂ':'바', 'ㅅ':'사', 'ㅈ':'자' };
const onsetBaseIpa = { 'ㄱ':'ka', 'ㄷ':'ta', 'ㅂ':'pa', 'ㅅ':'sa', 'ㅈ':'tɕa' };
const codaBaseIpa = { 'ㄱ':'kak̚', 'ㄷ':'kat̚', 'ㅂ':'kap̚' };

test('§23 exhaustive fortition matrix: each obstruent representative fortifies all five licensed plain onsets', () => {
  for (const coda of ['ㄱ','ㄷ','ㅂ']) {
    const left = { 'ㄱ':'각', 'ㄷ':'갇', 'ㅂ':'갑' }[coda];
    for (const onset of Object.keys(fortisIpa)) {
      const input = left + onsetSyllable[onset];
      const result = genericEngine.convert(input);
      assert.equal(result.issues.length, 0, input);
      assert.equal(result.ipa, codaBaseIpa[coda] + ' ' + fortisIpa[onset] + 'a', input);
      assert.ok(result.trace.some((item) => item.rules.includes('tensification')), input + ': expected §23 trace');
      assert.ok(!result.trace.some((item) => item.rules.includes('lexical-pronunciation')), input + ': generic engine only');
    }
  }
});

test('§23 does not generalize obstruent-coda fortition to sonorant codas', () => {
  for (const input of ['간가','갈가','감가','강가']) {
    const result = genericEngine.convert(input);
    assert.ok(!result.trace.some((item) => item.rules.includes('tensification')), input);
  }
});
