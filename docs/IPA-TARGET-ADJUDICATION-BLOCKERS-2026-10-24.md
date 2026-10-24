# IPA and Ukrainian target adjudication blockers — 2026-10-24

## Purpose

This note narrows the remaining scientific work after the native-engine unresolved-case patch. It is not a new engine design and does not introduce a third-party G2P. It records a specific IPA-evidence gap and an independent target-layer review protocol so the next implementation decision is made from evidence rather than from the appearance of a successful test.

## Case 1: 삶의 — surface evidence is not IPA gold

Official NIKL MCFAQ item 5716 gives the particle phrase 삶의 with surface-pronunciation spellings [살믜] and [살메]:
https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5716&mn_id=217&pageIndex=225

That is strong evidence for the official Korean surface-Hangul alternatives. It does **not** directly attest the IPA strings `sal.mɰi` and `sal.me`. Those strings were rendered by the project and must not be cited as if NIKL supplied IPA.

The primary candidate `sal.mɰi` deserves specific scrutiny: the project must state whether it represents underlying/phonological /ɰi/, a broad surface transcription, or a house notation. These are not interchangeable claims. Korean Standard Pronunciation Rule §5 and the special allowance for particle 의 must be applied to the correct grammatical and syllabic environment; a general rule about ㅢ after a consonant must not be applied mechanically without checking the particle construction. Conversely, the fact that NIKL writes [살믜] is not by itself evidence that a glide [ɰ] is phonetically present.

