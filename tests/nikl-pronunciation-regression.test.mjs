import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexicalBase = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const lexicalAdditions = readFileSync(new URL('../data/korean/lexical_additions_2026-10-15.csv', import.meta.url), 'utf8');

// Match the public app's effective lexicon: dated additions override base rows
// with the same input key. Keep one row per key so row-level audits inspect the
// actual record used by createEngine rather than a stale base entry.
const baseRows = parseCsv(lexicalBase);
const effectiveRows = new Map(baseRows.map((row) => [row.input, row]));
for (const row of parseCsv(lexicalAdditions)) effectiveRows.set(row.input, row);
const headers = Object.keys(baseRows[0] || {});
const csvCell = (value) => {
  const cell = String(value ?? '');
  return /[",\r\n]/u.test(cell) ? '"' + cell.replace(/"/gu, '""') + '"' : cell;
};
const lexical = [
  headers.join(','),
  ...[...effectiveRows.values()].map((row) => headers.map((header) => csvCell(row[header])).join(','))
].join('\n');
const userCorpus = readFileSync(new URL('./fixtures/user-supplied-corpus.txt', import.meta.url), 'utf8').trim().split(/\r?\n/u);
const engine = createEngine(canonical, lexical);

test('obstruent coda before ㄹ triggers ㄹ-to-ㄴ and nasal assimilation', () => {
  const result = engine.convert('독립문');
  assert.equal(result.ukrainian, 'тонніммун');
  assert.match(result.ipa, /toŋ nim mun/);
  assert.ok(result.trace.some((item) => item.rules.includes('liquid-to-nasal-before-obstruent')));
  assert.ok(result.trace.some((item) => item.rules.includes('nasal-assimilation')));
});

test('서울역 applies §29 n-insertion and retains the coda ㄹ', () => {
  const result = engine.convert('서울역');
  assert.equal(result.ukrainian, 'соулльок');
  assert.match(result.ipa, /sʌ ul ljʌk̚/);
  assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')));
});

test('nasalisation changes both the coda and following liquid in 국립', () => {
  const result = engine.convert('국립');
  assert.equal(result.ukrainian, 'кунніп');
  assert.match(result.ipa, /kuŋ nip̚/);
});

test('ㅇ+ㅢ uses the normative [ɰi] default instead of an unresolved placeholder', () => {
  const result = engine.convert('한국어의 표준 발음');
  assert.equal(result.issues.length, 0);
  assert.ok(!result.ukrainian.includes('⟦'));
  assert.equal(result.ukrainian, '');
  assert.equal(result.target_status, 'unavailable');
  assert.ok(result.candidate_ukrainian.includes('ий'));
  assert.equal(result.candidate_status, 'provisional');
  assert.match(result.ipa, /ɰi/);
  assert.ok(result.trace.some((item) => item.rules.includes('vowel-ui-default-ɰi')));
});

test('ㅢ with a consonant onset follows §5 and is realized as [i]', () => {
  const result = engine.convert('희망');
  assert.equal(result.ukrainian, 'гіман');
  assert.match(result.ipa, /hi maŋ/);
  assert.ok(result.trace.some((item) => item.rules.includes('vowel-ui-to-i')));
});

test('palatalization applies to ㄷ/ㅌ before ㅣ, not every j-like vowel', () => {
  const result = engine.convert('같이');
  assert.equal(result.ukrainian, 'качі');
  assert.match(result.ipa, /ka tɕʰi/);
  assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')));
  assert.equal(result.status, 'lexical-review');
});

test('ㄷ+히 follows aspiration and then palatalization (§12 + §17)', () => {
  const result = engine.convert('굳히다');
  assert.equal(result.ukrainian, 'кучіда');
  assert.match(result.ipa, /ku tɕʰi da/);
  assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')));
  assert.equal(result.status, 'lexical-review');
});

test('the complete official institution name uses its sourced standard surface form', () => {
  const result = engine.convert('국립국어원');
  assert.equal(result.surfaceHangul, '궁님꾸거원');
  assert.equal(result.ukrainian, 'куннімкуґовон');
  assert.equal(result.ipa, 'kuŋ nim k͈u ɡʌ wʌn');
  assert.equal(result.status, 'lexical-review');
  assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')));
});

test('unlicensed spelling-only palatalization is withheld instead of guessed', () => {
  const result = engine.convert('갇이');
  assert.equal(result.status, 'unresolved');
  assert.equal(result.ukrainian, '');
  assert.ok(result.issues.some((issue) => issue.includes('verified formal-morpheme boundary')));
  assert.ok(result.trace.every((item) => !item.rules.includes('palatalization')));
});

test('밭에 does not undergo §17 palatalization because the following vowel is ㅔ', () => {
  const result = engine.convert('밭에');
  assert.match(result.ipa, /pa tʰe/);
  assert.ok(!result.trace.some((item) => item.rules.includes('palatalization')));
});

test('shared lexical pronunciation data is sourced, aligned, and marks provisional Ukrainian targets', () => {
  const rows = parseCsv(lexical);
  const seen = new Set();
  for (const row of rows) {
    assert.ok(!seen.has(row.input), 'duplicate lexical key: ' + row.input);
    seen.add(row.input);
    assert.match(row.source_url, /^https:\/\/(?:(?:www\.|m\.)?korean\.go\.kr|krdict\.korean\.go\.kr)\//, row.input);
    assert.ok([...row.surface_hangul].every((char) => /[가-힣]/u.test(char)), row.input);
    if (row.input_kind === 'mixed-script') {
      assert.match(row.input, /[^가-힣]/u, row.input);
      assert.equal([...row.surface_hangul].length, row.target_syllables.split('|').length, row.input);
      assert.equal([...row.surface_hangul].length, row.ipa_syllables.split('|').length, row.input);
    } else {
      assert.equal([...row.input].length, row.target_syllables.split('|').length, row.input);
      assert.equal([...row.input].length, row.ipa_syllables.split('|').length, row.input);
    }
    if (row.target_status === 'provisional') {
      assert.equal(engine.convert(row.input).status, 'lexical-review', row.input);
    }
  }
});

test('NIKL §17 exact examples use sourced entries; the Ukrainian target stays explicitly provisional', () => {
  const expected = {
    같이: {surface:'가치', target:'качі', ipa:'ka.tɕʰi'},
    굳이: {surface:'구지', target:'куджі', ipa:'ku.dʑi'},
    곧이듣다: {surface:'고지듣따', target:'коджідитта', ipa:'ko.dʑi.dɯt̚.t͈a'},
    굳히다: {surface:'구치다', target:'кучіда', ipa:'ku.tɕʰi.da'},
    닫히다: {surface:'다치다', target:'тачіда', ipa:'ta.tɕʰi.da'},
    묻히다: {surface:'무치다', target:'мучіда', ipa:'mu.tɕʰi.da'},
  };
  const rows = parseCsv(lexical);
  for (const [word, values] of Object.entries(expected)) {
    const entry = rows.find((row) => row.input === word);
    assert.ok(entry, word);
    assert.equal(entry.surface_hangul, values.surface, word);
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ukrainian, values.target, word);
    assert.equal(result.ipa, values.ipa, word);
    assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
  }
});

test('NIKL §15 substantive-morpheme liaison uses exact sourced surface forms', () => {
  const expected = {
    맛없다: {surface:'마덥따', target:'мадопта', ipa:'ma.dʌp̚.t͈a'},
    겉옷: {surface:'거돋', target:'кодот', ipa:'kʌ.dot̚'},
    헛웃음: {surface:'허두슴', target:'годусим', ipa:'hʌ.du.sɯm'},
    값어치: {surface:'가버치', target:'кабочі', ipa:'ka.bʌ.tɕʰi'},
    젖어미: {surface:'저더미', target:'чодомі', ipa:'tɕʌ.dʌ.mi'},
  };
  const rows = parseCsv(lexical);
  for (const [word, values] of Object.entries(expected)) {
    const entry = rows.find((row) => row.input === word);
    assert.ok(entry, word);
    assert.equal(entry.surface_hangul, values.surface, word);
    assert.equal(entry.target_status, 'provisional', word);
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ukrainian, values.target, word);
    assert.equal(result.ipa, values.ipa, word);
    assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
  }
});

