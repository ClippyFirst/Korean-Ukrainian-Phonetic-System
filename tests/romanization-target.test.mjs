import test from 'node:test';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { createRomanizationTarget } from '../src/app/romanization_target.js';
import { romanizeRevisedDetailed } from '../src/app/romanization.js';

const correspondenceCsv = readFileSync(new URL('../data/korean/rr_ukrainian_correspondence.csv', import.meta.url), 'utf8');
const contextRulesCsv = readFileSync(new URL('../data/korean/rr_ukrainian_context_rules.csv', import.meta.url), 'utf8');
const transcribeRevisedToUkrainian = createRomanizationTarget(correspondenceCsv, contextRulesCsv);

test('maps RR syllable units to a separate Ukrainian output', () => {
  const result = transcribeRevisedToUkrainian('가치');
  assert.equal(result.romanization, 'gachi');
  assert.equal(result.text, "кач'і");
  assert.equal(result.status, 'provisional');
});

test('distinguishes initial voiceless lenis from intervocalically voiced lenis', () => {
  assert.equal(transcribeRevisedToUkrainian('가').text, 'ка');
  assert.equal(transcribeRevisedToUkrainian('가가').text, 'каґа');
  assert.equal(transcribeRevisedToUkrainian('아가').text, 'аґа');
  const result = transcribeRevisedToUkrainian('가가');
  const secondOnset = result.trace.find((entry) => entry.source === '가' && entry.layer === 'onset' && entry.syllableIndex === 1);
  assert.equal(secondOnset.phonologicalFeature, 'intervocalic-voicing');
  assert.equal(secondOnset.alternativeUkrainian, 'к');
  assert.equal(secondOnset.wordPosition, 'final');
  assert.equal(secondOnset.leftContext, 'vowel');
});

test('marks phonemic aspiration with apostrophe, not lenis or fortis consonants', () => {
  assert.equal(transcribeRevisedToUkrainian('카').text, "к'а");
  assert.equal(transcribeRevisedToUkrainian('타').text, "т'а");
  assert.equal(transcribeRevisedToUkrainian('파').text, "п'а");
  assert.equal(transcribeRevisedToUkrainian('차').text, "ч'а");
  assert.equal(transcribeRevisedToUkrainian('까').text, 'кка');
  assert.equal(transcribeRevisedToUkrainian('가').text, 'ка');
});

test('uses Ukrainian glottal and fortis-affricate approximations explicitly', () => {
  assert.equal(transcribeRevisedToUkrainian('하').text, 'га');
  assert.equal(transcribeRevisedToUkrainian('짜').text, 'чча');
});

test('retains fortis and resolved surface-form RR units', () => {
  const result = transcribeRevisedToUkrainian('일꼬');
  assert.equal(result.romanization, 'ilkko');
  assert.equal(result.text, 'ілкко');
  assert.ok(result.trace.some((entry) => entry.layer === 'onset' && entry.rr === 'kk'));
});

test('applies RR ll across a syllable boundary and maps the l onset', () => {
  const result = transcribeRevisedToUkrainian('별래');
  assert.equal(result.romanization, 'byeollae');
  assert.equal(result.text, 'пйолле');
  assert.ok(result.trace.some((entry) => entry.layer === 'onset' && entry.rr === 'l' && entry.ukrainian === 'л'));
});

test('preserves spaces, punctuation, digits and non-Hangul text', () => {
  assert.equal(transcribeRevisedToUkrainian('가치, 123 ABC!').text, "кач'і, 123 ABC!");
});

test('retains RR vowel sequences as single correspondence units', () => {
  assert.equal(transcribeRevisedToUkrainian('어으의').romanization, 'eoeuui');
  assert.equal(transcribeRevisedToUkrainian('어으의').text, 'оиуї');
});

test('records the actual right-hand phonological context rather than a fixed placeholder', () => {
  const syllables = romanizeRevisedDetailed('가가 가나 가아').segments.filter((segment) => segment.type === 'syllable');
  assert.deepEqual(syllables.map((segment) => segment.rightContext), [
    'obstruent', 'word-boundary',
    'sonorant', 'word-boundary',
    'vowel', 'word-boundary'
  ]);
});

test('base correspondence inventory covers every onset, vowel and coda row', () => {
  const [header, ...lines] = correspondenceCsv.trim().split(/\r?\n/u);
  const columns = header.split(',');
  const rows = lines.map((line) => Object.fromEntries(line.split(',').map((value, index) => [columns[index], value])));
  assert.equal(rows.length, 68);
  assert.equal(rows.filter((row) => row.layer === 'onset').length, 20);
  assert.equal(rows.filter((row) => row.layer === 'vowel').length, 21);
  assert.equal(rows.filter((row) => row.layer === 'coda').length, 27);
});

