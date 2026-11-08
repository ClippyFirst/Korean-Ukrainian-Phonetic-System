#!/usr/bin/env node
/**
 * Seoul Corpus phonemic IPA diagnostic using the paper's Table 3 phone map.
 * Only aggregate metrics are written; corpus word pairs stay in temporary CI.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createBrowserKozakKimEngine, normalizeIpa, normalizeIpaBroadCandidate, editDistance } from './benchmark_kozak_kim_browser.mjs';

const MODES = ['strict', 'soft', 'super-soft'];
const HANGUL = /^[\uac00-\ud7a3]+$/u;

function loadPairs(path) {
  const rows = JSON.parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(rows)) throw new TypeError('Seoul IPA corpus must be a JSON array');
  const counts = new Map();
  for (const [index, row] of rows.entries()) {
    if (!row || typeof row.source !== 'string' || !HANGUL.test(row.source) ||
        typeof row.gold !== 'string' || !row.gold.trim()) throw new TypeError('invalid Seoul IPA pair at index ' + index);
    const gold = normalizeIpa(row.gold);
    if (!gold) throw new TypeError('empty normalized Seoul IPA reference at index ' + index);
    const key = JSON.stringify([row.source, gold]);
    const current = counts.get(key);
    if (current) current.weight += 1;
    else counts.set(key, { source: row.source, gold, weight: 1 });
  }
  return [...counts.values()];
}

export function evaluateMode(pairs, engine, mode, totalOccurrences) {
  let scored=0, exact=0, distanceTotal=0, referenceChars=0, outputAvailable=0;
  let broadScored=0, broadExact=0, broadDistanceTotal=0, broadReferenceChars=0;
  let unresolved=0, partial=0, heuristic=0, typedFallback=0, targetUnavailable=0, targetProvisional=0, errors=0;
  let abstentionPenaltyDistance=0;
  const outputs=new Map();
  let profile=null;
  for (const pair of pairs) {
    try {
      const options=mode==='strict'?{morphologyMode:mode,ipaProfile:'clippyfirst-korean-broad-v1'}:{morphologyMode:mode};
      const result=engine.convert(pair.source,options);
      if(profile===null) profile={ipa_profile:result.ipa_profile??null,ipa_profile_version:result.ipa_profile_version??null,ipa_profile_status:result.ipa_profile_status??null};
      if(result.target_status==='unavailable') targetUnavailable+=pair.weight;
      if(result.target_status==='provisional'||result.candidate_status==='provisional') targetProvisional+=pair.weight;
      const trace=Array.isArray(result.trace)?result.trace:[];
      if(typeof result.ipa==='string'&&result.ipa.length>0)outputAvailable+=pair.weight;
      const fallback=result.phonetic_result_type==='mixed-surface-ipa-and-orthographic-fallback'||
        trace.some(item=>item?.status==='super-soft-orthographic-fallback'||item?.phoneticResultType==='orthographic-phonemic-fallback');
      if(fallback){
        typedFallback+=pair.weight;
        // Typed orthographic fallback is coverage, not source-resolved IPA.
        abstentionPenaltyDistance+=[...pair.gold].length*pair.weight;
        outputs.set(JSON.stringify([pair.source,pair.gold]),{status:'typed_fallback',predicted:null,exact:false,weight:pair.weight});
        continue;
      }
      const status=result.pronunciation_status??(result.ipa?'resolved':'unresolved');
      if(status==='heuristic'){heuristic+=pair.weight;abstentionPenaltyDistance+=[...pair.gold].length*pair.weight;outputs.set(JSON.stringify([pair.source,pair.gold]),{status,predicted:null,exact:false,weight:pair.weight});continue;}
      if(status==='partial'){partial+=pair.weight;abstentionPenaltyDistance+=[...pair.gold].length*pair.weight;outputs.set(JSON.stringify([pair.source,pair.gold]),{status,predicted:null,exact:false,weight:pair.weight});continue;}
      if(status==='unresolved'||!result.ipa){unresolved+=pair.weight;abstentionPenaltyDistance+=[...pair.gold].length*pair.weight;outputs.set(JSON.stringify([pair.source,pair.gold]),{status:'unresolved',predicted:null,exact:false,weight:pair.weight});continue;}
      const predicted=normalizeIpa(result.ipa);
      const distance=editDistance(predicted,pair.gold);
      const isExact=distance===0;
      scored+=pair.weight;if(isExact)exact+=pair.weight;
      distanceTotal+=distance*pair.weight;referenceChars+=[...pair.gold].length*pair.weight;
      abstentionPenaltyDistance+=distance*pair.weight;
      const broadPredicted=normalizeIpaBroadCandidate(predicted);
      const broadGold=normalizeIpaBroadCandidate(pair.gold);
      const broadDistance=editDistance(broadPredicted,broadGold);
      broadScored+=pair.weight;if(broadDistance===0)broadExact+=pair.weight;
      broadDistanceTotal+=broadDistance*pair.weight;broadReferenceChars+=[...broadGold].length*pair.weight;
      outputs.set(JSON.stringify([pair.source,pair.gold]),{status:'resolved',predicted,exact:isExact,weight:pair.weight});
    } catch {
      errors+=pair.weight;abstentionPenaltyDistance+=[...pair.gold].length*pair.weight;
      outputs.set(JSON.stringify([pair.source,pair.gold]),{status:'engine_error',predicted:null,exact:false,weight:pair.weight});
    }
  }
  const totalGoldChars=pairs.reduce((sum,pair)=>sum+[...pair.gold].length*pair.weight,0);
  return {summary:{
    mode,...profile,eligible_occurrences:totalOccurrences,unique_source_ipa_pairs:pairs.length,
    scored_occurrences:scored,coverage:totalOccurrences?scored/totalOccurrences:null,
    output_available_occurrences:outputAvailable,output_availability_rate:totalOccurrences?outputAvailable/totalOccurrences:null,
    exact_matches:exact,exact_match_rate_scored_only:scored?exact/scored:null,
    exact_match_rate_coverage_adjusted:totalOccurrences?exact/totalOccurrences:null,
    cer_scored_only:referenceChars?distanceTotal/referenceChars:null,
    cer_with_abstentions_as_deletions:totalGoldChars?abstentionPenaltyDistance/totalGoldChars:null,
    broad_candidate_scored_occurrences:broadScored,broad_candidate_exact_matches:broadExact,
    broad_candidate_exact_match_rate:broadScored?broadExact/broadScored:null,
    broad_candidate_cer:broadReferenceChars?broadDistanceTotal/broadReferenceChars:null,
    unresolved_occurrences:unresolved,partial_occurrences:partial,heuristic_occurrences:heuristic,
    typed_fallback_occurrences:typedFallback,target_unavailable_occurrences:targetUnavailable,
    target_provisional_occurrences:targetProvisional,engine_errors:errors
  },outputs};
}

function compareModes(left,right){
  let common=0,changed=0,leftWins=0,rightWins=0,ties=0;
  for(const [key,a] of left.outputs){
    const b=right.outputs.get(key);
    if(!b||a.status!=='resolved'||b.status!=='resolved')continue;
    const weight=Math.min(a.weight,b.weight);common+=weight;
    if(a.predicted!==b.predicted)changed+=weight;
    if(a.exact&&!b.exact)leftWins+=weight;else if(b.exact&&!a.exact)rightWins+=weight;else ties+=weight;
  }
  return {common_scored_occurrences:common,output_changed_occurrences:changed,left_exact_wins:leftWins,right_exact_wins:rightWins,exact_ties:ties};
}

function main(){
  const args=process.argv.slice(2);
  const value=name=>{const index=args.indexOf(name);return index>=0?args[index+1]:null;};
  const corpusPath=value('--corpus'),outputPath=value('--output');
  if(!corpusPath||!outputPath){process.stderr.write('Usage: node scripts/benchmark_kozak_kim_seoul_ipa.mjs --corpus ipa-pairs.json --output report.json\n');process.exitCode=2;return;}
  try{
    const pairs=loadPairs(corpusPath),totalOccurrences=pairs.reduce((sum,p)=>sum+p.weight,0);
    const engine=createBrowserKozakKimEngine(),results=MODES.map(mode=>evaluateMode(pairs,engine,mode,totalOccurrences));
    const report={
      schema_version:1,benchmark:'Seoul Corpus phonemic IPA word-level diagnostic',
      source:'OpenSLR SLR113 phoneme tier aligned to pWord.ortho.',
      source_archive_sha256:'63c3f8ffa6976307a732689d6c5be7b2db4ec20f14bf276faf98c886add0d24b',
      source_license:'CC BY-NC 2.0',reference_adapter:'seoul-corpus-phonemic-ipa-v1',
      reference_level:'phonemic',unit:'word-level IPA sequence; not narrow phonetic gold and not Ukrainian target accuracy',
      audio_used:false,corpus_pairs:totalOccurrences,unique_source_ipa_pairs:pairs.length,
      unique_source_forms:new Set(pairs.map(p=>p.source)).size,modes:results.map(r=>r.summary),
      paired_mode_deltas:{strict_vs_soft:compareModes(results[0],results[1]),strict_vs_super_soft:compareModes(results[0],results[2]),soft_vs_super_soft:compareModes(results[1],results[2])},
      notes:[
        'Phone labels are mapped through Table 3 of Yun et al. (2015), DOI 10.13064/KSSS.2015.7.2.103.',
        'The adapter expands ʨ to tɕ and serializes the paper asterisk fortis marker with IPA ͈; the mapping is versioned and inspectable.',
        'Only aligned Hangul orthographic word intervals with fully contained mapped phone intervals are included.',
        'Non-speech markers, unmapped labels, and phone intervals crossing word boundaries are excluded and counted in the inventory report.',
        'The reference is phonemic. It does not encode narrow allophonic voicing, release detail, speaker-specific variation, or all contextual place changes.',
        'Strict, Soft, and Super-soft use separate runtime profiles; scored-only Exact/CER and coverage-adjusted Exact must be read together.',
        'The CC BY-NC 2.0 corpus and IPA pair file are downloaded/generated only in temporary CI storage and are not committed or uploaded.'
      ]
    };
    writeFileSync(outputPath,JSON.stringify(report,null,2)+'\n','utf8');
    process.stdout.write(JSON.stringify(report.modes,null,2)+'\n');
  }catch(error){process.stderr.write('Seoul phonemic IPA benchmark failed: '+(error instanceof Error?error.stack:String(error))+'\n');process.exitCode=2;}
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main();
