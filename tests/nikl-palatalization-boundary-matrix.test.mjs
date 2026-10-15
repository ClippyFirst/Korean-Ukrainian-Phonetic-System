import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const genericEngine = createEngine(canonical, '');

test('§17 spelling-only ㄷ/ㅌ/ㄾ + 이 does not trigger unlicensed palatalization', () => {
  for (const input of ['갇이', '같이', '갍이']) {
    const result = genericEngine.convert(input);
    assert.ok(
      result.ukrainian.includes('⟦') || result.issues.length > 0 || result.status === 'unresolved',
      input + ': require a licensed formal morpheme or exact lexical evidence',
    );
    assert.ok(
      result.trace.some((item) => item.rules.includes('palatalization-requires-lexical-morphology')),
      input + ': the reason for withholding the reading must be traceable',
    );
    assert.ok(
      !result.trace.some((item) => item.rules.includes('palatalization')),
      input + ': do not apply the transformation before licensing is established',
    );
  }
});

test('§17 does not generalize palatalization from ㅣ to every j-glide vowel', () => {
  for (const input of ['갇야', '갇여', '갇예', '갇요', '갇유', '갇의', '갇에']) {
    const result = genericEngine.convert(input);
    assert.ok(
      !result.trace.some((item) => item.rules.includes('palatalization') || item.rules.includes('palatalization-requires-lexical-morphology')),
      input + ': this environment is not the §17 ㅣ trigger',
    );
  }
});

test('§12 + §17 keeps the documented ㄷ+ㅎ+ㅣ chain distinct from bare ㄷ+ㅣ', () => {
  const aspirated = genericEngine.convert('갇히');
  assert.ok(aspirated.trace.some((item) => item.rules.includes('h-aspiration-plus-palatalization')));
  assert.ok(!aspirated.trace.some((item) => item.rules.includes('palatalization-requires-lexical-morphology')));
  const bare = genericEngine.convert('갇이');
  assert.ok(bare.trace.some((item) => item.rules.includes('palatalization-requires-lexical-morphology')));
});

test('§17 and §18 compose for the official 팥입니다[파침니다] control without a lexical bypass', () => {
  const result = genericEngine.convert('팥입니다');
  // The generic engine intentionally omits a Korean surface spelling when no
  // lexical surface reference is supplied; verify its IPA and rule trace here.
  assert.equal(result.ipa, 'pʰa tɕʰim ni da');
  assert.equal(result.ukrainian, 'пачімніда');
  assert.ok(result.trace.some((item) => item.rules.includes('palatalization')),
    'the sourced formal-morpheme license must activate §17');
  assert.ok(result.trace.some((item) => item.rules.includes('nasal-assimilation')),
    'ㅂ before ㄴ must be nasalized after palatalization');
  assert.deepEqual(result.issues, []);
});
