import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexical = parseCsv(readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8'));
const sources = parseCsv(readFileSync(new URL('../research/SOURCE-REGISTER.csv', import.meta.url), 'utf8'));
const review = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-15-2026-10-22.md', import.meta.url), 'utf8');
const byInput = (input) => lexical.find((row) => row.input === input);
const bySource = (source_id) => sources.find((row) => row.source_id === source_id);

test('qna_seq=315279 directly attests the listed complex-coda forms', () => {
  const source = bySource('SRC-NIKL-QNA-315279');
  assert.ok(source);
  assert.equal(source.review_status, 'direct_attestation_2026-10-22');
  assert.equal(source.source_type, 'normative_lexical_reviewed');
  for (const [input, reading] of [['맑고', '말꼬'], ['붉다', '북따'], ['붉지', '북찌'], ['붉고', '불꼬'], ['밟으니', '발브니']]) {
    const row = byInput(input);
    assert.ok(row, input + ': missing lexical row');
    assert.match(row.rule_notes, new RegExp('directly (?:gives|confirms) ' + input + '\\[' + reading + '\\]'));
  }
  assert.match(source.coverage, /맑고\[말꼬\].*밟으니\[발브니\]/u);
  assert.match(review, /answer: 2025-05-23/u);
});

test('qna_seq=307237 distinguishes the target answer 넓네 from quoted rule example 없다', () => {
  const source = bySource('SRC-NIKL-QNA-307237');
  assert.ok(source);
  assert.match(source.review_status, /direct_answer_and_quoted_rule_example/u);
  assert.match(byInput('넓네').rule_notes, /directly answers 넓네\[널레\]/u);
  assert.match(byInput('없다').rule_notes, /reproduces 없다\[업ː따\] as an example/u);
  assert.match(source.limitations_or_next_action, /not the question target/u);
});

test('mcfaq_seq=5748 preserves the distinction between Hangeul Orthography and Standard Pronunciation Rules', () => {
  const source = bySource('SRC-NIKL-MCFAQ-5748');
  assert.ok(source);
  assert.equal(source.review_status, 'direct_attestation_with_rule_instrument_scope_note_2026-10-22');
  assert.match(byInput('밭이').rule_notes, /한글맞춤법 §17/u);
  assert.match(byInput('밭이').rule_notes, /Standard Pronunciation Rules §17/u);
  assert.match(byInput('밭을').rule_notes, /한글맞춤법 §13/u);
  assert.match(byInput('밭을').rule_notes, /Standard Pronunciation Rules §13/u);
  assert.match(review, /Rule-instrument distinction/u);
});

test('source register has 46 remaining citation-only rows after batch 15', () => {
  const unreviewed = sources.filter((row) => row.review_status === 'unverified_lexical_citation_inventory_2026-10-22');
  assert.equal(unreviewed.length, 46);
  for (const id of ['SRC-NIKL-QNA-315279', 'SRC-NIKL-QNA-307237', 'SRC-NIKL-MCFAQ-5748']) {
    assert.equal(sources.filter((row) => row.source_id === id).length, 1, id);
    assert.match(bySource(id).license_status, /item-level KOGL marking not checked/u);
  }
});
