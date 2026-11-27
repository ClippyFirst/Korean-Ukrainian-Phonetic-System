import test from 'node:test';
import assert from 'node:assert/strict';
import { parseIpaSegments } from '../src/app/ipa_segments.js';

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
