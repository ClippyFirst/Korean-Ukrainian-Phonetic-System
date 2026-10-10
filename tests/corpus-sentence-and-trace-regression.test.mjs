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
    '국립국어원': ['궁님꾸거원', 'кунгнімкуґовон', 'kuŋ nim k͈u ɡʌ wʌn'],
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

test('Korean onset ㅎ uses the documented practical Ukrainian target г', () => {
  const row = parseCsv(canonical).find((r) => r.layer === 'onset' && r.input === 'ㅎ');
  assert.ok(row, 'missing canonical onset ㅎ row');
  assert.equal(row.ipa, 'h');
  assert.equal(row.ukrainian, 'г');
  assert.equal(engine.convert('하').ukrainian, 'га');
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
    if (!input.endsWith('.')) assert.ok(result.surfaceHangul.startsWith(expected[0]), input + ' surface: ' + result.surfaceHangul);
    assert.ok(result.ukrainian.includes(expected[1]), input + ' target: ' + result.ukrainian);
    assert.deepEqual(result.issues, [], input);
  }
});

test('the exact three user-reported sentences do not leave past-tense liaison placeholders', () => {
  const cases = [
    ['독립문 앞에서 사진을 찍었어요.', '찍었어요', 'чіґосойо'],
    ['한국 음식은 맛있지만 매울 수도 있어요.', '있어요', 'ісойо'],
    ['오늘은 날씨가 맑고 바람이 붑니다. 책을 읽고 학교에 갔어요.', '갔어요', 'касойо'],
  ];
  for (const [sentence, word, expected] of cases) {
    const result = engine.convert(sentence);
    assert.ok(result.ukrainian.includes(expected), sentence + ': ' + result.ukrainian);
    assert.ok(!result.ukrainian.includes('⟦었⟧') && !result.ukrainian.includes('⟦어⟧') &&
      !result.ukrainian.includes('⟦있⟧') && !result.ukrainian.includes('⟦갔⟧'),
      sentence + ': unresolved past-tense placeholder in ' + result.ukrainian);
    assert.deepEqual(result.issues, [], sentence + ': ' + JSON.stringify(result.issues));
  }
});

test('literal punctuation and spaces are not emitted as empty-looking trace rows', () => {
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(main, /for\s*\(const t of r\.trace\)\s*\{\s*if\s*\(t\.status\s*===\s*'literal'\)\s*continue;/u);
});

test('second adversarial corpus resolves morphology-sensitive forms without placeholders', () => {
  const expected = {
    '얇아도': ['얄바도', 'ялбадо'],
    '얇아서': ['얄바서', 'ялбасо'],
    '많은': ['마는', 'манин'],
    '빗었어요': ['비서써요', 'пісосойо'],
    '해돋이를': ['해도지를', 'гедоджірил'],
    '멋있어요': ['머디써요', 'модісойо'],
    '맛있고': ['마딛꼬', 'мадітко'],
    '맛없고': ['마덥꼬', 'мадопко'],
    '맛없어요': ['마더버요', 'мадобойо'],
    '젊은': ['절믄', 'чолмин'],
    '읽었습니다': ['일거씀니다', 'ілґосимніда'],
    '않아도': ['아나도', 'анадо'],
    '좋아질': ['조아질', 'чоаджіл'],
  };
  for (const [word, [surface, target]] of Object.entries(expected)) {
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, surface, word + ': surface');
    assert.equal(result.ukrainian, target, word + ': target');
    assert.deepEqual(result.issues, [], word + ': ' + JSON.stringify(result.issues));
    assert.ok(!result.ukrainian.includes('⟦'), word + ': ' + result.ukrainian);
  }
});
