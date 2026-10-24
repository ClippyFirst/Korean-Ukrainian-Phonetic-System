import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const html = readFileSync(new URL('../../한국어 어문 규범.htm', import.meta.url), 'utf8');
const fixture = JSON.parse(readFileSync(new URL('./nikl-article-review-1-30.json', import.meta.url), 'utf8'));

function textOnly(value) {
  return value
    .replace(/<script[\\s\\S]*?<\\/script>/giu, ' ')
    .replace(/<style[\\s\\S]*?<\\/style>/giu, ' ')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/&nbsp;|&#160;/giu, ' ')
    .replace(/&lt;/giu, '<')
    .replace(/&gt;/giu, '>')
    .replace(/&amp;/giu, '&')
    .replace(/&#39;|&apos;/giu, "'")
    .replace(/&quot;/giu, '"')
    .replace(/\\s+/gu, ' ')
    .trim();
}

test('official saved HTML has a complete, ordered review record for Standard Pronunciation Rules §§1–30', () => {
  assert.equal(fixture.articles.length, 30);
  assert.deepEqual(fixture.articles.map((item) => item.article), Array.from({ length: 30 }, (_, i) => i + 1));
  assert.equal(fixture.source.repository_path, '한국어 어문 규범.htm');
  assert.match(fixture.source.url, /^https:\\/\\/www\\.korean\\.go\\.kr\\//u);
  assert.equal(fixture.boundary_contract.ipa.includes('not text promulgated'), true);
  assert.equal(fixture.boundary_contract.ukrainian.includes('not an official'), true);
});

test('normative article text is captured separately from the explanatory 해설 paragraph', () => {
  const section = html.slice(html.indexOf('id="a346"'));
  const headings = [...section.matchAll(/<h6\\b[^>]*>([\\s\\S]*?)<\\/h6>/giu)];
  const actual = headings.map((match, index) => {
    const headingText = textOnly(match[1]);
    const number = headingText.match(/제\\s*(\\d+)\\s*항/u);
    if (!number) return null;
    const article = Number(number[1]);
    if (article < 1 || article > 30) return null;
    const nextHeading = headings[index + 1];
    const after = section.slice(match.index + match[0].length, nextHeading?.index ?? section.length);
    const explanation = after.match(/<div class="exp_tit">\\s*해설\\s*<\\/div>([\\s\\S]*?)(?=<div class="exp_tit">|<h6\\b|$)/iu);
    const paragraph = explanation?.[1].match(/<p\\b[^>]*>([\\s\\S]*?)<\\/p>/iu)?.[1];
    return {
      article,
      source_anchor: (match[0].match(/id="([^"]+)"/u) ?? [])[1] ?? null,
      normative_text: headingText.replace(/^제\\s*\\d+\\s*항\\s*/u, ''),
      explanation_first_paragraph: paragraph ? textOnly(paragraph) : null
    };
  }).filter(Boolean);
  assert.equal(actual.length, 30);
  for (const record of actual) {
    const expected = fixture.articles[record.article - 1];
    assert.equal(record.source_anchor, expected.source_anchor, 'anchor §' + record.article);
    assert.equal(record.normative_text, expected.normative_text, 'normative text §' + record.article);
    assert.equal(record.explanation_first_paragraph, expected.explanation_first_paragraph, 'explanation boundary §' + record.article);
    assert.equal(expected.explanation_is_normative, false, 'explanation must remain non-normative §' + record.article);
  }
});

test('review records do not misrepresent NIKL as an IPA or Ukrainian transcription authority', () => {
  for (const item of fixture.articles) {
    assert.equal(item.review_status, 'reviewed_against_saved_official_html', '§' + item.article);
    assert.equal(item.explanation_is_normative, false, '§' + item.article);
    assert.match(item.review_note, /must not be treated as a normative rule/u);
  }
});
