import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

test('corpus-discovered directly attested pronunciation cases are sourced and regression-locked', () => {
  const expected = {
    읽기: ['일끼','일끼','ілкі','il k͈i'],
    읽어요: ['일거요','일거요','ілґойо','il ɡʌ jo'],
    많이: ['마니','마니','мані','maː ni'],
    밝게: ['발께','발께','палке','pal k͈e'],
    밝아: ['발가','발가','палґа','pal ɡa'],
    밟아: ['발바','발바','палба','pal ba'],
    밟아서: ['발바서','발바서','палбасо','pal ba sʌ'],
    넓어져: ['널버져','널버져','нолбоджйо','nʌl bʌ dʑjʌ'],
    넓어서: ['널버서','널버서','нолбосо','nʌl bʌ sʌ'],
    좋아: ['조아','조아','чоа','tɕoː a'],
    좋으면: ['조으면','조으면','чоимйон','tɕo ɯ mjʌn'],
    놓으면: ['노으면','노으면','ноимйон','no ɯ mjʌn'],
    않으면: ['아느면','아느면','анимйон','a nɯ mjʌn'],
    좋아: ['조아','조아','чоа','tɕoː a'],
    좋은: ['조은','조은','чоин','tɕo ɯn'],
    없어요: ['업써요','업써요','опсойо','ʌp̚ s͈ʌ jo'],
    밟아요: ['발바요','발바요','палбайо','pal ba jo'],
    넓어요: ['널버요','널버요','нолбойо','nʌl bʌ jo'],
    붙이다: ['부치다','부치다','пучіда','pu tɕʰi da'],
    낱낱이: ['난나치','난나치','нанначі','nanː na tɕʰi']
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
