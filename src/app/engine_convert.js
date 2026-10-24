/**
 * Main convertText pipeline.
 */
import {
  parseCsv, decompose, compose, createMap, get, isHangulUnit, nextHangul, prevHangul,
  representative, isJamoChar, isPreservableIpaLiteral, renderStructured, J_VOWELS, CODAS, ONSETS, VOWELS,
} from './engine_shared.js';
import { applyContextualRules } from './engine_rules_ctx.js';
import { applyPhraseBoundaryAssimilation } from './engine_rules_phrase.js';
import { ipaSyllableToUkrainian, ipaSyllablesToUkrainian, ipaTargetForSource, IPA_TO_UKRAINIAN, traceIpaMappingDetailed } from './engine_ipa.js';
import { lexicalResult, firstSyllableInWord, genericVowelVariants } from './engine_lexical.js';
import { practicalStatusForUnit, softStatusForUnit } from './soft_morphology.js';

function ipaSafeLiteral(value){return [...value].filter(isPreservableIpaLiteral).join('');}

export function convertText(text,map,lexicon=new Map(),skipLexicon=false,options={}){
  const morphologyMode=options.morphologyMode==='practical'?'practical':options.morphologyMode==='soft'?'soft':'strict';
  const practicalOn=morphologyMode==='practical';
  const preserveUnresolvedSource=options.preserveUnresolvedSource===true;
  if(!skipLexicon&&lexicon.size){
    const mixedKeys=[...lexicon.keys()].filter(key=>/[^가-힣]/u.test(key)).sort((a,b)=>b.length-a.length);
    const parts=[];
    let cursor=0;
    while(cursor<text.length){
      const exactKey=mixedKeys.find(key=>text.startsWith(key,cursor));
      if(exactKey){parts.push(exactKey);cursor+=exactKey.length;continue;}
      const nextKeyPositions=mixedKeys.map(key=>text.indexOf(key,cursor)).filter(position=>position>=0);
      const nextKey=nextKeyPositions.length?Math.min(...nextKeyPositions):text.length;
      const segment=text.slice(cursor,nextKey);
      parts.push(...(segment.match(/(?:\[[ㄱ-ㅎㅏ-ㅣ]\]|[ㄱ-ㅎㅏ-ㅣㄳㄵㄶㄺㄻㄼㄽㄾㄿㅀㅄ]+[가-힣]+(?:[\s\p{P}]+[ㄱ-ㅎㅏ-ㅣㄳㄵㄶㄺㄻㄼㄽㄾㄿㅀㅄ]+[\s\p{P}]*[가-힣]+)+|[가-힣]+(?:과|와)\s+[ㄱ-ㅎㅏ-ㅣㄳㄵㄶㄺㄻㄼㄽㄾㄿㅀㅄ]+|[ㄱ-ㅎㅏ-ㅣㄳㄵㄶㄺㄻㄼㄽㄾㄿㅀㅄ]+(?:[\s\p{P}]+[ㄱ-ㅎㅏ-ㅣㄳㄵㄶㄺㄻㄼㄽㄾㄿㅀㅄ]+)*[\s\p{P}]*[가-힣]+|[ㄱ-ㅎㅏ-ㅣㄳㄵㄶㄺㄻㄼㄽㄾㄿㅀㅄ]+|[가-힣]+|[^가-힣ㄱ-ㅎㅏ-ㅣㄳㄵㄶㄺㄻㄼㄽㄾㄿㅀㅄ]+)/gu)||[]));
      cursor=nextKey;
    }
    if(parts.some(part=>lexicon.has(part))){
      const results=parts.map(part=>{
        if(lexicon.has(part)){
          const entry=lexicon.get(part);
          if(entry.target_status==='surface-only'){
            // Run the general rules for traceability, then attach the exact
            // source-backed surface/IPA facts without relabelling the trace as
            // a lexical override. This preserves long vowels and official
            // complex-coda surfaces while keeping rule evidence visible.
            const result=convertText(part,map,lexicon,true,options);
            const sourceIpa=(entry.ipa_syllables||'').split('|');
            const sourceSurface=entry.surface_hangul||'';
            if(/^[가-힣]+$/u.test(part)&&sourceSurface&&[...sourceSurface].length===[...part].length){
              result.surfaceHangul=sourceSurface===part?'':sourceSurface;
            }
            if(/^[가-힣]+$/u.test(part)&&sourceIpa.length===[...part].length&&sourceIpa.every(Boolean)){
              const mapped=ipaSyllablesToUkrainian(sourceIpa);
              if(!mapped.unknown){
                result.ipa=sourceIpa.join(' ');
                result.ukrainian=mapped.syllables.join('');
                let index=0;
                for(const item of result.trace||[]){
                  if(item.status==='literal')continue;
                  if(index<sourceIpa.length)item.ipa=sourceIpa[index++];
                }
              }else{
                result.issues=[...(result.issues||[]),part+': sourced lexical IPA contains an unmapped segment "'+mapped.unknown+'".'];
                result.status='unresolved';
                result.trace=[...(result.trace||[]),{source:part,status:'unresolved',rules:['ipa-to-ukrainian-unmapped-segment'],output:'',ipa:sourceIpa.join(' ')}];
              }
            }
            return result;
          }
          return lexicalResult(part,entry);
        }
        return convertText(part,map,lexicon,true,options);
      });
      applyPhraseBoundaryAssimilation(results,parts,map);
      const issues=results.flatMap(r=>r.issues||[]);
      if(/[가-힣][A-Za-z]/u.test(text))issues.push('Mixed Hangul and Latin residue without a boundary; non-Korean characters are withheld from IPA.');
      return{
        source:text,
        surfaceHangul:results.map(r=>r.surfaceHangul||'').join(''),
        ukrainian:results.map(r=>r.ukrainian).join(''),
        ipa:results.map((r,index)=>(lexicon.has(parts[index])||/^[가-힣]+$/u.test(parts[index]))?r.ipa:ipaSafeLiteral(parts[index])).join(''),
        analysis:results.map(r=>r.analysis).filter(Boolean).join(' · '),
        variants:results.flatMap((result,variantIndex)=>(result.variants||[]).map(variant=>({
          ...variant,
          source:text,
          surface:results.map((item,index)=>index===variantIndex?variant.surface:(item.surfaceHangul||parts[index])).join(''),
          ukrainian:results.map((item,index)=>index===variantIndex?variant.ukrainian:item.ukrainian).join(''),
          ipa:results.map((item,index)=>(lexicon.has(parts[index])||/^[가-힣]+$/u.test(parts[index]))?(index===variantIndex?variant.ipa:item.ipa):ipaSafeLiteral(parts[index])).join('')
        }))),
        trace:results.flatMap(r=>r.trace||[]),
        issues,
        status:issues.length?'unresolved':results.some(r=>r.status==='lexical-review')?'lexical-review':results.some(r=>r.status==='lexical')?'lexical':results.some(r=>r.status==='practical-transliteration')?'practical-transliteration':results.some(r=>r.status==='heuristic-low-confidence')?'heuristic-low-confidence':results.some(r=>r.status==='contextual')?'contextual':'canonical'
      };
    }
  }

  const characters=[...text];
  const sourceText=characters.join('');
  const jamoInventoryRanges=[...sourceText.matchAll(/[ㄱ-ㅎㅏ-ㅣ]+(?:[\s,·/]+[ㄱ-ㅎㅏ-ㅣ]+){4,}/gu)]
    .map(match=>[match.index,match.index+match[0].length]);
  const units=characters.map((ch,index)=>{
    const d=decompose(ch);
    if(d)return {type:'hangul',...d};
    if(isJamoChar(ch)){
      const context=characters.slice(Math.max(0,index-2),Math.min(characters.length,index+3)).filter((_,offset)=>Math.abs(Math.max(0,index-2)+offset-index)>0);
      const nearbyLatinOrDigit=context.some(value=>/[A-Za-z0-9]/u.test(value));
      // Preserve a jamo as explanatory notation only when it is locally
      // attached to Korean prose (e.g. "ㅎ과") or the documented label "ㄴ 첨가".
      // A Hangul syllable elsewhere in the input is not enough evidence.
      const next=characters[index+1]||'';
      const attachedToKorean=Boolean(decompose(next));
      const bracketedJamo=characters[index-1]==='['&&characters[index+1]===']';
      const namedNInsertion=ch==='ㄴ'&&/^\s+첨가/u.test(characters.slice(index+1).join(''));
      // Also allow locally explicit Korean phonology labels: punctuation-separated
      // jamo lists (ㅚ·ㅟ의) or labels following 과/와 (ㄺ과 ㄱ 앞).
      const fromHere=characters.slice(index).join('');
      const listedJamoLabel=/^[ㄱ-ㅎㅏ-ㅣ]+(?:\s*[·,\/]\s*[ㄱ-ㅎㅏ-ㅣ]+)+(?:은|는|의|을|를|이|가|과|와)/u.test(fromHere);
      const inJamoInventory=jamoInventoryRanges.some(([start,end])=>index>=start&&index<end);
      const before=characters.slice(Math.max(0,index-12),index).join('');
      const after=characters.slice(index+1,index+18).join('');
      const conjunctionLabel=/(?:과|와)\s*$/u.test(before)&&/^\s*(?:앞|환경|발음|조건|관련|설명|비교|[.,。:;·\/]|$)/u.test(after);
      if((attachedToKorean||bracketedJamo||namedNInsertion||listedJamoLabel||conjunctionLabel||inJamoInventory)&&!nearbyLatinOrDigit)return {type:'literal',char:ch};
      return {type:'jamo',char:ch};
    }
    return {type:'literal',char:ch};
  });
  const originalUnits=units.map(u=>({...u}));
  // g2pK has already realized the normative surface spelling. In surfaceMode,
  // do not apply orthographic phonology rules a second time; only derive IPA
  // and allophonic voicing from the realized surface sequence.
  const ruleSets=options.surfaceMode?units.map(()=>[]):applyContextualRules(units,text,{morphologyMode});
  const output=[],ipa=[],analysis=[],trace=[],issues=[];

  for(let i=0;i<units.length;i++){
    const u=units[i];
    if(u.type==='jamo'){
      output[i]=preserveUnresolvedSource?'⟦'+u.char+'⟧':'';ipa[i]='';analysis[i]='';
      issues.push(u.char+': standalone compatibility jamo is not a syllable; IPA is withheld.');
      trace[i]={source:u.char,surface:u.char,status:'unsupported-jamo',rules:['unsupported-standalone-jamo'],output:output[i],ipa:''};
      continue;
    }
    if(u.type==='literal'){
      output[i]=u.char;ipa[i]=isPreservableIpaLiteral(u.char)?u.char:'';analysis[i]=isPreservableIpaLiteral(u.char)?u.char:'';
      trace[i]={source:u.char,surface:u.char,status:'literal',rules:[],output:u.char,ipa:ipa[i]};
      continue;
    }
    // Practical mode: never leave blank Hangul syllables.
    if(practicalOn){
      if(u.__saisiotInsertionUnlicensed){
        /* keep — lexical compound only */
      }else{
        if(u.__palatalizationUnlicensed||u.__hDeletionUnlicensed||u.__crossWordLiaisonUnlicensed||u.__complexLiaisonUnlicensed||u.__complexHAspirationUnlicensed||u.__substantiveLiaisonUnlicensed||u.__rieulGiyeokUnlicensed){
          u.__practicalHeuristic=true;
        }
        delete u.__palatalizationUnlicensed;
        delete u.__hDeletionUnlicensed;
        delete u.__crossWordLiaisonUnlicensed;
        delete u.__complexLiaisonUnlicensed;
        delete u.__complexHAspirationUnlicensed;
        delete u.__substantiveLiaisonUnlicensed;
        delete u.__rieulGiyeokUnlicensed;
      }
    }
    const applied=ruleSets[i]||[];
    if(u.__palatalizationUnlicensed){
      if(u.__palatalizationUnlicensed==='left')issues.push(u.char+': §17 palatalization requires a verified formal-morpheme boundary; add a sourced lexical pronunciation entry.');
      output[i]=preserveUnresolvedSource?'⟦'+u.char+'⟧':'';ipa[i]='';
      trace[i]={source:u.char,surface:u.char,status:'unresolved',rules:applied,output:output[i],ipa:''};
      continue;
    }
    if(u.__hDeletionUnlicensed){
      if(u.__hDeletionUnlicensed==='left')issues.push(u.char+': §12(4) ㅎ deletion requires a verified vowel-initial ending/suffix; add a sourced lexical pronunciation entry.');
      output[i]=preserveUnresolvedSource?'⟦'+u.char+'⟧':'';ipa[i]='';
      trace[i]={source:u.char,surface:u.char,status:'unresolved',rules:applied,output:output[i],ipa:''};
      continue;
    }
    if(u.__saisiotInsertionUnlicensed){
      if(u.__saisiotInsertionUnlicensed==='left')issues.push(u.char+': NIKL §30(3) ㄴㄴ insertion requires evidence for the exact 사이시옷 compound; add a sourced lexical pronunciation entry.');
      output[i]=preserveUnresolvedSource?'⟦'+u.char+'⟧':'';ipa[i]='';
      trace[i]={source:u.char,surface:u.char,status:'unresolved',rules:applied,output:output[i],ipa:''};
      continue;
    }
    if(u.__crossWordLiaisonUnlicensed){
      if(u.__crossWordLiaisonUnlicensed==='left')issues.push(u.char+': cross-word vowel-initial liaison may depend on a substantive-morpheme boundary (§15); add a sourced lexical pronunciation entry.');
      output[i]=preserveUnresolvedSource?'⟦'+u.char+'⟧':'';ipa[i]='';
      trace[i]={source:u.char,surface:u.char,status:'unresolved',rules:applied,output:output[i],ipa:''};
      continue;
    }
    if(u.__complexLiaisonUnlicensed){
      if(u.__complexLiaisonUnlicensed==='left')issues.push(u.char+': complex-coda liaison differs between formal and substantive morphemes (§§13–15); add a sourced lexical pronunciation entry.');
      output[i]=preserveUnresolvedSource?'⟦'+u.char+'⟧':'';ipa[i]='';
      trace[i]={source:u.char,surface:u.char,status:'unresolved',rules:applied,output:output[i],ipa:''};
      continue;
    }
    if(u.__complexHAspirationUnlicensed){
      if(u.__complexHAspirationUnlicensed==='left')issues.push(u.char+': §12 complex-coda + ㅎ aspiration depends on the licensed morphophonemic pattern; add a sourced lexical pronunciation entry.');
      output[i]=preserveUnresolvedSource?'⟦'+u.char+'⟧':'';ipa[i]='';
      trace[i]={source:u.char,surface:u.char,status:'unresolved',rules:applied,output:output[i],ipa:''};
      continue;
    }
    if(u.__substantiveLiaisonUnlicensed){
      if(u.__substantiveLiaisonUnlicensed==='left')issues.push(u.char+': coda representative changes under §15 before ㅏ/ㅓ/ㅗ/ㅜ/ㅟ, unlike formal-morpheme liaison; add a sourced lexical pronunciation entry.');
      output[i]=preserveUnresolvedSource?'⟦'+u.char+'⟧':'';ipa[i]='';
      trace[i]={source:u.char,surface:u.char,status:'unresolved',rules:applied,output:output[i],ipa:''};
      continue;
    }
    if(u.__rieulGiyeokUnlicensed){
      if(u.__rieulGiyeokUnlicensed==='left')issues.push(u.char+': ㄺ before ㄱ is morphologically ambiguous (§11); add a sourced lexical pronunciation entry.');
      output[i]=preserveUnresolvedSource?'⟦'+u.char+'⟧':'';ipa[i]='';
      trace[i]={source:u.char,surface:u.char,status:'unresolved',rules:applied,output:output[i],ipa:''};
      continue;
    }

    const prev=prevHangul(units,i);
    const contextualUi=u.vowel==='ㅢ'&&u.onset!=='ㅇ';
    const defaultUi=u.vowel==='ㅢ'&&u.onset==='ㅇ';
    const vowelJamo=contextualUi?'ㅣ':u.vowel;
    let status=u.__practicalHeuristic?'practical-transliteration':u.__softHeuristic?'heuristic-low-confidence':(applied.length||contextualUi||defaultUi?'contextual':'canonical');
    const onset=u.onset;
    const previousCoda=prev?.__effectiveCoda??prev?.coda??'';
    const liaisonOnset=Boolean(u.__liaison);
    const previousSonorant=['ㄴ','ㄹ','ㅁ','ㅇ'].includes(previousCoda);
    const previousObstruent=Boolean(previousCoda)&&!previousSonorant;
    const previousOpenSyllable=Boolean(prev)&&prev.coda==='';
    const voiced=(liaisonOnset||previousSonorant||previousOpenSyllable)&&['ㄱ','ㄷ','ㅂ','ㅈ'].includes(onset);
    const fortis=!options.surfaceMode&&!liaisonOnset&&previousObstruent&&['ㄱ','ㄷ','ㅂ','ㅅ','ㅈ'].includes(onset);
    const liquid=onset==='ㄹ'&&['ㄴ','ㄹ','ㅁ','ㅇ'].includes(previousCoda);
    const traceRules=[...applied];
    if(contextualUi)traceRules.push('vowel-ui-to-i');
    if(defaultUi)traceRules.push('vowel-ui-default-ɰi');
    if(voiced)traceRules.push('contextual-voicing');
    if(fortis)traceRules.push('tensification');
    if(liquid&&!traceRules.includes('liquid-assimilation'))traceRules.push('liquid-assimilation');
    u.__effectiveCoda=u.coda;

    const o=get(map,'onset',onset),v=get(map,'vowel',vowelJamo),c=u.coda?get(map,'coda',u.coda):null;
    const vowelIpa=defaultUi?'ɰi':(v?.ipa||'');
    const ipaOnset=(J_VOWELS.has(u.vowel)&&onset==='ㅅ')?'ɕ':
      (J_VOWELS.has(u.vowel)&&onset==='ㅆ')?'ɕ͈':(o?.ipa||'');
    let unitIpa=ipaOnset+vowelIpa+(c?.ipa||'');
    if(liquid&&onset==='ㄹ')unitIpa='l'+(v?.ipa||'')+(c?.ipa||'');
    if(voiced){
      const voicedIpa={ 'ㄱ':'ɡ','ㄷ':'d','ㅂ':'b','ㅈ':'dʑ' }[onset];
      if(voicedIpa)unitIpa=voicedIpa+vowelIpa+(c?.ipa||'');
    }else if(fortis){
      const fortisIpa={ 'ㄱ':'k͈','ㄷ':'t͈','ㅂ':'p͈','ㅅ':'s͈','ㅈ':'tɕ͈' }[onset];
      if(fortisIpa)unitIpa=fortisIpa+vowelIpa+(c?.ipa||'');
    }
    ipa[i]=unitIpa;
    const targetMapping=traceIpaMappingDetailed(unitIpa);
    const targetFromIpa={
      text:targetMapping.tokens.map(token=>token.ukrainian).join(''),
      unknown:targetMapping.unknown,
      status:targetMapping.status,
      reason:targetMapping.reason
    };
    if(targetFromIpa.unknown || targetFromIpa.status==='unavailable'){
      issues.push(u.char+': IPA target mapping unavailable ('+(targetFromIpa.reason||'unmapped_ipa_sequence')+'): '+(targetFromIpa.unknown||'(empty IPA)'));
      output[i]=preserveUnresolvedSource?'⟦'+u.char+'⟧':'';
      status='unresolved';
    }else{
      output[i]=targetFromIpa.text;
    }
    analysis[i]=u.char+'['+(u.onset||'')+'+'+(u.vowel||'')+(u.coda?'+'+u.coda:'')+']';
    trace[i]={
      source:u.char,surface:compose(u.onset,u.vowel,u.coda||''),status,
      rules:[...new Set(traceRules)],output:output[i],ipa:unitIpa,
      targetStatus:targetFromIpa.status,
      targetReason:targetFromIpa.reason||null,
      targetMappings:targetMapping.tokens,
      targetFeatures:targetMapping.features
    };
  }

  if(!units.some(u=>u.type==='hangul')&&!units.some(u=>u.type==='jamo')&&!skipLexicon)issues.push('Input contains no Hangul syllable; pronunciation cannot be generated.');
  if(/[가-힣][A-Za-z]/u.test(text))issues.push('Mixed Hangul and Latin/digit residue without a boundary; non-Korean characters are withheld from IPA.');
  const hasJamo=units.some(u=>u.type==='jamo');
  const hasHangulSyllables=units.some(u=>u.type==='hangul');
  const status=hasJamo?'unresolved':!hasHangulSyllables?'non-korean-input':issues.length?'unresolved':trace.some(x=>x?.status==='practical-transliteration')?'practical-transliteration':trace.some(x=>x?.status==='heuristic-low-confidence')?'heuristic-low-confidence':trace.some(x=>x?.status==='contextual')?'contextual':'canonical';
  const surfaceParts=[];
  for(let i=0;i<units.length;i++){
    const u=units[i];
    if(u.type==='literal'){surfaceParts.push(u.char);continue;}
    if(trace[i]?.status==='unresolved'||!output[i]){surfaceParts.push(u.char);continue;}
    surfaceParts.push(compose(u.onset,u.vowel,u.coda||''));
  }
  const recomposed=surfaceParts.join('');
  const originalHangul=units.filter(u=>u.type==='hangul').map(u=>u.char).join('');
  // Only expose surface when contextual rules changed the Hangul form (e.g. 독립문→동님문).
  // Unchanged general forms stay empty so lexical vs general remains distinguishable.
  // A single Hangul token with unresolved morphology must not expose a
  // partial IPA string or a plausible-looking partial Ukrainian transcription.
  // Keep the trace and diagnostics for research, but fail closed at the public
  // result boundary. Phrase conversion still preserves surrounding resolved
  // words because the phrase path recursively converts each token.
  const unresolvedWholeHangulToken=/^[가-힣]+$/u.test(text)&&status==='unresolved';
  const target_status=unresolvedWholeHangulToken||!hasHangulSyllables
    ? 'unavailable'
    : trace.some(item=>item?.targetStatus==='unavailable'||item?.status==='unresolved')
      ? 'unavailable'
      : trace.some(item=>item?.targetStatus==='provisional')
        ? 'provisional'
        : 'model-selected';
  return{
    source:text,
    surfaceHangul:recomposed===originalHangul?'':recomposed,
    ukrainian:unresolvedWholeHangulToken?'':output.join(''),
    ipa:unresolvedWholeHangulToken?'':renderStructured(units,ipa,' '),
    analysis:renderStructured(units,analysis,' · '),
    trace,
    variants:unresolvedWholeHangulToken?[]:genericVowelVariants(text,units,originalUnits,ipa,output,status),
    issues,
    status,
    target_status
  };
}

