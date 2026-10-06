const HANGUL_BASE=0xAC00,HANGUL_END=0xD7A3,V_COUNT=21,T_COUNT=28,N_COUNT=V_COUNT*T_COUNT;
const ONSETS=[...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];
const VOWELS=[...'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'];
const CODAS=['',...'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'];
const COMPLEX={
  'ㄳ':['ㄱ','ㅆ'],'ㄵ':['ㄴ','ㅈ'],'ㄶ':['ㄴ',''],
  'ㄺ':['ㄹ','ㄱ'],'ㄻ':['ㄹ','ㅁ'],'ㄼ':['ㄹ','ㅂ'],'ㄽ':['ㄹ','ㅆ'],
  'ㄾ':['ㄹ','ㅌ'],'ㄿ':['ㄹ','ㅍ'],'ㅀ':['ㄹ',''],'ㅄ':['ㅂ','ㅆ']
};
const FINAL_REPRESENTATIVE={
  'ㄲ':'ㄱ','ㄳ':'ㄱ','ㄵ':'ㄴ','ㄶ':'ㄴ','ㄺ':'ㄱ','ㄻ':'ㅁ','ㄼ':'ㄹ',
  'ㄽ':'ㄹ','ㄾ':'ㄹ','ㄿ':'ㅂ','ㅀ':'ㄹ','ㅄ':'ㅂ','ㅅ':'ㄷ','ㅆ':'ㄷ',
  'ㅈ':'ㄷ','ㅊ':'ㄷ','ㅋ':'ㄱ','ㅌ':'ㄷ','ㅎ':'ㄷ'
};
const NASAL_AFTER={'ㄱ':'ㅇ','ㄷ':'ㄴ','ㅂ':'ㅁ'};
const PLAIN_TO_FORTIS={'ㄱ':'ㄲ','ㄷ':'ㄸ','ㅂ':'ㅃ','ㅅ':'ㅆ','ㅈ':'ㅉ'};
const J_VOWELS=new Set(['ㅣ','ㅑ','ㅒ','ㅕ','ㅖ','ㅛ','ㅠ','ㅢ']);
const ASPIRATION={
  'ㄱ':'ㅋ','ㄷ':'ㅌ','ㅂ':'ㅍ','ㅈ':'ㅊ'
};

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
  const cp=ch.codePointAt(0);
  if(cp<HANGUL_BASE||cp>HANGUL_END)return null;
  const n=cp-HANGUL_BASE,l=Math.floor(n/N_COUNT),v=Math.floor((n%N_COUNT)/T_COUNT),t=n%T_COUNT;
  return{char:ch,onset:ONSETS[l],vowel:VOWELS[v],coda:CODAS[t],hasCoda:t!==0};
}
function createMap(csv){return new Map(parseCsv(csv).map(r=>[r.layer+':'+r.input,r]));}
function get(map,layer,key){return map.get(layer+':'+key);}
function isHangulUnit(units,i){return Boolean(units[i]&&units[i].type==='hangul');}
function mapOnset(map,jamo,currentVowel='',voiced=false,fortis=false){
  if(jamo==='ㅇ')return '';
  if((jamo==='ㅅ'||jamo==='ㅆ')&&J_VOWELS.has(currentVowel))return 'ш';
  if(voiced&&jamo==='ㄱ')return 'ґ';
  if(voiced&&jamo==='ㄷ')return 'д';
  if(voiced&&jamo==='ㅂ')return 'б';
  if(voiced&&jamo==='ㅈ')return 'дж';
  if(fortis&&jamo==='ㄱ')return 'к';
  if(fortis&&jamo==='ㄷ')return 'т';
  if(fortis&&jamo==='ㅂ')return 'п';
  if(fortis&&jamo==='ㅅ')return 'с';
  if(fortis&&jamo==='ㅈ')return 'ч';
  return get(map,'onset',jamo)?.ukrainian??'';
}
function mapVowel(map,jamo){return get(map,'vowel',jamo)?.ukrainian??'';}
function mapCoda(map,jamo){return jamo?(get(map,'coda',jamo)?.ukrainian??''):'';}
function nextHangul(units,i){return isHangulUnit(units,i+1)?units[i+1]:null;}
function prevHangul(units,i){return isHangulUnit(units,i-1)?units[i-1]:null;}
function representative(coda){return FINAL_REPRESENTATIVE[coda]??coda;}

