import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const review = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-05-2026-10-10.md', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);

test('batch 05 reviews ten more lexical evidence queue entries', () => {
  const inputs = ['꽃밭에', '있던', '학생의', '책을', '연구원은', '발음과', '실제', '발음의', '차이를', '자세히'];
  for (const input of inputs) {
    assert.ok(rows.some((row) => row.input === input), input + ': expected lexical row');
    assert.ok(review.includes('`' + input + '`'), input + ': expected review entry');
  }
});

test('batch 05 flags 실제 for phonological re-analysis rather than guessing a rule', () => {
  assert.match(review, /실제[\s\S]*?Needs phonological re-analysis/u);
  assert.match(review, /may conflate the segment's spelling\/environment/u);
  assert.match(review, /do not infer that ㅅ becomes fortis merely because it is adjacent to an i-like vowel/u);
});

test('batch 05 keeps particle 의 variants and Ukrainian approximations separate', () => {
  assert.match(review, /variant-sensitive/u);
  assert.match(review, /not the only possible standard reading/u);
  assert.match(review, /Ukrainian approximation of ㅎ is a separate design choice/u);
});
