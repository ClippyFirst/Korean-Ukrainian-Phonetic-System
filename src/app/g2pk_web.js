/**
 * Browser adapter for the vendored JavaScript port of g2pK.
 *
 * Contract: original Hangul -> g2pK JS surface spelling -> project IPA
 * adapter -> Ukrainian target mapped from that IPA.
 *
 * The practical adapter preserves the raw port as its first stage, then
 * applies a tiny allowlist of exact Korean surface corrections when official
 * NIKL evidence directly contradicts the pinned port. The raw port remains
 * independently regression-tested. All Ukrainian output is still generated
 * from IPA derived from the corrected Hangul surface; no direct Hangul-to-UA
 * override exists, and no exception is generalized to unseen words.
 */
import { G2pBrowser } from '../vendor/g2pk/g2p-browser.ts';

const PROTECTED = /^[A-Za-z0-9ㄱ-ㅎㅏ-ㅣ]+$/u;

// Minimal, exact-form corrections for divergences documented against NIKL.
// These correct the Korean surface BEFORE the IPA adapter; Ukrainian output
// is still derived only from the resulting IPA. The vendored g2pK output is
// left untouched in its own regression fixture so upstream parity stays
// inspectable. Never generalize these exceptions to arbitrary ㄺ/ㄼ words.
const NIKL_SURFACE_CORRECTIONS = new Map([
  ['값어치', { surface: '가버치', evidence: 'NIKL §15 붙임; official FAQ mcfaq_seq=5949' }],
  ['넓죽하다', { surface: '넙쭈카다', evidence: 'NIKL Rule 10 exact example; qna_seq=307219 https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=307219' }],
  ['넓둥글다', { surface: '넙뚱글다', evidence: 'NIKL Q&A qna_seq=322805; §10 exception' }],
  ['넓적하다', { surface: '넙쩌카다', evidence: 'NIKL Q&A qna_seq=322805; §§10, 23' }],
  ['읽고', { surface: '일꼬', evidence: 'NIKL exact-form rule explanation; qna_seq=329463 https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=329463' }],
  ['싫어서', { surface: '시러서', evidence: 'NIKL exact-form explanation; qna_seq=313981 https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=313981' }],
  ['수많은', { surface: '수마는', evidence: 'NIKL Korean Basic Dictionary, word 71144: 수많은[수ː마는] https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=71144' }]
]);

const NIKL_LEXICAL_LENGTH = new Map([
  ['수많은', { surface: '수마는', syllableIndex: 0, evidence: 'NIKL Korean Basic Dictionary, word 71144: 수많은[수ː마는]' }]
]);

const NIKL_VARIANT_SURFACES = new Map([
  ['멋있어', {
    surfaces: ['머디써', '머시써'],
    evidence: 'NIKL Online Q&A qna_seq=306166 explicitly accepts both [머디써] and [머시써]',
    sourceLocator: 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=306166'
  }]
]);

function applyNiklSurfaceCorrections(source, surface) {
  // A one-Hangul-syllable-to-one-syllable surface transform is required so
  // original code-point offsets remain valid. Fail closed if the pinned port
  // ever changes length behavior; the diagnostic regression will expose it.
  if (source.length !== surface.length) return { surface, corrections: [] };
  const corrections = [];
  for (const match of source.matchAll(/[가-힣]+/gu)) {
    // The dictionary's long-vowel reading is licensed only for the exact
    // inflected form, not automatically for a compound or running-text phrase.
    if (match[0] === '수많은' && source !== match[0] && /[가-힣]/u.test(source.replace(match[0], ''))) continue;
    const entry = NIKL_SURFACE_CORRECTIONS.get(match[0]);
    if (!entry || surface.slice(match.index, match.index + match[0].length) === entry.surface) continue;
    const before = surface.slice(0, match.index);
    const after = surface.slice(match.index + match[0].length);
    surface = before + entry.surface + after;
    corrections.push({ source: match[0], surface: entry.surface, evidence: entry.evidence });
  }
  return { surface, corrections };
}

function renderIpa(trace) {
  let result = '';
  let previousHangul = false;
  for (const item of trace) {
    if (item.status === 'literal') {
      result += item.source;
      previousHangul = false;
      continue;
    }
    if (item.ipa) {
      if (previousHangul) result += ' ';
      result += item.ipa;
      previousHangul = true;
    }
  }
  return result;
}

