import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexicalText);

// Diagnostic snapshot only: these are the browser's current legacy IPA strings,
// NOT independently adjudicated pronunciation gold or a claim of Python parity.
// Keep the mismatch visible until a versioned cross-runtime profile is approved.
test('browser legacy sibilant IPA baseline remains inspectable pending profile adjudication', () => {
  const cases = [
    ['싸', 's͈a'],
    ['씨', 'ɕ͈i'],
    ['시', 'ɕi'],
    ['쇼', 'ɕjo'],
    ['쌰', 'ɕ͈ja'],
  ];
  for (const [source, expectedIpa] of cases) {
    assert.equal(engine.convert(source).ipa, expectedIpa, source);
  }
});