test('documents every Ukrainian vowel collision and exposes the RR identity in trace', () => {
  const [header, ...lines] = correspondenceCsv.trim().split(/\r?\n/u);
  const columns = header.split(',');
  const rows = lines.map((line) => Object.fromEntries(line.split(',').map((value, index) => [columns[index], value])));
  const byTarget = new Map();
  for (const row of rows.filter((entry) => entry.layer === 'vowel')) {
    const group = byTarget.get(row.ukrainian) || [];
    group.push(row);
    byTarget.set(row.ukrainian, group);
  }
  const collisions = [...byTarget.values()].filter((group) => new Set(group.map((row) => row.rr)).size > 1);
  assert.equal(collisions.length, 5);
  for (const group of collisions) {
    assert.ok(group[0].collision_group, 'undocumented Ukrainian vowel collision: ' + group[0].ukrainian);
    assert.ok(group.every((row) => row.collision_group === group[0].collision_group));
  }
  const eo = transcribeRevisedToUkrainian('어').trace.find((entry) => entry.layer === 'vowel');
  const o = transcribeRevisedToUkrainian('오').trace.find((entry) => entry.layer === 'vowel');
  assert.equal(eo.collisionGroup, 'VOWEL-EO-O');
  assert.equal(o.collisionGroup, 'VOWEL-EO-O');
});

test('rejects malformed correspondence rows and duplicate context-rule IDs', () => {
  assert.throws(
    () => createRomanizationTarget(correspondenceCsv + 'broken,row\\n', contextRulesCsv),
    /expected/u
  );
  const firstRule = contextRulesCsv.trim().split(/\\r?\\n/u)[1];
  assert.throws(
    () => createRomanizationTarget(correspondenceCsv, contextRulesCsv.trim() + '\\n' + firstRule),
    /Duplicate or missing RR context rule ID/u
  );
});

test('more-specific context rules take precedence over broader matching rules', () => {
  const [header, ...existing] = contextRulesCsv.trim().split(/\\r?\\n/u);
  const row = (id, wordPosition, leftContext, sentencePosition, onsetContext, target) => [
    id, 'onset', 'ㄱ', 'g', wordPosition, leftContext, sentencePosition, target,
    'specificity-test', 'provisional', '', '아가', '아가', 'aga', onsetContext, ''
  ].join(',');
  const rules = [
    header,
    ...existing,
    row('TEST-BROAD', '*', '*', '*', '*', 'x'),
    row('TEST-SPECIFIC', 'final', 'vowel', 'sentence-initial', 'consonantal', 'y')
  ].join('\\n');
  const adapter = createRomanizationTarget(correspondenceCsv, rules);
  const result = adapter('아가');
  const onset = result.trace.find((entry) => entry.layer === 'onset' && entry.syllableIndex === 1);
  assert.equal(onset.mapping_id, 'TEST-SPECIFIC');
  assert.equal(onset.ukrainian, 'y');
});

test('parses quoted commas in correspondence notes without shifting CSV columns', () => {
  const quotedCsv = correspondenceCsv.replace('Simple vowel', '"Simple, vowel"');
  const adapter = createRomanizationTarget(quotedCsv, contextRulesCsv);
  const result = adapter('가');
  const vowel = result.trace.find((entry) => entry.layer === 'vowel');
  assert.equal(vowel.notes, 'Simple, vowel');
});

test('records sentence-local word order separately from global word order', () => {
  const syllables = romanizeRevisedDetailed('가가. 가 다').segments.filter((segment) => segment.type === 'syllable');
  assert.deepEqual(syllables.map((segment) => segment.sentenceIndex), [0, 0, 1, 1]);
  assert.deepEqual(syllables.map((segment) => segment.wordIndex), [1, 1, 2, 3]);
  assert.deepEqual(syllables.map((segment) => segment.sentenceWordIndex), [1, 1, 1, 2]);
});

test('exposes word and sentence position for every Hangul syllable', () => {
  const result = romanizeRevisedDetailed('가가. 가');
  const syllables = result.segments.filter((segment) => segment.type === 'syllable');
  assert.deepEqual(syllables.map((segment) => segment.wordPosition), ['initial', 'final', 'single']);
  assert.deepEqual(syllables.map((segment) => segment.sentencePosition), ['sentence-initial', 'sentence-initial', 'sentence-initial']);
  assert.equal(syllables[1].leftContext, 'vowel');
  assert.equal(syllables[2].sentenceIndex, 1);
});

test('covers every modern precomposed Hangul syllable without missing RR mappings', () => {
  for (let code = 0xac00; code <= 0xd7a3; code += 1) {
    const result = transcribeRevisedToUkrainian(String.fromCodePoint(code));
    assert.equal(result.status, 'provisional', 'unmapped RR unit for U+' + code.toString(16));
    assert.equal(typeof result.text, 'string');
  }
});