function applyContextualRules(units){
  const ruleSets=units.map(()=>[]);
  for(let i=0;i<units.length-1;i++){
    const a=units[i],b=units[i+1];
    if(a.type!=='hangul'||b.type!=='hangul')continue;
    const rules=ruleSets[i];
    const nextRules=ruleSets[i+1];

    // R002: liaison / resyllabification. Complex codas keep their first
    // component in the coda and move the second component; ㄶ/ㅀ lose ㅎ.
    if(a.coda&&b.onset==='ㅇ'){
      const pair=COMPLEX[a.coda];
      if(pair){
        a.coda=pair[0];
        if(pair[1]){b.onset=pair[1];b.__liaison=true;}
        rules.push('complex-coda-liaison');
      }else if(a.coda!=='ㅎ'&&a.coda!=='ㅇ'){
        b.onset=a.coda;
        b.__liaison=true;
        a.coda='';
        rules.push('liaison');
      }
    }

    // R003/R004: ㅎ deletion and aspiration. These are applied after liaison.
    const rep=representative(a.coda);
    if((a.coda==='ㅎ'||a.coda==='ㄶ'||a.coda==='ㅀ')&&b.onset==='ㅇ'){
      if(a.coda==='ㅎ')a.coda='';
      else if(a.coda==='ㄶ')a.coda='ㄴ';
      else a.coda='ㄹ';
      rules.push('h-deletion');
    }else if((a.coda==='ㅎ'||a.coda==='ㄶ'||a.coda==='ㅀ')&&ASPIRATION[b.onset]){
      b.onset=ASPIRATION[b.onset];
      a.coda=a.coda==='ㄶ'?'ㄴ':a.coda==='ㅀ'?'ㄹ':'';
      rules.push('h-aspiration');
    }else if(a.coda&&b.onset==='ㅎ'&&ASPIRATION[rep]){
      b.onset=ASPIRATION[rep];
      a.coda='';
      rules.push('h-aspiration');
    }

    // R005: nasal assimilation. Use the final representative for obstruent
    // codas; do not infer it across punctuation/space because those are
    // represented as literal units.
    const afterRep=representative(a.coda);
    if((b.onset==='ㄴ'||b.onset==='ㅁ')&&NASAL_AFTER[afterRep]){
      a.coda=NASAL_AFTER[afterRep];
      rules.push('nasal-assimilation');
    }

    // R006: liquid assimilation.
    const liquidRep=representative(a.coda);
    if(liquidRep==='ㄴ'&&b.onset==='ㄹ'){
      a.coda='ㄹ';
      rules.push('liquid-assimilation');
    }else if(liquidRep==='ㄹ'&&b.onset==='ㄴ'){
      a.coda='ㄹ';
      b.onset='ㄹ';
      rules.push('liquid-assimilation');
    }else if((liquidRep==='ㅁ'||liquidRep==='ㅇ')&&b.onset==='ㄹ'){
      b.onset='ㄴ';
      rules.push('liquid-assimilation');
    }

    // R007: palatalization before i/j-like vowels.
    if((a.coda==='ㄷ'||a.coda==='ㅌ')&&b.onset==='ㅇ'&&J_VOWELS.has(b.vowel)){
      b.onset=a.coda==='ㄷ'?'ㅈ':'ㅊ';
      a.coda='';
      rules.push('palatalization');
    }

    // R008: practical tensification. The project deliberately does not
    // encode fortisness as doubled Ukrainian graphemes.
    const fortisRep=representative(a.coda);
    if(PLAIN_TO_FORTIS[b.onset]&&['ㄱ','ㄷ','ㅂ'].includes(fortisRep)){
      b.onset=PLAIN_TO_FORTIS[b.onset];
      nextRules.push('tensification');
    }
  }
  return ruleSets;
}

