import test from 'node:test';
import assert from 'node:assert/strict';
import {
  compareRows, scoreLayer, summarize
} from '../scripts/benchmark_extended_ipa_ab.mjs';
import {
  createBrowserKozakKimEngine, evaluateRows
} from '../scripts/benchmark_kozak_kim_browser.mjs';

const rows = [{
  id: 'paired-fixture-001',
  lang: 'ko',
  split: 'test',
  tokens: [{ canonical: '시', phoneme: 'si' }]
}];

test('standard IPA and Extended broad are scored on identical paired occurrences', () => {
  const engine = createBrowserKozakKimEngine();
  const standard = evaluateRows(rows, engine, 'strict', 'fixture standard', 'fixture');
  const extendedBroad = scoreLayer(rows, engine, 'broad', 'fixture');
  assert.deepEqual(compareRows(standard, extendedBroad), {
    paired_occurrences: 1,
    prediction_differences: 0,
    status_differences: 0,
    identical_by_contract: true
  });
  assert.equal(summarize(standard).exact_match_rate, 1);
  assert.equal(summarize(extendedBroad).exact_match_rate, 1);
});

test('phonemic and narrow layers are independently surfaced, not conflated with broad', () => {
  const engine = createBrowserKozakKimEngine();
  const phonemic = scoreLayer(rows, engine, 'phonemic', 'fixture');
  const narrow = scoreLayer(rows, engine, 'narrow', 'fixture');
  assert.equal(phonemic.records[0].predicted, 'si');
  assert.equal(narrow.records[0].predicted, 'ɕʰi');
  assert.equal(phonemic.scored_tokens, 1);
  assert.equal(narrow.scored_tokens, 1);
});
