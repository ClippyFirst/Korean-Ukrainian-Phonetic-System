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
  assert.match(html,/Український запис — головний результат/u);
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
  assert.match(css,/\.editorial-site \.button-primary\s*\{[^}]*color:var\(--palette-ink\)/su);
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
  for(const token of ['--jogakbo-ink:var(--palette-ink)','--jogakbo-jade:var(--palette-jade)','--jogakbo-blue:var(--palette-blue)','--jogakbo-ochre:var(--palette-ochre)','--jogakbo-clay:var(--palette-clay)','--jogakbo-ground:var(--palette-paper)']){
    assert.ok(css.toLowerCase().includes(token),`missing ${token}`);
  }
  for(const token of ['--palette-paper:#efede6','--palette-ink:#17202c','--palette-jade:#9db7a7','--palette-blue:#a9bac6','--palette-ochre:#c9a66b','--palette-clay:#b9857a','--palette-signal:#88574d','--palette-indigo:#496477']){
    assert.ok(css.toLowerCase().includes(token),`missing shared palette token ${token}`);
  }
  assert.ok(contrast('#17202c','#efede6')>=4.5);
  assert.ok(contrast('#5b6570','#efede6')>=4.5);
  assert.ok(contrast('#496477','#efede6')>=4.5);
  assert.ok(contrast('#88574d','#efede6')>=4.5);
  assert.ok(contrast('#17202c','#c9a66b')>=4.5);
  assert.ok(contrast('#17202c','#d7c18a')>=4.5);
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
  assert.match(methodology,/Далі — джерела, правила, приклади та межі впевненості/u);
  assert.match(methodology,/<h2>Про систему<\/h2>/u);
  assert.doesNotMatch(methodology,/джогакбо/u);
  const start=service.indexOf('<textarea id="source-input"');
  const end=service.indexOf('>',start);
  assert.ok(start>=0);
  assert.doesNotMatch(service.slice(start,end),/placeholder=/u);
});

