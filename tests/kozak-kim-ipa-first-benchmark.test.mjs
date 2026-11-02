import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  createBrowserKozakKimEngine,
  editDistance,
  evaluateRows,
  normalizeIpa,
  normalizeIpaBroadCandidate,
  normalizeIpaBroadCandidateWithLoss
} from '../scripts/benchmark_kozak_kim_browser.mjs';

test('browser can explicitly select the shared Python broad IPA profile without changing its default', () => {
  const engine = createBrowserKozakKimEngine();
  const legacy = engine.convert('시파', { morphologyMode: 'strict' });
  const broad = engine.convert('시파', {
    morphologyMode: 'strict',
    ipaProfile: 'clippyfirst-korean-broad-v1'
  });

  assert.equal(legacy.ipa_profile, 'browser-legacy-contextual-v1');
  assert.match(legacy.ipa, /ɕ/u);
  assert.equal(broad.ipa_profile, 'clippyfirst-korean-broad-v1');
  assert.equal(broad.ipa_profile_version, 1);
  assert.equal(broad.ipa_profile_level, 'broad');
  assert.equal(broad.ipa_profile_status, 'unadjudicated-cross-runtime');
  assert.ok(!broad.ipa.includes('ɕ'));
  assert.throws(
    () => engine.convert('시파', { morphologyMode: 'strict', ipaProfile: 'unknown-profile' }),
    TypeError
  );
  assert.throws(
    () => engine.convert('시파', { morphologyMode: 'soft', ipaProfile: 'clippyfirst-korean-broad-v1' }),
    TypeError
  );
});

test('IPA normalization and edit distance match the Python benchmark contract', () => {
  assert.equal(normalizeIpa('kɡa.ɾɯn'), 'kɡaɾɯn');
  assert.equal(normalizeIpa('t͡ɕʰi'), 'tɕʰi');
  assert.equal(editDistance('kʰa', 'kʰa'), 0);
  assert.equal(editDistance('kʰa', 'k͈a'), 1);
});

test('broad candidate IPA normalization collapses documented allophones but preserves contrasts', () => {
  assert.equal(normalizeIpaBroadCandidate('ˈsʰa̠ːk͈ʌn'), 'saːk͈ʌn');
  assert.equal(normalizeIpaBroadCandidate('ɭɲɦçxɸβʝɣ'), 'lnhhhhhhh');
  assert.equal(normalizeIpaBroadCandidate('ɥi'), 'ɥi');
  assert.equal(normalizeIpaBroadCandidate('ɥa'), 'ɥa');
  assert.equal(normalizeIpaBroadCandidate('sʰɕʰʃʰ'), 'sɕʃ');
  assert.equal(normalizeIpaBroadCandidate('pʰtʰkʰk͈aːt̚'), 'pʰtʰkʰk͈aːt̚');
});

test('shared broad-candidate profile exposes feature loss and keeps sibilant place distinctions', () => {
  const audit = normalizeIpaBroadCandidateWithLoss('ˈsʰɭɲɦçxɣɸβʝʷ̠ːt̚k͈');
  assert.equal(audit.normalized, 'slnhhhhhhhːt̚k͈');
  assert.deepEqual(audit.feature_loss_counts, {
    fricative_aspiration: 1,
    h_labialization: 1,
    h_place: 2,
    h_place_and_manner: 2,
    h_place_and_voicing: 1,
    h_place_voicing_and_manner: 1,
    h_voicing: 1,
    lateral_retroflexion: 1,
    lexical_stress: 1,
    nasal_palatalization: 1,
    selected_segmental_quality_diacritics: 1
  });
  assert.equal(normalizeIpaBroadCandidate('s͈i'), 's͈i');
  assert.equal(normalizeIpaBroadCandidate('ɕʰi'), 'ɕi');
});

