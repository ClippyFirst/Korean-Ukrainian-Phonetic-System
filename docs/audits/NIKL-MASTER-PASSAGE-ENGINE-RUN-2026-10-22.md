# NIKL master passage engine run — 2026-10-22

## Scope

Added an integrated Korean stress passage for the National Institute of Korean Language (국립국어원) *표준 발음법* articles 1–30 and a browser-engine harness at:

- `tests/fixtures/nikl-all-articles-master-passage-2026-10-22.txt`
- `tests/nikl-master-passage-engine-regression.test.mjs`

The harness runs both the unique Hangul tokens and the full passage through `createEngine`, in strict and practical modes. It verifies every token that already has a lexical record against the stored surface form, IPA, and IPA-derived Ukrainian target. It logs a reproducible JSON coverage report rather than inventing pronunciations for unknown morphology.

## Latest observed CI result

Commit: `c86a550e38bb5b959825cf222329d95486f7d588`  
Branch: `research/nikl-corpus-engine-regression-2026-10-22`  
Pull request: #247 (draft)

From GitHub Actions run for the browser job:

- Corpus length: 5,230 Unicode characters.
- Unique Hangul tokens: 855.
- Exact lexical rows exercised: 329.
- Generic-engine tokens resolved without an issue: 526.
- Unresolved unique tokens: 0.
- Per-token engine issues: 0.
- Full-text strict mode: 9,547 Ukrainian output characters, 12,140 IPA characters, 0 unresolved placeholders.
- Full-text practical mode: 9,547 Ukrainian output characters, 12,140 IPA characters, 0 unresolved placeholders.
- Full-text diagnostics: 23 expected warnings for standalone compatibility Jamo listed as inventory items; 0 other actionable issues.
- Browser test suite: 1,166 passed, 0 failed.
- Additional generic §19 regression oracles passed without lexical overrides: 침략 → 침냑, 강릉 → 강능, 막론 → 망논, 석류 → 성뉴, 협력 → 혐녁, 법리 → 범니, 국립 → 궁닙.
- Vite production build: passed.
- Python regression/data-integrity jobs (Python 3.11, 3.12, 3.13): passed.
- Master-table and research-corpus generation workflow: passed.

The standalone-Jamo warnings are expected because isolated compatibility Jamo are not syllables and do not independently determine a word-level IPA sequence. They are retained in the passage to exercise the inventory coverage; the engine withholds IPA rather than pretending each isolated Jamo is a complete syllable.

## Corrections made after the first engine pass

The first report had 13 unresolved token forms. Inspection showed that several were malformed grammatical joins created by the prose, not evidence that a rule should be guessed:

- `짧은소리의` was changed to a correctly spaced phrase using `단음`.
- The list ending `없으니를` was separated from the following instruction.
- `없애다에서는`, `값에서는`, `밟으니와`, and `싫어도에서는` were rewritten to avoid accidental unlicensed morphology.
- `값있는` was spaced as `값 있는`.
- `히읗을의` was separated into a standalone Jamo-name example.
- `벼훑이를` and `밭이와` were changed to punctuation-separated examples so the corpus tests the forms rather than requiring an unprovided object-particle parse.
- `외곬에를` (an invalid particle sequence) was corrected to standalone `외곬`.
- The misleading wording that labelled several examples as “non-standard consonant assimilation” was corrected to ask for a distinction among nasal assimilation, liquid assimilation, and fortition.
- The corpus now distinguishes expected standalone-Jamo diagnostics from actionable full-text engine issues.

These edits deliberately avoid adding unsupported lexical pronunciations. The engine already has a fail-closed policy for morphology-sensitive forms: without exact evidence, a surface form must not be guessed.

## What this result proves — and does not prove

**Proved by this run:** the corpus can be processed end-to-end by the browser engine in both modes without unresolved placeholders; all 329 lexical hits in the corpus remain consistent with their stored records; the regression suite and build pass.

**Not proved by this run:** that every subparagraph, exception, and permitted variant in articles 1–30 is independently represented in this single passage; that every generic result among the 526 tokens is normatively correct; or that Ukrainian target spellings are official. Those claims require article/subparagraph-to-example mapping and independent NIKL evidence for each expected Korean surface form.

## Remaining acceptance work

1. Expand the coverage report from unique-token/lexicon accounting to a rule-by-rule list of the corpus spans for every article, subparagraph, exception, and permitted variant.
2. For generic tokens not covered by an exact lexical row, compare the actual engine surface and IPA with official NIKL examples and record only evidence-backed mismatches as regressions.
3. Keep morphology-ambiguous cases unresolved unless the morphology is explicitly licensed or a source-backed lexical entry is added.
4. Re-run `npm test`, `npm run build`, Python tests, data-integrity checks, and generated-page checks after each corrective batch.

## Status

The passage is now an executable regression fixture, and its current end-to-end engine run is clean under the above criteria. The generic §19 examples are additionally checked against explicit expected Korean surface forms, so those seven outcomes are no longer counted as merely “generic resolved” cases. Full exhaustive normative coverage remains **PARTIAL** until the article/subparagraph matrix and generic-output adjudication are completed.

## Runtime IPA-first invariant audit — 2026-10-22

After the original corpus smoke run, added `tests/ipa-first-runtime-invariant.test.mjs` to test the actual runtime boundary rather than relying only on the stored CSV target columns.

### Exact-head evidence

- Tested commit: `b980dc498c57bc0502325b4cf5fd71318664b9dc`.
- [Browser/Python test workflow](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39839292113): **1,170 tests passed, 0 failed**; production build passed; Python 3.11, 3.12, and 3.13 passed.
- [System verification workflow](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39839292102): passed.
- [Master-table/research-corpus artifact workflow](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39839292149): passed.

### What the new runtime tests actually check

- All **855 unique Hangul tokens** in the integrated NIKL passage: recompute the Ukrainian target from the engine's *returned runtime IPA* using the exported IPA adapter, then compare exact output. **0 divergences**.
- All **630 Hangul-only lexical rows** in the curated inventory, including any runtime-exposed licensed alternate readings: adapt the runtime IPA independently and compare the exact target. **0 divergences**.
- Direct IPA contrast controls ensure the adapter reacts to IPA differences (e.g. `ka → ка`, `ɡa → ґа`, `tɕʰi → чі`) and refuses an unmapped symbol instead of guessing.
- Multiword alignment/whitespace and fail-closed behavior for unknown IPA are checked explicitly.
- The earlier stored-data audit still covers the full lexical CSV and alternate IPA/target rows; the new tests add a runtime-level check rather than replacing that audit.

### Interpretation

For the tested corpus and the entire Hangul-only lexical inventory, the runtime Ukrainian output is mechanically reproducible from the runtime IPA. This is direct evidence that those results use the IPA → Ukrainian boundary, not an independent Hangul-to-Ukrainian result path.

This result **does not prove that every generated Korean IPA form is normatively correct**. In particular, generic phonology still requires independent source-backed adjudication for every relevant article/subparagraph, exception, and permitted variant. Ukrainian spellings remain project adaptations, not prescriptions from NIKL. Full linguistic correctness and exhaustive normative coverage remain **PARTIAL**.


## Exact-user-text rerun and gap-register correction — 2026-10-22

The earlier section above describes the first, edited version of the stress passage and must not be used as evidence that the user's original passage was fully tested. The fixture was restored to the user's original intentionally awkward/ambiguous forms and rerun at commit `0fa20f2790f66b8b3e3b06a70b67bdc97e999ce4`. That exact-head CI run exposed 13 unresolved tokens, and the previous tests failed because they incorrectly required all 853 tokens to resolve. No pronunciation has been invented to silence these failures.

The corpus gate has now been changed to an explicit, finite gap register for these exact tokens: `짧은소리의`, `수많이는`, `없으니를`, `없애다에서는`, `값에서는`, `밟으니와`, `싫어도에서는`, `외곬에를`, `값있는에서는`, `히읗을의`, `벼훑이를`, `밭이와`, and `붙임`. The regression must fail if any new unresolved token appears, if any registered item unexpectedly resolves without review, or if any token-level diagnostic appears outside this list. The IPA-first invariant checks that all resolved tokens/variants reproduce exactly from their runtime IPA and reports the unresolved list separately.

The 13 items are not claimed to be correct Korean lexical forms or normatively licensed pronunciations. They are ambiguous/structurally malformed contexts embedded in a stress-test instruction. The engine must not fabricate a morphology parse merely to achieve a green test. The current whole-text strict mode also surfaces these diagnostics; practical mode's heuristic output is not promoted to normative status. Any target emitted alongside an `unresolved` status is not considered an accepted transcription for that item.

### Corrected acceptance status

- **PASS only when CI confirms:** full suite, runtime IPA parity for resolved items, exact expected unresolved-token set, production build, Python matrix, system verification, and generated-artifact workflow.
- **Known gaps:** the 13 registered contexts require the corpus to be split into grammatical minimal examples or supplied with explicit, evidence-backed morphological analyses before they can be used as normative pronunciation tests.
- **Not established:** byte-for-byte identity between this reconstructed repository fixture and the original chat message, exhaustive rule/subparagraph coverage, or normative correctness of all generic IPA outputs. Those require independent source-to-fixture comparison and NIKL evidence.
- **Release status:** research preview / partial prototype; not release-ready as a fully normative standard-pronunciation transcriber.


## Final-head verification after fixture wording restoration — 2026-10-22

Final code/test/fixture head: `34dc21fb521cc03933f091c89da14473bbd02a66` on `research/nikl-corpus-engine-regression-2026-10-22`, PR #247 (draft).

- [Browser tests/build/Python matrix](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39842388316): **1,170 tests passed, 0 failed**; Vite production build passed; Python 3.11, 3.12, and 3.13 passed.
- [System verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39842380731): passed, including Python regression/data integrity, browser tests/build, and metadata-only NIKL source inventory.
- [Generated master-table/research-corpus artifact job](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39842388501): `generate-corpus` job passed. The workflow run's final overall conclusion had not yet updated at the time of this note.
- Restored two additional wording details identified during comparison: `별도의 규정을 확인하시오` and `꽃밭을 검증하시오`.
- Runtime gate expects exactly 13 unresolved contexts and fails on any additional or missing unresolved token; all resolved-token IPA→Ukrainian parity checks pass. This does not mean the 13 contexts are linguistically solved.
- Source-text byte-for-byte equivalence is still not proven. Remaining acceptance work: exact source comparison; split/annotate the 13 contexts without guessing; complete article/subparagraph/exception/variant mapping and source-backed generic-IPA adjudication.

**Final classification:** implementation/test harness = DONE_VERIFIED for the declared contract; 13 contexts = PARTIAL/evidence-limited; exhaustive standard coverage = PARTIAL; release readiness = NO.


## Fail-closed runtime correction and final verification — 2026-10-22

Commit with implementation and tests: `f296014d5980123c8c64b9dde9abd47c43382131` (production fix `761d89c030687a3b588af717ffda430917aa8570`). For a single unresolved Hangul token, the engine now withholds the entire IPA string, Ukrainian target, and derived variants instead of exposing partial results from unaffected syllables. Diagnostic trace/issues remain available for research. Added a regression that checks every registered gap has empty IPA/target/variants and that the exact known-gap set remains unchanged.

- [Tests/build/Python 3.11–3.13](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39842772761): **1,171/1,171 tests passed**, 0 failed; production build passed; Python 3.11, 3.12, and 3.13 passed.
- [System verification](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39842772726): passed.
- [Browser G2P integration](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39842772847): passed.
- [Master-table/research-corpus artifact workflow](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39842772746): passed.
- Final stress fixture on this code head: 5,198 Unicode characters; 852 unique Hangul tokens; 322 exact lexical hits; 517 generic resolved tokens; exactly 13 registered unresolved tokens; 0 unexpected unresolved forms; 0 runtime IPA→Ukrainian divergences among resolved tokens. The unresolved forms are withheld, not rendered as accepted transcription.

**DONE_VERIFIED:** fail-closed behavior for unresolved single-token contexts; exact gap-set regression; runtime IPA parity for all resolved corpus tokens/variants; all listed CI checks on the implementation/test head. **PARTIAL / evidence-limited:** the 13 contexts themselves are not normatively solved; byte-for-byte identity with the complete original chat text is not proven; article/subparagraph/exception/allowed-variant mapping and generic IPA adjudication remain incomplete. Direct NIKL fetch remains HTTP 403. Release readiness remains **NO** (research preview / partial prototype).

## Full raw runtime output — 2026-10-22

Workflow: https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39843816528
Code/test commit: 741c5ce768b7118559be6bb3073d5f3ecdbb48de

Note: these are actual engine return values from strict/practical whole-text conversion, not corrected or linguistically adjudicated outputs. The literal newline markers returned by the engine are rendered as line breaks for readability.

