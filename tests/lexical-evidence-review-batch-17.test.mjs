import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexical = parseCsv(readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8'));
const sources = parseCsv(readFileSync(new URL('../research/SOURCE-REGISTER.csv', import.meta.url), 'utf8'));
const byInput = (input) => lexical.find((row) => row.input === input);
const bySource = (source_id) => sources.find((row) => row.source_id === source_id);

test('KRDICT 79033 is partial evidence for 좋아도, not a direct surface attestation', () => {
  const source = bySource('SRC-KRDICT-ENG-79033');
  assert.ok(source);
  assert.equal(source.review_status, 'partial_lemma_application_support_2026-10-22');
  assert.equal(source.integration_status, 'partial_support_recorded; 좋아도 remains rule-derived');
  assert.match(source.coverage, /좋다\[조ː타\].*좋아\[조ː아\]/u);
  assert.match(source.coverage, /좋아도 is not listed/u);
  assert.match(byInput('좋아도').rule_notes, /attests 좋다\[조ː타\] and 좋아\[조ː아\]/u);
  assert.match(byInput('좋아도').rule_notes, /derive 좋아도 by §12\(4\)/u);
  assert.match(source.limitations_or_next_action, /not direct dictionary pronunciation attestation/u);
  assert.match(source.license_status, /item-level KOGL marking not checked/u);
});

test('KRDICT 57199 is partial lemma evidence for 발음과, not direct full-form evidence', () => {
  const source = bySource('SRC-KRDICT-KOR-57199');
  assert.ok(source);
  assert.equal(source.review_status, 'partial_lemma_support_2026-10-22');
  assert.equal(source.integration_status, 'partial_support_recorded; particle-attached target remains derived');
  assert.match(source.coverage, /발음\[바름\]/u);
  assert.match(source.coverage, /발음과 is not listed/u);
  assert.match(byInput('발음과').rule_notes, /directly gives 발음\[바름\]/u);
  assert.match(source.limitations_or_next_action, /not the full form 발음과/u);
  assert.match(source.license_status, /item-level KOGL marking not checked/u);
});

test('the remaining citation-only count is 42 and the third dictionary page stays unreviewed', () => {
  const unreviewed = sources.filter((row) => row.review_status === 'unverified_lexical_citation_inventory_2026-10-22');
  assert.equal(unreviewed.length, 42);
  assert.equal(bySource('SRC-KRDICT-ENG-89917').review_status, 'unverified_lexical_citation_inventory_2026-10-22');
});
