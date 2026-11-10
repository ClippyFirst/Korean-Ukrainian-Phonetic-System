import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');

test('service and methodology share the Korean editorial visual identity',()=>{
  for(const page of ['index.html','system.html']){
    const html=read(page);
    assert.match(html,/data-visual-system="jogakbo"/u);
    assert.match(html,/class="brand-mark"[^>]*>한</u);
    assert.match(html,/class="specimen-grid"/u);
    assert.doesNotMatch(html,/class="taegeuk"/u);
  }
});

test('service specimen explains a real Hangul → IPA → Ukrainian example',()=>{
  const html=read('index.html');
  assert.match(html,/class="specimen-tile specimen-tile-hangul"/u);
  assert.match(html,/lang="ko">시</u);
  assert.match(html,/\/ɕi\//u);
  assert.match(html,/>ші</u);
  assert.match(html,/class="workspace-layout"/u);
  assert.match(html,/id="source-input"/u);
  assert.match(html,/id="result-ukrainian"/u);
});

test('Korean editorial tokens and restrained interaction are present',()=>{
  const css=read('src/styles/editorial.css');
  const baseCss=read('src/styles/main.css');
  assert.match(css,/--hanji:\s*#f3f0e8/i);
  assert.match(css,/--ink-navy:\s*#172a3a/i);
  assert.match(css,/--vermilion:\s*#b64036/i);
  assert.match(css,/--celadon:\s*#789184/i);
  assert.match(css,/\.editorial-site \.workspace-layout/u);
  assert.match(css,/\.system-page \.doc-content/u);
  assert.match(css,/@media\s*\(prefers-reduced-motion:\s*reduce\)/u);
  assert.match(css,/:focus-visible/u);
  assert.doesNotMatch(css+baseCss,/scroll-behavior:\s*smooth/u);
  assert.doesNotMatch(css+baseCss,/background(?:-image)?:[^;]*gradient\s*\(/iu);
});
