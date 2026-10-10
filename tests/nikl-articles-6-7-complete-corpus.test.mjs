import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const rows = parseCsv(lexical);
const entries = new Map(rows.map((row) => [row.input, row]));
const engine = createEngine(canonical, lexical);

const section6 = {
  '눈보라':['눈보라','nuːn|bo|ɾa'],
  '말씨':['말씨','maːl|s͈i'],
  '밤나무':['밤나무','paːm|na|mu'],
  '많다':['만타','maːn|tʰa'],
  '멀리':['멀리','mʌːl|li'],
  '벌리다':['벌리다','pʌːl|li|da'],
  '첫눈':['천눈','tɕʰʌn|nun'],
  '참말':['참말','tɕʰam|mal'],
  '쌍동밤':['쌍동밤','s͈aŋ|doŋ|pam'],
  '수많이':['수마니','suː|ma|ni'],
  '눈멀다':['눈멀다','nun|mʌl|ta'],
  '떠벌리다':['떠벌리다','t͈ʌ|bʌl|li|da'],
  '재삼재사':['재삼재사','tɕɛː|sam|dʑɛː|sa'],
  '봐':['봐','pwaː'],
  '겨':['겨','kjʌː'],
  '돼':['돼','twɛː'],
  '둬':['둬','twʌː'],
  '해':['해','hɛː'],
  '와':['와','wa'],
  '져':['저','tɕʌ'],
  '쪄':['쩌','tɕ͈ʌ'],
  '쳐':['처','tɕʰʌ'],
  '밀물':['밀물','mil|mul'],
  '썰물':['썰물','s͈ʌl|mul'],
  '쏜살같이':['쏜살가치','s͈on|sal|ka|tɕʰi'],
  '작은아버지':['자그나버지','tɕa|ɡɯ|na|bʌ|dʑi'],
};

const section7 = {
  '감다':'kaːm|t͈a', '감으니':'ka|mɯ|ni',
  '밟다':'paːp̚|t͈a', '밟으면':'pal|bɯ|mjʌn',
  '신다':'ɕiːn|t͈a', '신어':'ɕi|nʌ',
  '알다':'aːl|da', '알아':'a|ɾa',
  '끌다':'k͈ɯːl|t͈a', '끌어':'k͈ɯː|ɾʌ',
  '떫다':'t͈ʌːl|t͈a', '떫은':'t͈ʌːl|bɯn',
  '벌다':'pʌːl|da', '벌어':'pʌː|ɾʌ',
  '썰다':'s͈ʌːl|da', '썰어':'s͈ʌː|ɾʌ',
  '없다':'ʌːp̚|t͈a', '없으니':'ʌːp̚|s͈ɯ|ni',
  '감기다':'kam|ɡi|da', '꼬다':'k͈oː|ta',
  '꼬이다':'k͈o|i|da', '밟히다':'pal|pʰi|da',
  '끌리다':'k͈ɯːl|li|da', '벌리다':'pʌːl|li|da',
  '없애다':'ʌːp̚|s͈ɛ|da',
};

test('§6 all remaining official long/short-vowel examples have source-backed regression entries', () => {
  for (const [word, [surface, ipa]] of Object.entries(section6)) {
    const row = entries.get(word);
    assert.ok(row, '§6 missing official example: ' + word);
    assert.equal(row.surface_hangul, surface, word);
    assert.equal(row.ipa_syllables, ipa, word);
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, surface, word);
    assert.equal(result.ipa, ipa.split('|').join(' '), word);
  }
});

test('§6 preserves both standard readings of 반신반의 and the source-backed long vowels', () => {
  const row = entries.get('반신반의');
  assert.ok(row);
  const result = engine.convert('반신반의');
  assert.equal(result.surfaceHangul, '반신바늬');
  assert.equal(result.variants.length, 1);
  assert.equal(result.variants[0].surface, '반신바니');
  assert.match(result.ipa, /paːn/);
  assert.match(result.ipa, /baː/);
});

test('§7 shortening and explicitly listed length-retaining exceptions remain distinct', () => {
  for (const [word, ipa] of Object.entries(section7)) {
    const row = entries.get(word);
    assert.ok(row, '§7 missing official example: ' + word);
    assert.equal(row.ipa_syllables, ipa, word);
    assert.equal(engine.convert(word).ipa, ipa.split('|').join(' '), word);
  }
  assert.ok(entries.get('감다').ipa_syllables.includes('ː'));
  assert.ok(!entries.get('감으니').ipa_syllables.includes('ː'));
  assert.ok(!entries.get('밟으면').ipa_syllables.includes('ː'));
  assert.ok(entries.get('끌어').ipa_syllables.includes('ː'));
  assert.ok(entries.get('떫은').ipa_syllables.includes('ː'));
  assert.ok(entries.get('없으니').ipa_syllables.includes('ː'));
});

test('§7 compound shortening is explicitly covered', () => {
  for (const word of ['밀물','썰물','쏜살같이','작은아버지']) {
    assert.ok(entries.has(word), 'missing compound example ' + word);
    assert.equal(engine.convert(word).surfaceHangul, entries.get(word).surface_hangul, word);
  }
});

test('the homographic official §24 example 신고 is not globally overridden as the verb reading', () => {
  // The standard's 신고 [신ː꼬] is morphology-specific (신- + -고); 신고
  // also means a noun 'report' and has a different ordinary reading. A global
  // override would corrupt the noun, so the verb example stays explicitly
  // documented rather than being forced into the default word-level lexicon.
  assert.ok(!entries.has('신고'));
  assert.ok(!engine.convert('신고').ipa.includes('k͈'));
});
