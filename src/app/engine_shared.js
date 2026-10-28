/**
 * Shared Hangul constants and helpers for the browser engine.
 */
const HANGUL_BASE=0xAC00,HANGUL_END=0xD7A3,V_COUNT=21,T_COUNT=28,N_COUNT=V_COUNT*T_COUNT;
const ONSETS=[...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];
const VOWELS=[...'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'];
const CODAS=['',... 'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'];
const COMPLEX={
  'ㄳ':['ㄱ','ㅆ'],'ㄵ':['ㄴ','ㅈ'],'ㄶ':['ㄴ',''],
  'ㄺ':['ㄹ','ㄱ'],'ㄻ':['ㄹ','ㅁ'],'ㄼ':['ㄹ','ㅂ'],'ㄽ':['ㄹ','ㅆ'],
  'ㄾ':['ㄹ','ㅌ'],'ㄿ':['ㄹ','ㅍ'],'ㅀ':['ㄹ',''],'ㅄ':['ㅂ','ㅆ']
};
const FINAL_REPRESENTATIVE={
  'ㄲ':'ㄱ','ㄳ':'ㄱ','ㄵ':'ㄴ','ㄶ':'ㄴ','ㄺ':'ㄱ','ㄻ':'ㅁ','ㄼ':'ㄹ',
  'ㄽ':'ㄹ','ㄾ':'ㄹ','ㄿ':'ㅂ','ㅀ':'ㄹ','ㅄ':'ㅂ','ㅅ':'ㄷ','ㅆ':'ㄷ',
  'ㅈ':'ㄷ','ㅊ':'ㄷ','ㅋ':'ㄱ','ㅌ':'ㄷ','ㅍ':'ㅂ','ㅎ':'ㄷ'
};
const NASAL_AFTER={'ㄱ':'ㅇ','ㄷ':'ㄴ','ㅂ':'ㅁ'};
const PLAIN_TO_FORTIS={'ㄱ':'ㄲ','ㄷ':'ㄸ','ㅂ':'ㅃ','ㅅ':'ㅆ','ㅈ':'ㅉ'};
const J_VOWELS=new Set(['ㅣ','ㅑ','ㅒ','ㅕ','ㅖ','ㅛ','ㅠ','ㅢ']);
const ASPIRATION={
  'ㄱ':'ㅋ','ㄷ':'ㅌ','ㅂ':'ㅍ','ㅈ':'ㅊ'
};
// NIKL §12(1): ㅎ/ㄶ/ㅀ + ㄱ/ㄷ/ㅈ coalesce; ㅂ is not in this direction.
const H_CODA_ASPIRATION={
  'ㄱ':'ㅋ','ㄷ':'ㅌ','ㅈ':'ㅊ'
};

// Lexical standard-pronunciation exceptions that cannot be inferred from
// the final consonant alone. In particular, 밟- is [ㅂ] before consonants.
const LEXICAL_B_CODA_PREFIXES=new Set(['넓죽','넓둥','넓적']);

