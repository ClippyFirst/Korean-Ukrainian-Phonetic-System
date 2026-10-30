/**
 * Render the opt-in Super-soft Ukrainian candidate with explicit uncertainty.
 *
 * Trace units are already aligned with IPA-derived target segments. Brackets
 * annotate only the target segment whose phonology or target mapping is
 * provisional; they are not pronunciation alternatives or IPA notation.
 */
const LOW_CONFIDENCE_STATUSES = new Set([
  'super-soft-orthographic-fallback',
  'super-soft-practical-heuristic',
  'super-soft-morphology-heuristic',
  'lexical-review'
]);

export function renderSuperSoftCandidate(trace, fallback = '') {
  if (!Array.isArray(trace)) return String(fallback ?? '');
  const rendered = trace.map((item) => {
    const segment = String(item?.candidateOutput ?? item?.output ?? '');
    if (!segment) return '';
    const uncertain = item?.confidence === 'low' ||
      item?.uncertainty?.confidence === 'low' ||
      LOW_CONFIDENCE_STATUSES.has(item?.status) ||
      item?.candidateStatus === 'provisional' ||
      item?.targetStatus === 'provisional' ||
      item?.targetReason === 'provisional_mapping_requires_review';
    return uncertain ? '[' + segment + ']' : segment;
  }).join('');
  return rendered || String(fallback ?? '');
}
