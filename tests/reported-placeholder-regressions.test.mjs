import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const engine = createEngine(canonical, lexical);
const entries = new Map(parseCsv(lexical).map(row => [row.input, row]));

const regressions = [
  ['얇은', '얄븐', 'https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=89859&nation=eng&nationCode=6'],
  ['굵은', '굴근', 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=261&pageIndex=1&qna_seq=330743'],
  ['젊음', '절믐', 'https://korean.go.kr/common/download.do?c_file_name=fc727985-eb6b-493e-9467-221465b7c0a4_0.pdf&file_path=etcData&o_file_name=바른+국어+생활'],
  ['곬으로', '골쓰로', 'https://korean.go.kr/common/download.do?c_file_name=fc727985-eb6b-493e-9467-221465b7c0a4_0.pdf&file_path=etcData&o_file_name=바른+국어+생활'],
];

const derivedRegressions = [
  ['잊었다', '이젇따', 'і|джот|та', 'i|dʑʌt̚|t͈a', '§13', '§23'],
  ['쌓였다', '싸엳따', 'са|йот|та', 's͈a|jʌt̚|t͈a', '§12(4)', '§23'],
  ['붙었다', '부텓따', 'пу|тот|та', 'pu|tʰʌt̚|t͈a', '§13', '§23'],
  ['찾아가다', '차자가다', 'ча|джа|ґа|да', 'tɕʰa|dʑa|ɡa|da', 'directly lists 찾아가다 pronunciation', null],
  ['미닫이문', '미다지문', 'мі|да|джі|мун', 'miː|da|dʑi|mun', '§17', null],
  ['넣었다', '너얻따', 'но|от|та', 'nʌ|ʌt̚|t͈a', '§12(4)', '§23'],
  ['놓았다', '노앋따', 'но|ат|та', 'no|at̚|t͈a', '§12(4)', '§23'],
  ['좋아도', '조아도', 'чо|а|до', 'tɕoː|a|do', '§12(4)', null],
  ['맑을', '말글', 'мал|ґил', 'mal|ɡɯl', '§14', null],
  ['없었다', '업썯따', 'оп|сот|та', 'ʌp̚|s͈ʌt̚|t͈a', '§14', '§23'],
];

test('reported complex-coda forms have exact official source attestations', () => {
  for (const [input, surface, source] of regressions) {
    const row = entries.get(input);
    assert.ok(row, `${input}: missing lexical evidence row`);
    assert.equal(row.surface_hangul, surface, `${input}: standard surface form`);
    assert.equal(row.source_url, source, `${input}: source must directly attest this form`);
    assert.equal(row.confidence, 'high', `${input}: source confidence`);
    assert.equal(row.target_status, 'provisional', `${input}: Ukrainian target is still provisional`);
  }
});

test('reported forms resolve without placeholders and match their sourced or rule-derived surface forms', () => {
  for (const [input, surface] of regressions) {
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, surface, `${input}: surface pronunciation`);
    assert.ok(!result.ukrainian.includes('⟦'), `${input}: unresolved placeholder in ${result.ukrainian}`);
    assert.ok(!result.ukrainian.includes('⟧'), `${input}: unresolved placeholder in ${result.ukrainian}`);
    assert.deepEqual(result.issues, [], `${input}: unresolved pronunciation issue`);
  }
});

