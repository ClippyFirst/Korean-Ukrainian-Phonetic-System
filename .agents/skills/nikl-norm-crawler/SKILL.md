---
name: nikl-norm-crawler
description: Use when planning, implementing, running, or reviewing a reproducible collector for official Korean National Institute of Korean Language (NIKL) standards, especially 표준 발음법; when maintaining source manifests, detecting upstream changes, or diagnosing extraction gaps.
---

# NIKL Norm Crawler

## Objective and authority boundary

Collect a complete, auditable representation of official Korean-language normative material needed by the existing Korean → IPA → Ukrainian research engine. This skill governs source discovery and capture; it does not itself decide phonological analyses or authorize rules.

Primary sources:
- Standard Pronunciation Rules (표준 발음법): https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002
- Korean Norms portal: https://korean.go.kr/kornorms/main/main.do
- Standard Korean Dictionary: https://stdict.korean.go.kr/

Treat the official NIKL source as normative within its documented scope. Third-party G2P systems, search snippets, generated answers, and community examples are leads or comparison systems only.

## Before writing or running a crawler

1. Inspect the repository's current source register, schemas, rule-coverage matrix, existing scrapers/fetchers, tests, audit register, and handoff. Reuse current abstractions and data locations; do not create a competing registry.
2. Establish the exact intended scope: the full Standard Pronunciation Rules inventory first; adjacent orthography rules, dictionary records, NIKL Q&A, and corpus sources are separate scopes and must not be silently mixed into the first crawl.
3. Inspect the live site's robots.txt, terms, copyright/reuse notices, API policy, link structure, response headers, and access requirements. Record when and where this was checked.
4. Check whether an official API, export, sitemap, or stable structured response exists before HTML scraping.
5. Choose the least brittle method: documented API/export → stable static HTML parser → browser automation only if necessary. Do not use browser automation as a default if ordinary HTTP is adequate.
6. Do not bypass login, approval, access controls, rate limits, CAPTCHA, robots restrictions, or anti-bot measures. A block becomes an explicit blocker, not a reason to evade controls.
7. Pin the target to the official desktop full-text endpoint or its legacy official mobile counterpart, and require exactly one `regltn_code=0002` query parameter. Do not accept arbitrary paths under `/kornorms/`, other regulation codes, duplicate code parameters, off-site redirects, or user-controlled URLs.

## Collection protocol

- Use explicit connect/read timeouts, a descriptive project user-agent, conservative pacing, bounded retries, exponential backoff with jitter where supported, and a maximum retry count.
- Cache successful responses and support conditional requests (ETag, Last-Modified) when the origin provides them.
- Respect Retry-After; stop or slow down on 429/503 responses. Do not retry permanent 4xx errors indefinitely.
- Normalize URL fragments and known tracking parameters only for identity comparison; preserve the original discovered URL and final redirected URL in provenance.
- Handle UTF-8 and Korean text carefully. Never silently replace decoding errors; report them and preserve the raw response for diagnosis when permitted.
- Record response metadata before parsing so parser failures remain visible.
- Separate discovery, fetch, parse, normalize, validate, and write phases. A failed phase must not be reported as success because a later phase emitted partial output.
- Use deterministic ordering and stable identifiers so identical inputs yield identical normalized output.

## Required provenance manifest

For each requested resource, retain at least:
- requested URL and final URL;
- hostname and retrieval timestamp in UTC;
- HTTP status and content type/charset;
- ETag and Last-Modified when present;
- response byte length and SHA-256 of exact captured bytes;
- source title and discovered parent/index location;
- fetch outcome, parse outcome, parser version, schema version;
- retry count and concise warning/error code;
- source terms/reuse review date and review outcome.

Keep raw body storage configurable. Do not commit a raw-page cache by default: large snapshots may contain copyrighted material or create noisy diffs. If local caching is needed, follow existing ignore conventions and repository policy.

## Parser engineering and operational diagnostics

- Prefer semantic anchors, stable article IDs, and structural relationships over CSS classes that look presentational. If the source is table-based, preserve row/column meaning; if examples are interleaved with prose, preserve their order and association with the correct clause.
- Keep HTML decoding and extraction separate from linguistic normalization. Unicode NFC/NFD normalization may be useful for comparison, but never discard the original byte hash or source string.
- Avoid broad selectors that accidentally include navigation, footer text, duplicated mobile/desktop markup, or unrelated regulations. Add fixtures for representative page shapes and malformed variants.
- Treat selectors, parser dependencies, and source URL patterns as versioned behavior. A parser change that alters record counts must produce a reviewable diff.
- Detect pagination, hidden continuation links, article anchors, and duplicate mobile/desktop representations. Confirm the index's article count against extracted article IDs.
- Keep logs useful but safe: include resource IDs, URLs, statuses, and concise errors; avoid dumping huge copyrighted page bodies into CI logs.
- Make the command idempotent. Re-running against unchanged captured inputs must not reorder records or create spurious diffs.
- If the site introduces JavaScript-only content, first inspect network/documentation for an official endpoint. Use browser automation only after confirming that it is needed and permitted.

