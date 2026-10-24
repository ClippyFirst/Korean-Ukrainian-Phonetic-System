/**
 * IPA → Ukrainian mapping layer.
 *
 * The generated table is a projection of canonical_correspondence.csv plus
 * ipa_target_overrides.csv. Those CSVs are the source of truth; CI checks
 * that this browser artifact has not drifted from them.
 */
import { IPA_TARGET_MAPPINGS, IPA_MAPPING_CONFLICTS } from './ipa_target_data.js';

const ORDERED_MAPPINGS = [...IPA_TARGET_MAPPINGS].sort(
  (a,b) => b.source_ipa.length-a.source_ipa.length || a.source_ipa.localeCompare(b.source_ipa)
);
const MAPPING_BY_IPA = new Map(IPA_TARGET_MAPPINGS.map(row => [row.source_ipa,row]));

// Compatibility export for consumers that need the simple IPA/grapheme pairs.
export const IPA_TO_UKRAINIAN = ORDERED_MAPPINGS.map(
  row => [row.source_ipa,row.target_grapheme]
);

function addFeature(features, ipa, offset, feature, note){
  features.push({
    ipa,
    offset,
    feature,
    handling:'preserved-in-ipa-not-rendered-in-ukrainian-target',
    note
  });
}

export function traceIpaMappingDetailed(ipa){
  ipa=String(ipa??'').normalize('NFC');
  const tokens=[];
  const features=[];
  for(let i=0;i<ipa.length;){
    if(/\s/u.test(ipa[i]) || ipa[i]==='.' || ipa[i]==='#'){i++;continue;}
    if(ipa[i]==='ː'){
      addFeature(features,'ː',i,'vowel-length','Довгота збережена в IPA; окремого знака довготи в практичному українському записі немає.');
      i++;
      continue;
    }
    const match=ORDERED_MAPPINGS.find(row=>ipa.startsWith(row.source_ipa,i));
    if(!match){
      return {tokens,features,unknown:ipa.slice(i),reason:'unmapped_ipa_sequence',status:'unavailable'};
    }
    if(Object.hasOwn(IPA_MAPPING_CONFLICTS,match.source_ipa)){
      return {tokens,features,unknown:match.source_ipa,reason:'ambiguous_ipa_mapping',status:'unavailable'};
    }
    tokens.push({
      ipa:match.source_ipa,
      ukrainian:match.target_grapheme,
      mapping_id:match.mapping_id,
      status:match.status,
      scope:match.scope,
      source_ref:match.source_ref,
      notes:match.notes,
      mapping_source:match.mapping_source,
      offset:i
    });
    if(match.source_ipa.includes('ʰ')){
      addFeature(features,'ʰ',i+match.source_ipa.indexOf('ʰ'),'aspiration','Аспірація збережена в IPA, але окремо не позначена українською графемою.');
    }
    if(match.source_ipa.includes('͈')){
      addFeature(features,'͈',i+match.source_ipa.indexOf('͈'),'fortisness','Фортісність збережена в IPA, але окремо не позначена українською графемою.');
    }
    if(match.source_ipa.includes('̚')){
      addFeature(features,'̚',i+match.source_ipa.indexOf('̚'),'unreleased-stop','Невибуховість коди збережена в IPA, але окремо не позначена українською графемою.');
    }
    i+=match.source_ipa.length;
  }
  if(!tokens.length && !features.length){
    return {tokens,features,unknown:'',reason:'empty_ipa',status:'unavailable'};
  }
  return {
    tokens,
    features,
    unknown:'',
    reason:null,
    status:tokens.some(token=>token.status==='provisional')?'provisional':'model-selected'
  };
}

// Stable legacy trace shape; detailed metadata is available via the new API.
export function traceIpaMapping(ipa){
  const result=traceIpaMappingDetailed(ipa);
  return {
    tokens:result.tokens.map(({ipa,ukrainian})=>({ipa,ukrainian})),
    features:result.features,
    unknown:result.unknown
  };
}

export function ipaSyllableToUkrainian(ipa){
  const mapped=traceIpaMappingDetailed(ipa);
  return mapped.unknown
    ? {text:'',unknown:mapped.unknown}
    : {text:mapped.tokens.map(token=>token.ukrainian).join(''),unknown:''};
}

export function ipaSyllablesToUkrainian(ipaSyllables){
  const mapped=ipaSyllables.map(ipaSyllableToUkrainian);
  return {syllables:mapped.map(item=>item.text),unknown:mapped.find(item=>item.unknown)?.unknown||''};
}

export function ipaTargetForSource(source,ipa){
  const sourceText=String(source??'');
  const sourceIpa=String(ipa??'').normalize('NFC');
  const ipaUnits=sourceIpa.split(/[.\s]+/u).filter(Boolean);
  if(!ipaUnits.length){
    return {text:'',syllables:[],unknown:'',status:'unavailable',reason:'empty_ipa',mappingTrace:[]};
  }
  const detailed=ipaUnits.map(traceIpaMappingDetailed);
  const syllables=detailed.map(item=>item.unknown?'':item.tokens.map(token=>token.ukrainian).join(''));
  const unknown=detailed.find(item=>item.unknown)?.unknown||'';
  const mappingTrace=detailed.flatMap(item=>item.tokens);
  const status=unknown
    ? 'unavailable'
    : detailed.some(item=>item.status==='provisional')?'provisional':'model-selected';
  if(unknown){
    const failed=detailed.find(item=>item.unknown);
    return {text:'',syllables,unknown,status,reason:failed?.reason||'unmapped_ipa_sequence',mappingTrace};
  }

  // The IPA contract is syllable-aligned. A mismatch is not repaired by
  // guessing which Ukrainian syllable belongs to which Hangul syllable.
  const expectedSyllables=[...sourceText].filter(ch=>/[가-힣]/u.test(ch)).length;
  if(expectedSyllables && expectedSyllables!==ipaUnits.length){
    return {text:'',syllables,unknown:'',status:'unavailable',reason:'ipa_source_alignment_mismatch',mappingTrace};
  }

  if(!/[가-힣]/u.test(sourceText)){
    return {text:syllables.join(''),syllables,unknown:'',status,reason:null,mappingTrace};
  }
  let text='';
  let targetIndex=0;
  for(const token of (sourceText.match(/\s+|[가-힣]+|[^\s가-힣]+/gu)||[])){
    if(/^\s+$/u.test(token)){text+=token;continue;}
    if(/^[가-힣]+$/u.test(token)){
      const count=[...token].length;
      text+=syllables.slice(targetIndex,targetIndex+count).join('');
      targetIndex+=count;
    }else{
      text+=token;
    }
  }
  return {text,syllables,unknown:'',status,reason:null,mappingTrace};
}
