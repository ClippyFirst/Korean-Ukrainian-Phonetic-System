/**
 * Browser engine entry: Korean → Ukrainian phonetic conversion.
 * Split across engine_shared / rules_ctx / rules_phrase / ipa / lexical / convert.
 */
import { parseCsv, decompose, createMap } from './engine_shared.js';
import { convertText } from './engine_convert.js';
import { ipaSyllableToUkrainian, ipaSyllablesToUkrainian, ipaTargetForSource, traceIpaMapping } from './engine_ipa.js';

export { decompose, parseCsv } from './engine_shared.js';
export { ipaSyllableToUkrainian, ipaSyllablesToUkrainian, ipaTargetForSource, traceIpaMapping };

export function createEngine(csv, lexiconCsv=''){
  const map=createMap(csv);
  const lexicon=new Map(parseCsv(lexiconCsv).map(r=>[r.input,r]));
  // Runtime processing status (canonical/contextual/lexical/unresolved) is
  // not a claim that the phonetic transcription or Ukrainian target has been
  // independently adjudicated. Keep that evidence boundary machine-readable
  // for every public result, including G2P surface-adapter results.
  const withReviewStatus = result => ({
    ...result,
    ipaReviewStatus: 'not-independently-adjudicated',
    ipaIsGold: false,
    ukrainianTargetReviewStatus: 'not-independently-reviewed',
    ukrainianTargetIsGold: false
  });
  return{
    convert:function(text,options={}){return withReviewStatus(convertText(text,map,lexicon,false,{...options,preserveUnresolvedSource:options.preserveUnresolvedSource??(/[가-힣]/u.test(text)&&/[^가-힣]/u.test(text))}))},
    // G2P surface text is already normalized; derive IPA/target without
    // re-running coda, liaison, assimilation, or fortition rules.
    convertSurface:function(text){return withReviewStatus(convertText(text,map,new Map(),true,{morphologyMode:'strict',surfaceMode:true,preserveUnresolvedSource:/[가-힣]/u.test(text)&&/[^가-힣]/u.test(text)}))},
    decompose
  };
}
