# 2026-11-02 discrepancy-driven update — Kozak Kim

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

## Discrepancy decisions
- Metadata mismatch was a schema serialization bug, not a phonological discrepancy; corrected the duplicate Browser version assignment.
- `삶의` was a provenance/status mismatch: source-backed Hangul variants were retained, while project-derived IPA and Ukrainian output are withheld pending independent IPA review.
- `올게이` / `할게이` were false abstentions caused by an internal `ㄹ+게` substring being treated as a complete ending. The abstention guard now uses the same exact ending boundary as R013.
- Browser Broad surface serialization now applies the representative final coda under the shared research profile only. The ordinary Browser legacy profile remains unchanged.
- No new general phonological rule was added; no IPA gold was fabricated; no g2pK source/vendor code was modified.

---

## 2026-11-02 — Runtime-profile and three-way error triage

### Runtime parity

The earlier Native/Browser broad-score gap (86.25% vs 93.81%) was caused primarily by comparing different IPA contracts. On the old paired UGTPHON artifact, 231 of 232 raw IPA differences were `s` vs `ɕ`; the other case was an R013 boundary false positive on `올게이`. The Browser benchmark now explicitly requests `clippyfirst-korean-broad-v1`, the same profile as Python Native. The default Browser legacy contextual profile is unchanged.

The audit script `scripts/audit_kozak_kim_runtime_parity.py` validates stable occurrence IDs, row/token/gold identity, complete surface Hangul, full IPA profile metadata, raw and broad IPA parity, paired gold metrics, and feature losses. Surface output is reconstructed from per-syllable trace where the browser's existing surface field contains only changed syllables. Exact-head CI is still the acceptance evidence; do not claim 99.9% until that report passes.

### Broad benchmark v2

All engines use `data/korean/ipa/broad-candidate-normalization-v1.json`. The normalizer is research-only and records its feature losses; it is not an adjudicated IPA standard. Strict IPA metrics are retained separately. Historical raw-artifact recomputation puts Native Kozak Kim at 86.25% Broad exact / 2.22% CER on UGTPHON and 69.64% / 6.23% on SIGMORPHON. These do not meet the 90%+ / <=2% targets. The exact-head workflow emits the authoritative v2 report.

### What the apparent Native losses mean

Occurrence-level review of the old 3-way Native/g2pK/g2p-ko set found nine broad cases where Native had greater edit distance than both baselines:

- `출산`: existing R012 produces [출싼], supported by NIKL §26 and the NIKL teaching material registered as S015. The UGTPHON gold omits fortisness; do not remove the rule.
- `없는` (four occurrences), `없어`, `알다`: the Native long vowels are supported by C09 lexical evidence, while the UGTPHON annotation omits length. Preserve length.
- `대한민국`: NIKL Basic Dictionary entry 70041 records [대ː한민국] (new source S017). The old Native and both baselines omit length; the IPA vowel-quality realization still needs independent review. No IPA form was fabricated.
- `올게이`: old R013 false positive, fixed by the existing exact-boundary guard in this branch.

Four strict cases where both baselines were exact and Native was not were all `없는`, i.e. the same lexical-length reference issue. The current exact-head report must be checked after the R013 fix; historical counts are not final.

### Independent IPA gold

Two separate reviewer templates now exist at `research/ipa-holdout-review-packets/reviewer-a.csv` and `reviewer-b.csv`. They contain only the 24 frozen Hangul inputs, NIKL source locators and official Hangul surface readings; no engine outputs and no IPA gold. The packet builder records hashes and refuses to overwrite prior annotations. Gold remains BLOCKED until two qualified independent reviewers submit and an adjudicator resolves differences. No audio is supplied, so this packet cannot support narrow speaker-specific acoustic transcription.

# Kozak Kim: discrepancy-driven phonology improvement — 2026-11-01

## Latest discrepancy audit — five native abstentions, no safe rule expansion — 2026-11-02

The exact-head multi-engine artifact `13129993707` reports five UGTPHON native abstentions. They are not a homogeneous rule opportunity and must not be collapsed into a general phonology patch.

| Token | Guard | Evidence state | Decision |
|---|---|---|---|
| `칡칡이` | R002 liaison/neutralization | Exact morpheme boundary not established; external engine outputs are not gold. | Keep unresolved pending lexical/morphological or audio evidence. |
| `쫒아내면` | R002 | Nonstandard `쫒-` spelling; silently correcting to `쫓-` would conflate orthographic correction with pronunciation. | Keep unresolved; do not normalize. |
| `많앗구나유유유` | R003 ㅎ-coda deletion | Noisy/nonstandard form; exact ending boundary is not established. | Keep unresolved; no typo-wide or suffix-wide rule. |
| `삶의` | IPA adjudication | NIKL MCFAQ 5716 directly attests Hangul readings `[살믜]` and `[살메]`; it does not provide IPA. The existing lexicon already carries project-derived `sal.mi` and `sal.me` candidates as provisional. | Preserve both variants and unresolved/diagnostic-only status until independent IPA review; withhold Ukrainian output. |
| `무서웟어` | R002 liaison/neutralization | Nonstandard spelling and exact morpheme boundary are not established. | Keep unresolved; do not normalize to a standard spelling. |

For `삶의`, the primary source is [NIKL MCFAQ 5716](https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5716&mn_id=217&pageIndex=225), which states that particle `의` may be pronounced [ㅢ] or [ㅔ], yielding `삶의[살믜]/[살메]`. The project IPA `sal.mi`/`sal.me` is derived from those Hangul surface forms, not directly transcribed by NIKL. The UGTPHON reference `sʰa̠ɭmi` is not an independent IPA adjudication and must not override the source-backed variants.

**Rejected exploratory candidate:** `중심닮음` was not present in the paired discrepancy ledger or the five-item native-abstention audit. Draft PR #418 was therefore closed without merge; its branch remains preserved. Do not count this as an engine improvement.

**Production decision:** no additional production phonology rule is justified by this audit. The existing abstention behavior is intentional and evidence-gated. The next real dependency is independent IPA adjudication for `삶의` and source/context evidence for the four morphophonological cases.

**Regression guard:** `test_actual_native_abstentions_remain_fail_closed_without_exact_morphology` now asserts unresolved/diagnostic-only status and exact R002/R003 reasons for the four morphophonological tokens. The existing `삶의` test continues to verify [살믜]/[살메] and independent-IPA abstention. Exact-head push/PR system checks and extraction passed on `4225cea7`; browser tests remain 1,374/1,374.


## C01–C07 and C10 independent literature review — 2026-11-02

The source search now has peer-reviewed phonetic evidence for the main profile disagreements. These sources adjudicate the *scope of plausible analyses*, not the exact realization of each UGTPHON sentence; no corpus-token IPA is fabricated.

| Cluster | Evidence-based conclusion | Engine/profile decision |
|---|---|---|
| C01 / C07 liquids | Korean /l/ is commonly described as onset flap [ɾ] and coda/geminate lateral [l]; speaker variation includes retroflex realizations, which may increase near pauses (Crosby & Dalola 2021). | Keep broad /l/ as the default. Do not globally substitute [ɭ] or apply a pre-/h/ rule without exact syllable/prosodic boundaries. |
| C02 /h/ | Korean /h/ has conditioned realizations (e.g. [ç] before /i,j/, [x] before /u/); Seoul/Gwangju data show weakening/deletion variability after sonorants (Kang & Lee 2019). | Keep broad /h/ default. Existing narrow [ɦ] is a partial research variant, not universal. No global deletion or [ɦ] rule. |
| C03 nasal palatalization | Choi & Oh (2014) reports [ɲi] for the specific form 늬 after monophthongization and identifies acoustic cues; this does not prove universal [ɲ] before all front vowels/glides. | Keep broad /n/ default; retain only bounded narrow candidate environments and require token audio/minimal pairs. |
| C04 aspiration notation | [ʰ] versus [h] is a transcription convention/segmentation question in this comparison, not itself a sound-change rule. | Keep separate profiles; do not silently normalize IPA strings. |
| C05 front-rounded vowels/glides | Korean analyses differ on whether /y,ø/ remain phonemic or surface as [wi,we]/[ɥ] sequences; Yun (2005) supports [ɥ] between a tautosyllabic consonant and front vowel, while other analyses retain /y,ø/. | Preserve explicit alternatives and syllable alignment; no blanket /y/→[ɥi] rewrite. |
| C06 unreleased codas | The Cambridge IPA Korean illustration describes syllable-final stops as unreleased [p̚,t̚,k̚]. | Keep release detail in narrow phonetic profile; broad/phonemic profile may omit it. Score separately. |
| C10 lexical stress | Seoul Korean is described as lacking English-style lexical prominence; pitch patterns are associated with Accentual Phrases and Intonational Phrases (Baek 2022). | Do not add primary lexical stress marks to broad Korean IPA. Phrase tones, boundaries, pauses and lengthening belong in a separately specified prosodic layer. |

