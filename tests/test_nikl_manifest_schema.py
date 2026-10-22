import json
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).parents[1]


def _valid_manifest():
    url = "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
    article_ids = [f"NIKL-SP-{number:02d}" for number in range(1, 31)]
    redirected_url = url
    articles = [
        {
            "articleNumber": number,
            "articleId": article_ids[number - 1],
            "title": f"제{number}항 표준 발음법 fixture",
            "anchorId": None,
            "sourceUrl": redirected_url,
            "textSha256": "a" * 64,
            "normalizedCharCount": 20,
            "extractionStatus": "parsed",
        }
        for number in range(1, 31)
    ]
    return {
        "schemaVersion": 1,
        "collector": {"name": "nikl-norm-crawler", "version": "0.1.0"},
        "standard": {
            "id": "NIKL-SP",
            "title": "국립국어원 표준 발음법",
            "authority": "국립국어원",
            "scope": "Articles 1–30 of 제2부 표준 발음법 only.",
            "canonicalUrl": url,
        },
        "source": {
            "retrievalMode": "direct-http",
            "requestedUrl": url,
            "finalUrl": redirected_url,
            "retrievedAt": "2026-10-21T19:00:00.000Z",
            "importedAt": None,
            "httpStatus": 200,
            "contentType": "text/html; charset=utf-8",
            "etag": None,
            "lastModified": None,
            "responseBytes": 1024,
            "responseSha256": "b" * 64,
            "userAgent": "ClippyFirst-NIKLResearchBot/0.1",
            "robots": {"url": "https://www.korean.go.kr/robots.txt", "status": 404, "decision": "no_robots_file"},
            "termsReview": "not_assessed",
            "retentionPolicy": "metadata-only; raw HTML is never written by this command",
        },
        "inventory": {
            "expectedCount": 30,
            "extractedCount": 30,
            "missing": [],
            "duplicates": [],
            "unexpected": [],
            "incomplete": [],
            "complete": True,
            "errors": [],
            "articleIds": article_ids,
        },
        "articles": articles,
    }


def test_nikl_manifest_schema_accepts_a_complete_metadata_only_manifest():
    schema = json.loads((ROOT / "schemas" / "nikl-source-manifest.schema.json").read_text(encoding="utf-8"))
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    errors = list(validator.iter_errors(_valid_manifest()))
    assert not errors, "\n".join(error.message for error in errors)


def test_nikl_manifest_schema_rejects_incomplete_inventory_and_unreviewed_text_retention():
    schema = json.loads((ROOT / "schemas" / "nikl-source-manifest.schema.json").read_text(encoding="utf-8"))
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    manifest = _valid_manifest()
    manifest["inventory"]["missing"] = [12]
    assert list(validator.iter_errors(manifest))

    manifest = _valid_manifest()
    manifest["source"]["termsReview"] = "redistribution_permitted"
    assert list(validator.iter_errors(manifest))



def test_nikl_manifest_schema_accepts_local_html_import_with_explicitly_unknown_http_provenance():
    schema = json.loads((ROOT / "schemas" / "nikl-source-manifest.schema.json").read_text(encoding="utf-8"))
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    manifest = _valid_manifest()
    source = manifest["source"]
    source.update(
        {
            "retrievalMode": "local-html-import",
            "retrievedAt": None,
            "importedAt": "2026-10-21T19:30:00.000Z",
            "httpStatus": None,
            "contentType": "text/html; local-file",
            "userAgent": None,
            "robots": {
                "url": "https://www.korean.go.kr/robots.txt",
                "status": None,
                "decision": "not_checked_local_import",
            },
        }
    )
    errors = list(validator.iter_errors(manifest))
    assert not errors, "\\n".join(error.message for error in errors)


def test_nikl_manifest_schema_rejects_contradictory_retrieval_provenance():
    schema = json.loads((ROOT / "schemas" / "nikl-source-manifest.schema.json").read_text(encoding="utf-8"))
    validator = Draft202012Validator(schema, format_checker=FormatChecker())

    direct_http_but_no_retrieval_timestamp = _valid_manifest()
    direct_http_but_no_retrieval_timestamp["source"]["retrievedAt"] = None
    assert list(validator.iter_errors(direct_http_but_no_retrieval_timestamp))

    direct_http_but_local_robots_state = _valid_manifest()
    direct_http_but_local_robots_state["source"]["robots"] = {
        "url": "https://www.korean.go.kr/robots.txt",
        "status": None,
        "decision": "not_checked_local_import",
    }
    assert list(validator.iter_errors(direct_http_but_local_robots_state))

    local_import_claiming_live_fetch = _valid_manifest()
    source = local_import_claiming_live_fetch["source"]
    source.update(
        {
            "retrievalMode": "local-html-import",
            "retrievedAt": None,
            "importedAt": "2026-10-21T19:30:00.000Z",
            "httpStatus": 200,
            "contentType": "text/html; local-file",
            "userAgent": None,
            "robots": {
                "url": "https://www.korean.go.kr/robots.txt",
                "status": None,
                "decision": "not_checked_local_import",
            },
        }
    )
    assert list(validator.iter_errors(local_import_claiming_live_fetch))

    local_import_with_unchecked_robots_misreported = _valid_manifest()
    source = local_import_with_unchecked_robots_misreported["source"]
    source.update(
        {
            "retrievalMode": "local-html-import",
            "retrievedAt": None,
            "importedAt": "2026-10-21T19:30:00.000Z",
            "httpStatus": None,
            "contentType": "text/html; local-file",
            "userAgent": None,
            "robots": {
                "url": "https://www.korean.go.kr/robots.txt",
                "status": 404,
                "decision": "no_robots_file",
            },
        }
    )
    assert list(validator.iter_errors(local_import_with_unchecked_robots_misreported))


def test_nikl_manifest_schema_accepts_valid_html_media_types_and_rejects_near_misses():
    schema = json.loads((ROOT / "schemas" / "nikl-source-manifest.schema.json").read_text(encoding="utf-8"))
    validator = Draft202012Validator(schema, format_checker=FormatChecker())

    xhtml = _valid_manifest()
    xhtml["source"]["contentType"] = "application/xhtml+xml; charset=utf-8"
    assert not list(validator.iter_errors(xhtml))

    local_html = _valid_manifest()
    source = local_html["source"]
    source.update(
        {
            "retrievalMode": "local-html-import",
            "retrievedAt": None,
            "importedAt": "2026-10-21T19:30:00.000Z",
            "httpStatus": None,
            "contentType": "text/html; local-file",
            "userAgent": None,
            "robots": {
                "url": "https://www.korean.go.kr/robots.txt",
                "status": None,
                "decision": "not_checked_local_import",
            },
        }
    )
    assert not list(validator.iter_errors(local_html))

    invalid = _valid_manifest()
    invalid["source"]["contentType"] = "application/xhtmlXxml"
    assert list(validator.iter_errors(invalid))
