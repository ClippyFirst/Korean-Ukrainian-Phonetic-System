import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

// NIKL Q&A 316101: 값있다 [가빋따], 값있는 [가빈는], and 곧이어 [고디어].
// NIKL Q&A 279931: 음용 [으묭], despite the phonological environment that can invite ㄴ insertion.
test('NIKL §29 negative and exceptional cases do not receive blanket ㄴ insertion', () => {
  const expected = {
    '값있다': { surface: '가빋따', ipa: 'ka bit̚ t͈a' },
    '곧이어': { surface: '고디어', ipa: 'ko di ʌ' },
    '음용': { surface: '으묭', ipa: 'ɯ mjoŋ' },
  };
  for (const [input, want] of Object.entries(expected)) {
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, want.surface, input + ': NIKL standard surface');
    assert.equal(result.ipa, want.ipa, input + ': broad IPA');
    assert.ok(!result.ukrainian.includes('⟦'), input + ': no unresolved placeholder');
  }
});
