import canonicalCsv from '../data/korean/canonical_correspondence.csv?raw';
import lexicalCsv from '../data/korean/lexical_pronunciations.csv?raw';
import lexicalAdditionsCsv from '../data/korean/lexical_additions_2026-10-15.csv?raw';
import ipaAdjudicationCsv from '../data/korean/lexical_additions_ipa-adjudication-2026-10-24.csv?raw';
import {createEngine} from './app/engine.js';
import {createG2pWebAdapter} from './app/g2pk_web.js';
import {traceIpaMappingDetailed} from './app/engine_ipa.js';
import {romanizeRevised} from './app/romanization.js';
import {renderSuperSoftCandidate, stripUncertaintyBrackets} from './app/super_soft_annotation.js';
import {convertHangulToHanja, createHanjaConverter} from './app/hanja.js';
import niklMasterPassage from '../tests/fixtures/nikl-all-articles-master-passage-2026-10-22.txt?raw';

// Merge base lexicon with dated additions (later rows override earlier on same key).
function mergeLexicalCsv(base, additions) {
  const baseLines = base.split(/\r?\n/);
  const additionLines = additions.split(/\r?\n/);
  const baseHeader = baseLines.find(line => line.trim()) || '';
  const additionHeader = additionLines.find(line => line.trim()) || '';
  const baseColumns = baseHeader.split(',');
  const additionColumns = additionHeader.split(',');
  if (additionColumns.length < baseColumns.length ||
      baseColumns.some((column, index) => additionColumns[index] !== column)) {
    throw new Error('Lexical additions must preserve the base CSV columns and append any new metadata columns.');
  }
  const addedColumns = additionColumns.length - baseColumns.length;
  const baseRows = baseLines.filter(line => line.trim() && line !== baseHeader)
    .map(line => line + ','.repeat(addedColumns));
  const additionRows = additionLines.filter(line => line.trim() && line !== additionHeader);
  return [additionHeader, ...baseRows, ...additionRows].join('\n');
}
const mergedLexicalCsv=mergeLexicalCsv(
  mergeLexicalCsv(lexicalCsv, lexicalAdditionsCsv),
  ipaAdjudicationCsv
);
const engine=createEngine(canonicalCsv, mergedLexicalCsv);
// Practical mode uses only the pinned JS G2P port; the merged lexical corpus
// is passed to the separate research engine above, never as a practical override.
const webEngine=createG2pWebAdapter(engine);
const softToggle=document.querySelector('#soft-morphology');
const superSoftToggle=document.querySelector('#super-soft-morphology');
const morphologyLevel=document.querySelector('#morphology-level');
const morphologyLevelValue=document.querySelector('#morphology-level-value');
const morphologyLevelGuidance=document.querySelector('#morphology-level-guidance');
const modePractical=document.querySelector('#mode-practical');
const modeResearch=document.querySelector('#mode-research');
const researchOptions=document.querySelector('#research-options');
const morphologyDescriptions=[
  {name:'Строгий',mode:'strict',description:'Лише правила з належним джерельним обґрунтуванням. Найвища обережність; невирішені випадки залишаються невизначеними.'},
  {name:'М’який',mode:'soft',description:'Додає формальні морфологічні та практичні евристики й типізований IPA-резерв для невирішених переходів. Покриття ширше, але частина результатів має низьку впевненість.'},
  {name:'Суперм’який',mode:'super-soft',description:'Розкладає склади хангиля на графеми, формує IPA й передає його до українського адаптера. Контекстні правила не вгадуються; це найширше графемне покриття з найнижчою впевненістю.'}
];
function currentMorphologyMode(){
  if(modeResearch&&modeResearch.checked){
    return morphologyDescriptions[Number(morphologyLevel?.value)||0]?.mode||'strict';
  }
  return 'practical';
}
function syncMorphologyLevel(){
  const level=Math.max(0,Math.min(2,Number(morphologyLevel?.value)||0));
  const selected=morphologyDescriptions[level];
  if(softToggle)softToggle.checked=level===1;
  if(superSoftToggle)superSoftToggle.checked=level===2;
  if(morphologyLevelValue)morphologyLevelValue.textContent=selected.name;
  if(morphologyLevelGuidance)morphologyLevelGuidance.textContent=selected.description;
  if(morphologyLevel)morphologyLevel.setAttribute('aria-valuetext',selected.name);
}
function syncModeUi(){
  if(researchOptions){
    researchOptions.hidden=!(modeResearch&&modeResearch.checked);
  }
  syncMorphologyLevel();
}
const input=document.querySelector('#source-input');
const count=document.querySelector('#character-count');
const results=document.querySelector('#results');
const empty=document.querySelector('#empty-state');
const issue=document.querySelector('#issue-state');
const issueText=document.querySelector('#issue-text');
const phonologyStatusNote=document.querySelector('#phonology-status-note');
const phonologyStatusValue=document.querySelector('#phonology-status-value');
const phonologyCoverageLabel=document.querySelector('#phonology-coverage-label');
const phonologyCoverageValue=document.querySelector('#phonology-coverage-value');
const targetStatusNote=document.querySelector('#target-status-note');
const targetStatusValue=document.querySelector('#target-status-value');
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
const ukrainianCleanCopyButton=document.querySelector('#ukrainian-clean-copy-button');
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
  if(!groups.length)return;
  if(groups.every(group=>loadedHanjaGroups.has(group))){
    if(!fullHanjaConverter)fullHanjaConverter=createHanjaConverter(loadedHanjaWordMap);
    hanjaOutput.textContent=fullHanjaConverter(value);
    return;
  }
  if(hanjaEngineStatus)hanjaEngineStatus.textContent='Завантаження локального словника з цього сайту…';
  const requestedValue=value;
  Promise.all(groups.map(loadHanjaGroup)).then(()=>{
    if(input.value!==requestedValue)return;
    fullHanjaConverter=createHanjaConverter(loadedHanjaWordMap);
    hanjaOutput.textContent=fullHanjaConverter(requestedValue);
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
let currentCandidateStatus='';
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
  if(targetStatusValue&&currentCandidateStatus==='provisional')targetStatusValue.textContent=candidateSelected?'Показано попередній кандидат, не підтверджений результат':'Доступний попередній кандидат, не підтверджений результат';
  if(ukrainianOutputLabel)ukrainianOutputLabel.textContent=candidateSelected?'Дослідницький результат':currentTargetUnconfirmed?'Достовірний варіант недоступний':'Достовірний варіант';
  if(ukrainianCopyButton){ukrainianCopyButton.hidden=currentTargetUnconfirmed&&!candidateSelected;ukrainianCopyButton.textContent=candidateSelected?'Копіювати результат':'Копіювати';}
  if(ukrainianCleanCopyButton){ukrainianCleanCopyButton.hidden=!candidateSelected||!/\\[[^\\]]+\\]/u.test(output?.textContent||'');}
}
if(uaUnconfirmedButton)uaUnconfirmedButton.addEventListener('click',()=>selectUaView('unconfirmed'));
if(uaCandidateButton)uaCandidateButton.addEventListener('click',()=>selectUaView('candidate'));
const RULE_LABELS={
  'super-soft-grapheme-fallback':'суперм’який графемний IPA-резерв · низька впевненість',
  'super-soft-orthographic-fallback':'м’який резерв: складове IPA без морфологічного припущення',
  'super-soft-practical-heuristic':'суперм’яка евристика практичного рівня · низька впевненість',
  'super-soft-morphology-heuristic':'суперм’яка морфологічна гіпотеза · низька впевненість',
  'super-soft-literal-preservation':'нескладовий знак збережено без вигаданої вимови',
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
const STATUS_LABELS={'canonical':'Нормативна базова форма','contextual':'Контекстне правило застосовано','lexical':'Словникова вимова','lexical-review':'Потребує перевірки','practical-transliteration':'Практична евристика','heuristic-low-confidence':'Низька впевненість','super-soft-grapheme-fallback':'Суперм’який графемний IPA-резерв · низька впевненість','super-soft-orthographic-fallback':'М’який резервний запис · низька впевненість','super-soft-practical-heuristic':'М’яка практична евристика · низька впевненість','super-soft-morphology-heuristic':'М’яка морфологічна гіпотеза · низька впевненість','super-soft-heuristic-coverage':'М’який режим · евристичне покриття','super-soft-maximum-coverage':'М’який режим · широке покриття','literal-preserved':'Збережено як буквальний запис','unresolved':'Не визначено'};
function describeStatus(status){return STATUS_LABELS[status]||status;}
function render(){const value=input.value;copyFeedback.hidden=true;count.textContent=`${[...value].length} символів`;if(!value){results.hidden=true;empty.hidden=false;issue.hidden=true;return;}const morphologyMode=currentMorphologyMode();const useG2p=!(modeResearch&&modeResearch.checked);const r=useG2p?webEngine.convert(value):engine.convert(value,{morphologyMode});empty.hidden=true;results.hidden=false;const candidateText=r.candidate_ukrainian??r.candidate_orthography??'';const candidateDisplayText=['soft','super-soft'].includes(morphologyMode)?renderSuperSoftCandidate(r.trace,candidateText):candidateText;const hasCandidate=Boolean(candidateText||r.target_status==='provisional');const targetUnconfirmed=hasCandidate||r.target_status==='unavailable'||r.target_status==='provisional';currentTargetUnconfirmed=targetUnconfirmed;currentCandidateStatus=r.candidate_status||'';currentConfirmedOutput=r.ukrainian||'';if(candidateValue)candidateValue.textContent=candidateDisplayText;if(candidateNote)candidateNote.textContent=['soft','super-soft'].includes(morphologyMode)?'Попередній кандидат — не підтверджений результат. У квадратних дужках [фрагмент] позначено ділянки з низькою впевненістю. Перед використанням перевірте IPA та українську адаптацію.':'Попередній кандидат — не підтверджений результат. Перед використанням перевірте IPA та українську адаптацію.';if(uaCandidateButton)uaCandidateButton.disabled=!hasCandidate;if(!hasCandidate&&selectedUaView==='candidate')selectedUaView='unconfirmed';selectUaView(selectedUaView);surfaceOutput.textContent=r.surfaceHangul||'';surfaceReading.hidden=!r.surfaceHangul;ipa.textContent=r.ipa;romanization.textContent=r.surfaceHangul?romanizeRevised(r.surfaceHangul):'—';analysis.textContent=r.analysis;renderHanja(value);const coverageLabel=['soft','super-soft'].includes(morphologyMode)&&r.coverage&&r.coverage.input_total?`покриття складів Hangul: ${Math.round(r.coverage.input_coverage*100)}% (${r.coverage.input_covered}/${r.coverage.input_total}) · облік фрагментів: ${Math.round(r.coverage.trace_coverage*100)}% · низька впевненість: ${Math.round((r.coverage.low_confidence_share??0)*100)}% (${r.coverage.low_confidence_units??0}/${r.coverage.input_total})`:'';
const modeLabel=useG2p?'Звичайний режим':`Дослідницький режим · ${morphologyDescriptions.find(item=>item.mode===morphologyMode)?.name||'Строгий'} рівень`;
const pronunciationLabel=r.status==='super-soft-grapheme-fallback'?'графемний IPA-кандидат':r.status==='super-soft-orthographic-fallback'?'резервна вимова низької впевненості':r.status==='super-soft-heuristic-coverage'?'евристичний результат низької впевненості':r.status==='super-soft-maximum-coverage'?'широке покриття':r.status==='canonical'?'канонічна форма':r.status==='contextual'?'контекстну вимову застосовано':r.status==='lexical'?'словникову вимову застосовано':r.status==='lexical-review'?'словникову вимову; український запис попередній':r.status==='practical-transliteration'?'практична транслітерація (нижча точність)':r.status==='heuristic-low-confidence'?'евристична вимова (низька впевненість)':'є невизначені ділянки';
phonologyStatusValue.textContent=`${modeLabel} · ${useG2p?'g2pK':'Козак Кім'} · ${pronunciationLabel}${r.candidate_status==='super-soft-low-confidence'?' · є резервні читання низької впевненості':''}`;
phonologyCoverageLabel.hidden=!coverageLabel;
phonologyCoverageValue.hidden=!coverageLabel;
phonologyCoverageValue.textContent=coverageLabel;
targetStatusNote.hidden=!(r.candidate_status==='provisional'||r.candidate_status==='super-soft-low-confidence'||r.target_status==='unavailable'||r.target_status==='model-selected');
targetStatusValue.textContent=r.candidate_status==='provisional'?(selectedUaView==='candidate'?'Показано попередній кандидат, не підтверджений результат':'Доступний попередній кандидат, не підтверджений результат'):r.candidate_status==='super-soft-low-confidence'?(candidateText?'Український кандидат містить резервні читання низької впевненості':'Український запис недоступний; резервні читання мають низьку впевненість'):r.target_status==='model-selected'?'Український запис за проєктними відповідностями; незалежно не валідований':r.target_status==='unavailable'?'Український запис недоступний':'';issue.hidden=!r.issues.length;issueText.textContent=r.issues.join(' ');variantList.textContent='';const variants=r.variants||[];variantPanel.hidden=variants.length===0;for(const v of variants){const row=document.createElement('div');row.className='trace-row';const source=document.createElement('span');source.className='trace-source';source.dataset.label='Варіант · джерело';source.textContent=`${v.source||value} → ${v.surface}`;const out=document.createElement('span');out.className='trace-output';out.dataset.label='Український варіант';out.textContent=v.ukrainian;const details=document.createElement('span');details.className='trace-ipa';details.dataset.label='IPA та примітка';details.textContent=`IPA: ${v.ipa}${v.note?' · '+v.note:''}`;const state=document.createElement('span');state.className=`trace-status ${v.status}`;state.dataset.label='Статус';state.textContent=v.note&&v.note.includes('§4')?'нормативний варіант вимови; український запис може збігатися':v.status==='lexical-review'?'український запис попередній':'словниковий варіант';row.append(source,out,details,state);variantList.append(row);}traceList.textContent='';for(const t of r.trace){if(t.status==='literal')continue;const row=document.createElement('div');row.className='trace-row';const source=document.createElement('span');source.className='trace-source';source.dataset.label='Корейський сегмент · вхід';source.textContent=t.source;source.title='Початковий корейський склад';const surface=document.createElement('span');surface.className='trace-surface';surface.dataset.label='Корейська вимова';surface.textContent=t.surface||t.source;surface.title='Склад після застосування правил вимови';const ipaValue=document.createElement('span');ipaValue.className='trace-ipa';ipaValue.dataset.label='IPA';ipaValue.textContent=t.ipa||'—';ipaValue.title='IPA — єдине джерело для українського відповідника';const mapping=document.createElement('span');mapping.className='trace-mapping';mapping.dataset.label='IPA-токени → українські графеми';const mappingResult=traceIpaMappingDetailed(t.ipa||'');const tokenTrace=mappingResult.tokens.map(token=>token.ipa+' → '+token.ukrainian+' ['+token.mapping_id+'; '+token.status+']').join(' · ');const featureTrace=(mappingResult.features||[]).map(feature=>feature.ipa+' — '+feature.note).join(' · ');const targetStatusNote=mappingResult.status==='provisional'?'цільова відповідність попередня':mappingResult.status==='unavailable'?'відповідність недоступна':'відповідність задана проєктом';mapping.textContent=[tokenTrace,featureTrace,targetStatusNote].filter(Boolean).join(' · ')||'—';mapping.title='Відображення IPA-токенів і явний облік ознак, які не мають окремого позначення в українському записі';const out=document.createElement('span');out.className='trace-output';out.dataset.label='Український запис';out.textContent=t.candidateStatus==='provisional'?'Кандидат: '+(t.candidateOutput||''):t.output||'∅';out.title=t.candidateStatus==='provisional'?'Попередній кандидат; не підтверджений український запис':'Повний український відповідник, складений з IPA-токенів';const rules=document.createElement('span');rules.className='trace-rules';rules.dataset.label='Нюанс / правило';const ruleNames=(t.rules||[]).map(describeRule);rules.textContent=ruleNames.length?ruleNames.join(' · '):'без контекстної зміни';rules.title=(t.rules||[]).join(' | ')||'Канонічне відображення IPA';const state=document.createElement('span');state.className='trace-status '+t.status;state.dataset.label='Статус';state.textContent=describeStatus(t.status);state.title='Технічний статус: '+t.status;row.append(source,surface,ipaValue,mapping,out,rules,state);traceList.append(row);}const spokenOutput=targetUnconfirmed?(hasCandidate&&candidateText?'Дослідницький результат: '+candidateDisplayText:'Достовірний варіант не підтверджено.'):('Достовірний варіант: '+(r.ukrainian||'немає результату'));const announcement=(r.issues.length?'Обробку завершено з попередженнями. ':'Обробку завершено. ')+spokenOutput;announceResult(announcement.slice(0,220));}

if(morphologyLevel)morphologyLevel.addEventListener('input',()=>{syncMorphologyLevel();render();});
if(modePractical)modePractical.addEventListener('change',()=>{syncModeUi();render();});
if(modeResearch)modeResearch.addEventListener('change',()=>{syncModeUi();render();});
syncModeUi();
input.addEventListener('input',render);
document.querySelector('#clear-button').addEventListener('click',()=>{input.value='';render();input.focus();});
document.querySelector('#example-button').addEventListener('click',()=>{render();input.focus();});
document.querySelector('#nikl-stress-example').addEventListener('click',()=>{input.value=niklMasterPassage.trim();render();input.focus();});
for(const button of document.querySelectorAll('[data-example]'))button.addEventListener('click',()=>{input.value=button.dataset.example;render();input.focus();});
for(const button of document.querySelectorAll('[data-copy]'))button.addEventListener('click',async()=>{
  clearTimeout(announcementTimer);
  const key=button.dataset.copy;
  const cleanUkrainian=key==='ukrainian-clean';
  const source=key==='ukrainian'||cleanUkrainian?output:key==='ipa'?ipa:key==='romanization'?romanization:key==='hanja'?hanjaOutput:analysis;
  const copyValue=cleanUkrainian?stripUncertaintyBrackets(source.textContent):source.textContent;
  try{
    if(!navigator.clipboard?.writeText)throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(copyValue);
    button.textContent='Скопійовано';
    setCopyFeedback(cleanUkrainian?'Результат скопійовано без квадратних дужок.':'Результат скопійовано.');
    setTimeout(()=>button.textContent=cleanUkrainian?'Копіювати без дужок':cleanUkrainianCopyButton===button?'Копіювати без дужок':'Копіювати',1200);
  }catch{
    if(cleanUkrainian){
      const temporary=document.createElement('textarea');
      temporary.value=copyValue;
      temporary.setAttribute('readonly','');
      temporary.style.position='fixed';
      temporary.style.opacity='0';
      document.body.append(temporary);
      temporary.focus();
      temporary.select();
      setCopyFeedback('Текст без квадратних дужок виділено: натисніть Ctrl+C або скористайтеся командою копіювання пристрою.');
      temporary.addEventListener('blur',()=>temporary.remove(),{once:true});
    }else{
      const selection=window.getSelection();
      const range=document.createRange();
      range.selectNodeContents(source);
      selection?.removeAllRanges();
      selection?.addRange(range);
      source.setAttribute('tabindex','-1');
      source.focus();
      setCopyFeedback('Автоматичне копіювання недоступне. Текст виділено: натисніть Ctrl+C або скористайтеся командою копіювання пристрою.');
    }
  }
});

render();
