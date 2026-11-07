/**
 * Lexical result shaping and vowel variants.
 */
import { get, renderStructured, J_VOWELS, decompose } from './engine_shared.js';
import { ipaSyllableToUkrainian, ipaSyllablesToUkrainian, IPA_TO_UKRAINIAN } from './engine_ipa.js';

function renderLexicalIpa(text, ipas){
  // IPA entries are syllable-aligned. Use dots inside one eojeol and preserve
  // literal source whitespace between eojeols; never infer a boundary from IPA.
  const tokens=text.match(/\s+|[^\s]+/gu)||[];
  let index=0;
  return tokens.map((token,tokenIndex)=>{
    if(/^\s+$/u.test(token))return token;
    if(/^[가-힣]+$/u.test(token)){
      const count=[...token].length;
      const syllables=ipas.slice(index,index+count);
      index+=count;
      return syllables.join('.');
    }
    const minimumForToken=Math.max(1,[...token].filter(ch=>/[가-힣]/u.test(ch)).length);
    const requiredAfter=tokens.slice(tokenIndex+1)
      .filter(next=>!(/^\s+$/u.test(next)))
      .reduce((sum,next)=>sum+Math.max(1,[...next].filter(ch=>/[가-힣]/u.test(ch)).length),0);
    const count=Math.max(minimumForToken,ipas.length-index-requiredAfter);
    const syllables=ipas.slice(index,index+count);
    index+=count;
    return syllables.join('.');
  }).join('');
}

