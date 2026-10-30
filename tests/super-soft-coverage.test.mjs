import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createEngine } from '../src/app/engine.js';

const canonical=readFileSync(new URL('../data/korean/canonical_correspondence.csv',import.meta.url),'utf8');
const lexical=readFileSync(new URL('../data/korean/lexical_pronunciations.csv',import.meta.url),'utf8');
const engine=createEngine(canonical,lexical);
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

test('Super-soft applies the orthographic-phonemic fallback to unresolved §30 saisiot insertion',()=>{
  const source='베갯잇';
  const strict=engine.convert(source,STRICT);
  const result=engine.convert(source,SUPER);
  assert.equal(strict.status,'unresolved','strict mode remains fail-closed');
  assert.equal(strict.ukrainian,'','strict mode must not change');
  assert.equal(result.status,'super-soft-orthographic-fallback');
  assert.ok(result.coverage.complete);
  assert.ok(result.coverage.input_coverage===1);
  assert.ok(result.ipa,'fallback retains a complete inspectable IPA string');
  assert.ok(result.candidate_ukrainian,'fallback exposes a complete Ukrainian candidate');
  assert.equal(result.candidate_status,'super-soft-low-confidence');
  const fallbacks=result.trace.filter(item=>item.status==='super-soft-orthographic-fallback');
  assert.ok(fallbacks.length>0);
  assert.ok(fallbacks.every(item=>item.phoneticResultType==='orthographic-phonemic-fallback'&&item.confidence==='low'));
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
});
