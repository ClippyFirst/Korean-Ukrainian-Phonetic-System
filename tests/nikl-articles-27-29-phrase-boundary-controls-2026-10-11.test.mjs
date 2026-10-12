import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const genericEngine = createEngine(canonical, '');

const rules = (result) => result.trace.flatMap((entry) => entry.rules ?? []);

test('§27: adnominal fortition is licensed only for the listed eojeol pairs', () => {
  const licensed = [
    ['할 것을', 'adnominal-r-fortition-§27'],
    ['갈 데가', 'adnominal-r-fortition-§27'],
    ['할 바를', 'adnominal-r-fortition-§27'],
    ['할 수는', 'adnominal-r-fortition-§27'],
    ['할 적에', 'adnominal-r-fortition-§27'],
    ['갈 곳', 'adnominal-r-fortition-§27'],
    ['할 도리', 'adnominal-r-fortition-§27'],
    ['만날 사람', 'adnominal-r-fortition-§27'],
  ];
  for (const [input, rule] of licensed) {
    const result = genericEngine.convert(input);
    assert.ok(rules(result).includes(rule), input + ': expected the exact phrase license');
  }
});

test('§27: punctuation blocks phrase-specific adnominal fortition', () => {
  const connected = genericEngine.convert('할 것을');
  const paused = genericEngine.convert('할, 것을');
  assert.ok(rules(connected).includes('adnominal-r-fortition-§27'));
  assert.ok(!rules(paused).includes('adnominal-r-fortition-§27'),
    'the exact eojeol-pair rule must not cross punctuation');
});

test('§29: exact phrase insertion examples are explicitly traced', () => {
  const licensed = [
    ['한 일', 'phrase-n-insertion-§29'],
    ['옷 입다', 'phrase-n-insertion-§29'],
    ['먹은 엿', 'phrase-n-insertion-§29'],
    ['할 일', 'phrase-n-insertion-§29'],
    ['잘 입다', 'phrase-n-insertion-§29'],
    ['먹을 엿', 'phrase-n-insertion-§29'],
  ];
  for (const [input, rule] of licensed) {
    const result = genericEngine.convert(input);
    assert.ok(rules(result).includes(rule), input + ': expected a source-backed phrase insertion');
  }
});

test('§29: insertion does not generalize from a similar-looking unlicensed phrase', () => {
  for (const input of ['한 옷', '할 옷', '잘 옷']) {
    const result = genericEngine.convert(input);
    assert.ok(!rules(result).includes('phrase-n-insertion-§29'),
      input + ': no pair-specific license exists for this phrase');
  }
});

test('§29: punctuation blocks phrase-specific n-insertion', () => {
  const connected = genericEngine.convert('한 일');
  const punctuated = genericEngine.convert('한, 일');
  assert.ok(rules(connected).includes('phrase-n-insertion-§29'));
  assert.ok(!rules(punctuated).includes('phrase-n-insertion-§29'),
    'n-insertion must not cross a punctuation boundary');
});

test('§29 negative controls remain distinct from the phrase insertion rule', () => {
  for (const input of ['등용문', '송별연']) {
    const result = genericEngine.convert(input);
    assert.ok(!rules(result).includes('phrase-n-insertion-§29'),
      input + ': the phrase-only insertion rule must not be used as a global n-insertion heuristic');
  }
});
