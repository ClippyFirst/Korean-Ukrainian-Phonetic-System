---
name: nikl-norm-crawler
description: Use when discovering, fetching, parsing, or refreshing official Korean National Institute of Korean Language (NIKL) normative pages, especially Standard Pronunciation Rules, and producing auditable source manifests.
---

# NIKL Norm Crawler

## Mission and primary sources

Build a reproducible, polite collector for official Korean-language norms. Start with:
- Standard Pronunciation Rules (표준 발음법): https://korean.go.kr/kornorms/m/m_regltn.do?regltn_code=0002
- Korean Norms portal: https://korean.go.kr/kornorms/main/main.do
- Standard Korean Dictionary: https://stdict.korean.go.kr/

NIKL is the normative source. Third-party G2P tools are comparison systems, never authorities that override official evidence.

## Reconnaissance and collection

1. Inspect robots.txt, published terms/use guidance, page links, response headers, and page structure before crawling.
2. Prefer an official structured endpoint or downloadable source if available. Otherwise parse static HTML; use browser automation only when content genuinely requires JavaScript.
3. Do not bypass authentication, access controls, rate limits, CAPTCHAs, or technical restrictions. If blocked, record the blocker and stop that path.
4. Restrict crawling to relevant official NIKL hosts and discovered official links. Use conservative pacing, caching, retries with backoff, and an identifying user-agent.
5. Record retrieval timestamp (UTC), final URL, HTTP status, content type, response hash, parser version, and source title for every resource.
6. Discover the article inventory from the official table of contents, not from already implemented rules.

## Record contract

Keep raw fetch metadata separate from normalized records. Reuse repository schemas where possible; otherwise document a versioned schema before producing data.

For each rule/subrule, capture fields where available: stable source ID; exact article label; official title and canonical URL; source-language text reference; conditions and exceptions as separate fields; examples in source order; cross-references; retrieval time; SHA-256; parser version; extraction status; parse warnings.

Distinguish not present in source, not extracted, and not checked. An empty field must not imply that no exception exists.

## Copyright, reuse, and safety

Prefer storing URLs, identifiers, hashes, concise notes, and minimum excerpts required for verification. Do not bulk-republish official pages or dictionary entries unless reuse terms clearly permit it. Keep raw caches local and out of version control where redistribution rights are unclear. Record actual terms and the date checked; public accessibility is not an open license.

Do not circumvent technical restrictions. Do not scrape unrelated personal data.

## Completion gate

A successful HTTP response is not completion. Require reconciliation of the discovered article inventory against the official contents; parse status for every expected article; duplicate/missing/changed-ID reports; manual review of representative records; and validation that fails loudly on malformed or missing content. Re-runs should be stable when the source has not changed.

Never synthesize IPA if the source does not provide IPA. Collection alone does not authorize a phonological rule in the engine.
