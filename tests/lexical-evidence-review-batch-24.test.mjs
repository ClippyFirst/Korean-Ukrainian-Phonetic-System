import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexical = parseCsv(readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8'));
const sources = parseCsv(readFileSync(new URL('../research/SOURCE-REGISTER.csv', import.meta.url), 'utf8'));
const report = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-24-2026-10-22.md', import.meta.url), 'utf8');
const source = sources.find(row => row.source_id === 'SRC-NIKL-QNA-313717');
const word = lexical.find(row => row.input === '붙이다');

test('qna_seq=313717 directly attests the exact lexical target 붙이다', () => {
  assert.ok(source);
  assert.equal(source.source_type, 'normative_lexical_reviewed');
  assert.equal(source.review_status, 'direct_attestation_2026-10-22');
  assert.match(source.title_or_project, /붙이는 구개음화/u);
  assert.match(source.version_or_date, /Question 2025-04-23; answer 2025-04-24/u);
  assert.match(source.coverage, /Direct answer: 붙이다\[부치다\]/u);
  assert.match(source.coverage, /§17/u);
  assert.match(source.integration_status, /Direct attestation for the exact lexical target/u);
  assert.match(source.limitations_or_next_action, /Item-level KOGL marking remains unverified/u);
});

test('붙이다 preserves its Korean surface, project IPA, and provisional Ukrainian target', () => {
  assert.ok(word);
  assert.equal(word.source_url, source.url);
  assert.equal(word.surface_hangul, '부치다');
  assert.equal(word.ipa_syllables, 'pu|tɕʰi|da');
  assert.equal(word.target_syllables, 'пу|чі|да');
  assert.match(word.rule_notes, /directly attests 붙이다\[부치다\]/u);
  assert.match(word.rule_notes, /Korean bracket notation is not IPA/u);
  assert.match(report, /direct answer attestation for the exact lexical target 붙이다/u);
});

test('batch 24 updates the live backlog without rewriting historical batch-23 counts', () => {
  const unreviewed = sources.filter(row => row.review_status === 'unverified_lexical_citation_inventory_2026-10-22');
  assert.equal(unreviewed.length, 21);
  assert.match(report, /39\/60/);
  assert.match(report, /25 direct target-form \/ official-rule-example attestations, 9 partial, 5 contextual-example-only/u);
  assert.match(report, /21.*17 Q&A\/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs/su);
  assert.match(report, /18.*17 Q&A\/FAQ \+ one dictionary entry/su);
  assert.match(readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-23-2026-10-22.md', import.meta.url), 'utf8'), /38\/60/);
});
