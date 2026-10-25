import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const baseUrl = process.env.PAGES_URL || 'https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/';
const passage = readFileSync('tests/fixtures/g2pk-web-adversarial.txt', 'utf8').trim();
assert.ok(passage.length > 1000, 'the live smoke fixture must remain a long adversarial Korean passage');

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  // Bypass a stale HTML document served by the Pages/CDN edge immediately
  // after deployment. The built JS asset itself is content-hashed.
  const smokeUrl = new URL(baseUrl);
  smokeUrl.searchParams.set('__smoke', String(Date.now()));
  await page.goto(smokeUrl.toString(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.locator('#mode-practical').check();
  await page.locator('#source-input').fill(passage);

  try {
    await page.waitForFunction(() => {
      const results = document.querySelector('#results');
      const ukrainian = document.querySelector('#result-ukrainian')?.textContent?.trim() || '';
      const ipa = document.querySelector('#result-ipa')?.textContent?.trim() || '';
      return results && !results.hidden && ukrainian.length > 20 && ipa.length > 20;
    }, null, { timeout: 45000 });
  } catch (error) {
    // Include the live DOM and browser errors in CI logs. Previously the
    // timeout alone could not distinguish CDN propagation from app failures.
    const diagnostics = await page.evaluate(() => ({
      url: location.href,
      title: document.title,
      inputLength: document.querySelector('#source-input')?.value?.length ?? null,
      practicalChecked: document.querySelector('#mode-practical')?.checked ?? null,
      resultsHidden: document.querySelector('#results')?.hidden ?? null,
      ukrainianLength: document.querySelector('#result-ukrainian')?.textContent?.trim().length ?? null,
      ipaLength: document.querySelector('#result-ipa')?.textContent?.trim().length ?? null,
      status: document.querySelector('#status-note')?.textContent?.trim() ?? null,
      bodyExcerpt: document.body.innerText.slice(0, 1200),
      scriptUrls: [...document.scripts].map(script => script.src).filter(Boolean)
    }));
    console.error(JSON.stringify({
      smokeFailure: error.message,
      pageErrors,
      diagnostics
    }, null, 2));
    throw error;
  }

  const ukrainian = (await page.locator('#result-ukrainian').innerText()).trim();
  const ipa = (await page.locator('#result-ipa').innerText()).trim();
  const status = (await page.locator('#status-note').innerText()).trim();

  assert.ok(ukrainian.length > 100, 'long input should produce a substantial Ukrainian result');
  assert.ok(ipa.length > 100, 'long input should produce a substantial IPA result');
  assert.match(status, /g2pK JS/u, 'the live page must stay in the practical JavaScript-port mode');
  assert.deepEqual(pageErrors, [], 'the live page must not throw browser runtime errors');

  console.log(`PASS live browser smoke: ${passage.length} Korean input characters; ${ukrainian.length} Ukrainian output chars; ${ipa.length} IPA chars; status=${status}`);
} finally {
  await browser.close();
}
