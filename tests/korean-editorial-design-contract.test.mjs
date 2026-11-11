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

test('both pages share a jogakbo header and retain real Hangul examples',()=>{
  for(const page of ['index.html','system.html']){
    const html=read(page);
    assert.match(html,/data-visual-system="jogakbo-editorial"/u);
    assert.match(html,/class="brand-mark"[^>]*>한</u);
    assert.match(html,/class="specimen-flow"/u);
    const header=html.match(/<header class="site-header">[\s\S]*?<\/header>/u)?.[0]||'';
    assert.match(header,/class="jogakbo-band"/u);
    assert.ok((header.match(/class="jogakbo-patch /gu)||[]).length>=8,'header has at least eight textile fragments');
    assert.equal((html.match(/class="jogakbo-band"/gu)||[]).length,1,'patchwork is used once per page');
    assert.doesNotMatch(html.slice(html.indexOf('</header>')+9),/jogakbo-band/u,'patchwork does not enter content modules');
  }
  assert.match(read('index.html'),/lang="ko">시</u);
  assert.match(read('system.html'),/lang="ko">읽고</u);
});

test('service modules pair the input and output objects with concise guidance',()=>{
  const html=read('index.html');
  const input=html.indexOf('id="source-input"');
  const inputGuide=html.indexOf('id="input-module-guidance"');
  const outputGuide=html.indexOf('id="output-module-guidance"');
  const output=html.indexOf('id="results"');
  assert.ok(input>=0&&inputGuide>input,'input object is followed by its usage guidance');
  assert.ok(outputGuide>=0&&output>outputGuide,'output guidance introduces the result object');
  assert.match(html,/class="output-module-title"/u);
  assert.match(html,/class="module-guidance module-guidance-dark"/u);
  assert.match(html,/натисніть «Перетворити»/u);
  assert.match(html,/class="module-guidance module-guidance-light"/u);
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
  assert.match(css,/\.editorial-site \.workspace-layout\s*\{[^}]*grid-template-columns:\s*minmax\(0,1fr\)/su);
  assert.match(css,/\.hero\s*\{[^}]*display:grid/su);
  assert.match(css,/\.editorial-site \.specimen-flow\s*\{[^}]*grid-template-columns:1\.14fr \.88fr \.88fr/su);
  assert.match(css,/\.editorial-site\.system-page \.doc-section\s*\{[^}]*display:block/su);
  assert.match(css,/\.editorial-site \.button-primary\s*\{[^}]*color:var\(--ink\)/su);
  assert.doesNotMatch(css,/\.editorial-site \.hero,\s*\.editorial-site \.workspace-layout/su);
});

test('methodology reading guide and sections remain a vertical sequence with real objects',()=>{
  const html=read('system.html');
  const css=read('src/styles/editorial.css');
  assert.match(html,/id="methodology-reading-guide"/u);
  assert.match(html,/class="methodology-reading-steps"/u);
  assert.match(html,/class="research-reference-list"/u);
  assert.match(html,/<h2 id="methodology-00a">/u);
  assert.match(html,/<h2 id="methodology-01">/u);
  assert.match(html,/<h2 id="methodology-02c-kozak-kim"><span class="heading-index">02C<\/span>/u);
  assert.equal((html.match(/class="doc-section"/gu)||[]).length,24);
  const firstSection=html.match(/<section class="doc-section">([\s\S]*?)<\/section>/u)?.[1]||'';
  assert.match(firstSection,/class="callout/u,'the normative-base module includes a visible interpretive object');
  const moduleStarts=[...html.matchAll(/<section[^>]*class="[^"]*doc-section[^"]*"[^>]*>/gu)].map(match=>match.index);
  assert.equal(moduleStarts.length,25,'all 25 methodology modules remain in source order');
  moduleStarts.forEach((moduleStart,index)=>{
    const moduleEnd=moduleStarts[index+1]??html.indexOf('</main>',moduleStart);
    const module=html.slice(moduleStart,moduleEnd);
    assert.match(module,/<table\b|<ul\b|<ol\b|<pre\b|class="[^"]*(?:layers|rule-grid|limits|compare-strip|callout|decision-table|vowel-grid|evidence-list|repo-links)[^"]*"/u,`methodology module ${index+1} contains a real content object`);
  });
  assert.match(css,/\.editorial-site\.system-page \.doc-section\s*\{[^}]*display:block/su);
  assert.match(css,/\.editorial-site \.system-intro\{[^}]*border:0/su);
});

test('jogakbo palette is restrained and action contrasts remain accessible',()=>{
  const css=read('src/styles/editorial.css');
  for(const token of ['--jogakbo-ink:#24354b','--jogakbo-jade:#9db7a7','--jogakbo-blue:#a9bac6','--jogakbo-ochre:#c9a66b','--jogakbo-clay:#b9857a','--jogakbo-ground:#f1eee5']){
    assert.ok(css.toLowerCase().includes(token),`missing ${token}`);
  }
  assert.match(css,/--paper:#efede6/iu);
  assert.match(css,/--ink:#17202c/iu);
  assert.match(css,/--cobalt:#254bd8/iu);
  assert.match(css,/--signal:#ed593d/iu);
  assert.match(css,/--signal-deep:#ad3426/iu);
  assert.match(css,/--acid:#e6e84d/iu);
  assert.ok(contrast('#17202c','#efede6')>=4.5);
  assert.ok(contrast('#5b6570','#efede6')>=4.5);
  assert.ok(contrast('#254bd8','#efede6')>=4.5);
  assert.ok(contrast('#ad3426','#efede6')>=4.5);
  assert.ok(contrast('#17202c','#ed593d')>=4.5);
  assert.ok(contrast('#17202c','#e6e84d')>=4.5);
  assert.match(css,/:focus-visible/u);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/u);
});

test('user-facing terminology stays Ukrainian and the input remains placeholder-free',()=>{
  const service=read('index.html');
  const methodology=read('system.html');
  assert.match(service,/Романізація \(RR\)/u);
  assert.doesNotMatch(service,/Revised Romanization/u);
  assert.match(methodology,/Переглянута романізація \(RR\)/u);
  assert.doesNotMatch(methodology,/Revised Romanization/u);
  assert.match(methodology,/У розділах нижче зібрано джерела, правила й приклади/u);
  assert.doesNotMatch(methodology,/джогакбо/u);
  const start=service.indexOf('<textarea id="source-input"');
  const end=service.indexOf('>',start);
  assert.ok(start>=0);
  assert.doesNotMatch(service.slice(start,end),/placeholder=/u);
});

test('the specimen keeps its three-colour editorial hierarchy without object labels',()=>{
  const css=read('src/styles/editorial.css');
  assert.match(css,/\.editorial-site \.specimen-flow p span\{display:none\}/u);
  assert.match(css,/\.editorial-site \.specimen-flow p:first-child\{background:var\(--ink\);color:var\(--surface\)\}/u);
  assert.match(css,/\.editorial-site \.specimen-flow p:nth-child\(2\)\{background:var\(--acid\);color:var\(--ink\)\}/u);
  assert.match(css,/\.editorial-site \.specimen-flow p:nth-child\(3\)\{background:var\(--signal\);color:var\(--ink\)\}/u);
});

test('the result provenance note belongs to the Ukrainian output, not the result grid',()=>{
  const html=read('index.html');
  const css=read('src/styles/editorial.css');
  const review=read('scripts/capture-editorial-review.mjs');
  assert.match(review,/inWorkbench/);
  assert.match(review,/expectedFocusColor/);
  assert.match(review,/headerPatchwork/);
  assert.match(review,/moduleGuidance/);
  assert.match(review,/methodologyGuideVisible/);
  assert.match(review,/modeOptionContrast/);
  assert.match(css,/\.editorial-site \.mode-option\{[^}]*background:transparent/su);
  assert.match(css,/\.editorial-site \.mode-option:has\(input:checked\)\{[^}]*background:#29384b/su);
  const ukrainian=html.match(/<article id="panel-ukrainian"[\s\S]*?<\/article>/u)?.[0]||'';
  assert.match(ukrainian,/<p id="status-note" class="results-note result-provenance">/u);
  assert.doesNotMatch(html,/<\/article>\s*<p id="status-note"/u);
  assert.match(css,/\.editorial-site \.result-provenance\{background:transparent\}/u);
});
