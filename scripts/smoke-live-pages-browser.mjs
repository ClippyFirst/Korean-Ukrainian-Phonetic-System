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

  // Both Ukrainian routes must remain visible together. Selecting RR as the
  // primary result must not hide the IPA-mediated alternative or either trace.
  const rrAlternative = (await page.locator('#alternate-ukrainian-output').innerText()).trim();
  assert.ok(rrAlternative.length > 0, 'the RR-mediated Ukrainian transliteration must be visible beside the IPA result');
  assert.equal((await page.locator('#alternate-ukrainian-label').innerText()).trim(), 'Українська транслітерація через RR');
  assert.equal(await page.locator('#ipa-trace-panel').evaluate(element => element.hidden), false);
  assert.equal(await page.locator('#rr-trace-panel').evaluate(element => element.hidden), false);
  await page.locator('#mode-romanization').check();
  await page.waitForFunction(() =>
    document.querySelector('#ukrainian-output-label')?.textContent?.trim() === 'Транслітерація за RR' &&
    document.querySelector('#alternate-ukrainian-label')?.textContent?.trim() === 'Українська транслітерація через IPA'
  );
  assert.ok((await page.locator('#result-ukrainian').innerText()).trim().length > 0,
    'RR-primary Ukrainian output must be populated');
  assert.ok((await page.locator('#alternate-ukrainian-output').innerText()).trim().length > 0,
    'IPA-mediated Ukrainian output must remain populated when RR is primary');
  await page.locator('#mode-practical').check();

  // Verify the deployed research-only Super-soft path itself, not just the
  // source-level unit test: every Hangul syllable in this mixed input must
  // have IPA and a Ukrainian candidate, with explicit coverage/confidence UI.
  await page.locator('#mode-research').check();
  await page.locator('#super-soft-morphology').check();
  const superSoftInput = '짧은소리의 베갯잇 ㄱ 123 🙂';
  await page.locator('#source-input').fill(superSoftInput);
  await page.waitForFunction(() => {
    const status = document.querySelector('#status-note')?.textContent || '';
    const candidate = document.querySelector('#candidate-value')?.textContent?.trim() || '';
    const ipa = document.querySelector('#result-ipa')?.textContent?.trim() || '';
    return status.includes('покриття складів Hangul: 100%') &&
      status.includes('облік фрагментів: 100%') && candidate.length > 0 && ipa.length > 0;
  }, null, { timeout: 20000 });
  const superSoftStatus = (await page.locator('#status-note').innerText()).trim();
  const superSoftCandidate = (await page.locator('#candidate-value').innerText()).trim();
  assert.ok(superSoftCandidate.length > 0, 'live Super-soft must expose a Ukrainian candidate');
  assert.match(superSoftStatus, /Суперм’який режим/u, 'live status must identify Super-soft');
  assert.match(superSoftStatus, /низької впевненості/u, 'live status must disclose low-confidence fallback');
  assert.match(superSoftStatus, /низька впевненість: \d+% \(\d+\/\d+\)/u, 'live status must quantify the low-confidence share and its Hangul denominator');
  await page.locator('#ua-candidate-button').click();
  const annotatedSuperSoftCandidate = (await page.locator('#result-ukrainian').innerText()).trim();
  assert.match(annotatedSuperSoftCandidate, /\[[^\]]+\]/u,
    'live Super-soft candidate must bracket at least one low-confidence target span');
  assert.match(await page.locator('#candidate-note').innerText(), /квадратних дужках \[фрагмент\]/u,
    'live Super-soft candidate note must explain square-bracket uncertainty notation');
  await page.locator('#ua-unconfirmed-button').click();
  const superSoftIpa = (await page.locator('#result-ipa').innerText()).trim();
  assert.ok(superSoftIpa.length > 0);
  assert.doesNotMatch(superSoftIpa, /[가-힣ㄱ-ㅎㅏ-ㅣ]/u, 'live IPA must not leak Hangul/Jamo');
  await page.locator('#mode-practical').check();

  // The Hanja data chunk must be loaded from the same-origin static build,
  // then produce a deterministic mixed-script result without an external API.
  const hanjaInput = '정부는 경제 발전을 연구한다.';
  await page.locator('#source-input').fill(hanjaInput);
  await page.waitForFunction(() => {
    const status = document.querySelector('#hanja-engine-status')?.textContent?.trim() || '';
    const output = document.querySelector('#result-hanja')?.textContent?.trim() || '';
    return status.startsWith('Локальний словник:') && output.includes('政府') && output.includes('經濟');
  }, null, { timeout: 45000 });
  const hanjaOutput = (await page.locator('#result-hanja').innerText()).trim();
  assert.equal(hanjaOutput, '政府는 經濟 發展을 硏究한다.',
    'the deployed deterministic dictionary must convert known Sino-Korean words and preserve Korean particles/endings');

  // Reverse Hanja lookup is a standalone input path and must remain available
  // while the main Hangul results are empty. Ambiguity/unknowns must not be
  // silently transferred into the pronunciation engine.
  await page.locator('#source-input').fill('');
  await page.locator('.hanja-reverse-details summary').click();
  await page.locator('#hanja-input').fill('政府는 經濟 발전을 연구한다.');
  await page.waitForFunction(() =>
    document.querySelector('#hanja-reading-output')?.value?.trim() === '정부는 경제 발전을 연구한다.' &&
    (document.querySelector('#hanja-reading-status')?.textContent || '').includes('Однозначне словникове читання'),
  null, { timeout: 45000 });
  assert.equal(await page.locator('#hanja-use-reading').isEnabled(), true,
    'a unique reverse dictionary reading may be transferred without manual correction');
  await page.locator('#hanja-use-reading').click();
  await page.waitForFunction(() =>
    document.querySelector('#source-input')?.value === '정부는 경제 발전을 연구한다.' &&
    (document.querySelector('#result-ipa')?.textContent?.trim() || '').length > 0,
  null, { timeout: 20000 });
  assert.equal((await page.locator('#source-input').inputValue()).trim(), '정부는 경제 발전을 연구한다.',
    'the reviewed Hangul reading must be handed off to the main pronunciation pipeline');

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
  assert.match(status, /g2pK ·/u, 'the live page must stay in the practical JavaScript-port mode');
  assert.deepEqual(pageErrors, [], 'the live page must not throw browser runtime errors');


  // The live region should communicate a useful result state/value, not only
  // a generic "processing complete" message.
  await page.waitForFunction(() => {
    const message = document.querySelector('#live-region')?.textContent || '';
    return message.includes('Обробку завершено') &&
      (message.includes('Достовірний варіант:') || message.includes('Дослідницький результат:') || message.includes('не підтверджено'));
  }, null, { timeout: 5000 });

  // Keep the home page explanation concise; detailed engine provenance belongs
  // to the researcher-facing methodology page.
  const modeDisclosure = page.locator('.mode-disclosure').filter({ hasText: 'Як працює звичайний режим' });
  assert.equal(await modeDisclosure.count(), 1, 'ordinary-mode disclosure must be selected unambiguously');
  assert.equal(await modeDisclosure.isVisible(), true, 'mode explanation must be available on demand');
  await modeDisclosure.locator('summary').click();
  assert.match(await modeDisclosure.innerText(), /Докладніше про рушій, джерела й обмеження/u,
    'home-page caveat must direct interested users to the methodology');

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
  assert.match(await page.locator('body').innerText(), /JavaScript-порту g2pK/u,
    'technical engine provenance must remain available on the researcher-facing methodology page');
  const toc = page.locator('.methodology-toc');
  assert.equal(await toc.isVisible(), true, 'methodology contents must be visible');
  await toc.locator('a[href="#methodology-00a"]').click();
  await page.waitForFunction(() => location.hash === '#methodology-00a');
  assert.ok(await page.locator('#methodology-00a').isVisible(),
    'methodology contents links must navigate to real section anchors');
  assert.deepEqual(pageErrors, [], 'UX smoke must not introduce browser runtime errors');

  console.log('PASS live UX smoke: deterministic Hanja dictionary chunk and output; live result announcement; mode disclosure; clipboard-denial fallback; mobile trace labels at 390px; methodology navigation');

  console.log(`PASS live browser smoke: ${passage.length} Korean input characters; inline candidate ${candidate.length} chars; IPA ${ipa.length} chars; status=${status}`);
} finally {
  await browser.close();
}
