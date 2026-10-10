import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const genericEngine = createEngine(canonical, '');

const representativeChangingCodas = [
  'ㄲ','ㄳ','ㄵ','ㄶ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅄ',
  'ㅅ','ㅆ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ',
];
const representativeStableCodas = ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅇ'];
const codaSyllable = new Map([
  ['ㄱ','각'],['ㄲ','갂'],['ㄳ','갃'],['ㄴ','간'],['ㄵ','갅'],['ㄶ','갆'],
  ['ㄷ','갇'],['ㄹ','갈'],['ㄺ','갉'],['ㄻ','갊'],['ㄼ','갋'],['ㄽ','갌'],
  ['ㄾ','갍'],['ㄿ','갎'],['ㅀ','갏'],['ㅁ','감'],['ㅂ','갑'],['ㅄ','값'],
  ['ㅅ','갓'],['ㅆ','갔'],['ㅇ','강'],['ㅈ','갖'],['ㅊ','갗'],['ㅋ','갘'],
  ['ㅌ','같'],['ㅍ','갚'],['ㅎ','갛'],
]);

test('§15: every coda whose representative differs from spelling is withheld before substantive ㅏ-initial material', () => {
  for (const coda of representativeChangingCodas) {
    const input = codaSyllable.get(coda) + '아';
    const result = genericEngine.convert(input);
    assert.ok(
      result.ukrainian.includes('⟦') || result.issues.length > 0 || result.status === 'unresolved',
      input + ': formal/substantive morpheme distinction must not be guessed',
    );
    assert.ok(
      result.trace.some((item) => item.rules.some((rule) => /requires-morphology/u.test(rule))),
      input + ': unresolved result should explain the missing morphological license',
    );
  }
});

test('§15: coda spellings already equal to their representative can resyllabify without changing the normative result', () => {
  for (const coda of representativeStableCodas) {
    const input = codaSyllable.get(coda) + '아';
    const result = genericEngine.convert(input);
    assert.equal(result.issues.length, 0, input);
    assert.ok(!result.ukrainian.includes('⟦'), input + ': no false ambiguity when both analyses yield the same representative');
    assert.ok(!result.trace.some((item) => item.rules.some((rule) => /requires-morphology/u.test(rule))), input);
  }
});
