import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const entries = new Map(parseCsv(lexical).map((row) => [row.input, row]));
const engine = createEngine(canonical, lexical);
const genericEngine = createEngine(canonical, '');
const officialSource = /^https:\/\/(www\.|m\.)?korean\.go\.kr\//u;

test('§10 simple complex-coda controls 넋 and 값 are computed without lexical overrides', () => {
  const expected = {
    '넋':['nʌk̚','нок'],
    '값':['kap̚','кап'],
  };
  for (const [word,[ipa,target]] of Object.entries(expected)) {
    assert.ok(!entries.has(word), word + ': this general rule must not be hidden by a lexical override');
    const result = genericEngine.convert(word);
    assert.equal(result.issues.length, 0, word);
    assert.equal(result.ipa, ipa, word);
    assert.equal(result.ukrainian, target, word);
    assert.ok(!result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
  }
});

test('§19 every explicit example uses the correct ordered nasalization chain', () => {
  const expected = {
    '담력':['tam njʌk̚',['liquid-to-nasal-before-obstruent']],
    '침략':['tɕʰim njak̚',['liquid-to-nasal-before-obstruent']],
    '강릉':['kaŋ nɯŋ',['liquid-to-nasal-before-obstruent']],
    '항로':['haŋ no',['liquid-to-nasal-before-obstruent']],
    '대통령':['tɛ tʰoŋ njʌŋ',['liquid-to-nasal-before-obstruent']],
    '막론':['maŋ non',['liquid-to-nasal-before-obstruent','nasal-assimilation']],
    '백리':['pɛŋ ni',['liquid-to-nasal-before-obstruent','nasal-assimilation']],
    '석류':['sʌŋ nju',['liquid-to-nasal-before-obstruent','nasal-assimilation']],
    '협력':['hjʌm njʌk̚',['liquid-to-nasal-before-obstruent','nasal-assimilation']],
    '십리':['ɕim ni',['liquid-to-nasal-before-obstruent','nasal-assimilation']],
    '법리':['pʌm ni',['liquid-to-nasal-before-obstruent','nasal-assimilation']],
  };
  for (const [word,[ipa,rules]] of Object.entries(expected)) {
    const result = genericEngine.convert(word);
    assert.equal(result.issues.length, 0, word);
    assert.equal(result.ipa, ipa, word);
    assert.ok(!result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
    for (const rule of rules) assert.ok(result.trace.some((item) => item.rules.includes(rule)), word + ': ' + rule);
  }
});

test('§20 every listed general liquid-assimilation example is computed algorithmically', () => {
  const expected = {
    '난로':'nal lo',
    '신라':'ɕil la',
    '천리':'tɕʰʌl li',
    '광한루':'kwaŋ hal lu',
    '대관령':'tɛ ɡwal ljʌŋ',
    '칼날':'kʰal lal',
    '물난리':'mul lal li',
    '할는지':'hal lɯn dʑi',
    '닳는':'tal lɯn',
    '뚫는':'t͈ul lɯn',
    '핥네':'hal le',
  };
  for (const [word,ipa] of Object.entries(expected)) {
    assert.ok(!entries.has(word) || entries.get(word).target_status === 'surface-only', word + ': any lexicon row must be non-overriding surface evidence');
    const result = genericEngine.convert(word);
    assert.equal(result.issues.length, 0, word);
    assert.equal(result.ipa, ipa, word);
    assert.ok(!result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
    assert.ok(result.trace.some((item) => item.rules.includes('liquid-assimilation')), word);
  }
});

test('§20 all listed lexical ㄹ→ㄴ exceptions are sourced and remain exact', () => {
  const expected = {
    '의견란':'의견난',
    '임진란':'임진난',
    '생산량':'생산냥',
    '결단력':'결딴녁',
    '공권력':'공꿘녁',
    '동원령':'동원녕',
    '상견례':'상견녜',
    '횡단로':'횡단노',
    '이원론':'이원논',
    '입원료':'이붠뇨',
    '구근류':'구근뉴',
  };
  for (const [word,surface] of Object.entries(expected)) {
    const row = entries.get(word);
    assert.ok(row, 'missing §20 listed exception: ' + word);
    assert.match(row.source_url, officialSource, word);
    assert.equal(row.surface_hangul, surface, word);
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, surface, word);
    assert.equal(result.ipa, row.ipa_syllables.split('|').join(' '), word);
    assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
  }
});
