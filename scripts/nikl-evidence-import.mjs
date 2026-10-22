#!/usr/bin/env node
/**
 * Metadata-only batch inventory for human-saved official NIKL pages.
 *
 * This is intentionally not a content-review tool: hashes and page titles do
 * not establish that a citation supports a linguistic claim. The input HTML
 * is read locally and is never copied to the output manifest.
 */
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseHtmlTree, textContent, sha256 } from "./nikl-norm-crawler.mjs";

const MAX_SOURCE_BYTES = 10 * 1024 * 1024;
const MAX_SOURCES = 250;
const ALLOWED_PATHS = new Set([
  "/front/onlineQna/onlineQnaView.do",
  "/front/mcfaq/mcfaqView.do",
  "/kornorms/regltn/regltnView.do",
  "/kornorms/m/m_regltn.do",
  "/front/nuri/pageView.do",
]);

function normalized(value) {
  return String(value ?? "").replace(/[\u00a0\u200b\ufeff]/g, " ").replace(/\s+/g, " ").trim();
}

export function officialSourceUrl(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error("Each source requires a valid absolute URL."); }
  if (url.protocol !== "https:" || !["korean.go.kr", "www.korean.go.kr", "m.korean.go.kr"].includes(url.hostname.toLowerCase())) {
    throw new Error("Only HTTPS pages on the official korean.go.kr host are allowed.");
  }
  if (!ALLOWED_PATHS.has(url.pathname)) throw new Error("URL path is outside the official NIKL evidence-import allowlist: " + url.pathname);
  const queryContract = url.pathname.includes("onlineQna")
    ? { required: "qna_seq", allowed: new Set(["qna_seq", "mn_id", "pageIndex"]) }
    : url.pathname.includes("mcfaq")
      ? { required: "mcfaq_seq", allowed: new Set(["mcfaq_seq", "mn_id", "pageIndex"]) }
      : url.pathname.includes("regltnView") || url.pathname.includes("m_regltn")
        ? { required: "regltn_code", allowed: new Set(["regltn_code"]) }
        : { required: "page_id", allowed: new Set(["page_id", "mkn"]) };
  for (const key of url.searchParams.keys()) {
    if (!queryContract.allowed.has(key)) throw new Error("Unexpected query parameter for official NIKL page: " + key);
  }
  const values = url.searchParams.getAll(queryContract.required);
  const valid = values.length === 1 && (queryContract.required === "regltn_code" ? values[0] === "0002"
    : queryContract.required === "page_id" ? values[0] === "P000189"
      : /^\d+$/.test(values[0]) && Number(values[0]) > 0);
  if (!valid) throw new Error("Official URL must contain exactly one valid " + queryContract.required + " identifier.");
  if (url.username || url.password) throw new Error("URL credentials are not allowed.");
  url.hash = "";
  url.searchParams.sort();
  return url.toString();
}

function descendants(node, predicate, output = []) {
  if (predicate(node)) output.push(node);
  for (const child of node.children ?? []) descendants(child, predicate, output);
  return output;
}

export function extractPageMetadata(html) {
  if (typeof html !== "string" || !html.trim()) throw new Error("Saved HTML must be non-empty text.");
  const root = parseHtmlTree(html);
  const titleNode = descendants(root, node => node.tag === "title")[0] ?? null;
  const bodyNode = descendants(root, node => node.tag === "body")[0] ?? root;
  const headings = descendants(bodyNode, node => /^h[1-3]$/.test(node.tag))
    .map(node => normalized(textContent(node))).filter(Boolean);
  const visibleText = normalized(textContent(bodyNode));
  if (visibleText.length < 80) throw new Error("Saved HTML has too little visible text; refusing an apparently incomplete/error page.");
  const errorPagePattern = /(?:^|\b)(?:403\s+forbidden|404\s+not\s+found|access\s+denied|request\s+blocked|too\s+many\s+requests|captcha|verify\s+you\s+are\s+human|just\s+a\s+moment)(?:\b|$)/iu;
  if (errorPagePattern.test(normalized(textContent(titleNode))) || errorPagePattern.test(visibleText.slice(0, 1200))) {
    throw new Error("Saved page appears to be an access-denial, challenge, or HTTP error page; refusing to inventory it as an official source.");
  }
  return {
    documentTitle: normalized(textContent(titleNode)) || null,
    headings: [...new Set(headings)].slice(0, 30),
    normalizedTextSha256: sha256(visibleText.normalize("NFC")),
    normalizedTextCharCount: [...visibleText].length,
  };
}

