# 2026-11-02 task ledger — Kozak Kim cross-runtime continuation

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

---

## 2026-11-02 continuation ledger — PR #420

**Starting point:** PR #419 head `88cae4bdeefce66ee8026bb1380f17271c85630d` (itself stacked on the existing #417 chain).  
**Working branch:** `research/kozak-kim-runtime-parity-broad-v2-2026-11-02`  
**PR:** [#420](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/420), draft, based on #419.  
**Scope:** Kozak Kim only. Original g2pK is preserved as a comparator baseline; no g2pK/vendor files are changed.

| Priority | Status | Evidence / remaining acceptance |
|---|---|---|
| 1. Native/Browser runtime parity | PARTIAL | Explicit shared profile selected for Browser benchmark; Browser metadata fixed and direct report confirms `clippyfirst-korean-broad-v1`. Browser shared-profile UGTPHON: 2,699 scored, strict exact 53.0196%, CER 9.0720%; Broad exact 86.2912%, CER 2.2078%. Same-occurrence Native/Browser audit and 99.9% gate still pending in multi-engine run 41441868695. |
| 2. Broad IPA benchmark v2 | PARTIAL | Shared versioned sensitivity profile and per-engine feature/serialization loss counts implemented; adapter parity tests PASS. Exact-head ten-engine UGTPHON + SIGMORPHON report still running in 41441868695. Historical Native scores remain below 90% exact / 2% CER; do not treat them as final v2 results. |
| 3. Native error analysis vs g2pK and g2p-ko | PARTIAL | Added occurrence-level pairwise and three-way loss reports. Historical raw-artifact review shows many apparent losses are reference-convention omissions; see the discrepancy report. Re-run after the narrow R013 ending-boundary tightening before final counts. |
| 4. Independent IPA gold | PARTIAL / BLOCKED | Frozen 24-item holdout remains prediction-free. Separate reviewer A/B templates and a reproducible packet builder are ready. Two qualified independent annotations and adjudication remain external blockers. |
| Preserve original g2pK | DONE_VERIFIED | PR #420 changed-file list contains no g2pK or vendor-g2pK paths. Paired Native diagnostic: 2,697 shared; Native 53.0590% exact / 9.0633% CER vs original g2pK 53.0892% / 9.2285%. g2pK retains a tiny exact point edge; Native has lower CER. |
| Avoid unsupported general rule expansion | DONE_VERIFIED | No new general rule was added. This continuation does include one narrow correction to existing, NIKL-backed R013: require the complete attached -ㄹ게 ending (or attested -ㄹ게요) rather than matching an internal ㄹ+게 substring. Positive/negative controls are present; exact-head CI remains pending. |

### Reproducible baseline recomputation (pre-R013-fix raw artifact)

The old multi-engine artifact did not serialize broad metrics, so broad scores below were recomputed from its per-occurrence raw IPA predictions using the repository's versioned `korean-broad-candidate-sensitivity-v1` normalizer. These are historical diagnostic values, not the final v2 artifact and not adjudicated accuracy.

| Engine | UGTPHON broad exact (scored) | UGTPHON broad CER | SIGMORPHON broad exact (scored) | SIGMORPHON broad CER |
|---|---:|---:|---:|---:|
| Kozak Kim Native | 2327/2698 (86.25%; coverage 2698/2703) | 2.22% | 695/998 (69.64%; coverage 998/999) | 6.23% |
| g2pK 0.9.4 | 2317/2703 (85.72%) | 2.37% | 686/999 (68.67%) | 6.46% |
| g2p-ko 1.0.0 | 2293/2703 (84.83%) | 2.54% | 690/999 (69.07%) | 6.31% |
| KoG2Padvanced | 1900/2703 (70.29%) | 4.92% | 597/999 (59.76%) | 8.78% |
| phonemize | 1901/2703 (70.33%) | 7.73% | 582/999 (58.26%) | 9.31% |
| KoG2P 2019 | 1102/2703 (40.77%) | 13.35% | 345/999 (34.53%) | 14.39% |
| kokorog2p | 770/2703 (28.49%) | 20.39% | 204/999 (20.42%) | 23.18% |
| hama | 765/2703 (28.30%) | 18.98% | 275/999 (27.53%) | 19.99% |
| hangul_to_ipa | 696/2703 (25.75%) | 19.61% | 172/999 (17.22%) | 23.48% |
| espeak-ng | 326/2703 (12.06%) | 29.92% | 67/999 (6.71%) | 36.33% |

The Native target of 90%+ broad exact and <=2% broad CER is **not yet met** on either historical set. Coverage-adjusted exact is 86.09% UGTPHON and 69.57% SIGMORPHON for Native. Broad profile status remains research-only/unadjudicated; the profile removes documented distinctions and its feature-loss report must accompany every score.

### Runtime root cause found

On the old paired UGTPHON artifact, 2698 occurrences were scored by both runtimes: 2466 raw IPA outputs matched and 232 differed. Of the 232 differences, 231 were only `s` vs `ɕ`; one was the old `올게이` / R013 boundary false positive. The Python Native profile was `clippyfirst-korean-broad-v1`; Browser was `browser-legacy-contextual-v1`. Therefore the former 93.81% Browser broad score was not comparable with Native 86.25% and must not be presented as a runtime advantage. The benchmark now explicitly selects the shared broad IPA profile and leaves Browser's default behavior unchanged. The new audit must verify the full profile contract and complete surface output before any 99.9% parity claim.

### Error triage found in the same historical artifact

- `출산`: NIKL §26 / existing R012 supports `[출싼]`; the corpus gold omits the fortis distinction. Existing rule/test retained.
- `없는`, `없어`, `알다`: source-backed lexical length is present in Kozak Kim but omitted by the corpus annotation. Existing C09 evidence retained; do not strip length to improve exact match.
- `올게이`: old R013 substring false positive is fixed by the current boundary guard and regression coverage.
- `대한민국`: NIKL Basic Dictionary entry 70041 records `[대ː한민국]` (source S017). Native and both baselines omit length in the old artifact; the IPA vowel-quality choice still requires expert review, so no speculative lexical IPA was added.

### Independent review packet

`research/ipa-holdout-review-packets/reviewer-a.csv` and `reviewer-b.csv` are separate blank templates with no engine outputs or IPA gold. `scripts/build_ipa_holdout_review_packets.py` records manifest and packet SHA-256 hashes and refuses to overwrite existing annotations. The 24 items remain a frozen holdout with tuning prohibited.

### Review follow-ups on the implementation branch

- **R013 scope clarification:** the branch does not add a new general phonological process. It tightens the existing Q&A 330963-backed -ㄹ게 fortition license so it applies only to the complete attached ending or the attested -ㄹ게요 extension. 올게이/할게이 are explicit negative controls. This is a production rule correction in this continuation, not a pre-existing change.
- **Browser profile metadata:** fixed the ordinary convertText() return path so an explicit clippyfirst-korean-broad-v1 selection is reflected in ipa_profile and ipa_profile_level; the multi-part/lexical return path already exposed those fields. The existing browser benchmark test covers an ordinary non-lexical token.
- **Normalizer parity:** added a Python test that invokes the Browser JavaScript normalizer against the same edge-case inputs and compares normalized IPA, feature-loss counts, and serialization-normalization counts. The test skips only when Node.js is unavailable; the multi-engine CI job installs Node 22.12.0.
- **Code/test head:** 5247ee778741ff0a438e3b304ffd3837fabb2f83. Follow-up code commits: 321672de41853d8562578f6676302ff08005fdd4 (Browser metadata fix), b69737d5da49e3f2845b40a15b42562bdbbe5d31 (Python/Browser normalizer parity test), ff62260010a4a188acea1aaf151f23ff5ccb99eb (preserve sibilant-place contrast in regression), and 5247ee778741ff0a438e3b304ffd3837fabb2f83 (source-register count expectations). Documentation commits follow the code/test head.
- **Exact-head verification:** Browser G2P 41441868581 PASS (npm 1,379/1,379 + build); system 41441868736 PASS (Python regression/data integrity, Browser 1,379/1,379, production build and generated-page checks); paired Native/g2pK 41441868606 PASS; UGTPHON 41441868613 PASS; extraction 41441869064 PASS; morphology consensus 41441868622 PASS; Kiwi and MeCab-Ko smoke 41441868796 PASS. CharsiuG2P, ByT5 and live NIKL metadata inventory SKIPPED. Multi-engine v2 + same-occurrence Native/Browser audit 41441868695 is still in progress; do not mark broad v2 or runtime parity complete until its artifact is inspected. Local git ls-remote failed because the container cannot resolve github.com; local pytest/npm were therefore not run.

### Verification state

- A prior system verification run passed on the assertion-correction head; later exact-head runs are pending and must be read before marking this continuation complete.
- Multi-engine workflow now runs Native and Browser on the same pinned UGTPHON test occurrences, validates occurrence-ledger schema v2, checks profile-contract equality, prints broad metrics and feature losses, and uploads the runtime-parity report.
- The final commit SHA and exact-head CI outcomes are to be filled after the current workflow completes. Do not mark parity or release gates complete based on historical artifacts.
- No local test run is claimed; verification is through repository CI.

# Superpowers execution ledger — latest continuation 2026-11-02

## Latest verified status — discrepancy-ledger audit and evidence-gated revalidation

- **Scope:** Kozak Kim only; original/vendor g2pK remains unchanged and comparison-only.
- **Base:** current `main` is `7bbbd7e7ce888a9c995bb70959e17858263c07a8`; verified PR #417 head is `fb5e1686bd86fd012d63cc92ad0261efe1a38113`, a descendant of main.
- **Current branch/PR:** `research/kozak-kim-abstention-audit-2026-11-02`, Draft PR #419 stacked on #417; documentation plus regression tests only, no production phonology rule changed.
- **PR stack:** #415 → #416 → #417 remains open/Draft. Exploratory PR #418 was closed unmerged because `중심닮음` was not present in the discrepancy ledger or the five-item native-abstention audit; its branch remains preserved for auditability. PRs #411/#414/#371 were inspected and left untouched as out of scope.
- **Exact-head verification on fb5:** system run 41420395798 PASS (Python/data, browser/build/generated pages, 1,374/1,374 browser tests); browser G2P 41420395791 PASS; extraction 41420395790 PASS; native pair 41420395800 PASS; pinned UGTPHON 41420395792 PASS; morphology consensus 41420395813 PASS; adapter smoke 41420395784 PASS; multi-engine 41420395805 PASS. NIKL metadata inventory, CharsiuG2P and ByT5 SKIPPED.
- **Browser pair:** run 41420395792 / artifact 13129915994; 2,699 shared; exact 53.4272% each; CER 8.0794% vs g2pK 8.2138%; delta −0.1344 pp, 95% sentence-cluster CI [−0.2246, −0.0531].
- **Native pair:** run 41420395800 / artifact 13130305158; 2,698 shared; Kozak exact 53.0393% / CER 9.0744%; g2pK on shared subset exact 53.1134% / CER 9.2304%; five native abstentions, zero engine errors. g2pK has a small exact point edge; Kozak has lower CER.
- **Multi-engine:** run 41420395805 / artifact 13129993707. UGTPHON: native 2,698 scored, exact 53.0393%, CER 9.0744%, PER 9.5378%; g2pK 2,703 scored, exact 53.0892%, CER 9.2285%, PER 9.6472%. SIGMORPHON: native 998 scored, exact 35.8717%, CER 14.6100%, PER 16.1721%; g2pK 999 scored, exact 35.3353%, CER 14.8222%, PER 16.3126%. Different denominators; no aggregate paired-delta claim. Both datasets remain diagnostic, not normative IPA gold; g2pK output uses the shared segment renderer.
- **Five real UGTPHON native abstentions:** `칡칡이` (R002 boundary unknown), `쫒아내면` (nonstandard spelling; do not normalize), `많앗구나유유유` (R003 ending boundary unknown), `삶의` (Hangul surface sourced but IPA unadjudicated), `무서웟어` (nonstandard spelling and R002 boundary unknown). No safe global or exact new rule is justified.
- **Abstention regression:** `test_actual_native_abstentions_remain_fail_closed_without_exact_morphology` covers the four morphophonological forms; the existing `삶의` test protects its two official Hangul variants and unresolved IPA gate. Push run 41425704134, PR run 41425711289 and extraction run 41425711296 all PASS on code/test head `4225cea7` (browser 1,374/1,374).
- **삶의 evidence:** NIKL MCFAQ 5716 gives `[살믜]` and permitted `[살메]`; current lexical row already preserves project-derived `sal.mi` and `sal.me` as provisional. NIKL supplies Hangul surface forms, not IPA. Existing test correctly keeps IPA diagnostic-only/unresolved and withholds Ukrainian output pending independent IPA review.
- **Rejected exploration:** `중심닮음` was not a project discrepancy or one of the five abstentions; PR #418 closed without merge. Do not count it as a product improvement.
- **Readiness:** research prototype; not research-certified/release-ready. Blockers: two independent C01–C07 submissions, C08 source extraction/prosody, C09 IPA quality/syllabification, C10 AP/IP contract, item-level NIKL rights, Ukrainian target review, and skipped optional source/neural jobs.
- **Local verification:** no local pytest/npm run; evidence is from GitHub Actions. Do not claim local test success. NIKL metadata inventory remains SKIPPED.

## Canonical task ledger — 2026-11-02

| Task | Status | Evidence / acceptance criterion |
|---|---|---|
| Current default/main ancestry and PR stack | DONE_VERIFIED | Main `7bbbd7e7`; working base `fb5e1686` descends from main; PR #419 is stacked on #417. No merge/release performed. |
| Original g2pK baseline preservation | DONE_VERIFIED | No original/vendor g2pK files changed in this continuation; g2pK remains comparison-only. |
| Exact-head software verification | DONE_VERIFIED | Code/test head `4225cea7`: push system 41425704134 and PR system 41425711289 PASS; browser 1,374/1,374; extraction 41425711296 PASS. Subsequent commits on this branch are documentation-only and preserve that verified test state. |
| Paired/multi-engine evidence refresh | DONE_VERIFIED | Runs 41420395792, 41420395800 and 41420395805 plus artifacts 13129915994, 13130305158 and 13129993707 inspected; diagnostic limitations recorded. |
| Native abstention regression protection | DONE_VERIFIED | New test pins four R002/R003 abstentions; existing `삶의` test pins both NIKL Hangul variants and independent-IPA abstention. |
| C01–C07 review packet preparation | DONE_VERIFIED | Seven blind/reference-withheld packets, 42 entries / 39 source rows; acceptance still requires two independent reviewer submissions. |
| C01–C07 independent IPA adjudication | BLOCKED | No independent reviewer submissions; criterion is two qualified independent transcriptions and reconciled disagreements. |
| C08 source extraction / lexical / prosody | PARTIAL | Eight contexts mapped; five memberships reconstructed because original extraction table is missing; `유사성` unresolved. Criterion: original extraction provenance plus token-level IPA/prosody review. |
| C09 lexical length | PARTIAL | Seven source-backed forms; length retained. Criterion: independent IPA vowel-quality and syllable-boundary review, including contemporary length realization. |
| C10 AP/IP prosody contract | TODO | Define whether phrase-level prosody is in product scope; if yes, specify AP/IP representation and obtain specialist review. |
| Four morphophonological native abstentions | BLOCKED | `칡칡이`, `쫒아내면`, `많앗구나유유유`, `무서웟어`; require exact lexical/morpheme/audio evidence before rule licensing. |
| `삶의` IPA | PARTIAL | NIKL MCFAQ 5716 confirms [살믜]/[살메]; project IPA variants remain provisional. Criterion: independent IPA adjudication; until then no Ukrainian output. |
| Source and item-level rights | PARTIAL | 168-row register; 158 review-required, 7 manual classifications, 2 item-level licenses, 1 not applicable. Criterion: complete item-level rights review and attribution. The new NIKL dictionary entry is citation-only; rights are not cleared. |
| Ukrainian target adaptation | BLOCKED | No independent Ukrainian target review; criterion: documented target-policy review and accepted gold examples. |
| Optional CharsiuG2P / ByT5 / live NIKL inventory | BLOCKED / NOT RUN | Workflows SKIPPED; not counted as successful. Criterion: licensed weights/data and available source inventory service. |
| Research certification / release | BLOCKED | Research prototype only; requires all specialist, rights, target and product gates above. |

## Current next actions

1. Obtain two independent blind IPA submissions for C01–C07.
2. Recover the original C08 extraction table or preserve five mappings as inferred; obtain token-level IPA/prosody review; keep `유사성` unresolved.
3. Obtain independent IPA adjudication for `삶의` variants and the other source-backed lexical forms; do not treat NIKL Hangul readings as IPA.
4. Obtain source/context evidence for `칡칡이`, `쫒아내면`, `많앗구나유유유`, and `무서웟어`; preserve abstention until then.
5. Finish C09/C10, NIKL item-level rights, and Ukrainian target review; rerun exact-head CI and paired benchmarks after any future production change.

## Historical snapshots

## Kozak Kim continuation — 2026-11-01

- Reconcile main and PR #415/#416: DONE_VERIFIED (inspection); dedicated branch created from main and fast-forwarded to PR #416 descendant.
- C01–C07 blind packets: PARTIAL; seven separate pilot packet manifests created. Blocked for external scoring by missing utterance context and reviewer-sharing rights; no IPA predictions or references disclosed.
- C08 source triage: PARTIAL / EVIDENCE-LIMITED; Q&A 312649 confirms 의외성 only; §27 requires exact -(으)ㄹ morphology; no exact parse/source for 했을시 or 무고일수도있다는. No production changes.
- g2pK baseline: DONE_VERIFIED as scope check; original/vendor implementation untouched.
- CI evidence: PR #416 runs 41344976774, 41344981229, 41344981425, 41344981248, 41344981271, 41344981311, 41344981284, 41344981338 inspected; 41344981358 was still running. Current main run 41334227038 fails Python collection because benchmark helper is absent on main; see master handoff.

- C08 follow-up (2026-11-01): official NIKL Q&A 327466 supports the morphology of `일 수도`; NIKL 2021 guideline p.106 confirms dependent-noun `시` after `-을`. Both are rule-environment evidence, not direct lexical pronunciation records for the corpus strings. `유사성` remains unconfirmed; no `-성` generalization and no production patch. Added two source-register entries; item-level rights/context remain pending.

- C08 occurrence mapping gap: mass-cluster register claims 8 occurrences, but the 27-row paired occurrence ledger contains no C08 entries. Three source rows recovered from artifact 13097847614 (multilexnorm2026_1953, multilexnorm2026_1979, dc_inside_2024); five more remain unidentified. Corrected stale "remaining cases in paired ledger" text; acceptance requires recovery of all eight source-row IDs and contexts.


## Kozak Kim discrepancy review continuation — 2026-11-01

- Continuation branch: `research/kozak-kim-independent-ipa-packets-2026-11-01`; final branch head: `17647b219aa4310e37d77a8dd457c73c0871ace0`.
- Stacked Draft PR #417 targets the PR #416 branch, is mergeable, and contains only the incremental review-packet, evidence-register, test, and handoff changes. PR #416 and PR #415 remain open; neither was merged or modified.
- C01–C07: seven separate source-blind pilot JSON packets (six pilot forms each), separate reviewer instructions, and an internal-only cluster/provenance index. Browser regression test verifies no system/baseline names, candidate/reference IPA, or internal artifact identifiers leak into packet JSON. Packets remain PARTIAL/BLOCKED for scoring until exact source utterances and item-level reviewer-sharing rights are restored and verified.
- C08: NIKL Q&A 327466 supports the morphology of `일 수도`; NIKL 2021 guideline p.106 confirms dependent noun `시` after `-을`; Standard Pronunciation Rule §27 supplies conditional fortition. These are conditional morphology/rule-environment leads, not exact pronunciation attestations. No production phonology change; no generalized `-성` rule.
- C08 traceability correction: cluster summary reports eight cases, but the 27-row occurrence ledger contains no C08 entries. Three source-row IDs recovered (`multilexnorm2026_1953`, `multilexnorm2026_1979`, `dc_inside_2024`); five remain unidentified. Stale “remaining cases in paired ledger” wording was corrected.
- Exact-head GitHub Actions run `41346666445`: browser regression/build PASS; Python regression/data integrity PASS; 1,369 browser tests, 0 failures; NIKL metadata-only inventory SKIPPED. Extractor run `41346594433`: PASS. Multi-engine comparison run `41344981358` completed PASS; artifact `13099523369` inspected. ByT5 and Charsiu jobs were SKIPPED.
- Current main workflow `41334227038` has a Python collection failure because `scripts.benchmark_ugtphon_ko_surface` is absent from main; the inherited PR #416 branch contains it and passes Python regression/data integrity.
- No local shell/npm/pytest/build commands were executed; all test evidence is from GitHub Actions. No original g2pK implementation file was changed.

**Disposition:** research prototype. Independent linguistic adjudication, source context, item-level rights, five missing C08 occurrence IDs, and Ukrainian target review remain open. Not release-ready.


## Supplementary paired benchmark — SIGMORPHON 2021 Korean lexical test (run 41344981358)

The completed multi-engine diagnostic artifact `13099523369` was downloaded and inspected. It pins g2pK 0.9.4 and compares the native Kozak Kim path with the same 998 paired word-level inputs:

| Metric | Kozak Kim (clippyfirst_native) | Original g2pK 0.9.4 | Paired delta (g2pK − Kozak) |
|---|---:|---:|---:|
| Exact match | 358/998 = 35.8717% | 353/998 = 35.3707% | −0.5010 pp |
| CER | 14.6225% | 14.8106% | +0.1881 pp |

Paired row-cluster bootstrap (1,000 replicates): exact-match delta 95% interval `[-1.0020, -0.1002]` pp; CER delta interval `[+0.0250, +0.3859]` pp. Pairwise audit: 5 native-only exact cases, 0 g2pK-only exact cases, 353 both exact, 640 both non-exact, and 1 native abstention while g2pK returned a non-exact output. This is a **small diagnostic advantage**, not proof of universal superiority.

**Mandatory limitations:** SIGMORPHON is a lexical word-level set, not a sentence-context or normative NIKL set; IPA conventions differ from the reference; g2pK outputs pass through the project's shared segment renderer, which may bias comparison; the benchmark does not score Ukrainian output. The bootstrap intervals are diagnostic uncertainty intervals, not a substitute for independent gold adjudication or a preregistered statistical claim. ByT5 and CharsiuG2P inference jobs were SKIPPED. g2pK source/version remained unchanged.

- C01–C07 packet preparation: DONE_VERIFIED. 39/39 unique source-row IDs matched to official UGTPHON Korean test; every target token present; raw sentence context included, no canonical/IPA/system outputs. UGTPHON ko/LICENSE states Apache-2.0; attribution included. Packets READY_FOR_INDEPENDENT_REVIEW_PILOT; reviewer assignment/submissions remain TODO.


## Analyzer evidence and training-data gate

Kiwi/MeCab-Ko run 41353171166 is diagnostic only: partial boundary agreement for 무고일수도있다는; disagreement for 했을시 and 유사성. The training-readiness artifact 13101748305 records 644 unique lexical rows, no explicitly adjudicated IPA gold, 24 frozen holdout cases without IPA gold, and no overlap. Supervised IPA training remains blocked.


## C08 evidence follow-up — 2026-11-02

- Reconstructed the five previously missing C08 target/context rows from the pinned UGTPHON Korean test split: `해줄것` (`multilexnorm2026_1916`), `많을거같이` (`multilexnorm2026_2011`), `보일거라` (`dc_inside_2186`), `내릴수있는` (`dc_inside_2266`), and `안할듯` (`dc_inside_2557`). Together with the three earlier rows, all eight working contexts are now recorded.
- Three NIKL Q&A sources were added to SOURCE-REGISTER: 317798, 310899, 331601. Their claims are deliberately scoped to rule environment/morphology, not exact UGC IPA.
- The five memberships are inferred from exact token/context matches and the fortis mismatch signature because the original C08 extraction table was not preserved. Keep this traceability caveat explicit.
- Pre/post artifact comparison of 13097847614 and 13102456604 confirms only two Kozak Kim outputs changed: `무고일수도있다는` and `했을시`; all g2pK outputs are unchanged.
- No new production phonology rules were added. Independent IPA/prosody review, `유사성` lexical evidence, item-level NIKL rights, C09/C10 and Ukrainian target review remain open.


**Evidence-source correction (2026-11-02):** the earlier provisional references to NIKL Q&A 335204 and 336313 were removed from the active source register because their direct pages could not be independently retrieved in this verification pass. The current active basis is NIKL Q&A 317798 (Rule §27 examples and pause caveat), 310899 (colloquial dependent noun 거), 331601 (알 수 없는[알쑤엄는]), plus the already registered 307960/327466/313481/333044 and the official Rule §27 page. Older historical mentions of 335204/336313 are superseded and are not current evidence claims.

- Native diagnostic [run 41358508325](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41358508325), artifact `13104257589`: 2,698 paired; native CER 9.1047% vs g2pK 9.2304%; exact match 53.0393% vs 53.1134%; five native abstentions and zero engine errors. Separate profile from browser.

## Final continuation record — 2026-11-02

- Engine/data/test head: `d5008af0901628c36b43d627ea52c52a22c265c0`; this ledger refresh is documentation-only.
- Source register 165 rows: 155 REVIEW_REQUIRED, 7 MANUAL_CLASSIFICATION_REQUIRED, 2 item-level licenses recorded, 1 not applicable. The unverified Q&A locator 302689 was removed; the official §14 source is used for 없어[업ː써].
- Production source-code head unchanged: `bc7b1474eecfe8df8006572abf0f07957f829647`; production lexical data now adds source-backed C09 long-vowel entries for 사람, 모르다 and 괴성 (with variants), all with provisional Ukrainian targets. No general phonology rule changed. Original g2pK untouched.
- Exact-head system verification run `41414231979` on `d5008af0901628c36b43d627ea52c52a22c265c0` was QUEUED when recorded; Python/data and browser/build outcomes are not yet verified. NIKL metadata-only inventory skipped. Local tests not run due clone DNS failure.
- Stop status: research prototype; all new source claims are scope-limited and tests added, but no release certification.


## Follow-up — 2026-11-02

- C09 now explicitly separates official dictionary vowel-length notation from contemporary Seoul/Gyeonggi surface realization. Added the abstract-reviewed Kim & Park (2019) source record; no word-specific short variants are inferred.
- Corrected stale test expectations for quoted CSV source rows, the 괴성 dictionary result locator, C06 source citation, and source-register count. Exact-head system CI run `41418730591` passed Python/data integrity and browser regression/build; NIKL metadata inventory skipped.
- Source register: 166 rows; 156 REVIEW_REQUIRED, 7 MANUAL_CLASSIFICATION_REQUIRED, 2 item-level licenses, 1 not applicable. Engine remains a research prototype; no production phonology rule or g2pK source changed.


## Follow-up — 2026-11-02 (C05)

- Added Lee (2017) as independent contextual evidence for /y, ø/ diphthongization. C05 remains partial; no global /y/→[ɥi] rule or token IPA was inferred.
- Source register: 167 rows; 157 REVIEW_REQUIRED, 7 MANUAL_CLASSIFICATION_REQUIRED, 2 item-level licenses, 1 not applicable. No production phonology rule changed and g2pK remains untouched.


## Final continuation record — 2026-11-02 (head 84e4200)

- Exact-head push/PR system verification passed Python/data integrity and browser/build; browser 1,374/1,374, zero failures/skips; production build and generated pages passed. NIKL metadata-only inventory skipped.
- Latest browser pair: run 41419733723, artifact 13129795347; exact tied 53.4272%, CER 8.0794% vs g2pK 8.2138%, paired CER CI [−0.2246, −0.0531] pp. Latest native pair: artifact 13129641115; Kozak exact 53.0393%, CER 9.0744%; g2pK exact 53.0892%, CER 9.2285%. Kozak has lower CER; g2pK a small exact point edge. Shared IPA renderer caveat remains.
- Morphology, browser, extraction and paired diagnostics passed. Optional neural inference skipped. Source register 167 rows; 157 REVIEW_REQUIRED, 7 MANUAL_CLASSIFICATION_REQUIRED, 2 item-level licenses, 1 not applicable.
- No production phonology rule changed in this follow-up; original g2pK remains untouched. Research prototype, not release-ready.


## 2026-11-03 exact-head continuation — PR #424 (`dca64251`)

| Task | Status | Evidence / acceptance criterion |
|---|---|---|
| Correct `끌다` Korean surface to `끌다` and retain first-syllable length/plain ㄷ | DONE_VERIFIED | NIKL Basic Dictionary ParaWordNo=62281 `[끌ː다]`, plus official NIKL §7 teaching material; exact-head Native/Browser/CSV tests pass. Project IPA is derived, not supplied by NIKL. |
| `끌다` IPA adjudication and Ukrainian target acceptance | PARTIAL | Independent Korean IPA and Ukrainian target review still required; canonical Ukrainian target withheld. |
| Exact §24 `굶다` application | DONE_VERIFIED | ㄻ stem + `-다` rule environment recorded; `굶기다` retained as negative control; Native/Browser parity tests pass. Rule-derived exact form, not direct lexical citation. |
| g2pK baseline isolation from Kozak-only lexical candidates | DONE_VERIFIED | Adapter guard and Python/Browser regressions pass; vendored/upstream g2pK implementation unchanged. |
| Exact-head verification | DONE_VERIFIED | Run 41628584922: 1,391 Browser tests, Python/data integrity, production build and generated-page checks PASS; g2pK integration 3.11/3.12 PASS. |
| Paired benchmark refresh | DONE_VERIFIED | UGTPHON and SIGMORPHON paired artifacts from 41628584865/41628584832 inspected; diagnostic-only caveats retained. |
| Independent Korean IPA review; NIKL item-level rights; Ukrainian target review | BLOCKED | Need external qualified reviewers, rights determination, and accepted Ukrainian target examples. |
| C12, 239 unmapped mismatches, supervised training | BLOCKED / TODO | Need exact-context primary phonetic evidence, occurrence adjudication, and independently adjudicated IPA gold. |
| Optional CharsiuG2P, ByT5, NIKL metadata inventory | DEFERRED / SKIPPED | No result claimed; run only when service/dependency/license gates are satisfied. |

Benchmark update: UGTPHON raw outputs have different denominators: Kozak n=2,698, 1,431 exact (53.0393%), CER 9.0613%; g2pK n=2,703, 1,435 exact (53.0892%), CER 9.2285%. On paired n=2,698, g2pK scored 1,433 exact (53.1134%), CER 9.2304%, versus Kozak 1,431 exact (53.0393%), CER 9.0613%; paired g2pK−Kozak deltas are +0.0741 pp exact and +0.1691 pp CER. SIGMORPHON paired (n=998), Kozak CER 14.5598% vs g2pK 14.8222%, exact 35.8717% vs 35.3353%; Kozak ahead on both paired metrics. Neither dataset is independent normative IPA gold; g2pK is still passed through the shared IPA renderer. See master handoff for confidence intervals, abstention and parity details. SIGMORPHON paired (n=998), Kozak CER 14.5598% vs g2pK 14.8222%, exact 35.8717% vs 35.3353%; Kozak ahead on both paired metrics. Neither dataset is independent normative IPA gold; g2pK is still passed through the shared IPA renderer. See master handoff for confidence intervals, abstention and parity details.


## 2026-11-03 — baseline-isolation TDD follow-up (PR #424)

| Task | Status | Evidence / acceptance |
|---|---|---|
| Exclude all Kozak research-only input kinds from Python g2pK adapter surface overrides | DONE_VERIFIED | Shared set covers `kozak-research-only` and `variant-aware-research`; test reproduces `못잃어 → 몬니러` defect before fix and passes after commit `2e6e739`. |
| Exclude research-only IPA lexical overrides from g2pK adapter | DONE_VERIFIED | Same shared predicate gates `_surface_ipa`; no provisional `mon.ni.ɾʌ` overlay on `못잃어`. |
| Preserve original g2pK 0.9.4 baseline | DONE_VERIFIED | No vendor/upstream source changes; benchmark script calls raw `G2p()` directly, not the research-aware application adapter. |
| Exact-head system verification after adapter fix | DONE_VERIFIED | Runs 41637788167 and 41637795909 PASS; Browser 1,391/1,391, Python/data integrity, production build and generated-page checks PASS. |
| g2pK integration / morphology / corpus checks | DONE_VERIFIED | Runs 41637795791, 41637795740, 41637795766, 41637795818, 41637795832, 41637795861 PASS. |
| New multi-engine rerun | PARTIAL / IN PROGRESS | Run 41637795800 not complete at handoff; prior raw-path artifact 13226589858 remains valid because the code fix only affects the separate Python application adapter. |
| Independent Korean IPA review, NIKL item-level rights, Ukrainian target review, C12 evidence, 239 mismatch occurrences, adjudicated IPA gold | BLOCKED / TODO | External review, rights evidence, exact acoustic/articulatory source, context adjudication and independent holdout labels remain absent. |

TDD evidence: test-only commit `5131e807` failed with the intended assertion `'몬니러' == '못잃어'`; minimal implementation commit `2e6e739` passes. No new dependency, phonological generalization, or parallel adapter was introduced.


## 2026-11-03 exact-eojeol sentence-context follow-up — PR #426

| Task | Status | Evidence / acceptance |
|---|---|---|
| Apply existing exact NIKL compound/Sino-Korean licenses inside complete eojeols in sentence context | DONE_VERIFIED | Python Native regressions and Browser integration tests pass on exact head `92519699`; positive forms `물가로`, `팔자걸음`, `정신병자네` and negative control `결과로` are asserted with rule trace provenance. |
| Keep licenses scoped to the exact eojeol rather than arbitrary sentence substrings | DONE_VERIFIED | Existing R002/R003/R007/R009–R016 exact-form matching was revised and covered by positive/negative regression assertions; no broad productive generalization added. |
| Source-catalog CSV integrity | DONE_VERIFIED | Added Python schema/unique-ID validation; repaired S001 locator containing commas by quoting the CSV field. |
| Browser regression and generated pages | DONE_VERIFIED | Run 41723435274, Browser regression/build job: 1,394/1,394 tests PASS; public-page build and generated-page verification PASS. |
| Python regression and data integrity | DONE_VERIFIED | Run 41723435274, Python regression/data-integrity job PASS, including source-catalog shape test. |
| Paired Native vs original g2pK diagnostic | DONE_VERIFIED | Run 41723446261 PASS. |
| External UGTPHON diagnostic; morphology consensus; research morphology smoke; test-case extraction | DONE_VERIFIED | Runs 41723446132, 41723446066, 41723445936, 41723446543 PASS. |
| Full multi-engine diagnostic and fresh blind-packet/mismatch artifacts | PARTIAL / IN PROGRESS | Run 41723446626: dependency/license checks, pinned UGTPHON and SIGMORPHON holdout fetch/validation, benchmark adapter tests, training-readiness/frozen-holdout audit, and independent reviewer-packet generation PASS; final multi-engine comparison still running at this checkpoint. |
| g2pK 0.9.4 original engine and vendored upstream source | DONE_VERIFIED | Vendor and adapter source unchanged by this follow-up; baseline isolation remains intact. |
| Independent Korean IPA gold, item-level NIKL rights, Ukrainian target review | BLOCKED | Requires qualified independent adjudication, rights determination and accepted target review; no synthetic gold substituted. |
| Remaining unmapped mismatches / C12 and supervised training | BLOCKED / TODO | Requires exact-context primary evidence, occurrence adjudication and independently adjudicated IPA gold. |
| Hanja/RR research modes and regional/style variation | DEFERRED | Not changed in this Kozak-only phonology follow-up; keep explicitly separate from core transcription claims. |

Verification note: an earlier intermediate head reported 1,395 Browser tests; the final documented head `92519699` has 1,394 tests because the redundant sentence-context Browser duplicate was removed after equivalent Native coverage and a dedicated Browser test path were already present. The final CI count, not the intermediate count, is authoritative. No merge or release.
