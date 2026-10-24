import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  DEFAULT_SOURCE_URL, EXPECTED_ARTICLES, assertAllowedSourceUrl, buildManifest,
  decodeHtmlEntities, fetchOfficialSource, parseCrawlerArgs, parseNiklStandardHtml, robotsPathAllowed, runCrawler, sha256,
} from "../scripts/nikl-norm-crawler.mjs";

function fixtureHtml(options = {}) {
  const omit = options.omit ?? [];
  const duplicate = options.duplicate ?? [];
  const badArticle = options.badArticle ?? null;
  const articles = EXPECTED_ARTICLES.filter((number) => !omit.includes(number)).flatMap((number) => {
    const heading = number === badArticle ? "제" + number + "항" : "제" + number + "항 표준 발음 규정 예시 " + number;
    const block = '<h4 id="article-' + number + '">' + heading + '</h4><p>규정 본문 ' + number + '의 예시: 넋이, 값이.</p><ul><li>예시 ' + number + '</li></ul>';
    return duplicate.includes(number) ? [block, block] : [block];
  }).join("\n");
  return '<!doctype html><html><body><h2>제1부 표준어 사정 원칙</h2><h4>제1항 다른 규정</h4>' +
    '<p>이 항목은 수집 대상이 아니다.</p><h2>제2부 표준 발음법</h2><h3>제1장 총칙</h3>' + articles +
    '<h2>제3부 외래어 표기법</h2><h4>제1항 제외되어야 하는 항목</h4><p>다른 규정.</p>' +
    '<script>if (a < b) { document.write("<h2>제3부 fake</h2>"); } 제99항 가짜 기사</script></body></html>';
}

test("extracts exactly the 30 articles from the Standard Pronunciation Rules section", () => {
  const parsed = parseNiklStandardHtml(fixtureHtml());
  assert.equal(parsed.sectionTitle, "제2부 표준 발음법");
  assert.equal(parsed.articles.length, 30);
  assert.deepEqual(parsed.articles.map((article) => article.articleNumber), EXPECTED_ARTICLES);
  assert.equal(parsed.validation.complete, true);
  assert.equal(parsed.articles[0].articleId, "NIKL-SP-01");
  assert.equal(parsed.articles[0].title, "제1항");
  assert.equal(parsed.articles[0].normativeCharCount, [..."표준 발음 규정 예시 1"].length);
  assert.equal(parsed.articles[0].normativeTextSha256, sha256("표준 발음 규정 예시 1".normalize("NFC")));
  assert.equal(parsed.articles[0].sourceUnitScope, "article-block-including-official-commentary-and-examples");
  assert.equal(parsed.articles[0].anchorId, "article-1");
  assert.match(parsed.articles[0].sourceText, /규정 본문 1의 예시/);
  assert.doesNotMatch(parsed.articles[0].sourceText, /제3부 외래어 표기법/);
});

test("fails closed if the official part heading disappears", () => {
  assert.throws(() => parseNiklStandardHtml("<h2>제1부 다른 규정</h2>"), /Could not locate/);
});

test("inventory validator detects missing, duplicated and incomplete article records", () => {
  const parsed = parseNiklStandardHtml(fixtureHtml({ omit: [7], duplicate: [8], badArticle: 9 }));
  assert.equal(parsed.validation.complete, false);
  assert.deepEqual(parsed.validation.missing, [7]);
  assert.deepEqual(parsed.validation.duplicates, [8]);
  assert.ok(parsed.validation.incomplete.includes(9));
});

test("normalizes HTML entities while preserving Korean text", () => {
  assert.equal(decodeHtmlEntities("값이 &amp; 넋이 &#91;값&#93; &#xD55C;"), "값이 & 넋이 [값] 한");
});

