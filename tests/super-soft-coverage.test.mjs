import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';
import { convertText } from '../src/app/engine_convert.js';
import { createMap } from '../src/app/engine_shared.js';

const canonical=readFileSync(new URL('../data/korean/canonical_correspondence.csv',import.meta.url),'utf8');
const lexical=readFileSync(new URL('../data/korean/lexical_pronunciations.csv',import.meta.url),'utf8');
const engine=createEngine(canonical,lexical);
const canonicalMap=createMap(canonical);
const STRICT={morphologyMode:'strict'};
const SUPER={morphologyMode:'super-soft'};

test('Super-soft returns IPA and an IPA-adapted Ukrainian candidate for all 11,172 modern Hangul syllables',()=>{
  const syllables=Array.from({length:11172},(_,i)=>String.fromCodePoint(0xAC00+i));
  // Spaces deliberately isolate each syllable: this is an exhaustive grapheme
  // inventory/adapter test, not a claim about connected-speech morphology.
  const source=syllables.join(' ');
  const result=engine.convert(source,SUPER);
  const candidate=result.ukrainian||result.candidate_ukrainian||'';
  assert.equal(result.coverage?.scope,'modern-hangul-syllable-blocks');
  assert.equal(result.coverage?.input_total,11172);
  assert.equal(result.coverage?.input_covered,11172);
  assert.equal(result.coverage?.input_uncovered,0);
  assert.equal(result.coverage?.input_coverage,1);
  assert.equal(result.coverage?.trace_coverage,1);
  assert.equal(result.coverage?.complete,true);
  assert.ok(result.ipa.length>0,'every syllable must yield IPA or typed IPA fallback');
  assert.ok(candidate.length>0,'every syllable must yield an IPA-adapted Ukrainian candidate');
  assert.doesNotMatch(result.ipa,/[가-힣ㄱ-ㅎㅏ-ㅣ]/u,'source Hangul/Jamo must never leak into IPA');
  assert.doesNotMatch(candidate,/[가-힣ㄱ-ㅎㅏ-ㅣ⟦⟧]/u,'candidate must be Ukrainian output, not source passthrough or placeholder');
  assert.equal(result.trace.filter(item=>item.source&&/^[가-힣]$/u.test(item.source)&&item.ipa).length,11172);
});

test('Super-soft keeps provisional lexical target adaptation in the candidate channel',()=>{
  const result=engine.convert('베갯잇',SUPER);
  assert.equal(result.target_status,'provisional');
  assert.equal(result.ukrainian,'');
  assert.ok(result.candidate_ukrainian);
  assert.equal(result.candidate_status,'provisional');
  assert.ok(result.trace.every(item=>item.output===''||item.candidateStatus==='provisional'));
});

test('Super-soft applies the orthographic-phonemic fallback to unresolved §30 saisiot insertion',()=>{
  const source='베갯잇';
  // Bypass the exact lexical hit deliberately to exercise the lower-priority
  // fallback tier. The public engine still prefers its source-backed lexicon.
  const strict=convertText(source,canonicalMap,new Map(),true,{...STRICT,preserveUnresolvedSource:true});
  const result=convertText(source,canonicalMap,new Map(),true,{...SUPER,preserveUnresolvedSource:true});
  assert.equal(strict.status,'unresolved','strict mode remains fail-closed');
  assert.equal(strict.ukrainian,'','strict mode must not change');
  assert.equal(result.status,'super-soft-orthographic-fallback');
    assert.ok(result.ipa,'fallback retains a complete inspectable IPA string');
  assert.ok(result.candidate_ukrainian,'fallback exposes a complete Ukrainian candidate');
  assert.equal(result.candidate_status,'super-soft-low-confidence');
  const fallbacks=result.trace.filter(item=>item.status==='super-soft-orthographic-fallback');
  assert.ok(fallbacks.length>0);
  assert.ok(fallbacks.every(item=>item.phoneticResultType==='orthographic-phonemic-fallback'&&item.confidence==='low'));
  assert.ok(fallbacks.every(item=>item.unresolvedMorphologyFlags.length>0&&item.uncertainty?.kind==='unresolved-morphology'));
  assert.ok(fallbacks.every(item=>(item.rules||[]).includes('super-soft-orthographic-fallback')));
  assert.ok(!fallbacks.some(item=>(item.rules||[]).some(rule=>/NIKL|exact-lexical/u.test(rule))));
});

