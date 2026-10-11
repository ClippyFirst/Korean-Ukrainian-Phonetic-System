import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const genericEngine = createEngine(canonical, '');

const codaCases = {
  '각':'k̚', '갂':'k̚', '갃':'k̚',
  '간':'n', '갅':'n', '갆':'n',
  '갇':'t̚', '갈':'l', '갉':'k̚', '갊':'m',
  '갋':'l', '갌':'l', '갍':'l', '갎':'p̚', '갏':'l',
  '감':'m', '갑':'p̚', '값':'p̚', '갓':'t̚', '갔':'t̚',
  '강':'ŋ', '갖':'t̚', '갗':'t̚', '갘':'k̚', '같':'t̚',
  '갚':'p̚', '갛':'t̚',
};

test('§8–§11 exhaustive coda spelling matrix: all 27 coda Jamo resolve to one of seven standard sounds', () => {
  assert.equal(Object.keys(codaCases).length, 27);
  for (const [word, codaIpa] of Object.entries(codaCases)) {
    const result = genericEngine.convert(word);
    assert.equal(result.issues.length, 0, word);
    assert.equal(result.ipa, 'ka' + codaIpa, word + ': word-final coda');
    assert.ok(!result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word + ': generic engine only');
  }
});

test('§18–§20 exhaustive coda matrix before ㄴ exercises ordered nasal/liquid outcomes', () => {
  const expected = {
    '각나':'kaŋ na', '갂나':'kaŋ na', '갃나':'kaŋ na',
    '간나':'kan na', '갅나':'kan na', '갆나':'kan na',
    '갇나':'kan na', '갈나':'kal la', '갉나':'kaŋ na', '갊나':'kam na',
    '갋나':'kal la', '갌나':'kal la', '갍나':'kal la', '갎나':'kam na', '갏나':'kal la',
    '감나':'kam na', '갑나':'kam na', '값나':'kam na', '갓나':'kan na', '갔나':'kan na',
    '강나':'kaŋ na', '갖나':'kan na', '갗나':'kan na', '갘나':'kaŋ na', '같나':'kan na',
    '갚나':'kam na', '갛나':'kan na',
  };
  assert.equal(Object.keys(expected).length, 27);
  for (const [word, ipa] of Object.entries(expected)) {
    const result = genericEngine.convert(word);
    assert.equal(result.issues.length, 0, word);
    assert.equal(result.ipa, ipa, word);
    assert.ok(!result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word + ': generic engine only');
  }
});

test('§18 exhaustive coda matrix before ㅁ verifies all 27 written codas', () => {
  const expected = {
    '각마':'kaŋ ma', '갂마':'kaŋ ma', '갃마':'kaŋ ma',
    '간마':'kan ma', '갅마':'kan ma', '갆마':'kan ma',
    '갇마':'kan ma', '갈마':'kal ma', '갉마':'kaŋ ma', '갊마':'kam ma',
    '갋마':'kal ma', '갌마':'kal ma', '갍마':'kal ma', '갎마':'kam ma', '갏마':'kal ma',
    '감마':'kam ma', '갑마':'kam ma', '값마':'kam ma', '갓마':'kan ma', '갔마':'kan ma',
    '강마':'kaŋ ma', '갖마':'kan ma', '갗마':'kan ma', '갘마':'kaŋ ma', '같마':'kan ma',
    '갚마':'kam ma', '갛마':'kan ma',
  };
  assert.equal(Object.keys(expected).length, 27);
  for (const [word, ipa] of Object.entries(expected)) {
    const result = genericEngine.convert(word);
    assert.equal(result.issues.length, 0, word);
    assert.equal(result.ipa, ipa, word);
    assert.ok(result.trace.some((item) => item.rules.includes('nasal-assimilation')), word + ': nasal assimilation trace');
    assert.ok(!result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word + ': generic engine only');
  }
});

test('unknown complex-coda liaison and H deletion remain unresolved without morphology', () => {
  for (const input of ['갃아','갅아','갆아','갉아','갋아','갏아','갛아']) {
    const result = genericEngine.convert(input);
    assert.ok(
      result.ukrainian.includes('⟦') || result.issues.length > 0 || result.status === 'unresolved',
      input + ': must not assume formal/substantive morpheme identity',
    );
  }
});
