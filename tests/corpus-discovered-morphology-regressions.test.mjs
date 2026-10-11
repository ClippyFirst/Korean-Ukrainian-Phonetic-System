import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

test('corpus-discovered source-backed and rule-derived pronunciation cases are regression-locked', () => {
  const expected = {
    읽기: ['일끼','일끼','ілкі','il k͈i'],
    읽어요: ['일거요','일거요','ілґойо','il ɡʌ jo'],
    많이: ['마니','마니','мані','maː ni'],
    밝게: ['발께','발께','палке','pal k͈e'],
    같아: ['가타','가타','ката','ka tʰa'],
    같았던: ['가탇떤','가탇떤','кататтон','ka tʰat̚ t͈ʌn'],
    넓으면: ['널브면','널브면','нолбимйон','nʌl bɯ mjʌn'],
    놓여: ['노여','노여','нойо','no jʌ'],
    많아진다: ['마나진다','마나진다','манаджінда','ma na dʑin da'],
    닭과: ['닥꽈','닥꽈','такква','tak̚ k͈wa'],
    닭고기를: ['닥꼬기를','닥꼬기를','таккоґірил','tak̚ k͈o ɡi ɾɯl'],
    맏이가: ['마지가','마지가','маджіґа','ma dʑi ɡa'],
    밝아: ['발가','발가','палґа','pal ɡa'],
    밟아: ['발바','발바','палба','pal ba'],
    밟아서: ['발바서','발바서','палбасо','pal ba sʌ'],
    넓어져: ['널버져','널버져','нолбоджйо','nʌl bʌ dʑjʌ'],
    넓어서: ['널버서','널버서','нолбосо','nʌl bʌ sʌ'],
    좋아: ['조아','조아','чоа','tɕoː a'],
    좋으면: ['조으면','조으면','чоимйон','tɕo ɯ mjʌn'],
    놓으면: ['노으면','노으면','ноимйон','no ɯ mjʌn'],
    않으면: ['아느면','아느면','анимйон','a nɯ mjʌn'],
    좋은: ['조은','조은','чоин','tɕo ɯn'],
    없어요: ['업써요','업써요','опсойо','ʌp̚ s͈ʌ jo'],
    밟아요: ['발바요','발바요','палбайо','pal ba jo'],
    넓어요: ['널버요','널버요','нолбойо','nʌl bʌ jo'],
    붙이다: ['부치다','부치다','пучіда','pu tɕʰi da'],
    낱낱이: ['난나치','난나치','нанначі','nanː na tɕʰi']
    "밟았다": ['발바따','발바따','палбатта','pal ba t͈a'],
    "홑이불을": ['혼니부를','혼니부를','гоннібурил','hon ni bu ɾɯl'],
    "늦어져서": ['느저져서','느저져서','ниджоджйосо','nɯ dʑʌ dʑjʌ sʌ'],
    "맑았지만": ['말가찌만','말가찌만','малґаччіман','mal ɡa t͈ɕi man'],
    "맑으면": ['말그면','말그면','малгимйон','mal ɡɯ mjʌn'],
    "몫을": ['목쓸','목쓸','мокссил','mok̚ s͈ɯl'],
    "솥이": ['소치','소치','сочі','so tɕʰi'],
    "쌓인": ['싸인','싸인','ссаін','s͈a in'],
    "앉으면": ['안즈면','안즈면','анджимйон','an dʑɯ mjʌn'],
    "앉히고": ['안치고','안치고','анчіґо','an tɕʰi ɡo'],
    "없으면": ['업쓰면','업쓰면','опссимйон','ʌp̚ s͈ɯ mjʌn'],
    "없으므로": ['업쓰므로','업쓰므로','опссимиро','ʌp̚ s͈ɯ ɾo'],
    "밝혀서": ['발켜서','발켜서','палкхьосо','pal kʰjʌ sʌ'],
    "알맞았다": ['알마자따','알마자따','алмаджатта','al ma dʑa t͈a'],
    "읽고나서": ['일꼬나서','일꼬나서','ілкконасо','il k͈o na sʌ'],
    "읽으면서": ['일그면서','일그면서','ілгимйонсо','il ɡɯ mjʌn sʌ'],
    "삯일과": ['상닐과','상닐과','саннілґва','saŋ nil ɡwa'],
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
