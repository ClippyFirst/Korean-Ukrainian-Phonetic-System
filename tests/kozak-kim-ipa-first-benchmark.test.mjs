import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  createBrowserKozakKimEngine,
  editDistance,
  evaluateRows,
  normalizeIpa,
  normalizeIpaBroadCandidate
} from '../scripts/benchmark_kozak_kim_browser.mjs';

test('IPA normalization and edit distance match the Python benchmark contract', () => {
  assert.equal(normalizeIpa('kɡa.ɾɯn'), 'kɡaɾɯn');
  assert.equal(normalizeIpa('t͡ɕʰi'), 'tɕʰi');
  assert.equal(editDistance('kʰa', 'kʰa'), 0);
  assert.equal(editDistance('kʰa', 'k͈a'), 1);
});

test('broad candidate IPA normalization collapses documented allophones but preserves contrasts', () => {
  assert.equal(normalizeIpaBroadCandidate('ˈsʰa̠ːk͈ʌn'), 'saːk͈ʌn');
  assert.equal(normalizeIpaBroadCandidate('ɭɲɦçxɸβʝɣ'), 'lnhhhhhhh');
  assert.equal(normalizeIpaBroadCandidate('ɥi'), 'ɥi');
  assert.equal(normalizeIpaBroadCandidate('ɥa'), 'ɥa');
  assert.equal(normalizeIpaBroadCandidate('sʰɕʰʃʰ'), 'sɕʃ');
  assert.equal(normalizeIpaBroadCandidate('pʰtʰkʰk͈aːt̚'), 'pʰtʰkʰk͈aːt̚');
});

test('benchmark scores resolved IPA even when Ukrainian target mapping is unavailable', () => {
  const rows = [{
    id: 'synthetic',
    lang: 'ko',
    split: 'test',
    tokens: [{ canonical: '가', phoneme: 'kʰa' }]
  }];
  const engine = {
    convert: () => ({
      ipa: 'kʰa',
      pronunciation_status: 'resolved',
      target_status: 'unavailable',
      ukrainian: '',
      status: 'unresolved'
    })
  };

  const report = evaluateRows(rows, engine);

  assert.equal(report.scored_tokens, 1);
  assert.equal(report.exact_matches, 1);
  assert.equal(report.target_unavailable_tokens, 1);
  assert.equal(report.unresolved_tokens, 0);
});

test('Kozak Kim preserves inspectable IPA when only Ukrainian target mapping is unavailable', () => {
  const engine = createBrowserKozakKimEngine();
  const result = engine.convert('의');

  assert.equal(result.pronunciation_status, 'resolved');
  assert.equal(result.ipa, 'ɰi');
  assert.equal(result.ukrainian, '');
  assert.ok(['unavailable', 'provisional'].includes(result.target_status));
});

test('NIKL-backed Sino-Korean fortition stays lexical and preserves optional variants', () => {
  const engine = createBrowserKozakKimEngine();
  const incident = engine.convert('사건');
  assert.equal(incident.pronunciation_status, 'resolved');
  assert.equal(incident.surfaceHangul, '사껀');
  assert.equal(incident.ipa, 'saː.k͈ʌn');
  assert.equal(incident.target_status, 'provisional');
  assert.equal(incident.ukrainian, '');
  assert.ok(incident.candidate_ukrainian);

  const popularity = engine.convert('인기');
  assert.equal(popularity.pronunciation_status, 'resolved');
  assert.equal(popularity.surfaceHangul, '인끼');
  assert.equal(popularity.ipa, 'in.k͈i');
  assert.equal(popularity.target_status, 'provisional');
  assert.equal(popularity.variants.length, 1);
  assert.equal(popularity.variants[0].surface, '인기');
  assert.equal(popularity.variants[0].ipa, 'in.ɡi');
});

test('broad candidate benchmark distinguishes transcription convention from engine error', () => {
  const rows = [{
    id: 'nikl-fortition',
    lang: 'ko',
    split: 'test',
    tokens: [
      { canonical: '사건', phoneme: 'ˈsʰa̠ːk͈ʌn' },
      { canonical: '인기', phoneme: 'ink͈i' }
    ]
  }];
  const report = evaluateRows(rows, createBrowserKozakKimEngine());
  assert.equal(report.scored_tokens, 2);
  assert.equal(report.exact_matches, 1);
  assert.equal(report.broad_candidate_exact_matches, 2);
});

test('NIKL-backed 실수 improves broad IPA agreement without rewriting strict gold conventions', () => {
  const rows = [{
    id: 'nikl-silsoo',
    lang: 'ko',
    split: 'test',
    tokens: [{ canonical: '실수', phoneme: 'ɕʰiɭs͈u' }]
  }];
  const report = evaluateRows(rows, createBrowserKozakKimEngine());
  assert.equal(report.scored_tokens, 1);
  assert.equal(report.exact_matches, 0);
  assert.equal(report.broad_candidate_exact_matches, 1);
});

test('dictionary-backed 한자 reduces strict IPA edit distance while retaining lexical length', () => {
  const rows = [{
    id: 'krdict-hanja',
    lang: 'ko',
    split: 'test',
    tokens: [{ canonical: '한자', phoneme: 'hantɕ͈a' }]
  }];
  const report = evaluateRows(rows, createBrowserKozakKimEngine());
  assert.equal(report.scored_tokens, 1);
  assert.equal(report.exact_matches, 0);
  assert.equal(report.records[0].distance, 1);
});

test('Kozak Kim still withholds IPA for unlicensed Korean morphophonology', () => {
  const engine = createBrowserKozakKimEngine();
  const result = engine.convert('읽게');

  assert.equal(result.pronunciation_status, 'unresolved');
  assert.equal(result.ipa, '');
  assert.equal(result.ukrainian, '');
});
