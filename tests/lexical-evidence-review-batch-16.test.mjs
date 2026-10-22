import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexical = parseCsv(readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8'));
const sources = parseCsv(readFileSync(new URL('../research/SOURCE-REGISTER.csv', import.meta.url), 'utf8'));
const review = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-16-2026-10-22.md', import.meta.url), 'utf8');
const byInput = (input) => lexical.find((row) => row.input === input);
const bySource = (source_id) => sources.find((row) => row.source_id === source_id);

test('qna_seq=316101 directly attests the two lexical forms and documents non-automatic ㄴ-insertion', () => {
  const source = bySource('SRC-NIKL-QNA-316101');
  assert.ok(source);
  assert.equal(source.source_type, 'normative_lexical_reviewed');
  assert.equal(source.review_status, 'direct_attestation_and_rule29_negative_control_2026-10-22');
  assert.match(source.coverage, /값있다\[가빋따\].*값있는\[가빈는\].*곧이어\[고디어\]/u);
  assert.match(byInput('값있다').rule_notes, /directly gives 값있다\[가빋따\]/u);
  assert.match(byInput('값있다').rule_notes, /§29/u);
  assert.match(byInput('곧이어').rule_notes, /directly gives 곧이어\[고디어\]/u);
  assert.match(byInput('곧이어').rule_notes, /§29/u);
  assert.match(review, /negative controls against a system that predicts insertion/u);
});

test('qna_seq=312381 directly attests 좋아[조ː아] and §12(4) ㅎ deletion', () => {
  const source = bySource('SRC-NIKL-QNA-312381');
  assert.ok(source);
  assert.equal(source.source_type, 'normative_lexical_reviewed');
  assert.equal(source.review_status, 'direct_attestation_2026-10-22');
  assert.match(source.coverage, /좋아\[조ː아\]/u);
  assert.match(byInput('좋아').rule_notes, /directly confirms 좋아\[조ː아\]/u);
  assert.match(byInput('좋아').rule_notes, /§12\(4\)/u);
});

test('source inventory contains 44 remaining citation-only records after batch 16', () => {
  const unreviewed = sources.filter((row) => row.review_status === 'unverified_lexical_citation_inventory_2026-10-22');
  assert.equal(unreviewed.length, 44);
  for (const id of ['SRC-NIKL-QNA-316101', 'SRC-NIKL-QNA-312381']) {
    assert.equal(sources.filter((row) => row.source_id === id).length, 1, id);
    assert.match(bySource(id).license_status, /item-level KOGL marking not checked/u);
  }
});
