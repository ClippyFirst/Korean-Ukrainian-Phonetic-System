import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const fixture = JSON.parse(readFileSync(
  new URL('./fixtures/normative-gold-seed-2026-10-15.json', import.meta.url), 'utf8',
));
const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

test('normative seed fixture has unique IDs, source provenance, and explicit uncertainty policy', () => {
  assert.equal(fixture.schemaVersion, 1);
  assert.match(fixture.normativeSource.url, /^https:\/\//);
  assert.match(fixture.ukrainianTargetPolicy, /excluded from normative gold labels/i);
  assert.ok(fixture.cases.length >= 10, 'seed set should contain at least ten independently addressable controls');
  const ids = fixture.cases.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length, 'case IDs must be unique');
  for (const item of fixture.cases) {
    assert.ok(item.input, item.id + ': input is required');
    assert.ok(Array.isArray(item.expectedSurfaceForms) && item.expectedSurfaceForms.length, item.id + ': surface gold is required');
    assert.ok(Array.isArray(item.expectedProjectIpa) && item.expectedProjectIpa.length, item.id + ': project IPA target is required');
    assert.ok(Array.isArray(item.ruleIds) && item.ruleIds.length, item.id + ': rule IDs are required');
    assert.match(item.evidenceUrl, /^https:\/\//, item.id + ': evidence URL is required');
    assert.ok(item.evidenceNote, item.id + ': explain why this evidence applies');
    assert.equal(item.validationStatus, 'cross-linked-existing-regression',
      item.id + ': do not imply independent audit when only linked to an existing regression');
  }
});

test('source-linked seed cases match the declared Korean surface forms and project IPA', () => {
  for (const item of fixture.cases) {
    const result = engine.convert(item.input);
    assert.ok(item.expectedSurfaceForms.includes(result.surfaceHangul),
      item.id + ': expected one of ' + item.expectedSurfaceForms.join(' | ') + ', got ' + result.surfaceHangul);
    assert.ok(item.expectedProjectIpa.includes(result.ipa),
      item.id + ': expected one of ' + item.expectedProjectIpa.join(' | ') + ', got ' + result.ipa);
    assert.ok(!result.issues?.length, item.id + ': unexpected engine issues: ' + JSON.stringify(result.issues));
  }
});
