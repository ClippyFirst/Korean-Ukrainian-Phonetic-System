const HANGUL_BASE=0xAC00,HANGUL_END=0xD7A3,V_COUNT=21,T_COUNT=28,N_COUNT=V_COUNT*T_COUNT;
const ONSETS=[...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];
const VOWELS=[...'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'];
const CODAS=['',...'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'];
const COMPLEX={'ㄳ':['ㄱ','ㅆ'],'ㄵ':['ㄴ','ㅈ'],'ㄶ':['ㄴ','ㅎ'],'ㄺ':['ㄹ','ㄱ'],'ㄻ':['ㄹ','ㅁ'],'ㄼ':['ㄹ','ㅂ'],'ㄽ':['ㄹ','ㅅ'],'ㄾ':['ㄹ','ㅌ'],'ㄿ':['ㄹ','ㅍ'],'ㅀ':['ㄹ','ㅎ'],'ㅄ':['ㅂ','ㅆ']};
const J_VOWELS=new Set(['ㅣ','ㅑ','ㅒ','ㅕ','ㅖ','ㅛ','ㅠ','ㅢ']);

function parseCsv(text){
  const rows=[];let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);cell='';if(row.some(v=>v!==''))rows.push(row);row=[];}else cell+=c;}
  if(cell||row.length){row.push(cell);if(row.some(v=>v!==''))rows.push(row);}
  const headers=rows.shift()||[];return rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,(r[i]??'').trim()])));
}
function decompose(ch){const cp=ch.codePointAt(0);if(cp<HANGUL_BASE||cp>HANGUL_END)return null;const n=cp-HANGUL_BASE,l=Math.floor(n/N_COUNT),v=Math.floor((n%N_COUNT)/T_COUNT),t=n%T_COUNT;return{char:ch,onset:ONSETS[l],vowel:VOWELS[v],coda:CODAS[t],hasCoda:t!==0};}
function createMap(csv){return new Map(parseCsv(csv).map(r=>[r.layer+':'+r.input,r]));}
function get(map,layer,key){return map.get(layer+':'+key);}
function mapOnset(map,jamo,currentVowel='',voiced=false,fortis=false){
  if(jamo==='ㅇ')return '';
  if((jamo==='ㅅ'||jamo==='ㅆ')&&J_VOWELS.has(currentVowel))return 'ш';
  if(voiced&&jamo==='ㄱ')return 'ґ';if(voiced&&jamo==='ㄷ')return 'д';if(voiced&&jamo==='ㅂ')return 'б';if(voiced&&jamo==='ㅈ')return 'дж';
  if(fortis&&jamo==='ㄱ')return 'к';if(fortis&&jamo==='ㄷ')return 'т';if(fortis&&jamo==='ㅂ')return 'п';if(fortis&&jamo==='ㅅ')return 'с';if(fortis&&jamo==='ㅈ')return 'ч';
  return get(map,'onset',jamo)?.ukrainian??'';
}
function mapVowel(map,jamo){return get(map,'vowel',jamo)?.ukrainian??'';}
function mapCoda(map,jamo){return jamo?(get(map,'coda',jamo)?.ukrainian??''):'';}

export function createEngine(csv){const map=createMap(csv);return{convert:function(text){return convertText(text,map)},decompose};}

function convertText(text,map){
  const units=[...text].map(function(ch){const d=decompose(ch);return d?{type:'hangul',...d}:{type:'literal',char:ch};});
  const output=units.map(function(u){return u.char;});
  const ipa=units.map(function(u){return u.type==='literal'?u.char:'';});
  const analysis=units.map(function(u){return u.type==='literal'?u.char:'';});
  const trace=units.map(function(u){return u.type==='literal'?{source:u.char,status:'literal',rules:[],output:u.char,ipa:u.char}:null;});
  const issues=[];
  for(let i=0;i<units.length;i++){
    const u=units[i];if(u.type==='literal')continue;
    const next=units[i+1]?.type==='hangul'?units[i+1]:null;const prev=units[i-1]?.type==='hangul'?units[i-1]:null;
    let coda=u.coda;const onset=u.__liaisonOnset||u.onset;const rules=[];let status='canonical';
    const vowel=mapVowel(map,u.vowel);
    if(!vowel){status='unresolved';issues.push(u.char+': ㅢ or another context-dependent vowel needs contextual resolution.');output[i]='⟦'+u.char+'⟧';trace[i]={source:u.char,status:status,rules:rules,output:output[i],ipa:''};continue;}
    if(next&&next.onset==='ㅇ'&&coda){
      if(COMPLEX[coda]){const pair=COMPLEX[coda];coda=pair[0];next.__liaisonOnset=pair[1];rules.push('complex-coda-liaison');}
      else{next.__liaisonOnset=coda;coda='';rules.push('liaison');}
      status='contextual';
    }
    const previousCoda=prev?.__effectiveCoda??prev?.coda??'';const previousSonorant=['ㄴ','ㄹ','ㅁ','ㅇ'].includes(previousCoda);const previousObstruent=previousCoda&&!previousSonorant;
    const liaisonOnset=Boolean(u.__liaisonOnset);
    const voiced=(liaisonOnset&&['ㄱ','ㄷ','ㅂ','ㅈ'].includes(onset))||(previousSonorant&&['ㄱ','ㄷ','ㅂ','ㅈ'].includes(onset));
    const fortis=!liaisonOnset&&previousObstruent&&['ㄱ','ㄷ','ㅂ','ㅅ','ㅈ'].includes(onset);
    const outOnset=mapOnset(map,onset,u.vowel,voiced,fortis);
    if(voiced){rules.push('contextual-voicing');status='contextual';}if(fortis){rules.push('tensification');status='contextual';}if(liaisonOnset){rules.push('liaison-realization');status='contextual';}
    if(!outOnset&&onset!=='ㅇ'){issues.push(u.char+': no Ukrainian onset target');status='unresolved';}
    u.__effectiveCoda=coda;
    const outCoda=mapCoda(map,coda);const out=outOnset+vowel+outCoda;output[i]=out;
    const o=get(map,'onset',onset),v=get(map,'vowel',u.vowel),c=coda?get(map,'coda',coda):null;const unitIpa=(o?.ipa||'')+(v?.ipa||'')+(c?.ipa||'');
    ipa[i]=unitIpa;analysis[i]=u.char+' = '+onset+'+'+u.vowel+(coda?'+'+coda:'');trace[i]={source:u.char,status:status,rules:[...new Set(rules)],output:out,ipa:unitIpa};
  }
  return{source:text,ukrainian:output.join(''),ipa:ipa.join(' '),analysis:analysis.join(' · '),trace:trace,issues:issues,status:issues.length?'unresolved':trace.some(function(x){return x?.status==='contextual';})?'contextual':'canonical'};
}

export {parseCsv,decompose};