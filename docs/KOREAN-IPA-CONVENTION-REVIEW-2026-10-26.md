# Korean IPA source-convention review — 2026-10-26

## Evidence-backed findings

### SIGMORPHON 2021 medium Korean

Pinned source: [SIGMORPHON 2021 task repository at `821bcdece5a47820872215969f275004b0abe80c`](https://github.com/sigmorphon/2021-task1/tree/821bcdece5a47820872215969f275004b0abe80c).

The upstream task README defines each target as a roughly-phonemic IPA phone sequence tokenized with the `segments` library. The source describes the data as WikiPron/Wiktionary-derived. The 2021 SIGMORPHON proceedings paper states that post-processing removes stress and syllable markers and handles IPA segmentation for combining/modifier diacritics and contour information. Therefore:
- source whitespace separates phone tokens; joining tokens is serialization-only;
- absence of stress or syllable markers is not evidence that stress or syllable boundaries are absent in the spoken form;
- the target is not guaranteed to match ClippyFirst's broad-IPA contract merely because both use IPA symbols.

Primary references:
- https://github.com/sigmorphon/2021-task1/blob/821bcdece5a47820872215969f275004b0abe80c/README.md
- https://sigmorphon.github.io/workshops/2021/2021_SIGMORPHON_Proceedings.pdf

### UGTPHON Korean

Pinned source: [UGTPHON at `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`](https://github.com/naver-ai/UGTPHON/tree/ef0d5a09c2ea1874c7206020f875cbd9cfea2f54).

The upstream README describes Korean token `phoneme` annotations as IPA lookups from the Korean IPA-Dict lexicon checked by native-speaker annotators; uncovered forms are transcribed manually. The schema permits comma-separated accepted pronunciations, and the corpus's token-level phoneme field is not interchangeable with its sentence-level `phonemes` field. The current builder conservatively excludes comma variants/placeholders and preserves the chosen token annotation. The source's IPA may contain diacritics and narrow phonetic detail, so it cannot be assumed to match the SIGMORPHON convention or ClippyFirst broad IPA.

Primary references:
- https://github.com/naver-ai/UGTPHON/blob/ef0d5a09c2ea1874c7206020f875cbd9cfea2f54/README.md
- https://github.com/naver-ai/UGTPHON/blob/ef0d5a09c2ea1874c7206020f875cbd9cfea2f54/ko/LICENSE

## Executable conflict queue

`scripts/build_korean_ipa_adjudication_queue.py` builds a deterministic queue from the pinned **train/train** overlap only. It preserves every source candidate and provenance ID, records literal Unicode code points without calling them phonemes, classifies serialization-exact / dot-only / length-only / other differences diagnostically, and leaves all review and mapping fields unset. It rejects dev/test inputs and mismatched source pins.

The queue is not a converter, does not select a gold corpus, does not merge datasets, and does not generate production rules. The prior compatibility audit found 1,084 shared train forms: 718 match after only removing SIGMORPHON token-separator whitespace; 366 require review (151 length-mark-only diagnostics, 215 other symbol/feature diagnostics, zero dot-only). These categories are not normalization instructions.

## Adapter decision

**Decision: do not yet map source symbols into ClippyFirst broad IPA.** The upstream evidence establishes different annotation pipelines, but it does not by itself establish the symbol-by-symbol correspondence for the exact shared Korean forms. In particular, deleting length marks would hide a documented discrepancy rather than adjudicate it, and converting every Unicode code point into a “phone” would be an unsupported segmentation assumption.

The next acceptable adapter must be a versioned, source-specific mapping table with:
- source symbol or typed feature, exact source convention, and pinned evidence;
- output segment/feature in the ClippyFirst IPA contract;
- explicit one-to-one, one-to-many, many-to-one, or unmapped status;
- an information-loss record for each lossy mapping;
- independent reviewer status and source examples;
- regression tests for mapped, ambiguous, and unmapped inputs.

Until that gate is met, neural-versus-Strict accuracy comparisons across these targets would be invalid. The scratch teacher's 60.2% dev exact match remains only a SIGMORPHON-source-token-sequence metric, not ClippyFirst broad-IPA accuracy. No production phonological rule or runtime output is changed by this work.


## Neural integration decision — 2026-10-26

**Keep the neural model outside the production runtime for now.** The latest saved scratch-teacher artifact has 59.6% exact token-sequence match (596/1,000) on the SIGMORPHON dev convention, was selected on that dev split, and has no independently normalized comparison against ClippyFirst broad IPA. The earlier 60.2% value is superseded by the later exact-head artifact. That is insufficient evidence for a production fallback or ensemble. The owner-approved direction is to improve ClippyFirst's own engine with traceable data; therefore use the model offline as a hypothesis generator only. A candidate becomes a production rule only after primary-source phonological analysis, exact environment/exception definition, independent review, positive and negative regression controls, and improvement on a separate eligible evaluation set.

Revisit direct neural runtime integration only if a separately evaluated model has materially better independently adjudicated IPA performance, acceptable latency/resource behavior, reproducible packaging, and a justified operational benefit over the deterministic engine. No such evidence currently exists.


## Exact source-symbol inventory — 2026-10-26

Added `scripts/audit_korean_ipa_symbol_inventories.py`, tests, and an artifact-producing step in the pinned-corpus workflow. Exact-head run [40305565459](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40305565459) passed and uploaded artifact [12641804746](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40305565459/artifacts/12641804746).

Observed inventory (raw data counts, not adjudicated phone inventory):

- SIGMORPHON: 8,000 train rows / 1,000 dev rows; 47 / 46 distinct Unicode code points; 60 / 59 distinct source-whitespace target tokens. The audit preserves those source tokens but does not claim that every token is a ClippyFirst segment.
- UGTPHON: 13,271 train / 1,897 dev token occurrences; 8,753 / 1,629 unique source forms; 51 / 50 distinct Unicode code points. The tool deliberately does not segment compact target strings into phones.
- Both sources contain numerous combining phonetic marks; their frequencies differ. For example, the length mark `ː` occurs 1,630 times in SIGMORPHON train targets versus 105 times in UGTPHON train targets; primary stress `ˈ` occurs 105 times in UGTPHON train and is absent from the SIGMORPHON train inventory. This is a measurable convention difference, not a rule to erase either feature.
- UGTPHON's raw inventory includes `ç` (211 occurrences in train) and `ø` (300 occurrences in train), neither present in SIGMORPHON train. Example raw rows include `비키니 → pikçini` and `사인회 → sʰa̠inɦø̞`. The pinned UGTPHON README itself shows `키키 → kçikçi` and `킥킥 → kçik̚kçik̚`, so the `kç` sequence is part of the upstream annotation convention and must not be discarded as a typo by default. Its correspondence to the ClippyFirst IPA contract still needs a source-specific, evidence-backed mapping. The `ø` examples remain a review target, not an automatically mapped or discarded symbol.

This inventory narrows the work required for the adapter, but it is not the adapter. All source symbols and diacritics remain preserved, and all 366 shared-form conflicts remain unadjudicated.


## Conflict-pattern triage — 2026-10-26

A second-stage, reproducible triage script is now wired into the pinned-corpus workflow:

- Script: `scripts/analyze_korean_ipa_conflict_patterns.py`.
- Tests: `tests/test_analyze_korean_ipa_conflict_patterns.py`.
- Output: `korean-ipa-conflict-patterns.json`, uploaded alongside the existing queue and separate train/dev corpora.
- It summarizes all 366 conflict forms, preserves every UGTPHON candidate occurrence rather than silently choosing the first, distinguishes repeated occurrences from distinct target strings, counts cross-corpus candidate pairs and literal code points, and ranks high-frequency forms for review.
- The report is explicitly `DIAGNOSTIC_TRIAGE_ONLY`. It does not infer phone alignment from character-level differences, choose a gold pronunciation, convert either source to ClippyFirst broad IPA, or generate a runtime rule.
- The occurrence multiplicity is important, but it must not be confused with pronunciation variation. Inspection of the generated queue shows that a high occurrence count can simply repeat the same target string; the report therefore counts both raw candidate occurrences and distinct target strings. No target is declared gold merely because it repeats often.

The exact-head workflow produced 366 queued source forms and 803 cross-corpus candidate pairs. In the artifact, no form had more than one distinct UGTPHON comparison-target string among its retained occurrences; for example, `진짜` has 78 corpus occurrences but repeats the same target string. Thus occurrence frequency is not independent corroboration or a set of 78 pronunciation variants. Example target-string differences include SIGMORPHON `ka̠ːnɯŋɦa̠da̠` vs UGTPHON `ka̠nɯŋɦa̠da̠` for `가능하다`, `ka̠ɭt͈ɯŋ` vs `ka̠ɭdɯŋ` for `갈등`, and `kɘːin` vs `kʌ̹in` for `거인`. These are **examples of disagreement, not adjudicated corrections**. In particular, `ː`, `ɘ`, `ʌ̹`, `t͈`, and `d` must not be mapped or deleted just because one spelling is more frequent.

### Review order

1. Start with high-frequency source forms to inspect provenance and duplicate structure, then separately investigate any form that truly has multiple distinct UGTPHON target strings; resolve the annotation schema and candidate status before comparing corpora.
2. Review repeated, source-grounded correspondence hypotheses (including length marking, `ɘː` vs `ʌ̹`, `ɲ` vs `n`, `ʎ` vs `ɭ`, and fortis/aspiration/voicing notation) against primary Korean phonetic sources and the exact source convention.
3. Record one-to-one, one-to-many, many-to-one, or unmapped status in a versioned adapter table, with examples, reviewer status, and information-loss consequences.
4. Only after independent review, apply the mapping to a separate eligible comparison set; keep source raw strings immutable and retain ambiguous cases as unmapped.

The triage artifact is not the independent phonetic review itself. The 366 forms remain `UNADJUDICATED`, and the production runtime remains unchanged.


### Exact-head triage artifact results

The conflict-triage code now validates the exact dataset IDs/revisions/target representations, rejects duplicate queue forms and contradictory decision flags, and explicitly tests the distinction between repeated target occurrences and distinct target strings.

Exact-head verification on `b0568099c2a2102196eb393e74529e2f8f353484`:
- Corpus audit, pinned train/dev preparation, queue generation, typed packets, and conflict report: [run 40314470436](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314470436) PASS; artifact [12645294759](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314470436/artifacts/12645294759).
- Full tests (Python 3.11/3.12/3.13, browser, build, clean wheel install): [run 40314470455](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314470455) PASS.
- System verification: [run 40314470467](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314470467) PASS.
- Master artifacts: [run 40314470417](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314470417) PASS.
- Scratch teacher training and dev error analysis: [run 40314470435](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40314470435) PASS.

Report counts for the 366 form-level conflicts:
- 803 SIGMORPHON×UGTPHON candidate-occurrence pairs are compared because UGTPHON source forms repeat across sentences.
- 0 exact target-string pairs across those candidate occurrences; 292 candidate pairs become equal only under the explicitly diagnostic removal of `ː`/`ˑ`. Those 292 are not independent forms and do not authorize length deletion.
- 33 forms have at least five UGTPHON candidate occurrences. `진짜` occurs 78 times, but all 78 occurrences carry the same target string `t͡ɕint͡ɕ͈a̠`; `보고` occurs 21 times with one target string. Repetition is not independent corroboration.
- 0/366 forms have multiple distinct UGTPHON comparison-target strings in this eligible queue. This finding is scoped to the builder's selected canonical token annotations; it does not assert that the complete upstream dataset has no variants.

The report ranks source-form frequency and makes the candidate-pair denominator explicit. It is not phonetic adjudication, segment alignment, or evidence for a ClippyFirst symbol mapping.

## Additional upstream provenance check: IPA-Dict's stated transcription level

The pinned UGTPHON README says token phoneme annotations are looked up from IPA-Dict and checked by native-speaker annotators, with uncovered forms transcribed manually. The upstream IPA-Dict README at inspected commit [`972cd67dd5f96bc5660e28070cde26e3928abcd7`](https://github.com/open-dict-data/ipa-dict/blob/972cd67dd5f96bc5660e28070cde26e3928abcd7/README.md) describes its entries as broadly phonemic, optimized for readability/usefulness to learners, and notes that pronunciations can vary across reference works. It also credits the Korean subset to `korean-word-ipa-dictionary`, extracted from Korean Wiktionary.

This is relevant because a broadly phonemic dictionary target and a roughly-phonemic WikiPron/Wiktionary-derived SIGMORPHON phone sequence need not encode the same features. However, the inspected IPA-Dict commit is **not proven to be the exact revision embedded/used by the pinned UGTPHON release**. The UGTPHON metadata does not provide that precise IPA-Dict source revision in the inspected README. Therefore this upstream description supports the need for source-specific convention handling, but it does not adjudicate any of the 366 individual forms or authorize symbol substitution.

New provenance acceptance criterion: recover and pin the exact IPA-Dict snapshot used for the UGTPHON Korean targets, or record that source revision as irrecoverable. Until then, treat the IPA-Dict description as context only and retain the raw UGTPHON targets unchanged.


## Additional provenance and licensing gate — 2026-10-26

The pinned UGTPHON README at [`ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`](https://github.com/naver-ai/UGTPHON/blob/ef0d5a09c2ea1874c7206020f875cbd9cfea2f54/README.md) explicitly says canonical forms are looked up in IPA-Dict, checked by native-speaker annotators, and manually transcribed when uncovered. It identifies the Korean IPA-Dict lexicon file as `data/ko.txt` with 62,447 entries, but does **not** identify the exact IPA-Dict commit or file hash used for those labels.

The separately inspected IPA-Dict README at [`972cd67dd5f96bc5660e28070cde26e3928abcd7`](https://github.com/open-dict-data/ipa-dict/blob/972cd67dd5f96bc5660e28070cde26e3928abcd7/README.md) credits Korean data to `laviande22/korean-word-ipa-dictionary`, extracted from Korean Wiktionary, under CC BY-SA 4.0. This establishes a relevant upstream rights/provenance fact, **not** that this exact IPA-Dict revision was the one embedded in UGTPHON. UGTPHON labels its Korean subset Apache-2.0 while also describing IPA-Dict-derived annotations; the relationship between those stated terms and the upstream attribution/share-alike terms needs rights-holder/legal clarification before redistribution or commercial reuse of derived annotation artifacts is treated as cleared. This record is a risk flag, not a legal conclusion.

Consequences for this repository:

- Continue using the pinned UGTPHON Korean data only within the documented research workflow and retain source attribution/provenance.
- Do not redistribute IPA-Dict data, recreate `data/ko.txt`, or commit extracted label dumps to this repository.
- Keep short-lived CI artifacts separate from checked-in project data; before relying on derived annotations in a public product or releasing a derived corpus, obtain a source-specific rights review.
- The exact IPA-Dict snapshot remains **BLOCKED / not recoverable from the inspected pinned UGTPHON metadata**. The current IPA-Dict README is contextual evidence only and must not be substituted as the missing source pin.
- No source-specific IPA mapping, pronunciation decision, or production rule is justified by this licensing/provenance finding.

## Partial narrow IPA implementation (2026-10-26)

The engine previously raised an error for `ipa_level="narrow"`. A first explicitly partial, deterministic narrow profile now exists, while the default `broad` profile remains unchanged.

### Implemented, source-backed scope

- Lenis Korean `ㅅ` is represented as `[sʰ]` in the partial narrow profile. The Korean phonetics literature describes /s/ as phonetically aspirated; see the discussion of Cho, Jun & Ladefoged's Korean fricative findings in [High-toned [il] in Korean](https://escholarship.org/uc/item/0xd5n4gk).
- Before the reviewed high-front contexts `ㅣ`, `ㅖ`, and `ㅑ`, the profile uses `[ɕʰ]`. Kang (2010) reports robust early spectral differences for Korean /s/ before /i, ye, ya/ and also reports that /yu/ and /yo/ differ; therefore this first profile deliberately does **not** generalize the palatalized form to every y-glide vowel. See [Kang (2010), DOI 10.17959/sppm.2010.16.1.3](https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001444770).
- Fortis `ㅆ` remains `[s͈]` in this profile. The available evidence for its palatalization is mixed, so the engine does not infer `[ɕ͈]` from the lenis `ㅅ` pattern.

### Explicit exclusions and target boundary

This is **not a complete narrow transcription**. It does not model /h/ allophony, lateral retroflexion, dialect variation, prosody, or speaker-specific realization. Korean /h/ can be voiced or deleted after sonorants in Seoul speech, and variation differs by dialect; see Kang & Lee (2019), [The Realizations of /h/ in Seoul and Gwangju Koreans](https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002495941). The Korean liquid literature also reports substantial variation and associates retroflex lateral realizations particularly with pause proximity, so a global `l → ɭ` substitution is not justified; see Crosby & Dalola (2021), [CC BY 4.0 article](https://journals.linguisticsociety.org/proceedings/index.php/PLSA/article/view/5002).

The profile emits `transcription_profile.target_compatible=false`. `transliterate_korean(..., ipa_level="narrow")` therefore fails closed and withholds Ukrainian orthography instead of passing this partial narrow IPA into the current target correspondence table. The broad IPA path and its Ukrainian target behavior remain unchanged.

### Acceptance

- `DONE_VERIFIED` only after exact-head CI passes the new narrow-profile tests and existing broad regressions.
- `PARTIAL` as a complete narrow-IPA system: additional allophones require source evidence, explicit variability/uncertainty handling, positive and negative controls, and independent IPA adjudication.
- No Charsiu output has been copied into production. The neural teacher is used to identify high-value review areas; the implemented sibilant rules are independently supported by the cited phonetics literature.
## 2026-10-26 controlled broad/narrow comparison correction

The first completed Charsiu dev artifact [40334001997](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40334001997) must not be used to claim that the partial narrow profile improved the engine. It compared a broad full-pipeline baseline (including lexical IPA overrides) with a narrow direct-renderer baseline (without those overrides), and the narrow path also failed to retain unresolved-pronunciation abstentions. That conflated profile effects with lexical-override and coverage effects.

The runner was corrected to render broad and narrow from one shared post-rule syllable analysis, exclude lexical IPA overrides from both controlled renderings, preserve unresolved abstentions in both, and report profile sensitivity separately from the full production pipeline. Raw IPA conventions remain unreviewed relative to ClippyFirst broad IPA; profile metrics are diagnostic only and cannot by themselves justify Ukrainian target adaptation.

The deterministic rule inventory also now has source-backed browser parity for R011/R012/R013/R014/R015, including exact NIKL §28 물가[물까] and 봄비[봄삐] cases and the attached ending 할게[할께]. New official source pages are registered. Exact-head CI and the corrected Charsiu dev artifact were queued at update time; no pass is claimed.
## 2026-10-26 cross-runtime inventory closure

Beyond the controlled IPA profile correction, the exact source-backed pronunciation inventory was reconciled across Python and browser runtime:
- R002 formal exact forms: 33 in both runtimes, including newly mirrored 앉아라 and 없어도.
- R009 word-internal n-insertion: 29 exact forms in both runtimes; R009 phrase insertion: six exact phrase keys in both.
- R013 adnominal phrases: nine exact keys in both runtimes.
- R003/R004/R007/R010/R011/R012/R014/R015/R016 exact form inventories also match by a new automated parity test.

This closes source-table drift, not the IPA convention problem. The Charsiu model's output convention still lacks an independent mapping to ClippyFirst broad IPA, and the controlled profile-sensitivity workflow is still queued. The first run's apparent narrow-profile gain is not valid evidence. Full tests and system verification are also queued; no pass is claimed.

