import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const review = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-07-2026-10-10.md', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);

test('batch 07 reviews ten more traceability queue records', () => {
  const inputs = ['넓어졌다는', '밝는', '실없다', '몇으로', '넋받이', '밭이랑', '집안일', '공업용', '얇실하다', '짧다'];
  for (const input of inputs) {
    assert.ok(rows.some((row) => row.input === input), input + ': expected lexical row');
    assert.ok(review.includes('`' + input + '`'), input + ': expected review entry');
  }
});

test('batch 07 maps nine source-confirmed rows to numbered official rules', () => {
  const expected = {
    '밝는': /§§11, 18/u,
    '실없다': /§§10, 15, 23/u,
    '몇으로': /§13/u,
    '넋받이': /§§10, 17, 23/u,
    '밭이랑': /§§9, 18, 29/u,
    '집안일': /§§18, 29/u,
    '공업용': /§§18, 29/u,
    '얇실하다': /§§10, 23/u,
    '짧다': /§§10, 23/u,
  };
  for (const [input, pattern] of Object.entries(expected)) {
    const row = rows.find((item) => item.input === input);
    assert.ok(row, input + ': expected lexical row');
    assert.match(row.rule_notes, pattern, input + ': expected numbered rule mapping');
  }
});

test('실없다 preserves the official negative control against §13', () => {
  const row = rows.find((item) => item.input === '실없다');
  assert.match(row.rule_notes, /§13 is not relevant|§13 is ruled out/u);
  assert.match(review, /explicitly says §13 is not the applicable rule/u);
});

test('batch 07 historically left 넓어졌다는 unresolved pending ordered derivation', () => {
  assert.match(review, /Still unresolved/u);
  assert.match(review, /Do not add a guessed article number/u);
});