test('reported inflections have explicit NIKL rule derivations rather than unsupported direct-attestation claims', () => {
  for (const [input, surface, expectedTarget, expectedIpa, ruleA, ruleB] of derivedRegressions) {
    const row = entries.get(input);
    assert.ok(row, `${input}: missing regression row`);
    assert.equal(row.surface_hangul, surface, `${input}: surface form`);
    assert.equal(row.target_syllables, expectedTarget, `${input}: Ukrainian target by syllable`);
    assert.equal(row.ipa_syllables, expectedIpa, `${input}: IPA by syllable`);
    assert.equal(row.confidence, 'high', `${input}: evidence confidence`);
    assert.equal(row.target_status, 'provisional', `${input}: Ukrainian target is provisional`);
    assert.match(row.source_url, /^https:\/\/(?:(?:www\.|m\.)?korean\.go\.kr|krdict\.korean\.go\.kr)\//u, `${input}: official NIKL source`);
    assert.ok(row.rule_notes.includes(ruleA), `${input}: missing first rule/evidence note`);
    if (ruleB) assert.ok(row.rule_notes.includes(ruleB), `${input}: missing second rule/evidence note`);
    assert.equal(engine.convert(input).surfaceHangul, surface, `${input}: engine result`);
    assert.equal(engine.convert(input).ukrainian, expectedTarget.split('|').join(''), `${input}: engine Ukrainian target`);
    assert.equal(engine.convert(input).ipa, expectedIpa.split('|').join(' '), `${input}: engine IPA`);
    assert.ok(!engine.convert(input).ukrainian.includes('⟦'), `${input}: placeholder remains`);
    assert.deepEqual(engine.convert(input).issues, [], `${input}: engine issues remain`);
  }
});

test('값의 exposes both standard particle readings under NIKL §§5 and 14', () => {
  const row = entries.get('값의');
  assert.ok(row, '값의 must have a source-backed variant entry');
  assert.equal(row.surface_hangul, '갑씌');
  assert.equal(row.alternate_surface_hangul, '갑쎄');
  assert.match(row.source_url, /^https:\/\/www\.korean\.go\.kr\/front\/onlineQna\//u);
  assert.ok(row.rule_notes.includes('§5') && row.rule_notes.includes('§14'));
  const result = engine.convert('값의');
  assert.equal(result.surfaceHangul, '갑씌');
  assert.equal(result.ukrainian, 'капший');
  assert.equal(result.ipa, 'kap̚ ɕ͈ɰi');
  assert.equal(result.variants.length, 1);
  assert.equal(result.variants[0].surface, '갑쎄');
  assert.equal(result.variants[0].ukrainian, 'капсе');
  assert.equal(result.variants[0].ipa, 'kap̚ s͈e');
  assert.ok(!result.ukrainian.includes('⟦'));
  assert.deepEqual(result.issues, []);
});

test('§27 fortition survives mixed lexical/generic tokenization in 읽을 수 있습니다', () => {
  const result = engine.convert('읽을 수 있습니다');
  assert.equal(result.ukrainian, 'ілґил су ітсимніда');
  assert.equal(result.ipa, 'il ɡɯl s͈u it̚ s͈ɯm ni da');
  assert.equal(result.issues.length, 0);
  assert.equal(result.status, 'lexical-review');
  assert.ok(result.trace.some(item => item.rules.includes('adnominal-r-fortition-§27')));
  assert.ok(!result.ukrainian.includes('⟦'));
});

test('the other reported palatalization forms remain covered, including a whole compound', () => {
  const cases = [
    ['밭이', '바치', 'па|чі', 'pa|tɕʰi'],
    ['맏이', '마지', 'ма|джі', 'ma|dʑi'],
    ['맏이가', '마지가', 'ма|джі|ґа', 'ma|dʑi|ɡa'],
    ['미닫이', '미다지', 'мі|да|джі', 'miː|da|dʑi'],
    ['미닫이문', '미다지문', 'мі|да|джі|мун', 'miː|da|dʑi|mun'],
  ];
  for (const [input, surface, target, ipa] of cases) {
    const row = entries.get(input);
    assert.ok(row, `${input}: missing exact or rule-derived row`);
    assert.equal(row.surface_hangul, surface, `${input}: surface form`);
    assert.equal(row.target_syllables, target, `${input}: Ukrainian target`);
    assert.equal(row.ipa_syllables, ipa, `${input}: IPA`);
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, surface);
    assert.equal(result.ukrainian, target.split('|').join(''));
    assert.equal(result.ipa, ipa.split('|').join(' '));
    assert.ok(!result.ukrainian.includes('⟦'), `${input}: unresolved placeholder`);
    assert.deepEqual(result.issues, [], `${input}: unresolved engine issue`);
  }
});

test('§14 NIKL complex-coda liaison examples preserve official particle readings', () => {
  const cases = [
    ['품삯이', '품싹씨', 'пум|сак|ші', 'pʰum|s͈ak̚|ɕ͈i'],
    ['품삯을', '품싹쓸', 'пум|сак|сил', 'pʰum|s͈ak̚|s͈ɯl'],
    ['품삯으로', '품싹쓰로', 'пум|сак|си|ро', 'pʰum|s͈ak̚|s͈ɯ|ɾo'],
    ['외곬에', '외골쎄', 'ве|ґол|се', 'ø|ɡol|s͈e'],
  ];
  const sources = new Map([
    ['품삯이', 'https://m.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=309950'],
    ['품삯을', 'https://m.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=309950'],
    ['품삯으로', 'https://m.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=309950'],
    ['외곬에', 'https://m.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=317229'],
  ]);
  for (const [input, surface, target, ipa] of cases) {
    const row = entries.get(input);
    assert.ok(row, `${input}: missing NIKL-attested lexical row`);
    assert.equal(row.surface_hangul, surface, `${input}: source-attested Korean surface`);
    assert.equal(row.source_url, sources.get(input), `${input}: exact NIKL Q&A source`);
    assert.equal(row.confidence, 'high', `${input}: source confidence`);
    assert.equal(row.target_status, 'provisional', `${input}: Ukrainian target remains provisional`);
    const result = engine.convert(input);
    assert.equal(result.surfaceHangul, surface, `${input}: engine surface`);
    assert.equal(result.ukrainian, target.split('|').join(''), `${input}: Ukrainian target`);
    assert.equal(result.ipa, ipa.split('|').join(' '), `${input}: IPA`);
    assert.equal(result.status, 'lexical-review', `${input}: provisional Ukrainian mapping remains visibly reviewable`);
    assert.ok(result.trace.some(item => item.rules.includes('ukrainian-target-provisional')), `${input}: trace flags provisional target`);
    assert.ok(!result.ukrainian.includes('⟦'), `${input}: unresolved target placeholder`);
    assert.deepEqual(result.issues, [], `${input}: engine issues`);
  }
});

test('lexical IPA consistently marks fortis sibilants as alveolo-palatal before the j-vowel set', () => {
  const expected = {
    '넋이': 'nʌk̚ ɕ͈i',
    '값이': 'kap̚ ɕ͈i',
    '말씨': 'maːl ɕ͈i',
    '몫몫이': 'moŋ mok̚ ɕ͈i',
    '옷맵시': 'on mɛp̚ ɕ͈i',
    '일시': 'il ɕ͈i',
    '얇실하다': 'jal ɕ͈il ha da',
    '몫이': 'mok̚ ɕ͈i',
    '곬이': 'kol ɕ͈i',
    '씌어': 'ɕ͈i ʌ',
    '끝없이': 'k͈ɯ tʌp̚ ɕ͈i',
    '없이': 'ʌp̚ ɕ͈i',
    '빠짐없이': 'p͈a dʑi mʌp̚ ɕ͈i',
    '값의': 'kap̚ ɕ͈ɰi',
  };
  for (const [input, ipa] of Object.entries(expected)) {
    const row = entries.get(input);
    assert.ok(row, `${input}: missing lexical evidence row`);
    assert.equal(row.ipa_syllables.split('|').join(' '), ipa, `${input}: stored broad IPA`);
    const result = engine.convert(input);
    assert.equal(result.ipa, ipa, `${input}: engine IPA`);
    assert.equal(result.status, 'lexical-review', `${input}: provisional mapping remains reviewable`);
  }
});


test('Ukrainian rendering is derived from the IPA layer for lexical readings', () => {
  const cases = [
    ['값의', 'kap̚ ɕ͈ɰi', 'капший'],
    ['학생의', 'hak̚ s͈ɛŋ ɰi', 'гаксений'],
    ['주의', 'tɕu ɰi', 'чуий'],
    ['지식의', 'tɕi ɕi ɡɰi', 'чішіґий'],
  ];
  for (const [input, expectedIpa, expectedUkrainian] of cases) {
    const result = engine.convert(input);
    assert.equal(result.ipa, expectedIpa, input + ': canonical IPA');
    assert.equal(result.ukrainian, expectedUkrainian, input + ': Ukrainian must be rendered from IPA');
    assert.ok(!result.ukrainian.includes('⟦'), input + ': no unresolved marker leaks into the target');
  }
});


test('difficult passage forms have sourced IPA and render Ukrainian only from that IPA',()=>{
  const cases=[
    ['읽었다는','il ɡʌt̚ t͈a nɯn','ілґоттанин'],
    ['없어서','ʌp̚ s͈ʌ sʌ','опсосо'],
    ['찾았다','tɕʰa dʑa t͈a','чаджата'],
    ['앉히다','an tɕʰi da','анчіда'],
    ['해돋이','hɛ do dʑi','гедоджі'],
    ['품삯이','pʰum s͈ak̚ ɕ͈i','пумсакші'],
    ['품삯을','pʰum s͈ak̚ s͈ɯl','пумсаксил'],
    ['품삯으로','pʰum s͈ak̚ s͈ɯ ɾo','пумсаксиро'],
    ['외곬에','ø ɡol s͈e','веґолсе'],
    ['값의','kap̚ ɕ͈ɰi','капший'],
  ];
  for(const [word,ipa,ukrainian] of cases){
    const result=engine.convert(word);
    assert.equal(result.ipa,ipa,word+': standard IPA');
    assert.equal(result.ukrainian,ukrainian,word+': IPA-derived Ukrainian');
    assert.ok(!result.ukrainian.includes('⟦')&&!result.ukrainian.includes('⟧'),word+': no inline markers');
    assert.deepEqual(result.issues,[],word+': sourced lexical reading resolves the form');
  }
});
