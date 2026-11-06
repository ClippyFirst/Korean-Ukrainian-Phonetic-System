> **Superseding status — 2026-11-06, main `f6d282145d985578af3d0a0bedb75197f00e3cb9`.** PR [#447](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/447) is merged (merge commit `3c93a92e9b48c2a1c68d1139137a55c2dd2e7c7e`). All 40 residual occurrences (12 prior ABSTAIN + 28 focused residual) have explicit `ENGINE_POLICY_RESOLVED_NO_AUDIO` dispositions; all 40 remain `UNRESOLVED_NO_AUDIO` for speaker-specific IPA gold. This closes the bounded engine-policy axis, **not** independent pronunciation adjudication.
>
> The merge adds conditional NIKL Rule 29 phrase-mode paths for explicitly spaced `홍콩 영화들`, `한국 여자로`, and `첫 연애` in Python and browser runtimes. Compact spellings do not receive inferred word boundaries. The other 35 occurrences receive conservative retain/no-change policy decisions; they are not 35 new pronunciation rules or 35 new token outputs.
>
> **Verification on the PR head** `6813018d4987822a42225dfa05590916e3030f52`: browser tests **1,413/1,413**, Python 3.11/3.12/3.13, wheel install, teacher-corpus audit, build, source-rights gate, master/research artifacts, exhaustive extraction, UGTPHON, native/g2pk, morphology consensus and adapter smoke passed. The multi-engine benchmark run [42261250219](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42261250219) was **cancelled before producing a benchmark result**; optional CharsiuG2P and ByT5 inference were skipped by policy. No 40-case benchmark score is available. The earlier mandatory multi-engine run [42226435101](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42226435101) passed on an earlier PR #443 head and is a baseline, not a post-#447 score.
>
> Post-merge verification on current main `f6d282145d985578af3d0a0bedb75197f00e3cb9`: [tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42262413712), [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42262413711), [master/research artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42262413691), and [GitHub Pages deployment](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42262413689) all passed. These software checks do not supply missing acoustic gold.
>
> The reconstructed 236-row cohort remains 15 exact standard-form dispositions, 181 profile-convention decisions, 12 abstentions and 28 previously unadjudicated rows. The 40-case engine-policy register is a separate axis; do not rewrite those historical evidence labels. Remaining gates include independent Korean IPA gold, independent Ukrainian target review, proof of original historical cohort membership, and item-level rights review where reuse/redistribution is contemplated. **Readiness remains bounded research prototype; not independently research-certified or release-ready.**

---

# 2026-11-06 — Current acceptance snapshot after PR #443 merge

**Current `main`:** `bb972871a207b1f703503ade980a36cf3b976085`.  
**Verified PR #443 head:** `625d6e3171e30ae7a6aae525dfdd4ded2c5249f8`.

## Software and benchmark gates

| Gate | Status | Evidence / boundary |
|---|---|---|
| Browser regression + public-page build | DONE_VERIFIED | System verification [42226435403](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42226435403): tests, source-rights gate, Vite build and generated-page checks passed |
| Python regression and data integrity | DONE_VERIFIED | Same exact-head system verification run 42226435403 passed |
| Strict source redistribution gate | DONE_VERIFIED, scoped | `npm run audit:source-rights` passed in run 42226435403; zero unresolved positively recorded redistribution blockers. This is not blanket clearance for all cited sources or future reuse |
| Multi-engine IPA diagnostic | DONE_VERIFIED, mandatory steps | Run [42226435101](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42226435101): pinned comparisons, UGTPHON/SIGMORPHON validation, mismatch export, Browser same-occurrence execution, Native/Browser parity and SIGMORPHON lexical-gold steps passed |
| Optional CharsiuG2P / ByT5 inference | SKIPPED | Skipped by workflow policy; not counted as a pass or as independent IPA review |
| Conditional live NIKL crawl | SKIPPED | Conditional job not run on this branch; separate historical access/rights limitations remain |

## 236-occurrence evidence gates

| Disposition | Rows | Acceptance meaning |
|---|---:|---|
| Exact standard-form runtime dispositions | 15 | Ten new exact integrations plus five pre-existing exact licenses; runtime coverage does not establish speaker-level IPA |
| Profile-convention decisions | 181 | Reconciled as bounded profile differences; not 181 categorical Korean sound-change rules |
| Independent Korean IPA abstentions | 12 | Remain blocked pending token-specific evidence and independent review |
| Not individually adjudicated | 28 | Remain blocked pending source/token-level review |
| **Total** | **236** | Reconstructed candidate cohort; not proof of original historical sample membership |

## Remaining research/release gates

- **BLOCKED — independent Korean IPA:** two qualified, independent first-pass annotations on frozen source-linked tokens; blind reconciliation; record speaker, dialect, prosody, transcription profile and uncertainty. Packet generation alone is not review.
- **BLOCKED — Ukrainian target validation:** independent Ukrainian phonetic/orthographic review on frozen IPA inputs, with a separate target acceptance record.
- **BLOCKED — 40 residual occurrences:** 12 abstentions + 28 unadjudicated; require token audio/source crosswalk and expert annotations. Do not fill gaps with comparator strings or guessed IPA.
- **PARTIAL — original historical cohort membership:** reconstructed candidate inventory is reproducible; original 236/239 selection predicate or original member list remains unproven.
- **BLOCKED — any additional third-party redistribution:** the strict gate covers only positively recorded retained/copied material. Before adding any source extract/data, record the exact item, source version, applicable licence/permission, attribution and retained scope. Research purpose alone is not permission.
- **PARTIAL — broader phonological coverage:** implement only gaps named by `research/RULE-COVERAGE.csv` with primary-source evidence, positive/negative controls and Python/Browser parity.
- **DEFERRED — release certification:** no public release claim of independent research certification until Korean IPA and Ukrainian target review, provenance and applicable rights gates are accepted.

**Readiness:** mandatory software and multi-engine diagnostic gates are verified on the merged PR head; the project remains a bounded research prototype, not independently research-certified or release-ready.

---

# 2026-11-05 — Current 236-candidate evidence gate (supersedes earlier interim counts)

**Working branch:** `research/236-candidate-review-2026-11-05` (single continuation branch). **Draft PR:** [#436](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/436). The historical 236-row occurrence baseline remains intact.

| Disposition | Occurrences | Meaning |
|---|---:|---|
| `RULE_CONFIRMED_STANDARD_VARIANT` | 15 | Exact official rule or lexical standard-form evidence; not speaker-specific audio |
| `PROFILE_CONVENTION_MISMATCH_CONFIRMED` | 181 | Exact bounded broad/narrow profile or documented-variation reconciliation; not speaker-specific narrow IPA |
| `ABSTAIN_PENDING_INDEPENDENT_IPA_REVIEW` | 12 | Evidence is insufficient to choose an individual IPA realization |
| `NOT_INDIVIDUALLY_ADJUDICATED` | 28 | Individual evidence review remains incomplete |
| **Total** | **236** | All rows retained for provenance |

**196/236 are dispositioned; 40/236 remain unresolved.** None of the 236 has independent speaker-level acoustic IPA gold. Do not describe the 181 profile cases as independent pronunciation confirmations. The three `연전연패` occurrences (1816/1843/1870) are one source-row/token family, not three independent speakers. The historical 236 membership is reconstructed from pinned replay, not proven original-selector membership.

**Current source register:** 207 records; 3 item-level licenses, 1 not applicable, 180 rights-review required, and 23 manual-classification required (203 remain open). New official negative controls are registered for NIKL Q&A 332662 (`쇼`: no standardized foreign-word pronunciation/IPA gold) and Q&A 328785 (Rule 29 phonological shape alone does not guarantee n-insertion). Kim & Hong (2025) full-text scope is corrected: within-word /iə~ijə/ and /oa~owa/ pairs, not the candidate's /o.ʌ/ numeral boundary.

**Evidence constraints:** no production phonology, IPA gold, Ukrainian target, or benchmark gold changed. IDs 643 (`홍콩영화들`) and 1805/1832/1859 (`한국여자로`) remain open because Rule 29 needs exact lexical/morphological and phrase/prosodic licensing; the official negative control says the segmental shape alone is insufficient. ID 78 (`오조오억배`) remains ABSTAIN because the full-text hiatus study does not test /o.ʌ/ or numeral compounds. ID 606 (`쇼`) remains unadjudicated because NIKL supplies no standard pronunciation entry and no narrow IPA.

**Verification on exact head `785ee15473f83de3583c1d470a4ce477bd8575ab`:** the `tests` workflow (42105728062) passed Python 3.11/3.12/3.13, web, wheel-install and teacher-corpus-audit. The system verify workflow (42105728208) passed Python regression/data integrity and browser regression/build. Master corpus generation (42105728193), exhaustive extraction/validation (42105728166), pinned UGTPHON test split (42105728184), paired native-vs-g2pk comparison (42105728267), and Kiwi/MeCab morphology consensus (42105728074) passed. The multi-engine IPA diagnostic (42105728130) is still in progress. Charsiu train-dev, ByT5/Charsiu inference, and official NIKL metadata-only jobs were skipped by workflow policy, not passed. Source-register integrity and candidate-ledger generator parity passed in Python CI. Local pytest/npm were not run.

---

## 2026-11-05 exact-head continuation — 236-candidate review and comparator status

**PR #436 head:** `169e008bd0aabee34efe05385bcc5f6179f4cc70`. The reproducible 236-row inventory and bibliographic correction are covered by exact-head regressions. Python 3.11/3.12/3.13, browser regression/build, wheel install, teacher-corpus audit, web, paired UGTPHON, pinned UGTPHON, Kiwi/MeCab morphology, corpus generation, external IPA diagnostic, research artifacts and test-case extraction passed. The multi-engine IPA comparison remains in progress. CharsiuG2P, ByT5 and official NIKL metadata-only jobs were skipped by policy; they are not passes. Local pytest/npm were not run.

**Linguistic gate remains BLOCKED:** 213 occurrences have no individual disposition; 22 have evidence-limited ABSTAIN; one occurrence (1140, `출산`) is a provisional source-backed RETAIN pending independent review. The 236 are candidate occurrences, not 236 confirmed errors. Lenis `ɕ → s` and fortis `ɕ͈ → s͈` require separate review. No production IPA or Ukrainian-target change is authorized by comparator metrics.

---

# 2026-11-05 acceptance-gate update — 236-candidate review

## 2026-11-02 acceptance-gate update — Kozak Kim only

## 2026-11-02 — Kozak Kim cross-runtime evidence and parity continuation

**Scope:** Kozak Kim only. Original g2pK code and vendor files remain unchanged. No new general phonological rule was added.

**Repository state:** branch `fix/kozak-kim-broad-version-metadata-2026-11-02`; Draft PR #421 stacked on Draft PR #420; code/test head `b4ace0eba2d1573cd78b1e6a971de5556a0bcb3c`. Starting point was PR #420 head `2db86dd97eab99fc18d5fa30c82febb76d5a4068`. No merge, release, deployment, or branch deletion.

| Work item | Status | Evidence / acceptance |
|---|---|---|
| Browser Broad IPA v2 metadata contract | DONE_VERIFIED | Browser report now keeps numeric `broad_candidate_benchmark_version: 2`; regression test covers actual `evaluateRows()` output. |
| IPA adjudication overlay in Browser runtime | DONE_VERIFIED | App and benchmark merge the existing IPA-adjudication CSV with appended metadata column preserved. `삶의` retains source-backed Hangul `살믜` / `살메`, but IPA and Ukrainian output are withheld. |
| Native R013 false abstention | DONE_VERIFIED | Exact attached `-ㄹ게` / attested `-ㄹ게요` completion gate is shared by rule and abstention logic. Internal substrings `올게이` / `할게이` remain non-R013 controls and return provisional, non-diagnostic-only project IPA. |
| Broad-profile Browser surface coda rendering | DONE_VERIFIED | Shared research profile renders representative final coda (`있다` → `읻따`); default Browser legacy profile remains `있따`. |
| Python regression/data integrity | DONE_VERIFIED | System verification run 41447654924 PASS (`python -m pytest -q`). |
| Browser regression/build | DONE_VERIFIED | System verification run 41447654924 PASS; 1,382 / 1,382 tests; `npm run build`; generated-page checks. |
| Browser/Native occurrence-level IPA parity | PARTIAL | Multi-engine run 41447654927 completed its Browser comparison and parity-audit steps successfully; exact artifact is still being assembled during the SIGMORPHON phase. Do not claim a numerical parity rate until the artifact is read. |
| Full Browser surface parity | PARTIAL | Direct Browser report 13143156104: 2,698 scored / 2,703 eligible. Preliminary comparison to the Native ledger showed 2,693 equal surfaces, four differences on morphology-abstained cases, and six missing Browser surface reconstructions. Final occurrence audit artifact is authoritative. |
| Broad v2 target thresholds | PARTIAL / NOT MET | Browser direct UGTPHON: Broad exact 86.2861%, Broad CER 2.2083%, five unresolved, zero engine errors; target 90%+ exact / CER ≤2% not met. |
| Original g2pK baseline | DONE_VERIFIED | Paired Native/g2pK diagnostic run 41447654997 PASS; no g2pK source/vendor files changed. |
| Independent IPA gold | BLOCKED | Frozen 24-item holdout and reviewer A/B packets exist; two qualified independent reviewers and adjudication are still required. |
| NIKL item-level reuse rights | BLOCKED | Official metadata inventory was SKIPPED; item-level KOGL clearance remains unverified. |
| Ukrainian target adaptation review | BLOCKED | Requires independent Ukrainian phonetic/orthographic expert review. |
| CharsiuG2P / ByT5 inference | DEFERRED | Both optional inference jobs were SKIPPED by workflow policy; no inference result is claimed. |

### Comparative results — do not mix profiles

**Native strict IPA vs original g2pK**, 2,698 paired UGTPHON occurrences:
- Kozak Native: 53.0393% strict exact; 9.0657% CER.
- g2pK: 53.1134% strict exact; 9.2304% CER.
- Kozak has lower CER; g2pK has a 0.0741 percentage-point strict-exact point edge.

**Browser legacy-default vs original g2pK**, 2,698 paired occurrences:
- Exact match tied at 53.4469%.
- Browser CER 8.0728% vs g2pK 8.2072%; paired sentence-cluster 95% CI for Browser-minus-g2pK CER delta: [−0.2246, −0.0531] percentage points.
- This is a separate legacy-default diagnostic, not the shared Broad profile.

**Browser shared Broad v2 direct UGTPHON**:
- 2,698 / 2,703 scored; 86.2861% Broad exact; 2.2083% Broad CER; five unresolved; zero engine errors.
- These corpus-relative metrics are not normative IPA accuracy. The original g2pK adapter uses the project's shared segment renderer, so it is not an independent IPA encoder.

### Exact CI commands and outcomes

- `npm install --no-audit --no-fund` — PASS.
- `npm test` → `node --experimental-strip-types --test tests/*.test.mjs` — PASS, 1,382 tests.
- `npm run build` → dictionary preparation + Vite production build — PASS.
- `test -f dist/index.html && test -f dist/system.html` — PASS.
- `python -m pip install -e ".[dev,all]"` — PASS.
- `python -m pytest -q` — PASS.
- Browser G2P integration run 41447654972 — PASS.
- Paired Native/g2pK run 41447654997 — PASS.
- External UGTPHON diagnostic run 41447654983 — PASS.
- Kiwi + MeCab-Ko morphology consensus run 41447654952 — PASS.
- Exhaustive test-case register extraction run 41447654941 — PASS; extracted classification queue still requires manual review.
- Research morphology adapter smoke run 41447655002 — PASS.
- Optional g2pK integration run 41447654921 — PASS; baseline code/vendor unchanged.
- Multi-engine run 41447654927: multi-engine comparison, Browser same-occurrence comparison, and Native/Browser parity-audit steps PASS; SIGMORPHON benchmark and artifact upload still running at this snapshot.
- NIKL metadata-only inventory — SKIPPED.
- CharsiuG2P and ByT5 inference — SKIPPED.
- Local pytest/npm were not run in this session; verification was performed by GitHub Actions.

**Readiness:** partial research prototype, not release-ready and not research-certified. The next evidence gates are the final multi-engine/SIGMORPHON artifact, independent IPA adjudication, item-level source-rights review, and independent Ukrainian target review.

## Gate decision
Software regressions/build are verified. Broad score targets remain unmet. Runtime parity audit execution passed, but its exact numerical results must be read from the final uploaded artifact before any 99.9% claim. Independent IPA gold, source-rights review, and Ukrainian target review remain blocked by external expert/evidence requirements.

---

## 2026-11-02 — Kozak Kim runtime and Broad IPA v2 gate status

| Gate | Target | Current evidence | Status |
|---|---:|---|---|
| Broad exact match (UGTPHON) | >=90% | Historical raw-artifact recomputation: Native 86.25%; current common-profile exact-head report pending | PARTIAL |
| Broad exact match (SIGMORPHON) | >=90% | Historical raw-artifact recomputation: Native 69.64%; current exact-head report pending | PARTIAL |
| Broad CER | <=2% | Historical Native: 2.22% UGTPHON; 6.23% SIGMORPHON | NOT_MET |
| Native/Browser runtime parity | >=99.9% | New benchmark selects identical `clippyfirst-korean-broad-v1` profile and compares complete surface + raw IPA; exact-head report pending | PARTIAL |
| Strict IPA preservation | No evidence-backed distinctions collapsed | Strict scoring retained; broad sensitivity losses separately reported | PARTIAL — independent convention adjudication pending |
| Independent IPA gold | Two independent reviews + adjudication | Frozen 24-item holdout and separate A/B templates prepared; no reviewer submissions yet | BLOCKED |

The Browser normal-conversion metadata path has been corrected to report the explicitly selected broad profile; a Python/JavaScript normalizer parity test now checks shared edge cases and feature-loss ledgers. Both implementations are present, but the exact-head System Verify 41843473006 passed on 2026-11-04 and these items remain PARTIAL until verified. The R013 change in this continuation is a narrowly scoped correction to the existing NIKL Q&A 330963-backed -ㄹ게 ending license, with positive and negative controls; it is not a new general phonological rule.

Do not use the old 93.81% Browser score as evidence of superiority: it came from `browser-legacy-contextual-v1`, whereas Native used `clippyfirst-korean-broad-v1`. The common-profile run is the only valid runtime comparison.

## Latest evidence snapshot — 2026-11-02 (research prototype; not release acceptance)

| Gate | Status | Evidence / reason |
|---|---|---|
| 0 — Repository integrity | PARTIAL / INSPECTED | Current main `7bbbd7e7`; verified Kozak Kim head `fb5e1686` is a descendant of main. PR #415 → #416 → #417 remains open/Draft; documentation/test PR #419 is open/Draft and stacked on #417. Exploratory PR #418 was closed unmerged after its candidate was found outside the discrepancy ledger; its branch is preserved. PRs #411/#414/#371 were inspected and left untouched as out of scope. |
| 1 — Source and licensing | PARTIAL / EVIDENCE-LIMITED | Source register: 167 rows (157 REVIEW_REQUIRED, 7 MANUAL_CLASSIFICATION_REQUIRED, 2 item-level licenses, 1 NOT_APPLICABLE). NIKL MCFAQ 5716 directly supports Hangul readings 삶의[살믜]/[살메], not IPA; project IPA candidates remain provisional. Item-level NIKL reuse terms remain unchecked. |
| 2 — Rule and data integrity | PARTIAL / EVIDENCE-LIMITED | C01–C07 profile literature and C09 length sources are recorded; C08 has eight contexts, five reconstructed because the original extraction table is missing. Two exact R013 same-eojeol licenses have full-sentence Python/browser tests. No new rule is justified for the five native abstentions: three R002 boundary cases, one R003 noisy-form case, and 삶의 pending independent IPA. `유사성` remains unresolved; no suffix-wide `-성` rule. |
| 3 — Independent evaluation corpus | PARTIAL | Seven blind C01–C07 packets contain 42 entries / 39 source rows; no independent reviewer submissions. UGTPHON and SIGMORPHON multi-engine comparisons completed, but both are diagnostic and not normative IPA gold. Training readiness remains NOT READY: zero additions explicitly marked independently adjudicated IPA gold and 24 frozen holdout cases without IPA gold. |
| 4 — Runtime correctness | PASS for verified head `fb5e1686`; broader parity PARTIAL | Run 41420395798: Python/data integrity and browser regression/build/generated-page checks PASS; browser 1,374/1,374. On continuation test head `4225cea7`, push run 41425704134 and PR run 41425711289 also PASS (Python/data, browser/build/generated pages, 1,374/1,374); extraction run 41425711296 PASS. Browser G2P 41420395791, extraction 41420395790, native pair 41420395800, UGTPHON 41420395792, morphology consensus 41420395813, adapter smoke 41420395784, multi-engine 41420395805 all PASS. NIKL metadata inventory, CharsiuG2P and ByT5 SKIPPED. Local pytest/npm not run. Added a regression guard for the four real R002/R003 native abstentions; existing `삶의` regression continues to protect the official variants and diagnostic-only IPA status. |
| 5 — Product quality | BLOCKED / EVIDENCE-LIMITED | No independent Ukrainian target review or user study. Korean IPA metrics do not validate Ukrainian orthography. |
| 6 — Release and independent review | BLOCKED | Two qualified blind IPA submissions, C08 provenance/prosody, C09 vowel quality/syllabification, C10 AP/IP contract, item-level rights and Ukrainian target review remain outstanding. |

### Latest paired evidence

- Browser UGTPHON, run [41420395792](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41420395792), artifact `13129915994`: 2,699 shared; exact match 53.4272% for both; Kozak CER 8.0794% vs g2pK 8.2138%; delta −0.1344 pp; 95% sentence-cluster CI [−0.2246, −0.0531] pp.
- Native UGTPHON, run [41420395800](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41420395800), artifact `13130305158`: 2,698 shared; Kozak exact 53.0393% / CER 9.0744%; g2pK on the same subset exact 53.1134% / CER 9.2304%. Five native abstentions; zero engine errors. g2pK has a small exact-match point edge; Kozak has lower CER.
- Ten-engine run [41420395805](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41420395805), artifact `13129993707`: UGTPHON native 2,698 scored (exact 53.0393%, CER 9.0744%, PER 9.5378%) vs g2pK 2,703 (exact 53.0892%, CER 9.2285%, PER 9.6472%); SIGMORPHON native 998 (exact 35.8717%, CER 14.6100%, PER 16.1721%) vs g2pK 999 (exact 35.3353%, CER 14.8222%, PER 16.3126%). Denominators differ; these are per-engine aggregates, not paired deltas.
- All comparisons use a shared project segment-to-IPA renderer for g2pK surface output. Results are diagnostic, not normative IPA gold, not an independent native g2pK IPA encoder, and not a Ukrainian-target evaluation.

**Disposition: research prototype; review-packet-ready, not research-certified or release-ready.**

---

# Release Acceptance Gates

A release is not accepted merely because the build succeeds or documentation describes intended behavior. Each gate requires recorded evidence. Mark each gate not_assessed, pass, fail, or blocked; link the relevant commit, report, CI run, corpus version, or deployment check.

## Gate 0 — Repository integrity
- [ ] Default branch and commit SHA recorded.
- [ ] Branches, PRs, and relevant issues inventoried; pagination limitations noted.
- [ ] Valuable unmerged work reviewed and assigned a disposition.
- [ ] No destructive cleanup without preserving useful history.

## Gate 1 — Source and licensing
- [ ] Normative claims point to exact official source passages and article identifiers.
- [ ] Source conflicts are recorded and resolved with rationale or left explicitly unresolved.
- [ ] Third-party code/data versions and licenses are recorded.
- [ ] Attribution, redistribution, and derivative-work obligations are satisfied.
- [ ] No unsupported source-completeness claim is made.

## Gate 2 — Rule and data integrity
- [ ] Every in-scope rule has a stable identifier.
- [ ] Conditions, exclusions, ordering dependencies, and exceptions are documented.
- [ ] Canonical data is identified; generated artifacts are reproducible.
- [ ] Duplicate/conflicting rules are detected and dispositioned.
- [ ] Uncertain cases remain explicitly uncertain.

## Gate 3 — Independent evaluation corpus
- [ ] Gold examples have source/provenance metadata.
- [ ] Expected values are independently reviewed or directly sourced.
- [ ] Positive, negative, boundary, interaction, and regression cases exist.
- [ ] Holdout separation and leakage risks are documented where relevant.
- [ ] Corpus coverage and blind spots are reported.

## Gate 4 — Runtime correctness
- [ ] Relevant automated tests pass with exact commands and environment recorded.
- [ ] Korean surface pronunciation and IPA are evaluated separately from Ukrainian rendering.
- [ ] Browser, Python, CLI, and API are tested independently where supported.
- [ ] Cross-runtime differences are measured and documented.
- [ ] Error handling, unsupported input, and fallback behavior are tested.
- [ ] No silent engine substitution or confidence-status loss occurs.

## Gate 5 — Product quality
- [ ] Public interface reflects the reviewed source revision.
- [ ] IPA and Ukrainian output match the documented contract.
- [ ] User-facing uncertainty and limitations are visible.
- [ ] Accessibility, responsive layout, performance, and failure states are checked.
- [ ] Documentation and examples match released behavior.

## Gate 6 — Release and independent review
- [ ] CI/build evidence is tied to the release commit.
- [ ] Deployment is verified from the public URL or equivalent evidence.
- [ ] Relevant branch changes are integrated or explicitly deferred with reasons.
- [ ] Independent review challenges source coverage, corpus quality, architecture, and completion claims.
- [ ] Remaining defects and risks are published.
- [ ] Release decision and reviewer evidence are recorded.

## Release report template
- Release/version:
- Commit SHA:
- Date:
- Gate statuses:
- Test commands and results:
- Evaluation corpus/version and metrics:
- Cross-runtime differences:
- Deployment evidence:
- Known limitations:
- Deferred issues and rationale:
- Reviewer:
- Decision: accepted / rejected / conditional

## Historical evidence snapshot — 2026-10-21 (superseded by latest snapshot above)

This status snapshot supersedes the untouched template checkboxes above for the current mainline and the follow-up branch. It is not a release acceptance decision.

| Gate | Status | Evidence / reason |
|---|---|---|
| 0 — Repository integrity | PARTIAL | Main at `a50ce37cb6052d74ea8ad34c0baf74a91bac7378` at session start; 173 branches inventoried across two API pages; zero open PRs and zero open issues at inspection. Sixteen relevant branches were compared with main. Most are heavily behind/diverged; no blind merges/cherry-picks were made. The branch inventory is a snapshot, not a deletion or cleanup pass. |
| 1 — Source and licensing | PARTIAL / BLOCKED | NIKL Standard Pronunciation Rules page and selected rule examples checked; upstream g2pK 0.9.4 and ntdgo package 1.0.1 metadata/licenses checked. Vendored Apache-2.0 notice and license exist. Repository-wide root LICENSE remains an owner decision; target-source reuse and Kovalchuk institutional-copy verification remain open. |
| 2 — Rule and data integrity | PARTIAL | The rule-coverage matrix is now populated for R001–R016 plus article inventory and IPA→Ukrainian mapping. Exact morphology licenses and generated-corpus gates exist. Productive morphology, full lexical coverage, and independent source adjudication remain incomplete. |
| 3 — Independent evaluation corpus | PARTIAL | The 18-case surface fixture now separates pinned-port outputs from normative comparators: 11 directly attested NIKL examples/Q&A and 7 rule-derived candidates. All 18 still have `ipaGoldStatus=not_independently_adjudicated`; there is no holdout accuracy estimate. See `docs/audits/SURFACE-REGRESSION-SOURCE-ADJUDICATION-2026-10-21.md`. |
| 4 — Runtime correctness | PASS for recorded mainline CI; follow-up branch pending CI | Mainline exact-head CI passed browser tests/build, Python 3.11/3.12/3.13, system verification, corpus artifacts, and Pages deployment. The follow-up branch exact-head CI passed: tests/build/Python 3.11–3.13 [39601258671](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258671), browser G2P integration [39601258672](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258672), system verification [39601258670](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258670), and corpus artifacts [39601258668](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39601258668). The changes are eligible for merge; scientific and owner-dependent release gates remain open. Local tests are unavailable in this API-only execution environment. |
| 5 — Product quality | PARTIAL | Public UI now states that practical mode reproduces the JS port and may differ from NIKL. A direct interactive live-site test of the full long passage, mobile/responsive behavior, and assistive-technology flow was not completed in this session. |
| 6 — Release and independent review | BLOCKED for a scientifically validated release | Mainline is a technically deployed research preview. The public HTTP and repository-fixture headless browser smokes are verified. The exact prior user-pasted passage (if different), independent IPA gold, independent Ukrainian target-policy validation, and the project-wide license decision remain unresolved. Do not label this a validated transcription standard. |

### Exact workflow evidence on the previously merged practical-mode commit

- Browser G2P integration: [39597726122](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39597726122)
- General tests / build / Python 3.11–3.13: [39597726175](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39597726175)
- System verification: [39597726128](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39597726128)
- Master table / corpus artifacts: [39597726141](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39597726141)
- Pages deployment for code merge commit: [39598199808](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39598199808)

### Follow-up branch acceptance

Branch: `fix/soft-morphology-parity-and-release-gates-2026-10-21`.

Added:
- fail-closed Python soft-liaison guard aligned with browser semantics for 어/아, ㅎ clusters, and §15-sensitive environments;
- shared cross-runtime fixture and Python/JavaScript tests;
- a source-status gate separating normative surface candidates from port expectations;
- public UI disclaimer and correction of stale manifest/status claims;
- source register and rule coverage matrix updates.

**Do not merge until CI verifies the shared parity tests and static build.** Remaining scientific and owner-dependent blockers are not merge blockers for this bounded code/docs follow-up, but they remain release blockers.


### Final exact-head CI and live browser result — 2026-10-21

Code/deployment commit `dae8ebdabb396d1be51afbe891d80c9c48a29f1c`; code-equivalent mainline docs/evidence commit `a8996112a01ec43f90b7c297b975906e4b44ab83).

- Tests/build/Python 3.11–3.13: PASS [39604039126](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39604039126).
- System verification: PASS [39604039157](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39604039157).
- Corpus generation/artifacts: PASS [39604039164](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39604039164).
- Pages deploy, public HTTP smoke and headless Chromium interaction: PASS [39604039154](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39604039154).
- The browser smoke exercised the 1,443-character repository fixture and verified non-empty Ukrainian/IPA output, the practical JS-port mode, and absence of page errors. It does not establish scientific accuracy or prove identity with the earlier user-pasted passage.


## Current native research-engine evidence snapshot — 2026-10-23

This addendum supersedes technical-gate observations from the older snapshot above; it does not change scientific/rights blockers into passes.

| Gate | Current status | Evidence / remaining acceptance criterion |
|---|---|---|
| 0 — Repository integrity | PARTIAL | PRs #257–#260 merged; exact merge commits and CI evidence are in the native-engine report and canonical handoff. Post-merge Pages deployment was not independently verified for these native-only changes. |
| 1 — Source and licensing | PARTIAL / BLOCKED | Live NIKL inventory workflow remains skipped because the source crawl is blocked (HTTP 403). Item-level KOGL markings remain unchecked for many records; project root license remains owner-dependent. |
| 2 — Rule and data integrity | PARTIAL | Raw base and every dated lexical overlay are audited for primary/alternate IPA syntax and syllable alignment. Every token must map to a core source feature vector. This does not adjudicate phonetic truth or exhaust all article subparagraphs/exceptions. |
| 3 — Independent evaluation corpus | BLOCKED_SPECIALIST_ADJUDICATION | The 20-case broad-IPA queue remains unadjudicated. Acceptance requires two distinct qualified reviewers, independent transcription/review, explicit length/boundary decisions, and documented reconciliation. Ukrainian target review is separate. |
| 4 — Runtime correctness | PARTIAL | Exact PR-head CI passed Python 3.11–3.13, web tests, system/data integrity, browser/build, generated artifacts, and optional g2pK integration. Local tests were not run in the API-only session. |
| 5 — Product / deployment | PARTIAL | Native API now retains source word/syllable boundaries and renderer preserves word spaces. Live public deployment/smoke for these specific merge commits was not checked. |
| 6 — Release / independent review | BLOCKED | Independent IPA and Ukrainian target evaluation, full rule/exception coverage, item-level rights, and source-access closure remain acceptance blockers. |

Readiness: **research preview / partial prototype**, not release-ready as a scientifically validated transcription standard. The skipped NIKL job is not a pass.


## Native empty-input fail-closed gate — 2026-10-23

| Gate | Status | Evidence / reason |
|---|---|---|
| Empty-input contract | DONE_VERIFIED at code/test head | PR #261 branch `research/native-empty-input-fail-closed-2026-10-23`; shared validation rejects empty/whitespace-only input and unsupported characters before native analysis; empty target segment lists remain unresolved. |
| Regression verification | PASS at implementation/test head `052f8ef0155be23ad86b8f58f94b8c7a5ffa3af6` | Tests/Python 3.11–3.13/web build [40006290986](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006290986); system/browser/Python integrity [40006290971](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006290971); corpus artifacts [40006290630](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006290630); optional g2pK [40006292252](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006292252). |
| Live official-source inventory | BLOCKED / skipped | The workflow's live NIKL inventory job was skipped; no pass is claimed. |
| Scientific release acceptance | BLOCKED | Independent IPA gold, Ukrainian target review, complete normative rule coverage, item-level licensing evidence, and source access remain outstanding. |
| Final PR acceptance | DONE_VERIFIED for PR #261 | PR #261 merged as `1860616a15a664ef189ffdaff50fe559aa1339a5` after final-head tests/Python 3.11–3.13/web [40006505307](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006505307), system verification [40006505329](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006505329), corpus artifacts [40006505319](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006505319), and optional g2pK [40006505314](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006505314) passed. Scientific release gates remain blocked. |


## Native IPA fortis-feature gate — 2026-10-23

| Gate | Status | Evidence / reason |
|---|---|---|
| Source fortis distinction | DONE_VERIFIED at implementation/test head | PR #262 adds `fortis` to supported source vectors and tests plain/fortis/aspirated stops and fortis affricates. |
| Registry-wide feature coverage | PASS at head `a7b159baccba147837d979e3428a6cca486662b1` | Raw base and overlay IPA audit now requires `consonantal`, `syllabic`, and `fortis`; candidate selection preserves source feature provenance. |
| Regression CI | PASS at implementation/test head | Tests/Python 3.11–3.13/web [40006952606](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006952606); system/browser/Python integrity [40006952310](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006952310); corpus [40006952531](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006952531); optional g2pK [40006952377](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40006952377). |
| Ukrainian target fortis policy | PARTIAL / evidence-limited | No target-side fortis feature is defined in the reviewed Ukrainian feature schema; no ranking weight or target mapping was invented. |
| Live source inventory | BLOCKED / skipped | NIKL inventory job skipped. |
| Final PR acceptance | PENDING | Re-run exact-head CI after the documentation commits. |


## Direct IPA adapter empty-input gate — 2026-10-23

| Gate | Status | Evidence / reason |
|---|---|---|
| IPA input contract | DONE_VERIFIED at implementation/test head | PR #264 validates string input before target-inventory initialization and rejects an empty supported-token sequence. |
| Regression CI | PASS at head `4c7bda56c6feda4b82b1ffa9c9028c7fb02d8ce3` | Python 3.11–3.13/web [40007944889](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007944889); system/browser/Python integrity [40007944954](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007944954); corpus [40007945023](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007945023); optional g2pK [40007945019](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40007945019). |
| Live official-source inventory | BLOCKED / skipped | NIKL inventory job skipped, not passed. |
| Scientific release acceptance | BLOCKED | Independent IPA gold, Ukrainian target review, complete normative coverage, item-level rights evidence, and permitted source access remain outstanding. |
| Final PR acceptance | DONE_VERIFIED for PR #264 | PR #264 merged as `5bb9178243604d169c2209671a953f8683b48408` after final-head tests/Python 3.11–3.13/web [40008141619](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40008141619), system verification [40008141681](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40008141681), corpus artifacts [40008141709](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40008141709), and optional g2pK [40008141856](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40008141856) passed. Scientific release gates remain blocked. |

## Current scientific release blocker snapshot — 2026-10-23

| Gate | Status | Evidence / acceptance criterion |
|---|---|---|
| Independent IPA evaluation | BLOCKED_SPECIALIST_ADJUDICATION | Existing queue: 20 cases; reviewer A 0/20, reviewer B 0/20. Requires two distinct qualified reviewers, independent transcription, and documented reconciliation. |
| Ukrainian target evaluation | BLOCKED_SPECIALIST_REVIEW | Requires separate independent review of IPA→Ukrainian mappings, ambiguity, and orthographic readability; source IPA adjudication does not close this gate. |
| Normative rule coverage | PARTIAL, finite-example coverage mapped | The dedicated article fixture maps all 30 articles: 29 `verified`, Article 1 `not-applicable`; the separate phenomenon matrix does not prove atomic exhaustive coverage of every subparagraph, exception, variant or productive environment. |
| Source rights | BLOCKED_RIGHTS_REVIEW | Current source register has 100 data rows; item-level KOGL marking and reuse scope remain unchecked for multiple records. |
| Official-source access | BLOCKED_EXTERNAL_ACCESS | Live NIKL inventory remains skipped/blocked; do not count a skipped job as a pass. |
| Pages deployment smoke | DONE_VERIFIED for main commit `dae9ed1bf5806fd8d33d86e70e0fb607b998d04e` | Post-merge Pages workflow [40009408019](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40009408019) passed Python 3.11/3.12/3.13, browser tests/build, public HTTP smoke, and live Playwright practical-mode interaction. The new regression test on PR #268 still needs exact-head CI. |
| Release readiness | BLOCKED | Research preview / partial prototype only; no scientific release claim until independent review, atomic coverage, rights, source access and deployment gates have evidence. |

## Corrected normative-coverage and rights snapshot — 2026-10-23

The dedicated `tests/fixtures/standard-pronunciation-rule-coverage.json` maps articles 1–30 in order (29 `verified`, Article 1 `not-applicable`). The CI gate verifies evidence-index integrity, including exact test-title references. This is finite normative-example coverage, not a claim of exhaustive productive or lexical/morphological coverage. `research/RULE-COVERAGE.csv` is a separate cross-runtime phenomenon matrix.

Current main `dae9ed1bf5806fd8d33d86e70e0fb607b998d04e` has 100 data rows in `research/SOURCE-REGISTER.csv`; multiple records still lack item-level KOGL marking review. The 20-case IPA queue has 0/20 independent submissions in each reviewer slot. The Pages smoke assertion fix is merged and post-merge public HTTP + Playwright smoke passed in run 40009408019. The live NIKL inventory step was skipped/blocked, not passed.

Readiness remains research preview / partial prototype, not a scientifically validated release.

## Post-merge Pages verification — 2026-10-23

Deployment verification is `DONE_VERIFIED` for main commit `dae9ed1bf5806fd8d33d86e70e0fb607b998d04e`: [run 40009408019](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40009408019) passed Python 3.11–3.13, browser tests/build, public HTTP smoke and live Playwright practical-mode interaction. This verifies the deployment workflow and tested UI path for that commit only. The live NIKL source inventory was skipped/blocked, not passed. The added smoke-contract regression test remains pending exact-head CI on PR #268.

## Follow-up branch — source-register rights audit, 2026-10-23

Main `b795575c0d8b122123561c682e510ed5c171b5cc` has passed tests, system verification, corpus artifact generation, and deployed Pages public HTTP + live Playwright smoke. These checks verify the current software/deployment path, not scientific correctness.

The new branch `research/source-rights-ledger-validator-2026-10-23` adds a read-only CSV parser/auditor and a conservative rights-review queue generated from `research/SOURCE-REGISTER.csv`. The report separates explicit unresolved status from ambiguous free-text status; it does not modify the register or infer legal permission. Exact-head CI is pending. Source-rights acceptance remains blocked until item-level evidence is reviewed.

The read-only rights triage on the current 100-row register yields 96 `REVIEW_REQUIRED`, 2 `MANUAL_CLASSIFICATION_REQUIRED`, 1 `ITEM_LEVEL_LICENSE_RECORDED`, and 1 `NOT_APPLICABLE_RECORDED`. These counts describe register wording only and do not grant reuse permission or replace item-level human review.

## Follow-up branch — blinded IPA review packet, 2026-10-23

Main `1f91d0c3817153d8a07004778ed916fda39d4ec5` passed tests, Python 3.11–3.13, browser G2P, system verification, corpus artifacts, and Pages live smoke ([run 40012122568](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40012122568)).

The new branch `research/blinded-ipa-review-packets-2026-10-23` provides a one-way, read-only projection of the canonical 20-case IPA queue for reviewer A or B. It hashes the exact queue revision and omits candidate IPA, the other reviewer’s record, reconciliation, target review, and source notes. Exact-head CI remains required; reviewer submissions themselves are external evidence and are not simulated by code.

## Current mainline status after PR #270 / #271 — 2026-10-23

Main is `df733c7f7afdf1262bea6c46d07876d6f315ccaf`. Exact-head PR #271 CI passed 1,195 Node tests (0 failures), Python 3.11–3.13, system verification, browser G2P and corpus artifacts. Post-merge main tests, system verification, browser G2P and corpus artifacts passed. Pages run [40012736801](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40012736801) completed successfully: deploy, public HTTP smoke, and live Playwright practical-mode interaction passed.

Source rights triage: 100 rows; 96 review required, 2 manual classification required, 1 item-level license recorded, 1 not applicable recorded. This is not a permission decision. IPA review tooling is ready, but independent submissions remain 0/20 in each slot. The live NIKL inventory is skipped/blocked, not passed.

## Follow-up branch — validating reviewer submissions

The branch `research/validate-ipa-review-submissions-2026-10-23` pairs the blinded packet generator with a strict returned-packet validator. The validator checks exact queue revision hash, all case IDs, unchanged source evidence, no forbidden extra fields, reviewer slot, and required review metadata/values. It does not grade IPA or assert that a reviewer is qualified. The test fixtures are synthetic only and must never be treated as linguistic evidence. Merge only after exact-head CI passes.

## Follow-up branch — NIKL article reference index

A repeatable test-reference index is proposed in `research/nikl-article-test-index-2026-10-23`. It records explicit filename and text references for articles 1–30, including missing references, without inferring unlisted range members. It is not an exhaustive coverage report. Acceptance still requires source-backed atomic rule inventory and linked positive, negative, interaction, runtime-parity, and independent-review evidence.

## Exact-main evidence checkpoint — 2026-10-23

At main snapshot `3a2052c9c27d7af6b5efa7c744d9e2ef14a70d41`, CI recorded 1205 Node tests passing with zero failures, Python 3.11/3.12/3.13 passing, browser G2P integration passing, system browser regression/build and Python integrity passing, and master table/research artifact generation passing. Pages run [40015664039](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40015664039) subsequently completed successfully, including public HTTP and live Playwright practical-mode smoke.

The official-source inventory job explicitly logged HTTP 403; its workflow handling as a nonfatal blocked dependency is not evidence that source crawling succeeded. The release gate remains blocked by independent IPA review (0/20 submissions in each slot), Ukrainian target-layer review, unproven atomic article coverage, and unresolved item-level rights (96 review-required, 2 manual classification, 1 license-recorded, 1 not applicable out of 100). The reference index is not coverage proof.


## Follow-up exact-form IPA adjudication guard — 2026-10-24

Branch: `research/native-engine-unresolved-cases-2026-10-24`; PR #281.

| Gate | Status | Evidence / acceptance criterion |
|---|---|---|
| Exact surface-Hangul evidence for 삶의 | DONE_VERIFIED | NIKL MCFAQ 5716 attests [살믜] and [살메]. These are Korean pronunciation spellings, not IPA. |
| Form-specific IPA acceptance | DONE_VERIFIED for guard behavior | The dated overlay `data/korean/lexical_additions_ipa-adjudication-2026-10-24.csv` marks the project-rendered `sal.mɰi` candidate as `diagnostic_only_unresolved_pronunciation` pending review. Native API keeps IPA inspectable, adds an `IPA_ADJUDICATION` unresolved context, and blocks Ukrainian output for this form. Regression tests cover the status and target block. |
| Runtime / data integrity | PASS at code/test state `ea14a6d9b7f332a3b88a181d841bb34841eb893d` | Tests + Python 3.11–3.13 + web build [40027594483](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40027594483); system verification [40027594485](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40027594485); corpus artifacts [40027594415](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40027594415); optional g2pK [40027594547](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40027594547); UGTPHON diagnostic [40027594361](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40027594361). |
| Live official-source inventory | BLOCKED / skipped | The official NIKL metadata-only job was skipped; do not count as pass. |
| Independent IPA gold | BLOCKED_SPECIALIST_ADJUDICATION | Two qualified reviewers must independently adjudicate IPA convention, ㅢ realization, syllable boundaries, and accepted alternatives. |
| Ukrainian target quality | BLOCKED_SPECIALIST_REVIEW | Separate review on frozen, adjudicated IPA inputs; evaluate phonetic preservation and Ukrainian reader usability separately. |
| Compact morphology | BLOCKED_INPUT_ANALYSIS | `많이본` and `좋아보인다고` remain unresolved without explicit segmentation or validated morphology/spacing analysis. |
| Scientific release | BLOCKED | Current status remains research preview / partial prototype. CI verifies implementation, not phonetic truth or target-layer quality. |

The later commits `0348043653e7489e98e0f68dc2bb9a820e9cb99a` and `baff6c24c996fc0d92a34ef808d24a4d031d06a8` are documentation-only additions after the green code/test state; the Python/CSV/test implementation did not change after the verified code/test state. Local execution was unavailable because GitHub DNS resolution failed in this environment.


### 2026-10-24 correction after completed ㅢ literature search

- **Primary candidate updated:** 삶의 [살믜] → candidate broad IPA `sal.mi`; official alternative [살메] → `sal.me`. This follows the reported general surface pattern in Park, Cho & Han (2016), DOI 10.17959/SPPM.2016.22.1.35, but the paper does not directly measure 삶의. Both remain diagnostic-only and require independent adjudication.
- **Variation representation:** the native IPA result now exposes `ipa.lexical_alternatives`; it does not silently select the alternate as a Ukrainian target.
- **Target-layer guard:** lexical target reference is provisionally aligned to `салмі`, but the transliteration API returns no Ukrainian output while the IPA adjudication gate is unresolved.
- **Independent reviewer queue:** expanded from 20 to 21 cases, adding IPA-021 for 삶의. The extra case has an official NIKL source URL and no candidate IPA; the queue remains blinded and reviewer fields remain empty. The 20-case fixed-count assumptions in packet/validator tests were replaced with canonical queue-size assertions.
- **Source registry:** added SRC-PARK-CHO-HAN-2016-UI as limited corpus/acoustic evidence; exact-form coverage and item-level reuse rights are still unverified.
- **Verification:** system verification run 40028573329 and tests run 40028573395 passed after the IPA/queue changes; the official NIKL metadata-only job was skipped. The source-register row and corresponding expected row-count/rights-triage test were updated afterward; verify the newest CI runs before marking the full current branch green.


### Final closeout — 2026-10-24

Latest executable/test changes passed all available CI at code/test commit `30f1eab3043148193a74fb5d977033b74937726c`: [tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40028810510), [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40028810736), [corpus artifacts](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40028810589), [g2pK integration](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40028810621), and [UGTPHON diagnostic](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40028810616). The official NIKL inventory was skipped. A subsequent source-register wording-only commit updated the queue count to 21; CSV structure remains valid (102 rows, 12 columns, no width errors).

The engine now uses `sal.mi` as the better-supported broad-surface candidate for [살믜], exposes `sal.me` as a separate alternative for [살메], marks both diagnostic-only, and blocks Ukrainian target output. The 21-case blinded reviewer queue includes IPA-021 삶의 with no candidate IPA and no reviewer data. Full scientific acceptance remains **BLOCKED_SPECIALIST_ADJUDICATION** and **BLOCKED_SPECIALIST_REVIEW**; release readiness remains research preview / partial prototype.

### NIKL inventory follow-up — actual execution evidence (2026-10-24)

The earlier status “skipped” described the ordinary PR run only. The gate was then explicitly executed on diagnostic branch `research/nikl-metadata-inventory-2026-10-24` using the existing metadata-only crawler and three official URL variants:

| Workflow run | Endpoint variant | Crawl outcome |
|---|---|---|
| [40029487614](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40029487614) | `www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002` | BLOCKED: HTTP 403 |
| [40029571329](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40029571329) | `www.korean.go.kr/kornorms/m/m_regltn.do?regltn_code=0002` | BLOCKED: HTTP 403 |
| [40029630066](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40029630066) | `korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002` | BLOCKED: HTTP 403 |

The collector's exact block reason is “Official source denied or rate-limited this request (HTTP 403); do not bypass access controls.” The workflow job can conclude success because `continue-on-error` and the classifier intentionally treat this specific block as an evidence-bearing warning. This is **not** an accepted inventory: no complete manifest was emitted. The official page is visible in public search-index results, but direct open also returns 403; indexed snippets cannot prove complete 1–30 coverage or source/article hashes. The first run's log artifact is [available here](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40029487614/artifacts/12533748777).

| Gate | Current status | Acceptance criterion |
|---|---|---|
| Official NIKL source inventory | **BLOCKED_EXTERNAL_ACCESS** | Obtain permitted direct retrieval or an official export; validate all 30 articles with zero missing/duplicate/incomplete records; emit and audit metadata-only source/article hashes and manifest. Do not bypass access controls or retain full text before terms review. |

This replaces “skipped” as the overall task status: the collector has now been attempted three times against approved official endpoints, with the access block evidenced and classified. The blocker remains external source access, not an unrun job or an untested parser.


## NIKL local HTML inventory update — 2026-10-24

This entry supersedes earlier descriptions of the technical inventory as merely skipped. The exact repository-held `한국어 어문 규범.htm` was parsed by the existing local-import route on dedicated branch `research/nikl-local-html-import-2026-10-24`.

| Gate | Status | Evidence / remaining acceptance |
|---|---|---|
| Article inventory from the committed HTML | DONE_VERIFIED | [Import run 40072018648](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072018648), [PR-head parity tests 40072260312](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072260312), [main schema/reproducibility run 40072283788](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072283788), and [main tests run 40072283801](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072283801); 30/30 articles; zero missing, duplicate, unexpected, or incomplete records; metadata-only manifest at `reports/nikl/standard-pronunciation-manifest.json`; source SHA-256 `11dccd3c6eafb5167a6f448c2ccb5fc45fd698c5b2d1570ed3d1e5c177fa7a1e`. |
| Authenticity of the local capture as a complete, unmodified official response | BLOCKED_EXTERNAL_ACCESS | Direct NIKL HTTP endpoints previously returned 403; local import records no HTTP status, retrieval timestamp, or robots decision. Acceptance requires an authorized official export/capture provenance or permitted direct retrieval. |
| Rights / terms for article text and derived redistribution | BLOCKED / not_assessed | No permission is inferred from the presence of the HTML in the repository. Review applicable source terms and item-level rights before retaining or redistributing article text. |
| Human source adjudication | PARTIAL / DONE_VERIFIED for article lead-ins | All 30 article lead-ins and their first separately labelled `해설` paragraphs are recorded independently against the committed HTML snapshot; Git blob identity is checked in CI. A 19-case native-engine regression now pins source-backed Korean surface/IPA pairs and optional-reading metadata. Full subparagraph/table/example-level independent adjudication remains open; do not promote explanatory illustrations to normative gold without source classification. See `docs/NIKL-HUMAN-REVIEW-2026-10-24.md`. |
| Scientific release acceptance | BLOCKED | Independent broad-IPA adjudication and Ukrainian target-layer review remain outstanding; source inventory completion alone is not a release gate pass. |

The importer manifest is metadata-only: per-article title, anchor, normalized character count, extraction status, and SHA-256 are retained; raw HTML and article text are not. The workflow validates the schema and requires re-generated metadata to match the committed manifest except for the naturally changing `importedAt` timestamp.


### NIKL manifest schema v2 metadata boundary — 2026-10-24

The repository-held HTML inventory and schema v2 metadata-boundary correction are `DONE_VERIFIED` for technical completeness (30/30 source blocks; source SHA-256 `11dccd3c6eafb5167a6f448c2ccb5fc45fd698c5b2d1570ed3d1e5c177fa7a1e`). PR #284 changes the article `title` to the label only, records `normativeTextSha256`/`normativeCharCount`, and explicitly labels the larger block hash as including official commentary and examples. Exact-head tests [40074199214](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40074199214), system verification [40074199217](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40074199217), NIKL schema/reproducibility [40074199284](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40074199284), and corpus artifacts [40074199207](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40074199207) all passed on the tested code snapshot. Capture authenticity, source reuse terms and human rule/example spot-check remain `BLOCKED` / evidence-limited. This is not linguistic or product-release acceptance.


## Human review of saved official NIKL HTML — 2026-10-24 (PR #286)

| Task | Status | Evidence / remaining acceptance criterion |
|---|---|---|
| Article lead-in inventory and normative/explanatory separation | DONE_VERIFIED | `tests/fixtures/nikl-article-review-1-30.json` records all 30 article lead-ins and first `해설` paragraphs separately. `tests/nikl-article-review-1-30.test.mjs` verifies ordering, anchors, exact normalized text and the saved HTML Git blob SHA. |
| Cross-rule Korean surface and broad-IPA regressions | DONE_VERIFIED at tested PR head | `tests/nikl-human-review-surface-regression.test.mjs` checks 19 source-backed cases against the native engine and lexical evidence; optional readings remain explicit. CI tests run 40075240569 passed. |
| Browser/system and Python regression verification | DONE_VERIFIED at tested PR head | System verification run 40075240571 passed browser tests/build, Python regression/data integrity, and the metadata-only NIKL inventory workflow's expected blocked-dependency classification. Corpus/artifact run 40075240593 passed. Python 3.11, 3.12 and 3.13 matrix jobs passed in run 40075240569. |
| Live NIKL retrieval | BLOCKED_EXTERNAL_ACCESS | Direct official endpoints return HTTP 403. The committed HTML was used as a reproducible snapshot; no access-control bypass was attempted and the live crawl is not marked as passed. |
| Full rule/subparagraph adjudication, independent IPA gold and Ukrainian target review | PARTIAL / BLOCKED_SPECIALIST_REVIEW | The new review does not claim exhaustive human adjudication of every table, exception, cross-reference or productive environment. IPA and Ukrainian adaptation remain separate layers; release readiness remains research preview / partial prototype. |

Merged PR: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/286  
Merge commit: `c4efa90e1b24b33a8692c383f58b6bf966506871`.


## Follow-up branch — source-backed complex-coda regression expansion, 2026-10-24

| Task | Status | Evidence / acceptance boundary |
|---|---|---|
| Extend exact-form NIKL surface/IPA regression | DONE_VERIFIED — PR #288 merged | Cross-rule engine test covers 24 source-backed Korean surface/project-IPA pairs, including five added lexical forms: 늙고[늘꼬], 않았다[아낟따], 얇은[얄븐], 읽어[일거], 헛웃음[허두슴]. A sixth case, 긁고[글꼬], is stored in `tests/fixtures/nikl-surface-only-complex-coda.json` and guarded by `tests/nikl-surface-only-complex-coda.test.mjs`; its source is NIKL Online Q&A qna_seq=328946, https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=&pageIndex=1&qna_seq=328946. The surface is attested, but the source supplies no IPA, so the Python pipeline's existing unresolved-status guard remains in force and the form is not added to the lexical IPA/target table. |
| IPA provenance | PARTIAL / project analysis | The cited NIKL pages attest Hangul pronunciation spellings, not IPA. Broad IPA values are explicit project analysis and must remain independently adjudicated. |
| Ukrainian target | BLOCKED_SPECIALIST_REVIEW | Target syllables remain provisional and are not normative gold labels. |
| Generalization to productive morphology / unseen compounds | BLOCKED_INPUT_ANALYSIS | Exact-form examples must not be generalized to all ㄼ/ㄺ stems or unknown compounds without evidence and morphology. |
| Release readiness | BLOCKED | Research preview / partial prototype. The independent IPA queue, Ukrainian target review, source rights and permitted live-source retrieval remain open. |

Merged PR: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/288  
Merge commit: `94b59752ebcd9b38f0e7a537dd662e3fea1f3ac4`. Exact-head CI at PR head `57365db812f7d428ccfc6434121c2233d1f0d8db` passed: 1,213 Node tests (0 failures), Python 3.11/3.12/3.13, browser tests/build, Python regression/data integrity, and corpus artifact generation. Run links: [tests 40075912255](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912255), [system verification 40075912274](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912274), [corpus artifacts 40075912368](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912368). [Paired native-vs-g2pk diagnostic 40075912232](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912232) and [UGTPHON diagnostic 40075912262](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912262) passed. The multi-engine diagnostic benchmark [40075912330](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912330) was still running at the last check; its result is not claimed here.


The first exact-head CI run for PR #288 exposed an important acceptance failure: adding `긁고` to the lexical table changed its Python status from `unresolved` to `provisional`, even though the source only attests Hangul surface spelling and does not provide IPA. That promotion was reverted. The source is now preserved in a separate surface-only fixture with `ipa_candidate: null`, `ukrainian_target: null`, and an explicit unresolved expectation. The five other new exact-form regressions use already-existing project IPA candidates and do not claim independent IPA gold.


## Post-merge verification — complex-coda review follow-up, 2026-10-24

| Task | Status | Evidence |
|---|---|---|
| Exact-form regression expansion and surface-only guard | DONE_VERIFIED | PR #288 merged to main as `94b59752ebcd9b38f0e7a537dd662e3fea1f3ac4`; source-backed IPA candidates are regression-pinned separately from the `긁고` surface-only evidence. |
| JavaScript regression suite and production build | PASS | [Workflow 40075912255](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912255): 1,213 tests, 1,213 passed, 0 failed; build passed. |
| Python matrix | PASS | Python 3.11, 3.12 and 3.13 jobs passed in workflow 40075912255. |
| Browser/system verification | PASS | [Workflow 40075912274](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912274): browser tests/build and Python regression/data integrity passed. The metadata-only NIKL job's success is not a claim that the live crawl succeeded. |
| Generated corpus / research artifacts | PASS | [Workflow 40075912368](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912368). |
| Paired native-vs-g2pk and UGTPHON diagnostics | PASS | [Workflow 40075912232](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912232); [workflow 40075912262](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912262). These are diagnostics, not independent phonetic gold. |
| Multi-engine IPA benchmark | PASS as diagnostic execution | [Workflow 40075912330](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912330) completed and emitted artifact [12552947424](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912330/artifacts/12552947424). Metrics and limitations are recorded below; this is not normative gold evaluation. |
| Scientific release acceptance | BLOCKED | Independent IPA gold, Ukrainian target-layer review, full subparagraph/table adjudication, source-rights review and permitted live NIKL retrieval remain open. |


### Multi-engine benchmark outcome (2026-10-24)

Artifact: [multi-engine-korean-ipa-diagnostic.zip](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40075912330/artifacts/12552947424), benchmark `multi-engine-ipa-diagnostic-v1`. Dataset: 275 rows, 2,703 eligible Hangul token occurrences, 1,907 unique words. The reference set is the noisy user-generated UGTPHON Korean test split, not a balanced official pronunciation standard. Scores are diagnostic only; normalization preserves fortis, aspiration and length, while stripping a defined set of narrow diacritics and separators.

| Engine | Exact match | Character error rate | Coverage | Abstentions / unresolved |
|---|---:|---:|---:|---:|
| ClippyFirst native | 24.41% (95% CI 22.12–26.97%) | 17.06% | 98.22% | 48 |
| g2pk 0.9.4 | 24.97% (95% CI 22.80–27.38%) | 16.69% | 100% | 0 |
| phonemize 2.0.1 | 20.05% | 21.36% | 100% | 0 |
| hangul_to_ipa | 14.95% | 30.99% | 100% | 0 |
| KoG2P | 14.87% | 26.08% | 100% | 0 |
| eSpeak NG Korean | 8.14% | 39.05% | 100% | 0 |

**Interpretation:** the native engine's point exact-match score is slightly below g2pk on this dataset, with overlapping bootstrap intervals; it abstains on 48 token occurrences rather than forcing output. These scores do not establish which IPA is correct because UGTPHON annotations are not a fully adjudicated independent gold set, and the g2pk adapter shares parts of the project's representation layer. The benchmark does not evaluate Ukrainian adaptation. It is evidence that the diagnostic pipeline executes reproducibly, not a release-acceptance pass for linguistic correctness.


## Exact-head verification update — 2026-10-26 (research continuation)

This update supplements the older snapshot above; it does not turn historical checkboxes into a release approval.

| Gate | Current status | Evidence / remaining acceptance criterion |
|---|---|---|
| 0 — Repository integrity | PARTIAL | Default `main` remains `a452054a669de28426404d1110731715083423bb`. Research branch `research/strict-teacher-guided-rule-mining-2026-10-26` carries a large, long-lived research delta and PR #339 remains open/Draft; do not merge it wholesale merely because individual workflows pass. Isolated fixes #342 and #343 were merged into the research branch only. |
| 1 — Source and licensing | BLOCKED/PARTIAL | NIKL live source inventory remains skipped in metadata-only CI due to access restrictions; root project license is still an owner decision; IPA symbol conventions and Ukrainian target policy need independent review. Do not infer rights from third-party license notices. |
| 2 — Rule and data integrity | PARTIAL | Fail-closed, loss-preserving register generator is verified. Exact-head artifact on merged research commit `19832224daab7d17b56df75485bb5461ea3c9ef9`: 644 lexical records, 359 test files, 387 source files, 6,801 lexical-to-test text links, 34,573 source lines, 5,241 assertion/test-declaration candidates; artifact ZIP SHA-256 `28271fcbf18402e8046399721e6c6be1db42d4998e94d6f2dee7c9ca9d0b223e`. Candidate links/lines are not a semantically adjudicated case register. |
| 3 — Independent evaluation corpus | BLOCKED/PARTIAL | Scratch teacher and pinned corpus workflows are research-only. Cross-source IPA convention mapping remains unadjudicated; the 24-form holdout and native strict cases must not be used to fit rules. Acceptance requires independent source-specific IPA mapping and a truly held-out evaluation set. |
| 4 — Runtime correctness | PASS for the isolated merged research head; overall branch still under current-head verification | On merged research commit `19832224daab7d17b56df75485bb5461ea3c9ef9`, [system verification run 40408709236](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40408709236) passed browser regression/build and Python regression/data integrity; [register run 40408709171](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40408709171) passed inventory generation and stable-ID checks. The exact current research head `256b27a454c992218ca87a0fdf58ea6135071560` has a new full workflow batch in progress; do not extrapolate the prior green run to that head. |
| 5 — Product quality | PARTIAL | Passing CI does not independently verify the complete long-text UX, accessibility, mobile behavior, or public Pages deployment for the latest code. |
| 6 — Release and independent review | BLOCKED | Still a research-ready partial prototype. Release acceptance requires independent Korean phonetic adjudication, Ukrainian adaptation review, source/license resolution, current-head full CI, and public deployment confirmation. |

### Exact-head CI batch currently running

On research head `256b27a454c992218ca87a0fdf58ea6135071560`, workflow runs were observed in progress: tests `40410859903`, system verification `40410859949`, case-register extraction `40410859892`, browser G2P integration `40410859840`, UGTPHON diagnostic `40410859897`, paired native-vs-g2pk diagnostic `40410859885`, morphology consensus `40410860218`, morphology adapter smoke `40410859942`, multi-engine IPA diagnostic `40410860080`, optional g2pK integration `40410859938`, scratch teacher training `40410859771`, Charsiu comparisons `40410860096`, and corpus split audit `40410860054`. Their existence/status is not a pass; refresh exact conclusions before any promotion or merge decision.


### Latest PR #339 merge-ref CI outcome (2026-10-27)

The code/test snapshot was research head `256b27a454c992218ca87a0fdf58ea6135071560`, tested as synthetic merge commit `348a3dc18764191f68339333ce24bc0f54e2c523` into main `a452054a669de28426404d1110731715083423bb`. Subsequent continuation commits updated only the handoff, case register, and acceptance-gate documentation; they did not change the runtime/test code represented by those runs.

- PASS: test matrix [40410859903](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859903), including Python 3.11/3.12/3.13, wheel, web and teacher corpus audit.
- PASS: system verification [40410859949](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859949); browser regression/build and Python integrity passed. Official NIKL inventory was skipped, not passed.
- PASS: case-register extraction [40410859892](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859892); browser G2P [40410859840](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859840); paired native-vs-g2pk [40410859885](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859885); UGTPHON diagnostic [40410859897](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859897); morphology consensus [40410860218](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410860218); morphology adapter smoke [40410859942](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859942); g2pK integration [40410859938](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859938); teacher split audit [40410860054](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410860054); scratch teacher training [40410859771](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859771).
- PASS: multi-engine IPA comparison [40410860080](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410860080).
- STILL RUNNING at last poll: Charsiu train/dev [40410860096](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410860096); the log endpoint returned `BlobNotFound`, so its final result remains unknown.

The repository remains a research-ready partial prototype, not release-ready. PR #339 is still Draft/open and 566 commits ahead of main; green individual CI does not independently establish pronunciation gold, Ukrainian target correctness, licensing completeness, or semantic case-register completeness.


## IPA profile / teacher-triage continuation — 2026-10-27

- Seed portfolio failure on 4379463aab4f5a829c61ed666deb28cafffa1a6e was a hard-coded 994-pair expectation; same-seed checkpoint and prediction hashes were identical. Triage logic now validates subset membership and identical pair-ID sets across seeds without assuming a fixed number of resolved Strict cases.
- Python and browser IPA output now include versioned profile metadata fields; the shared fixture records separate runtime outputs as UNADJUDICATED and target-adapter eligibility UNVERIFIED.
- The current sibilant evidence does not justify selecting s͈ vs ɕ͈ categorically for tense ㅆ. See the updated source register and KOREAN-IPA-RUNTIME-PROFILE-CONTRACT-2026-10-27.md.
- Exact-head workflows for the updated code/tests remain QUEUED at this update; the local clone attempt is BLOCKED by DNS resolution. No test pass is claimed for the latest changes.
- Gate statuses: seed triage PARTIAL pending exact-head CI; typed IPA metadata PARTIAL pending CI and adapter eligibility enforcement; cross-runtime phonetic parity BLOCKED / UNADJUDICATED; Ukrainian target changes DEFERRED. Keep PR #339 Draft.

## Opt-in strict IPA gate implementation — 2026-10-27

- Browser API: createEngine().convert(text, {requireAdjudicatedIpaProfile:true}) and convertSurface() use the fail-closed profile adapter. Strict mode suppresses accepted Ukrainian output and removes Ukrainian target text from trace/variant fields. Regression coverage includes simple, surface-mode, and mixed-script lexical early-return input.
- Python API: transliterate_korean(..., require_adjudicated_ipa_profile=True) uses render_profiled_ipa_to_ukrainian() after unresolved-phonology and diagnostic-only guards. Broad unadjudicated and narrow partial profiles remain unavailable.
- These are opt-in migration paths only. The default browser and Python compatibility routes remain, so exclusive production routing is still TODO and the default runtime must not be described as IPA-profile-approved.
- Latest code head at gate update: 4456d47393313090cb17115494a6ce85347fa121; tests 40517742289, system verification 40517742426, and browser integration 40517742266 were QUEUED. No exact-head pass is claimed. Official NIKL live inventory remains SKIPPED; local tests remain blocked by DNS.
- Gate statuses: strict opt-in code/tests PARTIAL pending exact-head CI; exclusive production gate TODO; broad/narrow and ㅅ/ㅆ adjudication BLOCKED; target-inventory review DEFERRED; source-rights clearance PARTIAL. Keep PR #339 Draft and do not release.



## Verification refresh — unresolved strict-gate regression — 2026-10-27

- Added a Python regression for 앉어라 to assert the opt-in profile gate cannot override unresolved Korean phonology. Commit: e12746255f576dd416587ff17cb20f59fc07ecc1.
- Browser G2P integration run 40517742266 completed SUCCESS on earlier code head 4456d47393313090cb17115494a6ce85347fa121. This is valid evidence for that browser snapshot only, not for the later Python test or latest branch head.
- Python/web/wheel/teacher-corpus test matrix 40517742289 remains QUEUED; system verification 40517742426 remains QUEUED for Python regression/data integrity and browser regression/build. NIKL source inventory remains SKIPPED. Latest branch-head lookup returned no associated PR-triggered runs and no combined status entries.
- Status remains PARTIAL: exact-head verification is not complete. Do not mark the suite green or treat this as release-ready.


## Exact-head gate status refresh — 2026-10-27

Current branch state at the preceding handoff update: `ff7841d3f49ffbe910ba031647828a34e7ad5baa`; audit and handoff ledger updates have since been committed. These statuses are conservative and do not imply the current documentation-only head has been tested.

| Gate | Status | Acceptance condition |
|---|---|---|
| Browser/Python opt-in profile gate | PARTIAL | Shared negative fixture and runtime consumers exist; exact-head CI must pass. |
| Unresolved Korean phonology must abstain | PARTIAL | Regression for `앉어라` is committed; exact-head Python/system workflow must pass. |
| Exclusive default target path | TODO | Eliminate raw-IPA bypass only after approved profile and migration tests; preserve compatibility until safe. |
| Compatible IPA profile allowlist | BLOCKED | Independent broad/narrow adjudication, source-backed versioning, and cross-runtime agreement required. |
| Ukrainian target inventory | BLOCKED | Review follows accepted IPA; current mapping tests are not linguistic approval. |
| Official NIKL source inventory | BLOCKED | Current CI metadata-only job skips it; supply verifiable official local/source evidence. |
| Teacher/checkpoint and source rights | BLOCKED | Exact weights/data licensing and provenance need verification; no model use or redistribution. |
| Exact-head automated checks | PARTIAL / WAITING | Latest observed runs on prior head `650465730888a1c852f242c41d1c60b1baac3371`: tests `40520590812`, system `40520590789`, browser integration `40520590788`, and Charsiu queue `40520590865` were all QUEUED; NIKL inventory was SKIPPED. Empty combined status is not success. |
| Release gate | DEFERRED | Research-ready partial prototype only; not release-ready. |

Do not mark any gate green until evidence meets the stated acceptance condition. Do not switch the strict profile gate on by default while its allowlist is empty.


## Exact-head CI verification refresh — 2026-10-27

Current research branch head at verification: `17faadd59c3457ab7bf53ce26a86bba940403235`. All 16 discovered workflow runs on this exact SHA completed with successful workflow conclusions. Core evidence: [tests matrix](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287118) passed wheel-install, Python 3.11/3.12/3.13, web tests/build, and teacher corpus audit; [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40521287327) passed browser regression/build and Python regression/data integrity. The official NIKL source inventory sub-job was skipped by workflow condition, not passed. Other successful exact-head workflows covered browser G2P, optional g2pK, Charsiu train/dev research comparison, multi-engine IPA diagnostics, morphology adapter smoke, corpus split audit, master/corpus generation, teacher training/seed portfolio, case-register extraction, morphology consensus, paired native-vs-g2pk, and UGTPHON diagnostics.

| Gate | Updated status | Evidence / remaining acceptance condition |
|---|---|---|
| Opt-in browser/Python adjudicated-profile gate and negative-fixture regressions | **DONE_VERIFIED** | Exact-head test matrix and system/browser regressions passed; this verifies fail-closed behavior, not a linguistic profile approval. |
| Preserve unresolved Korean phonology before target adaptation | **DONE_VERIFIED** | Python regression for `앉어라` passed in exact-head Python/system suite. |
| Exclusive default target path; remove raw-IPA bypasses | **TODO** | Requires independently approved profile and migration tests; compatibility defaults remain intentionally unchanged. |
| Compatible IPA profile allowlist | **BLOCKED** | Independent broad/narrow adjudication, source-backed profile version, cross-runtime agreement and explicit review required; allowlist remains empty. |
| Ukrainian target inventory | **BLOCKED** | Must be reviewed only after source IPA profile acceptance; mapping tests alone do not constitute linguistic approval. |
| Official NIKL source inventory | **BLOCKED / SKIPPED** | CI job was skipped by workflow condition; verifiable official source evidence still required. |
| Teacher/checkpoint and source rights | **BLOCKED** | Checkpoint license, training-data provenance and applicable redistribution permissions remain unverified. |
| Exact-head automated verification | **DONE_VERIFIED** | Relevant workflow runs for `17faadd59c3457ab7bf53ce26a86bba940403235` completed successfully; local tests were not run due DNS. |
| Release readiness | **DEFERRED** | Research-ready partial prototype only; not release-ready. |

PR #339 remains open/Draft/unmerged. Do not enable strict mode globally while the allowlist is empty, do not infer IPA or Ukrainian gold from teacher outputs, and do not treat a skipped NIKL job or successful software tests as resolution of the evidence/licensing gates.

## Addendum — Revised Romanization feature gate (2026-10-28)

Feature status: **PARTIAL / in review**, tracked by [PR #354](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/354).

- [ ] Verify exact-head CI for `npm test`, `npm run build`, browser interaction/copy behavior, and Python/data-integrity regressions.
- [x] Keep RR as a separate diagnostic branch from resolved Hangul surface; do not route RR through IPA or Ukrainian target generation.
- [x] Add official NIKL surface-example regression cases and a structural sweep across all 11,172 modern Hangul syllables.
- [x] Fail closed in the UI when no resolved surface form is supplied.
- [ ] Build and review a full source-backed RR matrix covering consonant position/allophones, liquid conventions, phonological changes, word boundaries, capitalization, and mixed scripts.
- [ ] Compare outputs against a trusted, independently verified RR implementation or complete official examples, documenting disagreements rather than tuning against the same fixture alone.
- [ ] Confirm rendered page, mobile layout, accessibility text, and copy action in browser tests.
- [ ] Do not implement reverse romanization until a separate spec defines ambiguity, candidate enumeration, confidence/status, and unsupported input behavior.

**Evidence currently available:** isolated Node.js harness, 6/6 tests passed including the 11,172-syllable structural sweep. In addition, CI passed on code/test snapshot `0dcde24374f1a67c38f00f44687c7a1e4a024a51`: browser regression/build, Python regression/data integrity, `npm test`, `npm run build`, Python 3.11/3.12/3.13, and corpus audit jobs. See [system verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40680654498), [browser G2P](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40680654450), and [tests](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40680654400). Official NIKL source inventory was skipped. Later commits were documentation-only; latest-head CI is not yet confirmed. See `docs/KOREAN-ROMANIZATION-RR-2026-10-28.md` and the corresponding entry in `research/ROADMAP.md`.

**Release rule:** the feature must not be described as fully NIKL-conformant or merged solely on the basis of structural syllable coverage or the current example tests.

## Kozak Kim browser G2P / IPA-first acceptance refresh — 2026-11-01

Code-bearing head verified: `d66d02889ffcf405dc9f927a61d3da69fbfe8697`. PR #415 remains open and separate from PR #411.

| Gate | Status | Evidence / remaining acceptance |
|---|---|---|
| Pronunciation status independent from Ukrainian target availability | DONE_VERIFIED | Browser engine returns resolved IPA when only IPA→Ukrainian mapping is provisional/unavailable; composed lexical paths carry an aggregate pronunciation status. Exact-head browser/system CI passed. |
| Strict abstention for genuinely unresolved Korean morphology | DONE_VERIFIED | `읽게` regression confirms unresolved IPA is withheld. A previously used fixture `밭이` is source-backed in the lexical inventory and therefore is not a valid unresolved-morphology fixture. |
| Super-soft literal/Jamo preservation | DONE_VERIFIED | Explicit Super-soft mode preserves standalone compatibility/decomposed jamo and non-Korean literals; strict mode remains fail-closed. |
| NIKL lexical fortition exceptions | DONE_VERIFIED for two exact entries | 사건[사ː껀] and 인기[인끼] are source-backed; 인기 retains the non-fortis alternative. IPA is project-derived; Ukrainian target is provisional. No generic Sino-Korean fortition rule is introduced. |
| Browser strict UGTPHON diagnostic | DONE_VERIFIED as diagnostic | Exact head: 1,428/2,699 exact (52.9085%), CER 8.2571%, coverage 99.852%, 4 unresolved, 0 engine errors. This is not normative accuracy or an untouched holdout. |
| Broad IPA sensitivity profile | PARTIAL / RESEARCH-ONLY | 2,495/2,699 exact (92.4416%), CER 1.3562%. This profile collapses selected narrow allophones and sibilant aspiration for comparison only; it is not independently adjudicated and does not replace strict metrics. |
| Native vs g2pK comparison | DONE_VERIFIED as paired diagnostic | Common 2,698 tokens: native 53.0393% exact / 9.1351% CER; g2pK 53.1134% / 9.2304%. Small exact-match edge to g2pK, lower CER for native; no winner established. |
| Multi-engine comparison | PARTIAL / IN_PROGRESS | Workflow 41309605046 still running at this update; CharsiuG2P and ByT5 sub-jobs skipped by default-off gates. Do not claim a result for them. |
| Independent Korean IPA profile adjudication | BLOCKED | Qualified Korean phonetics reviewer and independent broad/narrow IPA gold required. |
| Ukrainian target mapping review | BLOCKED | Independent Ukrainian target gold/reviewer required; software mapping tests do not establish linguistic approval. |
| NIKL and upstream dataset licensing | BLOCKED | NIKL item-level reuse mark not checked. UGTPHON README states Korean subset Apache-2.0; IPA-Dict credits Korean data CC BY-SA. Verify provenance/compatibility before redistribution or release. |
| Sentence-context normalization of raw UGT | DEFERRED to separate stage | UGTPHON paper shows Korean benefits primarily from sentence context; do not fold canonical-form inference into phonological rules. Requires a separate specification, train-only retrieval, ambiguity/abstention policy and per-category evaluation. |
| Release readiness | DEFERRED | Research prototype / diagnostic engine only; not research-certified or release-ready. |

**Evidence:** tests [41309605110](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41309605110); browser integration [41309605037](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41309605037); system verification [41309605032](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41309605032); browser UGTPHON diagnostic [41309605083](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41309605083); paired native/g2pK diagnostic [41309605065](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41309605065). NIKL metadata-only job was skipped, not passed.



## Follow-up — source-backed G2P benchmark corrections (2026-11-01)

PR #415 continues to add exact-form evidence, but the new code is **PARTIAL pending exact-head CI**.

- Added NIKL Q&A-backed `실수[실쑤]` as one exact §26 full-form license in both browser and Python rule inventories. No productive generalization was introduced.
- Added Korean Basic Dictionary `한자[한ː짜]` as a variant-aware lexical entry, preserving the dictionary long vowel. IPA is project-derived; Ukrainian target remains provisional.
- Tightened Python's provisional lexical-target gate so no non-null Ukrainian orthography is accepted while the lexical target status is provisional, even without a reference target string.
- Source register: 139 CSV records, 12 columns each; rights classification 1 item-level license recorded, 1 not applicable, 130 review-required, 7 manual-classification-required.

**Projected benchmark effect only:** recalculation of the prior browser artifact projects strict CER 8.2571% → 8.2441%, with strict exact unchanged at 52.9085%; broad-candidate exact 92.4416% → 92.4787%. These are not new measurements. Current branch needs a new exact-head browser run.

**CI blocker:** connector-created commits have not emitted new workflow runs after the last verified d66 code head; no workflow-dispatch action is available in the connected GitHub toolset. Local GitHub access is unavailable. Require an event-capable push or manual Actions dispatch before promotion to DONE_VERIFIED.

| Gate | Status | Evidence / remaining acceptance |
|---|---|---|
| Exact NIKL §26 form 실수[실쑤] | PARTIAL | Source verified and mirrored in JS/Python; new regression tests not run at exact head. |
| Dictionary-backed 한자[한ː짜] | PARTIAL | Official dictionary form verified; long vowel preserved; JS/Python tests not run at exact head. |
| Provisional lexical target fail-closed behavior without target-reference string | PARTIAL | Python guard and regression added; needs exact-head Python suite and wheel test. |
| Updated source-register structure and rights totals | PARTIAL | CSV parsed as 139 × 12; exact-head Node/Python register gates still required. |
| New direct browser UGTPHON score | BLOCKED | Previous artifact is pre-change; projected deltas are not a benchmark run. |
| Release readiness | BLOCKED / DEFERRED | Korean IPA adjudication, Ukrainian target review, item-level source-rights checks and exact-head CI remain open. |


## Canonical IPA benchmark convention sensitivity — 2026-11-01

Direct browser artifact [41309605083](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41309605083): 2,699 tokens; strict exact 52.9085%, CER 8.2571%. Research-only broad-candidate sensitivity: exact 92.4416%, CER 1.3562%. Of 1,271 strict mismatches, 1,067 (83.95%) become exact under the broad candidate profile; 204 remain.

**Interpretation:** strict exact match is highly sensitive to IPA annotation conventions (allophones, ㅟ, vowel length, unreleased codas, sibilant aspiration). The broad profile is unadjudicated and is not a gold metric. The remaining mismatches require source-backed review, not heuristic tuning. The two new lexical corrections have only projected, not measured, deltas.


## Measured source-backed G2P correction benchmark — 2026-11-01

**DONE_VERIFIED for the direct browser diagnostic:** workflow [41311996175](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41311996175), code-bearing head \`00ac99a93c6ba8c64d66588e8a7e86aec3cfff7c\`.

- 2,703 eligible / 2,699 scored; coverage 99.852%; 4 unresolved; 0 engine errors.
- Strict exact 52.9085% unchanged; strict CER 8.2571% → **8.2441%**.
- Broad-candidate exact 92.4416% → **92.4787%**; broad-candidate CER 1.3562% → **1.3427%**.
- \`실수\` output \`ɕil.s͈u\`, broad-candidate exact; strict mismatch remains due allophone conventions. \`한자\` output \`haːn.tɕ͈a\`, strict distance 1 because gold omits the dictionary long vowel. The long vowel remains preserved and Ukrainian target is provisional.

This confirms a modest edit-distance improvement, not an exact-match increase. Broad-candidate results remain unadjudicated sensitivity analysis.

**DONE_VERIFIED as a comparison, not as a replacement decision:** paired native/g2pK run on 2,698 tokens: native 53.0393% exact / 9.1220% CER; g2pK 53.1134% / 9.2304%. The tiny exact advantage does not compensate for worse CER; keep native as default.


## Latest 한자 lexical-row regression repair (2026-11-01)

Browser regression run 41311996128 failed two new checks: target-syllable alignment (empty target field) and provisional candidate suppression (the 12-field row placed `variant-aware-research` in the wrong column). The row is corrected to 13 columns, target candidate `ган|чча`, and `input_kind=variant-aware-research`. The candidate is explicitly project-generated and provisional; it is not dictionary-sourced Ukrainian. CSV alignment is statically verified. Exact-head browser/Python tests for commit `eba968b383e1ae4ca8ebb52094c3f2d32439e315` are pending.


## Python raw-surface benchmark import repair — 2026-11-01

| Gate | Status | Evidence / acceptance |
|---|---|---|
| Diagnose Python suite failure | DONE_VERIFIED | Actions 41313216461 and 41313216444 logs show test collection failed because `tests/test_ugtphon_surface_benchmark.py` imported missing `scripts.benchmark_ugtphon_ko_surface`. Browser build/regression passed in system run; Python job failed. |
| Restore existing benchmark implementation | PARTIAL | Restored the existing PR #411 implementation on PR #415 in commit `c069031a6cea830ad4d5f00fcf5314b5dd1e8e12`; no new prediction logic or runtime pronunciation rule added. |
| Exact-head Python/browser/system CI | TODO | Re-run on the repair commit; require Python 3.11/3.12/3.13, Node suite/build, wheel install, data-integrity and system verification. |
| Exact-head UGTPHON raw-surface and paired benchmark | TODO | Re-run against pinned train/test splits; report raw baseline, train-only retrieval, paired deltas, abstentions and false rewrites separately. |

The previous failed tests are not to be counted as passing, and the restored file is not DONE_VERIFIED until exact-head CI confirms the import and all tests. The repair changes test/benchmark availability only; it does not claim a G2P accuracy improvement.


### Follow-up: paired-metric test contract synchronized (2026-11-01)

The current-main commit `7bbbd7e7ce888a9c995bb70959e17858263c07a8` added a multi-reference regression to `tests/test_ugtphon_surface_benchmark.py`. PR #415 now carries that exact test module alongside the restored implementation. Latest PR branch code/test tip before this documentation-only update: `85facdd7d2a882da58d3b27eeab9a65c046be461`. GitHub reports the PR mergeable, but it remains one commit behind current main. Exact-head Python/browser/system CI and a fresh benchmark are still TODO; local execution remains blocked by GitHub DNS resolution.


## Latest direct browser / paired native-vs-g2pK evidence — 2026-11-01

- Direct browser benchmark [41313216356](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41313216356): 2,703 eligible / 2,699 scored; coverage 99.852%; 1,428 exact (52.9085%); coverage-adjusted exact 52.8302%; CER 8.2441%; 4 unresolved; 0 engine errors. IPA profile remains unadjudicated cross-runtime.
- Paired native/g2pK benchmark [41313216411](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41313216411): native 53.0393% exact / 9.1220% CER / 5 abstentions; g2pK 53.0892% exact / 9.2285% CER / 0 abstentions. On 2,698 common tokens, g2pK's exact delta is +0.0741 pp with 95% CI [-0.0824, +0.2840] pp (not significant); CER is worse by +0.1084 pp with 95% CI [+0.0234, +0.2038] pp. Recorded unique-word runtime: native 363 ms vs g2pK 16,733 ms, including Python adapter overhead.
- Multi-engine run [41313216374](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41313216374) confirms this pattern. Keep native Kozak Kim as default; g2pK is not a statistically convincing exact-match improvement and has worse CER/runtime. CharsiuG2P and ByT5 were skipped by default-off gates.
- Browser integration [41313216398](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41313216398) passed. Node tests passed 1,356/1,356 and browser build passed in 41313216461. Python test collection failed because the raw-surface benchmark module was missing; system verification 41313216444 failed its Python job for the same reason, while browser regression/build passed.

The benchmark results are valid for the engine code present in the run, but do not verify the later restored raw-surface benchmark module. Exact-head Python 3.11–3.13 suite, wheel test, system verification and rerun of the raw-surface benchmark remain TODO after repair commit `c069031a6cea830ad4d5f00fcf5314b5dd1e8e12`.


## 2026-11-01 — exact-head raw-surface and Python CI verification

| Gate | Status | Evidence / acceptance |
|---|---|---|
| Restore raw-surface benchmark module and current tests | DONE_VERIFIED | PR #415 contains `scripts/benchmark_ugtphon_ko_surface.py` and its tests; exact-head Python test matrix [41325015110](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41325015110) passed on Python 3.11/3.12/3.13. |
| Fix three Python regression assertions without weakening the engine | DONE_VERIFIED | Broad IPA test now matches broad profile for `실수`; source-register word check is case-insensitive; paired raw/normalized evaluator test expects both G2P calls and asserts false-rewrite reporting. |
| Synchronize PR branch with current main | DONE_VERIFIED | Merge commit `20fec483165ea170c9944df0704f04414c5590ec` includes current main `7bbbd7e7ce888a9c995bb70959e17858263c07a8`; comparison at sync: 79 ahead / 0 behind. |
| Python regression and data-integrity suite | DONE_VERIFIED | System run [41325014981](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41325014981) PASS. |
| Python 3.11/3.12/3.13, web, wheel, teacher-corpus audit | DONE_VERIFIED | Test matrix [41325015110](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41325015110) PASS. |
| Browser tests and build | DONE_VERIFIED | System [41325014981](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41325014981) PASS; browser suite 1,356/1,356. Browser G2P integration [41325014980](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41325014980) PASS. |
| Verify pinned UGTPHON train/test inputs and Apache-2.0 declaration | DONE_VERIFIED | External benchmark run [41325015010](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41325015010) validates train 1,976 rows and test 275 rows with expected Git blob SHA-1 values. |
| Run paired raw-surface baseline and train-only retrieval | DONE_VERIFIED as research diagnostic | Artifact `13090704109`: 2,624 shared tokens; exact 51.3720% → 51.6006 (+0.2287 pp); CER 10.0783% → 9.9730 (−0.1054 pp); 6 exact improvements, 0 regressions, 15 rescued, 0 lost. |
| Promote raw-surface retriever to standard runtime | DEFERRED | Only 22/722 noncanonical tokens hit (3.0471%); exact-context hits 0. Keep separate until sentence-context model/candidate evidence and false-rewrite controls demonstrate broader utility. |
| Promote Kiwi/MeCab consensus rules | DEFERRED | Artifact `13090938199`: no exact-match gain and paired CER worsened by 0.000087; candidate morphology is not gold. |
| Independent Korean IPA adjudication | BLOCKED | Requires independent specialist review; current broad-candidate score is only sensitivity analysis. |
| Ukrainian target-layer review | BLOCKED | Requires independent Ukrainian phonetics/orthography adjudication. |
| NIKL item-level rights and IPA-Dict/UGTPHON license compatibility | BLOCKED | NIKL metadata-only inventory remains SKIPPED; verify item-level marks and all source terms before redistribution. |
| Neural Charsiu/ByT5 inference | DEFERRED / SKIPPED | Default-off gates remain; no inference result is claimed. |

**Measured canonical browser baseline:** 2,703 eligible / 2,699 scored, 99.852% coverage, 52.9085% exact, 8.2441% CER, 4 unresolved, 0 engine errors. The research-only broad-candidate profile is 92.4787% exact / 1.3427% CER and must not be represented as normative accuracy.

**Research interpretation:** the 2026 EMNLP UGTPHON Korean ablation shows a large sentence-context effect, only a small additional exact-retrieval effect, and a regression from staged decoding. Any further UGT work should use sentence-context-conditioned candidate normalization with train-only evidence, canonical controls, paired scoring and abstention; it must remain separate from canonical G2P.


## 2026-11-01 — Kozak Kim browser parity / paired g2pK gates

| Gate | Status | Evidence / acceptance condition |
|---|---|---|
| Browser broad-IPA parity for NIKL §5 exception 1 | DONE_VERIFIED | engine_convert.js mirrors the existing Python IPA behavior for ㅕ after ㅈ/ㅉ/ㅊ; explicit browser regression tests; exact-head system and test matrix pass. |
| Direct paired browser Kozak Kim vs untouched g2pK | DONE_VERIFIED as diagnostic | Run 41331679243, artifact 13093672281; 2,699 shared occurrences, shared references, 264 sentence clusters and deterministic bootstrap. g2pK source unchanged. |
| Source adjudication of paired discordant outcomes | DONE_VERIFIED for the inspected discordant cases | NIKL source records distinguish long-vowel omission (없는), optional fortition (인기), attested variants (못잃어), and clear §24 readings (닮다, 넘게). The four g2pK-only exact corpus hits are not valid source-backed wins. |
| Demonstrate a statistically robust overall Kozak Kim exact-match advantage | PARTIAL | Paired exact rates tie at 53.4272%; cluster-bootstrap exact-delta CI crosses zero. CER point estimate favours Kozak Kim by 0.078 pp, but its interval touches zero. Requires a larger independently adjudicated holdout. |
| Generalize R010/R012/R013/R028 beyond explicit source-backed forms | BLOCKED | No reliable browser morphology-boundary analyzer/lexical-class model currently establishes the required stem, adnominal and compound boundaries. Acceptance requires source-backed boundary evidence, positive/negative controls, cross-runtime parity, and held-out gains without regressions. |
| Resolve remaining four strict browser abstentions | PARTIAL | Current examples: 칡칡이, 쫒아내면, 많앗구나유유유, 무서웟어. Each needs a source-backed lexical or morphological analysis; no guessing. |
| Independent Korean IPA adjudication | BLOCKED | Requires qualified independent phonetic review of gold alternatives, allophone conventions and broad/narrow IPA distinctions. |
| Ukrainian target-layer review | BLOCKED | Requires independent Ukrainian phonetics/orthography adjudication. |
| NIKL item-level rights and dataset-license compatibility | BLOCKED | Verify item-level NIKL reuse marks and source terms before redistribution or release. |

**Exact-head verification:** system run 41331679290 PASS; test matrix 41331679310 PASS (JavaScript 1,364/1,364; Python 3.11/3.12/3.13; wheel/clean install; teacher-corpus audit); browser G2P integration 41331679270 PASS; external UGTPHON diagnostic 41331679243 PASS.

## Kozak Kim discrepancy-driven improvement snapshot — 2026-11-01

Scope: improve native Kozak Kim only; preserve original g2pK as an unchanged comparison baseline.

| Gate | Status | Evidence / acceptance |
|---|---|---|
| Paired baseline and occurrence-level discrepancy extraction | DONE_VERIFIED as diagnostic | Run [41331679243](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41331679243), artifact 13093672281; 2,699 shared occurrences; 23 output-different occurrences; 15 lower-distance Kozak Kim / 8 lower-distance g2pK |
| Post-§27 paired browser diagnostic | DONE_VERIFIED as a diagnostic | Run 41335549779, artifact 13094763897; 2,699 shared tokens, exact tie, Kozak CER 8.1271% vs g2pK 8.2138%; only changed Kozak output is `올게이`, distance 3→1; no paired regressions. |
| Demonstrate statistically established overall Kozak Kim superiority | BLOCKED | Exact rates tie at 53.4272%; sentence-cluster bootstrap exact-delta 95% CI [-0.20697, +0.20056] pp crosses zero; independent adjudicated holdout required |
| §27 complete `-ㄹ게` boundary repair | DONE_VERIFIED | Browser test 1114 passed; paired run [41335549779](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41335549779) confirms `올게이` distance 3→1 and no other Kozak Kim output changes in 2,699 shared occurrences. |
| Source provenance for §27 ending analysis | DONE_VERIFIED for source discovery/registration | NIKL Q&A 330963 and 308180 registered as SRC-NIKL-QNA-330963 and SRC-NIKL-QNA-308180; item-level reuse mark remains unverified |
| Long-vowel and IPA annotation differences | BLOCKED / EVIDENCE-LIMITED | Reference omits length in several forms where NIKL source records length; independent IPA convention adjudication required before changing engine |
| Morphology/fortition clusters | PARTIAL | Existing §§11, 24–28 source-backed rules retained; add rule-specific contrasts and holdout validation |
| Variable phrase reading `못잃어` | PARTIAL | NIKL usage survey source records both insertion and non-insertion; variant ranking not established |
| Exact-head software verification | DONE_VERIFIED | Run [41335266673](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41335266673) and follow-up [41335549717](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41335549717) PASS: 1,365/1,365 browser tests, public-page build, generated-page verification, Python regression/data-integrity; extraction runs 41335266701 and 41335549794 PASS. Paired diagnostic [41335549779](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41335549779) PASS. |
| Release readiness | BLOCKED / DEFERRED | Exact-head verification, independent Korean IPA review, and independent Ukrainian target review remain outstanding |

The detailed methodology and occurrence ledger are:
- `docs/KOZAK-KIM-DISCREPANCY-DRIVEN-IMPROVEMENT-2026-11-01.md`
- `research/KOZAK-KIM-PAIRED-DISCREPANCY-LEDGER-2026-11-01.csv`

Do not count an authored test as passing. Do not treat g2pK as normative gold. Do not remove length or collapse allophones solely to match UGTPHON.


## Kozak Kim discrepancy-driven continuation — 2026-11-01

This is a bounded branch snapshot, not a release acceptance decision. Branch `research/kozak-kim-discrepancy-driven-improvement-2026-11-01-current`, PR #416 draft; original g2pK is an immutable comparison baseline.

| Gate | Status | Evidence / limitation |
|---|---|---|
| 0 — Repository integrity | PARTIAL | PR #416 and its stacked base inspected; no merge, branch deletion, or unrelated PR mutation. Final branch head is recorded in the PR and handoff. |
| 1 — Source and licensing | PARTIAL / BLOCKED | Official NIKL dictionary evidence checked for 출산 family and 저출산; item-level KOGL reuse mark remains unverified. |
| 2 — Rule and data integrity | PASS for original four-form §26 set; PARTIAL for `저출산` follow-up and R012 generally | Exact full-form + internal `출>산` licenses. Original 출산, 출산율, 출산하다, 비출산 controls verified in run 41336800458. Follow-up 저출산/저출고 tests are authored but await exact-head CI. Productive Sino-Korean morphology is not implemented. |
| 3 — Independent evaluation corpus | PARTIAL / EVIDENCE-LIMITED | Same 2,699 UGTPHON occurrences paired before/after; UGTPHON IPA is diagnostic and has an aspiration-vs-fortition annotation mismatch on 출산. No independent specialist gold. |
| 4 — Runtime correctness | PASS for pre-`저출산` code head; current exact head pending | Run 41336800458: Python regression/data-integrity and browser regression/build/generated-page checks PASS. Run 41336800424: paired browser benchmark and pinned-data checks PASS. New exact-head runs 41339399132/41339399053/41339399044/41339399017 were queued/in progress at handoff. No local test run is claimed. |
| 5 — Product quality | PARTIAL | This is engine-only work; no UI or deployment change. Existing release/product gates are unchanged. |
| 6 — Release and independent review | BLOCKED | No independent Korean IPA reviewers, no independent Ukrainian target review, and unresolved item-level source rights. Do not claim overall superiority or release readiness. |

### §26 paired evidence

Before artifact `13094763897`; after artifact `13095038704`. Shared subset 2,699. Exact match tied at 1,442/2,699 (53.4272%). Kozak Kim CER 8.1271% → 8.1228%; original g2pK CER 8.2138%; paired CER delta −0.08669 → −0.09102 pp; post-change sentence-cluster 95% CI [−0.17881, −0.01647] pp. `비출산` IPA distance 2→1 and surface changed to `비출싼`; `출산` surface changed to `출싼`, but IPA distance tied because UGTPHON writes [sʰ] rather than the NIKL dictionary's fortis surface. No g2pK source/output changes.


## 2026-11-01 — Kozak Kim §26 / lexical follow-up (superseding current status)

| Gate | Status | Evidence / limitation |
|---|---|---|
| Scope isolation | DONE_VERIFIED | Only Kozak Kim native modules and dated lexical additions changed; original g2pK code/output path unchanged; Browser G2P integration run 41342127246 PASS. |
| §26 exact 실시간 license | DONE_VERIFIED | NIKL Hanja source 實時間 + NIKL §26; browser/Python positive and negative controls; paired browser output distance 3→2. |
| Exact lexical 이중성 | DONE_VERIFIED for Korean surface/IPA; PARTIAL for target | NIKL Basic Dictionary directly lists [이ː중썽]; IPA-first lexical entry preserves length and fortisness; Ukrainian target remains provisional and is not accepted. |
| Remaining C08 phrase/affix cases | BLOCKED / EVIDENCE-LIMITED | 했을시 and 무고일수도있다는 lose phrase boundaries; 유사성 lacks direct exact-word pronunciation attestation. No generic -성 or unspaced phrase rule. |
| Paired browser diagnostic | DONE_VERIFIED diagnostic | Run 41342127112 artifact 13098181051; 2,699 shared tokens; exact tied at 1,442/2,699; Kozak Kim CER 8.1184%, g2pK 8.2138%; only 실시간 improved edit distance; 이중성 now follows dictionary length/fortisness despite gold omission. |
| Independent overall superiority | BLOCKED / EVIDENCE-LIMITED | Exact-rate CI crosses zero; CER interval is diagnostic on UGTPHON only; no specialist-adjudicated holdout. |
| Source rights and target review | BLOCKED | Source register 147 rows, 138 review-required; metadata-only inventory job skipped; Ukrainian target review absent. |
| Release readiness | BLOCKED | Research prototype only; no release claim. |

Software verification on code-bearing head a0e17a187ee023c84c7208bb6a1df5755ed4b226: run 41342127230 PASS (browser 1,368/1,368, build, generated pages, Python regression/data integrity); g2pK integration run 41342127246 PASS. Multi-engine diagnostic 41342127137 was still in progress at handoff. The source inventory job was skipped and is not counted as a pass.


## Kozak Kim continuation snapshot — 2026-11-01

| Gate | Current status | Evidence / blocker |
|---|---|---|
| 0 — Repository integrity | PARTIAL / VERIFIED BRANCH | Current main `7bbbd7e`; continuation branch `research/kozak-kim-independent-ipa-packets-2026-11-01`; Draft PR #417 stacks on PR #416. PRs #415/#416/#417 remain unmerged. |
| 1 — Source and licensing | PARTIAL / RIGHTS OPEN | Added NIKL Q&A 327466 and NIKL 2021 dependent-noun-`시` source records. Exact official morphology scope checked; item-level KOGL/reviewer-sharing rights remain unverified. |
| 2 — Rule and data integrity | PARTIAL | No production rule changed. C08 summary reports 8 cases, but current occurrence ledger has no C08 rows; 3 source IDs recovered and 5 remain missing. |
| 3 — Independent evaluation corpus | PARTIAL / BLOCKED | Seven source-blind C01–C07 pilot packets and a regression test exist. Full utterance context and reviewer-sharing rights are missing; no independent submissions exist. |
| 4 — Runtime correctness | PASS for recorded software gates on continuation head | Run `41346666445`: browser regression/build PASS (1,369 tests, 0 failures); Python regression/data integrity PASS. Run `41346594433` extractor PASS. NIKL metadata-only inventory SKIPPED. Multi-engine run `41344981358` completed PASS; artifact `13099523369` inspected. Neural inference jobs SKIPPED. |
| 5 — Product quality | PARTIAL | This continuation does not alter UI or Ukrainian target behavior; independent Ukrainian target review remains open. |
| 6 — Release and independent review | BLOCKED | No independent Korean IPA adjudication, no item-level source/reviewer rights clearance, five C08 occurrence IDs missing, Ukrainian target review incomplete. Research prototype only. |

This is a research continuation status, not a release acceptance decision. No claim of linguistic certification follows from CI.


## Supplementary paired benchmark — SIGMORPHON 2021 Korean lexical test (run 41344981358)

The completed multi-engine diagnostic artifact `13099523369` was downloaded and inspected. It pins g2pK 0.9.4 and compares the native Kozak Kim path with the same 998 paired word-level inputs:

| Metric | Kozak Kim (clippyfirst_native) | Original g2pK 0.9.4 | Paired delta (g2pK − Kozak) |
|---|---:|---:|---:|
| Exact match | 358/998 = 35.8717% | 353/998 = 35.3707% | −0.5010 pp |
| CER | 14.6225% | 14.8106% | +0.1881 pp |

Paired row-cluster bootstrap (1,000 replicates): exact-match delta 95% interval `[-1.0020, -0.1002]` pp; CER delta interval `[+0.0250, +0.3859]` pp. Pairwise audit: 5 native-only exact cases, 0 g2pK-only exact cases, 353 both exact, 640 both non-exact, and 1 native abstention while g2pK returned a non-exact output. This is a **small diagnostic advantage**, not proof of universal superiority.

**Mandatory limitations:** SIGMORPHON is a lexical word-level set, not a sentence-context or normative NIKL set; IPA conventions differ from the reference; g2pK outputs pass through the project's shared segment renderer, which may bias comparison; the benchmark does not score Ukrainian output. The bootstrap intervals are diagnostic uncertainty intervals, not a substitute for independent gold adjudication or a preregistered statistical claim. ByT5 and CharsiuG2P inference jobs were SKIPPED. g2pK source/version remained unchanged.


## C01–C07 source-context restoration — 2026-11-01

The earlier blocker “source utterance context unavailable” is superseded. All **39 unique source-row IDs** across the seven six-item pilot packets were matched to the official `naver-ai/UGTPHON/ko/test.json` (275-row Korean test split); every target token is present in its included raw sentence. UGTPHON's `ko/LICENSE` explicitly states Apache-2.0 for the Korean subset. Packets now include raw sentence context only, plus source-row provenance and attribution to UGTPHON, KoMultiText, and MultiLexNorm++; they exclude canonical text, phoneme annotations, IPA-Dict data, system outputs, and reference IPA.

**Updated status:** packet preparation is `DONE_VERIFIED`; the packets are `READY_FOR_INDEPENDENT_REVIEW_PILOT`. Independent reviewer assignment and first-pass submissions remain `TODO`. These six-item-per-cluster samples are not full cluster censuses. Preserve the Apache-2.0 notice and attribution; no raw gated MultiLexNorm++ files are redistributed. Upstream provenance/terms remain a documented limitation for broader reuse.


The multi-engine comparison workflow did not produce a completed score report: runs 41353171180 and 41353450707 were cancelled during the comparison step after branch updates. The partial readiness artifact 13101748305 is complete for its own audit: 644 unique lexical rows, no explicitly adjudicated IPA gold, 24 frozen holdout cases without IPA gold, no overlap. Do not train on provisional candidates or holdout data.


Exact-head verification: push run `41358504664` and PR run `41358508399` both passed on code/test head `8b22f778112442024f876061bd0e576af762e761`. Native paired diagnostic run `41357680365` is a separate runtime profile and does not establish normative IPA accuracy.


## Kozak Kim exact-head acceptance update — 2026-11-03 (PR #424)

| Gate | Status | Evidence / acceptance |
|---|---|---|
| Source-backed lexical correction `끌다` | DONE_VERIFIED for Hangul surface/length | Official NIKL Standard Pronunciation Rule §7 lists `끌다[끌ː다]` and `끌어[끄ː러]`; Korean Basic Dictionary ParaWordNo=62281 agrees. IPA is project-derived; Ukrainian target remains provisional/withheld. |
| Rule §24 exact `굶다` | DONE_VERIFIED as rule-derived form | Official rule covers stem-final ㄴ(ㄵ), ㅁ(ㄻ) + ending-initial ㄱ/ㄷ/ㅅ/ㅈ; `굶기다` is an explicit -기- negative control. Not claimed as a direct lexical example. |
| Research candidate isolation from g2pK app adapter | DONE_VERIFIED | Both `kozak-research-only` and `variant-aware-research` are excluded from surface and IPA overrides. Test-first failure `5131e807` reproduced `못잃어 → 몬니러`; fix `2e6e739` passes. |
| Original g2pK baseline integrity | DONE_VERIFIED | No upstream/vendor file changed; raw benchmark script constructs `G2p()` directly. |
| Software verification | DONE_VERIFIED | 41637788167 / 41637795909 PASS: Browser 1,391/1,391, Python/data integrity, Vite build and generated pages. g2pK 3.11/3.12 integration 41637795791 PASS. |
| Paired and morphology diagnostics | DONE_VERIFIED | 41637795740, 41637795766, 41637795818, 41637795832, 41637795861 PASS. |
| Multi-engine rerun | PARTIAL / IN PROGRESS | 41637795800 had not completed at this update; do not claim its result. Previous raw-path artifact 13226589858 is valid for the same benchmark code path. |
| Independent Korean IPA / Ukrainian target review | BLOCKED | Need two qualified independent IPA reviewers/adjudication and independent Ukrainian phonetic/orthographic review. |
| NIKL item-level reuse rights | BLOCKED | Metadata-only inventory skipped; exact item-level KOGL/reviewer-sharing rights unresolved. |
| C12, 239 mismatches, supervised training | BLOCKED / TODO | Need exact acoustic/articulatory evidence for C12, source-context adjudication for 239 occurrences, and independently adjudicated IPA gold for holdout/training. |

**Disposition:** technically verified research prototype, not research-certified and not release-ready. CharsiuG2P, ByT5 and NIKL metadata-only inventory were SKIPPED, not passes. No merge or release.


## Exact-head acceptance update — PR #425 (2026-11-03)

| Gate | Status | Evidence / acceptance |
|---|---|---|
| Research lexical ablation | DONE_VERIFIED | `include_research_lexical=False` excludes both research-only input kinds from surface and IPA overlays, preserves explicit exclusion traces, and leaves the default policy unchanged. System Verify 41654558006 PASS. |
| Ablation and pairwise audit helpers | DONE_VERIFIED at unit level | Multi-engine benchmark adapter tests passed in run 41654557693 before the long comparison step. Final artifact inspection remains pending. |
| System regression/build | DONE_VERIFIED | 41654558006 PASS: Python regression/data integrity; Browser 1,391/1,391; Vite build and generated pages. |
| Paired Native/g2pK | DONE_VERIFIED diagnostic | 41654557675 PASS, 2,698 paired occurrences; Native 53.0393% exact / 9.0613% CER; g2pK 53.1134% exact / 9.2304% CER. |
| External UGTPHON | DONE_VERIFIED | 41654557866 PASS. |
| Optional g2pK integration | DONE_VERIFIED | 41654557638 PASS. |
| Morphology consensus and adapter smoke | DONE_VERIFIED | 41654557961 and 41654557801 PASS. |
| Full multi-engine comparison / mismatch queue / Browser parity | IN PROGRESS | 41654557693; do not infer scores or artifact acceptance until all remaining steps finish. |
| Independent IPA review / NIKL rights / Ukrainian target review | BLOCKED | External expert adjudication, item-level permission, and independent target review remain necessary. |
| C12 / 239 mismatch cases / training | BLOCKED / TODO | Exact-context evidence, adjudication and independent IPA gold remain absent. |

**Disposition:** software regression gates are green on implementation head; research/linguistic acceptance and release gates remain open. CharsiuG2P, ByT5, Charsiu train/dev, and NIKL metadata inventory are skipped, not passes.


## Exact-head acceptance update — PR #426 continuation (2026-11-04)

| Gate | Status | Evidence / acceptance |
|---|---|---|
| Exact-eojeol NIKL licenses in sentence context | DONE_VERIFIED on code-bearing head | PR #426 code head `074350da133b6ed654b3960879cbb7c809c0ebe1`; System Verify 41725888453 and related exact-head Native/Browser, morphology, UGTPHON and extraction checks passed. |
| Native Kozak Kim vs original g2pK 0.9.4 paired UGTPHON diagnostic | DONE_VERIFIED as diagnostic only | Run 41726881384 / artifact 13276390247; paired n=2,698; Native 1,431/2,698 exact (53.0393%), CER 8.9920%; g2pK 1,433/2,698 exact (53.1134%), CER 9.2304%; exact delta +0.0741 pp (CI crosses zero), paired CER delta +0.2384 pp (g2pK higher, CI excludes zero). Raw g2pK denominator is 2,703 and must not be substituted for the paired result. No independent IPA gold claim. |
| Checked-in unmapped mismatch review queue | PARTIAL | Current-head exporter generated 36 rows / 55 fragments, zero missing context lookups; golden `cmp` failed at byte 31,117 / line 14. Must review and refresh expected rows, then rerun exact-head gate. |
| Same-occurrence Browser comparison and parity in multi-engine workflow | TODO / BLOCKED_BY_UPSTREAM_GATE | Skipped after queue mismatch; separate Browser G2P CI passing is not a substitute for same-occurrence parity artifact. |
| SIGMORPHON portfolio on current head | TODO / BLOCKED_BY_UPSTREAM_GATE | Skipped; do not reuse older-head scores as current-head verification. |
| NIKL metadata crawl and optional neural inference | SKIPPED | Not passes; no claims of full NIKL source inventory or teacher advantage. |
| Independent Korean IPA, Ukrainian target, item-level rights, C12 and 239 mismatch adjudication | BLOCKED / TODO | Require independent reviewer submissions, rights evidence, primary phonetic evidence and exact-context adjudication. |

**Disposition:** research prototype; not research-certified or release-ready. Original g2pK remains unchanged and comparison-only.


## 2026-11-04 — mismatch-queue reconciliation gate (PR #426)

| Gate | Status | Evidence / acceptance |
|---|---|---|
| Generated unmapped-broad queue reconciled with checked-in snapshot | DONE_VERIFIED as artifact reconciliation | Run 41794874090 / artifact 13305816579; 36 rows, 55 fragments, zero missing context lookups. Commit c0cbe3740e734c87d3202cca496b83d9603ea218 updates the snapshot from 43 to 36 rows. All 36 retained rows match the generated rows byte-for-byte by per-row hash. |
| Disposition of seven removed rows | DONE_VERIFIED as queue triage, not linguistic adjudication | Five now broad-exact (1406, 1527, 2001, 2010, 2533); 868 retains mapped C06; 2562 retains mapped C11. No claim that mapped differences are accepted pronunciation. |
| Exact-head multi-engine gate after refresh | IN_PROGRESS | Run 41797143756. Must complete exporter `cmp`, same-occurrence Browser, Native/Browser parity and SIGMORPHON portfolio, then inspect artifact. |
| Independent Korean IPA and Ukrainian target review | BLOCKED | Requires independent qualified reviewers and adjudication; corpus annotations and cluster labels are not gold. |

**Disposition:** the stale queue mismatch is reconciled; release/research certification gates remain open. Original g2pK is unchanged.

## 2026-11-04 — refreshed benchmark gate and R013 phrase extension

| Gate | Status | Evidence / acceptance |
|---|---|---|
| Refreshed multi-engine UGTPHON, queue cmp, Browser and Native/Browser parity | DONE_VERIFIED | Run 41797276965 / artifact 13306613436; all 17 steps PASS; queue 36 rows / 55 fragments / 0 missing contexts; 2,703 surface and 2,698 IPA occurrences equal across runtimes. |
| SIGMORPHON lexical portfolio | DONE_VERIFIED as diagnostic | Same run; paired n=998, Native 358 exact and 14.5598% CER vs g2pK 353 exact and 14.8106% CER; exact McNemar p=0.0625. |
| Independent IPA holdout | BLOCKED | 24-case packets prepared for two reviewers; annotations pending. |
| R013 phrase-level `줄 것` / `많을 거` and same-eojeol phrase-mode retention | DONE_VERIFIED for software behavior | Exact pair/index licenses, negative controls and phrase-mode same-eojeol regression pass System Verify 41849672939 on head `02a72da6534b110d63810c497a6b7fba9b790a3e` (Python 652; Browser 1,396/1,396; build/generated pages PASS). Prosodic pause remains unobservable in plain text. |
| Independent Ukrainian target review, NIKL item-level rights, C12 primary evidence, historical 239-case adjudication | BLOCKED | External evidence/review remains required. |

Original g2pK 0.9.4 remains unchanged and comparison-only.

## 2026-11-04 — R013 connected-phrase follow-up and current-head evidence

R013 / NIKL §27 exact connected-phrase licenses added for `줄 것` and `많을 거`. Python phrase mode binds each license to the exact adjacent eojeol pair and syllable-pair index; Browser phrase assimilation uses the same exact pair map. Positive cases: `해 줄 것 같다`, `많을 거 같이`. Compact no-space forms remain unlicensed; Browser additionally rejects punctuation-separated pairs. No hidden spaces are reconstructed.

Phrase mode assumes connected speech. NIKL §27 says a pause blocks fortition; the text API cannot infer prosodic pauses. This is rule-derived standard-pronunciation support, not acoustic IPA attestation. Primary evidence: NIKL Standard Pronunciation Rule 27 and official Q&A 310899 for colloquial dependent noun `거`.

Exact-head System Verify [41806844422] PASS: Python regression/data integrity; Browser 1,395/1,395; Vite build. Browser G2P [41806844476], paired Native/g2pK [41806844324], UGTPHON [41806844305], morphology consensus [41806844379], extraction [41806844316], and morphology smoke [41806844503] PASS. Multi-engine run [41806844311] was still in its comparison step at this checkpoint; no pass is claimed. Last completed full comparison: [41797276965], artifact [13306613436].

Comparative diagnostic (run 41797276965): UGTPHON paired n=2,698: Kozak Kim 1,431 exact / 8.9920% CER vs original g2pK 1,433 exact / 9.2304% CER; exact difference inconclusive (95% CI −0.0824 to +0.2840 pp), Kozak Kim CER lower by 0.2384 pp. SIGMORPHON paired n=998: Kozak Kim 358 exact / 14.5598% CER vs g2pK 353 exact / 14.8106% CER; five net Kozak-only exact wins, McNemar p=0.0625. Corpus IPA labels are not normative IPA gold; neither metric measures Ukrainian target quality.

Main is `607dccb46`, advanced through merged PRs #428/#430/#431. The benchmark module restored by #428 is byte-identical on main and this branch. PR #426 remains stacked on #425; no blind rebase. The corrected 36-row queue is already in #426 at `682c3a5`, byte-identical to its generated artifact. #427/#429 closed as superseded/no-op; branches retained.

R013 phrase implementation/tests: DONE_VERIFIED. IPA/prosody adjudication: PARTIAL/BLOCKED. Overall readiness: research prototype only. Independent Korean IPA reviewers, Ukrainian target review, NIKL item-level rights, C12 primary evidence and historical 239-case adjudication remain blocked.


## 2026-11-04 — exact-head verification and discrepancy benchmark refresh

**Verified branch head:** `02a72da6534b110d63810c497a6b7fba9b790a3e` (PR #426). System Verify 41849672939 PASS; Browser G2P 41849673226, paired Native/g2pK 41849673222, UGTPHON 41849673067, morphology consensus 41849673050, morphology smoke 41849673025 and extraction 41849672945 PASS. Multi-engine 41849673041 remains in progress.

### Exact-head software and runtime verification

- System Verify [41809176725](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41809176725): **PASS** — Browser regression/build job PASS; Python regression/data-integrity job PASS. The Browser suite is 1,395/1,395 at this head. Official NIKL source inventory was **SKIPPED** (metadata-only), not passed.
- Browser G2P integration [41809183570](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41809183570): **PASS**.
- Paired Native/g2pK [41809183782](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41809183782): **PASS**.
- External UGTPHON [41809183902](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41809183902): **PASS**.
- Morphology consensus [41809183398](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41809183398), morphology adapter smoke [41809183542](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41809183542), and exhaustive test-case extraction [41809183481](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41809183481): **PASS**.
- Multi-engine benchmark [41809183760](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41809183760): **PASS**, all 17 comparison/export/runtime-parity steps passed. Artifact [13312557366](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41809183760/artifacts/13312557366), SHA-256 `c33601cf32fbe70aa4f199936eeacb749f4f305dabd574f44dc9d3da02b89315`.
- CharsiuG2P inference, ByT5 inference, and neural pairing were **SKIPPED** under the default-off policy. They are not passes and no neural result is claimed.

### Runtime parity

On the same pinned UGTPHON occurrences and shared IPA profile:
- Surface Hangul: **2,703/2,703 identical** between Native and Browser.
- Raw IPA: **2,698/2,698 identical**.
- Broad IPA: **2,698/2,698 identical**.
- Both runtimes scored the same 2,698 occurrences and abstained on the same five.

This verifies implementation parity, not independent pronunciation accuracy.

### Refreshed paired diagnostic against the unchanged original g2pK 0.9.4 baseline

**UGTPHON, 2,698 paired scored occurrences**
- Kozak Kim: 1,431 exact (**53.0393%**), CER **8.9920%**.
- Original g2pK: 1,433 exact (**53.1134%**), CER **9.2304%**.
- g2pK's exact-match point edge is **0.0741 pp**; the paired row-cluster 95% CI for g2pK-minus-Kozak exact delta is **−0.0824 to +0.2840 pp**, crossing zero.
- Kozak Kim's CER is lower by **0.2384 pp**; paired row-cluster 95% CI for g2pK-minus-Kozak CER delta is **+0.1392 to +0.3464 pp**.

**SIGMORPHON 2021, 998 paired scored occurrences**
- Kozak Kim: 358 exact (**35.8717%**), CER **14.5598%**.
- Original g2pK: 353 exact (**35.3707%**), CER **14.8222%**.
- Kozak Kim has five net exact wins (five Kozak-only exact, zero g2pK-only exact); exact two-sided McNemar **p = 0.0625**, so the exact-match result is promising but not decisive at the 0.05 threshold.
- Paired row-cluster bootstrap gives a descriptive Kozak-minus-g2pK exact delta interval of **+0.1002 to +1.0020 pp** and a CER improvement interval of **+0.0986 to +0.4444 pp**. These descriptive bootstrap intervals are not substituted for the exact McNemar test or a preregistered inference plan.
- The broad-candidate view is separately reported and is sensitivity analysis only; its normalizations remove selected IPA distinctions and do not establish normative IPA accuracy.

The two pinned corpora are diagnostic annotations, not independently adjudicated Korean IPA gold. The g2pK surface is rendered through the shared project IPA adapter, so it is not an independent IPA encoder. Neither corpus measures Ukrainian target quality. No universal engine-superiority claim is made.

### R013 phrase-boundary acceptance

**DONE_VERIFIED:** exact NIKL §27 adjacent-eojeol licenses `줄 것` and `많을 거` now have current-head Python and Browser verification. Python phrase mode records the exact adjacent pair index and trace context; Browser uses the same exact pair map. Compact no-space forms and punctuation-separated boundaries remain negative controls. Phrase mode assumes connected speech; NIKL §27 says a pause blocks fortition, and the text API does not infer pauses. This is a rule-derived surface/phonology result, not direct acoustic IPA attestation.

### Remaining blockers

- Independent Korean IPA adjudication: two qualified reviewers must annotate the frozen 24-case blind packet; no reviewer annotation is yet accepted.
- Independent Ukrainian target-layer review and reader validation.
- Item-level NIKL reuse/KOGL verification; metadata-only inventory remains skipped and the official metadata route has returned 403.
- C12 aspirated-velar coarticulation: exact-environment primary acoustic/articulatory evidence and independent item-level IPA review are missing; no `kx/kç → kʰ` production rewrite.
- Historical 239-case mismatch population: exact source/context adjudication remains incomplete. The refreshed 36-row unmapped-Broad queue is a separate generated subset (36/36 context lookups found), not a resolution of all 239 historical occurrences.
- Remaining NIKL interaction, names/loans, Hanja, and regional/style coverage remain partial or unverified.

**Readiness:** software and current branch CI are verified for this continuation; the overall system remains a **research prototype**, not research-certified or release-ready. Original g2pK 0.9.4 and vendored source remain unchanged and comparison-only.


## 2026-11-04 — C12 primary acoustic evidence refinement

A relevant peer-reviewed primary source has now been identified and reviewed: Schweizer, Ahn & Kwon (2026), *Acoustic properties of Seoul Korean stops in phrase-initial and word-medial positions*, Journal of the International Phonetic Association 56, Article e6, DOI 10.1017/S002510032510087X. Cambridge Core identifies the article as Open Access under CC BY 4.0. The source is registered as `SRC-JIPA-SCHWEIZER-AHN-KWON-2026-SEOUL-STOPS`.

The paper reports two datasets: a controlled production experiment with nine native Seoul-Gyeonggi speakers and a reading-corpus analysis of 15 female speakers from the NIKL 2005 Speech Corpus. It measures burst duration from stop release to voicing onset (or F2 onset for pre-voiced tokens), closure duration, voicing during closure, post-stop f0, F1 and H1*-H2*. It finds that the acoustic realization of the three-way stop contrast depends on prosodic position and other speaker/context factors; in word-medial contexts aspirated stops have longer release+aspiration burst durations than lax stops in the reported conditions.

**Evidence boundary:** this is direct primary acoustic evidence for the general release/aspiration behavior of Seoul Korean stops. It is *not* direct evidence for the specific narrow strings `[kx]` or `[kç]`, does not report those as target transcriptions, and does not adjudicate the 37 C12 occurrences. It therefore improves the general acoustic evidence base but does not close the C12 acceptance gate.

**Status:** PARTIAL — general acoustic evidence identified and source-registered; BLOCKED — exact [kx]/[kç] interpretation, source-audio crosswalk, dialect/prosodic conditioning and two independent Korean IPA reviews. No Kozak Kim production rule, IPA adapter, lexical entry or default profile was changed. The broad /kʰ/ category remains intact; any future [kx]/[kç] treatment must be a separately typed, evidence-backed narrow variant rather than a phonological replacement.

The secondary Wiktionary note suggesting [kx] before /ɯ/ and [cç] before /i,j/ is not accepted as primary evidence: its footnote does not resolve to a traceable source in the retrieved page. It may be retained only as a search lead, not as a rule license.


## 2026-11-04 final continuation status — Kozak Kim only

**Production-code head:** a6ac71c1f3b2c543544e8bf4331f7a6555374422. No Kozak Kim production source or benchmark implementation changed after the earlier verified code head 9803eef502ea655319954520b984fe33049ffe8e; subsequent changes are source-register, evidence, documentation and regression-test updates.

### Exact-head checks before the final C12 data-distribution assertion
- System Verify 41813316574 and 41813324446: PASS — Browser regression suite 1,395/1,395, Vite production build/generated-page checks, Python regression and data-integrity suite.
- Browser G2P 41813324361, paired Native/g2pK 41813324279, external UGTPHON 41813324358, morphology consensus 41813324282, morphology smoke 41813324356, and exhaustive test-case extraction 41813324414: PASS.
- Latest completed multi-engine comparison 41809183760: PASS, artifact 13312557366, SHA-256 c33601cf32fbe70aa4f199936eeacb749f4f305dabd574f44dc9d3da02b89315.
- The C12 occurrence-distribution assertion is added in this final documentation/test commit and must be included in the final System Verify rerun.
- NIKL metadata-only inventory, CharsiuG2P and ByT5 inference remain SKIPPED, not passed.

### Paired diagnostic against unchanged original g2pK 0.9.4
- UGTPHON paired set (n=2,698): Kozak Kim 1,431 exact (53.0393%), CER 8.9920%; g2pK 1,433 exact (53.1134%), paired CER 9.2304%. Exact-match delta is only 0.0741 pp in g2pK's favour and its paired 95% CI crosses zero (−0.0824 to +0.2840 pp). Kozak Kim CER is lower by 0.2384 pp (paired CI for g2pK-minus-Kozak CER: +0.1392 to +0.3464 pp).
- SIGMORPHON paired set (n=998): Kozak Kim 358 exact (35.8717%), CER 14.5598%; g2pK 353 exact (35.3707%), paired CER 14.8106%. Five net Kozak-only exact wins yield exact two-sided McNemar p=0.0625: promising, not decisive at 0.05. Kozak Kim CER is lower by 0.2508 pp (paired bootstrap CI +0.0986 to +0.4444 pp). The full g2pK scored-set CER is 14.8222% on 999 cases; do not confuse it with the 998-case paired CER.
- These corpora are diagnostic annotations, not independently adjudicated Korean IPA gold. g2pK's IPA is rendered through the shared project adapter; it is not an independent IPA encoder. No universal superiority claim follows.

### C12 — evidence refinement, no production rewrite
The 37 mismatch rows represent 29 unique token strings: 16 kxɯ-only, 12 kçi-only, 8 kçj-only, and one overlapping kxɯ+kçi row (키큰남). Source-row namespaces: 12 multilexnorm2026, 25 dc_inside. The fragment CSV contains text/IPA fields but no audio or speaker metadata.

Schweizer, Ahn & Kwon (2026), JIPA 56, e6, DOI 10.1017/S002510032510087X, CC-BY-4.0, is registered as contextual primary acoustic evidence. It measures burst duration (release to voicing onset; release+aspiration if any), closure duration, voicing and spectral measures. Study 1 uses following /a/; Study 2 uses /i,u,a,ʌ/. It has no /ɯ/ or /j/ target context and reports no [kx]/[kç] transcription. It cannot adjudicate the C12 tokens. Status remains PARTIAL for general acoustic evidence and BLOCKED for exact [kx]/[kç] interpretation, source-audio/annotation crosswalk and two independent Korean IPA reviews. No C12 production rule, lexical entry or narrow IPA profile was added.

### Scope and readiness
- Kozak Kim is the only engine being improved. Original g2pK 0.9.4 remains an unmodified comparison baseline; all nine vendored g2pK files are byte-identical to current main and the dependency remains pinned.
- The 36-row unmapped-Broad queue (55 fragments; 36/36 context lookups found) is not a resolution of the historical 239-case mismatch population.
- Independent Korean IPA review, Ukrainian target-layer review, item-level NIKL reuse verification, C12 audio adjudication, and names/loans/Hanja/regional-style coverage remain open.
- Readiness: research prototype; not research-certified and not release-ready.


## 2026-11-04 — final verification refresh and methodology review

**Exact verified pre-documentation head:** `8615aa8eb4195c23bc7ff0a3eac64ae122af9b46` (PR #426, still draft/open; base PR #425). The following workflows completed on this exact head:

- System Verify [41815472574](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472574): PASS. Python regression/data-integrity job PASS; Browser regression/build PASS, **1,395/1,395 tests, 0 failures**. Vite production build and generated-page checks passed. The Python pytest output reached 100% with no failures; pytest did emit its intentional diagnostic-only Python-vs-pinned-JS comparison warning (18/20 equal, two known port divergences where Python matches the project practical adapter). This warning is not a suite failure.
- Browser G2P [41815472566](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472566): PASS (25/25 tests).
- Paired Native/g2pK [41815473135](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815473135): PASS. UGTPHON shared scored set n=2,698: Kozak Kim 1,431 exact (53.0393%), CER 8.9920%; original g2pK 1,433 exact (53.1134%), CER 9.2304%. Exact-match difference remains inconclusive; Kozak CER is lower by 0.2384 pp. g2pK's full 2,703-case denominator is not the paired denominator.
- External UGTPHON [41815472667](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472667), morphology consensus [41815472569](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472569), morphology smoke [41815472553](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472553), and exhaustive test-case extraction [41815472973](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472973): PASS. The morphology-consensus diagnostic did not improve exact matches and had slightly higher CER than strict (0.090093 vs 0.089920); it remains diagnostic-only, not a production replacement.
- Multi-engine benchmark [41815472970](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472970): PASS; all 17 workflow steps succeeded. Artifact [13314914671](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41815472970/artifacts/13314914671), SHA-256 `b33d8838877ef2bf89f959e920d1d4c82c831a108248fa002dbd773316e27a14`. Its multi-engine runner reports 71 Python checks and 25 Node tests passing. This is diagnostic comparison, not normative IPA adjudication.
- Official NIKL metadata-only inventory: SKIPPED. CharsiuG2P inference, ByT5 inference and neural pairing: SKIPPED. None is reported as passed.
- Non-fatal environment/build notices: Node 20 deprecation notices from upstream Actions, Node `punycode`/`url.parse` deprecations, and Vite's large-chunk warning. No failed check is attributed to these notices.

### C12 exact-data verification

The final regression assertion now validates all 37 C12 occurrence rows, 29 unique token strings, the exact pattern partition (16 `kxɯ` only, 12 `kçi` only, 8 `kçj` only, one overlapping `kxɯ+kçi` row), source namespaces (12 `multilexnorm2026`, 25 `dc_inside`), and the absence of audio/speaker columns in the fragment CSV. CI passed on this assertion. This verifies the mismatch dataset's structure, not the acoustic interpretation of the source IPA.

### Methodology review and decisions

- **Superpowers:** retain plan-first execution, one vertical slice at a time, TDD red→green, systematic diagnosis for failed checks, and a final verification gate.
- **Matt Pocock Skills:** retain public-behaviour test seams, independent expected values, one change per slice, and separate standards/spec review axes.
- **Ponytail:** retain the smallest justified change, reuse of existing Python/Browser rule maps and repository contracts, and review of surrounding callers rather than diff-only inspection.
- **Unlazy:** apply explicit acceptance gates, task decomposition, evidence fingerprints/artifact references, and re-verification of already completed checks. The repository already has canonical master plan, acceptance-gates, coverage matrix and task ledger; therefore no duplicate `GATES.md`, external skill dependency, hook, or imported script was added. Unlazy's executable checker requires local shell approval and is not available through this GitHub-only execution path.
- **Ruling:** keep the project's existing phonetic-engineering skill and canonical execution records as the source of truth; borrow compatible methods, do not wholesale vendor four agent frameworks or duplicate their overlapping ledgers. This avoids maintenance burden and preserves the user's existing architecture.

### Current task ledger

| Work item | Status | Evidence / acceptance still required |
|---|---|---|
| Current Python regression/data integrity, Browser suite/build, Browser G2P and diagnostic workflows | DONE_VERIFIED at exact head above | Re-run after this documentation-only refresh; do not transfer this exact-head claim to later code changes. |
| C12 row-count, unique-token, pattern and source-namespace integrity | DONE_VERIFIED | Regression assertion passed in System Verify. |
| C12 exact [kx]/[kç] acoustic interpretation | BLOCKED | Obtain source recordings, speaker/dialect/prosodic metadata and original annotation protocol; then two independent Korean IPA reviews. No production rewrite. |
| Independent Korean IPA blind packet (24 cases) | BLOCKED | Two qualified reviewers annotate independently, reconcile disagreements, and provide provenance. |
| Ukrainian target layer | BLOCKED | Independent Ukrainian phonetic/orthographic review and reader validation; corpus IPA metrics cannot substitute. |
| NIKL item-level reuse/KOGL permissions | BLOCKED | Item-specific source and redistribution/reviewer-sharing rights evidence; official metadata crawl currently returns 403. |
| Historical 239-case mismatch population | PARTIAL / EVIDENCE-LIMITED | Reconstruct exact source/context memberships and adjudicate every retained occurrence; the 36-row unmapped-Broad queue is not a substitute. |
| C01–C11 optional variants and profile conventions | PARTIAL / REVIEW-PENDING | Review token contexts, dialect/prosody and source transcription conventions; two independent IPA reviewers before promoting any narrow profile. |
| Names, loans, Hanja, regional/style coverage | TODO / PARTIAL | Evidence-backed scoped datasets and explicit uncertainty/abstention acceptance; Hanja and RR remain separate research modes. |
| Neural teacher evaluation | DEFERRED / SKIPPED | Only revisit with reproducible licensed model weights, independent held-out IPA gold and a demonstrated advantage; no production integration now. |
| Original g2pK 0.9.4 baseline | DONE_VERIFIED as preserved dependency | Keep pinned and unmodified; comparison output remains diagnostic and is not used as a source of production rules. |

**Readiness remains:** research prototype; software checks for the exact head are green, but research certification and release acceptance are not met.


## 2026-11-04 — R013 occurrence-scope defect found and corrected

**Code/test head:** `648949a40638a7b0d18b8c026b15de7e24a1235f`.

### Root cause and TDD evidence

A focused re-review of the R013 attached ending `-ㄹ게` found that Python accumulated the licensed syllable pair in a sentence-global `attested_l_ge_pairs` set. If one complete `-ㄹ게` ending licensed `할>게`, another identical pair inside a longer, unrelated eojeol could inherit that permission.

The minimal counterexample is `할게 할게다`:
- RED commit `34fffa593bd10a16a2d963b252cef92caa8ed7d3`, System Verify [41841891363](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41841891363): the new Python regression failed exactly as predicted: actual `할께 할께다`, expected `할께 할게다`. Browser regression/build passed on the same red commit.
- GREEN commit `3358b81492022da11154b375121bbd16e1912c13`: replaced the global pair set with an occurrence-indexed `attested_l_ge_contexts` map. R013 now authorizes the exact eligible position; unrelated same-pair positions cannot inherit the license.
- Browser parity regression commit `648949a40638a7b0d18b8c026b15de7e24a1235f`: added the same counterexample to the Browser morphology guard suite. Browser already checked the exact eojeol and correctly returns `할께 할게다`.

### Exact-head verification

- System Verify [41842288415](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288415): PASS on the code/test head; Python regression/data integrity PASS; Browser **1,396/1,396**, 0 failures; production build/generated-page checks PASS. The new Browser counterexample is test 1,148 and passed.
- Browser G2P [41842288550](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288550): PASS.
- Paired Native/g2pK [41842288377](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288377), external UGTPHON [41842288200](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288200), morphology consensus [41842288389](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288389), research morphology smoke [41842288230](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288230), and test-case extraction [41842288344](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288344): PASS.
- Multi-engine benchmark [41842288431](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41842288431): IN PROGRESS at this ledger update. Its 12 setup/validation/adapter/holdout steps have passed; the multi-engine comparison is running, and queue export, same-occurrence Browser, runtime parity, SIGMORPHON and artifact upload have not yet been verified on this head. Do not infer a final result.
- Official NIKL metadata-only inventory: SKIPPED, not passed. Neural inference: SKIPPED.
- All nine vendored `src/vendor/g2pk/` blobs are SHA-identical to current `main`; no vendored g2pK file changed.

### Review correction

The earlier self-review entry stating that no Important defect was identified is superseded for this area: the earlier review did not include this sentence-level repeated-pair counterexample. The focused re-review found one Important correctness defect, reproduced it with a red test, fixed it, and verified both runtimes. This remains an author self-review, not independent human review; PR #426 has no submitted reviews or inline review threads.

### Updated task disposition

| Task | Status | Evidence / remaining acceptance |
|---|---|---|
| R013 `-ㄹ게` license must remain inside the exact eligible occurrence | DONE_VERIFIED | Red failure 41841891363; occurrence-indexed fix 3358b814; phrase-mode same-eojeol regression added test-first (red 41848156604 on 873a8e980acc5e4a16d5c0d2c34afe8999f0fc6c); final fix on 02a72da6534b110d63810c497a6b7fba9b790a3e; System Verify 41849672939 PASS. |
| R013 exact phrase and same-eojeol licenses in phrase mode | DONE_VERIFIED for software behavior | System Verify 41849672939 PASS on 02a72da6534b110d63810c497a6b7fba9b790a3e; exact adjacent eojeol and same-eojeol licenses both retained, with compact/punctuation negatives. Pause/cohesion still conditional. |
| Multi-engine benchmark on current Kozak Kim head | PARTIAL / IN_PROGRESS | Completed artifact from 41843472619 (artifact 13330749031, SHA-256 4c0b22df3e964b6483c098b066497dbe5518ed13e6a55af919e41a1d8cbb357d); current exact-head rerun 41849673041 remains at step 13. |
| Independent Korean IPA / Ukrainian target review | BLOCKED | Human reviewers and adjudication still absent. |
| C12 acoustic interpretation and NIKL item-level rights | BLOCKED | Source audio/metadata and item-specific rights evidence remain unavailable. |

No g2pK source, dependency pin, or vendor blob was modified. PR #426 remains Draft/open, stacked on PR #425. No merge, release, deployment, force-push or branch deletion. Readiness remains research prototype, not research-certified or release-ready.


## 2026-11-04 exact-head continuation — benchmark refresh and NIKL length adjudication

**Latest verified code/test baseline before this evidence-only patch:** `3a262b317a6ec5ffa49a11ebd46926be2d5a1a72`. The current evidence-only branch head includes a test-first RED checkpoint described below; no production engine code changed in this continuation.

### Test-first evidence update

- RED commit `e11be81d5a2db517aa808a12f6eb31264fb492ef`; System Verify [41869617954](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41869617954) failed only in Python data-integrity because the newly added test correctly found the missing source-register key `SRC-NIKL-KRDICT-89917`. The Browser regression/build job passed; official NIKL metadata-only inventory was skipped.
- The failure was the expected missing evidence record, not a Kozak Kim pronunciation defect. The implementation response is source-register/catalog/ledger addition only; production IPA remains unchanged.
- The new test asserts the official dictionary's Hangul form `없는[엄ː는]` and separately checks the project's current broad IPA `ʌːm.nɯn`. It explicitly does not claim that the dictionary supplies IPA.

### Current exact-head verification (before this evidence-only patch)

- System Verify [41851913461](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41851913461): PASS — Python regression/data integrity and Browser regression/build jobs succeeded; official NIKL metadata-only inventory was skipped.
- Multi-engine Korean IPA diagnostic [41851913351](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41851913351): PASS. Artifact 13337845603; SHA-256 `7c0dce9cada1c15a22f99f18bea048b75f2df9b0133d9e87fcda3f95b82a484c`.
- External UGTPHON [41851913522], paired Native/g2pK [41851913346], Browser G2P [41851913352], exhaustive test-case extraction [41851913799], morphology consensus [41851913516], and real-engine morphology smoke [41851913585]: PASS.
- Multi-engine neural inference jobs (CharsiuG2P, ByT5 and pairing neural outputs): SKIPPED, not passed. Official NIKL metadata-only inventory: SKIPPED, not passed.

### Paired diagnostic against unchanged original g2pK 0.9.4

- UGTPHON paired set (n=2,698): Kozak Kim 1,431 exact (53.0393%), CER 8.9920%; g2pK 1,433 exact (53.1134%), paired CER 9.2304%. Exact-match delta is 0.0741 percentage points in g2pK's favour, with paired row-cluster 95% CI −0.0824 to +0.2840 pp (crosses zero). Kozak Kim CER is lower by 0.2384 pp; paired CI for g2pK-minus-Kozak CER is +0.1392 to +0.3464 pp.
- SIGMORPHON paired set (n=998): Kozak Kim 358 exact (35.8717%), CER 14.5598%; g2pK 353 exact (35.3707%), paired CER 14.8106%. Five net Kozak-only exact wins; exact two-sided McNemar p=0.0625 (promising, not decisive at 0.05). Kozak Kim CER is lower by 0.2508 pp; paired bootstrap CI +0.0986 to +0.4444 pp.
- Broad-candidate sensitivity is higher for Kozak on both sets (UGTPHON 86.47% vs 85.69%; SIGMORPHON 69.74% vs 68.74%), but the profile removes selected IPA distinctions and is research-only/unadjudicated. Do not report these as normative accuracy.
- The two corpora are diagnostic annotations, not independently adjudicated Korean IPA gold. g2pK is rendered through the shared project IPA adapter. No universal superiority claim follows.

### Native/Browser parity

On the 2,703 eligible UGTPHON occurrences, Native and Browser surface Hangul are identical (2,703/2,703); on 2,698 scored IPA occurrences, raw IPA is identical (2,698/2,698). Both runtimes abstain on the same five cases. This verifies cross-runtime parity, not linguistic correctness.

### C13 — source-attested length in 없는

The four UGTPHON cases (`dc_inside_2035`, `dc_inside_2108`, `dc_inside_2212`, `dc_inside_2269`) all show Kozak `/ʌːm.nɯn/`, g2pK `/ʌm.nɯn/`, corpus `/ʌ̹mnɯn/`. NIKL Korean Basic Dictionary entry 89917 directly lists `없는[엄ː는]`. The corpus omits the long mark, so g2pK's exact match is not the stronger source-backed reading. Kozak's output is preserved; no production change and no benchmark reference rewrite. Source row `SRC-NIKL-KRDICT-89917`, catalog row `S026`, C13 cluster and four paired occurrence rows record the adjudication. The official source supplies Hangul, not IPA; the project's broad IPA is derived. Item-level KOGL status remains unchecked.

### Methodology applied from the four referenced engineering repositories

- **Superpowers:** red/green discipline and systematic root-cause investigation. The new test was observed failing for the expected missing evidence key before the source/catalog records were added.
- **Matt Pocock skills:** small composable engineering checks; preserve the existing task contract rather than replacing it with a new process.
- **Ponytail:** minimal-change discipline; this finding did not justify modifying phonological production code.
- **unlazy:** explicit acceptance evidence and re-verification; runnable checks are reported separately from skipped/manual gates.

These methods are used as engineering practices, not vendored dependencies or new production packages.

### Remaining blockers and readiness

Independent Korean IPA adjudication (24-case blind packet), independent Ukrainian target review, item-level NIKL/KOGL permissions, C12 source audio and speaker/prosodic crosswalk, historical 239-case adjudication, and broad NIKL/names/loans/Hanja/regional-style coverage remain open. Neural teacher inference remains deferred/skipped. Original g2pK 0.9.4 and all vendored g2pK files remain unchanged.

Readiness: **research prototype**, not research-certified or release-ready.


## 2026-11-04 final verification checkpoint — evidence-only NIKL length adjudication

**Branch head entering this checkpoint:** `9b81a412d733b61ddd0782920ef727291cd1a374`. The C13 continuation changes only source metadata, discrepancy evidence, tests, and documentation; Kozak Kim production code and the pinned g2pK baseline are unchanged.

### Red/green and exact-head verification

- Test-first RED: `e11be81d5a2db517aa808a12f6eb31264fb492ef`; System Verify [41869617954](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41869617954) failed exactly because `SRC-NIKL-KRDICT-89917` had not yet been registered. The Browser suite passed at this RED checkpoint.
- Evidence GREEN: `00aa0b6ebb1c4dfae906d4661cb88d8b8d0876a9` added the NIKL source to the research register and source catalog, C13 and four paired occurrence rows, and the test asserting the source-backed length and the existing Kozak IPA.
- Follow-up test correction: `9b81a412d733b61ddd0782920ef727291cd1a374` updated the Browser source-rights audit's expected register count from 176 to 177 and REVIEW_REQUIRED from 164 to 165, and explicitly checks the new source remains unresolved for item-level rights. This was a stale fixed-count assertion caused by the new source record, not a browser-engine regression.
- Exact-head System Verify [41870455925](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41870455925): PASS — Python regression/data integrity PASS; Browser **1,396/1,396**, 0 failures; Vite build (55 modules) and generated-page checks PASS. A duplicate exact-head verify [41870442892](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41870442892) also PASS.
- Browser G2P [41870455567], paired Native/g2pK [41870455546], external UGTPHON [41870455517], morphology consensus [41870455515], morphology adapter smoke [41870455495], and exhaustive extraction [41870455600]: PASS.
- Multi-engine rerun [41870455614] is still in progress at the multi-engine comparison step as of this checkpoint. Do not claim a result from that run until it completes. The latest completed exact production-code benchmark remains [41851913351], artifact 13337845603, SHA-256 `7c0dce9cada1c15a22f99f18bea048b75f2df9b0133d9e87fcda3f95b82a484c`; production code is unchanged since that benchmark.
- Official NIKL metadata-only inventory: SKIPPED, not passed. CharsiuG2P and ByT5 inference: SKIPPED, not passed.

### C13 source adjudication: 없는

The four UGTPHON occurrences (`dc_inside_2035`, `dc_inside_2108`, `dc_inside_2212`, `dc_inside_2269`) all have Kozak `/ʌːm.nɯn/`, original g2pK `/ʌm.nɯn/`, and corpus reference `/ʌ̹mnɯn/`. NIKL Korean Basic Dictionary entry 89917 directly lists `없는[엄ː는]`. This supports the long vowel at the Hangul surface level; it does not supply IPA. The project's `/ʌːm.nɯn/` is the derived broad-IPA rendering. The corpus annotation omits length, so g2pK's exact string match is not the stronger source-backed reading. Preserve Kozak's existing output; do not shorten it or rewrite the raw corpus reference.

Source register: `SRC-NIKL-KRDICT-89917`; catalog: `S026`; mass cluster: C13; paired ledger: occurrence IDs 893, 1145, 1621, 2290. The new Python regression passed on the exact verified head. Item-level KOGL marking remains unchecked.

### Existing source-backed comparative wins retained

- `인기`: NIKL Q&A 331569 explicitly gives optional `인기[인끼]`; the existing `variant-aware-research` row preserves the non-fortis alternative. The current paired occurrence is native exact and g2pK non-exact. This is a lexical optional variant, not a productive ㄴ+ㄱ or all-`氣` rule.
- `못잃어`: the existing `variant-aware-research` entry keeps both `몬니러` and `모시러` candidates. NIKL's 2022 usage survey discusses both n-insertion and non-insertion for `못 잃어`, but the percentages in the surfaced table belong to `못 잇는다` and must not be transferred. The primary candidate is not a normative ranking. The paired occurrence is native exact and g2pK non-exact.
- These existing rows are preserved; no new productive rule or production override was introduced in this checkpoint.

### Readiness and handoff

- Original g2pK 0.9.4 remains pinned and unchanged; no vendor file was touched.
- PR #426 remains Draft/open, based on PR #425; it is a stacked change and must not be merged independently. No merge, release, deployment, force-push, or branch deletion.
- Independent Korean IPA review, independent Ukrainian target review, item-level NIKL rights, C12 source audio/speaker/prosodic crosswalk, historical 239-case adjudication, and names/loans/Hanja/regional-style coverage remain open.
- Research-only neural inference remains deferred/skipped.
- Readiness remains **research prototype**, not research-certified or release-ready.


### 2026-11-04 status correction — multi-engine rerun

The first attempt of multi-engine workflow run [41870455614](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41870455614) was **cancelled** while the `Run multi-engine comparison` step was active. It produced no final artifact and no new benchmark score. A rerun of the failed/cancelled multi-engine job (job ID `126716565928`) was requested; attempt 2 was pending/queued at the latest status check. Until that rerun completes, use the latest completed benchmark artifact from run `41851913351` (artifact `13337845603`, SHA-256 `7c0dce9cada1c15a22f99f18bea048b75f2df9b0133d9e87fcda3f95b82a484c`). The production engine has not changed since that completed artifact; do not claim the cancelled attempt passed.


### Final status correction — multi-engine run attempts

Run `41870455614` was cancelled twice: attempt 1 while `Run multi-engine comparison` was active; attempt 2 during `Install the native engine, comparison dependencies, and eSpeak NG`. Neither attempt produced a final benchmark artifact. No new score is claimed. No further rerun was started because the repository already has a completed reproducible multi-engine artifact (`41851913351`, artifact `13337845603`, SHA-256 `7c0dce9cada1c15a22f99f18bea048b75f2df9b0133d9e87fcda3f95b82a484c`) on unchanged Kozak Kim production code. If a fresh comparison is needed, the next acceptance step is to diagnose why the Actions job is cancelled and then obtain a complete artifact; do not treat cancellation as a benchmark failure or success.


## 2026-11-04 exact-head continuation — final multi-engine evidence

**Branch / PR:** `fix/kozak-kim-water-price-lexical-exception-2026-11-03`, PR #426 Draft/open, stacked on PR #425. Exact head: `e2131ad93dd58049aa68ccf1b88563acfe185ef5`. The benchmark artifact is from this exact head: [workflow 41872601963](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41872601963), artifact 13347030495, SHA-256 `aacf63f6b68a717bc13922160195d7d7d55d639ec12cdec9906669666e781812`.

### Exact-head verification
- System Verify 41872601794: PASS — Browser regression 1,396/1,396; Python regression/data-integrity command exited successfully; Vite production build and generated-page checks passed. Hanja build generated 184,079 word readings in 19 lazy chunks plus 555 single-syllable readings (4,067,901 generated bytes).
- Browser G2P 41872601768, Native-vs-original-g2pK 41872601752, external UGTPHON 41872601829, morphology consensus 41872601855, morphology adapter smoke 41872601866, and exhaustive test-case extraction 41872601824: PASS.
- Multi-engine UGTPHON + SIGMORPHON run 41872601963: PASS; artifact above. All 10 pinned engine entries produced scored tokens on both splits, including original g2pK 0.9.4. CharsiuG2P inference, ByT5 inference, and neural pairing were SKIPPED, not passed.
- NIKL metadata-only inventory remained SKIPPED. No independent IPA or Ukrainian review is implied by these software checks.

### Paired diagnostic against unchanged original g2pK 0.9.4

**UGTPHON Korean test split:** 275 source rows, 2,703 eligible occurrences, 1,907 unique Hangul words; 2,698 paired scored occurrences (five Kozak abstentions).
- Kozak Kim Native: 1,431/2,698 exact (53.0393%), CER 8.9920%.
- g2pK paired subset: 1,433/2,698 exact (53.1134%), CER 9.2304%.
- g2pK-minus-Kozak exact delta +0.0741 percentage points; paired row-cluster 95% CI [−0.0824,+0.2840] pp crosses zero.
- g2pK-minus-Kozak CER delta +0.2384 pp; paired row-cluster 95% CI [+0.1392,+0.3464] pp. Lower CER favours Kozak.
- Broad-candidate sensitivity only: Kozak 2,333/2,698 exact (86.4715%), CER 2.1317%; g2pK 2,312/2,698 exact (85.6931%), CER 2.3751%. This normalization is explicitly research-only/unadjudicated and is not a new normative score.

**SIGMORPHON 2021 Korean public lexical test:** 1,000 file rows, 999 eligible Hangul occurrences, 999 unique words; 998 paired scored occurrences (one Kozak abstention).
- Kozak Kim Native: 358/998 exact (35.8717%), CER 14.5598%.
- g2pK paired subset: 353/998 exact (35.3707%), CER 14.8106%.
- g2pK-minus-Kozak exact delta −0.5010 pp; paired row-cluster 95% CI [−1.0020,−0.1002] pp.
- g2pK-minus-Kozak CER delta +0.2508 pp; paired row-cluster 95% CI [+0.0986,+0.4444] pp.
- The full g2pK run scores 999 cases; its full-set CER 14.8222% must not be substituted for the 998-case paired CER. SIGMORPHON README format notes differ from the pinned TSV contents; the workflow validates the actual pinned file and row count.

**Interpretation:** on both diagnostic splits Kozak Kim has lower CER than original g2pK. On SIGMORPHON it also has a higher paired exact-match rate; on UGTPHON the exact-match point estimate is two tokens lower and the paired interval crosses zero. These are corpus-relative results, not independent normative IPA gold and not Ukrainian-target validation. Do not claim universal superiority.

### Python / Browser parity — verified for the pinned UGTPHON split
- Surface Hangul: 2,703/2,703 identical.
- Scored raw IPA: 2,698/2,698 identical; five shared unresolved/abstained occurrences.
- Both runtimes use `clippyfirst-korean-broad-v1`, version 1, broad level, status `unadjudicated-cross-runtime`.
- This closes parity for this pinned occurrence set only; it does not adjudicate whether the shared profile is phonetically normative.

### Mismatch queue and C12 recheck
- Generated unresolved Broad queue: 36 ordered, unique occurrence IDs; all remain `UNADJUDICATED_DIAGNOSTIC` / `NO_CHANGE_PENDING_SOURCE_AND_IPA_REVIEW`. The tracked queue has the same 36 occurrence IDs (blob `fc331b42bbfd31700892d1f7df04dcb8578461f5`). No queue item is promoted to a phonological correction.
- Generated mismatch-fragment ledger: 1,267 rows. C12 remains 37 occurrences / 29 unique token strings: 16 `kxɯ` only, 12 `kçi` only, 8 `kçj` only, one `kxɯ+kçi` overlap; 12 source-row IDs are `multilexnorm2026`, 25 are `dc_inside`.
- The fragment schema still contains no linked audio or speaker metadata. The acoustic paper does not represent following /ɯ/ or /j/ and does not report [kx]/[kç]. C12 remains evidence-limited; no production rule, lexical entry, or narrow profile was added.

### Training readiness and scope
- Training audit: 644 lexical rows, 46 addition rows, 24 frozen holdout cases, zero addition rows explicitly marked as independently adjudicated IPA, and zero holdout forms with IPA gold. Supervised IPA training is **not ready**.
- Reviewer A/B holdout packets were generated without engine outputs; they remain awaiting independent annotation/adjudication. C01–C07 blind packets contain token/source-row IDs but lack licensed source utterance context and reviewer-sharing rights, so they are not yet ready for external scoring/dispatch. Issue #337 remains open without qualified submissions.
- Original g2pK 0.9.4 remains pinned and unmodified. No g2pK vendor file or external baseline was changed.
- Research readiness: comparative diagnostic evidence is materially stronger; independent IPA gold, independent Ukrainian target review, item-level NIKL reuse verification, C12 audio/prosody crosswalk, historical 239-case adjudication, and names/loans/Hanja/regional-style coverage remain open.
- Release status: **research prototype**, not research-certified and not release-ready.


## 2026-11-04 paired-discordance and abstention drill-down

### Where the paired engines actually differ

**UGTPHON (2,698 paired scored occurrences):** both exact 1,429; both non-exact 1,263; g2pK-only exact 4; Kozak-only exact 2; Kozak abstained on 5. All four g2pK-only exact occurrences are the same token `없는` repeated in the corpus. The two Kozak-only exact cases are `못잃어` and `인기`. The five abstentions are `칡칡이`, `쫒아내면`, `많앗구나유유유`, `삶의`, and `무서웟어`. Thus the four g2pK-only wins are not four independent lexical phenomena; they are a repeated annotation/convention case. No change to the native vowel-length or source-IPA policy is justified by these rows alone.

**SIGMORPHON (998 paired scored occurrences):** both exact 353; both non-exact 640; Kozak-only exact 5; g2pK-only exact 0; one additional Kozak abstention on the 999-token eligible set. The five Kozak-only exact cases are `값어치`, `놓치다`, `많다`, `맛없다`, and `인기`. The single abstention is `중심닮음`, unresolved at R002 boundary `닮>음` pending exact morphological evidence.

### `중심닮음` — researched, not promoted

A secondary Wiktionary entry decomposes `중심닮음` as `중심 + 닮- + -음`, classifies it as a North Korean mathematical noun, and gives an IPA labelled SK Standard/Seoul that exactly matches the SIGMORPHON gold. Its page is user-edited and licensed CC BY-SA 4.0. Because the IPA exactly matches the test gold, it is not independent corroboration; the North Korean classification also leaves dialect/scope unresolved. NIKL §14 supports the general complex-coda resyllabification pattern when the vowel-initial ending/suffix boundary is established, but does not independently attest this exact term. The source is registered as secondary/research-only. Keep the production R002 abstention; no lexical row or exact production license is added.

### Morphology consensus — no production promotion

On the 1,907 unique UGTPHON words, Kiwi and MeCab-Ko have 80.5978% exact boundary-set agreement. Across 217 common observed rule events their boundary-presence agreement is 94.0092%. The two-analyzer consensus changes three unique words versus strict, newly resolves one (`칡칡이`), and withholds 24 unspaced phrase-boundary cases. It does not improve the diagnostic gold score: strict 53.0393% exact / 8.9920% CER; consensus 53.0196% exact / 9.0086% CER. Treat this as diagnostic morphology evidence, not production accuracy or gold segmentation. Keep exact licenses fail-closed.

No production code change was justified by this drill-down. The next legitimate acceptance step is independent Korean morphological/IPA adjudication for the exact abstention and for the residual queue, not an engine-specific guess.


## 2026-11-04 focused status reconciliation — five owner-requested findings

This dated addendum supersedes earlier shorthand where the current repository evidence is more precise. It does not alter historical rows or mark unresolved research gates as passed.

| Finding | Current status | Evidence / acceptance criterion |
|---|---|---|
| Root project license | **DONE_VERIFIED — owner-selected custom policy documented** | Root `LICENSE` and `docs/LICENSING-AND-PERMISSIONS.md` define ClippyFirst's 2026 purpose-limited permissions. Scientific use of public-service results and the Korean→Ukrainian table is allowed with attribution; technical reuse requires prior written permission. This is not OSI-approved/open source. Third-party rights remain separate; legal enforceability and jurisdiction-specific application have not been independently reviewed. |
| Browser/Python versions | **DONE_VERIFIED — policy documented** | Private browser app `package.json` 1.0.0 and installable Python distribution `pyproject.toml` 0.6.0 are separate artifacts. Independent version streams are documented in `docs/VERSIONING-POLICY.md` and DEC-2026-006; no version values changed. |
| Korean IPA and Ukrainian adaptation | **BLOCKED — independent expert evidence** | Two independent qualified Korean IPA reviewers and separate Ukrainian target-layer review remain required. Existing packets/tests validate workflow, not phonetic correctness. |
| NIKL rights | **PARTIAL — site policy verified, item-level status open** | NIKL's official policy page states website materials may be reused under Copyright Act Article 24-2 unless a separate KOGL type is displayed. Current Article 24-2 text and its scope/exceptions are linked from the audit. The Standard Pronunciation Rules page remains inaccessible to the automated retrieval environment (HTTP 403); page-specific KOGL status is not established. Q&A item-level marks also require an explicit source-record decision. Keep the source register review status open. |
| Legacy 239 mismatch cases | **PARTIAL / EVIDENCE-LIMITED** | The 239 count is a historical population, not the current 36-row unmapped-Broad queue. Current diagnostic ledgers have distinct grains: 1,267 mismatch-fragment rows (all unadjudicated), 36 unmapped-Broad rows (all unadjudicated), 13 cluster rows, and 38 selected paired-discrepancy rows. Recover the exact 239 occurrence/source identities and reconcile them against current artifacts before adjudication; no guessed repairs. |

### Rights and mismatch acceptance

- NIKL: check each retained source page for a specific KOGL badge; record the item type, attribution requirement, derivative/commercial restrictions and whether the content is actually NIKL-authored or includes third-party material. A site-wide policy statement does not justify bulk-clearing uninspected items.
- Mismatches: produce a versioned, hash-pinned 239-occurrence crosswalk with source-row ID, token/context, dataset/profile/engine versions, reference convention and cluster assignment. If an original occurrence cannot be recovered, mark it explicitly unrecoverable with evidence; do not silently drop it.
- Only source-supported, independently adjudicated corrections may enter production, with positive/negative controls and exact-head regression evidence.

**Readiness:** partial research prototype. Software/documentation CI cannot close expert-review, legal-rights or historical evidence gates.


## 2026-11-05 — PR #434 merge and project-level disposition

PR #434 merged into `main` at `56318e8a293d6f92dc307256430279d386a77d33`. The owner-approved custom ClippyFirst licence, documentation map, repository audit and versioning policy are now integrated. This closes the root-license owner-decision gate and documentation discoverability work; it does not alter the linguistic or data-rights gates.

The exact PR head `fbfe7f481fa0ac35264bf060fc8170d7310f3176` passed Python 3.11/3.12/3.13, teacher-corpus audit, browser regression/build, wheel-install checks, System Verify and generated master-table/research-corpus checks. NIKL metadata-only inventory was skipped, not passed. No post-merge workflow result was returned for the merge commit, so none is claimed.

**Current project disposition: partial research prototype; not research-certified and not release-ready.** Remaining gates: independent Korean IPA gold/adjudication; independent Ukrainian target review; NIKL item-level KOGL/source-rights review; C12 audio/speaker/prosody crosswalk; hash-pinned reconciliation/adjudication of the historical 239 mismatch occurrences; remaining names/loanwords/Hanja/regional-style coverage; full cross-runtime parity where the rule-coverage matrix remains incomplete. Neural training remains deferred until independently adjudicated IPA gold exists.

The custom licence is purpose-limited and not OSI-approved/open source. Scientific use of public-service results and the Korean→Ukrainian correspondence table is permitted with attribution; technical reuse requires prior written permission. Third-party terms remain separate. See root `LICENSE`, `docs/LICENSING-AND-PERMISSIONS.md`, and DEC-2026-007.


## 2026-11-05 — whole-repository audit and current NIKL/Pages evidence

**Snapshot:** main `c1feae5fcc9e743ac7fba660221ad229b4ccf2ff`; see [repository audit addendum](../docs/REPOSITORY-AUDIT-AND-STRUCTURE-2026-11-04.md) and [structure guide](../docs/REPOSITORY-STRUCTURE.md).

### Current exact-head software checks
- Tests workflow [41924144853](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41924144853): PASS.
- System verification [41924144998](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41924144998): PASS.
- Master table/research artifacts [41924144992](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41924144992): PASS.
- Pages deployment [41924144861](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41924144861): FAIL at deploy. Python matrix and browser tests/build passed; the deployment status remained `updating_pages` for about eight minutes, then timed out and cancelled. No successful deployment or public smoke test is claimed for this run. The observed fault is in the Pages deployment wait; root platform cause remains unconfirmed.
- No local npm/pytest commands were executed in the audit session.

### NIKL status split — do not collapse into one gate
- **Local metadata inventory: DONE_VERIFIED.** `한국어 어문 규범.htm` parses the 30 articles of `제2부 표준 발음법`; manifest inventory is 30/30 with no missing/duplicate/unexpected/incomplete records. Local inventory run [40072018648](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072018648) and schema/reproducibility run [40072283788](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072283788) passed.
- **Capture authenticity: PARTIAL.** The saved HTML contains a `deepl-input-controller` node after `</body>` and references 17 relative assets not stored in the repository. Preserve this artifact; obtain a separate clean recapture with extensions disabled and compare exact-byte hashes.
- **Live HTTP/robots: BLOCKED / NOT CLAIMED.** Manifest is `local-html-import`; HTTP status/retrieval time are null and robots is `not_checked_local_import`.
- **Page/item reuse rights: BLOCKED/PENDING.** The site-wide NIKL Article 24-2 policy is registered, but page-specific KOGL markings and item-level Q&A/dictionary terms remain unverified. Do not treat public accessibility or the local file as permission to redistribute source text.
- **Linguistic review: PARTIAL.** A 30-article inventory is not expert adjudication of every clause, subparagraph, example, commentary passage, Korean surface reading, IPA or Ukrainian target.

### Repository governance
- Main is reported as unprotected by repository metadata; no external setting was changed. Decide whether to configure branch protection/rulesets.
- A stale merged docs branch remains 14 commits behind and 0 ahead; no branch deletion action was available. No new branch was created for the documentation pass.
- Issue #337 remains open for independent Korean phonetics reviewer recruitment.

**Readiness:** partial research prototype; not research-certified or release-ready. Software automation passes do not close independent Korean IPA review, Ukrainian target review, source rights, C12 acoustic/context evidence or historical mismatch reconciliation.


## 2026-11-05 — final exact-head verification at d7c4c539

The documentation/source-register corrections are now verified on `main` at `d7c4c539ae751ee9feda2aba9c5806cc6968ce55`.

- Browser tests: 1,396/1,396 PASS; Python 3.11/3.12/3.13 PASS; wheel install and teacher-corpus audit PASS ([tests workflow](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41985911802)).
- System Verify PASS ([run 41985911475](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41985911475)); live NIKL source-inventory job skipped by workflow config and not counted as a pass.
- Master table/research artifact generation PASS ([run 41985911482](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41985911482)).
- GitHub Pages deployment and post-deploy HTTP/Playwright smoke PASS ([run 41985911844](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41985911844)).
- Source register now parses as 178 records with exactly 12 fields each. A transient malformed-CSV change and a tested-status enum mismatch were both caught by CI and corrected before this final green head.
- Local NIKL HTML inventory remains 30/30; this does not close clean-capture authenticity, live HTTP/robots or page/item-level rights.

**Project readiness remains partial research prototype.** Passing build, test and deployment checks do not close independent Korean IPA gold, Ukrainian target review, NIKL item-level rights, C12 acoustic/context evidence, historical mismatch reconciliation or coverage/parity gates.


## 2026-11-05 — NIKL scope isolation and historical 239-case gate

**Verified implementation/test head:** `1869b8936c17077ac4fde308644d8588c132404c`.

| Gate | Status | Evidence / remaining acceptance |
|---|---|---|
| NIKL rule ownership | DONE_VERIFIED | R001–R016 remain in Kozak Kim. Browser and Python g2pK adapters preserve raw g2pK surfaces and do not consume NIKL surface/IPA/lexical overlays. |
| Engine-separation regressions | DONE_VERIFIED | Browser suite 1,393/1,393 PASS; Python 3.11/3.12/3.13 PASS; wheel install and teacher-corpus audit PASS. See runs 41988633305, 41988633224 and 41988508104. |
| Master/research artifact generation | DONE_VERIFIED | Run 41988633308 PASS. |
| Live NIKL inventory | SKIPPED / BLOCKED | The current System Verify run skips the live metadata-only inventory. The existing local HTML inventory remains 30/30; no new NIKL snapshot was created. Item-level KOGL rights and pristine capture authenticity remain unresolved. |
| Historical 239 Broad-v2 mismatches | PARTIAL / EVIDENCE-LIMITED | The 239 historical occurrence population is not a set of 239 confirmed defects. The 36-row queue and 1,266-row fragment export are different grains. Acceptance requires a hash-pinned occurrence ledger with full source context, profile/version provenance, expert adjudication, and an explicit fix/retain/abstain decision for every occurrence. |
| Independent Korean IPA gold | BLOCKED | Two qualified independent reviewers and adjudication are still required. |
| Ukrainian target review | BLOCKED | Independent Ukrainian phonetic/orthographic review remains required. |
| C12 context and source rights | BLOCKED | Reconstruct speaker/context/acoustic crosswalk and complete item-level source-rights review. |

**Readiness:** partial research prototype. Green software CI and engine-isolation tests do not certify pronunciation accuracy or release readiness.


## 2026-11-05 follow-up — historical mismatch work

| Gate | Status | Evidence / acceptance |
|---|---|---|
| Four context-restored NIKL §27 forms | DONE_VERIFIED | Exact-form licenses for `해줄것`, `많을거같이`, `내릴수있는`, `존중시킬수도있지만`; Python, browser, full-context and negative-control tests pass on `be65ee7`. |
| g2pK isolation for new forms | DONE_VERIFIED | Browser raw-port parity and Python pass-through tests confirm no Kozak Kim NIKL overlay enters either g2pK adapter. |
| `출산` mismatch | PARTIAL / RETAIN | Existing R012 / NIKL §26 fortis license retained; UGTPHON broad comparator omits fortis. Independent Korean review required before final adjudication. |
| Current 36-row queue | PARTIAL | Four exact-form corrections, one provisional retain, 31 rows not individually adjudicated in this pass. |
| Historical 239 occurrences | PARTIAL / EVIDENCE-LIMITED | 239 was the historical pre-C11/C12 population relative to C01–C10, not the current open-defect count. Complete occurrence-level context ledger is still missing. |
| Full post-fix UGTPHON benchmark | BLOCKED / NOT RUN | Historical 2,703-record report is pre-fix. Re-run the complete benchmark on the new code before reporting updated rates. |
| Python per-occurrence license provenance | PARTIAL | `RuleTrace.license_context` is scalar per rule pass; a multi-license sentence can retain only the last context. Add per-occurrence context arrays before treating sentence-level trace as exhaustive. |

**Readiness remains partial research prototype.** Passing regression tests and applying four exact rule corrections do not establish independent IPA gold or release readiness.


## 2026-11-05 follow-up — 31 row-level abstentions and Python trace provenance

| Gate | Status | Evidence / acceptance |
|---|---|---|
| Current 36-row Broad queue dispositions | PARTIAL / ROW-LEVEL DISPOSITIONS RECORDED | Four exact R013 corrections, one provisional R012 retain, and 31 individually recorded `ABSTAIN` decisions in [the 31-row register](kozak-kim-31-row-individual-abstentions-2026-11-05.csv). The abstentions are evidence-status decisions, not expert phonetic judgments. |
| 31-row queue membership and pinning | DONE_VERIFIED (register integrity) | Register is a one-to-one subset of the pinned 36-row queue; it records source row IDs, UGTPHON commit, queue blob SHA, Broad-v2 comparator, project broad profile, and explicitly marks unrecovered historical engine/normalizer versions. |
| Python per-occurrence RuleTrace | DONE_VERIFIED (software provenance contract) | RuleTrace retains backward-compatible scalar `license_context` and adds `license_contexts` plus `applied_occurrences` with source span, pair, eojeol, syllable index, matched license, before/after state, rule citation, confidence and status. Sentence-level R013 cases with multiple licenses are tested. |
| Complete historical 239-occurrence ledger | BLOCKED / EVIDENCE-LIMITED | The tracked 1,267-row fragment export, 36-row Broad queue, 13 clusters and 38 paired rows do not encode the exact historical 239 membership. The historical engine commit, normalizer version and full contexts for every occurrence are not recoverable from these artifacts alone. Acceptance requires the original 2026-11-02 benchmark occurrence artifact or an equivalent reproducible reconstruction pinned to its original report, source split and runner. No synthetic 239-row ledger has been created. |

**Interpretation:** all 36 rows in the current narrow queue now have a recorded disposition (four fixes, one provisional retain, 31 abstentions). This does **not** complete or stand in for the separate historical 239-occurrence population, and it does not constitute independent Korean IPA adjudication.


## 2026-11-05 follow-up — historical benchmark artifact recovery

| Gate | Status | Evidence / acceptance |
|---|---|---|
| Recover original historical benchmark artifact | DONE_VERIFIED | Run 41471244424, head `4f3f307c5bb056bce3b0aedc8ab07e0010eaa695`, artifact 13156351613, SHA-256 `749ac9a2b9db96c1e27828919afe05ef4320e35ca6a91ab2038c1ff3e9d04c69`; report contains 2,703 occurrences × 10 engines and the pinned source/profile/normalizer metadata. See `kozak-kim-historical-239-recovery-manifest-2026-11-05.md`. |
| Reconstruct exact 239-member population | BLOCKED / PREDICATE NOT REPRODUCED | The artifact and 1,267-row mismatch export do not carry the stable 239-member flag or complete fragment-to-C01–C10 assignment snapshot. Acceptance: reproduce exactly 239 stable IDs from the pinned artifact using the historical executable selection predicate; only then join context and adjudicate. |

### 2026-11-05 — exact historical-239 selection remains blocked

The recovered ZIP artifact `13156351613` has verified SHA-256 `749ac9a2b9db96c1e27828919afe05ef4320e35ca6a91ab2038c1ff3e9d04c69` and contains 2,703 occurrence records for each of ten engine ledgers. The historical exporter (run-head `4f3f307c5bb056bce3b0aedc8ab07e0010eaa695`) assigns only an occurrence-level union over strict plus Broad mismatch fragments. It does not retain per-fragment Broad C01–C10 labels. The pinned export has 1,267 rows, 370 Broad mismatches, 3 rows with union label exactly `UNMAPPED_REQUIRES_REVIEW`, and 12 Broad mismatches with no C01–C10 union label. Neither count reconstructs the historical 239; rows containing both mapped and unmapped edits cannot be distinguished from the stored union. Acceptance remains blocked until the original per-fragment assignment snapshot or exact executable selection predicate yields exactly 239 stable IDs.

### 2026-11-06 — 236-candidate engine integration and evidence gate

| Gate | Status | Evidence / acceptance |
|---|---|---|
| Integrate 15 rule-confirmed standard-variant occurrences | PARTIAL | 14 have runtime coverage (9 new occurrence-level licenses across 7 exact eojeol families; 5 preserved baseline cases). Occurrence 2490 `머리속에` remains BLOCKED because spelling/semantic normalization is outside phonological conversion. |
| Keep 181 profile-convention mismatches out of categorical rules | DONE_VERIFIED | No runtime rule added; broad/narrow profile differences remain separately classified. |
| Preserve 12 ABSTAIN and 28 UNADJUDICATED cases without invented IPA | DONE_VERIFIED | Candidate ledger remains unchanged except evidence-basis enrichment for phrase-level Rule 29 cases; no production rules added for these 40. |
| Rule 29 phrase-level cases `한국여자로` / `홍콩영화들` | BLOCKED | NIKL Q&A 330322 confirms the conditional two-word connected-phrase scope, but no audio or prosodic boundary establishes that condition. Acceptance requires token-level audio or independent IPA adjudication. |
| Preserve dictionary length in IPA for `유사성[유ː사썽]` | DONE_VERIFIED | Exact NIKL dictionary-backed long ㅠ is emitted as `juː`; the dedicated seven-form browser/Python parity test checks identical IPA and the adapter retains length as a feature without adding a Ukrainian length grapheme. No token-specific acoustic IPA gold is claimed. |
| Browser/Python parity for the exact 236 integrations | DONE_VERIFIED | tests/test_kozak_236_engine_integration.py::test_browser_python_surface_and_ipa_parity_for_236_exact_forms compares surface Hangul and broad IPA for all seven exact forms; exact code-head Tests run [42180312303](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312303) passed. This verifies implementation parity, not independent pronunciation accuracy. |

The 236 cohort is not 236 independent phonological rules: 181 are profile-convention differences, and the remaining 40 are evidence-limited. No automatic generalization is authorized from these counts.


**Exact code-head verification snapshot — 8a5e6b83f7b6b1377200be3c4bdb330dc4d16de0:** System Verify [42180312202](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312202) PASS (Python regression/data integrity; Browser regression/build 1,398/1,398); Tests [42180312303](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312303) PASS (web, Python 3.11/3.12/3.13, wheel-install, teacher-corpus audit); Browser G2P [42180312258](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312258), master artifacts [42180312182](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312182), exhaustive register [42180312181](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312181), external UGTPHON [42180312221](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312221), paired native/g2pk [42180312228](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312228), morphology consensus [42180312341](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312341), and morphology adapter smoke [42180312291](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312291) PASS. Official NIKL metadata inventory and Charsiu train-dev queue were SKIPPED; neural Charsiu/ByT5 inference was SKIPPED by workflow policy. Multi-engine diagnostic [42180312294](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/42180312294) was IN_PROGRESS at this snapshot. Paired native/g2pk: native 2,698 scored, exact 0.530764, CER 0.089530, 5 unresolved; g2pk 2,703 scored, exact 0.530892, CER 0.092328, 0 unresolved; diagnostic only, differing coverage. Morphology-consensus ablation: 2,698 paired; exact-rate delta 0, CER worsened by 0.000173, two higher edit distances; no analyzer-consensus behavior was promoted to production.

### 2026-11-06 — exact engine integration and derived queue refresh

| Gate | Status | Evidence / acceptance |
|---|---|---|
| Integrate source-confirmed 236-cohort standard variants | PARTIAL | 14/15 occurrences have runtime coverage: nine newly integrated exact licenses and five preserved baseline licenses. `머리속에` remains blocked pending a separate spelling/semantic-normalization contract. |
| Keep profile-convention differences and evidence-limited cases out of production rules | DONE_VERIFIED | 181 profile-convention rows and 40 abstained/unadjudicated rows have no new production rules; no IPA is fabricated. |
| Refresh the derived unmapped-Broad queue after runtime changes | PARTIAL / exact-head CI pending | Tracked queue is 26 rows; six newly covered occurrence IDs were removed and row 341 was updated for the principal `/ɰi/` output. Row-by-row hashes match the generated artifact. Exact-head workflow 42185403748 is still running the export/cmp and downstream benchmark steps. |
| Browser/Python parity for seven exact integrated forms | DONE_VERIFIED | Dedicated exact-form parity test passed in exact-head Tests run 42185403733; this is software parity, not independent pronunciation validation. |
| Independent speaker-level IPA / Ukrainian target validation | BLOCKED | Requires qualified Korean reviewers/audio and independent Ukrainian-reader review; corpus comparators are not gold. |


## 2026-11-06 — 236-cohort residual evidence review

The 12 abstentions and 28 unadjudicated rows have received a focused evidence pass. The 28 now have row-level reviewed evidence in `kozak-kim-236-residual-review-2026-11-06.csv`, and the 236-case generator projects this evidence into the occurrence ledger. This does not close the pronunciation gate: no source audio/speaker crosswalk or independent Korean IPA gold is available. Keep all 40 out of production rules and Ukrainian-target gold until two qualified reviewers independently annotate and reconcile the tokens. Lee (2023), DOI 10.17959/sppm.2023.29.2.193, additionally shows that Seoul /ɛ/–/e/ merger is incomplete and position-sensitive; retain the existing research-only optional variant without selecting a speaker-specific long vowel.


Additional regression scope: the native Python and browser shared-Broad profiles must keep /s/ canonical and omit [ɕ] variants for `쇼`, `모션어디서`, `뿌셔우우`, `뿌셔우우우`, `아끼셔` and `포지션을`. For `대한민국`, the research-only [ɛ]~[e] candidate must preserve the existing length mark and cite Lee (2023); it does not select a speaker-specific realization. The browser legacy profile remains a separate compatibility contract.
