import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';
import { buildExtendedIpaResult, validateExtendedIpaResult } from '../src/app/extended_ipa.js';
import { phonemicIpaFromHangul } from '../src/app/phonemic_ipa.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);
const extended = source => buildExtendedIpaResult(source, engine.convert(source, { morphologyMode: 'strict', ipaProfile: 'clippyfirst-korean-broad-v1' }), phonemicIpaFromHangul(source));

test('Extended IPA contract exposes separate layers without changing the default Ukrainian target', () => {
  const result = extended('시');
  assert.deepEqual(validateExtendedIpaResult(result), []);
  assert.equal(result.layers.phonemic.ipa, 'si');
  assert.equal(result.layers.phonemic.status, 'underlying-phonemic-grapheme-derived');
  assert.equal(result.layers.phonemic.profile_id, 'clippyfirst-korean-phonemic-v1');
  assert.equal(result.layers.broad.ipa, 'si');
  const sibilantVariant = result.variants.find(item => item.ipa === 'ɕi');
  assert.ok(sibilantVariant, 'the source-scoped [ɕ] realization remains available as an optional variant');
  assert.equal(sibilantVariant.selected, false);
  assert.deepEqual(sibilantVariant.source_span, { start: 0, end: 1 });
  assert.match(sibilantVariant.environment, /Kang 2010/);
  const multiwordVariant = extended('나 시').variants.find(item => /Kang 2010/.test(item.environment));
  assert.ok(multiwordVariant);
  assert.equal(multiwordVariant.source_span, null, 'token-local indices must not be misattributed to another word');
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
  const h = result.trace.find(item => item.source === '하' && item.layer === 'narrow');
  assert.ok(h.rule_ids.includes('narrow-h-sonorant-variation-unresolved'));
  assert.match(h.evidence_status, /speaker-and-dialect-variable/);
});

test('high-front [ç] realization retains the separate post-sonorant variation trace', () => {
  const result = extended('감히');
  assert.equal(result.layers.narrow.ipa, 'kam.çi');
  const h = result.trace.find(item => item.source === '히' && item.layer === 'narrow');
  assert.ok(h.rule_ids.includes('narrow-h-palatal-allophone'));
  assert.ok(h.rule_ids.includes('narrow-h-sonorant-variation-unresolved'));
});

test('narrow /h/ and liquid assimilation remain explicitly context-bound', () => {
  assert.equal(extended('아하').layers.narrow.ipa, 'a.ɸa');
  assert.equal(extended('나라').layers.narrow.ipa, 'na.ɾa');
  assert.equal(extended('다리').layers.narrow.ipa, 'ta.ɾi');
  assert.equal(extended('물론').layers.narrow.ipa, 'mul.lon');
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
  const sibilant = result.trace.find(item => item.source === '시' && item.layer === 'narrow');
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
test('browser Extended IPA matches its side of the runtime comparison fixtures', () => {
  const fixture = JSON.parse(readFileSync(new URL('./fixtures/extended_ipa_parity.json', import.meta.url), 'utf8'));
  for (const item of fixture.cases) {
    const result = extended(item.source);
    assert.equal(result.layers.phonemic.ipa, item.browser.phonemic, item.source + ' phonemic');
    assert.equal(result.layers.broad.ipa, item.browser.broad, item.source + ' broad');
    assert.equal(result.layers.narrow.ipa, item.browser.narrow, item.source + ' narrow');
    const differences = ['phonemic','broad','narrow'].filter(layer => item.python[layer] !== item.browser[layer]);
    assert.deepEqual(differences, item.known_differences, item.source + ' documented runtime differences');
  }
});
test('browser phonemic adapter counts Unicode code points and abstains on unsupported characters', () => {
  const result = phonemicIpaFromHangul('시😀');
  assert.equal(result.ipa, null);
  assert.deepEqual(result.trace[1].source_span, { start: 1, end: 2 });
});

test('browser phonemic adapter preserves underlying codas rather than neutralizing them', () => {
  assert.equal(phonemicIpaFromHangul('시').ipa, 'si');
  assert.equal(phonemicIpaFromHangul('값').ipa, 'kaps');
  assert.equal(phonemicIpaFromHangul('안하').ipa, 'an.ha');
  assert.equal(phonemicIpaFromHangul('시 나').ipa, 'si na');
  assert.equal(phonemicIpaFromHangul('시!').ipa, 'si!');
  assert.equal(phonemicIpaFromHangul('유사성').ipa, 'juː.sa.sʌŋ');
});
