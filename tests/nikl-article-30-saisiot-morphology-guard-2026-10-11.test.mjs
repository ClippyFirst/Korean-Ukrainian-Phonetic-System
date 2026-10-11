import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
// No lexical rows means no evidence that the written 사이시옷 belongs to a
// compound whose second element begins with 이 and requires §30(3) ㄴㄴ insertion.
const engine = createEngine(canonical, '');

test('§30(3) does not guess compound-internal ㄴㄴ insertion from spelling alone', () => {
  for (const input of ['깻잎', '나뭇잎', '베갯잇', '도리깻열']) {
    const result = engine.convert(input);
    assert.equal(result.status, 'unresolved', input + ': compound-specific §30(3) reading needs lexical evidence');
    assert.ok(result.issues.length > 0, input + ': uncertainty must be explicit');
    assert.ok(!result.trace.some((entry) => (entry.rules ?? []).includes('phrase-n-insertion-§29')),
      input + ': within-compound §30 insertion must not be mislabelled as phrase-boundary §29');
  }
});

test('§30(3) evidence distinguishes within-compound insertion from ordinary vowel liaison', () => {
  const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
  const sourcedEngine = createEngine(canonical, lexical);
  for (const [input, expectedSurface, expectedIpa] of [
    ['깻잎', '깬닙', 'kɛn nip̚'],
    ['나뭇잎', '나문닙', 'na mun nip̚'],
    ['베갯잇', '베갠닏', 'pe gɛn nit̚'],
    ['도리깻열', '도리깬녈', 'to ɾi gɛn ɲʌl'],
  ]) {
    const result = sourcedEngine.convert(input);
    assert.equal(result.surfaceHangul, expectedSurface, input);
    assert.equal(result.ipa, expectedIpa, input);
    assert.equal(result.status, 'lexical-review', input + ': IPA is sourced, Ukrainian target remains provisional');
  }
});
