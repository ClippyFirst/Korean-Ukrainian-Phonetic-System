/**
 * Browser engine entry: Korean → Ukrainian phonetic conversion.
 * Split across engine_shared / rules_ctx / rules_phrase / ipa / lexical / convert.
 */
import { parseCsv, decompose, createMap } from './engine_shared.js';
import { convertText } from './engine_convert.js';
import { ipaSyllableToUkrainian, ipaSyllablesToUkrainian, ipaTargetForSource, ipaTargetForProfile } from './engine_ipa.js';

export { decompose, parseCsv } from './engine_shared.js';
export { ipaSyllableToUkrainian, ipaSyllablesToUkrainian, ipaTargetForSource };


function attachSuperSoftCoverage(source,result){
  const text=String(source??'');
  const codepoints=[...text];
  const spans=[];
  let cursor=0;
  for(const item of result.trace||[]){
    const value=String(item.source??'');
    if(!value)continue;
    // Trace entries must align monotonically with the original source.
    // Never retry from offset zero: doing so can attach a repeated token to an
    // earlier occurrence and falsely inflate the coverage metric.
    const start=text.indexOf(value,cursor);
    if(start<0)continue;
    const end=start+value.length;
    spans.push({start,end,item});
    item.sourceStart=start;
    item.sourceEnd=end;
    cursor=end;
  }
  let utf16Offset=0;
  const sourceUnits=codepoints.map(char=>{
    const start=utf16Offset;utf16Offset+=char.length;
    return {char,start,end:utf16Offset};
  });
  const spanAt=new Array(text.length).fill(null);
  for(const span of spans){
    for(let offset=span.start;offset<span.end;offset++)spanAt[offset]=span.item;
  }
  const hangul=sourceUnits.filter(unit=>/[가-힣]/u.test(unit.char));
  const traced=sourceUnits.filter(unit=>spanAt[unit.start]&&spanAt[unit.end-1]);
  const covered=hangul.filter(unit=>{
    const item=spanAt[unit.start];
    if(!item||spanAt[unit.end-1]!==item)return false;
    const target=String(item.output||item.candidateOutput||'');
    return Boolean(item.ipa&&target&&!/[⟦⟧]/u.test(target));
  });
  const hangulItems=hangul.map(unit=>{
    const item=spanAt[unit.start];
    return item&&spanAt[unit.end-1]===item?item:null;
  });
  const lowConfidenceUnits=hangulItems.filter(item=>item&&(
    item.confidence==='low'||
    ['super-soft-orthographic-fallback','super-soft-practical-heuristic','super-soft-morphology-heuristic'].includes(item.status)
  )).length;
  const provisionalTargetUnits=hangulItems.filter(item=>item&&(
    item.candidateStatus==='provisional'||item.targetStatus==='provisional'||
    item.targetReason==='provisional_mapping_requires_review'
  )).length;
  const modelSelectedTargetUnits=hangulItems.filter(item=>item&&item.targetStatus==='model-selected').length;
  const unavailableTargetUnits=hangulItems.filter(item=>item&&(
    item.targetStatus==='unavailable'&&item.candidateStatus!=='provisional'
  )).length;
  const missingIpaUnits=hangulItems.filter(item=>!item||!String(item.ipa||'').trim()).length;
  const ratio=(part,total)=>total?part/total:1;
  result.coverage={
    scope:'modern-hangul-syllable-blocks',
    input_total:hangul.length,
    input_covered:covered.length,
    input_uncovered:hangul.length-covered.length,
    input_coverage:ratio(covered.length,hangul.length),
    source_span_total:sourceUnits.length,
    source_span_covered:traced.length,
    source_span_uncovered:sourceUnits.length-traced.length,
    untraced_source_offsets:sourceUnits.filter(unit=>!spanAt[unit.start]||!spanAt[unit.end-1]).map(unit=>({source:unit.char,start:unit.start,end:unit.end})),
    trace_coverage:ratio(traced.length,sourceUnits.length),
    low_confidence_units:lowConfidenceUnits,
    low_confidence_share:ratio(lowConfidenceUnits,hangul.length),
    heuristic_share:ratio(lowConfidenceUnits,hangul.length),
    target_model_selected_units:modelSelectedTargetUnits,
    target_provisional_units:provisionalTargetUnits,
    target_unavailable_units:unavailableTargetUnits,
    ipa_missing_units:missingIpaUnits,
    verified_pronunciation_units:null,
    verified_pronunciation_rate:null,
    pronunciation_verification_status:'not_independently_adjudicated',
    complete:covered.length===hangul.length&&traced.length===sourceUnits.length
  };
  return result;
}

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
  const upstreamBlocked=result.status==='unresolved'||typeof result.ipa!=='string'||!result.ipa.trim();
  const gateReason=result.status==='unresolved'
    ? 'unresolved_korean_phonology'
    : typeof result.ipa!=='string'||!result.ipa.trim() ? 'empty_ipa' : gated.reason;
  return {
    ...result,
    ukrainian:upstreamBlocked?'':(gated.text??''),
    candidate_ukrainian:null,
    candidate_status:null,
    // Keep source/IPA provenance inspectable, but do not leak legacy target
    // candidates through per-unit traces or variants in strict mode.
    trace:(result.trace||[]).map(item=>({
      ...item, output:'', candidateOutput:null, candidateStatus:null,
      targetMappings:[], targetFeatures:[]
    })),
    variants:(result.variants||[]).map(item=>({...item, ukrainian:''})),
    target_status:upstreamBlocked?'unavailable':gated.status,
    target_reason:gateReason||null,
    target_adapter:'profile-gated'
  };
}

export function createEngine(csv, lexiconCsv=''){
  const map=createMap(csv);
  const lexicon=new Map(parseCsv(lexiconCsv).map(r=>[r.input,r]));
  return{
    convert:function(text,options={}){const mode=options.morphologyMode==='super-soft'?'super-soft':options.morphologyMode;const result=convertText(text,map,lexicon,false,{...options,morphologyMode:mode,preserveUnresolvedSource:options.preserveUnresolvedSource??(mode==='super-soft'||(/[가-힣]/u.test(text)&&/[^가-힣]/u.test(text)))});const gated=applyProfileGate(text,result,options);return mode==='super-soft'?attachSuperSoftCoverage(text,gated):gated},
    // G2P surface text is already normalized; derive IPA/target without
    // re-running coda, liaison, assimilation, or fortition rules.
    convertSurface:function(text,options={}){const result=convertText(text,map,new Map(),true,{...options,morphologyMode:'strict',surfaceMode:true,preserveUnresolvedSource:/[가-힣]/u.test(text)&&/[^가-힣]/u.test(text)});return applyProfileGate(text,result,options)},
    decompose
  };
}
