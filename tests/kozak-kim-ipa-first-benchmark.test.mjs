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


test('Browser withholds project-derived IPA when independent lexical IPA adjudication is required', () => {
  const result = createBrowserKozakKimEngine().convert('삶의');

  assert.equal(result.pronunciation_status, 'unresolved');
  assert.equal(result.ipa, '');
  assert.equal(result.ukrainian, '');
  assert.equal(result.target_status, 'unavailable');
  assert.equal(result.surfaceHangul, '살믜');
  assert.equal(result.variants.length, 1);
  assert.equal(result.variants[0].surface, '살메');
  assert.equal(result.variants[0].ipa, '');
  assert.equal(result.variants[0].ukrainian, '');
});


test('shared Broad IPA profile exposes complete final-coda surface without changing legacy default', () => {
  const engine = createBrowserKozakKimEngine();
  const sharedProfile = engine.convert('있다', { ipaProfile: 'clippyfirst-korean-broad-v1' });
  const legacyDefault = engine.convert('있다');

  assert.equal(sharedProfile.surfaceHangul, '읻따');
  assert.equal(legacyDefault.surfaceHangul, '있따');
});


test('Browser occurrence ledger reconstructs complete surfaces for mixed per-syllable traces', () => {
  const cases = [
    ['쌓아서', '싸아서'],
    ['쳐넣어야', '쳐너어야'],
    ['애새끼낳으면', '애새끼나으면'],
    ['좋아보인다고', '조아보인다고'],
    ['좋아해주는', '조아해주는'],
    ['좋은데', '조은데']
  ];
  const engine = createBrowserKozakKimEngine();
  const rows = cases.map(([canonical], index) => ({
    id: 'surface-reconstruction-' + index,
    lang: 'ko',
    split: 'test',
    tokens: [{ canonical, phoneme: 'ka' }]
  }));
  const report = evaluateRows(rows, engine);
  const diagnostics = cases.map(([word]) => {
    const result = engine.convert(word, { ipaProfile: 'clippyfirst-korean-broad-v1' });
    return {
      word,
      surfaceHangul: result.surfaceHangul,
      trace: (result.trace || []).map(item => ({
        source: item.source,
        surface: item.surface,
        rules: item.rules,
        status: item.status
      }))
    };
  });

  assert.deepEqual(
    report.records.map(record => record.surface_hangul),
    cases.map(([, expected]) => expected),
    JSON.stringify(diagnostics, null, 2)
  );
});


test('shared Broad profile exposes deterministic coda surfaces without resolving ambiguous morphology', () => {
  const cases = [
    ['칡칡이', '칙칙이', ''],
    ['쫒아내면', '쫃아내면', ''],
    ['많앗구나유유유', '만앋꾸나유유유', '많앗꾸나유유유'],
    ['무서웟어', '무서웓어', '']
  ];
  const engine = createBrowserKozakKimEngine();

  for (const [word, expectedSurface, expectedLegacySurface] of cases) {
    const broad = engine.convert(word, { ipaProfile: 'clippyfirst-korean-broad-v1' });
    assert.equal(broad.surfaceHangul, expectedSurface, word);
    assert.equal(broad.pronunciation_status, 'unresolved', word);
    assert.equal(broad.ipa, '', word);
    assert.equal(broad.ukrainian, '', word);

    // Preserve the exact legacy-default surface contract, including unrelated
    // deterministic changes that were already exposed before this Broad-only fix.
    const legacy = engine.convert(word);
    assert.equal(legacy.ipa_profile, 'browser-legacy-contextual-v1', word);
    assert.equal(legacy.surfaceHangul, expectedLegacySurface, word);
  }
});

