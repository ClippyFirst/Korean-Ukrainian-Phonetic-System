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
  // Unknown forms remain unresolved unless an exact official dictionary/Q&A reading licenses them.
  // 얇은 is handled by its exact NIKL dictionary entry in the lexical evidence table.
  const unresolved = ['긁고', '굵고', '놓아라'];
  for (const input of unresolved) {
    assert.ok(!entries.has(input), input + ': do not silently add an unsourced override');
    const result = engine.convert(input);
    assert.ok(
      result.ukrainian.includes('⟦') || result.issues.length > 0,
      input + ': morphology-dependent pronunciation must be visibly unresolved',
    );
  }
});

test('NIKL-attested 늙고 is resolved exactly while other lookalikes remain guarded', () => {
  const row = entries.get('늙고');
  assert.ok(row, 'NIKL directly attests 늙고[늘꼬]');
  assert.ok(row.source_url.startsWith('https://www.korean.go.kr/'), 'official NIKL source URL');
  assert.equal(engine.convert('늙고').surfaceHangul, '늘꼬');
  assert.equal(engine.convert('늙고').ukrainian, 'нилко');
  assert.equal(engine.convert('늙고').ipa, 'nɯl k͈o');

  assert.equal(engine.convert('읽어').surfaceHangul, '일거');
  assert.equal(engine.convert('헛웃음').surfaceHangul, '허두슴');

  for (const input of ['긁고', '굵고', '놓아라']) {
    const result = engine.convert(input);
    assert.ok(
      result.ukrainian.includes('⟦') || result.issues.length > 0,
      input + ': a rule-shaped spelling is not sufficient lexical evidence',
    );
  }
});