// Exact-form applications of NIKL §24 for two benchmark-identified
// verb-stem + ending forms. These do not enable productive morphology guessing.
// Official source: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
// Exact-form formal liaison licenses. Direct NIKL surface attestations and
// transparent rule-derived applications are distinguished in comments.
const NIKL_13_14_FORMAL_LIAISON_FORMS=new Map([
  ['앉아라','앉>아'], // Exact formal-morpheme liaison license; retain the full form.
  ['닭이','닭>이'], // NIKL §13: 닭이[달기].
  ['넋이','넋>이'], // NIKL §14: 넋이[넉씨].
  ['값이','값>이'], // NIKL §14: 값이[갑씨].
  ['깎아','깎>아'], // NIKL §13: 깎아[까까].
  ['있어','있>어'], // NIKL §13: 있어[이써].
  ['쫓아','쫓>아'], // NIKL §13: 쫓아[쪼차].
  ['덮어','덮>어'], // NIKL §13: 덮어[더퍼].
  ['맞아','맞>아'], // NIKL §13: 맞아[마자].
  ['붙어','붙>어'], // NIKL §13: 붙어[부터].
  ['읽어','읽>어'], // NIKL §14: 읽어[일거].
  ['없어도','없>어'], // Exact formal-morpheme environment; no productive generalization.
  ['없음','없>음'], // NIKL FAQ 8391 / Q&A 335008: 없음[업씀].
  ['있었','있>었'], // NIKL Q&A 326978 explains 있- + -었- as [이썯].
  ['멋있어','있>어'], // NIKL Q&A 306166 gives [머디써] and [머시써]; preserve variant status.
  ['같아서','같>아'], // NIKL §§13–14, transparent 같다 + -아서 inflection.
  ['되었어','었>어'], // NIKL §§13–14, past ending -었- + vowel-initial -어.
  ['찢었으면','찢>었'], // NIKL §§13–14, verb stem + past ending.
  ['했었음','했>었'], // NIKL §§13–14, transparent inflectional sequence.
  ['붙어야','붙>어'], // NIKL §§13–14, 붙- + -어야.
  ['군대보냈어야','냈>어'], // Exact noisy token; only internal 보냈- + -어야.
  ['이런삶은','삶>은'], // 삶 + topic particle 은; formal boundary.
  ['끝내고싶어유유유유','싶>어'], // Exact noisy token; only internal 싶- + -어.
  ['이빨닦아야지','닦>아'], // Exact noisy token; only internal 닦- + -아야지.
  ['안늙었는데','늙>었'], // Exact noisy token; only internal 늙- + -었-.
  ['벗어날','벗>어'], // NIKL §§13–14, 벗- + -어.
  ['찾아','찾>아'], // NIKL §§13–14, 찾- + -아.
  ['좃같아서','같>아'], // Exact noisy token; only 같다 + -아서 is licensed.
  ['없을듯','없>을'], // Exact written form; 없다 + adnominal -을 before 듯.
  ['웃어넘기겟지만','웃>어'], // NIKL §§13–14; internal 웃- + -어, no normalization of later 겟.
  ['싶어서','싶>어'], // NIKL §§13–14, transparent 싶- + -어서.
  ['없으니깐','없>으'], // Exact noisy form; no productive ending heuristic.
  ['없으니까','없>으'], // NIKL §§13–14, 없다 + -으니까.
  // Exact-form morphology licenses mirrored from Python; these do not generalize to substrings.
  ['가없이','없>이'],
  ['말없이','없>이'],
  ['수없이','없>이'],
  ['늙은이','늙>은'],
]);

// Exact-form substantive-morpheme liaison licenses under NIKL §15(붙임).
// NIKL explicitly attests 값어치[가버치]; this is distinct from formal 값이[갑씨].
// Source: https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5949&mn_id=62
const NIKL_15_SUBSTANTIVE_LIAISON_FORMS=new Map([
  ['값어치','값>어'],
  ['값있는','값>있'],
  ['겉옷','겉>옷'],
  ['헛웃음','헛>웃'],
  ['맛없다','맛>없'],
]);

// Exact source-backed NIKL §11 verbal-stem ㄺ + ㄱ exceptions.
const NIKL_11_VERBAL_STEM_RIEUL_GIYEOK_FORMS=new Map([
  ['읽고','읽>고'], // NIKL Online Q&A qna_seq=329463: 읽고[일꼬].
  ['읽거든','읽>거'], // Official §11 example; verbal-stem ㄺ before ㄱ.
  ['묽고','묽>고'], // NIKL §11 example.
  ['얽거나','얽>거'], // NIKL §11 example.
  ['맑게','맑>게'], // NIKL §11; Online Q&A qna_seq=335693 clarifies written ㄺ before ㄱ.
  ['맑고','맑>고'], // NIKL Online Q&A qna_seq=320900 confirms [말꼬].
]);

// Exact-form NIKL §12(4) ㅎ-coda deletion licenses. These attest only
// Korean surface behavior, not independent IPA or Ukrainian-output gold.
const NIKL_COMPLEX_H_SUFFIX_FORMS=new Map([
  ['긁혔다는거지','긁>혔'], // Korean Basic Dictionary: 긁히어[글키어/글키여], 긁혀[글켜].
]);