Source-register additions: `SRC-KCI-KIM-PARK-2019-VOWEL-LENGTH` (contemporary vowel-length merger caveat), `SRC-SNU-LEE-2017-KOREAN-VOWEL-CONTRAST` (C05 front-rounded vowel diphthongization), `SRC-PLSA-KOREAN-LIQUID-2021`, `SRC-CAMBRIDGE-KOREAN-IPA`, `SRC-KCI-KANG-LEE-2019-H`, `SRC-KCI-CHOI-OH-2014-N-PALATALIZATION`, `SRC-KCI-YUN-2005-KOREAN-GLIDES`, and `SRC-SAGE-BAEK-2022-KOREAN-PROSODY`. Their scope/limitations are enforced by source-register tests. All remain research citations; no third-party text or code was copied into production.

**Disposition:** C01–C07 now have a defensible profile-level literature map, but exact occurrence-level independent IPA adjudication remains open. C10 has a source-backed no-lexical-stress decision for the broad Seoul profile, while phrase-level prosody and dialect scope remain open. The narrow profile remains partial/research-only. No production phonology change was justified by these profile-level sources; the current broad IPA remains the default and g2pK remains untouched.

## C05 additional vowel-system corroboration — 2026-11-02

Lee (2017), *Exploring the Contrast Transitions of Korean Vowels: An Information-theoretic View*, independently examines diphthongization of /y, ø/ and merger of /e, ɛ/ using written/spoken corpora. The abstract supports the broader conclusion that the front-rounded vowel system is changing, but it does not supply item-level IPA for the UGTPHON forms or choose a universal /y/, /ø/, [wi], [we] or [ɥi] transcription. C05 therefore remains `PARTIAL_SOURCE_REVIEWED_PROFILE_BOUNDARY`; Kozak Kim preserves its explicit alternate representations and no global mapping was added. Source `SRC-SNU-LEE-2017-KOREAN-VOWEL-CONTRAST` is registered with its CC BY-NC 4.0 status and abstract-only limitation.

## C09 lexical vowel-length evidence review — 2026-11-02

The seven lexical forms named in C09 now have official National Institute of Korean Language evidence for the relevant long-vowel surface in the cited dictionary/answer context:

| Form | Official attestation | Scope |
|---|---|---|
| 사람 | Korean Basic Dictionary: [사ː람] | Direct lemma entry |
| 괴성 | Korean Basic Dictionary result listing: [괴ː성/궤ː성] | Two listed variants; preserve both rather than choosing one |
| 모르다 | Korean Basic Dictionary: [모ː르다], with [모ː르는] and [몰ː라] | Direct lemma and listed applications |
| 알다 | Korean Basic Dictionary: [알ː다], with [아ː는] and [아ː니] | Direct lemma and listed applications |
| 없는 | NIKL Q&A 331601: [업ː는→엄ː는] | Directly explains the exact phrase 알 수 없는; rule-environment evidence for lexical form 없는 |
| 없어 | Standard Pronunciation Rule §14: [업ː써] | Directly quotes the §14 example and explicitly retains length |
| 이중성 | Korean Basic Dictionary: [이ː중썽] | Exact lexical attestation already present in the dated lexical additions |

The source register now contains the corresponding records (SRC-KRDICT-ENG-58161, SRC-KRDICT-AR-GWESUNG, SRC-KRDICT-ENG-29712, SRC-KRDICT-ENG-89445, SRC-NIKL-QNA-331601, SRC-NIKL-PRON §14, SRC-NIKL-DIC-IJUNGSEONG). Regression tests require those exact attestations and the source-register counts.

**Decision and engine data change:** retain source-backed vowel length in Kozak Kim; do not strip it to match UGTPHON's omissions. The IPA-first lexical additions now cover 사람, 모르다 and 괴성 (with both listed variants); existing entries for 알다, 없는, 없어 and 이중성 remain. The three new entries use project-derived IPA and provisional Ukrainian targets, not source-supplied IPA or accepted target gold. This closes the *lexical length implementation* portion of C09 for the seven listed forms, not the IPA adjudication as a whole.

**Contemporary realization caveat (added 2026-11-02):** the dictionary entries establish the standard lexical length notation, but they do not guarantee that every contemporary Seoul/Gyeonggi speaker realizes a reliably longer vowel in spontaneous speech. Kim & Park (2019; SRC-KCI-KIM-PARK-2019-VOWEL-LENGTH) report substantial weakening of the length contrast in their Seoul/Gyeonggi production/perception study. Only the abstract was reviewed here. Therefore Kozak Kim retains the dictionary-backed long-vowel representation in its standard lexical profile, but this must not be advertised as a universal acoustic fact about modern speakers. No automatic short-vowel variant is added without word-specific audio or stronger evidence. Dictionary Hangul length marks are not IPA, and do not by themselves adjudicate exact vowel quality, syllable boundaries, prosodic stress, or Ukrainian target adaptation. The 괴성 listing is a dictionary result page rather than a stable item-specific locator and explicitly retains two vowel variants; it is recorded with that limitation. C10 stress remains unresolved. No general phonological rule change was justified by this source review; the improvement is confined to exact, source-backed lexical entries with provisional IPA/target status.

## C08 occurrence mapping and exact morphology follow-up — 2026-11-02

The five previously unenumerated C08 contexts have now been reconstructed from the pinned UGTPHON Korean test split (revision `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`) by matching the fortis-versus-plain mismatch signature and exact target token. The eight working IDs are:

| Source row | Target | Conditional morphology / evidence | Status |
|---|---|---|---|
| `multilexnorm2026_1953` | `무고일수도있다는` | `X일 + -(으)ㄹ + 수`; NIKL Q&A 327466 + 307960 | Exact §27 context rule now present; output changed plain `s` → fortis `s͈` |
| `multilexnorm2026_1979` | `했을시` | `했- + -(으)ㄹ + 시`; NIKL Q&A 313481 + 333044 | Exact §27 context rule now present; output changed plain `ɕ` → fortis `ɕ͈`; analyzer disagreement remains |
| `dc_inside_2024` | `유사성` | Exact lexical/suffix analysis unresolved; Q&A 312649 confirms `의외성` only | Keep unresolved; no `-성` generalization |
| `multilexnorm2026_1916` | `해줄것` | Likely `해 줄 것`; Q&A 317798 gives `할 것을[할꺼슬]` and the §27 cohesion condition | Conditional rule-environment support; no exact-token IPA |
| `multilexnorm2026_2011` | `많을거같이` | Likely `많을 거 같이`; Q&A 310899 confirms colloquial dependent noun `거`, Q&A 317798 supports the conditional §27 environment | Conditional morphology; exact token and prosody not attested |
| `dc_inside_2186` | `보일거라` | Likely `보일 거라`; Q&A 310899 + 317798 | Conditional morphology; exact token and prosody not attested |
| `dc_inside_2266` | `내릴수있는` | Likely `내릴 수 있는`; Q&A 331601 gives `알 수 없는[알쑤엄는]`, Q&A 307960 supports the same environment | Direct rule-environment precedent; not exact-token IPA |
| `dc_inside_2557` | `안할듯` | Likely `안 할 듯`; Q&A 317798 gives `할 듯[할뜯]` and notes a pause can permit a plain onset | Direct analogous example; exact UGC prosody unresolved |

The two output changes above were independently verified by comparing pre-context artifact `13097847614` with current artifact `13102456604`: exactly those two Kozak Kim token outputs changed among the shared occurrences; all g2pK outputs remained unchanged.

**Traceability caveat:** the original one-off C08 extraction table containing the eight source-row IDs was not preserved. The five new memberships are high-confidence reconstructions from the pinned benchmark mismatch signature plus exact target-token/source-sentence matching, not copied from that missing extraction artifact. They are recorded as reconstructed rather than primary-source mappings.

