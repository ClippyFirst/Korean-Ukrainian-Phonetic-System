import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const genericEngine = createEngine(canonical, '');

// NIKL online Q&A (2024-11-19) explicitly analyzes 있네요 as coda neutralization
// followed by nasalization: https://korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=306188
test('§§9 and 18: coda neutralization feeds nasal assimilation in 있네요', () => {
  const result = genericEngine.convert('있네요');
  assert.equal(result.ipa, 'in ne jo');
  assert.ok(result.trace.some((entry) => entry.rules.includes('nasal-assimilation')),
    'the nasalization stage must be visible in the trace');
  assert.deepEqual(result.issues, []);
});

test('§17: unknown ㄷ/ㅌ/ㄾ + vowel-initial ㅣ is not palatalized without morphology', () => {
  for (const input of ['밭이', '굳이', '같이']) {
    const result = genericEngine.convert(input);
    assert.equal(result.status, 'unresolved', input + ': generic Hangul adjacency does not prove an 조사/접미사 boundary');
    assert.ok(result.issues.length > 0, input + ': unresolved morphological licensing must be surfaced');
    assert.ok(result.trace.some((entry) => entry.rules.includes('palatalization-requires-lexical-morphology')),
      input + ': trace must identify the reason the transformation was withheld');
  }
});

test('§17 interaction: ㄷ+ㅎ aspiration and palatalization are ordered for the explicit suffix pattern', () => {
  const result = genericEngine.convert('굳히다');
  assert.equal(result.ipa, 'ku tɕʰi da');
  assert.ok(result.trace.some((entry) => entry.rules.includes('h-aspiration-plus-palatalization')),
    'the combined rule must be traceable rather than simulated by an unrelated Hangul-to-Ukrainian path');
  assert.deepEqual(result.issues, []);
});

test('§18 controls: punctuation and a non-nasal onset do not trigger nasal assimilation', () => {
  const punctuation = genericEngine.convert('있,네요');
  assert.ok(!punctuation.trace.some((entry) => entry.rules.includes('nasal-assimilation')),
    'punctuation blocks the cross-word process');

  const control = genericEngine.convert('있어요');
  assert.equal(control.status, 'unresolved',
    'vowel-initial morphology must not be guessed merely because a following syllable begins with ㅇ');
  assert.ok(control.issues.length > 0);
});
