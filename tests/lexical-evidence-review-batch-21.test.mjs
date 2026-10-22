import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexical = parseCsv(readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8'));
const sources = parseCsv(readFileSync(new URL('../research/SOURCE-REGISTER.csv', import.meta.url), 'utf8'));
const report = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-21-2026-10-22.md', import.meta.url), 'utf8');
const source = sources.find(row => row.source_id === 'SRC-NIKL-QNA-311009');
const byInput = input => lexical.find(row => row.input === input);

test('qna_seq=311009 is reviewed with explicit question-target versus quoted-rule-example scope', () => {
  assert.ok(source);
  assert.equal(source.source_type, 'normative_lexical_reviewed');
  assert.equal(source.review_status, 'direct_attestation_with_rule_instrument_scope_note_2026-10-22');
  assert.match(source.title_or_project, /빛.*발음/u);
  assert.match(source.version_or_date, /Question 2025-03-04; answer 2025-03-05/u);
  assert.equal(source.url, 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=311009');
  assert.match(source.coverage, /question concerns 빛.*quoted rule examples/su);
  assert.match(source.integration_status, /not the question target/u);
  assert.match(source.limitations_or_next_action, /Item-level KOGL marking remains unverified/u);
});

test('없는, 국물, and 옷이 remain linked to the exact official source with unchanged outputs', () => {
  const expected = [
    ['없는', '엄는', 'ʌːm|nɯn', 'ом|нин'],
    ['국물', '궁물', 'kuŋ|mul', 'кун|мул'],
    ['옷이', '오시', 'o|ɕi', 'о|ші'],
  ];
  for (const [input, surface, ipa, target] of expected) {
    const row = byInput(input);
    assert.ok(row, input);
    assert.equal(row.source_url, source.url, input);
    assert.equal(row.surface_hangul, surface, input);
    assert.equal(row.ipa_syllables, ipa, input);
    assert.equal(row.target_syllables, target, input);
    assert.match(row.rule_notes, /quoted official-rule example, not the question target/u, input);
  }
  assert.match(byInput('국물').rule_notes, /coda ㄱ nasalizes before ㅁ/u);
  assert.doesNotMatch(byInput('국물').rule_notes, /nasalizes before ㄹ/u);
  assert.match(byInput('없는').rule_notes, /Preserve vowel length in IPA/u);
  assert.match(report, /not the primary target of the Q&A question/u);
});

test('batch 21 records its historical backlog while later reviews can proceed', () => {
  assert.equal(source.review_status, 'direct_attestation_with_rule_instrument_scope_note_2026-10-22');
  assert.match(report, /36\/60/);
  assert.match(report, /22 direct target-form \/ official-rule-example attestations, 9 partial, 5 contextual-example-only/u);
  assert.match(report, /24.*20 Q&A\/FAQ pages, one Korean Basic Dictionary entry, and three NIKL-hosted PDFs/su);
  assert.match(report, /21.*20 Q&A\/FAQ \+ one dictionary entry/su);
  assert.match(readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-20-2026-10-22.md', import.meta.url), 'utf8'), /35\/60/);
});
