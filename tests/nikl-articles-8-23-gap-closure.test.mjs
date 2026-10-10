import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const rows = parseCsv(lexical);
const entries = new Map(rows.map((row) => [row.input, row]));
const engine = createEngine(canonical, lexical);
const genericEngine = createEngine(canonical, '');

function expectedTarget(row) {
  const targets = row.target_syllables.split('|');
  if (row.input_kind !== 'mixed-script' || !/\s/u.test(row.input)) return targets.join('');
  let index = 0;
  let output = '';
  for (const token of (row.input.match(/\s+|[^\s]+/gu) || [])) {
    if (/^\s+$/u.test(token)) { output += token; continue; }
    const count = /^[가-힣]+$/u.test(token) ? [...token].length : 1;
    output += targets.slice(index, index + count).join('');
    index += count;
  }
  return output + targets.slice(index).join('');
}

const section12 = {
  '놓고':'노코','좋던':'조턴','쌓지':'싸치','많고':'만코','않던':'안턴','닳지':'달치',
  '먹히다':'머키다','밝히다':'발키다','맏형':'마텽','좁히다':'조피다',
  '넓히다':'널피다','꽂히다':'꼬치다','앉히다':'안치다',
  '옷 한 벌':'오탄벌','낮 한때':'나탄때','꽃 한 송이':'꼬탄송이','숱하다':'수타다',
  '닿소':'다쏘','많소':'만쏘','싫소':'실쏘','놓는':'논는','쌓네':'싼네',
  '않네':'안네','않는':'안는','뚫네':'뚤레',
  '낳은':'나은','놓아':'노아','쌓이다':'싸이다','많아':'마나',
  '않은':'아는','닳아':'다라','싫어도':'시러도',
};

const section15 = {
  '밭 아래':'바다래','늪 앞':'느밥','젖어미':'저더미','맛없다':'마덥따',
  '겉옷':'거돋','헛웃음':'허두슴','꽃 위':'꼬뒤','맛있다':'마딛따',
  '멋있다':'머딛따','넋 없다':'너겁따','닭 앞에':'다가페','값어치':'가버치',
  '값있는':'가빈는',
};

const section19and20 = {
  '담력':'담녁','침략':'침냑','강릉':'강능','항로':'항노','대통령':'대통녕',
  '막론':'망논','백리':'뱅니','협력':'혐녁','십리':'심니',
  '난로':'날로','신라':'실라','천리':'철리','광한루':'광할루',
  '대관령':'대괄령','칼날':'칼랄','물난리':'물랄리','줄넘기':'줄럼끼',
  '할는지':'할른지','닳는':'달른','뚫는':'뚤른','핥네':'할레',
  '의견란':'의견난','임진란':'임진난','생산량':'생산냥','결단력':'결딴녁',
  '공권력':'공꿘녁','동원령':'동원녕','상견례':'상견녜',
  '횡단로':'횡단노','이원론':'이원논','입원료':'이붠뇨','구근류':'구근뉴',
};

test('§12 official aspiration, ㅎ deletion, and ㅎ+ㄴ examples are source-backed and stable', () => {
  for (const [word, surface] of Object.entries(section12)) {
    const row = entries.get(word);
    assert.ok(row, '§12 missing official example: ' + word);
    assert.equal(row.surface_hangul, surface, word);
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, surface, word);
    assert.equal(result.ukrainian, expectedTarget(row), word);
    assert.equal(result.ipa, row.ipa_syllables.split('|').join(' '), word);
  }
});

test('§15 all official substantive-morpheme examples preserve spacing and exact readings', () => {
  for (const [word, surface] of Object.entries(section15)) {
    const row = entries.get(word);
    assert.ok(row, '§15 missing official example: ' + word);
    assert.equal(row.surface_hangul, surface, word);
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, surface, word);
    assert.equal(result.ukrainian, expectedTarget(row), word);
    assert.equal(result.ipa, row.ipa_syllables.split('|').join(' '), word);
  }
});

test('§19 and §20 listed assimilation examples and lexical exceptions are regression-tested', () => {
  for (const [word, surface] of Object.entries(section19and20)) {
    const row = entries.get(word);
    if (!row) {
      // General-rule examples must remain testable without a lexical override.
      const general = genericEngine.convert(word);
      assert.equal(general.issues.length, 0, word);
      continue;
    }
    assert.equal(row.surface_hangul, surface, word);
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, surface, word);
    assert.equal(result.ipa, row.ipa_syllables.split('|').join(' '), word);
  }
});

test('§11 exact ㄺ-before-ㄱ exceptions and §18 nasalization example are sourced', () => {
  for (const [word, surface] of Object.entries({
    '맑게':'말께','묽고':'물꼬','얽거나':'얼꺼나',
    '값매다':'감매다','없는':'엄는',
  })) {
    const row = entries.get(word);
    assert.ok(row, 'missing official example: ' + word);
    assert.equal(row.surface_hangul, surface, word);
    assert.equal(engine.convert(word).surfaceHangul, surface, word);
  }
});

test('§12 aspiration and §10/§20 exception chains remain algorithmic without lexical overrides', () => {
  const aspiration = {
    '각하':'kʰ','좋던':'tʰ','쌓지':'tɕʰ','않던':'tʰ','닳지':'tɕʰ',
    '먹히다':'kʰ','밝히다':'kʰ','맏형':'tʰ','좁히다':'pʰ','꽂히다':'tɕʰ',
    '놓고':'kʰ','많고':'kʰ',
  };
  for (const [word, marker] of Object.entries(aspiration)) {
    const result = genericEngine.convert(word);
    assert.equal(result.issues.length, 0, word);
    assert.ok(result.ipa.includes(marker), word + ': expected aspiration marker ' + marker);
    assert.ok(result.trace.some((item) => item.rules.includes('h-aspiration')), word);
  }
  const throughLiaison = genericEngine.convert('뚫는');
  assert.equal(throughLiaison.issues.length, 0);
  assert.ok(throughLiaison.trace.some((item) => item.rules.includes('liquid-assimilation')));
  const neolp = genericEngine.convert('넓둥글다');
  assert.ok(neolp.trace[0].rules.includes('lexical-coda-neolp'));
  assert.ok(neolp.trace[1].rules.includes('tensification'));
});

test('§23 all official fortition examples retain a fortis IPA marker', () => {
  const examples = {
    '국밥':'p͈','깎다':'t͈','넋받이':'p͈','삯돈':'t͈','닭장':'tɕ͈',
    '칡범':'p͈','뻗대다':'t͈','옷고름':'k͈','있던':'t͈','꽂고':'k͈',
    '꽃다발':'t͈','낯설다':'s͈','밭갈이':'k͈','솥전':'tɕ͈','곱돌':'t͈',
    '덮개':'k͈','옆집':'tɕ͈','넓죽하다':'tɕ͈','읊조리다':'tɕ͈','값지다':'tɕ͈',
  };
  for (const [word, marker] of Object.entries(examples)) {
    const result = engine.convert(word);
    assert.equal(result.issues.length, 0, word);
    assert.ok(result.ipa.includes(marker), word + ': expected fortis IPA marker ' + marker);
  }
});
