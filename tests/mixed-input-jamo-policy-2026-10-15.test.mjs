import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

const RAW_KOREAN = /[가-힣ㄱ-ㅎㅏ-ㅣ]/u;

test('standalone compatibility jamo is unresolved and never emitted as pronunciation', () => {
  for (const input of ['ㄺ', 'ㅎ', 'ㄷ', 'ㄺkwa', 'ㄷi', 'ㅎ tʰal']) {
    const result = engine.convert(input);
    assert.equal(result.status, 'unresolved', input);
    assert.doesNotMatch(result.ipa, RAW_KOREAN, input + ': IPA must not contain Hangul or jamo');
    assert.doesNotMatch(result.analysis, RAW_KOREAN, input + ': analysis must not contain raw Hangul or jamo');
    assert.doesNotMatch(result.ukrainian, /[ㄱ-ㅎㅏ-ㅣ]/u, input + ': unsupported jamo must not pass through as Ukrainian output');
    assert.ok(result.issues.some(issue => /jamo|syllable/u.test(issue)), input);
  }
});

test('Latin residue attached to Hangul is withheld from IPA and reported', () => {
  const result = engine.convert('의nin');
  assert.doesNotMatch(result.ipa, /nin/u);
  assert.doesNotMatch(result.analysis, /nin/u);
  assert.match(result.ukrainian, /nin/u);
  assert.ok(result.issues.some(issue => /mixed Hangul and Latin/iu.test(issue)));
  assert.equal(result.status, 'unresolved');
});

test('non-Korean-only input is not presented as canonical pronunciation', () => {
  const result = engine.convert('latin 123');
  assert.equal(result.status, 'non-korean-input');
  assert.doesNotMatch(result.ipa, /latin|123/iu);
  assert.ok(result.issues.some(issue => /no Hangul syllable/u.test(issue)));
});

test('jamo named in Korean explanatory prose is not phonologized or leaked into IPA', () => {
  for (const input of ['ㅎ과 뒤따르는 자음을 비교한다.', 'ㄴ 첨가를 설명한다.']) {
    const result = engine.convert(input);
    assert.ok(!result.issues.some(issue => /standalone compatibility jamo/u.test(issue)), input);
    assert.doesNotMatch(result.ipa, /[ㄱ-ㅎㅏ-ㅣ]/u, input);
    assert.doesNotMatch(result.analysis, /ㅎ과|ㄴ 첨가/u, input);
  }
});

test('a jamo separated from Korean syllables is not presumed to be explanatory notation', () => {
  for (const input of ['가 ㄷ', 'ㄷ 가']) {
    const result = engine.convert(input);
    assert.equal(result.status, 'unresolved', input);
    assert.ok(result.issues.some(issue => /standalone compatibility jamo/u.test(issue)), input);
    assert.doesNotMatch(result.ipa, /[ㄱ-ㅎㅏ-ㅣ]/u, input);
    assert.doesNotMatch(result.analysis, /(?:^|\\s)ㄷ(?:$|\\s)/u, input + ': standalone source jamo must not leak into analysis');
  }
});

test('sourced mixed-script numeric lexical forms keep their exact IPA', () => {
  const result = engine.convert('3·1절');
  assert.equal(result.ipa, 'sa mil tɕ͈ʌl');
  assert.equal(result.status, 'lexical-review');
});
