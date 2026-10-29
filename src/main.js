import canonicalCsv from '../data/korean/canonical_correspondence.csv?raw';
import lexicalCsv from '../data/korean/lexical_pronunciations.csv?raw';
import lexicalAdditionsCsv from '../data/korean/lexical_additions_2026-10-15.csv?raw';
import {createEngine} from './app/engine.js';
import {createG2pWebAdapter} from './app/g2pk_web.js';
import {traceIpaMappingDetailed} from './app/engine_ipa.js';
import {romanizeRevised} from './app/romanization.js';
import {convertHangulToHanja, createHanjaConverter} from './app/hanja.js';
import niklMasterPassage from '../tests/fixtures/nikl-all-articles-master-passage-2026-10-22.txt?raw';

// Merge base lexicon with dated additions (later rows override earlier on same key).
function mergeLexicalCsv(base, additions) {
  const header = (base.split(/\r?\n/).find(l => l.trim()) || '');
  const body = (s) => s.split(/\r?\n/).filter(l => l.trim() && !l.startsWith('input,'));
  return [header, ...body(base), ...body(additions)].join('\n');
}
const mergedLexicalCsv=mergeLexicalCsv(lexicalCsv, lexicalAdditionsCsv);
const engine=createEngine(canonicalCsv, mergedLexicalCsv);
// Practical mode uses only the pinned JS G2P port; the merged lexical corpus
// is passed to the separate research engine above, never as a practical override.
const webEngine=createG2pWebAdapter(engine);
const softToggle=document.querySelector('#soft-morphology');
const modePractical=document.querySelector('#mode-practical');
const modeResearch=document.querySelector('#mode-research');
const researchOptions=document.querySelector('#research-options');
function currentMorphologyMode(){
  if(modeResearch&&modeResearch.checked){
    return softToggle&&softToggle.checked?'soft':'strict';
  }
  return 'practical';
}
function syncModeUi(){
  if(researchOptions){
    researchOptions.hidden=!(modeResearch&&modeResearch.checked);
  }
}
const input=document.querySelector('#source-input');
const count=document.querySelector('#character-count');
const results=document.querySelector('#results');
const empty=document.querySelector('#empty-state');
const issue=document.querySelector('#issue-state');
const issueText=document.querySelector('#issue-text');
const statusNote=document.querySelector('#status-note');
const live=document.querySelector('#live-region');
const copyFeedback=document.querySelector('#copy-feedback');
let announcementTimer=0;
function announceResult(message){clearTimeout(announcementTimer);live.textContent='';announcementTimer=setTimeout(()=>{live.textContent=message;},300);}
function setCopyFeedback(message){copyFeedback.textContent=message;copyFeedback.hidden=false;live.textContent=message;}
const output=document.querySelector('#result-ukrainian');
const candidateNote=document.querySelector('#candidate-note');
const candidateValue=document.querySelector('#candidate-value');
const ukrainianOutputLabel=document.querySelector('#ukrainian-output-label');
const ukrainianCopyButton=document.querySelector('#ukrainian-copy-button');
const surfaceReading=document.querySelector('#surface-reading');
const surfaceOutput=document.querySelector('#result-surface');
const ipa=document.querySelector('#result-ipa');
const romanization=document.querySelector('#result-romanization');
const hanjaOutput=document.querySelector('#result-hanja');
const hanjaEngineStatus=document.querySelector('#hanja-engine-status');
const hanjaDictionaryChunks=import.meta.glob('./app/hanja-dictionary/hanja-dictionary-*.js');
const loadedHanjaWordMap=new Map();
const loadedHanjaGroups=new Set();
const failedHanjaGroups=new Set();
const hanjaDictionaryLoads=new Map();
let loadedHanjaReadings=0;
let fullHanjaConverter=null;
function hanjaGroupsForText(value){
  const groups=new Set();
  for(const char of value){
    const code=char.codePointAt(0);
    if(code>=0xAC00&&code<=0xD7A3)groups.add(Math.floor((code-0xAC00)/588));
  }
  return [...groups].sort((a,b)=>a-b);
}
function loadHanjaGroup(group){
  if(loadedHanjaGroups.has(group))return Promise.resolve(true);
  if(hanjaDictionaryLoads.has(group))return hanjaDictionaryLoads.get(group);
  const filename='./app/hanja-dictionary/hanja-dictionary-'+String(group).padStart(2,'0')+'.js';
  const loader=hanjaDictionaryChunks[filename];
  if(!loader){
    failedHanjaGroups.add(group);
    if(hanjaEngineStatus)hanjaEngineStatus.textContent='Частина локального словника недоступна; використовується базовий';
    return Promise.resolve(false);
  }
  const promise=loader().then((data)=>{
    for(const line of data.HANJA_WORD_DATA.split(/\r?\n/u)){
      if(!line)continue;
      const separator=line.indexOf(':');
      if(separator<=0||separator===line.length-1)continue;
      loadedHanjaWordMap.set(line.slice(0,separator),line.slice(separator+1));
    }
    loadedHanjaGroups.add(group);
    failedHanjaGroups.delete(group);
    loadedHanjaReadings+=data.HANJA_DICTIONARY_METADATA.wordReadingCount;
    fullHanjaConverter=createHanjaConverter(loadedHanjaWordMap);
    return true;
  }).catch((error)=>{
    hanjaDictionaryLoads.delete(group);
    failedHanjaGroups.add(group);
    if(hanjaEngineStatus)hanjaEngineStatus.textContent='Частина локального словника недоступна; використовується базовий';
    console.error('Could not load a same-origin Hanja dictionary chunk.',error);
    return false;
  });
  hanjaDictionaryLoads.set(group,promise);
  return promise;
}
function renderHanja(value){
  if(!hanjaOutput)return;
  hanjaOutput.textContent=(fullHanjaConverter||convertHangulToHanja)(value);
  const groups=hanjaGroupsForText(value);
  if(!groups.length||groups.every(group=>loadedHanjaGroups.has(group)))return;
  if(hanjaEngineStatus)hanjaEngineStatus.textContent='Завантаження локального словника з цього сайту…';
  const requestedValue=value;
  Promise.all(groups.map(loadHanjaGroup)).then(()=>{
    if(input.value!==requestedValue)return;
    hanjaOutput.textContent=(fullHanjaConverter||convertHangulToHanja)(requestedValue);
    if(hanjaEngineStatus){
      hanjaEngineStatus.textContent=failedHanjaGroups.size
        ?'Частковий локальний словник: '+loadedHanjaReadings+' словникових читань'
        :'Локальний словник: '+loadedHanjaReadings+' словникових читань';
    }
  });
}

