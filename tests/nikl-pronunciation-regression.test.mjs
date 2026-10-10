import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine, parseCsv } from '../src/app/engine.js';

const canonical = readFileSync(new URL('../data/korean/canonical_correspondence.csv', import.meta.url), 'utf8');
const lexical = readFileSync(new URL('../data/korean/lexical_pronunciations.csv', import.meta.url), 'utf8');
const userCorpus = readFileSync(new URL('./fixtures/user-supplied-corpus.txt', import.meta.url), 'utf8').trim().split(/\\r?\\n/u);
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
    맛없다: {surface:'마덥따', target:'\u043c\u0430\u0434\u0435\u043f\u0442\u0430', ipa:'ma dʌp̚ t͈a'},
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
    맛있다: {surface:'마딛따', target:'мадітта', ipa:'ma dit̚ t͈a', alternateSurface:'마싣따', alternateTarget:'машітта', alternateIpa:'ma ɕit̚ t͈a'},
    멋있다: {surface:'머딛따', target:'модітта', ipa:'mʌ dit̚ t͈a', alternateSurface:'머싣따', alternateTarget:'мошітта', alternateIpa:'mʌ ɕit̚ t͈a'},
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
    깎아: {surface:'까까', target:'кака', ipa:'k͈a k͈a'},
    있어: {surface:'이써', target:'ісо', ipa:'i s͈ʌ'},
    쫓아: {surface:'쪼차', target:'чоча', ipa:'tɕ͈o tɕʰa'},
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
    쌓이다: {surface:'싸이다', target:'саіда', ipa:'s͈a i da'},
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
    assert.equal(result.ukrainian, target, word);
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

