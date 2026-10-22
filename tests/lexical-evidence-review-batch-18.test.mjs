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
  assert.equal(byInput('밝게').source_url, source.url);
  assert.equal(byInput('굵은').source_url, source.url);
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



test('qna_seq=305480 directly attests 읽다[익따] and distinguishes 읽어[일거]', () => {
  const source = bySource('SRC-NIKL-QNA-305480');
  assert.ok(source);
  assert.equal(source.review_status, 'direct_attestation_2026-10-22');
  assert.match(source.coverage, /읽다\[익따\].*읽어\[일거\]/u);
  assert.match(byInput('읽다').rule_notes, /directly confirms 읽다\[익따\]/u);
  assert.equal(byInput('읽다').source_url, source.url);
});

test('qna_seq=335881 attests compound surfaces without asserting unique intermediate order', () => {
  const source = bySource('SRC-NIKL-QNA-335881');
  assert.ok(source);
  assert.equal(source.review_status, 'direct_attestation_with_ordering_limit_2026-10-22');
  assert.match(source.coverage, /밭이랑\[반니랑\].*집안일\[지반닐\]/u);
  assert.match(source.limitations_or_next_action, /does not establish a unique intermediate rule order/u);
  assert.match(byInput('밭이랑').rule_notes, /normative consensus/u);
  assert.match(byInput('집안일').rule_notes, /not an explicit intermediate derivation/u);
  assert.equal(byInput('밭이랑').source_url, source.url);
  assert.equal(byInput('집안일').source_url, source.url);
});

test('qna_seq=328719 directly attests 없이[업씨]', () => {
  const source = bySource('SRC-NIKL-QNA-328719');
  assert.ok(source);
  assert.equal(source.review_status, 'direct_attestation_2026-10-22');
  assert.match(source.coverage, /없이\[업씨\]/u);
  assert.match(byInput('없이').rule_notes, /없이\[업씨\]/u);
  assert.equal(byInput('없이').source_url, source.url);
});

test('qna_seq=330620 directly attests 값없다 and distinguishes substantive-morpheme §15 from §14', () => {
  const source = bySource('SRC-NIKL-QNA-330620');
  assert.ok(source);
  assert.equal(source.review_status, 'direct_attestation_2026-10-22');
  assert.match(source.coverage, /값없다\[가법따\]/u);
  assert.match(source.limitations_or_next_action, /§15 rather than §14/u);
  assert.equal(byInput('값없다').source_url, source.url);
});

test('qna_seq=330938 attests 꽃잎[꼰닙] but does not establish a unique intermediate ordering', () => {
  const source = bySource('SRC-NIKL-QNA-330938');
  assert.ok(source);
  assert.equal(source.review_status, 'direct_attestation_with_ordering_limit_2026-10-22');
  assert.match(source.coverage, /꽃잎\[꼰닙\]/u);
  assert.match(source.limitations_or_next_action, /Do not use it as evidence for a unique intermediate order/u);
  assert.match(byInput('꽃잎').rule_notes, /not as the only ordering endorsed by NIKL/u);
  assert.equal(byInput('꽃잎').source_url, source.url);
});

test('qna_seq=335263 directly attests 실없다[시럽따] and corrects the question title premise', () => {
  const source = bySource('SRC-NIKL-QNA-335263');
  assert.ok(source);
  assert.equal(source.review_status, 'direct_attestation_with_premise_correction_2026-10-22');
  assert.match(source.coverage, /실없다\[시럽따\].*not the question's assumed \[시럼따\]/u);
  assert.match(byInput('실없다').rule_notes, /NIKL lexical reading \[시럽따\]/u);
  assert.equal(byInput('실없다').source_url, source.url);
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
  assert.equal(byInput('외곬에').source_url, source.url);
});


test('MCFAQ 8420 directly attests 않았다[아낟따] and its §§12(4)/23 explanation', () => {
  const source = bySource('SRC-NIKL-MCFAQ-8420');
  assert.ok(source);
  assert.equal(source.review_status, 'direct_attestation_2026-10-22');
  assert.match(source.coverage, /않았다\[아낟따\]/u);
  assert.match(byInput('않았다').rule_notes, /§12\(4\).*§23/u);
  assert.equal(byInput('않았다').source_url, source.url);
});

test('qna_seq=313452 replaces the superseded unverified MCFAQ 8505 locator for 의견란', () => {
  const source = bySource('SRC-NIKL-QNA-313452');
  const superseded = bySource('SRC-NIKL-MCFAQ-8505');
  assert.ok(source);
  assert.ok(superseded);
  assert.equal(source.review_status, 'direct_attestation_2026-10-22');
  assert.equal(superseded.review_status, 'citation_replaced_pending_source_review_2026-10-22');
  assert.match(source.coverage, /의견란\[의견난\].*§20/u);
  assert.match(superseded.coverage, /Page content not independently reviewed/u);
  assert.equal(byInput('의견란').source_url, source.url);
  assert.match(byInput('의견란').rule_notes, /source explicitly preserves the long-vowel mark/u);
  assert.equal(lexical.some((row) => row.source_url === superseded.url), false);
});

test('batch 18 updates the citation-only backlog from 42 to 27 without altering lexical targets', () => {
  const unreviewed = sources.filter((row) => row.review_status === 'unverified_lexical_citation_inventory_2026-10-22');
  assert.equal(unreviewed.length, 27);
  assert.match(review, /falls from 42 to 27/u);
  assert.equal(byInput('읽고').surface_hangul, '일꼬');
  assert.equal(byInput('밝는').surface_hangul, '방는');
  assert.match(review, /No broad-IPA gold or Ukrainian-target validation was added/u);
});
