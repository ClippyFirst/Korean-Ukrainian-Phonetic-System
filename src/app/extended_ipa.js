/** Browser-side Extended IPA profile view.
 * Narrow output is a partial research preview, not target-compatible.
 */
import { decompose } from './engine_shared.js';
import { parseIpaSegments } from './ipa_segments.js';

const GLIDE_NUCLEI = new Set(['ㅑ','ㅒ','ㅕ','ㅖ','ㅛ','ㅠ']);
const PALATAL_LIQUID_NUCLEI = new Set(['ㅣ','ㅑ','ㅒ','ㅕ','ㅖ','ㅛ','ㅠ']);
const SONORANT_CODAS = new Set(['ㄴ','ㄹ','ㅁ','ㅇ','ㄵ','ㄶ','ㄻ','ㄼ','ㄽ','ㄾ','ㅀ']);
const EVIDENCE = {
  'narrow-nasal-palatalization': {
    refs: ['https://discovery.ucl.ac.uk/id/eprint/1324541/1/1324541.pdf'],
    status: 'secondary-description-requires-primary-phonetic-review'
  },
  'narrow-lenis-sibilant-place': {
    refs: ['https://doi.org/10.17959/sppm.2010.16.1.3'],
    status: 'source-scoped-acoustic-coarticulation'
  },
  'narrow-h-palatal-allophone': {
    refs: ['https://doi.org/10.1017/S0025100300004758'],
    status: 'source-scoped-description'
  },
  'narrow-h-sonorant-variation-unresolved': {
    refs: ['https://doi.org/10.17290/jlsk.2019..84.175',
      'https://doi.org/10.17959/sppm.2014.20.3.357'],
    status: 'speaker-and-dialect-variable-no-single-IPA-selected'
  },
  'narrow-h-intervocalic-allophone': {
    refs: ['https://doi.org/10.1017/S0025100300004758'],
    status: 'source-scoped-description'
  },
  'narrow-liquid-allophone': {
    refs: ['https://doi.org/10.1017/S0025100300004758'],
    status: 'source-scoped-description'
  }
};

