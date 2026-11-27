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

test('word-medial /h/ uses vowel-conditioned voiced allophones while word-initial /h/ stays voiceless', () => {
  assert.equal(extended('아하').layers.narrow.ipa, 'a.ɦa');
  assert.equal(extended('아히').layers.narrow.ipa, 'a.ʝi');
  assert.equal(extended('으흐').layers.narrow.ipa, 'ɯ.ɣɯ');
  assert.equal(extended('오호').layers.narrow.ipa, 'o.βo');
  assert.equal(extended('하').layers.narrow.ipa, 'ha');
  assert.equal(extended('히').layers.narrow.ipa, 'çi');
  assert.equal(extended('후').layers.narrow.ipa, 'ɸʷu');
  const initialRounded = extended('후').trace.find(item => item.source === '후' && item.layer === 'narrow');
  assert.ok(initialRounded.rule_ids.includes('narrow-h-rounded-allophone'));
  assert.ok(initialRounded.evidence_refs.some(ref => ref.includes('CBO9781139342858.006')));
  assert.equal(extended('호').layers.narrow.ipa, 'ɸʷo');
  assert.equal(extended('흐').layers.narrow.ipa, 'xɯ');
  assert.equal(extended('아후').layers.narrow.ipa, 'a.βu');
  assert.equal(extended('아 후').layers.narrow.ipa, 'a ɸʷu');
  const h = extended('아히').trace.find(item => item.source === '히' && item.layer === 'narrow');
  assert.ok(h.rule_ids.includes('narrow-h-intervocalic-allophone'));
  assert.ok(h.evidence_refs.some(ref => ref.includes('CBO9781139342858.006')));
});

test('post-sonorant /h/ retains place coarticulation but does not force voicing', () => {
  const result = extended('감히');
  assert.equal(result.layers.narrow.ipa, 'kam.çi');
  const h = result.trace.find(item => item.source === '히' && item.layer === 'narrow');
  assert.ok(h.rule_ids.includes('narrow-h-palatal-allophone'));
  assert.ok(h.rule_ids.includes('narrow-h-sonorant-variation-unresolved'));
  assert.match(h.environment, /weakening\/voicing\/deletion remains variable/);
});

test('narrow /h/ and liquid assimilation remain explicitly context-bound', () => {
  assert.equal(extended('아하').layers.narrow.ipa, 'a.ɦa');
  assert.equal(extended('나라').layers.narrow.ipa, 'na.ɾa');
  assert.equal(extended('다리').layers.narrow.ipa, 'ta.ɾi');
  assert.equal(extended('물론').layers.narrow.ipa, 'mul.lon');
  const liquidVariant = extended('나라').variants.find(item => item.layer === 'narrow' && item.ipa === 'na.ɭa');
  assert.ok(liquidVariant);
  assert.equal(liquidVariant.selected, false);
  assert.equal(liquidVariant.evidence_status, 'conflicting-source-descriptions-variant-only');
  assert.equal(liquidVariant.evidence_refs.length, 2);
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


test('browser exposes coda retroflexion as an unselected speaker-conditioned variant', () => {
  const result = extended('팔');
  assert.equal(result.layers.narrow.ipa, 'pʰal');
  const variant = result.variants.find(item => item.layer === 'narrow' && item.ipa === 'pʰaɭ');
  assert.ok(variant);
  assert.equal(variant.selected, false);
  assert.equal(variant.evidence_status, 'speaker-conditioned-sociophonetic-variant-only');
  assert.ok(variant.evidence_refs.some(ref => ref.includes('10.20405/kl.2024.02.102.63')));
  assert.match(variant.environment, /word-final coda ㄹ/);
});


test('browser exposes an unselected preconsonantal coda retroflex variant', () => {
  const result = extended('물론');
  assert.equal(result.layers.narrow.ipa, 'mul.lon');
  const variant = result.variants.find(item => item.layer === 'narrow' && item.ipa === 'muɭ.lon');
  assert.ok(variant);
  assert.equal(variant.selected, false);
  assert.equal(variant.evidence_status, 'speaker-conditioned-sociophonetic-variant-only');
  assert.match(variant.environment, /before same-word consonant/);

  const preH = extended('말하');
  assert.equal(preH.layers.narrow.ipa, 'mal.ha');
  const preHVariant = preH.variants.find(item => item.layer === 'narrow' && item.ipa === 'maɭ.ha');
  assert.ok(preHVariant);
  assert.equal(preHVariant.selected, false);
  assert.match(preHVariant.environment, /before same-word onset ㅎ/);
});


test('browser exposes an unselected coarticulatory palatalization candidate for geminate /l/ before /i/', () => {
  const result = extended('빨리');
  assert.equal(result.layers.narrow.ipa, 'p͈al.li');
  const variant = result.variants.find(item => item.layer === 'narrow' && item.ipa === 'p͈al.lʲi');
  assert.ok(variant);
  assert.equal(variant.selected, false);
  assert.equal(variant.evidence_status, 'gradient-coarticulation-candidate-variant-only');
  assert.ok(variant.evidence_refs.some(ref => ref.includes('10.3765/plsa.v6i1.5002')));
});


test('coda /n/ before alveopalatal affricates exposes optional palatal candidates without changing primary IPA', () => {
  const result = extended('군주');
  assert.equal(result.layers.narrow.ipa, 'kun.dʑu');
  const palatal = result.variants.find(item => item.layer === 'narrow' && item.ipa === 'kuɲ.dʑu');
  const palatalized = result.variants.find(item => item.layer === 'narrow' && item.ipa === 'kunʲ.dʑu');
  assert.ok(palatal);
  assert.ok(palatalized);
  assert.equal(palatal.selected, false);
  assert.equal(palatalized.selected, false);
  assert.equal(palatal.evidence_status, 'secondary-description-candidate-only');
  assert.equal(palatalized.evidence_status, 'secondary-description-candidate-only');
  assert.ok(palatal.evidence_refs.some(ref => ref.includes('1324541')));
});