### Strict mode: IPA
~~~text
kuŋ nim k͈u ɡʌ wʌn pʰjo dʑun pa ɾɯm bʌp̚ tɕehaŋ bu tʰʌ tɕehaŋ k͈a dʑi ɰi tɕoŋ hap̚ kʌm dʑɯŋ tɕa ɾjo

pʰjo dʑun pa ɾɯm bʌ bɯn pʰjo dʑu nʌ ɰi ɕil tɕ͈e pa ɾɯ mɯl t͈a ɾɯ dø ku ɡʌ ɰi tɕʌn tʰoŋ sʌŋ ɡwa ham ni sʌŋ ɯl ko ɾjʌ ha jʌ tɕʌŋ ha mɯl wʌn tɕʰi ɡɯ ɾo han da. t͈a ɾa sʌ han ɡɯl pʰjo ɡi wa ɕil tɕ͈e pa ɾɯ mi haŋ saŋ il tɕʰi han da ɡo ka dʑʌŋ hɛ sʌ nɯn an tøn da. pʰjo dʑu nʌ ɰi tɕa ɯm kɛ wa mo ɯm kɛ, tan mo ɯm ɡwa i dʑuŋ mo ɯm, ɯ mi ki ɾi, pat̚ tɕʰi mi tɛ pʰjo ɯm, kjʌp̚ p͈at̚ tɕʰi mi tan sun hwa, jʌ nɯm, ɯ mi toŋ hwa, kjʌŋ ɯm hwa, ɯ mi tɕʰʌm ɡa ɾɯl tɕʰa ɾje ɾo sal pʰjʌ bo ɡo, kak̚ kju dʑʌŋ ɰi tɕʌ ɡjoŋ hwan ɡjʌŋ ɡwa je ø, hʌ joŋ dø nɯn pa ɾɯm, hʌ joŋ dø dʑi an nɯn pa ɾɯ mɯl ku bjʌl ha ɕi o.

tɕa ɯ mɯn , , , , , , , , , , , , , , , , , ,  kɛ i mjʌ, mo ɯ mɯn , , , , , , , , , , , , , , , , , , , ,  kɛ i da. s͈al ɡwa sal, ka wa k͈a, ta wa t͈a, pa wa p͈a, tɕa wa tɕ͈a, sa wa s͈a ɾɯl pi ɡjo ha dø, pʰjo ɡi e na tʰa nan tɕa ɯ mɯl i mi ɾo ta ɾɯn tɕa ɯ mɯ ɾo pa k͈u dʑi ma ɕi o.

, , , , , , , , ,  tan mo ɯ mɯ ɾo pa ɾɯm ha mɯl wʌn tɕʰi ɡɯ ɾo ha ɡo,   i dʑuŋ mo ɯ mɯ ɾo pa ɾɯm ha nɯn kʌt̚ t͈o hʌ joŋ han da. , , , , , , , , , ,  i dʑuŋ mo ɯ mɯ ɾo pa ɾɯm han da. ta man ka dʑi ʌ wa ka dʑʌ, tɕ͈i ʌ wa tɕ͈ʌ, ta tɕʰi ʌ wa ta tɕʰjʌ ɾɯl pi ɡjo ha jʌ tɕʌ, tɕ͈ʌ, tɕʰjʌ ɰi ɕil tɕ͈e pʰjo dʑun pa ɾɯ mɯl hwa ɡin ha ɕi o. kjeː dʑip̚, kjeː ɕi da, ɕi ɡje, jʌn ɡje, mje bjʌl, kɛ pʰje, hjeː tʰɛk̚, tɕi hje e sʌ nɯn je wa ɾje i ø ɰi  hʌ joŋ dø nɯn []  hwa ɡin ha ɕi o. nil li ɾi, niŋ kʰɯm, mu ni, t͈i ʌ s͈ɯ ɡi, ɕ͈i ʌ, tʰi ʌ, hi ʌ, hi t͈ʌp̚ t͈a, hi maŋ, ju hi e sʌ nɯn tɕa ɯ mɯl tɕʰʌt̚ s͈o ɾi ɾo ka dʑi nɯn ɯm dʑʌ ɾi  [] pa ɾɯm ha ɕi o. tɕu ɰi, hjʌ bi, u ɾi ɰi, kaːŋ ɰi ɰi, pa ɾɯ mi e sʌ nɯn ta nʌ ɰi tɕʰʌ sɯm dʑʌl i ø e na tʰa na nɯn ɰi wa tɕo sa ɰi ɰi wʌn tɕʰik̚ tɕ͈ʌ ɡin pa ɾɯm mit̚ hʌ joŋ pa ɾɯ mɯl ku bjʌl ha ɕi o.

nuːn bo ɾa, maːl ɕ͈i, paːm na mu, maːn tʰa, mʌːl li, pʌl li da e sʌ nɯn tɕʰʌ sɯm dʑʌ ɾi kin so ɾi ɾɯl hwa ɡin ha ɕi o. tɕʰʌn nun, tɕʰam mal, s͈aŋ doŋ pam, nun mʌl ta, t͈ʌ bʌl li da e sʌ nɯn  tɛ dʑo ɾɯl sal pʰi ɡo,  hɛ daŋ haŋ mo ɡi je ø ɾo ku bjʌl ha ɕi o. pan ɕin ba ni wa tɕɛ sam dʑɛ sa e sʌ nɯn hap̚ s͈ʌŋ ʌ e sʌ ɰi ki ɾi ɾɯl hwa ɡin ha ɕi o. pwaː, kjʌː, twɛː, twʌː, hɛ wa wa, tɕʌ, tɕ͈ʌ, tɕʰjʌ ɾɯl pi ɡjo ha jʌ tɕʰu ɡja kʰjʌŋ ɰi tɕaŋ da nɯ mɯl ku bjʌl ha ɕi o. kaːm t͈a, paːp̚ t͈a, ɕiːn t͈a, aːl da, k͈ɯːl t͈a, t͈ʌːl da, pʌːl da, s͈ɯːl da, t͈ʌːl t͈a, ʌp̚ t͈a wa ka mɯ ni, pal bɯ mjʌn, ɕi nʌ, a ɾa, k͈ɯː ɾʌ, t͈ʌːl bɯn, pʌː ɾʌ, s͈ʌː ɾʌ,  pi ɡjo ha ɕi o. kam ɡi da, k͈o i da, pa pʰi da wa k͈ɯːl li da, t͈ʌːl li da,  tɕʌm mi sa e t͈a ɾɯn ki ɾi ɰi pjʌn hwa wa je ø ɾɯl hwa ɡin ha ɕi o. mil mul ɡwa s͈ʌl mu ɾɯn ku sʌŋ jo so ɰi ki ɾi ɾɯl tan sun hi hap̚ s͈an hɛ sʌ pa ɾɯm ha dʑi ma ɕi o.

pat̚ tɕʰi mɯ ɾo pa ɾɯm dø nɯn tɕa ɯ mɯn , , , , , ,  il ɡop̚ ka dʑi i da. pak̚, pu ʌk̚, nak̚ t͈a, tak̚ t͈a, kʰi ɯk̚, ot̚, uːt̚ t͈a, it̚ t͈a, tɕʌt̚, pit̚, k͈ot̚, tɕ͈ot̚ t͈a, sot̚, pɛːt̚ t͈a, ap̚, ip̚, sup̚, tʌp̚ t͈a ɾɯl ʌ mal ɡwa tɕa ɯm a pʰe sʌ pi ɡjo ha ɕi o. nʌk̚, an t͈a, jʌ dʌl, nʌl t͈a, ø ɡol, hal t͈a,  , , , , ,  tan sun hwa ɾɯl hwa ɡin ha ɕi o. tak̚, hɯk̚, mak̚ t͈a, nɯk̚ tɕ͈i, saːm, tɕʌːm t͈a, ɯp̚ k͈o e sʌ nɯn , ,  pa ɾɯ mɯl pi ɡjo ha ɕi o. tʰɯ kʰi mak̚ t͈a[mak̚ t͈a]wa mal k͈o[mal k͈o], mul k͈o[mul k͈o], nɯl k͈o[nɯl k͈o], ik̚ t͈a[ik̚ t͈a]wa il k͈o[il k͈o], puk̚ t͈a[puk̚ t͈a]wa pul k͈o[pul k͈o]ɰi tɕʰa i ɾɯl hwa ɡin ha ɕi o. paːp̚ t͈a, paːp̚ tɕ͈i, paːp̚ k͈o,  nʌl t͈a, nʌp̚ tɕ͈u kʰa da, nʌp̚ t͈uŋ ɡɯl da e sʌ nɯn  je ø ɾɯl mo dɯn ta nʌ e mu dʑo ɡʌn il ban hwa ha dʑi ma ɕi o.

pat̚ tɕʰim , ,  ty t͈a ɾɯ nɯn so ɾi e t͈a ɾa kʌ sen so ɾi dø ɡi, tʰal lak̚, pi ɯm ɡwa ɰi kjʌl ha bi tal la dʑin da. no kʰo, tɕoː tʰʌn, s͈a tɕʰi, man kʰo, an tʰʌn, tal tɕʰi, ka kʰa, mʌ kʰi da, pal kʰi da, ma tʰjʌŋ, tɕo pʰi da, nʌl pʰi da, k͈o tɕʰi da, an tɕʰi da, i pʰa ɡɯl pi ɡjo ha ɕi o. , ,   , ,  o nɯn   ty e  o nɯn kjʌŋ u ɾɯl ku bjʌl ha ɡo, taː s͈o, maːn s͈o, ɕil s͈o ɰi pa ɾɯ mɯl hwa ɡin ha ɕi o. non nɯn, s͈an ne, man ne, an nɯn, ɕil le, t͈ul lɯ ne sʌ nɯn   kjʌl ham mit̚ ju ɯm hwa ɰi tɕʌ ɡjoŋ sun sʌ ɾɯl sal pʰjʌ bo ɕi o. na ɯn, no a, s͈a i da, ma na, a nɯn, ta ɾa,  mo ɯ mɯ ɾo ɕi dʑa kʰa nɯn ʌ mi a pʰe sʌ ɰi   pjʌn hwa ɾɯl hwa ɡin ha ɕi o. o tʰan pʌl, na tʰan t͈ɛ, k͈o tʰan soŋ i, su tʰa da e sʌ nɯn ta nʌ kjʌŋ ɡje ɾɯl lʌm nɯn pa ɾɯm do kʌm dʑɯŋ ha ɕi o.

hot̚ p͈at̚ tɕʰim ɡwa s͈aŋ bat̚ tɕʰi mi mo ɯ mɯ ɾo ɕi dʑa kʰa nɯn tɕo sa, ʌ mi, tɕʌm mi sa wa kjʌl ha pʰa mjʌn jʌ nɯm dø nɯn kjʌŋ u ɡa it̚ t͈a. k͈a k͈a, o ɕi, i s͈ʌ, tɕ͈o tɕʰa, na dʑi, k͈o dʑa, k͈o tɕʰɯl, pa tʰe, a pʰɯ ɾo, tʌ pʰi da ɾɯl pi ɡjo ha ɕi o. kjʌp̚ p͈at̚ tɕʰi mi mo ɯ mɯ ɾo ɕi dʑa kʰa nɯn hjʌŋ ɕik̚ hjʌŋ tʰɛ so a pʰe ol t͈ɛ e nɯn tu tɕa ɯ mi pa ɾɯ mɯl ku bjʌl hɛ ja han da. nʌk̚ ɕ͈i, mok̚ ɕ͈i, kap̚ ɕ͈i, an dʑa, tal ɡɯl, tɕʌl mʌ, kol ɕ͈i, hal tʰa, ɯl pʰʌ, kap̚ s͈ɯl, ʌːp̚ s͈ʌ, jʌ dʌl bi, jʌ dʌl bɯl, pʰum s͈ak̚ ɕ͈i, pʰum s͈ak̚ s͈ɯl, pʰum s͈ak̚ s͈ɯ ɾo,  pi ɡjo ha ɕi o. pan mjʌn pa ta ɾɛ, nɯ pap̚, tɕʌ dʌ mi, ma dʌp̚ t͈a, kʌ dot̚, hʌ du sɯm, k͈o twi, nʌ kʌp̚ t͈a, ta ka pʰe, ka bʌ tɕʰi,  ɕil dʑil hjʌŋ tʰɛ so ɰi kjʌŋ ɡje wa tɛ pʰjo ɯ mi tɕʌ ɡjoŋ ɯl hwa ɡin ha ɕi o. ma ɕit̚ t͈a wa mʌ ɕit̚ t͈a nɯn [ma dit̚ t͈a], [mʌ dit̚ t͈a]ɾɯl wʌn tɕʰi ɡɯ ɾo ha dø [ma ɕit̚ t͈a], [mʌ ɕit̚ t͈a]ɰi hʌ joŋ pa ɾɯm do po dʑon ha ɕi o.

