# Official NIKL live-inventory retry — 2026-10-25

This branch exists to run the repository's existing metadata-only NIKL inventory job under the workflow's explicit `research/nikl-*` gate. It does not bypass HTTP restrictions, scrape protected content, or treat a skipped crawl as success.

Acceptance:
- PASS only if the official endpoint is actually reached, the inventory validates, and the workflow uploads the manifest/log.
- BLOCKED if the official host rejects the runner or access is otherwise unavailable; preserve the exact status and log.
- FAIL if the collector runs but produces malformed/incomplete data or violates validation.
- A failed/skipped crawl does not change source licensing status or justify claiming the 105/109 source registry records are cleared.

The branch also carries the current holdout-validation regression repairs from PR #326 so the crawl is evaluated against the same code state. The holdout itself remains diagnostic-only; it contains no independent IPA or Ukrainian gold.

## Actual runner result

- Push workflow: [40210995826](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40210995826).
- Job `Official NIKL source inventory (metadata-only)`: job conclusion **success**, but the collector itself reported **BLOCKED** because the official host returned HTTP 403. This is correctly classified as an access block, not as a successful inventory.
- Artifact: [nikl-source-crawl-40210995826](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40210995826/artifacts/12605226755). Its log says: `NIKL crawl BLOCKED: Official source denied or rate-limited this request (HTTP 403); do not bypass access controls.`
- No inventory manifest was produced; live NIKL inventory status remains `BLOCKED_EXTERNAL_ACCESS`. Do not change any individual source's licensing status on the strength of this run.

