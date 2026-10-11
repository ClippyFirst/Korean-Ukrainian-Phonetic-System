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
| Primary lexical rows checked | 622 |
| Alternate readings checked | 44 |
| Primary IPA/target segment mismatches | 0 |
| Alternate IPA/target segment mismatches | 0 |
| Unmapped IPA segments | 0 |

The test is recorded in `tests/model-wide-target-consistency.test.mjs` as **“all lexical Ukrainian targets are mechanically reproducible from their IPA, including variants”**.

## Interpretation and limitations

- The zero-mismatch result supports the architectural invariant that stored Ukrainian targets are reproducible from the IPA layer; it does not independently validate each Korean surface pronunciation against NIKL.
- It does not prove that the project's Ukrainian approximation is the only valid or best Ukrainian rendering. These mappings are not prescribed by the Korean standard and must remain labelled according to the row's existing target status.
- The test oracle intentionally duplicates the declared mapping table. If the production IPA mapper changes, the oracle should be reviewed and updated explicitly rather than automatically importing implementation details that could make the test tautological.
- The 622-row count is a snapshot. When rows are intentionally added or removed, update the snapshot assertion after reviewing the corpus delta.


## Normative coverage follow-up

A comparison against the official examples quoted in NIKL's §12 guidance found that the coda-plus-ㅎ aspiration example **각하[가카]** was missing from the curated lexical corpus, although the related examples were already present. Added it as a source-backed row with IPA `ka|kʰa`, a provisional Ukrainian target, and a regression assertion. This closes the inventory gap for that enumerated example; it does not imply complete coverage of every productive coda–ㅎ combination.

Official NIKL references:
- [Standard Pronunciation Rule §12, official examples](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002)
- [NIKL explanation of §12 and coda + ㅎ aspiration](https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&qna_seq=303702)
