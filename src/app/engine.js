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

    // NIKL §17 requires a licensed formal morpheme boundary (or its
    // explicit ㄷ + suffix -히 provision). Hangul adjacency alone cannot
    // establish that morphology. Exact sourced forms are handled by the
    // lexical layer; unknown candidates are withheld instead of guessed.
    if(['ㄷ','ㅌ','ㄾ'].includes(a.coda)&&b.onset==='ㅇ'&&b.vowel==='ㅣ'){
      a.__palatalizationUnlicensed='left';
      b.__palatalizationUnlicensed='right';
      rules.push('palatalization-requires-lexical-morphology');
      nextRules.push('palatalization-requires-lexical-morphology');
      continue;
    }

    // R002: liaison / resyllabification. For non-H complex codas, the
    // result differs between formal morphemes (§§13–14) and substantive
    // morphemes (§15). The browser has no morphological parser, so only exact
    // sourced lexical entries may resolve these cases; unknown forms are
    // marked unresolved rather than assigned the §14 pattern by default.
    if(a.coda&&b.onset==='ㅇ'&&!a.__palatalizationUnlicensed){
      // NIKL §12(4): ㅎ/ㄶ/ㅀ deletion is licensed before vowel-initial
      // endings/suffixes, not by Hangul adjacency alone. Exact known forms
      // are handled by the lexical layer; unknown candidates are withheld.
      if(['ㅎ','ㄶ','ㅀ'].includes(a.coda)){
        a.__hDeletionUnlicensed='left';
        b.__hDeletionUnlicensed='right';
        rules.push('h-deletion-requires-morphology');
        nextRules.push('h-deletion-requires-morphology');
        continue;
      }
      const pair=COMPLEX[a.coda];
      if(pair&&!['ㄶ','ㅀ'].includes(a.coda)){
        a.__complexLiaisonUnlicensed='left';
        b.__complexLiaisonUnlicensed='right';
        rules.push('complex-coda-liaison-requires-morphology');
        nextRules.push('complex-coda-liaison-requires-morphology');
        continue;
      }else if(!pair&&a.coda!=='ㅎ'&&a.coda!=='ㅇ'&&
               representative(a.coda)!==a.coda&&
               ['ㅏ','ㅓ','ㅗ','ㅜ','ㅟ'].includes(b.vowel)){
        // NIKL §15 applies representative-coda neutralization before
        // substantive morphemes beginning with ㅏ/ㅓ/ㅗ/ㅜ/ㅟ. For these
        // codas, the §13 formal-morpheme result can differ. Without lexical
        // or morphological evidence, do not transfer the written coda.
        a.__substantiveLiaisonUnlicensed='left';
        b.__substantiveLiaisonUnlicensed='right';
        rules.push('substantive-morpheme-liaison-requires-morphology');
        nextRules.push('substantive-morpheme-liaison-requires-morphology');
        continue;
      }else if(pair){
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
    }else if(a.coda&&b.onset==='ㅎ'){
      const pair=COMPLEX[a.coda];
      if(pair){
        // NIKL §12 붙임 1 has direct complex-coda + ㅎ aspiration in
        // morphologically licensed forms such as 읽히다/앉히다/넓히다.
        // This browser has no morphological parser; exact lexical entries
        // resolve known forms. Do not apply that suffix pattern to unknown
        // adjacent Hangul blocks.
        a.__complexHAspirationUnlicensed='left';
        b.__complexHAspirationUnlicensed='right';
        rules.push('complex-coda-h-aspiration-requires-morphology');
        nextRules.push('complex-coda-h-aspiration-requires-morphology');
        continue;
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
    if(['ㄱ','ㄷ','ㅂ','ㅁ','ㅇ'].includes(beforeLiquidRep)&&b.onset==='ㄹ'){
      b.onset='ㄴ';
      rules.push('liquid-to-nasal-before-obstruent');
      nextRules.push('liquid-to-nasal-before-obstruent');
    }

    // R005: nasal assimilation. Use the final representative for obstruent
    // codas. This local pass handles within-eojeol pairs; the separate phrase
    // pass below handles plain whitespace but never crosses punctuation. The
    // affected onset receives the same trace label as the coda that changed.
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

    // R016 / §11: ㄺ before ㄱ is morphologically ambiguous. Known forms
    // are resolved by exact lexical entries; do not let generic §23
    // fortition silently choose the noun-like coda simplification.
    if(a.coda==='ㄺ'&&b.onset==='ㄱ'){
      a.__rieulGiyeokUnlicensed='left';
      b.__rieulGiyeokUnlicensed='right';
      rules.push('rieul-giyeok-exception-requires-morphology');
      nextRules.push('rieul-giyeok-exception-requires-morphology');
      continue;
    }

    // R008: practical tensification. The project deliberately does not
    // encode fortisness as doubled Ukrainian graphemes.
    const fortisRep=representative(a.coda);
    if(PLAIN_TO_FORTIS[b.onset]&&['ㄱ','ㄷ','ㅂ'].includes(fortisRep)){
      b.onset=PLAIN_TO_FORTIS[b.onset];
      nextRules.push('tensification');
    }
  }
  // NIKL §18 explicitly permits nasal assimilation across eojeol when
  // the words are spoken as one phrase; §§19–20 can feed the same sequence.
  // Treat plain whitespace as a phrase link, but never cross punctuation.
  for(let i=0;i<units.length;i++){
    const a=units[i];
    if(a.type!=='hangul'||!a.coda)continue;
    let j=i+1,sawSpace=false;
    while(j<units.length&&units[j].type==='literal'&&/^\s$/u.test(units[j].char)){
      sawSpace=true;j++;
    }
    if(!sawSpace||j>=units.length||units[j].type!=='hangul')continue;
    const b=units[j],rules=ruleSets[i],nextRules=ruleSets[j];

    const beforeLiquidRep=representative(a.coda);
    if(['ㄱ','ㄷ','ㅂ','ㅁ','ㅇ'].includes(beforeLiquidRep)&&b.onset==='ㄹ'){
      b.onset='ㄴ';
      rules.push('liquid-to-nasal-before-obstruent');
      nextRules.push('liquid-to-nasal-before-obstruent');
    }

    const afterRep=representative(a.coda);
    if((b.onset==='ㄴ'||b.onset==='ㅁ')&&NASAL_AFTER[afterRep]){
      a.coda=NASAL_AFTER[afterRep];
      rules.push('nasal-assimilation');
      nextRules.push('nasal-assimilation');
    }

    const liquidRep=representative(a.coda);
    if(liquidRep==='ㄴ'&&b.onset==='ㄹ'){
      a.coda='ㄹ';
      rules.push('liquid-assimilation');
    }else if(liquidRep==='ㄹ'&&b.onset==='ㄴ'){
      a.coda='ㄹ';b.onset='ㄹ';
      rules.push('liquid-assimilation');
    }else if((liquidRep==='ㅁ'||liquidRep==='ㅇ')&&b.onset==='ㄹ'){
      b.onset='ㄴ';
      rules.push('liquid-assimilation');
    }
  }
  return ruleSets;
}

// Exact lexical overrides split a phrase into word-level conversion calls.
// Re-apply the licensed, surface-level nasal/liquid assimilation rules at plain
// whitespace boundaries so a lexical entry cannot suppress its neighbour's rule.
function applyPhraseBoundaryAssimilation(results,parts,map){
  const addRule=(trace,rule)=>{
    if(trace)trace.rules=[...new Set([...(trace.rules||[]),rule])];
  };
  const lastTrace=(result)=>[...(result?.trace||[])].reverse().find(item=>item.status!=='literal');
  const firstTrace=(result)=>(result?.trace||[]).find(item=>item.status!=='literal');
  const rewriteCoda=(result,oldCoda,newCoda,rule)=>{
    const oldTarget=mapCoda(map,oldCoda),newTarget=mapCoda(map,newCoda);
    const oldIpa=get(map,'coda',oldCoda)?.ipa||'',newIpa=get(map,'coda',newCoda)?.ipa||'';
    if(!oldTarget||!newTarget||!oldIpa||!newIpa)return false;
    const trace=lastTrace(result);
    if(!trace||!result.ukrainian.endsWith(oldTarget)||!result.ipa.endsWith(oldIpa)||!trace.output.endsWith(oldTarget)||!trace.ipa.endsWith(oldIpa))return false;
    result.ukrainian=result.ukrainian.slice(0,-oldTarget.length)+newTarget;
    result.ipa=result.ipa.slice(0,-oldIpa.length)+newIpa;
    trace.output=trace.output.slice(0,-oldTarget.length)+newTarget;
    trace.ipa=trace.ipa.slice(0,-oldIpa.length)+newIpa;
    addRule(trace,rule);
    return true;
  };
  const rewriteOnset=(result,oldOnset,newOnset,realizedLateral,rule)=>{
    const oldTarget=mapOnset(map,oldOnset),oldIpa=get(map,'onset',oldOnset)?.ipa||'';
    const newTarget=realizedLateral?mapCoda(map,'ㄹ'):mapOnset(map,newOnset);
    const newIpa=realizedLateral?(get(map,'coda','ㄹ')?.ipa||''):(get(map,'onset',newOnset)?.ipa||'');
    if(!oldTarget||!newTarget||!oldIpa||!newIpa)return false;
    const trace=firstTrace(result);
    if(!trace||!result.ukrainian.startsWith(oldTarget)||!result.ipa.startsWith(oldIpa)||!trace.output.startsWith(oldTarget)||!trace.ipa.startsWith(oldIpa))return false;
    result.ukrainian=newTarget+result.ukrainian.slice(oldTarget.length);
    result.ipa=newIpa+result.ipa.slice(oldIpa.length);
    trace.output=newTarget+trace.output.slice(oldTarget.length);
    trace.ipa=newIpa+trace.ipa.slice(oldIpa.length);
    addRule(trace,rule);
    return true;
  };

  for(let i=0;i<parts.length-2;i++){
    if(!/^[가-힣]+$/u.test(parts[i])||!/^\s+$/u.test(parts[i+1])||!/^[가-힣]+$/u.test(parts[i+2]))continue;
    const previous=results[i],next=results[i+2];
    if(!previous||!next||previous.status==='unresolved'||next.status==='unresolved'||previous.issues?.length||next.issues?.length)continue;
    const previousText=previous.surfaceHangul||parts[i],nextText=next.surfaceHangul||parts[i+2];
    const last=[...previousText].at(-1),first=[...nextText][0];
    const left=last?decompose(last):null,right=first?decompose(first):null;
    if(!left?.coda||!right)continue;
    const leftRep=representative(left.coda),rightOnset=right.onset;

    if(['ㄴ','ㅁ'].includes(rightOnset)&&NASAL_AFTER[leftRep]){
      rewriteCoda(previous,leftRep,NASAL_AFTER[leftRep],'nasal-assimilation');
      addRule(firstTrace(next),'nasal-assimilation');
      continue;
    }

    if(rightOnset==='ㄹ'&&['ㄱ','ㄷ','ㅂ','ㅁ','ㅇ'].includes(leftRep)){
      const obstruent=['ㄱ','ㄷ','ㅂ'].includes(leftRep);
      const rule=obstruent?'liquid-to-nasal-before-obstruent':'liquid-assimilation';
      rewriteOnset(next,'ㄹ','ㄴ',false,rule);
      addRule(lastTrace(previous),rule);
      if(NASAL_AFTER[leftRep]){
        rewriteCoda(previous,leftRep,NASAL_AFTER[leftRep],'nasal-assimilation');
        addRule(firstTrace(next),'nasal-assimilation');
      }
      continue;
    }

    if(leftRep==='ㄴ'&&rightOnset==='ㄹ'){
      rewriteCoda(previous,'ㄴ','ㄹ','liquid-assimilation');
      rewriteOnset(next,'ㄹ','ㄹ',true,'liquid-assimilation');
      continue;
    }

    if(leftRep==='ㄹ'&&rightOnset==='ㄴ'){
      rewriteOnset(next,'ㄴ','ㄹ',true,'liquid-assimilation');
      addRule(lastTrace(previous),'liquid-assimilation');
    }
  }
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
  const variants=entry.alternate_surface_hangul? [{
    surface:entry.alternate_surface_hangul,
    ukrainian:(entry.alternate_target_syllables||'').split('|').join(''),
    ipa:(entry.alternate_ipa_syllables||'').split('|').join(' '),
    note:entry.variant_note||'',
    status:targetReview?'lexical-review':'lexical'
  }]:[];
  return {
    source:text,
    surfaceHangul:entry.surface_hangul||'',
    ukrainian:targets.join(''),
    ipa:ipas.join(' '),
    analysis,
    variants,
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
        if(lexicon.has(part)){
          const entry=lexicon.get(part);
          // Some sourced surface forms are retained as reference data without
          // bypassing the general rule engine. This preserves contextual rule
          // traces for independently tested rules (e.g. §18 nasalisation).
          if(entry.target_status==='surface-only'){
            const result=convertText(part,map,lexicon,true);
            result.surfaceHangul=entry.surface_hangul||'';
            return result;
          }
          return lexicalResult(part,entry);
        }
        return convertText(part,map,lexicon,true);
      });
      applyPhraseBoundaryAssimilation(results,parts,map);
      const issues=results.flatMap(r=>r.issues);
      const variants=results.flatMap((r,i)=>(r.variants||[]).map(v=>({
        ...v,
        source:r.source,
        ukrainian:results.map((other,j)=>j===i?v.ukrainian:other.ukrainian).join(''),
        ipa:results.map((other,j)=>j===i?v.ipa:other.ipa).join('')
      })));
      return {
        source:text,
        surfaceHangul:results.every(r=>r.surfaceHangul)?results.map(r=>r.surfaceHangul).join(''):'',
        ukrainian:results.map(r=>r.ukrainian).join(''),
        ipa:results.map(r=>r.ipa).join(''),
        analysis:results.map(r=>r.analysis).join(''),
        trace:results.flatMap(r=>r.trace),
        variants,
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
    if(u.__palatalizationUnlicensed){
      if(u.__palatalizationUnlicensed==='left')issues.push(u.char+': §17 palatalization requires a verified formal-morpheme boundary; add a sourced lexical entry or morphological license.');
      output[i]='⟦'+u.char+'⟧';
      ipa[i]='';
      trace[i]={source:u.char,status:'unresolved',rules:applied,output:output[i],ipa:''};
      continue;
    }
    if(u.__hDeletionUnlicensed){
      if(u.__hDeletionUnlicensed==='left')issues.push(u.char+': §12(4) ㅎ deletion requires a verified vowel-initial ending/suffix; add a sourced lexical pronunciation entry.');
      output[i]='⟦'+u.char+'⟧';
      ipa[i]='';
      trace[i]={source:u.char,status:'unresolved',rules:applied,output:output[i],ipa:''};
      continue;
    }
    if(u.__complexLiaisonUnlicensed){
      if(u.__complexLiaisonUnlicensed==='left')issues.push(u.char+': complex-coda liaison differs between formal and substantive morphemes (§§13–15); add a sourced lexical pronunciation entry.');
      output[i]='⟦'+u.char+'⟧';
      ipa[i]='';
      trace[i]={source:u.char,status:'unresolved',rules:applied,output:output[i],ipa:''};
      continue;
    }
    if(u.__complexHAspirationUnlicensed){
      if(u.__complexHAspirationUnlicensed==='left')issues.push(u.char+': §12 complex-coda + ㅎ aspiration depends on the licensed morphophonemic pattern; add a sourced lexical pronunciation entry.');
      output[i]='⟦'+u.char+'⟧';
      ipa[i]='';
      trace[i]={source:u.char,status:'unresolved',rules:applied,output:output[i],ipa:''};
      continue;
    }
    if(u.__substantiveLiaisonUnlicensed){
      if(u.__substantiveLiaisonUnlicensed==='left')issues.push(u.char+': coda representative changes under §15 before ㅏ/ㅓ/ㅗ/ㅜ/ㅟ, unlike formal-morpheme liaison; add a sourced lexical pronunciation entry.');
      output[i]='⟦'+u.char+'⟧';
      ipa[i]='';
      trace[i]={source:u.char,status:'unresolved',rules:applied,output:output[i],ipa:''};
      continue;
    }
    if(u.__rieulGiyeokUnlicensed){
      if(u.__rieulGiyeokUnlicensed==='left')issues.push(u.char+': written ㄺ before ㄱ may follow the §11 stem exception or general coda simplification; add a sourced lexical pronunciation entry.');
      output[i]='⟦'+u.char+'⟧';
      ipa[i]='';
      trace[i]={source:u.char,status:'unresolved',rules:applied,output:output[i],ipa:''};
      continue;
    }
    // Standard Korean pronunciation: ㅢ with a consonant onset is [i]
    // (e.g. 희망 [히망]). ㅇ+ㅢ defaults to [ɰi]; optional readings are
    // represented only where lexical/morphological context is evidenced.
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
    const liquid=onset==='ㄹ'&&['ㄴ','ㄹ','ㅁ','ㅇ'].includes(previousCoda);
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
    surfaceHangul:'',
    ukrainian:output.join(''),
    ipa:renderStructured(units,ipa,' '),
    analysis:renderStructured(units,analysis,' · '),
    trace,
    issues,
    status:issues.length?'unresolved':trace.some(x=>x?.status==='contextual')?'contextual':'canonical'
  };
}

export {parseCsv,decompose};