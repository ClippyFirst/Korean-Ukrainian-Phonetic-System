import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const review = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-12-2026-10-10.md', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);

test('batch 12 reviews twelve coda, fortition, liaison, and baseline cases', () => {
  const inputs = ['빗고', '넓지만', '예쁘고', '짧아도', '보러', '일찍', '나갔습니다', '꽃밭에', '있던', '학생의', '책을', '연구원은'];
  for (const input of inputs) {
    assert.ok(rows.some((row) => row.input === input), input + ': expected lexical row');
    assert.ok(review.includes('`' + input + '`') || review.includes(input), input + ': expected review entry');
  }
});

test('batch 12 maps nine derived forms and preserves three baseline controls', () => {
  const expected = {
    '빗고': /§§9, 23/u,
    '넓지만': /§§10, 25/u,
    '짧아도': /§14/u,
    '나갔습니다': /§§9, 18, 23/u,
    '꽃밭에': /§§9, 13, 23/u,
    '있던': /§§9, 23/u,
    '학생의': /§§5, 23/u,
    '책을': /§13/u,
    '연구원은': /§13/u,
  };
  for (const [input, pattern] of Object.entries(expected)) {
    const row = rows.find((item) => item.input === input);
    assert.ok(row, input + ': expected lexical row');
    assert.match(row.rule_notes, pattern, input + ': expected rule trace');
  }
  for (const input of ['예쁘고', '보러', '일찍']) {
    const row = rows.find((item) => item.input === input);
    assert.match(row.rule_notes, /^Baseline control/u);
    assert.doesNotMatch(row.rule_notes, /§\s*\d|제\s*\d+\s*항/u);
  }
});

test('넓지만 uses §25, not §23, for fortition after the ㄼ verb stem', () => {
  const row = rows.find((item) => item.input === '넓지만');
  assert.match(row.rule_notes, /§§10, 25/u);
  assert.match(row.rule_notes, /Do not use §23/u);
  assert.match(review, /Do not use §23/u);
});
