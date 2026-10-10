import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const directory = new URL('./fixtures/adversarial-corpora/', import.meta.url);
const files = readdirSync(directory).filter((name) => name.endsWith('.txt') && /^(?:0[1-9]|1[0-5])-/u.test(name)).sort();
const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

test('adversarial text corpus suite contains all topic-separated UTF-8 corpora', () => {
  assert.equal(files.length, 15, 'the suite must keep all 15 independent corpus files');
  const seen = new Set();
  for (const file of files) {
    const source = readFileSync(new URL('./fixtures/adversarial-corpora/' + file, import.meta.url), 'utf8');
    assert.ok(source.includes('\n'), file + ': must contain multiple lines');
    assert.ok((source.match(/[가-힣]/gu) || []).length >= 100, file + ': Korean text must be substantial');
    assert.ok(source.trim().length >= 500, file + ': corpus must not be a tiny sample');
    assert.ok(!seen.has(source), file + ': corpus content must be unique');
    seen.add(source);
  }
});

test('every adversarial corpus can be submitted to the engine without a runtime crash', () => {
  for (const file of files) {
    const source = readFileSync(new URL('./fixtures/adversarial-corpora/' + file, import.meta.url), 'utf8');
    const result = engine.convert(source);
    assert.ok(result && typeof result === 'object', file + ': conversion returns a result object');
    assert.equal(typeof result.ukrainian, 'string', file + ': conversion has a Ukrainian-output field');
    assert.equal(typeof result.surfaceHangul, 'string', file + ': conversion has a surface-Hangul field');
    assert.equal(typeof result.ipa, 'string', file + ': conversion has an IPA field');
    assert.ok(Array.isArray(result.issues), file + ': issues are exposed for triage');
    assert.ok(Array.isArray(result.trace), file + ': trace is exposed for triage');
  }
});
