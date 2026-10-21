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

  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60000 });
  await page.locator('#mode-practical').check();
  await page.locator('#source-input').fill(passage);

  await page.waitForFunction(() => {
    const results = document.querySelector('#results');
    const ukrainian = document.querySelector('#result-ukrainian')?.textContent?.trim() || '';
    const ipa = document.querySelector('#result-ipa')?.textContent?.trim() || '';
    return results && !results.hidden && ukrainian.length > 20 && ipa.length > 20;
  }, null, { timeout: 30000 });

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