test('context matrix examples reproduce the declared syllable and phonological environment', () => {
  const [header, ...lines] = contextRulesCsv.trim().split(/\r?\n/u);
  const columns = header.split(',');
  const rows = lines.map((line) => Object.fromEntries(line.split(',').map((value, index) => [columns[index], value])));
  assert.equal(rows.length, 43);
  assert.equal(new Set(rows.map((row) => row.rule_id)).size, rows.length);
  assert.equal(rows.filter((row) => row.alternative_ukrainian).length, 28);

  for (const rule of rows) {
    assert.ok(rule.example_source, 'missing source example or ∅ alignment marker for ' + rule.rule_id);
    assert.ok(rule.example_surface, 'missing surface example for ' + rule.rule_id);
    assert.ok(rule.example_rr, 'missing RR example for ' + rule.rule_id);
    const source = rule.example_source === '∅' ? '' : rule.example_source;
    const example = romanizeRevisedDetailed(rule.example_surface, source);
    assert.equal(example.text, rule.example_rr, 'RR mismatch for ' + rule.rule_id);
    const syllables = example.segments.filter((segment) => segment.type === 'syllable');
    const segment = syllables.find((candidate) => {
      const targetMatches = rule.layer === 'onset'
        ? candidate.onsetHangul === rule.hangul && candidate.onset === rule.rr
        : candidate.vowelHangul === rule.hangul && candidate.vowel === rule.rr;
      return targetMatches
        && (rule.word_position === '*' || candidate.wordPosition === rule.word_position)
        && (rule.left_context === '*' || candidate.leftContext === rule.left_context)
        && (rule.sentence_position === '*' || candidate.sentencePosition === rule.sentence_position)
        && (rule.onset_context === '*' || candidate.onsetContext === rule.onset_context);
    });
    assert.ok(segment, 'example lacks target ' + rule.layer + ' ' + rule.hangul + ' for ' + rule.rule_id);
    const adapted = transcribeRevisedToUkrainian(rule.example_surface, source);
    const selected = adapted.trace.find((entry) => entry.mapping_id === rule.rule_id);
    assert.ok(selected, 'adapter did not select ' + rule.rule_id);
    assert.equal(selected.ukrainian, rule.ukrainian, 'target mapping for ' + rule.rule_id);
    assert.equal(selected.alternativeUkrainian, rule.alternative_ukrainian || null, 'alternative target for ' + rule.rule_id);
    if (rule.word_position !== '*') assert.equal(segment.wordPosition, rule.word_position, 'word position for ' + rule.rule_id);
    if (rule.left_context !== '*') assert.equal(segment.leftContext, rule.left_context, 'left context for ' + rule.rule_id);
    if (rule.sentence_position !== '*') assert.equal(segment.sentencePosition, rule.sentence_position, 'sentence position for ' + rule.rule_id);
    if (rule.onset_context !== '*') assert.equal(segment.onsetContext, rule.onset_context, 'onset origin for ' + rule.rule_id);
  }
});
test('adapts RR ui according to Korean ㅢ pronunciation context without changing RR', () => {
  const initial = transcribeRevisedToUkrainian('의미');
  assert.equal(initial.romanization, 'uimi');
  assert.equal(initial.text, 'уїмі');

  const consonantOnset = transcribeRevisedToUkrainian('희망');
  assert.equal(consonantOnset.romanization, 'huimang');
  assert.equal(consonantOnset.text, 'гіманґ');
  assert.ok(consonantOnset.trace.some((entry) => entry.mapping_id === 'RRUA-UI-CONSONANT-ONSET' && entry.ukrainian === 'і'));

  const nonInitial = transcribeRevisedToUkrainian('주의');
  assert.equal(nonInitial.romanization, 'juui');
  assert.equal(nonInitial.text, 'чууї');
  assert.ok(nonInitial.trace.some((entry) => entry.mapping_id === 'RRUA-UI-SILENT-FINAL'));
});

test('keeps complex-coda transfer ambiguous instead of overclaiming source alignment', () => {
  const result = romanizeRevisedDetailed('넉씨', '넋이');
  const second = result.segments.filter((segment) => segment.type === 'syllable')[1];
  assert.equal(second.onsetContext, 'ambiguous-consonantal');
  assert.equal(second.onsetOrigin, 'unknown');
  assert.equal(second.alignmentStatus, 'aligned');
});

test('distinguishes a resyllabified coda from a lexical consonant onset before ㅢ', () => {
  const resyllabified = transcribeRevisedToUkrainian('혀븨', '협의');
  assert.equal(resyllabified.romanization, 'hyeobui');
  assert.equal(resyllabified.text, 'гйобуї');
  const resyllabifiedVowel = resyllabified.trace.find((entry) => entry.mapping_id === 'RRUA-UI-RESYLLABIFIED-ONSET');
  assert.equal(resyllabifiedVowel.onsetContext, 'resyllabified');
  assert.equal(resyllabifiedVowel.onsetOrigin, 'previous-coda');
  assert.equal(resyllabifiedVowel.alignmentStatus, 'aligned');

  const ambiguous = transcribeRevisedToUkrainian('혀븨', '협의의');
  const ambiguousVowel = ambiguous.trace.find((entry) => entry.mapping_id === 'RRUA-UI-AMBIGUOUS-ONSET');
  assert.equal(ambiguousVowel.onsetContext, 'ambiguous-consonantal');
  assert.equal(ambiguousVowel.alignmentStatus, 'unknown');
  assert.equal(ambiguousVowel.alternativeUkrainian, 'і');
});