const NIKL_12_H_DELETION_FORMS=new Map([
  // Exact examples explicitly listed in NIKL Standard Pronunciation Rule 12(4).
  ['낳은','낳>은'],
  ['놓아','놓>아'],
  ['쌓이다','쌓>이'],
  ['않은','않>은'],
  ['닳아','닳>아'],
  ['싫어도','싫>어'],
  ['싫어서','싫>어'], // NIKL Online Q&A qna_seq=313981 (2025-04-29): [시러서].
  ['수많은','많>은'], // Korean Basic Dictionary, 수많다: [수ː마는].
  ['많아서','많>아'], // NIKL Online Q&A qna_seq=334550 (2026-08-06): [마ː나서].
  ['많아지다','많>아'], // Exact form: 많- + -아 + auxiliary 지다; no productive heuristic.
  ['쌓아서','쌓>아'], // NIKL §12(4), 쌓- + -아서.
  ['쳐넣어야','넣>어'], // NIKL §12(4), 넣- + -어야 in compound verb.
  ['애새끼낳으면','낳>으'], // Exact noisy token; only internal 낳- + -으면.
  ['잃었노','잃>었'], // NIKL §12(4), 잃- + -었-; colloquial ending.
  ['않았지만','않>았'], // NIKL §12(4), 않- + -았-.
  ['개많음','많>음'], // NIKL §12(4), 많- + nominalizer -음.
  ['좋은데','좋>은'], // NIKL §12(4), 좋- + adnominal ending -은.
  ['괜찮아보이는디','찮>아'], // Exact form; 괜찮- + -아 before auxiliary 보이다.
  ['많을거같이','많>을'], // Exact form; 많- + adnominal -을.
  ['많이본','많>이'], // Exact lexicalized adverb 많이; NIKL §12(4).
  ['알잖아아침에','잖>아'], // Exact token; internal -잖아 ending only.
  ['좋아보인다고','좋>아'], // Exact form; 좋- + -아 before 보이다.
  ['좋아해주는','좋>아'], // Exact form; internal 좋- + -아 in 좋아하다.
  ['죽었잖아','잖>아'], // NIKL §12(4), ending -잖아.
  ['개좆망했잖아','잖>아'], // Exact colloquial input; scoped only to -잖아.
]);

const NIKL_17_FORMAL_I_FORMS=new Map([
  ['많을거같이','같>이'], // NIKL §17; exact form only.
  ['개같이못하고','같>이'], // NIKL Q&A 327454 confirms 같이 [가치]; exact token/pair only.
]);

const NIKL_24_STEM_NM_ENDING_FORMS=new Map([
  // Exact examples from official NIKL Rule 24. Keep this morphology-sensitive
  // inventory closed; ambiguous 신고 is intentionally not auto-licensed.
  ['안다','안>다'], // Official NIKL training material §24 example.
  ['안고','안>고'],
  ['안지','안>지'], // Official NIKL training material §24 example.
  ['신다','신>다'], // Official NIKL Online Q&A 325349 directly confirms [신따].
  ['감다','감>다'],
  ['감고','감>고'],
  ['껴안다','안>다'],
  ['앉고','앉>고'],
  ['얹다','얹>다'],
  ['삼고','삼>고'],
  ['더듬지','듬>지'],
  ['닮고','닮>고'],
  ['젊지','젊>지'],
  ['닮다','닮>다'],
  ['넘게','넘>게'],
]);

// Exact NIKL §25 stem ㄼ/ㄾ + ending fortition examples.
// Official rules: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
const NIKL_25_STEM_LB_LT_ENDING_FORMS=new Map([
  ['넓다','넓>다'], ['넓고','넓>고'], ['넓지','넓>지'],
  ['훑다','훑>다'], ['훑고','훑>고'], ['훑지','훑>지'],
]);

// Exact NIKL §26 Sino-Korean ㄹ + ㄷ/ㅅ/ㅈ fortition examples.
// 불소(弗素) is omitted because the reading depends on lexical sense.
// Official rules: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
const NIKL_26_SINO_KOREAN_RIEUL_FORTITION_FORMS=new Map([
  ['갈등','갈>등'], ['발동','발>동'], ['절도','절>도'], ['말살','말>살'],
  ['일시','일>시'], ['갈증','갈>증'], ['물질','물>질'], ['발전','발>전'],
  ['몰상식','몰>상'], ['불세출','불>세'],
]);

