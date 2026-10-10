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
test('ㅎ coda does not aspirate ㅂ: §12(1) lists only ㄱ, ㄷ, ㅈ in this direction',()=>{const r=engine.convert('놓바');assert.equal(r.ukrainian,'нотпа');assert.equal(r.ipa,'not̚ p͈a');assert.ok(!r.trace.some(x=>x.rules.includes('h-aspiration')));assert.ok(r.trace[1].rules.includes('tensification'));});
test('complex ㅎ codas aspirate following lenis stops',()=>{assert.equal(engine.convert('많다').ukrainian,'манта');assert.equal(engine.convert('싫다').ukrainian,'шілта');});
test('official §12 complex-coda + ㅎ forms use sourced lexical entries',()=>{for(const [word,target] of [['읽히다','ілкіда'],['앉히다','анчіда'],['넓히다','нолпіда']]){const r=engine.convert(word);assert.equal(r.ukrainian,target);assert.equal(r.status,'lexical-review');assert.ok(r.trace.some(x=>x.rules.includes('lexical-pronunciation')));}});
test('simple ㅈ plus ㅎ aspirates to ㅊ rather than the final representative ㅌ',()=>{assert.equal(engine.convert('맞히다').ukrainian,'мачіда');});
test('palatalization uses a sourced exact-form entry and provisional Ukrainian target',()=>{const r=engine.convert('같이');assert.equal(r.ukrainian,'качі');assert.equal(r.ipa,'ka tɕʰi');assert.equal(r.status,'lexical-review');assert.ok(r.trace.some(x=>x.rules.includes('lexical-pronunciation')));});
test('simple liaison is contextual',()=>{const r=engine.convert('밥이');assert.equal(r.status,'contextual');assert.equal(r.ukrainian,'пабі');});
test('standard lexical ㄼ exception 밟- is preserved before consonants',()=>{const r=engine.convert('밟는');assert.equal(r.ukrainian,'памнин');assert.ok(r.trace[0].rules.includes('lexical-coda-balm'));});
test('standard lexical ㄼ exceptions 넓죽- and 넓둥글- are preserved before fortition',()=>{const a=engine.convert('넓죽하다');assert.ok(a.trace[0].rules.includes('lexical-coda-neolp'));assert.ok(a.trace[1].rules.includes('tensification'));const b=engine.convert('넓둥글다');assert.ok(b.trace[0].rules.includes('lexical-coda-neolp'));assert.ok(b.trace[1].rules.includes('tensification'));});
test('tensification remains practical rather than mandatory doubling',()=>{const r=engine.convert('국밥');assert.equal(r.ukrainian,'кукпап');assert.ok(r.trace.some(x=>x.rules.includes('tensification')));});
test('sourced NIKL tense examples are available in the lexical layer',()=>{for(const w of ['앉고','넓게','갈등','문고리']){const r=engine.convert(w);assert.equal(r.status,'lexical-review',w);assert.ok(r.trace.some(x=>x.rules.includes('lexical-pronunciation')),w);}});
test('sourced tensification outputs preserve Korean surface IPA and provisional Ukrainian targets',()=>{for(const [word,surface,ua,ipa] of [['넓게','널께','нолке','nʌl k͈e'],['갈등','갈뜽','калтин','kal t͈ɯŋ'],['문고리','문꼬리','мункорі','mun k͈o ɾi'],['젊지','점찌','чомчі','tɕʌːm tɕ͈i'],['훑소','훌쏘','гулсо','hul s͈o']]){const r=engine.convert(word);assert.equal(r.surfaceHangul,surface,word);assert.equal(r.ukrainian,ua,word);assert.equal(r.ipa,ipa,word);assert.equal(r.status,'lexical-review',word);}});
test('official NIKL §27 attached-ending fortition examples are lexically covered',()=>{
  const cases=[
    ['할걸','할껄','галкол','hal k͈ʌl'],
    ['할밖에','할빠께','галпаке','hal p͈a k͈e'],
    ['할세라','할쎄라','галсера','hal s͈e ɾa'],
    ['할수록','할쑤록','галсурок','hal s͈u ɾok̚'],
    ['할지라도','할찌라도','галчірато','hal tɕ͈i ɾa do'],
    ['할지언정','할찌언정','галчіонджон','hal tɕ͈i ʌn dʑʌŋ'],
    ['할진대','할찐대','галчінде','hal tɕ͈in dɛ']
  ];
  for(const [word,surface,ua,ipa] of cases){
    const r=engine.convert(word);
    assert.equal(r.surfaceHangul,surface,word);
    assert.equal(r.ukrainian,ua,word);
    assert.equal(r.ipa,ipa,word);
    assert.equal(r.status,'lexical-review',word);
    assert.ok(r.trace.some(x=>x.rules.includes('ukrainian-target-provisional')),word);
  }
});

