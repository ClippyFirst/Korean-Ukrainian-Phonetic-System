import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createEngine} from '../src/app/engine.js';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');

test('public web contract stays exactly two pages',()=>{
  assert.equal(fs.existsSync(path.join(root,'index.html')),true);
  assert.equal(fs.existsSync(path.join(root,'system.html')),true);
  const rootFiles=fs.readdirSync(root).filter(name=>name.endsWith('.html'));
  assert.deepEqual(rootFiles.sort(),['index.html','system.html']);
});

test('Korean visual identity and no-gradient rule are encoded in source',()=>{
  const css=read('src/styles/main.css');
  assert.match(css,/--red:#cd2e3a/i);
  assert.match(css,/--blue:#0047a0/i);
  assert.doesNotMatch(css,/gradient\s*\(/i);
  assert.match(css,/prefers-reduced-motion:reduce/);
});

test('pages declare local-only browser boundary',()=>{
  for(const page of ['index.html','system.html']){
    const html=read(page);
    assert.match(html,/Content-Security-Policy/);
    assert.match(html,/connect-src 'none'/);
    assert.match(html,/lang="uk"/);
  }
});

test('service exposes the research/system navigation contract',()=>{
  const html=read('index.html');
  assert.match(html,/href="\.\/system\.html"/);
  assert.match(html,/id="source-input"/);
  assert.match(html,/id="result-ukrainian"/);
  assert.match(html,/id="result-ipa"/);
  assert.match(html,/id="result-analysis"/);
  assert.match(html,/контекстуальних правил/);
  assert.match(html,/Корейський текст → контекстуальні правила → практичний український запис/);

});

test('Ukrainian rendering has one IPA-first path',()=>{
  const engine=read('src/app/engine.js');
  const system=read('system.html');
  assert.match(engine,/function ipaSyllableToUkrainian\(/);
  assert.match(engine,/output\[i\]=targetFromIpa\.text/);
  assert.match(engine,/result\.ukrainian=rendered\.text/);
  assert.doesNotMatch(engine,/function mapOnset\(/);
  assert.doesNotMatch(engine,/function mapVowel\(/);
  assert.doesNotMatch(engine,/function mapCoda\(/);
  assert.match(system,/id="ipa-first-pipeline-2026-10-11"/);
});

test('editable adversarial passage has a complete IPA path without inline placeholders',()=>{
  const html=read('index.html');
  const match=html.match(/id="stress-input"[^>]*>([\s\S]*?)<\/textarea>/u);
  assert.ok(match,'stress passage textarea exists');
  const engine=createEngine(read('data/korean/canonical_correspondence.csv'),read('data/korean/lexical_pronunciations.csv'));
  const result=engine.convert(match[1]);
  assert.ok(result.ipa.length>0);
  assert.ok(!result.ukrainian.includes('⟦')&&!result.ukrainian.includes('⟧'));
  assert.deepEqual(result.issues,[],JSON.stringify(result.issues));
});
