/**
 * Lexical result shaping and vowel variants.
 */
import { get, renderStructured, J_VOWELS, decompose } from './engine_shared.js';
import { ipaSyllableToUkrainian, ipaSyllablesToUkrainian, IPA_TO_UKRAINIAN } from './engine_ipa.js';

export function lexicalResult(text,entry){
  const ipas=entry.ipa_syllables.split('|');
  const mappedTargets=ipas.map(ipaSyllableToUkrainian);
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
    const ipa=ipas.join(' ');
    return {
      source:text,
      surfaceHangul:entry.surface_hangul||'',
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
  const targetReview=entry.target_status==='provisional';
  return {
    source:text,
    surfaceHangul:entry.surface_hangul||'',
    ukrainian:targets.join('')+(hasSyllableCountMismatch?'⟦IPA-syllable-count⟧':''),
    ipa:ipas.join(' '),
    analysis:analysis+' → lexical',
    variants:(()=>{
      const alternateIpas=(entry.alternate_ipa_syllables||'').split('|');
      const alternateSurface=entry.alternate_surface_hangul||'';
      if(!alternateSurface||!entry.alternate_ipa_syllables||alternateIpas.some(value=>!value))return [];
      const mapped=alternateIpas.map(ipaSyllableToUkrainian);
      if(mapped.some(item=>item.unknown))return [];
      return [{
        source:text,
        surface:alternateSurface,
        ukrainian:mapped.map(item=>item.text).join(''),
        ipa:alternateIpas.join(' '),
        note:entry.variant_note||entry.rule_notes||'NIKL-listed alternate pronunciation; Ukrainian rendering remains provisional.',
        status:targetReview?'lexical-review':'lexical'
      }];
    })(),
    trace:syllables.map((ch,i)=>({
      source:ch,
      status:mappedTargets[i]?.unknown?'unresolved':targetReview?'lexical-review':'lexical',
      rules:['lexical-pronunciation'],
      output:targets[i],
      ipa:ipas[i]
    })),
    issues:targetIssues,
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

export function genericVowelVariants(text,units,originalUnits,ipa,output,status){
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
  if(!sites.length||status==='unresolved')return[];
  const masks=sites.length<=3
    ?Array.from({length:(1<<sites.length)-1},(_,i)=>i+1)
    :sites.map((_,i)=>1<<i);
  return masks.map(mask=>{
    const changed=sites.filter((_,i)=>(mask&(1<<i))!==0);
    const alternateIpa=ipa.slice();
    for(const site of changed){
      alternateIpa[site.index]=alternateIpa[site.index].replace(site.primary,site.alternate);
    }
    const alternateOutput=alternateIpa.map(value=>ipaSyllableToUkrainian(value).text);
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
      ipa:renderStructured(units,alternateIpa,' '),
      note,
      status
    };
  });
}