han ɡɯl tɕa mo i ɾɯ me tɕo sa ɡa pun nɯn kjʌŋ u e nɯn il ban ta nʌ ɰi jʌ nɯm kju tɕʰi ɡɯl kɯ dɛ ɾo tɕʌ ɡjoŋ ha dʑi mal ɡo pjʌl do ɰi kju dʑʌŋ ɯl hwa ɡin ha ɕi o. ki jʌ ɡi, ki jʌ ɡɯl, ki jʌ ɡe, ni ɯ ni, ni ɯ nɯl, ti ɡɯ ɕi, ti ɡɯ sɯl, ti ɡɯ se, ɾi ɯ ɾi, ɾi ɯ ɾɯl, mi ɯ mi, mi ɯ mɯl, pi ɯ bi, pi ɯ bɯl, ɕi o ɕi, ɕi o sɯl, i ɯŋ i, i ɯŋ ɯl, tɕi ɯ ɕi, tɕi ɯ sɯl, tɕʰi ɯ ɕi, tɕʰi ɯ sɯl, kʰi ɯ ɡi, kʰi ɯ ɡɯl, tʰi ɯ ɕi, tʰi ɯ sɯl, pʰi ɯ bi, pʰi ɯ bɯl, hi ɯ ɕi,  pa ɾɯ mɯl kʌm dʑɯŋ ha ɕi o.

pat̚ tɕʰim , ,  tɕo sa na tɕʌm mi sa ɰi  kjʌl ha pʰal t͈ɛ e nɯn ku ɡɛ ɯm hwa ɡa i ɾʌ nal su it̚ t͈a. ko dʑi dɯt̚ t͈a, ku dʑi, miː da dʑi, t͈am ba dʑi, pa tɕʰi,  pi ɡjo ha ɕi o. ku tɕʰi da, ta tɕʰi da, mu tɕʰi da e sʌ nɯn   kjʌl ha pʰan ty ɰi pa ɾɯm do hwa ɡin ha ɕi o. ku ɡɛ ɯm hwa nɯn , , , , , ,  ɕi dʑa kʰa nɯn mo dɯn hwan ɡjʌŋ e mu dʑo ɡʌn tɕʌ ɡjoŋ dø nɯn kju tɕʰi ɡi a ni da. pa tʰe ɾɯl  ka tʰɯn paŋ ɕi ɡɯ ɾo tɕʰʌ ɾi ha dʑi ma ɕi o.

pi ɯm hwa ɰi je ɾo mʌŋ nɯn, kuŋ mul, k͈aŋ nɯn, kʰi ɯŋ man, moŋ mok̚ ɕ͈i, kɯŋ nɯn, hɯŋ man, tan nɯn, tɕiːn nɯn, on mɛp̚ ɕ͈i, in nɯn, man nɯn, tɕʌn mʌŋ ul, tɕ͈on nɯn, k͈on maŋ ul, pun nɯn, non nɯn, tɕam nɯn, pam mul, am ma daŋ, paːm nɯn, ɯm nɯn, ʌːm nɯn, kam mɛ da ɾɯl pi ɡjo ha ɕi o. tɕʰɛŋ nʌn nɯn da, hɯŋ mal li da, on mat̚ tɕʰu da, pam mʌŋ nɯn da, kam mɛ ɡi da e sʌ nɯn ta nʌ sa i ɰi pi ɯm hwa do hwa ɡin ha ɕi o.   pi ɯm hwa nɯn tɕʰim njak̚, kaŋ nɯŋ, maŋ non, sʌŋ nju, hjʌm njʌk̚, pʌm ni, kuŋ nip̚, toŋ nim mu ne sʌ kʌm dʑɯŋ ha ɕi o.   in dʑʌ pʰa nɯn kjʌŋ u e nɯn naːl lo, ɕil la, tɕʰʌl li, kwaːŋ hal lu, tɛː kwal ljʌŋ, kal lal, mul lal li, hal lɯn dʑi, tal lɯn, t͈ul lɯn, hal le ɾɯl pi ɡjo ha ɕi o. ɰiː ɡjʌn nan, imː dʑin nan, sɛŋ san njaŋ, kjʌl t͈an njʌk̚, koŋ k͈wʌn njʌk̚, toŋː wʌn njʌŋ, saŋ ɡjʌn nje, hweŋ dan no, iː wʌn non, i bwʌn njo, ku ɡɯl lju tɕʰʌ ɾʌm hjʌŋ tʰɛ ɡa ta ɾɯn han dʑa ʌ do hwa ɡin ha dø, mo dɯn  ka tʰɯn kju tɕʰi ɡɯ ɾo tɕʰʌ ɾi ha dʑi ma ɕi o.

pʰjo dʑun pa ɾɯ mɯ ɾo in dʑʌŋ dø dʑi an nɯn tɕa ɯm toŋ hwa ɾɯl ku bjʌl ha ɡi y hɛ kaːm ɡi, ot̚ k͈am, it̚ k͈o, k͈ot̚ k͈il, tɕʌn mʌ ɡi, mun p͈ʌp̚, k͈ot̚ p͈a tʰɯl kʌm dʑɯŋ ha ɕi o. hɯn hi tɯl li nɯn pa ɾɯ mi ɾa nɯn i ju ma nɯ ɾo pʰjo dʑun pa ɾɯ mɯ ɾo sɯŋ in ha dʑi mal ɡo, koŋ ɕik̚ kju dʑʌŋ e mjʌŋ ɕi døn ɯ mun hwan ɡjʌŋ ɡwa ʌ hy bjʌl kɯn ɡʌ ɾɯl hwa ɡin ha ɕi o. tø ʌ wa tø jʌ, pʰi ʌ wa pʰi jʌ, i o wa i jo, a ni o wa a ni jo e sʌ nɯn hʌ joŋ dø nɯn mo ɯm toŋ hwa ɾɯl hwa ɡin ha dø,   k͈ɯn na nɯn mo dɯn ʌ ɡa ne ka tʰɯn hʌ joŋ ɯl tɕʌ ɡjoŋ ha dʑi ma ɕi o.

tɕaŋ ɛ ɯm pat̚ tɕʰim ty ɰi kjʌŋ ɯm hwa ɾɯl hwa ɡin ha ɡi y hɛ kuk̚ p͈ap̚, k͈ak̚ t͈a, nʌk̚ p͈a dʑi, sak̚ t͈on, tak̚ tɕ͈aŋ, tɕʰik̚ p͈ʌm, p͈ʌt̚ t͈ɛ da, ot̚ k͈o ɾɯm, it̚ t͈ʌn, k͈ot̚ k͈o, k͈ot̚ t͈a bal, nat̚ s͈ʌl da, pat̚ k͈a ɾi, sot̚ tɕ͈ʌn, kop̚ t͈ol, tʌp̚ k͈ɛ, jʌp̚ tɕ͈ip̚, nʌp̚ tɕ͈u kʰa da, ɯp̚ tɕ͈o ɾi da, kap̚ tɕ͈i da ɾɯl pi ɡjo ha ɕi o. ʌ ɡan pat̚ tɕʰim , , ,   jʌn ɡjʌl dø nɯn ʌ mi ɰi tɕʰʌt̚ s͈o ɾi , , ,  kjʌŋ ɯm hwa dø nɯn hwan ɡjʌŋ e sʌ nɯn anː t͈a, anː k͈o, anː tɕ͈i, kaːm t͈a, kamː k͈o, kamː tɕ͈i, an k͈o, an tɕ͈i, saːm k͈o, samː tɕ͈i, tɕʌmː k͈o, tɕʌm tɕ͈i ɾɯl hwa ɡin ha ɕi o. kɯ ɾʌ na an ɡi da, kam ɡi da, kum ɡi da, om k͈i ɡi ɰi pʰi doŋ·sa doŋ tɕʌm mi sa -ki nɯn ka tʰɯn paŋ ɕi ɡɯ ɾo tøn so ɾi hwa ha dʑi an nɯn da. ʌ ɡan pat̚ tɕʰim ,   nʌl k͈e, hal t͈a, hul s͈o, t͈ʌl tɕ͈i do pi ɡjo ha ɕi o.

han dʑa ʌ e sʌ   ty e , ,  jʌn ɡjʌl dø nɯn kjʌŋ u e nɯn kal t͈ɯŋ, pal t͈oŋ, tɕʌl t͈o, mal s͈al, pul s͈o, il ɕ͈i, kal tɕ͈ɯŋ, mul tɕ͈il, pal tɕ͈ʌn, mol s͈aŋ ɕik̚, pul se tɕʰu ɾɯl hwa ɡin ha ɕi o. kɯ ɾʌ na hʌ hʌ ɕil ɕil ɡwa tɕʌl dʑʌl ha da nɯn mu dʑo ɡʌn kjʌŋ ɯm hwa ha dʑi an nɯn je ø ɾo ku bjʌl ha ɕi o. kwan hjʌŋ sa hjʌŋ -(ɯ)  kjʌŋ ɯm hwa nɯn hal k͈ʌl, hal p͈a k͈e, hal s͈e ɾa, hal s͈u ɾok̚, hal tɕ͈in dɛ, hal tɕ͈i ɾa do, hal dʑi ʌn dʑʌŋ ɡwa hal k͈ʌ sɯl, kal t͈e ɡa, hal p͈a ɾɯl, hal s͈u nɯn, hal tɕ͈ʌ ɡe, kal k͈ot̚, hal t͈o ɾi, man nal sa ɾa me sʌ hwa ɡin ha ɕi o. hap̚ s͈ʌŋ ʌ ɰi kjʌŋ ɯm hwa nɯn mun k͈o ɾi, nun t͈oŋ dʑa, ɕin p͈a ɾam, san s͈ɛ, son tɕ͈ɛ dʑu, kil k͈a, mul t͈oŋ i, pal p͈a tak̚, kuːl s͈ok̚, sul tɕ͈an, pa ɾam k͈jʌl, kɯ mɯm t͈al, a tɕʰim p͈ap̚, tɕam tɕ͈a ɾi, kaŋ k͈a, tɕʰo sɯŋ t͈al, tɯŋ p͈ul, tɕʰaŋ s͈al, kaŋ dʑul ɡi ɾɯl pi ɡjo ha dø, hap̚ s͈ʌŋ ʌ ɾa nɯn i ju ma nɯ ɾo mo dɯn tɕʰʌt̚ s͈o ɾi ɾɯl kjʌŋ ɯm hwa ha dʑi ma ɕi o.

hap̚ s͈ʌŋ ʌ wa pʰa sɛŋ ʌ e sʌ  tɕʰʌm ɡa dø nɯn hwan ɡjʌŋ ɯl hwa ɡin ha ɡi y hɛ soːm ni bul, hon ni bul, maŋ nil, saŋ nil, mɛn nip̚, k͈on nip̚, nɛː boŋ ɲak̚, han ɲʌ ɾɯm, nam dʑon ɲʌ bi, ɕin ɲʌ sʌŋ, sɛŋ ɲʌn pʰil, tɕi kʰɛŋ ɲʌl tɕʰa, nɯŋ maŋ ɲʌm, kʰoŋ ɲʌt̚, taːm ɲo, nun ɲo ɡi, jʌŋ ʌm ɲoŋ, ɕi ɡjoŋ ɲu, pɛk̚ p͈un ɲul, kuŋ min ɲjul li, pa mju tɕʰɯl pi ɡjo ha ɕi o.   ty e  tɕʰʌm ɡa dø mjʌn  pa ɾɯm dø nɯn je ɾo sʌ ul ljʌk̚, mul ljak̚, pul ljʌ u, tɯlː lil, sol lip, sʌl lik t͈a, mul ljʌt̚, hwi pal lju, ju dɯ ɾju dɯ ɾɯl hwa ɡin ha ɕi o. sʌ ɾɯn ɲʌ sʌt̚, sɯ mul ljʌ sʌt̚, sam ɲʌn dɛ, il ljʌn dɛ, han nil, on nip̚ t͈a, mʌ ɡɯn njʌt̚, hal lil, tɕal lip̚ t͈a, mʌ ɡɯl jʌ se sʌ nɯn tɕʰʌm ɡa ɡa tɕʌ ɡjoŋ dø nɯn hjʌŋ tʰɛ wa mun mɛ ɡɯl pi ɡjo ha ɕi o. i dʑuŋ ni dʑuk̚, ja ɡɯm ɲa ɡɯm, kʌːm ɲʌl, jol laŋ ɲol laŋ, kɯ mjuŋ e sʌ nɯn hʌ joŋ dø nɯn pa rɯ mi tɛ a nɯl po dʑon ha ɕi o. ju ɡi o, sa mil tɕ͈ʌl, soːŋ bjʌ ɾjʌn, tɯŋ joŋ mu nɯn tɕa doŋ dʑʌ ɡin   tɕʌ ɡjoŋ ha dʑi an nɯn tɛ dʑo sa ɾje i da.

