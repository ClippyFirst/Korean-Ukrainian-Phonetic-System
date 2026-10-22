import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { buildEvidenceImport, extractPageMetadata } from "../scripts/nikl-evidence-import.mjs";
import { buildImportTemplate } from "../scripts/nikl-evidence-template.mjs";

const QNA = "https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=317202";
const FAQ = "https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5949&mn_id=217";
const FAQ_PAGINATED = "https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=6718&mn_id=57&pageIndex=1";
const MOBILE_QNA = "https://m.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=317229";
const DICT_ENG = "https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=79033";
const DICT_ENG_NATION = "https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=89917&nation=eng";
const DICT_KOR = "https://krdict.korean.go.kr/kor/dicSearch/SearchView?ParaWordNo=57199";

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


test("accepts exact official mobile-host citations and FAQ pagination parameters", async t => {
  const dir = await fixture(t);
  await writeFile(join(dir, "mobile.html"), html("NIKL Q&A", "외곬에 발음"), "utf8");
  await writeFile(join(dir, "faq.html"), html("NIKL FAQ", "자주 묻는 질문"), "utf8");
  const input = join(dir, "saved-pages.json");
  const output = join(dir, "manifest.json");
  await writeFile(input, JSON.stringify({ sources: [
    { sourceId: "SRC-NIKL-QNA-317229", url: MOBILE_QNA, inputHtml: "mobile.html" },
    { sourceId: "SRC-NIKL-MCFAQ-6718", url: FAQ_PAGINATED, inputHtml: "faq.html" },
  ] }), "utf8");
  const manifest = await buildEvidenceImport(input, output);
  assert.equal(manifest.sourceCount, 2);
  assert.equal(manifest.sources[0].sourceUrl, MOBILE_QNA);
  assert.equal(manifest.sources[1].sourceUrl, FAQ_PAGINATED);
});


test("builds a template from unreviewed official NIKL HTML rows and preserves multiline CSV fields", () => {
  const csv = [
    "source_id,url,review_status,coverage",
    '"SRC-NIKL-QNA-317229","https://m.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=317229","unverified_lexical_citation_inventory_2026-10-22","lexical inputs: 외곬에,',
    'second line"',
    '"SRC-NIKL-MCFAQ-6718","https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=6718&mn_id=57&pageIndex=1","unverified_lexical_citation_inventory_2026-10-22","FAQ"',
    '"SRC-NIKL-QNA-123","https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?qna_seq=123","reviewed","already reviewed"',
    '"SRC-KRDICT-ENG-79033","https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=79033","unverified_lexical_citation_inventory_2026-10-22","different host"',
  ].join("\n");
  const template = buildImportTemplate(csv, { relativeHtmlDirectory: "saved-pages" });
  assert.equal(template.sourceCount, 3);
  assert.equal(template.allSourcesContentReviewed, false);
  assert.deepEqual(template.sources.map(source => source.sourceId), ["SRC-NIKL-QNA-317229", "SRC-NIKL-MCFAQ-6718", "SRC-KRDICT-ENG-79033"]);
  assert.equal(template.sources[0].inputHtml, "saved-pages/SRC-NIKL-QNA-317229.html");
  assert.equal(template.sources[1].url, FAQ_PAGINATED);
  assert.equal(JSON.stringify(template).includes("second line"), false);
});

test("rejects unsafe HTML directories, malformed CSV, and duplicate source records", () => {
  const csv = [
    "source_id,url,review_status",
    "SRC-NIKL-QNA-317202,https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?qna_seq=317202,unverified_lexical_citation_inventory_2026-10-22",
  ].join("\n");
  assert.throws(() => buildImportTemplate(csv, { relativeHtmlDirectory: "../outside" }), /safe relative path/u);
  assert.throws(() => buildImportTemplate(csv, { relativeHtmlDirectory: "C:\\\\temp" }), /safe relative path/u);
  assert.throws(() => buildImportTemplate(["source_id,url,review_status", '"SRC-NIKL-QNA-1,https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?qna_seq=1,unverified'].join("\n")), /unterminated quoted field/u);
  const duplicate = csv + "\n" + csv.split("\n")[1];
  assert.throws(() => buildImportTemplate(duplicate), /Duplicate source ID/u);
});