export function lexicalResult(text,entry,options={}){
  if(entry.ipa_adjudication_status==='diagnostic_only_unresolved_pronunciation'){
    const syllables=[...text];
    const alternateSurface=entry.alternate_surface_hangul||'';
    return {
      source:text,
      surfaceHangul:entry.surface_hangul||'',
      pronunciation_status:'unresolved',
      ukrainian:'',
      ipa:'',
      analysis:text+' → '+(entry.surface_hangul||'')+' (independent IPA adjudication required)',
      variants:alternateSurface?[{
        source:text,
        surface:alternateSurface,
        ukrainian:'',
        ipa:'',
        note:entry.variant_note||'Source-attested Hangul variant; IPA requires independent adjudication.',
        status:'unresolved'
      }]:[],
      trace:syllables.map(ch=>({
        source:ch,
        status:'unresolved',
        rules:['lexical-pronunciation','independent-ipa-adjudication-required'],
        output:'',
        ipa:''
      })),
      issues:[text+': Korean surface readings are source-attested, but IPA has not been independently adjudicated; IPA and Ukrainian output are withheld.'],
      target_status:'unavailable',
      status:'unresolved'
    };
  }
  const ipas=entry.ipa_syllables.split('|');
  const mappedTargets=ipas.map(ipa=>ipaSyllableToUkrainian(ipa,{allowProvisional:true}));
  const targets=mappedTargets.map((item,i)=>item.unknown?'⟦'+ipas[i]+'⟧':item.text);
  const targetIssues=mappedTargets.flatMap((item,i)=>item.unknown
    ?[text+': IPA syllable "'+ipas[i]+'" contains an unmapped segment "'+item.unknown+'"; add an explicit Ukrainian mapping or correct the IPA.']:[]
  );
  const hasSyllableCountMismatch=/^[가-힣]+$/u.test(text)&&ipas.length!==[...text].length;
  if(hasSyllableCountMismatch){
    targetIssues.push(text+': lexical IPA has '+ipas.length+' syllable entries for '+[...text].length+' Hangul syllables; align the IPA segmentation before conversion.');
  }
  if(entry.input_kind==='mixed-script'){
    let target=targets.join('');
    if(/\s/u.test(text)){
      let targetIndex=0;
      target='';
      for(const token of (text.match(/\s+|[^\s]+/gu)||[])){
        if(/^\s+$/u.test(token)){target+=token;continue;}
        const syllableCount=/^[가-힣]+$/u.test(token)?[...token].length:1;
        target+=targets.slice(targetIndex,targetIndex+syllableCount).join('');
        targetIndex+=syllableCount;
      }
      target+=targets.slice(targetIndex).join('');
    }
    const ipa=renderLexicalIpa(text,ipas);
    return {
      source:text,
      surfaceHangul:entry.surface_hangul||'',
      pronunciation_status:'resolved',
      ukrainian:target+(hasSyllableCountMismatch?'⟦IPA-syllable-count⟧':''),
      ipa,
      analysis:text+' → '+(entry.surface_hangul||'')+' (sourced lexical reading)',
      variants:[],
      trace:[{source:text,status:targetIssues.length?'unresolved':'lexical-review',rules:targetIssues.length?['lexical-pronunciation','ipa-to-ukrainian-unmapped-segment']:['lexical-pronunciation','ukrainian-target-provisional'],output:target,ipa}],
      issues:targetIssues,
      status:targetIssues.length?'unresolved':'lexical-review'
    };
  }
  const syllables=[...text];
  const analysis=syllables.map(ch=>{
    const d=decompose(ch);
    return d?`${ch}[${d.onset}+${d.vowel}${d.coda?'+'+d.coda:''}]`:ch;
  }).join(' · ');
  const targetReview=entry.target_status==='provisional'||mappedTargets.some(item=>item.status==='provisional');
  const candidateOnly=['variant-aware-research','kozak-research-only'].includes(entry.input_kind)&&entry.target_status==='provisional';
  // Group-level Korean /ɛ/-/e/ merger evidence is exposed as an optional
  // research candidate for ㅐ, including lexicon-backed words. Never infer
  // speaker identity or add/remove vowel length; preserve any existing ː.
  const researchVowelVariants=[];
  const sourceSyllables=[...text];
  if(options.ipaProfile==='clippyfirst-korean-broad-v1')for(let i=0;i<ipas.length;i++){
    if(decompose(sourceSyllables[i]||'')?.vowel!=='ㅐ')continue;
    const primary=ipas[i].includes('ɛ')?'ɛ':ipas[i].includes('e')?'e':'';
    if(!primary)continue;
    const alternateIpas=ipas.slice();
    alternateIpas[i]=alternateIpas[i].replace(primary,primary==='ɛ'?'e':'ɛ');
    const mapped=alternateIpas.map(ipa=>ipaSyllableToUkrainian(ipa,{allowProvisional:true}));
    if(mapped.some(item=>item.unknown))continue;
    researchVowelVariants.push({
      source:text,
      surface:entry.surface_hangul||text,
      ukrainian:mapped.map(item=>item.text??'').join(''),
      ipa:renderLexicalIpa(text,alternateIpas),
      note:'Research-only optional [ɛ]~[e] realization of ㅐ; group-level Korean mid-front-vowel merger/weak-distinction evidence (Lee & Cho 2021; Eychenne & Jang 2015; Lee 2023, SRC-LEE-2023-SEOUL-MID-FRONT-VOWEL-POSITION). Lee (2023) finds the merger incomplete and position-sensitive. Speaker-specific quality is unknown; canonical broad output and any existing vowel length are preserved.',
      status:mapped.some(item=>item.status==='provisional')?'lexical-review':targetReview?'lexical-review':'lexical',
      target_status:mapped.some(item=>item.status==='unavailable'||item.unknown)?'unavailable':targetReview||mapped.some(item=>item.status==='provisional')?'provisional':'model-selected'
    });
  }
  return {
    source:text,
    surfaceHangul:entry.surface_hangul||'',
    pronunciation_status:'resolved',
    ukrainian:candidateOnly?'':targets.join('')+(hasSyllableCountMismatch?'⟦IPA-syllable-count⟧':''),
    candidate_ukrainian:candidateOnly?targets.join(''):null,
    candidate_status:candidateOnly?'provisional':null,
    ipa:renderLexicalIpa(text,ipas),
    analysis:analysis+' → lexical',
    variants:(()=>{
      const alternateIpas=(entry.alternate_ipa_syllables||'').split('|');
      const alternateSurface=entry.alternate_surface_hangul||'';
      if(!alternateSurface||!entry.alternate_ipa_syllables||alternateIpas.some(value=>!value))return researchVowelVariants;
      const mapped=alternateIpas.map(ipa=>ipaSyllableToUkrainian(ipa,{allowProvisional:true}));
      if(mapped.some(item=>item.unknown))return researchVowelVariants;
      const variants=[{
        source:text,
        surface:alternateSurface,
        ukrainian:candidateOnly?'':mapped.map(item=>item.text).join(''),
        candidate_ukrainian:candidateOnly?mapped.map(item=>item.text).join(''):null,
        candidate_status:candidateOnly?'provisional':null,
        ipa:renderLexicalIpa(text,alternateIpas),
        note:entry.variant_note||entry.rule_notes||'NIKL-listed alternate pronunciation; Ukrainian rendering remains provisional.',
        status:targetReview?'lexical-review':'lexical',
        target_status:targetReview?'provisional':'model-selected'
      }];
      return [...variants,...researchVowelVariants];
    })(),
    trace:syllables.map((ch,i)=>({
      source:ch,
      status:mappedTargets[i]?.unknown?'unresolved':targetReview?'lexical-review':'lexical',
      rules:mappedTargets[i]?.unknown
        ?['lexical-pronunciation','ipa-to-ukrainian-unmapped-segment']
        :targetReview
          ?['lexical-pronunciation','ukrainian-target-provisional']
          :['lexical-pronunciation'],
      output:candidateOnly?'':targets[i],
      candidateOutput:candidateOnly?targets[i]:null,
      candidateStatus:candidateOnly?'provisional':null,
      ipa:ipas[i]
    })),
    issues:targetIssues,
    target_status:targetIssues.length?'unavailable':targetReview?'provisional':'model-selected',
    status:targetIssues.length?'unresolved':targetReview?'lexical-review':'lexical'
  };
}