sa i ɕi ot̚ k͈wa kwal ljʌn døn pa ɾɯ mɯn pʰjo ɡi wa hap̚ s͈ʌŋ ʌ ku dʑo, ty t͈a ɾɯ nɯn so ɾi, ʌ hy bjʌl hʌ joŋ pa ɾɯ mɯl ham k͈e hwa ɡin hɛ ja han da. nɛː k͈a, sɛː k͈il, p͈al lɛ t͈ol, kʰo t͈ɯŋ, ki p͈al, tɛː pʰɛ p͈ap̚, hɛ s͈al, pɛ s͈ok̚, pɛ tɕ͈ʌn, ko ɡɛ tɕ͈it̚, kʰon nal, a ɾɛn ni, tʰøːn ma ɾu, pɛn mʌ ɾi, pe ɡɛn nit̚, kɛn nip̚, na mun nip̚, to ɾi ɡɛn ɲʌl, ty ɕju tɕʰɯl pi ɡjo ha ɕi o. tøn so ɾi ɾo pa ɾɯm dø nɯn kjʌŋ u,  pa ɾɯm dø nɯn kjʌŋ u,  tɕʰʌm ɡa dø nɯn kjʌŋ u, pʰjo dʑu ne sʌ hʌ joŋ ha nɯn tɛ a ni in nɯn kjʌŋ u ɾɯl kak̚ k͈ak̚ ki ɾo kʰa ɕi o. sa i ɕi o ɕi pʰjo ɡi dø ʌ it̚ t͈a nɯn i ju ma nɯ ɾo ʌn dʑe na ka tʰɯn so ɾi ɾɯl sa bi pʰa ɡʌ na mo dɯn hap̚ s͈ʌŋ ʌ e toŋ il han kju tɕʰi ɡɯl tɕʌ ɡjoŋ hɛ sʌ nɯn an tøn da.

tɕʰø dʑoŋ kʌm dʑɯŋ e sʌ nɯn tɕehaŋ ɰi wʌn tɕʰik̚ p͈u tʰʌ tɕehaŋ ɰi sa i ɕi ot̚ pa ɾɯm k͈a dʑi, kak̚ haŋ ɰi pon mun ɡwa , je ø, hʌ joŋ pa ɾɯ mɯl pjʌl do ɰi kʌm dʑɯŋ haŋ mo ɡɯ ɾo tɯŋ no kʰa ɕi o. mo dɯn je mu ne nɯn han ɡɯl wʌn mun, hjʌŋ tʰɛ so mit̚ ɯm dʑʌl ku dʑo, tɕʌ ɡjoŋ dø nɯn kju dʑʌŋ ɡwa sun sʌ, pʰjo dʑun pa rɯ mi kɯn ɡʌ, , u kʰɯ ɾa i na ʌ ɯm sʌŋ tɕʌ ɡɯŋ, u kʰɯ ɾa i na ʌ ɕi ɾjoŋ pʰjo ɡi ɾɯl ki ɾo kʰa ɕi o. pʰjo dʑun pa ɾɯ mi hwa ɡin døn kjʌŋ u wa kju tɕʰi ɡɯ ɾo bu tʰʌ to tɕʰul han kjʌŋ u, sa dʑʌ ni kɛ bjʌl ʌ hy tɕʌŋ bo ɡa pʰi ɾjo han kjʌŋ u, pok̚ s͈u pa ɾɯ mi hʌ joŋ dø nɯn kjʌŋ u ɾɯl ku bjʌl ha ɕi o. kɯn ɡʌ ɡa pu dʑo kʰa ɡʌ na hjʌŋ tʰɛ so kjʌŋ ɡje ɾɯl pʰan dan hal su ʌːm nɯn haŋ mo ɡɯn mi hwak̚ tɕ͈ʌŋ ɯ ɾo nam ɡi ɡo, pʰjo ɡi ma nɯ ɾo tɕʰu tɕʰɯ kʰan kjʌl ɡwa ɾɯl pʰjo dʑun pa ɾɯ mɯ ɾo tɕe ɕi ha dʑi ma ɕi o. ka hwak̚ tɕ͈ʌŋ dø ɡi tɕʌ ne nɯn u kʰɯ ɾa i na ʌ  sɛŋ sʌŋ ha dʑi ma ɕi o.

~~~

### Strict mode: Ukrainian
~~~text
куннімкуґовон пйоджун паримбоп че1ганбуто че30ганкаджіий чонгап комджин чарйо

пйоджун паримбобин пйоджуноий шілче паримил таридве куґоий чонтонсонґва гамнісонил корйогайо чонгамил вончіґиро ганда. тарасо ганґил пйоґіва шілче паримі гансан ілчігандаґо каджонгесонин ан твенда. пйоджуноий чаим 19кева моим 21ке, танмоимґва іджун моим, имі кірі, патчімі тепйоим, кйоппатчімі тансунгва, йоним, имі тонгва, кйонимгва, имі чомґарил чарєро салпйобоґо, как кюджоний чоґйон гванґйонґва єве, гойондвенин парим, гойондведжі аннин паримил кубйолгашіо.

чаимин ㄱ, ㄲ, ㄴ, ㄷ, ㄸ, ㄹ, ㅁ, ㅂ, ㅃ, ㅅ, ㅆ, ㅇ, ㅈ, ㅉ, ㅊ, ㅋ, ㅌ, ㅍ, ㅎий 19кеімйо, моимин ㅏ, ㅐ, ㅑ, ㅒ, ㅓ, ㅔ, ㅕ, ㅖ, ㅗ, ㅘ, ㅙ, ㅚ, ㅛ, ㅜ, ㅝ, ㅞ, ㅟ, ㅠ, ㅡ, ㅢ, ㅣий 21кеіда. салґва сал, кава ка, тава та, пава па, чава ча, сава сарил піґйогадве, пйоґіе натанан чаимил іміро тарин чаимиро пакуджі машіо.

ㅏ, ㅐ, ㅓ, ㅔ, ㅗ, ㅚ, ㅜ, ㅟ, ㅡ, ㅣнин танмоимиро паримгамил вончіґиро гаґо, ㅚва ㅟнин іджун моимиро паримганин котто гойонганда. ㅑ, ㅒ, ㅕ, ㅖ, ㅘ, ㅙ, ㅛ, ㅝ, ㅞ, ㅠ, ㅢнин іджун моимиро паримганда. таман каджіова каджо, чіова чо, тачіова тачйорил піґйогайо чо, чо, чйоий шілче пйоджун паримил гваґінгашіо. кєджіп, кєшіда, шіґє, йонґє, мєбйол, кепє, гєтек, чігєесонин єва рє івеий ㅖе гойондвенин [] паримил гваґінгашіо. ніллірі, нінким, муні, тіосиґі, шіо, тіо, гіо, гітопта, гіман, югіесонин чаимил чотсоріро каджінин имджорі ㅢрил []ро паримгашіо. чуий, гьобі, уріий, канийий, париміесонин таноий чосимджол івее натананин ийва чоса ийий вончікчоґін парим міт гойон паримил кубйолгашіо.

нунбора, малші, памнаму, манта, моллі, поллідаесонин чосимджорі кінсорірил гваґінгашіо. чоннун, чаммал, сандонпам, нунмолта, тоболлідаесонин  теджорил салпіґо,  гедан ганмоґі єверо кубйолгашіо. паншінбаніва чесамджесаесонин гапсоноесоий кірірил гваґінгашіо. пва, кйо, тве, тво, гева ва, чо, чо, чйорил піґйогайо чуґякхьоний чанданимил кубйолгашіо. камта, папта, шінта, алда, килта, толда, полда, силда, толта, оптава камині, палбимйон, шіно, ара, киро, толбин, поро, соро,  піґйогашіо. камґіда, коіда, папідава килліда, толліда,  чоммісае тарин кіріий пйонгвава єверил гваґінгашіо. мілмулґва солмурин кусон йосоий кірірил тансунгі гапсангесо паримгаджі машіо.

патчімиро паримдвенин чаимин ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅇий ілґоп каджііда. пак, пуок, накта, такта, кіик, от, утта, ітта, чот, піт, кот, чотта, сот, петта, ап, іп, суп, топтарил омалґва чаим апесо піґйогашіо. нок, анта, йодол, нолта, веґол, галта,  ㄳ, ㄵ, ㄼ, ㄽ, ㄾ, ㅄий тансунгварил гваґінгашіо. так, гик, макта, никчі, сам, чомта, ипкоесонин ㄺ, ㄻ, ㄿий паримил піґйогашіо. тикі макта[макта]ва малко[малко], мулко[мулко], нилко[нилко], ікта[ікта]ва ілко[ілко], пукта[пукта]ва пулко[пулко]ий чаірил гваґінгашіо. папта, папчі, папко,  нолта, нопчукада, ноптунґилдаесонин ㄼий єверил модин таное муджоґон ілбангвагаджі машіо.

патчім ㅎ, ㄶ, ㅀин твітаринин соріе тара косенсорідвеґі, таллак, піимґваий кйолгабі талладжінда. ноко, чотон, сачі, манко, антон, талчі, кака, мокіда, палкіда, матйон, чопіда, нолпіда, кочіда, анчіда, іпаґил піґйогашіо. , ,  твіе ㄱ, ㄷ, ㅈі онин кйонува ㅎ твіе ㅅі онин кйонурил кубйолгаґо, тасо, мансо, шілсоий паримил гваґінгашіо. ноннин, санне, манне, аннин, шілле, туллинесонин ㅎква ㄴий кйолгап міт юимгваий чоґйон сунсорил салпйобошіо. наин, ноа, саіда, мана, анин, тара,  моимиро шіджаканин омі апесоий  квалльон пйонгварил гваґінгашіо. о тан пол, на танте, ко тан соні, сутадаесонин тано кйонґєрил номнин паримдо комджингашіо.

готпатчімґва санбатчімі моимиро шіджаканин чоса, омі, чоммісава кйолгапамйон йонимдвенин кйонуґа ітта. кака, оші, ісо, чоча, наджі, коджа, кочил, пате, апиро, топідарил піґйогашіо. кйоппатчімі моимиро шіджаканин гьоншік гьонтесо апе ол теенин ту чаимі паримил кубйолгея ганда. нокші, мокші, капші, анджа, талґил, чолмо, колші, галта, илпо, капсил, опсо, йодолбі, йодолбил, пумсакші, пумсаксил, пумсаксиро,  піґйогашіо. панмйон па таре, ни пап, чодомі, мадопта, кодот, годусим, ко тві, но копта, та капе, кабочі,  шілджіл гьонтесоий кйонґєва тепйоимі чоґйонил гваґінгашіо. машіттава мошіттанин [мадітта], [модітта]рил вончіґиро гадве [машітта], [мошітта]ий гойон паримдо поджонгашіо.

ганґил чамо іриме чосаґа пуннин кйонуенин ілбан таноий йоним кючіґил кидеро чоґйонгаджі малґо пйолдоий кюджонил гваґінгашіо. кійоґі, кійоґил, кійоґе, ніині, ніинил, тіґиші, тіґисил, тіґисе, ріирі, ріирил, міимі, міимил, піибі, піибил, шіоші, шіосил, іині, іинил, чіиші, чіисил, чіиші, чіисил, кіиґі, кіиґил, тіиші, тіисил, піибі, піибил, гіиші,  паримил комджингашіо.

патчім ㄷ, ㅌ, ㄾі чосана чоммісаий ㅣва кйолгапал теенин куґеимгваґа іронал су ітта. коджідитта, куджі, мідаджі, тамбаджі, пачі,  піґйогашіо. кучіда, тачіда, мучідаесонин ㄷква ㅎі кйолгапан твіий паримдо гваґінгашіо. куґеимгванин , , , , , , ㅔро шіджаканин модин гванґйоне муджоґон чоґйондвенин кючіґі аніда. патерил  катин паншіґиро чорігаджі машіо.

піимгваий єро моннин, кунмул, каннин, кіинман, монмокші, киннин, гинман, таннин, чіннин, онмепші, іннин, маннин, чонмонул, чоннин, конманул, пуннин, ноннин, чамнин, паммул, аммадан, памнин, имнин, омнин, каммедарил піґйогашіо. чек ноннинда, гик малліда, от матчуда, пап моннинда, кап меґідаесонин тано саіий піимгвадо гваґінгашіо.  апі піимгванин чімняк, каннин, маннон, сонню, гьомньок, помні, кунніп, тонніммунесо комджингашіо. ㄴква ㄹі інджопанин кйонуенин налло, шілла, чоллі, квангаллу, теквалльон, каллал, муллаллі, галлинджі, таллин, туллин, галлерил піґйогашіо. ийґйоннан, імджіннан, сенсаннян, кйолтанньок, конквонньок, тонвонньон, санґйоннє, гвенданно, івоннон, ібвонньо, куґиллючором гьонтеґа тарин ганджаодо гваґінгадве, модин ㄹил катин кючіґиро чорігаджі машіо.

