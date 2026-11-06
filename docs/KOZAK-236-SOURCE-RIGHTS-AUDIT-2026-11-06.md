# Source-rights audit — reconstructed Kozak–Kim 236-case review (2026-11-06)

## Decision

**External reviewer packets: BLOCKED pending rights-holder/source confirmation.**
**Internal project analysis: retain the existing internal-only restriction.**
**No reviewer packet was generated, transmitted, uploaded, or shared in this audit.**

The audit found a declared Apache-2.0 licence for the UGTPHON Korean subset and matching Apache-2.0 declarations for the cited KoMultiText repository/Hugging Face dataset. These are meaningful dataset-level reuse signals. They do not, on the public evidence inspected here, conclusively establish that every original DC Inside user comment was licensed by its copyright owner or that the separate MultiLexNorm++ access conditions permit onward distribution of raw text to external reviewers.

This is a conservative evidence decision, not a legal finding that reuse is prohibited.

## Scope and pinned project inventory

- Review population: reconstructed 236-occurrence candidate inventory, 110 source rows.
- All 236 rows have an empty `source_license` field in the project's candidate CSV, as recorded in the review protocol and prior audit.
- Source split: `naver-ai/UGTPHON/ko/test.json`; the recovered historical manifest pins dataset commit `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54` and Git blob `59380491d5a797308c475f7d0007dcf6c4be00af`.
- UGTPHON documents the Korean subset as derived from two streams: MultiLexNorm++ and direct KoMultiText/DC Inside comments. It declares the Korean subset Apache-2.0.
- The existing reviewer packet builder includes raw token, canonical token, and raw sentence context. The packets are therefore source-identifiable excerpts, not metadata-only review forms.

The 236 rows are not 236 independent speakers and the reconstructed inventory does not prove the original historical 236/239 selector membership.

## Source chain and evidence

| Layer | Public evidence found | What it supports | What remains unproven |
|---|---|---|---|
| UGTPHON Korean subset | `ko/LICENSE` states that the subset is derived from KoMultiText (partly via MultiLexNorm++, partly directly from KoMultiText DC Inside comments) and is licensed Apache-2.0. The README says each language subset has its own licence. | The UGTPHON publisher expressly declares Apache-2.0 for its Korean subset. Apache-2.0 generally permits reproduction and distribution of the licensed Work and Derivative Works subject to its conditions. | The public materials do not independently verify that the UGTPHON licensor holds or was granted rights in every underlying user-authored comment. |
| KoMultiText / DC Inside | The KoMultiText GitHub repository carries Apache-2.0; its Hugging Face dataset card also declares Apache-2.0. The paper says the authors scraped 150,000 comments from DC Inside's “Real-time Best Gallery” and says they reviewed DC Inside's terms of service to ensure compliance. | Dataset authors publicly assert compliance review and publish a permissive dataset-level licence. | The paper does not quote the relevant platform terms, identify a specific DC Inside permission, state that comment authors granted redistribution rights, or describe a user-content copyright clearance process. The Apache-2.0 licence itself disclaims warranties, including title and non-infringement. |
| MultiLexNorm++ / DC Inside | Its paper identifies DC Inside as the Korean source but does not specify a Korean raw-text licence, access/redistribution conditions, or platform permission. The public Hugging Face `multilexnorm2026-dev-pub` dataset page requires the user to agree to share contact information before accessing files; the terms are not visible without accepting. | Confirms a separate access gate and the upstream data provenance. | The gated terms and the rights to onward-share raw Korean text with independent reviewers were not inspected or accepted. This audit did not agree to those terms on the user's behalf. |
| Original DC Inside posts | Both upstream descriptions identify real user-generated comments from DC Inside. | Establishes the source platform and user-generated nature of the text. | Public availability, academic publication, or inclusion in an Apache-labelled derivative dataset does not by itself prove the original posters or platform granted the necessary onward-distribution rights. |

### Important Apache-2.0 boundary

Apache-2.0 §2 grants copyright permission from each Contributor/Licensor; §4 allows redistribution when its conditions are met. Section 1 defines the Licensor as the copyright owner or an entity authorised by the copyright owner. Section 7 provides the Work “AS IS” and disclaims warranties including title and non-infringement. Consequently, the declared licence is a positive signal, but it does not itself verify the licensor's authority over third-party user posts.