function findSpan(source, value, cursor) {
  if (!value) return null;
  const sourcePoints = [...source];
  const valuePoints = [...value];
  for (let start = cursor; start <= sourcePoints.length - valuePoints.length; start++) {
    if (valuePoints.every((point, index) => sourcePoints[start + index] === point)) {
      return { start, end: start + valuePoints.length };
    }
  }
  return null;
}
function replaceInitial(ipa, oldValues, replacement) {
  for (const old of oldValues) if (ipa.startsWith(old)) return replacement + ipa.slice(old.length);
  return ipa;
}
function narrowSyllable(current, previous, sameWord) {
  const parsed = decompose(current.surface || current.source);
  if (!parsed || !current.ipa) return { ipa: current.ipa || '', rules: [], environment: null, refs: [], evidence: [] };
  const prior = sameWord && previous ? decompose(previous.surface || previous.source) : null;
  let ipa = current.ipa;
  const rules = [], refs = [], evidence = [];
  let environment = null;
  if (parsed.onset === 'ㄴ' && GLIDE_NUCLEI.has(parsed.vowel)) {
    ipa = replaceInitial(ipa, ['n'], 'ɲ');
    if (ipa.startsWith('ɲ')) {
      rules.push('narrow-nasal-palatalization');
      evidence.push(EVIDENCE['narrow-nasal-palatalization']);
      environment = 'onset ㄴ before glide-initial nucleus';
    }
  } else if (parsed.onset === 'ㅅ') {
    const palatal = ['ㅣ','ㅖ','ㅑ'].includes(parsed.vowel);
    ipa = replaceInitial(ipa, ['ɕ','s'], palatal ? 'ɕʰ' : 'sʰ');
    if (ipa.startsWith('ɕʰ') || ipa.startsWith('sʰ')) {
      rules.push('narrow-lenis-sibilant-place');
      evidence.push(EVIDENCE['narrow-lenis-sibilant-place']);
      environment = palatal ? 'onset ㅅ before ㅣ/ㅖ/ㅑ' : 'onset ㅅ; existing partial-profile aspiration convention';
    }
  } else if (parsed.onset === 'ㅆ') {
    ipa = replaceInitial(ipa, ['ɕ͈'], 's͈');
  } else if (parsed.onset === 'ㅎ') {
    if (['ㅣ','ㅑ','ㅒ','ㅕ','ㅖ','ㅛ','ㅠ'].includes(parsed.vowel)) {
      ipa = replaceInitial(ipa, ['h'], 'ç');
      if (ipa.startsWith('ç')) {
        rules.push('narrow-h-palatal-allophone');
        evidence.push(EVIDENCE['narrow-h-palatal-allophone']);
        environment = 'onset ㅎ before selected high-front/glide nuclei';
        if (prior && SONORANT_CODAS.has(prior.coda)) {
          rules.push('narrow-h-sonorant-variation-unresolved');
          evidence.push(EVIDENCE['narrow-h-sonorant-variation-unresolved']);
          environment += '; preceding sonorant: optional weakening/deletion remains unresolved';
        }
      }
    } else if (parsed.vowel === 'ㅜ') {
      ipa = replaceInitial(ipa, ['h'], 'x');
      if (ipa.startsWith('x')) {
        rules.push('narrow-h-palatal-allophone');
        evidence.push(EVIDENCE['narrow-h-palatal-allophone']);
        environment = 'onset ㅎ before ㅜ';
        if (prior && SONORANT_CODAS.has(prior.coda)) {
          rules.push('narrow-h-sonorant-variation-unresolved');
          evidence.push(EVIDENCE['narrow-h-sonorant-variation-unresolved']);
          environment += '; preceding sonorant: optional weakening/deletion remains unresolved';
        }
      }
    } else if (prior && SONORANT_CODAS.has(prior.coda)) {
      rules.push('narrow-h-sonorant-variation-unresolved');
      evidence.push(EVIDENCE['narrow-h-sonorant-variation-unresolved']);
      environment = 'same word: sonorant coda + onset ㅎ; weakening/deletion is variable, no single IPA selected';
    } else if (prior && prior.coda === '') {
      ipa = replaceInitial(ipa, ['h'], 'ɸ');
      if (ipa.startsWith('ɸ')) {
        rules.push('narrow-h-intervocalic-allophone');
        evidence.push(EVIDENCE['narrow-h-intervocalic-allophone']);
        environment = 'same word: intervocalic onset ㅎ after open syllable';
      }
    }
  } else if (parsed.onset === 'ㄹ' && prior) {
    if (prior.coda === 'ㄹ') {
      ipa = replaceInitial(ipa, ['ɾ','ɭ'], 'l');
      if (ipa.startsWith('l')) {
        rules.push('liquid-assimilation');
        evidence.push(EVIDENCE['narrow-liquid-allophone']);
        environment = 'same word: ㄹ coda + ㄹ onset';
      }
    } else if (prior.coda === '' || PALATAL_LIQUID_NUCLEI.has(parsed.vowel)) {
      ipa = replaceInitial(ipa, ['ɾ','l'], 'ɭ');
      if (ipa.startsWith('ɭ')) {
        rules.push('narrow-liquid-allophone');
        evidence.push(EVIDENCE['narrow-liquid-allophone']);
        environment = 'same word: intervocalic ㄹ or ㄹ before /i,j/-initial nucleus';
      }
    }
  }
  for (const item of evidence) refs.push(...item.refs);
  return { ipa, rules, environment, refs, evidence };
}

