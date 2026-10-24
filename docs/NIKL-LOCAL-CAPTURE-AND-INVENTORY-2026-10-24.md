# NIKL Standard Pronunciation Rules: local capture and metadata inventory

Date: 2026-10-24  
Scope: the official NIKL *표준 발음법* page, articles 1–30 only.

## Why this route exists

The collector's direct HTTP route was attempted against three official endpoint variants. All returned HTTP 403. The crawler correctly stops and does not retry alternate hosts or bypass access controls. Search-engine snippets are useful discovery leads but are not a captured source response and cannot establish the full source-byte hash or prove complete extraction.

The repository already implements a local HTML import path in `scripts/nikl-norm-crawler.mjs`. Reuse it; do not create a second parser or copy source text into Git.

## Authorized capture procedure

1. Open the official NIKL Standard Pronunciation Rules page in a normal browser session:  
   https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
2. If that page is unavailable, use the official mobile endpoint only if it is normally accessible to you:  
   https://www.korean.go.kr/kornorms/m/m_regltn.do?regltn_code=0002
3. Save the page locally using the browser's **Save Page As** function. Keep the downloaded file local; do not commit the raw HTML. Do not use a search-result excerpt as if it were the complete page, and do not bypass a denial page or access control.
4. Before running the import, inspect the saved file and confirm it contains the heading `제2부 표준 발음법` and the final expected heading `제30항`. If it instead contains a 403/denial/challenge page, stop; do not classify it as source evidence.
5. Run the collector from the repository root with Node.js 22.12+:

```powershell
npm run crawl:nikl -- --url "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002" --input-html "C:\path\to\saved\official-page.html" --output "reports/nikl/standard-pronunciation-manifest.json"
```

Replace the input path with the actual saved file path. If the saved page is from the official mobile endpoint, use that exact mobile URL as `--url`; the declared URL must match the source represented by the file.

## Acceptance checks

The command must exit successfully and report `fetchedArticles: 30`, `expectedArticles: 30`, and `complete: true`. The parser fails closed if the part heading is absent or if the 30-article inventory has missing, duplicate, unexpected, or incomplete article records. The manifest contains metadata and hashes by default, not the article text or raw HTML.

Local-import provenance is intentionally explicit: `retrievalMode=local-html-import`, `httpStatus=null`, `retrievedAt=null`, and `robots.decision=not_checked_local_import`. A successful parse does **not** claim that this run performed an HTTP request or checked robots.txt, and it does not decide copyright/reuse permissions or establish that a cited rule supports a particular phonological claim.

## What to return for review

Share the generated `reports/nikl/standard-pronunciation-manifest.json` and the collector's terminal summary for review. Keep the raw HTML local unless a separately reviewed, authorized sharing route is available. If the collector rejects the saved page, share the exact error and the reported article counts; do not hand-edit the manifest to make the gate green.

## Current status — 2026-10-24

The repository-held file `한국어 어문 규범.htm` was processed by the existing `scripts/nikl-norm-crawler.mjs` local-import path in [workflow run 40072018648](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072018648). The run succeeded and emitted a metadata-only manifest at `reports/nikl/standard-pronunciation-manifest.json`.

- Source byte length: 322,678.
- Source SHA-256: `11dccd3c6eafb5167a6f448c2ccb5fc45fd698c5b2d1570ed3d1e5c177fa7a1e`.
- Inventory: 30 expected / 30 extracted; no missing, duplicate, unexpected, or incomplete article records.
- Article IDs: `NIKL-SP-01` through `NIKL-SP-30`.
- Manifest stores per-article normalized character counts and SHA-256 hashes, not article text or the raw HTML.
- Provenance is `retrievalMode=local-html-import`, `httpStatus=null`, `retrievedAt=null`, `robots.decision=not_checked_local_import`, and `termsReview=not_assessed`.

**Status split:** the technical inventory of this exact repository file is `DONE_VERIFIED`. The source/manifest parity test passed on PR head `5adbfdc5ddd1c830843d58ed4004669ca70cca9f` in [run 40072260312](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072260312); post-merge tests passed on main commit `ddaf07ede4b83adb730e83269dcb50f7959fdbef` in [run 40072283801](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072283801), and schema/reproducibility passed in [run 40072283788](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40072283788). The authenticity of the saved capture as an unmodified official response, live HTTP access, robots policy for the original capture, applicable reuse terms, and permission to redistribute derived article text remain unverified. The manifest is not a licensing decision and does not establish that each extracted rule or example has been correctly interpreted.

Before using individual passages as normative evidence, a human reviewer must spot-check article/subparagraph boundaries, example ordering, exceptions, and cross-references against the official source. Do not convert this source inventory pass into a claim of linguistic adjudication, full pronunciation-engine correctness, or release readiness.


## Metadata boundary clarification — schema v2 (2026-10-24)

The v1 inventory's `title` field duplicated the full normative clause text even though the manifest described itself as metadata-only. Schema v2 corrects that mismatch: `title` now contains only the article label (`제N항`); `normativeTextSha256` and `normativeCharCount` fingerprint the clause wording without retaining it; `textSha256` and `normalizedCharCount` fingerprint the larger source block from one article heading up to the next, explicitly including the page's official explanatory commentary and examples. `sourceUnitScope` makes that distinction machine-checkable. The raw HTML remains the source artifact; no article body is copied into the manifest.

This is a metadata/provenance correction, not a linguistic review. The page's commentary can contain interpretations and examples that must not be mistaken for the normative clause itself. The capture-authenticity and reuse-terms questions remain open, and a human spot-check is still required before using a specific passage as adjudicated linguistic evidence.
