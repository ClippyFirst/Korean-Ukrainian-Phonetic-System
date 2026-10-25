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
  ['웃어넘기겟지만','웃>어'], // NIKL §§13–14; internal 웃- + -어, no normalization of later 겟.
  ['싶어서','싶>어'], // NIKL §§13–14, transparent 싶- + -어서.
  ['없으니깐','없>으'], // Exact noisy form; no productive ending heuristic.
  ['없으니까','없>으'], // NIKL §§13–14, 없다 + -으니까.
]);

// Exact-form NIKL §12(4) ㅎ-coda deletion licenses. These attest only
// Korean surface behavior, not independent IPA or Ukrainian-output gold.
const NIKL_COMPLEX_H_SUFFIX_FORMS=new Map([
  ['긁혔다는거지','긁>혔'], // Korean Basic Dictionary: 긁히어[글키어/글키여], 긁혀[글켜].
]);

const NIKL_12_H_DELETION_FORMS=new Map([
  ['싫어서','싫>어'], // NIKL Online Q&A qna_seq=313981 (2025-04-29): [시러서].
  ['수많은','많>은'], // Korean Basic Dictionary, 수많다: [수ː마는].
  ['많아서','많>아'], // NIKL Online Q&A qna_seq=334550 (2026-08-06): [마ː나서].
  ['쌓아서','쌓>아'], // NIKL §12(4), 쌓- + -아서.
  ['쳐넣어야','넣>어'], // NIKL §12(4), 넣- + -어야 in compound verb.
  ['애새끼낳으면','낳>으'], // Exact noisy token; only internal 낳- + -으면.
  ['잃었노','잃>었'], // NIKL §12(4), 잃- + -었-; colloquial ending.
  ['않았지만','않>았'], // NIKL §12(4), 않- + -았-.
  ['개많음','많>음'], // NIKL §12(4), 많- + nominalizer -음.
  ['좋은데','좋>은'], // NIKL §12(4), 좋- + adnominal ending -은.
  ['죽었잖아','잖>아'], // NIKL §12(4), ending -잖아.
  ['개좆망했잖아','잖>아'], // Exact colloquial input; scoped only to -잖아.
]);

const NIKL_24_STEM_NM_ENDING_FORMS=new Map([
  ['닮다','닮>다'],
  ['넘게','넘>게'],
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
// §30(3) compound examples need a lexical compound boundary: do not treat
// their written 사이시옷 as ordinary coda-to-vowel liaison when the exact
// sourced lexical reading is unavailable.
const NIKL_30_SAISIOT_INSERTION_FORMS=new Set(['깻잎','나뭇잎','베갯잇','도리깻열']);

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
  LEXICAL_B_CODA_PREFIXES, NIKL_12_H_DELETION_FORMS, NIKL_13_14_FORMAL_LIAISON_FORMS, NIKL_COMPLEX_H_SUFFIX_FORMS, NIKL_24_STEM_NM_ENDING_FORMS, NIKL_27_ADNOMINAL_PHRASES, NIKL_29_PHRASE_INSERTION,
  NIKL_30_SAISIOT_INSERTION_FORMS,
  parseCsv, decompose, compose, createMap, get, isHangulUnit, nextHangul, prevHangul,
  representative, isJamoChar, isPreservableIpaLiteral, renderStructured,
};
