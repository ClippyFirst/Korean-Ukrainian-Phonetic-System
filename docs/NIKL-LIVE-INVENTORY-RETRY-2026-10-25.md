# Official NIKL live-inventory retry — 2026-10-25

This branch exists to run the repository's existing metadata-only NIKL inventory job under the workflow's explicit `research/nikl-*` gate. It does not bypass HTTP restrictions, scrape protected content, or treat a skipped crawl as success.

Acceptance:
- PASS only if the official endpoint is actually reached, the inventory validates, and the workflow uploads the manifest/log.
- BLOCKED if the official host rejects the runner or access is otherwise unavailable; preserve the exact status and log.
- FAIL if the collector runs but produces malformed/incomplete data or violates validation.
- A failed/skipped crawl does not change source licensing status or justify claiming the 105/109 source registry records are cleared.

The branch also carries the current holdout-validation regression repairs from PR #326 so the crawl is evaluated against the same code state. The holdout itself remains diagnostic-only; it contains no independent IPA or Ukrainian gold.
