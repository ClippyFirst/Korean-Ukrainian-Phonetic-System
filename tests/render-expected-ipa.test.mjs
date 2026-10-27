import test from 'node:test';
import assert from 'node:assert/strict';
import { parseIpaSyllables, renderExpectedIpa } from './render-expected-ipa.mjs';

test('IPA token parser accepts source pipes and rendered dots without changing segment order', () => {
  assert.deepEqual(parseIpaSyllables('ka|bʌp̚|t͈a'), ['ka', 'bʌp̚', 't͈a']);
  assert.deepEqual(parseIpaSyllables('ka.bʌp̚.t͈a'), ['ka', 'bʌp̚', 't͈a']);
});

test('expected IPA rendering inserts dots within eojeols and preserves source spaces', () => {
  assert.equal(renderExpectedIpa('3 연대', ['sam', 'ɲʌn', 'dɛ']), 'sam ɲʌn.dɛ');
  assert.equal(renderExpectedIpa('3·1절', ['sa', 'mil', 'tɕ͈ʌl']), 'sa.mil.tɕ͈ʌl');
  assert.equal(renderExpectedIpa('밭 아래', ['pa', 'ta', 'ɾɛ']), 'pa ta.ɾɛ');
  assert.equal(renderExpectedIpa('민주주의 의의', ['min', 'dʑu', 'dʑu', 'ɰi', 'ɰi', 'ɰi']), 'min.dʑu.dʑu.ɰi ɰi.ɰi');
});
