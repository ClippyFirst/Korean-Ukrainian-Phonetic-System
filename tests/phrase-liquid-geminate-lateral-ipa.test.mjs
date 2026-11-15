import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

// ㄹ coda + ㄹ onset across a connected-phrase boundary is the geminate lateral
// [l.l] (NIKL §20; the official phrase example 할 일[할릴] is the same [l l]
// sequence). The browser already realizes the ㄴ|ㄹ phrase case as lateral, and
// Python realizes any onset ㄹ after a realized ㄹ coda as [l]; only the
// ㄹ|ㄹ whitespace case fell through to the intervocalic flap.
const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, '');
// Production loads the lexicon; lexical words are converted as separate segments
// and the phrase pass (not the generic path) must supply the cross-boundary lateral.
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const lexicalEngine = createEngine(canonical, lexical);

test('ㄹ|ㄹ across a phrase boundary is a lateral, not a flap', () => {
  assert.equal(engine.convert('밭을 리본').ipa, 'pa.tʰɯl li.bon');
  assert.equal(engine.convert('발 나무').ipa, 'pal la.mu'); // ㄹ|ㄴ assimilates to ㄹ|ㄹ, same lateral
});

test('negative controls: no ㄹ coda, no phrase boundary, or no ㄹ onset keeps the existing realization', () => {
  assert.equal(engine.convert('가다 리본').ipa, 'ka.da ɾi.bon');
  assert.equal(engine.convert('아리').ipa, 'a.ɾi');
  assert.equal(engine.convert('밭을 나무').ipa, 'pa.tʰɯl la.mu'); // already lateral; must not regress
  assert.equal(engine.convert('발,리본').ipa.includes('ɾi.bon'), true); // punctuation blocks the phrase proxy
});

test('lexical-split segments also realize the lateral across the boundary', () => {
  assert.equal(lexicalEngine.convert('밭을 리본').ipa, 'pa.tʰɯl li.bon');
  assert.equal(lexicalEngine.convert('가다 리본').ipa, 'ka.da ɾi.bon');
});
