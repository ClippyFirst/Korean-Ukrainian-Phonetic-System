import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const review = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-10-2026-10-10.md', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);

test('batch 10 reviews ten queue entries and preserves 대한민국 as a baseline control', () => {
  const inputs = ['꽃잎', '밭이', '밭을', '넓네', '없다', '없는', '국물', '떡볶이', '옷이', '대한민국'];
  for (const input of inputs) {
    assert.ok(rows.some((row) => row.input === input), input + ': expected lexical row');
    assert.ok(review.includes('`' + input + '`'), input + ': expected review entry');
  }
  const baseline = rows.find((row) => row.input === '대한민국');
  assert.doesNotMatch(baseline.rule_notes, /§\s*\d|제\s*\d+\s*항/u);
  assert.match(review, /Baseline\/no-rewrite control/u);
});

test('batch 10 maps nine source-backed records to official rule articles', () => {
  const expected = {
    '꽃잎': /§§9, 18, 29/u,
    '밭이': /§17/u,
    '밭을': /§13/u,
    '넓네': /§§10, 20/u,
    '없다': /§§10, 23/u,
    '없는': /§§10, 18/u,
    '국물': /§18/u,
    '떡볶이': /§23/u,
    '옷이': /§13/u,
  };
  for (const [input, pattern] of Object.entries(expected)) {
    const row = rows.find((item) => item.input === input);
    assert.ok(row, input + ': expected lexical row');
    assert.match(row.rule_notes, pattern, input + ': expected rule mapping');
  }
});

test('batch 10 report preserves its historical queue reduction', () => {
  assert.match(review, /unresolved traceability queue decreases from \*\*48 to 39\*\*/u);
});
