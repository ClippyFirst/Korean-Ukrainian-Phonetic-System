import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexical = parseCsv(readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8'));
const sources = parseCsv(readFileSync(new URL('../research/SOURCE-REGISTER.csv', import.meta.url), 'utf8'));
const review = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-14-2026-10-22.md', import.meta.url), 'utf8');
const byInput = (input) => lexical.find((row) => row.input === input);
const bySource = (source_id) => sources.find((row) => row.source_id === source_id);

test('batch 14 records exact dictionary attestation for 맑은, not 맑을', () => {
  const exact = byInput('맑은');
  assert.equal(exact.source_url, 'https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=66031&nation=eng&nationCode=6');
  assert.match(exact.rule_notes, /directly lists 맑은\[말근\]/u);
  assert.match(exact.rule_notes, /not IPA/u);
  const source = bySource('SRC-KRDICT-ENG-66031');
  assert.ok(source);
  assert.match(source.coverage, /Directly lists 맑은\[말근\]/u);
  assert.match(source.review_status, /direct_attestation_for_맑은_partial_for_맑을/u);
  assert.match(review, /\| Direct for `맑은`; partial for `맑을` \|/u);
});

test('batch 14 keeps 얇은 exact-form evidence scoped to the listed dictionary paradigm', () => {
  const exact = byInput('얇은');
  assert.equal(exact.source_url, 'https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=89859&nation=eng&nationCode=6');
  assert.match(exact.rule_notes, /directly lists 얇은\[얄븐\]/u);
  const source = bySource('SRC-KRDICT-ENG-89859');
  assert.ok(source);
  assert.match(source.review_status, /^direct_attestation_2026-10-22$/u);
  assert.match(source.limitations_or_next_action, /not all ㄼ adjective paradigms/u);
});

test('batch 14 marks 넣었다 as derived because the cited page does not list it', () => {
  const exact = byInput('넣었다');
  assert.match(exact.rule_notes, /not directly listed on the page/u);
  const source = bySource('SRC-KRDICT-ENG-64509');
  assert.ok(source);
  assert.match(source.review_status, /^partial_lemma_application_support_2026-10-22$/u);
  assert.match(source.coverage, /넣었다 is not directly listed/u);
  assert.match(review, /\*\*not\*\* listed/u);
});

test('all three source identities remain unique and item-level rights remain unresolved', () => {
  for (const id of ['SRC-KRDICT-ENG-64509', 'SRC-KRDICT-ENG-66031', 'SRC-KRDICT-ENG-89859']) {
    assert.equal(sources.filter((row) => row.source_id === id).length, 1, id);
    assert.match(bySource(id).license_status, /item-level KOGL marking not checked/u);
  }
});