test('fortisness remains in IPA but is not encoded by doubled Ukrainian graphemes', () => {
  const expected = {
    '맛없다': ['мадепта', 'ma dʌp̚ t͈a'],
    '맛있다': ['мадітта', 'ma dit̚ t͈a'],
    '멋있다': ['модітта', 'mʌ dit̚ t͈a'],
    '깎아': ['кака', 'k͈a k͈a'],
    '있어': ['ісо', 'i s͈ʌ'],
    '쫓아': ['чоча', 'tɕ͈o tɕʰa'],
    '쌓이다': ['саіда', 's͈a i da'],
    '얽거나': ['олкона', 'ʌl k͈ʌ na'],
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
    '넋과': ['넉꽈', 'нокква', 'nʌk̚ k͈wa'],
    '앉다': ['안따', 'анта', 'an t͈a'],
    '여덟': ['여덜', 'йодоль', 'jʌ dʌl'],
    '넓다': ['널따', 'нольта', 'nʌl t͈a'],
    '외곬': ['외골', 'веґол', 'ø ɡol'],
    '밟소': ['밥쏘', 'папсо', 'paːp̚ s͈o'],
    '밟지': ['밥찌', 'папчі', 'paːp̚ tɕ͈i'],
    '밟게': ['밥께', 'папке', 'paːp̚ k͈e'],
    '밟고': ['밥꼬', 'папко', 'paːp̚ k͈o'],
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
    '닦다': ['tak̚ t͈a', 'такта'],
    '키읔': ['kʰi ɯk̚', 'кіик'],
    '키읔과': ['kʰi ɯk̚ k͈wa', 'кіикква'],
    '옷': ['ot̚', 'от'],
    '있다': ['it̚ t͈a', 'ітта'],
    '젖': ['tɕʌt̚', 'чот'],
    '빚다': ['pit̚ t͈a', 'пітта'],
    '꽃': ['k͈ot̚', 'кот'],
    '쫓다': ['tɕ͈ot̚ t͈a', 'чотта'],
    '솥': ['sot̚', 'сот'],
    '앞': ['ap̚', 'ап'],
    '덮다': ['tʌp̚ t͈a', 'топта'],
  };
  const rows = parseCsv(lexical);
  for (const [word, [ipa, target]] of Object.entries(expected)) {
    assert.ok(!rows.some((item) => item.input === word), word);
    const result = engine.convert(word);
    assert.equal(result.ipa, ipa, word);
    assert.equal(result.ukrainian, target, word);
    assert.ok(!result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
  }
});

test('NIKL §9 lexical vowel-length examples preserve source length in IPA', () => {
  const expected = {
    '웃다': ['욷따', 'uːt̚ t͈a', 'утта'],
    '뱉다': ['밷따', 'pɛːt̚ t͈a', 'петта'],
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
    '먹는': ['멍는', 'mʌŋ nɯn', 'моннин'],
    '깎는': ['깡는', 'k͈aŋ nɯn', 'каннин'],
    '키읔만': ['키응만', 'kʰi ɯŋ man', 'кіинман'],
    '몫몫이': ['몽목씨', 'moŋ mok̚ s͈i', 'монмокші'],
    '긁는': ['긍는', 'kɯŋ nɯn', 'киннин'],
    '흙만': ['흥만', 'hɯŋ man', 'хинман'],
    '닫는': ['단는', 'tan nɯn', 'таннин'],
    '짓는': ['진는', 'tɕiːn nɯn', 'чіннин'],
    '옷맵시': ['온맵씨', 'on mɛp̚ s͈i', 'онмепші'],
    '있는': ['인는', 'in nɯn', 'іннин'],
    '맞는': ['만는', 'man nɯn', 'маннин'],
    '젖멍울': ['전멍울', 'tɕʌn mʌŋ ul', 'джонмонуль'],
    '쫓는': ['쫀는', 'tɕ͈on nɯn', 'чоннин'],
    '꽃망울': ['꼰망울', 'k͈on maŋ ul', 'конмануль'],
    '붙는': ['분는', 'pun nɯn', 'пуннин'],
    '놓는': ['논는', 'non nɯn', 'ноннин'],
    '잡는': ['잠는', 'tɕam nɯn', 'джамнин'],
    '밥물': ['밤물', 'pam mul', 'паммуль'],
    '앞마당': ['암마당', 'am ma daŋ', 'аммадан'],
    '읊는': ['음는', 'ɯm nɯn', 'имнин'],
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
    '책 넣는다': 'tɕʰɛŋ nʌn nɯn da',
    '흙 말리다': 'hɯŋ mal li da',
    '옷 맞추다': 'on mat̚ tɕʰu da',
    '밥 먹는다': 'pam mʌŋ nɯn da',
    '값 매기다': 'kam mɛ ɡi da',
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
    '닭': ['tak̚', 'так'],
    '늙지': ['nɯk̚ tɕ͈i', 'никчі'],
    '읊고': ['ɯp̚ k͈o', 'ипко'],
    '읊다': ['ɯp̚ t͈a', 'ипта'],
  };
  const rows = parseCsv(lexical);
  for (const [word, [ipa, target]] of Object.entries(expected)) {
    assert.ok(!rows.some((item) => item.input === word), word);
    const result = engine.convert(word);
    assert.equal(result.ipa, ipa, word);
    assert.equal(result.ukrainian, target, word);
    assert.ok(!result.trace.some((item) => item.rules.includes('lexical-pronunciation')), word);
  }
});

test('NIKL §11 lexical length and morphology exceptions preserve official readings', () => {
  const expected = {
    '흙과': ['흑꽈', 'hɯk̚ k͈wa', 'хикква'],
    '삶': ['삼', 'saːm', 'сам'],
    '젊다': ['점따', 'tɕʌːm t͈a', 'чомта'],
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
    '침략': ['tɕʰim njak̚', ['liquid-to-nasal-before-obstruent']],
    '강릉': ['kaŋ nɯŋ', ['liquid-to-nasal-before-obstruent']],
    '막론': ['maŋ non', ['liquid-to-nasal-before-obstruent', 'nasal-assimilation']],
    '석류': ['sʌŋ nju', ['liquid-to-nasal-before-obstruent', 'nasal-assimilation']],
    '협력': ['hjʌm njʌk̚', ['liquid-to-nasal-before-obstruent', 'nasal-assimilation']],
    '법리': ['pʌm ni', ['liquid-to-nasal-before-obstruent', 'nasal-assimilation']],
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
    '천리': 'tɕʰʌl li',
    '물난리': 'mul lal li',
    '할는지': 'hal lɯn dʑi',
    '닳는': 'tal lɯn',
    '뚫는': 't͈ul lɯn',
    '핥네': 'hal le',
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
    '줄넘기': ['줄럼끼', 'tɕul lʌm k͈i', 'чульломкі'],
    '임진란': ['임진난', 'imː tɕin nan', 'імчіннан'],
    '생산량': ['생산냥', 'sɛŋ san njaŋ', 'сенсаннян'],
    '결단력': ['결딴녁', 'kjʌl t͈an njʌk̚', 'кйольтаннок'],
    '공권력': ['공꿘녁', 'koŋ k͈wʌn njʌk̚', 'конквоннок'],
    '동원령': ['동원녕', 'toŋː wʌn njʌŋ', 'тонвоннон'],
    '상견례': ['상견녜', 'saŋ ɡjʌn nje', 'санґйоннє'],
    '이원론': ['이원논', 'iː wʌn non', 'івоннон'],
    '입원료': ['이붠뇨', 'i bwʌn njo', 'ібвонньо'],
    '구근류': ['구근뉴', 'ku ɡɯn nju', 'куґинню'],
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
    '신라':'실라',
    '설날':'설랄',
    '종로':'종노',
    '해돋이':'해도지',
    '맏이':'마지',
    '숱이':'수치',
    '끝이':'끄치',
    '값이':'갑씨',
    '없어':'업써',
    '맑다':'막따',
    '밝다':'박따',
    '넓다':'널따',
    '넓고':'널꼬',
    '밟다':'밥따',
    '밟고':'밥꼬',
    '밟는':'밤는',
    '삶':'삼',
    '젊다':'점따',
    '읊다':'읍따',
    '읊고':'읍꼬',
    '앉다':'안따',
    '앉고':'안꼬',
    '앉는':'안는',
    '많다':'만타',
    '많고':'만코',
    '많습니다':'만씀니다',
    '좋다':'조타',
    '좋고':'조코',
    '좋지':'조치',
    '좋습니다':'조씀니다',
    '놓고':'노코',
    '놓는':'논는',
    '놓지':'노치',
    '낳다':'나타',
    '낳고':'나코',
    '낫다':'낟따',
    '낫고':'낟꼬',
    '낫지':'낟찌',
    '낯설다':'낟썰다',
    '낮잠':'낟짬',
    '꽃망울':'꼰망울',
    '옷맵시':'온맵씨',
    '앞문':'암문',
    '앞니':'암니',
    '콧물':'콘물',
    '국민':'궁민',
    '국물':'궁물',
    '박물관':'방물관',
    '서울역':'서울력',
    '한국말':'한궁말',
    '한국어':'한구거',
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
