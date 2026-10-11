import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
// Deliberately omit the lexical dictionary: these assertions exercise the
// productive generic rule engine, not a memorized output.
// Authority: NIKL Standard Pronunciation Rules §12:
// https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
const genericEngine = createEngine(canonical, '');

test('§12: a simple ㅎ coda aspirates a following plain stop in generic IPA', () => {
  const cases = [
    ['좋다', 'tɕo tʰa', 'чота'],
    ['좋고', 'tɕo kʰo', 'чоко'],
    ['좋지', 'tɕo tɕʰi', 'чочі'],
    ['놓다', 'no tʰa', 'нота'],
    ['많다', 'man tʰa', 'манта'],
    ['않다', 'an tʰa', 'анта'],
  ];

  for (const [input, expectedIpa, expectedUkrainian] of cases) {
    const result = genericEngine.convert(input);
    assert.equal(result.ipa, expectedIpa, input + ': generic surface IPA');
    assert.equal(result.ukrainian, expectedUkrainian, input + ': Ukrainian must be derived from surface IPA');
    assert.deepEqual(result.issues, [], input + ': this direct aspiration pattern is rule-governed');
    assert.ok(result.trace.some(item => item.rules.includes('h-aspiration')), input + ': missing §12 aspiration trace');
    assert.ok(!result.ukrainian.includes('⟦'), input + ': a supported pattern must not produce a placeholder');
  }
});

test('§12: H deletion before a vowel is not guessed from adjacent Hangul alone', () => {
  for (const input of ['좋아', '많아', '않아', '싫어']) {
    const result = genericEngine.convert(input);
    assert.equal(result.status, 'unresolved', input + ': vowel-initial ending needs morphological evidence');
    assert.ok(result.issues.length > 0, input + ': unresolved morphology must be surfaced');
    assert.ok(result.trace.some(item => item.rules.some(rule => /h-deletion-requires-morphology|complex-coda-liaison-requires-morphology/u.test(rule))),
      input + ': trace must identify the missing morphology license');
  }
});

test('§15: unknown cross-word vowel liaison is not silently treated as absent', () => {
  // The official phrase 밭 아래 has a sourced lexical reading. With the
  // lexicon deliberately disabled, the generic engine must surface its
  // missing morpheme-boundary evidence instead of emitting a false no-liaison
  // reading. This is the regression that an exact lexical override would hide.
  const result = genericEngine.convert('밭 아래');
  assert.equal(result.status, 'unresolved');
  assert.ok(result.issues.some(issue => /cross-word vowel-initial liaison.*§15/u.test(issue)));
  assert.ok(result.trace.some(item => item.rules.includes('cross-word-vowel-liaison-requires-morphology')));
});

test('§12: complex coda plus ㅎ is not generalized as simple coda aspiration', () => {
  for (const input of ['읽히다', '앉히다', '넓히다']) {
    const result = genericEngine.convert(input);
    assert.equal(result.status, 'unresolved', input + ': complex-coda + ㅎ depends on a licensed morpheme boundary');
    assert.ok(result.issues.length > 0, input + ': must not silently guess the suffix pattern');
    assert.ok(result.trace.some(item => item.rules.includes('complex-coda-h-aspiration-requires-morphology')),
      input + ': missing explicit complex-coda aspiration guard');
  }
});
