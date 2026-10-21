#!/usr/bin/env node
/**
 * Metadata-first collector for the official NIKL Standard Pronunciation Rules.
 * No raw HTML is persisted. Article text retention is opt-in and requires an
 * explicit human acknowledgement that applicable reuse terms have been reviewed.
 */
import { createHash } from "node:crypto";
import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const DEFAULT_SOURCE_URL = "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002";
export const EXPECTED_ARTICLES = Object.freeze(Array.from({ length: 30 }, (_, index) => index + 1));
export const USER_AGENT = "ClippyFirst-NIKLResearchBot/0.1 (+https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System)";
const MAX_SOURCE_BYTES = 10 * 1024 * 1024;
const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const SKIP_TEXT_TAGS = new Set(["script", "style", "noscript", "template", "svg"]);

function sourceAccessBlocked(message) {
  const error = new Error(message);
  error.code = "SOURCE_ACCESS_BLOCKED";
  return error;
}

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function decodeHtmlEntities(value) {
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", hellip: "…", middot: "·", bull: "•", copy: "©", reg: "®" };
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]+);/gi, (entity, token) => {
    if (token[0] === "#") {
      const hex = token[1]?.toLowerCase() === "x";
      const point = Number.parseInt(token.slice(hex ? 2 : 1), hex ? 16 : 10);
      if (!Number.isFinite(point) || point <= 0 || point > 0x10ffff || (point >= 0xd800 && point <= 0xdfff)) return entity;
      return String.fromCodePoint(point);
    }
    return named[token.toLowerCase()] ?? entity;
  });
}

function parseAttributes(source) {
  const attrs = {};
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match;
  while ((match = pattern.exec(source))) attrs[match[1].toLowerCase()] = decodeHtmlEntities(match[2] ?? match[3] ?? match[4] ?? "");
  return attrs;
}

export function parseHtmlTree(html) {
  // Mask raw-text/non-content elements without changing offsets. This prevents JavaScript strings
  // or comparison operators containing <...> from corrupting the structural tree.
  const tokenHtml = html.replace(/<(script|style|noscript|template|svg)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, (block) => block.replace(/[^\r\n]/g, " "));
  const root = { tag: "#root", attrs: {}, children: [], start: 0, end: tokenHtml.length, parent: null };
  const stack = [root];
  const tokenPattern = /<!--[\s\S]*?-->|<![^>]*>|<\/?[A-Za-z][^>]*>|[^<]+|</g;
  let token;
  while ((token = tokenPattern.exec(tokenHtml))) {
    const raw = token[0];
    const current = stack[stack.length - 1];
    if (raw.startsWith("<!--") || /^<!/i.test(raw)) continue;
    if (raw.startsWith("</")) {
      const closeTag = raw.slice(2).match(/^\s*([\w:-]+)/)?.[1]?.toLowerCase();
      if (!closeTag) continue;
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === closeTag) {
          for (let j = stack.length - 1; j >= i; j--) stack[j].end = token.index + raw.length;
          stack.length = i;
          break;
        }
      }
      continue;
    }
    if (raw.startsWith("<")) {
      const open = raw.match(/^<\s*([\w:-]+)([\s\S]*?)>$/);
      if (!open) continue;
      const tag = open[1].toLowerCase();
      const node = { tag, attrs: parseAttributes(open[2].replace(/\/\s*$/, "")), children: [], start: token.index, end: token.index + raw.length, parent: current };
      current.children.push(node);
      if (!VOID_TAGS.has(tag) && !/\/\s*>$/.test(raw)) stack.push(node);
      continue;
    }
    current.children.push({ tag: "#text", text: decodeHtmlEntities(raw), attrs: {}, children: [], start: token.index, end: token.index + raw.length, parent: current });
  }
  for (const node of stack) node.end = tokenHtml.length;
  return root;
}

export function textContent(node) {
  if (!node) return "";
  if (node.tag === "#text") return node.text ?? "";
  if (SKIP_TEXT_TAGS.has(node.tag)) return "";
  return node.children.map(textContent).join(" ");
}

function normalizeText(value) {
  return value.replace(/[\u00a0\u200b\ufeff]/g, " ").replace(/\s+/g, " ").trim();
}

function walk(node, output = []) {
  if (node.tag !== "#text") output.push(node);
  for (const child of node.children ?? []) walk(child, output);
  return output;
}

function isHeadingLike(node) {
  return /^h[1-6]$/.test(node.tag) || ["strong", "b", "p", "div", "span", "a", "dt"].includes(node.tag);
}

