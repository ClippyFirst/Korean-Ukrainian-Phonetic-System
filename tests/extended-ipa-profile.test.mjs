import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';
import { buildExtendedIpaResult, validateExtendedIpaResult } from '../src/app/extended_ipa.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);
const extended = source => buildExtendedIpaResult(source, engine.convert(source), engine.convert(source, { morphologyMode: 'super-soft' }));

test('Extended IPA contract exposes separate layers without changing the default Ukrainian target', () => {
  const result = extended('시');
  assert.deepEqual(validateExtendedIpaResult(result), []);
  assert.equal(result.layers.phonemic.ipa, 'si');
  assert.equal(result.layers.phonemic.status, 'underlying-grapheme-fallback-not-phonemic-gold');
  assert.equal(result.layers.phonemic.profile_id, 'browser-super-soft-grapheme-ipa-v1');
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

test('post-sonorant /h/ is unresolved variation while the default remains [h]', () => {
  const result = extended('안하');
  assert.equal(result.layers.narrow.ipa, 'an.ha');
  const h = result.trace.find(item => item.source === '하');
  assert.ok(h.rule_ids.includes('narrow-h-sonorant-variation-unresolved'));
  assert.match(h.evidence_status, /speaker-and-dialect-variable/);
});

test('high-front [ç] realization retains the separate post-sonorant variation trace', () => {
  const result = extended('감히');
  assert.equal(result.layers.narrow.ipa, 'kam.çi');
  const h = result.trace.find(item => item.source === '히');
  assert.ok(h.rule_ids.includes('narrow-h-palatal-allophone'));
  assert.ok(h.rule_ids.includes('narrow-h-sonorant-variation-unresolved'));
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
test('mixed text with an unresolved source span withholds the incomplete narrow string', () => {
  const result = extended('앞말 짧은소리의 뒷말.');
  assert.equal(result.layers.narrow.ipa, '');
  assert.equal(result.layers.narrow.status, 'diagnostic-only-unresolved-source');
  assert.ok(result.trace.some(item => item.status === 'unresolved'));
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
test('measured acoustic annotations require method, source and source-span provenance', () => {
  const result = extended('시');
  result.acoustic_annotations = [{
    feature: 'post_stop_f0', value: 185, unit: 'Hz',
    source_span: { start: 0, end: 1 },
    measurement_method: 'Praat autocorrelation; 50 ms window; 10 ms step',
    evidence_refs: ['https://doi.org/10.1371/journal.pone.0240682'],
    status: 'measured'
  }];
  assert.deepEqual(validateExtendedIpaResult(result), []);
});
test('browser Extended IPA matches the shared cross-runtime smoke fixtures', () => {
  const fixture = JSON.parse(readFileSync(new URL('./fixtures/extended_ipa_parity.json', import.meta.url), 'utf8'));
  for (const item of fixture.cases) {
    const result = extended(item.source);
    assert.equal(result.layers.phonemic.ipa, item.phonemic, item.source + ' phonemic');
    assert.equal(result.layers.broad.ipa, item.broad, item.source + ' broad');
    assert.equal(result.layers.narrow.ipa, item.narrow, item.source + ' narrow');
  }
});
test('browser source spans count Unicode code points rather than UTF-16 units', () => {
  const result = extended('😀시');
  const span = result.trace.find(item => item.source === '시').source_span;
  assert.deepEqual(span, { start: 1, end: 2 });
});
