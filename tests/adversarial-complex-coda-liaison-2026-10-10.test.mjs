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

test('NIKL dictionary conjugations preserve the ㄼ coda alternation in 넓다 and 짧다', () => {
  const expected = {
    '넓어': { surface: '널버', ipa: 'nʌl bʌ' },
    '넓으니': { surface: '널브니', ipa: 'nʌl bɯ ni' },
    '넓은': { surface: '널븐', ipa: 'nʌl bɯn' },
    '넓습니다': { surface: '널씀니다', ipa: 'nʌl s͈ɯm ni da' },
    '넓지': { surface: '널찌', ipa: 'nʌl tɕ͈i' },
    '짧아': { surface: '짤바', ipa: 'tɕ͈al ba' },
    '짧으니': { surface: '짤브니', ipa: 'tɕ͈al bɯ ni' },
  };
  for (const [input, want] of Object.entries(expected)) {
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, want.surface, input + ': NIKL standard surface');
    assert.equal(result.ipa, want.ipa, input + ': broad IPA');
    assert.ok(!result.ukrainian.includes('⟦'), input + ': no unresolved placeholder');
  }
});
