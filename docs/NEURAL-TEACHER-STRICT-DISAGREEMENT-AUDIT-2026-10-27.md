# Neural-teacher vs ClippyFirst Strict: first error-correlation audit (2026-10-27)

## Status and scope

**Status: PARTIAL / research-only.** This is a diagnostic of a three-seed SIGMORPHON development portfolio and paired native-Strict outputs. A later run found cross-run drift for identical seed/configuration, so the portfolio is **not yet reproducible**; only each artifact's own metrics are valid. It is not an independently adjudicated accuracy comparison, not a normative pronunciation gold set, and not a production-rule change.

- Repository branch: `research/strict-teacher-guided-rule-mining-2026-10-26`; portfolio code commit at training: `2a435c8574c924124e840bb83df5b2cdee2b9a0a`.
- Portfolio workflow: [40470223568](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40470223568).
- Original portfolio artifact (later cross-run drift means it is not a reproducibility proof): [artifact 12717644093](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40470223568/artifacts/12717644093), ZIP SHA-256 `f5c77a85e92238fcbe13729b1c2a78c1277e933e5f2d982457e79d13d2dc2fef`.
- Dataset: pinned SIGMORPHON 2021 medium Korean; the 1,000-row dev split was used both for model selection and this diagnostic. **Do not treat these numbers as held-out generalization.**
- All three runs use the same bidirectional-GRU encoder + dot-attention GRU decoder, with different random seeds. This is a seed-robustness check, not an architecture bake-off.
- Target is the corpus's tokenized roughly-phonemic IPA. ClippyFirst emits its own broad IPA convention, and no independently reviewed adapter currently reconciles them. Existing pair files therefore intentionally compute **no Strict-vs-teacher exact match, CER, WER, or ranking**.

## 1. What the three neural runs actually tell us

| Seed | Exact dev forms | Token error rate | Compact-char error rate | Length-mark-only mismatches | Other token/feature mismatches |
|---|---:|---:|---:|---:|---:|
| 20261026 | 602/1,000 (60.2%) | 12.7169% | 12.1814% | 107 | 291 |
| 20261027 | 592/1,000 (59.2%) | 13.1091% | 11.9876% | 113 | 295 |
| 20261028 | 584/1,000 (58.4%) | **12.3246%** | **11.4352%** | 116 | 300 |

Selection by the predeclared token-error-rate criterion selects seed 20261028, but seed 20261026 has the highest exact-form rate. That is a real metric trade-off, not a reason to discard either run. Keep all three checkpoints and their histories.

### Seed agreement is informative but not a rule oracle

Across the same 1,000 dev forms:
- all three seeds match the corpus reference on 455 forms;
- none match on 275 forms;
- exactly two match on 143 forms;
- exactly one matches on 127 forms.
- Pairwise exact prediction agreement between seeds is only 596/1,000, 633/1,000, and 609/1,000 respectively.

Interpretation: 455 unanimous-correct examples are the best initial candidate pool for studying recurring correspondences, while the 275 unanimous-wrong cases are valuable hard cases. Neither pool is automatically truth: the reference itself has a particular transcription convention, the dev set selected the checkpoints, and agreement can reproduce shared model bias. The 270 forms with mixed correctness are especially useful for identifying context-sensitive or weakly learned patterns.

## 2. Error families visible in the neural teacher

### A. Length marks are a large, separable discrepancy class

Depending on seed, 107–116/1,000 examples differ only by `ː`/`ˑ` marks. In seed 20261026, 80 length-mark-only cases underpredict the reference's mark count, versus 27 that overpredict it (the other cases have equal counts but different locations). Seed 20261027 has 72 under- and 41 over-predictions; seed 20261028 has 80 under- and 36 over-predictions.

This is a repeatable *teacher/reference mismatch*, not yet evidence that ClippyFirst is wrong. Length marking is part of the SIGMORPHON target representation and may not be part of the engine's intended broad-IPA contract. **Do not add vowel-length rules or length marks to the runtime on this evidence alone.** First decide and document whether ClippyFirst's Korean IPA contract preserves lexical/historical length, then verify the corpus convention and adjudicate examples independently.

