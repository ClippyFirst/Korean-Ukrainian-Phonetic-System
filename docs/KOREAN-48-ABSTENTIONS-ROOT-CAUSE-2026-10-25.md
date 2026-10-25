# Root-cause audit: 48 Korean G2P abstentions — 2026-10-25

## Executive finding

The 48 native-engine abstentions in the pinned UGTPHON Korean test split are **not runtime crashes**: the paired run reported zero native engine errors. They are deliberate fail-closed decisions from the default `morphology_mode="strict"`, which refuses to treat a context-sensitive pronunciation rule as licensed when the input contains no exact source-backed morphology license. The 48 are token occurrences across 47 distinct Hangul word forms, not 48 independent rule bugs.

Primary benchmark evidence: [multi-engine diagnostic run 40092929978](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978), artifact [12559692692](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40092929978/artifacts/12559692692). The artifact records all abstention occurrences, unresolved contexts, candidate-engine outputs and dataset pins.

## Count reconciliation

The report's context counts are rule/context events; they must not be summed and labelled as independent abstention occurrences. One occurrence can have more than one unresolved context.

| Cause | Context events | Meaning |
|---|---:|---|
| R002 — liaison / coda neutralization | 25 | Exact morpheme evidence is missing; this is especially sensitive around lexical/substantive vowel-initial sequences |
| R003 — ㅎ-coda deletion | 20 | The engine has not established the ending/suffix environment for deletion |
| R004 — complex coda + ㅎ aspiration | 1 | Requires morphophonemic analysis |
| R007 — palatalization | 2 | Requires a formal-morpheme boundary/license |
| IPA adjudication gate | 1 | `삶의`: Korean surface-spelling evidence exists, but the project broad IPA is not independently adjudicated |
| **Total context events** | **49** | **48 abstained token occurrences; 47 distinct forms** |

A previous comparison shows 19 of the 48 abstentions coincide with a g2pk exact match, while 29 do not. That is evidence that some strict abstentions are recoverable candidates, not evidence that g2pk is gold or that all abstentions should be removed. The corpus is noisy user-generated text, not a normative pronunciation gold set.

**Benchmark-version discrepancy to keep visible:** an earlier paired morphology run on PR #294's merge head reported 648/2,655 exact (24.4068%), while the later multi-engine run on PR #297's merge head reported 1,412/2,655 (53.1827%) for the same pinned dataset and denominator. These are different historical code heads, so they are not directly comparable and the score jump must not be attributed to the abstention repair. The new audit workflow runs the paired strict/soft morphology benchmark and the native-vs-g2pk benchmark on one exact PR head to expose any remaining scoring-contract discrepancy. Until that exact-head reconciliation is inspected, do not present these historical exact rates as one continuous trend.

## Why the current engine refuses

The default pipeline uses exact, rule-scoped licenses. The existing optional soft morphology layer can propose a subset of high-frequency formal-ending analyses, but marks any rule it enables as `heuristic-low-confidence`. It is not a morphological analyzer and intentionally excludes cross-word licensing, several substantive-morpheme-sensitive environments, and rules that need lexical/morphological classes. In particular, a broad “apply liaison before any vowel” patch would mispronounce substantive/lexical sequences and erase the distinction between formal morphemes and word-internal material.

The independent research literature supports this conservative separation: Korean G2P quality depends on the exact rule environment and prosodic/morphological information; a binary orthography-only rule engine can fail when morphology and boundaries are unknown. See Mun, Kim & Ko (2022), *A proposal to improve on existing Grapheme-to-Phoneme conversion models informed by linguistics*, *Language and Information* 26(2), 27–46, [KCI record](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002922160), DOI [10.29403/LI.26.2.2](https://doi.org/10.29403/LI.26.2.2). Official rule authority is the NIKL [Standard Pronunciation Rules](https://www.korean.go.kr/kornorms/m/m_regltn.do?regltn_code=0002), especially the rules governing liaison, ㅎ, palatalization and morphology-sensitive alternations.

## Repairs in this change

1. The native-vs-g2pk benchmark now accepts an explicit `--morphology-mode strict|soft` flag and emits the complete per-occurrence abstention audit, reason/context counts, unique word count, coverage and coverage-adjusted exact match. The prior headline exact rate was conditional on resolved outputs; coverage-adjusted exact match prevents abstentions being hidden by a smaller denominator.
2. The Python API and CLI expose `morphology_mode` explicitly. `strict` remains the default; `soft` is opt-in and its rule traces must retain the low-confidence status/source. The g2pk engine rejects a soft-mode request rather than pretending native morphology settings apply to it.
3. Added a regression asserting that the strict default abstains for a known morphology-gated example, while opt-in soft mode exposes the heuristic provenance instead of silently relabelling it as high-confidence.
4. Added workflow `.github/workflows/korean-abstention-audit.yml` to fetch the pinned Apache-2.0 UGTPHON Korean test split and produce strict/soft reports as artifacts on relevant pull requests and manual dispatch.

## What is deliberately not “fixed” by force

- The default is **not** changed from strict to soft. A smaller abstention count alone does not establish correct pronunciation.
- No blanket R002/R003/R004/R007 licenses were added, and no benchmark-specific 47-word exception list was introduced.
- `삶의` remains unresolved pending independent IPA adjudication; its official Hangul reading cannot be relabelled as project IPA gold.
- The target IPA → Ukrainian mapping remains downstream and independently gated; this benchmark is not Ukrainian-output accuracy.
- Soft-mode coverage and accuracy must be measured by the new exact-head workflow before quoting any reduction in abstentions.

## Acceptance criteria

- Unit tests prove strict remains the default and soft traces are explicitly low-confidence.
- Strict and soft benchmark artifacts report per-occurrence reasons, coverage, conditional exact match, and coverage-adjusted exact match.
- No unreviewed heuristic is promoted to a source-backed license.
- Any future default-mode change requires independent adjudication of the affected rule environments and no-regression evidence on both standard-rule fixtures and held-out text.