test('NIKL §26 fortition is not generalized to non-licensed ㄹ-final words or reduplications',()=>{
  for(const word of ['갈구','출발','허허실실','절절하다']){
    const r=engine.convert(word);
    assert.ok(!r.trace.some(item=>item.rules.includes('tensification')),word);
    assert.ok(!r.ipa.includes('͈'),word);
  }
});

test('lexical CSV has unique keys, complete evidence fields and aligned syllable records',()=>{
  const rows=parseCsv(lexicalCsv);
  const seen=new Set();
  for(const row of rows){
    assert.ok(row.input, 'missing lexical input');
    assert.ok(!seen.has(row.input), 'duplicate lexical input: '+row.input);
    seen.add(row.input);
    for(const field of ['surface_hangul','target_syllables','ipa_syllables','source_url','rule_notes','confidence','target_status']){
      assert.ok(row[field], 'missing '+field+' for '+row.input);
    }
    assert.ok(row.source_url.startsWith('https://')||row.source_url.startsWith('http://'),'invalid source URL for '+row.input);
    assert.doesNotMatch(row.target_syllables,/[가-힣]/u,'Hangul leaked into Ukrainian target for '+row.input);
    assert.ok(['high','medium','low'].includes(row.confidence),'unknown confidence for '+row.input);
    assert.ok(['provisional','model-selected','surface-only'].includes(row.target_status),'unknown target_status for '+row.input);
    const targetParts=row.target_syllables.split('|');
    const ipaParts=row.ipa_syllables.split('|');
    assert.equal(targetParts.length,ipaParts.length,'target/IPA segmentation mismatch: '+row.input);
    assert.equal([...row.input].length,targetParts.length,'input/target segmentation mismatch: '+row.input);
    assert.equal([...row.surface_hangul].length,ipaParts.length,'surface/IPA segmentation mismatch: '+row.input);
    const alternateFields=[row.alternate_surface_hangul,row.alternate_target_syllables,row.alternate_ipa_syllables];
    assert.ok(alternateFields.every(v=>!v)||alternateFields.every(Boolean),'incomplete alternate variant for '+row.input);
    if(alternateFields.every(Boolean)){
      assert.equal([...row.alternate_surface_hangul].length,[...row.input].length,'alternate surface segmentation mismatch: '+row.input);
      assert.equal(row.alternate_target_syllables.split('|').length,[...row.input].length,'alternate target segmentation mismatch: '+row.input);
      assert.equal(row.alternate_ipa_syllables.split('|').length,[...row.input].length,'alternate IPA segmentation mismatch: '+row.input);
      assert.doesNotMatch(row.alternate_target_syllables,/[가-힣]/u,'Hangul leaked into alternate Ukrainian target for '+row.input);
      assert.ok(row.variant_note,'missing alternate variant note for '+row.input);
    }
  }
  assert.ok(rows.length>=300,'unexpectedly small lexical dataset');
});

test('remaining official NIKL §28 compound examples retain sourced surface forms and long-vowel/voicing detail',()=>{
  const cases=[
    ['손재주','손째주','сончеджу','son tɕ͈ɛ dʑu'],
    ['굴속','굴쏙','кулсок','kuːl s͈ok̚'],
    ['술잔','술짠','сулчан','sul tɕ͈an'],
    ['바람결','바람껼','парамкйол','pa ɾam k͈jʌl'],
    ['그믐달','그믐딸','кимимтал','kɯ mɯm t͈al'],
    ['아침밥','아침빱','ачімпап','a tɕʰim p͈ap̚'],
    ['잠자리','잠짜리','чамчарі','tɕam tɕ͈a ɾi'],
    ['초승달','초승딸','чосинтал','tɕʰo sɯŋ t͈al'],
    ['강줄기','강쭐기','канчулґи','kaŋ tɕ͈ul gi']
  ];
  for(const [word,surface,ua,ipa] of cases){
    const r=engine.convert(word);
    assert.equal(r.surfaceHangul,surface,word);
    assert.equal(r.ukrainian,ua,word);
    assert.equal(r.ipa,ipa,word);
    assert.equal(r.status,'lexical-review',word);
  }
});

