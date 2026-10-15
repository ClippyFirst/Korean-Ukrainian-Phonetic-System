import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const generic = createEngine(canonical, '');

function hasNInsertion(result) {
  return result.trace.some((item) => item.rules.includes('phrase-n-insertion-§29'));
}

test('§29: every exact licensed phrase-boundary example receives the narrow insertion trace', () => {
  const licensed = [
    '한 일',
    '옷 입다',
    '먹은 엿',
    '할 일',
    '잘 입다',
    '먹을 엿',
    '무슨 일',
    '끝난 일',
    '않은 일',
  ];
  for (const phrase of licensed) {
    assert.ok(hasNInsertion(generic.convert(phrase)), phrase + ': expected the exact §29 phrase license');
  }
});

test('§29: unrelated phrases do not inherit n-insertion from a similar coda or vowel onset', () => {
  const controls = [
    '한 집',
    '옷 안',
    '먹은 밥',
    '할 말',
    '잘 한다',
    '먹을 물',
  ];
  for (const phrase of controls) {
    assert.ok(!hasNInsertion(generic.convert(phrase)), phrase + ': no exact phrase license; do not infer compound or morphology');
  }
});

test('§29 phrase insertion never crosses punctuation', () => {
  for (const phrase of ['한, 일', '옷! 입다', '할—일']) {
    assert.ok(!hasNInsertion(generic.convert(phrase)), phrase + ': punctuation blocks the licensed phrase-boundary rule');
  }
});
