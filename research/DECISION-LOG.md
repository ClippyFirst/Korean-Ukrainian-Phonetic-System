# Decision Log

Record consequential linguistic, data, architecture, testing, licensing, and release decisions. Keep entries append-only. If a decision changes, add a superseding entry rather than erasing history.

## Entry template
### DEC-YYYY-NNN — Short title
- Date:
- Status: proposed / accepted / rejected / superseded
- Context/problem:
- Evidence and sources:
- Options considered:
- Decision:
- Consequences and trade-offs:
- Affected files/rule IDs/runtimes:
- Validation/tests:
- Revisit when:

---

## DEC-2026-001 — Preserve IPA-first architecture
- **Date:** 2026-10-15
- **Status:** accepted as a project invariant; verify actual compliance during Phase 0.
- **Context:** Parallel Hangul-to-Ukrainian substitution can diverge from pronunciation analysis and makes output difficult to explain and validate.
- **Evidence:** Existing project architecture and master directive; Phase 0 must verify all execution paths.
- **Options:** Direct orthographic substitution; independent Ukrainian conversion; conversion through pronunciation representation and IPA.
- **Decision:** Keep the canonical path pronunciation analysis → IPA → Ukrainian rendering. No independent Hangul-to-Ukrainian shortcut may bypass it.
- **Consequences:** Clearer diagnostics and layer-specific tests; IPA representation and mapping must be explicit and well tested.
- **Validation:** Add architecture/contract tests after runtime entry points are inventoried.
- **Revisit when:** Only if evidence requires a formally equivalent representation that preserves the IPA-first contract.

## DEC-2026-002 — Keep heuristic morphology explicitly lower-confidence
- **Date:** 2026-10-15
- **Status:** accepted as a transparency invariant; implementation must be verified.
- **Context:** Surface-form heuristics can license alternations without sufficient lexical or morphological evidence.
- **Evidence:** Existing soft morphology design documentation; exact current code and behavior remain to be audited.
- **Options:** Apply heuristics silently; disable all uncertain cases; provide opt-in, marked, fail-closed heuristic output.
- **Decision:** Heuristic results must remain explicitly labelled and must not be presented as official normative certainty. Strict behavior remains the default unless the audited product contract says otherwise.
- **Consequences:** Some cases remain unresolved, but users are not given unsupported confidence.
- **Validation:** Verify confidence/status propagation, strict-mode defaults, and that heuristics cannot license excluded rule classes.
- **Revisit when:** A validated lexical/morphological analyzer and independent evaluation justify a revised policy.

## DEC-2026-003 — Practical browser mode is strict to the pinned JavaScript port
- **Date:** 2026-10-21
- **Status:** accepted and merged to main in PR #167.
- **Context/problem:** Research lexical corrections after G2P made the public practical mode cease to reproduce the chosen upstream JavaScript port.
- **Evidence:** Direct adapter-vs-port regression gate over 18 fixed cases; exact-head CI runs 39597726122, 39597726175, 39597726128, and 39597726141; merged implementation commit fde3113fe97a34582228abcd870e64a690cf9d09.
- **Options considered:** silently correct upstream output; keep port output and document divergences; route practical mode through the native research engine.
- **Decision:** Practical mode preserves pinned port output, then maps that surface through the IPA adapter. Research mode remains separate. No lexical override may rewrite the practical surface or IPA.
- **Consequences and trade-offs:** Exact behavioral parity is reproducible, but upstream output is not treated as normative gold. Known divergences include 값어치 (port 갑써치; NIKL 가버치), 넓죽하다 (port 널쭈카다; NIKL 넙쭈카다), and 읽고 (port 익꼬; NIKL 일꼬).
- **Affected files/rule IDs/runtimes:** src/app/g2pk_web.js; src/main.js; tests/g2pk-browser-parity-gate.test.mjs; tests/fixtures/g2pk-surface-regression.json; public browser runtime.
- **Validation/tests:** All four exact-head CI groups passed before merge; main deployment workflow passed on merge commit.
- **Revisit when:** The user explicitly changes the practical-mode contract or a versioned port upgrade is proposed with a new parity corpus.