export function firstSyllableInWord(units,index){
  for(let i=index-1;i>=0;i--){
    if(units[i].type==='literal')return true;
    if(units[i].type==='hangul')return false;
  }
  return true;
}

const NIKL_GENITIVE_UI_PARTICLE_FORMS=new Set(['그놈의','자신의']);
function wordFormAt(units,index){
  let start=index,end=index;
  while(start>0&&units[start-1].type==='hangul')start--;
  while(end+1<units.length&&units[end+1].type==='hangul')end++;
  return units.slice(start,end+1).map(unit=>unit.char).join('');
}

export function genericVowelVariants(text,units,originalUnits,ipa,output,status,includeBroadAllophones=false){
  const sites=[];
  for(let i=0;i<originalUnits.length;i++){
    const syllable=originalUnits[i];
    const vowel=syllable.vowel;
    let primary='',alternate='',section='§4',genitiveParticle=false;
    if(vowel==='ㅚ'){primary='ø';alternate='we';}
    else if(vowel==='ㅟ'){primary='y';alternate='wi';}
    else if(vowel==='ㅖ'&&syllable.onset!=='ㅇ'&&syllable.onset!=='ㄹ'){
      primary='je';alternate='e';section='§5';
    }
    else if(vowel==='ㅐ'){
      // Group-level Korean /ɛ/-/e/ merger evidence supports an optional
      // research candidate only; preserve whichever broad vowel is canonical.
      primary=ipa[i]?.includes('ɛ')?'ɛ':ipa[i]?.includes('e')?'e':'';
      alternate=primary==='ɛ'?'e':primary==='e'?'ɛ':'';
      section='research /ɛ–e/ merger';
    }
    else if(vowel==='ㅢ'&&Boolean(units[i]?.__liaison)){
      genitiveParticle=NIKL_GENITIVE_UI_PARTICLE_FORMS.has(wordFormAt(originalUnits,i));
      primary='ɰi';alternate=genitiveParticle?'e':'i';section='§5';
    }
    if(!alternate||!ipa[i]||!ipa[i].includes(primary))continue;
    sites.push({index:i,vowel,primary,alternate,section,genitiveParticle});
  }
  if(status==='unresolved')return[];
  const variants=[];
  if(sites.length){
    const masks=sites.length<=3
      ?Array.from({length:(1<<sites.length)-1},(_,i)=>i+1)
      :sites.map((_,i)=>1<<i);
    variants.push(...masks.map(mask=>{
      const changed=sites.filter((_,i)=>(mask&(1<<i))!==0);
      const alternateIpa=ipa.slice();
      for(const site of changed){
        alternateIpa[site.index]=alternateIpa[site.index].replace(site.primary,site.alternate);
      }
      const alternateMapped=alternateIpa.map(value=>ipaSyllableToUkrainian(value,{allowProvisional:true}));
      const alternateOutput=alternateMapped.map(item=>item.text??'');
      const labels=changed.map(site=>{
        if(site.vowel==='ㅚ')return 'ㅚ [we]';
        if(site.vowel==='ㅟ')return 'ㅟ [wi]';
        if(site.vowel==='ㅐ')return 'ㅐ ['+site.alternate+']';
        if(site.vowel==='ㅖ')return 'ㅖ [e]';
        return site.genitiveParticle?'관형격 조사 의 [e]':'비초성 ㅢ [i]';
      });
      const sections=[...new Set(changed.map(site=>site.section))].join('/');
      const researchMerger=changed.some(site=>site.section==='research /ɛ–e/ merger');
      const note=researchMerger
        ?'Research-only optional [ɛ]~[e] realization of ㅐ; group-level Korean mid-front-vowel merger/weak-distinction evidence (Lee & Cho 2021; Eychenne & Jang 2015; Lee 2023, SRC-LEE-2023-SEOUL-MID-FRONT-VOWEL-POSITION). Lee (2023) finds the merger incomplete and position-sensitive. Speaker-specific quality is unknown; canonical broad output is unchanged.'
        :sites.length<=3
          ?sections+': дозволена альтернативна вимова '+labels.join(' + ')+'; корейське написання не змінюється.'
          :sections+': альтернативна вимова '+labels.join(' + ')+'; інші необрані голосні зберігають основне читання, написання не змінюється.';
      return{
        source:text,
        surface:text,
        ukrainian:alternateOutput.join(''),
        ipa:renderStructured(units,alternateIpa,'.'),
        note,
        status:alternateMapped.some(item=>item.status==='provisional')?'lexical-review':status,
        target_status:alternateMapped.some(item=>item.status==='unavailable'||item.unknown)?'unavailable':alternateMapped.some(item=>item.status==='provisional')?'provisional':'model-selected'
      };
    }));
  }

  if(includeBroadAllophones){
    // NIKL's 2005 usage column records the exact loanword 게임 with both
    // lenis [k] and fortis [k͈] initial realizations. Keep [k] canonical.
    for(let i=0;i<originalUnits.length;i++){
      const syllable=originalUnits[i];
      if(wordFormAt(originalUnits,i)!=='게임'||syllable.char!=='게'||syllable.onset!=='ㄱ'||!ipa[i]?.startsWith('k'))continue;
      const alternateIpa=ipa.slice();
      alternateIpa[i]='k͈'+alternateIpa[i].slice(1);
      const mapped=alternateIpa.map(value=>ipaSyllableToUkrainian(value,{allowProvisional:true}));
      variants.push({
        source:text,surface:text,ukrainian:mapped.map(item=>item.text??'').join(''),
        ipa:renderStructured(units,alternateIpa,'.'),
        note:'Research-only optional [k͈] onset in the exact loanword 게임, recorded alongside [k] by NIKL\'s 2005 usage column (SRC-NIKL-LOANWORD-GAME-2005); canonical broad /k/ is preserved and speaker realization is unknown.',
        status:mapped.some(item=>item.status==='provisional')?'lexical-review':status,
        target_status:mapped.some(item=>item.status==='unavailable'||item.unknown)?'unavailable':mapped.some(item=>item.status==='provisional')?'provisional':'model-selected'
      });
    }

    // Korean ㅟ has a documented [ɥi] realization in addition to [y]/[wi].
    // Keep [y] canonical and expose the phonetic realization as an alternative.
    for(const site of sites.filter(item=>item.vowel==='ㅟ')){
      const alternateIpa=ipa.slice();
      alternateIpa[site.index]=alternateIpa[site.index].replace(site.primary,'ɥi');
      const mapped=alternateIpa.map(value=>ipaSyllableToUkrainian(value,{allowProvisional:true}));
      variants.push({
        source:text,
        surface:text,
        ukrainian:mapped.map(item=>item.text??'').join(''),
        ipa:renderStructured(units,alternateIpa,'.'),
        note:'Korean ㅟ may be realized as [ɥi] in phonetic descriptions; canonical [y] and [wi] are retained.',
        status:mapped.some(item=>item.status==='provisional')?'lexical-review':status,
        target_status:mapped.some(item=>item.status==='unavailable'||item.unknown)?'unavailable':mapped.some(item=>item.status==='provisional')?'provisional':'model-selected'
      });
    }
  }

  // Lee's Seoul Korean IPA description also supports [ç] before /i,j/ and
  // [x] before /u/. Keep broad [h] canonical and expose scoped variants.
  if(includeBroadAllophones){
    for(let i=0;i<originalUnits.length;i++){
      const syllable=originalUnits[i];
      const alternateInitial=['ㅣ','ㅑ','ㅒ','ㅕ','ㅖ','ㅛ','ㅠ'].includes(syllable.vowel)
        ?'ç':syllable.vowel==='ㅜ'?'x':'';
      if(syllable.onset!=='ㅎ'||!alternateInitial||!ipa[i]?.startsWith('h'))continue;
      const alternateIpa=ipa.slice();
      alternateIpa[i]=alternateInitial+alternateIpa[i].slice(1);
      const mapped=alternateIpa.map(value=>ipaSyllableToUkrainian(value,{allowProvisional:true}));
      variants.push({
        source:text,
        surface:text,
        ukrainian:mapped.map(item=>item.text??'').join(''),
        ipa:renderStructured(units,alternateIpa,'.'),
        note:'Optional Seoul Korean /h/ allophone ['+alternateInitial+'] in this vowel context; broad canonical [h] is preserved.',
        status:mapped.some(item=>item.status==='provisional')?'lexical-review':status,
        target_status:mapped.some(item=>item.status==='unavailable'||item.unknown)?'unavailable':mapped.some(item=>item.status==='provisional')?'provisional':'model-selected'
      });
    }
  }

  // Kang (2010) supports [ɕ] only as a research candidate for lenis /s/
  // before /i, ye, ya/ (ㅣ, ㅖ, ㅑ). Do not extend it to /jʌ, jo, ju/ or /s͈/.
  if(includeBroadAllophones){
    const palatalNuclei=new Set(['ㅣ','ㅑ','ㅖ']);
    for(let i=0;i<originalUnits.length;i++){
      const sourceSyllable=originalUnits[i];
      const surfaceSyllable=units[i];
      // Inspect the post-rule onset so coda-ㅅ resyllabification (e.g. 멋있어)
      // receives the same optional variant as an orthographic onset ㅅ.
      if(surfaceSyllable.onset!=='ㅅ'||!palatalNuclei.has(sourceSyllable.vowel)||!ipa[i]?.startsWith('s'))continue;
      const alternateIpa=ipa.slice();
      alternateIpa[i]='ɕ'+alternateIpa[i].slice(1);
      const mapped=alternateIpa.map(value=>ipaSyllableToUkrainian(value,{allowProvisional:true}));
      variants.push({
        source:text,
        surface:text,
        ukrainian:mapped.map(item=>item.text??'').join(''),
        ipa:renderStructured(units,alternateIpa,'.'),
        note:'Research-only optional [ɕ] candidate for lenis /s/ before /i, ye, ya/ (Kang 2010); coarticulation evidence, not a categorical rule. Broad canonical /s/ is preserved.',
        status:mapped.some(item=>item.status==='provisional')?'lexical-review':status,
        target_status:mapped.some(item=>item.status==='unavailable'||item.unknown)?'unavailable':mapped.some(item=>item.status==='provisional')?'provisional':'model-selected'
      });
    }
  }
  if(includeBroadAllophones){
    // S018: intervocalic /h/ may surface as [ɸ]. Keep [h] canonical.
    for(let i=1;i<originalUnits.length;i++){
      const syllable=originalUnits[i];
      const previous=originalUnits[i-1];
      if(syllable.onset!=='ㅎ'||previous.coda!==''||!ipa[i]?.startsWith('h'))continue;
      const alternateIpa=ipa.slice();
      alternateIpa[i]='ɸ'+alternateIpa[i].slice(1);
      const mapped=alternateIpa.map(value=>ipaSyllableToUkrainian(value,{allowProvisional:true}));
      variants.push({
        source:text,surface:text,ukrainian:mapped.map(item=>item.text??'').join(''),
        ipa:renderStructured(units,alternateIpa,'.'),
        note:'Optional Seoul Korean [ɸ] for /h/ between voiced sounds (S018); broad canonical [h] is preserved.',
        status:mapped.some(item=>item.status==='provisional')?'lexical-review':status,
        target_status:mapped.some(item=>item.status==='unavailable'||item.unknown)?'unavailable':mapped.some(item=>item.status==='provisional')?'provisional':'model-selected'
      });
    }

    // S018: /l/ may be [ɭ] intervocalically or before /i,j/. Keep
    // the broad canonical liquid unchanged and expose this as a variant.
    const palatalLiquidNuclei=new Set(['ㅣ','ㅑ','ㅒ','ㅕ','ㅖ','ㅛ','ㅠ']);
    for(let i=0;i<originalUnits.length;i++){
      const syllable=originalUnits[i];
      if(syllable.onset!=='ㄹ'||!ipa[i]||!(/^(ɾ|l)/u).test(ipa[i]))continue;
      const previous=originalUnits[i-1];
      const sameWordPredecessor=Boolean(previous)&&!firstSyllableInWord(units,i);
      const afterLiquidCoda=sameWordPredecessor&&previous.coda==='ㄹ';
      const intervocalic=sameWordPredecessor&&previous.coda==='';
      const beforeFrontGlide=sameWordPredecessor&&palatalLiquidNuclei.has(syllable.vowel);
      if(afterLiquidCoda||!(intervocalic||beforeFrontGlide))continue;
      const alternateIpa=ipa.slice();
      alternateIpa[i]='ɭ'+alternateIpa[i].slice(1);
      const mapped=alternateIpa.map(value=>ipaSyllableToUkrainian(value,{allowProvisional:true}));
      variants.push({
        source:text,surface:text,ukrainian:mapped.map(item=>item.text??'').join(''),
        ipa:renderStructured(units,alternateIpa,'.'),
        note:'Optional Seoul Korean [ɭ] for /l/ intervocalically or before /i,j/ (S018); broad canonical liquid is preserved.',
        status:mapped.some(item=>item.status==='provisional')?'lexical-review':status,
        target_status:mapped.some(item=>item.status==='unavailable'||item.unknown)?'unavailable':mapped.some(item=>item.status==='provisional')?'provisional':'model-selected'
      });
    }
  }

  return variants;
}