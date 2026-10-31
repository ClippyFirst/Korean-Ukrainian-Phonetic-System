import correspondenceCsv from '../../data/korean/rr_ukrainian_correspondence.csv?raw';
import { romanizeRevisedDetailed } from './romanization.js';

function loadCorrespondences(csv) {
  const rows = csv.trim().split(/\r?\n/u).slice(1);
  const map = new Map();
  for (const row of rows) {
    const [layer, hangul, rr, ukrainian, scope, status, notes] = row.split(',');
    map.set(layer + ':' + rr, { layer, hangul, rr, ukrainian, scope, status, notes });
  }
  return map;
}

const CORRESPONDENCES = loadCorrespondences(correspondenceCsv);

/** RR-mediated Ukrainian output; distinct from the IPA-first Kozak Kim target adapter. */
export function transcribeRevisedToUkrainian(surface) {
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
      const mapping = CORRESPONDENCES.get(layer + ':' + rr);
      if (!mapping) {
        issues.push({ source: segment.source, layer, rr, reason: 'unmapped-rr-unit' });
        continue;
      }
      syllableOutput += mapping.ukrainian;
      trace.push({ source: segment.source, layer, rr, ukrainian: mapping.ukrainian,
        mapping_id: mapping.hangul + ':' + layer, status: mapping.status, notes: mapping.notes });
    }
    text += syllableOutput;
  }
  return { text: issues.length ? null : text, romanization: romanized.text,
    status: issues.length ? 'unavailable' : 'provisional', issues, trace };
}
