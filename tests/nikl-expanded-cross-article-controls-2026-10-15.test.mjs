import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/normative-gold-seed-2026-10-15.json', import.meta.url), 'utf8'));
const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);
const expandedIds = new Set([
  'NIKL-13-EXP-01',
  'NIKL-13-EXP-02',
  'NIKL-13-EXP-03',
  'NIKL-13-EXP-04',
  'NIKL-13-EXP-05',
  'NIKL-13-EXP-06',
  'NIKL-14-EXP-01',
  'NIKL-14-EXP-02',
  'NIKL-14-EXP-03',
  'NIKL-15-EXP-01',
  'NIKL-15-EXP-02',
  'NIKL-15-EXP-03',
  'NIKL-15-EXP-04',
  'NIKL-15-EXP-05',
  'NIKL-17-EXP-01',
  'NIKL-17-EXP-02',
  'NIKL-17-EXP-03',
  'NIKL-17-EXP-04',
  'NIKL-17-EXP-05',
  'NIKL-17-EXP-06',
  'NIKL-17-EXP-07',
  'NIKL-18-EXP-01',
  'NIKL-18-EXP-02',
  'NIKL-18-EXP-03',
  'NIKL-18-EXP-04',
  'NIKL-18-EXP-05',
  'NIKL-18-EXP-06',
  'NIKL-18-EXP-07',
  'NIKL-18-EXP-08',
  'NIKL-18-EXP-09',
  'NIKL-18-EXP-10',
  'NIKL-18-EXP-11',
  'NIKL-18-EXP-12',
  'NIKL-18-EXP-13',
  'NIKL-18-EXP-14',
  'NIKL-18-EXP-15',
  'NIKL-18-EXP-16',
  'NIKL-18-EXP-17',
  'NIKL-18-EXP-18',
  'NIKL-18-EXP-19',
  'NIKL-18-EXP-20',
  'NIKL-21-EXP-01',
  'NIKL-21-EXP-02',
  'NIKL-21-EXP-03',
  'NIKL-21-EXP-04',
  'NIKL-21-EXP-05',
  'NIKL-21-EXP-06',
  'NIKL-21-EXP-07',
  'NIKL-23-EXP-01',
  'NIKL-23-EXP-02',
  'NIKL-23-EXP-03',
  'NIKL-23-EXP-04',
  'NIKL-23-EXP-05',
  'NIKL-23-EXP-06',
  'NIKL-23-EXP-07',
  'NIKL-30-EXP-01',
  'NIKL-30-EXP-02',
  'NIKL-30-EXP-03',
  'NIKL-30-EXP-04',
  'NIKL-30-EXP-05',
  'NIKL-30-EXP-06',
  'NIKL-30-EXP-07',
  'NIKL-30-EXP-08',
  'NIKL-30-EXP-09',
  'NIKL-30-EXP-10',
  'NIKL-30-EXP-11',
  'NIKL-30-EXP-12',
  'NIKL-30-EXP-13',
  'NIKL-30-EXP-14',
  'NIKL-30-EXP-15',
  'NIKL-30-EXP-16',
  'NIKL-30-EXP-17',
  'NIKL-30-EXP-18',
]);

test('expanded NIKL examples from §§13–30 match sourced surfaces and declared project IPA', () => {
  assert.ok(expandedIds.size >= 30, 'expanded cross-article control list must remain substantial');
  const byId = new Map(fixture.cases.map(item => [item.id, item]));
  for (const id of expandedIds) {
    const item = byId.get(id);
    assert.ok(item, id + ': fixture case is missing');
    const result = engine.convert(item.input);
    assert.ok(item.expectedSurfaceForms.includes(result.surfaceHangul),
      id + ': expected surface ' + item.expectedSurfaceForms.join('|') + ', got ' + result.surfaceHangul);
    assert.ok(item.expectedProjectIpa.includes(result.ipa),
      id + ': expected project IPA ' + item.expectedProjectIpa.join('|') + ', got ' + result.ipa);
    assert.ok(!result.issues?.length, id + ': unexpected issues: ' + JSON.stringify(result.issues));
  }
});
