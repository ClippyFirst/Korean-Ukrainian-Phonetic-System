import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';
import { ipaSyllableToUkrainian, traceIpaMapping, traceIpaMappingDetailed, ipaTargetForSource } from '../src/app/engine_ipa.js';

const canonicalCsv = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexicalCsv = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');

test('IPA trace exposes exact longest-match token to Ukrainian grapheme mappings', () => {
  assert.deepEqual(traceIpaMapping('dʑi'), {
    tokens: [
      { ipa: 'dʑ', ukrainian: 'дж' },
      { ipa: 'i', ukrainian: 'і' }
    ],
    features: [],
    unknown: ''
  });
  assert.deepEqual(traceIpaMapping('ɕi'), {
    tokens: [
      { ipa: 'ɕ', ukrainian: 'ш' },
      { ipa: 'i', ukrainian: 'і' }
    ],
    features: [],
    unknown: ''
  });
});

test('IPA target output is composed from the same tokens displayed in the trace', () => {
  for (const sample of ['dʑi', 'ɕi', 'k͈a', 'tɕʰu', 'ɡʌ']) {
    const mapping = traceIpaMapping(sample);
    assert.equal(mapping.unknown, '', sample);
    assert.equal(
      ipaSyllableToUkrainian(sample).text,
      mapping.tokens.map(token => token.ukrainian).join(''),
      sample
    );
  }
});


test('ASCII Latin g is not accepted as the IPA symbol ɡ', () => {
  assert.deepEqual(traceIpaMapping('ɡ'), {
    tokens: [{ ipa: 'ɡ', ukrainian: 'ґ' }],
    features: [],
    unknown: ''
  });
  assert.deepEqual(traceIpaMapping('g'), {
    tokens: [],
    features: [],
    unknown: 'g'
  });
  assert.deepEqual(ipaSyllableToUkrainian('g'), { text: '', unknown: 'g' });
});

test('unknown IPA segments keep target rendering fail-closed', () => {
  const mapping = traceIpaMapping('ɕ☃');
  assert.equal(mapping.tokens.length, 1);
  assert.equal(mapping.unknown, '☃');
  assert.deepEqual(ipaSyllableToUkrainian('ɕ☃'), { text: '', unknown: '☃' });
});

test('every resolved Korean syllable trace retains its realized surface, IPA and Ukrainian result', () => {
  const engine = createEngine(canonicalCsv, lexicalCsv);
  const result = engine.convert('시', { morphologyMode: 'strict' });
  assert.equal(result.trace.length, 1);
  assert.equal(result.trace[0].source, '시');
  assert.equal(result.trace[0].surface, '시');
  assert.equal(result.trace[0].ipa, 'ɕi');
  assert.equal(result.trace[0].output, 'ші');
  assert.equal(
    ipaSyllableToUkrainian(result.trace[0].ipa).text,
    result.trace[0].output
  );
});

test('service markup exposes all explanatory trace stages', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const app = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  for (const heading of ['Корейський сегмент · вхід', 'Корейська вимова', 'IPA', 'IPA-токен → графема', 'Український запис', 'Нюанс / правило', 'Статус']) {
    assert.ok(html.includes(heading), 'missing trace heading: ' + heading);
  }
  assert.ok(app.includes('traceIpaMapping'));
  assert.ok(app.includes('t.surface||t.source'));
});


test('IPA vowel length remains visible in IPA and is explicitly explained when omitted from Ukrainian orthography', () => {
  const traced = traceIpaMapping('aː');
  assert.deepEqual(traced.tokens, [{ ipa: 'a', ukrainian: 'а' }]);
  assert.deepEqual(traced.features, [{
    ipa: 'ː',
    offset: 1,
    feature: 'vowel-length',
    handling: 'preserved-in-ipa-not-rendered-in-ukrainian-target',
    note: 'Довгота збережена в IPA; окремого знака довготи в практичному українському записі немає.'
  }]);
  assert.equal(traced.unknown, '');
  assert.equal(ipaSyllableToUkrainian('aː').text, 'а', 'target spelling stays unchanged');
  assert.equal(ipaSyllableToUkrainian('aː').unknown, '');
  assert.equal(ipaSyllableToUkrainian('y').text, null, 'provisional target must not become production output');
  assert.equal(ipaSyllableToUkrainian('y').candidateText, 'ві');
});

