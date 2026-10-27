import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

test('exact-form R002 teacher-triage cases resolve identically in browser engine', () => {
  const expected = {
    '가없이': '가업씨',
    '말없이': '말업씨',
    '수없이': '수업씨',
    '늙은이': '늘그니',
  };
  for (const [input, surface] of Object.entries(expected)) {
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, surface, input);
  }
});

test('exact-form R003 deletion is followed by R002 nasal resyllabification', () => {
  const result = engine.convert('많아지다');
  assert.equal(result.surfaceHangul, '마나지다');
});

test('similar-looking unlicensed ㅎ-coda form remains fail-closed', () => {
  const result = engine.convert('많아보이다');
  assert.notEqual(result.surfaceHangul, '마나보이다');
});