test('benchmark scores resolved IPA even when Ukrainian target mapping is unavailable', () => {
  const rows = [{
    id: 'synthetic',
    lang: 'ko',
    split: 'test',
    tokens: [{ canonical: '가', phoneme: 'kʰa' }]
  }];
  const engine = {
    convert: () => ({
      ipa: 'kʰa',
      pronunciation_status: 'resolved',
      target_status: 'unavailable',
      ukrainian: '',
      status: 'unresolved'
    })
  };

  const report = evaluateRows(rows, engine);

  assert.equal(report.scored_tokens, 1);
  assert.equal(report.exact_matches, 1);
  assert.equal(report.target_unavailable_tokens, 1);
  assert.equal(report.unresolved_tokens, 0);
});


test('browser occurrence ledger reconstructs complete surface when only one syllable changed', () => {
  const rows = [{
    id: 'partial-surface-row',
    lang: 'ko',
    split: 'test',
    tokens: [{ canonical: '가나', phoneme: 'ka.na' }]
  }];
  const report = evaluateRows(rows, {
    convert: () => ({
      pronunciation_status: 'resolved',
      ipa: 'ka.na',
      surfaceHangul: '가',
      trace: [
        { source: '가', surface: '가' },
        { source: '나', surface: '나' }
      ],
      target_status: 'model-selected',
      ukrainian: 'кана'
    })
  });
  assert.equal(report.records[0].surface_hangul, '가나');
});

test('browser occurrence ledger reconstructs unchanged lexical surfaces from trace', () => {
  const rows = [{
    id: 'lexical-surface-row',
    lang: 'ko',
    split: 'test',
    tokens: [{ canonical: '가나', phoneme: 'ka.na' }]
  }];
  const report = evaluateRows(rows, {
    convert: () => ({
      pronunciation_status: 'resolved',
      ipa: 'ka.na',
      surfaceHangul: '',
      trace: [
        { source: '가', ipa: 'ka' },
        { source: '나', ipa: 'na' }
      ],
      target_status: 'model-selected',
      ukrainian: 'кана'
    })
  });
  assert.equal(report.records[0].surface_hangul, '가나');
});

test('browser occurrence ledger retains stable identity and surface for heuristic results', () => {
  const rows = [{
    id: 'heuristic-row',
    lang: 'ko',
    split: 'test',
    tokens: [{ canonical: '가', phoneme: 'ka' }]
  }];
  const report = evaluateRows(rows, {
    convert: () => ({
      pronunciation_status: 'heuristic',
      surfaceHangul: '가',
      target_status: 'unavailable',
      ipa: 'ka',
      ukrainian: ''
    })
  });
  assert.equal(report.records.length, 1);
  assert.equal(report.records[0].occurrence_id, '0');
  assert.equal(report.records[0].gold, 'ka');
  assert.equal(report.records[0].surface_hangul, '가');
  assert.equal(report.records[0].status, 'heuristic');
  assert.equal(report.scored_tokens, 0);
});

test('Kozak Kim preserves inspectable IPA when only Ukrainian target mapping is unavailable', () => {
  const engine = createBrowserKozakKimEngine();
  const result = engine.convert('의');

  assert.equal(result.pronunciation_status, 'resolved');
  assert.equal(result.ipa, 'ɰi');
  assert.equal(result.ukrainian, '');
  assert.ok(['unavailable', 'provisional'].includes(result.target_status));
});

test('NIKL-backed Sino-Korean fortition stays lexical and preserves optional variants', () => {
  const engine = createBrowserKozakKimEngine();
  const incident = engine.convert('사건');
  assert.equal(incident.pronunciation_status, 'resolved');
  assert.equal(incident.surfaceHangul, '사껀');
  assert.equal(incident.ipa, 'saː.k͈ʌn');
  assert.equal(incident.target_status, 'provisional');
  assert.equal(incident.ukrainian, '');
  assert.ok(incident.candidate_ukrainian);

  const popularity = engine.convert('인기');
  assert.equal(popularity.pronunciation_status, 'resolved');
  assert.equal(popularity.surfaceHangul, '인끼');
  assert.equal(popularity.ipa, 'in.k͈i');
  assert.equal(popularity.target_status, 'provisional');
  assert.equal(popularity.variants.length, 1);
  assert.equal(popularity.variants[0].surface, '인기');
  assert.equal(popularity.variants[0].ipa, 'in.ɡi');
});

