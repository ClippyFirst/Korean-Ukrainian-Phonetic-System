import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const review = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-03-2026-10-10.md', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);

test('batch 03 names the next ten traceability-queue records', () => {
  const inputs = ['옷이', '대한민국', '국립국어원', '먹었어요', '찍었어요', '국립국어원에서', '빗었어요', '읽었습니다', '나중엔', '덥고'];
  for (const input of inputs) {
    assert.ok(rows.some((row) => row.input === input), input + ': expected lexical row');
    assert.ok(review.includes('`' + input + '`'), input + ': expected source review');
  }
});

test('batch 03 distinguishes exact-form evidence from derived and corpus records', () => {
  assert.match(review, /Exact form confirmed/u);
  assert.match(review, /Indirect evidence \/ two-source derivation/u);
  assert.match(review, /project corpus evidence/i);
  assert.match(review, /general normative background/u);
  assert.match(review, /Do not assign article numbers from a process label alone/u);
});

test('the corrected 옷이 source remains the official §13 page', () => {
  const row = rows.find((item) => item.input === '옷이');
  assert.ok(row.source_url.includes('qna_seq=311009'));
});
