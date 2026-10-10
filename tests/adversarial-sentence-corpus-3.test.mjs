import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const corpus = readFileSync(new URL('./fixtures/adversarial-sentence-corpus-3.txt', import.meta.url), 'utf8').trim();
const engine = createEngine(canonical, lexical);
const entries = new Map(parseCsv(lexical).map((row) => [row.input, row]));

test('third sentence-level adversarial corpus is present and contains no unresolved placeholders', () => {
  const sentences = corpus.split(/\n\s*\n/u);
  assert.equal(sentences.length, 9);
  assert.ok(corpus.includes('흙을 밟으며'));
  assert.ok(corpus.includes('독립문과 종로'));
  assert.ok(corpus.includes('우크라이나어 문자로'));
  for (const sentence of sentences) {
    const result = engine.convert(sentence);
    assert.ok(!result.ukrainian.includes('⟦'), sentence + ': unresolved Korean placeholder in ' + result.ukrainian);
    assert.ok(!result.ukrainian.includes('⟧'), sentence + ': unresolved Korean placeholder in ' + result.ukrainian);
  }
});

test('third-corpus high-risk lexical controls retain declared Korean surface forms', () => {
  const expected = {
    '국립국어원': '궁님꾸거원',
    '밭이': '바치',
    '꽃이': '꼬치',
    '값이': '갑씨',
    '꽃잎': '꼰닙',
    '같이': '가치',
    '굳이': '구지',
    '해돋이': '해도지',
    '끝이': '끄치',
    '옷이': '오시',
    '낮이': '나지',
    '앉아': '안자',
    '읽고': '일꼬',
    '읽는': '잉는',
    '읽지': '익찌',
    '읽습니다': '익씀니다',
  };
  for (const [word, surface] of Object.entries(expected)) {
    const row = entries.get(word);
    assert.ok(row, 'missing lexical row: ' + word);
    assert.equal(row.surface_hangul, surface, word + ': declared lexical surface');
    assert.equal(engine.convert(word).surfaceHangul, surface, word + ': engine surface');
  }
});
