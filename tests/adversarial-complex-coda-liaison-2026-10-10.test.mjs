import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

// NIKL §14 official examples, repeated in NIKL Q&A 325622; 몫이 is confirmed by Q&A 335008.
test('NIKL complex-coda liaison examples resolve without morphological guessing', () => {
  const expected = {
    '앉아': { surface: '안자', ipa: 'an dʑa' },
    '곬이': { surface: '골씨', ipa: 'kol s͈i' },
    '핥아': { surface: '할타', ipa: 'hal tʰa' },
    '읊어': { surface: '을퍼', ipa: 'ɯl pʰʌ' },
    '몫이': { surface: '목씨', ipa: 'mok̚ s͈i' },
  };
  for (const [input, want] of Object.entries(expected)) {
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, want.surface, input + ': NIKL standard surface');
    assert.equal(result.ipa, want.ipa, input + ': broad IPA');
    assert.ok(!result.ukrainian.includes('⟦'), input + ': no unresolved placeholder');
  }
});
