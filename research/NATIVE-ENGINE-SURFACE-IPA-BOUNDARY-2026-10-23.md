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
