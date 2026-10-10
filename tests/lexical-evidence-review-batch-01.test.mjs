import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const review = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-01-2026-10-10.md', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);

test('batch 01 reviews ten existing lexical rows without inventing article-level certainty', () => {
  const inputs = ['값없다', '의견란', '읽고', '읽다', '읽어', '읽는', '읽지', '맑게', '맑고', '맑다'];
  for (const input of inputs) {
    assert.ok(rows.some((row) => row.input === input), input + ': expected lexical row to exist');
    assert.ok(review.includes('`' + input + '`'), input + ': source review must name this row');
  }
});

test('batch 01 explicitly records the discovered 읽어 source mismatch', () => {
  assert.match(review, /읽어[\s\S]*?Source mismatch detected/u);
  assert.match(review, /qna_seq=327808[\s\S]*?닭을/u);
  assert.match(review, /replace or supplement the source URL/u);
});

test('batch 01 distinguishes exact-form attestation from related-rule evidence', () => {
  assert.match(review, /Exact form explicitly cited/u);
  assert.match(review, /Rule-family evidence/u);
  assert.match(review, /not merely missing article numbers/u);
  assert.match(review, /Do not auto-assign articles from Korean process keywords/u);
});
