#!/usr/bin/env node
/**
 * Local, metadata-only intake for human-saved official NIKL PDF documents.
 * Does not download PDFs, extract text, or establish claim support.
 */
import { mkdir, readFile, realpath, rename, writeFile } from "node:fs/promises";
import { basename, dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { sha256 } from "./nikl-norm-crawler.mjs";
import { fileURLToPath } from "node:url";

const MAX_MANIFEST_BYTES = 10 * 1024 * 1024;
const MAX_PDF_BYTES = 100 * 1024 * 1024;
const MAX_SOURCES = 100;
const OFFICIAL_HOSTS = new Set(["korean.go.kr", "www.korean.go.kr"]);
const ALLOWED_FILE_PATHS = new Set(["etcData", "reportData"]);

export function canonicalOfficialPdfUrl(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error("Each PDF source requires a valid absolute URL."); }
  if (url.protocol !== "https:" || !OFFICIAL_HOSTS.has(url.hostname.toLowerCase())) {
    throw new Error("Only HTTPS URLs on the exact official korean.go.kr hosts are allowed.");
  }
  if (url.pathname !== "/common/download.do") throw new Error("PDF URL path must be /common/download.do.");
  const allowed = new Set(["c_file_name", "file_path", "o_file_name"]);
  for (const key of url.searchParams.keys()) {
    if (!allowed.has(key)) throw new Error("Unexpected NIKL PDF query parameter: " + key);
  }
  for (const key of allowed) {
    if (url.searchParams.getAll(key).length !== 1) throw new Error("PDF URL requires exactly one " + key + " parameter.");
  }
  const storedName = url.searchParams.get("c_file_name");
  const filePath = url.searchParams.get("file_path");
  const displayName = url.searchParams.get("o_file_name");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?:_0)?\.pdf$/iu.test(storedName ?? "")) {
    throw new Error("c_file_name must be an official UUID-based PDF filename.");
  }
  if (!ALLOWED_FILE_PATHS.has(filePath)) throw new Error("NIKL PDF file_path is outside the approved document directories.");
  if (!displayName || displayName.length > 255 || /[\\/\u0000-\u001f]/u.test(displayName)) {
    throw new Error("o_file_name must be a non-empty display filename without path separators or control characters.");
  }
  if (url.username || url.password || url.port) throw new Error("URL credentials and non-default ports are not allowed.");
  url.hash = "";
  url.searchParams.sort();
  return url.toString();
}

export function buildPdfImportTemplate(csvText, { relativePdfDirectory = "saved-pdfs" } = {}) {
  const pdfDirectory = String(relativePdfDirectory).replaceAll("\\", "/");
  if (!pdfDirectory || pdfDirectory.startsWith("/") || /^[A-Za-z]:/u.test(pdfDirectory) ||
      pdfDirectory.split("/").some(part => !part || part === "." || part === "..")) {
    throw new Error("PDF directory must be a safe relative path without empty, dot, or parent segments.");
  }
  const rows = parseCsvRecords(csvText);
  for (const column of ["source_id", "url", "review_status"]) {
    if (!rows.length || !(column in rows[0])) throw new Error("Source register is missing required column: " + column);
  }
  const eligible = rows.filter(row =>
    /unverified_lexical_citation_inventory/u.test(row.review_status ?? "") &&
    /^SRC-NIKL-DOWNLOAD-[0-9a-f-]{36}(?:_0)?$/iu.test(row.source_id ?? "") &&
    /^https:\/\/(?:www\.)?korean\.go\.kr\/common\/download\.do\?/u.test(row.url ?? "")
  );
  const ids = new Set(), urls = new Set();
  const sources = eligible.map(row => {
    if (ids.has(row.source_id)) throw new Error("Duplicate PDF source ID: " + row.source_id);
    ids.add(row.source_id);
    const url = canonicalOfficialPdfUrl(row.url);
    if (urls.has(url)) throw new Error("Duplicate canonical PDF source URL: " + url);
    urls.add(url);
    const storedName = new URL(url).searchParams.get("c_file_name");
    if (row.source_id !== "SRC-NIKL-DOWNLOAD-" + storedName.slice(0, -4)) {
      throw new Error(row.source_id + ": source ID does not match c_file_name in URL.");
    }
    return { sourceId: row.source_id, url, inputFile: pdfDirectory + "/" + row.source_id + ".pdf" };
  });
  return { sources, sourceCount: sources.length, allSourcesContentReviewed: false };
}

