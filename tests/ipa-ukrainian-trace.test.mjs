import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';
import { ipaSyllableToUkrainian, ipaSyllablesToUkrainian, traceIpaMapping, traceIpaMappingDetailed, ipaTargetForSource } from '../src/app/engine_ipa.js';

const canonicalCsv = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const jamoCsv = readFileSync(new URL('../data/korean/jamo.csv', import.meta.url), 'utf8');
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
  assert.equal(result.text, null, 'unavailable is distinct from a successful empty spelling');
  assert.deepEqual(result.syllables, [], 'misaligned output must not expose partial syllables');
  assert.equal(result.status, 'unavailable');
  assert.equal(result.reason, 'ipa_source_alignment_mismatch');
});

test('IPA consisting only of separators or a length mark cannot render as an empty success', () => {
  for (const ipa of ['.', '...', 'ː', '.ː.', '#']) {
    const trace = traceIpaMappingDetailed(ipa);
    assert.equal(trace.status, 'unavailable', ipa);
    assert.equal(trace.reason, 'no_renderable_ipa_segments', ipa);
    const result = ipaTargetForSource('가', ipa);
    assert.equal(result.text, null, ipa);
    assert.equal(result.status, 'unavailable', ipa);
    assert.equal(result.reason, 'no_renderable_ipa_segments', ipa);
    assert.deepEqual(result.syllables, [], ipa);
  }
});

test('unknown IPA and empty IPA return an unavailable result, never a partial or empty-string success', () => {
  const unknown = ipaTargetForSource('가나', 'ka.☃');
  assert.equal(unknown.text, null);
  assert.equal(unknown.status, 'unavailable');
  assert.equal(unknown.reason, 'unmapped_ipa_sequence');
  assert.deepEqual(unknown.syllables, []);
  assert.ok(unknown.mappingTrace.length > 0, 'resolved IPA prefix remains available as diagnostic trace');

  const empty = ipaTargetForSource('가', '');
  assert.equal(empty.text, null);
  assert.equal(empty.status, 'unavailable');
  assert.equal(empty.reason, 'empty_ipa');
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


test('main browser conversion withholds provisional target output and exposes only a labelled candidate', () => {
  const engine = createEngine(jamoCsv, lexicalCsv);
  const result = engine.convert('의', { morphologyMode: 'strict' });
  assert.equal(result.ukrainian, '');
  assert.equal(result.target_status, 'unavailable');
  assert.equal(result.candidate_ukrainian, 'ий');
  assert.equal(result.candidate_status, 'provisional');
  assert.equal(result.trace[0].candidateOutput, 'ий');
  assert.equal(result.trace[0].candidateStatus, 'provisional');
  assert.equal(result.trace[0].output, '');
  assert.equal(result.trace[0].targetReason, 'provisional_mapping_requires_review');
});
 
test('a phrase with a provisional target withholds partial output but preserves the complete candidate', () => {
  const engine = createEngine(canonicalCsv, lexicalCsv);
  const result = engine.convert('가 의!');
  assert.equal(result.ukrainian, '');
  assert.equal(result.target_status, 'unavailable');
  assert.equal(result.candidate_status, 'provisional');
  assert.ok(result.candidate_ukrainian.includes('ий'));
  assert.ok(result.candidate_ukrainian.includes('!'));
  assert.ok(result.candidate_ukrainian.includes(' '));
});


test('empty and feature-only IPA inputs cannot become successful empty Ukrainian spellings', () => {
  for (const ipa of ['', '.', '...', 'ː', '.ː.']) {
    const result = ipaSyllableToUkrainian(ipa);
    assert.equal(result.text, null, JSON.stringify(ipa));
    assert.equal(result.status, 'unavailable', JSON.stringify(ipa));
    assert.equal(result.reason, 'no_renderable_ipa_segments', JSON.stringify(ipa));
  }
});

test('multi-syllable target helper fails closed as a whole on an unavailable IPA segment', () => {
  const result = ipaSyllablesToUkrainian(['k', '', 'a']);
  assert.deepEqual(result.syllables, []);
  assert.deepEqual(result.candidates, []);
  assert.equal(result.status, 'unavailable');
  assert.equal(result.reason, 'no_renderable_ipa_segments');
});

test('provisional target status and explicit research opt-in are consistent across helper APIs', () => {
  const production = ipaSyllablesToUkrainian(['k', 'y']);
  assert.deepEqual(production.syllables, []);
  assert.deepEqual(production.candidates, ['к', 'ві']);
  assert.equal(production.status, 'unavailable');
  assert.equal(production.candidateStatus, 'provisional');

  const research = ipaSyllablesToUkrainian(['k', 'y'], {allowProvisional:true});
  assert.deepEqual(research.syllables, ['к', 'ві']);
  assert.equal(research.status, 'provisional', 'research opt-in must not erase the provisional status');
});

test('provisional opt-in must be an explicit boolean in public IPA helpers', () => {
  assert.throws(
    () => ipaSyllableToUkrainian('y', {allowProvisional:'yes'}),
    {name:'TypeError', message:'allowProvisional must be a boolean'}
  );
});


test('source-aware IPA target adapter validates provisional opt-in and keeps diagnostic trace on failure', () => {
  assert.throws(
    () => ipaTargetForSource('위', 'y', {allowProvisional:'yes'}),
    {name:'TypeError', message:'allowProvisional must be a boolean'}
  );
  const result = ipaTargetForSource('서울역', 'sʌ.ul.☃');
  assert.equal(result.text, null);
  assert.equal(result.status, 'unavailable');
  assert.equal(result.reason, 'unmapped_ipa_sequence');
  assert.ok(result.mappingTrace.length > 0, 'mapped prefixes remain inspectable even though output is withheld');
  assert.deepEqual(result.syllables, [], 'no partial target syllables may leak from a failed result');
});