### B. Most remaining teacher errors are not a single systematic feature

The three runs report 291, 295, and 300 non-length-only mismatch cases. Examples in the saved error samples include consonant/feature substitutions, deletions, insertions, and sequences that diverge substantially (e.g. `가까이`, `각주구검`, `감사합니다`, `관악산`). The teacher can produce implausible sequences on some forms, which is consistent with a small character-to-token sequence model having no explicit Korean syllable/morpheme structure. Such outputs are **hypothesis-generation clues**, not candidate rules.

### C. Longer inputs correlate with lower teacher exact match, but sparse bins are not reliable

In seed 20261026, exact match is 66.1% for 2-Hangul-syllable inputs with a coda and 62.3% without a coda; for 3 syllables with a coda it is 50.0%; for 4 syllables with a coda it is 41.5%. The 5–8-syllable bins contain only 1–23 examples each, so their rates are too unstable to generalize. This points toward adding structural segmentation and explicit morphophonological features to the *research analysis*, not toward a blanket “long words” production rule. Coda presence is a coarse shape feature and is not causal evidence by itself.

## 3. What the paired Strict run exposes directly

The pair builder aligned **994/1,000** inputs and deliberately excluded six inputs because native Strict marked the pronunciation diagnostic-only/unresolved. This is a meaningful coverage boundary, not six confirmed wrong outputs:

| Input | Guarded context | Current reason for abstention |
|---|---|---|
| 가없이 | 없>이 | R002: liaison/neutralization requires exact morpheme evidence |
| 늙은이 | 늙>은 | R002: liaison/neutralization requires exact morpheme evidence |
| 많아지다 | 많>아 | R003: ㅎ-coda deletion requires an ending/suffix license |
| 말없이 | 없>이 | R002: liaison/neutralization requires exact morpheme evidence |
| 붉은기 | 붉>은 | R002: liaison/neutralization requires exact morpheme evidence |
| 수없이 | 없>이 | R002: liaison/neutralization requires exact morpheme evidence |

This reveals two high-value engineering questions:
1. **Morphological segmentation/lexical licensing:** the engine currently refuses to infer a morpheme boundary or apply R002 solely from a surface substring. This is conservative and prevents false positives, but it leaves productive compounds/derivations unresolved when a trusted analysis could license the rule.
2. **ㅎ-coda deletion licensing:** R003 needs the exact ending/suffix class; the engine does not yet have sufficient verified analysis for `많아지다`. Do not generalize from this one form.

These are confirmed *coverage gaps* in this dev slice; they are not evidence that the engine should guess. Next, add source-backed morphological analyses and case-level tests for the six forms, with explicit resolved/unresolved outcomes. Keep abstention until evidence is sufficient.

## 4. Why we cannot yet say “the neural model proves Strict is wrong”

The existing pair file explicitly records:
- Strict's output as broad IPA, while SIGMORPHON's target is tokenized roughly-phonemic IPA;
- no reviewed adapter from the latter into ClippyFirst's IPA conventions;
- no accuracy metric across the two outputs;
- no Ukrainian orthography derived from the teacher.

For example, a tokenized target such as `k a̠ ɡ o̞ k̚` and Strict's syllabified output `ka.ɡok̚` differ in segmentation and may differ in vowel/consonant conventions. A naive string diff would count representation choices as pronunciation errors. Likewise, teacher/reference length marks cannot be silently interpreted as mandatory ClippyFirst broad-IPA length.

Therefore this report separates:
- **Observed:** teacher/reference error statistics; six explicit Strict abstentions; source-shape associations.
- **Plausible hypotheses:** weak handling of morphology, coda-conditioned alternations, consonant assimilation/fortition, and long multi-syllable sequences may explain some teacher/engine divergences.
- **Not established:** the direction of error for any Strict-vs-teacher mismatch, a Strict accuracy score on SIGMORPHON, or a rule that is safe to integrate.

## 5. Recommended next research batch (in priority order)

