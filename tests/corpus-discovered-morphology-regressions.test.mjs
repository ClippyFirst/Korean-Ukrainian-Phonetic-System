import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

test('corpus-discovered directly attested morphology has sourced and regression-locked readings', () => {
  const expected = {
    많이: ['마니','мані','maː ni'],
    밝게: ['발께','палке','pal k͈e'],
    붙이다: ['부치다','пучіда','pu tɕʰi da'],
    낱낱이: ['난나치','нанначі','nanː na tɕʰi']
  };
  const rows = parseCsv(lexical);
  for (const [word, [surface, target, ipa]] of Object.entries(expected)) {
    const entry = rows.find((row) => row.input === word);
    assert.ok(entry, word + ': lexical entry exists');
    assert.match(entry.source_url, /^https:\/\/(?:(?:www\.|m\.)?korean\.go\.kr)\//u, word + ': official NIKL source');
    assert.equal(entry.confidence, 'high', word + ': evidence confidence');
    assert.equal(entry.target_status, 'provisional', word + ': Ukrainian target remains provisional');
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, surface, word + ': standard surface form');
    assert.equal(result.ukrainian, target, word + ': Ukrainian approximation');
    assert.equal(result.ipa, ipa, word + ': IPA');
    assert.equal(result.status, 'lexical-review', word + ': target review status');
    assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word + ': lexical evidence used');
    assert.ok(!result.ukrainian.includes('⟦'), word + ': no unresolved placeholder');
  }
});