Three additional NIKL Q&A sources are active in the register: 317798 (Rule §27 examples and the pause/cohesion caveat), 310899 (colloquial dependent noun `거`), and 331601 (`알 수 없는[알쑤엄는]`). Provisional Q&A references 335204 and 336313 were removed from the active register because their direct pages could not be independently retrieved; they are not current evidence. The active sources support conditional morphology/rule environments, not independent IPA gold for the UGC tokens. No production rule was added in this context-recovery follow-up. All eight contexts are in the fixture; `유사성` remains unresolved; independent IPA/prosody review and item-level rights remain open.



## Latest paired and multi-engine evidence — 2026-11-02

- **Browser pair:** run [41409348959](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41409348959), artifact `13124269774`; 2,699 shared occurrences; exact match 53.4272% for both; Kozak Kim CER 8.1097% vs original g2pK 8.2138%; paired delta −0.1040 pp, 95% sentence-cluster CI [−0.1951, −0.0261] pp.
- **Native pair:** run [41409348973](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41409348973), artifact `13124712631`; 2,698 shared occurrences; exact 53.0393% vs 53.1134% (g2pK slightly higher); CER 9.1047% vs 9.2304% (Kozak Kim lower); five native abstentions, zero engine errors.
- **Completed 10-engine diagnostic:** run [41358812573](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41358812573), artifact `13105045922`; a same-code rerun on test/documentation head `bf08b7f` (run 41407778528) was still in progress at last inspection. On 2,698 shared UGTPHON occurrences, g2pK-minus-Kozak exact delta is +0.0741 pp with paired row-cluster 95% CI [−0.0824, +0.2840] pp; g2pK-minus-Kozak CER delta is +0.1257 pp with CI [+0.0428, +0.2194] pp. On 998 shared SIGMORPHON lexical words, Kozak Kim leads exact match 35.8717% vs 35.3707% and CER 14.6225% vs 14.8106%; the paired bootstrap intervals favor Kozak Kim on both metrics. The report's SIGMORPHON limitations (lexical rather than sentence-context evaluation; IPA-convention differences) remain applicable.
- These are corpus/profile-specific diagnostics. The g2pK surface is converted through the project's shared segment-to-IPA renderer; its original implementation is not changed. None of these benchmarks evaluates Ukrainian target orthography or substitutes for independent Korean IPA adjudication.
---

## Latest continuation update — 2026-11-01: C01–C07 blind packets, C08 contexts, and Python sentence parity

This section supersedes the earlier C08/context-readiness notes below. Older entries are retained as historical snapshots.

### C01–C07 independent-review packages

- Seven separate packets: research/ipa-review-packets/blind-ipa-C01.json through blind-ipa-C07.json; six pilot forms per packet, 42 entries and 39 unique source-row IDs.
- All 39 IDs and target tokens were matched to the pinned UGTPHON Korean test split. Raw sentence context is included; canonical labels, phoneme annotations, IPA, engine outputs and benchmark results are excluded.
- The packet schema is now neutral (korean-independent-ipa-review-v1). A leak in the former kozak-kim schema identifier was removed from all seven packets. The regression test now rejects kozak-kim, kozak_kim, g2pk, engine labels, IPA/reference fields and internal artifact identifiers.
- UGTPHON's Korean subset is covered by its Apache-2.0 license and attribution. Raw MultiLexNorm++ source files are not redistributed.
- **Disposition:** READY_FOR_INDEPENDENT_REVIEW_PILOT. This means packages are prepared, not that independent review has occurred. Two separate qualified reviewer submissions remain outstanding.

### C08 context and morphology evidence

A pinned fixture at tests/fixtures/kozak-kim-c08-source-contexts.json restores three source contexts:

1. multilexnorm2026_1953, 무고일수도있다는: full sentence confirms the intended X일 수도 construction. NIKL Q&A 327466 supports the dependent-noun morphology; Standard Pronunciation Rule §27 supports a conditional fortition derivation.
2. multilexnorm2026_1979, 했을시: full user-generated sentence is restored. NIKL Q&A 313481 and 333044 confirm dependent noun 시 after -을; §27 supports a conditional derivation. The unspaced, noisy UGC context leaves exact segmentation/prosodic cohesion less certain.
3. dc_inside_2024, 유사성: context is restored, but NIKL Q&A 312649 confirms 의외성 only; 유사성 is mentioned in the question, not confirmed in the official answer. It remains unresolved.

The existing two exact same-eojeol §27 forms are retained; **no new phonological rule family or generalized -성 / ㄹ+ㅅ rule was added in this continuation**. Five of the eight C08 occurrences still lack recovered source-row IDs/context. None of these context/morphology sources is direct IPA gold.

The 2021 NIKL educational PDF remains listed as supplementary research only. Its item-level reuse marking has not been cleared, and it is no longer relied on as production evidence; the C08 morphology claims instead cite official Q&A 313481/333044 and Q&A 327466.

### Cross-runtime correction and measured effect

Python previously matched exact R013 same-word licenses against the entire request string, so a licensed eojeol inside a sentence could be missed. The Python rule-license path now resolves the containing eojeol and matches only the exact licensed word/pair. Browser and Python full-sentence tests cover both positive contexts; negative controls preserve the unresolved 유사성 case.

The latest completed paired browser benchmark (run 41358508374, artifact 13103483761) scores 2,699 shared occurrences: exact match is 53.4272% for both systems; Kozak Kim CER is 8.1097% versus original g2pK 8.2138%, a −0.1040 pp paired delta (95% sentence-cluster bootstrap CI −0.1951 to −0.0261 pp). Exact-match delta remains unproven because its interval crosses zero. Relative to the preceding PR #416 browser artifact, only the two targeted C08 outputs changed; each improved by one edit, neither became exact, and g2pK outputs did not change.

**Current conclusion:** source-context traceability and runtime parity improved; the eight-case C08 cluster is not fully resolved; C01–C07 still require independent human IPA adjudication. Research prototype only.

---

## Scope and invariants

This workstream improves **only the in-repository Kozak Kim engine**. The vendored/original g2pK implementation is a frozen external comparison baseline: do not edit it, port its rules into Kozak Kim, or optimize Kozak Kim merely to imitate its output.

The objective is to improve Korean pronunciation analysis in Kozak Kim and demonstrate, with paired evidence, where its analysis is better, where it is worse, and where neither engine can be judged from the available reference.

Preserve the pipeline:

`Hangul orthography → structural/morphological analysis → Korean surface phonology → inspectable IPA → Ukrainian adaptation`

The IPA is the comparison boundary. Do not patch Ukrainian spellings to conceal an upstream IPA error. Do not collapse IPA contrasts to improve benchmark exact match unless an independently justified comparison profile is explicitly labelled as such.

## Starting point and baseline evidence

- Default branch at start: `main`, `7bbbd7e7ce888a9c995bb70959e17858263c07a8`.
- Working branch: `research/kozak-kim-discrepancy-driven-improvement-2026-11-01`, based on PR #415's verified research/code line `559000fa845b40450cb7173167a2d28016d282f8` (116 commits ahead of main, 0 behind at branch creation).
- Paired browser diagnostic: [Actions run 41331679243](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41331679243), artifact `13093672281`, report `kozak-kim-vs-original-g2pk-browser-report.json`.
- This artifact contains 2,703 eligible occurrences and 2,699 shared scored occurrences. Both engines scored 1,442/2,699 exact (53.4272%). Kozak Kim CER was 8.1358%; g2pK CER 8.2138%. The sentence-cluster bootstrap exact-delta 95% CI was [-0.20697, +0.20056] percentage points; it crosses zero. The CER-delta interval was [-0.16560, 0] percentage points and touches zero. This is evidence of a lower CER point estimate for Kozak Kim on this diagnostic, not a statistically established universal winner.
- On the 2,699 shared occurrences: 1,438 were exact for both; 4 exact only for Kozak Kim; 4 exact only for g2pK; 1,253 were wrong for both. In the original pre-§27/§26 baseline artifact, there were 23 occurrences where the engines emitted different normalized IPA strings. In that historical snapshot, Kozak Kim had the smaller edit distance on 15 and g2pK on 8. This is a useful triage signal, not a linguistic adjudication.
- g2pK remains unchanged and is not a gold oracle. UGTPHON references are diagnostic phonetic annotations, not a fully independent normative IPA gold set.

## First verified discrepancy repair

### §27 — complete `-(으)ㄹ게` ending boundary

The paired report exposed `올게이`: Kozak Kim produced fortis /k͈/ while g2pK retained plain /ɡ/, and the reference was closer to g2pK. The current rule already correctly handles `할게`, `다를게`, and `안타까울게`, but it previously triggered on any internal `ㄹ게` substring.

