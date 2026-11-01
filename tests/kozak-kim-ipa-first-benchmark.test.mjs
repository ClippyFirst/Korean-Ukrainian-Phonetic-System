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
  assert.equal(normalizeIpaBroadCandidate('ɭɲɦçxɸβʝ'), 'lnhhhhhh');
  assert.equal(normalizeIpaBroadCandidate('sʰɕʰʃʰ'), 'sɕʃ');
  assert.equal(normalizeIpaBroadCandidate('pʰtʰkʰk͈aːt̚'), 'pʰtʰk͈aːt̚');
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

test('Kozak Kim still withholds IPA for unlicensed Korean morphophonology', () => {
  const engine = createBrowserKozakKimEngine();
  const result = engine.convert('읽게');

  assert.equal(result.pronunciation_status, 'unresolved');
  assert.equal(result.ipa, '');
  assert.equal(result.ukrainian, '');
});