test('NIKL §15 exposes both standard readings for 맛있다 and 멋있다', () => {
  const expected = {
    맛있다: {surface:'마딛따', target:'мадітта', ipa:'ma.dit̚.t͈a', alternateSurface:'마싣따', alternateTarget:'машітта', alternateIpa:'ma.ɕit̚.t͈a'},
    멋있다: {surface:'머딛따', target:'модітта', ipa:'mʌ.dit̚.t͈a', alternateSurface:'머싣따', alternateTarget:'мошітта', alternateIpa:'mʌ.ɕit̚.t͈a'},
  };
  for (const [word, values] of Object.entries(expected)) {
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ukrainian, values.target, word);
    assert.equal(result.ipa, values.ipa, word);
    assert.equal(result.variants.length, 1, word);
    assert.equal(result.variants[0].surface, values.alternateSurface, word);
    assert.equal(result.variants[0].ukrainian, values.alternateTarget, word);
    assert.equal(result.variants[0].ipa, values.alternateIpa, word);
    assert.equal(result.variants[0].status, 'lexical-review', word);
  }
  const phrase = engine.convert('맛있다!');
  assert.equal(phrase.variants.length, 1);
  assert.equal(phrase.variants[0].ukrainian, 'машітта!');
  assert.equal(phrase.variants[0].ipa, 'ma ɕit̚ t͈a!');
});

test('unknown complex-coda liaison is unresolved rather than guessed as §14', () => {
  for (const word of ['넋어', '값어']) {
    const result = engine.convert(word);
    assert.equal(result.status, 'unresolved', word);
    assert.ok(!result.ukrainian.includes('⟦') && !result.ukrainian.includes('⟧'), word);
    assert.ok(result.issues.some((issue) => issue.includes('complex-coda liaison differs')), word);
    assert.ok(result.trace.some((item) => item.rules.includes('complex-coda-liaison-requires-morphology')), word);
  }
});

test('§14 every enumerated complex-coda liaison example has an independently pinned surface and IPA', () => {
  const expected = {
    '넋이': {surface:'넉씨', target:'нокші', ipa:'nʌk̚.ɕ͈i'},
    '값이': {surface:'갑씨', target:'капші', ipa:'kap̚.ɕ͈i'},
    '앉아': {surface:'안자', target:'анджа', ipa:'an.dʑa'},
    '닭을': {surface:'달글', target:'талґил', ipa:'tal.ɡɯl'},
    '젊어': {surface:'절머', target:'чолмо', ipa:'tɕʌl.mʌ'},
    '곬이': {surface:'골씨', target:'колші', ipa:'kol.ɕ͈i'},
    '핥아': {surface:'할타', target:'галта', ipa:'hal.tʰa'},
    '읊어': {surface:'을퍼', target:'илпо', ipa:'ɯl.pʰʌ'},
    '값을': {surface:'갑쓸', target:'капсил', ipa:'kap̚.s͈ɯl'},
    '없어': {surface:'업써', target:'опсо', ipa:'ʌːp̚.s͈ʌ'},
    '여덟이': {surface:'여덜비', target:'йодолбі', ipa:'jʌ.dʌl.bi'},
    '여덟을': {surface:'여덜블', target:'йодолбил', ipa:'jʌ.dʌl.bɯl'},
  };
  const rows = parseCsv(lexical);
  for (const [word, values] of Object.entries(expected)) {
    const entry = rows.find((row) => row.input === word);
    assert.ok(entry, word);
    assert.match(entry.source_url, /^https:\/\/(www\.|m\.)?korean\.go\.kr\//u, word + ': official source');
    assert.equal(entry.surface_hangul, values.surface, word);
    assert.equal(entry.target_status, 'provisional', word);
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ukrainian, values.target, word);
    assert.equal(result.ipa, values.ipa, word);
    assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
  }
});

test('simple codas with §15-sensitive representatives are not transferred blindly', () => {
  const result = engine.convert('옷어');
  assert.equal(result.status, 'unresolved');
  assert.ok(!result.ukrainian.includes('⟦') && !result.ukrainian.includes('⟧'));
  assert.ok(result.issues.some((issue) => issue.includes('coda representative changes under §15')));
  assert.ok(result.trace.some((item) => item.rules.includes('substantive-morpheme-liaison-requires-morphology')));
});

