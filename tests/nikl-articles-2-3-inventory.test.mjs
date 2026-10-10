import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonicalText = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const rows = parseCsv(canonicalText);
const engine = createEngine(canonicalText, lexical);
const byKey = new Map(rows.map((row) => [row.layer + ':' + row.input, row]));

test('§2 canonical inventory contains all and only the 19 standard consonants', () => {
  const expected = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  const actual = rows.filter((row) => row.layer === 'onset').map((row) => row.input).sort();
  assert.deepEqual(actual, [...expected].sort());
  for (const jamo of expected) {
    const row = byKey.get('onset:' + jamo);
    assert.ok(row, jamo);
    assert.ok(row.status, jamo + ': canonical status must be documented');
    if (jamo === 'ㅇ') {
      assert.equal(row.status, 'structural-null');
      assert.equal(row.ipa, '');
      assert.equal(row.ukrainian, '');
    } else {
      assert.ok(row.ipa, jamo + ': missing IPA');
      assert.ok(row.ukrainian, jamo + ': missing Ukrainian target');
    }
  }
});

test('§3 canonical inventory contains all and only the 21 standard vowels', () => {
  const expected = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
  const actual = rows.filter((row) => row.layer === 'vowel').map((row) => row.input).sort();
  assert.deepEqual(actual, [...expected].sort());
  for (const jamo of expected) {
    const row = byKey.get('vowel:' + jamo);
    assert.ok(row, jamo);
    assert.ok(row.ipa, jamo + ': missing IPA');
    assert.ok(row.ukrainian, jamo + ': missing Ukrainian target');
    assert.ok(row.status, jamo + ': canonical status must be documented');
  }
});

test('§8–§9 every possible coda spelling maps to one of the seven standard coda sound classes', () => {
  const expected = {
    'ㄱ':'k̚','ㄲ':'k̚','ㄳ':'k̚',
    'ㄴ':'n','ㄵ':'n','ㄶ':'n',
    'ㄷ':'t̚','ㅅ':'t̚','ㅆ':'t̚','ㅈ':'t̚','ㅊ':'t̚','ㅋ':'k̚','ㅌ':'t̚','ㅎ':'t̚',
    'ㄹ':'l','ㄺ':'k̚','ㄻ':'m','ㄼ':'l','ㄽ':'l','ㄾ':'l','ㄿ':'p̚','ㅀ':'l',
    'ㅁ':'m','ㅂ':'p̚','ㅄ':'p̚','ㅇ':'ŋ','ㅍ':'p̚',
  };
  const actual = rows.filter((row) => row.layer === 'coda' && row.input).map((row) => row.input).sort();
  assert.deepEqual(actual, Object.keys(expected).sort());
  const representatives = new Set(Object.values(expected));
  assert.deepEqual([...representatives].sort(), ['k̚','l','m','n','p̚','t̚','ŋ'].sort());
  for (const [jamo, ipa] of Object.entries(expected)) {
    const row = byKey.get('coda:' + jamo);
    assert.ok(row, jamo);
    assert.equal(row.ipa, ipa, jamo);
    assert.ok(row.ukrainian, jamo + ': missing Ukrainian coda mapping');
  }
});

test('all 19 consonant onsets survive a one-syllable engine smoke test', () => {
  const examples = {
    'ㄱ':'가','ㄲ':'까','ㄴ':'나','ㄷ':'다','ㄸ':'따','ㄹ':'라','ㅁ':'마','ㅂ':'바','ㅃ':'빠',
    'ㅅ':'사','ㅆ':'싸','ㅇ':'아','ㅈ':'자','ㅉ':'짜','ㅊ':'차','ㅋ':'카','ㅌ':'타','ㅍ':'파','ㅎ':'하',
  };
  for (const [jamo, syllable] of Object.entries(examples)) {
    const result = engine.convert(syllable);
    assert.equal(result.source, syllable, syllable);
    assert.equal(result.issues.length, 0, syllable);
    assert.ok(result.ipa.length > 0, syllable + ': missing IPA');
    assert.ok(!result.ukrainian.includes('⟦'), syllable + ': unresolved onset');
    const onset = byKey.get('onset:' + jamo);
    if (onset.ipa) assert.ok(result.ipa.startsWith(onset.ipa), syllable + ': onset IPA mismatch');
  }
});
