import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

// NIKL Standard Pronunciation Rules §29, attached note 1: ㄴ after ㄹ is realized as ㄹ.
test('NIKL §29 attached-note liquid assimilation examples have exact Korean surface forms', () => {
  const expected = {
    '들일': '들릴',
    '솔잎': '솔립',
    '설익다': '설릭따',
    '물약': '물략',
    '불여우': '불려우',
    '물엿': '물렫',
    '휘발유': '휘발류',
    '유들유들': '유들류들',
  };
  for (const [input, surface] of Object.entries(expected)) {
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, surface, input + ': NIKL standard surface');
    assert.ok(!result.ukrainian.includes('⟦'), input + ': no unresolved placeholder');
  }
});
