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
test('canonical CV/CVC output',()=>{assert.equal(engine.convert('가').ukrainian,'ка');assert.equal(engine.convert('각').ukrainian,'как');assert.equal(engine.convert('한').ukrainian,'ган');});
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
test('contextual voicing is visible',()=>{const r=engine.convert('현대');assert.equal(r.ukrainian,'гйонде');assert.ok(r.trace.some(x=>x.rules.includes('contextual-voicing')));});
test('lenis voicing between vowels is explicit',()=>{const r=engine.convert('부부');assert.equal(r.ukrainian,'пубу');assert.ok(r.trace[1].rules.includes('contextual-voicing'));});
test('표준 voices intervocalic ㅈ',()=>{const r=engine.convert('표준');assert.equal(r.ukrainian,'пйоджун');assert.equal(r.ipa,'pʰjo dʑun');assert.ok(r.trace[1].rules.includes('contextual-voicing'));});
test('consonant-onset ㅢ follows standard [i] realization',()=>{const r=engine.convert('희망');assert.equal(r.ukrainian,'гіман');assert.equal(r.ipa,'hi maŋ');assert.ok(r.trace[0].rules.includes('vowel-ui-to-i'));});
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
    '넓네':['널레','нолле','nʌl le'],
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

test('§18 nasal assimilation still applies when the following word uses a lexical override',()=>{
  const r=engine.convert('밥 문법');
  assert.equal(r.ukrainian,'пам мунпоп');
  assert.equal(r.ipa,'pam mun p͈ʌp̚');
  assert.ok(r.trace.some(item=>item.source==='밥'&&item.rules.includes('nasal-assimilation')));
  assert.ok(r.trace.some(item=>item.source==='문'&&item.rules.includes('nasal-assimilation')));
});

test('phrase nasal assimilation does not cross punctuation even when a lexical word follows',()=>{
  const r=engine.convert('밥, 문법');
  assert.equal(r.ukrainian,'пап, мунпоп');
  assert.equal(r.ipa,'pap̚, mun p͈ʌp̚');
  assert.ok(!r.trace.some(item=>item.source==='밥'&&item.rules.includes('nasal-assimilation')));
});

test('representative ㄷ before ㄹ triggers liquid-to-nasal and nasal assimilation across a phrase boundary',()=>{
  const r=engine.convert('몇 리');
  assert.equal(r.ukrainian,'мйон ні');
  assert.equal(r.ipa,'mjʌn ni');
  assert.ok(r.trace[0].rules.includes('liquid-to-nasal-before-obstruent'));
  assert.ok(r.trace[0].rules.includes('nasal-assimilation'));
  assert.ok(r.trace.find(item=>item.source==='리').rules.includes('liquid-to-nasal-before-obstruent'));
});

test('liquid assimilation is preserved when a lexical override elsewhere activates word splitting',()=>{
  const nasalLiquid=engine.convert('신 라면 문법');
  assert.equal(nasalLiquid.ukrainian,'шіл ламйон мунпоп');
  assert.equal(nasalLiquid.ipa,'sil la mjʌn mun p͈ʌp̚');
  assert.ok(nasalLiquid.trace.find(item=>item.source==='신').rules.includes('liquid-assimilation'));
  assert.ok(nasalLiquid.trace.find(item=>item.source==='라').rules.includes('liquid-assimilation'));

  const liquidNasal=engine.convert('칼 날 문법');
  assert.equal(liquidNasal.ukrainian,'кал лал мунпоп');
  assert.equal(liquidNasal.ipa,'kʰal lal mun p͈ʌp̚');
  assert.ok(liquidNasal.trace.find(item=>item.source==='칼').rules.includes('liquid-assimilation'));
  assert.ok(liquidNasal.trace.find(item=>item.source==='날').rules.includes('liquid-assimilation'));
});

test('§19 precedes §18 across a phrase boundary',()=>{
  const r=engine.convert('협 력');
  assert.equal(r.ipa,'hjʌm njʌk̚');
  assert.ok(r.trace[0].rules.includes('liquid-to-nasal-before-obstruent'));
  assert.ok(r.trace[0].rules.includes('nasal-assimilation'));
});

test('official §11 ㄺ-before-ㄱ examples use exact lexical readings',()=>{
  for(const [word,target,ipa] of [['묽고','мулко','mul k͈o'],['얽거나','олкона','ʌl k͈ʌ na']]){
    const r=engine.convert(word);
    assert.equal(r.ukrainian,target);
    assert.equal(r.ipa,ipa);
    assert.equal(r.status,'lexical-review');
    assert.ok(r.trace.some(x=>x.rules.includes('lexical-pronunciation')));
  }
});

test('unknown ㄺ-before-ㄱ does not let generic §23 fortition choose the morphology',()=>{
  const r=engine.convert('굵고');
  assert.equal(r.status,'unresolved');
  assert.ok(r.ukrainian.includes('⟦굵⟧'));
  assert.ok(r.issues.some(x=>x.includes('written ㄺ before ㄱ may follow the §11 stem exception')));
  assert.ok(r.trace.some(x=>x.rules.includes('rieul-giyeok-exception-requires-morphology')));
});

test('§9 and §10 representative coda examples remain context-sensitive',()=>{
  const values=[
    ['옷','от','ot̚'],
    ['값','кап','kap̚'],
    ['있다','ітта','it̚ t͈a'],
    ['키읔과','кіикква','kʰi ɯk̚ k͈wa'],
  ];
  for(const [word,ukrainian,ipa] of values){
    const result=engine.convert(word);
    assert.equal(result.ukrainian,ukrainian,word);
    assert.equal(result.ipa,ipa,word);
    assert.ok(!result.trace.some(item=>item.rules.includes('lexical-pronunciation')),word);
  }
});

