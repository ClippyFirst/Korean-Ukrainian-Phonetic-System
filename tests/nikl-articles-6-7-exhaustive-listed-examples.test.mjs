import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const entries = new Map(parseCsv(lexical).map((row) => [row.input, row]));
const engine = createEngine(canonical, lexical);
const officialSource = /^https:\/\/(www\.|m\.)?korean\.go\.kr\//u;

function assertOfficial(word, surface, ipa, { long = false, short = false } = {}) {
  const row = entries.get(word);
  assert.ok(row, 'missing sourced §6–7 example: ' + word);
  assert.match(row.source_url, officialSource, word);
  assert.equal(row.surface_hangul, surface, word);
  assert.equal(row.ipa_syllables.split('|').join(' '), ipa, word);
  const result = engine.convert(word);
  assert.equal(result.surfaceHangul, surface, word);
  assert.equal(result.ipa, ipa, word);
  assert.equal(result.ukrainian, row.target_syllables.split('|').join(''), word);
  if (long) assert.match(ipa, /ː/u, word + ': expected a long vowel');
  if (short) assert.doesNotMatch(ipa, /ː/u, word + ': expected no long vowel');
}

test('§6(1) every official first-syllable length example is explicitly tested', () => {
  const examples = {
    '눈보라':['눈보라','nuːn bo ɾa'],
    '말씨':['말씨','maːl s͈i'],
    '밤나무':['밤나무','paːm na mu'],
    '많다':['만타','maːn tʰa'],
    '멀리':['멀리','mʌːl li'],
    '벌리다':['벌리다','pʌːl li da'],
  };
  for (const [word, [surface, ipa]] of Object.entries(examples)) assertOfficial(word, surface, ipa, {long:true});
});

test('§6(2) all official short-vowel contrast examples remain short', () => {
  const examples = {
    '첫눈':['천눈','tɕʰʌn nun'],
    '참말':['참말','tɕʰam mal'],
    '쌍동밤':['쌍동밤','s͈aŋ doŋ pam'],
    '수많이':['수마니','suː ma ni'],
    '눈멀다':['눈멀다','nun mʌl ta'],
    '떠벌리다':['떠벌리다','t͈ʌ bʌl li da'],
  };
  for (const [word, [surface, ipa]] of Object.entries(examples)) {
    // 수많이 is the explicit long-vowel counterexample in this subsection.
    assertOfficial(word, surface, ipa, word === '수많이' ? {long:true} : {short:true});
  }
});

test('§6 compound exceptions retain long vowels beyond the first syllable and both 반신반의 readings', () => {
  assertOfficial('재삼재사','재삼재사','tɕɛː sam dʑɛː sa',{long:true});
  const row = entries.get('반신반의');
  assert.ok(row);
  assert.match(row.source_url, officialSource);
  const result = engine.convert('반신반의');
  assert.equal(result.surfaceHangul, '반신바늬');
  assert.equal(result.ipa, 'paːn ɕin baː ni');
  assert.equal(result.variants.length, 1);
  assert.equal(result.variants[0].surface, '반신바니');
  assert.equal(result.variants[0].ipa, 'paːn ɕin baː ni');
});

test('§6 contracted -아/-어 forms cover every listed long-vowel form and every explicit short exception', () => {
  const long = {
    '봐':['봐','pwaː'],
    '겨':['겨','kjʌː'],
    '돼':['돼','twɛː'],
    '둬':['둬','twʌː'],
    '해':['해','hɛː'],
  };
  for (const [word,[surface,ipa]] of Object.entries(long)) assertOfficial(word,surface,ipa,{long:true});

  const short = {
    '와':['와','wa'],
    '져':['저','tɕʌ'],
    '쪄':['쩌','tɕ͈ʌ'],
    '쳐':['처','tɕʰʌ'],
  };
  for (const [word,[surface,ipa]] of Object.entries(short)) assertOfficial(word,surface,ipa,{short:true});
});

test('§7 long-vowel citation forms are paired with the short/retained inflected forms', () => {
  const citation = {
    '감다':['감따','kaːm t͈a'],
    '밟다':['밥따','paːp̚ t͈a'],
    '신다':['신따','ɕiːn t͈a'],
    '알다':['알다','aːl da'],
    '끌다':['끌따','k͈ɯl t͈a'],
    '떨다':['떨다','t͈ʌːl da'],
    '벌다':['벌다','pʌːl da'],
    '쓸다':['쓸다','s͈ɯːl da'],
    '떫다':['떨따','t͈ʌːl t͈a'],
    '없다':['업따','ʌːp̚ t͈a'],
  };
  for (const [word,[surface,ipa]] of Object.entries(citation)) assertOfficial(word,surface,ipa,{long:true});
});

test('§7(1) short-vowel alternations and every official length-retention exception are distinguished', () => {
  const short = {
    '감으니':['가므니','ka mɯ ni'],
    '밟으면':['발브면','pal bɯ mjʌn'],
    '신어':['시너','ɕi nʌ'],
    '알아':['아라','a ɾa'],
  };
  for (const [word,[surface,ipa]] of Object.entries(short)) assertOfficial(word,surface,ipa,{short:true});

  const retained = {
    '끌어':['끄러','k͈ɯː ɾʌ'],
    '떨은':['떨븐','t͈ʌːl bɯn'],
    '벌어':['버러','pʌː ɾʌ'],
    '쓸어':['써러','s͈ʌː ɾʌ'],
    '없으니':['업쓰니','ʌːp̚ s͈ɯ ni'],
  };
  for (const [word,[surface,ipa]] of Object.entries(retained)) assertOfficial(word,surface,ipa,{long:true});
});

test('§7(2) suffixes normally shorten the vowel, but listed lexical exceptions retain length', () => {
  const short = {
    '감기다':['감기다','kam ɡi da'],
    '꼬이다':['꼬이다','k͈o i da'],
    '밟히다':['발피다','pal pʰi da'],
  };
  for (const [word,[surface,ipa]] of Object.entries(short)) assertOfficial(word,surface,ipa,{short:true});

  const retained = {
    '끌리다':['끌리다','k͈ɯːl li da'],
    '떨리다':['떨리다','t͈ʌːl li da'],
    '없애다':['업쌔다','ʌːp̚ s͈ɛ da'],
  };
  for (const [word,[surface,ipa]] of Object.entries(retained)) assertOfficial(word,surface,ipa,{long:true});
});

test('§7 compound controls 밀물 and 썰물 are short regardless of the length of their components', () => {
  assertOfficial('밀물','밀물','mil mul',{short:true});
  assertOfficial('썰물','썰물','s͈ʌl mul',{short:true});
});