1. **IPA contract and adapter review (blocking comparison).** Specify which symbols, length distinctions, syllable boundaries, aspiration/fortis features, and allophones are retained in ClippyFirst broad IPA versus SIGMORPHON target IPA. Build a versioned adapter only after review; preserve raw strings and provenance.
2. **Case-level triage on the 994 aligned forms.** Once the adapter is reviewed, classify disagreements as (a) representation-only, (b) teacher wrong, (c) Strict wrong, (d) both uncertain, or (e) unresolved because lexical/morphological context is absent. Use a blind human-reviewed sample before scoring.
3. **Investigate the six abstentions first.** Source evidence and morphological segmentation should decide whether R002/R003 can be licensed. Add positive and negative minimal pairs, not just these six positives.
4. **Mine stable teacher hypotheses.** Start with the 455 three-seed unanimous-correct dev forms, then look for repeated, context-defined correspondences and contrast them with the 275 unanimous-wrong forms. Record confidence and provenance per candidate; do not promote on model consensus alone.
5. **Targeted regression and independent adjudication.** Each candidate rule needs an authoritative rule environment, reviewed IPA, counterexamples, and regression tests. Keep all dev-derived results marked as development evidence.
6. **Freeze choices before any sealed test evaluation.** Do not inspect or select rules using the test partition. After the adapter and rules are frozen, evaluate once with a reproducible test-only path and report the different corpus/target scope separately.

## Acceptance criteria for moving a candidate into the deterministic engine

- exact rule environment and scope documented from an authoritative source;
- morphology/lexical prerequisites explicit, including when to abstain;
- source form, reviewed IPA, target adaptation, and provenance linked in a stable case record;
- at least one positive case and meaningful negative/minimal-pair regressions;
- no hidden dependence on teacher weights at runtime;
- Python/browser parity and all existing regression suites pass;
- improvement measured on a compatible, non-leaked evaluation set without worsening known cases.

## Evidence and artifacts

All seed-specific predictions, checkpoint weights, training histories, corpus manifest, error analyses, teacher/Strict paired JSONL, and hashes are retained in artifact 12717644093. The artifact contains train/dev only; the training workflow intentionally does not export or load test rows. Re-run the workflow rather than manually editing its derived metrics.

**Conclusion:** The current strongest actionable findings are (1) a sizeable teacher-only length-mark convention mismatch that must not be confused with engine error, (2) teacher instability on a substantial subset of forms, and (3) six explicit native Strict abstentions clustered around two morphology-licensed rules. The first next step is not bulk rule insertion; it is a reviewed IPA mapping plus focused morphological evidence and tests.


## 6. Raw character-level convention audit on the 455 unanimous-correct teacher cases

A follow-up inventory was computed from the saved pair files. Scope: 455 dev forms where all three seeds exactly match the SIGMORPHON reference, within the 994 forms for which Strict has non-diagnostic IPA. This is a **raw Unicode character inventory**, not aligned phoneme/token scoring. Character counts below count occurrences, not words or error rates.

| Raw feature in reference target | Count in teacher reference | Count in Strict broad IPA | What it tells us |
|---|---:|---:|---|
| Combining retraction mark in vowels (e.g. `a̠`) | 354 | 0 | The target uses more explicit vowel quality detail than broad output |
| Combining lowering mark (e.g. `o̞`, `e̞`) | 211 | 0 | Another systematic narrowness/convention difference |
| Combining rounding mark (e.g. `ʌ̹`) | 155 | 0 | The target distinguishes vowel rounding not represented in current broad IPA |
| Affricate tie bar (e.g. `d͡ʑ`) | 167 | 0 | Different IPA serialization of affricates; this may be formatting/segmentation rather than a phonological difference |
| Lateral retroflex symbol `ɭ` | 88 | 0 | Target coda-lateral convention differs from engine's `l` |
| `ɦ` | 30 | 0 | Target marks a voiced glottal fricative where Strict's broad rendering uses `h` in relevant contexts |
| Length mark `ː` | 55 | 2 | The target retains length in this subset more often than Strict broad output |
| `sʰ` / `ɕʰ` components | 270 aspiration marks overall | 150 aspiration marks overall | The target marks sibilant aspiration more often; Strict's partial narrow profile explicitly handles this separately from broad IPA |

