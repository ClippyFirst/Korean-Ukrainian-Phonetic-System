import canonicalCsv from '../data/korean/canonical_correspondence.csv?raw';
import lexicalCsv from '../data/korean/lexical_pronunciations.csv?raw';
import {createEngine} from './app/engine.js';

const engine=createEngine(canonicalCsv,lexicalCsv);
const input=document.querySelector('#source-input');
const count=document.querySelector('#character-count');
const results=document.querySelector('#results');
const empty=document.querySelector('#empty-state');
const issue=document.querySelector('#issue-state');
const issueText=document.querySelector('#issue-text');
const statusNote=document.querySelector('#status-note');
const live=document.querySelector('#live-region');
const output=document.querySelector('#result-ukrainian');
const surfaceReading=document.querySelector('#surface-reading');
const surfaceOutput=document.querySelector('#result-surface');
const ipa=document.querySelector('#result-ipa');
const analysis=document.querySelector('#result-analysis');
const traceList=document.querySelector('#trace-list');
const variantPanel=document.querySelector('#variant-panel');
const variantList=document.querySelector('#variant-list');

function render(){const value=input.value;count.textContent=`${[...value].length} символів`;if(!value){results.hidden=true;empty.hidden=false;issue.hidden=true;return;}const r=engine.convert(value);empty.hidden=true;results.hidden=false;output.textContent=r.ukrainian;surfaceOutput.textContent=r.surfaceHangul||'';surfaceReading.hidden=!r.surfaceHangul;ipa.textContent=r.ipa;analysis.textContent=r.analysis;statusNote.textContent=r.status==='canonical'?'Канонічний режим':r.status==='contextual'?'Контекстуальні правила застосовано':r.status==='lexical'?'Словникова вимова застосована':r.status==='lexical-review'?'Вимова словникова; український запис попередній':'Є невизначені ділянки';issue.hidden=!r.issues.length;issueText.textContent=r.issues.join(' ');variantList.textContent='';const variants=r.variants||[];variantPanel.hidden=variants.length===0;for(const v of variants){const row=document.createElement('div');row.className='trace-row';const source=document.createElement('span');source.className='trace-source';source.textContent=`${v.source||value} → ${v.surface}`;const out=document.createElement('span');out.className='trace-output';out.textContent=v.ukrainian;const details=document.createElement('span');details.className='trace-ipa';details.textContent=`IPA: ${v.ipa}${v.note?' · '+v.note:''}`;const state=document.createElement('span');state.className=`trace-status ${v.status}`;state.textContent=v.status==='lexical-review'?'український запис попередній':'словниковий варіант';row.append(source,out,details,state);variantList.append(row);}traceList.textContent='';for(const t of r.trace){if(t.status==='literal')continue;const row=document.createElement('div');row.className='trace-row';const source=document.createElement('span');source.className='trace-source';source.textContent=t.source;const out=document.createElement('span');out.className='trace-output';out.textContent=t.output;const rules=document.createElement('span');rules.className='trace-ipa';rules.textContent=t.rules.length?t.rules.join(' · '):t.ipa||'literal';const state=document.createElement('span');state.className=`trace-status ${t.status}`;state.textContent=t.status;row.append(source,out,rules,state);traceList.append(row);}live.textContent=r.issues.length?'Обробку завершено з попередженнями.':'Обробку завершено.';}

input.addEventListener('input',render);
document.querySelector('#clear-button').addEventListener('click',()=>{input.value='';render();input.focus();});
document.querySelector('#example-button').addEventListener('click',()=>{input.value='현대 한국어의 표준 발음';render();input.focus();});
for(const button of document.querySelectorAll('[data-example]'))button.addEventListener('click',()=>{input.value=button.dataset.example;render();input.focus();});
for(const button of document.querySelectorAll('[data-copy]'))button.addEventListener('click',async()=>{const key=button.dataset.copy;const source=key==='ukrainian'?output:key==='ipa'?ipa:analysis;try{await navigator.clipboard.writeText(source.textContent);button.textContent='Скопійовано';live.textContent='Результат скопійовано.';setTimeout(()=>button.textContent='Копіювати',1200);}catch{live.textContent='Автоматичне копіювання недоступне; виділіть результат вручну.';}});

render();