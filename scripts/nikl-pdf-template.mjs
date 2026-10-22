#!/usr/bin/env node
/** Generate a local import template for cited NIKL-hosted PDF files; never downloads them. */
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsvRecords } from "./nikl-evidence-template.mjs";
import { canonicalOfficialPdfUrl } from "./nikl-pdf-import.mjs";

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

function parseArgs(argv) {
  const args = { sourceRegister: "research/SOURCE-REGISTER.csv", output: "reports/nikl/saved-pdfs-import.template.json", help: false };
  for (let i = 0; i < argv.length; i++) {
    const option = argv[i];
    if (option === "--help" || option === "-h") { args.help = true; continue; }
    if (!["--source-register", "--output"].includes(option)) throw new Error("Unknown option: " + option);
    const value = argv[++i];
    if (!value || value.startsWith("--")) throw new Error(option + " requires a value.");
    args[option === "--source-register" ? "sourceRegister" : "output"] = value;
  }
  return args;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath && fileURLToPath(import.meta.url) === invokedPath) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      console.log("Usage: node scripts/nikl-pdf-template.mjs [--source-register research/SOURCE-REGISTER.csv] [--output reports/nikl/saved-pdfs-import.template.json]");
    } else {
      const inputPath = resolve(args.sourceRegister), outputPath = resolve(args.output);
      if (inputPath === outputPath) throw new Error("Output must not overwrite the source register.");
      const template = buildPdfImportTemplate(new TextDecoder("utf-8", { fatal: true }).decode(await readFile(inputPath)));
      await mkdir(dirname(outputPath), { recursive: true });
      const temporary = outputPath + ".tmp-" + process.pid;
      try {
        await writeFile(temporary, JSON.stringify(template, null, 2) + "\n", { encoding: "utf8", flag: "wx" });
        await rename(temporary, outputPath);
      } catch (error) {
        const { unlink } = await import("node:fs/promises");
        await unlink(temporary).catch(() => {});
        throw error;
      }
      console.log(JSON.stringify({ output: outputPath, sourceCount: template.sourceCount, pagesDownloaded: 0, evidenceStatusChanged: false }, null, 2));
    }
  } catch (error) {
    console.error("NIKL PDF template generation failed closed: " + (error instanceof Error ? error.message : String(error)));
    process.exitCode = 1;
  }
}
