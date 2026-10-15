/**
 * Browser adapter for the pure-JavaScript port of g2pK.
 *
 * Pipeline: original Hangul -> Korean G2P surface spelling -> IPA from that
 * surface -> Ukrainian target from IPA. The browser never re-runs the native
 * orthographic phonology rules over a surface that is already normalized.
 */
import { G2pBrowser } from '../vendor/g2pk/g2p-browser.ts';
import { parseCsv } from './engine_shared.js';
import { ipaSyllableToUkrainian } from './engine_ipa.js';

const PROTECTED = /^[A-Za-z0-9ㄱ-ㅎㅏ-ㅣ]+$/u;
const HANGUL_RUN = /[가-힣]+/gu;

function codePointIndex(text, utf16Index) {
  return Array.from(text.slice(0, utf16Index)).length;
}

function mapIpa(ipa) {
  return ipa.map(ipaSyllableToUkrainian);
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

export function createG2pWebAdapter(engine, lexicalCsv = '') {
  const g2p = new G2pBrowser();
  const lexicon = new Map(parseCsv(lexicalCsv).map(row => [row.input, row]));

  function normalizeSurface(text) {
    // Keep Latin words, digits, and compatibility jamo literal. Let G2P see
    // Korean sentence context, whitespace, and punctuation in each segment.
    return text.split(/([A-Za-z0-9ㄱ-ㅎㅏ-ㅣ]+)/u).map(part => {
      if (!part || PROTECTED.test(part) || !/[가-힣]/u.test(part)) return part;
      return g2p.convert(part, {
        descriptive: false,
        verbose: false,
        groupVowels: false,
        toSyl: true
      });
    }).join('');
  }

  function applyLexicalSurfaceControls(source, initialSurface) {
    const sourceWords = [...source.matchAll(HANGUL_RUN)];
    const surfaceWords = [...initialSurface.matchAll(HANGUL_RUN)];
    if (sourceWords.length !== surfaceWords.length) return initialSurface;
    let surface = initialSurface;
    for (let i = sourceWords.length - 1; i >= 0; i--) {
      const entry = lexicon.get(sourceWords[i][0]);
      const current = surfaceWords[i];
      if (!entry?.surface_hangul || !current) continue;
      if ([...entry.surface_hangul].length !== [...sourceWords[i][0]].length) continue;
      surface = surface.slice(0, current.index) + entry.surface_hangul +
        surface.slice(current.index + current[0].length);
    }
    return surface;
  }

  function applyLexicalIpaControls(source, surface, result) {
    const sourceWords = [...source.matchAll(HANGUL_RUN)];
    const surfaceWords = [...surface.matchAll(HANGUL_RUN)];
    if (sourceWords.length !== surfaceWords.length) return result;

    let applied = false;
    for (let wordIndex = 0; wordIndex < sourceWords.length; wordIndex++) {
      const word = sourceWords[wordIndex][0];
      const entry = lexicon.get(word);
      const surfaceWord = surfaceWords[wordIndex];
      if (!entry?.ipa_syllables || !surfaceWord) continue;

      const ipas = entry.ipa_syllables.split('|');
      const sourceChars = [...word];
      if (ipas.length !== sourceChars.length ||
          [...surfaceWord[0]].length !== sourceChars.length) continue;

      const mapped = mapIpa(ipas);
      const unknown = mapped.find(item => item.unknown);
      if (unknown) {
        result.issues.push(word + ': sourced lexical IPA contains an unmapped segment "' + unknown.unknown + '".');
        continue;
      }

      const start = codePointIndex(surface, surfaceWord.index);
      for (let i = 0; i < ipas.length; i++) {
        const traceItem = result.trace[start + i];
        if (!traceItem || traceItem.status === 'literal') continue;
        traceItem.source = sourceChars[i];
        traceItem.ipa = ipas[i];
        traceItem.output = mapped[i].text;
        traceItem.status = entry.target_status === 'provisional' ? 'lexical-review' : 'lexical';
        traceItem.rules = ['sourced-lexical-ipa'];
      }
      applied = true;
    }

    if (applied) result.status = 'lexical';
    return result;
  }

  return {
    convert(text) {
      const initialSurface = normalizeSurface(text);
      const surface = applyLexicalSurfaceControls(text, initialSurface);
      const result = engine.convertSurface(surface);
      const sourceChars = Array.from(text);
      const surfaceChars = Array.from(surface);

      if (sourceChars.length === surfaceChars.length) {
        for (let i = 0; i < result.trace.length; i++) {
          const item = result.trace[i];
          if (!item || item.status === 'literal') continue;
          item.source = sourceChars[i] ?? item.source;
          if (sourceChars[i] !== surfaceChars[i]) {
            item.status = 'contextual';
            item.rules = ['g2pk-js-surface-realization'];
          }
        }
      }

      applyLexicalIpaControls(text, surface, result);
      result.source = text;
      result.surfaceHangul = surface === text ? '' : surface;
      result.ukrainian = renderTarget(result.trace);
      result.ipa = renderIpa(result.trace);
      result.analysis = surface === text
        ? 'g2pK JavaScript: незмінена вимовна форма → IPA → український запис'
        : 'g2pK JavaScript: ' + text + ' → ' + surface + ' → IPA → український запис';
      if (result.issues.length) result.status = 'unresolved';
      else if (result.status !== 'lexical') result.status = surface === text ? 'canonical' : 'contextual';
      return result;
    }
  };
}
