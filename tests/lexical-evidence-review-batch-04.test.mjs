import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const review = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-04-2026-10-10.md', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);

test('batch 04 reviews ten more rule-derived or corpus-style lexical records', () => {
  const inputs = ['밤에는', '춥습니다', '머리를', '빗고', '넓지만', '예쁘고', '짧아도', '보러', '일찍', '나갔습니다'];
  for (const input of inputs) {
    assert.ok(rows.some((row) => row.input === input), input + ': expected lexical row');
    assert.ok(review.includes('`' + input + '`'), input + ': expected review classification');
  }
});

test('batch 04 does not treat generic rule-page URLs as exact-word attestation', () => {
  assert.match(review, /does not directly quote/u);
  assert.match(review, /rule-derived regression/u);
  assert.match(review, /Project corpus/u);
  assert.match(review, /Candidate article mappings/u);
  assert.match(review, /not final normative assignments/u);
});
