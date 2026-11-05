/**
 * Browser adapter for the vendored JavaScript port of g2pK.
 *
 * Contract: original Hangul → raw g2pK surface spelling → project IPA
 * adapter → Ukrainian target mapped from that IPA.
 *
 * This adapter is an isolated comparison/practical baseline. It does not
 * apply Kozak Kim's NIKL rule engine, lexical surface corrections, IPA
 * overrides, or pronunciation variants. Normative NIKL processing belongs
 * exclusively to the Kozak Kim research engine.
 */
import { G2pBrowser } from '../vendor/g2pk/g2p-browser.ts';

const PROTECTED = /^[A-Za-z0-9ㄱ-ㅎㅏ-ㅣ]+$/u;

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
    // Preserve Latin runs, digits and compatibility jamo as literals. Every
    // remaining Korean-bearing span is passed unchanged to the pinned port.
    const surface = text.split(/([A-Za-z0-9ㄱ-ㅎㅏ-ㅣ]+)/u).map(part => {
      if (!part || PROTECTED.test(part) || !/[가-힣]/u.test(part)) return part;
      return g2p.convert(part, {
        descriptive: false,
        verbose: false,
        groupVowels: false,
        toSyl: true
      });
    }).join('');
    return { surface };
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
        ? 'g2pK: незмінена поверхнева форма → IPA → український запис'
        : 'g2pK: ' + text + ' → ' + surface + ' → IPA → український запис';
      if (result.issues.length) result.status = 'unresolved';
      else result.status = surface === text ? 'canonical' : 'contextual';
      return result;
    }
  };
}
