import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';
import { renderExpectedIpa } from './render-expected-ipa.mjs';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const rows = new Map(parseCsv(lexical).map((row) => [row.input, row]));
const engine = createEngine(canonical, lexical);

test('§4 preserves the permitted monophthong/diphthong readings of ㅚ and ㅟ', () => {
  for (const word of ['외','위']) {
    const row = rows.get(word);
    assert.ok(row, word);
    assert.ok(row.alternate_surface_hangul, word);
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, row.surface_hangul, word);
    assert.equal(result.variants.length, 1, word);
    assert.equal(result.variants[0].surface, row.alternate_surface_hangul, word);
    assert.equal(result.variants[0].ipa, renderExpectedIpa(word, row.alternate_ipa_syllables), word);
  }
});

test('§5 all eight listed ㅖ variation examples retain both official readings', () => {
  for (const word of ['계집','계시다','시계','연계','몌별','개폐','혜택','지혜']) {
    const row = rows.get(word);
    assert.ok(row, word);
    assert.ok(row.alternate_surface_hangul, word);
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, row.surface_hangul, word);
    assert.equal(result.variants.length, 1, word);
    assert.equal(result.variants[0].surface, row.alternate_surface_hangul, word);
    assert.equal(result.variants[0].ipa, renderExpectedIpa(word, row.alternate_ipa_syllables), word);
  }
});

test('§5 consonant-initial ㅢ is pronounced [ㅣ] in every listed example', () => {
  const expected = {
    '늴리리':'닐리리','닁큼':'닝큼','무늬':'무니','띄어쓰기':'띠어쓰기',
    '씌어':'씨어','틔어':'티어','희어':'히어','희떱다':'히떱다',
    '희망':'히망','유희':'유히',
  };
  for (const [word, surface] of Object.entries(expected)) {
    const row = rows.get(word);
    assert.ok(row, word);
    assert.equal(row.surface_hangul, surface, word);
    assert.equal(engine.convert(word).surfaceHangul, surface, word);
  }
});

test('§5 all listed 의 alternations are kept as explicit variants', () => {
  for (const word of ['주의','협의','우리의','강의의','발음의']) {
    const row = rows.get(word);
    assert.ok(row, word);
    assert.ok(row.alternate_surface_hangul, word);
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, row.surface_hangul, word);
    assert.equal(result.variants.length, 1, word);
    assert.equal(result.variants[0].surface, row.alternate_surface_hangul, word);
    assert.equal(result.variants[0].ipa, renderExpectedIpa(word, row.alternate_ipa_syllables), word);
    assert.equal(result.variants[0].ukrainian, row.alternate_target_syllables.split('|').join(''), word);
  }
  const pronunciation = engine.convert('발음의');
  assert.equal(pronunciation.surfaceHangul, '바르미');
  assert.equal(pronunciation.variants[0].surface, '바르메');
  assert.equal(pronunciation.variants[0].ukrainian, 'париме');
});

test('§5 contracted 져/쪄/쳐 use the explicit short-vowel readings in surface IPA', () => {
  const expected = {
    져: { surface: '저', ipa: 'tɕʌ' },
    쪄: { surface: '쩌', ipa: 'tɕ͈ʌ' },
    쳐: { surface: '처', ipa: 'tɕʰʌ' }
  };
  for (const [word, value] of Object.entries(expected)) {
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, value.surface, word);
    assert.equal(result.ipa, value.ipa, word);
    assert.ok(result.trace.some(item =>
      item.rules.includes('vowel-yeo-monophthongization-§5-exception-1')
    ), word);
  }
});

test('§5 exception 1 removes the prohibited [j] glide after palatal affricates in full forms', () => {
  const expected = {
    던져주다: 'tʌn.dʑʌ.dʑu.da',
    쳐먹고: 'tɕʰʌ.mʌk̚.k͈o',
    빠져: 'p͈a.dʑʌ'
  };
  for (const [word, ipa] of Object.entries(expected)) {
    assert.equal(engine.convert(word).ipa, ipa, word);
  }
});
