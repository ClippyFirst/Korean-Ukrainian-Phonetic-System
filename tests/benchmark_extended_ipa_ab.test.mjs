import test from 'node:test';
import assert from 'node:assert/strict';
import { createBrowserKozakKimEngine } from '../scripts/benchmark_kozak_kim_browser.mjs';
import { summarizeNarrowVariants } from '../scripts/benchmark_extended_ipa_ab.mjs';

test('Narrow variant diagnostics count candidate coverage without scoring candidates as accuracy', () => {
  const rows = [{
    id: 'narrow-variant-contexts',
    tokens: [
      { canonical: '빨리', phoneme: 'p͈al.li' },
      { canonical: '물론', phoneme: 'mul.lon' },
      { canonical: '팔', phoneme: 'pʰal' },
      { canonical: '말하', phoneme: 'mal.ha' }
    ]
  }];
  const report = summarizeNarrowVariants(rows, createBrowserKozakKimEngine());
  assert.equal(report.eligible_tokens, 4);
  assert.ok(report.tokens_with_variants >= 4);
  assert.ok(report.total_variant_candidates >= 4);
  assert.equal(report.selected_variant_candidates, 0);
  assert.equal(report.by_environment['geminate lateral before high-front vocoid /i,j/'], 1);
  assert.ok(report.by_environment['coda ㄹ before same-word consonant'] >= 1);
  assert.equal(report.by_environment['word-final coda ㄹ'], 1);
  assert.equal(report.by_environment['coda ㄹ before same-word onset ㅎ'], 1);
  assert.match(report.interpretation, /not scored as correct\/incorrect/);
  assert.ok(report.examples.every(item => item.selected === false));
});
