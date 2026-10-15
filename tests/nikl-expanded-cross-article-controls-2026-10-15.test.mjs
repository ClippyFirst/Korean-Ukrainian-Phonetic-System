import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/normative-gold-seed-2026-10-15.json', import.meta.url), 'utf8'));
const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);
const expandedIds = new Set([
  // Filled by the shared seed expansion; explicit IDs prevent this test from
  // accidentally claiming coverage of unrelated legacy controls.
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
