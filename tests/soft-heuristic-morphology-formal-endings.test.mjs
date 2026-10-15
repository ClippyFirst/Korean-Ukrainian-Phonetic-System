/**
 * Real engine regressions for the opt-in soft morphology mode.
 *
 * Soft mode may only add low-confidence heuristic licenses where no exact
 * lexical pronunciation exists. Exact lexical entries always take priority.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

test('strict mode fails closed for an unlisted morphology candidate', () => {
  const result = engine.convert('삶이', { morphologyMode: 'strict' });
  assert.equal(result.status, 'unresolved');
  assert.equal(result.ipa, '');
});

test('soft mode marks an unlisted candidate as low-confidence', () => {
  const result = engine.convert('삶이', { morphologyMode: 'soft' });
  assert.equal(result.status, 'heuristic-low-confidence');
  assert.ok(result.ipa.length > 0);
  assert.ok(result.trace.some(item =>
    item.status === 'heuristic-low-confidence' ||
    (item.rules || []).some(rule => /soft-heuristic/u.test(rule))
  ));
});

test('soft mode does not override an exact lexical pronunciation', () => {
  const strict = engine.convert('넋이', { morphologyMode: 'strict' });
  const soft = engine.convert('넋이', { morphologyMode: 'soft' });
  assert.equal(soft.ipa, strict.ipa);
  assert.equal(soft.ukrainian, strict.ukrainian);
  assert.ok(!soft.trace.some(item => (item.rules || []).some(rule => /soft-heuristic/u.test(rule))));
});

test('soft mode never licenses across a whitespace boundary', () => {
  const result = engine.convert('값 이', { morphologyMode: 'soft' });
  assert.ok(!result.trace.some(item => (item.rules || []).some(rule => /soft-heuristic/u.test(rule))));
});

test('soft mode does not take credit for a lexical ㄺ-before-ㄱ form', () => {
  const result = engine.convert('읽고', { morphologyMode: 'soft' });
  assert.equal(result.ipa, 'il k͈o');
  assert.ok(!result.trace.some(item => (item.rules || []).some(rule => /soft-heuristic/u.test(rule))));
});
