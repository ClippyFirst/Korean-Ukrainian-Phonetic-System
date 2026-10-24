import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const queue = JSON.parse(readFileSync(new URL('../research/r002-r003-source-adjudication-2026-10-24.json', import.meta.url), 'utf8'));

test('R002/R003 triage queue contains the intended 14 distinct source-review cases without claiming gold IPA', () => {
  assert.equal(queue.schemaVersion, 1);
  assert.equal(queue.cases.length, 14);
  assert.equal(queue.cases.filter((item) => item.ruleId === 'R002').length, 7);
  assert.equal(queue.cases.filter((item) => item.ruleId === 'R003').length, 7);
  assert.match(queue.purpose, /none is normative IPA gold/u);
  assert.match(queue.purpose, /not a holdout score set/u);
  assert.equal(queue.benchmark.workflowRun, 40092929978);
  assert.equal(queue.benchmark.artifactId, 12559692692);

  const ids = new Set();
  const inputs = new Set();
  for (const item of queue.cases) {
    assert.ok(item.caseId && !ids.has(item.caseId), item.caseId + ': case IDs must be unique');
    assert.ok(item.input && !inputs.has(item.input), item.input + ': inputs must be unique');
    ids.add(item.caseId);
    inputs.add(item.input);

    assert.ok(['R002', 'R003'].includes(item.ruleId), item.input + ': only in-scope rules are allowed');
    assert.ok(item.rowId, item.input + ': source dataset row ID must be retained');
    assert.ok(item.pair, item.input + ': unresolved morphophonological span must be retained');
    assert.ok(item.goldDiagnostic, item.input + ': preserve the diagnostic reference for triage only');
    assert.ok(item.g2pkIpa, item.input + ': preserve comparison output for triage only');
    assert.ok(['PENDING_EXACT_FORM_SOURCE', 'SOURCE_FOUND_PENDING_IPA'].includes(item.sourceStatus), item.input);
    if (item.sourceStatus === 'PENDING_EXACT_FORM_SOURCE') {
      assert.equal(item.sourceLocator, null, item.input + ': do not imply exact-form source review happened');
      assert.equal(item.sourceExcerpt, null, item.input + ': do not invent source excerpts');
    } else {
      assert.match(item.sourceLocator, /^https:\/\//u, item.input + ': exact official source URL required');
      assert.ok(item.sourceExcerpt, item.input + ': source excerpt required');
      assert.equal(item.sourceAccessed, '2026-10-24', item.input + ': access date required');
      assert.match(item.sourceType, /official/u, item.input + ': source type must be recorded');
    }
    assert.equal(item.grammaticalSegmentation, null, item.input + ': do not guess morphology');
    assert.equal(item.finalBroadIpa, null, item.input + ': no independent IPA gold exists yet');
    if (item.relatedSourceEvidence) {
      assert.ok(item.relatedSourceEvidence.length > 0, item.input + ': related source evidence must be an array');
      for (const source of item.relatedSourceEvidence) {
        assert.match(source.url, /^https:\/\//u, item.input + ': related source URL required');
        assert.ok(source.excerpt, item.input + ': related source excerpt required');
        assert.match(source.scope, /Related lexical-form evidence only/u, item.input + ': related source must not be treated as exact-form adjudication');
      }
    }
    assert.equal(item.reviewerA.ipa, null, item.input + ': reviewer A has not adjudicated');
    assert.equal(item.reviewerB.ipa, null, item.input + ': reviewer B has not adjudicated');
    assert.equal(item.ukrainianTargetStatus, 'SEPARATE_UNREVIEWED_TASK', item.input);
    assert.match(queue.ruleSources[item.ruleId].url, /^https:\/\//u);
    assert.ok(queue.ruleSources[item.ruleId].locator, item.input + ': rule-family locator required');
  }
});

test('R002/R003 queue explicitly prevents corpus references and engine agreement from becoming normative evidence', () => {
  assert.ok(queue.acceptanceCriteria.some((item) => /corpus IPA and every engine output as hypotheses/u.test(item)));
  assert.ok(queue.acceptanceCriteria.some((item) => /exact official source passage/u.test(item)));
  assert.ok(queue.cases.some((item) => item.sourceStatus === 'SOURCE_FOUND_PENDING_IPA'));
  for (const item of queue.cases.filter((item) => item.sourceStatus === 'SOURCE_FOUND_PENDING_IPA')) {
    assert.equal(item.finalBroadIpa, null, item.input + ': source evidence must not be misrepresented as IPA gold');
    assert.equal(item.reviewerA.ipa, null, item.input + ': independent review still required');
    assert.equal(item.reviewerB.ipa, null, item.input + ': independent review still required');
  }
  assert.ok(queue.acceptanceCriteria.some((item) => /two independent broad-IPA reviews/u.test(item)));
  assert.ok(queue.acceptanceCriteria.some((item) => /frozen NIKL holdout/u.test(item)));
  assert.ok(queue.acceptanceCriteria.some((item) => /Review Ukrainian rendering separately/u.test(item)));
});