function renderTarget(trace) {
  return trace.map(item => item.output ?? '').join('');
}

export function createG2pWebAdapter(engine) {
  const g2p = new G2pBrowser();

  function normalizeSurface(text) {
    const corrections = [];
    // Preserve Latin runs, digits and compatibility jamo as literals. Every
    // remaining Korean-bearing span is passed to the port with whitespace and
    // punctuation intact, so G2P can apply its own sentence-context rules.
    const surface = text.split(/([A-Za-z0-9ㄱ-ㅎㅏ-ㅣ]+)/u).map(part => {
      if (!part || PROTECTED.test(part) || !/[가-힣]/u.test(part)) return part;
      const portSurface = g2p.convert(part, {
        descriptive: false,
        verbose: false,
        groupVowels: false,
        toSyl: true
      });
      const corrected = applyNiklSurfaceCorrections(part, portSurface);
      corrections.push(...corrected.corrections);
      return corrected.surface;
    }).join('');
    return { surface, corrections };
  }

  return {
    convert(text) {
      const normalized = normalizeSurface(text);
      const surface = normalized.surface;
      // convertSurface is only the IPA/target adapter. It must not rerun the
      // native research engine's orthographic phonology rules over G2P output.
      const result = engine.convertSurface(surface);
      result.source = text;
      result.surfaceHangul = surface === text ? '' : surface;
      result.ukrainian = result.candidate_status === 'provisional' ? '' : renderTarget(result.trace);
      result.ipa = renderIpa(result.trace);
      result.analysis = surface === text
        ? 'g2pK JavaScript: незмінена поверхнева форма → IPA → український запис'
        : 'g2pK JavaScript: ' + text + ' → ' + surface + ' → IPA → український запис';
      if (normalized.corrections.length) {
        result.analysis += '; NIKL exact-form correction before IPA: ' + normalized.corrections
          .map(item => item.source + ' → ' + item.surface + ' (' + item.evidence + ')').join('; ');
      }

      // The official dictionary marks lexical length with ː. Preserve it in
      // inspectable IPA for this exact form only; the target renderer still
      // owns Ukrainian output, and this overlay does not assert IPA gold.
      const lexicalLength = NIKL_LEXICAL_LENGTH.get(text);
      if (lexicalLength && surface === lexicalLength.surface && result.trace?.[lexicalLength.syllableIndex]?.ipa) {
        const item = result.trace[lexicalLength.syllableIndex];
        if (!item.ipa.includes('ː')) {
          item.ipa += 'ː';
          result.ipa = renderIpa(result.trace);
          result.analysis += '; NIKL lexical vowel length retained in IPA (' + lexicalLength.evidence + ')';
        }
      }

      // NIKL explicitly accepts two Hangul surface variants for this exact
      // lexical form. Add an alternative only when the pinned G2P surface is
      // one of the attested variants and the IPA-to-target path fully succeeds.
      // The generated IPA/target are project candidates, never independent gold.
      const variantEvidence = text === '멋있어' ? NIKL_VARIANT_SURFACES.get(text) : null;
      if (variantEvidence && variantEvidence.surfaces.includes(surface)) {
        const alternativeSurface = variantEvidence.surfaces.find(value => value !== surface);
        const alternative = engine.convertSurface(alternativeSurface);
        if (!alternative.issues?.length && alternative.ipa && alternative.ukrainian && !alternative.candidate_status) {
          result.variants = [...(result.variants || []), {
            source: text,
            sourceLocator: variantEvidence.sourceLocator,
            surface: alternativeSurface,
            ukrainian: alternative.ukrainian,
            ipa: alternative.ipa,
            note: variantEvidence.evidence + '; IPA/український відповідник згенеровані адаптером ClippyFirst і потребують окремої перевірки.',
            status: 'lexical-review',
            ipaIsGold: false,
            ukrainianTargetIsGold: false
          }];
        }
      }

      result.normativeCorrections = normalized.corrections;
      if (result.issues.length) result.status = 'unresolved';
      else if (normalized.corrections.length) result.status = 'lexical';
      else result.status = surface === text ? 'canonical' : 'contextual';
      return result;
    }
  };
}
