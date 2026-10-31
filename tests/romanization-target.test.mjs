import test from 'node:test';
import assert from 'node:assert/strict';
import { transcribeRevisedToUkrainian } from '../src/app/romanization_target.js';

test('maps RR syllable units to a separate Ukrainian output', () => {
  const result = transcribeRevisedToUkrainian('가치');
  assert.equal(result.romanization, 'gachi');
  assert.equal(result.text, 'ґачі');
  assert.equal(result.status, 'provisional');
});

test('retains fortis and resolved surface-form RR units', () => {
  const result = transcribeRevisedToUkrainian('일꼬');
  assert.equal(result.romanization, 'ilkko');
  assert.equal(result.text, 'ілкко');
  assert.ok(result.trace.some((entry) => entry.layer === 'onset' && entry.rr === 'kk'));
});

test('preserves spaces, punctuation, digits and non-Hangul text', () => {
  assert.equal(transcribeRevisedToUkrainian('가치, 123 ABC!').text, 'ґачі, 123 ABC!');
});

test('retains RR vowel sequences as single correspondence units', () => {
  assert.equal(transcribeRevisedToUkrainian('어으의').text, 'оиуї');
});

test('covers every modern precomposed Hangul syllable without missing RR mappings', () => {
  for (let code = 0xac00; code <= 0xd7a3; code += 1) {
    const result = transcribeRevisedToUkrainian(String.fromCodePoint(code));
    assert.equal(result.status, 'provisional', 'unmapped RR unit for U+' + code.toString(16));
    assert.equal(typeof result.text, 'string');
  }
});
