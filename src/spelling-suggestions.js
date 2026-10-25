/**
 * Explicit spelling/tokenization candidates for a small, evidence-backed
 * set of known noisy inputs. Suggestions never rewrite input automatically.
 */
export function getSpellingSuggestions(value) {
  const input = String(value ?? '').normalize('NFC');
  const candidates = {
    '쫒아내면': [
      { text: '쫓아내면', label: 'Ймовірне виправлення написання', reason: 'Кандидат від стандартного 쫓아내다; вимова стосується лише вибраної форми.' }
    ],
    '무서웟어': [
      { text: '무서웠어', label: 'Ймовірне виправлення написання', reason: 'Кандидат стандартного написання; вихідний текст не переписується автоматично.' }
    ],
    '많앗구나유유유': [
      { text: '많았구나유유유', label: 'Варіант A · лише орфографія', reason: 'Виправляє 앗 → 았, залишаючи 유유유 буквальним текстом.' },
      { text: '많았구나 ㅠㅠㅠ', label: 'Варіант B · емоційний знак', reason: 'Припускає, що ㅠㅠㅠ означає плач; не підтверджено без контексту.' },
      { text: '많앗구나 유유유', label: 'Варіант C · межа токенів', reason: 'Лише гіпотеза про пробіл; написання 앗 лишається незвичним.' }
    ]
  };
  return (candidates[input] || []).map(candidate => ({
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
