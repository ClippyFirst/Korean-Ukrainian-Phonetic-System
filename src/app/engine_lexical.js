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

export function lexicalResult(text,entry){
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
  const candidateOnly=entry.input_kind==='variant-aware-research'&&entry.target_status==='provisional';
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
      if(!alternateSurface||!entry.alternate_ipa_syllables||alternateIpas.some(value=>!value))return [];
      const mapped=alternateIpas.map(ipa=>ipaSyllableToUkrainian(ipa,{allowProvisional:true}));
      if(mapped.some(item=>item.unknown))return [];
      return [{
        source:text,
        surface:alternateSurface,
        ukrainian:mapped.map(item=>item.text).join(''),
        ipa:renderLexicalIpa(text,alternateIpas),
        note:entry.variant_note||entry.rule_notes||'NIKL-listed alternate pronunciation; Ukrainian rendering remains provisional.',
        status:targetReview?'lexical-review':'lexical'
      }];
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

export function genericVowelVariants(text,units,originalUnits,ipa,output,status,includeBroadAllophones=false){
  const sites=[];
  for(let i=0;i<originalUnits.length;i++){
    const syllable=originalUnits[i];
    const vowel=syllable.vowel;
    let primary='',alternate='',section='§4';
    if(vowel==='ㅚ'){primary='ø';alternate='we';}
    else if(vowel==='ㅟ'){primary='y';alternate='wi';}
    else if(vowel==='ㅖ'&&syllable.onset!=='ㅇ'&&syllable.onset!=='ㄹ'){
      primary='je';alternate='e';section='§5';
    }
    else if(vowel==='ㅢ'&&syllable.onset==='ㅇ'&&!firstSyllableInWord(units,i)){
      primary='ɰi';alternate='i';section='§5';
    }
    if(!alternate||!ipa[i]||!ipa[i].includes(primary))continue;
    sites.push({index:i,vowel,primary,alternate,section});
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
        if(site.vowel==='ㅖ')return 'ㅖ [e]';
        return '비초성 ㅢ [i]';
      });
      const sections=[...new Set(changed.map(site=>site.section))].join('/');
      const note=sites.length<=3
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

  // Lee's Seoul Korean IPA description and Kang (2010) support [ɕ] as a
  // lenis /s/ allophone before /i/ and selected /j/-initial diphthongs.
  // Keep the broad canonical /s/ and fortis /s͈/ unchanged.
  if(includeBroadAllophones){
    const palatalNuclei=new Set(['ㅣ','ㅑ','ㅒ','ㅕ','ㅖ','ㅛ','ㅠ']);
    for(let i=0;i<originalUnits.length;i++){
      const syllable=originalUnits[i];
      if(syllable.onset!=='ㅅ'||!palatalNuclei.has(syllable.vowel)||!ipa[i]?.startsWith('s'))continue;
      const alternateIpa=ipa.slice();
      alternateIpa[i]='ɕ'+alternateIpa[i].slice(1);
      const mapped=alternateIpa.map(value=>ipaSyllableToUkrainian(value,{allowProvisional:true}));
      variants.push({
        source:text,
        surface:text,
        ukrainian:mapped.map(item=>item.text??'').join(''),
        ipa:renderStructured(units,alternateIpa,'.'),
        note:'Optional [ɕ] allophone of lenis /s/ before /i/ or a Lee (1999)-described /j/-initial diphthong; broad canonical /s/ is preserved.',
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