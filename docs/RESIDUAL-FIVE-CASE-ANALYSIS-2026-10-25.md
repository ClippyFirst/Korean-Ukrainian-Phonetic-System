# Residual five Korean forms: evidence-gated resolution (2026-10-25)

This document records the current evidence, implemented candidate UI, and remaining acceptance gates for five residual forms. The goal is correct behavior, not forced output: source orthography → structure/morphology → source phonology → IPA → Ukrainian adaptation → practical Ukrainian orthography. No unsupported pronunciation or Ukrainian target is promoted to gold.

## Case ledger

| Input | Classification | Current behavior | Still unresolved |
|---|---|---|---|
| `칡칡이` | Source-index/PDF-text mismatch; lexical identity unknown | Offer `칭칭이` only as a source-specific, opt-in transcription candidate | Inspect the page image and cited print source/audio; do not infer `칡+칡+이` |
| `쫒아내면` | Likely orthographic typo | Offer `쫓아내면` as a candidate | User confirmation is required before pronunciation is attributed to the corrected form |
| `많앗구나유유유` | Orthography plus expressive-tokenization ambiguity | Keep three candidates separate | Original message context is needed to distinguish literal `유유유` from expressive `ㅠㅠㅠ` |
| `삶의` | Surface-variant IPA adjudication | Keep official Hangul variants as source evidence; two source-/candidate-blind IPA packets are ready | Two qualified independent IPA submissions, reconciliation, then separate Ukrainian-target review |
| `무서웟어` | Likely orthographic typo | Offer `무서웠어` as a candidate | User confirmation is required before pronunciation is attributed to the corrected form |

## Findings and evidence

### `칡칡이`: do not mistake an index snippet for the source text

The search-result snippet for the local-culture PDF labels `철마면 민요 26` as `칡칡이`. The opened PDF text layer at the corresponding passage instead reads `칭칭이`, with the refrain `치기타 칭칭나네`, singer/date/location metadata, and a citation to 이소라, *양산의 민요* (1992), p. 180. [Source PDF](https://www.busandabom.net/data/history/ebook/EB_culture_song02.pdf).

This discrepancy makes `칭칭이` a plausible source-specific transcription correction, not a proven replacement for every occurrence of `칡칡이`. A page screenshot could not be fetched in this session, so the exact glyphs still need visual verification. The source does not provide a lexical gloss or morpheme analysis for `칡칡이`; do not infer a `칡+칡+이` parse. The UI now offers `칭칭이` as a labelled candidate only, with the source link, and never applies it automatically.

### `쫒아내면` and `무서웟어`: correction is not pronunciation

The Korean Basic Dictionary supports standard `쫓아내다` and the corrected form `무서웠어`. The UI offers `쫓아내면` and `무서웠어` separately, with evidence links. The source input remains unchanged unless the user explicitly selects a candidate. The engine must not claim the corrected spelling's pronunciation as a transcription of the original typo.

### `많앗구나유유유`: two independent uncertainties

The candidates remain:

1. `많았구나유유유` — spelling candidate only;
2. `많았구나 ㅠㅠㅠ` — assumes the final sequence is expressive crying notation;
3. `많앗구나 유유유` — spacing/token-boundary hypothesis.

A published interview demonstrates that `ㅠㅠㅠ` can be used for tears and that `유유유` can occur as a phrase/title, but this contextual example does not resolve the user's isolated input. No candidate is gold; original context or user confirmation is needed.

### `삶의`: keep IPA and Ukrainian adaptation separate

NIKL MCFAQ 5716 reports Korean surface variants `[살믜]` and `[살메]`. Those are Hangul pronunciation representations, **not IPA**. The project queue is `research/salmui-ipa-review-queue.json`; coordinator-only source evidence is in `research/salmui-ipa-adjudication-coordinator.json`. The reviewer packets are:

- `research/ipa-review-packets/salmui-reviewer-A.json`
- `research/ipa-review-packets/salmui-reviewer-B.json`

They use the canonical source-/candidate-blind packet schema and are bound to the exact queue bytes by SHA-256 `c13b50fa336a81d94b82ad689195655cd2e2ca3b11843874c9d46ca2178cdfe3`. Each packet contains only opaque ID `BLIND-001`, the input `삶의`, fixed instructions, and blank review fields. Neither official surface variants nor source URLs are exposed to reviewers before their first-pass annotations.

The packets remain blank because no verified qualified reviewer identities or independent submissions are available in this session. Do not invent reviewer output. After both submissions arrive, reconcile IPA disagreements; only after IPA is frozen should Ukrainian adaptation be reviewed independently.

## Runtime and regression behavior

- The spelling panel appears only for exact, known noisy inputs; it does not silently normalize text.
- Each candidate has a distinct label/reason and evidence links where available.
- `칡칡이` offers only the source-specific `칭칭이` candidate; it does not claim the source has established a dictionary meaning or morphology.
- No new production pronunciation rule or accepted Ukrainian target is added for these cases.
- Regression tests cover candidate-only behavior, prototype-key safety, evidence scope, packet hash/blinding, and the separate Ukrainian-target gate.

## Acceptance gates

1. **`칡칡이`:** visually inspect the exact PDF page and obtain *양산의 민요* (1992), p. 180 or rights-cleared field audio/notes. Confirm whether the intended title is `칭칭이` or another form before any morphology claim.
2. **Orthographic candidates:** preserve the original by default; only the user-selected corrected spelling enters the normal pronunciation pipeline.
3. **`많앗구나유유유`:** obtain message context or user confirmation; do not map `유유유` to `ㅠㅠㅠ` automatically.
4. **`삶의` IPA:** obtain two qualified, independent blind annotations with method reference, broad IPA, syllable boundaries, vowel-length assessment, and uncertainty notes; reconcile only after both are submitted.
5. **Ukrainian target:** review separately after IPA is frozen; Korean surface evidence and accepted IPA are not Ukrainian-target gold.

The current PR is [#336](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/336). CI can verify code, data, build, and packet contracts; it cannot certify lexical interpretation or human IPA adjudication. The live NIKL inventory workflow remains skipped by configuration, not passed.