пйоджун паримиро інджондведжі аннин чаим тонгварил кубйолгаґі віге камґі, откам, ітко, коткіл, чонмоґі, мунпоп, котпатил комджингашіо. гингі тиллінин париміранин іюманиро пйоджун паримиро синінгаджі малґо, коншік кюджоне мйоншідвен имун гванґйонґва огвібйол кинґорил гваґінгашіо. твеова твейо, піова пійо, іова ійо, аніова анійоесонин гойондвенин моим тонгварил гваґінгадве, ㅐна ㅔро киннанин модин оґане катин гойонил чоґйонгаджі машіо.

чанеим патчім твіий кйонимгварил гваґінгаґі віге кукпап, какта, нокпаджі, сактон, такчан, чікпом, поттеда, откорим, іттон, котко, коттабал, натсолда, паткарі, сотчон, коптол, топке, йопчіп, нопчукада, ипчоріда, капчідарил піґйогашіо. оґан патчім , , ,  твіе йонґйолдвенин оміий чотсорі ㄱ, ㄷ, ㅅ, ㅈі кйонимгвадвенин гванґйонесонин анта, анко, анчі, камта, камко, камчі, анко, анчі, самко, самчі, чомко, чомчірил гваґінгашіо. кирона анґіда, камґіда, кумґіда, омкіґіий підон·садон чомміса -кінин катин паншіґиро твенсорігвагаджі аннинда. оґан патчім ,  твіий нолке, галта, гулсо, толчідо піґйогашіо.

ганджаоесо  патчім твіе ㄷ, ㅅ, ㅈі йонґйолдвенин кйонуенин калтин, палтон, чолто, малсал, пулсо, ілші, калчин, мулчіл, палчон, молсаншік, пулсечурил гваґінгашіо. кирона гогошілшілґва чолджолгаданин муджоґон кйонимгвагаджі аннин єверо кубйолгашіо. квангьонсагьон -(и) твіий кйонимгванин галкол, галпаке, галсера, галсурок, галчінде, галчірадо, галджіонджонґва гал косил, кал теґа, гал парил, гал сунин, гал чоґе, кал кот, гал торі, маннал сарамесо гваґінгашіо. гапсоноий кйонимгванин мункорі, нунтонджа, шінпарам, сансе, сончеджу, кілка, мултоні, палпатак, кулсок, сулчан, парамкйол, кимимтал, ачімпап, чамчарі, канка, чосинтал, тинпул, чансал, канджулґірил піґйогадве, гапсоноранин іюманиро модин чотсорірил кйонимгвагаджі машіо.

гапсонова пасеноесо ㄴі чомґадвенин гванґйонил гваґінгаґі віге сомнібул, гоннібул, манніл, санніл, менніп, конніп, небонняк, ганньорим, намджонньобі, шінньосон, сенньонпіл, чікенньолча, нинманньом, конньот, тамньо, нунньоґі, йономньон, шіґйонню, пекпуннюл, кунмінньюллі, памючил піґйогашіо.  патчім твіе ㄴі чомґадвемйон ㄹро паримдвенин єро соулльок, мулляк, пулльоу, тилліл, солліп, соллікта, мулльот, гвіпаллю, юдирюдирил гваґінгашіо. соринньосот, симулльосот, сам ньонде, іл льонде, ган іл, от іпта, моґин йот, гал іл, чал іпта, моґил йосесонин чомґаґа чоґйондвенин гьонтева мунмеґил піґйогашіо. іджунніджук, яґимняґим, комньол, йолланньоллан, кимюнесонин гойондвенин паримі теанил поджонгашіо. юґіо, самілчол, сонбйорйон, тинйонмунин чадонджоґін ㄴ чомґарил чоґйонгаджі аннин теджо сарєіда.

саішіотква квалльондвен паримин пйоґіва гапсоно куджо, твітаринин сорі, огвібйол гойон паримил гамке гваґінгея ганда. нека, секіл, паллетол, котин, кіпал, тепепап, гесал, песок, печон, коґечіт, коннал, аренні, твенмару, пенморі, пеґенніт, кенніп, намунніп, торіґенньол, твішючил піґйогашіо. твенсоріро паримдвенин кйону, ㄴиро паримдвенин кйону, ㄴі чомґадвенин кйону, пйоджунесо гойонганин теані іннин кйонурил каккак кірокашіо. саішіоші пйоґідвео іттанин іюманиро онджена катин сорірил сабіпаґона модин гапсоное тонілган кючіґил чоґйонгесонин ан твенда.

чведжон комджинесонин че1ганий вончікпуто че30ганий саішіот паримкаджі, как ганий понмунґва , єве, гойон паримил пйолдоий комджин ганмоґиро тиннокашіо. модин ємуненин ганґил вонмун, гьонтесо міт имджол куджо, чоґйондвенин кюджонґва сунсо, пйоджун паримі кинґо, IPA, укираінао имсон чоґин, укираінао шірйон пйоґірил кірокашіо. пйоджун паримі гваґіндвен кйонува кючіґиробуто точулган кйону, саджоні кебйол огві чонбоґа пірйоган кйону, поксу паримі гойондвенин кйонурил кубйолгашіо. кинґоґа пуджокаґона гьонтесо кйонґєрил пандангал су омнин ганмоґин мігвакчониро намґіґо, пйоґіманиро чучикан кйолґварил пйоджун паримиро чешігаджі машіо. IPAка гвакчондвеґі чоненин укираінао транскрипцію сенсонгаджі машіо.

~~~

### Practical mode: IPA
~~~text
kuŋ nim k͈u ɡʌ wʌn pʰjo dʑun pa ɾɯm bʌp̚ tɕehaŋ bu tʰʌ tɕehaŋ k͈a dʑi ɰi tɕoŋ hap̚ kʌm dʑɯŋ tɕa ɾjo

pʰjo dʑun pa ɾɯm bʌ bɯn pʰjo dʑu nʌ ɰi ɕil tɕ͈e pa ɾɯ mɯl t͈a ɾɯ dø ku ɡʌ ɰi tɕʌn tʰoŋ sʌŋ ɡwa ham ni sʌŋ ɯl ko ɾjʌ ha jʌ tɕʌŋ ha mɯl wʌn tɕʰi ɡɯ ɾo han da. t͈a ɾa sʌ han ɡɯl pʰjo ɡi wa ɕil tɕ͈e pa ɾɯ mi haŋ saŋ il tɕʰi han da ɡo ka dʑʌŋ hɛ sʌ nɯn an tøn da. pʰjo dʑu nʌ ɰi tɕa ɯm kɛ wa mo ɯm kɛ, tan mo ɯm ɡwa i dʑuŋ mo ɯm, ɯ mi ki ɾi, pat̚ tɕʰi mi tɛ pʰjo ɯm, kjʌp̚ p͈at̚ tɕʰi mi tan sun hwa, jʌ nɯm, ɯ mi toŋ hwa, kjʌŋ ɯm hwa, ɯ mi tɕʰʌm ɡa ɾɯl tɕʰa ɾje ɾo sal pʰjʌ bo ɡo, kak̚ kju dʑʌŋ ɰi tɕʌ ɡjoŋ hwan ɡjʌŋ ɡwa je ø, hʌ joŋ dø nɯn pa ɾɯm, hʌ joŋ dø dʑi an nɯn pa ɾɯ mɯl ku bjʌl ha ɕi o.

tɕa ɯ mɯn , , , , , , , , , , , , , , , , , ,  kɛ i mjʌ, mo ɯ mɯn , , , , , , , , , , , , , , , , , , , ,  kɛ i da. s͈al ɡwa sal, ka wa k͈a, ta wa t͈a, pa wa p͈a, tɕa wa tɕ͈a, sa wa s͈a ɾɯl pi ɡjo ha dø, pʰjo ɡi e na tʰa nan tɕa ɯ mɯl i mi ɾo ta ɾɯn tɕa ɯ mɯ ɾo pa k͈u dʑi ma ɕi o.

, , , , , , , , ,  tan mo ɯ mɯ ɾo pa ɾɯm ha mɯl wʌn tɕʰi ɡɯ ɾo ha ɡo,   i dʑuŋ mo ɯ mɯ ɾo pa ɾɯm ha nɯn kʌt̚ t͈o hʌ joŋ han da. , , , , , , , , , ,  i dʑuŋ mo ɯ mɯ ɾo pa ɾɯm han da. ta man ka dʑi ʌ wa ka dʑʌ, tɕ͈i ʌ wa tɕ͈ʌ, ta tɕʰi ʌ wa ta tɕʰjʌ ɾɯl pi ɡjo ha jʌ tɕʌ, tɕ͈ʌ, tɕʰjʌ ɰi ɕil tɕ͈e pʰjo dʑun pa ɾɯ mɯl hwa ɡin ha ɕi o. kjeː dʑip̚, kjeː ɕi da, ɕi ɡje, jʌn ɡje, mje bjʌl, kɛ pʰje, hjeː tʰɛk̚, tɕi hje e sʌ nɯn je wa ɾje i ø ɰi  hʌ joŋ dø nɯn []  hwa ɡin ha ɕi o. nil li ɾi, niŋ kʰɯm, mu ni, t͈i ʌ s͈ɯ ɡi, ɕ͈i ʌ, tʰi ʌ, hi ʌ, hi t͈ʌp̚ t͈a, hi maŋ, ju hi e sʌ nɯn tɕa ɯ mɯl tɕʰʌt̚ s͈o ɾi ɾo ka dʑi nɯn ɯm dʑʌ ɾi  [] pa ɾɯm ha ɕi o. tɕu ɰi, hjʌ bi, u ɾi ɰi, kaːŋ ɰi ɰi, pa ɾɯ mi e sʌ nɯn ta nʌ ɰi tɕʰʌ sɯm dʑʌl i ø e na tʰa na nɯn ɰi wa tɕo sa ɰi ɰi wʌn tɕʰik̚ tɕ͈ʌ ɡin pa ɾɯm mit̚ hʌ joŋ pa ɾɯ mɯl ku bjʌl ha ɕi o.

nuːn bo ɾa, maːl ɕ͈i, paːm na mu, maːn tʰa, mʌːl li, pʌl li da e sʌ nɯn tɕʰʌ sɯm dʑʌ ɾi kin so ɾi ɾɯl hwa ɡin ha ɕi o. tɕʰʌn nun, tɕʰam mal, s͈aŋ doŋ pam, nun mʌl ta, t͈ʌ bʌl li da e sʌ nɯn tɕ͈al bɯn so ɾi ɰi tɛ dʑo ɾɯl sal pʰi ɡo, su ma ni nɯn hɛ daŋ haŋ mo ɡi je ø ɾo ku bjʌl ha ɕi o. pan ɕin ba ni wa tɕɛ sam dʑɛ sa e sʌ nɯn hap̚ s͈ʌŋ ʌ e sʌ ɰi ki ɾi ɾɯl hwa ɡin ha ɕi o. pwaː, kjʌː, twɛː, twʌː, hɛ wa wa, tɕʌ, tɕ͈ʌ, tɕʰjʌ ɾɯl pi ɡjo ha jʌ tɕʰu ɡja kʰjʌŋ ɰi tɕaŋ da nɯ mɯl ku bjʌl ha ɕi o. kaːm t͈a, paːp̚ t͈a, ɕiːn t͈a, aːl da, k͈ɯːl t͈a, t͈ʌːl da, pʌːl da, s͈ɯːl da, t͈ʌːl t͈a, ʌp̚ t͈a wa ka mɯ ni, pal bɯ mjʌn, ɕi nʌ, a ɾa, k͈ɯː ɾʌ, t͈ʌːl bɯn, pʌː ɾʌ, s͈ʌː ɾʌ, ʌp̚ s͈ɯ ni ɾɯl pi ɡjo ha ɕi o. kam ɡi da, k͈o i da, pa pʰi da wa k͈ɯːl li da, t͈ʌːl li da, ʌp̚ s͈ɛ da e sʌ nɯn tɕʌm mi sa e t͈a ɾɯn ki ɾi ɰi pjʌn hwa wa je ø ɾɯl hwa ɡin ha ɕi o. mil mul ɡwa s͈ʌl mu ɾɯn ku sʌŋ jo so ɰi ki ɾi ɾɯl tan sun hi hap̚ s͈an hɛ sʌ pa ɾɯm ha dʑi ma ɕi o.

