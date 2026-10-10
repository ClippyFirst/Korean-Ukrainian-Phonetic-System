import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const review = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-08-2026-10-10.md', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);

test('batch 08 reviews the final ten entries in this tail sequence', () => {
  const inputs = ['넓어졌다는', '삶다', '넓어', '넓으니', '넓은', '넓습니다', '넓지', '값있다', '곧이어', '음용'];
  for (const input of inputs) {
    assert.ok(rows.some((row) => row.input === input), input + ': expected lexical row');
    assert.ok(review.includes('`' + input + '`'), input + ': expected review entry');
  }
});

test('batch 08 has explicit rule mappings for nine resolved rows', () => {
  const expected = {
    '삶다': /§§11, 23/u,
    '넓어': /§14/u,
    '넓으니': /§14/u,
    '넓은': /§14/u,
    '넓습니다': /§§10, 18, 23/u,
    '넓지': /§§10, 23/u,
    '값있다': /§29/u,
    '곧이어': /§29/u,
    '음용': /§29/u,
  };
  for (const [input, pattern] of Object.entries(expected)) {
    const row = rows.find((item) => item.input === input);
    assert.ok(row, input + ': expected lexical row');
    assert.match(row.rule_notes, pattern, input + ': expected rule reference');
  }
});

test('넓은 remains explicitly labelled as indirect rather than exact lexical attestation', () => {
  const row = rows.find((item) => item.input === '넓은');
  assert.match(row.rule_notes, /exact-word pronunciation attestation remains indirect/u);
  assert.match(review, /does not explicitly give a bracketed pronunciation for 넓은/u);
});

test('batch 08 historically left 넓어졌다는 unresolved; later review supplies a trace', () => {
  const row = rows.find((item) => item.input === '넓어졌다는');
  assert.match(review, /Still unresolved/u);
  assert.match(review, /Do not assign a blanket article list/u);
  assert.match(row.rule_notes, /§§9, 14, 23/u);
});
