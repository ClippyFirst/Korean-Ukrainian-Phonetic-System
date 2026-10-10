import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const review = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-11-2026-10-10.md', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);

test('batch 11 reviews twelve compositional and control records', () => {
  const inputs = ['대한민국', '국립국어원', '먹었어요', '찍었어요', '국립국어원에서', '빗었어요', '읽었습니다', '나중엔', '덥고', '밤에는', '춥습니다', '머리를'];
  for (const input of inputs) {
    assert.ok(rows.some((row) => row.input === input), input + ': expected lexical row');
    assert.ok(review.includes('`' + input + '`'), input + ': expected review entry');
  }
});

test('batch 11 assigns article mappings to nine compositional forms', () => {
  const expected = {
    '국립국어원': /§§18, 19, 23/u,
    '먹었어요': /§13/u,
    '찍었어요': /§13/u,
    '국립국어원에서': /§§13, 18, 19, 23/u,
    '빗었어요': /§13/u,
    '읽었습니다': /§§9, 14, 18, 23/u,
    '덥고': /§23/u,
    '밤에는': /§13/u,
    '춥습니다': /§§18, 23/u,
  };
  for (const [input, pattern] of Object.entries(expected)) {
    const row = rows.find((item) => item.input === input);
    assert.ok(row, input + ': expected lexical row');
    assert.match(row.rule_notes, pattern, input + ': expected rule trace');
  }
});

test('baseline and corpus controls are excluded from the article-mapping queue', () => {
  for (const input of ['대한민국', '나중엔', '머리를']) {
    const row = rows.find((item) => item.input === input);
    assert.match(row.rule_notes, /^(?:Baseline control|Corpus control)/u);
    assert.doesNotMatch(row.rule_notes, /§\s*\d|제\s*\d+\s*항/u);
  }
  assert.match(review, /unresolved article-mapping queue decreases from \*\*39 to 27\*\*/u);
});

test('찍었어요 records its second component source without claiming a direct full-form quotation', () => {
  const row = rows.find((item) => item.input === '찍었어요');
  assert.match(row.rule_notes, /krdict\.korean\.go\.kr/u);
  assert.match(row.rule_notes, /Whole-form attestation is compositional/u);
});
