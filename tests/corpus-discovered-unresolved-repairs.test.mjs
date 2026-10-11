import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

test('corpus-discovered morphology repairs have official Standard Pronunciation Rule evidence', () => {
  const expected = {
  "밝혀진": {
    "surface": "발켜진",
    "target": "палкхьоджін",
    "ipa": "pal kʰjʌ dʑin",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "빠짐없이": {
    "surface": "빠지멉씨",
    "target": "ппаджімопшші",
    "ipa": "p͈a dʑi mʌp̚ s͈i",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "않았고": {
    "surface": "아낟꼬",
    "target": "анаткко",
    "ipa": "a nat̚ k͈o",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "읽히는": {
    "surface": "일키는",
    "target": "ілкхінин",
    "ipa": "il kʰi nɯn",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "있어서": {
    "surface": "이써서",
    "target": "іссосо",
    "ipa": "i s͈ʌ sʌ",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "있어야": {
    "surface": "이써야",
    "target": "іссоя",
    "ipa": "i s͈ʌ ja",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "있었는지": {
    "surface": "이썬는지",
    "target": "іссоннинджі",
    "ipa": "i s͈ʌn nɯn dʑi",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "있었지만": {
    "surface": "이썯찌만",
    "target": "іссотччіман",
    "ipa": "i s͈ʌt̚ tɕ͈i man",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "짧아지는": {
    "surface": "짤바지는",
    "target": "ччалбаджінин",
    "ipa": "tɕ͈al ba dʑi nɯn",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "헛웃음이": {
    "surface": "허두스미",
    "target": "годусимі",
    "ipa": "hʌ du sɯ mi",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "헛웃음처럼": {
    "surface": "허두슴처럼",
    "target": "годусимчором",
    "ipa": "hʌ du sɯm tɕʰʌ ɾʌm",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "확정값을": {
    "surface": "확쩡갑쓸",
    "target": "гвакччонкапссил",
    "ipa": "hwak̚ tɕ͈ʌŋ kap̚ s͈ɯl",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "흙이": {
    "surface": "흘기",
    "target": "гилґі",
    "ipa": "hɯl ɡi",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
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