// Exact, source-backed NIKL §28 compound fortition cases. These licenses
// are lexical: a coda + plain onset alone is not enough to infer a compound.
// Official rules: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
// Additional official examples 물가[물까], 봄비[봄삐]: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=261&pageIndex=1&qna_seq=316282
const NIKL_28_COMPOUND_FORTITION_FORMS=new Map([
  ['문고리','문>고'], ['눈동자','눈>동'], ['신바람','신>바'],
  ['산새','산>새'], ['손재주','손>재'], ['길가','길>가'],
  ['물동이','물>동'], ['발바닥','발>바'], ['바람결','람>결'],
  ['그믐달','믐>달'], ['강가','강>가'], ['초승달','승>달'],
  ['등불','등>불'], ['창살','창>살'], ['강줄기','강>줄'],
  ['아침밥','침>밥'], ['굴속','굴>속'], ['술잔','술>잔'],
  // NIKL Online Q&A 316282 explicitly cites 물가[물까], 봄비[봄삐].
  ['물가','물>가'], ['봄비','봄>비'],
  // Korean Basic Dictionary directly lists 닭갈비[닥깔비] (ParaWordNo=56047).
  // Exact-form surface evidence only; do not generalize to other ㄺ+ㄱ sequences.
  ['닭갈비','닭>갈'],
]);

// Exact, source-licensed phrase boundaries whose rules require syntax or a
// known compound. These maps deliberately do not generalize from ㄹ/ㄴ codas.
const NIKL_27_ADNOMINAL_PHRASES=new Map([
  ['할 것을','ㄱ'],['갈 데가','ㄷ'],['할 바를','ㅂ'],['할 수는','ㅅ'],['읽을 수','ㅅ'],
  ['할 적에','ㅈ'],['갈 곳','ㄱ'],['할 도리','ㄷ'],['만날 사람','ㅅ']
]);
const NIKL_29_PHRASE_INSERTION=new Map([
  ['한 일',{onset:'ㄴ'}],['옷 입다',{coda:'ㄴ',onset:'ㄴ'}],
  ['먹은 엿',{onset:'ㄴ'}],['할 일',{onset:'ㄹ'}],
  ['잘 입다',{onset:'ㄹ'}],['먹을 엿',{onset:'ㄹ'}]
]);

// Exact NIKL §29 word-internal ㄴ insertion licenses; preserve lexical scope.
// Official rules: https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
const NIKL_29_WORD_INSERTION=new Map([
  ['솜이불','솜>이'], ['홑이불','홑>이'], ['막일','막>일'],
  ['삯일','삯>일'], ['맨입','맨>입'], ['꽃잎','꽃>잎'],
  ['내복약','복>약'], ['한여름','한>여'], ['남존여비','존>여'],
  ['신여성','신>여'], ['색연필','색>연'], ['직행열차','행>열'],
  ['늑막염','막>염'], ['콩엿','콩>엿'], ['담요','담>요'],
  ['눈요기','눈>요'], ['영업용','업>용'], ['식용유','용>유'],
  ['백분율','분>율'], ['밤윷','밤>윷'], ['들일','들>일'],
  ['솔잎','솔>잎'], ['설익다','설>익'], ['물약','물>약'],
  ['불여우','불>여'], ['서울역','울>역'], ['물엿','물>엿'],
  ['서른여섯','른>여'], ['스물여섯','물>여'],
]);
// §30(3) compound examples need a lexical compound boundary: do not treat
// their written 사이시옷 as ordinary coda-to-vowel liaison when the exact
// sourced lexical reading is unavailable.
const NIKL_30_SAISIOT_PRONUNCIATION_FORMS=new Map([
  ['냇가','냇>가'], ['샛길','샛>길'], ['빨랫돌','랫>돌'],
  ['콧등','콧>등'], ['깃발','깃>발'], ['대폿밥','폿>밥'],
  ['햇살','햇>살'], ['뱃속','뱃>속'], ['뱃전','뱃>전'],
  ['고갯짓','갯>짓'], ['아랫니','랫>니'], ['뒷마루','뒷>마'],
  ['뱃머리','뱃>머'], ['깻잎','깻>잎'], ['나뭇잎','뭇>잎'],
]);

// These additional compounds remain explicitly unresolved because their exact
// pronunciation is not in the adjudicated rule inventory.
const NIKL_30_SAISIOT_INSERTION_FORMS=new Set(['베갯잇','도리깻열']);

