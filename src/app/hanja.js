// Deterministic Hangul→Hanja lexical annotator.
// This is an intentionally small, hand-curated vocabulary, not a complete Hanja
// dictionary or a morphological analyzer. Unknown text is preserved verbatim.
const LEXICON = [
  ['민주주의','民主主義'], ['대한민국','大韓民國'], ['대통령','大統領'],
  ['한국어','韓國語'], ['한국인','韓國人'], ['한국','韓國'],
  ['경제학','經濟學'], ['경제','經濟'], ['발전','發展'],
  ['정부','政府'], ['국가','國家'], ['국민','國民'],
  ['사회','社會'], ['문화','文化'], ['역사','歷史'], ['정치','政治'],
  ['교육','敎育'], ['학생','學生'], ['학교','學校'], ['대학생','大學生'], ['대학','大學'],
  ['과학','科學'], ['기술','技術'], ['정보','情報'], ['전화','電話'],
  ['자동차','自動車'], ['회사','會社'], ['기업','企業'], ['노동','勞動'],
  ['법률','法律'], ['법','法'], ['자유','自由'], ['평화','平和'],
  ['세계','世界'], ['중국','中國'], ['일본','日本'], ['미국','美國'],
  ['시간','時間'], ['문제','問題'], ['방법','方法'], ['결과','結果'],
  ['연구','硏究'], ['언어','言語'], ['문학','文學'], ['예술','藝術'],
  ['음악','音樂'], ['운동','運動'], ['건강','健康'], ['병원','病院'],
  ['의사','醫師'], ['식사','食事'], ['음식','飮食'], ['전통','傳統'],
  ['환경','環境'], ['자연','自然'], ['역할','役割'], ['관계','關係'],
  ['공부','工夫'], ['학생들','學生들'], ['선생','先生'], ['선생님','先生님'],
].sort((a,b)=>b[0].length-a[0].length);

const HANGUL_RUN = /[\uAC00-\uD7A3]+/gu;

/**
 * Annotate only exact known lexical strings in Hangul runs.
 * The algorithm is deterministic longest-match scanning. It preserves all
 * whitespace, punctuation, particles, endings and unknown spans as written.
 * Because this initial version has no full morphological analyzer, a known
 * substring inside an unknown compound may still be annotated; UI labels it
 * as a limited dictionary preview.
 */
export function convertHangulToHanja(input) {
  const source = String(input ?? '');
  return source.replace(HANGUL_RUN, (run) => {
    let out = '';
    let i = 0;
    while (i < run.length) {
      const match = LEXICON.find(([hangul]) => run.startsWith(hangul, i));
      if (match) {
        out += match[1];
        i += match[0].length;
      } else {
        out += run[i];
        i += 1;
      }
    }
    return out;
  });
}

export function getHanjaLexiconSize() {
  return LEXICON.length;
}
