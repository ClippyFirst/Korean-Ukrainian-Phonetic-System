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

test('both pages retain the Korean editorial identity and real Hangul examples',()=>{
  for(const page of ['index.html','system.html']){
    const html=read(page);
    assert.match(html,/data-visual-system="jogakbo"/u);
    assert.match(html,/class="brand-mark"[^>]*>한</u);
    assert.match(html,/class="specimen-flow"/u);
    assert.doesNotMatch(html,/class="taegeuk"/u);
  }
  assert.match(read('index.html'),/lang="ko">시</u);
  assert.match(read('system.html'),/lang="ko">읽고</u);
});

test('service follows one task path from input through the selected mode to results',()=>{
  const html=read('index.html');
  const order=['id="source-input"','id="transliteration-mode"','id="example-button"','id="results"','id="panel-ukrainian"','id="panel-ipa"','id="panel-romanization"','id="variant-panel"','id="trace-list"'].map(x=>html.indexOf(x));
  assert.ok(order.every(x=>x>=0),'all task stages exist');
  assert.ok(order.every((x,i)=>i===0||x>order[i-1]),'input → mode → action → Ukrainian → IPA → romanization → variants → trace');
  assert.match(html,/Перетворити/u);
  assert.doesNotMatch(html,/Вставити приклад/u);
  assert.doesNotMatch(html,/placeholder=/u);
});

test('the page uses no object-level heading or footer strips',()=>{
  for(const page of ['index.html','system.html']){
    const html=read(page);
    for(const chrome of ['specimen-top','specimen-bottom','method-line','result-meta','table-head','doc-label','status-chip']){
      assert.doesNotMatch(html,new RegExp('class="[^"]*'+chrome,'u'),page+' has no '+chrome);
    }
  }
});

test('only the input and answer workbench windows are stacked',()=>{
  const css=read('src/styles/editorial.css');
  assert.match(css,/\.editorial-site \.workspace-layout\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/su);
  assert.match(css,/\.editorial-site \.hero\s*\{[^}]*display:\s*grid/su);
  assert.match(css,/\.editorial-site \.specimen-flow\s*\{[^}]*grid-template-columns:\s*1\.12fr \.88fr \.88fr/su);
  assert.match(css,/\.editorial-site \.system-page \.doc-section\s*\{[^}]*display:\s*block/su);
  assert.match(css,/\.editorial-site \.button-primary\s*\{[^}]*color:\s*#fff/su);
  assert.doesNotMatch(css,/\.editorial-site \.hero,\s*\.editorial-site \.workspace-layout/su);
});

test('methodology section anchors are carried by headings in the reading flow',()=>{
  const html=read('system.html');
  assert.doesNotMatch(html,/class="doc-label"/u);
  assert.match(html,/<h2 id="methodology-00a">/u);
  assert.match(html,/<h2 id="methodology-01">/u);
  assert.match(html,/<h2 id="methodology-02c-kozak-kim"><span class="heading-index">02C<\/span>/u);
  assert.equal((html.match(/class="doc-section"/gu)||[]).length,24);
});

test('editorial palette keeps key text combinations above WCAG AA contrast',()=>{
  const css=read('src/styles/editorial.css');
  assert.match(css,/--hanji:\s*#f2f3ef/iu);
  assert.match(css,/--ink-navy:\s*#16191f/iu);
  assert.match(css,/--cobalt:\s*#2448d8/iu);
  assert.match(css,/--signal-pink:\s*#ff5aa5/iu);
  assert.match(css,/--signal-yellow:\s*#d9e64b/iu);
  assert.ok(contrast('#2448d8','#f2f3ef')>=4.5);
  assert.ok(contrast('#16191f','#f2f3ef')>=4.5);
  assert.ok(contrast('#16191f','#ff5aa5')>=4.5);
  assert.ok(contrast('#ffffff','#2448d8')>=4.5);
  assert.ok(contrast('#16191f','#d9e64b')>=4.5);
  assert.match(css,/:focus-visible/u);
  assert.match(css,/@media\s*\(prefers-reduced-motion:\s*reduce\)/u);
});

test('user-facing terminology stays Ukrainian and the input remains placeholder-free',()=>{
  const service=read('index.html');
  const methodology=read('system.html');
  assert.match(service,/Романізація \(RR\)/u);
  assert.doesNotMatch(service,/Revised Romanization/u);
  assert.match(methodology,/Переглянута романізація \(RR\)/u);
  assert.doesNotMatch(methodology,/Revised Romanization/u);
  assert.match(methodology,/Візуальна логіка/u);
  assert.match(methodology,/джогакбо — корейського клаптикового полотна/u);
  const start=service.indexOf('<textarea id="source-input"');
  const end=service.indexOf('>',start);
  assert.ok(start>=0);
  assert.doesNotMatch(service.slice(start,end),/placeholder=/u);
});


test('the specimen keeps its three-colour editorial hierarchy without object labels',()=>{
  const css=read('src/styles/editorial.css');
  assert.match(css,/\.editorial-site \.specimen-flow p span \{ display:\s*none/u);
  assert.match(css,/\.editorial-site \.specimen-flow p:first-child\s*\{[^}]*var\(--ink-navy\)/su);
  assert.match(css,/\.editorial-site \.specimen-flow p:nth-child\(2\)\s*\{[^}]*var\(--signal-pink\)/su);
  assert.match(css,/\.editorial-site \.specimen-flow p:nth-child\(3\)\s*\{[^}]*var\(--signal-yellow\)/su);
});
