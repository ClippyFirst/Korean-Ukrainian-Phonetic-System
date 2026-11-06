# Source-rights audit — reconstructed Kozak–Kim 236-case review (2026-11-06)

## Final decision

**The 236-case reviewer excerpts may be distributed to two independent reviewers under the declared Apache-2.0 licence for the UGTPHON Korean subset, provided each reviewer receives the complete Apache-2.0 text and the UGTPHON Korean-subset source notice.**

This decision supersedes the interim `BLOCKED` conclusion in the first version of this report. The earlier report treated a blank per-occurrence `source_license` field as if no applicable licence had been recorded. That was incomplete: the canonical `research/SOURCE-REGISTER.csv` already contains `SRC-UGTPHON-EMNLP-2026`, which records the Apache-2.0 declaration at the Korean-subset level and states that the declared grant covers selected Korean-subset excerpts. A blank row-level projection must not override the canonical source-level licence record.

This is a scoped repository research decision based on the upstream licence declaration, **not a legal opinion** and not an independent guarantee of the copyright chain for every original user-generated post. The residual provenance risk is disclosed below rather than silently treated as either zero or a prohibition.

## Pinned source and scope

- Review population: 236 reconstructed occurrence IDs across 110 source rows.
- Source split: `UGTPHON/ko/test.json`.
- Pinned dataset commit: `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`.
- Pinned Git blob: `59380491d5a797308c475f7d0007dcf6c4be00af`.
- The 236-case builder derives the occurrence inventory from the pinned source-context ledger; it does not fetch or redistribute the upstream MultiLexNorm++ gated dataset directly.
- Reviewer packets contain raw token, canonical input token, and raw sentence context. They omit source IPA/phoneme annotations, IPA-Dict data, engine outputs, comparator IPA, mismatch fragments, candidate clusters, prior dispositions, occurrence IDs, and source-row IDs.
- The packet is system-blind and reference-withheld, but not guaranteed source-identity-blind because public raw sentences may be searchable.

## Licence evidence

### UGTPHON Korean subset

The exact pinned upstream file `ko/LICENSE` at commit `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54` states that the Korean subset is derived from KoMultiText (partly via MultiLexNorm++, partly directly from KoMultiText DC Inside comments) and declares the subset licensed under Apache License 2.0. It cites Choi et al. (2023) and Buaphet et al. (2026).

The upstream README says each language subset has its own licence and identifies the Korean source streams as MultiLexNorm++ and DC Inside comments from KoMultiText. The declared licence is therefore for the published UGTPHON Korean subset, not merely for its README or software.

### Existing canonical source-register decision

`research/SOURCE-REGISTER.csv`, record `SRC-UGTPHON-EMNLP-2026`, already records:
- Apache-2.0 verified at the UGTPHON Korean-subset level via `ko/LICENSE`;
- the declared grant as covering the selected Korean subset;
- 39 previously selected C01–C07 reviewer excerpts included with source attribution and licence notice;
- no full dataset or separate IPA-Dict targets copied.

The 236-case cohort is also drawn from the same pinned Korean test split. The source-register entry has been updated to distinguish the earlier 39-excerpt packet from the not-yet-generated 236-case packet.

### KoMultiText and MultiLexNorm++ provenance

KoMultiText's public repository and Hugging Face dataset metadata also declare Apache-2.0. Its paper describes scraping public comments from DC Inside's “Real-time Best Gallery” and says the authors reviewed the platform terms. The paper does not independently document each original poster's copyright grant.

MultiLexNorm++ identifies DC Inside as the Korean source. Its public Hugging Face dataset page has a contact-sharing gate. Those gated terms were not accepted or inspected. **That gate is not being used as the licence basis for this review:** the project uses the already-published UGTPHON Korean subset and its own declared `ko/LICENSE`, not a direct download or redistribution from the gated MultiLexNorm++ repository.

### Apache-2.0 boundary and residual risk

