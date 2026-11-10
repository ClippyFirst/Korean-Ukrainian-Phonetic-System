import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const luminance=(hex)=>{
  const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
  return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
};
const contrast=(a,b)=>{
  const [hi,lo]=[luminance(a),luminance(b)].sort((x,y)=>y-x);
  return (hi+.05)/(lo+.05);
};

test('service and methodology share the Korean editorial visual identity',()=>{
  for(const page of ['index.html','system.html']){
    const html=read(page);
    assert.match(html,/data-visual-system="jogakbo"/u);
    assert.match(html,/class="brand-mark"[^>]*>한</u);
    assert.match(html,/class="specimen-grid"/u);
    const grid=html.match(/<div class="specimen-grid"[^>]*>([\\s\\S]*?)<\\/div>/u)?.[1]??"";
    assert.equal((grid.match(/class="specimen-tile/g)??[]).length,3,"the specimen uses three deliberately unequal panels");
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
  assert.match(css,/--celadon-ink:\s*#526e5d/i);
  assert.match(css,/\.editorial-site \.workspace-layout/u);
  assert.match(css,/\.system-page \.doc-content/u);
  assert.match(css,/@media\s*\(prefers-reduced-motion:\s*reduce\)/u);
  assert.match(css,/:focus-visible/u);
  assert.doesNotMatch(css+baseCss,/scroll-behavior:\s*smooth/u);
  assert.doesNotMatch(css+baseCss,/background(?:-image)?:[^;]*gradient\s*\(/iu);
  assert.ok(contrast('#526e5d','#fcfbf7')>=4.5,'small celadon text meets WCAG AA');
  assert.ok(contrast('#10251e','#789184')>=4.5,'text on the celadon specimen meets WCAG AA');
  assert.match(css,/grid-template-columns:\\s*minmax\\(0,\\s*1\\.12fr\\)\\s+minmax\\(0,\\s*\\.88fr\\)/u);
  assert.match(css,/\\.specimen-tile-hangul\\s*\\{[^}]*grid-row:\\s*1\\s*\\/\\s*span\\s*2/u);
});