NIKL Q&A 330963 (2026-05-11) explicitly explains that `할게` consists of `하-` + ending `-ㄹ게` and is pronounced [할께]; Q&A 317780 and 325075 corroborate the ending-based analysis. This is a morphological condition, not a raw character-sequence rule.

**Change made on this branch:** the §27 rule now requires the current eojeol to end in the complete `-ㄹ게` ending, optionally followed by sentence-final `요` (`...ㄹ게` or `...ㄹ게요`). It no longer fires on `...ㄹ게이`. A focused regression test keeps the positive cases `할게`, `할게요`, `다를게`, `안타까울게` and uses `올게이` only as a substring-boundary negative control. The negative control is not being declared a normative lexical pronunciation.

Sources:
- NIKL Q&A 330963 (2026-05-11): confirms the attached ending -ㄹ게 and [할께] under §27: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=330963
- NIKL Q&A 308180 (2024-12-24): confirms 할게요 is -ㄹ게 plus the auxiliary particle 요; it grounds the optional 요 boundary, while Q&A 330963 / §27 ground fortition: https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=308180
- The NIKL educational PDF also explicitly gives 할게요 [할께요] as a §27 example (search-indexed official source).

**Status:** DONE_VERIFIED for the native rule implementation, focused regression, full browser/Python/build checks, and paired before/after diagnostic. The rule's broader productivity is still limited to the attested ending boundary; this does not verify unrelated morphology or IPA conventions.

## Discrepancy inventory from the paired report

The occurrence-level ledger is stored in [`research/KOZAK-KIM-PAIRED-DISCREPANCY-LEDGER-2026-11-01.csv`](../research/KOZAK-KIM-PAIRED-DISCREPANCY-LEDGER-2026-11-01.csv). Its original 23 rows are explicitly tagged `baseline_run_41331679243_pre_§27_and_§26`; two additional rows record the newly created post-§26 output divergences from run 41336800424. The baseline tag refers to the original paired run before both the §27 substring-boundary repair and the §26 出産-family repair; the row for `올게이` separately records its §27 before/after result. The 25 rows therefore span two labelled snapshots and must not be treated as one simultaneous comparison. Each row records source identity, reference, both engine outputs, edit distances, a provisional phenomenon cluster, and adjudication notes.

The original baseline ledger confirms 15 occurrences with lower edit distance for Kozak Kim and 8 for g2pK. This is a historical-snapshot count, not the current exact-head disagreement count, and must not be interpreted as 15 independent lexical wins: repeated forms include `없는`, `없다`, and `사건`, and the bootstrap unit remains the source sentence/utterance row.

Four exact-match discordances are especially informative:
- Kozak Kim only: `닮다`, `못잃어`, `넘게`, `인기`.
- g2pK only: four occurrences of `없는`.

The g2pK-only exact cases all concern the corpus omitting vowel length that is represented in the registered NIKL evidence. They are not sufficient grounds to remove length from Kozak Kim. `못잃어` is also variant-sensitive: the source register records both insertion and non-insertion readings, so the exact match is not by itself a normative ranking.

## Mass mismatch inventory

The direct browser diagnostic artifact from run `41335549779` (`13094469490`) contains 2,699 scored occurrences. Strict profile: 1,442 exact and 1,257 mismatches (53.4272% exact). The unadjudicated broad-candidate sensitivity profile: 2,522 exact and 177 residual mismatches (93.4420% exact; CER 1.2211%). The broad profile is research-only and does not define normative correctness.

A feature-alignment review produced the occurrence-level cluster summary in [`research/KOZAK-KIM-MASS-MISMATCH-CLUSTERS-2026-11-01.csv`](../research/KOZAK-KIM-MASS-MISMATCH-CLUSTERS-2026-11-01.csv). Top recurring clusters (counts are unique occurrences within each cluster, not additive; clusters overlap):

- Strict-only profile differences: dark/lateral [ɭ] versus /l/ (464); conditioned /h/ allophones [ɦ, ç, β, ʝ, ɸ, x, …] versus broad /h/ (261); palatal nasal [ɲ] versus /n/ (77).
- Broad residual differences: aspiration notation [ʰ] versus [h] (37); /y/ versus /ɥi/ (35); unreleased-coda diacritic (34); /l/ versus [ɾ] (12); fortis mark missing in the reference/prediction comparison (11); vowel length (15).
- Stress-mark differences occur in 11 strict-profile occurrences and overlap with length/IPA annotation differences.

These are not 10 confirmed phonological defects. Most are likely IPA-profile or narrow-allophone differences; the /l/~[ɾ] and fortition groups require environment-specific linguistic review. The inventory preserves examples, profile scope, counts, provisional classification, and next actions. Do not sum cluster counts or use them as independent statistical units.

## Second source-backed candidate: §26 fortition in the 출산 family

The broad residual fortition cluster includes `비출산`. In the pre-fix diagnostic, both Kozak Kim and g2pK emitted `pi.tɕʰul.san` (distance 2), while the reference included fortis `/s͈/`. The NIKL Korean Basic Dictionary directly lists `출산[출싼]`, `출산율[출싼뉼]`, `출산하다[출싼하다]`, and `저출산[저ː출싼]`. Standard Pronunciation Rule §26 covers Sino-Korean ㄹ + ㄷ/ㅅ/ㅈ fortition; the dictionary entries are exact lexical evidence, not a license to generalize from every ㄹ+ㅅ string.

**Change implemented:** the exact-form §26 license map includes `출산`, `출산율`, `출산하다`, corpus form `비출산`, and dictionary-attested `저출산`, each with the internal `출>산` boundary. `비출산` is rule-derived from the attested `출산` constituent; it is not presented as a separate direct dictionary quotation. Positive controls cover all five forms; negative controls `비출고` and `저출고` confirm that the rule does not fire from an arbitrary substring.

