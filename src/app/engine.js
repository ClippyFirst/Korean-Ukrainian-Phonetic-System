import { SOFT_FORMAL_ENDINGS, isSoftFormalPair, trySoftFormal, softStatusForUnit, tryPracticalHeuristic, practicalStatusForUnit } from './soft_morphology.js';
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
const H_CODA_ASPIRATION={
  'ㄱ':'ㅋ','ㄷ':'ㅌ','ㅈ':'ㅊ'
};
const LEXICAL_B_CODA_PREFIXES=new Set(['넓죽','넓둥','넓적']);
const NIKL_27_ADNOMINAL_PHRASES=new Map([
  ['할 것을','ㄱ'],['갈 데가','ㄷ'],['할 바를','ㅂ'],['할 수는','ㅅ'],['읽을 수','ㅅ'],
  ['할 적에','ㅈ'],['갈 곳','ㄱ'],['할 도리','ㄷ'],['만날 사람','ㅅ']
]);
const NIKL_29_PHRASE_INSERTION=new Map([
  ['한 일',{onset:'ㄴ'}],['옷 입다',{coda:'ㄴ',onset:'ㄴ'}],
  ['먹은 엿',{onset:'ㄴ'}],['할 일',{onset:'ㄹ'}],
  ['잘 입다',{onset:'ㄹ'}],['먹을 엿',{onset:'ㄹ'}]
]);
const NIKL_30_SAISIOT_INSERTION_FORMS=new Set(['깻잎','나뭇잎','베갯잇','도리깻열']);

export function parseCsv(text){
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
export function decompose(ch){
  const cp=ch.codePointAt(0);
  if(cp<HANGUL_BASE||cp>HANGUL_END)return null;
  const n=cp-HANGUL_BASE,l=Math.floor(n/N_COUNT),v=Math.floor((n%N_COUNT)/T_COUNT),t=n%T_COUNT;
  return{char:ch,onset:ONSETS[l],vowel:VOWELS[v],coda:CODAS[t],hasCoda:t!==0};
}
function createMap(csv){return new Map(parseCsv(csv).map(r=>[r.layer+':'+r.input,r]));}
function get(map,layer,key){return map.get(layer+':'+key);}
function isHangulUnit(units,i){return Boolean(units[i]&&units[i].type==='hangul');}
function nextHangul(units,i){return isHangulUnit(units,i+1)?units[i+1]:null;}
function prevHangul(units,i){return isHangulUnit(units,i-1)?units[i-1]:null;}
function representative(coda){return FINAL_REPRESENTATIVE[coda]??coda;}

function renderStructured(units,values,separator){
  let result='';
  for(let i=0;i<units.length;i++){
    if(units[i].type==='literal'){result+=units[i].char;continue;}
    const value=values[i]??'';
    if(value==='')continue;
    if(i>0&&units[i-1].type==='hangul'&&(values[i-1]??'')!=='')result+=separator;
    result+=value;
  }
  return result;
}

function applyContextualRules(units,sourceText='',{ morphologyMode = 'strict' } = {}){
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

    const fortisRep=representative(a.coda);
    if(PLAIN_TO_FORTIS[b.onset]&&['ㄱ','ㄷ','ㅂ'].includes(fortisRep)){
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

// NOTE: Full engine continues below - this is a partial restore attempt
export function createEngine(csv,lexiconCsv=''){
  const map=createMap(csv);
  const lexicon=new Map(parseCsv(lexiconCsv).map(r=>[r.input,r]));
  return{convert:function(text,options={}){return convertText(text,map,lexicon,false,options)},decompose};
}

function convertText(text,map,lexicon=new Map(),skipLexicon=false,options={}){
  const morphologyMode=options.morphologyMode==='practical'?'practical':options.morphologyMode==='soft'?'soft':'strict';
  const practicalOn=morphologyMode==='practical';
  // Minimal stub for restore - WILL BE REPLACED with full content
  return {source:text,ukrainian:'',ipa:'',analysis:'',trace:[],issues:['engine incomplete - push full file'],status:'unresolved'};
}
