import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexical = parseCsv(readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8'));
const sources = parseCsv(readFileSync(new URL('../research/SOURCE-REGISTER.csv', import.meta.url), 'utf8'));
const report = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-25-2026-10-22.md', import.meta.url), 'utf8');
const source = sources.find(row => row.source_id === 'SRC-NIKL-QNA-313201');
const word = lexical.find(row => row.input === '굳이');

test('qna_seq=313201 is reviewed as direct official §17 example evidence for 굳이', () => {
  assert.ok(source);
  assert.equal(source.source_type, 'normative_lexical_reviewed');
  assert.equal(source.review_status, 'direct_attestation_2026-10-22');
  assert.match(source.title_or_project, /굳이.*구개음화/u);
  assert.match(source.version_or_date, /Question 2025-04-16; answer 2025-04-18/u);
  assert.equal(source.url, 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=313201');
  assert.match(source.coverage, /question is about 굳이.*official example 굳이\[구지\]/u);
  assert.match(source.integration_status, /Direct official-rule-example attestation/u);
  assert.match(source.limitations_or_next_action, /project IPA and Ukrainian adaptation need separate phonetic adjudication/u);
});

test('굳이 retains the Korean standard reading and preserves the IPA/Ukrainian review boundary', () => {
  assert.ok(word);
  assert.equal(word.source_url, source.url);
  assert.equal(word.surface_hangul, '구지');
  assert.equal(word.ipa_syllables, 'ku|dʑi');
  assert.equal(word.target_syllables, 'ку|джі');
  assert.match(word.rule_notes, /directly covers 굳이 as the question target/u);
  assert.match(word.rule_notes, /Korean bracket notation is not IPA/u);
  assert.match(word.rule_notes, /Ukrainian target still require independent phonetic review/u);
  assert.match(report, /direct official-rule-example evidence for the exact lexical target 굳이/u);
});

test('batch 25 updates the live backlog without rewriting historical batch-24 counts', () => {
  const unreviewed = sources.filter(row => row.review_status === 'unverified_lexical_citation_inventory_2026-10-22');
  assert.equal(unreviewed.length, 20);
  assert.match(report, /40\/60/);
  assert.match(report, /26 direct target-form \/ official-rule-example attestations, 9 partial, 5 contextual-example-only/u);
  assert.match(report, /20.*16 Q&A\/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs/su);
  assert.match(report, /17.*16 Q&A\/FAQ \+ one dictionary entry/su);
  assert.match(readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-24-2026-10-22.md', import.meta.url), 'utf8'), /39\/60/);
});
