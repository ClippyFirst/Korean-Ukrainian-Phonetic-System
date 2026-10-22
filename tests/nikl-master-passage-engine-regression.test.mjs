import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const corpus = readFileSync(new URL('./fixtures/nikl-all-articles-master-passage-2026-10-22.txt', import.meta.url), 'utf8');
const rows = parseCsv(lexical);
const entries = new Map(rows.map((row) => [row.input, row]));
const engine = createEngine(canonical, lexical);
const tokens = [...new Set(corpus.match(/[가-힣]+/gu) || [])];

test('master passage is passed through the browser engine and emits a reproducible coverage-gap report', () => {
  const wholeStrict = engine.convert(corpus);
  const wholePractical = engine.convert(corpus, { morphologyMode: 'practical' });
  const report = {
    corpusCharacters: [...corpus].length,
    uniqueHangulTokens: tokens.length,
    lexicalHits: 0,
    genericResolved: 0,
    unresolved: [],
    issues: [],
    wholeTextStrict: {
      outputCharacters: [...wholeStrict.ukrainian].length,
      ipaCharacters: [...wholeStrict.ipa].length,
      issueCount: (wholeStrict.issues || []).length,
      expectedStandaloneJamoWarnings: (wholeStrict.issues || []).filter((issue) => /standalone compatibility jamo is not a syllable/u.test(issue)).length,
      actionableIssueSamples: (wholeStrict.issues || []).filter((issue) => !/standalone compatibility jamo is not a syllable/u.test(issue)).slice(0, 25),
      placeholderCount: (wholeStrict.ukrainian.match(/[⟦⟧]/gu) || []).length,
    },
    wholeTextPractical: {
      outputCharacters: [...wholePractical.ukrainian].length,
      ipaCharacters: [...wholePractical.ipa].length,
      issueCount: (wholePractical.issues || []).length,
      expectedStandaloneJamoWarnings: (wholePractical.issues || []).filter((issue) => /standalone compatibility jamo is not a syllable/u.test(issue)).length,
      actionableIssueSamples: (wholePractical.issues || []).filter((issue) => !/standalone compatibility jamo is not a syllable/u.test(issue)).slice(0, 25),
      placeholderCount: (wholePractical.ukrainian.match(/[⟦⟧]/gu) || []).length,
    },
  };

  for (const token of tokens) {
    const result = engine.convert(token);
    const row = entries.get(token);
    if (row) {
      report.lexicalHits += 1;
      assert.equal(result.surfaceHangul, row.surface_hangul, token + ': lexical surface drift');
      if (row.target_status !== 'surface-only') {
        assert.equal(result.ipa, row.ipa_syllables.split('|').join(' '), token + ': lexical IPA drift');
        assert.equal(result.ukrainian, row.target_syllables.split('|').join(''), token + ': IPA-derived Ukrainian target drift');
      }
    } else if (result.status === 'unresolved' || result.ukrainian.includes('⟦') || result.ukrainian.includes('⟧')) {
      report.unresolved.push({ token, status: result.status, output: result.ukrainian, issues: result.issues });
    } else {
      report.genericResolved += 1;
    }
    if ((result.issues || []).length) report.issues.push({ token, issues: result.issues });
  }

  console.log('NIKL_MASTER_PASSAGE_ENGINE_REPORT=' + JSON.stringify({
    ...report,
    unresolved: report.unresolved.slice(0, 160),
    issues: report.issues.slice(0, 160),
    unresolvedTruncated: report.unresolved.length > 160,
    issuesTruncated: report.issues.length > 160,
  }));

  assert.ok(tokens.length > 500, 'the integrated passage should remain a substantial stress corpus');
  assert.ok(report.lexicalHits > 30, 'the passage must exercise many existing source-backed lexical entries');
  assert.ok(wholeStrict.ipa.length > 0, 'strict whole-text conversion must produce its IPA-stage result');
  assert.ok(wholePractical.ipa.length > 0, 'practical whole-text conversion must produce its IPA-stage result');
  assert.doesNotMatch(wholePractical.ukrainian, /[⟦⟧]/u, 'practical mode must not leak unresolved placeholders into the full passage');
  assert.equal(report.wholeTextStrict.actionableIssueSamples.length, 0, 'all strict whole-text issues beyond explicitly expected standalone-jamo warnings must be reviewed');
  assert.equal(report.wholeTextPractical.actionableIssueSamples.length, 0, 'all practical whole-text issues beyond explicitly expected standalone-jamo warnings must be reviewed');
});

test('core source-backed examples in the passage retain the current engine surface and IPA', () => {
  const expected = {
    '굳이': ['구지', 'ku dʑi'],
    '같이': ['가치', 'ka tɕʰi'],
    '읽다': ['익따', 'ik̚ t͈a'],
    '읽고': ['일꼬', 'il k͈o'],
    '맑다': ['막따', 'mak̚ t͈a'],
    '맑고': ['말꼬', 'mal k͈o'],
    '밟다': ['밥따', 'paːp̚ t͈a'],
    '넓죽하다': ['넙쭈카다', 'nʌp̚ tɕ͈u kʰa da'],
    '값어치': ['가버치', 'ka bʌ tɕʰi'],
    '꽃잎': ['꼰닙', 'k͈on nip̚'],
    '솜이불': ['솜니불', 'soːm ni bul'],
    '색연필': ['생년필', 'sɛŋ ɲʌn pʰil'],
    '신라': ['실라', 'ɕil la'],
    '국물': ['궁물', 'kuŋ mul'],
    '먹는': ['멍는', 'mʌŋ nɯn'],
    '놓고': ['노코', 'no kʰo'],
    '좋던': ['조턴', 'tɕoː tʰʌn'],
    '많고': ['만코', 'man kʰo'],
    '싫어': ['시러', 'ɕi ɾʌ'],
    '밭이': ['바치', 'pa tɕʰi'],
    '맛있다': ['마딛따', 'ma dit̚ t͈a'],
    '멋있다': ['머딛따', 'mʌ dit̚ t͈a'],
    '서울역': ['서울력', 'sʌ ul ljʌk̚'],
    '검열': ['검녈', 'kʌːm ɲʌl'],
    '금융': ['금늉', 'kɯm ɲuŋ'],
  };

  for (const [word, [surface, ipa]] of Object.entries(expected)) {
    const row = entries.get(word);
    assert.ok(row, 'missing source-backed lexicon row: ' + word);
    assert.equal(row.surface_hangul, surface, word + ': stored surface');
    assert.equal(row.ipa_syllables.split('|').join(' '), ipa, word + ': stored IPA');
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, surface, word + ': engine surface');
    assert.equal(result.ipa, ipa, word + ': engine IPA');
    assert.equal(result.ukrainian, row.target_syllables.split('|').join(''), word + ': Ukrainian target must come from the stored IPA target');
  }
});

test('licensed pronunciation variants in the passage are surfaced instead of silently collapsed', () => {
  for (const [word, primary, alternate] of [
    ['맛있다', '마딛따', '마싣따'],
    ['멋있다', '머딛따', '머싣따'],
  ]) {
    const row = entries.get(word);
    assert.ok(row, word);
    assert.equal(row.surface_hangul, primary);
    assert.equal(row.alternate_surface_hangul, alternate);
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, primary);
    assert.ok(result.variants.some((variant) => variant.surface === alternate), word + ': missing licensed variant');
  }
});