test('Super-soft exposes practical morphology guesses only as low-confidence candidates',()=>{
  const result=engine.convert('짧은소리의',SUPER);
  assert.equal(result.status,'super-soft-heuristic-coverage');
  assert.equal(result.ukrainian,'');
  assert.ok(result.candidate_ukrainian);
  assert.equal(result.candidate_status,'super-soft-low-confidence');
  const heuristic=result.trace.filter(item=>['super-soft-practical-heuristic','super-soft-morphology-heuristic'].includes(item.status));
  assert.ok(heuristic.length>0);
  assert.ok(heuristic.every(item=>item.confidence==='low'));
});


test('Super-soft covers every registered strict-mode morphology gap with a candidate',()=>{
  const gaps=['짧은소리의','수많이는','없으니를','없애다에서는','값에서는','밟으니와','싫어도에서는','외곬에를','값있는에서는','히읗을의','벼훑이를','밭이와','붙임'];
  for(const source of gaps){
    const strict=engine.convert(source,STRICT);
    assert.equal(strict.status,'unresolved',source+': strict control must remain fail-closed');
    const result=engine.convert(source,SUPER);
    assert.notEqual(result.status,'unresolved',source+': Super-soft must not drop the Korean span');
    assert.equal(result.coverage.input_coverage,1,source+': all Hangul syllables must be represented');
    assert.equal(result.coverage.trace_coverage,1,source+': all source spans must be traceable');
    assert.ok(result.coverage.complete,source+': coverage accounting must be complete');
    assert.ok(result.ukrainian||result.candidate_ukrainian,source+': must produce a Ukrainian candidate');
    assert.doesNotMatch(result.ukrainian||result.candidate_ukrainian,/[⟦⟧]/u,source+': no unresolved placeholder may replace a syllable');
  }
});

test('Super-soft covers the full adversarial NIKL master passage without dropping Hangul',()=>{
  const source=readFileSync(new URL('./fixtures/nikl-all-articles-master-passage-2026-10-22.txt',import.meta.url),'utf8');
  const result=engine.convert(source,SUPER);
  const visible=result.ukrainian||result.candidate_ukrainian||'';
  assert.ok(result.coverage.complete,JSON.stringify(result.coverage));
  assert.equal(result.coverage.input_coverage,1);
  assert.equal(result.coverage.trace_coverage,1);
  assert.ok(visible.length>0);
  assert.doesNotMatch(visible,/[⟦⟧]/u,'no Hangul span may be replaced by unresolved placeholders');
});

test('Super-soft preserves non-syllabic Jamo and non-Korean literals without inventing IPA',()=>{
  const source='안녕 ㄱ 가 123, 🙂!';
  const result=engine.convert(source,SUPER);
  const target=result.ukrainian||result.candidate_ukrainian||'';
  assert.ok(target.includes('ㄱ'),'standalone compatibility Jamo remains visible');
  assert.ok(target.includes('가'),'decomposed Jamo sequence remains visible');
  assert.ok(target.includes('123, 🙂!'),'digits, punctuation, and emoji remain visible');
  const jamo=result.trace.find(item=>item.source==='ㄱ');
  assert.equal(jamo?.status,'literal-preserved');
  assert.equal(jamo?.ipa,'');
  assert.equal(jamo?.output,'ㄱ');
  assert.ok(result.coverage.complete,'all source spans, including literal spans, must be traceable');
  assert.equal(result.coverage.input_coverage,1);
});

