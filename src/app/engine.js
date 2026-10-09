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
  'ㅈ':'ㄷ','ㅊ':'ㄷ','ㅋ':'ㄱ','ㅌ':'ㄷ','ㅍ':'ㅂ','ㅎ':'ㄷ'
};
const NASAL_AFTER={'ㄱ':'ㅇ','ㄷ':'ㄴ','ㅂ':'ㅁ'};
const PLAIN_TO_FORTIS={'ㄱ':'ㄲ','ㄷ':'ㄸ','ㅂ':'ㅃ','ㅅ':'ㅆ','ㅈ':'ㅉ'};
const J_VOWELS=new Set(['ㅣ','ㅑ','ㅒ','ㅕ','ㅖ','ㅛ','ㅠ','ㅢ']);
const ASPIRATION={
  'ㄱ':'ㅋ','ㄷ':'ㅌ','ㅂ':'ㅍ','ㅈ':'ㅊ'
};

// Lexical standard-pronunciation exceptions that cannot be inferred from
// the final consonant alone. In particular, 밟- is [ㅂ] before consonants.
const LEXICAL_B_CODA_PREFIXES=new Set(['넓죽','넓둥','넓적']);

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
function mapOnset(map,jamo,currentVowel='',voiced=false,fortis=false,liquid=false){
  if(jamo==='ㅇ')return '';
  if(jamo==='ㄹ'&&liquid)return 'л';
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

// Preserve literal whitespace and punctuation instead of joining them with
// artificial IPA/analysis separators (which previously produced triple spaces).
function renderStructured(units,values,separator){
  let result='';
  for(let i=0;i<units.length;i++){
    if(units[i].type==='literal'){result+=units[i].char;continue;}
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

function applyContextualRules(units){
  const ruleSets=units.map(()=>[]);
  for(let i=0;i<units.length-1;i++){
    const a=units[i],b=units[i+1];
    if(a.type!=='hangul'||b.type!=='hangul')continue;
    const rules=ruleSets[i];
    const nextRules=ruleSets[i+1];

    // Lexical coda exceptions precede generic coda rules.
    if(a.coda==='ㄼ'&&b.onset!=='ㅇ'){
      if(a.char==='밟'){a.coda='ㅂ';rules.push('lexical-coda-balm');}
      else if(a.char==='넓'&&LEXICAL_B_CODA_PREFIXES.has(a.char+b.char)){a.coda='ㅂ';rules.push('lexical-coda-neolp');}
    }

    // R007: palatalization takes precedence over ordinary liaison when
    // ㄷ/ㅌ meets an i/j-like vowel through a zero onset.
    if((a.coda==='ㄷ'||a.coda==='ㅌ')&&b.onset==='ㅇ'&&b.vowel==='ㅣ'){
      b.onset=a.coda==='ㄷ'?'ㅈ':'ㅊ';
      a.coda='';
      rules.push('palatalization');
    }

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
        if(a.coda==='ㄹ')b.__liaisonLateral=true;
        a.coda='';
        rules.push('liaison');
        if(b.__liaisonLateral)nextRules.push('liaison-lateral');
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
    }else if(a.coda&&b.onset==='ㅎ'){
      const pair=COMPLEX[a.coda];
      if(pair){
        // Preserve the first component of complex codas while ㅎ combines
        // with the second: 읽히다 [일키다], 앉히다 [안치다],
        // 넓히다 [널피다].
        const moved=pair[1];
        const aspirated=moved==='ㅈ'?'ㅊ':(ASPIRATION[moved]||ASPIRATION[representative(moved)]);
        if(aspirated){
          b.onset=aspirated;
          a.coda=pair[0];
          rules.push('complex-coda-h-aspiration');
        }
      }else{
        const aspirated=a.coda==='ㅈ'?'ㅊ':(ASPIRATION[a.coda]||ASPIRATION[rep]);
        if(aspirated){
          // In 굳히다/닫히다/묻히다, ㄷ+ㅎ first becomes ㅌ and
          // the resulting ㅌ before ㅣ is palatalized to ㅊ (§12 + §17).
          const aspiratedPalatalized=a.coda==='ㄷ'&&b.onset==='ㅎ'&&b.vowel==='ㅣ';
          b.onset=aspiratedPalatalized?'ㅊ':aspirated;
          a.coda='';
          rules.push(aspiratedPalatalized?'h-aspiration-plus-palatalization':'h-aspiration');
        }
      }
    }

    // R006a: when an obstruent coda precedes ㄹ, standard pronunciation
    // realizes that ㄹ as ㄴ; the coda then undergoes nasal assimilation.
    // Examples: 국립 [궁닙], 독립문 [동님문], 협력 [혐녁].
    // Keep the rule visible on both segments so the trace explains the change.
    const beforeLiquidRep=representative(a.coda);
    if(['ㄱ','ㅂ','ㅁ','ㅇ'].includes(beforeLiquidRep)&&b.onset==='ㄹ'){
      b.onset='ㄴ';
      rules.push('liquid-to-nasal-before-obstruent');
      nextRules.push('liquid-to-nasal-before-obstruent');
    }

    // R005: nasal assimilation. Use the final representative for obstruent
    // codas; do not infer it across punctuation/space because those are
    // represented as literal units. The affected onset receives the same
    // trace label as the coda that changed.
    const afterRep=representative(a.coda);
    if((b.onset==='ㄴ'||b.onset==='ㅁ')&&NASAL_AFTER[afterRep]){
      a.coda=NASAL_AFTER[afterRep];
      rules.push('nasal-assimilation');
      nextRules.push('nasal-assimilation');
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

export function createEngine(csv,lexiconCsv=''){
  const map=createMap(csv);
  const lexicon=new Map(parseCsv(lexiconCsv).map(r=>[r.input,r]));
  return{convert:function(text){return convertText(text,map,lexicon)},decompose};
}

function lexicalResult(text,entry){
  const targets=entry.target_syllables.split('|');
  const ipas=entry.ipa_syllables.split('|');
  const syllables=[...text];
  const analysis=syllables.map(ch=>{
    const d=decompose(ch);
    return ch+' = '+d.onset+'+'+d.vowel+(d.coda?'+'+d.coda:'');
  }).join(' · ');
  const targetReview=entry.target_status==='provisional';
  return {
    source:text,
    ukrainian:targets.join(''),
    ipa:ipas.join(' '),
    analysis,
    trace:syllables.map((ch,i)=>({
      source:ch,status:targetReview?'lexical-review':'lexical',rules:i===0?(targetReview?['lexical-pronunciation','ukrainian-target-provisional']:['lexical-pronunciation']):['lexical-context'],
      output:targets[i]??'',ipa:ipas[i]??''
    })),
    issues:[],
    status:targetReview?'lexical-review':'lexical'
  };
}

function convertText(text,map,lexicon=new Map(),skipLexicon=false){
  if(!skipLexicon&&lexicon.size){
    const parts=text.match(/[가-힣]+|[^가-힣]+/g)||[];
    if(parts.some(part=>lexicon.has(part))){
      const results=parts.map(part=>{
        if(lexicon.has(part))return lexicalResult(part,lexicon.get(part));
        return convertText(part,map,lexicon,true);
      });
      const issues=results.flatMap(r=>r.issues);
      return {
        source:text,
        ukrainian:results.map(r=>r.ukrainian).join(''),
        ipa:results.map(r=>r.ipa).join(''),
        analysis:results.map(r=>r.analysis).join(''),
        trace:results.flatMap(r=>r.trace),
        issues,
        status:issues.length?'unresolved':results.some(r=>r.status==='lexical-review')?'lexical-review':results.some(r=>r.status==='lexical')?'lexical':results.some(r=>r.status==='contextual')?'contextual':'canonical'
      };
    }
  }
  const units=[...text].map(ch=>{const d=decompose(ch);return d?{type:'hangul',...d}:{type:'literal',char:ch};});
  // Keep orthographic decomposition immutable: contextual rules mutate the
  // working surface representation, not the source Hangul structure.
  const originalUnits=units.map(u=>({...u}));
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
    const original=originalUnits[i];
    analysis[i]=original.char+' = '+original.onset+'+'+original.vowel+(original.coda?'+'+original.coda:'');
    // Standard Korean pronunciation: ㅢ in a syllable with an
    // actual consonant onset is realized as [i] (e.g. 희망 [히망]).
    // ㅇ+ㅢ remains unresolved because lexical position and particle
    // function can license different readings ([의], [이], [에]).
    const contextualUi=u.vowel==='ㅢ'&&u.onset!=='ㅇ';
    const defaultUi=u.vowel==='ㅢ'&&u.onset==='ㅇ';
    const vowelJamo=contextualUi?'ㅣ':u.vowel;
    let status=applied.length||contextualUi||defaultUi?'contextual':'canonical';
    // Standard Pronunciation Rules §5: ㅢ is [ɰi] by default. A ㅢ syllable
    // with a consonant onset is [i]; non-initial 의 may also be [i], and the
    // particle 의 may also be [e]. Since this browser adapter has no full
    // morphological parser, render the normative default [ɰi] instead of
    // marking every ㅇ+ㅢ as unresolved. Alternatives remain context-sensitive.
    const vowel=defaultUi?'ий':mapVowel(map,vowelJamo);
    if(!vowel){
      const message=u.char+': no Ukrainian vowel target is available.';
      issues.push(message);
      output[i]='⟦'+u.char+'⟧';
      trace[i]={source:u.char,status:'unresolved',rules:applied,output:output[i],ipa:''};
      continue;
    }

    const onset=u.onset;
    const previousCoda=prev?.__effectiveCoda??prev?.coda??'';
    const liaisonOnset=Boolean(u.__liaison);
    const previousSonorant=['ㄴ','ㄹ','ㅁ','ㅇ'].includes(previousCoda);
    const previousObstruent=Boolean(previousCoda)&&!previousSonorant;
    const previousOpenSyllable=Boolean(prev)&&prev.coda==='';
    const voiced=(liaisonOnset||previousSonorant||previousOpenSyllable)&&['ㄱ','ㄷ','ㅂ','ㅈ'].includes(onset);
    const fortis=!liaisonOnset&&previousObstruent&&['ㄱ','ㄷ','ㅂ','ㅅ','ㅈ'].includes(onset);
    // A coda ㄹ resyllabified into the next onset stays lateral [l];
    // it must not be reinterpreted as the intervocalic tap [ɾ] (e.g. 서울역).
    const liquid=onset==='ㄹ'&&(Boolean(u.__liaisonLateral)||['ㄴ','ㄹ','ㅁ','ㅇ'].includes(previousCoda));
    const outOnset=mapOnset(map,onset,u.vowel,voiced,fortis,liquid);
    const traceRules=[...applied];
    if(contextualUi)traceRules.push('vowel-ui-to-i');
    if(defaultUi)traceRules.push('vowel-ui-default-ɰi');
    if(voiced)traceRules.push('contextual-voicing');
    if(fortis)traceRules.push('tensification');
    if(liquid&&!traceRules.includes('liquid-assimilation'))traceRules.push('liquid-assimilation');
    if(!outOnset&&onset!=='ㅇ'){issues.push(u.char+': no Ukrainian onset target');status='unresolved';}

    u.__effectiveCoda=u.coda;
    const outCoda=mapCoda(map,u.coda);
    const out=outOnset+vowel+outCoda;
    output[i]=out;

    const o=get(map,'onset',onset),v=get(map,'vowel',vowelJamo),c=u.coda?get(map,'coda',u.coda):null;
    const vowelIpa=defaultUi?'ɰi':(v?.ipa||'');
    let unitIpa=(o?.ipa||'')+vowelIpa+(c?.ipa||'');
    if(liquid&&onset==='ㄹ')unitIpa='l'+(v?.ipa||'')+(c?.ipa||'');
    // The IPA column is deliberately broad/analytical. Reflect the same
    // contextual onset decision used for the Ukrainian target when possible.
    if(voiced){
      const voicedIpa={ 'ㄱ':'ɡ','ㄷ':'d','ㅂ':'b','ㅈ':'dʑ' }[onset];
      if(voicedIpa)unitIpa=voicedIpa+vowelIpa+(c?.ipa||'');
    }else if(fortis){
      const fortisIpa={ 'ㄱ':'k͈','ㄷ':'t͈','ㅂ':'p͈','ㅅ':'s͈','ㅈ':'tɕ͈' }[onset];
      if(fortisIpa)unitIpa=fortisIpa+vowelIpa+(c?.ipa||'');
    }
    ipa[i]=unitIpa;
    trace[i]={source:u.char,status,rules:[...new Set(traceRules)],output:out,ipa:unitIpa};
  }

  return{
    source:text,
    ukrainian:output.join(''),
    ipa:renderStructured(units,ipa,' '),
    analysis:renderStructured(units,analysis,' · '),
    trace,
    issues,
    status:issues.length?'unresolved':trace.some(x=>x?.status==='contextual')?'contextual':'canonical'
  };
}

export {parseCsv,decompose};