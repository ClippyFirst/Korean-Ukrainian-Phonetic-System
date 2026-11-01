import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  createOriginalG2pKBrowserEngine,
  evaluateRows
} from '../scripts/benchmark_kozak_kim_vs_g2pk_browser.mjs';
import { createBrowserKozakKimEngine } from '../scripts/benchmark_kozak_kim_browser.mjs';

test('paired browser benchmark compares Kozak Kim with the untouched raw g2pK surface', () => {
  const g2pCalls = [];
  const engine = {
    convert(input) {
      const ipa = { 가: 'ka', 나: 'na', 다: 'na', 라: 'ɾa' }[input];
      return {
        ipa,
        pronunciation_status: 'resolved',
        surfaceHangul: '',
        target_status: 'unavailable'
      };
    },
    convertSurface(surface) {
      const ipa = { 가: 'ka', 다: 'ta', 라: 'la' }[surface];
      return { ipa, pronunciation_status: 'resolved' };
    }
  };
  const rawG2pK = {
    convert(input, options) {
      g2pCalls.push({ input, options });
      return { 가: '가', 나: '다', 다: '다', 라: '라' }[input];
    }
  };
  const rows = [{
    id: 'paired-fixture',
    lang: 'ko',
    split: 'test',
    tokens: [
      { canonical: '가', phoneme: 'ka' },
      { canonical: '나', phoneme: 'na' },
      { canonical: '다', phoneme: 'ta' },
      { canonical: '라', phoneme: 'ɾa,la' }
    ]
  }];

  const report = evaluateRows(rows, engine, rawG2pK);

  assert.equal(report.paired_subset.tokens_scored_by_both, 4);
  assert.equal(report.paired_subset.kozak_kim_only_exact, 1);
  assert.equal(report.paired_subset.g2pk_only_exact, 1);
  assert.equal(report.paired_subset.both_exact, 2);
  assert.equal(report.paired_subset.both_wrong, 0);
  assert.equal(report.paired_subset.tokens_with_shared_best_gold, 3);
  assert.equal(report.paired_subset.tokens_without_shared_best_gold, 1);
  assert.equal(report.paired_subset.kozak_kim.exact_matches, 3);
  assert.equal(report.paired_subset.g2pk.exact_matches, 3);
  assert.equal(report.kozak_kim.character_error_rate, 0.125);
  assert.equal(report.g2pk.character_error_rate, 0.125);
  assert.equal(report.paired_subset.kozak_kim.character_error_rate, 1 / 6);
  assert.equal(report.paired_subset.g2pk.character_error_rate, 1 / 6);
  assert.deepEqual(report.paired_subset.sentence_cluster_bootstrap.exact_match_delta_95_ci, [0, 0]);
  assert.deepEqual(report.paired_subset.sentence_cluster_bootstrap.cer_delta_95_ci, [0, 0]);
  assert.equal(report.paired_subset.sentence_cluster_bootstrap.cluster_count, 1);
  assert.equal(report.paired_subset.sentence_cluster_bootstrap.resamples, 2000);
  assert.equal(report.records.find(item => item.token === '나').g2pk_surface, '다');
  assert.equal(report.records.find(item => item.token === '나').kozak_kim.exact, true);
  assert.equal(report.records.find(item => item.token === '나').g2pk.exact, false);
  assert.deepEqual(g2pCalls[0], {
    input: '가',
    options: { descriptive: false, verbose: false, groupVowels: false, toSyl: true }
  });
});

test('paired benchmark keeps unresolved Kozak Kim cases out of the shared denominator', () => {
  const engine = {
    convert(input) {
      return input === '마'
        ? { ipa: '', pronunciation_status: 'unresolved' }
        : { ipa: 'ka', pronunciation_status: 'resolved' };
    },
    convertSurface() {
      return { ipa: 'ka', pronunciation_status: 'resolved' };
    }
  };
  const rawG2pK = { convert: () => '가' };
  const report = evaluateRows([{
    id: 'coverage-fixture',
    lang: 'ko',
    split: 'test',
    tokens: [
      { canonical: '가', phoneme: 'ka' },
      { canonical: '마', phoneme: 'ma' }
    ]
  }], engine, rawG2pK);

  assert.equal(report.attempted_tokens, 2);
  assert.equal(report.kozak_kim.unresolved_tokens, 1);
  assert.equal(report.g2pk.scored_tokens, 2);
  assert.equal(report.paired_subset.tokens_scored_by_both, 1);
  assert.equal(report.paired_subset.coverage_against_eligible, 0.5);
});

test('paired benchmark rejects malformed raw g2pK surfaces without changing the baseline output', () => {
  const engine = {
    convert: () => ({ ipa: 'ka', pronunciation_status: 'resolved' }),
    convertSurface: () => ({ ipa: 'ka', pronunciation_status: 'resolved' })
  };
  const rawG2pK = { convert: () => '가API' };
  const report = evaluateRows([{
    id: 'malformed-fixture',
    lang: 'ko',
    split: 'test',
    tokens: [{ canonical: '가', phoneme: 'ka' }]
  }], engine, rawG2pK);

  assert.equal(report.g2pk.engine_errors, 1);
  assert.equal(report.paired_subset.tokens_scored_by_both, 0);
  assert.equal(report.records[0].g2pk_error, 'g2pK output is not a single Hangul token');
});

test('source-backed ㄼ and ㄺ exceptions distinguish Kozak Kim from the untouched raw g2pK port', () => {
  const kozakKim = createBrowserKozakKimEngine();
  const originalG2pK = createOriginalG2pKBrowserEngine();
  const cases = [
    { input: '넓죽하다', expected: '넙쭈카다' },
    { input: '읽고', expected: '일꼬' }
  ];

  for (const item of cases) {
    const ours = kozakKim.convert(item.input, { morphologyMode: 'strict' });
    const original = originalG2pK.convert(item.input, {
      descriptive: false, verbose: false, groupVowels: false, toSyl: true
    });
    assert.equal(ours.surfaceHangul, item.expected, item.input + ' Kozak Kim surface');
    assert.notEqual(original, item.expected, item.input + ' raw g2pK must remain an independent baseline');
  }
});
