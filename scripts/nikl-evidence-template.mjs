#!/usr/bin/env node
/**
 * Build an import manifest template for unreviewed official NIKL Q&A/FAQ citations.
 * This reads metadata only; it neither downloads pages nor changes evidence status.
 */
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { officialSourceUrl } from "./nikl-evidence-import.mjs";

function parseCsvRecords(text) {
  const rows = [];
  let row = [], field = "", quoted = false, afterQuote = false;
  const input = String(text).replace(/^\uFEFF/u, "").replace(/\r\n?/gu, "\n");
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quoted) {
      if (ch === '"' && input[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') { quoted = false; afterQuote = true; }
      else field += ch;
    } else if (afterQuote) {
      if (ch === ",") { row.push(field); field = ""; afterQuote = false; }
      else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; afterQuote = false; }
      else throw new Error("Malformed CSV: unexpected character after a closing quote.");
    } else if (ch === '"') {
      if (field.length) throw new Error("Malformed CSV: quote inside an unquoted field.");
      quoted = true;
    } else if (ch === ",") {
      row.push(field); field = "";
    } else if (ch === "\n") {
      row.push(field); rows.push(row); row = []; field = "";
    } else {
      field += ch;
    }
  }
  if (quoted) throw new Error("Malformed CSV: unterminated quoted field.");
  if (field.length || row.length || afterQuote) { row.push(field); rows.push(row); }
  if (!rows.length) throw new Error("Source register CSV is empty.");
  const header = rows.shift().map(value => value.trim());
  if (new Set(header).size !== header.length) throw new Error("Source register CSV has duplicate header names.");
  const records = rows.filter(record => !(record.length === 1 && record[0] === ""));
  for (let i = 0; i < records.length; i++) {
    if (records[i].length !== header.length) {
      throw new Error("Malformed CSV row " + (i + 2) + ": expected " + header.length + " fields, got " + records[i].length + ".");
    }
  }
  return records.map(values => Object.fromEntries(header.map((key, i) => [key, values[i]])));
}

export function buildImportTemplate(csvText, { relativeHtmlDirectory = "saved-pages" } = {}) {
  const htmlDirectory = String(relativeHtmlDirectory).replaceAll("\\", "/");
  if (!htmlDirectory || htmlDirectory.startsWith("/") || /^[A-Za-z]:/u.test(htmlDirectory) ||
      htmlDirectory.split("/").some(part => !part || part === "." || part === "..")) {
    throw new Error("HTML directory must be a safe relative path without empty, dot, or parent segments.");
  }
  const rows = parseCsvRecords(csvText);
  for (const column of ["source_id", "url", "review_status"]) {
    if (!rows.length || !(column in rows[0])) throw new Error("Source register is missing required column: " + column);
  }
  const eligible = rows.filter(row =>
    /unverified_lexical_citation_inventory/u.test(row.review_status ?? "") &&
    /^(?:SRC-NIKL-(?:QNA|MCFAQ|FAQ)-\d+|SRC-KRDICT-(?:ENG|KOR)-\d+)$/u.test(row.source_id ?? "") &&
    /^https:\/\/(?:www\.|m\.)?korean\.go\.kr\/front\/(?:onlineQna\/onlineQnaView\.do|mcfaq\/mcfaqView\.do)(?:\?|$)|^https:\/\/krdict\.korean\.go\.kr\/(?:eng|kor)\/dicSearch\/SearchView\?/u.test(row.url ?? "")
  );
  const seenIds = new Set();
  const seenUrls = new Set();
  const sources = eligible.map(row => {
    if (seenIds.has(row.source_id)) throw new Error("Duplicate source ID in source register: " + row.source_id);
    seenIds.add(row.source_id);
    const url = officialSourceUrl(row.url);
    if (seenUrls.has(url)) throw new Error("Duplicate canonical official URL in source register: " + url);
    seenUrls.add(url);
    return {
      sourceId: row.source_id,
      url,
      inputHtml: relativeHtmlDirectory.replace(/\\/gu, "/").replace(/\/$/u, "") + "/" + row.source_id + ".html",
    };
  });
  return { sources, sourceCount: sources.length, allSourcesContentReviewed: false };
}

function parseArgs(argv) {
  const args = { sourceRegister: "research/SOURCE-REGISTER.csv", output: "reports/nikl/saved-pages-import.template.json", help: false };
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
      console.log("Usage: node scripts/nikl-evidence-template.mjs [--source-register research/SOURCE-REGISTER.csv] [--output reports/nikl/saved-pages-import.template.json]");
    } else {
      const inputPath = resolve(args.sourceRegister), outputPath = resolve(args.output);
      if (inputPath === outputPath) throw new Error("Output must not overwrite the source register.");
      const template = buildImportTemplate(new TextDecoder("utf-8", { fatal: true }).decode(await readFile(inputPath)));
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
    console.error("NIKL evidence template generation failed closed: " + (error instanceof Error ? error.message : String(error)));
    process.exitCode = 1;
  }
}
