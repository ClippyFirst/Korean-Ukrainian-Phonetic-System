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

  // Verify the deployed practical path applies the requested Ukrainian target
  // convention to ordinary aspirated and fortis Korean onsets.
  const conventionInput = '코 토 포 초 꼬 또 뽀 쏘 쪼 씨';
  await page.locator('#source-input').fill(conventionInput);
  await page.waitForFunction(() => {
    const output = document.querySelector('#result-ukrainian')?.textContent?.trim() || '';
    const candidate = document.querySelector('#candidate-value')?.textContent?.trim() || '';
    const ipa = document.querySelector('#result-ipa')?.textContent?.trim() || '';
    return (output.length > 0 || candidate.length > 0) && ipa.length > 0;
  }, null, { timeout: 20000 });
  const shortCandidate = (await page.locator('#candidate-value').innerText()).trim();
  if (shortCandidate) {
    await page.locator('#ua-candidate-button').click();
    await page.waitForFunction(() => document.querySelector('#ukrainian-output-label')?.textContent?.trim() === 'Дослідницький результат');
  }
  const conventionOutput = (await page.locator('#result-ukrainian').innerText()).trim();
  for (const expected of ["к'о", "т'о", "п'о", "ч'о", "кко", "тто", "ппо", "ссо", "ччо", "шші"]) {
    assert.ok(conventionOutput.includes(expected), `live target should preserve ${expected} in ${conventionInput}: ${conventionOutput}`);
  }
  await page.locator('#ua-unconfirmed-button').click();

  await page.locator('#source-input').fill(passage);

  try {
    await page.waitForFunction(() => {
      const results = document.querySelector('#results');
      const ukrainian = document.querySelector('#result-ukrainian')?.textContent?.trim() || '';
      const candidate = document.querySelector('#candidate-value')?.textContent?.trim() || '';
      const ipa = document.querySelector('#result-ipa')?.textContent?.trim() || '';
      return results && !results.hidden && ukrainian.length > 20 && candidate.length > 20 && ipa.length > 20;
    }, null, { timeout: 45000 });
  } catch (error) {
    const diagnostics = await page.evaluate(() => ({
      url: location.href,
      title: document.title,
      inputLength: document.querySelector('#source-input')?.value?.length ?? null,
      practicalChecked: document.querySelector('#mode-practical')?.checked ?? null,
      resultsHidden: document.querySelector('#results')?.hidden ?? null,
      ukrainianText: document.querySelector('#result-ukrainian')?.textContent?.trim().slice(0, 160) ?? null,
      candidateLength: document.querySelector('#candidate-value')?.textContent?.trim().length ?? null,
      candidateButtonDisabled: document.querySelector('#ua-candidate-button')?.disabled ?? null,
      candidateNoteHidden: document.querySelector('#candidate-note')?.hidden ?? null,
      ukrainianOutputLabel: document.querySelector('#ukrainian-output-label')?.textContent?.trim() ?? null,
      ipaLength: document.querySelector('#result-ipa')?.textContent?.trim().length ?? null,
      status: document.querySelector('#status-note')?.textContent?.trim() ?? null,
      bodyExcerpt: document.body.innerText.slice(0, 1200),
      scriptUrls: [...document.scripts].map(script => script.src).filter(Boolean)
    }));
    console.error(JSON.stringify({ smokeFailure: error.message, pageErrors, diagnostics }, null, 2));
    throw error;
  }

  const initialUkrainian = (await page.locator('#result-ukrainian').innerText()).trim();
  const candidate = (await page.locator('#candidate-value').innerText()).trim();
  const outputLabel = (await page.locator('#ukrainian-output-label').innerText()).trim();
  const ipa = (await page.locator('#result-ipa').innerText()).trim();
  const status = (await page.locator('#status-note').innerText()).trim();

  assert.ok(candidate.length > 100, 'long input should produce a substantial research candidate');
  assert.equal(await page.locator('#ua-candidate-button').isEnabled(), true,
    'candidate option must be enabled when the engine returns a candidate');
  assert.equal(initialUkrainian, 'Немає підтвердженого запису',
    'unconfirmed mode must not present a candidate as an accepted result');
  assert.equal(outputLabel, 'Достовірний варіант недоступний',
    'the primary-result label must disclose that no accepted Ukrainian output exists');
  assert.equal(await page.locator('#ukrainian-copy-button').isVisible(), false,
    'the primary-result copy action must not copy a neutral status as Ukrainian output');

  // The research option must display the candidate in the same visible output
  // field, not in a separate panel or hidden storage element.
  await page.locator('#ua-candidate-button').click();
  await page.waitForFunction(() => document.querySelector('#ukrainian-output-label')?.textContent?.trim() === 'Дослідницький результат');
  const candidateOutput = (await page.locator('#result-ukrainian').innerText()).trim();
  assert.equal(candidateOutput, candidate, 'research option must show the candidate in the main Ukrainian field');
  assert.equal(await page.locator('#candidate-note').isVisible(), true,
    'candidate caution must appear inline with the selected research result');
  assert.equal(await page.locator('#ukrainian-copy-button').isVisible(), true,
    'copy action must copy the selected research result');
  assert.equal(await page.locator('#candidate-panel').count(), 0,
    'obsolete standalone candidate panel must not exist');
  assert.match(status, /Показано попередній кандидат, не підтверджений результат/u,
    'status note must disclose that the candidate is provisional');

  // Return to the unconfirmed option to ensure the accepted-result slot is neutral.
  await page.locator('#ua-unconfirmed-button').click();
  assert.equal((await page.locator('#result-ukrainian').innerText()).trim(), 'Немає підтвердженого запису');
  assert.equal(await page.locator('#ukrainian-copy-button').isVisible(), false);
  assert.ok(ipa.length > 100, 'long input should produce a substantial IPA result');
  assert.match(status, /g2pK JS/u, 'the live page must stay in the practical JavaScript-port mode');
  assert.deepEqual(pageErrors, [], 'the live page must not throw browser runtime errors');


  // The live region should communicate a useful result state/value, not only
  // a generic "processing complete" message.
  await page.waitForFunction(() => {
    const message = document.querySelector('#live-region')?.textContent || '';
    return message.includes('Обробку завершено') &&
      (message.includes('Достовірний варіант:') || message.includes('Дослідницький результат:') || message.includes('не підтверджено'));
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
  await page.locator('details.trace-panel.trace-disclosure').filter({ has: page.locator('#trace-list') }).locator('summary').click();
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

  console.log(`PASS live browser smoke: ${passage.length} Korean input characters; inline candidate ${candidate.length} chars; IPA ${ipa.length} chars; status=${status}`);
} finally {
  await browser.close();
}
