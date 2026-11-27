/** Unicode-aware segment IR for inspectable Korean Extended IPA. */
const AFFRICATES = new Map([['t͡ɕ','tɕ'],['d͡ʑ','dʑ'],['t͡s','ts'],['d͡z','dz']]);
const BASES = ['tɕ','dʑ','ts','dz','p','b','t','d','k','ɡ','m','n','ɲ','ŋ','l','ɾ','ɭ','s','z','ɕ','ʑ','ʃ','ʒ','h','ɦ','ç','x','ɸ','β','ɣ','ʝ','j','w','ɥ','i','y','ɨ','ɯ','u','e','ɛ','ø','ɤ','o','ʌ','ə','ɐ','a','ɑ','ɔ','æ','ɪ','ʊ','ʏ','œ'].sort((a,b)=>b.length-a.length);
const MODIFIERS = new Set([...('ʰʱʲʷːˑ͈͉̥̬̩̯̝̞̹̜̟̠̃̚͡')]);
const CONSONANTS = {
 p:['bilabial','plosive','voiceless'],b:['bilabial','plosive','voiced'],t:['alveolar','plosive','voiceless'],d:['alveolar','plosive','voiced'],k:['velar','plosive','voiceless'],'ɡ':['velar','plosive','voiced'],
 tɕ:['alveolo-palatal','affricate','voiceless'],dʑ:['alveolo-palatal','affricate','voiced'],ts:['alveolar','affricate','voiceless'],dz:['alveolar','affricate','voiced'],
 s:['alveolar','fricative','voiceless'],z:['alveolar','fricative','voiced'],'ɕ':['alveolo-palatal','fricative','voiceless'],'ʑ':['alveolo-palatal','fricative','voiced'],'ʃ':['postalveolar','fricative','voiceless'],'ʒ':['postalveolar','fricative','voiced'],
 m:['bilabial','nasal','voiced'],n:['alveolar','nasal','voiced'],'ɲ':['palatal','nasal','voiced'],'ŋ':['velar','nasal','voiced'],
 l:['alveolar','lateral-approximant','voiced'],'ɭ':['retroflex','lateral-approximant','voiced'],'ɾ':['alveolar','tap','voiced'],
 h:['glottal','fricative','voiceless'],'ɦ':['glottal','fricative','voiced'],'ç':['palatal','fricative','voiceless'],x:['velar','fricative','voiceless'],'ɸ':['bilabial','fricative','voiceless'],'β':['bilabial','fricative','voiced'],'ɣ':['velar','fricative','voiced'],'ʝ':['palatal','fricative','voiced'],j:['palatal','approximant','voiced'],w:['labio-velar','approximant','voiced'],'ɥ':['labio-palatal','approximant','voiced']
};
const VOWELS = {
 i:['close','front','unrounded'],y:['close','front','rounded'],'ɨ':['close','central','unrounded'],'ɯ':['close','back','unrounded'],u:['close','back','rounded'],e:['close-mid','front','unrounded'],'ɛ':['open-mid','front','unrounded'],'ø':['close-mid','front','rounded'],'ɤ':['close-mid','back','unrounded'],o:['close-mid','back','rounded'],'ʌ':['open-mid','back','unrounded'],'ə':['mid','central','unrounded'],'ɐ':['near-open','central','unrounded'],a:['open','front','unrounded'],'ɑ':['open','back','unrounded'],'ɔ':['open-mid','back','rounded'],'æ':['near-open','front','unrounded'],'ɪ':['near-close','near-front','unrounded'],'ʊ':['near-close','near-back','rounded'],'ʏ':['near-close','near-front','rounded'],'œ':['open-mid','front','rounded']
};
function featuresFor(base, modifiers) {
 let f;
 if(CONSONANTS[base]){const [place,manner,voicing]=CONSONANTS[base];f={major_class:'consonant',place,manner,voicing};}
 else if(VOWELS[base]){const [height,backness,roundedness]=VOWELS[base];f={major_class:'vowel',height,backness,roundedness};}
 else f={major_class:'unknown'};
 f.aspiration=f.major_class==='consonant'?(modifiers.includes('ʰ')?'aspirated':'unaspirated'):'not-applicable';
 f.length=modifiers.includes('ː')?'long':modifiers.includes('ˑ')?'half-long':'unspecified';
 f.fortisness=f.major_class==='consonant'?(modifiers.includes('͈')?'fortis':'unspecified'):'not-applicable';
 f.release=f.major_class==='consonant'?(modifiers.includes('̚')?'unreleased':'unspecified'):'not-applicable';
 f.secondary_articulation=[...(modifiers.includes('ʲ')?['palatalized']:[]),...(modifiers.includes('ʷ')?['labialized']:[])];
 f.nasalization=modifiers.includes('̃')?'nasalized':'unspecified';
 return f;
}
export function parseIpaSegments(ipa, options={}) {
 if(typeof ipa!=='string')throw new TypeError('IPA input must be a string');
 const sourceSpan=options.sourceSpan??null, provenance=options.provenance??{};
 if(sourceSpan!==null&&(!Number.isInteger(sourceSpan.start)||!Number.isInteger(sourceSpan.end)||sourceSpan.start<0||sourceSpan.end<=sourceSpan.start))throw new TypeError('sourceSpan must be a non-empty code-point span or null');
 const ruleIds=provenance.ruleIds??[], evidenceRefs=provenance.evidenceRefs??[];
 if(!Array.isArray(ruleIds)||!Array.isArray(evidenceRefs))throw new TypeError('provenance ruleIds and evidenceRefs must be arrays');
 const points=[...ipa], tokens=[];let i=0,segment=0,boundary=0,unknown=0;
 while(i<points.length){
  const ch=points[i];
  if(/\s/u.test(ch)||'.#/|'.includes(ch)){boundary++;tokens.push({id:'boundary-'+String(boundary).padStart(4,'0'),kind:'boundary',boundary:/\s/u.test(ch)?'word':ch==='.'?'syllable':'separator',ipa:ch,ipa_span:{start:(options.ipaOffset??0)+i,end:(options.ipaOffset??0)+i+1}});i++;continue;}
  const raw=[...AFFRICATES.keys()].sort((a,b)=>b.length-a.length).find(v=>points.slice(i,i+[...v].length).join('')===v);
  const base=raw?AFFRICATES.get(raw):BASES.find(v=>points.slice(i,i+[...v].length).join('')===v);
  if(!base){
   if(MODIFIERS.has(ch)&&tokens.at(-1)?.kind==='segment'){const t=tokens.at(-1);t.modifiers.push(ch);t.ipa+=ch;t.ipa_span.end=(options.ipaOffset??0)+i+1;t.features=featuresFor(t.base,t.modifiers);i++;continue;}
   unknown++;tokens.push({id:'unknown-'+String(unknown).padStart(4,'0'),kind:'unknown',ipa:ch,ipa_span:{start:(options.ipaOffset??0)+i,end:(options.ipaOffset??0)+i+1},source_span:null,reason:'unrecognized_ipa_code_point'});i++;continue;
  }
  const start=i;i+=raw?[...raw].length:[...base].length;const modifiers=[];
  while(i<points.length&&MODIFIERS.has(points[i]))modifiers.push(points[i++]);
  segment++;tokens.push({id:'segment-'+String(segment).padStart(4,'0'),kind:'segment',ipa:points.slice(start,i).join(''),base,modifiers,features:featuresFor(base,modifiers),ipa_span:{start:(options.ipaOffset??0)+start,end:(options.ipaOffset??0)+i},source_span:sourceSpan?{...sourceSpan}:null,source_alignment:sourceSpan?'syllable-span':'unavailable',provenance:{rule_ids:[...ruleIds],evidence_refs:[...evidenceRefs],evidence_status:provenance.evidenceStatus??'not-attributed',environment:provenance.environment??null}});
 }
 return tokens;
}
