# Korean engine error investigation — 2026-10-24

## Status

**DONE_VERIFIED for implementation and paired benchmark:** PR #297 merged into main as commit 2f7b58f0b7d976b9d660f21a739145ce19c533ab; PRs #298 and #299 supplied the R002 and palatal-yod fixes, and PR #297 integrated the R010 exact-form licenses for 닮다 and 넘게 in both Python and browser engines. Code-equivalent CI on superseded PR #300 passed (verify 40092757353, tests 40092757419, multi-engine benchmark 40092757409). Post-merge mainline verification is now complete: [tests 40093211039](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40093211039), [system verification 40093211139](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40093211139), and [master-table/research-artifact validation 40093211099](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40093211099) all passed on merge commit 2f7b58f0b7d976b9d660f21a739145ce19c533ab. The Pages deployment run 40093211042 subsequently completed successfully.

Latest post-fix six-engine run: [40092929978](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978), [artifact 12559692692](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978/artifacts/12559692692). The artifact includes full native-vs-g2pk occurrence ledgers for UGTPHON and SIGMORPHON, not a capped mismatch sample.

Key source files:
- R002 native rule: src/korean_ukrainian/rules.py
- IPA renderer: src/korean_ukrainian/ipa.py
- Exact-form R010 licenses: src/korean_ukrainian/rules.py and src/app/engine_shared.js
- Complete benchmark report: [MULTI-ENGINE-KOREAN-IPA-BENCHMARK-2026-10-24.md](MULTI-ENGINE-KOREAN-IPA-BENCHMARK-2026-10-24.md)
- Master benchmark register: [KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md](KOREAN-BENCHMARK-SUITE-REGISTER-2026-10-24.md)

## 1. Confirmed defect: coda ㅇ was incorrectly resyllabified and then became silent

### Mechanism

The R002 liaison loop accepted a preceding coda whenever the next syllable had onset ㅇ. For a coda such as ㄴ, ㄹ, or ㅁ, moving the consonant into the next onset can represent ordinary liaison. But coda ㅇ represents the velar nasal /ŋ/. The generic branch changed the following onset to Hangul ㅇ and cleared the coda; the IPA renderer correctly emits no consonant for onset ㅇ, so /ŋ/ disappeared.

This is an implementation defect, not a need for a lexical exception: it conflated coda ㅇ (/ŋ/) with onset ㅇ (zero onset).

### Direct evidence

| Dataset | Word | Gold after declared broad-level normalization | Native before fix | g2pk + shared project renderer | Diagnosis |
|---|---|---|---|---|---|
| UGTPHON | 공인 | koŋin | ko.in | koŋ.in | /ŋ/ disappears |
| UGTPHON | 양아치 | jaŋatɕʰi | ja.a.tɕʰi | jaŋ.a.tɕʰi | /ŋ/ disappears |
| UGTPHON | 심장은 | ɕimdʑaŋɯn | sim.dʑa.ɯn | sim.dʑaŋ.ɯn | /ŋ/ disappears |
| SIGMORPHON | 놀이공원 | noɾiɡoŋwʌn | no.ɾi.ɡo.wʌn | no.ɾi.ɡoŋ.wʌn | /ŋ/ disappears |
| SIGMORPHON | 동요 | toŋjo | to.jo | toŋ.jo | /ŋ/ disappears |

PR #298 is merged at [468ac8a690812e455eef1437ecf4b91ea67bdc75](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/commit/468ac8a690812e455eef1437ecf4b91ea67bdc75). The guard now preserves coda ㅇ and regression tests cover 공인, 양아치, 동요, and 동이.

### Measured effect

The older normalization profile measured +11 exact matches (648 → 659 of 2,655 scored occurrences) and native CER fell from 17.0648% to 16.7439%. Under the revised broad-IPA profile, the same-profile comparison was 1,351 → 1,397 exact matches and CER 9.6619% → 9.3122%. These two profiles use different normalization contracts; compare only within each profile.

