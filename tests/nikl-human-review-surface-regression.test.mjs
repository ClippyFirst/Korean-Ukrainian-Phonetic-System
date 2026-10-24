import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const lexical = parseCsv(lexicalText);
const entries = new Map(lexical.map((row) => [row.input, row]));
const engine = createEngine(canonical, lexicalText);
const officialNikl = /^https:\/\/(?:www\.|m\.)?korean\.go\.kr\//u;
const officialNiklDictionary = /^https:\/\/krdict\.korean\.go\.kr\//u;

// These are intentionally Korean-surface/IPA regressions, not Ukrainian gold labels.
// The Korean surfaces are official NIKL examples or directly source-attested forms.
// IPA is the project's broad analysis layer and remains separately reviewable.
const reviewed = [
  { article: 4, input: '회', surface: '회', ipa: 'hø' },
  { article: 11, input: '읽고', surface: '일꼬', ipa: 'il|k͈o' },
  { article: 11, input: '긁고', surface: '글꼬', ipa: 'kɯl|k͈o' },
  { article: 11, input: '늙고', surface: '늘꼬', ipa: 'nɯl|k͈o' },
  { article: 12, input: '좋다', surface: '조타', ipa: 'tɕo|tʰa' },
  { article: 12, input: '않았다', surface: '아낟따', ipa: 'a|nat̚|t͈a' },
  { article: 13, input: '꽃을', surface: '꼬츨', ipa: 'k͈o|tɕʰɯl' },
  { article: 14, input: '넋이', surface: '넉씨', ipa: 'nʌk̚|ɕ͈i' },
  { article: 14, input: '얇은', surface: '얄븐', ipa: 'jal|bɯn', sourceKind: 'dictionary' },
  { article: 14, input: '읽어', surface: '일거', ipa: 'il|ɡʌ' },
  { article: 15, input: '값어치', surface: '가버치', ipa: 'ka|bʌ|tɕʰi' },
  { article: 15, input: '헛웃음', surface: '허두슴', ipa: 'hʌ|du|sɯm' },
  { article: 16, input: '지읒이', surface: '지으시', ipa: 'tɕi|ɯ|ɕi' },
  { article: 17, input: '굳이', surface: '구지', ipa: 'ku|dʑi' },
  { article: 18, input: '국물', surface: '궁물', ipa: 'kuŋ|mul' },
  { article: 20, input: '신라', surface: '실라', ipa: 'ɕil|la' },
  { article: 21, input: '감기', surface: '감기', ipa: 'kaːm|ɡi' },
  { article: 22, input: '되어', surface: '되어', ipa: 'tø|ʌ' },
  { article: 23, input: '국밥', surface: '국빱', ipa: 'kuk̚|p͈ap̚' },
  { article: 24, input: '안기다', surface: '안기다', ipa: 'an|ɡi|da' },
  { article: 25, input: '넓게', surface: '널께', ipa: 'nʌl|k͈e' },
  { article: 26, input: '갈등', surface: '갈뜽', ipa: 'kal|t͈ɯŋ' },
  { article: 28, input: '문고리', surface: '문꼬리', ipa: 'mun|k͈o|ɾi' },
  { article: 29, input: '솜이불', surface: '솜니불', ipa: 'soːm|ni|bul' },
  { article: 30, input: '깃발', surface: '기빨', ipa: 'ki|p͈al' }
];

test('reviewed NIKL surface examples remain stable across the native engine and lexical evidence', () => {
  assert.equal(reviewed.length, 25);
  for (const item of reviewed) {
    const row = entries.get(item.input);
    assert.ok(row, '§' + item.article + ': missing source-backed lexical row for ' + item.input);
    assert.ok(officialNikl.test(row.source_url) || (item.sourceKind === 'dictionary' && officialNiklDictionary.test(row.source_url)), '§' + item.article + ': source must be an official NIKL page');
    assert.equal(row.surface_hangul, item.surface, '§' + item.article + ': evidence surface ' + item.input);
    assert.equal(row.ipa_syllables, item.ipa, '§' + item.article + ': recorded broad IPA ' + item.input);
    const result = engine.convert(item.input);
    assert.equal(result.surfaceHangul, item.surface, '§' + item.article + ': engine surface ' + item.input);
    assert.equal(result.ipa, item.ipa.split('|').join(' '), '§' + item.article + ': engine IPA ' + item.input);
  }
});

test('optional NIKL readings stay alternatives rather than overwriting the primary reading', () => {
  for (const [input, primary, alternate, primaryIpa, alternateIpa] of [
    ['회', '회', '회', 'hø', 'hwe'],
    ['되어', '되어', '되여', 'tø|ʌ', 'tø|jʌ'],
    ['깃발', '기빨', '긷빨', 'ki|p͈al', 'kit̚|p͈al']
  ]) {
    const row = entries.get(input);
    assert.ok(row, input);
    assert.equal(row.surface_hangul, primary, input);
    assert.equal(row.alternate_surface_hangul, alternate, input);
    assert.equal(row.ipa_syllables, primaryIpa, input);
    assert.equal(row.alternate_ipa_syllables, alternateIpa, input);
  }
});
