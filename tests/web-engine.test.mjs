import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createEngine,decompose,parseCsv} from '../src/app/engine.js';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const csv=fs.readFileSync(path.join(root,'data/korean/canonical_correspondence.csv'),'utf8');
const lexicalCsv=fs.readFileSync(path.join(root,'data/korean/lexical_pronunciations.csv'),'utf8');
const engine=createEngine(csv,lexicalCsv);

test('modern Hangul decomposition',()=>{assert.deepEqual(decompose('가'),{char:'가',onset:'ㄱ',vowel:'ㅏ',coda:'',hasCoda:false});assert.deepEqual(decompose('각'),{char:'각',onset:'ㄱ',vowel:'ㅏ',coda:'ㄱ',hasCoda:true});});
test('canonical CV/CVC output',()=>{assert.equal(engine.convert('가').ukrainian,'ка');assert.equal(engine.convert('각').ukrainian,'как');assert.equal(engine.convert('한').ukrainian,'хан');});
test('contextual ㅅ before i maps to ш',()=>{assert.equal(engine.convert('시').ukrainian,'ші');});
test('ㄹ onset/coda distinction',()=>{assert.equal(engine.convert('라').ukrainian,'ра');assert.equal(engine.convert('알').ukrainian,'ал');});
test('ㅇ onset/coda distinction',()=>{assert.equal(engine.convert('아').ukrainian,'а');assert.equal(engine.convert('앙').ukrainian,'ан');});
test('liquid assimilation renders surface ㄹ as л, not onset р',()=>{assert.equal(engine.convert('신라').ukrainian,'шілла');assert.ok(engine.convert('신라').trace[1].rules.includes('liquid-assimilation'));assert.equal(engine.convert('칼날').ukrainian,'каллал');});
test('complex-coda liaison keeps first component',()=>{assert.equal(engine.convert('닭을').ukrainian,'талґил');});
test('official §12(4) ㅎ-deletion forms use sourced lexical readings',()=>{for(const [word,target] of [['많아','мана'],['싫어','шіро']]){const r=engine.convert(word);assert.equal(r.ukrainian,target);assert.equal(r.status,'lexical-review');assert.ok(r.trace.some(x=>x.rules.includes('lexical-pronunciation')));}});
test('ㄳ/ㄽ/ㅄ liaison uses fortis ㅆ',()=>{assert.equal(engine.convert('넋이').ukrainian,'нокші');assert.equal(engine.convert('곬이').ukrainian,'колші');assert.equal(engine.convert('값이').ukrainian,'капші');});
test('nasal assimilation is explicit',()=>{const r=engine.convert('국문');assert.equal(r.ukrainian,'кунмун');assert.equal(r.ipa,'kuŋ mun');assert.ok(r.trace.some(x=>x.rules.includes('nasal-assimilation')));});
test('aspirated ㅍ coda participates in nasal assimilation',()=>{const r=engine.convert('앞문');assert.equal(r.ukrainian,'аммун');assert.ok(engine.convert('앞문').trace[0].rules.includes('nasal-assimilation'));});
test('h aspiration is explicit',()=>{const r=engine.convert('각하');assert.equal(r.ukrainian,'кака');assert.ok(r.trace.some(x=>x.rules.includes('h-aspiration')));});
test('complex ㅎ codas aspirate following lenis stops',()=>{assert.equal(engine.convert('많다').ukrainian,'манта');assert.equal(engine.convert('싫다').ukrainian,'шілта');});
test('official §12 complex-coda + ㅎ forms use sourced lexical entries',()=>{for(const [word,target] of [['읽히다','ілкіда'],['앉히다','анчіда'],['넓히다','нолпіда']]){const r=engine.convert(word);assert.equal(r.ukrainian,target);assert.equal(r.status,'lexical-review');assert.ok(r.trace.some(x=>x.rules.includes('lexical-pronunciation')));}});
test('simple ㅈ plus ㅎ aspirates to ㅊ rather than the final representative ㅌ',()=>{assert.equal(engine.convert('맞히다').ukrainian,'мачіда');});
test('palatalization uses a sourced exact-form entry and provisional Ukrainian target',()=>{const r=engine.convert('같이');assert.equal(r.ukrainian,'качі');assert.equal(r.ipa,'ka tɕʰi');assert.equal(r.status,'lexical-review');assert.ok(r.trace.some(x=>x.rules.includes('lexical-pronunciation')));});
test('simple liaison is contextual',()=>{const r=engine.convert('밥이');assert.equal(r.status,'contextual');assert.equal(r.ukrainian,'пабі');});
test('standard lexical ㄼ exception 밟- is preserved before consonants',()=>{const r=engine.convert('밟는');assert.equal(r.ukrainian,'памнин');assert.ok(r.trace[0].rules.includes('lexical-coda-balm'));});
test('standard lexical ㄼ exceptions 넓죽- and 넓둥글- are preserved before fortition',()=>{const a=engine.convert('넓죽하다');assert.ok(a.trace[0].rules.includes('lexical-coda-neolp'));assert.ok(a.trace[1].rules.includes('tensification'));const b=engine.convert('넓둥글다');assert.ok(b.trace[0].rules.includes('lexical-coda-neolp'));assert.ok(b.trace[1].rules.includes('tensification'));});
test('tensification remains practical rather than mandatory doubling',()=>{const r=engine.convert('국밥');assert.equal(r.ukrainian,'кукпап');assert.ok(r.trace.some(x=>x.rules.includes('tensification')));});
test('contextual voicing is visible',()=>{const r=engine.convert('현대');assert.equal(r.ukrainian,'хйонде');assert.ok(r.trace.some(x=>x.rules.includes('contextual-voicing')));});
test('lenis voicing between vowels is explicit',()=>{const r=engine.convert('부부');assert.equal(r.ukrainian,'пубу');assert.ok(r.trace[1].rules.includes('contextual-voicing'));});
test('표준 voices intervocalic ㅈ',()=>{const r=engine.convert('표준');assert.equal(r.ukrainian,'пйоджун');assert.equal(r.ipa,'pʰjo dʑun');assert.ok(r.trace[1].rules.includes('contextual-voicing'));});
test('consonant-onset ㅢ follows standard [i] realization',()=>{const r=engine.convert('희망');assert.equal(r.ukrainian,'хіман');assert.equal(r.ipa,'hi maŋ');assert.ok(r.trace[0].rules.includes('vowel-ui-to-i'));});
test('ㅇ+ㅢ uses the normative default rather than an unresolved placeholder',()=>{const r=engine.convert('의');assert.equal(r.status,'contextual');assert.equal(r.ukrainian,'ий');assert.equal(r.ipa,'ɰi');assert.ok(r.trace[0].rules.includes('vowel-ui-default-ɰi'));});
test('ㅇ+ㅢ still reports its original Hangul decomposition',()=>{const r=engine.convert('의');assert.equal(r.analysis,'의 = ㅇ+ㅢ');});
test('default ㅢ and ordinary liaison preserve IPA word boundaries',()=>{const r=engine.convert('현대 한국어의 표준 발음');assert.equal(r.ipa,'hjʌn dɛ han ɡu ɡʌ ɰi pʰjo dʑun pa ɾɯm');});
test('non-Korean text is preserved',()=>{assert.equal(engine.convert('ABC 123!').ukrainian,'ABC 123!');});
test('CSV parser handles quoted fields',()=>{const rows=parseCsv('a,b\n1,"x,y"\n');assert.deepEqual(rows,[{a:'1',b:'x,y'}]);});
test('IPA and analysis preserve original whitespace without doubled separators',()=>{const r=engine.convert('가 나');assert.equal(r.ipa,'ka na');assert.equal(r.analysis,'가 = ㄱ+ㅏ 나 = ㄴ+ㅏ');const p=engine.convert('가, 나');assert.equal(p.ipa,'ka, na');assert.equal(p.analysis,'가 = ㄱ+ㅏ, 나 = ㄴ+ㅏ');});
test('Hangul structure reports original orthographic jamo after liaison',()=>{const r=engine.convert('발음');assert.match(r.analysis,/음 = ㅇ\+ㅡ\+ㅁ/);assert.equal(r.ukrainian,'парим');});
test('deterministic output',()=>{const a=engine.convert('현대 한국어');const b=engine.convert('현대 한국어');assert.deepEqual(a,b);});


