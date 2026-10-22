import json
from pathlib import Path

import pytest
from jsonschema import Draft202012Validator, FormatChecker


ROOT = Path(__file__).resolve().parents[1]
SCHEMA_PATH = ROOT / "schemas" / "nikl-evidence-import-manifest.schema.json"


def valid_manifest():
    return {
        "schemaVersion": 1,
        "generatedAt": "2026-10-22T12:00:00.000Z",
        "generatedBy": "scripts/nikl-evidence-import.mjs",
        "retentionPolicy": "metadata-and-hashes-only; source HTML and extracted page text are not copied to this manifest",
        "sourceCount": 1,
        "allSourcesContentReviewed": False,
        "sources": [
            {
                "sourceId": "SRC-NIKL-QNA-317202",
                "sourceUrl": "https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=216&pageIndex=1&qna_seq=317202",
                "retrievalMode": "local-html-import",
                "importedAt": "2026-10-22T12:00:00.000Z",
                "httpFetchedAt": None,
                "httpStatus": None,
                "robotsStatus": "not_checked_local_import",
                "reuseTermsStatus": "not_assessed",
                "reviewStatus": "NOT_REVIEWED_CONTENT_HASH_ONLY",
                "localFileName": "317202.html",
                "htmlBytes": 1024,
                "htmlSha256": "a" * 64,
                "documentTitle": "NIKL Q&A",
                "headings": ["질문 답변"],
                "normalizedTextSha256": "b" * 64,
                "normalizedTextCharCount": 120,
                "contentRetained": False,
                "claimSupportEstablished": False,
                "note": "Metadata only; human claim review remains required.",
            }
        ],
    }


@pytest.fixture
def validator():
    schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
    return Draft202012Validator(schema, format_checker=FormatChecker())


def test_metadata_only_import_manifest_matches_schema(validator):
    manifest = valid_manifest()
    assert not list(validator.iter_errors(manifest))
    assert manifest["sourceCount"] == len(manifest["sources"])


@pytest.mark.parametrize(
    ("path", "value"),
    [
        (("sources", 0, "httpStatus"), 200),
        (("sources", 0, "robotsStatus"), "allowed"),
        (("sources", 0, "reuseTermsStatus"), "verified"),
        (("sources", 0, "reviewStatus"), "REVIEWED"),
        (("sources", 0, "claimSupportEstablished"), True),
        (("sources", 0, "contentRetained"), True),
        (("sources", 0, "normalizedTextSha256"), "not-a-hash"),
        (("sources", 0, "localFileName"), "../private.html"),
    ],
)
def test_manifest_schema_rejects_overstated_provenance_and_unsafe_values(validator, path, value):
    manifest = valid_manifest()
    target = manifest
    for part in path[:-1]:
        target = target[part]
    target[path[-1]] = value
    assert list(validator.iter_errors(manifest)), path


def test_manifest_schema_rejects_raw_page_text_fields(validator):
    manifest = valid_manifest()
    manifest["sources"][0]["pageText"] = "Do not retain copied source text here."
    errors = list(validator.iter_errors(manifest))
    assert any("Additional properties are not allowed" in error.message for error in errors)
