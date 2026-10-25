import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';
import { createG2pWebAdapter } from '../src/app/g2pk_web.js';
import { traceIpaMapping } from '../src/app/engine_ipa.js';
import { G2pBrowser } from '../src/vendor/g2pk/g2p-browser.ts';
import { parseCsv } from '../src/app/engine.js';

const root = new URL('../', import.meta.url);
const canonical = readFileSync(new URL('data/korean/canonical_correspondence.csv', root), 'utf8');
const lexical = readFileSync(new URL('data/korean/lexical_pronunciations.csv', root), 'utf8');
const sourceRegister = parseCsv(readFileSync(new URL('research/SOURCE-REGISTER.csv', root), 'utf8'));
const engine = createEngine(canonical, lexical);
const adapter = createG2pWebAdapter(engine);
const rawPort = new G2pBrowser();

const cases = [
  {
    input: '값어치',
    surface: '가버치',
    source: '값어치',
    evidence: /mcfaq_seq=5949/u
  },
  {
    input: '넓죽하다',
    surface: '넙쭈카다',
    source: '넓죽하다',
    evidence: /qna_seq=307219/u
  },
  {
    input: '넓둥글다',
    surface: '넙뚱글다',
    source: '넓둥글다',
    evidence: /qna_seq=322805/u
  },
  {
    input: '넓적하다',
    surface: '넙쩌카다',
    source: '넓적하다',
    evidence: /qna_seq=322805/u
  },
  {
    input: '읽고',
    surface: '일꼬',
    source: '읽고',
    evidence: /qna_seq=329463/u
  },
  {
    input: '싫어서',
    surface: '시러서',
    source: '싫어서',
    evidence: /qna_seq=313981/u
  },
  {
    input: '수많은',
    surface: '수마는',
    source: '수많은',
    evidence: /word 71144/u
  }
];

test('exact NIKL-attested surface divergences are corrected before IPA adaptation', () => {
  for (const item of cases) {
    const result = adapter.convert(item.input);
    assert.equal(result.surfaceHangul, item.surface, item.input + ': normative Korean surface');
    const rawSurface = rawPort.convert(item.input, {
      descriptive: false, verbose: false, groupVowels: false, toSyl: true
    });
    const correctionApplied = rawSurface !== item.surface;
    assert.equal(result.normativeCorrections.length, correctionApplied ? 1 : 0,
      item.input + ': only record a correction when raw port differs');
    if (correctionApplied) {
      assert.equal(result.normativeCorrections[0].source, item.source);
      assert.equal(result.normativeCorrections[0].surface, item.surface);
      assert.match(result.normativeCorrections[0].evidence, item.evidence);
      assert.match(result.analysis, /correction before IPA/u);
    }
    assert.ok(result.ipa, item.input + ': IPA must be emitted from the corrected surface');
    if (item.input === '수많은') {
      assert.match(result.ipa, /ː/u, 'dictionary length mark must survive into IPA');
      assert.match(result.analysis, /lexical vowel length retained in IPA/u);
      assert.ok(result.trace[0].targetFeatures.some(feature => feature.feature === 'vowel-length'),
        'target trace must explicitly report that IPA length is not encoded in Ukrainian orthography');
      assert.equal(result.trace[0].targetFeatures.find(feature => feature.feature === 'vowel-length').handling,
        'preserved-in-ipa-not-rendered-in-ukrainian-target');
    }
    assert.equal(result.issues.length, 0, item.input + ': corrected surface must remain IPA-mappable');
    const mapped = traceIpaMapping(result.ipa);
    assert.equal(mapped.unknown, '', item.input + ': all IPA segments must map');
    assert.equal(result.ukrainian, mapped.tokens.map(token => token.ukrainian).join(''),
      item.input + ': Ukrainian output must be derived from IPA');
  }
});

test('source-backed exceptions are exact-form allowlist entries, not generalized grapheme rules', () => {
  for (const input of ['넓다', '읽는', '같이']) {
    const result = adapter.convert(input);
    assert.deepEqual(result.normativeCorrections, [], input + ': no unsupported correction');
  }
});

test('a correction preserves source offsets and punctuation in running text', () => {
  const result = adapter.convert('읽고, 넓죽하다!');
  assert.equal(result.surfaceHangul, '일꼬, 넙쭈카다!');
  assert.deepEqual(result.normativeCorrections.map(item => item.source), ['읽고', '넓죽하다']);
  assert.equal(result.issues.length, 0);
  let expectedTarget = '';
  for (const item of result.trace) {
    if (item.status === 'literal') {
      expectedTarget += item.source;
      continue;
    }
    const mapped = traceIpaMapping(item.ipa || '');
    assert.equal(mapped.unknown, '', item.source + ': unmapped IPA');
    expectedTarget += mapped.tokens.map(token => token.ukrainian).join('');
  }
  assert.equal(result.ukrainian, expectedTarget, 'running-text target must be reproducible from per-unit IPA');
});

test('every correction is backed by a registered official NIKL source', () => {
  const byId = new Map(sourceRegister.map(row => [row.source_id, row]));
  for (const id of ['SRC-NIKL-MCFAQ-5949', 'SRC-NIKL-QNA-307508', 'SRC-NIKL-QNA-322805', 'SRC-NIKL-QNA-315279', 'SRC-NIKL-QNA-307219', 'SRC-NIKL-QNA-329463', 'SRC-NIKL-QNA-306166', 'SRC-NIKL-QNA-313981', 'SRC-NIKL-KRDICT-71144']) {
    assert.ok(byId.has(id), id + ': evidence source must be registered');
    assert.match(byId.get(id).url, /korean\.go\.kr/u);
    assert.match(byId.get(id).license_status, /KOGL|reuse|marking|not checked/i,
      id + ': source-rights uncertainty must remain explicit');
  }
  const readgo = parseCsv(lexical).find(row => row.input === '읽고');
  assert.ok(readgo);
  assert.match(readgo.source_url, /qna_seq=329463/u);
  assert.match(readgo.rule_notes, /directly attests 읽고\[일꼬\]/u);
});

test('the NIKL-attested 멋있어 variants are explicit alternatives, never gold labels', () => {
  const result = adapter.convert('멋있어');
  const surface = result.surfaceHangul || '멋있어';
  const variants = result.variants || [];
  const evidence = {
    surfaces: ['머디써', '머시써'],
    sourceLocator: /qna_seq=306166/u
  };
  if (evidence.surfaces.includes(surface)) {
    const alternativeSurface = evidence.surfaces.find(value => value !== surface);
    const alternative = engine.convertSurface(alternativeSurface);
    const targetFullySupported = !alternative.issues?.length
      && Boolean(alternative.ipa)
      && Boolean(alternative.ukrainian)
      && !alternative.candidate_status;
    assert.equal(variants.length, targetFullySupported ? 1 : 0,
      'only expose the alternative if its IPA-to-target path is fully supported');
    if (targetFullySupported) {
      assert.equal(variants[0].surface, alternativeSurface);
      assert.equal(variants[0].status, 'lexical-review');
      assert.equal(variants[0].ipaIsGold, false);
      assert.equal(variants[0].ukrainianTargetIsGold, false);
      assert.match(variants[0].sourceLocator, evidence.sourceLocator);
    }
  } else {
    assert.deepEqual(variants, [], 'do not invent a variant when G2P output is not one of the attested readings');
  }
});

