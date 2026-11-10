import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const system = readFileSync(new URL('../system.html', import.meta.url), 'utf8');
const evidenceRegister = readFileSync(new URL('../docs/METHODOLOGY-CLAIMS-AND-EVIDENCE-REGISTER-2026-10-30.md', import.meta.url), 'utf8');
const debateReview = readFileSync(new URL('../docs/METHODOLOGY-DEBATE-REVIEW-2026-10-30.md', import.meta.url), 'utf8');
const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const engine = readFileSync(new URL('../src/app/engine.js', import.meta.url), 'utf8');
const soft = readFileSync(new URL('../src/app/soft_morphology.js', import.meta.url), 'utf8');
const g2pk = readFileSync(new URL('../src/app/g2pk_web.js', import.meta.url), 'utf8');

test('ordinary and detailed modes disclose the two actual browser engines', () => {
  assert.match(index, /Звичайний режим/u);
  assert.match(index, /Режим докладного аналізу/u);
  assert.match(index, /На відміну від звичайного режиму на g2pK/u, 'the visible service copy must explicitly distinguish the two engines');
  assert.match(index, /детермінованим рушієм Козака Кіма/u);
  assert.match(index, /href="\.\/system\.html#methodology-02c-kozak-kim"/u);
  assert.match(main, /const useG2p=!\(modeResearch&&modeResearch\.checked\)/u);
  assert.match(main, /useG2p\?webEngine\.convert\(value\):engine\.convert\(value,\{morphologyMode\}\)/u);
  assert.match(main, /useG2p\?'g2pK · ':'Козак Кім · '/u);
  assert.match(g2pk, /vendored JavaScript port of g2pK/u);
});

test('methodology documents all three native modes and their real constraints', () => {
  for (const term of ['Строгий режим','М’який режим','Суперм’який режим','R002','R003','R007','orthographic-phonemic','11&nbsp;172','квадратних дужках','Apache-2.0','G2pBrowser','descriptive: false','engine_rules_ctx.js','engine_rules_phrase.js']) {
    assert.ok(system.includes(term), 'methodology must document ' + term);
  }
  assert.match(engine, /morphologyMode==='super-soft'/u);
  assert.match(soft, /soft never resolves substantive/u);
  assert.match(soft, /belongs to public Soft and remains lower-confidence than Strict/u);
});

test('methodology reports the current three-mode benchmark, CI evidence, and evidence limits', () => {
  for (const term of [
    '1 438 / 1 438',
    '42885341194','42885341473','42885341205','42885341317','42885341249',
    '42858765799',
    'UGTPHON','SIGMORPHON','K-SPAN Modern','K-SPAN Conservative','IPA-Dict',
    'Strict 52,72%','Soft 46,54%','Strict 35,84%','Soft 33,73%',
    'Strict 10,80%','Soft 9,60%','Strict 7,50%','Soft 5,80%',
    'Strict 41,10%','Soft 37,60%',
    'Super-soft: 100%',
    '2,03%','1,50%','0,40%','0,30%',
    'не встановлюють універсального переможця',
    'не доводить лінгвістичну правильність',
    'METHODOLOGY-CLAIMS-AND-EVIDENCE-REGISTER-2026-10-30.md',
    'METHODOLOGY-DEBATE-REVIEW-2026-10-30.md'
  ]) {
    assert.ok(system.includes(term), 'methodology must include ' + term);
  }
});

test('methodology evidence register and debate review preserve current evidence boundaries', () => {
  for (const term of [
    'M-05','1,430/2,698 scored','1,435/2,703','357/998 scored','353/999','53.0022%','53.0892%','35.7715%','35.3353%',
    'McNemar exact two-sided p=0.125','13019822857',
    'M-13','M-14','M-15','DONE_VERIFIED','BLOCKED / EVIDENCE-LIMITED',
    'CharsiuG2P','weights','NIKL metadata-only inventory'
  ]) {
    assert.ok(evidenceRegister.includes(term), 'evidence register must include ' + term);
  }
  for (const term of [
    'не незалежне людське рецензування',
    'mattpocock/skills','DietrichGebert/ponytail',
    'McNemar exact two-sided p=0.125','58.79×',
    'Charsiu inference було SKIPPED','Issue #337'
  ]) {
    assert.ok(debateReview.includes(term), 'debate review must include ' + term);
  }
});

test('RR and Hanja are described as parallel outputs, not pronunciation inputs', () => {
  assert.match(system, /Ханча \(漢字\) — словникова анотація/u);
  assert.match(system, /184 079 словникових читань у 19 групах/u);
  assert.match(system, /RR не є входом IPA чи українського адаптера/u);
});


test('all three Kozak Kim modes have separate documented benchmark contracts and honest statuses', () => {
  const methodology = readFileSync(new URL('../docs/methodology.md', import.meta.url), 'utf8');
  const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
  const gates = readFileSync(new URL('../research/ACCEPTANCE-GATES.md', import.meta.url), 'utf8');

  for (const term of [
    'Mode-specific benchmark contract',
    '**Strict**',
    '**Soft**',
    '**Super-soft**',
    'RERUN_REQUIRED',
    'SOFTWARE_COVERAGE_VERIFIED; ACCURACY_UNMEASURED',
    'grapheme-only underlying IPA fallback',
    'same input occurrences',
    '236-candidate'
  ]) {
    assert.ok(methodology.includes(term), 'methodology must include ' + term);
  }
  for (const term of ['Strict', 'Soft', 'Super-soft', 'RERUN_REQUIRED', 'ACCURACY_UNMEASURED', 'historical']) {
    assert.ok(readme.includes(term), 'README must distinguish ' + term);
  }
  for (const term of ['Strict | DONE_VERIFIED', 'Soft | PARTIAL', 'Super-soft | PARTIAL', 'unified three-mode 236-case evaluation = TODO']) {
    assert.ok(gates.includes(term), 'acceptance gates must include ' + term);
  }
});


test('long-term gated corpus portfolio and executable five-dataset matrix stay distinct', () => {
  const portfolio = readFileSync(new URL('../docs/KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md', import.meta.url), 'utf8');
  const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
  for (const dataset of [
    'UGTPHON Korean test',
    'SIGMORPHON 2021 Korean public paired lexical file',
    'Seoul Corpus (OpenSLR SLR113)',
    'KsponSpeech',
    'NIKL Daily Conversation Speech Corpus 2022'
  ]) {
    assert.ok(portfolio.includes(dataset), 'benchmark register must include ' + dataset);
  }
  assert.match(portfolio, /CC BY-NC 2\.0/u);
  assert.match(portfolio, /AIHub account\/manual download/u);
  assert.match(portfolio, /LDC User Agreement/u);
  assert.match(portfolio, /Long-term five-corpus execution policy/u);
  assert.match(portfolio, /executable five-dataset Korean G2P matrix/u);
  for (const dataset of ['K-SPAN 2.1', 'IPA-Dict Korean']) {
    assert.ok(portfolio.includes(dataset), 'executable matrix must include ' + dataset);
  }
  assert.match(portfolio, /five distinct datasets and seven reference tracks/u);
  assert.match(portfolio, /972cd67dd5f96bc5660e28070cde26e3928abcd7/u);
  assert.match(readme, /Long-term five-corpus acquisition portfolio/u);
  assert.match(readme, /five datasets and seven reference tracks/u);
  assert.match(readme, /KsponSpeech and NIKL Daily Conversation remain separate access\/terms-gated future candidates/u);
});