Apache-2.0 §§1–2 define the licensor as the copyright owner or an entity authorised by the copyright owner and provide a grant from each contributor. Section 4 governs redistribution and requires, among other things, a copy of the licence and preservation of applicable attribution notices. Section 7 supplies the work “AS IS” and disclaims warranties including title and non-infringement.

Accordingly:
- the declared UGTPHON subset licence is a documented basis for the limited reviewer distribution;
- the project must include the full Apache-2.0 text and the upstream Korean-subset source notice with both reviewer packets;
- the public evidence does not independently establish the original copyright authority for every underlying DC Inside post;
- this residual chain-of-title uncertainty is disclosed, but it does not negate the published subset-level licence declaration or justify describing the material as unlicensed.

No separate `ko/NOTICE` file was present at the pinned UGTPHON revision when checked. The exact upstream `ko/LICENSE` text and full Apache-2.0 licence are preserved in:
- `licenses/UGTPHON-KO-SOURCE-NOTICE.md`
- `licenses/Apache-2.0.txt`

## Distribution conditions

1. Generate two distinct system-blind packets from the pinned 236-row ledger; preserve the same case order but separate reviewer slots.
2. Give each reviewer only their own packet, the full Apache-2.0 text, the UGTPHON Korean-subset source notice, and the review instructions.
3. Never send the private `coordinator-map.json`, source row IDs, occurrence IDs, engine IPA, comparator IPA, candidate clusters, or previous adjudication rationale.
4. Do not include the full UGTPHON dataset, source phoneme annotations, IPA-Dict data, or any third-party source file outside the licensed Korean-subset excerpt.
5. Record reviewer confidentiality, storage, retention and deletion arrangements separately. Apache-2.0 does not define reviewer retention policy.
6. Do not publish raw sentence contexts. Publish only appropriately reviewed derived annotations and aggregate findings after the Korean IPA is frozen and a separate Ukrainian target review is complete.
7. If any row is found not to originate from the pinned `UGTPHON/ko/test.json` snapshot, stop external distribution for that row and investigate its separate source licence.

## Status ledger

| Task | Status | Acceptance criterion |
|---|---|---|
| Inspect pinned UGTPHON Korean-subset licence | DONE_VERIFIED | Exact `ko/LICENSE` at the pinned dataset revision declares Apache-2.0 and identifies upstream provenance |
| Reconcile source-level licence with canonical register | DONE_VERIFIED | `SRC-UGTPHON-EMNLP-2026` records subset-level licence; blank row-level field is not treated as absence of a grant |
| Preserve required licence and attribution materials | DONE_VERIFIED | Full Apache-2.0 text and UGTPHON Korean-subset notice added to `licenses/` |
| Verify every 236 row belongs to pinned UGTPHON Korean test split | DONE_VERIFIED at inventory level | Builder requires the pinned source path and commit before licensed external packet generation |
| External packet generation and distribution | TODO | Two separate packets generated in licensed mode; only each reviewer’s packet plus licence and notice shared |
| Two independent Korean IPA transcriptions | TODO | Two qualified reviewers complete all 236 cases independently, or explicitly mark unresolved/context-compromised items |
| Blind reconciliation and adjudication | TODO | First-pass packets frozen before comparison; differences documented against private coordinator map |
| Ukrainian target review | DEFERRED until Korean IPA is frozen | Separate expert acceptance on reconciled IPA; no direct Hangul-to-Ukrainian bypass |

## Sources inspected

1. UGTPHON repository and README: https://github.com/naver-ai/UGTPHON
2. Pinned UGTPHON Korean-subset licence: https://github.com/naver-ai/UGTPHON/blob/ef0d5a09c2ea1874c7206020f875cbd9cfea2f54/ko/LICENSE
3. KoMultiText repository: https://github.com/Dasol-Choi/KoMultiText
4. KoMultiText paper: https://arxiv.org/abs/2310.04313
5. MultiLexNorm++ paper: https://arxiv.org/abs/2601.16623
6. MultiLexNorm++ public dataset page: https://huggingface.co/datasets/weerayut/multilexnorm2026-dev-pub
7. Apache License 2.0: https://www.apache.org/licenses/LICENSE-2.0
