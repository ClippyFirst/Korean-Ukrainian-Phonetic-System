import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const rows = parseCsv(lexical);
const engine = createEngine(canonical, lexical);

test('new adversarial standard-pronunciation forms are sourced and regression-locked', () => {
  const expected = {
    '밝는': { surface: '방는', target: 'паннин', ipa: 'paŋ nɯn' },
    '묽게': { surface: '물께', target: 'мулке', ipa: 'mul k͈e' },
    '실없다': { surface: '시럽따', target: 'шіропта', ipa: 'ɕi ɾʌp̚ t͈a' },
    '몇으로': { surface: '며츠로', target: 'мйочиро', ipa: 'mjʌ tɕʰɯ ɾo' },
    '값있는': { surface: '가빈는', target: 'кабіннин', ipa: 'ka bin nɯn' },
    '앞일': { surface: '암닐', target: 'амніл', ipa: 'am nil' },
    '무늬': { surface: '무니', target: 'муні', ipa: 'mu ni' },
    '넋받이': { surface: '넉빠지', target: 'нокпаджі', ipa: 'nʌk̚ p͈a dʑi' },
  };

  for (const [input, want] of Object.entries(expected)) {
    const row = rows.find((item) => item.input === input);
    assert.ok(row, input + ': exact sourced entry exists');
    assert.match(row.source_url, /^https:\/\/(www\.)?korean\.go\.kr\//u, input + ': official Korean source');
    assert.equal(row.target_status, 'provisional', input + ': Ukrainian target remains provisional');
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, want.surface, input + ': standard surface Hangul');
    assert.equal(result.ukrainian, want.target, input + ': project Ukrainian target');
    assert.equal(result.ipa, want.ipa, input + ': broad IPA');
    assert.equal(result.status, 'lexical-review', input + ': provisional target label');
    assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')), input + ': exact lexical evidence used');
    assert.ok(!result.ukrainian.includes('⟦'), input + ': no unresolved placeholder');
  }
});

test('지식의 retains both NIKL-standard readings of genitive particle 의', () => {
  const row = rows.find((item) => item.input === '지식의');
  assert.ok(row);
  assert.equal(row.surface_hangul, '지시긔');
  assert.equal(row.alternate_surface_hangul, '지시게');
  const result = engine.convert('지식의');
  assert.equal(result.surfaceHangul, '지시긔');
  assert.equal(result.ukrainian, 'джішіґий');
  assert.equal(result.ipa, 'tɕi ɕi ɡɰi');
  assert.equal(result.variants.length, 1);
  assert.equal(result.variants[0].surface, '지시게');
  assert.equal(result.variants[0].ukrainian, 'джішіґе');
  assert.equal(result.variants[0].ipa, 'tɕi ɕi ɡe');
});

test('the contrasting ㄺ/ㄼ/ㄿ/ㅄ contexts keep distinct readings', () => {
  const expected = {
    '읽고': ['일꼬', 'ілко', 'il k͈o'],
    '읽는': ['잉는', 'іннин', 'iŋ nɯn'],
    '읽어': ['일거', 'ілґо', 'il ɡʌ'],
    '밟다': ['밥따', 'папта', 'paːp̚ t͈a'],
    '밟고': ['밥꼬', 'папко', 'paːp̚ k͈o'],
    '밟는': ['밤는', 'памнин', 'paːm nɯn'],
    '맑게': ['말께', 'малке', 'mal k͈e'],
    '묽고': ['물꼬', 'мулко', 'mul k͈o'],
    '읊는': ['음는', 'имнин', 'ɯm nɯn'],
    '값어치': ['가버치', 'кабочі', 'ka bʌ tɕʰi'],
    '값있는': ['가빈는', 'кабіннин', 'ka bin nɯn'],
  };
  for (const [input, [surface, target, ipa]] of Object.entries(expected)) {
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, surface, input);
    assert.equal(result.ukrainian, target, input);
    assert.equal(result.ipa, ipa, input);
    assert.ok(!result.ukrainian.includes('⟦'), input);
  }
});

test('other official coda-plus-fortition examples remain rule-governed', () => {
  const expected = {
    '삯돈': { target: 'сактон', ipa: 'sak̚ t͈on', rules: ['tensification'] },
    '읊조리다': { target: 'ипчоріда', ipa: 'ɯp̚ tɕ͈o ɾi da', rules: ['tensification'] },
    '맑는': { target: 'маннин', ipa: 'maŋ nɯn', rules: ['nasal-assimilation'] },
    '묽는': { target: 'муннин', ipa: 'muŋ nɯn', rules: ['nasal-assimilation'] },
  };
  for (const [input, want] of Object.entries(expected)) {
    const result = engine.convert(input);
    assert.equal(result.ukrainian, want.target, input);
    assert.equal(result.ipa, want.ipa, input);
    for (const rule of want.rules) {
      assert.ok(result.trace.some((item) => item.rules.includes(rule)), input + ': ' + rule);
    }
    assert.ok(!result.ukrainian.includes('⟦'), input);
  }
});
