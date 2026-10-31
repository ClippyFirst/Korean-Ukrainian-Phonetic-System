import test from 'node:test';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { createRomanizationTarget } from '../src/app/romanization_target.js';
import { romanizeRevisedDetailed } from '../src/app/romanization.js';

const correspondenceCsv = readFileSync(new URL('../data/korean/rr_ukrainian_correspondence.csv', import.meta.url), 'utf8');
const contextRulesCsv = readFileSync(new URL('../data/korean/rr_ukrainian_context_rules.csv', import.meta.url), 'utf8');
const transcribeRevisedToUkrainian = createRomanizationTarget(correspondenceCsv, contextRulesCsv);

test('maps RR syllable units to a separate Ukrainian output', () => {
  const result = transcribeRevisedToUkrainian('가치');
  assert.equal(result.romanization, 'gachi');
  assert.equal(result.text, "кач'і");
  assert.equal(result.status, 'provisional');
});

test('distinguishes initial voiceless lenis from intervocalically voiced lenis', () => {
  assert.equal(transcribeRevisedToUkrainian('가').text, 'ка');
  assert.equal(transcribeRevisedToUkrainian('가가').text, 'каґа');
  assert.equal(transcribeRevisedToUkrainian('아가').text, 'аґа');
  const result = transcribeRevisedToUkrainian('가가');
  const secondOnset = result.trace.find((entry) => entry.source === '가' && entry.layer === 'onset' && entry.syllableIndex === 1);
  assert.equal(secondOnset.phonologicalFeature, 'intervocalic-voicing');
  assert.equal(secondOnset.wordPosition, 'final');
  assert.equal(secondOnset.leftContext, 'vowel');
});

test('marks phonemic aspiration with apostrophe, not lenis or fortis consonants', () => {
  assert.equal(transcribeRevisedToUkrainian('카').text, "к'а");
  assert.equal(transcribeRevisedToUkrainian('타').text, "т'а");
  assert.equal(transcribeRevisedToUkrainian('파').text, "п'а");
  assert.equal(transcribeRevisedToUkrainian('차').text, "ч'а");
  assert.equal(transcribeRevisedToUkrainian('까').text, 'кка');
  assert.equal(transcribeRevisedToUkrainian('가').text, 'ка');
});

test('retains fortis and resolved surface-form RR units', () => {
  const result = transcribeRevisedToUkrainian('일꼬');
  assert.equal(result.romanization, 'ilkko');
  assert.equal(result.text, 'ілкко');
  assert.ok(result.trace.some((entry) => entry.layer === 'onset' && entry.rr === 'kk'));
});

test('applies RR ll across a syllable boundary and maps the l onset', () => {
  const result = transcribeRevisedToUkrainian('별래');
  assert.equal(result.romanization, 'byeollae');
  assert.equal(result.text, 'пйолле');
  assert.ok(result.trace.some((entry) => entry.layer === 'onset' && entry.rr === 'l' && entry.ukrainian === 'л'));
});

test('preserves spaces, punctuation, digits and non-Hangul text', () => {
  assert.equal(transcribeRevisedToUkrainian('가치, 123 ABC!').text, "кач'і, 123 ABC!");
});

test('retains RR vowel sequences as single correspondence units', () => {
  assert.equal(transcribeRevisedToUkrainian('어으의').text, 'оиуї');
});

test('exposes word and sentence position for every Hangul syllable', () => {
  const result = romanizeRevisedDetailed('가가. 가');
  const syllables = result.segments.filter((segment) => segment.type === 'syllable');
  assert.deepEqual(syllables.map((segment) => segment.wordPosition), ['initial', 'final', 'single']);
  assert.deepEqual(syllables.map((segment) => segment.sentencePosition), ['sentence-initial', 'sentence-initial', 'sentence-initial']);
  assert.equal(syllables[1].leftContext, 'vowel');
  assert.equal(syllables[2].sentenceIndex, 1);
});

test('covers every modern precomposed Hangul syllable without missing RR mappings', () => {
  for (let code = 0xac00; code <= 0xd7a3; code += 1) {
    const result = transcribeRevisedToUkrainian(String.fromCodePoint(code));
    assert.equal(result.status, 'provisional', 'unmapped RR unit for U+' + code.toString(16));
    assert.equal(typeof result.text, 'string');
  }
});
