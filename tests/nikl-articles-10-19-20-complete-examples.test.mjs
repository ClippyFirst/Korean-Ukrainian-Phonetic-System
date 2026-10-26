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
    '넋': [nʌk̚,'нок'],nʌk̚undefined
    '값': [kap̚,'кап'],kap̚undefined
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
    '담력': [tam njʌk̚,['liquid-to-nasal-before-obstruent']],tam njʌk̚undefined
    '침략': [tɕʰim njak̚,['liquid-to-nasal-before-obstruent']],tɕʰim njak̚undefined
    '강릉': [kaŋ nɯŋ,['liquid-to-nasal-before-obstruent']],kaŋ nɯŋundefined
    '항로': [haŋ no,['liquid-to-nasal-before-obstruent']],haŋ noundefined
    '대통령': [tɛ tʰoŋ njʌŋ,['liquid-to-nasal-before-obstruent']],tɛ tʰoŋ njʌŋundefined
    '막론': [maŋ non,['liquid-to-nasal-before-obstruent','nasal-assimilation']],maŋ nonundefined
    '백리': [pɛŋ ni,['liquid-to-nasal-before-obstruent','nasal-assimilation']],pɛŋ niundefined
    '석류': [sʌŋ nju,['liquid-to-nasal-before-obstruent','nasal-assimilation']],sʌŋ njuundefined
    '협력': [hjʌm njʌk̚,['liquid-to-nasal-before-obstruent','nasal-assimilation']],hjʌm njʌk̚undefined
    '십리': [ɕim ni,['liquid-to-nasal-before-obstruent','nasal-assimilation']],ɕim niundefined
    '법리': [pʌm ni,['liquid-to-nasal-before-obstruent','nasal-assimilation']],pʌm niundefined
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
    '난로': nal.lo,nal.loundefined
    '신라': ɕil.la,ɕil.laundefined
    '천리': tɕʰʌl.li,tɕʰʌl.liundefined
    '광한루': kwaŋ.hal.lu,kwaŋ.hal.luundefined
    '대관령': tɛ.ɡwal.ljʌŋ,tɛ.ɡwal.ljʌŋundefined
    '칼날': kʰal.lal,kʰal.lalundefined
    '물난리': mul.lal.li,mul.lal.liundefined
    '할는지': hal.lɯn.dʑi,hal.lɯn.dʑiundefined
    '닳는': tal.lɯn,tal.lɯnundefined
    '뚫는': t͈ul.lɯn,t͈ul.lɯnundefined
    '핥네': hal.le,hal.leundefined
  };
  for (const [word,ipa] of Object.entries(expected)) {
    const result = genericEngine.convert(word);
    assert.equal(result.issues.length, 0, word);
    assert.equal(result.ipa, ipa, word);
    assert.ok(!result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
    assert.ok(result.trace.some((item) => item.rules.includes('liquid-assimilation')), word);
  }
});

test('§20 all listed lexical ㄹ→ㄴ exceptions are sourced and remain exact', () => {
  const expected = {
    '의견란': 의견난,의견난undefined
    '임진란': 임진난,임진난undefined
    '생산량': 생산냥,생산냥undefined
    '결단력': 결딴녁,결딴녁undefined
    '공권력': 공꿘녁,공꿘녁undefined
    '동원령': 동원녕,동원녕undefined
    '상견례': 상견녜,상견녜undefined
    '횡단로': 횡단노,횡단노undefined
    '이원론': 이원논,이원논undefined
    '입원료': 이붠뇨,이붠뇨undefined
    '구근류': 구근뉴,구근뉴undefined
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
