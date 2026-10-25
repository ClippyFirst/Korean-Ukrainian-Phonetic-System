# Residual five Korean forms: evidence-gated resolution map (2026-10-25)

This continuation turns the existing five-item abstention register into an actionable, typed candidate map. It deliberately does **not** turn unsupported analyses into production pronunciations. The machine-readable companion is `research/residual-five-candidate-resolution-2026-10-25.json`; regression guards are in `tests/test_residual_five_candidate_resolution.py`.

## Findings and relationships

| Input | Actual problem class | Safe result now | What must not happen |
|---|---|---|---|
| `칡칡이` | Unknown lexical identity and morpheme boundary | Abstain; no invented candidate | Treat final `이` as a particle/suffix just because of its position |
| `쫒아내면` | Likely consonant typo in a known lexeme | Candidate `쫓아내면`, clearly labelled as spelling assistance | Claim the candidate's pronunciation is the literal pronunciation of `쫒아내면` |
| `많앗구나유유유` | At least two independent uncertainties: `앗/았` spelling and final `유유유/ㅠㅠㅠ` interpretation | Preserve three separate candidates for review | Conflate spelling repair with tokenization, or read expressive `ㅠㅠㅠ` as ordinary lexical syllables without evidence |
| `삶의` | Two officially reported Korean surface variants, but no independent project IPA gold | Keep two provisional IPA candidates: `sal.mɰi` for `[살믜]`, and `sal.me` for `[살메]` | Collapse the alternatives to one pronunciation or accept a Ukrainian target before independent review |
| `무서웟어` | Likely spelling typo `웟/웠` | Candidate `무서웠어`, clearly labelled as spelling assistance | Silently rewrite source spelling or claim corrected-form pronunciation is literal output for the original |

### Why these cases are related but not interchangeable

Three cases contain likely orthographic or tokenization noise, but only two have a narrow plausible correction supported by a dictionary example/entry. `많앗구나유유유` is not just another typo: the tail may be literal text or expressive crying notation, so both segmentation and spelling are uncertain. The final `이` in `칡칡이` is not enough to infer a morphological boundary. `삶의` is different again: the spelling is not the issue; the authoritative Korean source explicitly allows two surface readings, while independent IPA and Ukrainian-target review are still missing.

## Evidence and confidence boundary

- For `쫒아내면`, the Korean Basic Dictionary entry for `쫓아내다` supports the standard lexeme and the surface form `[쪼차내다]`. It does not establish that the misspelled input should be rewritten without notice.
- For `많앗구나유유유`, the cited NIKL answer contains `많았구나` in a quotation. That supports the standard spelling as a candidate only; it does not settle the intended tail.
- For `삶의`, NIKL MCFAQ 5716 reports `[살믜]` or `[살메]`. These are official Hangul pronunciation representations, **not IPA labels**. The listed IPA strings remain provisional broad candidates pending two independent blind reviews.
- For `무서웟어`, the Korean Basic Dictionary attests `무서웠어` in an example. It does not license silent normalization.
- For `칡칡이`, no exact lexical/morphological source is recorded. The correct current action is abstention, not a guessed segmentation.

## Runtime decision

No production pronunciation rule or accepted Ukrainian target is changed in this batch. This is intentional: the browser and native engines must preserve the pipeline

`original orthography → structural/morphological analysis → source phonology → IPA candidate(s) → Ukrainian adaptation → Ukrainian practical orthography`.

Spelling candidates remain outside that pronunciation pipeline until the user explicitly selects one. IPA candidates for `삶의` are diagnostic, not gold; Ukrainian target acceptance requires a separate review after IPA is frozen.

## Acceptance gates

1. **Spelling assistance:** if/when integrated into the UI, show correction candidates separately, preserve the original input, and label that pronunciation applies to the selected corrected form only.
2. **Expressive tail:** resolve `많앗구나유유유` only with context or user confirmation; do not automatically map `유유유` to `ㅠㅠㅠ`.
3. **Lexical/morphological analysis:** obtain an exact dictionary or contextual corpus source for `칡칡이`, establish segmentation, and test a negative control.
4. **Independent IPA:** two qualified reviewers annotate `삶의` blindly for broad IPA, syllable boundary, and variant status; reconcile disagreements.
5. **Ukrainian target:** review separately on the frozen IPA candidate(s); do not infer target correctness from Korean surface spelling or successful code tests.

The accompanying tests validate these evidence/status boundaries only. They do not certify linguistic accuracy or replace reviewer annotation.