test("rejects non-HTTPS, non-official and out-of-scope URLs", () => {
  assert.throws(() => assertAllowedSourceUrl("http://korean.go.kr/kornorms/m/m_regltn.do?regltn_code=0002"), /HTTPS/);
  assert.throws(() => assertAllowedSourceUrl("https://example.com/kornorms/"), /non-official host/);
  assert.throws(() => assertAllowedSourceUrl("https://korean.go.kr/front/onlineQna/"), /Only the official NIKL/);
  assert.throws(() => assertAllowedSourceUrl("https://www.korean.go.kr/kornorms/main/main.do"), /Standard Pronunciation Rules endpoints/);
  assert.throws(() => assertAllowedSourceUrl("https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0001"), /regulation code 0002/);
  assert.throws(() => assertAllowedSourceUrl("https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002&regltn_code=0001"), /regulation code 0002/);
  assert.equal(new URL(assertAllowedSourceUrl(DEFAULT_SOURCE_URL)).hostname, "www.korean.go.kr");
  assert.equal(new URL(DEFAULT_SOURCE_URL).pathname, "/kornorms/regltn/regltnView.do");
  assert.equal(new URL(DEFAULT_SOURCE_URL).searchParams.get("regltn_code"), "0002");
  assert.equal(new URL(assertAllowedSourceUrl("https://www.korean.go.kr/kornorms/m/m_regltn.do?regltn_code=0002")).hostname, "www.korean.go.kr");
});

test("robots parser respects disallow and longest matching allow rule", () => {
  const robots = "User-agent: *\nDisallow: /kornorms/\nAllow: /kornorms/regltn/regltnView.do";
  assert.equal(robotsPathAllowed(robots, DEFAULT_SOURCE_URL), true);
  assert.equal(robotsPathAllowed("User-agent: *\nDisallow: /kornorms/", DEFAULT_SOURCE_URL), false);
  assert.equal(robotsPathAllowed("User-agent: *\nDisallow: /private/", DEFAULT_SOURCE_URL), true);
});

test("manifest is metadata-only unless explicit text retention is requested", () => {
  const parsed = parseNiklStandardHtml(fixtureHtml());
  const metadata = {
    requestedUrl: DEFAULT_SOURCE_URL, finalUrl: DEFAULT_SOURCE_URL, retrievedAt: "2026-10-21T00:00:00.000Z",
    httpStatus: 200, contentType: "text/html; charset=utf-8", etag: null, lastModified: null,
    responseBytes: 1234, responseSha256: sha256("fixture"), userAgent: "test",
    robots: { url: "https://www.korean.go.kr/robots.txt", status: 404, decision: "no_robots_file" },
    termsReview: "not_assessed", retentionPolicy: "metadata-only",
  };
  const manifest = buildManifest(parsed, metadata);
  assert.equal(manifest.inventory.complete, true);
  assert.equal(manifest.articles.length, 30);
  assert.equal("sourceText" in manifest.articles[0], false);
  const withText = buildManifest(parsed, metadata, { includeText: true });
  assert.match(withText.articles[0].sourceText, /규정 본문 1/);
});

test("article text retention requires explicit source-terms review acknowledgement", () => {
  assert.throws(() => parseCrawlerArgs(["--include-text"]), /requires --terms-reviewed/);
  assert.throws(() => parseCrawlerArgs(["--input-html"]), /--input-html requires a value/);
  assert.throws(() => parseCrawlerArgs(["--url"]), /--url requires a value/);
  assert.throws(() => parseCrawlerArgs(["--output"]), /--output requires a value/);
  assert.throws(() => parseCrawlerArgs(["--input-html", "saved.html"]), /requires an explicit --url/);
  assert.equal(parseCrawlerArgs(["--include-text", "--terms-reviewed"]).includeText, true);
  assert.equal(parseCrawlerArgs(["--output", "manifest.json"]).output, "manifest.json");
});

test("mocked fetch records provenance and does not require retaining source text", async () => {
  const requests = [];
  const fetchImpl = async (url) => {
    requests.push(String(url));
    if (String(url).endsWith("/robots.txt")) return new Response("", { status: 404 });
    return new Response(fixtureHtml(), { status: 200, headers: { "content-type": "text/html; charset=utf-8", etag: '"fixture-etag"' } });
  };
  const result = await fetchOfficialSource(DEFAULT_SOURCE_URL, { fetchImpl });
  assert.equal(result.metadata.httpStatus, 200);
  assert.equal(result.metadata.robots.decision, "no_robots_file");
  assert.equal(result.metadata.termsReview, "not_assessed");
  assert.equal(result.metadata.etag, '"fixture-etag"');
  assert.equal(result.metadata.responseSha256, sha256(Buffer.from(result.html)));
  assert.equal(requests.length, 2);
});

