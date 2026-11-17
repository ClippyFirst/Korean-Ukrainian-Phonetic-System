# Cross-word lexical interactions and Python/browser IPA parity — 2026-11-15

Status: **PARTIAL_PROTOTYPE** (unchanged). This audit records five verified engine
corrections, a reproducible Python/browser IPA parity audit and the checks run on the
exact final code. It does not establish independent linguistic validation, and the
broader assignment (independent IPA adjudication, competitor re-run, Ukrainian
adapter allowlist, CI on GitHub) remains open — see "Remaining work".

Branch `feature/kozak-kim-phonetic-accuracy-advancement`, started from `main`
`70f7bdde02907a5ee023b2401d19a304584ab9ae` (unchanged on origin at the time of
writing; the branch is a strict fast-forward of `main`). `AGENTS.md` designates
`main` as the integration branch; this work used a dedicated branch at the owner's
explicit request in the assignment and is non-destructive. Nothing was pushed
(no credentials in the execution environment); no PR exists.

## Task ledger

| ID | Task | Status | Implementation | Evidence |
|---|---|---|---|---|
| L1 | Preserve a cross-word-changed first onset when a lexical row governs the next word (`만날 사람[만날싸람]`, NIKL §27) | DONE_VERIFIED | `pipeline.py` `_cross_word_onset_to_preserve`, `_preserved_first_onset_ipa` — `8f336bce` | `tests/test_phrase_lexical_boundary_onset.py` (red→green) |
| L2 | Browser: ㄹ inserted by §29 phrase insertion is lateral (`할 일`, `먹을 엿`) | DONE_VERIFIED | `engine_convert.js` — `6f7b081f` | `tests/phrase-insertion-lateral-ipa.test.mjs` |
| L3 | Python phrase mode matches exact multi-word lexical rows (8 official §12/§15 examples) | DONE_VERIFIED | `pipeline.py` `_lexical_phrase_matches` — `494707ec` | `tests/test_phrase_lexical_rows.py` (20 tests) |
| L4 | Left-word coda change by connected-phrase rules (§18/§20) survives the left word's own lexical row | DONE_VERIFIED | `pipeline.py` `_cross_word_codas_to_preserve`, `_preserved_last_coda_ipa` — `6369fe74` | `tests/test_phrase_lexical_boundary_coda.py`; 2,608-pair probe 218 → 0 mismatches |
| L5 | Four lexical rows lacked the unreleased marker (솔잎, 설익다, 담력, 옷 입다) | DONE_VERIFIED | `lexical_pronunciations.csv`, `lexical_additions_2026-10-15.csv`, regenerated `ipa_target_data.js` — `6369fe74` | `tests/test_lexical_unreleased_stop_convention.py` (red confirmed by stash) |
| L6 | Browser: ㄹ\|ㄹ across a phrase boundary is lateral (generic and lexical-split paths) | DONE_VERIFIED | `engine_convert.js`, `engine_rules_phrase.js` — `6369fe74` | `tests/phrase-liquid-geminate-lateral-ipa.test.mjs` |
| L7 | Python broad IPA: word-initial lenis stop is voiceless after a boundary (`가다 가다` → `ka.da ka.da`) | DONE_VERIFIED | `ipa.py` — `aba5a636` | `tests/test_ipa_word_initial_lenis_boundary.py` |
| P1 | Reproducible Python/browser IPA parity audit | DONE_VERIFIED | `scripts/audit_runtime_ipa_parity.{py,mjs}`, `reports/runtime-ipa-parity-2026-11-15.json` | below |
| P2 | `만날 사람` length mark (Python `s͈aː.ɾam`, browser `s͈a.ɾam`) | PARTIAL | none (uncertainty recorded) | below |
| P3 | Sino-Korean ㄹ+ㄷ/ㅅ/ㅈ (`결정`, `열정`, `설정` …) | DEFERRED | none | policy unchanged (`DECISION-LOG`: no productive heuristic) |
| P4 | Ukrainian adapter allowlist / enabling Python target output | BLOCKED | none | needs independent IPA adjudication (see `IPA-PRODUCTION-PATH-AUDIT-2026-10-27`) |
| P5 | Competitor (multi-engine) comparison re-run | TODO | none | token-level UGTPHON result unchanged (below); multi-engine run not executed |
| P6 | GitHub CI on the final commit | BLOCKED | none | no push credentials; not claimed |

## Findings and evidence

