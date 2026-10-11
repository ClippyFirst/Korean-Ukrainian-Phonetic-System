import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const entries = new Map(parseCsv(lexical).map((row) => [row.input, row]));
const engine = createEngine(canonical, lexical);
const officialSource = /^https:\/\/(www\.|m\.)?korean\.go\.kr\//u;

test('§17 all six listed palatalization examples and all three ㄷ+히 examples are covered', () => {
  const expected = {
    '곧이듣다':['고지듣따','ko dʑi dɯt̚ t͈a'],
    '굳이':['구지','ku dʑi'],
    '미닫이':['미다지','miː da dʑi'],
    '땀받이':['땀바지','t͈am ba dʑi'],
    '밭이':['바치','pa tɕʰi'],
    '벼훑이':['벼훌치','pjʌ hul tɕʰi'],
    '굳히다':['구치다','ku tɕʰi da'],
    '닫히다':['다치다','ta tɕʰi da'],
    '묻히다':['무치다','mu tɕʰi da'],
  };
  for (const [word,[surface,ipa]] of Object.entries(expected)) {
    const row = entries.get(word);
    assert.ok(row, 'missing §17 official example: ' + word);
    assert.match(row.source_url, officialSource, word);
    assert.equal(row.surface_hangul, surface, word);
    assert.equal(row.ipa_syllables.split('|').join(' '), ipa, word);
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, surface, word);
    assert.equal(result.ipa, ipa, word);
    assert.equal(result.ukrainian, row.target_syllables.split('|').join(''), word);
    assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
  }
});

test('§18 all twenty-four listed word examples are source-backed with exact standard surfaces', () => {
  const expected = {
    '먹는':['멍는','mʌŋ nɯn'],
    '국물':['궁물','kuŋ mul'],
    '깎는':['깡는','k͈aŋ nɯn'],
    '키읔만':['키응만','kʰi ɯŋ man'],
    '몫몫이':['몽목씨','moŋ mok̚ s͈i'],
    '긁는':['긍는','kɯŋ nɯn'],
    '흙만':['흥만','hɯŋ man'],
    '닫는':['단는','tan nɯn'],
    '짓는':['진는','tɕiːn nɯn'],
    '옷맵시':['온맵씨','on mɛp̚ s͈i'],
    '있는':['인는','in nɯn'],
    '맞는':['만는','man nɯn'],
    '젖멍울':['전멍울','tɕʌn mʌŋ ul'],
    '쫓는':['쫀는','tɕ͈on nɯn'],
    '꽃망울':['꼰망울','k͈on maŋ ul'],
    '붙는':['분는','pun nɯn'],
    '놓는':['논는','non nɯn'],
    '잡는':['잠는','tɕam nɯn'],
    '밥물':['밤물','pam mul'],
    '앞마당':['암마당','am ma daŋ'],
    '밟는':['밤는','paːm nɯn'],
    '읊는':['음는','ɯm nɯn'],
    '없는':['엄는','ʌːm nɯn'],
    '값매다':['감매다','kam mɛ da'],
  };
  for (const [word,[surface,ipa]] of Object.entries(expected)) {
    const row = entries.get(word);
    assert.ok(row, 'missing §18 official example: ' + word);
    assert.match(row.source_url, officialSource, word);
    assert.equal(row.surface_hangul, surface, word);
    assert.equal(row.ipa_syllables.split('|').join(' '), ipa, word);
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, surface, word);
    if (row.target_status !== 'surface-only') {
      assert.equal(result.ipa, ipa, word);
      assert.equal(result.ukrainian, row.target_syllables.split('|').join(''), word);
    } else {
      // Keep the official long-vowel evidence in the source row while ensuring
      // the surface-only record does not bypass the generic nasal-assimilation path.
      assert.ok(result.trace.some((item) => item.rules.includes('lexical-coda-balm')), word);
      assert.ok(result.trace.some((item) => item.rules.includes('nasal-assimilation')), word);
      assert.ok(!result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
    }
  }
});

test('§18 all five official cross-word examples remain connected and nasalize', () => {
  const expected = {
    '책 넣는다':'tɕʰɛŋ nʌn nɯn da',
    '흙 말리다':'hɯŋ mal li da',
    '옷 맞추다':'on mat̚ tɕʰu da',
    '밥 먹는다':'pam mʌŋ nɯn da',
    '값 매기다':'kam mɛ ɡi da',
  };
  for (const [phrase,ipa] of Object.entries(expected)) {
    const result = engine.convert(phrase);
    assert.equal(result.ipa, ipa, phrase);
    assert.ok(result.trace.some((item) => item.rules.includes('nasal-assimilation')), phrase);
  }
});

test('§18 cross-word nasal/liquid assimilation survives a lexical/generic split elsewhere in the sentence', () => {
  const cases = [
    ['읽어 밥 먹는다', 'il ɡʌ pam mʌŋ nɯn da'],
    ['읽어 흙 말리다', 'il ɡʌ hɯŋ mal li da'],
    ['읽어 책 넣는다', 'il ɡʌ tɕʰɛŋ nʌn nɯn da'],
  ];
  for (const [phrase, expectedIpa] of cases) {
    const result = engine.convert(phrase);
    assert.equal(result.ipa, expectedIpa, phrase);
    assert.ok(
      result.trace.some((item) => item.rules.includes('nasal-assimilation') || item.rules.includes('liquid-assimilation')),
      phrase + ': phrase-boundary rule should remain visible in the trace',
    );
    assert.equal(result.issues.length, 0, phrase);
  }
});
