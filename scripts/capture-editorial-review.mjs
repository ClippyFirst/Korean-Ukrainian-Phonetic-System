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

      const metrics = await page.evaluate(() => {
        const visible = selector => [...document.querySelectorAll(selector)]
          .filter(el => {
            const rect=el.getBoundingClientRect();
            const style=getComputedStyle(el);
            return rect.width>0 && rect.height>0 && style.visibility!=='hidden' && style.display!=='none';
          });
        const touchControls = visible('button, summary, .site-nav a');
        return {
          viewportWidth:innerWidth,
          documentWidth:document.documentElement.scrollWidth,
          bodyWidth:document.body.scrollWidth,
          heading:document.querySelector('h1')?.innerText ?? '',
          controls:touchControls.map(el => {
            const rect=el.getBoundingClientRect();
            return {label:(el.innerText||el.getAttribute('aria-label')||el.tagName).trim().slice(0,60),width:Math.round(rect.width),height:Math.round(rect.height)};
          })
        };
      });

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
        const value=getComputedStyle(document.querySelector('.button')).transitionDuration;
        return value.split(',').every(part => parseFloat(part) <= 0.00002);
      });
      if (!reducedMotion) failures.push(`${pageName} at ${viewport.name}: reduced-motion preference does not suppress control transitions`);
      const prefix = `${pageName} at ${viewport.name} (${viewport.width}×${viewport.height})`;
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
