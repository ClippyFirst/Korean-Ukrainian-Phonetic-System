import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

// Source: NIKL Q&A 311728 (2025-03-21), Standard Pronunciation Rules §§10, 23, 29.
test('additional NIKL examples expose compound boundaries and coda exceptions', () => {
  const expected = {
    '밭이랑': { surface: '반니랑', ipa: 'pan ni ɾaŋ' },
    '집안일': { surface: '지반닐', ipa: 'tɕi ban nil' },
    '공업용': { surface: '공엄뇽', ipa: 'koŋ ʌm njoŋ' },
    '얇실하다': { surface: '얄씰하다', ipa: 'jal s͈il ha da' },
    '밭갈이': { surface: '받까리', ipa: 'pat̚ k͈a ɾi' },
    '값지다': { surface: '갑찌다', ipa: 'kap̚ tɕ͈i da' },
    '짧다': { surface: '짤따', ipa: 'tɕ͈al t͈a' },
    '삶다': { surface: '삼따', ipa: 'samː t͈a' },
    '읽거든': { surface: '일꺼든', ipa: 'il k͈ʌ dɯn' },
  };
  for (const [input, want] of Object.entries(expected)) {
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, want.surface, input + ': NIKL standard surface');
    assert.equal(result.ipa, want.ipa, input + ': broad IPA');
    assert.ok(!result.ukrainian.includes('⟦'), input + ': no unresolved placeholder');
  }
});
