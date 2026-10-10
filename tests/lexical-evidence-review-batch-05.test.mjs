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

test('실제 is mapped to the Sino-Korean ㄹ+ㅈ fortition rule §26', () => {
  const row = rows.find((item) => item.input === '실제');
  assert.ok(row, 'expected 실제 lexical row');
  assert.match(row.rule_notes, /제26항/u);
  assert.doesNotMatch(row.rule_notes, /i 환경/u);
  assert.match(review, /Sino-Korean words, ㄹ 받침 뒤에 오는 ㄷ, ㅅ, ㅈ/u);
  assert.match(review, /exact word still needs an item-specific dictionary or NIKL citation/u);
});

test('batch 05 keeps particle 의 variants and Ukrainian approximations separate', () => {
  assert.match(review, /variant-sensitive/u);
  assert.match(review, /not the only possible standard reading/u);
  assert.match(review, /Ukrainian approximation of ㅎ is a separate design choice/u);
});
