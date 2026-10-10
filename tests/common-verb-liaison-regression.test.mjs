import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);
const entries = new Map(parseCsv(lexical).map((row) => [row.input, row]));

test('common verb forms with morphologically licensed ㅆ liaison use exact standard readings', () => {
  const expected = {
    '었어': ['어써', 'осо', 'ʌ s͈ʌ'],
    '갔어': ['가써', 'касо', 'ka s͈ʌ'],
    '갔어요': ['가써요', 'касо йо', 'ka s͈ʌ jo'],
    '있어요': ['이써요', 'ісо йо', 'i s͈ʌ jo'],
    '있습니다': ['읻씀니다', 'ітсимніда', 'it̚ s͈ɯm ni da'],
  };
  for (const [word, [surface, target, ipa]] of Object.entries(expected)) {
    const entry = entries.get(word);
    assert.ok(entry, 'missing lexical entry: ' + word);
    assert.equal(entry.surface_hangul, surface, word);
    assert.equal(entry.target_status, 'provisional', word);
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, surface, word);
    assert.equal(result.ukrainian, target.replaceAll(' ', ''), word);
    assert.equal(result.ipa, ipa, word);
    assert.equal(result.status, 'lexical-review', word);
    assert.deepEqual(result.issues, [], word);
  }
});

test('the previously unresolved sequence reads without coda-morphology placeholders', () => {
  const result = engine.convert('읽을 수 있습니다');
  assert.equal(result.issues.length, 0);
  assert.ok(!result.ukrainian.includes('⟦'));
  assert.ok(result.ukrainian.includes('ітсимніда'));
  assert.ok(result.surfaceHangul === '');
});
