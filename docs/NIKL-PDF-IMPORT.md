# NIKL PDF evidence intake (metadata only)

This is a separate local-file intake for the three NIKL-hosted PDF documents already cited by research/SOURCE-REGISTER.csv. It exists because the HTML page importer intentionally does not treat a PDF download endpoint as an HTML page.

## Workflow

1. Generate a template from the current source register:

   \`\`\`sh
   npm run template:nikl-pdf
   \`\`\`

   This writes reports/nikl/saved-pdfs-import.template.json with three exact official document URLs and deterministic paths under saved-pdfs/.

2. Open each official URL through ordinary browser access and save the PDF to the exact path listed in the template. Do not use proxies, stealth scraping, alternate mirrors, or access-control bypasses.

3. Inventory local binary metadata:

   \`\`\`sh
   npm run import:nikl-pdf -- --input-manifest reports/nikl/saved-pdfs-import.template.json --output reports/nikl/pdf-import-manifest.json
   \`\`\`

## What the importer validates

- HTTPS and exact official host (korean.go.kr or www.korean.go.kr), the /common/download.do route, and an exact allowlist of query parameters.
- A UUID-based c_file_name, an allowed file_path (etcData or reportData), and a non-empty display filename.
- Stable source ID equals the exact stored filename without .pdf.
- Local path traversal and symlink escape are rejected; output cannot overwrite the input manifest or a PDF file.
- PDF size is limited to 100 MiB. The file must start with a %PDF-x.y signature and have a terminal %%EOF marker.

## Evidence semantics and limitations

The manifest contains only the source ID/URL, local basename, byte count, SHA-256, PDF version, display filename, and explicit review/provenance states. It does not extract or retain PDF text. It sets httpFetchedAt=null, httpStatus=null, robotsStatus=not_checked_local_import, rightsStatus=not_assessed, reviewStatus=NOT_REVIEWED_BINARY_HASH_ONLY, textExtracted=false, and claimSupportEstablished=false.

The header and EOF marker are lightweight structural checks, not a complete PDF parser, a guarantee that the document is authentic/current, a licensing determination, or proof that it supports a linguistic claim. A human must inspect the document, record title/version/pages and item-level reuse terms, and link the exact passage to the claim before changing source-register status. Keep saved PDFs local unless reuse rights permit redistribution.

Validation uses npm test and npm run build; the JSON output contract is in schemas/nikl-pdf-import-manifest.schema.json.