pat̚ tɕʰi mɯ ɾo pa ɾɯm dø nɯn tɕa ɯ mɯn , , , , , ,  il ɡop̚ ka dʑi i da. pak̚, pu ʌk̚, nak̚ t͈a, tak̚ t͈a, kʰi ɯk̚, ot̚, uːt̚ t͈a, it̚ t͈a, tɕʌt̚, pit̚, k͈ot̚, tɕ͈ot̚ t͈a, sot̚, pɛːt̚ t͈a, ap̚, ip̚, sup̚, tʌp̚ t͈a ɾɯl ʌ mal ɡwa tɕa ɯm a pʰe sʌ pi ɡjo ha ɕi o. nʌk̚, an t͈a, jʌ dʌl, nʌl t͈a, ø ɡol, hal t͈a, kap̚ s͈e sʌ nɯn , , , , ,  tan sun hwa ɾɯl hwa ɡin ha ɕi o. tak̚, hɯk̚, mak̚ t͈a, nɯk̚ tɕ͈i, saːm, tɕʌːm t͈a, ɯp̚ k͈o e sʌ nɯn , ,  pa ɾɯ mɯl pi ɡjo ha ɕi o. tʰɯ kʰi mak̚ t͈a[mak̚ t͈a]wa mal k͈o[mal k͈o], mul k͈o[mul k͈o], nɯl k͈o[nɯl k͈o], ik̚ t͈a[ik̚ t͈a]wa il k͈o[il k͈o], puk̚ t͈a[puk̚ t͈a]wa pul k͈o[pul k͈o]ɰi tɕʰa i ɾɯl hwa ɡin ha ɕi o. paːp̚ t͈a, paːp̚ tɕ͈i, paːp̚ k͈o, pal bɯ ni wa nʌl t͈a, nʌp̚ tɕ͈u kʰa da, nʌp̚ t͈uŋ ɡɯl da e sʌ nɯn  je ø ɾɯl mo dɯn ta nʌ e mu dʑo ɡʌn il ban hwa ha dʑi ma ɕi o.

pat̚ tɕʰim , ,  ty t͈a ɾɯ nɯn so ɾi e t͈a ɾa kʌ sen so ɾi dø ɡi, tʰal lak̚, pi ɯm ɡwa ɰi kjʌl ha bi tal la dʑin da. no kʰo, tɕoː tʰʌn, s͈a tɕʰi, man kʰo, an tʰʌn, tal tɕʰi, ka kʰa, mʌ kʰi da, pal kʰi da, ma tʰjʌŋ, tɕo pʰi da, nʌl pʰi da, k͈o tɕʰi da, an tɕʰi da, i pʰa ɡɯl pi ɡjo ha ɕi o. , ,   , ,  o nɯn   ty e  o nɯn kjʌŋ u ɾɯl ku bjʌl ha ɡo, taː s͈o, maːn s͈o, ɕil s͈o ɰi pa ɾɯ mɯl hwa ɡin ha ɕi o. non nɯn, s͈an ne, man ne, an nɯn, ɕil le, t͈ul lɯ ne sʌ nɯn   kjʌl ham mit̚ ju ɯm hwa ɰi tɕʌ ɡjoŋ sun sʌ ɾɯl sal pʰjʌ bo ɕi o. na ɯn, no a, s͈a i da, ma na, a nɯn, ta ɾa, ɕil ʌ do e sʌ nɯn mo ɯ mɯ ɾo ɕi dʑa kʰa nɯn ʌ mi a pʰe sʌ ɰi   pjʌn hwa ɾɯl hwa ɡin ha ɕi o. o tʰan pʌl, na tʰan t͈ɛ, k͈o tʰan soŋ i, su tʰa da e sʌ nɯn ta nʌ kjʌŋ ɡje ɾɯl lʌm nɯn pa ɾɯm do kʌm dʑɯŋ ha ɕi o.

hot̚ p͈at̚ tɕʰim ɡwa s͈aŋ bat̚ tɕʰi mi mo ɯ mɯ ɾo ɕi dʑa kʰa nɯn tɕo sa, ʌ mi, tɕʌm mi sa wa kjʌl ha pʰa mjʌn jʌ nɯm dø nɯn kjʌŋ u ɡa it̚ t͈a. k͈a k͈a, o ɕi, i s͈ʌ, tɕ͈o tɕʰa, na dʑi, k͈o dʑa, k͈o tɕʰɯl, pa tʰe, a pʰɯ ɾo, tʌ pʰi da ɾɯl pi ɡjo ha ɕi o. kjʌp̚ p͈at̚ tɕʰi mi mo ɯ mɯ ɾo ɕi dʑa kʰa nɯn hjʌŋ ɕik̚ hjʌŋ tʰɛ so a pʰe ol t͈ɛ e nɯn tu tɕa ɯ mi pa ɾɯ mɯl ku bjʌl hɛ ja han da. nʌk̚ ɕ͈i, mok̚ ɕ͈i, kap̚ ɕ͈i, an dʑa, tal ɡɯl, tɕʌl mʌ, kol ɕ͈i, hal tʰa, ɯl pʰʌ, kap̚ s͈ɯl, ʌːp̚ s͈ʌ, jʌ dʌl bi, jʌ dʌl bɯl, pʰum s͈ak̚ ɕ͈i, pʰum s͈ak̚ s͈ɯl, pʰum s͈ak̚ s͈ɯ ɾo, ø ɡol s͈e ɾɯl pi ɡjo ha ɕi o. pan mjʌn pa ta ɾɛ, nɯ pap̚, tɕʌ dʌ mi, ma dʌp̚ t͈a, kʌ dot̚, hʌ du sɯm, k͈o twi, nʌ kʌp̚ t͈a, ta ka pʰe, ka bʌ tɕʰi, kap̚ ɕ͈in nɯ ne sʌ nɯn ɕil dʑil hjʌŋ tʰɛ so ɰi kjʌŋ ɡje wa tɛ pʰjo ɯ mi tɕʌ ɡjoŋ ɯl hwa ɡin ha ɕi o. ma ɕit̚ t͈a wa mʌ ɕit̚ t͈a nɯn [ma dit̚ t͈a], [mʌ dit̚ t͈a]ɾɯl wʌn tɕʰi ɡɯ ɾo ha dø [ma ɕit̚ t͈a], [mʌ ɕit̚ t͈a]ɰi hʌ joŋ pa ɾɯm do po dʑon ha ɕi o.

han ɡɯl tɕa mo i ɾɯ me tɕo sa ɡa pun nɯn kjʌŋ u e nɯn il ban ta nʌ ɰi jʌ nɯm kju tɕʰi ɡɯl kɯ dɛ ɾo tɕʌ ɡjoŋ ha dʑi mal ɡo pjʌl do ɰi kju dʑʌŋ ɯl hwa ɡin ha ɕi o. ki jʌ ɡi, ki jʌ ɡɯl, ki jʌ ɡe, ni ɯ ni, ni ɯ nɯl, ti ɡɯ ɕi, ti ɡɯ sɯl, ti ɡɯ se, ɾi ɯ ɾi, ɾi ɯ ɾɯl, mi ɯ mi, mi ɯ mɯl, pi ɯ bi, pi ɯ bɯl, ɕi o ɕi, ɕi o sɯl, i ɯŋ i, i ɯŋ ɯl, tɕi ɯ ɕi, tɕi ɯ sɯl, tɕʰi ɯ ɕi, tɕʰi ɯ sɯl, kʰi ɯ ɡi, kʰi ɯ ɡɯl, tʰi ɯ ɕi, tʰi ɯ sɯl, pʰi ɯ bi, pʰi ɯ bɯl, hi ɯ ɕi, hi ɯ ɯ ɾi pa ɾɯ mɯl kʌm dʑɯŋ ha ɕi o.

pat̚ tɕʰim , ,  tɕo sa na tɕʌm mi sa ɰi  kjʌl ha pʰal t͈ɛ e nɯn ku ɡɛ ɯm hwa ɡa i ɾʌ nal su it̚ t͈a. ko dʑi dɯt̚ t͈a, ku dʑi, miː da dʑi, t͈am ba dʑi, pa tɕʰi, pjʌ hul tɕʰi ɾɯl pi ɡjo ha ɕi o. ku tɕʰi da, ta tɕʰi da, mu tɕʰi da e sʌ nɯn   kjʌl ha pʰan ty ɰi pa ɾɯm do hwa ɡin ha ɕi o. ku ɡɛ ɯm hwa nɯn , , , , , ,  ɕi dʑa kʰa nɯn mo dɯn hwan ɡjʌŋ e mu dʑo ɡʌn tɕʌ ɡjoŋ dø nɯn kju tɕʰi ɡi a ni da. pa tʰe ɾɯl pa tɕʰi wa ka tʰɯn paŋ ɕi ɡɯ ɾo tɕʰʌ ɾi ha dʑi ma ɕi o.

pi ɯm hwa ɰi je ɾo mʌŋ nɯn, kuŋ mul, k͈aŋ nɯn, kʰi ɯŋ man, moŋ mok̚ ɕ͈i, kɯŋ nɯn, hɯŋ man, tan nɯn, tɕiːn nɯn, on mɛp̚ ɕ͈i, in nɯn, man nɯn, tɕʌn mʌŋ ul, tɕ͈on nɯn, k͈on maŋ ul, pun nɯn, non nɯn, tɕam nɯn, pam mul, am ma daŋ, paːm nɯn, ɯm nɯn, ʌːm nɯn, kam mɛ da ɾɯl pi ɡjo ha ɕi o. tɕʰɛŋ nʌn nɯn da, hɯŋ mal li da, on mat̚ tɕʰu da, pam mʌŋ nɯn da, kam mɛ ɡi da e sʌ nɯn ta nʌ sa i ɰi pi ɯm hwa do hwa ɡin ha ɕi o.   pi ɯm hwa nɯn tɕʰim njak̚, kaŋ nɯŋ, maŋ non, sʌŋ nju, hjʌm njʌk̚, pʌm ni, kuŋ nip̚, toŋ nim mu ne sʌ kʌm dʑɯŋ ha ɕi o.   in dʑʌ pʰa nɯn kjʌŋ u e nɯn naːl lo, ɕil la, tɕʰʌl li, kwaːŋ hal lu, tɛː kwal ljʌŋ, kal lal, mul lal li, hal lɯn dʑi, tal lɯn, t͈ul lɯn, hal le ɾɯl pi ɡjo ha ɕi o. ɰiː ɡjʌn nan, imː dʑin nan, sɛŋ san njaŋ, kjʌl t͈an njʌk̚, koŋ k͈wʌn njʌk̚, toŋː wʌn njʌŋ, saŋ ɡjʌn nje, hweŋ dan no, iː wʌn non, i bwʌn njo, ku ɡɯl lju tɕʰʌ ɾʌm hjʌŋ tʰɛ ɡa ta ɾɯn han dʑa ʌ do hwa ɡin ha dø, mo dɯn  ka tʰɯn kju tɕʰi ɡɯ ɾo tɕʰʌ ɾi ha dʑi ma ɕi o.

pʰjo dʑun pa ɾɯ mɯ ɾo in dʑʌŋ dø dʑi an nɯn tɕa ɯm toŋ hwa ɾɯl ku bjʌl ha ɡi y hɛ kaːm ɡi, ot̚ k͈am, it̚ k͈o, k͈ot̚ k͈il, tɕʌn mʌ ɡi, mun p͈ʌp̚, k͈ot̚ p͈a tʰɯl kʌm dʑɯŋ ha ɕi o. hɯn hi tɯl li nɯn pa ɾɯ mi ɾa nɯn i ju ma nɯ ɾo pʰjo dʑun pa ɾɯ mɯ ɾo sɯŋ in ha dʑi mal ɡo, koŋ ɕik̚ kju dʑʌŋ e mjʌŋ ɕi døn ɯ mun hwan ɡjʌŋ ɡwa ʌ hy bjʌl kɯn ɡʌ ɾɯl hwa ɡin ha ɕi o. tø ʌ wa tø jʌ, pʰi ʌ wa pʰi jʌ, i o wa i jo, a ni o wa a ni jo e sʌ nɯn hʌ joŋ dø nɯn mo ɯm toŋ hwa ɾɯl hwa ɡin ha dø,   k͈ɯn na nɯn mo dɯn ʌ ɡa ne ka tʰɯn hʌ joŋ ɯl tɕʌ ɡjoŋ ha dʑi ma ɕi o.

tɕaŋ ɛ ɯm pat̚ tɕʰim ty ɰi kjʌŋ ɯm hwa ɾɯl hwa ɡin ha ɡi y hɛ kuk̚ p͈ap̚, k͈ak̚ t͈a, nʌk̚ p͈a dʑi, sak̚ t͈on, tak̚ tɕ͈aŋ, tɕʰik̚ p͈ʌm, p͈ʌt̚ t͈ɛ da, ot̚ k͈o ɾɯm, it̚ t͈ʌn, k͈ot̚ k͈o, k͈ot̚ t͈a bal, nat̚ s͈ʌl da, pat̚ k͈a ɾi, sot̚ tɕ͈ʌn, kop̚ t͈ol, tʌp̚ k͈ɛ, jʌp̚ tɕ͈ip̚, nʌp̚ tɕ͈u kʰa da, ɯp̚ tɕ͈o ɾi da, kap̚ tɕ͈i da ɾɯl pi ɡjo ha ɕi o. ʌ ɡan pat̚ tɕʰim , , ,   jʌn ɡjʌl dø nɯn ʌ mi ɰi tɕʰʌt̚ s͈o ɾi , , ,  kjʌŋ ɯm hwa dø nɯn hwan ɡjʌŋ e sʌ nɯn anː t͈a, anː k͈o, anː tɕ͈i, kaːm t͈a, kamː k͈o, kamː tɕ͈i, an k͈o, an tɕ͈i, saːm k͈o, samː tɕ͈i, tɕʌmː k͈o, tɕʌm tɕ͈i ɾɯl hwa ɡin ha ɕi o. kɯ ɾʌ na an ɡi da, kam ɡi da, kum ɡi da, om k͈i ɡi ɰi pʰi doŋ·sa doŋ tɕʌm mi sa -ki nɯn ka tʰɯn paŋ ɕi ɡɯ ɾo tøn so ɾi hwa ha dʑi an nɯn da. ʌ ɡan pat̚ tɕʰim ,   nʌl k͈e, hal t͈a, hul s͈o, t͈ʌl tɕ͈i do pi ɡjo ha ɕi o.