**L1/L4 share one root cause.** A lexical row is an attestation of one word in
isolation. It was applied after the ordered rules and rewrote every syllable of that
word, undoing changes made across the word boundary. The first syllable's onset can
only change through the preceding word, so an onset differing from its orthographic
onset is unambiguously cross-word. The final coda also changes inside the word
(neutralization), so L4 separates the two by re-running the same ordered rules on the
word alone: only a coda that differs from that isolated result is preserved, and only
when the row itself restates the isolated coda. IPA is repaired by swapping just the
onset/coda segment of the sourced lexical syllable (length and vowel kept); if the
sourced syllable does not carry the expected segment the rule-derived syllable is
used rather than guessing. Evidence class: L1 is an official §27 attestation; L4's
expected forms are **rule-derived** (official `밥 먹는다[밤멍는다]` establishes the
connected-phrase rule; the lexical rows attest only each word alone) and agree with
the browser runtime, which already applied the phrase pass after lexical lookup.

**L5.** Only 4 of 1,783 sourced lexical IPA syllables ended in a bare stop; all others
(and `ipa.CODA`) use `p̚ t̚ k̚`. The omission also had a functional effect: the browser
phrase pass matches the coda symbol and silently failed for `솔잎 나무`. One pinned
test (`corpus-sentence-and-trace-regression`, `옷 입다`) encoded the inconsistent
value; it was changed with rationale, and another existing test already pinned
`on nip̚.t͈a`.

**L7.** `docs/korean-phonology.md` states phrase-initial lenis stops stay `[k t p]` in
the broad layer; Python's ㅎ/ɭ rules and the browser already stop at a boundary, but
the lenis voicing rule did not, making `나무 가다` ≠ `na.mu` + isolated `가다`.
Whitespace is only the project's phrase proxy (as in the browser); real prosodic
phrasing is not inferred.

**P1 — parity audit** (`python scripts/audit_runtime_ipa_parity.py`, Python
`boundary_mode="phrase"` vs browser strict mode, IPA compared):

| Input group | Inputs | Equal | Other classes |
|---|---:|---:|---|
| Pattern-extracted NIKL bracket examples | 458 | 450 | 7 abstention-representation, 1 length-mark |
| Every lexical key | 677 | 676 | 1 length-mark |
| Left lexical word × 5 right triggers | 3,260 | 3,250 | 10 other |

Before this session's fixes the same audit showed 706 unexplained differences in the
combination group (616 lenis voicing, the rest liquid/coda cases). Classification of what
remains:

- **Representation convention (7 inputs, e.g. `닭은`, `흙은`, `끓이다`):** Python
  returns diagnostic IPA with a typed unresolved status; the browser returns an empty
  IPA with `unresolved`. Documented contract difference, not forced to agree.
- **Unresolved linguistic uncertainty (`만날 사람`, 2 rows):** the Python lemma row
  `사람` carries the NIKL Korean Basic Dictionary length `[사ː람]` (retained by the
  2026-11-01 decision not to strip source-backed length), while the phrase row
  `만날 사람` is a rule-derived practical entry without length. Whether length is
  realized on a non-initial word in a phrase is not established by either source, so
  no change was made.
- **Intended implementation difference (10 inputs, e.g. `겉옷 리본`):** the browser
  applies the project-inferred ㄷ+ㄹ → ㄴ+ㄴ nasalization across a boundary; Python is
  fail-closed. No official cross-word ㄷ+ㄹ example exists; left as is.

**Evaluation against official examples** (`scripts/evaluate_official_nikl_examples.py`,
452 pattern-extracted examples). The extracted gold is **not curated** (some bracketed
forms belong to a different rule context than the bare input), so absolute exact-match
counts are not an accuracy claim. Used as a before/after differential against `main`
`70f7bdde`: Python fixed 9 (`옷 한 벌`, `낮 한때`, `꽃 한 송이`, `밭 아래`, `늪 앞`,
`꽃 위`, `넋 없다`, `닭 앞에`, `만날 사람`), regressed 0; browser fixed 0, regressed 0.
The 19 official phrase examples tested individually: Python 19/19 (was 11/19),
browser 19/19.

**Token-level IPA benchmark (UGTPHON, pinned `ef0d5a09…`, Apache-2.0, not copied into
the repository, downloaded to a temp dir).** Baseline `70f7bdde` and final tree give
identical results in both runtimes: 2,702 scored tokens, 1,425 exact (0.527387),
character error rate 0.09013. This is expected — the corrections affect multi-word
contexts, which single tokens do not contain. It shows no regression and no
improvement; it is a diagnostic against an externally noisy convention, not
independent validation.

