import { romanizeRevisedDetailed } from './romanization.js';

function parseCsv(csv) {
  const [headerLine, ...lines] = String(csv ?? '').trim().split(/\r?\n/u);
  if (!headerLine) return [];
  const headers = headerLine.split(',');
  return lines.filter((line) => line.trim()).map((line) => {
    const values = line.split(',');
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
}

function loadCorrespondences(csv) {
  const map = new Map();
  for (const row of parseCsv(csv)) {
    map.set(row.layer + ':' + row.rr, row);
  }
  return map;
}

function loadContextRules(csv) {
  return parseCsv(csv).sort((a, b) => a.rule_id.localeCompare(b.rule_id));
}

function matchesRule(rule, segment, layer, rr) {
  const hangul = layer === 'onset'
    ? segment.onsetHangul
    : layer === 'vowel'
      ? segment.vowelHangul
      : segment.codaHangul;
  return rule.layer === layer
    && rule.hangul === hangul
    && rule.rr === rr
    && (rule.word_position === '*' || rule.word_position === segment.wordPosition)
    && (rule.left_context === '*' || rule.left_context === segment.leftContext)
    && (rule.sentence_position === '*' || rule.sentence_position === segment.sentencePosition)
    && (rule.onset_context === '*' || rule.onset_context === segment.onsetContext);
}

function selectContextRule(rules, segment, layer, rr) {
  return rules.find((rule) => matchesRule(rule, segment, layer, rr)) ?? null;
}

/** Create a reusable RR-mediated target adapter from canonical CSV sources. */
export function createRomanizationTarget(correspondenceCsv, contextRulesCsv = '') {
  const correspondences = loadCorrespondences(correspondenceCsv);
  const contextRules = loadContextRules(contextRulesCsv);

  /** RR-mediated Ukrainian output; separate from the IPA-first Kozak Kim adapter. */
  return function transcribeRevisedToUkrainian(surface) {
    const romanized = romanizeRevisedDetailed(surface);
    const trace = [];
    const issues = [];
    let text = '';

    for (const segment of romanized.segments) {
      if (segment.type === 'literal') {
        text += segment.text;
        trace.push({ ...segment, ukrainian: segment.text, status: 'literal-preserved' });
        continue;
      }

      let syllableOutput = '';
      for (const [layer, rr] of [['onset', segment.onset], ['vowel', segment.vowel], ['coda', segment.coda]]) {
        if (!rr) continue;
        const contextRule = selectContextRule(contextRules, segment, layer, rr);
        const mapping = contextRule ?? correspondences.get(layer + ':' + rr);
        if (!mapping) {
          issues.push({ source: segment.source, layer, rr, reason: 'unmapped-rr-unit',
            wordPosition: segment.wordPosition, leftContext: segment.leftContext });
          continue;
        }
        syllableOutput += mapping.ukrainian;
        trace.push({
          source: segment.source,
          layer,
          rr,
          ukrainian: mapping.ukrainian,
          mapping_id: contextRule ? contextRule.rule_id : mapping.hangul + ':' + layer,
          status: mapping.status,
          notes: mapping.notes,
          alternativeUkrainian: mapping.alternative_ukrainian || null,
          phonologicalFeature: contextRule?.feature ?? null,
          wordIndex: segment.wordIndex,
          sentenceIndex: segment.sentenceIndex,
          syllableIndex: segment.syllableIndex,
          wordLength: segment.wordLength,
          wordPosition: segment.wordPosition,
          sentencePosition: segment.sentencePosition,
          leftContext: segment.leftContext,
          rightContext: segment.rightContext,
          onsetClass: segment.onsetClass,
          onsetContext: segment.onsetContext
        });
      }
      text += syllableOutput;
    }

    return {
      text: issues.length ? null : text,
      romanization: romanized.text,
      status: issues.length ? 'unavailable' : 'provisional',
      issues,
      trace,
      syllables: romanized.segments.filter((segment) => segment.type === 'syllable')
    };
  };
}