export async function buildPdfImport(inputManifestPath, outputPath, { now = () => new Date().toISOString() } = {}) {
  const inputPath = resolve(inputManifestPath);
  const resolvedOutput = resolve(outputPath);
  if (inputPath === resolvedOutput) throw new Error("Output manifest must not overwrite the source manifest.");
  const inputBytes = await readFile(inputPath);
  if (inputBytes.length > MAX_MANIFEST_BYTES) throw new Error("Input manifest exceeds 10 MiB.");
  const input = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(inputBytes));
  if (!input || !Array.isArray(input.sources) || input.sources.length < 1 || input.sources.length > MAX_SOURCES) {
    throw new Error("Input manifest must contain 1–100 sources in a sources array.");
  }
  const baseDirectory = await realpath(dirname(inputPath));
  const ids = new Set(), urls = new Set(), pdfPaths = new Set(), records = [];
  for (const source of input.sources) {
    if (!source || typeof source.sourceId !== "string" ||
        !/^SRC-NIKL-DOWNLOAD-[0-9a-f-]{36}(?:_0)?$/iu.test(source.sourceId)) {
      throw new Error("Each PDF source requires a stable SRC-NIKL-DOWNLOAD UUID sourceId.");
    }
    if (ids.has(source.sourceId)) throw new Error("Duplicate PDF sourceId: " + source.sourceId);
    ids.add(source.sourceId);
    const sourceUrl = canonicalOfficialPdfUrl(source.url);
    if (urls.has(sourceUrl)) throw new Error("Duplicate canonical PDF source URL: " + sourceUrl);
    urls.add(sourceUrl);
    const parsedUrl = new URL(sourceUrl);
    const storedName = parsedUrl.searchParams.get("c_file_name");
    if (source.sourceId !== "SRC-NIKL-DOWNLOAD-" + storedName.slice(0, -4)) {
      throw new Error(source.sourceId + ": source ID does not match c_file_name in URL.");
    }
    if (typeof source.inputFile !== "string" || !source.inputFile.trim() || isAbsolute(source.inputFile)) {
      throw new Error(source.sourceId + ": inputFile must be a non-empty relative path.");
    }
    const parts = source.inputFile.replaceAll("\\", "/").split("/");
    if (parts.some(part => !part || part === "." || part === "..")) {
      throw new Error(source.sourceId + ": inputFile path traversal is not allowed.");
    }
    const pdfPath = resolve(baseDirectory, source.inputFile);
    const rel = relative(baseDirectory, pdfPath);
    if (!rel || rel === ".." || rel.startsWith(".." + sep) || isAbsolute(rel)) {
      throw new Error(source.sourceId + ": inputFile must remain below the input manifest directory.");
    }
    if (pdfPath === resolvedOutput || pdfPath === inputPath) {
      throw new Error(source.sourceId + ": output/source-manifest collision.");
    }
    if (pdfPaths.has(pdfPath)) throw new Error("Two source records point to the same local PDF file.");
    pdfPaths.add(pdfPath);
    const actualPath = await realpath(pdfPath);
    const realRel = relative(baseDirectory, actualPath);
    if (realRel === ".." || realRel.startsWith(".." + sep) || isAbsolute(realRel)) {
      throw new Error(source.sourceId + ": symlinked PDF resolves outside the input directory.");
    }
    const bytes = await readFile(actualPath);
    if (bytes.length < 16) throw new Error(source.sourceId + ": saved file is too small to be a PDF.");
    if (bytes.length > MAX_PDF_BYTES) throw new Error(source.sourceId + ": saved PDF exceeds 100 MiB.");
    const header = bytes.subarray(0, 16).toString("ascii");
    const versionMatch = header.match(/^%PDF-(\d\.\d)/u);
    if (!versionMatch) throw new Error(source.sourceId + ": saved file lacks a PDF signature; it may be an HTML error page.");
    const tail = bytes.subarray(Math.max(0, bytes.length - 2048)).toString("latin1");
    if (!/%%EOF[\x00\t\n\f\r ]*$/u.test(tail)) {
      throw new Error(source.sourceId + ": saved PDF has no terminal %%EOF marker; refusing a likely truncated file.");
    }
    records.push({
      sourceId: source.sourceId,
      sourceUrl,
      retrievalMode: "local-pdf-import",
      importedAt: now(),
      httpFetchedAt: null,
      httpStatus: null,
      robotsStatus: "not_checked_local_import",
      rightsStatus: "not_assessed",
      reviewStatus: "NOT_REVIEWED_BINARY_HASH_ONLY",
      localFileName: basename(actualPath),
      fileBytes: bytes.length,
      fileSha256: sha256(bytes),
      pdfVersion: versionMatch[1],
      hasPdfEofMarker: true,
      displayFileName: parsedUrl.searchParams.get("o_file_name"),
      textExtracted: false,
      contentRetained: false,
      claimSupportEstablished: false,
      note: "Binary integrity metadata only. PDF text, document identity, rights, and claim support have not been reviewed.",
    });
  }
  const manifest = {
    schemaVersion: 1,
    generatedAt: now(),
    generatedBy: "scripts/nikl-pdf-import.mjs",
    retentionPolicy: "binary-metadata-and-hashes-only; no PDF bytes or extracted text are copied to this manifest",
    sourceCount: records.length,
    allSourcesContentReviewed: false,
    sources: records,
  };
  await mkdir(dirname(resolvedOutput), { recursive: true });
  const temporary = resolvedOutput + ".tmp-" + process.pid;
  try {
    await writeFile(temporary, JSON.stringify(manifest, null, 2) + "\n", { encoding: "utf8", flag: "wx" });
    await rename(temporary, resolvedOutput);
  } catch (error) {
    const { unlink } = await import("node:fs/promises");
    await unlink(temporary).catch(() => {});
    throw error;
  }
  return manifest;
}