test('§13 all enumerated simple-coda liaison examples have pinned surfaces and IPA', () => {
  const expected = {
    '깎아': {surface:'까까', target:'кака', ipa:'k͈a.k͈a'},
    '옷이': {surface:'오시', target:'оші', ipa:'o.ɕi', targetStatus:'model-selected'},
    '있어': {surface:'이써', target:'ісо', ipa:'i.s͈ʌ'},
    '낮이': {surface:'나지', target:'наджі', ipa:'na.dʑi'},
    '꽂아': {surface:'꼬자', target:'коджа', ipa:'k͈o.dʑa'},
    '꽃을': {surface:'꼬츨', target:'кочил', ipa:'k͈o.tɕʰɯl'},
    '밭에': {surface:'바테', target:'пате', ipa:'pa.tʰe'},
    '앞으로': {surface:'아프로', target:'апиро', ipa:'a.pʰɯ.ɾo'},
    '덮이다': {surface:'더피다', target:'топіда', ipa:'tʌ.pʰi.da'},
    '쫓아': {surface:'쪼차', target:'чоча', ipa:'tɕ͈o.tɕʰa'},
    '덮어': {surface:'더퍼', target:'топо', ipa:'tʌ.pʰʌ'},
    '맞아': {surface:'마자', target:'маджа', ipa:'ma.dʑa'},
    '낮아': {surface:'나자', target:'наджа', ipa:'na.dʑa'},
    '붙어': {surface:'부터', target:'путо', ipa:'pu.tʰʌ'},
  };
  const rows = parseCsv(lexical);
  for (const [word, values] of Object.entries(expected)) {
    const entry = rows.find((row) => row.input === word);
    assert.ok(entry, word);
    assert.match(entry.source_url, /^https:\/\/(?:www\.|m\.|krdict\.)?korean\.go\.kr\//u, word + ': official NIKL source');
    assert.equal(entry.surface_hangul, values.surface, word);
    assert.equal(entry.target_status, values.targetStatus || 'provisional', word);
    const result = engine.convert(word);
    assert.equal(result.status, values.targetStatus === 'model-selected' ? 'lexical' : 'lexical-review', word);
    assert.equal(result.ukrainian, values.target, word);
    assert.equal(result.ipa, values.ipa, word);
  }
});

test('official §12 complex-coda + ㅎ examples use exact lexical evidence', () => {
  const expected = {
    읽히다: {surface:'일키다', target:'ілкіда', ipa:'il.kʰi.da'},
    앉히다: {surface:'안치다', target:'анчіда', ipa:'an.tɕʰi.da'},
    넓히다: {surface:'널피다', target:'нолпіда', ipa:'nʌl.pʰi.da'},
  };
  const rows = parseCsv(lexical);
  for (const [word, values] of Object.entries(expected)) {
    const entry = rows.find((row) => row.input === word);
    assert.ok(entry, word);
    assert.equal(entry.surface_hangul, values.surface, word);
    assert.equal(entry.target_status, 'provisional', word);
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ukrainian, values.target, word);
    assert.equal(result.ipa, values.ipa, word);
  }
});

test('unknown complex-coda + ㅎ does not inherit the suffix-aspiration pattern', () => {
  const result = engine.convert('넋하고');
  assert.equal(result.status, 'unresolved');
  assert.ok(!result.ukrainian.includes('⟦') && !result.ukrainian.includes('⟧'));
  assert.ok(result.issues.some((issue) => issue.includes('§12 complex-coda + ㅎ aspiration depends')));
  assert.ok(result.trace.some((item) => item.rules.includes('complex-coda-h-aspiration-requires-morphology')));
});

test('official §12(4) H-deletion examples are sourced and marked provisional on the Ukrainian side', () => {
  const expected = {
    낳은: {surface:'나은', target:'наин', ipa:'na.ɯn'},
    놓아: {surface:'노아', target:'ноа', ipa:'no.a'},
    쌓이다: {surface:'싸이다', target:'саіда', ipa:'s͈a.i.da'},
    많아: {surface:'마나', target:'мана', ipa:'ma.na'},
    않은: {surface:'아는', target:'анин', ipa:'a.nɯn'},
    닳아: {surface:'다라', target:'тара', ipa:'ta.ɾa'},
    싫어도: {surface:'시러도', target:'шіродо', ipa:'ɕi.ɾʌ.do'},
  };
  const rows = parseCsv(lexical);
  for (const [word, values] of Object.entries(expected)) {
    const entry = rows.find((row) => row.input === word);
    assert.ok(entry, word);
    assert.equal(entry.surface_hangul, values.surface, word);
    assert.equal(entry.target_status, 'provisional', word);
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ukrainian, values.target, word);
    assert.equal(result.ipa, values.ipa, word);
  }
});

test('NIKL §16 official letter-name examples are exact lexical entries', () => {
  const expected = {
    '디귿이': [디그시, 'тіґиші', 'ti ɡɯ ɕi'],디그시undefined
    '디귿을': [디그슬, 'тіґисил', 'ti ɡɯ sɯl'],디그슬undefined
    '디귿에': [디그세, 'тіґисе', 'ti ɡɯ se'],디그세undefined
    '지읒이': [지으시, 'чіиші', 'tɕi ɯ ɕi'],지으시undefined
    '지읒을': [지으슬, 'чіисил', 'tɕi ɯ sɯl'],지으슬undefined
    '지읒에': [지으세, 'чіисе', 'tɕi ɯ se'],지으세undefined
    '치읓이': [치으시, 'чіиші', 'tɕʰi ɯ ɕi'],치으시undefined
    '치읓을': [치으슬, 'чіисил', 'tɕʰi ɯ sɯl'],치으슬undefined
    '치읓에': [치으세, 'чіисе', 'tɕʰi ɯ se'],치으세undefined
    '키읔이': [키으기, 'кіиґі', 'kʰi ɯ ɡi'],키으기undefined
    '키읔을': [키으글, 'кіиґил', 'kʰi ɯ ɡɯl'],키으글undefined
    '키읔에': [키으게, 'кіиґе', 'kʰi ɯ ɡe'],키으게undefined
    '티읕이': [티으시, 'тіиші', 'tʰi ɯ ɕi'],티으시undefined
    '티읕을': [티으슬, 'тіисил', 'tʰi ɯ sɯl'],티으슬undefined
    '티읕에': [티으세, 'тіисе', 'tʰi ɯ se'],티으세undefined
    '피읖이': [피으비, 'піибі', 'pʰi ɯ bi'],피으비undefined
    '피읖을': [피으블, 'піибил', 'pʰi ɯ bɯl'],피으블undefined
    '피읖에': [피으베, 'піибе', 'pʰi ɯ be'],피으베undefined
    '히읗이': [히으시, 'гіиші', 'hi ɯ ɕi'],히으시undefined
    '히읗을': [히으슬, 'гіисил', 'hi ɯ sɯl'],히으슬undefined
    '히읗에': [히으세, 'гіисе', 'hi ɯ se'],히으세undefined
  };
  const rows = parseCsv(lexical);
  for (const [word, [surface, target, ipa]] of Object.entries(expected)) {
    const row = rows.find((item) => item.input === word);
    assert.ok(row, word);
    assert.equal(row.surface_hangul, surface, word);
    assert.equal(row.target_status, 'provisional', word);
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ukrainian, target, word);
    assert.equal(result.ipa, ipa, word);
    assert.equal(result.ukrainian, target, word);
    assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
  }
});

