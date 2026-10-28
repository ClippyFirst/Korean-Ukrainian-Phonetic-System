import test from 'node:test';
import assert from 'node:assert/strict';
import { romanizeRevised } from '../src/app/romanization.js';

test('uses Revised Romanization vowel values, not English spelling', () => {
  assert.equal(romanizeRevised('어으의'), 'eoeuui');
  assert.equal(romanizeRevised('가치'), 'gachi');
});

test('matches official NIKL examples after Korean surface pronunciation is resolved', () => {
  // Official RR examples: 백마[뱅마], 신문로[신문노], 종로[종노],
  // 왕십리[왕심니], 별내[별래], 신라[실라], 같이[가치], 굳히다[구치다].
  assert.equal(romanizeRevised('신문노'), 'sinmunno');
  assert.equal(romanizeRevised('종노'), 'jongno');
  assert.equal(romanizeRevised('왕심니'), 'wangsimni');
  assert.equal(romanizeRevised('별래'), 'byeollae');
  assert.equal(romanizeRevised('실라'), 'silla');
  assert.equal(romanizeRevised('가치'), 'gachi');
  assert.equal(romanizeRevised('구치다'), 'guchida');
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

test('covers every modern precomposed Hangul syllable without undefined output', () => {
  for (let code = 0xac00; code <= 0xd7a3; code += 1) {
    const source = String.fromCodePoint(code);
    const result = romanizeRevised(source);
    assert.ok(result.length > 0, `empty RR for U+${code.toString(16).toUpperCase()}`);
    assert.ok(!result.includes('undefined'), `undefined RR for U+${code.toString(16).toUpperCase()}`);
  }
});
