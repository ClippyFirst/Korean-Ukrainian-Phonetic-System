import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexical = parseCsv(readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8'));
const sources = parseCsv(readFileSync(new URL('../research/SOURCE-REGISTER.csv', import.meta.url), 'utf8'));
const report = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-20-2026-10-22.md', import.meta.url), 'utf8');
const source = sources.find(row => row.source_id === 'SRC-NIKL-QNA-312379');
const byInput = input => lexical.find(row => row.input === input);

test("qna_seq=312379 directly attests 얇실하다 and separately quotes official §23 examples", () => {
  assert.ok(source);
  assert.equal(source.source_type, 'normative_lexical_reviewed');
  assert.equal(source.review_status, 'direct_answer_and_quoted_rule_examples_2026-10-22');
  assert.match(source.title_or_project, /표준발음과 음운변동/u);
  assert.match(source.version_or_date, /Question 2025-04-03; answer 2025-04-08/u);
  assert.match(source.coverage, /Direct answer gives 얇실하다\[얄씰하다\].*밭갈이\[받까리\].*값지다\[갑찌다\]/u);
  assert.match(source.integration_status, /not as the question target/u);
  assert.match(source.license_status, /item-level KOGL marking not checked/u);
  for (const input of ['얇실하다', '밭갈이', '값지다']) assert.equal(byInput(input).source_url, source.url, input);
  assert.match(byInput('얇실하다').rule_notes, /directly confirms \[얄씰하다\]/u);
  assert.match(byInput('밭갈이').rule_notes, /NIKL §23 example \[받까리\]/u);
  assert.match(byInput('값지다').rule_notes, /NIKL §23 example \[갑찌다\]/u);
});

test("batch 20 reconciles the live citation-only queue without changing target values", () => {
  const unreviewed = sources.filter(row => row.review_status === 'unverified_lexical_citation_inventory_2026-10-22');
  assert.equal(unreviewed.length, 25);
  assert.match(report, /35\/60/);
  assert.match(report, /22 direct target-form attestations, 8 partial, 5 contextual-example-only/);
  assert.match(report, /25.*21 Q&A\/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs/su);
  assert.match(report, /No runtime Korean pronunciation or Ukrainian output values changed/u);
});