han dʑa ʌ e sʌ   ty e , ,  jʌn ɡjʌl dø nɯn kjʌŋ u e nɯn kal t͈ɯŋ, pal t͈oŋ, tɕʌl t͈o, mal s͈al, pul s͈o, il ɕ͈i, kal tɕ͈ɯŋ, mul tɕ͈il, pal tɕ͈ʌn, mol s͈aŋ ɕik̚, pul se tɕʰu ɾɯl hwa ɡin ha ɕi o. kɯ ɾʌ na hʌ hʌ ɕil ɕil ɡwa tɕʌl dʑʌl ha da nɯn mu dʑo ɡʌn kjʌŋ ɯm hwa ha dʑi an nɯn je ø ɾo ku bjʌl ha ɕi o. kwan hjʌŋ sa hjʌŋ -(ɯ)  kjʌŋ ɯm hwa nɯn hal k͈ʌl, hal p͈a k͈e, hal s͈e ɾa, hal s͈u ɾok̚, hal tɕ͈in dɛ, hal tɕ͈i ɾa do, hal dʑi ʌn dʑʌŋ ɡwa hal k͈ʌ sɯl, kal t͈e ɡa, hal p͈a ɾɯl, hal s͈u nɯn, hal tɕ͈ʌ ɡe, kal k͈ot̚, hal t͈o ɾi, man nal sa ɾa me sʌ hwa ɡin ha ɕi o. hap̚ s͈ʌŋ ʌ ɰi kjʌŋ ɯm hwa nɯn mun k͈o ɾi, nun t͈oŋ dʑa, ɕin p͈a ɾam, san s͈ɛ, son tɕ͈ɛ dʑu, kil k͈a, mul t͈oŋ i, pal p͈a tak̚, kuːl s͈ok̚, sul tɕ͈an, pa ɾam k͈jʌl, kɯ mɯm t͈al, a tɕʰim p͈ap̚, tɕam tɕ͈a ɾi, kaŋ k͈a, tɕʰo sɯŋ t͈al, tɯŋ p͈ul, tɕʰaŋ s͈al, kaŋ dʑul ɡi ɾɯl pi ɡjo ha dø, hap̚ s͈ʌŋ ʌ ɾa nɯn i ju ma nɯ ɾo mo dɯn tɕʰʌt̚ s͈o ɾi ɾɯl kjʌŋ ɯm hwa ha dʑi ma ɕi o.

hap̚ s͈ʌŋ ʌ wa pʰa sɛŋ ʌ e sʌ  tɕʰʌm ɡa dø nɯn hwan ɡjʌŋ ɯl hwa ɡin ha ɡi y hɛ soːm ni bul, hon ni bul, maŋ nil, saŋ nil, mɛn nip̚, k͈on nip̚, nɛː boŋ ɲak̚, han ɲʌ ɾɯm, nam dʑon ɲʌ bi, ɕin ɲʌ sʌŋ, sɛŋ ɲʌn pʰil, tɕi kʰɛŋ ɲʌl tɕʰa, nɯŋ maŋ ɲʌm, kʰoŋ ɲʌt̚, taːm ɲo, nun ɲo ɡi, jʌŋ ʌm ɲoŋ, ɕi ɡjoŋ ɲu, pɛk̚ p͈un ɲul, kuŋ min ɲjul li, pa mju tɕʰɯl pi ɡjo ha ɕi o.   ty e  tɕʰʌm ɡa dø mjʌn  pa ɾɯm dø nɯn je ɾo sʌ ul ljʌk̚, mul ljak̚, pul ljʌ u, tɯlː lil, sol lip, sʌl lik t͈a, mul ljʌt̚, hwi pal lju, ju dɯ ɾju dɯ ɾɯl hwa ɡin ha ɕi o. sʌ ɾɯn ɲʌ sʌt̚, sɯ mul ljʌ sʌt̚, sam ɲʌn dɛ, il ljʌn dɛ, han nil, on nip̚ t͈a, mʌ ɡɯn njʌt̚, hal lil, tɕal lip̚ t͈a, mʌ ɡɯl jʌ se sʌ nɯn tɕʰʌm ɡa ɡa tɕʌ ɡjoŋ dø nɯn hjʌŋ tʰɛ wa mun mɛ ɡɯl pi ɡjo ha ɕi o. i dʑuŋ ni dʑuk̚, ja ɡɯm ɲa ɡɯm, kʌːm ɲʌl, jol laŋ ɲol laŋ, kɯ mjuŋ e sʌ nɯn hʌ joŋ dø nɯn pa rɯ mi tɛ a nɯl po dʑon ha ɕi o. ju ɡi o, sa mil tɕ͈ʌl, soːŋ bjʌ ɾjʌn, tɯŋ joŋ mu nɯn tɕa doŋ dʑʌ ɡin   tɕʌ ɡjoŋ ha dʑi an nɯn tɛ dʑo sa ɾje i da.

sa i ɕi ot̚ k͈wa kwal ljʌn døn pa ɾɯ mɯn pʰjo ɡi wa hap̚ s͈ʌŋ ʌ ku dʑo, ty t͈a ɾɯ nɯn so ɾi, ʌ hy bjʌl hʌ joŋ pa ɾɯ mɯl ham k͈e hwa ɡin hɛ ja han da. nɛː k͈a, sɛː k͈il, p͈al lɛ t͈ol, kʰo t͈ɯŋ, ki p͈al, tɛː pʰɛ p͈ap̚, hɛ s͈al, pɛ s͈ok̚, pɛ tɕ͈ʌn, ko ɡɛ tɕ͈it̚, kʰon nal, a ɾɛn ni, tʰøːn ma ɾu, pɛn mʌ ɾi, pe ɡɛn nit̚, kɛn nip̚, na mun nip̚, to ɾi ɡɛn ɲʌl, ty ɕju tɕʰɯl pi ɡjo ha ɕi o. tøn so ɾi ɾo pa ɾɯm dø nɯn kjʌŋ u,  pa ɾɯm dø nɯn kjʌŋ u,  tɕʰʌm ɡa dø nɯn kjʌŋ u, pʰjo dʑu ne sʌ hʌ joŋ ha nɯn tɛ a ni in nɯn kjʌŋ u ɾɯl kak̚ k͈ak̚ ki ɾo kʰa ɕi o. sa i ɕi o ɕi pʰjo ɡi dø ʌ it̚ t͈a nɯn i ju ma nɯ ɾo ʌn dʑe na ka tʰɯn so ɾi ɾɯl sa bi pʰa ɡʌ na mo dɯn hap̚ s͈ʌŋ ʌ e toŋ il han kju tɕʰi ɡɯl tɕʌ ɡjoŋ hɛ sʌ nɯn an tøn da.

tɕʰø dʑoŋ kʌm dʑɯŋ e sʌ nɯn tɕehaŋ ɰi wʌn tɕʰik̚ p͈u tʰʌ tɕehaŋ ɰi sa i ɕi ot̚ pa ɾɯm k͈a dʑi, kak̚ haŋ ɰi pon mun ɡwa pu tʰim, je ø, hʌ joŋ pa ɾɯ mɯl pjʌl do ɰi kʌm dʑɯŋ haŋ mo ɡɯ ɾo tɯŋ no kʰa ɕi o. mo dɯn je mu ne nɯn han ɡɯl wʌn mun, hjʌŋ tʰɛ so mit̚ ɯm dʑʌl ku dʑo, tɕʌ ɡjoŋ dø nɯn kju dʑʌŋ ɡwa sun sʌ, pʰjo dʑun pa rɯ mi kɯn ɡʌ, , u kʰɯ ɾa i na ʌ ɯm sʌŋ tɕʌ ɡɯŋ, u kʰɯ ɾa i na ʌ ɕi ɾjoŋ pʰjo ɡi ɾɯl ki ɾo kʰa ɕi o. pʰjo dʑun pa ɾɯ mi hwa ɡin døn kjʌŋ u wa kju tɕʰi ɡɯ ɾo bu tʰʌ to tɕʰul han kjʌŋ u, sa dʑʌ ni kɛ bjʌl ʌ hy tɕʌŋ bo ɡa pʰi ɾjo han kjʌŋ u, pok̚ s͈u pa ɾɯ mi hʌ joŋ dø nɯn kjʌŋ u ɾɯl ku bjʌl ha ɕi o. kɯn ɡʌ ɡa pu dʑo kʰa ɡʌ na hjʌŋ tʰɛ so kjʌŋ ɡje ɾɯl pʰan dan hal su ʌːm nɯn haŋ mo ɡɯn mi hwak̚ tɕ͈ʌŋ ɯ ɾo nam ɡi ɡo, pʰjo ɡi ma nɯ ɾo tɕʰu tɕʰɯ kʰan kjʌl ɡwa ɾɯl pʰjo dʑun pa ɾɯ mɯ ɾo tɕe ɕi ha dʑi ma ɕi o. ka hwak̚ tɕ͈ʌŋ dø ɡi tɕʌ ne nɯn u kʰɯ ɾa i na ʌ  sɛŋ sʌŋ ha dʑi ma ɕi o.

~~~

### Practical mode: Ukrainian
~~~text
куннімкуґовон пйоджун паримбоп че1ганбуто че30ганкаджіий чонгап комджин чарйо

пйоджун паримбобин пйоджуноий шілче паримил таридве куґоий чонтонсонґва гамнісонил корйогайо чонгамил вончіґиро ганда. тарасо ганґил пйоґіва шілче паримі гансан ілчігандаґо каджонгесонин ан твенда. пйоджуноий чаим 19кева моим 21ке, танмоимґва іджун моим, имі кірі, патчімі тепйоим, кйоппатчімі тансунгва, йоним, имі тонгва, кйонимгва, имі чомґарил чарєро салпйобоґо, как кюджоний чоґйон гванґйонґва єве, гойондвенин парим, гойондведжі аннин паримил кубйолгашіо.

чаимин ㄱ, ㄲ, ㄴ, ㄷ, ㄸ, ㄹ, ㅁ, ㅂ, ㅃ, ㅅ, ㅆ, ㅇ, ㅈ, ㅉ, ㅊ, ㅋ, ㅌ, ㅍ, ㅎий 19кеімйо, моимин ㅏ, ㅐ, ㅑ, ㅒ, ㅓ, ㅔ, ㅕ, ㅖ, ㅗ, ㅘ, ㅙ, ㅚ, ㅛ, ㅜ, ㅝ, ㅞ, ㅟ, ㅠ, ㅡ, ㅢ, ㅣий 21кеіда. салґва сал, кава ка, тава та, пава па, чава ча, сава сарил піґйогадве, пйоґіе натанан чаимил іміро тарин чаимиро пакуджі машіо.

ㅏ, ㅐ, ㅓ, ㅔ, ㅗ, ㅚ, ㅜ, ㅟ, ㅡ, ㅣнин танмоимиро паримгамил вончіґиро гаґо, ㅚва ㅟнин іджун моимиро паримганин котто гойонганда. ㅑ, ㅒ, ㅕ, ㅖ, ㅘ, ㅙ, ㅛ, ㅝ, ㅞ, ㅠ, ㅢнин іджун моимиро паримганда. таман каджіова каджо, чіова чо, тачіова тачйорил піґйогайо чо, чо, чйоий шілче пйоджун паримил гваґінгашіо. кєджіп, кєшіда, шіґє, йонґє, мєбйол, кепє, гєтек, чігєесонин єва рє івеий ㅖе гойондвенин [] паримил гваґінгашіо. ніллірі, нінким, муні, тіосиґі, шіо, тіо, гіо, гітопта, гіман, югіесонин чаимил чотсоріро каджінин имджорі ㅢрил []ро паримгашіо. чуий, гьобі, уріий, канийий, париміесонин таноий чосимджол івее натананин ийва чоса ийий вончікчоґін парим міт гойон паримил кубйолгашіо.

