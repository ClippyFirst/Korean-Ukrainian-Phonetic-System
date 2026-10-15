import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync(new URL('./fixtures/nikl-qna-supplemental-controls-2026-10-15.json', import.meta.url), 'utf8'));
const sources = readFileSync(new URL('../data/korean/sources.csv', import.meta.url), 'utf8').trim().split(/\r?\n/u);
const sourceRows = new Map(sources.slice(1).map((line) => {
  const fields = line.split(',');
  return [fields[0], fields];
}));

test('supplemental NIKL Q&A controls have traceable source-register entries and explicit evidence levels', () => {
  assert.equal(manifest.schemaVersion, 1);
  assert.ok(manifest.cases.length >= 20);
  const ids = new Set();
  for (const item of manifest.cases) {
    assert.ok(!ids.has(item.id), item.id + ': duplicate control ID');
    ids.add(item.id);
    assert.ok(item.input && item.note, item.id + ': input and rationale required');
    assert.ok(item.ruleIds.length, item.id + ': at least one rule/article link required');
    assert.match(item.sourceUrl, /^https:\/\//u, item.id + ': source URL required');
    const row = sourceRows.get(item.sourceId);
    assert.ok(row, item.id + ': source ID missing from data/korean/sources.csv');
    assert.ok(row[6] === item.sourceUrl, item.id + ': manifest URL differs from source register');
    if (item.expectedSurfaceForms.length) {
      assert.ok(item.evidenceKind.startsWith('direct-'), item.id + ': only direct source controls may carry a surface target');
      assert.ok(item.expectedSurfaceForms.every((surface) => surface.length > 0), item.id + ': empty surface target');
    } else {
      assert.ok(!item.evidenceKind.startsWith('direct-'), item.id + ': policy/context-only case must not claim a gold surface');
    }
  }
});

test('supplemental source controls remain explicit about the two principal §29 failure modes', () => {
  const cases = new Map(manifest.cases.map((item) => [item.id, item]));
  assert.deepEqual(cases.get('QNA-329103-GEOMNYEOL').expectedSurfaceForms, ['검녈', '거멸']);
  assert.deepEqual(cases.get('QNA-329103-GEUMNYUNG').expectedSurfaceForms, ['금늉', '그뮹']);
  assert.equal(cases.get('QNA-316888-SIKMOKIL').expectedSurfaceForms.length, 0);
  assert.equal(cases.get('QNA-333041-PAUSE').expectedSurfaceForms.length, 0);
  assert.match(cases.get('QNA-333041-PAUSE').note, /pause|prosodic/i);
});
