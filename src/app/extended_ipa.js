/** Browser-side Extended IPA profile view.
 * Narrow output is a partial research preview, not target-compatible.
 */
import { decompose } from './engine_shared.js';

const GLIDE_NUCLEI = new Set(['ㅑ','ㅒ','ㅕ','ㅖ','ㅛ','ㅠ']);
const PALATAL_LIQUID_NUCLEI = new Set(['ㅣ','ㅑ','ㅒ','ㅕ','ㅖ','ㅛ','ㅠ']);
const SONORANT_CODAS = new Set(['ㄴ','ㄹ','ㅁ','ㅇ','ㄵ','ㄶ','ㄻ','ㄼ','ㄽ','ㄾ','ㅀ']);
const EVIDENCE = {
  'narrow-nasal-palatalization': {
    refs: ['https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001340886',
      'https://discovery.ucl.ac.uk/1324541/1/1324541.pdf'],
    status: 'research-hypothesis'
  },
  'narrow-lenis-sibilant-place': {
    refs: ['https://doi.org/10.17959/sppm.2010.16.1.3'],
    status: 'source-scoped-acoustic-coarticulation'
  },
  'narrow-h-palatal-allophone': {
    refs: ['https://doi.org/10.1017/S0025100300004758'],
    status: 'source-scoped-description'
  },
  'narrow-h-voiced-allophone': {
    refs: ['https://doi.org/10.17959/sppm.2014.20.3.357'],
    status: 'source-scoped-research-hypothesis'
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
    if (prior && SONORANT_CODAS.has(prior.coda)) {
      ipa = replaceInitial(ipa, ['h'], 'ɦ');
      if (ipa.startsWith('ɦ')) {
        rules.push('narrow-h-voiced-allophone');
        evidence.push(EVIDENCE['narrow-h-voiced-allophone']);
        environment = 'same word: sonorant coda + onset ㅎ';
      }
    } else if (['ㅣ','ㅑ','ㅒ','ㅕ','ㅖ','ㅛ','ㅠ'].includes(parsed.vowel)) {
      ipa = replaceInitial(ipa, ['h'], 'ç');
      if (ipa.startsWith('ç')) {
        rules.push('narrow-h-palatal-allophone');
        evidence.push(EVIDENCE['narrow-h-palatal-allophone']);
        environment = 'onset ㅎ before selected high-front/glide nuclei';
      }
    } else if (parsed.vowel === 'ㅜ') {
      ipa = replaceInitial(ipa, ['h'], 'x');
      if (ipa.startsWith('x')) {
        rules.push('narrow-h-palatal-allophone');
        evidence.push(EVIDENCE['narrow-h-palatal-allophone']);
        environment = 'onset ㅎ before ㅜ';
      }
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

export function validateExtendedIpaResult(result) {
  const errors = [];
  if (!result || typeof result !== 'object' || Array.isArray(result)) return ['result must be an object'];
  if (result.schema_version !== '1.0' || result.mode !== 'extended-ipa') errors.push('unsupported schema or mode');
  if (!result.source || typeof result.source.text !== 'string' || result.source.offset_unit !== 'unicode-code-points') errors.push('invalid source metadata');
  if (!result.layers || !['phonemic','broad','narrow'].every(level => result.layers[level]?.level === level)) errors.push('all three IPA layers are required');
  if (!Array.isArray(result.variants) || !Array.isArray(result.boundaries) || !Array.isArray(result.trace)) errors.push('variants, boundaries and trace must be arrays');
  if (!result.target_adapter || !['phonemic','broad','narrow','none'].includes(result.target_adapter.input_layer)) errors.push('invalid target adapter metadata');
  if (result.layers?.narrow?.target_compatible !== true && result.target_adapter.input_layer === 'narrow' && !['unavailable','blocked','not-run-for-extended-profile'].includes(result.target_adapter.status)) errors.push('partial narrow IPA cannot be marked as adapted');
  return errors;
}

export function buildExtendedIpaResult(source, engineResult) {
  if (typeof source !== 'string' || !engineResult || typeof engineResult !== 'object') throw new TypeError('source and engine result are required');
  const sourceTrace = Array.isArray(engineResult.trace) ? engineResult.trace : [];
  const variants = [], boundaries = [], trace = [];
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
    const derived = narrowSyllable(item, previousHangul, !boundarySincePrevious);
    if (derived.ipa) {
      if (previousWasHangul) narrowIpa += '.';
      narrowIpa += derived.ipa;
      previousWasHangul = true;
    } else previousWasHangul = false;
    if (span) boundaries.push({ offset: span.end, kind: 'syllable' });
    trace.push({
      source_span: span, source: value, surface: item.surface || value, ipa: derived.ipa,
      rule_ids: derived.rules, environment: derived.environment,
      evidence_refs: derived.refs,
      evidence_status: derived.evidence.map(entry => entry.status).join(';') || 'no-narrow-rule-applied',
      status: item.status || 'ungraded'
    });
    previousHangul = item;
    boundarySincePrevious = false;
  }
  const result = {
    schema_version: '1.0',
    mode: 'extended-ipa',
    source: { text: source, offset_unit: 'unicode-code-points' },
    layers: {
      phonemic: {
        ipa: null, profile_id: null, profile_version: null, level: 'phonemic',
        status: 'not-implemented-in-browser-runtime',
        evidence_status: 'underlying-layer-pending-cross-runtime-adapter',
        target_compatible: false
      },
      broad: {
        ipa: typeof engineResult.ipa === 'string' ? engineResult.ipa : '',
        profile_id: engineResult.ipa_profile || null,
        profile_version: Number.isInteger(engineResult.ipa_profile_version) ? engineResult.ipa_profile_version : null,
        level: 'broad', status: engineResult.ipa_profile_status || 'unadjudicated-cross-runtime',
        evidence_status: 'existing-browser-surface-IPA',
        target_compatible: false
      },
      narrow: {
        ipa: narrowIpa,
        profile_id: 'clippyfirst-korean-narrow-contextual-allophones-v5',
        profile_version: 5, level: 'narrow',
        status: engineResult.pronunciation_status === 'unresolved' ? 'diagnostic-only-unresolved-source' : 'partial-research-only',
        evidence_status: 'partial-source-scoped-hypotheses-not-independently-reviewed',
        target_compatible: false
      }
    },
    variants: (Array.isArray(engineResult.variants) ? engineResult.variants : []).map((variant, index) => ({
      id: 'broad-variant-' + (index + 1), layer: 'broad', ipa: String(variant.ipa ?? ''),
      evidence_status: variant.note?.startsWith('Research-only') ? 'research-hypothesis' : 'source-or-rule-derived-variant',
      evidence_refs: [], environment: variant.note || null,
      uncertainty: 'Speaker-specific realization is not identified by this result.',
      source_span: null, selected: false
    })),
    boundaries: [...new Map(boundaries.map(item => [item.offset + ':' + item.kind, item])).values()],
    trace,
    target_adapter: {
      status: 'not-run-for-extended-profile', input_layer: 'broad',
      profile_id: engineResult.ipa_profile || null
    },
    pronunciation_status: engineResult.pronunciation_status || 'ungraded'
  };
  const errors = validateExtendedIpaResult(result);
  if (errors.length) throw new TypeError('invalid Extended IPA result: ' + errors.join('; '));
  return result;
}