const analysis=document.querySelector('#result-analysis');
const traceList=document.querySelector('#trace-list');
const variantPanel=document.querySelector('#variant-panel');
const variantList=document.querySelector('#variant-list');
const uaUnconfirmedButton=document.querySelector('#ua-unconfirmed-button');
const uaCandidateButton=document.querySelector('#ua-candidate-button');
let selectedUaView='unconfirmed';
let currentConfirmedOutput='';
let currentTargetUnconfirmed=true;
function selectUaView(view){
  selectedUaView=view==='candidate'?'candidate':'unconfirmed';
  const candidateSelected=selectedUaView==='candidate';
  if(uaUnconfirmedButton){
    uaUnconfirmedButton.classList.toggle('is-active',!candidateSelected);
    uaUnconfirmedButton.setAttribute('aria-pressed',String(!candidateSelected));
  }
  if(uaCandidateButton){
    uaCandidateButton.classList.toggle('is-active',candidateSelected);
    uaCandidateButton.setAttribute('aria-pressed',String(candidateSelected));
    uaCandidateButton.disabled=!candidateValue?.textContent;
  }
  // Both options use the same visible result field. Never hide the field when
  // switching to a candidate: candidateValue is only hidden storage.
  if(output){
    output.hidden=false;
    output.textContent=candidateSelected?(candidateValue?.textContent||'Дослідницький результат недоступний'):(currentTargetUnconfirmed?'Немає підтвердженого запису':currentConfirmedOutput);
    output.classList.toggle('result-unconfirmed',currentTargetUnconfirmed&&!candidateSelected);
  }
  if(candidateNote)candidateNote.hidden=!candidateSelected||!candidateValue?.textContent;
  if(ukrainianOutputLabel)ukrainianOutputLabel.textContent=candidateSelected?'Дослідницький результат':currentTargetUnconfirmed?'Достовірний варіант недоступний':'Достовірний варіант';
  if(ukrainianCopyButton){ukrainianCopyButton.hidden=currentTargetUnconfirmed&&!candidateSelected;ukrainianCopyButton.textContent=candidateSelected?'Копіювати результат':'Копіювати';}
}
if(uaUnconfirmedButton)uaUnconfirmedButton.addEventListener('click',()=>selectUaView('unconfirmed'));
if(uaCandidateButton)uaCandidateButton.addEventListener('click',()=>selectUaView('candidate'));
const RULE_LABELS={
  'g2pk-js-surface-realization':'g2pK: нормативна поверхнева реалізація',
  'contextual-voicing':'контекстне озвончення ㄱ/ㄷ/ㅂ/ㅈ',
  'tensification':'напруження початкового приголосного',
  'liquid-assimilation':'асиміляція ㄴ/ㄹ',
  'vowel-ui-to-i':'ㅢ → ㅣ у відповідному контексті',
  'vowel-ui-default-ɰi':'ㅢ з вимовою /ɰi/',
  'saisiot-n-insertion-§30(3)-requires-lexical-compound':'NIKL §30(3): вставка ㄴㄴ залежить від конкретної сполуки',
  'sourced-lexical-ipa':'IPA підтверджено словниковим джерелом',
  'ipa-to-ukrainian-unmapped-segment':'немає українського відповідника для сегмента IPA'
};
function describeRule(rule){return RULE_LABELS[rule]||rule.replaceAll('-',' ');}
const STATUS_LABELS={'canonical':'Нормативна базова форма','contextual':'Контекстне правило застосовано','lexical':'Словникова вимова','lexical-review':'Потребує перевірки','practical-transliteration':'Практична евристика','heuristic-low-confidence':'Низька впевненість','unresolved':'Не визначено'};
function describeStatus(status){return STATUS_LABELS[status]||status;}
function render(){const value=input.value;copyFeedback.hidden=true;count.textContent=`${[...value].length} символів`;if(!value){results.hidden=true;empty.hidden=false;issue.hidden=true;return;}const morphologyMode=currentMorphologyMode();const useG2p=!(modeResearch&&modeResearch.checked);const r=useG2p?webEngine.convert(value):engine.convert(value,{morphologyMode});empty.hidden=true;results.hidden=false;const candidateText=r.candidate_ukrainian??r.candidate_orthography??'';const hasCandidate=Boolean(candidateText||r.target_status==='provisional');const targetUnconfirmed=hasCandidate||r.target_status==='unavailable'||r.target_status==='provisional';currentTargetUnconfirmed=targetUnconfirmed;currentConfirmedOutput=r.ukrainian||'';if(candidateValue)candidateValue.textContent=candidateText;if(uaCandidateButton)uaCandidateButton.disabled=!hasCandidate;if(!hasCandidate&&selectedUaView==='candidate')selectedUaView='unconfirmed';selectUaView(selectedUaView);surfaceOutput.textContent=r.surfaceHangul||'';surfaceReading.hidden=!r.surfaceHangul;ipa.textContent=r.ipa;romanization.textContent=r.surfaceHangul?romanizeRevised(r.surfaceHangul):'—';analysis.textContent=r.analysis;renderHanja(value);statusNote.textContent=(useG2p?'g2pK JS · ':'Native research · ')+(r.status==='canonical'?'Канонічна форма':r.status==='contextual'?'Контекстну вимову застосовано':r.status==='lexical'?'Словникова вимова застосована':r.status==='lexical-review'?'Вимова словникова; український запис попередній':r.status==='practical-transliteration'?'Практична транслітерація (нижча точність)':r.status==='heuristic-low-confidence'?'М’яка морфологія (низька впевненість); не NIKL-сертифіковано':'Є невизначені ділянки')+(r.candidate_status==='provisional'?' · Показано попередній кандидат, не підтверджений результат':r.target_status==='unavailable'?' · Український запис недоступний':r.target_status==='model-selected'?' · Український запис за проєктними відповідностями; незалежно не валідований':'');issue.hidden=!r.issues.length;issueText.textContent=r.issues.join(' ');variantList.textContent='';const variants=r.variants||[];variantPanel.hidden=variants.length===0;for(const v of variants){const row=document.createElement('div');row.className='trace-row';const source=document.createElement('span');source.className='trace-source';source.dataset.label='Варіант · джерело';source.textContent=`${v.source||value} → ${v.surface}`;const out=document.createElement('span');out.className='trace-output';out.dataset.label='Український варіант';out.textContent=v.ukrainian;const details=document.createElement('span');details.className='trace-ipa';details.dataset.label='IPA та примітка';details.textContent=`IPA: ${v.ipa}${v.note?' · '+v.note:''}`;const state=document.createElement('span');state.className=`trace-status ${v.status}`;state.dataset.label='Статус';state.textContent=v.note&&v.note.includes('§4')?'нормативний варіант вимови; український запис може збігатися':v.status==='lexical-review'?'український запис попередній':'словниковий варіант';row.append(source,out,details,state);variantList.append(row);}traceList.textContent='';for(const t of r.trace){if(t.status==='literal')continue;const row=document.createElement('div');row.className='trace-row';const source=document.createElement('span');source.className='trace-source';source.dataset.label='Корейський сегмент · вхід';source.textContent=t.source;source.title='Початковий корейський склад';const surface=document.createElement('span');surface.className='trace-surface';surface.dataset.label='Корейська вимова';surface.textContent=t.surface||t.source;surface.title='Склад після застосування правил вимови';const ipaValue=document.createElement('span');ipaValue.className='trace-ipa';ipaValue.dataset.label='IPA';ipaValue.textContent=t.ipa||'—';ipaValue.title='IPA — єдине джерело для українського відповідника';const mapping=document.createElement('span');mapping.className='trace-mapping';mapping.dataset.label='IPA-токени → українські графеми';const mappingResult=traceIpaMappingDetailed(t.ipa||'');const tokenTrace=mappingResult.tokens.map(token=>token.ipa+' → '+token.ukrainian+' ['+token.mapping_id+'; '+token.status+']').join(' · ');const featureTrace=(mappingResult.features||[]).map(feature=>feature.ipa+' — '+feature.note).join(' · ');const targetStatusNote=mappingResult.status==='provisional'?'цільова відповідність попередня':mappingResult.status==='unavailable'?'відповідність недоступна':'відповідність задана проєктом';mapping.textContent=[tokenTrace,featureTrace,targetStatusNote].filter(Boolean).join(' · ')||'—';mapping.title='Відображення IPA-токенів і явний облік ознак, які не мають окремого позначення в українському записі';const out=document.createElement('span');out.className='trace-output';out.dataset.label='Український запис';out.textContent=t.candidateStatus==='provisional'?'Кандидат: '+(t.candidateOutput||''):t.output||'∅';out.title=t.candidateStatus==='provisional'?'Попередній кандидат; не підтверджений український запис':'Повний український відповідник, складений з IPA-токенів';const rules=document.createElement('span');rules.className='trace-rules';rules.dataset.label='Нюанс / правило';const ruleNames=(t.rules||[]).map(describeRule);rules.textContent=ruleNames.length?ruleNames.join(' · '):'без контекстної зміни';rules.title=(t.rules||[]).join(' | ')||'Канонічне відображення IPA';const state=document.createElement('span');state.className='trace-status '+t.status;state.dataset.label='Статус';state.textContent=describeStatus(t.status);state.title='Технічний статус: '+t.status;row.append(source,surface,ipaValue,mapping,out,rules,state);traceList.append(row);}const spokenOutput=targetUnconfirmed?(hasCandidate&&candidateText?'Дослідницький результат: '+candidateText:'Достовірний варіант не підтверджено.'):('Достовірний варіант: '+(r.ukrainian||'немає результату'));const announcement=(r.issues.length?'Обробку завершено з попередженнями. ':'Обробку завершено. ')+spokenOutput;announceResult(announcement.slice(0,220));}

