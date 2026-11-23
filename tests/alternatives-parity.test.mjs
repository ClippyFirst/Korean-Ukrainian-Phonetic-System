import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

// Snapshot of primary output before alternatives field existed (must not change)
const PRIMARY_SNAPSHOTS = {
  '사람': { ipa: 'sa.ɾam', ukrainian: 'сарам' },
  '한국어': { ipa: 'han.ɡu.ɡʌ', ukrainian: 'ганґуґо' },
  '주의': { ipa: 'tɕu.ɰi', ukrainian: 'чуий' },
};

test('primary IPA and Ukrainian remain byte-identical for ordinary words', () => {
  for (const [input, expected] of Object.entries(PRIMARY_SNAPSHOTS)) {
    const r = engine.convert(input, { morphologyMode: 'strict' });
    assert.equal(r.ipa, expected.ipa, `ipa changed for ${input}`);
    assert.equal(r.ukrainian, expected.ukrainian, `ukrainian changed for ${input}`);
  }
});

test('alternatives appear only for norm-printed variants and have required shape', () => {
  const r = engine.convert('주의', { morphologyMode: 'strict' });
  assert.ok(Array.isArray(r.alternatives));
  assert.ok(r.alternatives.length >= 1);
  const a = r.alternatives[0];
  assert.equal(a.kind, 'normative-permitted');
  assert.ok(a.surface_hangul);
  assert.ok(a.ipa);
  assert.ok(a.rule_ref);
  assert.ok(a.source);
});

test('ordinary words have empty alternatives array', () => {
  const r = engine.convert('사람', { morphologyMode: 'strict' });
  assert.deepEqual(r.alternatives, []);
});