### Sources inspected

1. UGTPHON README and licence:
   - https://github.com/naver-ai/UGTPHON
   - https://github.com/naver-ai/UGTPHON/blob/main/ko/LICENSE
2. KoMultiText source repository and licence:
   - https://github.com/Dasol-Choi/KoMultiText
   - https://github.com/Dasol-Choi/KoMultiText/blob/main/LICENSE
   - https://huggingface.co/datasets/Dasool/KoMultiText
3. KoMultiText paper:
   - https://arxiv.org/abs/2310.04313
   - Full text inspected through Undermind. Section 3.1 (p. 3) describes sequential web scraping of DC Inside's “Real-time Best Gallery”; Appendix A (p. 8) says the authors reviewed DC Inside terms but does not specify a licence or permission.
4. MultiLexNorm++ paper and gated dataset:
   - https://arxiv.org/abs/2601.16623
   - https://huggingface.co/datasets/weerayut/multilexnorm2026-dev-pub
   - Full text inspected through Undermind. Section 3.1 (p. 3) and Appendix A (pp. 14–15) identify DC Inside; no raw-text redistribution permission is specified.
5. Apache License 2.0:
   - https://www.apache.org/licenses/LICENSE-2.0

## Required clearance to unblock external review

Obtain written confirmation from the relevant rights holders/maintainers (or a qualified legal determination based on the applicable terms) covering all of the following:

1. That the Apache-2.0 grant for the UGTPHON Korean subset validly covers the raw and canonical text excerpts used in this 236-case review.
2. That the KoMultiText contributors were authorised to license the included DC Inside user comments for onward reproduction/distribution, or identify the precise alternative legal basis and scope.
3. The exact terms accepted for MultiLexNorm++ access, including whether raw Korean source text may be shared with two independent external reviewers for phonetic annotation.
4. Whether sentence context may be included, whether reviewers may retain copies, and whether the review outputs/derived IPA may be stored and published.
5. Required attribution, notice retention, access/security, deletion and any purpose or non-commercial limitations.

Until this evidence is recorded, do not send either reviewer the current packets or their source-identifiable sentence contexts. Do not infer clearance from the public GitHub/Hugging Face visibility or from an Apache badge alone.

## Safe next steps

- Keep the candidate CSV's 236 `source_license` cells blank; do not bulk-fill Apache-2.0 without item-level source mapping and a supported rights conclusion.
- Keep the packet generator's `--internal-review-only` mode and do not generate shareable external packets.
- Request written clarification from the UGTPHON authors, KoMultiText maintainer and MultiLexNorm++ authors; separately inspect the gated MultiLexNorm++ conditions only after the account holder explicitly accepts them.
- If clearance is refused or cannot be obtained, ask the reviewers to work from independently obtained, rights-cleared audio/source material, or redesign the review around non-reproducing linguistic metadata only where that still supports valid phonetic judgments.
- Once the rights scope is documented, update the per-occurrence ledger with a traceable source-rights status, regenerate reviewer packets, and preserve the private coordinator map separately.

## Status ledger

| Task | Status | Acceptance criterion |
|---|---|---|
| Inspect UGTPHON Korean subset licence and provenance | DONE_VERIFIED | Current README and `ko/LICENSE` inspected; both source streams identified |
| Inspect KoMultiText licence and paper statements | DONE_VERIFIED | Repository/HF licence declarations and full paper passages inspected |
| Inspect MultiLexNorm++ paper and public dataset gate | PARTIAL | Paper inspected; gated access terms not accepted or inspected |
| Verify original user/platform rights across all 236 source items | BLOCKED | Written rights-holder confirmation or qualified legal determination with item-level scope |
| Distribute blind packets to two external reviewers | BLOCKED | Rights clearance plus two qualified reviewers and approved handling/retention terms |
| Internal packet generation | DEFERRED | Do only if needed; continue `--internal-review-only`, never treat generation as adjudication |

**Conclusion:** the 236-case independent-review workflow is not externally cleared yet. The next genuine blocker is written source-rights clarification for both DC Inside-derived streams, especially the MultiLexNorm++ gated terms and the authority to relicense original user comments.
