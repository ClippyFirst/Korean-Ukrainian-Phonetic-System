import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexical = parseCsv(readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8'));
const sources = parseCsv(readFileSync(new URL('../research/SOURCE-REGISTER.csv', import.meta.url), 'utf8'));
const report = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-28-2026-10-22.md', import.meta.url), 'utf8');
const source = sources.find(row => row.source_id === 'SRC-NIKL-QNA-326601');
const word = lexical.find(row => row.input === '몇으로');

test('qna_seq=326601 directly attests 몇으로[며츠로] and Standard Pronunciation Rules §13', () => {
  assert.ok(source);
  assert.equal(source.source_type, 'normative_lexical_reviewed');
  assert.equal(source.review_status, 'direct_attestation_2026-10-22');
  assert.match(source.title_or_project, /몇으로 발음/u);
  assert.match(source.version_or_date, /Question 2026-01-18; answer 2026-01-20/u);
  assert.match(source.coverage, /Direct answer attestation for the exact lexical target 몇으로\[며츠로\]/u);
  assert.match(source.authority_or_role, /Standard Pronunciation Rules §13/u);
  assert.match(source.integration_status, /directly states the exact standard reading/u);
  assert.match(source.limitations_or_next_action, /Item-level KOGL marking remains unverified/u);
});

test('몇으로 keeps its Korean surface, project IPA, and provisional Ukrainian target unchanged', () => {
  assert.ok(word);
  assert.equal(word.source_url, source.url);
  assert.equal(word.surface_hangul, '며츠로');
  assert.equal(word.ipa_syllables, 'mjʌ|tɕʰɯ|ɾo');
  assert.equal(word.target_syllables, 'мйо|чи|ро');
  assert.match(word.rule_notes, /directly attests 몇으로\[며츠로\]/u);
  assert.match(word.rule_notes, /Korean bracket notation is not IPA/u);
  assert.match(report, /direct official answer attestation for the exact lexical target 몇으로/u);
});

test('batch 28 updates the live backlog without rewriting historical batch-27 counts', () => {
  const unreviewed = sources.filter(row => row.review_status === 'unverified_lexical_citation_inventory_2026-10-22');
  assert.equal(unreviewed.length, 17);
  assert.match(report, /43\/60/);
  assert.match(report, /28 direct target-form \/ official-rule-example attestations, 1 official dictionary attestation, 9 partial, 5 contextual-example-only/u);
  assert.match(report, /17.*13 Q&A\/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs/su);
  assert.match(report, /14.*13 Q&A\/FAQ \+ one dictionary entry/su);
  assert.match(readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-27-2026-10-22.md', import.meta.url), 'utf8'), /42\/60/);
});