function articleHeading(node) {
  if (!isHeadingLike(node)) return null;
  const text = normalizeText(textContent(node));
  if (!text || text.length > 420) return null;
  const match = text.match(/^제\s*(\d{1,2})\s*항(?:\s+|$)(.*)$/u);
  if (!match) return null;
  const number = Number(match[1]);
  if (number < 1 || number > 30) return null;
  return { number, text };
}

function isDescendant(ancestor, node) {
  for (let current = node.parent; current; current = current.parent) if (current === ancestor) return true;
  return false;
}

function stripHtml(html) {
  return normalizeText(decodeHtmlEntities(html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|noscript|template|svg)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|li|tr|td|th|h[1-6]|dd|dt)\s*>/gi, " ")
    .replace(/<[^>]*>/g, " ")));
}

function findPartMarker(nodes, partNumber) {
  const target = new RegExp("^제\\s*" + partNumber + "\\s*부\\s*표준\\s*발음법$");
  return nodes.filter((node) => /^h[1-6]$/.test(node.tag) && target.test(normalizeText(textContent(node))))
    .sort((a, b) => a.start - b.start)[0] ?? null;
}

export function validateArticleInventory(articles, expected = EXPECTED_ARTICLES) {
  const counts = new Map();
  for (const article of articles) counts.set(article.articleNumber, (counts.get(article.articleNumber) ?? 0) + 1);
  const duplicates = [...counts.entries()].filter((entry) => entry[1] > 1).map((entry) => entry[0]).sort((a, b) => a - b);
  const found = new Set(articles.map((article) => article.articleNumber));
  const missing = expected.filter((number) => !found.has(number));
  const unexpected = [...found].filter((number) => !expected.includes(number)).sort((a, b) => a - b);
  const incomplete = articles.filter((article) => !article.title || !article.sourceText || article.extractionStatus !== "parsed")
    .map((article) => article.articleNumber);
  const errors = [];
  if (missing.length) errors.push("missing official article(s): " + missing.join(", "));
  if (duplicates.length) errors.push("duplicate article heading(s): " + duplicates.join(", "));
  if (unexpected.length) errors.push("unexpected article number(s): " + unexpected.join(", "));
  if (incomplete.length) errors.push("empty or incomplete extraction for article(s): " + incomplete.join(", "));
  return { expectedCount: expected.length, extractedCount: articles.length, missing, duplicates, unexpected, incomplete, complete: errors.length === 0 && articles.length === expected.length, errors };
}

export function parseNiklStandardHtml(html, sourceUrl = DEFAULT_SOURCE_URL) {
  if (typeof html !== "string" || html.length === 0) throw new TypeError("HTML source must be a non-empty string");
  const tree = parseHtmlTree(html);
  const nodes = walk(tree);
  const partMarker = findPartMarker(nodes, 2);
  if (!partMarker) throw new Error("Could not locate semantic heading 제2부 표준 발음법; upstream structure may have changed.");
  const nextPart = nodes.filter((node) => /^h[1-6]$/.test(node.tag) && /^제\s*3\s*부(?:\s|$)/u.test(normalizeText(textContent(node))))
    .filter((node) => node.start > partMarker.start).sort((a, b) => a.start - b.start)[0] ?? null;
  const sectionStart = partMarker.end;
  const sectionEnd = nextPart?.start ?? html.length;
  const inSection = nodes.filter((node) => node.start >= sectionStart && node.start < sectionEnd);
  const rawCandidates = inSection.map((node) => ({ node, heading: articleHeading(node) })).filter((item) => item.heading);
  const candidates = rawCandidates.filter((item) => !rawCandidates.some((other) =>
    other.node !== item.node && other.heading.number === item.heading.number && isDescendant(item.node, other.node)))
    .sort((a, b) => a.node.start - b.node.start);
  // Nested duplicate title nodes were removed above. Do not collapse repeated
  // sibling headings: the inventory validator must report those as source defects.
  const deduped = candidates;
  const articles = deduped.map((item, index) => {
    const end = Math.min(deduped[index + 1]?.node.start ?? sectionEnd, sectionEnd);
    const sourceText = stripHtml(html.slice(item.node.start, end));
    const anchorId = item.node.attrs.id || null;
    const titleRemainder = item.heading.text.replace(/^제\s*\d+\s*항/u, "").trim();
    return {
      articleNumber: item.heading.number,
      articleId: "NIKL-SP-" + String(item.heading.number).padStart(2, "0"),
      title: item.heading.text,
      anchorId,
      sourceUrl: anchorId ? sourceUrl.split("#")[0] + "#" + encodeURIComponent(anchorId) : sourceUrl.split("#")[0],
      sourceText,
      textSha256: sha256(sourceText.normalize("NFC")),
      normalizedCharCount: [...sourceText].length,
      extractionStatus: sourceText.length > item.heading.text.length && titleRemainder ? "parsed" : "review-needed",
    };
  });
  return { sourceUrl, sectionTitle: normalizeText(textContent(partMarker)), articles, validation: validateArticleInventory(articles) };
}