**Ukrainian adapter.** The earlier observation that Python phrase results are
`target_status: unavailable` is not phrase-specific: ordinary words (`한국어`, `사람`)
are equally withheld with reason `lexical_target_reference_provisional`, although a
candidate is produced from the actual IPA (`ганґуґо`). This is the intentional
fail-closed target policy; the browser exposes provisional output. No enablement was
made without independent IPA adjudication.

## Verification (exact final tree, this environment)

| Check | Result |
|---|---|
| `python -m pytest` (with `g2pk==0.9.4`) | PASS — 832 passed, 0 failed |
| `npm test` | PASS — 1,472 passed, 0 failed (run before the final Python-only voicing commit; JS files unchanged since) |
| `npm run check:ipa-target-data` | PASS — generated data current |
| `npm run audit:source-rights` | PASS — exit 0; 239 register rows, 0 structural errors |
| `npm run audit:source-register`, `npm run audit:nikl-test-index` | PASS — exit 0 |
| `npm install --no-audit --no-fund` then `npm run build` | PASS — built; chunk-size warning only |
| `python -m build --wheel` | PASS — 0.6.0 wheel built |
| Pinned UGTPHON diagnostic, both runtimes, baseline vs final | PASS — identical (above) |
| GitHub Actions | NOT RUN — branch not pushed |
| Multi-engine competitor benchmark | NOT RUN |
| Independent linguistic review | NOT AVAILABLE |

## Remaining work

1. Push the branch and obtain exact-head GitHub Actions evidence (blocker: credentials).
2. Decide the phrase-internal vowel-length convention for source-backed lemma length
   (P2); acceptance: a documented rule with a cited source, applied in both runtimes.
3. Independent IPA adjudication and a non-empty target-profile allowlist (P4); until
   then Python target output stays withheld by design.
4. Curate the official-example gold per article so the evaluation can report accuracy,
   not only a differential.
5. Re-run the multi-engine comparison on the final head (P5).
6. Not investigated: whether a lexical row for the right word can overwrite its own
   coda, or the left word's onset, through a cross-word rule. Only the left word's
   coda and the right word's first onset are covered (the two demonstrated cases). The
   isolated-baseline method also assumes the ordered rules are deterministic for the
   word alone.


---

# Second pass — right-side lexical overrides, boundary matrix, Ukrainian/IPA consistency

Code verified at `8c5b73e2` (commits after it are documentation only). Branch still
local and unpushed; `main` and `origin/main` remained `70f7bdde` (0 commits ahead).
Working tree and the diff against `main` contain no `__pycache__`/`.pyc` files.

## Second-pass ledger

| ID | Task | Status | Implementation | Evidence |
|---|---|---|---|---|
| R1 | Hypothesis: a lexical row for the **right** word undoes a boundary-changed onset | CONFIRMED on `70f7bdde`, DONE_VERIFIED on the branch | already covered by L1 (`8f336bce`), generalized here with tests | 11,736-phrase probe: baseline 236/236 changed right onsets (ㄴ→ㄹ) overwritten, branch 0; IPA level 0 non-lateral |
| R2 | Hypothesis: a lexical row for a **middle** word undoes its coda changed by the next word | CONFIRMED on `70f7bdde`, DONE_VERIFIED on the branch | L4 (`6369fe74`) | baseline 182 middle-word coda overwrites, branch 0 |
| R3 | Negative hypothesis: the right word's own coda / interior syllables are altered by a left boundary rule | NEGATIVE (verified) | none | interior 0 mismatches; the 180 first-nucleus differences come from 12 distinct rows (`쪄 쳐 져 희어 희망 씌어 틔어 띄어쓰기 쓸어 희떱다 늴리리 닁큼`: ㅕ→ㅓ after affricates, ㅢ→ㅣ) and every one of the 12 shows the same difference when the word is converted alone, so none is a boundary effect |
| R4 | Boundary matrix regression test | DONE_VERIFIED | `tests/test_phrase_boundary_lexical_matrix.py` (20 tests) — `8c5b73e2` | red on `70f7bdde` (10 failed / 10 passed), green on the branch |
| R5 | Browser: a lexical word's `ukrainian` text left stale after a phrase-pass IPA rewrite | CONFIRMED, DONE_VERIFIED | `engine_rules_phrase.js` `syncUkrainian` — `29e7aa16` | `tests/phrase-pass-ukrainian-follows-ipa.test.mjs` (red 4 of 5, then green); inconsistent Ukrainian over 3,834 resolved phrases 623 → 0 |
| R6 | IPA → Ukrainian audit, Python side | PARTIAL | none | below |
| R7 | Lexicon vs rule-path IPA audit | PARTIAL | none | below |
| R8 | Classify the 10 residual parity cases | DONE_VERIFIED (classification), DEFERRED (behavior) | none | below |

