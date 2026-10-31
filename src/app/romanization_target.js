import { romanizeRevisedDetailed } from './romanization.js';

function parseCsvLine(line) {
  const values = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      values.push(value);
      value = '';
    } else {
      value += char;
    }
  }
  if (quoted) throw new Error('Unclosed quoted field in RR correspondence CSV');
  values.push(value);
  return values;
}

function parseCsv(csv) {
  const lines = String(csv ?? '').replace(/^\uFEFF/u, '').trim().split(/\r?\n/u);
  const headerLine = lines.shift();
  if (!headerLine) return [];
  const headers = parseCsvLine(headerLine);
  return lines.filter((line) => line.trim()).map((line, rowIndex) => {
    const values = parseCsvLine(line);
    if (values.length !== headers.length) {
      throw new Error('RR correspondence CSV row ' + (rowIndex + 2) + ' has ' + values.length + ' fields; expected ' + headers.length);
    }
    return Object.fromEntries(headers.map((header, index) => [header, values[index]]));
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
  const rules = parseCsv(csv);
  const ids = new Set();
  for (const rule of rules) {
    if (!rule.rule_id || ids.has(rule.rule_id)) throw new Error('Duplicate or missing RR context rule ID: ' + rule.rule_id);
    ids.add(rule.rule_id);
  }
  const specificity = (rule) => ['word_position', 'left_context', 'sentence_position', 'onset_context']
    .filter((field) => rule[field] && rule[field] !== '*').length;
  return rules.sort((a, b) => specificity(b) - specificity(a) || a.rule_id.localeCompare(b.rule_id));
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
  return function transcribeRevisedToUkrainian(surface, original = surface) {
    const romanized = romanizeRevisedDetailed(surface, original);
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
          collisionGroup: mapping.collision_group || null,
          alternativeUkrainian: mapping.alternative_ukrainian || null,
          phonologicalFeature: contextRule?.feature ?? null,
          wordIndex: segment.wordIndex,
          sentenceWordIndex: segment.sentenceWordIndex,
          sentenceIndex: segment.sentenceIndex,
          syllableIndex: segment.syllableIndex,
          wordLength: segment.wordLength,
          wordPosition: segment.wordPosition,
          sentencePosition: segment.sentencePosition,
          leftContext: segment.leftContext,
          rightContext: segment.rightContext,
          onsetClass: segment.onsetClass,
          onsetContext: segment.onsetContext,
          onsetOrigin: segment.onsetOrigin,
          alignmentStatus: segment.alignmentStatus
        });
      }
      text += syllableOutput;
    }

    return {
      text: issues.length ? null : text,
      romanization: romanized.text,
      sourceOrthography: String(original ?? ''),
      status: issues.length ? 'unavailable' : 'provisional',
      issues,
      trace,
      syllables: romanized.segments.filter((segment) => segment.type === 'syllable')
    };
  };
}
