import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexical = parseCsv(readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8'));
const sources = parseCsv(readFileSync(new URL('../research/SOURCE-REGISTER.csv', import.meta.url), 'utf8'));
const report = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-25-2026-10-22.md', import.meta.url), 'utf8');
const source = sources.find(row => row.source_id === 'SRC-NIKL-QNA-311728');
const word = lexical.find(row => row.input === '공업용');

test("qna_seq=311728 directly corrects the proposed 공업용 form and quotes §29 examples", () => {
  assert.ok(source);
  assert.equal(source.source_type, 'normative_lexical_reviewed');
  assert.equal(source.review_status, 'direct_attestation_with_question_premise_correction_2026-10-22');
  assert.match(source.title_or_project, /앞일과 공업용의 발음 관련/u);
  assert.match(source.version_or_date, /Question 2025-03-21; answer 2025-03-26/u);
  assert.match(source.coverage, /Question proposes 공업용\[공업뇽\].*corrects.*공엄뇽/u);
  assert.match(source.contribution_expected, /Do not treat the question's \[공업뇽\] as normative/u);
  assert.match(source.license_status, /item-level KOGL marking not checked/u);
});

test("공업용 output fields stay unchanged while its evidence note reflects the correction", () => {
  assert.ok(word);
  assert.equal(word.source_url, source.url);
  assert.equal(word.surface_hangul, '공엄뇽');
  assert.equal(word.ipa_syllables, 'koŋ|ʌm|njoŋ');
  assert.equal(word.target_syllables, 'кон|ом|ньон');
  assert.match(word.rule_notes, /corrects the question's \[공업뇽\] premise/u);
  assert.match(word.rule_notes, /standard pronunciation \[공엄뇽\]/u);
  assert.match(word.rule_notes, /영업-용\[영엄뇽\]/u);
  assert.match(word.rule_notes, /Article mapping §§18, 29/u);
  assert.match(report, /Korean bracket notation is not IPA/u);
});

test("batch 25 reconciles the live citation-only queue", () => {
  const unreviewed = sources.filter(row => row.review_status === 'unverified_lexical_citation_inventory_2026-10-22');
  assert.equal(unreviewed.length, 20);
  assert.match(report, /40\/60/);
  assert.match(report, /26 direct target-form \/ official-rule-example attestations, 9 partial, 5 contextual-example-only/u);
  assert.match(report, /20.*16 Q&A\/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs/su);
  assert.match(report, /\*\*17\*\* eligible pages \(16 Q&A\/FAQ \+ one dictionary entry\)/u);
});
