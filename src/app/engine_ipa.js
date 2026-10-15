/**
 * IPA → Ukrainian mapping layer.
 */
// Canonical second stage: Ukrainian output is rendered from the generated IPA,
// never independently from Hangul jamo. Longest-match tokenization preserves
// Korean phonetic contrasts that matter to the project target (e.g. ɡ/ k,
// dʑ/tɕ, ɕ/s, and coda unreleased stops).
export const IPA_TO_UKRAINIAN = [
  ['kʰjʌ','кхьо'],['hjʌ','гьо'],['njʌ','ньо'],['njo','ньо'],['nju','ню'],
  ['ɲʌ','ньо'],['ɲa','ня'],['ɲo','ньо'],['ɲu','ню'],
  ['ljʌ','льо'],['lju','лю'],
  ['tɕ͈','ч'],['tɕʰ','ч'],['tɕ','ч'],['dʑ','дж'],['ɕ͈','ш'],['ɕ','ш'],
  ['k͈','к'],['t͈','т'],['p͈','п'],['s͈','с'],
  ['kʰ','к'],['tʰ','т'],['pʰ','п'],['k̚','к'],['t̚','т'],['p̚','п'],
  ['ɰi','ий'],['jʌ','йо'],['jɛ','є'],['ja','я'],['je','є'],['jo','йо'],['ju','ю'],
  ['wa','ва'],['wɛ','ве'],['wʌ','во'],['we','ве'],['aː','а'],
  ['ɡ','ґ'],['k','к'],['g','ґ'],['t','т'],['d','д'],['p','п'],['b','б'],
  ['ɲ','нь'],['n','н'],['m','м'],['ŋ','н'],['ɾ','р'],['r','р'],['l','л'],['h','г'],
  ['s','с'],['a','а'],['ɛ','е'],['ʌ','о'],['e','е'],['o','о'],['u','у'],
  ['ɯ','и'],['i','і'],['ø','ве'],['y','ві'],['w','в'],['j','й']
].sort((a,b)=>b[0].length-a[0].length);

export function ipaSyllableToUkrainian(ipa){
  ipa=ipa.replace(/ː/gu,''); // vowel length is retained in IPA, not duplicated in the Ukrainian target
  let output='';
  for(let i=0;i<ipa.length;){
    if(/\s/u.test(ipa[i])){i++;continue;}
    const match=IPA_TO_UKRAINIAN.find(([token])=>ipa.startsWith(token,i));
    if(!match)return {text:'',unknown:ipa.slice(i)};
    output+=match[1];
    i+=match[0].length;
  }
  return {text:output,unknown:''};
}

export function ipaSyllablesToUkrainian(ipaSyllables){
  const mapped=ipaSyllables.map(ipaSyllableToUkrainian);
  return {syllables:mapped.map(item=>item.text),unknown:mapped.find(item=>item.unknown)?.unknown||''};
}

export function ipaTargetForSource(source,ipa){
  const ipaUnits=(ipa||'').split(/\s+/u).filter(Boolean);
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

