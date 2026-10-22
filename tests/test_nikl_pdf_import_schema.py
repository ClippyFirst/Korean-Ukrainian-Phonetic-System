import json
from copy import deepcopy
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker


ROOT = Path(__file__).resolve().parents[1]
SCHEMA = json.loads((ROOT / "schemas" / "nikl-pdf-import-manifest.schema.json").read_text(encoding="utf-8"))
VALIDATOR = Draft202012Validator(SCHEMA, format_checker=FormatChecker())


def valid_manifest():
    return {
        "schemaVersion": 1,
        "generatedAt": "2026-10-22T12:00:00.000Z",
        "generatedBy": "scripts/nikl-pdf-import.mjs",
        "retentionPolicy": "binary-metadata-and-hashes-only; no PDF bytes or extracted text are copied to this manifest",
        "sourceCount": 1,
        "allSourcesContentReviewed": False,
        "sources": [
            {
                "sourceId": "SRC-NIKL-DOWNLOAD-fc727985-eb6b-493e-9467-221465b7c0a4_0",
                "sourceUrl": "https://korean.go.kr/common/download.do?c_file_name=fc727985-eb6b-493e-9467-221465b7c0a4_0.pdf&file_path=etcData&o_file_name=official.pdf",
                "retrievalMode": "local-pdf-import",
                "importedAt": "2026-10-22T12:00:00.000Z",
                "httpFetchedAt": None,
                "httpStatus": None,
                "robotsStatus": "not_checked_local_import",
                "rightsStatus": "not_assessed",
                "reviewStatus": "NOT_REVIEWED_BINARY_HASH_ONLY",
                "localFileName": "document.pdf",
                "fileBytes": 1024,
                "fileSha256": "a" * 64,
                "pdfVersion": "1.7",
                "hasPdfEofMarker": True,
                "displayFileName": "official.pdf",
                "textExtracted": False,
                "contentRetained": False,
                "claimSupportEstablished": False,
                "note": "Binary metadata only; no claim review has occurred.",
            }
        ],
    }


def test_metadata_only_pdf_manifest_matches_schema():
    manifest = valid_manifest()
    assert not list(VALIDATOR.iter_errors(manifest))


def test_pdf_schema_rejects_overstated_provenance_and_invalid_binary_metadata():
    invalid_cases = [
        (("sources", 0, "httpStatus"), 200),
        (("sources", 0, "rightsStatus"), "cleared"),
        (("sources", 0, "reviewStatus"), "REVIEWED"),
        (("sources", 0, "textExtracted"), True),
        (("sources", 0, "contentRetained"), True),
        (("sources", 0, "claimSupportEstablished"), True),
        (("sources", 0, "fileSha256"), "not-a-hash"),
        (("sources", 0, "pdfVersion"), "not-pdf"),
        (("sources", 0, "localFileName"), "../private.pdf"),
        (("sources", 0, "sourceId"), "SRC-NIKL-DOWNLOAD-not-a-uuid"),
        (("sources", 0, "sourceUrl"), "https://example.org/download.pdf"),
    ]
    for path, value in invalid_cases:
        manifest = deepcopy(valid_manifest())
        target = manifest
        for part in path[:-1]:
            target = target[part]
        target[path[-1]] = value
        assert list(VALIDATOR.iter_errors(manifest)), path


def test_pdf_schema_rejects_raw_extracted_text_fields():
    manifest = valid_manifest()
    manifest["sources"][0]["extractedText"] = "This must never be copied into the manifest."
    errors = list(VALIDATOR.iter_errors(manifest))
    assert any("Additional properties are not allowed" in error.message for error in errors)