test('lexical pronunciation overrides cover 값없다 without generalizing to every ㅄ coda',()=>{
  const r=engine.convert('값없다');
  assert.equal(r.ukrainian,'кабопта');
  assert.equal(r.ipa,'ka bʌp̚ t͈a');
  assert.equal(r.status,'lexical');
  assert.ok(r.trace[0].rules.includes('lexical-pronunciation'));
});

test('lexical ㄹ-to-ㄴ exception resolves 의견란 and preserves its original analysis',()=>{
  const r=engine.convert('의견란');
  assert.equal(r.ukrainian,'ийґйоннан');
  assert.equal(r.ipa,'ɰiː ɡjʌn nan');
  assert.equal(r.status,'lexical-review');
  assert.ok(r.trace[0].rules.includes('ukrainian-target-provisional'));
  assert.match(r.analysis,/의 = ㅇ\+ㅢ/);
});

test('verb-stem ㄺ exceptions are lexically scoped rather than generalized to noun 닭-',()=>{
  const expected={
    '읽고':['일꼬','ілко','il k͈o'],
    '읽다':['익따','ікта','ik̚ t͈a'],
    '읽어':['일거','ілґо','il ɡʌ'],
    '읽는':['잉는','іннин','iŋ nɯn'],
    '읽지':['익찌','ікчі','ik̚ tɕ͈i'],
    '맑게':['말께','малке','mal k͈e'],
    '맑고':['말꼬','малко','mal k͈o'],
    '맑다':['막따','макта','mak̚ t͈a'],
    '밝기':['발끼','палкі','pal k͈i'],
    '닭고기':['닥꼬기','таккоґі','tak̚ k͈o ɡi']
  };
  for(const [input,[surface,ua,ipa]] of Object.entries(expected)){
    const r=engine.convert(input);
    assert.equal(r.ukrainian,ua,input);
    assert.equal(r.ipa,ipa,input);
    assert.equal(r.status,'lexical',input);
    assert.ok(r.trace[0].rules.includes('lexical-pronunciation'),input);
  }
});

