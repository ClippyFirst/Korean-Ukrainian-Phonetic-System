const HANGUL_BASE=0xAC00,HANGUL_END=0xD7A3,V_COUNT=21,T_COUNT=28,N_COUNT=V_COUNT*T_COUNT;
const ONSETS=[...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];
const VOWELS=[...'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'];
const CODAS=['',...'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'];
const COMPLEX={'ㄳ':['ㄱ','ㅆ'],'ㄵ':['ㄴ','ㅈ'],'ㄶ':['ㄴ','ㅎ'],'ㄺ':['ㄹ','ㄱ'],'ㄻ':['ㄹ','ㅁ'],'ㄼ':['ㄹ','ㅂ'],'ㄽ':['ㄹ','ㅅ'],'ㄾ':['ㄹ','ㅌ'],'ㄿ':['ㄹ','ㅍ'],'ㅀ':['ㄹ','ㅎ'],'ㅄ':['ㅂ','ㅆ']};
const J_VOWELS=new Set(['ㅣ','ㅑ','ㅒ','ㅕ','ㅖ','ㅛ','ㅠ','ㅢ']);

function parseCsv(text){const rows=[];let row=[],cell='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);cell='';if(row.some(v=>v!==''))rows.push(row);row=[];}else cell+=c;}if(cell||row.length){row.push(cell);if(row.some(v=>v!==''))rows.push(row);}const headers=rows.shift()||[];return rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,(r[i]??'').trim()])));}
function decompose(ch){const cp=ch.codePointAt(0);if(cp<HANGUL_BASE||cp>HANGUL_END)return null;const n=cp-HANGUL_BASE,l=Math.floor(n/N_COUNT),v=Math.floor((n%N_COUNT)/T_COUNT),t=n%T_COUNT;return{char:ch,onset:ONSETS[l],vowel:VOWELS[v],coda:CODAS[t],hasCoda:t!==0};}
function createMap(csv){return new Map(parseCsv(csv).map(r=>[`${r.layer}:${r.input}`,r]));}
function get(map,layer,key){return map.get(`${layer}:${key}`);}
function mapOnset(map,jamo,nextVowel='',voiced=false,fortis=false){if(jamo==='ㅇ')return '';if(jamo==='ㅅ'&&J_VOWELS.has(nextVowel))return 'ш';if(jamo==='ㅆ'&&J_VOWELS.has(nextVowel))return 'ш';if(voiced&&jamo==='ㄱ')return 'ґ';if(voiced&&jamo==='ㄷ')return 'д';if(voiced&&jamo==='ㅂ')return 'б';if(voiced&&jamo==='ㅈ')return 'дж';if(fortis&&jamo==='ㄱ')return 'к';if(fortis&&jamo==='ㄷ')return 'т';if(fortis&&jamo==='ㅂ')return 'п';if(fortis&&jamo==='ㅅ')return 'с';if(fortis&&jamo==='ㅈ')return 'ч';return get(map,'onset',jamo)?.ukrainian??'';}
function mapVowel(map,jamo){return get(map,'vowel',jamo)?.ukrainian??'';}
function mapCoda(map,jamo){return jamo?(get(map,'coda',jamo)?.ukrainian??''):'';}

export function createEngine(csv){const map=createMap(csv);return{convert(text){return convertText(text,map)},decompose};}

function convertText(text,map){
  const units=[...text].map(ch=>{const d=decompose(ch);return d?{type:'hangul',...d}:{type:'literal',char:ch};});
  const output=units.map(u=>u.char),ipa=units.map(u=>u.type==='literal'?u.char:''),analysis=units.map(u=>u.type==='literal'?u.char:''),trace=units.map(u=>u.type==='literal'?{source:u.char,status:'literal',rules:[],output:u.char,ipa:u.char}:null),issues=[];
  for(let i=0;i<units.length;i++){
    const u=units[i]; if(u.type==='literal')continue;
    const next=units[i+1]?.type==='hangul'?units[i+1]:null, prev=units[i-1]?.type==='hangul'?units[i-1]:null;
    let coda=u.coda,onset=u.onset,rules=[],status='canonical';
    let vowel=mapVowel(map,u.vowel);
    if(!vowel){status='unresolved';issues.push(`${u.char}: ㅢ or another context-dependent vowel needs contextual resolution.`);output[i]=`⟦${u.char}⟧`;trace[i]={source:u.char,status,rules,output:output[i],ipa:''};continue;}
    if(next&&next.onset==='ㅇ'&&coda){
      if(COMPLEX[coda]){const [remain,moved]=COMPLEX[coda];coda=remain;next.__liaisonOnset=moved;rules.push('complex-coda-liaison');}
      else{next.__liaisonOnset=coda;coda='';rules.push('liaison');}
      status='contextual';
    }
    let effectiveOnset=u.__liaisonOnset||onset;
    const previousCoda=prev?.coda||'';
    const previousSonorant=['ㄴ','ㄹ','ㅁ','ㅇ'].includes(previousCoda);
    const previousObstruent=previousCoda&&!previousSonorant;
    const voiced=!u.__liaisonOnset&&previousSonorant&&['ㄱ','ㄷ','ㅂ','ㅈ'].includes(effectiveOnset);
    const fortis=previousObstruent&&['ㄱ','ㄷ','ㅂ','ㅅ','ㅈ'].includes(effectiveOnset);
    const outOnset=mapOnset(map,effectiveOnset,next?.vowel||'',voiced,fortis);
    if(voiced){rules.push('contextual-voicing');status='contextual';}
    if(fortis){rules.push('tensification');status='contextual';}
    const outCoda=mapCoda(map,coda),out=`${outOnset}${vowel}${outCoda}`;
    output[i]=out;
    const o=get(map,'onset',effectiveOnset),v=get(map,'vowel',u.vowel),c=coda?get(map,'coda',coda):null;
    const unitIpa=[o?.ipa||'',v?.ipa||'',c?.ipa||''].join('');
    ipa[i]=unitIpa;
    analysis[i]=`${u.char} = ${effectiveOnset}+${u.vowel}${coda?`+${coda}`:''}`;
    trace[i]={source:u.char,status,rules:[...new Set(rules)],output:out,ipa:unitIpa};
  }
  for(let i=0;i<units.length;i++){
    const u=units[i];if(u.type!=='hangul'||!u.__liaisonOnset)continue;
    const onset=mapOnset(map,u.__liaisonOnset,u.vowel,false,false),vowel=mapVowel(map,u.vowel),coda=mapCoda(map,u.coda);
    if(vowel){output[i]=onset+vowel+coda;trace[i]={...trace[i],status:'contextual',output:output[i],rules:[...(trace[i]?.rules||[]),'liaison-realization']};analysis[i]=`${u.char} = ${u.__liaisonOnset}+${u.vowel}${u.coda?`+${u.coda}`:''}`;}
  }
  return{source:text,ukrainian:output.join(''),ipa:ipa.join(' '),analysis:analysis.join(' · '),trace,issues,status:issues.length?'unresolved':trace.some(x=>x?.status==='contextual')?'contextual':'canonical'};
}

export {parseCsv,decompose};