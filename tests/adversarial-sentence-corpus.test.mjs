import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const corpus = readFileSync(new URL('./fixtures/adversarial-sentence-corpus.txt', import.meta.url), 'utf8').trim().split(/\r?\n/u);
const engine = createEngine(canonical, lexical);
const entries = new Map(parseCsv(lexical).map((row) => [row.input, row]));

test('sentence-level adversarial corpus is present and has no unresolved morpheme placeholders', () => {
  assert.equal(corpus.length, 5);
  for (const sentence of corpus) {
    const result = engine.convert(sentence);
    assert.ok(!result.ukrainian.includes('⟦'), sentence + ': unresolved Korean placeholder in ' + result.ukrainian);
    assert.ok(!result.ukrainian.includes('⟧'), sentence + ': unresolved Korean placeholder in ' + result.ukrainian);
  }
});

test('adversarial forms have explicit standard surface readings and traceable provisional Ukrainian targets', () => {
  const expected = {
    '나중엔': ['나중엔', 'наджунен'],
    '덥고': ['덥꼬', 'топко'],
    '밤에는': ['바메는', 'паменин'],
    '춥습니다': ['춥씀니다', 'чупсимнида'],
    '숱이': ['수치', 'сучі'],
    '빗고': ['빋꼬', 'пітко'],
    '넓지만': ['널찌만', 'нолчіман'],
    '짧아도': ['짤바도', 'чалбадо'],
    '해돋이를': ['해도지를', 'гедоджірил'],
    '나갔습니다': ['나갇씀니다', 'наґатсимнида'],
    '꽃밭에': ['꼳빠테', 'котпате'],
    '학생의': ['학쌩의', 'гаксені'],
    '책을': ['채글', 'чеґил'],
    '읽었습니다': ['일거씀니다', 'ілґосимнида'],
    '연구원은': ['연구워는', 'йонґувонин'],
    '발음과': ['바름과', 'паримґва'],
    '실제': ['실쩨', 'шілче'],
    '발음의': ['바르미', 'паримі'],
    '차이를': ['차이를', 'чаірил'],
    '자세히': ['자세히', 'часегі'],
    '설명했어요': ['설명해써요', 'солмйонгесойо'],
    '딸이': ['따리', 'тарі'],
  };
  for (const [word, [surface, target]] of Object.entries(expected)) {
    const row = entries.get(word);
    assert.ok(row, 'missing lexical row: ' + word);
    assert.equal(row.surface_hangul, surface, word + ': lexical surface');
    assert.equal(row.target_status, 'provisional', word + ': Ukrainian target must remain explicitly provisional');
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, surface, word + ': engine surface');
    assert.equal(result.ukrainian, target, word + ': target');
    assert.deepEqual(result.issues, [], word + ': issues');
    assert.ok(!result.ukrainian.includes('⟦'), word + ': ' + result.ukrainian);
  }
});

test('short vowel and coda traps are not treated as literal character-by-character substitutions', () => {
  assert.equal(engine.convert('짧아도').surfaceHangul, '짤바도');
  assert.equal(engine.convert('빗고').surfaceHangul, '빋꼬');
  assert.equal(engine.convert('학생의').variants[0]?.surface, '학쌩에');
  assert.equal(engine.convert('발음의').variants[0]?.surface, '바르메');
});