test('lexical entries apply inside surrounding text and preserve separators',()=>{
  const r=engine.convert('값없다, 읽고!');
  assert.equal(r.ukrainian,'кабопта, ілко!');
  assert.equal(r.ipa,'ka bʌp̚ t͈a, il k͈o!');
  assert.equal(r.status,'lexical');
});

test('lexicon does not rewrite unrelated forms with the same coda spelling',()=>{
  assert.equal(engine.convert('닭이').ukrainian,'талґі');
  assert.equal(engine.convert('값이').ukrainian,'капші');
});

test('sourced lexical edge cases cover n-insertion, nasalization, liaison, palatalization and fortition',()=>{
  const expected={
    '꽃잎':['꼰닙','конніп','k͈on nip̚'],
    '밭이':['바치','пачі','pa tɕʰi'],
    '밭을':['바틀','патил','pa tʰɯl'],
    '넓네':['널레','нольле','nʌl le'],
    '없다':['업따','опта','ʌːp̚ t͈a'],
    '없는':['엄는','омнин','ʌːm nɯn'],
    '국물':['궁물','кунмул','kuŋ mul'],
    '떡볶이':['떡뽀끼','токпокі','t͈ʌk̚ p͈o k͈i'],
    '옷이':['오시','оші','o ɕi']
  };
  for(const [input,[surface,ua,ipa]] of Object.entries(expected)){
    const r=engine.convert(input);
    assert.equal(r.ukrainian,ua,input);
    assert.equal(r.ipa,ipa,input);
    assert.equal(r.status,'lexical',input);
    assert.ok(r.trace[0].rules.includes('lexical-pronunciation'),input);
  }
});

test('sourced lexical edge cases preserve spaces and punctuation in phrases',()=>{
  const r=engine.convert('꽃잎, 밭이! 국물');
  assert.equal(r.ukrainian,'конніп, пачі! кунмул');
  assert.equal(r.ipa,'k͈on nip̚, pa tɕʰi! kuŋ mul');
});

test('unknown ㅎ-coda + vowel is unresolved without ending/suffix evidence',()=>{const r=engine.convert('낳어');assert.equal(r.status,'unresolved');assert.ok(r.ukrainian.includes('⟦낳⟧'));assert.ok(r.issues.some(x=>x.includes('§12(4) ㅎ deletion requires a verified')));assert.ok(r.trace.some(x=>x.rules.includes('h-deletion-requires-morphology')));});

test('§18 nasal assimilation applies across plain spaces in connected phrases',()=>{
  const r=engine.convert('밥 먹는다');
  assert.ok(r.trace[0].rules.includes('nasal-assimilation'));
  assert.equal(r.ipa,'pam mʌŋ nɯn da');
});

test('§19 precedes §18 across a phrase boundary',()=>{
  const r=engine.convert('협 력');
  assert.equal(r.ipa,'hjʌm njʌk̚');
  assert.ok(r.trace[0].rules.includes('liquid-to-nasal-before-obstruent'));
  assert.ok(r.trace[0].rules.includes('nasal-assimilation'));
});
