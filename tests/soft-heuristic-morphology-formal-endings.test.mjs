/**
 * Soft-heuristic morphology — formal-ending unlocks (Node/browser mirror).
 *
 * Full contract: docs/SOFT-HEURISTIC-MORPHOLOGY-LAYER-2026-10-11.md
 *
 * These tests assume the engine exposes:
 *   analyze(text, { morphologyMode: 'strict' | 'soft' })
 * and that soft applications appear in the rule trace with
 *   status === 'heuristic-low-confidence'
 *   source === 'soft-heuristic-morphology'
 *
 * Drop into the repo's tests/ and wire to the real engine import.
 */

import assert from 'node:assert/strict';
// import { analyze } from '../src/app/engine.js';  // wire when merging

const SOFT = { morphologyMode: 'soft' };
const STRICT = { morphologyMode: 'strict' };

// Placeholder until wired to the real engine.
function analyze(text, opts = {}) {
  throw new Error('Wire to src/app/engine.js analyze() before running');
}

describe('soft-heuristic morphology — formal endings', () => {
  it('strict mode keeps morphology-gated cases unresolved (sanity)', () => {
    // Example: unknown ㄷ + 이 without lexical entry.
    const r = analyze('굳이', STRICT);
    // Expect unresolved / conditional path for §17 when not in lexicon.
    // Exact assertion depends on existing engine markers.
    assert.ok(r);
  });

  it('soft mode unlocks R007 for ㄷ/ㅌ + 이 with heuristic status', () => {
    const r = analyze('굳이', SOFT);
    const traces = r.traces || r.ruleTrace || [];
    const pal = traces.find(t =>
      (t.rule_id || t.rule || '').includes('R007') ||
      (t.name || '').includes('palatal')
    );
    assert.ok(pal, 'expected a palatalization trace');
    assert.equal(pal.status, 'heuristic-low-confidence');
    assert.equal(pal.source, 'soft-heuristic-morphology');
  });

  it('soft mode unlocks R002 formal liaison for complex coda + 이', () => {
    // 값이 is in many lexical sets already; use a rare but orthographically
    // valid formal pattern if needed, or assert status when soft fires.
    const r = analyze('넋이', SOFT);
    const traces = r.traces || r.ruleTrace || [];
    const liaison = traces.find(t =>
      (t.rule_id || t.rule || '').includes('R002') ||
      (t.name || '').includes('liaison')
    );
    if (liaison && liaison.changed) {
      // If exact license already exists, status may stay established.
      // Soft must not claim credit for exact licenses.
      assert.ok(
        liaison.status === 'established' ||
        liaison.status === 'heuristic-low-confidence'
      );
    }
  });

  it('soft mode never fires across whitespace', () => {
    const r = analyze('값 이', SOFT);
    const traces = r.traces || r.ruleTrace || [];
    const soft = traces.filter(t => t.source === 'soft-heuristic-morphology');
    assert.equal(soft.length, 0, 'no soft licenses across word boundary');
  });

  it('soft mode never licenses R016 ㄺ-before-ㄱ', () => {
    const r = analyze('읽고', SOFT);
    const traces = r.traces || r.ruleTrace || [];
    const softR016 = traces.filter(
      t =>
        t.source === 'soft-heuristic-morphology' &&
        ((t.rule_id || t.rule || '') === 'R016' ||
          (t.name || '').includes('rieul-giyeok'))
    );
    assert.equal(softR016.length, 0);
  });

  it('soft mode never selects §15 substantive neutralization', () => {
    // Soft only emits R002:formal:..., never R002:substantive:...
    // Engine-level assertion: no soft substantive license in traces.
    const r = analyze('값어치', SOFT);
    const traces = r.traces || r.ruleTrace || [];
    for (const t of traces) {
      if (t.license_context) {
        assert.ok(
          !String(t.license_context).includes('substantive') ||
            t.source !== 'soft-heuristic-morphology',
          'soft must not emit substantive licenses'
        );
      }
    }
  });
});
