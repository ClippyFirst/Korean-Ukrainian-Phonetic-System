import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);
const entries = new Map(parseCsv(lexical).map((row) => [row.input, row]));

test('high-risk user-corpus words use explicit standard surface readings', () => {
  const expected = {
    '국립국어원': ['궁님꾸거원', 'кунгнімкуґовон', 'kuŋ nim k͈u kʌ wʌn'],
    '먹었어요': ['머거써요', 'моґосойо', 'mʌ ɡʌ s͈ʌ jo'],
    '찍었어요': ['찌거써요', 'чіґосойо', 'tɕ͈i ɡʌ s͈ʌ jo'],
  };
  for (const [word, [surface, target, ipa]] of Object.entries(expected)) {
    const entry = entries.get(word);
    assert.ok(entry, 'missing lexical entry: ' + word);
    assert.equal(entry.surface_hangul, surface, word);
    assert.equal(entry.target_status, 'provisional', word);
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, surface, word);
    assert.equal(result.ukrainian, target, word);
    assert.equal(result.ipa, ipa, word);
    assert.equal(result.status, 'lexical-review', word);
    assert.deepEqual(result.issues, [], word);
  }
});

test('trace panel has explicit column labels for source, target, rules and status', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/styles/main.css', import.meta.url), 'utf8');
  for (const label of ['Корейський сегмент', 'Український запис', 'Правила / IPA', 'Статус']) {
    assert.ok(html.includes(label), 'missing trace label: ' + label);
  }
  assert.match(css, /\.trace-columns\s*\{/u);
  assert.match(css, /@media\s*\(max-width:\s*680px\)/u);
});


test('sentence conversion resolves exact lexical words inside punctuation-separated text', () => {
  for (const [input, expected] of [
    ['국립국어원에서', ['궁님꾸거워네서', 'кунгнімкуґовонесо']],
    ['찍었어요.', ['찌거써요', 'чіґосойо']],
    ['있어요.', ['이써요', 'ісойо']],
    ['갔어요.', ['가써요', 'касойо']],
  ]) {
    const result = engine.convert(input);
    assert.ok(result.surfaceHangul.startsWith(expected[0]), input + ' surface: ' + result.surfaceHangul);
    assert.ok(result.ukrainian.includes(expected[1]), input + ' target: ' + result.ukrainian);
    assert.deepEqual(result.issues, [], input);
  }
});

test('literal punctuation and spaces are not emitted as empty-looking trace rows', () => {
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(main, /for\s*\(const t of r\.trace\)\s*\{\s*if\s*\(t\.status\s*===\s*'literal'\)\s*continue;/u);
});