test('NIKL §29 official ㄴ-insertion and negative-control examples are covered',()=>{
  const cases=[
    ['솜이불','솜니불','сомнібул','soːm ni bul'],
    ['홑이불','혼니불','гоннібул','hon ni bul'],
    ['막일','망닐','манніл','maŋ nil'],
    ['삯일','상닐','санніл','saŋ nil'],
    ['맨입','맨닙','менніп','mɛn nip̚'],
    ['내복약','내봉냑','небонняк','nɛː boŋ ɲak̚'],
    ['한여름','한녀름','ганньорим','han ɲʌ ɾɯm'],
    ['남존여비','남존녀비','намджонньобі','nam dʑon ɲʌ bi'],
    ['신여성','신녀성','шінньосон','ɕin ɲʌ sʌŋ'],
    ['색연필','생년필','сенньонпіл','sɛŋ ɲʌn pʰil'],
    ['직행열차','지캥녈차','чікенньолча','tɕi kʰɛŋ ɲʌl tɕʰa'],
    ['늑막염','능망념','нинманньом','nɯŋ maŋ ɲʌm'],
    ['콩엿','콩녇','конньот','kʰoŋ ɲʌt̚'],
    ['담요','담뇨','тамньо','taːm ɲo'],
    ['눈요기','눈뇨기','нунньоґі','nun ɲo ɡi'],
    ['영업용','영엄뇽','йономньон','jʌŋ ʌm ɲoŋ'],
    ['식용유','시굥뉴','шіґйонню','ɕi ɡjoŋ ɲu'],
    ['백분율','백뿐뉼','пекпуннюл','pɛk̚ p͈un ɲul'],
    ['밤윷','밤뉻','памньут','paːm ɲut̚'],
    ['송별연','송벼련','сонбйорйон','soːŋ bjʌ ɾjʌn'],
    ['등용문','등용문','тинйонмун','tɯŋ joŋ mun']
  ];
  for(const [word,surface,ua,ipa] of cases){
    const r=engine.convert(word);
    assert.equal(r.surfaceHangul,surface,word);
    assert.equal(r.ukrainian,ua,word);
    assert.equal(r.ipa,ipa,word);
    assert.equal(r.status,'lexical-review',word);
  }
});

test('NIKL §29 optional readings expose both official surface variants',()=>{
  const cases=[
    ['이죽이죽','이중니죽','і|джун|ні|джук','i dʑuŋ ni dʑuk̚','이주기죽','і|джу|ґі|джук','i dʑu ɡi dʑuk̚'],
    ['야금야금','야금냐금','я|гим|ня|гим','ja gɯm ɲa gɯm','야그먀금','я|ги|мя|гим','ja gɯ mja gɯm'],
    ['검열','검녈','ком|ньол','kʌːm ɲʌl','거멸','ко|мйол','kʌː mjʌl'],
    ['욜랑욜랑','욜랑뇰랑','йол|лан|ньол|лан','jol laŋ ɲol laŋ','욜랑욜랑','йол|лан|йол|лан','jol laŋ jol laŋ'],
    ['금융','금늉','ким|нюн','kɯm ɲuŋ','그뮹','ки|мюн','kɯ mjuŋ']
  ];
  for(const [word,surface,ua,ipa,altSurface,altUa,altIpa] of cases){
    const r=engine.convert(word);
    assert.equal(r.surfaceHangul,surface,word);
    assert.equal(r.ukrainian,ua.replaceAll('|',''),word);
    assert.equal(r.ipa,ipa,word);
    assert.equal(r.status,'lexical-review',word);
    assert.equal(r.variants.length,1,word);
    assert.equal(r.variants[0].surface,altSurface,word);
    assert.equal(r.variants[0].ukrainian,altUa.replaceAll('|',''),word);
    assert.equal(r.variants[0].ipa,altIpa,word);
  }
});

test('NIKL §30 official 사이시옷 readings cover fortition, nasalization and ㄴㄴ insertion',()=>{
  const cases=[
    ['콧날','콘날','коннал','kʰon nal'],
    ['아랫니','아랜니','аренні','a ɾɛn ni'],
    ['툇마루','퇸마루','твенмару','tʰøːn ma ɾu'],
    ['뱃머리','밴머리','пенморі','pɛn mʌ ɾi'],
    ['베갯잇','베갠닏','пеґенніт','pe gɛn nit̚'],
    ['깻잎','깬닙','кенніп','kɛn nip̚'],
    ['나뭇잎','나문닙','намунніп','na mun nip̚'],
    ['도리깻열','도리깬녈','торіґенньол','to ɾi gɛn ɲʌl'],
    ['뒷윷','뒨뉻','твінньут','tyːn ɲut̚']
  ];
  for(const [word,surface,ua,ipa] of cases){
    const r=engine.convert(word);
    assert.equal(r.surfaceHangul,surface,word);
    assert.equal(r.ukrainian,ua,word);
    assert.equal(r.ipa,ipa,word);
    assert.equal(r.status,'lexical-review',word);
  }
});

