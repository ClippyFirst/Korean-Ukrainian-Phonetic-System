import registry from '../korean_ukrainian/source_adjudications.json' with { type: 'json' };

const HANGUL_OR_JAMO = /[\\u1100-\\u11ff\\u3130-\\u318f\\uac00-\\ud7a3]/u;

function hasKoreanBoundary(text, start, end) {
  const before = start > 0 ? [...text.slice(0, start)].at(-1) : '';
  const after = end < text.length ? [...text.slice(end)][0] : '';
  return (!before || !HANGUL_OR_JAMO.test(before)) &&
    (!after || !HANGUL_OR_JAMO.test(after));
}

/**
 * Return accepted source adjudications that match a complete, explicitly
 * bounded source form. This is a policy annotation layer: it never rewrites
 * Hangul, IPA, or Ukrainian output.
 */
export function sourceAdjudicationsForInput(source) {
  const text = String(source ?? '').normalize('NFC');
  const matches = [];
  for (const item of registry.adjudications) {
    for (const form of item.runtime_match_forms) {
      let from = 0;
      while (from <= text.length - form.length) {
        const start = text.indexOf(form, from);
        if (start < 0) break;
        const end = start + form.length;
        if (hasKoreanBoundary(text, start, end)) {
          matches.push({
            adjudication_id: item.adjudication_id,
            case_family: item.case_family,
            matched_form: form,
            source_adjudication_status: item.source_adjudication_status,
            runtime_action: item.runtime_action,
            evidence_ids: item.evidence_ids,
            claim_ids: item.claim_ids,
            occurrence_ids: item.occurrence_ids
          });
        }
        from = end;
      }
    }
  }
  return matches;
}

export function attachSourceAdjudications(source, result) {
  return {
    ...result,
    source_adjudication_registry_version: registry.schema_version,
    source_adjudications: sourceAdjudicationsForInput(source)
  };
}
