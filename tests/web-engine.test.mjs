import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createEngine,decompose,parseCsv} from '../src/app/engine.js';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const csv=fs.readFileSync(path.join(root,'data/korean/canonical_correspondence.csv'),'utf8');
const engine=createEngine(csv);

test('modern Hangul decomposition',()=>{assert.deepEqual(decompose('가'),{char:'가',onset:'ㄱ',vowel:'ㅏ',coda:'',hasCoda:false});assert.deepEqual(decompose('각'),{char:'각',onset:'ㄱ',vowel:'ㅏ',coda:'ㄱ',hasCoda:true});});
test('canonical CV/CVC output',()=>{assert.equal(engine.convert('가').ukrainian,'ка');assert.equal(engine.convert('각').ukrainian,'как');assert.equal(engine.convert('한').ukrainian,'хан');});
test('contextual ㅅ before i maps to ш',()=>{assert.equal(engine.convert('시').ukrainian,'ші');});
test('ㄹ onset/coda distinction',()=>{assert.equal(engine.convert('라').ukrainian,'ра');assert.equal(engine.convert('알').ukrainian,'ал');});
test('ㅇ onset/coda distinction',()=>{assert.equal(engine.convert('아').ukrainian,'а');assert.equal(engine.convert('앙').ukrainian,'ан');});
test('complex-coda liaison keeps first component',()=>{assert.equal(engine.convert('닭을').ukrainian,'тальґиль');});
test('simple liaison is contextual',()=>{const r=engine.convert('밥이');assert.equal(r.status,'contextual');assert.equal(r.ukrainian,'бабі');});
test('tensification remains practical rather than mandatory doubling',()=>{const r=engine.convert('국밥');assert.equal(r.ukrainian,'кукпап');assert.ok(r.trace.some(x=>x.rules.includes('tensification')));});
test('contextual voicing is visible',()=>{const r=engine.convert('현대');assert.equal(r.ukrainian,'хйонде');assert.ok(r.trace.some(x=>x.rules.includes('contextual-voicing')));});
test('unresolved ㅢ is explicit',()=>{const r=engine.convert('의');assert.equal(r.status,'unresolved');assert.match(r.ukrainian,/⟦의⟧/);});
test('non-Korean text is preserved',()=>{assert.equal(engine.convert('ABC 123!').ukrainian,'ABC 123!');});
test('CSV parser handles quoted fields',()=>{const rows=parseCsv('a,b\n1,"x,y"\n');assert.deepEqual(rows,[{a:'1',b:'x,y'}]);});
test('deterministic output',()=>{const a=engine.convert('현대 한국어');const b=engine.convert('현대 한국어');assert.deepEqual(a,b);});