The oracle in R1–R4 is the repository's own ordered rule pipeline: it proves a
lexical row no longer undoes a rule that already applied. It is an internal
consistency check, not independent linguistic evidence; the rule outputs themselves
rest on the official examples cited in the first pass.

## R5 — the Ukrainian text must be a function of the final IPA

The browser phrase pass rewrote a word's IPA and its per-syllable `trace.output` but
not the word's aggregated `ukrainian` / `candidate_ukrainian`. For generic words the
two agreed; for words served by a lexical row the Ukrainian came from the sourced
IPA before the boundary change. Example on `70f7bdde`: `밥 꽃잎 나무` showed IPA
`pap̚ k͈on.nim na.mu` and Ukrainian `пап кконніп наму`; `발 내복약` showed `pal lɛː…`
with `небонняк`. Over 3,834 resolved phrases (every lexical word after `밥 발 책 한`,
before `나무`, before `리본`) 623 (16%) were inconsistent. The helper updates the
string only when the replaced edge text matches the old syllable output, so a
non-matching string is left unchanged rather than guessed. Now 0 of 3,834.

## R6 — Python IPA → Ukrainian

- The Python adapter consumes the actual IPA string: for 3,912 phrases the
  `ukrainian_orthography` equals `render_ipa_sequence_to_ukrainian(final IPA)` in all
  3,762 cases where the adapter is available.
- For the other 150 phrases (e.g. `밥 되어`, `밥 의견란`, `밥 주의`) the raw adapter
  returns `unavailable / provisional_mapping_requires_review` because the IPA contains
  `ɰ`, `ø`, `y` or `ɲ`, whose correspondences are unreviewed. The pipeline still
  shows a **candidate** (`пап твео`) built from the lexical target reference, labeled
  `lexical_target_reference_provisional`, with `target_status: unavailable` and
  `selected_candidate_is_output_source: False`. This is the documented fail-closed
  separation of candidate availability from an output the project may present as
  confirmed (`IPA-PRODUCTION-PATH-AUDIT-2026-10-27`). Those 150 candidate strings are
  not derivable from the IPA stage and are therefore not evidence for the adapter.
- Ordinary words such as `한국어` and `사람` are withheld for the same reason
  (`lexical_target_reference_provisional`): a candidate exists (`ганґуґо`, `сарам`),
  the right to display it as confirmed does not. No allowlist was enabled.
- Orthographic note found, not changed: `canonical_correspondence.csv` records that a
  fortis onset is "preserved by doubling the Ukrainian consonant" (`кк`), while the
  browser phrase pass comments state fortisness is not represented by doubling. The
  convention needs a decision before an allowlist; recorded under Remaining work.

## R7 — lexicon versus rule-path IPA (677 rows, single words 675)

- Syllable counts: all rows consistent except `6·25` and `3·1절` (non-Hangul
  characters, expected).
- Bare stop-final syllables: 0 after the first-pass repair (was 4).
- Lexical rows differing from the rule-only (unlicensed, fail-closed) pipeline:
  250 equal; 320 segmental differences (mostly rules that stay unlicensed in strict
  mode, so the sourced row supplies the attested form); 68 length only (the row
  carries dictionary length the rule path never emits); 14 differ by `ɲ` (row) versus
  `nj` (rule path) for ㄴ before a glide, e.g. `한여름 han.ɲʌ.ɾɯm` against rule-only
  `han.njʌ.ɾɯm`. `KOREAN-IPA-CONVENTION-REVIEW-2026-10-26` lists `ɲ` versus `n` as an
  open hypothesis, so this is an **unresolved convention discrepancy** (dataset rows
  against the rule realization inside one broad profile); no diacritic or symbol was
  added or removed. Both runtimes use the same rows, so it does not cause parity gaps.
- Tone: none in the IPA contract (Korean); no tone marks exist in the data.

## R8 — the 10 residual Python/browser IPA differences