Other rarer target symbols in this subset include `ʎ`, `β`, `ɸ`, `ʝ`, `ɥ`, and `ɘ`. These should be inspected by case and source convention before any mapping is proposed. The inventory also shows why a global “strip all diacritics” adapter would be unsafe: it would erase distinctions that the target uses and could hide real consonant or vowel differences.

### Concrete case triage

- **Likely teacher error, not a Strict error:** `가까이` reference is `k a̠ k͈ a̠ i`; Strict broad is `ka.k͈a.i`. Seed 20261026 inserts an extra `k͈` before `i`, while the other seeds match the reference. This is a sequence-generation instability; it is not evidence to add a consonant to ClippyFirst.
- **Representation difference, not yet a confirmed engine error:** `가솔린` reference uses `sʰ` and `ɭ` symbols, while Strict broad uses `s` and `l` with syllable separators. The engine code explicitly maps onset `ㅅ` to `s` in broad mode, reserves `sʰ/ɕʰ` for its partial narrow profile, and maps coda `ㄹ` to `l`. This is a target-contract mismatch that needs a reviewed adapter, not an automatic production change.
- **Possible surface-phonetic convention mismatch needing adjudication:** `경제학` target contains `ɦ` and tie-barred `d͡ʑ`, while Strict broad uses `h` and untied `dʑ`. Tie-bar normalization is likely a representation-level candidate; `ɦ` versus `h` requires an explicit decision about target phonetic detail and environment before classifying the engine.
- **Vowel detail is systematic:** common cases such as `가곡` have reference `k a̠ ɡ o̞ k̚` and Strict `ka.ɡok̚`. Removing spaces and syllable dots still leaves distinct vowel diacritics. This is exactly why a raw string metric would be misleading and why the adapter needs a documented, narrow set of transformations.

### Updated engineering interpretation

The strongest new finding is not “Strict has 317 errors”; such a claim would be invalid. It is that the target convention differs systematically along at least four dimensions: vowel diacritics, sibilant aspiration, lateral realization, and affricate/glottal-fricative notation. These differences account for a substantial portion of apparent raw divergence and must be mapped before the remaining cases can be triaged as teacher-wrong, Strict-wrong, both-wrong, or unresolved.

A new research-only script, `scripts/summarize_korean_teacher_strict_disagreements.py`, and its tests generate a reproducible case-level inventory across all three seeds while preserving raw IPA. The portfolio workflow archives `seed-consensus-disagreement-triage.json`. It intentionally emits no cross-IPA accuracy score and changes no production rules.


## 7. Critical cross-check: all six Strict abstentions are also unanimous teacher failures

The saved prediction JSONL files in both the original artifact [12718129194](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40470604816/artifacts/12718129194) and the subsequent run [12719507456](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40472610993/artifacts/12719507456) show that **all three neural seeds miss the SIGMORPHON reference on each of the same six inputs that Strict abstains on**. This is a useful negative finding: the scratch teacher does not provide a reliable pronunciation answer for the exact cases where the deterministic engine needs more morphology evidence.

| Input | SIGMORPHON reference (raw token sequence) | Teacher outcome |
|---|---|---|
| 가없이 | `k a̠ː ʌ̹ p ɕ͈ i` | 0/3 seeds exact |
| 늙은이 | `n ɯ ɭ ɡ ɯ n i` | 0/3 seeds exact |
| 많아지다 | `m a̠ː n a̠ d͡ʑ i d a̠` | 0/3 seeds exact |
| 말없이 | `m a̠ː ɾ ʌ̹ p ɕ͈ i` | 0/3 seeds exact |
| 붉은기 | `p u ɭ ɡ ɯ n ɡ i` | 0/3 seeds exact |
| 수없이 | `sʰ uː ʌ̹ p ɕ͈ i` | 0/3 seeds exact |

These are therefore **not** examples where a better neural result has shown Strict to be wrong. They are shared hard cases for the small teacher, and the reference itself still requires source-convention review before being treated as normative gold. The appropriate response is rule/source investigation and exact positive/negative tests, not copying any seed's predicted output.

