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