## DEC-2026-004 — Ukrainian target output remains an explicitly provisional project policy
- **Date:** 2026-10-21
- **Status:** accepted as a documentation/claim boundary; empirical validation remains open.
- **Context/problem:** Ukrainian transcription scholarship reviewed by the project addresses mainly proper names and includes disagreements; it does not establish one universal mapping for all Korean vocabulary.
- **Evidence:** docs/ukrainian-target-review-2026-10-10.md; research/UKRAINIAN-TARGET-LAYER-COMPARISON-2026-10-16.md; mechanical IPA-to-target consistency test; source register entries for Shchehel (2009) and Kovalchuk (2011).
- **Options considered:** claim one mapping is authoritative; silently adopt one proper-name proposal for all words; preserve current mapping as a project policy and label it provisional.
- **Decision:** Preserve the inspectable IPA layer and the existing explicit IPA-to-Ukrainian mapping as a practical project approximation. Do not call it an official Ukrainian standard, an empirically optimal mapping, or a validated universal proper-name policy. Do not rewrite individual lexical targets without evidence.
- **Consequences and trade-offs:** Mechanical consistency can be tested now, while perceptual quality and policy preferences remain unresolved. A reader study and independent review are required before stronger claims.
- **Affected files/rule IDs/runtimes:** data/korean/canonical_correspondence.csv; src/app/engine_ipa.js; src/korean_ukrainian/ukrainian_adapter.py; README.md; index.html.
- **Validation/tests:** Existing model-wide IPA/target consistency tests validate reproducibility only, not target optimality.
- **Revisit when:** At least two independent Korean/Ukrainian reviewers and reader-evaluation evidence are available.

## DEC-2026-005 — Soft morphology must fail closed on ambiguous liaison and keep cross-runtime status parity
- **Date:** 2026-10-21
- **Status:** implemented and verified by exact-head CI on 2026-10-21; PR #169 is the integration vehicle.
- **Context/problem:** Python soft_formal_licenses could emit a generic R002 formal license for ambiguous 어/아 sequences such as 값어치, while the browser layer deliberately refuses to guess §15-sensitive liaison.
- **Evidence:** Existing browser negative controls in tests/soft-heuristic-morphology-formal-endings.test.mjs; shared fixture tests/fixtures/soft-morphology-parity.json added in this branch.
- **Options considered:** loosen the browser guard; let Python guess; align Python with the browser fail-closed boundary and test both.
- **Decision:** Python soft mode no longer emits generic R002 licenses for 어/아, for ㅎ clusters handled by R003, or for simple-coda §15-sensitive environments. A shared fixture checks positive low-confidence cases and negative ambiguity/boundary cases in Python and JavaScript.
- **Consequences and trade-offs:** Some forms remain unresolved rather than guessed; this is intentional. This decision is not complete until exact-head CI passes.
- **Affected files/rule IDs/runtimes:** src/korean_ukrainian/soft_morphology.py; tests/test_soft_morphology_parity.py; src/app/soft_morphology.js; tests/soft-morphology-parity.test.mjs.
- **Validation/tests:** tests/build/Python 3.11–3.13 passed [39601258671](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258671); browser G2P integration passed [39601258672](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258672); system verification passed [39601258670](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258670); corpus artifacts passed [39601258668](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258668). Local execution remains unavailable in the API-only environment.
- **Revisit when:** A source-backed morphological analyzer or independent evidence supports a narrower rule for a previously blocked form.

## Decision: Revised Romanization is a parallel audit output, not an IPA intermediate (2026-10-28)

