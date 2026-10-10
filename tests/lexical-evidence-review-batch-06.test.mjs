import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const review = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-06-2026-10-10.md', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);

test('batch 06 reviews ten further lexical evidence queue entries', () => {
  const inputs = ['설명했어요', '딸이', '흙을', '밟으며', '낡은', '놓인', '밟았습니다', '맑은', '있었고', '웃었고'];
  for (const input of inputs) {
    assert.ok(rows.some((row) => row.input === input), input + ': expected lexical row');
    assert.ok(review.includes('`' + input + '`'), input + ': expected review entry');
  }
});

test('batch 06 does not overstate the 있었고 Q&A as an exact-word citation', () => {
  assert.match(review, /Indirect official evidence, not exact-word attestation/u);
  assert.match(review, /does not explicitly give 있었고/u);
  assert.match(review, /supports the mechanism rather than direct attestation/u);
});

test('batch 06 preserves morphology-scoped ㄼ behavior and multi-stage traces', () => {
  assert.match(review, /must not be generalized to every ㄼ cluster/u);
  assert.match(review, /each boundary and each rule stage separately/u);
  assert.match(review, /ㅎ-deletion regression/u);
});
