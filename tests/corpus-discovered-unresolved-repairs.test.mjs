import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

test('corpus-discovered morphology repairs have official Standard Pronunciation Rule evidence', () => {
  const expected = {
  "늙게": {
    "surface": "늘께",
    "target": "нилке",
    "ipa": "nɯl k͈e",
    "source": "https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=319360"
  },
  "늙고": {
    "surface": "늘꼬",
    "target": "нилко",
    "ipa": "nɯl k͈o",
    "source": "https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=319360"
  }
};
  const rows = parseCsv(lexical);
  for (const [word, item] of Object.entries(expected)) {
    const entry = rows.find((row) => row.input === word);
    assert.ok(entry, word + ': lexical entry exists');
    assert.equal(entry.source_url, item.source, word + ': source URL');
    assert.equal(entry.confidence, 'high', word + ': Korean standard evidence');
    assert.equal(entry.target_status, 'provisional', word + ': Ukrainian approximation remains provisional');
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, item.surface, word + ': standard surface form');
    assert.equal(result.ukrainian, item.target, word + ': Ukrainian approximation');
    assert.equal(result.ipa, item.ipa, word + ': IPA');
    assert.equal(result.status, 'lexical-review', word + ': target review status');
    assert.ok(result.trace.some((trace) => trace.rules.includes('lexical-pronunciation')), word + ': trace uses sourced row');
    assert.ok(!result.ukrainian.includes('⟦'), word + ': no unresolved placeholder');
  }
});