export function createEngine(csv){
  const map=createMap(csv);
  return{convert:function(text){return convertText(text,map)},decompose};
}

function convertText(text,map){
  const units=[...text].map(ch=>{const d=decompose(ch);return d?{type:'hangul',...d}:{type:'literal',char:ch};});
  const rules=applyContextualRules(units);
  const output=units.map(u=>u.char);
  const ipa=units.map(u=>u.type==='literal'?u.char:'');
  const analysis=units.map(u=>u.type==='literal'?u.char:'');
  const trace=units.map(u=>u.type==='literal'?{source:u.char,status:'literal',rules:[],output:u.char,ipa:u.char}:null);
  const issues=[];

  for(let i=0;i<units.length;i++){
    const u=units[i];
    if(u.type==='literal')continue;
    const next=nextHangul(units,i), prev=prevHangul(units,i);
    const applied=rules[i];
    let status=applied.length?'contextual':'canonical';
    const vowel=mapVowel(map,u.vowel);
    if(!vowel){
      issues.push(u.char+': ㅢ or another context-dependent vowel needs contextual resolution.');
      output[i]='⟦'+u.char+'⟧';
      trace[i]={source:u.char,status:'unresolved',rules:applied,output:output[i],ipa:''};
      continue;
    }

    const onset=u.onset;
    const previousCoda=prev?.__effectiveCoda??prev?.coda??'';
    const liaisonOnset=Boolean(u.__liaison);
    const previousSonorant=['ㄴ','ㄹ','ㅁ','ㅇ'].includes(previousCoda);
    const previousObstruent=Boolean(previousCoda)&&!previousSonorant;
    const voiced=liaisonOnset&&['ㄱ','ㄷ','ㅂ','ㅈ'].includes(onset);
    const fortis=!liaisonOnset&&previousObstruent&&['ㄱ','ㄷ','ㅂ','ㅅ','ㅈ'].includes(onset);
    const outOnset=mapOnset(map,onset,u.vowel,voiced,fortis);
    if(!outOnset&&onset!=='ㅇ'){issues.push(u.char+': no Ukrainian onset target');status='unresolved';}

    u.__effectiveCoda=u.coda;
    const outCoda=mapCoda(map,u.coda);
    const out=outOnset+vowel+outCoda;
    output[i]=out;

    const o=get(map,'onset',onset),v=get(map,'vowel',u.vowel),c=u.coda?get(map,'coda',u.coda):null;
    let unitIpa=(o?.ipa||'')+(v?.ipa||'')+(c?.ipa||'');
    // The IPA column is deliberately broad/analytical. Reflect the same
    // contextual onset decision used for the Ukrainian target when possible.
    if(voiced){
      const voicedIpa={ 'ㄱ':'ɡ','ㄷ':'d','ㅂ':'b','ㅈ':'dʑ' }[onset];
      if(voicedIpa)unitIpa=voicedIpa+(v?.ipa||'')+(c?.ipa||'');
    }else if(fortis){
      const fortisIpa={ 'ㄱ':'k͈','ㄷ':'t͈','ㅂ':'p͈','ㅅ':'s͈','ㅈ':'tɕ͈' }[onset];
      if(fortisIpa)unitIpa=fortisIpa+(v?.ipa||'')+(c?.ipa||'');
    }
    ipa[i]=unitIpa;
    analysis[i]=u.char+' = '+onset+'+'+u.vowel+(u.coda?'+'+u.coda:'');
    trace[i]={source:u.char,status,rules:[...new Set(applied)],output:out,ipa:unitIpa};
  }

  return{
    source:text,
    ukrainian:output.join(''),
    ipa:ipa.join(' '),
    analysis:analysis.join(' · '),
    trace,
    issues,
    status:issues.length?'unresolved':trace.some(x=>x?.status==='contextual')?'contextual':'canonical'
  };
}

export {parseCsv,decompose};