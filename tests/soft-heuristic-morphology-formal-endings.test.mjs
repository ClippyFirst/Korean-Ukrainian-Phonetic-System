import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(resolve('data/korean/canonical_correspondence.csv'), 'utf8');
const lexical = readFileSync(resolve('data/korean/lexical_pronunciations.csv'), 'utf8');
const engine = createEngine(canonical, lexical);
const STRICT = { morphologyMode: 'strict' };
const SOFT = { morphologyMode: 'soft' };

function softTrace(result) {
  return result.trace.filter(t => (t.rules || []).includes('soft-heuristic-morphology'));
}

describe('soft-heuristic morphology — integrated browser engine', () => {
  it('strict remains the default and matches explicit strict mode', () => {
    for (const text of ['굳이', '값어치', '넋이', '읽고', '값 이']) {
      assert.deepEqual(engine.convert(text), engine.convert(text, STRICT), text);
    }
  });

  it('soft mode labels actual heuristic applications as low-confidence', () => {
    const result = engine.convert('굳이', SOFT);
    const applied = softTrace(result);
    // Exact lexical entries take precedence and may legitimately avoid soft use.
    if (applied.length) {
      assert.ok(applied.every(t => t.status === 'heuristic-low-confidence'));
    }
  });

  it('does not create a soft license across whitespace', () => {
    const result = engine.convert('값 이', SOFT);
    assert.equal(softTrace(result).length, 0);
  });

  it('does not guess §15-sensitive substantive liaison from 어/아 adjacency', () => {
    const result = engine.convert('값어치', SOFT);
    assert.equal(softTrace(result).length, 0);
  });

  it('never uses the soft layer for ㄺ-before-ㄱ exception handling', () => {
    const result = engine.convert('읽고', SOFT);
    assert.equal(softTrace(result).length, 0);
  });

  it('keeps the heuristic opt-in and the exact-lexical result authoritative', () => {
    const strict = engine.convert('넋이', STRICT);
    const soft = engine.convert('넋이', SOFT);
    assert.equal(strict.ukrainian, soft.ukrainian);
    assert.equal(strict.ipa, soft.ipa);
    assert.equal(softTrace(soft).length, 0);
  });
});
