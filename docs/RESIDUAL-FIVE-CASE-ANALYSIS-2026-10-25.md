# Residual five Korean forms: evidence-gated resolution (2026-10-25)

This is the continuation/handoff for five residual forms. The target is correct behavior, not forced output: source orthography → structure/morphology → source phonology → IPA → Ukrainian adaptation → practical Ukrainian orthography. No unsupported pronunciation or Ukrainian target is promoted to gold.

## Task ledger

| Case/task | Status | Verified state | Acceptance gate |
|---|---|---|---|
| `칡칡이` source identity | PARTIAL / BLOCKED_SOURCE_VERIFICATION | Search-index title and extracted PDF text disagree; `칭칭이` is a source-specific candidate only | Visually inspect the page or inspect *양산의 민요* (1992), p. 180 / rights-cleared recording |
| `쫒아내면` spelling | DONE_VERIFIED for opt-in UI; linguistic attribution remains conditional | Suggests `쫓아내면`; original text remains unchanged until explicit selection | Keep candidate-only behavior; user confirmation is needed to treat corrected text as intended input |
| `무서웟어` spelling | DONE_VERIFIED for opt-in UI; linguistic attribution remains conditional | Suggests `무서웠어`; original text remains unchanged until explicit selection | Keep candidate-only behavior; user confirmation is needed to treat corrected text as intended input |
| `많앗구나유유유` segmentation/intent | PARTIAL / BLOCKED_CONTEXT | Three non-destructive candidates are available | Obtain original message context or user confirmation; never auto-map `유유유` to `ㅠㅠㅠ` |
| `삶의` broad IPA | PARTIAL / BLOCKED_SPECIALIST_REVIEW | Two source-/candidate-blind packets are generated and hash-bound; both submissions are blank | Two qualified, independent annotations with method references, syllable boundaries, vowel-length assessment and uncertainty |
| `삶의` Ukrainian adaptation | TODO / DEPENDENCY_BLOCKED | Separate review is explicitly gated after IPA reconciliation | Freeze/reconcile IPA first, then obtain a separate target-language review |
| Runtime, tests and artifacts | DONE_VERIFIED at commit `3031e7fcc7aee16fedc6f6537ad8a44aa17da972` | Exact-head workflows passed; details below | Re-run after any further code change |

## Findings and evidence

### `칡칡이`: source-index and PDF text-layer mismatch