## 2. Confirmed second defect: broad IPA retained /j/ after ㅈ/ㅉ/ㅊ before ㅕ

The complete paired audit before this fix found 19 UGTPHON occurrences where g2pk exactly matched the normalized reference and native did not. Thirteen had the same one-character error: native rendered a palatal affricate followed by an extra [j], e.g. tɕʰjʌ instead of tɕʰʌ. Examples included 던져주다, 조져버리고, 졌으면, 책임져라, 무쳣다, 쳐버려가지고, 쳐먹은, 까졍, 쳐먹고, 쳐받어, 빠져, 헤어졋겟지, and 자빠졌네.

This was a second implementation defect, not proof that g2pk is generally superior. The official National Institute of Korean Language source explicitly states Standard Pronunciation Rule 5, exception 1: verbal forms 져/쪄/쳐 are pronounced [저/쩌/처], and the explanation identifies the restriction on [j] immediately after these palatal affricates: [official rule](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002), [NIKL explanation](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=302312).

PR #299 is merged at [f1267f700b2a7ff726765fc17b6d2fa093561dfb](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/commit/f1267f700b2a7ff726765fc17b6d2fa093561dfb). The renderer absorbs /j/ in broad surface IPA only for ㅈ/ㅉ/ㅊ + ㅕ and preserves the glide in phonemic output. The revised-profile paired native exact count rose from 1,397 to 1,410 (+13), and native CER fell from 9.3122% to 9.2060% on the same 2,655 scored occurrences.

## 3. Two remaining R010 (§24) errors were missing exact-form licenses

After the yod fix, the full audit found six g2pk-only exact occurrences:
- 닮다 — native tam.da; g2pk tam.t͈a; the missing change is fortition after a verb stem ending in ㄻ (representative ㅁ) before ending-initial ㄷ.
- 넘게 — native nʌm.ɡe; g2pk nʌm.k͈e; the missing change is fortition after a verb stem ending in ㅁ before ending-initial ㄱ.
- 없는 — four repeated corpus occurrences; native ʌːm.nɯn; g2pk ʌm.nɯn.

The native rule engine deliberately requires exact full-form + adjacent-pair evidence for morphology-conditioned R010 (§24) fortition. The two first cases were not licensed, so the engine conservatively left ㄷ/ㄱ lenis. PR #297 adds exact-form licenses for 닮다 and 넘게 to the Python engine and corresponding browser engine, with tests. The license is scoped to those complete forms; it does not turn on a global fortition heuristic or silently claim a productive morphology parser.

The latest Python benchmark after these licenses gained two more exact matches (1,410 → 1,412 of 2,655) and CER fell from 9.2060% to 9.1883%. This improvement is measured in run 40092929978. The browser port passed code-equivalent verification and tests in PR #300. Post-merge mainline verification also passed on merge commit 2f7b58f0b7d976b9d660f21a739145ce19c533ab: tests 40093211039, system verification 40093211139, and master-table/research-artifact validation 40093211099.

## 4. The four remaining g2pk-only exact matches are an annotation mismatch for 없는

The native lexicon has a source-backed entry for 없는 with IPA ʌːm.nɯn, reflecting the NIKL-attested long-vowel form [엄ː는]. The UGTPHON reference for the four occurrences is ʌ̹mnɯn and omits the length mark. The scorer intentionally retains vowel length, so these are four repeated instances of one reference convention mismatch.

Do not delete a sourced length contrast from production IPA just to raise exact match. These four items should be independently adjudicated before the benchmark can be treated as normative gold. This is not established as a native phonology bug.

## 5. Full paired error analysis after the fixes

### UGTPHON

Latest artifact [12559692692](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978/artifacts/12559692692) reports 2,703 eligible occurrences:

| Paired category | Occurrences |
|---|---:|
| Both engines exact | 1,412 |
| Both engines not exact | 1,239 |
| g2pk exact, native scored but not exact | 4 |
| Native abstained, g2pk exact | 19 |
| Native abstained, g2pk not exact | 29 |
| **Total** | **2,703** |

