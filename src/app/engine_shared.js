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
function isPreservableIpaLiteral(ch){return typeof ch==='string'&&/^[\\s\\p{P}]$/u.test(ch);}
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
  LEXICAL_B_CODA_PREFIXES, NIKL_27_ADNOMINAL_PHRASES, NIKL_29_PHRASE_INSERTION,
  NIKL_30_SAISIOT_INSERTION_FORMS,
  parseCsv, decompose, compose, createMap, get, isHangulUnit, nextHangul, prevHangul,
  representative, isJamoChar, isPreservableIpaLiteral, renderStructured,
};