**Current adjudication: BLOCKED_SPECIALIST_ADJUDICATION.** The focused literature search found a Seoul Corpus study reporting that /ɨi/ is monophthongized in 93.04% of tokens; 94.40% of monophthongized tokens are [i], except genitive-particle tokens, which mostly show [e] ([Unk16l], DOI: https://doi.org/10.17959/SPPM.2016.22.1.35). This makes `sal.mi` a better-supported **broad surface candidate** for [살믜] than `sal.mɰi`, while `sal.me` is a plausible broad candidate for [살메]. The prior `sal.mɰi` is not justified as broad surface IPA by the retrieved evidence; it would require an explicitly underlying/morphophonemic interpretation. However, the retrieved study does not measure 삶의 itself, and its full text was not available here. The engine now uses `sal.mi` as the primary candidate and `sal.me` as a separately exposed lexical alternative, while marking both diagnostic-only and blocking Ukrainian output. Independent review remains required before either is accepted as gold.

Required resolution:
1. Two qualified reviewers independently transcribe the item from the official normative context and, if available, a suitable recording with provenance and dialect/register identified.
2. Each reviewer records the transcription convention (phonemic vs broad surface IPA), syllable boundary, treatment of ㅢ, and whether each reading is normative, optional, or unsupported in this exact construction.
3. Reconcile disagreement with cited rule passages and acoustic evidence; do not manufacture an audio source if none is available.
4. Update the case fixture and source register only after adjudication, preserving both accepted alternatives where supported.
5. Keep Ukrainian target review open until the IPA decision is stable.

## Case 2: separate the Ukrainian target layer

A correct Korean surface analysis does not establish that a Ukrainian rendering is optimal. The target review must be conducted on a frozen IPA input, without showing reviewers the current Ukrainian answer first.

Reviewers should separately assess:
- preservation of Korean contrasts that the project has chosen to represent (including fortisness and relevant consonant/vowel distinctions);
- systematic handling of IPA length, syllable and word boundaries, and alternatives;
- consistency across the existing IPA-to-Ukrainian inventory rather than isolated intuitive spellings;
- readability and likely pronunciation by Ukrainian readers, tested with a blinded reading task where feasible;
- trade-offs where Ukrainian orthography has no exact equivalent, with the model decision stated rather than misrepresented as phonetic identity.

The target-layer report must identify the target policy version, IPA input version, reviewer qualifications, blinded procedure, disagreements, and limitations. Korean IPA adjudication and Ukrainian orthographic preference are separate judgments and must not be combined into one approval.

## Morphology and variation gates retained

- `많이본` and `좋아보인다고` remain unresolved unless the caller supplies segmentation or a validated morphology/spacing component provides it. Character adjacency is not a morpheme-boundary detector.
- N-insertion and other variable processes must be represented as explicit alternatives with provenance and confidence once sufficient evidence exists. Do not add a universal deterministic rewrite from studies showing gradient effects.
- Exact-form licenses for `앉아라` and `없어도` remain narrowly scoped, rule-derived results, not claims that NIKL directly lists each full inflected form.
- A passing regression test verifies the declared implementation contract; it does not adjudicate linguistic truth.

## Evidence ledger

| Item | Status | Acceptance criterion |
|---|---|---|
| NIKL surface spellings for 삶의 | DONE_VERIFIED as official Hangul evidence | Retain exact source URL and distinguish [살믜]/[살메] from IPA |
| `sal.mɰi` as broad surface IPA | BLOCKED_SPECIALIST_ADJUDICATION | Two independent reviews with convention, segmental, boundary and variant decisions |
| `sal.me` as broad surface IPA | BLOCKED_SPECIALIST_ADJUDICATION | Same independent procedure; do not infer equivalence from Hangul spelling alone |
| Ukrainian target for 삶의 | BLOCKED_SPECIALIST_REVIEW | Review frozen IPA candidates separately from Korean source adjudication |
| Automatic segmentation of compact strings | BLOCKED_INPUT_ANALYSIS | Caller-supplied segmentation or validated morphological/spacing analysis |
| Probabilistic variant selection | DEFERRED | Evidence-backed candidate distribution and calibrated confidence, not a hidden guess |

## Relevant scholarly anchors

- Park, Sunwoo (2019), “On the Phonological Representation and Acoustic Properties of the Diphthong /ɨi/ in Korean,” *Studies in Modern Grammar*. DOI: https://doi.org/10.14342/SMOG.2019.102.165. This is a relevant source to retrieve and evaluate; its existence alone does not settle the exact 삶의 case.
- Shin, Jiyoung, J. Kiaer & Jaeeun Cha (2012), *The Sounds of Korean: Tables*. DOI/book identifier: https://doi.org/10.1017/CBO9781139342858. Use the relevant vowel and phonological-rule sections; do not treat a handbook citation as case-specific experimental evidence.
- Jun, Jongho (2015), “Korean n-insertion: a mismatch between data and learning.” DOI: https://doi.org/10.1017/S0952675715000275.
- Jun, Jongho (2021), “Morphophonological gradience in Korean n-insertion.” DOI: https://doi.org/10.5334/GJGL.1401.

The first two references are leads for the ㅢ review, not proof of the final IPA for 삶의. The n-insertion papers support explicit variation handling, not a direct pronunciation decision for this case.

## Active literature review

A focused Undermind deep search has been launched for primary evidence on ㅢ in the particle construction 삶의 and independent IPA-to-Ukrainian evaluation:
https://app.undermind.ai/projects/de353992-202a-4b09-bf19-47932f80e426?path=/Independent%20IPA%20adjudication%20of%20Korean%20%EC%9D%98%20in%20%EC%82%B6%EC%9D%98%20and%20Ukrainian%20target%20mapping

Do not mark the literature task complete until its returned papers have been inspected and exact relevant claims have been verified.


## Implementation hardening on the existing PR branch

The code now carries a per-entry `ipa_adjudication_status` in the dated overlay `data/korean/lexical_additions_ipa-adjudication-2026-10-24.csv`. The canonical base lexicon schema remains unchanged. The existing native loader merges dated overlays, so the entry keeps its official surface-Hangul evidence and candidate IPA while recording `diagnostic_only_unresolved_pronunciation`.

For this entry, `phoneticize_korean("삶의")` now adds an `IPA_ADJUDICATION` unresolved context and returns the candidate IPA as diagnostic-only with reason `independent_ipa_adjudication_required`. `transliterate_korean("삶의")` must return no Ukrainian orthography and `target_status="unresolved"` until the IPA is independently adjudicated. The regression test asserts all of these conditions.

Relevant research leads returned by the workspace's semantic search:
- Kim, Ryang-jin (2025), “A Study on the Realization of the Korean phoneme 'ui(의)'.” DOI: https://doi.org/10.22557/hg.2025.3.86.1.5. Metadata is available but no abstract/full text was available in the retrieved record; it is not treated as verified evidence for the exact form.
- Park, Sunwoo (2019), “On the Phonological Representation and Acoustic Properties of the Diphthong /ɨi/ in Korean.” DOI: https://doi.org/10.14342/SMOG.2019.102.165. Metadata is available but no abstract/full text was available in the retrieved record.
- Wei et al. (2023), “Assessing Intelligibility in Non-native Speech: Comparing Measures Obtained at Different Levels.” DOI: https://doi.org/10.21437/interspeech.2023-1635. The retrieved abstract distinguishes intelligibility measures based on orthographic transcription from subjective comprehensibility ratings, supporting separate evaluation measures rather than one blended “quality” score. It is methodological context, not direct evidence for Korean-to-Ukrainian mapping.

**Verification state:** source and regression changes are committed to this branch, but the follow-up exact-head CI has not been observed in the available GitHub workflow/status responses. The earlier green CI applies only to the earlier implementation head and must not be reused as evidence for these latest commits. A local clone/test run was attempted but blocked because this environment could not resolve github.com.

## Literature extraction: what the evidence does and does not establish

Full-text review of Jun (2015) confirms that n-insertion is not a categorical rewrite. In the studied Seoul Korean data, insertion was more likely before /j/ than /i/, less likely after obstruents and /ŋ/, and more likely before /j/ followed by a high vowel. The existing-word survey showed a length effect (29.10% with monosyllabic M1 vs 55.96% with disyllabic M1), but the novel-word experiment did not generalize that effect (25.20% vs 20.95%, not significant in the principal model). The author also cautions that dictionary pronunciations underrepresent variants. This supports explicit alternatives and cautious, context-specific confidence—not a universal rule or probabilities copied from these study materials. DOI: https://doi.org/10.1017/S0952675715000275.

Jun (2021) similarly reports interacting gradient factors, including morphological category, etymology, component length, preceding consonant, following vowel/glide and speaker dialect; no single factor is an absolute condition. This supports keeping n-insertion deferred until the engine has a documented variant representation and suitable calibration data. DOI: https://doi.org/10.5334/GJGL.1401.

Full-text review of Wei et al. (2023) provides a useful evaluation-method precedent, but not direct validation of this project. Their Dutch non-native read-speech study used 45 recordings and 21 experienced raters; raters made orthographic transcriptions and separate 0–100 subjective ratings. Agreement was generally high, but the correlation between subjective ratings and word accuracy was weak (r=0.325). The study explicitly separates what listeners recover from speech (transcription accuracy) from perceived ease/comprehensibility. It contains no Korean IPA or Ukrainian target layer. For this project, the transferable methodological lesson is to measure at least two distinct outcomes—source-pronunciation/phonetic accuracy and Ukrainian-reader usability—rather than collapsing them into one score. DOI: https://doi.org/10.21437/interspeech.2023-1635.

The 2019 Park and 2025 Kim papers are highly relevant bibliographic leads for Korean ㅢ, but their abstracts/full texts were unavailable in the retrieved records. They must remain leads, not cited proof of the exact 삶의 IPA, until full text or primary evidence is inspected.


### Updated candidate status after the completed literature search

The completed Undermind search reports the following result from Park, Cho & Han (2016), “한국어 이중모음 /의/의 단모음화 양상,” DOI https://doi.org/10.17959/SPPM.2016.22.1.35:
- 2,370 Seoul Corpus tokens of /ɨi/ were analyzed; monophthongization occurred in 93.04% overall.
- 94.40% of monophthongized tokens were realized as [i], while genitive-particle tokens mostly showed [e].
- The paper reports strong positional and grammatical conditioning, so the result is not a universal one-to-one rule for every ㅢ token.

This is stronger evidence than the earlier metadata-only leads, but still not a direct acoustic measurement of 삶의. The engine therefore now presents `sal.mi` and `sal.me` as **distinct candidate broad surface IPA forms**, exposes the alternate in `ipa.lexical_alternatives`, marks the primary and alternate as diagnostic-only, and blocks the Ukrainian target. The legacy `sal.mɰi` candidate has been replaced as the primary broad surface rendering; no narrow IPA claim is made.

The same search surfaced [Vak25] on quantitative Japanese-to-Ukrainian practical transcription (DOI https://doi.org/10.1007/s11185-025-09321-x), [Vak19] on phonetic-distance measurement (DOI https://doi.org/10.1080/09296174.2019.1678709), and [Kog24] on Ukrainian–Russian bilingual perception of Portuguese mid-vowels (DOI https://doi.org/10.3390/languages9110350). These are methodological analogues, not direct validation of the Korean-to-Ukrainian mapping. The target review should combine explicit phonetic-distance measures with blinded Ukrainian listener identification/discrimination, and should report readability/comprehensibility separately from segmental identification accuracy.

## Official NIKL inventory execution — 2026-10-24 (not skipped; blocked by upstream HTTP 403)

The metadata-only crawler was deliberately run on a dedicated diagnostic branch `research/nikl-metadata-inventory-2026-10-24` rather than treating the workflow's normal-branch skip as a completed gate. Three direct HTTPS variants were attempted using only the collector's already-allowlisted official NIKL hosts and endpoints:

| Run | Requested official endpoint | Result |
|---|---|---|
| [40029487614](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40029487614) | `www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002` | HTTP 403 |
| [40029571329](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40029571329) | `www.korean.go.kr/kornorms/m/m_regltn.do?regltn_code=0002` | HTTP 403 |
| [40029630066](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40029630066) | `korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002` | HTTP 403 |

The collector first checks `robots.txt`; each attempt then stopped because the official content endpoint denied/rate-limited the request. The logs explicitly say `NIKL crawl BLOCKED: Official source denied or rate-limited this request (HTTP 403); do not bypass access controls.` Each workflow's job conclusion is green only because the workflow intentionally classifies this known access-denial condition as a recorded warning; the crawl step exits with code 3. **No complete inventory was generated, and this is not a successful crawl.** Logs/artifacts: [artifact 40029487614](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40029487614/artifacts/12533748777); the subsequent run artifacts are listed on their respective run pages.

The official NIKL page is discoverable through the public search index, but a direct open of the indexed official URL also returned HTTP 403 in the web retrieval environment. Search-index excerpts can support narrowly cited rule lookups, but cannot substitute for the crawler's complete response body, verified article 1–30 reconciliation, source response hash, or article-level hashes. No proxy, alternate mirror, forged user-agent, or other access-control bypass was attempted.

**Status correction:** the NIKL gate is now `BLOCKED_EXTERNAL_ACCESS` with reproducible evidence, not merely `skipped`. Acceptance requires a permitted direct retrieval of the official page (or an official export provided through an authorized channel), a complete 30-article inventory with zero missing/duplicate/incomplete records, a valid metadata manifest and hashes, and an artifact/log audit. Preserve metadata-only retention; do not persist article text until applicable reuse terms are reviewed.


## Execution update — output-path correction (2026-10-24)

The missing target-inventory dependency was a software architecture blocker, not evidence that every resolved IPA string lacked a Ukrainian correspondence. The Korean repository already owns source-specific correspondence data; UPI's role is target phoneme/features/grapheme metadata, not a complete Korean mapping table.

- Added the IPA-only renderer `src/korean_ukrainian/ipa_target_renderer.py` and explicit overrides `data/korean/ipa_target_overrides.csv`.
- The renderer's input is IPA, and output includes mapping IDs, source references, scope, status, syllable indices, and ignored-length-marker metadata. Missing IPA fragments cause a full-word abstention.
- A deterministic pre-CI simulation of the tracked canonical corpus showed 643/643 primary and 45/45 alternate outputs match the declared target references. This is a reproducibility check, not an independent linguistic gold score; final-head CI remains pending.
- The seven native strict unresolved phonology cases remain blocked. A 24-row input-only candidate reconstruction is present on this PR branch at `data/korean/benchmarks/target-renderer-holdout-24.csv`, labelled `reconstructed_unverified`. The original source manifest and independent membership record were not found, so this is not verified as the original frozen holdout. The audit script records native/G2P IPA and target statuses, but no IPA or Ukrainian gold labels are available, so target accuracy remains unscored.
- The provisional target rules `ɰi → ий` and `kʰjʌ → кхьо` are explicit and traceable; the former cannot bypass the unresolved-IPA gate. The latter remains a target-policy review item because it is a specific exception within the broader aspiration-neutralization policy.
- UPI wheel packaging PR [#10](https://github.com/ClippyFirst/Ukrainian-Phonetic-Inventory/pull/10) remains unverified because the Actions run failed without exposed job steps/logs.