function segmentsForLayer(ipa, trace, layer) {
  if (typeof ipa !== 'string' || !ipa) return [];
  const points = [...ipa]; let cursor = 0; const output = [];
  for (const item of trace) {
    if (item?.layer !== layer || typeof item.ipa !== 'string' || !item.ipa) continue;
    const value = [...item.ipa]; let start = -1;
    for (let i = cursor; i <= points.length - value.length; i++) {
      if (value.every((point, index) => points[i + index] === point)) { start = i; break; }
    }
    if (start < 0) continue;
    output.push(...parseIpaSegments(item.ipa, {
      sourceSpan: item.source_span || null, ipaOffset: start,
      provenance: { ruleIds: item.rule_ids || [], evidenceRefs: item.evidence_refs || [],
        evidenceStatus: item.evidence_status || 'not-attributed', environment: item.environment || null }
    }));
    cursor = start + value.length;
  }
  const fullTokens = parseIpaSegments(ipa);
  const expected = fullTokens.filter(token => token.kind === 'segment' || token.kind === 'unknown');
  const actual = output.filter(token => token.kind === 'segment' || token.kind === 'unknown');
  const covered = actual.length === expected.length && actual.every((token, index) =>
    token.kind === expected[index].kind && token.ipa === expected[index].ipa
  );
  if (output.length && covered) {
    const existingBoundaries = new Set(output.filter(token => token.kind === 'boundary').map(token => token.ipa_span.start));
    output.push(...fullTokens.filter(token => token.kind === 'boundary' && !existingBoundaries.has(token.ipa_span.start)));
    output.sort((left, right) => left.ipa_span.start - right.ipa_span.start);
    const counters = { segment: 0, boundary: 0, unknown: 0 };
    for (const token of output) {
      counters[token.kind] += 1;
      token.id = token.kind + '-' + String(counters[token.kind]).padStart(4, '0');
    }
    return output;
  }
  return parseIpaSegments(ipa);
}

export function validateExtendedIpaResult(result) {
  const errors = [];
  if (!result || typeof result !== 'object' || Array.isArray(result)) return ['result must be an object'];
  if (result.schema_version !== '1.2' || result.mode !== 'extended-ipa') errors.push('unsupported schema or mode');
  if (!result.source || typeof result.source.text !== 'string' || result.source.offset_unit !== 'unicode-code-points') errors.push('invalid source metadata');
  if (!result.layers || !['phonemic','broad','narrow'].every(level => result.layers[level]?.level === level && Array.isArray(result.layers[level]?.segments))) errors.push('all three IPA layers with segment arrays are required');
  if (!Array.isArray(result.variants) || !Array.isArray(result.boundaries) || !Array.isArray(result.trace)) errors.push('variants, boundaries and trace must be arrays');
  else for (const item of result.trace) if (!item || !['phonemic','broad','narrow'].includes(item.layer)) errors.push('every trace item requires a valid IPA layer');
  const contextKeys = ['speaker_id','dialect','age_group','speech_style','speech_rate_syllables_per_second','focus','prosodic_position','recording_conditions'];
  if (!result.context || contextKeys.some(key => !(key in result.context))) errors.push('speaker and prosody context fields are required, even when unknown');
  else {
    for (const key of contextKeys.filter(key => !['focus','speech_rate_syllables_per_second'].includes(key))) {
      if (result.context[key] !== null && typeof result.context[key] !== 'string') errors.push('context.' + key + ' must be a string or null');
    }
    if (result.context.focus !== null && typeof result.context.focus !== 'boolean') errors.push('context.focus must be boolean or null');
    if (result.context.speech_rate_syllables_per_second !== null &&
        (typeof result.context.speech_rate_syllables_per_second !== 'number' || result.context.speech_rate_syllables_per_second < 0)) errors.push('context speech rate must be non-negative or null');
  }
  if (!Array.isArray(result.acoustic_annotations)) errors.push('acoustic_annotations must be an array');
  else for (const annotation of result.acoustic_annotations) {
    const required = ['feature','value','unit','source_span','measurement_method','evidence_refs','status'];
    if (!annotation || required.some(key => !(key in annotation))) errors.push('acoustic annotation is missing required fields');
    if (annotation?.status === 'measured' && (!annotation.measurement_method || !annotation.evidence_refs?.length || !annotation.source_span)) {
      errors.push('measured acoustic annotations require a method and evidence reference');
    }
  }
  if (!result.target_adapter || !['phonemic','broad','narrow','none'].includes(result.target_adapter.input_layer)) errors.push('invalid target adapter metadata');
  if (result.layers?.narrow?.target_compatible !== true && result.target_adapter.input_layer === 'narrow' && !['unavailable','blocked','not-run-for-extended-profile'].includes(result.target_adapter.status)) errors.push('partial narrow IPA cannot be marked as adapted');
  return errors;
}

