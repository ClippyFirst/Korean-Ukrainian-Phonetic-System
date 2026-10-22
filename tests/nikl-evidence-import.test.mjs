import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { buildEvidenceImport, extractPageMetadata } from "../scripts/nikl-evidence-import.mjs";

const QNA = "https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=317202";
const FAQ = "https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5949&mn_id=217";

function html(title, heading, body = "Official Korean language institute page content. ".repeat(8)) {
  return `<!doctype html><html><head><title>${title}</title><script>fake private script text</script></head><body><h1>${heading}</h1><main><p>${body}</p></main></body></html>`;
}

async function fixture(t) {
  const dir = await mkdtemp(join(tmpdir(), "nikl-evidence-import-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  return dir;
}

test("extracts only page metadata and normalized hashes, not source text", () => {
  const result = extractPageMetadata(html("Official Q&A", "표준 발음 문의"));
  assert.equal(result.documentTitle, "Official Q&A");
  assert.deepEqual(result.headings, ["표준 발음 문의"]);
  assert.equal(result.normalizedTextSha256.length, 64);
  assert.ok(result.normalizedTextCharCount > 80);
  assert.ok(!JSON.stringify(result).includes("fake private script text"));
  assert.ok(!JSON.stringify(result).includes("Official Korean language institute page content"));
});

test("imports multiple saved official pages with explicit local-only provenance", async t => {
  const dir = await fixture(t);
  await writeFile(join(dir, "qna.html"), html("NIKL Q&A", "질문 답변"), "utf8");
  await writeFile(join(dir, "faq.html"), html("NIKL FAQ", "자주 묻는 질문"), "utf8");
  const input = join(dir, "saved-pages.json");
  const output = join(dir, "manifest.json");
  await writeFile(input, JSON.stringify({ sources: [
    { sourceId: "SRC-NIKL-QNA-317202", url: QNA, inputHtml: "qna.html" },
    { sourceId: "SRC-NIKL-FAQ-5949", url: FAQ, inputHtml: "faq.html" },
  ] }), "utf8");
  const manifest = await buildEvidenceImport(input, output, { now: () => "2026-10-22T12:00:00.000Z" });
  assert.equal(manifest.sourceCount, 2);
  assert.equal(manifest.allSourcesContentReviewed, false);
  assert.equal(manifest.sources[0].sourceId, "SRC-NIKL-QNA-317202");
  assert.equal(manifest.sources[0].retrievalMode, "local-html-import");
  assert.equal(manifest.sources[0].httpFetchedAt, null);
  assert.equal(manifest.sources[0].httpStatus, null);
  assert.equal(manifest.sources[0].robotsStatus, "not_checked_local_import");
  assert.equal(manifest.sources[0].reuseTermsStatus, "not_assessed");
  assert.equal(manifest.sources[0].reviewStatus, "NOT_REVIEWED_CONTENT_HASH_ONLY");
  assert.equal(manifest.sources[0].claimSupportEstablished, false);
  assert.equal(manifest.sources[0].contentRetained, false);
  assert.equal(manifest.sources[0].htmlSha256.length, 64);
  assert.equal("visibleText" in manifest.sources[0], false);
  assert.equal("body" in manifest.sources[0], false);
  assert.deepEqual(JSON.parse(await readFile(output, "utf8")), manifest);
  assert.ok(!JSON.stringify(manifest).includes("Official Korean language institute page content"));
});

test("rejects non-official hosts, unsupported paths, and missing exact page identifiers", async t => {
  const dir = await fixture(t);
  await writeFile(join(dir, "page.html"), html("NIKL", "제목"), "utf8");
  const input = join(dir, "saved-pages.json");
  const output = join(dir, "manifest.json");
  for (const url of [
    "https://example.org/front/onlineQna/onlineQnaView.do?qna_seq=1",
    "https://www.korean.go.kr/admin/anything.do?qna_seq=1",
    "https://www.korean.go.kr/front/onlineQna/onlineQnaView.do",
    "https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?qna_seq=0",
    "https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?qna_seq=317202&unexpected=1",
    "http://www.korean.go.kr/front/onlineQna/onlineQnaView.do?qna_seq=1",
  ]) {
    await writeFile(input, JSON.stringify({ sources: [{ sourceId: "SRC-NIKL-QNA-1", url, inputHtml: "page.html" }] }), "utf8");
    await assert.rejects(buildEvidenceImport(input, output), /official|HTTPS|allowlist|identifier/u, url);
  }
});

test("rejects duplicate source IDs and duplicate canonical URLs", async t => {
  const dir = await fixture(t);
  await writeFile(join(dir, "page.html"), html("NIKL", "제목"), "utf8");
  const input = join(dir, "saved-pages.json");
  const output = join(dir, "manifest.json");
  await writeFile(input, JSON.stringify({ sources: [
    { sourceId: "SRC-NIKL-QNA-317202", url: QNA, inputHtml: "page.html" },
    { sourceId: "SRC-NIKL-QNA-317202", url: FAQ, inputHtml: "page.html" },
  ] }), "utf8");
  await assert.rejects(buildEvidenceImport(input, output), /Duplicate sourceId/u);
  await writeFile(input, JSON.stringify({ sources: [
    { sourceId: "SRC-NIKL-QNA-ALIAS-1", url: QNA, inputHtml: "page.html" },
    { sourceId: "SRC-NIKL-QNA-ALIAS-2", url: "https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?qna_seq=317202&pageIndex=1&mn_id=216", inputHtml: "page.html" },
  ] }), "utf8");
  await assert.rejects(buildEvidenceImport(input, output), /Duplicate canonical source URL/u);
  await writeFile(input, JSON.stringify({ sources: [
    { sourceId: "SRC-NIKL-QNA-999999", url: QNA, inputHtml: "page.html" },
  ] }), "utf8");
  await assert.rejects(buildEvidenceImport(input, output), /source ID does not match qna_seq/u);
});

test("fails closed on missing files, tiny error pages, and malformed source manifests", async t => {
  const dir = await fixture(t);
  const input = join(dir, "saved-pages.json");
  const output = join(dir, "manifest.json");
  await writeFile(input, JSON.stringify({ sources: [{ sourceId: "SRC-NIKL-QNA-317202", url: QNA, inputHtml: "missing.html" }] }), "utf8");
  await assert.rejects(buildEvidenceImport(input, output));
  await writeFile(join(dir, "tiny.html"), "<html><body>Forbidden</body></html>", "utf8");
  await writeFile(input, JSON.stringify({ sources: [{ sourceId: "SRC-NIKL-QNA-317202", url: QNA, inputHtml: "tiny.html" }] }), "utf8");
  await assert.rejects(buildEvidenceImport(input, output), /too little visible text/u);
  const challenge = "<html><head><title>Access Denied</title></head><body><h1>Access Denied</h1><p>" + "This request has been blocked by the security service. ".repeat(8) + "</p></body></html>";
  await writeFile(join(dir, "challenge.html"), challenge, "utf8");
  await writeFile(input, JSON.stringify({ sources: [{ sourceId: "SRC-NIKL-QNA-317202", url: QNA, inputHtml: "challenge.html" }] }), "utf8");
  await assert.rejects(buildEvidenceImport(input, output), /appears to be an access-denial/u);
  await writeFile(input, "{not-json", "utf8");
  await assert.rejects(buildEvidenceImport(input, output));
  await writeFile(input, JSON.stringify({ sources: [] }), "utf8");
  await assert.rejects(buildEvidenceImport(input, output), /1–250 sources/u);
});

test("refuses to overwrite either the input manifest or an imported HTML file", async t => {
  const dir = await fixture(t);
  const htmlPath = join(dir, "page.html");
  const input = join(dir, "saved-pages.json");
  await writeFile(htmlPath, html("NIKL", "제목"), "utf8");
  await writeFile(input, JSON.stringify({ sources: [{ sourceId: "SRC-NIKL-QNA-317202", url: QNA, inputHtml: "page.html" }] }), "utf8");
  const originalHtml = await readFile(htmlPath, "utf8");
  await assert.rejects(buildEvidenceImport(input, input), /must not overwrite the source manifest/u);
  await assert.rejects(buildEvidenceImport(input, htmlPath), /must not overwrite an imported HTML file/u);
  assert.equal(await readFile(htmlPath, "utf8"), originalHtml);
  assert.ok((await readFile(input, "utf8")).includes("SRC-NIKL-QNA-317202"));
});