test('236 profile-only vowel and loanword differences are exposed as optional variants', () => {
  const engine = createBrowserKozakKimEngine();
  const game = engine.convert('게임', { ipaProfile: 'clippyfirst-korean-broad-v1' });
  assert.equal(game.ipa, 'ke.im');
  assert.ok(game.variants.some(variant => variant.ipa === 'k͈e.im' && variant.note.includes('NIKL')));

  const shortFront = engine.convert('주는대로', { ipaProfile: 'clippyfirst-korean-broad-v1' });
  assert.ok(shortFront.variants.some(variant => variant.ipa.replaceAll('.', '') === 'tɕunɯndeɾo'));
  const longFront = engine.convert('대한민국', { ipaProfile: 'clippyfirst-korean-broad-v1' });
  assert.ok(longFront.variants.some(variant => variant.ipa.includes('ɛ') && variant.note.includes('Research-only')));
});

test('shared broad profile exposes source-backed sibilant palatalization as a variant, not a forced rewrite', () => {
  const engine = createBrowserKozakKimEngine();
  const lenis = engine.convert('시', { ipaProfile: 'clippyfirst-korean-broad-v1' });
  assert.equal(lenis.ipa, 'si');
  assert.ok(lenis.variants.some(variant => variant.ipa === 'ɕi'));

  const fortis = engine.convert('씨', { ipaProfile: 'clippyfirst-korean-broad-v1' });
  assert.equal(fortis.ipa, 's͈i');
  assert.ok(!fortis.variants.some(variant => variant.ipa.includes('ɕ͈')));
});

test('shared broad profile offers [ɥi] as a documented ㅟ alternative', () => {
  const result = createBrowserKozakKimEngine().convert('귀', {
    ipaProfile: 'clippyfirst-korean-broad-v1'
  });
  assert.equal(result.ipa, 'ky');
  assert.ok(result.variants.some(variant => variant.ipa === 'kɥi'));
});

test('shared broad profile exposes optional Seoul ㅎ allophones without changing canonical IPA', () => {
  const engine = createBrowserKozakKimEngine();
  const hi = engine.convert('히', { ipaProfile: 'clippyfirst-korean-broad-v1' });
  const hu = engine.convert('후', { ipaProfile: 'clippyfirst-korean-broad-v1' });
  assert.equal(hi.ipa, 'hi');
  assert.ok(hi.variants.some(variant => variant.ipa === 'çi'));
  assert.equal(hu.ipa, 'hu');
  assert.ok(hu.variants.some(variant => variant.ipa === 'xu'));
});

test('shared Broad profile exposes Lee 1999 intervocalic [ɸ] and [ɭ] as optional variants', () => {
  const engine = createBrowserKozakKimEngine();
  const h = engine.convert('아하', { ipaProfile: 'clippyfirst-korean-broad-v1' });
  assert.equal(h.ipa, 'a.ha');
  assert.ok(h.variants.some(variant => variant.ipa === 'a.ɸa'));

  const liquid = engine.convert('나라', { ipaProfile: 'clippyfirst-korean-broad-v1' });
  assert.equal(liquid.ipa, 'na.ɾa');
  assert.ok(liquid.variants.some(variant => variant.ipa === 'na.ɭa'));

  // Word-initial ㄹ before a glide is a tap context here, not the cited
  // intervocalic /l/ environment; do not emit a spurious [ɭ] candidate.
  const initialLiquid = engine.convert('례', { ipaProfile: 'clippyfirst-korean-broad-v1' });
  assert.equal(initialLiquid.ipa, 'ɾje');
  assert.ok(!initialLiquid.variants.some(variant => variant.ipa.includes('ɭ')));
});

