import test from 'node:test';
import assert from 'node:assert/strict';
import { parseIpaSegments } from '../src/app/ipa_segments.js';
import { createEngine } from '../src/app/engine.js';
import { buildExtendedIpaResult } from '../src/app/extended_ipa.js';
import { phonemicIpaFromHangul } from '../src/app/phonemic_ipa.js';
import { readFileSync } from 'node:fs';
const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

test('segment IR recognizes extended Korean IPA consonants and feature bundles', () => {
  const result = parseIpaSegments('sʰ.kʰ ɦ ɲ ɭ ɸ ç x');
  const segments = result.filter(item => item.kind === 'segment');
  assert.deepEqual(segments.map(item => item.ipa), ['sʰ','kʰ','ɦ','ɲ','ɭ','ɸ','ç','x']);
  assert.equal(segments[0].features.aspiration, 'aspirated');
  assert.equal(segments[1].features.place, 'velar');
  assert.equal(segments[2].features.voicing, 'voiced');
  assert.equal(segments[3].features.place, 'palatal');
  assert.equal(segments[5].features.manner, 'fricative');
});

test('segment IR treats affricates atomically and retains vowel length', () => {
  const segments = parseIpaSegments('tɕʰiː').filter(item => item.kind === 'segment');
  assert.deepEqual(segments.map(item => item.ipa), ['tɕʰ','iː']);
  assert.equal(segments[0].base, 'tɕ');
  assert.equal(segments[0].features.manner, 'affricate');
  assert.equal(segments[0].features.aspiration, 'aspirated');
  assert.equal(segments[1].features.length, 'long');
});

test('segment IR preserves syllable source spans and rule provenance explicitly', () => {
  const [segment, boundary, unknown] = parseIpaSegments('ɲ.a ?', {
    sourceSpan: { start: 4, end: 5 },
    provenance: { ruleIds: ['narrow-nasal-palatalization'], evidenceRefs: ['SRC-1'] }
  });
  assert.deepEqual(segment.source_span, { start: 4, end: 5 });
  assert.equal(segment.source_alignment, 'syllable-span');
  assert.deepEqual(segment.provenance.rule_ids, ['narrow-nasal-palatalization']);
  assert.equal(boundary.kind, 'boundary');
  assert.equal(unknown.kind, 'unknown');
  assert.equal(unknown.ipa, '?');
});

test('browser Extended IPA attaches segment IR and source spans to every layer', () => {
  const source = '녀';
  const result = buildExtendedIpaResult(source, engine.convert(source, { morphologyMode: 'strict', ipaProfile: 'clippyfirst-korean-broad-v1' }), phonemicIpaFromHangul(source));
  assert.ok(result.layers.phonemic.segments.length > 0);
  assert.ok(result.layers.broad.segments.length > 0);
  assert.ok(result.layers.narrow.segments.length > 0);
  const nasal = result.layers.narrow.segments.find(item => item.ipa === 'ɲ');
  assert.deepEqual(nasal.source_span, { start: 0, end: 1 });
  assert.equal(nasal.source_alignment, 'syllable-span');
  assert.ok(nasal.provenance.rule_ids.includes('narrow-nasal-palatalization'));
});

test('engine emits expanded aspiration and contextual allophones in the correct layer', () => {
  const layer = (source, level) => {
    const result = buildExtendedIpaResult(source, engine.convert(source, { morphologyMode: 'strict', ipaProfile: 'clippyfirst-korean-broad-v1' }), phonemicIpaFromHangul(source));
    return result.layers[level].ipa;
  };
  assert.equal(layer('코','broad'),'kʰo');
  assert.equal(layer('사','narrow'),'sʰa');
  assert.equal(layer('녀','narrow'),'ɲjʌ');
  assert.equal(layer('나라','narrow'),'na.ɭa');
  assert.equal(layer('아하','narrow'),'a.ɸa');
  assert.equal(layer('히','narrow'),'çi');
  assert.equal(layer('후','narrow'),'xu');
  assert.ok(!layer('안하','narrow').includes('ɦ'));
});

test('segment IR handles tied affricates and combining vowel diacritics', () => {
  const segments = parseIpaSegments('t͡ɕʰ ãː').filter(item => item.kind === 'segment');
  assert.deepEqual(segments.map(item => item.ipa), ['t͡ɕʰ','ãː']);
  assert.equal(segments[0].base, 'tɕ');
  assert.equal(segments[0].features.aspiration, 'aspirated');
  assert.equal(segments[1].features.nasalization, 'nasalized');
  assert.equal(segments[1].features.length, 'long');
});