test('the visible IPA trace renders non-orthographic feature handling rather than silently dropping it', () => {
  const app = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  const ipaEngine = readFileSync(new URL('../src/app/engine_ipa.js', import.meta.url), 'utf8');
  assert.ok(app.includes('const featureTrace=(mappingResult.features||[])'));
  assert.ok(ipaEngine.includes('Довгота збережена в IPA'));
});


test('every long-vowel marker in the lexical IPA inventory is surfaced as a target-layer feature', () => {
  const rows = parseCsv(lexicalCsv);
  let checked = 0;
  for (const row of rows) {
    const syllables = (row.ipa_syllables || '').split('|').filter(Boolean);
    for (const syllable of syllables) {
      const expectedLengthMarks = [...syllable].filter(character => character === 'ː').length;
      if (!expectedLengthMarks) continue;
      const traced = traceIpaMapping(syllable);
      assert.equal(
        traced.features.filter(feature => feature.ipa === 'ː').length,
        expectedLengthMarks,
        row.input + ': every IPA length mark must have an explicit target-layer handling record'
      );
      checked += expectedLengthMarks;
    }
  }
  assert.ok(checked > 0, 'fixture must exercise real lexical IPA length markers');
});


test('browser IPA mappings carry the same explicit status and provenance as the Python target contract', () => {
  const provisional = traceIpaMappingDetailed('kʰjʌ');
  assert.equal(provisional.status, 'provisional');
  assert.equal(provisional.tokens.length, 1);
  assert.equal(provisional.tokens[0].ipa, 'kʰjʌ');
  assert.equal(provisional.tokens[0].ukrainian, 'кхьо');
  assert.equal(provisional.tokens[0].mapping_id, 'KUA-IPA-015');
  assert.equal(provisional.tokens[0].source_ref.length > 0, true);
  assert.ok(provisional.features.some(feature => feature.feature === 'aspiration'));

  for (const ipa of ['ɰi', 'ø', 'y']) {
    assert.equal(traceIpaMappingDetailed(ipa).status, 'provisional', ipa);
  }
});

test('IPA feature losses are inspectable without erasing the source IPA contrast', () => {
  const aspirated = traceIpaMappingDetailed('kʰ');
  const fortis = traceIpaMappingDetailed('k͈');
  const unreleased = traceIpaMappingDetailed('k̚');
  assert.equal(aspirated.tokens[0].ipa, 'kʰ');
  assert.equal(aspirated.features[0].feature, 'aspiration');
  assert.equal(fortis.features[0].feature, 'fortisness');
  assert.equal(unreleased.features[0].feature, 'unreleased-stop');
  assert.ok([aspirated, fortis, unreleased].every(item =>
    item.features[0].handling === 'preserved-in-ipa-not-rendered-in-ukrainian-target'
  ));
});

test('dot-separated IPA syllables align to Hangul source and preserve punctuation', () => {
  const result = ipaTargetForSource('서울역!', 'sʌ.ul.ljʌk̚');
  assert.ok(result.text.endsWith('!'), 'source punctuation must be preserved');
  assert.ok(result.text.length > 1, 'all IPA syllables should render');
  assert.equal(result.status, 'model-selected');
  assert.equal(result.mappingTrace.length > 0, true);
});

test('IPA/source syllable misalignment fails closed instead of shifting targets', () => {
  const result = ipaTargetForSource('서울역', 'sʌ.ul');
  assert.equal(result.text, '');
  assert.equal(result.status, 'unavailable');
  assert.equal(result.reason, 'ipa_source_alignment_mismatch');
});

test('provisional IPA target is withheld by default and remains inspectable as a research candidate', () => {
  const result = ipaTargetForSource('위', 'y');
  assert.equal(result.text, null);
  assert.equal(result.candidateText, 'ві');
  assert.equal(result.status, 'unavailable');
  assert.equal(result.candidateStatus, 'provisional');
  assert.equal(result.reason, 'provisional_mapping_requires_review');
  assert.equal(result.mappingTrace[0].mapping_id, 'KUA-IPA-027');

  const research = ipaTargetForSource('위', 'y', {allowProvisional:true});
  assert.equal(research.text, 'ві');
  assert.equal(research.status, 'provisional');
  assert.equal(traceIpaMappingDetailed('').status, 'unavailable');
});

