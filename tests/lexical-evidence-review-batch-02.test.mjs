import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const review = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-02-2026-10-10.md', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);

test('batch 02 reviews the next ten traceability-queue records', () => {
  const inputs = ['밝기', '닭고기', '꽃잎', '밭이', '밭을', '넓네', '없다', '없는', '국물', '떡볶이'];
  for (const input of inputs) {
    assert.ok(rows.some((row) => row.input === input), input + ': expected lexical row to exist');
    assert.ok(review.includes('`' + input + '`'), input + ': source review must name this row');
  }
});

test('batch 02 preserves source mismatch findings and regulation-name distinction', () => {
  assert.match(review, /source URL mismatch/iu);
  assert.match(review, /qna_seq=313399[\s\S]*?밝기/u);
  assert.match(review, /qna_seq=307219[\s\S]*?꽃잎/u);
  assert.match(review, /qna_seq=313397[\s\S]*?떡볶이/u);
  assert.match(review, /한글맞춤법[\s\S]*?표준 발음법/u);
});

test('corrected lexical URLs point to official pages that attest the specific forms', () => {
  const expected = {
    '밝기': 'qna_seq=334141',
    '꽃잎': 'qna_seq=330938',
    '떡볶이': 'qna_seq=325642',
    '옷이': 'qna_seq=311009',
  };
  for (const [input, marker] of Object.entries(expected)) {
    const row = rows.find((item) => item.input === input);
    assert.ok(row, input + ': expected lexical row');
    assert.ok(row.source_url.includes(marker), input + ': expected corrected official source URL');
  }
});

test('batch 02 records explicit rule examples without claiming every URL is item-specific', () => {
  assert.match(review, /없는\[엄ː는\]/u);
  assert.match(review, /국물\[궁물\]/u);
  assert.match(review, /없다\[업ː따\]/u);
  assert.match(review, /single pedagogical derivation/u);
});