test('the specimen keeps its three-colour editorial hierarchy without object labels',()=>{
  const css=read('src/styles/editorial.css');
  assert.match(css,/\.editorial-site \.specimen-flow p span\{display:none\}/u);
  assert.match(css,/\.editorial-site \.specimen-flow p:first-child\{background:linear-gradient/su);
  assert.match(css,/\.editorial-site \.specimen-flow p:nth-child\(2\)\{background:linear-gradient/su);
  assert.match(css,/\.editorial-site \.specimen-flow p:nth-child\(3\)\{background:linear-gradient/su);
  assert.match(css,/\.editorial-site \.specimen-flow p::after/u);
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
  assert.match(css,/\.editorial-site \.mode-option:has\(input:checked\)\{[^}]*background:var\(--palette-tint-ochre\)/su);
  const ukrainian=html.match(/<article id="panel-ukrainian"[\s\S]*?<\/article>/u)?.[0]||'';
  assert.match(ukrainian,/<p id="status-note" class="results-note result-provenance">/u);
  assert.doesNotMatch(html,/<\/article>\s*<p id="status-note"/u);
  assert.match(css,/\.editorial-site \.result-provenance\{background:transparent\}/u);
});


test('research analysis uses one accessible three-level slider, not visible checkboxes',()=>{
  const html=read('index.html');
  const js=read('src/main.js');
  assert.match(html,/<input[^>]*id="morphology-level"[^>]*type="range"/u);
  assert.match(html,/Строгий/u);
  assert.match(html,/М’який/u);
  assert.match(html,/Суперм’який/u);
  assert.match(html,/aria-describedby="morphology-level-guidance"/u);
  assert.match(html,/id="morphology-level-guidance"/u);
  assert.match(js,/morphologyLevel\?\.value/u);
  assert.match(js,/addEventListener\('input'/u);
  assert.match(html,/id="soft-morphology"[^>]*hidden/u);
  assert.match(html,/id="super-soft-morphology"[^>]*hidden/u);
});

test('the hero specimen is a stitched patchwork composition and the palette is shared',()=>{
  const css=read('src/styles/editorial.css');
  assert.match(css,/--palette-ink:/u);
  assert.match(css,/--palette-jade:/u);
  assert.match(css,/--palette-blue:/u);
  assert.match(css,/--palette-ochre:/u);
  assert.match(css,/--palette-clay:/u);
  assert.match(css,/--palette-paper:/u);
  assert.match(css,/specimen-flow p:first-child[^{]*\{[^}]*linear-gradient/su);
  assert.match(css,/specimen-flow p:nth-child\(2\)[^{]*\{[^}]*linear-gradient/su);
  assert.match(css,/specimen-flow p:nth-child\(3\)[^{]*\{[^}]*linear-gradient/su);
  assert.match(css,/specimen-flow p::after/u);
});

test('syllable trace uses a compact responsive information grid',()=>{
  const html=read('index.html');
  const css=read('src/styles/editorial.css');
  assert.match(html,/class="trace-list" aria-label="Корейський сегмент/u);
  assert.match(css,/\.editorial-site \.trace-row\{[^}]*display:grid/su);
  assert.match(css,/grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/u);
  assert.match(css,/@media\s*\(max-width:\s*900px\)/u);
  assert.match(css,/@media\s*\(max-width:\s*560px\)/u);
});

test('hero specimens and Ukrainian results use regular rather than bold glyph weight',()=>{
  const service=read('index.html');
  const methodology=read('system.html');
  const css=read('src/styles/editorial.css');
  for(const html of [service,methodology]){
    const header=html.slice(html.indexOf('<header class="site-header">'),html.indexOf('</header>')+9);
    assert.match(header,/class="specimen-label"/u);
    assert.match(header,/class="specimen-value specimen-glyph"/u);
    assert.match(header,/class="specimen-value specimen-ipa"/u);
    assert.match(header,/class="specimen-value specimen-ua"/u);
    assert.doesNotMatch(header,/<strong class="specimen-/u);
  }
  assert.match(css,/\.editorial-site \.specimen-flow \.specimen-value\{[^}]*font-weight:400!important/su);
  assert.match(css,/\.editorial-site \.result-card:first-child \.result-body,[\s\S]*?#result-ukrainian\{font-weight:400!important/su);
  assert.match(css,/\.editorial-site #result-ukrainian,[\s\S]*?font-family:"Noto Sans Ukrainian"/u);
  assert.match(css,/font-synthesis:none/u);
});

test('paragraph emphasis does not create isolated bold words or glyphs',()=>{
  const css=read('src/styles/editorial.css');
  assert.match(css,/\.editorial-site p strong,\.editorial-site p b,\.editorial-site li strong,\.editorial-site li b,\.editorial-site td strong,\.editorial-site td b\s*\{[^}]*font-weight:inherit/u);
});

test('hero specimen is an asymmetrical overlapping jogakbo collage, not three equal table cells',()=>{
  const css=read('src/styles/editorial.css');
  for(const fragment of [
    'grid-template-columns:repeat(12,minmax(0,1fr))',
    'grid-column:1 / 6;grid-row:1 / 8',
    'grid-column:5 / 11;grid-row:1 / 6',
    'grid-column:8 / 13;grid-row:4 / 9',
    'transform:rotate(-2.2deg)',
    'transform:rotate(2.6deg)',
    'clip-path:polygon',
    'border:1px dashed rgb(23 32 44 / 48%)',
    'grid-template-columns:repeat(24,minmax(0,1fr))',
    'grid-column:3/7;grid-row:3/7'
  ]) assert.ok(css.includes(fragment),'missing collage treatment: '+fragment);
});


test('the entire interface resolves through one restrained jogakbo palette',()=>{
  const css=read('src/styles/editorial.css');
  for(const token of ['--palette-panel:var(--palette-surface)','--palette-panel-raised:var(--palette-surface-bright)','--palette-panel-muted:var(--palette-surface-soft)','--palette-panel-line:var(--palette-line)','--palette-tint-jade:#e7eee8','--palette-tint-blue:#e8edf0','--palette-tint-ochre:#f1eadc','--palette-tint-clay:#f2e6e1','--palette-line-ochre:#d9cbb7','--palette-status-success:#285443','--palette-status-warning:#75463d']){
    assert.ok(css.toLowerCase().includes(token),'missing palette role '+token);
  }
  for(const selector of ['.workbench','.input-shell','.mode-fieldset','.button-primary','.output-workspace','.result-card','.empty-state','.trace-row','.doc-content .callout','.doc-content th','.site-footer']){
    assert.ok(css.includes(selector),'palette mapping missing for '+selector);
  }
  assert.match(css,/--palette-indigo:#496477/u);
  assert.match(css,/--palette-signal:#88574d/u);
  assert.match(css,/--palette-acid:#d7c18a/u);
  assert.doesNotMatch(css.split('html{')[1]||css.split('html {')[1]||'',/#[0-9a-f]{3,8}\b/iu,'component colors must resolve through palette tokens, not one-off hex values');
});

test('large working and reading surfaces share the warm paper system',()=>{
  const css=read('src/styles/editorial.css');
  const lastRule=selector=>{
    const start=css.lastIndexOf(selector+'{');
    assert.ok(start>=0,'missing final surface rule '+selector);
    return css.slice(start,css.indexOf('}',start)+1);
  };
  assert.match(css,/--palette-panel:var\(--palette-surface\)/u);
  assert.match(css,/--palette-panel-raised:var\(--palette-surface-bright\)/u);
  assert.match(css,/--palette-panel-muted:var\(--palette-surface-soft\)/u);
  assert.match(css,/--palette-panel-line:var\(--palette-line\)/u);
  for(const [selector,background] of [
    ['.editorial-site .workbench','var(--palette-surface)'],
    ['.editorial-site .input-shell','var(--palette-surface-bright)'],
    ['.editorial-site .mode-fieldset','var(--palette-surface-soft)'],
    ['.editorial-site .result-card:first-child','var(--palette-surface)'],
    ['.editorial-site .methodology-toc','var(--palette-surface)']
  ]) assert.ok(lastRule(selector).includes('background:'+background),'wrong material for '+selector);
  for(const selector of ['.editorial-site .workbench','.editorial-site .input-shell textarea','.editorial-site .result-card:first-child','.editorial-site .methodology-toc']){
    assert.ok(lastRule(selector).includes('color:var(--palette-ink)'),'light surface must use ink text: '+selector);
  }
});

test('Ukrainian output uses a bundled regular Cyrillic font, not platform fallback',()=>{
  const css=read('src/styles/editorial.css');
  const fontPath=path.join(root,'src/fonts/NotoSans-Regular.woff2');
  assert.ok(fs.existsSync(fontPath),'bundled Noto Sans font asset is present');
  assert.ok(fs.statSync(fontPath).size>5000,'font asset is complete, not an empty placeholder');
  assert.match(css,/@font-face\s*\{[^}]*font-family:\s*"Noto Sans Ukrainian"[^}]*src:\s*url\("\.\.\/fonts\/NotoSans-Regular\.woff2"\)/su);
  assert.match(css,/\.editorial-site #result-ukrainian,[\s\S]*?font-family:"Noto Sans Ukrainian"/u);
  assert.match(css,/\.editorial-site \.specimen-flow \.specimen-ua\{[^}]*font-family:"Noto Sans Ukrainian"/u);
  assert.match(css,/font-weight:400!important;[^}]*font-synthesis:none/su);
});

test('base surface declarations are light instead of relying on late dark-to-light overrides',()=>{
  const css=read('src/styles/editorial.css');
  assert.match(css, /\.editorial-site \.workbench\{[^}]*background:var\(--palette-surface\);color:var\(--palette-ink\)/u);
  assert.match(css, /\.editorial-site \.input-shell\{[^}]*background:var\(--palette-surface-bright\);color:var\(--palette-ink\)/u);
  assert.match(css, /\.editorial-site \.mode-fieldset\{[^}]*background:var\(--palette-surface-soft\);color:var\(--palette-ink\)/u);
  assert.match(css, /\.editorial-site \.result-card:first-child\{[^}]*background:var\(--palette-surface\);color:var\(--palette-ink\)/u);
  assert.match(css, /\.editorial-site \.methodology-toc\{[^}]*background:var\(--palette-surface\);color:var\(--palette-ink\)/u);
});

test('rendered browser review verifies Ukrainian font loading and shared surface materials',()=>{
  const review=read('scripts/capture-editorial-review.mjs');
  assert.match(review,/document\.fonts\.check\('400 16px "Noto Sans Ukrainian"','ІЇЄҐіїєґ'\)/u);
  assert.match(review,/ukrainianTypography/u);
  assert.match(review,/surfaceMaterials/u);
  assert.match(review,/fontWeight/u);
  assert.match(review,/fontSynthesis/u);
  assert.match(review,/rgb\(250, 249, 244\)/u);
  assert.match(review,/expectedFocusColor=.*rgb\(73, 100, 119\)/u);
});


test('the browser workflow audits every Ukrainian uppercase and lowercase glyph in the bundled font',()=>{
  const audit=read('scripts/audit_ukrainian_font_cmap.py');
  const workflow=read('.github/workflows/editorial-visual-review.yml');
  const alphabet='АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯабвгґдеєжзиіїйклмнопрстуфхцчшщьюя';
  assert.ok(audit.includes(alphabet),'font cmap audit must require the complete Ukrainian alphabet');
  assert.match(audit,/usWeightClass\s*!=\s*400/u,'font metadata must be true regular weight');
  assert.ok(workflow.includes('python scripts/audit_ukrainian_font_cmap.py'));
});



