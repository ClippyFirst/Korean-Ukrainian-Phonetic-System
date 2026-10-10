import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const lexicalInputs = new Set(parseCsv(lexicalText).map((row) => row.input));
const engine = createEngine(canonical, lexicalText);
const generic = createEngine(canonical, '');

// These expected triples are intentionally literal test oracles. Do not build
// them from lexical_pronunciations.csv: that would let a bad data edit update
// both the actual result and the expected result without failing the test.
const independentFixtures = [
  ['밭일', '반닐', 'панніл', 'pan nil'],
  ['굳이', '구지', 'куджі', 'ku dʑi'],
  ['않았다', '아낟따', 'анатта', 'a nat̚ t͈a'],
  ['밝은', '발근', 'палґин', 'pal ɡɯn'],
  ['끝없이', '끄덥씨', 'китопші', 'k͈ɯ tʌp̚ s͈i'],
  ['발견했어요', '발견해써요', 'палґйонгесойо', 'pal ɡjʌn hɛ s͈ʌ jo'],
  ['읽은', '일근', 'ілґин', 'il ɡɯn'],
  ['읽었다', '일걷따', 'ілґотта', 'il ɡʌt̚ t͈a'],
  ['없이', '업씨', 'опші', 'ʌp̚ s͈i'],
  ['해돋이는', '해도지는', 'гедоджінин', 'hɛ do dʑi nɯn'],
];

test('independent fixed oracles protect high-risk NIKL pronunciation fixtures from CSV self-confirmation', () => {
  for (const [input, surface, ukrainian, ipa] of independentFixtures) {
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, surface, input + ': Korean surface pronunciation');
    assert.equal(result.ukrainian, ukrainian, input + ': project Ukrainian approximation');
    assert.equal(result.ipa, ipa, input + ': broad IPA');
    assert.ok(!result.ukrainian.includes('⟦'), input + ': a sourced fixture must not be unresolved');
  }
});

test('punctuation wrapping does not change an exact lexical word pronunciation', () => {
  for (const [input, surface, ukrainian, ipa] of independentFixtures) {
    const plain = engine.convert(input);
    const wrapped = engine.convert('「' + input + '」');
    assert.equal(wrapped.ukrainian, '「' + plain.ukrainian + '」', input + ': preserve punctuation around Ukrainian output');
    assert.equal(wrapped.ipa, '「' + plain.ipa + '」', input + ': preserve punctuation around IPA');
    assert.ok(wrapped.issues.length === 0, input + ': punctuation must not create a new pronunciation issue');
    // The wrapper is literal text; it must not be mistaken for a new lexical key.
    assert.equal(plain.surfaceHangul, surface);
    assert.equal(plain.ukrainian, ukrainian);
    assert.equal(plain.ipa, ipa);
  }
});

test('unlicensed morphology stays unresolved when surrounded by punctuation or neutral text', () => {
  const unresolvedInputs = ['갇이', '갛아', '갉아', '넓아다', '놓아라'];
  for (const input of unresolvedInputs) {
    const plain = generic.convert(input);
    assert.ok(
      plain.ukrainian.includes('⟦') || plain.issues.length > 0 || plain.status === 'unresolved',
      input + ': generic engine must fail closed without lexical/morphological evidence',
    );
    for (const wrappedInput of ['「' + input + '」', '앞말, ' + input + '!']) {
      const wrapped = generic.convert(wrappedInput);
      assert.ok(
        wrapped.ukrainian.includes('⟦') || wrapped.issues.length > 0 || wrapped.status === 'unresolved',
        wrappedInput + ': punctuation or neighboring text must not silently license the unknown morphology',
      );
    }
  }
});

test('generic rule fixtures stay independent of the lexical override layer', () => {
  const genericOracles = [
    ['국물', 'kuŋ mul'],
    ['막론', 'maŋ non'],
    ['신라', 'ɕil la'],
    ['값', 'kap̚'],
    ['넋', 'nʌk̚'],
  ];
  for (const [input, expectedIpa] of genericOracles) {
    const result = generic.convert(input);
    assert.equal(result.ipa, expectedIpa, input + ': generic IPA oracle');
    assert.ok(
      !result.trace.some((item) => item.rules.includes('lexical-pronunciation')),
      input + ': generic mode must not use lexical overrides',
    );
    if (!lexicalInputs.has(input)) {
      assert.equal(engine.convert(input).ipa, expectedIpa, input + ': adding the lexicon must not alter an unlisted generic reading');
    }
  }
});


test('ordered §19 → §18 → §20 interaction matrix remains stable for all seven representative codas before ㄹ', () => {
  // Expected IPA is written independently here; this specifically guards
  // against applying nasalization before changing the following ㄹ to ㄴ.
  const cases = [
    ['각라', 'kaŋ na', ['liquid-to-nasal-before-obstruent', 'nasal-assimilation']],
    ['갇라', 'kan na', ['project-inferred-d-liquid-nasalization', 'nasal-assimilation']],
    ['갑라', 'kam na', ['liquid-to-nasal-before-obstruent', 'nasal-assimilation']],
    ['간라', 'kal la', ['liquid-assimilation']],
    ['갈라', 'kal la', []],
    ['감라', 'kam na', ['liquid-to-nasal-before-obstruent']],
    ['강라', 'kaŋ na', ['liquid-to-nasal-before-obstruent']],
  ];
  for (const [input, expectedIpa, requiredRules] of cases) {
    const result = generic.convert(input);
    assert.equal(result.issues.length, 0, input + ': expected generic composition to resolve');
    assert.ok(!result.ukrainian.includes('⟦'), input + ': no unresolved marker expected');
    assert.equal(result.ipa, expectedIpa, input + ': independent IPA oracle');
    const traceRules = new Set(result.trace.flatMap((item) => item.rules));
    for (const rule of requiredRules) {
      assert.ok(traceRules.has(rule), input + ': missing rule trace ' + rule);
    }
    assert.deepEqual(generic.convert(input).ipa, result.ipa, input + ': repeated conversion must be deterministic');
  }
});

test('a punctuation boundary blocks the same cross-syllable interaction chain', () => {
  const blocked = new Set([
    'liquid-to-nasal-before-obstruent',
    'project-inferred-d-liquid-nasalization',
    'nasal-assimilation',
    'liquid-assimilation',
  ]);
  for (const input of ['각,라', '갇!라', '갑.라', '간—라', '감;라', '강/라']) {
    const result = generic.convert(input);
    assert.ok(
      !result.trace.some((item) => item.rules.some((rule) => blocked.has(rule))),
      input + ': cross-boundary sound rules must not fire through punctuation',
    );
  }
});
