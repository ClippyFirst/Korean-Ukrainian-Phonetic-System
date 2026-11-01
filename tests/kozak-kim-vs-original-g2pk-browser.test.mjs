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

test('source-adjudicated contrasts distinguish genuine rule gains from annotation and variant effects', () => {
  const kozakKim = createBrowserKozakKimEngine();
  const originalG2pK = createOriginalG2pKBrowserEngine();
  const cases = [
    // NIKL §18 quotes 없는[엄ː는]: the user-generated gold omits length,
    // but the source-backed Kozak Kim reading must preserve it.
    { input: '없는', kkIpa: 'ʌːm.nɯn', g2pkSurface: '엄는', g2pkIpa: 'ʌm.nɯn' },
    // NIKL training material §24 gives 닮다[담따].
    { input: '닮다', kkIpa: 'tam.t͈a', g2pkSurface: '담다', g2pkIpa: 'tam.da' },
    // §24 applies to stem-final ㅁ before the ㄱ-initial ending -게.
    { input: '넘게', kkIpa: 'nʌm.k͈e', g2pkSurface: '넘게', g2pkIpa: 'nʌm.ɡe' },
    // NIKL records 인기[인끼], while its Q&A notes optional fortition:
    // this is a supported KK variant, not proof that every [인기] is wrong.
    { input: '인기', kkIpa: 'in.k͈i', g2pkSurface: '인기', g2pkIpa: 'in.ɡi' }
  ];

  for (const item of cases) {
    const ours = kozakKim.convert(item.input, { morphologyMode: 'strict' });
    const rawSurface = originalG2pK.convert(item.input, {
      descriptive: false, verbose: false, groupVowels: false, toSyl: true
    });
    const baseline = kozakKim.convertSurface(rawSurface, { morphologyMode: 'strict' });
    assert.equal(ours.ipa, item.kkIpa, item.input + ' Kozak Kim IPA');
    assert.equal(rawSurface, item.g2pkSurface, item.input + ' untouched g2pK surface');
    assert.equal(baseline.ipa, item.g2pkIpa, item.input + ' shared IPA rendering of g2pK surface');
  }
});

test('source-backed NIKL usage survey keeps both readings of 못 잃어 valid', () => {
  const kozakKim = createBrowserKozakKimEngine();
  const originalG2pK = createOriginalG2pKBrowserEngine();
  const acceptedSurfaces = new Set(['몬니러', '모시러']);
  const ours = kozakKim.convert('못잃어', { morphologyMode: 'strict' });
  const rawSurface = originalG2pK.convert('못잃어', {
    descriptive: false, verbose: false, groupVowels: false, toSyl: true
  });

  assert.equal(ours.surfaceHangul, '몬니러');
  assert.equal(rawSurface, '모시러');
  assert.ok(acceptedSurfaces.has(ours.surfaceHangul));
  assert.ok(acceptedSurfaces.has(rawSurface));
});
