import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

test('corpus-discovered morphology repairs have NIKL or standard-rule evidence', () => {
  const expected = {
  "밟았다": {
    "surface": "발바따",
    "target": "палбатта",
    "ipa": "pal ba t͈a",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "홑이불을": {
    "surface": "혼니부를",
    "target": "гоннібурил",
    "ipa": "hon ni bu ɾɯl",
    "source": "https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=317202"
  },
  "늦어져서": {
    "surface": "느저져서",
    "target": "ниджоджйосо",
    "ipa": "nɯ dʑʌ dʑjʌ sʌ",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "맑았지만": {
    "surface": "말가찌만",
    "target": "малґатччіман",
    "ipa": "mal ɡa t͈ɕi man",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "맑으면": {
    "surface": "말그면",
    "target": "малґимйон",
    "ipa": "mal ɡɯ mjʌn",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "몫을": {
    "surface": "목쓸",
    "target": "мокссил",
    "ipa": "mok̚ s͈ɯl",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "솥이": {
    "surface": "소치",
    "target": "сочі",
    "ipa": "so tɕʰi",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "쌓인": {
    "surface": "싸인",
    "target": "ссаін",
    "ipa": "s͈a in",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "앉으면": {
    "surface": "안즈면",
    "target": "анджимйон",
    "ipa": "an dʑɯ mjʌn",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "앉히고": {
    "surface": "안치고",
    "target": "анчіґо",
    "ipa": "an tɕʰi ɡo",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "없으면": {
    "surface": "업쓰면",
    "target": "опссимйон",
    "ipa": "ʌp̚ s͈ɯ mjʌn",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "없으므로": {
    "surface": "업쓰므로",
    "target": "опссимиро",
    "ipa": "ʌp̚ s͈ɯ mɯ ɾo",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "밝혀서": {
    "surface": "발켜서",
    "target": "палкхьосо",
    "ipa": "pal kʰjʌ sʌ",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "알맞았다": {
    "surface": "알마자따",
    "target": "алмаджатта",
    "ipa": "al ma dʑa t͈a",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "읽고나서": {
    "surface": "일꼬나서",
    "target": "ілкконасо",
    "ipa": "il k͈o na sʌ",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "읽으면서": {
    "surface": "일그면서",
    "target": "ілґимйонсо",
    "ipa": "il ɡɯ mjʌn sʌ",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  },
  "삯일과": {
    "surface": "상닐과",
    "target": "саннілґва",
    "ipa": "saŋ nil ɡwa",
    "source": "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
  }
};
  const rows = parseCsv(lexical);
  for (const [word, item] of Object.entries(expected)) {
    const entry = rows.find((row) => row.input === word);
    assert.ok(entry, word + ': lexical entry exists');
    assert.equal(entry.source_url, item.source, word + ': source URL');
    assert.match(entry.source_url, /^https:\/\/(?:(?:www\.|m\.)?korean\.go\.kr)\//u, word + ': official NIKL source');
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
