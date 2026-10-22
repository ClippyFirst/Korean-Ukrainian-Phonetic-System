import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexical = parseCsv(readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8'));
const sources = parseCsv(readFileSync(new URL('../research/SOURCE-REGISTER.csv', import.meta.url), 'utf8'));
const report = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-20-2026-10-22.md', import.meta.url), 'utf8');
const source = sources.find(row => row.source_id === 'SRC-NIKL-QNA-317202');
const word = lexical.find(row => row.input === '홑이불을');

test('qna_seq=317202 is reviewed as partial lemma/application evidence, not direct full-form attestation', () => {
  assert.ok(source);
  assert.equal(source.source_type, 'normative_lexical_reviewed');
  assert.equal(source.review_status, 'partial_lemma_application_support_2026-10-22');
  assert.match(source.title_or_project, /홑이불/u);
  assert.match(source.version_or_date, /Question 2025-06-28; answer 2025-06-30/u);
  assert.match(source.coverage, /attests the lemma 홑이불\[혼니불\]/u);
  assert.match(source.coverage, /exact inflected input 홑이불을/u);
  assert.match(source.integration_status, /exact inflected form remains rule-derived/u);
  assert.match(source.limitations_or_next_action, /Item-level KOGL marking remains unverified/u);
});

test('홑이불을 retains its existing surface, IPA, and Ukrainian reference while narrowing source claims', () => {
  assert.ok(word);
  assert.equal(word.source_url, source.url);
  assert.equal(word.surface_hangul, '혼니부를');
  assert.equal(word.ipa_syllables, 'hon|ni|bu|ɾɯl');
  assert.equal(word.target_syllables, 'гон|ні|бу|рил');
  assert.match(word.rule_notes, /attests the lemma 홑이불\[혼니불\]/u);
  assert.match(word.rule_notes, /does not separately attest the inflected input 홑이불을/u);
  assert.match(word.rule_notes, /liaison of final ㄹ before particle 을 follows §13/u);
  assert.doesNotMatch(word.rule_notes, /directly confirms 홑이불\[혼니불\]/u);
  assert.match(report, /partial lemma\/application support/u);
  assert.match(report, /Korean bracket notation is a pronunciation notation, not IPA/u);
});

test('batch 20 records its historical backlog without freezing the live queue', () => {
  assert.equal(source.review_status, 'partial_lemma_application_support_2026-10-22');
  assert.match(report, /35\/60/);
  assert.match(report, /21 direct target-form attestations, 9 partial, 5 contextual-example-only/u);
  assert.match(report, /25.*21 Q&A\/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs/su);
  assert.match(report, /No broad-IPA gold or independent Ukrainian-target review was added/u);
  assert.match(readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-19-2026-10-22.md', import.meta.url), 'utf8'), /34\/60/);
});
