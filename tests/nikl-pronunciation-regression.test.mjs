import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);

test('obstruent coda before ㄹ triggers ㄹ-to-ㄴ and nasal assimilation', () => {
  const result = engine.convert('독립문');
  assert.equal(result.ukrainian, 'тонніммун');
  assert.match(result.ipa, /toŋ nim mun/);
  assert.ok(result.trace.some((item) => item.rules.includes('liquid-to-nasal-before-obstruent')));
  assert.ok(result.trace.some((item) => item.rules.includes('nasal-assimilation')));
});

test('서울역 applies §29 n-insertion and retains the coda ㄹ', () => {
  const result = engine.convert('서울역');
  assert.equal(result.ukrainian, 'соуллйок');
  assert.match(result.ipa, /sʌ ul ljʌk̚/);
  assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')));
});

test('nasalisation changes both the coda and following liquid in 국립', () => {
  const result = engine.convert('국립');
  assert.equal(result.ukrainian, 'кунніп');
  assert.match(result.ipa, /kuŋ nip̚/);
});

test('ㅇ+ㅢ uses the normative [ɰi] default instead of an unresolved placeholder', () => {
  const result = engine.convert('한국어의 표준 발음');
  assert.equal(result.issues.length, 0);
  assert.ok(!result.ukrainian.includes('⟦'));
  assert.ok(result.ukrainian.includes('ий'));
  assert.match(result.ipa, /ɰi/);
  assert.ok(result.trace.some((item) => item.rules.includes('vowel-ui-default-ɰi')));
});

test('ㅢ with a consonant onset follows §5 and is realized as [i]', () => {
  const result = engine.convert('희망');
  assert.equal(result.ukrainian, 'хіман');
  assert.match(result.ipa, /hi maŋ/);
  assert.ok(result.trace.some((item) => item.rules.includes('vowel-ui-to-i')));
});

test('palatalization applies to ㄷ/ㅌ before ㅣ, not every j-like vowel', () => {
  const result = engine.convert('같이');
  assert.equal(result.ukrainian, 'качі');
  assert.match(result.ipa, /ka tɕʰi/);
  assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')));
  assert.equal(result.status, 'lexical-review');
});

test('ㄷ+히 follows aspiration and then palatalization (§12 + §17)', () => {
  const result = engine.convert('굳히다');
  assert.equal(result.ukrainian, 'кучіда');
  assert.match(result.ipa, /ku tɕʰi da/);
  assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')));
  assert.equal(result.status, 'lexical-review');
});

test('the complete official institution name preserves sequential §19, §18 and §23 rules', () => {
  const result = engine.convert('국립국어원');
  assert.equal(result.ukrainian, 'кунніпкуґовон');
  assert.equal(result.ipa, 'kuŋ nip̚ k͈u ɡʌ wʌn');
  assert.ok(result.trace.some((item) => item.rules.includes('liquid-to-nasal-before-obstruent')));
  assert.ok(result.trace.some((item) => item.rules.includes('nasal-assimilation')));
  assert.ok(result.trace.some((item) => item.rules.includes('tensification')));
});

test('unlicensed spelling-only palatalization is withheld instead of guessed', () => {
  const result = engine.convert('갇이');
  assert.equal(result.status, 'unresolved');
  assert.equal(result.ukrainian, '⟦갇⟧⟦이⟧');
  assert.ok(result.issues.some((issue) => issue.includes('verified formal-morpheme boundary')));
  assert.ok(result.trace.every((item) => !item.rules.includes('palatalization')));
});

test('밭에 does not undergo §17 palatalization because the following vowel is ㅔ', () => {
  const result = engine.convert('밭에');
  assert.match(result.ipa, /pa tʰe/);
  assert.ok(!result.trace.some((item) => item.rules.includes('palatalization')));
});

