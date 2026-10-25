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


## Python runtime IPA-boundary correction — 2026-10-22

The earlier 637-row model-wide consistency check compared stored IPA and Ukrainian target fields against the browser's declared IPA mapping; it did not prove that the native Python API actually consumed the adapter output at runtime. A subsequent call-graph review found that `transliterate_korean()` ran `map_ipa_to_ukrainian()` but then overwrote the resulting orthography with `target_syllables` from the lexical CSV. This was a real Python-only bypass of the IPA boundary.

The bypass is removed in PR #224. Stored lexical Ukrainian forms are now exposed as `lexical_target_reference` with their original status and a comparison state; they do not change `ukrainian_orthography`. When the separate `ClippyFirst/Ukrainian-Phonetic-Inventory` package (expected version 0.8.0) is unavailable, the native Python engine returns unresolved target output instead of silently using the lexical reference. No second copy of the Ukrainian inventory was added.

Verification at final tested PR head `e5cc237075ce82b3d7e473a2de3dc352a186caef`: **1,136/1,136 Node tests passed**, Vite build passed, Python 3.11/3.12/3.13 passed, optional g2pK integration passed on Python 3.11/3.12, and master-table/corpus artifact checks passed. The change was merged as `aa2e9d17efc4c45686166d2a6950d2d8f309f457`. The post-merge Pages workflow has passed browser tests/build and Python validation; its final deploy job was queued when this checkpoint was written. This correction enforces the architecture boundary; it does not establish independent IPA gold or validate the Ukrainian target model.

### Follow-up: do not select an unmapped feature-nearest target — 2026-10-22

A further review of the Python target adapter found a second, adjacent risk: its candidate list includes target inventory phonemes with mapping_status=unmapped. Feature distance alone is not evidence for an IPA-to-Ukrainian correspondence, and an unmapped row could otherwise win the heuristic ranking.

- _select_target() now selects only candidates with an explicit mapping_id and a renderable target grapheme. It preserves ranking among licensed candidates; if a segment has no licensed candidate, the whole target remains unresolved.
- Added regressions for skipping an unmapped feature-nearest candidate in favor of the next mapped candidate, and returning unresolved when all candidates lack an explicit mapping.
- Lexical-target tests now treat stored Ukrainian strings as audit references only. Minimal CI intentionally does not install the external UPI package; there, expected behavior is ukrainian_orthography=null, target_status=unresolved, and lexical_target_comparison=unavailable_without_ipa_target, not a lexical fallback.
- This is a stricter evidence gate, not a claim that heuristic ranking is linguistically validated. Mapping rows with explicit IDs still need target-language review; independent broad-IPA gold and Ukrainian-target adjudication remain open.


### Exact-head correctness hardening — 2026-10-25

**Code under verification:** `b55df50cbc806497055c81cd29d309dc849ff9b2` on `fix/clippyfirst-core-ipa-target-2026-10-24`.

This pass closes a user-facing correctness gap: a `provisional` IPA→Ukrainian correspondence is no longer exposed as accepted `ukrainian` output. The Python renderer returns `ukrainian_orthography: null` plus a separate `candidate_orthography`; the browser native engine and practical g2pK adapter now withhold the complete accepted result if a provisional target occurs, retain a full `candidate_ukrainian`, label the candidate in the UI, and copy the candidate rather than an empty result. This applies to multiword input as well as single tokens. Korean phonology status remains separate from target-layer status; a target-layer uncertainty does not falsely relabel resolved IPA as unresolved Korean phonology.

Regression updates explicitly distinguish accepted orthography from candidate text and verify the IPA adapter reproduces candidate mappings in research opt-in mode. Verification on code head `b55df50cbc806497055c81cd29d309dc849ff9b2`:
- System verification: pass — [40183597497](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183597497); Python regression/data integrity and browser regression/build passed.
- Browser G2P: pass — [40183601946](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601946).
- Dedicated tests: pass — [40183601969](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601969): 1,220/1,220 web tests; Python 3.11, 3.12, 3.13 and wheel installation passed.
- Master table/research artifacts [40183601984](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601984), optional g2pK [40183601959](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601959), paired native/g2pK diagnostic [40183601967](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601967), UGTPHON diagnostic [40183601986](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601986), multi-engine diagnostic benchmark [40183601966](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601966), and morphology adapters [40183601968](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183601968): all passed.
- Official live NIKL inventory remains **skipped**, not passed. This is an external-access/source-verification blocker.
- No independent Korean IPA gold or independent Ukrainian target gold was used. These software tests establish deterministic implementation behavior and parity, not linguistic accuracy.
- The original ordered source manifest for the 24-form holdout is still unverified; the reconstructed fixture remains quarantined and must not be described as restored from the original source.

Readiness: **software-verified research prototype; not release-ready** until source provenance and independent linguistic/target adjudication gates are closed.


### Final source-head acceptance update — 2026-10-25

The phrase-level fail-closed regression was added and verified on source/test commit `4686fd7119fe85043c4e6b32199188bd23487a1c`. The dedicated suite passed **1,221/1,221 browser tests**, Python 3.11/3.12/3.13, and clean wheel installation ([tests 40183919607](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919607)). System verification passed ([40183915965](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183915965)); browser G2P ([40183919654](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919654)), optional g2pK ([40183919624](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919624)), generated master table/research artifacts ([40183919655](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919655)), paired native/g2pK ([40183919614](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919614)), external UGTPHON ([40183919696](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919696)), multi-engine IPA diagnostic benchmark ([40183919643](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919643)), and morphology adapter smoke ([40183919637](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40183919637)) also passed. Official live NIKL inventory was skipped, so source-level acceptance remains open.

A subsequent documentation-only commit records this status; it does not change the implementation tested above. The repository remains a software-verified **partial research prototype**, not release-ready. Original 24-form manifest provenance, independent Korean IPA adjudication, independent Ukrainian target gold, and authorized live NIKL access remain acceptance blockers.
