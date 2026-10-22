import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexical = parseCsv(readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8'));
const sources = parseCsv(readFileSync(new URL('../research/SOURCE-REGISTER.csv', import.meta.url), 'utf8'));
const report = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-26-2026-10-22.md', import.meta.url), 'utf8');
const source = sources.find(row => row.source_id === 'SRC-NIKL-QNA-311728');
const word = lexical.find(row => row.input === '공업용');

test('qna_seq=311728 directly corrects the proposed 공업용 reading', () => {
  assert.ok(source);
  assert.equal(source.source_type, 'normative_lexical_reviewed');
  assert.equal(source.review_status, 'direct_attestation_2026-10-22');
  assert.match(source.title_or_project, /앞일과 공업용의 발음 관련/u);
  assert.match(source.version_or_date, /Question 2025-03-21; answer 2025-03-26/u);
  assert.match(source.coverage, /Direct answer: 공업용\[공엄뇽\]/u);
  assert.match(source.coverage, /question target/u);
  assert.match(source.integration_status, /corrects the question premise and directly gives the standard reading/u);
  assert.match(source.limitations_or_next_action, /Item-level KOGL marking remains unverified/u);
});

test('공업용 preserves its standard Korean surface, project IPA, and Ukrainian target', () => {
  assert.ok(word);
  assert.equal(word.source_url, source.url);
  assert.equal(word.surface_hangul, '공엄뇽');
  assert.equal(word.ipa_syllables, 'koŋ|ʌm|njoŋ');
  assert.equal(word.target_syllables, 'кон|ом|ньон');
  assert.match(word.rule_notes, /correcting the question's proposed \[공업뇽\]/u);
  assert.match(word.rule_notes, /Korean bracket notation is not IPA/u);
  assert.match(report, /the standard pronunciation is 공업용\[공엄뇽\]/u);
});

test('batch 26 preserves its historical inventory as later reviews proceed', () => {
  assert.equal(source.review_status, 'direct_attestation_2026-10-22');
  assert.match(report, /41\/60/);
  assert.match(report, /27 direct target-form \/ official-rule-example attestations, 9 partial, 5 contextual-example-only/u);
  assert.match(report, /19.*15 Q&A\/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs/su);
  assert.match(report, /16.*15 Q&A\/FAQ \+ one dictionary entry/su);
  assert.match(readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-25-2026-10-22.md', import.meta.url), 'utf8'), /40\/60/);
});