export function robotsPathAllowed(robotsText, targetUrl, userAgent = USER_AGENT) {
  const groups = [];
  let group = { agents: [], rules: [] };
  for (const rawLine of robotsText.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const colon = line.indexOf(":");
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    if (key === "user-agent") {
      if (group.rules.length) { groups.push(group); group = { agents: [], rules: [] }; }
      group.agents.push(value.toLowerCase());
    } else if ((key === "allow" || key === "disallow") && group.agents.length && value) {
      group.rules.push({ type: key, path: value });
    }
  }
  if (group.agents.length) groups.push(group);
  const agentToken = userAgent.toLowerCase().split(/[\s/]/)[0];
  const rules = groups.filter((g) => g.agents.includes("*") || g.agents.some((agent) => agent !== "*" && agentToken.includes(agent)))
    .flatMap((g) => g.rules);
  const url = new URL(targetUrl);
  const targetPath = url.pathname + url.search;
  const matching = rules.map((rule) => ({ ...rule, prefix: rule.path.replace(/\*.*$/, "") }))
    .filter((rule) => targetPath.startsWith(rule.prefix))
    .sort((a, b) => b.prefix.length - a.prefix.length || (a.type === "allow" ? -1 : 1));
  return matching.length === 0 || matching[0].type === "allow";
}

export function assertAllowedSourceUrl(url) {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:") throw new Error("Only HTTPS official source URLs are allowed.");
  if (!["korean.go.kr", "www.korean.go.kr"].includes(parsed.hostname.toLowerCase())) throw new Error("Refusing non-official host: " + parsed.hostname);
  if (!parsed.pathname.startsWith("/kornorms/")) throw new Error("Only the official NIKL Korean language norms area is in scope.");
  return parsed;
}

export async function fetchOfficialSource(url = DEFAULT_SOURCE_URL, { fetchImpl = fetch } = {}) {
  const parsed = assertAllowedSourceUrl(url);
  const robotsUrl = new URL("/robots.txt", parsed.origin).toString();
  const robotsResponse = await fetchImpl(robotsUrl, {
    headers: { "user-agent": USER_AGENT, accept: "text/plain,*/*;q=0.1" },
    signal: AbortSignal.timeout(15000), redirect: "follow",
  });
  let robotsDecision;
  let robotsText = "";
  if (robotsResponse.status === 200) {
    robotsText = await robotsResponse.text();
    robotsDecision = robotsPathAllowed(robotsText, url) ? "allowed" : "disallowed";
    if (robotsDecision === "disallowed") throw sourceAccessBlocked("robots.txt disallows this path; stopping without bypass.");
  } else if (robotsResponse.status === 404 || robotsResponse.status === 410) {
    robotsDecision = "no_robots_file";
  } else if ([401, 403, 429, 451].includes(robotsResponse.status)) {
    throw sourceAccessBlocked("Cannot verify robots policy (HTTP " + robotsResponse.status + "); stopping rather than bypassing policy.");
  } else {
    throw sourceAccessBlocked("Cannot verify robots policy (HTTP " + robotsResponse.status + "); stopping rather than bypassing policy.");
  }
  const response = await fetchImpl(url, {
    headers: { "user-agent": USER_AGENT, accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1" },
    signal: AbortSignal.timeout(20000), redirect: "follow",
  });
  if ([401, 403, 429, 451].includes(response.status)) throw sourceAccessBlocked("Official source denied or rate-limited this request (HTTP " + response.status + "); do not bypass access controls.");
  if (!response.ok) throw new Error("Official source request failed with HTTP " + response.status);
  const finalUrl = response.url || url;
  assertAllowedSourceUrl(finalUrl);
  if (robotsText && !robotsPathAllowed(robotsText, finalUrl)) throw sourceAccessBlocked("Redirected final URL is disallowed by robots.txt; stopping without bypass.");
  const contentType = response.headers.get("content-type") ?? "";
  if (!/text\/html|application\/xhtml\+xml/i.test(contentType)) throw new Error("Expected HTML from official source, received content-type: " + (contentType || "missing"));
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > MAX_SOURCE_BYTES) throw new Error("Source response exceeds 10 MiB; refusing unexpectedly large response.");
  const html = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  return {
    html,
    metadata: {
      requestedUrl: url, finalUrl, retrievedAt: new Date().toISOString(),
      httpStatus: response.status, contentType, etag: response.headers.get("etag"),
      lastModified: response.headers.get("last-modified"), responseBytes: buffer.length,
      responseSha256: sha256(buffer), userAgent: USER_AGENT,
      robots: { url: robotsUrl, status: robotsResponse.status, decision: robotsDecision },
      termsReview: "not_assessed", retentionPolicy: "metadata-only; raw HTML is never written by this command",
    },
  };
}

