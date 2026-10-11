import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

test('corpus-discovered source-backed and rule-derived pronunciation cases are regression-locked', () => {
  const expected = {
  "늙게": [
    "늘께",
    "늘께",
    "нилкке",
    "nɯl k͈e"
  ],
  "늙고": [
    "늘꼬",
    "늘꼬",
    "нилкко",
    "nɯl k͈o"
  ],
  "밟았다": [
    "발바따",
    "발바따",
    "палбатта",
    "pal ba t͈a"
  ],
  "홑이불을": [
    "혼니부를",
    "혼니부를",
    "хоннібурил",
    "hon ni bu ɾɯl"
  ],
  "늦어져서": [
    "느저져서",
    "느저져서",
    "ниджоджйосо",
    "nɯ dʑʌ dʑjʌ sʌ"
  ],
  "맑았지만": [
    "말가찌만",
    "말가찌만",
    "малґаччіман",
    "mal ɡa t͈ɕi man"
  ],
  "맑으면": [
    "말그면",
    "말그면",
    "малгимйон",
    "mal ɡɯ mjʌn"
  ],
  "몫을": [
    "목쓸",
    "목쓸",
    "мокссил",
    "mok̚ s͈ɯl"
  ],
  "솥이": [
    "소치",
    "소치",
    "сочі",
    "so tɕʰi"
  ],
  "쌓인": [
    "싸인",
    "싸인",
    "ссаін",
    "s͈a in"
  ],
  "앉으면": [
    "안즈면",
    "안즈면",
    "анджимйон",
    "an dʑɯ mjʌn"
  ],
  "앉히고": [
    "안치고",
    "안치고",
    "анчіґо",
    "an tɕʰi ɡo"
  ],
  "없으면": [
    "업쓰면",
    "업쓰면",
    "опссимйон",
    "ʌp̚ s͈ɯ mjʌn"
  ],
  "없으므로": [
    "업쓰므로",
    "업쓰므로",
    "опссимиро",
    "ʌp̚ s͈ɯ ɾo"
  ],
  "밝혀서": [
    "발켜서",
    "발켜서",
    "палкхьосо",
    "pal kʰjʌ sʌ"
  ],
  "알맞았다": [
    "알마자따",
    "알마자따",
    "алмаджатта",
    "al ma dʑa t͈a"
  ],
  "읽고나서": [
    "일꼬나서",
    "일꼬나서",
    "ілкконасо",
    "il k͈o na sʌ"
  ],
  "읽으면서": [
    "일그면서",
    "일그면서",
    "ілгимйонсо",
    "il ɡɯ mjʌn sʌ"
  ],
  "삯일과": [
    "상닐과",
    "상닐과",
    "саннілґва",
    "saŋ nil ɡwa"
  ]
};
  const rows = parseCsv(lexical);
  for (const [word, [surface, _surfaceAgain, target, ipa]] of Object.entries(expected)) {
    const entry = rows.find((row) => row.input === word);
    assert.ok(entry, word + ': lexical entry exists');
    assert.match(entry.source_url, /^https:\/\/(?:(?:www\.|m\.)?korean\.go\.kr)\//u, word + ': official NIKL source');
    assert.equal(entry.confidence, 'high', word + ': evidence confidence');
    assert.equal(entry.target_status, 'provisional', word + ': Ukrainian target remains provisional');
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, surface, word + ': standard surface form');
    assert.equal(result.ukrainian, target, word + ': Ukrainian approximation');
    assert.equal(result.ipa, ipa, word + ': IPA');
    assert.equal(result.status, 'lexical-review', word + ': target review status');
    assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word + ': lexical evidence used');
    assert.ok(!result.ukrainian.includes('⟦'), word + ': no unresolved placeholder');
  }
});
