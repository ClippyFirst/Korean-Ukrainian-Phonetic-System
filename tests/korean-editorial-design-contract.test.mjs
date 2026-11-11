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
    const specimen=html.slice(html.indexOf('<div class="specimen-grid"'),html.indexOf('</aside>'));
    assert.equal((specimen.match(/class="specimen-tile/g)??[]).length,3,"the specimen uses three deliberately unequal panels");
    assert.doesNotMatch(html,/class="taegeuk"/u);
    if(page==="system.html") assert.doesNotMatch(html,/class="section-kicker"/u,"methodology headings stand on their own without eyebrow labels");
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
  assert.match(css,/--hanji:\s*#f2f3ef/i);
  assert.match(css,/--ink-navy:\s*#16191f/i);
  assert.match(css,/--cobalt:\s*#2448d8/i);
  assert.match(css,/--signal-pink:\s*#ff5aa5/i);
  assert.match(css,/--signal-yellow:\s*#d9e64b/i);
    assert.match(css,/\.workspace-layout\s*\{/u);
  assert.match(css,/\.system-page \.doc-content/u);
  assert.match(css,/\.system-intro\s*\{[^}]*border-left:\s*1px solid var\(--seam\)/u,'methodology notice uses a seam, not a heavy coloured side rail');
  assert.match(css,/\.system-intro\s*\{[^}]*border-top:\s*2px solid var\(--cobalt\)/u,'methodology notice keeps its accent on the top edge');
  assert.match(css,/@media\s*\(prefers-reduced-motion:\s*reduce\)/u);
  assert.match(css,/@media\s*\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)/u,'movement on hover is restricted to pointer devices');
  assert.match(css,/:focus-visible/u);
  assert.match(css,/html\s*\{\s*scroll-behavior:\s*auto;/u);
  assert.doesNotMatch(css+baseCss,/background(?:-image)?:[^;]*gradient\s*\(/iu);
  assert.ok(contrast('#2448d8','#f2f3ef')>=4.5,'cobalt text on the paper ground meets WCAG AA');
  assert.ok(contrast('#16191f','#f2f3ef')>=4.5,'ink text on the paper ground meets WCAG AA');
  assert.ok(contrast('#16191f','#ff5aa5')>=4.5,'ink text on the pink specimen meets WCAG AA');
  assert.ok(contrast('#ffffff','#2448d8')>=4.5,'white text on cobalt actions meets WCAG AA');
  assert.ok(contrast('#16191f','#d9e64b')>=4.5,'ink text on the yellow specimen meets WCAG AA');
  assert.match(css,/grid-template-columns:\s*minmax\(0,\s*1\.12fr\)\s+minmax\(0,\s*\.88fr\)/u);
  assert.match(css,/\.specimen-tile-hangul\s*\{[^}]*grid-row:\s*1\s*\/\s*span\s*2/u);
});

test('keeps the user-facing romanization label in Ukrainian',()=>{
  const service=read('index.html');
  const methodology=read('system.html');
  assert.match(service,/Романізація \(RR\)/u);
  assert.doesNotMatch(service,/Revised Romanization/u);
  assert.match(methodology,/Переглянута романізація \(RR\)/u);
  assert.doesNotMatch(methodology,/Revised Romanization/u);
});

test('keeps visible technical terminology Ukrainian where no standard English name is needed',()=>{
  const service=read('index.html');
  const methodology=read('system.html');
  assert.doesNotMatch(service,/кожен блок Hangul/u);
  assert.doesNotMatch(methodology,/orthographic-phonemic fallback/u);
  assert.doesNotMatch(methodology,/лексичний round-trip|Round-trip сам/u);
  assert.doesNotMatch(methodology,/через IPA conversion/u);
});

test('methodology explains the Korean visual concept in Ukrainian',()=>{
  const methodology=read('system.html');
  assert.match(methodology,/Візуальна логіка/u);
  assert.match(methodology,/джогакбо — корейського клаптикового полотна/u);
  assert.match(methodology,/хангиль, IPA й український запис/u);
});
