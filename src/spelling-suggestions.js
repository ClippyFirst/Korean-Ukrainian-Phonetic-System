/**
 * Explicit spelling/tokenization candidates for a small, evidence-backed
 * set of known noisy inputs. Suggestions never rewrite input automatically.
 */
export function getSpellingSuggestions(value) {
  const input = String(value ?? '').normalize('NFC');
  const candidates = {
    '칡칡이': [
      { text: '칭칭이', label: 'Можлива корекція транскрипції джерела', reason: 'Пошуковий фрагмент PDF показує 칡칡이, але текстовий шар відповідної сторінки читається як 칭칭이 і узгоджується з приспівом 칭칭나네. Це лише кандидат: візуальне звірення сторінки ще потрібне.', sources: [{ label: 'PDF: 동부산 문화권 민요(Ⅱ)', url: 'https://www.busandabom.net/data/history/ebook/EB_culture_song02.pdf' }] }
    ],
    '쫒아내면': [
      { text: '쫓아내면', label: 'Ймовірне виправлення написання', reason: 'Кандидат від стандартного 쫓아내다; вимова стосується лише вибраної форми.', sources: [{ label: 'Корейський базовий словник', url: 'https://krdict.korean.go.kr/m/eng/dicSearch/SearchView?ParaWordNo=78895&currentPage=2&exaType=&font_size=12&mainSearchWord=%EB%82%B4%EB%8B%A4&nation=eng&nationCode=6&proverbType=&searchType=W&sort=W&viewType=A&wordMatchFlag=N' }] }
    ],
    '무서웟어': [
      { text: '무서웠어', label: 'Ймовірне виправлення написання', reason: 'Кандидат стандартного написання; вихідний текст не переписується автоматично.', sources: [{ label: 'Корейський базовий словник', url: 'https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=79798' }] }
    ],
    '많앗구나유유유': [
      { text: '많았구나유유유', label: 'Варіант A · лише орфографія', reason: 'Виправляє 앗 → 았, залишаючи 유유유 буквальним текстом.', sources: [{ label: 'NIKL: написання', url: 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=316156' }] },
      { text: '많았구나 ㅠㅠㅠ', label: 'Варіант B · емоційний знак', reason: 'Припускає, що ㅠㅠㅠ означає плач; не підтверджено без контексту.', sources: [{ label: 'NIKL: написання', url: 'https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=316156' }, { label: 'Приклад уживання ㅠㅠㅠ та 유유유', url: 'https://v.daum.net/v/JU0MXB4lYJ' }] },
      { text: '많앗구나 유유유', label: 'Варіант C · межа токенів', reason: 'Лише гіпотеза про пробіл; написання 앗 лишається незвичним.', sources: [{ label: 'Приклад уживання 유유유', url: 'https://v.daum.net/v/JU0MXB4lYJ' }] }
    ]
  };
  const matches = Object.hasOwn(candidates, input) ? candidates[input] : [];
  return matches.map(candidate => ({
    ...candidate,
    sourceInput: input,
    kind: 'candidate-only',
    autoApplied: false
  }));
}

const input = typeof document !== 'undefined' ? document.querySelector('#source-input') : null;
const panel = typeof document !== 'undefined' ? document.querySelector('#spelling-suggestions') : null;
const list = typeof document !== 'undefined' ? document.querySelector('#spelling-suggestions-list') : null;

function renderSuggestions() {
  if (!input || !panel || !list) return;
  const suggestions = getSpellingSuggestions(input.value);
  list.replaceChildren();
  panel.hidden = suggestions.length === 0;
  for (const suggestion of suggestions) {
    const item = document.createElement('article');
    item.className = 'spelling-suggestion';
    const details = document.createElement('div');
    details.className = 'spelling-suggestion-copy';
    const title = document.createElement('strong');
    title.textContent = suggestion.text;
    title.lang = 'ko';
    const label = document.createElement('span');
    label.className = 'spelling-suggestion-label';
    label.textContent = suggestion.label;
    const reason = document.createElement('p');
    reason.textContent = suggestion.reason;
    details.append(title, label, reason);
    if (Array.isArray(suggestion.sources) && suggestion.sources.length) {
      const sources = document.createElement('div');
      sources.className = 'spelling-suggestion-sources';
      for (const source of suggestion.sources) {
        const link = document.createElement('a');
        link.href = source.url;
        link.target = '_blank';
        link.rel = 'noreferrer';
        link.textContent = source.label;
        sources.append(link);
      }
      details.append(sources);
    }
    const choose = document.createElement('button');
    choose.type = 'button';
    choose.className = 'button button-secondary spelling-suggestion-choose';
    choose.textContent = 'Використати цей варіант';
    choose.addEventListener('click', () => {
      // Explicit user action only: no silent normalization.
      input.value = suggestion.text;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    });
    item.append(details, choose);
    list.append(item);
  }
}

if (input && panel && list) {
  input.addEventListener('input', renderSuggestions);
  renderSuggestions();
}
