import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
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
  assert.equal(result.ukrainian, 'соуллйок');
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
  assert.ok(result.ukrainian.includes('ий'));
  assert.match(result.ipa, /ɰi/);
  assert.ok(result.trace.some((item) => item.rules.includes('vowel-ui-default-ɰi')));
});

test('ㅢ with a consonant onset follows §5 and is realized as [i]', () => {
  const result = engine.convert('희망');
  assert.equal(result.ukrainian, 'хіман');
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

test('the complete official institution name preserves sequential §19, §18 and §23 rules', () => {
  const result = engine.convert('국립국어원');
  assert.equal(result.ukrainian, 'кунніпкуґовон');
  assert.equal(result.ipa, 'kuŋ nip̚ k͈u ɡʌ wʌn');
  assert.ok(result.trace.some((item) => item.rules.includes('liquid-to-nasal-before-obstruent')));
  assert.ok(result.trace.some((item) => item.rules.includes('nasal-assimilation')));
  assert.ok(result.trace.some((item) => item.rules.includes('tensification')));
});

test('unlicensed spelling-only palatalization is withheld instead of guessed', () => {
  const result = engine.convert('갇이');
  assert.equal(result.status, 'unresolved');
  assert.equal(result.ukrainian, '⟦갇⟧⟦이⟧');
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
    assert.match(row.source_url, /^https:\/\/(www\.|m\.)?korean\.go\.kr\//, row.input);
    assert.ok([...row.surface_hangul].every((char) => /[가-힣]/u.test(char)), row.input);
    assert.equal([...row.input].length, row.target_syllables.split('|').length, row.input);
    assert.equal([...row.input].length, row.ipa_syllables.split('|').length, row.input);
    if (row.target_status === 'provisional') {
      assert.equal(engine.convert(row.input).status, 'lexical-review', row.input);
    }
  }
});

test('NIKL §17 exact examples use sourced entries; the Ukrainian target stays explicitly provisional', () => {
  const expected = {
    같이: {surface:'가치', target:'качі', ipa:'ka tɕʰi'},
    굳이: {surface:'구지', target:'куджі', ipa:'ku dʑi'},
    곧이듣다: {surface:'고지듣따', target:'коджідитта', ipa:'ko dʑi tɯt̚ t͈a'},
    굳히다: {surface:'구치다', target:'кучіда', ipa:'ku tɕʰi da'},
    닫히다: {surface:'다치다', target:'дачіда', ipa:'ta tɕʰi da'},
    묻히다: {surface:'무치다', target:'мучіда', ipa:'mu tɕʰi da'},
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
    맛없다: {surface:'마덥따', target:'\u043c\u0430\u0434\u0435\u043f\u0442\u0442\u0430', ipa:'ma dʌp̚ t͈a'},
    겉옷: {surface:'거돋', target:'ґодот', ipa:'kʌ dot̚'},
    헛웃음: {surface:'허두슴', target:'ходусим', ipa:'hʌ du sɯm'},
    값어치: {surface:'가버치', target:'кабочі', ipa:'ka bʌ tɕʰi'},
    젖어미: {surface:'저더미', target:'джодомі', ipa:'tɕʌ dʌ mi'},
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
    맛있다: {surface:'마딛따', target:'мадіттта', ipa:'ma dit̚ t͈a', alternateSurface:'마싣따', alternateTarget:'машіттта', alternateIpa:'ma ɕit̚ t͈a'},
    멋있다: {surface:'머딛따', target:'модіттта', ipa:'mʌ dit̚ t͈a', alternateSurface:'머싣따', alternateTarget:'мошіттта', alternateIpa:'mʌ ɕit̚ t͈a'},
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
  assert.equal(phrase.variants[0].ukrainian, 'машіттта!');
  assert.equal(phrase.variants[0].ipa, 'ma ɕit̚ t͈a!');
});

test('unknown complex-coda liaison is unresolved rather than guessed as §14', () => {
  for (const word of ['넋어', '값어']) {
    const result = engine.convert(word);
    assert.equal(result.status, 'unresolved', word);
    assert.ok(result.ukrainian.includes('⟦'), word);
    assert.ok(result.issues.some((issue) => issue.includes('complex-coda liaison differs')), word);
    assert.ok(result.trace.some((item) => item.rules.includes('complex-coda-liaison-requires-morphology')), word);
  }
});

test('sourced §14 complex-coda examples use exact surface forms and provisional Ukrainian targets', () => {
  const expected = {
    넋이: {surface:'넉씨', target:'нокші', ipa:'nʌk̚ s͈i'},
    값이: {surface:'갑씨', target:'капші', ipa:'kap̚ s͈i'},
    앉아: {surface:'안자', target:'анджа', ipa:'an dʑa'},
    닭을: {surface:'달글', target:'талґил', ipa:'tal ɡɯl'},
    젊어: {surface:'절머', target:'джолмо', ipa:'tɕʌl mʌ'},
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

test('simple codas with §15-sensitive representatives are not transferred blindly', () => {
  const result = engine.convert('옷어');
  assert.equal(result.status, 'unresolved');
  assert.ok(result.ukrainian.includes('⟦옷⟧'));
  assert.ok(result.issues.some((issue) => issue.includes('coda representative changes under §15')));
  assert.ok(result.trace.some((item) => item.rules.includes('substantive-morpheme-liaison-requires-morphology')));
});

test('sourced §13 simple-coda examples preserve their formal-morpheme readings', () => {
  const expected = {
    깎아: {surface:'까까', target:'ккакка', ipa:'k͈a k͈a'},
    있어: {surface:'이써', target:'іссо', ipa:'i s͈ʌ'},
    쫓아: {surface:'쪼차', target:'ччоча', ipa:'tɕ͈o tɕʰa'},
    덮어: {surface:'더퍼', target:'топо', ipa:'tʌ pʰʌ'},
    맞아: {surface:'마자', target:'маджа', ipa:'ma dʑa'},
    낮아: {surface:'나자', target:'наджа', ipa:'na dʑa'},
    붙어: {surface:'부터', target:'путо', ipa:'pu tʰʌ'},
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

test('official §12 complex-coda + ㅎ examples use exact lexical evidence', () => {
  const expected = {
    읽히다: {surface:'일키다', target:'ілкіда', ipa:'il kʰi da'},
    앉히다: {surface:'안치다', target:'анчіда', ipa:'an tɕʰi da'},
    넓히다: {surface:'널피다', target:'нолпіда', ipa:'nʌl pʰi da'},
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
  assert.ok(result.ukrainian.includes('⟦넋⟧'));
  assert.ok(result.issues.some((issue) => issue.includes('§12 complex-coda + ㅎ aspiration depends')));
  assert.ok(result.trace.some((item) => item.rules.includes('complex-coda-h-aspiration-requires-morphology')));
});

test('official §12(4) H-deletion examples are sourced and marked provisional on the Ukrainian side', () => {
  const expected = {
    낳은: {surface:'나은', target:'наин', ipa:'na ɯn'},
    놓아: {surface:'노아', target:'ноа', ipa:'no a'},
    쌓이다: {surface:'싸이다', target:'ссаіда', ipa:'s͈a i da'},
    많아: {surface:'마나', target:'мана', ipa:'ma na'},
    않은: {surface:'아는', target:'анин', ipa:'a nɯn'},
    닳아: {surface:'다라', target:'тара', ipa:'ta ɾa'},
    싫어도: {surface:'시러도', target:'шіродо', ipa:'ɕi ɾʌ do'},
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
    '디귿이': ['디그시', 'диґиші', 'ti ɡɯ ɕi'],
    '디귿을': ['디그슬', 'диґисил', 'ti ɡɯ sɯl'],
    '디귿에': ['디그세', 'диґисе', 'ti ɡɯ se'],
    '지읒이': ['지으시', 'чіиші', 'tɕi ɯ ɕi'],
    '지읒을': ['지으슬', 'чіисил', 'tɕi ɯ sɯl'],
    '지읒에': ['지으세', 'чіисе', 'tɕi ɯ se'],
    '치읓이': ['치으시', 'чіиші', 'tɕʰi ɯ ɕi'],
    '치읓을': ['치으슬', 'чіисил', 'tɕʰi ɯ sɯl'],
    '치읓에': ['치으세', 'чіисе', 'tɕʰi ɯ se'],
    '키읔이': ['키으기', 'кіиґі', 'kʰi ɯ ɡi'],
    '키읔을': ['키으글', 'кіиґил', 'kʰi ɯ ɡɯl'],
    '키읔에': ['키으게', 'кіиґе', 'kʰi ɯ ɡe'],
    '티읕이': ['티으시', 'тіиші', 'tʰi ɯ ɕi'],
    '티읕을': ['티으슬', 'тіисил', 'tʰi ɯ sɯl'],
    '티읕에': ['티으세', 'тіисе', 'tʰi ɯ se'],
    '피읖이': ['피으비', 'піибі', 'pʰi ɯ bi'],
    '피읖을': ['피으블', 'піибил', 'pʰi ɯ bɯl'],
    '피읖에': ['피으베', 'піибе', 'pʰi ɯ be'],
    '히읗이': ['히으시', 'хіиші', 'hi ɯ ɕi'],
    '히읗을': ['히으슬', 'хіисил', 'hi ɯ sɯl'],
    '히읗에': ['히으세', 'хіисе', 'hi ɯ se'],
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

test('NIKL §21 negative controls prevent nonstandard place assimilation', () => {
  const expected = {
    '감기': ['감기', 'камґі'],
    '옷감': ['옫깜', 'откам'],
    '있고': ['읻꼬', 'ітко'],
    '꽃길': ['꼳낄', 'коткіл'],
    '젖먹이': ['전머기', 'джонмоґі'],
    '문법': ['문뻡', 'мунпоп'],
    '꽃밭': ['꼳빧', 'котпат'],
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
    '되어': {target:'твео', ipa:'tø ʌ', alternateSurface:'되여', alternateTarget:'твейо', alternateIpa:'tø jʌ'},
    '피어': {target:'піо', ipa:'pʰi ʌ', alternateSurface:'피여', alternateTarget:'пійо', alternateIpa:'pʰi jʌ'},
    '이오': {target:'іо', ipa:'i o', alternateSurface:'이요', alternateTarget:'ійо', alternateIpa:'i jo'},
    '아니오': {target:'аніо', ipa:'a ni o', alternateSurface:'아니요', alternateTarget:'анійо', alternateIpa:'a ni jo'},
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
    '주의': {surface:'주의', target:'чуий', ipa:'tɕu ɰi', alternateSurface:'주이', alternateTarget:'чуі', alternateIpa:'tɕu i'},
    '협의': {surface:'혀븨', target:'хьобий', ipa:'hjʌ bɰi', alternateSurface:'혀비', alternateTarget:'хьобі', alternateIpa:'hjʌ bi'},
    '우리의': {surface:'우리의', target:'уріий', ipa:'u ɾi ɰi', alternateSurface:'우리에', alternateTarget:'уріе', alternateIpa:'u ɾi e'},
    '강의의': {surface:'강의의', target:'канийий', ipa:'kaːŋ ɰi ɰi', alternateSurface:'강이에', alternateTarget:'каніе', alternateIpa:'kaːŋ i e'},
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
    '눈보라': ['눈보라', 'нунбора', 'nuːn bo ɾa'],
    '말씨': ['말씨', 'малсі', 'maːl s͈i'],
    '밤나무': ['밤나무', 'памнаму', 'paːm na mu'],
    '많다': ['만타', 'манта', 'maːn tʰa'],
    '멀리': ['멀리', 'моллі', 'mʌːl li'],
    '벌리다': ['벌리다', 'полліда', 'pʌːl li da'],
    '첫눈': ['천눈', 'чоннун', 'tɕʰʌn nun'],
    '수많이': ['수마니', 'сумані', 'suː ma ni'],
    '재삼재사': ['재삼재사', 'чесамджеса', 'tɕɛː sam dʑɛː sa'],
    '감다': ['감따', 'камта', 'kaːm t͈a'],
    '감으니': ['가므니', 'камині', 'ka mɯ ni'],
    '밟다': ['밥따', 'папта', 'paːp̚ t͈a'],
    '밟으면': ['발브면', 'палбимйон', 'pal bɯ mjʌn'],
    '신다': ['신따', 'шінта', 'ɕiːn t͈a'],
    '신어': ['시너', 'шіно', 'ɕi nʌ'],
    '알다': ['알다', 'алта', 'aːl da'],
    '알아': ['아라', 'ара', 'a ɾa'],
    '끌다': ['끌따', 'килта', 'k͈ɯl t͈a'],
    '끌어': ['끄러', 'киро', 'k͈ɯː ɾʌ'],
    '떫다': ['떨따', 'толта', 't͈ʌːl t͈a'],
    '떫은': ['떨븐', 'толбин', 't͈ʌːl bɯn'],
    '벌다': ['벌다', 'полта', 'pʌːl da'],
    '벌어': ['버러', 'боро', 'pʌː ɾʌ'],
    '썰다': ['썰다', 'солта', 's͈ʌːl da'],
    '썰어': ['써러', 'соро', 's͈ʌː ɾʌ'],
    '감기다': ['감기다', 'камґіда', 'kam ɡi da'],
    '꼬이다': ['꼬이다', 'коіда', 'k͈o i da'],
    '밟히다': ['발피다', 'палпіда', 'pal pʰi da'],
    '끌리다': ['끌리다', 'килліда', 'k͈ɯːl li da'],
    '없으니': ['업쓰니', 'опсині', 'ʌːp̚ s͈ɯ ni'],
    '없애다': ['업쌔다', 'опседа', 'ʌːp̚ s͈ɛ da'],
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
  assert.equal(compound.ukrainian, 'паншінбаний');
  assert.equal(compound.ipa, 'paːn ɕin baː nɰi');
  assert.equal(compound.variants[0].surface, '반신바니');
  assert.equal(compound.variants[0].ukrainian, 'паншінбані');
  assert.equal(compound.variants[0].ipa, 'paːn ɕin baː ni');
});

test('NIKL §4–§5 preserves permitted vowel variants and contracted ㅕ readings', () => {
  const variants = {
    '회': {surface:'회', target:'хве', ipa:'hø', alternateSurface:'훼', alternateTarget:'хве', alternateIpa:'hwe'},
    '위': {surface:'위', target:'ві', ipa:'y', alternateSurface:'위', alternateTarget:'ві', alternateIpa:'wi'},
    '계집': {surface:'계집', target:'кєджіп', ipa:'kjeː dʑip̚', alternateSurface:'게집', alternateTarget:'кеджіп', alternateIpa:'keː dʑip̚'},
    '계시다': {surface:'계시다', target:'кєшіда', ipa:'kjeː ɕi da', alternateSurface:'게시다', alternateTarget:'кешіда', alternateIpa:'keː ɕi da'},
    '시계': {surface:'시계', target:'шіґє', ipa:'ɕi ɡje', alternateSurface:'시게', alternateTarget:'шіґе', alternateIpa:'ɕi ɡe'},
    '연계': {surface:'연계', target:'йонґє', ipa:'jʌn ɡje', alternateSurface:'연게', alternateTarget:'йонґе', alternateIpa:'jʌn ɡe'},
    '몌별': {surface:'몌별', target:'мєбйол', ipa:'mje bjʌl', alternateSurface:'메별', alternateTarget:'мебйол', alternateIpa:'me bjʌl'},
    '개폐': {surface:'개폐', target:'кепє', ipa:'kɛ pʰje', alternateSurface:'개페', alternateTarget:'кепе', alternateIpa:'kɛ pʰe'},
    '혜택': {surface:'혜택', target:'хєтек', ipa:'hjeː tʰɛk̚', alternateSurface:'헤택', alternateTarget:'хетек', alternateIpa:'heː tʰɛk̚'},
    '지혜': {surface:'지혜', target:'чіхє', ipa:'tɕi hje', alternateSurface:'지헤', alternateTarget:'чіхе', alternateIpa:'tɕi he'},
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
    '가져': ['가저', 'каджо', 'ka dʑʌ'],
    '쪄': ['쩌', 'чо', 'tɕ͈ʌ'],
    '다쳐': ['다처', 'тачо', 'ta tɕʰʌ'],
    '묻혀': ['무쳐', 'мучо', 'mu tɕʰʌ'],
    '붙여': ['부쳐', 'пучо', 'pu tɕʰʌ'],
    '잊혀': ['이쳐', 'ічо', 'i tɕʰʌ'],
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
