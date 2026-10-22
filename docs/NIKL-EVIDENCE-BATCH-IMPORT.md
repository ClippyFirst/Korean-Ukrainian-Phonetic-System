# NIKL evidence-page batch import

Use this helper when the official NIKL pages open in a human's ordinary browser but direct automated retrieval is denied. It does **not** fetch pages, bypass access controls, adjudicate claims, or mark citations as reviewed.

## Workflow

1. Open each official URL in a normal browser session and use the browser's ordinary **Save Page As** action to save the page as HTML. Do not use proxy/stealth services or alternate hosts to evade a denial.
2. Create a local JSON input manifest. Paths are relative to that JSON file:

   ```json
   {
     "sources": [
       {
         "sourceId": "SRC-NIKL-QNA-317202",
         "url": "https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=317202",
         "inputHtml": "saved/317202.html"
       },
       {
         "sourceId": "SRC-NIKL-FAQ-5949",
         "url": "https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5949&mn_id=217",
         "inputHtml": "saved/faq-5949.html"
       }
     ]
   }
   ```

3. Run:

   ```sh
   npm run import:nikl-evidence -- --input-manifest saved-pages.json --output reports/nikl/evidence-import-manifest.json
   ```

4. Inspect each saved official page yourself. Compare the exact cited target, page title/date, quoted example versus case-specific answer, rule instrument, morphology/POS, and claim scope. Only after that manual claim-level review should the source register or lexical notes be updated.

## Safety and evidence semantics

- Only HTTPS URLs on the exact official `korean.go.kr`, `www.korean.go.kr`, or `m.korean.go.kr` hosts and allowlisted NIKL Q&A, curated FAQ, pronunciation-rules, and official reuse-policy paths are accepted. FAQ `pageIndex` is accepted as display/navigation metadata but does not change the source identifier. Q&A/FAQ pages require an exact numeric page identifier.
- Each source ID and canonical URL must be unique. Missing/empty files, likely error pages, invalid UTF-8, and files over 10 MiB fail closed.
- Output contains source IDs/URLs, page title and headings, import timestamp, local filename, byte count, SHA-256 hashes, and normalized visible-text length. It never copies raw HTML or page text into the output.
- It explicitly records `httpFetchedAt=null`, `httpStatus=null`, `robotsStatus=not_checked_local_import`, `reuseTermsStatus=not_assessed`, `reviewStatus=NOT_REVIEWED_CONTENT_HASH_ONLY`, and `claimSupportEstablished=false`. These fields must not be promoted merely because the importer succeeds.
- Page hashes are integrity aids, not proof that a citation supports a claim. The input files and their local path are not embedded in the manifest; only the basename is retained.
- The output contract is defined in [the JSON Schema](../schemas/nikl-evidence-import-manifest.schema.json). The current output is a local evidence inventory, not a substitute for the source register, not a live HTTP crawl, and not a legal rights determination. Keep saved HTML local unless item-level reuse rights have been checked.

## Validation

```sh
npm test
npm run build
```

The focused regression suite is `tests/nikl-evidence-import.test.mjs`. It covers multi-page imports, no-text-retention, official-host/path/identifier allowlisting, duplicate IDs/URLs, missing or error-like files, malformed input, and output/source collision protection.
