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

const BROAD_ALLOPHONE_MAP = new Map([
  ['ɭ', 'l'], ['ʎ', 'l'], ['ɲ', 'n'],
  ['ɦ', 'h'], ['ç', 'h'], ['x', 'h'], ['ɣ', 'h'], ['ɸ', 'h'], ['β', 'h'], ['ʝ', 'h']
]);

// Research-only sensitivity profile: compare the project's broad IPA against
// predictable Korean narrow allophones in UGTPHON-style phonetic gold.
// It deliberately preserves stop aspiration, fortisness, vowel length and
// unreleased codas; it does not replace the strict headline score.
export function normalizeIpaBroadCandidate(value) {
  const chars = [...String(value ?? '').normalize('NFC').replace(/g/gu, 'ɡ').replaceAll(TIE_BAR, '')];
  const normalized = [];
  for (let index = 0; index < chars.length; index += 1) {
    const char = chars[index];
    if (char === 'ˈ' || char === 'ˌ') continue;
    if (char === 'ɥ' && chars[index + 1] === 'i') {
      normalized.push('y');
      index += 1;
      continue;
    }
    if (['s', 'ɕ', 'ʃ'].includes(char) && chars[index + 1] === 'ʰ') {
      normalized.push(char);
      index += 1;
      continue;
    }
    if (char === 'ʷ' && normalized.at(-1) === 'h') continue;
    normalized.push(BROAD_ALLOPHONE_MAP.get(char) ?? char);
  }
  return normalized
    .filter(char => !/\s/u.test(char) && char !== '.' && !IGNORABLE_DIACRITICS.has(char))
    .join('')
    .normalize('NFC');
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
            id: row.id, token: canonical, status: pronunciationStatus,
            target_status: result.target_status ?? null, predicted: null
          });
          continue;
        }
        if (pronunciationStatus === 'partial') {
          partialTokens += 1;
          records.push({
            id: row.id, token: canonical, status: pronunciationStatus,
            target_status: result.target_status ?? null, predicted: null
          });
          continue;
        }
        if (pronunciationStatus === 'heuristic') {
          heuristicTokens += 1;
          records.push({
            id: row.id, token: canonical, status: pronunciationStatus,
            target_status: result.target_status ?? null, predicted: null
          });
          continue;
        }

        const predictedRaw = result.ipa;
        const predicted = normalizeIpa(predictedRaw);
        const distances = goldVariants.map(gold => ({ gold, distance: editDistance(predicted, gold) }));
        distances.sort((a, b) => a.distance - b.distance);
        const closest = distances[0];
        const broadPredicted = normalizeIpaBroadCandidate(predictedRaw);
        const broadGoldVariants = goldRaw.split(',').map(normalizeIpaBroadCandidate).filter(Boolean);
        const broadDistances = broadGoldVariants.map(gold => ({ gold, distance: editDistance(broadPredicted, gold) }));
        broadDistances.sort((a, b) => a.distance - b.distance);
        const broadClosest = broadDistances[0];
        records.push({
          id: row.id,
          token: canonical,
          gold: goldRaw,
          predicted: predictedRaw,
          normalized_predicted: predicted,
          closest_normalized_gold: closest.gold,
          distance: closest.distance,
          exact: closest.distance === 0,
          broad_candidate_predicted: broadPredicted,
          broad_candidate_gold: broadClosest?.gold ?? null,
          broad_candidate_distance: broadClosest?.distance ?? null,
          broad_candidate_exact: broadClosest?.distance === 0,
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
        records.push({ ...item, status: 'engine_error', predicted: null });
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
    broad_candidate_profile: 'Korean phonemic comparison sensitivity v1 (research-only; not adjudicated)',
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
      'The broad_candidate_* metrics are a research-only sensitivity analysis that collapses documented Korean allophones; the strict headline metrics remain unchanged.',
      'Broad candidate normalization collapses Korean /l/, /n/ and /h/ allophones and fricative aspiration, while preserving stop aspiration, fortisness, vowel length and unreleased codas.',
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
