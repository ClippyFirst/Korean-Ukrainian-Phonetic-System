import test from 'node:test';
import assert from 'node:assert/strict';
import { decompose } from '../src/app/engine.js';

const BASE=0xAC00,END=0xD7A3,T_COUNT=28,N_COUNT=21*T_COUNT;
const ONSETS=[...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];
const VOWELS=[...'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'];
const CODAS=['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

test('browser decompose validates and round-trips all 11,172 modern Hangul syllables',()=>{
  let count=0;
  for(let cp=BASE;cp<=END;cp++){
    const char=String.fromCodePoint(cp),d=decompose(char),offset=cp-BASE;
    assert.ok(d,'must decompose '+char);
    const onset=Math.floor(offset/N_COUNT),vowel=Math.floor((offset%N_COUNT)/T_COUNT),coda=offset%T_COUNT;
    assert.equal(d.char,char);
    assert.equal(d.onset,ONSETS[onset],char+' onset');
    assert.equal(d.vowel,VOWELS[vowel],char+' vowel');
    assert.equal(d.coda,CODAS[coda],char+' coda');
    assert.equal(d.hasCoda,coda!==0,char+' hasCoda');
    const rebuilt=String.fromCodePoint(BASE+(onset*N_COUNT)+(vowel*T_COUNT)+coda);
    assert.equal(rebuilt,char,'round-trip reconstruction');
    count++;
  }
  assert.equal(count,11172);
});

test('browser decompose rejects empty, multi-code-point, non-Hangul and jamo input',()=>{
  for(const value of ['', '가나', 'ㄱ', 'ㅏ', 'ᄀ', 'ᅡ', 'ᆨ', 'A', '字', '🙂', null, undefined, 1]){
    assert.equal(decompose(value),null,JSON.stringify(value));
  }
});
