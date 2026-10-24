import test from 'node:test';
import assert from 'node:assert/strict';
import { traceIpaMapping, ipaSyllableToUkrainian } from '../src/app/engine_ipa.js';

test('IPA target trace explicitly reports aspiration, fortisness, and unreleased stops lost in Ukrainian spelling', () => {
  const cases = [
    { ipa: 'kʰa', feature: 'aspiration', marker: 'ʰ', target: 'ка' },
    { ipa: 't͈a', feature: 'fortisness', marker: '͈', target: 'та' },
    { ipa: 'p̚a', feature: 'unreleased-stop', marker: '̚', target: 'па' },
    { ipa: 't͡ɕʰi', feature: 'aspiration', marker: 'ʰ', target: 'чі' },
    { ipa: 't͡ɕ͈i', feature: 'fortisness', marker: '͈', target: 'чі' },
  ];

  for (const sample of cases) {
    const trace = traceIpaMapping(sample.ipa);
    assert.equal(trace.unknown, '', sample.ipa);
    assert.equal(ipaSyllableToUkrainian(sample.ipa).text, sample.target, sample.ipa);
    assert.ok(trace.tokens.some(token => token.ipa.includes(sample.marker)), sample.ipa + ': preserve marked IPA token');
    const feature = trace.features.find(item => item.feature === sample.feature);
    assert.ok(feature, sample.ipa + ': missing explicit target-layer feature record');
    assert.equal(feature.ipa, trace.tokens.find(token => token.ipa.includes(sample.marker)).ipa);
    assert.equal(feature.handling, 'not-encoded-in-ukrainian-target');
    assert.match(feature.note, /збережена в IPA/u);
  }
});

test('feature accounting does not normalize or rewrite the IPA input', () => {
  const ipa = 't͡ɕʰa k͈ɯ p̚';
  const trace = traceIpaMapping(ipa);
  assert.deepEqual(trace.tokens.map(token => token.ipa), ['t͡ɕʰ', 'a', 'k͈', 'ɯ', 'p̚']);
  assert.deepEqual(
    trace.features.map(feature => feature.feature),
    ['aspiration', 'fortisness', 'unreleased-stop']
  );
  assert.equal(trace.unknown, '');
});
