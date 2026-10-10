import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/app/engine.js';

const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);

const expected = {
  '밟으며': [14],
  '낡은': [14],
  '놓인': [12],
  '밟았습니다': [14, 18, 23],
  '맑은': [14],
  '있었고': [9, 13, 23],
  '웃었고': [9, 13, 23],
};

test('seven reviewed records have explicit Standard Pronunciation Rules mappings', () => {
  for (const [input, articles] of Object.entries(expected)) {
    const row = rows.find((item) => item.input === input);
    assert.ok(row, input + ': expected lexical row');
    for (const article of articles) {
      assert.match(row.rule_notes, new RegExp('§{1,2}[^\\n]*\\b' + article + '\\b', 'u'), input + ': expected §' + article);
    }
  }
});

test('rule mappings preserve source limitations and the unresolved control', () => {
  const was = rows.find((item) => item.input === '있었고');
  assert.match(was.rule_notes, /not this exact word/u);
  assert.match(was.rule_notes, /pattern evidence only/u);
  const 놓인 = rows.find((item) => item.input === '놓인');
  assert.match(놓인.rule_notes, /Exact-word attestation not yet located/u);
  const 넓어졌다는 = rows.find((item) => item.input === '넓어졌다는');
  assert.doesNotMatch(넓어졌다는.rule_notes, /§\s*\d|제\s*\d+\s*항/u);
  assert.match(넓어졌다는.rule_notes, /Compositional standard reading/u);
});

test('baseline and corpus controls are not assigned invented article numbers', () => {
  const baseline = rows.find((item) => item.input === '대한민국');
  const corpus = rows.find((item) => item.input === '나중엔');
  assert.ok(baseline);
  assert.ok(corpus);
  assert.doesNotMatch(baseline.rule_notes, /§\s*\d/u);
  assert.doesNotMatch(corpus.rule_notes, /§\s*\d/u);
});