- **Status:** adopted for the PR implementation; full standards conformance remains PARTIAL.
- **Decision:** expose Korean Revised Romanization (RR) as a separate diagnostic display derived from the resolved Hangul surface form. Keep the production chain Hangul → Korean phonology → IPA → Ukrainian adaptation unchanged. Never derive IPA or Ukrainian output from Roman letters.
- **Rationale:** RR is a Latin-script standard based on standard Korean pronunciation, not an English pronunciation guide. It can help users cross-check a resolved Korean form, but its letter sequence does not preserve all IPA distinctions. Reverse conversion is ambiguous and is not part of this change.
- **Official source:** [NIKL Romanization of Korean](https://www.korean.go.kr/front_eng/roman/roman_01.do); official sound-change examples include 백마[뱅마], 신문로[신문노], 종로[종노], 왕십리[왕심니], 별내[별래], 신라[실라], 같이[가치], and 굳히다[구치다].
- **Implementation:** `src/app/romanization.js`; UI in `index.html` and `src/main.js`; methodology in `system.html`; tests in `tests/romanization.test.mjs`; details and acceptance gaps in `docs/KOREAN-ROMANIZATION-RR-2026-10-28.md`.
- **Safety against false certainty:** if the upstream G2P path supplies no surface form, the UI displays an em dash instead of romanizing the original spelling as if pronunciation had been resolved.
- **Verification:** isolated Node.js harness passed 6/6 tests, including all 11,172 modern precomposed Hangul syllables. Full repository test/build/browser verification is not yet confirmed.
- **Revisit/acceptance:** before merge, pass exact-head CI and browser checks; complete a source-backed NIKL RR conformance matrix. The current implementation is a basic RR renderer, not a claim of complete conformance.


## DEC-2026-006 — Version browser and Python artifacts independently
- **Date:** 2026-11-04
- **Status:** accepted as the prospective repository policy; historical intent not established.
- **Context/problem:** `package.json` is version 1.0.0 and private, while `pyproject.toml` is version 0.6.0 and defines an installable Python distribution. Treating the numeric difference as drift would incorrectly assume a single shared release artifact.
- **Evidence:** current package metadata and scripts; browser Vite/Pages role; Python distribution metadata and CLI entry point.
- **Options considered:** force both values to match; leave the difference undocumented; define two independent version streams.
- **Decision:** maintain independent browser-application and Python-distribution versions. Bump only affected artifacts; coordinated releases may record both versions without requiring equal numbers. Do not publish the private npm package unless the owner changes that policy.
- **Consequences and trade-offs:** avoids meaningless synchronized bumps and accurately reflects separate release surfaces. It does not prove why the original values were chosen.
- **Affected files:** `package.json`, `pyproject.toml`, `docs/VERSIONING-POLICY.md`.
- **Validation/tests:** metadata and package roles inspected; no version value changed. Exact-head CI remains required for any future metadata/runtime change.
- **Revisit when:** the project adopts one unified release artifact or changes the browser package's private/public distribution status.


## DEC-2026-007 — Adopt ClippyFirst purpose-limited project licence
- **Date:** 2026-11-05
- **Status:** accepted by project owner; implementation committed on the documentation/licensing continuation branch, pending PR review and merge.
- **Author identity:** Vitalii Volodymyrovych Tkachuk, publishing under the authorial pseudonym **ClippyFirst**. Project start year: 2026.
- **Context/problem:** The repository had no root project licence. The owner wants scientific reuse of published service results and the Korean-to-Ukrainian correspondence table, while retaining control over reuse of the technical implementation.
- **Decision:** Apply one custom ClippyFirst Project License to original project materials controlled by the author. Permit ordinary use of the official public web service and attributed use, quotation, citation and scholarly reproduction of individual service results and the correspondence table solely for genuine scientific research. Require the author's prior written permission for source-code reuse, self-hosting, mirroring, integration, modification, porting, redistribution, or other technical reuse not expressly granted.
- **Attribution:** Credit “ClippyFirst (Vitalii Volodymyrovych Tkachuk)” and link to the repository. Substantial table reproduction/adaptation must identify the project table and disclose changes.
- **Third-party boundary:** The custom licence does not override vendored Apache-2.0 software, BSD-3-Clause Hanja data, external corpora, dictionaries, or other third-party rights; their own terms remain applicable.
- **Consequences and trade-offs:** This is a custom, purpose-limited licence and is not an OSI-approved open-source licence. It is not compatible with workflows requiring unrestricted open-source reuse. The licence states the author's intended permissions only for rights the author controls; legal enforceability of table/data restrictions and jurisdiction-specific effects have not been independently assessed.
- **Affected files:** `LICENSE`, `docs/LICENSING-AND-PERMISSIONS.md`, `README.md`, `docs/README.md`, `docs/REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-04.md`, `research/ACCEPTANCE-GATES.md`.
- **Validation:** File presence, links, scope wording and third-party carve-outs must be checked on the final branch head; no code/runtime behaviour is changed by this policy update.
- **Revisit when:** The owner changes scientific-use scope, wants commercial/institutional licensing, accepts third-party contributions under additional terms, or requests a standard open-source licence.


## 2026-11-05 — NIKL normative rules are exclusive to Kozak Kim

- **Status:** accepted owner instruction; implemented and regression-tested on main.
- **Context:** earlier g2pK adapters carried a small set of NIKL-backed surface corrections, lexical IPA overrides and variant/diagnostic overlays. This made the ordinary g2pK path dependent on Kozak Kim's normative evidence and weakened the independence of the comparison baseline.
- **Decision:** NIKL Standard Pronunciation Rules R001–R016 and their exact-form/morphological licenses are owned exclusively by Kozak Kim. The browser and Python g2pK adapters must preserve the raw pinned g2pK Hangul surface and derive IPA from that surface without importing Kozak Kim NIKL rules, lexical surface corrections, IPA overrides, variant surfaces or diagnostic-only lexical statuses. The vendored upstream code is not modified.
- **Implementation:** `src/app/g2pk_web.js` and `src/korean_ukrainian/g2pk_engine.py` now implement the isolated baseline; Kozak Kim retains its source-backed rule and lexical paths. Regression tests explicitly compare the two behaviors.
- **Consequences:** ordinary g2pK output can differ from NIKL even where a source-backed Kozak Kim form is available. This is intentional; it is not a claim that g2pK is normatively correct. Compare the engines as separate systems and label the reference convention.
- **Validation:** browser suite 1,393/1,393 PASS; Python 3.11/3.12/3.13, wheel installation, teacher-corpus audit, system verification and master artifacts PASS at implementation/test head `1869b8936c17077ac4fde308644d8588c132404c`. Live NIKL inventory was SKIPPED.
- **Revisit/acceptance:** before changing this boundary, obtain explicit owner direction and add a separate engine/profile rather than silently reintroducing NIKL overlays into g2pK.


## 2026-11-05 — exact NIKL §27 forms recovered from UGTPHON context

- **Decision:** add four exact same-eojeol R013 licenses to Kozak Kim only: `해줄것` (`줄>것`), `많을거같이` (`을>거`), `내릴수있는` (`릴>수`), and `존중시킬수도있지만` (`킬>수`).
- **Evidence:** full contexts recovered from `naver-ai/UGTPHON:ko/test.json` at pinned commit `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`; source registry `SRC-UGTPHON-EMNLP-2026`. NIKL Standard Pronunciation Rule §27 supplies the rule; NIKL Q&A 310899 confirms colloquial `거` as a dependent noun. UGTPHON IPA remains a comparator, not normative gold.
- **Scope:** exact-form gates only; no generalization to arbitrary `ㄹ + plain onset` strings. No changes to vendored g2pK or either g2pK adapter.
- **Verification:** Python isolated-form and full-context tests, browser rule tests, negative controls, and Python/browser g2pK isolation tests pass on implementation/test head `be65ee71b9d3f224876875830b30be856f96126f`.
- **Separate retain decision:** `출산` (row `dc_inside_2107`) remains under the existing R012 / NIKL §26 license pending independent review. Do not remove fortition solely to match a single Broad-v2 annotation.
- **Limit:** the historical 239 count is pre-C11/C12; the current 36-row queue is narrower. Four fixes and one provisional retain do not complete the 239-case adjudication. The full post-fix benchmark was not rerun.

## 2026-11-06 — Rule 29 phrase-level candidate remains evidence-limited

- **Decision:** retain ABSTAIN for the three repeated `한국여자로` occurrences (1805/1832/1859) and `홍콩영화들` (643); do not add phrase-level n-insertion runtime rules.
- **New primary evidence:** NIKL Online Q&A 330322 confirms Rule 29 [붙임 2] can apply across two words when they are pronounced as one connected phrase. Registered as `SRC-NIKL-QNA-330322`.
- **Why this does not resolve the cases:** the UGC strings omit standard inter-word spacing and provide no audio or prosodic-boundary annotation. The benchmark IPA is a diagnostic comparator, not independent gold. The NIKL Q&A gives a conditional phrase-level rule, not an exact pronunciation for `한국여자` or `홍콩영화`.
- **Acceptance:** require token-level audio or independently adjudicated IPA plus a defensible phrase/morpheme boundary before changing the engine. The exact compound `연전연패` remains separately licensed; no broad Rule 29 phrase heuristic is added.


## 2026-11-06 — integrate evidence-confirmed 236-candidate rules in Kozak Kim

**Decision:** Treat the 236-row set as benchmark occurrences, not 236 independent phonological rules. Promote only source-backed exact forms and rule environments. Keep profile-convention mismatches, unresolved cases and orthographic normalization outside production phonology.

- Cohort: 15 RULE_CONFIRMED_STANDARD_VARIANT; 181 PROFILE_CONVENTION_MISMATCH_CONFIRMED; 12 ABSTAIN; 28 UNADJUDICATED.
- Runtime coverage: 9 new occurrence-level licenses across seven exact eojeols; five rule-confirmed cases already implemented on the starting branch; one 머리속에 case blocked pending an explicit spelling/semantic normalization contract.
- Exact additions: Rule 5 genitive particles 그놈의 and 자신의; R008 정권, 유사성, 혐오증; NIKL §29 연전연패; NIKL §26 출시미정에. All are exact-word/pair scoped; no productive -권/-성/-증, broad ㄹ+ㅅ, or phrase-level heuristic was added.
- The 40 evidence-limited occurrences are 17 unique token forms; 22 repeats of 아끼셔 and three repeats of 한국여자로 are not independent speakers. The 27 lenis-sibilant mismatches outside Kang (2010)'s /i, ye, ya/ contexts remain unadjudicated; the 쇼 /yo/ case is a separate high-front+round coarticulation candidate, not evidence for a categorical [ɕ] rule.
- The browser/Python parity test checks all seven exact forms and passes on the exact code head. Dictionary long-vowel feature for 유ː사썽 is preserved as IPA length; no speaker-specific acoustic IPA gold is claimed.

**No inference from benchmark metrics:** the paired native/g2pk diagnostic and morphology-consensus ablation remain research-only; the latter shows no exact-rate gain and a small CER regression. Do not promote analyzer consensus or external comparator output to production rules.

**Rights / research blockers:** source register now has 24 items requiring manual classification; NIKL item-level KOGL classification remains unresolved. Official NIKL metadata-only inventory was skipped by workflow policy. Independent acoustic IPA and Ukrainian-reader review remain open.

**Implementation/verification:** PR #436 branch research/236-candidate-review-2026-11-05, exact code head 8a5e6b83f7b6b1377200be3c4bdb330dc4d16de0; system Verify [42180312202](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312202), Tests [42180312303](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312303), browser G2P [42180312258](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312258), research artifacts [42180312182](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312182), test register [42180312181](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312181), external UGTPHON [42180312221](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312221), paired native/g2pk [42180312228](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312228), morphology consensus [42180312341](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312341), morphology adapter smoke [42180312291](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312291). Multi-engine [42180312294](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312294) was in progress; its result is deliberately not asserted here.

## 2026-11-06 — decision: refresh the derived unmapped queue after exact engine integration

- **Decision:** update the derived `kozak-kim-unmapped-mismatch-review-queue-2026-11-05.csv` snapshot to reflect the current Kozak Kim engine rather than retain stale pre-integration outputs.
- **Observed delta:** six occurrences (`545`, `826`, `1610`, `1816`, `1843`, `1870`) no longer have unmapped Broad fragments after exact source-backed rules were integrated. The current queue is 26 rows.
- **Row 341 (`그놈의`):** remains diagnostic. The exact genitive-particle implementation uses the NIKL principal `/ɰi/` and exposes [e] as a permitted variant. The corpus comparator's [e] is not speaker-specific acoustic gold and does not justify replacing the principal reading or removing the occurrence from review.
- **Guardrail:** this is a derived benchmark-output refresh only. The 236-row candidate ledger, source dispositions and g2pk baseline are unchanged. No profile convention or unresolved candidate was promoted to a production rule.
- **Verification:** the committed 26-row CSV was compared row-by-row with the generated queue artifact from run 42181660273 (matching row hashes for all 26 rows); exact-head CI on 59e31ac is rerunning the export/cmp and downstream diagnostics. The multi-engine workflow was still in progress at this snapshot.


## DEC-2026-008 — preserve coda-resyllabification provenance through the ㅢ IPA adapter and scope C14 narrowly

- **Date:** 2026-11-07
- **Status:** accepted for the Korean source/IPA layer; Ukrainian target rendering remains provisional.
- **Context/problem:** the non-initial `ㅢ` → [i] exception was being applied to cases where a preceding coda is resyllabified as the onset. This incorrectly collapsed the NIKL-attested /ɰi/ variants in `삶의` and `협의`.
- **Evidence and sources:** NIKL pronunciation FAQ `mcfaq_seq=5716` and the source-only 40-case adjudication report. NIKL records `삶의` [살믜]/[살메] and `협의` [혀븨]/[혀비].
- **Decision:** preserve coda-origin onset provenance through the IPA adapter (`onset_from_coda` in Python; `__liaison` in Browser). Apply ordinary [i] only to the non-resyllabified consonant-onset case. Keep the internal flags out of the public schema.
- **C14 classification:** reserve `C14_NIKL_GENITIVE_UI_PARTICLE` for the exact, conservative genitive-particle allowlist. It is not a generic resyllabification label; C13 remains the existing lexical-vowel-length cluster. `협의` remains a separate liaison case, not a genitive-particle instance. `그놈의` remains in the broad review queue because its independent e/i mismatch is still unresolved.
- **Consequences:** no productive general-purpose rule or automatic Ukrainian output is licensed by this decision. The /ɰi/ → Ukrainian target choice remains provisional/candidate-only. All 40 residual occurrences remain unresolved as speaker-specific IPA gold.
- **Validation:** exact-head Python/browser regressions, Python 3.11–3.13 tests, browser tests/build, wheel install, source-rights gate and research artifact checks passed on PR #456 head. The long multi-engine run 42414467825 was still running at the last check.
- **Revisit when:** independent speaker-level IPA evidence or qualified review becomes available, or the official NIKL rule/FAQ is superseded.
