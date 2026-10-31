import test from 'node:test';
import assert from 'node:assert/strict';
import { romanizeRevised, romanizeRevisedDetailed } from '../src/app/romanization.js';

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


test('uses source orthography for NIKL RR exceptions instead of copying every surface change', () => {
  // NIKL RR §3(1): tense sounds in compounds are not romanized as fortis;
  // the official example 압구정 is Apgujeong, not a surface-fortis spelling.
  assert.equal(romanizeRevisedDetailed('압꾸정', '압구정').text, 'apgujeong');
  // NIKL RR §3(1): noun examples 묵호 and 집현전 retain h rather than
  // romanizing the aspirated surface as k/t/p+h assimilation.
  assert.equal(romanizeRevisedDetailed('무코', '묵호').text, 'mukho');
  assert.equal(romanizeRevisedDetailed('지편전', '집현전').text, 'jiphyeonjeon');
});

test('covers every modern precomposed Hangul syllable without undefined output', () => {
  for (let code = 0xac00; code <= 0xd7a3; code += 1) {
    const source = String.fromCodePoint(code);
    const result = romanizeRevised(source);
    assert.ok(result.length > 0, `empty RR for U+${code.toString(16).toUpperCase()}`);
    assert.ok(!result.includes('undefined'), `undefined RR for U+${code.toString(16).toUpperCase()}`);
  }
});
