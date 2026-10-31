import canonicalCsv from '../data/korean/canonical_correspondence.csv?raw';
import lexicalCsv from '../data/korean/lexical_pronunciations.csv?raw';
import lexicalAdditionsCsv from '../data/korean/lexical_additions_2026-10-15.csv?raw';
import {createEngine} from './app/engine.js';
import {createG2pWebAdapter} from './app/g2pk_web.js';
import {traceIpaMappingDetailed} from './app/engine_ipa.js';
import {renderPhonemicIpa} from './app/ipa_phonemic.js';
import {romanizeRevised} from './app/romanization.js';
import rrUkrainianCsv from '../data/korean/rr_ukrainian_correspondence.csv?raw';
import rrUkrainianContextRulesCsv from '../data/korean/rr_ukrainian_context_rules.csv?raw';
import {createRomanizationTarget} from './app/romanization_target.js';
import {renderSuperSoftCandidate} from './app/super_soft_annotation.js';
import {convertHangulToHanja, createHanjaConverter, createHanjaToHangulConverter} from './app/hanja.js';
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
const transcribeRevisedToUkrainian=createRomanizationTarget(rrUkrainianCsv,rrUkrainianContextRulesCsv);
const softToggle=document.querySelector('#soft-morphology');
const superSoftToggle=document.querySelector('#super-soft-morphology');
const modePractical=document.querySelector('#mode-practical');
const modeResearch=document.querySelector('#mode-research');
const modeRomanization=document.querySelector('#mode-romanization');
const researchOptions=document.querySelector('#research-options');
function currentMorphologyMode(){
  if(modeResearch&&modeResearch.checked){
    return superSoftToggle&&superSoftToggle.checked?'super-soft':softToggle&&softToggle.checked?'soft':'strict';
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
const ipaPhonemic=document.querySelector('#result-ipa-phonemic');
const ipaPhonemicStatus=document.querySelector('#ipa-phonemic-status');
const romanization=document.querySelector('#result-romanization');
const hanjaOutput=document.querySelector('#result-hanja');
const hanjaEngineStatus=document.querySelector('#hanja-engine-status');
const hanjaInput=document.querySelector('#hanja-input');
const hanjaReadingOutput=document.querySelector('#hanja-reading-output');
const hanjaReadingStatus=document.querySelector('#hanja-reading-status');
const hanjaUseReading=document.querySelector('#hanja-use-reading');
let hanjaReverseGeneration=0;
let hanjaReverseNeedsManualResolution=false;
let hanjaReverseSuggestedText='';
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

function renderHanjaReverse(){
  if(!hanjaInput||!hanjaReadingOutput||!hanjaReadingStatus)return;
  const source=hanjaInput.value;
  const generation=++hanjaReverseGeneration;
  if(!source.trim()){
    hanjaReadingOutput.value='';
    hanjaReadingStatus.textContent='Введіть Hanja або змішаний текст для пошуку корейського читання.';
    hanjaReverseNeedsManualResolution=false;
    hanjaReverseSuggestedText='';
    if(hanjaUseReading)hanjaUseReading.disabled=true;
    return;
  }
  hanjaReadingStatus.textContent='Завантаження локального словника для зворотного пошуку…';
  Promise.all(Array.from({length:19},(_,group)=>loadHanjaGroup(group))).then(()=>{
    if(generation!==hanjaReverseGeneration||hanjaInput.value!==source)return;
    const result=createHanjaToHangulConverter(loadedHanjaWordMap)(source);
    hanjaReadingOutput.value=result.text;
    hanjaReverseSuggestedText=result.text;
    hanjaReverseNeedsManualResolution=result.status!=='resolved';
    const details=[
      ...result.ambiguities.map(item=>item.source+' → '+item.readings.join(' / ')),
      ...result.unmapped.map(item=>item.source+' → немає словникового читання')
    ];
    hanjaReadingStatus.textContent=result.status==='resolved'
      ?'Однозначне словникове читання знайдено. Можна передати Hangul у головне поле.'
      :'Потрібна ручна перевірка: '+details.join('; ')+'. Відредагуйте поле читання, щоб підтвердити вибір.';
    if(hanjaUseReading)hanjaUseReading.disabled=result.status!=='resolved';
  }).catch(error=>{
    if(generation!==hanjaReverseGeneration)return;
    hanjaReadingStatus.textContent='Не вдалося завантажити словник: '+String(error?.message||error);
    if(hanjaUseReading)hanjaUseReading.disabled=true;
  });
}
if(hanjaInput)hanjaInput.addEventListener('input',renderHanjaReverse);
if(hanjaReadingOutput)hanjaReadingOutput.addEventListener('input',()=>{
  if(!hanjaUseReading)return;
  const stillContainsHanja=/[\\u3400-\\u4DBF\\u4E00-\\u9FFF\\uF900-\\uFAFF]/u.test(hanjaReadingOutput.value);
  hanjaUseReading.disabled=!hanjaReadingOutput.value.trim()||stillContainsHanja;
  if(hanjaReverseNeedsManualResolution&&!stillContainsHanja&&hanjaReadingOutput.value!==hanjaReverseSuggestedText){
    hanjaReadingStatus.textContent='Ручне читання відредаговано; перевірте його перед передаванням у головне поле.';
  }
});
if(hanjaUseReading)hanjaUseReading.addEventListener('click',()=>{
  if(!input||!hanjaReadingOutput||hanjaUseReading.disabled)return;
  input.value=hanjaReadingOutput.value;
  input.dispatchEvent(new Event('input',{bubbles:true}));
  input.focus();
});

const analysis=document.querySelector('#result-analysis');
const traceList=document.querySelector('#trace-list');
const ipaTracePanel=document.querySelector('#ipa-trace-panel');
const rrTracePanel=document.querySelector('#rr-trace-panel');
const rrTraceList=document.querySelector('#rr-trace-list');
const variantPanel=document.querySelector('#variant-panel');
const variantList=document.querySelector('#variant-list');
const uaUnconfirmedButton=document.querySelector('#ua-unconfirmed-button');
const uaCandidateButton=document.querySelector('#ua-candidate-button');
let selectedUaView='unconfirmed';
let currentConfirmedOutput='';
let currentTargetUnconfirmed=true;
let currentOutputMethod='ipa';
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
  if(ukrainianOutputLabel)ukrainianOutputLabel.textContent=candidateSelected?'Дослідницький результат':currentOutputMethod==='rr'?'Транслітерація за RR':currentTargetUnconfirmed?'Достовірний варіант недоступний':'Достовірний варіант';
  if(ukrainianCopyButton){ukrainianCopyButton.hidden=currentTargetUnconfirmed&&!candidateSelected;ukrainianCopyButton.textContent=candidateSelected?'Копіювати результат':'Копіювати';}
}
if(uaUnconfirmedButton)uaUnconfirmedButton.addEventListener('click',()=>selectUaView('unconfirmed'));
if(uaCandidateButton)uaCandidateButton.addEventListener('click',()=>selectUaView('candidate'));
const RULE_LABELS={
  'super-soft-orthographic-fallback':'суперм’який резерв: складове IPA без морфологічного припущення',
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
const STATUS_LABELS={'canonical':'Нормативна базова форма','contextual':'Контекстне правило застосовано','lexical':'Словникова вимова','lexical-review':'Потребує перевірки','practical-transliteration':'Практична евристика','heuristic-low-confidence':'Низька впевненість','super-soft-orthographic-fallback':'Суперм’який резервний запис · низька впевненість','super-soft-practical-heuristic':'Суперм’яка евристика · низька впевненість','super-soft-morphology-heuristic':'Суперм’яка гіпотеза · низька впевненість','super-soft-heuristic-coverage':'Суперм’який режим · евристичне покриття','super-soft-maximum-coverage':'Суперм’який режим · максимальне покриття','literal-preserved':'Збережено як буквальний запис','unresolved':'Не визначено'};
function describeStatus(status){return STATUS_LABELS[status]||status;}
function render(){const value=input.value;copyFeedback.hidden=true;count.textContent=`${[...value].length} символів`;if(!value){results.hidden=true;empty.hidden=false;issue.hidden=true;return;}const morphologyMode=currentMorphologyMode();const romanizationMode=Boolean(modeRomanization&&modeRomanization.checked);const useG2p=!(modeResearch&&modeResearch.checked);const r=useG2p?webEngine.convert(value):engine.convert(value,{morphologyMode});const rrTarget=romanizationMode&&r.surfaceHangul?transcribeRevisedToUkrainian(r.surfaceHangul,value):null;if(ipaTracePanel)ipaTracePanel.hidden=romanizationMode;if(rrTracePanel)rrTracePanel.hidden=!romanizationMode;empty.hidden=true;results.hidden=false;const candidateText=romanizationMode?'':(r.candidate_ukrainian??r.candidate_orthography??'');const candidateDisplayText=morphologyMode==='super-soft'?renderSuperSoftCandidate(r.trace,candidateText):candidateText;const hasCandidate=!romanizationMode&&Boolean(candidateText||r.target_status==='provisional');const targetUnconfirmed=romanizationMode?(!rrTarget||rrTarget.status==='unavailable'):(hasCandidate||r.target_status==='unavailable'||r.target_status==='provisional');currentTargetUnconfirmed=targetUnconfirmed;currentOutputMethod=romanizationMode?'rr':'ipa';currentConfirmedOutput=romanizationMode?(rrTarget?.text||''):(r.ukrainian||'');if(candidateValue)candidateValue.textContent=candidateDisplayText;if(candidateNote)candidateNote.textContent=morphologyMode==='super-soft'?'Дослідницький результат — попередній варіант, не підтверджений нормативний запис. У квадратних дужках [фрагмент] позначено лише ділянки з низькою впевненістю. Перед використанням потрібна перевірка IPA та української цільової адаптації.':'Дослідницький результат — попередній варіант, не підтверджений нормативний запис. Перед використанням потрібна перевірка IPA та української цільової адаптації.';if(uaCandidateButton)uaCandidateButton.disabled=!hasCandidate;if(!hasCandidate&&selectedUaView==='candidate')selectedUaView='unconfirmed';selectUaView(selectedUaView);surfaceOutput.textContent=r.surfaceHangul||'';surfaceReading.hidden=!r.surfaceHangul;ipa.textContent=r.ipa;const phonemicIpa=renderPhonemicIpa(value);if(ipaPhonemic)ipaPhonemic.textContent=phonemicIpa.ipa;if(ipaPhonemicStatus)ipaPhonemicStatus.textContent=phonemicIpa.issues.length?'Фонемний базовий запис частковий: не-Hangul фрагменти збережено буквально; перевірте їх окремо.':'Фонемний базовий запис побудовано з Hangul без морфологічної/просодичної реконструкції; це не поверхнева вимова.';romanization.textContent=r.surfaceHangul?romanizeRevised(r.surfaceHangul):'—';if(rrTraceList){rrTraceList.textContent='';for(const entry of (rrTarget?.trace||[])){const row=document.createElement('div');row.className='trace-row';const source=document.createElement('span');source.className='trace-source';source.textContent=entry.source||entry.text||'';source.dataset.label='Корейський склад';const rr=document.createElement('span');rr.className='trace-ipa';const contextLabel=entry.wordPosition?' · речення '+(entry.sentenceIndex+1)+' · слово '+entry.sentenceWordIndex+' · склад '+(entry.syllableIndex+1)+'/'+entry.wordLength+' · '+entry.wordPosition+' · '+entry.leftContext+' → '+entry.rightContext+' · '+entry.onsetContext+' · '+entry.onsetOrigin+' · '+entry.alignmentStatus+' · '+entry.sentencePosition+(entry.collisionGroup?' · колізія '+entry.collisionGroup:''):'';const featureLabel=entry.phonologicalFeature?' · '+entry.phonologicalFeature:'';const ruleLabel=entry.mapping_id?' · правило '+entry.mapping_id:'';const noteLabel=entry.notes?' · '+entry.notes:'';rr.textContent=(entry.layer?entry.layer+': '+(entry.rr||'∅'):'літеральний фрагмент')+contextLabel+featureLabel+ruleLabel+noteLabel;rr.dataset.label='Одиниця RR і контекст';const target=document.createElement('span');target.className='trace-output';target.textContent=entry.alternativeUkrainian?entry.ukrainian+' (альт. '+entry.alternativeUkrainian+')':(entry.ukrainian??'');target.dataset.label='Українська';const state=document.createElement('span');state.className='trace-status '+entry.status;state.textContent=entry.status||'—';state.dataset.label='Статус';row.append(source,rr,target,state);rrTraceList.append(row);}}const romanizationNote=document.querySelector('#romanization-note');if(romanizationNote)romanizationNote.textContent=romanizationMode?'RR є проміжним записом; український відповідник залежить від позиції складу та фонетичного оточення, показаних у trace. Апостроф позначає фонемний придих.':'Довідковий запис корейської поверхневої форми латиницею. У фонетичних режимах український результат формується з IPA; окремий RR-режим застосовує контекстну українську адаптацію.';analysis.textContent=r.analysis;renderHanja(value);const coverageLabel=morphologyMode==='super-soft'&&r.coverage&&r.coverage.input_total?` · покриття складів Hangul: ${Math.round(r.coverage.input_coverage*100)}% (${r.coverage.input_covered}/${r.coverage.input_total}); облік фрагментів: ${Math.round(r.coverage.trace_coverage*100)}%; низька впевненість: ${Math.round((r.coverage.low_confidence_share??0)*100)}% (${r.coverage.low_confidence_units??0}/${r.coverage.input_total})`:'';statusNote.textContent=romanizationMode?'Revised Romanization → українська · окрема попередня таблиця':(useG2p?'g2pK · ':'Козак Кім · ')+(r.status==='super-soft-orthographic-fallback'?'Суперм’який режим · резервна вимова низької впевненості':r.status==='super-soft-heuristic-coverage'?'Суперм’який режим · евристичний результат низької впевненості':r.status==='super-soft-maximum-coverage'?'Суперм’який режим · максимальне покриття':r.status==='canonical'?'Канонічна форма':r.status==='contextual'?'Контекстну вимову застосовано':r.status==='lexical'?'Словникова вимова застосована':r.status==='lexical-review'?'Вимова словникова; український запис попередній':r.status==='practical-transliteration'?'Практична транслітерація (нижча точність)':r.status==='heuristic-low-confidence'?'М’яка морфологія (низька впевненість); не NIKL-сертифіковано':'Є невизначені ділянки')+coverageLabel+(r.candidate_status==='super-soft-low-confidence'?' · Є резервні читання низької впевненості':r.candidate_status==='provisional'?' · Показано попередній кандидат, не підтверджений результат':r.target_status==='unavailable'?' · Український запис недоступний':r.target_status==='model-selected'?' · Український запис за проєктними відповідностями; незалежно не валідований':'');issue.hidden=!r.issues.length;issueText.textContent=r.issues.join(' ');variantList.textContent='';const variants=r.variants||[];variantPanel.hidden=variants.length===0;for(const v of variants){const row=document.createElement('div');row.className='trace-row';const source=document.createElement('span');source.className='trace-source';source.dataset.label='Варіант · джерело';source.textContent=`${v.source||value} → ${v.surface}`;const out=document.createElement('span');out.className='trace-output';out.dataset.label='Український варіант';out.textContent=v.ukrainian;const details=document.createElement('span');details.className='trace-ipa';details.dataset.label='IPA та примітка';details.textContent=`IPA: ${v.ipa}${v.note?' · '+v.note:''}`;const state=document.createElement('span');state.className=`trace-status ${v.status}`;state.dataset.label='Статус';state.textContent=v.note&&v.note.includes('§4')?'нормативний варіант вимови; український запис може збігатися':v.status==='lexical-review'?'український запис попередній':'словниковий варіант';row.append(source,out,details,state);variantList.append(row);}traceList.textContent='';for(const t of r.trace){if(t.status==='literal')continue;const row=document.createElement('div');row.className='trace-row';const source=document.createElement('span');source.className='trace-source';source.dataset.label='Корейський сегмент · вхід';source.textContent=t.source;source.title='Початковий корейський склад';const surface=document.createElement('span');surface.className='trace-surface';surface.dataset.label='Корейська вимова';surface.textContent=t.surface||t.source;surface.title='Склад після застосування правил вимови';const ipaValue=document.createElement('span');ipaValue.className='trace-ipa';ipaValue.dataset.label='IPA';ipaValue.textContent=t.ipa||'—';ipaValue.title='IPA — єдине джерело для українського відповідника';const mapping=document.createElement('span');mapping.className='trace-mapping';mapping.dataset.label='IPA-токени → українські графеми';const mappingResult=traceIpaMappingDetailed(t.ipa||'');const tokenTrace=mappingResult.tokens.map(token=>token.ipa+' → '+token.ukrainian+' ['+token.mapping_id+'; '+token.status+']').join(' · ');const featureTrace=(mappingResult.features||[]).map(feature=>feature.ipa+' — '+feature.note).join(' · ');const targetStatusNote=mappingResult.status==='provisional'?'цільова відповідність попередня':mappingResult.status==='unavailable'?'відповідність недоступна':'відповідність задана проєктом';mapping.textContent=[tokenTrace,featureTrace,targetStatusNote].filter(Boolean).join(' · ')||'—';mapping.title='Відображення IPA-токенів і явний облік ознак, які не мають окремого позначення в українському записі';const out=document.createElement('span');out.className='trace-output';out.dataset.label='Український запис';out.textContent=t.candidateStatus==='provisional'?'Кандидат: '+(t.candidateOutput||''):t.output||'∅';out.title=t.candidateStatus==='provisional'?'Попередній кандидат; не підтверджений український запис':'Повний український відповідник, складений з IPA-токенів';const rules=document.createElement('span');rules.className='trace-rules';rules.dataset.label='Нюанс / правило';const ruleNames=(t.rules||[]).map(describeRule);rules.textContent=ruleNames.length?ruleNames.join(' · '):'без контекстної зміни';rules.title=(t.rules||[]).join(' | ')||'Канонічне відображення IPA';const state=document.createElement('span');state.className='trace-status '+t.status;state.dataset.label='Статус';state.textContent=describeStatus(t.status);state.title='Технічний статус: '+t.status;row.append(source,surface,ipaValue,mapping,out,rules,state);traceList.append(row);}const spokenOutput=romanizationMode?(targetUnconfirmed?'Романізаційне зіставлення недоступне.':'Результат за RR: '+currentConfirmedOutput):(targetUnconfirmed?(hasCandidate&&candidateText?'Дослідницький результат: '+candidateDisplayText:'Достовірний варіант не підтверджено.'):('Достовірний варіант: '+(r.ukrainian||'немає результату')));const announcement=(r.issues.length?'Обробку завершено з попередженнями. ':'Обробку завершено. ')+spokenOutput;announceResult(announcement.slice(0,220));}

if(softToggle)softToggle.addEventListener('change',()=>{if(softToggle.checked&&superSoftToggle)superSoftToggle.checked=false;render();});
if(superSoftToggle)superSoftToggle.addEventListener('change',()=>{if(superSoftToggle.checked&&softToggle)softToggle.checked=false;render();});
if(modePractical)modePractical.addEventListener('change',()=>{syncModeUi();render();});
if(modeResearch)modeResearch.addEventListener('change',()=>{syncModeUi();render();});
if(modeRomanization)modeRomanization.addEventListener('change',()=>{syncModeUi();render();});
syncModeUi();
input.addEventListener('input',render);
document.querySelector('#clear-button').addEventListener('click',()=>{input.value='';render();input.focus();});
document.querySelector('#example-button').addEventListener('click',()=>{input.value='현대 한국어의 표준 발음';render();input.focus();});
document.querySelector('#nikl-stress-example').addEventListener('click',()=>{input.value=niklMasterPassage.trim();render();input.focus();});
for(const button of document.querySelectorAll('[data-example]'))button.addEventListener('click',()=>{input.value=button.dataset.example;render();input.focus();});
for(const button of document.querySelectorAll('[data-copy]'))button.addEventListener('click',async()=>{clearTimeout(announcementTimer);const key=button.dataset.copy;const source=key==='ukrainian'?output:key==='ipa'?ipa:key==='ipa-phonemic'?ipaPhonemic:key==='romanization'?romanization:key==='hanja'?hanjaOutput:key==='hanja-reading'?hanjaReadingOutput:analysis;try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard API unavailable');await navigator.clipboard.writeText(source.textContent);button.textContent='Скопійовано';setCopyFeedback('Результат скопійовано.');setTimeout(()=>button.textContent='Копіювати',1200);}catch{const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(source);selection?.removeAllRanges();selection?.addRange(range);source.setAttribute('tabindex','-1');source.focus();setCopyFeedback('Автоматичне копіювання недоступне. Текст виділено: натисніть Ctrl+C або скористайтеся командою копіювання пристрою.');}});

render();
