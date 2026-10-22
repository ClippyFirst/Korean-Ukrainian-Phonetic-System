import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexical = parseCsv(readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8'));
const sources = parseCsv(readFileSync(new URL('../research/SOURCE-REGISTER.csv', import.meta.url), 'utf8'));
const report = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-23-2026-10-22.md', import.meta.url), 'utf8');
const source = sources.find(row => row.source_id === 'SRC-NIKL-QNA-314041');
const word = lexical.find(row => row.input === '낱낱이');

test('qna_seq=314041 directly attests 낱낱이 and the stated sequence of rule applications', () => {
  assert.ok(source);
  assert.equal(source.source_type, 'normative_lexical_reviewed');
  assert.equal(source.review_status, 'direct_attestation_2026-10-22');
  assert.match(source.title_or_project, /낱낱이.*음운변동/u);
  assert.match(source.version_or_date, /Question 2025-04-28; answer 2025-04-29/u);
  assert.match(source.coverage, /Directly attests 낱낱이\[난ː나치\]/u);
  assert.match(source.coverage, /final neutralization, nasalization, then palatalization/u);
  assert.match(source.integration_status, /exact form and ordered explanation/u);
  assert.match(source.limitations_or_next_action, /Item-level KOGL marking remains unverified/u);
});

test("낱낱이 keeps the long vowel in IPA and no longer understates the source's explicit sequence", () => {
  assert.ok(word);
  assert.equal(word.source_url, source.url);
  assert.equal(word.surface_hangul, '난나치');
  assert.equal(word.ipa_syllables, 'nanː|na|tɕʰi');
  assert.equal(word.target_syllables, 'нан|на|чі');
  assert.match(word.rule_notes, /explicitly states the sequence: syllable-final neutralization, nasalization, then palatalization/u);
  assert.match(word.rule_notes, /Preserve vowel length in IPA/u);
  assert.doesNotMatch(word.rule_notes, /exact rule ordering can vary by analysis/u);
  assert.match(report, /explicitly states the ordered explanation/u);
  assert.match(report, /Korean bracket notation is not IPA/u);
});

test('batch 23 updates the live backlog without rewriting the historical batch-22 count', () => {
  const unreviewed = sources.filter(row => row.review_status === 'unverified_lexical_citation_inventory_2026-10-22');
  assert.equal(unreviewed.length, 22);
  assert.match(report, /38\/60/);
  assert.match(report, /24 direct target-form \/ official-rule-example attestations, 9 partial, 5 contextual-example-only/u);
  assert.match(report, /22.*18 Q&A\/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs/su);
  assert.match(report, /19.*18 Q&A\/FAQ \+ one dictionary entry/su);
  assert.match(readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-22-2026-10-22.md', import.meta.url), 'utf8'), /37\/60/);
});
