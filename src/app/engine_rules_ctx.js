/**
 * Contextual phonological rules (same-eojeol pass).
 */
import {
  COMPLEX, FINAL_REPRESENTATIVE, LEXICAL_B_CODA_PREFIXES, decompose,
  NIKL_12_H_DELETION_FORMS, NIKL_13_14_FORMAL_LIAISON_FORMS, NIKL_15_SUBSTANTIVE_LIAISON_FORMS, NIKL_11_VERBAL_STEM_RIEUL_GIYEOK_FORMS, NIKL_17_FORMAL_I_FORMS, NIKL_COMPLEX_H_SUFFIX_FORMS, NIKL_24_STEM_NM_ENDING_FORMS, NIKL_25_STEM_LB_LT_ENDING_FORMS, NIKL_26_SINO_KOREAN_RIEUL_FORTITION_FORMS, NIKL_28_COMPOUND_FORTITION_FORMS, NIKL_27_ADNOMINAL_PHRASES, NIKL_27_ADNOMINAL_FORMS, NIKL_29_PHRASE_INSERTION, NIKL_29_WORD_INSERTION, NIKL_30_SAISIOT_PRONUNCIATION_FORMS, NIKL_30_SAISIOT_INSERTION_FORMS,
  NASAL_AFTER, PLAIN_TO_FORTIS, ASPIRATION, H_CODA_ASPIRATION, representative,
} from './engine_shared.js';
import { isSoftFormalPair, trySoftFormal, tryPracticalHeuristic } from './soft_morphology.js';

