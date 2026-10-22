import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexical = parseCsv(readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8'));
const sources = parseCsv(readFileSync(new URL('../research/SOURCE-REGISTER.csv', import.meta.url), 'utf8'));
const review = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-18-2026-10-22.md', import.meta.url), 'utf8');
const byInput = (input) => lexical.find((row) => row.input === input);
const bySource = (source_id) => sources.find((row) => row.source_id === source_id);

test('qna_seq=330743 directly attests the exact forms 밝게 and 굵은', () => {
  const source = bySource('SRC-NIKL-QNA-330743');
  assert.ok(source);
  assert.equal(source.source_type, 'normative_lexical_reviewed');
  assert.equal(source.review_status, 'direct_attestation_2026-10-22');
  assert.match(source.coverage, /밝게\[발께\].*굵은\[굴근\]/u);
  assert.match(byInput('밝게').rule_notes, /directly confirms 밝게\[발께\]/u);
  assert.match(byInput('굵은').rule_notes, /directly confirms 굵은\[굴근\]/u);
  assert.equal(byInput('밝게').source_url, source.source_url);
  assert.equal(byInput('굵은').source_url, source.source_url);
  assert.match(source.limitations_or_next_action, /item-level reuse rights remain unverified/u);
});

test('qna_seq=334294 is contextual support and no longer falsely claims direct attestation of 읽고 or 밝는', () => {
  const source = bySource('SRC-NIKL-QNA-334294');
  assert.ok(source);
  assert.equal(source.source_type, 'normative_lexical_reviewed');
  assert.equal(source.review_status, 'partial_claim_scope_reviewed_2026-10-22');
  assert.match(source.coverage, /맑게\[말께\].*묽고\[물꼬\].*밝기\[발끼\]/u);
  assert.match(source.coverage, /does not directly attest.*읽고\[일꼬\].*밝는\[방는\]/u);
  assert.match(byInput('읽고').rule_notes, /Rule-derived, not directly attested/u);
  assert.match(byInput('밝는').rule_notes, /Rule-derived, not directly attested/u);
  assert.doesNotMatch(byInput('읽고').rule_notes, /NIKL Q&A directly confirms/u);
  assert.doesNotMatch(byInput('밝는').rule_notes, /NIKL Q&A directly confirms/u);
  assert.match(source.limitations_or_next_action, /not directly attested by this citation/u);
});

test('qna_seq=307508 is partial until the spelling discrepancy is resolved', () => {
  const source = bySource('SRC-NIKL-QNA-307508');
  assert.ok(source);
  assert.equal(source.review_status, 'partial_claim_scope_reviewed_2026-10-22');
  assert.match(source.coverage, /넓둥굴다\[넙뚱글다\].*넓둥글다/u);
  assert.match(byInput('넓둥글다').rule_notes, /exact orthographic match as unresolved/u);
  assert.doesNotMatch(byInput('넓둥글다').rule_notes, /directly confirms/u);
});

test('qna_seq=317229 directly attests 외곬에 and the lexical URL matches the source register', () => {
  const source = bySource('SRC-NIKL-QNA-317229');
  assert.ok(source);
  assert.equal(source.review_status, 'direct_attestation_2026-10-22');
  assert.match(source.coverage, /외곬에\[외골쎄\]/u);
  assert.match(byInput('외곬에').rule_notes, /directly confirms 외곬에\[외골쎄\]/u);
  assert.equal(byInput('외곬에').source_url, source.source_url);
});

test('batch 18 updates the citation-only backlog from 42 to 38 without altering lexical targets', () => {
  const unreviewed = sources.filter((row) => row.review_status === 'unverified_lexical_citation_inventory_2026-10-22');
  assert.equal(unreviewed.length, 38);
  assert.match(review, /falls from 42 to 38/u);
  assert.equal(byInput('읽고').pronunciation, '일꼬');
  assert.equal(byInput('밝는').pronunciation, '방는');
  assert.match(review, /No broad-IPA gold or Ukrainian-target validation was added/u);
});