test('broad profile exposes [ɕ] only in Kang 2010 lenis /i, ye, ya/ contexts', () => {
  const engine = createBrowserKozakKimEngine();
  for (const [word, expected] of [['시', 'ɕi'], ['샤', 'ɕja'], ['셰', 'ɕje']]) {
    const result = engine.convert(word, { ipaProfile: 'clippyfirst-korean-broad-v1' });
    assert.ok(result.variants.some(variant => variant.ipa === expected), word);
  }
  for (const word of ['쇼', '슈', '셔', '섀', '씨']) {
    const result = engine.convert(word, { ipaProfile: 'clippyfirst-korean-broad-v1' });
    assert.ok(!result.variants.some(variant => variant.ipa.includes('ɕ')), word);
  }
  for (const word of ['멋있어', '멋있노', '무슨뜻임', '것이냐', '저딴짓이면서', '법알못이구만']) {
    const result = engine.convert(word, { ipaProfile: 'clippyfirst-korean-broad-v1' });
    assert.ok(result.variants.some(variant => variant.ipa.includes('ɕi')), word + ': post-rule ㅅ resyllabification is covered');
  }

  const fortis = engine.convert('쑈', { ipaProfile: 'clippyfirst-korean-broad-v1' });
  assert.ok(!fortis.variants.some(variant => variant.ipa.includes('ɕ͈')));
});


 
test('236-candidate standard-rule cases are integrated as exact runtime licenses', () => {
  const engine = createBrowserKozakKimEngine();
  const convert = word => engine.convert(word, {
    morphologyMode: 'strict',
    ipaProfile: 'clippyfirst-korean-broad-v1'
  });
  const exact = [
    ['정권', '정꿘', 'k͈w'],
    ['유사성', '유사썽', 's͈'],
    ['혐오증', '혀모쯩', 'tɕ͈'],
    ['머리속에', '머리쏘게', 's͈o'],
    ['연전연패', '연전년패', 'njʌn'],
    ['출시미정에', '출씨미정에', 's͈i']
  ];
  for (const [word, surface, ipaPart] of exact) {
    const result = convert(word);
    assert.equal(result.pronunciation_status, 'resolved', word);
    assert.equal(result.surfaceHangul, surface, word);
    assert.ok(result.ipa.includes(ipaPart), word + ': ' + result.ipa);
  }
  assert.ok(convert('유사성').ipa.includes('juː'), 'NIKL dictionary long ㅠ is retained in IPA');

  for (const word of ['그놈의', '자신의']) {
    const result = convert(word);
    assert.equal(result.pronunciation_status, 'resolved', word);
    assert.match(result.ipa, /ɰi$/u, word + ': principal genitive-particle reading');
    assert.ok(result.variants.some(variant => /e$/u.test(variant.ipa)), word + ': Rule 5 [e] variant');
    assert.ok(!result.variants.some(variant => variant.ipa.endsWith('mi') || variant.ipa.endsWith('ni')), word + ': [i] is not the genitive-particle variant');
  }

  const lexicalUi = convert('민주주의');
  assert.ok(lexicalUi.variants.some(variant => /i$/u.test(variant.ipa)));
});

test('236-candidate exact licenses do not become productive suffix or substring rules', () => {
  const engine = createBrowserKozakKimEngine();
  const convert = word => engine.convert(word, {
    morphologyMode: 'strict',
    ipaProfile: 'clippyfirst-korean-broad-v1'
  });
  assert.ok(!convert('정관').ipa.includes('k͈'));
  assert.ok(!convert('유사증').ipa.includes('s͈'));
  assert.ok(!convert('혐오성').ipa.includes('tɕ͈'));
  assert.ok(!convert('머리속으로').ipa.includes('s͈'), 'the exact pronunciation alias must not generalize to neighboring forms');
  const unlicensedN = convert('연전연합');
  assert.equal(unlicensedN.surfaceHangul, '연저년합'); // ordinary ㄴ liaison, not Rule 29 insertion.
  assert.ok(!convert('고시미정에').ipa.includes('s͈'));
});

test('five previously integrated standard-rule cases remain covered', () => {
  const engine = createBrowserKozakKimEngine();
  const expected = {
    '출산': '출싼',
    '팔자걸음': '팔짜거름',
    '보일거라': '보일꺼라',
    '물가로': '물까로',
    '안할듯': '안할뜻'
  };
  for (const [word, surface] of Object.entries(expected)) {
    assert.equal(engine.convert(word, { morphologyMode: 'strict' }).surfaceHangul, surface, word);
  }
});
