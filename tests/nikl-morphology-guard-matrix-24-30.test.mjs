import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const lexicalRows = parseCsv(lexicalText);
const lexical = new Map(lexicalRows.map((row) => [row.input, row]));
const generic = createEngine(canonical, '');

test('§§24–28: unseen morphology-conditioned fortition is not inferred from spelling alone', () => {
  // These are deliberately tested without the lexical layer. The browser has no
  // productive parser for verb stems, causative/passive -기-, Sino-Korean
  // compounds, or adnominal constructions; exact dictionary rows must not turn
  // into a blanket productive rule.
  const cases = [
    ['껴안다', 24],
    ['얹다', 24],
    ['더듬지', 24],
    ['닮고', 24],
    ['젊지', 24],
    ['앉고', 24],
    ['안기다', 24],
    ['감기다', 24],
    ['굶기다', 24],
    ['옮기다', 24],
    ['넓게', 25],
    ['핥다', 25],
    ['훑소', 25],
    ['떫지', 25],
    ['불소', 26],
    ['발전', 26],
    ['몰상식', 26],
    ['불세출', 26],
    ['문고리', 28],
  ];

  for (const [input, article] of cases) {
    assert.ok(lexical.has(input), input + ': keep the exact sourced surface in the lexical evidence layer');
    const result = generic.convert(input);
    assert.ok(
      !result.trace.some((item) => item.rules.some((rule) => /(?:morphology-licensed-fortition|verb-stem-fortition|sino-korean-fortition|adnominal-r-fortition)/u.test(rule))),
      input + ': generic mode must not claim a morphology-specific §' + article + ' analysis',
    );
  }
});

test('§30: saisiot remains an exact lexical decision, not a generic ㅅ-final rewrite', () => {
  const cases = ['냇가', '나뭇가지', '아랫방'];
  for (const input of cases) {
    const result = generic.convert(input);
    assert.ok(
      !result.trace.some((item) => item.rules.some((rule) => /saisiot|R015/u.test(rule))),
      input + ': generic mode must not claim a licensed §30 analysis',
    );
  }
});

test('§§24–30 evidence rows have official provenance and explicit article coverage in the audit', () => {
  const audit = readFileSync(new URL('../docs/NIKL-STANDARD-PRONUNCIATION-AUDIT-2026-10-09.md', import.meta.url), 'utf8');
  for (const [input, article] of [
    ['껴안다', 24], ['넓게', 25], ['발전', 26], ['할 것', 27], ['문고리', 28], ['냇가', 30],
  ]) {
    const row = lexical.get(input);
    assert.ok(row, input + ': exact evidence row is required');
    assert.match(row.source_url, /^https:\/\/(?:www\.|m\.)?korean\.go\.kr\//u, input + ': official NIKL provenance');
    assert.ok(audit.includes('§' + article), input + ': audit must account for §' + article);
  }
});

test('§27: the explicitly listed adnominal phrase remains a narrow positive license', () => {
  const result = generic.convert('할 것');
  assert.ok(
    result.trace.some((item) => item.rules.includes('adnominal-r-fortition-§27')),
    'the exact listed phrase 할 것 should use the explicit §27 phrase license',
  );
});
