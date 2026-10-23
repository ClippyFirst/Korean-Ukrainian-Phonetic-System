# Native research-engine surface boundary — 2026-10-23

## Task and observed gap

The native Python research engine already applies ordered Korean phonological rules and sourced lexical surface entries before generating IPA. However, its returned `surface_syllables` deliberately retain each source syllable in `text` while mutating the onset/nucleus/coda fields. There was no single explicit, recomposed Hangul surface string in the native result. This made the orthography → surface pronunciation → IPA boundary harder to inspect and independently test.

## Change

- Added a native-only renderer that composes each syllable from its current onset, nucleus, and coda feature fields.
- Added `surface_hangul` and an explicit `surface_status` to `phoneticize_korean` results.
- Added regression cases for NIKL-attested surface spellings `값어치 → 가버치`, `넓죽하다 → 넙쭈카다`, `넓둥글다 → 넙뚱글다`, `읽고 → 일꼬`, and `넋이 → 넉씨`.
- Added a rule-only regression for `넓적하다 → 넙쩌카다` and a whitespace-boundary regression.
- The implementation does not call the JavaScript g2pK port and does not create Hangul-to-Ukrainian substitutions. The IPA and Ukrainian target remain distinct downstream stages.

## Evidence and interpretation

The five lexical surface expectations are present in the project's Korean pronunciation evidence register. The tests assert the native runtime's surface-form contract and IPA syllable alignment only; they do **not** turn provisional IPA strings or Ukrainian spellings into independently adjudicated gold labels.

## Acceptance status

- Implementation: **DONE_VERIFIED and merged** as `6df6a5d2e5d8a472ce7b8ceee7365b57451ccfcd` via PR #255. Final PR head: `6ed03a0f5c5b26c0afb8764a6dfc94eaf8eadc36`.
- Native Python test execution in this session: **not run locally**; repository access here is through the GitHub API, not a local checkout. Remote CI passed Python 3.11, 3.12, and 3.13, plus the browser/build and system-verification jobs.
- Exact-head CI: tests/build/Python 3.11–3.13 passed [run 39966776804](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39966776804); system verification passed [run 39966776820](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39966776820); generated corpus artifacts passed [run 39966776813](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39966776813). Optional g2pK integration passed [run 39966776801](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39966776801); it is not the implementation target of this change. The optional live NIKL inventory was skipped and is not claimed as passed.
- Scientific release blockers remain: independent IPA gold, independent Ukrainian adaptation review, full normative rule/subparagraph coverage, licensing, and reproducible permitted access to all primary sources.

## Scope boundary

This batch is specifically for the **native research engine** in `src/korean_ukrainian/`. It does not modify `src/app/g2pk_web.js`, the vendored JS g2pK port, or the practical browser-mode correction table.


## Follow-up: preserve IPA modifiers at the target-adapter boundary — 2026-10-23

### Defect addressed

The previous `tokenize_ipa` skipped the length mark `ː` as if it were punctuation. Thus an evidence-backed long vowel (for example `ɰiː` in a lexical IPA row) entered Ukrainian candidate analysis as plain `i` with no audit trace that length had been present. Unsupported combining modifiers could also be skipped only if they happened to be among the explicitly ignored characters; this is not an acceptable research boundary.

### Change on branch `research/native-ipa-length-preservation-2026-10-23`

- Added `tokenize_ipa_with_modifiers`, returning segment tokens with explicit `long` and `unreleased` metadata.
- Kept `tokenize_ipa` as a compatibility wrapper returning segment strings.
- `map_ipa_to_ukrainian` now exposes `source_length`, `source_diacritics`, and `length_adaptation_status` for every source segment.
- Length is **preserved as source analysis metadata**, not claimed to be represented in Ukrainian spelling or fed into candidate ranking. This makes the unresolved target-language treatment explicit instead of silently erasing source information.
- Unsupported IPA symbols/modifiers and misplaced length marks fail closed with a `ValueError`.

### Acceptance and limitations

- Implementation committed on the dedicated branch; tests added for long-vowel metadata, compatibility tokenization, invalid length placement, unknown modifiers, and adapter-boundary reporting.
- Local test execution is unavailable through the current GitHub API-only environment. The new tests are not marked passed until CI runs on this exact branch/PR head.
- This is a bounded correctness improvement, not a claim of full IPA coverage or complete Ukrainian length adaptation. The IPA inventory remains deliberately finite; additional symbols require explicit, tested handling.


### Registry-wide audit finding