test('Super-soft records exact monotonic UTF-16 source offsets for repeated and mixed Unicode spans',()=>{
  const source='가가🙂, 나 ㄱ 가 123! 가가';
  const result=engine.convert(source,SUPER);
  assert.equal(result.coverage.complete,true,JSON.stringify(result.coverage));
  assert.equal(result.coverage.source_span_uncovered,0);
  assert.deepEqual(result.coverage.untraced_source_offsets,[]);
  let cursor=0;
  for(const item of result.trace){
    assert.ok(Number.isInteger(item.sourceStart),JSON.stringify(item));
    assert.ok(Number.isInteger(item.sourceEnd),JSON.stringify(item));
    assert.ok(item.sourceStart>=cursor,'trace spans must be monotonic and non-overlapping');
    assert.equal(source.slice(item.sourceStart,item.sourceEnd),item.source,'trace offsets must point to the exact source text');
    cursor=item.sourceEnd;
  }
  assert.equal(cursor,source.length,'trace must account for the complete UTF-16 source');
  for(const literal of ['🙂',',',' ','ㄱ','ᄀ','ᅡ','1','2','3','!']){
    const item=result.trace.find(entry=>entry.source===literal&&source.slice(entry.sourceStart,entry.sourceEnd)===literal);
    assert.ok(item,JSON.stringify({literal,trace:result.trace.map(entry=>entry.source)}));
    assert.equal(item.output,literal,'non-Hangul literals and isolated Jamo must remain visible in their own trace span');
  }
});

test('Super-soft preserves archaic Jamo and malformed Unicode as explicit literal spans',()=>{
  const source='힣 ᄓᅟᇹ\uD800';
  const result=engine.convert(source,SUPER);
  assert.equal(result.coverage.input_total,1);
  assert.equal(result.coverage.input_covered,1);
  assert.equal(result.coverage.input_coverage,1);
  assert.equal(result.coverage.trace_coverage,1);
  assert.equal(result.coverage.complete,true,JSON.stringify(result.coverage));
  for(const literal of ['ᄓ','ᅟ','ᇹ','\uD800']){
    const item=result.trace.find(entry=>entry.source===literal);
    assert.ok(item,JSON.stringify({literal,trace:result.trace.map(entry=>entry.source)}));
    assert.equal(item.status,'literal','archaic Jamo and malformed code units are preserved, not pronounced by guesswork');
    assert.equal(item.output,literal);
    assert.equal(item.ipa,'');
    assert.equal(source.slice(item.sourceStart,item.sourceEnd),literal);
  }
});

test('Super-soft is opt-in and does not alter strict or existing soft behavior',()=>{
  const input='삶이';
  assert.deepEqual(engine.convert(input),engine.convert(input,STRICT));
  assert.deepEqual(engine.convert(input,{morphologyMode:'soft'}),engine.convert(input,{morphologyMode:'soft'}));
  assert.notEqual(engine.convert('짧은소리의',SUPER).status,engine.convert('짧은소리의',STRICT).status);
});

test('service exposes the opt-in control only inside research mode and labels its limitation',()=>{
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
  assert.match(html,/id="super-soft-morphology"/u);
  assert.match(html,/100% покриття не означає 100% точності вимови/u);
  assert.match(main,/superSoftToggle&&superSoftToggle\.checked\?'super-soft'/u);
  assert.match(main,/super-soft-low-confidence/u);
  assert.match(main,/покриття складів Hangul/u);
  assert.match(main,/r\.coverage\.input_covered/u);
  assert.match(main,/superSoftToggle\.checked&&softToggle/u);
  const methodology=readFileSync(new URL('../system.html',import.meta.url),'utf8');
  assert.match(methodology,/methodology-02a-super-soft/u);
  assert.match(methodology,/11&nbsp;172 сучасні склади Hangul/u);
  assert.match(methodology,/не означає 100% правильної вимови/u);
});
