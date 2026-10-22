import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexical = parseCsv(readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8'));
const sources = parseCsv(readFileSync(new URL('../research/SOURCE-REGISTER.csv', import.meta.url), 'utf8'));
const report = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-27-2026-10-22.md', import.meta.url), 'utf8');
const source = sources.find(row => row.source_id === 'SRC-NIKL-QNA-318279');
const word = lexical.find(row => row.input === '찾아가다');

test('qna_seq=318279 is classified as an embedded official dictionary attestation', () => {
  assert.ok(source);
  assert.equal(source.source_type, 'normative_lexical_reviewed');
  assert.equal(source.review_status, 'official_dictionary_attestation_2026-10-22');
  assert.match(source.title_or_project, /찾아가다.*동사의 쓰임/u);
  assert.match(source.version_or_date, /Question 2025-07-14; answer 2025-07-15/u);
  assert.match(source.coverage, /embedded dictionary entry gives 찾아가다\[차자가다\]/u);
  assert.match(source.integration_status, /OFFICIAL_DICTIONARY_ATTESTATION/u);
  assert.match(source.limitations_or_next_action, /Item-level reuse rights remain unverified/u);
});

test('찾아가다 keeps its dictionary surface, IPA, and Ukrainian target without attributing §13 analysis to the Q&A', () => {
  assert.ok(word);
  assert.equal(word.source_url, source.url);
  assert.equal(word.surface_hangul, '차자가다');
  assert.equal(word.ipa_syllables, 'tɕʰa|dʑa|ɡa|da');
  assert.equal(word.target_syllables, 'ча|джа|ґа|да');
  assert.match(word.rule_notes, /embedded in this NIKL Q&A directly lists 찾아가다\[차자가다\]/u);
  assert.match(word.rule_notes, /Q&A itself addresses syntax\/usage, not phonological analysis/u);
  assert.match(word.rule_notes, /Rule mapping §13/u);
  assert.match(report, /OFFICIAL_DICTIONARY_ATTESTATION/u);
});

test('batch 27 updates the live backlog without rewriting historical batch-26 counts', () => {
  const unreviewed = sources.filter(row => row.review_status === 'unverified_lexical_citation_inventory_2026-10-22');
  assert.equal(unreviewed.length, 18);
  assert.match(report, /42\/60/);
  assert.match(report, /27 direct target-form \/ official-rule-example attestations, 1 official dictionary attestation, 9 partial, 5 contextual-example-only/u);
  assert.match(report, /18.*14 Q&A\/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs/su);
  assert.match(report, /15.*14 Q&A\/FAQ \+ one dictionary entry/su);
  assert.match(readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-26-2026-10-22.md', import.meta.url), 'utf8'), /41\/60/);
});
