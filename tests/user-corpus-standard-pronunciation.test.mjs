import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);
const rows = new Map(parseCsv(lexical).map((row) => [row.input, row]));

test('user-corpus high-risk forms have exact NIKL-backed surface readings', () => {
  const expected = {
    '해돋이': ['해도지', 'хедоджі', 'hɛ do dʑi'],
    '맏이': ['마지', 'маджі', 'ma dʑi'],
    '숱이': ['수치', 'сучі', 'su tɕʰi'],
    '끝이': ['끄치', 'кичі', 'k͈ɯ tɕʰi'],
    '꽃이': ['꼬치', 'кочі', 'k͈o tɕʰi'],
    '밝고': ['발꼬', 'палко', 'pal k͈o'],
    '읽습니다': ['익씀니다', 'іксімніда', 'ik̚ s͈ɯm ni da'],
    '읽을': ['일글', 'ілґил', 'il ɡɯl'],
  };
  for (const [word, [surface, ukrainian, ipa]] of Object.entries(expected)) {
    const entry = rows.get(word);
    assert.ok(entry, 'missing lexical entry: ' + word);
    assert.match(entry.source_url, /^https:\/\/www\.korean\.go\.kr\/kornorms\/regltn\/regltnView\.do\?regltn_code=0002$/u);
    assert.equal(entry.surface_hangul, surface, word);
    assert.equal(entry.target_status, 'provisional', word);
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, surface, word);
    assert.equal(result.ukrainian, ukrainian, word);
    assert.equal(result.ipa, ipa, word);
    assert.equal(result.status, 'lexical-review', word);
    assert.deepEqual(result.issues, [], word);
  }
});

test('NIKL surface pronunciation remains distinct from provisional Ukrainian spelling', () => {
  for (const word of ['해돋이', '맏이', '숱이', '끝이', '꽃이', '밝고', '읽습니다', '읽을']) {
    const result = engine.convert(word);
    assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
    assert.ok(result.trace.every((item) => item.status === 'lexical-review'), word);
  }
});