test('official §12(2)–(3) ㅎ-before-ㅅ and ㅎ-before-ㄴ examples are covered',()=>{
  const expected={
    '놓는':['ноннин','non nɯn'],
    '쌓네':['санне','s͈an ne'],
    '않네':['анне','an ne'],
    '않는':['аннин','an nɯn'],
    '뚫네':['тулле','t͈ul le'],
    '닿소':['тасо','taː s͈o'],
    '많소':['мансо','maːn s͈o'],
    '싫소':['шілсо','ɕil s͈o'],
  };
  for(const [word,[ua,ipa]] of Object.entries(expected)){
    const r=engine.convert(word);
    assert.equal(r.ukrainian,ua,word);
    assert.equal(r.ipa,ipa,word);
    assert.equal(r.status,'lexical-review',word);
    assert.ok(r.trace[0].rules.includes('lexical-pronunciation'),word);
  }
});

test('official NIKL §§13–14 liaison examples are covered by exact sourced readings',()=>{
  const expected={
    '낮이':['나지','наджі','na dʑi'],
    '꽂아':['꼬자','коджа','k͈o dʑa'],
    '꽃을':['꼬츨','кочил','k͈o tɕʰɯl'],
    '밭에':['바테','пате','pa tʰe'],
    '앞으로':['아프로','апиро','a pʰɯ ɾo'],
    '덮이다':['더피다','топіда','tʌ pʰi da'],
    '핥아':['할타','галта','hal tʰa'],
    '읊어':['을퍼','илпо','ɯl pʰʌ'],
    '값을':['갑쓸','капсил','kap̚ s͈ɯl'],
    '없어':['업써','опсо','ʌːp̚ s͈ʌ'],
    '여덟이':['여덜비','йодолбі','jʌ dʌl bi'],
    '여덟을':['여덜블','йодолбил','jʌ dʌl bɯl'],
  };
  for(const [word,[surface,ua,ipa]] of Object.entries(expected)){
    const r=engine.convert(word);
    assert.equal(r.ukrainian,ua,word);
    assert.equal(r.ipa,ipa,word);
    assert.equal(r.status,'lexical-review',word);
    assert.ok(r.trace[0].rules.includes('lexical-pronunciation'),word);
  }
});

test('multiple phrase-boundary assimilation rules compose in one sentence with a lexical override',()=>{
  const chain=engine.convert('국 립 문법');
  assert.equal(chain.ukrainian,'кун нім мунпоп');
  assert.equal(chain.ipa,'kuŋ nim mun p͈ʌp̚');
  assert.ok(chain.trace.find(item=>item.source==='국').rules.includes('liquid-to-nasal-before-obstruent'));
  assert.ok(chain.trace.find(item=>item.source==='국').rules.includes('nasal-assimilation'));
  assert.ok(chain.trace.find(item=>item.source==='립').rules.includes('liquid-to-nasal-before-obstruent'));
  assert.ok(chain.trace.find(item=>item.source==='립').rules.includes('nasal-assimilation'));
  assert.ok(chain.trace.find(item=>item.source==='문').rules.includes('nasal-assimilation'));

  const second=engine.convert('몇 리 문법');
  assert.equal(second.ukrainian,'мйон ні мунпоп');
  assert.equal(second.ipa,'mjʌn ni mun p͈ʌp̚');
  assert.ok(second.trace.find(item=>item.source==='몇').rules.includes('liquid-to-nasal-before-obstruent'));
  assert.ok(second.trace.find(item=>item.source==='몇').rules.includes('nasal-assimilation'));
});

test('system page publishes the phrase-boundary assimilation audit',()=>{
  const html=fs.readFileSync(path.join(root,'system.html'),'utf8');
  assert.ok(html.includes('id="phrase-boundary-assimilation-audit"'));
  for(const example of ['밥 문법','밥, 문법','몇 리','신 라면 문법','칼 날 문법','국 립 문법','몇 리 문법']){
    assert.ok(html.includes(example),'missing published phrase-boundary example: '+example);
  }
  assert.ok(html.includes('NIKL — 표준 발음법'));
});


test('phrase-boundary trace stays silent when a lexical target does not match the expected coda or onset',()=>{
  // Deliberately adversarial fixture: the synthetic Ukrainian targets are
  // inconsistent with their Korean surface forms. A failed edge rewrite must
  // not mutate aggregate output or claim a successful rule in either trace.
  const syntheticLexicon=[
    'input,surface_hangul,target_syllables,ipa_syllables,source_url,rule_notes,confidence,target_status,alternate_surface_hangul,alternate_target_syllables,alternate_ipa_syllables,variant_note',
    '국,국,гу,ku,test-fixture,"synthetic target intentionally omits the coda",high,model-selected,,,,',
    '라면,라면,나|면,na|mjʌn,test-fixture,"synthetic target intentionally changes the onset",high,model-selected,,,,'
  ].join('\n');
  const guarded=createEngine(csv,syntheticLexicon);
  const nasal=guarded.convert('국 문');
  assert.equal(nasal.ukrainian,'гу мун');
  assert.ok(!nasal.trace.some(unit=>unit.rules.includes('nasal-assimilation')));
  const liquid=guarded.convert('국 라면');
  assert.equal(liquid.ukrainian,'гу намен');
  assert.ok(!liquid.trace.some(unit=>unit.rules.includes('liquid-to-nasal-before-obstruent')));
});