export async function buildEvidenceImport(inputManifestPath, outputPath, { now = () => new Date().toISOString() } = {}) {
  const inputPath = resolve(inputManifestPath);
  const resolvedOutput = resolve(outputPath);
  if (inputPath === resolvedOutput) throw new Error("Output manifest must not overwrite the source manifest.");
  const inputBytes = await readFile(inputPath);
  if (inputBytes.length > MAX_SOURCE_BYTES) throw new Error("Input manifest exceeds 10 MiB.");
  const input = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(inputBytes));
  if (!input || !Array.isArray(input.sources) || input.sources.length < 1 || input.sources.length > MAX_SOURCES) {
    throw new Error("Input manifest must contain 1–250 sources in a sources array.");
  }
  const ids = new Set();
  const urls = new Set();
  const records = [];
  for (const source of input.sources) {
    if (!source || typeof source.sourceId !== "string" || !/^SRC-NIKL-[A-Z0-9-]{2,80}$/.test(source.sourceId)) {
      throw new Error("Each source requires a stable SRC-NIKL-* sourceId.");
    }
    if (ids.has(source.sourceId)) throw new Error("Duplicate sourceId: " + source.sourceId);
    ids.add(source.sourceId);
    const url = officialSourceUrl(source.url);
    const parsedUrl = new URL(url);
    const expectedQnaId = source.sourceId.match(/^SRC-NIKL-QNA-(\d+)$/);
    const expectedFaqId = source.sourceId.match(/^SRC-NIKL-(?:FAQ|MCFAQ)-(\d+)$/);
    if (expectedQnaId && parsedUrl.searchParams.get("qna_seq") !== expectedQnaId[1]) {
      throw new Error(source.sourceId + ": source ID does not match qna_seq in URL.");
    }
    if (expectedFaqId && parsedUrl.searchParams.get("mcfaq_seq") !== expectedFaqId[1]) {
      throw new Error(source.sourceId + ": source ID does not match mcfaq_seq in URL.");
    }
    if (urls.has(url)) throw new Error("Duplicate canonical source URL: " + url);
    urls.add(url);
    if (typeof source.inputHtml !== "string" || !source.inputHtml.trim()) throw new Error(source.sourceId + ": inputHtml path is required.");
    const htmlPath = resolve(dirname(inputPath), source.inputHtml);
    if (htmlPath === resolvedOutput) throw new Error(source.sourceId + ": output manifest must not overwrite an imported HTML file.");
    const bytes = await readFile(htmlPath);
    if (!bytes.length) throw new Error(source.sourceId + ": saved HTML is empty.");
    if (bytes.length > MAX_SOURCE_BYTES) throw new Error(source.sourceId + ": saved HTML exceeds 10 MiB.");
    const html = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    const page = extractPageMetadata(html);
    records.push({
      sourceId: source.sourceId,
      sourceUrl: url,
      retrievalMode: "local-html-import",
      importedAt: now(),
      httpFetchedAt: null,
      httpStatus: null,
      robotsStatus: "not_checked_local_import",
      reuseTermsStatus: "not_assessed",
      reviewStatus: "NOT_REVIEWED_CONTENT_HASH_ONLY",
      localFileName: basename(htmlPath),
      htmlBytes: bytes.length,
      htmlSha256: sha256(bytes),
      ...page,
      contentRetained: false,
      claimSupportEstablished: false,
      note: "Metadata and hashes only. A human must inspect the official page and classify claim-level evidence before changing source-register review status.",
    });
  }
  const manifest = {
    schemaVersion: 1,
    generatedAt: now(),
    generatedBy: "scripts/nikl-evidence-import.mjs",
    retentionPolicy: "metadata-and-hashes-only; source HTML and extracted page text are not copied to this manifest",
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
  const args = { input: null, output: "reports/nikl/evidence-import-manifest.json", help: false };
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
      console.log("Usage: node scripts/nikl-evidence-import.mjs --input-manifest saved-pages.json [--output reports/nikl/evidence-import-manifest.json]");
    } else {
      const manifest = await buildEvidenceImport(args.input, args.output);
      console.log(JSON.stringify({ output: resolve(args.output), sourceCount: manifest.sourceCount, allSourcesContentReviewed: manifest.allSourcesContentReviewed, retainedContent: false }, null, 2));
    }
  } catch (error) {
    console.error("NIKL evidence import failed closed: " + (error instanceof Error ? error.message : String(error)));
    process.exitCode = 1;
  }
}