if(softToggle)softToggle.addEventListener('change',render);
if(modePractical)modePractical.addEventListener('change',()=>{syncModeUi();render();});
if(modeResearch)modeResearch.addEventListener('change',()=>{syncModeUi();render();});
syncModeUi();
input.addEventListener('input',render);
document.querySelector('#clear-button').addEventListener('click',()=>{input.value='';render();input.focus();});
document.querySelector('#example-button').addEventListener('click',()=>{input.value='현대 한국어의 표준 발음';render();input.focus();});
document.querySelector('#nikl-stress-example').addEventListener('click',()=>{input.value=niklMasterPassage.trim();render();input.focus();});
for(const button of document.querySelectorAll('[data-example]'))button.addEventListener('click',()=>{input.value=button.dataset.example;render();input.focus();});
for(const button of document.querySelectorAll('[data-copy]'))button.addEventListener('click',async()=>{clearTimeout(announcementTimer);const key=button.dataset.copy;const source=key==='ukrainian'?output:key==='ipa'?ipa:key==='romanization'?romanization:key==='hanja'?hanjaOutput:analysis;try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard API unavailable');await navigator.clipboard.writeText(source.textContent);button.textContent='Скопійовано';setCopyFeedback('Результат скопійовано.');setTimeout(()=>button.textContent='Копіювати',1200);}catch{const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(source);selection?.removeAllRanges();selection?.addRange(range);source.setAttribute('tabindex','-1');source.focus();setCopyFeedback('Автоматичне копіювання недоступне. Текст виділено: натисніть Ctrl+C або скористайтеся командою копіювання пристрою.');}});

render();