export function buildManifest(parsed, sourceMetadata, { includeText = false } = {}) {
  return {
    schemaVersion: 1,
    collector: { name: "nikl-norm-crawler", version: "0.1.0" },
    standard: { id: "NIKL-SP", title: "국립국어원 표준 발음법", authority: "국립국어원", scope: "Articles 1–30 of 제2부 표준 발음법 only; adjacent parts are excluded.", canonicalUrl: "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002" },
    source: sourceMetadata,
    inventory: { ...parsed.validation, articleIds: parsed.articles.map((article) => article.articleId) },
    articles: parsed.articles.map((article) => ({
      articleNumber: article.articleNumber, articleId: article.articleId, title: article.title,
      anchorId: article.anchorId, sourceUrl: article.sourceUrl, textSha256: article.textSha256,
      normalizedCharCount: article.normalizedCharCount, extractionStatus: article.extractionStatus,
      ...(includeText ? { sourceText: article.sourceText } : {}),
    })),
  };
}

function parseArgs(argv) {
  const args = { url: DEFAULT_SOURCE_URL, output: "reports/nikl/standard-pronunciation-manifest.json", includeText: false, termsReviewed: false };
  for (let i = 0; i < argv.length; i++) {
    const value = argv[i];
    if (value === "--url") args.url = argv[++i];
    else if (value === "--output") args.output = argv[++i];
    else if (value === "--include-text") args.includeText = true;
    else if (value === "--terms-reviewed") args.termsReviewed = true;
    else if (value === "--help" || value === "-h") args.help = true;
    else throw new Error("Unknown argument: " + value);
  }
  if (args.includeText && !args.termsReviewed) throw new Error("--include-text requires --terms-reviewed after a human has reviewed applicable source reuse terms.");
  return args;
}

export function parseCrawlerArgs(argv) { return parseArgs(argv); }

export async function runCrawler(args = parseArgs(process.argv.slice(2))) {
  if (args.help) return { help: true, text: "Usage: node scripts/nikl-norm-crawler.mjs [--url OFFICIAL_URL] [--output PATH] [--include-text --terms-reviewed]\nDefault output stores article metadata and hashes only; raw HTML and article text are not retained." };
  const fetched = await fetchOfficialSource(args.url);
  const parsed = parseNiklStandardHtml(fetched.html, fetched.metadata.finalUrl);
  if (!parsed.validation.complete) throw new Error("Official article inventory did not reconcile: " + parsed.validation.errors.join("; "));
  const sourceMetadata = {
    ...fetched.metadata,
    termsReview: args.includeText ? "human_acknowledgement_received_not_independently_verified" : "not_assessed",
    retentionPolicy: args.includeText ? "article text retained locally after human terms acknowledgement; redistribution rights not independently verified" : "metadata-only; raw HTML is never written by this command",
  };
  const manifest = buildManifest(parsed, sourceMetadata, { includeText: args.includeText });
  const outputPath = resolve(args.output);
  await mkdir(dirname(outputPath), { recursive: true });
  const temporaryPath = outputPath + ".tmp-" + process.pid;
  try {
    await writeFile(temporaryPath, JSON.stringify(manifest, null, 2) + "\n", { encoding: "utf8", flag: "wx" });
    await rename(temporaryPath, outputPath);
  } catch (error) {
    const { unlink } = await import("node:fs/promises");
    await unlink(temporaryPath).catch(() => {});
    throw error;
  }
  return { outputPath, manifest };
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath && fileURLToPath(import.meta.url) === invokedPath) {
  try {
    const result = await runCrawler();
    if (result.help) console.log(result.text);
    else console.log(JSON.stringify({
      outputPath: result.outputPath, sourceUrl: result.manifest.source.finalUrl,
      fetchedArticles: result.manifest.inventory.extractedCount, expectedArticles: result.manifest.inventory.expectedCount,
      complete: result.manifest.inventory.complete, sourceSha256: result.manifest.source.responseSha256,
      robots: result.manifest.source.robots, termsReview: result.manifest.source.termsReview,
      retainedContent: result.manifest.source.retentionPolicy,
    }, null, 2));
  } catch (error) {
    if (error?.code === "SOURCE_ACCESS_BLOCKED") {
      console.error("NIKL crawl BLOCKED: " + (error instanceof Error ? error.message : String(error)));
      process.exitCode = 3;
    } else {
      console.error("NIKL crawl failed closed: " + (error instanceof Error ? error.message : String(error)));
      process.exitCode = 1;
    }
  }
}