The search-result snippet for the local-culture PDF labels `철마면 민요 26` as `칡칡이`. The extracted text layer at the corresponding passage instead reads `칭칭이`, with the refrain `치기타 칭칭나네`, singer/date/location metadata, and a citation to 이소라, *양산의 민요* (1992), p. 180. The same volume contains other `칭칭이` folk-song passages; another indexed passage cites *양산의 민요*, pp. 184–185, and includes the refrain `치아 칭칭나네`. This supports the interpretation of `칭칭이` as a folk-song/refrain label in this source family, but does **not** visually verify the exact heading at p. 180. [Source PDF](https://www.busandabom.net/data/history/ebook/EB_culture_song02.pdf).

The page screenshot could not be fetched in this session. Therefore `칭칭이` remains a plausible, source-specific transcription correction candidate—not a verified universal replacement for `칡칡이`. Neither lexical meaning nor morphology of the input `칡칡이` is established. Do not infer `칡+칡+이`, do not attach a pronunciation to the uncorrected input based on the candidate, and do not add a production rule. The UI exposes the candidate with an explanation and source link but never applies it automatically.

### `쫒아내면` and `무서웟어`: spelling correction is not pronunciation evidence

The Korean Basic Dictionary supports standard `쫓아내다` and the corrected spelling `무서웠어`. The UI offers `쫓아내면` and `무서웠어` separately. Original input remains intact unless the user selects a candidate. The corrected form may then enter the ordinary ClippyFirst pipeline; it must not be reported as a pronunciation of the uncorrected typo.

### \`많앗구나유유유\`: literal spelling must reach IPA unchanged

The UI may offer non-destructive spelling/tokenization candidates, but the transcription engine must not apply any of them automatically. The original input \`많앗구나유유유\` is the transcription source, including the written syllable \`앗\` and the tail \`유유유\`.

**Literal transcription rule (confirmed by the project owner, 2026-10-25):** derive and expose IPA from the exact written form, without changing \`앗\` to \`았\`, converting \`유유유\` to \`ㅠㅠㅠ\`, inserting a space, or deleting the tail. The engine may return a non-empty diagnostic/provisional IPA even while a contextual morphophonological rule remains unresolved. In that case it must label the IPA as diagnostic and keep the accepted Ukrainian target unavailable; it must not present the diagnostic string as independently adjudicated gold.

A published interview shows that \`ㅠㅠㅠ\` can mark tears and that \`유유유\` can occur as a phrase/title. Those examples establish contextual possibilities, not the intent of this isolated input. The hypothesis that the tail is expressive vocalization or transcription noise remains unconfirmed. Obtain the original message or adjacent turns before classifying its intent; this context requirement must not block a literal, uncertainty-labelled IPA rendering of the written input.

### `삶의`: Korean surface evidence, IPA, and Ukrainian adaptation are distinct

NIKL MCFAQ 5716 states that the genitive particle `의` has standard surface variants `[살믜]` and `[살메]` in `삶의`. These bracketed Hangul forms are **not IPA**. Official source: https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5716&mn_id=217&pageIndex=225.

The coordinator queue is `research/salmui-ipa-review-queue.json`; coordinator-only source evidence is in `research/salmui-ipa-adjudication-coordinator.json`. Blind packets:

- `research/ipa-review-packets/salmui-reviewer-A.json`
- `research/ipa-review-packets/salmui-reviewer-B.json`

Both use the canonical source-/candidate-blind packet schema and bind to queue SHA-256 `c13b50fa336a81d94b82ad689195655cd2e2ca3b11843874c9d46ca2178cdfe3`. Each packet contains only opaque ID `BLIND-001`, input `삶의`, fixed instructions and blank review fields. Neither official surface variants nor source URLs are exposed before first-pass annotations.

Both submissions remain blank because no verified qualified independent submissions are available in this session. Do not invent reviewer identities or output. After two submissions arrive, compare them and reconcile only after both independent first passes are frozen. The Ukrainian target must then be reviewed separately; neither a Korean surface citation nor an accepted IPA automatically validates the Ukrainian spelling.

## Runtime contract and regression behavior

- The spelling panel is shown only for exact, known noisy inputs; there is no silent normalization.
- Each suggestion has a distinct label/reason and evidence link where available.
- `칡칡이` offers only a source-specific `칭칭이` candidate and does not claim lexical meaning or morphology.
- No new production pronunciation rule or accepted Ukrainian target is added for these cases.
- Regression tests cover candidate-only behavior, prototype-key safety, source-evidence scope, blind-packet hash binding, and the separate Ukrainian-target review gate.

## Exact-head verification record

At commit `3031e7fcc7aee16fedc6f6537ad8a44aa17da972`:

- [Browser G2P integration run 40228232008](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40228232008): success; Node suite reported 1,258 passed, 0 failed; browser integration and build passed.
- [System verification run 40228232002](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40228232002): success; browser tests/build/page verification and Python regression/data-integrity passed.
- [Master table/corpus run 40228232001](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40228232001): success; master-table and strict-corpus generation passed.
- [Multi-version tests and wheel run 40228232017](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40228232017): success; Python 3.11, 3.12, 3.13 tests, web tests/build, wheel build and clean wheel installation all passed.
- The live NIKL inventory job is skipped by workflow configuration, not passed; previous direct runner access returned HTTP 403.

These are implementation/data/build checks, not linguistic adjudication.

## Acceptance gates and next actions

1. **`칡칡이`:** visually inspect the exact page and compare it with *양산의 민요* (1992), p. 180, or a rights-cleared recording/field note. Confirm the source form before making a lexical or morphology claim.
2. **Spelling candidates:** retain original text by default; only a user-selected correction enters the normal pronunciation pipeline.
3. **`많앗구나유유유`:** obtain context or explicit user confirmation; do not auto-map `유유유` to `ㅠㅠㅠ`.
4. **`삶의` IPA:** obtain two qualified, independent blind annotations; validate submissions, reconcile differences, and record uncertainty and the chosen broad-IPA convention.
5. **Ukrainian target:** after IPA is frozen, perform a separate target-language review; do not use the Korean surface notation as target gold.
6. **Release:** re-run exact-head CI after any code change. Until the source image/print evidence and independent specialist reviews are supplied, the project remains a tested research prototype / partial prototype, not scientifically release-ready.

Current PR: [#336](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/336). The next genuine blockers are external source verification, original user context, and independent qualified reviewers—not missing implementation of the candidate UI or blind-packet workflow.


## Repository text-fingerprint audit — 2026-10-25

Scope of this pass: existing repository text/data artifacts only. No PDF or audio discovery was performed.

### Confirmed repository footprint for `삶의`

- `data/korean/lexical_pronunciations.csv`, line 644, already contains the row `삶의,살믜,сал|мі,sal|mi,...`, with alternate fields `살메,сал|ме,sal|me` and status `provisional`.
- This is a repository-internal candidate footprint, not independent IPA evidence. The row's Ukrainian forms are also provisional and must not be treated as accepted targets.
- There is a real unresolved notation difference between the existing table's `sal|mi` and the residual triage candidate `sal.mɰi` for the Hangul surface notation `[살믜]`. Neither string is promoted here. The blind review must establish the broad-IPA convention and syllable boundary, and reconciliation must explicitly record whether the difference reflects notation, analysis, or an actual candidate error.
- The same CSV row contains `sal|me` / `сал|ме` as an alternative candidate. This too remains provisional until the source-/candidate-blind IPA review is complete and the Ukrainian adaptation is separately reviewed.

### Other checked text footprints

The following files were checked for the four unresolved input fingerprints and related variants: `README.md`, `index.html`, `system.html`, `data/korean/morphology-review-corpus.txt`, `tests/fixtures/adversarial-sentence-corpus.txt`, and `tests/fixtures/adversarial-sentence-corpus-3.txt`. No matches for `칡칡이`, `많앗구나유유유`, or `칭칭이` were found in those sampled service/corpus files; `삶의` was not found in those sampled page/fixture files. This is a bounded file-by-file check, not a claim that GitHub's repository-wide search index is exhaustive.

The residual-case research JSON, handoff, blind queue, coordinator, and two reviewer packets also contain the expected `삶의` workflow references. Both reviewer packets remain blank and source-/candidate-blind. These duplicated research references document the workflow; they do not constitute independent reviews.

### Action taken / gate

Keep the pre-existing lexical row intact as a provisional research artifact; do not promote it to runtime gold or overwrite it merely to match another candidate. The regression suite now guards that the row remains explicitly provisional and that the coordinator's final IPA and accepted Ukrainian target stay null until their separate gates are satisfied. Resolve the `sal|mi` versus `sal.mɰi` candidate discrepancy in the post-submission reconciliation record.


## Reviewer recruitment action — 2026-10-25

Created [issue #337: recruit two independent Korean phonetics reviewers](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/issues/337). It requests two qualified independent broad-IPA annotations and explicitly asks contributors not to post candidate transcriptions or source citations in the public issue. The coordinator now records the recruitment status. At the time of this update, no submissions have been received or verified, so the IPA and Ukrainian-target gates remain blocked. Recruitment is a genuine next step, not evidence that review has happened.


## External text-only search follow-up — 2026-10-25

This follow-up searched public text-index results for the unresolved forms and related terminology. It did **not** search for, open, or inspect PDFs or audio.

- **`칡칡이`:** the [National Gugak Center encyclopedia entry for 칭칭이소리](https://www.gugak.go.kr/ency/topic/view/947) identifies **칭칭이** as an alternate name for a Gyeongsang-do folk song. This independently confirms that the proposed candidate is a real folk-song label. It does not establish that the isolated input `칡칡이` refers to that song, nor does it verify the disputed heading in the previously noted source. Keep the correction source-specific and candidate-only.
- **`많앗구나유유유`:** exact-phrase searches for `많앗구나유유유`, `많았구나유유유`, and `많았구나 유유유` found no reliable indexed source for this particular string. Occurrences of `유유유` in unrelated contexts cannot determine whether this input is literal text, expressive spelling, or a tokenization issue. Context is still required.
- **`삶의`:** no independent text source was found that establishes a case-specific IPA gold form for `삶의` or the candidate string `sal.mɰi`. The official NIKL answer remains evidence for Hangul surface variants `[살믜]` and `[살메]`, not IPA. The CSV's `sal|mi` and `sal|me` candidates remain provisional and the notation discrepancy is unresolved.

### Search outcome

The text-only search improves provenance for the proposed `칭칭이` candidate but does not clear any linguistic acceptance gate. No source, IPA, or Ukrainian output has been promoted to gold. The next acceptance criteria remain source-identity confirmation for `칡칡이`, original context for `많앗구나유유유`, and two independent qualified IPA annotations followed by separate Ukrainian-target review for `삶의`.


### `많앗구나유유유`: revised hypothesis — expressive vocalization or transcription noise

The user's hypothesis that the tail may be noise-like material (comparable in function to a drawn-out “ууу” or an exclamation such as “ухти”) is linguistically plausible and is now the leading **working hypothesis**, not a confirmed parse.

Public text pages establish the general category, not this token:
- The Academy of Korean Studies' encyclopedia entry on [감탄사](https://encykorea.aks.ac.kr/Article/E0000867) includes affective interjections and filler-like/hesitation sounds (examples include `허`, `하하`, `에`, `후유`). This makes expressive or non-lexical material a legitimate analysis category; it does not classify `유유유`.
- A KCI-indexed study of [Korean listener-response expressions](https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001912604) describes short verbal and non-verbal responses, including expressive interjections, laughter and tongue-clicking.
- An [NIKL spoken-corpus annotation report](https://www.korean.go.kr/common/download.do%3Bfront%3D502A18DED158F4EE2EB44635ECE7B987?c_file_name=d0d8ab58-23ac-41ce-9bd5-405970002d1c_0.pdf&file_path=reportData&o_file_name=%EA%B5%AC%EB%AC%B8+%EB%B0%8F+%EB%AC%B4%ED%98%95+%EB%8C%80%EC%9A%A9%EC%96%B4+%EB%B3%B5%EC%9B%90+%EB%A7%90%EB%AD%89%EC%B9%98+%EC%97%B0%EA%B5%AC+%EB%B6%84%EC%84%9D_%EC%B5%9C%EC%A2%85%EB%B3%B4%EA%B3%A0%EC%84%9C.pdf) has a dedicated section on interjection annotation and warns that spoken forms require contextual analysis.

**Inference:** do not force `유유유` into a lexical/morphological analysis or auto-convert it to `ㅠㅠㅠ`. Treat “expressive vocalization / filler / transcription artifact” as the leading hypothesis while preserving the raw string. This is still a hypothesis because no source identifies the exact utterance. The best next evidence is the original audio/message or neighboring turns; without it, abstain from assigning phonology or Ukrainian output.

The other UI candidates remain non-destructive alternatives for now. This follow-up changes the interpretation recorded in the research triage, not the strict production engine's accepted output.