The case-level triage should retain this signal explicitly: Strict's six diagnostic-only cases fall inside the teacher's unanimous-wrong group, not the unanimous-correct candidate pool. That prioritizes morphology analysis while preventing circular validation.


## 8. Reproducibility defect found by the second portfolio run

The newer portfolio workflow [40472610993](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40472610993), artifact [12719507456](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40472610993/artifacts/12719507456), completed successfully and produced the new case-level triage. However, comparison with the earlier artifact [12718129194](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40470604816/artifacts/12718129194) exposed an important reproducibility problem:

- Both artifacts report the same pinned train/dev JSONL hashes: train `b4ac3d28…57c7a0e`, dev `24fb3cdb…80696ac`.
- The trainer source SHA is unchanged (`fbc2f1751431d8a81159b2fc34e39360c84fb1db`), the seeds and command-line hyperparameters are unchanged, and both logs installed PyTorch `2.14.1+cpu`.
- Yet seed 20261026 changed from 602 exact dev forms to 596; seed 20261027 from 592 to 593; seed 20261028 from 584 to 597. Checkpoint and prediction hashes changed for all three seeds.
- Even epoch-1 train loss differs in the last decimal places (e.g. seed 20261026: `2.5877135523` vs `2.5877135559`). This suggests CPU parallel floating-point behavior in the two-thread recurrent training path may be propagating into different later predictions. That is a hypothesis about the cause, not yet a proven diagnosis.

Consequently, the original three-seed metrics remain valid for their original artifact only, and the newer triage's consensus counts (459 all-three-correct, 279 none-correct, 262 mixed) must not be substituted into the original audit's seed-consensus table. The six Strict abstentions are still teacher failures in all three seeds in both reviewed prediction bundles.

### Fix added; verification pending

- Changed scratch training to one intra-op and one inter-op CPU thread.
- Pinned the workflow to Python 3.12.15 and PyTorch 2.14.1+cpu.
- Added Python/PyTorch versions, seed, thread settings, deterministic-algorithm status, and full training hyperparameters to each training report and portfolio index.
- Added a same-seed repeatability gate that trains seed 20261026 twice and requires identical checkpoint SHA-256, prediction SHA-256, and dev metrics.
- These changes are **not verified yet**. The previous successful workflow ran before this fix. The next accepted portfolio artifact must pass the new same-seed gate before any results are called reproducible. If it still fails, investigate backend determinism further rather than selecting among drifting outputs.


## 9. What the new case-level artifact contains

The successful triage workflow [40472610993](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40472610993) uploaded [artifact 12719507456](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40472610993/artifacts/12719507456), including `seed-consensus-disagreement-triage.json` with 1,000 case-level records and the raw output from all three seeds.

For that run only, the counts are 459 forms correct for all three seeds, 279 wrong for all three, and 262 with mixed correctness. After removing only whitespace and syllable dots, raw teacher-reference/Strict string equality occurs on 9/459 unanimous-correct cases, 2/262 mixed cases, and 4/279 unanimous-wrong cases. **These equality counts are not accuracy scores**: they do not map vowel diacritics, consonant conventions, boundaries, or target representation. Their value is to identify a small set of exact raw candidates for review while preserving every raw string.

Because the same-seed runs drifted between artifacts, these counts describe artifact 12719507456 and are not a replacement for the earlier portfolio's metrics. The new one-thread/pinned-environment/repeated-seed gate must pass before the next portfolio can serve as the canonical reproducibility baseline.


## Continuation update — exact-form rule parity restored, CI pending (2026-10-27)

The earlier note that the browser-side mirror could not be updated is superseded by commit `2f61d079d060159e6b1a6334a6c9f213069cc1dd`. The shared browser engine now mirrors the same five exact-form licenses already present in Python:
- R002 formal-morpheme liaison: `가없이`, `말없이`, `수없이` at `없>이`, and `늙은이` at `늙>은`.
- R003 ㅎ-coda deletion: `많아지다` at `많>아`.

