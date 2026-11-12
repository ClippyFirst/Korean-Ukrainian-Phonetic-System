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
  assert.match(html,/id="trace-list"/);
});

test('Ukrainian rendering has one IPA-first path',()=>{
  const engine=read('src/app/engine.js');
  const ipa=read('src/app/engine_ipa.js');
  const convert=read('src/app/engine_convert.js');
  const system=read('system.html');
  // IPA→UA mapping lives in engine_ipa; convertText wires it in engine_convert.
  assert.match(ipa,/function ipaSyllableToUkrainian\(/);
  assert.match(engine,/ipaSyllableToUkrainian/);
  assert.match(convert,/targetFromIpa/);
  assert.doesNotMatch(engine+ipa+convert,/function mapOnset\(/);
  assert.doesNotMatch(engine+ipa+convert,/function mapVowel\(/);
  assert.doesNotMatch(engine+ipa+convert,/function mapCoda\(/);
  assert.match(system,/id="ipa-first-pipeline-2026-10-11"/);
});

test('redesigned workbench preserves accessible navigation and responsive result hierarchy',()=>{
  const html=read('index.html');
  const css=read('src/styles/main.css');
  const editorial=read('src/styles/editorial.css');
  assert.match(html,/class="skip-link" href="#input-heading"/);
  assert.match(html,/class="workspace-layout"/);
  assert.match(html,/class="output-workspace"/);
  assert.match(html,/aria-current="page"/);
  assert.match(html,/class="specimen-flow"/);
  assert.doesNotMatch(html,/class="method-line"/);
  assert.match(css,/:focus-visible/);
  assert.match(css,/@media\s*\(max-width:\s*720px\)/);
  assert.match(css,/@media\s*\(prefers-reduced-motion:reduce\)/);
  assert.match(css,/\.result-card:first-child/);
  assert.match(editorial,/\.editorial-site \.workspace-layout[\s\S]{0,180}grid-template-columns:\s*minmax\(0,\s*1fr\)/u);
});

test('editable adversarial passage has a complete IPA path without inline placeholders',()=>{
  const csv=read('data/korean/canonical_correspondence.csv');
  const lexicalCsv=read('data/korean/lexical_pronunciations.csv');
  const engine=createEngine(csv,lexicalCsv);
  const passage='국립국어원 표준 발음 규정을 확인하는 연구자는 다음을 한 번에 비교했다.';
  const r=engine.convert(passage,{morphologyMode:'practical'});
  const visibleTarget=r.ukrainian||r.candidate_ukrainian||'';
  assert.ok(visibleTarget.length>0);
  if(r.candidate_status==='provisional') assert.equal(r.ukrainian,'');
  assert.doesNotMatch(visibleTarget,/⟦/);
  assert.equal(r.status==='unresolved',false);
});


test('provisional target candidate is announced before generic unavailable status',()=>{
  const main=read('src/main.js');
  assert.match(main,/targetStatusNote\.textContent=r\.candidate_status==='provisional'/);
  assert.match(main,/Показано попередній кандидат, не підтверджений результат/);
});


test('model-selected target output is not presented as independently validated',()=>{
  const main=read('src/main.js');
  assert.match(main,/r\.target_status==='model-selected'\?'Український запис за проєктними відповідностями; незалежно не валідований'/);
});

test('service UX keeps the hero, simplifies the workbench, and progressively discloses trace details',()=>{
  const html=read('index.html');
  const css=read('src/styles/main.css');
  assert.match(html,/id="input-guidance"/);
  assert.match(html,/aria-describedby="input-guidance"/);
  assert.match(html,/<details class="trace-panel trace-disclosure">/);
  assert.match(html,/<summary class="trace-summary">/);
  assert.match(html,/id="result-romanization"/);
  assert.match(css,/\.workspace-layout\s*\{\s*display:\s*flex;/);
  assert.match(css,/\.result-card:first-child\s*\{\s*grid-column:\s*1\s*\/\s*-1/);
  assert.match(css,/\.trace-disclosure\[open\]/);
  assert.match(css,/@media\s*\(max-width:\s*720px\)/);
});


test('Ukrainian status and research candidate share one visible result field',()=>{
  const html=read('index.html');
  const main=read('src/main.js');
  const css=read('src/styles/main.css');
  assert.match(html,/id="ua-unconfirmed-button"[^>]*>Основний результат/);
  assert.match(html,/id="ua-candidate-button"[^>]*>Дослідницький результат/);
  assert.match(html,/id="result-ukrainian"/);
  assert.match(html,/id="candidate-note"/);
  assert.doesNotMatch(html,/id="candidate-panel"|id="candidate-copy-button"|Кандидат — не підтверджений результат/);
  assert.match(main,/function selectUaView\(view\)/);
  assert.match(main,/output\.hidden=false/);
  assert.match(main,/output\.textContent=candidateSelected\?\(candidateValue\?\.textContent/);
  assert.match(main,/ukrainianCopyButton\.hidden=currentTargetUnconfirmed&&!candidateSelected/);
  assert.match(main,/key==='ukrainian'\?output/);
  assert.doesNotMatch(main,/key==='candidate'\?candidateValue|Копіювати кандидата|Непідтверджений дослідницький кандидат скопійовано/);
  assert.doesNotMatch(css,/\.candidate-panel\s*\{|\.candidate-copy-button/);
  assert.match(css,/\.candidate-footnote\s*\{/);
  assert.match(css,/\.result-body\.result-unconfirmed\s*\{/);
});


test('result provenance uses compact labelled metadata and names the active processing mode',()=>{
  const html=read('index.html');
  const main=read('src/main.js');
  const css=read('src/styles/main.css');
  const editorial=read('src/styles/editorial.css');
  const ipaPanel=html.slice(html.indexOf('id="panel-ipa"'),html.indexOf('id="panel-romanization"'));
  const ukrainianPanel=html.slice(html.indexOf('id="panel-ukrainian"'),html.indexOf('id="panel-ipa"'));
  assert.match(ipaPanel,/id="phonology-status-note" class="results-note result-provenance phonology-provenance"/);
  assert.match(ipaPanel,/id="phonology-status-value" class="status-meta-value"/);
  assert.match(ipaPanel,/id="phonology-coverage-value" class="status-meta-detail" hidden/);
  assert.doesNotMatch(ukrainianPanel,/id="phonology-status-note"|id="status-note"/);
  assert.match(main,/const modeLabel=useG2p\?'Звичайний режим':/);
  assert.match(main,/Дослідницький режим · \$\{morphologyDescriptions\.find/);
  assert.match(main,/phonologyStatusValue\.textContent=/);
  assert.match(main,/phonologyCoverageValue\.textContent=coverageLabel/);
  assert.match(main,/r\.candidate_status==='super-soft-low-confidence'/);
  assert.match(ukrainianPanel,/id="target-status-note" class="results-note target-status-note" hidden/);
  assert.match(ukrainianPanel,/id="target-status-value" class="status-meta-value"/);
  assert.match(main,/targetStatusValue\.textContent=/);
  assert.match(main,/Показано попередній кандидат, не підтверджений результат/);
  assert.match(editorial,/grid-template-columns:max-content minmax\(0,1fr\)/);
  assert.match(editorial,/border:0;border-radius:0;background:transparent/);
  assert.match(css,/\.phonology-provenance\s*\{[^}]*border:\s*0/);
  assert.match(css,/\.target-status-note\{[^}]*text-align:left/);
});

test('UX follow-up announces meaningful result state and provides visible clipboard recovery',()=>{
  const html=read('index.html');
  const main=read('src/main.js');
  const css=read('src/styles/main.css');
  assert.match(html,/id="copy-feedback" class="copy-feedback" role="status" hidden/);
  assert.match(main,/function announceResult\(message\)/);
  assert.match(main,/Дослідницький результат: /);
  assert.match(main,/Обробку завершено з попередженнями/);
  assert.match(main,/selection\?\.addRange\(range\)/);
  assert.match(main,/Текст виділено: натисніть Ctrl\+C/);
  assert.match(css,/\.copy-feedback\[hidden\]\s*\{\s*display:\s*none/);
});

test('mode choice is user-oriented while technical caveats remain available on demand',()=>{
  const html=read('index.html');
  assert.match(html,/Для повсякденного використання: показує українське читання/);
  assert.match(html,/<details class="mode-disclosure">/);
  assert.match(html,/Як працює звичайний режим/);
  assert.match(html,/Для частини слів результат може бути неточним/);
  assert.match(html,/Для перевірки правил, невизначеностей і альтернативних вимов/);
  assert.match(html,/На відміну від звичайного режиму на g2pK/);
  assert.match(html,/власний детермінований рушій Козака Кіма/);
});

test('mobile trace values carry explicit labels and methodology has in-page navigation',()=>{
  const html=read('index.html');
  const main=read('src/main.js');
  const system=read('system.html');
  const css=read('src/styles/main.css');
  assert.match(main,/source\.dataset\.label='Корейський сегмент · вхід'/);
  assert.match(main,/mapping\.dataset\.label='IPA-токени → українські графеми'/);
  assert.match(main,/state\.dataset\.label='Статус'/);
  assert.match(css,/\.trace-row > \[data-label\]::before/);
  assert.match(system,/aria-labelledby="methodology-toc-title"/);
  assert.match(system,/href="#methodology-00a"/);
  assert.match(system,/id="methodology-18"/);
  assert.match(css,/\.methodology-toc ol/);
});


test('live browser smoke follows the inline Ukrainian result contract',()=>{
  const smoke=read('scripts/smoke-live-pages-browser.mjs');
  assert.match(smoke,/page\.locator\('#ua-candidate-button'\)\.click\(\)/);
  assert.match(smoke,/candidateOutput, candidate, 'research option must show the candidate in the main Ukrainian field'/);
  assert.match(smoke,/page\.locator\('#candidate-note'\)\.isVisible\(\)/);
  assert.match(smoke,/page\.locator\('#candidate-panel'\)\.count\(\)/);
  assert.match(smoke,/Дослідницький результат/u);
  assert.match(smoke,/#phonology-status-note/u,'live smoke reads pronunciation provenance from the IPA panel');
  assert.match(smoke,/#target-status-note/u,'live smoke reads Ukrainian candidate status from the Ukrainian panel');
  assert.doesNotMatch(smoke,/#status-note/u,'live smoke must not use the removed legacy status selector');
  assert.doesNotMatch(smoke,/candidate-copy-button|Показано попередній кандидат.*окрем/u);
});

test('Super-soft status reports the low-confidence share alongside input coverage',()=>{
  const main=read('src/main.js');
  assert.match(main,/low_confidence_share/u);
  assert.match(main,/низька впевненість:/u);
});


test('three research profiles distinguish heuristic Soft from grapheme-only Super-soft',()=>{
  const html=read('index.html');
  const engine=read('src/app/engine_convert.js');
  const main=read('src/main.js');
  assert.match(html,/id="morphology-level" type="range"/u);
  assert.match(html,/Строгий[\s\S]*М’який[\s\S]*Суперм’який/u);
  assert.ok(html.indexOf('id="morphology-level"')<html.indexOf('id="soft-morphology"'),'the visible slider precedes hidden compatibility inputs');
  assert.match(engine,/requestedMorphologyMode==='soft'\?'super-soft'/u);
  assert.match(engine,/requestedMorphologyMode==='super-soft'\?'grapheme-fallback'/u);
  assert.match(engine,/super-soft-grapheme-ipa-fallback/u);
  assert.match(main,/morphologyDescriptions[\s\S]*mode:'strict'[\s\S]*mode:'soft'[\s\S]*mode:'super-soft'/u);
  assert.match(main,/morphologyLevel\?\.value/u);
});


test('Jogakbo masthead and vertical editorial modules preserve the two workbench windows',()=>{
  const html=read('index.html');
  const system=read('system.html');
  const css=read('src/styles/editorial.css');
  const input=html.indexOf('class="workbench"');
  const output=html.indexOf('class="output-workspace"');
  assert.ok(input>=0&&output>input,'Korean input precedes the answer window in the document');
  assert.match(html,/data-visual-system="jogakbo-editorial"/);
  assert.match(system,/data-visual-system="jogakbo-editorial"/);
  assert.match(html,/class="jogakbo-band"/);
  assert.match(system,/class="jogakbo-band"/);
  assert.match(html,/id="input-module-guidance"/);
  assert.match(html,/id="output-module-guidance"/);
  assert.match(system,/id="methodology-reading-guide"/);
  assert.match(css,/--jogakbo-ink:var\(--palette-ink\)/i);
  assert.match(css,/--jogakbo-jade:var\(--palette-jade\)/i);
  assert.match(css,/--signal:var\(--palette-signal\)/i);
  assert.match(css,/--acid:var\(--palette-acid\)/i);
  assert.match(css,/--cobalt:var\(--palette-indigo\)/i);
  assert.match(css,/--signal-deep:var\(--palette-clay-deep\)/i);
  assert.match(css,/\.editorial-site \.mode-option\{[^}]*grid-template-columns:32px minmax\(0,1fr\)[^}]*border:1px solid var\(--palette-line\)[^}]*border-radius:var\(--radius-small\)/s,'mode choices render as separate inset cards rather than touching shared row rules');
  assert.match(css,/\.editorial-site \.mode-option input\{[^}]*width:20px[^}]*justify-self:center[^}]*appearance:none/s,'radio controls sit centered in a dedicated control gutter');
  assert.match(css,/\.editorial-site \.mode-option:has\(input:checked\)\{[^}]*border:1px solid var\(--palette-ochre\)[^}]*box-shadow:none/s,'selected mode uses a full card outline instead of an edge stripe');
  assert.match(css,/\.editorial-site \.workspace-layout\s*\{[^}]*grid-template-columns:\s*minmax\(0,1fr\)/s);
  assert.match(css,/\.editorial-site \.result-card:first-child\s*\{[^}]*grid-column:1\s*\/\s*-1/s);
  assert.match(css,/\.editorial-site \.methodology-toc ol/);
  assert.match(css,/\.editorial-site \.doc-content table/);
  assert.match(css,/\.editorial-site\.system-page \.layers\s*\{[^}]*grid-template-columns:\s*minmax\(0,1fr\)/s);
  assert.match(css,/@media\(max-width:480px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css,/specimen-flow p:first-child\{background:linear-gradient/i);
});


test('jogakbo hero keeps all three specimen labels and values visible without overlapping grid tracks',()=>{
  const html=read('index.html');
  const css=read('src/styles/editorial.css');
  assert.match(html,/01 · Написання[\s\S]*02 · Вимова · IPA[\s\S]*03 · Український запис/u);
  assert.match(css,/Readable jogakbo specimen: preserve the textile collage without hiding its content/);
  assert.match(css,/grid-template-columns:repeat\(12,minmax\(0,1fr\)\)/);
  assert.match(css,/grid-column:1 \/ 5/);
  assert.match(css,/grid-column:5 \/ 9/);
  assert.match(css,/grid-column:9 \/ 13/);
  assert.match(css,/grid-template-rows:repeat\(3,minmax\(116px,auto\)\)/);
  assert.match(css,/\.specimen-flow \.specimen-label\{[\s\S]*display:block/);
  assert.match(css,/\.specimen-flow \.specimen-ua\{[\s\S]*white-space:normal/);
});