test("repository source register produces a deterministic template for eligible unreviewed NIKL Q&A/FAQ citations", async () => {
  const sourceRegister = await readFile(new URL("../research/SOURCE-REGISTER.csv", import.meta.url), "utf8");
  const template = buildImportTemplate(sourceRegister);
  assert.equal(template.sourceCount, 22);
  assert.equal(template.allSourcesContentReviewed, false);
  assert.ok(!template.sources.some(source => source.sourceId === "SRC-NIKL-MCFAQ-6674"), "reviewed FAQ must not be re-queued");
  assert.ok(!template.sources.some(source => source.sourceId === "SRC-NIKL-QNA-317229"), "reviewed Q&A must not be re-queued");
  assert.ok(!template.sources.some(source => source.sourceId === "SRC-NIKL-MCFAQ-8420"), "reviewed FAQ must not be re-queued");
  assert.ok(!template.sources.some(source => source.sourceId === "SRC-NIKL-QNA-313452"), "reviewed Q&A must not be re-queued");
  assert.ok(!template.sources.some(source => source.sourceId === "SRC-NIKL-MCFAQ-8505"), "superseded unverified FAQ locator must not be re-queued");
  assert.ok(template.sources.every(source => /^(?:SRC-NIKL-(?:QNA|MCFAQ|FAQ)-\d+|SRC-KRDICT-(?:ENG|KOR)-\d+)$/u.test(source.sourceId)));
  assert.ok(template.sources.every(source => source.inputHtml.startsWith("saved-pages/")));
  assert.ok(template.sources.some(source => source.sourceId === "SRC-KRDICT-ENG-89917"));
  assert.ok(!template.sources.some(source => source.sourceId === "SRC-NIKL-QNA-279931"), "reviewed Q&A should not be re-queued");
  assert.ok(!template.sources.some(source => source.sourceId === "SRC-NIKL-QNA-317202"), "reviewed Q&A should not be re-queued");
  assert.ok(!template.sources.some(source => source.sourceId === "SRC-KRDICT-ENG-79033"), "reviewed source must not be re-queued");
});


test("imports official Korean Basic Dictionary pages with exact language and entry-ID provenance", async t => {
  const dir = await fixture(t);
  await writeFile(join(dir, "eng.html"), html("Korean Basic Dictionary", "좋아도"), "utf8");
  await writeFile(join(dir, "eng-nation.html"), html("Korean Basic Dictionary", "없었다"), "utf8");
  await writeFile(join(dir, "kor.html"), html("한국어기초사전", "발음과"), "utf8");
  const input = join(dir, "saved-pages.json");
  const output = join(dir, "manifest.json");
  await writeFile(input, JSON.stringify({ sources: [
    { sourceId: "SRC-KRDICT-ENG-79033", url: DICT_ENG, inputHtml: "eng.html" },
    { sourceId: "SRC-KRDICT-ENG-89917", url: DICT_ENG_NATION, inputHtml: "eng-nation.html" },
    { sourceId: "SRC-KRDICT-KOR-57199", url: DICT_KOR, inputHtml: "kor.html" },
  ] }), "utf8");
  const manifest = await buildEvidenceImport(input, output);
  assert.equal(manifest.sourceCount, 3);
  assert.deepEqual(manifest.sources.map(source => source.sourceId), [
    "SRC-KRDICT-ENG-79033", "SRC-KRDICT-ENG-89917", "SRC-KRDICT-KOR-57199",
  ]);
  assert.equal(manifest.sources.every(source => source.reviewStatus === "NOT_REVIEWED_CONTENT_HASH_ONLY"), true);
  assert.equal(manifest.sources.every(source => source.claimSupportEstablished === false), true);
});

test("rejects dictionary ID mismatches, language mismatches, and invalid nation values", async t => {
  const dir = await fixture(t);
  await writeFile(join(dir, "page.html"), html("Dictionary", "표제어"), "utf8");
  const input = join(dir, "saved-pages.json");
  const output = join(dir, "manifest.json");
  for (const source of [
    { sourceId: "SRC-KRDICT-ENG-89917", url: DICT_ENG, inputHtml: "page.html" },
    { sourceId: "SRC-KRDICT-KOR-79033", url: DICT_ENG, inputHtml: "page.html" },
    { sourceId: "SRC-KRDICT-KOR-57199", url: DICT_KOR + "&nation=eng", inputHtml: "page.html" },
    { sourceId: "SRC-KRDICT-ENG-79033", url: DICT_ENG + "&nation=kor", inputHtml: "page.html" },
  ]) {
    await writeFile(input, JSON.stringify({ sources: [source] }), "utf8");
    await assert.rejects(buildEvidenceImport(input, output), /source ID|nation parameter/u);
  }
});