test('NIKL §21 negative controls prevent nonstandard place assimilation', () => {
  const expected = {
    '감기': [감기, 'камґі'],감기undefined
    '옷감': [옫깜, 'откам'],옫깜undefined
    '있고': [읻꼬, 'ітко'],읻꼬undefined
    '꽃길': [꼳낄, 'коткіл'],꼳낄undefined
    '젖먹이': [전머기, 'чонмоґі'],전머기undefined
    '문법': [문뻡, 'мунпоп'],문뻡undefined
    '꽃밭': [꼳빧, 'котпат'],꼳빧undefined
  };
  const rows = parseCsv(lexical);
  for (const [word, [surface, target]] of Object.entries(expected)) {
    const row = rows.find((item) => item.input === word);
    assert.ok(row, word);
    assert.equal(row.surface_hangul, surface, word);
    assert.equal(row.target_status, 'provisional', word);
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ukrainian, target, word);
    assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
  }
});

test('NIKL §22 preserves both permitted [어] and [여] readings', () => {
  const expected = {
    '되어': {target:'твео', ipa:'tø.ʌ', alternateSurface:'되여', alternateTarget:'твейо', alternateIpa:'tø.jʌ'},
    '피어': {target:'піо', ipa:'pʰi.ʌ', alternateSurface:'피여', alternateTarget:'пійо', alternateIpa:'pʰi.jʌ'},
    '이오': {target:'іо', ipa:'i.o', alternateSurface:'이요', alternateTarget:'ійо', alternateIpa:'i.jo'},
    '아니오': {target:'аніо', ipa:'a.ni.o', alternateSurface:'아니요', alternateTarget:'анійо', alternateIpa:'a.ni.jo'},
  };
  for (const [word, values] of Object.entries(expected)) {
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ukrainian, values.target, word);
    assert.equal(result.ipa, values.ipa, word);
    assert.equal(result.variants.length, 1, word);
    assert.equal(result.variants[0].surface, values.alternateSurface, word);
    assert.equal(result.variants[0].ukrainian, values.alternateTarget, word);
    assert.equal(result.variants[0].ipa, values.alternateIpa, word);
    assert.equal(result.variants[0].status, 'lexical-review', word);
  }
});

test('NIKL §5 ㅢ variants preserve lexical and particle-conditioned readings', () => {
  const expected = {
    '주의': {surface:'주의', target:'чуий', ipa:'tɕu.ɰi', alternateSurface:'주이', alternateTarget:'чуі', alternateIpa:'tɕu.i'},
    '협의': {surface:'혀븨', target:'гьобі', ipa:'hjʌ.bi', alternateSurface:'혀비', alternateTarget:'гьобі', alternateIpa:'hjʌ.bi'},
    '우리의': {surface:'우리의', target:'уріий', ipa:'u.ɾi.ɰi', alternateSurface:'우리에', alternateTarget:'уріе', alternateIpa:'u.ɾi.e'},
    '강의의': {surface:'강의의', target:'канийий', ipa:'kaːŋ.ɰi.ɰi', alternateSurface:'강이에', alternateTarget:'каніе', alternateIpa:'kaːŋ.i.e'},
  };
  const rows = parseCsv(lexical);
  for (const [word, values] of Object.entries(expected)) {
    const row = rows.find((item) => item.input === word);
    assert.ok(row, word);
    assert.equal(row.surface_hangul, values.surface, word);
    assert.equal(row.target_status, 'provisional', word);
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ukrainian, values.target, word);
    assert.equal(result.ipa, values.ipa, word);
    assert.equal(result.variants.length, 1, word);
    assert.equal(result.variants[0].surface, values.alternateSurface, word);
    assert.equal(result.variants[0].ukrainian, values.alternateTarget, word);
    assert.equal(result.variants[0].ipa, values.alternateIpa, word);
  }
});