A one-off scan of all 642 lexical rows found two IPA values using ASCII `r` rather than the repository's intended IPA flap `ɾ`: `발음과` (`pa|rɯm|ɡwa`) and `발음의` (`pa|rɯ|mi`). Both were corrected to `ɾ`. The Korean surface spellings and Ukrainian target reference fields were not changed. A new regression now tokenizes every non-empty lexical IPA syllable through the same fail-closed adapter parser, so unsupported IPA symbols cannot remain hidden in untested dictionary rows.

This is a syntactic/inventory compatibility check, **not** independent adjudication that every lexical IPA transcription is phonetically correct.


### CI-driven correction to length parsing

The registry-wide regression initially failed on 12 valid entries such as `anː`, `toŋː`, and `samː`: in this dataset's syllable notation, the length mark can follow the coda even though it marks the vowel. The parser was corrected to associate `ː` with the last supported vowel in the same syllable, while still rejecting a length mark in a syllable with no preceding vowel. The same CI run also exposed the active overlay copy of `발음과` in `lexical_additions_2026-10-15.csv`; that duplicate was corrected alongside the base lexicon row. The all-lexicon parser test remains enabled to guard both base and overlay data.


## Final verification for IPA modifier-preservation batch

- PR: [#257](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/257), merged by squash.
- Squash commit: `6b2ebf9826f48084b738020f73b819ccb689f958`.
- Tested PR head: `eee3a29b7ddabb57a1ea5dde1b2a50cafda37d7f`.
- CI passed on that exact PR head:
  - Python test matrix (3.11, 3.12, 3.13) and web tests/build: [run 39970762976](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39970762976).
  - System verification: [run 39970762800](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39970762800). Browser regression/build and Python regression/data integrity passed; optional live NIKL source inventory was skipped.
  - Generated master table and strict corpus artifacts: [run 39970762941](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39970762941).
  - Browser G2P integration: [run 39970762844](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39970762844).
  - Optional g2pK integration on supported Python versions: [run 39970762886](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39970762886).
- The registry-wide IPA test first failed for real data/parser issues, then passed after correcting post-coda length association and the active `발음과` overlay row. This failure-and-fix is retained as evidence that the new gate catches issues that narrower tests missed.
- Local tests were not run in this session; CI is the execution evidence.
- This batch improves IPA-boundary integrity but does not establish independent IPA gold, independent Ukrainian target gold, complete NIKL rule coverage, or source-license closure.


## Follow-up: strict IPA modifier placement — 2026-10-23

### Defect addressed

The first modifier-preservation implementation retained `ː` and `̚`, but its parser could still accept malformed inputs: repeated length/unreleased markers, an unreleased-stop diacritic after a vowel or nasal, or a diacritic immediately after a syllable separator that accidentally attached to the preceding syllable's last token.

### Change

- A length marker may occur only once per syllable; duplicates fail closed.
- The unreleased-stop diacritic must immediately follow a supported stop token in the same syllable.
- It cannot attach across `.`, whitespace, or other syllable boundaries; it cannot attach to a vowel or sonorant; duplicates fail closed.
- Added explicit tests for valid `k̚`, invalid `a̚`, `m̚`, boundary-separated modifiers, and duplicate modifiers.
- The registry-wide lexical IPA compatibility test remains enabled.

### Verification gate

This is on branch `research/native-ipa-modifier-boundaries-2026-10-23`. It is not considered verified until CI passes on the exact PR head. Local test execution is unavailable in the GitHub API-only session. This change validates modifier syntax/attachment, not the phonetic truth of each lexical transcription.


### Registry audit hardening

The registry gate now reads the raw base CSV **and every** `lexical_additions_*.csv` file, rather than only the merged in-memory dictionary. This matters because overlay rows can hide earlier rows for the same key. It checks primary and alternate IPA forms, rejects missing primary IPA and empty IPA syllables, verifies IPA-to-surface syllable counts, and parses each syllable through the strict modifier-aware tokenizer. This remains a syntax/alignment gate, not an independent phonetic gold standard.


### CI-driven alternate-form correction

The expanded raw-registry test found one additional error that the previous merged-lexicon check could not see: `발음의` had correct primary IPA but its alternate form `pa|rɯ|me` used ASCII `r`. Corrected the alternate to `pa|ɾɯ|me`. A raw-file scan of primary and alternate IPA columns found no other ASCII-`r` occurrences in the base lexicon and the active `lexical_additions_2026-10-15.csv` overlay. The full CI suite must rerun on the corrected head.


### Cross-runtime regression fixture correction

After the alternate IPA was corrected, CI exposed one stale JavaScript test fixture asserting the former malformed ASCII-`r` string. Updated that fixture to expect the corrected IPA flap `ɾ`. This is a test-only parity adjustment for the shared lexical data; the practical JS transcription implementation itself was not changed.
