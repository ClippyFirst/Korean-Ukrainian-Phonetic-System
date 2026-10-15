import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

function hasHangulInIpa(ipa) {
  return /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(ipa || '');
}

test('bare jamo is not treated as Korean pronunciation', () => {
  for (const input of ['ㄺ', 'ㅎ', 'ㄷ', 'ㄺkwa', 'ㄷi']) {
    const r = engine.convert(input);
    assert.equal(r.status, 'unresolved', input);
    assert.equal(hasHangulInIpa(r.ipa), false, input + ' IPA must not contain Hangul/jamo');
    assert.ok((r.issues || []).some((x) => /jamo|syllable/i.test(x)), input);
  }
});

test('Hangul syllable + Latin residue does not leak Latin into IPA', () => {
  const r = engine.convert('의nin');
  assert.equal(hasHangulInIpa(r.ipa), false);
  assert.match(r.ipa, /ɰi/);
  assert.doesNotMatch(r.ipa, /nin/);
  assert.doesNotMatch(r.analysis, /nin/);
  // Latin may remain visible in the Ukrainian passthrough column.
  assert.match(r.ukrainian, /nin/);
});

test('ordinary Korean remains free of residual Hangul in IPA', () => {
  for (const input of ['넋이', '읽고', '독립문', '신라']) {
    const r = engine.convert(input);
    assert.equal(hasHangulInIpa(r.ipa), false, input);
    assert.ok(r.ukrainian.length > 0, input);
  }
});

test('soft morphology changes analysis on unlisted formal candidate 삶이', () => {
  const strict = engine.convert('삶이', { morphologyMode: 'strict' });
  const soft = engine.convert('삶이', { morphologyMode: 'soft' });
  assert.equal(strict.status, 'unresolved');
  assert.equal(soft.status, 'heuristic-low-confidence');
  assert.ok(soft.ukrainian.length > 0);
  assert.ok((soft.trace || []).some((t) => (t.rules || []).some((rule) => /soft-heuristic/.test(rule))));
});

test('soft does not override exact lexical 넋이', () => {
  const strict = engine.convert('넋이', { morphologyMode: 'strict' });
  const soft = engine.convert('넋이', { morphologyMode: 'soft' });
  assert.equal(strict.ukrainian, soft.ukrainian);
  assert.equal(strict.ipa, soft.ipa);
  assert.ok(!(soft.trace || []).some((t) => (t.rules || []).some((rule) => /soft-heuristic/.test(rule))));
});

test('non-Korean-only input is explicitly classified', () => {
  const r = engine.convert('latin 123');
  assert.equal(r.status, 'non-korean-input');
  assert.doesNotMatch(r.ipa, /latin|123/i);
  assert.ok((r.issues || []).some((x) => /no Hangul syllable/i.test(x)));
});
