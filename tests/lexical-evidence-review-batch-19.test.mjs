import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexical = parseCsv(readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8'));
const sources = parseCsv(readFileSync(new URL('../research/SOURCE-REGISTER.csv', import.meta.url), 'utf8'));
const report = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-19-2026-10-22.md', import.meta.url), 'utf8');
const source = sources.find(row => row.source_id === 'SRC-NIKL-QNA-279931');
const word = lexical.find(row => row.input === '음용');

test("qna_seq=279931 is content-reviewed but remains partial rule-context evidence", () => {
  assert.ok(source);
  assert.equal(source.source_type, 'normative_lexical_reviewed');
  assert.equal(source.review_status, 'partial_claim_scope_reviewed_2026-10-22');
  assert.match(source.title_or_project, /ㄴ.*첨가/u);
  assert.match(source.version_or_date, /Question 2023-09-11; answer 2023-09-13/u);
  assert.match(source.coverage, /question supplies 음용\[으묭\].*answer.*not repeat/u);
  assert.match(source.integration_status, /question premise rather than a standalone answer example/u);
  assert.match(source.limitations_or_next_action, /Korean bracket notation is not IPA/u);
  assert.match(source.license_status, /item-level KOGL marking not checked/u);
});

test("음용 lexical evidence no longer overstates the question premise as direct confirmation", () => {
  assert.ok(word);
  assert.equal(word.source_url, source.url);
  assert.equal(word.surface_hangul, '으묭');
  assert.equal(word.ipa_syllables, 'ɯ|mjoŋ');
  assert.equal(word.target_syllables, 'и|мйон');
  assert.match(word.rule_notes, /question supplies \[으묭\].*Rule-context \/ negative-control evidence/u);
  assert.doesNotMatch(word.rule_notes, /directly confirms/u);
  assert.match(report, /partial rule-context evidence/u);
  assert.match(report, /Korean bracket notation is not IPA/u);
});

test("batch 19 records its historical backlog and does not freeze the live queue", () => {
  assert.match(report, /26.*22 Q&A\/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs/su);
  assert.equal(source.review_status, 'partial_claim_scope_reviewed_2026-10-22');
  assert.match(report, /34\/60/);
  assert.match(report, /21 direct target-form attestations, 8 partial, 5 contextual-example-only/);
  assert.match(report, /26.*22 Q&A\/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs/su);
  assert.match(report, /No broad-IPA gold or independent Ukrainian-target review was added/u);
});
