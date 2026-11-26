import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';
import { buildExtendedIpaResult, validateExtendedIpaResult } from '../src/app/extended_ipa.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);
const extended = source => buildExtendedIpaResult(source, engine.convert(source));

test('Extended IPA contract exposes separate layers without changing the default Ukrainian target', () => {
  const result = extended('시');
  assert.deepEqual(validateExtendedIpaResult(result), []);
  assert.equal(result.layers.phonemic.ipa, null);
  assert.equal(result.layers.phonemic.status, 'not-implemented-in-browser-runtime');
  assert.equal(result.layers.broad.ipa, 'ɕi');
  assert.equal(result.layers.narrow.ipa, 'ɕʰi');
  assert.equal(result.layers.narrow.status, 'partial-research-only');
  assert.equal(result.layers.narrow.target_compatible, false);
  assert.equal(result.target_adapter.status, 'not-run-for-extended-profile');
  assert.equal(result.context.speaker_id, null);
  assert.equal(result.context.dialect, null);
  assert.deepEqual(result.acoustic_annotations, []);
});

test('narrow /s/ and /n/ retain the currently source-scoped contextual restrictions', () => {
  assert.equal(extended('사').layers.narrow.ipa, 'sʰa');
  assert.equal(extended('시').layers.narrow.ipa, 'ɕʰi');
  assert.equal(extended('쇼').layers.narrow.ipa, 'sʰjo');
  assert.equal(extended('녀').layers.narrow.ipa, 'ɲjʌ');
  assert.equal(extended('니').layers.narrow.ipa, 'ni');
});

test('post-sonorant /h/ is not forced to a categorical [ɦ] realization', () => {
  const result = extended('안하');
  assert.equal(result.layers.narrow.ipa, 'an.ha');
  const h = result.trace.find(item => item.source === '하');
  assert.ok(h.rule_ids.includes('narrow-h-sonorant-variation-unresolved'));
  assert.match(h.evidence_status, /speaker-and-dialect-variable/);
});

test('narrow /h/ and lateral realizations remain explicitly context-bound', () => {
  assert.equal(extended('아하').layers.narrow.ipa, 'a.ɸa');
  assert.equal(extended('나라').layers.narrow.ipa, 'na.ɭa');
  assert.equal(extended('하').layers.narrow.ipa, 'ha');
});

test('punctuation and word boundaries are preserved and prevent cross-word allophones', () => {
  assert.equal(extended('아 하').layers.narrow.ipa, 'a ha');
  assert.equal(extended('아,하').layers.narrow.ipa, 'a,ha');
  assert.ok(extended('아 하').boundaries.some(item => item.kind === 'word'));
});

test('unsupported or unresolved IPA remains empty rather than being fabricated', () => {
  const result = extended('짧은소리의');
  assert.equal(result.layers.narrow.ipa, '');
  assert.equal(result.pronunciation_status, 'unresolved');
});

test('narrow profile trace records rule IDs, environments and source evidence', () => {
  const result = extended('시');
  const sibilant = result.trace.find(item => item.source === '시');
  assert.ok(sibilant.rule_ids.includes('narrow-lenis-sibilant-place'));
  assert.match(sibilant.environment, /ㅣ/);
  assert.ok(sibilant.evidence_refs.some(ref => ref.includes('10.17959')));
});

test('text-only browser results never invent speaker metadata or acoustic measurements', () => {
  const result = extended('시');
  assert.equal(result.context.speaker_id, null);
  assert.equal(result.context.dialect, null);
  assert.equal(result.context.prosodic_position, null);
  assert.deepEqual(result.acoustic_annotations, []);
});