There are no native-only exact occurrences in this UGTPHON set. The four g2pk-only exact entries are the repeated 없는 reference mismatch described above.

### SIGMORPHON 2021 public paired lexical file

| Paired category | Occurrences |
|---|---:|
| Both engines exact | 353 |
| Both engines not exact | 640 |
| Native exact, g2pk not exact | 4 |
| Native abstained, g2pk not exact | 2 |
| **Total** | **999** |

The four native-only exact entries are 값어치, 놓치다, 많다, and 맛없다. The 값어치 and 맛없다 differences align with source-backed native decisions; 많다 is a vowel-length contrast also present in the reference. 놓치다 requires independent phonetic review because the paired reference itself may be questionable. These cases show that external-engine outputs should be used to find disagreements, not copied blindly into production.

### Remaining abstentions

The native engine still abstains on 48 UGTPHON occurrences across 47 unique words. There are 49 unresolved context labels because one occurrence has two contexts:

- R002 liaison / neutralization requiring exact morpheme evidence: 25 labels.
- R003 ㅎ-coda deletion requiring an ending/suffix license: 20 labels.
- R007 palatalization requiring formal-morpheme evidence: 2 labels.
- R004 complex-coda + ㅎ aspiration requiring morphophonemic evidence: 1 label.
- One IPA-adjudication gap.

Among the 48 abstentions, g2pk matches the corpus reference on 19 and does not on 29. This suggests conservative coverage limits from the lack of a complete morphology layer, but does not justify blanket licensing from noisy corpus labels. Each case needs official NIKL environment verification or independently reviewed morphology evidence.

The SIGMORPHON set has two native abstentions: 닭갈비 (R008, ㄺ-before-ㄱ fortition depends on lexical/morphological class) and 중심닮음 (R002, liaison/neutralization requires exact morpheme evidence).

## 6. Current paired metrics and conclusion

| Dataset | Native exact match | g2pk exact on shared scored set | Paired g2pk-minus-native exact delta (95% CI) | Paired CER delta (95% CI) |
|---|---:|---:|---:|---:|
| UGTPHON, 2,655 shared scored occurrences | 1,412/2,655 (53.1827%) | 1,416/2,655 (53.3333%) | +0.1506 pp (+0.0351 to +0.3243) | +0.0531 pp (−0.0139 to +0.1302) |
| SIGMORPHON, 997 shared scored occurrences | 357/997 (35.8074%) | 353/997 (35.4062%) | −0.4012 pp (−0.8024 to −0.1003) | +0.1130 pp (−0.0250 to +0.2732) |

On UGTPHON, g2pk has four more exact matches among the shared scored cases, but all four are the same length-annotation mismatch; the CER interval crosses zero. On SIGMORPHON, native has four more exact matches and the paired exact interval favors native; the CER interval crosses zero. Therefore there is no evidence that g2pk is universally better than ClippyFirst.

This comparison is not fully independent end-to-end: g2pk emits surface Hangul and both systems use the ClippyFirst IPA segment renderer. The benchmark measures Korean IPA only; it does not score IPA-to-Ukrainian adaptation or Ukrainian output quality.

## 7. Required next verification

1. **DONE_VERIFIED** — full occurrence-level native-vs-g2pk ledger emitted and inspected for both pinned datasets.
2. **DONE_VERIFIED** — R002 coda-ㅇ fix and broad-IPA palatal-yod fix have merged regression tests and measured benchmark gains.
3. **DONE_VERIFIED** — exact-form R010 licenses for 닮다 and 넘게 are merged; code-equivalent PR #300 checks passed and post-merge mainline tests/system verification passed.
4. **TODO** — review the remaining 48 abstentions against NIKL and morphology evidence, prioritizing R002 and R003. Do not infer production rules from another engine's output alone.
5. **TODO** — build an independently adjudicated NIKL holdout stratified by rule, environment, and rule interactions, with a separate held-out split.
6. **BLOCKED** — independently adjudicated Korean IPA → Ukrainian practical-output gold corpus is not available; keep target-rendering evaluation separate.