All ten are one phenomenon: a left word whose final coda is a neutralized ㄷ
(from ㅅ/ㅆ/ㅈ/ㅊ/ㅌ) followed by a word beginning with ㄹ (`… 리본`).

| Input | Python | Browser |
|---|---|---|
| 겉옷 리본 | `kʌ.dot̚ ɾi.bon` | `kʌ.don ni.bon` |
| 꽃밭 리본 | `k͈ot̚.p͈at̚ ɾi.bon` | `k͈ot̚.p͈an ni.bon` |
| 콩엿 리본 | `kʰoŋ.ɲʌt̚ ɾi.bon` | `kʰoŋ.ɲʌn ni.bon` |
| 밤윷 리본 | `paːm.ɲut̚ ɾi.bon` | `paːm.ɲun ni.bon` |
| 고갯짓 리본 | `ko.ɡɛ.tɕ͈it̚ ɾi.bon` | `ko.ɡɛ.tɕ͈in ni.bon` |
| 베갯잇 리본 | `pe.ɡɛn.nit̚ ɾi.bon` | `pe.ɡɛn.nin ni.bon` |
| 뒷윷 리본 | `tyːn.ɲut̚ ɾi.bon` | `tyːn.ɲun ni.bon` |
| 물엿 리본 | `mul.ljʌt̚ ɾi.bon` | `mul.ljʌn ni.bon` |
| 서른여섯 리본 | `sʌ.ɾɯn.ɲʌ.sʌt̚ ɾi.bon` | `sʌ.ɾɯn.ɲʌ.sʌn ni.bon` |
| 스물여섯 리본 | `sɯ.mul.ljʌ.sʌt̚ ɾi.bon` | `sɯ.mul.ljʌ.sʌn ni.bon` |

- **Location:** browser `src/app/engine_rules_phrase.js` (`rightOnset==='ㄹ'` with a
  ㄷ-class left coda, rule label `project-inferred-d-liquid-nasalization`); Python makes
  no cross-word change in this environment (observed output `ɾi.bon`; the pipeline
  location was not traced further because the behavior is a policy difference).
- **Type:** intended policy difference (project inference versus fail-closed).
- **Evidence:** none official. The norm text in the repository does not contain
  `몇 리`; the lexical row `몇 리[면니]` is a "rule-derived practical entry", and
  `docs/korean-system-audit-report-2026-10.md` labels the browser step an inference.
  The ten rows are consequences of one browser rule, not ten independent defects.
- **Decision:** unchanged, as instructed — parity is not forced for its own sake.
- Also unchanged and classified: the 7 typed abstentions (`닭은`, `흙은`, `끓이다`,
  `먼 옛날`, `슬픈 얘기`, `여덟은`, `긁개`: Python exposes diagnostic IPA with a typed
  unresolved status, the browser an empty IPA with `unresolved`, a documented contract
  difference) and `만날 사람` (Python keeps source-backed `ː`, the phrase row has none;
  unresolved linguistic uncertainty).

## Second-pass verification (exact code state `8c5b73e2`)

| Check | Result |
|---|---|
| `python -m pytest` | PASS — 852 passed, 0 failed |
| `npm test` | PASS — 1,477 passed, 0 failed, 0 skipped |
| `npm run check:ipa-target-data` | PASS |
| `npm run audit:source-rights` / `audit:source-register` / `audit:nikl-test-index` | PASS — exit 0 each |
| `npm run build` | PASS (chunk-size warning only) |
| `python -m build --wheel` | PASS |
| `scripts/generate_master_table.py` (with `PYTHONPATH=src`), `generate_korean_corpus.py --strict`, `build_test_case_register.py` | PASS — exit 0; generated outputs untracked, no drift in tracked files |
| Runtime IPA parity audit | 450/458, 676/677, 3,250/3,260 equal; residual classified above |
| Pinned UGTPHON token benchmark (both runtimes) vs `70f7bdde` | identical: 1,425/2,702 exact (0.527387), CER 0.09013 |
| Official-example differential vs `70f7bdde` | Python +9 / 0 regressions; browser 0 / 0 (gold is pattern-extracted, see first pass) |
| GitHub Actions on the branch | NOT RUN — branch not pushed (no credentials) |
| Clean-install check (`npm install` then build; `pip` editable install not repeated) | PARTIAL — npm path PASS; the CI editable-install step was not reproduced |
| Multi-engine competitor comparison, independent linguistic review | NOT RUN / NOT AVAILABLE |

## Branch policy note

