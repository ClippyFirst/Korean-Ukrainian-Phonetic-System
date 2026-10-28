import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const baseUrl = process.env.PAGES_URL || 'https://clippyfirst.github.io/Korean-Ukrainian-Phonetic-System/';
const passage = readFileSync('tests/fixtures/g2pk-web-adversarial.txt', 'utf8').trim();
assert.ok(passage.length > 1000, 'the live smoke fixture must remain a long adversarial Korean passage');

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('simulated clipboard permission denial')) }
    });
  });
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
      const candidatePanel = document.querySelector('#candidate-panel');
      const candidate = document.querySelector('#candidate-value')?.textContent?.trim() || '';
      const candidateVisible = Boolean(candidatePanel && !candidatePanel.hidden && candidate.length > 20);
      const ipa = document.querySelector('#result-ipa')?.textContent?.trim() || '';
      // The UI intentionally withholds accepted Ukrainian output when any
      // target mapping is provisional. In that case, a substantial candidate
      // is acceptable only if the separate candidate panel visibly labels it.
      return results && !results.hidden && (ukrainian.length > 20 || candidateVisible) && ipa.length > 20;
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
      candidatePanelHidden: document.querySelector('#candidate-panel')?.hidden ?? null,
      candidateLength: document.querySelector('#candidate-value')?.textContent?.trim().length ?? null,
      ukrainianOutputLabel: document.querySelector('#ukrainian-output-label')?.textContent?.trim() ?? null,
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
  const candidatePanel = page.locator('#candidate-panel');
  const candidateVisible = await candidatePanel.isVisible();
  const candidate = (await page.locator('#candidate-value').innerText()).trim();
  const outputLabel = (await page.locator('#ukrainian-output-label').innerText()).trim();
  const ipa = (await page.locator('#result-ipa').innerText()).trim();
  const status = (await page.locator('#status-note').innerText()).trim();
  // A neutral status message is deliberately rendered in the primary result slot;
  // it must not be mistaken for accepted Ukrainian output merely because it is long.
  const acceptedOutput = outputLabel === 'Український запис' && ukrainian.length > 20;
  const displayedCandidate = candidateVisible && candidate.length > 20;
  const displayedUkrainian = acceptedOutput ? ukrainian : candidate;

  assert.ok(displayedUkrainian.length > 100,
    'long input should produce a substantial accepted Ukrainian output or an explicitly displayed provisional candidate');
  if (!acceptedOutput) {
    assert.ok(displayedCandidate, 'provisional status must not leave the Ukrainian/candidate panel empty');
    assert.equal(ukrainian, 'Немає підтвердженого запису',
      'the primary result slot must show a neutral status instead of a provisional candidate');
    assert.equal(outputLabel, 'Запис не підтверджено',
      'the primary result label must disclose that no accepted Ukrainian output exists');
    assert.equal(await page.locator('#ukrainian-copy-button').isVisible(), false,
      'the primary-result copy action must not copy a neutral status as Ukrainian output');
    assert.equal(await page.locator('#candidate-copy-button').isVisible(), true,
      'the separate candidate panel must expose its own copy action');
    assert.match(status, /Показано попередній кандидат, не підтверджений результат/u,
      'the status note must explicitly disclose the provisional candidate');
  }
  assert.ok(ipa.length > 100, 'long input should produce a substantial IPA result');
  assert.match(status, /g2pK JS/u, 'the live page must stay in the practical JavaScript-port mode');
  assert.deepEqual(pageErrors, [], 'the live page must not throw browser runtime errors');


  // The live region should communicate a useful result state/value, not only
  // a generic "processing complete" message.
  await page.waitForFunction(() => {
    const message = document.querySelector('#live-region')?.textContent || '';
    return message.includes('Обробку завершено') &&
      (message.includes('Український запис:') || message.includes('Дослідницький кандидат:') || message.includes('не підтверджено'));
  }, null, { timeout: 5000 });

  // Technical provenance stays available but is no longer required to choose
  // a mode. Native details/summary preserves keyboard access.
  const modeDisclosure = page.locator('.mode-disclosure');
  assert.equal(await modeDisclosure.isVisible(), true, 'technical caveat disclosure must be visible');
  await modeDisclosure.locator('summary').click();
  assert.match(await modeDisclosure.innerText(), /JavaScript-порт g2pK/u,
    'technical engine provenance must remain available on demand');

  // Simulate clipboard permission denial and verify the fallback selects the
  // intended field and gives visible, actionable feedback.
  await page.locator('[data-copy="ipa"]').click();
  const copyFeedback = page.locator('#copy-feedback');
  await copyFeedback.waitFor({ state: 'visible', timeout: 3000 });
  assert.match(await copyFeedback.innerText(), /Текст виділено.*Ctrl\+C/u,
    'clipboard denial must provide visible keyboard recovery guidance');
  const selectedText = await page.evaluate(() => window.getSelection()?.toString() || '');
  assert.equal(selectedText, ipa, 'clipboard fallback must select the exact intended output');

  // Verify each trace value has a mobile-visible field label, not merely a
  // desktop column heading that disappears at narrow widths.
  await page.locator('.trace-disclosure summary').click();
  await page.locator('#trace-list .trace-row').first().waitFor({ state: 'visible', timeout: 5000 });
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileTrace = await page.evaluate(() => {
    const row = document.querySelector('#trace-list .trace-row');
    const field = row?.querySelector('[data-label]');
    return {
      label: field?.dataset.label || '',
      pseudo: field ? getComputedStyle(field, '::before').content : 'none',
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth
    };
  });
  assert.ok(mobileTrace.label.length > 0, 'mobile trace values must have field labels');
  assert.notEqual(mobileTrace.pseudo, 'none', 'mobile trace labels must be visibly rendered');
  assert.ok(mobileTrace.document <= mobileTrace.viewport,
    `mobile trace must not introduce horizontal overflow (${mobileTrace.document}px > ${mobileTrace.viewport}px)`);

  // Check the methodology contents and one representative fragment on mobile.
  const systemUrl = new URL('system.html', baseUrl);
  systemUrl.searchParams.set('__smoke', String(Date.now()));
  await page.goto(systemUrl.toString(), { waitUntil: 'networkidle', timeout: 60000 });
  const toc = page.locator('.methodology-toc');
  assert.equal(await toc.isVisible(), true, 'methodology contents must be visible');
  await toc.locator('a[href="#methodology-00a"]').click();
  await page.waitForFunction(() => location.hash === '#methodology-00a');
  assert.ok(await page.locator('#methodology-00a').isVisible(),
    'methodology contents links must navigate to real section anchors');
  assert.deepEqual(pageErrors, [], 'UX smoke must not introduce browser runtime errors');

  console.log('PASS live UX smoke: live result announcement; mode disclosure; clipboard-denial fallback; mobile trace labels at 390px; methodology navigation');

  console.log(`PASS live browser smoke: ${passage.length} Korean input characters; ${acceptedOutput ? 'accepted output' : 'provisional candidate'} ${displayedUkrainian.length} chars; ${ipa.length} IPA chars; status=${status}`);
} finally {
  await browser.close();
}