test('NIKL §§6–7 source-backed length examples preserve long vowels and alternants', () => {
  const expected = {
    '눈보라': [눈보라, 'нунбора', 'nuːn bo ɾa'],눈보라undefined
    '말씨': [말씨, 'малші', 'maːl ɕ͈i'],말씨undefined
    '밤나무': [밤나무, 'памнаму', 'paːm na mu'],밤나무undefined
    '많다': [만타, 'манта', 'maːn tʰa'],만타undefined
    '멀리': [멀리, 'моллі', 'mʌːl li'],멀리undefined
    '벌리다': [벌리다, 'полліда', 'pʌːl li da'],벌리다undefined
    '첫눈': [천눈, 'чоннун', 'tɕʰʌn nun'],천눈undefined
    '수많이': [수마니, 'сумані', 'suː ma ni'],수마니undefined
    '재삼재사': [재삼재사, 'чесамджеса', 'tɕɛː sam dʑɛː sa'],재삼재사undefined
    '감다': [감따, 'камта', 'kaːm t͈a'],감따undefined
    '감으니': [가므니, 'камині', 'ka mɯ ni'],가므니undefined
    '밟다': [밥따, 'папта', 'paːp̚ t͈a'],밥따undefined
    '밟으면': [발브면, 'палбимйон', 'pal bɯ mjʌn'],발브면undefined
    '신다': [신따, 'шінта', 'ɕiːn t͈a'],신따undefined
    '신어': [시너, 'шіно', 'ɕi nʌ'],시너undefined
    '알다': [알다, 'алда', 'aːl da'],알다undefined
    '알아': [아라, 'ара', 'a ɾa'],아라undefined
    '끌다': [끌따, 'килта', 'k͈ɯːl t͈a'],끌따undefined
    '끌어': [끄러, 'киро', 'k͈ɯː ɾʌ'],끄러undefined
    '떫다': [떨따, 'толта', 't͈ʌːl t͈a'],떨따undefined
    '떫은': [떨븐, 'толбин', 't͈ʌːl bɯn'],떨븐undefined
    '벌다': [벌다, 'полда', 'pʌːl da'],벌다undefined
    '벌어': [버러, 'поро', 'pʌː ɾʌ'],버러undefined
    '썰다': [썰다, 'солда', 's͈ʌːl da'],썰다undefined
    '썰어': [써러, 'соро', 's͈ʌː ɾʌ'],써러undefined
    '감기다': [감기다, 'камґіда', 'kam ɡi da'],감기다undefined
    '꼬이다': [꼬이다, 'коіда', 'k͈o i da'],꼬이다undefined
    '밟히다': [발피다, 'палпіда', 'pal pʰi da'],발피다undefined
    '끌리다': [끌리다, 'килліда', 'k͈ɯːl li da'],끌리다undefined
    '없으니': [업쓰니, 'опсині', 'ʌːp̚ s͈ɯ ni'],업쓰니undefined
    '없애다': [업쌔다, 'опседа', 'ʌːp̚ s͈ɛ da'],업쌔다undefined
  };
  const rows = parseCsv(lexical);
  for (const [word, [surface, target, ipa]] of Object.entries(expected)) {
    const row = rows.find((item) => item.input === word);
    assert.ok(row, word);
    assert.equal(row.surface_hangul, surface, word);
    assert.equal(row.target_status, 'provisional', word);
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ukrainian, target, word);
    assert.equal(result.ipa, ipa, word);
  }
  const compound = engine.convert('반신반의');
  assert.equal(compound.status, 'lexical-review');
  assert.equal(compound.ukrainian, 'паншінбані');
  assert.equal(compound.ipa, 'paːn ɕin baː ni');
  assert.equal(compound.variants[0].surface, '반신바니');
  assert.equal(compound.variants[0].ukrainian, 'паншінбані');
  assert.equal(compound.variants[0].ipa, 'paːn ɕin baː ni');
});

test('NIKL §4–§5 preserves permitted vowel variants and contracted ㅕ readings', () => {
  const variants = {
    '회': {surface:'회', target:'гве', ipa:'hø', alternateSurface:'회', alternateTarget:'гве', alternateIpa:'hwe'},
    '위': {surface:'위', target:'ві', ipa:'y', alternateSurface:'위', alternateTarget:'ві', alternateIpa:'wi'},
    '계집': {surface:'계집', target:'кєджіп', ipa:'kjeː.dʑip̚', alternateSurface:'게집', alternateTarget:'кеджіп', alternateIpa:'keː.dʑip̚'},
    '계시다': {surface:'계시다', target:'кєшіда', ipa:'kjeː.ɕi.da', alternateSurface:'게시다', alternateTarget:'кешіда', alternateIpa:'keː.ɕi.da'},
    '시계': {surface:'시계', target:'шіґє', ipa:'ɕi.ɡje', alternateSurface:'시게', alternateTarget:'шіґе', alternateIpa:'ɕi.ɡe'},
    '연계': {surface:'연계', target:'йонґє', ipa:'jʌn.ɡje', alternateSurface:'연게', alternateTarget:'йонґе', alternateIpa:'jʌn.ɡe'},
    '몌별': {surface:'몌별', target:'мєбйол', ipa:'mje.bjʌl', alternateSurface:'메별', alternateTarget:'мебйол', alternateIpa:'me.bjʌl'},
    '개폐': {surface:'개폐', target:'кепє', ipa:'kɛ.pʰje', alternateSurface:'개페', alternateTarget:'кепе', alternateIpa:'kɛ.pʰe'},
    '혜택': {surface:'혜택', target:'гєтек', ipa:'hjeː.tʰɛk̚', alternateSurface:'헤택', alternateTarget:'гетек', alternateIpa:'heː.tʰɛk̚'},
    '지혜': {surface:'지혜', target:'чігє', ipa:'tɕi.hje', alternateSurface:'지헤', alternateTarget:'чіге', alternateIpa:'tɕi.he'},
  };
  const rows = parseCsv(lexical);
  for (const [word, values] of Object.entries(variants)) {
    const row = rows.find((item) => item.input === word);
    assert.ok(row, word);
    assert.equal(row.surface_hangul, values.surface, word);
    assert.equal(row.target_status, 'provisional', word);
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ukrainian, values.target, word);
    assert.equal(result.ipa, values.ipa, word);
    assert.equal(result.variants.length, 1, word);
    assert.equal(result.variants[0].surface, values.alternateSurface, word);
    assert.equal(result.variants[0].ukrainian, values.alternateTarget, word);
    assert.equal(result.variants[0].ipa, values.alternateIpa, word);
  }
  const contractions = {
    '가져': [가저, 'каджо', 'ka dʑʌ'],가저undefined
    '쪄': [쩌, 'чо', 'tɕ͈ʌ'],쩌undefined
    '다쳐': [다처, 'тачо', 'ta tɕʰʌ'],다처undefined
    '묻혀': [무쳐, 'мучо', 'mu tɕʰʌ'],무쳐undefined
    '붙여': [부쳐, 'пучо', 'pu tɕʰʌ'],부쳐undefined
    '잊혀': [이쳐, 'ічо', 'i tɕʰʌ'],이쳐undefined
  };
  for (const [word, [surface, target, ipa]] of Object.entries(contractions)) {
    const row = rows.find((item) => item.input === word);
    assert.ok(row, word);
    assert.equal(row.surface_hangul, surface, word);
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ukrainian, target, word);
    assert.equal(result.ipa, ipa, word);
  }
});

