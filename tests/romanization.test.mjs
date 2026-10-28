import test from 'node:test';
import assert from 'node:assert/strict';
import { romanizeRevised } from '../src/app/romanization.js';

test('uses Revised Romanization vowel values, not English spelling', () => {
  assert.equal(romanizeRevised('어으의'), 'eoeuui');
  assert.equal(romanizeRevised('가치'), 'gachi');
});

test('romanizes resolved surface forms, including consonant codas', () => {
  assert.equal(romanizeRevised('뱅마'), 'baengma');
  assert.equal(romanizeRevised('신문노'), 'sinmunno');
  assert.equal(romanizeRevised('실라'), 'silla');
});

test('uses r/l convention across adjacent liquid syllables', () => {
  assert.equal(romanizeRevised('라라'), 'rara');
  assert.equal(romanizeRevised('말라'), 'malla');
});

test('preserves spaces, punctuation, digits and non-Hangul text', () => {
  assert.equal(romanizeRevised('가치, 123 ABC!'), 'gachi, 123 ABC!');
});

test('empty and nullish input are safe', () => {
  assert.equal(romanizeRevised(''), '');
  assert.equal(romanizeRevised(null), '');
});
