/**
 * Browser engine entry: Korean → Ukrainian phonetic conversion.
 * Split across engine_shared / rules_ctx / rules_phrase / ipa / lexical / convert.
 */
import { parseCsv, decompose, createMap } from './engine_shared.js';
import { convertText } from './engine_convert.js';
import { ipaSyllableToUkrainian, ipaSyllablesToUkrainian, ipaTargetForSource } from './engine_ipa.js';

export { decompose, parseCsv } from './engine_shared.js';
export { ipaSyllableToUkrainian, ipaSyllablesToUkrainian, ipaTargetForSource };

export function createEngine(csv, lexiconCsv=''){
  const map=createMap(csv);
  const lexicon=new Map(parseCsv(lexiconCsv).map(r=>[r.input,r]));
  return{
    convert:function(text,options={}){return convertText(text,map,lexicon,false,{...options,preserveUnresolvedSource:options.preserveUnresolvedSource??(/[가-힣]/u.test(text)&&/[^가-힣]/u.test(text))})},
    // G2P surface text is already normalized; derive IPA/target without
    // re-running coda, liaison, assimilation, or fortition rules.
    convertSurface:function(text){return convertText(text,map,new Map(),true,{morphologyMode:'strict',surfaceMode:true,preserveUnresolvedSource:/[가-힣]/u.test(text)&&/[^가-힣]/u.test(text)})},
    decompose
  };
}