export function applyContextualRules(units,sourceText='',{ morphologyMode = 'strict' } = {}){
  const softOn = morphologyMode === 'soft' || morphologyMode === 'practical' || morphologyMode === 'super-soft';
  const practicalOn = morphologyMode === 'practical' || morphologyMode === 'super-soft';
  const ruleSets=units.map(()=>[]);
  for(let i=0;i<units.length-1;i++){
    const a=units[i],b=units[i+1];
    if(a.type!=='hangul'||b.type!=='hangul')continue;
    const rules=ruleSets[i];
    const nextRules=ruleSets[i+1];
    let wordStart=i;
    while(wordStart>0&&units[wordStart-1].type==='hangul')wordStart--;
    let wordEnd=i;
    while(wordEnd<units.length&&units[wordEnd].type==='hangul')wordEnd++;
    const currentWord=units.slice(wordStart,wordEnd).map(unit=>unit.char).join('');
    const exactMorphPair=a.char+'>'+b.char;
    const exactR002Pair=NIKL_13_14_FORMAL_LIAISON_FORMS.get(currentWord);
    const exactR002Licensed=exactR002Pair===exactMorphPair;
    const exactR002SubstantivePair=NIKL_15_SUBSTANTIVE_LIAISON_FORMS.get(currentWord);
    const exactR002SubstantiveLicensed=exactR002SubstantivePair===exactMorphPair;
    const exactR016Pair=NIKL_11_VERBAL_STEM_RIEUL_GIYEOK_FORMS.get(currentWord);
    const exactR016Licensed=exactR016Pair===exactMorphPair;
    const exactR011Pair=NIKL_25_STEM_LB_LT_ENDING_FORMS.get(currentWord);
    const exactR011Licensed=exactR011Pair===exactMorphPair;
    const exactR012Pair=NIKL_26_SINO_KOREAN_RIEUL_FORTITION_FORMS.get(currentWord);
    const exactR012Licensed=exactR012Pair===exactMorphPair;
    const exactR014Pair=NIKL_28_COMPOUND_FORTITION_FORMS.get(currentWord);
    const exactR014Licensed=exactR014Pair===exactMorphPair;
    const exactR015Pair=NIKL_30_SAISIOT_PRONUNCIATION_FORMS.get(currentWord);
    const exactR015Licensed=exactR015Pair===exactMorphPair;
    const exactR009Pair=NIKL_29_WORD_INSERTION.get(currentWord);
    const exactR009Licensed=exactR009Pair===exactMorphPair;

    if(a.coda==='ㄼ'&&b.onset!=='ㅇ'){
      if(a.char==='밟'){a.coda='ㅂ';rules.push('lexical-coda-balm');}
      else if(a.char==='넓'&&LEXICAL_B_CODA_PREFIXES.has(a.char+b.char)){a.coda='ㅂ';rules.push('lexical-coda-neolp');}
    }

    if(['ㄷ','ㅌ','ㄾ'].includes(a.coda)&&b.onset==='ㅇ'&&b.vowel==='ㅣ'&&!exactR009Licensed){
      const exactR007Pair=NIKL_17_FORMAL_I_FORMS.get(currentWord);
      if(exactR007Pair===exactMorphPair){
        const originalCoda=a.coda;
        a.coda=originalCoda==='ㄾ'?'ㄹ':'';
        b.onset=originalCoda==='ㄷ'?'ㅈ':'ㅊ';
        rules.push('palatalization-§17-exact-form');
        nextRules.push('palatalization-§17-exact-form');
        continue;
      }
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

    if(NIKL_30_SAISIOT_INSERTION_FORMS.has(sourceText)&&a.coda==='ㅅ'&&b.onset==='ㅇ'&&!exactR015Licensed){
      a.__saisiotInsertionUnlicensed='left';
      b.__saisiotInsertionUnlicensed='right';
      rules.push('saisiot-n-insertion-§30(3)-requires-lexical-compound');
      nextRules.push('saisiot-n-insertion-§30(3)-requires-lexical-compound');
      continue;
    }

    // NIKL §30: exact source-backed saisiot cases. Never infer the
    // morphological boundary from a written ㅅ coda alone.
    if(exactR015Licensed&&a.coda==='ㅅ'){
      let saisiotChanged=false;
      if(PLAIN_TO_FORTIS[b.onset]){
        b.onset=PLAIN_TO_FORTIS[b.onset];
        a.coda='';
        saisiotChanged=true;
      }else if(b.onset==='ㄴ'||b.onset==='ㅁ'){
        a.coda='ㄴ';
        saisiotChanged=true;
      }else if(b.onset==='ㅇ'&&b.vowel==='ㅣ'){
        a.coda='ㄴ';
        b.onset='ㄴ';
        saisiotChanged=true;
      }
      if(saisiotChanged){
        rules.push('saisiot-pronunciation-§30-exact-form');
        nextRules.push('saisiot-pronunciation-§30-exact-form');
        continue;
      }
    }

    // NIKL §29 word-internal n-insertion is lexical; only the exact
    // full-form + pair inventory is licensed here. The coda remains for the
    // following ordered nasal-assimilation step.
    if(exactR009Licensed&&a.coda&&b.onset==='ㅇ'&&['ㅣ','ㅑ','ㅕ','ㅛ','ㅠ','ㅖ','ㅒ'].includes(b.vowel)){
      b.onset=representative(a.coda)==='ㄹ'?'ㄹ':'ㄴ';
      rules.push('n-insertion-§29-exact-word');
      nextRules.push('n-insertion-§29-exact-word');
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
        let wordStart=i;
        while(wordStart>0&&units[wordStart-1].type==='hangul')wordStart--;
        let wordEnd=i;
        while(wordEnd<units.length&&units[wordEnd].type==='hangul')wordEnd++;
        const currentWord=units.slice(wordStart,wordEnd).map(unit=>unit.char).join('');
        const exactR003Pair=NIKL_12_H_DELETION_FORMS.get(currentWord);
        const currentPair=a.char+'>'+b.char;
        if(exactR003Pair===currentPair){
          a.coda=a.coda==='ㅎ'?'':a.coda==='ㄶ'?'ㄴ':'ㄹ';
          rules.push('h-deletion-§12(4)-exact-form');
        }else{
          a.__hDeletionUnlicensed='left';
          b.__hDeletionUnlicensed='right';
          rules.push('h-deletion-requires-morphology');
          nextRules.push('h-deletion-requires-morphology');
          continue;
        }
      }
      const pair=COMPLEX[a.coda];
      if(pair&&!['ㄶ','ㅀ'].includes(a.coda)){
        if(exactR002Licensed){
          a.coda=pair[0];
          if(pair[1]){b.onset=pair[1];b.__liaison=true;}
          rules.push('complex-coda-liaison-exact-form-formal');
        }else if(exactR002SubstantiveLicensed){
          // NIKL §15(붙임): for substantive-morpheme liaison, move only the
          // representative of a complex coda (값어치[가버치]), not §14's
          // second-component formal liaison (값이[갑씨]).
          const representativeCoda=representative(a.coda);
          a.coda='';
          b.onset=representativeCoda;
          b.__liaison=true;
          rules.push('complex-coda-substantive-liaison-§15-exact-form');
          nextRules.push('complex-coda-substantive-liaison-§15-exact-form');
        }else{
          a.__complexLiaisonUnlicensed='left';
          b.__complexLiaisonUnlicensed='right';
          rules.push('complex-coda-liaison-requires-morphology');
          nextRules.push('complex-coda-liaison-requires-morphology');
          continue;
        }
      }else if(!pair&&a.coda!=='ㅎ'&&a.coda!=='ㅇ'&&
               representative(a.coda)!==a.coda&&
               ['ㅏ','ㅓ','ㅗ','ㅜ','ㅟ'].includes(b.vowel)){
        if(exactR002Licensed){
          b.onset=a.coda;
          b.__liaison=true;
          a.coda='';
          rules.push('liaison-exact-form-formal');
        }else if(exactR002SubstantiveLicensed){
          b.onset=representative(a.coda);
          b.__liaison=true;
          a.coda='';
          rules.push('substantive-liaison-§15-exact-form');
          nextRules.push('substantive-liaison-§15-exact-form');
        }else{
          a.__substantiveLiaisonUnlicensed='left';
          b.__substantiveLiaisonUnlicensed='right';
          rules.push('substantive-morpheme-liaison-requires-morphology');
          nextRules.push('substantive-morpheme-liaison-requires-morphology');
          continue;
        }
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
        const exactR004Pair=NIKL_COMPLEX_H_SUFFIX_FORMS.get(currentWord);
        if(['ㄺ','ㄵ','ㄼ'].includes(a.coda)&&exactR004Pair===exactMorphPair){
          const aspirated=ASPIRATION[pair[1]]||ASPIRATION[representative(pair[1])];
          if(aspirated){
            a.coda=pair[0];
            b.onset=aspirated;
            rules.push('complex-coda-h-aspiration-exact-form');
          }else{
            a.__complexHAspirationUnlicensed='left';
            b.__complexHAspirationUnlicensed='right';
            rules.push('complex-coda-h-aspiration-requires-morphology');
            nextRules.push('complex-coda-h-aspiration-requires-morphology');
            continue;
          }
        }else{
          a.__complexHAspirationUnlicensed='left';
          b.__complexHAspirationUnlicensed='right';
          rules.push('complex-coda-h-aspiration-requires-morphology');
          nextRules.push('complex-coda-h-aspiration-requires-morphology');
          continue;
        }
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
      if(exactR016Licensed){
        // NIKL §11: exact verbal-stem examples retain ㄹ and fortify ㄱ.
        a.coda='ㄹ';
        b.onset='ㄲ';
        rules.push('rieul-giyeok-exception-§11-exact-form');
        nextRules.push('rieul-giyeok-exception-§11-exact-form');
      }else if(exactR014Licensed){
        // A dictionary-attested compound such as 닭갈비 is not the §11
        // verbal-stem exception. Resolve this exact form through §28 instead
        // of marking it unresolved before the compound rule can run.
        a.coda=representative(a.coda);
        b.onset='ㄲ';
        rules.push('compound-fortition-§28-exact-form');
        nextRules.push('compound-fortition-§28-exact-form');
      }else{
        a.__rieulGiyeokUnlicensed='left';
        b.__rieulGiyeokUnlicensed='right';
        rules.push('rieul-giyeok-exception-requires-morphology');
        nextRules.push('rieul-giyeok-exception-requires-morphology');
      }
      continue;
    }

    // NIKL §27 official Q&A 330963 confirms attached ending -ㄹ게 as [ㄹ께].
    // The rule is productive only for the orthographic -ㄹ게 ending inside one eojeol.
    // Check the source syllable's original coda: a complex coda may already have
    // been reduced to ㄹ by an earlier ordered rule and must not be mistaken for
    // the orthographic -ㄹ게 ending (e.g. 넓게 is not 널께).
    const licensedLGeEnding=currentWord.endsWith(a.char+'게')||currentWord.endsWith(a.char+'게요');
    if(licensedLGeEnding&&a.coda==='ㄹ'&&decompose(a.char)?.coda==='ㄹ'&&b.char==='게'&&b.onset==='ㄱ'){
      b.onset='ㄲ';
      rules.push('adnominal-l-fortition-§27-attested-l-ge');
      nextRules.push('adnominal-l-fortition-§27-attested-l-ge');
      continue;
    }

    // C08 exact forms: NIKL Q&A 327466 supports the copula + -(으)ㄹ + 수
    // parse in 무고일 수도; NIKL's 2021 public-language guideline p.106
    // confirms dependent noun 시 after -을 in 했을 시. §27 supplies fortition.
    // Keep these as full-eojeol licenses; do not generalize to -성 or -ㄹ+ㅅ.
    const exactAdnominalPair=NIKL_27_ADNOMINAL_FORMS.get(currentWord);
    if(exactAdnominalPair===exactMorphPair&&a.coda==='ㄹ'&&decompose(a.char)?.coda==='ㄹ'&&PLAIN_TO_FORTIS[b.onset]){
      b.onset=PLAIN_TO_FORTIS[b.onset];
      rules.push('adnominal-r-fortition-§27-exact-form');
      nextRules.push('adnominal-r-fortition-§27-exact-form');
      continue;
    }

    // NIKL §25: stem-final ㄼ/ㄾ + licensed ending-initial ㄱ/ㄷ/ㅅ/ㅈ.
    if(exactR011Licensed&&['ㄼ','ㄾ'].includes(a.coda)&&['ㄱ','ㄷ','ㅅ','ㅈ'].includes(b.onset)&&PLAIN_TO_FORTIS[b.onset]){
      // NIKL §25: ㄾ in 훑- is realized as ㄹ in the coda before the licensed ending.
      if(a.coda==='ㄾ')a.coda='ㄹ';
      b.onset=PLAIN_TO_FORTIS[b.onset];
      rules.push('stem-lb-lt-fortition-§25-exact-form');
      nextRules.push('stem-lb-lt-fortition-§25-exact-form');
      continue;
    }

    // NIKL §26: exact Sino-Korean ㄹ + ㄷ/ㅅ/ㅈ fortition examples.
    if(exactR012Licensed&&a.coda==='ㄹ'&&['ㄷ','ㅅ','ㅈ'].includes(b.onset)&&PLAIN_TO_FORTIS[b.onset]){
      b.onset=PLAIN_TO_FORTIS[b.onset];
      rules.push('sino-korean-rieul-fortition-§26-exact-form');
      nextRules.push('sino-korean-rieul-fortition-§26-exact-form');
      continue;
    }

    // NIKL §28: compound fortition is lexical/morphological, so require an
    // exact source-backed full-form + boundary license (e.g. 물가[물까]).
    if(exactR014Licensed&&a.coda&&PLAIN_TO_FORTIS[b.onset]){
      b.onset=PLAIN_TO_FORTIS[b.onset];
      rules.push('compound-fortition-§28-exact-form');
      nextRules.push('compound-fortition-§28-exact-form');
      continue;
    }

    const exactR010Pair=NIKL_24_STEM_NM_ENDING_FORMS.get(sourceText);
    const currentPair=a.char+'>'+b.char;
    const fortisRep=representative(a.coda);
    if(exactR010Pair===currentPair&&['ㄴ','ㅁ'].includes(fortisRep)&&PLAIN_TO_FORTIS[b.onset]){
      // Exact §24 licenses also expose the realized simple coda when the
      // written stem ends in a complex coda (e.g. 닮고 → 담꼬, 젊지 → 점찌).
      // Do not simplify unrelated complex codas without their own evidence.
      if(['ㄵ','ㄶ'].includes(a.coda)&&fortisRep==='ㄴ')a.coda='ㄴ';
      else if(['ㄻ','ㄼ'].includes(a.coda)&&fortisRep==='ㅁ')a.coda='ㅁ';
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