The licenses remain closed exact-form entries; they do not infer arbitrary morphology from substrings. The existing focused Python tests include positive cases and negative controls (`붉은기` remains unlicensed; `많아보이다` remains unlicensed). This is a parity repair, **not yet a verified acceptance result**: the write has just triggered fresh CI and neither browser tests nor the full test matrix have been confirmed on this new head. Do not merge until all relevant exact-head checks pass.

The original reproducibility-gated portfolio workflow and general/system workflows were still reported as queued when last polled. Earlier portfolio artifacts disagree despite nominally matching trainer, data, and seed settings, so their metrics must not be combined. The new single-thread deterministic configuration and duplicate-seed hash gate are intended to test this; they are not evidence of reproducibility until that gate completes.

Current task ledger:
- `DONE_VERIFIED`: source-preserving teacher/Strict pairing, raw IPA inventory, and consensus-triage tooling were exercised by earlier successful CI/artifacts; their findings remain diagnostic-only.
- `PARTIAL`: exact-form R002/R003 changes and their positive/negative tests exist in both Python and browser code; latest-head test execution is still pending.
- `BLOCKED`: reproducible teacher metrics until duplicate-seed hashes and predictions pass the new gate; broad-IPA vs corpus-IPA comparison until reviewed adapter and adjudication exist.
- `DEFERRED`: neural runtime integration; any rule promotion inferred solely from teacher outputs.

No claim is made that these candidates improve Ukrainian output accuracy; the current evidence licenses Korean morphophonological steps only.

## Sequential-rule regression correction and browser coverage (2026-10-27)

While hardening the newly licensed `많아지다` case, inspection of the actual ordered-rule implementation exposed an incorrect expectation in the first focused Python test: after R003 removes the ㅎ component from ㄶ, the following R002 pass must resyllabify the retained ㄴ before the vowel-initial syllable. The test now expects `마나지다`, not a retained coda followed by a silent onset. This is a test correction to match the declared rule order and Korean surface structure; it does not broaden the rule license.

Added `tests/exact-form-teacher-triage-cases.test.mjs` to exercise the browser engine end-to-end for the four R002 forms (`가없이 → 가업씨`, `말없이 → 마럽씨`, `수없이 → 수업씨`, `늙은이 → 늘그니`), the sequential R003→R002 form `많아지다 → 마나지다`, and a negative control that `많아보이다` does not become `마나보이다`. These are expected Korean surface-Hangul forms, not claims of IPA-to-Ukrainian accuracy. The new test and corrected Python test have not yet been executed by CI at the time of this note.

The current source-level comparison confirms that the Python and browser exact-form maps have identical key/value inventories for the affected R002 and R003 maps (37 and 25 entries respectively). This is a local structural check only; the full test matrix and runtime output tests remain pending.

### Follow-up surface-form review — `말없이` (2026-10-27)

A second pass over sequential R002 behavior corrected the new browser test's initial expected Hangul surface for `말없이`. Because the preceding coda ㄹ resyllabifies into 없 before the internal `없>이` liaison, the expected engine surface is `마럽씨`, not `말업씨`. The test was corrected in commit `e34e9285474cbe8f8dc34a33ea10283e1ad31e7f`. This is a test expectation correction, not a change to the rule engine. CI is still queued, so this expected output remains unverified by execution.


## Newly identified cross-runtime IPA-profile divergence (2026-10-27)

A source-level inspection found a separate Korean IPA acceptance issue that must be resolved before comparing Python and browser pronunciation output. The Python renderer in `src/korean_ukrainian/ipa.py` emits broad-profile fortis ㅆ as `s͈` regardless of the following vowel. The browser renderer in `src/app/engine_convert.js` changes ㅆ before members of `J_VOWELS` (including ㅣ) to `ɕ͈`. Therefore a form ending in 씨 can receive different IPA strings across runtimes even when the Korean surface-Hangul result matches.

This note deliberately does **not** declare either representation universally correct. The difference could reflect distinct transcription conventions (phonemic/broad versus a surface-coarticulatory rendering), but the browser path does not currently expose a clearly named profile boundary corresponding to Python's `phonemic` / `broad` / `narrow` profiles. It is therefore not safe to normalize the two strings automatically or count the discrepancy as a Korean pronunciation error without a project decision supported by phonetic evidence.

