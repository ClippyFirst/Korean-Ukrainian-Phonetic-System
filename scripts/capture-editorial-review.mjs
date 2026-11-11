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
      if (pageName === 'index.html') {
        await page.locator('#source-input').fill('시');
        await page.locator('#results:not([hidden])').waitFor({state:'visible'});
        await page.locator('#result-ukrainian').waitFor({state:'visible'});
      }

      const metrics = await page.evaluate(expectedWidth => {
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
          heading:document.querySelector('h1')?.innerText ?? '',
          controls:touchControls.map(el => {
            const rect=el.getBoundingClientRect();
            return {label:(el.innerText||el.getAttribute('aria-label')||el.tagName).trim().slice(0,60),width:Math.round(rect.width),height:Math.round(rect.height)};
          }),
          flowChecks:['.hero','.workspace-layout','.result-grid','.methodology-toc','.doc-section','.system-intro','.specimen-flow','.layers','.decision-table'].map(selector=>{
            const el=document.querySelector(selector);
            if(!el)return {selector,exists:false};
            const style=getComputedStyle(el);
            const children=[...el.children].map(child=>child.getBoundingClientRect());
            const verticallyStacked=children.every((rect,index)=>index===0||rect.top>=children[index-1].bottom-2);
            return {selector,exists:true,display:style.display,flexDirection:style.flexDirection,verticallyStacked,childCount:children.length};
          }),
          objectChromeCount:document.querySelectorAll('.specimen-top,.specimen-bottom,.method-line,.result-meta,.table-head,.doc-label,.status-chip,.trace-summary-index,.trace-summary-mark').length,
          taskOrder:pageName==='index.html'?['#source-input','#transliteration-mode','#example-button','#panel-ukrainian','#panel-ipa','#panel-romanization'].map(selector=>{
            const el=document.querySelector(selector);
            return el?{selector,top:Math.round(el.getBoundingClientRect().top)}:{selector,top:null};
          }):['.hero-copy','.specimen-flow','.methodology-toc','.doc-section'].map(selector=>{
            const el=document.querySelector(selector);
            return el?{selector,top:Math.round(el.getBoundingClientRect().top)}:{selector,top:null};
          })
        };
      }, viewport.width);

      const file = `${outputDir}/${pageName.replace('.html','')}-${viewport.name}.png`;
      await page.screenshot({path:file,fullPage:true,animations:'disabled'});
      await page.keyboard.press('Tab');
      const focusStyle = await page.evaluate(() => {
        const style=getComputedStyle(document.activeElement);
        return {outlineStyle:style.outlineStyle,outlineWidth:parseFloat(style.outlineWidth),outlineColor:style.outlineColor};
      });
      if (focusStyle.outlineStyle === 'none' || focusStyle.outlineWidth < 2 || focusStyle.outlineColor !== 'rgb(36, 72, 216)') {
        failures.push(`${pageName} at ${viewport.name}: keyboard focus is not visibly marked in cobalt: ${JSON.stringify(focusStyle)}`);
      }
      await page.emulateMedia({reducedMotion:'reduce'});
      const reducedMotion = await page.evaluate(() => {
        const value=getComputedStyle(document.querySelector('.site-nav a')).transitionDuration;
        return value.split(',').every(part => parseFloat(part) <= 0.00002);
      });
      if (!reducedMotion) failures.push(`${pageName} at ${viewport.name}: reduced-motion preference does not suppress control transitions`);
      const prefix = `${pageName} at ${viewport.name} (${viewport.width}×${viewport.height})`;
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
      for (const check of metrics.flowChecks) {
        if (check.exists && (check.display === 'grid' || (check.display === 'flex' && check.flexDirection !== 'column') || !check.verticallyStacked)) {
          failures.push(`${prefix}: ${check.selector} is not a single vertical flow: ${JSON.stringify(check)}`);
        }
      }
      if (metrics.objectChromeCount !== 0) failures.push(`${prefix}: object-level header/footer chrome remains (${metrics.objectChromeCount} elements)`);
      const orderTops=metrics.taskOrder.map(item=>item.top);
      if (orderTops.some(value=>value===null) || orderTops.some((value,index)=>index>0&&value<orderTops[index-1]-2)) {
        failures.push(`${prefix}: content order is not top-to-bottom: ${JSON.stringify(metrics.taskOrder)}`);
      }
      if (pageErrors.length) failures.push(`${prefix}: page errors: ${pageErrors.join('; ')}`);
      console.log(JSON.stringify({page:pageName,viewport:viewport.name,...metrics,screenshot:file}));
      await page.close();
    }
  }
} finally {
  await browser.close();
}

assert.deepEqual(failures,[],failures.join('\n'));
console.log('Editorial browser review passed: 10 page/viewport combinations; screenshots saved.');