test('fortisness remains in IPA but is not encoded by doubled Ukrainian graphemes', () => {
  const expected = {
    '맛없다': [мадопта, 'ma dʌp̚ t͈a'],мадоптаundefined
    '맛있다': [мадітта, 'ma dit̚ t͈a'],мадіттаundefined
    '멋있다': [модітта, 'mʌ dit̚ t͈a'],модіттаundefined
    '깎아': [кака, 'k͈a k͈a'],какаundefined
    '있어': [ісо, 'i s͈ʌ'],ісоundefined
    '쫓아': [чоча, 'tɕ͈o tɕʰa'],чочаundefined
    '쌓이다': [саіда, 's͈a i da'],саідаundefined
    '얽거나': [олкона, 'ʌl k͈ʌ na'],олконаundefined
  };
  for (const [word, [target, ipa]] of Object.entries(expected)) {
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ukrainian, target, word);
    assert.equal(result.ipa, ipa, word);
    const entry = parseCsv(lexical).find((row) => row.input === word);
    assert.ok(!entry.target_syllables.split('|').some((syllable) => /(кк|тт|пп|сс|чч)/u.test(syllable)), word);
    if (entry.alternate_target_syllables) {
      assert.ok(!entry.alternate_target_syllables.split('|').some((syllable) => /(кк|тт|пп|сс|чч)/u.test(syllable)), word);
    }
  }
});

test('NIKL §10 complex-coda examples and lexical exceptions are source-backed', () => {
  const expected = {
    '넋과': [넉꽈, 'нокква', 'nʌk̚ k͈wa'],넉꽈undefined
    '앉다': [안따, 'анта', 'an t͈a'],안따undefined
    '여덟': [여덜, 'йодол', 'jʌ dʌl'],여덜undefined
    '넓다': [널따, 'нолта', 'nʌl t͈a'],널따undefined
    '외곬': [외골, 'веґол', 'ø ɡol'],외골undefined
    '밟소': [밥쏘, 'папсо', 'paːp̚ s͈o'],밥쏘undefined
    '밟지': [밥찌, 'папчі', 'paːp̚ tɕ͈i'],밥찌undefined
    '밟게': [밥께, 'папке', 'paːp̚ k͈e'],밥께undefined
    '밟고': [밥꼬, 'папко', 'paːp̚ k͈o'],밥꼬undefined
  };
  const rows = parseCsv(lexical);
  for (const [word, [surface, target, ipa]] of Object.entries(expected)) {
    const row = rows.find((item) => item.input === word);
    assert.ok(row, word);
    assert.equal(row.surface_hangul, surface, word);
    assert.equal(row.target_status, 'provisional', word);
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ukrainian, target, word);
    assert.equal(result.ipa, ipa, word);
    assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
  }
});

test('NIKL §9 regular final-neutralization examples are computed by rules', () => {
  const expected = {
    '닦다': [tak̚ t͈a, 'такта'],tak̚ t͈aundefined
    '키읔': [kʰi ɯk̚, 'кіик'],kʰi ɯk̚undefined
    '키읔과': [kʰi ɯk̚ k͈wa, 'кіикква'],kʰi ɯk̚ k͈waundefined
    '옷': [ot̚, 'от'],ot̚undefined
    '있다': [it̚ t͈a, 'ітта'],it̚ t͈aundefined
    '젖': [tɕʌt̚, 'чот'],tɕʌt̚undefined
    '빚다': [pit̚ t͈a, 'пітта'],pit̚ t͈aundefined
    '꽃': [k͈ot̚, 'кот'],k͈ot̚undefined
    '쫓다': [tɕ͈ot̚ t͈a, 'чотта'],tɕ͈ot̚ t͈aundefined
    '솥': [sot̚, 'сот'],sot̚undefined
    '앞': [ap̚, 'ап'],ap̚undefined
    '덮다': [tʌp̚ t͈a, 'топта'],tʌp̚ t͈aundefined
  };
  const rows = parseCsv(lexical);
  for (const [word, [ipa, target]] of Object.entries(expected)) {
    const reference = rows.find((item) => item.input === word);
    // A surface-only row may document the normative Hangul reading, but must
    // not override the general engine's contextual analysis or target output.
    assert.ok(!reference || reference.target_status === 'surface-only', word);
    const result = engine.convert(word);
    assert.equal(result.ipa, ipa, word);
    assert.equal(result.ukrainian, target, word);
    assert.ok(!result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
  }
});

test('NIKL §9 lexical vowel-length examples preserve source length in IPA', () => {
  const expected = {
    '웃다': [욷따, 'uːt̚ t͈a', 'утта'],욷따undefined
    '뱉다': [밷따, 'pɛːt̚ t͈a', 'петта'],밷따undefined
  };
  const rows = parseCsv(lexical);
  for (const [word, [surface, ipa, target]] of Object.entries(expected)) {
    const row = rows.find((item) => item.input === word);
    assert.ok(row, word);
    assert.equal(row.surface_hangul, surface, word);
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ipa, ipa, word);
    assert.equal(result.ukrainian, target, word);
  }
});

