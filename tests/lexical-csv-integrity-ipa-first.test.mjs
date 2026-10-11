import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);
const engine = createEngine(canonical, lexicalText);
const allowedStatuses = new Set(['model-selected', 'provisional', 'surface-only']);

test('lexical CSV stays structurally valid and every row has an explicit target status', () => {
  assert.ok(rows.length >= 600, 'unexpectedly small lexical inventory; CSV parsing may have stopped early');
  for (const row of rows) {
    assert.ok(row.input, 'empty lexical input');
    assert.ok(row.surface_hangul, row.input + ': missing Korean surface form');
    assert.ok(row.ipa_syllables, row.input + ': missing IPA');
    assert.ok(allowedStatuses.has(row.target_status), row.input + ': invalid target_status "' + row.target_status + '"');
    assert.ok(row.source_url, row.input + ': missing pronunciation source');
  }
});

test('every Hangul-only lexical target is rendered from its stored IPA, not independently from spelling', () => {
  const candidates = rows.filter(row =>
    /^[가-힣]+$/u.test(row.input) &&
    row.target_status !== 'surface-only'
  );
  assert.ok(candidates.length >= 600, 'expected broad coverage of exact Hangul lexical entries');

  for (const row of candidates) {
    const result = engine.convert(row.input);
    assert.equal(result.ipa, row.ipa_syllables.split('|').join(' '), row.input + ': runtime IPA');
    assert.equal(
      result.ukrainian,
      row.target_syllables.split('|').join(''),
      row.input + ': Ukrainian target must equal the IPA-derived mapping',
    );
    assert.equal(result.issues.length, 0, row.input + ': exact sourced entry should not have an unresolved issue');
  }
});
