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


## Follow-up evidence and integration (2026-10-25)

### `칡칡이`: exact attestation found, morphology still unresolved

A local-culture PDF lists `칡칡이` as the heading for `철마면 민요 26`, with a singer, recording date/location, and a bibliographic pointer to 이소라, *양산의 민요* (1992), p. 180: [source PDF](https://www.busandabom.net/data/history/ebook/EB_culture_song02.pdf). This is an exact attestation of the string as a regional folk-song title. It is **not** a lexical definition and does not identify morpheme boundaries. The cited 1992 source/page or rights-cleared field notes are still needed to determine whether the title is lexicalized, dialectal, onomatopoeic/refrain-like, or opaque. Strict mode remains blocked; no `칡+칡+이` segmentation is inferred.

### `많앗구나유유유`: external usage confirms ambiguity, not intent

A published interview explains `ㅠㅠㅠ` as tears while separately discussing `유유유` as a title/phrase meaning “you you you”: [interview](https://v.daum.net/v/JU0MXB4lYJ). That is evidence that these strings can have distinct readings in different contexts. It cannot tell us which reading was intended in this isolated input, so the three candidate forms remain distinct and no one is promoted to gold.

### Explicit UI spelling assistance

The service now has a separate candidate panel for `쫒아내면`, `무서웟어`, and the three interpretations of `많앗구나유유유`. The original is never normalized on input. A candidate is applied only after the user presses its button, at which point the ordinary conversion pipeline receives the selected spelling. `칡칡이` deliberately has no correction suggestion; `삶의` is not an orthographic correction case.

### `삶의`: source-blind packets are prepared, not adjudicated

Two separate blank packets are staged:

- `research/ipa-review-packets/salmui-reviewer-A.json`
- `research/ipa-review-packets/salmui-reviewer-B.json`

They expose only the Hangul input and fixed review instructions; they do not expose the NIKL Hangul comparator, source URL, engine output, candidate IPA, or each other's annotations. The coordinator record is `research/salmui-ipa-adjudication-coordinator.json`. Both reviewers' fields remain empty because this session has no verified identities/qualifications or submitted independent annotations. Filling them with generated guesses would falsely claim human adjudication.

The target-layer gate remains separate and blocked until two qualified reviewers submit IPA annotations, disagreements are reconciled, and the IPA is frozen. Only then should a separate Ukrainian adaptation review record candidate targets, reader/reviewer evidence, and an accepted target if justified.


### Verification record

The predecessor branch `fix/residual-korean-edge-cases-2026-10-25` passed the relevant Node, Python, browser/build, corpus-generation, and wheel checks on commit `1e2288293c63e88dbb8150270e7910e625b3c48c` (runs 40227008756, 40227008757, 40227008762, and 40227008739). This branch additionally layers on the repository's canonical source-and-candidate-blind packet builder from PR #329 and replaces the earlier custom packet format with packets bound to the one-case queue. Fresh exact-head CI is required for this stacked branch.

An earlier CI attempt exposed an inherited-object-key lookup crash and stale source-register test expectations. The lookup now uses an own-property check, and the source-register test expectations account for the two new sources as manual rights review. Those fixes passed on the predecessor branch; the current branch's fresh CI remains the acceptance gate.

The live NIKL source inventory job is skipped by workflow configuration; this is not evidence of a new live source crawl. CI validates code/data contracts, not reviewer expertise or IPA correctness.
