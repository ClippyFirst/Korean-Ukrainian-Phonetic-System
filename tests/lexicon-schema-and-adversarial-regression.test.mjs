import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const rows = parseCsv(lexicalText);
const entries = new Map(rows.map((row) => [row.input, row]));
const engine = createEngine(canonical, lexicalText);
const genericEngine = createEngine(canonical, '');
const officialSource = /^https:\/\/(?:www\.|m\.)?korean\.go\.kr\//u;

function csvFieldCount(line) {
  let count = 1;
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') i += 1;
      else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      count += 1;
    }
  }
  return count;
}

test('lexical CSV has one stable 13-column schema on every record', () => {
  const lines = lexicalText.trimEnd().split(/\r?\n/u);
  const expectedColumns = csvFieldCount(lines[0]);
  assert.equal(expectedColumns, 13);
  assert.equal(lines.length - 1, rows.length);
  for (const [index, line] of lines.slice(1).entries()) {
    assert.equal(csvFieldCount(line), expectedColumns, 'CSV record ' + (index + 2));
  }
});

test('every lexical row has valid provenance, explicit confidence/status, and aligned syllable fields', () => {
  assert.ok(rows.length >= 500, 'the curated NIKL lexicon should not shrink unexpectedly');
  assert.equal(entries.size, rows.length, 'lexical keys must be unique');
  for (const row of rows) {
    assert.ok(row.input, 'empty input');
    assert.ok(row.surface_hangul, row.input + ': empty standard surface');
    assert.ok(row.rule_notes, row.input + ': missing rule/evidence note');
    assert.match(row.source_url, officialSource, row.input + ': source must be the official NIKL domain');
    assert.equal(row.confidence, 'high', row.input + ': confidence must be explicit');
    assert.ok(['model-selected', 'provisional', 'surface-only'].includes(row.target_status), row.input + ': invalid target_status');
    assert.ok(['', 'mixed-script'].includes(row.input_kind), row.input + ': unknown input_kind');
    assert.ok([...row.surface_hangul].every((char) => /[가-힣]/u.test(char)), row.input + ': surface must contain Hangul syllables only');
    const syllables = [...row.surface_hangul].length;
    assert.equal(row.target_syllables.split('|').length, syllables, row.input + ': Ukrainian target alignment');
    assert.equal(row.ipa_syllables.split('|').length, syllables, row.input + ': IPA alignment');
    if (row.input_kind === 'mixed-script') {
      assert.match(row.input, /[^가-힣]/u, row.input + ': mixed-script label must match its input');
    } else {
      assert.ok([...row.input].every((char) => /[가-힣]/u.test(char)), row.input + ': non-Hangul input must be explicitly labelled');
    }
    const alternateFields = [row.alternate_surface_hangul, row.alternate_target_syllables, row.alternate_ipa_syllables];
    const hasAlternate = alternateFields.some(Boolean);
    assert.ok(!hasAlternate || alternateFields.every(Boolean), row.input + ': alternate reading must be complete');
    if (hasAlternate) {
      assert.ok([...row.alternate_surface_hangul].every((char) => /[가-힣]/u.test(char)), row.input + ': alternate surface must be Hangul');
      const altSyllables = [...row.alternate_surface_hangul].length;
      assert.equal(row.alternate_target_syllables.split('|').length, altSyllables, row.input + ': alternate target alignment');
      assert.equal(row.alternate_ipa_syllables.split('|').length, altSyllables, row.input + ': alternate IPA alignment');
      assert.ok(row.variant_note, row.input + ': alternate reading needs a rationale');
    }
  }
});

test('morphology-dependent pronunciations fail closed rather than infer a morpheme from spelling', () => {
  const unresolved = ['얇은', '긁고', '늙고', '굵고', '놓아라'];
  for (const input of unresolved) {
    assert.ok(!entries.has(input), input + ': do not add a blanket lexical override');
    const result = genericEngine.convert(input);
    assert.ok(
      result.ukrainian.includes('⟦') || result.issues.length > 0 || result.status === 'unresolved',
      input + ': unknown morphology must be visibly unresolved',
    );
    assert.ok(
      !result.trace.some((item) => item.rules.includes('complex-coda-liaison') || item.rules.includes('h-deletion')),
      input + ': do not silently pick a morphology-dependent reading',
    );
  }
});

test('않았다 is resolved only by its exact sourced entry, not by generic morphology guessing', () => {
  const row = entries.get('않았다');
  assert.ok(row, 'the official NIKL example must have an exact lexical row');
  assert.match(row.source_url, officialSource);
  const generic = genericEngine.convert('않았다');
  assert.ok(generic.ukrainian.includes('⟦') || generic.status === 'unresolved');
  assert.equal(engine.convert('않았다').surfaceHangul, '아낟따');
  assert.equal(engine.convert('않았다').ukrainian, 'анатта');
});

test('punctuation is a hard boundary for cross-word sound-rule propagation', () => {
  const blockedRules = new Set([
    'nasal-assimilation',
    'liquid-assimilation',
    'liquid-to-nasal-before-obstruent',
    'project-inferred-d-liquid-nasalization',
    'n-insertion',
    'lexical-n-insertion',
  ]);
  for (const phrase of ['국,립', '밥!물', '칼.날', '한,일', '국—립']) {
    const result = genericEngine.convert(phrase);
    assert.ok(
      !result.trace.some((item) => item.rules.some((rule) => blockedRules.has(rule))),
      phrase + ': sound rules must not cross punctuation',
    );
  }
});

test('a representative set of generic rule cases stays algorithmic with and without the lexical layer', () => {
  const expected = {
    '국물':'kuŋ mul',
    '막론':'maŋ non',
    '신라':'sil la',
    '값':'kap̚',
    '넋':'nʌk̚',
    '낮이':'na dʑi',
  };
  for (const [word, ipa] of Object.entries(expected)) {
    const result = genericEngine.convert(word);
    assert.equal(result.ipa, ipa, word + ': generic IPA');
    assert.ok(!result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word + ': no lexical override in generic engine');
    const withLexicon = engine.convert(word);
    if (!entries.has(word)) assert.equal(withLexicon.ipa, ipa, word + ': adding lexicon must not alter generic result');
  }
});