test('broad candidate benchmark distinguishes transcription convention from engine error', () => {
  const rows = [{
    id: 'nikl-fortition',
    lang: 'ko',
    split: 'test',
    tokens: [
      { canonical: '사건', phoneme: 'ˈsʰa̠ːk͈ʌn' },
      { canonical: '인기', phoneme: 'ink͈i' }
    ]
  }];
  const report = evaluateRows(rows, createBrowserKozakKimEngine());
  assert.equal(report.scored_tokens, 2);
  assert.equal(report.exact_matches, 1);
  assert.equal(report.broad_candidate_exact_matches, 2);
});

test('shared broad IPA profile preserves the sibilant-place difference in NIKL-backed 실수', () => {
  const rows = [{
    id: 'nikl-silsoo',
    lang: 'ko',
    split: 'test',
    tokens: [{ canonical: '실수', phoneme: 'ɕʰiɭs͈u' }]
  }];
  const report = evaluateRows(rows, createBrowserKozakKimEngine());
  assert.equal(report.ipa_profile, 'clippyfirst-korean-broad-v1');
  assert.equal(report.scored_tokens, 1);
  assert.equal(report.exact_matches, 0);
  // The shared broad profile removes selected narrow allophones, but it must
  // not turn /s/ and /ɕ/ into the same segment merely to improve exact match.
  assert.equal(report.broad_candidate_exact_matches, 0);
  assert.equal(report.records[0].broad_candidate_predicted.includes('ɕ'), false);
  assert.equal(report.records[0].broad_candidate_gold.includes('ɕ'), true);
  assert.equal(report.broad_candidate_reference_feature_loss_counts.lateral_retroflexion, 1);
  assert.equal(report.broad_candidate_reference_feature_loss_counts.fricative_aspiration, 1);
});

test('dictionary-backed 한자 reduces strict IPA edit distance while retaining lexical length', () => {
  const rows = [{
    id: 'krdict-hanja',
    lang: 'ko',
    split: 'test',
    tokens: [{ canonical: '한자', phoneme: 'hantɕ͈a' }]
  }];
  const report = evaluateRows(rows, createBrowserKozakKimEngine());
  assert.equal(report.scored_tokens, 1);
  assert.equal(report.exact_matches, 0);
  assert.equal(report.records[0].distance, 1);
});

test('browser engine applies NIKL lexical ㄼ and ㄺ exceptions beyond the raw g2pK port', () => {
  const engine = createBrowserKozakKimEngine();

  const neolp = engine.convert('넓죽하다');
  assert.equal(neolp.pronunciation_status, 'resolved');
  assert.equal(neolp.surfaceHangul, '넙쭈카다');

  const ilggo = engine.convert('읽고');
  assert.equal(ilggo.pronunciation_status, 'resolved');
  assert.equal(ilggo.surfaceHangul, '일꼬');
});

test('Kozak Kim still withholds IPA for unlicensed Korean morphophonology', () => {
  const engine = createBrowserKozakKimEngine();
  const result = engine.convert('읽게');

  assert.equal(result.pronunciation_status, 'unresolved');
  assert.equal(result.ipa, '');
  assert.equal(result.ukrainian, '');
});


test('browser Broad IPA benchmark report exposes the numeric v2 contract consumed by runtime parity audit', () => {
  const rows = [{
    id: 'broad-version-contract',
    lang: 'ko',
    split: 'test',
    tokens: [{ canonical: '가', phoneme: 'ka' }]
  }];
  const report = evaluateRows(rows, {
    convert: () => ({
      pronunciation_status: 'resolved',
      ipa: 'ka',
      surfaceHangul: '가',
      target_status: 'model-selected',
      ukrainian: 'ка'
    })
  });

  assert.equal(report.broad_candidate_benchmark, 'broad-candidate-ipa-v2');
  assert.equal(report.broad_candidate_benchmark_version, 2);
});
