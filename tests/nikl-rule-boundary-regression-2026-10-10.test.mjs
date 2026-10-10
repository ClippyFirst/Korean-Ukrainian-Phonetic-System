import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const standardAudit = readFileSync(new URL('../docs/NIKL-STANDARD-PRONUNCIATION-AUDIT-2026-10-09.md', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);
const entries = new Map(parseCsv(lexical).map((row) => [row.input, row]));

test('NIKL standard-pronunciation audit keeps an explicit article-by-article map for §§1–30', () => {
  // §§6–7 are intentionally grouped in the audit because they form the vowel-length section.
  for (const article of [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]) {
    assert.ok(
      standardAudit.includes(`| §${article} |`),
      `standard audit must explicitly account for §${article}`,
    );
  }
  assert.ok(standardAudit.includes('§§6–7'), 'vowel length §§6–7 must be accounted for');
  assert.ok(standardAudit.includes('Official sources'), 'audit must preserve source provenance');
});

test('§15 representative-coda change is resolved only by the exact sourced lexical entry 헛웃음', () => {
  const row = entries.get('헛웃음');
  assert.ok(row, '헛웃음 must have an exact lexical evidence row');
  assert.equal(row.surface_hangul, '허두슴');
  assert.match(row.source_url, /^https:\/\/www\.korean\.go\.kr\/kornorms\/regltn\/regltnView\.do\?regltn_code=0002$/);
  const result = engine.convert('헛웃음');
  assert.equal(result.surfaceHangul, '허두슴');
  assert.ok(!result.ukrainian.includes('⟦'), 'the sourced exact form should not remain unresolved');
});

test('§§11 and 14 exact sourced complex-coda liaison remains stable for 읽어', () => {
  const row = entries.get('읽어');
  assert.ok(row, '읽어 must have an exact lexical evidence row');
  assert.equal(row.surface_hangul, '일거');
  assert.equal(engine.convert('읽어').surfaceHangul, '일거');
});

test('morphology-dependent complex-coda and ㄺ-before-ㄱ cases fail closed without lexical evidence', () => {
  // These are deliberately not guessed from adjacent Hangul blocks alone.
  // Add an exact form only after confirming the reading against NIKL/dictionary evidence.
  const unresolved = ['얇은', '않았다', '긁고', '늙고', '굵고', '놓아라'];
  for (const input of unresolved) {
    assert.ok(!entries.has(input), input + ': do not silently add an unsourced override');
    const result = engine.convert(input);
    assert.ok(
      result.ukrainian.includes('⟦') || result.issues.length > 0,
      input + ': morphology-dependent pronunciation must be visibly unresolved',
    );
  }
});

test('known exact forms and morphology-ambiguous lookalikes are treated differently', () => {
  assert.equal(engine.convert('읽어').surfaceHangul, '일거');
  assert.equal(engine.convert('헛웃음').surfaceHangul, '허두슴');

  for (const input of ['긁고', '늙고', '굵고', '놓아라']) {
    const result = engine.convert(input);
    assert.ok(
      result.ukrainian.includes('⟦') || result.issues.length > 0,
      input + ': a rule-shaped spelling is not sufficient lexical evidence',
    );
  }
});
