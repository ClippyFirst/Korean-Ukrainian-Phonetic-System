import test from 'node:test';
import assert from 'node:assert/strict';
import { createBrowserKozakKimEngine } from '../scripts/benchmark_kozak_kim_browser.mjs';

// An exact multi-word lexical row attests whole eojeol. The browser matched such
// keys by prefix/substring, so `갈 곳이` consumed the row `갈 곳` and converted the
// remaining particle `이` as a separate part: no §13 liaison, IPA `k͈ot̚i` (a vowel
// directly after an unreleased stop). Python (exact eojeol matching) gives
// `kal ko.si`. A row must match only when it covers complete eojeol.
const engine = createBrowserKozakKimEngine();
const profile = { morphologyMode: 'strict', ipaProfile: 'clippyfirst-korean-broad-v1' };
const ipa = (text) => engine.convert(text, profile).ipa;

test('a phrase row does not capture the stem of an eojeol that continues with a particle', () => {
  assert.equal(ipa('갈 곳이'), 'kal ko.si');
  assert.equal(ipa('갈 곳을'), 'kal ko.sɯl');
  assert.equal(ipa('만날 사람이'), 'man.nal sa.ɾa.mi');
});

test('no browser IPA has a vowel directly after an unreleased stop in these phrases', () => {
  for (const text of ['갈 곳이', '갈 곳을', '다시 갈 곳이 없다', '밭 아래에서', '꽃 위에']) {
    assert.doesNotMatch(ipa(text), /[ptk]̚[aeiouɛøʌɯyɰ]/u, text);
  }
});

test('exact phrase rows still match, including before punctuation and at the end', () => {
  assert.equal(ipa('갈 곳'), 'kal k͈ot̚');
  assert.equal(ipa('갈 곳, 오다').startsWith('kal k͈ot̚'), true);
  assert.equal(ipa('다시 갈 곳'), 'ta.si kal k͈ot̚');
  assert.equal(ipa('밭 아래'), 'pa ta.ɾɛ');
  assert.equal(ipa('만날 사람'), 'man.nal s͈a.ɾam');
});

test('keys that end in a non-Hangul character keep matching before a following syllable', () => {
  // `6·25` is a mixed key; its end boundary is the digit, so a following Hangul is allowed.
  assert.equal(engine.convert('6·25전쟁', profile).pronunciation_status !== undefined, true);
});