Source: [NIKL Korean Basic Dictionary search for 출산](https://krdict.korean.go.kr/kor/dicMarinerSearch/search?ParaWordNo=&mainSearchWord=%EC%B6%9C%EC%82%B0) directly returns `출산[출싼]`, `출산율[출싼뉼]`, `출산하다[출싼하다]`, and `저출산[저ː출싼]`. The official [NIKL explanation of Standard Pronunciation Rule §26](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=27&pageIndex=1&qna_seq=318429) gives the exact ㄹ + ㄷ/ㅅ/ㅈ environment and source-listed examples. Its later [Q&A on exceptions and lexical boundaries](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=27&pageIndex=1&qna_seq=327397) cautions that direct Sino-Korean constituent structure matters; therefore the implementation remains exact-form licensed.

**Status:** DONE_VERIFIED for the original four-form set (`출산`, `출산율`, `출산하다`, `비출산`), its positive/negative controls, exact-head CI and paired benchmark. The additional dictionary-attested `저출산` control was added after artifact `13095038704`; its focused/full exact-head CI is pending. It is not counted as a benchmark win. This does not make R012 a productive Sino-Korean analyzer; broader R012 coverage remains partial.

## Prioritized research clusters

### A. Morphology-conditioned fortition and rule boundaries — highest implementation priority

Evidence: 닮다, 넘게, 인기, 사건, 다를게, 안타까울게, 할게, 올게이. Existing rule families include NIKL §§24–28. The first repair narrows the productive-looking §27 rule to the complete ending boundary.

Next work:
1. Audit every §24–§28 rule for a declared morphological trigger, exact boundary, positive cases, and near-minimal negative controls.
2. Ensure exact full-form licenses are not accidentally generalized to substrings, homographs, or compounds.
3. Add tests for `-ㄹ게`, `-ㄹ게요`, and lookalikes where the same grapheme sequence is not the ending.
4. Re-score all paired occurrences and report both exact and edit-distance deltas, including regressions.

### B. Complex-coda / ㄺ-before-ㄱ ordering

Evidence: 읽고. The native engine's `일꼬` surface is closer to the corpus IPA than g2pK's `익꼬`. Preserve the explicit NIKL §11 verbal-stem exception and its lexical/morphological guard. Add contrasts for nouns (e.g. 닭이) and non-licensed ㄺ forms so the verb exception cannot leak into all complex-coda contexts.

### C. Long vowels and reference convention

Evidence: 없는 ×4, 없다 ×2, 없어, 알다, 많이, 사건, 한자. Several g2pK-only exact occurrences are caused by the reference omitting length where the NIKL-backed lexical entry preserves it. This is not automatically a Kozak Kim error. Separate:
- normative/lexical length evidence;
- corpus annotation omissions;
- cross-runtime IPA profile differences;
- true engine length insertion/deletion errors.

Do not remove long vowels globally, do not use the benchmark's closest variant as an authority, and do not alter the strict score normalizer to hide length.

### D. Variable morphology and phrase-level readings

Evidence: 못잃어. The registered NIKL usage-survey source reports both insertion and non-insertion readings. Keep both variants visible; do not turn one selected corpus annotation into a categorical rule or claim that the primary candidate is normatively dominant without the source percentages for this exact expression.

### E. IPA convention and segmental annotation

Use the mass mismatch inventory and its profile scope. The 464 dark-l, 261 /h/-allophone, and 77 palatal-nasal occurrences are primarily strict IPA-profile candidates; 37 aspiration-notation, 35 /y/~/ɥi/, 34 unreleased-coda, and 12 lateral-flap occurrences remain in the broad residual. Do not rewrite the engine to match a narrow transcription convention without independent review. The 11 residual fortition cases are a separate phonological-rule workstream; `비출산` now has an exact §26 license, while the remaining examples are not yet adjudicated.

### F. Remaining true engine candidates

대한민국 is closer under g2pK by one edit; 알다 and 없어 also appear closer under g2pK because the benchmark reference omits length. Each needs source-level analysis before code changes. No rule is changed merely because one engine has lower edit distance on a single noisy token.

## Required discrepancy-card schema

Every future discrepancy cluster must record:
- stable cluster ID and phenomenon;
- occurrence IDs and lexical types separately;
- exact source Hangul, token context, and word/phrase boundaries;
- Kozak Kim IPA, untouched g2pK IPA, all reference alternatives, and normalized forms;
- rule trace and rule-order path from Kozak Kim;
- whether the difference is surface phonology, IPA convention, lexical variant, morphology, corpus noise, or unknown;
- primary source URL, exact article/Q&A/item scope, and source-register row;
- positive, negative, boundary, and interaction controls;
- proposed implementation location and expected blast radius;
- pre-change baseline, post-change paired results, regression count, coverage/abstention change;
- status: `DONE_VERIFIED`, `PARTIAL`, `TODO`, `BLOCKED`, or `DEFERRED`.

Do not aggregate duplicate tokens as independent lexical evidence. Statistical resampling must cluster by sentence/utterance row, not by token.

## End-to-end improvement loop

1. Freeze a reproducible Kozak Kim/g2pK paired artifact with identical inputs and references.
2. Extract all engine-discordant occurrences, all cases where Kozak Kim is farther from every reference, and high-frequency shared errors.
3. Group by the actual conditioning environment (morpheme, coda, onset, vowel, boundary, phrase context), not by visually similar IPA strings alone.
4. Adjudicate each group against NIKL standard/Q&A, authoritative dictionary entries, and qualified Korean phonology review. Treat g2pK as a comparison system only.
5. Write a formal rule contract: trigger, ordering, exceptions, alternatives, and abstention conditions.
6. Add RED tests first: positive, negative, minimal-pair, boundary, and rule-interaction cases.
7. Implement the smallest change in the native Kozak Kim module. Preserve provenance and the IPA trace. Keep g2pK files untouched.
8. Run the focused test, full Node suite, browser build, Python suite/parity checks where applicable, and the paired benchmark on the same pinned data.
9. Evaluate paired exact classification, CER, PER/feature diagnostics, coverage, abstentions, regressions, cluster-bootstrap intervals, and per-cluster effects.
10. Promote only source-backed, holdout-generalizing rules. Otherwise retain a research candidate or explicit unresolved status.

## Acceptance criteria for a claimed Kozak Kim advantage

A claim must state the exact corpus/version, shared occurrence denominator, reference convention, profile version, coverage, abstentions, exact rate, CER, uncertainty interval, and per-cluster results. A robust claim of overall superiority additionally requires an independently adjudicated held-out set and a paired confidence interval that supports the claimed direction. Until then, use the narrower wording: “Kozak Kim is better on these source-backed discrepancy classes under this diagnostic,” with examples and counterexamples.

## Current task ledger

| Task | Status | Acceptance evidence / next step |
|---|---|---|
| Freeze scope: Kozak Kim only; g2pK immutable | DONE_VERIFIED | Explicit user direction; branch changes only native Kozak Kim and its tests/docs |
| Inspect paired diagnostic and extract output-different cases | DONE_VERIFIED | Artifact 13093672281; 2,699 shared; 23 output-different; 15 KK closer / 8 g2pK closer |
| §27 complete `-ㄹ게` boundary repair | DONE_VERIFIED | Browser test 1114 passed; run 41335549779 confirms `올게이` distance 3→1, no other paired Kozak Kim output changes, and no regressions in 2,699 shared occurrences |
| §26 exact `출산`-family fortition licenses | PARTIAL (split verification) | Original `출산`, `출산율`, `출산하다`, `비출산` set: DONE_VERIFIED by run 41336800458 and paired artifact 13095038704. New `저출산` dictionary-backed control and `저출고` negative control: code/tests authored, exact-head CI pending; not included in paired artifact. Productive R012 morphology remains partial |
| Long-vowel discrepancies | TODO | Source-vs-reference adjudication for 없는/없다/없어/알다/많이/사건/한자 |
| §11 complex-coda contrast expansion | TODO | Positive verbal-stem and negative noun/lookalike controls, source review |
| 못잃어 variant adjudication | PARTIAL | NIKL survey records both variants; no source-backed ranking for this exact item |
| Broad IPA convention clusters | BLOCKED | Independent IPA convention and reviewer adjudication needed |
| Overall Kozak Kim superiority claim | BLOCKED | Exact-match CI still crosses zero; CER advantage is supported on this diagnostic only. Independent held-out, normatively adjudicated gold required |

## Measured result of the §27 boundary repair

The repaired branch was rerun through the existing paired browser benchmark after adding `src/app/engine_rules_ctx.js` and the morphology regression test to the workflow's PR path filter.

- Before repair: run [41331679243](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41331679243), artifact `13093672281`. Shared subset: 2,699. Kozak Kim exact 1,442/2,699 (53.4272%), CER 8.1358%; g2pK exact 1,442/2,699 (53.4272%), CER 8.2138%. Paired CER delta (Kozak minus g2pK) = -0.07802 pp; 95% sentence-cluster bootstrap CI [-0.16560, 0] pp.
- After repair: run [41335549779](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41335549779), artifact `13094763897`. Same shared subset: 2,699. Kozak Kim exact 1,442/2,699 (53.4272%), CER 8.1271%; g2pK exact 1,442/2,699 (53.4272%), CER 8.2138%. Paired CER delta = -0.08669 pp; 95% sentence-cluster bootstrap CI [-0.17414, -0.01235] pp. Exact-match delta remains zero; its 95% CI [-0.20697, +0.20056] pp crosses zero.
- Paired unit: 264 UGTPHON sentence/utterance rows; 2,000 bootstrap resamples; seed 20261101.
- A record-by-record diff of the before/after JSON artifacts found exactly one changed Kozak Kim IPA output among all 2,699 shared scored occurrences: `올게이` changed from `ol.k͈e.i` (edit distance 3) to `ol.ɡe.i` (distance 1). g2pK was `ol.ɡe.i` in both runs. No other Kozak Kim paired output changed; no benchmark regression was observed.
- The CER reduction is exactly the two-edit improvement on this occurrence; exact match does not increase because the reference still differs in other phonetic details. This verifies the targeted repair, not a broad accuracy jump.

Interpretation: on this diagnostic, Kozak Kim's CER advantage over untouched g2pK is now supported by the paired sentence-cluster interval, while exact-match rates remain tied. This is a narrow, source-backed diagnostic result. It does not establish universal superiority, nor does it resolve IPA convention differences or the need for independent normative gold.

## Repository-wide test-candidate pool

The existing exhaustive test-case register extractor also ran on the current branch head. Actions run [41335266701](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41335266701) completed successfully and produced artifact `13095127295`. Its classification queue contains 6,389 candidates: 5,174 assertion candidates and 1,215 test declarations. Dimension hints include 667 IPA, 298 Korean-surface, 373 rule-trace, 916 status/abstention, 558 Ukrainian-target, 226 variant, and 479 boundary/serialization candidates. **All 6,389 require manual review**; 1,701 extracted assertion forms are unsupported, and observed results were not inferred. This is a broad test-discovery pool, not gold data and not proof that all linguistic phenomena have been adjudicated.

Use it to locate existing positive/negative controls and identify gaps, then classify by linguistic environment and source evidence. Do not bulk-promote extracted literals into gold expectations.

## Verification status

Code/test verification head: `5fca54917ceea174d74205198e9929101b2172d4`; paired-benchmark code-bearing head: `8ac8cd18cadb8f074ecdc3cbc7ee3a562144a3dc`. Subsequent commits only update research evidence, acceptance gates, and the handoff; they do not alter the verified engine/test code.

- Actions run [41335266673](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41335266673): **PASS**. Browser regression tests: 1,365/1,365; public-page build: PASS; generated-page verification: PASS; Python regression/data-integrity job: PASS.
- After updating the benchmark workflow path filter, run [41335549717](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41335549717): **PASS**. Browser suite/build and Python regression/data-integrity passed again on code-bearing head `8ac8cd18cadb8f074ecdc3cbc7ee3a562144a3dc`.
- Run [41335549779](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41335549779): **PASS**. Pinned corpus validation, direct browser diagnostic, paired Kozak Kim-vs-original-g2pK diagnostic, raw-surface diagnostic, and paired native-vs-g2pk diagnostic all completed and artifacts uploaded.
- The focused §27 boundary test passed as browser test 1114. It confirms `할게`, `할게요`, `다를게`, `안타까울게` retain the licensed rule and `올게이` does not receive fortition from an internal substring.
- Actions run [41335266701](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41335266701): **PASS**. Test-case register extraction, validation, inventory generation, and artifact upload all succeeded.
- An earlier run failed because the new NIKL source row duplicated an existing `SRC-NIKL-QNA-330963` and the source-register test still expected 141 rows. The duplicate was removed, the existing record reused, a distinct `SRC-NIKL-QNA-308180` row added, and the expected count updated to 142 (133 review-required). The latest browser and Python jobs pass.
- The metadata-only official NIKL source-inventory job was skipped; item-level reuse/license review remains open.
- The paired Kozak Kim-vs-original-g2pK benchmark has now been rerun after the repair; see the measured before/after section above. The official NIKL source-inventory metadata-only job was skipped, and item-level reuse/license review remains open.


## Measured result of the §26 출산-family repair

The exact-head paired browser run [41336800424](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41336800424), artifact `13095038704`, re-ran the same 2,699 shared occurrences against the unchanged original g2pK implementation. Before/after artifact comparison used `13094763897` and `13095038704`.

- `비출산`: Kozak Kim surface `비출산` → `비출싼`; its IPA edit distance to the UGTPHON reference improved 2 → 1. Original g2pK remained `비출산` (distance 2).
- `출산`: Kozak Kim surface `출산` → `출싼`; original g2pK remained `출산`. The IPA edit distance did not improve because UGTPHON's IPA uses an aspirated-sibilant annotation where the NIKL dictionary gives the fortis Hangul pronunciation. This is a useful example of why surface-form source adjudication and raw IPA CER must be reported separately.
- No other paired Kozak Kim outputs changed in this §26-only comparison; g2pK outputs remained unchanged.
- On the paired subset, exact match stayed tied at 1,442/2,699 (53.4272%). Kozak Kim CER improved 8.1271% → 8.1228%; original g2pK CER remained 8.2138%. Paired CER delta improved from −0.08669 pp to −0.09102 pp; post-change 95% sentence-cluster bootstrap CI [−0.17881, −0.01647] pp (264 row clusters, 2,000 resamples, seed 20261101). This is a small measured diagnostic gain, not a universal accuracy claim.

The source-derived `저출산` control was added after inspecting the same official dictionary entry; it is not a UGTPHON test-set-derived exception and was not counted as a benchmark win. The dictionary directly records its pronunciation `[저ː출싼]`; the engine's exact rule license addresses fortition only, not independent validation of vowel length. This follow-up control still awaits exact-head CI.


### Verification status of the `저출산` follow-up

The code and positive/negative controls for `저출산` were added after the completed benchmark/system runs 41336800424 and 41336800458. New exact-head Actions for the current branch tip were created: system run `41339399132`, paired browser benchmark `41339399053`, native paired benchmark `41339399044`, and register extraction `41339399017`. At the time of this handoff these jobs were queued/in progress; no pass is claimed for the new `저출산` test until those runs complete.

 
## Follow-up: source-derived §26 and lexical readings — 2026-11-01

This continuation supersedes the earlier pending status for 실시간 and 이중성. Scope remains **Kozak Kim only**; original g2pK is unchanged and remains a comparison baseline, not linguistic gold.

### Implemented and verified

- **§26 실시간**: official NIKL lexical material records 실시간(實時間); combined with NIKL Standard Pronunciation Rule §26, this establishes the exact Sino-Korean 실>시간 boundary. Kozak Kim now surfaces 실씨간. The license is exact-form scoped; no generic ㄹ+ㅅ inference was introduced.
- **Exact lexical 이중성**: NIKL Korean Basic Dictionary directly lists 이중성(二重性) [이ː중썽]. The dated lexical addition preserves the long vowel and fortis onset in project IPA iː|dʑuŋ|s͈ʌŋ. IPA is derived from the attested Hangul reading, not supplied by NIKL. The Ukrainian target is explicitly provisional and is not accepted as confirmed output.
- **-성 research boundary**: the Basic Dictionary identifies -성(性) as a derivational suffix, and NIKL Q&A 312649 directly confirms 의외성[의ː외썽]. That answer does not directly confirm 유사성; the questioner's examples are not treated as official attestations. No productive suffix rule is implemented.
- **Phrase cases remain bounded**: 했을시 and 무고일수도있다는 occur without reliable whitespace in the corpus. The engine does not infer 했을 시 or 일 수 boundaries from an unspaced string. Exact phrase/morphology evidence is still required.

Sources registered: SRC-NIKL-INFO-SILSIGAN, SRC-NIKL-DIC-IJUNGSEONG, SRC-NIKL-DIC-SEONG-SUFFIX, and SRC-NIKL-QNA-312649. The source register now contains 147 rows; 138 remain review-required for item-level reuse terms. The official metadata-only source-inventory workflow was skipped, so rights closure is not claimed.

### Paired diagnostic result

Exact-head browser comparison: [Actions run 41342127112](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342127112), artifact 13098181051. Same 2,699 shared occurrences:

- Exact match: 1,442/2,699 (53.4272%) for both engines; exact-rate delta remains zero.
- Kozak Kim CER: 8.1184%; original g2pK CER: 8.2138%; paired CER delta: −0.09536 percentage points.
- Sentence-cluster bootstrap (264 source rows, 2,000 resamples, seed 20261101): exact-delta 95% CI [−0.20697, +0.20056] pp (crosses zero); CER-delta 95% CI [−0.18443, −0.02046] pp. This is diagnostic evidence on UGTPHON, not independent normative adjudication.
- Only two Kozak Kim outputs changed relative to the preceding post-§26 snapshot: 실시간 improved from edit distance 3→2; 이중성 changed from i.dʑuŋ.sʌŋ to iː.dʑuŋ.s͈ʌŋ, preserving the dictionary's long vowel and fortisness while edit distance stayed 1 because UGTPHON omits length. g2pK outputs did not change; no paired regressions were observed.

### Mass-cluster status after this pass

- C08 fortition cluster: 11 initial occurrences → 8 residual after source-backed repairs for 비출산, 실시간, and 이중성. Remaining cases include the unspaced phrase forms and 유사성; no broad suffix or phrase rule is authorized.
- C09 length cluster: 15 → 16 because source-backed 이중성[이ː중썽] now correctly preserves length even though the corpus reference omits it. Do not strip length to optimize CER.
- C01–C07 remain profile/allophony or environment-review tasks. No changes were made for [ɭ]~/l/, conditioned /h/, [ɲ], [ʰ]~/h/, /y/~/ɥi/, unreleased-coda marks, or liquid realization.

### Verification

- System run [41342127230](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342127230): PASS. Browser tests 1,368/1,368; public-page build and generated-page verification PASS; Python regression/data-integrity PASS. The metadata-only NIKL inventory job was SKIPPED.
- Browser g2pK integration [41342127246](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342127246): PASS; original practical-mode integration remains intact.
- Native-vs-g2pK paired diagnostic [41342127228](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342127228): PASS.
- Morphology consensus [41342127218](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342127218), research morphology adapter [41342127131](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342127131), and exhaustive test-case register extraction [41342127140](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342127140): PASS.
- Multi-engine Charsiu/ByT5 diagnostic [41342127137](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342127137) was still in progress at this handoff; no result is claimed.

**Readiness:** implementation and available software checks are verified, but the project remains a research prototype. Independent Korean IPA adjudication, independent Ukrainian target review, item-level NIKL rights review, and a held-out specialist-adjudicated corpus remain blockers. PR #416 stays draft and unmerged.


## Exact-head reproducibility update — 2026-11-01

The latest branch head `0c7688bb91687fec81965f426c24dd248df918bb` was re-run through [UGTPHON workflow 41342607471](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342607471). Its paired browser artifact `13097847614` was downloaded and inspected. The result reproduces the immediately preceding artifact `13098181051` with no Kozak Kim output changes across the 2,699 shared scored occurrences.

- 2,703 eligible occurrences; Kozak Kim scored 2,699 (4 unresolved, 99.8520% coverage); g2pK scored 2,703.
- Shared subset: 2,699. Exact both: 1,438; Kozak Kim only: 4; g2pK only: 4; both wrong: 1,253.
- Shared exact match: 1,442/2,699 (53.4272%) for each engine. Exact delta is zero; sentence-cluster 95% CI [-0.20697, +0.20056] pp crosses zero.
- Kozak Kim CER 8.1184%; g2pK CER 8.2138%; paired CER delta -0.09536 pp; sentence-cluster 95% CI [-0.18443, -0.02046] pp (264 row clusters, 2,000 resamples, seed 20261101).
- There are 26 current occurrences with different normalized IPA strings. The earlier 23-row count belongs to the original pre-§27/§26 baseline; the current 26 reflect the repaired `올게이` case leaving the set and four later source-backed output differences entering it (`비출산`, `출산`, `실시간`, `이중성`). The 27-row occurrence ledger deliberately retains historical snapshots; it is not a simultaneous current set. `paired-17` remains as historical evidence for the repaired false positive.

Exact-head system verification [41342607492](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342607492), browser g2pK integration [41342607484](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342607484), paired native diagnostic [41342607520](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342607520), morphology consensus [41342607489](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342607489), morphology adapter [41342607508](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342607508), and test-case extraction [41342607558](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41342607558) all passed. The metadata-only NIKL inventory job was skipped; optional ByT5/Charsiu inference and joined neural pairing were skipped. No neural score or source-rights clearance is claimed.

This verifies exact-head reproducibility and preserves the narrow claim: lower paired CER on this diagnostic profile, tied exact match, no independent normative IPA or Ukrainian target validation.


### Current IPA-discordance direction and unresolved occurrences

For the current exact-head artifact `13097847614`, the 26 normalized-IPA-discordant occurrences comprise **21 distinct token forms**. Relative to the best shared UGTPHON reference alternative, Kozak Kim has the lower edit distance on 17 occurrences, original g2pK on 7, and the engines tie on 2. These are occurrence-level reference-distance comparisons, not 17 independently adjudicated lexical wins: repeated forms include `없는` (4), `없다` (2), and `사건` (2), and the resampling unit remains the source sentence/utterance row.

The same artifact contains four unresolved Kozak Kim occurrences:

| Occurrence | Input | Evidence status | Decision |
|---|---|---|---|
| `dc_inside_2050` | `칡칡이` | Lexical/structural analysis not established | Keep unresolved; do not copy g2pK's resolved guess as gold |
| `dc_inside_2183` | `쫒아내면` | Possible nonstandard spelling/typo for `쫓아내면`; not confirmed by this benchmark | Keep source orthography intact; do not auto-correct spelling in the phonology engine |
| `dc_inside_2202` | `많앗구나유유유` | Likely nonstandard inflectional spelling, but no normalization contract or adjudication | Keep unresolved; no silent typo repair |
| `dc_inside_2241` | `무서웟어` | Likely nonstandard spelling of an inflected form, but source intent is not adjudicated | Keep unresolved; no silent typo repair |

Original g2pK returns outputs for these four inputs, but that does not establish those outputs as correct. The correct next step is an explicit source-orthography/typo policy and, for `칡칡이`, lexical/morphological evidence. Until then, Kozak Kim's abstention is preferable to an unsupported confident guess.


## Continuation — C01–C07 blind packetization and C08 evidence triage (2026-11-01)

### C01–C07 independent review packets

Seven separate source-blind pilot packets are stored in `research/ipa-review-packets/blind-ipa-C01.json` through `kozak-kim-C07.json`; see [packet index](../research/ipa-review-packets/README-KOZAK-KIM-C01-C07.md). They exclude engine outputs, reference IPA, engine identities, benchmark rankings, and proposed rule explanations.

**Not ready for external scoring:** artifact `13097847614` contains token-level forms and source-row identifiers but not the original sentence/utterance. Restore full licensed source context, verify item-level reviewer-sharing rights, freeze packet hashes, and only then dispatch blind copies. Current status: `PARTIAL / BLOCKED_MISSING_SENTENCE_CONTEXT_AND_RIGHTS_CHECK`.

### C08 exact-form evidence triage

- **의외성:** NIKL Q&A 312649 (2025-04-09) points to Urimalsaem's explicit pronunciation `[의ː외썽/의ː웨썽]`. The question mentions 다양성[-썽] and 유사성[-썽] as examples, but the official answer confirms only 의외성. Do not generalize this source to every `-성` form. [Official Q&A](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=312649).
- **했을시:** NIKL Standard Pronunciation Rule §27 establishes fortition of ㄱ/ㄷ/ㅂ/ㅅ/ㅈ after the adnominal `-(으)ㄹ` ending. It does not establish that this unspaced corpus string is segmented as `했을 시` or that this was the intended construction. Apply §27 only if the original context confirms the morphology and boundary. [Official rule text](https://korean.go.kr/kornorms/regltn/regltnView.do).
- **무고일수도있다는:** exact spacing, morpheme segmentation, and the relevant trigger remain unresolved; no exact-form source or trustworthy parse is established.

**Decision:** no C08 production change. No productive `-성` suffix rule. No silent insertion of spaces or inferred morphology. Keep all eight residual cases unresolved until each exact occurrence has source context, a defensible morphological analysis, and source-backed pronunciation. Any later change must add positive, negative, boundary, and interaction controls before paired re-benchmarking.


## C08 evidence update — exact morphology leads checked (2026-11-01)

The official-source search found useful **morphological** evidence for two of the residual forms, but not direct lexical pronunciation attestations. The decision remains research-only; no engine code changed.

| Corpus token | Candidate analysis | New official evidence | Decision |
|---|---|---|---|
| `무고일수도있다는` | `무고 + 이- + -(으)ㄹ + 수 + 도 + 있- + -다는`, i.e. likely `무고일 수도 있다는` | NIKL Q&A 327466 explicitly parses `둘 다일 수도` as noun + copula `이-` + adnominal `-(으)ㄹ` + dependent noun `수` + particle `도`. Standard Pronunciation Rule §27 directly includes `할 수는[할쑤는]`. | Strong conditional morphology lead: if the missing source utterance confirms this parse and prosodic connection, §27 predicts fortition at `수`. Still not a direct attestation of this exact corpus phrase or its pronunciation. |
| `했을시` | likely `했- + -(으)ㄹ + 시`, i.e. `했을 시` with dependent noun `시(時)` | NIKL's 2021 public-language guideline (p. 106) explicitly uses `규칙을 어겼을 시에는` and identifies `시` as a dependent noun used after `-을`. Rule §27 supplies the conditional fortition rule. | Strong conditional morphology/spacing lead. The exact source sentence and prosodic connection remain missing; no direct pronunciation entry for `했을 시` found. |
| `유사성` | Sino-Korean noun + suffix `-성` | NIKL Q&A 312649 asks about 의외성 and mentions 유사성[-썽] in the question, but its answer confirms only 의외성 `[의ː외썽/의ː웨썽]`. No exact official dictionary/Q&A attestation for 유사성 was found in this search. | Still unsupported as an exact lexical claim. Do not generalize a productive `-성` fortition rule from 의외성. |

**Evidence boundary:** Rule §27 states that ㄱ/ㄷ/ㅂ/ㅅ/ㅈ after the adnominal `-(으)ㄹ` are fortis and gives `할 수는[할쑤는]`; the official explanation also notes that closeness between the two elements matters. This establishes the rule environment, not the missing source context for these two unspaced tokens. No positive production patch is justified until source-row utterances are restored and checked. Source records added: `SRC-NIKL-QNA-327466` and `SRC-NIKL-EDU-2021-DEPENDENT-SI`.


## C08 occurrence-mapping gap — 2026-11-01

The mass-mismatch cluster register reports eight C08 occurrences, but the current `KOZAK-KIM-PAIRED-DISCREPANCY-LEDGER-2026-11-01.csv` has 27 rows and contains no C08 entries. Three source-row IDs were recovered from paired artifact `13097847614`: `multilexnorm2026_1953` (`무고일수도있다는`), `multilexnorm2026_1979` (`했을시`), and `dc_inside_2024` (`유사성`). The other five C08 occurrences are not currently enumerated in either the occurrence ledger or the inspected report excerpt. The stale phrase “remaining cases in the paired ledger” has been replaced with this explicit gap. Do not claim all eight have been source-reviewed until the five missing source-row IDs and exact utterances are recovered.


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


## C01–C07 source-context restoration — 2026-11-01

The earlier blocker “source utterance context unavailable” is superseded. All **39 unique source-row IDs** across the seven six-item pilot packets were matched to the official `naver-ai/UGTPHON/ko/test.json` (275-row Korean test split); every target token is present in its included raw sentence. UGTPHON's `ko/LICENSE` explicitly states Apache-2.0 for the Korean subset. Packets now include raw sentence context only, plus source-row provenance and attribution to UGTPHON, KoMultiText, and MultiLexNorm++; they exclude canonical text, phoneme annotations, IPA-Dict data, system outputs, and reference IPA.

**Updated status:** packet preparation is `DONE_VERIFIED`; the packets are `READY_FOR_INDEPENDENT_REVIEW_PILOT`. Independent reviewer assignment and first-pass submissions remain `TODO`. These six-item-per-cluster samples are not full cluster censuses. Preserve the Apache-2.0 notice and attribution; no raw gated MultiLexNorm++ files are redistributed. Upstream provenance/terms remain a documented limitation for broader reuse.


### Independent morphology cross-check and training-data readiness

The pinned Kiwi/MeCab-Ko cross-check (run 41353171166; artifacts 13102576042, 13101838045, consensus 13102406365) adds a useful constraint:
- Both analyzers find the target boundary before dependent noun 수 in 무고일수도있다는, though their internal segmentation of 일 differs.
- Kiwi parses 했을시 as 하/VV + 었/EP + 을/ETM + 시/NNB; MeCab-Ko parses 했/VV+EP + 을시/EC. The NIKL Q&A supports the dependent-noun analysis, but independent analyzer consensus is absent.
- Kiwi segments 유사성 as 유사/NNG + 성/XSN; MeCab-Ko treats it as one NNG. This does not establish the lexical pronunciation, and the form remains unresolved.

Do not resolve analyzer disagreement by majority vote. These outputs are diagnostic morphology hypotheses, not gold segmentation or IPA.

A separate training-readiness audit (partial workflow artifact 13101748305) reports 644 unique lexical rows, zero additions explicitly marked as independently adjudicated IPA gold, and 24 frozen holdout cases without IPA gold; no holdout overlap was found. Supervised IPA training is therefore NOT READY. No training was run.


**Evidence-source correction (2026-11-02):** the earlier provisional references to NIKL Q&A 335204 and 336313 were removed from the active source register because their direct pages could not be independently retrieved in this verification pass. The current active basis is NIKL Q&A 317798 (Rule §27 examples and pause caveat), 310899 (colloquial dependent noun 거), 331601 (알 수 없는[알쑤엄는]), plus the already registered 307960/327466/313481/333044 and the official Rule §27 page. Older historical mentions of 335204/336313 are superseded and are not current evidence claims.


## Latest runtime verification — 2026-11-02

- Exact-head system/Python/data and browser/build verification on code/test head `84e4200365851e7d070c76e0ebed7c113111475a`: push run `41419725829` and PR run `41419733699` both PASS. Python regression/data integrity PASS; browser suite `1,374/1,374` PASS with zero failures/skips; production build and generated-page verification PASS. NIKL metadata-only inventory was SKIPPED.
- Latest paired browser diagnostic: run [41419733723](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41419733723), artifact `13129795347`; 2,699 paired occurrences across 264 sentence/utterance clusters. Exact match tied on the paired subset (53.4272% each); Kozak Kim CER 8.0794% vs untouched original g2pK 8.2138%; paired CER delta −0.1344 pp, 95% sentence-cluster CI [−0.2246, −0.0531] pp. Four Kozak-only and four g2pK-only exact wins; 1,253 both wrong. This is a diagnostic comparison, not normative IPA gold.
- Latest native pair: same workflow run [41419733723](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/41419733723), artifact `13129641115`; native Kozak Kim 2,698 scored, exact 53.0393%, CER 9.0744%, five abstentions, zero errors; g2pK 2,703 scored, exact 53.0892%, CER 9.2285%. Paired delta (g2pK minus native) +0.0741 pp exact and +0.1560 pp CER: g2pK has a small exact-match point edge, Kozak Kim has lower CER. Do not conflate this native profile with the browser pair.
- g2pK surface output is passed through the project's shared segment-to-IPA renderer; the original g2pK implementation remains untouched. The paired scores do not establish independent native IPA encoding or universal engine superiority.
- Morphology adapter smoke, Kiwi/MeCab-Ko engine smoke, consensus, browser integration, extraction, pinned test split and paired diagnostics all passed in the exact-head workflow family. Optional CharsiuG2P and ByT5 inference were SKIPPED in the diagnostic workflow; no neural score is claimed.
- Three active additional NIKL Q&A sources are 317798, 310899 and 331601. Provisional Q&A IDs 335204 and 336313 remain retired from active evidence because their direct pages could not be independently retrieved.


## 2026-11-03 — lexical correction and g2pK research-overlay isolation continuation

- Source-backed `끌다` remains exact-form only: NIKL Standard Pronunciation Rule §7 explicitly lists `[끌ː다]` and `[끄ː러]`; Korean Basic Dictionary entry 62281 corroborates. The project IPA is derived; target Ukrainian form remains provisional.
- `굶다` is a bounded Rule §24 derivation (ㄻ stem + `-다`); the explicit `굶기다` -기- negative control prevents overgeneralization.
- Further call-path review found that `variant-aware-research` (`못잃어`) was not excluded from the Python g2pK app adapter. Test-only commit `5131e807` failed as intended (`못잃어` was changed to `몬니러`); fix `2e6e739` now excludes both research-only input kinds from surface and IPA overrides. The raw benchmark still invokes `G2p()` directly; original g2pK and vendor files are unchanged.
- Exact-head System Verify 41637788167 / 41637795909 PASS (Browser 1,391/1,391, Python/data integrity, Vite build, generated pages); g2pK integration 41637795791 PASS on 3.11/3.12; paired, UGTPHON, morphology, extraction and adapter-smoke workflows PASS.
- Multi-engine rerun 41637795800 was still in progress at this update; no new result is claimed. Prior raw-path artifact 13226589858 remains valid.
- The current project remains a research prototype. Independent Korean IPA adjudication, NIKL item-level rights, Ukrainian target review, C12 exact-environment acoustic/articulatory evidence, 239 unmapped mismatch occurrences, and adjudicated IPA gold for training remain open.


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
| R013 `-ㄹ게` license must remain inside the exact eligible occurrence | DONE_VERIFIED | Red failure 41841891363; fix 3358b814; System Verify 41842288415; Browser regression 1,148 passed on exact head 648949a. |
| R013 explicit phrase pair licenses `줄 것` / `많을 거` | DONE_VERIFIED for software behavior | Exact pair and negative controls pass Python/Browser CI; linguistic pause/cohesion remains conditional because the text API has no pause annotation. |
| Multi-engine benchmark on the R013 occurrence-scope fix | PARTIAL / IN_PROGRESS | Run 41842288431 must complete all 17 steps; inspect refreshed queue, same-occurrence Browser parity, SIGMORPHON and artifact before updating comparative evidence. |
| Independent Korean IPA / Ukrainian target review | BLOCKED | Human reviewers and adjudication still absent. |
| C12 acoustic interpretation and NIKL item-level rights | BLOCKED | Source audio/metadata and item-specific rights evidence remain unavailable. |

No g2pK source, dependency pin, or vendor blob was modified. PR #426 remains Draft/open, stacked on PR #425. No merge, release, deployment, force-push or branch deletion. Readiness remains research prototype, not research-certified or release-ready.


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
