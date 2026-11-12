import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';

const baseUrl = process.env.EDITORIAL_REVIEW_URL ?? 'http://127.0.0.1:4173/';
const outputDir = 'artifacts/editorial-review';
await mkdir(outputDir, {recursive:true});

const viewports = [
  {name:'desktop', width:1440, height:1000, touch:false},
  {name:'laptop', width:1024, height:900, touch:false},
  {name:'tablet', width:768, height:1024, touch:true},
  {name:'mobile', width:390, height:844, touch:true},
  {name:'narrow-mobile', width:320, height:780, touch:true}
];

const browser = await chromium.launch({headless:true});
const failures = [];
try {
  for (const pageName of ['index.html','system.html']) {
    for (const viewport of viewports) {
      const page = await browser.newPage({
        viewport:{width:viewport.width,height:viewport.height},
        deviceScaleFactor:1,
        isMobile:viewport.touch,
        hasTouch:viewport.touch
      });
      const pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      await page.goto(new URL(pageName,baseUrl).href,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      if (pageName === 'index.html') {
        await page.locator('#source-input').fill('시');
        await page.locator('#results:not([hidden])').waitFor({state:'visible'});
        await page.locator('#result-ukrainian').waitFor({state:'visible'});
        await page.locator('#mode-research').check();
        const slider=page.locator('#morphology-level');
        await slider.waitFor({state:'visible'});
        const expectedLevels=['Строгий','М’який','Суперм’який'];
        const levelGuidance=[];
        for(let level=0;level<expectedLevels.length;level++){
          await slider.evaluate((element,value)=>{
            element.value=String(value);
            element.dispatchEvent(new Event('input',{bubbles:true}));
          },level);
          const label=(await page.locator('#morphology-level-value').innerText()).trim();
          const guidance=(await page.locator('#morphology-level-guidance').innerText()).trim();
          const ariaValue=await slider.getAttribute('aria-valuetext');
          if(label!==expectedLevels[level]||ariaValue!==expectedLevels[level]||!guidance){
            failures.push(`index.html at ${viewport.name}: research slider level ${level} is not synchronized with its visible and accessible description: ${JSON.stringify({label,ariaValue,guidance})}`);
          }
          levelGuidance.push({label,ariaValue,guidance});
        }
        await slider.evaluate(element=>{
          element.value='1';
          element.dispatchEvent(new Event('input',{bubbles:true}));
        });
        await page.locator('.trace-disclosure').last().locator('summary').click();
      }

      const visualContracts = await page.evaluate(pageName => {
        const ukrainian = pageName === 'index.html' ? document.querySelector('#result-ukrainian') : document.querySelector('.specimen-flow .specimen-ua');
        const specimen = document.querySelector('.specimen-flow .specimen-ua');
        const surface = selector => {
          const element=document.querySelector(selector);
          return element ? getComputedStyle(element).backgroundColor : null;
        };
        return {
          siteTypography: {
            bodyFontFamily:getComputedStyle(document.body).fontFamily,
            inputFontFamily:document.querySelector('#source-input') ? getComputedStyle(document.querySelector('#source-input')).fontFamily : null
          },
          ukrainianTypography: ukrainian ? {
            fontFamily:getComputedStyle(ukrainian).fontFamily,
            fontWeight:getComputedStyle(ukrainian).fontWeight,
            fontSynthesis:getComputedStyle(ukrainian).fontSynthesis,
            fontLoaded:document.fonts.check('400 16px "Noto Sans Ukrainian"','АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯабвгґдеєжзиіїйклмнопрстуфхцчшщьюя')
          } : null,
          specimenTypography: specimen ? {
            fontFamily:getComputedStyle(specimen).fontFamily,
            fontWeight:getComputedStyle(specimen).fontWeight,
            fontSynthesis:getComputedStyle(specimen).fontSynthesis
          } : null,
          surfaceMaterials: {
            workbench:surface('.workbench'),
            input:surface('.input-shell'),
            modes:surface('.mode-fieldset'),
            answer:surface('.result-card:first-child'),
            methodology:surface('.methodology-toc')
          }
        };
      },pageName);
      const expectedPaper='rgb(250, 249, 244)';
      const expectedBright='rgb(255, 254, 250)';
      const expectedSoft='rgb(233, 229, 220)';
      const expectedSurfaces=pageName==='index.html'
        ? {workbench:expectedPaper,input:expectedBright,modes:expectedSoft,answer:expectedPaper}
        : {methodology:expectedPaper};
      for(const [surface,expected] of Object.entries(expectedSurfaces)){
        if(visualContracts.surfaceMaterials[surface]!==expected){
          failures.push(`${pageName} at ${viewport.name}: ${surface} surface is not using the shared paper palette: ${JSON.stringify(visualContracts.surfaceMaterials)}`);
        }
      }
      const bodyFont=visualContracts.siteTypography.bodyFontFamily;
      const inputFont=visualContracts.siteTypography.inputFontFamily;
      if(!bodyFont.startsWith('"Noto Sans Ukrainian"') || (pageName==='index.html' && !inputFont.startsWith('"Noto Sans Ukrainian"'))){
        failures.push(`${pageName} at ${viewport.name}: Ukrainian text does not prefer the bundled Cyrillic font across site surfaces: ${JSON.stringify(visualContracts.siteTypography)}`);
      }
      for(const [label,typography] of [['Ukrainian output',visualContracts.ukrainianTypography],['Ukrainian hero specimen',visualContracts.specimenTypography]]){
        if(!typography || !typography.fontFamily.includes('Noto Sans Ukrainian') || typography.fontWeight!=='400' || typography.fontSynthesis!=='none' || !visualContracts.ukrainianTypography?.fontLoaded){
          failures.push(`${pageName} at ${viewport.name}: ${label} did not load the bundled regular Cyrillic font: ${JSON.stringify(visualContracts)}`);
        }
      }
      const metrics = await page.evaluate(({expectedWidth,pageName}) => {
        const visible = selector => [...document.querySelectorAll(selector)]
          .filter(el => {
            const rect=el.getBoundingClientRect();
            const style=getComputedStyle(el);
            return rect.width>0 && rect.height>0 && style.visibility!=='hidden' && style.display!=='none';
          });
        const touchControls = visible('button, summary, .site-nav a');
        return {
          requestedWidth:expectedWidth,
          viewportWidth:innerWidth,
          screenWidth:screen.width,
          documentClientWidth:document.documentElement.clientWidth,
          visualViewportWidth:visualViewport?.width ?? null,
          devicePixelRatio,
          viewportMeta:document.querySelector('meta[name="viewport"]')?.content ?? null,
          bodyStyle:{width:getComputedStyle(document.body).width,minWidth:getComputedStyle(document.body).minWidth},
          wideElements:[...document.querySelectorAll('body *')].map(el=>{
            const rect=el.getBoundingClientRect();
            const style=getComputedStyle(el);
            return {tag:el.tagName,id:el.id,className:typeof el.className==='string'?el.className:'',width:Math.round(rect.width),right:Math.round(rect.right),clientWidth:el.clientWidth,scrollWidth:el.scrollWidth,minWidth:style.minWidth,position:style.position,overflowX:style.overflowX,text:(el.innerText||'').trim().slice(0,70)};
          }).filter(el=>el.width>expectedWidth+1||el.right>expectedWidth+1||el.scrollWidth>el.clientWidth+1).sort((a,b)=>b.width-a.width).slice(0,16),
          documentWidth:document.documentElement.scrollWidth,
          bodyWidth:document.body.scrollWidth,
          headerPatchwork:(()=>{
            const band=document.querySelector('.jogakbo-band');
            const rect=band?.getBoundingClientRect();
            const style=band?getComputedStyle(band):null;
            return {visible:Boolean(band&&rect.width>0&&rect.height>0&&style.display!=='none'&&style.visibility!=='hidden'),insideHeader:Boolean(band?.closest('header.site-header')),patchCount:band?.querySelectorAll('.jogakbo-patch').length??0,width:Math.round(rect?.width??0),height:Math.round(rect?.height??0)};
          })(),
          moduleGuidance:pageName==='index.html'?{
            inputVisible:visible('#input-module-guidance').length===1,
            outputVisible:visible('#output-module-guidance').length===1,
            inputTop:document.querySelector('#input-module-guidance')?.getBoundingClientRect().top??null,
            outputTop:document.querySelector('#output-module-guidance')?.getBoundingClientRect().top??null
          }:null,
          methodologyGuideVisible:pageName==='system.html'?visible('#methodology-reading-guide').length===1:null,
          modeOptionContrast:pageName==='index.html'?[...document.querySelectorAll('.mode-option')].map(label=>{
            const luminance=color=>{
              const values=color.match(/[\d.]+/gu)?.slice(0,3).map(Number)??[0,0,0];
              const linear=values.map(value=>{const channel=value/255;return channel<=.04045?channel/12.92:((channel+.055)/1.055)**2.4});
              return .2126*linear[0]+.7152*linear[1]+.0722*linear[2];
            };
            const ratio=(foreground,background)=>{
              const values=[luminance(foreground),luminance(background)].sort((a,b)=>b-a);
              return Number(((values[0]+.05)/(values[1]+.05)).toFixed(2));
            };
            const background=getComputedStyle(label).backgroundColor;
            const parentBackground=getComputedStyle(label.closest('fieldset')).backgroundColor;
            const effectiveBackground=background.includes(', 0)')||background==='transparent'?parentBackground:background;
            return {label:label.querySelector('strong')?.innerText??'',strongColor:getComputedStyle(label.querySelector('strong')).color,detailColor:getComputedStyle(label.querySelector('em')).color,strong:ratio(getComputedStyle(label.querySelector('strong')).color,effectiveBackground),detail:ratio(getComputedStyle(label.querySelector('em')).color,effectiveBackground),background:effectiveBackground};
          }):null,
          heading:document.querySelector('h1')?.innerText ?? '',
          controls:touchControls.map(el => {
            const rect=el.getBoundingClientRect();
            return {label:(el.innerText||el.getAttribute('aria-label')||el.tagName).trim().slice(0,60),width:Math.round(rect.width),height:Math.round(rect.height)};
          }),
          flowChecks:['.hero','.workspace-layout','.result-grid','.methodology-toc','.doc-section','.system-intro','.methodology-reading-guide','.methodology-reading-steps','.specimen-flow','.layers','.rule-grid','.limits','.compare-strip','.decision-table','.table-row','.trace-list','.trace-row','.evidence-list','.vowel-grid','.action-cell'].map(selector=>{
            const el=document.querySelector(selector);
            if(!el)return {selector,exists:false};
            const style=getComputedStyle(el);
            const children=[...el.children].map(child=>child.getBoundingClientRect());
            const verticallyStacked=children.every((rect,index)=>index===0||rect.top>=children[index-1].bottom-2);
            return {selector,exists:true,display:style.display,flexDirection:style.flexDirection,verticallyStacked,childCount:children.length};
          }),
          objectChromeCount:document.querySelectorAll('.specimen-top,.specimen-bottom,.method-line,.result-meta,.table-head,.doc-label,.status-chip,.trace-summary-index,.trace-summary-mark').length,
          provenanceInsidePrimary:pageName==='index.html'?Boolean(document.querySelector('#panel-ukrainian')?.contains(document.querySelector('#status-note'))):null,
          resultGridChildrenAreCards:pageName==='index.html'?[...(document.querySelector('.result-grid')?.children??[])].every(el=>el.matches('.result-card')):null,
          resultGridCardCount:pageName==='index.html'?document.querySelectorAll('.result-grid > .result-card').length:null,
          taskOrder:pageName==='index.html'?['#source-input','#input-module-guidance','#transliteration-mode','#example-button','#output-module-guidance','#panel-ukrainian','#panel-ipa','#panel-romanization'].map(selector=>{
            const el=document.querySelector(selector);
            return el?{selector,top:Math.round(el.getBoundingClientRect().top)}:{selector,top:null};
          }):['.hero-copy','.specimen-flow','.system-intro','.methodology-reading-guide','.methodology-toc','.doc-section'].map(selector=>{
            const el=document.querySelector(selector);
            return el?{selector,top:Math.round(el.getBoundingClientRect().top)}:{selector,top:null};
          })
        };
      }, {expectedWidth:viewport.width,pageName});

      const researchUi = pageName==='index.html'?await page.evaluate(()=>{
        const list=document.querySelector('#trace-list');
        const style=list?getComputedStyle(list):null;
        const row=list?.querySelector('.trace-row');
        return {researchVisible:!document.querySelector('#research-options')?.hidden,sliderVisible:Boolean(document.querySelector('#morphology-level')?.getBoundingClientRect().height),sliderHeight:Math.round(document.querySelector('#morphology-level')?.getBoundingClientRect().height??0),sliderValue:document.querySelector('#morphology-level')?.getAttribute('aria-valuetext')??null,gridDisplay:style?.display??null,gridColumns:style?.gridTemplateColumns?.split(' ').length??0,rowDisplay:row?getComputedStyle(row).display:null,rowCount:list?.querySelectorAll('.trace-row').length??0};
      }):null;
      if(pageName==='index.html'&&(!researchUi.researchVisible||!researchUi.sliderVisible||researchUi.sliderValue!=='М’який'||researchUi.gridDisplay!=='grid'||researchUi.gridColumns<1||researchUi.rowDisplay!=='grid'||(viewport.touch&&researchUi.sliderHeight<44))){
        failures.push(`${pageName} at ${viewport.name}: research slider or compact syllable trace is not rendered as an interactive responsive grid: ${JSON.stringify(researchUi)}`);
      }
      const file = `${outputDir}/${pageName.replace('.html','')}-${viewport.name}.png`;
      await page.screenshot({path:file,fullPage:true,animations:'disabled'});
      await page.keyboard.press('Tab');
      const focusStyle = await page.evaluate(() => {
        const active=document.activeElement;
        const style=getComputedStyle(active);
        return {
          outlineStyle:style.outlineStyle,
          outlineWidth:parseFloat(style.outlineWidth),
          outlineColor:style.outlineColor,
          inWorkbench:Boolean(active.closest('.workbench'))
        };
      });
      const expectedFocusColor=focusStyle.inWorkbench?'rgb(215, 193, 138)':'rgb(73, 100, 119)';
      if (focusStyle.outlineStyle === 'none' || focusStyle.outlineWidth < 2 || focusStyle.outlineColor !== expectedFocusColor) {
        failures.push(`${pageName} at ${viewport.name}: keyboard focus does not match the high-contrast context token: ${JSON.stringify(focusStyle)}`);
      }
      await page.emulateMedia({reducedMotion:'reduce'});
      const reducedMotion = await page.evaluate(() => {
        const value=getComputedStyle(document.querySelector('.site-nav a')).transitionDuration;
        return value.split(',').every(part => parseFloat(part) <= 0.00002);
      });
      if (!reducedMotion) failures.push(`${pageName} at ${viewport.name}: reduced-motion preference does not suppress control transitions`);
      const prefix = `${pageName} at ${viewport.name} (${viewport.width}×${viewport.height})`;
      if (!metrics.headerPatchwork.visible || !metrics.headerPatchwork.insideHeader || metrics.headerPatchwork.patchCount !== 8) {
        failures.push(prefix + ': jogakbo patchwork must render as eight decorative pieces inside the header only: ' + JSON.stringify(metrics.headerPatchwork));
      }
      if (pageName === 'index.html' && (!metrics.moduleGuidance.inputVisible || !metrics.moduleGuidance.outputVisible || metrics.moduleGuidance.outputTop <= metrics.moduleGuidance.inputTop)) {
        failures.push(prefix + ': input/output guidance modules are missing or not in vertical order: ' + JSON.stringify(metrics.moduleGuidance));
      }
      if (pageName === 'system.html' && !metrics.methodologyGuideVisible) {
        failures.push(prefix + ': methodology reading guide is not visible');
      }
      if (pageName === 'index.html' && metrics.modeOptionContrast.some(item=>item.strong<4.5||item.detail<4.5)) {
        failures.push(prefix + ': mode option text must meet WCAG AA against its rendered surface: ' + JSON.stringify(metrics.modeOptionContrast));
      }

      if (metrics.viewportWidth > viewport.width + 1) {
        failures.push(`${pageName} at ${viewport.name}: layout viewport expanded beyond requested width ${viewport.width}: ${JSON.stringify(metrics.wideElements)}`);
      }
      if (metrics.documentWidth > metrics.viewportWidth + 1 || metrics.bodyWidth > metrics.viewportWidth + 1) {
        failures.push(`${prefix}: horizontal overflow document=${metrics.documentWidth}, body=${metrics.bodyWidth}`);
      }
      if (viewport.touch) {
        for (const control of metrics.controls) {
          if (control.height < 44 || control.width < 24) {
            failures.push(`${prefix}: touch target below 44px height / 24px width: ${JSON.stringify(control)}`);
          }
        }
      }
      const flow = Object.fromEntries(metrics.flowChecks.map(check=>[check.selector,check]));
      if (pageName === 'index.html') {
        const workspace = flow['.workspace-layout'];
        if (!workspace?.exists || !workspace.verticallyStacked || workspace.childCount !== 2) {
          failures.push(`${prefix}: input and answer windows are not stacked in source order: ${JSON.stringify(workspace)}`);
        }
        if (!metrics.provenanceInsidePrimary || !metrics.resultGridChildrenAreCards || metrics.resultGridCardCount !== 5) {
          failures.push(`${prefix}: provenance must stay inside the Ukrainian result and the supporting grid must contain five result cards only: ${JSON.stringify({inside:metrics.provenanceInsidePrimary,childrenAreCards:metrics.resultGridChildrenAreCards,cardCount:metrics.resultGridCardCount})}`);
        }
      }
      if (viewport.width >= 980) {
        const hero = flow['.hero'];
        const specimen = flow['.specimen-flow'];
        if (hero?.display !== 'grid' || hero.childCount !== 2) failures.push(`${prefix}: editorial hero composition was lost: ${JSON.stringify(hero)}`);
        if (specimen?.display !== 'grid' || specimen.childCount !== 3) failures.push(`${prefix}: three-part specimen composition was lost: ${JSON.stringify(specimen)}`);
        if (pageName === 'index.html' && flow['.result-grid']?.display !== 'grid') failures.push(`${prefix}: result detail grid was flattened: ${JSON.stringify(flow['.result-grid'])}`);
        if (pageName === 'system.html' && flow['.methodology-toc']?.display !== 'grid') failures.push(`${prefix}: methodology index composition was flattened: ${JSON.stringify(flow['.methodology-toc'])}`);
      }
      if (metrics.objectChromeCount !== 0) failures.push(`${prefix}: object-level header/footer chrome remains (${metrics.objectChromeCount} elements)`);
      const orderTops=metrics.taskOrder.map(item=>item.top);
      if (orderTops.some(value=>value===null) || orderTops.some((value,index)=>index>0&&value<orderTops[index-1]-2)) {
        failures.push(`${prefix}: content order is not top-to-bottom: ${JSON.stringify(metrics.taskOrder)}`);
      }
      if (pageErrors.length) failures.push(`${prefix}: page errors: ${pageErrors.join('; ')}`);
      console.log(JSON.stringify({page:pageName,viewport:viewport.name,...metrics,visualContracts,researchUi,screenshot:file}));
      await page.close();
    }
  }
} finally {
  await browser.close();
}

assert.deepEqual(failures,[],failures.join('\n'));
console.log('Editorial browser review passed: 10 page/viewport combinations; screenshots saved.');
