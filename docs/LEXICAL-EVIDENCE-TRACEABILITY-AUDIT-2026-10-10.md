# Lexical evidence traceability audit — 2026-10-10

## Purpose and scope

This is a **metadata audit**, not a claim that these records lack normative support. It identifies lexical rows whose `rule_notes` do not explicitly name a numbered article (for example, `§18`) or cite the Standard Pronunciation Rules by title. Many notes already describe a sound process and point to an official National Institute of Korean Language (NIKL) source; the gap is that the mapping from that evidence to a numbered rule is not normalized.

Snapshot: `data/korean/lexical_pronunciations.csv` contains **642** rows; **0** rows meet the audit filter.

## Source-type counts

| Existing source URL type | Rows |
|---|---:|
| NIKL online Q&A | 0 |
| NIKL FAQ | 0 |
| NIKL standard-rules page | 0 |
| **Total requiring article-mapping review** | **0** |

## Resolved during follow-up

- `실제` was removed from the unresolved metadata queue after its rule note was corrected to *표준 발음법* §26 (Sino-Korean ㄹ + ㅈ fortition). The general rules page supports that rule family; an item-specific lexical citation for `실제[실쩨]` remains desirable, but it is no longer missing an article mapping.

## Resolved during follow-up

The following nine records received explicit article mappings after source review and are no longer in the unresolved queue: `밝는` (§§11, 18), `실없다` (§§10, 15, 23; with §13 explicitly ruled out for the substantive-morpheme boundary), `몇으로` (§13), `넋받이` (§§10, 17, 23), `밭이랑` (§§9, 18, 29), `집안일` (§§18, 29), `공업용` (§§18, 29), `얇실하다` (§§10, 23), and `짧다` (§§10, 23). The exact-word sources remain attached to their lexical rows.

## Resolved during follow-up

Nine more rows were assigned explicit rule references or documented as rule-specific negative controls: `삶다` (§§11, 23), `넓어` (§14), `넓으니` (§14), `넓은` (§14; exact bracketed reading remains indirectly supported), `넓습니다` (§§10, 18, 23; rule-derived), `넓지` (§§10, 23), `값있다` (§29 non-application of ㄴ-insertion), `곧이어` (§29 non-application of ㄴ-insertion), and `음용` (§29 non-application of ㄴ-insertion). For `넓습니다`, the source URL now points to the official rule text rather than implying the related dictionary-form Q&A directly lists the full conjugated form.

## Resolved during follow-up

Twelve further rows now have explicit article mappings or a directly supported rule trace: `값없다` (§§10, 15, 23), `의견란` (§20), `읽고` (§§11, 23), `읽다` (§§11, 23), `읽어` (§14; its source URL was corrected to the exact NIKL answer), `읽는` (§§11, 18), `읽지` (§§11, 23), `맑게` (§§11, 23), `맑고` (§§11, 23; exact-word attestation remains indirect), `맑다` (§§11, 23; source now points to the official rules page), `밝기` (§§11, 23), and `닭고기` (§§11, 23).

## Resolved during follow-up

Nine more records received explicit rule mappings based on their linked official evidence: `꽃잎` (§§9, 18, 29), `밭이` (§17), `밭을` (§13), `넓네` (§§10, 20), `없다` (§§10, 23), `없는` (§§10, 18), `국물` (§18), `떡볶이` (§23, with the remaining morphological liaison step explicitly left unclaimed by the source), and `옷이` (§13). `대한민국` remains a baseline/no-rewrite control; it has not been forced into an article mapping merely to clear the queue.

## Resolved or reclassified during follow-up

Nine additional forms now carry explicit rule traces: `국립국어원` (§§18, 19, 23), `먹었어요` (§13), `찍었어요` (§13; component sources documented), `국립국어원에서` (§§13, 18, 19, 23), `빗었어요` (§13), `읽었습니다` (§§9, 14, 18, 23), `덥고` (§23), `밤에는` (§13), and `춥습니다` (§§18, 23). Three unchanged controls were explicitly reclassified so the audit does not force meaningless article numbers: `대한민국` is a baseline control; `나중엔` and `머리를` are corpus controls whose corpus provenance remains pending.

## Resolved or reclassified during follow-up

Nine further rows now have explicit rule traces: `빗고` (§§9, 23), `넓지만` (§§10, 25), `짧아도` (§14), `나갔습니다` (§§9, 18, 23), `꽃밭에` (§§9, 13, 23), `있던` (§§9, 23), `학생의` (§§5, 23; variant-sensitive), `책을` (§13), and `연구원은` (§13). Three unchanged surface forms were reclassified as baseline controls rather than given fabricated rule numbers: `예쁘고`, `보러`, and `일찍`.

## Resolution status — queue cleared

