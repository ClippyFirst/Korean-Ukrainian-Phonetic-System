import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';
import { buildExtendedIpaResult } from '../src/app/extended_ipa.js';
import { phonemicIpaFromHangul } from '../src/app/phonemic_ipa.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const genericEngine = createEngine(canonical, '');
const buildNarrowForInteraction = result => buildExtendedIpaResult(
  '물고기', result, phonemicIpaFromHangul('물고기')
).layers.narrow;
const fortisIpa = { 'ㄱ':'k͈', 'ㄷ':'t͈', 'ㅂ':'p͈', 'ㅅ':'s͈', 'ㅈ':'tɕ͈' };
const onsetSyllable = { 'ㄱ':'가', 'ㄷ':'다', 'ㅂ':'바', 'ㅅ':'사', 'ㅈ':'자' };
const codaBaseIpa = { 'ㄱ':'kak̚', 'ㄷ':'kat̚', 'ㅂ':'kap̚' };

test('§23 exhaustive fortition matrix: each obstruent representative fortifies all five licensed plain onsets', () => {
  for (const coda of ['ㄱ','ㄷ','ㅂ']) {
    const left = { 'ㄱ':'각', 'ㄷ':'갇', 'ㅂ':'갑' }[coda];
    for (const onset of Object.keys(fortisIpa)) {
      const input = left + onsetSyllable[onset];
      const result = genericEngine.convert(input);
      assert.equal(result.issues.length, 0, input);
      assert.equal(result.ipa, codaBaseIpa[coda] + '.' + fortisIpa[onset] + 'a', input);
      assert.ok(result.trace.some((item) => item.rules.includes('tensification')), input + ': expected §23 trace');
      assert.ok(!result.trace.some((item) => item.rules.includes('lexical-pronunciation')), input + ': generic engine only');
    }
  }
});

test('NIKL Q&A 335858 composes §28 compound fortition with the Narrow coda-variant site', () => {
  const result = genericEngine.convert('물고기');
  assert.equal(result.surfaceHangul, '물꼬기');
  assert.equal(result.ipa, 'mul.k͈o.ɡi');
  assert.ok(result.trace.some(item => item.rules.includes('compound-fortition-§28-exact-form')));

  const extended = buildExtendedIpaResult('물고기', result, phonemicIpaFromHangul('물고기'));
  const narrow = extended.layers.narrow;
  assert.equal(narrow.ipa, 'mul.k͈o.ɡi');
  const retroflex = extended.variants.find(item => item.ipa === 'muɭ.k͈o.ɡi');
  assert.ok(retroflex);
  assert.equal(retroflex.selected, false);

  const negative = genericEngine.convert('물고');
  assert.equal(negative.surfaceHangul, '물고');
  assert.equal(negative.ipa, 'mul.ɡo');
  assert.ok(!negative.trace.some(item => item.rules.includes('compound-fortition-§28-exact-form')));
});

test('§23 does not generalize obstruent-coda fortition to sonorant codas', () => {
  for (const input of ['간가','갈가','감가','강가']) {
    const result = genericEngine.convert(input);
    assert.ok(!result.trace.some((item) => item.rules.includes('tensification')), input);
  }
});
