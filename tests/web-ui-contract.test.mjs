import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

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