As of this audit pass, **all 79 records in the original review queue have been resolved or explicitly reclassified**. The final fifteen records were handled as follows: `발음의` now has §§5 and 13 plus a stored [바르메] variant; `설명했어요` (§13), `딸이` (§13), `흙을` (§14), `밟으며` (§14), `낡은` (§14), `놓인` (§12), `밟았습니다` (§§9, 14, 18, 23), `맑은` (§14), `있었고` (§§9, 13, 23), `웃었고` (§§9, 13, 23), and `넓어졌다는` (§§9, 14, 23) now have rule traces. `발음과` is a lexical-source control backed by the official Basic Korean Dictionary; `차이를` and `자세히` are baseline controls. The `넓어졌다는` trace is explicitly marked compositional and indirectly attested rather than presented as a quoted dictionary form.

The queue is empty because every remaining row either has an explicit article mapping or is tagged as a baseline, corpus, or lexical-source control for which an article mapping is not applicable. This does **not** mean the entire pronunciation engine or every Ukrainian/IPA mapping has been independently expert-validated.

## Required handling

- Do not assign a rule number from a guessed sound-process label. Verify the cited source and the exact Standard Pronunciation Rules clause first.
- Distinguish a rule-governed example, an official dictionary/Q&A lexical reading, a phrase or compound whose structure matters, and a project-level regression example.
- Preserve exact source URL, surface Hangul, IPA, and any variant information while editing metadata.
- Where a Q&A confirms a surface form but does not map it cleanly to one article, record it as **official lexical evidence / article mapping pending** rather than presenting it as direct article coverage.
- This list should be regenerated or updated whenever the lexical corpus changes. It is a review queue, not an instruction to append an arbitrary article number to every row.

## Review queue

| Input | Existing official source | Current note (preserved verbatim) | Next action |
|---|---|---|---|

## Tricky-passage morphology matrix follow-up

Four new exact regression rows were added for `같아지는` (§13 rule-derived), `같았다` (§§9, 13, 23 rule-derived), `밝히는` (§12 suffixal aspiration derived from the directly discussed `밝히다[발키다]`), and `닭고기와` (§§11, 23 compositional extension of the directly attested `닭고기[닥꼬기]`). Their notes explicitly distinguish direct lexical attestation from rule-derived forms; none is left in the article-mapping queue.


## Reported-placeholder regression follow-up (2026-10-11)

The adversarial passage review added eleven entries since the previous 601-row snapshot. They are not all equivalent evidence types:

| Inputs | Expected surface | Evidence classification |
|---|---|---|
| `잊었다`, `붙었다`, `넣었다`, `놓았다`, `좋아도`, `맑을`, `없었다` | `이젇따`, `부텓따`, `너얻따`, `노앋따`, `조아도`, `말글`, `업썯따` | Official lemma readings combined with numbered standard-rule derivations; target layer provisional |
| `쌓였다` | `싸엳따` | NIKL learner-dictionary lemma/application evidence plus §§12(4), 23 derivation; target layer provisional |
| `찾아가다` | `차자가다` | Exact pronunciation listed in NIKL dictionary material; §13 mapping |
| `미닫이문` | `미다지문` | Compound extension of NIKL-attested `미닫이[미ː다지]`; §17 lexicalized palatalization |
| `값의` | `갑씌` / `갑쎄` | NIKL §5 Q&A plus §14 liaison; preserve both permitted particle readings rather than collapsing the variant |

These rows are tracked in the lexical CSV with explicit source URLs and rule notes, and in `tests/reported-placeholder-regressions.test.mjs`. Ukrainian targets remain provisional; the standard Korean surface readings and alternatives are what the regression tests lock. The count is a snapshot, not a quality gate: future additions must update this document and its snapshot assertion, but a nonzero article-coverage queue alone must not fail builds.


## Official dictionary source review — batch 14 (2026-10-22)

Three previously citation-only NIKL Korean-English Learners' Dictionary pages were opened and compared with the exact lexical rows:

- `SRC-KRDICT-ENG-66031`, **맑다**: the dictionary explicitly lists `맑은[말근]`, along with `맑아[말가]`, `맑으니[말그니]`, `맑습니다[막씀니다]`, `맑고[말꼬]`, and `맑지[막찌]`. The lexical `맑은` row now cites this exact entry. `맑을` is not listed and remains rule-derived.
- `SRC-KRDICT-ENG-89859`, **얇다**: the dictionary explicitly lists `얇은[얄븐]` and five other application forms. This is direct evidence for the listed forms only, not a productive license for all ㄼ adjectives.
- `SRC-KRDICT-ENG-64509`, **넣다**: the dictionary lists `넣다[너ː타]`, `넣는[넌ː는]`, `넣어[너어]`, `넣으니[너으니]`, and `넣습니다[너ː씀니다]`. It does **not** list the CSV form `넣었다`; that form remains a rule-derived inflection with the existing §12(4)/§23 rationale.

The source register now differentiates exact direct attestation from partial lemma/application support. Added `tests/lexical-evidence-review-batch-14.test.mjs` to protect source identity, direct/partial status, and the distinction between Hangul pronunciation notation and IPA.

**Updated inventory after the contextual-only checks:** 11 of the 60 newly inventoried citation pages have been content-checked: 4 direct for target forms, 2 partial, 5 contextual-example-only for target forms; 49 remain citation-only/unreviewed. Page-level KOGL markings remain unverified. These source checks do not adjudicate broad IPA or Ukrainian target spellings.