### Recommended implementation seams

Prefer small functions or modules with independently testable contracts:
1. discover_index() returns ordered expected source IDs and URLs;
2. fetch_resource() returns bytes plus HTTP/provenance metadata;
3. parse_resource() returns a typed parse result plus warnings;
4. normalize_article() maps parsed structure into the existing schema without inventing missing fields;
5. validate_inventory() checks completeness, duplicates, hierarchy, and count reconciliation;
6. diff_manifests() compares current and previous source identities and hashes;
7. write_outputs() writes atomically only after validation succeeds.

These are conceptual seams, not mandatory function names; fit the repository's existing architecture rather than adding redundant abstractions.

## Normalized article/rule records

Reuse the repository's existing schema if it can represent the source faithfully. Do not silently mutate a schema to fit one page. If a schema extension is needed, version it and provide migration/compatibility tests.

A record should represent, where available:
- source and standard identifier;
- article, clause, subclause, paragraph, and example IDs exactly as displayed;
- title and canonical source URL;
- source language and source text locator;
- article order and parent-child relationship;
- examples with original order, labels, form, pronunciation, and notes kept in distinct fields;
- explicit conditions, exceptions, qualifications, and cross-references;
- whether the field was present, absent, not extracted, or not checked;
- provenance link to the capture manifest and hash;
- parse confidence/status and review notes.

Do not flatten a rule into an unstructured paragraph if the source exposes article/example structure. Do not invent a pronunciation, IPA string, morphological segmentation, exception, or interpretation to fill a missing field.

## Completeness and change detection

A crawl is complete only if:
1. the official table-of-contents inventory has been captured;
2. every discovered article/subarticle has a stable ID or a documented reason no stable ID exists;
3. each expected item has a terminal status (parsed, source-absent, blocked, malformed, or review-needed);
4. counts reconcile between index, discovered links, and normalized records;
5. duplicates, orphan records, missing articles, unexpected redirects, and changed labels are reported;
6. a human spot-check compares records to source pages, including Korean punctuation and example order;
7. unchanged source pages produce unchanged normalized data, apart from explicitly volatile metadata;
8. the gate fails closed on silent truncation, empty parse results, selector drift, or a suddenly implausible record count.

When the official page changes, produce a diff by stable article ID. Separate textual changes from layout/parser changes. Never overwrite the last known-good generated data with an incomplete crawl.

## Legal and ethical reuse

- Publicly readable does not mean openly licensed.
- Review source terms and reuse notices before bulk download, storage, or redistribution.
- Prefer source URLs, article identifiers, hashes, concise descriptions, and minimum excerpts necessary for verification.
- Keep non-redistributable raw captures local and out of version control.
- Record license/terms as observed, not inferred; distinguish unknown from permitted.
- Do not scrape unrelated personal data or circumvent technical restrictions.

## Integration contract

The intended engine path remains:

Hangul → structural/morphological analysis → Korean phonology → IPA or typed unresolved result → Ukrainian adaptation → Ukrainian practical orthography.

The crawler may populate source/evidence registries and fixtures. It must not directly generate Ukrainian spellings from Hangul or treat a page scrape as proof that an engine implementation is correct. Official surface pronunciation, derived IPA, and Ukrainian target are distinct artifacts.

## Failure handling and report

For every run, report scope, source inventory, fetched/parsed/failed counts, changed/new/missing IDs, parser/schema versions, terms status, validation commands, and blockers. Distinguish an unavailable website, denied access, parser drift, incomplete inventory, and uncertain linguistic interpretation.

Never say "all rules scraped" unless inventory reconciliation and validation prove it. Never claim live scraping or terms review occurred if the run only inspected existing repository files.


## When automated access is denied

Do not use proxy/stealth scraping or rotate hosts to evade a 401/403/429/451. If a human can open the official page normally, support a local HTML import using `--input-html` plus an explicit canonical official `--url`. Mark `retrievalMode=local-html-import`, keep HTTP status and retrieval time unknown/null, record import time and the saved-file SHA-256, and mark robots policy as not checked by the import run. Never represent a local import as a live HTTP fetch. Keep the metadata-only default and require all 30 article headings/content blocks to reconcile before emitting a manifest.


When interpreting `robots.txt`, select the most-specific matching product-token group and use `User-agent: *` only as fallback; combine groups only at the same most-specific token. Match `*` wildcards and terminal `$` anchors, resolve by longest matching rule, and let `Allow` win equal-specificity ties. Treat a denial or inability to verify policy as a blocker, never as a cue to try another host or disguise the client.