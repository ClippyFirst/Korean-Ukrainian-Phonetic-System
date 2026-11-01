# Kozak Kim independent IPA review packets — 2026-11-01

> **INTERNAL MAINTAINER INDEX — DO NOT FORWARD TO REVIEWERS.** This file contains cluster topics and internal provenance. Send only the source-blind packet JSON and `REVIEWER-INSTRUCTIONS.md` after context and rights gates are cleared.

Seven separate system-blind pilot packets are provided for C01–C07. They include source sentences but exclude system outputs, reference IPA, system identities, benchmark ranking, and proposed rule explanations.

| Packet | Topic | Cluster count | Pilot forms |
|---|---|---:|---|
| C01 | Lateral realization / IPA profile | 464 | 올린, 사진들, 일본, 굴러가고, 클래스급, 솔직히 |
| C02 | Conditioned /h/ realization | 261 | 사회, 자랑하고, 환경단체, 후쿠오카로, 추진하다, 영향 |
| C03 | Palatal nasal realization | 77 | 그냥, 불렀겠냐나, 연예계, 한녀들보다, 귀엽냐, 상류층 |
| C04 | Aspiration representation | 37 | 클래스급, 솔직히, 도쿄로, 다크티렉스, 스크롤, 시킨 |
| C05 | /y/ vs glide-plus-vowel segmentation | 35 | 귀엽냐, 분위기, 귀여운데, 귀엽노, 털바퀴, 귀여워 |
| C06 | Unreleased-coda diacritic | 34 | 랍시고, 없어도, 목숨, 없음, 다크티렉스, 주작썰 |
| C07 | /l/ vs [ɾ] boundary-sensitive contexts | 12 | 창렬하다, 자결함, 말한, 디씨질하면서, 뭘해도, 일했다 |

## Readiness and licensing

All 39 unique source-row identifiers used by the seven packets were matched to the official [UGTPHON Korean test split](https://github.com/naver-ai/UGTPHON/tree/main/ko); every target token is present in its included raw source sentence. The official `ko/LICENSE` states Apache-2.0 for the Korean subset. The packets include raw sentence text only — no canonical forms, phoneme annotations, IPA-Dict entries, system outputs, or reference IPA. They preserve attribution to UGTPHON, KoMultiText, and MultiLexNorm++.

The packets are **ready for independent pilot review**, not a complete cluster census. Preserve the Apache-2.0 notice and attribution when sharing. The raw MultiLexNorm++ source files are not redistributed; upstream provenance/terms remain documented as a limitation.

## Protocol

1. Read the included source sentence and flag any context that remains ambiguous.
2. Give reviewers separate blind copies; do not disclose systems, reference IPA, or suspected variant.
3. Collect broad IPA, optional narrow IPA, syllable boundaries, length, convention, evidence, and confidence independently.
4. Freeze both first-pass submissions before revealing engine/reference comparisons.
5. Reconcile disagreements only after independent submissions; retain unresolved cases.
6. Any production change requires source-backed positive, negative, boundary, and interaction controls plus exact-head tests and paired re-benchmarking.

Each JSON packet has a submission structure and an explicit acceptance gate. The gate is `READY_FOR_INDEPENDENT_REVIEW_PILOT`; reviewer submissions are still outstanding. All packet files now use the neutral schema `korean-independent-ipa-review-v1`; regression tests reject project/baseline identity leakage.