test("mocked fetch stops when robots.txt disallows the official rules path", async () => {
  const requests = [];
  const fetchImpl = async (url) => {
    requests.push(String(url));
    return new Response("User-agent: *\nDisallow: /kornorms/", { status: 200, headers: { "content-type": "text/plain" } });
  };
  await assert.rejects(fetchOfficialSource(DEFAULT_SOURCE_URL, { fetchImpl }), /robots.txt disallows/);
  assert.equal(requests.length, 1, "page request must not occur after a robots denial");
});

test("classifies HTTP 403 as an access block and does not retry or bypass", async () => {
  const requests = [];
  const fetchImpl = async (url) => {
    requests.push(String(url));
    if (String(url).endsWith("/robots.txt")) return new Response("", { status: 404 });
    return new Response("Forbidden", { status: 403, headers: { "content-type": "text/html" } });
  };
  await assert.rejects(
    fetchOfficialSource(DEFAULT_SOURCE_URL, { fetchImpl }),
    (error) => error.code === "SOURCE_ACCESS_BLOCKED" && /HTTP 403/.test(error.message),
  );
  assert.equal(requests.length, 2, "one robots request and one page request; no alternate-host retries");
});


test("local HTML import records its provenance without pretending an HTTP or robots check occurred", async () => {
  const directory = await mkdtemp(join(tmpdir(), "nikl-import-"));
  try {
    const inputPath = join(directory, "official-page.html");
    const outputPath = join(directory, "manifest.json");
    const html = fixtureHtml();
    await writeFile(inputPath, html, "utf8");
    await assert.rejects(
      runCrawler(parseCrawlerArgs(["--url", DEFAULT_SOURCE_URL, "--input-html", inputPath, "--output", inputPath])),
      /must not overwrite the --input-html source file/,
    );
    assert.equal(await readFile(inputPath, "utf8"), html, "refusing output collision must preserve the source file");
    const result = await runCrawler(parseCrawlerArgs([
      "--url", DEFAULT_SOURCE_URL, "--input-html", inputPath, "--output", outputPath,
    ]));
    assert.equal(result.manifest.inventory.complete, true);
    assert.equal(result.manifest.source.retrievalMode, "local-html-import");
    assert.equal(result.manifest.source.retrievedAt, null);
    assert.equal(result.manifest.source.importedAt.length > 0, true);
    assert.equal(result.manifest.source.httpStatus, null);
    assert.equal(result.manifest.source.userAgent, null);
    assert.equal(result.manifest.source.robots.decision, "not_checked_local_import");
    assert.equal(result.manifest.source.responseSha256, sha256(Buffer.from(html)));
    assert.equal("sourceText" in result.manifest.articles[0], false);
    assert.deepEqual(JSON.parse(await readFile(outputPath, "utf8")), result.manifest);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});


test("all NIKL repository skills point to the canonical desktop rules page", async () => {
  const canonical = "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002";
  const skillPaths = [
    "../.agents/skills/nikl-norm-crawler/SKILL.md",
    "../.agents/skills/nikl-rule-coverage/SKILL.md",
    "../.agents/skills/nikl-evidence-audit/SKILL.md",
  ];
  for (const path of skillPaths) {
    const content = await readFile(new URL(path, import.meta.url), "utf8");
    assert.ok(content.includes(canonical), path + ": missing canonical official source URL");
    assert.ok(!content.includes("/kornorms/m/m_regltn.do"), path + ": stale mobile source URL remains");
  }
});


test("robots parser gives a matching product token precedence over wildcard groups", () => {
  const robots = [
    "User-agent: *",
    "Disallow: /kornorms/",
    "User-agent: ClippyFirst-NIKLResearchBot",
    "Allow: /kornorms/regltn/",
  ].join("\n");
  assert.equal(robotsPathAllowed(robots, "https://www.korean.go.kr/kornorms/main/main.do", "OtherBot/1.0"), false, "wildcard group applies when no specific product-token group matches");
  assert.equal(robotsPathAllowed(robots, DEFAULT_SOURCE_URL), true, "the matching specific product-token group takes precedence over wildcard disallow");
});

test("robots parser handles wildcard segments and terminal dollar anchors", () => {
  const robots = [
    "User-agent: *",
    "Disallow: /kornorms/private/*/secret$",
  ].join("\n");
  assert.equal(robotsPathAllowed(robots, "https://www.korean.go.kr/kornorms/private/a/secret"), false);
  assert.equal(robotsPathAllowed(robots, "https://www.korean.go.kr/kornorms/private/a/secret/more"), true);
  assert.equal(robotsPathAllowed(robots, "https://www.korean.go.kr/kornorms/private/secret"), true);
});


test("robots parser prefers Allow when allow and disallow rules have equal specificity", () => {
  const robots = [
    "User-agent: *",
    "Disallow: /same/path",
    "Allow: /same/path",
  ].join("\n");
  assert.equal(robotsPathAllowed(robots, "https://www.korean.go.kr/same/path"), true);
});


test("repository-held NIKL HTML matches its complete metadata-only inventory manifest", async () => {
  const sourceBuffer = await readFile(new URL("../한국어 어문 규범.htm", import.meta.url));
  const html = sourceBuffer.toString("utf8");
  const manifest = JSON.parse(await readFile(
    new URL("../reports/nikl/standard-pronunciation-manifest.json", import.meta.url), "utf8",
  ));
  const parsed = parseNiklStandardHtml(html, DEFAULT_SOURCE_URL);

  assert.equal(sha256(sourceBuffer), manifest.source.responseSha256);
  assert.equal(sourceBuffer.length, manifest.source.responseBytes);
  assert.equal(parsed.validation.complete, true);
  assert.deepEqual(parsed.validation.missing, []);
  assert.deepEqual(parsed.validation.duplicates, []);
  assert.deepEqual(parsed.validation.unexpected, []);
  assert.deepEqual(parsed.validation.incomplete, []);
  assert.equal(manifest.inventory.expectedCount, 30);
  assert.equal(manifest.inventory.extractedCount, 30);
  assert.equal(manifest.inventory.complete, true);
  assert.equal(manifest.articles.length, 30);
  assert.deepEqual(parsed.articles.map(article => article.articleNumber),
    Array.from({ length: 30 }, (_, index) => index + 1));
  assert.deepEqual(parsed.articles.map(article => ({
    articleNumber: article.articleNumber,
    title: article.title,
    normativeTextSha256: article.normativeTextSha256,
    normativeCharCount: article.normativeCharCount,
    sourceUnitScope: article.sourceUnitScope,
    anchorId: article.anchorId,
    normalizedCharCount: article.normalizedCharCount,
    extractionStatus: article.extractionStatus,
    textSha256: article.textSha256,
  })), manifest.articles.map(article => ({
    articleNumber: article.articleNumber,
    title: article.title,
    normativeTextSha256: article.normativeTextSha256,
    normativeCharCount: article.normativeCharCount,
    sourceUnitScope: article.sourceUnitScope,
    anchorId: article.anchorId,
    normalizedCharCount: article.normalizedCharCount,
    extractionStatus: article.extractionStatus,
    textSha256: article.textSha256,
  })));

  assert.equal(manifest.source.retrievalMode, "local-html-import");
  assert.equal(manifest.source.httpStatus, null);
  assert.equal(manifest.source.retrievedAt, null);
  assert.equal(manifest.source.robots.decision, "not_checked_local_import");
  assert.equal(manifest.source.termsReview, "not_assessed");
  assert.ok(manifest.articles.every(article => !("sourceText" in article)));
  assert.ok(manifest.articles.every(article => article.title === "제" + article.articleNumber + "항"));
  assert.ok(manifest.articles.every(article => article.normativeCharCount > 0));
  assert.ok(manifest.articles.every(article => /^[a-f0-9]{64}$/.test(article.normativeTextSha256)));
  assert.ok(manifest.articles.every(article => article.sourceUnitScope === "article-block-including-official-commentary-and-examples"));
});
