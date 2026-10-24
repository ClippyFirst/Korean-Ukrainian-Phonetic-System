/**
 * IPA → Ukrainian mapping layer.
 */
// Canonical second stage: Ukrainian output is rendered from generated IPA,
// never independently from Hangul jamo. Longest-match tokenization preserves
// the declared mapping distinctions (e.g. ɡ/k and dʑ/tɕ); distinctions that
// Ukrainian orthography cannot encode are surfaced as explicit feature records.
export const IPA_TO_UKRAINIAN = [
  ['kʰjʌ','кхьо'],['hjʌ','гьо'],['njʌ','ньо'],['njo','ньо'],['nju','ню'],
  ['ɲʌ','ньо'],['ɲa','ня'],['ɲo','ньо'],['ɲu','ню'],
  ['ljʌ','льо'],['lju','лю'],
  ['t͡ɕ͈','ч'],['t͡ɕʰ','ч'],['t͡ɕ','ч'],['d͡ʑ','дж'],['tɕ͈','ч'],['tɕʰ','ч'],['tɕ','ч'],['dʑ','дж'],['ɕ͈','ш'],['ɕ','ш'],
  ['k͈','к'],['t͈','т'],['p͈','п'],['s͈','с'],
  ['kʰ','к'],['tʰ','т'],['pʰ','п'],['k̚','к'],['t̚','т'],['p̚','п'],
  ['ɰi','ий'],['jʌ','йо'],['jɛ','є'],['ja','я'],['je','є'],['jo','йо'],['ju','ю'],
  ['wa','ва'],['wɛ','ве'],['wʌ','во'],['we','ве'],
  ['ɡ','ґ'],['k','к'],['t','т'],['d','д'],['p','п'],['b','б'],
  ['ɲ','нь'],['n','н'],['m','м'],['ŋ','н'],['ɾ','р'],['r','р'],['l','л'],['h','г'],
  ['s','с'],['a','а'],['ɛ','е'],['ʌ','о'],['e','е'],['o','о'],['u','у'],
  ['ɯ','и'],['i','і'],['ø','ве'],['y','ві'],['w','в'],['j','й']
].sort((a,b)=>b[0].length-a[0].length);

export function traceIpaMapping(ipa){
  ipa=String(ipa??'');
  const tokens=[];
  const features=[];
  for(let i=0;i<ipa.length;){
    if(/\s/u.test(ipa[i])){i++;continue;}
    if(ipa[i]==='ː'){
      features.push({
        ipa:'ː',
        offset:i,
        handling:'omitted-from-ukrainian-target',
        note:'довгота збережена в IPA; український запис не має окремого знака довготи'
      });
      i++;
      continue;
    }
    const match=IPA_TO_UKRAINIAN.find(([token])=>ipa.startsWith(token,i));
    if(!match)return {tokens,features,unknown:ipa.slice(i)};
    const token=match[0];
    tokens.push({ipa:token,ukrainian:match[1]});
    // Do not imply that a successful grapheme mapping preserves every IPA
    // feature. The IPA remains intact in the token trace; these records make
    // target-layer neutralizations visible to both the UI and API consumers.
    const omittedFeatures=[
      {
        marker:'ʰ',
        feature:'aspiration',
        note:'аспірація збережена в IPA, але не має окремого позначення в українському відповіднику'
      },
      {
        marker:'͈',
        feature:'fortisness',
        note:'фортисність збережена в IPA, але не має окремого позначення в українському відповіднику'
      },
      {
        marker:'̚',
        feature:'unreleased-stop',
        note:'непідривність кінцевого проривного збережена в IPA, але не має окремого позначення в українському відповіднику'
      }
    ];
    for(const item of omittedFeatures){
      if(token.includes(item.marker)){
        features.push({
          ipa:token,
          offset:i,
          feature:item.feature,
          handling:'not-encoded-in-ukrainian-target',
          note:item.note
        });
      }
    }
    i+=token.length;
  }
  return {tokens,features,unknown:''};
}

export function ipaSyllableToUkrainian(ipa){
  const mapped=traceIpaMapping(ipa);
  return mapped.unknown?{text:'',unknown:mapped.unknown}:{text:mapped.tokens.map(token=>token.ukrainian).join(''),unknown:''};
}

export function ipaSyllablesToUkrainian(ipaSyllables){
  const mapped=ipaSyllables.map(ipaSyllableToUkrainian);
  return {syllables:mapped.map(item=>item.text),unknown:mapped.find(item=>item.unknown)?.unknown||''};
}

export function ipaTargetForSource(source,ipa){
  // Accept either the browser's whitespace-separated syllables or the
  // dot-separated syllable boundaries used by the Python research renderer.
  // Dots are boundary metadata here, never consonant/vowel phones.
  const ipaUnits=(ipa||'').split(/[.\s]+/u).filter(Boolean);
  const mapped=ipaSyllablesToUkrainian(ipaUnits);
  if(mapped.unknown||!ipaUnits.length)return {text:'',syllables:mapped.syllables,unknown:mapped.unknown};
  if(!/\s/u.test(source||''))return {text:mapped.syllables.join(''),syllables:mapped.syllables,unknown:''};
  let text='';
  let targetIndex=0;
  for(const token of ((source||'').match(/\s+|[^\s]+/gu)||[])){
    if(/^\s+$/u.test(token)){text+=token;continue;}
    const count=/^[가-힣]+$/u.test(token)?[...token].length:1;
    text+=mapped.syllables.slice(targetIndex,targetIndex+count).join('');
    targetIndex+=count;
  }
  text+=mapped.syllables.slice(targetIndex).join('');
  return {text,syllables:mapped.syllables,unknown:''};
}

