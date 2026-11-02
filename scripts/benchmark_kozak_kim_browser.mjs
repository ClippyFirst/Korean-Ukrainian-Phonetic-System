#!/usr/bin/env node
/**
 * Direct diagnostic of the browser-side deterministic Kozak Kim engine.
 *
 * This is intentionally separate from the Python reference engine and the
 * ordinary g2pK service path. It scores IPA from token.canonical against the
 * UGTPHON token.phoneme field. Ukrainian target availability is reported but
 * never used to decide whether a resolved IPA can be scored.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createEngine } from '../src/app/engine.js';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const HANGUL_TOKEN = /^[\uac00-\ud7a3]+$/u;
const IGNORABLE_DIACRITICS = new Set(['\u031d', '\u0339', '\u031e', '\u0320']);
const TIE_BAR = '\u0361';

function readProjectFile(path) {
  return readFileSync(resolve(ROOT, path), 'utf8');
}

function mergeLexicalCsv(base, extra) {
  const baseLines = base.split(/\r?\n/u);
  const extraLines = extra.split(/\r?\n/u);
  return [
    baseLines[0],
    ...baseLines.slice(1).filter(line => line.trim()),
    ...extraLines.slice(1).filter(line => line.trim())
  ].join('\n');
}

export function createBrowserKozakKimEngine() {
  const canonical = readProjectFile('data/korean/canonical_correspondence.csv');
  const lexical = mergeLexicalCsv(
    readProjectFile('data/korean/lexical_pronunciations.csv'),
    readProjectFile('data/korean/lexical_additions_2026-10-15.csv')
  );
  return createEngine(canonical, lexical);
}

export function normalizeIpa(value) {
  return [...String(value ?? '').normalize('NFD').replace(/g/gu, 'ɡ').replaceAll(TIE_BAR, '')]
    .filter(char => !/\s/u.test(char) && char !== '.' && !IGNORABLE_DIACRITICS.has(char))
    .join('')
    .normalize('NFC');
}

const BROAD_CANDIDATE_PROFILE = JSON.parse(readProjectFile('data/korean/ipa/broad-candidate-normalization-v1.json'));
const BROAD_OPS = BROAD_CANDIDATE_PROFILE.operations;

// Shared with the Python multi-engine runner through the versioned JSON profile.
// The profile is intentionally research-only; it exposes every feature collapse
// and preserves s/ɕ/ʃ place distinctions rather than normalizing them away.
export function normalizeIpaBroadCandidateWithLoss(value) {
  let text = String(value ?? '').normalize('NFC');
  const featureLoss = {};
  const serialization = {};
  const add = (target, key, amount = 1) => { target[key] = (target[key] ?? 0) + amount; };

  if (text.includes('g')) {
    add(serialization, 'ascii_g_to_ipa_script_g', [...text].filter(char => char === 'g').length);
    text = text.replace(/g/gu, BROAD_OPS.canonicalize_g);
  }
  if (text.includes(BROAD_OPS.remove_tie_bar)) {
    add(serialization, 'affricate_tie_bar_removed', [...text].filter(char => char === BROAD_OPS.remove_tie_bar).length);
    text = text.replaceAll(BROAD_OPS.remove_tie_bar, '');
  }

  const chars = [...text];
  const normalized = [];
  const stressMarkers = new Set(BROAD_OPS.remove_stress_markers);
  const fricatives = new Set(BROAD_OPS.remove_fricative_aspiration.after);
  const ignoredDiacritics = new Set(BROAD_OPS.remove_diacritics);
  const separators = new Set(BROAD_OPS.remove_separators);

  for (let index = 0; index < chars.length; index += 1) {
    const char = chars[index];
    if (stressMarkers.has(char)) {
      add(featureLoss, 'lexical_stress');
      continue;
    }
    if (fricatives.has(char) && chars[index + 1] === BROAD_OPS.remove_fricative_aspiration.marker) {
      add(featureLoss, 'fricative_aspiration');
      normalized.push(char);
      index += 1;
      continue;
    }
    if (char === BROAD_OPS.remove_h_labialization.marker && normalized.at(-1) === BROAD_OPS.remove_h_labialization.base) {
      add(featureLoss, 'h_labialization');
      continue;
    }
    const mapping = BROAD_OPS.allophone_map[char];
    if (mapping) {
      add(featureLoss, mapping.loss);
      normalized.push(mapping.to);
    } else {
      normalized.push(char);
    }
  }

  const output = [];
  for (const char of normalized) {
    if (/\s/u.test(char) || separators.has(char)) {
      add(serialization, 'syllable_or_word_boundary_removed');
    } else if (ignoredDiacritics.has(char)) {
      add(featureLoss, 'selected_segmental_quality_diacritics');
    } else {
      output.push(char);
    }
  }

  return {
    normalized: output.join('').normalize('NFC'),
    feature_loss_counts: Object.fromEntries(Object.entries(featureLoss).sort(([a], [b]) => a.localeCompare(b))),
    serialization_normalization_counts: Object.fromEntries(Object.entries(serialization).sort(([a], [b]) => a.localeCompare(b)))
  };
}

export function normalizeIpaBroadCandidate(value) {
  return normalizeIpaBroadCandidateWithLoss(value).normalized;
}

export function editDistance(left, right) {
  const a = [...left];
  const b = [...right];
  if (a.length < b.length) return editDistance(right, left);
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      current.push(Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      ));
    }
    previous = current;
  }
  return previous[b.length];
}

export function evaluateRows(rows, engine) {
  const records = [];
  const unresolvedExamples = [];
  const errorExamples = [];
  let eligibleTokens = 0;
  let skippedNonHangul = 0;
  let skippedMissingGold = 0;
  let skippedEmptyGold = 0;
  let unresolvedTokens = 0;
  let partialTokens = 0;
  let heuristicTokens = 0;
  let targetUnavailableTokens = 0;
  let targetProvisionalTokens = 0;
  let engineErrors = 0;
  let profileMetadata = null;

  for (const row of rows) {
    for (const token of row.tokens ?? []) {
      const canonical = token.canonical;
      const goldRaw = token.phoneme;
      if (typeof canonical !== 'string' || !HANGUL_TOKEN.test(canonical)) {
        skippedNonHangul += 1;
        continue;
      }
      if (typeof goldRaw !== 'string' || !goldRaw.trim()) {
        skippedMissingGold += 1;
        continue;
      }
      const goldVariants = goldRaw.split(',').map(normalizeIpa).filter(Boolean);
      if (!goldVariants.length) {
        skippedEmptyGold += 1;
        continue;
      }
      eligibleTokens += 1;
      const occurrenceId = String(eligibleTokens - 1);
      try {
        const result = engine.convert(canonical, { morphologyMode: 'strict' });
        if (profileMetadata === null) {
          profileMetadata = {
            ipa_profile: result.ipa_profile ?? null,
            ipa_profile_status: result.ipa_profile_status ?? null,
            ipa_profile_version: result.ipa_profile_version ?? null
          };
        }
        if (result.target_status === 'unavailable') targetUnavailableTokens += 1;
        if (result.target_status === 'provisional' || result.candidate_status === 'provisional') {
          targetProvisionalTokens += 1;
        }
        const pronunciationStatus = result.pronunciation_status ?? (result.ipa ? 'resolved' : 'unresolved');
        if (pronunciationStatus === 'unresolved' || !result.ipa) {
          unresolvedTokens += 1;
          if (unresolvedExamples.length < 100) {
            unresolvedExamples.push({
              id: row.id,
              token: canonical,
              issues: (result.issues ?? []).join('; ')
            });
          }
          records.push({
            occurrence_id: occurrenceId,
            id: row.id, token: canonical, status: pronunciationStatus,
            surface_hangul: result.surfaceHangul ?? result.surface_hangul ?? null,
            target_status: result.target_status ?? null, predicted: null
          });
          continue;
        }
        if (pronunciationStatus === 'partial') {
          partialTokens += 1;
          records.push({
            occurrence_id: occurrenceId,
            id: row.id, token: canonical, status: pronunciationStatus,
            surface_hangul: result.surfaceHangul ?? result.surface_hangul ?? null,
            target_status: result.target_status ?? null, predicted: null
          });
          continue;
        }
        if (pronunciationStatus === 'heuristic') {
          heuristicTokens += 1;
          records.push({
            occurrence_id: occurrenceId,
            id: row.id, token: canonical, status: pronunciationStatus,
            surface_hangul: result.surfaceHangul ?? result.surface_hangul ?? null,
            target_status: result.target_status ?? null, predicted: null
          });
          continue;
        }

        const predictedRaw = result.ipa;
        const predicted = normalizeIpa(predictedRaw);
        const distances = goldVariants.map(gold => ({ gold, distance: editDistance(predicted, gold) }));
        distances.sort((a, b) => a.distance - b.distance);
        const closest = distances[0];
        const broadPredictionAudit = normalizeIpaBroadCandidateWithLoss(predictedRaw);
        const broadPredicted = broadPredictionAudit.normalized;
        const broadGoldAudits = goldRaw.split(',').map(normalizeIpaBroadCandidateWithLoss).filter(item => item.normalized);
        const broadDistances = broadGoldAudits.map(audit => ({
          gold: audit.normalized,
          distance: editDistance(broadPredicted, audit.normalized),
          audit
        }));
        broadDistances.sort((a, b) => a.distance - b.distance);
        const broadClosest = broadDistances[0];
        records.push({
          occurrence_id: occurrenceId,
          id: row.id,
          token: canonical,
          gold: goldRaw,
          predicted: predictedRaw,
          surface_hangul: result.surfaceHangul ?? result.surface_hangul ?? null,
          normalized_predicted: predicted,
          closest_normalized_gold: closest.gold,
          distance: closest.distance,
          exact: closest.distance === 0,
          broad_candidate_predicted: broadPredicted,
          broad_candidate_gold: broadClosest?.gold ?? null,
          broad_candidate_distance: broadClosest?.distance ?? null,
          broad_candidate_exact: broadClosest?.distance === 0,
          broad_candidate_prediction_feature_loss_counts: broadPredictionAudit.feature_loss_counts,
          broad_candidate_prediction_serialization_normalization_counts: broadPredictionAudit.serialization_normalization_counts,
          broad_candidate_gold_feature_loss_counts: broadClosest?.audit.feature_loss_counts ?? {},
          pronunciation_status: pronunciationStatus,
          target_status: result.target_status ?? null,
          overall_status: result.status ?? null
        });
      } catch (error) {
        engineErrors += 1;
        const item = {
          id: row.id, token: canonical,
          error: error instanceof Error ? error.name + ': ' + error.message : String(error)
        };
        if (errorExamples.length < 100) errorExamples.push(item);
        records.push({ ...item, occurrence_id: occurrenceId, status: 'engine_error', predicted: null, surface_hangul: null });
      }
    }
  }

  const comparable = records.filter(item => typeof item.distance === 'number');
  const exactMatches = comparable.filter(item => item.exact).length;
  const totalDistance = comparable.reduce((sum, item) => sum + item.distance, 0);
  const totalGoldCharacters = comparable.reduce((sum, item) => sum + [...item.closest_normalized_gold].length, 0);
  const scoredTokens = comparable.length;
  const broadComparable = records.filter(item => typeof item.broad_candidate_distance === 'number');
  const broadExactMatches = broadComparable.filter(item => item.broad_candidate_exact).length;
  const broadTotalDistance = broadComparable.reduce((sum, item) => sum + item.broad_candidate_distance, 0);
  const broadTotalGoldCharacters = broadComparable.reduce((sum, item) => sum + [...item.broad_candidate_gold].length, 0);
  const relativeError = item => item.distance / Math.max(
    [...item.normalized_predicted].length,
    [...item.closest_normalized_gold].length,
    1
  );

  return {
    benchmark: 'UGTPHON Korean canonical-token diagnostic',
    engine: 'Kozak Kim browser deterministic JavaScript engine',
    purpose: 'direct browser-engine IPA diagnostic; not normative acceptance or Ukrainian orthography validation',
    morphology_mode: 'strict',
    split: rows[0]?.split ?? null,
    ...(
      profileMetadata ?? {
        ipa_profile: null,
        ipa_profile_status: 'unavailable',
        ipa_profile_version: null
      }
    ),
    rows: rows.length,
    eligible_tokens: eligibleTokens,
    scored_tokens: scoredTokens,
    coverage_rate: eligibleTokens ? Number((scoredTokens / eligibleTokens).toFixed(6)) : null,
    exact_matches: exactMatches,
    exact_match_rate: scoredTokens ? Number((exactMatches / scoredTokens).toFixed(6)) : null,
    coverage_adjusted_exact_match_rate: eligibleTokens ? Number((exactMatches / eligibleTokens).toFixed(6)) : null,
    character_error_rate: totalGoldCharacters ? Number((totalDistance / totalGoldCharacters).toFixed(6)) : null,
    broad_candidate_benchmark_version: 'broad-candidate-ipa-v2',
    broad_candidate_profile: BROAD_CANDIDATE_PROFILE,
    broad_candidate_prediction_feature_loss_counts: Object.fromEntries(
      [...records.filter(item => item.broad_candidate_prediction_feature_loss_counts)
        .flatMap(item => Object.entries(item.broad_candidate_prediction_feature_loss_counts))
        .reduce((counts, [key, value]) => counts.set(key, (counts.get(key) ?? 0) + value), new Map()).entries()]
        .sort(([a], [b]) => a.localeCompare(b))
    ),
    broad_candidate_reference_feature_loss_counts: Object.fromEntries(
      [...records.filter(item => item.broad_candidate_gold_feature_loss_counts)
        .flatMap(item => Object.entries(item.broad_candidate_gold_feature_loss_counts))
        .reduce((counts, [key, value]) => counts.set(key, (counts.get(key) ?? 0) + value), new Map()).entries()]
        .sort(([a], [b]) => a.localeCompare(b))
    ),
    broad_candidate_scored_tokens: broadComparable.length,
    broad_candidate_exact_matches: broadExactMatches,
    broad_candidate_exact_match_rate: broadComparable.length ? Number((broadExactMatches / broadComparable.length).toFixed(6)) : null,
    broad_candidate_character_error_rate: broadTotalGoldCharacters ? Number((broadTotalDistance / broadTotalGoldCharacters).toFixed(6)) : null,
    broad_candidate_coverage_adjusted_exact_match_rate: eligibleTokens ? Number((broadExactMatches / eligibleTokens).toFixed(6)) : null,
    unresolved_tokens: unresolvedTokens,
    partial_tokens: partialTokens,
    heuristic_tokens: heuristicTokens,
    target_unavailable_tokens: targetUnavailableTokens,
    target_provisional_tokens: targetProvisionalTokens,
    skipped_non_hangul_or_multitoken: skippedNonHangul,
    skipped_missing_gold: skippedMissingGold,
    skipped_empty_gold: skippedEmptyGold,
    engine_errors: engineErrors,
    unresolved_examples: unresolvedExamples,
    engine_error_examples: errorExamples,
    worst_mismatches: comparable.filter(item => !item.exact)
      .sort((a, b) => relativeError(b) - relativeError(a) || b.distance - a.distance || a.token.localeCompare(b.token))
      .slice(0, 50),
    records,
    notes: [
      'Predictions use token.canonical and are scored against token.phoneme; raw token.text normalization is a separate diagnostic.',
      'This script imports src/app/engine.js and exercises the browser-side Kozak Kim engine, not the ordinary g2pK adapter or Python reference engine.',
      'IPA is scored whenever pronunciation_status is resolved, even if the Ukrainian target adapter reports unavailable; target status is reported separately.',
      'The browser IPA profile is marked unadjudicated-cross-runtime. A high benchmark score does not establish normative IPA correctness.',
      'The broad_candidate_* metrics use the shared versioned korean-broad-candidate-sensitivity-v1 profile; they are research-only and do not replace strict headline metrics.',
      'The report exposes prediction and selected-reference feature-loss counts. The profile collapses lateral place/retroflexion, palatal nasality, several h-like realizations, fricative aspiration, stress and selected quality diacritics.',
      'Stop aspiration, fortisness, vowel length, unreleased codas and the s/ɕ/ʃ place distinctions are retained. Sibilant-profile disagreements therefore remain visible and require independent adjudication.',
      'The UGTPHON test split has been inspected during project research; treat this run as diagnostic, not as an untouched independent holdout.',
      'Only resolved pronunciation records are scored. Partial, heuristic, unresolved, and engine-error records are counted separately.'
    ]
  };
}

function loadCorpus(path, expectedSplit) {
  const rows = JSON.parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(rows)) throw new TypeError('UGTPHON corpus root must be a JSON array');
  const seen = new Set();
  for (const [index, row] of rows.entries()) {
    if (!row || typeof row !== 'object' || !Array.isArray(row.tokens)) {
      throw new TypeError('UGTPHON row ' + index + ' must be an object with a tokens array');
    }
    if (row.lang !== 'ko' || row.split !== expectedSplit) {
      throw new Error('UGTPHON row ' + index + ' is not from Korean ' + expectedSplit);
    }
    if (seen.has(row.id)) throw new Error('duplicate UGTPHON row id: ' + row.id);
    seen.add(row.id);
  }
  return rows;
}

function main() {
  const args = process.argv.slice(2);
  const value = name => {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : null;
  };
  const corpusPath = value('--corpus');
  const split = value('--split') ?? 'test';
  const outputPath = value('--output');
  if (!corpusPath) {
    process.stderr.write('Usage: node scripts/benchmark_kozak_kim_browser.mjs --corpus ko-test.json [--split test] [--output report.json]\n');
    process.exitCode = 2;
    return;
  }
  try {
    const rows = loadCorpus(corpusPath, split);
    const report = evaluateRows(rows, createBrowserKozakKimEngine());
    const rendered = JSON.stringify(report, null, 2) + '\n';
    if (outputPath) {
      writeFileSync(outputPath, rendered, 'utf8');
      const summary = Object.fromEntries([
        'engine', 'split', 'ipa_profile', 'ipa_profile_status', 'eligible_tokens',
        'scored_tokens', 'coverage_rate', 'exact_matches', 'exact_match_rate',
        'coverage_adjusted_exact_match_rate', 'character_error_rate',
        'unresolved_tokens', 'partial_tokens', 'heuristic_tokens',
        'target_unavailable_tokens', 'target_provisional_tokens', 'engine_errors'
      ].map(key => [key, report[key]]));
      process.stdout.write(JSON.stringify(summary, null, 2) + '\n');
    } else {
      process.stdout.write(rendered);
    }
  } catch (error) {
    process.stderr.write('Kozak Kim browser benchmark failed: ' +
      (error instanceof Error ? error.name + ': ' + error.message : String(error)) + '\n');
    process.exitCode = 2;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
