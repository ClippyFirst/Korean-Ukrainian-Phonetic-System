import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

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
    assert.equal(result.variants[0].ipa, row.alternate_ipa_syllables.split('|').join(' '), word);
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
    assert.equal(result.variants[0].ipa, row.alternate_ipa_syllables.split('|').join(' '), word);
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
  for (const word of ['주의','협의','우리의','강의의']) {
    const row = rows.get(word);
    assert.ok(row, word);
    assert.ok(row.alternate_surface_hangul, word);
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, row.surface_hangul, word);
    assert.equal(result.variants.length, 1, word);
    assert.equal(result.variants[0].surface, row.alternate_surface_hangul, word);
  }
});

test('§5 contracted 져/쪄/쳐 use the explicit short-vowel readings', () => {
  for (const [word, surface] of Object.entries({져:'저',쪄:'쩌',쳐:'처'})) {
    assert.equal(engine.convert(word).surfaceHangul, surface, word);
  }
});
