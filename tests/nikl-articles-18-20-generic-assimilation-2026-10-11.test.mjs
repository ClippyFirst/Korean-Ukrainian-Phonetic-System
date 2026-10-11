import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
// No lexical dictionary: this suite checks the productive surface-rule pass.
// Normative reference: NIKL Standard Pronunciation Rules §§18–20.
const genericEngine = createEngine(canonical, '');

function rulesFor(result, inputFragment) {
  const item = result.trace.find((entry) => entry.input === inputFragment);
  return item?.rules ?? [];
}

test('§18: generic nasal assimilation changes the coda before ㄴ/ㅁ', () => {
  const cases = [
    ['국물', 'kuŋ mul', '국', 'nasal-assimilation'],
    ['앞마당', 'am ma daŋ', '앞', 'nasal-assimilation'],
    ['닫는', 'tan nɯn', '닫', 'nasal-assimilation'],
  ];

  for (const [input, expectedIpa, fragment, rule] of cases) {
    const result = genericEngine.convert(input);
    assert.equal(result.ipa, expectedIpa, input + ': expected the rule-derived surface IPA');
    assert.ok(rulesFor(result, fragment).includes(rule), input + ': the coda change must be traceable');
    assert.deepEqual(result.issues, [], input + ': ordinary nasal assimilation is productive');
  }
});

test('§19 then §18: ㄹ-to-ㄴ precedes nasalization in 협력', () => {
  const result = genericEngine.convert('협력');
  assert.equal(result.ipa, 'hjʌm njʌk̚');
  assert.ok(result.trace.some((entry) => entry.rules.includes('liquid-to-nasal-before-obstruent')),
    'the ㄹ onset must be nasalized before the preceding coda assimilates');
  assert.ok(result.trace.some((entry) => entry.rules.includes('nasal-assimilation')),
    'the preceding ㅂ coda must then become ㅁ');
  assert.deepEqual(result.issues, []);
});

test('§18: nasal assimilation applies across a connected whitespace phrase', () => {
  const result = genericEngine.convert('밥 먹는다');
  assert.equal(result.ipa, 'pam mʌŋ nɯn da');
  assert.ok(result.trace.some((entry) => entry.rules.includes('nasal-assimilation')),
    'phrase-boundary assimilation must be present in the trace');
  assert.deepEqual(result.issues, []);
});

test('§18 phrase assimilation does not cross punctuation', () => {
  const connected = genericEngine.convert('밥 먹는다');
  const punctuated = genericEngine.convert('밥, 먹는다');
  assert.equal(connected.ipa, 'pam mʌŋ nɯn da');
  assert.notEqual(punctuated.ipa, connected.ipa,
    'a punctuation boundary must prevent the connected-phrase surface form');
  assert.ok(!punctuated.trace.some((entry) =>
    entry.input === '밥' && entry.rules.includes('nasal-assimilation')),
  'the word-final coda before punctuation must not receive phrase-boundary nasalization');
});

test('§19: generic engine distinguishes nasalization of ㄹ from liquid assimilation', () => {
  const result = genericEngine.convert('종로');
  assert.ok(result.trace.some((entry) => entry.rules.includes('liquid-to-nasal-before-obstruent')
    || entry.rules.includes('liquid-assimilation')),
  'the ㄹ interaction must be explicitly represented in the trace');
  assert.deepEqual(result.issues, []);
});
