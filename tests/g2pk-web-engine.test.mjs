import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {createEngine} from '../src/app/engine.js';
import {createG2pWebAdapter} from '../src/app/g2pk_web.js';
import {G2pBrowser} from '../src/vendor/g2pk/g2p-browser.ts';

const here=dirname(fileURLToPath(import.meta.url));
const read=(path)=>readFileSync(resolve(here,'..',path),'utf8');
const canonical=read('data/korean/canonical_correspondence.csv');
const baseLexical=read('data/korean/lexical_pronunciations.csv');
const additions=read('data/korean/lexical_additions_2026-10-15.csv');
const header=baseLexical.split(/\r?\n/u).find(line=>line.trim());
const merge=(base,extra)=>[header,...base.split(/\r?\n/u).filter(line=>line.trim()&&!line.startsWith('input,')),...extra.split(/\r?\n/u).filter(line=>line.trim()&&!line.startsWith('input,'))].join('\n');
const lexical=merge(baseLexical,additions);
const engine=createEngine(canonical,lexical);
const g2p=createG2pWebAdapter(engine);

test('browser G2P implements key standard pronunciation controls',()=>{
  const cases=[
    ['있다','읻따'],
    ['먹는','멍는'],
    ['좋다','조타'],
    ['같이','가치'],
    ['합니다','함니다']
  ];
  for(const [input,surface] of cases){
    const result=g2p.convert(input);
    assert.equal(result.surfaceHangul,surface,input);
    assert.ok(result.ipa.length>0,'IPA missing for '+input);
    assert.ok(result.ukrainian.length>0,'Ukrainian target missing for '+input);
    assert.ok(!result.ipa.includes('⟦'),'unmapped IPA marker in '+input);
  }
});

test('browser G2P preserves punctuation, spaces, and protected Latin/digits',()=>{
  const input='값이, old school 12시! 같이';
  const result=g2p.convert(input);
  assert.ok(result.ukrainian.includes(', old school 12ші! '));
  assert.ok(result.surfaceHangul.includes('old school 12시!'));
  assert.equal(result.source,input);
});

test('practical mode applies exact NIKL surface correction before IPA while retaining raw port parity',()=>{
  const port=new G2pBrowser();
  const input='값어치';
  const expected=port.convert(input,{descriptive:false,verbose:false,groupVowels:false,toSyl:true});
  const result=g2p.convert(input);
  assert.equal(expected, '갑써치', 'raw vendored port remains unchanged');
  assert.equal(result.surfaceHangul, '가버치', 'NIKL §15 correction precedes IPA');
  assert.equal(result.normativeCorrections.length, 1);
  assert.match(result.analysis, /값어치 → 가버치/u);
  assert.equal(result.status,'lexical');
  assert.ok(!result.trace.some(item=>(item.rules||[]).includes('sourced-lexical-ipa')));
  assert.equal(result.issues.length,0);
});

test('surface mode does not apply native fortition a second time',()=>{
  const result=g2p.convert('국밥');
  assert.equal(result.surfaceHangul,'국빱');
  assert.match(result.ipa,/p͈/);
});

test('full adversarial Korean passage completes with IPA-first output and no placeholders',()=>{
  const passage=read('tests/fixtures/g2pk-web-adversarial.txt');
  const result=g2p.convert(passage);
  assert.ok(result.surfaceHangul.length>0,'surface Hangul trace missing');
  assert.ok(result.ipa.length>0,'IPA output missing');
  assert.ok(result.ukrainian.length>0,'Ukrainian target missing');
  assert.equal(result.issues.length,0,result.issues.join('\\n'));
  assert.ok(!result.ukrainian.includes('⟦'),'unresolved placeholder leaked');
  assert.ok(!result.ukrainian.includes('undefined'),'undefined leaked into target');
  assert.ok(!result.trace.some(item=>(item.rules||[]).includes('sourced-lexical-ipa')),'research lexical IPA override leaked into practical mode');
  assert.ok(result.ukrainian.includes('“')&&result.ukrainian.includes('”'),'quotation punctuation was not preserved');
});
