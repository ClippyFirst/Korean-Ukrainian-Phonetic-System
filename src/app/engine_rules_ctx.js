/**
 * Contextual phonological rules (same-eojeol pass).
 */
import {
  COMPLEX, FINAL_REPRESENTATIVE, LEXICAL_B_CODA_PREFIXES,
  NIKL_24_STEM_NM_ENDING_FORMS, NIKL_27_ADNOMINAL_PHRASES, NIKL_29_PHRASE_INSERTION, NIKL_30_SAISIOT_INSERTION_FORMS,
  NASAL_AFTER, PLAIN_TO_FORTIS, ASPIRATION, H_CODA_ASPIRATION, representative,
} from './engine_shared.js';
import { isSoftFormalPair, trySoftFormal, tryPracticalHeuristic } from './soft_morphology.js';

export function applyContextualRules(units,sourceText='',{ morphologyMode = 'strict' } = {}){
  const softOn = morphologyMode === 'soft' || morphologyMode === 'practical';
  const practicalOn = morphologyMode === 'practical';
  const ruleSets=units.map(()=>[]);
  for(let i=0;i<units.length-1;i++){
    const a=units[i],b=units[i+1];
    if(a.type!=='hangul'||b.type!=='hangul')continue;
    const rules=ruleSets[i];
    const nextRules=ruleSets[i+1];

    if(a.coda==='ㄼ'&&b.onset!=='ㅇ'){
      if(a.char==='밟'){a.coda='ㅂ';rules.push('lexical-coda-balm');}
      else if(a.char==='넓'&&LEXICAL_B_CODA_PREFIXES.has(a.char+b.char)){a.coda='ㅂ';rules.push('lexical-coda-neolp');}
    }

    if(['ㄷ','ㅌ','ㄾ'].includes(a.coda)&&b.onset==='ㅇ'&&b.vowel==='ㅣ'){
      if(softOn&&trySoftFormal(a,b,rules,nextRules,{COMPLEX,FINAL_REPRESENTATIVE})){
        continue;
      }
      if(practicalOn&&tryPracticalHeuristic(a,b,rules,nextRules,{COMPLEX,FINAL_REPRESENTATIVE})){
        continue;
      }
      a.__palatalizationUnlicensed='left';
      b.__palatalizationUnlicensed='right';
      rules.push('palatalization-requires-lexical-morphology');
      nextRules.push('palatalization-requires-lexical-morphology');
      continue;
    }

    if(NIKL_30_SAISIOT_INSERTION_FORMS.has(sourceText)&&a.coda==='ㅅ'&&b.onset==='ㅇ'){
      a.__saisiotInsertionUnlicensed='left';
      b.__saisiotInsertionUnlicensed='right';
      rules.push('saisiot-n-insertion-§30(3)-requires-lexical-compound');
      nextRules.push('saisiot-n-insertion-§30(3)-requires-lexical-compound');
      continue;
    }

    if(a.coda&&b.onset==='ㅇ'&&!a.__palatalizationUnlicensed){
      if(softOn&&isSoftFormalPair(a,b)){
        if(trySoftFormal(a,b,rules,nextRules,{COMPLEX,FINAL_REPRESENTATIVE})){
          continue;
        }
      }
      if(practicalOn&&tryPracticalHeuristic(a,b,rules,nextRules,{COMPLEX,FINAL_REPRESENTATIVE})){
        continue;
      }
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

    const rep=representative(a.coda);
    if(['ㅎ','ㄶ','ㅀ'].includes(a.coda)&&b.onset==='ㅅ'){
      if(a.coda==='ㅎ')a.coda='';
      else if(a.coda==='ㄶ')a.coda='ㄴ';
      else a.coda='ㄹ';
      b.onset='ㅆ';
      rules.push('h-coda-sibilant-fortition');
      nextRules.push('h-coda-sibilant-fortition');
    }else if((a.coda==='ㅎ'||a.coda==='ㄶ'||a.coda==='ㅀ')&&b.onset==='ㅇ'){
      if(a.coda==='ㅎ')a.coda='';
      else if(a.coda==='ㄶ')a.coda='ㄴ';
      else a.coda='ㄹ';
      rules.push('h-deletion');
    }else if((a.coda==='ㅎ'||a.coda==='ㄶ'||a.coda==='ㅀ')&&H_CODA_ASPIRATION[b.onset]){
      b.onset=H_CODA_ASPIRATION[b.onset];
      a.coda=a.coda==='ㄶ'?'ㄴ':a.coda==='ㅀ'?'ㄹ':'';
      rules.push('h-aspiration');
    }else if(a.coda&&b.onset==='ㅎ'){
      const pair=COMPLEX[a.coda];
      if(pair){
        a.__complexHAspirationUnlicensed='left';
        b.__complexHAspirationUnlicensed='right';
        rules.push('complex-coda-h-aspiration-requires-morphology');
        nextRules.push('complex-coda-h-aspiration-requires-morphology');
        continue;
      }else{
        const aspirated=a.coda==='ㅈ'?'ㅊ':(ASPIRATION[a.coda]||ASPIRATION[rep]);
        if(aspirated){
          const aspiratedPalatalized=a.coda==='ㄷ'&&b.onset==='ㅎ'&&b.vowel==='ㅣ';
          b.onset=aspiratedPalatalized?'ㅊ':aspirated;
          a.coda='';
          rules.push(aspiratedPalatalized?'h-aspiration-plus-palatalization':'h-aspiration');
        }
      }
    }

    const beforeLiquidRep=representative(a.coda);
    if(['ㄱ','ㄷ','ㅂ','ㅁ','ㅇ'].includes(beforeLiquidRep)&&b.onset==='ㄹ'){
      b.onset='ㄴ';
      const rule=beforeLiquidRep==='ㄷ'
        ?'project-inferred-d-liquid-nasalization'
        :'liquid-to-nasal-before-obstruent';
      rules.push(rule);
      nextRules.push(rule);
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
      a.coda='ㄹ';
      b.onset='ㄹ';
      rules.push('liquid-assimilation');
    }else if((liquidRep==='ㅁ'||liquidRep==='ㅇ')&&b.onset==='ㄹ'){
      b.onset='ㄴ';
      rules.push('liquid-assimilation');
    }

    if(a.coda==='ㄺ'&&b.onset==='ㄱ'){
      a.__rieulGiyeokUnlicensed='left';
      b.__rieulGiyeokUnlicensed='right';
      rules.push('rieul-giyeok-exception-requires-morphology');
      nextRules.push('rieul-giyeok-exception-requires-morphology');
      continue;
    }

    const exactR010Pair=NIKL_24_STEM_NM_ENDING_FORMS.get(sourceText);
    const currentPair=a.char+'>'+b.char;
    const fortisRep=representative(a.coda);
    if(exactR010Pair===currentPair&&['ㄴ','ㅁ'].includes(fortisRep)&&PLAIN_TO_FORTIS[b.onset]){
      b.onset=PLAIN_TO_FORTIS[b.onset];
      nextRules.push('stem-n-m-fortition-§24');
    }else if(PLAIN_TO_FORTIS[b.onset]&&['ㄱ','ㄷ','ㅂ'].includes(fortisRep)){
      b.onset=PLAIN_TO_FORTIS[b.onset];
      nextRules.push('tensification');
    }
  }
  for(let i=0;i<units.length;i++){
    const a=units[i];
    if(a.type!=='hangul'||!a.coda)continue;
    let j=i+1,sawSpace=false;
    while(j<units.length&&units[j].type==='literal'&&/^\s$/u.test(units[j].char)){
      sawSpace=true;j++;
    }
    if(!sawSpace||j>=units.length||units[j].type!=='hangul')continue;
    const b=units[j],rules=ruleSets[i],nextRules=ruleSets[j];

    let leftStart=i;
    while(leftStart>0&&units[leftStart-1].type==='hangul')leftStart--;
    let rightEnd=j;
    while(rightEnd<units.length&&units[rightEnd].type==='hangul')rightEnd++;
    const leftWord=units.slice(leftStart,i+1).map(u=>u.char).join('');
    const rightWord=units.slice(j,rightEnd).map(u=>u.char).join('');
    const phraseKey=leftWord+' '+rightWord;
    const licensedFortis=NIKL_27_ADNOMINAL_PHRASES.get(phraseKey);
    if(licensedFortis&&b.onset===licensedFortis){
      b.onset=PLAIN_TO_FORTIS[licensedFortis];
      rules.push('adnominal-r-fortition-§27');
      nextRules.push('adnominal-r-fortition-§27');
    }

    const insertion=NIKL_29_PHRASE_INSERTION.get(phraseKey);
    if(insertion){
      if(insertion.coda)a.coda=insertion.coda;
      b.onset=insertion.onset;
      rules.push('phrase-n-insertion-§29');
      nextRules.push('phrase-n-insertion-§29');
      continue;
    }

    if(b.onset==='ㅇ'){
      a.__crossWordLiaisonUnlicensed='left';
      b.__crossWordLiaisonUnlicensed='right';
      rules.push('cross-word-vowel-liaison-requires-morphology');
      nextRules.push('cross-word-vowel-liaison-requires-morphology');
      continue;
    }

    const beforeLiquidRep=representative(a.coda);
    if(['ㄱ','ㄷ','ㅂ','ㅁ','ㅇ'].includes(beforeLiquidRep)&&b.onset==='ㄹ'){
      b.onset='ㄴ';
      const rule=beforeLiquidRep==='ㄷ'
        ?'project-inferred-d-liquid-nasalization'
        :'liquid-to-nasal-before-obstruent';
      rules.push(rule);
      nextRules.push(rule);
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
