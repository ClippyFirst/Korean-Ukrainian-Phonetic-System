// Deterministic Hangul→Hanja lexical annotator.
// This is an intentionally small, hand-curated vocabulary, not a complete Hanja
// dictionary or a morphological analyzer. Unknown eojeol runs are preserved whole.
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
  '으로부터','에서부터','에게서','으로써','이라고','이라고는','입니다',
  '했습니다','합니다','하였다','하였다가','되었다','되며','되고','되다',
  '이었다','였다','한다','했다','하다','하며','하고','해서','해요','하면','하여',
  '에게','한테','께서','으로','에서','부터','까지','보다','처럼','만큼',
  '이며','이고','이나','라도','라도','에는','에서','에게','께','은','는',
  '이','가','을','를','의','와','과','도','만','에','로','랑','들','적',
].sort((a,b)=>b.length-a.length);

const HANGUL_RUN = /[\uAC00-\uD7A3]+/gu;

/**
 * Convert a Hangul run only when the entire run can be segmented into known
 * lexical entries plus an explicit suffix inventory. This avoids converting a
 * familiar substring inside an otherwise unknown word (e.g. 한국말 → 韓國말).
 * Longest valid lexical matches win; suffixes remain in Hangul.
 */
function annotateKnownRun(run) {
  const n = run.length;
  // can[i][1]: suffix of run[i:] can be segmented when a lexical token has
  // already occurred; can[i][0]: segmentation must start with a lexical token.
  const can = Array.from({length:n+1},()=>[false,false]);
  can[n][1] = true;
  for(let i=n-1;i>=0;i--){
    for(const [word] of LEXICON){
      if(run.startsWith(word,i) && can[i+word.length][1]){
        can[i][1]=true;
        can[i][0]=true;
        break;
      }
    }
    if(!can[i][1]){
      for(const suffix of SUFFIXES){
        if(run.startsWith(suffix,i) && can[i+suffix.length][1]){
          can[i][1]=true;
          break;
        }
      }
    } else {
      // A suffix can also follow a known lexical token.
      for(const suffix of SUFFIXES){
        if(run.startsWith(suffix,i) && can[i+suffix.length][1]){
          can[i][1]=true;
          break;
        }
      }
    }
  }
  // No complete lexical segmentation: fail closed and preserve the whole run.
  if(!can[0][0]) return run;

  let i=0, seenWord=false, out='';
  while(i<n){
    const wordMatch=LEXICON.find(([word])=>run.startsWith(word,i)&&can[i+word.length][1]);
    if(wordMatch){
      out+=wordMatch[1];
      i+=wordMatch[0].length;
      seenWord=true;
      continue;
    }
    if(seenWord){
      const suffix=SUFFIXES.find((candidate)=>run.startsWith(candidate,i)&&can[i+candidate.length][1]);
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

/**
 * Annotate known Sino-Korean lexical entries in a fully segmentable Hangul
 * run. Whitespace, punctuation, non-Hangul text, and unknown runs are preserved.
 * The table is intentionally limited; homographs may still need context.
 */
export function convertHangulToHanja(input) {
  const source = String(input ?? '');
  return source.replace(HANGUL_RUN, annotateKnownRun);
}

export function getHanjaLexiconSize() {
  return LEXICON.length;
}