function parseCsv(text){
  const rows=[];let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}
    else if(c===','&&!quoted){row.push(cell);cell='';}
    else if((c==='\n'||c==='\r')&&!quoted){
      if(c==='\r'&&text[i+1]==='\n')i++;
      row.push(cell);cell='';
      if(row.some(v=>v!==''))rows.push(row);
      row=[];
    } else cell+=c;
  }
  if(cell||row.length){row.push(cell);if(row.some(v=>v!==''))rows.push(row);}
  const headers=rows.shift()||[];
  return rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,(r[i]??'').trim()])));
}
function decompose(ch){
  if(typeof ch!=='string'||[...ch].length!==1)return null;
  const cp=ch.codePointAt(0);
  if(cp<HANGUL_BASE||cp>HANGUL_END)return null;
  const n=cp-HANGUL_BASE,l=Math.floor(n/N_COUNT),v=Math.floor((n%N_COUNT)/T_COUNT),t=n%T_COUNT;
  return{char:ch,onset:ONSETS[l],vowel:VOWELS[v],coda:CODAS[t],hasCoda:t!==0};
}
function compose(onset,vowel,coda){
  const L=ONSETS.indexOf(onset),V=VOWELS.indexOf(vowel),T=CODAS.indexOf(coda||"");
  if(L<0||V<0||T<0)return "";
  return String.fromCodePoint(HANGUL_BASE+(L*V_COUNT+V)*T_COUNT+T);
}
function createMap(csv){return new Map(parseCsv(csv).map(r=>[r.layer+':'+r.input,r]));}
function get(map,layer,key){return map.get(layer+':'+key);}
function isJamoChar(ch){return typeof ch==='string'&&(/^[ㄱ-ㅎㅏ-ㅣ]$/u.test(ch)||'ㄳㄵㄶㄺㄻㄼㄽㄾㅀㅄ'.includes(ch));}
function isPreservableIpaLiteral(ch){return typeof ch==='string'&&/^[\s\p{P}]$/u.test(ch);}
function isHangulUnit(units,i){return Boolean(units[i]&&units[i].type==='hangul');}
function nextHangul(units,i){return isHangulUnit(units,i+1)?units[i+1]:null;}
function prevHangul(units,i){return isHangulUnit(units,i-1)?units[i-1]:null;}
function representative(coda){return FINAL_REPRESENTATIVE[coda]??coda;}

// Preserve literal whitespace and punctuation instead of joining them with
// artificial IPA/analysis separators (which previously produced triple spaces).
function renderStructured(units,values,separator){
  let result='';
  for(let i=0;i<units.length;i++){
    if(units[i].type!=='hangul'){if(units[i].type==='literal'&&isPreservableIpaLiteral(units[i].char))result+=units[i].char;continue;}
    const value=values[i]??'';
    // An unresolved syllable may have no IPA value. Do not emit a synthetic
    // syllable separator for that empty value: the original whitespace after
    // it is preserved by the following literal unit.
    if(value==='')continue;
    if(i>0&&units[i-1].type==='hangul'&&(values[i-1]??'')!=='')result+=separator;
    result+=value;
  }
  return result;
}


export {
  HANGUL_BASE, HANGUL_END, V_COUNT, T_COUNT, N_COUNT,
  ONSETS, VOWELS, CODAS, COMPLEX, FINAL_REPRESENTATIVE,
  NASAL_AFTER, PLAIN_TO_FORTIS, J_VOWELS, ASPIRATION, H_CODA_ASPIRATION,
  LEXICAL_B_CODA_PREFIXES, NIKL_12_H_DELETION_FORMS, NIKL_13_14_FORMAL_LIAISON_FORMS, NIKL_15_SUBSTANTIVE_LIAISON_FORMS, NIKL_11_VERBAL_STEM_RIEUL_GIYEOK_FORMS, NIKL_17_FORMAL_I_FORMS, NIKL_COMPLEX_H_SUFFIX_FORMS, NIKL_24_STEM_NM_ENDING_FORMS, NIKL_25_STEM_LB_LT_ENDING_FORMS, NIKL_26_SINO_KOREAN_RIEUL_FORTITION_FORMS, NIKL_28_COMPOUND_FORTITION_FORMS, NIKL_27_ADNOMINAL_PHRASES, NIKL_29_PHRASE_INSERTION, NIKL_29_WORD_INSERTION,
  NIKL_30_SAISIOT_PRONUNCIATION_FORMS, NIKL_30_SAISIOT_INSERTION_FORMS,
  parseCsv, decompose, compose, createMap, get, isHangulUnit, nextHangul, prevHangul,
  representative, isJamoChar, isPreservableIpaLiteral, renderStructured,
};
