import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { parseCsv } from '../src/app/engine.js';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/nikl-surface-only-complex-coda.json', import.meta.url), 'utf8'));
const lexical = parseCsv(readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8'));

test('surface-only NIKL evidence does not become invented IPA or Ukrainian gold', () => {
  assert.equal(fixture.cases.length, 1);
  const item = fixture.cases[0];
  assert.equal(item.input, '긁고');
  assert.equal(item.attested_surface_hangul, '글꼬');
  assert.match(item.source.url, /^https:\/\/(www\.)?korean\.go\.kr\/front\/onlineQna\//u);
  assert.match(item.source.url, /qna_seq=328946/u);
  assert.equal(item.ipa_status, 'not_adjudicated');
  assert.equal(item.ipa_candidate, null);
  assert.equal(item.ukrainian_target_status, 'not_reviewed');
  assert.equal(item.ukrainian_target, null);
  assert.equal(item.python_pipeline_expected_status, 'unresolved');
  assert.equal(lexical.some(row => row.input === item.input), false,
    'surface-only evidence must not enter the lexical IPA/target table');
});
