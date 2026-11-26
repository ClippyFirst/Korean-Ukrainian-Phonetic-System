import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

// NIKL §29 붙임 1: 할 일[할릴]. The inserted ㄴ after a ㄹ coda is realized as ㄹ,
// and ㄹ following a realized ㄹ coda is the lateral [l] (as in 잘 입다 → [lip̚]),
// not the intervocalic flap. The Python runtime already yields `hal lil`.
const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, '');

test('§29 phrase insertion: 할 일 realizes the inserted ㄹ as lateral [l]', () => {
  const result = engine.convert('할 일');
  assert.equal(result.surfaceHangul, '할 릴');
  assert.equal(result.ipa, 'hal lil');
  // Same environment, other exact §29 example with ㄹ insertion after -ㄹ.
  assert.equal(engine.convert('먹을 엿').ipa, 'mʌ.ɡɯl ljʌt̚');
});

test('lateral realization is limited to the exact §29 phrase insertion', () => {
  // Negative controls: an unlicensed phrase with the same shape gets no insertion,
  // and an ordinary ㄹ onset after a vowel stays a flap.
  assert.ok(!engine.convert('할 말').trace.some((t) => t.rules.includes('phrase-n-insertion-§29')));
  assert.equal(engine.convert('아리').ipa, 'a.ɾi');
});