`AGENTS.md` (item 7) designates `main` and forbids task branches unless the owner
changes it; the owner's assignment explicitly requested this feature branch. The
branch is a fast-forward of `main` with no shared-history rewrites, so integrating it
into `main` later is a plain fast-forward. The master handoff's own history records
task-specific branches with PRs (for example `fix/consistent-ukrainian-glyph-weight-2026-11-12`),
which contradicts item 7 of `AGENTS.md`; the contradiction is recorded here and not
resolved — that is an owner decision.


---

# Third pass — UGTPHON error-pattern analysis (Korean → IPA)

Tool: `scripts/analyze_ugtphon_ko_errors.py` (reproducible; the Apache-2.0 corpus is
downloaded to a temporary directory and not stored in the repository) with a validity
test `tests/test_ugtphon_error_analysis_relaxation.py` (5 tests). Python runtime,
single-token, pinned corpus `ef0d5a09…`. This is a diagnostic against an external
narrower transcription, not a gold standard and not independent validation.

| Quantity | Value |
|---|---:|
| Scored tokens | 2,702 |
| Raw mismatched tokens (exact match 1,425 → 1,277 differ) | 1,277 |
| Still different after the documented equivalence table | 130 (4.8% of scored) |

**Raw confusions are dominated by notation, not phonology** (predicted → reference):
`l → ɭ` 543, missing `ʰ` 450 (the reference writes weak aspiration on `s`/`ɕ` and
fricative release such as `kx`/`kç`), `h → ɦ` 167, missing `ɕ` 198, `n → ɲ` 76.
The equivalence table in the script (lateral/h-region/palatalized allophones,
fricative-released aspiration read as aspiration, weak aspiration after fricatives)
is an **analysis choice, not a claim of phonological identity**; it never relaxes
aspiration on stops, fortis, voicing or `tɕʰ`. A first version of the table wrongly
erased the aspiration of the affricate `tɕʰ` (ㅊ); the new unit test caught it and the
table was corrected before any number was recorded.

**The 130 residual tokens** (top residual operations, predicted vs reference):

| Operation | Count | Reading |
|---|---:|---|
| `y` vs `ɥi` (ㅟ monophthong vs diphthong) | 38 | NIKL §4 [붙임] permits ㅚ/ㅟ as diphthongs; the engine emits the default monophthong. Variant, not an error |
| unreleased marker `̚` present vs absent | 34 | reference omits `̚`; project broad profile keeps it. Convention |
| `ɰ` present vs absent (non-initial 의) | 16 | NIKL §5 다만 4 permits non-initial 의 → [ㅣ] and particle 의 → [ㅔ]; the engine's default keeps `ɰi`. Variant |
| `l` vs `ɾ` | 12 | includes `장르` (below) and ㄹ-coda realization differences |
| vowel length `ː` | 9 | dictionary length marked by one side only |

The §4/§5 passages were checked verbatim in the local `한국어 어문 규범.htm`.

**Rule check on the productive §19/§20 liquid assimilations.** Of 23 distinct tokens
with a coda followed by an ㄹ-onset syllable, the engine's assimilated surface
(`논리 놀리`, `원래 월래`, `상류층 상뉴층`, `합리적 함니저기고`) agrees with the
reference in every case except notation differences, with one exception below.

**Single candidate real discrepancy — `장르`:** the engine applies §19 (ㅇ+ㄹ → ㅇㄴ)
and returns `장느` (`tɕaŋ.nɯ`); the reference shows the unassimilated `ŋɾɯ`. The
repository contains no source for the pronunciation of this loanword and the Korean
Standard Language Dictionary is not reachable from this environment, so **no lexical
entry or exception was added** (status BLOCKED on evidence, not a confirmed defect).
Acceptance criterion: a citable dictionary or norm entry for the exact word, a
regression test, and a lexical-row exception that does not narrow §19 for Sino-Korean
words.

Also unchanged by design and visible in the residual: `한국여자로` (the reference
applies ㄴ-insertion `[한궁녀자로]`; the engine, without a license, does not),
and multi-word tokens without spaces.

Ledger: **A1** UGTPHON error-pattern tooling — DONE_VERIFIED (script, unit test).
**A2** `장르` — BLOCKED (missing citable source). **A3** optional-variant exposure for
ㅟ/ㅚ diphthong and non-initial 의 (alternative readings) — TODO: the engine emits one
default reading; whether to expose NIKL-permitted alternatives in the IPA result is a
product decision not made here.