test('NIKL §18 official nasal-assimilation examples are source-backed', () => {
  const expected = {
    '먹는': [멍는, 'mʌŋ nɯn', 'моннин'],멍는undefined
    '깎는': [깡는, 'k͈aŋ nɯn', 'каннин'],깡는undefined
    '키읔만': [키응만, 'kʰi ɯŋ man', 'кіинман'],키응만undefined
    '몫몫이': [몽목씨, 'moŋ mok̚ ɕ͈i', 'монмокші'],몽목씨undefined
    '긁는': [긍는, 'kɯŋ nɯn', 'киннин'],긍는undefined
    '흙만': [흥만, 'hɯŋ man', 'гинман'],흥만undefined
    '닫는': [단는, 'tan nɯn', 'таннин'],단는undefined
    '짓는': [진는, 'tɕiːn nɯn', 'чіннин'],진는undefined
    '옷맵시': [온맵씨, 'on mɛp̚ ɕ͈i', 'онмепші'],온맵씨undefined
    '있는': [인는, 'in nɯn', 'іннин'],인는undefined
    '맞는': [만는, 'man nɯn', 'маннин'],만는undefined
    '젖멍울': [전멍울, 'tɕʌn mʌŋ ul', 'чонмонул'],전멍울undefined
    '쫓는': [쫀는, 'tɕ͈on nɯn', 'чоннин'],쫀는undefined
    '꽃망울': [꼰망울, 'k͈on maŋ ul', 'конманул'],꼰망울undefined
    '붙는': [분는, 'pun nɯn', 'пуннин'],분는undefined
    '놓는': [논는, 'non nɯn', 'ноннин'],논는undefined
    '잡는': [잠는, 'tɕam nɯn', 'чамнин'],잠는undefined
    '밥물': [밤물, 'pam mul', 'паммул'],밤물undefined
    '앞마당': [암마당, 'am ma daŋ', 'аммадан'],암마당undefined
    '읊는': [음는, 'ɯm nɯn', 'имнин'],음는undefined
  };
  const rows = parseCsv(lexical);
  for (const [word, [surface, ipa, target]] of Object.entries(expected)) {
    const row = rows.find((item) => item.input === word);
    assert.ok(row, word);
    assert.equal(row.surface_hangul, surface, word);
    assert.equal(row.target_status, 'provisional', word);
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ipa, ipa, word);
    assert.equal(result.ukrainian, target, word);
    assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
  }
});

test('NIKL §18 cross-word examples nasalize across connected phrase boundaries', () => {
  const expected = {
    '책 넣는다': tɕʰɛŋ nʌn.nɯn.da,tɕʰɛŋ nʌn.nɯn.daundefined
    '흙 말리다': hɯŋ mal.li.da,hɯŋ mal.li.daundefined
    '옷 맞추다': on mat̚.tɕʰu.da,on mat̚.tɕʰu.daundefined
    '밥 먹는다': pam mʌŋ.nɯn.da,pam mʌŋ.nɯn.daundefined
    '값 매기다': kam mɛ.ɡi.da,kam mɛ.ɡi.daundefined
  };
  for (const [phrase, ipa] of Object.entries(expected)) {
    const result = engine.convert(phrase);
    assert.equal(result.ipa, ipa, phrase);
    assert.ok(result.trace.some((item) => item.rules.includes('nasal-assimilation')), phrase);
  }
});

test('NIKL §11 generic complex-coda examples use the general rules', () => {
  // Official forms: 닭[닥], 흙과[흑꽈], 늙지[늑찌], 읊고[읍꼬], 읊다[읍따].
  const expected = {
    '닭': [tak̚, 'так'],tak̚undefined
    '늙지': [nɯk̚ tɕ͈i, 'никчі'],nɯk̚ tɕ͈iundefined
    '읊고': [ɯp̚ k͈o, 'ипко'],ɯp̚ k͈oundefined
    '읊다': [ɯp̚ t͈a, 'ипта'],ɯp̚ t͈aundefined
  };
  const rows = parseCsv(lexical);
  for (const [word, [ipa, target]] of Object.entries(expected)) {
    const reference = rows.find((item) => item.input === word);
    // Surface-only entries document the Korean reading but do not override
    // the general rule engine's output or trace.
    assert.ok(!reference || reference.target_status === 'surface-only', word);
    const result = engine.convert(word);
    assert.equal(result.ipa, ipa, word);
    assert.equal(result.ukrainian, target, word);
    assert.ok(!result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
  }
});

test('NIKL §11 lexical length and morphology exceptions preserve official readings', () => {
  const expected = {
    '흙과': [흑꽈, 'hɯk̚ k͈wa', 'гикква'],흑꽈undefined
    '삶': [삼, 'saːm', 'сам'],삼undefined
    '젊다': [점따, 'tɕʌːm t͈a', 'чомта'],점따undefined
  };
  const rows = parseCsv(lexical);
  for (const [word, [surface, ipa, target]] of Object.entries(expected)) {
    const row = rows.find((item) => item.input === word);
    assert.ok(row, word);
    assert.equal(row.surface_hangul, surface, word);
    assert.equal(row.target_status, 'provisional', word);
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ipa, ipa, word);
    assert.equal(result.ukrainian, target, word);
  }
});