нунбора, малші, памнаму, манта, моллі, поллідаесонин чосимджорі кінсорірил гваґінгашіо. чоннун, чаммал, сандонпам, нунмолта, тоболлідаесонин чалбинсоріий теджорил салпіґо, суманінин гедан ганмоґі єверо кубйолгашіо. паншінбаніва чесамджесаесонин гапсоноесоий кірірил гваґінгашіо. пва, кйо, тве, тво, гева ва, чо, чо, чйорил піґйогайо чуґякхьоний чанданимил кубйолгашіо. камта, папта, шінта, алда, килта, толда, полда, силда, толта, оптава камині, палбимйон, шіно, ара, киро, толбин, поро, соро, опсинірил піґйогашіо. камґіда, коіда, папідава килліда, толліда, опседаесонин чоммісае тарин кіріий пйонгвава єверил гваґінгашіо. мілмулґва солмурин кусон йосоий кірірил тансунгі гапсангесо паримгаджі машіо.

патчімиро паримдвенин чаимин ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅇий ілґоп каджііда. пак, пуок, накта, такта, кіик, от, утта, ітта, чот, піт, кот, чотта, сот, петта, ап, іп, суп, топтарил омалґва чаим апесо піґйогашіо. нок, анта, йодол, нолта, веґол, галта, капсесонин ㄳ, ㄵ, ㄼ, ㄽ, ㄾ, ㅄий тансунгварил гваґінгашіо. так, гик, макта, никчі, сам, чомта, ипкоесонин ㄺ, ㄻ, ㄿий паримил піґйогашіо. тикі макта[макта]ва малко[малко], мулко[мулко], нилко[нилко], ікта[ікта]ва ілко[ілко], пукта[пукта]ва пулко[пулко]ий чаірил гваґінгашіо. папта, папчі, папко, палбиніва нолта, нопчукада, ноптунґилдаесонин ㄼий єверил модин таное муджоґон ілбангвагаджі машіо.

патчім ㅎ, ㄶ, ㅀин твітаринин соріе тара косенсорідвеґі, таллак, піимґваий кйолгабі талладжінда. ноко, чотон, сачі, манко, антон, талчі, кака, мокіда, палкіда, матйон, чопіда, нолпіда, кочіда, анчіда, іпаґил піґйогашіо. , ,  твіе ㄱ, ㄷ, ㅈі онин кйонува ㅎ твіе ㅅі онин кйонурил кубйолгаґо, тасо, мансо, шілсоий паримил гваґінгашіо. ноннин, санне, манне, аннин, шілле, туллинесонин ㅎква ㄴий кйолгап міт юимгваий чоґйон сунсорил салпйобошіо. наин, ноа, саіда, мана, анин, тара, шілодоесонин моимиро шіджаканин омі апесоий  квалльон пйонгварил гваґінгашіо. о тан пол, на танте, ко тан соні, сутадаесонин тано кйонґєрил номнин паримдо комджингашіо.

готпатчімґва санбатчімі моимиро шіджаканин чоса, омі, чоммісава кйолгапамйон йонимдвенин кйонуґа ітта. кака, оші, ісо, чоча, наджі, коджа, кочил, пате, апиро, топідарил піґйогашіо. кйоппатчімі моимиро шіджаканин гьоншік гьонтесо апе ол теенин ту чаимі паримил кубйолгея ганда. нокші, мокші, капші, анджа, талґил, чолмо, колші, галта, илпо, капсил, опсо, йодолбі, йодолбил, пумсакші, пумсаксил, пумсаксиро, веґолсерил піґйогашіо. панмйон па таре, ни пап, чодомі, мадопта, кодот, годусим, ко тві, но копта, та капе, кабочі, капшіннинесонин шілджіл гьонтесоий кйонґєва тепйоимі чоґйонил гваґінгашіо. машіттава мошіттанин [мадітта], [модітта]рил вончіґиро гадве [машітта], [мошітта]ий гойон паримдо поджонгашіо.

ганґил чамо іриме чосаґа пуннин кйонуенин ілбан таноий йоним кючіґил кидеро чоґйонгаджі малґо пйолдоий кюджонил гваґінгашіо. кійоґі, кійоґил, кійоґе, ніині, ніинил, тіґиші, тіґисил, тіґисе, ріирі, ріирил, міимі, міимил, піибі, піибил, шіоші, шіосил, іині, іинил, чіиші, чіисил, чіиші, чіисил, кіиґі, кіиґил, тіиші, тіисил, піибі, піибил, гіиші, гіиирі паримил комджингашіо.

патчім ㄷ, ㅌ, ㄾі чосана чоммісаий ㅣва кйолгапал теенин куґеимгваґа іронал су ітта. коджідитта, куджі, мідаджі, тамбаджі, пачі, пйогулчірил піґйогашіо. кучіда, тачіда, мучідаесонин ㄷква ㅎі кйолгапан твіий паримдо гваґінгашіо. куґеимгванин , , , , , , ㅔро шіджаканин модин гванґйоне муджоґон чоґйондвенин кючіґі аніда. патерил пачіва катин паншіґиро чорігаджі машіо.

піимгваий єро моннин, кунмул, каннин, кіинман, монмокші, киннин, гинман, таннин, чіннин, онмепші, іннин, маннин, чонмонул, чоннин, конманул, пуннин, ноннин, чамнин, паммул, аммадан, памнин, имнин, омнин, каммедарил піґйогашіо. чек ноннинда, гик малліда, от матчуда, пап моннинда, кап меґідаесонин тано саіий піимгвадо гваґінгашіо.  апі піимгванин чімняк, каннин, маннон, сонню, гьомньок, помні, кунніп, тонніммунесо комджингашіо. ㄴква ㄹі інджопанин кйонуенин налло, шілла, чоллі, квангаллу, теквалльон, каллал, муллаллі, галлинджі, таллин, туллин, галлерил піґйогашіо. ийґйоннан, імджіннан, сенсаннян, кйолтанньок, конквонньок, тонвонньон, санґйоннє, гвенданно, івоннон, ібвонньо, куґиллючором гьонтеґа тарин ганджаодо гваґінгадве, модин ㄹил катин кючіґиро чорігаджі машіо.

пйоджун паримиро інджондведжі аннин чаим тонгварил кубйолгаґі віге камґі, откам, ітко, коткіл, чонмоґі, мунпоп, котпатил комджингашіо. гингі тиллінин париміранин іюманиро пйоджун паримиро синінгаджі малґо, коншік кюджоне мйоншідвен имун гванґйонґва огвібйол кинґорил гваґінгашіо. твеова твейо, піова пійо, іова ійо, аніова анійоесонин гойондвенин моим тонгварил гваґінгадве, ㅐна ㅔро киннанин модин оґане катин гойонил чоґйонгаджі машіо.

чанеим патчім твіий кйонимгварил гваґінгаґі віге кукпап, какта, нокпаджі, сактон, такчан, чікпом, поттеда, откорим, іттон, котко, коттабал, натсолда, паткарі, сотчон, коптол, топке, йопчіп, нопчукада, ипчоріда, капчідарил піґйогашіо. оґан патчім , , ,  твіе йонґйолдвенин оміий чотсорі ㄱ, ㄷ, ㅅ, ㅈі кйонимгвадвенин гванґйонесонин анта, анко, анчі, камта, камко, камчі, анко, анчі, самко, самчі, чомко, чомчірил гваґінгашіо. кирона анґіда, камґіда, кумґіда, омкіґіий підон·садон чомміса -кінин катин паншіґиро твенсорігвагаджі аннинда. оґан патчім ,  твіий нолке, галта, гулсо, толчідо піґйогашіо.

ганджаоесо  патчім твіе ㄷ, ㅅ, ㅈі йонґйолдвенин кйонуенин калтин, палтон, чолто, малсал, пулсо, ілші, калчин, мулчіл, палчон, молсаншік, пулсечурил гваґінгашіо. кирона гогошілшілґва чолджолгаданин муджоґон кйонимгвагаджі аннин єверо кубйолгашіо. квангьонсагьон -(и) твіий кйонимгванин галкол, галпаке, галсера, галсурок, галчінде, галчірадо, галджіонджонґва гал косил, кал теґа, гал парил, гал сунин, гал чоґе, кал кот, гал торі, маннал сарамесо гваґінгашіо. гапсоноий кйонимгванин мункорі, нунтонджа, шінпарам, сансе, сончеджу, кілка, мултоні, палпатак, кулсок, сулчан, парамкйол, кимимтал, ачімпап, чамчарі, канка, чосинтал, тинпул, чансал, канджулґірил піґйогадве, гапсоноранин іюманиро модин чотсорірил кйонимгвагаджі машіо.

гапсонова пасеноесо ㄴі чомґадвенин гванґйонил гваґінгаґі віге сомнібул, гоннібул, манніл, санніл, менніп, конніп, небонняк, ганньорим, намджонньобі, шінньосон, сенньонпіл, чікенньолча, нинманньом, конньот, тамньо, нунньоґі, йономньон, шіґйонню, пекпуннюл, кунмінньюллі, памючил піґйогашіо.  патчім твіе ㄴі чомґадвемйон ㄹро паримдвенин єро соулльок, мулляк, пулльоу, тилліл, солліп, соллікта, мулльот, гвіпаллю, юдирюдирил гваґінгашіо. соринньосот, симулльосот, сам ньонде, іл льонде, ган іл, от іпта, моґин йот, гал іл, чал іпта, моґил йосесонин чомґаґа чоґйондвенин гьонтева мунмеґил піґйогашіо. іджунніджук, яґимняґим, комньол, йолланньоллан, кимюнесонин гойондвенин паримі теанил поджонгашіо. юґіо, самілчол, сонбйорйон, тинйонмунин чадонджоґін ㄴ чомґарил чоґйонгаджі аннин теджо сарєіда.

саішіотква квалльондвен паримин пйоґіва гапсоно куджо, твітаринин сорі, огвібйол гойон паримил гамке гваґінгея ганда. нека, секіл, паллетол, котин, кіпал, тепепап, гесал, песок, печон, коґечіт, коннал, аренні, твенмару, пенморі, пеґенніт, кенніп, намунніп, торіґенньол, твішючил піґйогашіо. твенсоріро паримдвенин кйону, ㄴиро паримдвенин кйону, ㄴі чомґадвенин кйону, пйоджунесо гойонганин теані іннин кйонурил каккак кірокашіо. саішіоші пйоґідвео іттанин іюманиро онджена катин сорірил сабіпаґона модин гапсоное тонілган кючіґил чоґйонгесонин ан твенда.

чведжон комджинесонин че1ганий вончікпуто че30ганий саішіот паримкаджі, как ганий понмунґва путім, єве, гойон паримил пйолдоий комджин ганмоґиро тиннокашіо. модин ємуненин ганґил вонмун, гьонтесо міт имджол куджо, чоґйондвенин кюджонґва сунсо, пйоджун паримі кинґо, IPA, укираінао имсон чоґин, укираінао шірйон пйоґірил кірокашіо. пйоджун паримі гваґіндвен кйонува кючіґиробуто точулган кйону, саджоні кебйол огві чонбоґа пірйоган кйону, поксу паримі гойондвенин кйонурил кубйолгашіо. кинґоґа пуджокаґона гьонтесо кйонґєрил пандангал су омнин ганмоґин мігвакчониро намґіґо, пйоґіманиро чучикан кйолґварил пйоджун паримиро чешігаджі машіо. IPAка гвакчондвеґі чоненин укираінао транскрипцію сенсонгаджі машіо.

~~~

## Research-output fidelity bug: standalone Jamo inventories — 2026-10-22

### Reproduced diagnosis

Inspection of the recorded strict whole-text IPA output showed inventory positions rendered as empty comma-separated slots, for example the passage's consonant/vowel inventory sections. The source contains isolated compatibility Jamo as *orthographic/linguistic notation*, not as pronounceable syllables. In `src/app/engine_convert.js`, the `u.type === 'jamo'` branch previously assigned both `output[i]` and `ipa[i]` to empty strings. That correctly withheld unsupported IPA but also silently deleted the Jamo from the Ukrainian/documentary output.

### Correction made

- Recognize multi-item comma/dot/slash-separated Jamo inventories as literal orthographic notation. Preserve those inventory symbols in the output while excluding them from IPA and phonological analysis; isolated Jamo outside recognized inventories remain unresolved and are not emitted as Ukrainian pronunciation.
- Add regressions asserting that consonant and vowel inventories round-trip unchanged both alone and inside explanatory Korean prose, receive no fabricated IPA, and are not labelled as pronounceable Korean words.

### Verification status

Implementation branch: `fix/research-jamo-notation-preservation-2026-10-22`. This is a targeted source-fidelity correction, not a linguistic rule correction. CI must pass the new regression and full browser suite, and the full-passage output must be checked to confirm that isolated Jamo are no longer deleted. This does not establish normative correctness of generic IPA or exhaustive coverage of *표준 발음법* articles 1–30.
