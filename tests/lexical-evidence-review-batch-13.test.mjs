import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const auditText = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-TRACEABILITY-AUDIT-2026-10-10.md', import.meta.url), 'utf8');
const review = readFileSync(new URL('../docs/LEXICAL-EVIDENCE-REVIEW-BATCH-13-2026-10-10.md', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);

test('batch 13 reviews the final fifteen records', () => {
  const inputs = ['발음과', '발음의', '차이를', '자세히', '설명했어요', '딸이', '흙을', '밟으며', '낡은', '놓인', '밟았습니다', '맑은', '있었고', '웃었고', '넓어졌다는'];
  for (const input of inputs) {
    assert.ok(rows.some((row) => row.input === input), input + ': expected lexical row');
    assert.ok(review.includes(input), input + ': expected review entry');
  }
});

test('batch 13 adds explicit rule mappings for all rule-derived rows', () => {
  const expected = {
    '발음의': /§§5, 13/u,
    '설명했어요': /§13/u,
    '딸이': /§13/u,
    '흙을': /§14/u,
    '밟으며': /§14/u,
    '낡은': /§14/u,
    '놓인': /§12/u,
    '밟았습니다': /§§9, 14, 18, 23/u,
    '맑은': /§14/u,
    '있었고': /§§9, 13, 23/u,
    '웃었고': /§§9, 13, 23/u,
    '넓어졌다는': /§§9, 14, 23/u,
  };
  for (const [input, pattern] of Object.entries(expected)) {
    const row = rows.find((item) => item.input === input);
    assert.ok(row, input + ': expected lexical row');
    assert.match(row.rule_notes, pattern, input + ': expected rule mapping');
  }
});

test('발음의 stores the permitted [바르메] variant alongside [바르미]', () => {
  const row = rows.find((item) => item.input === '발음의');
  assert.equal(row.surface_hangul, '바르미');
  assert.equal(row.alternate_surface_hangul, '바르메');
  assert.equal(row.alternate_target_syllables, 'па|ри|ме');
  assert.equal(row.alternate_ipa_syllables, 'pa|rɯ|me');
  assert.match(row.variant_note, /§5 permits particle 의 \[의\] or \[에\]/u);
});

test('all three control classes are excluded from the article-mapping queue', () => {
  assert.match(rows.find((item) => item.input === '발음과').rule_notes, /^Lexical-source control/u);
  for (const input of ['차이를', '자세히']) {
    assert.match(rows.find((item) => item.input === input).rule_notes, /^Baseline control/u);
  }
  assert.match(auditText, /contains \*\*595\*\* rows; \*\*0\*\* rows meet the audit filter/u);
});

test('있었고 does not incorrectly claim nasal assimilation under §18', () => {
  const row = rows.find((item) => item.input === '있었고');
  assert.match(row.rule_notes, /§§9, 13, 23/u);
  assert.match(row.rule_notes, /No §18 nasalization applies/u);
});
