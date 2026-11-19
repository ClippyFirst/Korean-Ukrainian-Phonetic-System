/**
 * Phrase-boundary assimilation after lexical splits.
 */
import {
  get, NASAL_AFTER, PLAIN_TO_FORTIS, representative, decompose,
  NIKL_27_ADNOMINAL_PHRASES, NIKL_29_PHRASE_INSERTION,
} from './engine_shared.js';
import { ipaSyllableToUkrainian } from './engine_ipa.js';

export function applyPhraseBoundaryAssimilation(results,parts,map){
  // NIKL §18 depends on connected-phrase pronunciation, not whitespace itself.
  // The browser uses whitespace as a deterministic proxy and blocks punctuation;
  // this is an implementation heuristic, not a prosodic analysis.
  const addRule=(trace,rule)=>{
    if(trace)trace.rules=[...new Set([...(trace.rules||[]),rule])];
  };
  const lastTrace=(result)=>[...(result?.trace||[])].reverse().find(item=>item.status!=='literal');
  const firstTrace=(result)=>(result?.trace||[]).find(item=>item.status!=='literal');
  // The Ukrainian text is a function of the final IPA. This pass rewrites a
  // word's IPA and its per-syllable target; keep the word's aggregated Ukrainian
  // (and candidate) strings in step instead of leaving the pre-rewrite text,
  // which for lexical words came from the sourced IPA before the boundary change.
  const syncUkrainian=(result,oldOutput,newOutput,edge)=>{
    if(oldOutput==null||newOutput==null||oldOutput===newOutput)return;
    for(const field of ['ukrainian','candidate_ukrainian']){
      const text=result[field];
      if(typeof text!=='string'||!text)continue;
      if(edge==='end'&&text.endsWith(oldOutput))result[field]=text.slice(0,text.length-oldOutput.length)+newOutput;
      else if(edge==='start'&&text.startsWith(oldOutput))result[field]=newOutput+text.slice(oldOutput.length);
    }
  };
  const rewriteCoda=(result,oldCoda,newCoda,rule)=>{
    const oldIpa=get(map,'coda',oldCoda)?.ipa||'',newIpa=get(map,'coda',newCoda)?.ipa||'';
    if(!oldIpa||!newIpa)return false;
    const trace=lastTrace(result);
    if(!trace||!result.ipa.endsWith(oldIpa)||!trace.ipa.endsWith(oldIpa))return false;
    const previousOutput=trace.output;
    result.ipa=result.ipa.slice(0,-oldIpa.length)+newIpa;
    trace.ipa=trace.ipa.slice(0,-oldIpa.length)+newIpa;
    trace.output=ipaSyllableToUkrainian(trace.ipa).text;
    syncUkrainian(result,previousOutput,trace.output,'end');
    addRule(trace,rule);
    return true;
  };
  const rewriteOnset=(result,oldOnset,newOnset,realizedLateral,rule)=>{
    const oldIpa=get(map,'onset',oldOnset)?.ipa||'';
    const newIpa=realizedLateral?(get(map,'coda','ㄹ')?.ipa||''):(get(map,'onset',newOnset)?.ipa||'');
    if(!oldIpa||!newIpa)return false;
    const trace=firstTrace(result);
    if(!trace||!result.ipa.startsWith(oldIpa)||!trace.ipa.startsWith(oldIpa))return false;
    const previousOutput=trace.output;
    result.ipa=newIpa+result.ipa.slice(oldIpa.length);
    trace.ipa=newIpa+trace.ipa.slice(oldIpa.length);
    trace.output=ipaSyllableToUkrainian(trace.ipa).text;
    syncUkrainian(result,previousOutput,trace.output,'start');
    addRule(trace,rule);
    return true;
  };

  // NIKL §27 fortition. The IPA must retain it, and the Ukrainian follows the IPA
  // through the project's canonical correspondence (k͈ → кк, s͈ → сс, a practical
  // doubling convention, not a phonetic reproduction: Ukrainian has no fortis
  // series). Apply only to exact licensed eojeol pairs; this also covers mixed
  // lexical/generic phrases split by the browser adapter.
  const rewriteFortisOnset=(result,onset,rule)=>{
    const ipaPairs={
      'ㄱ':['k','k͈'],'ㄷ':['t','t͈'],'ㅂ':['p','p͈'],
      'ㅅ':['s','s͈'],'ㅈ':['tɕ','tɕ͈']
    };
    const pair=ipaPairs[onset];
    const trace=firstTrace(result);
    if(!pair||!trace||!result.ipa.startsWith(pair[0])||!trace.ipa.startsWith(pair[0]))return false;
    const previousOutput=trace.output;
    result.ipa=pair[1]+result.ipa.slice(pair[0].length);
    trace.ipa=pair[1]+trace.ipa.slice(pair[0].length);
    trace.output=ipaSyllableToUkrainian(trace.ipa).text;
    syncUkrainian(result,previousOutput,trace.output,'start');
    addRule(trace,rule);
    return true;
  };

  // §29 insertion can change an initial ㅇ into ㄴ/ㄹ. Unlike ordinary
  // onset rewriting, the source IPA begins with a vowel (no onset token).
  const insertPhraseOnset=(result,onset,realizedLateral,rule)=>{
    const newIpa=realizedLateral?(get(map,'coda','ㄹ')?.ipa||''):(get(map,'onset',onset)?.ipa||'');
    if(!newIpa)return false;
    const trace=firstTrace(result);
    if(!trace)return false;
    const previousOutput=trace.output;
    result.ipa=newIpa+result.ipa;
    trace.ipa=newIpa+trace.ipa;
    trace.output=ipaSyllableToUkrainian(trace.ipa).text;
    syncUkrainian(result,previousOutput,trace.output,'start');
    addRule(trace,rule);
    return true;
  };

  for(let i=0;i<parts.length-2;i++){
    if(!/^\s+$/u.test(parts[i+1]))continue;
    const previous=results[i],next=results[i+2];
    if(!previous||!next||previous.status==='unresolved'||next.status==='unresolved'||previous.issues?.length||next.issues?.length)continue;
    const previousText=previous.surfaceHangul||parts[i];
    const nextText=next.surfaceHangul||parts[i+2];
    const last=[...previousText].at(-1),first=[...nextText][0];
    const left=last?decompose(last):null,right=first?decompose(first):null;
    if(!left?.coda||!right)continue;
    const leftRep=representative(left.coda),rightOnset=right.onset;

    // Apply §27 to exact official/rule-licensed adnominal phrases even when
    // another word in the sentence is served by a lexical pronunciation row.
    // The generic whole-string path cannot see these boundaries after splitting.
    const phraseKey=parts[i]+' '+parts[i+2];

    // Preserve the exact §29 cross-word insertion examples when another token
    // in the same sentence invokes the lexical/generic split path.
    const insertion=NIKL_29_PHRASE_INSERTION.get(phraseKey);
    if(insertion){
      if(insertion.coda&&!rewriteCoda(previous,leftRep,insertion.coda,'phrase-n-insertion-§29'))continue;
      const lateral=insertion.onset==='ㄹ';
      if(rightOnset==='ㅇ'&&insertPhraseOnset(next,insertion.onset,lateral,'phrase-n-insertion-§29')){
        addRule(lastTrace(previous),'phrase-n-insertion-§29');
        continue;
      }
    }

    const licensedFortis=NIKL_27_ADNOMINAL_PHRASES.get(phraseKey);
    if(licensedFortis===rightOnset&&rewriteFortisOnset(next,licensedFortis,'adnominal-r-fortition-§27')){
      addRule(lastTrace(previous),'adnominal-r-fortition-§27');
      continue;
    }

    if(['ㄴ','ㅁ'].includes(rightOnset)&&NASAL_AFTER[leftRep]){
      if(rewriteCoda(previous,leftRep,NASAL_AFTER[leftRep],'nasal-assimilation'))addRule(firstTrace(next),'nasal-assimilation');
      continue;
    }

    if(rightOnset==='ㄹ'&&['ㄱ','ㄷ','ㅂ','ㅁ','ㅇ'].includes(leftRep)){
      const obstruent=['ㄱ','ㄷ','ㅂ'].includes(leftRep);
      const rule=leftRep==='ㄷ'
        ?'project-inferred-d-liquid-nasalization'
        :obstruent?'liquid-to-nasal-before-obstruent':'liquid-assimilation';
      if(rewriteOnset(next,'ㄹ','ㄴ',false,rule))addRule(lastTrace(previous),rule);
      if(NASAL_AFTER[leftRep]&&rewriteCoda(previous,leftRep,NASAL_AFTER[leftRep],'nasal-assimilation'))addRule(firstTrace(next),'nasal-assimilation');
      continue;
    }

    if(leftRep==='ㄴ'&&rightOnset==='ㄹ'){
      rewriteCoda(previous,'ㄴ','ㄹ','liquid-assimilation');
      rewriteOnset(next,'ㄹ','ㄹ',true,'liquid-assimilation');
      continue;
    }

    if(leftRep==='ㄹ'&&rightOnset==='ㄴ'){
      if(rewriteOnset(next,'ㄴ','ㄹ',true,'liquid-assimilation'))addRule(lastTrace(previous),'liquid-assimilation');
    }

    // ㄹ|ㄹ across the boundary is the geminate lateral [l.l] (as ㄹ|ㄴ above and
    // as inside a word); a lexical-split segment otherwise keeps the flap.
    if(leftRep==='ㄹ'&&rightOnset==='ㄹ'){
      rewriteOnset(next,'ㄹ','ㄹ',true,'liquid-assimilation');
    }
  }
}