test('NIKL §19 official examples preserve rule order before §18 nasalization', () => {
  const expected = {
    '침략': [tɕʰim njak̚,.['liquid-to-nasal-before-obstruent']],tɕʰim njak̚undefined
    '강릉': [kaŋ nɯŋ,.['liquid-to-nasal-before-obstruent']],kaŋ nɯŋundefined
    '막론': [maŋ non, ['liquid-to-nasal-before-obstruent', 'nasal-assimilation']],maŋ nonundefined
    '석류': [sʌŋ nju, ['liquid-to-nasal-before-obstruent', 'nasal-assimilation']],sʌŋ njuundefined
    '협력': [hjʌm njʌk̚, ['liquid-to-nasal-before-obstruent', 'nasal-assimilation']],hjʌm njʌk̚undefined
    '법리': [pʌm ni, ['liquid-to-nasal-before-obstruent', 'nasal-assimilation']],pʌm niundefined
  };
  const rows = parseCsv(lexical);
  for (const [word, [ipa, rules]] of Object.entries(expected)) {
    assert.ok(!rows.some((item) => item.input === word), word);
    const result = engine.convert(word);
    assert.equal(result.ipa, ipa, word);
    assert.ok(!result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
    for (const rule of rules) {
      assert.ok(result.trace.some((item) => item.rules.includes(rule)), word + ': ' + rule);
    }
  }
});

test('NIKL §20 general liquid-assimilation examples use the general rules', () => {
  const expected = {
    '천리': tɕʰʌl.li,tɕʰʌl.liundefined
    '물난리': mul.lal.li,mul.lal.liundefined
    '할는지': hal.lɯn.dʑi,hal.lɯn.dʑiundefined
    '닳는': tal.lɯn,tal.lɯnundefined
    '뚫는': t͈ul.lɯn,t͈ul.lɯnundefined
    '핥네': hal.le,hal.leundefined
  };
  const rows = parseCsv(lexical);
  for (const [word, ipa] of Object.entries(expected)) {
    assert.ok(!rows.some((item) => item.input === word), word);
    const result = engine.convert(word);
    assert.equal(result.ipa, ipa, word);
    assert.ok(!result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
    assert.ok(result.trace.some((item) => item.rules.includes('liquid-assimilation')), word);
  }
});

test('NIKL §20 lexical ㄹ-to-ㄴ exceptions are exact source-backed entries', () => {
  const expected = {
    '줄넘기': [줄럼끼, 'tɕul lʌm k͈i', 'чулломкі'],줄럼끼undefined
    '임진란': [임진난, 'imː dʑin nan', 'імджіннан'],임진난undefined
    '생산량': [생산냥, 'sɛŋ san njaŋ', 'сенсаннян'],생산냥undefined
    '결단력': [결딴녁, 'kjʌl t͈an njʌk̚', 'кйолтанньок'],결딴녁undefined
    '공권력': [공꿘녁, 'koŋ k͈wʌn njʌk̚', 'конквонньок'],공꿘녁undefined
    '동원령': [동원녕, 'toŋː wʌn njʌŋ', 'тонвонньон'],동원녕undefined
    '상견례': [상견녜, 'saŋ ɡjʌn nje', 'санґйоннє'],상견녜undefined
    '이원론': [이원논, 'iː wʌn non', 'івоннон'],이원논undefined
    '입원료': [이붠뇨, 'i bwʌn njo', 'ібвонньо'],이붠뇨undefined
    '구근류': [구근뉴, 'ku ɡɯn nju', 'куґинню'],구근뉴undefined
  };
  const rows = parseCsv(lexical);
  for (const [word, [surface, ipa, target]] of Object.entries(expected)) {
    const row = rows.find((item) => item.input === word);
    assert.ok(row, word);
    assert.equal(row.surface_hangul, surface, word);
    assert.equal(row.target_status, 'provisional', word);
    const result = engine.convert(word);
    assert.equal(result.status, 'lexical-review', word);
    assert.equal(result.ipa, ipa, word);
    assert.equal(result.ukrainian, target, word);
    assert.ok(result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
  }
});


test('user-supplied high-risk corpus has source-backed Korean surface forms', () => {
  const expected = {
    '신라': 실라,실라undefined
    '설날': 설랄,설랄undefined
    '종로': 종노,종노undefined
    '해돋이': 해도지,해도지undefined
    '맏이': 마지,마지undefined
    '숱이': 수치,수치undefined
    '끝이': 끄치,끄치undefined
    '값이': 갑씨,갑씨undefined
    '없어': 업써,업써undefined
    '맑다': 막따,막따undefined
    '밝다': 박따,박따undefined
    '넓다': 널따,널따undefined
    '넓고': 널꼬,널꼬undefined
    '밟다': 밥따,밥따undefined
    '밟고': 밥꼬,밥꼬undefined
    '밟는': 밤는,밤는undefined
    '삶': 삼,삼undefined
    '젊다': 점따,점따undefined
    '읊다': 읍따,읍따undefined
    '읊고': 읍꼬,읍꼬undefined
    '앉다': 안따,안따undefined
    '앉고': 안꼬,안꼬undefined
    '앉는': 안는,안는undefined
    '많다': 만타,만타undefined
    '많고': 만코,만코undefined
    '많습니다': 만씀니다,만씀니다undefined
    '좋다': 조타,조타undefined
    '좋고': 조코,조코undefined
    '좋지': 조치,조치undefined
    '좋습니다': 조씀니다,조씀니다undefined
    '놓고': 노코,노코undefined
    '놓는': 논는,논는undefined
    '놓지': 노치,노치undefined
    '낳다': 나타,나타undefined
    '낳고': 나코,나코undefined
    '낫다': 낟따,낟따undefined
    '낫고': 낟꼬,낟꼬undefined
    '낫지': 낟찌,낟찌undefined
    '낯설다': 낟썰다,낟썰다undefined
    '낮잠': 낟짬,낟짬undefined
    '꽃망울': 꼰망울,꼰망울undefined
    '옷맵시': 온맵씨,온맵씨undefined
    '앞문': 암문,암문undefined
    '앞니': 암니,암니undefined
    '콧물': 콘물,콘물undefined
    '국민': 궁민,궁민undefined
    '국물': 궁물,궁물undefined
    '박물관': 방물관,방물관undefined
    '서울역': 서울력,서울력undefined
    '한국말': 한궁말,한궁말undefined
    '한국어': 한구거,한구거undefined
  };
  const rows = parseCsv(lexical);
  for (const [word, surface] of Object.entries(expected)) {
    const entry = rows.find((row) => row.input === word);
    assert.ok(entry, 'missing lexical pronunciation: ' + word);
    assert.equal(entry.surface_hangul, surface, word);
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, surface, word);
    assert.ok(!result.ukrainian.includes('⟦'), 'unexpected unresolved marker: ' + word);
    assert.ok(result.ipa.length > 0, 'missing IPA: ' + word);
  }
});

test('surface-only lexicon records do not bypass the general rule engine', () => {
  const expected = [
    ['신라', '실라', 'liquid-assimilation'],
    ['앞문', '암문', 'nasal-assimilation'],
    ['밟는', '밤는', 'lexical-coda-balm'],
    ['읊고', '읍꼬', 'tensification'],
  ];
  for (const [word, surface, rule] of expected) {
    const result = engine.convert(word);
    assert.equal(result.surfaceHangul, surface, word);
    assert.ok(result.trace.some(item => item.rules.includes(rule)), word);
    assert.ok(result.trace.every(item => !item.rules.includes('lexical-pronunciation')), word);
  }
});

test('surface pronunciation is exposed for lexical forms and omitted for unverified general forms', () => {
  const sourced = engine.convert('해돋이');
  assert.equal(sourced.surfaceHangul, '해도지');
  const general = engine.convert('눈물');
  assert.equal(general.surfaceHangul, '');
});


test('all 154 user-supplied tokens and phrases are stable end-to-end smoke inputs', () => {
  assert.equal(userCorpus.length, 154);
  for (const source of userCorpus) {
    const result = engine.convert(source);
    assert.equal(result.source, source, source);
    assert.equal(typeof result.ukrainian, 'string', source);
    assert.equal(typeof result.ipa, 'string', source);
    assert.equal(typeof result.analysis, 'string', source);
    assert.ok(Array.isArray(result.trace), source);
    assert.ok(Array.isArray(result.issues), source);
  }
});
