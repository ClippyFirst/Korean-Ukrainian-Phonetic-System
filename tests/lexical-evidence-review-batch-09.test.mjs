import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const review = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-09-2026-10-10.md', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);

test('batch 09 reviews twelve complex-coda and exception records', () => {
  const inputs = ['값없다', '의견란', '읽고', '읽다', '읽어', '읽는', '읽지', '맑게', '맑고', '맑다', '밝기', '닭고기'];
  for (const input of inputs) {
    assert.ok(rows.some((row) => row.input === input), input + ': expected lexical row');
    assert.ok(review.includes('`' + input + '`'), input + ': expected review entry');
  }
});

test('batch 09 assigns the expected official rule mappings', () => {
  const expected = {
    '값없다': /§§10, 15, 23/u,
    '의견란': /§20/u,
    '읽고': /§§11, 23/u,
    '읽다': /§§11, 23/u,
    '읽어': /§14/u,
    '읽는': /§§11, 18/u,
    '읽지': /§§11, 23/u,
    '맑게': /§§11, 23/u,
    '맑고': /§§11, 23/u,
    '맑다': /§§11, 23/u,
    '밝기': /§§11, 23/u,
    '닭고기': /§§11, 23/u,
  };
  for (const [input, pattern] of Object.entries(expected)) {
    const row = rows.find((item) => item.input === input);
    assert.ok(row, input + ': expected lexical row');
    assert.match(row.rule_notes, pattern, input + ': expected rule mapping');
  }
});

test('읽어 points to an official source that explicitly gives 읽어[일거]', () => {
  const row = rows.find((item) => item.input === '읽어');
  assert.ok(row.source_url.includes('qna_seq=324408'));
  assert.match(review, /previous URL did not attest the row's word/u);
});

test('맑고 remains a rule-derived regression rather than exact-word attestation', () => {
  const row = rows.find((item) => item.input === '맑고');
  assert.match(row.rule_notes, /does not explicitly attest 맑고/u);
  assert.match(review, /indirect-evidence status/u);
});