## Task ledger

| Task | Status | Evidence / acceptance criterion |
|---|---|---|
| Diagnose and fix coda-ㅇ loss | DONE_VERIFIED | PR #298 merged; same-profile benchmark improvement and regression tests. |
| Diagnose and fix broad-IPA palatal-yod retention | DONE_VERIFIED | PR #299 merged; 13 exact-match gains on revised profile and official NIKL Rule 5 evidence. |
| Complete pairwise audit | DONE_VERIFIED | Artifact 12559692692; category totals reconcile to all 2,703 UGTPHON and 999 SIGMORPHON occurrences. |
| Add R010 exact-form licenses for 닮다 and 넘게 | DONE_VERIFIED for Python benchmark; browser parity pending | Two additional exact matches and CER improvement; strict full-form licenses only. |
| Explain all remaining native-vs-g2pk differences | PARTIAL | Four reference-length mismatches remain; 48 abstentions still require adjudication. |
| Normative acceptance benchmark | TODO | Independently reviewed IPA gold with NIKL article/environment provenance. |
| Ukrainian output accuracy | BLOCKED | No independently adjudicated Korean-to-Ukrainian gold corpus in the current benchmark. |


## 14-form R002/R003 source-adjudication continuation (2026-10-24)

A bounded triage register now captures 14 distinct native-abstention forms from the six-engine diagnostic artifact: seven tagged R002 and seven tagged R003. See [the case register](../research/r002-r003-source-adjudication-2026-10-24.json) and [adjudication/holdout protocol](R002-R003-SOURCE-ADJUDICATION-AND-HOLDOUT-2026-10-24.md).

**Status: PARTIAL, not linguistically completed.** The new records preserve the benchmark occurrence/row identifiers, unresolved spans, corpus IPA reference, and g2pk output only to make the disagreement traceable. The corpus is noisy user-generated data and the shared renderer means engine agreement is not independent phonetic evidence. Every case remains `PENDING_EXACT_FORM_SOURCE`; no final broad IPA or Ukrainian target is populated.

The general NIKL Standard Pronunciation Rules URL is only the rule-family entry point. Exact-form source verification must record the precise rule passage, official Q&A or dictionary entry, grammatical segmentation, and whether the form is directly attested or merely derived. Forms without enough spacing/context remain unresolved rather than being assigned a guessed morphology.

- **DONE_VERIFIED (bookkeeping):** 14 unique forms registered; queue-integrity test added.
- **TODO:** exact official source and morphology review for each case.
- **BLOCKED pending qualified reviewers:** independent dual broad-IPA transcription and documented reconciliation.
- **TODO:** freeze a separate NIKL holdout only after adjudication, then measure the fixed engine without tuning on that split.
- **BLOCKED:** Ukrainian target accuracy still requires a separate independently reviewed IPA-to-Ukrainian gold set.


### Official web-source findings — 2026-10-24

The follow-up source search found exact official NIKL surface-pronunciation evidence for three queued forms:
- `멋있어`: NIKL Online Q&A explicitly accepts both [머디써] and [머시써] (https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=306166).
- `싫어서`: NIKL Online Q&A explains ㅎ deletion from ㅀ before a vowel-initial ending and liaison of ㄹ, yielding [시러서] (https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=313981).
- `수많은`: NIKL Korean Basic Dictionary directly lists `수많은[수ː마는]` (https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=71144).

These are official Hangul pronunciation notations, not IPA. Their queue status is `SOURCE_FOUND_PENDING_IPA`; no `finalBroadIpa` was populated. Eleven cases still need exact-form source evidence. For `멋있어`, the officially attested variant pair also means evaluation must specify whether it accepts alternatives or tests one chosen target convention. The full source excerpts and access date are in the case-level JSON register.
