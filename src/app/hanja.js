// Deterministic Hangul→Hanja lexical annotator.
// The default export path uses a small hand-curated lexicon for immediate fallback.
// The browser lazily loads a generated, pinned word dictionary and calls
// createHanjaConverter() for broader local-only coverage. No neural model or API.
const LEXICON = [
  ['민주주의','民主主義'], ['대한민국','大韓民國'], ['대통령','大統領'],
  ['한국어','韓國語'], ['한국인','韓國人'], ['한국','韓國'],
  ['경제학','經濟學'], ['경제적','經濟的'], ['경제','經濟'], ['발전','發展'],
  ['정부','政府'], ['국가','國家'], ['국민','國民'],
  ['사회','社會'], ['문화','文化'], ['역사','歷史'], ['정치','政治'],
  ['교육','敎育'], ['학생','學生'], ['학교','學校'], ['대학생','大學生'], ['대학','大學'],
  ['과학','科學'], ['기술','技術'], ['정보','情報'], ['전화','電話'],
  ['자동차','自動車'], ['회사','會社'], ['기업','企業'], ['노동','勞動'],
  ['법률','法律'], ['법','法'], ['자유','自由'], ['평화','平和'],
  ['세계','世界'], ['중국','中國'], ['일본','日本'], ['미국','美國'],
  ['시간','時間'], ['문제','問題'], ['방법','方法'], ['결과','結果'], ['중요','重要'],
  ['연구','硏究'], ['언어','言語'], ['문학','文學'], ['예술','藝術'],
  ['음악','音樂'], ['운동','運動'], ['건강','健康'], ['병원','病院'],
  ['의사','醫師'], ['식사','食事'], ['음식','飮食'], ['전통','傳統'],
  ['환경','環境'], ['자연','自然'], ['역할','役割'], ['관계','關係'],
  ['공부','工夫'], ['학생들','學生들'], ['선생','先生'], ['선생님','先生님'],
].sort((a,b)=>b[0].length-a[0].length);

// Common grammatical particles/endings and productive Sino-Korean suffixes.
// This is a conservative segmentation aid, not a full Korean morphology model.
const SUFFIXES = [
  '으로부터','에서부터','에게서','으로써','이라고는','이라고','입니다',
  '했습니다','합니다','하였다','하였다가','되었다','되며','되고','되다',
  '이었다','였다','한다','했다','하다','하며','하고','해서','해요','하면','하여',
  '에게','한테','께서','으로','에서','부터','까지','보다','처럼','만큼',
  '이며','이고','이나','라도','에는','께','은','는','이','가','을','를','의',
  '와','과','도','만','에','로','랑','들','적',
].sort((a,b)=>b.length-a.length);

const HANGUL_RUN = /[\uAC00-\uD7A3]+/gu;

function createWordMap(dictionary = {}) {
  const map = new Map();
  if (typeof dictionary === 'string') {
    for (const line of dictionary.split(/\r?\n/u) {
      if (!line) continue;
      const separator = line.indexOf(':');
      if (separator <= 0 || separator === line.length - 1) continue;
      map.set(line.slice(0, separator), line.slice(separator + 1));
    }
  } else if (dictionary instanceof Map) {
    for (const [reading, hanja] of dictionary) {
      if (reading && hanja) map.set(reading, hanja);
    }
  } else if (dictionary && typeof dictionary === 'object') {
    for (const [reading, hanja] of Object.entries(dictionary)) {
      if (reading && typeof hanja === 'string' && hanja) map.set(reading, hanja);
    }
  }
  // Project-reviewed entries take precedence over the generic dictionary ranker.
  for (const [reading, hanja] of LEXICON) map.set(reading, hanja);
  return map;
}

function createAnnotator(wordMap) {
  let maxWordLength = 1;
  for (const word of wordMap.keys()) maxWordLength = Math.max(maxWordLength, word.length);

  function matchesWord(run, index, can) {
    const max = Math.min(maxWordLength, run.length-index);
    for (let length=max; length>=1; length--) {
      const word = run.slice(index,index+length);
      if (wordMap.has(word) && can[index+length][1]) return word;
    }
    return null;
  }

  function annotateKnownRun(run) {
    const n = run.length;
    // can[i][1]: suffix run[i:] can be segmented after a lexical word has occurred.
    // can[i][0]: run[i:] can be segmented and must start with a lexical word.
    const can = Array.from({length:n+1},()=>[false,false]);
    can[n][1] = true;
    for(let i=n-1;i>=0;i--){
      const max = Math.min(maxWordLength,n-i);
      for(let length=max;length>=1;length--){
        const word=run.slice(i,i+length);
        if(wordMap.has(word)&&can[i+length][1]){
          can[i][1]=true;
          can[i][0]=true;
          break;
        }
      }
      for(const suffix of SUFFIXES){
        if(run.startsWith(suffix,i)&&can[i+suffix.length][1]){
          can[i][1]=true;
          break;
        }
      }
    }
    // Fail closed: never convert a known substring inside an otherwise unknown run.
    if(!can[0][0]) return run;

    let i=0, seenWord=false, out='';
    while(i<n){
      const word=matchesWord(run,i,can);
      if(word){
        out+=wordMap.get(word);
        i+=word.length;
        seenWord=true;
        continue;
      }
      if(seenWord){
        const suffix=SUFFIXES.find(candidate=>run.startsWith(candidate,i)&&can[i+candidate.length][1]);
        if(suffix){
          out+=suffix;
          i+=suffix.length;
          continue;
        }
      }
      // Defensive fallback: never emit a partially converted run.
      return run;
    }
    return out;
  }

  return function convert(input) {
    const source = String(input ?? '');
    return source.replace(HANGUL_RUN, annotateKnownRun);
  };
}

const fallbackConverter = createAnnotator(createWordMap());

/** Small deterministic fallback used before the full local dictionary chunk loads. */
export function convertHangulToHanja(input) {
  return fallbackConverter(input);
}

/**
 * Create a deterministic converter from the generated reading→Hanja word map.
 * Candidate choice is made at build time using source-attributed, non-neural
 * dictionary ranks. The converter itself only performs local table lookups.
 */
export function createHanjaConverter(dictionary = {}) {
  return createAnnotator(createWordMap(dictionary));
}

export function getHanjaLexiconSize() {
  return LEXICON.length;
}
