import test from 'node:test';
import assert from 'node:assert/strict';
import { traceIpaMapping, ipaSyllableToUkrainian } from '../src/app/engine_ipa.js';
import { parseCsv } from '../src/app/engine.js';
import { readFileSync } from 'node:fs';

const lexicalCsv = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');

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


test('every mapped lexical IPA token with a target-neutralized feature has a corresponding trace record', () => {
  const featureByMarker = new Map([
    ['ʰ', 'aspiration'],
    ['͈', 'fortisness'],
    ['̚', 'unreleased-stop'],
  ]);
  let covered = 0;
  for (const row of parseCsv(lexicalCsv)) {
    for (const syllable of (row.ipa_syllables || '').split('|').filter(Boolean)) {
      const trace = traceIpaMapping(syllable);
      assert.equal(trace.unknown, '', row.input + ': lexical IPA must remain mappable');
      for (const token of trace.tokens) {
        for (const [marker, featureName] of featureByMarker) {
          if (!token.ipa.includes(marker)) continue;
          assert.ok(
            trace.features.some(feature => feature.ipa === token.ipa && feature.feature === featureName),
            row.input + ' / ' + token.ipa + ': missing ' + featureName + ' target-loss record'
          );
          covered++;
        }
      }
    }
  }
  assert.ok(covered > 0, 'the lexical inventory should contain target-neutralized features');
});
