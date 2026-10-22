import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { buildPdfImport, canonicalOfficialPdfUrl } from "../scripts/nikl-pdf-import.mjs";
import { buildPdfImportTemplate } from "../scripts/nikl-pdf-template.mjs";

const PDF_ONE = "https://korean.go.kr/common/download.do?c_file_name=fc727985-eb6b-493e-9467-221465b7c0a4_0.pdf&file_path=etcData&o_file_name=%EB%B0%94%EB%A5%B8+%EA%B5%AD%EC%96%B4+%EC%83%9D%ED%99%9C";
const PDF_TWO = "https://www.korean.go.kr/common/download.do?c_file_name=9b1df6a4-764f-47be-b40d-0037bae429a4.pdf&file_path=reportData&o_file_name=%ED%91%9C%EC%A4%80+%EB%B0%9C%EC%9D%8C%EB%B2%95+%EC%98%81%ED%96%A5.pdf";
const PDF_THREE = "https://www.korean.go.kr/common/download.do?c_file_name=b5b11311-261e-472e-8f72-92b72a6d7597_0.pdf&file_path=reportData&o_file_name=%EC%9E%91%EB%AC%B8.pdf";

function pdfBytes(body = "minimal PDF payload") {
  return Buffer.from("%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj\n" + body + "\n%%EOF\n", "latin1");
}
async function fixture(t) {
  const dir = await mkdtemp(join(tmpdir(), "nikl-pdf-import-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  return dir;
}

test("canonicalizes only allowlisted official NIKL PDF download URLs", () => {
  assert.equal(canonicalOfficialPdfUrl(PDF_ONE).startsWith("https://korean.go.kr/common/download.do?"), true);
  for (const url of [
    PDF_ONE.replace("https://korean.go.kr", "https://example.org"),
    PDF_ONE.replace("/common/download.do", "/other/download.do"),
    PDF_ONE + "&unexpected=1",
    PDF_ONE.replace("file_path=etcData", "file_path=private"),
    PDF_ONE.replace("c_file_name=", "c_file_name=bad"),
    PDF_ONE + "&o_file_name=duplicate.pdf",
    "http://korean.go.kr/common/download.do?c_file_name=x.pdf&file_path=etcData&o_file_name=x.pdf",
  ]) assert.throws(() => canonicalOfficialPdfUrl(url));
});

test("imports saved PDFs as binary metadata only and leaves evidence unreviewed", async t => {
  const dir = await fixture(t);
  await importFile(dir, "saved-pdfs/one.pdf", pdfBytes());
  const input = join(dir, "saved-pdfs.json");
  const output = join(dir, "reports", "pdf-manifest.json");
  await writeFile(input, JSON.stringify({ sources: [
    { sourceId: "SRC-NIKL-DOWNLOAD-fc727985-eb6b-493e-9467-221465b7c0a4_0", url: PDF_ONE, inputFile: "saved-pdfs/one.pdf" },
  ] }), "utf8");
  const manifest = await buildPdfImport(input, output, { now: () => "2026-10-22T12:00:00.000Z" });
  assert.equal(manifest.sourceCount, 1);
  assert.equal(manifest.allSourcesContentReviewed, false);
  const source = manifest.sources[0];
  assert.equal(source.retrievalMode, "local-pdf-import");
  assert.equal(source.pdfVersion, "1.7");
  assert.equal(source.hasPdfEofMarker, true);
  assert.equal(source.httpFetchedAt, null);
  assert.equal(source.httpStatus, null);
  assert.equal(source.robotsStatus, "not_checked_local_import");
  assert.equal(source.rightsStatus, "not_assessed");
  assert.equal(source.reviewStatus, "NOT_REVIEWED_BINARY_HASH_ONLY");
  assert.equal(source.textExtracted, false);
  assert.equal(source.contentRetained, false);
  assert.equal(source.claimSupportEstablished, false);
  assert.equal(source.fileSha256.length, 64);
  assert.equal("pageText" in source, false);
  assert.deepEqual(JSON.parse(await readFile(output, "utf8")), manifest);
});

test("fails closed on ID mismatches, HTML/error files, and truncated PDFs", async t => {
  const dir = await fixture(t);
  await importFile(dir, "saved-pdfs/valid.pdf", pdfBytes());
  await importFile(dir, "saved-pdfs/html-error.pdf", Buffer.from("<html><body>Access Denied</body></html>"));
  await importFile(dir, "saved-pdfs/truncated.pdf", Buffer.from("%PDF-1.7\nsome bytes without eof"));
  const input = join(dir, "saved-pdfs.json"), output = join(dir, "manifest.json");
  const cases = [
    [{ sourceId: "SRC-NIKL-DOWNLOAD-9b1df6a4-764f-47be-b40d-0037bae429a4", url: PDF_ONE, inputFile: "saved-pdfs/valid.pdf" }, /source ID does not match/u],
    [{ sourceId: "SRC-NIKL-DOWNLOAD-fc727985-eb6b-493e-9467-221465b7c0a4_0", url: PDF_ONE, inputFile: "saved-pdfs/html-error.pdf" }, /lacks a PDF signature/u],
    [{ sourceId: "SRC-NIKL-DOWNLOAD-fc727985-eb6b-493e-9467-221465b7c0a4_0", url: PDF_ONE, inputFile: "saved-pdfs/truncated.pdf" }, /terminal %%EOF/u],
    [{ sourceId: "SRC-NIKL-DOWNLOAD-fc727985-eb6b-493e-9467-221465b7c0a4_0", url: PDF_ONE, inputFile: "../outside.pdf" }, /path traversal/u],
  ];
  for (const [source, error] of cases) {
    await writeFile(input, JSON.stringify({ sources: [source] }), "utf8");
    await assert.rejects(buildPdfImport(input, output), error);
  }
});

test("refuses output collisions and duplicate source IDs/URLs", async t => {
  const dir = await fixture(t);
  await importFile(dir, "saved-pdfs/one.pdf", pdfBytes());
  const input = join(dir, "saved-pdfs.json"), pdf = join(dir, "saved-pdfs/one.pdf");
  const source = { sourceId: "SRC-NIKL-DOWNLOAD-fc727985-eb6b-493e-9467-221465b7c0a4_0", url: PDF_ONE, inputFile: "saved-pdfs/one.pdf" };
  await writeFile(input, JSON.stringify({ sources: [source, source] }), "utf8");
  await assert.rejects(buildPdfImport(input, join(dir, "manifest.json")), /Duplicate PDF sourceId/u);
  await writeFile(input, JSON.stringify({ sources: [source] }), "utf8");
  await assert.rejects(buildPdfImport(input, input), /must not overwrite the source manifest/u);
  await assert.rejects(buildPdfImport(input, pdf), /output\/source-manifest collision/u);
  assert.ok((await readFile(pdf)).subarray(0, 5).toString("ascii") === "%PDF-");
});

test("generates a template for the three unreviewed official NIKL PDFs without fetching them", async () => {
  const csv = await readFile(new URL("../research/SOURCE-REGISTER.csv", import.meta.url), "utf8");
  const template = buildPdfImportTemplate(csv);
  assert.equal(template.sourceCount, 3);
  assert.equal(template.allSourcesContentReviewed, false);
  assert.ok(template.sources.some(source => source.sourceId === "SRC-NIKL-DOWNLOAD-fc727985-eb6b-493e-9467-221465b7c0a4_0"));
  assert.ok(template.sources.every(source => source.inputFile.startsWith("saved-pdfs/")));
  assert.ok(template.sources.every(source => source.url.includes("/common/download.do?")));
});

test("rejects unsafe PDF template directories and source ID/filename mismatches", () => {
  const csv = [
    "source_id,url,review_status",
    'SRC-NIKL-DOWNLOAD-fc727985-eb6b-493e-9467-221465b7c0a4_0,' + PDF_ONE + ",unverified_lexical_citation_inventory_2026-10-22",
  ].join("\n");
  assert.throws(() => buildPdfImportTemplate(csv, { relativePdfDirectory: "../escape" }), /safe relative path/u);
  const mismatch = csv.replace("fc727985-eb6b-493e-9467-221465b7c0a4_0", "9b1df6a4-764f-47be-b40d-0037bae429a4");
  assert.throws(() => buildPdfImportTemplate(mismatch), /source ID does not match/u);
});

async function importFile(dir, relativePath, bytes) {
  const path = join(dir, relativePath);
  const { mkdir } = await import("node:fs/promises");
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, bytes);
}