function parseArgs(argv) {
  const args = { input: null, output: "reports/nikl/pdf-import-manifest.json", help: false };
  for (let i = 0; i < argv.length; i++) {
    const option = argv[i];
    if (option === "--help" || option === "-h") { args.help = true; continue; }
    if (!["--input-manifest", "--output"].includes(option)) throw new Error("Unknown option: " + option);
    const value = argv[++i];
    if (!value || value.startsWith("--")) throw new Error(option + " requires a value.");
    args[option === "--input-manifest" ? "input" : "output"] = value;
  }
  if (!args.help && !args.input) throw new Error("--input-manifest is required.");
  return args;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath && fileURLToPath(import.meta.url) === invokedPath) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      console.log("Usage: node scripts/nikl-pdf-import.mjs --input-manifest saved-pdfs.json [--output reports/nikl/pdf-import-manifest.json]");
    } else {
      const manifest = await buildPdfImport(args.input, args.output);
      console.log(JSON.stringify({ output: resolve(args.output), sourceCount: manifest.sourceCount, textExtracted: false, claimSupportEstablished: false }, null, 2));
    }
  } catch (error) {
    console.error("NIKL PDF import failed closed: " + (error instanceof Error ? error.message : String(error)));
    process.exitCode = 1;
  }
}
