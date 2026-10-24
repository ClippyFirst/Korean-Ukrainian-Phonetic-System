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

## Current gate

Until a complete manifest generated from an authorized official capture is reviewed, classify the source inventory as `BLOCKED_EXTERNAL_ACCESS` / evidence pending, not `DONE_VERIFIED`. Even after the inventory passes, a human must spot-check Korean text, clause/example order, subparagraphs, exceptions and cross-references against the official page. This inventory is a source-capture gate, not a linguistic adjudication or license decision.
