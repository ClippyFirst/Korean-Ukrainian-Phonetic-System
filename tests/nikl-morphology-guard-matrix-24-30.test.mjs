import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexicalText = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const lexicalRows = parseCsv(lexicalText);
const lexical = new Map(lexicalRows.map((row) => [row.input, row]));
const generic = createEngine(canonical, '');
const c08ContextFixture = JSON.parse(readFileSync(
  new URL('../tests/fixtures/kozak-kim-c08-source-contexts.json', import.meta.url),
  'utf8',
));

test('§§24–28: generic mode does not claim morphology-specific fortition', () => {
  // These are deliberately tested without the lexical layer. The browser has no
  // productive parser for verb stems, causative/passive -기-, Sino-Korean
  // compounds, or adnominal constructions; exact dictionary rows must not turn
  // into a blanket productive rule or a misleading morphology-specific trace.
  const cases = [
    ['껴안다', 24],
    ['얹다', 24],
    ['더듬지', 24],
    ['젊지', 24],
    ['앉고', 24],
    ['안기다', 24],
    ['감기다', 24],
    ['굶기다', 24],
    ['옮기다', 24],
    ['넓게', 25],
    ['핥다', 25],
    ['훑소', 25],
    ['떫지', 25],
    ['불소', 26],
    ['발전', 26],
    ['몰상식', 26],
    ['불세출', 26],
    ['문고리', 28],
  ];

  for (const [input, article] of cases) {
    assert.ok(lexical.has(input), input + ': keep the exact sourced surface in the lexical evidence layer');
    const result = generic.convert(input);
    assert.ok(
      !result.trace.some((item) => item.rules.some((rule) => /(?:morphology-licensed-fortition|verb-stem-fortition|sino-korean-fortition|adnominal-r-fortition)/u.test(rule))),
      input + ': generic mode must not claim a morphology-specific §' + article + ' analysis',
    );
  }
});

test('§24 exact-form stem-n/m ending licenses match the native engine without enabling productive guessing', () => {
  const expected = [['닮다', 'tam.t͈a'], ['넘게', 'nʌm.k͈e'], ['안지', 'an.tɕ͈i'], ['신다', 'ɕin.t͈a']];
  for (const [input, ipa] of expected) {
    const result = generic.convert(input);
    assert.equal(result.ipa, ipa, input + ': source-backed broad IPA');
    assert.ok(result.trace.some((item) => item.rules.includes('stem-n-m-fortition-§24')), input + ': exact §24 trace');
  }

  const licensed = generic.convert('닮고');
  assert.equal(licensed.surfaceHangul, '담꼬');
  assert.ok(
    licensed.trace.some((item) => item.rules.includes('stem-n-m-fortition-§24')),
    '닮고 is an explicit source-backed §24 example in the closed inventory',
  );

  const unlicensed = generic.convert('닮기');
  assert.ok(
    !unlicensed.trace.some((item) => item.rules.includes('stem-n-m-fortition-§24')),
    'an unlisted lookalike must not inherit 닮고 license',
  );
});

test('§26: NIKL-dictionary-attested 출산 compounds retain exact Sino-Korean ㄹ+ㅅ fortition', () => {
  for (const input of ['출산', '출산율', '출산하다', '비출산', '저출산']) {
    const result = generic.convert(input);
    assert.ok(
      result.trace.some((item) => item.rules.includes('sino-korean-rieul-fortition-§26-exact-form')),
      input + ': exact licensed 출>산 boundary must trigger §26',
    );
    assert.ok(result.ipa.includes('s͈'), input + ': following ㅅ must be fortis');
  }

  for (const input of ['비출고', '저출고']) {
    const lookalike = generic.convert(input);
    assert.ok(
      !lookalike.trace.some((item) => item.rules.includes('sino-korean-rieul-fortition-§26-exact-form')),
      input + ': an unlicensed lookalike must not inherit the 출산 license',
    );
  }
});

test('§27 punctuation-separated pause controls suppress adnominal fortition', () => {
  const connected = generic.convert('할 것을');
  assert.ok(connected.trace.some((item) => item.rules.includes('adnominal-r-fortition-§27')));

  for (const input of ['할, 것을', '할. 것을', '할; 것을']) {
    const result = generic.convert(input);
    assert.ok(
      !result.trace.some((item) => item.rules.includes('adnominal-r-fortition-§27')),
      input + ': punctuation-separated material must not inherit the connected-phrase license',
    );
  }
});

test('§27: -ㄹ게 fortition requires the complete ending boundary, not a matching substring', () => {
  for (const input of ['할게', '할게요', '다를게', '안타까울게']) {
    const result = generic.convert(input);
    assert.ok(
      result.trace.some((item) => item.rules.includes('adnominal-l-fortition-§27-attested-l-ge')),
      input + ': the complete -ㄹ게 ending must retain source-backed fortition',
    );
  }

  // The UGTPHON discordant occurrence 올게이 contains the same Hangul
  // substring but is not the -ㄹ게 ending. This is a rule-boundary control,
  // not an independently adjudicated lexical pronunciation.
  const substringOnly = generic.convert('올게이');
  assert.ok(
    !substringOnly.trace.some((item) => item.rules.includes('adnominal-l-fortition-§27-attested-l-ge')),
    '올게이 must not inherit -ㄹ게 fortition from an internal substring',
  );
  assert.ok(!substringOnly.ipa.includes('k͈'), 'the unlicensed substring must not be fortisized');
});

test('§30: saisiot remains an exact lexical decision, not a generic ㅅ-final rewrite', () => {
  const cases = ['나뭇가지', '아랫방'];
  for (const input of cases) {
    const result = generic.convert(input);
    assert.ok(
      !result.trace.some((item) => item.rules.some((rule) => /saisiot|R015/u.test(rule))),
      input + ': generic mode must not claim a licensed §30 analysis',
    );
  }
});

