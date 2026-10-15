/**
 * Browser engine entry: Korean → Ukrainian phonetic conversion.
 * Split across engine_shared / rules_ctx / rules_phrase / ipa / lexical / convert.
 */
import { parseCsv, decompose, createMap } from './engine_shared.js';
import { convertText } from './engine_convert.js';

export { decompose, parseCsv } from './engine_shared.js';

export function createEngine(csv, lexiconCsv=''){
  const map=createMap(csv);
  const lexicon=new Map(parseCsv(lexiconCsv).map(r=>[r.input,r]));
  return{convert:function(text,options={}){return convertText(text,map,lexicon,false,options)},decompose};
}