test('NIKL §30 retains both permitted surface readings for written 사이시옷 examples',()=>{
  const cases=[
    ['냇가','내까','нека','nɛː k͈a','낻까','нетка','nɛːt̚ k͈a'],
    ['샛길','새낄','секіл','sɛː k͈il','샏낄','сеткіл','sɛːt̚ k͈il'],
    ['빨랫돌','빨래똘','паллетол','p͈al lɛ t͈ol','빨랟똘','паллеттол','p͈al lɛt̚ t͈ol'],
    ['콧등','코뜽','котин','kʰo t͈ɯŋ','콛뜽','коттин','kʰot̚ t͈ɯŋ'],
    ['깃발','기빨','кіпал','ki p͈al','긷빨','кітпал','kit̚ p͈al'],
    ['대팻밥','대패빱','тепепап','tɛː pʰɛ p͈ap̚','대팯빱','тепетпап','tɛː pʰɛt̚ p͈ap̚'],
    ['햇살','해쌀','гесал','hɛ s͈al','핻쌀','гетсал','hɛt̚ s͈al'],
    ['뱃속','배쏙','песок','pɛ s͈ok̚','밷쏙','петсок','pɛt̚ s͈ok̚'],
    ['뱃전','배쩐','печон','pɛ tɕ͈ʌn','밷쩐','петчон','pɛt̚ tɕ͈ʌn'],
    ['고갯짓','고개찓','коґечіт','ko ɡɛ tɕ͈it̚','고갣찓','коґетчіт','ko kɛt̚ tɕ͈it̚']
  ];
  for(const [word,surface,ua,ipa,altSurface,altUa,altIpa] of cases){
    const r=engine.convert(word);
    assert.equal(r.surfaceHangul,surface,word);
    assert.equal(r.ukrainian,ua,word);
    assert.equal(r.ipa,ipa,word);
    assert.equal(r.variants.length,1,word);
    assert.equal(r.variants[0].surface,altSurface,word);
    assert.equal(r.variants[0].ukrainian,altUa,word);
    assert.equal(r.variants[0].ipa,altIpa,word);
  }
});

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

test('몇 리 keeps the ㄷ+ㄹ analysis explicitly labelled as a project inference',()=>{
  const r=engine.convert('몇 리');
  assert.equal(r.ukrainian,'мйон ні');
  assert.equal(r.ipa,'mjʌn ni');
  assert.ok(r.trace[0].rules.includes('project-inferred-d-liquid-nasalization'));
  assert.ok(r.trace[0].rules.includes('nasal-assimilation'));
  assert.ok(r.trace.find(item=>item.source==='리').rules.includes('project-inferred-d-liquid-nasalization'));
  assert.ok(!r.trace.some(item=>item.rules.includes('liquid-to-nasal-before-obstruent')&&item.source==='몇'));
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
  assert.ok(second.trace.find(item=>item.source==='몇').rules.includes('project-inferred-d-liquid-nasalization'));
  assert.ok(!second.trace.find(item=>item.source==='몇').rules.includes('liquid-to-nasal-before-obstruent'));
  assert.ok(second.trace.find(item=>item.source==='몇').rules.includes('nasal-assimilation'));
  assert.ok(second.trace.find(item=>item.source==='리').rules.includes('project-inferred-d-liquid-nasalization'));
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
    '라면,라면,на|мен,na|mjʌn,test-fixture,"synthetic target intentionally changes the onset",high,model-selected,,,,'
  ].join('\n');
  const guarded=createEngine(csv,syntheticLexicon);
  const nasal=guarded.convert('국 문');
  assert.equal(nasal.ukrainian,'гу мун');
  assert.ok(!nasal.trace.some(unit=>unit.rules.includes('nasal-assimilation')));
  const liquid=guarded.convert('국 라면');
  assert.equal(liquid.ukrainian,'гу намен');
  assert.ok(!liquid.trace.some(unit=>unit.rules.includes('liquid-to-nasal-before-obstruent')));
});
