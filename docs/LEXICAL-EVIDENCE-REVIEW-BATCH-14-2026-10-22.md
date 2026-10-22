# Lexical evidence review batch 14 — 2026-10-22

## Scope and method

This batch reviewed three exact official Korean-English Learners' Dictionary pages already cited by `data/korean/lexical_pronunciations.csv`. The pages were opened through the public web view on 2026-10-22. The record below distinguishes an exact listed application form from a derived form that is absent from the dictionary paradigm. Korean dictionary bracket notation is treated as Korean pronunciation evidence, **not IPA**. No IPA gold or Ukrainian target was inferred from these pages.

## Reviewed records

| Source ID | Dictionary entry | Directly attested form(s) | Relation to lexical CSV | Evidence status |
|---|---|---|---|---|
| `SRC-KRDICT-ENG-66031` | [맑다, ParaWordNo=66031](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=66031&nation=eng&nationCode=6) | `맑은[말근]`, `맑아[말가]`, `맑으니[말그니]`, `맑습니다[막씀니다]`, `맑고[말꼬]`, `맑지[막찌]` | `맑은` is now directly dictionary-attested. `맑을` is not listed on the page and remains a rule-derived form under §14, not direct evidence from this page. | Direct for `맑은`; partial for `맑을` |
| `SRC-KRDICT-ENG-89859` | [얇다, ParaWordNo=89859](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=89859&nation=eng&nationCode=6) | `얇은[얄븐]`, `얇아[얄바]`, `얇으니[얄브니]`, `얇습니다[얄씀니다]`, `얇고[얄꼬]`, `얇지[얄찌]` | Exact support for the existing `얇은` row. Do not generalize the listing to every ㄼ adjective or inflection. | Direct for listed forms |
| `SRC-KRDICT-ENG-64509` | [넣다, ParaWordNo=64509](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=64509&nation=eng) | `넣다[너ː타]`, `넣는[넌ː는]`, `넣어[너어]`, `넣으니[너으니]`, `넣습니다[너ː씀니다]` | The CSV's `넣었다` is **not** listed. The page supports the lemma and the listed paradigm examples only; `넣었다` remains a rule-derived inflection that requires its own rule justification. | Partial lemma/application support |

## Additional citation-scope checks: five more pages

These pages were also opened on 2026-10-22. Each entry shows the target spelling in ordinary dictionary example text, but the target inflection does **not** appear as a bracketed pronunciation. The dictionary does provide the lemma and selected applications. These pages therefore help trace lexical identity and rule-derived analysis, but they are not direct pronunciation attestation for the target form.

| Source ID | Entry / page | Exact evidence observed | Target form and safe interpretation |
|---|---|---|---|
| `SRC-KRDICT-ENG-57320` | [찾다, ParaWordNo=57320](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=57320&nation=eng) | `찾다[찯따]`, `찾아[차자]`, `찾으니[차즈니]`, `찾는[찬는]`; `찾았다` occurs in example sentences | `찾았다` remains rule-derived; ordinary example spelling is not a bracketed pronunciation |
| `SRC-KRDICT-ENG-70067` | [잊다, ParaWordNo=70067](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=70067&nation=eng) | `잊다[읻따]`, `잊어[이저]`, `잊으니[이즈니]`, `잊는[인는]`; `잊었다` occurs in example text | `잊었다` remains rule-derived under the already documented §13/§23 chain |
| `SRC-KRDICT-ENG-74181` | [붙다, ParaWordNo=74181](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=74181&nation=eng) | `붙다[붇따]`, `붙어[부터]`, `붙으니[부트니]`, `붙는[분는]`; `붙었다` occurs in example text | `붙었다` remains rule-derived; no direct bracketed pronunciation is claimed |
| `SRC-KRDICT-ENG-89534` | [놓다, ParaWordNo=89534](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=89534&nation=eng) | Lemma and selected application readings; `놓았다` occurs in example text | `놓았다` remains rule-derived under the already documented §12(4)/§23 chain |
| `SRC-KRDICT-ENG-65098` | [쌓이다, ParaWordNo=65098](https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=65098&nation=eng) | `쌓이어[싸이어/싸이여]`, `쌓여[싸여]`, `쌓이니[싸이니]`; `쌓였다` occurs in example text | `쌓였다` remains rule-derived; the page does not provide a bracketed pronunciation for it |

The lexical CSV notes and source-register records now explicitly distinguish these contextual orthographic occurrences from direct pronunciation notation. No new pronunciation value was introduced.

## Changes made

- Updated the three existing source-register rows in place with exact page identity, inspected forms, narrower claim scope, and the remaining rights caveat.
- Changed the lexical row for `맑은` to cite its exact dictionary page rather than relying only on the generic rules page.
- Left the lexical form `맑을` and `넣었다` rule-derived; no new pronunciation was invented.
- Added regression tests to protect direct/partial/context-only distinctions and source URLs.

## Limitations

- These are official Korean surface-pronunciation attestations only for forms explicitly listed in bracketed dictionary notation. Ordinary example sentences establish spelling/context only, not a target-form pronunciation. The Hangul bracket strings are not broad IPA.
- The exact page-level KOGL marking for each dictionary entry has not been checked. The site-wide NIKL reuse policy does not by itself settle item-specific terms.
- No independent phonetician has adjudicated IPA, and no independent Ukrainian reader has validated the target forms.

## Task ledger

- `DONE_VERIFIED`: three cited pages opened; exact application examples transcribed into the evidence register; one exact lexical source URL corrected; automated assertions added.
- `PARTIAL`: `넣었다` and `맑을` remain derivations, not directly attested by the corresponding dictionary pages.
- `BLOCKED / rights`: item-level reuse markings not checked.
- `BLOCKED_SPECIALIST_ADJUDICATION`: IPA and Ukrainian-target validation remain separate workstreams.