The same architectural distinction appears in the existing code: Python provides a typed `ipa_level` (`phonemic`, `broad`, `narrow`) and explicitly labels its narrow sibilant profile as partial; browser IPA is assembled from the target-correspondence CSV plus contextual rules, with a hard-coded palatalization branch. This is a cross-runtime contract gap, not a Ukrainian target-mapping task.

Required follow-up, ordered before any Ukrainian adaptation work:
1. Define one explicit runtime-independent IPA profile contract, including whether surface coarticulation is included in broad IPA and the status of /s, s͈/ before /i, jV/.
2. Add paired fixtures for the same Korean surface forms at each supported profile; compare normalized structure only after the profile is the same.
3. Keep phonemic and surface IPA separate if the evidence supports both; never silently rewrite `ɕ͈` to `s͈` (or vice versa).
4. Run the same fixtures in Python and browser CI. Then expand to all consonant/vowel contexts, long-vowel and syllable-boundary preservation, and only after Korean IPA acceptance is stable resume Ukrainian target adaptation.

This is a source inspection finding, not a test result. The full test jobs are still queued, so no cross-runtime runtime mismatch has yet been measured by executing these exact fixtures. Task ledger: `TODO` — document/implement a named IPA profile contract and paired fixtures; `BLOCKED` — cross-runtime IPA parity acceptance until the contract is agreed and the CI jobs execute; `DEFERRED` — Ukrainian practical-orthography adaptation work until Korean surface/IPA acceptance is stable.


## Exact-head regression triage and profile-contract follow-up (2026-10-27)

The Actions runs on `37487217fd187874099661025f5c6cb72963e172` surfaced one shared fixture failure in the Python test suite, system verification, and neural seed-portfolio test gate. The failing test was `test_seed_consensus_is_preserved_without_cross_ipa_scoring`; the analyzer correctly enforces case IDs prefixed by `sigmorphon-2021-task1-medium-korean:dev:`, while the test fixture incorrectly emitted `sigmorphon-dev:`. The test fixture now uses the exact pinned dataset/split prefix in commit `82e24ce2375872693952ee2e5224c8743d317f33`. This is a test-data correction; the validation gate was not weakened.

Added [Korean IPA runtime-profile contract](KOREAN-IPA-RUNTIME-PROFILE-CONTRACT-2026-10-27.md). The Python broad / browser contextual fortis-sibilant difference remains unadjudicated. Do not normalize `s͈` and `ɕ͈` automatically or use cross-runtime/teacher accuracy as a quality claim until the profile semantics are explicit and paired tests run against the same profile. Ukrainian adaptation remains deferred.

At the time of this update, exact-head CI for `18eab9e6faf5448c20803257576d1182669e0564` is queued; therefore the test fixture correction and profile contract are **not yet marked DONE_VERIFIED by runtime CI**. The browser integration, corpus, and diagnostic successes on the previous head do not substitute for the failing Python test or for exact-head verification.


## Paired runtime baseline fixtures added (2026-10-27)

The current legacy behavior is now captured separately in browser and Python tests without labelling either side as gold: browser baseline cases include `씨 → ɕ͈i`, `싸 → s͈a`, `시 → ɕi`, `쇼 → ɕjo`, and `쌰 → ɕ͈ja`; Python broad assertions include `씨 → s͈i` and `싸 → s͈a`. The tests are diagnostic snapshots intended to keep the divergence visible, not a parity test. The exact-head tests are pending; the profile decision remains blocked on source-backed phonetic adjudication. No target mapping was changed.


## Current execution snapshot (2026-10-27; head reconciliation)

The fixture-prefix defect has been corrected and diagnostic Python/browser sibilant baselines added. These are source-controlled changes, not yet runtime-verified: GitHub Actions is backlogged and the exact current head has queued checks. Do not mark the repair `DONE_VERIFIED` until the current-head test, browser, and system checks finish. The `s͈` versus `ɕ͈` discrepancy remains a profile/adjudication blocker, not a license to normalize either representation. Ukrainian adaptation remains deferred.