test('shared lexical pronunciation data is sourced, aligned, and marks provisional Ukrainian targets', () => {
  const rows = parseCsv(lexical);
  const seen = new Set();
  for (const row of rows) {
    assert.ok(!seen.has(row.input), 'duplicate lexical key: ' + row.input);
    seen.add(row.input);
    assert.match(row.source_url, /^https:\/\/(www\.|m\.)?korean\.go\.kr\//, row.input);
    assert.ok([...row.surface_hangul].every((char) => /[가-힣]/u.test(char)), row.input);
    assert.equal([...row.input].length, row.target_syllables.split('|').length, row.input);
    assert.equal([...row.input].length, row.ipa_syllables.split('|').length, row.input);
    if (row.target_status === 'provisional') {
      assert.equal(engine.convert(row.input).status, 'lexical-review', row.input);
    }
  }
});

test('NIKL §17 exact examples use sourced entries; the Ukrainian target stays explicitly provisional', () => {
  const expected = {
    같이: {surface:'가치', target:'качі', ipa:'ka tɕʰi'},
    굳이: {surface:'구지', target:'куджі', ipa:'ku dʑi'},
    곧이듣다: {surface:'고지듣따', target:'коджідитта', ipa:'ko dʑi tɯt̚ t͈a'},
    굳히다: {surface:'구치다', target:'кучіда', ipa:'ku tɕʰi da'},
    닫히다: {surface:'다치다', target:'дачіда', ipa:'ta tɕʰi da'},
    묻히다: {surface:'무치다', target:'мучіда', ipa:'mu tɕʰi da'},
  };
  const rows = parseCsv(lexical);
  for (const [word, values] of Object.entries(expected)) {
    const entry = rows.find((row) => row.input === word);
    assert.ok(entry, word);
    assert.equal(entry.surface_hangul, values.surface, word);
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ukrainian, values.target, word);
    assert.equal(result.ipa, values.ipa, word);
    assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
  }
});

test('NIKL §15 substantive-morpheme liaison uses exact sourced surface forms', () => {
  const expected = {
    맛없다: {surface:'마덥따', target:'\u043c\u0430\u0434\u0435\u043f\u0442\u0442\u0430', ipa:'ma dʌp̚ t͈a'},
    겉옷: {surface:'거돋', target:'ґодот', ipa:'kʌ tot̚'},
    헛웃음: {surface:'허두슴', target:'ходусим', ipa:'hʌ du sɯm'},
    값어치: {surface:'가버치', target:'кабочі', ipa:'ka bʌ tɕʰi'},
    젖어미: {surface:'저더미', target:'джодомі', ipa:'tɕʌ dʌ mi'},
  };
  const rows = parseCsv(lexical);
  for (const [word, values] of Object.entries(expected)) {
    const entry = rows.find((row) => row.input === word);
    assert.ok(entry, word);
    assert.equal(entry.surface_hangul, values.surface, word);
    assert.equal(entry.target_status, 'provisional', word);
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ukrainian, values.target, word);
    assert.equal(result.ipa, values.ipa, word);
    assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
  }
});

test('NIKL §15 exposes both standard readings for 맛있다 and 멋있다', () => {
  const expected = {
    맛있다: {surface:'마딛따', target:'мадіттта', ipa:'ma tit̚ t͈a', alternateSurface:'마싣따', alternateTarget:'машіттта', alternateIpa:'ma ɕit̚ t͈a'},
    멋있다: {surface:'머딛따', target:'модіттта', ipa:'mʌ tit̚ t͈a', alternateSurface:'머싣따', alternateTarget:'мошіттта', alternateIpa:'mʌ ɕit̚ t͈a'},
  };
  for (const [word, values] of Object.entries(expected)) {
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ukrainian, values.target, word);
    assert.equal(result.ipa, values.ipa, word);
    assert.equal(result.variants.length, 1, word);
    assert.equal(result.variants[0].surface, values.alternateSurface, word);
    assert.equal(result.variants[0].ukrainian, values.alternateTarget, word);
    assert.equal(result.variants[0].ipa, values.alternateIpa, word);
    assert.equal(result.variants[0].status, 'lexical-review', word);
  }
  const phrase = engine.convert('맛있다!');
  assert.equal(phrase.variants.length, 1);
  assert.equal(phrase.variants[0].ukrainian, 'машіттта!');
  assert.equal(phrase.variants[0].ipa, 'ma ɕit̚ t͈a!');
});
