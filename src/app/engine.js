/**
 * Browser engine entry: Korean → Ukrainian phonetic conversion.
 * Split across engine_shared / rules_ctx / rules_phrase / ipa / lexical / convert.
 */
import { parseCsv, decompose, createMap } from './engine_shared.js';
import { convertText } from './engine_convert.js';
import { ipaSyllableToUkrainian, ipaSyllablesToUkrainian, ipaTargetForSource, ipaTargetForProfile } from './engine_ipa.js';

export { decompose, parseCsv } from './engine_shared.js';
export { ipaSyllableToUkrainian, ipaSyllablesToUkrainian, ipaTargetForSource };

function applyProfileGate(source,result,options){
  if(options.requireAdjudicatedIpaProfile!==undefined && typeof options.requireAdjudicatedIpaProfile!=='boolean'){
    throw new TypeError('requireAdjudicatedIpaProfile must be a boolean');
  }
  if(options.requireAdjudicatedIpaProfile!==true)return result;
  const gated=ipaTargetForProfile(source,{
    ipa:result.ipa,
    ipa_profile:result.ipa_profile,
    ipa_profile_version:result.ipa_profile_version,
    ipa_profile_level:result.ipa_profile_level,
    ipa_profile_status:result.ipa_profile_status
  });
  return {
    ...result,
    ukrainian:gated.text??'',
    candidate_ukrainian:null,
    candidate_status:null,
    target_status:gated.status,
    target_reason:gated.reason||null,
    target_adapter:'profile-gated'
  };
}

export function createEngine(csv, lexiconCsv=''){
  const map=createMap(csv);
  const lexicon=new Map(parseCsv(lexiconCsv).map(r=>[r.input,r]));
  return{
    convert:function(text,options={}){const result=convertText(text,map,lexicon,false,{...options,preserveUnresolvedSource:options.preserveUnresolvedSource??(/[가-힣]/u.test(text)&&/[^가-힣]/u.test(text))});return applyProfileGate(text,result,options)},
    // G2P surface text is already normalized; derive IPA/target without
    // re-running coda, liaison, assimilation, or fortition rules.
    convertSurface:function(text,options={}){const result=convertText(text,map,new Map(),true,{...options,morphologyMode:'strict',surfaceMode:true,preserveUnresolvedSource:/[가-힣]/u.test(text)&&/[^가-힣]/u.test(text)});return applyProfileGate(text,result,options)},
    decompose
  };
}