export function buildExtendedIpaResult(source, engineResult, phonemicResult = null) {
  if (typeof source !== 'string' || !engineResult || typeof engineResult !== 'object') throw new TypeError('source and engine result are required');
  const sourceTrace = Array.isArray(engineResult.trace) ? engineResult.trace : [];
  const variants = [], boundaries = [], trace = [], syllableSpans = [];
  for (const item of (phonemicResult?.trace || [])) {
    trace.push({ layer: 'phonemic', source_span: item.source_span || null, source: item.source || '', surface: null, ipa: item.ipa ?? null, rule_ids: [], environment: 'underlying onset+nucleus+coda inventory; no surface rules', evidence_refs: [], evidence_status: phonemicResult.evidence_status || 'deterministic-underlying-phonemic-inventory', status: item.status || 'underlying-phonemic-grapheme-derived' });
  }
  for (const boundary of (phonemicResult?.boundaries || [])) boundaries.push(boundary);
  let cursor = 0, previousHangul = null, boundarySincePrevious = true;
  let narrowIpa = '', previousWasHangul = false;
  for (const item of sourceTrace) {
    const value = String(item.source ?? '');
    const span = findSpan(source, value, cursor);
    if (span) cursor = span.end;
    if (item.status === 'literal' || !/^[가-힣]$/u.test(value)) {
      if (/^\s+$/u.test(value) && span) {
        for (let offset = 0; offset < [...value].length; offset++) boundaries.push({ offset: span.start + offset, kind: 'word' });
      }
      if (/^[\s\p{P}]+$/u.test(value)) narrowIpa += value;
      previousHangul = null;
      boundarySincePrevious = true;
      previousWasHangul = false;
      continue;
    }
    trace.push({
      layer: 'broad', source_span: span, source: value, surface: item.surface || value,
      ipa: item.ipa ?? null,
      rule_ids: Array.isArray(item.rules) ? item.rules.filter(rule => typeof rule === 'string') : [],
      environment: null, evidence_refs: [],
      evidence_status: 'browser-broad-surface-trace',
      status: item.status || 'ungraded'
    });
    const derived = narrowSyllable(item, previousHangul, !boundarySincePrevious);
    if (derived.ipa) {
      if (previousWasHangul) narrowIpa += '.';
      narrowIpa += derived.ipa;
      previousWasHangul = true;
    } else previousWasHangul = false;
    if (span) { boundaries.push({ offset: span.end, kind: 'syllable' }); syllableSpans.push(span); }
    trace.push({
      layer: 'narrow', source_span: span, source: value, surface: item.surface || value, ipa: derived.ipa,
      rule_ids: [...new Set([...(Array.isArray(item.rules) ? item.rules : []), ...derived.rules])], environment: derived.environment,
      evidence_refs: derived.refs,
      evidence_status: derived.evidence.map(entry => entry.status).join(';') || (item.rules?.length ? 'browser-runtime-rule-trace-requires-review' : 'no-narrow-rule-applied'),
      status: item.status || 'ungraded'
    });
    previousHangul = item;
    boundarySincePrevious = false;
  }
  const hasUnresolvedSource = engineResult.pronunciation_status === 'unresolved' || sourceTrace.some(item => ['unresolved','unsupported-jamo','unsupported'].includes(item.status));
  if (hasUnresolvedSource) narrowIpa = '';
  trace.sort((a, b) => {
    const left = a.source_span?.start ?? Number.MAX_SAFE_INTEGER;
    const right = b.source_span?.start ?? Number.MAX_SAFE_INTEGER;
    const order = { phonemic: 0, broad: 1, narrow: 2 };
    return left - right || (order[a.layer] ?? 3) - (order[b.layer] ?? 3);
  });
  const result = {
    schema_version: '1.2',
    mode: 'extended-ipa',
    source: { text: source, offset_unit: 'unicode-code-points' },
    layers: {
      phonemic: {
        ipa: typeof phonemicResult?.ipa === 'string' ? phonemicResult.ipa : null,
        profile_id: phonemicResult?.profile_id || null,
        profile_version: Number.isInteger(phonemicResult?.profile_version) ? phonemicResult.profile_version : null,
        level: 'phonemic',
        status: phonemicResult?.status || 'underlying-phonemic-layer-unavailable',
        evidence_status: phonemicResult?.evidence_status || 'underlying-phonemic-layer-unavailable',
        target_compatible: false
      },
      broad: {
        ipa: typeof engineResult.ipa === 'string' ? engineResult.ipa : '',
        profile_id: engineResult.ipa_profile || null,
        profile_version: Number.isInteger(engineResult.ipa_profile_version) ? engineResult.ipa_profile_version : null,
        level: 'broad', status: engineResult.pronunciation_status === 'unresolved'
          ? 'diagnostic-only-unresolved-source'
          : engineResult.ipa_profile_status || 'unadjudicated-cross-runtime',
        evidence_status: 'shared-versioned-broad-profile-clippyfirst-korean-broad-v1',
        target_compatible: false
      },
      narrow: {
        ipa: narrowIpa,
        profile_id: 'clippyfirst-korean-narrow-contextual-allophones-v6',
        profile_version: 6, level: 'narrow',
        status: hasUnresolvedSource ? 'diagnostic-only-unresolved-source' : 'partial-research-only',
        evidence_status: 'partial-source-scoped-hypotheses-not-independently-reviewed',
        target_compatible: false
      }
    },
    context: {
      speaker_id: null, dialect: null, age_group: null, speech_style: null,
      speech_rate_syllables_per_second: null, focus: null,
      prosodic_position: null, recording_conditions: null
    },
    acoustic_annotations: [],
    variants: (Array.isArray(engineResult.variants) ? engineResult.variants : []).map((variant, index) => {
      // Generic browser variant indices are local to a token; only map them directly when the whole source is one Hangul eojeol.
      const indices = /^[가-힣]+$/u.test(source) && Array.isArray(variant.syllable_indices) ? variant.syllable_indices.filter(value => Number.isInteger(value) && syllableSpans[value]) : [];
      const sourceSpan = indices.length ? {
        start: Math.min(...indices.map(value => syllableSpans[value].start)),
        end: Math.max(...indices.map(value => syllableSpans[value].end))
      } : null;
      return {
        id: 'broad-variant-' + (index + 1), layer: 'broad', ipa: String(variant.ipa ?? ''),
        evidence_status: variant.note?.startsWith('Research-only') ? 'research-hypothesis' : 'source-or-rule-derived-variant',
        evidence_refs: String(variant.note || '').split(' ').filter(ref => ref.startsWith('http://') || ref.startsWith('https://')),
        environment: variant.note || null,
        uncertainty: 'Speaker-specific realization is not identified by this result.',
        source_span: sourceSpan, selected: false
      };
    }),
    boundaries: [...new Map(boundaries.map(item => [item.offset + ':' + item.kind, item])).values()],
    trace,
    target_adapter: {
      status: 'not-run-for-extended-profile', input_layer: 'broad',
      profile_id: engineResult.ipa_profile || null
    },
    pronunciation_status: engineResult.pronunciation_status || 'ungraded'
  };
  for (const level of ['phonemic','broad','narrow']) {
    result.layers[level].segments = segmentsForLayer(result.layers[level].ipa, trace, level);
  }
  const errors = validateExtendedIpaResult(result);
  if (errors.length) throw new TypeError('invalid Extended IPA result: ' + errors.join('; '));
  return result;
}
