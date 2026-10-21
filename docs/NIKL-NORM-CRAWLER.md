# NIKL Standard Pronunciation Rules collector

This collector is a reproducible source-inventory tool, not a pronunciation engine.

## Scope

- Official source: https://korean.go.kr/kornorms/m/m_regltn.do?regltn_code=0002
- Expected inventory: Articles 1–30 of 제2부 표준 발음법 only.
- Excluded: adjacent parts of the standards portal, unofficial sources, dictionary/corpus harvesting, and any direct Hangul-to-Ukrainian transformation.

## Run locally

Requires the repository's declared Node.js runtime (Node 22.12+); no third-party package is required.

    node scripts/nikl-norm-crawler.mjs --help
    node scripts/nikl-norm-crawler.mjs --output reports/nikl/standard-pronunciation-manifest.json

The default command:
1. restricts the URL to HTTPS on the official korean.go.kr host and the /kornorms/ path;
2. checks robots.txt and stops if the target path is disallowed or policy cannot be checked;
3. fetches one official page with a descriptive user-agent, timeout and 10 MiB response cap;
4. records HTTP metadata, exact response SHA-256, retrieval time, article IDs/titles/locators and normalized per-article hashes;
5. fails closed unless all 30 numbered articles are extracted exactly once with non-empty content;
6. writes metadata only; raw HTML is never persisted.

The manifest records terms status as not_assessed. Public accessibility is not treated as a license. The default mode does not retain or redistribute article text.

## Optional local text extraction

Only after a human has reviewed the source's current reuse terms, a local operator may explicitly retain extracted article text:

    node scripts/nikl-norm-crawler.mjs --include-text --terms-reviewed --output reports/nikl/local-article-text.json

This is an acknowledgement gate, not legal advice or an assertion that the source permits redistribution. Do not commit this output unless reuse rights have been verified.

## Validation

Fixture-based parser tests run in the existing browser regression suite:

    npm test
    npm run build

The parser requires a semantic heading for 제2부 표준 발음법; selector drift is a hard failure rather than an empty successful crawl. Tests cover the full 1–30 inventory, exclusions, missing/duplicate headings, empty extraction, entity decoding, source URL allowlisting, robots decisions and metadata-only output.

## Limits

- A successful extraction proves only that the expected page structure was parsed, not that every rule has been interpreted correctly.
- Per-article hashes are integrity/change-detection aids, not proof of source authenticity beyond the captured response.
- Official terms and redistribution permissions have not yet been independently adjudicated.
- This collector does not generate IPA, decide morphology, infer lexical exceptions, or produce Ukrainian output. Use the coverage and evidence-audit skills for those stages.
