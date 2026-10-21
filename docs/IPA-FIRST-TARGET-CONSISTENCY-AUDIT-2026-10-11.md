# IPA-first Ukrainian target consistency audit — 2026-10-11

## Question and scope

Does every Ukrainian syllable stored in the curated Korean lexical layer reproduce exactly from its aligned IPA syllable under the project's declared IPA → Ukrainian mapping?

This audit checks **pipeline consistency**, not whether the source IPA or Ukrainian approximation is linguistically ideal. The official Korean standard governs Korean pronunciation, not Ukrainian transcription. Target choices therefore remain project-level mappings and retain their existing confidence/status labels.

## Method

- Read the complete `data/korean/lexical_pronunciations.csv` corpus at the branch head.
- Independently apply the declared longest-match IPA → Ukrainian token table to each `ipa_syllables` segment, stripping vowel-length marks in the same way as the runtime mapper.
- Compare each computed segment to the corresponding `target_syllables` segment.
- Repeat the comparison for every stored alternate reading using `alternate_ipa_syllables` and `alternate_target_syllables`.
- Add a regression test with an independent test-side mapping oracle so future lexical edits cannot silently make the target disagree with the IPA layer.

## Results

| Measure | Result |
|---|---:|
| Primary lexical rows checked | 637 |
| Alternate readings checked | 44 |
| Primary IPA/target segment mismatches | 0 |
| Alternate IPA/target segment mismatches | 0 |
| Unmapped IPA segments | 0 |

The test is recorded in `tests/model-wide-target-consistency.test.mjs` as **“all lexical Ukrainian targets are mechanically reproducible from their IPA, including variants”**.

## Interpretation and limitations

- The zero-mismatch result supports the architectural invariant that stored Ukrainian targets are reproducible from the IPA layer; it does not independently validate each Korean surface pronunciation against NIKL.
- It does not prove that the project's Ukrainian approximation is the only valid or best Ukrainian rendering. These mappings are not prescribed by the Korean standard and must remain labelled according to the row's existing target status.
- The test oracle intentionally duplicates the declared mapping table. If the production IPA mapper changes, the oracle should be reviewed and updated explicitly rather than automatically importing implementation details that could make the test tautological.
- The 637-row count is a snapshot. When rows are intentionally added or removed, update the snapshot assertion after reviewing the corpus delta.


## Normative coverage follow-up

A comparison against the official examples quoted in NIKL's §12 guidance found that the coda-plus-ㅎ aspiration example **각하[가카]** was missing from the curated lexical corpus, although the related examples were already present. Added it as a source-backed row with IPA `ka|kʰa`, a provisional Ukrainian target, and a regression assertion. This closes the inventory gap for that enumerated example; it does not imply complete coverage of every productive coda–ㅎ combination.

Official NIKL references:
- [Standard Pronunciation Rule §12, official examples](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002)
- [NIKL explanation of §12 and coda + ㅎ aspiration](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=303702)


## Normative coverage follow-up — §23 fortition examples

The §23 list in the official *표준 발음법* was checked against the lexical inventory. Five of its twenty enumerated examples were already represented; the other fifteen were missing as exact lexical rows. Added source-backed rows for:

- 국밥 [국빱]
- 깎다 [깍따]
- 삯돈 [삭똔]
- 닭장 [닥짱]
- 칡범 [칙뻠]
- 뻗대다 [뻗때다]
- 옷고름 [옫꼬름]
- 꽂고 [꼳꼬]
- 꽃다발 [꼳따발]
- 솥전 [솓쩐]
- 곱돌 [곱똘]
- 덮개 [덥깨]
- 옆집 [엽찝]
- 넓죽하다 [넙쭈카다]
- 읊조리다 [읍쪼리다]

The new regression pins all twenty enumerated §23 examples, checks the source-backed Korean surface form and stored IPA, and asserts that the Ukrainian result is generated from IPA. The Korean surface readings are sourced to the official NIKL standard; IPA is the project's broad phonetic rendering, and every Ukrainian target remains marked **provisional**.

This closes the inventory gap for the standard's enumerated §23 examples only. It does not establish exhaustive coverage of every productive fortition environment or every lexical exception.

Official source: [NIKL *표준 발음법*](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002).


## Surface-only lexical path coverage — 2026-10-21

The lexical inventory contains seven rows marked `surface-only`: `신라`, `밟는`, `읊다`, `읊고`, `앞문`, `희망`, and `독립문`. These rows intentionally preserve a source-backed Korean surface form and broad IPA while the Ukrainian target is still produced by the IPA mapping layer.

Added a model-wide regression that enumerates every current `surface-only` row and checks source/surface/IPA/target syllable alignment, the exact runtime surface and IPA, target equality with the IPA-derived stored mapping, and absence of unresolved issues. This closes a test-coverage gap in the previous model-wide consistency suite, which explicitly excluded `surface-only` rows. Exact-head CI passed **1,073/1,073 Node tests**, Vite build and Python regression/data-integrity tests: [CI run](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/39672160451).

This verifies the implementation boundary and internal data consistency only. It does **not** independently validate the IPA forms or establish the optimality of Ukrainian target choices. The seven rows and their evidence statuses remain subject to the existing source audit.


## IPA feature trace: vowel-length handling — 2026-10-22

- The IPA-to-Ukrainian adapter intentionally does not add a length mark to Ukrainian practical spelling, but the previous trace implementation removed `ː` before tokenization and did not expose that target-layer decision in the token trace.
- Updated `src/app/engine_ipa.js` so `traceIpaMapping` retains a structured feature record for every `ː` marker (`handling=omitted-from-ukrainian-target`, source offset, and an explicit Ukrainian explanation). The original IPA string remains unchanged and visible; Ukrainian output remains unchanged. The browser trace now renders the explanation alongside token mappings.
- Added regression tests proving the length marker is accounted for, target output is unchanged, and the UI displays the feature handling. The test uses a clearly labelled generic IPA sentinel; it does not add or claim any Korean IPA gold.
- Acceptance: verify the PR-head Node suite/build and Python regression suite. This is a transparency/traceability improvement, not a linguistic validation of Korean vowel length or of the target mapping. The independent 0/20 IPA-gold and Ukrainian-target review blockers remain unchanged.