test('§§24–30 evidence rows have official provenance and explicit article coverage in the audit', () => {
  const audit = readFileSync(new URL('../docs/NIKL-STANDARD-PRONUNCIATION-AUDIT-2026-10-09.md', import.meta.url), 'utf8');
  for (const [input, article] of [
    ['껴안다', 24], ['넓게', 25], ['발전', 26], ['문고리', 28], ['냇가', 30],
  ]) {
    const row = lexical.get(input);
    assert.ok(row, input + ': exact evidence row is required');
    assert.match(row.source_url, /^https:\/\/(?:www\.|m\.)?korean\.go\.kr\//u, input + ': official NIKL provenance');
    assert.ok(audit.includes('§' + article), input + ': audit must account for §' + article);
  }
});

test('§27: the explicitly listed adnominal phrase remains a narrow positive license', () => {
  const result = generic.convert('할 것을');
  assert.ok(
    result.trace.some((item) => item.rules.includes('adnominal-r-fortition-§27')),
    'the exact listed phrase 할 것을 should use the explicit §27 phrase license',
  );
});

test('§26: source-derived 실시간 boundary applies Sino-Korean ㄹ+ㅅ fortition only at the licensed pair', () => {
  const result = generic.convert('실시간');
  assert.ok(
    result.trace.some((item) => item.rules.includes('sino-korean-rieul-fortition-§26-exact-form')),
    '실>시 is the licensed Sino-Korean ㄹ+ㅅ boundary',
  );
  assert.equal(result.surfaceHangul, '실씨간', '§26 must change only the licensed onset');
  assert.ok(result.ipa.includes('ɕ͈i'), '§26 must preserve the fortis palatal sibilant in 실시간');

  for (const input of ['실구간', '실가간']) {
    const lookalike = generic.convert(input);
    assert.ok(
      !lookalike.trace.some((item) => item.rules.includes('sino-korean-rieul-fortition-§26-exact-form')),
      input + ': a similar ㄹ+coda sequence must not inherit the exact 실시간 license',
    );
  }
});


test('§27: exact source-backed C08 same-eojeol forms fortify only their licensed morpheme pair', () => {
  const cases = [
    ['무고일수도있다는', '일>수', 's͈u', '쑤'],
    ['했을시', '을>시', 'ɕ͈i', '씨'],
  ];
  for (const [input, pair, ipa, surface] of cases) {
    const result = generic.convert(input);
    assert.ok(result.trace.some((item) => item.rules.includes('adnominal-r-fortition-§27-exact-form')), input + ': exact §27 form license');
    assert.ok(result.ipa.includes(ipa), input + ': fortis onset must be preserved in IPA');
    assert.ok(result.surfaceHangul.includes(surface), input + ': only the licensed onset is fortisized');
  }

  for (const input of ['유사성', '했을지']) {
    const result = generic.convert(input);
    assert.ok(!result.trace.some((item) => item.rules.includes('adnominal-r-fortition-§27-exact-form')), input + ': no substring or suffix-wide inheritance');
  }
});

test('§27: the same C08 morphology is licensed in the correctly spaced phrase form, not across punctuation', () => {
  for (const [input, ipa] of [['무고일 수도', 's͈u'], ['했을 시', 'ɕ͈i']]) {
    const result = generic.convert(input);
    assert.ok(result.trace.some((item) => item.rules.includes('adnominal-r-fortition-§27')), input + ': exact phrase §27 license');
    assert.ok(result.ipa.includes(ipa), input + ': phrase-level fortis IPA');
  }
  for (const input of ['무고일, 수도', '했을, 시']) {
    const result = generic.convert(input);
    assert.ok(!result.trace.some((item) => item.rules.includes('adnominal-r-fortition-§27')), input + ': punctuation breaks the connected phrase license');
  }
});


test('§27 C08 source contexts: exact eojeol licenses apply inside full sentences', () => {
  const positiveCases = [
    ['multilexnorm2026_1953', '무고일수도있다는', '일>수', 's͈u', '쑤'],
    ['multilexnorm2026_1979', '했을시', '을>시', 'ɕ͈i', '씨'],
  ];
  for (const [sourceRowId, input, pair, ipa, surface] of positiveCases) {
    const sourceCase = c08ContextFixture.cases.find((item) => item.source_row_id === sourceRowId);
    assert.ok(sourceCase, sourceRowId + ': source context fixture row');
    assert.ok(sourceCase.source_sentence.includes(input), sourceRowId + ': exact target token is present in its original sentence');
    const result = generic.convert(sourceCase.source_sentence);
    assert.ok(result.trace.some((item) => item.rules.includes('adnominal-r-fortition-§27-exact-form')), sourceRowId + ': exact C08 license must fire within the sentence');
    assert.ok(result.ipa.includes(ipa), sourceRowId + ': rule-derived fortis feature must be present in IPA');
    assert.ok(result.surfaceHangul.includes(surface), sourceRowId + ': surface form must show the licensed fortis onset');
  }
});

test('C08 context recovery does not authorize the unresolved -성 lexical case', () => {
  const sourceCase = c08ContextFixture.cases.find((item) => item.source_row_id === 'dc_inside_2024');
  assert.ok(sourceCase && sourceCase.source_sentence.includes('유사성'));
  const result = generic.convert(sourceCase.source_sentence);
  assert.ok(!result.trace.some((item) => item.rules.includes('adnominal-r-fortition-§27-exact-form')), 'the exact -성 token remains unlicensed; no suffix-wide fortition');
});
